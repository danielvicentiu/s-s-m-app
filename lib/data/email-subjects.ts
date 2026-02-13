/**
 * Email Subject Lines and Preheaders
 * Optimized for engagement across 6 languages (RO, BG, EN, HU, DE, PL)
 */

export type EmailEventType =
  | 'welcome'
  | 'expiry_30d'
  | 'expiry_7d'
  | 'expired'
  | 'monthly_report'
  | 'training_reminder'
  | 'medical_reminder'
  | 'equipment_alert'
  | 'invite'
  | 'password_reset';

export type Locale = 'ro' | 'bg' | 'en' | 'hu' | 'de' | 'pl';

interface EmailSubjectConfig {
  eventType: EmailEventType;
  subjects: Record<Locale, string>;
  preheaders: Record<Locale, string>;
}

export const emailSubjects: Record<EmailEventType, EmailSubjectConfig> = {
  welcome: {
    eventType: 'welcome',
    subjects: {
      ro: '🎉 Bine ai venit la S-S-M.ro - Contul tău este activ!',
      bg: '🎉 Добре дошли в S-S-M.ro - Вашият акаунт е активен!',
      en: '🎉 Welcome to S-S-M.ro - Your account is ready!',
      hu: '🎉 Üdvözöljük az S-S-M.ro-n - Fiókja aktív!',
      de: '🎉 Willkommen bei S-S-M.ro - Ihr Konto ist aktiv!',
      pl: '🎉 Witamy w S-S-M.ro - Twoje konto jest aktywne!',
    },
    preheaders: {
      ro: 'Începe să gestionezi compliance-ul SSM/PSI cu ușurință. Descoperă toate funcțiile platformei.',
      bg: 'Започнете да управлявате вашия OZT/PBZ комплайънс лесно. Разгледайте всички функции.',
      en: 'Start managing your OSH/Fire compliance with ease. Explore all platform features.',
      hu: 'Kezdje el könnyedén kezelni munkabiztonsági és tűzvédelmi megfelelőségét.',
      de: 'Beginnen Sie einfach mit der Verwaltung Ihrer Arbeitsschutz- und Brandschutz-Compliance.',
      pl: 'Rozpocznij zarządzanie zgodnością BHP/ppoż. z łatwością. Poznaj wszystkie funkcje.',
    },
  },

  expiry_30d: {
    eventType: 'expiry_30d',
    subjects: {
      ro: '⏰ Atenție: Documente SSM/PSI expiră în 30 de zile',
      bg: '⏰ Внимание: OZT/PBZ документи изтичат след 30 дни',
      en: '⏰ Attention: OSH/Fire documents expire in 30 days',
      hu: '⏰ Figyelem: Munkavédelmi/tűzvédelmi dokumentumok 30 nap múlva lejárnak',
      de: '⏰ Achtung: Arbeitsschutz-/Brandschutz-Dokumente laufen in 30 Tagen ab',
      pl: '⏰ Uwaga: Dokumenty BHP/ppoż. wygasają za 30 dni',
    },
    preheaders: {
      ro: 'Acționează acum pentru a evita conformitatea. Vezi lista completă de documente și certificate care necesită reînnoire.',
      bg: 'Действайте сега, за да избегнете несъответствие. Вижте пълния списък на документи за подновяване.',
      en: 'Act now to avoid non-compliance. See the full list of documents and certificates requiring renewal.',
      hu: 'Cselekedjen most a megfelelőség fenntartása érdekében. Tekintse meg a megújítandó dokumentumok listáját.',
      de: 'Handeln Sie jetzt, um Compliance-Probleme zu vermeiden. Sehen Sie die Liste der zu erneuernden Dokumente.',
      pl: 'Działaj teraz, aby uniknąć niezgodności. Zobacz pełną listę dokumentów wymagających odnowienia.',
    },
  },

  expiry_7d: {
    eventType: 'expiry_7d',
    subjects: {
      ro: '🚨 URGENT: Documente SSM/PSI expiră în 7 zile!',
      bg: '🚨 СПЕШНО: OZT/PBZ документи изтичат след 7 дни!',
      en: '🚨 URGENT: OSH/Fire documents expire in 7 days!',
      hu: '🚨 SÜRGŐS: Munkavédelmi/tűzvédelmi dokumentumok 7 nap múlva lejárnak!',
      de: '🚨 DRINGEND: Arbeitsschutz-/Brandschutz-Dokumente laufen in 7 Tagen ab!',
      pl: '🚨 PILNE: Dokumenty BHP/ppoż. wygasają za 7 dni!',
    },
    preheaders: {
      ro: 'Timp limitat! Verifică imediat certificatele și documentele care expiră curând pentru a menține conformitatea.',
      bg: 'Ограничено време! Проверете незабавно сертификатите и документите, които изтичат скоро.',
      en: 'Limited time! Check immediately the certificates and documents expiring soon to maintain compliance.',
      hu: 'Korlátozott idő! Ellenőrizze azonnal a hamarosan lejáró tanúsítványokat és dokumentumokat.',
      de: 'Begrenzte Zeit! Überprüfen Sie sofort die bald ablaufenden Zertifikate und Dokumente.',
      pl: 'Ograniczony czas! Sprawdź natychmiast certyfikaty i dokumenty wygasające wkrótce.',
    },
  },

  expired: {
    eventType: 'expired',
    subjects: {
      ro: '❌ ATENȚIE: Documente SSM/PSI au expirat - Acțiune necesară',
      bg: '❌ ВНИМАНИЕ: OZT/PBZ документи са изтекли - Необходимо действие',
      en: '❌ WARNING: OSH/Fire documents have expired - Action required',
      hu: '❌ FIGYELMEZTETÉS: Munkavédelmi/tűzvédelmi dokumentumok lejártak - Azonnali teendő',
      de: '❌ WARNUNG: Arbeitsschutz-/Brandschutz-Dokumente sind abgelaufen - Maßnahmen erforderlich',
      pl: '❌ OSTRZEŻENIE: Dokumenty BHP/ppoż. wygasły - Wymagane działanie',
    },
    preheaders: {
      ro: 'Documente expirate pot duce la sancțiuni și amenzi. Accesează dashboard-ul pentru detalii și acțiuni imediate.',
      bg: 'Изтеклите документи могат да доведат до санкции и глоби. Влезте в таблото за детайли.',
      en: 'Expired documents may lead to penalties and fines. Access your dashboard for details and immediate actions.',
      hu: 'A lejárt dokumentumok bírságokat vonhatnak maguk után. Lépjen be a vezérlőpultba a részletekért.',
      de: 'Abgelaufene Dokumente können zu Strafen und Bußgeldern führen. Greifen Sie auf Ihr Dashboard zu.',
      pl: 'Wygasłe dokumenty mogą prowadzić do kar i grzywien. Przejdź do panelu po szczegóły.',
    },
  },

  monthly_report: {
    eventType: 'monthly_report',
    subjects: {
      ro: '📊 Raport lunar SSM/PSI - {{month}} {{year}}',
      bg: '📊 Месечен OZT/PBZ доклад - {{month}} {{year}}',
      en: '📊 Monthly OSH/Fire Report - {{month}} {{year}}',
      hu: '📊 Havi munkavédelmi/tűzvédelmi jelentés - {{year}} {{month}}',
      de: '📊 Monatlicher Arbeitsschutz-/Brandschutz-Bericht - {{month}} {{year}}',
      pl: '📊 Miesięczny raport BHP/ppoż. - {{month}} {{year}}',
    },
    preheaders: {
      ro: 'Situația actualizată a angajaților, instruirilor, certificatelor medicale și echipamentelor. Descarcă raportul complet.',
      bg: 'Актуализирано състояние на служителите, обученията, медицинските прегледи и оборудването.',
      en: 'Updated status of employees, trainings, medical certificates, and equipment. Download full report.',
      hu: 'A munkavállalók, képzések, orvosi igazolások és felszerelések frissített állapota.',
      de: 'Aktualisierter Status von Mitarbeitern, Schulungen, ärztlichen Bescheinigungen und Ausrüstung.',
      pl: 'Zaktualizowany stan pracowników, szkoleń, badań lekarskich i sprzętu. Pobierz pełny raport.',
    },
  },

  training_reminder: {
    eventType: 'training_reminder',
    subjects: {
      ro: '📚 Reminder: Instruire SSM programată pentru {{date}}',
      bg: '📚 Напомняне: OZT обучение планирано за {{date}}',
      en: '📚 Reminder: OSH training scheduled for {{date}}',
      hu: '📚 Emlékeztető: Munkavédelmi képzés ütemezve {{date}}',
      de: '📚 Erinnerung: Arbeitsschutzschulung geplant für {{date}}',
      pl: '📚 Przypomnienie: Szkolenie BHP zaplanowane na {{date}}',
    },
    preheaders: {
      ro: 'Nu uita să participi la instruirea obligatorie. Confirmă prezența și verifică toate detaliile despre instruire.',
      bg: 'Не забравяйте да присъствате на задължителното обучение. Потвърдете присъствието си.',
      en: 'Don\'t forget to attend the mandatory training. Confirm attendance and check all training details.',
      hu: 'Ne felejtse el részt venni a kötelező képzésen. Erősítse meg jelenlétét.',
      de: 'Vergessen Sie nicht, an der Pflichtschulung teilzunehmen. Bestätigen Sie Ihre Teilnahme.',
      pl: 'Nie zapomnij uczestniczyć w obowiązkowym szkoleniu. Potwierdź obecność i sprawdź szczegóły.',
    },
  },

  medical_reminder: {
    eventType: 'medical_reminder',
    subjects: {
      ro: '🏥 Reminder: Control medical de medicina muncii scadent',
      bg: '🏥 Напомняне: Изтичащ трудово-медицински преглед',
      en: '🏥 Reminder: Occupational health check-up expiring',
      hu: '🏥 Emlékeztető: Lejáró munkaegészségügyi vizsgálat',
      de: '🏥 Erinnerung: Arbeitsmedizinische Untersuchung läuft ab',
      pl: '🏥 Przypomnienie: Wygasające badania lekarskie',
    },
    preheaders: {
      ro: 'Certificatul medical de medicina muncii necesită reînnoire. Programează-te la cabinetul medical partener.',
      bg: 'Трудово-медицинското свидетелство изисква подновяване. Запишете се при партньорски лекар.',
      en: 'Occupational health certificate requires renewal. Schedule appointment with partner medical office.',
      hu: 'A munkaegészségügyi igazolás megújítást igényel. Foglaljon időpontot a partner orvosi rendelőben.',
      de: 'Das arbeitsmedizinische Zeugnis muss erneuert werden. Vereinbaren Sie einen Termin.',
      pl: 'Zaświadczenie lekarskie wymaga odnowienia. Umów się na wizytę w partnerskim gabinecie.',
    },
  },

  equipment_alert: {
    eventType: 'equipment_alert',
    subjects: {
      ro: '⚠️ Alertă: Echipament SSM/PSI necesită atenție',
      bg: '⚠️ Сигнал: OZT/PBZ оборудване изисква внимание',
      en: '⚠️ Alert: OSH/Fire equipment requires attention',
      hu: '⚠️ Figyelmeztetés: Munkavédelmi/tűzvédelmi felszerelés figyelmet igényel',
      de: '⚠️ Warnung: Arbeitsschutz-/Brandschutz-Ausrüstung erfordert Aufmerksamkeit',
      pl: '⚠️ Alert: Sprzęt BHP/ppoż. wymaga uwagi',
    },
    preheaders: {
      ro: 'Verificare, revizie tehnică sau înlocuire necesară pentru echipamentul de protecție. Vezi detalii complete.',
      bg: 'Необходима проверка, технически преглед или подмяна на защитното оборудване.',
      en: 'Inspection, technical review, or replacement needed for protective equipment. See full details.',
      hu: 'Ellenőrzés, műszaki felülvizsgálat vagy csere szükséges a védőfelszereléshez.',
      de: 'Inspektion, technische Überprüfung oder Austausch der Schutzausrüstung erforderlich.',
      pl: 'Wymagana kontrola, przegląd techniczny lub wymiana sprzętu ochronnego. Zobacz szczegóły.',
    },
  },

  invite: {
    eventType: 'invite',
    subjects: {
      ro: '👥 Ai fost invitat să te alături echipei pe S-S-M.ro',
      bg: '👥 Поканени сте да се присъедините към екипа в S-S-M.ro',
      en: '👥 You\'ve been invited to join the team on S-S-M.ro',
      hu: '👥 Meghívást kapott, hogy csatlakozzon a csapathoz az S-S-M.ro-n',
      de: '👥 Sie wurden eingeladen, dem Team auf S-S-M.ro beizutreten',
      pl: '👥 Zostałeś zaproszony do dołączenia do zespołu w S-S-M.ro',
    },
    preheaders: {
      ro: '{{inviterName}} te-a adăugat în organizația {{orgName}}. Acceptă invitația pentru acces complet la platformă.',
      bg: '{{inviterName}} ви добави в организация {{orgName}}. Приемете поканата за пълен достъп.',
      en: '{{inviterName}} added you to {{orgName}} organization. Accept invitation for full platform access.',
      hu: '{{inviterName}} hozzáadta Önt a(z) {{orgName}} szervezethez. Fogadja el a meghívást.',
      de: '{{inviterName}} hat Sie zur Organisation {{orgName}} hinzugefügt. Nehmen Sie die Einladung an.',
      pl: '{{inviterName}} dodał Cię do organizacji {{orgName}}. Zaakceptuj zaproszenie dla pełnego dostępu.',
    },
  },

  password_reset: {
    eventType: 'password_reset',
    subjects: {
      ro: '🔐 Resetare parolă - S-S-M.ro',
      bg: '🔐 Нулиране на парола - S-S-M.ro',
      en: '🔐 Password Reset - S-S-M.ro',
      hu: '🔐 Jelszó visszaállítás - S-S-M.ro',
      de: '🔐 Passwort zurücksetzen - S-S-M.ro',
      pl: '🔐 Resetowanie hasła - S-S-M.ro',
    },
    preheaders: {
      ro: 'Ai solicitat resetarea parolei. Link-ul este valabil 60 de minute. Dacă nu ai făcut cererea, ignoră acest email.',
      bg: 'Поискали сте нулиране на паролата. Връзката е валидна 60 минути. Ако не сте Вие, игнорирайте имейла.',
      en: 'You requested a password reset. Link is valid for 60 minutes. If you didn\'t request this, ignore this email.',
      hu: 'Jelszó-visszaállítást kért. A link 60 percig érvényes. Ha nem Ön kérte, hagyja figyelmen kívül.',
      de: 'Sie haben eine Passwortzurücksetzung angefordert. Link ist 60 Minuten gültig. Falls nicht, ignorieren Sie diese E-Mail.',
      pl: 'Poprosiłeś o reset hasła. Link ważny przez 60 minut. Jeśli to nie Ty, zignoruj tego maila.',
    },
  },
};

/**
 * Get email subject and preheader for specific event type and locale
 */
export function getEmailSubject(
  eventType: EmailEventType,
  locale: Locale = 'ro'
): { subject: string; preheader: string } {
  const config = emailSubjects[eventType];

  if (!config) {
    console.warn(`Unknown email event type: ${eventType}`);
    return {
      subject: 'S-S-M.ro Notification',
      preheader: 'Important notification from your OSH/Fire compliance platform',
    };
  }

  return {
    subject: config.subjects[locale] || config.subjects.ro,
    preheader: config.preheaders[locale] || config.preheaders.ro,
  };
}

/**
 * Replace template variables in subject/preheader
 */
export function replaceEmailVariables(
  text: string,
  variables: Record<string, string>
): string {
  let result = text;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  return result;
}

/**
 * Get all available email event types
 */
export function getEmailEventTypes(): EmailEventType[] {
  return Object.keys(emailSubjects) as EmailEventType[];
}

/**
 * Get all supported locales
 */
export function getSupportedLocales(): Locale[] {
  return ['ro', 'bg', 'en', 'hu', 'de', 'pl'];
}
