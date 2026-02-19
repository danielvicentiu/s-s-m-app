// app/api/onboarding/anaf-lookup/route.ts
// ANAF lookup cu cache 30 zile în anaf_cache

import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

interface AnafResponse {
  denumire?: string
  adresa?: string
  judet?: string
  caen_code?: string
  tva?: boolean
  split_tva?: boolean
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

export async function POST(request: Request) {
  try {
    const { cui } = await request.json()

    if (!cui || typeof cui !== 'string') {
      return NextResponse.json({ error: 'CUI invalid.' }, { status: 400 })
    }

    const cleanCui = cui.replace(/\D/g, '')
    if (!cleanCui || cleanCui.length < 4 || cleanCui.length > 10) {
      return NextResponse.json({ error: 'CUI invalid.' }, { status: 400 })
    }

    const supabase = await createSupabaseServer()

    // 1. Verifică cache
    const { data: cached } = await supabase
      .from('anaf_cache')
      .select('response, created_at')
      .eq('cui', cleanCui)
      .maybeSingle()

    if (cached) {
      const cachedDate = new Date(cached.created_at)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      if (cachedDate > thirtyDaysAgo) {
        return NextResponse.json(cached.response)
      }
    }

    // 2. Apel ANAF API
    const anafBody = [{ cui: parseInt(cleanCui, 10), data: getTodayString() }]

    const anafRes = await fetch(
      'https://webservicesp.anaf.ro/PlatitorTvaRest/api/v8/ws/tva',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(anafBody),
        signal: AbortSignal.timeout(8000),
      }
    )

    if (!anafRes.ok) {
      return NextResponse.json(
        { error: 'Serviciul ANAF nu răspunde. Completați manual.' },
        { status: 503 }
      )
    }

    const anafData = await anafRes.json()
    const found = anafData?.found?.[0]

    if (!found || !found.date_generale) {
      return NextResponse.json({ error: 'CUI neidentificat în registrul ANAF.' })
    }

    const dg = found.date_generale
    const tvaTrimis = found.inregistrare_scop_Tva

    // Extrage județul din adresă
    let judet = ''
    const adresaRaw: string = dg.adresa || ''
    const judetMatch = adresaRaw.match(/JUD\.?\s*([^,;]+)/i)
    if (judetMatch) {
      judet = judetMatch[1].trim()
    }

    const response: AnafResponse = {
      denumire: dg.denumire || '',
      adresa: adresaRaw,
      judet,
      caen_code: dg.cod_CAEN || '',
      tva: tvaTrimis?.scpTVA === true,
      split_tva: tvaTrimis?.data_inceput_SplitTVA ? true : false,
    }

    // 3. Salvează în cache
    await supabase.from('anaf_cache').upsert(
      { cui: cleanCui, response, created_at: new Date().toISOString() },
      { onConflict: 'cui' }
    )

    return NextResponse.json(response)
  } catch (error) {
    console.error('anaf-lookup error:', error)
    return NextResponse.json(
      { error: 'Serviciul ANAF nu răspunde. Completați manual.' },
      { status: 503 }
    )
  }
}
