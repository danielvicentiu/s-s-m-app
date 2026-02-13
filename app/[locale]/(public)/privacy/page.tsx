import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Politica de Confidențialitate | s-s-m.ro',
  description: 'Politica de confidențialitate și protecția datelor personale conform GDPR pentru platforma s-s-m.ro',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              s-s-m.ro
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Autentificare
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Title Section */}
          <div className="mb-12">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">
              Politica de Confidențialitate
            </h1>
            <p className="text-lg text-gray-600">
              Ultima actualizare: 13 februarie 2026
            </p>
            <p className="mt-4 text-gray-700">
              Prezenta Politică de Confidențialitate descrie modalitatea în care s-s-m.ro
              (denumită în continuare „Platforma", „noi" sau „ne") colectează, utilizează,
              stochează și protejează datele cu caracter personal ale utilizatorilor săi,
              în conformitate cu Regulamentul General privind Protecția Datelor (GDPR) –
              Regulamentul (UE) 2016/679.
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-10">
            {/* Section 1: Date Colectate */}
            <section className="rounded-2xl bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                1. Date cu Caracter Personal Colectate
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  În funcție de modul în care utilizați Platforma, colectăm următoarele
                  categorii de date personale:
                </p>

                <div className="ml-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">Date de identificare:</h3>
                    <p className="ml-4">
                      Nume, prenume, CNP, număr document identitate, adresă email, număr telefon,
                      adresă de corespondență.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Date profesionale:</h3>
                    <p className="ml-4">
                      Funcție, departament, organizație angajatoare, calificări profesionale,
                      autorizații SSM/PSI.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Date medicale:</h3>
                    <p className="ml-4">
                      Informații din avizele medicale de medicina muncii (aptitudine, restricții,
                      contraindicații), istoric medical ocupațional, date despre accidente de muncă
                      sau boli profesionale (conform legislației SSM).
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Date despre instruiri:</h3>
                    <p className="ml-4">
                      Participare la instruiri SSM/PSI, evaluări, certificate obținute,
                      prezență la cursuri.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Date tehnice:</h3>
                    <p className="ml-4">
                      Adresă IP, tip browser, sistem de operare, cookie-uri, date de logare
                      (timestamp, acțiuni efectuate în platformă).
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Date despre echipamente și utilaje:</h3>
                    <p className="ml-4">
                      Verificări tehnice, certificate de conformitate, rapoarte de inspecție.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Scopuri */}
            <section className="rounded-2xl bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                2. Scopurile Prelucrării Datelor
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>Prelucrăm datele dumneavoastră personale pentru următoarele scopuri:</p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>
                    <strong>Furnizarea serviciilor de consultanță SSM/PSI:</strong> gestionarea
                    dosarelor de securitate și sănătate în muncă, prevenirea incendiilor,
                    monitorizarea conformității cu legislația în vigoare.
                  </li>
                  <li>
                    <strong>Gestionarea conturilor utilizatorilor:</strong> autentificare,
                    autorizare, resetare parolă, gestionarea profilului.
                  </li>
                  <li>
                    <strong>Respectarea obligațiilor legale:</strong> raportări către ITM
                    (Inspectoratul Teritorial de Muncă), ISU (Inspectoratul pentru Situații
                    de Urgență), alte autorități competente.
                  </li>
                  <li>
                    <strong>Monitorizarea obligațiilor angajatorului:</strong> scadențe avize
                    medicale, instruiri periodice, verificări tehnice echipamente.
                  </li>
                  <li>
                    <strong>Comunicare și suport:</strong> notificări despre scadențe, alerte,
                    asistență tehnică, răspunsuri la solicitări.
                  </li>
                  <li>
                    <strong>Îmbunătățirea platformei:</strong> analiză statistică anonimizată,
                    optimizare funcționalități, audit de securitate.
                  </li>
                  <li>
                    <strong>Evidența accidentelor de muncă și incidentelor:</strong> raportare
                    conform Legii 319/2006 și alte acte normative SSM.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3: Baza Legală */}
            <section className="rounded-2xl bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                3. Baza Legală a Prelucrării
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>Prelucrăm datele dumneavoastră pe baza următoarelor temeiuri legale:</p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>
                    <strong>Executarea unui contract:</strong> furnizarea serviciilor de
                    consultanță SSM/PSI către organizația dumneavoastră (art. 6 alin. 1 lit. b GDPR).
                  </li>
                  <li>
                    <strong>Obligații legale:</strong> respectarea Legii 319/2006 (SSM),
                    Legii 307/2006 (PSI), HG 1425/2006, și alte acte normative în vigoare
                    (art. 6 alin. 1 lit. c GDPR).
                  </li>
                  <li>
                    <strong>Consimțământ explicit:</strong> pentru prelucrarea datelor medicale
                    sensibile, în scopul monitorizării sănătății în muncă (art. 9 alin. 2 lit. a GDPR).
                  </li>
                  <li>
                    <strong>Interes legitim:</strong> îmbunătățirea platformei, securitatea
                    sistemelor informatice, prevenirea fraudei (art. 6 alin. 1 lit. f GDPR).
                  </li>
                  <li>
                    <strong>Protecția intereselor vitale:</strong> în cazul situațiilor de urgență
                    sau accidentelor grave de muncă (art. 6 alin. 1 lit. d GDPR).
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 4: Destinatari */}
            <section className="rounded-2xl bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                4. Destinatarii Datelor
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Datele dumneavoastră personale pot fi dezvăluite următoarelor categorii
                  de destinatari:
                </p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>
                    <strong>Consultanți SSM/PSI autorizați:</strong> care gestionează dosarul
                    organizației dumneavoastră.
                  </li>
                  <li>
                    <strong>Administratori organizație:</strong> persoane desemnate de angajator
                    pentru gestionarea evidenței SSM/PSI.
                  </li>
                  <li>
                    <strong>Autorități competente:</strong> ITM, ISU, INSP (Institutul Național
                    de Sănătate Publică), în cazul controalelor sau raportărilor obligatorii.
                  </li>
                  <li>
                    <strong>Furnizori de servicii IT:</strong> Supabase (hosting bază de date),
                    Vercel (hosting aplicație), servicii de email (notificări), care acționează
                    ca persoane împuternicite și sunt obligați prin contract să respecte GDPR.
                  </li>
                  <li>
                    <strong>Medici de medicina muncii:</strong> pentru consultarea avizelor
                    medicale în format digital (cu consimțământul dumneavoastră).
                  </li>
                  <li>
                    <strong>Terțe părți:</strong> doar în cazuri justificate legal (ordine judecătorești,
                    solicitări de la autorități în cadrul competențelor lor).
                  </li>
                </ul>
                <p className="mt-4">
                  <strong>Nu vindem, nu închiriem și nu comercializăm datele dumneavoastră
                  personale către terți.</strong>
                </p>
              </div>
            </section>

            {/* Section 5: Transfer Internațional */}
            <section className="rounded-2xl bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                5. Transfer Internațional de Date
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Datele dumneavoastră pot fi transferate și stocate în afara Spațiului
                  Economic European (SEE) în următoarele situații:
                </p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>
                    <strong>Supabase (SUA/UE):</strong> furnizorul nostru de bază de date
                    utilizează centre de date în SEE și SUA. Transferurile către SUA sunt
                    realizate pe baza Clauzelor Contractuale Standard (SCC) aprobate de
                    Comisia Europeană.
                  </li>
                  <li>
                    <strong>Vercel (SUA):</strong> platformă de hosting care respectă GDPR
                    și utilizează SCC pentru transferuri internaționale.
                  </li>
                  <li>
                    <strong>Servicii de email:</strong> pot utiliza servere situate în SUA,
                    protejate prin SCC.
                  </li>
                </ul>
                <p className="mt-4">
                  Asigurăm că toate transferurile internaționale de date sunt realizate în
                  conformitate cu Capitolul V din GDPR, prin aplicarea garanțiilor adecvate
                  (SCC, certificări de confidențialitate, evaluări de impact).
                </p>
              </div>
            </section>

            {/* Section 6: Retenție */}
            <section className="rounded-2xl bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                6. Perioada de Retenție a Datelor
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Păstrăm datele dumneavoastră personale doar atât timp cât este necesar
                  pentru îndeplinirea scopurilor pentru care au fost colectate:
                </p>
                <div className="ml-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">Date de cont:</h3>
                    <p className="ml-4">
                      Pe durata contractului de servicii + 3 ani după încetare (arhivare).
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Avize medicale:</h3>
                    <p className="ml-4">
                      Minim 5 ani de la încetarea raporturilor de muncă (conform Legii 319/2006).
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Fișe de instruire SSM/PSI:</h3>
                    <p className="ml-4">
                      Minim 5 ani (conform HG 1425/2006).
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Rapoarte accidente de muncă:</h3>
                    <p className="ml-4">
                      Minim 50 ani (conform Legii 319/2006, art. 27).
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Date tehnice (loguri):</h3>
                    <p className="ml-4">
                      Maximum 12 luni (pentru audit și securitate).
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Documente fiscale/contractuale:</h3>
                    <p className="ml-4">
                      10 ani (conform legislației fiscale).
                    </p>
                  </div>
                </div>
                <p className="mt-4">
                  După expirarea perioadei de retenție, datele sunt șterse definitiv sau
                  anonimizate ireversibil.
                </p>
              </div>
            </section>

            {/* Section 7: Drepturi GDPR */}
            <section className="rounded-2xl bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                7. Drepturile Dumneavoastră conform GDPR
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  În calitate de persoană vizată, aveți următoarele drepturi în relație
                  cu datele dumneavoastră personale:
                </p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>
                    <strong>Dreptul de acces (art. 15 GDPR):</strong> puteți solicita o copie
                    a datelor personale pe care le deținem despre dumneavoastră.
                  </li>
                  <li>
                    <strong>Dreptul la rectificare (art. 16 GDPR):</strong> puteți solicita
                    corectarea datelor inexacte sau incomplete.
                  </li>
                  <li>
                    <strong>Dreptul la ștergerea datelor / „dreptul de a fi uitat" (art. 17 GDPR):</strong>{' '}
                    puteți solicita ștergerea datelor în anumite condiții (de ex., când datele
                    nu mai sunt necesare sau consimțământul este retras).
                  </li>
                  <li>
                    <strong>Dreptul la restricționarea prelucrării (art. 18 GDPR):</strong>{' '}
                    puteți solicita limitarea prelucrării în anumite situații.
                  </li>
                  <li>
                    <strong>Dreptul la portabilitatea datelor (art. 20 GDPR):</strong> puteți
                    primi datele într-un format structurat, utilizat în mod curent și care
                    poate fi citit automat.
                  </li>
                  <li>
                    <strong>Dreptul de opoziție (art. 21 GDPR):</strong> puteți obiecta la
                    prelucrarea datelor bazată pe interes legitim.
                  </li>
                  <li>
                    <strong>Dreptul de a nu face obiectul unei decizii automatizate (art. 22 GDPR):</strong>{' '}
                    Platforma nu utilizează profilare automată sau luare de decizii exclusiv
                    automată cu efecte juridice semnificative.
                  </li>
                  <li>
                    <strong>Dreptul de a retrage consimțământul:</strong> în cazul prelucrărilor
                    bazate pe consimțământ, puteți retrage consimțământul oricând, fără a
                    afecta legalitatea prelucrărilor efectuate anterior.
                  </li>
                  <li>
                    <strong>Dreptul de a depune o plângere:</strong> puteți depune o plângere
                    la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter
                    Personal (ANSPDCP) – www.dataprotection.ro.
                  </li>
                </ul>
                <p className="mt-4">
                  Pentru exercitarea acestor drepturi, vă rugăm să ne contactați la adresa
                  de email indicată în secțiunea „Contact DPO".
                </p>
              </div>
            </section>

            {/* Section 8: Cookies */}
            <section className="rounded-2xl bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                8. Cookie-uri și Tehnologii Similare
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Platforma utilizează cookie-uri și tehnologii similare pentru funcționarea
                  optimă și îmbunătățirea experienței utilizatorului:
                </p>
                <div className="ml-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">Cookie-uri esențiale:</h3>
                    <p className="ml-4">
                      Necesare pentru autentificare, gestionarea sesiunii, securitatea platformei
                      (nu necesită consimțământ separat, sunt strict necesare).
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Cookie-uri de performanță:</h3>
                    <p className="ml-4">
                      Colectează informații anonime despre modul de utilizare a platformei
                      (statistici agregate, fără identificare personală).
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Cookie-uri de preferințe:</h3>
                    <p className="ml-4">
                      Memorează setările dumneavoastră (limba, aspect interfață).
                    </p>
                  </div>
                </div>
                <p className="mt-4">
                  Puteți gestiona preferințele cookie-urilor din setările browser-ului.
                  Dezactivarea cookie-urilor esențiale poate afecta funcționalitatea platformei.
                </p>
                <p className="mt-2">
                  <strong>Nu utilizăm cookie-uri de marketing sau publicitate terță parte.</strong>
                </p>
              </div>
            </section>

            {/* Section 9: Securitate */}
            <section className="rounded-2xl bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                9. Măsuri de Securitate
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Implementăm măsuri tehnice și organizatorice adecvate pentru protejarea
                  datelor dumneavoastră personale împotriva accesului neautorizat, pierderii,
                  distrugerii sau alterării:
                </p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>Criptare în tranzit (HTTPS/TLS) și în repaus (database encryption).</li>
                  <li>Autentificare securizată cu parole criptate (bcrypt/Argon2).</li>
                  <li>Row-Level Security (RLS) activat pe toate tabelele Supabase.</li>
                  <li>Backup-uri automate și redundanță a datelor.</li>
                  <li>Monitorizare continuă, loguri de audit, detectare intruziuni.</li>
                  <li>Acces restrictiv bazat pe roluri (RBAC) — doar personalul autorizat.</li>
                  <li>Testare periodică de securitate (penetration testing).</li>
                  <li>Politici interne de confidențialitate și instruire personal.</li>
                </ul>
                <p className="mt-4">
                  În cazul unei încălcări a securității datelor personale cu risc ridicat,
                  vom notifica ANSPDCP în termen de 72 ore și, dacă este necesar, persoanele
                  afectate, conform art. 33-34 GDPR.
                </p>
              </div>
            </section>

            {/* Section 10: DPO Contact */}
            <section className="rounded-2xl bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                10. Responsabil cu Protecția Datelor (DPO)
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Pentru orice întrebări legate de prelucrarea datelor personale, exercitarea
                  drepturilor GDPR sau sesizarea unui incident de securitate, vă puteți
                  adresa Responsabilului cu Protecția Datelor:
                </p>
                <div className="mt-4 rounded-lg bg-blue-50 p-6">
                  <p className="font-semibold text-gray-900">Responsabil Protecția Datelor (DPO)</p>
                  <p className="mt-2">
                    <strong>Email:</strong>{' '}
                    <a href="mailto:dpo@s-s-m.ro" className="text-blue-600 hover:underline">
                      dpo@s-s-m.ro
                    </a>
                  </p>
                  <p className="mt-1">
                    <strong>Adresă poștală:</strong> [Adresa completă a operatorului]
                  </p>
                  <p className="mt-1">
                    <strong>Telefon suport:</strong> [Număr telefon contact]
                  </p>
                </div>
                <p className="mt-4">
                  Vom răspunde solicitărilor dumneavoastră în termen de maximum 30 zile
                  calendaristice de la primirea cererii (conform art. 12 alin. 3 GDPR).
                </p>
              </div>
            </section>

            {/* Section 11: Minori */}
            <section className="rounded-2xl bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                11. Protecția Datelor Minorilor
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Platforma s-s-m.ro este destinată exclusiv utilizatorilor cu vârsta de
                  peste 16 ani (vârsta minimă pentru angajare în România cu restricții).
                </p>
                <p>
                  În cazul în care prelucrăm date ale minorilor (de ex., tineri angajați
                  cu vârsta 16-18 ani), solicităm consimțământul părinților/tutorilor legali
                  pentru prelucrarea datelor medicale și respectăm legislația muncii privind
                  protecția tinerilor la locul de muncă (Legea 53/2003).
                </p>
                <p>
                  Dacă identificăm că am colectat date ale unui minor fără consimțământ
                  legal adecvat, vom șterge aceste date cât mai curând posibil.
                </p>
              </div>
            </section>

            {/* Section 12: Modificări */}
            <section className="rounded-2xl bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                12. Modificări ale Politicii de Confidențialitate
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Ne rezervăm dreptul de a actualiza sau modifica prezenta Politică de
                  Confidențialitate periodic, pentru a reflecta schimbările legislative,
                  îmbunătățirile platformei sau evoluția practicilor de prelucrare a datelor.
                </p>
                <p>
                  Orice modificare semnificativă va fi comunicată utilizatorilor prin:
                </p>
                <ul className="ml-6 list-disc space-y-1">
                  <li>Notificare în platforma (banner sau alertă în dashboard).</li>
                  <li>Email către adresa de contact înregistrată.</li>
                  <li>Actualizarea datei „Ultima actualizare" de la începutul acestui document.</li>
                </ul>
                <p className="mt-4">
                  Vă recomandăm să consultați periodic această pagină pentru a fi la curent
                  cu eventualele modificări.
                </p>
              </div>
            </section>

            {/* Footer Section */}
            <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white shadow-sm">
              <h2 className="mb-4 text-2xl font-bold">
                Contact și Asistență
              </h2>
              <p className="mb-4">
                Pentru întrebări despre prezenta Politică de Confidențialitate sau despre
                modul în care prelucrăm datele dumneavoastră personale, nu ezitați să ne
                contactați:
              </p>
              <div className="space-y-2">
                <p>
                  <strong>Email DPO:</strong>{' '}
                  <a href="mailto:dpo@s-s-m.ro" className="underline hover:text-blue-100">
                    dpo@s-s-m.ro
                  </a>
                </p>
                <p>
                  <strong>Suport tehnic:</strong>{' '}
                  <a href="mailto:support@s-s-m.ro" className="underline hover:text-blue-100">
                    support@s-s-m.ro
                  </a>
                </p>
                <p>
                  <strong>Website:</strong>{' '}
                  <a href="https://app.s-s-m.ro" className="underline hover:text-blue-100">
                    https://app.s-s-m.ro
                  </a>
                </p>
              </div>
              <div className="mt-6 border-t border-blue-500 pt-6">
                <p className="text-sm">
                  <strong>Autoritate de supraveghere:</strong> Autoritatea Națională de
                  Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP)
                </p>
                <p className="mt-2 text-sm">
                  Website:{' '}
                  <a
                    href="https://www.dataprotection.ro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-100"
                  >
                    www.dataprotection.ro
                  </a>
                </p>
              </div>
            </section>
          </div>

          {/* Back to Home */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 hover:underline"
            >
              ← Înapoi la pagina principală
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-white py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© 2026 s-s-m.ro — Platformă SSM/PSI digitală</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy" className="hover:text-blue-600 hover:underline">
              Politica de Confidențialitate
            </Link>
            <Link href="/terms" className="hover:text-blue-600 hover:underline">
              Termeni și Condiții
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
