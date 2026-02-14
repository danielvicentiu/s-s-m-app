/**
 * FAQ Content for s-s-m.ro Platform
 * 30 frequently asked questions organized by category
 */

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'pricing' | 'features' | 'legal' | 'technical';
  relatedLinks: string[];
}

export const faqContent: FAQ[] = [
  // GENERAL (6 questions)
  {
    id: 'what-is-platform',
    question: 'Ce este platforma s-s-m.ro?',
    answer: 'Platforma s-s-m.ro este o soluție digitală completă pentru gestionarea conformității în domeniul Securității și Sănătății în Muncă (SSM) și Prevenirea și Stingerea Incendiilor (PSI). Aceasta a fost dezvoltată special pentru consultanții SSM/PSI și firmele lor din România și alte țări europene (Bulgaria, Ungaria, Germania).\n\nPlatforma centralizează toate procesele critice: gestionarea angajaților, programarea și evidența controalelor medicale, administrarea echipamentelor de protecție, organizarea instruirilor, monitorizarea documentelor și alerte automate pentru termene importante. Totul într-un singur loc, accesibil oricând, de oriunde.\n\nCu peste 20 de ani de experiență în domeniu și peste 100 de clienți activi, platforma oferă o abordare profesională și practică pentru digitizarea completă a activității de consultanță SSM/PSI.',
    category: 'general',
    relatedLinks: ['/features', '/about', '/dashboard']
  },
  {
    id: 'who-is-it-for',
    question: 'Pentru cine este destinată platforma?',
    answer: 'Platforma s-s-m.ro este destinată în primul rând consultanților SSM/PSI independenți sau firmelor de consultanță care gestionează mai mulți clienți simultan. Aceștia beneficiază de instrumente puternice pentru a administra portofoliul lor de clienți, a monitoriza termenele și a genera rapoarte profesionale.\n\nDe asemenea, platforma este ideală pentru administratorii din cadrul firmelor care au responsabilități SSM/PSI și doresc să centralizeze evidența angajaților, controalele medicale, instruirile și echipamentele de protecție. Interfața intuitivă permite gestionarea eficientă chiar și pentru utilizatori fără experiență IT avansată.\n\nAngajații pot accesa platforma pentru a-și vizualiza propriile date: scadențe controale medicale, instruiri programate, echipamente alocate și documente personale, având astfel transparență completă asupra situației lor.',
    category: 'general',
    relatedLinks: ['/pricing', '/features']
  },
  {
    id: 'how-to-register',
    question: 'Cum mă înregistrez pe platformă?',
    answer: 'Procesul de înregistrare este simplu și rapid. Accesați pagina de înregistrare de pe site-ul s-s-m.ro și completați formularul cu adresa dvs. de email și o parolă sigură. Veți primi un email de confirmare pentru a activa contul.\n\nDupă activarea contului, veți putea accesa dashboard-ul și veți fi ghidat prin procesul de configurare inițială: crearea organizației dvs., adăugarea primilor angajați și personalizarea setărilor. Procesul durează aproximativ 5-10 minute.\n\nDacă întâmpinați dificultăți la înregistrare sau aveți nevoie de un cont demo pentru testare, echipa noastră de suport este disponibilă să vă ajute prin email sau telefon.',
    category: 'general',
    relatedLinks: ['/auth/register', '/dashboard', '/support']
  },
  {
    id: 'multilingual-support',
    question: 'Platforma este disponibilă în mai multe limbi?',
    answer: 'Da, platforma s-s-m.ro este multilingvă și suportă cinci limbi europene: română (limba implicită), bulgară, engleză, maghiară și germană. Aceasta este o caracteristică esențială pentru consultanții care lucrează cu firme din multiple țări sau pentru companii internaționale cu subsidiare în Europa de Est.\n\nSchimbarea limbii se face instantaneu din setările contului, fără a pierde datele sau configurările existente. Toate elementele interfeței, mesajele de eroare, notificările și rapoartele generate sunt traduse complet în limba selectată.\n\nFuncționalitatea multilingvă este construită folosind tehnologia next-intl, asigurând traduceri corecte și consecvente în întreaga platformă, inclusiv în documentele generate automat.',
    category: 'general',
    relatedLinks: ['/settings', '/features']
  },
  {
    id: 'mobile-access',
    question: 'Pot accesa platforma de pe telefon sau tabletă?',
    answer: 'Absolut! Platforma s-s-m.ro este complet responsive și optimizată pentru toate dispozitivele: desktop, laptop, tabletă și smartphone. Interfața se adaptează automat la dimensiunea ecranului, oferind o experiență fluidă indiferent de dispozitiv.\n\nPe dispozitivele mobile, veți putea accesa toate funcționalitățile principale: vizualizarea angajaților, verificarea alertelor, programarea controalelor medicale, adăugarea de notițe și încărcarea de documente direct de pe telefon. Acest lucru este extrem de util pentru consultanții care sunt în deplasare sau efectuează vizite la clienți.\n\nNu este necesară instalarea unei aplicații native - simpla accesare a site-ului prin browser-ul dispozitivului mobil este suficientă pentru a avea acces complet la platformă.',
    category: 'general',
    relatedLinks: ['/dashboard', '/features']
  },
  {
    id: 'data-security',
    question: 'Cât de sigure sunt datele mele pe platformă?',
    answer: 'Securitatea datelor este prioritatea noastră numărul unu. Platforma folosește Supabase, o infrastructură enterprise-grade cu certificări de securitate la nivel global. Toate datele sunt criptate în tranzit (HTTPS/TLS) și în repaus (encryption at rest), iar accesul la baza de date este protejat prin Row Level Security (RLS).\n\nFiecare utilizator vede doar datele la care are dreptul de acces, în funcție de rolul său (consultant, administrator firmă sau angajat). Sistemul de autentificare folosește cele mai bune practici din industrie, inclusiv hashing-ul parolelor și protecție împotriva atacurilor brute-force.\n\nÎn plus, implementăm backup-uri automate zilnice, jurnalizare completă a acțiunilor critice (audit log) și monitorizare continuă a securității. Datele sunt stocate în datacenter-uri europene conforme GDPR.',
    category: 'general',
    relatedLinks: ['/security', '/privacy', '/gdpr']
  },

  // PRICING (5 questions)
  {
    id: 'pricing-model',
    question: 'Cât costă utilizarea platformei?',
    answer: 'Platforma s-s-m.ro oferă mai multe planuri de prețuri adaptate diferitelor tipuri de utilizatori. Avem un plan gratuit pentru consultanții care gestionează un număr mic de clienți (până la 50 de angajați), ideal pentru a testa platforma și pentru micii antreprenori.\n\nPlanurile premium încep de la un preț lunar accesibil și oferă funcționalități avansate: număr nelimitat de angajați, rapoarte personalizate, stocare extinsă pentru documente, suport prioritar și API pentru integrări. Prețurile sunt transparente și afișate clar pe pagina de pricing.\n\nPentru consultanții cu portofolii mari de clienți sau firmele de consultanță, oferim planuri enterprise cu funcționalități dedicate și prețuri negociabile. Contactați-ne pentru o ofertă personalizată adaptată nevoilor dvs. specifice.',
    category: 'pricing',
    relatedLinks: ['/pricing', '/contact', '/features']
  },
  {
    id: 'free-trial',
    question: 'Există o perioadă de probă gratuită?',
    answer: 'Da, oferim o perioadă de probă gratuită de 14 zile pentru toate planurile premium, fără a fi necesare detalii de card. În aceste două săptămâni puteți explora complet toate funcționalitățile avansate ale platformei: rapoarte personalizate, alerte automate avansate, integrări API și suport prioritar.\n\nÎn timpul perioadei de probă, veți avea acces la resursele noastre educaționale: tutoriale video, ghiduri pas-cu-pas și sesiuni demo live. Echipa noastră este disponibilă să vă ajute cu configurarea și să răspundă la orice întrebări.\n\nDacă la finalul perioadei de probă decideți că platforma nu se potrivește nevoilor dvs., nu există obligații sau taxe ascunse. Contul va reveni automat la planul gratuit, iar datele vor rămâne salvate.',
    category: 'pricing',
    relatedLinks: ['/pricing', '/register', '/demo']
  },
  {
    id: 'payment-methods',
    question: 'Ce metode de plată sunt acceptate?',
    answer: 'Acceptăm toate metodele de plată populare pentru maximum de flexibilitate: carduri de credit și debit (Visa, Mastercard, American Express), transfer bancar și PayPal. Plățile sunt procesate securizat prin procesatori de plăți certificați PCI-DSS.\n\nAbonamentele se pot plăti lunar sau anual. Dacă alegeți plata anuală, beneficiați de o reducere semnificativă (echivalentul a 2 luni gratuite). După fiecare plată, veți primi automat o factură fiscală pe email, conformă cu legislația românească.\n\nPentru firmele care preferă facturare cu termen de plată sau au proceduri de achiziție specifice, oferim opțiuni personalizate de facturare. Contactați departamentul nostru de vânzări pentru detalii.',
    category: 'pricing',
    relatedLinks: ['/pricing', '/billing', '/contact']
  },
  {
    id: 'cancel-subscription',
    question: 'Pot anula abonamentul oricând?',
    answer: 'Da, puteți anula abonamentul oricând, fără penalități sau taxe de anulare. Anularea se face simplu din secțiunea de Billing din setările contului, cu doar câteva click-uri. Nu trebuie să sunați sau să trimiteți email-uri - aveți control complet.\n\nDacă anulați abonamentul, veți continua să aveți acces la funcționalitățile premium până la finalul perioadei deja plătite. După aceea, contul va reveni automat la planul gratuit, iar datele dvs. rămân în siguranță - nu pierdeți nimic.\n\nÎn cazul în care doriți să reactivați abonamentul în viitor, toate setările și datele vor fi exact așa cum le-ați lăsat. Ne-ar plăcea să aflăm motivul anulării pentru a îmbunătăți serviciul - apreciem orice feedback.',
    category: 'pricing',
    relatedLinks: ['/billing', '/settings', '/support']
  },
  {
    id: 'invoicing',
    question: 'Cum primesc factura pentru abonament?',
    answer: 'După fiecare plată efectuată, veți primi automat o factură fiscală pe adresa de email asociată contului. Factura este conformă cu legislația fiscală românească și conține toate informațiile necesare: serie, număr, date fiscale complete și detalii despre serviciul achiziționat.\n\nÎn secțiunea Billing din dashboard puteți configura datele de facturare (nume firmă, CUI, adresă sediu, J/C) pentru ca facturile să fie emise corect pe compania dvs. De asemenea, puteți descărca facturile anterioare oricând aveți nevoie - sunt stocate permanent în platformă.\n\nPentru clienții enterprise cu nevoi speciale de facturare (facturi proforma, contracte-cadru, ordine de comandă), oferim suport personalizat. Contactați departamentul financiar pentru a discuta cerințele dvs. specifice.',
    category: 'pricing',
    relatedLinks: ['/billing', '/settings', '/contact']
  },

  // FEATURES (8 questions)
  {
    id: 'main-modules',
    question: 'Ce module principale oferă platforma?',
    answer: 'Platforma s-s-m.ro include șase module principale integrate: (1) Gestionarea Angajaților - evidență completă cu date personale, istorice și documente, (2) Controale Medicale - programare, monitorizare scadențe și alerte automate, (3) Instruiri SSM/PSI - planificare, înregistrare prezență și certificate, (4) Echipamente de Protecție - inventar, alocare pe angajați și tracking-ul înlocuirilor.\n\nDe asemenea, platforma include: (5) Management Documente - stocare centralizată, categorii și permisiuni granulare, (6) Alerte și Notificări - sistem avansat de alertare pentru toate termenele critice. Toate modulele sunt interconectate și oferă o imagine de ansamblu completă asupra conformității SSM/PSI.\n\nFiecare modul poate fi accesat individual sau în combinație, oferind flexibilitate maximă. Dashboard-ul principal centralizează toate informațiile importante și oferă acces rapid la toate modulele din meniul lateral.',
    category: 'features',
    relatedLinks: ['/features', '/dashboard', '/modules']
  },
  {
    id: 'medical-tracking',
    question: 'Cum funcționează urmărirea controalelor medicale?',
    answer: 'Modulul de controale medicale este unul dintre cele mai apreciate features ale platformei. Puteți înregistra toate controalele medicale ale angajaților cu date complete: dată control, tip (periodic, la angajare, la reluare), rezultat (apt, apt condiționat, inapt), data următorului control și medic emitent.\n\nPlatforma calculează automat scadențele și generează alerte cu 60, 30 și 7 zile înainte de expirare. Alertele sunt afișate în dashboard, trimise pe email și marcate vizual în interfață. Astfel, nu veți rata niciodată un termen important pentru controalele medicale.\n\nDe asemenea, puteți încărca direct în platformă fișele medicale scanate (PDF sau imagini), asociate fiecărui control. Toate documentele sunt stocate securizat și accesibile doar persoanelor autorizate conform GDPR.',
    category: 'features',
    relatedLinks: ['/dashboard/medical', '/features', '/alerts']
  },
  {
    id: 'training-management',
    question: 'Cum pot organiza și urmări instruirile SSM?',
    answer: 'Modulul de instruiri oferă o soluție completă pentru planificarea, organizarea și înregistrarea instruirilor SSM și PSI. Puteți crea sesiuni de instruire cu toate detaliile: titlu, descriere, tip (SSM, PSI, prim ajutor), dată, locație, instructor și participanți.\n\nÎn timpul sesiunii, puteți înregistra prezența participanților direct din platformă. După finalizare, sistemul generează automat certificate de instruire personalizate pentru fiecare participant, cu toate datele relevante. Certificatele pot fi descărcate în format PDF sau trimise direct pe email.\n\nPlatforma păstrează un istoric complet al tuturor instruirilor pentru fiecare angajat, facilitând auditul și demonstrarea conformității. Rapoartele de instruire pot fi generate rapid pentru inspecții ITM sau audituri interne.',
    category: 'features',
    relatedLinks: ['/dashboard/trainings', '/features', '/reports']
  },
  {
    id: 'equipment-management',
    question: 'Cum gestionez echipamentele de protecție?',
    answer: 'Modulul de echipamente permite crearea unui inventar complet cu toate echipamentele de protecție (EPI): tipul echipamentului, marca, model, normative aplicabile și cantitate în stoc. Fiecare tip de echipament poate avea specificate termene de înlocuire și instrucțiuni de utilizare.\n\nÎn momentul alocării echipamentelor către angajați, platforma înregistrează automat data predării și calculează data înlocuirii conform termenelor stabilite. Alertele automate vă notifică când se apropie termenul de înlocuire pentru echipamente, asigurând că angajații au întotdeauna protecția necesară.\n\nPuteți genera rapid rapoarte cu situația echipamentelor pe angajați, departamente sau întreaga organizație. Acest lucru facilitează inventarierea, bugetarea pentru achiziții noi și demonstrarea conformității în fața autorităților.',
    category: 'features',
    relatedLinks: ['/dashboard/equipment', '/features', '/inventory']
  },
  {
    id: 'alerts-system',
    question: 'Ce tipuri de alerte primesc și cum funcționează?',
    answer: 'Sistemul de alerte este inima platformei s-s-m.ro. Veți primi alerte automate pentru toate termenele critice: controale medicale care expiră în 60/30/7 zile, instruiri care trebuie reprogramate, echipamente care necesită înlocuire, documente care expiră și alte evenimente importante.\n\nAlertele sunt afișate vizibil în dashboard cu badge-uri colorate (roșu pentru urgent, galben pentru avertizare, verde pentru ok). De asemenea, primiți notificări pe email la intervalele configurate. Puteți personaliza preferințele de notificare din setări - alegeți ce alerte doriți să primiți și pe ce canale.\n\nFiecare alertă conține link-uri directe către elementul relevant, permițându-vă să acționați imediat. Alertele rezolvate dispar automat din listă, iar istoricul este păstrat în sistem pentru audit. Acest sistem proactiv vă ajută să fiți întotdeauna cu un pas înainte.',
    category: 'features',
    relatedLinks: ['/dashboard/alerts', '/features', '/notifications']
  },
  {
    id: 'reports-generation',
    question: 'Pot genera rapoarte și statistici?',
    answer: 'Da, platforma oferă un sistem avansat de raportare pentru toate modulele. Puteți genera rapoarte despre angajați (situație generală, pe departamente), controale medicale (pe perioade, pe tip, scadențe), instruiri (participare, certificate emise), echipamente (inventar, alocări, înlocuiri necesare) și multe altele.\n\nRapoartele pot fi exportate în multiple formate: PDF pentru printare sau arhivare, Excel (XLSX) pentru analiză detaliată în Excel sau CSV pentru import în alte sisteme. Toate rapoartele sunt formatate profesional și conțin logo-ul și datele organizației dvs.\n\nPentru clienții planurilor premium, oferim rapoarte personalizate - definiți exact ce date doriți să apară, cum să fie grupate și formatate. Rapoartele pot fi programate să fie generate și trimise automat lunar sau trimestrial.',
    category: 'features',
    relatedLinks: ['/reports', '/features', '/export']
  },
  {
    id: 'document-storage',
    question: 'Cât spațiu am pentru stocare documente?',
    answer: 'Spațiul de stocare depinde de planul ales. Planul gratuit include 1 GB stocare, suficient pentru sute de documente PDF și imagini. Planurile premium oferă între 10 GB și 100 GB, în funcție de nivel, acoperind nevoile majorității consultanților și firmelor.\n\nDocumentele pot fi organizate în categorii și subcategorii personalizate: fișe medicale, certificate instruire, fișe EPI, evaluări risc, proceduri, rapoarte inspecții etc. Fiecare document poate avea asociate metadate (etichete, descriere, dată expirare) pentru căutare rapidă.\n\nSistemul suportă încărcarea directă prin drag-and-drop și acceptă toate formatele comune: PDF, Word, Excel, imagini (JPG, PNG), arhive (ZIP). Toate fișierele sunt scanate automat pentru viruși și stocate criptat. Pentru nevoi de stocare mai mari, contactați-ne pentru soluții enterprise.',
    category: 'features',
    relatedLinks: ['/documents', '/storage', '/pricing']
  },
  {
    id: 'multi-organization',
    question: 'Pot gestiona mai multe organizații din același cont?',
    answer: 'Absolut! Această funcționalitate este esențială pentru consultanții SSM care gestionează multiple firme cliente. Din același cont, puteți crea și administra un număr nelimitat de organizații (în funcție de planul ales), fiecare cu propriii angajați, date și configurări.\n\nSchimbarea între organizații se face instant dintr-un selector din header - un singur click și treceți la o altă firmă client. Fiecare organizație este complet izolată - datele nu se amestecă și fiecare are propriile setări, utilizatori și permisiuni.\n\nAceastă arhitectură vă permite să oferiți acces direct clienților dvs. la datele lor, păstrând în același timp control complet. Puteți avea rol de consultant la o organizație și rol de simplu angajat la alta, oferind flexibilitate maximă.',
    category: 'features',
    relatedLinks: ['/organizations', '/features', '/multi-tenant']
  },

  // LEGAL (6 questions)
  {
    id: 'gdpr-compliance',
    question: 'Platforma este conformă cu GDPR?',
    answer: 'Da, platforma s-s-m.ro este complet conformă cu Regulamentul General privind Protecția Datelor (GDPR). Implementăm toate principiile GDPR: minimizarea datelor (colectăm doar ce este necesar), limitarea scopului (datele sunt folosite doar pentru SSM/PSI), acuratețea datelor și limitarea stocării.\n\nOficiul pentru Protecția Datelor Personale (DPO) poate fi contactat pentru orice întrebare legată de prelucrarea datelor. Avem implementate mecanisme tehnice și organizaționale pentru protejarea datelor: criptare, control acces, pseudonimizare unde e posibil, backup-uri și planuri de răspuns la incidente.\n\nAngajații ale căror date sunt stocate în platformă au toate drepturile GDPR: dreptul de acces, rectificare, ștergere (dreptul de a fi uitat), restricționare prelucrare, portabilitate date și opoziție. Aceste drepturi pot fi exercitate direct din platformă sau prin contact cu administratorul.',
    category: 'legal',
    relatedLinks: ['/privacy', '/gdpr', '/data-protection']
  },
  {
    id: 'data-export',
    question: 'Pot exporta toate datele mele din platformă?',
    answer: 'Da, conform Articolului 15 și 20 din GDPR (dreptul la portabilitate), puteți exporta complet toate datele dvs. din platformă oricând doriți. Funcția de export se găsește în secțiunea Setări și generează un arhiv complet cu toate informațiile.\n\nExportul include toate datele structurate (angajați, controale medicale, instruiri, echipamente, organizații) în format JSON și CSV, perfect pentru import în alte sisteme. De asemenea, sunt incluse toate documentele încărcate în formatul lor original (PDF, imagini, etc.).\n\nProcesul de export durează câteva minute, în funcție de volumul datelor. Veți primi o notificare când arhivul este gata de descărcare. Arhivul este disponibil 7 zile și apoi este șters automat din motive de securitate. Puteți iniția un nou export oricând.',
    category: 'legal',
    relatedLinks: ['/export', '/gdpr', '/data-portability']
  },
  {
    id: 'data-deletion',
    question: 'Ce se întâmplă cu datele mele dacă îmi șterg contul?',
    answer: 'Dacă decideți să ștergeți contul, aveți control complet asupra datelor. În procesul de ștergere, puteți alege între: (1) ștergere completă imediată - toate datele sunt șterse permanent și irecuperabil în maxim 30 de zile, (2) arhivare temporară - datele sunt păstrate 90 de zile în caz că vă răzgândiți, apoi șterse automat.\n\nÎnainte de ștergere, vă recomandăm să exportați toate datele folosind funcția de export GDPR. Odată inițiat procesul de ștergere definitivă, acesta nu poate fi anulat - datele sunt suprascrise conform standardelor de securitate și nu pot fi recuperate.\n\nDatele de facturare și istoricul de plăți sunt păstrate conform obligațiilor legale fiscale (5-10 ani, în funcție de legislație), dar sunt complet anonimizate și deconectate de contul dvs. operațional.',
    category: 'legal',
    relatedLinks: ['/account-deletion', '/gdpr', '/data-retention']
  },
  {
    id: 'terms-of-service',
    question: 'Care sunt termenii și condițiile de utilizare?',
    answer: 'Termenii și condițiile complete sunt disponibili pe pagina dedicată și acoperă toate aspectele utilizării platformei: drepturile și obligațiile utilizatorilor, limitările de răspundere, proprietatea intelectuală, confidențialitatea datelor și procedurile de rezolvare a disputelor.\n\nÎn esență, platforma este oferită "as-is" pentru scopuri de conformitate SSM/PSI. Vă obligați să folosiți platforma în mod legal, să nu introduceți conținut ilegal sau dăunător și să respectați drepturile altor utilizatori. Noi ne obligăm să menținem serviciul disponibil, securizat și conform cu legislația aplicabilă.\n\nTermenii pot fi actualizați periodic pentru a reflecta schimbări legislative sau ale serviciului. Utilizatorii activi sunt notificați cu 30 de zile înainte de intrarea în vigoare a unor modificări semnificative. Continuarea utilizării după notificare constituie acceptare a noilor termeni.',
    category: 'legal',
    relatedLinks: ['/terms', '/privacy', '/legal']
  },
  {
    id: 'liability',
    question: 'Cine este responsabil pentru acuratețea datelor introduse?',
    answer: 'Responsabilitatea pentru acuratețea și completitudinea datelor introduse în platformă revine utilizatorilor care introduc aceste date - consultanții SSM/PSI, administratorii de firmă sau angajații, în funcție de permisiunile lor. Platforma este un instrument tehnic de stocare și organizare, nu validează conținutul medical sau legal al informațiilor.\n\nDe exemplu, dacă introduceți date incorecte despre un control medical (dată greșită, rezultat greșit), responsabilitatea pentru această eroare este a dvs. ca utilizator, nu a platformei. Recomandăm verificarea atentă a tuturor datelor înainte de salvare și audit periodic al informațiilor stocate.\n\nÎn schimb, platforma își asumă responsabilitatea pentru: securitatea datelor, disponibilitatea serviciului conform SLA promis, funcționarea corectă a alertelor automate și respectarea conformității GDPR. Pentru orice erori tehnice ale platformei, oferim suport rapid și, unde e cazul, compensații conform termenilor de serviciu.',
    category: 'legal',
    relatedLinks: ['/terms', '/liability', '/support']
  },
  {
    id: 'audit-compliance',
    question: 'Platforma ajută la pregătirea pentru inspecții ITM?',
    answer: 'Da, unul dintre scopurile principale ale platformei este facilitarea demonstrării conformității în fața Inspecției Muncii (ITM) sau altor autorități. Toate datele sunt organizate structured și pot fi exportate rapid în rapoarte formale pentru prezentare la inspecții.\n\nPuteți genera instant rapoarte cu: situația controalelor medicale (pe perioade, pe departamente), istoricul instruirilor (cu liste de prezență și certificate), evidența echipamentelor de protecție alocate, documentele de evaluare a riscurilor și orice alte informații solicitate de inspectori.\n\nSistemul de audit log înregistrează automat toate acțiunile importante (cine a făcut ce și când), oferind trasabilitate completă. Acest istoric nu poate fi modificat și demonstrează conformitatea continuă. Multe dintre rapoartele noastre standard sunt concepute specific pentru a îndeplini cerințele ITM.',
    category: 'legal',
    relatedLinks: ['/compliance', '/reports', '/audit']
  },

  // TECHNICAL (5 questions)
  {
    id: 'browser-support',
    question: 'Ce browsere sunt suportate?',
    answer: 'Platforma s-s-m.ro funcționează optim pe toate browserele moderne: Google Chrome (recomandat), Mozilla Firefox, Microsoft Edge, Safari și Opera. Recomandăm utilizarea ultimelor versiuni ale acestor browsere pentru performanță și securitate maximă.\n\nCerințe minime: JavaScript activat, cookies permise (necesare pentru autentificare) și o conexiune stabilă la internet. Platforma nu necesită instalarea de plugin-uri sau extensii suplimentare - totul funcționează direct în browser.\n\nPentru Internet Explorer, suportul este limitat datorită tehnologiilor învechite. Dacă sunteți forțat să folosiți IE din motive de politică corporativă, vă recomandăm să discutați cu departamentul IT despre trecerea la Edge, care este browserul oficial Microsoft și oferă compatibilitate completă.',
    category: 'technical',
    relatedLinks: ['/system-requirements', '/support']
  },
  {
    id: 'data-backup',
    question: 'Cât de des sunt făcute backup-uri pentru date?',
    answer: 'Siguranța datelor dvs. este garantată prin multiple straturi de protecție. Backup-uri complete automate sunt realizate zilnic, stocate în locații geografice separate pentru protecție împotriva dezastrelor. În plus, există backup-uri incrementale la fiecare 6 ore pentru a minimiza pierderea de date în caz de incident.\n\nToate backup-urile sunt criptate cu algoritmi de nivel militar și păstrate conform unei politici de retenție: backup-uri zilnice pentru ultima lună, săptămânale pentru ultimele 3 luni și lunare pentru ultimul an. Acest lucru permite restaurarea datelor din orice punct din trecut.\n\nÎn cazul extrem de puțin probabil al unei defecțiuni majore a sistemului, timpul maxim de recuperare (RTO) este de 4 ore și pierderea maximă de date (RPO) este de 6 ore. Testăm regulat procedurile de restaurare pentru a asigura funcționarea lor.',
    category: 'technical',
    relatedLinks: ['/backup', '/reliability', '/security']
  },
  {
    id: 'api-integration',
    question: 'Oferă platforma API pentru integrări cu alte sisteme?',
    answer: 'Da, planurile premium și enterprise includ acces la API-ul RESTful al platformei. API-ul permite integrarea cu sistemele dvs. existente: software de HR, platforme de payroll, sisteme ERP sau aplicații custom. Documentația completă API este disponibilă pentru dezvoltatori.\n\nPrincipalele funcționalități API includ: citire și creare angajați, programare controale medicale, înregistrare instruiri, gestionare documente și multe altele. API-ul folosește autentificare OAuth 2.0 pentru securitate maximă și returnează date în format JSON standard.\n\nPentru integrări complexe sau personalizate, echipa noastră tehnică poate oferi consultanță și suport. De asemenea, putem dezvolta conectori specifici pentru sistemele populare folosite în România (Revisal, REGES, etc.) - contactați departamentul tehnic pentru detalii.',
    category: 'technical',
    relatedLinks: ['/api', '/integrations', '/developers']
  },
  {
    id: 'uptime-sla',
    question: 'Care este timpul de funcționare garantat (uptime)?',
    answer: 'Platforma s-s-m.ro este construită pe infrastructură Vercel și Supabase enterprise, oferind disponibilitate de 99.9% uptime pentru planurile premium (echivalentul a maxim 43 de minute downtime pe lună). Pentru planurile enterprise, oferim SLA de 99.95% uptime cu compensații financiare în caz de nerespectare.\n\nAcest nivel de disponibilitate este asigurat prin: arhitectură redundantă (multiple servere în diverse locații), load balancing automat, monitorizare 24/7 cu alerte automate și echipă de intervenție rapidă. Majoritatea actualizărilor și mentenanțelor sunt făcute fără downtime (zero-downtime deployments).\n\nStarea în timp real a sistemului poate fi verificată oricând pe pagina de status. În cazul unor incidente, publicăm actualizări transparente despre cauză, impact și progres în rezolvare. Istoricul complet al uptime-ului este public și verificabil.',
    category: 'technical',
    relatedLinks: ['/status', '/sla', '/reliability']
  },
  {
    id: 'technical-support',
    question: 'Ce tip de suport tehnic primiți?',
    answer: 'Oferim suport tehnic pe multiple canale, adaptat planului dvs. Planul gratuit include suport prin email cu răspuns în maxim 48 de ore în zile lucrătoare. Planurile premium beneficiază de suport prioritar prin email și chat live, cu răspuns în maxim 4 ore.\n\nPlanurile enterprise au acces la suport telefonic direct, manager de cont dedicat și asistență la implementare/migrare. Pentru probleme critice care afectează operațiunile, oferim suport de urgență 24/7 cu timp de răspuns de maxim 1 oră.\n\nÎn plus, baza noastră de cunoștințe include zeci de articole, tutoriale video pas-cu-pas și ghiduri detaliate pentru toate funcționalitățile. Majoritatea întrebărilor comune pot fi rezolvate rapid prin consultarea acestor resurse disponibile 24/7.',
    category: 'technical',
    relatedLinks: ['/support', '/knowledge-base', '/contact']
  }
];

export default faqContent;
