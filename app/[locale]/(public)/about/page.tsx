'use client'

import { Users, Award, Globe, Lightbulb, Shield, Target, Heart, Zap, Mail, Phone } from 'lucide-react'
import Link from 'next/link'

// Team members data
const TEAM_MEMBERS = [
  {
    id: '1',
    name: 'Daniel Popescu',
    role: 'Fondator & Consultant SSM Senior',
    bio: 'Cu peste 20 de ani de experiență în domeniul SSM/PSI, Daniel a transformat provocările consultanței tradiționale într-o platformă digitală modernă. Expert autorizat în securitatea muncii și prevenirea incendiilor.',
    imageUrl: '',
  },
  {
    id: '2',
    name: 'Maria Ionescu',
    role: 'Expert GDPR & Compliance',
    bio: 'Specialist în protecția datelor cu certificare GDPR. Asigură conformitatea platformei cu reglementările europene și implementează cele mai bune practici de securitate a informațiilor.',
    imageUrl: '',
  },
  {
    id: '3',
    name: 'Ana Dumitrescu',
    role: 'Product Manager',
    bio: 'Coordonează dezvoltarea platformei și asigură că fiecare funcționalitate răspunde nevoilor reale ale consultanților și companiilor. Background în software engineering și management de produs.',
    imageUrl: '',
  },
]

// Company values
const VALUES = [
  {
    icon: Shield,
    title: 'Securitate & Conformitate',
    description: 'Prioritizăm protecția datelor și conformitatea cu toate reglementările în vigoare. Fiecare funcționalitate este construită cu securitatea în minte.',
  },
  {
    icon: Lightbulb,
    title: 'Inovație Continuă',
    description: 'Digitalizăm procesele tradiționale SSM/PSI și aducem tehnologie modernă într-un domeniu care o merită. Evoluăm constant.',
  },
  {
    icon: Heart,
    title: 'Centrat pe Client',
    description: 'Ascultăm nevoile consultanților și companiilor. Fiecare feature este gândit pentru a rezolva probleme reale și a simplifica munca zilnică.',
  },
  {
    icon: Target,
    title: 'Eficiență & Precizie',
    description: 'Automatizăm taskuri repetitive și eliminăm erorile umane. Timpul tău este prețios și trebuie folosit strategic, nu administrativ.',
  },
]

// Stats data
const STATS = [
  { number: '100+', label: 'Clienți Activi', description: 'Consultanți și companii' },
  { number: '5', label: 'Țări', description: 'România, Bulgaria, Ungaria, Germania' },
  { number: '107', label: 'Funcționalități', description: 'Module integrate' },
  { number: '20+', label: 'Ani Experiență', description: 'În domeniul SSM/PSI' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-6 bg-white/20 backdrop-blur-sm border border-white/30">
            Despre s-s-m.ro
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight">
            Digitalizăm conformitatea
            <br />
            <span className="text-blue-200">SSM & PSI</span>
          </h1>
          <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Transformăm 20+ ani de experiență în consultanță SSM/PSI într-o platformă modernă
            care ajută consultanții și companiile să fie eficiente, conforme și organizate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/login"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-2xl text-lg font-bold transition shadow-lg hover:shadow-xl"
            >
              Începe Trial Gratuit
            </Link>
            <a
              href="#contact"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-2xl text-lg font-bold border-2 border-white/30 transition"
            >
              Contactează-ne
            </a>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Povestea Noastră
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>s-s-m.ro</strong> s-a născut din frustrarea zilnică a unui consultant SSM/PSI care
              gestiona peste 100 de firme client folosind foi Excel, documente Word și dosare fizice.
              Scadențele ratate, documentele pierdute și timpul irosit cu task-uri administrative
              repetitive ne-au determinat să căutăm o soluție mai bună.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              După <strong>20+ ani de experiență</strong> în consultanță SSM și PSI, am înțeles exact
              ce au nevoie consultanții și companiile: un sistem simplu, intuitiv și complet care
              automatizează partea administrativă și permite focusarea pe ceea ce contează cu adevărat
              — prevenirea riscurilor și asigurarea unui mediu de lucru sigur.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              În <strong>2024</strong> am lansat prima versiune a platformei, iar răspunsul a fost
              copleșitor. Consultanți din România, Bulgaria, Ungaria și Germania au adoptat rapid
              platforma, economisind ore întregi în fiecare săptămână și eliminând aproape complet
              erorile de compliance.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Astăzi, <strong>s-s-m.ro</strong> este mai mult decât o platformă — este partenerul
              de încredere pentru sute de profesioniști SSM/PSI care vor să lucreze mai inteligent,
              nu mai mult. Continuăm să inovăm și să adăugăm funcționalități noi bazate pe feedback-ul
              real al utilizatorilor noștri.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Platforma în Cifre
            </h2>
            <p className="text-lg text-gray-600">
              Rezultate concrete care demonstrează impactul nostru
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {STATS.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 sm:p-8 text-center shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl sm:text-5xl font-black text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-500">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Echipa Noastră
            </h2>
            <p className="text-lg text-gray-600">
              Oamenii care fac posibilă această platformă
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.id}
                className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
              >
                {/* Photo placeholder */}
                <div className="h-64 bg-gradient-to-br from-blue-500 to-blue-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="w-24 h-24 text-white/60" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <div className="text-sm font-medium text-blue-600 mb-3">
                    {member.role}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Valorile Noastre
            </h2>
            <p className="text-lg text-gray-600">
              Principiile care ne ghidează în tot ceea ce facem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {VALUES.map((value, index) => {
              const Icon = value.icon
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Contact Section */}
      <section id="contact" className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 sm:p-12 text-center shadow-xl">
            <Zap className="w-16 h-16 text-white mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Hai să Discutăm!
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Fie că ești consultant SSM/PSI cu zeci de clienți sau o companie care caută
              o soluție de digitalizare, suntem aici să te ajutăm. Contactează-ne și
              descoperă cum putem colabora.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
              {/* Email */}
              <Link
                href="mailto:contact@s-s-m.ro"
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 rounded-xl p-6 transition-all group"
              >
                <Mail className="w-8 h-8 text-white mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-white font-medium mb-1">Email</div>
                <div className="text-blue-100 text-sm">contact@s-s-m.ro</div>
              </Link>

              {/* Telefon */}
              <Link
                href="tel:+40720123456"
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 rounded-xl p-6 transition-all group"
              >
                <Phone className="w-8 h-8 text-white mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-white font-medium mb-1">Telefon</div>
                <div className="text-blue-100 text-sm">+40 720 123 456</div>
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/login"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-2xl text-lg font-bold transition shadow-lg hover:shadow-xl"
              >
                Încearcă Gratuit 14 Zile
              </Link>
              <Link
                href="/faq"
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-2xl text-lg font-bold border-2 border-white/30 transition"
              >
                Vezi FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
