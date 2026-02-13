/**
 * Email translations for 6 languages: RO, BG, HU, DE, PL, EN
 * Templates: welcome, alert_expiry, monthly_report, password_reset, invitation, training_reminder
 */

export type EmailTemplate =
  | 'welcome'
  | 'alert_expiry'
  | 'monthly_report'
  | 'password_reset'
  | 'invitation'
  | 'training_reminder';

export type SupportedLocale = 'ro' | 'bg' | 'hu' | 'de' | 'pl' | 'en';

export interface EmailTranslation {
  subject: string;
  greeting: string;
  body: string;
  cta_button: string;
  footer: string;
}

const emailTranslations: Record<
  EmailTemplate,
  Record<SupportedLocale, EmailTranslation>
> = {
  welcome: {
    ro: {
      subject: 'Bun venit pe platforma S-S-M.ro!',
      greeting: 'Bun venit',
      body: 'Vă mulțumim că v-ați înregistrat pe platforma S-S-M.ro! Contul dumneavoastră a fost creat cu succes. Puteți accesa acum toate funcționalitățile platformei pentru gestionarea conformității SSM și PSI.',
      cta_button: 'Accesează Platforma',
      footer: 'Dacă aveți întrebări, nu ezitați să ne contactați. Echipa S-S-M.ro',
    },
    bg: {
      subject: 'Добре дошли в платформата S-S-M.ro!',
      greeting: 'Добре дошли',
      body: 'Благодарим ви, че се регистрирахте на платформата S-S-M.ro! Вашият акаунт е създаден успешно. Сега имате достъп до всички функции на платформата за управление на съответствието с БЗР и ПБ.',
      cta_button: 'Достъп до платформата',
      footer: 'Ако имате въпроси, не се колебайте да се свържете с нас. Екипът на S-S-M.ro',
    },
    hu: {
      subject: 'Üdvözöljük az S-S-M.ro platformon!',
      greeting: 'Üdvözöljük',
      body: 'Köszönjük, hogy regisztrált az S-S-M.ro platformon! Fiókja sikeresen létrehozva. Most már hozzáférhet a platform összes funkciójához a munkavédelmi és tűzvédelmi megfelelőség kezeléséhez.',
      cta_button: 'Platform elérése',
      footer: 'Ha kérdése van, ne habozzon kapcsolatba lépni velünk. Az S-S-M.ro csapata',
    },
    de: {
      subject: 'Willkommen auf der S-S-M.ro Plattform!',
      greeting: 'Willkommen',
      body: 'Vielen Dank für Ihre Registrierung auf der S-S-M.ro Plattform! Ihr Konto wurde erfolgreich erstellt. Sie haben jetzt Zugriff auf alle Funktionen der Plattform zur Verwaltung der Arbeitsschutz- und Brandschutz-Compliance.',
      cta_button: 'Zur Plattform',
      footer: 'Bei Fragen zögern Sie nicht, uns zu kontaktieren. Das S-S-M.ro Team',
    },
    pl: {
      subject: 'Witamy na platformie S-S-M.ro!',
      greeting: 'Witamy',
      body: 'Dziękujemy za rejestrację na platformie S-S-M.ro! Twoje konto zostało pomyślnie utworzone. Masz teraz dostęp do wszystkich funkcji platformy do zarządzania zgodnością BHP i ochrony przeciwpożarowej.',
      cta_button: 'Przejdź do platformy',
      footer: 'W razie pytań prosimy o kontakt. Zespół S-S-M.ro',
    },
    en: {
      subject: 'Welcome to the S-S-M.ro Platform!',
      greeting: 'Welcome',
      body: 'Thank you for registering on the S-S-M.ro platform! Your account has been successfully created. You now have access to all platform features for managing OSH and fire safety compliance.',
      cta_button: 'Access Platform',
      footer: 'If you have any questions, please don\'t hesitate to contact us. The S-S-M.ro Team',
    },
  },

  alert_expiry: {
    ro: {
      subject: 'Alertă: Documente sau autorizații pe cale de expirare',
      greeting: 'Bună ziua',
      body: 'Vă informăm că aveți documente, autorizații sau certificări care vor expira în curând. Vă rugăm să accesați platforma pentru a vizualiza toate alertele și a lua măsurile necesare pentru reînnoire.',
      cta_button: 'Vezi Alerte',
      footer: 'Acest mesaj este generat automat de sistemul S-S-M.ro pentru a vă ajuta să mențineți conformitatea.',
    },
    bg: {
      subject: 'Сигнал: Документи или разрешения изтичат скоро',
      greeting: 'Добър ден',
      body: 'Информираме ви, че имате документи, разрешения или сертификати, които скоро ще изтекат. Моля, влезте в платформата, за да прегледате всички сигнали и да предприемете необходимите действия за подновяване.',
      cta_button: 'Виж сигнали',
      footer: 'Това съобщение се генерира автоматично от системата S-S-M.ro, за да ви помогне да поддържате съответствие.',
    },
    hu: {
      subject: 'Figyelmeztetés: Dokumentumok vagy engedélyek hamarosan lejárnak',
      greeting: 'Jó napot',
      body: 'Tájékoztatjuk, hogy hamarosan lejáró dokumentumai, engedélyei vagy tanúsítványai vannak. Kérjük, lépjen be a platformra az összes figyelmeztetés megtekintéséhez és a szükséges megújítási lépések megtételéhez.',
      cta_button: 'Figyelmeztetések megtekintése',
      footer: 'Ezt az üzenetet automatikusan generálja az S-S-M.ro rendszer, hogy segítsen fenntartani a megfelelőséget.',
    },
    de: {
      subject: 'Warnung: Dokumente oder Genehmigungen laufen bald ab',
      greeting: 'Guten Tag',
      body: 'Wir informieren Sie, dass Sie Dokumente, Genehmigungen oder Zertifizierungen haben, die bald ablaufen. Bitte melden Sie sich auf der Plattform an, um alle Warnungen anzuzeigen und die erforderlichen Maßnahmen zur Erneuerung zu ergreifen.',
      cta_button: 'Warnungen anzeigen',
      footer: 'Diese Nachricht wird automatisch vom S-S-M.ro-System generiert, um Ihnen bei der Einhaltung der Vorschriften zu helfen.',
    },
    pl: {
      subject: 'Alert: Dokumenty lub zezwolenia wkrótce wygasną',
      greeting: 'Dzień dobry',
      body: 'Informujemy, że posiadasz dokumenty, zezwolenia lub certyfikaty, które wkrótce wygasną. Prosimy o zalogowanie się na platformę, aby przejrzeć wszystkie alerty i podjąć niezbędne kroki w celu odnowienia.',
      cta_button: 'Zobacz alerty',
      footer: 'Ta wiadomość jest generowana automatycznie przez system S-S-M.ro, aby pomóc w utrzymaniu zgodności.',
    },
    en: {
      subject: 'Alert: Documents or Authorizations Expiring Soon',
      greeting: 'Hello',
      body: 'We inform you that you have documents, authorizations, or certifications that will expire soon. Please access the platform to view all alerts and take the necessary steps for renewal.',
      cta_button: 'View Alerts',
      footer: 'This message is automatically generated by the S-S-M.ro system to help you maintain compliance.',
    },
  },

  monthly_report: {
    ro: {
      subject: 'Raport lunar - Rezumatul activității SSM/PSI',
      greeting: 'Bună ziua',
      body: 'Vă trimitem raportul lunar cu rezumatul activității din platforma S-S-M.ro. Raportul include statistici despre angajați, instruiri, controale medicale, echipamente și alerte. Vă rugăm să accesați platforma pentru detalii complete.',
      cta_button: 'Vezi Raport Complet',
      footer: 'Raport generat automat de S-S-M.ro. Vă mulțumim pentru încredere!',
    },
    bg: {
      subject: 'Месечен доклад - Обобщение на дейността БЗР/ПБ',
      greeting: 'Добър ден',
      body: 'Изпращаме ви месечния доклад с обобщение на дейността от платформата S-S-M.ro. Докладът включва статистики за служители, обучения, медицински прегледи, оборудване и сигнали. Моля, влезте в платформата за пълни подробности.',
      cta_button: 'Виж пълния доклад',
      footer: 'Доклад, генериран автоматично от S-S-M.ro. Благодарим ви за доверието!',
    },
    hu: {
      subject: 'Havi jelentés - Munkavédelmi/Tűzvédelmi tevékenység összefoglalója',
      greeting: 'Jó napot',
      body: 'Küldjük Önnek a havi jelentést az S-S-M.ro platformon végzett tevékenység összefoglalójával. A jelentés tartalmazza az alkalmazottakra, képzésekre, orvosi vizsgálatokra, felszerelésekre és figyelmeztetésekre vonatkozó statisztikákat. Kérjük, lépjen be a platformra a teljes részletekért.',
      cta_button: 'Teljes jelentés megtekintése',
      footer: 'Az S-S-M.ro által automatikusan generált jelentés. Köszönjük bizalmát!',
    },
    de: {
      subject: 'Monatsbericht - Zusammenfassung der Arbeitsschutz-/Brandschutzaktivitäten',
      greeting: 'Guten Tag',
      body: 'Wir senden Ihnen den Monatsbericht mit einer Zusammenfassung der Aktivitäten auf der S-S-M.ro-Plattform. Der Bericht enthält Statistiken zu Mitarbeitern, Schulungen, medizinischen Untersuchungen, Ausrüstung und Warnungen. Bitte melden Sie sich auf der Plattform an, um vollständige Details zu erhalten.',
      cta_button: 'Vollständigen Bericht anzeigen',
      footer: 'Automatisch generierter Bericht von S-S-M.ro. Vielen Dank für Ihr Vertrauen!',
    },
    pl: {
      subject: 'Raport miesięczny - Podsumowanie działań BHP/Ochrony przeciwpożarowej',
      greeting: 'Dzień dobry',
      body: 'Przesyłamy raport miesięczny z podsumowaniem działań na platformie S-S-M.ro. Raport zawiera statystyki dotyczące pracowników, szkoleń, badań lekarskich, sprzętu i alertów. Prosimy o zalogowanie się na platformę w celu uzyskania szczegółowych informacji.',
      cta_button: 'Zobacz pełny raport',
      footer: 'Raport wygenerowany automatycznie przez S-S-M.ro. Dziękujemy za zaufanie!',
    },
    en: {
      subject: 'Monthly Report - OSH/Fire Safety Activity Summary',
      greeting: 'Hello',
      body: 'We are sending you the monthly report with a summary of activity on the S-S-M.ro platform. The report includes statistics on employees, trainings, medical examinations, equipment, and alerts. Please access the platform for complete details.',
      cta_button: 'View Full Report',
      footer: 'Report automatically generated by S-S-M.ro. Thank you for your trust!',
    },
  },

  password_reset: {
    ro: {
      subject: 'Resetare parolă - S-S-M.ro',
      greeting: 'Bună ziua',
      body: 'Ați solicitat resetarea parolei pentru contul dumneavoastră S-S-M.ro. Faceți click pe butonul de mai jos pentru a crea o parolă nouă. Dacă nu ați solicitat această resetare, vă rugăm să ignorați acest email.',
      cta_button: 'Resetează Parola',
      footer: 'Linkul de resetare este valabil 24 de ore. Pentru securitatea contului, nu distribuiți acest email.',
    },
    bg: {
      subject: 'Нулиране на парола - S-S-M.ro',
      greeting: 'Добър ден',
      body: 'Заявихте нулиране на паролата за вашия акаунт в S-S-M.ro. Кликнете на бутона по-долу, за да създадете нова парола. Ако не сте заявили това нулиране, моля игнорирайте този имейл.',
      cta_button: 'Нулиране на паролата',
      footer: 'Връзката за нулиране е валидна 24 часа. За сигурността на акаунта не споделяйте този имейл.',
    },
    hu: {
      subject: 'Jelszó visszaállítás - S-S-M.ro',
      greeting: 'Jó napot',
      body: 'Jelszó-visszaállítást kért S-S-M.ro fiókjához. Kattintson az alábbi gombra új jelszó létrehozásához. Ha nem Ön kérte ezt a visszaállítást, kérjük, hagyja figyelmen kívül ezt az e-mailt.',
      cta_button: 'Jelszó visszaállítása',
      footer: 'A visszaállítási link 24 órán át érvényes. Fiókja biztonsága érdekében ne ossza meg ezt az e-mailt.',
    },
    de: {
      subject: 'Passwort zurücksetzen - S-S-M.ro',
      greeting: 'Guten Tag',
      body: 'Sie haben das Zurücksetzen des Passworts für Ihr S-S-M.ro-Konto angefordert. Klicken Sie auf die Schaltfläche unten, um ein neues Passwort zu erstellen. Wenn Sie dieses Zurücksetzen nicht angefordert haben, ignorieren Sie bitte diese E-Mail.',
      cta_button: 'Passwort zurücksetzen',
      footer: 'Der Zurücksetzungslink ist 24 Stunden gültig. Für die Sicherheit Ihres Kontos geben Sie diese E-Mail nicht weiter.',
    },
    pl: {
      subject: 'Resetowanie hasła - S-S-M.ro',
      greeting: 'Dzień dobry',
      body: 'Poprosiłeś o zresetowanie hasła do swojego konta S-S-M.ro. Kliknij poniższy przycisk, aby utworzyć nowe hasło. Jeśli nie prosiłeś o to resetowanie, zignoruj tę wiadomość.',
      cta_button: 'Zresetuj hasło',
      footer: 'Link do resetowania jest ważny przez 24 godziny. Dla bezpieczeństwa konta nie udostępniaj tego e-maila.',
    },
    en: {
      subject: 'Password Reset - S-S-M.ro',
      greeting: 'Hello',
      body: 'You have requested a password reset for your S-S-M.ro account. Click the button below to create a new password. If you did not request this reset, please ignore this email.',
      cta_button: 'Reset Password',
      footer: 'The reset link is valid for 24 hours. For your account security, do not share this email.',
    },
  },

  invitation: {
    ro: {
      subject: 'Invitație: Alăturați-vă organizației pe S-S-M.ro',
      greeting: 'Bună ziua',
      body: 'Ați fost invitat să vă alăturați unei organizații pe platforma S-S-M.ro. Acceptați invitația pentru a accesa funcționalitățile de gestionare a conformității SSM și PSI. Click pe butonul de mai jos pentru a crea contul și a accepta invitația.',
      cta_button: 'Acceptă Invitația',
      footer: 'Această invitație este valabilă 7 zile. Dacă aveți întrebări, contactați administratorul organizației.',
    },
    bg: {
      subject: 'Покана: Присъединете се към организацията в S-S-M.ro',
      greeting: 'Добър ден',
      body: 'Поканени сте да се присъедините към организация на платформата S-S-M.ro. Приемете поканата, за да получите достъп до функциите за управление на съответствието с БЗР и ПБ. Кликнете на бутона по-долу, за да създадете акаунт и да приемете поканата.',
      cta_button: 'Приемане на поканата',
      footer: 'Тази покана е валидна 7 дни. Ако имате въпроси, свържете се с администратора на организацията.',
    },
    hu: {
      subject: 'Meghívó: Csatlakozzon a szervezethez az S-S-M.ro-n',
      greeting: 'Jó napot',
      body: 'Meghívást kapott, hogy csatlakozzon egy szervezethez az S-S-M.ro platformon. Fogadja el a meghívót a munkavédelmi és tűzvédelmi megfelelőség-kezelési funkciók eléréséhez. Kattintson az alábbi gombra a fiók létrehozásához és a meghívó elfogadásához.',
      cta_button: 'Meghívó elfogadása',
      footer: 'Ez a meghívó 7 napig érvényes. Ha kérdése van, lépjen kapcsolatba a szervezet rendszergazdájával.',
    },
    de: {
      subject: 'Einladung: Treten Sie der Organisation auf S-S-M.ro bei',
      greeting: 'Guten Tag',
      body: 'Sie wurden eingeladen, einer Organisation auf der S-S-M.ro-Plattform beizutreten. Akzeptieren Sie die Einladung, um auf die Funktionen zur Verwaltung der Arbeitsschutz- und Brandschutz-Compliance zuzugreifen. Klicken Sie auf die Schaltfläche unten, um Ihr Konto zu erstellen und die Einladung anzunehmen.',
      cta_button: 'Einladung annehmen',
      footer: 'Diese Einladung ist 7 Tage gültig. Bei Fragen wenden Sie sich bitte an den Administrator der Organisation.',
    },
    pl: {
      subject: 'Zaproszenie: Dołącz do organizacji na S-S-M.ro',
      greeting: 'Dzień dobry',
      body: 'Zostałeś zaproszony do dołączenia do organizacji na platformie S-S-M.ro. Zaakceptuj zaproszenie, aby uzyskać dostęp do funkcji zarządzania zgodnością BHP i ochrony przeciwpożarowej. Kliknij poniższy przycisk, aby utworzyć konto i zaakceptować zaproszenie.',
      cta_button: 'Zaakceptuj zaproszenie',
      footer: 'To zaproszenie jest ważne przez 7 dni. W razie pytań skontaktuj się z administratorem organizacji.',
    },
    en: {
      subject: 'Invitation: Join the Organization on S-S-M.ro',
      greeting: 'Hello',
      body: 'You have been invited to join an organization on the S-S-M.ro platform. Accept the invitation to access OSH and fire safety compliance management features. Click the button below to create your account and accept the invitation.',
      cta_button: 'Accept Invitation',
      footer: 'This invitation is valid for 7 days. If you have questions, contact the organization administrator.',
    },
  },

  training_reminder: {
    ro: {
      subject: 'Memento: Instruire SSM/PSI programată',
      greeting: 'Bună ziua',
      body: 'Vă reamintim că aveți o instruire SSM/PSI programată în curând. Vă rugăm să accesați platforma pentru a vedea detaliile instruirii, data, ora și locația. Prezența la instruiri este obligatorie pentru menținerea conformității.',
      cta_button: 'Vezi Detalii Instruire',
      footer: 'Pentru întrebări despre instruire, contactați responsabilul SSM al organizației dumneavoastră.',
    },
    bg: {
      subject: 'Напомняне: Планирано обучение по БЗР/ПБ',
      greeting: 'Добър ден',
      body: 'Напомняме ви, че имате планирано обучение по БЗР/ПБ скоро. Моля, влезте в платформата, за да видите подробности за обучението, дата, час и местоположение. Присъствието на обучения е задължително за поддържане на съответствие.',
      cta_button: 'Виж подробности за обучението',
      footer: 'За въпроси относно обучението се свържете с отговорника по БЗР на вашата организация.',
    },
    hu: {
      subject: 'Emlékeztető: Tervezett munkavédelmi/tűzvédelmi képzés',
      greeting: 'Jó napot',
      body: 'Emlékeztetjük, hogy hamarosan tervezett munkavédelmi/tűzvédelmi képzése van. Kérjük, lépjen be a platformra a képzés részleteinek, dátumának, időpontjának és helyszínének megtekintéséhez. A képzéseken való részvétel kötelező a megfelelőség fenntartásához.',
      cta_button: 'Képzés részleteinek megtekintése',
      footer: 'A képzéssel kapcsolatos kérdésekkel forduljon szervezete munkavédelmi felelőséhez.',
    },
    de: {
      subject: 'Erinnerung: Geplante Arbeitsschutz-/Brandschutzschulung',
      greeting: 'Guten Tag',
      body: 'Wir erinnern Sie daran, dass Sie bald eine geplante Arbeitsschutz-/Brandschutzschulung haben. Bitte melden Sie sich auf der Plattform an, um Details zur Schulung, Datum, Uhrzeit und Ort anzuzeigen. Die Teilnahme an Schulungen ist obligatorisch, um die Compliance aufrechtzuerhalten.',
      cta_button: 'Schulungsdetails anzeigen',
      footer: 'Bei Fragen zur Schulung wenden Sie sich bitte an den Arbeitsschutzbeauftragten Ihrer Organisation.',
    },
    pl: {
      subject: 'Przypomnienie: Zaplanowane szkolenie BHP/Ochrony przeciwpożarowej',
      greeting: 'Dzień dobry',
      body: 'Przypominamy, że masz wkrótce zaplanowane szkolenie BHP/Ochrony przeciwpożarowej. Prosimy o zalogowanie się na platformę, aby zobaczyć szczegóły szkolenia, datę, godzinę i lokalizację. Obecność na szkoleniach jest obowiązkowa w celu utrzymania zgodności.',
      cta_button: 'Zobacz szczegóły szkolenia',
      footer: 'W razie pytań dotyczących szkolenia skontaktuj się z kierownikiem BHP w Twojej organizacji.',
    },
    en: {
      subject: 'Reminder: Scheduled OSH/Fire Safety Training',
      greeting: 'Hello',
      body: 'We remind you that you have a scheduled OSH/Fire Safety training coming up soon. Please access the platform to view training details, date, time, and location. Attendance at trainings is mandatory to maintain compliance.',
      cta_button: 'View Training Details',
      footer: 'For questions about the training, contact your organization\'s OSH manager.',
    },
  },
};

/**
 * Get email translation for a specific template and locale
 * @param template - The email template name
 * @param locale - The locale code (ro, bg, hu, de, pl, en)
 * @returns EmailTranslation object with subject, greeting, body, cta_button, footer
 */
export function getEmailTranslation(
  template: EmailTemplate,
  locale: SupportedLocale = 'ro'
): EmailTranslation {
  const translation = emailTranslations[template]?.[locale];

  if (!translation) {
    // Fallback to Romanian if translation not found
    console.warn(
      `Email translation not found for template "${template}" and locale "${locale}". Falling back to Romanian.`
    );
    return emailTranslations[template]?.ro || emailTranslations.welcome.ro;
  }

  return translation;
}

/**
 * Get all supported locales
 */
export function getSupportedLocales(): SupportedLocale[] {
  return ['ro', 'bg', 'hu', 'de', 'pl', 'en'];
}

/**
 * Get all available email templates
 */
export function getEmailTemplates(): EmailTemplate[] {
  return [
    'welcome',
    'alert_expiry',
    'monthly_report',
    'password_reset',
    'invitation',
    'training_reminder',
  ];
}
