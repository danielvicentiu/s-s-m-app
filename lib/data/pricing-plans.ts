/**
 * Pricing Plans Configuration
 *
 * Defines the three subscription tiers for the SSM/PSI platform:
 * - STARTER: For small consultants with limited clients
 * - PROFESSIONAL: For established consultants with growing client base
 * - ENTERPRISE: For large consultancy firms with extensive operations
 */

export type Currency = 'EUR' | 'RON' | 'BGN' | 'HUF' | 'PLN';

export type BillingPeriod = 'monthly' | 'yearly';

export type SupportLevel = 'email' | 'priority' | 'dedicated';

export type ModuleType =
  | 'trainings'
  | 'medical'
  | 'equipment'
  | 'documents'
  | 'alerts'
  | 'penalties'
  | 'legislative_acts'
  | 'reports'
  | 'audit_log'
  | 'integrations';

export interface PricingByPeriod {
  monthly: number;
  yearly: number; // Total yearly price (usually ~10 months)
}

export interface PricingByCurrency {
  EUR: PricingByPeriod;
  RON: PricingByPeriod;
  BGN: PricingByPeriod;
  HUF: PricingByPeriod;
  PLN: PricingByPeriod;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  pricing: PricingByCurrency;
  maxEmployees: number | null; // null = unlimited
  maxCompanies: number | null; // null = unlimited
  modules: ModuleType[];
  features: string[];
  limitations: string[];
  supportLevel: SupportLevel;
  apiAccess: boolean;
  whiteLabel: boolean;
  recommended?: boolean;
  customBranding?: boolean;
  dataRetentionYears: number;
  maxStorageGB: number | null; // null = unlimited
}

/**
 * Pricing Plans Data
 *
 * Exchange rates reference (approximate):
 * 1 EUR ≈ 5.0 RON ≈ 2.0 BGN ≈ 400 HUF ≈ 4.3 PLN
 */
export const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect pentru consultanți SSM/PSI la început de drum sau cu câțiva clienți',
    pricing: {
      EUR: {
        monthly: 49,
        yearly: 490, // ~10 months (16% discount)
      },
      RON: {
        monthly: 245,
        yearly: 2450,
      },
      BGN: {
        monthly: 98,
        yearly: 980,
      },
      HUF: {
        monthly: 19600,
        yearly: 196000,
      },
      PLN: {
        monthly: 210,
        yearly: 2100,
      },
    },
    maxEmployees: 100,
    maxCompanies: 5,
    modules: [
      'trainings',
      'medical',
      'equipment',
      'documents',
      'alerts',
    ],
    features: [
      'Până la 5 companii client',
      'Până la 100 angajați total',
      'Instruiri SSM/PSI',
      'Evidență control medical',
      'Gestiune echipamente protecție',
      'Documente SSM/PSI',
      'Alertele automate (expirări)',
      '10 GB stocare documente',
      'Rapoarte standard (PDF/Excel)',
      'Suport email (răspuns în 48h)',
      'Acces web și mobil',
      'Backup automat zilnic',
    ],
    limitations: [
      'Fără acces la actele legislative',
      'Fără gestionare penalități',
      'Fără jurnal audit complet',
      'Fără API access',
      'Fără white-label',
      'Fără branding personalizat',
      'Păstrare date: 2 ani',
    ],
    supportLevel: 'email',
    apiAccess: false,
    whiteLabel: false,
    dataRetentionYears: 2,
    maxStorageGB: 10,
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Pentru consultanți profesioniști cu un portofoliu solid de clienți',
    pricing: {
      EUR: {
        monthly: 129,
        yearly: 1290, // ~10 months (16% discount)
      },
      RON: {
        monthly: 645,
        yearly: 6450,
      },
      BGN: {
        monthly: 258,
        yearly: 2580,
      },
      HUF: {
        monthly: 51600,
        yearly: 516000,
      },
      PLN: {
        monthly: 555,
        yearly: 5550,
      },
    },
    maxEmployees: 500,
    maxCompanies: 25,
    modules: [
      'trainings',
      'medical',
      'equipment',
      'documents',
      'alerts',
      'penalties',
      'legislative_acts',
      'reports',
      'audit_log',
    ],
    features: [
      'Până la 25 companii client',
      'Până la 500 angajați total',
      'Toate modulele Starter',
      'Bază de date acte legislative SSM/PSI',
      'Gestionare penalități și neconformități',
      'Jurnal audit complet',
      'Rapoarte avansate și customizabile',
      '100 GB stocare documente',
      'Export masiv de date',
      'Notificări SMS (50/lună incluse)',
      'Suport prioritar (răspuns în 24h)',
      'Sesiuni training online (2/an)',
      'API access (rate limit: 1000 req/zi)',
    ],
    limitations: [
      'Fără white-label',
      'Fără branding personalizat complet',
      'Fără manager dedicat',
      'API rate limit: 1000 req/zi',
      'Păstrare date: 5 ani',
    ],
    supportLevel: 'priority',
    apiAccess: true,
    whiteLabel: false,
    recommended: true,
    dataRetentionYears: 5,
    maxStorageGB: 100,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Pentru firme mari de consultanță cu operațiuni complexe și multi-țară',
    pricing: {
      EUR: {
        monthly: 399,
        yearly: 3990, // ~10 months (16% discount)
      },
      RON: {
        monthly: 1995,
        yearly: 19950,
      },
      BGN: {
        monthly: 798,
        yearly: 7980,
      },
      HUF: {
        monthly: 159600,
        yearly: 1596000,
      },
      PLN: {
        monthly: 1715,
        yearly: 17150,
      },
    },
    maxEmployees: null, // unlimited
    maxCompanies: null, // unlimited
    modules: [
      'trainings',
      'medical',
      'equipment',
      'documents',
      'alerts',
      'penalties',
      'legislative_acts',
      'reports',
      'audit_log',
      'integrations',
    ],
    features: [
      'Companii nelimitate',
      'Angajați nelimitați',
      'Toate modulele Professional',
      'White-label complet (domeniu propriu)',
      'Branding personalizat (logo, culori, emailuri)',
      'Integrări custom (ERP, payroll, etc.)',
      'API nelimitat (dedicat)',
      'Stocare nelimitată',
      'Manager de cont dedicat',
      'Suport telefonic 24/7',
      'Sesiuni training nelimitate',
      'Notificări SMS nelimitate',
      'SLA garantat 99.9% uptime',
      'Backup în timp real',
      'Rapoarte multi-organizație',
      'Permisiuni RBAC avansate',
      'SSO (Single Sign-On)',
      'Onboarding dedicat și migrare asistată',
    ],
    limitations: [],
    supportLevel: 'dedicated',
    apiAccess: true,
    whiteLabel: true,
    customBranding: true,
    dataRetentionYears: 10,
    maxStorageGB: null, // unlimited
  },
];

/**
 * Helper function to get a plan by ID
 */
export function getPlanById(planId: string): PricingPlan | undefined {
  return pricingPlans.find(plan => plan.id === planId);
}

/**
 * Helper function to get plan price for specific currency and billing period
 */
export function getPlanPrice(
  planId: string,
  currency: Currency,
  billingPeriod: BillingPeriod
): number | null {
  const plan = getPlanById(planId);
  if (!plan) return null;

  return plan.pricing[currency][billingPeriod];
}

/**
 * Helper function to calculate monthly equivalent for yearly pricing
 */
export function getMonthlyEquivalent(
  planId: string,
  currency: Currency
): number | null {
  const yearlyPrice = getPlanPrice(planId, currency, 'yearly');
  if (!yearlyPrice) return null;

  return Math.round((yearlyPrice / 12) * 100) / 100;
}

/**
 * Helper function to calculate discount percentage for yearly billing
 */
export function getYearlyDiscount(planId: string, currency: Currency): number {
  const plan = getPlanById(planId);
  if (!plan) return 0;

  const monthlyPrice = plan.pricing[currency].monthly;
  const yearlyPrice = plan.pricing[currency].yearly;
  const yearlyAsMonthly = yearlyPrice / 12;

  const discount = ((monthlyPrice - yearlyAsMonthly) / monthlyPrice) * 100;
  return Math.round(discount);
}

/**
 * Currency symbols for display
 */
export const currencySymbols: Record<Currency, string> = {
  EUR: '€',
  RON: 'RON',
  BGN: 'лв',
  HUF: 'Ft',
  PLN: 'zł',
};

/**
 * Currency names for display
 */
export const currencyNames: Record<Currency, string> = {
  EUR: 'Euro',
  RON: 'Leu românesc',
  BGN: 'Lev bulgar',
  HUF: 'Forint maghiar',
  PLN: 'Zlot polonez',
};

/**
 * Default currency by country
 */
export const defaultCurrencyByCountry: Record<string, Currency> = {
  RO: 'RON',
  BG: 'BGN',
  HU: 'HUF',
  PL: 'PLN',
  DE: 'EUR',
};
