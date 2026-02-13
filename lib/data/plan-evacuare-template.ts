/**
 * Template pentru Plan de Evacuare în caz de urgență
 * Structură standardizată pentru generarea planurilor de evacuare SSM/PSI
 */

export interface EvacuationPlanSection {
  id: string;
  title: string;
  placeholder: string;
  content?: string;
  required: boolean;
  order: number;
}

export interface EvacuationScenario {
  id: string;
  type: 'incendiu' | 'cutremur' | 'alerta_chimica' | 'alerta_bomba' | 'inundatie' | 'altele';
  description: string;
  specificProcedures: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  responsibilities: string[];
}

export interface EvacuationRoute {
  id: string;
  from: string;
  to: string;
  description: string;
  alternativeRoute?: string;
  accessibilityNotes?: string;
}

export interface AssemblyPoint {
  id: string;
  name: string;
  location: string;
  capacity: number;
  coordinates?: string;
  isAccessible: boolean;
  alternativePoint?: string;
}

export interface EmergencyEquipment {
  id: string;
  type: string;
  location: string;
  quantity: number;
  lastCheck?: string;
  responsible?: string;
}

export interface EmergencyContact {
  id: string;
  organization: string;
  phone: string;
  address?: string;
  priority: number;
}

export interface EvacuationPlanTemplate {
  sections: EvacuationPlanSection[];
  scenarios: EvacuationScenario[];
  team: TeamMember[];
  routes: EvacuationRoute[];
  assemblyPoints: AssemblyPoint[];
  equipment: EmergencyEquipment[];
  emergencyContacts: EmergencyContact[];
}

/**
 * Template implicit pentru plan de evacuare
 */
export const defaultEvacuationPlanTemplate: EvacuationPlanTemplate = {
  sections: [
    {
      id: 'obiectiv',
      title: 'Descrierea Obiectivului',
      placeholder: 'Introduceți denumirea completă, adresa, suprafața, numărul de etaje, destinația clădirii și alte detalii relevante despre obiectiv.',
      required: true,
      order: 1,
    },
    {
      id: 'scop',
      title: 'Scopul Planului de Evacuare',
      placeholder: 'Descrieți scopul planului: protejarea vieții și sănătății persoanelor, minimizarea pagubelor materiale, stabilirea procedurilor clare de evacuare.',
      required: true,
      order: 2,
    },
    {
      id: 'cadru_legal',
      title: 'Cadru Legal',
      placeholder: 'Menționați legislația aplicabilă: Legea 307/2006, Normele specifice PSI, Regulamentul intern, HG 1425/2006, etc.',
      required: true,
      order: 3,
    },
  ],

  scenarios: [
    {
      id: 'incendiu',
      type: 'incendiu',
      description: 'Declanșarea unui incendiu în clădire',
      specificProcedures: 'Apăsați butonul de alarmă, anunțați pompierii la 112, evacuați calm pe scările de evacuare, nu folosiți liftul, verificați ușile înainte de deschidere.',
    },
    {
      id: 'cutremur',
      type: 'cutremur',
      description: 'Cutremur de pământ',
      specificProcedures: 'Adăpostiți-vă sub mobilier solid, departe de ferestre, după încetarea șocului evacuați ordonat, verificați eventualele avarii.',
    },
    {
      id: 'alerta_chimica',
      type: 'alerta_chimica',
      description: 'Scurgere substanțe periculoase',
      specificProcedures: 'Izolați zona afectată, folosiți echipament de protecție, evacuați perpendicular pe direcția vântului, anunțați autoritățile.',
    },
    {
      id: 'alerta_bomba',
      type: 'alerta_bomba',
      description: 'Amenințare cu bombă',
      specificProcedures: 'Evacuare imediată și ordonată, nu atingeți obiecte suspecte, nu folosiți telefoane mobile în apropierea obiectului suspect, anunțați 112.',
    },
  ],

  team: [
    {
      id: 'sef_interventie',
      name: '',
      role: 'Șef Echipă de Intervenție',
      phone: '',
      responsibilities: [
        'Coordonează evacuarea',
        'Menține legătura cu serviciile de urgență',
        'Decide declanșarea evacuării',
        'Verifică completarea evacuării',
      ],
    },
    {
      id: 'adjunct',
      name: '',
      role: 'Adjunct Șef Echipă',
      phone: '',
      responsibilities: [
        'Supraveghează evacuarea pe etaje',
        'Asistă șeful echipei',
        'Preia atribuțiile în absența șefului',
      ],
    },
    {
      id: 'responsabil_etaj',
      name: '',
      role: 'Responsabil Etaj',
      phone: '',
      responsibilities: [
        'Verifică evacuarea completă a etajului',
        'Raportează situația șefului echipei',
        'Ajută persoanele cu dificultăți de deplasare',
      ],
    },
    {
      id: 'prim_ajutor',
      name: '',
      role: 'Responsabil Prim Ajutor',
      phone: '',
      responsibilities: [
        'Acordă prim ajutor la punctul de adunare',
        'Menține trusa medicală actualizată',
        'Coordonează cu serviciile medicale',
      ],
    },
  ],

  routes: [
    {
      id: 'ruta_1',
      from: 'Etaj 1 - Zona A',
      to: 'Punct de adunare principal',
      description: 'Scara principală - ieșire Est',
      alternativeRoute: 'Scara de urgență - ieșire Sud',
      accessibilityNotes: 'Accesibilă pentru persoane cu dizabilități',
    },
    {
      id: 'ruta_2',
      from: 'Etaj 1 - Zona B',
      to: 'Punct de adunare principal',
      description: 'Scara secundară - ieșire Vest',
      alternativeRoute: 'Scara principală - ieșire Est',
    },
  ],

  assemblyPoints: [
    {
      id: 'punct_1',
      name: 'Punct de Adunare Principal',
      location: 'Parcare zona Est, la minimum 50m de clădire',
      capacity: 200,
      isAccessible: true,
      alternativePoint: 'Punct de adunare secundar - parcarea vizavi',
    },
    {
      id: 'punct_2',
      name: 'Punct de Adunare Secundar',
      location: 'Parcarea din fața clădirii vecine',
      capacity: 100,
      isAccessible: true,
    },
  ],

  equipment: [
    {
      id: 'stingatoare_parter',
      type: 'Stingător pulbere 6kg',
      location: 'Parter - hol principal',
      quantity: 4,
    },
    {
      id: 'stingatoare_etaj1',
      type: 'Stingător pulbere 6kg',
      location: 'Etaj 1 - holuri',
      quantity: 3,
    },
    {
      id: 'hidrant_interior',
      type: 'Hidrant interior',
      location: 'Fiecare etaj',
      quantity: 2,
    },
    {
      id: 'detector_fum',
      type: 'Detector fum',
      location: 'Toate spațiile',
      quantity: 15,
    },
    {
      id: 'alarma_incendiu',
      type: 'Buton alarmă incendiu',
      location: 'Fiecare etaj',
      quantity: 3,
    },
    {
      id: 'kit_prim_ajutor',
      type: 'Trusă prim ajutor',
      location: 'Recepție + Etaj 1',
      quantity: 2,
    },
    {
      id: 'lanterna',
      type: 'Lanternă urgență',
      location: 'Recepție',
      quantity: 3,
    },
  ],

  emergencyContacts: [
    {
      id: 'urgente',
      organization: 'Servicii Urgență 112',
      phone: '112',
      priority: 1,
    },
    {
      id: 'pompieri',
      organization: 'Pompieri',
      phone: '112',
      priority: 2,
    },
    {
      id: 'ambulanta',
      organization: 'Ambulanță',
      phone: '112',
      priority: 3,
    },
    {
      id: 'politie',
      organization: 'Poliție',
      phone: '112',
      priority: 4,
    },
    {
      id: 'isuj',
      organization: 'ISU Județean',
      phone: '',
      address: 'Completați adresa și telefonul ISU local',
      priority: 5,
    },
    {
      id: 'administrator',
      organization: 'Administrator clădire',
      phone: '',
      priority: 6,
    },
    {
      id: 'manager_ssm',
      organization: 'Manager SSM',
      phone: '',
      priority: 7,
    },
    {
      id: 'consultant_ssm',
      organization: 'Consultant SSM/PSI',
      phone: '',
      priority: 8,
    },
  ],
};

/**
 * Tipuri de scenarii disponibile pentru planuri de evacuare
 */
export const scenarioTypes = [
  { value: 'incendiu', label: 'Incendiu' },
  { value: 'cutremur', label: 'Cutremur' },
  { value: 'alerta_chimica', label: 'Alertă Chimică' },
  { value: 'alerta_bomba', label: 'Amenințare cu Bombă' },
  { value: 'inundatie', label: 'Inundație' },
  { value: 'altele', label: 'Altele' },
] as const;

/**
 * Roluri standard în echipa de evacuare
 */
export const teamRoles = [
  'Șef Echipă de Intervenție',
  'Adjunct Șef Echipă',
  'Responsabil Etaj',
  'Responsabil Prim Ajutor',
  'Responsabil Comunicare',
  'Responsabil Verificare Spații',
] as const;

/**
 * Tipuri de echipamente de urgență
 */
export const equipmentTypes = [
  'Stingător pulbere',
  'Stingător CO2',
  'Stingător spumă',
  'Hidrant interior',
  'Hidrant exterior',
  'Detector fum',
  'Detector CO',
  'Buton alarmă incendiu',
  'Sistem sprinklere',
  'Iluminat urgență',
  'Trusă prim ajutor',
  'Lanternă urgență',
  'Megafon',
] as const;
