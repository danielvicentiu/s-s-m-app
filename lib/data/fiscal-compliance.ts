/**
 * Obligații fiscale frecvente pentru firmele din România
 * Date actualizate conform Codului Fiscal 2025
 */

export interface FiscalObligation {
  id: string;
  obligation: string;
  deadline: string;
  frequency: 'lunar' | 'trimestrial' | 'anual' | 'ocazional';
  authority: string;
  penalty: string;
  formCode: string;
  description: string;
  legalBasis?: string;
}

export const fiscalObligations: FiscalObligation[] = [
  {
    id: 'fiscal-001',
    obligation: 'Declarație TVA (D300)',
    deadline: 'Până pe 25 ale lunii următoare',
    frequency: 'lunar',
    authority: 'ANAF',
    penalty: 'Între 500-2.000 RON pentru nedepunere sau depunere cu întârziere',
    formCode: 'D300',
    description: 'Declarație privind obligațiile de plată a TVA. Obligatorie pentru plătitorii de TVA înregistrați conform art. 316 din Codul Fiscal.',
    legalBasis: 'Art. 156³, Codul Fiscal'
  },
  {
    id: 'fiscal-002',
    obligation: 'Declarație privind obligațiile de plată la bugetul de stat (D100)',
    deadline: 'Până pe 25 ale lunii următoare',
    frequency: 'lunar',
    authority: 'ANAF',
    penalty: 'Între 500-2.000 RON pentru nedepunere',
    formCode: 'D100',
    description: 'Declarație unică pentru impozitul pe profit, impozit pe venit, și alte obligații fiscale. Include veniturile obținute din România și din străinătate.',
    legalBasis: 'Art. 107, Codul Fiscal'
  },
  {
    id: 'fiscal-003',
    obligation: 'Declarație privind obligațiile de plată contribuții sociale (D112)',
    deadline: 'Până pe 25 ale lunii următoare',
    frequency: 'lunar',
    authority: 'ANAF',
    penalty: 'Între 500-2.000 RON pentru nedepunere',
    formCode: 'D112',
    description: 'Declarație pentru contribuțiile sociale (CAS, CASS) datorate de angajatori pentru salariați și de persoanele care obțin venituri din activități independente.',
    legalBasis: 'OUG 115/2023'
  },
  {
    id: 'fiscal-004',
    obligation: 'Registrul de evidență fiscală (D390)',
    deadline: 'Până pe 25 ale lunii următoare',
    frequency: 'lunar',
    authority: 'ANAF',
    penalty: 'Între 500-1.000 RON pentru necompletare sau completare incorectă',
    formCode: 'D390',
    description: 'Registrul de evidență fiscală pentru mărfuri aflate în custodie sau în regim de magazin neautorizat. Depus de plătitorii de TVA care dețin astfel de mărfuri.',
    legalBasis: 'Art. 315³, Codul Fiscal'
  },
  {
    id: 'fiscal-005',
    obligation: 'Declarație informativă privind livrările/prestările și achizițiile (D394)',
    deadline: 'Până pe 25 ale lunii următoare',
    frequency: 'lunar',
    authority: 'ANAF',
    penalty: 'Între 1.000-5.000 RON pentru nedepunere',
    formCode: 'D394',
    description: 'Declarație recapitulativă privind livrările/prestările efectuate în România și achizițiile intracomunitare. Obligatorie pentru plătitorii de TVA.',
    legalBasis: 'Art. 156⁴, Codul Fiscal'
  },
  {
    id: 'fiscal-006',
    obligation: 'Declarație VIES pentru operațiuni intracomunitare',
    deadline: 'Până pe 25 ale lunii următoare',
    frequency: 'lunar',
    authority: 'ANAF',
    penalty: 'Între 2.000-5.000 RON pentru nedepunere',
    formCode: 'D390',
    description: 'Declarație recapitulativă privind livrările/achizițiile intracomunitare de bunuri și prestările de servicii. Obligatorie pentru operatori economici care efectuează operațiuni cu ceilalți membri UE.',
    legalBasis: 'Art. 325, Codul Fiscal'
  },
  {
    id: 'fiscal-007',
    obligation: 'Declarație de impozit pe profit (D101)',
    deadline: 'Până pe 25 ale lunii următoare trimestrului',
    frequency: 'trimestrial',
    authority: 'ANAF',
    penalty: 'Între 500-2.000 RON pentru nedepunere',
    formCode: 'D101',
    description: 'Declarație privind impozitul pe profit datorat de societățile comerciale și alte entități juridice. Include calculul profitului impozabil și impozitului aferent.',
    legalBasis: 'Art. 35, Codul Fiscal'
  },
  {
    id: 'fiscal-008',
    obligation: 'Declarație privind impozitul pe veniturile microîntreprinderilor (D100)',
    deadline: 'Până pe 25 ale lunii următoare trimestrului',
    frequency: 'trimestrial',
    authority: 'ANAF',
    penalty: 'Între 500-2.000 RON pentru nedepunere',
    formCode: 'D100',
    description: 'Declarație pentru microîntreprinderi care aplică impozit pe cifra de afaceri de 1% sau 3%. Obligatorie pentru firmele cu venituri sub 500.000 EUR și cel mult 9 angajați.',
    legalBasis: 'Art. 52¹, Codul Fiscal'
  },
  {
    id: 'fiscal-009',
    obligation: 'Situații financiare anuale (Bilanț contabil)',
    deadline: 'Până pe 30 aprilie ale anului următor',
    frequency: 'anual',
    authority: 'ANAF',
    penalty: 'Între 1.000-5.000 RON pentru nedepunere',
    formCode: 'Bilanț',
    description: 'Situații financiare anuale: bilanț, cont de profit și pierdere, situația modificărilor capitalului propriu, situația fluxurilor de trezorerie, note explicative. Depuse electronic la ANAF.',
    legalBasis: 'OMFP 1802/2014'
  },
  {
    id: 'fiscal-010',
    obligation: 'Declarație anuală privind impozitul pe profit (D101)',
    deadline: 'Până pe 25 martie ale anului următor',
    frequency: 'anual',
    authority: 'ANAF',
    penalty: 'Între 1.000-3.000 RON pentru nedepunere',
    formCode: 'D101',
    description: 'Declarație anuală de regularizare a impozitului pe profit. Include reconcilierea dintre rezultatul contabil și profitul impozabil.',
    legalBasis: 'Art. 35, Codul Fiscal'
  },
  {
    id: 'fiscal-011',
    obligation: 'Declarație nominală privind impozitul pe veniturile din salarii și asimilate salariilor (D112)',
    deadline: 'Până pe 25 februarie ale anului următor',
    frequency: 'anual',
    authority: 'ANAF',
    penalty: 'Între 500-2.000 RON pentru nedepunere',
    formCode: 'D112',
    description: 'Declarație nominală cu datele fiecărui salariat: venituri realizate, impozite și contribuții reținute. Include formular pentru fiecare persoană cu venituri din salarii.',
    legalBasis: 'Art. 120, Codul Fiscal'
  },
  {
    id: 'fiscal-012',
    obligation: 'Declarație privind cifra de afaceri pentru microîntreprinderi',
    deadline: 'Până pe 31 ianuarie ale anului următor',
    frequency: 'anual',
    authority: 'ANAF',
    penalty: 'Între 500-2.000 RON pentru nedepunere sau nerespectarea termenului',
    formCode: 'D100',
    description: 'Declarație privind cifra de afaceri realizată în anul precedent. Determină dacă firma rămâne în sistemul microîntreprinderilor sau trece la impozit pe profit.',
    legalBasis: 'Art. 52¹, Codul Fiscal'
  },
  {
    id: 'fiscal-013',
    obligation: 'Declarație privind veniturile și cheltuielile pentru persoane impozabile (D200)',
    deadline: 'Până pe 25 mai ale anului următor',
    frequency: 'anual',
    authority: 'ANAF',
    penalty: 'Între 500-2.000 RON pentru nedepunere',
    formCode: 'D200',
    description: 'Declarație unică privind impozitul pe venit și contribuțiile sociale datorate de persoane fizice. Include veniturile din activități independente, arendă, cedarea folosinței bunurilor, investiții, pensii, alte surse.',
    legalBasis: 'Art. 120, Codul Fiscal'
  },
  {
    id: 'fiscal-014',
    obligation: 'Declarație de menționare a operațiunilor intracomunitare (INTRASTAT)',
    deadline: 'Până pe data de 15 ale lunii următoare',
    frequency: 'lunar',
    authority: 'ANAF / INS (Institutul Național de Statistică)',
    penalty: 'Între 5.000-10.000 RON pentru nedepunere',
    formCode: 'INTRASTAT',
    description: 'Declarație statistică pentru operatorii economici care realizează schimburi intracomunitare peste pragul legal (arrivals: 900.000 RON, dispatches: 600.000 RON). Include date detaliate despre natura mărfurilor.',
    legalBasis: 'Regulamentul (UE) 638/2004'
  },
  {
    id: 'fiscal-015',
    obligation: 'Notificare privind tranzacțiile intracomunitare/internaționale (D406)',
    deadline: 'Înainte de efectuarea operațiunii',
    frequency: 'ocazional',
    authority: 'ANAF',
    penalty: 'Între 2.000-5.000 RON pentru nenotificare',
    formCode: 'D406',
    description: 'Notificare privind tranzacțiile cu risc fiscal ridicat: livrări intracomunitare succesive, operațiuni triunghiulare, transferuri de bunuri. Obligatorie înainte de efectuarea operațiunii.',
    legalBasis: 'Art. 325², Codul Fiscal'
  }
];

/**
 * Filtrare obligații după frecvență
 */
export function getObligationsByFrequency(frequency: FiscalObligation['frequency']): FiscalObligation[] {
  return fiscalObligations.filter(o => o.frequency === frequency);
}

/**
 * Căutare obligație după cod formular
 */
export function getObligationByFormCode(formCode: string): FiscalObligation | undefined {
  return fiscalObligations.find(o => o.formCode === formCode);
}

/**
 * Obține toate obligațiile lunare
 */
export function getMonthlyObligations(): FiscalObligation[] {
  return getObligationsByFrequency('lunar');
}

/**
 * Obține toate obligațiile trimestriale
 */
export function getQuarterlyObligations(): FiscalObligation[] {
  return getObligationsByFrequency('trimestrial');
}

/**
 * Obține toate obligațiile anuale
 */
export function getAnnualObligations(): FiscalObligation[] {
  return getObligationsByFrequency('anual');
}
