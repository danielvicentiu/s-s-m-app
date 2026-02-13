/**
 * Work at Height - Safety Requirements and Standards
 *
 * Cerințe SSM pentru lucrul la înălțime conform legislației românești
 * Legea 319/2006, HG 1146/2006, Normativ I7/2018
 */

export interface WorkAtHeightDefinition {
  threshold: number; // meters
  description: string;
  legalReference: string;
}

export interface EquipmentCategory {
  id: string;
  name: string;
  description: string;
  inspectionFrequency: string;
  certification: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface MedicalRequirement {
  id: string;
  requirement: string;
  frequency: string;
  contraindications: string[];
}

export interface WeatherRestriction {
  parameter: string;
  limit: string;
  severity: 'warning' | 'prohibition';
}

export interface TrainingRequirement {
  id: string;
  type: string;
  duration: string;
  renewal: string;
  mandatory: boolean;
  topics: string[];
}

export interface RescuePlanElement {
  id: string;
  element: string;
  description: string;
  responsible: string;
}

// Definiție lucru la înălțime
export const workAtHeightDefinition: WorkAtHeightDefinition = {
  threshold: 2.0,
  description: 'Lucrările la înălțime sunt definite ca activități desfășurate la o înălțime de peste 2 metri față de un nivel inferior stabil, unde există risc de cădere a persoanelor.',
  legalReference: 'HG 1146/2006 privind cerinţele minime de securitate şi sănătate pentru utilizarea în muncă de către lucrători a echipamentelor de muncă'
};

// Categorii de echipamente
export const equipmentCategories: EquipmentCategory[] = [
  {
    id: 'scaffolding',
    name: 'Schele',
    description: 'Schele metalice, schele mobile, schele suspendate pentru lucrări temporare la înălțime',
    inspectionFrequency: 'zilnic și după fiecare modificare',
    certification: [
      'Certificat de conformitate CE',
      'Manual de utilizare în limba română',
      'Plan de montaj și demontaj',
      'Proces verbal de recepție',
      'Registru de evidență și verificări'
    ],
    riskLevel: 'high'
  },
  {
    id: 'mewp',
    name: 'MEWP (Platforme Elevatoare)',
    description: 'Platforme elevatoare mobile (nacelă, braț articulat, foarfecă)',
    inspectionFrequency: 'zilnic înainte de utilizare, inspecție ISCIR anuală',
    certification: [
      'Autorizație ISCIR în termen',
      'Certificat operator ISCIR',
      'Proces verbal verificare tehnică periodică',
      'Registru de exploatare',
      'Carnet de instruit operatori'
    ],
    riskLevel: 'critical'
  },
  {
    id: 'ladders',
    name: 'Scări și Scăriți',
    description: 'Scări simple, scări transformabile, scări cu platformă',
    inspectionFrequency: 'înainte de fiecare utilizare',
    certification: [
      'Certificat de conformitate',
      'Marcaj de identificare',
      'Instructiuni de utilizare',
      'Registru de evidență'
    ],
    riskLevel: 'medium'
  },
  {
    id: 'lifelines',
    name: 'Linii de Viață',
    description: 'Sisteme de protecție împotriva căderilor - linii de viață orizontale și verticale',
    inspectionFrequency: 'anual de către persoană competentă',
    certification: [
      'Certificat de conformitate CE (EN 795)',
      'Documentație tehnică proiectare și montaj',
      'Declarație de punere în funcțiune',
      'Proces verbal inspecție periodică',
      'Registru de intervenții'
    ],
    riskLevel: 'critical'
  },
  {
    id: 'ppe_fall_protection',
    name: 'EIP Protecție Căderi',
    description: 'Ham de corp integral, cordă de siguranță, absorbant de energie, conectori',
    inspectionFrequency: 'înainte de fiecare utilizare, inspecție periodică la 12 luni',
    certification: [
      'Certificat de conformitate CE (EN 361, EN 362, EN 355)',
      'Declarație de conformitate',
      'Instrucțiuni de utilizare',
      'Fișă de evidență personală',
      'Certificat inspecție periodică'
    ],
    riskLevel: 'critical'
  },
  {
    id: 'rope_access',
    name: 'Alpinism Utilitar',
    description: 'Sisteme de acces pe frânghii pentru lucrări speciale la înălțime',
    inspectionFrequency: 'înainte de fiecare utilizare, inspecție ISCIR anuală',
    certification: [
      'Autorizație ISCIR pentru echipament ridicat',
      'Certificat IRATA/FISAT pentru lucrători',
      'Proceduri de lucru autorizate',
      'Plan de salvare și evacuare',
      'Jurnal de lucru'
    ],
    riskLevel: 'critical'
  }
];

// Instruire specifică
export const trainingRequirements: TrainingRequirement[] = [
  {
    id: 'general_height',
    type: 'Instruire SSM pentru Lucrul la Înălțime',
    duration: '8 ore (1 zi)',
    renewal: 'anual',
    mandatory: true,
    topics: [
      'Identificarea riscurilor la lucrul la înălțime',
      'Legislație SSM aplicabilă',
      'Echipamente de protecție colectivă și individuală',
      'Proceduri de lucru sigur',
      'Planuri de salvare și evacuare',
      'Studii de caz - accidente'
    ]
  },
  {
    id: 'scaffolding_assembly',
    type: 'Montator/Demontator Schele',
    duration: '40 ore (5 zile)',
    renewal: '3 ani',
    mandatory: true,
    topics: [
      'Tipuri de schele și componente',
      'Citirea planurilor de montaj',
      'Verificări de stabilitate',
      'Ancorări și consolodări',
      'Montaj/demontaj în siguranță',
      'Întocmirea PV de recepție'
    ]
  },
  {
    id: 'mewp_operator',
    type: 'Operator MEWP (ISCIR)',
    duration: '40 ore teorie + practică',
    renewal: 'examen ISCIR la 5 ani',
    mandatory: true,
    topics: [
      'Categorii și caracteristici MEWP',
      'Verificări zilnice',
      'Operare în siguranță',
      'Legislație ISCIR',
      'Situații de urgență',
      'Examen practic și teoretic'
    ]
  },
  {
    id: 'rope_access_tech',
    type: 'Tehnician Alpinism Utilitar (IRATA/FISAT)',
    duration: 'nivel 1: 40 ore, nivel 2: 80 ore, nivel 3: 120 ore',
    renewal: '3 ani',
    mandatory: true,
    topics: [
      'Tehnici de acces pe frânghii',
      'Noduri și sisteme de asigurare',
      'Manevre de salvare',
      'Inspecția echipamentelor',
      'Proceduri de urgență',
      'Certificare internațională'
    ]
  },
  {
    id: 'rescue_training',
    type: 'Instruire Salvare la Înălțime',
    duration: '16 ore (2 zile)',
    renewal: 'anual',
    mandatory: true,
    topics: [
      'Proceduri de alertare',
      'Tehnici de salvare și coborâre',
      'Prim ajutor la înălțime',
      'Utilizare echipament salvare',
      'Simulări practice',
      'Coordonarea cu serviciile de urgență'
    ]
  }
];

// EIP obligatoriu
export const mandatoryPPE = [
  {
    id: 'fall_arrest_harness',
    name: 'Ham de Siguranță Integral',
    standard: 'EN 361',
    description: 'Ham de corp integral cu puncte de atașare dorsală și sternală',
    mandatory: true,
    inspection: 'vizuală înainte de utilizare, detaliată la 12 luni'
  },
  {
    id: 'lanyard',
    name: 'Cordon de Siguranță cu Absorbant',
    standard: 'EN 355, EN 354',
    description: 'Cordon cu absorbant de energie, lungime max 2m',
    mandatory: true,
    inspection: 'vizuală înainte de utilizare, detaliată la 12 luni'
  },
  {
    id: 'connectors',
    name: 'Conectori/Carabiniere',
    standard: 'EN 362',
    description: 'Carabiniere cu închidere automată și blocare, minim 15kN',
    mandatory: true,
    inspection: 'vizuală înainte de utilizare, funcțională la 12 luni'
  },
  {
    id: 'helmet',
    name: 'Cască de Protecție',
    standard: 'EN 397 sau EN 12492',
    description: 'Cască rezistentă la impact și penetrare, cu jugulară',
    mandatory: true,
    inspection: 'vizuală înainte de utilizare'
  },
  {
    id: 'safety_footwear',
    name: 'Încălțăminte de Siguranță',
    standard: 'EN ISO 20345',
    description: 'Bocanci cu talpă antiderapantă și bombeu metalic',
    mandatory: true,
    inspection: 'starea generală, uzura tălpilor'
  },
  {
    id: 'work_gloves',
    name: 'Mănuși de Protecție',
    standard: 'EN 388',
    description: 'Mănuși rezistente la abraziune și tăiere',
    mandatory: true,
    inspection: 'starea generală, lipsa deteriorărilor'
  },
  {
    id: 'high_visibility',
    name: 'Vestă Reflectorizantă',
    standard: 'EN ISO 20471',
    description: 'Vestă de înaltă vizibilitate clasa 2 sau 3',
    mandatory: true,
    inspection: 'starea benzilor reflectorizante'
  }
];

// Restricții meteo
export const weatherRestrictions: WeatherRestriction[] = [
  {
    parameter: 'Vânt',
    limit: 'peste 40 km/h (11 m/s) - INTERZIS pentru schele mobile și MEWP',
    severity: 'prohibition'
  },
  {
    parameter: 'Vânt',
    limit: 'peste 60 km/h (17 m/s) - INTERZIS pentru toate lucrările la înălțime',
    severity: 'prohibition'
  },
  {
    parameter: 'Vizibilitate',
    limit: 'sub 30 metri (ceață densă) - INTERZIS',
    severity: 'prohibition'
  },
  {
    parameter: 'Precipitații',
    limit: 'ploaie torențială sau ninsoare abundentă - INTERZIS',
    severity: 'prohibition'
  },
  {
    parameter: 'Fulger/Furtună',
    limit: 'prezența fulgerelor în raza de 10 km - EVACUARE IMEDIATĂ',
    severity: 'prohibition'
  },
  {
    parameter: 'Gheață',
    limit: 'suprafețe îngheșate pe structuri - INTERZIS până la degelare',
    severity: 'prohibition'
  },
  {
    parameter: 'Temperatură',
    limit: 'sub -10°C sau peste +40°C - ATENȚIE sporită, pauze frecvente',
    severity: 'warning'
  },
  {
    parameter: 'Cod Portocaliu/Roșu',
    limit: 'avertizări meteo ANM cod portocaliu/roșu - SUSPENDARE lucrări',
    severity: 'prohibition'
  }
];

// Medical requirements
export const medicalRequirements: MedicalRequirement[] = [
  {
    id: 'medical_exam',
    requirement: 'Examen medical de aptitudine pentru lucrul la înălțime',
    frequency: 'anual',
    contraindications: [
      'Acrofobie (frica de înălțime)',
      'Vertij sau tulburări de echilibru',
      'Epilepsie',
      'Probleme cardiovasculare severe',
      'Hipertensiune arterială necontrolată',
      'Diabet zaharat decompensat',
      'Boli psihice',
      'Probleme severe de vedere sau auz',
      'Afecțiuni osteoarticulare care limitează mobilitatea',
      'Consumul de substanțe psihoactive sau alcool'
    ]
  },
  {
    id: 'fitness_check',
    requirement: 'Verificare stare fizică înainte de schimb',
    frequency: 'zilnic',
    contraindications: [
      'Oboseală excesivă',
      'Stare de ebrietate sau sub influența drogurilor',
      'Medicație care afectează vigilența',
      'Stare febrilă',
      'Vertij sau amețeli'
    ]
  }
];

// Plan de salvare
export const rescuePlanElements: RescuePlanElement[] = [
  {
    id: 'risk_assessment',
    element: 'Evaluarea Riscurilor',
    description: 'Identificarea tuturor punctelor de lucru la înălțime și riscurilor asociate',
    responsible: 'Coordonator SSM și conducător lucrare'
  },
  {
    id: 'rescue_equipment',
    element: 'Echipament de Salvare',
    description: 'Dispozitive de coborâre, tărgi, truse de prim ajutor, sistem comunicare',
    responsible: 'Responsabil SSM șantier'
  },
  {
    id: 'rescue_team',
    element: 'Echipă de Salvare',
    description: 'Minim 2 persoane instruite în tehnici de salvare la înălțime, disponibile permanent',
    responsible: 'Șef șantier'
  },
  {
    id: 'emergency_contacts',
    element: 'Contacte de Urgență',
    description: '112, ISU, ambulanță, spital apropriat, responsabili SSM, acces șantier',
    responsible: 'Toate persoanele implicate'
  },
  {
    id: 'access_routes',
    element: 'Căi de Acces pentru Salvare',
    description: 'Identificarea și menținerea liberă a căilor de evacuare și acces pentru salvatori',
    responsible: 'Șef șantier'
  },
  {
    id: 'communication',
    element: 'Sistem de Comunicare',
    description: 'Stații radio, telefoane mobile, sistem de alertă (sirenă, fluier)',
    responsible: 'Toate persoanele la înălțime'
  },
  {
    id: 'rescue_procedure',
    element: 'Procedură de Salvare',
    description: 'Pași clari: alertare, evaluare situație, stabilizare victimă, coborâre, prim ajutor',
    responsible: 'Lider echipă salvare'
  },
  {
    id: 'suspension_trauma',
    element: 'Protocol Sindrom Suspensie',
    description: 'Coborâre rapidă (max 5-10 min), poziționare orizontală, monitorizare constantă',
    responsible: 'Echipă salvare și paramedici'
  },
  {
    id: 'drills',
    element: 'Exerciții de Salvare',
    description: 'Simulări periodice (trimestrial) pentru testarea planului și pregătirea echipei',
    responsible: 'Coordonator SSM'
  },
  {
    id: 'documentation',
    element: 'Documentare',
    description: 'Plan de salvare scris, diagrame, formulare de raportare incident',
    responsible: 'Responsabil SSM'
  }
];

// Procedura de lucru standard
export const standardWorkProcedure = {
  title: 'Procedură Standard pentru Lucrul la Înălțime',
  steps: [
    {
      order: 1,
      step: 'Autorizare',
      description: 'Obținerea autorizației de lucru la înălțime (permis de lucru)',
      checks: [
        'Permis de lucru semnat de persoanele autorizate',
        'Evaluarea riscurilor pentru locația specifică',
        'Confirmarea condițiilor meteo favorabile'
      ]
    },
    {
      order: 2,
      step: 'Verificare Echipamente',
      description: 'Inspecția vizuală a tuturor echipamentelor înainte de utilizare',
      checks: [
        'EIP - ham, cordoane, carabiniere fără deteriorări',
        'Puncte de ancorare verificate (min 12kN)',
        'Echipamente colective (schele, plase) în stare bună',
        'Certificate și autorizații valabile'
      ]
    },
    {
      order: 3,
      step: 'Verificare Medicală',
      description: 'Confirmarea aptitudinii fizice pentru lucru',
      checks: [
        'Aviz medical la zi',
        'Verificare stare zilnică (oboseală, medicație)',
        'Confirmare absență alcool/droguri'
      ]
    },
    {
      order: 4,
      step: 'Echipare EIP',
      description: 'Îmbrăcarea corectă a echipamentului de protecție individuală',
      checks: [
        'Ham ajustat corect la corp',
        'Cască cu jugulară închisă',
        'Vestă reflectorizantă vizibilă',
        'Încălțăminte și mănuși adecvate'
      ]
    },
    {
      order: 5,
      step: 'Securizare Zonă',
      description: 'Delimitarea și securizarea zonei de lucru',
      checks: [
        'Perimetru de siguranță marcat (bandă, panouri)',
        'Semnalizare risc cădere obiecte',
        'Restricționarea accesului persoanelor neautorizate',
        'Asigurarea supraveghere permanentă'
      ]
    },
    {
      order: 6,
      step: 'Atașare Continuă',
      description: 'Conexiune permanentă la punctul de ancorare',
      checks: [
        'Atașare înainte de a părăsi platforma sigură',
        'Utilizare sistem dublu de atașare la deplasări',
        'Menținerea factorului de cădere sub 1',
        'Evitarea pendulării (cădere în arc)'
      ]
    },
    {
      order: 7,
      step: 'Execuție Lucrare',
      description: 'Desfășurarea lucrării conform procedurii de siguranță',
      checks: [
        'Respectarea instrucțiunilor de lucru',
        'Comunicare permanentă cu echipa',
        'Atenție la modificările de meteo',
        'Pauze regulate pentru odihnă'
      ]
    },
    {
      order: 8,
      step: 'Finalizare',
      description: 'Încheierea lucrării în siguranță',
      checks: [
        'Coborâre sigură, menținând atașarea',
        'Predarea sculelor și materialelor',
        'Verificarea absență obiecte uitate la înălțime',
        'Raportarea anomaliilor sau incidentelor',
        'Închiderea permisului de lucru'
      ]
    }
  ]
};

// Export default object
export const workAtHeightData = {
  definition: workAtHeightDefinition,
  equipmentCategories,
  trainingRequirements,
  mandatoryPPE,
  weatherRestrictions,
  medicalRequirements,
  rescuePlanElements,
  standardWorkProcedure
};

export default workAtHeightData;
