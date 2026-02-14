import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import * as XLSX from 'https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs'
import { corsHeaders } from '../_shared/cors.ts'

interface ExportRequest {
  org_id: string
  export_type: 'employees' | 'trainings' | 'medical' | 'equipment' | 'compliance'
  filters?: {
    start_date?: string
    end_date?: string
    status?: string
    location_id?: string
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const { org_id, export_type, filters = {} } = await req.json() as ExportRequest

    if (!org_id || !export_type) {
      throw new Error('Missing required fields: org_id, export_type')
    }

    // Verify user has access to this organization
    const { data: membership, error: membershipError } = await supabaseClient
      .from('memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', org_id)
      .single()

    if (membershipError || !membership) {
      throw new Error('Access denied to this organization')
    }

    // Get organization details for filename
    const { data: org, error: orgError } = await supabaseClient
      .from('organizations')
      .select('name')
      .eq('id', org_id)
      .single()

    if (orgError || !org) {
      throw new Error('Organization not found')
    }

    // Create workbook
    const workbook = XLSX.utils.book_new()
    let fileName = ''

    // Generate appropriate sheets based on export type
    switch (export_type) {
      case 'employees':
        await generateEmployeesSheet(supabaseClient, workbook, org_id, filters)
        fileName = `${sanitizeFilename(org.name)}_angajati_${getDateString()}.xlsx`
        break

      case 'trainings':
        await generateTrainingsSheet(supabaseClient, workbook, org_id, filters)
        fileName = `${sanitizeFilename(org.name)}_instruiri_${getDateString()}.xlsx`
        break

      case 'medical':
        await generateMedicalSheet(supabaseClient, workbook, org_id, filters)
        fileName = `${sanitizeFilename(org.name)}_medicina_muncii_${getDateString()}.xlsx`
        break

      case 'equipment':
        await generateEquipmentSheet(supabaseClient, workbook, org_id, filters)
        fileName = `${sanitizeFilename(org.name)}_echipamente_${getDateString()}.xlsx`
        break

      case 'compliance':
        await generateComplianceSheet(supabaseClient, workbook, org_id, filters)
        fileName = `${sanitizeFilename(org.name)}_conformitate_${getDateString()}.xlsx`
        break

      default:
        throw new Error(`Invalid export_type: ${export_type}`)
    }

    // Write workbook to buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    // Upload to Supabase Storage (temp folder)
    const storagePath = `exports/temp/${org_id}/${fileName}`
    const { data: uploadData, error: uploadError } = await supabaseClient
      .storage
      .from('documents')
      .upload(storagePath, excelBuffer, {
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        upsert: true,
      })

    if (uploadError) {
      throw new Error(`Failed to upload file: ${uploadError.message}`)
    }

    // Generate signed URL (valid for 1 hour)
    const { data: urlData, error: urlError } = await supabaseClient
      .storage
      .from('documents')
      .createSignedUrl(storagePath, 3600) // 1 hour

    if (urlError || !urlData) {
      throw new Error('Failed to generate download URL')
    }

    return new Response(
      JSON.stringify({
        success: true,
        download_url: urlData.signedUrl,
        file_name: fileName,
        export_type,
        expires_in: 3600,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error generating Excel export:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

// Helper function to generate Employees sheet
async function generateEmployeesSheet(
  supabase: any,
  workbook: any,
  org_id: string,
  filters: any
) {
  let query = supabase
    .from('employees')
    .select('*, locations(name)')
    .eq('organization_id', org_id)
    .order('full_name', { ascending: true })

  if (filters.location_id) {
    query = query.eq('location_id', filters.location_id)
  }

  const { data: employees, error } = await query

  if (error) {
    throw new Error(`Failed to fetch employees: ${error.message}`)
  }

  const sheetData = [
    ['Nume Complet', 'CNP (Hash)', 'Post', 'Departament', 'Locație', 'Email', 'Telefon', 'Data Angajării', 'Activ', 'Cod COR']
  ]

  employees.forEach((emp: any) => {
    sheetData.push([
      emp.full_name || '',
      emp.cnp_hash ? '***' : '', // Don't expose CNP
      emp.job_title || '',
      emp.department || '',
      emp.locations?.name || '',
      emp.email || '',
      emp.phone || '',
      emp.hire_date || '',
      emp.is_active ? 'Da' : 'Nu',
      emp.cor_code || '',
    ])
  })

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData)

  // Auto-width columns
  const maxWidths = sheetData[0].map((_, colIndex) => {
    return Math.max(...sheetData.map(row => (row[colIndex] || '').toString().length))
  })
  worksheet['!cols'] = maxWidths.map(width => ({ wch: Math.min(width + 2, 50) }))

  // Bold headers
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
    if (!worksheet[cellAddress]) continue
    worksheet[cellAddress].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: 'E5E7EB' } }
    }
  }

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Angajați')

  // Add summary sheet
  const summaryData = [
    ['Statistici Angajați'],
    [''],
    ['Total angajați', employees.length],
    ['Angajați activi', employees.filter((e: any) => e.is_active).length],
    ['Angajați inactivi', employees.filter((e: any) => !e.is_active).length],
    [''],
    ['Export generat la', new Date().toLocaleString('ro-RO')],
  ]

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  summarySheet['!cols'] = [{ wch: 25 }, { wch: 15 }]
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Rezumat')
}

// Helper function to generate Trainings sheet
async function generateTrainingsSheet(
  supabase: any,
  workbook: any,
  org_id: string,
  filters: any
) {
  let query = supabase
    .from('training_sessions')
    .select(`
      *,
      employees(full_name, job_title),
      training_modules(title_ro, code)
    `)
    .eq('organization_id', org_id)
    .order('created_at', { ascending: false })

  if (filters.start_date) {
    query = query.gte('created_at', filters.start_date)
  }
  if (filters.end_date) {
    query = query.lte('created_at', filters.end_date)
  }
  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  const { data: sessions, error } = await query

  if (error) {
    throw new Error(`Failed to fetch training sessions: ${error.message}`)
  }

  const sheetData = [
    ['Angajat', 'Post', 'Curs', 'Cod Curs', 'Status', 'Progres', 'Scor Quiz', 'Data Început', 'Data Finalizare', 'Certificat']
  ]

  sessions.forEach((session: any) => {
    sheetData.push([
      session.employees?.full_name || '',
      session.employees?.job_title || '',
      session.training_modules?.title_ro || '',
      session.training_modules?.code || '',
      session.status || '',
      session.progress ? `${session.progress}%` : '0%',
      session.quiz_score || '',
      session.started_at || '',
      session.completed_at || '',
      session.certificate_url ? 'Da' : 'Nu',
    ])
  })

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData)

  // Auto-width columns
  const maxWidths = sheetData[0].map((_, colIndex) => {
    return Math.max(...sheetData.map(row => (row[colIndex] || '').toString().length))
  })
  worksheet['!cols'] = maxWidths.map(width => ({ wch: Math.min(width + 2, 50) }))

  // Bold headers
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
    if (!worksheet[cellAddress]) continue
    worksheet[cellAddress].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: 'E5E7EB' } }
    }
  }

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Instruiri')

  // Add summary sheet
  const totalSessions = sessions.length
  const completedSessions = sessions.filter((s: any) => s.status === 'completed').length
  const inProgressSessions = sessions.filter((s: any) => s.status === 'in_progress').length
  const notStartedSessions = sessions.filter((s: any) => s.status === 'not_started').length

  const summaryData = [
    ['Statistici Instruiri'],
    [''],
    ['Total sesiuni', totalSessions],
    ['Finalizate', completedSessions],
    ['În progres', inProgressSessions],
    ['Neîncepute', notStartedSessions],
    ['Rata finalizare', totalSessions > 0 ? `${Math.round(completedSessions / totalSessions * 100)}%` : '0%'],
    [''],
    ['Export generat la', new Date().toLocaleString('ro-RO')],
  ]

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  summarySheet['!cols'] = [{ wch: 25 }, { wch: 15 }]
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Rezumat')
}

// Helper function to generate Medical sheet
async function generateMedicalSheet(
  supabase: any,
  workbook: any,
  org_id: string,
  filters: any
) {
  let query = supabase
    .from('medical_records')
    .select('*')
    .eq('organization_id', org_id)
    .order('examination_date', { ascending: false })

  if (filters.start_date) {
    query = query.gte('examination_date', filters.start_date)
  }
  if (filters.end_date) {
    query = query.lte('examination_date', filters.end_date)
  }

  const { data: records, error } = await query

  if (error) {
    throw new Error(`Failed to fetch medical records: ${error.message}`)
  }

  const sheetData = [
    ['Angajat', 'Post', 'Tip Examinare', 'Data Examinare', 'Data Expirare', 'Rezultat', 'Restricții', 'Medic', 'Clinică', 'Observații']
  ]

  records.forEach((record: any) => {
    sheetData.push([
      record.employee_name || '',
      record.job_title || '',
      record.examination_type || '',
      record.examination_date || '',
      record.expiry_date || '',
      record.result || '',
      record.restrictions || '',
      record.doctor_name || '',
      record.clinic_name || '',
      record.notes || '',
    ])
  })

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData)

  // Auto-width columns
  const maxWidths = sheetData[0].map((_, colIndex) => {
    return Math.max(...sheetData.map(row => (row[colIndex] || '').toString().length))
  })
  worksheet['!cols'] = maxWidths.map(width => ({ wch: Math.min(width + 2, 50) }))

  // Bold headers
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
    if (!worksheet[cellAddress]) continue
    worksheet[cellAddress].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: 'E5E7EB' } }
    }
  }

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Medicina Muncii')

  // Add summary sheet
  const today = new Date().toISOString().split('T')[0]
  const expiredRecords = records.filter((r: any) => r.expiry_date && r.expiry_date < today)
  const expiringIn30Days = records.filter((r: any) => {
    if (!r.expiry_date) return false
    const daysUntilExpiry = Math.floor((new Date(r.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30
  })

  const summaryData = [
    ['Statistici Medicina Muncii'],
    [''],
    ['Total examene', records.length],
    ['Apt', records.filter((r: any) => r.result === 'apt').length],
    ['Apt condiționat', records.filter((r: any) => r.result === 'apt_conditionat').length],
    ['Inapt temporar', records.filter((r: any) => r.result === 'inapt_temporar').length],
    ['Inapt', records.filter((r: any) => r.result === 'inapt').length],
    [''],
    ['Examene expirate', expiredRecords.length],
    ['Expiră în 30 zile', expiringIn30Days.length],
    [''],
    ['Export generat la', new Date().toLocaleString('ro-RO')],
  ]

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  summarySheet['!cols'] = [{ wch: 25 }, { wch: 15 }]
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Rezumat')
}

// Helper function to generate Equipment sheet
async function generateEquipmentSheet(
  supabase: any,
  workbook: any,
  org_id: string,
  filters: any
) {
  let query = supabase
    .from('safety_equipment')
    .select('*')
    .eq('organization_id', org_id)
    .order('expiry_date', { ascending: true })

  if (filters.start_date) {
    query = query.gte('expiry_date', filters.start_date)
  }
  if (filters.end_date) {
    query = query.lte('expiry_date', filters.end_date)
  }

  const { data: equipment, error } = await query

  if (error) {
    throw new Error(`Failed to fetch equipment: ${error.message}`)
  }

  const sheetData = [
    ['Tip Echipament', 'Descriere', 'Locație', 'Serie', 'Data Ultimei Verificări', 'Data Expirare', 'Data Următoarei Verificări', 'Inspector', 'Conform', 'Observații']
  ]

  equipment.forEach((item: any) => {
    sheetData.push([
      item.equipment_type || '',
      item.description || '',
      item.location || '',
      item.serial_number || '',
      item.last_inspection_date || '',
      item.expiry_date || '',
      item.next_inspection_date || '',
      item.inspector_name || '',
      item.is_compliant ? 'Da' : 'Nu',
      item.notes || '',
    ])
  })

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData)

  // Auto-width columns
  const maxWidths = sheetData[0].map((_, colIndex) => {
    return Math.max(...sheetData.map(row => (row[colIndex] || '').toString().length))
  })
  worksheet['!cols'] = maxWidths.map(width => ({ wch: Math.min(width + 2, 50) }))

  // Bold headers
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
    if (!worksheet[cellAddress]) continue
    worksheet[cellAddress].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: 'E5E7EB' } }
    }
  }

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Echipamente')

  // Add summary sheet
  const today = new Date().toISOString().split('T')[0]
  const expiredEquipment = equipment.filter((e: any) => e.expiry_date && e.expiry_date < today)
  const expiringIn30Days = equipment.filter((e: any) => {
    if (!e.expiry_date) return false
    const daysUntilExpiry = Math.floor((new Date(e.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30
  })

  const equipmentByType: { [key: string]: number } = {}
  equipment.forEach((e: any) => {
    equipmentByType[e.equipment_type] = (equipmentByType[e.equipment_type] || 0) + 1
  })

  const summaryData = [
    ['Statistici Echipamente'],
    [''],
    ['Total echipamente', equipment.length],
    ['Conforme', equipment.filter((e: any) => e.is_compliant).length],
    ['Neconforme', equipment.filter((e: any) => !e.is_compliant).length],
    [''],
    ['Expirate', expiredEquipment.length],
    ['Expiră în 30 zile', expiringIn30Days.length],
    [''],
    ['Pe tipuri:'],
    ...Object.entries(equipmentByType).map(([type, count]) => [type, count]),
    [''],
    ['Export generat la', new Date().toLocaleString('ro-RO')],
  ]

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  summarySheet['!cols'] = [{ wch: 25 }, { wch: 15 }]
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Rezumat')
}

// Helper function to generate Compliance sheet (combined overview)
async function generateComplianceSheet(
  supabase: any,
  workbook: any,
  org_id: string,
  filters: any
) {
  // Fetch all data types
  const [employeesRes, medicalRes, equipmentRes, trainingsRes] = await Promise.all([
    supabase.from('employees').select('*').eq('organization_id', org_id),
    supabase.from('medical_records').select('*').eq('organization_id', org_id),
    supabase.from('safety_equipment').select('*').eq('organization_id', org_id),
    supabase.from('training_sessions').select('*').eq('organization_id', org_id),
  ])

  const employees = employeesRes.data || []
  const medical = medicalRes.data || []
  const equipment = equipmentRes.data || []
  const trainings = trainingsRes.data || []

  const today = new Date().toISOString().split('T')[0]

  // Summary Sheet
  const summaryData = [
    ['Raport Conformitate SSM/PSI'],
    [''],
    ['Organizație ID', org_id],
    ['Data generare', new Date().toLocaleString('ro-RO')],
    [''],
    ['ANGAJAȚI'],
    ['Total angajați', employees.length],
    ['Angajați activi', employees.filter((e: any) => e.is_active).length],
    [''],
    ['MEDICINA MUNCII'],
    ['Total examene', medical.length],
    ['Examene expirate', medical.filter((m: any) => m.expiry_date && m.expiry_date < today).length],
    ['Expiră în 30 zile', medical.filter((m: any) => {
      if (!m.expiry_date) return false
      const days = Math.floor((new Date(m.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      return days > 0 && days <= 30
    }).length],
    [''],
    ['ECHIPAMENTE PSI'],
    ['Total echipamente', equipment.length],
    ['Echipamente conforme', equipment.filter((e: any) => e.is_compliant).length],
    ['Echipamente expirate', equipment.filter((e: any) => e.expiry_date && e.expiry_date < today).length],
    [''],
    ['INSTRUIRI'],
    ['Total sesiuni', trainings.length],
    ['Sesiuni finalizate', trainings.filter((t: any) => t.status === 'completed').length],
    ['Rata finalizare', trainings.length > 0 ? `${Math.round(trainings.filter((t: any) => t.status === 'completed').length / trainings.length * 100)}%` : '0%'],
  ]

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  summarySheet['!cols'] = [{ wch: 30 }, { wch: 20 }]

  // Bold section headers
  const sectionRows = [5, 9, 14, 18] // Row indices for section headers
  sectionRows.forEach(row => {
    const cellAddress = XLSX.utils.encode_cell({ r: row, c: 0 })
    if (summarySheet[cellAddress]) {
      summarySheet[cellAddress].s = {
        font: { bold: true, color: { rgb: '2563EB' } }
      }
    }
  })

  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Rezumat Conformitate')

  // Alerts Sheet - items expiring soon or expired
  const alertsData = [
    ['Tip Alertă', 'Element', 'Data Expirare', 'Status', 'Zile Rămase']
  ]

  // Medical alerts
  medical.forEach((m: any) => {
    if (!m.expiry_date) return
    const daysUntilExpiry = Math.floor((new Date(m.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    if (daysUntilExpiry <= 30) {
      alertsData.push([
        'Medicina Muncii',
        m.employee_name || 'N/A',
        m.expiry_date,
        daysUntilExpiry < 0 ? 'EXPIRAT' : daysUntilExpiry <= 7 ? 'CRITIC' : 'ATENȚIE',
        daysUntilExpiry.toString(),
      ])
    }
  })

  // Equipment alerts
  equipment.forEach((e: any) => {
    if (!e.expiry_date) return
    const daysUntilExpiry = Math.floor((new Date(e.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    if (daysUntilExpiry <= 30) {
      alertsData.push([
        'Echipament PSI',
        `${e.equipment_type} - ${e.location || 'N/A'}`,
        e.expiry_date,
        daysUntilExpiry < 0 ? 'EXPIRAT' : daysUntilExpiry <= 7 ? 'CRITIC' : 'ATENȚIE',
        daysUntilExpiry.toString(),
      ])
    }
  })

  // Sort by days remaining
  const headers = alertsData[0]
  const rows = alertsData.slice(1).sort((a, b) => parseInt(a[4]) - parseInt(b[4]))
  const sortedAlertsData = [headers, ...rows]

  const alertsSheet = XLSX.utils.aoa_to_sheet(sortedAlertsData)
  alertsSheet['!cols'] = [{ wch: 20 }, { wch: 30 }, { wch: 15 }, { wch: 12 }, { wch: 12 }]

  // Bold headers
  const range = XLSX.utils.decode_range(alertsSheet['!ref'] || 'A1')
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
    if (!alertsSheet[cellAddress]) continue
    alertsSheet[cellAddress].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: 'FEE2E2' } }
    }
  }

  XLSX.utils.book_append_sheet(workbook, alertsSheet, 'Alerte')
}

// Helper functions
function sanitizeFilename(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-zA-Z0-9]/g, '_')
    .substring(0, 50)
}

function getDateString(): string {
  return new Date().toISOString().split('T')[0]
}
