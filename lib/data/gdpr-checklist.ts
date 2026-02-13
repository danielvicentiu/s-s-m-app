/**
 * GDPR Compliance Checklist
 *
 * Comprehensive checklist for GDPR compliance verification
 * covering DPO, DPIA, consent, breach notification, data subject rights, and security
 */

export type GdprCategory = 'DPO' | 'DPIA' | 'consent' | 'breach' | 'rights' | 'security';

export interface GdprCheckpoint {
  id: string;
  category: GdprCategory;
  checkpoint: string;
  description: string;
  required: boolean;
  evidence: string[];
  legalBasis: string;
}

export const gdprChecklist: GdprCheckpoint[] = [
  // DPO (Data Protection Officer) - Articles 37-39
  {
    id: 'DPO-001',
    category: 'DPO',
    checkpoint: 'Desemnarea DPO (Data Protection Officer)',
    description: 'Organizația a desemnat un responsabil cu protecția datelor (DPO) conform cerințelor Art. 37 GDPR, dacă activitățile implică prelucrări la scară largă sau categorii speciale de date.',
    required: true,
    evidence: [
      'Decizie de numire DPO',
      'Date de contact DPO publicate',
      'Notificare către autoritatea de supraveghere (ANSPDCP)'
    ],
    legalBasis: 'Art. 37-39 GDPR'
  },
  {
    id: 'DPO-002',
    category: 'DPO',
    checkpoint: 'Independența și resursele DPO',
    description: 'DPO are independență funcțională, nu primește instrucțiuni privind îndeplinirea sarcinilor și dispune de resurse necesare.',
    required: true,
    evidence: [
      'Fișa postului DPO',
      'Buget alocat activității DPO',
      'Confirmare absență conflict de interese'
    ],
    legalBasis: 'Art. 38 GDPR'
  },
  {
    id: 'DPO-003',
    category: 'DPO',
    checkpoint: 'Raportarea DPO către conducere',
    description: 'DPO raportează direct către nivelul cel mai înalt al conducerii organizației.',
    required: true,
    evidence: [
      'Organigrama organizației',
      'Rapoarte periodice DPO',
      'Procese-verbale întâlniri cu conducerea'
    ],
    legalBasis: 'Art. 38(3) GDPR'
  },

  // DPIA (Data Protection Impact Assessment) - Articles 35-36
  {
    id: 'DPIA-001',
    category: 'DPIA',
    checkpoint: 'Evaluarea necesității DPIA',
    description: 'Organizația a evaluat dacă activitățile de prelucrare necesită o evaluare a impactului asupra protecției datelor (DPIA).',
    required: true,
    evidence: [
      'Registrul operațiunilor de prelucrare',
      'Screening DPIA pentru toate prelucrările',
      'Lista prelucrărilor care necesită DPIA'
    ],
    legalBasis: 'Art. 35(1) GDPR'
  },
  {
    id: 'DPIA-002',
    category: 'DPIA',
    checkpoint: 'Efectuarea DPIA pentru prelucrări cu risc ridicat',
    description: 'DPIA a fost efectuată pentru prelucrările care prezintă un risc ridicat pentru drepturile persoanelor (profilare automată, categorii speciale, monitorizare la scară largă).',
    required: true,
    evidence: [
      'Rapoarte DPIA complete',
      'Măsuri de atenuare a riscurilor',
      'Consultarea DPO'
    ],
    legalBasis: 'Art. 35(3) GDPR'
  },
  {
    id: 'DPIA-003',
    category: 'DPIA',
    checkpoint: 'Consultarea autorității de supraveghere',
    description: 'Dacă DPIA indică un risc ridicat rezidual, autoritatea de supraveghere (ANSPDCP) a fost consultată înainte de prelucrare.',
    required: false,
    evidence: [
      'Consultare prealabilă transmisă către ANSPDCP',
      'Răspuns autoritate',
      'Măsuri suplimentare implementate'
    ],
    legalBasis: 'Art. 36 GDPR'
  },

  // Consent - Articles 6-7
  {
    id: 'CONSENT-001',
    category: 'consent',
    checkpoint: 'Temei legal valid pentru prelucrare',
    description: 'Toate prelucrările de date personale au un temei legal valid conform Art. 6 GDPR (consimțământ, contract, obligație legală, interes vital, interes public, interes legitim).',
    required: true,
    evidence: [
      'Registrul operațiunilor cu temei legal',
      'Documente justificative pentru fiecare temei',
      'Evaluare interese legitime (dacă aplicabil)'
    ],
    legalBasis: 'Art. 6 GDPR'
  },
  {
    id: 'CONSENT-002',
    category: 'consent',
    checkpoint: 'Consimțământ liber, specific, informat și neechivoc',
    description: 'Când prelucrarea se bazează pe consimțământ, acesta este liber, specific, informat și exprimat printr-o acțiune afirmativă clară.',
    required: true,
    evidence: [
      'Formulare de consimțământ',
      'Capturi ecran (pentru consimțământ online)',
      'Registrul consimțămintelor'
    ],
    legalBasis: 'Art. 4(11), Art. 7 GDPR'
  },
  {
    id: 'CONSENT-003',
    category: 'consent',
    checkpoint: 'Posibilitatea de retragere a consimțământului',
    description: 'Persoanele vizate sunt informate despre dreptul de a-și retrage consimțământul și pot face acest lucru cu ușurință.',
    required: true,
    evidence: [
      'Mecanisme de retragere implementate',
      'Informări clare despre retragere',
      'Procesare promptă a retragerii'
    ],
    legalBasis: 'Art. 7(3) GDPR'
  },
  {
    id: 'CONSENT-004',
    category: 'consent',
    checkpoint: 'Consimțământ explicit pentru categorii speciale',
    description: 'Pentru prelucrarea categoriilor speciale de date (Art. 9), organizația a obținut consimțământ explicit sau se aplică o excepție validă.',
    required: true,
    evidence: [
      'Formulare consimțământ explicit',
      'Documentare excepții Art. 9(2)',
      'Măsuri suplimentare de protecție'
    ],
    legalBasis: 'Art. 9 GDPR'
  },

  // Breach Notification - Articles 33-34
  {
    id: 'BREACH-001',
    category: 'breach',
    checkpoint: 'Procedură de gestionare a breșelor de securitate',
    description: 'Organizația dispune de o procedură documentată pentru detectarea, investigarea și raportarea breșelor de date personale.',
    required: true,
    evidence: [
      'Procedură breșe de securitate',
      'Echipă de răspuns la incidente',
      'Șabloane notificare'
    ],
    legalBasis: 'Art. 33-34 GDPR'
  },
  {
    id: 'BREACH-002',
    category: 'breach',
    checkpoint: 'Notificarea autorității în 72 ore',
    description: 'Organizația notifică autoritatea de supraveghere (ANSPDCP) despre breșele de date în termen de 72 ore de la conștientizare, dacă există risc pentru drepturi și libertăți.',
    required: true,
    evidence: [
      'Registrul breșelor de securitate',
      'Notificări transmise către ANSPDCP',
      'Confirmare primire de la autoritate'
    ],
    legalBasis: 'Art. 33 GDPR'
  },
  {
    id: 'BREACH-003',
    category: 'breach',
    checkpoint: 'Notificarea persoanelor vizate',
    description: 'În cazul breșelor cu risc ridicat pentru drepturi și libertăți, persoanele vizate sunt notificate fără întârziere nejustificată.',
    required: true,
    evidence: [
      'Evaluare risc pentru fiecare breșă',
      'Comunicări către persoane vizate',
      'Dovezi de transmitere'
    ],
    legalBasis: 'Art. 34 GDPR'
  },

  // Data Subject Rights - Articles 12-22
  {
    id: 'RIGHTS-001',
    category: 'rights',
    checkpoint: 'Dreptul de acces la date',
    description: 'Organizația oferă persoanelor vizate acces la datele prelucrate despre ele și informații despre prelucrare, cu răspuns în 30 zile.',
    required: true,
    evidence: [
      'Procedură drept de acces',
      'Registrul cererilor de acces',
      'Exemple răspunsuri furnizate'
    ],
    legalBasis: 'Art. 15 GDPR'
  },
  {
    id: 'RIGHTS-002',
    category: 'rights',
    checkpoint: 'Dreptul de rectificare',
    description: 'Persoanele vizate pot solicita rectificarea datelor inexacte sau completarea datelor incomplete.',
    required: true,
    evidence: [
      'Procedură rectificare',
      'Registrul cererilor',
      'Măsuri tehnice implementate'
    ],
    legalBasis: 'Art. 16 GDPR'
  },
  {
    id: 'RIGHTS-003',
    category: 'rights',
    checkpoint: 'Dreptul la ștergerea datelor ("dreptul de a fi uitat")',
    description: 'Organizația respectă dreptul persoanelor de a solicita ștergerea datelor, când se aplică condițiile Art. 17.',
    required: true,
    evidence: [
      'Procedură ștergere',
      'Evaluare cereri vs. excepții',
      'Implementare tehnică ștergere'
    ],
    legalBasis: 'Art. 17 GDPR'
  },
  {
    id: 'RIGHTS-004',
    category: 'rights',
    checkpoint: 'Dreptul la restricționarea prelucrării',
    description: 'Persoanele pot solicita restricționarea prelucrării în anumite situații (contestare exactitate, prelucrare ilegală, opoziție).',
    required: true,
    evidence: [
      'Procedură restricționare',
      'Sistem marcare date restricționate',
      'Registrul cererilor'
    ],
    legalBasis: 'Art. 18 GDPR'
  },
  {
    id: 'RIGHTS-005',
    category: 'rights',
    checkpoint: 'Dreptul la portabilitatea datelor',
    description: 'Pentru datele furnizate pe baza consimțământului sau contractului, persoanele pot primi datele într-un format structurat, utilizat curent și care poate fi citit automat.',
    required: true,
    evidence: [
      'Procedură portabilitate',
      'Format export (JSON/CSV/XML)',
      'Funcționalitate export implementată'
    ],
    legalBasis: 'Art. 20 GDPR'
  },
  {
    id: 'RIGHTS-006',
    category: 'rights',
    checkpoint: 'Dreptul de opoziție',
    description: 'Persoanele pot face opoziție la prelucrarea bazată pe interes legitim sau pentru marketing direct.',
    required: true,
    evidence: [
      'Procedură opoziție',
      'Mecanism unsubscribe marketing',
      'Registrul opoziții'
    ],
    legalBasis: 'Art. 21 GDPR'
  },
  {
    id: 'RIGHTS-007',
    category: 'rights',
    checkpoint: 'Protecție împotriva deciziilor automatizate',
    description: 'Persoanele au dreptul de a nu face obiectul unor decizii bazate exclusiv pe prelucrare automată, inclusiv profilare, care produc efecte juridice sau le afectează semnificativ.',
    required: true,
    evidence: [
      'Inventar procese automatizate',
      'Intervenție umană în decizii critice',
      'Informare despre logica automatizării'
    ],
    legalBasis: 'Art. 22 GDPR'
  },

  // Security - Articles 32, 25
  {
    id: 'SECURITY-001',
    category: 'security',
    checkpoint: 'Măsuri tehnice și organizatorice adecvate',
    description: 'Organizația implementează măsuri tehnice și organizatorice corespunzătoare pentru a asigura un nivel de securitate adecvat riscului.',
    required: true,
    evidence: [
      'Politică de securitate',
      'Evaluare riscuri',
      'Plan măsuri de securitate'
    ],
    legalBasis: 'Art. 32 GDPR'
  },
  {
    id: 'SECURITY-002',
    category: 'security',
    checkpoint: 'Pseudonimizare și criptare',
    description: 'Datele personale sunt pseudonimizate și/sau criptate acolo unde este necesar, în special pentru date sensibile și transmisii.',
    required: true,
    evidence: [
      'Politică criptare',
      'Certificate SSL/TLS',
      'Criptare bază de date'
    ],
    legalBasis: 'Art. 32(1)(a) GDPR'
  },
  {
    id: 'SECURITY-003',
    category: 'security',
    checkpoint: 'Confidențialitate, integritate, disponibilitate și reziliență',
    description: 'Sistemele de prelucrare asigură confidențialitatea, integritatea, disponibilitatea și reziliența permanente.',
    required: true,
    evidence: [
      'Backup și disaster recovery',
      'Monitorizare sisteme',
      'Teste de reziliență'
    ],
    legalBasis: 'Art. 32(1)(b) GDPR'
  },
  {
    id: 'SECURITY-004',
    category: 'security',
    checkpoint: 'Testarea și evaluarea periodică a securității',
    description: 'Organizația testează, evaluează și verifică în mod regulat eficacitatea măsurilor tehnice și organizatorice.',
    required: true,
    evidence: [
      'Audituri de securitate',
      'Teste de penetrare',
      'Rapoarte evaluare'
    ],
    legalBasis: 'Art. 32(1)(d) GDPR'
  },
  {
    id: 'SECURITY-005',
    category: 'security',
    checkpoint: 'Protecția datelor prin design și implicit',
    description: 'Principiile protecției datelor prin design și implicit sunt integrate în toate sistemele și procesele de prelucrare.',
    required: true,
    evidence: [
      'Checklist privacy by design',
      'Setări implicite restrictive',
      'Minimizarea datelor în aplicații'
    ],
    legalBasis: 'Art. 25 GDPR'
  },
  {
    id: 'SECURITY-006',
    category: 'security',
    checkpoint: 'Controlul accesului și autorizare',
    description: 'Accesul la datele personale este restricționat pe principiul "need-to-know" și există mecanisme de autentificare și autorizare robuste.',
    required: true,
    evidence: [
      'Politică control acces',
      'Matrice drepturi utilizatori',
      'Log-uri acces'
    ],
    legalBasis: 'Art. 32 GDPR'
  },
  {
    id: 'SECURITY-007',
    category: 'security',
    checkpoint: 'Formarea personalului',
    description: 'Personalul care are acces la date personale primește instruire adecvată și regulată privind GDPR și securitatea datelor.',
    required: true,
    evidence: [
      'Program de instruire GDPR',
      'Registru participanți',
      'Materiale de training'
    ],
    legalBasis: 'Art. 32(4), Art. 39(1)(b) GDPR'
  }
];

/**
 * Get checkpoints by category
 */
export function getCheckpointsByCategory(category: GdprCategory): GdprCheckpoint[] {
  return gdprChecklist.filter(item => item.category === category);
}

/**
 * Get required checkpoints only
 */
export function getRequiredCheckpoints(): GdprCheckpoint[] {
  return gdprChecklist.filter(item => item.required);
}

/**
 * Get checkpoint by ID
 */
export function getCheckpointById(id: string): GdprCheckpoint | undefined {
  return gdprChecklist.find(item => item.id === id);
}

/**
 * Get summary statistics
 */
export function getChecklistStats() {
  const stats = {
    total: gdprChecklist.length,
    required: gdprChecklist.filter(item => item.required).length,
    byCategory: {} as Record<GdprCategory, number>
  };

  gdprChecklist.forEach(item => {
    stats.byCategory[item.category] = (stats.byCategory[item.category] || 0) + 1;
  });

  return stats;
}
