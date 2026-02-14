/**
 * Search Indexing Service
 *
 * Provides full-text search functionality using Supabase's PostgreSQL tsvector/tsquery.
 * Supports multi-language stemming and weighted ranking for searchable entities.
 */

import { createSupabaseServer } from '@/lib/supabase/server';

/**
 * Supported entity types for search indexing
 */
export type SearchableEntityType =
  | 'employee'
  | 'training'
  | 'medical_record'
  | 'equipment'
  | 'document'
  | 'alert'
  | 'organization'
  | 'legislation';

/**
 * Searchable fields with content and optional weight
 */
export interface SearchableField {
  field: string;
  value: string;
  weight?: 'A' | 'B' | 'C' | 'D'; // A=1.0, B=0.4, C=0.2, D=0.1
}

/**
 * Search result with ranking
 */
export interface SearchResult {
  entityType: SearchableEntityType;
  entityId: string;
  rank: number;
  snippet?: string;
  metadata?: Record<string, any>;
}

/**
 * Configuration for weighted search fields
 * A = 1.0 (highest priority - names, titles)
 * B = 0.4 (high priority - descriptions)
 * C = 0.2 (medium priority - content, details)
 * D = 0.1 (low priority - tags, notes)
 */
const WEIGHT_CONFIG = {
  name: 'A',
  title: 'A',
  description: 'B',
  content: 'C',
  details: 'C',
  notes: 'D',
  tags: 'D',
} as const;

/**
 * Language configuration for stemming
 * Maps locale codes to PostgreSQL text search configurations
 */
const LANGUAGE_CONFIG: Record<string, string> = {
  ro: 'romanian',
  en: 'english',
  bg: 'simple', // Bulgarian not natively supported, use simple
  hu: 'hungarian',
  de: 'german',
};

/**
 * Get the appropriate text search configuration for a language
 */
function getSearchConfig(locale: string = 'ro'): string {
  return LANGUAGE_CONFIG[locale] || 'simple';
}

/**
 * Build a weighted tsvector from searchable fields
 */
function buildWeightedVector(
  fields: SearchableField[],
  config: string = 'romanian'
): string {
  const vectors = fields.map(({ field, value, weight }) => {
    // Determine weight based on field name if not explicitly provided
    const fieldWeight = weight || WEIGHT_CONFIG[field as keyof typeof WEIGHT_CONFIG] || 'D';

    // Escape single quotes and build tsvector
    const sanitizedValue = value?.toString().replace(/'/g, "''") || '';

    return `setweight(to_tsvector('${config}', '${sanitizedValue}'), '${fieldWeight}')`;
  });

  return vectors.join(' || ');
}

/**
 * Index an entity for full-text search
 *
 * @param entityType - Type of entity being indexed
 * @param entityId - Unique identifier of the entity
 * @param searchableFields - Array of fields to index with optional weights
 * @param organizationId - Organization ID for multi-tenancy
 * @param locale - Language locale for stemming (default: 'ro')
 * @param metadata - Additional metadata to store with the index entry
 *
 * @returns Success boolean
 */
export async function indexEntity(
  entityType: SearchableEntityType,
  entityId: string,
  searchableFields: SearchableField[],
  organizationId: string,
  locale: string = 'ro',
  metadata?: Record<string, any>
): Promise<boolean> {
  try {
    const supabase = createSupabaseServer();
    const config = getSearchConfig(locale);

    // Build the search vector
    const vectorExpression = buildWeightedVector(searchableFields, config);

    // Create concatenated text for snippet generation
    const fullText = searchableFields
      .map(f => f.value)
      .filter(Boolean)
      .join(' ');

    // Upsert into search_index table
    const { error } = await supabase
      .from('search_index')
      .upsert({
        entity_type: entityType,
        entity_id: entityId,
        organization_id: organizationId,
        search_vector: supabase.rpc('build_search_vector', {
          fields: searchableFields.map(f => ({
            value: f.value,
            weight: f.weight || WEIGHT_CONFIG[f.field as keyof typeof WEIGHT_CONFIG] || 'D',
          })),
          config,
        }),
        full_text: fullText.substring(0, 10000), // Limit to 10k chars
        locale,
        metadata: metadata || {},
        indexed_at: new Date().toISOString(),
      }, {
        onConflict: 'entity_type,entity_id',
      });

    if (error) {
      console.error('Error indexing entity:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception in indexEntity:', error);
    return false;
  }
}

/**
 * Remove an entity from the search index
 *
 * @param entityType - Type of entity to remove
 * @param entityId - Unique identifier of the entity
 *
 * @returns Success boolean
 */
export async function removeFromIndex(
  entityType: SearchableEntityType,
  entityId: string
): Promise<boolean> {
  try {
    const supabase = createSupabaseServer();

    const { error } = await supabase
      .from('search_index')
      .delete()
      .eq('entity_type', entityType)
      .eq('entity_id', entityId);

    if (error) {
      console.error('Error removing from index:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception in removeFromIndex:', error);
    return false;
  }
}

/**
 * Perform full-text search across indexed entities
 *
 * @param organizationId - Organization ID to scope search
 * @param query - Search query string
 * @param entityTypes - Optional array of entity types to filter (searches all if not provided)
 * @param limit - Maximum number of results (default: 20)
 * @param locale - Language locale for query processing (default: 'ro')
 *
 * @returns Array of search results with ranking
 */
export async function search(
  organizationId: string,
  query: string,
  entityTypes?: SearchableEntityType[],
  limit: number = 20,
  locale: string = 'ro'
): Promise<SearchResult[]> {
  try {
    const supabase = createSupabaseServer();
    const config = getSearchConfig(locale);

    // Sanitize and prepare search query
    const sanitizedQuery = query
      .trim()
      .replace(/[^\w\s\-]/g, '') // Remove special chars except hyphen
      .split(/\s+/)
      .filter(Boolean)
      .map(term => `${term}:*`) // Add prefix matching
      .join(' & ');

    if (!sanitizedQuery) {
      return [];
    }

    // Build query
    let queryBuilder = supabase
      .from('search_index')
      .select('entity_type, entity_id, full_text, metadata')
      .eq('organization_id', organizationId)
      .textSearch('search_vector', sanitizedQuery, {
        config,
        type: 'websearch',
      })
      .order('rank', { ascending: false })
      .limit(limit);

    // Filter by entity types if provided
    if (entityTypes && entityTypes.length > 0) {
      queryBuilder = queryBuilder.in('entity_type', entityTypes);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error performing search:', error);
      return [];
    }

    // Process results
    const results: SearchResult[] = (data || []).map((row, index) => {
      // Generate snippet with query highlighting context
      const snippet = generateSnippet(row.full_text || '', query, 150);

      return {
        entityType: row.entity_type as SearchableEntityType,
        entityId: row.entity_id,
        rank: 1.0 - (index * 0.05), // Approximate rank based on order
        snippet,
        metadata: row.metadata,
      };
    });

    return results;
  } catch (error) {
    console.error('Exception in search:', error);
    return [];
  }
}

/**
 * Generate a text snippet with context around query terms
 */
function generateSnippet(
  text: string,
  query: string,
  maxLength: number = 150
): string {
  if (!text) return '';

  // Find first occurrence of any query term
  const terms = query.toLowerCase().split(/\s+/);
  const lowerText = text.toLowerCase();

  let firstPos = -1;
  for (const term of terms) {
    const pos = lowerText.indexOf(term);
    if (pos !== -1 && (firstPos === -1 || pos < firstPos)) {
      firstPos = pos;
    }
  }

  // If no match found, return start of text
  if (firstPos === -1) {
    return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '');
  }

  // Calculate snippet bounds with context
  const contextBefore = 50;
  const contextAfter = maxLength - contextBefore;

  let start = Math.max(0, firstPos - contextBefore);
  let end = Math.min(text.length, start + maxLength);

  // Adjust to word boundaries
  if (start > 0) {
    const spacePos = text.indexOf(' ', start);
    if (spacePos !== -1 && spacePos < start + 20) {
      start = spacePos + 1;
    }
  }

  if (end < text.length) {
    const spacePos = text.lastIndexOf(' ', end);
    if (spacePos !== -1 && spacePos > end - 20) {
      end = spacePos;
    }
  }

  const snippet = text.substring(start, end);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < text.length ? '...' : '';

  return prefix + snippet + suffix;
}

/**
 * Batch index multiple entities
 *
 * @param entities - Array of entities to index
 * @returns Number of successfully indexed entities
 */
export async function batchIndexEntities(
  entities: Array<{
    entityType: SearchableEntityType;
    entityId: string;
    searchableFields: SearchableField[];
    organizationId: string;
    locale?: string;
    metadata?: Record<string, any>;
  }>
): Promise<number> {
  let successCount = 0;

  for (const entity of entities) {
    const success = await indexEntity(
      entity.entityType,
      entity.entityId,
      entity.searchableFields,
      entity.organizationId,
      entity.locale,
      entity.metadata
    );

    if (success) {
      successCount++;
    }
  }

  return successCount;
}

/**
 * Reindex all entities of a specific type for an organization
 *
 * @param organizationId - Organization ID
 * @param entityType - Type of entity to reindex
 * @param fetchCallback - Callback function to fetch entities and return searchable fields
 *
 * @returns Number of reindexed entities
 */
export async function reindexEntityType(
  organizationId: string,
  entityType: SearchableEntityType,
  fetchCallback: () => Promise<Array<{
    entityId: string;
    searchableFields: SearchableField[];
    metadata?: Record<string, any>;
  }>>
): Promise<number> {
  try {
    // Fetch entities using callback
    const entities = await fetchCallback();

    // Batch index
    return await batchIndexEntities(
      entities.map(e => ({
        entityType,
        entityId: e.entityId,
        searchableFields: e.searchableFields,
        organizationId,
        metadata: e.metadata,
      }))
    );
  } catch (error) {
    console.error('Exception in reindexEntityType:', error);
    return 0;
  }
}

/**
 * Clear all search index entries for an organization
 *
 * @param organizationId - Organization ID
 * @returns Success boolean
 */
export async function clearOrganizationIndex(
  organizationId: string
): Promise<boolean> {
  try {
    const supabase = createSupabaseServer();

    const { error } = await supabase
      .from('search_index')
      .delete()
      .eq('organization_id', organizationId);

    if (error) {
      console.error('Error clearing organization index:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception in clearOrganizationIndex:', error);
    return false;
  }
}
