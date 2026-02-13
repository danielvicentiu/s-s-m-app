/**
 * Baza de date cu actele normative principale SSM (Securitate și Sănătate în Muncă) din România
 * Sursa oficială: legislatie.just.ro
 */

export interface ActNormativ {
  id: string;
  title: string;
  number: string;
  year: number;
  type: 'lege' | 'HG' | 'OUG' | 'ordin';
  description: string;
  domain: string[];
  status: 'in_vigoare' | 'abrogat' | 'modificat';
  url: string;
  publishedDate?: string;
  notes?: string;
}

export const LEGISLATIE_SSM: ActNormativ[] = [
  {
    id: 'legea-319-2006',
    title: 'Legea securității și sănătății în muncă',
    number: '319',
    year: 2006,
    type: 'lege',
    description: 'Actul normativ cadru privind securitatea și sănătatea în muncă în România. Stabilește drepturile și obligațiile angajatorilor și angajaților în domeniul SSM.',
    domain: ['SSM', 'Cadru general'],
    status: 'in_vigoare',
    url: 'https://legislatie.just.ro/Public/DetaliiDocument/73871',
    publishedDate: '2006-07-26',
    notes: 'Act normativ de bază pentru orice activitate SSM'
  },
  {
    id: 'hg-1425-2006',
    title: 'Normele metodologice de aplicare a prevederilor Legii securității și sănătății în muncă nr. 319/2006',
    number: '1425',
    year: 2006,
    type: 'HG',
    description: 'Normele metodologice care detaliază aplicarea prevederilor Legii 319/2006. Include prevederi privind evaluarea riscurilor, instructajele, echipamentele de protecție și organizarea activității de SSM.',
    domain: ['SSM', 'Norme metodologice'],
    status: 'in_vigoare',
    url: 'https://legislatie.just.ro/Public/DetaliiDocument/77300',
    publishedDate: '2006-12-28'
  },
  {
    id: 'hg-355-2007',
    title: 'Supravegherea sănătății lucrătorilor',
    number: '355',
    year: 2007,
    type: 'HG',
    description: 'Stabilește cerințele pentru supravegherea medicală a lucrătorilor, examenele medicale periodice, fișele de aptitudine și obligațiile medicului de medicina muncii.',
    domain: ['SSM', 'Medicina muncii'],
    status: 'in_vigoare',
    url: 'https://legislatie.just.ro/Public/DetaliiDocument/81830',
    publishedDate: '2007-04-04',
    notes: 'Esențial pentru evidența medicală în platformă'
  },
  {
    id: 'hg-1048-2006',
    title: 'Cerințe minime de securitate și sănătate pentru utilizarea de către lucrători a echipamentelor de muncă',
    number: '1048',
    year: 2006,
    type: 'HG',
    description: 'Stabilește cerințele minime de securitate pentru echipamentele de lucru, verificările periodice obligatorii și autorizările necesare.',
    domain: ['SSM', 'Echipamente de muncă'],
    status: 'in_vigoare',
    url: 'https://legislatie.just.ro/Public/DetaliiDocument/75793',
    publishedDate: '2006-09-20',
    notes: 'Relevantă pentru modulul Equipment'
  },
  {
    id: 'hg-971-2006',
    title: 'Cerințe minime pentru semnalizarea de securitate și/sau sănătate la locul de muncă',
    number: '971',
    year: 2006,
    type: 'HG',
    description: 'Reglementează utilizarea semnelor de securitate (interzicere, avertizare, obligare, salvare, stingere incendii) la locul de muncă.',
    domain: ['SSM', 'PSI', 'Semnalizare'],
    status: 'in_vigoare',
    url: 'https://legislatie.just.ro/Public/DetaliiDocument/75044',
    publishedDate: '2006-08-30'
  },
  {
    id: 'hg-1091-2006',
    title: 'Cerințe minime de securitate și sănătate pentru locul de muncă',
    number: '1091',
    year: 2006,
    type: 'HG',
    description: 'Stabilește cerințele privind amenajarea locurilor de muncă, ventilație, iluminat, căi de circulație, facilitați pentru lucrători.',
    domain: ['SSM', 'Locuri de muncă'],
    status: 'in_vigoare',
    url: 'https://legislatie.just.ro/Public/DetaliiDocument/76136',
    publishedDate: '2006-10-04'
  },
  {
    id: 'hg-1146-2006',
    title: 'Cerințe minime de securitate și sănătate privind utilizarea de către lucrători a echipamentelor individuale de protecție la locul de muncă',
    number: '1146',
    year: 2006,
    type: 'HG',
    description: 'Reglementează alegerea, utilizarea și întreținerea echipamentelor individuale de protecție (EIP). Obligativitatea furnizării gratuite către angajați.',
    domain: ['SSM', 'EIP'],
    status: 'in_vigoare',
    url: 'https://legislatie.just.ro/Public/DetaliiDocument/76502',
    publishedDate: '2006-10-18',
    notes: 'Fundamentală pentru dotarea angajaților'
  },
  {
    id: 'hg-1136-2006',
    title: 'Cerințe minime de securitate și sănătate la locurile de muncă cu operații în atmosfere explozive',
    number: '1136',
    year: 2006,
    type: 'HG',
    description: 'Stabilește măsurile de prevenire a exploziilor, clasificarea zonelor ATEX și utilizarea echipamentelor în atmosfere explozive.',
    domain: ['SSM', 'ATEX', 'Risc exploziv'],
    status: 'in_vigoare',
    url: 'https://legislatie.just.ro/Public/DetaliiDocument/76438',
    publishedDate: '2006-10-18'
  },
  {
    id: 'hg-1218-2006',
    title: 'Cerințe minime de securitate și sănătate privind expunerea lucrătorilor la riscuri generate de câmpuri electromagnetice',
    number: '1218',
    year: 2006,
    type: 'HG',
    description: 'Protecția lucrătorilor expuși la radiații electromagnetice, valori limită de expunere și obligații de evaluare.',
    domain: ['SSM', 'Câmpuri electromagnetice'],
    status: 'in_vigoare',
    url: 'https://legislatie.just.ro/Public/DetaliiDocument/76855',
    publishedDate: '2006-11-08'
  },
  {
    id: 'hg-1092-2006',
    title: 'Cerințe minime privind securitatea și sănătatea lucrătorilor pentru ameliorarea protecției în timpul lucrului la înălțime',
    number: '1092',
    year: 2006,
    type: 'HG',
    description: 'Protecția lucrătorilor care efectuează lucrări la înălțime, utilizarea schelelor, platformelor și a echipamentelor de protecție împotriva căderilor.',
    domain: ['SSM', 'Lucru la înălțime'],
    status: 'in_vigoare',
    url: 'https://legislatie.just.ro/Public/DetaliiDocument/76143',
    publishedDate: '2006-10-04',
    notes: 'Important pentru construcții și mentenanță'
  },
  {
    id: 'hg-300-2006',
    title: 'Cerințe minime de securitate și sănătate pentru șantierele temporare sau mobile',
    number: '300',
    year: 2006,
    type: 'HG',
    description: 'Stabilește măsurile de SSM specifice șantierelor de construcții, inclusiv planul de securitate și sănătate (PSS) și coordonarea SSM.',
    domain: ['SSM', 'Construcții', 'Șantiere'],
    status: 'in_vigoare',
    url: 'https://legislatie.just.ro/Public/DetaliiDocument/71175',
    publishedDate: '2006-04-12'
  },
  {
    id: 'ordin-508-2002',
    title: 'Aprobarea Normelor generale de protecție a muncii',
    number: '508',
    year: 2002,
    type: 'ordin',
    description: 'Norme generale tehnice de protecție a muncii aplicabile în toate domeniile de activitate. Include prevederi detaliate pentru diverse tipuri de activități și echipamente.',
    domain: ['SSM', 'Norme generale'],
    status: 'in_vigoare',
    url: 'https://legislatie.just.ro/Public/DetaliiDocument/36654',
    publishedDate: '2002-08-08',
    notes: 'Complementar Legii 319/2006'
  },
  {
    id: 'legea-307-2006',
    title: 'Legea privind apărarea împotriva incendiilor',
    number: '307',
    year: 2006,
    type: 'lege',
    description: 'Actul normativ cadru pentru prevenirea și stingerea incendiilor (PSI). Stabilește responsabilitățile în domeniul apărării împotriva incendiilor.',
    domain: ['PSI'],
    status: 'in_vigoare',
    url: 'https://legislatie.just.ro/Public/DetaliiDocument/73593',
    publishedDate: '2006-07-12',
    notes: 'Componenta PSI a platformei'
  },
  {
    id: 'hg-1492-2004',
    title: 'Normele metodologice pentru autorizarea efectuării activităților de verificare, de întreținere, reparare și de revizie tehnică a mijloacelor tehnice de apărare împotriva incendiilor',
    number: '1492',
    year: 2004,
    type: 'HG',
    description: 'Reglementează activitățile de verificare și întreținere a instalațiilor și echipamentelor PSI (stingătoare, hidranți, detectoare, etc.).',
    domain: ['PSI', 'Verificări tehnice'],
    status: 'in_vigoare',
    url: 'https://legislatie.just.ro/Public/DetaliiDocument/55046',
    publishedDate: '2004-09-22'
  },
  {
    id: 'ordin-163-2007',
    title: 'Aprobarea Normelor generale de apărare împotriva incendiilor',
    number: '163',
    year: 2007,
    type: 'ordin',
    description: 'Norme tehnice detaliate pentru prevenirea și stingerea incendiilor în diverse tipuri de clădiri și activități. Include obligații privind instrucțiunile PSI și evacuarea.',
    domain: ['PSI', 'Norme generale'],
    status: 'in_vigoare',
    url: 'https://legislatie.just.ro/Public/DetaliiDocument/80002',
    publishedDate: '2007-02-28',
    notes: 'Fundamentală pentru compliance PSI'
  }
];

/**
 * Filtrează actele normative după domeniu
 */
export function getByDomain(domain: string): ActNormativ[] {
  return LEGISLATIE_SSM.filter(act => act.domain.includes(domain));
}

/**
 * Filtrează actele normative după status
 */
export function getByStatus(status: ActNormativ['status']): ActNormativ[] {
  return LEGISLATIE_SSM.filter(act => act.status === status);
}

/**
 * Filtrează actele normative după tip
 */
export function getByType(type: ActNormativ['type']): ActNormativ[] {
  return LEGISLATIE_SSM.filter(act => act.type === type);
}

/**
 * Caută un act normativ după ID
 */
export function getById(id: string): ActNormativ | undefined {
  return LEGISLATIE_SSM.find(act => act.id === id);
}

/**
 * Returnează toate actele normative în vigoare
 */
export function getActiveActs(): ActNormativ[] {
  return getByStatus('in_vigoare');
}

/**
 * Returnează doar actele SSM (exclude PSI exclusive)
 */
export function getSSMOnly(): ActNormativ[] {
  return LEGISLATIE_SSM.filter(act =>
    act.domain.includes('SSM') || act.domain.includes('Cadru general')
  );
}

/**
 * Returnează doar actele PSI
 */
export function getPSIOnly(): ActNormativ[] {
  return LEGISLATIE_SSM.filter(act =>
    act.domain.includes('PSI') && !act.domain.includes('SSM')
  );
}
