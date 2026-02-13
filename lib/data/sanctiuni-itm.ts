/**
 * Sanctiuni frecvente ITM (Inspectia Muncii) Romania
 * Date actualizate conform legislatiei SSM/PSI in vigoare
 */

export interface SanctiuneITM {
  id: string;
  violation: string;
  legalBasis: string;
  fineMin: number; // RON
  fineMax: number; // RON
  category: 'SSM' | 'PSI' | 'Munca' | 'COVID';
  frequency: 'foarte frecventa' | 'frecventa' | 'ocazionala';
  preventionTip: string;
}

export const sanctiuniITM: SanctiuneITM[] = [
  {
    id: 'itm-001',
    violation: 'Lipsa evaluarii riscurilor la locul de munca',
    legalBasis: 'Legea 319/2006, art. 7',
    fineMin: 10000,
    fineMax: 20000,
    category: 'SSM',
    frequency: 'foarte frecventa',
    preventionTip: 'Realizați și actualizați evaluarea riscurilor conform HG 1425/2006. Documentul trebuie semnat și datat.'
  },
  {
    id: 'itm-002',
    violation: 'Lipsa instructajului de SSM pentru angajati',
    legalBasis: 'Legea 319/2006, art. 18',
    fineMin: 5000,
    fineMax: 10000,
    category: 'SSM',
    frequency: 'foarte frecventa',
    preventionTip: 'Organizați instructaje periodice (general, pe post, de lucru) și păstrați fișele de instructaj semnate.'
  },
  {
    id: 'itm-003',
    violation: 'Lipsa examenului medical la angajare sau periodic',
    legalBasis: 'Legea 319/2006, art. 20; HG 355/2007',
    fineMin: 10000,
    fineMax: 20000,
    category: 'SSM',
    frequency: 'foarte frecventa',
    preventionTip: 'Asigurați examenul medical la angajare și examene periodice conform protocolului medical. Păstrați avizele medicale.'
  },
  {
    id: 'itm-004',
    violation: 'Lipsa echipamentului individual de protectie (EIP)',
    legalBasis: 'Legea 319/2006, art. 16; HG 1048/2006',
    fineMin: 5000,
    fineMax: 15000,
    category: 'SSM',
    frequency: 'foarte frecventa',
    preventionTip: 'Dotați angajații cu EIP conform fișei postului (mănuși, ochelari, căști, etc.). Păstrați dovezile de distribuire.'
  },
  {
    id: 'itm-005',
    violation: 'Lipsa autorizatiei de functionare PSI',
    legalBasis: 'Legea 307/2006, art. 9',
    fineMin: 15000,
    fineMax: 30000,
    category: 'PSI',
    frequency: 'frecventa',
    preventionTip: 'Obțineți autorizația PSI de la ISU înainte de începerea activității. Valabilitate: 4 ani.'
  },
  {
    id: 'itm-006',
    violation: 'Lipsa stingatoarelor sau stingatoare expirate',
    legalBasis: 'Legea 307/2006, art. 10',
    fineMin: 3000,
    fineMax: 8000,
    category: 'PSI',
    frequency: 'foarte frecventa',
    preventionTip: 'Verificați și reîncărcați stingătoarele anual. Etichetă cu data verificării vizibilă.'
  },
  {
    id: 'itm-007',
    violation: 'Lipsa contractului individual de munca in forma scrisa',
    legalBasis: 'Codul Muncii, art. 16',
    fineMin: 10000,
    fineMax: 20000,
    category: 'Munca',
    frequency: 'foarte frecventa',
    preventionTip: 'Încheiați CIM în formă scrisă înainte de debut. Înregistrați la ITM în termen de 20 zile.'
  },
  {
    id: 'itm-008',
    violation: 'Munca nedeclarata (munca la negru)',
    legalBasis: 'Legea 53/2003, art. 260',
    fineMin: 20000,
    fineMax: 40000,
    category: 'Munca',
    frequency: 'frecventa',
    preventionTip: 'Declarați toți angajații în Revisal înainte de debut. Risc major: închidere temporară activitate.'
  },
  {
    id: 'itm-009',
    violation: 'Depasirea programului de lucru legal (ore suplimentare)',
    legalBasis: 'Codul Muncii, art. 114-120',
    fineMin: 5000,
    fineMax: 10000,
    category: 'Munca',
    frequency: 'frecventa',
    preventionTip: 'Respectați limita de 48 ore/săptămână (inclusiv ore suplimentare). Consimțământ scris pentru ore suplimentare.'
  },
  {
    id: 'itm-010',
    violation: 'Lipsa registrului de evidenta a salariatilor',
    legalBasis: 'Codul Muncii, art. 277; Legea 53/2003',
    fineMin: 3000,
    fineMax: 5000,
    category: 'Munca',
    frequency: 'frecventa',
    preventionTip: 'Mențineți registrul general actualizat cu toți angajații. Disponibil la control ITM.'
  },
  {
    id: 'itm-011',
    violation: 'Lipsa planului de evacuare in caz de incendiu',
    legalBasis: 'Legea 307/2006, art. 12',
    fineMin: 5000,
    fineMax: 10000,
    category: 'PSI',
    frequency: 'frecventa',
    preventionTip: 'Afișați planul de evacuare vizibil, cu săgeți direcționale și puncte de adunare marcate.'
  },
  {
    id: 'itm-012',
    violation: 'Lipsa persoanei desemnate pentru SSM/serviciului extern',
    legalBasis: 'Legea 319/2006, art. 14-15',
    fineMin: 10000,
    fineMax: 20000,
    category: 'SSM',
    frequency: 'frecventa',
    preventionTip: 'Desemnați lucrător SSM sau contractați serviciu extern. Document de desemnare obligatoriu.'
  },
  {
    id: 'itm-013',
    violation: 'Lipsa instructajului de PSI pentru angajati',
    legalBasis: 'Legea 307/2006, art. 14',
    fineMin: 3000,
    fineMax: 8000,
    category: 'PSI',
    frequency: 'frecventa',
    preventionTip: 'Organizați instructaj PSI la angajare și periodic. Păstrați fișele semnate.'
  },
  {
    id: 'itm-014',
    violation: 'Nerespectarea conditiilor de temperatura la locul de munca',
    legalBasis: 'Legea 319/2006; HG 1091/2006',
    fineMin: 5000,
    fineMax: 10000,
    category: 'SSM',
    frequency: 'ocazionala',
    preventionTip: 'Asigurați temperatură 18-24°C la birou. Măsurați și documentați condițiile de microclimat.'
  },
  {
    id: 'itm-015',
    violation: 'Lipsa autorizatiilor pentru utilaje/echipamente',
    legalBasis: 'Legea 319/2006, art. 21; HG 1146/2006',
    fineMin: 5000,
    fineMax: 15000,
    category: 'SSM',
    frequency: 'frecventa',
    preventionTip: 'Obțineți autorizații ISCIR pentru recipiente sub presiune, lifturi, etc. Verificări periodice obligatorii.'
  },
  {
    id: 'itm-016',
    violation: 'Obstructionarea cailor de evacuare',
    legalBasis: 'Legea 307/2006, art. 10',
    fineMin: 3000,
    fineMax: 8000,
    category: 'PSI',
    frequency: 'frecventa',
    preventionTip: 'Mențineti căile de evacuare libere, neobstrucționate, cu iluminat de urgență funcțional.'
  },
  {
    id: 'itm-017',
    violation: 'Lipsa semnalizarii de securitate (panouri SSM/PSI)',
    legalBasis: 'Legea 319/2006, art. 17; HG 971/2006',
    fineMin: 2000,
    fineMax: 5000,
    category: 'SSM',
    frequency: 'frecventa',
    preventionTip: 'Amplasați panouri de avertizare, obligație, interdicție și salvare conform HG 971/2006.'
  },
  {
    id: 'itm-018',
    violation: 'Neacordarea pauzelor legale de masa si odihna',
    legalBasis: 'Codul Muncii, art. 134-135',
    fineMin: 3000,
    fineMax: 8000,
    category: 'Munca',
    frequency: 'ocazionala',
    preventionTip: 'Acordați pauză 15 min pentru 6 ore lucru și 30 min pauză masă pentru program peste 6 ore.'
  },
  {
    id: 'itm-019',
    violation: 'Lipsa treptelor de verificare a instalatiei electrice',
    legalBasis: 'Legea 319/2006; Ordin 537/2007',
    fineMin: 5000,
    fineMax: 10000,
    category: 'SSM',
    frequency: 'frecventa',
    preventionTip: 'Verificați anual instalația electrică de personal autorizat. Păstrați rapoartele de verificare.'
  },
  {
    id: 'itm-020',
    violation: 'Lipsa planului de prevenire si protectie (PPP)',
    legalBasis: 'Legea 319/2006, art. 13',
    fineMin: 10000,
    fineMax: 20000,
    category: 'SSM',
    frequency: 'frecventa',
    preventionTip: 'Elaborați și actualizați anual Planul de Prevenire și Protecție. Consultați reprezentanții lucrătorilor.'
  }
];

/**
 * Obtine sanctiuni dupa categorie
 */
export function getSanctiuniByCategory(category: SanctiuneITM['category']): SanctiuneITM[] {
  return sanctiuniITM.filter(s => s.category === category);
}

/**
 * Obtine sanctiuni dupa frecventa
 */
export function getSanctiuniByFrequency(frequency: SanctiuneITM['frequency']): SanctiuneITM[] {
  return sanctiuniITM.filter(s => s.frequency === frequency);
}

/**
 * Calculeaza amenda medie
 */
export function getAverageFineBySanctiune(sanctiune: SanctiuneITM): number {
  return (sanctiune.fineMin + sanctiune.fineMax) / 2;
}

/**
 * Obtine toate categoriile disponibile
 */
export function getCategories(): SanctiuneITM['category'][] {
  return ['SSM', 'PSI', 'Munca', 'COVID'];
}
