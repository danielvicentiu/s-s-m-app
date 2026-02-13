/**
 * JSON-LD Usage Examples
 *
 * Demonstrates how to use the JSON-LD generators in various page types.
 * These examples can be copied into actual pages.
 */

import { JsonLd } from '@/components/seo/JsonLd';
import {
  organizationJsonLd,
  softwareAppJsonLd,
  faqPageJsonLd,
  breadcrumbJsonLd,
  articleJsonLd
} from './jsonld';

/**
 * Example 1: Homepage with Organization and SoftwareApp schemas
 */
export function HomepageExample() {
  return (
    <>
      <JsonLd data={organizationJsonLd('ro')} />
      <JsonLd data={softwareAppJsonLd('ro')} />
      <main>
        {/* Your homepage content */}
      </main>
    </>
  );
}

/**
 * Example 2: FAQ Page
 */
export function FaqPageExample() {
  const faqs = [
    {
      question: 'Ce este platforma S-S-M.ro?',
      answer: 'S-S-M.ro este o platformă digitală pentru gestionarea conformității SSM (securitate și sănătate în muncă) și PSI (prevenire și stingere incendii). Platforma ajută consultanții SSM și firmele să digitizeze procesele de compliance, să urmărească angajații, echipamentele, training-urile și să primească alerte automate.'
    },
    {
      question: 'În ce țări este disponibilă platforma?',
      answer: 'Platforma este disponibilă în România, Bulgaria, Ungaria și Germania, cu suport multilingv complet pentru toate cele 5 limbi: română, bulgară, engleză, maghiară și germană.'
    },
    {
      question: 'Ce funcționalități oferă platforma?',
      answer: 'Platforma oferă gestionare angajați, echipamente, training-uri, controale medicale, documente, alerte automate, raportare completă, audit trail, sistem de penalități și multe altele. Totul cu control bazat pe roluri și acces securizat.'
    },
    {
      question: 'Cum pot începe să folosesc platforma?',
      answer: 'Puteți crea un cont gratuit la https://app.s-s-m.ro și veți avea acces imediat la toate funcționalitățile platformei. Consultanții SSM pot gestiona multiple organizații, iar firmele pot colabora direct cu consultanții lor.'
    },
    {
      question: 'Este sigură platforma?',
      answer: 'Da, platforma folosește Supabase cu Row Level Security (RLS) activat pe toate tabelele, autentificare securizată, audit trail complet și backup-uri automate. Toate datele sunt criptate și stocate în conformitate cu GDPR.'
    }
  ];

  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <JsonLd data={organizationJsonLd('ro')} />
      <main>
        <h1>Întrebări frecvente</h1>
        {faqs.map((faq, index) => (
          <div key={index}>
            <h2>{faq.question}</h2>
            <p>{faq.answer}</p>
          </div>
        ))}
      </main>
    </>
  );
}

/**
 * Example 3: Blog Article Page
 */
export function BlogArticleExample() {
  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: 'Ghid complet pentru conformitatea SSM în 2026',
          description: 'Află tot ce trebuie să știi despre cerințele legale de SSM și PSI pentru companii în România, Bulgaria, Ungaria și Germania.',
          url: 'https://app.s-s-m.ro/blog/ghid-conformitate-ssm-2026',
          imageUrl: 'https://app.s-s-m.ro/blog/ghid-ssm-cover.jpg',
          authorName: 'Daniel - Consultant SSM',
          publishDate: '2026-01-15T10:00:00Z',
          modifiedDate: '2026-01-20T14:30:00Z',
          locale: 'ro'
        })}
      />
      <JsonLd data={organizationJsonLd('ro')} />
      <main>
        {/* Your blog article content */}
      </main>
    </>
  );
}

/**
 * Example 4: Dashboard Page with Breadcrumbs
 */
export function DashboardPageExample() {
  const breadcrumbs = [
    { name: 'Acasă', url: 'https://app.s-s-m.ro' },
    { name: 'Dashboard', url: 'https://app.s-s-m.ro/dashboard' },
    { name: 'Angajați', url: 'https://app.s-s-m.ro/dashboard/employees' }
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={organizationJsonLd('ro')} />
      <main>
        {/* Your dashboard content */}
      </main>
    </>
  );
}

/**
 * Example 5: Multiple schemas on landing page
 */
export function LandingPageExample() {
  const faqs = [
    {
      question: 'Cât costă platforma?',
      answer: 'Platforma este gratuită pentru utilizare. Oferim planuri premium pentru funcționalități avansate și suport prioritar.'
    },
    {
      question: 'Pot integra platforma cu alte sisteme?',
      answer: 'Da, platforma oferă API-uri REST complete pentru integrare cu alte sisteme de HR, ERP sau management.'
    }
  ];

  return (
    <>
      <JsonLd data={organizationJsonLd('ro')} />
      <JsonLd data={softwareAppJsonLd('ro')} />
      <JsonLd data={faqPageJsonLd(faqs)} />
      <main>
        {/* Your landing page content */}
      </main>
    </>
  );
}
