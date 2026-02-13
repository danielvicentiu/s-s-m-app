/**
 * Penalties database for Hungary (HU)
 * Occupational Safety and Health (Munkavédelem) violations
 * Authority: OMMF (Országos Munkavédelmi és Munkaügyi Főfelügyelőség)
 */

export interface Penalty {
  id: string;
  article: string;
  offense: string;
  offenseHU: string;
  minFine: number;
  maxFine: number;
  currency: 'HUF';
  authority: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export const penaltiesHU: Penalty[] = [
  {
    id: 'hu-pen-001',
    article: '1993. évi XCIII. törvény 83. § (1)',
    offense: 'Lipsa serviciului de protecție a muncii',
    offenseHU: 'Munkavédelmi szervezet hiánya',
    minFine: 500000,
    maxFine: 2000000,
    currency: 'HUF',
    authority: 'OMMF',
    severity: 'critical',
    description: 'Angajatorul nu a organizat serviciul de protecție a muncii conform legislației, expunând lucrătorii la riscuri negestionate.'
  },
  {
    id: 'hu-pen-002',
    article: '1993. évi XCIII. törvény 54. § (3)',
    offense: 'Absența evaluării riscurilor profesionale',
    offenseHU: 'Kockázatértékelés hiánya',
    minFine: 300000,
    maxFine: 1500000,
    currency: 'HUF',
    authority: 'OMMF',
    severity: 'critical',
    description: 'Angajatorul nu a efectuat evaluarea riscurilor profesionale pentru locurile de muncă, încălcând obligația fundamentală de prevenire.'
  },
  {
    id: 'hu-pen-003',
    article: '5/1993. (XII. 26.) MüM rendelet 6. §',
    offense: 'Instruire SSM insuficientă sau inexistentă',
    offenseHU: 'Munkavédelmi oktatás elmulasztása',
    minFine: 200000,
    maxFine: 1000000,
    currency: 'HUF',
    authority: 'OMMF',
    severity: 'high',
    description: 'Lucrătorii nu au primit instruirea obligatorie de protecție a muncii la angajare sau periodic, expunându-i la riscuri evitabile.'
  },
  {
    id: 'hu-pen-004',
    article: '1993. évi XCIII. törvény 55. §',
    offense: 'Lipsa controalelor medicale obligatorii',
    offenseHU: 'Kötelező orvosi vizsgálatok hiánya',
    minFine: 250000,
    maxFine: 1200000,
    currency: 'HUF',
    authority: 'OMMF',
    severity: 'high',
    description: 'Angajatorul a permis lucrul fără efectuarea controalelor medicale de medicina muncii, punând în pericol sănătatea angajaților.'
  },
  {
    id: 'hu-pen-005',
    article: '1993. évi XCIII. törvény 56. §',
    offense: 'Echipamente de protecție individuală inadecvate sau lipsa',
    offenseHU: 'Személyi védőeszközök hiánya vagy nem megfelelősége',
    minFine: 150000,
    maxFine: 800000,
    currency: 'HUF',
    authority: 'OMMF',
    severity: 'high',
    description: 'Angajatorul nu a furnizat echipamentele de protecție individuală necesare sau acestea sunt inadecvate riscurilor identificate.'
  },
  {
    id: 'hu-pen-006',
    article: '1993. évi XCIII. törvény 57. § (1)',
    offense: 'Utilizarea echipamentelor de lucru neconforme',
    offenseHU: 'Nem megfelelő munkaeszközök használata',
    minFine: 300000,
    maxFine: 1500000,
    currency: 'HUF',
    authority: 'OMMF',
    severity: 'critical',
    description: 'Echipamentele de lucru nu îndeplinesc cerințele de securitate și nu au fost verificate tehnic conform reglementărilor.'
  },
  {
    id: 'hu-pen-007',
    article: '5/1993. (XII. 26.) MüM rendelet 35. §',
    offense: 'Lipsa măsurilor de protecție împotriva căderilor de la înălțime',
    offenseHU: 'Magasból való lezuhanás elleni védelem hiánya',
    minFine: 250000,
    maxFine: 1200000,
    currency: 'HUF',
    authority: 'OMMF',
    severity: 'critical',
    description: 'La lucrările la înălțime nu au fost asigurate sisteme de protecție împotriva căderilor (balustrade, centuri de siguranță, plase).'
  },
  {
    id: 'hu-pen-008',
    article: '1993. évi XCIII. törvény 58. §',
    offense: 'Depășirea valorilor limită de expunere profesională',
    offenseHU: 'Expozíciós határértékek túllépése',
    minFine: 400000,
    maxFine: 2000000,
    currency: 'HUF',
    authority: 'OMMF',
    severity: 'critical',
    description: 'Concentrațiile de substanțe nocive, zgomot, vibrații sau alți factori depășesc valorile maxime admise în mediul de lucru.'
  },
  {
    id: 'hu-pen-009',
    article: '5/1993. (XII. 26.) MüM rendelet 12. §',
    offense: 'Documentație SSM incompletă sau inexistentă',
    offenseHU: 'Munkavédelmi dokumentáció hiányossága',
    minFine: 100000,
    maxFine: 500000,
    currency: 'HUF',
    authority: 'OMMF',
    severity: 'medium',
    description: 'Angajatorul nu deține documentația obligatorie de protecție a muncii (registre de instruire, evidențe EIP, rapoarte de evaluare).'
  },
  {
    id: 'hu-pen-010',
    article: '1993. évi XCIII. törvény 62. §',
    offense: 'Lipsa semnalizării de securitate',
    offenseHU: 'Biztonsági jelzések hiánya',
    minFine: 80000,
    maxFine: 400000,
    currency: 'HUF',
    authority: 'OMMF',
    severity: 'medium',
    description: 'Zonele periculoase nu sunt marcate cu indicatoare de avertizare și securitate conform standardelor în vigoare.'
  },
  {
    id: 'hu-pen-011',
    article: '9/1997. (V. 28.) GM rendelet',
    offense: 'Nerespectarea cerințelor pentru lucrări cu substanțe periculoase',
    offenseHU: 'Veszélyes anyagokkal végzett munka előírásainak megszegése',
    minFine: 350000,
    maxFine: 1800000,
    currency: 'HUF',
    authority: 'OMMF',
    severity: 'critical',
    description: 'Manipularea, depozitarea sau utilizarea substanțelor chimice periculoase fără respectarea procedurilor de siguranță obligatorii.'
  },
  {
    id: 'hu-pen-012',
    article: '1993. évi XCIII. törvény 60. §',
    offense: 'Iluminat insuficient la locul de muncă',
    offenseHU: 'Nem megfelelő megvilágítás',
    minFine: 60000,
    maxFine: 300000,
    currency: 'HUF',
    authority: 'OMMF',
    severity: 'low',
    description: 'Nivelul de iluminare la locurile de muncă este sub valorile minime reglementate, afectând siguranța și sănătatea lucrătorilor.'
  },
  {
    id: 'hu-pen-013',
    article: '5/1993. (XII. 26.) MüM rendelet 29. §',
    offense: 'Lipsa treptelor sau barierelor la denivelări periculoase',
    offenseHU: 'Lépcsők és korlátok hiánya veszélyes szintkülönbségeknél',
    minFine: 100000,
    maxFine: 600000,
    currency: 'HUF',
    authority: 'OMMF',
    severity: 'high',
    description: 'Zone cu denivelări peste 50 cm fără scări adecvate sau bariere de protecție, creând risc de accidente prin cădere.'
  },
  {
    id: 'hu-pen-014',
    article: '1993. évi XCIII. törvény 61. §',
    offense: 'Căi de evacuare blocate sau nesemnalizate',
    offenseHU: 'Menekülési utak elzárása vagy jelölésének hiánya',
    minFine: 150000,
    maxFine: 800000,
    currency: 'HUF',
    authority: 'OMMF',
    severity: 'high',
    description: 'Căile de evacuare în caz de urgență sunt blocate, înguste sau nu sunt marcate corespunzător, împiedicând evacuarea rapidă.'
  },
  {
    id: 'hu-pen-015',
    article: '5/1993. (XII. 26.) MüM rendelet 40. §',
    offense: 'Lucru fără autorizație la lucrări deosebit de periculoase',
    offenseHU: 'Különösen veszélyes munka engedély nélküli végzése',
    minFine: 300000,
    maxFine: 1500000,
    currency: 'HUF',
    authority: 'OMMF',
    severity: 'critical',
    description: 'Executarea de lucrări în spații înguste, la înălțime sau cu surse de pericol fără autorizația scrisă obligatorie și supraveghere.'
  },
  {
    id: 'hu-pen-016',
    article: '1993. évi XCIII. törvény 59. §',
    offense: 'Lipsa instalațiilor sanitare adecvate',
    offenseHU: 'Megfelelő szociális és higiénés létesítmények hiánya',
    minFine: 120000,
    maxFine: 600000,
    currency: 'HUF',
    authority: 'OMMF',
    severity: 'medium',
    description: 'Angajatorul nu asigură spații sanitare, vestiare sau spații de odihnă conform cerințelor minime de igienă și confort.'
  },
  {
    id: 'hu-pen-017',
    article: '5/1993. (XII. 26.) MüM rendelet 18. §',
    offense: 'Neraportarea accidentelor de muncă',
    offenseHU: 'Munkabaleset bejelentésének elmulasztása',
    minFine: 200000,
    maxFine: 1000000,
    currency: 'HUF',
    authority: 'OMMF',
    severity: 'high',
    description: 'Angajatorul nu a notificat autoritățile competente despre producerea unui accident de muncă în termenul legal stabilit.'
  },
  {
    id: 'hu-pen-018',
    article: '1993. évi XCIII. törvény 70. §',
    offense: 'Refuzul controlului de către inspectorii OMMF',
    offenseHU: 'Munkavédelmi ellenőrzés akadályozása',
    minFine: 250000,
    maxFine: 1200000,
    currency: 'HUF',
    authority: 'OMMF',
    severity: 'high',
    description: 'Împiedicarea accesului inspectorilor de muncă la verificarea respectării normelor de protecție a muncii.'
  },
  {
    id: 'hu-pen-019',
    article: '5/1993. (XII. 26.) MüM rendelet 25. §',
    offense: 'Depozitare necorespunzătoare de materiale',
    offenseHU: 'Nem megfelelő anyagtárolás',
    minFine: 80000,
    maxFine: 400000,
    currency: 'HUF',
    authority: 'OMMF',
    severity: 'medium',
    description: 'Materiale, produse sau echipamente depozitate în mod nesigur, creând risc de prăbușire, cădere sau deteriorare.'
  },
  {
    id: 'hu-pen-020',
    article: '1993. évi XCIII. törvény 57. § (3)',
    offense: 'Utilizarea echipamentelor electrice defecte',
    offenseHU: 'Hibás elektromos berendezések használata',
    minFine: 200000,
    maxFine: 1000000,
    currency: 'HUF',
    authority: 'OMMF',
    severity: 'critical',
    description: 'Utilizarea echipamentelor electrice cu defecțiuni, fără verificări periodice sau fără sisteme de protecție la șoc electric.'
  }
];

/**
 * Get all Hungarian penalties
 * @returns Array of penalties for Hungary
 */
export function getPenaltiesHU(): Penalty[] {
  return penaltiesHU;
}

/**
 * Get penalty by ID
 * @param id Penalty ID
 * @returns Penalty object or undefined
 */
export function getPenaltyByIdHU(id: string): Penalty | undefined {
  return penaltiesHU.find(p => p.id === id);
}

/**
 * Get penalties by severity
 * @param severity Severity level
 * @returns Array of penalties matching the severity
 */
export function getPenaltiesBySeverityHU(severity: Penalty['severity']): Penalty[] {
  return penaltiesHU.filter(p => p.severity === severity);
}

export default penaltiesHU;
