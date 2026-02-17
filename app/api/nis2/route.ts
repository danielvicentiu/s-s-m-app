// app/api/nis2/route.ts
// NIS2 Assessments — GET list, POST create (with pre-populated checklist)

import { createSupabaseServer } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_CHECKLIST_ITEMS = [
  // Governance
  { category: 'governance', item_code: 'GOV-01', item_text: 'Politică de securitate cibernetică aprobată de management', priority: 'high' },
  { category: 'governance', item_code: 'GOV-02', item_text: 'Responsabil NIS2 desemnat (CISO sau echivalent)', priority: 'high' },
  { category: 'governance', item_code: 'GOV-03', item_text: 'Buget alocat pentru securitate cibernetică', priority: 'medium' },
  { category: 'governance', item_code: 'GOV-04', item_text: 'Raportare periodică către conducere', priority: 'medium' },
  // Risk Management
  { category: 'risk_management', item_code: 'RM-01', item_text: 'Evaluare de risc cibernetic efectuată', priority: 'high' },
  { category: 'risk_management', item_code: 'RM-02', item_text: 'Registru de riscuri actualizat', priority: 'high' },
  { category: 'risk_management', item_code: 'RM-03', item_text: 'Măsuri de tratare a riscurilor implementate', priority: 'high' },
  // Incident Handling
  { category: 'incident_handling', item_code: 'IH-01', item_text: 'Procedură de raportare incidente (24h/72h)', priority: 'critical' },
  { category: 'incident_handling', item_code: 'IH-02', item_text: 'Echipă de răspuns la incidente desemnată', priority: 'high' },
  { category: 'incident_handling', item_code: 'IH-03', item_text: 'Plan de comunicare în caz de incident', priority: 'high' },
  { category: 'incident_handling', item_code: 'IH-04', item_text: 'Exerciții de simulare efectuate', priority: 'medium' },
  // Business Continuity
  { category: 'business_continuity', item_code: 'BC-01', item_text: 'Plan de continuitate a afacerii documentat', priority: 'high' },
  { category: 'business_continuity', item_code: 'BC-02', item_text: 'Backup-uri regulate testate', priority: 'high' },
  { category: 'business_continuity', item_code: 'BC-03', item_text: 'Plan de recuperare în caz de dezastru (DRP)', priority: 'high' },
  { category: 'business_continuity', item_code: 'BC-04', item_text: 'Timp de recuperare definit (RTO/RPO)', priority: 'medium' },
  // Supply Chain
  { category: 'supply_chain', item_code: 'SC-01', item_text: 'Evaluarea securității furnizorilor', priority: 'high' },
  { category: 'supply_chain', item_code: 'SC-02', item_text: 'Clauze de securitate în contracte', priority: 'medium' },
  { category: 'supply_chain', item_code: 'SC-03', item_text: 'Monitorizare furnizori critici', priority: 'high' },
  // Network Security
  { category: 'network_security', item_code: 'NS-01', item_text: 'Firewall și segmentare rețea', priority: 'high' },
  { category: 'network_security', item_code: 'NS-02', item_text: 'Monitorizare trafic rețea', priority: 'medium' },
  { category: 'network_security', item_code: 'NS-03', item_text: 'VPN pentru acces la distanță', priority: 'high' },
  { category: 'network_security', item_code: 'NS-04', item_text: 'Securitate Wi-Fi', priority: 'medium' },
  // Vulnerability Management
  { category: 'vulnerability_management', item_code: 'VM-01', item_text: 'Scanări de vulnerabilități periodice', priority: 'high' },
  { category: 'vulnerability_management', item_code: 'VM-02', item_text: 'Proces de patch management', priority: 'high' },
  { category: 'vulnerability_management', item_code: 'VM-03', item_text: 'Teste de penetrare anuale', priority: 'medium' },
  // Cryptography
  { category: 'crypto_encryption', item_code: 'CR-01', item_text: 'Criptare date în tranzit (TLS/SSL)', priority: 'critical' },
  { category: 'crypto_encryption', item_code: 'CR-02', item_text: 'Criptare date în repaus', priority: 'high' },
  { category: 'crypto_encryption', item_code: 'CR-03', item_text: 'Gestiune chei criptografice', priority: 'high' },
  // HR Security
  { category: 'hr_security', item_code: 'HR-01', item_text: 'Verificare background angajați cu acces la sisteme critice', priority: 'medium' },
  { category: 'hr_security', item_code: 'HR-02', item_text: 'Proceduri de revocare acces la plecare', priority: 'high' },
  { category: 'hr_security', item_code: 'HR-03', item_text: 'Acorduri de confidențialitate', priority: 'medium' },
  // Access Control
  { category: 'access_control', item_code: 'AC-01', item_text: 'Autentificare multi-factor (MFA)', priority: 'critical' },
  { category: 'access_control', item_code: 'AC-02', item_text: 'Principiul privilegiului minim', priority: 'high' },
  { category: 'access_control', item_code: 'AC-03', item_text: 'Revizuire periodică a drepturilor de acces', priority: 'high' },
  { category: 'access_control', item_code: 'AC-04', item_text: 'Gestiune conturi privilegiate', priority: 'high' },
  // Asset Management
  { category: 'asset_management', item_code: 'AM-01', item_text: 'Inventar active IT actualizat', priority: 'high' },
  { category: 'asset_management', item_code: 'AM-02', item_text: 'Clasificare date pe nivel de sensibilitate', priority: 'medium' },
  { category: 'asset_management', item_code: 'AM-03', item_text: 'Proceduri de ștergere securizată', priority: 'medium' },
  // Training & Awareness
  { category: 'training_awareness', item_code: 'TA-01', item_text: 'Program de conștientizare securitate cibernetică', priority: 'high' },
  { category: 'training_awareness', item_code: 'TA-02', item_text: 'Training periodic angajați (phishing, social engineering)', priority: 'high' },
  { category: 'training_awareness', item_code: 'TA-03', item_text: 'Exerciții practice de securitate', priority: 'medium' },
]

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
    }

    const orgId = request.nextUrl.searchParams.get('org_id')

    let query = supabase
      .from('nis2_assessments')
      .select('*')
      .order('created_at', { ascending: false })

    if (orgId) {
      query = query.eq('organization_id', orgId)
    }

    const { data, error } = await query
    if (error) {
      console.error('Error fetching NIS2 assessments:', error)
      return NextResponse.json({ error: 'Eroare la încărcarea datelor' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Eroare internă' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
    }

    const body = await request.json()

    // Get user's organization if not provided
    let organizationId = body.organization_id
    if (!organizationId) {
      const { data: membership } = await supabase
        .from('memberships')
        .select('organization_id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single()
      if (!membership) {
        return NextResponse.json({ error: 'Organizație negăsită' }, { status: 404 })
      }
      organizationId = membership.organization_id
    }

    // Create assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from('nis2_assessments')
      .insert({
        organization_id: organizationId,
        assessment_date: body.assessment_date || new Date().toISOString().split('T')[0],
        nis2_category: body.nis2_category || 'important',
        sector: body.sector || null,
        sub_sector: body.sub_sector || null,
        employee_count_range: body.employee_count_range || null,
        annual_turnover_range: body.annual_turnover_range || null,
        overall_score: 0,
        status: 'draft',
        notes: body.notes || null,
      })
      .select()
      .single()

    if (assessmentError) {
      console.error('Error creating NIS2 assessment:', assessmentError)
      return NextResponse.json({ error: 'Eroare la creare evaluare' }, { status: 500 })
    }

    // Pre-populate checklist items
    const checklistItems = DEFAULT_CHECKLIST_ITEMS.map(item => ({
      assessment_id: assessment.id,
      ...item,
      is_compliant: false,
    }))

    const { error: checklistError } = await supabase
      .from('nis2_checklist_items')
      .insert(checklistItems)

    if (checklistError) {
      console.error('Error creating checklist items:', checklistError)
      // Don't fail — assessment was created, checklist can be retried
    }

    return NextResponse.json(assessment, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Eroare internă' }, { status: 500 })
  }
}
