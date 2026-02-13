# SEO JSON-LD Structured Data Library

Biblioteca de generare structured data (JSON-LD) pentru optimizare SEO conform Schema.org.

## 📋 Descriere

Această bibliotecă oferă generatoare type-safe pentru diverse tipuri de structured data care îmbunătățesc vizibilitatea în motoarele de căutare și permit rich snippets în rezultatele de căutare.

## 🚀 Utilizare

### 1. Import și utilizare de bază

```tsx
import { JsonLd } from '@/components/seo/JsonLd';
import { organizationJsonLd, softwareAppJsonLd } from '@/lib/seo/jsonld';

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd('ro')} />
      <JsonLd data={softwareAppJsonLd('ro')} />
      <main>
        {/* Conținutul paginii */}
      </main>
    </>
  );
}
```

### 2. Tipuri de scheme disponibile

#### Organization Schema
Informații despre compania S-S-M.ro:

```tsx
<JsonLd data={organizationJsonLd('ro')} />
```

**Parametri:**
- `locale` (opțional): 'ro' | 'bg' | 'en' | 'hu' | 'de' (default: 'ro')

#### Software Application Schema
Detalii despre platforma SaaS:

```tsx
<JsonLd data={softwareAppJsonLd('ro')} />
```

**Parametri:**
- `locale` (opțional): limba pentru descriere

#### FAQ Page Schema
Pentru pagini cu întrebări frecvente:

```tsx
const faqs = [
  {
    question: 'Ce este platforma S-S-M.ro?',
    answer: 'Platformă digitală pentru conformitate SSM/PSI...'
  },
  // mai multe întrebări
];

<JsonLd data={faqPageJsonLd(faqs)} />
```

#### Breadcrumb Schema
Pentru navigare ierarhică:

```tsx
const breadcrumbs = [
  { name: 'Acasă', url: 'https://app.s-s-m.ro' },
  { name: 'Dashboard', url: 'https://app.s-s-m.ro/dashboard' },
  { name: 'Angajați', url: 'https://app.s-s-m.ro/dashboard/employees' }
];

<JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
```

#### Article Schema
Pentru articole de blog:

```tsx
<JsonLd
  data={articleJsonLd({
    title: 'Titlul articolului',
    description: 'Descrierea articolului',
    url: 'https://app.s-s-m.ro/blog/slug',
    imageUrl: 'https://app.s-s-m.ro/images/cover.jpg',
    authorName: 'Daniel - Consultant SSM',
    publishDate: '2026-01-15T10:00:00Z',
    modifiedDate: '2026-01-20T14:30:00Z',
    locale: 'ro'
  })}
/>
```

### 3. Exemple complete

Vezi `lib/seo/examples.tsx` pentru exemple detaliate de utilizare în diverse tipuri de pagini:
- Homepage cu multiple scheme
- Pagină FAQ
- Articol de blog
- Pagină dashboard cu breadcrumbs
- Landing page cu scheme combinate

## 📁 Structură fișiere

```
lib/seo/
├── jsonld.ts          # Generatoare JSON-LD
├── examples.tsx       # Exemple de utilizare
└── README.md          # Această documentație

components/seo/
└── JsonLd.tsx         # Componenta React pentru inserare
```

## 🔍 Beneficii SEO

1. **Rich Snippets**: Rezultate îmbogățite în Google Search cu rating, preț, FAQ-uri
2. **Knowledge Graph**: Informații despre companie în panoul Google
3. **Breadcrumbs**: Navigare vizibilă în rezultatele de căutare
4. **FAQ Accordion**: Întrebări expandabile direct în rezultate
5. **Article Cards**: Preview îmbogățit pentru articole de blog

## ✅ Validare

Validează structured data folosind:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- Google Search Console → Enhancements

## 🎯 Best Practices

1. **Combinați scheme**: Utilizați multiple scheme pe aceeași pagină (ex: Organization + SoftwareApp)
2. **Actualizați datele**: Păstrați informațiile sincronizate cu conținutul real
3. **Folosiți locale corect**: Specificați limba corectă pentru fiecare pagină
4. **Testați**: Validați mereu cu Google Rich Results Test înainte de deploy
5. **Monitorizați**: Urmăriți performance în Google Search Console

## 📝 Note tehnice

- Folosește `schema-dts` pentru type safety complet
- Compatibil cu Next.js App Router și Server Components
- Nu necesită JavaScript client-side (SEO-friendly)
- Suportă Server-Side Rendering (SSR) complet
- Generat automat cu suport multilingv

## 🔗 Resurse

- [Schema.org Documentation](https://schema.org/)
- [Google Search Central - Structured Data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
