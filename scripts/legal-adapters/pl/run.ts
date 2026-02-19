import 'dotenv/config';
import { bhpActs } from './bhp-acts.js';
import { fetchAct, fetchActHtml, mapToLegalAct } from './adapter.js';
import { upsertLegalAct } from '../common/supabaseClient.js';
import type { LegalActImport } from '../common/types.js';

const DRY_RUN = process.env.DRY_RUN === 'true';
const DELAY_MS = 1000; // 1 second between requests — be polite to the API

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run(): Promise<void> {
  console.log(`\n🇵🇱  Polish BHP Legal Adapter — Sejm ELI API`);
  console.log(`   Mode: ${DRY_RUN ? 'DRY RUN (no DB writes)' : 'LIVE (will upsert to Supabase)'}`);
  console.log(`   Acts to process: ${bhpActs.length}\n`);

  const results: { eli: string; status: 'ok' | 'error'; error?: string }[] = [];

  for (let i = 0; i < bhpActs.length; i++) {
    const ref = bhpActs[i];
    const prefix = `[${i + 1}/${bhpActs.length}]`;

    console.log(`${prefix} Fetching metadata: ${ref.eli}`);

    try {
      // Fetch metadata JSON
      const raw = await fetchAct(ref.eli);
      console.log(`  ✓ Metadata OK — title: "${raw.title ?? '(no title)'}"`);

      // Fetch full text HTML
      console.log(`  Fetching full text HTML...`);
      const fullText = await fetchActHtml(ref.eli);
      if (fullText) {
        console.log(`  ✓ HTML OK — ${fullText.length.toLocaleString()} chars`);
      } else {
        console.log(`  ✗ HTML not available`);
      }

      // Map to our schema
      const act: LegalActImport = mapToLegalAct(raw, ref, fullText);

      if (DRY_RUN) {
        console.log(`  [DRY RUN] Would upsert:`);
        console.log(JSON.stringify(act, null, 2));
      } else {
        await upsertLegalAct(act);
        console.log(`  ✓ Upserted to Supabase: ${act.eli_uri}`);
      }

      results.push({ eli: ref.eli, status: 'ok' });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ ERROR: ${message}`);
      results.push({ eli: ref.eli, status: 'error', error: message });
    }

    // Delay between requests (skip after last one)
    if (i < bhpActs.length - 1) {
      console.log(`  Waiting ${DELAY_MS}ms...\n`);
      await sleep(DELAY_MS);
    }
  }

  // Summary
  const ok = results.filter((r) => r.status === 'ok').length;
  const errors = results.filter((r) => r.status === 'error').length;

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`Summary: ${ok} succeeded, ${errors} failed`);

  if (errors > 0) {
    console.log('\nFailed acts:');
    results
      .filter((r) => r.status === 'error')
      .forEach((r) => console.log(`  - ${r.eli}: ${r.error}`));
    process.exit(1);
  }

  console.log('\nDone.');
}

export default run;

// Run immediately when executed directly
run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
