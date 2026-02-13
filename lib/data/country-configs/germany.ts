/**
 * Germany configuration package
 * Includes: legislation (ArbSchG, DGUV), training types, medical types (Betriebsarzt),
 * penalties (EUR), holidays per Bundesland, authority BAuA/Berufsgenossenschaft, document templates DE
 *
 * Export: germanyConfig
 */

// ══════════════════════════════════════════════════════════════════════════════
// LEGISLATION - German SSM/PSI Acts (ArbSchG, DGUV references)
// ══════════════════════════════════════════════════════════════════════════════

export interface GermanyLegislation {
  id: string
  country_code: 'DE'
  domain: 'SSM' | 'PSI' | 'MEDICAL' | 'LABOR'
  act_number: string
  act_date: string
  title: string
  title_de: string
  official_journal_ref: string | null
  source_url: string | null
  description: string
}

export const germanyLegislation: GermanyLegislation[] = [
  {
    id: 'de-arbschg',
    country_code: 'DE',
    domain: 'SSM',
    act_number: 'ArbSchG',
    act_date: '1996-08-07',
    title: 'Legea privind protecția muncii',
    title_de: 'Arbeitsschutzgesetz (ArbSchG)',
    official_journal_ref: 'BGBl. I S. 1246',
    source_url: 'https://www.gesetze-im-internet.de/arbschg/',
    description: 'Legea fundamentală pentru protecția sănătății și securității la locul de muncă în Germania, stabilește obligațiile angajatorilor și drepturile angajaților.'
  },
  {
    id: 'de-asig',
    country_code: 'DE',
    domain: 'SSM',
    act_number: 'ArbSIG',
    act_date: '1973-12-12',
    title: 'Legea medicilor de medicină a muncii',
    title_de: 'Arbeitssicherheitsgesetz (ASiG)',
    official_journal_ref: 'BGBl. I S. 1885',
    source_url: 'https://www.gesetze-im-internet.de/asig/',
    description: 'Reglementează obligația angajatorilor de a angaja medici de medicină a muncii (Betriebsarzt) și specialiști în protecția muncii (Fachkraft für Arbeitssicherheit).'
  },
  {
    id: 'de-arbstattv',
    country_code: 'DE',
    domain: 'SSM',
    act_number: 'ArbStättV',
    act_date: '2004-08-12',
    title: 'Ordonanța privind locurile de muncă',
    title_de: 'Arbeitsstättenverordnung (ArbStättV)',
    official_journal_ref: 'BGBl. I S. 2179',
    source_url: 'https://www.gesetze-im-internet.de/arbst_ttv_2004/',
    description: 'Stabilește cerințele pentru amenajarea și exploatarea locurilor de muncă, inclusiv ventilație, iluminat, căi de evacuare și condiții sanitare.'
  },
  {
    id: 'de-dguv-v1',
    country_code: 'DE',
    domain: 'SSM',
    act_number: 'DGUV Vorschrift 1',
    act_date: '2014-01-01',
    title: 'DGUV Prescripția 1 - Principii de prevenire',
    title_de: 'DGUV Vorschrift 1 - Grundsätze der Prävention',
    official_journal_ref: null,
    source_url: 'https://publikationen.dguv.de/regelwerk/dguv-vorschriften/1114/dguv-vorschrift-1-grundsaetze-der-praevention',
    description: 'Principiile fundamentale ale prevenției accidentelor de muncă și bolilor profesionale, obligatorii pentru toți membrii asigurărilor sociale de accident (Berufsgenossenschaft).'
  },
  {
    id: 'de-dguv-v2',
    country_code: 'DE',
    domain: 'MEDICAL',
    act_number: 'DGUV Vorschrift 2',
    act_date: '2011-01-01',
    title: 'DGUV Prescripția 2 - Medici și specialiști în protecția muncii',
    title_de: 'DGUV Vorschrift 2 - Betriebsärzte und Fachkräfte für Arbeitssicherheit',
    official_journal_ref: null,
    source_url: 'https://publikationen.dguv.de/regelwerk/dguv-vorschriften/1681/dguv-vorschrift-2-betriebsaerzte-und-fachkraefte-fuer-arbeitssicherheit',
    description: 'Reglementează cerințele pentru angajarea și activitatea medicilor de medicină a muncii și specialiștilor în protecția muncii.'
  },
  {
    id: 'de-arbmedvv',
    country_code: 'DE',
    domain: 'MEDICAL',
    act_number: 'ArbMedVV',
    act_date: '2008-12-18',
    title: 'Ordonanța privind medicina muncii',
    title_de: 'Verordnung zur arbeitsmedizinischen Vorsorge (ArbMedVV)',
    official_journal_ref: 'BGBl. I S. 2768',
    source_url: 'https://www.gesetze-im-internet.de/arbmedvv/',
    description: 'Stabilește obligațiile angajatorilor privind controalele medicale preventive pentru angajați, în funcție de riscurile la locul de muncă.'
  },
  {
    id: 'de-gefahrstoffv',
    country_code: 'DE',
    domain: 'SSM',
    act_number: 'GefStoffV',
    act_date: '2010-11-26',
    title: 'Ordonanța privind substanțele periculoase',
    title_de: 'Gefahrstoffverordnung (GefStoffV)',
    official_journal_ref: 'BGBl. I S. 1643',
    source_url: 'https://www.gesetze-im-internet.de/gefstoffv_2010/',
    description: 'Reglementează protecția lucrătorilor împotriva riscurilor generate de substanțe periculoase, inclusiv evaluarea riscurilor și măsuri de protecție.'
  },
  {
    id: 'de-betrsichv',
    country_code: 'DE',
    domain: 'SSM',
    act_number: 'BetrSichV',
    act_date: '2015-02-03',
    title: 'Ordonanța privind siguranța operațională',
    title_de: 'Betriebssicherheitsverordnung (BetrSichV)',
    official_journal_ref: 'BGBl. I S. 49',
    source_url: 'https://www.gesetze-im-internet.de/betrsichv_2015/',
    description: 'Stabilește cerințe pentru utilizarea în siguranță a echipamentelor de lucru, inclusiv inspecții periodice și măsuri de protecție.'
  },
  {
    id: 'de-psg',
    country_code: 'DE',
    domain: 'PSI',
    act_number: 'PSG',
    act_date: '2015-11-01',
    title: 'Legea privind prevenirea incendiilor',
    title_de: 'Gesetz über den Brandschutz (varies per Bundesland)',
    official_journal_ref: null,
    source_url: null,
    description: 'Reglementările privind protecția împotriva incendiilor variază în funcție de Land (stat federal), dar stabilesc cerințe comune pentru prevenire, detectare și stingere.'
  },
  {
    id: 'de-arbzg',
    country_code: 'DE',
    domain: 'LABOR',
    act_number: 'ArbZG',
    act_date: '1994-06-06',
    title: 'Legea timpului de lucru',
    title_de: 'Arbeitszeitgesetz (ArbZG)',
    official_journal_ref: 'BGBl. I S. 1170',
    source_url: 'https://www.gesetze-im-internet.de/arbzg/',
    description: 'Reglementează timpul de lucru maxim, pauzele obligatorii, lucrul duminical și de noapte pentru protecția sănătății lucrătorilor.'
  }
]

// ══════════════════════════════════════════════════════════════════════════════
// TRAINING TYPES - German SSM/PSI training categories
// ══════════════════════════════════════════════════════════════════════════════

export interface GermanyTrainingType {
  id: string
  country_code: 'DE'
  name: string
  name_de: string
  description: string
  frequency: 'annual' | 'biannual' | 'once' | 'on_demand'
  duration_hours: number
  is_mandatory: boolean
  category: 'SSM' | 'PSI' | 'FIRST_AID' | 'SPECIALIZED'
  legal_reference: string
}

export const germanyTrainingTypes: GermanyTrainingType[] = [
  {
    id: 'de-training-initial-ssm',
    country_code: 'DE',
    name: 'Instruire inițială în protecția muncii',
    name_de: 'Erstunterweisung Arbeitsschutz',
    description: 'Instruire obligatorie pentru toți angajații noi înainte de începerea activității, acoperind riscurile generale și specifice postului.',
    frequency: 'once',
    duration_hours: 2,
    is_mandatory: true,
    category: 'SSM',
    legal_reference: 'ArbSchG § 12'
  },
  {
    id: 'de-training-periodic-ssm',
    country_code: 'DE',
    name: 'Instruire periodică în protecția muncii',
    name_de: 'Jährliche Unterweisung Arbeitsschutz',
    description: 'Instruire anuală obligatorie pentru actualizarea cunoștințelor despre riscuri și măsuri de protecție.',
    frequency: 'annual',
    duration_hours: 1.5,
    is_mandatory: true,
    category: 'SSM',
    legal_reference: 'ArbSchG § 12, DGUV Vorschrift 1 § 4'
  },
  {
    id: 'de-training-fire-safety',
    country_code: 'DE',
    name: 'Instruire PSI',
    name_de: 'Brandschutzunterweisung',
    description: 'Instruire obligatorie pentru protecția împotriva incendiilor, utilizarea echipamentelor de stingere și proceduri de evacuare.',
    frequency: 'annual',
    duration_hours: 2,
    is_mandatory: true,
    category: 'PSI',
    legal_reference: 'ArbSchG § 10, ArbStättV § 4'
  },
  {
    id: 'de-training-fire-safety-officer',
    country_code: 'DE',
    name: 'Responsabil cu protecția împotriva incendiilor',
    name_de: 'Brandschutzhelfer Ausbildung',
    description: 'Formare specializată pentru responsabilii cu protecția împotriva incendiilor (min. 5% din angajați trebuie să fie instruiți).',
    frequency: 'biannual',
    duration_hours: 8,
    is_mandatory: true,
    category: 'PSI',
    legal_reference: 'ArbSchG § 10, ASR A2.2'
  },
  {
    id: 'de-training-first-aid',
    country_code: 'DE',
    name: 'Prim ajutor',
    name_de: 'Erste-Hilfe-Ausbildung',
    description: 'Formare completă în acordarea primului ajutor (min. 10% din angajați în birouri, 20% în producție trebuie să fie instruiți).',
    frequency: 'biannual',
    duration_hours: 9,
    is_mandatory: true,
    category: 'FIRST_AID',
    legal_reference: 'DGUV Vorschrift 1 § 26'
  },
  {
    id: 'de-training-first-aid-refresher',
    country_code: 'DE',
    name: 'Actualizare prim ajutor',
    name_de: 'Erste-Hilfe-Fortbildung',
    description: 'Curs de actualizare pentru responsabilii cu primul ajutor.',
    frequency: 'biannual',
    duration_hours: 9,
    is_mandatory: true,
    category: 'FIRST_AID',
    legal_reference: 'DGUV Vorschrift 1 § 26'
  },
  {
    id: 'de-training-forklift',
    country_code: 'DE',
    name: 'Operator stivuitor',
    name_de: 'Staplerfahrer Ausbildung',
    description: 'Formare specializată obligatorie pentru operatorii de stivuitoare și echipamente de ridicare.',
    frequency: 'annual',
    duration_hours: 21,
    is_mandatory: true,
    category: 'SPECIALIZED',
    legal_reference: 'DGUV Grundsatz 308-001'
  },
  {
    id: 'de-training-height-work',
    country_code: 'DE',
    name: 'Lucru la înălțime',
    name_de: 'Arbeiten in der Höhe',
    description: 'Instruire specializată pentru lucrări la înălțime și utilizarea echipamentelor de protecție împotriva căderilor.',
    frequency: 'annual',
    duration_hours: 8,
    is_mandatory: true,
    category: 'SPECIALIZED',
    legal_reference: 'DGUV Regel 112-198'
  },
  {
    id: 'de-training-electrical',
    country_code: 'DE',
    name: 'Lucru cu instalații electrice',
    name_de: 'Elektrofachkraft Schulung',
    description: 'Formare specializată pentru lucrul cu instalații și echipamente electrice.',
    frequency: 'annual',
    duration_hours: 16,
    is_mandatory: true,
    category: 'SPECIALIZED',
    legal_reference: 'DGUV Vorschrift 3'
  },
  {
    id: 'de-training-hazardous-substances',
    country_code: 'DE',
    name: 'Lucru cu substanțe periculoase',
    name_de: 'Gefahrstoffunterweisung',
    description: 'Instruire obligatorie pentru manipularea substanțelor chimice și biologice periculoase.',
    frequency: 'annual',
    duration_hours: 4,
    is_mandatory: true,
    category: 'SPECIALIZED',
    legal_reference: 'GefStoffV § 14'
  },
  {
    id: 'de-training-crane-operator',
    country_code: 'DE',
    name: 'Operator macara',
    name_de: 'Kranführer Ausbildung',
    description: 'Formare specializată pentru operatorii de macarale.',
    frequency: 'annual',
    duration_hours: 32,
    is_mandatory: true,
    category: 'SPECIALIZED',
    legal_reference: 'DGUV Grundsatz 309-003'
  },
  {
    id: 'de-training-confined-spaces',
    country_code: 'DE',
    name: 'Lucru în spații închise',
    name_de: 'Arbeiten in engen Räumen',
    description: 'Instruire pentru lucrul în spații închise (rezervoare, buncare, șanțuri etc.).',
    frequency: 'annual',
    duration_hours: 6,
    is_mandatory: true,
    category: 'SPECIALIZED',
    legal_reference: 'DGUV Regel 113-004'
  }
]

// ══════════════════════════════════════════════════════════════════════════════
// MEDICAL EXAMINATION TYPES - German Betriebsarzt requirements
// ══════════════════════════════════════════════════════════════════════════════

export interface GermanyMedicalType {
  id: string
  country_code: 'DE'
  name: string
  name_de: string
  description: string
  examination_type: 'pflicht' | 'angebot' | 'wunsch' // Mandatory, Offered, On-request
  frequency_months: number | null
  is_mandatory: boolean
  legal_reference: string
  applies_to: string
}

export const germanyMedicalTypes: GermanyMedicalType[] = [
  {
    id: 'de-medical-pflicht-gefahrstoffe',
    country_code: 'DE',
    name: 'Control medical obligatoriu - substanțe periculoase',
    name_de: 'Pflichtvorsorge bei Gefahrstoffen',
    description: 'Control medical obligatoriu pentru lucrătorii expuși la substanțe cancerigene, mutagene sau toxice pentru reproducere.',
    examination_type: 'pflicht',
    frequency_months: 12,
    is_mandatory: true,
    legal_reference: 'ArbMedVV Anhang Teil 1',
    applies_to: 'Lucrători expuși la substanțe CMR (cancerigene, mutagene, reprotoxice)'
  },
  {
    id: 'de-medical-pflicht-biological',
    country_code: 'DE',
    name: 'Control medical obligatoriu - agenți biologici',
    name_de: 'Pflichtvorsorge bei biologischen Arbeitsstoffen',
    description: 'Control medical obligatoriu pentru expunerea la agenți biologici din grupa 2-4 sau contact cu fluide corporale.',
    examination_type: 'pflicht',
    frequency_months: 12,
    is_mandatory: true,
    legal_reference: 'ArbMedVV Anhang Teil 2',
    applies_to: 'Lucrători în sănătate, laboratoare, tratarea deșeurilor'
  },
  {
    id: 'de-medical-pflicht-noise',
    country_code: 'DE',
    name: 'Control medical obligatoriu - zgomot',
    name_de: 'Pflichtvorsorge bei Lärm',
    description: 'Control medical obligatoriu pentru expunerea la zgomot peste 85 dB(A) sau presiune acustică de vârf peste 137 dB(C).',
    examination_type: 'pflicht',
    frequency_months: 36,
    is_mandatory: true,
    legal_reference: 'ArbMedVV Anhang Teil 3',
    applies_to: 'Lucrători expuși la zgomot > 85 dB(A)'
  },
  {
    id: 'de-medical-pflicht-vibration',
    country_code: 'DE',
    name: 'Control medical obligatoriu - vibrații',
    name_de: 'Pflichtvorsorge bei Vibrationen',
    description: 'Control medical obligatoriu pentru expunerea la vibrații mână-braț sau corp întreg peste valorile limită.',
    examination_type: 'pflicht',
    frequency_months: 36,
    is_mandatory: true,
    legal_reference: 'ArbMedVV Anhang Teil 3',
    applies_to: 'Lucrători expuși la vibrații (ex: lucru cu scule vibrante)'
  },
  {
    id: 'de-medical-angebot-screen-work',
    country_code: 'DE',
    name: 'Control medical opțional - lucru la monitor',
    name_de: 'Angebotsvorsorge Bildschirmarbeit',
    description: 'Control medical oferit angajaților care lucrează regulat la calculator/monitor.',
    examination_type: 'angebot',
    frequency_months: 60,
    is_mandatory: false,
    legal_reference: 'ArbMedVV Anhang Teil 4',
    applies_to: 'Lucrători la calculator peste 3 ore/zi'
  },
  {
    id: 'de-medical-angebot-night-shift',
    country_code: 'DE',
    name: 'Control medical opțional - lucrul nocturn',
    name_de: 'Angebotsvorsorge Nacht- und Schichtarbeit',
    description: 'Control medical oferit lucrătorilor în ture de noapte sau schimburi permanente.',
    examination_type: 'angebot',
    frequency_months: 36,
    is_mandatory: false,
    legal_reference: 'ArbMedVV Anhang Teil 4, ArbZG § 6',
    applies_to: 'Lucrători în ture de noapte'
  },
  {
    id: 'de-medical-angebot-lifting',
    country_code: 'DE',
    name: 'Control medical opțional - manevrare manuală greutăți',
    name_de: 'Angebotsvorsorge Lastenhandhabung',
    description: 'Control medical oferit pentru activități cu ridicare/transport manual de greutăți.',
    examination_type: 'angebot',
    frequency_months: 36,
    is_mandatory: false,
    legal_reference: 'ArbMedVV Anhang Teil 4',
    applies_to: 'Lucrători cu sarcini fizice importante'
  },
  {
    id: 'de-medical-wunsch',
    country_code: 'DE',
    name: 'Control medical la cerere',
    name_de: 'Wunschvorsorge',
    description: 'Control medical la cererea angajatului dacă suspectează că activitatea sa profesională afectează sănătatea.',
    examination_type: 'wunsch',
    frequency_months: null,
    is_mandatory: false,
    legal_reference: 'ArbSchG § 11, ArbMedVV § 5a',
    applies_to: 'Orice angajat care solicită'
  },
  {
    id: 'de-medical-betriebsarzt-care',
    country_code: 'DE',
    name: 'Îngrijire medicală de întreprindere generală',
    name_de: 'Allgemeine betriebsärztliche Betreuung',
    description: 'Servicii generale ale medicului de medicină a muncii (Betriebsarzt): consiliere, participare la evaluarea riscurilor, vizite la locul de muncă.',
    examination_type: 'pflicht',
    frequency_months: 12,
    is_mandatory: true,
    legal_reference: 'ASiG § 2-3, DGUV Vorschrift 2',
    applies_to: 'Toate întreprinderile cu peste 1 angajat'
  }
]

// ══════════════════════════════════════════════════════════════════════════════
// PENALTIES - German SSM/PSI fines in EUR
// ══════════════════════════════════════════════════════════════════════════════

export interface GermanyPenalty {
  id: string
  country_code: 'DE'
  violation_type: string
  violation_type_de: string
  description: string
  penalty_min_eur: number
  penalty_max_eur: number
  legal_reference: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export const germanyPenalties: GermanyPenalty[] = [
  {
    id: 'de-penalty-no-risk-assessment',
    country_code: 'DE',
    violation_type: 'Absența evaluării riscurilor',
    violation_type_de: 'Fehlende Gefährdungsbeurteilung',
    description: 'Neefectuarea evaluării riscurilor la locul de muncă (Gefährdungsbeurteilung).',
    penalty_min_eur: 1000,
    penalty_max_eur: 25000,
    legal_reference: 'ArbSchG § 25, OWiG § 17',
    severity: 'critical'
  },
  {
    id: 'de-penalty-no-ssm-training',
    country_code: 'DE',
    violation_type: 'Lipsa instruirii în protecția muncii',
    violation_type_de: 'Fehlende Arbeitsschutzunterweisung',
    description: 'Angajații nu au primit instruirea obligatorie în domeniul protecției muncii.',
    penalty_min_eur: 500,
    penalty_max_eur: 5000,
    legal_reference: 'ArbSchG § 25',
    severity: 'high'
  },
  {
    id: 'de-penalty-no-betriebsarzt',
    country_code: 'DE',
    violation_type: 'Lipsa medicului de medicină a muncii',
    violation_type_de: 'Kein Betriebsarzt bestellt',
    description: 'Angajatorul nu a desemnat un medic de medicină a muncii (Betriebsarzt) conform cerințelor legale.',
    penalty_min_eur: 2000,
    penalty_max_eur: 10000,
    legal_reference: 'ASiG § 9',
    severity: 'critical'
  },
  {
    id: 'de-penalty-no-medical-exam',
    country_code: 'DE',
    violation_type: 'Lipsa controlului medical obligatoriu',
    violation_type_de: 'Fehlende Pflichtvorsorge',
    description: 'Angajații nu au efectuat controalele medicale obligatorii (Pflichtvorsorge).',
    penalty_min_eur: 1000,
    penalty_max_eur: 15000,
    legal_reference: 'ArbMedVV § 7',
    severity: 'critical'
  },
  {
    id: 'de-penalty-no-ppe',
    country_code: 'DE',
    violation_type: 'Nepunerea la dispoziție a EIP',
    violation_type_de: 'Fehlende persönliche Schutzausrüstung',
    description: 'Angajatorul nu a pus la dispoziție echipamente individuale de protecție necesare.',
    penalty_min_eur: 500,
    penalty_max_eur: 10000,
    legal_reference: 'ArbSchG § 25',
    severity: 'high'
  },
  {
    id: 'de-penalty-no-fire-equipment',
    country_code: 'DE',
    violation_type: 'Absența echipamentelor PSI',
    violation_type_de: 'Fehlende Brandschutzeinrichtungen',
    description: 'Lipsesc sau sunt defecte echipamentele de protecție împotriva incendiilor (stingătoare, detectori, sistem de alarmă).',
    penalty_min_eur: 1000,
    penalty_max_eur: 20000,
    legal_reference: 'ArbStättV § 9',
    severity: 'critical'
  },
  {
    id: 'de-penalty-no-fire-safety-officer',
    country_code: 'DE',
    violation_type: 'Lipsa responsabilului cu protecția împotriva incendiilor',
    violation_type_de: 'Keine Brandschutzhelfer',
    description: 'Nu sunt desemnați responsabili cu protecția împotriva incendiilor (min. 5% din angajați).',
    penalty_min_eur: 500,
    penalty_max_eur: 5000,
    legal_reference: 'ASR A2.2',
    severity: 'medium'
  },
  {
    id: 'de-penalty-no-first-aid-officer',
    country_code: 'DE',
    violation_type: 'Lipsa responsabilului cu primul ajutor',
    violation_type_de: 'Keine Ersthelfer',
    description: 'Nu sunt desemnați responsabili cu primul ajutor în număr suficient.',
    penalty_min_eur: 500,
    penalty_max_eur: 5000,
    legal_reference: 'DGUV Vorschrift 1 § 26',
    severity: 'high'
  },
  {
    id: 'de-penalty-no-accident-report',
    country_code: 'DE',
    violation_type: 'Neraportarea accidentelor de muncă',
    violation_type_de: 'Keine Unfallanzeige',
    description: 'Neraportarea accidentelor de muncă grave către Berufsgenossenschaft (asigurarea socială de accident).',
    penalty_min_eur: 1000,
    penalty_max_eur: 10000,
    legal_reference: 'SGB VII § 193',
    severity: 'critical'
  },
  {
    id: 'de-penalty-blocked-exit',
    country_code: 'DE',
    violation_type: 'Blocarea căilor de evacuare',
    violation_type_de: 'Versperrte Fluchtwege',
    description: 'Căile de evacuare și ieșirile de urgență sunt blocate sau inaccesibile.',
    penalty_min_eur: 1000,
    penalty_max_eur: 15000,
    legal_reference: 'ArbStättV § 9',
    severity: 'critical'
  },
  {
    id: 'de-penalty-unsafe-equipment',
    country_code: 'DE',
    violation_type: 'Utilizarea echipamentelor nesigure',
    violation_type_de: 'Unsichere Arbeitsmittel',
    description: 'Utilizarea echipamentelor de lucru defecte sau fără verificări periodice.',
    penalty_min_eur: 2000,
    penalty_max_eur: 30000,
    legal_reference: 'BetrSichV § 22',
    severity: 'critical'
  },
  {
    id: 'de-penalty-missing-documentation',
    country_code: 'DE',
    violation_type: 'Documentație SSM incompletă',
    violation_type_de: 'Unvollständige Arbeitsschutzdokumentation',
    description: 'Documentația privind protecția muncii este incompletă sau nu este actualizată.',
    penalty_min_eur: 500,
    penalty_max_eur: 5000,
    legal_reference: 'ArbSchG § 25',
    severity: 'medium'
  },
  {
    id: 'de-penalty-excessive-working-hours',
    country_code: 'DE',
    violation_type: 'Depășirea timpului legal de lucru',
    violation_type_de: 'Überschreitung der Arbeitszeit',
    description: 'Depășirea timpului maxim legal de lucru (8 ore/zi, 48 ore/săptămână în medie).',
    penalty_min_eur: 1000,
    penalty_max_eur: 15000,
    legal_reference: 'ArbZG § 22',
    severity: 'high'
  },
  {
    id: 'de-penalty-hazardous-substances-violation',
    country_code: 'DE',
    violation_type: 'Nerespectarea cerințelor pentru substanțe periculoase',
    violation_type_de: 'Verstoß gegen Gefahrstoffverordnung',
    description: 'Nerespectarea cerințelor de manipulare, stocare sau protecție pentru substanțe periculoase.',
    penalty_min_eur: 2000,
    penalty_max_eur: 50000,
    legal_reference: 'GefStoffV § 25',
    severity: 'critical'
  }
]

// ══════════════════════════════════════════════════════════════════════════════
// HOLIDAYS - German national and per-Bundesland holidays
// ══════════════════════════════════════════════════════════════════════════════

export interface GermanyHoliday {
  id: string
  country_code: 'DE'
  name: string
  name_de: string
  date_pattern: string // Format: MM-DD or special marker for movable holidays
  is_public_holiday: boolean
  is_work_free: boolean
  description: string
  bundeslaender: string[] // States where this holiday applies (empty = all states)
}

export const germanyHolidays: GermanyHoliday[] = [
  {
    id: 'de-holiday-new-year',
    country_code: 'DE',
    name: 'Anul Nou',
    name_de: 'Neujahr',
    date_pattern: '01-01',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Anul Nou - zi liberă în toate landurile.',
    bundeslaender: []
  },
  {
    id: 'de-holiday-epiphany',
    country_code: 'DE',
    name: 'Bobotează',
    name_de: 'Heilige Drei Könige',
    date_pattern: '01-06',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Bobotează - zi liberă în Bavaria, Baden-Württemberg, Saxonia-Anhalt.',
    bundeslaender: ['BW', 'BY', 'ST']
  },
  {
    id: 'de-holiday-good-friday',
    country_code: 'DE',
    name: 'Vinerea Mare',
    name_de: 'Karfreitag',
    date_pattern: 'EASTER-2',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Vinerea Mare - zi liberă în toate landurile.',
    bundeslaender: []
  },
  {
    id: 'de-holiday-easter-monday',
    country_code: 'DE',
    name: 'Lunea Paștelor',
    name_de: 'Ostermontag',
    date_pattern: 'EASTER+1',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Lunea Paștelor - zi liberă în toate landurile.',
    bundeslaender: []
  },
  {
    id: 'de-holiday-labour-day',
    country_code: 'DE',
    name: 'Ziua Muncii',
    name_de: 'Tag der Arbeit',
    date_pattern: '05-01',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Ziua Internațională a Muncii - zi liberă în toate landurile.',
    bundeslaender: []
  },
  {
    id: 'de-holiday-ascension',
    country_code: 'DE',
    name: 'Înălțarea Domnului',
    name_de: 'Christi Himmelfahrt',
    date_pattern: 'EASTER+39',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Înălțarea Domnului - zi liberă în toate landurile.',
    bundeslaender: []
  },
  {
    id: 'de-holiday-whit-monday',
    country_code: 'DE',
    name: 'Lunea Rusaliilor',
    name_de: 'Pfingstmontag',
    date_pattern: 'EASTER+50',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Lunea Rusaliilor - zi liberă în toate landurile.',
    bundeslaender: []
  },
  {
    id: 'de-holiday-corpus-christi',
    country_code: 'DE',
    name: 'Corpus Christi',
    name_de: 'Fronleichnam',
    date_pattern: 'EASTER+60',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Corpus Christi - zi liberă în Bavaria, Baden-Württemberg, Hessa, Renania de Nord-Westfalia, Renania-Palatinat, Saarland.',
    bundeslaender: ['BW', 'BY', 'HE', 'NW', 'RP', 'SL']
  },
  {
    id: 'de-holiday-assumption',
    country_code: 'DE',
    name: 'Adormirea Maicii Domnului',
    name_de: 'Mariä Himmelfahrt',
    date_pattern: '08-15',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Adormirea Maicii Domnului - zi liberă în Bavaria (numai în localitățile cu majoritate catolică) și Saarland.',
    bundeslaender: ['BY', 'SL']
  },
  {
    id: 'de-holiday-german-unity',
    country_code: 'DE',
    name: 'Ziua Unității Germane',
    name_de: 'Tag der Deutschen Einheit',
    date_pattern: '10-03',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Ziua Națională a Germaniei, comemorează reunificarea din 1990 - zi liberă în toate landurile.',
    bundeslaender: []
  },
  {
    id: 'de-holiday-reformation-day',
    country_code: 'DE',
    name: 'Ziua Reformei',
    name_de: 'Reformationstag',
    date_pattern: '10-31',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Ziua Reformei Protestante - zi liberă în Brandenburg, Mecklenburg-Pomerania Anterioară, Saxonia, Saxonia-Anhalt, Thuringia.',
    bundeslaender: ['BB', 'MV', 'SN', 'ST', 'TH']
  },
  {
    id: 'de-holiday-all-saints',
    country_code: 'DE',
    name: 'Ziua Tuturor Sfinților',
    name_de: 'Allerheiligen',
    date_pattern: '11-01',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Ziua Tuturor Sfinților - zi liberă în Bavaria, Baden-Württemberg, Renania de Nord-Westfalia, Renania-Palatinat, Saarland.',
    bundeslaender: ['BW', 'BY', 'NW', 'RP', 'SL']
  },
  {
    id: 'de-holiday-repentance-day',
    country_code: 'DE',
    name: 'Ziua Pocăinței',
    name_de: 'Buß- und Bettag',
    date_pattern: 'EASTER+32-WEDNESDAY', // Miercurea cu 11 zile înainte de prima duminică din Advent
    is_public_holiday: true,
    is_work_free: true,
    description: 'Ziua Pocăinței - zi liberă numai în Saxonia.',
    bundeslaender: ['SN']
  },
  {
    id: 'de-holiday-christmas-eve',
    country_code: 'DE',
    name: 'Ajunul Crăciunului',
    name_de: 'Heiligabend',
    date_pattern: '12-24',
    is_public_holiday: false,
    is_work_free: false,
    description: 'Ajunul Crăciunului - nu este zi liberă oficială, dar de obicei program redus.',
    bundeslaender: []
  },
  {
    id: 'de-holiday-christmas-first',
    country_code: 'DE',
    name: 'Crăciunul - prima zi',
    name_de: '1. Weihnachtsfeiertag',
    date_pattern: '12-25',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Prima zi de Crăciun - zi liberă în toate landurile.',
    bundeslaender: []
  },
  {
    id: 'de-holiday-christmas-second',
    country_code: 'DE',
    name: 'Crăciunul - a doua zi',
    name_de: '2. Weihnachtsfeiertag',
    date_pattern: '12-26',
    is_public_holiday: true,
    is_work_free: true,
    description: 'A doua zi de Crăciun - zi liberă în toate landurile.',
    bundeslaender: []
  },
  {
    id: 'de-holiday-womens-day-berlin',
    country_code: 'DE',
    name: 'Ziua Internațională a Femeii',
    name_de: 'Internationaler Frauentag',
    date_pattern: '03-08',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Ziua Internațională a Femeii - zi liberă în Berlin și Mecklenburg-Pomerania Anterioară.',
    bundeslaender: ['BE', 'MV']
  },
  {
    id: 'de-holiday-world-childrens-day',
    country_code: 'DE',
    name: 'Ziua Mondială a Copilului',
    name_de: 'Weltkindertag',
    date_pattern: '09-20',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Ziua Mondială a Copilului - zi liberă în Thuringia.',
    bundeslaender: ['TH']
  }
]

// Bundesländer codes reference:
// BW = Baden-Württemberg, BY = Bayern, BE = Berlin, BB = Brandenburg
// HB = Bremen, HH = Hamburg, HE = Hessen, MV = Mecklenburg-Vorpommern
// NI = Niedersachsen, NW = Nordrhein-Westfalen, RP = Rheinland-Pfalz
// SL = Saarland, SN = Sachsen, ST = Sachsen-Anhalt, SH = Schleswig-Holstein, TH = Thüringen

// ══════════════════════════════════════════════════════════════════════════════
// AUTHORITIES - German SSM/PSI regulatory authorities
// ══════════════════════════════════════════════════════════════════════════════

export interface GermanyAuthority {
  id: string
  name: string
  name_de: string
  type: 'federal' | 'state' | 'insurance'
  responsibility: string
  website: string | null
}

export const germanyAuthorities: GermanyAuthority[] = [
  {
    id: 'de-auth-baua',
    name: 'Oficiul Federal pentru Protecția și Medicina Muncii',
    name_de: 'Bundesanstalt für Arbeitsschutz und Arbeitsmedizin (BAuA)',
    type: 'federal',
    responsibility: 'Cercetare, consultanță și autoritate federală pentru protecția muncii și medicina muncii.',
    website: 'https://www.baua.de'
  },
  {
    id: 'de-auth-bmas',
    name: 'Ministerul Federal al Muncii și Afacerilor Sociale',
    name_de: 'Bundesministerium für Arbeit und Soziales (BMAS)',
    type: 'federal',
    responsibility: 'Ministerul responsabil cu legislația privind protecția muncii la nivel federal.',
    website: 'https://www.bmas.de'
  },
  {
    id: 'de-auth-bg',
    name: 'Berufsgenossenschaft (Asociații profesionale de asigurări sociale)',
    name_de: 'Berufsgenossenschaften',
    type: 'insurance',
    responsibility: 'Asigurări sociale de accident, prevenirea accidentelor de muncă și bolilor profesionale, supervizarea conformității.',
    website: 'https://www.dguv.de'
  },
  {
    id: 'de-auth-gewerbeaufsicht',
    name: 'Inspecția Muncii',
    name_de: 'Gewerbeaufsichtsämter / Arbeitsschutzbehörden der Länder',
    type: 'state',
    responsibility: 'Autoritățile de inspecție a muncii la nivel de land (stat federal), supraveghează conformitatea cu ArbSchG.',
    website: null
  },
  {
    id: 'de-auth-feuerwehr',
    name: 'Brigada de pompieri',
    name_de: 'Feuerwehr',
    type: 'state',
    responsibility: 'Responsabili cu protecția împotriva incendiilor, inspecții PSI și autorizații.',
    website: null
  }
]

// ══════════════════════════════════════════════════════════════════════════════
// DOCUMENT TEMPLATES - German SSM/PSI document types
// ══════════════════════════════════════════════════════════════════════════════

export interface GermanyDocumentTemplate {
  id: string
  country_code: 'DE'
  name: string
  name_de: string
  description: string
  category: 'SSM' | 'PSI' | 'MEDICAL' | 'TRAINING' | 'COMPLIANCE'
  is_mandatory: boolean
  legal_reference: string
  template_fields: string[]
}

export const germanyDocumentTemplates: GermanyDocumentTemplate[] = [
  {
    id: 'de-doc-risk-assessment',
    country_code: 'DE',
    name: 'Evaluarea riscurilor (Gefährdungsbeurteilung)',
    name_de: 'Gefährdungsbeurteilung',
    description: 'Document obligatoriu de evaluare a tuturor riscurilor la locul de muncă și măsurile de protecție necesare.',
    category: 'SSM',
    is_mandatory: true,
    legal_reference: 'ArbSchG § 5-6',
    template_fields: ['workplace_id', 'work_activity', 'hazards_identified', 'risk_level', 'protective_measures', 'responsible_person', 'assessment_date', 'review_date']
  },
  {
    id: 'de-doc-training-record',
    country_code: 'DE',
    name: 'Registrul instruirilor',
    name_de: 'Unterweisungsnachweis',
    description: 'Registru obligatoriu pentru evidența instruirilor în domeniul protecției muncii.',
    category: 'TRAINING',
    is_mandatory: true,
    legal_reference: 'ArbSchG § 12, DGUV Vorschrift 1 § 4',
    template_fields: ['employee_name', 'training_topic', 'training_date', 'duration', 'trainer_name', 'training_content', 'employee_signature', 'trainer_signature']
  },
  {
    id: 'de-doc-medical-record',
    country_code: 'DE',
    name: 'Certificatul de control medical',
    name_de: 'Vorsorgebescheinigung',
    description: 'Certificat emis de medicul de medicină a muncii după controlul medical preventiv.',
    category: 'MEDICAL',
    is_mandatory: true,
    legal_reference: 'ArbMedVV § 6',
    template_fields: ['employee_name', 'examination_type', 'examination_date', 'next_examination_date', 'betriebsarzt_name', 'medical_facility', 'restrictions']
  },
  {
    id: 'de-doc-accident-report',
    country_code: 'DE',
    name: 'Raport de accident de muncă',
    name_de: 'Unfallanzeige',
    description: 'Declarație obligatorie către Berufsgenossenschaft pentru accidentele de muncă cu peste 3 zile de incapacitate.',
    category: 'SSM',
    is_mandatory: true,
    legal_reference: 'SGB VII § 193',
    template_fields: ['employee_name', 'accident_date', 'accident_time', 'location', 'accident_description', 'witnesses', 'injury_type', 'work_inability_days', 'reporting_date', 'bg_number']
  },
  {
    id: 'de-doc-fire-safety-plan',
    country_code: 'DE',
    name: 'Plan de protecție împotriva incendiilor',
    name_de: 'Brandschutzordnung',
    description: 'Plan obligatoriu pentru măsurile de protecție împotriva incendiilor, comportament preventiv și proceduri de evacuare.',
    category: 'PSI',
    is_mandatory: true,
    legal_reference: 'ASR A2.2, DIN 14096',
    template_fields: ['building_description', 'fire_prevention_rules', 'evacuation_routes', 'fire_equipment_locations', 'assembly_points', 'emergency_contacts', 'fire_safety_officers', 'last_update']
  },
  {
    id: 'de-doc-fire-equipment-register',
    country_code: 'DE',
    name: 'Registrul echipamentelor PSI',
    name_de: 'Prüfbuch Brandschutzeinrichtungen',
    description: 'Registru pentru evidența echipamentelor de protecție împotriva incendiilor și verificările periodice.',
    category: 'PSI',
    is_mandatory: true,
    legal_reference: 'ASR A2.2',
    template_fields: ['equipment_type', 'location', 'serial_number', 'manufacturer', 'installation_date', 'last_inspection', 'next_inspection', 'inspector_name', 'inspector_company', 'status']
  },
  {
    id: 'de-doc-ppe-register',
    country_code: 'DE',
    name: 'Registrul EIP',
    name_de: 'Nachweisbuch PSA',
    description: 'Registru pentru evidența echipamentelor individuale de protecție distribuite angajaților.',
    category: 'SSM',
    is_mandatory: true,
    legal_reference: 'DGUV Regel 112-189',
    template_fields: ['employee_name', 'ppe_type', 'ppe_standard', 'ce_marking', 'issue_date', 'replacement_date', 'training_date', 'employee_signature']
  },
  {
    id: 'de-doc-emergency-plan',
    country_code: 'DE',
    name: 'Plan de urgență',
    name_de: 'Notfallplan',
    description: 'Plan de acțiune în caz de situații de urgență (incendii, accidente, evacuări medicale).',
    category: 'SSM',
    is_mandatory: true,
    legal_reference: 'ArbSchG § 10',
    template_fields: ['emergency_types', 'action_procedures', 'first_aiders', 'fire_safety_officers', 'emergency_contacts', 'evacuation_plan', 'assembly_points', 'last_drill_date']
  },
  {
    id: 'de-doc-workplace-instructions',
    country_code: 'DE',
    name: 'Instrucțiuni de lucru SSM',
    name_de: 'Betriebsanweisung',
    description: 'Instrucțiuni detaliate pentru lucrul în siguranță cu echipamente, utilaje sau substanțe periculoase.',
    category: 'SSM',
    is_mandatory: true,
    legal_reference: 'ArbSchG § 9, BetrSichV § 12, GefStoffV § 14',
    template_fields: ['workplace_equipment', 'hazards', 'safety_procedures', 'required_ppe', 'prohibited_actions', 'emergency_procedures', 'first_aid_measures', 'creation_date', 'responsible_person']
  },
  {
    id: 'de-doc-hazardous-substances-register',
    country_code: 'DE',
    name: 'Catalogul substanțelor periculoase',
    name_de: 'Gefahrstoffverzeichnis',
    description: 'Catalog obligatoriu al tuturor substanțelor periculoase utilizate în întreprindere.',
    category: 'SSM',
    is_mandatory: true,
    legal_reference: 'GefStoffV § 6',
    template_fields: ['substance_name', 'cas_number', 'ghs_classification', 'quantity_stored', 'storage_location', 'safety_data_sheet', 'substitution_check', 'protective_measures']
  },
  {
    id: 'de-doc-first-aid-equipment',
    country_code: 'DE',
    name: 'Registrul echipamentelor de prim ajutor',
    name_de: 'Verbandbuch',
    description: 'Registru pentru documentarea tuturor accidentelor și măsurilor de prim ajutor acordate.',
    category: 'SSM',
    is_mandatory: true,
    legal_reference: 'DGUV Vorschrift 1 § 24',
    template_fields: ['date', 'time', 'employee_name', 'injury_description', 'first_aid_measures', 'first_aider_name', 'witnesses', 'further_medical_treatment']
  },
  {
    id: 'de-doc-betriebsarzt-appointment',
    country_code: 'DE',
    name: 'Contractul cu medicul de medicină a muncii',
    name_de: 'Bestellung Betriebsarzt',
    description: 'Document de desemnare a medicului de medicină a muncii (Betriebsarzt).',
    category: 'MEDICAL',
    is_mandatory: true,
    legal_reference: 'ASiG § 2, DGUV Vorschrift 2',
    template_fields: ['betriebsarzt_name', 'qualification', 'appointment_date', 'care_hours_per_year', 'responsibilities', 'employer_signature', 'betriebsarzt_signature']
  }
]

// ══════════════════════════════════════════════════════════════════════════════
// MAIN CONFIG EXPORT
// ══════════════════════════════════════════════════════════════════════════════

export const germanyConfig = {
  legislation: germanyLegislation,
  trainingTypes: germanyTrainingTypes,
  medicalTypes: germanyMedicalTypes,
  penalties: germanyPenalties,
  holidays: germanyHolidays,
  authorities: germanyAuthorities,
  documentTemplates: germanyDocumentTemplates
}

export default germanyConfig
