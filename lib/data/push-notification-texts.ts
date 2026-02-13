/**
 * Push Notification Texts
 * Multi-language support for push notifications
 * Languages: RO (Romanian), BG (Bulgarian), EN (English), HU (Hungarian), DE (German), FR (French)
 */

export type NotificationType =
  | 'training_expiring'
  | 'medical_expiring'
  | 'equipment_inspection'
  | 'new_legislation'
  | 'compliance_drop'
  | 'welcome'
  | 'weekly_digest'
  | 'document_ready'
  | 'payment_due'
  | 'payment_overdue'
  | 'payment_success'
  | 'invite_accepted';

export type Locale = 'ro' | 'bg' | 'en' | 'hu' | 'de' | 'fr';

interface NotificationText {
  title: string;
  body: string;
  action?: string;
}

type NotificationTexts = {
  [K in NotificationType]: {
    [L in Locale]: NotificationText;
  };
};

export const pushNotificationTexts: NotificationTexts = {
  training_expiring: {
    ro: {
      title: 'Instruire SSM expiră în curând',
      body: 'Instruirea "{trainingName}" expiră în {days} zile. Programează reinstruirea acum.',
      action: 'Vezi detalii',
    },
    bg: {
      title: 'Обучението по БЗР изтича скоро',
      body: 'Обучението "{trainingName}" изтича след {days} дни. Планирайте преобучение сега.',
      action: 'Вижте детайли',
    },
    en: {
      title: 'OSH Training Expiring Soon',
      body: 'Training "{trainingName}" expires in {days} days. Schedule retraining now.',
      action: 'View details',
    },
    hu: {
      title: 'Munkavédelmi képzés hamarosan lejár',
      body: 'A(z) "{trainingName}" képzés {days} nap múlva lejár. Ütemezze be az átképzést most.',
      action: 'Részletek megtekintése',
    },
    de: {
      title: 'Arbeitsschutzschulung läuft bald ab',
      body: 'Schulung "{trainingName}" läuft in {days} Tagen ab. Planen Sie jetzt eine Nachschulung.',
      action: 'Details anzeigen',
    },
    fr: {
      title: 'Formation SST expire bientôt',
      body: 'La formation "{trainingName}" expire dans {days} jours. Planifiez le recyclage maintenant.',
      action: 'Voir les détails',
    },
  },

  medical_expiring: {
    ro: {
      title: 'Aviz medical expiră în curând',
      body: '{employeeCount} angajați au avize medicale care expiră în {days} zile.',
      action: 'Vezi lista',
    },
    bg: {
      title: 'Медицинското заключение изтича скоро',
      body: '{employeeCount} служители имат медицински заключения, които изтичат след {days} дни.',
      action: 'Вижте списъка',
    },
    en: {
      title: 'Medical Certificate Expiring Soon',
      body: '{employeeCount} employees have medical certificates expiring in {days} days.',
      action: 'View list',
    },
    hu: {
      title: 'Egészségügyi igazolás hamarosan lejár',
      body: '{employeeCount} alkalmazott egészségügyi igazolása {days} nap múlva lejár.',
      action: 'Lista megtekintése',
    },
    de: {
      title: 'Ärztliches Attest läuft bald ab',
      body: '{employeeCount} Mitarbeiter haben ärztliche Atteste, die in {days} Tagen ablaufen.',
      action: 'Liste anzeigen',
    },
    fr: {
      title: 'Certificat médical expire bientôt',
      body: '{employeeCount} employés ont des certificats médicaux expirant dans {days} jours.',
      action: 'Voir la liste',
    },
  },

  equipment_inspection: {
    ro: {
      title: 'Verificare echipament necesară',
      body: '{equipmentName} necesită verificare periodică. Scadență: {dueDate}.',
      action: 'Programează verificare',
    },
    bg: {
      title: 'Необходима проверка на оборудването',
      body: '{equipmentName} изисква периодична проверка. Краен срок: {dueDate}.',
      action: 'Планирайте проверка',
    },
    en: {
      title: 'Equipment Inspection Required',
      body: '{equipmentName} requires periodic inspection. Due date: {dueDate}.',
      action: 'Schedule inspection',
    },
    hu: {
      title: 'Berendezés ellenőrzés szükséges',
      body: '{equipmentName} időszakos ellenőrzést igényel. Határidő: {dueDate}.',
      action: 'Ellenőrzés ütemezése',
    },
    de: {
      title: 'Geräteinspektion erforderlich',
      body: '{equipmentName} erfordert regelmäßige Inspektion. Fälligkeitsdatum: {dueDate}.',
      action: 'Inspektion planen',
    },
    fr: {
      title: 'Inspection d\'équipement requise',
      body: '{equipmentName} nécessite une inspection périodique. Date limite: {dueDate}.',
      action: 'Planifier l\'inspection',
    },
  },

  new_legislation: {
    ro: {
      title: 'Legislație nouă SSM/PSI',
      body: '{legislationTitle} - verifică impact asupra conformității tale.',
      action: 'Citește mai mult',
    },
    bg: {
      title: 'Ново законодателство БЗР/ППО',
      body: '{legislationTitle} - проверете въздействието върху вашето съответствие.',
      action: 'Прочетете повече',
    },
    en: {
      title: 'New OSH/Fire Safety Legislation',
      body: '{legislationTitle} - check impact on your compliance.',
      action: 'Read more',
    },
    hu: {
      title: 'Új munkavédelmi/tűzvédelmi jogszabály',
      body: '{legislationTitle} - ellenőrizze a megfelelőségre gyakorolt hatást.',
      action: 'Olvasson többet',
    },
    de: {
      title: 'Neue Arbeitsschutz-/Brandschutzgesetzgebung',
      body: '{legislationTitle} - prüfen Sie die Auswirkungen auf Ihre Compliance.',
      action: 'Mehr lesen',
    },
    fr: {
      title: 'Nouvelle législation SST/sécurité incendie',
      body: '{legislationTitle} - vérifiez l\'impact sur votre conformité.',
      action: 'Lire la suite',
    },
  },

  compliance_drop: {
    ro: {
      title: 'Scădere nivel conformitate',
      body: 'Scorul de conformitate a scăzut la {score}%. Acțiune necesară urgent.',
      action: 'Vezi raport',
    },
    bg: {
      title: 'Спадане на нивото на съответствие',
      body: 'Оценката за съответствие е паднала до {score}%. Необходимо е спешно действие.',
      action: 'Вижте доклада',
    },
    en: {
      title: 'Compliance Level Drop',
      body: 'Compliance score has dropped to {score}%. Urgent action required.',
      action: 'View report',
    },
    hu: {
      title: 'Megfelelőségi szint csökkenés',
      body: 'A megfelelőségi pontszám {score}%-ra csökkent. Azonnali intézkedés szükséges.',
      action: 'Jelentés megtekintése',
    },
    de: {
      title: 'Compliance-Level gesunken',
      body: 'Compliance-Score ist auf {score}% gefallen. Dringende Maßnahmen erforderlich.',
      action: 'Bericht anzeigen',
    },
    fr: {
      title: 'Baisse du niveau de conformité',
      body: 'Le score de conformité est tombé à {score}%. Action urgente requise.',
      action: 'Voir le rapport',
    },
  },

  welcome: {
    ro: {
      title: 'Bun venit pe s-s-m.ro!',
      body: 'Începe să gestionezi conformitatea SSM/PSI mai eficient. Explorează dashboard-ul tău.',
      action: 'Începe acum',
    },
    bg: {
      title: 'Добре дошли в s-s-m.ro!',
      body: 'Започнете да управлявате съответствието по БЗР/ППО по-ефективно. Разгледайте вашия контролен панел.',
      action: 'Започнете сега',
    },
    en: {
      title: 'Welcome to s-s-m.ro!',
      body: 'Start managing OSH/Fire Safety compliance more efficiently. Explore your dashboard.',
      action: 'Get started',
    },
    hu: {
      title: 'Üdvözöljük az s-s-m.ro oldalon!',
      body: 'Kezdje el hatékonyabban kezelni a munkavédelmi/tűzvédelmi megfelelést. Fedezze fel irányítópultját.',
      action: 'Kezdje el most',
    },
    de: {
      title: 'Willkommen bei s-s-m.ro!',
      body: 'Verwalten Sie Arbeitsschutz-/Brandschutz-Compliance effizienter. Erkunden Sie Ihr Dashboard.',
      action: 'Jetzt starten',
    },
    fr: {
      title: 'Bienvenue sur s-s-m.ro!',
      body: 'Commencez à gérer la conformité SST/sécurité incendie plus efficacement. Explorez votre tableau de bord.',
      action: 'Commencer maintenant',
    },
  },

  weekly_digest: {
    ro: {
      title: 'Raport săptămânal SSM',
      body: '{taskCount} sarcini în așteptare, {expiringCount} expirări iminente. Revizuiește acum.',
      action: 'Vezi raportul',
    },
    bg: {
      title: 'Седмичен доклад БЗР',
      body: '{taskCount} чакащи задачи, {expiringCount} предстоящи изтичания. Прегледайте сега.',
      action: 'Вижте доклада',
    },
    en: {
      title: 'Weekly OSH Report',
      body: '{taskCount} pending tasks, {expiringCount} upcoming expirations. Review now.',
      action: 'View report',
    },
    hu: {
      title: 'Heti munkavédelmi jelentés',
      body: '{taskCount} függőben lévő feladat, {expiringCount} közelgő lejárat. Tekintse át most.',
      action: 'Jelentés megtekintése',
    },
    de: {
      title: 'Wöchentlicher Arbeitsschutzbericht',
      body: '{taskCount} ausstehende Aufgaben, {expiringCount} bevorstehende Abläufe. Jetzt überprüfen.',
      action: 'Bericht anzeigen',
    },
    fr: {
      title: 'Rapport hebdomadaire SST',
      body: '{taskCount} tâches en attente, {expiringCount} expirations imminentes. Examinez maintenant.',
      action: 'Voir le rapport',
    },
  },

  document_ready: {
    ro: {
      title: 'Document generat cu succes',
      body: '{documentName} este gata pentru descărcare.',
      action: 'Descarcă acum',
    },
    bg: {
      title: 'Документът е генериран успешно',
      body: '{documentName} е готов за изтегляне.',
      action: 'Изтеглете сега',
    },
    en: {
      title: 'Document Generated Successfully',
      body: '{documentName} is ready for download.',
      action: 'Download now',
    },
    hu: {
      title: 'Dokumentum sikeresen létrehozva',
      body: '{documentName} letöltésre kész.',
      action: 'Letöltés most',
    },
    de: {
      title: 'Dokument erfolgreich erstellt',
      body: '{documentName} steht zum Download bereit.',
      action: 'Jetzt herunterladen',
    },
    fr: {
      title: 'Document généré avec succès',
      body: '{documentName} est prêt à être téléchargé.',
      action: 'Télécharger maintenant',
    },
  },

  payment_due: {
    ro: {
      title: 'Plată scadentă',
      body: 'Factura #{invoiceNumber} de {amount} RON scade pe {dueDate}.',
      action: 'Plătește acum',
    },
    bg: {
      title: 'Предстоящо плащане',
      body: 'Фактура #{invoiceNumber} за {amount} лв. е с падеж на {dueDate}.',
      action: 'Платете сега',
    },
    en: {
      title: 'Payment Due',
      body: 'Invoice #{invoiceNumber} for {amount} RON is due on {dueDate}.',
      action: 'Pay now',
    },
    hu: {
      title: 'Fizetési határidő',
      body: '#{invoiceNumber} számla {amount} RON összegben esedékes: {dueDate}.',
      action: 'Fizessen most',
    },
    de: {
      title: 'Zahlung fällig',
      body: 'Rechnung #{invoiceNumber} über {amount} RON ist fällig am {dueDate}.',
      action: 'Jetzt bezahlen',
    },
    fr: {
      title: 'Paiement dû',
      body: 'La facture #{invoiceNumber} de {amount} RON est due le {dueDate}.',
      action: 'Payer maintenant',
    },
  },

  payment_overdue: {
    ro: {
      title: 'Plată restantă',
      body: 'Factura #{invoiceNumber} de {amount} RON este întârziată cu {days} zile.',
      action: 'Plătește urgent',
    },
    bg: {
      title: 'Просрочено плащане',
      body: 'Фактура #{invoiceNumber} за {amount} лв. е просрочена с {days} дни.',
      action: 'Платете спешно',
    },
    en: {
      title: 'Payment Overdue',
      body: 'Invoice #{invoiceNumber} for {amount} RON is {days} days overdue.',
      action: 'Pay urgently',
    },
    hu: {
      title: 'Lejárt fizetés',
      body: '#{invoiceNumber} számla {amount} RON összegben {days} napja lejárt.',
      action: 'Azonnali fizetés',
    },
    de: {
      title: 'Überfällige Zahlung',
      body: 'Rechnung #{invoiceNumber} über {amount} RON ist {days} Tage überfällig.',
      action: 'Dringend bezahlen',
    },
    fr: {
      title: 'Paiement en retard',
      body: 'La facture #{invoiceNumber} de {amount} RON est en retard de {days} jours.',
      action: 'Payer de toute urgence',
    },
  },

  payment_success: {
    ro: {
      title: 'Plată confirmată',
      body: 'Plata de {amount} RON pentru factura #{invoiceNumber} a fost procesată cu succes.',
      action: 'Vezi chitanța',
    },
    bg: {
      title: 'Плащането е потвърдено',
      body: 'Плащането от {amount} лв. за фактура #{invoiceNumber} е обработено успешно.',
      action: 'Вижте разписката',
    },
    en: {
      title: 'Payment Confirmed',
      body: 'Payment of {amount} RON for invoice #{invoiceNumber} has been processed successfully.',
      action: 'View receipt',
    },
    hu: {
      title: 'Fizetés megerősítve',
      body: 'A(z) #{invoiceNumber} számlára történt {amount} RON fizetés sikeresen feldolgozva.',
      action: 'Nyugta megtekintése',
    },
    de: {
      title: 'Zahlung bestätigt',
      body: 'Zahlung von {amount} RON für Rechnung #{invoiceNumber} wurde erfolgreich verarbeitet.',
      action: 'Quittung anzeigen',
    },
    fr: {
      title: 'Paiement confirmé',
      body: 'Le paiement de {amount} RON pour la facture #{invoiceNumber} a été traité avec succès.',
      action: 'Voir le reçu',
    },
  },

  invite_accepted: {
    ro: {
      title: 'Invitație acceptată',
      body: '{userName} s-a alăturat organizației tale și este gata să lucreze.',
      action: 'Vezi echipa',
    },
    bg: {
      title: 'Поканата е приета',
      body: '{userName} се присъедини към вашата организация и е готов да работи.',
      action: 'Вижте екипа',
    },
    en: {
      title: 'Invitation Accepted',
      body: '{userName} has joined your organization and is ready to work.',
      action: 'View team',
    },
    hu: {
      title: 'Meghívás elfogadva',
      body: '{userName} csatlakozott a szervezetéhez és készen áll a munkára.',
      action: 'Csapat megtekintése',
    },
    de: {
      title: 'Einladung angenommen',
      body: '{userName} ist Ihrer Organisation beigetreten und bereit zu arbeiten.',
      action: 'Team anzeigen',
    },
    fr: {
      title: 'Invitation acceptée',
      body: '{userName} a rejoint votre organisation et est prêt à travailler.',
      action: 'Voir l\'équipe',
    },
  },
};

/**
 * Helper function to get notification text by type and locale
 * @param type - The notification type
 * @param locale - The user's locale (defaults to 'ro')
 * @param variables - Optional variables to replace in the text (e.g., {trainingName}, {days})
 * @returns The notification text object
 */
export function getNotificationText(
  type: NotificationType,
  locale: Locale = 'ro',
  variables?: Record<string, string | number>
): NotificationText {
  const notification = pushNotificationTexts[type][locale];

  if (!variables) {
    return notification;
  }

  // Replace variables in title and body
  let title = notification.title;
  let body = notification.body;

  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{${key}}`;
    title = title.replace(placeholder, String(value));
    body = body.replace(placeholder, String(value));
  });

  return {
    title,
    body,
    action: notification.action,
  };
}

/**
 * Helper function to get all notification types
 * @returns Array of all notification types
 */
export function getAllNotificationTypes(): NotificationType[] {
  return [
    'training_expiring',
    'medical_expiring',
    'equipment_inspection',
    'new_legislation',
    'compliance_drop',
    'welcome',
    'weekly_digest',
    'document_ready',
    'payment_due',
    'payment_overdue',
    'payment_success',
    'invite_accepted',
  ];
}

/**
 * Helper function to get all supported locales
 * @returns Array of all supported locales
 */
export function getSupportedLocales(): Locale[] {
  return ['ro', 'bg', 'en', 'hu', 'de', 'fr'];
}
