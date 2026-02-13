/**
 * Push Notification Templates for SSM/PSI Platform
 *
 * Template variables that can be used:
 * - {employeeName} - Numele angajatului
 * - {organizationName} - Numele organizației
 * - {date} - Data evenimentului
 * - {documentType} - Tipul documentului
 * - {alertType} - Tipul alertei
 * - {count} - Număr (zile, persoane, etc.)
 * - {equipmentName} - Numele echipamentului
 * - {trainingType} - Tipul instruirii
 */

export interface PushNotificationTemplate {
  id: string;
  name: string;
  titleTemplate: string;
  bodyTemplate: string;
  icon: string;
  actionUrl: string;
  priority: 'high' | 'normal' | 'low';
  vibrate: boolean;
  category: 'alert' | 'reminder' | 'info' | 'action';
}

export const pushTemplates: PushNotificationTemplate[] = [
  {
    id: 'urgent_alert',
    name: 'Alertă Urgentă SSM',
    titleTemplate: '🚨 ALERTĂ URGENTĂ: {alertType}',
    bodyTemplate: 'Necesită acțiune imediată pentru {organizationName}. Verificați detaliile în aplicație.',
    icon: '/icons/alert-urgent.png',
    actionUrl: '/dashboard/alerts',
    priority: 'high',
    vibrate: true,
    category: 'alert',
  },
  {
    id: 'medical_expiring',
    name: 'Expirare Aviz Medical',
    titleTemplate: '⚕️ Aviz Medical Expiră Curând',
    bodyTemplate: 'Avizul medical al lui {employeeName} expiră în {count} zile. Programați control medical.',
    icon: '/icons/medical.png',
    actionUrl: '/dashboard/medical',
    priority: 'high',
    vibrate: true,
    category: 'reminder',
  },
  {
    id: 'training_reminder',
    name: 'Reminder Instruire SSM',
    titleTemplate: '📚 Instruire SSM Necesară',
    bodyTemplate: '{employeeName} trebuie să participe la {trainingType} pe data de {date}.',
    icon: '/icons/training.png',
    actionUrl: '/dashboard/trainings',
    priority: 'normal',
    vibrate: false,
    category: 'reminder',
  },
  {
    id: 'report_ready',
    name: 'Raport Generat',
    titleTemplate: '✅ Raport Gata',
    bodyTemplate: 'Raportul {documentType} pentru {organizationName} este gata de descărcare.',
    icon: '/icons/document.png',
    actionUrl: '/dashboard/documents',
    priority: 'normal',
    vibrate: false,
    category: 'info',
  },
  {
    id: 'new_employee',
    name: 'Angajat Nou Adăugat',
    titleTemplate: '👤 Angajat Nou',
    bodyTemplate: '{employeeName} a fost adăugat în {organizationName}. Configurați documentele SSM necesare.',
    icon: '/icons/employee.png',
    actionUrl: '/dashboard/employees',
    priority: 'normal',
    vibrate: false,
    category: 'info',
  },
  {
    id: 'equipment_inspection',
    name: 'Verificare Echipament PSI',
    titleTemplate: '🧯 Verificare Echipament PSI',
    bodyTemplate: '{equipmentName} necesită verificare periodică în {count} zile.',
    icon: '/icons/equipment.png',
    actionUrl: '/dashboard/equipment',
    priority: 'normal',
    vibrate: true,
    category: 'reminder',
  },
  {
    id: 'penalty_warning',
    name: 'Avertizare Penalitate',
    titleTemplate: '⚠️ Risc Penalitate',
    bodyTemplate: 'Au fost identificate {count} neconformități care pot genera penalități ITM.',
    icon: '/icons/warning.png',
    actionUrl: '/dashboard/alerts',
    priority: 'high',
    vibrate: true,
    category: 'alert',
  },
  {
    id: 'document_expiring',
    name: 'Document Expiră',
    titleTemplate: '📄 Document în Expirare',
    bodyTemplate: '{documentType} expiră pe {date}. Actualizați documentul în timp util.',
    icon: '/icons/document-expire.png',
    actionUrl: '/dashboard/documents',
    priority: 'normal',
    vibrate: false,
    category: 'reminder',
  },
  {
    id: 'monthly_summary',
    name: 'Raport Lunar',
    titleTemplate: '📊 Raport Lunar SSM/PSI',
    bodyTemplate: 'Raportul lunar pentru {organizationName} este disponibil. {count} acțiuni necesită atenție.',
    icon: '/icons/report.png',
    actionUrl: '/dashboard',
    priority: 'low',
    vibrate: false,
    category: 'info',
  },
  {
    id: 'inspection_scheduled',
    name: 'Inspecție Programată',
    titleTemplate: '🔍 Inspecție ITM Programată',
    bodyTemplate: 'Inspecție ITM programată pentru {organizationName} pe {date}. Verificați conformitatea.',
    icon: '/icons/inspection.png',
    actionUrl: '/dashboard/alerts',
    priority: 'high',
    vibrate: true,
    category: 'action',
  },
];

/**
 * Helper function to replace template variables with actual values
 */
export function fillTemplate(
  template: string,
  variables: Record<string, string | number>
): string {
  let result = template;

  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{${key}}`;
    result = result.replace(new RegExp(placeholder, 'g'), String(value));
  });

  return result;
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): PushNotificationTemplate | undefined {
  return pushTemplates.find(template => template.id === id);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(
  category: PushNotificationTemplate['category']
): PushNotificationTemplate[] {
  return pushTemplates.filter(template => template.category === category);
}

/**
 * Get templates by priority
 */
export function getTemplatesByPriority(
  priority: PushNotificationTemplate['priority']
): PushNotificationTemplate[] {
  return pushTemplates.filter(template => template.priority === priority);
}
