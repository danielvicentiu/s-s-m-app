/**
 * Case Studies Detailed Data
 *
 * Studii de caz detaliate pentru platforma SSM/PSI
 * Exemple reale de implementare și rezultate măsurabile
 */

export interface CaseStudyMetric {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface CaseStudy {
  slug: string;
  company: string;
  industry: string;
  industryIcon: string;
  employees: number;
  location: string;
  challenge: string;
  challengeDetails: string[];
  solution: string;
  solutionDetails: string[];
  results: string;
  resultsDetails: string[];
  quote: string;
  quoteAuthor: string;
  quoteRole: string;
  metrics: CaseStudyMetric[];
  implementation: {
    duration: string;
    modules: string[];
    team: string;
  };
  keyFeatures: string[];
  beforeAfter: {
    before: string[];
    after: string[];
  };
}

export const caseStudiesDetailed: CaseStudy[] = [
  {
    slug: 'buildmax-constructii',
    company: 'BuildMax SRL',
    industry: 'Construcții',
    industryIcon: '🏗️',
    employees: 80,
    location: 'București',
    challenge: 'Amenzi repetate și evidență SSM haotică pe șantiere multiple',
    challengeDetails: [
      'Amenzi ANMCS de 45.000 RON în 6 luni pentru neconformități SSM',
      'Evidență manuală pe hârtie pentru 5 șantiere simultane',
      'Instructaje incomplete sau pierdute la schimbarea echipelor',
      'Control medical expirat pentru 40% din angajați',
      'Lipsa raportărilor în timp real către management',
      'Timp pierdut de 10+ ore/săptămână pentru audit intern'
    ],
    solution: 'Digitizare completă SSM cu focus pe conformitate și audit automat',
    solutionDetails: [
      'Implementare modulul de angajați cu alerte automate pentru scadențe',
      'Instructaje digitale cu semnătură electronică pe șantier (tablet)',
      'Sistem centralizat de echipamente protecție cu QR tracking',
      'Dashboard management cu raportare în timp real',
      'Integrare notificări SMS pentru instructaje urgente',
      'Arhivă digitală pentru inspecții ANMCS cu access instant'
    ],
    results: 'Reducere amenzi cu 95% și conformitate 100% în 8 luni',
    resultsDetails: [
      'Zero amenzi în ultimele 6 luni de la implementare',
      '100% angajați cu control medical valid',
      'Instructaje completate în medie în 48h vs 2 săptămâni anterior',
      'Economie 12 ore/săptămână timp administrativ',
      'Audit ANMCS trecut cu calificativ "foarte bine"',
      'ROI recuperat în 4 luni prin eliminarea amenzilor'
    ],
    quote: 'În 8 luni am trecut de la amenzi recurente la zero neconformități. Platforma ne-a salvat nu doar bani, ci și reputația în fața clienților care cer dovezi SSM.',
    quoteAuthor: 'Andrei Popescu',
    quoteRole: 'Director General, BuildMax SRL',
    metrics: [
      {
        label: 'Reducere amenzi',
        value: '95%',
        change: '-42.750 RON/an',
        trend: 'down'
      },
      {
        label: 'Conformitate SSM',
        value: '100%',
        change: '+65%',
        trend: 'up'
      },
      {
        label: 'Timp administrativ',
        value: '-12h/săpt',
        change: '70% mai rapid',
        trend: 'up'
      },
      {
        label: 'ROI',
        value: '4 luni',
        change: 'Break-even',
        trend: 'up'
      }
    ],
    implementation: {
      duration: '3 săptămâni',
      modules: ['Angajați', 'Instructaje', 'Control Medical', 'Echipamente', 'Raportări'],
      team: '1 consultant SSM + 1 administrator intern'
    },
    keyFeatures: [
      'Instructaje mobile cu semnătură electronică',
      'Alerte automate pentru scadențe medicale',
      'Dashboard management în timp real',
      'QR tracking pentru echipamente protecție',
      'Arhivă digitală audit-ready'
    ],
    beforeAfter: {
      before: [
        'Amenzi ANMCS de 45.000 RON/6 luni',
        'Evidență hârtie pe 5 șantiere',
        'Instructaje incomplete sau pierdute',
        '40% control medical expirat',
        '10+ ore/săptămână audit manual'
      ],
      after: [
        'Zero amenzi în ultimele 6 luni',
        'Evidență digitală centralizată',
        '100% instructaje completate',
        '0% scadențe medicale depășite',
        '2 ore/săptămână pentru raportări'
      ]
    }
  },
  {
    slug: 'la-maria-restaurant',
    company: 'Restaurant La Maria',
    industry: 'HoReCa',
    industryIcon: '🍽️',
    employees: 12,
    location: 'Cluj-Napoca',
    challenge: 'Incident ANSVSA și lipsă autorizație PSI la deschidere sezon',
    challengeDetails: [
      'Amendă 15.000 RON de la ANSVSA pentru evidență incompletă',
      'Control medical expirat pentru 6 angajați din bucătărie',
      'Autorizație PSI expirată — risc închidere locație',
      'Instructaje HACCP și SSM nefăcute pentru angajați sezonieri',
      'Evidență echipamente stingere neactualizată de 2 ani',
      'Lipsa procedurilor scrise pentru situații urgență'
    ],
    solution: 'Implementare rapidă SSM+PSI cu focus pe HoReCa și conformitate ANSVSA',
    solutionDetails: [
      'Digitizare completă control medical cu alerte 30 zile înainte',
      'Modul PSI cu tracking echipamente stingere și verificări periodice',
      'Template-uri HACCP + SSM adaptate pentru restaurant',
      'Instructaje rapide pentru angajați sezonieri (10-15 minute)',
      'Proceduri urgență și evacuare personalizate',
      'Dashboard conformitate pentru verificare pre-inspecție'
    ],
    results: 'Zero incidente în 18 luni și certificare PSI exemplară',
    resultsDetails: [
      'Autorizație PSI reînnoită fără observații',
      'Zero incidente ANSVSA de la implementare',
      '100% angajați cu control medical valid permanent',
      'Instructaje HACCP+SSM completate în <24h pentru noi angajați',
      'Certificare "Very Good" la inspecția sanitară',
      'Economie 8 ore/lună pentru evidențe'
    ],
    quote: 'Am fost la un pas de închidere. Acum, la fiecare inspecție ANSVSA sau PSI, suntem pregătiți în 5 minute. Platforma ne-a dat liniștea că suntem conformi non-stop.',
    quoteAuthor: 'Maria Ionescu',
    quoteRole: 'Proprietar, Restaurant La Maria',
    metrics: [
      {
        label: 'Incidente ANSVSA',
        value: 'Zero',
        change: '18 luni',
        trend: 'up'
      },
      {
        label: 'Conformitate PSI',
        value: '100%',
        change: 'Exemplară',
        trend: 'up'
      },
      {
        label: 'Timp evidențe',
        value: '-8h/lună',
        change: '65% economie',
        trend: 'up'
      },
      {
        label: 'Control medical',
        value: '100%',
        change: 'Mereu valid',
        trend: 'up'
      }
    ],
    implementation: {
      duration: '1 săptămână',
      modules: ['Control Medical', 'Instructaje HACCP', 'PSI', 'Proceduri Urgență'],
      team: '1 consultant SSM/PSI + proprietar restaurant'
    },
    keyFeatures: [
      'Alerte medicale cu 30 zile înainte',
      'Template-uri HACCP ready-to-use',
      'Tracking echipamente PSI automat',
      'Instructaje rapide pentru sezonieri',
      'Dashboard pre-inspecție'
    ],
    beforeAfter: {
      before: [
        'Amendă ANSVSA 15.000 RON',
        '6 angajați cu control medical expirat',
        'Autorizație PSI expirată',
        'Zero instructaje pentru sezonieri',
        'Evidență PSI pe hârtie din 2019'
      ],
      after: [
        'Zero amenzi ANSVSA în 18 luni',
        '100% control medical valid',
        'Autorizație PSI reînnoită',
        'Instructaje în <24h pentru noi angajați',
        'Tracking PSI digital automat'
      ]
    }
  },
  {
    slug: 'metalprod-fabrica',
    company: 'MetalProd Industries',
    industry: 'Producție/Fabricație',
    industryIcon: '🏭',
    employees: 50,
    location: 'Timișoara',
    challenge: 'Accident de muncă grav și evaluare conformitate 62% la audit extern',
    challengeDetails: [
      'Accident de muncă nivel 2 — muncitor fără instructaj post',
      'Audit extern: conformitate SSM doar 62% (sub pragul acceptabil)',
      'Echipamente protecție neînregistrate sau expirate',
      'Evaluare risc profesional făcută în 2019 (neactualizată)',
      'Proceduri SSM generice, neadaptate activității reale',
      'Lipsa evidenței pentru verificări tehnice echipamente industriale'
    ],
    solution: 'Refacere completă sistem SSM cu focus pe producție industrială',
    solutionDetails: [
      'Implementare modul instructaje pe post cu verificare obligatorie',
      'Digitizare echipamente protecție cu QR și control scadențe',
      'Evaluare risc profesional refăcută digital cu plan măsuri',
      'Proceduri SSM personalizate per departament (sudură, frezare, montaj)',
      'Modul verificări tehnice pentru echipamente industriale (NC, CNC)',
      'Dashboard conformitate live pentru management și consultant'
    ],
    results: 'Conformitate 98% în 12 luni și zero accidente în ultimul an',
    resultsDetails: [
      'Conformitate SSM crescută de la 62% la 98%',
      'Zero accidente de muncă în ultimele 12 luni',
      '100% instructaje pe post completate în primele 24h',
      'Evaluare risc profesional actualizată digital și aprobată ITM',
      'Toate echipamentele industriale cu verificări tehnice la zi',
      'Audit extern trecut cu 97 puncte din 100'
    ],
    quote: 'După accident, am înțeles că SSM-ul nu e birocră­ție, e siguranța oamenilor. Platforma ne-a structurat tot — de la instructaje la verificări tehnice. Acum dormim liniștiți.',
    quoteAuthor: 'Ionuț Dragomir',
    quoteRole: 'Manager Producție, MetalProd Industries',
    metrics: [
      {
        label: 'Conformitate SSM',
        value: '98%',
        change: '+36 puncte',
        trend: 'up'
      },
      {
        label: 'Accidente muncă',
        value: 'Zero',
        change: '12 luni',
        trend: 'up'
      },
      {
        label: 'Instructaje post',
        value: '100%',
        change: 'În 24h',
        trend: 'up'
      },
      {
        label: 'Verificări tehnice',
        value: '100%',
        change: 'La zi',
        trend: 'up'
      }
    ],
    implementation: {
      duration: '4 săptămâni',
      modules: ['Instructaje Post', 'Echipamente', 'Risc Profesional', 'Verificări Tehnice', 'Proceduri SSM'],
      team: '1 consultant SSM senior + manager producție + responsabil SSM intern'
    },
    keyFeatures: [
      'Instructaje pe post cu verificare obligatorie',
      'QR tracking pentru echipamente protecție',
      'Evaluare risc digital actualizabilă',
      'Proceduri SSM per departament',
      'Modul verificări tehnice echipamente'
    ],
    beforeAfter: {
      before: [
        'Accident de muncă nivel 2',
        'Conformitate SSM 62%',
        'Instructaje incomplete sau lipsă',
        'Evaluare risc din 2019',
        'Verificări tehnice pe hârtie'
      ],
      after: [
        'Zero accidente în 12 luni',
        'Conformitate SSM 98%',
        '100% instructaje în 24h',
        'Evaluare risc digital aprobată ITM',
        'Toate verificări tehnice la zi'
      ]
    }
  },
  {
    slug: 'techsoft-it-nis2',
    company: 'TechSoft Solutions',
    industry: 'IT/Software',
    industryIcon: '💻',
    employees: 30,
    location: 'București',
    challenge: 'Conformitate NIS2 și securitate cibernetică pentru clienți enterprise',
    challengeDetails: [
      'Clienți enterprise cer dovezi conformitate NIS2 pentru contracte noi',
      'Evidență SSM minimă — ITM a amenințat cu amendă la control',
      'Remote work — dificil de urmărit instructaje și control medical',
      'Lipsa procedurilor pentru incidente securitate (obligatoriu NIS2)',
      'Echipamente ergonomice (scaune, monitoare) neînregistrate',
      'Training securitate cibernetică neintegrat cu SSM'
    ],
    solution: 'Platformă SSM+NIS2 adaptată pentru remote work și securitate IT',
    solutionDetails: [
      'Modul NIS2 cu proceduri incidente securitate și raportare',
      'Instructaje SSM + securitate cibernetică integrate',
      'Sistem remote-friendly: control medical și instructaje 100% digital',
      'Evidență echipamente ergonomice cu livrare la domiciliu',
      'Dashboard conformitate pentru prezentare către clienți',
      'Audit trail complet pentru cerințe NIS2 și GDPR'
    ],
    results: 'NIS2 ready în 6 săptămâni și contract de 500K EUR câștigat',
    resultsDetails: [
      'Certificat conformitate NIS2 obținut în 6 săptămâni',
      'Contract enterprise de 500K EUR câștigat cu dovezi conformitate',
      '100% angajați remote cu instructaje SSM + cyber completate',
      'Zero observații la controlul ITM (surpriză pozitivă pentru auditori)',
      'Proceduri incidente securitate aprobate de CERT-RO',
      'Timp pentru conformitate redus cu 80% vs manual'
    ],
    quote: 'Ca firmă IT, nu ne gândeam că SSM-ul e relevant. Dar clienții enterprise cer conformitate totală — SSM, NIS2, GDPR. Platforma ne-a pus pe hartă ca partener de încredere.',
    quoteAuthor: 'Alexandra Matei',
    quoteRole: 'CEO, TechSoft Solutions',
    metrics: [
      {
        label: 'NIS2 Ready',
        value: '6 săpt',
        change: 'Certificat',
        trend: 'up'
      },
      {
        label: 'Contract câștigat',
        value: '500K EUR',
        change: 'Datorită conformității',
        trend: 'up'
      },
      {
        label: 'Instructaje remote',
        value: '100%',
        change: 'Completate',
        trend: 'up'
      },
      {
        label: 'Timp conformitate',
        value: '-80%',
        change: 'Automatizare',
        trend: 'up'
      }
    ],
    implementation: {
      duration: '2 săptămâni',
      modules: ['NIS2', 'Instructaje SSM+Cyber', 'Control Medical Remote', 'Echipamente Ergonomice', 'Audit Trail'],
      team: '1 consultant SSM + 1 specialist NIS2 + HR manager'
    },
    keyFeatures: [
      'Modul NIS2 cu proceduri incidente',
      'Instructaje SSM + securitate cibernetică',
      'Sistem 100% remote-friendly',
      'Dashboard conformitate pentru clienți',
      'Audit trail complet NIS2/GDPR'
    ],
    beforeAfter: {
      before: [
        'Lipsă conformitate NIS2',
        'Risc pierdere contract 500K EUR',
        'Evidență SSM minimă',
        'Instructaje remote pe email (haotic)',
        'Zero proceduri incidente securitate'
      ],
      after: [
        'Certificat NIS2 în 6 săptămâni',
        'Contract 500K EUR câștigat',
        '100% conformitate SSM',
        'Instructaje remote 100% digitale',
        'Proceduri incidente aprobate CERT-RO'
      ]
    }
  },
  {
    slug: 'panoramic-hotel-psi',
    company: 'Hotel Panoramic',
    industry: 'Turism/Ospitalitate',
    industryIcon: '🏨',
    employees: 45,
    location: 'Brașov',
    challenge: 'Inspecție PSI neanunțată — sistem stingere nerevizuit și plan evacuare învechit',
    challengeDetails: [
      'Inspecție PSI surpriză — sistem stingere nerevizuit de 18 luni',
      'Plan evacuare desenat în 2018, neactualizat după renovare',
      'Instructaje PSI pentru angajați făcute acum 3 ani',
      'Hidranți interiori fără verificări periodice (obligatorii la 6 luni)',
      'Evidență echipamente stingere pe hârtie — lipsă 8 documente',
      'Risc real: clădire 6 etaje cu 120 camere și restaurant'
    ],
    solution: 'Digitizare completă PSI cu focus pe ospitalitate și siguranța oaspeților',
    solutionDetails: [
      'Modul PSI cu tracking automat verificări sisteme stingere',
      'Planuri evacuare digitale actualizate și afișate QR în fiecare etaj',
      'Instructaje PSI rapide pentru angajați sezonieri (15 minute)',
      'Calendar automat pentru verificări hidranți, stingătoare, sisteme alarmare',
      'Proceduri urgență personalizate pentru hotel (incendiu, evacuare, asiență)',
      'Aplicație mobilă pentru personalul de securitate cu checklist-uri'
    ],
    results: 'PSI exemplar — studiu de caz prezentat de ISU Brașov la conferință',
    resultsDetails: [
      'Autorizație PSI reînnoită cu calificativ "exemplar"',
      'Toate verificările PSI la zi automat — zero scadențe ratate',
      '100% angajați instruiți PSI, inclusiv sezonieri',
      'ISU Brașov a folosit hotelul ca studiu de caz la conferință regională',
      'Certificare TripAdvisor "Safety First" obținută',
      'Zero incidente evacuare sau alarme false în 20 luni'
    ],
    quote: 'În turism, siguranța oaspeților e tot. După ce ISU ne-a folosit ca exemplu de bune practici, ocuparea a crescut cu 15%. Oaspeții văd că suntem profesioniști până la capăt.',
    quoteAuthor: 'Mihai Cristescu',
    quoteRole: 'Director Operațional, Hotel Panoramic',
    metrics: [
      {
        label: 'Calificativ PSI',
        value: 'Exemplar',
        change: 'ISU studiu de caz',
        trend: 'up'
      },
      {
        label: 'Verificări PSI',
        value: '100%',
        change: 'La zi automat',
        trend: 'up'
      },
      {
        label: 'Instructaje PSI',
        value: '100%',
        change: 'Inclusiv sezonieri',
        trend: 'up'
      },
      {
        label: 'Ocupare hotel',
        value: '+15%',
        change: 'Imagine siguranță',
        trend: 'up'
      }
    ],
    implementation: {
      duration: '3 săptămâni',
      modules: ['PSI Complet', 'Planuri Evacuare', 'Verificări Periodice', 'Instructaje Rapid', 'Mobile App'],
      team: '1 consultant PSI + director hotel + responsabil securitate'
    },
    keyFeatures: [
      'Tracking automat verificări PSI',
      'Planuri evacuare digitale cu QR',
      'Instructaje rapide pentru sezonieri',
      'Calendar verificări automat',
      'App mobilă pentru securitate'
    ],
    beforeAfter: {
      before: [
        'Sistem stingere nerevizuit 18 luni',
        'Plan evacuare din 2018',
        'Instructaje PSI acum 3 ani',
        'Evidență hârtie — lipsă 8 documente',
        'Risc amenzi ISU și închidere'
      ],
      after: [
        'Toate verificări PSI la zi',
        'Planuri evacuare actualizate digital',
        '100% angajați instruiți PSI',
        'Evidență digitală completă',
        'Calificativ "exemplar" de la ISU'
      ]
    }
  }
];

/**
 * Helper: obține case study după slug
 */
export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudiesDetailed.find(cs => cs.slug === slug);
}

/**
 * Helper: filtrare case studies după industrie
 */
export function getCaseStudiesByIndustry(industry: string): CaseStudy[] {
  return caseStudiesDetailed.filter(cs =>
    cs.industry.toLowerCase().includes(industry.toLowerCase())
  );
}

/**
 * Helper: obține toate industriile
 */
export function getAllIndustries(): string[] {
  return [...new Set(caseStudiesDetailed.map(cs => cs.industry))];
}
