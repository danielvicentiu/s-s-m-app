'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BlogCategory } from '@/lib/types'
import {
  Calendar,
  Clock,
  User,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  ChevronRight,
  ArrowLeft
} from 'lucide-react'

// Mock data pentru articol
const MOCK_ARTICLE = {
  id: '1',
  slug: 'ghid-complet-iso-45001-2026',
  title: 'Ghid complet pentru implementarea ISO 45001 în 2026',
  excerpt: 'Află cum să implementezi standardul ISO 45001 pentru managementul sănătății și securității muncii în compania ta. Pași esențiali și beneficii.',
  category: 'SSM' as BlogCategory,
  author: 'Daniel Popescu',
  author_title: 'Consultant SSM Senior',
  author_avatar: '',
  published_date: '2026-02-10',
  read_time_minutes: 8,
  thumbnail_url: '',
  content: `# Introducere

ISO 45001 este standardul internațional pentru sistemele de management al sănătății și securității ocupaționale (OH&S). Implementarea acestui standard aduce beneficii semnificative organizațiilor, reducând riscurile la locul de muncă și îmbunătățind performanța în domeniul SSM.

## Ce este ISO 45001?

ISO 45001 este primul standard internațional pentru sistemele de management al sănătății și securității ocupaționale. A fost publicat în martie 2018 și înlocuiește vechiul standard OHSAS 18001.

### Beneficii cheie

1. **Reducerea accidentelor de muncă** - Prin identificarea și controlul riscurilor
2. **Conformitate legală** - Asigură respectarea legislației SSM
3. **Îmbunătățirea reputației** - Demonstrează angajamentul față de siguranța angajaților
4. **Creșterea productivității** - Reducerea timpilor morți cauzați de accidente

## Pașii de implementare

### 1. Planificarea și pregătirea

Primul pas constă în obținerea angajamentului managementului de vârf și alocarea resurselor necesare. Este esențial să existe o echipă dedicată implementării standardului.

**Activități cheie:**
- Analiza gap-urilor față de cerințele ISO 45001
- Stabilirea obiectivelor și indicatorilor de performanță
- Alocarea bugetului și resurselor umane

### 2. Dezvoltarea documentației

Sistemul de management trebuie documentat corespunzător. Aceasta include politica SSM, proceduri, instrucțiuni de lucru și înregistrări.

**Documente esențiale:**
- Politica de sănătate și securitate ocupațională
- Manual al sistemului de management SSM
- Proceduri pentru identificarea pericolelor și evaluarea riscurilor
- Proceduri pentru situații de urgență

### 3. Implementarea sistemului

Punerea în practică a sistemului documentat prin:
- Formarea și conștientizarea personalului
- Implementarea proceselor și procedurilor
- Stabilirea mecanismelor de comunicare

### 4. Monitorizarea și măsurarea

Verificarea eficienței sistemului prin:
- Audituri interne regulate
- Analiza indicatorilor de performanță
- Investigarea incidentelor și aproape-accidentelor

### 5. Îmbunătățirea continuă

Sistemul trebuie îmbunătățit continuu pe baza:
- Rezultatelor auditurilor
- Feedback-ului angajaților
- Schimbărilor legislative
- Noilor tehnologii și best practices

## Provocări comune

### Rezistența la schimbare

Angajații pot fi reticenți în adoptarea noilor proceduri. Soluția constă în comunicare transparentă și implicare activă.

### Resurse limitate

Multe organizații se confruntă cu buget și personal limitat. Prioritizarea activităților și implementarea treptată pot ajuta.

### Menținerea angajamentului

După certificare, există riscul relaxării. Audituri regulate și obiective clare mențin sistemul activ.

## Concluzie

Implementarea ISO 45001 este o investiție în siguranța angajaților și succesul pe termen lung al organizației. Cu planificare adecvată și angajament susținut, orice organizație poate implementa cu succes acest standard internațional.

Pentru consultanță specializată în implementarea ISO 45001, contactați echipa noastră de experți SSM.`,
  table_of_contents: [
    { id: 'introducere', title: 'Introducere' },
    { id: 'ce-este-iso-45001', title: 'Ce este ISO 45001?' },
    { id: 'pasii-de-implementare', title: 'Pașii de implementare' },
    { id: 'provocari-comune', title: 'Provocări comune' },
    { id: 'concluzie', title: 'Concluzie' },
  ]
}

// Mock related articles
const RELATED_ARTICLES = [
  {
    id: '2',
    slug: 'noile-reglementari-psi-2026',
    title: 'Noile reglementări PSI: Ce trebuie să știi în 2026',
    excerpt: 'Legislația privind prevenirea și stingerea incendiilor s-a actualizat. Descoperă modificările importante și cum te afectează.',
    category: 'PSI' as BlogCategory,
    author: 'Maria Ionescu',
    published_date: '2026-02-08',
    read_time_minutes: 6,
  },
  {
    id: '6',
    slug: 'instruire-ssm-programe-eficiente',
    title: 'Instruire SSM: Cum să creezi programe eficiente',
    excerpt: 'Ghid pas cu pas pentru dezvoltarea unor programe de instruire SSM care sunt nu doar conforme legal, ci și eficiente și antrenante.',
    category: 'SSM' as BlogCategory,
    author: 'Ana Dumitrescu',
    published_date: '2026-01-25',
    read_time_minutes: 7,
  },
  {
    id: '4',
    slug: 'legislatia-muncii-2026-actualizari',
    title: 'Legislația muncii 2026: Actualizări importante',
    excerpt: 'Noul Cod al Muncii aduce modificări semnificative. Află ce drepturi și obligații noi ai ca angajator sau angajat în 2026.',
    category: 'Legislatie' as BlogCategory,
    author: 'Daniel Popescu',
    published_date: '2026-02-01',
    read_time_minutes: 12,
  },
]

const CATEGORY_COLORS: Record<BlogCategory, string> = {
  SSM: 'bg-blue-100 text-blue-700',
  PSI: 'bg-red-100 text-red-700',
  GDPR: 'bg-purple-100 text-purple-700',
  Legislatie: 'bg-green-100 text-green-700',
  Tips: 'bg-orange-100 text-orange-700',
}

// Simple markdown parser (în producție ar fi mai bine react-markdown sau similar)
function parseMarkdown(markdown: string) {
  let html = markdown

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-gray-900 mt-8 mb-4">$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-5">$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mt-12 mb-6">$1</h1>')

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')

  // Lists
  html = html.replace(/^\d+\.\s+\*\*(.*?)\*\*\s+-\s+(.*$)/gim, '<li class="ml-6 mb-3"><strong class="font-semibold text-gray-900">$1</strong> - $2</li>')
  html = html.replace(/^-\s+(.*$)/gim, '<li class="ml-6 mb-2 text-gray-700">$1</li>')

  // Paragraphs
  html = html.split('\n\n').map(para => {
    if (para.startsWith('<h') || para.startsWith('<li') || para.trim() === '') {
      return para
    }
    return `<p class="text-gray-700 leading-relaxed mb-4">${para}</p>`
  }).join('\n')

  return html
}

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    // Track scroll position for TOC highlighting
    const handleScroll = () => {
      const sections = MOCK_ARTICLE.table_of_contents.map(item =>
        document.getElementById(item.id)
      )

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.getBoundingClientRect().top <= 100) {
          setActiveSection(MOCK_ARTICLE.table_of_contents[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = MOCK_ARTICLE.title

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Acasă
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/blog" className="hover:text-blue-600 transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">
              {MOCK_ARTICLE.category}
            </span>
          </div>
        </div>
      </div>

      {/* Hero section */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Înapoi la blog
          </Link>

          {/* Category badge */}
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
              CATEGORY_COLORS[MOCK_ARTICLE.category]
            }`}
          >
            {MOCK_ARTICLE.category}
          </span>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {MOCK_ARTICLE.title}
          </h1>

          {/* Author & meta info */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {/* Author avatar */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                {MOCK_ARTICLE.author.split(' ').map(n => n[0]).join('')}
              </div>

              {/* Author info */}
              <div>
                <div className="font-semibold text-gray-900">{MOCK_ARTICLE.author}</div>
                <div className="text-sm text-gray-600">{MOCK_ARTICLE.author_title}</div>
              </div>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(MOCK_ARTICLE.published_date).toLocaleDateString('ro-RO', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{MOCK_ARTICLE.read_time_minutes} min citire</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8 lg:gap-12">
          {/* Article content */}
          <article className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
              {/* Featured image placeholder */}
              <div className="h-64 md:h-96 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-8 flex items-center justify-center">
                <div className="text-white/80 text-7xl font-bold">
                  {MOCK_ARTICLE.category}
                </div>
              </div>

              {/* Content */}
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(MOCK_ARTICLE.content) }}
              />

              {/* Share section */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Distribuite acest articol
                  </h3>

                  <div className="flex items-center gap-3">
                    <a
                      href={shareLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>

                    <a
                      href={shareLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center transition-colors"
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>

                    <a
                      href={shareLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center transition-colors"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>

                    <a
                      href={shareLinks.email}
                      className="w-10 h-10 rounded-full bg-gray-600 hover:bg-gray-700 text-white flex items-center justify-center transition-colors"
                      aria-label="Share via Email"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Related articles */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Articole similare</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {RELATED_ARTICLES.map((article) => (
                  <Link
                    key={article.id}
                    href={`/blog/${article.slug}`}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all group"
                  >
                    {/* Thumbnail */}
                    <div className="h-40 bg-gradient-to-br from-blue-500 to-blue-600 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white/80 text-4xl font-bold">
                          {article.category}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 ${
                          CATEGORY_COLORS[article.category]
                        }`}
                      >
                        {article.category}
                      </span>

                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(article.published_date).toLocaleDateString('ro-RO', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{article.read_time_minutes} min</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar - Table of Contents */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Cuprins
                </h3>

                <nav className="space-y-2">
                  {MOCK_ARTICLE.table_of_contents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block py-2 px-3 rounded-lg text-sm transition-all ${
                        activeSection === item.id
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Share button sticky */}
              <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 text-gray-700 mb-3">
                  <Share2 className="w-5 h-5" />
                  <span className="font-medium">Distribuie</span>
                </div>

                <div className="flex flex-col gap-2">
                  <a
                    href={shareLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </a>

                  <a
                    href={shareLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors text-sm font-medium"
                  >
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </a>

                  <a
                    href={shareLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
