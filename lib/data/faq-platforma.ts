export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'cont' | 'abonament' | 'functionalitati' | 'securitate' | 'suport';
}

export const faqPlatforma: FaqItem[] = [
  // CONT
  {
    id: 'cont-1',
    question: 'Cum îmi creez un cont pe platformă?',
    answer: 'Pentru a crea un cont, accesați pagina de înregistrare și completați formularul cu adresa de email și parola dorită. Veți primi un email de confirmare pentru activarea contului. După activare, puteți accesa platforma cu credențialele create.',
    category: 'cont'
  },
  {
    id: 'cont-2',
    question: 'Am uitat parola. Cum o pot reseta?',
    answer: 'Pe pagina de autentificare, apăsați pe link-ul "Am uitat parola". Introduceți adresa de email asociată contului și veți primi instrucțiuni pentru resetarea parolei. Link-ul de resetare este valabil 24 de ore.',
    category: 'cont'
  },
  {
    id: 'cont-3',
    question: 'Pot schimba adresa de email asociată contului?',
    answer: 'Da, puteți schimba adresa de email din secțiunea "Profil" din dashboard. După modificare, veți primi un email de confirmare la noua adresă pentru verificare.',
    category: 'cont'
  },
  {
    id: 'cont-4',
    question: 'Ce roluri există pe platformă?',
    answer: 'Platforma suportă trei roluri principale: Consultant SSM (acces complet la toate funcționalitățile), Administrator firmă (gestionare angajați și documente la nivel de organizație) și Angajat (acces la propriile date și documente). Fiecare rol are permisiuni specifice adaptate responsabilităților.',
    category: 'cont'
  },

  // ABONAMENT
  {
    id: 'abonament-1',
    question: 'Ce planuri de abonament sunt disponibile?',
    answer: 'Oferim trei planuri: Starter (până la 50 angajați), Professional (până la 200 angajați) și Enterprise (nelimitat). Toate planurile includ funcționalitățile de bază, iar cele superioare oferă integrări avansate, raportare extinsă și suport prioritar.',
    category: 'abonament'
  },
  {
    id: 'abonament-2',
    question: 'Pot schimba planul de abonament?',
    answer: 'Da, puteți actualiza sau downgrade planul oricând din secțiunea "Abonament" din dashboard. Modificările se aplică imediat, iar diferențele de preț sunt ajustate proporțional pentru perioada rămasă.',
    category: 'abonament'
  },
  {
    id: 'abonament-3',
    question: 'Există o perioadă de probă gratuită?',
    answer: 'Da, oferim o perioadă de probă gratuită de 14 zile pentru planul Professional. Nu este necesară introducerea cardului de credit la înregistrare. După expirarea perioadei de probă, puteți alege planul potrivit.',
    category: 'abonament'
  },
  {
    id: 'abonament-4',
    question: 'Ce metode de plată acceptați?',
    answer: 'Acceptăm plata cu card bancar (Visa, Mastercard, American Express) și transfer bancar pentru planurile Enterprise. Facturarea se face lunar sau anual, cu reducere de 15% pentru plata anuală.',
    category: 'abonament'
  },

  // FUNCTIONALITATI
  {
    id: 'functionalitati-1',
    question: 'Ce funcționalități oferă modulul de Evidență medicală?',
    answer: 'Modulul permite gestionarea programărilor la medicina muncii, încărcarea avizelor medicale, alerte automate pentru expirări, statistici despre statusul medical al angajaților și rapoarte pentru ITM. Toate datele sunt stocate în conformitate cu GDPR.',
    category: 'functionalitati'
  },
  {
    id: 'functionalitati-2',
    question: 'Cum funcționează sistemul de alerte și notificări?',
    answer: 'Sistemul trimite alerte automate pentru evenimente importante: expirarea avizelor medicale, instructaje SSM/PSI care trebuie reînnoite, echipamente de protecție care necesită verificare și alte termene critice. Alertele se pot configura pentru fiecare organizație.',
    category: 'functionalitati'
  },
  {
    id: 'functionalitati-3',
    question: 'Pot genera rapoarte personalizate?',
    answer: 'Da, platforma oferă un modul de raportare flexibil care permite generarea de rapoarte pentru ITM, statistici SSM/PSI, evidențe de instructaje și multe altele. Rapoartele pot fi exportate în format PDF sau Excel.',
    category: 'functionalitati'
  },
  {
    id: 'functionalitati-4',
    question: 'Este disponibilă o aplicație mobilă?',
    answer: 'Platforma este optimizată pentru dispozitive mobile prin interfața web responsive. Angajații pot accesa propriile date și documente de pe telefon sau tabletă fără a instala o aplicație separată.',
    category: 'functionalitati'
  },
  {
    id: 'functionalitati-5',
    question: 'Pot importa date din sistemele existente?',
    answer: 'Da, oferim suport pentru import de date din Excel și alte formate comune. Pentru planul Enterprise, asigurăm migrarea asistată a datelor din sistemele anterioare și integrări cu alte platforme HR.',
    category: 'functionalitati'
  },

  // SECURITATE
  {
    id: 'securitate-1',
    question: 'Cum sunt protejate datele pe platformă?',
    answer: 'Toate datele sunt criptate în tranzit (SSL/TLS) și în repaus. Folosim infrastructura Supabase cu backup automat zilnic. Implementăm Row Level Security (RLS) pentru a asigura că fiecare utilizator vede doar datele la care are acces.',
    category: 'securitate'
  },
  {
    id: 'securitate-2',
    question: 'Este platforma conformă cu GDPR?',
    answer: 'Da, platforma este dezvoltată în conformitate cu Regulamentul General privind Protecția Datelor (GDPR). Oferim funcționalități pentru gestionarea consimțământului, dreptul la ștergerea datelor și export complet al informațiilor personale.',
    category: 'securitate'
  },
  {
    id: 'securitate-3',
    question: 'Cine are acces la datele organizației mele?',
    answer: 'Doar utilizatorii din organizația dvs. cu permisiunile corespunzătoare pot accesa datele. Echipa s-s-m.ro nu accesează datele clienților decât pentru suport tehnic, cu acordul explicit. Fiecare accesare este înregistrată în jurnalul de audit.',
    category: 'securitate'
  },
  {
    id: 'securitate-4',
    question: 'Ce se întâmplă cu datele dacă îmi anulez abonamentul?',
    answer: 'Datele rămân disponibile timp de 30 de zile după anularea abonamentului, în modul read-only. În această perioadă puteți exporta toate informațiile. După 30 de zile, datele sunt șterse permanent conform politicii de retenție.',
    category: 'securitate'
  },

  // SUPORT
  {
    id: 'suport-1',
    question: 'Ce opțiuni de suport sunt disponibile?',
    answer: 'Oferim suport prin email (support@s-s-m.ro) pentru toate planurile, cu timp de răspuns de 24-48h. Planurile Professional și Enterprise beneficiază de suport prioritar și asistență telefonic. Documentația și tutorialele video sunt disponibile în dashboard.',
    category: 'suport'
  },
  {
    id: 'suport-2',
    question: 'Oferă platforma training pentru utilizatori?',
    answer: 'Da, oferim sesiuni de onboarding pentru consultanții noi și administratorii de firmă. Pentru planul Enterprise, includem training personalizat și webinarii periodice despre funcționalitățile noi. Toate resursele educaționale sunt accesibile în secțiunea "Ajutor".',
    category: 'suport'
  },
  {
    id: 'suport-3',
    question: 'Cum raportez o problemă tehnică?',
    answer: 'Pentru probleme tehnice, accesați secțiunea "Suport" din dashboard și completați formularul de raportare. Includeți capturi de ecran și pașii pentru reproducerea problemei. Echipa noastră va investiga și va reveni cu o soluție în cel mai scurt timp.',
    category: 'suport'
  },
];
