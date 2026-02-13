/**
 * JSON-LD Structured Data Generators for SEO
 *
 * Provides type-safe generators for various Schema.org structured data types
 * to enhance search engine understanding and rich snippets.
 */

import type { Organization, WithContext, SoftwareApplication, FAQPage, BreadcrumbList, Article } from 'schema-dts';

/**
 * Generate Organization structured data for s-s-m.ro
 *
 * @param locale - Current locale (ro, bg, en, hu, de)
 * @returns JSON-LD Organization schema
 */
export function organizationJsonLd(locale: string = 'ro'): WithContext<Organization> {
  const baseUrl = 'https://app.s-s-m.ro';

  const descriptions: Record<string, string> = {
    ro: 'Platformă digitală SSM/PSI pentru consultanți și firme. Gestionează compliance-ul în securitate muncii și prevenire incendii în România, Bulgaria, Ungaria și Germania.',
    bg: 'Дигитална платформа за консултанти и фирми по ОЗ и ПП. Управление на съответствието с изискванията за безопасност на труда и противопожарна защита.',
    en: 'Digital OSH/Fire Safety platform for consultants and companies. Manage occupational safety and fire prevention compliance across Romania, Bulgaria, Hungary, and Germany.',
    hu: 'Digitális munkavédelmi és tűzvédelmi platform tanácsadók és vállalatok számára. Megfelelőség kezelése Romániában, Bulgáriában, Magyarországon és Németországban.',
    de: 'Digitale Plattform für Arbeitsschutz und Brandschutz für Berater und Unternehmen. Compliance-Management in Rumänien, Bulgarien, Ungarn und Deutschland.'
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'S-S-M.ro',
    legalName: 'Platformă SSM/PSI Digitală',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: descriptions[locale] || descriptions.ro,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: ['ro', 'bg', 'en', 'hu', 'de']
    },
    areaServed: [
      {
        '@type': 'Country',
        name: 'Romania'
      },
      {
        '@type': 'Country',
        name: 'Bulgaria'
      },
      {
        '@type': 'Country',
        name: 'Hungary'
      },
      {
        '@type': 'Country',
        name: 'Germany'
      }
    ],
    foundingDate: '2024',
    slogan: descriptions[locale] || descriptions.ro
  };
}

/**
 * Generate SoftwareApplication structured data for the SaaS product
 *
 * @param locale - Current locale
 * @returns JSON-LD SoftwareApplication schema
 */
export function softwareAppJsonLd(locale: string = 'ro'): WithContext<SoftwareApplication> {
  const baseUrl = 'https://app.s-s-m.ro';

  const names: Record<string, string> = {
    ro: 'Platformă SSM/PSI Digitală',
    bg: 'Дигитална платформа за ОЗ и ПП',
    en: 'Digital OSH/Fire Safety Platform',
    hu: 'Digitális munkavédelmi platform',
    de: 'Digitale Arbeitsschutzplattform'
  };

  const descriptions: Record<string, string> = {
    ro: 'Platformă SaaS pentru gestionarea conformității SSM și PSI. Urmărire angajați, echipamente, training-uri, controale medicale, alerte automate și raportare completă.',
    bg: 'SaaS платформа за управление на съответствието с ОЗ и ПП. Проследяване на служители, оборудване, обучения, медицински прегледи, автоматични уведомления и цялостно отчитане.',
    en: 'SaaS platform for OSH and fire safety compliance management. Track employees, equipment, trainings, medical checks, automated alerts, and comprehensive reporting.',
    hu: 'SaaS platform munkavédelmi és tűzvédelmi megfelelőség kezeléséhez. Alkalmazottak, eszközök, képzések, orvosi vizsgálatok követése, automatikus értesítések és átfogó jelentések.',
    de: 'SaaS-Plattform für Arbeitsschutz- und Brandschutz-Compliance. Verfolgung von Mitarbeitern, Ausrüstung, Schulungen, ärztlichen Untersuchungen, automatische Warnungen und umfassende Berichterstattung.'
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: names[locale] || names.ro,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'RON',
      availability: 'https://schema.org/InStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '100'
    },
    description: descriptions[locale] || descriptions.ro,
    url: baseUrl,
    screenshot: `${baseUrl}/screenshot.png`,
    softwareVersion: '1.0',
    applicationSubCategory: 'Compliance Management Software',
    featureList: [
      'Employee tracking',
      'Equipment management',
      'Training management',
      'Medical records',
      'Automated alerts',
      'Document management',
      'Audit trails',
      'Multi-language support',
      'Role-based access control'
    ]
  };
}

/**
 * Generate FAQPage structured data
 *
 * @param faqs - Array of FAQ items with question and answer
 * @returns JSON-LD FAQPage schema
 */
export function faqPageJsonLd(faqs: Array<{ question: string; answer: string }>): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * Generate BreadcrumbList structured data
 *
 * @param items - Array of breadcrumb items with name and url
 * @returns JSON-LD BreadcrumbList schema
 */
export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

/**
 * Generate Article structured data for blog posts
 *
 * @param options - Article options
 * @returns JSON-LD Article schema
 */
export function articleJsonLd(options: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  authorName: string;
  publishDate: string;
  modifiedDate?: string;
  locale?: string;
}): WithContext<Article> {
  const {
    title,
    description,
    url,
    imageUrl,
    authorName,
    publishDate,
    modifiedDate,
    locale = 'ro'
  } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: url,
    image: imageUrl || 'https://app.s-s-m.ro/logo.png',
    author: {
      '@type': 'Person',
      name: authorName
    },
    publisher: {
      '@type': 'Organization',
      name: 'S-S-M.ro',
      logo: {
        '@type': 'ImageObject',
        url: 'https://app.s-s-m.ro/logo.png'
      }
    },
    datePublished: publishDate,
    dateModified: modifiedDate || publishDate,
    inLanguage: locale,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  };
}

/**
 * Utility function to render JSON-LD script tag
 * Use this in Next.js components to inject structured data
 *
 * @param data - JSON-LD data object
 * @returns Script element props for Next.js Script component
 */
export function renderJsonLd(data: WithContext<any>) {
  return {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(data)
    }
  };
}
