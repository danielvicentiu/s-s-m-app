import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Politica de Confidențialitate | S-S-M.ro',
  description: 'Politica de confidențialitate și protecție a datelor personale conform GDPR',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-2 mb-4"
          >
            ← Înapoi la Pagina Principală
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Politica de Confidențialitate
          </h1>
          <p className="text-gray-600 mt-2">
            Ultima actualizare: 14 februarie 2026
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          {/* Table of Contents */}
          <div className="bg-blue-50 border-b border-blue-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Cuprins
            </h2>
            <nav className="space-y-2">
              <a href="#operator" className="block text-blue-600 hover:text-blue-700 hover:underline">
                1. Operator de Date cu Caracter Personal
              </a>
              <a href="#date-colectate" className="block text-blue-600 hover:text-blue-700 hover:underline">
                2. Date cu Caracter Personal Colectate
              </a>
              <a href="#scopuri" className="block text-blue-600 hover:text-blue-700 hover:underline">
                3. Scopurile Prelucrării
              </a>
              <a href="#baza-legala" className="block text-blue-600 hover:text-blue-700 hover:underline">
                4. Baza Legală a Prelucrării
              </a>
              <a href="#durata" className="block text-blue-600 hover:text-blue-700 hover:underline">
                5. Durata Stocării Datelor
              </a>
              <a href="#drepturi" className="block text-blue-600 hover:text-blue-700 hover:underline">
                6. Drepturile Persoanelor Vizate
              </a>
              <a href="#securitate" className="block text-blue-600 hover:text-blue-700 hover:underline">
                7. Măsuri de Securitate
              </a>
              <a href="#cookies" className="block text-blue-600 hover:text-blue-700 hover:underline">
                8. Cookies și Tehnologii Similare
              </a>
              <a href="#transfer" className="block text-blue-600 hover:text-blue-700 hover:underline">
                9. Transfer Internațional de Date
              </a>
              <a href="#modificari" className="block text-blue-600 hover:text-blue-700 hover:underline">
                10. Modificări ale Politicii
              </a>
              <a href="#dpo" className="block text-blue-600 hover:text-blue-700 hover:underline">
                11. Date de Contact DPO
              </a>
              <a href="#anspdcp" className="block text-blue-600 hover:text-blue-700 hover:underline">
                12. Autoritatea Națională de Supraveghere
              </a>
            </nav>
          </div>

          {/* Content Sections */}
          <div className="p-6 sm:p-8 lg:p-10 space-y-10">

            {/* Section 1 */}
            <section id="operator" className="scroll-mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Operator de Date cu Caracter Personal
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Operatorul datelor cu caracter personal colectate prin intermediul platformei
                  <span className="font-semibold"> S-S-M.ro</span> este:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-gray-700">
                    <span className="font-semibold">Denumire:</span> S-S-M Consulting SRL
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">CUI:</span> [CUI Operator]
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Nr. Reg. Com.:</span> [Nr. Registru]
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Adresă:</span> [Adresă Completă]
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Email:</span>{' '}
                    <a href="mailto:contact@s-s-m.ro" className="text-blue-600 hover:underline">
                      contact@s-s-m.ro
                    </a>
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Telefon:</span> [Număr Telefon]
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section id="date-colectate" className="scroll-mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Date cu Caracter Personal Colectate
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  În funcție de tipul de utilizator și serviciile accesate, colectăm următoarele
                  categorii de date:
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  2.1. Date de Identificare și Contact
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Nume și prenume</li>
                  <li>Adresă de email</li>
                  <li>Număr de telefon</li>
                  <li>CNP (pentru angajați, conform legislației SSM/PSI)</li>
                  <li>Adresă (pentru facturare și comunicări oficiale)</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  2.2. Date Profesionale și Organizaționale
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Denumirea și datele firmei (CUI, nr. reg. com.)</li>
                  <li>Poziția/funcția în organizație</li>
                  <li>Departament</li>
                  <li>Data angajării</li>
                  <li>Contract de muncă (tip, dată începere)</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  2.3. Date Medicale SSM (Categorii Speciale)
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Rezultate controale medicale periodice</li>
                  <li>Date examen medical de angajare</li>
                  <li>Avize medicale de aptitudine la locul de muncă</li>
                  <li>Date privind incidentele/accidentele de muncă</li>
                  <li>Recomandări medicale legate de SSM</li>
                </ul>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-3">
                  <p className="text-sm text-amber-800">
                    <span className="font-semibold">Atenție:</span> Aceste date sunt prelucrate
                    exclusiv în baza obligațiilor legale SSM/PSI și cu consimțământ explicit
                    pentru scopuri suplimentare.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  2.4. Date de Instruire și Conformitate
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Istoric instruiri SSM și PSI</li>
                  <li>Certificate de absolvire training-uri</li>
                  <li>Rezultate teste de evaluare</li>
                  <li>Prezenţă la instruiri</li>
                  <li>Documente semnate (procese-verbale, fișe de instruire)</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  2.5. Date Tehnice de Utilizare
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Adresă IP</li>
                  <li>Tip browser și versiune</li>
                  <li>Sistem de operare</li>
                  <li>Date de autentificare (hash parole, token-uri sesiune)</li>
                  <li>Pagini vizitate și timp de utilizare</li>
                  <li>Acțiuni efectuate în platformă (audit log)</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section id="scopuri" className="scroll-mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Scopurile Prelucrării
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Datele dumneavoastră sunt prelucrate în următoarele scopuri:
                </p>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      3.1. Îndeplinirea Obligațiilor Legale SSM/PSI
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Gestionarea conformității cu legislația în domeniul securității și sănătății
                      în muncă (Legea 319/2006) și protecției împotriva incendiilor.
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      3.2. Furnizarea Serviciilor de Consultanță
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Oferirea serviciilor de consultanță SSM/PSI către organizații și
                      gestionarea relației contractuale.
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      3.3. Managementul Platformei Digitale
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Crearea și gestionarea conturilor, autentificare utilizatori, funcționarea
                      tehnică a platformei.
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      3.4. Comunicare și Notificări
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Trimiterea de alerte, notificări despre scadențe (controale medicale,
                      instruiri), comunicări administrative.
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      3.5. Raportare și Audit
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Generarea rapoartelor SSM/PSI, documentații pentru inspecții, audit intern
                      și extern.
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      3.6. Securitate și Prevenirea Fraudelor
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Protejarea platformei, detectarea și prevenirea activităților neautorizate,
                      menținerea integrității sistemului.
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      3.7. Îmbunătățirea Serviciilor
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Analiză statistică (date anonimizate) pentru optimizarea funcționalităților
                      platformei și serviciilor oferite.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="baza-legala" className="scroll-mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Baza Legală a Prelucrării
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Prelucrarea datelor dumneavoastră se bazează pe următoarele temeiuri juridice
                  conform GDPR (Regulamentul UE 2016/679):
                </p>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Tip Date
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Bază Legală
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Articol GDPR
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Date medicale SSM/PSI
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Obligație legală (Legea 319/2006)
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Art. 6(1)(c), Art. 9(2)(b)
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Date identificare angajați
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Obligație legală și executarea contractului
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Art. 6(1)(b), (c)
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Date instruire SSM/PSI
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Obligație legală
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Art. 6(1)(c)
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Date cont utilizator
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Executarea contractului
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Art. 6(1)(b)
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Date tehnice (IP, cookies)
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Interes legitim (securitate)
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Art. 6(1)(f)
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Marketing (dacă aplicabil)
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Consimțământ explicit
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Art. 6(1)(a)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="durata" className="scroll-mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Durata Stocării Datelor
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Datele dumneavoastră sunt păstrate pentru perioada necesară îndeplinirii
                  scopurilor pentru care au fost colectate sau conform obligațiilor legale:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">5+</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Dosare medicale și fișe de aptitudine
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Minim 5 ani de la încetarea raportului de muncă (conform Legea 319/2006)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">10</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Registre accidente de muncă și boli profesionale
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        10 ani de la înregistrare
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Fișe de instruire SSM/PSI
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        3 ani de la efectuarea instruirii
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">5</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Documente contractuale și facturi
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        5 ani conform Codului Fiscal
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">∞</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Conturi active utilizatori
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Pe durata utilizării platformei sau până la solicitarea ștergerii
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">90</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Log-uri de audit și securitate
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        90 zile pentru detectarea incidentelor de securitate
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <p className="text-sm text-blue-800">
                    La expirarea perioadelor menționate, datele vor fi șterse sau anonimizate,
                    cu excepția cazurilor în care există obligații legale de păstrare mai îndelungate.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section id="drepturi" className="scroll-mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Drepturile Persoanelor Vizate
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Conform GDPR, beneficiați de următoarele drepturi în legătură cu datele
                  dumneavoastră personale:
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Dreptul de Acces
                        </h4>
                        <p className="text-sm text-gray-700">
                          Aveți dreptul să obțineți confirmarea că prelucrăm datele dumneavoastră
                          și să primiți o copie a acestora.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-lg flex items-center justify-center font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Dreptul de Rectificare
                        </h4>
                        <p className="text-sm text-gray-700">
                          Puteți solicita corectarea datelor inexacte sau completarea datelor
                          incomplete.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-5 border border-red-200">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-red-600 text-white rounded-lg flex items-center justify-center font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Dreptul la Ștergere (&quot;Dreptul de a fi uitat&quot;)
                        </h4>
                        <p className="text-sm text-gray-700">
                          În anumite condiții, puteți solicita ștergerea datelor dumneavoastră
                          (cu excepția celor păstrate din obligații legale).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-5 border border-amber-200">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-amber-600 text-white rounded-lg flex items-center justify-center font-bold">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Dreptul la Restricționarea Prelucrării
                        </h4>
                        <p className="text-sm text-gray-700">
                          Puteți solicita restricționarea prelucrării în anumite situații
                          (ex: contestarea exactității datelor).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold">
                        5
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Dreptul la Portabilitatea Datelor
                        </h4>
                        <p className="text-sm text-gray-700">
                          Puteți primi datele într-un format structurat și puteți solicita
                          transferul acestora către alt operator.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-5 border border-indigo-200">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold">
                        6
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Dreptul de Opoziție
                        </h4>
                        <p className="text-sm text-gray-700">
                          Puteți obiecta la prelucrarea datelor bazată pe interes legitim
                          sau în scopuri de marketing direct.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-5 border border-pink-200">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-pink-600 text-white rounded-lg flex items-center justify-center font-bold">
                        7
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Dreptul de a Retrage Consimțământul
                        </h4>
                        <p className="text-sm text-gray-700">
                          Unde prelucrarea se bazează pe consimțământ, îl puteți retrage
                          oricând fără a afecta legalitatea prelucrării anterioare.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-5 border border-teal-200">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-teal-600 text-white rounded-lg flex items-center justify-center font-bold">
                        8
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Dreptul de a Depune Plângere
                        </h4>
                        <p className="text-sm text-gray-700">
                          Aveți dreptul să depuneți o plângere la Autoritatea Națională de
                          Supraveghere (ANSPDCP).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Cum puteți exercita aceste drepturi?
                  </h4>
                  <p className="text-gray-700 mb-3">
                    Pentru a exercita oricare dintre drepturile menționate mai sus, ne puteți
                    contacta prin:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600">✉</span>
                      <span>
                        Email:{' '}
                        <a href="mailto:dpo@s-s-m.ro" className="text-blue-600 hover:underline font-medium">
                          dpo@s-s-m.ro
                        </a>
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600">📧</span>
                      <span>Formularul de contact disponibil în platformă (secțiunea GDPR)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600">📄</span>
                      <span>Cerere scrisă trimisă la adresa sediului social</span>
                    </li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-4">
                    <span className="font-semibold">Termen de răspuns:</span> Vă vom răspunde
                    în termen de maximum 30 de zile de la primirea cererii dumneavoastră.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section id="securitate" className="scroll-mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Măsuri de Securitate
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Implementăm măsuri tehnice și organizatorice adecvate pentru a proteja datele
                  dumneavoastră împotriva accesului neautorizat, pierderii, distrugerii sau
                  divulgării accidentale:
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  7.1. Măsuri Tehnice
                </h3>
                <div className="grid md:grid-cols-2 gap-3 mb-6">
                  <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                    <span className="text-2xl">🔐</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Criptare SSL/TLS</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Toate comunicările sunt criptate folosind protocoale HTTPS
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                    <span className="text-2xl">🗄️</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Criptare Bază de Date</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Datele sensibile sunt criptate în baza de date (at-rest encryption)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                    <span className="text-2xl">🔑</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Autentificare Securizată</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Parole hash-uite cu algoritmi moderni (bcrypt), autentificare multi-factor opțională
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                    <span className="text-2xl">🛡️</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Firewall și Protecție DDoS</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Protecție la nivel de rețea împotriva atacurilor
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                    <span className="text-2xl">📊</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Monitorizare și Audit Log</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Înregistrarea și monitorizarea accesului la date
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                    <span className="text-2xl">💾</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Backup-uri Automate</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Backup zilnic criptat cu retenție conform politicii
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  7.2. Măsuri Organizatorice
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                  <li>
                    <span className="font-semibold">Acces restricționat:</span> Doar personalul
                    autorizat are acces la datele personale, pe baza principiului &quot;need-to-know&quot;
                  </li>
                  <li>
                    <span className="font-semibold">Contracte de confidențialitate:</span> Toți
                    angajații și colaboratorii semnează clauze de confidențialitate
                  </li>
                  <li>
                    <span className="font-semibold">Instruire periodică:</span> Personalul este
                    instruit cu privire la protecția datelor și securitatea informațiilor
                  </li>
                  <li>
                    <span className="font-semibold">Proceduri de incident:</span> Plan de răspuns
                    la incidente de securitate și notificare în 72 ore conform GDPR
                  </li>
                  <li>
                    <span className="font-semibold">Evaluări de impact (DPIA):</span> Efectuate
                    pentru prelucrări cu risc ridicat (date medicale)
                  </li>
                  <li>
                    <span className="font-semibold">Verificarea terților:</span> Procesatorii de
                    date (hosting, email) sunt evaluați pentru conformitate GDPR
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  7.3. Infrastructură
                </h3>
                <div className="bg-gray-50 rounded-lg p-5">
                  <p className="text-gray-700 mb-3">
                    Platforma este găzduită pe infrastructură cloud certificată:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">▸</span>
                      <span>
                        <span className="font-semibold">Vercel:</span> Hosting aplicație (ISO 27001, SOC 2)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">▸</span>
                      <span>
                        <span className="font-semibold">Supabase (AWS):</span> Bază de date PostgreSQL
                        cu RLS activ, backup automat
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">▸</span>
                      <span>
                        <span className="font-semibold">Centru de date:</span> EU (Frankfurt/Ireland)
                        — datele nu părăsesc UE
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section id="cookies" className="scroll-mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Cookies și Tehnologii Similare
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Platforma utilizează cookies și tehnologii similare pentru funcționarea corectă
                  și îmbunătățirea experienței utilizatorului.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  8.1. Tipuri de Cookies Utilizate
                </h3>
                <div className="space-y-3 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Cookies Strict Necesare (Esențiale)
                    </h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Necesare pentru funcționarea platformei. Nu pot fi dezactivate.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Token-uri de autentificare (sesiune utilizator)</li>
                      <li>• Preferințe de limbă și regiune</li>
                      <li>• Securitate CSRF</li>
                      <li>• Durata: Sesiune sau până la 30 zile</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-600">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Cookies Funcționale
                    </h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Reținerea preferințelor utilizatorului (temă dark/light, layout, etc.)
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Preferințe interfață (ex: tema întunecată)</li>
                      <li>• Setări dashboard personalizate</li>
                      <li>• Durata: Până la 1 an</li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-600">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Cookies de Analiză (cu consimțământ)
                    </h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Analiză statistică anonimizată pentru îmbunătățirea platformei
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Date anonimizate despre utilizare</li>
                      <li>• Pagini vizitate și timp petrecut</li>
                      <li>• Nu include date cu caracter personal identificabile</li>
                      <li>• Durata: Până la 2 ani</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  8.2. Gestionarea Cookies
                </h3>
                <p className="text-gray-700 mb-3">
                  Puteți gestiona preferințele pentru cookies în următoarele moduri:
                </p>
                <div className="bg-gray-50 rounded-lg p-5">
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold text-lg">1</span>
                      <span>
                        <span className="font-semibold">Banner Cookie:</span> La prima vizită,
                        veți primi un banner pentru a alege ce cookies acceptați
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold text-lg">2</span>
                      <span>
                        <span className="font-semibold">Setări Browser:</span> Majoritatea
                        browserelor permit blocarea sau ștergerea cookies din setări
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold text-lg">3</span>
                      <span>
                        <span className="font-semibold">Panou GDPR în Cont:</span> Puteți
                        modifica oricând preferințele din secțiunea Setări → Confidențialitate
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-amber-800">
                    <span className="font-semibold">Notă:</span> Dezactivarea cookies-urilor
                    esențiale poate afecta funcționarea platformei (ex: nu veți putea să vă
                    autentificați).
                  </p>
                </div>

                <p className="text-gray-700 mt-4">
                  Pentru mai multe detalii, consultați{' '}
                  <Link href="/cookies" className="text-blue-600 hover:underline font-medium">
                    Politica Cookies
                  </Link>
                  .
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section id="transfer" className="scroll-mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Transfer Internațional de Date
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Ne angajăm să procesăm și să stocăm datele dumneavoastră în Spațiul Economic
                  European (SEE) ori de câte ori este posibil.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  9.1. Locația Stocării Datelor
                </h3>
                <div className="bg-blue-50 rounded-lg p-5 border-l-4 border-blue-600 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">🇪🇺</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Date Stocate în Uniunea Europeană
                      </h4>
                      <p className="text-gray-700 text-sm mb-3">
                        Toate datele cu caracter personal sunt stocate în centre de date situate
                        în UE:
                      </p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Bază de date principală: <span className="font-semibold">Frankfurt, Germania</span> (AWS/Supabase)</li>
                        <li>• Backup-uri: <span className="font-semibold">Irlanda</span> (AWS EU-West-1)</li>
                        <li>• Aplicație (CDN): <span className="font-semibold">Vercel Edge Network EU</span></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  9.2. Servicii Terțe și Garanții
                </h3>
                <p className="text-gray-700 mb-4">
                  Utilizăm următorii procesatori de date, toți conformi cu GDPR și cu sediul/servere
                  în UE sau cu garanții adecvate:
                </p>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Serviciu
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Scop
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Locație
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Garanție
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                          Supabase (AWS)
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Bază de date
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          EU (Frankfurt)
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          DPA, SCC
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                          Vercel
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Hosting aplicație
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          EU (Network Edge)
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          DPA, ISO 27001
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                          Resend
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Email transacțional
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          US (AWS Virginia)*
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          DPA, SCC
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                          Twilio
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          SMS/WhatsApp
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          US / Global*
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          DPA, SCC, ISO 27001
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  * Pentru serviciile cu transfer în afara UE, folosim <span className="font-semibold">
                  Clauze Contractuale Standard (SCC)</span> aprobate de Comisia Europeană și
                  implementăm măsuri tehnice suplimentare conform recomandărilor EDPB.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  9.3. Procesatori de Date
                </h3>
                <p className="text-gray-700 mb-3">
                  Am încheiat acorduri de prelucrare a datelor (Data Processing Agreements - DPA)
                  cu toți procesatorii terți, care includ:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Obligații clare privind securitatea și confidențialitatea datelor</li>
                  <li>Restricții privind subcontractarea</li>
                  <li>Drepturi de audit și inspecție</li>
                  <li>Proceduri de notificare a incidentelor de securitate</li>
                  <li>Obligația de ștergere/returnare a datelor la finalizarea contractului</li>
                </ul>
              </div>
            </section>

            {/* Section 10 */}
            <section id="modificari" className="scroll-mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Modificări ale Politicii de Confidențialitate
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Ne rezervăm dreptul de a actualiza această Politică de Confidențialitate
                  periodic pentru a reflecta:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                  <li>Modificări ale legislației aplicabile (GDPR, legi naționale)</li>
                  <li>Schimbări în modul de funcționare a platformei</li>
                  <li>Noi funcționalități sau servicii</li>
                  <li>Îmbunătățiri ale măsurilor de securitate</li>
                  <li>Recomandări ale autorităților de supraveghere</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  10.1. Notificarea Modificărilor
                </h3>
                <div className="bg-blue-50 rounded-lg p-5 border-l-4 border-blue-600 mb-6">
                  <p className="text-gray-700 mb-3">
                    În cazul modificărilor semnificative, vă vom notifica prin:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 text-xl">📧</span>
                      <span>
                        <span className="font-semibold">Email la adresa asociată contului</span>
                        — cu minimum 30 zile înainte de intrarea în vigoare a modificărilor majore
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 text-xl">🔔</span>
                      <span>
                        <span className="font-semibold">Notificare în platformă</span> — banner
                        vizibil la autentificare
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 text-xl">📄</span>
                      <span>
                        <span className="font-semibold">Actualizarea datei</span> — &quot;Ultima
                        actualizare&quot; în antetul acestei pagini
                      </span>
                    </li>
                  </ul>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  10.2. Acceptarea Modificărilor
                </h3>
                <p className="text-gray-700 mb-3">
                  Continuarea utilizării platformei după intrarea în vigoare a modificărilor
                  reprezintă acceptarea acestora.
                </p>
                <p className="text-gray-700">
                  Dacă nu sunteți de acord cu modificările aduse, aveți dreptul să:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 mt-2">
                  <li>Încetați utilizarea platformei</li>
                  <li>Solicitați ștergerea contului și a datelor (cu excepția celor păstrate din obligații legale)</li>
                  <li>Exercitați dreptul de portabilitate pentru a prelua datele</li>
                </ul>

                <div className="bg-gray-50 rounded-lg p-5 mt-6">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Istoric Versiuni
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Menținem un istoric al modificărilor majore ale politicii:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>
                      <span className="font-semibold">v1.0 - 14 februarie 2026:</span> Versiune
                      inițială (lansare platformă)
                    </li>
                    <li className="text-gray-400">
                      <span className="font-semibold">v0.9 - 1 februarie 2026:</span> Versiune
                      beta (testare internă)
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 11 */}
            <section id="dpo" className="scroll-mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Date de Contact DPO (Data Protection Officer)
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Pentru orice întrebări, cereri sau reclamații legate de prelucrarea datelor
                  dumneavoastră cu caracter personal, vă puteți adresa Responsabilului cu
                  Protecția Datelor (DPO):
                </p>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
                      👤
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Responsabil Protecția Datelor
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <span className="text-blue-600 text-lg">📧</span>
                          <div>
                            <p className="text-sm text-gray-600">Email oficial DPO</p>
                            <a
                              href="mailto:dpo@s-s-m.ro"
                              className="text-blue-600 hover:text-blue-700 font-semibold text-lg hover:underline"
                            >
                              dpo@s-s-m.ro
                            </a>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <span className="text-blue-600 text-lg">✉️</span>
                          <div>
                            <p className="text-sm text-gray-600">Adresă poștală</p>
                            <p className="text-gray-700 font-medium">
                              S-S-M Consulting SRL<br />
                              Attn: Data Protection Officer<br />
                              [Adresă Completă Sediu Social]<br />
                              [Cod Poștal], [Oraș], România
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <span className="text-blue-600 text-lg">📱</span>
                          <div>
                            <p className="text-sm text-gray-600">Telefon direct DPO</p>
                            <p className="text-gray-700 font-medium">
                              [Număr Telefon DPO]
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Program: Luni-Vineri, 09:00-17:00
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <span className="text-blue-600 text-lg">🌐</span>
                          <div>
                            <p className="text-sm text-gray-600">Formular online</p>
                            <Link
                              href="/gdpr/request"
                              className="text-blue-600 hover:underline font-medium"
                            >
                              Depune cerere GDPR din platformă
                            </Link>
                            <p className="text-xs text-gray-500 mt-1">
                              Disponibil 24/7, răspuns în max 30 zile
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Când să contactați DPO?
                  </h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600">▸</span>
                      <span>Pentru exercitarea drepturilor GDPR (acces, rectificare, ștergere, etc.)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600">▸</span>
                      <span>Întrebări despre cum sunt procesate datele dumneavoastră</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600">▸</span>
                      <span>Reclamații legate de prelucrarea datelor personale</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600">▸</span>
                      <span>Solicitarea unei copii a datelor (export GDPR)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600">▸</span>
                      <span>Retragerea consimțământului pentru anumite prelucrări</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600">▸</span>
                      <span>Raportarea unui incident de securitate suspectat</span>
                    </li>
                  </ul>
                </div>

                <p className="text-gray-700 mt-6">
                  <span className="font-semibold">Termen de răspuns:</span> Vă vom răspunde în
                  termen de maximum <span className="text-blue-600 font-bold">30 de zile
                  calendaristice</span> de la primirea cererii. În cazuri complexe, acest termen
                  poate fi prelungit cu încă 60 de zile, despre care veți fi informat.
                </p>
              </div>
            </section>

            {/* Section 12 */}
            <section id="anspdcp" className="scroll-mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                12. Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Dacă considerați că drepturile dumneavoastră privind protecția datelor au fost
                  încălcate, aveți dreptul să depuneți o plângere la autoritatea de supraveghere
                  competentă din România:
                </p>

                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-200">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl">
                      🏛️
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        ANSPDCP — Autoritatea Națională de Supraveghere
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Denumire completă</p>
                          <p className="text-gray-900 font-semibold">
                            Autoritatea Națională de Supraveghere a Prelucrării Datelor cu
                            Caracter Personal
                          </p>
                        </div>

                        <div className="flex items-start gap-3">
                          <span className="text-red-600 text-lg">📍</span>
                          <div>
                            <p className="text-sm text-gray-600">Adresă</p>
                            <p className="text-gray-700 font-medium">
                              B-dul G-ral. Gheorghe Magheru 28-30<br />
                              Sector 1, cod poștal 010336<br />
                              București, România
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <span className="text-red-600 text-lg">📞</span>
                          <div>
                            <p className="text-sm text-gray-600">Telefon</p>
                            <p className="text-gray-700 font-medium">
                              +40.318.059.211<br />
                              +40.318.059.212
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <span className="text-red-600 text-lg">📠</span>
                          <div>
                            <p className="text-sm text-gray-600">Fax</p>
                            <p className="text-gray-700 font-medium">
                              +40.318.059.602
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <span className="text-red-600 text-lg">📧</span>
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <a
                              href="mailto:anspdcp@dataprotection.ro"
                              className="text-red-600 hover:text-red-700 font-semibold hover:underline"
                            >
                              anspdcp@dataprotection.ro
                            </a>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <span className="text-red-600 text-lg">🌐</span>
                          <div>
                            <p className="text-sm text-gray-600">Website oficial</p>
                            <a
                              href="https://www.dataprotection.ro"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-600 hover:text-red-700 font-semibold hover:underline"
                            >
                              www.dataprotection.ro
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-5 mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Cum să depuneți o plângere la ANSPDCP?
                  </h4>
                  <ol className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </span>
                      <div>
                        <p className="font-semibold">Încercați rezolvarea cu operatorul mai întâi</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Contactați DPO nostru (dpo@s-s-m.ro) pentru a încerca rezolvarea pe
                          cale amiabilă
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </span>
                      <div>
                        <p className="font-semibold">Pregătiți documentația</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Documentați situația: korespondență cu operatorul, capture ecran, dovezi
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </span>
                      <div>
                        <p className="font-semibold">Depuneți plângerea</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Online pe site-ul ANSPDCP, prin email, poștă sau personal la sediu
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        4
                      </span>
                      <div>
                        <p className="font-semibold">Așteptați răspunsul</p>
                        <p className="text-sm text-gray-600 mt-1">
                          ANSPDCP va investiga și va răspunde conform procedurilor legale
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="bg-gray-50 rounded-lg p-5 mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Informații utile despre plângeri
                  </h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">✓</span>
                      <span>Plângerea poate fi depusă gratuit, fără taxe</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">✓</span>
                      <span>Nu este nevoie de avocat pentru depunerea plângerii</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">✓</span>
                      <span>Plângerea poate fi depusă în limba română sau engleză</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">✓</span>
                      <span>
                        Pe site-ul ANSPDCP există formulare și ghiduri pentru depunerea plângerilor
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">✓</span>
                      <span>
                        ANSPDCP poate dispune măsuri corective și poate aplica amenzi operatorilor
                        care încalcă GDPR
                      </span>
                    </li>
                  </ul>
                </div>

                <p className="text-gray-700 mt-6 font-medium">
                  <span className="text-red-600">Atenție:</span> Depunerea unei plângeri la
                  ANSPDCP nu afectează dreptul dumneavoastră de a introduce o acțiune în justiție
                  împotriva noastră sau a unui alt operator de date.
                </p>
              </div>
            </section>

          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 sm:px-8 lg:px-10 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600 text-center sm:text-left">
                Politică de confidențialitate conformă cu Regulamentul UE 2016/679 (GDPR) și
                Legea 190/2018
              </p>
              <Link
                href="/cookies"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Vezi Politica Cookies →
              </Link>
            </div>
          </div>

        </div>

        {/* Back to Top Button */}
        <div className="flex justify-center mt-8 mb-4">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            ↑ Înapoi sus
          </a>
        </div>
      </main>

      {/* Footer Simple */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
          <p>
            © 2026 S-S-M Consulting SRL. Toate drepturile rezervate.
          </p>
        </div>
      </footer>
    </div>
  );
}
