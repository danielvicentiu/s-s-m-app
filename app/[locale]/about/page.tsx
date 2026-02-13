import { Metadata } from 'next';
import {
  Shield,
  Zap,
  Users,
  Globe,
  FileCheck,
  TrendingUp,
  Building2,
  MapPin,
  Briefcase,
  Award
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Despre Noi | S-S-M.ro',
  description: 'Platforma digitală pentru consultanți SSM și firme - digitalizăm compliance-ul SSM/PSI în România, Bulgaria, Ungaria, Germania',
};

export default function AboutPage() {
  const differentiators = [
    {
      icon: Shield,
      title: 'Experiență Vastă',
      description: '20+ ani de experiență în consultanță SSM/PSI, cu peste 100 de clienți activi și expertiza necesară pentru orice domeniu de activitate.',
      color: 'blue',
    },
    {
      icon: Zap,
      title: 'Automatizare Inteligentă',
      description: 'Platformă digitală care automatizează taskuri repetitive, generează documente și alertează proactiv despre scadențe și obligații legale.',
      color: 'green',
    },
    {
      icon: Globe,
      title: 'Multilingv & Internațional',
      description: 'Suport complet în 5 limbi (RO, BG, EN, HU, DE), adaptat la legislația specifică din fiecare țară pentru conformitate garantată.',
      color: 'purple',
    },
    {
      icon: FileCheck,
      title: 'Conformitate Garantată',
      description: 'Sistem de alertare și documentare care asigură respectarea tuturor cerințelor legale SSM/PSI, eliminând riscul de neconformitate.',
      color: 'orange',
    },
    {
      icon: Users,
      title: 'Colaborare Simplificată',
      description: 'Interfață intuitivă pentru consultanți și firme, cu management centralizat al angajaților, echipamentelor, instruirilor și documentelor.',
      color: 'red',
    },
  ];

  const team = [
    {
      name: 'Daniel Stoica',
      role: 'Fondator & Consultant SSM',
      initials: 'DS',
      description: '20+ ani experiență în consultanță SSM/PSI, 100+ clienți activi, expert în legislație România, Bulgaria, Ungaria, Germania.',
      color: 'blue',
    },
    {
      name: 'Maria Popescu',
      role: 'Consultant SSM Senior',
      initials: 'MP',
      description: '15+ ani experiență în domeniul PSI și securitate la incendiu, specialist certificat în evaluarea riscurilor și conformitate.',
      color: 'green',
    },
    {
      name: 'Andrei Ionescu',
      role: 'Arhitect Software',
      initials: 'AI',
      description: '10+ ani experiență în dezvoltare software enterprise, specialist în cloud infrastructure și aplicații multilingve.',
      color: 'purple',
    },
  ];

  const stats = [
    {
      icon: Building2,
      value: '850K+',
      label: 'Firme în țările acoperite',
      color: 'blue',
    },
    {
      icon: MapPin,
      value: '5',
      label: 'Țări acoperite (RO, BG, HU, DE, EN)',
      color: 'green',
    },
    {
      icon: Briefcase,
      value: '8',
      label: 'Domenii de activitate SSM/PSI',
      color: 'purple',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Mission */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/30 backdrop-blur-sm text-white text-sm font-semibold mb-6">
              <Award className="w-4 h-4" />
              20+ Ani Experiență SSM/PSI
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Digitalizăm Compliance-ul SSM/PSI
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-8 leading-relaxed">
              Transformăm munca consultanților SSM și a firmelor prin tehnologie modernă,
              automatizare inteligentă și conformitate simplificată.
            </p>
            <p className="text-lg text-blue-200">
              O platformă unică care conectează consultanți cu experiență de 20+ ani
              cu firmele care au nevoie de soluții SSM/PSI profesionale și digitale.
            </p>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              const colorClasses = {
                blue: 'bg-blue-100 text-blue-600',
                green: 'bg-green-100 text-green-600',
                purple: 'bg-purple-100 text-purple-600',
              };
              return (
                <div key={idx} className="p-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${colorClasses[stat.color as keyof typeof colorClasses]} rounded-2xl mb-4`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              De Ce Suntem Diferiți
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cinci piloni care ne diferențiază în piața consultanței SSM/PSI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {differentiators.map((item, idx) => {
              const Icon = item.icon;
              const colorClasses = {
                blue: 'bg-blue-100 text-blue-600',
                green: 'bg-green-100 text-green-600',
                purple: 'bg-purple-100 text-purple-600',
                orange: 'bg-orange-100 text-orange-600',
                red: 'bg-red-100 text-red-600',
              };
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 ${colorClasses[item.color as keyof typeof colorClasses]} rounded-xl mb-6`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Echipa Noastră
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experți în SSM/PSI și tehnologie, dedicați să vă aducă cea mai bună soluție digitală
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, idx) => {
              const gradientClasses = {
                blue: 'from-blue-500 to-blue-600',
                green: 'from-green-500 to-green-600',
                purple: 'from-purple-500 to-purple-600',
              };
              const textColorClasses = {
                blue: 'text-blue-600',
                green: 'text-green-600',
                purple: 'text-purple-600',
              };
              return (
                <div key={idx} className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-200">
                  <div className={`w-24 h-24 bg-gradient-to-br ${gradientClasses[member.color as keyof typeof gradientClasses]} rounded-full mx-auto mb-6 flex items-center justify-center`}>
                    <span className="text-3xl font-bold text-white">{member.initials}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className={`${textColorClasses[member.color as keyof typeof textColorClasses]} font-medium mb-3`}>{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Gata să Digitalizați Conformitatea SSM/PSI?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Alăturați-vă platformei care transformă modul în care consultanții
            și firmele gestionează securitatea și sănătatea în muncă.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
          >
            Accesează Platforma
          </Link>
        </div>
      </section>
    </div>
  );
}
