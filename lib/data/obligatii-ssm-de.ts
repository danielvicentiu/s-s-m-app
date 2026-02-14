// S-S-M.RO — OBLIGAȚII SSM GERMANIA (Arbeitsschutz)
// Baza legală: ArbSchG, BetrSichV, DGUV Vorschrift 1, ArbZG
// Data: 14 Februarie 2026

import type { ObligationFrequency, CountryCode, Currency } from '@/lib/types'

export interface ObligationSSMDE {
  id: string
  name: string
  description: string
  category: 'gefaehrdungsbeurteilung' | 'unterweisung' | 'arbeitsmedizinische_vorsorge' |
    'psa' | 'betriebsanweisung' | 'asa_sitzung' | 'dokumentation' | 'pruefung'
  frequency: ObligationFrequency
  legalReference: string
  authority: string
  penaltyMin: number
  penaltyMax: number
  currency: Currency
  countryCode: CountryCode
  applicableToAll: boolean
  employeeThreshold?: number
  notes?: string
}

export const OBLIGATII_SSM_DE: ObligationSSMDE[] = [
  // ═══════════════════════════════════════════════════════════
  // GEFÄHRDUNGSBEURTEILUNG (Evaluarea riscurilor)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'de-ssm-001',
    name: 'Gefährdungsbeurteilung erstellen',
    description: 'Evaluarea riscurilor pentru toate locurile de muncă și activitățile. Obligatoriu pentru toate companiile, indiferent de mărime.',
    category: 'gefaehrdungsbeurteilung',
    frequency: 'annual',
    legalReference: '§ 5 ArbSchG, § 3 BetrSichV',
    authority: 'Gewerbeaufsichtsamt / Berufsgenossenschaft',
    penaltyMin: 500,
    penaltyMax: 25000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: true,
    notes: 'Trebuie actualizată la modificări semnificative sau la accidente'
  },
  {
    id: 'de-ssm-002',
    name: 'Gefährdungsbeurteilung dokumentieren',
    description: 'Documentarea evaluării riscurilor în formă scrisă. Obligatoriu pentru companii cu 10+ angajați, recomandat pentru toate.',
    category: 'gefaehrdungsbeurteilung',
    frequency: 'annual',
    legalReference: '§ 6 ArbSchG',
    authority: 'Gewerbeaufsichtsamt',
    penaltyMin: 250,
    penaltyMax: 5000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: false,
    employeeThreshold: 10,
    notes: 'Sub 10 angajați: documentarea este opțională dar recomandată'
  },
  {
    id: 'de-ssm-003',
    name: 'Mutterschutz-Gefährdungsbeurteilung',
    description: 'Evaluarea riscurilor specifice pentru gravide și mame care alăptează.',
    category: 'gefaehrdungsbeurteilung',
    frequency: 'on_demand',
    legalReference: '§ 10 MuSchG',
    authority: 'Gewerbeaufsichtsamt',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: true,
    notes: 'Se efectuează preventiv sau la anunțarea sarcinii'
  },
  {
    id: 'de-ssm-004',
    name: 'Psychische Gefährdungsbeurteilung',
    description: 'Evaluarea riscurilor psihosociale la locul de muncă (stres, presiune, hărțuire).',
    category: 'gefaehrdungsbeurteilung',
    frequency: 'annual',
    legalReference: '§ 5 ArbSchG',
    authority: 'Gewerbeaufsichtsamt',
    penaltyMin: 500,
    penaltyMax: 25000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: true,
    notes: 'Parte integrantă din Gefährdungsbeurteilung generală din 2013'
  },

  // ═══════════════════════════════════════════════════════════
  // UNTERWEISUNG (Instruiri securitate muncă)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'de-ssm-005',
    name: 'Erstunterweisung vor Arbeitsaufnahme',
    description: 'Instruire inițială obligatorie înainte de începerea activității pentru toți angajații.',
    category: 'unterweisung',
    frequency: 'once',
    legalReference: '§ 12 ArbSchG, § 4 DGUV Vorschrift 1',
    authority: 'Berufsgenossenschaft',
    penaltyMin: 250,
    penaltyMax: 5000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: true,
    notes: 'Înainte de prima zi de muncă sau la schimbarea postului'
  },
  {
    id: 'de-ssm-006',
    name: 'Jährliche Unterweisung',
    description: 'Instruire anuală de securitate și sănătate în muncă pentru toți angajații.',
    category: 'unterweisung',
    frequency: 'annual',
    legalReference: '§ 12 ArbSchG, § 4 DGUV Vorschrift 1',
    authority: 'Berufsgenossenschaft',
    penaltyMin: 500,
    penaltyMax: 10000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: true,
    notes: 'Minimum o dată pe an, mai frecvent pentru locuri periculoase'
  },
  {
    id: 'de-ssm-007',
    name: 'Jugendliche Unterweisung (halbjährlich)',
    description: 'Instruire semestrială obligatorie pentru angajați sub 18 ani.',
    category: 'unterweisung',
    frequency: 'biannual',
    legalReference: '§ 29 JArbSchG',
    authority: 'Gewerbeaufsichtsamt',
    penaltyMin: 500,
    penaltyMax: 15000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: false,
    notes: 'La fiecare 6 luni pentru tinerii sub 18 ani'
  },
  {
    id: 'de-ssm-008',
    name: 'Unterweisung nach Unfall',
    description: 'Instruire extraordinară după accident sau incident de muncă.',
    category: 'unterweisung',
    frequency: 'on_demand',
    legalReference: '§ 12 ArbSchG',
    authority: 'Berufsgenossenschaft',
    penaltyMin: 250,
    penaltyMax: 5000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: true,
    notes: 'Obligatorie pentru toți angajații expuși riscului similar'
  },
  {
    id: 'de-ssm-009',
    name: 'Dokumentation der Unterweisung',
    description: 'Documentarea instruirilor cu semnături, date și conținut.',
    category: 'dokumentation',
    frequency: 'annual',
    legalReference: '§ 12 Abs. 1 ArbSchG',
    authority: 'Gewerbeaufsichtsamt',
    penaltyMin: 200,
    penaltyMax: 3000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: true,
    notes: 'Probă în caz de accident sau control'
  },

  // ═══════════════════════════════════════════════════════════
  // ARBEITSMEDIZINISCHE VORSORGE (Control medical)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'de-ssm-010',
    name: 'Pflichtvorsorge bei Gefahrstoffen',
    description: 'Control medical obligatoriu pentru expunere la substanțe periculoase.',
    category: 'arbeitsmedizinische_vorsorge',
    frequency: 'annual',
    legalReference: 'ArbMedVV Anhang Teil 1',
    authority: 'Betriebsarzt / Berufsgenossenschaft',
    penaltyMin: 1000,
    penaltyMax: 25000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: false,
    notes: 'Obligatoriu înainte de începerea activității și periodic'
  },
  {
    id: 'de-ssm-011',
    name: 'Angebotsvorsorge Bildschirmarbeit',
    description: 'Ofertă control oftalmologic pentru muncă la calculator (>1h/zi).',
    category: 'arbeitsmedizinische_vorsorge',
    frequency: 'biannual',
    legalReference: 'ArbMedVV Anhang Teil 4, § 6 ArbStättV',
    authority: 'Betriebsarzt',
    penaltyMin: 200,
    penaltyMax: 5000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: true,
    notes: 'Angajatorul trebuie să ofere, angajatul decide dacă acceptă. Pentru toți care lucrează >1h/zi la computer'
  },
  {
    id: 'de-ssm-012',
    name: 'Pflichtvorsorge Lärm (>85 dB)',
    description: 'Control medical obligatoriu la expunere continuă peste 85 dB.',
    category: 'arbeitsmedizinische_vorsorge',
    frequency: 'annual',
    legalReference: 'ArbMedVV Anhang Teil 3',
    authority: 'Betriebsarzt',
    penaltyMin: 1000,
    penaltyMax: 20000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: false,
    notes: 'La nivel de zgomot >85 dB(A) pe 8h'
  },
  {
    id: 'de-ssm-013',
    name: 'Wunschvorsorge bereitstellen',
    description: 'Punerea la dispoziție a controlului medical la cererea angajatului.',
    category: 'arbeitsmedizinische_vorsorge',
    frequency: 'on_demand',
    legalReference: '§ 5a ArbMedVV',
    authority: 'Betriebsarzt',
    penaltyMin: 100,
    penaltyMax: 2500,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: true,
    notes: 'Angajatul poate solicita oricând un consult medical'
  },

  // ═══════════════════════════════════════════════════════════
  // PSA (Echipament de protecție)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'de-ssm-014',
    name: 'PSA-Bereitstellung',
    description: 'Punerea la dispoziție gratuită a echipamentului de protecție (PSA) conform Gefährdungsbeurteilung.',
    category: 'psa',
    frequency: 'on_demand',
    legalReference: '§ 3 PSA-BV',
    authority: 'Gewerbeaufsichtsamt',
    penaltyMin: 500,
    penaltyMax: 10000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: false,
    notes: 'Gratuit pentru angajați, include înlocuire la uzură'
  },
  {
    id: 'de-ssm-015',
    name: 'PSA-Unterweisung',
    description: 'Instruire privind utilizarea corectă a echipamentului de protecție.',
    category: 'psa',
    frequency: 'annual',
    legalReference: '§ 3 Abs. 2 PSA-BV',
    authority: 'Berufsgenossenschaft',
    penaltyMin: 250,
    penaltyMax: 5000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: false,
    notes: 'La emiterea PSA și periodic'
  },
  {
    id: 'de-ssm-016',
    name: 'PSA-Prüfung (Absturzsicherung)',
    description: 'Verificare anuală a echipamentului de protecție împotriva căderilor de la înălțime.',
    category: 'pruefung',
    frequency: 'annual',
    legalReference: '§ 2 PSA-BV, DGUV Regel 112-198',
    authority: 'Befähigte Person / Sachkundiger',
    penaltyMin: 1000,
    penaltyMax: 15000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: false,
    notes: 'Hamuri, corzi, sisteme de prindere'
  },

  // ═══════════════════════════════════════════════════════════
  // BETRIEBSANWEISUNG (Instrucțiuni de lucru)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'de-ssm-017',
    name: 'Betriebsanweisung für Maschinen',
    description: 'Instrucțiuni de lucru în limba germană pentru fiecare mașină/utilaj.',
    category: 'betriebsanweisung',
    frequency: 'on_demand',
    legalReference: '§ 9 BetrSichV',
    authority: 'Gewerbeaufsichtsamt',
    penaltyMin: 500,
    penaltyMax: 10000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: false,
    notes: 'Afișate la locul de utilizare'
  },
  {
    id: 'de-ssm-018',
    name: 'Betriebsanweisung für Gefahrstoffe',
    description: 'Instrucțiuni de lucru pentru substanțe periculoase (bazate pe FDS).',
    category: 'betriebsanweisung',
    frequency: 'on_demand',
    legalReference: '§ 14 GefStoffV',
    authority: 'Gewerbeaufsichtsamt',
    penaltyMin: 1000,
    penaltyMax: 20000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: false,
    notes: 'Actualizare la schimbarea FDS sau procesului'
  },
  {
    id: 'de-ssm-019',
    name: 'Betriebsanweisung für biologische Arbeitsstoffe',
    description: 'Instrucțiuni de lucru pentru agenți biologici (spitale, laboratoare, abatoare).',
    category: 'betriebsanweisung',
    frequency: 'on_demand',
    legalReference: '§ 14 BioStoffV',
    authority: 'Gewerbeaufsichtsamt',
    penaltyMin: 1000,
    penaltyMax: 20000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: false,
    notes: 'Pentru activități cu expunere la microorganisme'
  },

  // ═══════════════════════════════════════════════════════════
  // ASA-SITZUNG (Comitet SSM)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'de-ssm-020',
    name: 'ASA-Sitzung vierteljährlich',
    description: 'Ședință trimestrială a Comitetului de Securitate și Sănătate (Arbeitsschutzausschuss).',
    category: 'asa_sitzung',
    frequency: 'quarterly',
    legalReference: '§ 11 ASiG',
    authority: 'Gewerbeaufsichtsamt',
    penaltyMin: 500,
    penaltyMax: 10000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: false,
    employeeThreshold: 20,
    notes: 'Obligatoriu pentru >20 angajați. Participă: angajator, Fachkraft für Arbeitssicherheit, Betriebsarzt, Betriebsrat, Sicherheitsbeauftragter'
  },
  {
    id: 'de-ssm-021',
    name: 'ASA-Protokoll erstellen',
    description: 'Redactarea procesului-verbal al ședinței ASA.',
    category: 'asa_sitzung',
    frequency: 'quarterly',
    legalReference: '§ 11 ASiG (best practice)',
    authority: 'Gewerbeaufsichtsamt',
    penaltyMin: 100,
    penaltyMax: 2000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: false,
    employeeThreshold: 20,
    notes: 'Nu e legal obligatoriu dar probă importantă'
  },

  // ═══════════════════════════════════════════════════════════
  // PRUEFUNG (Verificări tehnice)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'de-ssm-022',
    name: 'Prüfung elektrischer Betriebsmittel',
    description: 'Verificarea echipamentelor electrice (DGUV V3): fix (4 ani), mobil (6-12 luni).',
    category: 'pruefung',
    frequency: 'annual',
    legalReference: 'DGUV Vorschrift 3, § 5 BetrSichV',
    authority: 'Elektrofachkraft',
    penaltyMin: 500,
    penaltyMax: 15000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: true,
    notes: 'Fix: 4 ani / Mobil (șantiere): 6 luni / Birou: 12 luni'
  },
  {
    id: 'de-ssm-023',
    name: 'Leiterprüfung',
    description: 'Verificarea scărilor și a platformelor înainte de fiecare utilizare și anual formal.',
    category: 'pruefung',
    frequency: 'annual',
    legalReference: 'DGUV Information 208-016, § 4 BetrSichV',
    authority: 'Befähigte Person',
    penaltyMin: 200,
    penaltyMax: 5000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: true,
    notes: 'Control vizual zilnic + verificare anuală documentată'
  },
  {
    id: 'de-ssm-024',
    name: 'Prüfung von Flurförderzeugen',
    description: 'Verificarea stivuitoarelor și a utilajelor de ridicat: zilnic (operator) + anual (expert).',
    category: 'pruefung',
    frequency: 'annual',
    legalReference: '§ 14 BetrSichV, DGUV Regel 108-007',
    authority: 'Befähigte Person / Sachverständiger',
    penaltyMin: 1000,
    penaltyMax: 20000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: false,
    notes: 'Control zilnic + verificare anuală detaliată'
  },
  {
    id: 'de-ssm-025',
    name: 'Prüfung von Druckbehältern',
    description: 'Verificarea recipientelor sub presiune (compresoare, butelii).',
    category: 'pruefung',
    frequency: 'biannual',
    legalReference: '§ 15-16 BetrSichV, TRBS 1201',
    authority: 'ZÜS (Zugelassene Überwachungsstelle)',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: false,
    notes: 'Interval în funcție de categoria recipientului (2-10 ani)'
  },
  {
    id: 'de-ssm-026',
    name: 'Prüfung von Regalen',
    description: 'Verificarea rafturilor de depozitare (paletare): săptămânal (vizual) + anual (expert).',
    category: 'pruefung',
    frequency: 'annual',
    legalReference: 'DGUV Regel 108-007, DIN EN 15635',
    authority: 'Befähigte Person',
    penaltyMin: 500,
    penaltyMax: 10000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: false,
    notes: 'Control săptămânal vizual + anual documentat'
  },

  // ═══════════════════════════════════════════════════════════
  // DOKUMENTATION & ORGANIZARE
  // ═══════════════════════════════════════════════════════════
  {
    id: 'de-ssm-027',
    name: 'Bestellung Fachkraft für Arbeitssicherheit',
    description: 'Numirea unui responsabil cu securitatea muncii (Fachkraft für Arbeitssicherheit - Sifa).',
    category: 'dokumentation',
    frequency: 'once',
    legalReference: '§ 5 ASiG',
    authority: 'Gewerbeaufsichtsamt',
    penaltyMin: 1000,
    penaltyMax: 25000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: true,
    notes: 'Obligatoriu de la primul angajat. Poate fi extern.'
  },
  {
    id: 'de-ssm-028',
    name: 'Bestellung Betriebsarzt',
    description: 'Numirea unui medic de medicina muncii (Betriebsarzt).',
    category: 'dokumentation',
    frequency: 'once',
    legalReference: '§ 2 ASiG',
    authority: 'Gewerbeaufsichtsamt',
    penaltyMin: 1000,
    penaltyMax: 25000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: true,
    notes: 'Obligatoriu de la primul angajat. Poate fi extern.'
  },
  {
    id: 'de-ssm-029',
    name: 'Bestellung Sicherheitsbeauftragter',
    description: 'Numirea unui reprezentant pentru securitatea muncii din rândul angajaților.',
    category: 'dokumentation',
    frequency: 'once',
    legalReference: '§ 22 SGB VII, DGUV Vorschrift 1',
    authority: 'Berufsgenossenschaft',
    penaltyMin: 500,
    penaltyMax: 10000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: false,
    employeeThreshold: 20,
    notes: 'Obligatoriu pentru >20 angajați. Rol consultativ.'
  },
  {
    id: 'de-ssm-030',
    name: 'Verbandbuch führen',
    description: 'Registrul de prim ajutor - documentarea tuturor accidentelor și îngrijirilor medicale.',
    category: 'dokumentation',
    frequency: 'on_demand',
    legalReference: 'DGUV Vorschrift 1 § 24 Abs. 6',
    authority: 'Berufsgenossenschaft',
    penaltyMin: 200,
    penaltyMax: 5000,
    currency: 'EUR',
    countryCode: 'DE',
    applicableToAll: true,
    notes: 'Păstrare 5 ani. Important pentru asigurări și statistici.'
  }
]

// Helper: Filtrare după categorie
export function getObligationsByCategory(category: ObligationSSMDE['category']): ObligationSSMDE[] {
  return OBLIGATII_SSM_DE.filter(obl => obl.category === category)
}

// Helper: Obligații aplicabile tuturor companiilor
export function getMandatoryObligations(): ObligationSSMDE[] {
  return OBLIGATII_SSM_DE.filter(obl => obl.applicableToAll)
}

// Helper: Obligații în funcție de numărul de angajați
export function getObligationsByEmployeeCount(employeeCount: number): ObligationSSMDE[] {
  return OBLIGATII_SSM_DE.filter(obl => {
    if (obl.applicableToAll) return true
    if (!obl.employeeThreshold) return false
    return employeeCount >= obl.employeeThreshold
  })
}

// Helper: Statistici categorii
export function getObligationStats() {
  const stats = OBLIGATII_SSM_DE.reduce((acc, obl) => {
    acc[obl.category] = (acc[obl.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    total: OBLIGATII_SSM_DE.length,
    byCategory: stats,
    mandatory: getMandatoryObligations().length
  }
}

export const CATEGORIES_DE = {
  gefaehrdungsbeurteilung: 'Gefährdungsbeurteilung (Evaluare riscuri)',
  unterweisung: 'Unterweisung (Instruiri)',
  arbeitsmedizinische_vorsorge: 'Arbeitsmedizinische Vorsorge (Control medical)',
  psa: 'PSA (Echipament de protecție)',
  betriebsanweisung: 'Betriebsanweisung (Instrucțiuni de lucru)',
  asa_sitzung: 'ASA-Sitzung (Comitet SSM)',
  dokumentation: 'Dokumentation (Documentare)',
  pruefung: 'Prüfung (Verificări tehnice)'
} as const
