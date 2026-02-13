/**
 * Accident Investigation Data - Procedura Cercetare Accident de Muncă
 * Conform Legii 319/2006 art. 27-32 - Metodologia de cercetare a accidentelor de muncă
 *
 * Tipuri:
 * - Accidente ușoare: cercetare de către angajator (în termen de 3 zile)
 * - Accidente grave/mortale/colective: cercetare de către ITM (în termen de 30 zile)
 */

export interface AccidentInvestigationStep {
  id: string;
  order: number;
  phase: 'immediate' | 'investigation' | 'reporting' | 'followup';
  title: string;
  description: string;
  responsible: string;
  deadline: string; // ore sau zile de la accident
  deadlineHours?: number; // pentru calcul exact
  requiredDocuments: string[];
  outputDocument?: string;
  legalReference: string;
  isMandatory: boolean;
  appliesTo: ('minor' | 'serious' | 'fatal' | 'collective')[];
  notificationRequired?: {
    authority: string;
    deadline: string;
    method: string;
  };
  notes?: string;
}

export const accidentInvestigationSteps: AccidentInvestigationStep[] = [
  // FAZA 1: MĂSURI IMEDIATE (0-24h)
  {
    id: 'step-01',
    order: 1,
    phase: 'immediate',
    title: 'Acordarea primului ajutor',
    description: 'Acordarea imediată a primului ajutor victimei și solicitarea ambulanței dacă este necesar',
    responsible: 'Lucratorul desemnat cu acordarea primului ajutor / Colegii de muncă',
    deadline: 'Imediat',
    deadlineHours: 0,
    requiredDocuments: [],
    legalReference: 'Legea 319/2006 art. 27 alin. (1)',
    isMandatory: true,
    appliesTo: ['minor', 'serious', 'fatal', 'collective'],
    notes: 'Prioritate absolută - salvarea vieții victimei'
  },
  {
    id: 'step-02',
    order: 2,
    phase: 'immediate',
    title: 'Securizarea locului accidentului',
    description: 'Oprirea activității periculoase și securizarea locului accidentului pentru a preveni alte accidente',
    responsible: 'Șef de șantier / Responsabil de locație',
    deadline: 'Imediat',
    deadlineHours: 0,
    requiredDocuments: [],
    legalReference: 'Legea 319/2006 art. 27 alin. (2)',
    isMandatory: true,
    appliesTo: ['minor', 'serious', 'fatal', 'collective'],
    notes: 'Păstrarea intacte a locului accidentului până la cercetare'
  },
  {
    id: 'step-03',
    order: 3,
    phase: 'immediate',
    title: 'Anunțare angajator',
    description: 'Informarea imediată a angajatorului despre producerea accidentului',
    responsible: 'Șef de șantier / Responsabil de locație',
    deadline: '1 oră de la accident',
    deadlineHours: 1,
    requiredDocuments: [],
    legalReference: 'Legea 319/2006 art. 28 alin. (1)',
    isMandatory: true,
    appliesTo: ['minor', 'serious', 'fatal', 'collective'],
    notes: 'Telefonic sau prin orice mijloc rapid de comunicare'
  },
  {
    id: 'step-04',
    order: 4,
    phase: 'immediate',
    title: 'Notificare ITM pentru accidente grave',
    description: 'Notificarea telefonică a Inspectoratului Teritorial de Muncă în caz de accident grav, mortal sau colectiv',
    responsible: 'Angajator / Reprezentant legal',
    deadline: 'Maximum 24 ore de la accident',
    deadlineHours: 24,
    requiredDocuments: [
      'Date preliminare despre accident',
      'Date de identificare victimă',
      'Circumstanțe preliminare'
    ],
    notificationRequired: {
      authority: 'ITM (Inspectoratul Teritorial de Muncă)',
      deadline: '24 ore',
      method: 'Telefonic urmată de confirmare scrisă'
    },
    legalReference: 'Legea 319/2006 art. 28 alin. (2)',
    isMandatory: true,
    appliesTo: ['serious', 'fatal', 'collective'],
    notes: 'OBLIGATORIU pentru accidente grave, mortale sau colective'
  },
  {
    id: 'step-05',
    order: 5,
    phase: 'immediate',
    title: 'Înregistrare în Registrul de evidență',
    description: 'Consemnarea accidentului în Registrul de evidență a accidentelor de muncă',
    responsible: 'Responsabil SSM / HR',
    deadline: '24 ore de la accident',
    deadlineHours: 24,
    requiredDocuments: ['Registrul de evidență a accidentelor de muncă'],
    outputDocument: 'Înregistrare în Registrul de evidență',
    legalReference: 'Legea 319/2006 art. 28 alin. (3)',
    isMandatory: true,
    appliesTo: ['minor', 'serious', 'fatal', 'collective']
  },

  // FAZA 2: INVESTIGAȚIE (1-3 zile pentru ușoare, 1-30 zile pentru grave)
  {
    id: 'step-06',
    order: 6,
    phase: 'investigation',
    title: 'Constituirea comisiei de cercetare',
    description: 'Constituirea comisiei de cercetare (angajator pentru accidente ușoare, ITM pentru accidente grave/mortale/colective)',
    responsible: 'Angajator (accidente ușoare) / ITM (accidente grave)',
    deadline: '1 zi lucrătoare pentru ușoare, imediat pentru grave',
    deadlineHours: 24,
    requiredDocuments: [
      'Decizie de constituire comisie',
      'Nominalizare membri comisie',
      'Competențe membri'
    ],
    outputDocument: 'Decizie de constituire a comisiei de cercetare',
    legalReference: 'Legea 319/2006 art. 29',
    isMandatory: true,
    appliesTo: ['minor', 'serious', 'fatal', 'collective'],
    notes: 'Comisia include: reprezentant angajator, specialist SSM, reprezentant sindicat/salariați'
  },
  {
    id: 'step-07',
    order: 7,
    phase: 'investigation',
    title: 'Anunțare sindicat/reprezentanți salariați',
    description: 'Informarea sindicatului sau a reprezentanților salariaților despre constituirea comisiei',
    responsible: 'Angajator',
    deadline: '24 ore de la constituirea comisiei',
    deadlineHours: 24,
    requiredDocuments: [],
    legalReference: 'Legea 319/2006 art. 29 alin. (2)',
    isMandatory: true,
    appliesTo: ['minor', 'serious', 'fatal', 'collective']
  },
  {
    id: 'step-08',
    order: 8,
    phase: 'investigation',
    title: 'Cercetarea la fața locului',
    description: 'Deplasarea comisiei la locul accidentului și examinarea situației',
    responsible: 'Comisia de cercetare',
    deadline: 'În cadrul termenului de cercetare',
    deadlineHours: 48,
    requiredDocuments: [
      'Schiță/plan al locului accidentului',
      'Fotografii',
      'Măsurători relevante'
    ],
    legalReference: 'Legea 319/2006 art. 30',
    isMandatory: true,
    appliesTo: ['minor', 'serious', 'fatal', 'collective'],
    notes: 'Se constată starea locului, se identifică factorii de risc, se face documentare foto'
  },
  {
    id: 'step-09',
    order: 9,
    phase: 'investigation',
    title: 'Audierea martorilor',
    description: 'Audierea victimei (dacă este posibil), martorilor și a altor persoane implicate',
    responsible: 'Comisia de cercetare',
    deadline: 'În cadrul termenului de cercetare',
    deadlineHours: 72,
    requiredDocuments: [
      'Declarații scrise martori',
      'Declarație victimă (dacă posibil)',
      'Declarații șefi ierarhici'
    ],
    legalReference: 'Legea 319/2006 art. 30 alin. (2)',
    isMandatory: true,
    appliesTo: ['minor', 'serious', 'fatal', 'collective']
  },
  {
    id: 'step-10',
    order: 10,
    phase: 'investigation',
    title: 'Colectare documente relevante',
    description: 'Colectarea tuturor documentelor relevante (CIM, fișă post, instructaje, autorizații echipamente, etc.)',
    responsible: 'Comisia de cercetare',
    deadline: 'În cadrul termenului de cercetare',
    deadlineHours: 72,
    requiredDocuments: [
      'Contractul individual de muncă',
      'Fișa postului',
      'Fișe de instructaj SSM',
      'Avize medicale',
      'Autorizații echipamente',
      'Evaluare de risc pentru postul respectiv',
      'Documente tehnice echipamente'
    ],
    legalReference: 'Legea 319/2006 art. 30',
    isMandatory: true,
    appliesTo: ['minor', 'serious', 'fatal', 'collective']
  },
  {
    id: 'step-11',
    order: 11,
    phase: 'investigation',
    title: 'Solicitare raport medical',
    description: 'Solicitarea raportului medical de la unitatea sanitară (pentru accidente grave/mortale)',
    responsible: 'Comisia de cercetare',
    deadline: 'În primele 3 zile de la accident',
    deadlineHours: 72,
    requiredDocuments: ['Cerere către unitatea sanitară'],
    legalReference: 'Legea 319/2006 art. 30',
    isMandatory: true,
    appliesTo: ['serious', 'fatal', 'collective'],
    notes: 'Raportul medical poate întârzia - se poate finaliza cercetarea și fără el inițial'
  },
  {
    id: 'step-12',
    order: 12,
    phase: 'investigation',
    title: 'Analiza cauzelor',
    description: 'Identificarea cauzelor care au condus la producerea accidentului (cauze imediate, cauze principale, cauze indirecte)',
    responsible: 'Comisia de cercetare',
    deadline: 'În cadrul termenului de cercetare',
    deadlineHours: 72,
    requiredDocuments: [
      'Analiză cauze imediate',
      'Analiză cauze principale',
      'Analiză cauze indirecte/sistemice'
    ],
    legalReference: 'Legea 319/2006 art. 30',
    isMandatory: true,
    appliesTo: ['minor', 'serious', 'fatal', 'collective'],
    notes: 'Metoda celor 5 DE CE sau diagrama Ishikawa (cauză-efect)'
  },
  {
    id: 'step-13',
    order: 13,
    phase: 'investigation',
    title: 'Stabilirea răspunderilor',
    description: 'Stabilirea persoanelor responsabile și a eventualelor abateri de la normele SSM',
    responsible: 'Comisia de cercetare',
    deadline: 'În cadrul termenului de cercetare',
    deadlineHours: 72,
    requiredDocuments: [
      'Analiză responsabilități',
      'Identificare abateri normative'
    ],
    legalReference: 'Legea 319/2006 art. 30',
    isMandatory: true,
    appliesTo: ['minor', 'serious', 'fatal', 'collective']
  },
  {
    id: 'step-14',
    order: 14,
    phase: 'investigation',
    title: 'Stabilirea măsurilor de prevenire',
    description: 'Propunerea măsurilor tehnice și organizatorice pentru prevenirea repetării accidentului',
    responsible: 'Comisia de cercetare',
    deadline: 'În cadrul termenului de cercetare',
    deadlineHours: 72,
    requiredDocuments: [
      'Plan de măsuri corective',
      'Plan de măsuri preventive',
      'Termene de implementare',
      'Responsabili implementare'
    ],
    legalReference: 'Legea 319/2006 art. 30',
    isMandatory: true,
    appliesTo: ['minor', 'serious', 'fatal', 'collective']
  },

  // FAZA 3: RAPORTARE (3-30 zile)
  {
    id: 'step-15',
    order: 15,
    phase: 'reporting',
    title: 'Întocmire Proces-verbal de cercetare',
    description: 'Întocmirea Procesului-verbal de cercetare a accidentului de muncă conform modelului legal',
    responsible: 'Comisia de cercetare',
    deadline: '3 zile pentru accidente ușoare, 30 zile pentru accidente grave',
    deadlineHours: 72, // pentru ușoare
    requiredDocuments: [
      'Toate documentele colectate',
      'Declarații martori',
      'Analize cauze',
      'Plan măsuri'
    ],
    outputDocument: 'Proces-verbal de cercetare a accidentului de muncă',
    legalReference: 'Legea 319/2006 art. 31',
    isMandatory: true,
    appliesTo: ['minor', 'serious', 'fatal', 'collective'],
    notes: 'Se utilizează formularul standard conform anexei la Legea 319/2006'
  },
  {
    id: 'step-16',
    order: 16,
    phase: 'reporting',
    title: 'Semnare Proces-verbal',
    description: 'Semnarea Procesului-verbal de către toți membrii comisiei și de către accidentat/reprezentant',
    responsible: 'Comisia de cercetare + Victimă/Reprezentant legal',
    deadline: '1 zi de la finalizarea PV',
    deadlineHours: 24,
    requiredDocuments: ['Proces-verbal de cercetare'],
    legalReference: 'Legea 319/2006 art. 31',
    isMandatory: true,
    appliesTo: ['minor', 'serious', 'fatal', 'collective'],
    notes: 'Accidentatul sau reprezentantul legal (în caz de deces) are dreptul de a semna și de a formula obiecțiuni'
  },
  {
    id: 'step-17',
    order: 17,
    phase: 'reporting',
    title: 'Trimitere PV către ITM',
    description: 'Trimiterea Procesului-verbal către Inspectoratul Teritorial de Muncă (pentru toate tipurile de accidente)',
    responsible: 'Angajator',
    deadline: '5 zile de la semnarea PV pentru accidente ușoare, 3 zile pentru accidente grave',
    deadlineHours: 120, // pentru ușoare
    requiredDocuments: [
      'Proces-verbal semnat',
      'Anexe la PV',
      'Adresă de înaintare'
    ],
    notificationRequired: {
      authority: 'ITM',
      deadline: '5 zile (ușoare) / 3 zile (grave)',
      method: 'Poștă cu confirmare de primire sau direct la registratură'
    },
    legalReference: 'Legea 319/2006 art. 31 alin. (3)',
    isMandatory: true,
    appliesTo: ['minor', 'serious', 'fatal', 'collective']
  },
  {
    id: 'step-18',
    order: 18,
    phase: 'reporting',
    title: 'Informare sindicat/reprezentanți',
    description: 'Transmiterea unei copii a PV către sindicat sau reprezentanții salariaților',
    responsible: 'Angajator',
    deadline: '5 zile de la semnarea PV',
    deadlineHours: 120,
    requiredDocuments: ['Copie PV cercetare'],
    legalReference: 'Legea 319/2006 art. 31 alin. (4)',
    isMandatory: true,
    appliesTo: ['minor', 'serious', 'fatal', 'collective']
  },

  // FAZA 4: URMĂRIRE ȘI IMPLEMENTARE
  {
    id: 'step-19',
    order: 19,
    phase: 'followup',
    title: 'Implementare măsuri de prevenire',
    description: 'Implementarea măsurilor tehnice și organizatorice stabilite în PV, conform planului și termenelor',
    responsible: 'Angajator / Responsabili desemnați',
    deadline: 'Conform termenelor din PV (de regulă 30-90 zile)',
    deadlineHours: 720, // 30 zile (orientativ)
    requiredDocuments: [
      'Plan de implementare',
      'Evidență implementare măsuri',
      'Documente justificative (facturi, PV recepție, etc.)'
    ],
    legalReference: 'Legea 319/2006 art. 32',
    isMandatory: true,
    appliesTo: ['minor', 'serious', 'fatal', 'collective'],
    notes: 'Măsurile sunt obligatorii și supuse verificării ITM'
  },
  {
    id: 'step-20',
    order: 20,
    phase: 'followup',
    title: 'Raportare către ITM - implementare măsuri',
    description: 'Raportarea către ITM a implementării măsurilor de prevenire stabilite în PV',
    responsible: 'Angajator',
    deadline: 'La finalizarea implementării sau la solicitarea ITM',
    requiredDocuments: [
      'Raport implementare măsuri',
      'Documente justificative',
      'PV recepție lucrări (dacă e cazul)'
    ],
    notificationRequired: {
      authority: 'ITM',
      deadline: 'La finalizare sau la solicitare',
      method: 'Adresă scrisă cu anexe'
    },
    legalReference: 'Legea 319/2006 art. 32',
    isMandatory: true,
    appliesTo: ['minor', 'serious', 'fatal', 'collective'],
    notes: 'ITM poate verifica implementarea efectivă a măsurilor'
  }
];

/**
 * Tipuri de accidente și criteriile de clasificare
 */
export const accidentTypes = {
  minor: {
    label: 'Accident ușor',
    description: 'Accident de muncă soldat cu incapacitate temporară de muncă sub 3 zile',
    investigatedBy: 'Comisie angajator',
    investigationDeadline: '3 zile lucrătoare',
    itmNotification: 'Nu este obligatorie notificarea în 24h, dar PV se trimite la ITM în 5 zile',
    legalRef: 'Legea 319/2006 art. 28-29'
  },
  serious: {
    label: 'Accident grav',
    description: 'Accident de muncă soldat cu incapacitate temporară de muncă peste 3 zile sau leziuni grave',
    investigatedBy: 'Comisie ITM',
    investigationDeadline: '30 zile',
    itmNotification: 'OBLIGATORIU în maximum 24 ore de la producere',
    legalRef: 'Legea 319/2006 art. 28 alin. (2)'
  },
  fatal: {
    label: 'Accident mortal',
    description: 'Accident de muncă soldat cu decesul victimei',
    investigatedBy: 'Comisie ITM (cu participare Poliție, Parchet)',
    investigationDeadline: '30 zile',
    itmNotification: 'OBLIGATORIU IMEDIAT (telefonic + scris în 24h)',
    legalRef: 'Legea 319/2006 art. 28 alin. (2)'
  },
  collective: {
    label: 'Accident colectiv',
    description: 'Accident de muncă care afectează cel puțin 3 persoane simultan',
    investigatedBy: 'Comisie ITM',
    investigationDeadline: '30 zile',
    itmNotification: 'OBLIGATORIU în maximum 24 ore de la producere',
    legalRef: 'Legea 319/2006 art. 28 alin. (2)'
  }
};

/**
 * Autorități care trebuie notificate
 */
export const notificationAuthorities = [
  {
    authority: 'ITM (Inspectoratul Teritorial de Muncă)',
    when: 'Toate accidentele (în termene diferite)',
    deadline: '24h pentru grave/mortale/colective, 5 zile PV pentru ușoare',
    method: 'Telefon + adresă scrisă'
  },
  {
    authority: 'Poliția',
    when: 'Accidente mortale',
    deadline: 'Imediat',
    method: 'Telefonic 112'
  },
  {
    authority: 'Parchetul',
    when: 'Accidente mortale (sesizare de către Poliție)',
    deadline: 'Conform procedurii penale',
    method: 'Prin Poliție'
  },
  {
    authority: 'Sindicat / Reprezentanți salariați',
    when: 'Toate accidentele',
    deadline: '24h de la constituirea comisiei + 5 zile copie PV',
    method: 'Adresă scrisă'
  }
];

/**
 * Documentele obligatorii în cercetarea accidentelor
 */
export const requiredDocuments = [
  {
    document: 'Proces-verbal de cercetare',
    description: 'Document central, conform model legal (anexa la Legea 319/2006)',
    responsible: 'Comisia de cercetare',
    mandatory: true
  },
  {
    document: 'Decizie constituire comisie',
    description: 'Decizie a angajatorului de constituire a comisiei de cercetare',
    responsible: 'Angajator',
    mandatory: true
  },
  {
    document: 'Declarații martori',
    description: 'Declarații scrise ale martorilor oculari și persoanelor implicate',
    responsible: 'Comisia de cercetare',
    mandatory: true
  },
  {
    document: 'Declarație victimă',
    description: 'Declarația victimei (dacă starea de sănătate permite)',
    responsible: 'Victima accidentului',
    mandatory: false
  },
  {
    document: 'Schiță loc accident',
    description: 'Plan/schiță a locului accidentului cu măsurători și indicații',
    responsible: 'Comisia de cercetare',
    mandatory: true
  },
  {
    document: 'Fotografii',
    description: 'Documentare foto a locului accidentului',
    responsible: 'Comisia de cercetare',
    mandatory: true
  },
  {
    document: 'Contract individual de muncă',
    description: 'CIM al victimei',
    responsible: 'HR / Angajator',
    mandatory: true
  },
  {
    document: 'Fișa postului',
    description: 'Fișa postului victimei',
    responsible: 'HR / Angajator',
    mandatory: true
  },
  {
    document: 'Fișe instructaj SSM',
    description: 'Fișe de instructaj SSM (inițial, periodic, la locul de muncă)',
    responsible: 'Responsabil SSM',
    mandatory: true
  },
  {
    document: 'Aviz medical',
    description: 'Aviz medical de încadrare în muncă',
    responsible: 'Medicina muncii',
    mandatory: true
  },
  {
    document: 'Evaluare de risc',
    description: 'Evaluarea riscurilor pentru postul respectiv',
    responsible: 'Responsabil SSM',
    mandatory: true
  },
  {
    document: 'Autorizații echipamente',
    description: 'Autorizații de funcționare pentru echipamentele implicate',
    responsible: 'Responsabil tehnic',
    mandatory: false
  },
  {
    document: 'Raport medical',
    description: 'Raport medical de la unitatea sanitară (pentru accidente grave/mortale)',
    responsible: 'Unitatea sanitară',
    mandatory: false
  }
];

/**
 * Helper function - filtrare pași pe tip accident
 */
export function getStepsForAccidentType(
  type: 'minor' | 'serious' | 'fatal' | 'collective'
): AccidentInvestigationStep[] {
  return accidentInvestigationSteps.filter(step =>
    step.appliesTo.includes(type)
  );
}

/**
 * Helper function - pași cu notificare autorități
 */
export function getNotificationSteps(): AccidentInvestigationStep[] {
  return accidentInvestigationSteps.filter(step =>
    step.notificationRequired !== undefined
  );
}

/**
 * Helper function - pași pe fază
 */
export function getStepsByPhase(
  phase: 'immediate' | 'investigation' | 'reporting' | 'followup'
): AccidentInvestigationStep[] {
  return accidentInvestigationSteps.filter(step => step.phase === phase);
}
