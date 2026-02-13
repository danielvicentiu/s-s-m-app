/**
 * Feature Flags Configuration
 * Defines available feature flags for the SSM platform
 */

export type PlanType = 'free' | 'basic' | 'professional' | 'enterprise';

export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  defaultEnabled: boolean;
  requiredPlan: PlanType;
  rolloutPercentage: number; // 0-100
}

/**
 * Available feature flags for the platform
 */
export const FEATURE_FLAGS: FeatureFlag[] = [
  {
    key: 'nis2_module',
    name: 'Modul NIS2',
    description: 'Activează modulul de conformitate NIS2 pentru securitate cibernetică',
    defaultEnabled: false,
    requiredPlan: 'enterprise',
    rolloutPercentage: 0,
  },
  {
    key: 'whatsapp_alerts',
    name: 'Alerte WhatsApp',
    description: 'Trimite notificări și alerte prin WhatsApp',
    defaultEnabled: false,
    requiredPlan: 'professional',
    rolloutPercentage: 25,
  },
  {
    key: 'ai_assistant',
    name: 'Asistent AI',
    description: 'Asistent AI pentru generarea automată de documente și recomandări SSM',
    defaultEnabled: false,
    requiredPlan: 'professional',
    rolloutPercentage: 10,
  },
  {
    key: 'dark_mode',
    name: 'Mod întunecat',
    description: 'Interfață cu temă întunecată pentru lucrul pe timp de noapte',
    defaultEnabled: true,
    requiredPlan: 'free',
    rolloutPercentage: 100,
  },
  {
    key: 'api_access',
    name: 'Acces API',
    description: 'Acces la API REST pentru integrări externe',
    defaultEnabled: false,
    requiredPlan: 'enterprise',
    rolloutPercentage: 0,
  },
  {
    key: 'bulk_import',
    name: 'Import în masă',
    description: 'Import CSV/Excel pentru angajați, echipamente și documente',
    defaultEnabled: false,
    requiredPlan: 'professional',
    rolloutPercentage: 50,
  },
  {
    key: 'custom_reports',
    name: 'Rapoarte personalizate',
    description: 'Creare rapoarte personalizate cu filtre și exporturi avansate',
    defaultEnabled: false,
    requiredPlan: 'professional',
    rolloutPercentage: 40,
  },
  {
    key: 'multi_language',
    name: 'Multi-limbă',
    description: 'Suport pentru limbile RO, EN, BG, HU, DE',
    defaultEnabled: true,
    requiredPlan: 'basic',
    rolloutPercentage: 100,
  },
  {
    key: 'advanced_analytics',
    name: 'Analiză avansată',
    description: 'Dashboard-uri avansate cu statistici detaliate și predicții',
    defaultEnabled: false,
    requiredPlan: 'professional',
    rolloutPercentage: 30,
  },
  {
    key: 'document_templates',
    name: 'Șabloane documente',
    description: 'Biblioteca de șabloane editabile pentru documente SSM/PSI',
    defaultEnabled: true,
    requiredPlan: 'basic',
    rolloutPercentage: 100,
  },
  {
    key: 'email_notifications',
    name: 'Notificări email',
    description: 'Sistem de notificări automate prin email',
    defaultEnabled: true,
    requiredPlan: 'free',
    rolloutPercentage: 100,
  },
  {
    key: 'audit_trail',
    name: 'Jurnal audit',
    description: 'Istoric complet al modificărilor și acțiunilor utilizatorilor',
    defaultEnabled: false,
    requiredPlan: 'enterprise',
    rolloutPercentage: 0,
  },
  {
    key: 'mobile_app',
    name: 'Aplicație mobilă',
    description: 'Acces la aplicație mobilă iOS/Android',
    defaultEnabled: false,
    requiredPlan: 'professional',
    rolloutPercentage: 0,
  },
  {
    key: 'sso_login',
    name: 'Autentificare SSO',
    description: 'Single Sign-On cu Google, Microsoft și Azure AD',
    defaultEnabled: false,
    requiredPlan: 'enterprise',
    rolloutPercentage: 0,
  },
  {
    key: 'real_time_collaboration',
    name: 'Colaborare în timp real',
    description: 'Editare simultană și notificări în timp real între utilizatori',
    defaultEnabled: false,
    requiredPlan: 'professional',
    rolloutPercentage: 15,
  },
];

/**
 * Helper function to check if a feature is enabled
 * @param featureKey - The feature flag key
 * @param userPlan - The user's current plan
 * @returns boolean indicating if feature is enabled
 */
export function isFeatureEnabled(
  featureKey: string,
  userPlan: PlanType = 'free'
): boolean {
  const feature = FEATURE_FLAGS.find((f) => f.key === featureKey);

  if (!feature) {
    console.warn(`Feature flag "${featureKey}" not found`);
    return false;
  }

  // Check if user's plan meets the requirement
  const planHierarchy: PlanType[] = ['free', 'basic', 'professional', 'enterprise'];
  const userPlanIndex = planHierarchy.indexOf(userPlan);
  const requiredPlanIndex = planHierarchy.indexOf(feature.requiredPlan);

  if (userPlanIndex < requiredPlanIndex) {
    return false;
  }

  // Check default enabled state
  if (!feature.defaultEnabled) {
    return false;
  }

  // Check rollout percentage (simplified - in production would use user ID hashing)
  return feature.rolloutPercentage === 100;
}

/**
 * Get all available features for a specific plan
 * @param userPlan - The user's current plan
 * @returns Array of available feature flags
 */
export function getAvailableFeatures(userPlan: PlanType = 'free'): FeatureFlag[] {
  const planHierarchy: PlanType[] = ['free', 'basic', 'professional', 'enterprise'];
  const userPlanIndex = planHierarchy.indexOf(userPlan);

  return FEATURE_FLAGS.filter((feature) => {
    const requiredPlanIndex = planHierarchy.indexOf(feature.requiredPlan);
    return userPlanIndex >= requiredPlanIndex;
  });
}

/**
 * Get feature flag by key
 * @param featureKey - The feature flag key
 * @returns FeatureFlag or undefined
 */
export function getFeatureFlag(featureKey: string): FeatureFlag | undefined {
  return FEATURE_FLAGS.find((f) => f.key === featureKey);
}
