// S-S-M.RO — API Routes: Employees CRUD
// GET: Listare angajați cu paginare și filtrare
// POST: Creare angajat nou cu validare

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import type { Employee } from '@/lib/types'

// ────────────────────────────────────────────────────────────
// GET /api/employees
// Query params: page, limit, organization_id, is_active, search
// ────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    // Verificare autentificare
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Neautentificat' },
        { status: 401 }
      )
    }

    // Extragere parametri query
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const organizationId = searchParams.get('organization_id')
    const isActive = searchParams.get('is_active')
    const search = searchParams.get('search')

    // Validare parametri
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Parametri invalizi: page >= 1, limit între 1-100' },
        { status: 400 }
      )
    }

    // Construire query cu RLS automat aplicat
    let query = supabase
      .from('employees')
      .select('*, organizations(name, cui)', { count: 'exact' })
      .order('full_name', { ascending: true })

    // Filtrare după organization_id
    if (organizationId) {
      query = query.eq('organization_id', organizationId)
    }

    // Filtrare după is_active
    if (isActive !== null && isActive !== undefined) {
      const activeValue = isActive === 'true'
      query = query.eq('is_active', activeValue)
    }

    // Căutare text în full_name sau job_title
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,job_title.ilike.%${search}%`)
    }

    // Paginare
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching employees:', error)
      return NextResponse.json(
        { error: 'Eroare la încărcarea angajaților' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: data as Employee[],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Unexpected error in GET /api/employees:', error)
    return NextResponse.json(
      { error: 'Eroare internă de server' },
      { status: 500 }
    )
  }
}

// ────────────────────────────────────────────────────────────
// POST /api/employees
// Body: { full_name, organization_id, cor_code?, job_title?, nationality?, email?, phone?, hire_date? }
// ────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    // Verificare autentificare
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Neautentificat' },
        { status: 401 }
      )
    }

    // Parsare body
    const body = await request.json()
    const {
      full_name,
      organization_id,
      cor_code,
      job_title,
      nationality,
      email,
      phone,
      hire_date,
      user_id,
    } = body

    // Validare câmpuri obligatorii
    if (!full_name || typeof full_name !== 'string' || full_name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Câmp obligatoriu: full_name (string non-gol)' },
        { status: 400 }
      )
    }

    if (!organization_id || typeof organization_id !== 'string') {
      return NextResponse.json(
        { error: 'Câmp obligatoriu: organization_id (UUID string)' },
        { status: 400 }
      )
    }

    // Validare email format (dacă este furnizat)
    if (email && typeof email === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Format email invalid' },
          { status: 400 }
        )
      }
    }

    // Validare phone format (dacă este furnizat)
    if (phone && typeof phone === 'string') {
      const phoneRegex = /^[0-9+\-\s()]{6,20}$/
      if (!phoneRegex.test(phone)) {
        return NextResponse.json(
          { error: 'Format telefon invalid (6-20 caractere, cifre și +/-/spații/paranteze)' },
          { status: 400 }
        )
      }
    }

    // Validare hire_date format (YYYY-MM-DD)
    if (hire_date && typeof hire_date === 'string') {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(hire_date)) {
        return NextResponse.json(
          { error: 'Format hire_date invalid (așteptat YYYY-MM-DD)' },
          { status: 400 }
        )
      }
    }

    // Construire obiect insert
    const employeeData = {
      full_name: full_name.trim(),
      organization_id,
      cor_code: cor_code || null,
      job_title: job_title || null,
      nationality: nationality || 'RO',
      email: email || null,
      phone: phone || null,
      hire_date: hire_date || new Date().toISOString().split('T')[0],
      user_id: user_id || null,
      is_active: true,
    }

    // Insert în DB cu RLS automat aplicat
    const { data, error } = await supabase
      .from('employees')
      .insert([employeeData])
      .select('*, organizations(name, cui)')
      .single()

    if (error) {
      console.error('Error creating employee:', error)

      // Verificare erori comune
      if (error.code === '23503') {
        return NextResponse.json(
          { error: 'Organizația specificată nu există sau nu aveți acces' },
          { status: 400 }
        )
      }

      if (error.code === '42501') {
        return NextResponse.json(
          { error: 'Nu aveți permisiunea de a crea angajați pentru această organizație' },
          { status: 403 }
        )
      }

      return NextResponse.json(
        { error: 'Eroare la crearea angajatului' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: data as Employee,
      message: 'Angajat creat cu succes'
    }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/employees:', error)
    return NextResponse.json(
      { error: 'Eroare internă de server' },
      { status: 500 }
    )
  }
}
