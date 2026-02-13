/**
 * Common Departments Data for Romanian Companies
 *
 * This file contains standard department structures with typical positions,
 * risks, and required trainings for SSM/PSI compliance.
 */

export interface Department {
  id: string;
  nameRO: string;
  nameEN: string;
  typicalPositions: string[];
  typicalRisks: string[];
  requiredTrainings: string[];
}

export const COMMON_DEPARTMENTS: Department[] = [
  {
    id: 'productie',
    nameRO: 'Producție',
    nameEN: 'Production',
    typicalPositions: [
      'Șef secție producție',
      'Inginer de producție',
      'Maistru',
      'Operator mașini CNC',
      'Muncitor productie',
      'Lăcătuș',
      'Sudor',
      'Stivuitorist'
    ],
    typicalRisks: [
      'Zgomot și vibrații',
      'Manevrare greutăți',
      'Lucru la înălțime',
      'Utilaje în mișcare',
      'Substanțe chimice periculoase',
      'Suprasolicitare fizică',
      'Risc de electrocutare',
      'Risc de incendiu'
    ],
    requiredTrainings: [
      'Instructaj SSM general',
      'Instructaj la locul de muncă',
      'Lucru la înălțime',
      'Utilaje și echipamente de lucru',
      'Stivuitor',
      'PSI',
      'Prim ajutor'
    ]
  },
  {
    id: 'administrativ',
    nameRO: 'Administrativ',
    nameEN: 'Administrative',
    typicalPositions: [
      'Director general',
      'Director executiv',
      'Secretar',
      'Asistent manager',
      'Receptioner',
      'Arhivar',
      'Referent'
    ],
    typicalRisks: [
      'Muncă la calculator peste 4h/zi',
      'Efort vizual prelungit',
      'Poziție șezândă prelungită',
      'Stres organizational',
      'Iluminat inadecvat',
      'Ergonomie necorespunzătoare'
    ],
    requiredTrainings: [
      'Instructaj SSM general',
      'Instructaj la locul de muncă',
      'PSI',
      'Ergonomie la birou',
      'Prim ajutor'
    ]
  },
  {
    id: 'logistica',
    nameRO: 'Logistică',
    nameEN: 'Logistics',
    typicalPositions: [
      'Manager logistică',
      'Coordonator depozit',
      'Magaziner',
      'Gestionar',
      'Stivuitorist',
      'Șofer',
      'Operator depozit',
      'Picker'
    ],
    typicalRisks: [
      'Manevrare greutăți',
      'Utilaje de ridicat și transport',
      'Căi de circulație aglomerate',
      'Risc de accidente cu stivuitoare',
      'Căderi de obiecte din înălțime',
      'Suprasolicitare fizică',
      'Temperaturi extreme (depozite frigorifice)'
    ],
    requiredTrainings: [
      'Instructaj SSM general',
      'Instructaj la locul de muncă',
      'Stivuitor',
      'Manevrare manuală greutăți',
      'PSI',
      'Prim ajutor'
    ]
  },
  {
    id: 'vanzari',
    nameRO: 'Vânzări',
    nameEN: 'Sales',
    typicalPositions: [
      'Director vânzări',
      'Manager vânzări',
      'Agent vânzări',
      'Reprezentant comercial',
      'Key account manager',
      'Consultant vânzări',
      'Vânzător'
    ],
    typicalRisks: [
      'Stres profesional',
      'Deplasări frecvente',
      'Risc rutier',
      'Muncă la calculator',
      'Efort vizual',
      'Program prelungit',
      'Sedentarism'
    ],
    requiredTrainings: [
      'Instructaj SSM general',
      'Instructaj la locul de muncă',
      'PSI',
      'Conducere defensivă',
      'Prim ajutor'
    ]
  },
  {
    id: 'it',
    nameRO: 'IT',
    nameEN: 'IT',
    typicalPositions: [
      'Director IT',
      'Manager IT',
      'Programator',
      'Analist',
      'Administrator rețea',
      'Developer',
      'Specialist suport tehnic',
      'DevOps Engineer'
    ],
    typicalRisks: [
      'Muncă prelungită la calculator',
      'Efort vizual intens',
      'Poziție șezândă prelungită',
      'Risc de electrocutare',
      'Stres informațional',
      'Sindrom tunel carpian',
      'Tulburări musculo-scheletale'
    ],
    requiredTrainings: [
      'Instructaj SSM general',
      'Instructaj la locul de muncă',
      'PSI',
      'Ergonomie la birou',
      'Prevenirea oboselii vizuale',
      'Prim ajutor'
    ]
  },
  {
    id: 'hr',
    nameRO: 'Resurse Umane',
    nameEN: 'Human Resources',
    typicalPositions: [
      'Director HR',
      'Manager HR',
      'Specialist recrutare',
      'Specialist training',
      'Specialist payroll',
      'HR Generalist',
      'Officer recrutare'
    ],
    typicalRisks: [
      'Muncă la calculator',
      'Stres emotional',
      'Poziție șezândă prelungită',
      'Efort vizual',
      'Confidențialitate date',
      'Presiune termine'
    ],
    requiredTrainings: [
      'Instructaj SSM general',
      'Instructaj la locul de muncă',
      'PSI',
      'GDPR și confidențialitate',
      'Ergonomie',
      'Prim ajutor'
    ]
  },
  {
    id: 'financiar',
    nameRO: 'Financiar-Contabilitate',
    nameEN: 'Finance-Accounting',
    typicalPositions: [
      'Director financiar',
      'Manager financiar',
      'Contabil șef',
      'Contabil',
      'Analist financiar',
      'Specialist buget',
      'Casier',
      'Controller'
    ],
    typicalRisks: [
      'Muncă intensă la calculator',
      'Efort vizual prelungit',
      'Stres termenelor',
      'Poziție șezândă',
      'Confidențialitate date financiare',
      'Presiune psihică'
    ],
    requiredTrainings: [
      'Instructaj SSM general',
      'Instructaj la locul de muncă',
      'PSI',
      'Ergonomie la birou',
      'Prim ajutor'
    ]
  },
  {
    id: 'mentenanta',
    nameRO: 'Mentenanță',
    nameEN: 'Maintenance',
    typicalPositions: [
      'Șef mentenanță',
      'Inginer mentenanță',
      'Electrician',
      'Mecanic',
      'Instalator',
      'Tehnician mentenanță',
      'Sudor',
      'Lăcătuș mecanic'
    ],
    typicalRisks: [
      'Risc de electrocutare',
      'Lucru la înălțime',
      'Spații înguste',
      'Utilaje în funcționare',
      'Substanțe chimice',
      'Temperaturi extreme',
      'Zgomot intens',
      'Risc de incendiu/explozie'
    ],
    requiredTrainings: [
      'Instructaj SSM general',
      'Instructaj la locul de muncă',
      'Autorizație electrician',
      'Lucru la înălțime',
      'Spații confinate',
      'Sudură',
      'PSI',
      'Prim ajutor'
    ]
  },
  {
    id: 'calitate',
    nameRO: 'Calitate',
    nameEN: 'Quality',
    typicalPositions: [
      'Manager calitate',
      'Inginer calitate',
      'Auditor calitate',
      'Inspector calitate',
      'Specialist QA/QC',
      'Tehnician control calitate',
      'Responsabil ISO'
    ],
    typicalRisks: [
      'Muncă la calculator',
      'Deplasări în producție',
      'Efort vizual (inspecții)',
      'Expunere la riscurile din producție',
      'Poziție în picioare prelungită',
      'Stres procedural'
    ],
    requiredTrainings: [
      'Instructaj SSM general',
      'Instructaj la locul de muncă',
      'Audituri și inspecții',
      'Sisteme de management',
      'PSI',
      'Prim ajutor'
    ]
  },
  {
    id: 'achizitii',
    nameRO: 'Achiziții',
    nameEN: 'Procurement',
    typicalPositions: [
      'Manager achiziții',
      'Specialist achiziții',
      'Buyer',
      'Procurement officer',
      'Specialist aprovizionare',
      'Coordonator furnizori'
    ],
    typicalRisks: [
      'Muncă la calculator',
      'Efort vizual',
      'Poziție șezândă prelungită',
      'Stres negocieri',
      'Deplasări la furnizori',
      'Presiune termine'
    ],
    requiredTrainings: [
      'Instructaj SSM general',
      'Instructaj la locul de muncă',
      'PSI',
      'Ergonomie la birou',
      'Prim ajutor'
    ]
  },
  {
    id: 'marketing',
    nameRO: 'Marketing',
    nameEN: 'Marketing',
    typicalPositions: [
      'Director marketing',
      'Manager marketing',
      'Specialist marketing digital',
      'Content creator',
      'Social media manager',
      'Graphic designer',
      'Specialist comunicare'
    ],
    typicalRisks: [
      'Muncă prelungită la calculator',
      'Efort vizual intens',
      'Poziție șezândă',
      'Stres creative deadlines',
      'Activități outdoor (evenimente)',
      'Iluminat necorespunzător'
    ],
    requiredTrainings: [
      'Instructaj SSM general',
      'Instructaj la locul de muncă',
      'PSI',
      'Ergonomie la birou',
      'Prim ajutor'
    ]
  },
  {
    id: 'cercetare-dezvoltare',
    nameRO: 'Cercetare-Dezvoltare',
    nameEN: 'Research & Development',
    typicalPositions: [
      'Director R&D',
      'Inginer dezvoltare produs',
      'Cercetător',
      'Tehnician laborator',
      'Designer produs',
      'Inginer proiect',
      'Specialist inovare'
    ],
    typicalRisks: [
      'Substanțe chimice periculoase',
      'Echipamente de laborator',
      'Risc de explozie/incendiu',
      'Radiații (în funcție de domeniu)',
      'Muncă la calculator',
      'Efort vizual intens',
      'Prototipuri instabile'
    ],
    requiredTrainings: [
      'Instructaj SSM general',
      'Instructaj la locul de muncă',
      'Manipulare substanțe chimice',
      'Echipamente de laborator',
      'PSI',
      'Prim ajutor',
      'Gestionare deșeuri periculoase'
    ]
  },
  {
    id: 'juridic',
    nameRO: 'Juridic',
    nameEN: 'Legal',
    typicalPositions: [
      'Director juridic',
      'Consilier juridic',
      'Avocat',
      'Specialist contracte',
      'Paralegal',
      'Compliance officer'
    ],
    typicalRisks: [
      'Muncă intensă la calculator',
      'Efort vizual prelungit',
      'Stres litigii',
      'Poziție șezândă',
      'Confidențialitate informații',
      'Presiune psihică',
      'Program prelungit'
    ],
    requiredTrainings: [
      'Instructaj SSM general',
      'Instructaj la locul de muncă',
      'PSI',
      'Confidențialitate și GDPR',
      'Ergonomie',
      'Prim ajutor'
    ]
  },
  {
    id: 'customer-service',
    nameRO: 'Servicii Clienți',
    nameEN: 'Customer Service',
    typicalPositions: [
      'Manager customer service',
      'Supervisor call center',
      'Agent customer service',
      'Operator call center',
      'Specialist relații clienți',
      'Technical support'
    ],
    typicalRisks: [
      'Muncă la calculator',
      'Headset prelungit',
      'Efort vocal',
      'Stres clienți dificili',
      'Poziție șezândă prelungită',
      'Monotonie task-uri',
      'Presiune KPI-uri'
    ],
    requiredTrainings: [
      'Instructaj SSM general',
      'Instructaj la locul de muncă',
      'PSI',
      'Ergonomie la birou',
      'Gestionare stres',
      'Prim ajutor'
    ]
  },
  {
    id: 'securitate',
    nameRO: 'Securitate și Pază',
    nameEN: 'Security',
    typicalPositions: [
      'Șef securitate',
      'Agent de securitate',
      'Paznic',
      'Operator supraveghere video',
      'Portar',
      'Bodyguard'
    ],
    typicalRisks: [
      'Poziție în picioare prelungită',
      'Program de noapte',
      'Agresiuni fizice',
      'Stres situații periculoase',
      'Condiții meteo extreme',
      'Izolare socială',
      'Supraveghere video prelungită'
    ],
    requiredTrainings: [
      'Instructaj SSM general',
      'Instructaj la locul de muncă',
      'PSI',
      'Intervenție situații critice',
      'Prim ajutor',
      'Autoapărare',
      'Legislație securitate'
    ]
  },
  {
    id: 'curatenie',
    nameRO: 'Curățenie',
    nameEN: 'Cleaning',
    typicalPositions: [
      'Supervizor curățenie',
      'Îngrijitor',
      'Muncitor curățenie',
      'Operator curățenie industrială',
      'Tehnician igienizare'
    ],
    typicalRisks: [
      'Substanțe chimice de curățare',
      'Suprasolicitare fizică',
      'Poziții forțate',
      'Alunecare/cădere pe suprafețe umede',
      'Lucru la înălțime (ferestre)',
      'Alergeni',
      'Contactul cu agenți biologici'
    ],
    requiredTrainings: [
      'Instructaj SSM general',
      'Instructaj la locul de muncă',
      'Manipulare substanțe chimice',
      'Lucru la înălțime',
      'PSI',
      'Prim ajutor',
      'Echipamente de protecție'
    ]
  },
  {
    id: 'ssm-psi',
    nameRO: 'SSM și PSI',
    nameEN: 'Health & Safety',
    typicalPositions: [
      'Responsabil SSM',
      'Inspector SSM',
      'Tehnician SSM',
      'Responsabil PSI',
      'Pompier',
      'Coordonator situații de urgență'
    ],
    typicalRisks: [
      'Deplasări în toate zonele de risc',
      'Expunere la riscuri diverse',
      'Stres organizațional',
      'Responsabilitate mare',
      'Muncă la calculator',
      'Inspecții în zone periculoase'
    ],
    requiredTrainings: [
      'Instructaj SSM general',
      'Instructaj la locul de muncă',
      'Certificare consultant SSM',
      'PSI avansat',
      'Auditor SSM',
      'Legislație SSM',
      'Prim ajutor instructor',
      'Investigare accidente'
    ]
  },
  {
    id: 'transport',
    nameRO: 'Transport',
    nameEN: 'Transportation',
    typicalPositions: [
      'Manager transport',
      'Dispecer transport',
      'Șofer transport marfă',
      'Șofer transport persoane',
      'Curier',
      'Mecanic auto',
      'Planificator transport'
    ],
    typicalRisks: [
      'Risc rutier major',
      'Oboseală la volan',
      'Poziție șezândă prelungită',
      'Vibrații',
      'Manipulare mărfuri',
      'Condiții meteo adverse',
      'Stres trafic',
      'Program neregulat'
    ],
    requiredTrainings: [
      'Instructaj SSM general',
      'Instructaj la locul de muncă',
      'Conducere defensivă',
      'ADR (transport mărfuri periculoase)',
      'Tahograf digital',
      'PSI',
      'Prim ajutor'
    ]
  },
  {
    id: 'restaurant-cantina',
    nameRO: 'Restaurant/Cantină',
    nameEN: 'Restaurant/Canteen',
    typicalPositions: [
      'Manager restaurant',
      'Bucătar șef',
      'Bucătar',
      'Ajutor bucătar',
      'Ospătar',
      'Barman',
      'Spălător vase',
      'Magaziner alimentar'
    ],
    typicalRisks: [
      'Tăieturi și înțepături',
      'Arsuri',
      'Suprafețe alunecoase',
      'Temperaturi extreme',
      'Manipulare greutăți',
      'Poziție în picioare prelungită',
      'Risc biologic (alimente)',
      'Echipamente de gătit'
    ],
    requiredTrainings: [
      'Instructaj SSM general',
      'Instructaj la locul de muncă',
      'HACCP',
      'Igienă alimentară',
      'Manipulare echipamente bucătărie',
      'PSI',
      'Prim ajutor'
    ]
  },
  {
    id: 'mediu',
    nameRO: 'Mediu',
    nameEN: 'Environment',
    typicalPositions: [
      'Manager mediu',
      'Inginer mediu',
      'Specialist protecția mediului',
      'Tehnician monitorizare mediu',
      'Auditor mediu',
      'Responsabil deșeuri'
    ],
    typicalRisks: [
      'Expunere substanțe periculoase',
      'Agenți biologici',
      'Deplasări teren',
      'Echipamente de măsurare',
      'Muncă la calculator',
      'Prelevare probe',
      'Zone contaminate'
    ],
    requiredTrainings: [
      'Instructaj SSM general',
      'Instructaj la locul de muncă',
      'Manipulare substanțe periculoase',
      'Gestionare deșeuri',
      'Legislație mediu',
      'Echipamente de protecție',
      'PSI',
      'Prim ajutor'
    ]
  }
];

/**
 * Get department by ID
 */
export function getDepartmentById(id: string): Department | undefined {
  return COMMON_DEPARTMENTS.find(dept => dept.id === id);
}

/**
 * Get all department IDs
 */
export function getAllDepartmentIds(): string[] {
  return COMMON_DEPARTMENTS.map(dept => dept.id);
}

/**
 * Get all department names in Romanian
 */
export function getAllDepartmentNamesRO(): string[] {
  return COMMON_DEPARTMENTS.map(dept => dept.nameRO);
}

/**
 * Search departments by name (RO or EN)
 */
export function searchDepartments(query: string): Department[] {
  const lowerQuery = query.toLowerCase();
  return COMMON_DEPARTMENTS.filter(
    dept =>
      dept.nameRO.toLowerCase().includes(lowerQuery) ||
      dept.nameEN.toLowerCase().includes(lowerQuery)
  );
}
