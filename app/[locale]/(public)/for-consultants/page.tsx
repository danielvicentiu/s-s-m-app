import Link from 'next/link'
import {
  CheckCircle,
  Users,
  FileText,
  Bell,
  BarChart3,
  Shield,
  Clock,
  Building2,
  ArrowRight,
  Star,
  Zap
} from 'lucide-react'

export default function ForConsultantsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Platforma SSM Digitală pentru Consultanți Profesioniști
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Gestionează toți clienții tăi dintr-o singură platformă.
              Generează documente, monitorizează compliance-ul și automatizează procesele.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
              >
                Începe Gratuit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="#pricing"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors border-2 border-blue-500"
              >
                Vezi Prețuri
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* De ce să folosești platforma */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              De ce să folosești platforma s-s-m.ro?
            </h2>
            <p className="text-xl text-gray-600">
              Digitizează-ți activitatea de consultanță SSM și economisește zeci de ore pe lună
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Dashboard Clienți */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Building2 className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Dashboard Centralizat Clienți</h3>
              <p className="text-gray-600 mb-6">
                Gestionează toate organizațiile clienților tăi dintr-un singur loc.
                Comută rapid între clienți și vezi statusul fiecăruia în timp real.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Vizualizare multi-organizație</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Statistici agregate pentru toți clienții</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Acces rapid la date critice</span>
                </li>
              </ul>
            </div>

            {/* Generare Documente */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <FileText className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Generare Automată Documente</h3>
              <p className="text-gray-600 mb-6">
                Creează automat fișe de aptitudine, planuri de evacuare,
                rapoarte SSM și alte documente obligatorii conform legislației.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Template-uri conforme legislație RO/BG/HU</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Export PDF cu branding personalizat</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Actualizare automată la schimbări legislative</span>
                </li>
              </ul>
            </div>

            {/* Alerte Automate */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <Bell className="h-7 w-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Alerte și Notificări Automate</h3>
              <p className="text-gray-600 mb-6">
                Primește notificări automate pentru expirări, termene și obligații.
                Nu mai pierde nicio scadență importantă.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Alerte pentru avize medicale expirate</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Notificări instructaje periodice</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Reminder-uri verificări echipamente PSI</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Beneficii Adiționale */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Rapoarte și Analiză</h3>
              <p className="text-gray-600">
                Generează rapoarte detaliate pentru clienți. Vizualizează statistici
                și identifică zone cu risc ridicat într-o clipă.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Conformitate Garantată</h3>
              <p className="text-gray-600">
                Platforma este actualizată conform celor mai recente acte normative
                SSM/PSI din România, Bulgaria și Ungaria.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center mb-6">
                <Clock className="h-7 w-7 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Economisește Timp</h3>
              <p className="text-gray-600">
                Automatizează task-urile repetitive și concentrează-te pe consultanță de calitate.
                Economisește până la 20h/lună.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pricing Transparent pentru Consultanți
            </h2>
            <p className="text-xl text-gray-600">
              Tarife speciale pentru consultanți care gestionează multiple organizații
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Starter</h3>
                <p className="text-gray-600 mb-4">Ideal pentru început</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold">€49</span>
                  <span className="text-gray-600">/lună</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Până la 5 organizații clienți</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">100 angajați per organizație</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Generare documente SSM/PSI</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Alerte automate email</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Suport email</span>
                </li>
              </ul>
              <Link
                href="/auth/register"
                className="block w-full text-center px-6 py-3 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Începe Gratuit
              </Link>
            </div>

            {/* Professional - POPULAR */}
            <div className="bg-white rounded-2xl p-8 border-2 border-blue-600 relative shadow-lg scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  CEL MAI POPULAR
                </span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Professional</h3>
                <p className="text-gray-600 mb-4">Pentru consultanți activi</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold">€99</span>
                  <span className="text-gray-600">/lună</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Până la 15 organizații</strong> clienți</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">250 angajați per organizație</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Toate funcționalitățile Starter</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Rapoarte avansate</strong> și dashboard-uri</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Branding personalizat</strong> pe documente</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Suport prioritar</span>
                </li>
              </ul>
              <Link
                href="/auth/register"
                className="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Începe Gratuit
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                <p className="text-gray-600 mb-4">Pentru firme mari</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold">€249</span>
                  <span className="text-gray-600">/lună</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Organizații nelimitate</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Angajați nelimitați</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Toate funcționalitățile Professional</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>API access</strong> și integrări custom</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Account manager dedicat</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">SLA 99.9% uptime</span>
                </li>
              </ul>
              <Link
                href="/auth/register"
                className="block w-full text-center px-6 py-3 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Contactează-ne
              </Link>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600">
              Toate planurile includ perioadă de probă gratuită de 14 zile.
              Fără card necesar. Anulare oricând.
            </p>
          </div>
        </div>
      </section>

      {/* Testimoniale */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ce spun consultanții SSM despre platformă
            </h2>
            <p className="text-xl text-gray-600">
              Peste 150 de consultanți SSM/PSI folosesc deja platforma
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Am trecut de la Excel și Word la s-s-m.ro și am economisit peste 15 ore pe lună.
                Generarea automată de documente și alertele m-au salvat de multe ori."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  MP
                </div>
                <div>
                  <div className="font-semibold">Maria Popescu</div>
                  <div className="text-sm text-gray-600">Consultant SSM, 12 clienți</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Platformă excelentă pentru multi-country. Am clienți în România și Bulgaria,
                iar sistemul gestionează legislația din ambele țări impecabil."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  AI
                </div>
                <div>
                  <div className="font-semibold">Andrei Ionescu</div>
                  <div className="text-sm text-gray-600">Consultant SSM/PSI, 25 clienți</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Dashboard-ul centralizat e fantastic. Pot vedea statusul tuturor clienților mei
                dintr-o privire. Rapoartele automate impresionează clienții."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  ER
                </div>
                <div>
                  <div className="font-semibold">Elena Radu</div>
                  <div className="text-sm text-gray-600">Consultant SSM, 8 clienți</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Gata să digitizezi activitatea de consultanță SSM?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Alătură-te celor 150+ consultanți care economisesc timp și oferă servicii de calitate superioară
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors text-lg"
              >
                Începe Gratuit - 14 Zile Trial
                <ArrowRight className="ml-2 h-6 w-6" />
              </Link>
            </div>
            <p className="mt-6 text-blue-200 text-sm">
              Fără card necesar • Anulare oricând • Suport în limba română
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
