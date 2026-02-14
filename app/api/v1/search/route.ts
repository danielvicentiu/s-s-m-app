// app/api/v1/search/route.ts
// REST API pentru căutare unificată — GET multi-entity search
// Caută în: employees, trainings, documents, equipment, alerts
// Data: 14 Februarie 2026

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { ApiResponse, Employee, SafetyEquipment, Document } from '@/lib/types'

// ========== TYPES ==========

interface SearchResultItem {
  id: string
  type: 'employee' | 'training' | 'document' | 'equipment' | 'alert'
  title: string
  subtitle?: string
  description?: string
  metadata?: Record<string, any>
  url?: string
}

interface GroupedSearchResults {
  employees: SearchResultItem[]
  trainings: SearchResultItem[]
  documents: SearchResultItem[]
  equipment: SearchResultItem[]
  alerts: SearchResultItem[]
}

interface SearchMetadata {
  query: string
  total_results: number
  search_time_ms: number
  results_per_category: {
    employees: number
    trainings: number
    documents: number
    equipment: number
    alerts: number
  }
}

// ========== HELPERS ==========

function daysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString('ro-RO', { year: 'numeric', month: 'short', day: 'numeric' })
}

// ========== GET /api/v1/search ==========
// Query params: q (required), org_id (required), limit (optional, default 10 per category)

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    const supabase = await createSupabaseServer()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse query params
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const orgId = searchParams.get('org_id')
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? Math.min(parseInt(limitParam, 10), 50) : 10

    // Validate required params
    if (!query || query.trim().length < 2) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Query parameter "q" must be at least 2 characters' },
        { status: 400 }
      )
    }

    if (!orgId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Query parameter "org_id" is required' },
        { status: 400 }
      )
    }

    // Check org access
    const { data: membership } = await supabase
      .from('memberships')
      .select('id, role')
      .eq('user_id', user.id)
      .eq('organization_id', orgId)
      .eq('is_active', true)
      .single()

    if (!membership) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Access denied to this organization' },
        { status: 403 }
      )
    }

    const searchTerm = query.trim()
    const ilikeTerm = `%${searchTerm}%`

    // Initialize results
    const results: GroupedSearchResults = {
      employees: [],
      trainings: [],
      documents: [],
      equipment: [],
      alerts: []
    }

    // ========== SEARCH EMPLOYEES ==========
    const { data: employees } = await supabase
      .from('employees')
      .select('id, full_name, email, job_title, department, phone')
      .eq('organization_id', orgId)
      .eq('is_active', true)
      .or(`full_name.ilike.${ilikeTerm},email.ilike.${ilikeTerm},job_title.ilike.${ilikeTerm},department.ilike.${ilikeTerm}`)
      .limit(limit)
      .order('full_name', { ascending: true })

    if (employees && employees.length > 0) {
      results.employees = employees.map((emp: any) => ({
        id: emp.id,
        type: 'employee' as const,
        title: emp.full_name,
        subtitle: emp.job_title || 'Fără funcție',
        description: emp.department || undefined,
        metadata: {
          email: emp.email,
          phone: emp.phone,
          department: emp.department
        },
        url: `/dashboard/employees/${emp.id}`
      }))
    }

    // ========== SEARCH TRAININGS ==========
    // Search in training_assignments joined with training_modules
    const { data: trainings } = await supabase
      .from('training_assignments')
      .select(`
        id,
        status,
        due_date,
        completed_at,
        training_modules (
          id,
          code,
          title,
          category,
          training_type
        ),
        employees:worker_id (
          full_name
        )
      `)
      .eq('organization_id', orgId)
      .limit(limit * 2) // Get more to filter client-side
      .order('assigned_at', { ascending: false })

    if (trainings && trainings.length > 0) {
      // Filter by search term (since we can't use ilike on nested fields)
      const filteredTrainings = trainings.filter((t: any) => {
        const module = t.training_modules
        if (!module) return false
        const searchLower = searchTerm.toLowerCase()
        return (
          module.title?.toLowerCase().includes(searchLower) ||
          module.code?.toLowerCase().includes(searchLower) ||
          module.category?.toLowerCase().includes(searchLower) ||
          t.employees?.full_name?.toLowerCase().includes(searchLower)
        )
      }).slice(0, limit)

      results.trainings = filteredTrainings.map((t: any) => {
        const module = t.training_modules
        const statusLabels: Record<string, string> = {
          assigned: 'Asignat',
          in_progress: 'În desfășurare',
          completed: 'Completat',
          overdue: 'Întârziat',
          expired: 'Expirat',
          exempted: 'Scutit'
        }

        return {
          id: t.id,
          type: 'training' as const,
          title: module?.title || 'Training necunoscut',
          subtitle: `${module?.code || 'N/A'} • ${statusLabels[t.status] || t.status}`,
          description: t.employees?.full_name || undefined,
          metadata: {
            status: t.status,
            category: module?.category,
            due_date: t.due_date,
            completed_at: t.completed_at,
            employee: t.employees?.full_name
          },
          url: `/dashboard/trainings/${t.id}`
        }
      })
    }

    // ========== SEARCH DOCUMENTS ==========
    const { data: documents } = await supabase
      .from('documents')
      .select('id, title, description, category, status, file_name, created_at, tags')
      .eq('organization_id', orgId)
      .is('deleted_at', null)
      .or(`title.ilike.${ilikeTerm},description.ilike.${ilikeTerm},file_name.ilike.${ilikeTerm}`)
      .limit(limit)
      .order('created_at', { ascending: false })

    if (documents && documents.length > 0) {
      const categoryLabels: Record<string, string> = {
        fisa_ssm: 'Fișă SSM',
        fisa_psi: 'Fișă PSI',
        raport_conformitate: 'Raport conformitate',
        fisa_instruire: 'Fișă instruire',
        proces_verbal: 'Proces verbal',
        certificat: 'Certificat',
        contract: 'Contract',
        procedura: 'Procedură',
        politica: 'Politică',
        altul: 'Altul'
      }

      const statusLabels: Record<string, string> = {
        draft: 'Draft',
        final: 'Final',
        archived: 'Arhivat'
      }

      results.documents = documents.map((doc: any) => ({
        id: doc.id,
        type: 'document' as const,
        title: doc.title,
        subtitle: `${categoryLabels[doc.category] || doc.category} • ${statusLabels[doc.status] || doc.status}`,
        description: doc.description || undefined,
        metadata: {
          category: doc.category,
          status: doc.status,
          file_name: doc.file_name,
          created_at: doc.created_at,
          tags: doc.tags
        },
        url: `/dashboard/documents/${doc.id}`
      }))
    }

    // ========== SEARCH EQUIPMENT ==========
    const { data: equipment } = await supabase
      .from('safety_equipment')
      .select('id, equipment_type, description, location, serial_number, expiry_date, is_compliant, notes')
      .eq('organization_id', orgId)
      .or(`description.ilike.${ilikeTerm},location.ilike.${ilikeTerm},serial_number.ilike.${ilikeTerm},notes.ilike.${ilikeTerm}`)
      .limit(limit)
      .order('expiry_date', { ascending: true })

    if (equipment && equipment.length > 0) {
      const equipmentTypeLabels: Record<string, string> = {
        stingator: 'Stingător',
        trusa_prim_ajutor: 'Trusă prim ajutor',
        hidrant: 'Hidrant',
        detector_fum: 'Detector fum',
        detector_gaz: 'Detector gaz',
        iluminat_urgenta: 'Iluminat urgență',
        panou_semnalizare: 'Panou semnalizare',
        trusa_scule: 'Trusă scule',
        eip: 'EIP',
        altul: 'Altul'
      }

      results.equipment = equipment.map((eq: any) => {
        const daysLeft = daysUntil(eq.expiry_date)
        let statusText = 'Valid'
        if (daysLeft < 0) statusText = 'Expirat'
        else if (daysLeft <= 30) statusText = 'Se apropie expirarea'

        return {
          id: eq.id,
          type: 'equipment' as const,
          title: eq.description || equipmentTypeLabels[eq.equipment_type] || eq.equipment_type,
          subtitle: `${equipmentTypeLabels[eq.equipment_type] || eq.equipment_type} • ${statusText}`,
          description: eq.location || undefined,
          metadata: {
            equipment_type: eq.equipment_type,
            location: eq.location,
            serial_number: eq.serial_number,
            expiry_date: eq.expiry_date,
            days_left: daysLeft,
            is_compliant: eq.is_compliant
          },
          url: `/dashboard/equipment/${eq.id}`
        }
      })
    }

    // ========== SEARCH ALERTS (from manual_alerts table) ==========
    const { data: alerts } = await supabase
      .from('manual_alerts')
      .select('id, severity, category, title, description, expiry_date, status, created_at')
      .eq('organization_id', orgId)
      .or(`title.ilike.${ilikeTerm},description.ilike.${ilikeTerm},category.ilike.${ilikeTerm}`)
      .in('status', ['active', 'acknowledged'])
      .limit(limit)
      .order('created_at', { ascending: false })

    if (alerts && alerts.length > 0) {
      const severityLabels: Record<string, string> = {
        info: 'Info',
        warning: 'Avertizare',
        critical: 'Critic',
        expired: 'Expirat'
      }

      results.alerts = alerts.map((alert: any) => {
        const daysLeft = alert.expiry_date ? daysUntil(alert.expiry_date) : null
        let expiryText = ''
        if (daysLeft !== null) {
          if (daysLeft < 0) expiryText = ' • Expirat'
          else if (daysLeft === 0) expiryText = ' • Astăzi'
          else if (daysLeft <= 7) expiryText = ` • ${daysLeft} zile`
        }

        return {
          id: alert.id,
          type: 'alert' as const,
          title: alert.title,
          subtitle: `${severityLabels[alert.severity] || alert.severity} • ${alert.category}${expiryText}`,
          description: alert.description || undefined,
          metadata: {
            severity: alert.severity,
            category: alert.category,
            status: alert.status,
            expiry_date: alert.expiry_date,
            days_left: daysLeft,
            created_at: alert.created_at
          },
          url: `/dashboard/alerts/${alert.id}`
        }
      })
    }

    // Calculate totals
    const totalResults =
      results.employees.length +
      results.trainings.length +
      results.documents.length +
      results.equipment.length +
      results.alerts.length

    const searchTime = Date.now() - startTime

    const metadata: SearchMetadata = {
      query: searchTerm,
      total_results: totalResults,
      search_time_ms: searchTime,
      results_per_category: {
        employees: results.employees.length,
        trainings: results.trainings.length,
        documents: results.documents.length,
        equipment: results.equipment.length,
        alerts: results.alerts.length
      }
    }

    return NextResponse.json<ApiResponse<GroupedSearchResults>>({
      success: true,
      data: results,
      metadata: metadata as any
    })

  } catch (error: any) {
    console.error('GET /api/v1/search error:', error)
    const searchTime = Date.now() - startTime
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Internal server error',
        metadata: { search_time_ms: searchTime } as any
      },
      { status: 500 }
    )
  }
}
