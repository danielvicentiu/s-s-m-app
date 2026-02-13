/**
 * Contravenții SSM/PSI România
 *
 * Baza legală:
 * - Legea 319/2006 (SSM)
 * - OUG 96/2003 (PSI)
 * - Legea 53/2003 (Codul Muncii)
 * - Legea 95/2006 (Medicina Muncii)
 *
 * Amendele sunt actualizate conform legislației 2024-2025
 */

export interface Penalty {
  id: string;
  article: string;
  law: string;
  description: string;
  minFine: number;
  maxFine: number;
  currency: string;
  authority: 'ITM' | 'ISU' | 'DSP' | 'ANSVSA';
  severity: 'minor' | 'moderate' | 'severe' | 'critical';
  inspectionFrequency: 'rare' | 'occasional' | 'frequent' | 'very_frequent';
  category: 'SSM' | 'PSI' | 'Medicina_Muncii' | 'Sanatate_Publica';
  notes?: string;
}

const penalties: Penalty[] = [
  // Legea 319/2006 - SSM
  {
    id: 'ro-ssm-001',
    article: 'Art. 35, alin. (1), lit. a',
    law: 'Legea 319/2006',
    description: 'Neînființarea serviciului de protecție și prevenire sau nedesemnarea lucrătorilor pentru SSM',
    minFine: 10000,
    maxFine: 20000,
    currency: 'RON',
    authority: 'ITM',
    severity: 'critical',
    inspectionFrequency: 'very_frequent',
    category: 'SSM',
    notes: 'Obligație fundamentală pentru angajator'
  },
  {
    id: 'ro-ssm-002',
    article: 'Art. 35, alin. (1), lit. b',
    law: 'Legea 319/2006',
    description: 'Lipsa evaluării riscurilor pentru sănătatea și securitatea în muncă',
    minFine: 10000,
    maxFine: 20000,
    currency: 'RON',
    authority: 'ITM',
    severity: 'critical',
    inspectionFrequency: 'very_frequent',
    category: 'SSM',
    notes: 'Document obligatoriu pentru orice activitate'
  },
  {
    id: 'ro-ssm-003',
    article: 'Art. 35, alin. (1), lit. c',
    law: 'Legea 319/2006',
    description: 'Neîntocmirea și neactualizarea planului de prevenire și protecție',
    minFine: 5000,
    maxFine: 10000,
    currency: 'RON',
    authority: 'ITM',
    severity: 'severe',
    inspectionFrequency: 'very_frequent',
    category: 'SSM',
    notes: 'Se actualizează anual sau la modificări semnificative'
  },
  {
    id: 'ro-ssm-004',
    article: 'Art. 35, alin. (1), lit. d',
    law: 'Legea 319/2006',
    description: 'Neînființarea comitetului de securitate și sănătate în muncă (>50 angajați)',
    minFine: 5000,
    maxFine: 10000,
    currency: 'RON',
    authority: 'ITM',
    severity: 'severe',
    inspectionFrequency: 'frequent',
    category: 'SSM',
    notes: 'Obligatoriu pentru companii cu peste 50 salariați'
  },
  {
    id: 'ro-ssm-005',
    article: 'Art. 35, alin. (2), lit. a',
    law: 'Legea 319/2006',
    description: 'Nepunerea la dispoziție a echipamentului individual de protecție (EIP)',
    minFine: 1500,
    maxFine: 3000,
    currency: 'RON',
    authority: 'ITM',
    severity: 'severe',
    inspectionFrequency: 'very_frequent',
    category: 'SSM',
    notes: 'Verificat în orice inspecție ITM'
  },
  {
    id: 'ro-ssm-006',
    article: 'Art. 35, alin. (2), lit. b',
    law: 'Legea 319/2006',
    description: 'Neîntocmirea sau neactualizarea instrucțiunilor proprii de SSM',
    minFine: 1500,
    maxFine: 3000,
    currency: 'RON',
    authority: 'ITM',
    severity: 'moderate',
    inspectionFrequency: 'very_frequent',
    category: 'SSM',
    notes: 'Specifice fiecărui loc de muncă'
  },
  {
    id: 'ro-ssm-007',
    article: 'Art. 35, alin. (2), lit. c',
    law: 'Legea 319/2006',
    description: 'Neefectuarea instructajului de SSM la angajare sau periodic',
    minFine: 1500,
    maxFine: 3000,
    currency: 'RON',
    authority: 'ITM',
    severity: 'severe',
    inspectionFrequency: 'very_frequent',
    category: 'SSM',
    notes: 'Instructaj general (8-12h) și la locul de muncă obligatorii'
  },
  {
    id: 'ro-ssm-008',
    article: 'Art. 35, alin. (2), lit. d',
    law: 'Legea 319/2006',
    description: 'Neînregistrarea și neraportarea accidentelor de muncă',
    minFine: 10000,
    maxFine: 20000,
    currency: 'RON',
    authority: 'ITM',
    severity: 'critical',
    inspectionFrequency: 'occasional',
    category: 'SSM',
    notes: 'Raportare în 24h pentru accidente grave'
  },
  {
    id: 'ro-ssm-009',
    article: 'Art. 35, alin. (2), lit. e',
    law: 'Legea 319/2006',
    description: 'Neținerea registrului de evidență a accidentelor de muncă',
    minFine: 1500,
    maxFine: 3000,
    currency: 'RON',
    authority: 'ITM',
    severity: 'moderate',
    inspectionFrequency: 'frequent',
    category: 'SSM'
  },
  {
    id: 'ro-ssm-010',
    article: 'Art. 35, alin. (3), lit. a',
    law: 'Legea 319/2006',
    description: 'Utilizarea echipamentelor de muncă neconforme sau fără autorizații',
    minFine: 2500,
    maxFine: 5000,
    currency: 'RON',
    authority: 'ITM',
    severity: 'severe',
    inspectionFrequency: 'frequent',
    category: 'SSM',
    notes: 'Include verificări periodice ISCIR, lifturi, etc.'
  },

  // OUG 96/2003 - PSI
  {
    id: 'ro-psi-001',
    article: 'Art. 6, alin. (1)',
    law: 'OUG 96/2003',
    description: 'Neîntocmirea sau neactualizarea planului de evacuare în caz de incendiu',
    minFine: 4000,
    maxFine: 8000,
    currency: 'RON',
    authority: 'ISU',
    severity: 'critical',
    inspectionFrequency: 'very_frequent',
    category: 'PSI',
    notes: 'Afișat vizibil în toate spațiile'
  },
  {
    id: 'ro-psi-002',
    article: 'Art. 6, alin. (2)',
    law: 'OUG 96/2003',
    description: 'Lipsa autorizației de securitate la incendiu sau expirarea acesteia',
    minFine: 10000,
    maxFine: 15000,
    currency: 'RON',
    authority: 'ISU',
    severity: 'critical',
    inspectionFrequency: 'very_frequent',
    category: 'PSI',
    notes: 'Se reînnoiește periodic conform categoriei de risc'
  },
  {
    id: 'ro-psi-003',
    article: 'Art. 7, alin. (1)',
    law: 'OUG 96/2003',
    description: 'Nedesemnarea lucrătorilor responsabili cu apărarea împotriva incendiilor',
    minFine: 2000,
    maxFine: 4000,
    currency: 'RON',
    authority: 'ISU',
    severity: 'severe',
    inspectionFrequency: 'very_frequent',
    category: 'PSI',
    notes: 'Minim 1 lucrător la 50 salariați'
  },
  {
    id: 'ro-psi-004',
    article: 'Art. 8, alin. (1)',
    law: 'OUG 96/2003',
    description: 'Lipsa sau nefuncționarea sistemelor și instalațiilor de stingere a incendiilor',
    minFine: 5000,
    maxFine: 10000,
    currency: 'RON',
    authority: 'ISU',
    severity: 'critical',
    inspectionFrequency: 'very_frequent',
    category: 'PSI',
    notes: 'Include stingătoare, hidranți, sprinklere'
  },
  {
    id: 'ro-psi-005',
    article: 'Art. 9, alin. (1)',
    law: 'OUG 96/2003',
    description: 'Obstrucționarea căilor de evacuare sau a ieșirilor de urgență',
    minFine: 3000,
    maxFine: 6000,
    currency: 'RON',
    authority: 'ISU',
    severity: 'critical',
    inspectionFrequency: 'very_frequent',
    category: 'PSI',
    notes: 'Verificat în fiecare inspecție ISU'
  },
  {
    id: 'ro-psi-006',
    article: 'Art. 10, alin. (1)',
    law: 'OUG 96/2003',
    description: 'Neverificarea periodică a stingătoarelor sau lipsa etichete de verificare',
    minFine: 1500,
    maxFine: 3000,
    currency: 'RON',
    authority: 'ISU',
    severity: 'moderate',
    inspectionFrequency: 'very_frequent',
    category: 'PSI',
    notes: 'Verificare anuală obligatorie'
  },
  {
    id: 'ro-psi-007',
    article: 'Art. 11, alin. (1)',
    law: 'OUG 96/2003',
    description: 'Neefectuarea instructajului de apărare împotriva incendiilor',
    minFine: 2000,
    maxFine: 4000,
    currency: 'RON',
    authority: 'ISU',
    severity: 'severe',
    inspectionFrequency: 'frequent',
    category: 'PSI',
    notes: 'Instructaj de bază și periodic obligatorii'
  },
  {
    id: 'ro-psi-008',
    article: 'Art. 12, alin. (1)',
    law: 'OUG 96/2003',
    description: 'Lipsa semnalizării de securitate la incendiu (pictograme, indicatoare)',
    minFine: 1000,
    maxFine: 2000,
    currency: 'RON',
    authority: 'ISU',
    severity: 'moderate',
    inspectionFrequency: 'frequent',
    category: 'PSI',
    notes: 'Indicatoare fotoluminiscente obligatorii'
  },
  {
    id: 'ro-psi-009',
    article: 'Art. 13, alin. (1)',
    law: 'OUG 96/2003',
    description: 'Nefuncționarea sistemului de iluminat de siguranță/urgență',
    minFine: 2500,
    maxFine: 5000,
    currency: 'RON',
    authority: 'ISU',
    severity: 'severe',
    inspectionFrequency: 'frequent',
    category: 'PSI',
    notes: 'Testat lunar obligatoriu'
  },
  {
    id: 'ro-psi-010',
    article: 'Art. 14, alin. (1)',
    law: 'OUG 96/2003',
    description: 'Neorganizarea și neexecutarea exercițiilor de evacuare',
    minFine: 1500,
    maxFine: 3000,
    currency: 'RON',
    authority: 'ISU',
    severity: 'moderate',
    inspectionFrequency: 'occasional',
    category: 'PSI',
    notes: 'Minim 2 exerciții/an recomandate'
  },

  // Legea 95/2006 - Medicina Muncii
  {
    id: 'ro-med-001',
    article: 'Art. 26, lit. a',
    law: 'Legea 95/2006',
    description: 'Neorganizarea controlului medical la angajare',
    minFine: 5000,
    maxFine: 10000,
    currency: 'RON',
    authority: 'DSP',
    severity: 'critical',
    inspectionFrequency: 'frequent',
    category: 'Medicina_Muncii',
    notes: 'Obligatoriu înaintea încadrării'
  },
  {
    id: 'ro-med-002',
    article: 'Art. 26, lit. b',
    law: 'Legea 95/2006',
    description: 'Neefectuarea controlului medical periodic',
    minFine: 5000,
    maxFine: 10000,
    currency: 'RON',
    authority: 'DSP',
    severity: 'severe',
    inspectionFrequency: 'frequent',
    category: 'Medicina_Muncii',
    notes: 'Periodicitate conform risc (6 luni - 2 ani)'
  },
  {
    id: 'ro-med-003',
    article: 'Art. 26, lit. c',
    law: 'Legea 95/2006',
    description: 'Lipsa fișei de aptitudine medicală pentru angajați',
    minFine: 2500,
    maxFine: 5000,
    currency: 'RON',
    authority: 'DSP',
    severity: 'severe',
    inspectionFrequency: 'very_frequent',
    category: 'Medicina_Muncii',
    notes: 'Se păstrează la dosarul personal'
  },
  {
    id: 'ro-med-004',
    article: 'Art. 27, alin. (1)',
    law: 'Legea 95/2006',
    description: 'Neînființarea serviciului de medicina muncii sau neîncadrarea medicului de medicina muncii',
    minFine: 10000,
    maxFine: 20000,
    currency: 'RON',
    authority: 'DSP',
    severity: 'critical',
    inspectionFrequency: 'frequent',
    category: 'Medicina_Muncii',
    notes: 'Contract cu cabinet autorizat acceptabil'
  },
  {
    id: 'ro-med-005',
    article: 'Art. 28, alin. (1)',
    law: 'Legea 95/2006',
    description: 'Menținerea la locul de muncă a salariaților declarați inapți medical',
    minFine: 10000,
    maxFine: 20000,
    currency: 'RON',
    authority: 'DSP',
    severity: 'critical',
    inspectionFrequency: 'occasional',
    category: 'Medicina_Muncii',
    notes: 'Risc major pentru sănătatea lucrătorului'
  },

  // Legea 53/2003 - Codul Muncii (aspecte SSM)
  {
    id: 'ro-cm-001',
    article: 'Art. 260, alin. (1), lit. a',
    law: 'Legea 53/2003',
    description: 'Efectuarea muncii fără contract individual de muncă',
    minFine: 20000,
    maxFine: 40000,
    currency: 'RON',
    authority: 'ITM',
    severity: 'critical',
    inspectionFrequency: 'very_frequent',
    category: 'SSM',
    notes: 'Amendă per fiecare salariat depistat'
  },
  {
    id: 'ro-cm-002',
    article: 'Art. 260, alin. (1), lit. d',
    law: 'Legea 53/2003',
    description: 'Lipsa evidenței programului de lucru (pontaj)',
    minFine: 5000,
    maxFine: 10000,
    currency: 'RON',
    authority: 'ITM',
    severity: 'moderate',
    inspectionFrequency: 'frequent',
    category: 'SSM',
    notes: 'Foaie de pontaj sau sistem electronic'
  },
  {
    id: 'ro-cm-003',
    article: 'Art. 260, alin. (1), lit. e',
    law: 'Legea 53/2003',
    description: 'Neacordarea zilelor de repaus săptămânal sau concediilor de odihnă',
    minFine: 3000,
    maxFine: 6000,
    currency: 'RON',
    authority: 'ITM',
    severity: 'moderate',
    inspectionFrequency: 'frequent',
    category: 'SSM'
  },
  {
    id: 'ro-cm-004',
    article: 'Art. 260, alin. (1), lit. f',
    law: 'Legea 53/2003',
    description: 'Depășirea duratei maxime legale a timpului de muncă',
    minFine: 3000,
    maxFine: 6000,
    currency: 'RON',
    authority: 'ITM',
    severity: 'severe',
    inspectionFrequency: 'frequent',
    category: 'SSM',
    notes: 'Max 48h/săptămână în medie pe 3 luni'
  },
  {
    id: 'ro-cm-005',
    article: 'Art. 260, alin. (1), lit. g',
    law: 'Legea 53/2003',
    description: 'Neținerea registrului general de evidență a salariaților',
    minFine: 10000,
    maxFine: 20000,
    currency: 'RON',
    authority: 'ITM',
    severity: 'severe',
    inspectionFrequency: 'very_frequent',
    category: 'SSM',
    notes: 'Document esențial la orice control'
  }
];

/**
 * Obține lista completă de contravenții SSM/PSI pentru România
 */
export function getPenaltiesRO(): Penalty[] {
  return penalties;
}

/**
 * Obține contravenții filtrate după criterii
 */
export function filterPenalties(criteria: {
  authority?: Penalty['authority'];
  category?: Penalty['category'];
  severity?: Penalty['severity'];
  inspectionFrequency?: Penalty['inspectionFrequency'];
}): Penalty[] {
  return penalties.filter(penalty => {
    if (criteria.authority && penalty.authority !== criteria.authority) return false;
    if (criteria.category && penalty.category !== criteria.category) return false;
    if (criteria.severity && penalty.severity !== criteria.severity) return false;
    if (criteria.inspectionFrequency && penalty.inspectionFrequency !== criteria.inspectionFrequency) return false;
    return true;
  });
}

/**
 * Obține contravenția după ID
 */
export function getPenaltyById(id: string): Penalty | undefined {
  return penalties.find(p => p.id === id);
}

/**
 * Calculează amenda totală potențială pentru mai multe contravenții
 */
export function calculateTotalFines(penaltyIds: string[], useMaxFine: boolean = false): number {
  return penaltyIds.reduce((total, id) => {
    const penalty = getPenaltyById(id);
    if (!penalty) return total;
    return total + (useMaxFine ? penalty.maxFine : penalty.minFine);
  }, 0);
}

/**
 * Obține statistici despre contravenții
 */
export function getPenaltyStats() {
  const stats = {
    total: penalties.length,
    byAuthority: {} as Record<string, number>,
    byCategory: {} as Record<string, number>,
    bySeverity: {} as Record<string, number>,
    totalMinFines: 0,
    totalMaxFines: 0
  };

  penalties.forEach(penalty => {
    // By authority
    stats.byAuthority[penalty.authority] = (stats.byAuthority[penalty.authority] || 0) + 1;

    // By category
    stats.byCategory[penalty.category] = (stats.byCategory[penalty.category] || 0) + 1;

    // By severity
    stats.bySeverity[penalty.severity] = (stats.bySeverity[penalty.severity] || 0) + 1;

    // Total fines
    stats.totalMinFines += penalty.minFine;
    stats.totalMaxFines += penalty.maxFine;
  });

  return stats;
}

export default penalties;
