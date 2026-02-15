// lib/services/anafApi.ts
// ANAF API integration for company data lookup by CUI

interface AnafCompanyData {
  cui: string
  name: string
  address: string
  city?: string
  county?: string
  phone?: string
  caen_code?: string
  caen_description?: string
  registration_number?: string
  status?: string
}

export async function fetchCompanyDataFromANAF(cui: string): Promise<AnafCompanyData | null> {
  try {
    // Clean CUI - remove RO prefix and spaces
    const cleanCUI = cui.replace(/^RO/i, '').replace(/\s/g, '').trim()

    if (!cleanCUI || !/^\d+$/.test(cleanCUI)) {
      throw new Error('CUI invalid')
    }

    // ANAF API v8
    const today = new Date().toISOString().split('T')[0]
    const response = await fetch('https://webservicesp.anaf.ro/AsynchWebService/api/v8/ws/tva', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{ cui: parseInt(cleanCUI), data: today }]),
    })

    if (!response.ok) {
      console.error('ANAF API error:', response.status)
      return null
    }

    const data = await response.json()

    if (!data?.found || data.found.length === 0) {
      return null
    }

    const company = data.found[0]
    const generalData = company.date_generale || {}
    const addressData = company.adresa_sediu_social || {}

    return {
      cui: cleanCUI,
      name: generalData.denumire || '',
      address: [
        addressData.sdenumire_Strada,
        addressData.snumar_Strada,
      ].filter(Boolean).join(' ') || generalData.adresa || '',
      city: addressData.sdenumire_Localitate || '',
      county: addressData.sdenumire_Judet || '',
      phone: generalData.telefon || undefined,
      caen_code: generalData.cod_CAEN?.toString() || undefined,
      caen_description: generalData.aut || undefined,
      registration_number: generalData.nrRegCom || undefined,
      status: generalData.stare_inregistrare || undefined,
    }
  } catch (error) {
    console.error('ANAF fetch error:', error)
    return null
  }
}
