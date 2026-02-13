// app/[locale]/dashboard/calendar/page.tsx
// Calendar Page — Monthly calendar with events from trainings, medical exams, equipment inspections
// Pattern similar to medical/equipment pages

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CalendarClient from './CalendarClient'

export default async function CalendarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createSupabaseServer()
  const { user, orgs, error: authError } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Extract organizations from memberships
  const organizations = (orgs || [])
    .map((m: any) => m.organization)
    .filter(Boolean)

  // If no organizations, redirect to onboarding
  if (organizations.length === 0) {
    redirect('/onboarding')
  }

  // Fetch medical examinations with expiry dates
  const { data: medicalExams } = await supabase
    .from('medical_examinations')
    .select('id, employee_name, examination_type, examination_date, expiry_date, organization_id')
    .order('expiry_date', { ascending: true })

  // Fetch safety equipment with inspection dates
  const { data: equipment } = await supabase
    .from('safety_equipment')
    .select('id, equipment_type, description, location, last_check_date, expiry_date, next_inspection_date, organization_id')
    .order('expiry_date', { ascending: true })

  // Fetch training sessions/records
  const { data: trainings } = await supabase
    .from('training_records')
    .select('id, training_type, training_date, expiry_date, employee_name, organization_id')
    .order('training_date', { ascending: true })

  // Fetch alerts as potential deadlines
  const { data: alerts } = await supabase
    .from('alerts')
    .select('id, alert_type, severity, message, due_date, resolved, organization_id')
    .eq('resolved', false)
    .order('due_date', { ascending: true })

  return (
    <CalendarClient
      user={{ id: user.id, email: user.email || '' }}
      organizations={organizations}
      medicalExams={medicalExams || []}
      equipment={equipment || []}
      trainings={trainings || []}
      alerts={alerts || []}
    />
  )
}
