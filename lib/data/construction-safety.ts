/**
 * Construction Safety Requirements (HG 300/2006)
 * Cerințe SSM pentru șantiere de construcții
 */

export interface ConstructionSafetyRequirement {
  id: string;
  category: string;
  title: string;
  description: string;
  legalBasis: string;
  mandatory: boolean;
  verificationMethod: string;
  responsibleRole: string;
  documentationRequired: string[];
  penalties?: string;
}

export const CONSTRUCTION_SAFETY_CATEGORIES = {
  PLANNING: 'Planificare și documentație',
  COORDINATION: 'Coordonare SSM',
  SITE_SETUP: 'Amenajarea șantierului',
  EXCAVATION: 'Lucrări de săpătură',
  FORMWORK: 'Lucrări de cofrare',
  CONCRETE: 'Lucrări de turnare beton',
  SIGNAGE: 'Semnalizare și avertizare',
} as const;

export const constructionSafetyRequirements: ConstructionSafetyRequirement[] = [
  // PLANIFICARE ȘI DOCUMENTAȚIE
  {
    id: 'const-001',
    category: CONSTRUCTION_SAFETY_CATEGORIES.PLANNING,
    title: 'Plan de securitate și sănătate (PSS)',
    description: 'Elaborarea planului de securitate și sănătate pentru șantier înainte de începerea lucrărilor. PSS trebuie să conțină: identificarea riscurilor, măsuri de prevenire, proceduri de urgență, organizarea asistenței medicale, norme de igienă.',
    legalBasis: 'HG 300/2006, art. 19',
    mandatory: true,
    verificationMethod: 'Verificare document PSS aprobat și semnat',
    responsibleRole: 'Coordonator SSM / Diriginte șantier',
    documentationRequired: [
      'Plan de securitate și sănătate aprobat',
      'Aviz ITM (pentru lucrări speciale)',
      'Fișe de evaluare a riscurilor',
    ],
    penalties: 'Amendă 10.000 - 30.000 lei',
  },
  {
    id: 'const-002',
    category: CONSTRUCTION_SAFETY_CATEGORIES.PLANNING,
    title: 'Notificare prealabilă la ITM',
    description: 'Întocmirea și transmiterea notificării prealabile la Inspectoratul Teritorial de Muncă cu minimum 15 zile înainte de începerea lucrărilor, pentru șantierele care îndeplinesc criteriile: durată peste 30 zile + min 20 lucrători SAU volum peste 500 om-zile.',
    legalBasis: 'HG 300/2006, art. 7',
    mandatory: true,
    verificationMethod: 'Verificare dovadă transmitere notificare + confirmare primire ITM',
    responsibleRole: 'Antreprenor / Beneficiar',
    documentationRequired: [
      'Notificare prealabilă (formular tip)',
      'Dovadă transmitere la ITM',
      'Confirmare primire de la ITM',
    ],
    penalties: 'Amendă 5.000 - 10.000 lei',
  },
  {
    id: 'const-003',
    category: CONSTRUCTION_SAFETY_CATEGORIES.PLANNING,
    title: 'Proiect de organizare a șantierului',
    description: 'Elaborarea proiectului de organizare a șantierului (POS) care trebuie să cuprindă: amplasarea instalațiilor, căile de acces și circulație, zonele de depozitare, racordurile la utilități, semnalizarea.',
    legalBasis: 'HG 300/2006, art. 18',
    mandatory: true,
    verificationMethod: 'Verificare proiect POS aprobat de proiectant și beneficiar',
    responsibleRole: 'Proiectant / Diriginte șantier',
    documentationRequired: [
      'Proiect de organizare a șantierului',
      'Plan de situație cu amplasamente',
      'Avize și acorduri necesare',
    ],
  },

  // COORDONARE SSM
  {
    id: 'const-004',
    category: CONSTRUCTION_SAFETY_CATEGORIES.COORDINATION,
    title: 'Desemnare coordonator SSM în faza de proiect',
    description: 'Beneficiarul trebuie să desemneze unul sau mai mulți coordonatori SSM pentru faza de elaborare a proiectului, care au calificare și atestat conform legii.',
    legalBasis: 'HG 300/2006, art. 10-11',
    mandatory: true,
    verificationMethod: 'Verificare contract coordonator SSM + atestat valabil',
    responsibleRole: 'Beneficiar',
    documentationRequired: [
      'Contract de coordonare SSM',
      'Atestat coordonator SSM valabil',
      'Plan de coordonare SSM',
    ],
    penalties: 'Amendă 20.000 - 50.000 lei',
  },
  {
    id: 'const-005',
    category: CONSTRUCTION_SAFETY_CATEGORIES.COORDINATION,
    title: 'Desemnare coordonator SSM în faza de execuție',
    description: 'Beneficiarul trebuie să desemneze unul sau mai mulți coordonatori SSM pentru faza de execuție a lucrărilor, care au calificare și atestat conform legii.',
    legalBasis: 'HG 300/2006, art. 10-11',
    mandatory: true,
    verificationMethod: 'Verificare contract coordonator SSM execuție + atestat valabil',
    responsibleRole: 'Beneficiar',
    documentationRequired: [
      'Contract de coordonare SSM execuție',
      'Atestat coordonator SSM valabil',
      'Registru de coordonare',
    ],
    penalties: 'Amendă 20.000 - 50.000 lei',
  },
  {
    id: 'const-006',
    category: CONSTRUCTION_SAFETY_CATEGORIES.COORDINATION,
    title: 'Registru de coordonare SSM',
    description: 'Ținerea registrului de coordonare a activităților de securitate și sănătate pe șantier. Coordonatorul SSM consemnează controalele efectuate, neconformitățile, măsurile dispuse și termenele de remediere.',
    legalBasis: 'HG 300/2006, art. 15',
    mandatory: true,
    verificationMethod: 'Verificare registru completat la zi cu semnături',
    responsibleRole: 'Coordonator SSM',
    documentationRequired: [
      'Registru de coordonare SSM',
      'Procese-verbale de verificare',
      'Dispoziții de remediere',
    ],
  },
  {
    id: 'const-007',
    category: CONSTRUCTION_SAFETY_CATEGORIES.COORDINATION,
    title: 'Instructaj SSM specific șantier',
    description: 'Asigurarea instruirii tuturor lucrătorilor privind riscurile specifice șantierului, măsurile de prevenire și protecție, procedurile de urgență. Instructajul trebuie consemnat în fișe individuale semnate.',
    legalBasis: 'HG 300/2006, art. 22',
    mandatory: true,
    verificationMethod: 'Verificare fișe instructaj SSM semnate de lucrători',
    responsibleRole: 'Responsabil SSM / Șef șantier',
    documentationRequired: [
      'Fișe de instructaj SSM',
      'Proces-verbal instructaj',
      'Listă participanți',
    ],
    penalties: 'Amendă 3.000 - 5.000 lei',
  },

  // AMENAJAREA ȘANTIERULUI
  {
    id: 'const-008',
    category: CONSTRUCTION_SAFETY_CATEGORIES.SITE_SETUP,
    title: 'Împrejmuirea șantierului',
    description: 'Delimitarea și împrejmuirea perimetrului șantierului cu gard sau plasă rezistentă, cu înălțime minimum 2 metri, pentru a preveni accesul persoanelor neautorizate și protejarea trecătorilor.',
    legalBasis: 'HG 300/2006, anexa 3, pct. 1.1',
    mandatory: true,
    verificationMethod: 'Inspecție vizuală împrejmuire completă și solidă',
    responsibleRole: 'Antreprenor / Șef șantier',
    documentationRequired: [
      'Plan de amplasare împrejmuire',
      'Verificare tehnică împrejmuire',
    ],
  },
  {
    id: 'const-009',
    category: CONSTRUCTION_SAFETY_CATEGORIES.SITE_SETUP,
    title: 'Acces controlat pe șantier',
    description: 'Organizarea intrării/ieșirii pe șantier printr-un singur punct de acces controlat. Montarea panoului de identificare a șantierului cu date complete: denumire lucrare, beneficiar, antreprenor, coordonator SSM, perioada de execuție.',
    legalBasis: 'HG 300/2006, anexa 3, pct. 1.2',
    mandatory: true,
    verificationMethod: 'Verificare punct acces funcțional + panou informativ complet',
    responsibleRole: 'Antreprenor / Șef șantier',
    documentationRequired: [
      'Panou identificare șantier',
      'Registru acces șantier',
    ],
  },
  {
    id: 'const-010',
    category: CONSTRUCTION_SAFETY_CATEGORIES.SITE_SETUP,
    title: 'Santinelă permanentă (pentru șantiere în localități)',
    description: 'Asigurarea unui santinelă permanent pe șantierele organizate în localități, cu rol de supraveghere, control acces, intervenție în caz de urgență. Santinela trebuie instruit SSM și prim ajutor.',
    legalBasis: 'HG 300/2006, anexa 3, pct. 1.3',
    mandatory: true,
    verificationMethod: 'Verificare prezență santinelă + fișă post + instructaj',
    responsibleRole: 'Antreprenor / Șef șantier',
    documentationRequired: [
      'Fișa postului santinelă',
      'Program santinelă',
      'Fișe instructaj SSM santinelă',
    ],
  },
  {
    id: 'const-011',
    category: CONSTRUCTION_SAFETY_CATEGORIES.SITE_SETUP,
    title: 'Amenajarea căilor de circulație pe șantier',
    description: 'Organizarea căilor de circulație pentru personal și utilaje, cu lățimi suficiente, suprafețe plane și drenate, semnalizate corespunzător. Separarea circulației pietonale de cea auto.',
    legalBasis: 'HG 300/2006, anexa 3, pct. 1.4',
    mandatory: true,
    verificationMethod: 'Inspecție vizuală căi circulație + semnalizare',
    responsibleRole: 'Șef șantier',
    documentationRequired: [
      'Plan de circulație șantier',
      'Marcaje și semnalizare',
    ],
  },
  {
    id: 'const-012',
    category: CONSTRUCTION_SAFETY_CATEGORIES.SITE_SETUP,
    title: 'Dotări sociale pe șantier (vestiare, grupuri sanitare)',
    description: 'Amenajarea spațiilor pentru vestiare, grupuri sanitare, spălători, având în vedere numărul de lucrători și durata lucrărilor. Minim: 1 WC la 25 lucrători, 1 lavoar la 10 lucrători, spațiu depozitare echipament.',
    legalBasis: 'HG 300/2006, anexa 3, pct. 2',
    mandatory: true,
    verificationMethod: 'Verificare amenajări sociale funcționale + curățenie',
    responsibleRole: 'Antreprenor',
    documentationRequired: [
      'Plan amplasare dotări sociale',
      'Verificări sanitare',
    ],
  },
  {
    id: 'const-013',
    category: CONSTRUCTION_SAFETY_CATEGORIES.SITE_SETUP,
    title: 'Iluminat suficient pe șantier',
    description: 'Asigurarea iluminatului natural și artificial suficient în toate zonele de lucru, căi de acces, depozite. Minim 200 lux în zonele de lucru, 50 lux pe căile de circulație.',
    legalBasis: 'HG 300/2006, anexa 3, pct. 3',
    mandatory: true,
    verificationMethod: 'Verificare funcționare iluminat + măsurători luxmetru',
    responsibleRole: 'Șef șantier / Electrician autorizat',
    documentationRequired: [
      'Plan iluminat șantier',
      'Verificări instalații electrice',
    ],
  },

  // SEMNALIZARE ȘI AVERTIZARE
  {
    id: 'const-014',
    category: CONSTRUCTION_SAFETY_CATEGORIES.SIGNAGE,
    title: 'Semnalizare de securitate pe șantier',
    description: 'Montarea panourilor de semnalizare de securitate: interzicere acces persoane neautorizate, obligativitate echipament protecție (cască, încălțăminte, vestă), avertizare riscuri (cădere obiecte, mașini în mișcare), indicatoare ieșire urgență.',
    legalBasis: 'HG 300/2006, anexa 4',
    mandatory: true,
    verificationMethod: 'Verificare prezență și poziționare corectă panouri',
    responsibleRole: 'Coordonator SSM / Șef șantier',
    documentationRequired: [
      'Plan de semnalizare SSM',
      'Inventar panouri semnalizare',
    ],
  },
  {
    id: 'const-015',
    category: CONSTRUCTION_SAFETY_CATEGORIES.SIGNAGE,
    title: 'Semnalizare temporară pentru trafic rutier',
    description: 'Pentru șantierele adiacente căilor publice: instalarea semnalizării rutiere temporare conform normelor în vigoare (indicatoare, conuri, bariere, lămpi de avertizare intermitente).',
    legalBasis: 'HG 300/2006, anexa 3, pct. 1.5',
    mandatory: true,
    verificationMethod: 'Verificare semnalizare rutier conform STAS 1848',
    responsibleRole: 'Antreprenor',
    documentationRequired: [
      'Aviz circulație temporară',
      'Schiță semnalizare rutieră',
    ],
  },
  {
    id: 'const-016',
    category: CONSTRUCTION_SAFETY_CATEGORIES.SIGNAGE,
    title: 'Delimitare zone periculoase',
    description: 'Delimitarea clară a zonelor periculoase (excavații, locuri de ridicare sarcini, zone bombardament demolări) prin benzi, parapeți sau garduri, cu indicatoare de avertizare.',
    legalBasis: 'HG 300/2006, anexa 3, pct. 4',
    mandatory: true,
    verificationMethod: 'Inspecție vizuală delimitări + semnalizare avertizare',
    responsibleRole: 'Șef șantier',
    documentationRequired: [
      'Plan zone periculoase',
      'Indicatoare avertizare',
    ],
  },

  // LUCRĂRI DE SĂPĂTURĂ
  {
    id: 'const-017',
    category: CONSTRUCTION_SAFETY_CATEGORIES.EXCAVATION,
    title: 'Verificarea utilităților îngropate înainte de săpare',
    description: 'Înainte de începerea săpăturilor, identificarea și marcarea tuturor utilităților subterane (gaz, electricitate, apă, canalizare, telecomunicații). Obținerea planurilor de situație de la furnizori și marcarea pe teren.',
    legalBasis: 'HG 300/2006, anexa 5, pct. 1',
    mandatory: true,
    verificationMethod: 'Verificare planuri utilități + marcaje teren + PV identificare',
    responsibleRole: 'Șef șantier / Antreprenor',
    documentationRequired: [
      'Planuri utilități subterane',
      'Proces-verbal identificare utilități',
      'Acord furnizori utilități',
    ],
    penalties: 'Amendă 10.000 - 25.000 lei + despăgubiri',
  },
  {
    id: 'const-018',
    category: CONSTRUCTION_SAFETY_CATEGORIES.EXCAVATION,
    title: 'Protejarea pereților săpăturilor (sprijiniri)',
    description: 'Pentru adâncimi mai mari de 1,25 m, asigurarea stabilității pereților săpăturilor prin taluzare naturală sau sprijiniri (blindaj metalic/lemn). Verificarea zilnică a stabilității.',
    legalBasis: 'HG 300/2006, anexa 5, pct. 2',
    mandatory: true,
    verificationMethod: 'Verificare proiect sprijiniri + inspecție zilnică stabilitate',
    responsibleRole: 'Șef șantier / Responsabil tehnic',
    documentationRequired: [
      'Proiect sprijiniri/blindaj',
      'Registru verificări zilnice',
      'Calcule stabilitate',
    ],
  },
  {
    id: 'const-019',
    category: CONSTRUCTION_SAFETY_CATEGORIES.EXCAVATION,
    title: 'Acces sigur în săpături',
    description: 'Asigurarea accesului în săpături prin scări fixe, rampe sau trepte, amplasate la distanțe de maximum 15 m. Interzicerea coborârii pe pereții săpăturii.',
    legalBasis: 'HG 300/2006, anexa 5, pct. 3',
    mandatory: true,
    verificationMethod: 'Verificare prezență scări/rampe de acces conforme',
    responsibleRole: 'Șef șantier',
    documentationRequired: [
      'Plan accesuri săpături',
    ],
  },
  {
    id: 'const-020',
    category: CONSTRUCTION_SAFETY_CATEGORIES.EXCAVATION,
    title: 'Evacuarea apelor din săpături',
    description: 'Asigurarea evacuării continue a apelor meteorice și subterane din săpături prin șanțuri de drenaj și pompe de evacuare. Verificarea zilnică a funcționării sistemului de drenaj.',
    legalBasis: 'HG 300/2006, anexa 5, pct. 4',
    mandatory: true,
    verificationMethod: 'Verificare sistem drenaj funcțional + absență ape stagnante',
    responsibleRole: 'Șef șantier',
    documentationRequired: [
      'Plan drenaj și evacuare ape',
      'Verificări funcționare pompe',
    ],
  },
  {
    id: 'const-021',
    category: CONSTRUCTION_SAFETY_CATEGORIES.EXCAVATION,
    title: 'Depozitarea materialelor pe marginea săpăturilor',
    description: 'Interzicerea depozitării materialelor, pământului excavat și circulației utilajelor grele la distanță mai mică de 0,5 m de marginea săpăturii (sau conform calculelor de stabilitate).',
    legalBasis: 'HG 300/2006, anexa 5, pct. 5',
    mandatory: true,
    verificationMethod: 'Inspecție vizuală depozitări + măsurare distanțe',
    responsibleRole: 'Șef șantier',
    documentationRequired: [
      'Plan depozitare materiale',
      'Marcaje distanțe siguranță',
    ],
  },

  // LUCRĂRI DE COFRARE
  {
    id: 'const-022',
    category: CONSTRUCTION_SAFETY_CATEGORIES.FORMWORK,
    title: 'Proiect de cofrare și verificare stabilitate',
    description: 'Realizarea cofrării conform unui proiect de cofrare care include calculele de stabilitate și rezistență. Verificarea cofrării înainte de turnarea betonului de către responsabil tehnic.',
    legalBasis: 'HG 300/2006, anexa 6, pct. 1',
    mandatory: true,
    verificationMethod: 'Verificare proiect cofrare + PV verificare stabilitate',
    responsibleRole: 'Responsabil tehnic / Șef șantier',
    documentationRequired: [
      'Proiect de cofrare aprobat',
      'Calcule stabilitate cofraje',
      'Proces-verbal verificare cofrare',
    ],
  },
  {
    id: 'const-023',
    category: CONSTRUCTION_SAFETY_CATEGORIES.FORMWORK,
    title: 'Platforme de lucru pentru cofrare la înălțime',
    description: 'Asigurarea platformelor de lucru stabile și protejate (cu balustrade) pentru lucrările de cofrare la înălțime mai mare de 2 m. Lățime minimă 60 cm, protecție la cădere pe toate laturile.',
    legalBasis: 'HG 300/2006, anexa 6, pct. 2',
    mandatory: true,
    verificationMethod: 'Verificare platforme de lucru conforme + protecții',
    responsibleRole: 'Șef șantier',
    documentationRequired: [
      'Plan de eșafodaje și platforme',
      'Verificări tehnice platforme',
    ],
  },

  // LUCRĂRI DE TURNARE BETON
  {
    id: 'const-024',
    category: CONSTRUCTION_SAFETY_CATEGORIES.CONCRETE,
    title: 'Verificare cofrare înainte de turnare beton',
    description: 'Verificarea obligatorie a cofrării, sprijinirilor și armăturii înainte de turnarea betonului. Consemnarea verificării într-un proces-verbal semnat de responsabilul tehnic și șeful de șantier.',
    legalBasis: 'HG 300/2006, anexa 6, pct. 3',
    mandatory: true,
    verificationMethod: 'Verificare PV de verificare cofrare completat și semnat',
    responsibleRole: 'Responsabil tehnic',
    documentationRequired: [
      'Proces-verbal verificare cofrare',
      'Fișe verificare armătură',
    ],
  },
  {
    id: 'const-025',
    category: CONSTRUCTION_SAFETY_CATEGORIES.CONCRETE,
    title: 'Acces sigur pentru turnarea betonului',
    description: 'Organizarea turnării betonului astfel încât lucrătorii să nu fie expuși la riscul de cădere de la înălțime sau de lovire. Utilizarea pompelor de beton sau jgheaburilor prevăzute cu platforme de lucru protejate.',
    legalBasis: 'HG 300/2006, anexa 6, pct. 4',
    mandatory: true,
    verificationMethod: 'Verificare procedură turnare + echipamente conforme',
    responsibleRole: 'Șef șantier',
    documentationRequired: [
      'Procedură de turnare beton',
      'Verificări echipamente (pompă, jgheab)',
    ],
  },
];

/**
 * Get construction safety requirements by category
 */
export function getRequirementsByCategory(category: string): ConstructionSafetyRequirement[] {
  return constructionSafetyRequirements.filter(req => req.category === category);
}

/**
 * Get mandatory construction safety requirements
 */
export function getMandatoryRequirements(): ConstructionSafetyRequirement[] {
  return constructionSafetyRequirements.filter(req => req.mandatory);
}

/**
 * Get construction safety requirement by ID
 */
export function getRequirementById(id: string): ConstructionSafetyRequirement | undefined {
  return constructionSafetyRequirements.find(req => req.id === id);
}

/**
 * Get all construction safety categories
 */
export function getAllCategories(): string[] {
  return Object.values(CONSTRUCTION_SAFETY_CATEGORIES);
}
