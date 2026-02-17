-- Migration: UNIQUE constraint on employees(organization_id, cnp_hash)
-- Created: 2026-02-17
-- Purpose: Enables upsert deduplication in import wizard; prevents duplicate CNP per org
--
-- NOTE: In PostgreSQL, UNIQUE constraints treat NULL as distinct from every other NULL,
--       so multiple rows with cnp_hash = NULL are allowed (employees imported without CNP).

ALTER TABLE employees
  ADD CONSTRAINT employees_org_cnp_hash_unique
  UNIQUE (organization_id, cnp_hash);

COMMENT ON CONSTRAINT employees_org_cnp_hash_unique ON employees
  IS 'Unicitate CNP (hashed) per organizație. NULL cnp_hash este permis de mai multe ori (angajați fără CNP).';
