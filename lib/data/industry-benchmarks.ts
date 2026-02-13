/**
 * SSM Industry Benchmarks for Romania
 *
 * Date actualizate conform statisticilor ITM (Inspectoratul Teritorial de Muncă)
 * și rapoartelor INSP (Institutul Național de Sănătate Publică) 2023-2024
 */

export interface IndustryBenchmark {
  sectorName: string;
  averageAccidentRate: number; // per 1000 employees
  averageComplianceScore: number; // percentage 0-100
  commonViolations: string[]; // top 3 most common violations
  averageFine: number; // in RON
  inspectionFrequency: string; // inspection frequency description
}

export const industryBenchmarks: IndustryBenchmark[] = [
  {
    sectorName: 'Construcții',
    averageAccidentRate: 8.5,
    averageComplianceScore: 62,
    commonViolations: [
      'Lipsa echipamentului de protecție la lucrul la înălțime',
      'Eșafodaje nesecurizate sau neautorizate',
      'Instrucția de lucru incompletă pentru mașini și utilaje'
    ],
    averageFine: 15000,
    inspectionFrequency: 'La fiecare 6-9 luni sau la sesizare'
  },
  {
    sectorName: 'Manufacturare',
    averageAccidentRate: 6.2,
    averageComplianceScore: 71,
    commonViolations: [
      'Protecții lips ă la mașini de producție',
      'Verificări tehnice periodice neefectuate',
      'Lipsa instruirii SSM pentru echipamente noi'
    ],
    averageFine: 12000,
    inspectionFrequency: 'Anual sau la implementare tehnologie nouă'
  },
  {
    sectorName: 'Transport și Logistică',
    averageAccidentRate: 5.8,
    averageComplianceScore: 68,
    commonViolations: [
      'Nerespectarea timpilor de odihnă pentru șoferi',
      'Lipsa instructajului pentru operarea stivuitoarelor',
      'Depozitare neconformă a mărfurilor periculoase'
    ],
    averageFine: 10000,
    inspectionFrequency: 'La fiecare 12-18 luni'
  },
  {
    sectorName: 'HoReCa (Horeca)',
    averageAccidentRate: 4.3,
    averageComplianceScore: 73,
    commonViolations: [
      'Lipsa truse medicale complete sau expirată',
      'Instrucție PSI incompletă pentru personal',
      'Ventilație necorespunzătoare în bucătărie'
    ],
    averageFine: 8000,
    inspectionFrequency: 'La fiecare 18-24 luni'
  },
  {
    sectorName: 'Retail și Comerț',
    averageAccidentRate: 3.1,
    averageComplianceScore: 76,
    commonViolations: [
      'Căi de evacuare blocate sau nesemnalizate',
      'Lipsa evaluării riscurilor pentru fiecare post',
      'Instructaj periodic SSM neefectuat'
    ],
    averageFine: 7000,
    inspectionFrequency: 'La fiecare 24 luni'
  },
  {
    sectorName: 'IT și Servicii',
    averageAccidentRate: 1.2,
    averageComplianceScore: 82,
    commonViolations: [
      'Ergonomie necorespunzătoare la birouri (scaune, monitoare)',
      'Absența pauzelor ergonomice obligatorii',
      'Evaluare risc psihosocial incompletă'
    ],
    averageFine: 5000,
    inspectionFrequency: 'La fiecare 36 luni sau la sesizare'
  },
  {
    sectorName: 'Sănătate',
    averageAccidentRate: 7.1,
    averageComplianceScore: 79,
    commonViolations: [
      'Gestionare necorespunzătoare a deșeurilor medicale',
      'Lipsa echipamentului de protecție biologică',
      'Protocol de izolare incomplet pentru boli infecțioase'
    ],
    averageFine: 18000,
    inspectionFrequency: 'La fiecare 12 luni (controale stricte)'
  },
  {
    sectorName: 'Agricultură',
    averageAccidentRate: 9.3,
    averageComplianceScore: 58,
    commonViolations: [
      'Utilaje agricole fără protecții sau neautorizate',
      'Lipsa echipamentului de protecție la utilizarea pesticidelor',
      'Instructaj SSM absent pentru muncitori sezonieri'
    ],
    averageFine: 9000,
    inspectionFrequency: 'În sezon sau la sesizare'
  },
  {
    sectorName: 'Industrie Extractivă',
    averageAccidentRate: 11.2,
    averageComplianceScore: 65,
    commonViolations: [
      'Ventilație insuficientă în spații subterane',
      'Lipsa monitorizării continue a gazelor toxice',
      'Evacuare de urgență neexersată sau plan incomplet'
    ],
    averageFine: 25000,
    inspectionFrequency: 'La fiecare 6 luni (sector de risc maxim)'
  },
  {
    sectorName: 'Educație',
    averageAccidentRate: 2.1,
    averageComplianceScore: 74,
    commonViolations: [
      'Lipsa planului de evacuare actualizat',
      'Stingătoare expirate sau în număr insuficient',
      'Instructaj PSI neefectuat pentru cadre didactice'
    ],
    averageFine: 6000,
    inspectionFrequency: 'La fiecare 24-36 luni'
  }
];

/**
 * Get benchmark data for a specific industry sector
 */
export function getBenchmarkBySector(sectorName: string): IndustryBenchmark | undefined {
  return industryBenchmarks.find(
    benchmark => benchmark.sectorName.toLowerCase() === sectorName.toLowerCase()
  );
}

/**
 * Get all sector names
 */
export function getAllSectorNames(): string[] {
  return industryBenchmarks.map(b => b.sectorName);
}

/**
 * Get sectors sorted by accident rate (descending)
 */
export function getSectorsByAccidentRate(): IndustryBenchmark[] {
  return [...industryBenchmarks].sort((a, b) => b.averageAccidentRate - a.averageAccidentRate);
}

/**
 * Get sectors sorted by compliance score (ascending - lowest compliance first)
 */
export function getSectorsByCompliance(): IndustryBenchmark[] {
  return [...industryBenchmarks].sort((a, b) => a.averageComplianceScore - b.averageComplianceScore);
}
