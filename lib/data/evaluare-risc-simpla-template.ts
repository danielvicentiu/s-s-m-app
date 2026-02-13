/**
 * Template pentru Evaluarea Riscurilor Simplificată (SSM)
 * Conform legislației românești pentru firme mici (sub 50 angajați)
 *
 * Metodă: Probabilitate × Gravitate = Nivel de Risc
 * Clasificare: Risc Scăzut (1-4), Mediu (5-9), Ridicat (10-16), Foarte Ridicat (20-25)
 */

export type RiscProbabilitate = 1 | 2 | 3 | 4 | 5;
export type RiscGravitate = 1 | 2 | 3 | 4 | 5;
export type RiscNivel = 'scazut' | 'mediu' | 'ridicat' | 'foarte_ridicat';

export interface MasuraPreventie {
  id: string;
  descriere: string;
  tip: 'eliminare' | 'substitutie' | 'control_engineering' | 'control_administrativ' | 'epi';
  termen: 'imediat' | 'scurt' | 'mediu' | 'lung'; // imediat (<1 lună), scurt (1-3 luni), mediu (3-6 luni), lung (>6 luni)
  responsabil?: string;
  cost_estimat?: 'mic' | 'mediu' | 'ridicat';
}

export interface PercolSSM {
  id: string;
  cod: string;
  denumire: string;
  categorie: 'mecanic' | 'electric' | 'chimic' | 'biologic' | 'ergonomic' | 'psihosocial' | 'incendiu' | 'circulatie';
  descriere: string;
  consecinte_posibile: string[];

  // Evaluare inițială (înainte de măsuri)
  probabilitate_initiala: RiscProbabilitate;
  gravitate_initiala: RiscGravitate;

  // Măsuri de prevenție existente
  masuri_existente: string[];

  // Măsuri de prevenție propuse
  masuri_propuse: MasuraPreventie[];

  // Evaluare reziduală (după aplicarea măsurilor)
  probabilitate_reziduala: RiscProbabilitate;
  gravitate_reziduala: RiscGravitate;

  // EPI necesare
  epi_necesare?: string[];

  // Legislație aplicabilă
  legislatie?: string[];

  // Zone/activități afectate
  zone_afectate?: string[];
}

/**
 * Calculează nivelul de risc pe baza probabilității și gravității
 */
export function calculeazaNivelRisc(probabilitate: RiscProbabilitate, gravitate: RiscGravitate): {
  valoare: number;
  nivel: RiscNivel;
  culoare: string;
} {
  const valoare = probabilitate * gravitate;

  let nivel: RiscNivel;
  let culoare: string;

  if (valoare <= 4) {
    nivel = 'scazut';
    culoare = 'green';
  } else if (valoare <= 9) {
    nivel = 'mediu';
    culoare = 'yellow';
  } else if (valoare <= 16) {
    nivel = 'ridicat';
    culoare = 'orange';
  } else {
    nivel = 'foarte_ridicat';
    culoare = 'red';
  }

  return { valoare, nivel, culoare };
}

/**
 * Returnează descrierea pentru nivelul de probabilitate
 */
export function getDescrieProbabilitate(nivel: RiscProbabilitate): string {
  const descrieri: Record<RiscProbabilitate, string> = {
    1: 'Foarte puțin probabil (poate apărea în condiții excepționale)',
    2: 'Puțin probabil (poate apărea ocazional)',
    3: 'Probabil (poate apărea periodic)',
    4: 'Foarte probabil (apare frecvent)',
    5: 'Cert (apare constant)',
  };
  return descrieri[nivel];
}

/**
 * Returnează descrierea pentru nivelul de gravitate
 */
export function getDescrieGravitate(nivel: RiscGravitate): string {
  const descrieri: Record<RiscGravitate, string> = {
    1: 'Neglijabilă (fără leziuni, incident minor)',
    2: 'Mică (necesită prim ajutor)',
    3: 'Medie (necesită tratament medical)',
    4: 'Mare (leziuni severe, incapacitate temporară)',
    5: 'Foarte mare (deces, invaliditate permanentă)',
  };
  return descrieri[nivel];
}

/**
 * Template cu 20 de pericole comune în firme mici
 */
export const PERICOLE_COMUNE_TEMPLATE: PercolSSM[] = [
  // 1. MECANIC
  {
    id: 'p001',
    cod: 'MEC-001',
    denumire: 'Alunecare, împiedicare, cădere la același nivel',
    categorie: 'mecanic',
    descriere: 'Pardoseli alunecoase, umezeală, obiecte pe jos, cabluri, prag necorespunzător',
    consecinte_posibile: [
      'Vânătăi, contuzii',
      'Fracturi membre',
      'Traumatisme craniene',
      'Entorse, luxații'
    ],
    probabilitate_initiala: 3,
    gravitate_initiala: 2,
    masuri_existente: [
      'Pardoseală antiderapantă în unele zone'
    ],
    masuri_propuse: [
      {
        id: 'm001-1',
        descriere: 'Montare benzi antiderapante pe scări și zone umede',
        tip: 'control_engineering',
        termen: 'scurt',
        cost_estimat: 'mic'
      },
      {
        id: 'm001-2',
        descriere: 'Organizarea periodică a locului de muncă (5S)',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      },
      {
        id: 'm001-3',
        descriere: 'Instructaj pentru menținerea ordinii și curățeniei',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      }
    ],
    probabilitate_reziduala: 2,
    gravitate_reziduala: 2,
    epi_necesare: ['Încălțăminte de protecție cu talpă antiderapantă'],
    legislatie: ['L319/2006', 'HG1091/2006'],
    zone_afectate: ['Toate zonele de circulație', 'Sanitare', 'Bucătărie']
  },

  // 2. MECANIC
  {
    id: 'p002',
    cod: 'MEC-002',
    denumire: 'Cădere de la înălțime',
    categorie: 'mecanic',
    descriere: 'Lucru pe scări, podele, platforme, parapete insuficiente',
    consecinte_posibile: [
      'Fracturi multiple',
      'Traumatisme craniene severe',
      'Leziuni coloanei vertebrale',
      'Deces'
    ],
    probabilitate_initiala: 2,
    gravitate_initiala: 5,
    masuri_existente: [
      'Scări certificate'
    ],
    masuri_propuse: [
      {
        id: 'm002-1',
        descriere: 'Interzicerea lucrului la înălțime fără echipament adecvat',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      },
      {
        id: 'm002-2',
        descriere: 'Achiziție scări profesionale cu platformă și bare de siguranță',
        tip: 'control_engineering',
        termen: 'scurt',
        cost_estimat: 'mediu'
      },
      {
        id: 'm002-3',
        descriere: 'Instruire pentru lucrul la înălțime',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      }
    ],
    probabilitate_reziduala: 1,
    gravitate_reziduala: 5,
    epi_necesare: ['Ham de siguranță (dacă lucrează >2m)', 'Încălțăminte de protecție'],
    legislatie: ['L319/2006', 'HG300/2006 - lucru la înălțime'],
    zone_afectate: ['Depozit', 'Zone cu acces la acoperiș']
  },

  // 3. MECANIC
  {
    id: 'p003',
    cod: 'MEC-003',
    denumire: 'Lovire de obiecte în mișcare, cădere obiecte',
    categorie: 'mecanic',
    descriere: 'Materiale depozitate necorespunzător, rafturi supraîncărcate, uși, ferestre',
    consecinte_posibile: [
      'Vânătăi, contuzii',
      'Fracturi',
      'Traumatisme craniene',
      'Leziuni membre superioare/inferioare'
    ],
    probabilitate_initiala: 3,
    gravitate_initiala: 3,
    masuri_existente: [
      'Rafturi metalice fixate de perete'
    ],
    masuri_propuse: [
      {
        id: 'm003-1',
        descriere: 'Verificarea stabilității rafturilor și fixarea corectă',
        tip: 'control_engineering',
        termen: 'imediat',
        cost_estimat: 'mic'
      },
      {
        id: 'm003-2',
        descriere: 'Stabilirea regulilor de depozitare (obiecte grele jos)',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      },
      {
        id: 'm003-3',
        descriere: 'Limitarea înălțimii de depozitare și marcarea capacității rafturilor',
        tip: 'control_administrativ',
        termen: 'scurt',
        cost_estimat: 'mic'
      }
    ],
    probabilitate_reziduala: 2,
    gravitate_reziduala: 3,
    epi_necesare: ['Încălțăminte de protecție cu bombeu metalic', 'Mănuși de protecție'],
    legislatie: ['L319/2006'],
    zone_afectate: ['Depozit', 'Arhivă', 'Magazine']
  },

  // 4. ELECTRIC
  {
    id: 'p004',
    cod: 'ELE-001',
    denumire: 'Electrocutare, contact electric',
    categorie: 'electric',
    descriere: 'Prize deteriorate, prelungitoare improvizate, tablouri electrice neprotejate',
    consecinte_posibile: [
      'Șoc electric',
      'Arsuri electrice',
      'Stop cardiac',
      'Deces'
    ],
    probabilitate_initiala: 2,
    gravitate_initiala: 5,
    masuri_existente: [
      'Instalație electrică cu prizare',
      'Întrerupător general'
    ],
    masuri_propuse: [
      {
        id: 'm004-1',
        descriere: 'Verificare periodică a instalației electrice de către electrician autorizat',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      },
      {
        id: 'm004-2',
        descriere: 'Înlocuire prize deteriorate și interzicere prelungitoare improvizate',
        tip: 'control_engineering',
        termen: 'imediat',
        cost_estimat: 'mic'
      },
      {
        id: 'm004-3',
        descriere: 'Montare protecție tablou electric și semnalizare adecvată',
        tip: 'control_engineering',
        termen: 'scurt',
        cost_estimat: 'mic'
      },
      {
        id: 'm004-4',
        descriere: 'Instruire: interzicere intervenții de către personal neautorizat',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      }
    ],
    probabilitate_reziduala: 1,
    gravitate_reziduala: 5,
    legislatie: ['L319/2006', 'I7/2011 - instalații electrice'],
    zone_afectate: ['Toate zonele cu instalații electrice']
  },

  // 5. INCENDIU
  {
    id: 'p005',
    cod: 'INC-001',
    denumire: 'Incendiu, explozie',
    categorie: 'incendiu',
    descriere: 'Materiale combustibile, instalații electrice defecte, surse de aprindere necontrolate',
    consecinte_posibile: [
      'Arsuri',
      'Intoxicație cu fum',
      'Deces',
      'Pagube materiale majore'
    ],
    probabilitate_initiala: 2,
    gravitate_initiala: 5,
    masuri_existente: [
      'Stingătoare (verificare în afara termenului)',
      'Senzori fum parțial'
    ],
    masuri_propuse: [
      {
        id: 'm005-1',
        descriere: 'Revizie tehnică anuală stingătoare și înlocuire unități expirate',
        tip: 'control_engineering',
        termen: 'imediat',
        cost_estimat: 'mic'
      },
      {
        id: 'm005-2',
        descriere: 'Instalare senzori fum în toate încăperile cu risc',
        tip: 'control_engineering',
        termen: 'scurt',
        cost_estimat: 'mediu'
      },
      {
        id: 'm005-3',
        descriere: 'Elaborare plan de evacuare și organizare exercițiu anual',
        tip: 'control_administrativ',
        termen: 'scurt',
        cost_estimat: 'mic'
      },
      {
        id: 'm005-4',
        descriere: 'Instruire utilizare stingătoare și proceduri de evacuare',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      },
      {
        id: 'm005-5',
        descriere: 'Interzicere depozitare materiale combustibile lângă surse de căldură',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      }
    ],
    probabilitate_reziduala: 1,
    gravitate_reziduala: 5,
    legislatie: ['L307/2006 - PSI', 'Ordin 129/2016 - PSI'],
    zone_afectate: ['Toate zonele']
  },

  // 6. ERGONOMIC
  {
    id: 'p006',
    cod: 'ERG-001',
    denumire: 'Mișcare manuală de sarcini (MMC)',
    categorie: 'ergonomic',
    descriere: 'Ridicare, transport, depunere sarcini grele, mișcări repetitive',
    consecinte_posibile: [
      'Dureri lombare',
      'Hernii de disc',
      'Afecțiuni musculo-scheletice',
      'Oboseală fizică cronică'
    ],
    probabilitate_initiala: 4,
    gravitate_initiala: 3,
    masuri_existente: [
      'Cărucioare disponibile'
    ],
    masuri_propuse: [
      {
        id: 'm006-1',
        descriere: 'Limitarea greutății manipulate manual la max 25kg (bărbați), 15kg (femei)',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      },
      {
        id: 'm006-2',
        descriere: 'Instruire pentru tehnici corecte de ridicare (genunchi, nu spate)',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      },
      {
        id: 'm006-3',
        descriere: 'Achiziție echipamente mecanice auxiliare (transpaleți, cărucior platformă)',
        tip: 'control_engineering',
        termen: 'mediu',
        cost_estimat: 'mediu'
      },
      {
        id: 'm006-4',
        descriere: 'Reorganizarea depozitelor pentru reducerea distanțelor',
        tip: 'control_engineering',
        termen: 'mediu',
        cost_estimat: 'mic'
      }
    ],
    probabilitate_reziduala: 2,
    gravitate_reziduala: 3,
    epi_necesare: ['Mănuși de protecție', 'Centură lombară (opțional)'],
    legislatie: ['L319/2006', 'HG1091/2006 - MMC'],
    zone_afectate: ['Depozit', 'Zonă de încărcare/descărcare']
  },

  // 7. ERGONOMIC
  {
    id: 'p007',
    cod: 'ERG-002',
    denumire: 'Lucru cu echipamente dotate cu ecran de vizualizare (DSE)',
    categorie: 'ergonomic',
    descriere: 'Poziție încorectă, iluminat neadecvat, pauze insuficiente, ecrane nepotrivite',
    consecinte_posibile: [
      'Dureri cervicale/lombare',
      'Oboseală vizuală',
      'Sindrom tunel carpian',
      'Afecțiuni musculo-scheletice membre superioare'
    ],
    probabilitate_initiala: 5,
    gravitate_initiala: 2,
    masuri_existente: [
      'Scaune ergonomice parțial',
      'Iluminat general'
    ],
    masuri_propuse: [
      {
        id: 'm007-1',
        descriere: 'Evaluare individuală posturi de lucru DSE conform HG1028/2006',
        tip: 'control_administrativ',
        termen: 'scurt',
        cost_estimat: 'mic'
      },
      {
        id: 'm007-2',
        descriere: 'Achiziție scaune ergonomice cu reglaj înălțime/spătar pentru toate posturile',
        tip: 'control_engineering',
        termen: 'mediu',
        cost_estimat: 'mediu'
      },
      {
        id: 'm007-3',
        descriere: 'Instruire pentru pauze regulate (10 min/2 ore) și exerciții de relaxare',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      },
      {
        id: 'm007-4',
        descriere: 'Ajustare poziție monitoare (partea superioară la nivelul ochilor)',
        tip: 'control_engineering',
        termen: 'imediat',
        cost_estimat: 'mic'
      },
      {
        id: 'm007-5',
        descriere: 'Îmbunătățire iluminat cu lămpi suplimentare task lighting',
        tip: 'control_engineering',
        termen: 'scurt',
        cost_estimat: 'mic'
      }
    ],
    probabilitate_reziduala: 3,
    gravitate_reziduala: 2,
    legislatie: ['L319/2006', 'HG1028/2006 - DSE'],
    zone_afectate: ['Birouri', 'Zone cu calculatoare']
  },

  // 8. CHIMIC
  {
    id: 'p008',
    cod: 'CHI-001',
    denumire: 'Expunere la substanțe chimice periculoase',
    categorie: 'chimic',
    descriere: 'Produse de curățenie, dezinfectanți, consumabile (toner, cerneală)',
    consecinte_posibile: [
      'Iritații piele/ochi',
      'Alergii',
      'Intoxicații',
      'Afecțiuni respiratorii'
    ],
    probabilitate_initiala: 3,
    gravitate_initiala: 2,
    masuri_existente: [
      'Produse comerciale standard'
    ],
    masuri_propuse: [
      {
        id: 'm008-1',
        descriere: 'Inventariere substanțe chimice și solicitare Fișe Date Securitate (FDS)',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      },
      {
        id: 'm008-2',
        descriere: 'Etichetare clară a recipientelor și interzicere transvasări',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      },
      {
        id: 'm008-3',
        descriere: 'Instruire utilizare corectă și risc expunere',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      },
      {
        id: 'm008-4',
        descriere: 'Depozitare într-un loc securizat, ventilat',
        tip: 'control_engineering',
        termen: 'scurt',
        cost_estimat: 'mic'
      }
    ],
    probabilitate_reziduala: 2,
    gravitate_reziduala: 2,
    epi_necesare: ['Mănuși de protecție chimică', 'Ochelari de protecție (dacă necesar)'],
    legislatie: ['L319/2006', 'HG1218/2006 - agenți chimici'],
    zone_afectate: ['Sanitare', 'Curățenie', 'Depozit produse']
  },

  // 9. BIOLOGIC
  {
    id: 'p009',
    cod: 'BIO-001',
    denumire: 'Expunere la agenți biologici (bacterii, viruși, mucegai)',
    categorie: 'biologic',
    descriere: 'Contact public, spații neventilate, igienă insuficientă, aglomerare',
    consecinte_posibile: [
      'Infecții respiratorii',
      'Boli transmisibile',
      'Alergii',
      'Îmbolnăviri epidemiologice'
    ],
    probabilitate_initiala: 3,
    gravitate_initiala: 3,
    masuri_existente: [
      'Curățenie periodică'
    ],
    masuri_propuse: [
      {
        id: 'm009-1',
        descriere: 'Asigurare ventilație naturală/mecanică adecvată în toate spațiile',
        tip: 'control_engineering',
        termen: 'mediu',
        cost_estimat: 'mediu'
      },
      {
        id: 'm009-2',
        descriere: 'Protocol igienă: dezinfectant mâini, curățenie zilnică suprafețe contact',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      },
      {
        id: 'm009-3',
        descriere: 'Informare angajați: rămânere acasă în caz de boală',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      },
      {
        id: 'm009-4',
        descriere: 'Verificare igienă sanitare și sistem ventilație (mucegai)',
        tip: 'control_engineering',
        termen: 'scurt',
        cost_estimat: 'mic'
      }
    ],
    probabilitate_reziduala: 2,
    gravitate_reziduala: 2,
    epi_necesare: ['Măști de protecție (în caz de pandemie)', 'Mănuși de unică folosință'],
    legislatie: ['L319/2006', 'HG1217/2006 - agenți biologici'],
    zone_afectate: ['Toate zonele', 'Zone contact public']
  },

  // 10. PSIHOSOCIAL
  {
    id: 'p010',
    cod: 'PSI-001',
    denumire: 'Stres ocupațional, epuizare profesională',
    categorie: 'psihosocial',
    descriere: 'Sarcini de lucru excesive, termene strânse, lipsa controlului, lipsa sprijin',
    consecinte_posibile: [
      'Burnout',
      'Anxietate, depresie',
      'Scăderea performanței',
      'Absențe medicale frecvente',
      'Afecțiuni cardiovasculare'
    ],
    probabilitate_initiala: 4,
    gravitate_initiala: 2,
    masuri_existente: [
      'Program flexibil parțial'
    ],
    masuri_propuse: [
      {
        id: 'm010-1',
        descriere: 'Evaluare anuală risc psihosocial (chestionar anonim)',
        tip: 'control_administrativ',
        termen: 'scurt',
        cost_estimat: 'mic'
      },
      {
        id: 'm010-2',
        descriere: 'Clarificarea rolurilor și responsabilităților (fișe de post actualizate)',
        tip: 'control_administrativ',
        termen: 'scurt',
        cost_estimat: 'mic'
      },
      {
        id: 'm010-3',
        descriere: 'Încurajare pauze regulate și respectare program de lucru',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      },
      {
        id: 'm010-4',
        descriere: 'Facilitare comunicare deschisă (întâlniri echipă lunare)',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      }
    ],
    probabilitate_reziduala: 3,
    gravitate_reziduala: 2,
    legislatie: ['L319/2006'],
    zone_afectate: ['Toate zonele']
  },

  // 11. PSIHOSOCIAL
  {
    id: 'p011',
    cod: 'PSI-002',
    denumire: 'Hărțuire morală, violență la locul de muncă',
    categorie: 'psihosocial',
    descriere: 'Comportament abuziv, intimidare, discriminare, conflict interpersonal',
    consecinte_posibile: [
      'Afectare sănătate mentală',
      'Anxietate, depresie',
      'Scăderea productivității',
      'Fluctuație personal',
      'Conflicte majore'
    ],
    probabilitate_initiala: 2,
    gravitate_initiala: 3,
    masuri_existente: [
      'Regulament intern generic'
    ],
    masuri_propuse: [
      {
        id: 'm011-1',
        descriere: 'Actualizare Regulament Intern cu clauze anti-hărțuire explicite',
        tip: 'control_administrativ',
        termen: 'scurt',
        cost_estimat: 'mic'
      },
      {
        id: 'm011-2',
        descriere: 'Numire persoană de contact pentru sesizări',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      },
      {
        id: 'm011-3',
        descriere: 'Instruire manageri și angajați privind comportamentul adecvat',
        tip: 'control_administrativ',
        termen: 'scurt',
        cost_estimat: 'mic'
      },
      {
        id: 'm011-4',
        descriere: 'Procedură transparentă investigare sesizări',
        tip: 'control_administrativ',
        termen: 'mediu',
        cost_estimat: 'mic'
      }
    ],
    probabilitate_reziduala: 1,
    gravitate_reziduala: 3,
    legislatie: ['L319/2006', 'Codul Muncii'],
    zone_afectate: ['Toate zonele']
  },

  // 12. CIRCULATIE
  {
    id: 'p012',
    cod: 'CIR-001',
    denumire: 'Accidente de circulație în timpul deplasărilor de serviciu',
    categorie: 'circulatie',
    descriere: 'Condus obosit, viteză, condiții meteo, întreținere auto insuficientă',
    consecinte_posibile: [
      'Accidente rutiere',
      'Leziuni grave',
      'Deces',
      'Pagube materiale'
    ],
    probabilitate_initiala: 2,
    gravitate_initiala: 4,
    masuri_existente: [
      'Asigurare vehicule'
    ],
    masuri_propuse: [
      {
        id: 'm012-1',
        descriere: 'Verificare periodică tehnică vehicule (revizie, anvelope)',
        tip: 'control_engineering',
        termen: 'imediat',
        cost_estimat: 'mic'
      },
      {
        id: 'm012-2',
        descriere: 'Instruire conducere defensivă și respectare pauze obligatorii',
        tip: 'control_administrativ',
        termen: 'scurt',
        cost_estimat: 'mic'
      },
      {
        id: 'm012-3',
        descriere: 'Politică: limitare viteză, interzicere condus obosit/sub influență',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      },
      {
        id: 'm012-4',
        descriere: 'Dotare vehicule cu kit prim ajutor și echipament obligatoriu',
        tip: 'control_engineering',
        termen: 'imediat',
        cost_estimat: 'mic'
      }
    ],
    probabilitate_reziduala: 1,
    gravitate_reziduala: 4,
    legislatie: ['L319/2006', 'OUG195/2002 - circulație rutieră'],
    zone_afectate: ['Deplasări externe']
  },

  // 13. MECANIC
  {
    id: 'p013',
    cod: 'MEC-004',
    denumire: 'Contactul cu suprafețe reci/fierbinți',
    categorie: 'mecanic',
    descriere: 'Cazane, radiatoare, echipamente frigorifice, suprafețe metalice calde/reci',
    consecinte_posibile: [
      'Arsuri termice',
      'Degerături',
      'Iritații piele',
      'Durere acută'
    ],
    probabilitate_initiala: 3,
    gravitate_initiala: 2,
    masuri_existente: [
      'Radiatoare standard'
    ],
    masuri_propuse: [
      {
        id: 'm013-1',
        descriere: 'Izolare/protejare suprafețe fierbinți accesibile (țevi, radiatoare)',
        tip: 'control_engineering',
        termen: 'scurt',
        cost_estimat: 'mic'
      },
      {
        id: 'm013-2',
        descriere: 'Semnalizare "FIERBINTE" sau "RECE" pe echipamente',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      },
      {
        id: 'm013-3',
        descriere: 'Instruire personal: utilizare mănuși termice',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      }
    ],
    probabilitate_reziduala: 2,
    gravitate_reziduala: 2,
    epi_necesare: ['Mănuși termice'],
    legislatie: ['L319/2006'],
    zone_afectate: ['Bucătărie', 'Zonă tehnică', 'Depozit frigorific']
  },

  // 14. MECANIC
  {
    id: 'p014',
    cod: 'MEC-005',
    denumire: 'Tăiere, înțepare cu obiecte ascuțite',
    categorie: 'mecanic',
    descriere: 'Cuțite, foarfece, capsatoare, muchii ascuțite mobilier/echipamente',
    consecinte_posibile: [
      'Tăieturi',
      'Înțepături',
      'Hemoragii',
      'Risc infecție'
    ],
    probabilitate_initiala: 3,
    gravitate_initiala: 2,
    masuri_existente: [
      'Instrumente standard birou'
    ],
    masuri_propuse: [
      {
        id: 'm014-1',
        descriere: 'Depozitare cuțite/foarfece în suporturi dedicate',
        tip: 'control_engineering',
        termen: 'imediat',
        cost_estimat: 'mic'
      },
      {
        id: 'm014-2',
        descriere: 'Protejare muchii ascuțite mobilier cu profile de protecție',
        tip: 'control_engineering',
        termen: 'scurt',
        cost_estimat: 'mic'
      },
      {
        id: 'm014-3',
        descriere: 'Instruire manipulare corectă instrumente ascuțite',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      },
      {
        id: 'm014-4',
        descriere: 'Dotare cu trusă prim ajutor accesibilă',
        tip: 'control_engineering',
        termen: 'imediat',
        cost_estimat: 'mic'
      }
    ],
    probabilitate_reziduala: 2,
    gravitate_reziduala: 2,
    epi_necesare: ['Mănuși de protecție (dacă relevant)'],
    legislatie: ['L319/2006'],
    zone_afectate: ['Bucătărie', 'Birouri', 'Depozit']
  },

  // 15. ERGONOMIC
  {
    id: 'p015',
    cod: 'ERG-003',
    denumire: 'Microclimă necorespunzătoare (temperatură, umiditate)',
    categorie: 'ergonomic',
    descriere: 'Temperatură excesivă/insuficientă, umiditate ridicată, curenți de aer',
    consecinte_posibile: [
      'Disconfort termic',
      'Boli respiratorii',
      'Scădere productivitate',
      'Deshidratare/răcire'
    ],
    probabilitate_initiala: 4,
    gravitate_initiala: 2,
    masuri_existente: [
      'Aer condiționat parțial',
      'Încălzire centrală'
    ],
    masuri_propuse: [
      {
        id: 'm015-1',
        descriere: 'Măsurători microclimă (temp., umiditate) și raportare periodică',
        tip: 'control_administrativ',
        termen: 'scurt',
        cost_estimat: 'mic'
      },
      {
        id: 'm015-2',
        descriere: 'Extindere climatizare în toate zonele de lucru',
        tip: 'control_engineering',
        termen: 'lung',
        cost_estimat: 'ridicat'
      },
      {
        id: 'm015-3',
        descriere: 'Asigurare ventilatoare mobile pe perioada verii',
        tip: 'control_engineering',
        termen: 'scurt',
        cost_estimat: 'mic'
      },
      {
        id: 'm015-4',
        descriere: 'Politică flexibilitate program în zile caniculare',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      }
    ],
    probabilitate_reziduala: 3,
    gravitate_reziduala: 2,
    legislatie: ['L319/2006', 'Anexa OSHA 111 - microclimă'],
    zone_afectate: ['Birouri', 'Zone producție/depozit']
  },

  // 16. ERGONOMIC
  {
    id: 'p016',
    cod: 'ERG-004',
    denumire: 'Iluminat necorespunzător',
    categorie: 'ergonomic',
    descriere: 'Iluminat insuficient, orbire, reflectare pe ecrane, iluminat inegal',
    consecinte_posibile: [
      'Oboseală vizuală',
      'Dureri de cap',
      'Scădere acuitate vizuală',
      'Risc accidente'
    ],
    probabilitate_initiala: 4,
    gravitate_initiala: 2,
    masuri_existente: [
      'Iluminat general cu tuburi fluorescente'
    ],
    masuri_propuse: [
      {
        id: 'm016-1',
        descriere: 'Măsurători nivel iluminat (luxmetru) în toate posturile de lucru',
        tip: 'control_administrativ',
        termen: 'scurt',
        cost_estimat: 'mic'
      },
      {
        id: 'm016-2',
        descriere: 'Înlocuire corpuri iluminat cu LED eficient (min 500 lux birouri)',
        tip: 'control_engineering',
        termen: 'mediu',
        cost_estimat: 'mediu'
      },
      {
        id: 'm016-3',
        descriere: 'Instalare lămpi individuale task lighting la fiecare post DSE',
        tip: 'control_engineering',
        termen: 'scurt',
        cost_estimat: 'mic'
      },
      {
        id: 'm016-4',
        descriere: 'Reducere reflectare: jaluzele ferestre, poziționare monitoare',
        tip: 'control_engineering',
        termen: 'scurt',
        cost_estimat: 'mic'
      }
    ],
    probabilitate_reziduala: 2,
    gravitate_reziduala: 2,
    legislatie: ['L319/2006', 'HG1028/2006 - DSE'],
    zone_afectate: ['Birouri', 'Depozit', 'Coridoare']
  },

  // 17. ERGONOMIC
  {
    id: 'p017',
    cod: 'ERG-005',
    denumire: 'Zgomot excesiv',
    categorie: 'ergonomic',
    descriere: 'Echipamente zgomotoase, open space, trafic, vecini',
    consecinte_posibile: [
      'Oboseală auditivă',
      'Scădere concentrare',
      'Stres',
      'Afectare auz (expunere prelungită)'
    ],
    probabilitate_initiala: 3,
    gravitate_initiala: 2,
    masuri_existente: [
      'Open space'
    ],
    masuri_propuse: [
      {
        id: 'm017-1',
        descriere: 'Măsurători nivel zgomot (sonometru)',
        tip: 'control_administrativ',
        termen: 'scurt',
        cost_estimat: 'mic'
      },
      {
        id: 'm017-2',
        descriere: 'Izolare fonică (panouri absorbante, perdele fonoabsorbante)',
        tip: 'control_engineering',
        termen: 'mediu',
        cost_estimat: 'mediu'
      },
      {
        id: 'm017-3',
        descriere: 'Amenajare zone quiet pentru concentrare',
        tip: 'control_engineering',
        termen: 'mediu',
        cost_estimat: 'mediu'
      },
      {
        id: 'm017-4',
        descriere: 'Politică: reducere conversații zgomotoase în open space',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      }
    ],
    probabilitate_reziduala: 2,
    gravitate_reziduala: 2,
    epi_necesare: ['Căști antifonice/antifon (dacă nivel >80dB)'],
    legislatie: ['L319/2006', 'HG493/2006 - zgomot'],
    zone_afectate: ['Open space', 'Zonă tehnică']
  },

  // 18. MECANIC
  {
    id: 'p018',
    cod: 'MEC-006',
    denumire: 'Prindere, strivire între obiecte',
    categorie: 'mecanic',
    descriere: 'Uși, sertare, echipamente mobile, rafturi retractabile',
    consecinte_posibile: [
      'Vânătăi',
      'Fracturi degete/membre',
      'Strivire',
      'Durere acută'
    ],
    probabilitate_initiala: 2,
    gravitate_initiala: 3,
    masuri_existente: [
      'Uși standard'
    ],
    masuri_propuse: [
      {
        id: 'm018-1',
        descriere: 'Verificare sisteme închidere automată uși (frânare corectă)',
        tip: 'control_engineering',
        termen: 'imediat',
        cost_estimat: 'mic'
      },
      {
        id: 'm018-2',
        descriere: 'Instruire personal: atenție la manipulare uși/sertare grele',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      },
      {
        id: 'm018-3',
        descriere: 'Semnalizare zone cu echipamente mobile',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      }
    ],
    probabilitate_reziduala: 1,
    gravitate_reziduala: 3,
    legislatie: ['L319/2006'],
    zone_afectate: ['Toate zonele']
  },

  // 19. MECANIC
  {
    id: 'p019',
    cod: 'MEC-007',
    denumire: 'Spargere geamuri, suprafețe din sticlă',
    categorie: 'mecanic',
    descriere: 'Ferestre, uși sticlă, suprafețe vitrate nemarcare/neprotejate',
    consecinte_posibile: [
      'Tăieturi grave',
      'Hemoragii',
      'Leziuni faciale',
      'Risc infecție'
    ],
    probabilitate_initiala: 2,
    gravitate_initiala: 3,
    masuri_existente: [
      'Ferestre standard',
      'Ușă sticlă intrare'
    ],
    masuri_propuse: [
      {
        id: 'm019-1',
        descriere: 'Aplicare folie protecție pe suprafețe sticlă (antispargere)',
        tip: 'control_engineering',
        termen: 'mediu',
        cost_estimat: 'mediu'
      },
      {
        id: 'm019-2',
        descriere: 'Marcare vizibilă uși/pereți sticlă (stickere la înălțimea ochilor)',
        tip: 'control_engineering',
        termen: 'imediat',
        cost_estimat: 'mic'
      },
      {
        id: 'm019-3',
        descriere: 'Verificare integritate geamuri și înlocuire celor sparte',
        tip: 'control_engineering',
        termen: 'imediat',
        cost_estimat: 'mic'
      }
    ],
    probabilitate_reziduala: 1,
    gravitate_reziduala: 3,
    legislatie: ['L319/2006'],
    zone_afectate: ['Intrări', 'Birouri', 'Săli reuniuni']
  },

  // 20. MECANIC
  {
    id: 'p020',
    cod: 'MEC-008',
    denumire: 'Acces neautorizat în zone periculoase',
    categorie: 'mecanic',
    descriere: 'Zone tehnice, arhivă, acoperiș, tablouri electrice nerestricționate',
    consecinte_posibile: [
      'Accidente diverse',
      'Electrocutare',
      'Cădere',
      'Expunere la riscuri majore'
    ],
    probabilitate_initiala: 2,
    gravitate_initiala: 4,
    masuri_existente: [
      'Cheie tablou electric'
    ],
    masuri_propuse: [
      {
        id: 'm020-1',
        descriere: 'Restricționare acces zone periculoase (lacăte, badge-uri)',
        tip: 'control_engineering',
        termen: 'scurt',
        cost_estimat: 'mic'
      },
      {
        id: 'm020-2',
        descriere: 'Semnalizare "ACCES INTERZIS PERSONALULUI NEAUTORIZAT"',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      },
      {
        id: 'm020-3',
        descriere: 'Registru acces pentru zone sensibile',
        tip: 'control_administrativ',
        termen: 'scurt',
        cost_estimat: 'mic'
      },
      {
        id: 'm020-4',
        descriere: 'Instruire angajați: interzicere acces fără autorizare',
        tip: 'control_administrativ',
        termen: 'imediat',
        cost_estimat: 'mic'
      }
    ],
    probabilitate_reziduala: 1,
    gravitate_reziduala: 4,
    legislatie: ['L319/2006'],
    zone_afectate: ['Zonă tehnică', 'Tablouri electrice', 'Acoperiș', 'Arhivă']
  }
];

/**
 * Generează raport sumar de prioritizare
 */
export function genereazaRaportPrioritizare(pericole: PercolSSM[]): {
  foarte_ridicat: PercolSSM[];
  ridicat: PercolSSM[];
  mediu: PercolSSM[];
  scazut: PercolSSM[];
} {
  const clasificat = {
    foarte_ridicat: [] as PercolSSM[],
    ridicat: [] as PercolSSM[],
    mediu: [] as PercolSSM[],
    scazut: [] as PercolSSM[]
  };

  pericole.forEach(pericol => {
    const risc = calculeazaNivelRisc(pericol.probabilitate_initiala, pericol.gravitate_initiala);
    clasificat[risc.nivel].push(pericol);
  });

  return clasificat;
}

/**
 * Calculează statistici pentru template
 */
export function calculeazaStatistici(pericole: PercolSSM[]) {
  const total = pericole.length;
  const raport = genereazaRaportPrioritizare(pericole);

  const masuri_propuse_total = pericole.reduce((sum, p) => sum + p.masuri_propuse.length, 0);
  const masuri_imediate = pericole.reduce((sum, p) =>
    sum + p.masuri_propuse.filter(m => m.termen === 'imediat').length, 0
  );

  return {
    total_pericole: total,
    foarte_ridicat: raport.foarte_ridicat.length,
    ridicat: raport.ridicat.length,
    mediu: raport.mediu.length,
    scazut: raport.scazut.length,
    masuri_propuse_total,
    masuri_imediate,
    categorii: {
      mecanic: pericole.filter(p => p.categorie === 'mecanic').length,
      electric: pericole.filter(p => p.categorie === 'electric').length,
      chimic: pericole.filter(p => p.categorie === 'chimic').length,
      biologic: pericole.filter(p => p.categorie === 'biologic').length,
      ergonomic: pericole.filter(p => p.categorie === 'ergonomic').length,
      psihosocial: pericole.filter(p => p.categorie === 'psihosocial').length,
      incendiu: pericole.filter(p => p.categorie === 'incendiu').length,
      circulatie: pericole.filter(p => p.categorie === 'circulatie').length,
    }
  };
}
