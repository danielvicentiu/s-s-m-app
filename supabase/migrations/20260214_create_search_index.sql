-- Migration: Create search index for full-text search across entities
-- Created: 2026-02-14
-- Purpose: Enable fast, locale-aware full-text search for employees, trainings, medical records, equipment, documents, etc.

-- Create search_index table
CREATE TABLE IF NOT EXISTS search_index (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL, -- 'employee', 'training', 'medical_record', 'equipment', 'document', etc.
  entity_id UUID NOT NULL,
  searchable_text TEXT NOT NULL,
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('romanian', coalesce(searchable_text, ''))
  ) STORED,
  locale TEXT NOT NULL DEFAULT 'ro', -- 'ro', 'bg', 'en', 'hu', 'de'
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(org_id, entity_type, entity_id, locale)
);

-- Create GIN index for fast full-text search
CREATE INDEX idx_search_vector ON search_index USING GIN(search_vector);

-- Create composite index for filtering by org and entity type
CREATE INDEX idx_search_org_type ON search_index(org_id, entity_type);

-- Create index for updated_at (useful for incremental updates)
CREATE INDEX idx_search_updated_at ON search_index(updated_at);

-- Enable Row Level Security
ALTER TABLE search_index ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only search within their organization
CREATE POLICY "Users can search their organization data"
  ON search_index
  FOR SELECT
  USING (
    org_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
      AND deleted_at IS NULL
    )
  );

-- Function to update search index entry
CREATE OR REPLACE FUNCTION update_search_index()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete old entry if exists
  DELETE FROM search_index
  WHERE entity_type = TG_ARGV[0]
    AND entity_id = NEW.id
    AND org_id = NEW.organization_id;

  -- Insert new entry (skip if deleted)
  IF NEW.deleted_at IS NULL THEN
    INSERT INTO search_index (
      org_id,
      entity_type,
      entity_id,
      searchable_text,
      locale
    ) VALUES (
      NEW.organization_id,
      TG_ARGV[0],
      NEW.id,
      TG_ARGV[1], -- searchable_text expression passed as argument
      COALESCE(NEW.locale, 'ro')
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search entities with ranking
CREATE OR REPLACE FUNCTION search_entities(
  p_org_id UUID,
  p_query TEXT,
  p_types TEXT[] DEFAULT NULL,
  p_limit INT DEFAULT 50
)
RETURNS TABLE (
  entity_type TEXT,
  entity_id UUID,
  searchable_text TEXT,
  rank REAL,
  locale TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    si.entity_type,
    si.entity_id,
    si.searchable_text,
    ts_rank(si.search_vector, websearch_to_tsquery('romanian', p_query)) AS rank,
    si.locale
  FROM search_index si
  WHERE si.org_id = p_org_id
    AND si.search_vector @@ websearch_to_tsquery('romanian', p_query)
    AND (p_types IS NULL OR si.entity_type = ANY(p_types))
  ORDER BY rank DESC, si.updated_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION search_entities TO authenticated;

-- Example trigger setup for employees table
-- This shows the pattern - replicate for other tables as needed
CREATE TRIGGER trigger_employee_search_index
  AFTER INSERT OR UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_search_index(
    'employee',
    concat_ws(' ',
      NEW.first_name,
      NEW.last_name,
      NEW.email,
      NEW.phone,
      NEW.position,
      NEW.department
    )
  );

-- Example trigger for trainings table
CREATE TRIGGER trigger_training_search_index
  AFTER INSERT OR UPDATE ON trainings
  FOR EACH ROW
  EXECUTE FUNCTION update_search_index(
    'training',
    concat_ws(' ',
      NEW.title,
      NEW.description,
      NEW.trainer,
      NEW.location
    )
  );

-- Example trigger for equipment table
CREATE TRIGGER trigger_equipment_search_index
  AFTER INSERT OR UPDATE ON equipment
  FOR EACH ROW
  EXECUTE FUNCTION update_search_index(
    'equipment',
    concat_ws(' ',
      NEW.name,
      NEW.type,
      NEW.manufacturer,
      NEW.model,
      NEW.serial_number,
      NEW.location
    )
  );

-- Example trigger for documents table
CREATE TRIGGER trigger_document_search_index
  AFTER INSERT OR UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_search_index(
    'document',
    concat_ws(' ',
      NEW.title,
      NEW.description,
      NEW.type,
      NEW.tags::text
    )
  );

-- Example trigger for medical_records table
CREATE TRIGGER trigger_medical_record_search_index
  AFTER INSERT OR UPDATE ON medical_records
  FOR EACH ROW
  EXECUTE FUNCTION update_search_index(
    'medical_record',
    concat_ws(' ',
      NEW.type,
      NEW.medical_center,
      NEW.doctor_name,
      NEW.notes
    )
  );

-- Comment on table and columns
COMMENT ON TABLE search_index IS 'Full-text search index for all searchable entities across the platform';
COMMENT ON COLUMN search_index.entity_type IS 'Type of entity: employee, training, medical_record, equipment, document, etc.';
COMMENT ON COLUMN search_index.entity_id IS 'UUID of the entity in its source table';
COMMENT ON COLUMN search_index.searchable_text IS 'Concatenated searchable fields from the entity';
COMMENT ON COLUMN search_index.search_vector IS 'Generated tsvector for full-text search (Romanian language)';
COMMENT ON COLUMN search_index.locale IS 'Locale for language-specific search configuration';

-- Initial population of search index (run after migration)
-- Uncomment and run manually after verifying table structure:
/*
INSERT INTO search_index (org_id, entity_type, entity_id, searchable_text, locale)
SELECT
  organization_id,
  'employee',
  id,
  concat_ws(' ', first_name, last_name, email, phone, position, department),
  COALESCE(locale, 'ro')
FROM employees
WHERE deleted_at IS NULL;

INSERT INTO search_index (org_id, entity_type, entity_id, searchable_text, locale)
SELECT
  organization_id,
  'training',
  id,
  concat_ws(' ', title, description, trainer, location),
  COALESCE(locale, 'ro')
FROM trainings
WHERE deleted_at IS NULL;

-- Add similar INSERT statements for other tables as needed
*/
