/**
 * Penalties database for Hungary (HU)
 * Occupational Safety and Health violations - Munkavédelmi bírságok
 * Based on Act XCIII of 1993 on Occupational Safety and Health
 * Authority: OMMF (Országos Munkavédelmi és Munkaügyi Főfelügyelőség)
 * National Labour Office - Occupational Safety and Health Division
 */

export interface PenaltyHU {
  id: string;
  article: string; // Article reference from the Act
  violation: string; // Description in Romanian
  violationHU: string; // Description in Hungarian
  minFine: number; // Minimum fine in HUF
  maxFine: number; // Maximum fine in HUF
  authority: string; // OMMF
  severity: 'ușoară' | 'medie' | 'gravă' | 'foarte gravă';
  domain: 'ssm' | 'medical' | 'training' | 'equipment' | 'documentation';
}

export const penaltiesHU: PenaltyHU[] = [
  {
    id: 'hu-pen-001',
    article: '§ 54 (1)',
    violation: 'Nerespectarea obligației de evaluare a riscurilor',
    violationHU: 'A kockázatértékelési kötelezettség elmulasztása',
    minFine: 100000,
    maxFine: 2000000,
    authority: 'OMMF',
    severity: 'gravă',
    domain: 'ssm'
  },
  {
    id: 'hu-pen-002',
    article: '§ 54 (2)',
    violation: 'Lipsa numirilor în scris a responsabilului SSM',
    violationHU: 'Munkavédelmi felelős írásbeli kinevezésének hiánya',
    minFine: 50000,
    maxFine: 1000000,
    authority: 'OMMF',
    severity: 'medie',
    domain: 'documentation'
  },
  {
    id: 'hu-pen-003',
    article: '§ 54 (3)',
    violation: 'Neefectuarea instruirii obligatorii în domeniul SSM',
    violationHU: 'Kötelező munkavédelmi oktatás elmulasztása',
    minFine: 200000,
    maxFine: 3000000,
    authority: 'OMMF',
    severity: 'foarte gravă',
    domain: 'training'
  },
  {
    id: 'hu-pen-004',
    article: '§ 54 (4)',
    violation: 'Lipsa documentației privind instruirea periodică',
    violationHU: 'Időszakos oktatás dokumentációjának hiánya',
    minFine: 50000,
    maxFine: 800000,
    authority: 'OMMF',
    severity: 'medie',
    domain: 'documentation'
  },
  {
    id: 'hu-pen-005',
    article: '§ 55 (1)',
    violation: 'Nepunerea la dispoziție a echipamentelor individuale de protecție',
    violationHU: 'Egyéni védőeszközök biztosításának elmulasztása',
    minFine: 100000,
    maxFine: 2000000,
    authority: 'OMMF',
    severity: 'gravă',
    domain: 'equipment'
  },
  {
    id: 'hu-pen-006',
    article: '§ 55 (2)',
    violation: 'Utilizarea de echipamente de protecție neconforme sau expirate',
    violationHU: 'Nem megfelelő vagy lejárt védőeszközök használata',
    minFine: 80000,
    maxFine: 1500000,
    authority: 'OMMF',
    severity: 'gravă',
    domain: 'equipment'
  },
  {
    id: 'hu-pen-007',
    article: '§ 56 (1)',
    violation: 'Lipsa controlului medical periodic obligatoriu',
    violationHU: 'Kötelező időszakos orvosi vizsgálat elmulasztása',
    minFine: 150000,
    maxFine: 2500000,
    authority: 'OMMF',
    severity: 'foarte gravă',
    domain: 'medical'
  },
  {
    id: 'hu-pen-008',
    article: '§ 56 (2)',
    violation: 'Admiterea la muncă fără control medical inițial',
    violationHU: 'Munkára alkalmatlanság megállapítása nélküli munkavégzés engedélyezése',
    minFine: 200000,
    maxFine: 3000000,
    authority: 'OMMF',
    severity: 'foarte gravă',
    domain: 'medical'
  },
  {
    id: 'hu-pen-009',
    article: '§ 54 (5)',
    violation: 'Lipsa sau incompletitudinea registrului de instruire SSM',
    violationHU: 'Munkavédelmi oktatási nyilvántartás hiánya vagy hiányossága',
    minFine: 50000,
    maxFine: 800000,
    authority: 'OMMF',
    severity: 'medie',
    domain: 'documentation'
  },
  {
    id: 'hu-pen-010',
    article: '§ 57 (1)',
    violation: 'Nerespectarea măsurilor de prevenire a accidentelor de muncă',
    violationHU: 'Munkabalesetek megelőzési intézkedéseinek elmulasztása',
    minFine: 150000,
    maxFine: 2500000,
    authority: 'OMMF',
    severity: 'foarte gravă',
    domain: 'ssm'
  },
  {
    id: 'hu-pen-011',
    article: '§ 57 (2)',
    violation: 'Neraportarea accidentelor de muncă în termenul legal',
    violationHU: 'Munkabaleset bejelentési kötelezettségének elmulasztása',
    minFine: 100000,
    maxFine: 2000000,
    authority: 'OMMF',
    severity: 'gravă',
    domain: 'documentation'
  },
  {
    id: 'hu-pen-012',
    article: '§ 54 (6)',
    violation: 'Lipsa planului de prevenire și protecție',
    violationHU: 'Munkavédelmi terv hiánya',
    minFine: 100000,
    maxFine: 1500000,
    authority: 'OMMF',
    severity: 'gravă',
    domain: 'documentation'
  },
  {
    id: 'hu-pen-013',
    article: '§ 58 (1)',
    violation: 'Utilizarea de echipamente de muncă fără autorizare tehnică',
    violationHU: 'Műszaki engedély nélküli munkagépek használata',
    minFine: 150000,
    maxFine: 2000000,
    authority: 'OMMF',
    severity: 'gravă',
    domain: 'equipment'
  },
  {
    id: 'hu-pen-014',
    article: '§ 58 (2)',
    violation: 'Neefectuarea verificărilor periodice ale echipamentelor de lucru',
    violationHU: 'Munkagépek időszakos ellenőrzésének elmulasztása',
    minFine: 80000,
    maxFine: 1200000,
    authority: 'OMMF',
    severity: 'medie',
    domain: 'equipment'
  },
  {
    id: 'hu-pen-015',
    article: '§ 54 (7)',
    violation: 'Nedesemnarea unui lucrător cu atribuții SSM sau specialist extern',
    violationHU: 'Munkavédelmi megbízott vagy külső szakember hiánya',
    minFine: 100000,
    maxFine: 2000000,
    authority: 'OMMF',
    severity: 'gravă',
    domain: 'ssm'
  },
  {
    id: 'hu-pen-016',
    article: '§ 55 (3)',
    violation: 'Lipsa instruirii privind utilizarea echipamentelor de protecție',
    violationHU: 'Védőeszköz használati oktatás elmulasztása',
    minFine: 50000,
    maxFine: 1000000,
    authority: 'OMMF',
    severity: 'medie',
    domain: 'training'
  },
  {
    id: 'hu-pen-017',
    article: '§ 59 (1)',
    violation: 'Nerespectarea normelor de securitate la locul de muncă',
    violationHU: 'Munkahelyi biztonsági előírások megszegése',
    minFine: 100000,
    maxFine: 1800000,
    authority: 'OMMF',
    severity: 'gravă',
    domain: 'ssm'
  },
  {
    id: 'hu-pen-018',
    article: '§ 54 (8)',
    violation: 'Lipsa afișării instrucțiunilor de securitate la locul de muncă',
    violationHU: 'Munkavédelmi utasítások munkahelyi kifüggesztésének hiánya',
    minFine: 30000,
    maxFine: 500000,
    authority: 'OMMF',
    severity: 'ușoară',
    domain: 'documentation'
  },
  {
    id: 'hu-pen-019',
    article: '§ 56 (3)',
    violation: 'Permiterea lucrului în condiții vătămătoare fără monitorizare medicală',
    violationHU: 'Egészségkárosító munkavégzés orvosi felügyelet nélkül',
    minFine: 200000,
    maxFine: 3000000,
    authority: 'OMMF',
    severity: 'foarte gravă',
    domain: 'medical'
  },
  {
    id: 'hu-pen-020',
    article: '§ 60 (1)',
    violation: 'Obstrucționarea sau împiedicarea controlului autorităților de inspecție',
    violationHU: 'Ellenőrző hatóság munkájának akadályozása',
    minFine: 250000,
    maxFine: 5000000,
    authority: 'OMMF',
    severity: 'foarte gravă',
    domain: 'ssm'
  }
];

/**
 * Get all penalties for Hungary
 */
export function getPenaltiesHU(): PenaltyHU[] {
  return penaltiesHU;
}

/**
 * Get penalties by domain
 */
export function getPenaltiesByDomain(domain: PenaltyHU['domain']): PenaltyHU[] {
  return penaltiesHU.filter(p => p.domain === domain);
}

/**
 * Get penalties by severity
 */
export function getPenaltiesBySeverity(severity: PenaltyHU['severity']): PenaltyHU[] {
  return penaltiesHU.filter(p => p.severity === severity);
}

/**
 * Get penalty by ID
 */
export function getPenaltyById(id: string): PenaltyHU | undefined {
  return penaltiesHU.find(p => p.id === id);
}

/**
 * Calculate average fine for a penalty
 */
export function getAverageFine(penalty: PenaltyHU): number {
  return Math.round((penalty.minFine + penalty.maxFine) / 2);
}

/**
 * Format HUF amount to readable string
 */
export function formatHUF(amount: number): string {
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export default penaltiesHU;
