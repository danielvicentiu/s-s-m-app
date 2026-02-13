/**
 * Tipuri de semnalizare de securitate și sănătate în muncă
 * Conform HG 971/2006 privind cerințele minime pentru semnalizarea de securitate
 * și/sau de sănătate la locul de muncă
 */

export type SemnalizareType =
  | 'interdictie'
  | 'avertizare'
  | 'obligatie'
  | 'salvare'
  | 'psi';

export type SemnalizareShape = 'cerc' | 'triunghi' | 'patrat' | 'dreptunghi';

export interface SemnalizareSSM {
  id: string;
  name: string;
  type: SemnalizareType;
  shape: SemnalizareShape;
  description: string;
  placement: string;
  legalBasis: string;
}

export const semnalizareSSMData: SemnalizareSSM[] = [
  // SEMNALE DE INTERDICȚIE (roșu)
  {
    id: 'INT-001',
    name: 'Interzis fumatul',
    type: 'interdictie',
    shape: 'cerc',
    description: 'Interzice fumatul în zonele cu risc de incendiu sau explozie',
    placement: 'La intrarea în zone cu materiale inflamabile, depozite, ateliere de producție',
    legalBasis: 'HG 971/2006, Anexa 2, Partea A'
  },
  {
    id: 'INT-002',
    name: 'Interzis accesul persoanelor neautorizate',
    type: 'interdictie',
    shape: 'cerc',
    description: 'Interzice accesul persoanelor fără autorizare în zone periculoase',
    placement: 'La intrarea în zone cu acces restricționat, panouri electrice, depozite chimice',
    legalBasis: 'HG 971/2006, Anexa 2, Partea A'
  },
  {
    id: 'INT-003',
    name: 'Interzis accesul cu vehicule',
    type: 'interdictie',
    shape: 'cerc',
    description: 'Interzice circulația vehiculelor în anumite zone',
    placement: 'La intrarea în zone pietonale, zone de lucru manuale',
    legalBasis: 'HG 971/2006, Anexa 2, Partea A'
  },
  {
    id: 'INT-004',
    name: 'Apa necorespunzătoare pentru băut',
    type: 'interdictie',
    shape: 'cerc',
    description: 'Interzice consumul de apă necorespunzătoare pentru băut',
    placement: 'Lângă instalațiile de apă tehnologică, stații de epurare',
    legalBasis: 'HG 971/2006, Anexa 2, Partea A'
  },
  {
    id: 'INT-005',
    name: 'Interzis accesul cu foc deschis',
    type: 'interdictie',
    shape: 'cerc',
    description: 'Interzice utilizarea focului deschis și fumatul',
    placement: 'Zone cu substanțe inflamabile, depozite de gaze, stații de carburanți',
    legalBasis: 'HG 971/2006, Anexa 2, Partea A'
  },

  // SEMNALE DE AVERTIZARE (galben)
  {
    id: 'AVT-001',
    name: 'Materiale inflamabile',
    type: 'avertizare',
    shape: 'triunghi',
    description: 'Avertizează asupra prezenței materialelor inflamabile',
    placement: 'Depozite de combustibili, zone cu lichide inflamabile, rezervoare',
    legalBasis: 'HG 971/2006, Anexa 2, Partea B'
  },
  {
    id: 'AVT-002',
    name: 'Materiale explozive',
    type: 'avertizare',
    shape: 'triunghi',
    description: 'Avertizează asupra prezenței materialelor explozive',
    placement: 'Depozite de explozivi, zone de stocare muniție, cariere',
    legalBasis: 'HG 971/2006, Anexa 2, Partea B'
  },
  {
    id: 'AVT-003',
    name: 'Materiale toxice',
    type: 'avertizare',
    shape: 'triunghi',
    description: 'Avertizează asupra prezenței substanțelor toxice',
    placement: 'Depozite chimice, laboratoare, zone cu substanțe periculoase',
    legalBasis: 'HG 971/2006, Anexa 2, Partea B'
  },
  {
    id: 'AVT-004',
    name: 'Materiale corozive',
    type: 'avertizare',
    shape: 'triunghi',
    description: 'Avertizează asupra prezenței substanțelor corozive',
    placement: 'Zone cu acizi, baze puternice, depozite chimice',
    legalBasis: 'HG 971/2006, Anexa 2, Partea B'
  },
  {
    id: 'AVT-005',
    name: 'Radiații periculoase',
    type: 'avertizare',
    shape: 'triunghi',
    description: 'Avertizează asupra prezenței radiațiilor ionizante',
    placement: 'Cabinete radiologie, zone cu aparatură cu radiații, laboratoare',
    legalBasis: 'HG 971/2006, Anexa 2, Partea B'
  },
  {
    id: 'AVT-006',
    name: 'Sarcini suspendate',
    type: 'avertizare',
    shape: 'triunghi',
    description: 'Avertizează asupra riscului de cădere a sarcinilor suspendate',
    placement: 'Sub macarale, poduri rulante, zone de ridicare',
    legalBasis: 'HG 971/2006, Anexa 2, Partea B'
  },
  {
    id: 'AVT-007',
    name: 'Vehicule pentru transport și manipulare',
    type: 'avertizare',
    shape: 'triunghi',
    description: 'Avertizează asupra circulației vehiculelor industriale',
    placement: 'Zone cu trafic de stivuitoare, transpalete, căi de circulație',
    legalBasis: 'HG 971/2006, Anexa 2, Partea B'
  },
  {
    id: 'AVT-008',
    name: 'Pericol electric',
    type: 'avertizare',
    shape: 'triunghi',
    description: 'Avertizează asupra riscului de electrocutare',
    placement: 'Panouri electrice, stații de transformare, linii electrice',
    legalBasis: 'HG 971/2006, Anexa 2, Partea B'
  },
  {
    id: 'AVT-009',
    name: 'Atenție pericol general',
    type: 'avertizare',
    shape: 'triunghi',
    description: 'Avertizează asupra unui pericol nedefinit specific',
    placement: 'Zone cu pericole multiple sau temporare',
    legalBasis: 'HG 971/2006, Anexa 2, Partea B'
  },
  {
    id: 'AVT-010',
    name: 'Temperatură scăzută',
    type: 'avertizare',
    shape: 'triunghi',
    description: 'Avertizează asupra temperaturii scăzute',
    placement: 'Depozite frigorifice, camere de congelare, instalații criogenice',
    legalBasis: 'HG 971/2006, Anexa 2, Partea B'
  },

  // SEMNALE DE OBLIGAȚIE (albastru)
  {
    id: 'OBL-001',
    name: 'Echipament de protecție a ochilor obligatoriu',
    type: 'obligatie',
    shape: 'cerc',
    description: 'Obligă purtarea ochelarilor de protecție',
    placement: 'Ateliere de sudură, laborator chimic, zone cu praf sau substanțe chimice',
    legalBasis: 'HG 971/2006, Anexa 2, Partea C'
  },
  {
    id: 'OBL-002',
    name: 'Casca de protecție obligatorie',
    type: 'obligatie',
    shape: 'cerc',
    description: 'Obligă purtarea căștii de protecție',
    placement: 'Șantiere, zone cu risc de cădere obiecte, sub macarale',
    legalBasis: 'HG 971/2006, Anexa 2, Partea C'
  },
  {
    id: 'OBL-003',
    name: 'Echipament de protecție a auzului obligatoriu',
    type: 'obligatie',
    shape: 'cerc',
    description: 'Obligă purtarea protecției auditive',
    placement: 'Zone cu zgomot peste 85 dB, ateliere de producție zgomotoase',
    legalBasis: 'HG 971/2006, Anexa 2, Partea C'
  },
  {
    id: 'OBL-004',
    name: 'Echipament de protecție respiratorie obligatoriu',
    type: 'obligatie',
    shape: 'cerc',
    description: 'Obligă purtarea măștii sau aparatului de protecție respiratorie',
    placement: 'Zone cu praf, gaze nocive, vapori toxici, spații confinate',
    legalBasis: 'HG 971/2006, Anexa 2, Partea C'
  },
  {
    id: 'OBL-005',
    name: 'Încălțăminte de siguranță obligatorie',
    type: 'obligatie',
    shape: 'cerc',
    description: 'Obligă purtarea încălțămintei de protecție',
    placement: 'Toate zonele industriale, depozite, ateliere de producție',
    legalBasis: 'HG 971/2006, Anexa 2, Partea C'
  },
  {
    id: 'OBL-006',
    name: 'Mănuși de protecție obligatorii',
    type: 'obligatie',
    shape: 'cerc',
    description: 'Obligă purtarea mănușilor de protecție',
    placement: 'Zone cu materiale ascuțite, chimice, temperaturi extreme',
    legalBasis: 'HG 971/2006, Anexa 2, Partea C'
  },
  {
    id: 'OBL-007',
    name: 'Echipament de protecție a feței obligatoriu',
    type: 'obligatie',
    shape: 'cerc',
    description: 'Obligă purtarea vizierului sau măștii de protecție facială',
    placement: 'Ateliere de sudură, șlefuit, polizare, zone cu risc de proiecții',
    legalBasis: 'HG 971/2006, Anexa 2, Partea C'
  },
  {
    id: 'OBL-008',
    name: 'Șorț de protecție obligatoriu',
    type: 'obligatie',
    shape: 'cerc',
    description: 'Obligă purtarea șorțului de protecție',
    placement: 'Laboratoare chimice, zone cu substanțe corozive',
    legalBasis: 'HG 971/2006, Anexa 2, Partea C'
  },
  {
    id: 'OBL-009',
    name: 'Vestă de siguranță obligatorie',
    type: 'obligatie',
    shape: 'cerc',
    description: 'Obligă purtarea vestei reflectorizante',
    placement: 'Zone cu circulație vehicule, șantiere, depozite cu stivuitoare',
    legalBasis: 'HG 971/2006, Anexa 2, Partea C'
  },
  {
    id: 'OBL-010',
    name: 'Ham de siguranță obligatoriu',
    type: 'obligatie',
    shape: 'cerc',
    description: 'Obligă utilizarea hamului de siguranță anti-cădere',
    placement: 'Lucru la înălțime, acoperișuri, platforme suspendate',
    legalBasis: 'HG 971/2006, Anexa 2, Partea C'
  },

  // SEMNALE DE SALVARE (verde)
  {
    id: 'SAL-001',
    name: 'Ieșire de urgență stânga',
    type: 'salvare',
    shape: 'dreptunghi',
    description: 'Indică direcția ieșirii de urgență spre stânga',
    placement: 'Deasupra sau lângă ușile de evacuare, pe căile de evacuare',
    legalBasis: 'HG 971/2006, Anexa 2, Partea D'
  },
  {
    id: 'SAL-002',
    name: 'Ieșire de urgență dreapta',
    type: 'salvare',
    shape: 'dreptunghi',
    description: 'Indică direcția ieșirii de urgență spre dreapta',
    placement: 'Deasupra sau lângă ușile de evacuare, pe căile de evacuare',
    legalBasis: 'HG 971/2006, Anexa 2, Partea D'
  },
  {
    id: 'SAL-003',
    name: 'Punct de adunare',
    type: 'salvare',
    shape: 'patrat',
    description: 'Indică locul de adunare în caz de evacuare',
    placement: 'Exterior, în zone sigure desemnate pentru adunare',
    legalBasis: 'HG 971/2006, Anexa 2, Partea D'
  },
  {
    id: 'SAL-004',
    name: 'Trusă de prim ajutor',
    type: 'salvare',
    shape: 'patrat',
    description: 'Indică amplasarea trusei de prim ajutor',
    placement: 'Pe pereți în zone accesibile, la puncte de prim ajutor',
    legalBasis: 'HG 971/2006, Anexa 2, Partea D'
  },

  // SEMNALE PSI (roșu)
  {
    id: 'PSI-001',
    name: 'Stingător de incendiu',
    type: 'psi',
    shape: 'patrat',
    description: 'Indică amplasarea stingătorului de incendiu',
    placement: 'Deasupra sau lângă stingătoarele de incendiu',
    legalBasis: 'HG 971/2006, Anexa 2, Partea E'
  },
  {
    id: 'PSI-002',
    name: 'Hidrant interior',
    type: 'psi',
    shape: 'patrat',
    description: 'Indică amplasarea hidrantului interior',
    placement: 'Deasupra sau lângă hidranții interiori',
    legalBasis: 'HG 971/2006, Anexa 2, Partea E'
  },
  {
    id: 'PSI-003',
    name: 'Telefon pentru alarmare incendiu',
    type: 'psi',
    shape: 'patrat',
    description: 'Indică amplasarea telefonului pentru alarmare incendiu',
    placement: 'Lângă punctele de alarmă sau telefoane dedicate PSI',
    legalBasis: 'HG 971/2006, Anexa 2, Partea E'
  }
];

/**
 * Helper function pentru filtrare după tip
 */
export const getSemnalizareByType = (type: SemnalizareType): SemnalizareSSM[] => {
  return semnalizareSSMData.filter(s => s.type === type);
};

/**
 * Helper function pentru căutare după ID
 */
export const getSemnalizareById = (id: string): SemnalizareSSM | undefined => {
  return semnalizareSSMData.find(s => s.id === id);
};

/**
 * Statistici semnalizare
 */
export const semnalizareStats = {
  total: semnalizareSSMData.length,
  interdictie: getSemnalizareByType('interdictie').length,
  avertizare: getSemnalizareByType('avertizare').length,
  obligatie: getSemnalizareByType('obligatie').length,
  salvare: getSemnalizareByType('salvare').length,
  psi: getSemnalizareByType('psi').length
};
