/**
 * Subscription Plans Configuration
 * Defines pricing tiers, features, and limits for s-s-m.ro platform
 * Multi-country pricing: RO, BG, HU, DE, PL
 */

export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'enterprise';
export type BillingCycle = 'monthly' | 'yearly';
export type CountryCode = 'RO' | 'BG' | 'HU' | 'DE' | 'PL';

export interface CountryPrice {
  /** Romania - RON */
  RO: number;
  /** Bulgaria - EUR */
  BG: number;
  /** Hungary - HUF */
  HU: number;
  /** Germany - EUR */
  DE: number;
  /** Poland - PLN */
  PL: number;
}

export interface SubscriptionLimits {
  /** Maximum number of employees */
  employees: number;
  /** Maximum number of documents (0 = unlimited) */
  documents: number;
  /** Maximum number of users in organization */
  users: number;
}

export interface SubscriptionPlan {
  /** Unique plan identifier */
  id: string;
  /** Display name */
  name: string;
  /** Tier level */
  tier: SubscriptionTier;
  /** Pricing per country and currency */
  prices: Record<BillingCycle, CountryPrice>;
  /** Available billing cycles */
  billingCycles: BillingCycle[];
  /** List of included features */
  features: string[];
  /** Usage limits */
  limits: SubscriptionLimits;
  /** Available modules (M1-M11) */
  modules: string[];
  /** Whether this is the most popular plan */
  isPopular?: boolean;
  /** Custom label (e.g., "Most Popular", "Best Value") */
  label?: string;
}

/**
 * Available subscription plans
 */
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    tier: 'free',
    prices: {
      monthly: {
        RO: 0,
        BG: 0,
        HU: 0,
        DE: 0,
        PL: 0,
      },
      yearly: {
        RO: 0,
        BG: 0,
        HU: 0,
        DE: 0,
        PL: 0,
      },
    },
    billingCycles: ['monthly'],
    features: [
      'Până la 5 angajați',
      'Modul SSM basic',
      'Rapoarte lunare simple',
      'Suport email',
      'Documente template basic',
    ],
    limits: {
      employees: 5,
      documents: 50,
      users: 2,
    },
    modules: ['M1'], // M1 = SSM Core
  },
  {
    id: 'basic',
    name: 'Basic',
    tier: 'basic',
    prices: {
      monthly: {
        RO: 199, // RON
        BG: 40,  // EUR
        HU: 15990, // HUF
        DE: 45,  // EUR
        PL: 189, // PLN
      },
      yearly: {
        RO: 1990, // ~17% discount
        BG: 400,
        HU: 159900,
        DE: 450,
        PL: 1890,
      },
    },
    billingCycles: ['monthly', 'yearly'],
    features: [
      'Până la 50 angajați',
      'Module SSM + PSI complete',
      'Rapoarte avansate',
      'Suport prioritar',
      'Toate documentele template',
      'Alerte și notificări',
      'Export PDF/Excel',
    ],
    limits: {
      employees: 50,
      documents: 500,
      users: 5,
    },
    modules: ['M1', 'M2', 'M3', 'M4'], // SSM + PSI + Medical + Training
    isPopular: true,
    label: 'Cel mai popular',
  },
  {
    id: 'pro',
    name: 'Pro',
    tier: 'pro',
    prices: {
      monthly: {
        RO: 499, // RON
        BG: 100, // EUR
        HU: 39990, // HUF
        DE: 110, // EUR
        PL: 469, // PLN
      },
      yearly: {
        RO: 4990, // ~17% discount
        BG: 1000,
        HU: 399900,
        DE: 1100,
        PL: 4690,
      },
    },
    billingCycles: ['monthly', 'yearly'],
    features: [
      'Până la 200 angajați',
      'Toate modulele (M1-M11)',
      'Rapoarte personalizate',
      'Suport prioritar 24/7',
      'API access',
      'Integrări avansate',
      'Audit trail complet',
      'Training online inclus',
      'Consultant dedicat',
    ],
    limits: {
      employees: 200,
      documents: 2000,
      users: 15,
    },
    modules: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11'],
    label: 'Best Value',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tier: 'enterprise',
    prices: {
      monthly: {
        RO: 1499, // RON - starting price
        BG: 300,  // EUR
        HU: 119900, // HUF
        DE: 350,  // EUR
        PL: 1399, // PLN
      },
      yearly: {
        RO: 14990, // ~17% discount
        BG: 3000,
        HU: 1199000,
        DE: 3500,
        PL: 13990,
      },
    },
    billingCycles: ['monthly', 'yearly'],
    features: [
      'Angajați nelimitați',
      'Toate modulele + personalizări',
      'Rapoarte și dashboard custom',
      'Suport dedicat 24/7',
      'SLA garantat',
      'API și webhooks complete',
      'Single Sign-On (SSO)',
      'Migrare asistată',
      'Training on-site',
      'Manager de cont dedicat',
      'Consultanță strategică SSM/PSI',
    ],
    limits: {
      employees: 0, // 0 = unlimited
      documents: 0, // unlimited
      users: 0,     // unlimited
    },
    modules: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11'],
    label: 'Contact Sales',
  },
];

/**
 * Module definitions (M1-M11)
 * Used to map module codes to their full names
 */
export const moduleDefinitions: Record<string, string> = {
  M1: 'SSM Core (Securitate și Sănătate în Muncă)',
  M2: 'PSI (Prevenire și Stingere Incendii)',
  M3: 'Examene Medicale',
  M4: 'Training și Instruire',
  M5: 'Echipamente de Protecție',
  M6: 'Evaluare Riscuri',
  M7: 'Incidente și Accidente',
  M8: 'Inspecții și Audituri',
  M9: 'Documente și Proceduri',
  M10: 'Raportare și Analytics',
  M11: 'Conformitate Legală',
};

/**
 * Get plan by tier
 */
export function getPlanByTier(tier: SubscriptionTier): SubscriptionPlan | undefined {
  return subscriptionPlans.find((plan) => plan.tier === tier);
}

/**
 * Get plan by ID
 */
export function getPlanById(id: string): SubscriptionPlan | undefined {
  return subscriptionPlans.find((plan) => plan.id === id);
}

/**
 * Calculate yearly savings percentage
 */
export function getYearlySavings(plan: SubscriptionPlan, country: CountryCode): number {
  const monthlyPrice = plan.prices.monthly[country];
  const yearlyPrice = plan.prices.yearly[country];

  if (monthlyPrice === 0 || yearlyPrice === 0) return 0;

  const monthlyTotal = monthlyPrice * 12;
  const savings = ((monthlyTotal - yearlyPrice) / monthlyTotal) * 100;

  return Math.round(savings);
}

/**
 * Get currency symbol by country code
 */
export function getCurrencySymbol(country: CountryCode): string {
  const symbols: Record<CountryCode, string> = {
    RO: 'RON',
    BG: '€',
    HU: 'Ft',
    DE: '€',
    PL: 'zł',
  };
  return symbols[country];
}

/**
 * Format price with currency
 */
export function formatPrice(amount: number, country: CountryCode): string {
  const symbol = getCurrencySymbol(country);

  // Format based on currency conventions
  if (country === 'HU') {
    return `${amount.toLocaleString('hu-HU')} ${symbol}`;
  }
  if (country === 'RO') {
    return `${amount.toLocaleString('ro-RO')} ${symbol}`;
  }
  if (country === 'PL') {
    return `${amount.toLocaleString('pl-PL')} ${symbol}`;
  }
  // EUR countries (BG, DE)
  return `${symbol}${amount.toLocaleString('de-DE')}`;
}
