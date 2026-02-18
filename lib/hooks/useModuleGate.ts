// lib/hooks/useModuleGate.ts
// ModuleGate hook — interfață unificată pentru filtrarea pe module active
// Re-exportă useOrgModules din hooks/useOrgModules cu API simplificat
// Primește organization_id din context sau URL

'use client'

export {
  useOrgModules as useModuleGate,
  useHasModule,
  useModuleDefinitions,
} from '@/hooks/useOrgModules'

// Re-export tipuri necesare
export type { ModuleKey } from '@/lib/modules/types'
