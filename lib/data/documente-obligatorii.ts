/**
 * Documente obligatorii pentru angajatori conform legislației SSM/PSI din România
 *
 * Categorii:
 * - SSM: Securitatea și Sănătatea în Muncă
 * - PSI: Prevenirea și Stingerea Incendiilor
 * - SU: Situații de Urgență
 * - medicalSurveillance: Supraveghere Medicală
 */

export interface DocumentObligatoriu {
  id: string;
  name: string;
  category: 'SSM' | 'PSI' | 'SU' | 'medicalSurveillance';
  legalBasis: string;
  updateFrequency: 'odata' | 'anual' | 'biennial' | 'laModificare' | 'lunar' | 'trimestrial';
  responsibleRole: 'consultant' | 'angajator' | 'lucratorDesemnat';
  template: boolean;
  sampleContent: string;
}

export const documenteObligatorii: DocumentObligatoriu[] = [
  // SSM - Securitatea și Sănătatea în Muncă
  {
    id: 'ssm-001',
    name: 'Plan de prevenire și protecție',
    category: 'SSM',
    legalBasis: 'Legea 319/2006, art. 13',
    updateFrequency: 'anual',
    responsibleRole: 'consultant',
    template: true,
    sampleContent: 'Planul cuprinde: identificarea riscurilor, măsuri de prevenire, resurse necesare, responsabilități, termene de implementare, proceduri de monitorizare.'
  },
  {
    id: 'ssm-002',
    name: 'Evaluarea riscurilor pentru fiecare loc de muncă',
    category: 'SSM',
    legalBasis: 'HG 1091/2006',
    updateFrequency: 'laModificare',
    responsibleRole: 'consultant',
    template: true,
    sampleContent: 'Identificarea factorilor de risc fizici, chimici, biologici, psihosociali; evaluarea nivelului de risc; stabilirea măsurilor de prevenire și protecție.'
  },
  {
    id: 'ssm-003',
    name: 'Fișa individuală de evaluare a riscurilor',
    category: 'SSM',
    legalBasis: 'HG 1091/2006, art. 6',
    updateFrequency: 'laModificare',
    responsibleRole: 'consultant',
    template: true,
    sampleContent: 'Fișă personalizată pentru fiecare angajat cu riscurile specifice postului, măsuri de protecție, EIP necesare, instruire.'
  },
  {
    id: 'ssm-004',
    name: 'Registrul de instructaj SSM (registrul de introductiv-general)',
    category: 'SSM',
    legalBasis: 'Ordinul 1432/2011',
    updateFrequency: 'odata',
    responsibleRole: 'angajator',
    template: false,
    sampleContent: 'Registru cu instructajul introductiv-general pentru toți angajații noi, cu semnături și date.'
  },
  {
    id: 'ssm-005',
    name: 'Registrul de instructaj la locul de muncă',
    category: 'SSM',
    legalBasis: 'Ordinul 1432/2011',
    updateFrequency: 'odata',
    responsibleRole: 'lucratorDesemnat',
    template: false,
    sampleContent: 'Registru cu instructajul periodic (lunar, trimestrial, anual) pentru fiecare angajat la locul de muncă.'
  },
  {
    id: 'ssm-006',
    name: 'Fișa de aptitudini psihologice (pentru posturi cu risc deosebit)',
    category: 'SSM',
    legalBasis: 'HG 355/2007',
    updateFrequency: 'biennial',
    responsibleRole: 'angajator',
    template: false,
    sampleContent: 'Evaluare psihologică pentru posturi cu risc crescut (operator utilaje, electrician, șofer transport persoane).'
  },
  {
    id: 'ssm-007',
    name: 'Programul de instruire SSM',
    category: 'SSM',
    legalBasis: 'Ordinul 1432/2011',
    updateFrequency: 'anual',
    responsibleRole: 'consultant',
    template: true,
    sampleContent: 'Program anual de instruire cu tematică, responsabili, participanți, periodicitate (introductiv, la locul de muncă, periodic).'
  },
  {
    id: 'ssm-008',
    name: 'Proceduri proprii SSM (proceduri operaționale)',
    category: 'SSM',
    legalBasis: 'Legea 319/2006, art. 10',
    updateFrequency: 'laModificare',
    responsibleRole: 'consultant',
    template: true,
    sampleContent: 'Proceduri pentru activități cu risc: lucru la înălțime, în spații confinate, cu substanțe chimice, operare utilaje.'
  },
  {
    id: 'ssm-009',
    name: 'Registrul de evidență a accidentelor de muncă',
    category: 'SSM',
    legalBasis: 'Legea 319/2006, art. 19',
    updateFrequency: 'odata',
    responsibleRole: 'angajator',
    template: false,
    sampleContent: 'Registru de evidență a tuturor accidentelor de muncă (ușoare, grave, colective, mortale), cu date victimă, cauze, măsuri.'
  },
  {
    id: 'ssm-010',
    name: 'Declarația de accident (în caz de accident)',
    category: 'SSM',
    legalBasis: 'HG 1425/2006',
    updateFrequency: 'laModificare',
    responsibleRole: 'angajator',
    template: true,
    sampleContent: 'Formular standard pentru declararea accidentului de muncă la ITM în termen de 24 ore.'
  },
  {
    id: 'ssm-011',
    name: 'Fișa de accident de muncă',
    category: 'SSM',
    legalBasis: 'HG 1425/2006, Anexa 2',
    updateFrequency: 'laModificare',
    responsibleRole: 'angajator',
    template: true,
    sampleContent: 'Fișă detaliată cu datele accidentului: victimă, circumstanțe, cauze tehnice și organizatorice, măsuri corective.'
  },
  {
    id: 'ssm-012',
    name: 'Autorizația de funcționare din punct de vedere SSM',
    category: 'SSM',
    legalBasis: 'Legea 319/2006, art. 9',
    updateFrequency: 'odata',
    responsibleRole: 'angajator',
    template: false,
    sampleContent: 'Autorizație eliberată de ITM după verificarea conformității cu cerințele SSM (pentru unități noi sau modificări majore).'
  },
  {
    id: 'ssm-013',
    name: 'Comitetul de securitate și sănătate în muncă (CSSM) - proces verbal ședință',
    category: 'SSM',
    legalBasis: 'Legea 319/2006, art. 18',
    updateFrequency: 'trimestrial',
    responsibleRole: 'lucratorDesemnat',
    template: true,
    sampleContent: 'Proces verbal de ședință trimestrială CSSM cu ordinea de zi, decizii, măsuri stabilite, responsabili, termene.'
  },
  {
    id: 'ssm-014',
    name: 'Fișa de post cu atribuții SSM',
    category: 'SSM',
    legalBasis: 'Codul Muncii, art. 17',
    updateFrequency: 'laModificare',
    responsibleRole: 'angajator',
    template: true,
    sampleContent: 'Fișa de post pentru fiecare angajat cu responsabilități și obligații SSM specifice postului ocupat.'
  },

  // PSI - Prevenirea și Stingerea Incendiilor
  {
    id: 'psi-001',
    name: 'Scenariul de securitate la incendiu',
    category: 'PSI',
    legalBasis: 'Legea 307/2006, art. 12',
    updateFrequency: 'laModificare',
    responsibleRole: 'consultant',
    template: true,
    sampleContent: 'Scenariu detaliat cu descrierea locației, riscuri de incendiu, măsuri de prevenire, căi de evacuare, puncte de adunare.'
  },
  {
    id: 'psi-002',
    name: 'Planul de evacuare (plan afișat)',
    category: 'PSI',
    legalBasis: 'Legea 307/2006, art. 13',
    updateFrequency: 'laModificare',
    responsibleRole: 'consultant',
    template: true,
    sampleContent: 'Plan grafic afișat cu căile de evacuare, ieșiri de urgență, puncte de adunare, locația stingătoarelor și hidranților.'
  },
  {
    id: 'psi-003',
    name: 'Autorizația/Acordul de securitate la incendiu (ASI)',
    category: 'PSI',
    legalBasis: 'Legea 307/2006, art. 10',
    updateFrequency: 'odata',
    responsibleRole: 'angajator',
    template: false,
    sampleContent: 'Acord/Autorizație eliberată de ISU după verificarea conformității cu cerințele de securitate la incendiu.'
  },
  {
    id: 'psi-004',
    name: 'Registrul de instructaj PSI',
    category: 'PSI',
    legalBasis: 'Ordinul MAI 163/2007',
    updateFrequency: 'odata',
    responsibleRole: 'lucratorDesemnat',
    template: false,
    sampleContent: 'Registru cu instructajele PSI (introductiv, periodic, la locul de muncă) pentru toți angajații.'
  },
  {
    id: 'psi-005',
    name: 'Programul de instruire PSI',
    category: 'PSI',
    legalBasis: 'Ordinul MAI 163/2007',
    updateFrequency: 'anual',
    responsibleRole: 'consultant',
    template: true,
    sampleContent: 'Program anual de instruire PSI cu tematică, responsabili, periodicitate, grup țintă.'
  },
  {
    id: 'psi-006',
    name: 'Fișa de verificare tehnică a stingătoarelor',
    category: 'PSI',
    legalBasis: 'Legea 307/2006',
    updateFrequency: 'anual',
    responsibleRole: 'angajator',
    template: false,
    sampleContent: 'Fișă cu verificarea anuală/reîncărcarea stingătoarelor efectuată de o firmă autorizată.'
  },
  {
    id: 'psi-007',
    name: 'Registrul de evidență a stingătoarelor',
    category: 'PSI',
    legalBasis: 'Legea 307/2006',
    updateFrequency: 'odata',
    responsibleRole: 'angajator',
    template: false,
    sampleContent: 'Registru cu toate stingătoarele (nr. inventar, tip, locație, dată verificare, dată expirare).'
  },
  {
    id: 'psi-008',
    name: 'Dispoziție de organizare a activității de PSI',
    category: 'PSI',
    legalBasis: 'Legea 307/2006, art. 16',
    updateFrequency: 'laModificare',
    responsibleRole: 'angajator',
    template: true,
    sampleContent: 'Dispoziție scrisă a angajatorului cu desemnarea responsabilului PSI și a echipei de intervenție.'
  },

  // SU - Situații de Urgență
  {
    id: 'su-001',
    name: 'Planul de protecție și intervenție în situații de urgență',
    category: 'SU',
    legalBasis: 'Legea 481/2004',
    updateFrequency: 'anual',
    responsibleRole: 'consultant',
    template: true,
    sampleContent: 'Plan cu scenarii de risc (incendiu, cutremur, inundație, accident chimic), proceduri de alertare, evacuare, intervenție.'
  },
  {
    id: 'su-002',
    name: 'Registrul de instruire în domeniul situațiilor de urgență',
    category: 'SU',
    legalBasis: 'Legea 481/2004',
    updateFrequency: 'odata',
    responsibleRole: 'lucratorDesemnat',
    template: false,
    sampleContent: 'Registru cu instructajele pentru situații de urgență (cutremur, inundație, accidente tehnologice).'
  },
  {
    id: 'su-003',
    name: 'Fișa de verificare a sistemului de alarmare',
    category: 'SU',
    legalBasis: 'OUG 21/2004',
    updateFrequency: 'lunar',
    responsibleRole: 'lucratorDesemnat',
    template: false,
    sampleContent: 'Verificare lunară a sistemului de alarmare (sirenă, sistem PA, butoane de alarmă), cu semnături responsabil.'
  },

  // Supraveghere Medicală
  {
    id: 'med-001',
    name: 'Fișa de expunere la factori de risc profesional',
    category: 'medicalSurveillance',
    legalBasis: 'Ordinul 1913/2006',
    updateFrequency: 'anual',
    responsibleRole: 'consultant',
    template: true,
    sampleContent: 'Fișă individuală cu factorii de risc la care este expus angajatul (zgomot, praf, chimicale, vibrații).'
  },
  {
    id: 'med-002',
    name: 'Avizul medical de medicina muncii (pentru fiecare angajat)',
    category: 'medicalSurveillance',
    legalBasis: 'Legea 319/2006, art. 27',
    updateFrequency: 'anual',
    responsibleRole: 'angajator',
    template: false,
    sampleContent: 'Aviz medical eliberat de medicul de medicina muncii (la angajare, periodic anual/biennial, la reluarea activității).'
  },
  {
    id: 'med-003',
    name: 'Registrul de evidență a lucrătorilor expuși la factori de risc',
    category: 'medicalSurveillance',
    legalBasis: 'Ordinul 1913/2006',
    updateFrequency: 'anual',
    responsibleRole: 'angajator',
    template: false,
    sampleContent: 'Registru cu toți angajații expuși la factori de risc (nume, post, factori, măsurători, control medical).'
  },
  {
    id: 'med-004',
    name: 'Contract de medicina muncii',
    category: 'medicalSurveillance',
    legalBasis: 'Legea 319/2006, art. 27',
    updateFrequency: 'anual',
    responsibleRole: 'angajator',
    template: false,
    sampleContent: 'Contract cu cabinet/centru de medicina muncii autorizat pentru controlul medical periodic al angajaților.'
  },

  // Documente generale obligatorii
  {
    id: 'gen-001',
    name: 'Regulament intern (cu secțiune SSM/PSI)',
    category: 'SSM',
    legalBasis: 'Codul Muncii, art. 242',
    updateFrequency: 'laModificare',
    responsibleRole: 'angajator',
    template: true,
    sampleContent: 'Regulament intern cu capitole dedicate SSM, PSI, drepturi și obligații angajați/angajator în domeniul SSM/PSI.'
  },
  {
    id: 'gen-002',
    name: 'Contract de prestări servicii SSM (cu consultant extern)',
    category: 'SSM',
    legalBasis: 'Legea 319/2006, art. 14',
    updateFrequency: 'anual',
    responsibleRole: 'angajator',
    template: false,
    sampleContent: 'Contract cu consultant SSM extern autorizat (pentru firme care nu au SSM intern).'
  },
  {
    id: 'gen-003',
    name: 'Dovada dotării cu echipament individual de protecție (EIP)',
    category: 'SSM',
    legalBasis: 'HG 1048/2006',
    updateFrequency: 'laModificare',
    responsibleRole: 'angajator',
    template: false,
    sampleContent: 'Fișe de dotare și bon de consum pentru EIP (mănuși, ochelari, măști, căști, încălțăminte de protecție).'
  },
  {
    id: 'gen-004',
    name: 'Fișa de aptitudini pentru lucrul la înălțime',
    category: 'SSM',
    legalBasis: 'Ordinul 508/2002',
    updateFrequency: 'anual',
    responsibleRole: 'angajator',
    template: false,
    sampleContent: 'Fișă medicală specială pentru angajați care lucrează la înălțime (>2m), cu examen medical specific.'
  },
  {
    id: 'gen-005',
    name: 'Certificat de atestare echipament de lucru (utilaje, scule)',
    category: 'SSM',
    legalBasis: 'HG 1146/2006',
    updateFrequency: 'laModificare',
    responsibleRole: 'angajator',
    template: false,
    sampleContent: 'Certificat de verificare tehnică și atestat CE pentru echipamentele de muncă (utilaje, scule electrice, scări).'
  },
  {
    id: 'gen-006',
    name: 'Raport anual de activitate SSM',
    category: 'SSM',
    legalBasis: 'Legea 319/2006, art. 13',
    updateFrequency: 'anual',
    responsibleRole: 'consultant',
    template: true,
    sampleContent: 'Raport anual cu activități desfășurate, evaluări efectuate, accidente, îmbolnăviri profesionale, măsuri aplicate.'
  },
  {
    id: 'gen-007',
    name: 'Fișa de date de securitate (FDS) pentru substanțe chimice',
    category: 'SSM',
    legalBasis: 'Regulamentul REACH',
    updateFrequency: 'laModificare',
    responsibleRole: 'angajator',
    template: false,
    sampleContent: 'FDS pentru fiecare substanță chimică utilizată, cu informații despre pericole, măsuri de protecție, intervenție.'
  }
];

/**
 * Funcții utile pentru manipularea documentelor obligatorii
 */

export const getDocumenteByCategory = (category: DocumentObligatoriu['category']) => {
  return documenteObligatorii.filter(doc => doc.category === category);
};

export const getDocumenteByResponsible = (role: DocumentObligatoriu['responsibleRole']) => {
  return documenteObligatorii.filter(doc => doc.responsibleRole === role);
};

export const getDocumenteWithTemplates = () => {
  return documenteObligatorii.filter(doc => doc.template === true);
};

export const getDocumentById = (id: string) => {
  return documenteObligatorii.find(doc => doc.id === id);
};

export const countDocumenteByCategory = () => {
  return documenteObligatorii.reduce((acc, doc) => {
    acc[doc.category] = (acc[doc.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};
