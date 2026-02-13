/**
 * Sancțiuni frecvente aplicate de ITM (Inspecția Muncii) în România
 * Date orientative bazate pe Legea 319/2006 (SSM), Legea 307/2006 (PSI) și Codul Muncii
 */

export interface SanctiuneITM {
  id: string;
  violation: string;
  legalBasis: string;
  fineMin: number; // RON
  fineMax: number; // RON
  category: 'SSM' | 'PSI' | 'Relații de muncă';
  frequency: 'foarte frecvent' | 'frecvent' | 'moderat';
  preventionTip: string;
}

export const sanctiuniITM: SanctiuneITM[] = [
  {
    id: 'ssm-01',
    violation: 'Lipsa evaluării riscurilor pentru locurile de muncă',
    legalBasis: 'Legea 319/2006, art. 18',
    fineMin: 10000,
    fineMax: 20000,
    category: 'SSM',
    frequency: 'foarte frecvent',
    preventionTip: 'Efectuați evaluarea riscurilor pentru toate locurile de muncă și actualizați-o anual sau la modificări semnificative.'
  },
  {
    id: 'ssm-02',
    violation: 'Lipsa instruirii SSM la angajare și periodic',
    legalBasis: 'Legea 319/2006, art. 20',
    fineMin: 5000,
    fineMax: 10000,
    category: 'SSM',
    frequency: 'foarte frecvent',
    preventionTip: 'Asigurați instruire SSM la angajare, schimbarea locului de muncă și periodic (minim anual). Păstrați fișele de instruire semnate.'
  },
  {
    id: 'ssm-03',
    violation: 'Lipsa echipamentelor individuale de protecție (EIP)',
    legalBasis: 'Legea 319/2006, art. 16',
    fineMin: 8000,
    fineMax: 16000,
    category: 'SSM',
    frequency: 'foarte frecvent',
    preventionTip: 'Dotați angajații cu EIP conform evaluării riscurilor. Păstrați dovezile de predare-primire și instruire pentru utilizare.'
  },
  {
    id: 'ssm-04',
    violation: 'Lipsa contractului cu serviciu SSM extern sau medic de medicina muncii',
    legalBasis: 'Legea 319/2006, art. 19',
    fineMin: 10000,
    fineMax: 20000,
    category: 'SSM',
    frequency: 'frecvent',
    preventionTip: 'Încheieți contract cu serviciu SSM extern autorizat și medic de medicina muncii. Verificați autorizațiile acestora.'
  },
  {
    id: 'ssm-05',
    violation: 'Lipsa avizului SSM pentru funcționare',
    legalBasis: 'Legea 319/2006, art. 14',
    fineMin: 15000,
    fineMax: 30000,
    category: 'SSM',
    frequency: 'frecvent',
    preventionTip: 'Solicitați avizul SSM de la ITM înainte de demararea activității. Reînnoiți-l la modificări majore ale procesului de producție.'
  },
  {
    id: 'ssm-06',
    violation: 'Neefectuarea controlului medical periodic',
    legalBasis: 'Legea 319/2006, art. 22',
    fineMin: 5000,
    fineMax: 10000,
    category: 'SSM',
    frequency: 'foarte frecvent',
    preventionTip: 'Programați controale medicale periodice conform fișei de aptitudine. Păstrați evidența validității certificatelor medicale.'
  },
  {
    id: 'ssm-07',
    violation: 'Lipsa planului de prevenire și protecție (PPP)',
    legalBasis: 'Legea 319/2006, art. 18',
    fineMin: 8000,
    fineMax: 16000,
    category: 'SSM',
    frequency: 'frecvent',
    preventionTip: 'Elaborați PPP bazat pe evaluarea riscurilor. Actualizați-l anual și asigurați-vă că măsurile sunt implementate.'
  },
  {
    id: 'psi-01',
    violation: 'Lipsa autorizației PSI de funcționare',
    legalBasis: 'Legea 307/2006, art. 28',
    fineMin: 20000,
    fineMax: 40000,
    category: 'PSI',
    frequency: 'foarte frecvent',
    preventionTip: 'Obțineți autorizația PSI de la ISU. Verificați periodic valabilitatea și reînnoiți-o la termen.'
  },
  {
    id: 'psi-02',
    violation: 'Lipsa sau verificarea necorespunzătoare a mijloacelor de stingere incendii',
    legalBasis: 'Legea 307/2006, art. 10',
    fineMin: 10000,
    fineMax: 20000,
    category: 'PSI',
    frequency: 'foarte frecvent',
    preventionTip: 'Asigurați stingătoare conform normelor (1 stingător/200mp). Verificați-le anual de firme autorizate și păstrați documentația.'
  },
  {
    id: 'psi-03',
    violation: 'Lipsa instruirii PSI a angajaților',
    legalBasis: 'Legea 307/2006, art. 10',
    fineMin: 5000,
    fineMax: 10000,
    category: 'PSI',
    frequency: 'foarte frecvent',
    preventionTip: 'Instruiți personalul PSI la angajare și periodic (anual). Păstrați fișele de instruire și planul de evacuare afișat.'
  },
  {
    id: 'psi-04',
    violation: 'Blocarea căilor de evacuare sau a ieșirilor de urgență',
    legalBasis: 'Legea 307/2006, art. 10',
    fineMin: 8000,
    fineMax: 16000,
    category: 'PSI',
    frequency: 'frecvent',
    preventionTip: 'Mențineți căile de evacuare libere permanent. Verificați săptămânal că ieșirile de urgență nu sunt blocate sau încuiate.'
  },
  {
    id: 'psi-05',
    violation: 'Lipsa scenariilor de securitate la incendiu',
    legalBasis: 'Legea 307/2006, art. 10',
    fineMin: 10000,
    fineMax: 20000,
    category: 'PSI',
    frequency: 'frecvent',
    preventionTip: 'Elaborați scenarii de securitate pentru toate spațiile. Efectuați exerciții de evacuare cel puțin semestrial.'
  },
  {
    id: 'rm-01',
    violation: 'Munca nedeclarată (angajați fără contract)',
    legalBasis: 'Legea 53/2003, art. 260',
    fineMin: 20000,
    fineMax: 40000,
    category: 'Relații de muncă',
    frequency: 'foarte frecvent',
    preventionTip: 'Înregistrați TOATE contractele în Revisal înainte de începerea activității. Verificați dublu că niciun angajat nu lucrează fără contract.'
  },
  {
    id: 'rm-02',
    violation: 'Neînregistrarea contractului de muncă în Revisal',
    legalBasis: 'Legea 53/2003, art. 260',
    fineMin: 5000,
    fineMax: 10000,
    category: 'Relații de muncă',
    frequency: 'foarte frecvent',
    preventionTip: 'Înregistrați contractul în Revisal cu cel puțin o zi înainte de începerea activității. Păstrați confirmarea de înregistrare.'
  },
  {
    id: 'rm-03',
    violation: 'Neplata salariului la termen sau sub salariul minim',
    legalBasis: 'Legea 53/2003, art. 260',
    fineMin: 10000,
    fineMax: 20000,
    category: 'Relații de muncă',
    frequency: 'frecvent',
    preventionTip: 'Plătiți salarii la data stabilită în CIM. Verificați că niciun salariu nu este sub minimul legal pe economie (3700 RON brut în 2024).'
  },
  {
    id: 'rm-04',
    violation: 'Lipsa evidenței orelor de muncă (pontaj)',
    legalBasis: 'Legea 53/2003, art. 260',
    fineMin: 5000,
    fineMax: 10000,
    category: 'Relații de muncă',
    frequency: 'frecvent',
    preventionTip: 'Țineți evidența zilnică a orelor lucrate (pontaj manual sau electronic). Păstrați documentele minim 3 ani.'
  },
  {
    id: 'rm-05',
    violation: 'Depășirea programului legal de lucru fără acordul angajatului',
    legalBasis: 'Legea 53/2003, art. 260',
    fineMin: 5000,
    fineMax: 10000,
    category: 'Relații de muncă',
    frequency: 'moderat',
    preventionTip: 'Respectați programul de 8h/zi, 40h/săptămână. Orele suplimentare necesită acord scris și sunt plătite conform legii.'
  },
  {
    id: 'ssm-08',
    violation: 'Neînregistrarea și neinvestigarea accidentelor de muncă',
    legalBasis: 'Legea 319/2006, art. 27',
    fineMin: 15000,
    fineMax: 30000,
    category: 'SSM',
    frequency: 'moderat',
    preventionTip: 'Raportați IMEDIAT accidentele către ITM (24h pentru cele grave). Efectuați cercetare și întocmiți documentația completă.'
  },
  {
    id: 'ssm-09',
    violation: 'Utilizarea de echipamente de lucru fără verificare tehnică valabilă',
    legalBasis: 'Legea 319/2006, art. 16',
    fineMin: 10000,
    fineMax: 20000,
    category: 'SSM',
    frequency: 'frecvent',
    preventionTip: 'Verificați periodic echipamentele de lucru (ISCIR pentru cele sub presiune, ridicat, electronice). Păstrați certificatele valabile.'
  },
  {
    id: 'rm-06',
    violation: 'Discriminare sau hărțuire la locul de muncă',
    legalBasis: 'OG 137/2000, Legea 53/2003',
    fineMin: 10000,
    fineMax: 30000,
    category: 'Relații de muncă',
    frequency: 'moderat',
    preventionTip: 'Implementați politici anti-discriminare și anti-hărțuire. Instruiți managementul și asigurați canale de raportare confidențiale.'
  }
];

/**
 * Helper function pentru filtrare după categorie
 */
export const getSanctiuniByCategory = (category: SanctiuneITM['category']) => {
  return sanctiuniITM.filter(s => s.category === category);
};

/**
 * Helper function pentru calculul valorii medii a amenzii
 */
export const getAverageFine = (sanctiune: SanctiuneITM) => {
  return (sanctiune.fineMin + sanctiune.fineMax) / 2;
};

/**
 * Helper function pentru calculul riscului total pe categorii
 */
export const getTotalRiskByCategory = () => {
  const categories = ['SSM', 'PSI', 'Relații de muncă'] as const;
  return categories.map(category => {
    const sanctiuni = getSanctiuniByCategory(category);
    const totalMaxFine = sanctiuni.reduce((sum, s) => sum + s.fineMax, 0);
    const count = sanctiuni.length;
    return { category, count, totalMaxFine };
  });
};
