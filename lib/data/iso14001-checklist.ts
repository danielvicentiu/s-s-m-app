/**
 * ISO 14001:2015 Environmental Management System Checklist
 *
 * Comprehensive checklist covering environmental aspects, legal compliance,
 * objectives, programs, monitoring, internal audit, and management review.
 */

export interface ISO14001ChecklistItem {
  id: string;
  clause: string;
  requirement: string;
  evidence: string[];
  auditQuestion: string;
  category: 'context' | 'leadership' | 'planning' | 'support' | 'operation' | 'performance' | 'improvement';
}

export const iso14001Checklist: ISO14001ChecklistItem[] = [
  // 4. Context of the Organization
  {
    id: 'iso14001-4.1',
    clause: '4.1',
    requirement: 'Înțelegerea organizației și a contextului său',
    evidence: [
      'Analiza contextului organizației (factori interni și externi)',
      'Documentarea problemelor relevante pentru sistemul de management de mediu',
      'Identificarea părților interesate și a așteptărilor acestora'
    ],
    auditQuestion: 'Cum determină organizația aspectele interne și externe relevante pentru scopul său și care afectează capacitatea de a atinge rezultatele dorite ale SMM?',
    category: 'context'
  },
  {
    id: 'iso14001-4.2',
    clause: '4.2',
    requirement: 'Înțelegerea nevoilor și așteptărilor părților interesate',
    evidence: [
      'Lista părților interesate identificate',
      'Documentarea nevoilor și așteptărilor relevante',
      'Evidența obligațiilor de conformitate determinate'
    ],
    auditQuestion: 'Cum identifică organizația părțile interesate relevante pentru SMM și cerințele acestora?',
    category: 'context'
  },
  {
    id: 'iso14001-4.3',
    clause: '4.3',
    requirement: 'Determinarea domeniului de aplicare al SMM',
    evidence: [
      'Document care definește domeniul de aplicare al SMM',
      'Justificarea limitelor și aplicabilității',
      'Lista funcțiilor, activităților și proceselor incluse'
    ],
    auditQuestion: 'Este domeniul de aplicare al SMM definit și documentat, incluzând limitele și aplicabilitatea?',
    category: 'context'
  },
  {
    id: 'iso14001-4.4',
    clause: '4.4',
    requirement: 'Sistemul de management de mediu',
    evidence: [
      'Documentarea proceselor SMM și interacțiunilor acestora',
      'Proceduri pentru gestionarea proceselor',
      'Resurse alocate pentru menținerea SMM'
    ],
    auditQuestion: 'Cum stabilește, implementează, menține și îmbunătățește continuu organizația SMM, incluzând procesele necesare și interacțiunile acestora?',
    category: 'context'
  },

  // 5. Leadership
  {
    id: 'iso14001-5.1',
    clause: '5.1',
    requirement: 'Leadership și angajament',
    evidence: [
      'Politica de mediu aprobată de conducere',
      'Minute de ședințe care demonstrează implicarea managementului',
      'Alocarea resurselor pentru SMM'
    ],
    auditQuestion: 'Cum demonstrează conducerea superioară leadership și angajament față de SMM?',
    category: 'leadership'
  },
  {
    id: 'iso14001-5.2',
    clause: '5.2',
    requirement: 'Politica de mediu',
    evidence: [
      'Politica de mediu documentată și aprobată',
      'Dovada comunicării politicii către angajați',
      'Politica disponibilă părților interesate',
      'Angajament pentru protecția mediului, conformitate și îmbunătățire continuă'
    ],
    auditQuestion: 'Este politica de mediu stabilită, documentată, comunicată și disponibilă părților interesate? Include angajamente pentru conformitate și îmbunătățire continuă?',
    category: 'leadership'
  },
  {
    id: 'iso14001-5.3',
    clause: '5.3',
    requirement: 'Roluri, responsabilități și autorități organizaționale',
    evidence: [
      'Organigrama cu responsabilități de mediu',
      'Fișe de post cu atribuții de mediu',
      'Desemnarea reprezentantului managementului pentru mediu'
    ],
    auditQuestion: 'Sunt rolurile, responsabilitățile și autoritățile pentru SMM atribuite, comunicate și înțelese în organizație?',
    category: 'leadership'
  },

  // 6. Planning - Environmental Aspects
  {
    id: 'iso14001-6.1.2',
    clause: '6.1.2',
    requirement: 'Aspecte de mediu',
    evidence: [
      'Registrul aspectelor de mediu identificate',
      'Metodologia de evaluare a semnificației aspectelor',
      'Lista aspectelor semnificative de mediu',
      'Informații documentate despre aspectele de mediu și criteriile de evaluare'
    ],
    auditQuestion: 'Cum identifică organizația aspectele de mediu ale activităților, produselor și serviciilor sale și determină care dintre acestea sunt semnificative?',
    category: 'planning'
  },
  {
    id: 'iso14001-6.1.3',
    clause: '6.1.3',
    requirement: 'Obligații de conformitate',
    evidence: [
      'Registrul legislației de mediu aplicabile',
      'Evaluarea conformității cu cerințele legale',
      'Procedura de identificare și acces la cerințe legale',
      'Evidența actualizării periodice a obligațiilor'
    ],
    auditQuestion: 'Cum determină și are acces organizația la obligațiile de conformitate legate de aspectele sale de mediu?',
    category: 'planning'
  },
  {
    id: 'iso14001-6.1.4',
    clause: '6.1.4',
    requirement: 'Planificarea acțiunilor',
    evidence: [
      'Planuri de acțiune pentru aspectele semnificative',
      'Planuri pentru îndeplinirea obligațiilor de conformitate',
      'Integrarea acțiunilor în procesele SMM',
      'Evaluarea eficacității acțiunilor'
    ],
    auditQuestion: 'Cum planifică organizația acțiuni pentru a aborda aspectele semnificative și obligațiile de conformitate?',
    category: 'planning'
  },

  // 6.2 Environmental Objectives
  {
    id: 'iso14001-6.2.1',
    clause: '6.2.1',
    requirement: 'Obiective de mediu',
    evidence: [
      'Obiective de mediu documentate',
      'Obiective măsurabile și monitorizate',
      'Alinierea obiectivelor cu politica de mediu',
      'Considerarea aspectelor semnificative în stabilirea obiectivelor'
    ],
    auditQuestion: 'Sunt obiectivele de mediu stabilite pentru funcțiile și nivelurile relevante, consistente cu politica de mediu și măsurabile?',
    category: 'planning'
  },
  {
    id: 'iso14001-6.2.2',
    clause: '6.2.2',
    requirement: 'Planificarea acțiunilor pentru atingerea obiectivelor de mediu',
    evidence: [
      'Programe de management de mediu',
      'Definirea responsabilităților pentru fiecare obiectiv',
      'Termene stabilite pentru atingerea obiectivelor',
      'Resurse alocate',
      'Indicatori pentru evaluarea progresului'
    ],
    auditQuestion: 'Cum planifică organizația atingerea obiectivelor de mediu, incluzând ce va fi făcut, resursele necesare, responsabilitățile și termenele?',
    category: 'planning'
  },

  // 7. Support
  {
    id: 'iso14001-7.1',
    clause: '7.1',
    requirement: 'Resurse',
    evidence: [
      'Buget alocat pentru activități de mediu',
      'Personal desemnat pentru SMM',
      'Infrastructură și echipamente pentru monitorizare',
      'Dovada alocării resurselor necesare'
    ],
    auditQuestion: 'Cum determină și furnizează organizația resursele necesare pentru stabilirea, implementarea, menținerea și îmbunătățirea continuă a SMM?',
    category: 'support'
  },
  {
    id: 'iso14001-7.2',
    clause: '7.2',
    requirement: 'Competență',
    evidence: [
      'Matrice de competențe pentru funcții cu impact asupra mediului',
      'Înregistrări privind educația, formarea și experiența',
      'Programe de instruire de mediu',
      'Evaluarea eficacității instruirilor'
    ],
    auditQuestion: 'Cum asigură organizația că persoanele care lucrează sub controlul său sunt competente pe baza educației, instruirii sau experienței adecvate?',
    category: 'support'
  },
  {
    id: 'iso14001-7.3',
    clause: '7.3',
    requirement: 'Conștientizare',
    evidence: [
      'Dovada comunicării politicii de mediu',
      'Materiale de conștientizare pentru angajați',
      'Evidența instruirilor de conștientizare',
      'Înțelegerea aspectelor semnificative și impactului individual'
    ],
    auditQuestion: 'Sunt persoanele care lucrează sub controlul organizației conștiente de politica de mediu, aspectele semnificative și contribuția lor la eficacitatea SMM?',
    category: 'support'
  },
  {
    id: 'iso14001-7.4',
    clause: '7.4',
    requirement: 'Comunicare',
    evidence: [
      'Procedura de comunicare internă și externă',
      'Evidența comunicărilor despre SMM',
      'Mecanisme de răspuns la comunicările externe',
      'Rapoarte de mediu către părțile interesate'
    ],
    auditQuestion: 'Cum stabilește organizația procesele necesare pentru comunicare internă și externă relevantă pentru SMM?',
    category: 'support'
  },
  {
    id: 'iso14001-7.5',
    clause: '7.5',
    requirement: 'Informații documentate',
    evidence: [
      'Manualul SMM sau documente echivalente',
      'Proceduri documentate cerute de standard',
      'Înregistrări privind performanța de mediu',
      'Control al documentelor și înregistrărilor'
    ],
    auditQuestion: 'Include SMM informațiile documentate cerute de standard și cele determinate de organizație ca fiind necesare pentru eficacitatea SMM?',
    category: 'support'
  },

  // 8. Operation
  {
    id: 'iso14001-8.1',
    clause: '8.1',
    requirement: 'Planificare și control operațional',
    evidence: [
      'Proceduri de control operațional pentru aspectele semnificative',
      'Criterii operaționale stabilite',
      'Implementarea și menținerea controlului proceselor',
      'Control asupra proceselor externalizate'
    ],
    auditQuestion: 'Cum planifică, implementează și controlează organizația procesele necesare pentru a îndeplini cerințele SMM și pentru a implementa acțiunile stabilite?',
    category: 'operation'
  },
  {
    id: 'iso14001-8.2',
    clause: '8.2',
    requirement: 'Pregătirea și răspunsul la situații de urgență',
    evidence: [
      'Identificarea potențialelor situații de urgență',
      'Proceduri de răspuns la situații de urgență',
      'Teste și exerciții de simulare',
      'Revizuirea și actualizarea procedurilor după incidente'
    ],
    auditQuestion: 'Cum pregătește organizația răspunsul la potențiale situații de urgență și testează periodic procedurile stabilite?',
    category: 'operation'
  },

  // 9. Performance Evaluation - Monitoring
  {
    id: 'iso14001-9.1.1',
    clause: '9.1.1',
    requirement: 'Monitorizare, măsurare, analiză și evaluare',
    evidence: [
      'Programe de monitorizare a aspectelor semnificative',
      'Înregistrări ale rezultatelor monitorizării',
      'Calibrarea echipamentelor de măsurare',
      'Analiza datelor de performanță de mediu'
    ],
    auditQuestion: 'Ce monitorizează și măsoară organizația în legătură cu aspectele semnificative de mediu și conformitatea cu obligațiile?',
    category: 'performance'
  },
  {
    id: 'iso14001-9.1.2',
    clause: '9.1.2',
    requirement: 'Evaluarea conformității',
    evidence: [
      'Procedura de evaluare a conformității',
      'Rapoarte de evaluare a conformității legale',
      'Frecvența evaluărilor stabilită',
      'Înregistrări ale rezultatelor evaluării',
      'Acțiuni corective pentru neconformități'
    ],
    auditQuestion: 'Cum evaluează organizația conformitatea cu obligațiile de conformitate și ce frecvență folosește?',
    category: 'performance'
  },

  // 9.2 Internal Audit
  {
    id: 'iso14001-9.2.1',
    clause: '9.2.1',
    requirement: 'Audit intern - Generalități',
    evidence: [
      'Programul de audit intern',
      'Procedura de audit intern',
      'Planuri de audit detaliate',
      'Criterii de audit definite'
    ],
    auditQuestion: 'Efectuează organizația audituri interne la intervale planificate pentru a furniza informații despre conformitatea și eficacitatea SMM?',
    category: 'performance'
  },
  {
    id: 'iso14001-9.2.2',
    clause: '9.2.2',
    requirement: 'Audit intern - Program',
    evidence: [
      'Programul anual de audituri',
      'Evidența implementării auditurilor',
      'Rapoarte de audit',
      'Competența auditorilor (instruire, calificare)',
      'Independența auditorilor',
      'Comunicarea rezultatelor către management'
    ],
    auditQuestion: 'Include programul de audit frecvența, metodele, responsabilitățile, cerințele de planificare și raportare? Sunt auditurile obiective și imparțiale?',
    category: 'performance'
  },

  // 9.3 Management Review
  {
    id: 'iso14001-9.3.1',
    clause: '9.3.1',
    requirement: 'Analiza efectuată de management - Generalități',
    evidence: [
      'Planificarea analizelor efectuate de management',
      'Minute ale ședințelor de analiză',
      'Lista participanților',
      'Frecvența analizelor (cel puțin anual)'
    ],
    auditQuestion: 'Revizuiește conducerea superioară SMM la intervale planificate pentru a asigura menținerea adecvării, suficienței și eficacității acestuia?',
    category: 'performance'
  },
  {
    id: 'iso14001-9.3.2',
    clause: '9.3.2',
    requirement: 'Analiza efectuată de management - Input-uri',
    evidence: [
      'Rapoarte despre performanța de mediu',
      'Rezultate ale evaluării conformității',
      'Rezultate ale auditurilor interne',
      'Comunicări de la părțile interesate',
      'Progresul obiectivelor de mediu',
      'Neconformități și acțiuni corective',
      'Rezultate ale monitorizării',
      'Oportunități de îmbunătățire continuă'
    ],
    auditQuestion: 'Include analiza efectuată de management considerații privind starea acțiunilor din analizele anterioare, schimbări în aspectele de mediu, obiective și alte elemente relevante?',
    category: 'performance'
  },
  {
    id: 'iso14001-9.3.3',
    clause: '9.3.3',
    requirement: 'Analiza efectuată de management - Output-uri',
    evidence: [
      'Concluzii privind adecvarea și eficacitatea SMM',
      'Decizii privind îmbunătățirea continuă',
      'Acțiuni stabilite în urma analizei',
      'Necesități de resurse identificate',
      'Actualizări ale obiectivelor și planurilor'
    ],
    auditQuestion: 'Care sunt output-urile analizei efectuate de management și cum sunt documentate și comunicate deciziile și acțiunile?',
    category: 'performance'
  },

  // 10. Improvement
  {
    id: 'iso14001-10.1',
    clause: '10.1',
    requirement: 'Generalități - Îmbunătățire continuă',
    evidence: [
      'Dovezi ale îmbunătățirii continue a performanței de mediu',
      'Inițiative de îmbunătățire implementate',
      'Rezultate măsurabile ale îmbunătățirilor',
      'Planuri de îmbunătățire pentru anul următor'
    ],
    auditQuestion: 'Cum îmbunătățește continuu organizația adecvarea, suficiența și eficacitatea SMM pentru a spori performanța de mediu?',
    category: 'improvement'
  },
  {
    id: 'iso14001-10.2',
    clause: '10.2',
    requirement: 'Neconformități și acțiuni corective',
    evidence: [
      'Înregistrări ale neconformităților identificate',
      'Procedura de tratare a neconformităților',
      'Planuri de acțiuni corective',
      'Analiza cauzelor principale',
      'Evidența implementării și eficacității acțiunilor',
      'Actualizări ale riscurilor și oportunităților'
    ],
    auditQuestion: 'Cum reacționează organizația la neconformități, evaluează nevoia de acțiuni corective, implementează acțiunile și revizuiește eficacitatea acestora?',
    category: 'improvement'
  },
  {
    id: 'iso14001-10.3',
    clause: '10.3',
    requirement: 'Îmbunătățire continuă',
    evidence: [
      'Obiective de îmbunătățire a performanței de mediu',
      'Proiecte de reducere a impactului de mediu',
      'Îmbunătățiri ale proceselor SMM',
      'Utilizarea de noi tehnologii mai curate',
      'Reducerea consumului de resurse și deșeuri'
    ],
    auditQuestion: 'Ce face organizația pentru a îmbunătăți continuu adecvarea, suficiența și eficacitatea SMM și performanța de mediu?',
    category: 'improvement'
  },

  // Additional specific requirements
  {
    id: 'iso14001-legal-compliance',
    clause: '6.1.3 / 9.1.2',
    requirement: 'Conformitate legală de mediu - Monitoring',
    evidence: [
      'Calendar de obligații legale de mediu',
      'Autorizații și permise de mediu valide',
      'Declarații de mediu depuse la autorități',
      'Rapoarte de monitorizare a emisiilor/deversărilor',
      'Dovezi ale plății taxelor de mediu'
    ],
    auditQuestion: 'Cum asigură organizația că respectă toate obligațiile legale de mediu aplicabile și monitorizează modificările legislative?',
    category: 'planning'
  },
  {
    id: 'iso14001-waste-management',
    clause: '8.1',
    requirement: 'Gestionarea deșeurilor',
    evidence: [
      'Registrul deșeurilor generate',
      'Contracte cu operatori autorizați de colectare deșeuri',
      'Formulare de predare-primire deșeuri',
      'Proceduri de segregare la sursă',
      'Monitorizarea reducerii deșeurilor'
    ],
    auditQuestion: 'Cum gestionează organizația deșeurile generate pentru a minimiza impactul asupra mediului și a asigura conformitatea legală?',
    category: 'operation'
  },
  {
    id: 'iso14001-energy-resources',
    clause: '8.1',
    requirement: 'Utilizarea eficientă a resurselor și energiei',
    evidence: [
      'Monitorizarea consumurilor de energie și apă',
      'Obiective de reducere a consumurilor',
      'Măsuri de eficiență energetică implementate',
      'Analiza tendințelor de consum'
    ],
    auditQuestion: 'Cum monitorizează și reduce organizația consumul de resurse naturale și energie în cadrul operațiunilor sale?',
    category: 'operation'
  }
];

/**
 * Get checklist items by category
 */
export function getChecklistByCategory(category: ISO14001ChecklistItem['category']): ISO14001ChecklistItem[] {
  return iso14001Checklist.filter(item => item.category === category);
}

/**
 * Get checklist items by clause
 */
export function getChecklistByClause(clause: string): ISO14001ChecklistItem[] {
  return iso14001Checklist.filter(item => item.clause.startsWith(clause));
}

/**
 * Get checklist summary statistics
 */
export function getChecklistSummary() {
  const summary = {
    total: iso14001Checklist.length,
    byCategory: {} as Record<string, number>
  };

  iso14001Checklist.forEach(item => {
    summary.byCategory[item.category] = (summary.byCategory[item.category] || 0) + 1;
  });

  return summary;
}

export default iso14001Checklist;
