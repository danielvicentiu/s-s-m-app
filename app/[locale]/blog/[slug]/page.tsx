import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Calendar,
  Clock,
  User,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

// Mock data - replace with actual data fetching from Supabase
interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedAt: string;
  readTime: string;
  category: string;
  image: string;
}

interface RecentPost {
  slug: string;
  title: string;
  image: string;
  publishedAt: string;
  category: string;
}

const mockRecentPosts: RecentPost[] = [
  {
    slug: 'legislatie-ssm-2024',
    title: 'Noutăți legislative SSM în 2024',
    image: '/images/blog/placeholder.jpg',
    publishedAt: '2024-01-15',
    category: 'Legislație'
  },
  {
    slug: 'evaluare-riscuri-ghid',
    title: 'Ghid complet evaluare riscuri',
    image: '/images/blog/placeholder.jpg',
    publishedAt: '2024-01-10',
    category: 'Ghiduri'
  },
  {
    slug: 'instruire-periodica-angajati',
    title: 'Instruirea periodică a angajaților',
    image: '/images/blog/placeholder.jpg',
    publishedAt: '2024-01-05',
    category: 'Training'
  }
];

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  // TODO: Replace with actual Supabase query
  // const supabase = createSupabaseServer();
  // const { data, error } = await supabase
  //   .from('blog_posts')
  //   .select('*')
  //   .eq('slug', slug)
  //   .single();

  // Mock data for now
  const mockPost: BlogPost = {
    slug,
    title: 'Ghid complet pentru implementarea sistemului de management al securității și sănătății în muncă',
    excerpt: 'Aflați tot ce trebuie să știți despre implementarea unui sistem eficient de management SSM în compania dumneavoastră.',
    content: `
## Introducere

Securitatea și sănătatea în muncă (SSM) reprezintă o prioritate esențială pentru orice organizație responsabilă. Implementarea unui sistem eficient de management SSM nu doar că protejează angajații, dar aduce și beneficii semnificative pentru afacere.

## De ce este important un sistem SSM?

Un sistem de management al securității și sănătății în muncă bine implementat oferă multiple avantaje:

- **Reducerea accidentelor de muncă** cu până la 60%
- **Creșterea productivității** prin îmbunătățirea condițiilor de lucru
- **Conformitate legislativă** completă
- **Reducerea costurilor** asociate cu accidentele și bolile profesionale

## Pașii implementării

### 1. Evaluarea inițială

Prima etapă în implementarea unui sistem SSM este evaluarea situației actuale. Aceasta include:

- Identificarea tuturor riscurilor existente la locul de muncă
- Analiza incidentelor și accidentelor anterioare
- Evaluarea conformității cu legislația în vigoare
- Consultarea angajaților despre preocupările lor

### 2. Planificarea

După evaluarea inițială, este esențial să dezvoltați un plan detaliat care să includă:

- Obiective clare și măsurabile
- Responsabilități bine definite
- Timeline realist de implementare
- Buget alocat

### 3. Implementarea măsurilor

Această fază implică punerea în practică a planului dezvoltat:

- Instruirea angajaților și a conducerii
- Achiziționarea echipamentelor de protecție necesare
- Modificarea proceselor de lucru unde este necesar
- Implementarea procedurilor de urgență

### 4. Monitorizare și îmbunătățire continuă

Un sistem SSM eficient necesită monitorizare constantă și ajustări:

- Audituri periodice de siguranță
- Analiza indicatorilor de performanță
- Actualizarea procedurilor în funcție de feedback
- Training continuu pentru angajați

## Legislație aplicabilă

În România, cadrul legislativ pentru SSM este complet și include:

- Legea 319/2006 privind securitatea și sănătatea în muncă
- HG 1425/2006 pentru aplicarea Legii 319/2006
- Norme specifice pe domenii de activitate

## Instrumente digitale

Platforme moderne precum **s-s-m.ro** facilitează gestionarea tuturor aspectelor legate de SSM:

- Evidența instruirilor
- Gestionarea documentelor
- Alerte automate pentru scadențe
- Rapoarte și analize

## Concluzie

Implementarea unui sistem eficient de management SSM este o investiție în siguranța angajaților și în succesul pe termen lung al organizației. Cu planificare adecvată și instrumentele potrivite, procesul devine mult mai simplu și mai eficient.

---

**Aveți nevoie de suport în implementarea sistemului SSM?** Echipa noastră de consultanți cu experiență vă poate ghida în fiecare pas al procesului.
    `,
    author: {
      name: 'Daniel Popescu',
      avatar: '/images/avatars/daniel.jpg',
      role: 'Consultant SSM Senior'
    },
    publishedAt: '2024-02-13',
    readTime: '8 min',
    category: 'Ghiduri',
    image: '/images/blog/ssm-implementation.jpg'
  };

  return mockPost;
}

export async function generateMetadata({
  params
}: {
  params: { slug: string; locale: string }
}): Promise<Metadata> {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return {
      title: 'Articol inexistent'
    };
  }

  return {
    title: `${post.title} | Blog SSM`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image]
    }
  };
}

export default async function BlogArticlePage({
  params
}: {
  params: { slug: string; locale: string }
}) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const shareUrl = `https://app.s-s-m.ro/${params.locale}/blog/${post.slug}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <Link href={`/${params.locale}`} className="hover:text-blue-600">
              Acasă
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/${params.locale}/blog`} className="hover:text-blue-600">
              Blog
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">{post.category}</span>
          </nav>

          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('ro-RO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{post.readTime} citire</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Article Content */}
          <div className="lg:col-span-2">
            {/* Author Info */}
            <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                  {/* Avatar placeholder */}
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-600">
                    {post.author.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{post.author.role}</p>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-8 bg-gray-200">
              {/* Image placeholder */}
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-sm">Imagine articol</span>
              </div>
            </div>

            {/* Article Body */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8">
              <div className="prose prose-lg max-w-none">
                {/* Render markdown-style content */}
                {post.content.split('\n').map((line, index) => {
                  // Headers
                  if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4">{line.substring(3)}</h2>;
                  }
                  if (line.startsWith('### ')) {
                    return <h3 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-3">{line.substring(4)}</h3>;
                  }
                  // Bold
                  if (line.includes('**')) {
                    const parts = line.split('**');
                    return (
                      <p key={index} className="text-gray-700 leading-relaxed mb-4">
                        {parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
                      </p>
                    );
                  }
                  // List items
                  if (line.startsWith('- ')) {
                    return (
                      <li key={index} className="text-gray-700 leading-relaxed ml-6 mb-2">
                        {line.substring(2)}
                      </li>
                    );
                  }
                  // Horizontal rule
                  if (line === '---') {
                    return <hr key={index} className="my-8 border-gray-200" />;
                  }
                  // Empty lines
                  if (line.trim() === '') {
                    return null;
                  }
                  // Normal paragraphs
                  return <p key={index} className="text-gray-700 leading-relaxed mb-4">{line}</p>;
                })}
              </div>
            </div>

            {/* Share Buttons */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700">
                  <Share2 className="w-5 h-5" />
                  <span className="font-semibold">Distribuie articolul:</span>
                </div>
                <div className="flex gap-3">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors"
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-3">
                Gestionează SSM mai eficient cu platforma noastră
              </h2>
              <p className="text-blue-100 mb-6">
                Automatizează toate procesele SSM și fii mereu în conformitate cu legislația.
                Începe gratuit astăzi!
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/${params.locale}/dashboard`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
                >
                  Încearcă gratuit
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href={`/${params.locale}/contact`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-400 transition-colors border border-blue-400"
                >
                  Contactează-ne
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Recent Posts */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Articole recente
                </h3>
                <div className="space-y-4">
                  {mockRecentPosts.map((recentPost) => (
                    <Link
                      key={recentPost.slug}
                      href={`/${params.locale}/blog/${recentPost.slug}`}
                      className="block group"
                    >
                      <div className="flex gap-3">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                          {/* Image placeholder */}
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                            IMG
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-blue-600 font-medium">
                            {recentPost.category}
                          </span>
                          <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm mt-1">
                            {recentPost.title}
                          </h4>
                          <time className="text-xs text-gray-500 mt-1 block">
                            {new Date(recentPost.publishedAt).toLocaleDateString('ro-RO')}
                          </time>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/${params.locale}/blog`}
                  className="mt-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  Vezi toate articolele
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Categorii
                </h3>
                <div className="space-y-2">
                  {['Legislație', 'Ghiduri', 'Training', 'Studii de caz', 'Noutăți'].map((category) => (
                    <Link
                      key={category}
                      href={`/${params.locale}/blog?category=${category.toLowerCase()}`}
                      className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
