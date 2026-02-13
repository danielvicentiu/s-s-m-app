/**
 * Cursuri SSM Obligatorii în România
 *
 * Baza de date cu cursurile de Securitate și Sănătate în Muncă obligatorii
 * conform legislației românești (Legea 319/2006, HG 1425/2006, etc.)
 */

export interface CursSsmObligatoriu {
  id: string;
  name: string;
  duration_hours: number;
  targetAudience: string;
  legalBasis: string;
  provider: 'extern' | 'intern';
  certificateValidityYears: number;
  syllabusTopics: string[];
  examType: 'teoretic' | 'teoretic-practic' | 'practic';
  description?: string;
}

export const CURSURI_SSM_OBLIGATORII: CursSsmObligatoriu[] = [
  {
    id: 'lucratori-desemnati-ssm',
    name: 'Curs pentru Lucrători Desemnați SSM',
    duration_hours: 80,
    targetAudience: 'Lucrători desemnați pentru activități de prevenire și protecție',
    legalBasis: 'Legea 319/2006, HG 1425/2006, Ordinul 355/2007',
    provider: 'extern',
    certificateValidityYears: 5,
    syllabusTopics: [
      'Legislație SSM națională și europeană',
      'Evaluarea riscurilor profesionale',
      'Organizarea activității de prevenire și protecție',
      'Accidente de muncă și boli profesionale',
      'Echipamente de protecție individuală',
      'Măsuri de prevenire și combatere a incendiilor',
      'Ergonomie și igienă ocupațională',
      'Primul ajutor la locul de muncă',
    ],
    examType: 'teoretic-practic',
    description: 'Curs obligatoriu pentru lucrătorii desemnați să se ocupe de activitățile de prevenire și protecție în cadrul organizației',
  },
  {
    id: 'membru-cssm',
    name: 'Curs pentru Membrii Comitetului de Securitate și Sănătate în Muncă (CSSM)',
    duration_hours: 40,
    targetAudience: 'Membri ai CSSM (angajatori și angajați)',
    legalBasis: 'Legea 319/2006, HG 1425/2006',
    provider: 'extern',
    certificateValidityYears: 5,
    syllabusTopics: [
      'Legislația SSM aplicabilă',
      'Rolul și atribuțiile CSSM',
      'Organizarea și funcționarea CSSM',
      'Identificarea și evaluarea riscurilor',
      'Analiza accidentelor de muncă',
      'Elaborarea programului anual de prevenire și protecție',
      'Consultare și participare la decizii SSM',
      'Monitorizarea aplicării măsurilor de prevenire',
    ],
    examType: 'teoretic',
    description: 'Curs pentru membrii Comitetului de Securitate și Sănătate în Muncă',
  },
  {
    id: 'prim-ajutor',
    name: 'Curs de Prim Ajutor la Locul de Muncă',
    duration_hours: 16,
    targetAudience: 'Toți angajații, obligatoriu pentru anumite posturi',
    legalBasis: 'Legea 319/2006, HG 1425/2006, Ordinul 461/2010',
    provider: 'intern',
    certificateValidityYears: 2,
    syllabusTopics: [
      'Evaluarea situației de urgență',
      'Protecția victimei și a salvatorului',
      'Alertarea serviciilor de urgență',
      'Resuscitarea cardio-pulmonară (RCP)',
      'Primul ajutor în caz de hemoragii',
      'Primul ajutor în caz de arsuri și electrocutare',
      'Imobilizarea fracturilor',
      'Starea de șoc și pierderea cunoștinței',
    ],
    examType: 'teoretic-practic',
    description: 'Curs de prim ajutor calificat pentru intervenție în situații de urgență medicală',
  },
  {
    id: 'lucru-inaltime',
    name: 'Curs Protecția Muncii pentru Lucrări la Înălțime',
    duration_hours: 24,
    targetAudience: 'Lucrători care efectuează lucrări la înălțime (>2m)',
    legalBasis: 'HG 1091/2006, Normativ C 190/2007',
    provider: 'extern',
    certificateValidityYears: 3,
    syllabusTopics: [
      'Legislație specifică lucrărilor la înălțime',
      'Riscuri specifice lucrului la înălțime',
      'Echipamente de protecție împotriva căderilor',
      'Sisteme de ancorare și linii de viață',
      'Schelării și platforme de lucru',
      'Verificarea și întreținerea echipamentelor',
      'Proceduri de salvare și evacuare',
      'Exerciții practice de utilizare EPI',
    ],
    examType: 'teoretic-practic',
    description: 'Curs pentru autorizarea lucrătorilor care desfășoară activități la înălțime',
  },
  {
    id: 'stivuitorist',
    name: 'Curs de Stivuitorist - Operator Utilaje de Ridicat',
    duration_hours: 40,
    targetAudience: 'Operatori de stivuitoare și utilaje de ridicat',
    legalBasis: 'Ordinul 537/2012, Ordinul 244/2011',
    provider: 'extern',
    certificateValidityYears: 5,
    syllabusTopics: [
      'Legislație și reglementări pentru stivuitoare',
      'Tipuri de stivuitoare și caracteristici tehnice',
      'Stabilitate și capacitate de ridicare',
      'Manevra și conducerea stivuitorului',
      'Verificări zilnice și întreținere',
      'Manipularea diferitelor tipuri de sarcini',
      'Reguli de circulație în spații de lucru',
      'Practică: manevrare stivuitor',
    ],
    examType: 'teoretic-practic',
    description: 'Curs de autorizare pentru operatorii de stivuitoare și echipamente de ridicat',
  },
  {
    id: 'electrician-autorizat',
    name: 'Curs de Autorizare Electricieni',
    duration_hours: 80,
    targetAudience: 'Electricieni care lucrează la instalații electrice',
    legalBasis: 'Ordinul 130/2008 (ANRE), HG 1146/2006',
    provider: 'extern',
    certificateValidityYears: 5,
    syllabusTopics: [
      'Legislație în domeniul electric',
      'Prescripții de securitate electrică',
      'Instalații electrice de joasă și medie tensiune',
      'Riscuri electrice și măsuri de protecție',
      'Echipamente de protecție specifice',
      'Lucrări în tensiune și fără tensiune',
      'Primul ajutor în caz de electrocutare',
      'Examen practic pe instalații',
    ],
    examType: 'teoretic-practic',
    description: 'Autorizare ANRE pentru electricieni (grad de tensiune specificat)',
  },
  {
    id: 'sudor-autorizat',
    name: 'Curs de Autorizare Sudori',
    duration_hours: 120,
    targetAudience: 'Sudori care execută lucrări de sudură',
    legalBasis: 'SR EN ISO 9606, SR EN 1090',
    provider: 'extern',
    certificateValidityYears: 3,
    syllabusTopics: [
      'Tehnologia sudării (MMA, MIG/MAG, TIG)',
      'Siguranța la sudare',
      'Echipamente de protecție pentru sudori',
      'Verificarea echipamentelor de sudare',
      'Pregătirea suprafețelor și materialelor',
      'Execuție suduri pe diferite poziții',
      'Controlul calității sudurilor',
      'Probe practice de sudare',
    ],
    examType: 'teoretic-practic',
    description: 'Autorizare sudori conform standardelor europene EN',
  },
  {
    id: 'spatii-confinate',
    name: 'Curs Protecția Muncii în Spații Confinate',
    duration_hours: 16,
    targetAudience: 'Lucrători care intră în spații confinate',
    legalBasis: 'HG 1091/2006, Legea 319/2006',
    provider: 'extern',
    certificateValidityYears: 3,
    syllabusTopics: [
      'Definirea și identificarea spațiilor confinate',
      'Riscuri specifice (asfixiere, intoxicare, explozii)',
      'Permise de lucru pentru spații confinate',
      'Măsurători atmosferă (oxigen, gaze toxice)',
      'Echipamente de protecție respiratorie',
      'Ventilarea spațiilor confinate',
      'Proceduri de intrare și ieșire',
      'Planuri de salvare și evacuare',
    ],
    examType: 'teoretic-practic',
    description: 'Curs obligatoriu pentru lucrări în rezervoare, silozuri, fose, canale, tuneluri',
  },
  {
    id: 'instructaj-ssm-general',
    name: 'Instructaj SSM General (Introductiv)',
    duration_hours: 8,
    targetAudience: 'Toți angajații la angajare',
    legalBasis: 'Legea 319/2006, HG 1425/2006',
    provider: 'intern',
    certificateValidityYears: 1,
    syllabusTopics: [
      'Politica de SSM a angajatorului',
      'Drepturile și obligațiile angajatului',
      'Riscurile generale din organizație',
      'Măsuri de prevenire și protecție generale',
      'Echipamente de protecție individuală',
      'Proceduri de urgență și evacuare',
      'Raportarea situațiilor periculoase',
      'Semnalizarea de securitate',
    ],
    examType: 'teoretic',
    description: 'Instructaj obligatoriu pentru toți angajații la încadrarea în muncă',
  },
  {
    id: 'instructaj-ssm-la-post',
    name: 'Instructaj SSM la Locul de Muncă (la Postul de Lucru)',
    duration_hours: 4,
    targetAudience: 'Toți angajații, specific postului ocupat',
    legalBasis: 'Legea 319/2006, HG 1425/2006',
    provider: 'intern',
    certificateValidityYears: 1,
    syllabusTopics: [
      'Riscurile specifice postului de lucru',
      'Proceduri de lucru în siguranță',
      'Utilaje și echipamente de lucru specifice',
      'EPI specifice postului',
      'Măsuri de prevenire specifice',
      'Conduita în situații de urgență la post',
      'Obligații specifice angajatului la postul respectiv',
    ],
    examType: 'teoretic-practic',
    description: 'Instructaj specific pentru fiecare post de lucru, realizat de șef direct',
  },
];

/**
 * Funcții helper pentru lucrul cu cursurile SSM
 */

export function getCursByIdHelper(id: string): CursSsmObligatoriu | undefined {
  return CURSURI_SSM_OBLIGATORII.find((curs) => curs.id === id);
}

export function getCursuriByProvider(provider: 'extern' | 'intern'): CursSsmObligatoriu[] {
  return CURSURI_SSM_OBLIGATORII.filter((curs) => curs.provider === provider);
}

export function getCursuriByTargetAudience(audience: string): CursSsmObligatoriu[] {
  return CURSURI_SSM_OBLIGATORII.filter((curs) =>
    curs.targetAudience.toLowerCase().includes(audience.toLowerCase())
  );
}

export function getAllCursIds(): string[] {
  return CURSURI_SSM_OBLIGATORII.map((curs) => curs.id);
}
