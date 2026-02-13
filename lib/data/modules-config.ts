/**
 * Platform Modules Configuration
 *
 * Definește configurația pentru cele 8 module ale platformei SSM
 * Fiecare modul include: metadata, funcționalități, dependențe, plan necesar și status
 */

export type ModuleStatus = 'active' | 'coming-soon' | 'beta';
export type PlanType = 'starter' | 'pro' | 'enterprise';

export interface ModuleFeature {
  id: string;
  name: string;
  description: string;
  available: boolean;
}

export interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  features: ModuleFeature[];
  requiredPlan: PlanType;
  dependencies: string[];
  status: ModuleStatus;
}

export const MODULES_CONFIG: ModuleConfig[] = [
  {
    id: 'ssm',
    name: 'SSM - Securitate și Sănătate în Muncă',
    description: 'Gestionare completă a activităților de securitate și sănătate în muncă conform legislației românești',
    icon: 'Shield',
    color: 'blue',
    features: [
      {
        id: 'risk-assessment',
        name: 'Evaluare Riscuri',
        description: 'Evaluare profesională a riscurilor pentru locuri de muncă',
        available: true
      },
      {
        id: 'work-procedures',
        name: 'Proceduri de Lucru',
        description: 'Gestionare proceduri și instrucțiuni de securitate',
        available: true
      },
      {
        id: 'ipp-management',
        name: 'Echipamente IPP',
        description: 'Gestionare echipamente de protecție individuală',
        available: true
      },
      {
        id: 'accident-management',
        name: 'Gestiune Accidente',
        description: 'Raportare și investigare accidente de muncă',
        available: true
      },
      {
        id: 'legislation-tracking',
        name: 'Monitorizare Legislație',
        description: 'Actualizări automate legislație SSM România, Bulgaria, Ungaria, Germania',
        available: true
      }
    ],
    requiredPlan: 'starter',
    dependencies: [],
    status: 'active'
  },
  {
    id: 'psi',
    name: 'PSI - Prevenirea și Stingerea Incendiilor',
    description: 'Management complet pentru prevenirea și protecția împotriva incendiilor',
    icon: 'Flame',
    color: 'red',
    features: [
      {
        id: 'fire-risk-assessment',
        name: 'Evaluare Risc Incendiu',
        description: 'Scenarii de incendiu și evaluare riscuri conform normativelor',
        available: true
      },
      {
        id: 'fire-equipment',
        name: 'Echipamente PSI',
        description: 'Gestionare stingătoare, hidranți, sisteme de detectare',
        available: true
      },
      {
        id: 'evacuation-plans',
        name: 'Planuri de Evacuare',
        description: 'Planuri de evacuare și proceduri de urgență',
        available: true
      },
      {
        id: 'fire-drills',
        name: 'Exerciții de Evacuare',
        description: 'Planificare și documentare exerciții PSI',
        available: true
      },
      {
        id: 'fire-inspections',
        name: 'Inspecții PSI',
        description: 'Programare și raportare inspecții periodice',
        available: true
      }
    ],
    requiredPlan: 'starter',
    dependencies: [],
    status: 'active'
  },
  {
    id: 'medical',
    name: 'Medicina Muncii',
    description: 'Urmărire examene medicale și gestiune avize medicale pentru angajați',
    icon: 'Stethoscope',
    color: 'green',
    features: [
      {
        id: 'medical-records',
        name: 'Dosare Medicale',
        description: 'Evidență electronică avize medicale pentru fiecare angajat',
        available: true
      },
      {
        id: 'exam-scheduling',
        name: 'Programare Examene',
        description: 'Planificare automată examene medicale la angajare și periodice',
        available: true
      },
      {
        id: 'expiry-alerts',
        name: 'Alerte Expirare',
        description: 'Notificări automate pentru avize medicale apropiate de expirare',
        available: true
      },
      {
        id: 'clinic-integration',
        name: 'Integrare Clinici',
        description: 'Conectare cu clinici partenere pentru programări online',
        available: false
      },
      {
        id: 'medical-reports',
        name: 'Rapoarte Medicale',
        description: 'Statistici și rapoarte privind starea de sănătate a angajaților',
        available: true
      }
    ],
    requiredPlan: 'starter',
    dependencies: [],
    status: 'active'
  },
  {
    id: 'equipment',
    name: 'Echipamente',
    description: 'Gestiune centralizată echipamente de lucru și protecție',
    icon: 'Wrench',
    color: 'orange',
    features: [
      {
        id: 'equipment-registry',
        name: 'Registru Echipamente',
        description: 'Evidență completă echipamente și utilaje',
        available: true
      },
      {
        id: 'maintenance-tracking',
        name: 'Întreținere Periodică',
        description: 'Programare și urmărire revizii tehnice',
        available: true
      },
      {
        id: 'certification-management',
        name: 'Certificări și Autorizații',
        description: 'Gestionare certificate ISCIR, autorizații ANRE',
        available: true
      },
      {
        id: 'equipment-assignment',
        name: 'Alocare Echipamente',
        description: 'Distribuție echipamente către angajați',
        available: true
      },
      {
        id: 'depreciation-tracking',
        name: 'Amortizare',
        description: 'Calcul automát valoare reziduală echipamente',
        available: false
      }
    ],
    requiredPlan: 'pro',
    dependencies: [],
    status: 'active'
  },
  {
    id: 'training',
    name: 'Instruire și Formare',
    description: 'Planificare și evidență instruiri SSM, PSI și profesionale',
    icon: 'GraduationCap',
    color: 'purple',
    features: [
      {
        id: 'training-programs',
        name: 'Programe de Instruire',
        description: 'Planuri de instruire SSM, PSI, primului ajutor',
        available: true
      },
      {
        id: 'attendance-tracking',
        name: 'Prezență Cursanți',
        description: 'Urmărire participare și completare instruiri',
        available: true
      },
      {
        id: 'certificates',
        name: 'Certificate și Diplome',
        description: 'Generare automată certificate de absolvire',
        available: true
      },
      {
        id: 'online-courses',
        name: 'Cursuri Online',
        description: 'Platformă e-learning integrată pentru instruiri la distanță',
        available: false
      },
      {
        id: 'training-reminders',
        name: 'Reamintiri Instruire',
        description: 'Notificări automate pentru reinstruiri periodice',
        available: true
      }
    ],
    requiredPlan: 'starter',
    dependencies: [],
    status: 'active'
  },
  {
    id: 'documents',
    name: 'Documente',
    description: 'Bibliotecă centralizată documente SSM/PSI cu versioning',
    icon: 'FileText',
    color: 'gray',
    features: [
      {
        id: 'document-library',
        name: 'Bibliotecă Documente',
        description: 'Stocare securizată proceduri, instrucțiuni, rapoarte',
        available: true
      },
      {
        id: 'version-control',
        name: 'Control Versiuni',
        description: 'Istoric modificări și management versiuni documente',
        available: true
      },
      {
        id: 'templates',
        name: 'Șabloane Predefinite',
        description: 'Colecție șabloane documente SSM/PSI conforme legislației',
        available: true
      },
      {
        id: 'digital-signatures',
        name: 'Semnături Electronice',
        description: 'Semnare electronică documente cu certificat digital',
        available: false
      },
      {
        id: 'document-sharing',
        name: 'Partajare Documente',
        description: 'Distribuție controlată documente către angajați',
        available: true
      }
    ],
    requiredPlan: 'starter',
    dependencies: [],
    status: 'active'
  },
  {
    id: 'reges',
    name: 'REGES - Registrul Electronic General',
    description: 'Integrare cu Registrul Electronic de Evidență a Salariaților',
    icon: 'Database',
    color: 'indigo',
    features: [
      {
        id: 'reges-sync',
        name: 'Sincronizare REGES',
        description: 'Import automat date angajați din REGES',
        available: false
      },
      {
        id: 'employee-registry',
        name: 'Registru Angajați',
        description: 'Evidență electronică angajați conform REGES',
        available: false
      },
      {
        id: 'contract-management',
        name: 'Gestiune Contracte',
        description: 'Urmărire contracte individuale de muncă',
        available: false
      },
      {
        id: 'attendance-integration',
        name: 'Pontaj Integrat',
        description: 'Conexiune cu sisteme de pontaj biometric',
        available: false
      },
      {
        id: 'reporting',
        name: 'Raportări ITM',
        description: 'Generare rapoarte pentru Inspecția Muncii',
        available: false
      }
    ],
    requiredPlan: 'enterprise',
    dependencies: [],
    status: 'coming-soon'
  },
  {
    id: 'nis2',
    name: 'NIS2 - Securitate Cibernetică',
    description: 'Conformitate cu Directiva NIS2 pentru entități esențiale și importante',
    icon: 'Lock',
    color: 'cyan',
    features: [
      {
        id: 'cyber-risk-assessment',
        name: 'Evaluare Riscuri Cibernetice',
        description: 'Analiza riscurilor de securitate IT conform NIS2',
        available: false
      },
      {
        id: 'incident-response',
        name: 'Răspuns la Incidente',
        description: 'Plan și proceduri răspuns incidente de securitate cibernetică',
        available: false
      },
      {
        id: 'compliance-monitoring',
        name: 'Monitorizare Conformitate',
        description: 'Verificare continuă cerințe NIS2 și raportare',
        available: false
      },
      {
        id: 'security-training',
        name: 'Instruire Securitate IT',
        description: 'Programe de conștientizare securitate cibernetică',
        available: false
      },
      {
        id: 'supply-chain-security',
        name: 'Securitate Lanț Furnizori',
        description: 'Evaluare și monitorizare furnizori din perspectiva NIS2',
        available: false
      }
    ],
    requiredPlan: 'enterprise',
    dependencies: ['ssm', 'documents'],
    status: 'coming-soon'
  }
];

/**
 * Obține configurația unui modul după ID
 */
export function getModuleById(moduleId: string): ModuleConfig | undefined {
  return MODULES_CONFIG.find(module => module.id === moduleId);
}

/**
 * Obține toate modulele active
 */
export function getActiveModules(): ModuleConfig[] {
  return MODULES_CONFIG.filter(module => module.status === 'active');
}

/**
 * Obține modulele disponibile pentru un plan specific
 */
export function getModulesByPlan(plan: PlanType): ModuleConfig[] {
  const planHierarchy: Record<PlanType, number> = {
    starter: 1,
    pro: 2,
    enterprise: 3
  };

  const currentPlanLevel = planHierarchy[plan];

  return MODULES_CONFIG.filter(module => {
    const requiredPlanLevel = planHierarchy[module.requiredPlan];
    return requiredPlanLevel <= currentPlanLevel;
  });
}

/**
 * Verifică dacă un modul are toate dependențele satisfăcute
 */
export function checkModuleDependencies(
  moduleId: string,
  activeModuleIds: string[]
): { satisfied: boolean; missing: string[] } {
  const module = getModuleById(moduleId);

  if (!module) {
    return { satisfied: false, missing: [] };
  }

  const missingDependencies = module.dependencies.filter(
    depId => !activeModuleIds.includes(depId)
  );

  return {
    satisfied: missingDependencies.length === 0,
    missing: missingDependencies
  };
}

/**
 * Obține funcționalitățile disponibile pentru un modul
 */
export function getAvailableFeatures(moduleId: string): ModuleFeature[] {
  const module = getModuleById(moduleId);
  return module?.features.filter(feature => feature.available) || [];
}
