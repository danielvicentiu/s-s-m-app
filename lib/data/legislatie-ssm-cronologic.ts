/**
 * Acte normative SSM (Securitate și Sănătate în Muncă) - Ordine cronologică
 * Baza legislativă pentru compliance SSM în România
 */

export interface LegislativeAct {
  id: string;
  type: 'lege' | 'HG' | 'OUG' | 'ordin' | 'hotarare';
  number: string;
  year: number;
  title: string;
  publishedIn: string;
  status: 'vigoare' | 'abrogat' | 'modificat';
  modifiedBy?: string[];
  keyObligations: string[];
}

export const legislatieSSMCronologic: LegislativeAct[] = [
  {
    id: 'lege-319-2006',
    type: 'lege',
    number: '319',
    year: 2006,
    title: 'Legea securității și sănătății în muncă',
    publishedIn: 'M.Of. nr. 646/26.07.2006',
    status: 'modificat',
    modifiedBy: ['Legea 237/2015', 'OUG 111/2010', 'Legea 136/2020'],
    keyObligations: [
      'Evaluarea riscurilor pentru toate locurile de muncă',
      'Numirea lucrătorilor desemnați sau serviciu extern SSM',
      'Înființarea comitetului de securitate și sănătate în muncă (peste 50 angajați)',
      'Instruirea periodică a lucrătorilor',
      'Supravegherea sănătății lucrătorilor',
      'Asigurarea echipamentelor de protecție individuală',
    ],
  },
  {
    id: 'hg-1425-2006',
    type: 'HG',
    number: '1425',
    year: 2006,
    title: 'Normele metodologice de aplicare a Legii 319/2006',
    publishedIn: 'M.Of. nr. 882/30.10.2006',
    status: 'modificat',
    modifiedBy: ['HG 955/2010', 'HG 1091/2006'],
    keyObligations: [
      'Stabilirea numărului minim de lucrători desemnați',
      'Proceduri pentru organizarea serviciului SSM',
      'Stabilirea componentei și atribuțiilor CSSM',
      'Modele de documente SSM obligatorii',
    ],
  },
  {
    id: 'hg-1091-2006',
    type: 'HG',
    number: '1091',
    year: 2006,
    title: 'Cerințe minime de securitate și sănătate pentru locul de muncă',
    publishedIn: 'M.Of. nr. 739/30.08.2006',
    status: 'vigoare',
    keyObligations: [
      'Asigurarea stabilității și solidității clădirilor',
      'Instalații electrice conforme și verificate periodic',
      'Iluminat natural și artificial adecvat',
      'Ventilație și climatizare corespunzătoare',
      'Căi de circulație și evacuare marcate și libere',
    ],
  },
  {
    id: 'hg-1146-2006',
    type: 'HG',
    number: '1146',
    year: 2006,
    title: 'Cerințe minime de securitate și sănătate pentru utilizarea echipamentelor de muncă',
    publishedIn: 'M.Of. nr. 815/04.10.2006',
    status: 'vigoare',
    keyObligations: [
      'Verificarea inițială a echipamentelor de muncă',
      'Verificări periodice conform normelor tehnice',
      'Instruirea lucrătorilor pentru utilizarea echipamentelor',
      'Menținerea echipamentelor în stare corespunzătoare',
    ],
  },
  {
    id: 'hg-1048-2006',
    type: 'HG',
    number: '1048',
    year: 2006,
    title: 'Cerințe minime de securitate și sănătate pentru utilizarea echipamentelor individuale de protecție',
    publishedIn: 'M.Of. nr. 716/21.08.2006',
    status: 'vigoare',
    keyObligations: [
      'Evaluarea necesității EIP pe baza evaluării riscurilor',
      'Asigurarea gratuită a EIP adecvate',
      'Instruirea lucrătorilor pentru utilizarea EIP',
      'Verificarea și întreținerea EIP',
      'Înlocuirea EIP deteriorate',
    ],
  },
  {
    id: 'hg-1028-2006',
    type: 'HG',
    number: '1028',
    year: 2006,
    title: 'Cerințe minime de securitate și sănătate referitoare la munca cu ecrane de vizualizare',
    publishedIn: 'M.Of. nr. 698/14.08.2006',
    status: 'vigoare',
    keyObligations: [
      'Evaluarea posturilor de lucru cu ecrane',
      'Organizarea activității cu pauze sau schimbări de activitate',
      'Examinări oftalmologice periodice',
      'Asigurarea ergonomiei postului de lucru',
    ],
  },
  {
    id: 'hg-1218-2006',
    type: 'HG',
    number: '1218',
    year: 2006,
    title: 'Stabilirea cerințelor minime de securitate și sănătate pentru semnalizarea de securitate',
    publishedIn: 'M.Of. nr. 660/01.08.2006',
    status: 'vigoare',
    keyObligations: [
      'Amplasarea panourilor de securitate conform evaluării riscurilor',
      'Marcarea căilor de evacuare și a ieșirilor de urgență',
      'Semnalizarea substanțelor și preparatelor periculoase',
      'Întreținerea și verificarea semnalizării',
    ],
  },
  {
    id: 'ordin-508-2002',
    type: 'ordin',
    number: '508',
    year: 2002,
    title: 'Aprobarea Normelor generale de protecție a muncii',
    publishedIn: 'M.Of. nr. 581/09.08.2002',
    status: 'vigoare',
    keyObligations: [
      'Aplicarea măsurilor generale de protecție a muncii',
      'Asigurarea echipamentelor de prim ajutor',
      'Organizarea serviciului medical de medicina muncii',
      'Stabilirea măsurilor de protecție specifice activității',
    ],
  },
  {
    id: 'hg-1092-2006',
    type: 'HG',
    number: '1092',
    year: 2006,
    title: 'Cerințe minime pentru îmbunătățirea securității și protecția sănătății lucrătorilor',
    publishedIn: 'M.Of. nr. 790/13.09.2006',
    status: 'vigoare',
    keyObligations: [
      'Protecția lucrătorilor expuși la azbest',
      'Monitorizarea concentrației de fibre de azbest',
      'Înregistrarea lucrătorilor expuși',
      'Supraveghere medicală specială',
    ],
  },
  {
    id: 'hg-1136-2006',
    type: 'HG',
    number: '1136',
    year: 2006,
    title: 'Cerințe minime de securitate și sănătate la locurile de muncă din industria extractivă',
    publishedIn: 'M.Of. nr. 784/12.09.2006',
    status: 'vigoare',
    keyObligations: [
      'Elaborarea documentului de securitate și sănătate',
      'Numirea persoanelor responsabile cu supravegherea',
      'Asigurarea sistemelor de ventilație și evacuare',
      'Plan de urgență și exerciții periodice',
    ],
  },
  {
    id: 'hg-1093-2006',
    type: 'HG',
    number: '1093',
    year: 2006,
    title: 'Cerințe minime privind securitatea și sănătatea lucrătorilor în mine',
    publishedIn: 'M.Of. nr. 750/01.09.2006',
    status: 'vigoare',
    keyObligations: [
      'Evaluarea riscurilor specifice activităților miniere',
      'Întocmirea planului de funcționare a minei',
      'Asigurarea ventilației adecvate',
      'Monitorizarea atmosferei subterane',
    ],
  },
  {
    id: 'hg-1147-2006',
    type: 'HG',
    number: '1147',
    year: 2006,
    title: 'Protecția lucrătorilor împotriva riscurilor legate de expunerea la agenți biologici',
    publishedIn: 'M.Of. nr. 824/06.10.2006',
    status: 'vigoare',
    keyObligations: [
      'Identificarea și evaluarea riscurilor biologice',
      'Clasificarea agenților biologici în grupe de risc',
      'Implementarea măsurilor de prevenire și control',
      'Supraveghere medicală specială pentru lucrătorii expuși',
      'Vaccinare când este cazul',
    ],
  },
  {
    id: 'hg-1090-2006',
    type: 'HG',
    number: '1090',
    year: 2006,
    title: 'Protecția lucrătorilor împotriva riscurilor determinate de expunerea la agenți chimici',
    publishedIn: 'M.Of. nr. 723/23.08.2006',
    status: 'vigoare',
    keyObligations: [
      'Evaluarea riscurilor chimice',
      'Întocmirea listei substanțelor chimice utilizate',
      'Asigurarea fișelor de securitate',
      'Măsuri de prevenire a expunerii',
      'Monitorizarea expunerii lucrătorilor',
    ],
  },
  {
    id: 'hg-1107-2006',
    type: 'HG',
    number: '1107',
    year: 2006,
    title: 'Protecția lucrătorilor împotriva riscurilor legate de expunerea la agenți cancerigeni sau mutageni',
    publishedIn: 'M.Of. nr. 788/13.09.2006',
    status: 'vigoare',
    keyObligations: [
      'Identificarea agenților cancerigeni/mutageni',
      'Înlocuirea cu substanțe mai puțin periculoase',
      'Limitarea numărului de lucrători expuși',
      'Supraveghere medicală specială',
      'Evidența lucrătorilor expuși (40 ani)',
    ],
  },
  {
    id: 'hg-1876-2005',
    type: 'HG',
    number: '1876',
    year: 2005,
    title: 'Cerințe minime de securitate și sănătate privind expunerea lucrătorilor la riscuri generate de vibrații',
    publishedIn: 'M.Of. nr. 1222/30.12.2005',
    status: 'vigoare',
    keyObligations: [
      'Evaluarea nivelului de vibrații',
      'Respectarea valorilor limită de expunere',
      'Măsuri tehnice și organizatorice de reducere',
      'Supraveghere medicală pentru lucrătorii expuși',
    ],
  },
  {
    id: 'hg-493-2006',
    type: 'HG',
    number: '493',
    year: 2006,
    title: 'Cerințe minime de securitate și sănătate privind expunerea lucrătorilor la zgomot',
    publishedIn: 'M.Of. nr. 404/09.05.2006',
    status: 'vigoare',
    keyObligations: [
      'Măsurarea nivelului de zgomot la locurile de muncă',
      'Respectarea valorilor limită de expunere (87 dB)',
      'Asigurarea echipamentelor de protecție auditivă',
      'Controale audiometrice periodice',
    ],
  },
  {
    id: 'hg-971-2006',
    type: 'HG',
    number: '971',
    year: 2006,
    title: 'Cerințe minime pentru semnalizarea de securitate la locul de muncă',
    publishedIn: 'M.Of. nr. 653/28.07.2006',
    status: 'vigoare',
    keyObligations: [
      'Utilizarea culorilor de securitate conform standardelor',
      'Amplasarea vizibilă a semnalelor de securitate',
      'Întreținerea și curățarea panourilor',
      'Instruirea lucrătorilor privind semnificația semnalelor',
    ],
  },
  {
    id: 'hg-1086-2006',
    type: 'HG',
    number: '1086',
    year: 2006,
    title: 'Protecția lucrătorilor împotriva riscurilor legate de expunerea la câmpuri electromagnetice',
    publishedIn: 'M.Of. nr. 726/24.08.2006',
    status: 'vigoare',
    keyObligations: [
      'Evaluarea expunerii la câmpuri electromagnetice',
      'Respectarea valorilor limită de expunere',
      'Informarea lucrătorilor despre riscuri',
      'Supraveghere medicală pentru lucrătorii expuși',
    ],
  },
  {
    id: 'lege-307-2006',
    type: 'lege',
    number: '307',
    year: 2006,
    title: 'Legea privind apărarea împotriva incendiilor',
    publishedIn: 'M.Of. nr. 633/21.07.2006',
    status: 'modificat',
    modifiedBy: ['Legea 77/2016', 'OUG 70/2020'],
    keyObligations: [
      'Autorizație de securitate la incendiu pentru toate clădirile',
      'Scenario de securitate la incendiu',
      'Instruirea lucrătorilor în domeniul PSI',
      'Verificarea periodică a instalațiilor și mijloacelor PSI',
      'Planuri de evacuare și exerciții periodice',
    ],
  },
  {
    id: 'ordin-163-2007',
    type: 'ordin',
    number: '163',
    year: 2007,
    title: 'Aprobarea Normelor generale de apărare împotriva incendiilor',
    publishedIn: 'M.Of. nr. 121 bis/19.02.2007',
    status: 'vigoare',
    keyObligations: [
      'Dotarea cu mijloace de stingere a incendiilor',
      'Verificarea instalațiilor electrice',
      'Organizarea serviciului privat de urgență',
      'Întocmirea planurilor de intervenție',
    ],
  },
  {
    id: 'hg-955-2010',
    type: 'HG',
    number: '955',
    year: 2010,
    title: 'Modificarea HG 1425/2006 privind normele metodologice de aplicare a Legii 319/2006',
    publishedIn: 'M.Of. nr. 692/14.10.2010',
    status: 'vigoare',
    keyObligations: [
      'Actualizarea structurii serviciului de SSM',
      'Noi modele de documente SSM',
      'Completări privind CSSM',
    ],
  },
  {
    id: 'oug-111-2010',
    type: 'OUG',
    number: '111',
    year: 2010,
    title: 'Concediul de odihnă anual - modificări Legea 319/2006',
    publishedIn: 'M.Of. nr. 838/14.12.2010',
    status: 'vigoare',
    keyObligations: [
      'Acordarea concediului de odihnă suplimentar pentru condiții nocive',
      'Evidența condițiilor speciale de muncă',
    ],
  },
  {
    id: 'lege-319-2006-modif-2015',
    type: 'lege',
    number: '237',
    year: 2015,
    title: 'Modificarea și completarea Legii 319/2006',
    publishedIn: 'M.Of. nr. 682/08.09.2015',
    status: 'vigoare',
    keyObligations: [
      'Noi obligații pentru serviciile externe SSM',
      'Autorizarea consultanților SSM',
      'Sancțiuni majorate pentru nerespectarea legislației',
    ],
  },
  {
    id: 'lege-136-2020',
    type: 'lege',
    number: '136',
    year: 2020,
    title: 'Modificarea Legii 319/2006 - măsuri pentru detașare și muncă temporară',
    publishedIn: 'M.Of. nr. 549/25.06.2020',
    status: 'vigoare',
    keyObligations: [
      'Obligații SSM pentru lucrătorii detașați',
      'Obligații pentru firmele de muncă temporară',
      'Informarea lucrătorilor temporari',
    ],
  },
  {
    id: 'ordin-1030-2006',
    type: 'ordin',
    number: '1030',
    year: 2006,
    title: 'Aprobarea normelor de supraveghere a sănătății lucrătorilor',
    publishedIn: 'M.Of. nr. 882/30.10.2006',
    status: 'vigoare',
    keyObligations: [
      'Controlul medical la angajare',
      'Controale medicale periodice',
      'Examinări medicale la reluarea activității',
      'Fișa de aptitudine medicală',
    ],
  },
  {
    id: 'hg-1139-2007',
    type: 'HG',
    number: '1139',
    year: 2007,
    title: 'Controlul aplicării legislației în domeniul securității și sănătății în muncă',
    publishedIn: 'M.Of. nr. 658/26.09.2007',
    status: 'vigoare',
    keyObligations: [
      'Organizarea controalelor de către Inspectoratul de Muncă',
      'Categorii de abateri și sancțiuni',
      'Proceduri de verificare a conformității',
    ],
  },
  {
    id: 'ordin-1050-2021',
    type: 'ordin',
    number: '1050',
    year: 2021,
    title: 'Registrul general de evidență a salariaților - date SSM',
    publishedIn: 'M.Of. nr. 969/13.10.2021',
    status: 'vigoare',
    keyObligations: [
      'Evidența instruirilor SSM în REVISAL',
      'înregistrarea echipamentelor de protecție',
      'Raportarea accidentelor de muncă',
    ],
  },
  {
    id: 'hg-1425-2006-modif-2022',
    type: 'HG',
    number: '905',
    year: 2022,
    title: 'Completarea HG 1425/2006 - telemuncă și lucru la distanță',
    publishedIn: 'M.Of. nr. 1048/31.10.2022',
    status: 'vigoare',
    keyObligations: [
      'Evaluarea riscurilor pentru telemuncă',
      'Obligații SSM pentru munca la distanță',
      'Instruirea lucrătorilor care lucrează remote',
    ],
  },
  {
    id: 'ordin-1176-2022',
    type: 'ordin',
    number: '1176',
    year: 2022,
    title: 'Autorizarea consultanților de securitate și sănătate în muncă',
    publishedIn: 'M.Of. nr. 1203/15.12.2022',
    status: 'vigoare',
    keyObligations: [
      'Obținerea autorizației de exercitare a profesiei de consultant SSM',
      'Pregătire profesională și examene periodice',
      'Asigurare de răspundere civilă profesională',
      'Raportare anuală a activității',
    ],
  },
  {
    id: 'lege-177-2023',
    type: 'lege',
    number: '177',
    year: 2023,
    title: 'Modificarea Legii 319/2006 - sănătate mintală la locul de muncă',
    publishedIn: 'M.Of. nr. 543/14.06.2023',
    status: 'vigoare',
    keyObligations: [
      'Evaluarea riscurilor psihosociale',
      'Măsuri de prevenire a stresului și hărțuirii',
      'Politici de well-being la locul de muncă',
      'Raportarea incidentelor de hărțuire',
    ],
  },
];

/**
 * Filtrare acte normative după status
 */
export function getActsByStatus(status: LegislativeAct['status']): LegislativeAct[] {
  return legislatieSSMCronologic.filter((act) => act.status === status);
}

/**
 * Filtrare acte normative după tip
 */
export function getActsByType(type: LegislativeAct['type']): LegislativeAct[] {
  return legislatieSSMCronologic.filter((act) => act.type === type);
}

/**
 * Căutare act normativ după ID
 */
export function getActById(id: string): LegislativeAct | undefined {
  return legislatieSSMCronologic.find((act) => act.id === id);
}

/**
 * Filtrare acte normative după an
 */
export function getActsByYear(year: number): LegislativeAct[] {
  return legislatieSSMCronologic.filter((act) => act.year === year);
}

/**
 * Statistici legislație
 */
export function getLegislationStats() {
  return {
    total: legislatieSSMCronologic.length,
    vigoare: getActsByStatus('vigoare').length,
    modificat: getActsByStatus('modificat').length,
    abrogat: getActsByStatus('abrogat').length,
    byType: {
      lege: getActsByType('lege').length,
      hg: getActsByType('HG').length,
      oug: getActsByType('OUG').length,
      ordin: getActsByType('ordin').length,
      hotarare: getActsByType('hotarare').length,
    },
  };
}
