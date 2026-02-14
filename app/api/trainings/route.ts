// app/api/trainings/route.ts
// API: Training Sessions (Sesiuni de instruire) - List & Create
// GET: Lista instruiri cu filtre (type, status, date_range, employee_id)
// POST: Creare sesiune instruire cu validare completa

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

// ========== TYPES ==========

type TrainingType =
  | 'ssm_initial'
  | 'ssm_periodic'
  | 'psi_initial'
  | 'psi_periodic'
  | 'primul_ajutor'
  | 'lucru_inaltime'
  | 'echipamente'
  | 'altul'

type TrainingFrequency = 'annual' | 'biannual' | 'triannual' | 'once'

interface CreateTrainingSessionInput {
  title?: string
  employee_id: string | null
  training_type: TrainingType
  completion_date: string
  expiry_date?: string | null
  duration_hours?: number | null
  instructor_name?: string | null
  location?: string | null
  notes?: string | null
  frequency?: TrainingFrequency | null
  organization_id: string
  participants?: string[] // Array of employee IDs
}

interface ApiError {
  error: string
  message: string
  details?: any
  code: string
}

// ========== HELPER FUNCTIONS ==========

function calculateExpiryDate(
  completionDate: string,
  trainingType: TrainingType,
  frequency?: TrainingFrequency | null
): string | null {
  const date = new Date(completionDate)

  // Reguli standard pentru tipuri comune
  switch (trainingType) {
    case 'ssm_initial':
      // SSM initial nu expiră (se face o singură dată)
      return null

    case 'ssm_periodic':
      // SSM periodic: anual sau conform frequenței
      if (frequency === 'annual') {
        date.setFullYear(date.getFullYear() + 1)
      } else if (frequency === 'biannual') {
        date.setFullYear(date.getFullYear() + 2)
      } else {
        date.setFullYear(date.getFullYear() + 1) // default anual
      }
      return date.toISOString().split('T')[0]

    case 'psi_initial':
      return null // PSI initial nu expiră

    case 'psi_periodic':
      // PSI periodic: anual
      date.setFullYear(date.getFullYear() + 1)
      return date.toISOString().split('T')[0]

    case 'primul_ajutor':
      // Primul ajutor: 2 ani
      date.setFullYear(date.getFullYear() + 2)
      return date.toISOString().split('T')[0]

    case 'lucru_inaltime':
      // Lucru la înălțime: anual
      date.setFullYear(date.getFullYear() + 1)
      return date.toISOString().split('T')[0]

    case 'echipamente':
      // Echipamente: conform frecvenței sau anual
      if (frequency === 'annual') {
        date.setFullYear(date.getFullYear() + 1)
      } else if (frequency === 'biannual') {
        date.setFullYear(date.getFullYear() + 2)
      } else if (frequency === 'triannual') {
        date.setFullYear(date.getFullYear() + 3)
      } else {
        date.setFullYear(date.getFullYear() + 1)
      }
      return date.toISOString().split('T')[0]

    default:
      // Pentru 'altul' sau alte tipuri: conform frecvenței sau null
      if (frequency === 'annual') {
        date.setFullYear(date.getFullYear() + 1)
        return date.toISOString().split('T')[0]
      } else if (frequency === 'biannual') {
        date.setFullYear(date.getFullYear() + 2)
        return date.toISOString().split('T')[0]
      } else if (frequency === 'triannual') {
        date.setFullYear(date.getFullYear() + 3)
        return date.toISOString().split('T')[0]
      }
      return null
  }
}

async function checkOrganizationAccess(
  userId: string,
  organizationId: string,
  allowedRoles?: string[]
) {
  const supabase = await createSupabaseServer()

  const { data: membership, error } = await supabase
    .from('memberships')
    .select('role, is_active')
    .eq('user_id', userId)
    .eq('organization_id', organizationId)
    .eq('is_active', true)
    .single()

  if (error || !membership) {
    return { hasAccess: false, error: 'Nu faci parte din această organizație' }
  }

  if (allowedRoles && !allowedRoles.includes(membership.role)) {
    return {
      hasAccess: false,
      error: `Rol insuficient. Trebuie să ai unul din rolurile: ${allowedRoles.join(', ')}`
    }
  }

  return { hasAccess: true, role: membership.role }
}

// ========== GET: LIST TRAINING SESSIONS ==========

/**
 * GET /api/trainings
 * Lista sesiuni instruire cu filtre
 *
 * Query params:
 * - organization_id: UUID (obligatoriu)
 * - type: ssm_initial | ssm_periodic | psi_initial | psi_periodic | primul_ajutor | lucru_inaltime | echipamente | altul
 * - status: valid | expiring | expired | incomplete
 * - date_from: YYYY-MM-DD
 * - date_to: YYYY-MM-DD
 * - employee_id: UUID
 * - page: number (default: 1)
 * - limit: number (default: 20, max: 100)
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Trebuie să fii autentificat pentru a accesa această resursă',
          code: 'AUTH_REQUIRED'
        } as ApiError,
        { status: 401 }
      )
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url)
    const organizationId = searchParams.get('organization_id')

    if (!organizationId) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'organization_id este obligatoriu',
          code: 'MISSING_ORG_ID'
        } as ApiError,
        { status: 400 }
      )
    }

    // Check organization access
    const accessCheck = await checkOrganizationAccess(user.id, organizationId)
    if (!accessCheck.hasAccess) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: accessCheck.error || 'Nu ai acces la această organizație',
          code: 'ACCESS_DENIED'
        } as ApiError,
        { status: 403 }
      )
    }

    // Parse filters
    const trainingType = searchParams.get('type')
    const status = searchParams.get('status')
    const dateFrom = searchParams.get('date_from')
    const dateTo = searchParams.get('date_to')
    const employeeId = searchParams.get('employee_id')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('training_sessions')
      .select(`
        *,
        employees!inner(id, full_name, job_title, email),
        organizations(name, cui)
      `, { count: 'exact' })
      .eq('organization_id', organizationId)

    // Apply filters
    if (trainingType) {
      query = query.eq('training_type', trainingType)
    }

    if (employeeId) {
      query = query.eq('employee_id', employeeId)
    }

    if (dateFrom) {
      query = query.gte('completion_date', dateFrom)
    }

    if (dateTo) {
      query = query.lte('completion_date', dateTo)
    }

    // Apply pagination
    query = query
      .order('completion_date', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: trainings, error, count } = await query

    if (error) {
      console.error('[GET /api/trainings] Database error:', error)
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Eroare la citirea datelor',
          details: error.message,
          code: 'DB_ERROR'
        } as ApiError,
        { status: 500 }
      )
    }

    // Filter by status (client-side filter based on expiry dates)
    let filteredTrainings = trainings || []
    if (status) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      filteredTrainings = filteredTrainings.filter((training: any) => {
        if (!training.expiry_date) {
          return status === 'incomplete' || status === 'valid'
        }

        const expiryDate = new Date(training.expiry_date)
        const daysUntilExpiry = Math.ceil(
          (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        )

        switch (status) {
          case 'valid':
            return daysUntilExpiry > 30
          case 'expiring':
            return daysUntilExpiry >= 0 && daysUntilExpiry <= 30
          case 'expired':
            return daysUntilExpiry < 0
          case 'incomplete':
            return !training.completion_date
          default:
            return true
        }
      })
    }

    return NextResponse.json({
      data: filteredTrainings,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('[GET /api/trainings] Error:', error)
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'A apărut o eroare neprevăzută',
        details: error instanceof Error ? error.message : String(error),
        code: 'INTERNAL_ERROR'
      } as ApiError,
      { status: 500 }
    )
  }
}

// ========== POST: CREATE TRAINING SESSION ==========

/**
 * POST /api/trainings
 * Creare sesiune instruire nouă
 *
 * Body:
 * {
 *   "title": string (optional),
 *   "employee_id": UUID | null,
 *   "training_type": "introductiv" | "loc-munca" | "periodic" | ...,
 *   "completion_date": "YYYY-MM-DD",
 *   "expiry_date": "YYYY-MM-DD" (optional, se calculează automat),
 *   "duration_hours": number (optional),
 *   "instructor_name": string (optional),
 *   "location": string (optional),
 *   "notes": string (optional),
 *   "frequency": "annual" | "biannual" | "triannual" | "once" (optional),
 *   "organization_id": UUID,
 *   "participants": UUID[] (optional, array de employee_ids)
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Trebuie să fii autentificat pentru a accesa această resursă',
          code: 'AUTH_REQUIRED'
        } as ApiError,
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await req.json().catch(() => ({}))

    // Validare câmpuri obligatorii
    if (!body.organization_id) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'organization_id este obligatoriu',
          code: 'MISSING_ORG_ID'
        } as ApiError,
        { status: 400 }
      )
    }

    if (!body.training_type) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'training_type este obligatoriu',
          code: 'MISSING_TYPE'
        } as ApiError,
        { status: 400 }
      )
    }

    if (!body.completion_date) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'completion_date este obligatoriu',
          code: 'MISSING_DATE'
        } as ApiError,
        { status: 400 }
      )
    }

    // Mapare convenție de denumire: "introductiv" → "ssm_initial", "loc-munca" → "ssm_periodic", "periodic" → "ssm_periodic"
    let normalizedType: TrainingType = body.training_type
    if (body.training_type === 'introductiv') {
      normalizedType = 'ssm_initial'
    } else if (body.training_type === 'loc-munca' || body.training_type === 'periodic') {
      normalizedType = 'ssm_periodic'
    }

    // Validare training_type
    const validTypes: TrainingType[] = [
      'ssm_initial',
      'ssm_periodic',
      'psi_initial',
      'psi_periodic',
      'primul_ajutor',
      'lucru_inaltime',
      'echipamente',
      'altul'
    ]

    if (!validTypes.includes(normalizedType)) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: `training_type invalid. Valori permise: ${validTypes.join(', ')}`,
          code: 'INVALID_TYPE'
        } as ApiError,
        { status: 400 }
      )
    }

    // Check organization access (doar consultant și firma_admin pot crea)
    const accessCheck = await checkOrganizationAccess(
      user.id,
      body.organization_id,
      ['consultant', 'firma_admin']
    )
    if (!accessCheck.hasAccess) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: accessCheck.error || 'Nu ai permisiunea de a crea sesiuni de instruire',
          code: 'ACCESS_DENIED'
        } as ApiError,
        { status: 403 }
      )
    }

    // Verificare employee_id dacă este furnizat
    if (body.employee_id) {
      const { data: employee, error: employeeError } = await supabase
        .from('employees')
        .select('id, full_name')
        .eq('id', body.employee_id)
        .eq('organization_id', body.organization_id)
        .single()

      if (employeeError || !employee) {
        return NextResponse.json(
          {
            error: 'Not Found',
            message: 'Angajatul specificat nu există sau nu aparține organizației',
            code: 'EMPLOYEE_NOT_FOUND'
          } as ApiError,
          { status: 404 }
        )
      }
    }

    // Calculare automată expiry_date dacă nu e furnizată
    const expiryDate = body.expiry_date ||
      calculateExpiryDate(
        body.completion_date,
        normalizedType,
        body.frequency
      )

    // Prepare training session data
    const trainingData = {
      organization_id: body.organization_id,
      employee_id: body.employee_id || null,
      training_type: normalizedType,
      completion_date: body.completion_date,
      expiry_date: expiryDate,
      duration_hours: body.duration_hours || null,
      instructor_name: body.instructor_name || null,
      location: body.location || null,
      notes: body.notes || null,
      frequency: body.frequency || null
    }

    // Dacă sunt furnizați participanți, creăm sesiuni pentru fiecare
    if (body.participants && Array.isArray(body.participants) && body.participants.length > 0) {
      // Verificare că toți participanții există și aparțin organizației
      const { data: employees, error: employeesError } = await supabase
        .from('employees')
        .select('id, full_name')
        .eq('organization_id', body.organization_id)
        .in('id', body.participants)

      if (employeesError) {
        return NextResponse.json(
          {
            error: 'Database Error',
            message: 'Eroare la verificarea participanților',
            details: employeesError.message,
            code: 'DB_ERROR'
          } as ApiError,
          { status: 500 }
        )
      }

      if (!employees || employees.length !== body.participants.length) {
        return NextResponse.json(
          {
            error: 'Bad Request',
            message: 'Unul sau mai mulți participanți nu există sau nu aparțin organizației',
            code: 'INVALID_PARTICIPANTS'
          } as ApiError,
          { status: 400 }
        )
      }

      // Creare sesiuni pentru fiecare participant
      const sessionsToCreate = body.participants.map((employeeId: string) => ({
        ...trainingData,
        employee_id: employeeId
      }))

      const { data: createdSessions, error: createError } = await supabase
        .from('training_sessions')
        .insert(sessionsToCreate)
        .select(`
          *,
          employees!inner(id, full_name, job_title, email)
        `)

      if (createError) {
        console.error('[POST /api/trainings] Bulk create error:', createError)
        return NextResponse.json(
          {
            error: 'Database Error',
            message: 'Eroare la crearea sesiunilor de instruire',
            details: createError.message,
            code: 'DB_ERROR'
          } as ApiError,
          { status: 500 }
        )
      }

      return NextResponse.json(
        {
          message: `${createdSessions?.length || 0} sesiuni de instruire create cu succes`,
          data: createdSessions,
          count: createdSessions?.length || 0
        },
        { status: 201 }
      )
    } else {
      // Creare sesiune unică
      const { data: createdSession, error: createError } = await supabase
        .from('training_sessions')
        .insert([trainingData])
        .select(`
          *,
          employees(id, full_name, job_title, email),
          organizations(name, cui)
        `)
        .single()

      if (createError) {
        console.error('[POST /api/trainings] Create error:', createError)
        return NextResponse.json(
          {
            error: 'Database Error',
            message: 'Eroare la crearea sesiunii de instruire',
            details: createError.message,
            code: 'DB_ERROR'
          } as ApiError,
          { status: 500 }
        )
      }

      return NextResponse.json(
        {
          message: 'Sesiune de instruire creată cu succes',
          data: createdSession
        },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error('[POST /api/trainings] Error:', error)
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'A apărut o eroare neprevăzută',
        details: error instanceof Error ? error.message : String(error),
        code: 'INTERNAL_ERROR'
      } as ApiError,
      { status: 500 }
    )
  }
}
