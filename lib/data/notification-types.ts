/**
 * Notification Types Configuration
 * Defines all notification types available in the SSM/PSI platform
 */

export type NotificationChannel = 'email' | 'push' | 'in-app';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface NotificationType {
  id: string;
  titleTemplate: string;
  bodyTemplate: string;
  channels: NotificationChannel[];
  priority: NotificationPriority;
  icon: string;
}

/**
 * All available notification types
 * Templates support interpolation using {{variable}} syntax
 */
export const NOTIFICATION_TYPES: Record<string, NotificationType> = {
  // Training-related notifications
  training_expiring_30d: {
    id: 'training_expiring_30d',
    titleTemplate: 'Instruire expiră în 30 de zile',
    bodyTemplate: 'Instruirea "{{trainingName}}" pentru {{employeeName}} expiră pe {{expiryDate}}. Vă rugăm să programați reinstruirea.',
    channels: ['email', 'in-app'],
    priority: 'medium',
    icon: '⚠️',
  },

  training_expiring_7d: {
    id: 'training_expiring_7d',
    titleTemplate: 'URGENT: Instruire expiră în 7 zile',
    bodyTemplate: 'Instruirea "{{trainingName}}" pentru {{employeeName}} expiră pe {{expiryDate}}. Acțiune urgentă necesară!',
    channels: ['email', 'push', 'in-app'],
    priority: 'high',
    icon: '🚨',
  },

  training_expired: {
    id: 'training_expired',
    titleTemplate: 'Instruire EXPIRATĂ',
    bodyTemplate: 'Instruirea "{{trainingName}}" pentru {{employeeName}} a expirat pe {{expiryDate}}. Reinstruirea este obligatorie!',
    channels: ['email', 'push', 'in-app'],
    priority: 'urgent',
    icon: '❌',
  },

  // Medical-related notifications
  medical_expiring_30d: {
    id: 'medical_expiring_30d',
    titleTemplate: 'Aviz medical expiră în 30 de zile',
    bodyTemplate: 'Avizul medical al angajatului {{employeeName}} expiră pe {{expiryDate}}. Programați control medical.',
    channels: ['email', 'in-app'],
    priority: 'medium',
    icon: '🏥',
  },

  medical_expired: {
    id: 'medical_expired',
    titleTemplate: 'Aviz medical EXPIRAT',
    bodyTemplate: 'Avizul medical al angajatului {{employeeName}} a expirat pe {{expiryDate}}. Necesită control medical urgent!',
    channels: ['email', 'push', 'in-app'],
    priority: 'urgent',
    icon: '🚑',
  },

  // Equipment-related notifications
  equipment_inspection_due: {
    id: 'equipment_inspection_due',
    titleTemplate: 'Verificare echipament programată',
    bodyTemplate: 'Echipamentul "{{equipmentName}}" necesită verificare tehnică pe {{dueDate}}.',
    channels: ['email', 'in-app'],
    priority: 'high',
    icon: '🔧',
  },

  // Document-related notifications
  document_expiring: {
    id: 'document_expiring',
    titleTemplate: 'Document expiră în curând',
    bodyTemplate: 'Documentul "{{documentName}}" expiră pe {{expiryDate}}. Actualizați documentul.',
    channels: ['email', 'in-app'],
    priority: 'medium',
    icon: '📄',
  },

  // Employee-related notifications
  new_employee_added: {
    id: 'new_employee_added',
    titleTemplate: 'Angajat nou adăugat',
    bodyTemplate: 'Angajatul {{employeeName}} a fost adăugat în organizație. Configurați instruirile și controalele medicale.',
    channels: ['in-app'],
    priority: 'low',
    icon: '👤',
  },

  // Compliance notifications
  compliance_score_drop: {
    id: 'compliance_score_drop',
    titleTemplate: 'Scădere nivel conformitate',
    bodyTemplate: 'Scorul de conformitate a scăzut la {{score}}%. Reviziți alertele active.',
    channels: ['email', 'push', 'in-app'],
    priority: 'high',
    icon: '📉',
  },

  // System notifications
  system_maintenance: {
    id: 'system_maintenance',
    titleTemplate: 'Mentenanță sistem programată',
    bodyTemplate: 'Platforma va fi în mentenanță pe {{maintenanceDate}} între orele {{startTime}} - {{endTime}}.',
    channels: ['email', 'in-app'],
    priority: 'medium',
    icon: '🔨',
  },

  new_feature: {
    id: 'new_feature',
    titleTemplate: 'Funcționalitate nouă disponibilă',
    bodyTemplate: 'Am lansat o funcționalitate nouă: {{featureName}}. {{featureDescription}}',
    channels: ['in-app'],
    priority: 'low',
    icon: '✨',
  },

  // User onboarding notifications
  welcome: {
    id: 'welcome',
    titleTemplate: 'Bun venit în platforma SSM/PSI!',
    bodyTemplate: 'Bun venit, {{userName}}! Vă mulțumim că ați ales platforma noastră. Explorați funcționalitățile disponibile.',
    channels: ['email', 'in-app'],
    priority: 'low',
    icon: '👋',
  },

  invite_accepted: {
    id: 'invite_accepted',
    titleTemplate: 'Invitație acceptată',
    bodyTemplate: '{{userName}} a acceptat invitația dvs. și s-a alăturat organizației.',
    channels: ['in-app'],
    priority: 'low',
    icon: '✅',
  },

  // Report notifications
  report_ready: {
    id: 'report_ready',
    titleTemplate: 'Raport generat cu succes',
    bodyTemplate: 'Raportul "{{reportName}}" a fost generat și este disponibil pentru descărcare.',
    channels: ['email', 'in-app'],
    priority: 'low',
    icon: '📊',
  },

  // Alert resolution notifications
  alert_resolved: {
    id: 'alert_resolved',
    titleTemplate: 'Alertă rezolvată',
    bodyTemplate: 'Alerta "{{alertTitle}}" a fost marcată ca rezolvată de {{resolvedBy}}.',
    channels: ['in-app'],
    priority: 'low',
    icon: '✔️',
  },
};

/**
 * Get notification type configuration by ID
 */
export function getNotificationType(typeId: string): NotificationType | undefined {
  return NOTIFICATION_TYPES[typeId];
}

/**
 * Get all notification type IDs
 */
export function getAllNotificationTypeIds(): string[] {
  return Object.keys(NOTIFICATION_TYPES);
}

/**
 * Get notifications by priority
 */
export function getNotificationsByPriority(priority: NotificationPriority): NotificationType[] {
  return Object.values(NOTIFICATION_TYPES).filter(
    (notif) => notif.priority === priority
  );
}

/**
 * Get notifications by channel
 */
export function getNotificationsByChannel(channel: NotificationChannel): NotificationType[] {
  return Object.values(NOTIFICATION_TYPES).filter(
    (notif) => notif.channels.includes(channel)
  );
}
