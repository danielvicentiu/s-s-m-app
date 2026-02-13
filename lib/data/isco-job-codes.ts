/**
 * ISCO-08 / COR Job Codes Database
 *
 * Coduri ocupații conform clasificării internaționale ISCO-08
 * și COR (Clasificarea Ocupațiilor din România)
 *
 * Surse: ISCO-08 (ILO), COR v2 (MMPS România)
 */

export type RiskCategory = 'low' | 'medium' | 'high';

export interface IscoJobCode {
  code: string; // 6 cifre ISCO-08
  titleRO: string;
  titleEN: string;
  riskCategory: RiskCategory;
  typicalRisks: string[];
  requiredTrainingTypes: string[];
  description?: string;
}

export const iscoJobCodes: IscoJobCode[] = [
  // MUNCITORI NECALIFICAȚI
  {
    code: '931101',
    titleRO: 'Muncitor necalificat în construcții',
    titleEN: 'General construction labourer',
    riskCategory: 'high',
    typicalRisks: [
      'Căderi de la înălțime',
      'Loviri de obiecte',
      'Suprasolicitare fizică',
      'Expunere la intemperii',
      'Accidente cu utilaje'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Lucru la înălțime',
      'Utilizare echipamente protecție',
      'Prim ajutor'
    ]
  },
  {
    code: '932901',
    titleRO: 'Muncitor necalificat la ambalare',
    titleEN: 'Hand packer',
    riskCategory: 'low',
    typicalRisks: [
      'Suprasolicitare fizică',
      'Mișcări repetitive',
      'Zgomot'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Manipulare manuală',
      'Ergonomie'
    ]
  },
  {
    code: '962101',
    titleRO: 'Muncitor necalificat în agricultură',
    titleEN: 'Field crop farm labourer',
    riskCategory: 'medium',
    typicalRisks: [
      'Expunere substanțe chimice',
      'Accidente cu unelte',
      'Expunere la intemperii',
      'Suprasolicitare fizică'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Manipulare pesticide',
      'Utilizare echipamente agricole'
    ]
  },

  // ȘOFERI ȘI OPERATORI TRANSPORT
  {
    code: '833201',
    titleRO: 'Șofer autocamion',
    titleEN: 'Heavy truck driver',
    riskCategory: 'high',
    typicalRisks: [
      'Accidente rutiere',
      'Oboseală',
      'Stres',
      'Probleme musculo-scheletice',
      'Expunere vibrații'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Conducere defensivă',
      'ADR (mărfuri periculoase)',
      'Prim ajutor',
      'Prevenirea oboselii'
    ]
  },
  {
    code: '832201',
    titleRO: 'Șofer autoturism taxi',
    titleEN: 'Taxi driver',
    riskCategory: 'medium',
    typicalRisks: [
      'Accidente rutiere',
      'Agresiuni',
      'Stres',
      'Probleme posturale'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Conducere defensivă',
      'Gestionare situații conflictuale'
    ]
  },
  {
    code: '833101',
    titleRO: 'Șofer autobuz',
    titleEN: 'Bus driver',
    riskCategory: 'high',
    typicalRisks: [
      'Accidente rutiere',
      'Stres',
      'Oboseală',
      'Probleme musculo-scheletice',
      'Agresiuni pasageri'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Conducere defensivă',
      'Transport persoane',
      'Prim ajutor',
      'Evacuare pasageri'
    ]
  },
  {
    code: '834401',
    titleRO: 'Operator stivuitor',
    titleEN: 'Forklift operator',
    riskCategory: 'high',
    typicalRisks: [
      'Răsturnare stivuitor',
      'Loviri/striviri',
      'Căderi de sarcini',
      'Coliziuni',
      'Expunere zgomot'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Autorizare stivuitor',
      'Manipulare sarcini',
      'Semnalizare mărfuri periculoase'
    ]
  },

  // SUDORI ȘI TÂMPLARI METALE
  {
    code: '721101',
    titleRO: 'Sudor',
    titleEN: 'Welder',
    riskCategory: 'high',
    typicalRisks: [
      'Arsuri',
      'Expunere fum metalic',
      'Electrocutare',
      'Radiații UV',
      'Incendii/explozii',
      'Leziuni oculare'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Autorizare sudor',
      'Lucru în spații confinate',
      'Prevenire incendii',
      'Prim ajutor',
      'Utilizare echipamente protecție'
    ]
  },
  {
    code: '721201',
    titleRO: 'Tăietor cu flacără',
    titleEN: 'Flame cutter',
    riskCategory: 'high',
    typicalRisks: [
      'Arsuri',
      'Incendii/explozii',
      'Expunere fum',
      'Electrocutare',
      'Radiații UV'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Autorizare tăiere',
      'Prevenire incendii',
      'Lucru cu gaze comprimate'
    ]
  },

  // ELECTRICIENI
  {
    code: '741101',
    titleRO: 'Electrician construcții',
    titleEN: 'Building electrician',
    riskCategory: 'high',
    typicalRisks: [
      'Electrocutare',
      'Arsuri electrice',
      'Căderi de la înălțime',
      'Incendii',
      'Explozie arc electric'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Autorizare electrician',
      'Lucru în înaltă tensiune',
      'Lucru la înălțime',
      'Prim ajutor',
      'PSI'
    ]
  },
  {
    code: '741201',
    titleRO: 'Electrician întreținere',
    titleEN: 'Electrical maintenance worker',
    riskCategory: 'high',
    typicalRisks: [
      'Electrocutare',
      'Arsuri',
      'Explozie arc electric',
      'Lucru în spații confinate'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Autorizare electrician',
      'LOTO (Lockout/Tagout)',
      'Lucru în spații confinate'
    ]
  },

  // CONSTRUCTORI
  {
    code: '711101',
    titleRO: 'Zidar',
    titleEN: 'Bricklayer',
    riskCategory: 'high',
    typicalRisks: [
      'Căderi de la înălțime',
      'Loviri de obiecte',
      'Suprasolicitare fizică',
      'Expunere pulberi',
      'Leziuni musculo-scheletice'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Lucru la înălțime',
      'Utilizare schelă',
      'Ergonomie',
      'Prim ajutor'
    ]
  },
  {
    code: '711201',
    titleRO: 'Tencuitor',
    titleEN: 'Plasterer',
    riskCategory: 'medium',
    typicalRisks: [
      'Căderi de la înălțime',
      'Expunere substanțe chimice',
      'Suprasolicitare fizică',
      'Probleme respiratorii'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Lucru la înălțime',
      'Manipulare substanțe chimice'
    ]
  },
  {
    code: '711301',
    titleRO: 'Dulgher',
    titleEN: 'Carpenter',
    riskCategory: 'high',
    typicalRisks: [
      'Tăieri',
      'Căderi de la înălțime',
      'Loviri cu unelte',
      'Expunere zgomot',
      'Expunere pulberi lemn'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Lucru la înălțime',
      'Utilizare scule electrice',
      'Prim ajutor'
    ]
  },
  {
    code: '712101',
    titleRO: 'Acoperitor',
    titleEN: 'Roofer',
    riskCategory: 'high',
    typicalRisks: [
      'Căderi de la înălțime',
      'Arsuri (bitum)',
      'Expunere intemperii',
      'Electrocutare (furtuni)'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Lucru la înălțime',
      'Utilizare EIP anticădere',
      'Prevenire incendii'
    ]
  },

  // OSPĂTARI ȘI BUCĂTARI
  {
    code: '512101',
    titleRO: 'Bucătar',
    titleEN: 'Cook',
    riskCategory: 'medium',
    typicalRisks: [
      'Arsuri',
      'Tăieri',
      'Alunecări',
      'Stres termic',
      'Expunere fum/aburi'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'HACCP',
      'Prevenire incendii',
      'Prim ajutor',
      'Manipulare alimente'
    ]
  },
  {
    code: '513101',
    titleRO: 'Ospătar',
    titleEN: 'Waiter',
    riskCategory: 'low',
    typicalRisks: [
      'Alunecări',
      'Arsuri (suprafețe fierbinți)',
      'Suprasolicitare',
      'Agresiuni clienți'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'HACCP',
      'Manipulare alimente',
      'Gestionare situații conflictuale'
    ]
  },
  {
    code: '514101',
    titleRO: 'Barman',
    titleEN: 'Bartender',
    riskCategory: 'low',
    typicalRisks: [
      'Tăieri (sticlă)',
      'Arsuri',
      'Alunecări',
      'Agresiuni'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'HACCP',
      'Manipulare alimente',
      'Gestionare situații conflictuale'
    ]
  },

  // CURĂȚENIE ȘI ÎNTREȚINERE
  {
    code: '911201',
    titleRO: 'Îngrijitor clădiri',
    titleEN: 'Cleaner',
    riskCategory: 'medium',
    typicalRisks: [
      'Expunere substanțe chimice',
      'Alunecări',
      'Suprasolicitare fizică',
      'Probleme respiratorii'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Manipulare substanțe chimice',
      'Utilizare echipamente protecție',
      'COSHH (dacă aplicabil)'
    ]
  },
  {
    code: '512201',
    titleRO: 'Ajutor bucătar',
    titleEN: 'Kitchen helper',
    riskCategory: 'medium',
    typicalRisks: [
      'Tăieri',
      'Arsuri',
      'Alunecări',
      'Suprasolicitare'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'HACCP',
      'Manipulare alimente'
    ]
  },

  // OPERATORI PRODUCȚIE
  {
    code: '817101',
    titleRO: 'Operator mașini prelucrare lemn',
    titleEN: 'Wood processing machine operator',
    riskCategory: 'high',
    typicalRisks: [
      'Tăieri',
      'Prinderi în mașini',
      'Expunere zgomot',
      'Expunere pulberi lemn',
      'Proiectare obiecte'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Utilizare mașini prelucrare lemn',
      'LOTO',
      'Prim ajutor',
      'Utilizare echipamente protecție'
    ]
  },
  {
    code: '721301',
    titleRO: 'Lăcătuș mecanic',
    titleEN: 'Metalworking mechanic',
    riskCategory: 'high',
    typicalRisks: [
      'Tăieri',
      'Prinderi în mașini',
      'Loviri',
      'Expunere zgomot',
      'Expunere uleiuri/fluide'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Utilizare mașini-unelte',
      'LOTO',
      'Prim ajutor'
    ]
  },
  {
    code: '818101',
    titleRO: 'Operator linie de asamblare',
    titleEN: 'Assembly line operator',
    riskCategory: 'medium',
    typicalRisks: [
      'Mișcări repetitive',
      'Suprasolicitare',
      'Zgomot',
      'Stres'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Ergonomie',
      'Utilizare echipamente specifice'
    ]
  },

  // DEPOZITARE ȘI LOGISTICĂ
  {
    code: '432201',
    titleRO: 'Gestionar depozit',
    titleEN: 'Warehouse manager',
    riskCategory: 'medium',
    typicalRisks: [
      'Loviri de obiecte',
      'Căderi de sarcini',
      'Accidente cu stivuitoare',
      'Suprasolicitare'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Manipulare manuală',
      'Securitate depozit',
      'Semnalizare mărfuri periculoase'
    ]
  },
  {
    code: '933301',
    titleRO: 'Manipulant mărfuri',
    titleEN: 'Freight handler',
    riskCategory: 'high',
    typicalRisks: [
      'Suprasolicitare fizică',
      'Loviri/striviri',
      'Căderi de sarcini',
      'Probleme musculo-scheletice'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Manipulare manuală',
      'Ergonomie',
      'Utilizare echipamente încărcare'
    ]
  },

  // MECANICI ȘI REPARATORI
  {
    code: '723101',
    titleRO: 'Mecanic auto',
    titleEN: 'Motor vehicle mechanic',
    riskCategory: 'high',
    typicalRisks: [
      'Arsuri',
      'Tăieri',
      'Expunere substanțe chimice',
      'Prinderi',
      'Căderi vehicule pe rampe',
      'Electrocutare (auto electrice)'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Lucru cu substanțe periculoase',
      'LOTO',
      'Prim ajutor',
      'Înaltă tensiune (vehicule electrice)'
    ]
  },
  {
    code: '723201',
    titleRO: 'Mecanic utilaje agricole',
    titleEN: 'Agricultural machinery mechanic',
    riskCategory: 'high',
    typicalRisks: [
      'Prinderi',
      'Loviri',
      'Expunere substanțe chimice',
      'Căderi',
      'Electrocutare'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'LOTO',
      'Lucru cu hidraulică',
      'Prim ajutor'
    ]
  },
  {
    code: '723301',
    titleRO: 'Mecanic utilaje construcții',
    titleEN: 'Construction machinery mechanic',
    riskCategory: 'high',
    typicalRisks: [
      'Prinderi',
      'Loviri',
      'Căderi',
      'Expunere substanțe chimice',
      'Electrocutare'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'LOTO',
      'Lucru cu hidraulică',
      'Prim ajutor'
    ]
  },

  // INSTALATORI
  {
    code: '712201',
    titleRO: 'Instalator',
    titleEN: 'Plumber',
    riskCategory: 'high',
    typicalRisks: [
      'Arsuri (conducte fierbinți)',
      'Expunere substanțe chimice',
      'Inundații',
      'Lucru în spații confinate',
      'Căderi'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Lucru în spații confinate',
      'Manipulare substanțe chimice',
      'Prim ajutor'
    ]
  },
  {
    code: '712301',
    titleRO: 'Instalator încălzire/climatizare',
    titleEN: 'HVAC installer',
    riskCategory: 'high',
    typicalRisks: [
      'Arsuri',
      'Expunere fluide frigorifice',
      'Electrocutare',
      'Căderi de la înălțime',
      'Lucru în spații confinate'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Manipulare fluide frigorifice',
      'Lucru la înălțime',
      'Lucru în spații confinate',
      'Autorizare climatizare'
    ]
  },

  // VÂNZĂTORI ȘI CASIERI
  {
    code: '522101',
    titleRO: 'Vânzător magazin',
    titleEN: 'Shop salesperson',
    riskCategory: 'low',
    typicalRisks: [
      'Stres',
      'Suprasolicitare (stat în picioare)',
      'Jaf/agresiuni',
      'Probleme posturale'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Gestionare situații conflictuale',
      'Ergonomie'
    ]
  },
  {
    code: '523101',
    titleRO: 'Casier',
    titleEN: 'Cashier',
    riskCategory: 'low',
    typicalRisks: [
      'Jaf',
      'Probleme posturale',
      'Stres',
      'Mișcări repetitive'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Gestionare situații de jaf',
      'Ergonomie'
    ]
  },

  // AGENȚI PAZĂ ȘI SECURITATE
  {
    code: '541101',
    titleRO: 'Agent pază',
    titleEN: 'Security guard',
    riskCategory: 'medium',
    typicalRisks: [
      'Agresiuni',
      'Stres',
      'Oboseală (ture lungi)',
      'Expunere intemperii'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Prim ajutor',
      'Gestionare situații conflictuale',
      'Prevenire incendii'
    ]
  },

  // PROGRAMATORI ȘI IT
  {
    code: '251201',
    titleRO: 'Programator',
    titleEN: 'Software developer',
    riskCategory: 'low',
    typicalRisks: [
      'Probleme posturale',
      'Oboseală vizuală',
      'Sindrom tunel carpian',
      'Stres',
      'Sedentarism'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Ergonomie birou',
      'DSE (Display Screen Equipment)',
      'Pauze active'
    ]
  },
  {
    code: '351201',
    titleRO: 'Tehnician IT',
    titleEN: 'IT technician',
    riskCategory: 'low',
    typicalRisks: [
      'Electrocutare (mică tensiune)',
      'Probleme posturale',
      'Tăieri (carcase)',
      'Expunere radiații (minim)'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Electricitate statică',
      'Ergonomie',
      'Manipulare echipamente electronice'
    ]
  },

  // PERSONAL ADMINISTRATIV
  {
    code: '411101',
    titleRO: 'Secretar general',
    titleEN: 'General secretary',
    riskCategory: 'low',
    typicalRisks: [
      'Probleme posturale',
      'Oboseală vizuală',
      'Stres',
      'Sedentarism'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Ergonomie birou',
      'DSE'
    ]
  },
  {
    code: '431101',
    titleRO: 'Contabil',
    titleEN: 'Accountant',
    riskCategory: 'low',
    typicalRisks: [
      'Probleme posturale',
      'Oboseală vizuală',
      'Stres',
      'Sedentarism'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Ergonomie birou',
      'DSE'
    ]
  },

  // PERSONAL MEDICAL
  {
    code: '222101',
    titleRO: 'Asistent medical generalist',
    titleEN: 'General nurse',
    riskCategory: 'high',
    typicalRisks: [
      'Expunere biologică',
      'Înțepături acele',
      'Suprasolicitare (manipulare pacienți)',
      'Agresiuni pacienți',
      'Stres',
      'Expunere substanțe chimice'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Biosiguranță',
      'Manipulare deșeuri medicale',
      'Prevenire infecții',
      'Manipulare pacienți',
      'Gestionare situații violente'
    ]
  },
  {
    code: '532101',
    titleRO: 'Îngrijitor persoane vârstnice',
    titleEN: 'Care worker for elderly',
    riskCategory: 'medium',
    typicalRisks: [
      'Suprasolicitare (manipulare persoane)',
      'Agresiuni',
      'Stres emoțional',
      'Expunere biologică',
      'Probleme musculo-scheletice'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Manipulare pacienți',
      'Prim ajutor',
      'Biosiguranță',
      'Gestionare situații dificile'
    ]
  },

  // OPERATORI UTILAJE GRELE
  {
    code: '834201',
    titleRO: 'Operator excavator',
    titleEN: 'Excavator operator',
    riskCategory: 'high',
    typicalRisks: [
      'Răsturnare utilaj',
      'Electrocutare (cabluri)',
      'Rupere conducte gaz',
      'Lovire persoane',
      'Expunere vibrații',
      'Zgomot'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Autorizare excavator',
      'Identificare utilități subterane',
      'Prim ajutor',
      'Semnalizare șantier'
    ]
  },
  {
    code: '834101',
    titleRO: 'Operator macara',
    titleEN: 'Crane operator',
    riskCategory: 'high',
    typicalRisks: [
      'Răsturnare macara',
      'Cădere sarcini',
      'Electrocutare (linii înaltă tensiune)',
      'Lovire/strivire persoane',
      'Rupere cabluri'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Autorizare macaragiu',
      'Semnale manevră',
      'Evaluare stabilitate teren',
      'Prim ajutor'
    ]
  },
  {
    code: '834301',
    titleRO: 'Operator buldozer',
    titleEN: 'Bulldozer operator',
    riskCategory: 'high',
    typicalRisks: [
      'Răsturnare utilaj',
      'Lovire persoane',
      'Expunere vibrații',
      'Zgomot',
      'Expunere pulberi'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Autorizare buldozer',
      'Semnalizare șantier',
      'Prim ajutor'
    ]
  },

  // PERSONAL HOTELURI
  {
    code: '515101',
    titleRO: 'Cameristă',
    titleEN: 'Hotel room attendant',
    riskCategory: 'medium',
    typicalRisks: [
      'Suprasolicitare fizică',
      'Expunere substanțe chimice',
      'Probleme musculo-scheletice',
      'Mișcări repetitive'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Manipulare substanțe chimice',
      'Ergonomie',
      'Utilizare echipamente protecție'
    ]
  },

  // FRIZERI ȘI COSMETICIENI
  {
    code: '514201',
    titleRO: 'Frizer',
    titleEN: 'Hairdresser',
    riskCategory: 'medium',
    typicalRisks: [
      'Expunere substanțe chimice',
      'Probleme posturale',
      'Alergii',
      'Tăieri',
      'Arsuri (plăci de îndreptat)'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Manipulare substanțe chimice',
      'Ergonomie',
      'Utilizare echipamente protecție'
    ]
  },
  {
    code: '514301',
    titleRO: 'Cosmetician',
    titleEN: 'Beautician',
    riskCategory: 'low',
    typicalRisks: [
      'Expunere substanțe chimice',
      'Alergii',
      'Probleme posturale',
      'Infecții (igienă)'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Manipulare substanțe chimice',
      'Igienă și sterilizare',
      'Ergonomie'
    ]
  },

  // ZUGRAV/VOPSITOR
  {
    code: '713101',
    titleRO: 'Zugrav-vopsitor',
    titleEN: 'Painter',
    riskCategory: 'high',
    typicalRisks: [
      'Expunere substanțe chimice',
      'Căderi de la înălțime',
      'Inhalare vapori toxici',
      'Iritații piele',
      'Incendii (vopsele inflamabile)'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Lucru la înălțime',
      'Manipulare substanțe chimice',
      'Utilizare echipamente protecție respiratorie',
      'Prevenire incendii'
    ]
  },

  // OPERATOR CNC
  {
    code: '817201',
    titleRO: 'Operator mașini CNC',
    titleEN: 'CNC machine operator',
    riskCategory: 'high',
    typicalRisks: [
      'Prinderi în mașini',
      'Tăieri',
      'Proiectare așchii metalice',
      'Expunere zgomot',
      'Expunere fluide de răcire'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Utilizare mașini CNC',
      'LOTO',
      'Utilizare echipamente protecție',
      'Prim ajutor'
    ]
  },

  // FARMACIST
  {
    code: '226101',
    titleRO: 'Farmacist',
    titleEN: 'Pharmacist',
    riskCategory: 'medium',
    typicalRisks: [
      'Expunere substanțe chimice',
      'Jafuri',
      'Stres',
      'Probleme posturale',
      'Expunere medicamentoasă'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Manipulare substanțe periculoase',
      'Gestionare situații de jaf',
      'Ergonomie'
    ]
  },

  // CROITOR
  {
    code: '753101',
    titleRO: 'Croitor',
    titleEN: 'Tailor',
    riskCategory: 'low',
    typicalRisks: [
      'Înțepături/tăieri',
      'Probleme posturale',
      'Oboseală vizuală',
      'Mișcări repetitive'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Utilizare mașini de cusut',
      'Ergonomie'
    ]
  },

  // PAZNIC NOAPTE
  {
    code: '541102',
    titleRO: 'Paznic nocturn',
    titleEN: 'Night security guard',
    riskCategory: 'medium',
    typicalRisks: [
      'Agresiuni',
      'Oboseală (program nocturn)',
      'Stres',
      'Risc cardiac (program nocturn)',
      'Izolare'
    ],
    requiredTrainingTypes: [
      'Instruire SSM generală',
      'Lucru în program nocturn',
      'Gestionare situații conflictuale',
      'Prim ajutor',
      'Prevenire incendii'
    ]
  }
];

/**
 * Caută un cod ISCO după număr
 */
export function findJobByCode(code: string): IscoJobCode | undefined {
  return iscoJobCodes.find(job => job.code === code);
}

/**
 * Filtrează joburi după categoria de risc
 */
export function filterByRiskCategory(category: RiskCategory): IscoJobCode[] {
  return iscoJobCodes.filter(job => job.riskCategory === category);
}

/**
 * Caută joburi după titlu (RO sau EN)
 */
export function searchJobsByTitle(query: string): IscoJobCode[] {
  const lowerQuery = query.toLowerCase();
  return iscoJobCodes.filter(
    job =>
      job.titleRO.toLowerCase().includes(lowerQuery) ||
      job.titleEN.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Grupează joburi după categoria de risc
 */
export function groupByRiskCategory(): Record<RiskCategory, IscoJobCode[]> {
  return {
    low: filterByRiskCategory('low'),
    medium: filterByRiskCategory('medium'),
    high: filterByRiskCategory('high')
  };
}

/**
 * Statistici generale
 */
export function getStatistics() {
  const grouped = groupByRiskCategory();
  return {
    total: iscoJobCodes.length,
    byRisk: {
      low: grouped.low.length,
      medium: grouped.medium.length,
      high: grouped.high.length
    }
  };
}
