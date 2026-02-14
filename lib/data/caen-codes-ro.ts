/**
 * CAEN Codes Database for SSM Risk Assessment
 * Top 50 Romanian CAEN codes with SSM-specific risk categories and requirements
 */

export interface CAENCode {
  code: string; // 4-digit CAEN code
  name: string;
  riskCategory: 'low' | 'medium' | 'high' | 'very-high';
  description: string;
  typicalHazards: string[];
  requiredTrainings: string[];
}

export const caenCodesRO: CAENCode[] = [
  // VERY HIGH RISK
  {
    code: '4120',
    name: 'Construcții de clădiri rezidențiale și nerezidenţiale',
    riskCategory: 'very-high',
    description: 'Construcții civile și industriale,lucrări de structură',
    typicalHazards: [
      'Cădere de la înălțime',
      'Prăbușire structuri',
      'Electrocutare',
      'Lovire de obiecte',
      'Zgomot și vibrații',
      'Efort fizic intens'
    ],
    requiredTrainings: [
      'SSM constructii',
      'Lucru la inaltime',
      'Prim ajutor',
      'Utilizare EPI',
      'PSI'
    ]
  },
  {
    code: '2511',
    name: 'Fabricarea de construcţii metalice şi părţi componente ale structurilor metalice',
    riskCategory: 'very-high',
    description: 'Sudură, tăiere, prelucrare metale',
    typicalHazards: [
      'Arsuri termice',
      'Electrocutare',
      'Radiatii UV',
      'Gaze toxice',
      'Zgomot intens',
      'Vibrații'
    ],
    requiredTrainings: [
      'SSM industrie',
      'Sudura securitate',
      'Utilizare echipamente',
      'Prim ajutor',
      'PSI'
    ]
  },
  {
    code: '0892',
    name: 'Extracţia turbei',
    riskCategory: 'very-high',
    description: 'Extracție minieră, excavări',
    typicalHazards: [
      'Prăbușiri teren',
      'Expunere substante chimice',
      'Utilaje grele',
      'Condiții meteo extreme',
      'Efort fizic'
    ],
    requiredTrainings: [
      'SSM miniera',
      'Excavari siguranta',
      'Utilaje grele',
      'Prim ajutor',
      'PSI'
    ]
  },
  {
    code: '3511',
    name: 'Producţia de energie electrică',
    riskCategory: 'very-high',
    description: 'Centrale electrice, producție energie',
    typicalHazards: [
      'Electrocutare',
      'Arc electric',
      'Explozie',
      'Incendiu',
      'Zgomot intens'
    ],
    requiredTrainings: [
      'SSM electroenergetica',
      'Autorizare electrician',
      'Lucru sub tensiune',
      'Prim ajutor',
      'PSI'
    ]
  },

  // HIGH RISK
  {
    code: '1071',
    name: 'Fabricarea painii; fabricarea prăjiturilor şi a produselor proaspete de patiserie',
    riskCategory: 'high',
    description: 'Panificație, brutării, patiserii',
    typicalHazards: [
      'Arsuri termice',
      'Tăieturi',
      'Efort repetitiv',
      'Căldură excesivă',
      'Alergie făină',
      'Zgomot utilaje'
    ],
    requiredTrainings: [
      'SSM industrie alimentara',
      'HACCP',
      'Utilizare echipamente',
      'Prim ajutor',
      'PSI'
    ]
  },
  {
    code: '5610',
    name: 'Restaurante',
    riskCategory: 'high',
    description: 'Servicii de alimentație publică',
    typicalHazards: [
      'Arsuri',
      'Tăieturi',
      'Alunecare',
      'Efort fizic',
      'Stres',
      'Incendiu'
    ],
    requiredTrainings: [
      'SSM HoReCa',
      'HACCP',
      'Igiena alimentara',
      'Prim ajutor',
      'PSI'
    ]
  },
  {
    code: '8610',
    name: 'Activităţi de asistenţă spitalicească',
    riskCategory: 'high',
    description: 'Spitale, clinici, unități medicale',
    typicalHazards: [
      'Risc biologic',
      'Infectii',
      'Radiatii',
      'Substante chimice',
      'Stres psihic',
      'Efort fizic'
    ],
    requiredTrainings: [
      'SSM medical',
      'Risc biologic',
      'Deseuri medicale',
      'Prim ajutor avansat',
      'PSI spitale'
    ]
  },
  {
    code: '4941',
    name: 'Transporturi rutiere de mărfuri',
    riskCategory: 'high',
    description: 'Transport marfă pe șosea',
    typicalHazards: [
      'Accidente rutiere',
      'Efort fizic',
      'Vibrații',
      'Pozitie sedentara',
      'Stres',
      'Oboseala'
    ],
    requiredTrainings: [
      'SSM transport',
      'Conduita preventiva',
      'Siguranta marfa',
      'Prim ajutor',
      'PSI auto'
    ]
  },
  {
    code: '2361',
    name: 'Fabricarea produselor din beton pentru construcţii',
    riskCategory: 'high',
    description: 'Producție prefabricate beton',
    typicalHazards: [
      'Praf silice',
      'Zgomot',
      'Vibrații',
      'Efort fizic',
      'Lovire obiecte',
      'Utilaje periculoase'
    ],
    requiredTrainings: [
      'SSM industrie',
      'Utilizare utilaje',
      'Protectie respiratorie',
      'Prim ajutor',
      'PSI'
    ]
  },
  {
    code: '2932',
    name: 'Fabricarea altor părţi şi accesorii pentru autovehicule şi pentru motoare de autovehicule',
    riskCategory: 'high',
    description: 'Industrie auto, componente',
    typicalHazards: [
      'Utilaje periculoase',
      'Substante chimice',
      'Zgomot',
      'Efort repetitiv',
      'Loviri',
      'Incendiu'
    ],
    requiredTrainings: [
      'SSM industrie',
      'Utilizare masini-unelte',
      'Substante chimice',
      'Prim ajutor',
      'PSI'
    ]
  },

  // MEDIUM RISK
  {
    code: '4711',
    name: 'Comerţ cu amănuntul în magazine nespecializate, cu vânzare predominantă de produse alimentare, băuturi şi tutun',
    riskCategory: 'medium',
    description: 'Supermarketuri, magazine alimentare',
    typicalHazards: [
      'Efort fizic',
      'Alunecare',
      'Lovire',
      'Stres',
      'Pozitie ortostatica',
      'Temperaturi scazute (depozite)'
    ],
    requiredTrainings: [
      'SSM comert',
      'Igiena alimentara',
      'Manipulare marfa',
      'Prim ajutor',
      'PSI'
    ]
  },
  {
    code: '6201',
    name: 'Activităţi de realizare a soft-ului la comandă (software orientat client)',
    riskCategory: 'medium',
    description: 'Dezvoltare software personalizat',
    typicalHazards: [
      'Efort vizual',
      'Pozitie sedentara',
      'Tulburari musculo-scheletice',
      'Stres psihic',
      'Izolare sociala'
    ],
    requiredTrainings: [
      'SSM birou',
      'Ergonomie birou',
      'Utilizare calculator',
      'Prim ajutor',
      'PSI birou'
    ]
  },
  {
    code: '4690',
    name: 'Comerţ cu ridică nespecializat',
    riskCategory: 'medium',
    description: 'Depozitare și distribuție en-gros',
    typicalHazards: [
      'Manipulare greutati',
      'Lovire obiecte',
      'Utilaje depozit',
      'Alunecare',
      'Efort fizic'
    ],
    requiredTrainings: [
      'SSM depozitare',
      'Manipulare marfa',
      'Utilaje depozit',
      'Prim ajutor',
      'PSI'
    ]
  },
  {
    code: '6920',
    name: 'Activităţi de contabilitate şi audit financiar; consultanţă în domeniul fiscal',
    riskCategory: 'medium',
    description: 'Servicii contabile și consultanță fiscală',
    typicalHazards: [
      'Efort vizual',
      'Pozitie sedentara',
      'Stres psihic',
      'Tulburari musculo-scheletice'
    ],
    requiredTrainings: [
      'SSM birou',
      'Ergonomie',
      'Utilizare calculator',
      'Prim ajutor',
      'PSI birou'
    ]
  },
  {
    code: '8559',
    name: 'Alte forme de învăţământ',
    riskCategory: 'medium',
    description: 'Școli private, cursuri, training',
    typicalHazards: [
      'Efort vocal',
      'Stres',
      'Pozitie ortostatica',
      'Efort vizual'
    ],
    requiredTrainings: [
      'SSM invatamant',
      'Prim ajutor',
      'PSI institutii',
      'Evacuare'
    ]
  },
  {
    code: '4752',
    name: 'Comerţ cu amănuntul al articolelor de feronerie, al articolelor din sticlă şi a celor pentru vopsit, în magazine specializate',
    riskCategory: 'medium',
    description: 'Magazine bricolaj, vopsele, feronerie',
    typicalHazards: [
      'Substante chimice',
      'Manipulare greutati',
      'Tăieturi',
      'Inhalare vapori',
      'Efort fizic'
    ],
    requiredTrainings: [
      'SSM comert',
      'Substante periculoase',
      'Manipulare marfa',
      'Prim ajutor',
      'PSI'
    ]
  },
  {
    code: '5221',
    name: 'Activităţi de servicii anexe pentru transporturi terestre',
    riskCategory: 'medium',
    description: 'Parcări, depouri, întreținere drumuri',
    typicalHazards: [
      'Trafic vehicule',
      'Gaze evacuare',
      'Zgomot',
      'Conditii meteo',
      'Efort fizic'
    ],
    requiredTrainings: [
      'SSM transport',
      'Siguranta rutiera',
      'Prim ajutor',
      'PSI'
    ]
  },
  {
    code: '8690',
    name: 'Alte activităţi referitoare la sănătatea umană',
    riskCategory: 'medium',
    description: 'Cabinete medicale, laboratoare analize',
    typicalHazards: [
      'Risc biologic',
      'Substante chimice',
      'Infectii',
      'Ace/instrumente ascutite',
      'Stres'
    ],
    requiredTrainings: [
      'SSM medical',
      'Risc biologic',
      'Deseuri medicale',
      'Prim ajutor',
      'PSI'
    ]
  },
  {
    code: '4520',
    name: 'Întreţinerea şi repararea autovehiculelor',
    riskCategory: 'medium',
    description: 'Service auto, vulcanizări',
    typicalHazards: [
      'Substante chimice',
      'Gaze toxice',
      'Incendiu',
      'Lovire',
      'Efort fizic',
      'Zgomot'
    ],
    requiredTrainings: [
      'SSM service auto',
      'Substante periculoase',
      'Utilaje',
      'Prim ajutor',
      'PSI'
    ]
  },
  {
    code: '4329',
    name: 'Alte lucrări de construcţii speciale',
    riskCategory: 'medium',
    description: 'Lucrări specializate construcții',
    typicalHazards: [
      'Cădere la înălțime',
      'Utilaje',
      'Electrocutare',
      'Efort fizic',
      'Zgomot'
    ],
    requiredTrainings: [
      'SSM constructii',
      'Lucru la inaltime',
      'Utilaje',
      'Prim ajutor',
      'PSI'
    ]
  },

  // LOW RISK
  {
    code: '6202',
    name: 'Activităţi de consultanţă în tehnologia informaţiei',
    riskCategory: 'low',
    description: 'Consultanță IT, analiză sisteme',
    typicalHazards: [
      'Efort vizual',
      'Pozitie sedentara',
      'Stres psihic',
      'Tulburari musculo-scheletice'
    ],
    requiredTrainings: [
      'SSM birou',
      'Ergonomie',
      'Prim ajutor',
      'PSI birou'
    ]
  },
  {
    code: '6910',
    name: 'Activităţi juridice',
    riskCategory: 'low',
    description: 'Cabinete avocatură, notariate',
    typicalHazards: [
      'Pozitie sedentara',
      'Efort vizual',
      'Stres psihic'
    ],
    requiredTrainings: [
      'SSM birou',
      'Ergonomie',
      'Prim ajutor',
      'PSI birou'
    ]
  },
  {
    code: '7022',
    name: 'Activităţi de consultanţă pentru afaceri şi management',
    riskCategory: 'low',
    description: 'Consultanță business, management',
    typicalHazards: [
      'Pozitie sedentara',
      'Efort vizual',
      'Stres psihic',
      'Deplasari frecvente'
    ],
    requiredTrainings: [
      'SSM birou',
      'Ergonomie',
      'Prim ajutor',
      'PSI birou'
    ]
  },
  {
    code: '7311',
    name: 'Activităţi ale agenţiilor de publicitate',
    riskCategory: 'low',
    description: 'Agenții de publicitate și marketing',
    typicalHazards: [
      'Pozitie sedentara',
      'Efort vizual',
      'Stres deadline-uri'
    ],
    requiredTrainings: [
      'SSM birou',
      'Ergonomie',
      'Prim ajutor',
      'PSI birou'
    ]
  },
  {
    code: '7320',
    name: 'Activităţi de studiere a pieţei şi de sondare a opiniei publice',
    riskCategory: 'low',
    description: 'Cercetare piață, sondaje',
    typicalHazards: [
      'Pozitie sedentara',
      'Efort vizual',
      'Deplasari'
    ],
    requiredTrainings: [
      'SSM birou',
      'Ergonomie',
      'Prim ajutor',
      'PSI birou'
    ]
  },
  {
    code: '6312',
    name: 'Activităţi ale portalurilor web',
    riskCategory: 'low',
    description: 'Platforme online, servicii web',
    typicalHazards: [
      'Pozitie sedentara',
      'Efort vizual',
      'Tulburari musculo-scheletice'
    ],
    requiredTrainings: [
      'SSM birou',
      'Ergonomie',
      'Prim ajutor',
      'PSI birou'
    ]
  },
  {
    code: '7410',
    name: 'Activităţi de design specializat',
    riskCategory: 'low',
    description: 'Design grafic, industrial, interior',
    typicalHazards: [
      'Pozitie sedentara',
      'Efort vizual intens',
      'Tulburari musculo-scheletice'
    ],
    requiredTrainings: [
      'SSM birou',
      'Ergonomie',
      'Prim ajutor',
      'PSI birou'
    ]
  },
  {
    code: '7490',
    name: 'Alte activităţi profesionale, ştiinţifice şi tehnice',
    riskCategory: 'low',
    description: 'Servicii profesionale diverse',
    typicalHazards: [
      'Pozitie sedentara',
      'Efort vizual',
      'Variabil functie de domeniu'
    ],
    requiredTrainings: [
      'SSM birou',
      'Ergonomie',
      'Prim ajutor',
      'PSI birou'
    ]
  },
  {
    code: '8230',
    name: 'Organizarea de convenţii şi târguri',
    riskCategory: 'low',
    description: 'Organizare evenimente, târguri',
    typicalHazards: [
      'Efort fizic moderat',
      'Stres organizational',
      'Deplasari',
      'Program prelungit'
    ],
    requiredTrainings: [
      'SSM evenimente',
      'Evacuare',
      'Prim ajutor',
      'PSI'
    ]
  },
  {
    code: '8551',
    name: 'Activităţi de educaţie în domeniul sportului şi recreaţional',
    riskCategory: 'low',
    description: 'Școli sport, training fitness',
    typicalHazards: [
      'Efort fizic',
      'Leziuni sportive',
      'Suprasolicitare'
    ],
    requiredTrainings: [
      'SSM sport',
      'Prim ajutor sportiv',
      'PSI sali sport'
    ]
  },
  {
    code: '9609',
    name: 'Alte activităţi de servicii',
    riskCategory: 'low',
    description: 'Servicii personale diverse',
    typicalHazards: [
      'Variabil functie de serviciu',
      'Efort fizic usor',
      'Contact public'
    ],
    requiredTrainings: [
      'SSM specific',
      'Prim ajutor',
      'PSI'
    ]
  },
  {
    code: '4791',
    name: 'Comerţ cu amănuntul prin intermediul caselor de comenzi sau prin Internet',
    riskCategory: 'low',
    description: 'E-commerce, vânzări online',
    typicalHazards: [
      'Pozitie sedentara',
      'Efort vizual',
      'Manipulare pachete (logistica)'
    ],
    requiredTrainings: [
      'SSM birou',
      'Manipulare pachete',
      'Prim ajutor',
      'PSI'
    ]
  },
  {
    code: '6311',
    name: 'Prelucrarea datelor, administrarea paginilor web şi activităţi conexe',
    riskCategory: 'low',
    description: 'Datacenter, hosting, administrare servere',
    typicalHazards: [
      'Pozitie sedentara',
      'Efort vizual',
      'Electrocutare (servere)',
      'Temperatura scazuta (servere)'
    ],
    requiredTrainings: [
      'SSM birou',
      'SSM datacenter',
      'Prim ajutor',
      'PSI'
    ]
  },
  {
    code: '7021',
    name: 'Activităţi de relaţii publice şi comunicare',
    riskCategory: 'low',
    description: 'PR, comunicare corporativă',
    typicalHazards: [
      'Pozitie sedentara',
      'Efort vizual',
      'Stres psihic'
    ],
    requiredTrainings: [
      'SSM birou',
      'Ergonomie',
      'Prim ajutor',
      'PSI birou'
    ]
  },
  {
    code: '7420',
    name: 'Activităţi fotografice',
    riskCategory: 'low',
    description: 'Fotografie profesională, studiouri',
    typicalHazards: [
      'Efort fizic moderat',
      'Echipamente electrice',
      'Deplasari',
      'Pozitii incomode'
    ],
    requiredTrainings: [
      'SSM specific',
      'Echipamente electrice',
      'Prim ajutor',
      'PSI'
    ]
  },
  {
    code: '8299',
    name: 'Alte activităţi de servicii de afaceri',
    riskCategory: 'low',
    description: 'Servicii business diverse',
    typicalHazards: [
      'Pozitie sedentara',
      'Efort vizual',
      'Variabil functie activitate'
    ],
    requiredTrainings: [
      'SSM birou',
      'Prim ajutor',
      'PSI birou'
    ]
  },
  {
    code: '5630',
    name: 'Baruri şi alte activităţi de servire a băuturilor',
    riskCategory: 'low',
    description: 'Baruri, cafenele, pub-uri',
    typicalHazards: [
      'Alunecare',
      'Tăieturi',
      'Efort fizic usor',
      'Pozitie ortostatica',
      'Program nocturn'
    ],
    requiredTrainings: [
      'SSM HoReCa',
      'Igiena alimentara',
      'Prim ajutor',
      'PSI'
    ]
  },
  {
    code: '9602',
    name: 'Coafură şi alte activităţi de înfrumuseţare',
    riskCategory: 'low',
    description: 'Saloane coafură, cosmetică',
    typicalHazards: [
      'Substante chimice (vopsea)',
      'Pozitie ortostatica',
      'Efort repetitiv',
      'Alergii'
    ],
    requiredTrainings: [
      'SSM salon',
      'Substante chimice',
      'Prim ajutor',
      'PSI'
    ]
  },
  {
    code: '9311',
    name: 'Activităţi ale bazelor sportive',
    riskCategory: 'low',
    description: 'Săli fitness, piscine, terenuri sport',
    typicalHazards: [
      'Alunecare',
      'Leziuni sportive',
      'Apa (inec)',
      'Echipamente sportive'
    ],
    requiredTrainings: [
      'SSM sport',
      'Salvare acvatica (piscine)',
      'Prim ajutor sportiv',
      'PSI'
    ]
  },
  {
    code: '4719',
    name: 'Alte forme de comerţ cu amănuntul în magazine nespecializate',
    riskCategory: 'low',
    description: 'Magazine diverse non-alimentare',
    typicalHazards: [
      'Manipulare marfa',
      'Efort fizic usor',
      'Pozitie ortostatica',
      'Contact clienti'
    ],
    requiredTrainings: [
      'SSM comert',
      'Manipulare marfa',
      'Prim ajutor',
      'PSI'
    ]
  },
  {
    code: '5510',
    name: 'Hoteluri şi alte facilităţi de cazare similare',
    riskCategory: 'low',
    description: 'Hoteluri, pensiuni, moteluri',
    typicalHazards: [
      'Efort fizic moderat',
      'Substante curatenie',
      'Alunecare',
      'Efort repetitiv'
    ],
    requiredTrainings: [
      'SSM HoReCa',
      'Substante curatenie',
      'Prim ajutor',
      'PSI hotel'
    ]
  },
  {
    code: '5520',
    name: 'Facilităţi de cazare pentru vacanţe şi perioade de scurtă durată',
    riskCategory: 'low',
    description: 'Vile turistice, cabane, camping',
    typicalHazards: [
      'Efort fizic',
      'Conditii meteo',
      'Izolare',
      'Animale salbatice (cabane)'
    ],
    requiredTrainings: [
      'SSM turism',
      'Prim ajutor',
      'PSI',
      'Supravietuire (optional)'
    ]
  },
  {
    code: '7911',
    name: 'Activităţile agenţiilor de turism',
    riskCategory: 'low',
    description: 'Agenții de turism, touroperatori',
    typicalHazards: [
      'Pozitie sedentara',
      'Efort vizual',
      'Stres organizational'
    ],
    requiredTrainings: [
      'SSM birou',
      'Prim ajutor',
      'PSI birou'
    ]
  },
  {
    code: '8121',
    name: 'Activităţi generale de curăţenie a clădirilor',
    riskCategory: 'low',
    description: 'Servicii curățenie profesionale',
    typicalHazards: [
      'Substante chimice',
      'Efort fizic',
      'Efort repetitiv',
      'Alunecare',
      'Alergii'
    ],
    requiredTrainings: [
      'SSM curatenie',
      'Substante chimice',
      'Utilizare echipamente',
      'Prim ajutor',
      'PSI'
    ]
  },
  {
    code: '8130',
    name: 'Activităţi de întreţinere peisagistică',
    riskCategory: 'low',
    description: 'Grădinărit, spații verzi, peisagistică',
    typicalHazards: [
      'Utilaje gradina',
      'Conditii meteo',
      'Alergii polen',
      'Insecte',
      'Efort fizic'
    ],
    requiredTrainings: [
      'SSM spatii verzi',
      'Utilaje gradina',
      'Prim ajutor',
      'PSI'
    ]
  }
];

/**
 * Helper function to get CAEN code by code string
 */
export function getCAENByCode(code: string): CAENCode | undefined {
  return caenCodesRO.find(c => c.code === code);
}

/**
 * Helper function to filter CAEN codes by risk category
 */
export function getCAENByRiskCategory(
  category: 'low' | 'medium' | 'high' | 'very-high'
): CAENCode[] {
  return caenCodesRO.filter(c => c.riskCategory === category);
}

/**
 * Helper function to search CAEN codes by name or description
 */
export function searchCAEN(query: string): CAENCode[] {
  const lowerQuery = query.toLowerCase();
  return caenCodesRO.filter(
    c =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery) ||
      c.code.includes(query)
  );
}
