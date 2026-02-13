/**
 * PSI (Protecția și Siguranța la Incendiu) - Cerințe Obligatorii România
 *
 * Bază legală:
 * - Legea 307/2006 privind apărarea împotriva incendiilor
 * - OMAI 163/2007 pentru aprobarea Normelor generale de apărare împotriva incendiilor
 * - OMAI 132/2007 privind autorizarea persoanelor juridice
 */

export type PSICategory =
  | 'stingatoare'
  | 'hidranti'
  | 'detectie'
  | 'evacuare'
  | 'autorizatie'
  | 'instructaj'
  | 'verificare';

export type PSIFrequency =
  | 'lunar'
  | 'trimestrial'
  | 'semestrial'
  | 'anual'
  | 'bianual'
  | 'permanent'
  | 'unica';

export interface PSIRequirement {
  id: string;
  requirement: string;
  legalBasis: string;
  category: PSICategory;
  frequency: PSIFrequency;
  penalty: string;
  description?: string;
}

export const psiRequirements: PSIRequirement[] = [
  {
    id: 'PSI-001',
    requirement: 'Autorizație de securitate la incendiu',
    legalBasis: 'Legea 307/2006, art. 6',
    category: 'autorizatie',
    frequency: 'permanent',
    penalty: '10.000 - 20.000 RON',
    description: 'Autorizația PSI este obligatorie pentru funcționarea legală a construcției'
  },
  {
    id: 'PSI-002',
    requirement: 'Verificare stingătoare portabile',
    legalBasis: 'OMAI 163/2007, art. 214',
    category: 'stingatoare',
    frequency: 'anual',
    penalty: '5.000 - 10.000 RON',
    description: 'Verificarea tehnică și reîncărcarea stingătoarelor de către firme autorizate'
  },
  {
    id: 'PSI-003',
    requirement: 'Verificare hidranți interiori',
    legalBasis: 'OMAI 163/2007, art. 221',
    category: 'hidranti',
    frequency: 'semestrial',
    penalty: '5.000 - 10.000 RON',
    description: 'Verificarea funcționalității hidranților interiori și furtunelor'
  },
  {
    id: 'PSI-004',
    requirement: 'Verificare hidranți exteriori',
    legalBasis: 'OMAI 163/2007, art. 222',
    category: 'hidranti',
    frequency: 'semestrial',
    penalty: '5.000 - 10.000 RON',
    description: 'Verificarea presiunii și funcționalității hidranților exteriori'
  },
  {
    id: 'PSI-005',
    requirement: 'Verificare sistem detecție incendiu',
    legalBasis: 'OMAI 163/2007, art. 230',
    category: 'detectie',
    frequency: 'lunar',
    penalty: '10.000 - 15.000 RON',
    description: 'Verificarea funcțională a detectoarelor de fum și centralei de incendiu'
  },
  {
    id: 'PSI-006',
    requirement: 'Verificare sistem alarmă incendiu',
    legalBasis: 'OMAI 163/2007, art. 231',
    category: 'detectie',
    frequency: 'lunar',
    penalty: '5.000 - 10.000 RON',
    description: 'Testarea sistemului de alarmă și semnalizare incendiu'
  },
  {
    id: 'PSI-007',
    requirement: 'Verificare iluminat siguranță evacuare',
    legalBasis: 'OMAI 163/2007, art. 185',
    category: 'evacuare',
    frequency: 'lunar',
    penalty: '3.000 - 7.000 RON',
    description: 'Verificarea funcționalității corpurilor de iluminat de siguranță'
  },
  {
    id: 'PSI-008',
    requirement: 'Verificare indicatoare evacuare',
    legalBasis: 'OMAI 163/2007, art. 186',
    category: 'evacuare',
    frequency: 'trimestrial',
    penalty: '2.000 - 5.000 RON',
    description: 'Verificarea vizibilității și funcționalității indicatoarelor EXIT'
  },
  {
    id: 'PSI-009',
    requirement: 'Instructaj PSI angajați noi',
    legalBasis: 'Legea 307/2006, art. 10',
    category: 'instructaj',
    frequency: 'unica',
    penalty: '5.000 - 10.000 RON',
    description: 'Instructaj inițial PSI pentru toți angajații noi la angajare'
  },
  {
    id: 'PSI-010',
    requirement: 'Instructaj PSI periodic',
    legalBasis: 'OMAI 163/2007, art. 26',
    category: 'instructaj',
    frequency: 'semestrial',
    penalty: '5.000 - 10.000 RON',
    description: 'Instructaj periodic de actualizare cunoștințe PSI pentru angajați'
  },
  {
    id: 'PSI-011',
    requirement: 'Exercițiu de evacuare',
    legalBasis: 'OMAI 163/2007, art. 29',
    category: 'evacuare',
    frequency: 'anual',
    penalty: '5.000 - 10.000 RON',
    description: 'Simulare evacuare în caz de incendiu cu toți angajații'
  },
  {
    id: 'PSI-012',
    requirement: 'Plan de evacuare afișat',
    legalBasis: 'OMAI 163/2007, art. 187',
    category: 'evacuare',
    frequency: 'permanent',
    penalty: '2.000 - 5.000 RON',
    description: 'Planuri de evacuare afișate la fiecare nivel și zonă'
  },
  {
    id: 'PSI-013',
    requirement: 'Scenarii de securitate la incendiu (SSI)',
    legalBasis: 'OMAI 163/2007, art. 24',
    category: 'autorizatie',
    frequency: 'permanent',
    penalty: '10.000 - 20.000 RON',
    description: 'Documentație SSI actualizată și disponibilă la fața locului'
  },
  {
    id: 'PSI-014',
    requirement: 'Verificare căi de evacuare libere',
    legalBasis: 'OMAI 163/2007, art. 179',
    category: 'evacuare',
    frequency: 'permanent',
    penalty: '5.000 - 15.000 RON',
    description: 'Căile de evacuare trebuie menținute permanent libere și funcționale'
  },
  {
    id: 'PSI-015',
    requirement: 'Verificare uși ieșire antifrică',
    legalBasis: 'OMAI 163/2007, art. 182',
    category: 'evacuare',
    frequency: 'lunar',
    penalty: '5.000 - 10.000 RON',
    description: 'Verificarea funcționalității ușilor de evacuare și a sistemelor de închidere'
  },
  {
    id: 'PSI-016',
    requirement: 'Verificare sistem stingere automată (sprinklere)',
    legalBasis: 'OMAI 163/2007, art. 223',
    category: 'hidranti',
    frequency: 'trimestrial',
    penalty: '10.000 - 20.000 RON',
    description: 'Verificare tehnică sistem sprinklere de către firme autorizate'
  },
  {
    id: 'PSI-017',
    requirement: 'Verificare pompă de incendiu',
    legalBasis: 'OMAI 163/2007, art. 220',
    category: 'hidranti',
    frequency: 'lunar',
    penalty: '10.000 - 15.000 RON',
    description: 'Verificarea funcționalității pompei de incendiu și a grupului de pompare'
  },
  {
    id: 'PSI-018',
    requirement: 'Verificare instalații electrice (risc incendiu)',
    legalBasis: 'OMAI 163/2007, art. 141',
    category: 'verificare',
    frequency: 'anual',
    penalty: '5.000 - 15.000 RON',
    description: 'Verificare instalații electrice pentru prevenirea incendiilor'
  },
  {
    id: 'PSI-019',
    requirement: 'Marcare echipamente PSI',
    legalBasis: 'OMAI 163/2007, art. 215',
    category: 'stingatoare',
    frequency: 'permanent',
    penalty: '2.000 - 5.000 RON',
    description: 'Semnalizare vizibilă pentru stingătoare, hidranți și echipamente PSI'
  },
  {
    id: 'PSI-020',
    requirement: 'Verificare rezistență foc compartimentări',
    legalBasis: 'OMAI 163/2007, art. 92',
    category: 'verificare',
    frequency: 'bianual',
    penalty: '10.000 - 20.000 RON',
    description: 'Verificarea integrității compartimentărilor antifoc și a ușilor REI'
  }
];

/**
 * Helper function to get requirements by category
 */
export function getRequirementsByCategory(category: PSICategory): PSIRequirement[] {
  return psiRequirements.filter(req => req.category === category);
}

/**
 * Helper function to get requirements by frequency
 */
export function getRequirementsByFrequency(frequency: PSIFrequency): PSIRequirement[] {
  return psiRequirements.filter(req => req.frequency === frequency);
}

/**
 * Helper function to get requirement by ID
 */
export function getRequirementById(id: string): PSIRequirement | undefined {
  return psiRequirements.find(req => req.id === id);
}

/**
 * Get all categories
 */
export function getAllCategories(): PSICategory[] {
  return ['stingatoare', 'hidranti', 'detectie', 'evacuare', 'autorizatie', 'instructaj', 'verificare'];
}

/**
 * Get requirements count by category
 */
export function getRequirementsCountByCategory(): Record<PSICategory, number> {
  return getAllCategories().reduce((acc, category) => {
    acc[category] = getRequirementsByCategory(category).length;
    return acc;
  }, {} as Record<PSICategory, number>);
}
