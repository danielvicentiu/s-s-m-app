/**
 * Template-uri pentru exerciții de evacuare
 * Scenarii pre-configurate pentru diferite tipuri de situații de urgență
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
  name: string;
  description: string;
  type: 'incendiu' | 'cutremur' | 'scurgere_toxice';
  phases: EvacuationPhase[];
  totalDurationMinutes: number;
  minimumParticipants: number;
  recommendedParticipants: number;
  requiredEquipment: string[];
  optionalEquipment: string[];
  evaluationCriteria: {
    category: string;
    criteria: string[];
    maxPoints: number;
  }[];
  reportTemplate: {
    sections: {
      title: string;
      fields: string[];
    }[];
  };
}

export const evacuationScenarios: EvacuationScenario[] = [
  // SCENARIU 1: INCENDIU
  {
    id: 'incendiu-birou',
    name: 'Incendiu la etaj - Evacuare clădire birouri',
    description: 'Simulare incendiu la etajul 2, cu evacuare completă a clădirii și verificare proceduri de urgență',
    type: 'incendiu',
    totalDurationMinutes: 45,
    minimumParticipants: 10,
    recommendedParticipants: 25,
    phases: [
      {
        id: 'pregatire',
        name: 'Pregătire și briefing',
        description: 'Instruirea participanților și verificarea echipamentelor',
        durationMinutes: 10,
        tasks: [
          'Verificarea echipamentelor de urgență',
          'Briefing echipă de intervenție',
          'Instruirea observatorilor',
          'Verificarea ieșirilor de urgență',
          'Testarea sistemului de alarmă'
        ],
        responsibleRoles: ['Responsabil SSM', 'Responsabil PSI', 'Coordonator evacuare']
      },
      {
        id: 'declansare',
        name: 'Declanșare alarmă',
        description: 'Activarea alarmei de incendiu și inițierea evacuării',
        durationMinutes: 2,
        tasks: [
          'Declanșare alarmă incendiu',
          'Anunț prin sistem sonor',
          'Notificare echipe de intervenție',
          'Activare protocol evacuare'
        ],
        responsibleRoles: ['Responsabil PSI', 'Operator alarmare']
      },
      {
        id: 'evacuare',
        name: 'Evacuare angajați',
        description: 'Evacuarea organizată a tuturor angajaților către punctele de adunare',
        durationMinutes: 15,
        tasks: [
          'Evacuare ordонată pe trasee stabilite',
          'Asistență persoane cu mobilitate redusă',
          'Închidere uși și ferestre',
          'Verificare birouri goale',
          'Dirijare flux persoane către ieșiri'
        ],
        responsibleRoles: ['Responsabili etaj', 'Pichete incendiu', 'Voluntari primă intervenție']
      },
      {
        id: 'numarare',
        name: 'Numărare și raportare',
        description: 'Verificarea prezenței și raportarea către coordonator',
        durationMinutes: 8,
        tasks: [
          'Numărare angajați la punctul de adunare',
          'Verificare liste prezență',
          'Identificare persoane lipsă',
          'Raportare către coordonator',
          'Evaluare necesitate căutare-salvare'
        ],
        responsibleRoles: ['Responsabili departamente', 'Coordonator evacuare']
      },
      {
        id: 'debriefing',
        name: 'Debriefing și evaluare',
        description: 'Analiza exercițiului și identificarea punctelor slabe',
        durationMinutes: 10,
        tasks: [
          'Feedback de la observatori',
          'Discuții cu participanții',
          'Notare aspecte pozitive',
          'Identificare probleme',
          'Planificare acțiuni corective'
        ],
        responsibleRoles: ['Responsabil SSM', 'Coordonator evacuare', 'Observatori']
      }
    ],
    requiredEquipment: [
      'Sistem alarmă incendiu funcțional',
      'Semnalizare ieșiri urgență',
      'Veste reflectorizante pentru coordonatori',
      'Liste prezență angajați',
      'Cronometru',
      'Portavoce / megafon',
      'Trusă prim ajutor'
    ],
    optionalEquipment: [
      'Stingătoare portabile (pentru demonstrații)',
      'Fum artificial (generator fum)',
      'Camere video pentru înregistrare',
      'Walkie-talkie pentru coordonare',
      'Benzi delimitare zone',
      'Pancarte informative'
    ],
    evaluationCriteria: [
      {
        category: 'Timp de reacție',
        criteria: [
          'Timp de la alarmă până la începerea evacuării < 30 secunde',
          'Evacuare completă < 5 minute',
          'Raportare finală < 8 minute de la alarmă'
        ],
        maxPoints: 30
      },
      {
        category: 'Comportament angajați',
        criteria: [
          'Calm și ordine pe traseele de evacuare',
          'Respectarea instrucțiunilor responsabililor',
          'Oprirea activităților și închidere echipamente',
          'Ajutor reciproc între colegi',
          'Fără reîntoarcere în clădire'
        ],
        maxPoints: 25
      },
      {
        category: 'Coordonare și comunicare',
        criteria: [
          'Claritate mesaje alarmare',
          'Coordonare eficientă responsabili',
          'Comunicare clară cu participanții',
          'Raportare corectă și la timp',
          'Gestionarea situațiilor neprevăzute'
        ],
        maxPoints: 25
      },
      {
        category: 'Aspecte tehnice',
        criteria: [
          'Funcționare corectă sistem alarmă',
          'Vizibilitate și accesibilitate ieșiri',
          'Semnalizare adecvată',
          'Echipamente disponibile și verificate',
          'Trasee evacuare libere de obstacole'
        ],
        maxPoints: 20
      }
    ],
    reportTemplate: {
      sections: [
        {
          title: 'Date generale exercițiu',
          fields: [
            'Data și ora desfășurării',
            'Locație',
            'Scenariu simulat',
            'Durată totală exercițiu',
            'Coordonator exercițiu',
            'Observatori desemnați'
          ]
        },
        {
          title: 'Participanți',
          fields: [
            'Număr total angajați prezenți în clădire',
            'Număr participanți evacuați',
            'Persoane cu mobilitate redusă',
            'Responsabili etaje / departamente',
            'Membri echipă intervenție',
            'Lista persoane lipsă (dacă e cazul)'
          ]
        },
        {
          title: 'Desfășurare cronologică',
          fields: [
            'Ora declanșare alarmă',
            'Ora început evacuare efectivă',
            'Ora finalizare evacuare',
            'Ora raportare completă',
            'Timpul total de evacuare',
            'Incidente în timpul exercițiului'
          ]
        },
        {
          title: 'Evaluare performanță',
          fields: [
            'Punctaj timp de reacție',
            'Punctaj comportament angajați',
            'Punctaj coordonare și comunicare',
            'Punctaj aspecte tehnice',
            'Punctaj total',
            'Calificativ general'
          ]
        },
        {
          title: 'Aspecte pozitive',
          fields: [
            'Puncte forte identificate',
            'Proceduri respectate corect',
            'Exemple bune practici',
            'Angajați remarcați pozitiv'
          ]
        },
        {
          title: 'Deficiențe și non-conformități',
          fields: [
            'Probleme majore identificate',
            'Proceduri nerespectate',
            'Echipamente defecte sau lipsă',
            'Comportamente neadecvate',
            'Riscuri de siguranță observate'
          ]
        },
        {
          title: 'Acțiuni corective',
          fields: [
            'Măsuri imediate necesare',
            'Acțiuni pe termen scurt (1-4 săptămâni)',
            'Acțiuni pe termen mediu (1-3 luni)',
            'Responsabili implementare',
            'Termene limită',
            'Data următorului exercițiu'
          ]
        },
        {
          title: 'Concluzii și recomandări',
          fields: [
            'Concluzii generale',
            'Recomandări îmbunătățire proceduri',
            'Propuneri instruire suplimentară',
            'Observații finale'
          ]
        }
      ]
    }
  },

  // SCENARIU 2: CUTREMUR
  {
    id: 'cutremur-major',
    name: 'Cutremur major - Proceduri protecție și evacuare',
    description: 'Simulare cutremur de intensitate mare cu protecție la fața locului și evacuare ulterioară',
    type: 'cutremur',
    totalDurationMinutes: 40,
    minimumParticipants: 15,
    recommendedParticipants: 30,
    phases: [
      {
        id: 'pregatire',
        name: 'Pregătire și instruire',
        description: 'Instruirea participanților privind comportamentul la cutremur',
        durationMinutes: 10,
        tasks: [
          'Instruire procedură "Picior-Cap-Ține"',
          'Identificare zone sigure în birouri',
          'Verificare trasee evacuare',
          'Briefing echipă observatori',
          'Testare sistem comunicare'
        ],
        responsibleRoles: ['Responsabil SSM', 'Coordonator evacuare', 'Formatori']
      },
      {
        id: 'alarma-cutremur',
        name: 'Simulare cutremur',
        description: 'Declanșare alarmă și aplicare procedură de protecție',
        durationMinutes: 3,
        tasks: [
          'Declanșare alarmă cutremur',
          'Anunț "CUTREMUR - PROTECȚIE!"',
          'Aplicare "Picior-Cap-Ține"',
          'Protecție sub birouri/table',
          'Menținere poziție protecție 60 secunde'
        ],
        responsibleRoles: ['Operator alarmare', 'Responsabili etaje']
      },
      {
        id: 'evaluare-initiala',
        name: 'Evaluare post-cutremur',
        description: 'Verificarea stării clădirii și a persoanelor înainte de evacuare',
        durationMinutes: 5,
        tasks: [
          'Verificare stare structură clădire',
          'Identificare persoane rănite',
          'Verificare blocaje ieșiri',
          'Evaluare siguranță trasee evacuare',
          'Decizie evacuare sau rămânere'
        ],
        responsibleRoles: ['Responsabil SSM', 'Responsabil clădire', 'Pichete verificare']
      },
      {
        id: 'evacuare',
        name: 'Evacuare organizată',
        description: 'Evacuarea angajaților pe trasee verificate ca sigure',
        durationMinutes: 12,
        tasks: [
          'Anunț "EVACUARE ORDONATĂ"',
          'Evacuare FĂRĂ fugă sau panică',
          'Evitare ascensoare',
          'Atenție la replici seismice',
          'Îndepărtare de clădire minim 50m',
          'Adunare la puncte siguranță'
        ],
        responsibleRoles: ['Coordonator evacuare', 'Responsabili etaje', 'Ghizi evacuare']
      },
      {
        id: 'verificare-raportare',
        name: 'Verificare și raportare',
        description: 'Numărare participanți și raportare situație',
        durationMinutes: 7,
        tasks: [
          'Numărare angajați la puncte adunare',
          'Verificare liste prezență',
          'Raportare persoane lipsă',
          'Raportare persoane rănite',
          'Comunicare cu servicii urgență (simulat)'
        ],
        responsibleRoles: ['Responsabili departamente', 'Coordonator general']
      },
      {
        id: 'debriefing',
        name: 'Debriefing',
        description: 'Analiza exercițiului și feedback',
        durationMinutes: 3,
        tasks: [
          'Evaluare aplicare proceduri',
          'Feedback participanți',
          'Identificare probleme',
          'Notare lecții învățate',
          'Planificare măsuri corective'
        ],
        responsibleRoles: ['Responsabil SSM', 'Coordonator', 'Observatori']
      }
    ],
    requiredEquipment: [
      'Sistem alarmare cutremur (sau difuzoare)',
      'Semnalizare ieșiri urgență',
      'Veste reflectorizante coordonatori',
      'Liste prezență',
      'Cronometru',
      'Truse medicale',
      'Walkie-talkie / sistem comunicare'
    ],
    optionalEquipment: [
      'Panouri informative "Picior-Cap-Ține"',
      'Indicatoare zone sigure în birouri',
      'Căști protecție (demonstrații)',
      'Camere video documentare',
      'Lanterne portabile',
      'Benzi delimitare zone periculoase'
    ],
    evaluationCriteria: [
      {
        category: 'Aplicare procedură protecție',
        criteria: [
          'Reacție imediată la alarmă < 10 secunde',
          'Aplicare corectă "Picior-Cap-Ține"',
          'Poziționare sub mese/birouri solide',
          'Menținere protecție timp reglementar',
          'Calm și absență panică'
        ],
        maxPoints: 35
      },
      {
        category: 'Evacuare post-cutremur',
        criteria: [
          'Așteptare instructiuni evacuare',
          'Mișcare ordonată, fără alergare',
          'Evitare ascensoare',
          'Păstrare distanță față de clădire',
          'Atenție la eventuale replici'
        ],
        maxPoints: 25
      },
      {
        category: 'Coordonare și decizie',
        criteria: [
          'Evaluare rapidă siguranță clădire',
          'Decizie corectă evacuare/rămânere',
          'Comunicare clară instrucțiuni',
          'Gestionare situații speciale',
          'Raportare completă și precisă'
        ],
        maxPoints: 25
      },
      {
        category: 'Cunoaștere proceduri',
        criteria: [
          'Cunoaștere zone sigure în birouri',
          'Cunoaștere trasee evacuare',
          'Conștientizare riscuri specifice',
          'Comportament adecvat situației',
          'Aplicare lecții din instruiri'
        ],
        maxPoints: 15
      }
    ],
    reportTemplate: {
      sections: [
        {
          title: 'Date generale exercițiu',
          fields: [
            'Data și ora desfășurării',
            'Locație',
            'Scenariu simulat (magnitudine estimată)',
            'Durată totală exercițiu',
            'Coordonator exercițiu',
            'Echipă observatori'
          ]
        },
        {
          title: 'Participanți',
          fields: [
            'Număr total angajați prezenți',
            'Număr participanți activi',
            'Repartizare pe etaje/zone',
            'Persoane cu nevoi speciale',
            'Responsabili desemnați'
          ]
        },
        {
          title: 'Cronologie exercițiu',
          fields: [
            'Ora simulare cutremur',
            'Timp reacție mediu angajați',
            'Durată fază protecție',
            'Ora începere evacuare',
            'Ora finalizare evacuare',
            'Timpul total până la raportare completă'
          ]
        },
        {
          title: 'Aplicare proceduri protecție',
          fields: [
            'Procent aplicare corectă "Picior-Cap-Ține"',
            'Zone sigure utilizate',
            'Comportamente greșite observate',
            'Reacții de panică (dacă există)',
            'Conformitate cu instruirile'
          ]
        },
        {
          title: 'Desfășurare evacuare',
          fields: [
            'Evaluare siguranță clădire',
            'Decizie evacuare - motivare',
            'Trasee utilizate',
            'Incidente în timpul evacuării',
            'Timp mediu evacuare/persoană',
            'Adunare la puncte siguranță'
          ]
        },
        {
          title: 'Evaluare performanță',
          fields: [
            'Punctaj aplicare procedură protecție',
            'Punctaj evacuare post-cutremur',
            'Punctaj coordonare și decizie',
            'Punctaj cunoaștere proceduri',
            'Punctaj total',
            'Calificativ general'
          ]
        },
        {
          title: 'Aspecte pozitive',
          fields: [
            'Proceduri aplicate corect',
            'Reacții prompte și adecvate',
            'Exemple bune practici',
            'Coordonare eficientă'
          ]
        },
        {
          title: 'Deficiențe identificate',
          fields: [
            'Proceduri neaplicate sau greșit aplicate',
            'Comportamente periculoase',
            'Lipsuri echipamente/semnalizare',
            'Probleme comunicare',
            'Zone neconforme'
          ]
        },
        {
          title: 'Acțiuni corective',
          fields: [
            'Instruiri suplimentare necesare',
            'Îmbunătățiri infrastructură',
            'Actualizare proceduri',
            'Responsabili și termene',
            'Data următorului exercițiu'
          ]
        },
        {
          title: 'Concluzii',
          fields: [
            'Evaluare grad pregătire general',
            'Recomandări principale',
            'Observații finale'
          ]
        }
      ]
    }
  },

  // SCENARIU 3: SCURGERE SUBSTANȚE TOXICE
  {
    id: 'scurgere-toxice',
    name: 'Scurgere substanțe chimice toxice - Evacuare și izolare zonă',
    description: 'Simulare scurgere substanță chimică periculoasă cu evacuare selectivă și proceduri de siguranță',
    type: 'scurgere_toxice',
    totalDurationMinutes: 50,
    minimumParticipants: 12,
    recommendedParticipants: 20,
    phases: [
      {
        id: 'pregatire',
        name: 'Pregătire și instruire',
        description: 'Instruirea echipelor și pregătirea echipamentelor de protecție',
        durationMinutes: 12,
        tasks: [
          'Instruire identificare substanțe periculoase',
          'Prezentare EPI (echipamente protecție)',
          'Instruire proceduri evacuare zonă contaminată',
          'Briefing echipă intervenție chimică',
          'Verificare kit urgență chimică',
          'Testare sistem alarmare'
        ],
        responsibleRoles: ['Responsabil SSM', 'Responsabil substanțe periculoase', 'Medic întreprindere']
      },
      {
        id: 'detectare',
        name: 'Detectare și alarmare',
        description: 'Descoperirea scurgerii și declanșarea alarmei',
        durationMinutes: 3,
        tasks: [
          'Descoperire scurgere (angajat/senzor)',
          'Raportare imediată la responsabil',
          'Evaluare preliminară risc',
          'Declanșare alarmă chimică',
          'Anunț tip substanță și locație',
          'Activare plan intervenție chimică'
        ],
        responsibleRoles: ['Descoperitor', 'Responsabil zonă', 'Coordonator urgență chimică']
      },
      {
        id: 'izolare',
        name: 'Izolare zonă contaminată',
        description: 'Delimitarea și izolarea zonei afectate',
        durationMinutes: 5,
        tasks: [
          'Oprire ventilatii în zona afectată',
          'Închidere uși acces zonă contaminată',
          'Delimitare perimetru siguranță',
          'Plasare semnalizare pericol',
          'Identificare persoane în zonă',
          'Evaluare direcție răspândire vapori'
        ],
        responsibleRoles: ['Echipă intervenție chimică', 'Responsabil SSM', 'Pichete izolare']
      },
      {
        id: 'evacuare-selectiva',
        name: 'Evacuare selectivă',
        description: 'Evacuarea zonelor afectate și a celor adiacente',
        durationMinutes: 15,
        tasks: [
          'Evacuare PRIORITARĂ zonă contaminată',
          'Evacuare zone adiacente (risc răspândire)',
          'Dirijare persoane contravânt',
          'Verificare rămânere persoane în zonă',
          'Evacuare la distanță siguranță (min 100m)',
          'Separare persoane potențial contaminate',
          'Stabilire zonă decontaminare'
        ],
        responsibleRoles: ['Coordonator evacuare', 'Ghizi evacuare', 'Echipă medicală']
      },
      {
        id: 'interventie',
        name: 'Intervenție și decontaminare',
        description: 'Gestionarea scurgerii și decontaminarea persoanelor expuse',
        durationMinutes: 10,
        tasks: [
          'Echipare cu EPI complet',
          'Intervenție echipă specializată (simulat)',
          'Oprire scurgere / limitare răspândire',
          'Decontaminare persoane expuse',
          'Îngrijiri medicale preliminare',
          'Evaluare necesitate transport spital'
        ],
        responsibleRoles: ['Echipă intervenție chimică (EPI)', 'Medic/Paramedic', 'Responsabil decontaminare']
      },
      {
        id: 'debriefing',
        name: 'Debriefing și raportare',
        description: 'Analiza interveneției și documentare',
        durationMinutes: 5,
        tasks: [
          'Evaluare eficiență intervenție',
          'Feedback echipe intervenție',
          'Analiza timpilor de reacție',
          'Identificare probleme procedurale',
          'Verificare completitudine documentație',
          'Planificare acțiuni corective'
        ],
        responsibleRoles: ['Responsabil SSM', 'Coordonator urgență', 'Observatori']
      }
    ],
    requiredEquipament: [
      'Sistem alarmare chimică',
      'EPI pentru substanțe chimice (combinezoane, măști, mănuși)',
      'Kit urgență chimică',
      'Benzi delimitare zonă periculoasă',
      'Pancarte avertizare substanțe toxice',
      'Fișe siguranță substanțe (MSDS)',
      'Trusă medicală extinsă',
      'Duș decontaminare (sau improvizat)',
      'Saci pentru deșeuri contaminate',
      'Walkie-talkie'
    ],
    optionalEquipment: [
      'Detectori gaze/vapori toxici',
      'Cort/zonă temporară decontaminare',
      'Aparat respirat autonom (SCBA)',
      'Absorbante chimice / neutralizatori',
      'Camere video documentare',
      'Lanterne ATEX (atmosfere explozive)',
      'Stretcher / targă',
      'Pături termice'
    ],
    evaluationCriteria: [
      {
        category: 'Detectare și alertare',
        criteria: [
          'Detectare rapidă a scurgerii',
          'Raportare imediată la responsabili',
          'Identificare corectă tip substanță',
          'Alarmare promptă și clară',
          'Activare plan intervenție < 2 minute'
        ],
        maxPoints: 20
      },
      {
        category: 'Izolare și limitare risc',
        criteria: [
          'Delimitare corectă zonă contaminată',
          'Măsuri oprire răspândire eficiente',
          'Semnalizare adecvată pericol',
          'Evaluare corectă direcție răspândire',
          'Protecție zone adiacente'
        ],
        maxPoints: 25
      },
      {
        category: 'Evacuare și protecție persoane',
        criteria: [
          'Prioritizare corectă evacuare',
          'Direcție evacuare contravânt',
          'Identificare persoane expuse',
          'Separare persoane contaminate',
          'Asigurare distanță siguranță'
        ],
        maxPoints: 30
      },
      {
        category: 'Intervenție și decontaminare',
        criteria: [
          'Utilizare corectă EPI',
          'Proceduri decontaminare aplicate',
          'Intervenție echipă specializată organizată',
          'Îngrijiri medicale adecvate',
          'Gestionare deșeuri contaminate'
        ],
        maxPoints: 25
      }
    ],
    reportTemplate: {
      sections: [
        {
          title: 'Date generale exercițiu',
          fields: [
            'Data și ora desfășurării',
            'Locație scurgere simulată',
            'Tip substanță chimică simulată',
            'Cantitate estimată scurgere',
            'Coordonator exercițiu',
            'Echipă observatori'
          ]
        },
        {
          title: 'Participanți și echipe',
          fields: [
            'Număr total angajați în zonă',
            'Membri echipă intervenție chimică',
            'Personal medical implicat',
            'Responsabili evacuare',
            'Persoane "contaminate" (simulat)',
            'Observatori externi'
          ]
        },
        {
          title: 'Cronologie intervenție',
          fields: [
            'Ora simulare scurgere',
            'Ora detectare',
            'Ora alarmare',
            'Ora început izolare zonă',
            'Ora început evacuare',
            'Ora finalizare evacuare',
            'Ora început decontaminare',
            'Timpul total intervenție'
          ]
        },
        {
          title: 'Desfășurare detectare și alertare',
          fields: [
            'Mod detectare scurgere',
            'Timp până la raportare',
            'Identificare corectă substanță',
            'Claritate mesaje alarmare',
            'Activare proceduri urgență'
          ]
        },
        {
          title: 'Izolare și limitare răspândire',
          fields: [
            'Măsuri izolare aplicate',
            'Dimensiune perimetru siguranță',
            'Eficiență oprire ventilatii',
            'Semnalizare zonă periculoasă',
            'Evaluare direcție vânt/răspândire'
          ]
        },
        {
          title: 'Evacuare zone afectate',
          fields: [
            'Zone evacuate',
            'Număr persoane evacuate',
            'Direcție evacuare (contravânt?)',
            'Timp mediu evacuare',
            'Persoane "expuse" identificate',
            'Incidente în timpul evacuării'
          ]
        },
        {
          title: 'Intervenție și decontaminare',
          fields: [
            'EPI utilizate de echipa intervenție',
            'Proceduri intervenție aplicate',
            'Persoane decontaminate',
            'Proceduri decontaminare folosite',
            'Îngrijiri medicale acordate',
            'Gestionare materiale contaminate'
          ]
        },
        {
          title: 'Evaluare performanță',
          fields: [
            'Punctaj detectare și alertare',
            'Punctaj izolare și limitare risc',
            'Punctaj evacuare și protecție persoane',
            'Punctaj intervenție și decontaminare',
            'Punctaj total',
            'Calificativ general'
          ]
        },
        {
          title: 'Aspecte pozitive',
          fields: [
            'Proceduri executate corect',
            'Reacții rapide și adecvate',
            'Coordonare eficientă echipe',
            'Exemple bune practici',
            'Utilizare corectă EPI'
          ]
        },
        {
          title: 'Deficiențe și riscuri',
          fields: [
            'Proceduri neaplicate sau greșit aplicate',
            'Întârzieri în intervenție',
            'Lipsuri echipamente',
            'Erori de comunicare',
            'Riscuri de siguranță observate',
            'Probleme EPI sau decontaminare'
          ]
        },
        {
          title: 'Acțiuni corective',
          fields: [
            'Instruiri suplimentare necesare',
            'Achiziții echipamente lipsă',
            'Actualizări proceduri',
            'Îmbunătățiri infrastructură',
            'Responsabili și termene implementare',
            'Data următorului exercițiu'
          ]
        },
        {
          title: 'Concluzii și recomandări',
          fields: [
            'Evaluare grad pregătire urgențe chimice',
            'Conformitate cu legislația SSM/PSI',
            'Recomandări prioritare',
            'Plan îmbunătățire continuă',
            'Observații finale'
          ]
        }
      ]
    }
  }
];

/**
 * Funcție helper pentru a obține un scenariu după ID
 */
export function getScenarioById(id: string): EvacuationScenario | undefined {
  return evacuationScenarios.find(scenario => scenario.id === id);
}

/**
 * Funcție helper pentru a obține scenarii după tip
 */
export function getScenariosByType(type: EvacuationScenario['type']): EvacuationScenario[] {
  return evacuationScenarios.filter(scenario => scenario.type === type);
}

/**
 * Funcție helper pentru a calcula durata totală din faze
 */
export function calculateTotalDuration(phases: EvacuationPhase[]): number {
  return phases.reduce((total, phase) => total + phase.durationMinutes, 0);
}

/**
 * Funcție helper pentru a genera raport gol bazat pe template
 */
export function generateEmptyReport(scenarioId: string): Record<string, any> {
  const scenario = getScenarioById(scenarioId);
  if (!scenario) return {};

  const report: Record<string, any> = {};

  scenario.reportTemplate.sections.forEach(section => {
    report[section.title] = {};
    section.fields.forEach(field => {
      report[section.title][field] = '';
    });
  });

  return report;
}
