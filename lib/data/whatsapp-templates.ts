/**
 * WhatsApp Business API Message Templates
 *
 * Templates for SSM/PSI notifications, reminders, and reports
 * Conforms to WhatsApp Business API template message format
 */

export interface WhatsAppButton {
  type: 'quick_reply' | 'url' | 'phone_number';
  text: string;
  url?: string;
  phoneNumber?: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  language: 'ro' | 'en' | 'bg' | 'hu' | 'de';
  category: 'alert' | 'reminder' | 'report' | 'notification';
  headerText?: string;
  bodyTemplate: string;
  footerText?: string;
  buttons?: WhatsAppButton[];
}

/**
 * WhatsApp message templates collection
 * Placeholders format: {{1}}, {{2}}, etc. (WhatsApp Business API standard)
 */
export const whatsappTemplates: WhatsAppTemplate[] = [
  // Romanian Templates
  {
    id: 'ro_medical_expiry_alert',
    name: 'Alertă Expirare Control Medical',
    language: 'ro',
    category: 'alert',
    headerText: '⚠️ Alertă SSM',
    bodyTemplate: 'Bună ziua, {{1}}!\n\nControlul medical pentru angajatul *{{2}}* expiră pe data de *{{3}}*.\n\nVă rugăm să programați un nou control medical în cel mai scurt timp pentru a menține conformitatea SSM.',
    footerText: 's-s-m.ro - Platforma ta SSM/PSI',
    buttons: [
      {
        type: 'url',
        text: 'Vezi Detalii',
        url: 'https://app.s-s-m.ro/dashboard/medical'
      },
      {
        type: 'quick_reply',
        text: 'Am înțeles'
      }
    ]
  },
  {
    id: 'ro_training_reminder',
    name: 'Memento Instruire SSM',
    language: 'ro',
    category: 'reminder',
    headerText: '📋 Memento Instruire',
    bodyTemplate: 'Bună ziua, {{1}}!\n\nVă reamintim că instruirea SSM pentru *{{2}}* este programată pe data de *{{3}}* la ora *{{4}}*.\n\nLocație: {{5}}\n\nVă așteptăm!',
    footerText: 's-s-m.ro - Conformitate SSM',
    buttons: [
      {
        type: 'quick_reply',
        text: 'Confirm participarea'
      },
      {
        type: 'quick_reply',
        text: 'Nu pot participa'
      }
    ]
  },
  {
    id: 'ro_equipment_inspection_due',
    name: 'Scadență Verificare Echipamente',
    language: 'ro',
    category: 'reminder',
    headerText: '🔧 Verificare Echipamente',
    bodyTemplate: 'Bună ziua, {{1}}!\n\nEchipamentul *{{2}}* (Serie: {{3}}) necesită verificare tehnică până pe data de *{{4}}*.\n\nTip verificare: {{5}}\n\nVă rugăm să planificați verificarea pentru a evita penalizările.',
    footerText: 's-s-m.ro',
    buttons: [
      {
        type: 'url',
        text: 'Programează Verificare',
        url: 'https://app.s-s-m.ro/dashboard/equipment'
      }
    ]
  },
  {
    id: 'ro_monthly_report',
    name: 'Raport Lunar SSM',
    language: 'ro',
    category: 'report',
    headerText: '📊 Raport Lunar',
    bodyTemplate: 'Bună ziua, {{1}}!\n\nRaportul SSM pentru luna *{{2}}* este disponibil:\n\n✅ Conformități: {{3}}\n⚠️ Alerte active: {{4}}\n📅 Acțiuni programate: {{5}}\n\nVizualizați raportul complet în platformă.',
    footerText: 's-s-m.ro - Raportare SSM/PSI',
    buttons: [
      {
        type: 'url',
        text: 'Vezi Raport Complet',
        url: 'https://app.s-s-m.ro/dashboard/reports'
      }
    ]
  },

  // English Templates
  {
    id: 'en_medical_expiry_alert',
    name: 'Medical Check Expiry Alert',
    language: 'en',
    category: 'alert',
    headerText: '⚠️ OSH Alert',
    bodyTemplate: 'Hello {{1}},\n\nThe medical check for employee *{{2}}* expires on *{{3}}*.\n\nPlease schedule a new medical examination as soon as possible to maintain OSH compliance.',
    footerText: 's-s-m.ro - Your OSH Platform',
    buttons: [
      {
        type: 'url',
        text: 'View Details',
        url: 'https://app.s-s-m.ro/dashboard/medical'
      },
      {
        type: 'quick_reply',
        text: 'Acknowledged'
      }
    ]
  },
  {
    id: 'en_penalty_notification',
    name: 'Penalty Notification',
    language: 'en',
    category: 'alert',
    headerText: '⚠️ Compliance Alert',
    bodyTemplate: 'Hello {{1}},\n\nA new penalty has been recorded:\n\n*{{2}}*\n\nAmount: {{3}} {{4}}\nDeadline: {{5}}\n\nPlease review and take necessary action.',
    footerText: 's-s-m.ro',
    buttons: [
      {
        type: 'url',
        text: 'View Penalty',
        url: 'https://app.s-s-m.ro/dashboard/penalties'
      }
    ]
  },

  // Bulgarian Templates
  {
    id: 'bg_training_reminder',
    name: 'Напомняне за обучение',
    language: 'bg',
    category: 'reminder',
    headerText: '📋 Напомняне',
    bodyTemplate: 'Здравейте {{1}},\n\nНапомняме ви, че обучението по БЗР за *{{2}}* е насрочено за *{{3}}* в *{{4}}* часа.\n\nМясто: {{5}}\n\nОчакваме ви!',
    footerText: 's-s-m.ro - БЗР платформа',
    buttons: [
      {
        type: 'quick_reply',
        text: 'Потвърждавам'
      },
      {
        type: 'quick_reply',
        text: 'Не мога да присъствам'
      }
    ]
  },
  {
    id: 'bg_document_expiry',
    name: 'Изтичане на документ',
    language: 'bg',
    category: 'alert',
    headerText: '⚠️ Изтичащ документ',
    bodyTemplate: 'Здравейте {{1}},\n\nДокументът *{{2}}* изтича на *{{3}}*.\n\nМоля, подновете документа, за да поддържате съответствие с изискванията за БЗР.',
    footerText: 's-s-m.ro',
    buttons: [
      {
        type: 'url',
        text: 'Преглед',
        url: 'https://app.s-s-m.ro/dashboard/documents'
      }
    ]
  },

  // Multi-language notification templates
  {
    id: 'ro_fire_inspection_alert',
    name: 'Alertă Verificare PSI',
    language: 'ro',
    category: 'alert',
    headerText: '🔥 Alertă PSI',
    bodyTemplate: 'Bună ziua, {{1}}!\n\nVerificarea periodică PSI pentru *{{2}}* este programată pe *{{3}}*.\n\nTip verificare: {{4}}\nInspector: {{5}}\n\nVă rugăm să pregătiți documentația necesară.',
    footerText: 's-s-m.ro - Protecție și Stingere Incendii',
    buttons: [
      {
        type: 'url',
        text: 'Pregătește Documentele',
        url: 'https://app.s-s-m.ro/dashboard/documents'
      },
      {
        type: 'quick_reply',
        text: 'Contact Consultant'
      }
    ]
  },
  {
    id: 'en_employee_onboarding',
    name: 'Employee Onboarding Notification',
    language: 'en',
    category: 'notification',
    headerText: '👋 Welcome',
    bodyTemplate: 'Hello {{1}},\n\nWelcome to *{{2}}*!\n\nYour OSH onboarding is scheduled for *{{3}}*. You will receive:\n\n✓ Initial OSH training\n✓ Medical examination appointment\n✓ PPE assignment\n\nPlease bring your ID and medical history.',
    footerText: 's-s-m.ro - Your safety matters',
    buttons: [
      {
        type: 'url',
        text: 'View Checklist',
        url: 'https://app.s-s-m.ro/dashboard/onboarding'
      },
      {
        type: 'quick_reply',
        text: 'Confirmed'
      }
    ]
  }
];

/**
 * Get template by ID
 */
export function getTemplateById(templateId: string): WhatsAppTemplate | undefined {
  return whatsappTemplates.find(t => t.id === templateId);
}

/**
 * Get templates by language
 */
export function getTemplatesByLanguage(language: 'ro' | 'en' | 'bg' | 'hu' | 'de'): WhatsAppTemplate[] {
  return whatsappTemplates.filter(t => t.language === language);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: 'alert' | 'reminder' | 'report' | 'notification'): WhatsAppTemplate[] {
  return whatsappTemplates.filter(t => t.category === category);
}

/**
 * Format template with actual values
 * @param template - WhatsApp template
 * @param values - Array of values to replace placeholders {{1}}, {{2}}, etc.
 */
export function formatTemplate(template: WhatsAppTemplate, values: string[]): string {
  let formatted = template.bodyTemplate;
  values.forEach((value, index) => {
    formatted = formatted.replace(new RegExp(`\\{\\{${index + 1}\\}\\}`, 'g'), value);
  });
  return formatted;
}
