/**
 * Environmental Compliance Requirements for Romanian Companies
 * Covers: Environmental authorization, waste management, emissions, noise pollution
 */

export interface EnvironmentalCheckpoint {
  id: string;
  description: string;
  frequency: 'lunar' | 'trimestrial' | 'semestrial' | 'anual' | 'la cerere' | 'permanent';
  responsible: string;
}

export interface EnvironmentalRequirement {
  id: string;
  requirement: string;
  legalBasis: string;
  applicableTo: string;
  authority: string;
  penalty: string;
  checkpoints: EnvironmentalCheckpoint[];
}

export const environmentalCompliance: EnvironmentalRequirement[] = [
  {
    id: 'env-001',
    requirement: 'Autorizație de mediu',
    legalBasis: 'OUG 195/2005 privind protecția mediului, actualizată',
    applicableTo: 'Toate companiile cu activități cu impact asupra mediului (producție, servicii cu risc)',
    authority: 'Agenția pentru Protecția Mediului (APM) județeană sau Garda de Mediu',
    penalty: 'Amendă 10.000 - 20.000 RON și suspendarea activității până la regularizare',
    checkpoints: [
      {
        id: 'env-001-cp-01',
        description: 'Verificare valabilitate autorizație de mediu',
        frequency: 'semestrial',
        responsible: 'Responsabil mediu / Manager SSM',
      },
      {
        id: 'env-001-cp-02',
        description: 'Actualizare autorizație în caz de modificări ale activității',
        frequency: 'la cerere',
        responsible: 'Responsabil mediu',
      },
      {
        id: 'env-001-cp-03',
        description: 'Raportare anuală privind îndeplinirea condițiilor din autorizație',
        frequency: 'anual',
        responsible: 'Responsabil mediu',
      },
    ],
  },
  {
    id: 'env-002',
    requirement: 'Autorizație integrată de mediu (IPPC)',
    legalBasis: 'Legea 278/2013 privind emisiile industriale, OUG 195/2005',
    applicableTo: 'Companii cu activități industriale enumerate în Anexa 1 la Legea 278/2013 (instalații mari)',
    authority: 'Agenția Națională pentru Protecția Mediului (ANPM) sau APM județeană',
    penalty: 'Amendă 50.000 - 100.000 RON și suspendarea activității',
    checkpoints: [
      {
        id: 'env-002-cp-01',
        description: 'Verificare conformitate cu BAT (Best Available Techniques)',
        frequency: 'anual',
        responsible: 'Manager mediu / Director tehnic',
      },
      {
        id: 'env-002-cp-02',
        description: 'Monitorizare emisii conform autorizației IPPC',
        frequency: 'lunar',
        responsible: 'Responsabil monitorizare emisii',
      },
      {
        id: 'env-002-cp-03',
        description: 'Raportare anuală ANPM privind emisiile și deșeurile',
        frequency: 'anual',
        responsible: 'Responsabil mediu',
      },
    ],
  },
  {
    id: 'env-003',
    requirement: 'Gestiune deșeuri - Contract cu operator autorizat',
    legalBasis: 'Legea 211/2011 privind regimul deșeurilor, OUG 92/2021',
    applicableTo: 'Toate companiile care generează deșeuri (municipale, industriale, periculoase)',
    authority: 'Garda Națională de Mediu (GNM), APM județeană, Poliția Locală',
    penalty: 'Amendă 5.000 - 30.000 RON pentru gestionare necorespunzătoare',
    checkpoints: [
      {
        id: 'env-003-cp-01',
        description: 'Verificare contracte valabile cu operatori autorizați colectare deșeuri',
        frequency: 'trimestrial',
        responsible: 'Responsabil gestiune deșeuri',
      },
      {
        id: 'env-003-cp-02',
        description: 'Ținere registru evidență deșeuri (cantități, coduri)',
        frequency: 'permanent',
        responsible: 'Responsabil gestiune deșeuri',
      },
      {
        id: 'env-003-cp-03',
        description: 'Raportare anuală deșeuri în ANPM (platforma e-Gunoi)',
        frequency: 'anual',
        responsible: 'Responsabil mediu',
      },
      {
        id: 'env-003-cp-04',
        description: 'Etichetare corectă a recipientelor de deșeuri',
        frequency: 'lunar',
        responsible: 'Responsabil SSM',
      },
    ],
  },
  {
    id: 'env-004',
    requirement: 'Gestionare deșeuri periculoase',
    legalBasis: 'Legea 211/2011, HG 856/2002 privind evidența deșeurilor periculoase',
    applicableTo: 'Companii care generează deșeuri periculoase (chimicale, uleiuri uzate, acumulatori, etc.)',
    authority: 'Garda Națională de Mediu, APM județeană',
    penalty: 'Amendă 10.000 - 50.000 RON și confiscare deșeuri gestionate ilegal',
    checkpoints: [
      {
        id: 'env-004-cp-01',
        description: 'Stocare deșeuri periculoase în spații autorizate, etichetate',
        frequency: 'permanent',
        responsible: 'Responsabil gestiune deșeuri',
      },
      {
        id: 'env-004-cp-02',
        description: 'Registru evidență deșeuri periculoase (cod LER, cantități)',
        frequency: 'permanent',
        responsible: 'Responsabil gestiune deșeuri',
      },
      {
        id: 'env-004-cp-03',
        description: 'Fișe însoțire deșeuri (FID) pentru fiecare transport',
        frequency: 'la cerere',
        responsible: 'Responsabil logistică',
      },
      {
        id: 'env-004-cp-04',
        description: 'Raportare lunară deșeuri periculoase către APM',
        frequency: 'lunar',
        responsible: 'Responsabil mediu',
      },
    ],
  },
  {
    id: 'env-005',
    requirement: 'Monitorizare emisii în atmosferă',
    legalBasis: 'Legea 104/2011 privind calitatea aerului, Legea 278/2013',
    applicableTo: 'Companii cu surse fixe de emisii (fabrici, centrale termice, arzătoare)',
    authority: 'APM județeană, Garda de Mediu',
    penalty: 'Amendă 15.000 - 40.000 RON pentru depășiri limite emisii',
    checkpoints: [
      {
        id: 'env-005-cp-01',
        description: 'Monitorizare periodică emisii (CO, NOx, SO2, pulberi) de laborator acreditat',
        frequency: 'semestrial',
        responsible: 'Responsabil emisii',
      },
      {
        id: 'env-005-cp-02',
        description: 'Verificare funcționare sisteme de filtrare / captare emisii',
        frequency: 'lunar',
        responsible: 'Manager tehnic',
      },
      {
        id: 'env-005-cp-03',
        description: 'Raportare anuală inventar emisii GES (gaze efect seră)',
        frequency: 'anual',
        responsible: 'Responsabil mediu',
      },
      {
        id: 'env-005-cp-04',
        description: 'Calibrare echipamente monitorizare continuă emisii',
        frequency: 'anual',
        responsible: 'Responsabil tehnic',
      },
    ],
  },
  {
    id: 'env-006',
    requirement: 'Control zgomot în mediul de lucru și vecinătăți',
    legalBasis: 'Legea 121/2019 privind evaluarea și gestionarea zgomotului ambiental, STAS 10009/2017',
    applicableTo: 'Companii cu activități zgomotoase (fabrici, șantiere, depozite logistice)',
    authority: 'Garda de Mediu, Direcția de Sănătate Publică (DSP), Poliția Locală',
    penalty: 'Amendă 5.000 - 20.000 RON și restricționare program activitate',
    checkpoints: [
      {
        id: 'env-006-cp-01',
        description: 'Măsurători zgomot la limita proprietății (de laborator autorizat)',
        frequency: 'anual',
        responsible: 'Responsabil SSM',
      },
      {
        id: 'env-006-cp-02',
        description: 'Verificare respectare limite zgomot nocturn (50 dB) și diurn (65 dB)',
        frequency: 'semestrial',
        responsible: 'Manager SSM',
      },
      {
        id: 'env-006-cp-03',
        description: 'Implementare măsuri atenuare zgomot (ecrane fonice, izolații)',
        frequency: 'la cerere',
        responsible: 'Director tehnic',
      },
      {
        id: 'env-006-cp-04',
        description: 'Raportare reclamații de zgomot către autorități',
        frequency: 'la cerere',
        responsible: 'Responsabil relații comunitate',
      },
    ],
  },
  {
    id: 'env-007',
    requirement: 'Autorizație de gospodărire a apelor (AGA)',
    legalBasis: 'Legea 107/1996 Legea Apelor, republicată, OUG 195/2005',
    applicableTo: 'Companii care captează, folosesc sau evacuează ape (industrie, agricultură)',
    authority: 'Administrația Națională "Apele Române" (ANAR)',
    penalty: 'Amendă 20.000 - 50.000 RON și tăiere apă până la regularizare',
    checkpoints: [
      {
        id: 'env-007-cp-01',
        description: 'Verificare valabilitate AGA (autorizație gospodărire ape)',
        frequency: 'anual',
        responsible: 'Responsabil mediu',
      },
      {
        id: 'env-007-cp-02',
        description: 'Monitorizare consum apă și raportare către ANAR',
        frequency: 'trimestrial',
        responsible: 'Responsabil tehnic',
      },
      {
        id: 'env-007-cp-03',
        description: 'Plată taxe gospodărire ape conform AGA',
        frequency: 'trimestrial',
        responsible: 'Departament financiar',
      },
      {
        id: 'env-007-cp-04',
        description: 'Verificare funcționare contoare apă industriale',
        frequency: 'semestrial',
        responsible: 'Manager tehnic',
      },
    ],
  },
  {
    id: 'env-008',
    requirement: 'Monitorizare ape uzate evacuate',
    legalBasis: 'NTPA 001/2005 (ape uzate urbane), NTPA 002/2005 (ape uzate industriale)',
    applicableTo: 'Companii care evacuează ape uzate în canalizare sau emisari naturali',
    authority: 'Administrația Națională "Apele Române", APM județeană',
    penalty: 'Amendă 10.000 - 30.000 RON pentru depășiri parametri evacuare',
    checkpoints: [
      {
        id: 'env-008-cp-01',
        description: 'Analiză ape uzate evacuate (pH, DBO5, CCO, metale, etc.) de laborator acreditat',
        frequency: 'trimestrial',
        responsible: 'Responsabil mediu',
      },
      {
        id: 'env-008-cp-02',
        description: 'Verificare funcționare stație epurare proprie (dacă există)',
        frequency: 'lunar',
        responsible: 'Manager tehnic',
      },
      {
        id: 'env-008-cp-03',
        description: 'Raportare trimestrială cantități și parametri ape uzate către ANAR',
        frequency: 'trimestrial',
        responsible: 'Responsabil mediu',
      },
      {
        id: 'env-008-cp-04',
        description: 'Întreținere separatoare hidrocarburi (la stații carburanți, parcări)',
        frequency: 'semestrial',
        responsible: 'Responsabil mentenanță',
      },
    ],
  },
  {
    id: 'env-009',
    requirement: 'Certificat verde pentru energie regenerabilă (opțional)',
    legalBasis: 'Legea 220/2008 privind promovarea energiei din surse regenerabile',
    applicableTo: 'Companii care produc energie din surse regenerabile (eolian, solar, biomasă)',
    authority: 'ANRE (Autoritatea Națională de Reglementare în Energie)',
    penalty: 'Pierdere subvenții și certificate verzi (penalizare economică)',
    checkpoints: [
      {
        id: 'env-009-cp-01',
        description: 'Solicitare certificate verzi pentru energie produsă',
        frequency: 'lunar',
        responsible: 'Manager energie',
      },
      {
        id: 'env-009-cp-02',
        description: 'Raportare producție energie regenerabilă către ANRE',
        frequency: 'lunar',
        responsible: 'Responsabil energie',
      },
      {
        id: 'env-009-cp-03',
        description: 'Verificare conformitate instalații cu legislația',
        frequency: 'anual',
        responsible: 'Director tehnic',
      },
    ],
  },
  {
    id: 'env-010',
    requirement: 'Raportare PRTR (Registrul Poluanților)',
    legalBasis: 'HG 506/2013 privind evaluarea și gestionarea calității aerului',
    applicableTo: 'Companii cu activități industriale care emit poluanți în aer, apă, sol peste praguri',
    authority: 'Agenția pentru Protecția Mediului (APM) județeană',
    penalty: 'Amendă 5.000 - 15.000 RON pentru neraportare',
    checkpoints: [
      {
        id: 'env-010-cp-01',
        description: 'Calculare cantități poluanți emise (CO2, NOx, SO2, metale grele, etc.)',
        frequency: 'anual',
        responsible: 'Responsabil mediu',
      },
      {
        id: 'env-010-cp-02',
        description: 'Raportare PRTR online (platforma APM) până la 31 martie',
        frequency: 'anual',
        responsible: 'Responsabil mediu',
      },
      {
        id: 'env-010-cp-03',
        description: 'Arhivare dovezi calcule și raportări PRTR',
        frequency: 'anual',
        responsible: 'Responsabil documentare',
      },
    ],
  },
  {
    id: 'env-011',
    requirement: 'Taxă de mediu pentru ambalaje',
    legalBasis: 'OUG 196/2005 privind Fondul de Mediu, Legea 249/2015',
    applicableTo: 'Companii care introduc pe piață produse ambalate sau generează ambalaje',
    authority: 'Administrația Fondului pentru Mediu (AFM)',
    penalty: 'Amendă 10.000 - 50.000 RON pentru neachitare taxă de mediu',
    checkpoints: [
      {
        id: 'env-011-cp-01',
        description: 'Raportare lunară cantități ambalaje introduse pe piață',
        frequency: 'lunar',
        responsible: 'Responsabil mediu / Financiar',
      },
      {
        id: 'env-011-cp-02',
        description: 'Plată taxă de mediu pentru ambalaje nereciclate',
        frequency: 'lunar',
        responsible: 'Departament financiar',
      },
      {
        id: 'env-011-cp-03',
        description: 'Contract cu organizație colectare ambalaje (Eco-Rom, Green Group, etc.)',
        frequency: 'anual',
        responsible: 'Responsabil achiziții',
      },
      {
        id: 'env-011-cp-04',
        description: 'Raportare anuală AFM privind ambalajele',
        frequency: 'anual',
        responsible: 'Responsabil mediu',
      },
    ],
  },
  {
    id: 'env-012',
    requirement: 'Gestionare substanțe chimice periculoase',
    legalBasis: 'Legea 360/2003 privind substanțele și preparatele chimice periculoase, Regulament REACH',
    applicableTo: 'Companii care folosesc, depozitează sau comercializează substanțe chimice periculoase',
    authority: 'Ministerul Mediului, Apelor și Pădurilor, Inspectoratul de Stat în Construcții',
    penalty: 'Amendă 15.000 - 40.000 RON și confiscare substanțe gestionate necorespunzător',
    checkpoints: [
      {
        id: 'env-012-cp-01',
        description: 'Întocmire registru substanțe chimice periculoase (cantități, FDS)',
        frequency: 'permanent',
        responsible: 'Responsabil SSM',
      },
      {
        id: 'env-012-cp-02',
        description: 'Verificare disponibilitate Fișe Date Securitate (FDS) actualizate',
        frequency: 'trimestrial',
        responsible: 'Responsabil SSM',
      },
      {
        id: 'env-012-cp-03',
        description: 'Stocare substanțe chimice în spații special amenajate, etichetate conform CLP',
        frequency: 'lunar',
        responsible: 'Manager depozit',
      },
      {
        id: 'env-012-cp-04',
        description: 'Instruire angajați în manipulare substanțe chimice periculoase',
        frequency: 'anual',
        responsible: 'Responsabil SSM',
      },
    ],
  },
  {
    id: 'env-013',
    requirement: 'Plan de prevenire și combatere poluare accidentală',
    legalBasis: 'OUG 195/2005 privind protecția mediului, art. 95-98',
    applicableTo: 'Companii cu risc de poluare accidentală (depozite combustibili, chimicale, industrie)',
    authority: 'Garda Națională de Mediu, Inspectoratul pentru Situații de Urgență (ISU)',
    penalty: 'Amendă 20.000 - 60.000 RON și răspundere pentru daune mediu',
    checkpoints: [
      {
        id: 'env-013-cp-01',
        description: 'Întocmire Plan de prevenire și combatere poluare accidentală',
        frequency: 'anual',
        responsible: 'Responsabil situații urgență',
      },
      {
        id: 'env-013-cp-02',
        description: 'Exercițiu simulare poluare accidentală și intervenție',
        frequency: 'anual',
        responsible: 'Responsabil SSM',
      },
      {
        id: 'env-013-cp-03',
        description: 'Verificare echipamente intervenție poluare (kituri absorbție, baraje)',
        frequency: 'trimestrial',
        responsible: 'Responsabil SSM',
      },
      {
        id: 'env-013-cp-04',
        description: 'Raportare incidente de poluare către autoritățile competente (24h)',
        frequency: 'la cerere',
        responsible: 'Manager urgență',
      },
    ],
  },
  {
    id: 'env-014',
    requirement: 'Evaluarea impactului asupra mediului (EIM)',
    legalBasis: 'OUG 57/2007 privind regimul ariilor naturale protejate, Legea 292/2018',
    applicableTo: 'Proiecte noi sau extinse cu impact semnificativ asupra mediului (fabrici, infrastructură)',
    authority: 'Agenția pentru Protecția Mediului (APM) județeană sau ANPM',
    penalty: 'Amendă 30.000 - 100.000 RON și oprire lucrări până la obținere aviz mediu',
    checkpoints: [
      {
        id: 'env-014-cp-01',
        description: 'Obținere decizie etapă încadrare EIM de la APM',
        frequency: 'la cerere',
        responsible: 'Manager proiect',
      },
      {
        id: 'env-014-cp-02',
        description: 'Realizare studiu EIM de către consultant autorizat',
        frequency: 'la cerere',
        responsible: 'Director general',
      },
      {
        id: 'env-014-cp-03',
        description: 'Organizare consultare publică pentru proiect',
        frequency: 'la cerere',
        responsible: 'Responsabil relații comunitate',
      },
      {
        id: 'env-014-cp-04',
        description: 'Obținere acord de mediu de la APM pentru proiect',
        frequency: 'la cerere',
        responsible: 'Manager proiect',
      },
    ],
  },
  {
    id: 'env-015',
    requirement: 'Contribuție economie circulară și reciclare',
    legalBasis: 'Legea 249/2015 privind gestionarea ambalajelor, Strategia UE economie circulară',
    applicableTo: 'Toate companiile (obligativitate colectare selectivă deșeuri reciclabile)',
    authority: 'Garda Națională de Mediu, Primărie locală',
    penalty: 'Amendă 3.000 - 10.000 RON pentru neimplementare colectare selectivă',
    checkpoints: [
      {
        id: 'env-015-cp-01',
        description: 'Implementare sistem colectare selectivă deșeuri (hârtie, plastic, sticlă, metal)',
        frequency: 'permanent',
        responsible: 'Responsabil mediu',
      },
      {
        id: 'env-015-cp-02',
        description: 'Contract cu operatori reciclare pentru deșeuri reciclabile',
        frequency: 'anual',
        responsible: 'Responsabil achiziții',
      },
      {
        id: 'env-015-cp-03',
        description: 'Raportare cantități deșeuri reciclate (pentru reducere taxă mediu)',
        frequency: 'anual',
        responsible: 'Responsabil mediu',
      },
      {
        id: 'env-015-cp-04',
        description: 'Campanii conștientizare angajați pentru reciclare',
        frequency: 'semestrial',
        responsible: 'Departament HR',
      },
    ],
  },
];

/**
 * Helper function to get environmental requirement by ID
 */
export function getEnvironmentalRequirementById(id: string): EnvironmentalRequirement | undefined {
  return environmentalCompliance.find(req => req.id === id);
}

/**
 * Helper function to filter requirements by authority
 */
export function getRequirementsByAuthority(authority: string): EnvironmentalRequirement[] {
  return environmentalCompliance.filter(req =>
    req.authority.toLowerCase().includes(authority.toLowerCase())
  );
}

/**
 * Helper function to get all checkpoints for a specific frequency
 */
export function getCheckpointsByFrequency(frequency: EnvironmentalCheckpoint['frequency']): {
  requirement: string;
  checkpoint: EnvironmentalCheckpoint;
}[] {
  const result: { requirement: string; checkpoint: EnvironmentalCheckpoint }[] = [];

  environmentalCompliance.forEach(req => {
    req.checkpoints.forEach(cp => {
      if (cp.frequency === frequency) {
        result.push({
          requirement: req.requirement,
          checkpoint: cp,
        });
      }
    });
  });

  return result;
}
