/**
 * Legislație SSM Ungaria
 * 10 acte normative principale privind securitatea și sănătatea în muncă
 */

export interface LegislatieHU {
  id: string;
  title: string;
  titleHU: string;
  number: string;
  year: number;
  domain: 'ssm' | 'psi' | 'medicina_muncii' | 'general';
  description: string;
}

export const legislatieHU: LegislatieHU[] = [
  {
    id: 'hu-1',
    title: 'Legea privind securitatea și sănătatea în muncii',
    titleHU: '1993. évi XCIII. törvény a munkavédelemről',
    number: '1993. évi XCIII.',
    year: 1993,
    domain: 'ssm',
    description: 'Legea fundamentală privind securitatea și sănătatea în muncă în Ungaria. Stabilește cerințele generale pentru protecția lucrătorilor și obligațiile angajatorilor.',
  },
  {
    id: 'hu-2',
    title: 'Codul Muncii',
    titleHU: '2012. évi I. törvény a Munka Törvénykönyvéről',
    number: '2012. évi I.',
    year: 2012,
    domain: 'general',
    description: 'Codul Muncii maghiar care include prevederi privind relațiile de muncă, drepturile și obligațiile angajatorilor și angajaților, inclusiv aspecte de SSM.',
  },
  {
    id: 'hu-3',
    title: 'Decret privind regulile detaliate de securitate și sănătate în muncă',
    titleHU: '5/1993. (XII. 26.) MüM rendelet a munkavédelmi szabályzat készítéséről',
    number: '5/1993. (XII. 26.) MüM',
    year: 1993,
    domain: 'ssm',
    description: 'Decret care stabilește cerințele pentru elaborarea regulamentului de securitate și sănătate în muncă la nivelul fiecărei organizații.',
  },
  {
    id: 'hu-4',
    title: 'Decret privind serviciile de medicină a muncii',
    titleHU: '27/1995. (VII. 25.) NM rendelet az üzemorvosi szolgálatról',
    number: '27/1995. (VII. 25.) NM',
    year: 1995,
    domain: 'medicina_muncii',
    description: 'Reglementează organizarea și funcționarea serviciilor de medicină a muncii, controlul medical periodic și aptitudinea la locul de muncă.',
  },
  {
    id: 'hu-5',
    title: 'Decret privind instruirea în domeniul securității și sănătății în muncă',
    titleHU: '10/2001. (VIII. 3.) SzCsM rendelet a munkavédelmi képzés részletes követelményeiről',
    number: '10/2001. (VIII. 3.) SzCsM',
    year: 2001,
    domain: 'ssm',
    description: 'Stabilește cerințele detaliate pentru instruirea lucrătorilor în domeniul SSM, periodicitatea și conținutul programelor de formare.',
  },
  {
    id: 'hu-6',
    title: 'Decret privind echipamentele individuale de protecție',
    titleHU: '16/1998. (VIII. 17.) IKIM rendelet az egyéni védőeszközökről',
    number: '16/1998. (VIII. 17.) IKIM',
    year: 1998,
    domain: 'ssm',
    description: 'Reglementează utilizarea echipamentelor individuale de protecție, criteriile de selecție, distribuire și întreținere.',
  },
  {
    id: 'hu-7',
    title: 'Decret privind protecția împotriva incendiilor',
    titleHU: '54/2014. (XII. 5.) BM rendelet az Országos Tűzvédelmi Szabályzatról',
    number: '54/2014. (XII. 5.) BM',
    year: 2014,
    domain: 'psi',
    description: 'Regulamentul Național de Protecție Împotriva Incendiilor care stabilește cerințele de prevenire și stingere a incendiilor în toate tipurile de clădiri și activități.',
  },
  {
    id: 'hu-8',
    title: 'Decret privind protecția lucrătorilor împotriva riscurilor legate de agenți chimici',
    titleHU: '25/2000. (IX. 30.) EüM-SzCsM együttes rendelet a munkahelyek kémiai biztonságáról',
    number: '25/2000. (IX. 30.) EüM-SzCsM',
    year: 2000,
    domain: 'ssm',
    description: 'Stabilește măsurile de protecție a lucrătorilor expuși la agenți chimici periculoși, inclusiv evaluarea riscurilor și măsurile de prevenire.',
  },
  {
    id: 'hu-9',
    title: 'Decret privind cerințele minime de securitate pentru utilizarea echipamentelor de muncă',
    titleHU: '14/2004. (IV. 19.) FMM rendelet a munkaeszközök és használatuk biztonsági követelményeiről',
    number: '14/2004. (IV. 19.) FMM',
    year: 2004,
    domain: 'ssm',
    description: 'Stabilește cerințele minime de securitate pentru utilizarea în siguranță a echipamentelor de muncă, inclusiv mașini, utilaje și scule.',
  },
  {
    id: 'hu-10',
    title: 'Decret privind protecția lucrătorilor împotriva zgomotului și vibrațiilor',
    titleHU: '22/2005. (VI. 24.) EüM rendelet a munkavállalók munkahelyi zajexpozíciójáról',
    number: '22/2005. (VI. 24.) EüM',
    year: 2005,
    domain: 'ssm',
    description: 'Reglementează protecția lucrătorilor împotriva riscurilor datorate expunerii la zgomot și vibrații, valorile limită și măsurile de prevenire.',
  },
];
