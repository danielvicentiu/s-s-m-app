/**
 * Compliance Scoring Rules
 *
 * Definește regulile pentru calculul scorului de conformitate SSM/PSI
 * Total: 100 puncte distribuite pe 15 criterii
 */

export interface ComplianceScoringRule {
  id: string;
  name: string;
  nameEn?: string;
  maxPoints: number;
  condition: string;
  penaltyPerDay: number;
  category: 'ssm' | 'psi' | 'both';
  description?: string;
}

export const complianceScoringRules: ComplianceScoringRule[] = [
  {
    id: 'training_up_to_date',
    name: 'Instruire la zi (periodicitate respectată)',
    nameEn: 'Training up to date (periodicity respected)',
    maxPoints: 20,
    condition: 'Toți angajații au instruire SSM/PSI la zi conform periodicității (anuală/6 luni)',
    penaltyPerDay: 0.5,
    category: 'both',
    description: 'Verifică dacă toți angajații au instruiri valide conform periodicității stabilite'
  },
  {
    id: 'medical_exams',
    name: 'Examene medicale la zi',
    nameEn: 'Medical examinations up to date',
    maxPoints: 15,
    condition: 'Toți angajații au avize medicale valide (nedepășite)',
    penaltyPerDay: 0.4,
    category: 'ssm',
    description: 'Verifică validitatea avizelor medicale pentru toți angajații'
  },
  {
    id: 'eip_distributed',
    name: 'EIP distribuit și înregistrat',
    nameEn: 'PPE distributed and recorded',
    maxPoints: 10,
    condition: 'Echipament individual de protecție distribuit conform normelor și înregistrat',
    penaltyPerDay: 0.3,
    category: 'ssm',
    description: 'Verifică distribuirea și înregistrarea echipamentului de protecție'
  },
  {
    id: 'evacuation_plan',
    name: 'Plan de evacuare afișat și actualizat',
    nameEn: 'Evacuation plan displayed and updated',
    maxPoints: 10,
    condition: 'Plan de evacuare PSI afișat la vedere și actualizat în ultimele 12 luni',
    penaltyPerDay: 0.2,
    category: 'psi',
    description: 'Verifică existența și actualitatea planului de evacuare'
  },
  {
    id: 'risk_assessment',
    name: 'Evaluare riscuri actualizată',
    nameEn: 'Risk assessment updated',
    maxPoints: 15,
    condition: 'Evaluarea riscurilor actualizată (< 12 luni sau după modificări majore)',
    penaltyPerDay: 0.4,
    category: 'both',
    description: 'Verifică dacă evaluarea riscurilor este la zi'
  },
  {
    id: 'cssm_committee',
    name: 'CSSM constituit',
    nameEn: 'CSSM committee established',
    maxPoints: 5,
    condition: 'Comitet de Securitate și Sănătate în Muncă constituit (dacă ≥50 angajați)',
    penaltyPerDay: 0.1,
    category: 'ssm',
    description: 'Verifică constituirea CSSM pentru organizații cu peste 50 angajați'
  },
  {
    id: 'designated_workers',
    name: 'Lucrători desemnați PSI',
    nameEn: 'Designated fire safety workers',
    maxPoints: 5,
    condition: 'Lucrători desemnați pentru PSI conform normelor (min. 2 persoane)',
    penaltyPerDay: 0.1,
    category: 'psi',
    description: 'Verifică desemnarea lucrătorilor pentru prevenirea și stingerea incendiilor'
  },
  {
    id: 'accident_register',
    name: 'Registru accidente completat',
    nameEn: 'Accident register completed',
    maxPoints: 5,
    condition: 'Registrul de evidență a accidentelor de muncă completat și la zi',
    penaltyPerDay: 0.1,
    category: 'ssm',
    description: 'Verifică existența și completarea registrului de accidente'
  },
  {
    id: 'safety_signage',
    name: 'Semnalizare securitate montată',
    nameEn: 'Safety signage installed',
    maxPoints: 5,
    condition: 'Indicatoare de securitate și PSI montate conform planului',
    penaltyPerDay: 0.1,
    category: 'both',
    description: 'Verifică montarea indicatoarelor de securitate și PSI'
  },
  {
    id: 'first_aid_kit',
    name: 'Trusă prim ajutor completă',
    nameEn: 'First aid kit complete',
    maxPoints: 5,
    condition: 'Trusă de prim ajutor completă și la termen (verificare lunară)',
    penaltyPerDay: 0.1,
    category: 'ssm',
    description: 'Verifică existența și completitudinea trusei de prim ajutor'
  },
  {
    id: 'evacuation_drill',
    name: 'Exercițiu de evacuare efectuat',
    nameEn: 'Evacuation drill conducted',
    maxPoints: 5,
    condition: 'Exercițiu de evacuare efectuat în ultimele 12 luni (PV semnat)',
    penaltyPerDay: 0.2,
    category: 'psi',
    description: 'Verifică efectuarea exercițiului de evacuare anual'
  },
  {
    id: 'fire_extinguishers',
    name: 'Stingătoare verificate',
    nameEn: 'Fire extinguishers checked',
    maxPoints: 5,
    condition: 'Stingătoare verificate tehnic în ultimele 12 luni',
    penaltyPerDay: 0.2,
    category: 'psi',
    description: 'Verifică revizia tehnică a stingătoarelor'
  },
  {
    id: 'electrical_installation',
    name: 'Instalație electrică verificată',
    nameEn: 'Electrical installation checked',
    maxPoints: 5,
    condition: 'Instalație electrică verificată (< 24 luni) cu buletin de verificare',
    penaltyPerDay: 0.2,
    category: 'psi',
    description: 'Verifică buletin de verificare instalație electrică'
  },
  {
    id: 'work_equipment_checks',
    name: 'Verificări echipamente de muncă',
    nameEn: 'Work equipment checks',
    maxPoints: 5,
    condition: 'Echipamente de muncă verificate tehnic conform normelor',
    penaltyPerDay: 0.2,
    category: 'ssm',
    description: 'Verifică revizia tehnică a echipamentelor de muncă'
  },
  {
    id: 'workplace_hygiene',
    name: 'Igiena locului de muncă',
    nameEn: 'Workplace hygiene',
    maxPoints: 5,
    condition: 'Condiții de igienă respectate (iluminat, ventilație, temperatură)',
    penaltyPerDay: 0.1,
    category: 'ssm',
    description: 'Verifică respectarea condițiilor de igienă la locul de muncă'
  }
];

/**
 * Validează că suma totală a punctelor este 100
 */
export const getTotalMaxPoints = (): number => {
  return complianceScoringRules.reduce((sum, rule) => sum + rule.maxPoints, 0);
};

/**
 * Obține reguli după categorie
 */
export const getRulesByCategory = (category: 'ssm' | 'psi' | 'both'): ComplianceScoringRule[] => {
  if (category === 'both') {
    return complianceScoringRules;
  }
  return complianceScoringRules.filter(rule => rule.category === category || rule.category === 'both');
};

/**
 * Obține regulă după ID
 */
export const getRuleById = (id: string): ComplianceScoringRule | undefined => {
  return complianceScoringRules.find(rule => rule.id === id);
};

/**
 * Calculează penalitatea pentru o regulă în funcție de zilele de întârziere
 */
export const calculatePenalty = (ruleId: string, daysOverdue: number): number => {
  const rule = getRuleById(ruleId);
  if (!rule || daysOverdue <= 0) return 0;

  const penalty = rule.penaltyPerDay * daysOverdue;
  // Penalitatea nu poate depăși punctele maxime ale regulii
  return Math.min(penalty, rule.maxPoints);
};

/**
 * Validare: verifică că totalul este exact 100 puncte
 */
if (getTotalMaxPoints() !== 100) {
  console.error(`[COMPLIANCE RULES] Suma totală a punctelor este ${getTotalMaxPoints()}, ar trebui să fie 100!`);
}
