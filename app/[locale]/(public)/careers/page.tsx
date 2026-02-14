import Link from 'next/link';
import { Briefcase, Heart, Lightbulb, Users, Target, CheckCircle2, MapPin, Clock, Building2 } from 'lucide-react';

export default function CareersPage() {
  const companyValues = [
    {
      icon: Heart,
      title: 'Pasiune pentru siguranță',
      description: 'Credem că fiecare angajat merită să lucreze într-un mediu sigur și sănătos.'
    },
    {
      icon: Lightbulb,
      title: 'Inovație continuă',
      description: 'Dezvoltăm soluții digitale moderne pentru a simplifica conformitatea SSM/PSI.'
    },
    {
      icon: Users,
      title: 'Lucru în echipă',
      description: 'Colaborăm strâns pentru a oferi cele mai bune servicii clienților noștri.'
    },
    {
      icon: Target,
      title: 'Excelență profesională',
      description: 'Ne menținem standardele înalte și ne perfecționăm continuu abilitățile.'
    }
  ];

  const openPositions = [
    {
      id: 1,
      title: 'Full Stack Developer',
      department: 'Engineering',
      location: 'București / Remote',
      type: 'Full-time',
      description: 'Căutăm un dezvoltator experimentat în Next.js și TypeScript pentru a ne ajuta să construim următoarea generație a platformei SSM digitale.'
    },
    {
      id: 2,
      title: 'SSM Consultant',
      department: 'Consulting',
      location: 'București / Hybrid',
      type: 'Full-time',
      description: 'Consultant SSM/PSI cu experiență pentru a oferi servicii de consultanță firmelor partenere și a contribui la dezvoltarea platformei.'
    },
    {
      id: 3,
      title: 'Sales Manager',
      department: 'Sales',
      location: 'București',
      type: 'Full-time',
      description: 'Manager de vânzări dedicat pentru a dezvolta portofoliul de clienți și a promova serviciile noastre de consultanță SSM/PSI.'
    }
  ];

  const benefits = [
    'Program flexibil și opțiune work from home',
    'Asigurare medicală privată extinsă',
    'Buget anual pentru formare profesională',
    'Echipamente moderne de lucru (laptop, monitor)',
    'Team building-uri și evenimente sociale',
    'Bonusuri de performanță și prime anuale'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Briefcase className="w-5 h-5" />
            <span className="text-sm font-medium">Cariere la SSM.ro</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Alătură-te echipei noastre
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
            Construim împreună viitorul siguranței și sănătății în muncă prin tehnologie și expertиză
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#positions"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Vezi pozițiile deschise
            </a>
            <a
              href="#values"
              className="bg-blue-500/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/30 transition-colors border border-white/20"
            >
              Despre noi
            </a>
          </div>
        </div>
      </section>

      {/* Company Values Section */}
      <section id="values" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Valorile noastre
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Principiile care ne ghidează în tot ceea ce facem
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="positions" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Poziții deschise
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descoperă oportunități de carieră alături de noi
            </p>
          </div>
          <div className="space-y-6">
            {openPositions.map((position) => (
              <div
                key={position.id}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-blue-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {position.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {position.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Building2 className="w-4 h-4" />
                        <span>{position.department}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{position.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{position.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="lg:ml-6">
                    <Link
                      href={`/careers/${position.id}`}
                      className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                      Aplică acum
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits & Perks Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Beneficii și avantaje
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Investim în bunăstarea și dezvoltarea echipei noastre
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-gray-700 leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Nu ai găsit poziția potrivită?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Suntem mereu interesați să cunoaștem profesioniști talentați.
            Trimite-ne CV-ul tău și te vom contacta când va apărea o oportunitate potrivită.
          </p>
          <a
            href="mailto:careers@s-s-m.ro"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            Trimite aplicație spontană
          </a>
        </div>
      </section>
    </div>
  );
}
