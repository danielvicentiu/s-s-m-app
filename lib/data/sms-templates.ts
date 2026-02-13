/**
 * SMS Templates for SSM/PSI Platform
 * Maximum length: 160 characters per SMS
 */

export type SmsPriority = 'urgent' | 'normal';

export interface SmsTemplate {
  id: string;
  name: string;
  template: string;
  maxLength: number;
  priority: SmsPriority;
  placeholders: string[];
}

export const smsTemplates: SmsTemplate[] = [
  {
    id: 'medical-expiry-alert',
    name: 'Alertă expirare aviz medical',
    template: 'URGENT: Avizul medical pentru {employeeName} expiră pe {expiryDate}. Reprogramați controlul medical. - {organizationName}',
    maxLength: 160,
    priority: 'urgent',
    placeholders: ['employeeName', 'expiryDate', 'organizationName']
  },
  {
    id: 'training-expiry-alert',
    name: 'Alertă expirare instruire SSM',
    template: 'ATENȚIE: Instruirea SSM a expirat pentru {employeeName}. Reprogramați urgent la {organizationName}. Info: {phone}',
    maxLength: 160,
    priority: 'urgent',
    placeholders: ['employeeName', 'organizationName', 'phone']
  },
  {
    id: 'equipment-inspection-reminder',
    name: 'Reminder verificare echipament',
    template: 'Reminder: Verificarea {equipmentType} cu nr. {inventoryNumber} programată pe {inspectionDate}. - {organizationName}',
    maxLength: 160,
    priority: 'normal',
    placeholders: ['equipmentType', 'inventoryNumber', 'inspectionDate', 'organizationName']
  },
  {
    id: 'training-confirmation',
    name: 'Confirmare programare instruire',
    template: 'Confirmare: Instruire SSM programată pe {trainingDate} ora {trainingTime} la {location}. Info: {phone}',
    maxLength: 160,
    priority: 'normal',
    placeholders: ['trainingDate', 'trainingTime', 'location', 'phone']
  },
  {
    id: 'medical-appointment-confirmation',
    name: 'Confirmare control medical',
    template: 'Confirmare: Control medical {employeeName} pe {appointmentDate} ora {appointmentTime}. Locație: {clinicName}',
    maxLength: 160,
    priority: 'normal',
    placeholders: ['employeeName', 'appointmentDate', 'appointmentTime', 'clinicName']
  },
  {
    id: 'psi-training-reminder',
    name: 'Reminder instruire PSI',
    template: 'Reminder PSI: {employeeName} are instruirea în {daysLeft} zile. Programați la {organizationName}. Telefon: {phone}',
    maxLength: 160,
    priority: 'urgent',
    placeholders: ['employeeName', 'daysLeft', 'organizationName', 'phone']
  },
  {
    id: 'document-expiry-warning',
    name: 'Avertizare expirare document',
    template: 'Document {documentType} expiră în {daysLeft} zile. Reînnoiți urgent pentru a evita penalități. - {organizationName}',
    maxLength: 160,
    priority: 'urgent',
    placeholders: ['documentType', 'daysLeft', 'organizationName']
  },
  {
    id: 'inspection-scheduled',
    name: 'Notificare inspecție programată',
    template: 'Inspecție SSM programată pe {inspectionDate} ora {inspectionTime}. Pregătiți documentele. Consultant: {consultantName}',
    maxLength: 160,
    priority: 'normal',
    placeholders: ['inspectionDate', 'inspectionTime', 'consultantName']
  }
];

/**
 * Helper function to replace placeholders in SMS template
 * @param template - SMS template string
 * @param data - Object with placeholder values
 * @returns Processed SMS message
 */
export function fillSmsTemplate(
  template: string,
  data: Record<string, string>
): string {
  let message = template;

  Object.entries(data).forEach(([key, value]) => {
    message = message.replace(new RegExp(`{${key}}`, 'g'), value);
  });

  return message;
}

/**
 * Validate SMS message length
 * @param message - SMS message to validate
 * @returns boolean indicating if message is within SMS limits
 */
export function validateSmsLength(message: string): boolean {
  return message.length <= 160;
}

/**
 * Get template by ID
 * @param id - Template ID
 * @returns SmsTemplate or undefined
 */
export function getSmsTemplateById(id: string): SmsTemplate | undefined {
  return smsTemplates.find(template => template.id === id);
}
