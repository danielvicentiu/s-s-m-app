import 'dotenv/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { LegalActImport } from './types.js';

// Lazy singleton — client is created on first use so DRY_RUN never needs the env vars
let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing required env vars: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env'
    );
  }

  // Admin client — bypasses RLS, use only in server-side scripts
  _client = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return _client;
}

/**
 * Upsert a single legal act.
 * Conflict key: eli_uri (required for all PL acts from Sejm ELI).
 */
export async function upsertLegalAct(act: LegalActImport): Promise<void> {
  const client = getClient();

  const { error } = await client
    .from('legal_acts')
    .upsert(act, {
      onConflict: act.eli_uri ? 'eli_uri' : 'country,number,year',
    });

  if (error) {
    throw new Error(`Supabase upsert failed for ${act.eli_uri ?? act.number}: ${error.message}`);
  }
}

/**
 * Upsert multiple legal acts in a single batch.
 */
export async function upsertLegalActsBatch(acts: LegalActImport[]): Promise<void> {
  if (acts.length === 0) return;

  const client = getClient();

  const { error } = await client
    .from('legal_acts')
    .upsert(acts, {
      onConflict: 'eli_uri',
    });

  if (error) {
    throw new Error(`Supabase batch upsert failed: ${error.message}`);
  }
}
