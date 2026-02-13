/**
 * Baza de date contravenții SSM/PSI România
 * Surse: Legea 319/2006 (SSM), Legea 307/2006 (PSI), OUG 195/2002 (DSP)
 */

export interface RomaniaPenalty {
  id: string;
  article: string; // Articol de lege
  law: string; // Legea de referință
  offense: string; // Descrierea faptei
  minFine: number; // Amendă minimă (RON)
  maxFine: number; // Amendă maximă (RON)
  authority: 'ITM' | 'ISU' | 'DSP'; // Autoritatea de control
  severity: 'low' | 'medium' | 'high' | 'critical'; // Gravitate
  inspectionFrequency: 'rare' | 'occasional' | 'frequent' | 'very_frequent'; // Frecvența controalelor
  category: 'ssm' | 'psi' | 'medical'; // Categoria
  additionalSanctions?: string; // Sancțiuni suplimentare (suspendare activitate etc.)
}

export const romanianPenalties: RomaniaPenalty[] = [
  // CONTRAVENȚII SSM (Legea 319/2006)
  {
    id: 'ro-ssm-001',
    article: 'Art. 52 alin. (1) lit. a',
    law: 'Legea 319/2006',
    offense: 'Nerespectarea obligației de a organiza activitatea de securitate și sănătate în muncă',
    minFine: 10000,
    maxFine: 20000,
    authority: 'ITM',
    severity: 'critical',
    inspectionFrequency: 'very_frequent',
    category: 'ssm',
    additionalSanctions: 'Suspendarea activității până la remedierea deficiențelor'
  },
  {
    id: 'ro-ssm-002',
    article: 'Art. 52 alin. (1) lit. b',
    law: 'Legea 319/2006',
    offense: 'Neîntocmirea evaluării riscurilor pentru securitate și sănătate în muncă',
    minFine: 10000,
    maxFine: 20000,
    authority: 'ITM',
    severity: 'critical',
    inspectionFrequency: 'very_frequent',
    category: 'ssm'
  },
  {
    id: 'ro-ssm-003',
    article: 'Art. 52 alin. (1) lit. c',
    law: 'Legea 319/2006',
    offense: 'Neîntocmirea planului de prevenire și protecție',
    minFine: 6000,
    maxFine: 8000,
    authority: 'ITM',
    severity: 'high',
    inspectionFrequency: 'very_frequent',
    category: 'ssm'
  },
  {
    id: 'ro-ssm-004',
    article: 'Art. 52 alin. (1) lit. d',
    law: 'Legea 319/2006',
    offense: 'Nedesemnarea lucrătorilor care acordă primul ajutor, intervin în caz de incendiu și evacuare',
    minFine: 5000,
    maxFine: 10000,
    authority: 'ITM',
    severity: 'high',
    inspectionFrequency: 'frequent',
    category: 'ssm'
  },
  {
    id: 'ro-ssm-005',
    article: 'Art. 52 alin. (1) lit. e',
    law: 'Legea 319/2006',
    offense: 'Nedotarea lucrătorilor cu echipament individual de protecție',
    minFine: 5000,
    maxFine: 10000,
    authority: 'ITM',
    severity: 'high',
    inspectionFrequency: 'very_frequent',
    category: 'ssm'
  },
  {
    id: 'ro-ssm-006',
    article: 'Art. 52 alin. (1) lit. f',
    law: 'Legea 319/2006',
    offense: 'Neinformarea și instruirea lucrătorilor cu privire la riscurile la care sunt expuși',
    minFine: 4000,
    maxFine: 6000,
    authority: 'ITM',
    severity: 'high',
    inspectionFrequency: 'very_frequent',
    category: 'ssm'
  },
  {
    id: 'ro-ssm-007',
    article: 'Art. 52 alin. (1) lit. g',
    law: 'Legea 319/2006',
    offense: 'Neorganizarea controlului medical periodic al lucrătorilor',
    minFine: 6000,
    maxFine: 8000,
    authority: 'ITM',
    severity: 'high',
    inspectionFrequency: 'frequent',
    category: 'ssm'
  },
  {
    id: 'ro-ssm-008',
    article: 'Art. 52 alin. (1) lit. h',
    law: 'Legea 319/2006',
    offense: 'Permiterea accesului la locurile de muncă a lucrătorilor care nu sunt apți din punct de vedere medical',
    minFine: 8000,
    maxFine: 12000,
    authority: 'ITM',
    severity: 'critical',
    inspectionFrequency: 'frequent',
    category: 'ssm',
    additionalSanctions: 'Oprirea lucrului pentru lucrătorii neapți'
  },
  {
    id: 'ro-ssm-009',
    article: 'Art. 52 alin. (1) lit. i',
    law: 'Legea 319/2006',
    offense: 'Neînregistrarea accidentelor de muncă în registrul de evidență',
    minFine: 3000,
    maxFine: 5000,
    authority: 'ITM',
    severity: 'medium',
    inspectionFrequency: 'occasional',
    category: 'ssm'
  },
  {
    id: 'ro-ssm-010',
    article: 'Art. 52 alin. (1) lit. j',
    law: 'Legea 319/2006',
    offense: 'Nepunerea la dispoziția lucrătorilor a instrucțiunilor proprii de securitate și sănătate în muncă',
    minFine: 2000,
    maxFine: 4000,
    authority: 'ITM',
    severity: 'medium',
    inspectionFrequency: 'frequent',
    category: 'ssm'
  },
  {
    id: 'ro-ssm-011',
    article: 'Art. 52 alin. (2) lit. a',
    law: 'Legea 319/2006',
    offense: 'Neasigurarea ventilației, iluminatului, temperaturii corespunzătoare la locul de muncă',
    minFine: 4000,
    maxFine: 8000,
    authority: 'ITM',
    severity: 'medium',
    inspectionFrequency: 'occasional',
    category: 'ssm'
  },
  {
    id: 'ro-ssm-012',
    article: 'Art. 52 alin. (2) lit. b',
    law: 'Legea 319/2006',
    offense: 'Neîntreținerea echipamentelor de lucru și de protecție',
    minFine: 3000,
    maxFine: 6000,
    authority: 'ITM',
    severity: 'medium',
    inspectionFrequency: 'frequent',
    category: 'ssm'
  },

  // CONTRAVENȚII PSI (Legea 307/2006)
  {
    id: 'ro-psi-001',
    article: 'Art. 5 alin. (1) lit. a',
    law: 'Legea 307/2006',
    offense: 'Neîntocmirea documentației tehnice de securitate la incendiu (autorizație PSI)',
    minFine: 10000,
    maxFine: 15000,
    authority: 'ISU',
    severity: 'critical',
    inspectionFrequency: 'very_frequent',
    category: 'psi',
    additionalSanctions: 'Suspendarea activității până la obținerea autorizației'
  },
  {
    id: 'ro-psi-002',
    article: 'Art. 5 alin. (1) lit. b',
    law: 'Legea 307/2006',
    offense: 'Neasigurarea și întreținerea mijloacelor tehnice de prevenire și stingere a incendiilor',
    minFine: 5000,
    maxFine: 10000,
    authority: 'ISU',
    severity: 'critical',
    inspectionFrequency: 'very_frequent',
    category: 'psi'
  },
  {
    id: 'ro-psi-003',
    article: 'Art. 5 alin. (1) lit. c',
    law: 'Legea 307/2006',
    offense: 'Neîntocmirea planului de intervenție la incendiu',
    minFine: 4000,
    maxFine: 8000,
    authority: 'ISU',
    severity: 'high',
    inspectionFrequency: 'frequent',
    category: 'psi'
  },
  {
    id: 'ro-psi-004',
    article: 'Art. 5 alin. (1) lit. d',
    law: 'Legea 307/2006',
    offense: 'Neorganizarea și neexecutarea instruirilor periodice de prevenire și stingere a incendiilor',
    minFine: 3000,
    maxFine: 6000,
    authority: 'ISU',
    severity: 'high',
    inspectionFrequency: 'very_frequent',
    category: 'psi'
  },
  {
    id: 'ro-psi-005',
    article: 'Art. 5 alin. (1) lit. e',
    law: 'Legea 307/2006',
    offense: 'Obstrucționarea căilor de evacuare și a accesului la mijloacele de stingere',
    minFine: 5000,
    maxFine: 10000,
    authority: 'ISU',
    severity: 'critical',
    inspectionFrequency: 'frequent',
    category: 'psi',
    additionalSanctions: 'Suspendarea imediată a activității'
  },
  {
    id: 'ro-psi-006',
    article: 'Art. 5 alin. (1) lit. f',
    law: 'Legea 307/2006',
    offense: 'Lipsă semnalizare de securitate la incendiu (ieșiri de urgență, panouri)',
    minFine: 2000,
    maxFine: 4000,
    authority: 'ISU',
    severity: 'medium',
    inspectionFrequency: 'frequent',
    category: 'psi'
  },
  {
    id: 'ro-psi-007',
    article: 'Art. 5 alin. (2) lit. a',
    law: 'Legea 307/2006',
    offense: 'Neefectuarea verificărilor și reviziilor la instalațiile electrice',
    minFine: 4000,
    maxFine: 8000,
    authority: 'ISU',
    severity: 'high',
    inspectionFrequency: 'occasional',
    category: 'psi'
  },
  {
    id: 'ro-psi-008',
    article: 'Art. 5 alin. (2) lit. b',
    law: 'Legea 307/2006',
    offense: 'Utilizarea instalațiilor termice fără verificare tehnică anuală',
    minFine: 3000,
    maxFine: 6000,
    authority: 'ISU',
    severity: 'high',
    inspectionFrequency: 'occasional',
    category: 'psi'
  },

  // CONTRAVENȚII MEDICINĂ MUNCĂ (OUG 195/2002)
  {
    id: 'ro-med-001',
    article: 'Art. 24 lit. a',
    law: 'OUG 195/2002',
    offense: 'Neorganizarea controlului medical la angajare pentru lucrători',
    minFine: 5000,
    maxFine: 10000,
    authority: 'DSP',
    severity: 'high',
    inspectionFrequency: 'frequent',
    category: 'medical'
  },
  {
    id: 'ro-med-002',
    article: 'Art. 24 lit. b',
    law: 'OUG 195/2002',
    offense: 'Neefectuarea controlului medical periodic al lucrătorilor',
    minFine: 6000,
    maxFine: 12000,
    authority: 'DSP',
    severity: 'high',
    inspectionFrequency: 'frequent',
    category: 'medical'
  },
  {
    id: 'ro-med-003',
    article: 'Art. 24 lit. c',
    law: 'OUG 195/2002',
    offense: 'Permiterea accesului la locul de muncă a lucrătorilor fără aviz medical',
    minFine: 8000,
    maxFine: 15000,
    authority: 'DSP',
    severity: 'critical',
    inspectionFrequency: 'frequent',
    category: 'medical',
    additionalSanctions: 'Retragerea imediată a lucrătorilor neapți'
  },
  {
    id: 'ro-med-004',
    article: 'Art. 24 lit. d',
    law: 'OUG 195/2002',
    offense: 'Neținerea la zi a fișelor de aptitudine medicală',
    minFine: 2000,
    maxFine: 4000,
    authority: 'DSP',
    severity: 'medium',
    inspectionFrequency: 'occasional',
    category: 'medical'
  },
  {
    id: 'ro-med-005',
    article: 'Art. 24 lit. e',
    law: 'OUG 195/2002',
    offense: 'Neasigurarea dotării cu trusa de prim ajutor la locul de muncă',
    minFine: 3000,
    maxFine: 6000,
    authority: 'DSP',
    severity: 'medium',
    inspectionFrequency: 'occasional',
    category: 'medical'
  },

  // CONTRAVENȚII MIXTE SSM/PSI
  {
    id: 'ro-mix-001',
    article: 'Art. 52 alin. (3)',
    law: 'Legea 319/2006',
    offense: 'Nerespectarea măsurilor dispuse de inspectorii de muncă la controalele anterioare',
    minFine: 8000,
    maxFine: 16000,
    authority: 'ITM',
    severity: 'critical',
    inspectionFrequency: 'very_frequent',
    category: 'ssm',
    additionalSanctions: 'Suspendarea activității până la conformare'
  },
  {
    id: 'ro-mix-002',
    article: 'Art. 5 alin. (3)',
    law: 'Legea 307/2006',
    offense: 'Nerespectarea măsurilor dispuse de inspectorii PSI la controalele anterioare',
    minFine: 10000,
    maxFine: 20000,
    authority: 'ISU',
    severity: 'critical',
    inspectionFrequency: 'very_frequent',
    category: 'psi',
    additionalSanctions: 'Suspendarea activității până la conformare + închidere temporară'
  },
  {
    id: 'ro-ssm-013',
    article: 'Art. 52 alin. (1) lit. m',
    law: 'Legea 319/2006',
    offense: 'Neînregistrarea și nepăstrarea documentelor SSM (registre, instrucțiuni)',
    minFine: 2000,
    maxFine: 4000,
    authority: 'ITM',
    severity: 'medium',
    inspectionFrequency: 'frequent',
    category: 'ssm'
  },
  {
    id: 'ro-psi-009',
    article: 'Art. 5 alin. (1) lit. h',
    law: 'Legea 307/2006',
    offense: 'Depozitarea substanțelor periculoase fără respectarea normelor PSI',
    minFine: 6000,
    maxFine: 12000,
    authority: 'ISU',
    severity: 'critical',
    inspectionFrequency: 'occasional',
    category: 'psi',
    additionalSanctions: 'Confiscarea substanțelor + suspendare activitate'
  }
];

/**
 * Obține lista de contravenții pentru România
 * @param filters - Filtre opționale (autoritate, categorie, gravitate)
 */
export function getPenaltiesRO(filters?: {
  authority?: 'ITM' | 'ISU' | 'DSP';
  category?: 'ssm' | 'psi' | 'medical';
  severity?: 'low' | 'medium' | 'high' | 'critical';
}): RomaniaPenalty[] {
  let filtered = [...romanianPenalties];

  if (filters?.authority) {
    filtered = filtered.filter(p => p.authority === filters.authority);
  }

  if (filters?.category) {
    filtered = filtered.filter(p => p.category === filters.category);
  }

  if (filters?.severity) {
    filtered = filtered.filter(p => p.severity === filters.severity);
  }

  return filtered;
}

/**
 * Obține o contravenție specifică după ID
 */
export function getPenaltyByIdRO(id: string): RomaniaPenalty | undefined {
  return romanianPenalties.find(p => p.id === id);
}

/**
 * Statistici generale despre contravenții
 */
export function getPenaltyStatsRO() {
  const totalPenalties = romanianPenalties.length;
  const byAuthority = {
    ITM: romanianPenalties.filter(p => p.authority === 'ITM').length,
    ISU: romanianPenalties.filter(p => p.authority === 'ISU').length,
    DSP: romanianPenalties.filter(p => p.authority === 'DSP').length
  };
  const byCategory = {
    ssm: romanianPenalties.filter(p => p.category === 'ssm').length,
    psi: romanianPenalties.filter(p => p.category === 'psi').length,
    medical: romanianPenalties.filter(p => p.category === 'medical').length
  };
  const bySeverity = {
    low: romanianPenalties.filter(p => p.severity === 'low').length,
    medium: romanianPenalties.filter(p => p.severity === 'medium').length,
    high: romanianPenalties.filter(p => p.severity === 'high').length,
    critical: romanianPenalties.filter(p => p.severity === 'critical').length
  };

  const avgMinFine = Math.round(
    romanianPenalties.reduce((sum, p) => sum + p.minFine, 0) / totalPenalties
  );
  const avgMaxFine = Math.round(
    romanianPenalties.reduce((sum, p) => sum + p.maxFine, 0) / totalPenalties
  );

  return {
    totalPenalties,
    byAuthority,
    byCategory,
    bySeverity,
    avgMinFine,
    avgMaxFine
  };
}
