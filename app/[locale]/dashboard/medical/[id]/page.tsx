// app/[locale]/dashboard/medical/[id]/page.tsx
// Pagină detaliu examen medical individual
// Afișează date complete examen + istoric examene anterioare pentru același angajat

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import MedicalDetailClient from './MedicalDetailClient'

interface PageProps {
  params: Promise<{ locale: string; id: string }>
}

export default async function MedicalDetailPage({ params }: PageProps) {
  const { locale, id } = await params
  const supabase = await createSupabaseServer()

  // Verificare autentificare
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch examenul medical curent
  const { data: exam, error } = await supabase
    .from('medical_examinations')
    .select('*, organizations(name, cui)')
    .eq('id', id)
    .single()

  if (error || !exam) {
    notFound()
  }

  // Fetch istoric examene pentru același angajat (dacă există employee_id)
  let examHistory: any[] = []
  if (exam.employee_id) {
    const { data: history } = await supabase
      .from('medical_examinations')
      .select('id, examination_type, examination_date, expiry_date, result, restrictions, doctor_name, clinic_name')
      .eq('employee_id', exam.employee_id)
      .neq('id', id) // exclude examenul curent
      .order('examination_date', { ascending: false })
      .limit(10)

    examHistory = history || []
  } else if (exam.cnp_hash) {
    // Fallback: căutare după CNP hash dacă nu există employee_id
    const { data: history } = await supabase
      .from('medical_examinations')
      .select('id, examination_type, examination_date, expiry_date, result, restrictions, doctor_name, clinic_name')
      .eq('cnp_hash', exam.cnp_hash)
      .neq('id', id)
      .order('examination_date', { ascending: false })
      .limit(10)

    examHistory = history || []
  }

  return (
    <MedicalDetailClient
      exam={exam}
      examHistory={examHistory}
      locale={locale}
    />
  )
}
