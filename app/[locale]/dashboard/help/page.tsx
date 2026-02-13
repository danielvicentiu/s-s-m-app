'use client';

import { useState } from 'react';
import { Search, Book, Settings, FileText, HelpCircle, Rocket, Mail, Phone, MessageCircle } from 'lucide-react';

interface HelpArticle {
  id: string;
  title: string;
  content: string[];
  links?: { label: string; href: string }[];
}

interface HelpCategory {
  id: string;
  name: string;
  icon: any;
  articles: HelpArticle[];
}

const helpCategories: HelpCategory[] = [
  {
    id: 'getting-started',
    name: 'Primii Pași',
    icon: Rocket,
    articles: [
      {
        id: 'welcome',
        title: 'Bine ați venit pe platforma S-S-M.ro',
        content: [
          'Platforma S-S-M.ro este soluția digitală completă pentru gestionarea activităților de securitate și sănătate în muncă (SSM) și prevenire și stingere a incendiilor (PSI). Aici veți găsi toate instrumentele necesare pentru a gestiona eficient documentația, angajații, echipamentele și instruirile.',
          'Platforma este concepută pentru consultanți SSM/PSI și firmele lor, oferind acces rapid la toate informațiile esențiale într-un singur loc. Puteți gestiona mai multe organizații, monitoriza termenele importante și genera rapoarte conforme cu legislația în vigoare.',
          'Pentru a începe, vă recomandăm să parcurgeți secțiunea de onboarding și să configurați organizația dvs. Dacă aveți nevoie de ajutor suplimentar, echipa noastră de suport este disponibilă pentru a vă asista.',
        ],
        links: [
          { label: 'Configurare profil', href: '/dashboard/profile' },
          { label: 'Dashboard principal', href: '/dashboard' },
        ],
      },
      {
        id: 'create-organization',
        title: 'Cum creez o organizație nouă?',
        content: [
          'Pentru a crea o organizație nouă, accesați secțiunea de administrare din meniul principal. Veți găsi opțiunea "Adaugă organizație" în partea de sus a paginii.',
          'Completați formularul cu informațiile organizației: denumire, CUI, adresă, date de contact și tip de activitate. Aceste informații sunt esențiale pentru generarea documentelor conforme cu legislația română.',
          'După crearea organizației, puteți invita membrii echipei și configura rolurile acestora. Fiecare membru va avea acces la funcționalitățile corespunzătoare rolului său (consultant, administrator firmă sau angajat).',
        ],
        links: [
          { label: 'Administrare organizații', href: '/admin/organizations' },
        ],
      },
      {
        id: 'invite-users',
        title: 'Cum adaug membri în organizație?',
        content: [
          'Pentru a invita membri în organizație, navigați la secțiunea "Echipă" din dashboard-ul organizației respective. Veți găsi butonul "Invită membru" în partea de sus a listei.',
          'Introduceți adresa de email a persoanei pe care doriți să o invitați și selectați rolul corespunzător. Sistemul va trimite automat un email cu invitația de înregistrare pe platformă.',
          'După ce persoana invitată își creează contul, va avea acces automat la organizație cu rolul stabilit. Puteți modifica rolurile sau retrage accesul în orice moment din secțiunea de administrare.',
        ],
      },
      {
        id: 'dashboard-overview',
        title: 'Înțelegerea dashboard-ului principal',
        content: [
          'Dashboard-ul principal oferă o vedere de ansamblu asupra tuturor activităților importante. Aici veți găsi alertele urgente, statistici despre angajați, echipamente și documente, precum și accesul rapid la modulele principale.',
          'În partea de sus sunt afișate notificările importante: controale medicale expirate, instruiri planificate, echipamente care necesită verificare și alte alerte de conformitate.',
          'Cardurile statistice vă oferă o imagine rapidă asupra organizației: numărul total de angajați, echipamente active, documente generate și alte metrici cheie. Fiecare card este clickabil și vă redirecționează către secțiunea detaliată.',
        ],
        links: [
          { label: 'Dashboard', href: '/dashboard' },
        ],
      },
      {
        id: 'navigation',
        title: 'Navigarea în aplicație',
        content: [
          'Meniul principal din stânga oferă acces rapid la toate modulele platformei. Puteți accesa Angajați, Fișe medicale, Instruiri, Echipamente, Documente și Rapoarte cu un singur click.',
          'Utilizați bara de căutare globală din header pentru a găsi rapid informații specifice: nume angajat, număr echipament, document sau orice altă informație din baza de date.',
          'Selector-ul de organizație vă permite să comutați rapid între diferitele organizații pe care le gestionați. Contextul curent este afișat în header și toate datele afișate sunt specifice organizației selectate.',
        ],
      },
    ],
  },
  {
    id: 'modules',
    name: 'Module',
    icon: Book,
    articles: [
      {
        id: 'employees',
        title: 'Modulul Angajați',
        content: [
          'Modulul Angajați vă permite să gestionați întreaga evidență a personalului din organizație. Puteți adăuga angajați noi, actualiza informațiile existente și monitoriza statusul fiecăruia.',
          'Pentru fiecare angajat puteți introduce: date personale, funcție, departament, data angajării, tipul contractului și alte informații relevante pentru activitatea SSM/PSI. Toate datele sunt protejate conform GDPR.',
          'Sistemul vă alertează automat când un angajat necesită control medical periodic, instruire de reîmprospătare sau alte verificări obligatorii. Puteți exporta lista de angajați în format Excel pentru raportare.',
        ],
        links: [
          { label: 'Lista angajați', href: '/dashboard/employees' },
        ],
      },
      {
        id: 'medical',
        title: 'Fișe medicale și controale periodice',
        content: [
          'Modulul de fișe medicale vă ajută să țineți evidența tuturor controalelor medicale ale angajaților. Introduceți datele de la avizele medicale și sistemul va calcula automat termenele de reînnoire.',
          'Pentru fiecare fișă medicală puteți atașa documentul scanat, nota aptitudinile și restricțiile medicale, precum și istoricul controalelor anterioare. Toate informațiile sunt confidențiale și accesibile doar persoanelor autorizate.',
          'Sistemul generează alerte automate cu 30, 15 și 7 zile înainte de expirarea avizului medical. Puteți programa rapid controalele medicale periodice și trimite notificări către angajați.',
        ],
        links: [
          { label: 'Fișe medicale', href: '/dashboard/medical' },
        ],
      },
      {
        id: 'trainings',
        title: 'Instruiri SSM și PSI',
        content: [
          'Modulul de instruiri vă permite să planificați, organizați și documentați toate instruirile obligatorii: instruire generală, la locul de muncă, periodică și pentru situații de urgență.',
          'Puteți crea programe de instruire personalizate pe funcții, genera fișe de instructaj conform legislației și ține evidența participanților. Sistemul calculează automat termenele de reîmprospătare.',
          'Fiecare instruire poate fi documentată cu proces-verbal, listă de prezență și materiale didactice. Puteți genera rapoarteComplete privind situația instruirilor la nivel de organizație.',
        ],
        links: [
          { label: 'Instruiri', href: '/dashboard/trainings' },
        ],
      },
      {
        id: 'equipment',
        title: 'Echipamente și DPI',
        content: [
          'Modulul Echipamente vă ajută să gestionați inventarul de echipamente de protecție (DPI), echipamente de lucru și mijloace PSI. Puteți introduce fiecare echipament cu toate caracteristicile sale.',
          'Pentru fiecare echipament înregistrați: denumire, număr inventar, data achiziției, producător, model, serie și termen de valabilitate. Sistemul vă alertează când un echipament necesită verificare sau înlocuire.',
          'Puteți atribui echipamente angajaților și ține evidența distribuției. Sistemul generează automat fișe de dotare personală și registre de evidență conforme cu cerințele legale.',
        ],
        links: [
          { label: 'Echipamente', href: '/dashboard/equipment' },
        ],
      },
      {
        id: 'documents',
        title: 'Documente și rapoarte',
        content: [
          'Modulul Documente centralizează toate documentele generate de platformă: planuri de prevenire, fișe de instructaj, rapoarte de verificare și alte documente SSM/PSI.',
          'Puteți genera automat documente personalizate cu datele organizației și angajaților. Toate documentele respectă formatele standard și cerințele legislative în vigoare.',
          'Documentele sunt organizate pe categorii și pot fi căutate rapid. Puteți exporta, descărca sau trimite prin email orice document. Sistemul păstrează un istoric complet al tuturor documentelor generate.',
        ],
        links: [
          { label: 'Documente', href: '/dashboard/documents' },
        ],
      },
    ],
  },
  {
    id: 'reports',
    name: 'Rapoarte',
    icon: FileText,
    articles: [
      {
        id: 'generate-reports',
        title: 'Generare rapoarte',
        content: [
          'Platforma oferă o gamă largă de rapoarte predefinite care vă ajută să monitorizați conformitatea și să raportați activitățile SSM/PSI. Toate rapoartele pot fi personalizate și exportate.',
          'Puteți genera rapoarte pentru: situația controalelor medicale, planificare instruiri, evidența echipamentelor, evenimente și incidente, precum și rapoarte statistice generale.',
          'Rapoartele sunt generate instant pe baza datelor actualizate din sistem. Puteți selecta perioada, organizația și alte filtre pentru a obține exact informațiile de care aveți nevoie.',
        ],
        links: [
          { label: 'Rapoarte', href: '/dashboard/reports' },
        ],
      },
      {
        id: 'export-data',
        title: 'Export date în Excel/PDF',
        content: [
          'Majoritatea rapoartelor pot fi exportate în format Excel (.xlsx) pentru procesare ulterioară sau în format PDF pentru distribuire. Formatarea este păstrată și documentele sunt gata de print.',
          'Exportul în Excel include toate coloanele de date cu header-e descriptive. Puteți deschide fișierul direct în Microsoft Excel, Google Sheets sau alte aplicații compatibile.',
          'Exportul PDF generează documente profesionale cu logo-ul organizației, date de contact și formatare conformă cu cerințele de raportare oficială.',
        ],
      },
      {
        id: 'scheduled-reports',
        title: 'Rapoarte programate',
        content: [
          'Puteți configura rapoarte care se generează automat la intervale regulate (lunar, trimestrial, anual) și se trimit prin email către destinatarii configurați.',
          'Rapoartele programate vă ajută să rămâneți la curent cu situația conformității fără să accesați manual platforma. Veți primi notificări când raportul este generat.',
          'Pentru a configura un raport programat, accesați secțiunea Rapoarte, selectați tipul de raport dorit și activați opțiunea de programare. Puteți modifica sau dezactiva programarea în orice moment.',
        ],
      },
      {
        id: 'audit-log',
        title: 'Jurnalul de audit',
        content: [
          'Jurnalul de audit înregistrează automat toate acțiunile importante efectuate în platformă: creări, modificări, ștergeri și accesări de date. Fiecare înregistrare include cine, când și ce a fost modificat.',
          'Acest jurnal este esențial pentru conformitate și securitate. Puteți verifica oricând cine a efectuat o anumită modificare și când. Datele din jurnal nu pot fi modificate sau șterse.',
          'Puteți filtra jurnalul după utilizator, tip de acțiune, perioadă de timp sau tabelă afectată. Exportul în Excel permite analize detaliate ale activității din platformă.',
        ],
        links: [
          { label: 'Jurnal audit', href: '/admin/audit' },
        ],
      },
      {
        id: 'compliance-dashboard',
        title: 'Dashboard conformitate',
        content: [
          'Dashboard-ul de conformitate oferă o vedere centralizată asupra tuturor aspectelor legate de conformitatea cu legislația SSM/PSI. Vedeți instant ce este în regulă și ce necesită atenție.',
          'Indicatorii cheie de performanță (KPI) vă arată procentul de conformitate pentru: controale medicale la zi, instruiri efectuate, echipamente verificate și documente actualizate.',
          'Graficele și statisticile interactive vă ajută să identificați rapid tendințele și să luați decizii informate pentru îmbunătățirea conformității la nivel de organizație.',
        ],
      },
    ],
  },
  {
    id: 'settings',
    name: 'Setări',
    icon: Settings,
    articles: [
      {
        id: 'account-settings',
        title: 'Setări cont personal',
        content: [
          'În setările contului puteți actualiza informațiile personale: nume, email, telefon și parolă. Asigurați-vă că datele de contact sunt corecte pentru a primi notificările importante.',
          'Puteți configura preferințele de notificare: ce tipuri de alerte doriți să primiți și prin ce canale (email, notificări in-app). Personalizați experiența conform nevoilor dvs.',
          'Secțiunea de securitate vă permite să modificați parola, să vizualizați sesiunile active și să activați autentificarea cu doi factori pentru protecție suplimentară.',
        ],
        links: [
          { label: 'Profil utilizator', href: '/dashboard/profile' },
        ],
      },
      {
        id: 'organization-settings',
        title: 'Setări organizație',
        content: [
          'Administratorii pot configura setările organizației: date de identificare, logo, antet documente și alte preferințe specifice. Aceste setări afectează toate documentele generate.',
          'Puteți configura modulele active pentru organizație, workflow-urile de aprobare și regulile automate de alertare. Personalizați platforma conform proceselor interne.',
          'Setările de facturare și abonament vă permit să gestionați planul ales, să vizualizați istoricul plăților și să actualizați informațiile de facturare.',
        ],
      },
      {
        id: 'user-roles',
        title: 'Roluri și permisiuni',
        content: [
          'Sistemul de roluri vă permite să controlați exact ce poate face fiecare utilizator în platformă. Există trei roluri predefinite: Consultant, Administrator firmă și Angajat.',
          'Consultanții au acces complet la toate funcționalitățile și pot gestiona mai multe organizații. Administratorii firmă gestionează o singură organizație, iar angajații au acces doar la informațiile lor personale.',
          'Puteți atribui roluri personalizate cu permisiuni specifice pentru a se potrivi structurii organizației dvs. Fiecare permisiune poate fi activată sau dezactivată individual.',
        ],
      },
      {
        id: 'notifications',
        title: 'Configurare notificări',
        content: [
          'Notificările vă țin la curent cu toate evenimentele importante: termene care expiră, sarcini noi, modificări în sistem și alte alerte relevante pentru activitatea dvs.',
          'Puteți configura ce notificări doriți să primiți: controale medicale, instruiri, verificări echipamente, evenimente de securitate și altele. Alegeți frecvența și canalul de livrare.',
          'Notificările sunt clasificate pe nivele de urgență: critice (roșu), importante (portocaliu) și informative (albastru). Puteți dezactiva temporar notificările pentru perioade ocupate.',
        ],
      },
      {
        id: 'data-privacy',
        title: 'Confidențialitate și GDPR',
        content: [
          'Platforma S-S-M.ro respectă pe deplin reglementările GDPR privind protecția datelor personale. Toate datele sunt stocate securizat în Uniunea Europeană și criptate în tranzit și în repaus.',
          'Aveți control complet asupra datelor dvs.: puteți exporta toate informațiile într-un format portabil sau puteți solicita ștergerea completă a contului și datelor asociate.',
          'Pentru informații detaliate despre cum procesăm datele, vă rugăm să consultați Politica de confidențialitate. Echipa noastră de DPO este disponibilă pentru orice întrebări legate de protecția datelor.',
        ],
        links: [
          { label: 'Politica de confidențialitate', href: '/privacy' },
        ],
      },
    ],
  },
  {
    id: 'faq',
    name: 'FAQ',
    icon: HelpCircle,
    articles: [
      {
        id: 'forgot-password',
        title: 'Am uitat parola. Ce fac?',
        content: [
          'Dacă ați uitat parola, accesați pagina de autentificare și click pe "Ai uitat parola?". Introduceți adresa de email asociată contului și veți primi instrucțiuni pentru resetare.',
          'Verificați inbox-ul și folderul spam pentru emailul de resetare. Link-ul este valabil 24 de ore. Dacă nu primiți emailul, verificați că adresa introdusă este corectă.',
          'După ce click pe link-ul din email, veți putea seta o parolă nouă. Alegeți o parolă puternică cu minim 8 caractere, litere mari și mici, cifre și simboluri.',
        ],
      },
      {
        id: 'billing',
        title: 'Cum funcționează facturarea?',
        content: [
          'Platforma funcționează pe bază de abonament lunar sau anual. Prețul depinde de numărul de organizații și utilizatori activi. Primul an este gratuit pentru testare și evaluare.',
          'Facturarea se face automat la începutul fiecărei perioade de facturare. Veți primi factura prin email. Puteți plăti cu card bancar, transfer bancar sau alte metode acceptate.',
          'Puteți modifica sau anula abonamentul oricând din setările contului. La anulare, veți păstra accesul până la sfârșitul perioadei plătite. Nu există costuri ascunse sau penalități.',
        ],
      },
      {
        id: 'data-security',
        title: 'Cât de sigure sunt datele mele?',
        content: [
          'Securitatea datelor este prioritatea noastră principală. Utilizăm criptare SSL/TLS pentru toate conexiunile, iar datele sunt stocate criptat pe servere securizate în UE.',
          'Toate accesurile sunt protejate cu autentificare și controlate prin sistem de permisiuni granulare. Fiecare acțiune este înregistrată în jurnalul de audit pentru trasabilitate completă.',
          'Efectuăm backup-uri automate zilnice și monitorizăm continuu infrastructura pentru amenințări. Datele dvs. sunt protejate conform standardelor bancare de securitate.',
        ],
      },
      {
        id: 'mobile-access',
        title: 'Pot accesa platforma de pe mobil?',
        content: [
          'Da, platforma S-S-M.ro este complet responsive și funcționează perfect pe smartphone-uri și tablete. Nu este nevoie să instalați o aplicație separată.',
          'Deschideți browser-ul de pe dispozitivul mobil și accesați app.s-s-m.ro. Interfața se va adapta automat la dimensiunea ecranului pentru o experiență optimă.',
          'Toate funcționalitățile sunt disponibile și pe mobil: consultare date, adăugare informații, generare documente și primire notificări. Sincronizarea este automată și instant.',
        ],
      },
      {
        id: 'support',
        title: 'Cum contactez suportul tehnic?',
        content: [
          'Echipa noastră de suport este disponibilă Luni-Vineri, 9:00-18:00. Puteți contacta suportul prin email, telefon sau chat direct din platformă.',
          'Pentru probleme urgente, sunați direct la numărul de telefon afișat mai jos. Pentru întrebări generale, emailul este cel mai rapid canal. Timpul mediu de răspuns este sub 2 ore.',
          'Înainte de a contacta suportul, vă recomandăm să consultați această pagină de ajutor și secțiunea FAQ. Majoritatea întrebărilor frecvente au răspunsuri detaliate aici.',
        ],
      },
    ],
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);

  // Filter articles based on search query
  const filteredCategories = helpCategories.map((category) => ({
    ...category,
    articles: category.articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
  })).filter((category) => category.articles.length > 0);

  const displayCategories = searchQuery ? filteredCategories : helpCategories;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Centru de Ajutor</h1>
          <p className="text-gray-600">
            Găsește răspunsuri la întrebările tale și află cum să folosești platforma S-S-M.ro
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Caută în articolele de ajutor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {selectedArticle ? (
          /* Article Detail View */
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <button
              onClick={() => setSelectedArticle(null)}
              className="mb-6 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              ← Înapoi la articole
            </button>

            <article>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{selectedArticle.title}</h2>

              <div className="prose max-w-none">
                {selectedArticle.content.map((paragraph, index) => (
                  <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {selectedArticle.links && selectedArticle.links.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Link-uri utile</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedArticle.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.href}
                        className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        {link.label} →
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>
        ) : (
          /* Categories and Articles List */
          <div className="space-y-8">
            {displayCategories.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nu am găsit rezultate
                </h3>
                <p className="text-gray-600">
                  Încercați să căutați cu alți termeni sau contactați suportul pentru ajutor.
                </p>
              </div>
            ) : (
              displayCategories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;

                return (
                  <div key={category.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <button
                      onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <h2 className="text-xl font-bold text-gray-900">{category.name}</h2>
                          <p className="text-sm text-gray-600">
                            {category.articles.length} {category.articles.length === 1 ? 'articol' : 'articole'}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`transform transition-transform ${
                          isSelected ? 'rotate-180' : ''
                        }`}
                      >
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </button>

                    {(isSelected || searchQuery) && (
                      <div className="border-t border-gray-200">
                        {category.articles.map((article, index) => (
                          <button
                            key={article.id}
                            onClick={() => setSelectedArticle(article)}
                            className={`w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors ${
                              index !== category.articles.length - 1 ? 'border-b border-gray-100' : ''
                            }`}
                          >
                            <h3 className="font-semibold text-gray-900 mb-1">{article.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {article.content[0]}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Contact Support Section */}
        <div className="mt-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Nu ai găsit ce căutai?</h2>
            <p className="text-blue-100">
              Echipa noastră de suport este aici să te ajute!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Email</h3>
              <a
                href="mailto:support@s-s-m.ro"
                className="text-blue-100 hover:text-white transition-colors"
              >
                support@s-s-m.ro
              </a>
              <p className="text-sm text-blue-100 mt-2">
                Răspuns în max 2 ore
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Telefon</h3>
              <a
                href="tel:+40123456789"
                className="text-blue-100 hover:text-white transition-colors"
              >
                +40 123 456 789
              </a>
              <p className="text-sm text-blue-100 mt-2">
                Luni-Vineri, 9:00-18:00
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Chat Live</h3>
              <button className="text-blue-100 hover:text-white transition-colors">
                Inițiază conversație
              </button>
              <p className="text-sm text-blue-100 mt-2">
                Disponibil în program
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
