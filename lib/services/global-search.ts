// ============================================================
// S-S-M.RO — Global Search Service
// File: lib/services/global-search.ts
// ============================================================
// Cross-entity search across employees, trainings, documents, equipment
// with highlighting and relevance scoring

import { createSupabaseBrowser } from '@/lib/supabase/client';
import type { Employee, SafetyEquipment, Document } from '@/lib/types';
import type { TrainingModule } from '@/lib/training-types';

// ============================================================
// TYPES
// ============================================================

export interface GlobalSearchResult {
  employees: EmployeeSearchResult[];
  trainings: TrainingSearchResult[];
  documents: DocumentSearchResult[];
  equipment: EquipmentSearchResult[];
  totalResults: number;
  queryTime: number;
}

export interface EmployeeSearchResult {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  job_title: string | null;
  department: string | null;
  cnp_hash: string | null;
  matchedFields: string[];
  relevanceScore: number;
}

export interface TrainingSearchResult {
  id: string;
  code: string;
  title: string;
  category: string;
  training_type: string;
  instructor_name?: string;
  matchedFields: string[];
  relevanceScore: number;
}

export interface DocumentSearchResult {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_name: string;
  status: string;
  created_at: string;
  matchedFields: string[];
  relevanceScore: number;
}

export interface EquipmentSearchResult {
  id: string;
  equipment_type: string;
  description: string | null;
  location: string | null;
  serial_number: string | null;
  expiry_date: string;
  is_compliant: boolean;
  matchedFields: string[];
  relevanceScore: number;
}

// ============================================================
// DEBOUNCE HELPER
// ============================================================

let searchTimeout: NodeJS.Timeout | null = null;

export function debouncedGlobalSearch(
  orgId: string,
  query: string,
  limit: number = 5,
  delay: number = 300
): Promise<GlobalSearchResult> {
  return new Promise((resolve, reject) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    searchTimeout = setTimeout(async () => {
      try {
        const result = await globalSearch(orgId, query, limit);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, delay);
  });
}

// ============================================================
// MAIN SEARCH FUNCTION
// ============================================================

export async function globalSearch(
  orgId: string,
  query: string,
  limit: number = 5
): Promise<GlobalSearchResult> {
  const startTime = performance.now();

  if (!query || query.trim().length < 2) {
    return {
      employees: [],
      trainings: [],
      documents: [],
      equipment: [],
      totalResults: 0,
      queryTime: 0,
    };
  }

  const supabase = createSupabaseBrowser();
  const searchTerm = query.trim().toLowerCase();

  try {
    // Execute all searches in parallel for performance
    const [employeeResults, trainingResults, documentResults, equipmentResults] = await Promise.all(
      [
        searchEmployees(supabase, orgId, searchTerm, limit),
        searchTrainings(supabase, orgId, searchTerm, limit),
        searchDocuments(supabase, orgId, searchTerm, limit),
        searchEquipment(supabase, orgId, searchTerm, limit),
      ]
    );

    const endTime = performance.now();
    const queryTime = Math.round(endTime - startTime);

    return {
      employees: employeeResults,
      trainings: trainingResults,
      documents: documentResults,
      equipment: equipmentResults,
      totalResults:
        employeeResults.length +
        trainingResults.length +
        documentResults.length +
        equipmentResults.length,
      queryTime,
    };
  } catch (error) {
    console.error('[globalSearch] Error:', error);
    throw new Error('Eroare la căutarea globală');
  }
}

// ============================================================
// ENTITY-SPECIFIC SEARCH FUNCTIONS
// ============================================================

async function searchEmployees(
  supabase: ReturnType<typeof createSupabaseBrowser>,
  orgId: string,
  searchTerm: string,
  limit: number
): Promise<EmployeeSearchResult[]> {
  const { data, error } = await supabase
    .from('employees')
    .select('id, full_name, email, phone, job_title, department, cnp_hash')
    .eq('organization_id', orgId)
    .is('deleted_at', null)
    .eq('is_active', true)
    .or(
      `full_name.ilike.%${searchTerm}%,` +
        `email.ilike.%${searchTerm}%,` +
        `job_title.ilike.%${searchTerm}%,` +
        `department.ilike.%${searchTerm}%,` +
        `phone.ilike.%${searchTerm}%,` +
        `cnp_hash.ilike.%${searchTerm}%`
    )
    .limit(limit);

  if (error) {
    console.error('[searchEmployees] Error:', error);
    return [];
  }

  return (data || [])
    .map((employee: Employee) => {
      const matchedFields: string[] = [];
      let relevanceScore = 0;

      // Check which fields matched and calculate relevance
      if (employee.full_name?.toLowerCase().includes(searchTerm)) {
        matchedFields.push('nume');
        relevanceScore += 10;
        // Exact match gets higher score
        if (employee.full_name.toLowerCase() === searchTerm) {
          relevanceScore += 20;
        }
      }
      if (employee.email?.toLowerCase().includes(searchTerm)) {
        matchedFields.push('email');
        relevanceScore += 8;
      }
      if (employee.job_title?.toLowerCase().includes(searchTerm)) {
        matchedFields.push('funcție');
        relevanceScore += 7;
      }
      if (employee.department?.toLowerCase().includes(searchTerm)) {
        matchedFields.push('departament');
        relevanceScore += 5;
      }
      if (employee.phone?.toLowerCase().includes(searchTerm)) {
        matchedFields.push('telefon');
        relevanceScore += 6;
      }
      if (employee.cnp_hash?.toLowerCase().includes(searchTerm)) {
        matchedFields.push('CNP');
        relevanceScore += 9;
      }

      return {
        ...employee,
        matchedFields,
        relevanceScore,
      };
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}

async function searchTrainings(
  supabase: ReturnType<typeof createSupabaseBrowser>,
  orgId: string,
  searchTerm: string,
  limit: number
): Promise<TrainingSearchResult[]> {
  // Search in training_modules and training_sessions
  const [modulesData, sessionsData] = await Promise.all([
    // Search training modules
    supabase
      .from('training_modules')
      .select('id, code, title, category, training_type')
      .eq('is_active', true)
      .or(
        `title.ilike.%${searchTerm}%,` +
          `code.ilike.%${searchTerm}%,` +
          `category.ilike.%${searchTerm}%,` +
          `training_type.ilike.%${searchTerm}%`
      )
      .limit(limit),

    // Search training sessions by instructor
    supabase
      .from('training_sessions')
      .select(
        'id, module_id, instructor_name, training_modules(id, code, title, category, training_type)'
      )
      .eq('organization_id', orgId)
      .ilike('instructor_name', `%${searchTerm}%`)
      .limit(limit),
  ]);

  const results: TrainingSearchResult[] = [];
  const seenIds = new Set<string>();

  // Process module results
  if (modulesData.data) {
    modulesData.data.forEach((module: TrainingModule) => {
      if (seenIds.has(module.id)) return;
      seenIds.add(module.id);

      const matchedFields: string[] = [];
      let relevanceScore = 0;

      if (module.title?.toLowerCase().includes(searchTerm)) {
        matchedFields.push('titlu');
        relevanceScore += 10;
      }
      if (module.code?.toLowerCase().includes(searchTerm)) {
        matchedFields.push('cod');
        relevanceScore += 8;
      }
      if (module.category?.toLowerCase().includes(searchTerm)) {
        matchedFields.push('categorie');
        relevanceScore += 5;
      }
      if (module.training_type?.toLowerCase().includes(searchTerm)) {
        matchedFields.push('tip');
        relevanceScore += 5;
      }

      results.push({
        id: module.id,
        code: module.code,
        title: module.title,
        category: module.category,
        training_type: module.training_type,
        matchedFields,
        relevanceScore,
      });
    });
  }

  // Process session results (instructor matches)
  if (sessionsData.data) {
    sessionsData.data.forEach(
      (session: { training_modules?: TrainingModule; instructor_name: string }) => {
        if (!session.training_modules) return;
        const trainingModule = session.training_modules;
        if (seenIds.has(trainingModule.id)) return;
        seenIds.add(trainingModule.id);

        results.push({
          id: trainingModule.id,
          code: trainingModule.code,
          title: trainingModule.title,
          category: trainingModule.category,
          training_type: trainingModule.training_type,
          instructor_name: session.instructor_name,
          matchedFields: ['instructor'],
          relevanceScore: 7,
        });
      }
    );
  }

  return results.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, limit);
}

async function searchDocuments(
  supabase: ReturnType<typeof createSupabaseBrowser>,
  orgId: string,
  searchTerm: string,
  limit: number
): Promise<DocumentSearchResult[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('id, title, description, category, file_name, status, created_at')
    .eq('organization_id', orgId)
    .is('deleted_at', null)
    .or(
      `title.ilike.%${searchTerm}%,` +
        `description.ilike.%${searchTerm}%,` +
        `file_name.ilike.%${searchTerm}%,` +
        `category.ilike.%${searchTerm}%`
    )
    .limit(limit)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[searchDocuments] Error:', error);
    return [];
  }

  return (data || [])
    .map((doc: Document) => {
      const matchedFields: string[] = [];
      let relevanceScore = 0;

      if (doc.title?.toLowerCase().includes(searchTerm)) {
        matchedFields.push('titlu');
        relevanceScore += 10;
        if (doc.title.toLowerCase() === searchTerm) {
          relevanceScore += 15;
        }
      }
      if (doc.description?.toLowerCase().includes(searchTerm)) {
        matchedFields.push('descriere');
        relevanceScore += 7;
      }
      if (doc.file_name?.toLowerCase().includes(searchTerm)) {
        matchedFields.push('nume fișier');
        relevanceScore += 8;
      }
      if (doc.category?.toLowerCase().includes(searchTerm)) {
        matchedFields.push('categorie');
        relevanceScore += 5;
      }

      return {
        ...doc,
        matchedFields,
        relevanceScore,
      };
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}

async function searchEquipment(
  supabase: ReturnType<typeof createSupabaseBrowser>,
  orgId: string,
  searchTerm: string,
  limit: number
): Promise<EquipmentSearchResult[]> {
  const { data, error } = await supabase
    .from('safety_equipment')
    .select('id, equipment_type, description, location, serial_number, expiry_date, is_compliant')
    .eq('organization_id', orgId)
    .or(
      `equipment_type.ilike.%${searchTerm}%,` +
        `description.ilike.%${searchTerm}%,` +
        `location.ilike.%${searchTerm}%,` +
        `serial_number.ilike.%${searchTerm}%`
    )
    .limit(limit)
    .order('expiry_date', { ascending: true });

  if (error) {
    console.error('[searchEquipment] Error:', error);
    return [];
  }

  return (data || [])
    .map((equipment: SafetyEquipment) => {
      const matchedFields: string[] = [];
      let relevanceScore = 0;

      if (equipment.equipment_type?.toLowerCase().includes(searchTerm)) {
        matchedFields.push('tip');
        relevanceScore += 8;
      }
      if (equipment.description?.toLowerCase().includes(searchTerm)) {
        matchedFields.push('descriere');
        relevanceScore += 7;
      }
      if (equipment.location?.toLowerCase().includes(searchTerm)) {
        matchedFields.push('locație');
        relevanceScore += 6;
      }
      if (equipment.serial_number?.toLowerCase().includes(searchTerm)) {
        matchedFields.push('serie');
        relevanceScore += 9;
        if (equipment.serial_number.toLowerCase() === searchTerm) {
          relevanceScore += 15;
        }
      }

      return {
        ...equipment,
        matchedFields,
        relevanceScore,
      };
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}

// ============================================================
// HIGHLIGHT UTILITY
// ============================================================

/**
 * Highlights matching text in a string
 * @param text - Text to highlight
 * @param query - Search query
 * @returns Text with <mark> tags around matches
 */
export function highlightMatch(text: string, query: string): string {
  if (!text || !query) return text || '';

  const searchTerm = query.trim();
  const regex = new RegExp(`(${searchTerm})`, 'gi');

  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-900">$1</mark>');
}

/**
 * Gets a snippet of text around the matched term
 * @param text - Full text
 * @param query - Search query
 * @param contextLength - Characters of context before/after match
 * @returns Snippet with ellipsis if truncated
 */
export function getMatchSnippet(text: string, query: string, contextLength: number = 50): string {
  if (!text || !query) return text || '';

  const searchTerm = query.trim().toLowerCase();
  const lowerText = text.toLowerCase();
  const matchIndex = lowerText.indexOf(searchTerm);

  if (matchIndex === -1) return text.slice(0, contextLength * 2) + '...';

  const start = Math.max(0, matchIndex - contextLength);
  const end = Math.min(text.length, matchIndex + searchTerm.length + contextLength);

  let snippet = text.slice(start, end);

  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';

  return snippet;
}
