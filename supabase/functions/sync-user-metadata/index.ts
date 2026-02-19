// Supabase Edge Function: sync-user-metadata
// Sincronizează auth.users.app_metadata cu rolul, org_ids și capabilities ale unui user
// Poate fi apelată manual (backfill HTTP), din cod aplicație sau din webhook extern
// Data: 19 Februarie 2026

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Prioritate roluri (cel mai mic index = prioritate mai mare)
const ROLE_PRIORITY: Record<string, number> = {
  super_admin:            1,
  consultant_ssm:         2,
  white_label_stm:        3,
  firma_admin:            4,
  responsabil_ssm_intern: 5,
  lucrator_desemnat:      6,
}

interface RequestBody {
  user_id: string
}

interface AppMetadata {
  role: string
  org_id: string | null
  org_ids: string[]
  permissions: string[]
  metadata_synced_at: string
}

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('[sync-user-metadata] SUPABASE_URL sau SUPABASE_SERVICE_ROLE_KEY lipsesc')
      return jsonResponse({ success: false, error: 'Configurație server incompletă' }, 500)
    }

    // Verifică autorizarea — doar service_role sau intern
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || (!authHeader.includes(serviceRoleKey) && authHeader !== `Bearer ${serviceRoleKey}`)) {
      // Permite și requesturi interne fără auth (de la alte Edge Functions din același proiect)
      const clientInfo = req.headers.get('x-client-info') || ''
      if (!clientInfo.startsWith('supabase-js') && authHeader !== `Bearer ${serviceRoleKey}`) {
        return jsonResponse({ success: false, error: 'Neautorizat' }, 401)
      }
    }

    const body: RequestBody = await req.json()
    const { user_id } = body

    if (!user_id || typeof user_id !== 'string') {
      return jsonResponse({ success: false, error: 'user_id este obligatoriu' }, 400)
    }

    // UUID validation simplă
    const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!UUID_PATTERN.test(user_id)) {
      return jsonResponse({ success: false, error: 'user_id trebuie să fie un UUID valid' }, 400)
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // ── 1. Citește rolurile active ale userului ──
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select(`
        role_id,
        company_id,
        expires_at,
        roles!inner (
          role_key,
          is_active
        )
      `)
      .eq('user_id', user_id)
      .eq('is_active', true)
      .eq('roles.is_active', true)

    if (rolesError) {
      console.error('[sync-user-metadata] Eroare la citirea rolurilor:', rolesError)
      return jsonResponse({ success: false, error: 'Eroare la citirea rolurilor' }, 500)
    }

    // Filtrează rolurile expirate
    const activeRoles = (userRoles || []).filter(
      (ur) => !ur.expires_at || new Date(ur.expires_at) > new Date()
    )

    // ── 2. Determină rolul primar (cu prioritate) ──
    let primaryRole = 'angajat'
    let bestPriority = 999

    for (const ur of activeRoles) {
      const roleKey = (ur.roles as any).role_key as string
      const priority = ROLE_PRIORITY[roleKey] ?? 50
      if (priority < bestPriority) {
        bestPriority = priority
        primaryRole = roleKey
      }
    }

    // ── 3. Citește org_ids din ambele surse ──
    const orgIdsSet = new Set<string>()

    // Sursa 1: user_roles.company_id
    for (const ur of activeRoles) {
      if (ur.company_id) orgIdsSet.add(ur.company_id)
    }

    // Sursa 2: memberships (fallback legacy)
    const { data: memberships, error: membershipsError } = await supabase
      .from('memberships')
      .select('organization_id')
      .eq('user_id', user_id)
      .eq('is_active', true)
      .is('deleted_at', null)

    if (!membershipsError && memberships) {
      for (const m of memberships) {
        if (m.organization_id) orgIdsSet.add(m.organization_id)
      }
    }

    const orgIds = Array.from(orgIdsSet)

    // ── 4. Citește capabilities din role_capabilities ──
    const roleIds = activeRoles.map((ur) => ur.role_id)
    let permissions: string[] = []

    if (roleIds.length > 0) {
      const { data: roleCaps, error: capsError } = await supabase
        .from('role_capabilities')
        .select('capability_code')
        .in('role_id', roleIds)

      if (!capsError && roleCaps) {
        const permSet = new Set<string>()
        for (const rc of roleCaps) permSet.add(rc.capability_code)
        permissions = Array.from(permSet)
      } else if (capsError) {
        console.warn('[sync-user-metadata] role_capabilities indisponibil:', capsError.message)
      }
    }

    // ── 5. Actualizează auth.users.app_metadata via Admin API ──
    const appMetadata: AppMetadata = {
      role: primaryRole,
      org_id: orgIds[0] ?? null,
      org_ids: orgIds,
      permissions,
      metadata_synced_at: new Date().toISOString(),
    }

    const { error: updateError } = await supabase.auth.admin.updateUserById(user_id, {
      app_metadata: appMetadata,
    })

    if (updateError) {
      console.error('[sync-user-metadata] Eroare la actualizarea app_metadata:', updateError)
      return jsonResponse({ success: false, error: 'Eroare la actualizarea metadata' }, 500)
    }

    console.log(
      `[sync-user-metadata] Sincronizat user ${user_id}: role=${primaryRole}, orgs=${orgIds.length}, caps=${permissions.length}`
    )

    return jsonResponse({
      success: true,
      user_id,
      metadata: appMetadata,
    })
  } catch (error) {
    console.error('[sync-user-metadata] Eroare neașteptată:', error)
    return jsonResponse(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Eroare necunoscută',
      },
      500
    )
  }
})

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
