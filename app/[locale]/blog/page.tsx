// app/[locale]/blog/page.tsx
// Blog page cu articole SSM/PSI - Grid 3 coloane + filtrare pe categorii

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, User, Tag } from 'lucide-react'

type Category = 'Toate' | 'SSM' | 'PSI' | 'Legal' | 'Tips'

interface BlogArticle {
  id: string
  title: string
  excerpt: string
  date: string
  author: string
  category: Exclude<Category, 'Toate'>
  imageUrl: string
  slug: string
}

const articles: BlogArticle[] = [
  {
    id: '1',
    title: 'Noutăți legislative SSM 2026: Ce trebuie să știe fiecare angajator',
    excerpt: 'Actualizări importante privind obligațiile SSM pentru angajatori în 2026. Modificări legislative, termene și proceduri noi de implementat.',
    date: '2026-02-10',
    author: 'Daniel Consultant SSM',
    category: 'Legal',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=500&fit=crop',
    slug: 'noutati-legislative-ssm-2026'
  },
  {
    id: '2',
    title: 'Instructajul periodic SSM: Ghid complet pentru managerii de resurse umane',
    excerpt: 'Tot ce trebuie să știi despre instructajul periodic: frecvență, conținut, documentare și cele mai comune greșeli de evitat.',
    date: '2026-02-08',
    author: 'Daniel Consultant SSM',
    category: 'SSM',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=500&fit=crop',
    slug: 'instructaj-periodic-ssm-ghid'
  },
  {
    id: '3',
    title: 'Verificarea anuală a instalațiilor PSI: Checklist pentru 2026',
    excerpt: 'Lista completă de verificări PSI obligatorii: stingătoare, hidranți, detectori de fum și iluminat de urgență. Termene și proceduri.',
    date: '2026-02-05',
    author: 'Daniel Consultant SSM',
    category: 'PSI',
    imageUrl: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&h=500&fit=crop',
    slug: 'verificare-anuala-instalatii-psi'
  },
  {
    id: '4',
    title: '5 greșeli frecvente în evaluarea riscurilor de securitate și sănătate',
    excerpt: 'Analizăm cele mai comune erori întâlnite în procesul de evaluare a riscurilor SSM și cum pot fi evitate pentru conformitate maximă.',
    date: '2026-02-03',
    author: 'Daniel Consultant SSM',
    category: 'Tips',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop',
    slug: 'greseli-evaluare-riscuri-ssm'
  },
  {
    id: '5',
    title: 'Medicina muncii în 2026: Actualizări privind examenele medicale periodice',
    excerpt: 'Modificări recente privind examenele medicale la angajare și periodice. Factori de risc, periodicitate și documentație obligatorie.',
    date: '2026-01-30',
    author: 'Daniel Consultant SSM',
    category: 'SSM',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop',
    slug: 'medicina-muncii-examene-medicale-2026'
  },
  {
    id: '6',
    title: 'Planul de evacuare PSI: Cum să pregătești firma pentru situații de urgență',
    excerpt: 'Ghid practic pentru elaborarea și implementarea unui plan de evacuare eficient. Semnalizare, trasee, puncte de adunare și exerciții.',
    date: '2026-01-28',
    author: 'Daniel Consultant SSM',
    category: 'PSI',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
    slug: 'plan-evacuare-psi-situatii-urgenta'
  }
]

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Toate')

  // Filtrare articole
  const filteredArticles = selectedCategory === 'Toate'
    ? articles
    : articles.filter(article => article.category === selectedCategory)

  // Contorizare pe categorii
  const categoryCounts = {
    Toate: articles.length,
    SSM: articles.filter(a => a.category === 'SSM').length,
    PSI: articles.filter(a => a.category === 'PSI').length,
    Legal: articles.filter(a => a.category === 'Legal').length,
    Tips: articles.filter(a => a.category === 'Tips').length
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 px-8 py-6 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">Blog SSM & PSI</h1>
            <Link
              href="/dashboard"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
            >
              ← Înapoi la Dashboard
            </Link>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Articole, ghiduri și actualizări legislative pentru consultanți SSM și manageri de resurse umane
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">

        {/* Filtre categorii */}
        <div className="mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filtrează:</span>
            {(['Toate', 'SSM', 'PSI', 'Legal', 'Tips'] as Category[]).map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {category} ({categoryCounts[category]})
              </button>
            ))}
          </div>
        </div>

        {/* Grid articole */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <article
                key={article.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Imagine */}
                <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {/* Badge categorie */}
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      article.category === 'SSM' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' :
                      article.category === 'PSI' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
                      article.category === 'Legal' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' :
                      'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                    }`}>
                      <Tag className="w-3 h-3" />
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Conținut */}
                <div className="p-5">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <Link href={`/blog/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h2>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Meta info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(article.date).toLocaleDateString('ro-RO', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      <span>{article.author}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/blog/${article.slug}`}
                    className="mt-4 block text-center bg-gray-50 dark:bg-gray-900 hover:bg-blue-600 dark:hover:bg-blue-600 text-gray-700 dark:text-gray-300 hover:text-white py-2 rounded-lg text-sm font-semibold transition-all"
                  >
                    Citește articolul →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 py-16 text-center">
            <p className="text-gray-400 dark:text-gray-500 text-lg">
              Nu există articole în categoria <span className="font-bold">{selectedCategory}</span>
            </p>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Primești actualizări SSM & PSI direct în inbox</h3>
          <p className="text-blue-100 mb-6">
            Abonează-te la newsletter-ul nostru și fii la curent cu toate schimbările legislative
          </p>
          <div className="flex items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="adresa@email.ro"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-0 focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition">
              Abonează-te
            </button>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-8 text-center text-sm text-gray-500 dark:text-gray-400">
          © 2026 s-s-m.ro — Platformă digitală SSM & PSI · Toate drepturile rezervate
        </div>
      </footer>

    </div>
  )
}
