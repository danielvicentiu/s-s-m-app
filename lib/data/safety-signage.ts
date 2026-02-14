/**
 * Safety Signage Database
 *
 * Indicatoare SSM/PSI obligatorii conform:
 * - SR ISO 7010 (standardul internațional pentru semne de siguranță)
 * - HG 971/2006 (privind cerințele minime pentru semnalizarea de securitate)
 */

export interface SafetySign {
  id: string;
  name: string;
  type: 'interdictie' | 'avertizare' | 'obligativitate' | 'salvare' | 'incendiu';
  shape: 'cerc' | 'triunghi' | 'patrat';
  colors: {
    background: string;
    symbol: string;
    border: string;
  };
  standard: string;
  description: string;
  placement: string;
}

export const safetySignageData: SafetySign[] = [
  // INTERDICȚIE (cerc roșu cu diagonală)
  {
    id: 'P001',
    name: 'Interzis fumatul',
    type: 'interdictie',
    shape: 'cerc',
    colors: {
      background: '#FFFFFF',
      symbol: '#000000',
      border: '#E03131',
    },
    standard: 'SR ISO 7010 P002 / HG 971/2006',
    description: 'Interzice fumatul în zonele cu risc de incendiu sau explozie',
    placement: 'Depozite, fabrici, zone cu substanțe inflamabile, spații închise',
  },
  {
    id: 'P002',
    name: 'Interzis accesul cu foc deschis',
    type: 'interdictie',
    shape: 'cerc',
    colors: {
      background: '#FFFFFF',
      symbol: '#000000',
      border: '#E03131',
    },
    standard: 'SR ISO 7010 P003 / HG 971/2006',
    description: 'Interzice utilizarea focului deschis și a surselor de aprindere',
    placement: 'Zone cu gaze inflamabile, depozite chimice, ateliere cu vapori',
  },
  {
    id: 'P003',
    name: 'Interzis accesul persoanelor neautorizate',
    type: 'interdictie',
    shape: 'cerc',
    colors: {
      background: '#FFFFFF',
      symbol: '#000000',
      border: '#E03131',
    },
    standard: 'SR ISO 7010 P006 / HG 971/2006',
    description: 'Restricționează accesul doar pentru personal autorizat',
    placement: 'Încăperi tehnice, centrale electrice, zone periculoase',
  },
  {
    id: 'P004',
    name: 'Interzis pentru pietoni',
    type: 'interdictie',
    shape: 'cerc',
    colors: {
      background: '#FFFFFF',
      symbol: '#000000',
      border: '#E03131',
    },
    standard: 'SR ISO 7010 P004 / HG 971/2006',
    description: 'Interzice accesul pietonilor în zone destinate vehiculelor',
    placement: 'Căi de circulație vehicule, rampuri, zone industriale',
  },
  {
    id: 'P005',
    name: 'Interzis să stingi cu apă',
    type: 'interdictie',
    shape: 'cerc',
    colors: {
      background: '#FFFFFF',
      symbol: '#000000',
      border: '#E03131',
    },
    standard: 'SR ISO 7010 P011 / HG 971/2006',
    description: 'Interzice folosirea apei pentru stingerea incendiilor',
    placement: 'Tablouri electrice, instalații sub tensiune, depozite uleiuri',
  },
  {
    id: 'P006',
    name: 'Nu atingeți',
    type: 'interdictie',
    shape: 'cerc',
    colors: {
      background: '#FFFFFF',
      symbol: '#000000',
      border: '#E03131',
    },
    standard: 'SR ISO 7010 P010 / HG 971/2006',
    description: 'Interzice atingerea echipamentelor sau suprafețelor periculoase',
    placement: 'Mașini în funcțiune, suprafețe fierbinți, echipamente periculoase',
  },
  {
    id: 'P007',
    name: 'Interzis vehiculelor de manevră',
    type: 'interdictie',
    shape: 'cerc',
    colors: {
      background: '#FFFFFF',
      symbol: '#000000',
      border: '#E03131',
    },
    standard: 'SR ISO 7010 P006 / HG 971/2006',
    description: 'Interzice accesul vehiculelor industriale de transport',
    placement: 'Zone pietonale, spații de lucru sensibile',
  },
  {
    id: 'P008',
    name: 'Nu porniți',
    type: 'interdictie',
    shape: 'cerc',
    colors: {
      background: '#FFFFFF',
      symbol: '#000000',
      border: '#E03131',
    },
    standard: 'SR ISO 7010 P027 / HG 971/2006',
    description: 'Interzice pornirea mașinilor sau echipamentelor în timpul mentenanței',
    placement: 'Butoane de comandă, tablouri electrice, panouri de control',
  },

  // AVERTIZARE (triunghi galben)
  {
    id: 'W001',
    name: 'Atenție, pericol general',
    type: 'avertizare',
    shape: 'triunghi',
    colors: {
      background: '#FFD43B',
      symbol: '#000000',
      border: '#000000',
    },
    standard: 'SR ISO 7010 W001 / HG 971/2006',
    description: 'Avertizează asupra unui pericol general nedeterminat',
    placement: 'Intrări în zone cu multiple riscuri, șantiere, zone de lucru',
  },
  {
    id: 'W002',
    name: 'Atenție, substanțe inflamabile',
    type: 'avertizare',
    shape: 'triunghi',
    colors: {
      background: '#FFD43B',
      symbol: '#000000',
      border: '#000000',
    },
    standard: 'SR ISO 7010 W021 / HG 971/2006',
    description: 'Avertizează despre prezența materialelor inflamabile',
    placement: 'Depozite combustibili, rezervoare GPL, ateliere vopsitorie',
  },
  {
    id: 'W003',
    name: 'Atenție, substanțe toxice',
    type: 'avertizare',
    shape: 'triunghi',
    colors: {
      background: '#FFD43B',
      symbol: '#000000',
      border: '#000000',
    },
    standard: 'SR ISO 7010 W016 / HG 971/2006',
    description: 'Semnalizează prezența substanțelor toxice sau nocive',
    placement: 'Laboratoare chimice, depozite pesticide, spații cu agenți toxici',
  },
  {
    id: 'W004',
    name: 'Atenție, substanțe corozive',
    type: 'avertizare',
    shape: 'triunghi',
    colors: {
      background: '#FFD43B',
      symbol: '#000000',
      border: '#000000',
    },
    standard: 'SR ISO 7010 W023 / HG 971/2006',
    description: 'Avertizează despre materiale corozive (acizi, baze)',
    placement: 'Depozite acizi, laboratoare, instalații de tratare chimică',
  },
  {
    id: 'W005',
    name: 'Atenție, tensiune electrică periculoasă',
    type: 'avertizare',
    shape: 'triunghi',
    colors: {
      background: '#FFD43B',
      symbol: '#000000',
      border: '#000000',
    },
    standard: 'SR ISO 7010 W012 / HG 971/2006',
    description: 'Semnalizează prezența tensiunii electrice periculoase',
    placement: 'Tablouri electrice, posturi de transformare, linii electrice',
  },
  {
    id: 'W006',
    name: 'Atenție, suprafață fierbinte',
    type: 'avertizare',
    shape: 'triunghi',
    colors: {
      background: '#FFD43B',
      symbol: '#000000',
      border: '#000000',
    },
    standard: 'SR ISO 7010 W017 / HG 971/2006',
    description: 'Avertizează despre suprafețe cu temperaturi ridicate',
    placement: 'Cuptoare, cazane, conductoare abur, echipamente termice',
  },
  {
    id: 'W007',
    name: 'Atenție, pericol de cădere de la înălțime',
    type: 'avertizare',
    shape: 'triunghi',
    colors: {
      background: '#FFD43B',
      symbol: '#000000',
      border: '#000000',
    },
    standard: 'SR ISO 7010 W008 / HG 971/2006',
    description: 'Semnalizează riscul de cădere de la diferențe de nivel',
    placement: 'Platforme înalte, scări, acoperișuri, margini de excavații',
  },
  {
    id: 'W008',
    name: 'Atenție, obstacol la sol',
    type: 'avertizare',
    shape: 'triunghi',
    colors: {
      background: '#FFD43B',
      symbol: '#000000',
      border: '#000000',
    },
    standard: 'SR ISO 7010 W007 / HG 971/2006',
    description: 'Avertizează despre obstacole la nivelul solului',
    placement: 'Zone cu denivelări, praguri, trepte, rampe',
  },
  {
    id: 'W009',
    name: 'Atenție, lovire de cap',
    type: 'avertizare',
    shape: 'triunghi',
    colors: {
      background: '#FFD43B',
      symbol: '#000000',
      border: '#000000',
    },
    standard: 'SR ISO 7010 W020 / HG 971/2006',
    description: 'Semnalizează risc de lovire a capului',
    placement: 'Zone cu grinzi joase, subsoluri, tuneluri, pasaje',
  },
  {
    id: 'W010',
    name: 'Atenție, radiații laser',
    type: 'avertizare',
    shape: 'triunghi',
    colors: {
      background: '#FFD43B',
      symbol: '#000000',
      border: '#000000',
    },
    standard: 'SR ISO 7010 W004 / HG 971/2006',
    description: 'Avertizează despre prezența radiațiilor laser',
    placement: 'Laboratoare, echipamente medicale, sisteme de măsurare laser',
  },
  {
    id: 'W011',
    name: 'Atenție, sarcini suspendate',
    type: 'avertizare',
    shape: 'triunghi',
    colors: {
      background: '#FFD43B',
      symbol: '#000000',
      border: '#000000',
    },
    standard: 'SR ISO 7010 W015 / HG 971/2006',
    description: 'Semnalizează zone cu risc de cădere a sarcinilor suspendate',
    placement: 'Zone cu macarale, poduri rulante, benzi transportoare suspendate',
  },

  // OBLIGATIVITATE (cerc albastru)
  {
    id: 'M001',
    name: 'Purtarea echipamentului de protecție a capului este obligatorie',
    type: 'obligativitate',
    shape: 'cerc',
    colors: {
      background: '#1971C2',
      symbol: '#FFFFFF',
      border: '#FFFFFF',
    },
    standard: 'SR ISO 7010 M014 / HG 971/2006',
    description: 'Obligă purtarea căștii de protecție',
    placement: 'Șantiere, zone industriale, depozite, ateliere',
  },
  {
    id: 'M002',
    name: 'Purtarea ochelarilor de protecție este obligatorie',
    type: 'obligativitate',
    shape: 'cerc',
    colors: {
      background: '#1971C2',
      symbol: '#FFFFFF',
      border: '#FFFFFF',
    },
    standard: 'SR ISO 7010 M004 / HG 971/2006',
    description: 'Obligă utilizarea ochelarilor de protecție',
    placement: 'Ateliere de prelucrare, sudură, laborator, zone cu praf',
  },
  {
    id: 'M003',
    name: 'Purtarea măștii de protecție respiratorie este obligatorie',
    type: 'obligativitate',
    shape: 'cerc',
    colors: {
      background: '#1971C2',
      symbol: '#FFFFFF',
      border: '#FFFFFF',
    },
    standard: 'SR ISO 7010 M017 / HG 971/2006',
    description: 'Obligă folosirea măștii de protecție respiratorie',
    placement: 'Zone cu praf, vapori toxici, vopsitorii, cabine sablare',
  },
  {
    id: 'M004',
    name: 'Purtarea căștilor antifonice este obligatorie',
    type: 'obligativitate',
    shape: 'cerc',
    colors: {
      background: '#1971C2',
      symbol: '#FFFFFF',
      border: '#FFFFFF',
    },
    standard: 'SR ISO 7010 M003 / HG 971/2006',
    description: 'Obligă protecția auditivă în zone cu zgomot ridicat',
    placement: 'Hale producție zgomotoasă, zone cu mașini, aeroporturi',
  },
  {
    id: 'M005',
    name: 'Purtarea mănușilor de protecție este obligatorie',
    type: 'obligativitate',
    shape: 'cerc',
    colors: {
      background: '#1971C2',
      symbol: '#FFFFFF',
      border: '#FFFFFF',
    },
    standard: 'SR ISO 7010 M009 / HG 971/2006',
    description: 'Obligă utilizarea mănușilor de protecție',
    placement: 'Manipulare substanțe chimice, lucru cu obiecte ascuțite',
  },
  {
    id: 'M006',
    name: 'Purtarea încălțămintei de protecție este obligatorie',
    type: 'obligativitate',
    shape: 'cerc',
    colors: {
      background: '#1971C2',
      symbol: '#FFFFFF',
      border: '#FFFFFF',
    },
    standard: 'SR ISO 7010 M008 / HG 971/2006',
    description: 'Obligă purtarea bocancilor de protecție cu bombeu',
    placement: 'Șantiere, depozite, zone industriale, ateliere',
  },
  {
    id: 'M007',
    name: 'Purtarea veștii reflectorizante este obligatorie',
    type: 'obligativitate',
    shape: 'cerc',
    colors: {
      background: '#1971C2',
      symbol: '#FFFFFF',
      border: '#FFFFFF',
    },
    standard: 'SR ISO 7010 M015 / HG 971/2006',
    description: 'Obligă purtarea îmbrăcămintei cu vizibilitate ridicată',
    placement: 'Șantiere, drumuri publice, depozite logistice, zone de circulație',
  },
  {
    id: 'M008',
    name: 'Purtarea șorțului de protecție este obligatorie',
    type: 'obligativitate',
    shape: 'cerc',
    colors: {
      background: '#1971C2',
      symbol: '#FFFFFF',
      border: '#FFFFFF',
    },
    standard: 'SR ISO 7010 M028 / HG 971/2006',
    description: 'Obligă purtarea șorțului de protecție împotriva substanțelor chimice',
    placement: 'Laboratoare, ateliere sudură, spații cu substanțe corozive',
  },
  {
    id: 'M009',
    name: 'Obligatoriu spălarea mâinilor',
    type: 'obligativitate',
    shape: 'cerc',
    colors: {
      background: '#1971C2',
      symbol: '#FFFFFF',
      border: '#FFFFFF',
    },
    standard: 'SR ISO 7010 M011 / HG 971/2006',
    description: 'Obligă spălarea mâinilor înainte de părăsirea zonei',
    placement: 'Ieșiri din laboratoare, zone contaminate, spații alimentare',
  },
  {
    id: 'M010',
    name: 'Obligatoriu deconectarea la sursa de energie',
    type: 'obligativitate',
    shape: 'cerc',
    colors: {
      background: '#1971C2',
      symbol: '#FFFFFF',
      border: '#FFFFFF',
    },
    standard: 'SR ISO 7010 M006 / HG 971/2006',
    description: 'Obligă deconectarea echipamentului înainte de intervenție',
    placement: 'Tablouri electrice, mașini industriale, echipamente de producție',
  },

  // SALVARE ȘI EVACUARE (pătrat verde)
  {
    id: 'E001',
    name: 'Ieșire de urgență (stânga)',
    type: 'salvare',
    shape: 'patrat',
    colors: {
      background: '#2F9E44',
      symbol: '#FFFFFF',
      border: '#FFFFFF',
    },
    standard: 'SR ISO 7010 E001 / HG 971/2006',
    description: 'Indică direcția spre ieșirea de urgență spre stânga',
    placement: 'Coridoare, holuri, spații publice, zone de lucru',
  },
  {
    id: 'E002',
    name: 'Ieșire de urgență (dreapta)',
    type: 'salvare',
    shape: 'patrat',
    colors: {
      background: '#2F9E44',
      symbol: '#FFFFFF',
      border: '#FFFFFF',
    },
    standard: 'SR ISO 7010 E002 / HG 971/2006',
    description: 'Indică direcția spre ieșirea de urgență spre dreapta',
    placement: 'Coridoare, holuri, spații publice, zone de lucru',
  },
  {
    id: 'E003',
    name: 'Punct de întâlnire în caz de urgență',
    type: 'salvare',
    shape: 'patrat',
    colors: {
      background: '#2F9E44',
      symbol: '#FFFFFF',
      border: '#FFFFFF',
    },
    standard: 'SR ISO 7010 E007 / HG 971/2006',
    description: 'Indică locul de adunare după evacuare',
    placement: 'Curte, parcare, zonă sigură din exterior',
  },
  {
    id: 'E004',
    name: 'Trusă de prim ajutor',
    type: 'salvare',
    shape: 'patrat',
    colors: {
      background: '#2F9E44',
      symbol: '#FFFFFF',
      border: '#FFFFFF',
    },
    standard: 'SR ISO 7010 E003 / HG 971/2006',
    description: 'Indică locația trusei de prim ajutor',
    placement: 'Birouri, ateliere, holuri, recepții, zone de lucru',
  },
  {
    id: 'E005',
    name: 'Duș de siguranță',
    type: 'salvare',
    shape: 'patrat',
    colors: {
      background: '#2F9E44',
      symbol: '#FFFFFF',
      border: '#FFFFFF',
    },
    standard: 'SR ISO 7010 E004 / HG 971/2006',
    description: 'Indică locația dușului de urgență',
    placement: 'Laboratoare chimice, fabrici, zone cu substanțe periculoase',
  },
  {
    id: 'E006',
    name: 'Duș pentru spălarea ochilor',
    type: 'salvare',
    shape: 'patrat',
    colors: {
      background: '#2F9E44',
      symbol: '#FFFFFF',
      border: '#FFFFFF',
    },
    standard: 'SR ISO 7010 E005 / HG 971/2006',
    description: 'Indică locația dușului pentru spălarea ochilor',
    placement: 'Laboratoare, zone cu chimicale, ateliere industriale',
  },
  {
    id: 'E007',
    name: 'Telefon de urgență',
    type: 'salvare',
    shape: 'patrat',
    colors: {
      background: '#2F9E44',
      symbol: '#FFFFFF',
      border: '#FFFFFF',
    },
    standard: 'SR ISO 7010 E006 / HG 971/2006',
    description: 'Indică locația telefonului de urgență',
    placement: 'Holuri, recepții, zone izolate, secții industriale',
  },

  // INCENDIU (pătrat roșu)
  {
    id: 'F001',
    name: 'Stingător de incendiu',
    type: 'incendiu',
    shape: 'patrat',
    colors: {
      background: '#E03131',
      symbol: '#FFFFFF',
      border: '#FFFFFF',
    },
    standard: 'SR ISO 7010 F001 / HG 971/2006',
    description: 'Indică locația stingătorului de incendiu',
    placement: 'Coridoare, holuri, birouri, ateliere (conform HG 1492/2004)',
  },
  {
    id: 'F002',
    name: 'Hidrant de incendiu',
    type: 'incendiu',
    shape: 'patrat',
    colors: {
      background: '#E03131',
      symbol: '#FFFFFF',
      border: '#FFFFFF',
    },
    standard: 'SR ISO 7010 F002 / HG 971/2006',
    description: 'Indică locația hidrantului interior de incendiu',
    placement: 'Coridoare principale, holuri, scări, zone strategice',
  },
  {
    id: 'F003',
    name: 'Furtun de incendiu',
    type: 'incendiu',
    shape: 'patrat',
    colors: {
      background: '#E03131',
      symbol: '#FFFFFF',
      border: '#FFFFFF',
    },
    standard: 'SR ISO 7010 F003 / HG 971/2006',
    description: 'Indică locația furtunului de incendiu',
    placement: 'Coridoare, holuri mari, zone industriale',
  },
  {
    id: 'F004',
    name: 'Scară de salvare',
    type: 'incendiu',
    shape: 'patrat',
    colors: {
      background: '#E03131',
      symbol: '#FFFFFF',
      border: '#FFFFFF',
    },
    standard: 'SR ISO 7010 F009 / HG 971/2006',
    description: 'Indică locația scării de urgență/salvare',
    placement: 'Clădiri cu etaje, platforme înalte, zone cu risc ridicat',
  },
  {
    id: 'F005',
    name: 'Buton de alarmă incendiu',
    type: 'incendiu',
    shape: 'patrat',
    colors: {
      background: '#E03131',
      symbol: '#FFFFFF',
      border: '#FFFFFF',
    },
    standard: 'SR ISO 7010 F005 / HG 971/2006',
    description: 'Indică locația butonului de alarmă la incendiu',
    placement: 'Holuri principale, coridoare, ieșiri, zone frecventate',
  },
];

/**
 * Utility functions pentru filtrare și căutare
 */
export const getSignsByType = (type: SafetySign['type']): SafetySign[] => {
  return safetySignageData.filter((sign) => sign.type === type);
};

export const getSignById = (id: string): SafetySign | undefined => {
  return safetySignageData.find((sign) => sign.id === id);
};

export const searchSigns = (query: string): SafetySign[] => {
  const lowerQuery = query.toLowerCase();
  return safetySignageData.filter(
    (sign) =>
      sign.name.toLowerCase().includes(lowerQuery) ||
      sign.description.toLowerCase().includes(lowerQuery) ||
      sign.placement.toLowerCase().includes(lowerQuery)
  );
};

export const SIGN_TYPE_LABELS = {
  interdictie: 'Interdicție',
  avertizare: 'Avertizare',
  obligativitate: 'Obligativitate',
  salvare: 'Salvare și evacuare',
  incendiu: 'PSI - Stingere incendiu',
} as const;

export const SIGN_SHAPE_LABELS = {
  cerc: 'Cerc',
  triunghi: 'Triunghi echilateral',
  patrat: 'Pătrat/Dreptunghi',
} as const;
