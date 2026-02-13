export type FAQCategory =
  | 'general'
  | 'platform'
  | 'legislation'
  | 'pricing'
  | 'technical'
  | 'security';

export interface FAQItem {
  id: string;
  category: FAQCategory;
  question: {
    ro: string;
    en: string;
  };
  answer: {
    ro: string;
    en: string;
  };
  relatedQuestions: string[];
}

export const faqCategories: Record<FAQCategory, { ro: string; en: string }> = {
  general: {
    ro: 'General',
    en: 'General'
  },
  platform: {
    ro: 'Funcționare Platformă',
    en: 'Platform Features'
  },
  legislation: {
    ro: 'Legislație',
    en: 'Legislation'
  },
  pricing: {
    ro: 'Prețuri',
    en: 'Pricing'
  },
  technical: {
    ro: 'Tehnic',
    en: 'Technical'
  },
  security: {
    ro: 'Securitate',
    en: 'Security'
  }
};

export const faqData: FAQItem[] = [
  // GENERAL (5)
  {
    id: 'gen-01',
    category: 'general',
    question: {
      ro: 'Ce este platforma s-s-m.ro?',
      en: 'What is the s-s-m.ro platform?'
    },
    answer: {
      ro: 'S-s-m.ro este o platformă digitală pentru managementul compliance-ului SSM (Securitate și Sănătate în Muncă) și PSI (Prevenire și Stingere Incendii). Platforma ajută consultanții SSM și firmele lor să gestioneze eficient documentația, training-urile, examinările medicale și echipamentele de protecție. Este disponibilă în 5 limbi (RO, EN, BG, HU, DE) și deservește clienți din România, Bulgaria, Ungaria și Germania.',
      en: 'S-s-m.ro is a digital platform for managing OSH (Occupational Safety and Health) and fire safety compliance. The platform helps OSH consultants and their client companies efficiently manage documentation, training sessions, medical examinations, and protective equipment. It is available in 5 languages (RO, EN, BG, HU, DE) and serves clients from Romania, Bulgaria, Hungary, and Germany.'
    },
    relatedQuestions: ['gen-02', 'plat-01', 'gen-05']
  },
  {
    id: 'gen-02',
    category: 'general',
    question: {
      ro: 'Cine poate folosi platforma?',
      en: 'Who can use the platform?'
    },
    answer: {
      ro: 'Platforma este destinată consultanților SSM/PSI și firmelor cu care colaborează. Există trei tipuri principale de utilizatori: consultanți (care gestionează mai multe firme), administratori de firmă (care gestionează propria organizație) și angajați (care vizualizează propriile date - training-uri, examene medicale, echipamente). Fiecare tip de utilizator are acces la funcționalități specifice rolului său.',
      en: 'The platform is designed for OSH/fire safety consultants and the companies they work with. There are three main user types: consultants (who manage multiple companies), company administrators (who manage their own organization), and employees (who view their own data - trainings, medical exams, equipment). Each user type has access to role-specific functionalities.'
    },
    relatedQuestions: ['gen-03', 'sec-02', 'plat-02']
  },
  {
    id: 'gen-03',
    category: 'general',
    question: {
      ro: 'Cum mă înregistrez pe platformă?',
      en: 'How do I register on the platform?'
    },
    answer: {
      ro: 'Înregistrarea se face prin crearea unui cont cu email și parolă. După înregistrare, veți primi un email de confirmare. Consultanții SSM pot crea imediat organizații și invita membri. Administratorii de firmă și angajații primesc invitații de la consultantul lor sau administratorul organizației. Ulterior vă puteți completa profilul cu date suplimentare și seta preferințele.',
      en: 'Registration is done by creating an account with email and password. After registration, you will receive a confirmation email. OSH consultants can immediately create organizations and invite members. Company administrators and employees receive invitations from their consultant or organization administrator. You can then complete your profile with additional information and set preferences.'
    },
    relatedQuestions: ['gen-02', 'sec-01', 'tech-01']
  },
  {
    id: 'gen-04',
    category: 'general',
    question: {
      ro: 'Este platforma disponibilă pe mobil?',
      en: 'Is the platform available on mobile?'
    },
    answer: {
      ro: 'Da, platforma este complet responsivă și funcționează pe toate dispozitivele - desktop, tabletă și smartphone. Interfața se adaptează automat la dimensiunea ecranului pentru o experiență optimă. Nu este necesară instalarea unei aplicații separate - puteți accesa platforma direct din browser-ul dispozitivului mobil. Toate funcționalitățile sunt disponibile pe mobil.',
      en: 'Yes, the platform is fully responsive and works on all devices - desktop, tablet, and smartphone. The interface automatically adapts to screen size for an optimal experience. No separate app installation is required - you can access the platform directly from your mobile device\'s browser. All functionalities are available on mobile.'
    },
    relatedQuestions: ['tech-02', 'gen-01', 'tech-05']
  },
  {
    id: 'gen-05',
    category: 'general',
    question: {
      ro: 'Ce limbi sunt suportate?',
      en: 'What languages are supported?'
    },
    answer: {
      ro: 'Platforma suportă cinci limbi: Română (RO - limba implicită), Engleză (EN), Bulgară (BG), Maghiară (HU) și Germană (DE). Puteți schimba limba din setările profilului dvs. Toate textele interfeței, mesajele și documentația sunt traduse în aceste limbi. Această funcționalitate facilitează colaborarea cu clienți din România, Bulgaria, Ungaria și Germania.',
      en: 'The platform supports five languages: Romanian (RO - default language), English (EN), Bulgarian (BG), Hungarian (HU), and German (DE). You can change the language from your profile settings. All interface texts, messages, and documentation are translated into these languages. This functionality facilitates collaboration with clients from Romania, Bulgaria, Hungary, and Germany.'
    },
    relatedQuestions: ['gen-01', 'plat-05', 'tech-03']
  },

  // PLATFORM FEATURES (5)
  {
    id: 'plat-01',
    category: 'platform',
    question: {
      ro: 'Ce funcționalități oferă platforma?',
      en: 'What functionalities does the platform offer?'
    },
    answer: {
      ro: 'Platforma oferă management complet SSM/PSI: gestionarea angajaților și a datelor lor, programarea și urmărirea training-urilor obligatorii, urmărirea examinărilor medicale și a termenelor de reînnoire, management echipamente de protecție și urmărire stocuri, sistem de alerte și notificări automate pentru termene apropiate, și generare rapoarte și documentație specifică legislației din România, Bulgaria, Ungaria și Germania. De asemenea, include audit log complet pentru trasabilitate.',
      en: 'The platform offers complete OSH/fire safety management: employee data management, scheduling and tracking mandatory trainings, tracking medical examinations and renewal deadlines, protective equipment management and inventory tracking, automated alerts and notification system for upcoming deadlines, and report and documentation generation specific to legislation in Romania, Bulgaria, Hungary, and Germany. It also includes comprehensive audit logging for traceability.'
    },
    relatedQuestions: ['plat-02', 'plat-03', 'gen-01']
  },
  {
    id: 'plat-02',
    category: 'platform',
    question: {
      ro: 'Cum funcționează sistemul de roluri și permisiuni?',
      en: 'How does the role and permissions system work?'
    },
    answer: {
      ro: 'Platforma folosește un sistem RBAC (Role-Based Access Control) pentru a controla accesul utilizatorilor. Consultanții au acces complet la organizațiile pe care le gestionează. Administratorii de firmă pot gestiona propria organizație și angajații săi. Angajații pot vizualiza doar propriile date și training-urile obligatorii. Fiecare utilizator poate aparține la mai multe organizații cu roluri diferite în fiecare.',
      en: 'The platform uses an RBAC (Role-Based Access Control) system to control user access. Consultants have full access to the organizations they manage. Company administrators can manage their own organization and employees. Employees can only view their own data and mandatory trainings. Each user can belong to multiple organizations with different roles in each.'
    },
    relatedQuestions: ['gen-02', 'sec-02', 'plat-03']
  },
  {
    id: 'plat-03',
    category: 'platform',
    question: {
      ro: 'Cum funcționează sistemul de alerte?',
      en: 'How does the alert system work?'
    },
    answer: {
      ro: 'Sistemul trimite notificări automate pentru evenimente importante: training-uri planificate (cu 7, 3 și 1 zi înainte), expirarea examinărilor medicale (cu 30 și 7 zile înainte), scadența echipamentelor de protecție, și documente care urmează să expire. Alertele sunt vizibile în dashboard și pot fi trimise și pe email dacă activați această opțiune din setări. Puteți configura preferințele de notificare individual.',
      en: 'The system sends automatic notifications for important events: scheduled trainings (7, 3, and 1 day before), medical examination expiration (30 and 7 days before), protective equipment expiration, and documents about to expire. Alerts are visible in the dashboard and can also be sent via email if you enable this option in settings. You can configure notification preferences individually.'
    },
    relatedQuestions: ['plat-01', 'plat-04', 'tech-04']
  },
  {
    id: 'plat-04',
    category: 'platform',
    question: {
      ro: 'Pot exporta date din platformă?',
      en: 'Can I export data from the platform?'
    },
    answer: {
      ro: 'Da, puteți exporta majoritatea datelor în formate standard (CSV, Excel, PDF). Rapoartele pot fi generate pentru training-uri, examene medicale, echipamente și alerte. Consultanții pot exporta date consolidate pentru toate firmele pe care le gestionează sau rapoarte individuale per organizație. Toate exporturile respectă permisiunile și confidențialitatea datelor conform GDPR.',
      en: 'Yes, you can export most data in standard formats (CSV, Excel, PDF). Reports can be generated for trainings, medical examinations, equipment, and alerts. Consultants can export consolidated data for all companies they manage or individual reports per organization. All exports respect permissions and data confidentiality according to GDPR.'
    },
    relatedQuestions: ['sec-03', 'plat-01', 'tech-03']
  },
  {
    id: 'plat-05',
    category: 'platform',
    question: {
      ro: 'Cum adaug angajați în sistem?',
      en: 'How do I add employees to the system?'
    },
    answer: {
      ro: 'Consultanții și administratorii de firmă pot adăuga angajați manual prin formularul dedicat sau prin import în bloc din fișier CSV/Excel. Pentru fiecare angajat se completează date de bază (nume, funcție, departament), date de contact și se atribuie rolul corespunzător. După adăugare, angajații primesc automat invitație de acces pe email și pot completa ulterior profilul cu date suplimentare. Sistemul previne duplicate pe baza email-ului.',
      en: 'Consultants and company administrators can add employees manually through the dedicated form or via bulk import from CSV/Excel file. For each employee, basic data (name, position, department), contact information is filled in and the appropriate role is assigned. After addition, employees automatically receive an access invitation via email and can later complete their profile with additional information. The system prevents duplicates based on email.'
    },
    relatedQuestions: ['plat-02', 'gen-03', 'tech-01']
  },

  // LEGISLATION (5)
  {
    id: 'leg-01',
    category: 'legislation',
    question: {
      ro: 'Ce legislație SSM din România este acoperită?',
      en: 'What Romanian OSH legislation is covered?'
    },
    answer: {
      ro: 'Platforma acoperă legislația română principală: Legea 319/2006 (SSM), Legea 307/2006 (PSI), HG 1425/2006 (examinări medicale), Ordinul 1091/2016 (instructaj SSM), și Ordinul 1050/2021 (echipamente de protecție). De asemenea, include peste 200 de acte normative SSM din România accesibile din secțiunea de legislație. Toate funcționalitățile platformei sunt alignate cu cerințele legale românești.',
      en: 'The platform covers main Romanian legislation: Law 319/2006 (OSH), Law 307/2006 (fire safety), GD 1425/2006 (medical examinations), Order 1091/2016 (OSH instruction), and Order 1050/2021 (protective equipment). It also includes over 200 OSH normative acts from Romania accessible from the legislation section. All platform functionalities are aligned with Romanian legal requirements.'
    },
    relatedQuestions: ['leg-02', 'leg-03', 'gen-01']
  },
  {
    id: 'leg-02',
    category: 'legislation',
    question: {
      ro: 'Sunt acoperite și alte țări din UE?',
      en: 'Are other EU countries covered?'
    },
    answer: {
      ro: 'Da, platforma suportă legislația din Bulgaria, Ungaria și Germania pe lângă România. Sistemul se adaptează automat la cerințele specifice fiecărei țări în funcție de locația organizației. Fiecare țară are propriul set de documente, termene și cerințe de training. Consultanții care lucrează în mai multe țări pot gestiona toate organizațiile din aceeași platformă cu respect complet pentru legislațiile naționale.',
      en: 'Yes, the platform supports legislation from Bulgaria, Hungary, and Germany in addition to Romania. The system automatically adapts to the specific requirements of each country based on the organization\'s location. Each country has its own set of documents, deadlines, and training requirements. Consultants working in multiple countries can manage all organizations from the same platform with full respect for national legislation.'
    },
    relatedQuestions: ['leg-01', 'gen-05', 'leg-04']
  },
  {
    id: 'leg-03',
    category: 'legislation',
    question: {
      ro: 'Cât de des se actualizează baza de date legislativă?',
      en: 'How often is the legislative database updated?'
    },
    answer: {
      ro: 'Baza de date legislativă este actualizată lunar cu toate modificările și actele noi publicate în Monitorul Oficial al României și echivalentele din celelalte țări suportate. Utilizatorii primesc notificări automate când apar modificări legislative relevante pentru organizațiile lor. Echipa s-s-m.ro monitorizează constant legislația și asigură conformitatea platformei cu ultimele cerințe legale din toate cele patru țări.',
      en: 'The legislative database is updated monthly with all changes and new acts published in the Official Gazette of Romania and equivalents from other supported countries. Users receive automatic notifications when legislative changes relevant to their organizations appear. The s-s-m.ro team constantly monitors legislation and ensures platform compliance with the latest legal requirements from all four countries.'
    },
    relatedQuestions: ['leg-01', 'leg-02', 'plat-03']
  },
  {
    id: 'leg-04',
    category: 'legislation',
    question: {
      ro: 'Cum știu ce training-uri sunt obligatorii pentru angajați?',
      en: 'How do I know what trainings are mandatory for employees?'
    },
    answer: {
      ro: 'Platforma include un sistem inteligent de recomandare a training-urilor bazat pe funcția angajatului, domeniul de activitate și legislația aplicabilă. Consultanții pot configura șabloane de training-uri obligatorii pentru fiecare tip de funcție. Sistemul calculează automat termenele de reînnoire (de ex. SSM se reînnoiește periodic conform legislației). Dashboard-ul afișează clar training-urile scadente și restante pentru fiecare angajat.',
      en: 'The platform includes an intelligent training recommendation system based on employee position, field of activity, and applicable legislation. Consultants can configure mandatory training templates for each type of position. The system automatically calculates renewal deadlines (e.g., OSH is renewed periodically according to legislation). The dashboard clearly displays due and overdue trainings for each employee.'
    },
    relatedQuestions: ['leg-01', 'plat-01', 'plat-03']
  },
  {
    id: 'leg-05',
    category: 'legislation',
    question: {
      ro: 'Platforma mă ajută să trec o inspecție ITM?',
      en: 'Does the platform help me pass a labor inspection?'
    },
    answer: {
      ro: 'Da, platforma generează automat toate documentele necesare pentru o inspecție ITM (Inspectoratul Teritorial de Muncă): registre de instructaje, procese-verbale de training, fișe medicale actualizate, și documente de echipamente de protecție. Toate datele sunt organizate conform cerințelor inspectorilor și pot fi exportate instant. Sistemul de alerte asigură că toate termenele sunt respectate, minimizând riscul de amenzi sau neconformități la inspecție.',
      en: 'Yes, the platform automatically generates all documents required for a labor inspection: instruction registers, training minutes, updated medical records, and protective equipment documents. All data is organized according to inspector requirements and can be exported instantly. The alert system ensures all deadlines are met, minimizing the risk of fines or non-compliance during inspection.'
    },
    relatedQuestions: ['leg-01', 'plat-04', 'leg-04']
  },

  // PRICING (5)
  {
    id: 'price-01',
    category: 'pricing',
    question: {
      ro: 'Cât costă utilizarea platformei?',
      en: 'How much does using the platform cost?'
    },
    answer: {
      ro: 'Platforma oferă trei planuri: Plan Starter pentru consultanți cu până la 3 firme (29 EUR/lună), Plan Professional pentru consultanți cu până la 15 firme (79 EUR/lună), și Plan Enterprise pentru consultanți cu clienți nelimitați (149 EUR/lună). Toate planurile includ utilizatori nelimitați, spațiu de stocare generos și suport tehnic. Există discount de 20% pentru plata anuală. Firmele individuale plătesc direct prin consultantul lor.',
      en: 'The platform offers three plans: Starter Plan for consultants with up to 3 companies (29 EUR/month), Professional Plan for consultants with up to 15 companies (79 EUR/month), and Enterprise Plan for consultants with unlimited clients (149 EUR/month). All plans include unlimited users, generous storage space, and technical support. There is a 20% discount for annual payment. Individual companies pay directly through their consultant.'
    },
    relatedQuestions: ['price-02', 'price-03', 'gen-01']
  },
  {
    id: 'price-02',
    category: 'pricing',
    question: {
      ro: 'Există perioadă de probă gratuită?',
      en: 'Is there a free trial period?'
    },
    answer: {
      ro: 'Da, oferim o perioadă de probă gratuită de 14 zile pentru toate planurile. În această perioadă aveți acces complet la toate funcționalitățile platformei fără restricții. Nu este necesar card de credit pentru a începe testarea. După expirarea perioadei de probă puteți alege planul care vi se potrivește cel mai bine. Datele introduse în perioada de probă rămân salvate și accesibile după subscrierea la un plan.',
      en: 'Yes, we offer a 14-day free trial for all plans. During this period you have full access to all platform functionalities without restrictions. No credit card is required to start testing. After the trial period expires, you can choose the plan that suits you best. Data entered during the trial period remains saved and accessible after subscribing to a plan.'
    },
    relatedQuestions: ['price-01', 'gen-03', 'price-05']
  },
  {
    id: 'price-03',
    category: 'pricing',
    question: {
      ro: 'Pot schimba planul oricând?',
      en: 'Can I change my plan anytime?'
    },
    answer: {
      ro: 'Da, puteți face upgrade sau downgrade oricând din setările contului. La upgrade, diferența de preț se calculează pro-rata pentru perioada rămasă. La downgrade, creditul rămas se aplică la următoarea factură. Modificările se aplică imediat și nu pierdeți niciun fel de date. Dacă faceți upgrade, limitele noi (număr de firme, spațiu) sunt disponibile instant.',
      en: 'Yes, you can upgrade or downgrade anytime from account settings. On upgrade, the price difference is calculated pro-rata for the remaining period. On downgrade, the remaining credit is applied to the next invoice. Changes apply immediately and you don\'t lose any data. If you upgrade, new limits (number of companies, space) are instantly available.'
    },
    relatedQuestions: ['price-01', 'price-04', 'tech-01']
  },
  {
    id: 'price-04',
    category: 'pricing',
    question: {
      ro: 'Ce se întâmplă dacă depășesc limita de firme?',
      en: 'What happens if I exceed the company limit?'
    },
    answer: {
      ro: 'Când vă apropiați de limita de firme din planul curent, primiți notificare automată cu opțiunea de upgrade. Dacă depășiți limita, puteți continua să lucrați cu firmele existente dar nu puteți adăuga firme noi până când faceți upgrade sau ștergeți organizații inactive. Nu sunt taxe suplimentare sau penalități. Procesul de upgrade este instant și vă permite să continuați activitatea fără întreruperi.',
      en: 'When you approach the company limit of your current plan, you receive automatic notification with upgrade option. If you exceed the limit, you can continue working with existing companies but cannot add new ones until you upgrade or delete inactive organizations. There are no additional fees or penalties. The upgrade process is instant and allows you to continue activity without interruptions.'
    },
    relatedQuestions: ['price-01', 'price-03', 'plat-03']
  },
  {
    id: 'price-05',
    category: 'pricing',
    question: {
      ro: 'Oferiti reduceri pentru ONG-uri sau instituții educaționale?',
      en: 'Do you offer discounts for NGOs or educational institutions?'
    },
    answer: {
      ro: 'Da, oferim reduceri speciale de 30% pentru organizații nonprofit și instituții educaționale acreditate. Pentru a beneficia de această reducere, contactați-ne cu documente doveditoare (certificat ONG, acreditare educațională). De asemenea, oferim pachete personalizate pentru organizații mari cu cerințe speciale. Reducerea se aplică la toate planurile și se cumulează cu discountul pentru plata anuală.',
      en: 'Yes, we offer special 30% discounts for nonprofit organizations and accredited educational institutions. To benefit from this discount, contact us with supporting documents (NGO certificate, educational accreditation). We also offer customized packages for large organizations with special requirements. The discount applies to all plans and accumulates with the annual payment discount.'
    },
    relatedQuestions: ['price-01', 'price-02', 'gen-03']
  },

  // TECHNICAL (5)
  {
    id: 'tech-01',
    category: 'technical',
    question: {
      ro: 'Ce browsere sunt suportate?',
      en: 'What browsers are supported?'
    },
    answer: {
      ro: 'Platforma funcționează pe toate browserele moderne: Google Chrome (versiunea 90+), Mozilla Firefox (versiunea 88+), Safari (versiunea 14+), și Microsoft Edge (versiunea 90+). Recomandăm Chrome sau Firefox pentru cea mai bună experiență. Browserele Internet Explorer nu mai sunt suportate. Asigurați-vă că JavaScript este activat și că browserul este actualizat la ultima versiune pentru funcționalitate completă.',
      en: 'The platform works on all modern browsers: Google Chrome (version 90+), Mozilla Firefox (version 88+), Safari (version 14+), and Microsoft Edge (version 90+). We recommend Chrome or Firefox for the best experience. Internet Explorer browsers are no longer supported. Make sure JavaScript is enabled and the browser is updated to the latest version for full functionality.'
    },
    relatedQuestions: ['gen-04', 'tech-02', 'tech-05']
  },
  {
    id: 'tech-02',
    category: 'technical',
    question: {
      ro: 'Ce conexiune la internet este necesară?',
      en: 'What internet connection is required?'
    },
    answer: {
      ro: 'Platforma funcționează cu orice conexiune la internet de cel puțin 2 Mbps pentru utilizare optimă. Pentru operații care implică upload de documente mari recomandăm conexiune de minim 5 Mbps. Platforma este optimizată pentru a funcționa eficient și pe conexiuni mobile 4G/5G. Nu există cerințe speciale pentru latență sau tip de conexiune (WiFi, cablu, mobil).',
      en: 'The platform works with any internet connection of at least 2 Mbps for optimal use. For operations involving large document uploads we recommend a connection of at least 5 Mbps. The platform is optimized to work efficiently even on 4G/5G mobile connections. There are no special requirements for latency or connection type (WiFi, cable, mobile).'
    },
    relatedQuestions: ['tech-01', 'gen-04', 'tech-05']
  },
  {
    id: 'tech-03',
    category: 'technical',
    question: {
      ro: 'Ce format trebuie să aibă documentele încărcate?',
      en: 'What format should uploaded documents have?'
    },
    answer: {
      ro: 'Platforma acceptă toate formatele standard de documente: PDF, DOC, DOCX, XLS, XLSX pentru documente și rapoarte, JPG, PNG, GIF pentru imagini și semnături, și CSV pentru import/export date în bulk. Dimensiunea maximă per fișier este 10 MB pentru plan Starter, 25 MB pentru Professional și 50 MB pentru Enterprise. Toate documentele sunt scanate automat pentru virus înainte de stocare.',
      en: 'The platform accepts all standard document formats: PDF, DOC, DOCX, XLS, XLSX for documents and reports, JPG, PNG, GIF for images and signatures, and CSV for bulk data import/export. Maximum file size is 10 MB for Starter plan, 25 MB for Professional, and 50 MB for Enterprise. All documents are automatically scanned for viruses before storage.'
    },
    relatedQuestions: ['plat-04', 'sec-03', 'price-01']
  },
  {
    id: 'tech-04',
    category: 'technical',
    question: {
      ro: 'Cum primesc notificările?',
      en: 'How do I receive notifications?'
    },
    answer: {
      ro: 'Notificările sunt disponibile în trei moduri: notificări în aplicație (vizibile în dashboard cu iconița de clopot), notificări email (configurabile din setări pentru fiecare tip de eveniment), și în viitor și notificări push pe mobil. Puteți alege ce tipuri de notificări doriți să primiți și pe ce canale. Frecvența notificărilor este configurabilă (instant, zilnic digest, săptămânal). Toate notificările respectă fusul orar setat în profilul dvs.',
      en: 'Notifications are available in three ways: in-app notifications (visible in dashboard with bell icon), email notifications (configurable from settings for each event type), and in the future also mobile push notifications. You can choose what types of notifications you want to receive and on what channels. Notification frequency is configurable (instant, daily digest, weekly). All notifications respect the time zone set in your profile.'
    },
    relatedQuestions: ['plat-03', 'tech-05', 'gen-04']
  },
  {
    id: 'tech-05',
    category: 'technical',
    question: {
      ro: 'Există aplicație mobilă nativă?',
      en: 'Is there a native mobile app?'
    },
    answer: {
      ro: 'Momentan platforma este disponibilă ca aplicație web responsivă care funcționează excelent în browser-ul mobil. Aceasta oferă toate funcționalitățile versiunii desktop optimizate pentru ecrane mici. O aplicație mobilă nativă pentru iOS și Android este în plan de dezvoltare pentru 2026. Puteți adăuga aplicația web la ecranul principal al telefonului pentru acces rapid similar unei aplicații native.',
      en: 'Currently the platform is available as a responsive web application that works excellently in mobile browser. It offers all desktop version functionalities optimized for small screens. A native mobile app for iOS and Android is in development plan for 2026. You can add the web app to your phone\'s home screen for quick access similar to a native app.'
    },
    relatedQuestions: ['gen-04', 'tech-01', 'tech-02']
  },

  // SECURITY (5)
  {
    id: 'sec-01',
    category: 'security',
    question: {
      ro: 'Cât de sigure sunt datele mele?',
      en: 'How secure is my data?'
    },
    answer: {
      ro: 'Datele sunt stocate în Supabase (infrastructură PostgreSQL) cu criptare AES-256 la repaus și TLS 1.3 pentru transfer. Toate comunicațiile se fac printr-o conexiune HTTPS securizată. Implementăm Row Level Security (RLS) pe toate tabelele - utilizatorii văd doar datele la care au permisiuni. Baza de date este backup-uită automat zilnic cu retenție de 30 zile. Serverele sunt localizate în Europa (conformitate GDPR).',
      en: 'Data is stored in Supabase (PostgreSQL infrastructure) with AES-256 encryption at rest and TLS 1.3 for transfer. All communications are done through a secure HTTPS connection. We implement Row Level Security (RLS) on all tables - users see only data they have permissions for. The database is automatically backed up daily with 30-day retention. Servers are located in Europe (GDPR compliance).'
    },
    relatedQuestions: ['sec-02', 'sec-03', 'sec-04']
  },
  {
    id: 'sec-02',
    category: 'security',
    question: {
      ro: 'Cine are acces la datele mele?',
      en: 'Who has access to my data?'
    },
    answer: {
      ro: 'Accesul la date este strict controlat prin sistemul RBAC (Role-Based Access Control). Numai utilizatorii din organizația dvs. cu permisiuni corespunzătoare pot vizualiza datele. Consultanții văd doar firmele pe care le gestionează. Angajații văd doar propriile date personale. Administratorii tehnici s-s-m.ro au acces doar pentru suport tehnic și numai cu acordul dvs. explicit. Toate accesările datelor sunt loguite în audit log pentru trasabilitate completă.',
      en: 'Data access is strictly controlled through the RBAC (Role-Based Access Control) system. Only users in your organization with appropriate permissions can view data. Consultants see only the companies they manage. Employees see only their own personal data. S-s-m.ro technical administrators have access only for technical support and only with your explicit consent. All data access is logged in audit log for complete traceability.'
    },
    relatedQuestions: ['plat-02', 'sec-01', 'sec-05']
  },
  {
    id: 'sec-03',
    category: 'security',
    question: {
      ro: 'Sunteți conformi cu GDPR?',
      en: 'Are you GDPR compliant?'
    },
    answer: {
      ro: 'Da, platforma este complet conformă cu GDPR (Regulamentul General privind Protecția Datelor). Stocăm date personale doar cu consimțământ explicit, oferim transparență completă asupra datelor colectate și procesate, permitem export complet și ștergere a datelor la cerere, implementăm "privacy by design" în toate funcționalitățile, și semănăm contract de prelucrare date (DPA) cu toți clienții. Aveți dreptul la portabilitatea datelor și la uitare.',
      en: 'Yes, the platform is fully GDPR (General Data Protection Regulation) compliant. We store personal data only with explicit consent, offer complete transparency about collected and processed data, allow full export and deletion of data on request, implement "privacy by design" in all functionalities, and sign data processing agreements (DPA) with all clients. You have the right to data portability and the right to be forgotten.'
    },
    relatedQuestions: ['sec-01', 'sec-04', 'plat-04']
  },
  {
    id: 'sec-04',
    category: 'security',
    question: {
      ro: 'Cum vă protejați împotriva atacurilor cibernetice?',
      en: 'How do you protect against cyber attacks?'
    },
    answer: {
      ro: 'Implementăm măsuri de securitate pe mai multe niveluri: firewall aplicațional (WAF) pentru protecție DDoS și atacuri comune, rate limiting pentru prevenirea abuzurilor și brute force, autentificare cu hash bcrypt pentru parole (nu stocăm parole în clar), actualizări automate de securitate pentru toate dependențele, și scanare regulată a vulnerabilităților și teste de penetrare. Monitorizăm constant activitatea suspectă și avem plan de răspuns la incidente.',
      en: 'We implement multi-level security measures: web application firewall (WAF) for DDoS protection and common attacks, rate limiting to prevent abuse and brute force, authentication with bcrypt hash for passwords (we don\'t store passwords in clear), automatic security updates for all dependencies, and regular vulnerability scanning and penetration testing. We constantly monitor suspicious activity and have an incident response plan.'
    },
    relatedQuestions: ['sec-01', 'sec-05', 'tech-01']
  },
  {
    id: 'sec-05',
    category: 'security',
    question: {
      ro: 'Ce se întâmplă dacă îmi uit parola?',
      en: 'What happens if I forget my password?'
    },
    answer: {
      ro: 'Puteți reseta parola oricând folosind funcția "Am uitat parola" de pe pagina de login. Veți primi un email cu link securizat de resetare valabil 1 oră. Link-ul poate fi folosit o singură dată pentru securitate maximă. După resetare vă recomandăm să folosiți o parolă puternică (minim 8 caractere, litere mari și mici, cifre, simboluri). Dacă nu primiți email-ul de resetare, verificați folderul spam sau contactați suportul.',
      en: 'You can reset your password anytime using the "Forgot password" function on the login page. You will receive an email with a secure reset link valid for 1 hour. The link can be used only once for maximum security. After reset we recommend using a strong password (minimum 8 characters, upper and lowercase letters, numbers, symbols). If you don\'t receive the reset email, check spam folder or contact support.'
    },
    relatedQuestions: ['gen-03', 'sec-01', 'sec-02']
  }
];

export function getFAQByCategory(category: FAQCategory): FAQItem[] {
  return faqData.filter(item => item.category === category);
}

export function getFAQById(id: string): FAQItem | undefined {
  return faqData.find(item => item.id === id);
}

export function getRelatedFAQs(id: string): FAQItem[] {
  const faq = getFAQById(id);
  if (!faq) return [];

  return faq.relatedQuestions
    .map(relatedId => getFAQById(relatedId))
    .filter((item): item is FAQItem => item !== undefined);
}

export function searchFAQ(query: string, language: 'ro' | 'en' = 'ro'): FAQItem[] {
  const searchTerm = query.toLowerCase();

  return faqData.filter(item => {
    const question = item.question[language].toLowerCase();
    const answer = item.answer[language].toLowerCase();
    return question.includes(searchTerm) || answer.includes(searchTerm);
  });
}
