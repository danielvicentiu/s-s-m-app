/**
 * FAQ Content - Multi-language Frequently Asked Questions
 * 30 questions across 6 categories, available in 6 languages
 */

export type FaqCategory = 'general' | 'pricing' | 'features' | 'security' | 'legal' | 'technical';

export interface FaqItem {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
}

export interface FaqContent {
  ro: FaqItem[];
  en: FaqItem[];
  bg: FaqItem[];
  hu: FaqItem[];
  de: FaqItem[];
  fr: FaqItem[];
}

export const faqContent: FaqContent = {
  // ROMANIAN
  ro: [
    // General (5)
    {
      id: 'general-1',
      category: 'general',
      question: 'Ce este platforma s-s-m.ro?',
      answer: 'Platforma s-s-m.ro este o soluție digitală completă pentru gestionarea conformității SSM (Securitate și Sănătate în Muncă) și PSI (Prevenire și Stingere Incendii). Oferim instrumente pentru consultanți SSM și firmele lor din România, Bulgaria, Ungaria și Germania. Platforma digitizează procesele de compliance, evidență personal, documente legale, instruire și inspecții. Totul este disponibil 24/7 din orice locație cu acces internet.',
    },
    {
      id: 'general-2',
      category: 'general',
      question: 'Cine poate folosi această platformă?',
      answer: 'Platforma este destinată consultanților SSM/PSI certificați și companiilor pe care le deservesc. Consultanții pot gestiona multiple organizații și angajați dintr-un singur cont. Administratorii de companie pot monitoriza conformitatea și accesa rapoarte. Angajații pot vizualiza instruirile, controalele medicale și echipamentele alocate. Fiecare rol are permisiuni specifice configurabile.',
    },
    {
      id: 'general-3',
      category: 'general',
      question: 'În ce țări funcționează platforma?',
      answer: 'Platforma funcționează în România, Bulgaria, Ungaria și Germania, cu suport complet pentru legislația locală din fiecare țară. Interfața este disponibilă în limbile română, engleză, bulgară, maghiară și germană. Toate documentele și rapoartele respectă cerințele legale specifice fiecărei jurisdicții. Planificăm extinderea în alte țări europene în viitor.',
    },
    {
      id: 'general-4',
      category: 'general',
      question: 'Cum mă pot înregistra și începe să folosesc platforma?',
      answer: 'Înregistrarea este simplă și rapidă: accesați app.s-s-m.ro și creați un cont cu email și parolă. După activarea contului prin email, completați profilul consultantului sau al companiei. Puteți adăuga organizații, angajați și începe să configurați modulele necesare imediat. Oferim și o perioadă de probă gratuită pentru a testa toate funcționalitățile.',
    },
    {
      id: 'general-5',
      category: 'general',
      question: 'Pot migra datele existente în platformă?',
      answer: 'Da, oferim suport complet pentru migrarea datelor existente din Excel, PDF sau alte sisteme. Echipa noastră vă poate ajuta să importați registre de angajați, istoric instruiri, controale medicale și documente existente. Procesul de migrare este securizat și verificat pentru acuratețe. Datele sunt structurate automat conform cerințelor platformei și legislației.',
    },

    // Pricing (5)
    {
      id: 'pricing-1',
      category: 'pricing',
      question: 'Care sunt planurile de abonament disponibile?',
      answer: 'Oferim trei planuri principale: Starter (pentru consultanți individuali cu până la 3 organizații), Professional (pentru consultanți cu 3-20 organizații) și Enterprise (pentru agenții mari cu clienți nelimitați). Fiecare plan include funcționalități de bază precum gestionare angajați, instruiri, controale medicale și documente. Planurile superioare oferă raportare avansată, API access, white-label și suport prioritar.',
    },
    {
      id: 'pricing-2',
      category: 'pricing',
      question: 'Există o perioadă de probă gratuită?',
      answer: 'Da, oferim 14 zile de probă gratuită pentru toate planurile, fără necesitatea unui card de credit. În perioada de probă aveți acces complet la toate funcționalitățile planului selectat. Puteți adăuga organizații, angajați și testa toate modulele fără restricții. După expirarea perioadei de probă, puteți alege să vă abonați sau să exportați datele.',
    },
    {
      id: 'pricing-3',
      category: 'pricing',
      question: 'Se aplică costuri suplimentare pentru fiecare angajat sau organizație?',
      answer: 'Nu, prețurile noastre sunt transparente și fixe pe baza planului ales. Planul Starter include până la 100 angajați, Professional până la 500, iar Enterprise este nelimitat. Nu percepem taxe ascunse pentru utilizatori suplimentari, stocare documente sau număr de rapoarte generate. Upgrade-ul între planuri este simplu și se face instant.',
    },
    {
      id: 'pricing-4',
      category: 'pricing',
      question: 'Pot anula abonamentul oricând?',
      answer: 'Da, abonamentul poate fi anulat oricând fără penalizări sau taxe de anulare. Veți avea acces la platformă până la sfârșitul perioadei de facturare deja plătite. Înainte de anulare, puteți exporta toate datele în formate standard (Excel, PDF, JSON). Dacă vă reactivați contul în 30 zile, datele vor fi restaurate complet.',
    },
    {
      id: 'pricing-5',
      category: 'pricing',
      question: 'Oferiți reduceri pentru abonamente anuale?',
      answer: 'Da, abonamentele anuale beneficiază de o reducere de 20% față de plata lunară. De asemenea, oferim reduceri speciale pentru ONG-uri, instituții educaționale și agenții cu peste 50 de clienți activi. Plata se poate face prin card, transfer bancar sauFacturaE. Toate facturile sunt emise conform legislației fiscale și conțin TVA.',
    },

    // Features (5)
    {
      id: 'features-1',
      category: 'features',
      question: 'Ce module principale oferă platforma?',
      answer: 'Platforma include module pentru Gestionare Angajați, Controale Medicale, Instruiri SSM/PSI, Echipamente de Protecție, Documente și Registre, Alerte și Notificări, Incidente și Accidente, Inspecții ISU/ITM, Audit Trail și Raportare Avansată. Fiecare modul este complet integrabil și permite fluxuri de lucru automate. Datele sunt sincronizate în timp real între toate modulele.',
    },
    {
      id: 'features-2',
      category: 'features',
      question: 'Cum funcționează sistemul de alerte și notificări?',
      answer: 'Sistemul trimite alerte automate prin email, SMS și notificări în aplicație pentru evenimente importante: expirări control medical, scadențe instruiri, inspecții programate, documente expirate sau incidente raportate. Fiecare utilizator poate configura preferințele de notificare și frecvența alertelor. Alertele sunt trimise cu 30, 15 și 7 zile înainte de expirare, precum și la data scadenței.',
    },
    {
      id: 'features-3',
      category: 'features',
      question: 'Pot genera rapoarte personalizate?',
      answer: 'Da, modulul de raportare permite crearea de rapoarte complet personalizabile cu filtrare pe organizație, perioadă, departament, tip eveniment și multe alte criterii. Rapoartele pot fi exportate în Excel, PDF sau CSV pentru analiză externă. Există și șabloane predefinite pentru rapoarte lunare, trimestriale și anuale obligatorii conform legislației. Grafice și dashboard-uri vizuale facilitează analiza rapidă.',
    },
    {
      id: 'features-4',
      category: 'features',
      question: 'Este disponibilă o aplicație mobilă?',
      answer: 'Platforma este complet responsive și funcționează perfect pe orice dispozitiv mobil prin browser (Progressive Web App). Puteți adăuga aplicația pe ecranul principal al telefonului pentru acces rapid offline partial. Funcționalitățile principale sunt optimizate pentru touch și ecrane mici. O aplicație nativă iOS și Android este în dezvoltare și va fi lansată în 2026.',
    },
    {
      id: 'features-5',
      category: 'features',
      question: 'Puteți integra platforma cu alte sisteme?',
      answer: 'Da, oferim API REST complet documentat pentru integrări cu sisteme HR, ERP, CRM sau alte platforme de management. Suportăm webhooks pentru notificări în timp real către aplicații terțe. Integrări predefinite există pentru sisteme populare de contabilitate și salarizare din România. Echipa tehnică vă poate asista cu implementarea integrărilor personalizate.',
    },

    // Security (5)
    {
      id: 'security-1',
      category: 'security',
      question: 'Cum sunt protejate datele mele?',
      answer: 'Toate datele sunt criptate în tranzit (TLS 1.3) și în repaus (AES-256). Folosim infrastructura Supabase cu backup automat zilnic și replicare geografică. Accesul la date este controlat prin Row Level Security (RLS) la nivel de bază de date, asigurând izolare completă între organizații. Serverele sunt în Europa (Frankfurt) pentru conformitate GDPR.',
    },
    {
      id: 'security-2',
      category: 'security',
      question: 'Cine are acces la datele organizației mele?',
      answer: 'Doar utilizatorii autorizați din organizația dvs. au acces la date, conform rolurilor și permisiunilor configurate. Consultanții SSM au acces doar la organizațiile pentru care au mandat activ. Administratorii platformei nu pot accesa datele clienților fără consimțământ explicit și audit trail complet. Toate accesările sunt înregistrate în jurnalul de audit cu timestamp și IP.',
    },
    {
      id: 'security-3',
      category: 'security',
      question: 'Ce se întâmplă dacă uit parola?',
      answer: 'Puteți reseta parola oricând prin funcția "Am uitat parola" de pe pagina de login, primind un link de resetare pe email. Linkul este valabil 1 oră și poate fi folosit o singură dată. Parolele sunt hash-ate cu algoritmi moderni (bcrypt) și nu pot fi recuperate, doar resetate. Pentru securitate maximă, recomandăm activarea autentificării în doi factori (2FA).',
    },
    {
      id: 'security-4',
      category: 'security',
      question: 'Oferiți autentificare în doi factori (2FA)?',
      answer: 'Da, 2FA este disponibilă prin aplicații de autentificare precum Google Authenticator, Authy sau Microsoft Authenticator. După activare, veți introduce codul generat de aplicație la fiecare login pe lângă parolă. 2FA este obligatorie pentru roluri administrative și opțională pentru utilizatori normali. Coduri de backup sunt generate pentru situații de urgență.',
    },
    {
      id: 'security-5',
      category: 'security',
      question: 'Cât de des faceți backup la date?',
      answer: 'Backup automat complet se efectuează zilnic, cu retenție de 30 zile pentru recovery. Backup-uri incrementale sunt făcute la fiecare 6 ore pentru pierdere minimă de date. Toate backup-urile sunt criptate și stocate în regiuni geografice separate. Testăm lunar procedurile de disaster recovery pentru a garanta timpul de recuperare sub 4 ore.',
    },

    // Legal/GDPR (5)
    {
      id: 'legal-1',
      category: 'legal',
      question: 'Este platforma conformă cu GDPR?',
      answer: 'Da, platforma este 100% conformă cu GDPR și legislația română de protecție a datelor. Implementăm principiile privacy by design și by default în tot codul. Oferim funcționalități complete pentru dreptul de acces, rectificare, ștergere și portabilitate a datelor. Contractăm cu subprocesori certificați GDPR și menținem registrul activităților de prelucrare actualizat.',
    },
    {
      id: 'legal-2',
      category: 'legal',
      question: 'Cum pot exporta sau șterge toate datele organizației?',
      answer: 'Din panoul de administrare, secțiunea Setări Organizație, puteți exporta toate datele în format JSON sau Excel structurat. Exportul include angajați, instruiri, documente, controale medicale și întreg istoricul. Ștergerea completă a datelor se face printr-o cerere scrisă către suport@s-s-m.ro, procesată în maximum 30 zile. Ștergerea este definitivă și ireversibilă după confirmare.',
    },
    {
      id: 'legal-3',
      category: 'legal',
      question: 'Unde sunt stocate datele fizic?',
      answer: 'Toate datele sunt stocate în centre de date certificate în Frankfurt, Germania, pe infrastructura Supabase/AWS. Datele nu părăsesc niciodată teritoriul Uniunii Europene, asigurând conformitate deplină cu GDPR. Backup-urile sunt replicate în regiunea Amsterdam pentru redundanță. Nu transferăm date în țări terțe fără mecanisme adecvate de protecție.',
    },
    {
      id: 'legal-4',
      category: 'legal',
      question: 'Ce documente legale semnez la înregistrare?',
      answer: 'La înregistrare acceptați Termenii și Condițiile de Utilizare și Politica de Confidențialitate, accesibile public pe site. Pentru relația de prelucrare a datelor, se încheie automat un Acord de Prelucrare a Datelor (DPA) conform art. 28 GDPR. Documentele sunt disponibile oricând în contul dvs. și pot fi descărcate în format PDF. Modificările sunt notificate cu 30 zile înainte.',
    },
    {
      id: 'legal-5',
      category: 'legal',
      question: 'Cum raportați incidentele de securitate?',
      answer: 'În cazul unui incident de securitate care afectează datele personale, notificăm autoritățile competente (ANSPDCP în România) în maximum 72 ore conform GDPR. Clienții afectați sunt informați imediat prin email și notificare în platformă cu detalii complete despre incident, date afectate și măsuri luate. Menținem un plan de răspuns la incidente testat trimestrial.',
    },

    // Technical (5)
    {
      id: 'technical-1',
      category: 'technical',
      question: 'Ce tehnologii folosește platforma?',
      answer: 'Platforma este construită cu Next.js 14 (React framework modern), Supabase (PostgreSQL cu RLS), TypeScript pentru siguranță tipurilor, Tailwind CSS pentru styling și Vercel pentru deploy global. Backend-ul folosește serverless functions pentru scalabilitate infinită. Toate componentele sunt open-source sau commercial grade, fără vendor lock-in. Arhitectura este modulară și permite upgrade-uri fără downtime.',
    },
    {
      id: 'technical-2',
      category: 'technical',
      question: 'Care sunt cerințele de sistem pentru a accesa platforma?',
      answer: 'Platforma funcționează în orice browser modern (Chrome, Firefox, Safari, Edge) din ultimii 2 ani. Recomandăm o conexiune internet de minimum 2 Mbps pentru experiență optimă. Nu este nevoie de instalare de software sau plugin-uri. Pentru funcționalități complete, activați JavaScript și cookies în browser. Rezoluție minimă recomandată: 1280x720px.',
    },
    {
      id: 'technical-3',
      category: 'technical',
      question: 'Cât de rapidă este platforma?',
      answer: 'Platforma are un timp de încărcare sub 2 secunde pentru majoritatea paginilor datorită CDN global Vercel. Folosim server-side rendering și optimizări automate pentru imagini. Răspunsul la acțiuni utilizator este instantaneu prin caching inteligent și sincronizare în fundal. Performanța este monitorizată 24/7 cu target de 99.9% uptime. Dashboard-urile complexe se încarcă progresiv pentru feedback imediat.',
    },
    {
      id: 'technical-4',
      category: 'technical',
      question: 'Oferă platforma API pentru integrări?',
      answer: 'Da, oferim REST API complet documentat cu autentificare prin JWT tokens. API-ul permite operații CRUD pe toate entitățile (angajați, instruiri, documente etc.) cu rate limiting configurabil. Documentația interactivă este disponibilă la api.s-s-m.ro cu exemple în multiple limbaje de programare. Webhooks permit notificări în timp real către sistemele dvs. externe.',
    },
    {
      id: 'technical-5',
      category: 'technical',
      question: 'Cum gestionați actualizările și maintenance?',
      answer: 'Deploy-uri noi sunt făcute săptămânal în afara orelor de vârf, fără downtime prin blue-green deployment. Actualizările majore sunt anunțate cu 7 zile înainte prin email și în platformă. Maintenance planificat este programat noaptea în weekend cu durată maximă 2 ore. Folosim feature flags pentru a activa funcționalități noi treptat și a testa în producție fără impact. Rollback automat la detectarea erorilor.',
    },
  ],

  // ENGLISH
  en: [
    // General (5)
    {
      id: 'general-1',
      category: 'general',
      question: 'What is the s-s-m.ro platform?',
      answer: 'The s-s-m.ro platform is a comprehensive digital solution for managing OHS (Occupational Health and Safety) and Fire Safety compliance. We provide tools for OHS consultants and their client companies across Romania, Bulgaria, Hungary, and Germany. The platform digitizes compliance processes, employee records, legal documents, training, and inspections. Everything is available 24/7 from any location with internet access.',
    },
    {
      id: 'general-2',
      category: 'general',
      question: 'Who can use this platform?',
      answer: 'The platform is designed for certified OHS/Fire Safety consultants and the companies they serve. Consultants can manage multiple organizations and employees from a single account. Company administrators can monitor compliance and access reports. Employees can view their training records, medical checks, and assigned equipment. Each role has specific configurable permissions.',
    },
    {
      id: 'general-3',
      category: 'general',
      question: 'In which countries does the platform operate?',
      answer: 'The platform operates in Romania, Bulgaria, Hungary, and Germany, with full support for local legislation in each country. The interface is available in Romanian, English, Bulgarian, Hungarian, and German languages. All documents and reports comply with specific legal requirements of each jurisdiction. We plan to expand to other European countries in the future.',
    },
    {
      id: 'general-4',
      category: 'general',
      question: 'How can I register and start using the platform?',
      answer: 'Registration is simple and quick: visit app.s-s-m.ro and create an account with your email and password. After activating your account via email, complete your consultant or company profile. You can add organizations, employees, and start configuring necessary modules immediately. We also offer a free trial period to test all functionalities.',
    },
    {
      id: 'general-5',
      category: 'general',
      question: 'Can I migrate existing data into the platform?',
      answer: 'Yes, we offer full support for migrating existing data from Excel, PDF, or other systems. Our team can help you import employee registers, training history, medical checks, and existing documents. The migration process is secure and verified for accuracy. Data is automatically structured according to platform requirements and legislation.',
    },

    // Pricing (5)
    {
      id: 'pricing-1',
      category: 'pricing',
      question: 'What subscription plans are available?',
      answer: 'We offer three main plans: Starter (for individual consultants with up to 3 organizations), Professional (for consultants with 3-20 organizations), and Enterprise (for large agencies with unlimited clients). Each plan includes core features like employee management, training, medical checks, and documents. Higher plans offer advanced reporting, API access, white-label options, and priority support.',
    },
    {
      id: 'pricing-2',
      category: 'pricing',
      question: 'Is there a free trial period?',
      answer: 'Yes, we offer a 14-day free trial for all plans, with no credit card required. During the trial period, you have full access to all features of your selected plan. You can add organizations, employees, and test all modules without restrictions. After the trial expires, you can choose to subscribe or export your data.',
    },
    {
      id: 'pricing-3',
      category: 'pricing',
      question: 'Are there additional costs per employee or organization?',
      answer: 'No, our pricing is transparent and fixed based on your chosen plan. The Starter plan includes up to 100 employees, Professional up to 500, and Enterprise is unlimited. We do not charge hidden fees for additional users, document storage, or number of reports generated. Upgrading between plans is simple and instant.',
    },
    {
      id: 'pricing-4',
      category: 'pricing',
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, subscriptions can be canceled anytime without penalties or cancellation fees. You will have access to the platform until the end of your already-paid billing period. Before cancellation, you can export all data in standard formats (Excel, PDF, JSON). If you reactivate your account within 30 days, all data will be fully restored.',
    },
    {
      id: 'pricing-5',
      category: 'pricing',
      question: 'Do you offer discounts for annual subscriptions?',
      answer: 'Yes, annual subscriptions receive a 20% discount compared to monthly payments. We also offer special discounts for NGOs, educational institutions, and agencies with over 50 active clients. Payment can be made by card, bank transfer, or eInvoice. All invoices are issued according to tax legislation and include VAT.',
    },

    // Features (5)
    {
      id: 'features-1',
      category: 'features',
      question: 'What are the main modules offered by the platform?',
      answer: 'The platform includes modules for Employee Management, Medical Checks, OHS/Fire Safety Training, Protective Equipment, Documents and Registers, Alerts and Notifications, Incidents and Accidents, Inspections, Audit Trail, and Advanced Reporting. Each module is fully integrated and enables automated workflows. Data is synchronized in real-time across all modules.',
    },
    {
      id: 'features-2',
      category: 'features',
      question: 'How does the alert and notification system work?',
      answer: 'The system sends automatic alerts via email, SMS, and in-app notifications for important events: medical check expirations, training deadlines, scheduled inspections, expired documents, or reported incidents. Each user can configure notification preferences and alert frequency. Alerts are sent 30, 15, and 7 days before expiration, as well as on the due date.',
    },
    {
      id: 'features-3',
      category: 'features',
      question: 'Can I generate custom reports?',
      answer: 'Yes, the reporting module allows creation of fully customizable reports with filtering by organization, period, department, event type, and many other criteria. Reports can be exported to Excel, PDF, or CSV for external analysis. Predefined templates exist for monthly, quarterly, and annual mandatory reports according to legislation. Charts and visual dashboards facilitate quick analysis.',
    },
    {
      id: 'features-4',
      category: 'features',
      question: 'Is a mobile app available?',
      answer: 'The platform is fully responsive and works perfectly on any mobile device through the browser (Progressive Web App). You can add the app to your phone\'s home screen for quick access with partial offline functionality. Core features are optimized for touch and small screens. A native iOS and Android app is in development and will be launched in 2026.',
    },
    {
      id: 'features-5',
      category: 'features',
      question: 'Can you integrate the platform with other systems?',
      answer: 'Yes, we offer a fully documented REST API for integrations with HR, ERP, CRM, or other management platforms. We support webhooks for real-time notifications to third-party applications. Pre-built integrations exist for popular accounting and payroll systems in Romania. Our technical team can assist with custom integration implementations.',
    },

    // Security (5)
    {
      id: 'security-1',
      category: 'security',
      question: 'How is my data protected?',
      answer: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We use Supabase infrastructure with automatic daily backups and geographic replication. Data access is controlled through Row Level Security (RLS) at the database level, ensuring complete isolation between organizations. Servers are in Europe (Frankfurt) for GDPR compliance.',
    },
    {
      id: 'security-2',
      category: 'security',
      question: 'Who has access to my organization\'s data?',
      answer: 'Only authorized users from your organization have access to data, according to configured roles and permissions. OHS consultants only have access to organizations for which they have an active mandate. Platform administrators cannot access client data without explicit consent and complete audit trail. All accesses are recorded in the audit log with timestamp and IP.',
    },
    {
      id: 'security-3',
      category: 'security',
      question: 'What happens if I forget my password?',
      answer: 'You can reset your password anytime through the "Forgot password" function on the login page, receiving a reset link via email. The link is valid for 1 hour and can be used only once. Passwords are hashed with modern algorithms (bcrypt) and cannot be recovered, only reset. For maximum security, we recommend enabling two-factor authentication (2FA).',
    },
    {
      id: 'security-4',
      category: 'security',
      question: 'Do you offer two-factor authentication (2FA)?',
      answer: 'Yes, 2FA is available through authenticator apps like Google Authenticator, Authy, or Microsoft Authenticator. After activation, you will enter the code generated by the app at each login in addition to your password. 2FA is mandatory for administrative roles and optional for regular users. Backup codes are generated for emergency situations.',
    },
    {
      id: 'security-5',
      category: 'security',
      question: 'How often do you backup data?',
      answer: 'Full automatic backups are performed daily, with 30-day retention for recovery. Incremental backups are made every 6 hours for minimal data loss. All backups are encrypted and stored in separate geographic regions. We test disaster recovery procedures monthly to guarantee recovery time under 4 hours.',
    },

    // Legal/GDPR (5)
    {
      id: 'legal-1',
      category: 'legal',
      question: 'Is the platform GDPR compliant?',
      answer: 'Yes, the platform is 100% compliant with GDPR and Romanian data protection legislation. We implement privacy by design and by default principles throughout the code. We offer complete functionalities for rights of access, rectification, deletion, and data portability. We contract with GDPR-certified subprocessors and maintain an updated register of processing activities.',
    },
    {
      id: 'legal-2',
      category: 'legal',
      question: 'How can I export or delete all organization data?',
      answer: 'From the administration panel, Organization Settings section, you can export all data in JSON or structured Excel format. The export includes employees, training, documents, medical checks, and complete history. Complete data deletion is done through a written request to suport@s-s-m.ro, processed within maximum 30 days. Deletion is final and irreversible after confirmation.',
    },
    {
      id: 'legal-3',
      category: 'legal',
      question: 'Where is data physically stored?',
      answer: 'All data is stored in certified data centers in Frankfurt, Germany, on Supabase/AWS infrastructure. Data never leaves European Union territory, ensuring full GDPR compliance. Backups are replicated in the Amsterdam region for redundancy. We do not transfer data to third countries without adequate protection mechanisms.',
    },
    {
      id: 'legal-4',
      category: 'legal',
      question: 'What legal documents do I sign upon registration?',
      answer: 'Upon registration, you accept the Terms and Conditions of Use and Privacy Policy, publicly accessible on the site. For the data processing relationship, a Data Processing Agreement (DPA) is automatically concluded according to Art. 28 GDPR. Documents are available anytime in your account and can be downloaded in PDF format. Changes are notified 30 days in advance.',
    },
    {
      id: 'legal-5',
      category: 'legal',
      question: 'How do you report security incidents?',
      answer: 'In case of a security incident affecting personal data, we notify competent authorities (ANSPDCP in Romania) within maximum 72 hours according to GDPR. Affected clients are informed immediately via email and platform notification with complete details about the incident, affected data, and measures taken. We maintain an incident response plan tested quarterly.',
    },

    // Technical (5)
    {
      id: 'technical-1',
      category: 'technical',
      question: 'What technologies does the platform use?',
      answer: 'The platform is built with Next.js 14 (modern React framework), Supabase (PostgreSQL with RLS), TypeScript for type safety, Tailwind CSS for styling, and Vercel for global deployment. The backend uses serverless functions for infinite scalability. All components are open-source or commercial grade, without vendor lock-in. The architecture is modular and allows upgrades without downtime.',
    },
    {
      id: 'technical-2',
      category: 'technical',
      question: 'What are the system requirements to access the platform?',
      answer: 'The platform works in any modern browser (Chrome, Firefox, Safari, Edge) from the last 2 years. We recommend a minimum 2 Mbps internet connection for optimal experience. No software installation or plugins are needed. For full functionality, enable JavaScript and cookies in your browser. Minimum recommended resolution: 1280x720px.',
    },
    {
      id: 'technical-3',
      category: 'technical',
      question: 'How fast is the platform?',
      answer: 'The platform has a loading time under 2 seconds for most pages thanks to Vercel\'s global CDN. We use server-side rendering and automatic image optimizations. Response to user actions is instant through intelligent caching and background synchronization. Performance is monitored 24/7 with a 99.9% uptime target. Complex dashboards load progressively for immediate feedback.',
    },
    {
      id: 'technical-4',
      category: 'technical',
      question: 'Does the platform offer an API for integrations?',
      answer: 'Yes, we offer a fully documented REST API with JWT token authentication. The API allows CRUD operations on all entities (employees, training, documents, etc.) with configurable rate limiting. Interactive documentation is available at api.s-s-m.ro with examples in multiple programming languages. Webhooks enable real-time notifications to your external systems.',
    },
    {
      id: 'technical-5',
      category: 'technical',
      question: 'How do you handle updates and maintenance?',
      answer: 'New deployments are made weekly outside peak hours, without downtime through blue-green deployment. Major updates are announced 7 days in advance via email and in-platform. Planned maintenance is scheduled at night on weekends with maximum 2-hour duration. We use feature flags to enable new functionalities gradually and test in production without impact. Automatic rollback upon error detection.',
    },
  ],

  // BULGARIAN
  bg: [
    // General (5)
    {
      id: 'general-1',
      category: 'general',
      question: 'Какво е платформата s-s-m.ro?',
      answer: 'Платформата s-s-m.ro е цялостно дигитално решение за управление на съответствието с БЗР (Безопасност и Здраве при Работа) и пожарна безопасност. Предоставяме инструменти за консултанти по БЗР и техните клиентски компании в Румъния, България, Унгария и Германия. Платформата дигитализира процесите на съответствие, досиета на служители, правни документи, обучения и проверки. Всичко е достъпно 24/7 от всяко място с интернет достъп.',
    },
    {
      id: 'general-2',
      category: 'general',
      question: 'Кой може да използва тази платформа?',
      answer: 'Платформата е предназначена за сертифицирани консултанти по БЗР/пожарна безопасност и компаниите, които обслужват. Консултантите могат да управляват множество организации и служители от един акаунт. Администраторите на компании могат да следят съответствието и да получават отчети. Служителите могат да преглеждат своите обучения, медицински прегледи и назначено оборудване. Всяка роля има специфични конфигурируеми разрешения.',
    },
    {
      id: 'general-3',
      category: 'general',
      question: 'В кои държави работи платформата?',
      answer: 'Платформата работи в Румъния, България, Унгария и Германия, с пълна поддръжка на местното законодателство във всяка държава. Интерфейсът е достъпен на румънски, английски, български, унгарски и немски език. Всички документи и отчети съответстват на специфичните правни изисквания на всяка юрисдикция. Планираме разширение в други европейски страни в бъдеще.',
    },
    {
      id: 'general-4',
      category: 'general',
      question: 'Как мога да се регистрирам и да започна да използвам платформата?',
      answer: 'Регистрацията е проста и бърза: посетете app.s-s-m.ro и създайте акаунт с имейл и парола. След активиране на акаунта чрез имейл, попълнете профила на консултант или компания. Можете да добавите организации, служители и да започнете да конфигурирате необходимите модули незабавно. Предлагаме и безплатен пробен период за тестване на всички функционалности.',
    },
    {
      id: 'general-5',
      category: 'general',
      question: 'Мога ли да мигрирам съществуващи данни в платформата?',
      answer: 'Да, предлагаме пълна поддръжка за мигриране на съществуващи данни от Excel, PDF или други системи. Нашият екип може да ви помогне да импортирате регистри на служители, история на обучения, медицински прегледи и съществуващи документи. Процесът на миграция е сигурен и проверен за точност. Данните се структурират автоматично според изискванията на платформата и законодателството.',
    },

    // Pricing (5)
    {
      id: 'pricing-1',
      category: 'pricing',
      question: 'Какви абонаментни планове са налични?',
      answer: 'Предлагаме три основни плана: Starter (за индивидуални консултанти с до 3 организации), Professional (за консултанти с 3-20 организации) и Enterprise (за големи агенции с неограничени клиенти). Всеки план включва основни функции като управление на служители, обучения, медицински прегледи и документи. По-високите планове предлагат разширено отчитане, API достъп, white-label опции и приоритетна поддръжка.',
    },
    {
      id: 'pricing-2',
      category: 'pricing',
      question: 'Има ли безплатен пробен период?',
      answer: 'Да, предлагаме 14-дневен безплатен пробен период за всички планове, без да е необходима кредитна карта. По време на пробния период имате пълен достъп до всички функции на избрания план. Можете да добавите организации, служители и да тествате всички модули без ограничения. След изтичане на пробния период можете да изберете да се абонирате или да експортирате данните си.',
    },
    {
      id: 'pricing-3',
      category: 'pricing',
      question: 'Има ли допълнителни разходи на служител или организация?',
      answer: 'Не, нашите цени са прозрачни и фиксирани въз основа на избрания план. Планът Starter включва до 100 служители, Professional до 500, а Enterprise е неограничен. Не таксуваме скрити такси за допълнителни потребители, съхранение на документи или брой генерирани отчети. Надграждането между планове е просто и моментално.',
    },
    {
      id: 'pricing-4',
      category: 'pricing',
      question: 'Мога ли да откажа абонамента си по всяко време?',
      answer: 'Да, абонаментите могат да бъдат отказани по всяко време без санкции или такси за отказ. Ще имате достъп до платформата до края на вече платения период на фактуриране. Преди отказ можете да експортирате всички данни в стандартни формати (Excel, PDF, JSON). Ако реактивирате акаунта си в рамките на 30 дни, всички данни ще бъдат напълно възстановени.',
    },
    {
      id: 'pricing-5',
      category: 'pricing',
      question: 'Предлагате ли отстъпки за годишни абонаменти?',
      answer: 'Да, годишните абонаменти получават 20% отстъпка в сравнение с месечните плащания. Предлагаме също специални отстъпки за НПО, образователни институции и агенции с над 50 активни клиенти. Плащането може да се извърши с карта, банков превод или електронна фактура. Всички фактури се издават съгласно данъчното законодателство и включват ДДС.',
    },

    // Features (5)
    {
      id: 'features-1',
      category: 'features',
      question: 'Какви са основните модули, предлагани от платформата?',
      answer: 'Платформата включва модули за управление на служители, медицински прегледи, обучения по БЗР/пожарна безопасност, защитно оборудване, документи и регистри, известия и нотификации, инциденти и злополуки, проверки, одит и разширено отчитане. Всеки модул е напълно интегриран и позволява автоматизирани работни потоци. Данните се синхронизират в реално време между всички модули.',
    },
    {
      id: 'features-2',
      category: 'features',
      question: 'Как работи системата за известия и нотификации?',
      answer: 'Системата изпраща автоматични известия чрез имейл, SMS и нотификации в приложението за важни събития: изтичане на медицински прегледи, крайни срокове за обучения, планирани проверки, изтекли документи или докладвани инциденти. Всеки потребител може да конфигурира предпочитанията за нотификации и честотата на известията. Известията се изпращат 30, 15 и 7 дни преди изтичане, както и на датата на падежа.',
    },
    {
      id: 'features-3',
      category: 'features',
      question: 'Мога ли да генерирам персонализирани отчети?',
      answer: 'Да, модулът за отчитане позволява създаване на напълно персонализируеми отчети с филтриране по организация, период, отдел, тип събитие и много други критерии. Отчетите могат да бъдат експортирани в Excel, PDF или CSV за външен анализ. Съществуват предварително дефинирани шаблони за месечни, тримесечни и годишни задължителни отчети според законодателството. Графики и визуални табла за управление улесняват бързия анализ.',
    },
    {
      id: 'features-4',
      category: 'features',
      question: 'Налично ли е мобилно приложение?',
      answer: 'Платформата е напълно responsive и работи перфектно на всяко мобилно устройство чрез браузъра (Progressive Web App). Можете да добавите приложението към началния екран на телефона си за бърз достъп с частична офлайн функционалност. Основните функции са оптимизирани за touch и малки екрани. Нативно iOS и Android приложение е в разработка и ще бъде пуснато през 2026 г.',
    },
    {
      id: 'features-5',
      category: 'features',
      question: 'Можете ли да интегрирате платформата с други системи?',
      answer: 'Да, предлагаме напълно документиран REST API за интеграции с HR, ERP, CRM или други управленски платформи. Поддържаме webhooks за нотификации в реално време към приложения на трети страни. Съществуват предварително изградени интеграции за популярни счетоводни и заплатни системи в Румъния. Нашият технически екип може да помогне с внедряването на персонализирани интеграции.',
    },

    // Security (5)
    {
      id: 'security-1',
      category: 'security',
      question: 'Как са защитени моите данни?',
      answer: 'Всички данни са криптирани при транспортиране (TLS 1.3) и в покой (AES-256). Използваме Supabase инфраструктура с автоматични ежедневни резервни копия и географско реплициране. Достъпът до данни се контролира чрез Row Level Security (RLS) на ниво база данни, осигурявайки пълна изолация между организации. Сървърите са в Европа (Франкфурт) за съответствие с GDPR.',
    },
    {
      id: 'security-2',
      category: 'security',
      question: 'Кой има достъп до данните на моята организация?',
      answer: 'Само оторизирани потребители от вашата организация имат достъп до данни, според конфигурираните роли и разрешения. Консултантите по БЗР имат достъп само до организации, за които имат активен мандат. Администраторите на платформата не могат да получат достъп до данни на клиенти без изрично съгласие и пълна одит следа. Всички достъпи се записват в одит лога с времеви печат и IP.',
    },
    {
      id: 'security-3',
      category: 'security',
      question: 'Какво се случва, ако забравя паролата си?',
      answer: 'Можете да нулирате паролата си по всяко време чрез функцията "Забравена парола" на страницата за вход, получавайки линк за нулиране по имейл. Линкът е валиден 1 час и може да се използва само веднъж. Паролите са хеширани с модерни алгоритми (bcrypt) и не могат да бъдат възстановени, само нулирани. За максимална сигурност препоръчваме активиране на двуфакторна автентикация (2FA).',
    },
    {
      id: 'security-4',
      category: 'security',
      question: 'Предлагате ли двуфакторна автентикация (2FA)?',
      answer: 'Да, 2FA е налична чрез приложения за автентикация като Google Authenticator, Authy или Microsoft Authenticator. След активиране ще въвеждате кода, генериран от приложението при всяко влизане в допълнение към паролата си. 2FA е задължителна за административни роли и опционална за обикновени потребители. Генерират се резервни кодове за спешни ситуации.',
    },
    {
      id: 'security-5',
      category: 'security',
      question: 'Колко често правите резервни копия на данните?',
      answer: 'Пълни автоматични резервни копия се извършват ежедневно, с 30-дневно съхранение за възстановяване. Инкрементални резервни копия се правят на всеки 6 часа за минимална загуба на данни. Всички резервни копия са криптирани и съхранявани в отделни географски региони. Тестваме процедурите за възстановяване при бедствие месечно, за да гарантираме време за възстановяване под 4 часа.',
    },

    // Legal/GDPR (5)
    {
      id: 'legal-1',
      category: 'legal',
      question: 'Съответства ли платформата на GDPR?',
      answer: 'Да, платформата е 100% съвместима с GDPR и румънското законодателство за защита на данните. Внедряваме принципите privacy by design и by default в целия код. Предлагаме пълни функционалности за права на достъп, коригиране, изтриване и преносимост на данни. Договаряме с GDPR-сертифицирани подизпълнители и поддържаме актуализиран регистър на дейностите по обработка.',
    },
    {
      id: 'legal-2',
      category: 'legal',
      question: 'Как мога да експортирам или изтрия всички данни на организацията?',
      answer: 'От администраторския панел, секция Настройки на организацията, можете да експортирате всички данни в JSON или структуриран Excel формат. Експортът включва служители, обучения, документи, медицински прегледи и пълна история. Пълното изтриване на данни се извършва чрез писмена заявка до suport@s-s-m.ro, обработена в рамките на максимум 30 дни. Изтриването е окончателно и необратимо след потвърждение.',
    },
    {
      id: 'legal-3',
      category: 'legal',
      question: 'Къде се съхраняват физически данните?',
      answer: 'Всички данни се съхраняват в сертифицирани центрове за данни във Франкфурт, Германия, на Supabase/AWS инфраструктура. Данните никога не напускат територията на Европейския съюз, осигурявайки пълно съответствие с GDPR. Резервните копия се реплицират в региона на Амстердам за redundancy. Не прехвърляме данни в трети страни без подходящи механизми за защита.',
    },
    {
      id: 'legal-4',
      category: 'legal',
      question: 'Какви правни документи подписвам при регистрация?',
      answer: 'При регистрация приемате Общите условия за ползване и Политиката за поверителност, публично достъпни на сайта. За отношенията по обработка на данни се сключва автоматично Споразумение за обработка на данни (DPA) съгласно чл. 28 GDPR. Документите са винаги достъпни във вашия акаунт и могат да бъдат изтеглени в PDF формат. Промените се уведомяват 30 дни предварително.',
    },
    {
      id: 'legal-5',
      category: 'legal',
      question: 'Как докладвате инциденти със сигурността?',
      answer: 'В случай на инцидент със сигурността, засягащ лични данни, уведомяваме компетентните органи (ANSPDCP в Румъния) в рамките на максимум 72 часа съгласно GDPR. Засегнатите клиенти се информират незабавно чрез имейл и нотификация в платформата с пълни подробности за инцидента, засегнатите данни и предприетите мерки. Поддържаме план за реагиране при инциденти, тестван тримесечно.',
    },

    // Technical (5)
    {
      id: 'technical-1',
      category: 'technical',
      question: 'Какви технологии използва платформата?',
      answer: 'Платформата е изградена с Next.js 14 (модерен React framework), Supabase (PostgreSQL с RLS), TypeScript за типова сигурност, Tailwind CSS за стилизиране и Vercel за глобално разгръщане. Backend-ът използва serverless функции за безкрайна скалируемост. Всички компоненти са open-source или commercial grade, без vendor lock-in. Архитектурата е модулна и позволява актуализации без downtime.',
    },
    {
      id: 'technical-2',
      category: 'technical',
      question: 'Какви са системните изисквания за достъп до платформата?',
      answer: 'Платформата работи във всеки модерен браузър (Chrome, Firefox, Safari, Edge) от последните 2 години. Препоръчваме минимална интернет връзка от 2 Mbps за оптимално изживяване. Не е необходима инсталация на софтуер или плъгини. За пълна функционалност активирайте JavaScript и cookies във вашия браузър. Минимална препоръчителна резолюция: 1280x720px.',
    },
    {
      id: 'technical-3',
      category: 'technical',
      question: 'Колко бърза е платформата?',
      answer: 'Платформата има време за зареждане под 2 секунди за повечето страници благодарение на глобалната CDN на Vercel. Използваме server-side rendering и автоматични оптимизации на изображения. Отговорът на потребителските действия е моментален чрез интелигентно кеширане и фонова синхронизация. Производителността се наблюдава 24/7 с цел 99.9% uptime. Сложните табла за управление се зареждат прогресивно за незабавна обратна връзка.',
    },
    {
      id: 'technical-4',
      category: 'technical',
      question: 'Предлага ли платформата API за интеграции?',
      answer: 'Да, предлагаме напълно документиран REST API с JWT token автентикация. API-то позволява CRUD операции върху всички обекти (служители, обучения, документи и т.н.) с конфигурируемо ограничаване на скоростта. Интерактивната документация е налична на api.s-s-m.ro с примери на множество програмни езици. Webhooks позволяват нотификации в реално време към вашите външни системи.',
    },
    {
      id: 'technical-5',
      category: 'technical',
      question: 'Как управлявате актуализации и поддръжка?',
      answer: 'Новите разгръщания се правят седмично извън пиковите часове, без downtime чрез blue-green deployment. Големите актуализации се обявяват 7 дни предварително чрез имейл и в платформата. Планираната поддръжка се програмира нощем през уикендите с максимална продължителност 2 часа. Използваме feature flags за постепенно активиране на нови функционалности и тестване в production без въздействие. Автоматично връщане назад при откриване на грешки.',
    },
  ],

  // HUNGARIAN
  hu: [
    // General (5)
    {
      id: 'general-1',
      category: 'general',
      question: 'Mi az s-s-m.ro platform?',
      answer: 'Az s-s-m.ro platform egy átfogó digitális megoldás a munkahelyi egészségvédelem és tűzvédelem megfelelőség kezelésére. Eszközöket biztosítunk munkavédelmi tanácsadók és ügyfélvállalataiknak Romániában, Bulgáriában, Magyarországon és Németországban. A platform digitalizálja a megfelelőségi folyamatokat, munkavállalói nyilvántartásokat, jogi dokumentumokat, képzéseket és ellenőrzéseket. Minden elérhető 24/7, bármilyen internetkapcsolattal rendelkező helyről.',
    },
    {
      id: 'general-2',
      category: 'general',
      question: 'Ki használhatja ezt a platformot?',
      answer: 'A platform tanúsított munkavédelmi/tűzvédelmi tanácsadóknak és az általuk kiszolgált vállalatoknak készült. A tanácsadók egyetlen fiókból kezelhetnek több szervezetet és munkavállalót. A vállalatadminisztrátorok nyomon követhetik a megfelelőséget és hozzáférhetnek a jelentésekhez. A munkavállalók megtekinthetik képzési előzményeiket, egészségügyi vizsgálataikat és kiosztott felszereléseiket. Minden szerepkör rendelkezik specifikus konfigurálható jogosultságokkal.',
    },
    {
      id: 'general-3',
      category: 'general',
      question: 'Mely országokban működik a platform?',
      answer: 'A platform Romániában, Bulgáriában, Magyarországon és Németországban működik, teljes támogatással minden ország helyi jogszabályaihoz. A felület elérhető román, angol, bolgár, magyar és német nyelven. Minden dokumentum és jelentés megfelel az egyes joghatóságok specifikus jogi követelményeinek. A jövőben tervezünk bővítést más európai országokba.',
    },
    {
      id: 'general-4',
      category: 'general',
      question: 'Hogyan regisztrálhatok és kezdhetem el használni a platformot?',
      answer: 'A regisztráció egyszerű és gyors: látogassa meg az app.s-s-m.ro oldalt és hozzon létre fiókot email címmel és jelszóval. A fiók email-en keresztüli aktiválása után töltse ki tanácsadói vagy vállalati profilját. Azonnal hozzáadhat szervezeteket, munkavállalókat és elkezdheti konfigurálni a szükséges modulokat. Ingyenes próbaidőszakot is kínálunk az összes funkció teszteléséhez.',
    },
    {
      id: 'general-5',
      category: 'general',
      question: 'Migrálhatom meglévő adataimat a platformra?',
      answer: 'Igen, teljes támogatást nyújtunk a meglévő adatok migrálásához Excel, PDF vagy más rendszerekből. Csapatunk segíthet importálni munkavállalói nyilvántartásokat, képzési előzményeket, egészségügyi vizsgálatokat és meglévő dokumentumokat. A migrálási folyamat biztonságos és pontosságra ellenőrzött. Az adatok automatikusan strukturálódnak a platform követelményei és a jogszabályok szerint.',
    },

    // Pricing (5)
    {
      id: 'pricing-1',
      category: 'pricing',
      question: 'Milyen előfizetési csomagok érhetők el?',
      answer: 'Három fő csomagot kínálunk: Starter (egyéni tanácsadóknak legfeljebb 3 szervezettel), Professional (tanácsadóknak 3-20 szervezettel) és Enterprise (nagy ügynökségeknek korlátlan ügyféllel). Minden csomag tartalmazza az alapvető funkciókat, mint munkavállalói kezelés, képzések, egészségügyi vizsgálatok és dokumentumok. A magasabb csomagok speciális jelentéseket, API hozzáférést, white-label opciókat és prioritásos támogatást kínálnak.',
    },
    {
      id: 'pricing-2',
      category: 'pricing',
      question: 'Van ingyenes próbaidőszak?',
      answer: 'Igen, 14 napos ingyenes próbaidőszakot kínálunk minden csomagra, hitelkártya nélkül. A próbaidőszak alatt teljes hozzáférése van a választott csomag összes funkciójához. Hozzáadhat szervezeteket, munkavállalókat és korlátozások nélkül tesztelheti az összes modult. A próbaidőszak lejárta után dönthet az előfizetés mellett vagy exportálhatja adatait.',
    },
    {
      id: 'pricing-3',
      category: 'pricing',
      question: 'Vannak további költségek munkavállalónként vagy szervezetenként?',
      answer: 'Nem, áraink átláthatóak és rögzítettek a választott csomag alapján. A Starter csomag legfeljebb 100 munkavállalót tartalmaz, a Professional 500-at, az Enterprise pedig korlátlan. Nem számítunk fel rejtett díjakat további felhasználókért, dokumentumtárolásért vagy generált jelentések számáért. A csomagok közötti frissítés egyszerű és azonnali.',
    },
    {
      id: 'pricing-4',
      category: 'pricing',
      question: 'Lemondhatom előfizetésemet bármikor?',
      answer: 'Igen, az előfizetések bármikor lemondhatók büntetés vagy lemondási díjak nélkül. A platformhoz a már kifizetett számlázási időszak végéig lesz hozzáférése. Lemondás előtt exportálhatja összes adatát szabványos formátumokban (Excel, PDF, JSON). Ha 30 napon belül újraaktiválja fiókját, minden adat teljesen visszaállításra kerül.',
    },
    {
      id: 'pricing-5',
      category: 'pricing',
      question: 'Kínálnak kedvezményt éves előfizetésekre?',
      answer: 'Igen, az éves előfizetések 20% kedvezményt kapnak a havi fizetéshez képest. Speciális kedvezményeket is kínálunk civil szervezeteknek, oktatási intézményeknek és 50+ aktív ügyféllel rendelkező ügynökségeknek. A fizetés történhet kártyával, banki átutalással vagy e-számlával. Minden számla az adójogszabályoknak megfelelően kerül kiállításra és tartalmazza az ÁFÁ-t.',
    },

    // Features (5)
    {
      id: 'features-1',
      category: 'features',
      question: 'Milyen fő modulokat kínál a platform?',
      answer: 'A platform tartalmaz modulokat a munkavállalói kezeléshez, egészségügyi vizsgálatokhoz, munkavédelmi/tűzvédelmi képzésekhez, védőfelszerelésekhez, dokumentumokhoz és nyilvántartásokhoz, riasztásokhoz és értesítésekhez, incidensekhez és balesetekhez, ellenőrzésekhez, audit nyomkövetéshez és speciális jelentésekhez. Minden modul teljesen integrált és automatizált munkafolyamatokat tesz lehetővé. Az adatok valós időben szinkronizálódnak az összes modul között.',
    },
    {
      id: 'features-2',
      category: 'features',
      question: 'Hogyan működik a riasztási és értesítési rendszer?',
      answer: 'A rendszer automatikus riasztásokat küld email, SMS és alkalmazáson belüli értesítések formájában fontos eseményekről: egészségügyi vizsgálatok lejárása, képzési határidők, tervezett ellenőrzések, lejárt dokumentumok vagy bejelentett incidensek. Minden felhasználó konfigurálhatja értesítési preferenciáit és a riasztások gyakoriságát. A riasztások 30, 15 és 7 nappal a lejárat előtt, valamint a határidő napján kerülnek kiküldésre.',
    },
    {
      id: 'features-3',
      category: 'features',
      question: 'Generálhatok egyedi jelentéseket?',
      answer: 'Igen, a jelentési modul lehetővé teszi teljesen testreszabható jelentések létrehozását szűréssel szervezet, időszak, részleg, eseménytípus és sok más kritérium szerint. A jelentések exportálhatók Excel, PDF vagy CSV formátumba külső elemzéshez. Előre definiált sablonok léteznek a jogszabályok szerinti havi, negyedéves és éves kötelező jelentésekhez. Grafikonok és vizuális dashboardok megkönnyítik a gyors elemzést.',
    },
    {
      id: 'features-4',
      category: 'features',
      question: 'Elérhető mobilalkalmazás?',
      answer: 'A platform teljesen reszponzív és tökéletesen működik bármilyen mobileszközön böngészőn keresztül (Progressive Web App). Hozzáadhatja az alkalmazást telefonja kezdőképernyőjéhez gyors hozzáféréshez részleges offline funkcionalitással. Az alapvető funkciók érintésre és kis képernyőkre optimalizáltak. Egy natív iOS és Android alkalmazás fejlesztés alatt áll és 2026-ban kerül kiadásra.',
    },
    {
      id: 'features-5',
      category: 'features',
      question: 'Integrálható a platform más rendszerekkel?',
      answer: 'Igen, teljesen dokumentált REST API-t kínálunk integrációkhoz HR, ERP, CRM vagy más vezetési platformokkal. Támogatunk webhookokat valós idejű értesítésekhez harmadik féltől származó alkalmazások felé. Előre elkészített integrációk léteznek népszerű könyvelési és bérszámfejtési rendszerekhez Romániában. Technikai csapatunk segíthet egyedi integrációk megvalósításában.',
    },

    // Security (5)
    {
      id: 'security-1',
      category: 'security',
      question: 'Hogyan védettek az adataim?',
      answer: 'Minden adat titkosítva van átvitel közben (TLS 1.3) és nyugalmi állapotban (AES-256). Supabase infrastruktúrát használunk automatikus napi biztonsági mentésekkel és földrajzi replikációval. Az adathozzáférés Row Level Security (RLS) segítségével van szabályozva adatbázis szinten, biztosítva a teljes elszigetelést szervezetek között. A szerverek Európában (Frankfurt) vannak a GDPR megfelelőség érdekében.',
    },
    {
      id: 'security-2',
      category: 'security',
      question: 'Ki férhet hozzá a szervezetem adataihoz?',
      answer: 'Csak a szervezet jogosult felhasználói férhetnek hozzá az adatokhoz, a konfigurált szerepkörök és jogosultságok szerint. A munkavédelmi tanácsadók csak azokhoz a szervezetekhez férhetnek hozzá, amelyekhez aktív megbízásuk van. A platformadminisztrátorok nem férhetnek hozzá az ügyféladatokhoz kifejezett hozzájárulás és teljes audit nyomvonal nélkül. Minden hozzáférés naplózva van az audit logban időbélyeggel és IP címmel.',
    },
    {
      id: 'security-3',
      category: 'security',
      question: 'Mi történik, ha elfelejtem a jelszavam?',
      answer: 'Bármikor visszaállíthatja jelszavát az "Elfelejtett jelszó" funkcióval a bejelentkezési oldalon, visszaállítási linket kapva emailben. A link 1 óráig érvényes és csak egyszer használható fel. A jelszavak modern algoritmusokkal (bcrypt) vannak hashelve és nem visszanyerhetők, csak visszaállíthatók. Maximális biztonság érdekében javasoljuk a kétfaktoros hitelesítés (2FA) aktiválását.',
    },
    {
      id: 'security-4',
      category: 'security',
      question: 'Kínálnak kétfaktoros hitelesítést (2FA)?',
      answer: 'Igen, a 2FA elérhető hitelesítő alkalmazásokon keresztül, mint Google Authenticator, Authy vagy Microsoft Authenticator. Aktiválás után minden bejelentkezéskor be kell írnia az alkalmazás által generált kódot jelszava mellett. A 2FA kötelező adminisztratív szerepkörökhöz és opcionális normál felhasználók számára. Vészhelyzeti biztonsági mentési kódok generálódnak.',
    },
    {
      id: 'security-5',
      category: 'security',
      question: 'Milyen gyakran készítenek biztonsági mentést az adatokról?',
      answer: 'Teljes automatikus biztonsági mentés naponta készül, 30 napos megőrzéssel a helyreállításhoz. Növekményes biztonsági mentések 6 óránként készülnek minimális adatvesztésért. Minden biztonsági mentés titkosítva van és különálló földrajzi régiókban tárolódik. Havonta teszteljük a katasztrófa utáni helyreállítási eljárásokat 4 órán aluli helyreállítási idő garantálásához.',
    },

    // Legal/GDPR (5)
    {
      id: 'legal-1',
      category: 'legal',
      question: 'Megfelel a platform a GDPR-nak?',
      answer: 'Igen, a platform 100%-ban megfelel a GDPR-nak és a román adatvédelmi jogszabályoknak. A privacy by design és by default elveket implementáljuk a teljes kódban. Teljes funkcionalitást biztosítunk a hozzáférési, helyesbítési, törlési és adathordozhatósági jogokhoz. GDPR-tanúsított alvállalkozókkal szerződünk és naprakészen tartjuk az adatkezelési tevékenységek nyilvántartását.',
    },
    {
      id: 'legal-2',
      category: 'legal',
      question: 'Hogyan exportálhatom vagy törölhetem a szervezet összes adatát?',
      answer: 'Az adminisztrációs panelről, Szervezeti beállítások szekció alatt exportálhatja összes adatát JSON vagy strukturált Excel formátumban. Az export tartalmazza a munkavállalókat, képzéseket, dokumentumokat, egészségügyi vizsgálatokat és a teljes előzményeket. A teljes adattörlés írásbeli kérésre történik a suport@s-s-m.ro címen, maximum 30 napon belül feldolgozva. A törlés végleges és visszafordíthatatlan megerősítés után.',
    },
    {
      id: 'legal-3',
      category: 'legal',
      question: 'Hol tárolódnak fizikailag az adatok?',
      answer: 'Minden adat tanúsított adatközpontokban tárolódik Frankfurt-ban, Németországban, Supabase/AWS infrastruktúrán. Az adatok soha nem hagyják el az Európai Unió területét, biztosítva teljes GDPR megfelelőséget. A biztonsági mentések az amszterdami régióban replikálódnak redundancia céljából. Nem továbbítunk adatokat harmadik országokba megfelelő védelmi mechanizmusok nélkül.',
    },
    {
      id: 'legal-4',
      category: 'legal',
      question: 'Milyen jogi dokumentumokat írok alá regisztrációkor?',
      answer: 'Regisztrációkor elfogadja a Felhasználási Feltételeket és az Adatvédelmi Szabályzatot, amelyek nyilvánosan elérhetők az oldalon. Az adatkezelési kapcsolathoz automatikusan létrejön egy Adatfeldolgozási Megállapodás (DPA) a GDPR 28. cikke szerint. A dokumentumok bármikor elérhetők fiókjában és letölthetők PDF formátumban. A módosítások 30 nappal előre kerülnek értesítésre.',
    },
    {
      id: 'legal-5',
      category: 'legal',
      question: 'Hogyan jelentik a biztonsági incidenseket?',
      answer: 'Személyes adatokat érintő biztonsági incidens esetén értesítjük az illetékes hatóságokat (ANSPDCP Romániában) maximum 72 órán belül a GDPR szerint. Az érintett ügyfelek azonnal értesítést kapnak emailben és platformértesítésben az incidensről, az érintett adatokról és a megtett intézkedésekről szóló teljes részletekkel. Negyedévente tesztelünk egy incidensreagálási tervet.',
    },

    // Technical (5)
    {
      id: 'technical-1',
      category: 'technical',
      question: 'Milyen technológiákat használ a platform?',
      answer: 'A platform Next.js 14-gyel (modern React keretrendszer), Supabase-zel (PostgreSQL RLS-sel), TypeScript-tel típusbiztonságért, Tailwind CSS-szel stílusozáshoz és Vercel-lel globális telepítéshez készült. A backend serverless funkciókat használ végtelen skálázhatósághoz. Minden komponens open-source vagy commercial grade, vendor lock-in nélkül. Az architektúra moduláris és lehetővé teszi a frissítéseket leállás nélkül.',
    },
    {
      id: 'technical-2',
      category: 'technical',
      question: 'Mik a rendszerkövetelmények a platform eléréséhez?',
      answer: 'A platform bármilyen modern böngészőben működik (Chrome, Firefox, Safari, Edge) az elmúlt 2 évből. Optimális élményhez minimum 2 Mbps internetkapcsolatot ajánlunk. Nincs szükség szoftvertelepítésre vagy bővítményekre. Teljes funkcionalitáshoz engedélyezze a JavaScript-et és a cookie-kat böngészőjében. Minimális ajánlott felbontás: 1280x720px.',
    },
    {
      id: 'technical-3',
      category: 'technical',
      question: 'Milyen gyors a platform?',
      answer: 'A platform a legtöbb oldal betöltési ideje 2 másodperc alatt van a Vercel globális CDN-jének köszönhetően. Server-side renderinget és automatikus képoptimalizálást használunk. A felhasználói műveletekre adott válasz azonnali intelligens gyorsítótárazás és háttérszinkronizálás révén. A teljesítményt 24/7 monitorozzuk 99.9%-os uptime céllal. A komplex dashboardok progresszíven töltődnek azonnali visszajelzésért.',
    },
    {
      id: 'technical-4',
      category: 'technical',
      question: 'Kínál a platform API-t integrációkhoz?',
      answer: 'Igen, teljesen dokumentált REST API-t kínálunk JWT token hitelesítéssel. Az API lehetővé teszi CRUD műveleteket minden entitáson (munkavállalók, képzések, dokumentumok stb.) konfigurálható sebességkorlátozással. Az interaktív dokumentáció elérhető az api.s-s-m.ro címen példákkal több programozási nyelven. A webhookok valós idejű értesítéseket tesznek lehetővé külső rendszerek felé.',
    },
    {
      id: 'technical-5',
      category: 'technical',
      question: 'Hogyan kezelik a frissítéseket és karbantartást?',
      answer: 'Új telepítések hetente történnek csúcsidőn kívül, leállás nélkül blue-green deployment révén. A főbb frissítések 7 nappal előre kerülnek bejelentésre emailben és platformon belül. A tervezett karbantartás hétvégén éjszaka van időzítve maximum 2 órás időtartammal. Feature flag-eket használunk új funkciók fokozatos aktiválásához és production teszteléshez hatás nélkül. Automatikus visszagörgetés hibák észlelésekor.',
    },
  ],

  // GERMAN
  de: [
    // General (5)
    {
      id: 'general-1',
      category: 'general',
      question: 'Was ist die s-s-m.ro-Plattform?',
      answer: 'Die s-s-m.ro-Plattform ist eine umfassende digitale Lösung für das Management von Arbeitsschutz- und Brandschutz-Compliance. Wir bieten Tools für Arbeitsschutzberater und ihre Kundenunternehmen in Rumänien, Bulgarien, Ungarn und Deutschland. Die Plattform digitalisiert Compliance-Prozesse, Mitarbeiterunterlagen, rechtliche Dokumente, Schulungen und Inspektionen. Alles ist 24/7 von jedem Ort mit Internetverbindung verfügbar.',
    },
    {
      id: 'general-2',
      category: 'general',
      question: 'Wer kann diese Plattform nutzen?',
      answer: 'Die Plattform ist für zertifizierte Arbeitsschutz-/Brandschutzberater und die von ihnen betreuten Unternehmen konzipiert. Berater können mehrere Organisationen und Mitarbeiter von einem einzigen Konto aus verwalten. Unternehmensadministratoren können die Compliance überwachen und auf Berichte zugreifen. Mitarbeiter können ihre Schulungsunterlagen, medizinischen Untersuchungen und zugewiesene Ausrüstung einsehen. Jede Rolle verfügt über spezifische konfigurierbare Berechtigungen.',
    },
    {
      id: 'general-3',
      category: 'general',
      question: 'In welchen Ländern ist die Plattform verfügbar?',
      answer: 'Die Plattform ist in Rumänien, Bulgarien, Ungarn und Deutschland verfügbar, mit vollständiger Unterstützung der lokalen Gesetzgebung in jedem Land. Die Benutzeroberfläche ist in rumänischer, englischer, bulgarischer, ungarischer und deutscher Sprache verfügbar. Alle Dokumente und Berichte entsprechen den spezifischen rechtlichen Anforderungen jeder Rechtsordnung. Wir planen eine Expansion in weitere europäische Länder in der Zukunft.',
    },
    {
      id: 'general-4',
      category: 'general',
      question: 'Wie kann ich mich registrieren und die Plattform nutzen?',
      answer: 'Die Registrierung ist einfach und schnell: Besuchen Sie app.s-s-m.ro und erstellen Sie ein Konto mit Ihrer E-Mail und einem Passwort. Nach Aktivierung Ihres Kontos per E-Mail vervollständigen Sie Ihr Berater- oder Unternehmensprofil. Sie können sofort Organisationen und Mitarbeiter hinzufügen und die erforderlichen Module konfigurieren. Wir bieten auch eine kostenlose Testphase an, um alle Funktionen zu testen.',
    },
    {
      id: 'general-5',
      category: 'general',
      question: 'Kann ich bestehende Daten in die Plattform migrieren?',
      answer: 'Ja, wir bieten vollständige Unterstützung für die Migration bestehender Daten aus Excel, PDF oder anderen Systemen. Unser Team kann Ihnen helfen, Mitarbeiterregister, Schulungshistorien, medizinische Untersuchungen und vorhandene Dokumente zu importieren. Der Migrationsprozess ist sicher und auf Genauigkeit geprüft. Die Daten werden automatisch gemäß den Plattformanforderungen und der Gesetzgebung strukturiert.',
    },

    // Pricing (5)
    {
      id: 'pricing-1',
      category: 'pricing',
      question: 'Welche Abonnementpläne sind verfügbar?',
      answer: 'Wir bieten drei Hauptpläne an: Starter (für einzelne Berater mit bis zu 3 Organisationen), Professional (für Berater mit 3-20 Organisationen) und Enterprise (für große Agenturen mit unbegrenzten Kunden). Jeder Plan umfasst Kernfunktionen wie Mitarbeiterverwaltung, Schulungen, medizinische Untersuchungen und Dokumente. Höhere Pläne bieten erweiterte Berichterstattung, API-Zugang, White-Label-Optionen und vorrangigen Support.',
    },
    {
      id: 'pricing-2',
      category: 'pricing',
      question: 'Gibt es eine kostenlose Testphase?',
      answer: 'Ja, wir bieten eine 14-tägige kostenlose Testphase für alle Pläne an, ohne dass eine Kreditkarte erforderlich ist. Während der Testphase haben Sie vollen Zugriff auf alle Funktionen Ihres gewählten Plans. Sie können Organisationen und Mitarbeiter hinzufügen und alle Module ohne Einschränkungen testen. Nach Ablauf der Testphase können Sie sich entscheiden zu abonnieren oder Ihre Daten zu exportieren.',
    },
    {
      id: 'pricing-3',
      category: 'pricing',
      question: 'Gibt es zusätzliche Kosten pro Mitarbeiter oder Organisation?',
      answer: 'Nein, unsere Preise sind transparent und fest basierend auf Ihrem gewählten Plan. Der Starter-Plan umfasst bis zu 100 Mitarbeiter, Professional bis zu 500 und Enterprise ist unbegrenzt. Wir berechnen keine versteckten Gebühren für zusätzliche Benutzer, Dokumentenspeicherung oder Anzahl der generierten Berichte. Das Upgrade zwischen Plänen ist einfach und sofort.',
    },
    {
      id: 'pricing-4',
      category: 'pricing',
      question: 'Kann ich mein Abonnement jederzeit kündigen?',
      answer: 'Ja, Abonnements können jederzeit ohne Strafen oder Kündigungsgebühren gekündigt werden. Sie haben bis zum Ende Ihres bereits bezahlten Abrechnungszeitraums Zugriff auf die Plattform. Vor der Kündigung können Sie alle Daten in Standardformaten (Excel, PDF, JSON) exportieren. Wenn Sie Ihr Konto innerhalb von 30 Tagen reaktivieren, werden alle Daten vollständig wiederhergestellt.',
    },
    {
      id: 'pricing-5',
      category: 'pricing',
      question: 'Bieten Sie Rabatte für jährliche Abonnements an?',
      answer: 'Ja, jährliche Abonnements erhalten 20% Rabatt im Vergleich zu monatlichen Zahlungen. Wir bieten auch Sonderrabatte für NGOs, Bildungseinrichtungen und Agenturen mit über 50 aktiven Kunden an. Die Zahlung kann per Karte, Banküberweisung oder E-Rechnung erfolgen. Alle Rechnungen werden gemäß den Steuervorschriften ausgestellt und enthalten die Mehrwertsteuer.',
    },

    // Features (5)
    {
      id: 'features-1',
      category: 'features',
      question: 'Welche Hauptmodule bietet die Plattform?',
      answer: 'Die Plattform umfasst Module für Mitarbeiterverwaltung, medizinische Untersuchungen, Arbeitsschutz-/Brandschutzschulungen, Schutzausrüstung, Dokumente und Register, Warnungen und Benachrichtigungen, Vorfälle und Unfälle, Inspektionen, Prüfpfad und erweiterte Berichterstattung. Jedes Modul ist vollständig integriert und ermöglicht automatisierte Arbeitsabläufe. Daten werden in Echtzeit über alle Module synchronisiert.',
    },
    {
      id: 'features-2',
      category: 'features',
      question: 'Wie funktioniert das Warn- und Benachrichtigungssystem?',
      answer: 'Das System sendet automatische Warnungen per E-Mail, SMS und In-App-Benachrichtigungen für wichtige Ereignisse: Ablauf medizinischer Untersuchungen, Schulungsfristen, geplante Inspektionen, abgelaufene Dokumente oder gemeldete Vorfälle. Jeder Benutzer kann Benachrichtigungspräferenzen und Warnhäufigkeit konfigurieren. Warnungen werden 30, 15 und 7 Tage vor Ablauf sowie am Fälligkeitsdatum gesendet.',
    },
    {
      id: 'features-3',
      category: 'features',
      question: 'Kann ich benutzerdefinierte Berichte erstellen?',
      answer: 'Ja, das Berichtsmodul ermöglicht die Erstellung vollständig anpassbarer Berichte mit Filterung nach Organisation, Zeitraum, Abteilung, Ereignistyp und vielen anderen Kriterien. Berichte können zur externen Analyse in Excel, PDF oder CSV exportiert werden. Es gibt vordefinierte Vorlagen für monatliche, vierteljährliche und jährliche Pflichtberichte gemäß Gesetzgebung. Diagramme und visuelle Dashboards erleichtern die schnelle Analyse.',
    },
    {
      id: 'features-4',
      category: 'features',
      question: 'Ist eine mobile App verfügbar?',
      answer: 'Die Plattform ist vollständig responsiv und funktioniert perfekt auf jedem mobilen Gerät über den Browser (Progressive Web App). Sie können die App zum Startbildschirm Ihres Telefons für schnellen Zugriff mit teilweiser Offline-Funktionalität hinzufügen. Kernfunktionen sind für Touch und kleine Bildschirme optimiert. Eine native iOS- und Android-App befindet sich in der Entwicklung und wird 2026 veröffentlicht.',
    },
    {
      id: 'features-5',
      category: 'features',
      question: 'Können Sie die Plattform mit anderen Systemen integrieren?',
      answer: 'Ja, wir bieten eine vollständig dokumentierte REST-API für Integrationen mit HR-, ERP-, CRM- oder anderen Verwaltungsplattformen. Wir unterstützen Webhooks für Echtzeitbenachrichtigungen an Drittanbieteranwendungen. Vorgefertigte Integrationen existieren für beliebte Buchhaltungs- und Lohnabrechnungssysteme in Rumänien. Unser technisches Team kann bei der Implementierung benutzerdefinierter Integrationen helfen.',
    },

    // Security (5)
    {
      id: 'security-1',
      category: 'security',
      question: 'Wie werden meine Daten geschützt?',
      answer: 'Alle Daten sind während der Übertragung (TLS 1.3) und im Ruhezustand (AES-256) verschlüsselt. Wir nutzen die Supabase-Infrastruktur mit automatischen täglichen Backups und geografischer Replikation. Der Datenzugriff wird durch Row Level Security (RLS) auf Datenbankebene kontrolliert und gewährleistet vollständige Isolation zwischen Organisationen. Die Server befinden sich in Europa (Frankfurt) für DSGVO-Konformität.',
    },
    {
      id: 'security-2',
      category: 'security',
      question: 'Wer hat Zugriff auf die Daten meiner Organisation?',
      answer: 'Nur autorisierte Benutzer aus Ihrer Organisation haben gemäß konfigurierten Rollen und Berechtigungen Zugriff auf Daten. Arbeitsschutzberater haben nur Zugriff auf Organisationen, für die sie ein aktives Mandat haben. Plattformadministratoren können nicht ohne ausdrückliche Zustimmung und vollständigen Prüfpfad auf Kundendaten zugreifen. Alle Zugriffe werden im Audit-Log mit Zeitstempel und IP aufgezeichnet.',
    },
    {
      id: 'security-3',
      category: 'security',
      question: 'Was passiert, wenn ich mein Passwort vergesse?',
      answer: 'Sie können Ihr Passwort jederzeit über die Funktion "Passwort vergessen" auf der Login-Seite zurücksetzen und erhalten einen Zurücksetzungslink per E-Mail. Der Link ist 1 Stunde gültig und kann nur einmal verwendet werden. Passwörter sind mit modernen Algorithmen (bcrypt) gehasht und können nicht wiederhergestellt, sondern nur zurückgesetzt werden. Für maximale Sicherheit empfehlen wir die Aktivierung der Zwei-Faktor-Authentifizierung (2FA).',
    },
    {
      id: 'security-4',
      category: 'security',
      question: 'Bieten Sie Zwei-Faktor-Authentifizierung (2FA) an?',
      answer: 'Ja, 2FA ist über Authentifizierungs-Apps wie Google Authenticator, Authy oder Microsoft Authenticator verfügbar. Nach der Aktivierung geben Sie bei jeder Anmeldung zusätzlich zu Ihrem Passwort den von der App generierten Code ein. 2FA ist für administrative Rollen verpflichtend und für normale Benutzer optional. Backup-Codes werden für Notfallsituationen generiert.',
    },
    {
      id: 'security-5',
      category: 'security',
      question: 'Wie oft erstellen Sie Backups der Daten?',
      answer: 'Vollständige automatische Backups werden täglich durchgeführt, mit 30-tägiger Aufbewahrung zur Wiederherstellung. Inkrementelle Backups werden alle 6 Stunden für minimalen Datenverlust erstellt. Alle Backups sind verschlüsselt und in separaten geografischen Regionen gespeichert. Wir testen monatlich Disaster-Recovery-Verfahren, um eine Wiederherstellungszeit unter 4 Stunden zu garantieren.',
    },

    // Legal/GDPR (5)
    {
      id: 'legal-1',
      category: 'legal',
      question: 'Ist die Plattform DSGVO-konform?',
      answer: 'Ja, die Plattform ist zu 100% konform mit der DSGVO und der rumänischen Datenschutzgesetzgebung. Wir implementieren Privacy by Design und Privacy by Default Prinzipien im gesamten Code. Wir bieten vollständige Funktionalitäten für Auskunfts-, Berichtigungs-, Lösch- und Datenportabilitätsrechte. Wir beauftragen DSGVO-zertifizierte Subunternehmer und führen ein aktualisiertes Verzeichnis der Verarbeitungstätigkeiten.',
    },
    {
      id: 'legal-2',
      category: 'legal',
      question: 'Wie kann ich alle Organisationsdaten exportieren oder löschen?',
      answer: 'Über das Verwaltungspanel, Abschnitt Organisationseinstellungen, können Sie alle Daten im JSON- oder strukturierten Excel-Format exportieren. Der Export umfasst Mitarbeiter, Schulungen, Dokumente, medizinische Untersuchungen und vollständige Historie. Die vollständige Datenlöschung erfolgt auf schriftliche Anfrage an suport@s-s-m.ro, verarbeitet innerhalb von maximal 30 Tagen. Die Löschung ist nach Bestätigung endgültig und unwiderruflich.',
    },
    {
      id: 'legal-3',
      category: 'legal',
      question: 'Wo werden die Daten physisch gespeichert?',
      answer: 'Alle Daten werden in zertifizierten Rechenzentren in Frankfurt, Deutschland, auf Supabase/AWS-Infrastruktur gespeichert. Daten verlassen niemals das Gebiet der Europäischen Union und gewährleisten vollständige DSGVO-Konformität. Backups werden zur Redundanz in der Region Amsterdam repliziert. Wir übertragen keine Daten in Drittländer ohne angemessene Schutzmechanismen.',
    },
    {
      id: 'legal-4',
      category: 'legal',
      question: 'Welche rechtlichen Dokumente unterschreibe ich bei der Registrierung?',
      answer: 'Bei der Registrierung akzeptieren Sie die Nutzungsbedingungen und die Datenschutzerklärung, die öffentlich auf der Website zugänglich sind. Für die Datenverarbeitungsbeziehung wird automatisch eine Auftragsverarbeitungsvereinbarung (AV-Vertrag) gemäß Art. 28 DSGVO geschlossen. Dokumente sind jederzeit in Ihrem Konto verfügbar und können im PDF-Format heruntergeladen werden. Änderungen werden 30 Tage im Voraus mitgeteilt.',
    },
    {
      id: 'legal-5',
      category: 'legal',
      question: 'Wie melden Sie Sicherheitsvorfälle?',
      answer: 'Bei einem Sicherheitsvorfall, der personenbezogene Daten betrifft, benachrichtigen wir die zuständigen Behörden (ANSPDCP in Rumänien) innerhalb von maximal 72 Stunden gemäß DSGVO. Betroffene Kunden werden sofort per E-Mail und Plattformbenachrichtigung mit vollständigen Details über den Vorfall, betroffene Daten und ergriffene Maßnahmen informiert. Wir unterhalten einen vierteljährlich getesteten Vorfallreaktionsplan.',
    },

    // Technical (5)
    {
      id: 'technical-1',
      category: 'technical',
      question: 'Welche Technologien verwendet die Plattform?',
      answer: 'Die Plattform ist mit Next.js 14 (modernes React-Framework), Supabase (PostgreSQL mit RLS), TypeScript für Typsicherheit, Tailwind CSS für Styling und Vercel für globale Bereitstellung gebaut. Das Backend verwendet Serverless-Funktionen für unendliche Skalierbarkeit. Alle Komponenten sind Open-Source oder Commercial Grade, ohne Vendor Lock-in. Die Architektur ist modular und ermöglicht Upgrades ohne Ausfallzeiten.',
    },
    {
      id: 'technical-2',
      category: 'technical',
      question: 'Was sind die Systemanforderungen für den Zugriff auf die Plattform?',
      answer: 'Die Plattform funktioniert in jedem modernen Browser (Chrome, Firefox, Safari, Edge) der letzten 2 Jahre. Wir empfehlen eine Internetverbindung von mindestens 2 Mbps für optimale Erfahrung. Es ist keine Softwareinstallation oder Plugins erforderlich. Für volle Funktionalität aktivieren Sie JavaScript und Cookies in Ihrem Browser. Minimale empfohlene Auflösung: 1280x720px.',
    },
    {
      id: 'technical-3',
      category: 'technical',
      question: 'Wie schnell ist die Plattform?',
      answer: 'Die Plattform hat eine Ladezeit unter 2 Sekunden für die meisten Seiten dank Vercels globalem CDN. Wir verwenden Server-Side-Rendering und automatische Bildoptimierungen. Die Reaktion auf Benutzeraktionen ist durch intelligentes Caching und Hintergrundsynchronisation sofort. Die Leistung wird 24/7 mit einem Ziel von 99,9% Betriebszeit überwacht. Komplexe Dashboards laden progressiv für sofortiges Feedback.',
    },
    {
      id: 'technical-4',
      category: 'technical',
      question: 'Bietet die Plattform eine API für Integrationen?',
      answer: 'Ja, wir bieten eine vollständig dokumentierte REST-API mit JWT-Token-Authentifizierung. Die API ermöglicht CRUD-Operationen auf allen Entitäten (Mitarbeiter, Schulungen, Dokumente usw.) mit konfigurierbarer Ratenbegrenzung. Interaktive Dokumentation ist verfügbar unter api.s-s-m.ro mit Beispielen in mehreren Programmiersprachen. Webhooks ermöglichen Echtzeitbenachrichtigungen an Ihre externen Systeme.',
    },
    {
      id: 'technical-5',
      category: 'technical',
      question: 'Wie handhaben Sie Updates und Wartung?',
      answer: 'Neue Bereitstellungen erfolgen wöchentlich außerhalb der Spitzenzeiten, ohne Ausfallzeiten durch Blue-Green-Deployment. Größere Updates werden 7 Tage im Voraus per E-Mail und in der Plattform angekündigt. Geplante Wartung ist nachts am Wochenende mit maximaler Dauer von 2 Stunden geplant. Wir verwenden Feature-Flags, um neue Funktionen schrittweise zu aktivieren und in der Produktion ohne Auswirkungen zu testen. Automatisches Rollback bei Fehlererkennung.',
    },
  ],

  // FRENCH
  fr: [
    // General (5)
    {
      id: 'general-1',
      category: 'general',
      question: 'Qu\'est-ce que la plateforme s-s-m.ro ?',
      answer: 'La plateforme s-s-m.ro est une solution numérique complète pour la gestion de la conformité en matière de santé et sécurité au travail (SST) et de sécurité incendie. Nous fournissons des outils pour les consultants SST et leurs entreprises clientes en Roumanie, Bulgarie, Hongrie et Allemagne. La plateforme numérise les processus de conformité, les dossiers du personnel, les documents juridiques, les formations et les inspections. Tout est accessible 24h/24 et 7j/7 depuis n\'importe quel endroit avec une connexion Internet.',
    },
    {
      id: 'general-2',
      category: 'general',
      question: 'Qui peut utiliser cette plateforme ?',
      answer: 'La plateforme est conçue pour les consultants SST/sécurité incendie certifiés et les entreprises qu\'ils servent. Les consultants peuvent gérer plusieurs organisations et employés depuis un seul compte. Les administrateurs d\'entreprise peuvent surveiller la conformité et accéder aux rapports. Les employés peuvent consulter leurs formations, examens médicaux et équipements assignés. Chaque rôle dispose de permissions spécifiques configurables.',
    },
    {
      id: 'general-3',
      category: 'general',
      question: 'Dans quels pays la plateforme fonctionne-t-elle ?',
      answer: 'La plateforme fonctionne en Roumanie, Bulgarie, Hongrie et Allemagne, avec un support complet de la législation locale de chaque pays. L\'interface est disponible en roumain, anglais, bulgare, hongrois et allemand. Tous les documents et rapports respectent les exigences légales spécifiques de chaque juridiction. Nous prévoyons une expansion vers d\'autres pays européens à l\'avenir.',
    },
    {
      id: 'general-4',
      category: 'general',
      question: 'Comment puis-je m\'inscrire et commencer à utiliser la plateforme ?',
      answer: 'L\'inscription est simple et rapide : visitez app.s-s-m.ro et créez un compte avec votre email et un mot de passe. Après activation de votre compte par email, complétez votre profil de consultant ou d\'entreprise. Vous pouvez immédiatement ajouter des organisations, des employés et commencer à configurer les modules nécessaires. Nous offrons également une période d\'essai gratuite pour tester toutes les fonctionnalités.',
    },
    {
      id: 'general-5',
      category: 'general',
      question: 'Puis-je migrer des données existantes vers la plateforme ?',
      answer: 'Oui, nous offrons un support complet pour la migration de données existantes depuis Excel, PDF ou d\'autres systèmes. Notre équipe peut vous aider à importer des registres d\'employés, l\'historique des formations, les examens médicaux et les documents existants. Le processus de migration est sécurisé et vérifié pour l\'exactitude. Les données sont automatiquement structurées selon les exigences de la plateforme et la législation.',
    },

    // Pricing (5)
    {
      id: 'pricing-1',
      category: 'pricing',
      question: 'Quels sont les plans d\'abonnement disponibles ?',
      answer: 'Nous proposons trois plans principaux : Starter (pour les consultants individuels avec jusqu\'à 3 organisations), Professional (pour les consultants avec 3-20 organisations) et Enterprise (pour les grandes agences avec des clients illimités). Chaque plan inclut des fonctionnalités de base comme la gestion des employés, les formations, les examens médicaux et les documents. Les plans supérieurs offrent des rapports avancés, l\'accès API, des options white-label et un support prioritaire.',
    },
    {
      id: 'pricing-2',
      category: 'pricing',
      question: 'Y a-t-il une période d\'essai gratuite ?',
      answer: 'Oui, nous offrons 14 jours d\'essai gratuit pour tous les plans, sans carte de crédit requise. Pendant la période d\'essai, vous avez un accès complet à toutes les fonctionnalités de votre plan sélectionné. Vous pouvez ajouter des organisations, des employés et tester tous les modules sans restrictions. Après l\'expiration de l\'essai, vous pouvez choisir de vous abonner ou d\'exporter vos données.',
    },
    {
      id: 'pricing-3',
      category: 'pricing',
      question: 'Y a-t-il des coûts supplémentaires par employé ou organisation ?',
      answer: 'Non, nos prix sont transparents et fixes selon votre plan choisi. Le plan Starter inclut jusqu\'à 100 employés, Professional jusqu\'à 500, et Enterprise est illimité. Nous ne facturons pas de frais cachés pour les utilisateurs supplémentaires, le stockage de documents ou le nombre de rapports générés. La mise à niveau entre les plans est simple et instantanée.',
    },
    {
      id: 'pricing-4',
      category: 'pricing',
      question: 'Puis-je annuler mon abonnement à tout moment ?',
      answer: 'Oui, les abonnements peuvent être annulés à tout moment sans pénalités ni frais d\'annulation. Vous aurez accès à la plateforme jusqu\'à la fin de votre période de facturation déjà payée. Avant l\'annulation, vous pouvez exporter toutes les données dans des formats standard (Excel, PDF, JSON). Si vous réactivez votre compte dans les 30 jours, toutes les données seront entièrement restaurées.',
    },
    {
      id: 'pricing-5',
      category: 'pricing',
      question: 'Offrez-vous des réductions pour les abonnements annuels ?',
      answer: 'Oui, les abonnements annuels bénéficient d\'une réduction de 20% par rapport aux paiements mensuels. Nous offrons également des réductions spéciales pour les ONG, les institutions éducatives et les agences avec plus de 50 clients actifs. Le paiement peut être effectué par carte, virement bancaire ou facture électronique. Toutes les factures sont émises conformément à la législation fiscale et incluent la TVA.',
    },

    // Features (5)
    {
      id: 'features-1',
      category: 'features',
      question: 'Quels sont les principaux modules offerts par la plateforme ?',
      answer: 'La plateforme comprend des modules pour la gestion des employés, les examens médicaux, les formations SST/sécurité incendie, les équipements de protection, les documents et registres, les alertes et notifications, les incidents et accidents, les inspections, la piste d\'audit et les rapports avancés. Chaque module est entièrement intégré et permet des flux de travail automatisés. Les données sont synchronisées en temps réel entre tous les modules.',
    },
    {
      id: 'features-2',
      category: 'features',
      question: 'Comment fonctionne le système d\'alertes et de notifications ?',
      answer: 'Le système envoie des alertes automatiques par email, SMS et notifications dans l\'application pour les événements importants : expirations d\'examens médicaux, échéances de formations, inspections programmées, documents expirés ou incidents signalés. Chaque utilisateur peut configurer ses préférences de notification et la fréquence des alertes. Les alertes sont envoyées 30, 15 et 7 jours avant l\'expiration, ainsi qu\'à la date d\'échéance.',
    },
    {
      id: 'features-3',
      category: 'features',
      question: 'Puis-je générer des rapports personnalisés ?',
      answer: 'Oui, le module de reporting permet la création de rapports entièrement personnalisables avec filtrage par organisation, période, département, type d\'événement et de nombreux autres critères. Les rapports peuvent être exportés en Excel, PDF ou CSV pour analyse externe. Des modèles prédéfinis existent pour les rapports mensuels, trimestriels et annuels obligatoires selon la législation. Les graphiques et tableaux de bord visuels facilitent l\'analyse rapide.',
    },
    {
      id: 'features-4',
      category: 'features',
      question: 'Une application mobile est-elle disponible ?',
      answer: 'La plateforme est entièrement responsive et fonctionne parfaitement sur tout appareil mobile via le navigateur (Progressive Web App). Vous pouvez ajouter l\'application à l\'écran d\'accueil de votre téléphone pour un accès rapide avec fonctionnalité hors ligne partielle. Les fonctionnalités principales sont optimisées pour le tactile et les petits écrans. Une application native iOS et Android est en développement et sera lancée en 2026.',
    },
    {
      id: 'features-5',
      category: 'features',
      question: 'Pouvez-vous intégrer la plateforme avec d\'autres systèmes ?',
      answer: 'Oui, nous offrons une API REST entièrement documentée pour les intégrations avec les systèmes RH, ERP, CRM ou autres plateformes de gestion. Nous supportons les webhooks pour les notifications en temps réel vers des applications tierces. Des intégrations préétablies existent pour les systèmes de comptabilité et de paie populaires en Roumanie. Notre équipe technique peut vous aider avec l\'implémentation d\'intégrations personnalisées.',
    },

    // Security (5)
    {
      id: 'security-1',
      category: 'security',
      question: 'Comment mes données sont-elles protégées ?',
      answer: 'Toutes les données sont chiffrées en transit (TLS 1.3) et au repos (AES-256). Nous utilisons l\'infrastructure Supabase avec sauvegardes automatiques quotidiennes et réplication géographique. L\'accès aux données est contrôlé par Row Level Security (RLS) au niveau de la base de données, assurant une isolation complète entre les organisations. Les serveurs sont en Europe (Francfort) pour la conformité RGPD.',
    },
    {
      id: 'security-2',
      category: 'security',
      question: 'Qui a accès aux données de mon organisation ?',
      answer: 'Seuls les utilisateurs autorisés de votre organisation ont accès aux données, selon les rôles et permissions configurés. Les consultants SST n\'ont accès qu\'aux organisations pour lesquelles ils ont un mandat actif. Les administrateurs de la plateforme ne peuvent pas accéder aux données clients sans consentement explicite et piste d\'audit complète. Tous les accès sont enregistrés dans le journal d\'audit avec horodatage et IP.',
    },
    {
      id: 'security-3',
      category: 'security',
      question: 'Que se passe-t-il si j\'oublie mon mot de passe ?',
      answer: 'Vous pouvez réinitialiser votre mot de passe à tout moment via la fonction "Mot de passe oublié" sur la page de connexion, en recevant un lien de réinitialisation par email. Le lien est valable 1 heure et ne peut être utilisé qu\'une seule fois. Les mots de passe sont hachés avec des algorithmes modernes (bcrypt) et ne peuvent pas être récupérés, seulement réinitialisés. Pour une sécurité maximale, nous recommandons d\'activer l\'authentification à deux facteurs (2FA).',
    },
    {
      id: 'security-4',
      category: 'security',
      question: 'Offrez-vous l\'authentification à deux facteurs (2FA) ?',
      answer: 'Oui, la 2FA est disponible via des applications d\'authentification comme Google Authenticator, Authy ou Microsoft Authenticator. Après activation, vous entrerez le code généré par l\'application à chaque connexion en plus de votre mot de passe. La 2FA est obligatoire pour les rôles administratifs et optionnelle pour les utilisateurs réguliers. Des codes de secours sont générés pour les situations d\'urgence.',
    },
    {
      id: 'security-5',
      category: 'security',
      question: 'À quelle fréquence effectuez-vous des sauvegardes de données ?',
      answer: 'Des sauvegardes automatiques complètes sont effectuées quotidiennement, avec une rétention de 30 jours pour la récupération. Des sauvegardes incrémentielles sont effectuées toutes les 6 heures pour une perte de données minimale. Toutes les sauvegardes sont chiffrées et stockées dans des régions géographiques séparées. Nous testons mensuellement les procédures de reprise après sinistre pour garantir un temps de récupération inférieur à 4 heures.',
    },

    // Legal/GDPR (5)
    {
      id: 'legal-1',
      category: 'legal',
      question: 'La plateforme est-elle conforme au RGPD ?',
      answer: 'Oui, la plateforme est 100% conforme au RGPD et à la législation roumaine sur la protection des données. Nous implémentons les principes de privacy by design et by default dans tout le code. Nous offrons des fonctionnalités complètes pour les droits d\'accès, de rectification, d\'effacement et de portabilité des données. Nous contractons avec des sous-traitants certifiés RGPD et maintenons un registre des activités de traitement à jour.',
    },
    {
      id: 'legal-2',
      category: 'legal',
      question: 'Comment puis-je exporter ou supprimer toutes les données de l\'organisation ?',
      answer: 'Depuis le panneau d\'administration, section Paramètres de l\'organisation, vous pouvez exporter toutes les données au format JSON ou Excel structuré. L\'export inclut les employés, formations, documents, examens médicaux et l\'historique complet. La suppression complète des données se fait par demande écrite à suport@s-s-m.ro, traitée dans un délai maximum de 30 jours. La suppression est définitive et irréversible après confirmation.',
    },
    {
      id: 'legal-3',
      category: 'legal',
      question: 'Où sont stockées physiquement les données ?',
      answer: 'Toutes les données sont stockées dans des centres de données certifiés à Francfort, Allemagne, sur l\'infrastructure Supabase/AWS. Les données ne quittent jamais le territoire de l\'Union européenne, assurant une conformité RGPD complète. Les sauvegardes sont répliquées dans la région d\'Amsterdam pour la redondance. Nous ne transférons pas de données vers des pays tiers sans mécanismes de protection adéquats.',
    },
    {
      id: 'legal-4',
      category: 'legal',
      question: 'Quels documents juridiques dois-je signer lors de l\'inscription ?',
      answer: 'Lors de l\'inscription, vous acceptez les Conditions Générales d\'Utilisation et la Politique de Confidentialité, accessibles publiquement sur le site. Pour la relation de traitement des données, un Accord de Traitement des Données (DPA) est automatiquement conclu selon l\'art. 28 RGPD. Les documents sont disponibles à tout moment dans votre compte et peuvent être téléchargés au format PDF. Les modifications sont notifiées 30 jours à l\'avance.',
    },
    {
      id: 'legal-5',
      category: 'legal',
      question: 'Comment signalez-vous les incidents de sécurité ?',
      answer: 'En cas d\'incident de sécurité affectant des données personnelles, nous notifions les autorités compétentes (ANSPDCP en Roumanie) dans un délai maximum de 72 heures conformément au RGPD. Les clients affectés sont informés immédiatement par email et notification dans la plateforme avec des détails complets sur l\'incident, les données affectées et les mesures prises. Nous maintenons un plan de réponse aux incidents testé trimestriellement.',
    },

    // Technical (5)
    {
      id: 'technical-1',
      category: 'technical',
      question: 'Quelles technologies utilise la plateforme ?',
      answer: 'La plateforme est construite avec Next.js 14 (framework React moderne), Supabase (PostgreSQL avec RLS), TypeScript pour la sécurité des types, Tailwind CSS pour le styling et Vercel pour le déploiement global. Le backend utilise des fonctions serverless pour une évolutivité infinie. Tous les composants sont open-source ou commercial grade, sans vendor lock-in. L\'architecture est modulaire et permet des mises à niveau sans interruption.',
    },
    {
      id: 'technical-2',
      category: 'technical',
      question: 'Quelles sont les exigences système pour accéder à la plateforme ?',
      answer: 'La plateforme fonctionne dans tout navigateur moderne (Chrome, Firefox, Safari, Edge) des 2 dernières années. Nous recommandons une connexion Internet d\'au moins 2 Mbps pour une expérience optimale. Aucune installation de logiciel ou de plugins n\'est nécessaire. Pour une fonctionnalité complète, activez JavaScript et les cookies dans votre navigateur. Résolution minimale recommandée : 1280x720px.',
    },
    {
      id: 'technical-3',
      category: 'technical',
      question: 'Quelle est la rapidité de la plateforme ?',
      answer: 'La plateforme a un temps de chargement inférieur à 2 secondes pour la plupart des pages grâce au CDN global de Vercel. Nous utilisons le rendu côté serveur et les optimisations automatiques d\'images. La réponse aux actions utilisateur est instantanée grâce à la mise en cache intelligente et à la synchronisation en arrière-plan. Les performances sont surveillées 24h/24 et 7j/7 avec un objectif de disponibilité de 99,9%. Les tableaux de bord complexes se chargent progressivement pour un retour immédiat.',
    },
    {
      id: 'technical-4',
      category: 'technical',
      question: 'La plateforme offre-t-elle une API pour les intégrations ?',
      answer: 'Oui, nous offrons une API REST entièrement documentée avec authentification par tokens JWT. L\'API permet des opérations CRUD sur toutes les entités (employés, formations, documents, etc.) avec limitation de débit configurable. La documentation interactive est disponible sur api.s-s-m.ro avec des exemples dans plusieurs langages de programmation. Les webhooks permettent des notifications en temps réel vers vos systèmes externes.',
    },
    {
      id: 'technical-5',
      category: 'technical',
      question: 'Comment gérez-vous les mises à jour et la maintenance ?',
      answer: 'Les nouveaux déploiements sont effectués hebdomadairement en dehors des heures de pointe, sans interruption grâce au déploiement blue-green. Les mises à jour majeures sont annoncées 7 jours à l\'avance par email et dans la plateforme. La maintenance planifiée est programmée la nuit pendant le week-end avec une durée maximale de 2 heures. Nous utilisons des feature flags pour activer progressivement les nouvelles fonctionnalités et tester en production sans impact. Retour en arrière automatique lors de la détection d\'erreurs.',
    },
  ],
};

export const categoryLabels: Record<FaqCategory, Record<string, string>> = {
  general: {
    ro: 'General',
    en: 'General',
    bg: 'Общи',
    hu: 'Általános',
    de: 'Allgemein',
    fr: 'Général',
  },
  pricing: {
    ro: 'Prețuri & Abonamente',
    en: 'Pricing & Plans',
    bg: 'Цени и Планове',
    hu: 'Árazás és Csomagok',
    de: 'Preise & Pläne',
    fr: 'Tarifs & Abonnements',
  },
  features: {
    ro: 'Funcționalități',
    en: 'Features',
    bg: 'Функционалности',
    hu: 'Funkciók',
    de: 'Funktionen',
    fr: 'Fonctionnalités',
  },
  security: {
    ro: 'Securitate & Confidențialitate',
    en: 'Security & Privacy',
    bg: 'Сигурност и Поверителност',
    hu: 'Biztonság és Adatvédelem',
    de: 'Sicherheit & Datenschutz',
    fr: 'Sécurité & Confidentialité',
  },
  legal: {
    ro: 'Legal & GDPR',
    en: 'Legal & GDPR',
    bg: 'Правни и GDPR',
    hu: 'Jogi és GDPR',
    de: 'Rechtliches & DSGVO',
    fr: 'Juridique & RGPD',
  },
  technical: {
    ro: 'Tehnic & Integrări',
    en: 'Technical & Integrations',
    bg: 'Технически и Интеграции',
    hu: 'Technikai és Integrációk',
    de: 'Technisch & Integrationen',
    fr: 'Technique & Intégrations',
  },
};

export default faqContent;
