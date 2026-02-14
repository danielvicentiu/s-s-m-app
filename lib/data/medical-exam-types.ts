/**
 * Tipuri de examinări medicale pentru medicina muncii în România
 * Conform HG 355/2007 și HG 1169/2011
 */

export interface MedicalExamType {
  id: string;
  name: string;
  type: 'angajare' | 'periodic' | 'adaptare' | 'reluare';
  frequencyMonths: number | null; // null = nu e periodic
  applicableTo: string; // 'all' sau coduri CAEN specifice
  requiredTests: string[];
  legalBasis: string;
}

export const medicalExamTypes: MedicalExamType[] = [
  // EXAMINĂRI LA ANGAJARE
  {
    id: 'exam-angajare-general',
    name: 'Examen medical la angajare - general',
    type: 'angajare',
    frequencyMonths: null,
    applicableTo: 'all',
    requiredTests: [
      'Examen clinic general',
      'Tensiune arterială',
      'Acuitate vizuală',
      'Analize de laborator (hemoleucogramă)',
      'Radiografie pulmonară',
    ],
    legalBasis: 'HG 355/2007, Art. 8',
  },
  {
    id: 'exam-angajare-conditii-speciale',
    name: 'Examen medical la angajare - condiții speciale de muncă',
    type: 'angajare',
    frequencyMonths: null,
    applicableTo: 'sectoare cu risc (industrie chimică, construcții, miniere)',
    requiredTests: [
      'Examen clinic general',
      'Tensiune arterială',
      'Acuitate vizuală',
      'Audiogramă',
      'Spirometrie',
      'Analize de laborator (hemoleucogramă, VSH, glicemie)',
      'Radiografie pulmonară',
      'EKG',
    ],
    legalBasis: 'HG 355/2007, Art. 8, Anexa 2',
  },
  {
    id: 'exam-angajare-tineri',
    name: 'Examen medical la angajare - tineri sub 18 ani',
    type: 'angajare',
    frequencyMonths: null,
    applicableTo: 'all',
    requiredTests: [
      'Examen clinic general',
      'Evaluare dezvoltare fizică',
      'Tensiune arterială',
      'Acuitate vizuală',
      'Analize de laborator',
      'Radiografie pulmonară',
      'Aviz psihologic',
    ],
    legalBasis: 'HG 355/2007, Art. 9',
  },

  // EXAMINĂRI PERIODICE
  {
    id: 'exam-periodic-anual',
    name: 'Examen medical periodic - anual',
    type: 'periodic',
    frequencyMonths: 12,
    applicableTo: 'all',
    requiredTests: [
      'Examen clinic general',
      'Tensiune arterială',
      'Acuitate vizuală',
      'Analize de laborator (la recomandarea medicului)',
    ],
    legalBasis: 'HG 355/2007, Art. 10',
  },
  {
    id: 'exam-periodic-semestrial',
    name: 'Examen medical periodic - semestrial (condiții nocive)',
    type: 'periodic',
    frequencyMonths: 6,
    applicableTo: 'lucrători expuși la factori nocivi (chimici, fizici, biologici)',
    requiredTests: [
      'Examen clinic general',
      'Tensiune arterială',
      'Acuitate vizuală',
      'Audiogramă',
      'Spirometrie',
      'Analize de laborator (hemoleucogramă, markeri specifici)',
      'Radiografie pulmonară (la indicație)',
    ],
    legalBasis: 'HG 355/2007, Art. 10, Anexa 3',
  },
  {
    id: 'exam-periodic-trimestrial',
    name: 'Examen medical periodic - trimestrial (tineri sub 18 ani)',
    type: 'periodic',
    frequencyMonths: 3,
    applicableTo: 'tineri sub 18 ani',
    requiredTests: [
      'Examen clinic general',
      'Evaluare dezvoltare fizică',
      'Tensiune arterială',
      'Acuitate vizuală',
    ],
    legalBasis: 'HG 355/2007, Art. 9',
  },
  {
    id: 'exam-periodic-inaltime',
    name: 'Examen medical periodic - lucrători la înălțime',
    type: 'periodic',
    frequencyMonths: 12,
    applicableTo: 'lucrători la înălțime > 2m',
    requiredTests: [
      'Examen clinic general',
      'Tensiune arterială',
      'Examen vestibular',
      'Acuitate vizuală',
      'EKG',
      'Glicemie',
    ],
    legalBasis: 'HG 355/2007, HG 1169/2011',
  },

  // EXAMINĂRI LA ADAPTARE/SCHIMBARE
  {
    id: 'exam-adaptare-post',
    name: 'Examen medical la schimbarea locului de muncă',
    type: 'adaptare',
    frequencyMonths: null,
    applicableTo: 'all',
    requiredTests: [
      'Examen clinic general',
      'Tensiune arterială',
      'Acuitate vizuală',
      'Teste specifice noului post',
    ],
    legalBasis: 'HG 355/2007, Art. 11',
  },
  {
    id: 'exam-adaptare-solicitare',
    name: 'Examen medical la cererea salariatului',
    type: 'adaptare',
    frequencyMonths: null,
    applicableTo: 'all',
    requiredTests: [
      'Examen clinic general',
      'Investigații conform simptomatologiei',
    ],
    legalBasis: 'HG 355/2007, Art. 12',
  },
  {
    id: 'exam-adaptare-maternitate',
    name: 'Examen medical - adaptare post pentru gravide/lăuze',
    type: 'adaptare',
    frequencyMonths: null,
    applicableTo: 'all',
    requiredTests: [
      'Examen clinic general',
      'Tensiune arterială',
      'Evaluare condiții muncă vs. sarcină/alăptare',
    ],
    legalBasis: 'HG 355/2007, Art. 13',
  },

  // EXAMINĂRI LA RELUARE
  {
    id: 'exam-reluare-medical',
    name: 'Examen medical la reluarea activității după concediu medical',
    type: 'reluare',
    frequencyMonths: null,
    applicableTo: 'all',
    requiredTests: [
      'Examen clinic general',
      'Tensiune arterială',
      'Evaluare recuperare capacitate de muncă',
      'Bilet de ieșire din spital (dacă e cazul)',
    ],
    legalBasis: 'HG 355/2007, Art. 14',
  },
  {
    id: 'exam-reluare-accident',
    name: 'Examen medical după accident de muncă',
    type: 'reluare',
    frequencyMonths: null,
    applicableTo: 'all',
    requiredTests: [
      'Examen clinic general',
      'Tensiune arterială',
      'Evaluare zone afectate',
      'Investigații specifice traumatismului',
      'Aviz capacitate de muncă',
    ],
    legalBasis: 'HG 355/2007, Art. 15, Legea 319/2006',
  },
  {
    id: 'exam-reluare-boala-profesionala',
    name: 'Examen medical după boală profesională',
    type: 'reluare',
    frequencyMonths: null,
    applicableTo: 'all',
    requiredTests: [
      'Examen clinic general',
      'Tensiune arterială',
      'Investigații specifice bolii profesionale',
      'Aviz de la medicul specialist',
      'Recomandări adaptare post',
    ],
    legalBasis: 'HG 355/2007, Art. 16, HG 1425/2006',
  },
  {
    id: 'exam-reluare-lipsa-prelungita',
    name: 'Examen medical la reluarea după absență > 90 zile',
    type: 'reluare',
    frequencyMonths: null,
    applicableTo: 'all',
    requiredTests: [
      'Examen clinic general',
      'Tensiune arterială',
      'Acuitate vizuală',
      'Analize de laborator (hemoleucogramă)',
      'Evaluare capacitate de muncă',
    ],
    legalBasis: 'HG 355/2007, Art. 14',
  },
  {
    id: 'exam-reluare-pensie-invaliditate',
    name: 'Examen medical la reluarea după pensie de invaliditate',
    type: 'reluare',
    frequencyMonths: null,
    applicableTo: 'all',
    requiredTests: [
      'Examen clinic general complet',
      'Tensiune arterială',
      'Acuitate vizuală',
      'Analize de laborator',
      'EKG',
      'Aviz comisie medicală CNPP',
      'Evaluare aptitudine post specific',
    ],
    legalBasis: 'HG 355/2007, Legea 263/2010',
  },
];

/**
 * Helper pentru filtrare după tip examen
 */
export const getExamsByType = (type: MedicalExamType['type']): MedicalExamType[] => {
  return medicalExamTypes.filter((exam) => exam.type === type);
};

/**
 * Helper pentru examinări periodice (cu frecvență definită)
 */
export const getPeriodicExams = (): MedicalExamType[] => {
  return medicalExamTypes.filter((exam) => exam.frequencyMonths !== null);
};

/**
 * Helper pentru găsire examen după ID
 */
export const getExamById = (id: string): MedicalExamType | undefined => {
  return medicalExamTypes.find((exam) => exam.id === id);
};
