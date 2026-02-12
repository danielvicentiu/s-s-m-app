/**
 * Echipamente Individuale de Protecție (EIP) comune
 * Date: 2026-02-13
 *
 * Lista cuprinzătoare de echipamente de protecție individuală
 * cu standarde EN/ISO și cerințe de verificare periodică
 */

export type EchipamentProtectieCategory =
  | 'cap'
  | 'ochi'
  | 'auz'
  | 'respirator'
  | 'mâini'
  | 'picioare'
  | 'corp'
  | 'cădere_înălțime';

export interface EchipamentProtectie {
  id: string;
  name: string;
  category: EchipamentProtectieCategory;
  description: string;
  standard: string;
  verificarePerioada: number; // luni
  sectoareObligatorii: string[];
}

export const echipamenteProtectie: EchipamentProtectie[] = [
  // CAP
  {
    id: 'eip-001',
    name: 'Cască de protecție industrială',
    category: 'cap',
    description: 'Cască de protecție împotriva impactului cu obiecte cădute, lovituri la cap și șocuri electrice',
    standard: 'EN 397, EN 50365',
    verificarePerioada: 12,
    sectoareObligatorii: ['Construcții', 'Industrie', 'Depozitare', 'Silvicultură']
  },
  {
    id: 'eip-002',
    name: 'Cască de protecție pentru alpinism industrial',
    category: 'cap',
    description: 'Cască ușoară pentru lucrări la înălțime, cu rezistență sporită la șocuri laterale',
    standard: 'EN 12492, EN 397',
    verificarePerioada: 12,
    sectoareObligatorii: ['Construcții la înălțime', 'Instalații industriale', 'Montaj structuri']
  },
  {
    id: 'eip-003',
    name: 'Pălărie antistatică',
    category: 'cap',
    description: 'Protecție pentru medii cu risc de electricitate statică și explozii',
    standard: 'EN 1149-5',
    verificarePerioada: 6,
    sectoareObligatorii: ['Petrol și gaze', 'Industrie chimică', 'Farmaceutică']
  },

  // OCHI
  {
    id: 'eip-004',
    name: 'Ochelari de protecție împotriva impactului',
    category: 'ochi',
    description: 'Ochelari cu lentile rezistente la impact mecanic, praf și particule',
    standard: 'EN 166',
    verificarePerioada: 6,
    sectoareObligatorii: ['Prelucrare metale', 'Tâmplărie', 'Construcții', 'Laborator']
  },
  {
    id: 'eip-005',
    name: 'Ochelari de protecție pentru sudură',
    category: 'ochi',
    description: 'Ochelari cu filtre pentru protecție împotriva radiațiilor UV și IR la sudură',
    standard: 'EN 169, EN 175',
    verificarePerioada: 6,
    sectoareObligatorii: ['Sudură și tăiere termică', 'Construcții metalice', 'Industrie auto']
  },
  {
    id: 'eip-006',
    name: 'Vizor facial de protecție',
    category: 'ochi',
    description: 'Protecție completă față împotriva proiecțiilor chimice, biologice sau mecanice',
    standard: 'EN 166',
    verificarePerioada: 6,
    sectoareObligatorii: ['Industrie chimică', 'Laborator', 'Medical', 'Prelucrare lemn']
  },
  {
    id: 'eip-007',
    name: 'Ochelari de protecție laser',
    category: 'ochi',
    description: 'Ochelari speciali pentru protecție împotriva radiațiilor laser',
    standard: 'EN 207, EN 208',
    verificarePerioada: 12,
    sectoareObligatorii: ['Industrie', 'Cercetare', 'Medical']
  },

  // AUZ
  {
    id: 'eip-008',
    name: 'Dopuri de urechi din spumă',
    category: 'auz',
    description: 'Dopuri de unică folosință pentru atenuarea zgomotului până la 33 dB',
    standard: 'EN 352-2',
    verificarePerioada: 0, // unică folosință
    sectoareObligatorii: ['Construcții', 'Industrie', 'Aeroporturi', 'Evenimente']
  },
  {
    id: 'eip-009',
    name: 'Antifoane tip cască',
    category: 'auz',
    description: 'Protecție auditivă reutilizabilă pentru zgomot intens continuu',
    standard: 'EN 352-1',
    verificarePerioada: 12,
    sectoareObligatorii: ['Industrie grea', 'Aeroporturi', 'Construcții', 'Fabrici']
  },
  {
    id: 'eip-010',
    name: 'Antifoane cu comunicare radio',
    category: 'auz',
    description: 'Căști de protecție auditivă cu sistem de comunicare integrat',
    standard: 'EN 352-1, EN 352-6',
    verificarePerioada: 6,
    sectoareObligatorii: ['Aeroporturi', 'Industrie grea', 'Construcții mari']
  },

  // RESPIRATOR
  {
    id: 'eip-011',
    name: 'Mască FFP1',
    category: 'respirator',
    description: 'Semimasca de protecție respiratorie pentru particule nefibroase și netoxice',
    standard: 'EN 149:2001+A1:2009',
    verificarePerioada: 0, // unică folosință
    sectoareObligatorii: ['Depozitare', 'Agricultură', 'Curățenie industrială']
  },
  {
    id: 'eip-012',
    name: 'Mască FFP2',
    category: 'respirator',
    description: 'Semimasca pentru protecție împotriva particulelor solide și lichide nocive',
    standard: 'EN 149:2001+A1:2009',
    verificarePerioada: 0,
    sectoareObligatorii: ['Construcții', 'Medical', 'Industrie chimică', 'Farmaceutică']
  },
  {
    id: 'eip-013',
    name: 'Mască FFP3',
    category: 'respirator',
    description: 'Protecție respiratorie de nivel înalt împotriva particulelor toxice și radioactive',
    standard: 'EN 149:2001+A1:2009',
    verificarePerioada: 0,
    sectoareObligatorii: ['Azbest', 'Industrie chimică', 'Farmaceutică', 'Nuclear']
  },
  {
    id: 'eip-014',
    name: 'Semimască reutilizabilă cu filtre',
    category: 'respirator',
    description: 'Mască reutilizabilă cu filtre interschimbabile pentru gaze și vapori',
    standard: 'EN 140',
    verificarePerioada: 6,
    sectoareObligatorii: ['Industrie chimică', 'Vopsitorie', 'Rafinării', 'Laboratoare']
  },
  {
    id: 'eip-015',
    name: 'Aparat de protecție respiratorie izolant',
    category: 'respirator',
    description: 'Echipament autonom cu butelie de aer pentru medii toxice sau fără oxigen',
    standard: 'EN 137',
    verificarePerioada: 3,
    sectoareObligatorii: ['Pompieri', 'Intervenții chimice', 'Spații confinate']
  },

  // MÂINI
  {
    id: 'eip-016',
    name: 'Mănuși de protecție mecanică',
    category: 'mâini',
    description: 'Mănuși rezistente la abraziune, tăiere, rupere și perforare',
    standard: 'EN 388',
    verificarePerioada: 3,
    sectoareObligatorii: ['Construcții', 'Industrie', 'Logistică', 'Montaj']
  },
  {
    id: 'eip-017',
    name: 'Mănuși chimice din nitril',
    category: 'mâini',
    description: 'Protecție împotriva substanțelor chimice, acizi, solvenți și uleiuri',
    standard: 'EN 374',
    verificarePerioada: 1,
    sectoareObligatorii: ['Industrie chimică', 'Laboratoare', 'Farmaceutică', 'Curățenie']
  },
  {
    id: 'eip-018',
    name: 'Mănuși dielectrice',
    category: 'mâini',
    description: 'Mănuși izolante pentru protecție împotriva șocurilor electrice',
    standard: 'EN 60903',
    verificarePerioada: 6,
    sectoareObligatorii: ['Electricieni', 'Industrie energetică', 'Telecomunicații']
  },
  {
    id: 'eip-019',
    name: 'Mănuși anti-tăiere nivel 5',
    category: 'mâini',
    description: 'Mănuși cu protecție maximă împotriva tăierii cu lamă ascuțită',
    standard: 'EN 388 nivel 5',
    verificarePerioada: 3,
    sectoareObligatorii: ['Prelucrare sticlă', 'Industrie metalurgică', 'Reciclare']
  },

  // PICIOARE
  {
    id: 'eip-020',
    name: 'Bocanci de protecție S3',
    category: 'picioare',
    description: 'Încălțăminte de siguranță cu bombeu metalic, rezistență la perforare și apă',
    standard: 'EN ISO 20345:2011 S3',
    verificarePerioada: 12,
    sectoareObligatorii: ['Construcții', 'Industrie', 'Logistică', 'Agricultură']
  },
  {
    id: 'eip-021',
    name: 'Bocanci dielectrici',
    category: 'picioare',
    description: 'Încălțăminte cu protecție electrică pentru electricieni',
    standard: 'EN 50321',
    verificarePerioada: 6,
    sectoareObligatorii: ['Electricieni', 'Industrie energetică', 'Mentenanță electrică']
  },
  {
    id: 'eip-022',
    name: 'Cizme de cauciuc',
    category: 'picioare',
    description: 'Protecție împotriva apei, noroi și substanțe chimice',
    standard: 'EN ISO 20345 S5',
    verificarePerioada: 12,
    sectoareObligatorii: ['Agricultură', 'Industrie alimentară', 'Curățenie', 'Industrie chimică']
  },

  // CORP
  {
    id: 'eip-023',
    name: 'Vestă de înaltă vizibilitate',
    category: 'corp',
    description: 'Vestă reflectorizantă pentru lucru în condiții de vizibilitate redusă',
    standard: 'EN ISO 20471',
    verificarePerioada: 12,
    sectoareObligatorii: ['Construcții drumuri', 'Logistică', 'Aeroporturi', 'Feroviar']
  },
  {
    id: 'eip-024',
    name: 'Combinezon ignifug',
    category: 'corp',
    description: 'Îmbrăcăminte de protecție împotriva căldurii și flăcărilor',
    standard: 'EN 11612, EN ISO 11611',
    verificarePerioada: 6,
    sectoareObligatorii: ['Sudură', 'Rafinării', 'Pompieri', 'Metalurgie']
  },
  {
    id: 'eip-025',
    name: 'Combinezon antichimic tip 3',
    category: 'corp',
    description: 'Protecție totală împotriva substanțelor chimice lichide',
    standard: 'EN 14605 Tip 3',
    verificarePerioada: 0,
    sectoareObligatorii: ['Industrie chimică', 'Intervenții CBRN', 'Decontaminare']
  },
  {
    id: 'eip-026',
    name: 'Șorț de protecție din piele',
    category: 'corp',
    description: 'Protecție pentru lucru cu materiale abrazive, tăioase sau fierbinți',
    standard: 'EN ISO 11611',
    verificarePerioada: 12,
    sectoareObligatorii: ['Sudură', 'Prelucrare metale', 'Sticlărie']
  },

  // CĂDERE ÎNĂLȚIME
  {
    id: 'eip-027',
    name: 'Ham de siguranță',
    category: 'cădere_înălțime',
    description: 'Sistem complet de prindere pentru prevenirea și oprirea căderii de la înălțime',
    standard: 'EN 361',
    verificarePerioada: 12,
    sectoareObligatorii: ['Construcții la înălțime', 'Montaj structuri', 'Instalații', 'Telecomunicații']
  },
  {
    id: 'eip-028',
    name: 'Absorbant de energie',
    category: 'cădere_înălțime',
    description: 'Dispozitiv pentru reducerea forței de impact în caz de cădere',
    standard: 'EN 355',
    verificarePerioada: 12,
    sectoareObligatorii: ['Construcții la înălțime', 'Alpinism industrial', 'Montaj']
  },
  {
    id: 'eip-029',
    name: 'Dispozitiv antialunecare pe coardă',
    category: 'cădere_înălțime',
    description: 'Dispozitiv mobil de blocare automată pentru sisteme verticale',
    standard: 'EN 353-2',
    verificarePerioada: 12,
    sectoareObligatorii: ['Construcții verticale', 'Instalații pe stâlpi', 'Eoliene']
  },
  {
    id: 'eip-030',
    name: 'Coardă de siguranță',
    category: 'cădere_înălțime',
    description: 'Coardă textilă certificată pentru sisteme anticădere',
    standard: 'EN 1891',
    verificarePerioada: 6,
    sectoareObligatorii: ['Alpinism industrial', 'Salvare la înălțime', 'Speleologie industrială']
  }
];

/**
 * Helper functions pentru lucrul cu echipamente de protecție
 */

export const getEchipamenteByCategory = (category: EchipamentProtectieCategory): EchipamentProtectie[] => {
  return echipamenteProtectie.filter(e => e.category === category);
};

export const getEchipamenteBySector = (sector: string): EchipamentProtectie[] => {
  return echipamenteProtectie.filter(e =>
    e.sectoareObligatorii.some(s => s.toLowerCase().includes(sector.toLowerCase()))
  );
};

export const getEchipamentById = (id: string): EchipamentProtectie | undefined => {
  return echipamenteProtectie.find(e => e.id === id);
};

export const getAllCategories = (): EchipamentProtectieCategory[] => {
  return ['cap', 'ochi', 'auz', 'respirator', 'mâini', 'picioare', 'corp', 'cădere_înălțime'];
};

export const getCategoryDisplayName = (category: EchipamentProtectieCategory): string => {
  const displayNames: Record<EchipamentProtectieCategory, string> = {
    'cap': 'Protecție cap',
    'ochi': 'Protecție ochi și față',
    'auz': 'Protecție auditivă',
    'respirator': 'Protecție respiratorie',
    'mâini': 'Protecție mâini',
    'picioare': 'Protecție picioare',
    'corp': 'Protecție corp',
    'cădere_înălțime': 'Protecție anticădere'
  };
  return displayNames[category];
};
