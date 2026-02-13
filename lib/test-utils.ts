// ============================================================
// S-S-M.RO — Test Utilities
// File: lib/test-utils.ts
// Utilities for testing with Supabase mocks and React Testing Library
// ============================================================

import { SupabaseClient } from '@supabase/supabase-js'
import {
  Organization,
  Profile,
  Membership,
  MedicalExamination,
  SafetyEquipment,
} from './types'
import {
  TrainingModule,
  TrainingAssignment,
  TrainingSession,
  TrainingCategory,
  TrainingType,
  AssignmentStatus,
  VerificationResult,
} from './training-types'

// ============================================================
// MOCK SUPABASE CLIENT
// ============================================================

export interface MockSupabaseResponse<T> {
  data: T | null
  error: { message: string; code?: string } | null
}

export interface MockSupabaseQuery<T> {
  select: (columns?: string) => MockSupabaseQuery<T>
  insert: (data: any) => MockSupabaseQuery<T>
  update: (data: any) => MockSupabaseQuery<T>
  delete: () => MockSupabaseQuery<T>
  eq: (column: string, value: any) => MockSupabaseQuery<T>
  neq: (column: string, value: any) => MockSupabaseQuery<T>
  gt: (column: string, value: any) => MockSupabaseQuery<T>
  gte: (column: string, value: any) => MockSupabaseQuery<T>
  lt: (column: string, value: any) => MockSupabaseQuery<T>
  lte: (column: string, value: any) => MockSupabaseQuery<T>
  in: (column: string, values: any[]) => MockSupabaseQuery<T>
  is: (column: string, value: any) => MockSupabaseQuery<T>
  order: (column: string, options?: { ascending?: boolean }) => MockSupabaseQuery<T>
  limit: (count: number) => MockSupabaseQuery<T>
  single: () => Promise<MockSupabaseResponse<T>>
  maybeSingle: () => Promise<MockSupabaseResponse<T>>
  then: (
    onfulfilled?: ((value: MockSupabaseResponse<T[]>) => any) | null,
    onrejected?: ((reason: any) => any) | null
  ) => Promise<any>
}

export function createMockSupabaseQuery<T>(
  mockData: T[] | T | null,
  mockError: { message: string; code?: string } | null = null
): MockSupabaseQuery<T> {
  const query: MockSupabaseQuery<T> = {
    select: () => query,
    insert: () => query,
    update: () => query,
    delete: () => query,
    eq: () => query,
    neq: () => query,
    gt: () => query,
    gte: () => query,
    lt: () => query,
    lte: () => query,
    in: () => query,
    is: () => query,
    order: () => query,
    limit: () => query,
    single: async () => ({
      data: Array.isArray(mockData) ? mockData[0] || null : mockData,
      error: mockError,
    }),
    maybeSingle: async () => ({
      data: Array.isArray(mockData) ? mockData[0] || null : mockData,
      error: mockError,
    }),
    then: async (onfulfilled) => {
      const result = {
        data: Array.isArray(mockData) ? mockData : mockData ? [mockData] : [],
        error: mockError,
      }
      return onfulfilled ? onfulfilled(result) : result
    },
  }
  return query
}

export function mockSupabaseClient(overrides?: {
  mockData?: any
  mockError?: { message: string; code?: string } | null
}): Partial<SupabaseClient> {
  const { mockData = [], mockError = null } = overrides || {}

  return {
    from: (table: string) => createMockSupabaseQuery(mockData, mockError) as any,
    auth: {
      getUser: async () => ({
        data: { user: mockUser() },
        error: null,
      }),
      signIn: async () => ({
        data: { user: mockUser(), session: null },
        error: null,
      }),
      signOut: async () => ({ error: null }),
    } as any,
  }
}

// ============================================================
// MOCK USER (PROFILE)
// ============================================================

export function mockUser(overrides?: Partial<Profile>): Profile {
  const timestamp = new Date().toISOString()
  return {
    id: overrides?.id || 'user-test-001',
    full_name: overrides?.full_name || 'Test User',
    phone: overrides?.phone || '+40712345678',
    avatar_url: overrides?.avatar_url || null,
    created_at: overrides?.created_at || timestamp,
    ...overrides,
  }
}

// ============================================================
// MOCK ORGANIZATION
// ============================================================

export function mockOrganization(overrides?: Partial<Organization>): Organization {
  const timestamp = new Date().toISOString()
  return {
    id: overrides?.id || 'org-test-001',
    name: overrides?.name || 'Test Organization SRL',
    cui: overrides?.cui || 'RO12345678',
    address: overrides?.address || 'Str. Test Nr. 1, București',
    county: overrides?.county || 'București',
    contact_email: overrides?.contact_email || 'contact@test.ro',
    contact_phone: overrides?.contact_phone || '+40211234567',
    data_completeness: overrides?.data_completeness ?? 75,
    employee_count: overrides?.employee_count ?? 10,
    exposure_score: overrides?.exposure_score || 'mediu',
    preferred_channels: overrides?.preferred_channels || ['email', 'whatsapp'],
    cooperation_status: overrides?.cooperation_status || 'active',
    created_at: overrides?.created_at || timestamp,
    updated_at: overrides?.updated_at || timestamp,
    ...overrides,
  }
}

// ============================================================
// MOCK MEMBERSHIP
// ============================================================

export function mockMembership(overrides?: Partial<Membership>): Membership {
  const timestamp = new Date().toISOString()
  return {
    id: overrides?.id || 'membership-test-001',
    user_id: overrides?.user_id || 'user-test-001',
    organization_id: overrides?.organization_id || 'org-test-001',
    role: overrides?.role || 'firma_admin',
    is_active: overrides?.is_active ?? true,
    joined_at: overrides?.joined_at || timestamp,
    ...overrides,
  }
}

// ============================================================
// MOCK EMPLOYEE (via MedicalExamination as there's no Employee table)
// ============================================================

export function createMockEmployee(overrides?: Partial<MedicalExamination>): MedicalExamination {
  const timestamp = new Date().toISOString()
  const examinationDate = new Date()
  const expiryDate = new Date(examinationDate)
  expiryDate.setFullYear(expiryDate.getFullYear() + 1) // 1 year validity

  return {
    id: overrides?.id || `medical-exam-${Date.now()}`,
    organization_id: overrides?.organization_id || 'org-test-001',
    employee_name: overrides?.employee_name || 'Angajat Test',
    cnp_hash: overrides?.cnp_hash || null,
    job_title: overrides?.job_title || 'Programator',
    examination_type: overrides?.examination_type || 'periodic',
    examination_date: overrides?.examination_date || examinationDate.toISOString().split('T')[0],
    expiry_date: overrides?.expiry_date || expiryDate.toISOString().split('T')[0],
    result: overrides?.result || 'apt',
    restrictions: overrides?.restrictions || null,
    doctor_name: overrides?.doctor_name || 'Dr. Popescu Ion',
    clinic_name: overrides?.clinic_name || 'Clinica Test',
    notes: overrides?.notes || null,
    content_version: overrides?.content_version ?? 1,
    legal_basis_version: overrides?.legal_basis_version || '1.0',
    created_at: overrides?.created_at || timestamp,
    updated_at: overrides?.updated_at || timestamp,
    ...overrides,
  }
}

// ============================================================
// MOCK TRAINING MODULE
// ============================================================

export function createMockTrainingModule(overrides?: Partial<TrainingModule>): TrainingModule {
  const timestamp = new Date().toISOString()
  return {
    id: overrides?.id || `module-${Date.now()}`,
    code: overrides?.code || 'SSM-GEN-001',
    title: overrides?.title || 'Instructaj General SSM',
    description: overrides?.description || 'Instructaj general de securitate și sănătate în muncă',
    category: overrides?.category || 'ssm',
    training_type: overrides?.training_type || 'introductiv_general',
    legal_basis: overrides?.legal_basis || ['Legea 319/2006'],
    duration_minutes_required: overrides?.duration_minutes_required ?? 120,
    periodicity_months: overrides?.periodicity_months ?? 12,
    is_mandatory: overrides?.is_mandatory ?? true,
    is_active: overrides?.is_active ?? true,
    min_test_questions: overrides?.min_test_questions ?? 10,
    min_pass_score: overrides?.min_pass_score ?? 70,
    content_json: overrides?.content_json || null,
    available_languages: overrides?.available_languages || ['ro'],
    applicable_risk_categories: overrides?.applicable_risk_categories || ['general'],
    created_at: overrides?.created_at || timestamp,
    updated_at: overrides?.updated_at || timestamp,
    ...overrides,
  }
}

// ============================================================
// MOCK TRAINING ASSIGNMENT
// ============================================================

export function createMockTrainingAssignment(
  overrides?: Partial<TrainingAssignment>
): TrainingAssignment {
  const timestamp = new Date().toISOString()
  const dueDate = new Date()
  dueDate.setMonth(dueDate.getMonth() + 1) // 1 month from now

  return {
    id: overrides?.id || `assignment-${Date.now()}`,
    organization_id: overrides?.organization_id || 'org-test-001',
    worker_id: overrides?.worker_id || 'worker-test-001',
    module_id: overrides?.module_id || 'module-test-001',
    assigned_by: overrides?.assigned_by || 'user-test-001',
    assigned_at: overrides?.assigned_at || timestamp,
    due_date: overrides?.due_date || dueDate.toISOString().split('T')[0],
    status: overrides?.status || 'assigned',
    completed_at: overrides?.completed_at || null,
    session_id: overrides?.session_id || null,
    next_due_date: overrides?.next_due_date || null,
    notes: overrides?.notes || null,
    created_at: overrides?.created_at || timestamp,
    updated_at: overrides?.updated_at || timestamp,
    ...overrides,
  }
}

// ============================================================
// MOCK TRAINING SESSION
// ============================================================

export function createMockTrainingSession(overrides?: Partial<TrainingSession>): TrainingSession {
  const timestamp = new Date().toISOString()
  const sessionDate = new Date().toISOString().split('T')[0]

  return {
    id: overrides?.id || `session-${Date.now()}`,
    organization_id: overrides?.organization_id || 'org-test-001',
    module_id: overrides?.module_id || 'module-test-001',
    worker_id: overrides?.worker_id || 'worker-test-001',
    instructor_name: overrides?.instructor_name || 'Instructor Test',
    session_date: overrides?.session_date || sessionDate,
    duration_minutes: overrides?.duration_minutes ?? 120,
    language: overrides?.language || 'ro',
    location: overrides?.location || 'Sala Training',
    test_score: overrides?.test_score ?? 85,
    test_questions_total: overrides?.test_questions_total ?? 10,
    test_questions_correct: overrides?.test_questions_correct ?? 8,
    verification_result: overrides?.verification_result || 'admis',
    fisa_document_id: overrides?.fisa_document_id || null,
    fisa_generated_at: overrides?.fisa_generated_at || null,
    quickvalid_timestamp: overrides?.quickvalid_timestamp || null,
    quickvalid_confidence: overrides?.quickvalid_confidence || null,
    quickvalid_photo_url: overrides?.quickvalid_photo_url || null,
    audit_trail: overrides?.audit_trail || null,
    created_at: overrides?.created_at || timestamp,
    updated_at: overrides?.updated_at || timestamp,
    ...overrides,
  }
}

// ============================================================
// MOCK TRAINING (convenience function for full training data)
// ============================================================

export interface MockTrainingData {
  module: TrainingModule
  assignment: TrainingAssignment
  session?: TrainingSession
}

export function createMockTraining(overrides?: {
  module?: Partial<TrainingModule>
  assignment?: Partial<TrainingAssignment>
  session?: Partial<TrainingSession>
}): MockTrainingData {
  const moduleId = overrides?.module?.id || `module-${Date.now()}`
  const workerId = overrides?.assignment?.worker_id || 'worker-test-001'
  const organizationId = overrides?.assignment?.organization_id || 'org-test-001'

  const module = createMockTrainingModule({
    id: moduleId,
    ...overrides?.module,
  })

  const assignment = createMockTrainingAssignment({
    module_id: moduleId,
    worker_id: workerId,
    organization_id: organizationId,
    ...overrides?.assignment,
  })

  const session = overrides?.session
    ? createMockTrainingSession({
        module_id: moduleId,
        worker_id: workerId,
        organization_id: organizationId,
        ...overrides.session,
      })
    : undefined

  return { module, assignment, session }
}

// ============================================================
// MOCK SAFETY EQUIPMENT
// ============================================================

export function createMockEquipment(overrides?: Partial<SafetyEquipment>): SafetyEquipment {
  const timestamp = new Date().toISOString()
  const lastInspection = new Date()
  const expiryDate = new Date(lastInspection)
  expiryDate.setFullYear(expiryDate.getFullYear() + 1) // 1 year validity

  return {
    id: overrides?.id || `equipment-${Date.now()}`,
    organization_id: overrides?.organization_id || 'org-test-001',
    equipment_type: overrides?.equipment_type || 'stingator',
    description: overrides?.description || 'Stingător P6',
    location: overrides?.location || 'Etaj 1, lângă scară',
    serial_number: overrides?.serial_number || `SN-${Date.now()}`,
    last_inspection_date: overrides?.last_inspection_date || lastInspection.toISOString().split('T')[0],
    expiry_date: overrides?.expiry_date || expiryDate.toISOString().split('T')[0],
    next_inspection_date: overrides?.next_inspection_date || expiryDate.toISOString().split('T')[0],
    inspector_name: overrides?.inspector_name || 'Inspector Test',
    is_compliant: overrides?.is_compliant ?? true,
    notes: overrides?.notes || null,
    content_version: overrides?.content_version ?? 1,
    legal_basis_version: overrides?.legal_basis_version || '1.0',
    created_at: overrides?.created_at || timestamp,
    updated_at: overrides?.updated_at || timestamp,
    ...overrides,
  }
}

// ============================================================
// RENDER WITH PROVIDERS (for React Testing Library)
// ============================================================

/**
 * Wrapper for rendering React components with necessary providers
 * Usage with React Testing Library:
 *
 * import { render } from '@testing-library/react'
 * import { renderWithProviders } from '@/lib/test-utils'
 *
 * const { getByText } = renderWithProviders(<MyComponent />)
 */

export interface RenderWithProvidersOptions {
  initialUser?: Profile | null
  initialOrganization?: Organization | null
  supabaseClient?: Partial<SupabaseClient>
  locale?: string
}

/**
 * Note: This is a placeholder for when testing libraries are installed.
 * To use this, install: @testing-library/react @testing-library/jest-dom
 *
 * Then implement proper provider wrappers (IntlProvider, SupabaseContext, etc.)
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options?: RenderWithProvidersOptions
) {
  // TODO: Implement when React Testing Library is set up
  // This would wrap the component with:
  // - NextIntlClientProvider (for translations)
  // - Supabase context provider (if needed)
  // - Any other necessary providers

  console.warn('renderWithProviders requires @testing-library/react to be installed')
  return ui
}

// ============================================================
// TEST HELPERS
// ============================================================

/**
 * Creates a date string in YYYY-MM-DD format
 */
export function createDateString(daysFromNow: number = 0): string {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return date.toISOString().split('T')[0]
}

/**
 * Creates an array of mock items using a factory function
 */
export function createMockArray<T>(
  factory: (index: number) => T,
  count: number = 3
): T[] {
  return Array.from({ length: count }, (_, index) => factory(index))
}

/**
 * Wait for a specified number of milliseconds (useful in tests)
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
