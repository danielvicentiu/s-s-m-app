'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  User,
  Share2,
  Copy,
  Check,
  ArrowLeft,
  Linkedin,
  Facebook,
  Twitter
} from 'lucide-react'
import { BlogCategory } from '@/lib/types'

// Mock data pentru articol - în producție ar veni din Supabase
const MOCK_ARTICLES = [
  {
    id: '1',
    slug: 'ghid-complet-iso-45001-2026',
    title: 'Ghid complet pentru implementarea ISO 45001 în 2026',
    excerpt: 'Află cum să implementezi standardul ISO 45001 pentru managementul sănătății și securității muncii în compania ta. Pași esențiali și beneficii.',
    category: 'SSM' as BlogCategory,
    author: 'Daniel Popescu',
    author_avatar: '',
    published_date: '2026-02-10',
    read_time_minutes: 8,
    thumbnail_url: '',
    content: `
# Introducere

Standardul **ISO 45001** reprezintă cadrul internațional pentru sistemele de management al sănătății și securității ocupaționale. Implementarea acestui standard poate transforma radical modul în care compania ta gestionează riscurile și asigură un mediu de lucru sigur.

## De ce ISO 45001?

Standardul oferă multiple beneficii:

- **Reducerea accidentelor** de muncă cu până la 40%
- **Conformitate legală** garantată
- **Îmbunătățirea culturii** organizaționale
- **Reducerea costurilor** asociate cu accidentele

## Pașii esențiali pentru implementare

### 1. Evaluarea inițială

Primul pas este să înțelegi unde te afli acum. Realizează un audit complet al:

\`\`\`typescript
interface InitialAudit {
  currentPractices: string[]
  identifiedRisks: Risk[]
  complianceGaps: string[]
  stakeholders: string[]
}
\`\`\`

### 2. Planificarea implementării

Dezvoltă un plan detaliat care include:

1. **Timeline realist** (de obicei 6-12 luni)
2. **Resurse necesare** (buget, personal, consultanți)
3. **Obiective măsurabile** (KPI-uri clare)
4. **Responsabilități** clare pentru fiecare etapă

### 3. Formarea echipei

> "Un sistem de management este la fel de bun ca și oamenii care îl implementează" - ISO Guide

Investește în:

- Training pentru management
- Cursuri de specialitate pentru echipa SSM
- Conștientizare generală pentru toți angajații

### 4. Documentarea sistemului

Creează documentația necesară:

- Politica SSM
- Proceduri operaționale
- Instrucțiuni de lucru
- Formulare și înregistrări

### 5. Implementarea efectivă

Pune sistemul în practică:

- Comunică clar așteptările
- Monitorizează implementarea
- Colectează feedback
- Ajustează procesele

### 6. Auditurile interne

Verifică regulat eficiența sistemului prin:

- Audituri programate trimestrial
- Verificări ad-hoc
- Analiza indicatorilor de performanță

### 7. Certificarea

Pregătește-te pentru auditul de certificare:

- Revizuiește întreaga documentație
- Simulează auditul
- Pregătește echipa pentru interviuri
- Asigură-te că toate înregistrările sunt la zi

## Provocări comune și soluții

### Provocare: Rezistență la schimbare

**Soluție**: Implică angajații din faza de planificare. Explică beneficiile clare și personale ale noului sistem.

### Provocare: Resurse limitate

**Soluție**: Începe cu procesele cele mai riscante. Nu trebuie să implementezi totul simultan.

### Provocare: Complexitatea documentației

**Soluție**: Folosește platforme digitale precum **s-s-m.ro** pentru automatizarea documentației și gestionarea conformității.

## Beneficii pe termen lung

După implementarea cu succes a ISO 45001, companiile raportează:

- **Reducere 45%** a incidentelor de securitate
- **Îmbunătățire 30%** a productivității
- **Scădere 25%** a costurilor cu asigurările
- **Creștere** a satisfacției angajaților

## Concluzie

Implementarea ISO 45001 este o investiție în viitorul companiei tale. Deși procesul poate părea intimidant inițial, beneficiile pe termen lung depășesc cu mult efortul investit.

Începe astăzi și transformă cultura de securitate din organizația ta!
    `,
  },
  {
    id: '2',
    slug: 'reglementari-psi-2026',
    title: 'Noile reglementări PSI: Ce trebuie să știi în 2026',
    excerpt: 'Legislația privind prevenirea și stingerea incendiilor s-a actualizat. Descoperă modificările importante și cum te afectează.',
    category: 'PSI' as BlogCategory,
    author: 'Maria Ionescu',
    published_date: '2026-02-08',
    read_time_minutes: 6,
    content: `
# Actualizări legislative PSI 2026

Anul 2026 aduce modificări importante în legislația PSI din România...
    `,
  },
  {
    id: '3',
    slug: 'gdpr-gestionare-date-angajati',
    title: 'GDPR și gestionarea datelor angajaților: Best practices',
    excerpt: 'Cum să gestionezi în mod legal și etic datele personale ale angajaților respectând Regulamentul GDPR.',
    category: 'GDPR' as BlogCategory,
    author: 'Ana Dumitrescu',
    published_date: '2026-02-05',
    read_time_minutes: 10,
    content: `
# GDPR în contextul HR

Protecția datelor personale ale angajaților este o responsabilitate crucială...
    `,
  },
]

const CATEGORY_COLORS: Record<BlogCategory, string> = {
  SSM: 'bg-blue-100 text-blue-700',
  PSI: 'bg-red-100 text-red-700',
  GDPR: 'bg-purple-100 text-purple-700',
  Legislatie: 'bg-green-100 text-green-700',
  NIS2: 'bg-indigo-100 text-indigo-700',
  Sfaturi: 'bg-orange-100 text-orange-700',
}

// Simple markdown renderer pentru demonstrație
function renderMarkdown(content: string) {
  let html = content

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-3xl font-bold text-gray-900 mt-10 mb-5">$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-4xl font-bold text-gray-900 mt-12 mb-6">$1</h1>')

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 py-2 my-4 italic text-gray-700 bg-blue-50">$1</blockquote>')

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="px-2 py-1 bg-gray-100 text-sm text-gray-800 rounded font-mono">$1</code>')

  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm font-mono">${code.trim()}</code></pre>`
  })

  // Lists
  html = html.replace(/^- (.+)$/gm, '<li class="ml-6 mb-2 list-disc">$1</li>')
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li class="ml-6 mb-2 list-decimal">$1. $2</li>')

  // Paragraphs
  html = html.replace(/^(?!<[h|li|bl|pr|co]|```|[>#-])(.+)$/gm, '<p class="text-gray-700 leading-relaxed mb-4">$1</p>')

  // Wrap lists
  html = html.replace(/(<li class="ml-6 mb-2 list-disc">.*?<\/li>\n?)+/g, '<ul class="my-4">$&</ul>')
  html = html.replace(/(<li class="ml-6 mb-2 list-decimal">.*?<\/li>\n?)+/g, '<ol class="my-4">$&</ol>')

  return html
}

export default function BlogArticlePage() {
  const params = useParams()
  const slug = params.slug as string
  const [copied, setCopied] = useState(false)

  // Găsește articolul
  const article = MOCK_ARTICLES.find((a) => a.slug === slug)

  // Articole related (același categorie, exclude articolul curent)
  const relatedArticles = article
    ? MOCK_ARTICLES.filter(
        (a) => a.category === article.category && a.id !== article.id
      ).slice(0, 3)
    : []

  // Share functions
  const shareToLinkedIn = () => {
    const url = window.location.href
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
  }

  const shareToFacebook = () => {
    const url = window.location.href
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
  }

  const shareToTwitter = () => {
    const url = window.location.href
    const text = article?.title || ''
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Articol negăsit</h1>
          <p className="text-gray-600 mb-8">Ne pare rău, acest articol nu există.</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Înapoi la blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Înapoi la blog
          </Link>
        </div>
      </div>

      {/* Article header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Category badge */}
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-6 ${
              CATEGORY_COLORS[article.category]
            }`}
          >
            {article.category}
          </span>

          {/* Title */}
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="font-medium">{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>
                {new Date(article.published_date).toLocaleDateString('ro-RO', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{article.read_time_minutes} min citire</span>
            </div>
          </div>

          {/* Share buttons */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 font-medium">Distribuie:</span>
            <div className="flex gap-2">
              <button
                onClick={shareToLinkedIn}
                className="p-2 rounded-lg bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-600 transition-colors"
                title="Distribuie pe LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </button>
              <button
                onClick={shareToFacebook}
                className="p-2 rounded-lg bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-600 transition-colors"
                title="Distribuie pe Facebook"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button
                onClick={shareToTwitter}
                className="p-2 rounded-lg bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-600 transition-colors"
                title="Distribuie pe Twitter"
              >
                <Twitter className="w-5 h-5" />
              </button>
              <button
                onClick={copyLink}
                className="p-2 rounded-lg bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-600 transition-colors"
                title="Copiază link"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero image */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 h-96 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/30 text-9xl font-bold">
            {article.category}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Article content */}
          <article className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 lg:p-12">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }}
            />

            {/* Share buttons bottom */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Ai găsit acest articol util?</p>
                  <p className="text-lg font-semibold text-gray-900">Distribuie-l cu colegii!</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={shareToLinkedIn}
                    className="p-3 rounded-lg bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-600 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button
                    onClick={shareToFacebook}
                    className="p-3 rounded-lg bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-600 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button
                    onClick={shareToTwitter}
                    className="p-3 rounded-lg bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-600 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button
                    onClick={copyLink}
                    className="p-3 rounded-lg bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-600 transition-colors"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0 space-y-8">
            {/* Related articles */}
            {relatedArticles.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Articole similare
                </h3>
                <div className="space-y-4">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.id}
                      href={`/blog/${related.slug}`}
                      className="block group"
                    >
                      <div className="border border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:shadow-md transition-all">
                        <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {related.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{related.author}</span>
                          <span>•</span>
                          <span>{related.read_time_minutes} min</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/blog"
                  className="block mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Vezi toate articolele →
                </Link>
              </div>
            )}

            {/* Newsletter CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-3">
                Newsletter SSM & PSI
              </h3>
              <p className="text-blue-100 text-sm mb-4">
                Primește săptămânal cele mai importante actualizări legislative și articole din domeniu.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Email-ul tău"
                  className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Abonează-te gratuit
                </button>
              </form>
              <p className="text-xs text-blue-200 mt-3">
                Ne respectăm cititorii. Fără spam, poți să te dezabonezi oricând.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
