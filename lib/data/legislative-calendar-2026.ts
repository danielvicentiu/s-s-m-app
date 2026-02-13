/**
 * Calendar Legislativ 2026 - Obligații de raportare SSM/PSI România
 *
 * Acest calendar conține toate termenele legale de raportare și îndeplinire
 * a obligațiilor SSM (Securitate și Sănătate în Muncă) și PSI (Prevenire și
 * Stingere Incendii) pentru anul 2026 în România.
 */

export interface LegislativeObligation {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  frequency: 'lunar' | 'trimestrial' | 'semestrial' | 'anual' | 'punctual';
  authority: string;
  formDocument: string;
  penaltyLate: string;
  appliesTo: string[];
  legalBasis: string;
  category: 'ssm' | 'psi' | 'medicina_muncii' | 'inspectia_muncii';
  priority: 'critica' | 'mare' | 'medie' | 'mica';
}

export const legislativeCalendar2026: LegislativeObligation[] = [
  // ============================================================================
  // IANUARIE 2026
  // ============================================================================
  {
    id: 'jan-2026-program-ssm',
    title: 'Depunere Program Anual SSM 2026',
    description: 'Întocmirea și depunerea programului anual de securitate și sănătate în muncă pentru anul 2026, inclusiv măsuri de prevenire și buget alocat.',
    deadline: new Date('2026-01-31T23:59:59'),
    frequency: 'anual',
    authority: 'Inspectoratul Teritorial de Muncă',
    formDocument: 'Program Anual SSM (conform Legii 319/2006)',
    penaltyLate: 'Amendă contravențională: 10.000 - 20.000 RON (pentru întreprinderi mari)',
    appliesTo: ['Toate organizațiile cu angajați', 'Obligatoriu pentru firme cu peste 50 angajați'],
    legalBasis: 'Legea 319/2006, art. 16',
    category: 'ssm',
    priority: 'critica'
  },
  {
    id: 'jan-2026-revizie-psi',
    title: 'Revizie/Actualizare Autorizație PSI',
    description: 'Verificarea și actualizarea documentației PSI, inclusiv a scenariilor de securitate la incendiu și a planurilor de evacuare.',
    deadline: new Date('2026-01-31T23:59:59'),
    frequency: 'anual',
    authority: 'Inspectoratul pentru Situații de Urgență (ISU)',
    formDocument: 'Documentație actualizată PSI + Plan de evacuare',
    penaltyLate: 'Amendă contravențională: 5.000 - 10.000 RON + suspendare activitate',
    appliesTo: ['Toate organizațiile cu autorizație PSI', 'Spații de producție', 'Spații comerciale'],
    legalBasis: 'Legea 307/2006, HG 571/2016',
    category: 'psi',
    priority: 'critica'
  },
  {
    id: 'jan-2026-d112-dec',
    title: 'Raportare D112 - Decembrie 2025',
    description: 'Declarație privind accidentele de muncă și bolile profesionale pentru luna decembrie 2025.',
    deadline: new Date('2026-01-15T23:59:59'),
    frequency: 'lunar',
    authority: 'Inspectoratul Teritorial de Muncă',
    formDocument: 'Formularul D112 (online sau hârtie)',
    penaltyLate: 'Amendă contravențională: 300 - 2.000 RON',
    appliesTo: ['Toate organizațiile cu angajați', 'Obligatoriu chiar dacă nu au fost accidente'],
    legalBasis: 'HG 1425/2006, art. 28',
    category: 'inspectia_muncii',
    priority: 'critica'
  },

  // ============================================================================
  // FEBRUARIE 2026
  // ============================================================================
  {
    id: 'feb-2026-d112-jan',
    title: 'Raportare D112 - Ianuarie 2026',
    description: 'Declarație lunară privind accidentele de muncă pentru ianuarie 2026.',
    deadline: new Date('2026-02-15T23:59:59'),
    frequency: 'lunar',
    authority: 'Inspectoratul Teritorial de Muncă',
    formDocument: 'Formularul D112',
    penaltyLate: 'Amendă contravențională: 300 - 2.000 RON',
    appliesTo: ['Toate organizațiile cu angajați'],
    legalBasis: 'HG 1425/2006',
    category: 'inspectia_muncii',
    priority: 'critica'
  },
  {
    id: 'feb-2026-control-stingatoare',
    title: 'Control Trimestrial Stingătoare (Q1 2026)',
    description: 'Verificarea trimestrială a stingătoarelor de incendiu (verificare vizuală, presiune, sigilii, accesoriu).',
    deadline: new Date('2026-02-28T23:59:59'),
    frequency: 'trimestrial',
    authority: 'Intern (evidență pentru ISU)',
    formDocument: 'Fișă de verificare/control stingătoare',
    penaltyLate: 'Amendă ISU: 2.000 - 5.000 RON + risc evacuare clădire',
    appliesTo: ['Toate organizațiile cu stingătoare', 'Obligatoriu pentru spații comerciale/producție'],
    legalBasis: 'Legea 307/2006, normative PSI',
    category: 'psi',
    priority: 'mare'
  },

  // ============================================================================
  // MARTIE 2026
  // ============================================================================
  {
    id: 'mar-2026-d112-feb',
    title: 'Raportare D112 - Februarie 2026',
    description: 'Declarație lunară privind accidentele de muncă pentru februarie 2026.',
    deadline: new Date('2026-03-15T23:59:59'),
    frequency: 'lunar',
    authority: 'Inspectoratul Teritorial de Muncă',
    formDocument: 'Formularul D112',
    penaltyLate: 'Amendă contravențională: 300 - 2.000 RON',
    appliesTo: ['Toate organizațiile cu angajați'],
    legalBasis: 'HG 1425/2006',
    category: 'inspectia_muncii',
    priority: 'critica'
  },
  {
    id: 'mar-2026-control-hidrant',
    title: 'Control Hidranți Interiori/Exteriori (Q1)',
    description: 'Verificarea funcționării hidranților de incendiu interiori și exteriori, presiune apă, funcționare furtunuri.',
    deadline: new Date('2026-03-31T23:59:59'),
    frequency: 'trimestrial',
    authority: 'Intern (evidență pentru ISU)',
    formDocument: 'Proces-verbal verificare hidranți',
    penaltyLate: 'Amendă ISU: 5.000 - 15.000 RON',
    appliesTo: ['Organizații cu hidranți interiori/exteriori', 'Clădiri cu mai multe etaje'],
    legalBasis: 'Legea 307/2006, P118/2013',
    category: 'psi',
    priority: 'mare'
  },
  {
    id: 'mar-2026-raport-trim-q1',
    title: 'Raport Trimestrial SSM - Q1 2026',
    description: 'Raport trimestrial privind activitatea de SSM, instructaje efectuate, echipamente verificate.',
    deadline: new Date('2026-03-31T23:59:59'),
    frequency: 'trimestrial',
    authority: 'Intern / ITM (la solicitare)',
    formDocument: 'Raport activitate SSM Q1',
    penaltyLate: 'Avertisment sau amendă 1.000 - 5.000 RON (la control ITM)',
    appliesTo: ['Organizații cu responsabil SSM', 'Recomandabil pentru toate firmele'],
    legalBasis: 'Legea 319/2006',
    category: 'ssm',
    priority: 'medie'
  },

  // ============================================================================
  // APRILIE 2026
  // ============================================================================
  {
    id: 'apr-2026-d112-mar',
    title: 'Raportare D112 - Martie 2026',
    description: 'Declarație lunară privind accidentele de muncă pentru martie 2026.',
    deadline: new Date('2026-04-15T23:59:59'),
    frequency: 'lunar',
    authority: 'Inspectoratul Teritorial de Muncă',
    formDocument: 'Formularul D112',
    penaltyLate: 'Amendă contravențională: 300 - 2.000 RON',
    appliesTo: ['Toate organizațiile cu angajați'],
    legalBasis: 'HG 1425/2006',
    category: 'inspectia_muncii',
    priority: 'critica'
  },
  {
    id: 'apr-2026-instructaj-psi',
    title: 'Instructaj PSI Periodic (Semestrial)',
    description: 'Instructaj de prevenire și stingere a incendiilor pentru toți angajații (obligatoriu semestrial).',
    deadline: new Date('2026-04-28T23:59:59'),
    frequency: 'semestrial',
    authority: 'Intern (evidență pentru ISU)',
    formDocument: 'Fișe instructaj PSI semnate',
    penaltyLate: 'Amendă ISU: 3.000 - 10.000 RON',
    appliesTo: ['Toți angajații', 'Personal nou angajat în ultimele 6 luni'],
    legalBasis: 'Legea 307/2006, normative PSI',
    category: 'psi',
    priority: 'mare'
  },

  // ============================================================================
  // MAI 2026
  // ============================================================================
  {
    id: 'may-2026-d112-apr',
    title: 'Raportare D112 - Aprilie 2026',
    description: 'Declarație lunară privind accidentele de muncă pentru aprilie 2026.',
    deadline: new Date('2026-05-15T23:59:59'),
    frequency: 'lunar',
    authority: 'Inspectoratul Teritorial de Muncă',
    formDocument: 'Formularul D112',
    penaltyLate: 'Amendă contravențională: 300 - 2.000 RON',
    appliesTo: ['Toate organizațiile cu angajați'],
    legalBasis: 'HG 1425/2006',
    category: 'inspectia_muncii',
    priority: 'critica'
  },
  {
    id: 'may-2026-control-stingatoare-q2',
    title: 'Control Trimestrial Stingătoare (Q2 2026)',
    description: 'Verificarea trimestrială a stingătoarelor de incendiu pentru trimestrul 2.',
    deadline: new Date('2026-05-31T23:59:59'),
    frequency: 'trimestrial',
    authority: 'Intern (evidență pentru ISU)',
    formDocument: 'Fișă de verificare/control stingătoare',
    penaltyLate: 'Amendă ISU: 2.000 - 5.000 RON',
    appliesTo: ['Toate organizațiile cu stingătoare'],
    legalBasis: 'Legea 307/2006',
    category: 'psi',
    priority: 'mare'
  },

  // ============================================================================
  // IUNIE 2026
  // ============================================================================
  {
    id: 'jun-2026-d112-may',
    title: 'Raportare D112 - Mai 2026',
    description: 'Declarație lunară privind accidentele de muncă pentru mai 2026.',
    deadline: new Date('2026-06-15T23:59:59'),
    frequency: 'lunar',
    authority: 'Inspectoratul Teritorial de Muncă',
    formDocument: 'Formularul D112',
    penaltyLate: 'Amendă contravențională: 300 - 2.000 RON',
    appliesTo: ['Toate organizațiile cu angajați'],
    legalBasis: 'HG 1425/2006',
    category: 'inspectia_muncii',
    priority: 'critica'
  },
  {
    id: 'jun-2026-exercitiu-evacuare-sem1',
    title: 'Exercițiu de Evacuare (Semestrial)',
    description: 'Exercițiu practic de evacuare în caz de incendiu pentru toți angajații (obligatoriu semestrial).',
    deadline: new Date('2026-06-30T23:59:59'),
    frequency: 'semestrial',
    authority: 'Intern (evidență pentru ISU)',
    formDocument: 'Proces-verbal exercițiu evacuare + plan evacuare',
    penaltyLate: 'Amendă ISU: 5.000 - 15.000 RON + risc suspendare activitate',
    appliesTo: ['Toate organizațiile', 'Obligatoriu pentru spații cu peste 50 persoane'],
    legalBasis: 'Legea 307/2006, art. 12',
    category: 'psi',
    priority: 'critica'
  },
  {
    id: 'jun-2026-raport-trim-q2',
    title: 'Raport Trimestrial SSM - Q2 2026',
    description: 'Raport trimestrial privind activitatea de SSM pentru trimestrul 2.',
    deadline: new Date('2026-06-30T23:59:59'),
    frequency: 'trimestrial',
    authority: 'Intern / ITM (la solicitare)',
    formDocument: 'Raport activitate SSM Q2',
    penaltyLate: 'Avertisment sau amendă 1.000 - 5.000 RON',
    appliesTo: ['Organizații cu responsabil SSM'],
    legalBasis: 'Legea 319/2006',
    category: 'ssm',
    priority: 'medie'
  },
  {
    id: 'jun-2026-control-hidrant-q2',
    title: 'Control Hidranți (Q2)',
    description: 'Verificarea funcționării hidranților de incendiu pentru trimestrul 2.',
    deadline: new Date('2026-06-30T23:59:59'),
    frequency: 'trimestrial',
    authority: 'Intern (evidență pentru ISU)',
    formDocument: 'Proces-verbal verificare hidranți',
    penaltyLate: 'Amendă ISU: 5.000 - 15.000 RON',
    appliesTo: ['Organizații cu hidranți'],
    legalBasis: 'Legea 307/2006',
    category: 'psi',
    priority: 'mare'
  },

  // ============================================================================
  // IULIE 2026
  // ============================================================================
  {
    id: 'jul-2026-d112-jun',
    title: 'Raportare D112 - Iunie 2026',
    description: 'Declarație lunară privind accidentele de muncă pentru iunie 2026.',
    deadline: new Date('2026-07-15T23:59:59'),
    frequency: 'lunar',
    authority: 'Inspectoratul Teritorial de Muncă',
    formDocument: 'Formularul D112',
    penaltyLate: 'Amendă contravențională: 300 - 2.000 RON',
    appliesTo: ['Toate organizațiile cu angajați'],
    legalBasis: 'HG 1425/2006',
    category: 'inspectia_muncii',
    priority: 'critica'
  },
  {
    id: 'jul-2026-revizie-semestrial-ssm',
    title: 'Revizie Semestrială Documentație SSM',
    description: 'Revizuirea și actualizarea documentației SSM: IPER, proceduri, instrucțiuni de lucru, echipamente.',
    deadline: new Date('2026-07-31T23:59:59'),
    frequency: 'semestrial',
    authority: 'Intern / ITM (la control)',
    formDocument: 'Documentație SSM actualizată',
    penaltyLate: 'Amendă ITM: 10.000 - 20.000 RON',
    appliesTo: ['Toate organizațiile'],
    legalBasis: 'Legea 319/2006',
    category: 'ssm',
    priority: 'mare'
  },

  // ============================================================================
  // AUGUST 2026
  // ============================================================================
  {
    id: 'aug-2026-d112-jul',
    title: 'Raportare D112 - Iulie 2026',
    description: 'Declarație lunară privind accidentele de muncă pentru iulie 2026.',
    deadline: new Date('2026-08-15T23:59:59'),
    frequency: 'lunar',
    authority: 'Inspectoratul Teritorial de Muncă',
    formDocument: 'Formularul D112',
    penaltyLate: 'Amendă contravențională: 300 - 2.000 RON',
    appliesTo: ['Toate organizațiile cu angajați'],
    legalBasis: 'HG 1425/2006',
    category: 'inspectia_muncii',
    priority: 'critica'
  },
  {
    id: 'aug-2026-control-stingatoare-q3',
    title: 'Control Trimestrial Stingătoare (Q3 2026)',
    description: 'Verificarea trimestrială a stingătoarelor de incendiu pentru trimestrul 3.',
    deadline: new Date('2026-08-31T23:59:59'),
    frequency: 'trimestrial',
    authority: 'Intern (evidență pentru ISU)',
    formDocument: 'Fișă de verificare/control stingătoare',
    penaltyLate: 'Amendă ISU: 2.000 - 5.000 RON',
    appliesTo: ['Toate organizațiile cu stingătoare'],
    legalBasis: 'Legea 307/2006',
    category: 'psi',
    priority: 'mare'
  },

  // ============================================================================
  // SEPTEMBRIE 2026
  // ============================================================================
  {
    id: 'sep-2026-d112-aug',
    title: 'Raportare D112 - August 2026',
    description: 'Declarație lunară privind accidentele de muncă pentru august 2026.',
    deadline: new Date('2026-09-15T23:59:59'),
    frequency: 'lunar',
    authority: 'Inspectoratul Teritorial de Muncă',
    formDocument: 'Formularul D112',
    penaltyLate: 'Amendă contravențională: 300 - 2.000 RON',
    appliesTo: ['Toate organizațiile cu angajați'],
    legalBasis: 'HG 1425/2006',
    category: 'inspectia_muncii',
    priority: 'critica'
  },
  {
    id: 'sep-2026-raport-trim-q3',
    title: 'Raport Trimestrial SSM - Q3 2026',
    description: 'Raport trimestrial privind activitatea de SSM pentru trimestrul 3.',
    deadline: new Date('2026-09-30T23:59:59'),
    frequency: 'trimestrial',
    authority: 'Intern / ITM (la solicitare)',
    formDocument: 'Raport activitate SSM Q3',
    penaltyLate: 'Avertisment sau amendă 1.000 - 5.000 RON',
    appliesTo: ['Organizații cu responsabil SSM'],
    legalBasis: 'Legea 319/2006',
    category: 'ssm',
    priority: 'medie'
  },
  {
    id: 'sep-2026-control-hidrant-q3',
    title: 'Control Hidranți (Q3)',
    description: 'Verificarea funcționării hidranților de incendiu pentru trimestrul 3.',
    deadline: new Date('2026-09-30T23:59:59'),
    frequency: 'trimestrial',
    authority: 'Intern (evidență pentru ISU)',
    formDocument: 'Proces-verbal verificare hidranți',
    penaltyLate: 'Amendă ISU: 5.000 - 15.000 RON',
    appliesTo: ['Organizații cu hidranți'],
    legalBasis: 'Legea 307/2006',
    category: 'psi',
    priority: 'mare'
  },

  // ============================================================================
  // OCTOMBRIE 2026
  // ============================================================================
  {
    id: 'oct-2026-d112-sep',
    title: 'Raportare D112 - Septembrie 2026',
    description: 'Declarație lunară privind accidentele de muncă pentru septembrie 2026.',
    deadline: new Date('2026-10-15T23:59:59'),
    frequency: 'lunar',
    authority: 'Inspectoratul Teritorial de Muncă',
    formDocument: 'Formularul D112',
    penaltyLate: 'Amendă contravențională: 300 - 2.000 RON',
    appliesTo: ['Toate organizațiile cu angajați'],
    legalBasis: 'HG 1425/2006',
    category: 'inspectia_muncii',
    priority: 'critica'
  },
  {
    id: 'oct-2026-instructaj-psi-sem2',
    title: 'Instructaj PSI Periodic (Semestrul 2)',
    description: 'Instructaj de prevenire și stingere a incendiilor pentru toți angajații (semestrul 2).',
    deadline: new Date('2026-10-31T23:59:59'),
    frequency: 'semestrial',
    authority: 'Intern (evidență pentru ISU)',
    formDocument: 'Fișe instructaj PSI semnate',
    penaltyLate: 'Amendă ISU: 3.000 - 10.000 RON',
    appliesTo: ['Toți angajații'],
    legalBasis: 'Legea 307/2006',
    category: 'psi',
    priority: 'mare'
  },

  // ============================================================================
  // NOIEMBRIE 2026
  // ============================================================================
  {
    id: 'nov-2026-d112-oct',
    title: 'Raportare D112 - Octombrie 2026',
    description: 'Declarație lunară privind accidentele de muncă pentru octombrie 2026.',
    deadline: new Date('2026-11-15T23:59:59'),
    frequency: 'lunar',
    authority: 'Inspectoratul Teritorial de Muncă',
    formDocument: 'Formularul D112',
    penaltyLate: 'Amendă contravențională: 300 - 2.000 RON',
    appliesTo: ['Toate organizațiile cu angajați'],
    legalBasis: 'HG 1425/2006',
    category: 'inspectia_muncii',
    priority: 'critica'
  },
  {
    id: 'nov-2026-control-stingatoare-q4',
    title: 'Control Trimestrial Stingătoare (Q4 2026)',
    description: 'Verificarea trimestrială a stingătoarelor de incendiu pentru trimestrul 4.',
    deadline: new Date('2026-11-30T23:59:59'),
    frequency: 'trimestrial',
    authority: 'Intern (evidență pentru ISU)',
    formDocument: 'Fișă de verificare/control stingătoare',
    penaltyLate: 'Amendă ISU: 2.000 - 5.000 RON',
    appliesTo: ['Toate organizațiile cu stingătoare'],
    legalBasis: 'Legea 307/2006',
    category: 'psi',
    priority: 'mare'
  },

  // ============================================================================
  // DECEMBRIE 2026
  // ============================================================================
  {
    id: 'dec-2026-d112-nov',
    title: 'Raportare D112 - Noiembrie 2026',
    description: 'Declarație lunară privind accidentele de muncă pentru noiembrie 2026.',
    deadline: new Date('2026-12-15T23:59:59'),
    frequency: 'lunar',
    authority: 'Inspectoratul Teritorial de Muncă',
    formDocument: 'Formularul D112',
    penaltyLate: 'Amendă contravențională: 300 - 2.000 RON',
    appliesTo: ['Toate organizațiilor cu angajați'],
    legalBasis: 'HG 1425/2006',
    category: 'inspectia_muncii',
    priority: 'critica'
  },
  {
    id: 'dec-2026-exercitiu-evacuare-sem2',
    title: 'Exercițiu de Evacuare (Semestrul 2)',
    description: 'Exercițiu practic de evacuare în caz de incendiu pentru toți angajații (semestrul 2).',
    deadline: new Date('2026-12-20T23:59:59'),
    frequency: 'semestrial',
    authority: 'Intern (evidență pentru ISU)',
    formDocument: 'Proces-verbal exercițiu evacuare',
    penaltyLate: 'Amendă ISU: 5.000 - 15.000 RON + risc suspendare activitate',
    appliesTo: ['Toate organizațiile'],
    legalBasis: 'Legea 307/2006',
    category: 'psi',
    priority: 'critica'
  },
  {
    id: 'dec-2026-raport-trim-q4',
    title: 'Raport Trimestrial SSM - Q4 2026',
    description: 'Raport trimestrial privind activitatea de SSM pentru trimestrul 4.',
    deadline: new Date('2026-12-31T23:59:59'),
    frequency: 'trimestrial',
    authority: 'Intern / ITM (la solicitare)',
    formDocument: 'Raport activitate SSM Q4',
    penaltyLate: 'Avertisment sau amendă 1.000 - 5.000 RON',
    appliesTo: ['Organizații cu responsabil SSM'],
    legalBasis: 'Legea 319/2006',
    category: 'ssm',
    priority: 'medie'
  },
  {
    id: 'dec-2026-control-hidrant-q4',
    title: 'Control Hidranți (Q4)',
    description: 'Verificarea funcționării hidranților de incendiu pentru trimestrul 4.',
    deadline: new Date('2026-12-31T23:59:59'),
    frequency: 'trimestrial',
    authority: 'Intern (evidență pentru ISU)',
    formDocument: 'Proces-verbal verificare hidranți',
    penaltyLate: 'Amendă ISU: 5.000 - 15.000 RON',
    appliesTo: ['Organizații cu hidranți'],
    legalBasis: 'Legea 307/2006',
    category: 'psi',
    priority: 'mare'
  },
  {
    id: 'dec-2026-raport-anual-ssm',
    title: 'Raport Anual SSM 2026',
    description: 'Raport anual complet privind activitatea de securitate și sănătate în muncă pentru anul 2026.',
    deadline: new Date('2026-12-31T23:59:59'),
    frequency: 'anual',
    authority: 'Intern / ITM (la solicitare)',
    formDocument: 'Raport anual SSM complet',
    penaltyLate: 'Amendă ITM: 10.000 - 20.000 RON',
    appliesTo: ['Toate organizațiile cu responsabil SSM'],
    legalBasis: 'Legea 319/2006',
    category: 'ssm',
    priority: 'critica'
  },
  {
    id: 'dec-2026-revizie-anuala-psi',
    title: 'Revizie Anuală Documentație PSI',
    description: 'Revizuirea anuală completă a documentației PSI, scenarii de securitate, plan de evacuare.',
    deadline: new Date('2026-12-31T23:59:59'),
    frequency: 'anual',
    authority: 'ISU',
    formDocument: 'Documentație PSI revizuită + Autorizație actualizată',
    penaltyLate: 'Amendă ISU: 10.000 - 20.000 RON + risc suspendare',
    appliesTo: ['Toate organizațiile cu autorizație PSI'],
    legalBasis: 'Legea 307/2006, HG 571/2016',
    category: 'psi',
    priority: 'critica'
  },

  // ============================================================================
  // OBLIGAȚII MEDICALE (Medicina Muncii)
  // ============================================================================
  {
    id: 'medical-2026-control-periodic',
    title: 'Controale Medicale Periodice',
    description: 'Trimiterea angajaților la controlul medical periodic (în funcție de riscuri: anual, bianual sau la 5 ani).',
    deadline: new Date('2026-12-31T23:59:59'),
    frequency: 'anual',
    authority: 'Medicina Muncii',
    formDocument: 'Fișă medicală + Aviz medical de aptitudine',
    penaltyLate: 'Amendă ITM: 5.000 - 10.000 RON + suspendare angajat din muncă',
    appliesTo: ['Toți angajații', 'Conform planului de examinări medicale'],
    legalBasis: 'HG 355/2007, Legea 319/2006',
    category: 'medicina_muncii',
    priority: 'critica'
  },
  {
    id: 'medical-2026-fisa-expunere',
    title: 'Fișă Expunere Factori de Risc',
    description: 'Actualizarea fișelor de expunere la factori de risc profesional pentru angajații expuși.',
    deadline: new Date('2026-12-31T23:59:59'),
    frequency: 'anual',
    authority: 'Medicina Muncii / ITM',
    formDocument: 'Fișă de expunere individuală',
    penaltyLate: 'Amendă ITM: 3.000 - 8.000 RON',
    appliesTo: ['Angajați expuși la: zgomot, vibrații, substanțe chimice, praf, radiații'],
    legalBasis: 'HG 355/2007, art. 15',
    category: 'medicina_muncii',
    priority: 'mare'
  },

  // ============================================================================
  // ECHIPAMENTE DE PROTECȚIE ȘI INSTRUMENTE DE LUCRU
  // ============================================================================
  {
    id: 'equipment-2026-verificare-eip',
    title: 'Verificare Periodică Echipamente Individuale de Protecție (EIP)',
    description: 'Verificarea stării și funcționării echipamentelor individuale de protecție (căști, mănuși, ochelari, etc.).',
    deadline: new Date('2026-12-31T23:59:59'),
    frequency: 'anual',
    authority: 'Intern / ITM (la control)',
    formDocument: 'Fișă de evidență EIP + Proces-verbal verificare',
    penaltyLate: 'Amendă ITM: 5.000 - 15.000 RON',
    appliesTo: ['Toate organizațiile cu angajați expuși la riscuri'],
    legalBasis: 'Legea 319/2006, HG 1048/2006',
    category: 'ssm',
    priority: 'mare'
  },
  {
    id: 'equipment-2026-verificare-echipamente-lucru',
    title: 'Verificare Tehnică Echipamente de Lucru',
    description: 'Verificarea tehnică periodică a echipamentelor de lucru (utilaje, scule electrice, platforme, etc.).',
    deadline: new Date('2026-12-31T23:59:59'),
    frequency: 'anual',
    authority: 'Entități autorizate ISCIR / ITM',
    formDocument: 'Proces-verbal verificare tehnică + Certificat conformitate',
    penaltyLate: 'Amendă ITM/ISCIR: 10.000 - 30.000 RON + oprire echipament',
    appliesTo: ['Organizații cu utilaje/echipamente sub presiune/ridicat'],
    legalBasis: 'Legea 319/2006, art. 25, normative ISCIR',
    category: 'ssm',
    priority: 'critica'
  }
];

/**
 * Funcții utilitare pentru filtrare și căutare în calendar
 */

export function getObligationsByMonth(month: number, year: number = 2026): LegislativeObligation[] {
  return legislativeCalendar2026.filter(obligation => {
    const obligationDate = new Date(obligation.deadline);
    return obligationDate.getMonth() === month - 1 && obligationDate.getFullYear() === year;
  });
}

export function getObligationsByCategory(category: LegislativeObligation['category']): LegislativeObligation[] {
  return legislativeCalendar2026.filter(obligation => obligation.category === category);
}

export function getObligationsByPriority(priority: LegislativeObligation['priority']): LegislativeObligation[] {
  return legislativeCalendar2026.filter(obligation => obligation.priority === priority);
}

export function getUpcomingObligations(daysAhead: number = 30): LegislativeObligation[] {
  const now = new Date();
  const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

  return legislativeCalendar2026.filter(obligation => {
    const obligationDate = new Date(obligation.deadline);
    return obligationDate >= now && obligationDate <= futureDate;
  }).sort((a, b) => a.deadline.getTime() - b.deadline.getTime());
}

export function getOverdueObligations(): LegislativeObligation[] {
  const now = new Date();
  return legislativeCalendar2026.filter(obligation => {
    return new Date(obligation.deadline) < now;
  });
}

export function getObligationById(id: string): LegislativeObligation | undefined {
  return legislativeCalendar2026.find(obligation => obligation.id === id);
}

export function searchObligations(searchTerm: string): LegislativeObligation[] {
  const lowerSearchTerm = searchTerm.toLowerCase();
  return legislativeCalendar2026.filter(obligation =>
    obligation.title.toLowerCase().includes(lowerSearchTerm) ||
    obligation.description.toLowerCase().includes(lowerSearchTerm) ||
    obligation.formDocument.toLowerCase().includes(lowerSearchTerm) ||
    obligation.authority.toLowerCase().includes(lowerSearchTerm)
  );
}
