import React from 'react';
import {
  ShieldCheck,
  Flame,
  HeartPulse,
  Wrench,
  GraduationCap,
  ClipboardList,
  FolderOpen,
  BellRing,
} from 'lucide-react';

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  imageAlt: string;
}

const features: Feature[] = [
  {
    icon: ShieldCheck,
    title: 'Securitate și Sănătate în Muncă (SSM)',
    description:
      'Gestionați complet activitatea de SSM: planuri de prevenție, evaluări de risc IPER, instrucțiuni proprii de securitate, monitorizare legislație actualizată. Documentația completă generată automat conform normelor în vigoare, cu notificări pentru scadențe și obligații legale.',
    imageAlt: 'Dashboard SSM',
  },
  {
    icon: Flame,
    title: 'Prevenire și Stingere Incendii (PSI)',
    description:
      'Modul dedicat pentru managementul PSI: scenarii de incendiu, planuri de evacuare, verificări echipamente PSI, evidență formări utilizare stingătoare. Generare automată documente specifice: autorizații funcționare, documentații tehnice, instructaje evacuare și intervenție rapidă.',
    imageAlt: 'Modul PSI',
  },
  {
    icon: HeartPulse,
    title: 'Medicina Muncii',
    description:
      'Evidență completă fișe medicale angajați: examinări periodice, scadențe controale medicale, aptitudini specifice postului, restricții și recomandări medicale. Alertă automată pentru expirări avize medicale, rapoarte centralizate pe departamente, integrare calendare programări.',
    imageAlt: 'Gestiune medicina muncii',
  },
  {
    icon: Wrench,
    title: 'Echipamente de Lucru și Protecție',
    description:
      'Registru electronic echipamente: dotări individuale de protecție (EIP), scule și utilaje, verificări periodice ITM și ISCIR, certificate de conformitate. Istoric complete service și întreținere, planificare înlocuiri, alocări pe angajat, alerte verificări tehnice și expirări.',
    imageAlt: 'Gestiune echipamente',
  },
  {
    icon: GraduationCap,
    title: 'Instruire și Formare',
    description:
      'Platformă completă pentru managementul instruirilor SSM/PSI: instruire introductiv-generală, la locul de muncă, periodică, suplimentară. Generare automată fișe instruire personalizate, evidență participanți, certificate absolvire, teste evaluare cunoștințe și rapoarte conformitate.',
    imageAlt: 'Sistem instruire',
  },
  {
    icon: ClipboardList,
    title: 'REGES - Registrul Electronic General',
    description:
      'Implementare completă REGES conform legislației: evidență electronică angajați, contracte de muncă, modificări contractuale, înregistrări ITM automate. Sincronizare date cu REVISAL, generare rapoarte pentru controale, istoric complet modificări, export XML pentru autorități.',
    imageAlt: 'Modul REGES',
  },
  {
    icon: FolderOpen,
    title: 'Documente și Arhivă Digitală',
    description:
      'Sistem centralizat de management documente SSM/PSI: stocare cloud securizată, organizare pe categorii și angajați, versioning automat, semnături electronice. Acces rapid la orice document, căutare avansată, export bulk, partajare controlată cu auditori, backup automat și conformitate GDPR.',
    imageAlt: 'Arhivă digitală',
  },
  {
    icon: BellRing,
    title: 'Alerte și Notificări Inteligente',
    description:
      'Sistem avansat de alerte automate: scadențe documente, expirări avize și autorizații, termene instruire, verificări periodice echipamente. Notificări email și SMS, dashboard prioritizat pe urgență, escaladare automată, istoric rezolvări, rapoarte compliance și zero scadențe ratate.',
    imageAlt: 'Dashboard alerte',
  },
];

export default function FeaturesDetailed() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Module Complete pentru Compliance SSM/PSI
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Platformă all-in-one care digitalizează complet activitatea de
            securitate și sănătate în muncă. Fiecare modul este proiectat
            pentru eficiență maximă și conformitate totală cu legislația.
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-24">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className={`flex flex-col ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-12 items-center`}
              >
                {/* Content */}
                <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-3xl font-bold text-gray-900">
                    {feature.title}
                  </h3>

                  <p className="text-lg text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="pt-4">
                    <a
                      href="#demo"
                      className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                    >
                      Explorează modulul
                      <svg
                        className="ml-2 w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Screenshot Placeholder */}
                <div className="flex-1 w-full">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                    {/* Browser Chrome */}
                    <div className="bg-gray-200 px-4 py-3 flex items-center gap-2 border-b border-gray-300">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="flex-1 ml-4 bg-white rounded px-3 py-1 text-xs text-gray-500">
                        app.s-s-m.ro/dashboard
                      </div>
                    </div>

                    {/* Screenshot Content */}
                    <div className="aspect-[4/3] bg-white p-8 flex flex-col items-center justify-center">
                      <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center mb-6">
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="text-center">
                        <div className="text-gray-900 font-semibold text-lg mb-2">
                          {feature.title}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {feature.imageAlt}
                        </div>
                      </div>

                      {/* Decorative Elements */}
                      <div className="mt-8 w-full max-w-md space-y-3">
                        <div className="h-3 bg-gray-200 rounded-full w-full"></div>
                        <div className="h-3 bg-gray-200 rounded-full w-5/6"></div>
                        <div className="h-3 bg-gray-200 rounded-full w-4/6"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <a
              href="#signup"
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Începe perioada de probă gratuită
            </a>
            <a
              href="#contact"
              className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-2xl hover:bg-gray-50 transition-colors border-2 border-gray-200"
            >
              Solicită demo personalizat
            </a>
          </div>
          <p className="mt-4 text-gray-600">
            Fără card de credit • Setup în 5 minute • Suport dedicat în română
          </p>
        </div>
      </div>
    </section>
  );
}
