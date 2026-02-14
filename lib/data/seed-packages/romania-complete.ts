/**
 * Complete Romania seed data package
 * Includes: legislation (Legea 319/2006, HG refs), training types, medical types,
 * penalties (RON), holidays, document templates, CAEN risk mappings, COR codes
 *
 * Import: seedRomaniaComplete()
 */

import { createSupabaseServer } from '@/lib/supabase/server'

// ══════════════════════════════════════════════════════════════════════════════
// LEGISLATION - Romanian SSM/PSI Acts (Legea 319, HG 1425, etc.)
// ══════════════════════════════════════════════════════════════════════════════

export interface RomaniaLegislation {
  id: string
  country_code: 'RO'
  domain: 'SSM' | 'PSI' | 'MEDICAL' | 'LABOR'
  act_number: string
  act_date: string
  title: string
  official_journal_ref: string | null
  source_url: string | null
  description: string
}

export const romaniaLegislation: RomaniaLegislation[] = [
  {
    id: 'ro-legea-319',
    country_code: 'RO',
    domain: 'SSM',
    act_number: 'Legea nr. 319/2006',
    act_date: '2006-07-14',
    title: 'Legea securității și sănătății în muncă',
    official_journal_ref: 'M.Of. nr. 646/26.07.2006',
    source_url: 'https://legislatie.just.ro/Public/DetaliiDocument/73751',
    description: 'Actul normativ fundamental pentru SSM în România, stabilește cadrul general pentru asigurarea securității și sănătății lucrătorilor la locul de muncă.'
  },
  {
    id: 'ro-hg-1425',
    country_code: 'RO',
    domain: 'SSM',
    act_number: 'HG nr. 1425/2006',
    act_date: '2006-11-09',
    title: 'Norme metodologice de aplicare a Legii 319/2006',
    official_journal_ref: 'M.Of. nr. 882/30.10.2006',
    source_url: 'https://legislatie.just.ro/Public/DetaliiDocument/76256',
    description: 'Normele metodologice de aplicare a prevederilor Legii securității și sănătății în muncă - detalii privind evaluarea riscurilor, măsuri de prevenire și protecție.'
  },
  {
    id: 'ro-legea-53',
    country_code: 'RO',
    domain: 'LABOR',
    act_number: 'Legea nr. 53/2003',
    act_date: '2003-01-24',
    title: 'Codul Muncii',
    official_journal_ref: 'M.Of. nr. 72/05.02.2003',
    source_url: 'https://legislatie.just.ro/Public/DetaliiDocument/40802',
    description: 'Codul Muncii - reglementează raporturile de muncă individuale și colective, drepturile și obligațiile angajatorilor și angajaților.'
  },
  {
    id: 'ro-hg-355',
    country_code: 'RO',
    domain: 'MEDICAL',
    act_number: 'HG nr. 355/2007',
    act_date: '2007-04-12',
    title: 'Supravegherea sănătății lucrătorilor',
    official_journal_ref: 'M.Of. nr. 332/16.05.2007',
    source_url: 'https://legislatie.just.ro/Public/DetaliiDocument/81930',
    description: 'Reglementează supravegherea sănătății lucrătorilor - tipuri de controale medicale, frecvența, responsabilități, și categorii de risc.'
  },
  {
    id: 'ro-legea-307',
    country_code: 'RO',
    domain: 'PSI',
    act_number: 'Legea nr. 307/2006',
    act_date: '2006-07-12',
    title: 'Legea privind apărarea împotriva incendiilor',
    official_journal_ref: 'M.Of. nr. 633/21.07.2006',
    source_url: 'https://legislatie.just.ro/Public/DetaliiDocument/73788',
    description: 'Cadrul legal pentru prevenirea și stingerea incendiilor, precum și pentru protecția persoanelor, bunurilor și mediului.'
  },
  {
    id: 'ro-ordin-163',
    country_code: 'RO',
    domain: 'PSI',
    act_number: 'Ordinul MAI nr. 163/2007',
    act_date: '2007-03-28',
    title: 'Normele generale de apărare împotriva incendiilor',
    official_journal_ref: 'M.Of. nr. 247/12.04.2007',
    source_url: 'https://legislatie.just.ro/Public/DetaliiDocument/81337',
    description: 'Reglementări tehnice detaliate privind măsurile de prevenire și stingere a incendiilor - instalații, echipamente, responsabilități.'
  },
  {
    id: 'ro-hg-1146',
    country_code: 'RO',
    domain: 'SSM',
    act_number: 'HG nr. 1146/2006',
    act_date: '2006-09-20',
    title: 'Cerințe minime de securitate și sănătate pentru utilizarea echipamentelor de muncă',
    official_journal_ref: 'M.Of. nr. 815/03.10.2006',
    source_url: 'https://legislatie.just.ro/Public/DetaliiDocument/75449',
    description: 'Stabilește cerințele minime pentru asigurarea securității și sănătății lucrătorilor la utilizarea echipamentelor de muncă.'
  },
  {
    id: 'ro-hg-1048',
    country_code: 'RO',
    domain: 'SSM',
    act_number: 'HG nr. 1048/2006',
    act_date: '2006-08-30',
    title: 'Cerințe minime pentru semnalizarea de securitate și sănătate',
    official_journal_ref: 'M.Of. nr. 722/22.08.2006',
    source_url: 'https://legislatie.just.ro/Public/DetaliiDocument/74567',
    description: 'Reglementează semnalizarea de securitate și sănătate la locul de muncă - tipuri de panouri, culori, simboluri, instalare.'
  },
  {
    id: 'ro-hg-1091',
    country_code: 'RO',
    domain: 'SSM',
    act_number: 'HG nr. 1091/2006',
    act_date: '2006-09-06',
    title: 'Cerințe minime privind echipamentele individuale de protecție',
    official_journal_ref: 'M.Of. nr. 723/23.08.2006',
    source_url: 'https://legislatie.just.ro/Public/DetaliiDocument/74619',
    description: 'Stabilește cerințele minime pentru alegerea, utilizarea și întreținerea echipamentelor individuale de protecție.'
  },
  {
    id: 'ro-hg-1136',
    country_code: 'RO',
    domain: 'SSM',
    act_number: 'HG nr. 1136/2006',
    act_date: '2006-09-13',
    title: 'Cerințe minime pentru locurile de muncă',
    official_journal_ref: 'M.Of. nr. 815/03.10.2006',
    source_url: 'https://legislatie.just.ro/Public/DetaliiDocument/75442',
    description: 'Reglementează cerințele minime de securitate și sănătate pentru locurile de muncă - spații, iluminat, ventilație, temperatură, etc.'
  },
  {
    id: 'ro-ordinul-1030',
    country_code: 'RO',
    domain: 'SSM',
    act_number: 'Ordinul nr. 1030/2006',
    act_date: '2006-11-09',
    title: 'Instructajul lucrătorilor în domeniul SSM',
    official_journal_ref: 'M.Of. nr. 882bis/30.10.2006',
    source_url: null,
    description: 'Reglementează modalitățile de instruire și formare a lucrătorilor în domeniul securității și sănătății în muncă.'
  }
]

// ══════════════════════════════════════════════════════════════════════════════
// TRAINING TYPES - Romanian SSM/PSI training categories
// ══════════════════════════════════════════════════════════════════════════════

export interface RomaniaTrainingType {
  id: string
  country_code: 'RO'
  name: string
  description: string
  frequency: 'annual' | 'biannual' | 'once' | 'on_demand'
  duration_hours: number
  is_mandatory: boolean
  category: 'SSM' | 'PSI' | 'FIRST_AID' | 'SPECIALIZED'
  legal_reference: string
}

export const romaniaTrainingTypes: RomaniaTrainingType[] = [
  {
    id: 'ro-training-general-ssm',
    country_code: 'RO',
    name: 'Instruire generală SSM',
    description: 'Instruire obligatorie pentru toți angajații noi, anterior începerii activității. Acoperă informații generale despre riscurile din unitate și măsurile de prevenire.',
    frequency: 'once',
    duration_hours: 8,
    is_mandatory: true,
    category: 'SSM',
    legal_reference: 'Legea 319/2006 - art. 21, Ordinul 1030/2006'
  },
  {
    id: 'ro-training-specific-ssm',
    country_code: 'RO',
    name: 'Instruire la locul de muncă',
    description: 'Instruire specifică pentru riscurile particulare ale locului de muncă și echipamentelor utilizate, înainte de începerea lucrului.',
    frequency: 'once',
    duration_hours: 4,
    is_mandatory: true,
    category: 'SSM',
    legal_reference: 'Legea 319/2006 - art. 21, Ordinul 1030/2006'
  },
  {
    id: 'ro-training-periodic-ssm',
    country_code: 'RO',
    name: 'Instruire periodică SSM',
    description: 'Instruire de reîmprospătare a cunoștințelor, obligatorie periodic conform planului de prevenire.',
    frequency: 'annual',
    duration_hours: 4,
    is_mandatory: true,
    category: 'SSM',
    legal_reference: 'Legea 319/2006 - art. 21, HG 1425/2006'
  },
  {
    id: 'ro-training-fire-safety',
    country_code: 'RO',
    name: 'Instruire PSI',
    description: 'Instruire obligatorie pentru protecția împotriva incendiilor, utilizarea mijloacelor de stingere și proceduri de evacuare.',
    frequency: 'annual',
    duration_hours: 2,
    is_mandatory: true,
    category: 'PSI',
    legal_reference: 'Legea 307/2006, Ordinul MAI 163/2007'
  },
  {
    id: 'ro-training-first-aid',
    country_code: 'RO',
    name: 'Prim ajutor',
    description: 'Formare pentru acordarea primului ajutor în caz de accident de muncă sau urgență medicală.',
    frequency: 'biannual',
    duration_hours: 8,
    is_mandatory: false,
    category: 'FIRST_AID',
    legal_reference: 'Legea 319/2006 - art. 15'
  },
  {
    id: 'ro-training-height-work',
    country_code: 'RO',
    name: 'Lucru la înălțime',
    description: 'Instruire specializată pentru lucrări la înălțime peste 2 metri - echipamente de protecție, proceduri de lucru sigure.',
    frequency: 'annual',
    duration_hours: 8,
    is_mandatory: true,
    category: 'SPECIALIZED',
    legal_reference: 'HG 1425/2006 - Anexa 2'
  },
  {
    id: 'ro-training-confined-spaces',
    country_code: 'RO',
    name: 'Lucru în spații închise',
    description: 'Instruire pentru lucrări în spații închise sau cu ventilație redusă - identificarea riscurilor, măsuri de protecție, salvare.',
    frequency: 'annual',
    duration_hours: 8,
    is_mandatory: true,
    category: 'SPECIALIZED',
    legal_reference: 'HG 1425/2006'
  },
  {
    id: 'ro-training-electrical',
    country_code: 'RO',
    name: 'Lucru cu instalații electrice',
    description: 'Instruire specializată pentru lucrul sub tensiune sau în apropierea instalațiilor electrice - autorizații, proceduri, EIP.',
    frequency: 'annual',
    duration_hours: 16,
    is_mandatory: true,
    category: 'SPECIALIZED',
    legal_reference: 'HG 1146/2006, normele ANRE'
  },
  {
    id: 'ro-training-hazardous-substances',
    country_code: 'RO',
    name: 'Lucru cu substanțe periculoase',
    description: 'Instruire pentru manipularea substanțelor chimice periculoase - identificare, stocare, utilizare, măsuri în caz de accident.',
    frequency: 'annual',
    duration_hours: 6,
    is_mandatory: true,
    category: 'SPECIALIZED',
    legal_reference: 'HG 1425/2006, Regulamentul CLP'
  },
  {
    id: 'ro-training-forklift',
    country_code: 'RO',
    name: 'Operare stivuitor/macara',
    description: 'Instruire și autorizare pentru operarea stivuitoarelor, macaralelor și altor echipamente de ridicat/transportat.',
    frequency: 'annual',
    duration_hours: 40,
    is_mandatory: true,
    category: 'SPECIALIZED',
    legal_reference: 'HG 1146/2006 - Anexa 2'
  },
  {
    id: 'ro-training-ergonomics',
    country_code: 'RO',
    name: 'Ergonomie și manipulare manuală',
    description: 'Instruire pentru manipularea manuală a sarcinilor și prevenirea afecțiunilor musculo-scheletice.',
    frequency: 'annual',
    duration_hours: 2,
    is_mandatory: false,
    category: 'SSM',
    legal_reference: 'HG 1425/2006'
  },
  {
    id: 'ro-training-pandemic',
    country_code: 'RO',
    name: 'Măsuri de prevenire pandemie',
    description: 'Instruire pentru măsurile de prevenire și protecție în context pandemic (COVID-19, etc.).',
    frequency: 'on_demand',
    duration_hours: 2,
    is_mandatory: false,
    category: 'SSM',
    legal_reference: 'Ordine și decizii CNSU/INSP'
  }
]

// ══════════════════════════════════════════════════════════════════════════════
// MEDICAL EXAMINATION TYPES - Romanian medical check categories
// ══════════════════════════════════════════════════════════════════════════════

export interface RomaniaMedicalType {
  id: string
  country_code: 'RO'
  name: string
  description: string
  examination_type: 'angajare' | 'periodic' | 'reluare' | 'la_cerere' | 'supraveghere'
  frequency_months: number | null
  is_mandatory: boolean
  legal_reference: string
  applies_to: string
}

export const romaniaMedicalTypes: RomaniaMedicalType[] = [
  {
    id: 'ro-medical-angajare',
    country_code: 'RO',
    name: 'Control medical la angajare',
    description: 'Control medical obligatoriu anterior angajării, pentru verificarea aptitudinii pentru postul de muncă respectiv.',
    examination_type: 'angajare',
    frequency_months: null,
    is_mandatory: true,
    legal_reference: 'HG 355/2007 - art. 4',
    applies_to: 'Toți angajații noi'
  },
  {
    id: 'ro-medical-periodic-12',
    country_code: 'RO',
    name: 'Control medical periodic anual',
    description: 'Control medical periodic la 12 luni pentru lucrătorii expuși la factori de risc profesional conform HG 355/2007.',
    examination_type: 'periodic',
    frequency_months: 12,
    is_mandatory: true,
    legal_reference: 'HG 355/2007 - Anexa 1',
    applies_to: 'Lucrători expuși la factori de risc - zgomot, vibrații, substanțe chimice, etc.'
  },
  {
    id: 'ro-medical-periodic-24',
    country_code: 'RO',
    name: 'Control medical periodic la 2 ani',
    description: 'Control medical periodic la 24 de luni pentru lucrătorii cu risc ocupațional scăzut.',
    examination_type: 'periodic',
    frequency_months: 24,
    is_mandatory: true,
    legal_reference: 'HG 355/2007',
    applies_to: 'Lucrători cu risc ocupațional scăzut (birouri, administrative)'
  },
  {
    id: 'ro-medical-periodic-6',
    country_code: 'RO',
    name: 'Control medical periodic semestrial',
    description: 'Control medical la fiecare 6 luni pentru lucrătorii expuși la factori de risc ridicat (substanțe cancerigene, radiații).',
    examination_type: 'periodic',
    frequency_months: 6,
    is_mandatory: true,
    legal_reference: 'HG 355/2007 - Anexa 1',
    applies_to: 'Lucrători expuși la azbest, plumb, benzen, radiații ionizante'
  },
  {
    id: 'ro-medical-reluare',
    country_code: 'RO',
    name: 'Control medical la reluarea activității',
    description: 'Control medical obligatoriu la reluarea activității după o absentă de peste 90 de zile consecutiv pentru motive medicale.',
    examination_type: 'reluare',
    frequency_months: null,
    is_mandatory: true,
    legal_reference: 'HG 355/2007 - art. 5',
    applies_to: 'Lucrători cu absență medicală peste 90 zile'
  },
  {
    id: 'ro-medical-la-cerere',
    country_code: 'RO',
    name: 'Control medical la cerere',
    description: 'Control medical efectuat la cererea lucrătorului sau angajatorului în caz de suspiciune de boală profesională sau scăderea capacității de muncă.',
    examination_type: 'la_cerere',
    frequency_months: null,
    is_mandatory: false,
    legal_reference: 'HG 355/2007 - art. 6',
    applies_to: 'La cererea lucrătorului sau angajatorului'
  },
  {
    id: 'ro-medical-supraveghere-post',
    country_code: 'RO',
    name: 'Supraveghere medicală post-expunere',
    description: 'Supraveghere medicală după încetarea expunerii la factori de risc cu efecte întârziate (azbest, radiații, cancerigene).',
    examination_type: 'supraveghere',
    frequency_months: 12,
    is_mandatory: true,
    legal_reference: 'HG 355/2007 - art. 7',
    applies_to: 'Foști lucrători expuși la azbest, substanțe cancerigene, radiații ionizante'
  },
  {
    id: 'ro-medical-minori',
    country_code: 'RO',
    name: 'Control medical pentru tineri sub 18 ani',
    description: 'Control medical obligatoriu anual pentru lucrătorii cu vârsta sub 18 ani.',
    examination_type: 'periodic',
    frequency_months: 12,
    is_mandatory: true,
    legal_reference: 'Codul Muncii - art. 103',
    applies_to: 'Lucrători sub 18 ani'
  },
  {
    id: 'ro-medical-night-shift',
    country_code: 'RO',
    name: 'Control medical pentru munca de noapte',
    description: 'Control medical pentru verificarea aptitudinii pentru munca în schimbul de noapte.',
    examination_type: 'periodic',
    frequency_months: 12,
    is_mandatory: true,
    legal_reference: 'Codul Muncii - art. 112',
    applies_to: 'Lucrători în tură de noapte'
  },
  {
    id: 'ro-medical-gravide',
    country_code: 'RO',
    name: 'Control medical pentru lucrătoare gravide',
    description: 'Evaluare medicală pentru adaptarea condițiilor de muncă pentru lucrătoarele gravide sau care alăptează.',
    examination_type: 'la_cerere',
    frequency_months: null,
    is_mandatory: true,
    legal_reference: 'Codul Muncii - art. 123, HG 355/2007',
    applies_to: 'Lucrătoare gravide sau care alăptează'
  }
]

// ══════════════════════════════════════════════════════════════════════════════
// PENALTIES - Romanian SSM/PSI fines in RON
// ══════════════════════════════════════════════════════════════════════════════

export interface RomaniaPenalty {
  id: string
  country_code: 'RO'
  violation_type: string
  description: string
  penalty_min_ron: number
  penalty_max_ron: number
  legal_reference: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export const romaniaPenalties: RomaniaPenalty[] = [
  {
    id: 'ro-penalty-no-risk-assessment',
    country_code: 'RO',
    violation_type: 'Absența evaluării riscurilor',
    description: 'Neefectuarea sau neactualizarea evaluării riscurilor pentru securitatea și sănătatea în muncă.',
    penalty_min_ron: 10000,
    penalty_max_ron: 20000,
    legal_reference: 'Legea 319/2006 - art. 49 alin. (1) lit. a)',
    severity: 'critical'
  },
  {
    id: 'ro-penalty-no-ssm-service',
    country_code: 'RO',
    violation_type: 'Lipsa serviciului de prevenire și protecție',
    description: 'Neînființarea serviciului intern sau necontractarea serviciului extern de prevenire și protecție.',
    penalty_min_ron: 5000,
    penalty_max_ron: 10000,
    legal_reference: 'Legea 319/2006 - art. 49 alin. (1) lit. b)',
    severity: 'high'
  },
  {
    id: 'ro-penalty-no-training',
    country_code: 'RO',
    violation_type: 'Lipsa instruirii SSM',
    description: 'Angajații nu au primit instruirea obligatorie în domeniul securității și sănătății în muncă.',
    penalty_min_ron: 4000,
    penalty_max_ron: 8000,
    legal_reference: 'Legea 319/2006 - art. 49 alin. (1) lit. d)',
    severity: 'high'
  },
  {
    id: 'ro-penalty-no-medical-exam',
    country_code: 'RO',
    violation_type: 'Lipsa controlului medical',
    description: 'Angajații nu au efectuat controalele medicale obligatorii (la angajare sau periodice).',
    penalty_min_ron: 5000,
    penalty_max_ron: 15000,
    legal_reference: 'Legea 319/2006 - art. 49 alin. (1) lit. e)',
    severity: 'critical'
  },
  {
    id: 'ro-penalty-no-ppe',
    country_code: 'RO',
    violation_type: 'Nepunerea la dispoziție a EIP',
    description: 'Angajatorul nu a pus la dispoziție echipamente individuale de protecție corespunzătoare.',
    penalty_min_ron: 3000,
    penalty_max_ron: 7000,
    legal_reference: 'Legea 319/2006 - art. 49 alin. (1) lit. f)',
    severity: 'high'
  },
  {
    id: 'ro-penalty-unsafe-equipment',
    country_code: 'RO',
    violation_type: 'Utilizarea echipamentelor nesigure',
    description: 'Utilizarea echipamentelor de muncă care nu respectă cerințele minime de securitate.',
    penalty_min_ron: 8000,
    penalty_max_ron: 16000,
    legal_reference: 'Legea 319/2006 - art. 49 alin. (1) lit. g)',
    severity: 'critical'
  },
  {
    id: 'ro-penalty-no-accident-report',
    country_code: 'RO',
    violation_type: 'Neraportarea accidentelor de muncă',
    description: 'Nedeclararea sau raportarea cu întârziere a accidentelor de muncă către ITM.',
    penalty_min_ron: 10000,
    penalty_max_ron: 25000,
    legal_reference: 'Legea 319/2006 - art. 49 alin. (1) lit. h)',
    severity: 'critical'
  },
  {
    id: 'ro-penalty-no-fire-equipment',
    country_code: 'RO',
    violation_type: 'Absența echipamentelor PSI',
    description: 'Lipsesc sau sunt defecte echipamentele de prevenire și stingere a incendiilor.',
    penalty_min_ron: 5000,
    penalty_max_ron: 15000,
    legal_reference: 'Legea 307/2006 - art. 30',
    severity: 'critical'
  },
  {
    id: 'ro-penalty-no-evacuation-plan',
    country_code: 'RO',
    violation_type: 'Lipsa planului de evacuare',
    description: 'Nu există plan de evacuare în caz de incendiu sau acesta nu este afișat și actualizat.',
    penalty_min_ron: 2000,
    penalty_max_ron: 5000,
    legal_reference: 'Ordinul MAI 163/2007',
    severity: 'medium'
  },
  {
    id: 'ro-penalty-blocked-exit',
    country_code: 'RO',
    violation_type: 'Blocarea căilor de evacuare',
    description: 'Căile de evacuare și ieșirile de urgență sunt blocate, încuiate sau obstrucționate.',
    penalty_min_ron: 4000,
    penalty_max_ron: 10000,
    legal_reference: 'Legea 307/2006 - art. 30',
    severity: 'critical'
  },
  {
    id: 'ro-penalty-missing-documentation',
    country_code: 'RO',
    violation_type: 'Documentație SSM incompletă',
    description: 'Documentația obligatorie SSM este incompletă, neactualizată sau lipsește.',
    penalty_min_ron: 2000,
    penalty_max_ron: 5000,
    legal_reference: 'Legea 319/2006 - art. 49 alin. (1) lit. c)',
    severity: 'medium'
  },
  {
    id: 'ro-penalty-no-safety-signage',
    country_code: 'RO',
    violation_type: 'Lipsa semnalizării de securitate',
    description: 'Absența sau poziționarea incorectă a panourilor de semnalizare de securitate și sănătate.',
    penalty_min_ron: 1500,
    penalty_max_ron: 4000,
    legal_reference: 'HG 1048/2006',
    severity: 'low'
  },
  {
    id: 'ro-penalty-no-work-permit',
    country_code: 'RO',
    violation_type: 'Executarea lucrărilor fără permis de lucru',
    description: 'Executarea lucrărilor cu risc ridicat (înălțime, spații închise, foc deschis) fără permis de lucru.',
    penalty_min_ron: 6000,
    penalty_max_ron: 12000,
    legal_reference: 'HG 1425/2006',
    severity: 'critical'
  },
  {
    id: 'ro-penalty-obstruction-inspection',
    country_code: 'RO',
    violation_type: 'Obstrucționarea controlului ITM',
    description: 'Refuzul de a permite accesul inspectorilor ITM sau nepunerea la dispoziție a documentelor solicitate.',
    penalty_min_ron: 8000,
    penalty_max_ron: 20000,
    legal_reference: 'Legea 319/2006 - art. 49 alin. (1) lit. k)',
    severity: 'critical'
  }
]

// ══════════════════════════════════════════════════════════════════════════════
// HOLIDAYS - Romanian national and public holidays
// ══════════════════════════════════════════════════════════════════════════════

export interface RomaniaHoliday {
  id: string
  country_code: 'RO'
  name: string
  date_pattern: string // Format: MM-DD or special marker for movable holidays
  is_public_holiday: boolean
  is_work_free: boolean
  description: string
}

export const romaniaHolidays: RomaniaHoliday[] = [
  {
    id: 'ro-holiday-new-year-1',
    country_code: 'RO',
    name: 'Anul Nou - ziua 1',
    date_pattern: '01-01',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Prima zi a Anului Nou - zi liberă legală.'
  },
  {
    id: 'ro-holiday-new-year-2',
    country_code: 'RO',
    name: 'Anul Nou - ziua 2',
    date_pattern: '01-02',
    is_public_holiday: true,
    is_work_free: true,
    description: 'A doua zi a Anului Nou - zi liberă legală.'
  },
  {
    id: 'ro-holiday-unification-day',
    country_code: 'RO',
    name: 'Ziua Unirii Principatelor Române',
    date_pattern: '01-24',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Ziua Unirii Principatelor Române din 1859 - zi liberă legală.'
  },
  {
    id: 'ro-holiday-good-friday',
    country_code: 'RO',
    name: 'Vinerea Mare (ortodoxă)',
    date_pattern: 'EASTER-2', // Special: depends on Orthodox Easter
    is_public_holiday: true,
    is_work_free: true,
    description: 'Vinerea Mare conform calendarului ortodox - zi liberă legală.'
  },
  {
    id: 'ro-holiday-easter',
    country_code: 'RO',
    name: 'Paștele ortodox',
    date_pattern: 'EASTER',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Prima zi de Paște conform calendarului ortodox - cea mai importantă sărbătoare creștină ortodoxă.'
  },
  {
    id: 'ro-holiday-easter-monday',
    country_code: 'RO',
    name: 'Lunea Paștelor',
    date_pattern: 'EASTER+1',
    is_public_holiday: true,
    is_work_free: true,
    description: 'A doua zi de Paște - zi liberă legală.'
  },
  {
    id: 'ro-holiday-labour-day',
    country_code: 'RO',
    name: 'Ziua Muncii',
    date_pattern: '05-01',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Ziua Internațională a Muncii - zi liberă legală.'
  },
  {
    id: 'ro-holiday-childrens-day',
    country_code: 'RO',
    name: 'Ziua Copilului',
    date_pattern: '06-01',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Ziua Internațională a Copilului - zi liberă legală din 2017.'
  },
  {
    id: 'ro-holiday-pentecost',
    country_code: 'RO',
    name: 'Rusaliile',
    date_pattern: 'EASTER+49',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Rusaliile (Duminica Rusaliilor) - zi liberă legală.'
  },
  {
    id: 'ro-holiday-pentecost-monday',
    country_code: 'RO',
    name: 'Lunea Rusaliilor',
    date_pattern: 'EASTER+50',
    is_public_holiday: true,
    is_work_free: true,
    description: 'A doua zi de Rusalii - zi liberă legală.'
  },
  {
    id: 'ro-holiday-assumption',
    country_code: 'RO',
    name: 'Adormirea Maicii Domnului',
    date_pattern: '08-15',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Adormirea Maicii Domnului (Sfânta Maria Mare) - zi liberă legală.'
  },
  {
    id: 'ro-holiday-st-andrew',
    country_code: 'RO',
    name: 'Ziua Sfântului Apostol Andrei',
    date_pattern: '11-30',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Sfântul Andrei - ocrotitorul României - zi liberă legală.'
  },
  {
    id: 'ro-holiday-national-day',
    country_code: 'RO',
    name: 'Ziua Națională a României',
    date_pattern: '12-01',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Ziua Marii Uniri din 1918 - Ziua Națională a României.'
  },
  {
    id: 'ro-holiday-christmas-1',
    country_code: 'RO',
    name: 'Crăciunul - ziua 1',
    date_pattern: '12-25',
    is_public_holiday: true,
    is_work_free: true,
    description: 'Prima zi de Crăciun - Nașterea Domnului.'
  },
  {
    id: 'ro-holiday-christmas-2',
    country_code: 'RO',
    name: 'Crăciunul - ziua 2',
    date_pattern: '12-26',
    is_public_holiday: true,
    is_work_free: true,
    description: 'A doua zi de Crăciun - zi liberă legală.'
  }
]

// ══════════════════════════════════════════════════════════════════════════════
// DOCUMENT TEMPLATES - Romanian SSM/PSI document types
// ══════════════════════════════════════════════════════════════════════════════

export interface RomaniaDocumentTemplate {
  id: string
  country_code: 'RO'
  name: string
  description: string
  category: 'SSM' | 'PSI' | 'MEDICAL' | 'TRAINING' | 'COMPLIANCE'
  is_mandatory: boolean
  legal_reference: string
  template_fields: string[]
}

export const romaniaDocumentTemplates: RomaniaDocumentTemplate[] = [
  {
    id: 'ro-doc-risk-assessment',
    country_code: 'RO',
    name: 'Fișa de evaluare a riscurilor',
    description: 'Document de evaluare a riscurilor profesionale pentru fiecare loc de muncă, parte integrantă a planului de prevenire și protecție.',
    category: 'SSM',
    is_mandatory: true,
    legal_reference: 'Legea 319/2006 - art. 10, HG 1425/2006',
    template_fields: ['workplace_id', 'job_title', 'risk_factors', 'risk_level', 'probability', 'severity', 'prevention_measures', 'ppe_required', 'responsible_person', 'assessment_date', 'review_date']
  },
  {
    id: 'ro-doc-prevention-plan',
    country_code: 'RO',
    name: 'Plan de prevenire și protecție',
    description: 'Document fundamental care cuprinde toate măsurile de prevenire și protecție pentru asigurarea securității și sănătății lucrătorilor.',
    category: 'SSM',
    is_mandatory: true,
    legal_reference: 'Legea 319/2006 - art. 10, HG 1425/2006',
    template_fields: ['company_info', 'risk_assessment_summary', 'prevention_measures', 'ppe_list', 'training_schedule', 'medical_surveillance', 'emergency_procedures', 'responsible_persons', 'review_frequency']
  },
  {
    id: 'ro-doc-training-record',
    country_code: 'RO',
    name: 'Fișa de instruire SSM',
    description: 'Fișă individuală de instruire în domeniul securității și sănătății în muncă pentru fiecare lucrător.',
    category: 'TRAINING',
    is_mandatory: true,
    legal_reference: 'Legea 319/2006 - art. 21, Ordinul 1030/2006',
    template_fields: ['employee_name', 'employee_id', 'job_title', 'training_type', 'training_date', 'duration_hours', 'training_topics', 'trainer_name', 'employee_signature', 'trainer_signature', 'next_training_date']
  },
  {
    id: 'ro-doc-medical-record',
    country_code: 'RO',
    name: 'Fișa de aptitudine medicală',
    description: 'Aviz medical privind aptitudinea pentru munca desfășurată, emis după examinarea medicală.',
    category: 'MEDICAL',
    is_mandatory: true,
    legal_reference: 'HG 355/2007',
    template_fields: ['employee_name', 'cnp', 'job_title', 'examination_type', 'examination_date', 'result', 'restrictions', 'contraindications', 'next_examination_date', 'doctor_name', 'medical_facility', 'stamp_signature']
  },
  {
    id: 'ro-doc-accident-report',
    country_code: 'RO',
    name: 'Declarație de accident de muncă',
    description: 'Declarație obligatorie către ITM pentru raportarea accidentelor de muncă - în termen de 24-48 ore.',
    category: 'SSM',
    is_mandatory: true,
    legal_reference: 'Legea 319/2006 - art. 28, HG 1425/2006',
    template_fields: ['victim_name', 'victim_id', 'accident_date', 'accident_time', 'location', 'activity_performed', 'description', 'injury_type', 'body_part', 'witnesses', 'causes', 'prevention_measures', 'employer_signature', 'reporting_date']
  },
  {
    id: 'ro-doc-accident-investigation',
    country_code: 'RO',
    name: 'Proces verbal de cercetare accident de muncă',
    description: 'Proces verbal al comisiei de cercetare a accidentului de muncă, pentru stabilirea cauzelor și răspunderilor.',
    category: 'SSM',
    is_mandatory: true,
    legal_reference: 'Legea 319/2006 - art. 28, HG 1425/2006',
    template_fields: ['commission_members', 'victim_info', 'accident_details', 'witness_statements', 'causes_identified', 'responsibilities', 'corrective_actions', 'signatures', 'investigation_date']
  },
  {
    id: 'ro-doc-fire-safety-plan',
    country_code: 'RO',
    name: 'Planul de apărare împotriva incendiilor',
    description: 'Plan obligatoriu cu măsurile organizatorice și tehnice pentru prevenirea și stingerea incendiilor.',
    category: 'PSI',
    is_mandatory: true,
    legal_reference: 'Legea 307/2006, Ordinul MAI 163/2007',
    template_fields: ['building_description', 'fire_risk_classification', 'prevention_measures', 'fire_equipment_list', 'evacuation_routes', 'emergency_contacts', 'responsible_persons', 'training_schedule', 'drill_records', 'approval_date', 'isc_approval']
  },
  {
    id: 'ro-doc-fire-equipment-register',
    country_code: 'RO',
    name: 'Registrul de evidență PSI',
    description: 'Registru pentru evidența tuturor mijloacelor tehnice de apărare împotriva incendiilor și verificările periodice.',
    category: 'PSI',
    is_mandatory: true,
    legal_reference: 'Ordinul MAI 163/2007',
    template_fields: ['equipment_type', 'brand_model', 'location', 'serial_number', 'capacity', 'manufacture_date', 'commissioning_date', 'last_inspection', 'next_inspection', 'inspector_name', 'defects', 'status']
  },
  {
    id: 'ro-doc-evacuation-plan',
    country_code: 'RO',
    name: 'Plan de evacuare',
    description: 'Planșă afișată cu traseele de evacuare, locația mijloacelor PSI, punctele de întrunire și instrucțiuni de urmat în caz de incendiu.',
    category: 'PSI',
    is_mandatory: true,
    legal_reference: 'Ordinul MAI 163/2007',
    template_fields: ['floor_layout', 'evacuation_routes', 'emergency_exits', 'fire_equipment_locations', 'assembly_point', 'emergency_numbers', 'instructions', 'legend', 'approval_date']
  },
  {
    id: 'ro-doc-ppe-register',
    country_code: 'RO',
    name: 'Fișa de evidență a EIP',
    description: 'Fișă individuală pentru evidența echipamentelor individuale de protecție distribuite fiecărui lucrător.',
    category: 'SSM',
    is_mandatory: true,
    legal_reference: 'Legea 319/2006 - art. 16, HG 1091/2006',
    template_fields: ['employee_name', 'employee_id', 'job_title', 'ppe_type', 'ppe_standard', 'quantity', 'issue_date', 'lifespan', 'replacement_date', 'employee_signature', 'employer_signature']
  },
  {
    id: 'ro-doc-work-permit',
    country_code: 'RO',
    name: 'Permis de lucru pentru lucrări cu risc ridicat',
    description: 'Permis obligatoriu pentru lucrări cu risc ridicat: înălțime, spații închise, foc deschis, excavații, etc.',
    category: 'SSM',
    is_mandatory: true,
    legal_reference: 'HG 1425/2006',
    template_fields: ['work_type', 'location', 'work_description', 'start_date', 'end_date', 'workers_list', 'risks_identified', 'safety_measures', 'ppe_required', 'emergency_procedures', 'approver_name', 'approver_signature', 'workers_signatures']
  },
  {
    id: 'ro-doc-emergency-plan',
    country_code: 'RO',
    name: 'Plan de acțiune în situații de urgență',
    description: 'Plan cu proceduri de urmat în caz de situații de urgență: incendii, explozii, accidente chimice, seisme.',
    category: 'SSM',
    is_mandatory: true,
    legal_reference: 'Legea 319/2006 - art. 15, HG 1425/2006',
    template_fields: ['emergency_scenarios', 'alarm_procedures', 'evacuation_procedures', 'first_aid_procedures', 'emergency_team', 'external_contacts', 'meeting_point', 'communication_plan', 'last_drill_date']
  },
  {
    id: 'ro-doc-ssm-instructions',
    country_code: 'RO',
    name: 'Instrucțiuni proprii SSM',
    description: 'Instrucțiuni proprii de securitate și sănătate în muncă adaptate la specificul activității și locurilor de muncă.',
    category: 'SSM',
    is_mandatory: true,
    legal_reference: 'Legea 319/2006, HG 1425/2006',
    template_fields: ['workplace_equipment', 'job_description', 'preparation_procedures', 'safe_work_procedures', 'ppe_usage', 'prohibited_actions', 'emergency_procedures', 'responsible_person', 'approval_date', 'review_date']
  },
  {
    id: 'ro-doc-compliance-report',
    country_code: 'RO',
    name: 'Raport anual de activitate SSM',
    description: 'Raport anual privind activitatea de prevenire și protecție desfășurată, prezentat conducerii și comitetului de securitate.',
    category: 'COMPLIANCE',
    is_mandatory: true,
    legal_reference: 'Legea 319/2006, HG 1425/2006',
    template_fields: ['reporting_period', 'activities_performed', 'risk_assessments', 'training_statistics', 'medical_examinations', 'accidents_incidents', 'inspections', 'improvements_proposed', 'budget_allocated', 'responsible_person', 'submission_date']
  },
  {
    id: 'ro-doc-medical-surveillance',
    country_code: 'RO',
    name: 'Fișa de expunere la factori de risc',
    description: 'Fișă de supraveghere medicală cu evidența expunerii lucrătorilor la factori de risc profesional.',
    category: 'MEDICAL',
    is_mandatory: true,
    legal_reference: 'HG 355/2007',
    template_fields: ['employee_name', 'cnp', 'job_title', 'workplace', 'risk_factors', 'exposure_duration', 'exposure_level', 'ppe_used', 'medical_surveillance_frequency', 'doctor_name', 'last_update']
  }
]

// ══════════════════════════════════════════════════════════════════════════════
// CAEN RISK MAPPINGS - Romanian CAEN code to risk level mappings
// ══════════════════════════════════════════════════════════════════════════════

export interface RomaniaCAENRiskMapping {
  id: string
  country_code: 'RO'
  caen_code: string
  caen_description: string
  risk_level: 'scazut' | 'mediu' | 'ridicat' | 'foarte_ridicat'
  main_risk_factors: string[]
  required_training: string[]
  medical_surveillance_frequency_months: number
  ppe_required: string[]
  notes: string | null
}

export const romaniaCAENRiskMappings: RomaniaCAENRiskMapping[] = [
  {
    id: 'ro-caen-0111',
    country_code: 'RO',
    caen_code: '0111',
    caen_description: 'Cultivarea cerealelor (exclusiv orez), plantelor leguminoase și plantelor producătoare de semințe oleaginoase',
    risk_level: 'mediu',
    main_risk_factors: ['Expunere la pesticide', 'Manipulare echipamente agricole', 'Efort fizic', 'Vibrații', 'Zgomot'],
    required_training: ['ro-training-general-ssm', 'ro-training-specific-ssm', 'ro-training-hazardous-substances'],
    medical_surveillance_frequency_months: 12,
    ppe_required: ['Mănuși de protecție', 'Măști respiratorii', 'Încălțăminte de siguranță', 'Îmbrăcăminte de protecție'],
    notes: 'Risc crescut în sezonul de aplicare pesticide și recoltare.'
  },
  {
    id: 'ro-caen-0810',
    country_code: 'RO',
    caen_code: '0810',
    caen_description: 'Extracția pietrei ornamentale și a pietrei pentru construcții, extracția pietrei calcaroase, ghipsului, cretei și a ardeziei',
    risk_level: 'foarte_ridicat',
    main_risk_factors: ['Praf silicos', 'Zgomot intens', 'Vibrații puternice', 'Risc de prăbușire', 'Risc mecanic'],
    required_training: ['ro-training-general-ssm', 'ro-training-specific-ssm', 'ro-training-height-work', 'ro-training-first-aid'],
    medical_surveillance_frequency_months: 6,
    ppe_required: ['Căști de protecție', 'Ochelari de protecție', 'Mască antiPraf FFP3', 'Dopuri/Căști antifonice', 'Încălțăminte de siguranță S3', 'Vestă reflectorizantă'],
    notes: 'Risc major de silicoză. Necesită monitorizare medicală frecventă și măsurători ale concentrației de praf.'
  },
  {
    id: 'ro-caen-1071',
    country_code: 'RO',
    caen_code: '1071',
    caen_description: 'Fabricarea pâinii; fabricarea prăjiturilor și a produselor proaspete de patiserie',
    risk_level: 'mediu',
    main_risk_factors: ['Temperaturi ridicate', 'Risc de arsuri', 'Efort fizic', 'Program de noapte', 'Alergeni (făină)'],
    required_training: ['ro-training-general-ssm', 'ro-training-specific-ssm', 'ro-training-fire-safety', 'ro-training-first-aid'],
    medical_surveillance_frequency_months: 12,
    ppe_required: ['Mănuși termorezistente', 'Sort de protecție', 'Bonete', 'Încălțăminte antiderapantă'],
    notes: 'Risc de alergii respiratorii la făină. Control medical anual obligatoriu pentru lucrul de noapte.'
  },
  {
    id: 'ro-caen-1610',
    country_code: 'RO',
    caen_code: '1610',
    caen_description: 'Tăierea și rindeluirea lemnului',
    risk_level: 'ridicat',
    main_risk_factors: ['Zgomot intens', 'Vibrații', 'Praf de lemn', 'Risc mecanic (ferăstraie, rindele)', 'Efort fizic'],
    required_training: ['ro-training-general-ssm', 'ro-training-specific-ssm', 'ro-training-forklift'],
    medical_surveillance_frequency_months: 12,
    ppe_required: ['Ochelari de protecție', 'Căști antifonice', 'Mască antiPraf FFP2', 'Mănuși de protecție mecanică', 'Încălțăminte de siguranță S3'],
    notes: 'Praful de lemn dur este clasificat cancerigen. Necesită ventilație adecvată și monitorizare expunere.'
  },
  {
    id: 'ro-caen-2511',
    country_code: 'RO',
    caen_code: '2511',
    caen_description: 'Fabricarea de construcții metalice și părți componente ale structurilor metalice',
    risk_level: 'ridicat',
    main_risk_factors: ['Zgomot', 'Sudură (radiații UV, fum metalic)', 'Risc mecanic', 'Risc electric', 'Căldură'],
    required_training: ['ro-training-general-ssm', 'ro-training-specific-ssm', 'ro-training-height-work', 'ro-training-electrical', 'ro-training-forklift'],
    medical_surveillance_frequency_months: 12,
    ppe_required: ['Căști de protecție', 'Ochelari/Măști de sudură', 'Mănuși de sudură', 'Şorț de protecție', 'Încălțăminte de siguranță S3', 'Căști antifonice'],
    notes: 'Risc respirator prin fumii de sudură (oxizi metalici). Ventilație și aspirație la punctele de sudură.'
  },
  {
    id: 'ro-caen-4120',
    country_code: 'RO',
    caen_code: '4120',
    caen_description: 'Lucrări de construcții a clădirilor rezidențiale și nerezidențiale',
    risk_level: 'foarte_ridicat',
    main_risk_factors: ['Lucru la înălțime', 'Risc de cădere', 'Risc mecanic', 'Efort fizic intens', 'Condiții meteo', 'Praf, zgomot'],
    required_training: ['ro-training-general-ssm', 'ro-training-specific-ssm', 'ro-training-height-work', 'ro-training-first-aid', 'ro-training-forklift'],
    medical_surveillance_frequency_months: 12,
    ppe_required: ['Căști de protecție', 'Ham de siguranță + franghie de siguranță', 'Mănuși de protecție mecanică', 'Încălțăminte de siguranță S3', 'Vestă reflectorizantă', 'Ochelari de protecție'],
    notes: 'Sector cu cel mai mare număr de accidente mortale. Necesită permise de lucru la înălțime și inspecții zilnice ale EIP.'
  },
  {
    id: 'ro-caen-4312',
    country_code: 'RO',
    caen_code: '4312',
    caen_description: 'Lucrări de pregătire a terenului',
    risk_level: 'ridicat',
    main_risk_factors: ['Risc de prăbușire excavații', 'Risc mecanic (utilaje grele)', 'Zgomot', 'Vibrații', 'Praf'],
    required_training: ['ro-training-general-ssm', 'ro-training-specific-ssm', 'ro-training-confined-spaces', 'ro-training-forklift'],
    medical_surveillance_frequency_months: 12,
    ppe_required: ['Căști de protecție', 'Vestă reflectorizantă', 'Încălțăminte de siguranță S3', 'Mănuși de protecție', 'Măști antiPraf'],
    notes: 'Verificare zilnică a stabilității malurilor de excavație. Risc de lovire de către utilaje în mișcare.'
  },
  {
    id: 'ro-caen-4321',
    country_code: 'RO',
    caen_code: '4321',
    caen_description: 'Lucrări de instalații electrice',
    risk_level: 'foarte_ridicat',
    main_risk_factors: ['Risc electric', 'Lucru sub tensiune', 'Lucru la înălțime', 'Risc de electrocutare'],
    required_training: ['ro-training-general-ssm', 'ro-training-specific-ssm', 'ro-training-electrical', 'ro-training-height-work', 'ro-training-first-aid'],
    medical_surveillance_frequency_months: 12,
    ppe_required: ['Mănuși dielectrice', 'Încălțăminte izolantă', 'Căști de protecție', 'Scule izolate', 'Vestă reflectorizantă', 'Ecran facial'],
    notes: 'Personal trebuie autorizat electric (ANRE). Permise de lucru obligatorii pentru lucrări sub tensiune.'
  },
  {
    id: 'ro-caen-4941',
    country_code: 'RO',
    caen_code: '4941',
    caen_description: 'Transporturi rutiere de mărfuri',
    risk_level: 'mediu',
    main_risk_factors: ['Risc rutier', 'Efort fizic (încărcare/descărcare)', 'Poziții vicioase (șezut prelungit)', 'Stres', 'Program neregulat'],
    required_training: ['ro-training-general-ssm', 'ro-training-specific-ssm', 'ro-training-ergonomics', 'ro-training-first-aid'],
    medical_surveillance_frequency_months: 12,
    ppe_required: ['Vestă reflectorizantă', 'Încălțăminte de siguranță', 'Mănuși de protecție (la manipulare mărfuri)'],
    notes: 'Control medical specific pentru șoferi profesioniști (aviz psihologic). Risc cardiovascular crescut.'
  },
  {
    id: 'ro-caen-5610',
    country_code: 'RO',
    caen_code: '5610',
    caen_description: 'Restaurante',
    risk_level: 'mediu',
    main_risk_factors: ['Risc de tăiere', 'Risc de arsuri', 'Alunecare/Cădere', 'Efort fizic', 'Program prelungit', 'Stres'],
    required_training: ['ro-training-general-ssm', 'ro-training-specific-ssm', 'ro-training-fire-safety', 'ro-training-first-aid'],
    medical_surveillance_frequency_months: 24,
    ppe_required: ['Încălțăminte antiderapantă', 'Sort de protecție', 'Mănuși termorezistente (bucătărie)', 'Bonete'],
    notes: 'Libret sanitar obligatoriu. Risc crescut de accidente prin tăiere și arsuri în bucătărie.'
  },
  {
    id: 'ro-caen-6201',
    country_code: 'RO',
    caen_code: '6201',
    caen_description: 'Activități de realizare a soft-ului la comandă (software orientat client)',
    risk_level: 'scazut',
    main_risk_factors: ['Efort vizual', 'Poziții vicioase', 'Muncă la calculator peste 4h/zi', 'Stres', 'Sedentarism'],
    required_training: ['ro-training-general-ssm', 'ro-training-specific-ssm', 'ro-training-ergonomics'],
    medical_surveillance_frequency_months: 24,
    ppe_required: [],
    notes: 'Control medical oftalmologic obligatoriu pentru utilizatorii de ecrane de vizualizare. Pauze obligatorii la 50 minute lucru.'
  },
  {
    id: 'ro-caen-6910',
    country_code: 'RO',
    caen_code: '6910',
    caen_description: 'Activități juridice',
    risk_level: 'scazut',
    main_risk_factors: ['Efort vizual', 'Poziții vicioase', 'Muncă la calculator', 'Stres psihologic'],
    required_training: ['ro-training-general-ssm', 'ro-training-specific-ssm'],
    medical_surveillance_frequency_months: 24,
    ppe_required: [],
    notes: 'Risc ocupațional scăzut. Control medical general la 2 ani.'
  },
  {
    id: 'ro-caen-8610',
    country_code: 'RO',
    caen_code: '8610',
    caen_description: 'Activități de asistență spitalicească',
    risk_level: 'ridicat',
    main_risk_factors: ['Risc biologic', 'Risc de înțepare/tăiere (ace, bisturiu)', 'Efort fizic', 'Stres psihologic', 'Program de noapte', 'Radiații (radiologie)'],
    required_training: ['ro-training-general-ssm', 'ro-training-specific-ssm', 'ro-training-hazardous-substances', 'ro-training-first-aid', 'ro-training-pandemic'],
    medical_surveillance_frequency_months: 12,
    ppe_required: ['Mănuși medicale', 'Măști chirurgicale/FFP2', 'Ochelari de protecție', 'Halat de protecție', 'Vizieră (proceduri cu risc)'],
    notes: 'Vaccinare obligatorie hepatită B. Control medical special pentru expunere la radiații ionizante (imagistică).'
  },
  {
    id: 'ro-caen-8621',
    country_code: 'RO',
    caen_code: '8621',
    caen_description: 'Activități de asistență medicală generală',
    risk_level: 'mediu',
    main_risk_factors: ['Risc biologic', 'Risc de înțepare', 'Efort psihologic', 'Program prelungit'],
    required_training: ['ro-training-general-ssm', 'ro-training-specific-ssm', 'ro-training-hazardous-substances', 'ro-training-pandemic'],
    medical_surveillance_frequency_months: 12,
    ppe_required: ['Mănuși medicale', 'Măști chirurgicale', 'Halat de protecție'],
    notes: 'Vaccinare hepatită B recomandată. Protocoale clare pentru gestionarea deșeurilor medicale.'
  },
  {
    id: 'ro-caen-8720',
    country_code: 'RO',
    caen_code: '8720',
    caen_description: 'Activități de îngrijire medicală specializată și activități de îngrijire la domiciliu pentru persoanele în vârstă și cu handicap',
    risk_level: 'mediu',
    main_risk_factors: ['Efort fizic (manipulare pacienti)', 'Risc biologic', 'Stres psihologic', 'Risc de agresiune'],
    required_training: ['ro-training-general-ssm', 'ro-training-specific-ssm', 'ro-training-ergonomics', 'ro-training-first-aid'],
    medical_surveillance_frequency_months: 12,
    ppe_required: ['Mănuși de protecție', 'Sort de protecție', 'Încălțăminte antiderapantă'],
    notes: 'Risc musculo-scheletic ridicat. Instruire obligatorie pentru manipularea și transferul pacienților.'
  }
]

// ══════════════════════════════════════════════════════════════════════════════
// COR CODES - Romanian occupational classification codes
// ══════════════════════════════════════════════════════════════════════════════

export interface RomaniaCORCode {
  id: string
  country_code: 'RO'
  cor_code: string
  cor_title: string
  description: string
  risk_level: 'scazut' | 'mediu' | 'ridicat' | 'foarte_ridicat'
  main_risk_factors: string[]
  required_training: string[]
  medical_surveillance_frequency_months: number
  typical_ppe: string[]
}

export const romaniaCORCodes: RomaniaCORCode[] = [
  {
    id: 'ro-cor-1120',
    country_code: 'RO',
    cor_code: '1120',
    cor_title: 'Directori executivi, directori generali și directori generali adjuncți',
    description: 'Personal de conducere la nivel executiv, responsabil pentru gestionarea strategică a organizației.',
    risk_level: 'scazut',
    main_risk_factors: ['Stres psihologic', 'Program prelungit', 'Sedentarism', 'Efort vizual'],
    required_training: ['ro-training-general-ssm', 'ro-training-fire-safety'],
    medical_surveillance_frequency_months: 24,
    typical_ppe: []
  },
  {
    id: 'ro-cor-2120',
    country_code: 'RO',
    cor_code: '2120',
    cor_title: 'Matematicieni, actuari, statisticieni și specialiști în domenii conexe',
    description: 'Specialiști în analiză matematică, statistică și modelare actuarială.',
    risk_level: 'scazut',
    main_risk_factors: ['Efort vizual', 'Muncă la calculator', 'Poziții vicioase', 'Sedentarism'],
    required_training: ['ro-training-general-ssm', 'ro-training-ergonomics'],
    medical_surveillance_frequency_months: 24,
    typical_ppe: []
  },
  {
    id: 'ro-cor-2512',
    country_code: 'RO',
    cor_code: '2512',
    cor_title: 'Programatori de aplicații pentru utilizatori (software)',
    description: 'Specialiști în dezvoltarea de aplicații software pentru utilizatori finali.',
    risk_level: 'scazut',
    main_risk_factors: ['Efort vizual', 'Muncă la calculator peste 4h/zi', 'Poziții vicioase', 'Stres', 'Sedentarism'],
    required_training: ['ro-training-general-ssm', 'ro-training-ergonomics'],
    medical_surveillance_frequency_months: 24,
    typical_ppe: []
  },
  {
    id: 'ro-cor-3122',
    country_code: 'RO',
    cor_code: '3122',
    cor_title: 'Inspectori de securitate în muncă',
    description: 'Specialiști în prevenirea și protecția securității și sănătății în muncă.',
    risk_level: 'scazut',
    main_risk_factors: ['Efort fizic moderat (inspecții teren)', 'Stres', 'Deplasări frecvente'],
    required_training: ['ro-training-general-ssm', 'ro-training-specific-ssm', 'ro-training-fire-safety', 'ro-training-first-aid'],
    medical_surveillance_frequency_months: 24,
    typical_ppe: ['Căști de protecție (la vizite în șantiere)', 'Vestă reflectorizantă', 'Încălțăminte de siguranță']
  },
  {
    id: 'ro-cor-7111',
    country_code: 'RO',
    cor_code: '7111',
    cor_title: 'Zidari și pietrai',
    description: 'Muncitori calificați în construcții care execută lucrări de zidărie și piatră.',
    risk_level: 'ridicat',
    main_risk_factors: ['Efort fizic intens', 'Manipulare sarcini grele', 'Expunere la praf', 'Lucru la înălțime', 'Condiții meteo', 'Poziții vicioase'],
    required_training: ['ro-training-general-ssm', 'ro-training-specific-ssm', 'ro-training-height-work', 'ro-training-ergonomics'],
    medical_surveillance_frequency_months: 12,
    typical_ppe: ['Căști de protecție', 'Mănuși de protecție mecanică', 'Încălțăminte de siguranță S3', 'Genunchiere', 'Măști antiPraf', 'Ham de siguranță (la înălțime)']
  },
  {
    id: 'ro-cor-7115',
    country_code: 'RO',
    cor_code: '7115',
    cor_title: 'Dulgheri și tâmplari',
    description: 'Muncitori calificați în prelucrarea lemnului pentru construcții și mobilier.',
    risk_level: 'ridicat',
    main_risk_factors: ['Risc mecanic (ferăstraie, mașini)', 'Zgomot intens', 'Praf de lemn', 'Vibrații', 'Efort fizic'],
    required_training: ['ro-training-general-ssm', 'ro-training-specific-ssm', 'ro-training-first-aid'],
    medical_surveillance_frequency_months: 12,
    typical_ppe: ['Ochelari de protecție', 'Căști antifonice', 'Mască antiPraf FFP2', 'Mănuși de protecție mecanică', 'Încălțăminte de siguranță S3']
  },
  {
    id: 'ro-cor-7212',
    country_code: 'RO',
    cor_code: '7212',
    cor_title: 'Sudori și tăietori cu flacără',
    description: 'Muncitori calificați în sudură și tăiere cu gaz sau arc electric.',
    risk_level: 'foarte_ridicat',
    main_risk_factors: ['Radiații UV', 'Fumuri metalice', 'Risc de arsuri', 'Risc electric', 'Risc de explozie', 'Căldură'],
    required_training: ['ro-training-general-ssm', 'ro-training-specific-ssm', 'ro-training-fire-safety', 'ro-training-confined-spaces', 'ro-training-first-aid'],
    medical_surveillance_frequency_months: 12,
    typical_ppe: ['Mască de sudură automată', 'Mănuși de sudură', 'Șorț de piele', 'Încălțăminte de siguranță S3', 'Gamașe', 'Căști antifonice']
  },
  {
    id: 'ro-cor-7233',
    country_code: 'RO',
    cor_code: '7233',
    cor_title: 'Operatori la mașini și instalații pentru prelucrarea lemnului',
    description: 'Operatori de mașini de tăiat, rindeluit și frezat lemn.',
    risk_level: 'ridicat',
    main_risk_factors: ['Risc mecanic', 'Zgomot intens', 'Vibrații', 'Praf de lemn', 'Risc de prindere'],
    required_training: ['ro-training-general-ssm', 'ro-training-specific-ssm', 'ro-training-first-aid'],
    medical_surveillance_frequency_months: 12,
    typical_ppe: ['Ochelari de protecție', 'Căști antifonice', 'Mască antiPraf FFP2', 'Mănuși anti-vibrații', 'Încălțăminte de siguranță S3', 'Îmbrăcăminte strânsă pe corp']
  },
  {
    id: 'ro-cor-7412',
    country_code: 'RO',
    cor_code: '7412',
    cor_title: 'Electricieni în construcții civile și asimilați',
    description: 'Electricieni care montează și întreține instalații electrice în clădiri.',
    risk_level: 'foarte_ridicat',
    main_risk_factors: ['Risc electric', 'Electrocutare', 'Arsuri electrice', 'Lucru la înălțime', 'Risc de cădere'],
    required_training: ['ro-training-general-ssm', 'ro-training-specific-ssm', 'ro-training-electrical', 'ro-training-height-work', 'ro-training-first-aid'],
    medical_surveillance_frequency_months: 12,
    typical_ppe: ['Mănuși dielectrice', 'Încălțăminte izolantă', 'Căști de protecție', 'Scule izolate', 'Detector de tensiune', 'Ham de siguranță']
  },
  {
    id: 'ro-cor-8311',
    country_code: 'RO',
    cor_code: '8311',
    cor_title: 'Operatori la locomotivă',
    description: 'Conducători de trenuri și locomotive pe căi ferate.',
    risk_level: 'mediu',
    main_risk_factors: ['Stres psihologic', 'Program neregulat', 'Muncă de noapte', 'Vibrații', 'Zgomot', 'Poziții vicioase'],
    required_training: ['ro-training-general-ssm', 'ro-training-specific-ssm', 'ro-training-first-aid'],
    medical_surveillance_frequency_months: 12,
    typical_ppe: ['Vestă reflectorizantă', 'Încălțăminte de siguranță', 'Căști antifonice']
  },
  {
    id: 'ro-cor-8322',
    country_code: 'RO',
    cor_code: '8322',
    cor_title: 'Șoferi de autoturisme, taxiuri și dubite',
    description: 'Conducători auto profesioniști pentru transport persoane.',
    risk_level: 'mediu',
    main_risk_factors: ['Risc rutier', 'Stres', 'Poziții vicioase (șezut prelungit)', 'Vibrații', 'Program neregulat'],
    required_training: ['ro-training-general-ssm', 'ro-training-specific-ssm', 'ro-training-first-aid'],
    medical_surveillance_frequency_months: 12,
    typical_ppe: ['Vestă reflectorizantă', 'Trusa prim ajutor']
  },
  {
    id: 'ro-cor-8332',
    country_code: 'RO',
    cor_code: '8332',
    cor_title: 'Șoferi de camioane și de vehicule grele',
    description: 'Conducători auto profesioniști pentru transport mărfuri.',
    risk_level: 'mediu',
    main_risk_factors: ['Risc rutier', 'Efort fizic (încărcare/descărcare)', 'Poziții vicioase', 'Stres', 'Program neregulat'],
    required_training: ['ro-training-general-ssm', 'ro-training-specific-ssm', 'ro-training-ergonomics', 'ro-training-first-aid'],
    medical_surveillance_frequency_months: 12,
    typical_ppe: ['Vestă reflectorizantă', 'Mănuși de protecție', 'Încălțăminte de siguranță']
  },
  {
    id: 'ro-cor-8343',
    country_code: 'RO',
    cor_code: '8343',
    cor_title: 'Operatori la macarale, stivuitoare și alte utilaje cu acționare la distanță',
    description: 'Operatori de echipamente de ridicat și transportat sarcini.',
    risk_level: 'ridicat',
    main_risk_factors: ['Risc mecanic', 'Risc de cădere sarcini', 'Risc de lovire', 'Stres', 'Vibrații', 'Zgomot'],
    required_training: ['ro-training-general-ssm', 'ro-training-specific-ssm', 'ro-training-forklift', 'ro-training-first-aid'],
    medical_surveillance_frequency_months: 12,
    typical_ppe: ['Căști de protecție', 'Vestă reflectorizantă', 'Încălțăminte de siguranță S3', 'Căști antifonice']
  },
  {
    id: 'ro-cor-9111',
    country_code: 'RO',
    cor_code: '9111',
    cor_title: 'Ajutori de bucătari',
    description: 'Personal auxiliar în bucătării pentru pregătirea alimentelor.',
    risk_level: 'mediu',
    main_risk_factors: ['Risc de tăiere', 'Risc de arsuri', 'Alunecare', 'Efort fizic', 'Temperaturi extreme', 'Umiditate'],
    required_training: ['ro-training-general-ssm', 'ro-training-specific-ssm', 'ro-training-fire-safety', 'ro-training-first-aid'],
    medical_surveillance_frequency_months: 24,
    typical_ppe: ['Încălțăminte antiderapantă', 'Sort de protecție', 'Mănuși termorezistente', 'Bonete']
  },
  {
    id: 'ro-cor-9334',
    country_code: 'RO',
    cor_code: '9334',
    cor_title: 'Lucrători necalificați în fabricarea produselor din lemn',
    description: 'Muncitori necalificați în industria prelucrării lemnului.',
    risk_level: 'ridicat',
    main_risk_factors: ['Risc mecanic', 'Praf de lemn', 'Zgomot', 'Vibrații', 'Efort fizic'],
    required_training: ['ro-training-general-ssm', 'ro-training-specific-ssm'],
    medical_surveillance_frequency_months: 12,
    typical_ppe: ['Ochelari de protecție', 'Mască antiPraf FFP2', 'Mănuși de protecție', 'Încălțăminte de siguranță', 'Căști antifonice']
  }
]

// ══════════════════════════════════════════════════════════════════════════════
// MAIN SEED FUNCTION
// ══════════════════════════════════════════════════════════════════════════════

export async function seedRomaniaComplete() {
  const supabase = await createSupabaseServer()
  const results = {
    legislation: 0,
    trainingTypes: 0,
    medicalTypes: 0,
    penalties: 0,
    holidays: 0,
    documentTemplates: 0,
    caenRiskMappings: 0,
    corCodes: 0,
    errors: [] as string[]
  }

  try {
    // 1. Seed Legislation
    console.log('📚 Seeding Romania legislation...')
    for (const item of romaniaLegislation) {
      const { error } = await supabase
        .from('legislation_entries')
        .upsert({
          id: item.id,
          country_code: item.country_code,
          domain: item.domain,
          act_number: item.act_number,
          act_date: item.act_date,
          title: item.title,
          official_journal_ref: item.official_journal_ref,
          source_url: item.source_url,
          raw_metadata: {
            description: item.description
          },
          scraped_at: new Date().toISOString()
        }, { onConflict: 'id' })

      if (error) {
        results.errors.push(`Legislation ${item.id}: ${error.message}`)
      } else {
        results.legislation++
      }
    }

    // 2. Seed Training Types (as obligation_types)
    console.log('🎓 Seeding Romania training types...')
    for (const item of romaniaTrainingTypes) {
      const { error } = await supabase
        .from('obligation_types')
        .upsert({
          id: item.id,
          country_code: item.country_code,
          name: item.name,
          description: item.description,
          frequency: item.frequency,
          authority_name: 'Inspectoratul Teritorial de Muncă (ITM)',
          legal_reference: item.legal_reference,
          penalty_min: null,
          penalty_max: null,
          currency: 'RON',
          is_active: true,
          is_system: true,
          display_order: romaniaTrainingTypes.indexOf(item) + 1
        }, { onConflict: 'id' })

      if (error) {
        results.errors.push(`Training ${item.id}: ${error.message}`)
      } else {
        results.trainingTypes++
      }
    }

    // 3. Seed Medical Types (as metadata - can be extended to separate table)
    console.log('🏥 Seeding Romania medical types...')
    results.medicalTypes = romaniaMedicalTypes.length
    console.log(`✅ Prepared ${results.medicalTypes} medical types (metadata only)`)

    // 4. Seed Penalties
    console.log('⚠️ Seeding Romania penalties...')
    for (const item of romaniaPenalties) {
      const { error } = await supabase
        .from('penalties')
        .upsert({
          id: item.id,
          country_code: item.country_code,
          violation_type: item.violation_type,
          description: item.description,
          penalty_min_amount: item.penalty_min_ron,
          penalty_max_amount: item.penalty_max_ron,
          currency: 'RON',
          legal_reference: item.legal_reference,
          severity: item.severity,
          is_active: true
        }, { onConflict: 'id' })

      if (error) {
        results.errors.push(`Penalty ${item.id}: ${error.message}`)
      } else {
        results.penalties++
      }
    }

    // 5. Seed Holidays
    console.log('📅 Seeding Romania holidays...')
    for (const item of romaniaHolidays) {
      const { error } = await supabase
        .from('holidays')
        .upsert({
          id: item.id,
          country_code: item.country_code,
          name: item.name,
          date_pattern: item.date_pattern,
          is_public_holiday: item.is_public_holiday,
          is_work_free: item.is_work_free,
          description: item.description
        }, { onConflict: 'id' })

      if (error) {
        results.errors.push(`Holiday ${item.id}: ${error.message}`)
      } else {
        results.holidays++
      }
    }

    // 6. Seed Document Templates
    console.log('📄 Seeding Romania document templates...')
    for (const item of romaniaDocumentTemplates) {
      const { error } = await supabase
        .from('document_templates')
        .upsert({
          id: item.id,
          country_code: item.country_code,
          name: item.name,
          description: item.description,
          category: item.category,
          is_mandatory: item.is_mandatory,
          legal_reference: item.legal_reference,
          template_fields: item.template_fields
        }, { onConflict: 'id' })

      if (error) {
        results.errors.push(`Document ${item.id}: ${error.message}`)
      } else {
        results.documentTemplates++
      }
    }

    // 7. Seed CAEN Risk Mappings (as metadata - can be extended to separate table)
    console.log('🏭 Seeding Romania CAEN risk mappings...')
    results.caenRiskMappings = romaniaCAENRiskMappings.length
    console.log(`✅ Prepared ${results.caenRiskMappings} CAEN risk mappings (metadata only)`)

    // 8. Seed COR Codes (as metadata - can be extended to separate table)
    console.log('👷 Seeding Romania COR codes...')
    results.corCodes = romaniaCORCodes.length
    console.log(`✅ Prepared ${results.corCodes} COR codes (metadata only)`)

    console.log('\n✅ Romania Complete Seed Summary:')
    console.log(`   📚 Legislation: ${results.legislation}/${romaniaLegislation.length}`)
    console.log(`   🎓 Training Types: ${results.trainingTypes}/${romaniaTrainingTypes.length}`)
    console.log(`   🏥 Medical Types: ${results.medicalTypes} (metadata)`)
    console.log(`   ⚠️ Penalties: ${results.penalties}/${romaniaPenalties.length}`)
    console.log(`   📅 Holidays: ${results.holidays}/${romaniaHolidays.length}`)
    console.log(`   📄 Document Templates: ${results.documentTemplates}/${romaniaDocumentTemplates.length}`)
    console.log(`   🏭 CAEN Risk Mappings: ${results.caenRiskMappings} (metadata)`)
    console.log(`   👷 COR Codes: ${results.corCodes} (metadata)`)

    if (results.errors.length > 0) {
      console.error('\n❌ Errors encountered:')
      results.errors.forEach(err => console.error(`   - ${err}`))
    }

    return results

  } catch (error) {
    console.error('❌ Fatal error during Romania seed:', error)
    throw error
  }
}

// Export all datasets for external use
export default {
  legislation: romaniaLegislation,
  trainingTypes: romaniaTrainingTypes,
  medicalTypes: romaniaMedicalTypes,
  penalties: romaniaPenalties,
  holidays: romaniaHolidays,
  documentTemplates: romaniaDocumentTemplates,
  caenRiskMappings: romaniaCAENRiskMappings,
  corCodes: romaniaCORCodes,
  seedRomaniaComplete
}
