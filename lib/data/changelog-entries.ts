export interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  type: 'feature' | 'fix' | 'improvement';
  title: string;
  description: string;
  modulesAffected: string[];
}

export const changelogEntries: ChangelogEntry[] = [
  {
    id: 'v1.8.0',
    version: '1.8.0',
    date: '2026-02-10',
    type: 'feature',
    title: 'Polish legislative acts database',
    description: 'Adăugat baza de date completă cu acte legislative SSM din Polonia. Sistemul suportă acum compliance pentru România, Bulgaria, Ungaria, Germania și Polonia.',
    modulesAffected: ['legislative', 'compliance', 'admin']
  },
  {
    id: 'v1.7.5',
    version: '1.7.5',
    date: '2026-02-05',
    type: 'improvement',
    title: 'User profile with avatar upload',
    description: 'Pagină de profil utilizator cu funcționalitate de upload avatar și gestionare preferințe. Suport pentru imagini până la 2MB, redimensionare automată.',
    modulesAffected: ['profile', 'settings', 'storage']
  },
  {
    id: 'v1.7.0',
    version: '1.7.0',
    date: '2026-01-28',
    type: 'feature',
    title: 'RBAC dynamic system implementation',
    description: 'Implementare sistem RBAC dinamic cu tabele roles, user_roles și permissions. Migrare progresivă de la memberships.role către roluri configurabile.',
    modulesAffected: ['auth', 'rbac', 'admin', 'database']
  },
  {
    id: 'v1.6.8',
    version: '1.6.8',
    date: '2026-01-20',
    type: 'fix',
    title: 'RLS policy fixes for medical records',
    description: 'Corectat politici RLS pentru medical_records care blocau accesul consultanților la fișele medicale ale angajaților din organizațiile gestionate.',
    modulesAffected: ['medical', 'database', 'security']
  },
  {
    id: 'v1.6.5',
    version: '1.6.5',
    date: '2026-01-15',
    type: 'improvement',
    title: 'Reusable Modal component',
    description: 'Componentă Modal reutilizabilă cu animații fluide, suport keyboard navigation și variante de dimensiuni. Înlocuiește implementările custom din întreaga aplicație.',
    modulesAffected: ['ui', 'components']
  },
  {
    id: 'v1.6.0',
    version: '1.6.0',
    date: '2026-01-08',
    type: 'feature',
    title: 'Equipment maintenance scheduling',
    description: 'Sistem automat de programare întreținere echipamente SSM. Alerte cu 30/15/7 zile înainte de expirare, export rapoarte în PDF.',
    modulesAffected: ['equipment', 'alerts', 'scheduler']
  },
  {
    id: 'v1.5.7',
    version: '1.5.7',
    date: '2025-12-28',
    type: 'improvement',
    title: 'Dashboard performance optimization',
    description: 'Optimizare încărcare dashboard cu reducere 60% timp de răspuns. Implementat caching pentru statistici, lazy loading pentru grafice și virtualizare liste.',
    modulesAffected: ['dashboard', 'performance', 'ui']
  },
  {
    id: 'v1.5.5',
    version: '1.5.5',
    date: '2025-12-20',
    type: 'fix',
    title: 'Training expiration notifications',
    description: 'Rezolvat bug care trimitea notificări duplicate pentru instruiri expirate. Adăugat throttling și deduplicare în sistemul de alerte.',
    modulesAffected: ['trainings', 'notifications', 'alerts']
  },
  {
    id: 'v1.5.0',
    version: '1.5.0',
    date: '2025-12-12',
    type: 'feature',
    title: 'Multi-language support (next-intl)',
    description: 'Implementare suport multilingv cu next-intl pentru RO, EN, BG, HU, DE. Traduceri complete pentru interfață, mesaje de eroare și rapoarte generate.',
    modulesAffected: ['i18n', 'ui', 'reports', 'emails']
  },
  {
    id: 'v1.4.8',
    version: '1.4.8',
    date: '2025-12-05',
    type: 'improvement',
    title: 'Audit log enhancements',
    description: 'Îmbunătățiri sistem audit log cu filtrare avansată, export CSV/PDF, și retention policy configurabil de 1-7 ani pentru conformitate GDPR.',
    modulesAffected: ['audit', 'compliance', 'admin']
  },
  {
    id: 'v1.4.5',
    version: '1.4.5',
    date: '2025-11-28',
    type: 'fix',
    title: 'Document upload validation',
    description: 'Corectat validare fișiere la upload documente - acceptă acum și .docx, .xlsx. Limită mărită la 10MB per fișier, mesaje de eroare mai clare.',
    modulesAffected: ['documents', 'storage', 'validation']
  },
  {
    id: 'v1.4.0',
    version: '1.4.0',
    date: '2025-11-20',
    type: 'feature',
    title: 'Penalties and fines tracking',
    description: 'Modul nou pentru gestionare amenzi și penalități ITM. Track status plată, generare rapoarte trimestrial, integrare cu sistemul de alerte.',
    modulesAffected: ['penalties', 'compliance', 'reports', 'alerts']
  },
  {
    id: 'v1.3.7',
    version: '1.3.7',
    date: '2025-11-10',
    type: 'improvement',
    title: 'StatusBadge component variants',
    description: 'Extins componenta StatusBadge cu variante noi pentru toate stările din sistem. Suport pentru tooltips explicative și iconițe contextuale.',
    modulesAffected: ['ui', 'components']
  },
  {
    id: 'v1.3.5',
    version: '1.3.5',
    date: '2025-11-02',
    type: 'fix',
    title: 'Email delivery improvements',
    description: 'Rezolvat probleme livrare email pentru alerte. Configurat DKIM/SPF corect, adăugat retry logic și queue system pentru trimiteri în bulk.',
    modulesAffected: ['emails', 'notifications', 'infrastructure']
  },
  {
    id: 'v1.3.0',
    version: '1.3.0',
    date: '2025-10-25',
    type: 'feature',
    title: 'Advanced employee filtering',
    description: 'Sistem avansat de filtrare angajați cu filtre multiple simultane (departament, funcție, status medical, instruiri). Salvare filtre favorite, export rezultate.',
    modulesAffected: ['employees', 'ui', 'reports']
  },
  {
    id: 'v1.2.8',
    version: '1.2.8',
    date: '2025-10-15',
    type: 'improvement',
    title: 'Mobile responsive improvements',
    description: 'Optimizare completă interfață pentru dispozitive mobile. Meniuri optimizate, tabele scrollabile, formulare adaptate pentru ecrane mici.',
    modulesAffected: ['ui', 'mobile', 'dashboard']
  },
  {
    id: 'v1.2.5',
    version: '1.2.5',
    date: '2025-10-05',
    type: 'fix',
    title: 'Session timeout handling',
    description: 'Rezolvat problema cu pierdere date în formulare la expirare sesiune. Adăugat auto-save local și dialog de re-autentificare fără reload.',
    modulesAffected: ['auth', 'forms', 'session']
  },
  {
    id: 'v1.2.0',
    version: '1.2.0',
    date: '2025-09-28',
    type: 'feature',
    title: 'Bulk employee operations',
    description: 'Operații în masă pentru angajați: import CSV, ștergere multiplă, actualizare departament/funcție pentru selecție multiplă. Include validare și preview înainte de aplicare.',
    modulesAffected: ['employees', 'import', 'admin']
  },
  {
    id: 'v1.1.5',
    version: '1.1.5',
    date: '2025-09-15',
    type: 'improvement',
    title: 'PDF report generation quality',
    description: 'Îmbunătățiri calitate rapoarte PDF: logo rezoluție înaltă, fonturi custom, formatare tabelară optimizată, header/footer personalizabile per organizație.',
    modulesAffected: ['reports', 'pdf', 'branding']
  },
  {
    id: 'v1.1.0',
    version: '1.1.0',
    date: '2025-09-01',
    type: 'feature',
    title: 'Dashboard analytics widgets',
    description: 'Widget-uri noi pe dashboard: grafic evoluție alerte, top 5 organizații cu cele mai multe non-conformități, statistici instruiri per lună, heatmap activitate.',
    modulesAffected: ['dashboard', 'analytics', 'charts']
  }
];
