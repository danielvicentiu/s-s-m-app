/**
 * Romanian Labor Law Requirements Database
 * Based on Legea 53/2003 - Codul Muncii
 *
 * Acest fișier conține obligațiile principale ale angajatorului
 * conform legislației muncii din România.
 */

export type LaborLawCategory =
  | 'contract'
  | 'timp_munca'
  | 'concediu'
  | 'salariu'
  | 'discriminare'
  | 'sanatate_securitate'
  | 'documente';

export type CheckFrequency =
  | 'la_angajare'
  | 'lunar'
  | 'trimestrial'
  | 'anual'
  | 'permanent'
  | 'la_cerere';

export interface LaborLawRequirement {
  id: string;
  requirement: string;
  legalBasis: string;
  category: LaborLawCategory;
  penalty: string;
  frequency: CheckFrequency;
  description?: string;
}

export const laborLawRequirements: LaborLawRequirement[] = [
  {
    id: 'CIM-001',
    requirement: 'Încheierea contractului individual de muncă în formă scrisă',
    legalBasis: 'Legea 53/2003, art. 16',
    category: 'contract',
    penalty: 'Amendă de la 1.500 lei la 2.000 lei pentru fiecare persoană',
    frequency: 'la_angajare',
    description: 'Contractul individual de muncă se încheie în baza consimțământului părților, în formă scrisă, în limba română, înainte de începerii activității.'
  },
  {
    id: 'CIM-002',
    requirement: 'Înregistrarea contractului individual de muncă în Revisal',
    legalBasis: 'Legea 53/2003, art. 16 alin. (2)',
    category: 'contract',
    penalty: 'Amendă de la 5.000 lei la 8.000 lei pentru fiecare persoană',
    frequency: 'la_angajare',
    description: 'Anterior începerii activității, angajatorul are obligația de a înregistra în Registrul general de evidență a salariaților.'
  },
  {
    id: 'TM-001',
    requirement: 'Respectarea duratei normale a timpului de lucru - maximum 8 ore/zi și 40 ore/săptămână',
    legalBasis: 'Legea 53/2003, art. 111',
    category: 'timp_munca',
    penalty: 'Amendă de la 10.000 lei la 20.000 lei',
    frequency: 'permanent',
    description: 'Durata normală a timpului de muncă este de 8 ore pe zi și de 40 de ore pe săptămână.'
  },
  {
    id: 'TM-002',
    requirement: 'Acordarea repausului săptămânal de minimum 48 ore consecutive',
    legalBasis: 'Legea 53/2003, art. 135',
    category: 'timp_munca',
    penalty: 'Amendă de la 1.500 lei la 3.000 lei',
    frequency: 'permanent',
    description: 'Salariații au dreptul la repaus săptămânal de minimum 48 de ore consecutive, care, de regulă, include duminica.'
  },
  {
    id: 'TM-003',
    requirement: 'Evidența orelor suplimentare și plata majorării salariale',
    legalBasis: 'Legea 53/2003, art. 120',
    category: 'timp_munca',
    penalty: 'Amendă de la 1.500 lei la 3.000 lei',
    frequency: 'lunar',
    description: 'Munca prestată peste durata normală a timpului de muncă constituie muncă suplimentară și se compensează prin ore libere plătite în următoarele 60 de zile sau prin plată cu spor de 75%.'
  },
  {
    id: 'CO-001',
    requirement: 'Acordarea concediului de odihnă anual de minimum 20 zile lucrătoare',
    legalBasis: 'Legea 53/2003, art. 145',
    category: 'concediu',
    penalty: 'Amendă de la 10.000 lei la 20.000 lei',
    frequency: 'anual',
    description: 'Salariații au dreptul, în fiecare an, la un concediu de odihnă plătit, care nu poate fi mai mic de 20 de zile lucrătoare.'
  },
  {
    id: 'CO-002',
    requirement: 'Întocmirea programării concediilor de odihnă până la 31 ianuarie',
    legalBasis: 'Legea 53/2003, art. 150',
    category: 'concediu',
    penalty: 'Amendă de la 1.500 lei la 3.000 lei',
    frequency: 'anual',
    description: 'Programarea anuală a concediilor de odihnă se stabilește de către angajator, cu consultarea sindicatului sau a reprezentanților salariaților.'
  },
  {
    id: 'CO-003',
    requirement: 'Acordarea concediului medical pe bază de certificat medical',
    legalBasis: 'Legea 53/2003, art. 157',
    category: 'concediu',
    penalty: 'Amendă de la 5.000 lei la 10.000 lei',
    frequency: 'la_cerere',
    description: 'În cazul incapacității temporare de muncă, salariatul are dreptul la concediu medical plătit, în condițiile legii.'
  },
  {
    id: 'SAL-001',
    requirement: 'Plata salariului minim brut pe țară garantat',
    legalBasis: 'Legea 53/2003, art. 164',
    category: 'salariu',
    penalty: 'Amendă de la 10.000 lei la 20.000 lei',
    frequency: 'lunar',
    description: 'Salariul de bază nu poate fi mai mic decât salariul de bază minim brut pe țară garantat în plată.'
  },
  {
    id: 'SAL-002',
    requirement: 'Plata salariului lunar, la termenul stabilit în contractul colectiv sau individual',
    legalBasis: 'Legea 53/2003, art. 166',
    category: 'salariu',
    penalty: 'Amendă de la 5.000 lei la 10.000 lei + daune moratorii 75%',
    frequency: 'lunar',
    description: 'Salariul se plătește în bani, lunar, în una sau mai multe tranșe, la termenele prevăzute în contractul individual sau colectiv de muncă.'
  },
  {
    id: 'SAL-003',
    requirement: 'Întocmirea și eliberarea fluturașului de salariu',
    legalBasis: 'Legea 53/2003, art. 169',
    category: 'salariu',
    penalty: 'Amendă de la 1.500 lei la 3.000 lei',
    frequency: 'lunar',
    description: 'La plata salariului, angajatorul are obligația să înmâneze fiecărui salariat un fluturaș care să cuprindă defalcarea salariului.'
  },
  {
    id: 'SAL-004',
    requirement: 'Plata salariilor aferente zilelor de sărbători legale',
    legalBasis: 'Legea 53/2003, art. 139',
    category: 'salariu',
    penalty: 'Amendă de la 5.000 lei la 10.000 lei',
    frequency: 'la_cerere',
    description: 'Zilele de sărbătoare legală în care nu se lucrează sunt declarate zile libere și se plătesc de către angajator.'
  },
  {
    id: 'DISC-001',
    requirement: 'Asigurarea egalității de șanse și tratament între salariați',
    legalBasis: 'Legea 53/2003, art. 5',
    category: 'discriminare',
    penalty: 'Amendă de la 2.000 lei la 4.000 lei + daune morale',
    frequency: 'permanent',
    description: 'Orice discriminare directă sau indirectă față de un salariat, bazată pe criterii de sex, orientare sexuală, caracteristici genetice, vârstă, apartenență națională, rasă, culoare, etnie, religie, opțiune politică, origine socială, handicap, situație sau responsabilitate familială, apartenență ori activitate sindicală, este interzisă.'
  },
  {
    id: 'DISC-002',
    requirement: 'Interzicerea hărțuirii morale și sexuale la locul de muncă',
    legalBasis: 'Legea 53/2003, art. 6',
    category: 'discriminare',
    penalty: 'Amendă de la 5.000 lei la 10.000 lei + daune morale',
    frequency: 'permanent',
    description: 'Hărțuirea este interzisă și poate constitui discriminare atunci când este legată de unul dintre criteriile prevăzute la art. 5.'
  },
  {
    id: 'SSM-001',
    requirement: 'Asigurarea condițiilor de securitate și sănătate în muncă',
    legalBasis: 'Legea 53/2003, art. 175',
    category: 'sanatate_securitate',
    penalty: 'Amendă de la 10.000 lei la 20.000 lei',
    frequency: 'permanent',
    description: 'Angajatorul are obligația să asigure securitatea și sănătatea lucrătorilor în toate aspectele legate de muncă.'
  },
  {
    id: 'DOC-001',
    requirement: 'Întocmirea și păstrarea registrului general de evidență a salariaților',
    legalBasis: 'Legea 53/2003, art. 40',
    category: 'documente',
    penalty: 'Amendă de la 5.000 lei la 8.000 lei',
    frequency: 'permanent',
    description: 'Angajatorul are obligația de a ține un registru de evidență a salariaților, în care sunt trecute toate mențiunile obligatorii prevăzute de lege.'
  },
  {
    id: 'DOC-002',
    requirement: 'Păstrarea documentelor de muncă ale angajaților',
    legalBasis: 'Legea 53/2003, art. 39',
    category: 'documente',
    penalty: 'Amendă de la 1.500 lei la 3.000 lei',
    frequency: 'permanent',
    description: 'Angajatorul are obligația să păstreze contractele individuale de muncă, registrul și toate documentele care atestă perioada de muncă și salariile încasate.'
  },
  {
    id: 'DOC-003',
    requirement: 'Eliberarea adeverinței la cererea salariatului',
    legalBasis: 'Legea 53/2003, art. 41',
    category: 'documente',
    penalty: 'Amendă de la 1.500 lei la 3.000 lei',
    frequency: 'la_cerere',
    description: 'La cererea persoanei încadrate în muncă, angajatorul are obligația de a elibera un document care să ateste activitatea desfășurată, durata activității și salariul.'
  },
  {
    id: 'CIM-003',
    requirement: 'Informarea salariatului despre modificările contractului individual de muncă',
    legalBasis: 'Legea 53/2003, art. 17',
    category: 'contract',
    penalty: 'Amendă de la 1.500 lei la 3.000 lei',
    frequency: 'la_cerere',
    description: 'Orice modificare a unuia dintre elementele contractului individual de muncă impune încheierea unui act adițional, în formă scrisă.'
  },
  {
    id: 'CIM-004',
    requirement: 'Respectarea perioadei de probă de maximum 90 zile calendaristice',
    legalBasis: 'Legea 53/2003, art. 31',
    category: 'contract',
    penalty: 'Amendă de la 1.500 lei la 3.000 lei',
    frequency: 'la_angajare',
    description: 'La încheierea contractului individual de muncă se poate stabili o perioadă de probă de maximum 90 de zile calendaristice pentru funcțiile de execuție și de 120 de zile calendaristice pentru funcțiile de conducere.'
  }
];

/**
 * Helper function to get requirements by category
 */
export function getRequirementsByCategory(category: LaborLawCategory): LaborLawRequirement[] {
  return laborLawRequirements.filter(req => req.category === category);
}

/**
 * Helper function to get requirements by frequency
 */
export function getRequirementsByFrequency(frequency: CheckFrequency): LaborLawRequirement[] {
  return laborLawRequirements.filter(req => req.frequency === frequency);
}

/**
 * Helper function to get requirement by ID
 */
export function getRequirementById(id: string): LaborLawRequirement | undefined {
  return laborLawRequirements.find(req => req.id === id);
}

/**
 * Get all unique categories
 */
export function getAllCategories(): LaborLawCategory[] {
  return ['contract', 'timp_munca', 'concediu', 'salariu', 'discriminare', 'sanatate_securitate', 'documente'];
}

/**
 * Get category display name in Romanian
 */
export function getCategoryDisplayName(category: LaborLawCategory): string {
  const names: Record<LaborLawCategory, string> = {
    contract: 'Contract Individual de Muncă',
    timp_munca: 'Timp de Muncă',
    concediu: 'Concedii',
    salariu: 'Salarizare',
    discriminare: 'Nediscriminare',
    sanatate_securitate: 'Sănătate și Securitate în Muncă',
    documente: 'Documente și Evidențe'
  };
  return names[category];
}

/**
 * Get frequency display name in Romanian
 */
export function getFrequencyDisplayName(frequency: CheckFrequency): string {
  const names: Record<CheckFrequency, string> = {
    la_angajare: 'La angajare',
    lunar: 'Lunar',
    trimestrial: 'Trimestrial',
    anual: 'Anual',
    permanent: 'Permanent',
    la_cerere: 'La cerere'
  };
  return names[frequency];
}
