export type ChangelogEntryType = 'feature' | 'improvement' | 'fix';

export interface ChangelogEntry {
  date: string;
  title: string;
  description: string;
  type: ChangelogEntryType;
  version: string;
}

export const changelogEntries: ChangelogEntry[] = [
  {
    date: '2026-02-10',
    title: 'Suport multi-țară extins',
    description: 'Platforma suportă acum operațiuni în România, Bulgaria, Ungaria și Germania cu conformitate locală specifică fiecărei țări.',
    type: 'feature',
    version: '2.5.0'
  },
  {
    date: '2026-02-08',
    title: 'Îmbunătățire scor compliance',
    description: 'Algoritmul de calcul al scorului de conformitate a fost optimizat pentru a reflecta mai precis starea reală a organizației.',
    type: 'improvement',
    version: '2.4.1'
  },
  {
    date: '2026-02-05',
    title: 'Corectare export instruiri',
    description: 'Rezolvată problema care cauza erori la exportul rapoartelor de instruire pentru angajați cu caractere speciale în nume.',
    type: 'fix',
    version: '2.4.0'
  },
  {
    date: '2026-02-01',
    title: 'Mod întunecat disponibil',
    description: 'Adăugat suport complet pentru modul întunecat în întreaga platformă, cu comutare automată sau manuală.',
    type: 'feature',
    version: '2.3.0'
  },
  {
    date: '2026-01-28',
    title: 'Dashboard optimizat',
    description: 'Performanța dashboard-ului principal a fost îmbunătățită cu 40% prin optimizarea interogărilor și cache-ul inteligent.',
    type: 'improvement',
    version: '2.2.5'
  },
  {
    date: '2026-01-25',
    title: 'Sistem alerte în timp real',
    description: 'Implementat sistem de notificări în timp real pentru expirări certificate, control medical și documente SSM/PSI.',
    type: 'feature',
    version: '2.2.0'
  },
  {
    date: '2026-01-22',
    title: 'Corectare filtre echipamente',
    description: 'Rezolvată problema unde filtrele pe pagina de echipamente nu se resetau corect după aplicarea unor combinații specifice.',
    type: 'fix',
    version: '2.1.2'
  },
  {
    date: '2026-01-18',
    title: 'Module GDPR și NIS2',
    description: 'Adăugate module complete de conformitate pentru GDPR și directiva NIS2, cu raportare automată și verificări periodice.',
    type: 'feature',
    version: '2.1.0'
  },
  {
    date: '2026-01-15',
    title: 'Îmbunătățire audit log',
    description: 'Sistemul de audit log acum înregistrează mai multe detalii și oferă filtrare avansată pentru investigații de securitate.',
    type: 'improvement',
    version: '2.0.8'
  },
  {
    date: '2026-01-12',
    title: 'Corectare permisiuni RBAC',
    description: 'Rezolvate inconsistențele în verificarea permisiunilor pentru roluri personalizate în modulul de administrare.',
    type: 'fix',
    version: '2.0.7'
  },
  {
    date: '2026-01-08',
    title: 'Sistem RBAC dinamic',
    description: 'Implementat sistem complet de roluri și permisiuni configurabile, înlocuind rolurile hardcodate anterioare.',
    type: 'feature',
    version: '2.0.0'
  },
  {
    date: '2026-01-05',
    title: 'Export PDF îmbunătățit',
    description: 'Calitatea și formatul rapoartelor PDF au fost îmbunătățite, incluzând logo organizație și semnături digitale.',
    type: 'improvement',
    version: '1.9.5'
  },
  {
    date: '2026-01-02',
    title: 'Corectare import angajați CSV',
    description: 'Rezolvată problema care cauza eșecul importului pentru fișiere CSV cu encoding diferit de UTF-8.',
    type: 'fix',
    version: '1.9.3'
  },
  {
    date: '2025-12-28',
    title: 'Integrare webhook pentru API',
    description: 'Adăugat sistem complet de webhooks pentru integrări externe și sincronizare automată cu sisteme terțe.',
    type: 'feature',
    version: '1.9.0'
  },
  {
    date: '2025-12-22',
    title: 'Performanță tabele mari',
    description: 'Optimizată afișarea și filtrarea pentru organizații cu peste 1000 de angajați și 5000+ înregistrări.',
    type: 'improvement',
    version: '1.8.6'
  },
  {
    date: '2025-12-18',
    title: 'Corectare calcul sancțiuni',
    description: 'Rezolvată eroarea în calculul automat al sancțiunilor pentru neconformități multiple simultane.',
    type: 'fix',
    version: '1.8.4'
  },
  {
    date: '2025-12-15',
    title: 'Portal autoevaluare angajați',
    description: 'Angajații pot acum completa chestionare de autoevaluare SSM și vizualiza propriile certificate direct în platformă.',
    type: 'feature',
    version: '1.8.0'
  },
  {
    date: '2025-12-10',
    title: 'Îmbunătățire căutare globală',
    description: 'Funcția de căutare acum include rezultate din toate modulele și oferă sugestii inteligente în timp real.',
    type: 'improvement',
    version: '1.7.8'
  },
  {
    date: '2025-12-05',
    title: 'Corectare validare formulare',
    description: 'Rezolvate problemele de validare în formulare care permiteau salvarea datelor incomplete în anumite scenarii.',
    type: 'fix',
    version: '1.7.6'
  },
  {
    date: '2025-12-01',
    title: 'Dashboard analytics avansat',
    description: 'Adăugat modul de analize avansate cu grafice interactive, tendințe istorice și comparații între perioade.',
    type: 'feature',
    version: '1.7.0'
  }
];
