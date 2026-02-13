// S-S-M.RO — TEMPLATE FIAR & BP
// Fișa de Înregistrare a Accidentelor de Muncă (FIAR) și Boli Profesionale (BP)
// Conform formularelor oficiale ITM România
// Data: 13 Februarie 2026

export interface FIARTemplate {
  // SECȚIUNEA I - DATE DESPRE ANGAJATOR
  angajator: {
    denumire: string
    cod_unic_inregistrare: string
    adresa_completa: string
    judet: string
    localitate: string
    strada: string
    numar: string
    bloc?: string
    scara?: string
    etaj?: string
    apartament?: string
    cod_postal?: string
    telefon: string
    fax?: string
    email?: string
    cod_caen: string
    activitate_principala: string
    nr_mediu_salariati: number
    din_care_femei: number
  }

  // SECȚIUNEA II - DATE DESPRE ACCIDENTAT
  accidentat: {
    nume: string
    prenume: string
    cnp: string
    sex: 'M' | 'F'
    data_nasterii: string
    cetatenie: string
    domiciliu_judet: string
    domiciliu_localitate: string
    domiciliu_strada: string
    domiciliu_numar: string
    domiciliu_bloc?: string
    domiciliu_scara?: string
    domiciliu_etaj?: string
    domiciliu_apartament?: string
    stare_civila: 'necasatorit' | 'casatorit' | 'divortat' | 'vaduv'
    studii: 'generale' | 'profesionale' | 'liceale' | 'postliceale' | 'superioare'
    profesie_de_baza: string
    vechime_in_munca_ani: number
    vechime_in_munca_luni: number
  }

  // SECȚIUNEA III - DATE DESPRE RAPORTUL DE MUNCĂ/SERVICIU
  raport_munca: {
    tip_contract: 'munca' | 'ucenicie' | 'detasare' | 'delegare' | 'alt_tip'
    specificati_alt_tip?: string
    tip_norma: 'intreg' | 'redus' | 'partial'
    ore_lucrate_pe_zi?: number
    functie_ocupata: string
    vechime_pe_functie_ani: number
    vechime_pe_functie_luni: number
    program_lucru: 'zi' | 'noapte' | 'schimburi'
    lucra_in_schimb_nr?: '1' | '2' | '3'
    avea_fisa_medicala: 'da' | 'nu'
    data_angajarii: string
    data_incetarii?: string
    motiv_incetare?: string
  }

  // SECȚIUNEA IV - DATE DESPRE ACCIDENT
  accident: {
    data_accident: string
    ora_accident: string
    data_declararii: string
    locul_accidentului: 'la_sediu' | 'in_deplasare' | 'la_tert'
    adresa_exacta_accident: string
    judet_accident: string
    localitate_accident: string
    descriere_sumara: string
    descriere_detaliata: string
    activitate_executata: string
    martor_1_nume?: string
    martor_1_functie?: string
    martor_2_nume?: string
    martor_2_functie?: string
    tip_accident: 'cu_oprire' | 'fara_oprire' | 'mortal'
    zile_incapacitate_estimat?: number
    zile_incapacitate_real?: number
    accident_de_traseu: 'da' | 'nu'
  }

  // SECȚIUNEA V - NATURA LEZIUNII ȘI PARTEA CORPULUI AFECTATĂ
  leziune: {
    natura_leziunii:
      | 'fractura'
      | 'luxatie'
      | 'entorsa'
      | 'plagă'
      | 'contuzie'
      | 'arsură'
      | 'degerătură'
      | 'intoxicare'
      | 'asfixiere'
      | 'electrocutare'
      | 'amputatie'
      | 'leziuni_multiple'
      | 'alta'
    specificati_alta?: string
    partea_corpului:
      | 'cap'
      | 'gât'
      | 'spate'
      | 'torace'
      | 'abdomen'
      | 'membre_superioare'
      | 'membre_inferioare'
      | 'corp_intreg'
      | 'organe_interne'
      | 'alte_parti'
    lateralitate?: 'stânga' | 'dreapta' | 'ambele'
    diagnostic_medical: string
    unitate_medicala: string
    medic_curant: string
  }

  // SECȚIUNEA VI - CAUZE ALE ACCIDENTULUI
  cauze: {
    cauza_principala: string
    cauze_secundare?: string[]

    // Clasificare cauze (conform metodologiei ITM)
    tip_cauza_principala:
      | 'lipsa_instruire'
      | 'lipsa_autorizare'
      | 'lipsa_eip'
      | 'eip_necorespunzator'
      | 'spatiu_necorespunzator'
      | 'echipament_defect'
      | 'lipsa_protectie'
      | 'incalcare_proceduri'
      | 'suprasolicitare'
      | 'organizare_defectuoasa'
      | 'factori_ambientali'
      | 'alta_cauza'

    specificati_alta_cauza?: string

    // Agentul material
    agent_material_cauza?: string

    // Factori de risc prezenți
    factori_risc?: string[]
  }

  // SECȚIUNEA VII - MĂSURI DE PREVENIRE
  masuri: {
    masuri_imediate: string[]
    masuri_pe_termen_scurt: string[]
    masuri_pe_termen_lung: string[]
    termen_implementare?: string
    responsabil_implementare?: string
    cost_estimat?: number
    observatii?: string
  }

  // SECȚIUNEA VIII - ANCHETA
  ancheta: {
    data_incepere_ancheta: string
    data_finalizare_ancheta?: string
    comisie_membri: Array<{
      nume: string
      functie: string
      calitate: 'presedinte' | 'membru' | 'secretar'
      reprezentant: 'angajator' | 'sindicat' | 'ITM' | 'politie' | 'alt'
    }>
    proces_verbal_nr?: string
    proces_verbal_data?: string
    concluzii: string
    recomandari: string[]
  }

  // SECȚIUNEA IX - CLASIFICARE ACCIDENT
  clasificare: {
    gravitate: 'usor' | 'mediu' | 'grav' | 'mortal' | 'colectiv'
    tip_eveniment:
      | 'accident_individual'
      | 'accident_colectiv'
      | 'accident_mortal'
      | 'accident_grav'
    accident_de_munca: 'da' | 'nu'
    accident_in_interes_serviciu: 'da' | 'nu'
    motiv_nerecunoastere?: string
    cod_clasificare_ESAW?: string
  }

  // SECȚIUNEA X - NOTIFICĂRI ȘI RAPORTĂRI
  notificari: {
    notificat_ITM: 'da' | 'nu'
    data_notificare_ITM?: string
    mod_notificare: 'telefon' | 'fax' | 'email' | 'platforma'
    nr_inregistrare_ITM?: string
    notificat_politie: 'da' | 'nu'
    data_notificare_politie?: string
    notificat_procuratura: 'da' | 'nu'
    data_notificare_procuratura?: string
  }

  // METADATE SISTEM
  metadata: {
    creat_de: string
    creat_la: string
    modificat_de?: string
    modificat_la?: string
    status: 'draft' | 'in_lucru' | 'finalizat' | 'trimis_ITM' | 'validat_ITM'
    versiune_formular: string
    organization_id: string
  }
}

export interface FisaBPTemplate {
  // SECȚIUNEA I - DATE DESPRE ANGAJATOR
  angajator: {
    denumire: string
    cod_unic_inregistrare: string
    adresa_completa: string
    judet: string
    localitate: string
    strada: string
    numar: string
    bloc?: string
    scara?: string
    etaj?: string
    apartament?: string
    cod_postal?: string
    telefon: string
    fax?: string
    email?: string
    cod_caen: string
    activitate_principala: string
    nr_mediu_salariati: number
    din_care_femei: number
    nr_salariati_expusi?: number
  }

  // SECȚIUNEA II - DATE DESPRE PERSOANA CU BOALA PROFESIONALĂ
  persoana: {
    nume: string
    prenume: string
    cnp: string
    sex: 'M' | 'F'
    data_nasterii: string
    cetatenie: string
    domiciliu_judet: string
    domiciliu_localitate: string
    domiciliu_strada: string
    domiciliu_numar: string
    domiciliu_bloc?: string
    domiciliu_scara?: string
    domiciliu_etaj?: string
    domiciliu_apartament?: string
    stare_civila: 'necasatorit' | 'casatorit' | 'divortat' | 'vaduv'
    studii: 'generale' | 'profesionale' | 'liceale' | 'postliceale' | 'superioare'
    profesie_de_baza: string
    vechime_totala_ani: number
    vechime_totala_luni: number
  }

  // SECȚIUNEA III - DATE DESPRE RAPORTUL DE MUNCĂ
  raport_munca: {
    tip_contract: 'munca' | 'ucenicie' | 'detasare' | 'delegare' | 'alt_tip'
    specificati_alt_tip?: string
    functie_ocupata: string
    data_angajarii: string
    data_incetarii?: string
    motiv_incetare?: string
    vechime_la_agentul_nociv_ani: number
    vechime_la_agentul_nociv_luni: number
  }

  // SECȚIUNEA IV - DATE DESPRE BOALA PROFESIONALĂ
  boala: {
    data_diagnosticarii: string
    data_declararii: string
    denumire_boala: string
    cod_boala_CIM_10: string
    nivel_incapacitate_munca: number
    diagnostic_complet: string
    simptome_principale: string[]
    data_aparitie_simptome?: string
    evolutie_boala: 'acuta' | 'cronica' | 'in_evolutie' | 'stabilizata'
  }

  // SECȚIUNEA V - AGENTUL CAUZATOR
  agent_cauzator: {
    tip_agent:
      | 'chimic'
      | 'fizic'
      | 'biologic'
      | 'ergonomic'
      | 'psihosocial'
      | 'combinat'
    denumire_agent: string
    cod_nomenclator?: string
    concentratie_masurata?: string
    concentratie_maxim_admisa?: string
    durata_expunere_zilnica_ore?: number
    conditii_expunere: string

    // Expunere pe perioade
    expuneri_anterioare?: Array<{
      angajator: string
      perioada_inceput: string
      perioada_sfarsit: string
      functie: string
      agent_nociv: string
      durata_expunere_ani: number
    }>
  }

  // SECȚIUNEA VI - CONDIȚII DE MUNCĂ
  conditii_munca: {
    descriere_loc_munca: string
    proces_tehnologic: string
    echipamente_utilizate: string[]
    substante_periculoase?: string[]
    masuri_protectie_existente: string[]
    eip_furnizat: 'da' | 'nu'
    tip_eip?: string[]
    eip_corespunzator: 'da' | 'nu' | 'partial'
    monitorizare_factorii_risc: 'da' | 'nu'
    data_ultima_masurare?: string
    rezultate_masuratori?: string
  }

  // SECȚIUNEA VII - SUPRAVEGHERE MEDICALĂ
  supraveghere_medicala: {
    examene_medicale_periodice: 'da' | 'nu'
    frecventa_examene?: 'anual' | 'semestrial' | 'trimestrial'
    data_ultimul_examen?: string
    rezultat_ultimul_examen?: 'apt' | 'apt_conditionat' | 'inapt_temporar' | 'inapt'
    investigatii_efectuate?: string[]
    medic_medicina_muncii: string
    unitate_medicala: string
    recomandari_medicale?: string[]
  }

  // SECȚIUNEA VIII - ANCHETA EPIDEMIOLOGICĂ
  ancheta: {
    data_incepere_ancheta: string
    data_finalizare_ancheta?: string
    comisie_membri: Array<{
      nume: string
      functie: string
      calitate: 'presedinte' | 'membru' | 'secretar'
      reprezentant: 'angajator' | 'sindicat' | 'ITM' | 'DSP' | 'medicina_muncii' | 'alt'
    }>
    proces_verbal_nr?: string
    proces_verbal_data?: string
    concluzii: string
    cauze_identificate: string[]
    legatura_cauza_efect: 'sigura' | 'probabila' | 'posibila' | 'nesigura'
  }

  // SECȚIUNEA IX - MĂSURI DE PREVENIRE
  masuri: {
    masuri_tehnice: string[]
    masuri_organizatorice: string[]
    masuri_medicale: string[]
    termen_implementare?: string
    responsabil_implementare?: string
    cost_estimat?: number
    masuri_adoptate_imediat?: string[]
    observatii?: string
  }

  // SECȚIUNEA X - CLASIFICARE ȘI RECUNOAȘTERE
  clasificare: {
    boala_profesionala_recunoscuta: 'da' | 'nu'
    motiv_nerecunoastere?: string
    inscris_in_lista_bolilor_profesionale: 'da' | 'nu'
    pozitia_lista?: string
    nivel_invaliditate?: number
    grad_invaliditate?: 'I' | 'II' | 'III'
    pensie_invaliditate: 'da' | 'nu'
    daune_materiale_acordate: 'da' | 'nu'
    suma_acordata?: number
  }

  // SECȚIUNEA XI - NOTIFICĂRI ȘI RAPORTĂRI
  notificari: {
    notificat_ITM: 'da' | 'nu'
    data_notificare_ITM?: string
    mod_notificare: 'telefon' | 'fax' | 'email' | 'platforma'
    nr_inregistrare_ITM?: string
    notificat_DSP: 'da' | 'nu'
    data_notificare_DSP?: string
    notificat_casa_sanatate: 'da' | 'nu'
    data_notificare_casa_sanatate?: string
  }

  // METADATE SISTEM
  metadata: {
    creat_de: string
    creat_la: string
    modificat_de?: string
    modificat_la?: string
    status: 'draft' | 'in_lucru' | 'finalizat' | 'trimis_ITM' | 'validat_ITM'
    versiune_formular: string
    organization_id: string
  }
}

// Template inițial FIAR
export const FIAR_INITIAL_TEMPLATE: Partial<FIARTemplate> = {
  accident: {
    tip_accident: 'cu_oprire',
    accident_de_traseu: 'nu',
    data_accident: '',
    ora_accident: '',
    data_declararii: '',
    locul_accidentului: 'la_sediu',
    adresa_exacta_accident: '',
    judet_accident: '',
    localitate_accident: '',
    descriere_sumara: '',
    descriere_detaliata: '',
    activitate_executata: '',
  },
  clasificare: {
    gravitate: 'usor',
    tip_eveniment: 'accident_individual',
    accident_de_munca: 'da',
    accident_in_interes_serviciu: 'da',
  },
  notificari: {
    notificat_ITM: 'nu',
    mod_notificare: 'platforma',
    notificat_politie: 'nu',
    notificat_procuratura: 'nu',
  },
  metadata: {
    status: 'draft',
    versiune_formular: '2026.1',
    creat_de: '',
    creat_la: new Date().toISOString(),
    organization_id: '',
  },
}

// Template inițial BP
export const BP_INITIAL_TEMPLATE: Partial<FisaBPTemplate> = {
  boala: {
    data_diagnosticarii: '',
    data_declararii: '',
    denumire_boala: '',
    cod_boala_CIM_10: '',
    nivel_incapacitate_munca: 0,
    diagnostic_complet: '',
    simptome_principale: [],
    evolutie_boala: 'in_evolutie',
  },
  conditii_munca: {
    descriere_loc_munca: '',
    proces_tehnologic: '',
    echipamente_utilizate: [],
    masuri_protectie_existente: [],
    eip_furnizat: 'nu',
    eip_corespunzator: 'nu',
    monitorizare_factorii_risc: 'nu',
  },
  supraveghere_medicala: {
    examene_medicale_periodice: 'da',
    medic_medicina_muncii: '',
    unitate_medicala: '',
  },
  clasificare: {
    boala_profesionala_recunoscuta: 'nu',
    inscris_in_lista_bolilor_profesionale: 'nu',
    pensie_invaliditate: 'nu',
    daune_materiale_acordate: 'nu',
  },
  notificari: {
    notificat_ITM: 'nu',
    mod_notificare: 'platforma',
    notificat_DSP: 'nu',
    notificat_casa_sanatate: 'nu',
  },
  metadata: {
    status: 'draft',
    versiune_formular: '2026.1',
    creat_de: '',
    creat_la: new Date().toISOString(),
    organization_id: '',
  },
}

// Constante pentru dropdown-uri și validări
export const NATURA_LEZIUNI = [
  'fractura',
  'luxatie',
  'entorsa',
  'plagă',
  'contuzie',
  'arsură',
  'degerătură',
  'intoxicare',
  'asfixiere',
  'electrocutare',
  'amputatie',
  'leziuni_multiple',
  'alta',
] as const

export const PARTI_CORP = [
  'cap',
  'gât',
  'spate',
  'torace',
  'abdomen',
  'membre_superioare',
  'membre_inferioare',
  'corp_intreg',
  'organe_interne',
  'alte_parti',
] as const

export const TIPURI_CAUZE = [
  'lipsa_instruire',
  'lipsa_autorizare',
  'lipsa_eip',
  'eip_necorespunzator',
  'spatiu_necorespunzator',
  'echipament_defect',
  'lipsa_protectie',
  'incalcare_proceduri',
  'suprasolicitare',
  'organizare_defectuoasa',
  'factori_ambientali',
  'alta_cauza',
] as const

export const TIPURI_AGENTI_NOCIVI = [
  'chimic',
  'fizic',
  'biologic',
  'ergonomic',
  'psihosocial',
  'combinat',
] as const

export const EVOLUTII_BOALA = [
  'acuta',
  'cronica',
  'in_evolutie',
  'stabilizata',
] as const

export const GRADE_INVALIDITATE = ['I', 'II', 'III'] as const

// Helper: validare CNP
export function validateCNP(cnp: string): boolean {
  if (!/^\d{13}$/.test(cnp)) return false

  const weights = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9]
  const sum = cnp
    .slice(0, 12)
    .split('')
    .reduce((acc, digit, idx) => acc + parseInt(digit) * weights[idx], 0)

  const controlDigit = sum % 11 === 10 ? 1 : sum % 11
  return controlDigit === parseInt(cnp[12])
}

// Helper: calcul vechime
export function calculateVechime(dataInceput: string, dataSfarsit?: string): { ani: number; luni: number } {
  const start = new Date(dataInceput)
  const end = dataSfarsit ? new Date(dataSfarsit) : new Date()

  let ani = end.getFullYear() - start.getFullYear()
  let luni = end.getMonth() - start.getMonth()

  if (luni < 0) {
    ani--
    luni += 12
  }

  return { ani, luni }
}
