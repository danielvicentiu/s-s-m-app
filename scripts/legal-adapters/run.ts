import 'dotenv/config';

/**
 * CLI entry point for all country legal adapters.
 *
 * Usage:
 *   DRY_RUN=true tsx run.ts --country PL
 *   tsx run.ts --country PL
 *
 * Supported countries: PL
 */

function parseArgs(): { country: string | null } {
  const args = process.argv.slice(2);
  const countryIndex = args.indexOf('--country');
  const country =
    countryIndex !== -1 && args[countryIndex + 1]
      ? args[countryIndex + 1].toUpperCase()
      : null;
  return { country };
}

async function main(): Promise<void> {
  const { country } = parseArgs();

  if (!country) {
    console.error('Usage: tsx run.ts --country <ISO2>');
    console.error('Supported: PL');
    process.exit(1);
  }

  console.log(`Dispatching to adapter for country: ${country}`);

  switch (country) {
    case 'PL': {
      // Dynamically import — pl/run.ts auto-executes on import
      await import('./pl/run.js');
      break;
    }
    default:
      console.error(`No adapter found for country: ${country}`);
      console.error('Supported countries: PL');
      process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
