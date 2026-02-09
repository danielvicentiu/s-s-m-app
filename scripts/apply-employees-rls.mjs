#!/usr/bin/env node
/**
 * Script pentru aplicarea migrației RLS pe tabela employees
 * Rulează: node scripts/apply-employees-rls.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Citește credențialele din .env.local
const envContent = readFileSync(join(__dirname, '..', '.env.local'), 'utf-8')
const SUPABASE_URL = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim()
const SERVICE_ROLE_KEY = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim()

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Nu am găsit SUPABASE_URL sau SERVICE_ROLE_KEY în .env.local')
  process.exit(1)
}

// Crează client Supabase cu service role (bypass RLS)
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Citește migrația SQL
const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20260208_fix_employees_rls.sql')
const migrationSQL = readFileSync(migrationPath, 'utf-8')

console.log('📋 Aplicare migrație: 20260208_fix_employees_rls.sql')
console.log('─'.repeat(60))

// Împarte SQL-ul în statement-uri individuale (split by GO sau ; la final de linie)
const statements = migrationSQL
  .split(/;\s*$/gm)
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'))

console.log(`📊 ${statements.length} statement-uri SQL de executat\n`)

// Execută fiecare statement
let successCount = 0
let errorCount = 0

for (let i = 0; i < statements.length; i++) {
  const statement = statements[i] + ';'
  const preview = statement.substring(0, 80).replace(/\s+/g, ' ')

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql: statement })

    if (error) {
      // Încearcă metoda alternativă cu POST direct
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'apikey': SERVICE_ROLE_KEY
        },
        body: JSON.stringify({ query: statement })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`)
      }

      console.log(`✓ [${i + 1}/${statements.length}] ${preview}...`)
      successCount++
    } else {
      console.log(`✓ [${i + 1}/${statements.length}] ${preview}...`)
      successCount++
    }
  } catch (err) {
    console.error(`✗ [${i + 1}/${statements.length}] ${preview}...`)
    console.error(`   Eroare: ${err.message}`)
    errorCount++
  }
}

console.log('\n' + '─'.repeat(60))
console.log(`✅ ${successCount} statement-uri executate cu succes`)
if (errorCount > 0) {
  console.log(`❌ ${errorCount} statement-uri cu erori`)
  console.log('\n⚠️  NOTĂ: Unele erori pot fi normale (ex: DROP POLICY pe politici inexistente)')
}

console.log('\n📝 Următorii pași:')
console.log('1. Verifică în Supabase Dashboard → Database → Policies că politicile există')
console.log('2. Testează în browser: deschide /ro/dashboard și verifică Console (F12)')
console.log('3. Angajații ar trebui să apară acum în tab-ul "Angajați"')

process.exit(errorCount > 0 ? 1 : 0)
