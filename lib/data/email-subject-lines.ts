/**
 * Email Subject Lines and Preheaders
 *
 * 5 email types × 3 variants × 6 languages
 * Types: welcome, alert_expiry, monthly_report, invitation, renewal
 */

export type EmailType = 'welcome' | 'alert_expiry' | 'monthly_report' | 'invitation' | 'renewal';
export type Language = 'ro' | 'en' | 'bg' | 'hu' | 'de' | 'fr';

interface EmailVariant {
  subject: string;
  preheader: string;
}

type EmailSubjectData = {
  [K in EmailType]: {
    [L in Language]: EmailVariant[];
  };
};

const emailSubjects: EmailSubjectData = {
  welcome: {
    ro: [
      {
        subject: 'Bun venit la s-s-m.ro! 🎉',
        preheader: 'Contul tău este activ. Începe să gestionezi compliance-ul SSM/PSI cu ușurință.'
      },
      {
        subject: 'Contul tău s-s-m.ro este gata de utilizare',
        preheader: 'Descoperă cum platforma noastră simplifică securitatea muncii pentru echipa ta.'
      },
      {
        subject: 'Bine ai venit! Să începem cu s-s-m.ro',
        preheader: 'Tot ce ai nevoie pentru SSM și PSI, acum într-un singur loc. Hai să explorăm.'
      }
    ],
    en: [
      {
        subject: 'Welcome to s-s-m.ro! 🎉',
        preheader: 'Your account is active. Start managing OSH/Fire compliance with ease.'
      },
      {
        subject: 'Your s-s-m.ro account is ready',
        preheader: 'Discover how our platform simplifies workplace safety for your team.'
      },
      {
        subject: 'Welcome aboard! Let\'s get started with s-s-m.ro',
        preheader: 'Everything you need for OSH and fire safety, now in one place. Let\'s explore.'
      }
    ],
    bg: [
      {
        subject: 'Добре дошли в s-s-m.ro! 🎉',
        preheader: 'Вашият акаунт е активен. Започнете да управлявате съответствието с БЗР/ПБ лесно.'
      },
      {
        subject: 'Вашият акаунт в s-s-m.ro е готов',
        preheader: 'Открийте как нашата платформа опростява безопасността на работното място за вашия екип.'
      },
      {
        subject: 'Добре дошли! Нека започнем с s-s-m.ro',
        preheader: 'Всичко необходимо за БЗР и пожарна безопасност на едно място. Нека разгледаме.'
      }
    ],
    hu: [
      {
        subject: 'Üdvözöljük az s-s-m.ro-n! 🎉',
        preheader: 'Fiókja aktív. Kezdje el könnyedén kezelni a munkavédelmi és tűzvédelmi megfelelést.'
      },
      {
        subject: 'Az s-s-m.ro fiókja készen áll',
        preheader: 'Fedezze fel, hogyan egyszerűsíti platformunk a munkahelyi biztonságot csapata számára.'
      },
      {
        subject: 'Üdvözöljük! Kezdjük el az s-s-m.ro használatát',
        preheader: 'Minden, amire szüksége van a munkavédelemhez és tűzvédelemhez, egy helyen. Fedezzük fel.'
      }
    ],
    de: [
      {
        subject: 'Willkommen bei s-s-m.ro! 🎉',
        preheader: 'Ihr Konto ist aktiv. Beginnen Sie mit der einfachen Verwaltung der Arbeitsschutz-Compliance.'
      },
      {
        subject: 'Ihr s-s-m.ro-Konto ist bereit',
        preheader: 'Entdecken Sie, wie unsere Plattform die Arbeitssicherheit für Ihr Team vereinfacht.'
      },
      {
        subject: 'Willkommen an Bord! Legen wir mit s-s-m.ro los',
        preheader: 'Alles für Arbeitsschutz und Brandschutz an einem Ort. Lassen Sie uns erkunden.'
      }
    ],
    fr: [
      {
        subject: 'Bienvenue sur s-s-m.ro ! 🎉',
        preheader: 'Votre compte est actif. Commencez à gérer facilement la conformité SST/incendie.'
      },
      {
        subject: 'Votre compte s-s-m.ro est prêt',
        preheader: 'Découvrez comment notre plateforme simplifie la sécurité au travail pour votre équipe.'
      },
      {
        subject: 'Bienvenue ! Commençons avec s-s-m.ro',
        preheader: 'Tout ce dont vous avez besoin pour la SST et la sécurité incendie, en un seul endroit.'
      }
    ]
  },

  alert_expiry: {
    ro: [
      {
        subject: '⚠️ Alerte SSM/PSI expiră în 30 de zile',
        preheader: 'Ai 12 alerte care necesită atenție urgentă. Vezi detaliile acum.'
      },
      {
        subject: 'Atenție: Documente SSM expiră curând',
        preheader: 'Certificate medicale și autorizații se apropie de expirare. Acționează astăzi.'
      },
      {
        subject: 'Reminder: Verifică alertele de expirare',
        preheader: 'Nu lăsa compliance-ul să expire. Revizuiește și rezolvă alertele tale.'
      }
    ],
    en: [
      {
        subject: '⚠️ OSH/Fire alerts expiring in 30 days',
        preheader: 'You have 12 alerts requiring urgent attention. View details now.'
      },
      {
        subject: 'Attention: OSH documents expiring soon',
        preheader: 'Medical certificates and permits are approaching expiration. Take action today.'
      },
      {
        subject: 'Reminder: Check your expiration alerts',
        preheader: 'Don\'t let compliance expire. Review and resolve your alerts.'
      }
    ],
    bg: [
      {
        subject: '⚠️ Сигнали БЗР/ПБ изтичат след 30 дни',
        preheader: 'Имате 12 сигнала, изискващи спешно внимание. Вижте подробности сега.'
      },
      {
        subject: 'Внимание: Документи БЗР изтичат скоро',
        preheader: 'Медицински сертификати и разрешителни наближават изтичане. Действайте днес.'
      },
      {
        subject: 'Напомняне: Проверете сигналите за изтичане',
        preheader: 'Не позволявайте съответствието да изтече. Прегледайте и разрешете сигналите си.'
      }
    ],
    hu: [
      {
        subject: '⚠️ Munkavédelmi/tűzvédelmi figyelmeztetések 30 napon belül lejárnak',
        preheader: '12 figyelmeztetése van, amelyek sürgős figyelmet igényelnek. Tekintse meg most a részleteket.'
      },
      {
        subject: 'Figyelem: Munkavédelmi dokumentumok hamarosan lejárnak',
        preheader: 'Orvosi igazolások és engedélyek közelednek a lejárathoz. Cselekedjen ma.'
      },
      {
        subject: 'Emlékeztető: Ellenőrizze a lejárati figyelmeztetéseket',
        preheader: 'Ne hagyja, hogy a megfelelőség lejárjon. Tekintse át és oldja meg figyelmeztetéseit.'
      }
    ],
    de: [
      {
        subject: '⚠️ Arbeitsschutz-/Brandschutzwarnungen laufen in 30 Tagen ab',
        preheader: 'Sie haben 12 Warnungen, die dringende Aufmerksamkeit erfordern. Details jetzt ansehen.'
      },
      {
        subject: 'Achtung: Arbeitsschutzdokumente laufen bald ab',
        preheader: 'Ärztliche Bescheinigungen und Genehmigungen nähern sich dem Ablauf. Handeln Sie heute.'
      },
      {
        subject: 'Erinnerung: Überprüfen Sie Ihre Ablaufwarnungen',
        preheader: 'Lassen Sie die Compliance nicht ablaufen. Überprüfen und lösen Sie Ihre Warnungen.'
      }
    ],
    fr: [
      {
        subject: '⚠️ Alertes SST/incendie expirant dans 30 jours',
        preheader: 'Vous avez 12 alertes nécessitant une attention urgente. Voir les détails maintenant.'
      },
      {
        subject: 'Attention : Documents SST expirant bientôt',
        preheader: 'Les certificats médicaux et permis approchent de l\'expiration. Agissez aujourd\'hui.'
      },
      {
        subject: 'Rappel : Vérifiez vos alertes d\'expiration',
        preheader: 'Ne laissez pas la conformité expirer. Examinez et résolvez vos alertes.'
      }
    ]
  },

  monthly_report: {
    ro: [
      {
        subject: '📊 Raportul tău SSM/PSI pentru ianuarie 2026',
        preheader: '156 angajați activi • 23 instruiri • 5 alerte rezolvate. Vezi statisticile complete.'
      },
      {
        subject: 'Ianuarie 2026: Sumar compliance SSM',
        preheader: 'Tot ce s-a întâmplat luna aceasta în organizația ta. Descarcă raportul complet.'
      },
      {
        subject: 'Raport lunar s-s-m.ro — Ianuarie 2026',
        preheader: 'Progres, alerte și acțiuni necesare pentru luna viitoare. Citește acum.'
      }
    ],
    en: [
      {
        subject: '📊 Your OSH/Fire report for January 2026',
        preheader: '156 active employees • 23 trainings • 5 alerts resolved. See complete statistics.'
      },
      {
        subject: 'January 2026: OSH compliance summary',
        preheader: 'Everything that happened this month in your organization. Download full report.'
      },
      {
        subject: 'Monthly report s-s-m.ro — January 2026',
        preheader: 'Progress, alerts, and actions needed for next month. Read now.'
      }
    ],
    bg: [
      {
        subject: '📊 Вашият доклад БЗР/ПБ за януари 2026',
        preheader: '156 активни служители • 23 обучения • 5 разрешени сигнала. Вижте пълна статистика.'
      },
      {
        subject: 'Януари 2026: Обобщение на съответствието БЗР',
        preheader: 'Всичко, което се случи този месец във вашата организация. Изтеглете пълен доклад.'
      },
      {
        subject: 'Месечен доклад s-s-m.ro — Януари 2026',
        preheader: 'Прогрес, сигнали и необходими действия за следващия месец. Прочетете сега.'
      }
    ],
    hu: [
      {
        subject: '📊 Az Ön munkavédelmi/tűzvédelmi jelentése 2026 januárjára',
        preheader: '156 aktív alkalmazott • 23 képzés • 5 megoldott figyelmeztetés. Teljes statisztika megtekintése.'
      },
      {
        subject: '2026 január: Munkavédelmi megfelelőség összefoglalója',
        preheader: 'Minden, ami ebben a hónapban történt szervezetében. Teljes jelentés letöltése.'
      },
      {
        subject: 'Havi jelentés s-s-m.ro — 2026 január',
        preheader: 'Haladás, figyelmeztetések és a következő hónapban szükséges lépések. Olvassa el most.'
      }
    ],
    de: [
      {
        subject: '📊 Ihr Arbeitsschutz-/Brandschutzbericht für Januar 2026',
        preheader: '156 aktive Mitarbeiter • 23 Schulungen • 5 gelöste Warnungen. Vollständige Statistiken ansehen.'
      },
      {
        subject: 'Januar 2026: Zusammenfassung der Arbeitsschutz-Compliance',
        preheader: 'Alles, was diesen Monat in Ihrer Organisation passiert ist. Vollständigen Bericht herunterladen.'
      },
      {
        subject: 'Monatsbericht s-s-m.ro — Januar 2026',
        preheader: 'Fortschritt, Warnungen und erforderliche Maßnahmen für nächsten Monat. Jetzt lesen.'
      }
    ],
    fr: [
      {
        subject: '📊 Votre rapport SST/incendie pour janvier 2026',
        preheader: '156 employés actifs • 23 formations • 5 alertes résolues. Voir les statistiques complètes.'
      },
      {
        subject: 'Janvier 2026 : Résumé de conformité SST',
        preheader: 'Tout ce qui s\'est passé ce mois-ci dans votre organisation. Télécharger le rapport complet.'
      },
      {
        subject: 'Rapport mensuel s-s-m.ro — Janvier 2026',
        preheader: 'Progrès, alertes et actions nécessaires pour le mois prochain. Lire maintenant.'
      }
    ]
  },

  invitation: {
    ro: [
      {
        subject: 'Te-ai alăturat echipei ACME Industries pe s-s-m.ro',
        preheader: 'Daniel Popescu te-a invitat să colaborezi. Acceptă invitația și configurează-ți contul.'
      },
      {
        subject: 'Invitație: Alătură-te echipei pe platforma s-s-m.ro',
        preheader: 'Ai fost adăugat la ACME Industries. Creează-ți parola și începe să lucrezi.'
      },
      {
        subject: '🤝 Bine ai venit în echipa ACME Industries',
        preheader: 'Organizația ta te așteaptă pe s-s-m.ro. Activează-ți contul în 48 de ore.'
      }
    ],
    en: [
      {
        subject: 'You\'ve joined the ACME Industries team on s-s-m.ro',
        preheader: 'Daniel Popescu invited you to collaborate. Accept the invitation and set up your account.'
      },
      {
        subject: 'Invitation: Join the team on s-s-m.ro platform',
        preheader: 'You\'ve been added to ACME Industries. Create your password and start working.'
      },
      {
        subject: '🤝 Welcome to the ACME Industries team',
        preheader: 'Your organization is waiting for you on s-s-m.ro. Activate your account within 48 hours.'
      }
    ],
    bg: [
      {
        subject: 'Присъединихте се към екипа на ACME Industries в s-s-m.ro',
        preheader: 'Даниел Попеску ви покани да си сътрудничите. Приемете поканата и настройте акаунта си.'
      },
      {
        subject: 'Покана: Присъединете се към екипа на платформата s-s-m.ro',
        preheader: 'Добавени сте към ACME Industries. Създайте паролата си и започнете да работите.'
      },
      {
        subject: '🤝 Добре дошли в екипа на ACME Industries',
        preheader: 'Вашата организация ви очаква на s-s-m.ro. Активирайте акаунта си в рамките на 48 часа.'
      }
    ],
    hu: [
      {
        subject: 'Csatlakozott az ACME Industries csapatához az s-s-m.ro-n',
        preheader: 'Popescu Dániel meghívta Önt az együttműködésre. Fogadja el a meghívást és állítsa be fiókját.'
      },
      {
        subject: 'Meghívás: Csatlakozzon a csapathoz az s-s-m.ro platformon',
        preheader: 'Hozzáadták az ACME Industries-hez. Hozza létre jelszavát és kezdjen dolgozni.'
      },
      {
        subject: '🤝 Üdvözöljük az ACME Industries csapatában',
        preheader: 'Szervezete várja Önt az s-s-m.ro-n. Aktiválja fiókját 48 órán belül.'
      }
    ],
    de: [
      {
        subject: 'Sie sind dem ACME Industries-Team auf s-s-m.ro beigetreten',
        preheader: 'Daniel Popescu hat Sie zur Zusammenarbeit eingeladen. Akzeptieren Sie die Einladung und richten Sie Ihr Konto ein.'
      },
      {
        subject: 'Einladung: Treten Sie dem Team auf der s-s-m.ro-Plattform bei',
        preheader: 'Sie wurden zu ACME Industries hinzugefügt. Erstellen Sie Ihr Passwort und beginnen Sie zu arbeiten.'
      },
      {
        subject: '🤝 Willkommen im ACME Industries-Team',
        preheader: 'Ihre Organisation wartet auf Sie auf s-s-m.ro. Aktivieren Sie Ihr Konto innerhalb von 48 Stunden.'
      }
    ],
    fr: [
      {
        subject: 'Vous avez rejoint l\'équipe ACME Industries sur s-s-m.ro',
        preheader: 'Daniel Popescu vous a invité à collaborer. Acceptez l\'invitation et configurez votre compte.'
      },
      {
        subject: 'Invitation : Rejoignez l\'équipe sur la plateforme s-s-m.ro',
        preheader: 'Vous avez été ajouté à ACME Industries. Créez votre mot de passe et commencez à travailler.'
      },
      {
        subject: '🤝 Bienvenue dans l\'équipe ACME Industries',
        preheader: 'Votre organisation vous attend sur s-s-m.ro. Activez votre compte dans les 48 heures.'
      }
    ]
  },

  renewal: {
    ro: [
      {
        subject: '🔄 Timpul pentru reînnoirea abonamentului s-s-m.ro',
        preheader: 'Abonamentul tău expiră pe 15 martie 2026. Reînnoiește acum pentru acces neîntrerupt.'
      },
      {
        subject: 'Abonamentul tău se apropie de expirare',
        preheader: 'Nu pierde accesul la platformă. Reînnoiește cu un click și primești 10% discount.'
      },
      {
        subject: 'Reminder: Reînnoiește abonamentul s-s-m.ro',
        preheader: 'Încă 7 zile până la expirare. Asigură-te că echipa ta nu pierde datele și funcționalitățile.'
      }
    ],
    en: [
      {
        subject: '🔄 Time to renew your s-s-m.ro subscription',
        preheader: 'Your subscription expires on March 15, 2026. Renew now for uninterrupted access.'
      },
      {
        subject: 'Your subscription is approaching expiration',
        preheader: 'Don\'t lose platform access. Renew with one click and get 10% discount.'
      },
      {
        subject: 'Reminder: Renew your s-s-m.ro subscription',
        preheader: 'Only 7 days until expiration. Make sure your team doesn\'t lose data and features.'
      }
    ],
    bg: [
      {
        subject: '🔄 Време е да подновите абонамента си за s-s-m.ro',
        preheader: 'Вашият абонамент изтича на 15 март 2026 г. Подновете сега за непрекъснат достъп.'
      },
      {
        subject: 'Вашият абонамент наближава изтичане',
        preheader: 'Не губете достъп до платформата. Подновете с едно кликване и получете 10% отстъпка.'
      },
      {
        subject: 'Напомняне: Подновете абонамента си за s-s-m.ro',
        preheader: 'Само 7 дни до изтичане. Уверете се, че екипът ви не губи данни и функционалности.'
      }
    ],
    hu: [
      {
        subject: '🔄 Ideje megújítani az s-s-m.ro előfizetését',
        preheader: 'Előfizetése 2026. március 15-én jár le. Újítsa meg most a megszakítás nélküli hozzáféréshez.'
      },
      {
        subject: 'Előfizetése közeledik a lejárathoz',
        preheader: 'Ne veszítse el a platformhoz való hozzáférést. Újítsa meg egy kattintással és kapjon 10% kedvezményt.'
      },
      {
        subject: 'Emlékeztető: Újítsa meg s-s-m.ro előfizetését',
        preheader: 'Már csak 7 nap a lejáratig. Győződjön meg róla, hogy csapata nem veszít adatokat és funkciókat.'
      }
    ],
    de: [
      {
        subject: '🔄 Zeit, Ihr s-s-m.ro-Abonnement zu verlängern',
        preheader: 'Ihr Abonnement läuft am 15. März 2026 ab. Jetzt verlängern für unterbrechungsfreien Zugang.'
      },
      {
        subject: 'Ihr Abonnement nähert sich dem Ablauf',
        preheader: 'Verlieren Sie nicht den Plattformzugang. Mit einem Klick verlängern und 10% Rabatt erhalten.'
      },
      {
        subject: 'Erinnerung: Verlängern Sie Ihr s-s-m.ro-Abonnement',
        preheader: 'Nur noch 7 Tage bis zum Ablauf. Stellen Sie sicher, dass Ihr Team keine Daten und Funktionen verliert.'
      }
    ],
    fr: [
      {
        subject: '🔄 Il est temps de renouveler votre abonnement s-s-m.ro',
        preheader: 'Votre abonnement expire le 15 mars 2026. Renouvelez maintenant pour un accès ininterrompu.'
      },
      {
        subject: 'Votre abonnement approche de l\'expiration',
        preheader: 'Ne perdez pas l\'accès à la plateforme. Renouvelez en un clic et obtenez 10% de réduction.'
      },
      {
        subject: 'Rappel : Renouvelez votre abonnement s-s-m.ro',
        preheader: 'Plus que 7 jours avant l\'expiration. Assurez-vous que votre équipe ne perde pas de données et fonctionnalités.'
      }
    ]
  }
};

/**
 * Get a subject line and preheader for a specific email type
 *
 * @param type - Email type (welcome, alert_expiry, monthly_report, invitation, renewal)
 * @param language - Language code (ro, en, bg, hu, de, fr)
 * @param variantIndex - Variant index (0-2), defaults to 0
 * @returns Email variant with subject and preheader
 */
export function getSubjectLine(
  type: EmailType,
  language: Language = 'ro',
  variantIndex: number = 0
): EmailVariant {
  const variants = emailSubjects[type]?.[language];

  if (!variants || variants.length === 0) {
    // Fallback to Romanian if language not found
    return emailSubjects[type].ro[0];
  }

  // Ensure variant index is within bounds
  const index = Math.min(Math.max(0, variantIndex), variants.length - 1);
  return variants[index];
}

/**
 * Get all variants for a specific email type and language
 *
 * @param type - Email type
 * @param language - Language code
 * @returns Array of all variants
 */
export function getAllVariants(
  type: EmailType,
  language: Language = 'ro'
): EmailVariant[] {
  return emailSubjects[type]?.[language] || emailSubjects[type].ro;
}

/**
 * Get a random variant for a specific email type and language
 *
 * @param type - Email type
 * @param language - Language code
 * @returns Random email variant
 */
export function getRandomVariant(
  type: EmailType,
  language: Language = 'ro'
): EmailVariant {
  const variants = emailSubjects[type]?.[language] || emailSubjects[type].ro;
  const randomIndex = Math.floor(Math.random() * variants.length);
  return variants[randomIndex];
}

export default emailSubjects;
