/**
 * Platform Modules Configuration
 * Defines all available modules for the s-s-m.ro platform
 */

export type ModuleStatus = 'active' | 'beta' | 'coming_soon' | 'disabled';
export type PlanType = 'free' | 'basic' | 'professional' | 'enterprise';

export interface ModuleFeature {
  name: string;
  description: string;
  available: boolean;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  features: ModuleFeature[];
  requiredPlan: PlanType;
  dependencies?: string[];
  status: ModuleStatus;
  route?: string;
}

export const MODULES_CONFIG: Record<string, Module> = {
  ssm: {
    id: 'ssm',
    name: 'SSM',
    description: 'Securitate și Sănătate în Muncă - gestionare completă a documentației și conformității SSM',
    icon: 'Shield',
    color: 'blue',
    features: [
      {
        name: 'Registre SSM',
        description: 'Gestionare registre obligatorii',
        available: true,
      },
      {
        name: 'Evaluare riscuri',
        description: 'Evaluare și management riscuri profesionale',
        available: true,
      },
      {
        name: 'Planuri de prevenire',
        description: 'Planuri și măsuri de prevenție',
        available: true,
      },
      {
        name: 'Raportare accidente',
        description: 'Evidență și raportare evenimente SSM',
        available: true,
      },
    ],
    requiredPlan: 'basic',
    status: 'active',
    route: '/dashboard/ssm',
  },

  psi: {
    id: 'psi',
    name: 'PSI',
    description: 'Prevenire și Stingere Incendii - management complet pentru conformitate PSI',
    icon: 'Flame',
    color: 'red',
    features: [
      {
        name: 'Planuri PSI',
        description: 'Planuri de intervenție și evacuare',
        available: true,
      },
      {
        name: 'Scenarii incendiu',
        description: 'Scenarii de securitate la incendiu',
        available: true,
      },
      {
        name: 'Echipe PSI',
        description: 'Gestionare echipe de intervenție',
        available: true,
      },
      {
        name: 'Verificări periodice',
        description: 'Planificare și urmărire verificări',
        available: true,
      },
    ],
    requiredPlan: 'basic',
    status: 'active',
    route: '/dashboard/psi',
  },

  medical: {
    id: 'medical',
    name: 'Medical',
    description: 'Control medical periodic - programare, urmărire și notificări pentru examene medicale',
    icon: 'HeartPulse',
    color: 'green',
    features: [
      {
        name: 'Fișe medicale',
        description: 'Evidență completă controale medicale',
        available: true,
      },
      {
        name: 'Programări automate',
        description: 'Notificări și programări la termen',
        available: true,
      },
      {
        name: 'Recomandări medicale',
        description: 'Urmărire recomandări și restricții',
        available: true,
      },
      {
        name: 'Rapoarte statistice',
        description: 'Analize și rapoarte de sănătate',
        available: true,
      },
    ],
    requiredPlan: 'basic',
    status: 'active',
    route: '/dashboard/medical',
  },

  equipment: {
    id: 'equipment',
    name: 'Echipamente',
    description: 'Echipamente de protecție și lucru - inventar, întreținere și verificări periodice',
    icon: 'HardHat',
    color: 'orange',
    features: [
      {
        name: 'Inventar EPI/EPS',
        description: 'Gestionare echipamente de protecție',
        available: true,
      },
      {
        name: 'Atestate verificări',
        description: 'Urmărire atestate și verificări ISCIR',
        available: true,
      },
      {
        name: 'Planificare întreținere',
        description: 'Calendar mentenanță echipamente',
        available: true,
      },
      {
        name: 'Istoric reparații',
        description: 'Jurnal întreținere și reparații',
        available: true,
      },
    ],
    requiredPlan: 'basic',
    status: 'active',
    route: '/dashboard/equipment',
  },

  training: {
    id: 'training',
    name: 'Instruire',
    description: 'Instruire SSM/PSI - planificare, desfășurare și evidență instruiri obligatorii',
    icon: 'GraduationCap',
    color: 'purple',
    features: [
      {
        name: 'Programe instruire',
        description: 'Template-uri și programe personalizate',
        available: true,
      },
      {
        name: 'Instruiri periodice',
        description: 'Planificare automată periodicitate',
        available: true,
      },
      {
        name: 'Generare documente',
        description: 'Procese verbale și certificate automate',
        available: true,
      },
      {
        name: 'Evidență prezență',
        description: 'Semnături digitale și prezență',
        available: true,
      },
    ],
    requiredPlan: 'basic',
    status: 'active',
    route: '/dashboard/trainings',
  },

  documents: {
    id: 'documents',
    name: 'Documente',
    description: 'Management documente - stocare, organizare și partajare documente SSM/PSI',
    icon: 'FileText',
    color: 'indigo',
    features: [
      {
        name: 'Bibliotecă documentare',
        description: 'Organizare pe categorii și taguri',
        available: true,
      },
      {
        name: 'Template-uri',
        description: 'Modele documente pregătite',
        available: true,
      },
      {
        name: 'Semnături digitale',
        description: 'Workflow aprobare și semnare',
        available: true,
      },
      {
        name: 'Control versiuni',
        description: 'Istoric modificări documente',
        available: true,
      },
    ],
    requiredPlan: 'basic',
    status: 'active',
    route: '/dashboard/documents',
  },

  reges: {
    id: 'reges',
    name: 'REGES',
    description: 'Registrul Electronic de Evidență a Salariaților - integrare și sincronizare date REGES',
    icon: 'Database',
    color: 'cyan',
    features: [
      {
        name: 'Import/Export REGES',
        description: 'Sincronizare automată cu REGES',
        available: true,
      },
      {
        name: 'Validare date',
        description: 'Verificare conformitate înregistrări',
        available: true,
      },
      {
        name: 'Raportări ITM',
        description: 'Generare rapoarte pentru ITM',
        available: false,
      },
      {
        name: 'Alertă modificări',
        description: 'Notificări la schimbări în evidență',
        available: true,
      },
    ],
    requiredPlan: 'professional',
    dependencies: ['ssm'],
    status: 'beta',
    route: '/dashboard/reges',
  },

  nis2: {
    id: 'nis2',
    name: 'NIS2',
    description: 'Directiva NIS2 - conformitate securitate cibernetică pentru entități esențiale și importante',
    icon: 'ShieldCheck',
    color: 'slate',
    features: [
      {
        name: 'Evaluare conformitate',
        description: 'Checklist-uri cerințe NIS2',
        available: false,
      },
      {
        name: 'Management riscuri cyber',
        description: 'Identificare și tratare riscuri',
        available: false,
      },
      {
        name: 'Planuri răspuns',
        description: 'Proceduri incidente de securitate',
        available: false,
      },
      {
        name: 'Raportare DNSC',
        description: 'Integrare raportare autorități',
        available: false,
      },
    ],
    requiredPlan: 'enterprise',
    dependencies: ['ssm'],
    status: 'coming_soon',
    route: '/dashboard/nis2',
  },
};

/**
 * Get module configuration by ID
 */
export function getModule(moduleId: string): Module | undefined {
  return MODULES_CONFIG[moduleId];
}

/**
 * Get all active modules
 */
export function getActiveModules(): Module[] {
  return Object.values(MODULES_CONFIG).filter(
    (module) => module.status === 'active'
  );
}

/**
 * Get modules by status
 */
export function getModulesByStatus(status: ModuleStatus): Module[] {
  return Object.values(MODULES_CONFIG).filter(
    (module) => module.status === status
  );
}

/**
 * Get modules by required plan
 */
export function getModulesByPlan(plan: PlanType): Module[] {
  const planHierarchy: Record<PlanType, number> = {
    free: 0,
    basic: 1,
    professional: 2,
    enterprise: 3,
  };

  const userPlanLevel = planHierarchy[plan];

  return Object.values(MODULES_CONFIG).filter(
    (module) => planHierarchy[module.requiredPlan] <= userPlanLevel
  );
}

/**
 * Check if user has access to module based on plan
 */
export function hasModuleAccess(moduleId: string, userPlan: PlanType): boolean {
  const module = getModule(moduleId);
  if (!module) return false;

  const planHierarchy: Record<PlanType, number> = {
    free: 0,
    basic: 1,
    professional: 2,
    enterprise: 3,
  };

  return planHierarchy[userPlan] >= planHierarchy[module.requiredPlan];
}

/**
 * Get module dependencies
 */
export function getModuleDependencies(moduleId: string): Module[] {
  const module = getModule(moduleId);
  if (!module || !module.dependencies) return [];

  return module.dependencies
    .map((depId) => getModule(depId))
    .filter((dep): dep is Module => dep !== undefined);
}

/**
 * Check if all module dependencies are met
 */
export function checkModuleDependencies(
  moduleId: string,
  enabledModules: string[]
): boolean {
  const module = getModule(moduleId);
  if (!module || !module.dependencies) return true;

  return module.dependencies.every((depId) => enabledModules.includes(depId));
}
