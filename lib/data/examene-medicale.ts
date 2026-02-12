/**
 * Tipuri de examene medicale obligatorii conform HG 355/2007
 * Nomenclator examene medicale pentru medicina muncii
 */

export interface ExamenMedical {
  id: string;
  name: string;
  description: string;
  periodicitateLuni: number | null; // null = doar la angajare/adaptare
  categoriiAngajati: string[]; // Factori de risc care impun examenul
  analizeLaborator: string[];
  legalBasis: string;
  costEstimat: number; // RON
}

export const EXAMENE_MEDICALE: ExamenMedical[] = [
  {
    id: 'examen-angajare',
    name: 'Examen medical la angajare',
    description: 'Examen medical obligatoriu pentru toți angajații înainte de angajare, pentru evaluarea aptitudinii la locul de muncă',
    periodicitateLuni: null,
    categoriiAngajati: ['Toți angajații'],
    analizeLaborator: [
      'Hemoleucogramă completă',
      'VSH (viteză sedimentare hematii)',
      'Glicemie',
      'Examen sumar de urină',
      'Transaminaze (TGO, TGP)',
      'Acid uric',
      'Colesterol total',
      'Creatinină',
      'Spirometrie',
      'EKG',
      'Examen oftalmologic',
      'Examen ORL',
      'Acuitate vizuală',
      'Audiogramă'
    ],
    legalBasis: 'HG 355/2007, art. 24',
    costEstimat: 350
  },
  {
    id: 'examen-periodic',
    name: 'Examen medical periodic',
    description: 'Examen medical de control periodic pentru toți angajații, efectuat la intervale stabilite în funcție de factorii de risc',
    periodicitateLuni: 12,
    categoriiAngajati: ['Toți angajații'],
    analizeLaborator: [
      'Hemoleucogramă completă',
      'VSH',
      'Glicemie',
      'Examen sumar de urină',
      'Transaminaze (TGO, TGP)',
      'Colesterol total',
      'Trigliceride',
      'Spirometrie',
      'EKG',
      'Tensiune arterială'
    ],
    legalBasis: 'HG 355/2007, art. 25',
    costEstimat: 280
  },
  {
    id: 'examen-adaptare',
    name: 'Examen medical la adaptarea la locul de muncă',
    description: 'Examen medical efectuat când angajatul este transferat la un alt loc de muncă cu factori de risc diferiți',
    periodicitateLuni: null,
    categoriiAngajati: ['Angajați transferați intern'],
    analizeLaborator: [
      'Hemoleucogramă',
      'Glicemie',
      'Examen sumar de urină',
      'Spirometrie',
      'EKG',
      'Alte analize în funcție de noii factori de risc'
    ],
    legalBasis: 'HG 355/2007, art. 26',
    costEstimat: 250
  },
  {
    id: 'examen-reluare',
    name: 'Examen medical la reluarea activității',
    description: 'Examen medical obligatoriu la revenirea la muncă după absență pentru boală mai mare de 90 zile',
    periodicitateLuni: null,
    categoriiAngajati: ['Angajați după concediu medical > 90 zile'],
    analizeLaborator: [
      'Hemoleucogramă',
      'VSH',
      'Glicemie',
      'Examen sumar de urină',
      'Spirometrie',
      'EKG',
      'Consultație medicină muncii',
      'Alte investigații în funcție de afecțiune'
    ],
    legalBasis: 'HG 355/2007, art. 27',
    costEstimat: 300
  },
  {
    id: 'expunere-zgomot',
    name: 'Examen medical pentru expunere la zgomot',
    description: 'Examen medical specific pentru lucrători expuși la zgomot peste 80 dB(A) timp de 8h',
    periodicitateLuni: 12,
    categoriiAngajati: [
      'Lucrători expuși la zgomot > 80 dB(A)',
      'Operatori utilaje industriale',
      'Lucrători în construcții',
      'Personal aeroport'
    ],
    analizeLaborator: [
      'Hemoleucogramă',
      'Audiogramă tonală',
      'Audiogramă vocală',
      'Examen ORL complet',
      'Timpanometrie',
      'Test Weber și Rinne',
      'Spirometrie',
      'EKG'
    ],
    legalBasis: 'HG 355/2007, Anexa 1, pct. 1',
    costEstimat: 320
  },
  {
    id: 'expunere-vibratii',
    name: 'Examen medical pentru expunere la vibrații',
    description: 'Examen medical pentru lucrători expuși la vibrații mecanice (mână-braț sau corp întreg)',
    periodicitateLuni: 12,
    categoriiAngajati: [
      'Operatori utilaje cu vibrații',
      'Lucrători cu scule pneumatice',
      'Șoferi vehicule industriale',
      'Operatori buldoexcavator'
    ],
    analizeLaborator: [
      'Hemoleucogramă',
      'VSH',
      'Reumatoid factor',
      'Examen neurologic',
      'Examen vascular periferic',
      'Capilaroscopie',
      'Test sensibilitate vibratorie',
      'Radiografie osoasă (la nevoie)',
      'Spirometrie',
      'EKG'
    ],
    legalBasis: 'HG 355/2007, Anexa 1, pct. 2',
    costEstimat: 380
  },
  {
    id: 'expunere-pulberi',
    name: 'Examen medical pentru expunere la pulberi',
    description: 'Examen medical pentru lucrători expuși la pulberi fibrogene (silice, azbest, cărbune)',
    periodicitateLuni: 6,
    categoriiAngajati: [
      'Lucrători în mine',
      'Lucrători în cariere',
      'Lucrători în industria cimentului',
      'Lucrători construcții (tăiere/șlefuire)',
      'Expuși la azbest'
    ],
    analizeLaborator: [
      'Hemoleucogramă completă',
      'VSH',
      'Spirometrie complexă',
      'Radiografie toracică',
      'Teste funcții respiratorii',
      'Gazometrie (la nevoie)',
      'Test provocare bronhică (la nevoie)',
      'CT toracic (la nevoie)',
      'Markeri biologici expunere'
    ],
    legalBasis: 'HG 355/2007, Anexa 1, pct. 3',
    costEstimat: 450
  },
  {
    id: 'expunere-chimica',
    name: 'Examen medical pentru expunere la substanțe chimice',
    description: 'Examen medical pentru lucrători expuși la substanțe chimice periculoase (solvenți, acizi, baze)',
    periodicitateLuni: 6,
    categoriiAngajati: [
      'Lucrători în industrie chimică',
      'Lucrători în vopsitorii',
      'Lucrători în laboratoare',
      'Personal curățenie chimică',
      'Lucrători în rafinării'
    ],
    analizeLaborator: [
      'Hemoleucogramă completă',
      'Transaminaze (TGO, TGP, GGT)',
      'Bilirubină totală și directă',
      'Fosfatază alcalină',
      'Creatinină, uree',
      'Examen sumar de urină',
      'Indicatori biologici expunere specifici',
      'Spirometrie',
      'EKG',
      'Test funcție renală',
      'Test funcție hepatică'
    ],
    legalBasis: 'HG 355/2007, Anexa 1, pct. 4',
    costEstimat: 420
  },
  {
    id: 'expunere-plumb',
    name: 'Examen medical pentru expunere la plumb',
    description: 'Examen medical specific pentru lucrători expuși la plumb și compuși anorganici ai plumbului',
    periodicitateLuni: 6,
    categoriiAngajati: [
      'Lucrători în industria bateriilor',
      'Lucrători în topitorii plumb',
      'Sudori cu electrozi cu plumb',
      'Lucrători în reciclare baterii',
      'Pictori cu vopsele pe bază de plumb'
    ],
    analizeLaborator: [
      'Hemoleucogramă cu frotiu sangvin',
      'Plumbemie',
      'Protoporfirina eritrocitară (ZPP)',
      'Delta aminolevulinat urinar (ALA-U)',
      'Coproporfirină urinară',
      'Creatinină',
      'Transaminaze',
      'Examen neurologic',
      'Test funcție renală'
    ],
    legalBasis: 'HG 355/2007, Anexa 1, pct. 5',
    costEstimat: 480
  },
  {
    id: 'expunere-mercur',
    name: 'Examen medical pentru expunere la mercur',
    description: 'Examen medical pentru lucrători expuși la mercur și compușii săi',
    periodicitateLuni: 6,
    categoriiAngajati: [
      'Lucrători în industria electrochimică',
      'Tehnicieni dentari',
      'Lucrători în producția cloră-sodă',
      'Lucrători în fabricarea termometrelor',
      'Personal laborator chimie'
    ],
    analizeLaborator: [
      'Hemoleucogramă',
      'Mercur urinar',
      'Mercur sangvin (la nevoie)',
      'Creatinină',
      'Proteinurie',
      'Examen neurologic complet',
      'Examen neuropsihologic',
      'Tremor-metrie (la nevoie)',
      'Test funcție renală'
    ],
    legalBasis: 'HG 355/2007, Anexa 1, pct. 6',
    costEstimat: 460
  },
  {
    id: 'expunere-benzen',
    name: 'Examen medical pentru expunere la benzen',
    description: 'Examen medical pentru lucrători expuși la benzen și derivați aromatici',
    periodicitateLuni: 6,
    categoriiAngajati: [
      'Lucrători în industria petrochimică',
      'Lucrători în rafinării',
      'Lucrători în producția vopselelor',
      'Lucrători în industria cauciucului',
      'Personal stații carburanți'
    ],
    analizeLaborator: [
      'Hemoleucogramă completă cu formulă',
      'Reticulocite',
      'Trombocite',
      'Acid fenilmercapturic urinar',
      'Acid trans-trans-muconic urinar',
      'Transaminaze',
      'Mielograma (la indicație)',
      'VSH',
      'Examen sumar de urină'
    ],
    legalBasis: 'HG 355/2007, Anexa 1, pct. 7',
    costEstimat: 500
  },
  {
    id: 'expunere-radiatii',
    name: 'Examen medical pentru expunere la radiații ionizante',
    description: 'Examen medical pentru personal expus profesional la radiații ionizante',
    periodicitateLuni: 12,
    categoriiAngajati: [
      'Personal medical radiologie',
      'Tehnicieni în radiologie',
      'Personal centrale nucleare',
      'Personal gammagrafie industrială',
      'Cercetători în fizica nucleară'
    ],
    analizeLaborator: [
      'Hemoleucogramă completă cu formulă leucocitară',
      'Numărare trombocite',
      'Reticulocite',
      'VSH',
      'Examen sumar de urină',
      'Cristalină (examen oftalmologic)',
      'Dozimetrie biologică (la nevoie)',
      'Aberații cromozomiale (la indicație)',
      'Transaminaze',
      'Glicemie'
    ],
    legalBasis: 'HG 355/2007, Anexa 1, pct. 8 + Ord. 1226/2012',
    costEstimat: 550
  },
  {
    id: 'lucru-inaltime',
    name: 'Examen medical pentru lucrul la înălțime',
    description: 'Examen medical pentru lucrători care prestează activități la înălțime peste 2 metri',
    periodicitateLuni: 12,
    categoriiAngajati: [
      'Lucrători în construcții',
      'Alpiniști utilitari',
      'Electricieni linii înaltă tensiune',
      'Montatori structuri metalice',
      'Personal întreținere clădiri'
    ],
    analizeLaborator: [
      'Hemoleucogramă',
      'Glicemie',
      'Examen sumar de urină',
      'EKG',
      'Tensiune arterială (ortostatism)',
      'Test echilibru vestibular',
      'Examen oftalmologic (acuitate, camp vizual)',
      'Examen neurologic',
      'Test Romberg',
      'Spirometrie',
      'Probe efort (la nevoie)'
    ],
    legalBasis: 'HG 355/2007, Anexa 2, pct. 1',
    costEstimat: 380
  },
  {
    id: 'conducere-auto',
    name: 'Examen medical pentru conducători auto profesionişti',
    description: 'Examen medical pentru șoferi profesioniști (transport persoane/mărfuri, utilaje)',
    periodicitateLuni: 12,
    categoriiAngajati: [
      'Șoferi transport persoane',
      'Șoferi transport marfă',
      'Șoferi utilaje grele',
      'Conducători auto servicii',
      'Operatori macarale mobile'
    ],
    analizeLaborator: [
      'Hemoleucogramă',
      'Glicemie',
      'Colesterol',
      'Trigliceride',
      'Creatinină',
      'Transaminaze',
      'Examen sumar de urină',
      'EKG',
      'Tensiune arterială',
      'Examen oftalmologic complet',
      'Test vedere nocturnă',
      'Test vedere culori',
      'Camp vizual',
      'Examen ORL',
      'Audiogramă'
    ],
    legalBasis: 'HG 355/2007, Anexa 2, pct. 2 + Ord. 973/2011',
    costEstimat: 400
  },
  {
    id: 'spatii-confinate',
    name: 'Examen medical pentru lucru în spații confinate',
    description: 'Examen medical pentru lucrători în spații confinate, subterane sau cu atmosferă modificată',
    periodicitateLuni: 12,
    categoriiAngajati: [
      'Lucrători în mine',
      'Lucrători în tuneluri',
      'Lucrători în rezervoare',
      'Lucrători în canale subterane',
      'Personal întreținere spații confinate'
    ],
    analizeLaborator: [
      'Hemoleucogramă completă',
      'Spirometrie complexă',
      'Radiografie toracică',
      'EKG',
      'Probe efort cardiac',
      'Gazometrie (la nevoie)',
      'Examen neurologic',
      'Test funcții respiratorii',
      'Glicemie',
      'Examen sumar de urină',
      'Examen psihologic (claustrofobie)'
    ],
    legalBasis: 'HG 355/2007, Anexa 2, pct. 3',
    costEstimat: 480
  },
  {
    id: 'temperaturi-extreme',
    name: 'Examen medical pentru expunere la temperaturi extreme',
    description: 'Examen medical pentru lucrători expuși la temperaturi foarte ridicate sau foarte scăzute',
    periodicitateLuni: 12,
    categoriiAngajati: [
      'Lucrători în topitorii/furnale',
      'Lucrători în camere frigorifice',
      'Pompieri',
      'Sudori în spații fierbinți',
      'Personal depozite frigorifice'
    ],
    analizeLaborator: [
      'Hemoleucogramă',
      'Glicemie',
      'Ionogramă',
      'Creatinină',
      'Examen sumar de urină',
      'EKG',
      'Tensiune arterială',
      'Spirometrie',
      'Examen vascular periferic',
      'Test toleranță efort',
      'Transaminaze',
      'Examen dermatologic'
    ],
    legalBasis: 'HG 355/2007, Anexa 2, pct. 4',
    costEstimat: 360
  },
  {
    id: 'agenti-biologici',
    name: 'Examen medical pentru expunere la agenți biologici',
    description: 'Examen medical pentru lucrători expuși la agenți biologici (bacterii, viruși, fungi)',
    periodicitateLuni: 12,
    categoriiAngajati: [
      'Personal medical',
      'Personal laborator analize',
      'Lucrători în industria alimentară',
      'Lucrători în fermă',
      'Personal salubritate',
      'Personal stații epurare'
    ],
    analizeLaborator: [
      'Hemoleucogramă completă',
      'VSH',
      'Transaminaze',
      'Serologii specifice (Hepatită B, C, HIV - la indicație)',
      'Examen sumar de urină',
      'Examen bacteriologic (la nevoie)',
      'Test imunitate specifică (anticorpi)',
      'Radiografie toracică (la indicație)',
      'Markeri inflamatori (CRP, PCT)',
      'Spirometrie'
    ],
    legalBasis: 'HG 355/2007, Anexa 1, pct. 9',
    costEstimat: 420
  },
  {
    id: 'lucru-ecrane',
    name: 'Examen medical pentru lucrul prelungit la calculator',
    description: 'Examen medical pentru lucrători care lucrează preponderent la ecrane de vizualizare (peste 4h/zi)',
    periodicitateLuni: 24,
    categoriiAngajati: [
      'Programatori',
      'Personal birou IT',
      'Operatori introducere date',
      'Personal call-center',
      'Contabili',
      'Analiști'
    ],
    analizeLaborator: [
      'Examen oftalmologic complet',
      'Acuitate vizuală',
      'Test vedere culori',
      'Test vedere stereoscopică',
      'Funduscopie',
      'Tonometrie (tensiune intraoculară)',
      'Test vedere aproape/departe',
      'Examen ergoftalmologic',
      'Examen ortopedic (coloană, membrele superioare)',
      'Hemoleucogramă',
      'Glicemie'
    ],
    legalBasis: 'HG 355/2007, Anexa 2, pct. 5 + HG 1028/2006',
    costEstimat: 320
  },
  {
    id: 'efort-fizic',
    name: 'Examen medical pentru efort fizic intens',
    description: 'Examen medical pentru lucrători care depun efort fizic intens sau port de sarcini grele',
    periodicitateLuni: 12,
    categoriiAngajati: [
      'Lucrători în depozite',
      'Muncitori necalificați',
      'Lucrători în construcții',
      'Personal manipulare mărfuri',
      'Dockers'
    ],
    analizeLaborator: [
      'Hemoleucogramă',
      'Glicemie',
      'Acid uric',
      'Creatinină',
      'Transaminaze',
      'Examen sumar de urină',
      'EKG',
      'EKG sub efort (la nevoie)',
      'Tensiune arterială',
      'Spirometrie',
      'Examen ortopedic (coloană, articulații)',
      'Radiografie coloană (la indicație)'
    ],
    legalBasis: 'HG 355/2007, Anexa 2, pct. 6',
    costEstimat: 380
  },
  {
    id: 'program-noapte',
    name: 'Examen medical pentru munca în ture de noapte',
    description: 'Examen medical pentru lucrători în program de noapte (22:00 - 06:00) sau ture rotative',
    periodicitateLuni: 12,
    categoriiAngajati: [
      'Lucrători în industrie (ture)',
      'Personal medical (gardă)',
      'Agenți de pază',
      'Personal HoReCa',
      'Lucrători în servicii non-stop'
    ],
    analizeLaborator: [
      'Hemoleucogramă',
      'Glicemie',
      'Colesterol total și HDL/LDL',
      'Trigliceride',
      'Transaminaze',
      'Creatinină',
      'Examen sumar de urină',
      'EKG',
      'Tensiune arterială',
      'Spirometrie',
      'Evaluare somn (chestionar)',
      'Examen psihologic (la nevoie)'
    ],
    legalBasis: 'HG 355/2007, Anexa 2, pct. 7 + Legea 346/2002',
    costEstimat: 350
  }
];

/**
 * Helper: Găsește examen medical după ID
 */
export function getExamenById(id: string): ExamenMedical | undefined {
  return EXAMENE_MEDICALE.find(examen => examen.id === id);
}

/**
 * Helper: Filtrează examene medicale după categorie angajați
 */
export function getExameneByCategorieAngajati(categorie: string): ExamenMedical[] {
  return EXAMENE_MEDICALE.filter(examen =>
    examen.categoriiAngajati.some(cat =>
      cat.toLowerCase().includes(categorie.toLowerCase())
    )
  );
}

/**
 * Helper: Examene cu periodicitate specifică (în luni)
 */
export function getExameneByPeriodicitate(luni: number | null): ExamenMedical[] {
  return EXAMENE_MEDICALE.filter(examen => examen.periodicitateLuni === luni);
}

/**
 * Helper: Examene obligatorii pentru toți angajații
 */
export function getExameneObligatoriiToti(): ExamenMedical[] {
  return EXAMENE_MEDICALE.filter(examen =>
    examen.categoriiAngajati.includes('Toți angajații')
  );
}

/**
 * Helper: Cost total pentru un set de examene
 */
export function calculeazaCostTotal(exameneIds: string[]): number {
  return exameneIds.reduce((total, id) => {
    const examen = getExamenById(id);
    return total + (examen?.costEstimat || 0);
  }, 0);
}
