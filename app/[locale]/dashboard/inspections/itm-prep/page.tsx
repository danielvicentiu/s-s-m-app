// app/[locale]/dashboard/inspections/itm-prep/page.tsx
// ITM Inspection Preparation — Checklist complet cu verificare automată
// Auto-check existență documente, instruiri la zi, evaluări riscuri

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ITMPrepClient from './ITMPrepClient'

export default async function ITMPrepPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createSupabaseServer()
  const { user, orgs, error: authError } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Fetch organizations with details
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name, cui, employee_count')
    .order('name')

  // Fetch existing documents to check completeness
  const { data: documents } = await supabase
    .from('generated_documents')
    .select('organization_id, document_type, created_at, file_name')

  // Fetch trainings to check if up-to-date
  const { data: trainings } = await supabase
    .from('trainings')
    .select('organization_id, training_type, training_date, next_training_date, employee_id')

  // Fetch medical examinations for compliance check
  const { data: medicalExams } = await supabase
    .from('medical_examinations')
    .select('organization_id, expiry_date, result')
    .gte('expiry_date', new Date().toISOString().split('T')[0])

  // Fetch equipment for PSI compliance
  const { data: equipment } = await supabase
    .from('safety_equipment')
    .select('organization_id, equipment_type, expiry_date, is_compliant')

  // Fetch employees count per org
  const { data: employees } = await supabase
    .from('employees')
    .select('organization_id, id')

  // Fetch user profile for auditor name
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  return (
    <ITMPrepClient
      user={{
        id: user.id,
        email: user.email || '',
        fullName: profile?.full_name || user.email || 'Utilizator'
      }}
      organizations={organizations || []}
      documents={documents || []}
      trainings={trainings || []}
      medicalExams={medicalExams || []}
      equipment={equipment || []}
      employees={employees || []}
    />
  )
}
