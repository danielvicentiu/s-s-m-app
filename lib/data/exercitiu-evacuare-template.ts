/**
 * Template-uri pentru exerciții de evacuare
 * Scenarii pre-configurate pentru incendiu, cutremur și scurgere substanțe toxice
 */

export interface EvacuationPhase {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  tasks: string[];
  responsibleRoles: string[];
}

export interface EvacuationScenario {
  id: string;
  scenario: string;
  description: string;
  phases: EvacuationPhase[];
  durationMinutes: number;
  participants: {
    minimum: number;
    recommended: number;
    roles: string[];
  };
  equipmentNeeded: string[];
  evaluationCriteria: {
    category: string;
    criteria: string[];
    maxScore: number;
  }[];
  reportTemplate: {
    sections: {
      title: string;
      fields: string[];
    }[];
  };
}

export const evacuationScenarios: EvacuationScenario[] = [
  {
    id: 'fire-evacuation',
    scenario: 'Incendiu',
    description: 'Exercițiu de evacuare în caz de incendiu izbucnit în clădire',
    phases: [
      {
        id: 'alertare',
        name: 'Alertare',
        description: 'Declanșarea sistemului de alarmă și anunțarea situației de urgență',
        durationMinutes: 2,
        tasks: [
          'Activare sistem de alarmă incendiu',
          'Anunțare verbală a evacuării',
          'Verificare funcționare sirenă',
          'Contactare servicii de urgență (112)',
        ],
        responsibleRoles: ['Responsabil SSM', 'Responsabil PSI', 'Operator alarma'],
      },
      {
        id: 'evacuare',
        name: 'Evacuare',
        description: 'Evacuarea ordonată a tuturor persoanelor din clădire',
        durationMinutes: 5,
        tasks: [
          'Întrerupere imediată a activităților',
          'Evacuare pe căile stabilite',
          'Folosirea scărilor de urgență (NU lift)',
          'Închidere uși și ferestre',
          'Verificare spații anexe (toalete, depozite)',
          'Asistență pentru persoane cu mobilitate redusă',
        ],
        responsibleRoles: ['Responsabili etaj', 'Responsabili zonă', 'Angajați'],
      },
      {
        id: 'verificare-prezenta',
        name: 'Verificare prezență',
        description: 'Verificarea tuturor angajaților la punctul de adunare',
        durationMinutes: 3,
        tasks: [
          'Adunare la punctul de întâlnire stabilit',
          'Verificare liste prezență',
          'Raportare persoane lipsă',
          'Menținere distanță sigurură de clădire',
          'Evitare blocare accesuri pentru pompieri',
        ],
        responsibleRoles: ['Responsabil SSM', 'Manageri departament', 'HR'],
      },
      {
        id: 'interventie',
        name: 'Intervenție',
        description: 'Intervenția echipei de primă intervenție și a pompierilor',
        durationMinutes: 10,
        tasks: [
          'Evaluare situație de către echipa PSI',
          'Intervenție cu stingătoare (dacă este sigur)',
          'Informare pompieri despre situație',
          'Închidere utilități (gaz, electricitate)',
          'Restricționare acces în zonă',
        ],
        responsibleRoles: ['Echipa PSI', 'Pompieri', 'Responsabil clădire'],
      },
      {
        id: 'revenire',
        name: 'Revenire',
        description: 'Revenirea în condiții de siguranță în clădire',
        durationMinutes: 5,
        tasks: [
          'Așteptare aprobare de la pompieri',
          'Verificare siguranță clădire',
          'Anunț oficial de revenire',
          'Reluare activitate normală',
          'Completare rapoarte incident',
        ],
        responsibleRoles: ['Responsabil SSM', 'Pompieri', 'Management'],
      },
    ],
    durationMinutes: 25,
    participants: {
      minimum: 10,
      recommended: 50,
      roles: [
        'Responsabil SSM',
        'Responsabil PSI',
        'Echipa de primă intervenție',
        'Responsabili etaj/zonă',
        'Toți angajații',
        'Observatori (extern)',
      ],
    },
    equipmentNeeded: [
      'Sistem de alarmă incendiu',
      'Stingătoare (verificate)',
      'Hidranți interiori',
      'Truse de prim ajutor',
      'Liste de prezență',
      'Planuri de evacuare',
      'Veste reflectorizante pentru responsabili',
      'Cronometru',
      'Formulare evaluare',
      'Telefon de urgență',
      'Megafon/sistem de sonorizare',
    ],
    evaluationCriteria: [
      {
        category: 'Alertare și comunicare',
        criteria: [
          'Sistemul de alarmă a funcționat corect',
          'Anunțul de evacuare a fost clar și auzit',
          'Serviciile de urgență au fost contactate prompt',
          'Comunicarea între responsabili a fost eficientă',
        ],
        maxScore: 20,
      },
      {
        category: 'Procesul de evacuare',
        criteria: [
          'Evacuarea a început imediat după alarmă',
          'Căile de evacuare au fost folosite corect',
          'Ordinea și disciplina au fost menținute',
          'Ușile și ferestrele au fost închise',
          'Persoanele cu mobilitate redusă au primit asistență',
        ],
        maxScore: 25,
      },
      {
        category: 'Timp de evacuare',
        criteria: [
          'Timpul total sub 5 minute (excelent)',
          'Timpul 5-7 minute (bun)',
          'Timpul 7-10 minute (acceptabil)',
          'Prima persoană a ajuns la punct în sub 1 minut',
        ],
        maxScore: 15,
      },
      {
        category: 'Verificare prezență',
        criteria: [
          'Lista de prezență completă și corectă',
          'Persoanele lipsă au fost identificate rapid',
          'Raportarea către responsabil SSM a fost promptă',
          'Nimeni nu a revenit în clădire neautorizat',
        ],
        maxScore: 20,
      },
      {
        category: 'Echipament și pregătire',
        criteria: [
          'Echipamentul PSI era funcțional',
          'Responsabilii știau atribuțiile',
          'Căile de evacuare erau libere',
          'Punctul de adunare era potrivit',
        ],
        maxScore: 20,
      },
    ],
    reportTemplate: {
      sections: [
        {
          title: 'Informații generale',
          fields: [
            'Data și ora exercițiului',
            'Durata totală',
            'Scenariul simulat',
            'Locație incendiu simulat',
            'Condiții meteorologice',
            'Număr total participanți',
          ],
        },
        {
          title: 'Desfășurare exercițiu',
          fields: [
            'Ora declanșare alarmă',
            'Ora evacuare completă',
            'Timpul de evacuare (minute)',
            'Căi de evacuare utilizate',
            'Probleme întâmpinate',
            'Incidente raportate',
          ],
        },
        {
          title: 'Evaluare performanță',
          fields: [
            'Scor alertare și comunicare',
            'Scor proces evacuare',
            'Scor timp evacuare',
            'Scor verificare prezență',
            'Scor echipament și pregătire',
            'Scor total (max 100)',
          ],
        },
        {
          title: 'Observații și recomandări',
          fields: [
            'Aspecte pozitive',
            'Deficiențe identificate',
            'Măsuri corective necesare',
            'Recomandări pentru îmbunătățire',
            'Termen implementare măsuri',
            'Responsabil implementare',
          ],
        },
        {
          title: 'Concluzii',
          fields: [
            'Rezultat general (reușit/parțial reușit/nereușit)',
            'Data următorului exercițiu',
            'Semnătură responsabil SSM',
            'Semnătură director',
          ],
        },
      ],
    },
  },
  {
    id: 'earthquake-evacuation',
    scenario: 'Cutremur',
    description: 'Exercițiu de evacuare în caz de cutremur de pământ',
    phases: [
      {
        id: 'alertare',
        name: 'Alertare',
        description: 'Detectarea cutremurului și anunțarea măsurilor de protecție',
        durationMinutes: 1,
        tasks: [
          'Simțire prima mișcare seismică',
          'Anunțare vocală: "CUTREMUR! PROTEJAȚI-VĂ!"',
          'Activare protocol protecție seismică',
        ],
        responsibleRoles: ['Orice persoană prezentă', 'Responsabil SSM'],
      },
      {
        id: 'protectie-initiala',
        name: 'Protecție inițială',
        description: 'Măsuri de protecție în timpul cutremurului (Drop-Cover-Hold)',
        durationMinutes: 2,
        tasks: [
          'GHEMUIRE sub birouri/mese rezistente',
          'ACOPERIRE cap și gât cu mâinile',
          'ȚINERE de picioarele mobilierului',
          'RĂMÂNERE în poziție până încetează zguduiturile',
          'Evitare ferestre, oglinzi, corpuri suspendate',
          'Îndepărtare de rafturi înalte',
        ],
        responsibleRoles: ['Toți angajații', 'Responsabili zonă'],
      },
      {
        id: 'evacuare',
        name: 'Evacuare',
        description: 'Evacuarea ordonată după încetarea cutremurului principal',
        durationMinutes: 7,
        tasks: [
          'Așteptare încetare zguduituri principale',
          'Verificare rapidă răniți în zonă',
          'Evacuare calmă pe căile stabilite',
          'Atenție la elemente căzute/deteriorate',
          'Evitare lift-uri (folosire scări)',
          'Asistență persoane cu mobilitate redusă',
          'Atenție la replici seismice',
        ],
        responsibleRoles: ['Responsabili etaj', 'Responsabili zonă', 'Angajați'],
      },
      {
        id: 'verificare-prezenta',
        name: 'Verificare prezență',
        description: 'Verificarea tuturor angajaților la punct de adunare sigur',
        durationMinutes: 3,
        tasks: [
          'Adunare la punctul de întâlnire (teren deschis)',
          'Numărare angajați pe departamente',
          'Raportare persoane lipsă/rănite',
          'Menținere distanță de clădiri',
          'Evitare zone cu cabluri/stâlpi deteriorați',
        ],
        responsibleRoles: ['Responsabil SSM', 'Manageri departament', 'HR'],
      },
      {
        id: 'interventie',
        name: 'Intervenție',
        description: 'Evaluarea pagubelor și acordarea primului ajutor',
        durationMinutes: 10,
        tasks: [
          'Acordare prim ajutor răniților',
          'Evaluare vizuală stare clădire',
          'Verificare scurgeri gaz/apă',
          'Închidere utilități dacă e necesar',
          'Contactare servicii urgență (112)',
          'Stabilire zonă sigură',
        ],
        responsibleRoles: ['Echipa prim ajutor', 'Responsabil clădire', 'Responsabil SSM'],
      },
      {
        id: 'revenire',
        name: 'Revenire',
        description: 'Revenirea în clădire după verificări de siguranță',
        durationMinutes: 7,
        tasks: [
          'Așteptare evaluare structurală clădire',
          'Verificare de către specialiști autorizați',
          'Anunț oficial siguranță clădire',
          'Revenire graduală în clădire',
          'Monitorizare replici seismice',
          'Completare rapoarte incident',
        ],
        responsibleRoles: ['Ingineri structură', 'Responsabil SSM', 'Management'],
      },
    ],
    durationMinutes: 30,
    participants: {
      minimum: 10,
      recommended: 50,
      roles: [
        'Responsabil SSM',
        'Responsabili etaj/zonă',
        'Echipa de prim ajutor',
        'Responsabil clădire',
        'Toți angajații',
        'Observatori (extern)',
      ],
    },
    equipmentNeeded: [
      'Truse de prim ajutor',
      'Liste de prezență',
      'Planuri de evacuare seismică',
      'Megafon/sistem portabil sonorizare',
      'Lămpi de urgență/lanterne',
      'Apă îmbuteliată',
      'Pături termice',
      'Cronometru',
      'Formulare evaluare',
      'Telefon de urgență',
      'Veste reflectorizante',
      'Benzi delimitare zonă',
    ],
    evaluationCriteria: [
      {
        category: 'Protecție inițială',
        criteria: [
          'Angajații au adoptat poziția Drop-Cover-Hold',
          'Reacția a fost imediată la prima zguduitură',
          'Au fost evitate zonele periculoase',
          'Nimeni nu a încercat să fugă în timpul cutremurului',
        ],
        maxScore: 25,
      },
      {
        category: 'Procesul de evacuare',
        criteria: [
          'Evacuarea a început după încetarea zguduiturilor',
          'Ordinea și calmul au fost menținute',
          'Au fost evitate lifturile',
          'Atenție la elementele deteriorate/căzute',
          'Persoanele vulnerabile au primit asistență',
        ],
        maxScore: 25,
      },
      {
        category: 'Timp de evacuare',
        criteria: [
          'Timpul total sub 7 minute (excelent)',
          'Timpul 7-10 minute (bun)',
          'Timpul 10-15 minute (acceptabil)',
          'Evacuarea s-a făcut fără panică',
        ],
        maxScore: 15,
      },
      {
        category: 'Verificare și siguranță',
        criteria: [
          'Lista de prezență completă și corectă',
          'Punctul de adunare era în zonă sigură',
          'Distanța față de clădiri a fost respectată',
          'Raportarea persoanelor lipsă a fost promptă',
        ],
        maxScore: 20,
      },
      {
        category: 'Pregătire și cunoștințe',
        criteria: [
          'Angajații cunoșteau poziția Drop-Cover-Hold',
          'Responsabilii știau atribuțiile',
          'Echipamentul de urgență era accesibil',
          'Punctele de adunare erau cunoscute',
        ],
        maxScore: 15,
      },
    ],
    reportTemplate: {
      sections: [
        {
          title: 'Informații generale',
          fields: [
            'Data și ora exercițiului',
            'Durata totală',
            'Scenariul simulat (magnitudine cutremur)',
            'Condiții meteorologice',
            'Număr total participanți',
            'Observatori externi prezenți',
          ],
        },
        {
          title: 'Desfășurare exercițiu',
          fields: [
            'Ora simulare început cutremur',
            'Durata fase protecție inițială',
            'Ora început evacuare',
            'Ora evacuare completă',
            'Timpul total de evacuare (minute)',
            'Probleme întâmpinate',
            'Incidente raportate',
          ],
        },
        {
          title: 'Evaluare performanță',
          fields: [
            'Scor protecție inițială',
            'Scor proces evacuare',
            'Scor timp evacuare',
            'Scor verificare și siguranță',
            'Scor pregătire și cunoștințe',
            'Scor total (max 100)',
          ],
        },
        {
          title: 'Observații și recomandări',
          fields: [
            'Aspecte pozitive',
            'Deficiențe identificate',
            'Măsuri corective necesare',
            'Recomandări pentru îmbunătățire',
            'Nevoi de instruire suplimentară',
            'Termen implementare măsuri',
            'Responsabil implementare',
          ],
        },
        {
          title: 'Concluzii',
          fields: [
            'Rezultat general (reușit/parțial reușit/nereușit)',
            'Gradul de pregătire angajați',
            'Data următorului exercițiu',
            'Semnătură responsabil SSM',
            'Semnătură director',
          ],
        },
      ],
    },
  },
  {
    id: 'toxic-spill-evacuation',
    scenario: 'Scurgere substanțe toxice',
    description: 'Exercițiu de evacuare în caz de scurgere/emisie substanțe chimice periculoase',
    phases: [
      {
        id: 'alertare',
        name: 'Alertare',
        description: 'Detectarea scurgerii și declanșarea alarmei chimice',
        durationMinutes: 2,
        tasks: [
          'Detectare scurgere substanță toxică',
          'Activare alarmă chimică specifică',
          'Anunțare tip substanță și locație',
          'Contactare echipă de urgență (112)',
          'Activare plan de urgență chimică',
        ],
        responsibleRoles: ['Responsabil protecție mediu', 'Responsabil SSM', 'Operator detectare'],
      },
      {
        id: 'izolare-zona',
        name: 'Izolare zonă',
        description: 'Izolarea imediată a zonei contaminate',
        durationMinutes: 3,
        tasks: [
          'Delimitare zonă periculoasă',
          'Închidere ventilație în zona afectată',
          'Întrerupere activități în zonă',
          'Restricționare acces neautorizat',
          'Activare sisteme de neutralizare (dacă există)',
          'Evaluare direcție vânt (pentru vapori)',
        ],
        responsibleRoles: ['Echipa intervenție chimică', 'Responsabil SSM', 'Responsabil zonă'],
      },
      {
        id: 'evacuare',
        name: 'Evacuare',
        description: 'Evacuarea rapidă ținând cont de direcția vântului și tipul contaminant',
        durationMinutes: 6,
        tasks: [
          'Evacuare imediată zonă contaminată',
          'Deplasare perpendicular pe direcția vântului',
          'Folosire căi de evacuare secundare (evitare zonă)',
          'Reținere respirație/acoperire gură-nas',
          'Evitare contact cu substanța',
          'Asistență persoane expuse',
          'Închidere uși pentru limitare răspândire',
        ],
        responsibleRoles: ['Responsabili etaj', 'Echipa intervenție chimică', 'Angajați'],
      },
      {
        id: 'verificare-prezenta',
        name: 'Verificare prezență',
        description: 'Verificarea angajaților și identificarea persoanelor expuse',
        durationMinutes: 4,
        tasks: [
          'Adunare la punct sigur (în sensul vântului)',
          'Verificare liste prezență',
          'Identificare persoane expuse la substanță',
          'Evaluare simptome intoxicare',
          'Raportare persoane lipsă',
          'Separare persoane contaminate',
        ],
        responsibleRoles: ['Responsabil SSM', 'Personal medical', 'Manageri departament'],
      },
      {
        id: 'interventie',
        name: 'Intervenție',
        description: 'Intervenția echipei CBRN și acordarea primului ajutor',
        durationMinutes: 15,
        tasks: [
          'Acordare prim ajutor persoanelor expuse',
          'Decontaminare primară (duș, spălare)',
          'Îndepărtare haine contaminate',
          'Intervenție echipă specializată CBRN',
          'Ventilare zonă afectată',
          'Neutralizare/absorbție substanță',
          'Monitorizare calitate aer',
          'Evaluare necesitate spitalizare',
        ],
        responsibleRoles: ['Echipa CBRN', 'Personal medical', 'Pompieri', 'Responsabil mediu'],
      },
      {
        id: 'revenire',
        name: 'Revenire',
        description: 'Revenirea după decontaminare și verificare siguranță',
        durationMinutes: 10,
        tasks: [
          'Măsurători calitate aer',
          'Confirmare nivel sigur contaminanți',
          'Decontaminare completă zonă',
          'Verificare sisteme ventilație',
          'Eliminare deșeuri contaminate',
          'Aprobare de la autorități',
          'Anunț oficial revenire',
          'Monitorizare continuă parametri',
        ],
        responsibleRoles: ['Laborator măsurători', 'Responsabil mediu', 'Autorități', 'Management'],
      },
    ],
    durationMinutes: 40,
    participants: {
      minimum: 8,
      recommended: 30,
      roles: [
        'Responsabil SSM',
        'Responsabil protecție mediu',
        'Echipa intervenție chimică/CBRN',
        'Personal medical/prim ajutor',
        'Responsabili zonă',
        'Angajați expuși risc chimic',
        'Observatori (autorități mediu)',
      ],
    },
    equipmentNeeded: [
      'Sistem detectare gaze/vapori toxici',
      'Alarmă chimică specific',
      'Echipament protecție chimică (combinezoane, măști)',
      'Aparate respirat izolante (SCBA)',
      'Truse decontaminare',
      'Duș de urgență și spălător ochi',
      'Absorbante/neutralizatori chimici',
      'Truse prim ajutor pentru expunere chimică',
      'Saci pentru haine contaminate',
      'Benzi delimitare zonă periculoasă',
      'Aparat măsurare calitate aer',
      'Măști protecție respiratorie',
      'Mănuși chimice',
      'Liste de prezență',
      'Fișe siguranță substanțe (MSDS)',
      'Plan intervenție chimică',
      'Telefon urgență',
      'Megafon',
      'Cronometru',
    ],
    evaluationCriteria: [
      {
        category: 'Detectare și alertare',
        criteria: [
          'Scurgerea a fost detectată rapid',
          'Alarma chimică a funcționat corect',
          'Tipul substanței a fost comunicat clar',
          'Serviciile de urgență au fost contactate prompt',
          'Planul de urgență chimică a fost activat',
        ],
        maxScore: 20,
      },
      {
        category: 'Izolare și protecție',
        criteria: [
          'Zona a fost izolată imediat',
          'Ventilatia a fost închisă/ajustată corect',
          'Accesul neautorizat a fost restricționat',
          'Echipamentul de protecție a fost folosit corect',
        ],
        maxScore: 20,
      },
      {
        category: 'Procesul de evacuare',
        criteria: [
          'Evacuarea a fost rapidă și ordonată',
          'Direcția vântului a fost luată în considerare',
          'Contactul cu substanța a fost evitat',
          'Căile de evacuare secundare au fost folosite',
          'Persoanele expuse au primit asistență',
        ],
        maxScore: 20,
      },
      {
        category: 'Intervenție și decontaminare',
        criteria: [
          'Primul ajutor a fost acordat prompt',
          'Procedurile de decontaminare au fost aplicate',
          'Echipamentul CBRN a fost disponibil și funcțional',
          'Măsurătorile calității aerului au fost efectuate',
        ],
        maxScore: 20,
      },
      {
        category: 'Pregătire și documentație',
        criteria: [
          'Fișele de siguranță erau accesibile',
          'Echipa știa procedurile specifice',
          'Echipamentul de protecție era disponibil',
          'Planul de urgență era actualizat',
        ],
        maxScore: 20,
      },
    ],
    reportTemplate: {
      sections: [
        {
          title: 'Informații generale',
          fields: [
            'Data și ora exercițiului',
            'Durata totală',
            'Scenariul simulat (tip substanță)',
            'Locație scurgere simulată',
            'Cantitate estimată',
            'Condiții meteorologice (vânt, temperatură)',
            'Număr total participanți',
          ],
        },
        {
          title: 'Desfășurare exercițiu',
          fields: [
            'Ora detectare scurgere',
            'Ora activare alarmă chimică',
            'Ora izolare zonă',
            'Ora început evacuare',
            'Ora evacuare completă',
            'Timpul total de evacuare (minute)',
            'Număr persoane "expuse"',
            'Proceduri decontaminare aplicate',
            'Probleme întâmpinate',
          ],
        },
        {
          title: 'Evaluare performanță',
          fields: [
            'Scor detectare și alertare',
            'Scor izolare și protecție',
            'Scor proces evacuare',
            'Scor intervenție și decontaminare',
            'Scor pregătire și documentație',
            'Scor total (max 100)',
          ],
        },
        {
          title: 'Analiza riscului chimic',
          fields: [
            'Substanțe chimice periculoase din unitate',
            'Cantități stocate',
            'Măsuri de prevenire existente',
            'Eficiența sistemelor de detectare',
            'Necesități îmbunătățire infrastructură',
          ],
        },
        {
          title: 'Observații și recomandări',
          fields: [
            'Aspecte pozitive',
            'Deficiențe identificate',
            'Măsuri corective necesare',
            'Recomandări echipament suplimentar',
            'Nevoi instruire specifică',
            'Actualizări necesare plan urgență',
            'Termen implementare măsuri',
            'Responsabil implementare',
          ],
        },
        {
          title: 'Concluzii',
          fields: [
            'Rezultat general (reușit/parțial reușit/nereușit)',
            'Conformitate cu reglementări',
            'Data următorului exercițiu',
            'Semnătură responsabil SSM',
            'Semnătură responsabil mediu',
            'Semnătură director',
          ],
        },
      ],
    },
  },
];

/**
 * Obține un scenariu după ID
 */
export function getScenarioById(id: string): EvacuationScenario | undefined {
  return evacuationScenarios.find((scenario) => scenario.id === id);
}

/**
 * Obține toate scenariile disponibile
 */
export function getAllScenarios(): EvacuationScenario[] {
  return evacuationScenarios;
}

/**
 * Calculează scorul total pe baza criteriilor de evaluare
 */
export function calculateTotalScore(
  scenario: EvacuationScenario,
  scores: { category: string; score: number }[]
): {
  totalScore: number;
  maxScore: number;
  percentage: number;
  result: 'excelent' | 'bun' | 'satisfăcător' | 'nesatisfăcător';
} {
  const maxScore = scenario.evaluationCriteria.reduce((sum, criteria) => sum + criteria.maxScore, 0);
  const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
  const percentage = (totalScore / maxScore) * 100;

  let result: 'excelent' | 'bun' | 'satisfăcător' | 'nesatisfăcător';
  if (percentage >= 90) result = 'excelent';
  else if (percentage >= 75) result = 'bun';
  else if (percentage >= 60) result = 'satisfăcător';
  else result = 'nesatisfăcător';

  return { totalScore, maxScore, percentage, result };
}
