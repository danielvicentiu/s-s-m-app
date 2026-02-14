import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Clock, TrendingDown, Users, FileText, Bell, Shield } from 'lucide-react';

// Mock data - în producție, acest lucru ar veni dintr-o bază de date sau CMS
const caseStudies: Record<string, CaseStudy> = {
  'metarom-engineering': {
    slug: 'metarom-engineering',
    companyName: 'MetaRom Engineering SRL',
    industry: 'Construcții și Infrastructură',
    logo: '/case-studies/metarom-logo.png',
    heroImage: '/case-studies/metarom-hero.jpg',
    challenge: {
      title: 'Provocarea',
      description: 'MetaRom Engineering, o firmă de construcții cu 150+ angajați pe 5 șantiere, se confrunta cu gestionarea manuală a documentației SSM. Amenzi repetate de la ITM, întârzieri în programările medicale și lipsa vizibilității în timp real asupra conformității.',
      problems: [
        'Amenzi ITM de peste 50.000 RON în ultimul an',
        'Documente SSM dispersate în Excel și dosare fizice',
        'Imposibilitatea de a urmări expirarea certificatelor medical',
        'Comunicare ineficientă între șantiere și birou',
        'Timpi morți în pregătirea documentației pentru inspecții'
      ]
    },
    solution: {
      title: 'Soluția',
      description: 'Implementarea platformei s-s-m.ro a digitizat complet procesele de compliance SSM/PSI, oferind vizibilitate în timp real și automatizări inteligente.',
      features: [
        {
          icon: 'FileText',
          title: 'Gestionare Documente Digitale',
          description: 'Toate fișele de aptitudine, instructajele și certificatele stocate centralizat, cu acces instant pentru inspectorii ITM'
        },
        {
          icon: 'Bell',
          title: 'Alerte Automate',
          description: 'Notificări proactive cu 30 de zile înainte de expirarea certificatelor medicale și a instructajelor SSM'
        },
        {
          icon: 'Users',
          title: 'Portal Angajați',
          description: 'Fiecare angajat poate accesa propriile documente și completa formularele necesare online'
        },
        {
          icon: 'Shield',
          title: 'Conformitate GDPR',
          description: 'Sistem complet conform cu GDPR pentru datele medicale și personale ale angajaților'
        }
      ]
    },
    results: {
      title: 'Rezultatele',
      description: 'După 6 luni de utilizare a platformei s-s-m.ro, MetaRom Engineering a înregistrat îmbunătățiri semnificative în toate aspectele compliance-ului SSM.',
      metrics: [
        {
          value: '90%',
          label: 'Reducere amenzi',
          description: 'De la 50.000 RON/an la sub 5.000 RON'
        },
        {
          value: '20h',
          label: 'Timp economisit/lună',
          description: 'Automatizarea proceselor administrative'
        },
        {
          value: '100%',
          label: 'Conformitate documente',
          description: 'Zero documente expirate sau lipsă'
        },
        {
          value: '48h',
          label: 'Timp răspuns ITM',
          description: 'De la 5+ zile la sub 48 ore'
        }
      ]
    },
    testimonial: {
      quote: 'Platforma s-s-m.ro a transformat complet modul în care gestionăm compliance-ul SSM. Am eliminat practic amenzile, iar timpul economisit ne permite să ne concentrăm pe proiecte, nu pe hârtii. Recomand cu încredere!',
      author: 'Ing. Alexandru Popescu',
      role: 'Director Operațional, MetaRom Engineering',
      avatar: '/case-studies/alexandru-popescu.jpg'
    },
    publishedAt: '2026-01-15'
  }
};

interface CaseStudy {
  slug: string;
  companyName: string;
  industry: string;
  logo: string;
  heroImage: string;
  challenge: {
    title: string;
    description: string;
    problems: string[];
  };
  solution: {
    title: string;
    description: string;
    features: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  results: {
    title: string;
    description: string;
    metrics: Array<{
      value: string;
      label: string;
      description: string;
    }>;
  };
  testimonial: {
    quote: string;
    author: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
}

const iconMap = {
  FileText,
  Bell,
  Users,
  Shield
};

export async function generateMetadata({
  params
}: {
  params: { slug: string; locale: string }
}): Promise<Metadata> {
  const caseStudy = caseStudies[params.slug];

  if (!caseStudy) {
    return {
      title: 'Studiu de Caz',
    };
  }

  return {
    title: `${caseStudy.companyName} - Studiu de Caz | s-s-m.ro`,
    description: caseStudy.challenge.description,
  };
}

export default function CaseStudyDetailPage({
  params
}: {
  params: { slug: string; locale: string }
}) {
  const caseStudy = caseStudies[params.slug];

  if (!caseStudy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Studiu de caz nu a fost găsit
          </h1>
          <Link
            href="/case-studies"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Înapoi la studii de caz
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/case-studies"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Înapoi la studii de caz
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6">
                {caseStudy.industry}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {caseStudy.companyName}
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Cum am redus amenzile cu 90% și am economisit 20h/lună prin digitizarea completă a proceselor SSM
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center">
                  <TrendingDown className="w-5 h-5 mr-2" />
                  <span className="font-semibold">90% reducere amenzi</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="font-semibold">20h economisit/lună</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <div className="text-center">
                  <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-sm text-blue-100">Hero Image</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {caseStudy.challenge.title}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {caseStudy.challenge.description}
            </p>
            <div className="bg-red-50 rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Probleme identificate:
              </h3>
              <ul className="space-y-3">
                {caseStudy.challenge.problems.map((problem, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{problem}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {caseStudy.solution.title}
            </h2>
            <p className="text-xl text-gray-600">
              {caseStudy.solution.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {caseStudy.solution.features.map((feature, index) => {
              const Icon = iconMap[feature.icon as keyof typeof iconMap];
              return (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {caseStudy.results.title}
            </h2>
            <p className="text-xl text-gray-600">
              {caseStudy.results.description}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {caseStudy.results.metrics.map((metric, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                  {metric.value}
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-2">
                  {metric.label}
                </div>
                <div className="text-sm text-gray-600">
                  {metric.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-12 md:p-16 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>

            <div className="relative">
              <svg
                className="w-12 h-12 text-white/20 mb-6"
                fill="currentColor"
                viewBox="0 0 32 32"
              >
                <path d="M10 8c-3.314 0-6 2.686-6 6s2.686 6 6 6c1.657 0 3.157-.672 4.243-1.757L12 24h6l2-6c0-3.314-2.686-6-6-6H10zm12 0c-3.314 0-6 2.686-6 6s2.686 6 6 6c1.657 0 3.157-.672 4.243-1.757L24 24h6l2-6c0-3.314-2.686-6-6-6h-4z" />
              </svg>

              <blockquote className="text-xl md:text-2xl font-medium mb-8">
                {caseStudy.testimonial.quote}
              </blockquote>

              <div className="flex items-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <div className="font-bold text-lg">
                    {caseStudy.testimonial.author}
                  </div>
                  <div className="text-blue-100">
                    {caseStudy.testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pregătit să transformi și tu compliance-ul SSM?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Încearcă gratuit platforma s-s-m.ro pentru 30 de zile. Fără card necesar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Încearcă gratuit 30 de zile
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Programează demo
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Fără card necesar
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Anulare oricând
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
