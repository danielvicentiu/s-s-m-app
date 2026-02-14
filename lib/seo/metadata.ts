import { Metadata } from 'next';

// Supported locales
export type Locale = 'ro' | 'bg' | 'en' | 'hu' | 'de';

// Page types
export type PageType =
  | 'home'
  | 'pricing'
  | 'about'
  | 'contact'
  | 'blog'
  | 'blog-post'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'faq'
  | 'glossary'
  | 'industries'
  | 'compare'
  | 'changelog'
  | 'terms'
  | 'privacy';

// Base site configuration
const SITE_CONFIG = {
  name: 'S-S-M.ro',
  url: 'https://app.s-s-m.ro',
  description: {
    ro: 'Platformă digitală SSM/PSI pentru consultanți și firme din România, Bulgaria, Ungaria, Germania. Gestionare compliance, raportare automată, alerte inteligente.',
    bg: 'Дигитална платформа за управление на здравословни и безопасни условия на труд (ЗБУТ) и пожарна безопасност за консултанти и фирми.',
    en: 'Digital platform for occupational health and safety (OHS) compliance management for consultants and companies.',
    hu: 'Digitális platform munkavédelmi és tűzvédelmi megfelelőség kezelésére tanácsadók és vállalatok számára.',
    de: 'Digitale Plattform für Arbeitsschutz- und Brandschutz-Compliance-Management für Berater und Unternehmen.',
  },
  image: '/og-image.png',
  twitter: '@ssmro',
};

// Page-specific metadata configurations
const PAGE_CONFIGS: Record<
  PageType,
  Record<
    Locale,
    {
      title: string;
      description: string;
      keywords?: string[];
    }
  >
> = {
  home: {
    ro: {
      title: 'S-S-M.ro - Platformă SSM/PSI Digitală pentru Consultanți',
      description:
        'Platformă completă pentru gestionarea compliance-ului SSM și PSI. Gestionare angajați, echipamente, instruiri, control medical, raportare automată.',
      keywords: [
        'ssm',
        'psi',
        'securitate muncă',
        'protecție incendiu',
        'compliance',
        'consultant ssm',
        'gestionare angajați',
        'instruiri ssm',
        'control medical',
        'echipamente protecție',
      ],
    },
    bg: {
      title: 'S-S-M.ro - Дигитална Платформа за ЗБУТ и Пожарна Безопасност',
      description:
        'Пълна платформа за управление на съответствието с ЗБУТ и пожарна безопасност. Управление на служители, оборудване, обучения, медицински прегледи.',
      keywords: ['збут', 'пожарна безопасност', 'compliance', 'служители', 'обучения'],
    },
    en: {
      title: 'S-S-M.ro - Digital OHS & Fire Safety Platform',
      description:
        'Complete platform for occupational health and safety compliance management. Employee management, equipment tracking, training, medical checkups, automated reporting.',
      keywords: [
        'ohs',
        'occupational health',
        'fire safety',
        'compliance',
        'safety management',
        'employee management',
        'training',
        'medical checkups',
      ],
    },
    hu: {
      title: 'S-S-M.ro - Digitális Munkavédelmi és Tűzvédelmi Platform',
      description:
        'Teljes platform munkavédelmi és tűzvédelmi megfelelőség kezeléséhez. Alkalmazotti menedzsment, felszerelések, képzések, orvosi vizsgálatok.',
      keywords: ['munkavédelem', 'tűzvédelem', 'compliance', 'alkalmazottak', 'képzések'],
    },
    de: {
      title: 'S-S-M.ro - Digitale Arbeitsschutz- und Brandschutzplattform',
      description:
        'Vollständige Plattform für Arbeitsschutz- und Brandschutz-Compliance-Management. Mitarbeiterverwaltung, Ausrüstung, Schulungen, medizinische Untersuchungen.',
      keywords: ['arbeitsschutz', 'brandschutz', 'compliance', 'mitarbeiter', 'schulungen'],
    },
  },
  pricing: {
    ro: {
      title: 'Prețuri - S-S-M.ro',
      description:
        'Planuri flexibile pentru consultanți SSM și firme. Încercați gratuit 14 zile. Fără contract pe termen lung. Anulare oricând.',
      keywords: ['prețuri ssm', 'abonament ssm', 'cost platformă ssm', 'planuri ssm'],
    },
    bg: {
      title: 'Цени - S-S-M.ro',
      description: 'Гъвкави планове за ЗБУТ консултанти и фирми. 14 дни безплатен тест.',
      keywords: ['цени збут', 'абонамент', 'планове'],
    },
    en: {
      title: 'Pricing - S-S-M.ro',
      description:
        'Flexible plans for OHS consultants and companies. 14-day free trial. No long-term contracts. Cancel anytime.',
      keywords: ['ohs pricing', 'safety platform cost', 'subscription plans'],
    },
    hu: {
      title: 'Árak - S-S-M.ro',
      description:
        'Rugalmas csomagok munkavédelmi tanácsadók és cégek számára. 14 napos ingyenes próba.',
      keywords: ['munkavédelem árak', 'előfizetés', 'csomagok'],
    },
    de: {
      title: 'Preise - S-S-M.ro',
      description:
        'Flexible Pläne für Arbeitsschutzberater und Unternehmen. 14 Tage kostenlose Testversion.',
      keywords: ['arbeitsschutz preise', 'abonnement', 'pläne'],
    },
  },
  about: {
    ro: {
      title: 'Despre Noi - S-S-M.ro',
      description:
        'Platforma S-S-M.ro este dezvoltată de consultanți SSM cu 20+ ani experiență. Digitizăm compliance-ul pentru peste 100 de firme active.',
      keywords: ['despre ssm', 'echipa ssm', 'consultant ssm', 'experiență ssm'],
    },
    bg: {
      title: 'За Нас - S-S-M.ro',
      description: 'Платформата е разработена от ЗБУТ консултанти с 20+ години опит.',
      keywords: ['за нас', 'екип', 'опит'],
    },
    en: {
      title: 'About Us - S-S-M.ro',
      description:
        'S-S-M.ro platform is developed by OHS consultants with 20+ years of experience. We digitize compliance for 100+ active companies.',
      keywords: ['about ohs', 'safety team', 'ohs consultants', 'experience'],
    },
    hu: {
      title: 'Rólunk - S-S-M.ro',
      description: 'A platformot munkavédelmi tanácsadók fejlesztették 20+ év tapasztalattal.',
      keywords: ['rólunk', 'csapat', 'tapasztalat'],
    },
    de: {
      title: 'Über Uns - S-S-M.ro',
      description:
        'Die Plattform wird von Arbeitsschutzberatern mit 20+ Jahren Erfahrung entwickelt.',
      keywords: ['über uns', 'team', 'erfahrung'],
    },
  },
  contact: {
    ro: {
      title: 'Contact - S-S-M.ro',
      description:
        'Contactați-ne pentru informații despre platforma S-S-M.ro. Suport tehnic, demo gratuit, consultanță SSM/PSI.',
      keywords: ['contact ssm', 'suport ssm', 'demo ssm', 'consultanță ssm'],
    },
    bg: {
      title: 'Контакт - S-S-M.ro',
      description:
        'Свържете се с нас за информация за платформата. Техническа поддръжка, безплатно демо.',
      keywords: ['контакт', 'поддръжка', 'демо'],
    },
    en: {
      title: 'Contact - S-S-M.ro',
      description:
        'Contact us for information about the S-S-M.ro platform. Technical support, free demo, OHS consulting.',
      keywords: ['contact ohs', 'support', 'demo', 'consulting'],
    },
    hu: {
      title: 'Kapcsolat - S-S-M.ro',
      description: 'Lépjen kapcsolatba velünk a platformról. Technikai támogatás, ingyenes demó.',
      keywords: ['kapcsolat', 'támogatás', 'demó'],
    },
    de: {
      title: 'Kontakt - S-S-M.ro',
      description:
        'Kontaktieren Sie uns für Informationen über die Plattform. Technischer Support, kostenlose Demo.',
      keywords: ['kontakt', 'support', 'demo'],
    },
  },
  blog: {
    ro: {
      title: 'Blog SSM/PSI - S-S-M.ro',
      description:
        'Articole despre securitatea muncii, protecția împotriva incendiilor, legislație SSM, best practices, ghiduri practice pentru consultanți și firme.',
      keywords: [
        'blog ssm',
        'articole ssm',
        'legislație ssm',
        'ghiduri ssm',
        'securitate muncă',
        'protecție incendiu',
      ],
    },
    bg: {
      title: 'Блог - S-S-M.ro',
      description:
        'Статии за здравословни и безопасни условия на труд, законодателство, добри практики.',
      keywords: ['блог збут', 'статии', 'законодателство'],
    },
    en: {
      title: 'OHS Blog - S-S-M.ro',
      description:
        'Articles about occupational health and safety, fire safety, legislation, best practices, practical guides.',
      keywords: ['ohs blog', 'safety articles', 'legislation', 'guides'],
    },
    hu: {
      title: 'Blog - S-S-M.ro',
      description:
        'Cikkek munkavédelemről, tűzvédelemről, jogszabályokról, legjobb gyakorlatokról.',
      keywords: ['munkavédelem blog', 'cikkek', 'jogszabályok'],
    },
    de: {
      title: 'Blog - S-S-M.ro',
      description: 'Artikel über Arbeitsschutz, Brandschutz, Gesetzgebung, Best Practices.',
      keywords: ['arbeitsschutz blog', 'artikel', 'gesetzgebung'],
    },
  },
  'blog-post': {
    ro: {
      title: 'Blog SSM/PSI - S-S-M.ro',
      description: 'Citește articolul complet pe blogul S-S-M.ro.',
      keywords: ['articol ssm', 'blog ssm'],
    },
    bg: {
      title: 'Блог - S-S-M.ro',
      description: 'Прочетете пълната статия в блога.',
      keywords: ['статия', 'блог'],
    },
    en: {
      title: 'Blog Post - S-S-M.ro',
      description: 'Read the full article on S-S-M.ro blog.',
      keywords: ['article', 'blog'],
    },
    hu: {
      title: 'Blog Cikk - S-S-M.ro',
      description: 'Olvassa el a teljes cikket a blogon.',
      keywords: ['cikk', 'blog'],
    },
    de: {
      title: 'Blog-Artikel - S-S-M.ro',
      description: 'Lesen Sie den vollständigen Artikel im Blog.',
      keywords: ['artikel', 'blog'],
    },
  },
  login: {
    ro: {
      title: 'Autentificare - S-S-M.ro',
      description:
        'Conectează-te la contul tău S-S-M.ro. Accesează dashboard-ul de gestionare SSM/PSI.',
      keywords: ['login ssm', 'autentificare ssm', 'cont ssm'],
    },
    bg: {
      title: 'Вход - S-S-M.ro',
      description: 'Влезте в профила си. Достъп до таблото за управление.',
      keywords: ['вход', 'профил'],
    },
    en: {
      title: 'Login - S-S-M.ro',
      description: 'Sign in to your S-S-M.ro account. Access your OHS management dashboard.',
      keywords: ['login', 'sign in', 'account'],
    },
    hu: {
      title: 'Bejelentkezés - S-S-M.ro',
      description: 'Jelentkezzen be fiókjába. Hozzáférés a kezelőpulthoz.',
      keywords: ['bejelentkezés', 'fiók'],
    },
    de: {
      title: 'Anmelden - S-S-M.ro',
      description: 'Melden Sie sich bei Ihrem Konto an. Zugriff auf das Management-Dashboard.',
      keywords: ['anmelden', 'konto'],
    },
  },
  register: {
    ro: {
      title: 'Înregistrare - S-S-M.ro',
      description: 'Creează cont gratuit S-S-M.ro. Testează platforma 14 zile fără card bancar.',
      keywords: ['înregistrare ssm', 'cont nou ssm', '試用 ssm'],
    },
    bg: {
      title: 'Регистрация - S-S-M.ro',
      description: 'Създайте безплатен акаунт. Тествайте платформата 14 дни без кредитна карта.',
      keywords: ['регистрация', 'нов акаунт'],
    },
    en: {
      title: 'Sign Up - S-S-M.ro',
      description: 'Create free S-S-M.ro account. Test the platform 14 days without credit card.',
      keywords: ['sign up', 'register', 'create account', 'free trial'],
    },
    hu: {
      title: 'Regisztráció - S-S-M.ro',
      description:
        'Hozzon létre ingyenes fiókot. Tesztelje a platformot 14 napig bankkártya nélkül.',
      keywords: ['regisztráció', 'új fiók'],
    },
    de: {
      title: 'Registrieren - S-S-M.ro',
      description:
        'Erstellen Sie ein kostenloses Konto. Testen Sie die Plattform 14 Tage ohne Kreditkarte.',
      keywords: ['registrieren', 'neues konto'],
    },
  },
  dashboard: {
    ro: {
      title: 'Dashboard - S-S-M.ro',
      description:
        'Gestionare completă SSM/PSI: angajați, instruiri, control medical, echipamente, rapoarte.',
      keywords: ['dashboard ssm', 'gestionare ssm', 'rapoarte ssm'],
    },
    bg: {
      title: 'Табло - S-S-M.ro',
      description:
        'Пълно управление на ЗБУТ: служители, обучения, медицински прегледи, оборудване.',
      keywords: ['табло', 'управление'],
    },
    en: {
      title: 'Dashboard - S-S-M.ro',
      description:
        'Complete OHS management: employees, training, medical checkups, equipment, reports.',
      keywords: ['dashboard', 'ohs management'],
    },
    hu: {
      title: 'Vezérlőpult - S-S-M.ro',
      description:
        'Teljes munkavédelmi kezelés: alkalmazottak, képzések, orvosi vizsgálatok, felszerelések.',
      keywords: ['vezérlőpult', 'kezelés'],
    },
    de: {
      title: 'Dashboard - S-S-M.ro',
      description:
        'Vollständiges Arbeitsschutz-Management: Mitarbeiter, Schulungen, medizinische Untersuchungen, Ausrüstung.',
      keywords: ['dashboard', 'management'],
    },
  },
  faq: {
    ro: {
      title: 'Întrebări Frecvente - S-S-M.ro',
      description:
        'Răspunsuri la întrebări frecvente despre platforma S-S-M.ro, funcționalități, prețuri, suport.',
      keywords: ['întrebări ssm', 'faq ssm', 'ajutor ssm', 'suport ssm'],
    },
    bg: {
      title: 'Често Задавани Въпроси - S-S-M.ro',
      description: 'Отговори на често задавани въпроси за платформата.',
      keywords: ['въпроси', 'помощ'],
    },
    en: {
      title: 'FAQ - S-S-M.ro',
      description:
        'Frequently asked questions about S-S-M.ro platform, features, pricing, support.',
      keywords: ['faq', 'questions', 'help', 'support'],
    },
    hu: {
      title: 'GYIK - S-S-M.ro',
      description: 'Gyakran ismételt kérdések a platformról.',
      keywords: ['gyik', 'kérdések', 'segítség'],
    },
    de: {
      title: 'FAQ - S-S-M.ro',
      description: 'Häufig gestellte Fragen zur Plattform.',
      keywords: ['faq', 'fragen', 'hilfe'],
    },
  },
  glossary: {
    ro: {
      title: 'Glosar SSM/PSI - S-S-M.ro',
      description:
        'Glosar complet de termeni SSM și PSI. Definiții, explicații, legislație aplicabilă.',
      keywords: ['glosar ssm', 'termeni ssm', 'definiții ssm', 'legislație ssm'],
    },
    bg: {
      title: 'Речник - S-S-M.ro',
      description: 'Пълен речник на термини за ЗБУТ и пожарна безопасност.',
      keywords: ['речник', 'термини'],
    },
    en: {
      title: 'Glossary - S-S-M.ro',
      description:
        'Complete glossary of OHS and fire safety terms. Definitions, explanations, applicable legislation.',
      keywords: ['glossary', 'ohs terms', 'definitions'],
    },
    hu: {
      title: 'Szójegyzék - S-S-M.ro',
      description: 'Teljes munkavédelmi és tűzvédelmi fogalomtár.',
      keywords: ['szójegyzék', 'fogalmak'],
    },
    de: {
      title: 'Glossar - S-S-M.ro',
      description: 'Vollständiges Glossar für Arbeitsschutz- und Brandschutzbegriffe.',
      keywords: ['glossar', 'begriffe'],
    },
  },
  industries: {
    ro: {
      title: 'Industrii - S-S-M.ro',
      description:
        'Soluții SSM/PSI adaptate pentru diferite industrii: construcții, producție, retail, HoReCa, transport, sănătate.',
      keywords: ['industrii ssm', 'sectoare ssm', 'soluții ssm', 'construcții', 'producție'],
    },
    bg: {
      title: 'Индустрии - S-S-M.ro',
      description: 'ЗБУТ решения за различни индустрии.',
      keywords: ['индустрии', 'сектори'],
    },
    en: {
      title: 'Industries - S-S-M.ro',
      description:
        'OHS solutions tailored for different industries: construction, manufacturing, retail, hospitality, transport, healthcare.',
      keywords: ['industries', 'sectors', 'ohs solutions'],
    },
    hu: {
      title: 'Iparágak - S-S-M.ro',
      description: 'Munkavédelmi megoldások különböző iparágakhoz.',
      keywords: ['iparágak', 'szektorok'],
    },
    de: {
      title: 'Branchen - S-S-M.ro',
      description: 'Arbeitsschutzlösungen für verschiedene Branchen.',
      keywords: ['branchen', 'sektoren'],
    },
  },
  compare: {
    ro: {
      title: 'Comparare - S-S-M.ro',
      description:
        'Compară S-S-M.ro cu alte platforme SSM. Vezi diferențele, funcționalități, prețuri.',
      keywords: ['comparare ssm', 'alternative ssm', 'platforme ssm'],
    },
    bg: {
      title: 'Сравнение - S-S-M.ro',
      description: 'Сравнете S-S-M.ro с други ЗБУТ платформи.',
      keywords: ['сравнение', 'алтернативи'],
    },
    en: {
      title: 'Compare - S-S-M.ro',
      description: 'Compare S-S-M.ro with other OHS platforms. See differences, features, pricing.',
      keywords: ['compare', 'alternatives', 'ohs platforms'],
    },
    hu: {
      title: 'Összehasonlítás - S-S-M.ro',
      description: 'Hasonlítsa össze az S-S-M.ro-t más platformokkal.',
      keywords: ['összehasonlítás', 'alternatívák'],
    },
    de: {
      title: 'Vergleich - S-S-M.ro',
      description: 'Vergleichen Sie S-S-M.ro mit anderen Plattformen.',
      keywords: ['vergleich', 'alternativen'],
    },
  },
  changelog: {
    ro: {
      title: 'Changelog - S-S-M.ro',
      description:
        'Istoric actualizări platformă S-S-M.ro. Funcționalități noi, îmbunătățiri, bug-uri rezolvate.',
      keywords: ['changelog', 'actualizări', 'versiuni noi'],
    },
    bg: {
      title: 'Промени - S-S-M.ro',
      description: 'История на актуализациите на платформата.',
      keywords: ['промени', 'актуализации'],
    },
    en: {
      title: 'Changelog - S-S-M.ro',
      description: 'Platform updates history. New features, improvements, bug fixes.',
      keywords: ['changelog', 'updates', 'releases'],
    },
    hu: {
      title: 'Változások - S-S-M.ro',
      description: 'Platform frissítések története.',
      keywords: ['változások', 'frissítések'],
    },
    de: {
      title: 'Änderungsprotokoll - S-S-M.ro',
      description: 'Verlauf der Plattform-Updates.',
      keywords: ['änderungen', 'updates'],
    },
  },
  terms: {
    ro: {
      title: 'Termeni și Condiții - S-S-M.ro',
      description: 'Termeni și condiții de utilizare a platformei S-S-M.ro.',
      keywords: ['termeni', 'condiții', 'contract'],
    },
    bg: {
      title: 'Условия за ползване - S-S-M.ro',
      description: 'Условия за ползване на платформата.',
      keywords: ['условия', 'договор'],
    },
    en: {
      title: 'Terms and Conditions - S-S-M.ro',
      description: 'Terms and conditions for using the S-S-M.ro platform.',
      keywords: ['terms', 'conditions', 'agreement'],
    },
    hu: {
      title: 'Felhasználási Feltételek - S-S-M.ro',
      description: 'A platform használatának feltételei.',
      keywords: ['feltételek', 'szerződés'],
    },
    de: {
      title: 'Nutzungsbedingungen - S-S-M.ro',
      description: 'Nutzungsbedingungen für die Plattform.',
      keywords: ['bedingungen', 'vertrag'],
    },
  },
  privacy: {
    ro: {
      title: 'Politica de Confidențialitate - S-S-M.ro',
      description: 'Politica de confidențialitate și protecție date GDPR pentru S-S-M.ro.',
      keywords: ['confidențialitate', 'gdpr', 'protecție date'],
    },
    bg: {
      title: 'Политика за поверителност - S-S-M.ro',
      description: 'Политика за поверителност и защита на данните GDPR.',
      keywords: ['поверителност', 'gdpr'],
    },
    en: {
      title: 'Privacy Policy - S-S-M.ro',
      description: 'Privacy policy and GDPR data protection for S-S-M.ro.',
      keywords: ['privacy', 'gdpr', 'data protection'],
    },
    hu: {
      title: 'Adatvédelmi Irányelvek - S-S-M.ro',
      description: 'Adatvédelmi irányelvek és GDPR adatvédelem.',
      keywords: ['adatvédelem', 'gdpr'],
    },
    de: {
      title: 'Datenschutzrichtlinie - S-S-M.ro',
      description: 'Datenschutzrichtlinie und DSGVO-Datenschutz.',
      keywords: ['datenschutz', 'dsgvo'],
    },
  },
};

interface MetadataOptions {
  page: PageType;
  locale?: Locale;
  title?: string; // Override title (for blog posts, dynamic pages)
  description?: string; // Override description
  image?: string; // Override image
  noIndex?: boolean; // Explicitly set noindex
  canonical?: string; // Override canonical URL
}

/**
 * Generate Next.js Metadata object for a page
 * @param options Metadata generation options
 * @returns Next.js Metadata object
 */
export function generateMetadata(options: MetadataOptions): Metadata {
  const {
    page,
    locale = 'ro',
    title: customTitle,
    description: customDescription,
    image: customImage,
    noIndex,
    canonical: customCanonical,
  } = options;

  // Get page config for locale
  const pageConfig = PAGE_CONFIGS[page]?.[locale];
  if (!pageConfig) {
    console.warn(`No metadata config found for page: ${page}, locale: ${locale}`);
  }

  const title = customTitle || pageConfig?.title || SITE_CONFIG.name;
  const description =
    customDescription || pageConfig?.description || SITE_CONFIG.description[locale];
  const image = customImage || SITE_CONFIG.image;
  const keywords = pageConfig?.keywords || [];

  // Build canonical URL
  const pathSegment = page === 'home' ? '' : page;
  const localeSegment = locale === 'ro' ? '' : `/${locale}`;
  const canonicalUrl =
    customCanonical || `${SITE_CONFIG.url}${localeSegment}/${pathSegment}`.replace(/\/$/, '');

  // Build alternate URLs for all locales
  const alternates: Record<string, string> = {};
  const locales: Locale[] = ['ro', 'bg', 'en', 'hu', 'de'];
  locales.forEach((loc) => {
    const locSegment = loc === 'ro' ? '' : `/${loc}`;
    alternates[loc] = `${SITE_CONFIG.url}${locSegment}/${pathSegment}`.replace(/\/$/, '');
  });

  // Determine if page should be indexed
  const shouldNoIndex = noIndex !== undefined ? noIndex : page === 'dashboard';

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'S-S-M.ro Team' }],
    creator: 'S-S-M.ro',
    publisher: 'S-S-M.ro',
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: canonicalUrl,
      languages: alternates,
    },
    openGraph: {
      type: 'website',
      locale:
        locale === 'ro'
          ? 'ro_RO'
          : locale === 'bg'
            ? 'bg_BG'
            : locale === 'en'
              ? 'en_US'
              : locale === 'hu'
                ? 'hu_HU'
                : 'de_DE',
      url: canonicalUrl,
      title,
      description,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: SITE_CONFIG.twitter,
      creator: SITE_CONFIG.twitter,
      title,
      description,
      images: [image],
    },
    robots: shouldNoIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    verification: {
      google: 'google-site-verification-code', // Add actual verification code
    },
  };

  return metadata;
}

/**
 * Generate sitemap URL entries
 * @returns Array of sitemap URLs
 */
export function generateSitemapUrls() {
  const locales: Locale[] = ['ro', 'bg', 'en', 'hu', 'de'];
  const publicPages: PageType[] = [
    'home',
    'pricing',
    'about',
    'contact',
    'blog',
    'faq',
    'glossary',
    'industries',
    'compare',
    'changelog',
    'terms',
    'privacy',
  ];

  const urls: Array<{
    url: string;
    lastModified: Date;
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority: number;
    alternates?: {
      languages: Record<string, string>;
    };
  }> = [];

  publicPages.forEach((page) => {
    locales.forEach((locale) => {
      const pathSegment = page === 'home' ? '' : page;
      const localeSegment = locale === 'ro' ? '' : `/${locale}`;
      const url =
        `${SITE_CONFIG.url}${localeSegment}/${pathSegment}`.replace(/\/$/, '') || SITE_CONFIG.url;

      // Build alternates
      const alternates: Record<string, string> = {};
      locales.forEach((loc) => {
        const locSegment = loc === 'ro' ? '' : `/${loc}`;
        alternates[loc] =
          `${SITE_CONFIG.url}${locSegment}/${pathSegment}`.replace(/\/$/, '') || SITE_CONFIG.url;
      });

      urls.push({
        url,
        lastModified: new Date(),
        changeFrequency: page === 'home' ? 'daily' : page === 'blog' ? 'weekly' : 'monthly',
        priority: page === 'home' ? 1.0 : page === 'pricing' ? 0.9 : 0.7,
        alternates: {
          languages: alternates,
        },
      });
    });
  });

  return urls;
}

/**
 * Helper to generate JSON-LD structured data
 * @param type Schema.org type
 * @param data Structured data object
 * @returns JSON-LD script content
 */
export function generateStructuredData(type: string, data: Record<string, unknown>) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };
}

/**
 * Generate Organization structured data
 */
export function generateOrganizationStructuredData(locale: Locale = 'ro') {
  return generateStructuredData('Organization', {
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    description: SITE_CONFIG.description[locale],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'RO',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'contact@s-s-m.ro',
    },
    sameAs: [SITE_CONFIG.twitter],
  });
}

/**
 * Generate WebSite structured data with search action
 */
export function generateWebsiteStructuredData(locale: Locale = 'ro') {
  return generateStructuredData('WebSite', {
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description[locale],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  });
}
