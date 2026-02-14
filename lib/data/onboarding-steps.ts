/**
 * Onboarding Steps Data
 * Defines the guided onboarding flow for new users on the SSM/PSI platform
 */

export interface OnboardingStep {
  id: string;
  order: number;
  title: string;
  description: string;
  action: string;
  isRequired: boolean;
  estimatedMinutes: number;
  helpUrl: string;
}

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 'create-account',
    order: 1,
    title: 'Creează cont',
    description: 'Înregistrează-te pe platformă cu adresa de email și parola ta',
    action: '/auth/register',
    isRequired: true,
    estimatedMinutes: 2,
    helpUrl: '/help/getting-started#create-account'
  },
  {
    id: 'add-organization',
    order: 2,
    title: 'Adaugă firma',
    description: 'Completează datele firmei tale (CUI, denumire, adresă)',
    action: '/dashboard/settings/organization',
    isRequired: true,
    estimatedMinutes: 5,
    helpUrl: '/help/getting-started#add-organization'
  },
  {
    id: 'configure-modules',
    order: 3,
    title: 'Configurează module',
    description: 'Alege modulele necesare: SSM, PSI, Control medical, Dotări',
    action: '/dashboard/settings/modules',
    isRequired: true,
    estimatedMinutes: 3,
    helpUrl: '/help/getting-started#configure-modules'
  },
  {
    id: 'import-employees',
    order: 4,
    title: 'Importă angajați',
    description: 'Adaugă angajații firmei manual sau prin import CSV/Excel',
    action: '/dashboard/employees/import',
    isRequired: true,
    estimatedMinutes: 10,
    helpUrl: '/help/employees#import'
  },
  {
    id: 'setup-alerts',
    order: 5,
    title: 'Setează alerte',
    description: 'Configurează notificări pentru expirări și termene importante',
    action: '/dashboard/settings/alerts',
    isRequired: false,
    estimatedMinutes: 5,
    helpUrl: '/help/alerts#setup'
  },
  {
    id: 'add-documents',
    order: 6,
    title: 'Adaugă documente',
    description: 'Încarcă documentele SSM/PSI existente (planuri, autorizații)',
    action: '/dashboard/documents',
    isRequired: false,
    estimatedMinutes: 15,
    helpUrl: '/help/documents#upload'
  },
  {
    id: 'schedule-trainings',
    order: 7,
    title: 'Programează instruiri',
    description: 'Planifică instruirile SSM obligatorii pentru angajați',
    action: '/dashboard/trainings/schedule',
    isRequired: false,
    estimatedMinutes: 8,
    helpUrl: '/help/trainings#schedule'
  },
  {
    id: 'invite-colleagues',
    order: 8,
    title: 'Invită colegi',
    description: 'Adaugă alți utilizatori din firmă cu drepturi de acces',
    action: '/dashboard/settings/team',
    isRequired: false,
    estimatedMinutes: 3,
    helpUrl: '/help/team#invite'
  }
];

export default onboardingSteps;
