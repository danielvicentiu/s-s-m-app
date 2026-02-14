'use client'

import { useState } from 'react'
import { Search, ChevronDown, ChevronUp, Mail, HelpCircle } from 'lucide-react'
import Link from 'next/link'

type FAQCategory = 'general' | 'preturi' | 'functionalitati' | 'securitate' | 'suport' | 'legal'

interface FAQItem {
  question: string
  answer: string
  category: FAQCategory
}

const FAQ_DATA: FAQItem[] = [
  // General
  {
    question: 'Ce este platforma S-S-M.ro?',
    answer: 'S-S-M.ro este o platformă digitală dedicată consultanților SSM/PSI și firmelor din România, Bulgaria, Ungaria și Germania. Oferim soluții complete pentru gestionarea conformității SSM (Securitatea și Sănătatea în Muncă) și PSI (Prevenirea și Stingerea Incendiilor), inclusiv evidență angajați, instruiri, controale medicale, echipamente și raportare.',
    category: 'general',
  },
  {
    question: 'Cine poate folosi platforma?',
    answer: 'Platforma este destinată consultanților SSM/PSI care oferă servicii multiple firme, precum și companiilor care doresc să gestioneze intern conformitatea SSM/PSI. Suportăm organizații de toate dimensiunile, de la microîntreprinderi la corporații cu sute de angajați.',
    category: 'general',
  },
  {
    question: 'În ce țări este disponibilă platforma?',
    answer: 'Platforma este disponibilă în România, Bulgaria, Ungaria și Germania. Oferim interfață multilingvă (română, bulgară, maghiară, germană și engleză) și ne adaptăm la legislația specifică fiecărei țări în ceea ce privește cerințele SSM/PSI.',
    category: 'general',
  },
  {
    question: 'Cum mă pot înregistra pe platformă?',
    answer: 'Înregistrarea este simplă: accesează pagina de register, completează datele organizației tale (nume, CUI, tip activitate) și ale tale personale (email, parolă). După confirmare, vei primi acces complet la platformă pentru perioada de probă gratuită de 30 de zile.',
    category: 'general',
  },
  {
    question: 'Există perioadă de probă?',
    answer: 'Da, oferim o perioadă de probă gratuită de 30 de zile cu acces complet la toate funcționalitățile platformei. Nu este necesar card de credit pentru perioada de probă. Poți testa toate modulele și decide ulterior dacă dorești să continui cu un abonament.',
    category: 'general',
  },

  // Prețuri
  {
    question: 'Care sunt tarifele pentru platformă?',
    answer: 'Oferim planuri flexibile începând de la 99 RON/lună pentru consultanți independenți (până la 50 angajați gestionate) și planuri enterprise personalizate pentru consultanți cu portofolii mari sau firme cu peste 200 angajați. Toți clienții beneficiază de 30 de zile gratuite de probă.',
    category: 'preturi',
  },
  {
    question: 'Există reduceri pentru abonamente anuale?',
    answer: 'Da, oferim 20% reducere pentru abonamentele anuale plătite în avans. De exemplu, în loc de 1188 RON/an, vei plăti doar 950 RON/an pentru planul de bază. Aceasta înseamnă 2 luni gratuite la un abonament anual.',
    category: 'preturi',
  },
  {
    question: 'Se percep costuri suplimentare pentru utilizatori adițional?',
    answer: 'Nu există costuri ascunse. Fiecare plan include un număr de angajați gestionate (utilizatori finali). Pentru consultanți, poți adăuga membri în echipă (colaboratori SSM) la un cost de 50 RON/lună per membru. Pentru firme, poți avea utilizatori administratori nelimitați.',
    category: 'preturi',
  },
  {
    question: 'Cum se face plata?',
    answer: 'Acceptăm plăți prin card bancar (Visa, Mastercard), transfer bancar și ordin de plată pentru firme. Facturarea este automată lunar sau anual, în funcție de planul ales. Toate facturile sunt disponibile în platformă pentru descărcare în format PDF.',
    category: 'preturi',
  },
  {
    question: 'Pot anula abonamentul oricând?',
    answer: 'Da, poți anula abonamentul oricând din secțiunea Setări > Abonament. Nu există perioade minime de contract sau penalități de anulare. La anulare, vei avea acces la platformă până la sfârșitul perioadei deja plătite, iar datele tale vor rămâne stocate 90 de zile pentru eventuale reactivări.',
    category: 'preturi',
  },

  // Funcționalități
  {
    question: 'Ce funcționalități oferă platforma?',
    answer: 'Platforma oferă: gestionare angajați și dosare personale, programare și tracking controale medicale, evidență instruiri SSM/PSI cu teste și certificate, gestionare echipamente de protecție și PSI, calendar centralizat pentru scadențe, rapoarte și statistici, notificări automate pentru scadențe, export date GDPR-compliant, și mult mai multe.',
    category: 'functionalitati',
  },
  {
    question: 'Pot genera rapoarte automat?',
    answer: 'Da, platforma generează automat rapoarte SSM/PSI conform legislației: registru evidență instruiri, fișe individuale angajați, rapoarte scadențe controale medicale, situație echipamente, statistici accidente și incidente. Toate rapoartele pot fi exportate în PDF și Excel.',
    category: 'functionalitati',
  },
  {
    question: 'Cum funcționează notificările automate?',
    answer: 'Sistemul trimite automat notificări prin email și în platformă pentru: scadențe controale medicale (cu 30, 14 și 7 zile înainte), expirare certificate instruiri, revizie echipamente PSI, reînnoire avize și autorizații. Poți configura ce notificări dorești să primești.',
    category: 'functionalitati',
  },
  {
    question: 'Pot personaliza documentele și rapoartele?',
    answer: 'Da, poți adăuga logo-ul organizației pe toate documentele generate, personaliza antetul și subsolul rapoartelor, și configura câmpurile care apar în rapoarte. Pentru cerințe specifice de customizare, oferim suport dedicat în planurile premium.',
    category: 'functionalitati',
  },
  {
    question: 'Este disponibilă aplicația mobilă?',
    answer: 'Platforma este optimizată responsive pentru mobile și tablete, funcționând perfect în browser. În trimestrul 2 din 2026 vom lansa aplicații native iOS și Android cu funcționalități suplimentare precum scanare documente, notificări push și acces offline.',
    category: 'functionalitati',
  },

  // Securitate
  {
    question: 'Cât de sigure sunt datele mele?',
    answer: 'Securitatea datelor este prioritatea noastră numărul 1. Folosim criptare SSL/TLS pentru toate conexiunile, criptare AES-256 pentru date sensibile stocate, backup-uri automate zilnice, autentificare cu doi factori (2FA) disponibilă, și hosting pe servere securizate în Uniunea Europeană (Supabase infrastructure).',
    category: 'securitate',
  },
  {
    question: 'Este platforma conformă GDPR?',
    answer: 'Da, platforma este 100% conformă cu Regulamentul GDPR (Regulamentul UE 2016/679). Toate datele personale sunt procesate legal, stocate în UE, și pot fi exportate sau șterse la cerere. Oferim funcționalitate dedicată pentru gestionarea consimțământului, export date personale și dreptul la uitare.',
    category: 'securitate',
  },
  {
    question: 'Cine are acces la datele mele?',
    answer: 'Numai utilizatorii pe care îi autorizezi expres au acces la datele organizației tale. Implementăm Role-Based Access Control (RBAC) granular: consultanți, administratori firmă, manageri, angajați - fiecare cu permisiuni specifice. Echipa S-S-M.ro NU are acces la datele tale decât în cazuri de suport tehnic și doar cu consimțământul tău.',
    category: 'securitate',
  },
  {
    question: 'Ce se întâmplă cu datele mele dacă îmi anulez contul?',
    answer: 'La anularea contului, datele tale rămân stocate 90 de zile în caz de reactivare. Poți solicita oricând export complet al datelor în format JSON sau CSV. După 90 de zile sau la solicitarea expresă, datele sunt șterse permanent și ireversibil din toate sistemele noastre, conform GDPR.',
    category: 'securitate',
  },
  {
    question: 'Faceți backup la date?',
    answer: 'Da, realizăm backup-uri automate zilnice ale întregii baze de date, cu retenție de 30 de zile. Backup-urile sunt stocate criptat în locații geografice separate. În plus, poți genera oricând export manual al datelor tale pentru backup local.',
    category: 'securitate',
  },

  // Suport
  {
    question: 'Cum pot obține suport tehnic?',
    answer: 'Oferim mai multe canale de suport: email la contact@s-s-m.ro (răspuns în 24h), chat în platformă (disponibil Luni-Vineri 9-18), documentație detaliată și tutoriale video în secțiunea Help, și webinarii lunare de training. Clienții enterprise beneficiază de suport prioritar și account manager dedicat.',
    category: 'suport',
  },
  {
    question: 'Oferim training pentru utilizatori?',
    answer: 'Da, oferim training complet la onboarding pentru toți clienții noi (1-2 ore sesiune live), tutoriale video pentru fiecare modul în parte, documentație pas cu pas în platformă, și webinarii lunare gratuite pentru toți utilizatorii. Pentru echipe mari, oferim training on-site personalizat.',
    category: 'suport',
  },
  {
    question: 'Cât durează răspunsul la solicitările de suport?',
    answer: 'Ne angajăm la: răspuns email în maxim 24 de ore lucrătoare, răspuns chat în maxim 2 ore în program (L-V 9-18), probleme critice rezolvate în maxim 4 ore. Clienții cu planuri enterprise au SLA garantat cu răspuns sub 1 oră pentru probleme critice.',
    category: 'suport',
  },
  {
    question: 'Mă puteți ajuta cu migrarea datelor din alte sisteme?',
    answer: 'Da, oferim asistență completă pentru migrarea datelor din Excel, alte platforme SSM sau sisteme interne. Punem la dispoziție template-uri pentru import CSV/Excel și, pentru planurile premium, oferim servicii de migrare asistată de echipa noastră (gratuit pentru migrări complexe).',
    category: 'suport',
  },
  {
    question: 'Pot sugera funcționalități noi?',
    answer: 'Absolut! Încurajăm feedback-ul utilizatorilor. Poți trimite sugestii prin formularul de contact, email sau direct în platformă la secțiunea Feedback. Evaluăm toate propunerile și le includem în roadmap-ul de dezvoltare. Multe funcționalități actuale au venit din sugestiile clienților noștri.',
    category: 'suport',
  },

  // Legal
  {
    question: 'Care sunt termenii și condițiile de utilizare?',
    answer: 'Termenii și condițiile complete sunt disponibile pe pagina Termeni și Condiții. În rezumat: te angajezi să folosești platforma conform legii și în scopuri legitime, noi ne angajăm să oferim servicii de calitate cu uptime 99.9%, respectăm GDPR și confidențialitatea datelor tale, și ambele părți pot rezilia contractul cu preaviz de 30 de zile.',
    category: 'legal',
  },
  {
    question: 'Cum gestionați confidențialitatea datelor?',
    answer: 'Politica noastră de confidențialitate este transparentă: colectăm doar date necesare funcționării platformei, nu vindem sau partajăm date cu terți fără consimțământul tău, folosim date doar pentru serviciile contractate, și respectăm toate drepturile GDPR (acces, rectificare, ștergere, portabilitate).',
    category: 'legal',
  },
  {
    question: 'Sunt datele conforme cu legislația română SSM/PSI?',
    answer: 'Da, platforma este dezvoltată în conformitate cu: Legea 319/2006 SSM, HG 1425/2006 controale medicale, Ordin 285/2020 instruiri SSM, Legea 307/2006 PSI, HG 537/2007 autorizații PSI. Actualizăm constant platforma conform modificărilor legislative.',
    category: 'legal',
  },
  {
    question: 'Ce nivel de serviciu (SLA) garantați?',
    answer: 'Garantăm uptime de 99.9% pentru platformă (maximum 8.7 ore downtime pe an), backup zilnic cu retenție 30 zile, timp de răspuns suport sub 24h, și timp de rezolvare bug-uri critice sub 4 ore. Pentru planurile enterprise oferim SLA personalizat cu penalități pentru nerespectare.',
    category: 'legal',
  },
  {
    question: 'Cum se rezolvă litigiile?',
    answer: 'În cazul unor dispute, încercăm mai întâi rezolvarea amiabilă prin negociere directă. Dacă nu se ajunge la o înțelegere, litigiile se soluționează conform legislației române la instanțele competente din București. Totuși, în cei 3 ani de activitate nu am avut niciun litigiu cu clienții noștri.',
    category: 'legal',
  },
]

const CATEGORIES: { value: FAQCategory; label: string; description: string }[] = [
  { value: 'general', label: 'General', description: 'Informații despre platformă și servicii' },
  { value: 'preturi', label: 'Prețuri & Abonamente', description: 'Planuri, costuri și facturare' },
  { value: 'functionalitati', label: 'Funcționalități', description: 'Capabilități și module ale platformei' },
  { value: 'securitate', label: 'Securitate & GDPR', description: 'Protecția datelor și confidențialitate' },
  { value: 'suport', label: 'Suport', description: 'Asistență și training pentru utilizatori' },
  { value: 'legal', label: 'Legal & Conformitate', description: 'Termeni, condiții și legislație' },
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | 'all'>('all')
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  // Filtrare întrebări bazat pe search și categorie
  const filteredFAQs = FAQ_DATA.filter((faq) => {
    const matchesSearch =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedItems(newExpanded)
  }

  // Grupare întrebări pe categorii pentru afișare
  const faqsByCategory = CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat.value] = filteredFAQs.filter((faq) => faq.category === cat.value)
      return acc
    },
    {} as Record<FAQCategory, FAQItem[]>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Întrebări Frecvente
            </h1>
            <p className="text-xl text-blue-100">
              Găsește răspunsuri rapide la cele mai comune întrebări despre platforma S-S-M.ro
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Caută întrebări... (ex: GDPR, prețuri, rapoarte)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg"
            />
          </div>
          {searchQuery && (
            <div className="mt-4 text-sm text-gray-600">
              {filteredFAQs.length} {filteredFAQs.length === 1 ? 'rezultat găsit' : 'rezultate găsite'}
            </div>
          )}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Toate
              <span className="ml-2 text-sm opacity-75">({FAQ_DATA.length})</span>
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-3 rounded-xl font-medium transition-all text-left ${
                  selectedCategory === cat.value
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat.label}
                <span className="ml-2 text-sm opacity-75">
                  ({FAQ_DATA.filter((f) => f.category === cat.value).length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredFAQs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nu am găsit rezultate
            </h3>
            <p className="text-gray-600 mb-6">
              Nu există întrebări care să corespundă căutării tale. Încearcă alți termeni sau
              contactează-ne direct.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              <Mail className="w-5 h-5" />
              Contactează-ne
            </Link>
          </div>
        ) : selectedCategory === 'all' ? (
          // Afișare pe categorii când e selectat "Toate"
          <div className="space-y-8">
            {CATEGORIES.map((category) => {
              const categoryFAQs = faqsByCategory[category.value]
              if (categoryFAQs.length === 0) return null

              return (
                <div key={category.value} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{category.label}</h2>
                    <p className="text-gray-600">{category.description}</p>
                  </div>

                  <div className="space-y-3">
                    {categoryFAQs.map((faq, idx) => {
                      const globalIndex = FAQ_DATA.indexOf(faq)
                      const isExpanded = expandedItems.has(globalIndex)

                      return (
                        <div
                          key={globalIndex}
                          className="border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors"
                        >
                          <button
                            onClick={() => toggleItem(globalIndex)}
                            className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                          >
                            <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="px-5 pb-5 pt-2 border-t border-gray-100 bg-gray-50">
                              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          // Afișare simplă când e selectată o categorie specifică
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {CATEGORIES.find((c) => c.value === selectedCategory)?.label}
              </h2>
              <p className="text-gray-600">
                {CATEGORIES.find((c) => c.value === selectedCategory)?.description}
              </p>
            </div>

            <div className="space-y-3">
              {filteredFAQs.map((faq, idx) => {
                const globalIndex = FAQ_DATA.indexOf(faq)
                const isExpanded = expandedItems.has(globalIndex)

                return (
                  <div
                    key={globalIndex}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors"
                  >
                    <button
                      onClick={() => toggleItem(globalIndex)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-gray-100 bg-gray-50">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 md:p-12 text-center text-white">
          <Mail className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Nu ai găsit răspunsul?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Echipa noastră este aici să te ajute. Trimite-ne un mesaj și îți vom răspunde în maxim 24 de ore.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            <Mail className="w-6 h-6" />
            Contactează-ne acum
          </Link>
        </div>
      </div>
    </div>
  )
}
