/**
 * Pricing Plans Configuration
 *
 * Definește planurile de prețuri pentru platforma SSM/PSI
 * FREE, START, PRO, ENTERPRISE cu features matrix completă
 */

export type PricingInterval = 'monthly' | 'annually';

export interface PricingFeature {
  name: string;
  free: boolean;
  start: boolean;
  pro: boolean;
  enterprise: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    annually: number;
  };
  stripePriceIds: {
    monthly: string | null;
    annually: string | null;
  };
  limits: {
    employees: number | 'unlimited';
    modules: number | 'unlimited';
    storage: string;
    apiCalls: number | 'unlimited';
  };
  features: string[];
  highlighted: boolean;
  cta: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'FREE',
    description: 'Perfect pentru testare și firme foarte mici',
    price: {
      monthly: 0,
      annually: 0,
    },
    stripePriceIds: {
      monthly: null,
      annually: null,
    },
    limits: {
      employees: 5,
      modules: 1,
      storage: '100 MB',
      apiCalls: 0,
    },
    features: [
      'Până la 5 angajați',
      '1 modul la alegere (SSM sau PSI)',
      'Rapoarte de bază (PDF simplu)',
      'Istoric 30 de zile',
      'Suport prin email (24-48h)',
      'Export date CSV',
    ],
    highlighted: false,
    cta: 'Începe gratuit',
  },
  {
    id: 'start',
    name: 'START',
    description: 'Ideal pentru firme mici și consultanți independenți',
    price: {
      monthly: 79,
      annually: 790, // ~66 RON/lună (2 luni gratuite)
    },
    stripePriceIds: {
      monthly: 'price_start_monthly_placeholder',
      annually: 'price_start_annually_placeholder',
    },
    limits: {
      employees: 25,
      modules: 3,
      storage: '5 GB',
      apiCalls: 1000,
    },
    features: [
      'Până la 25 angajați',
      '3 module: SSM + PSI + Instructaj',
      'Rapoarte avansate PDF',
      'Alerte email automate',
      'Istoric nelimitat',
      'Export Excel/CSV',
      'Integrare Calendar',
      'Suport prioritar email',
      'Onboarding gratuit',
    ],
    highlighted: false,
    cta: 'Alege START',
  },
  {
    id: 'pro',
    name: 'PRO',
    description: 'Pentru consultanți și firme medii cu cerințe avansate',
    price: {
      monthly: 149,
      annually: 1490, // ~124 RON/lună (2 luni gratuite)
    },
    stripePriceIds: {
      monthly: 'price_pro_monthly_placeholder',
      annually: 'price_pro_annually_placeholder',
    },
    limits: {
      employees: 100,
      modules: 'unlimited',
      storage: '50 GB',
      apiCalls: 10000,
    },
    features: [
      'Până la 100 angajați',
      'TOATE modulele disponibile',
      'Rapoarte personalizate cu logo',
      'Alerte WhatsApp + Email',
      'API REST complet',
      'Integrări ERP/HR',
      'Matrice formare automată',
      'Calendar partajat',
      'Audit log complet',
      'Multi-organizație (consultanți)',
      'Suport prioritar (4h răspuns)',
      'Onboarding + training dedicat',
      'Backup zilnic automat',
    ],
    highlighted: true,
    cta: 'Alege PRO',
  },
  {
    id: 'enterprise',
    name: 'ENTERPRISE',
    description: 'Soluție completă pentru corporații și consultanți mari',
    price: {
      monthly: 0, // Custom pricing
      annually: 0, // Custom pricing
    },
    stripePriceIds: {
      monthly: null,
      annually: null,
    },
    limits: {
      employees: 'unlimited',
      modules: 'unlimited',
      storage: 'Unlimited',
      apiCalls: 'unlimited',
    },
    features: [
      'Angajați nelimitați',
      'Organizații nelimitate',
      'SLA 99.9% uptime garantat',
      'SSO (Single Sign-On)',
      'White-label complet',
      'Subdomeniu personalizat',
      'Server dedicat (opțional)',
      'API fără limite',
      'Integrări custom',
      'Suport telefonic 24/7',
      'Account manager dedicat',
      'Training la sediu',
      'Implementare asistată',
      'Consultanță compliance',
      'Backup real-time',
      'Audit și securitate avansată',
    ],
    highlighted: false,
    cta: 'Contactează-ne',
  },
];

/**
 * Matrice completă de features pentru comparație
 * Permite afișare side-by-side în pagina de pricing
 */
export const featureMatrix: PricingFeature[] = [
  // Limite și acces de bază
  {
    name: 'Angajați incluși',
    free: true, // "5"
    start: true, // "25"
    pro: true, // "100"
    enterprise: true, // "Unlimited"
  },
  {
    name: 'Module disponibile',
    free: true, // "1"
    start: true, // "3"
    pro: true, // "Toate"
    enterprise: true, // "Toate + Custom"
  },
  {
    name: 'Spațiu stocare',
    free: true, // "100 MB"
    start: true, // "5 GB"
    pro: true, // "50 GB"
    enterprise: true, // "Unlimited"
  },

  // Module SSM/PSI
  {
    name: 'Modul SSM (Securitate Muncă)',
    free: true,
    start: true,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Modul PSI (Prevenire Incendii)',
    free: false,
    start: true,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Modul Instructaj Angajați',
    free: false,
    start: true,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Modul Medical (Fișe Aptitudine)',
    free: false,
    start: false,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Modul Echipamente (EPI/ISCIR)',
    free: false,
    start: false,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Modul Documente Conforme',
    free: false,
    start: false,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Modul Calendar Evenimente',
    free: false,
    start: true,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Modul Audit & Inspecții',
    free: false,
    start: false,
    pro: true,
    enterprise: true,
  },

  // Raportare și Export
  {
    name: 'Rapoarte PDF de bază',
    free: true,
    start: true,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Rapoarte PDF personalizate cu logo',
    free: false,
    start: false,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Export Excel/CSV',
    free: true,
    start: true,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Rapoarte automate programate',
    free: false,
    start: false,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Dashboard analytics avansat',
    free: false,
    start: false,
    pro: true,
    enterprise: true,
  },

  // Alerte și notificări
  {
    name: 'Alerte email',
    free: false,
    start: true,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Alerte WhatsApp',
    free: false,
    start: false,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Alerte SMS',
    free: false,
    start: false,
    pro: false,
    enterprise: true,
  },
  {
    name: 'Notificări push (mobile)',
    free: false,
    start: false,
    pro: true,
    enterprise: true,
  },

  // Integrări și API
  {
    name: 'API REST',
    free: false,
    start: false,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Webhooks',
    free: false,
    start: false,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Integrare Calendar (Google, Outlook)',
    free: false,
    start: true,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Integrări ERP/HR',
    free: false,
    start: false,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Integrări custom dedicate',
    free: false,
    start: false,
    pro: false,
    enterprise: true,
  },

  // Colaborare și multi-org
  {
    name: 'Utilizatori multipli',
    free: true,
    start: true,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Roluri și permisiuni',
    free: true,
    start: true,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Multi-organizație (consultanți)',
    free: false,
    start: false,
    pro: true,
    enterprise: true,
  },
  {
    name: 'White-label complet',
    free: false,
    start: false,
    pro: false,
    enterprise: true,
  },
  {
    name: 'Subdomeniu personalizat',
    free: false,
    start: false,
    pro: false,
    enterprise: true,
  },

  // Securitate și compliance
  {
    name: 'Audit log de bază',
    free: true,
    start: true,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Audit log avansat (toate acțiunile)',
    free: false,
    start: false,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Backup automat',
    free: false,
    start: false,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Backup real-time cu restore',
    free: false,
    start: false,
    pro: false,
    enterprise: true,
  },
  {
    name: 'SSO (Single Sign-On)',
    free: false,
    start: false,
    pro: false,
    enterprise: true,
  },
  {
    name: 'GDPR compliance tools',
    free: true,
    start: true,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Conformitate ANSVSA/ITM',
    free: false,
    start: true,
    pro: true,
    enterprise: true,
  },

  // Suport
  {
    name: 'Suport email',
    free: true, // "24-48h"
    start: true, // "12-24h"
    pro: true, // "4h răspuns"
    enterprise: true, // "24/7"
  },
  {
    name: 'Suport telefonic',
    free: false,
    start: false,
    pro: false,
    enterprise: true,
  },
  {
    name: 'Onboarding și training',
    free: false,
    start: true,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Account manager dedicat',
    free: false,
    start: false,
    pro: false,
    enterprise: true,
  },
  {
    name: 'SLA garantat 99.9%',
    free: false,
    start: false,
    pro: false,
    enterprise: true,
  },
  {
    name: 'Consultanță compliance dedicată',
    free: false,
    start: false,
    pro: false,
    enterprise: true,
  },
];

/**
 * Helper function pentru a obține un plan după ID
 */
export function getPlanById(planId: string): PricingPlan | undefined {
  return pricingPlans.find((plan) => plan.id === planId);
}

/**
 * Helper function pentru a calcula economia la plata anuală
 */
export function calculateAnnualSavings(planId: string): number {
  const plan = getPlanById(planId);
  if (!plan || plan.price.monthly === 0) return 0;

  const monthlyCost = plan.price.monthly * 12;
  const annualCost = plan.price.annually;

  return monthlyCost - annualCost;
}

/**
 * Helper function pentru a verifica dacă un feature este disponibil
 */
export function hasFeature(
  planId: string,
  featureName: string
): boolean {
  const feature = featureMatrix.find((f) => f.name === featureName);
  if (!feature) return false;

  switch (planId) {
    case 'free':
      return feature.free;
    case 'start':
      return feature.start;
    case 'pro':
      return feature.pro;
    case 'enterprise':
      return feature.enterprise;
    default:
      return false;
  }
}
