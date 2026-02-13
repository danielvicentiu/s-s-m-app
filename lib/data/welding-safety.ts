/**
 * Welding Safety Data
 * Cerințe de securitate pentru operațiuni de sudură
 * Tipuri: MMA, MIG, MAG, TIG, Oxiacetilenica
 */

export type WeldingType =
  | 'MMA'  // Manual Metal Arc (electrozi înveliți)
  | 'MIG'  // Metal Inert Gas
  | 'MAG'  // Metal Active Gas
  | 'TIG'  // Tungsten Inert Gas
  | 'OXIACETILENICA'; // Sudură cu gaz

export interface WeldingPPE {
  type: WeldingType;
  requiredEquipment: string[];
  specifications: string[];
}

export interface VentilationRequirement {
  type: WeldingType;
  minAirFlow: string; // m³/h
  localExtraction: boolean;
  generalVentilation: boolean;
  specificRequirements: string[];
}

export interface WeldingRisk {
  category: 'fum' | 'radiatii' | 'electric' | 'incendiu' | 'explozie' | 'ergonomic';
  description: string;
  severity: 'scazut' | 'mediu' | 'ridicat';
  affectedTypes: WeldingType[];
}

export interface PreventiveMeasure {
  type: WeldingType;
  measures: string[];
  technicalControls: string[];
  organizationalControls: string[];
}

export interface ISCIRAuthorization {
  name: string;
  code: string;
  requiredFor: WeldingType[];
  validityYears: number;
  requirements: string[];
}

// EIP specific per tip de sudură
export const weldingPPE: WeldingPPE[] = [
  {
    type: 'MMA',
    requiredEquipment: [
      'Mască de sudură cu filtru automat DIN 9-13',
      'Mănuși de sudor din piele (min. 35 cm lungime)',
      'Șorț de sudor din piele',
      'Bocanci de protecție S3 cu bombeu metalic',
      'Jachetă de sudor ignifugă',
      'Pantalon de sudor ignifug',
      'Apărători pentru urechi (min. SNR 25 dB)',
      'Mască de protecție respiratorie FFP2/FFP3'
    ],
    specifications: [
      'Filtru optic variabil 9-13 conform EN 379',
      'Mănuși conform EN 12477 Tip A',
      'Îmbrăcăminte conform EN ISO 11611 Clasa 2',
      'Protecție respiratorie conform EN 149'
    ]
  },
  {
    type: 'MIG',
    requiredEquipment: [
      'Mască de sudură cu filtru automat DIN 10-13',
      'Mănuși de sudor din piele (min. 30 cm)',
      'Șorț de sudor din piele',
      'Bocanci S3 cu protecție electrică',
      'Jachetă ignifugă cu mâneci lungi',
      'Apărători pentru urechi',
      'Protecție respiratorie FFP3 cu supapă'
    ],
    specifications: [
      'Filtru optic 10-13 pentru MIG conform EN 379',
      'Mănuși flexibile pentru manipulare pistol',
      'Îmbrăcăminte antistatică EN 1149',
      'Protecție împotriva metalelor topite EN ISO 11611'
    ]
  },
  {
    type: 'MAG',
    requiredEquipment: [
      'Mască de sudură cu filtru automat DIN 10-14',
      'Mănuși de sudor rezistente termic',
      'Șorț integral de sudor',
      'Bocanci S3 antistatici',
      'Costum complet de sudor ignifug',
      'Căști de protecție fonică',
      'Semimască cu filtre P3'
    ],
    specifications: [
      'Filtru optic 11-14 pentru intensitate mare',
      'Rezistență termică mănuși min. 100°C',
      'Îmbrăcăminte Clasa 2 conform EN ISO 11611',
      'Filtre P3 pentru fum metalic'
    ]
  },
  {
    type: 'TIG',
    requiredEquipment: [
      'Mască de sudură cu filtru DIN 8-12',
      'Mănuși TIG subțiri și flexibile',
      'Șorț de sudor',
      'Bocanci S3',
      'Jachetă de sudor cu mâneci lungi',
      'Protecție respiratorie FFP2',
      'Ochelari de protecție sub mască'
    ],
    specifications: [
      'Filtru optic 9-12 pentru TIG (curent mic)',
      'Mănuși din piele fină pentru precizie',
      'Ventilație obligatorie (fum toxic de la wolfram)',
      'Protecție UV/IR conform EN 170'
    ]
  },
  {
    type: 'OXIACETILENICA',
    requiredEquipment: [
      'Ochelari de sudor cu filtru DIN 4-6',
      'Mănuși de sudor din piele',
      'Șorț de piele',
      'Bocanci S3',
      'Jachetă ignifugă',
      'Apărători faciali pentru tăiere',
      'Îmbrăcăminte fără grăsimi/uleiuri'
    ],
    specifications: [
      'Ochelari cu filtru 5-6 pentru flacără oxiacetilenica',
      'Îmbrăcăminte curată (risc explozie cu O2)',
      'Interdicție uleiuri/grăsimi pe echipament',
      'Conformitate EN 166 pentru ochelari'
    ]
  }
];

// Cerințe de ventilație per tip de sudură
export const ventilationRequirements: VentilationRequirement[] = [
  {
    type: 'MMA',
    minAirFlow: '1000 m³/h',
    localExtraction: true,
    generalVentilation: true,
    specificRequirements: [
      'Captare la sursă a fumului de sudare (max 30 cm de arc)',
      'Debit minim 1000 m³/h pentru spații închise',
      'Verificare compoziție aer: CO < 50 ppm, NO₂ < 5 ppm',
      'Schimbare completă aer la 15 minute',
      'Sistem de aspirație mobil pentru electrozi bazici/rutili',
      'Monitorizare permanentă O₂ > 19.5%'
    ]
  },
  {
    type: 'MIG',
    minAirFlow: '1500 m³/h',
    localExtraction: true,
    generalVentilation: true,
    specificRequirements: [
      'Aspirație locală obligatorie (captare 90% fum)',
      'Debit minim 1500 m³/h (volum mare de fum)',
      'Ventilație generală suplimentară pentru CO₂',
      'Detector de gaz CO₂ ambiental',
      'Captare la max 20 cm de pistol',
      'Verificare zilnică funcționare sistem aspirație'
    ]
  },
  {
    type: 'MAG',
    minAirFlow: '1500 m³/h',
    localExtraction: true,
    generalVentilation: true,
    specificRequirements: [
      'Aspirație locală cu debit ridicat (fum intens)',
      'Ventilație generală min 1500 m³/h',
      'Monitorizare CO și CO₂ continuu',
      'Sistem redundant de ventilație pentru spații închise',
      'Captare fumului la sursă obligatorie',
      'Interzis în spații fără ventilație mecanică'
    ]
  },
  {
    type: 'TIG',
    minAirFlow: '800 m³/h',
    localExtraction: true,
    generalVentilation: false,
    specificRequirements: [
      'Aspirație locală obligatorie (fum toxic de wolfram)',
      'Debit minim 800 m³/h',
      'Atenție: fum conține oxizi de wolfram (toxic)',
      'Ventilație locală chiar și pentru volume mici',
      'Gaz de protecție Argon — monitorizare O₂',
      'Verificare concentrație particule toriu radioactiv (electrozi vechi)'
    ]
  },
  {
    type: 'OXIACETILENICA',
    minAirFlow: '600 m³/h',
    localExtraction: false,
    generalVentilation: true,
    specificRequirements: [
      'Ventilație naturală suficientă pentru exterior',
      'Interior: ventilație generală min 600 m³/h',
      'Detectoare O₂ și gaze combustibile obligatorii',
      'Depozitare butelii în spațiu ventilat separat',
      'Interdicție sudură în spații închise fără ventilație',
      'Verificare scurgeri de gaz zilnic'
    ]
  }
];

// Autorizări ISCIR pentru sudori
export const iscirAuthorizations: ISCIRAuthorization[] = [
  {
    name: 'Autorizație sudor ISCIR',
    code: 'ISCIR-RSV',
    requiredFor: ['MMA', 'MIG', 'MAG', 'TIG', 'OXIACETILENICA'],
    validityYears: 2,
    requirements: [
      'Curs calificare sudor acreditat (min. 150 ore)',
      'Examen teoretic ISCIR',
      'Examen practic ISCIR (probe de sudură)',
      'Control nedistructiv (radiografie/ultrasunete)',
      'Certificat medical aptitudine',
      'Reînnoire la 2 ani cu examen practic',
      'Specificare procedee autorizate (ex: 111-MMA, 135-MAG, 141-TIG)'
    ]
  },
  {
    name: 'Autorizație instalații sub presiune',
    code: 'ISCIR-ISP',
    requiredFor: ['MMA', 'TIG'],
    validityYears: 5,
    requirements: [
      'Pentru sudură recipiente/conducte sub presiune',
      'Autorizație ISCIR sudor de bază',
      'Examen suplimentar ISP',
      'Calificare conform SR EN ISO 9606-1',
      'Verificări periodice calitate sudură'
    ]
  },
  {
    name: 'Permis de lucru cu foc',
    code: 'PERMIT-FOC',
    requiredFor: ['MMA', 'MIG', 'MAG', 'TIG', 'OXIACETILENICA'],
    validityYears: 0, // Zilnic
    requirements: [
      'Emitere zilnică pentru zone ATEX/explozive',
      'Verificare absență atmosferă explozivă',
      'Stingătoare disponibile (min. 2 x 6 kg ABC)',
      'Supraveghere permanentă zona lucru',
      'Verificare post-lucru (min. 60 minute)',
      'Semnătură responsabil SSM și executant'
    ]
  }
];

// Riscuri specifice sudură
export const weldingRisks: WeldingRisk[] = [
  {
    category: 'fum',
    description: 'Inhalare fum metalic (Fe, Mn, Cr, Ni) — risc pneumoconioză, cancer pulmonar',
    severity: 'ridicat',
    affectedTypes: ['MMA', 'MIG', 'MAG', 'TIG']
  },
  {
    category: 'fum',
    description: 'Expunere oxizi de azot (NO, NO₂) — iritație căi respiratorii, edem pulmonar',
    severity: 'ridicat',
    affectedTypes: ['MMA', 'MAG']
  },
  {
    category: 'fum',
    description: 'Oxizi de wolfram și toriu radioactiv (electrozi TIG vechi) — risc cancerian',
    severity: 'ridicat',
    affectedTypes: ['TIG']
  },
  {
    category: 'radiatii',
    description: 'Radiații UV (200-400 nm) — conjunctivită, keratită ("ochi de sudor")',
    severity: 'ridicat',
    affectedTypes: ['MMA', 'MIG', 'MAG', 'TIG']
  },
  {
    category: 'radiatii',
    description: 'Radiații IR (infraroșu) — cataractă, leziuni retină',
    severity: 'mediu',
    affectedTypes: ['MMA', 'MIG', 'MAG', 'TIG', 'OXIACETILENICA']
  },
  {
    category: 'radiatii',
    description: 'Lumină intensă arc electric — orbire temporară, arsuri retină',
    severity: 'ridicat',
    affectedTypes: ['MMA', 'MIG', 'MAG', 'TIG']
  },
  {
    category: 'electric',
    description: 'Electrocutare (tensiune 40-90V sudură) — risc letal în mediu umed',
    severity: 'ridicat',
    affectedTypes: ['MMA', 'MIG', 'MAG', 'TIG']
  },
  {
    category: 'electric',
    description: 'Contact indirect cu masă defectă — electrocutare prin înveliș',
    severity: 'ridicat',
    affectedTypes: ['MMA', 'MIG', 'MAG', 'TIG']
  },
  {
    category: 'incendiu',
    description: 'Aprindere materiale combustibile prin stropi de metal topit',
    severity: 'ridicat',
    affectedTypes: ['MMA', 'MIG', 'MAG', 'TIG', 'OXIACETILENICA']
  },
  {
    category: 'incendiu',
    description: 'Aprindere haine de lucru (fibre sintetice interzise)',
    severity: 'mediu',
    affectedTypes: ['MMA', 'MIG', 'MAG', 'OXIACETILENICA']
  },
  {
    category: 'explozie',
    description: 'Explozie butelii acetileną (presiune, șoc, căldură)',
    severity: 'ridicat',
    affectedTypes: ['OXIACETILENICA']
  },
  {
    category: 'explozie',
    description: 'Amestec exploziv O₂/acetilenă (scurgeri, proporție 1:2.5)',
    severity: 'ridicat',
    affectedTypes: ['OXIACETILENICA']
  },
  {
    category: 'explozie',
    description: 'Sudură recipiente care au conținut inflamabile (vapori reziduali)',
    severity: 'ridicat',
    affectedTypes: ['MMA', 'MIG', 'MAG', 'TIG', 'OXIACETILENICA']
  },
  {
    category: 'ergonomic',
    description: 'Poziții forțate (sudură deasupra capului, genunchi) — TMS',
    severity: 'mediu',
    affectedTypes: ['MMA', 'MIG', 'MAG', 'TIG', 'OXIACETILENICA']
  },
  {
    category: 'ergonomic',
    description: 'Vibrații mână-braț (șlefuire post-sudură) — sindrom Raynaud',
    severity: 'mediu',
    affectedTypes: ['MMA', 'MIG', 'MAG']
  }
];

// Măsuri preventive specifice per tip de sudură
export const preventiveMeasures: PreventiveMeasure[] = [
  {
    type: 'MMA',
    measures: [
      'EIP complet: mască sudură DIN 9-13, mănuși piele 35 cm, șorț, bocanci S3',
      'Aspirație locală la max 30 cm de arc electric',
      'Verificare zilnică izolație cabluri și clemă masă',
      'Interzis sudură pe timp ploios sau pe suprafețe umede',
      'Utilizare electrozi uscați (depozitare etuvă 70-150°C)',
      'Ecrane de protecție pentru personal adiacent (protecție UV)',
      'Verificare înaintea lucrului: mască de sudură, filtru optic, mănuși'
    ],
    technicalControls: [
      'Sudură cu invertor modern (protecție la scurtcircuit)',
      'Sistem de aspirație mobil cu debit min 1000 m³/h',
      'Cabină de sudură cu pereți anti-radiație',
      'Dispozitiv de blocare la suprasarcină',
      'Prize cu DDR 30 mA pentru echipament',
      'Verificare electrică RSVTI anuală'
    ],
    organizationalControls: [
      'Instruire SSM specifică sudură (8 ore inițial)',
      'Permis de lucru cu foc pentru zone ATEX',
      'Control medical periodic (6 luni: spirometrie, Rx pulmonar)',
      'Pauze tehnice la 2 ore (10 min ventilație)',
      'Rotație sudori pe procedee diferite',
      'Interzis fumat în zona de sudură (30 m rază)'
    ]
  },
  {
    type: 'MIG',
    measures: [
      'EIP: mască DIN 10-13, mănuși flexibile, protecție respiratorie FFP3',
      'Aspirație obligatorie (captare 90% fum)',
      'Verificare zilnică pistol MIG (izolare, funcționare duză)',
      'Butelie CO₂/Ar securizată vertical cu lanț',
      'Verificare scurgeri gaz cu apă săpunită',
      'Utilizare furtun gaz conform (presiune max specificată)',
      'Curățare regulată duză gaz (prevenire scurtcircuit)'
    ],
    technicalControls: [
      'Aparat MIG cu debitmetru și reductor presiune',
      'Aspirație locală cu braț articulat',
      'Detector de gaz CO₂ cu alarmă',
      'Ventilație generală min 1500 m³/h',
      'Întrerupător de urgență pe post sudură',
      'Cabină sudură MIG cu evacuare dedicată'
    ],
    organizationalControls: [
      'Autorizare ISCIR sudor procedeu 131 (MIG)',
      'Verificare zilnică echipament înainte de pornire',
      'Interzis acces persoane neautorizate în rază 5 m',
      'Stingătoare CO₂ 5 kg la max 10 m distanță',
      'Supraveghere post-sudură min 60 min',
      'Evidență consumabile (sârmă, gaz protecție)'
    ]
  },
  {
    type: 'MAG',
    measures: [
      'EIP integral: mască DIN 10-14, costum sudor complet, FFP3 cu supapă',
      'Aspirație cu debit ridicat (fum intens)',
      'Verificare pistol și cabluri zilnic',
      'Protecție fonică (nivelul de zgomot > 85 dB)',
      'Utilizare gaz protecție conform (CO₂ sau amestecuri)',
      'Curățare zilnică duză și verificare contact electric',
      'Poziționare corectă butelie gaz (verticală, asigurată)'
    ],
    technicalControls: [
      'Post MAG cu control digital parametri',
      'Sistem aspirație centralizat cu filtre HEPA',
      'Ventilație generală 1500 m³/h minimum',
      'Monitorizare continuă CO, CO₂, O₂',
      'Protecție acustică cabină (izolare fonică)',
      'Prize DDR 30 mA pentru toate echipamentele'
    ],
    organizationalControls: [
      'Autorizare ISCIR sudor procedeu 135/136 (MAG)',
      'Permis de lucru cu foc zilnic',
      'Control medical periodicitate redusă (4 luni: audio, pulmonar)',
      'Instruire risc fum metalic și NOx',
      'Schimburi max 6 ore efective sudură/zi',
      'Monitorizare expunere fum (dozimetrie personală)'
    ]
  },
  {
    type: 'TIG',
    measures: [
      'EIP: mască DIN 8-12, mănuși TIG flexibile, FFP2 minimum (risc wolfram)',
      'Aspirație obligatorie chiar și pentru volum mic',
      'Verificare electrod wolfram (uzură, contaminare)',
      'Utilizare electrozi wolfram moderni (fără toriu radioactiv)',
      'Verificare izolație torță TIG',
      'Gaz protecție Argon pur (99.99%) — butelie cu reductor',
      'Protecție UV obligatorie (radiație intensă chiar la curent mic)'
    ],
    technicalControls: [
      'Post TIG AC/DC cu HF start (high frequency)',
      'Aspirație locală cu braț flexibil la 20 cm',
      'Ventilație min 800 m³/h',
      'Detector O₂ pentru spații închise (risc Argon)',
      'Filtru optic automat 9-12 cu reglare fină',
      'Verificare lipsa interferențe HF cu alte echipamente'
    ],
    organizationalControls: [
      'Autorizare ISCIR sudor procedeu 141 (TIG)',
      'Instruire risc oxizi wolfram și argon (asfixiere)',
      'Utilizare exclusiv electrozi wolfram ceriat/lantan (NU toriu)',
      'Control medical standard (12 luni)',
      'Verificare calitate sudură (aspect, radiografie)',
      'Depozitare Argon în spațiu ventilat'
    ]
  },
  {
    type: 'OXIACETILENICA',
    measures: [
      'EIP: ochelari DIN 5-6, mănuși piele, îmbrăcăminte fără ulei/grăsime',
      'Verificare zilnică: furtunuri, reductoare, supape, arzător',
      'Butelii asigurate vertical cu lanț (Nu culcat!)',
      'Aprindere arzător: ÎNTÂI acetilenă, apoi oxigen',
      'Stingere arzător: ÎNTÂI oxigen, apoi acetilenă',
      'Interdicție absolută uleiuri pe echipament (risc explozie cu O₂)',
      'Verificare scurgeri cu apă săpunită (NU flacără!)'
    ],
    technicalControls: [
      'Reductoare presiune pentru O₂ și C₂H₂',
      'Supape anti-retur pe furtunuri',
      'Furtunuri codificate culoare (roșu=acetilenă, albastru=O₂)',
      'Depozitare butelii în spațiu ventilat, răcoros, departe de surse căldură',
      'Detectoare de gaz (O₂, C₂H₂) cu alarmă',
      'Stingătoare ABC 6 kg la max 5 m distanță (min. 2 buc)'
    ],
    organizationalControls: [
      'Autorizare ISCIR sudor procedeu 311 (oxigaz)',
      'Instruire risc explozie (prioritate maximă)',
      'Permis de lucru cu foc obligatoriu',
      'Interzis sudură recipiente care au conținut inflamabile fără curățare',
      'Verificare post-sudură min 90 min (risc incendiu întârziat)',
      'Interzis fumat în rază 50 m de butelii',
      'Verificare ISCIR butelii (5 ani valabilitate)',
      'Curs prim ajutor pentru arsuri termice și chimice'
    ]
  }
];

// Export all pentru utilizare în alte module
export const weldingSafetyData = {
  weldingPPE,
  ventilationRequirements,
  iscirAuthorizations,
  weldingRisks,
  preventiveMeasures
};
