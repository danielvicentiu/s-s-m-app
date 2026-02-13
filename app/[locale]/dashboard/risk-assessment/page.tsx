// app/[locale]/dashboard/risk-assessment/page.tsx
// Evaluare Riscuri — Pagină dedicată pentru gestionarea riscurilor SSM
// Matrice probabilitate x gravitate, listă riscuri, măsuri de control

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import RiskAssessmentClient from './RiskAssessmentClient'

export default async function RiskAssessmentPage() {
  const supabase = await createSupabaseServer()
  const { user, orgs, error: authError } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Mock data pentru demonstrație - în producție, aceasta va fi înlocuită cu date din Supabase
  // TODO: Când tabela risk_assessments va fi creată în DB, se va face fetch real
  const mockRisks = [
    {
      id: '1',
      organization_id: orgs?.[0]?.organization?.id || '',
      workplace: 'Atelier producție',
      activity_description: 'Operare mașini de frezat',
      risk_description: 'Risc de accidentare prin contact cu organele în mișcare',
      probability: 3 as const,
      severity: 4 as const,
      risk_level: 'ridicat' as const,
      current_measures: 'Protecții mașină, instruire lucrători',
      proposed_measures: 'Instalare senzori de oprire automată, îmbunătățire protecții',
      responsible_person: 'Ion Popescu - Șef producție',
      deadline: '2026-03-15',
      status: 'masuri_planificate' as const,
      created_by: user.id,
      created_at: '2026-02-10T10:00:00Z',
      updated_at: '2026-02-13T14:30:00Z',
    },
    {
      id: '2',
      organization_id: orgs?.[0]?.organization?.id || '',
      workplace: 'Depozit materiale',
      activity_description: 'Depozitare și manipulare chimicale',
      risk_description: 'Expunere la substanțe chimice periculoase',
      probability: 2 as const,
      severity: 5 as const,
      risk_level: 'mediu' as const,
      current_measures: 'Echipament protecție, ventilație naturală',
      proposed_measures: 'Instalare sistem ventilație forțată, fișe de securitate actualizate',
      responsible_person: 'Maria Ionescu - Responsabil depozit',
      deadline: '2026-04-01',
      status: 'in_analiza' as const,
      created_by: user.id,
      created_at: '2026-02-12T09:15:00Z',
      updated_at: '2026-02-12T09:15:00Z',
    },
    {
      id: '3',
      organization_id: orgs?.[0]?.organization?.id || '',
      workplace: 'Birouri administrative',
      activity_description: 'Lucru la calculator',
      risk_description: 'Afecțiuni musculo-scheletice, oboseală vizuală',
      probability: 4 as const,
      severity: 2 as const,
      risk_level: 'mediu' as const,
      current_measures: 'Scaune ergonomice, pauze regulate',
      proposed_measures: 'Suporturi pentru laptop, iluminat îmbunătățit',
      responsible_person: 'Ana Georgescu - Manager HR',
      deadline: '2026-03-30',
      status: 'identificat' as const,
      created_by: user.id,
      created_at: '2026-02-13T08:00:00Z',
      updated_at: '2026-02-13T08:00:00Z',
    },
  ]

  // Fetch organizations pentru filtru
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name, cui')
    .order('name')

  return (
    <RiskAssessmentClient
      user={{ id: user.id, email: user.email || '' }}
      risks={mockRisks}
      organizations={organizations || []}
    />
  )
}
