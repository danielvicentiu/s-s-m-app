/**
 * Email Templates Configuration
 *
 * Configurare centralizată pentru tipurile de email automate ale platformei SSM/PSI.
 * Aceste template-uri sunt folosite pentru notificări automate către utilizatori.
 */

export type EmailFrequency = 'once' | 'daily' | 'weekly' | 'monthly' | 'on_trigger';
export type EmailPriority = 'low' | 'medium' | 'high' | 'critical';

export interface EmailTemplate {
  id: string;
  name: string;
  subjectTemplate: string;
  triggerCondition: string;
  frequency: EmailFrequency;
  priority: EmailPriority;
  enabled: boolean;
  description?: string;
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'Email de Bun Venit',
    subjectTemplate: 'Bun venit pe platforma SSM/PSI - {{organizationName}}',
    triggerCondition: 'user_created',
    frequency: 'once',
    priority: 'medium',
    enabled: true,
    description: 'Trimis automat la crearea unui cont nou de utilizator'
  },
  {
    id: 'expiry-alert-30',
    name: 'Alertă Expirare - 30 Zile',
    subjectTemplate: 'ATENȚIE: {{documentType}} expiră în 30 de zile',
    triggerCondition: 'document_expires_in_30_days',
    frequency: 'daily',
    priority: 'medium',
    enabled: true,
    description: 'Alertă trimisă cu 30 de zile înainte de expirarea unui document/certificat'
  },
  {
    id: 'expiry-alert-7',
    name: 'Alertă Expirare - 7 Zile',
    subjectTemplate: 'URGENT: {{documentType}} expiră în 7 zile',
    triggerCondition: 'document_expires_in_7_days',
    frequency: 'daily',
    priority: 'high',
    enabled: true,
    description: 'Alertă urgentă trimisă cu 7 zile înainte de expirare'
  },
  {
    id: 'expiry-alert-0',
    name: 'Alertă Expirare - Astăzi',
    subjectTemplate: 'CRITIC: {{documentType}} expiră ASTĂZI',
    triggerCondition: 'document_expires_today',
    frequency: 'daily',
    priority: 'critical',
    enabled: true,
    description: 'Alertă critică pentru documente care expiră în ziua curentă'
  },
  {
    id: 'monthly-report',
    name: 'Raport Lunar SSM/PSI',
    subjectTemplate: 'Raport lunar {{month}} {{year}} - {{organizationName}}',
    triggerCondition: 'first_day_of_month',
    frequency: 'monthly',
    priority: 'medium',
    enabled: true,
    description: 'Raport lunar cu statistici și overview pentru organizație'
  },
  {
    id: 'training-reminder',
    name: 'Reminder Instructaj SSM',
    subjectTemplate: 'Reminder: Instructaj {{trainingType}} programat pentru {{date}}',
    triggerCondition: 'training_scheduled_in_3_days',
    frequency: 'daily',
    priority: 'high',
    enabled: true,
    description: 'Reminder trimis cu 3 zile înainte de un instructaj programat'
  },
  {
    id: 'medical-reminder',
    name: 'Reminder Control Medical',
    subjectTemplate: 'Reminder: Control medical programat pe {{date}}',
    triggerCondition: 'medical_appointment_in_7_days',
    frequency: 'daily',
    priority: 'high',
    enabled: true,
    description: 'Reminder pentru controale medicale programate în următoarele 7 zile'
  },
  {
    id: 'equipment-inspection',
    name: 'Reminder Verificare Echipamente',
    subjectTemplate: 'Verificare echipamente: {{equipmentType}} necesită inspecție',
    triggerCondition: 'equipment_inspection_due_in_14_days',
    frequency: 'weekly',
    priority: 'medium',
    enabled: true,
    description: 'Reminder pentru verificări periodice ale echipamentelor SSM/PSI'
  }
];

/**
 * Returnează un template de email după ID
 */
export function getEmailTemplateById(id: string): EmailTemplate | undefined {
  return EMAIL_TEMPLATES.find(template => template.id === id);
}

/**
 * Returnează toate template-urile active
 */
export function getEnabledEmailTemplates(): EmailTemplate[] {
  return EMAIL_TEMPLATES.filter(template => template.enabled);
}

/**
 * Returnează template-uri după prioritate
 */
export function getEmailTemplatesByPriority(priority: EmailPriority): EmailTemplate[] {
  return EMAIL_TEMPLATES.filter(template => template.priority === priority);
}

/**
 * Returnează template-uri după frecvență
 */
export function getEmailTemplatesByFrequency(frequency: EmailFrequency): EmailTemplate[] {
  return EMAIL_TEMPLATES.filter(template => template.frequency === frequency);
}
