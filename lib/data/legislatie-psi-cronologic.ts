/**
 * Baza de date a actelor normative PSI (Prevenire și Stingere Incendii)
 * Ordonată cronologic, cu acte legislative cheie din România
 */

export interface LegislativePSI {
  id: string;
  type: 'lege' | 'ordonanta' | 'hotarare' | 'ordin' | 'normativ';
  number: string;
  year: number;
  title: string;
  publishedIn: string;
  status: 'activ' | 'abrogat' | 'modificat';
  keyObligations: string[];
}

export const legislatiePSICronologic: LegislativePSI[] = [
  {
    id: 'og-60-1997',
    type: 'ordonanta',
    number: '60',
    year: 1997,
    title: 'Ordonanța Guvernului nr. 60/1997 privind organizarea și funcționarea Inspectoratului General pentru Situații de Urgență',
    publishedIn: 'M. Of. nr. 193 din 19 august 1997',
    status: 'modificat',
    keyObligations: [
      'Stabilirea cadrului organizatoric al IGSU',
      'Definirea responsabilităților autorităților în domeniul situațiilor de urgență',
      'Reglementarea structurii inspectoratelor județene'
    ]
  },
  {
    id: 'lege-307-2006',
    type: 'lege',
    number: '307',
    year: 2006,
    title: 'Legea nr. 307/2006 privind apărarea împotriva incendiilor',
    publishedIn: 'M. Of. nr. 633 din 21 iulie 2006',
    status: 'activ',
    keyObligations: [
      'Stabilirea responsabilităților persoanelor fizice și juridice în apărarea împotriva incendiilor',
      'Obligativitatea întocmirii documentației de apărare împotriva incendiilor',
      'Verificarea respectării normelor de apărare împotriva incendiilor',
      'Autorizarea personalului de specialitate PSI',
      'Sancționarea contravenției pentru nerespectarea măsurilor de apărare împotriva incendiilor'
    ]
  },
  {
    id: 'omai-163-2007',
    type: 'ordin',
    number: '163',
    year: 2007,
    title: 'OMAI nr. 163/2007 pentru aprobarea Normelor generale de apărare împotriva incendiilor',
    publishedIn: 'M. Of. nr. 216 din 29 martie 2007',
    status: 'activ',
    keyObligations: [
      'Respectarea normelor generale de apărare împotriva incendiilor pentru toate categoriile de construcții',
      'Dotarea cu mijloace de stingere și detectare incendii',
      'Asigurarea căilor de evacuare și a ieșirilor de urgență',
      'Instruirea periodică a personalului în domeniul PSI',
      'Întocmirea planurilor de evacuare și intervenție'
    ]
  },
  {
    id: 'p118-2013',
    type: 'normativ',
    number: 'P118/1',
    year: 2013,
    title: 'Normativ de securitate la incendiu a construcțiilor P118/1-2013',
    publishedIn: 'M. Of. nr. 636 din 15 octombrie 2013',
    status: 'activ',
    keyObligations: [
      'Asigurarea gradului de rezistență la foc a elementelor de construcție',
      'Dimensionarea și amenajarea căilor de evacuare',
      'Stabilirea categoriei de importanță la foc a construcției',
      'Proiectarea și executarea instalațiilor de stingere automată',
      'Compartimentarea la foc a clădirilor'
    ]
  },
  {
    id: 'omai-129-2016',
    type: 'ordin',
    number: '129',
    year: 2016,
    title: 'OMAI nr. 129/2016 privind autorizarea persoanelor fizice și juridice care desfășoară activități de comerț cu produse și/sau de prestări de servicii în domeniul situațiilor de urgență',
    publishedIn: 'M. Of. nr. 700 din 7 septembrie 2016',
    status: 'activ',
    keyObligations: [
      'Autorizarea firmelor care comercializează echipamente PSI',
      'Autorizarea prestatorilor de servicii în domeniul PSI',
      'Verificarea periodică a autorizațiilor',
      'Asigurarea trasabilității produselor PSI'
    ]
  },
  {
    id: 'omai-87-2010',
    type: 'ordin',
    number: '87',
    year: 2010,
    title: 'OMAI nr. 87/2010 privind acreditarea experților tehnici în domeniul apărării împotriva incendiilor',
    publishedIn: 'M. Of. nr. 85 din 4 februarie 2010',
    status: 'activ',
    keyObligations: [
      'Stabilirea condițiilor de acreditare pentru experți tehnici PSI',
      'Reglementarea activității de expertiză tehnică PSI',
      'Menținerea competenței profesionale prin cursuri de actualizare',
      'Elaborarea rapoartelor de expertiză conformă cerințelor legale'
    ]
  },
  {
    id: 'omai-712-2005',
    type: 'ordin',
    number: '712',
    year: 2005,
    title: 'OMAI nr. 712/2005 pentru aprobarea Normelor generale de protecție împotriva incendiilor la păduri, vegetație forestieră și în alte ecosisteme forestiere',
    publishedIn: 'M. Of. nr. 608 din 13 iulie 2005',
    status: 'activ',
    keyObligations: [
      'Aplicarea măsurilor de prevenire a incendiilor de pădure',
      'Organizarea supravegherii și paza pădurilor',
      'Amenajarea benzilor de protecție',
      'Instruirea personalului silvic în domeniul PSI'
    ]
  },
  {
    id: 'omai-180-2016',
    type: 'ordin',
    number: '180',
    year: 2016,
    title: 'OMAI nr. 180/2016 privind aprobarea Normelor generale de apărare împotriva incendiilor la instalaţiile electrice',
    publishedIn: 'M. Of. nr. 967 din 1 decembrie 2016',
    status: 'activ',
    keyObligations: [
      'Proiectarea, executarea și exploatarea instalațiilor electrice conform normelor PSI',
      'Verificarea periodică a instalațiilor electrice',
      'Protecția împotriva suprasarcinilor și scurtcircuitelor',
      'Întreținerea și repararea instalațiilor electrice de personal autorizat'
    ]
  },
  {
    id: 'omai-119-2014',
    type: 'ordin',
    number: '119',
    year: 2014,
    title: 'OMAI nr. 119/2014 privind verificarea, întreținerea, repararea și încărcarea stingătoarelor portative și a celor transportabile',
    publishedIn: 'M. Of. nr. 103 din 10 februarie 2014',
    status: 'activ',
    keyObligations: [
      'Verificarea periodică a stingătoarelor (lunar, semestrial, anual)',
      'Revizuirea tehnică a stingătoarelor la intervale stabilite',
      'Încărcarea stingătoarelor de către personal autorizat',
      'Evidența verificărilor și reparațiilor efectuate'
    ]
  },
  {
    id: 'omai-194-2016',
    type: 'ordin',
    number: '194',
    year: 2016,
    title: 'OMAI nr. 194/2016 pentru aprobarea Normelor de securitate la incendiu pentru mediul construit',
    publishedIn: 'M. Of. nr. 1005 din 13 decembrie 2016',
    status: 'activ',
    keyObligations: [
      'Respectarea distanțelor de siguranță față de alte construcții',
      'Asigurarea accesului autospecialelor de pompieri',
      'Amenajarea hidranților exteriori',
      'Marcarea și semnalizarea mijloacelor și instalațiilor PSI'
    ]
  },
  {
    id: 'omai-670-2015',
    type: 'ordin',
    number: '670',
    year: 2015,
    title: 'OMAI nr. 670/2015 privind clasificarea și încadrarea în categorii de importanță a construcțiilor din punct de vedere al securității la incendiu',
    publishedIn: 'M. Of. nr. 538 bis din 20 iulie 2015',
    status: 'activ',
    keyObligations: [
      'Clasificarea construcțiilor în funcție de importanță (A, B, C, D)',
      'Stabilirea cerințelor suplimentare pentru fiecare categorie',
      'Evaluarea riscului de incendiu',
      'Dimensionarea corespunzătoare a măsurilor de protecție'
    ]
  },
  {
    id: 'omai-95-2007',
    type: 'ordin',
    number: '95',
    year: 2007,
    title: 'OMAI nr. 95/2007 privind criteriile de performanță pentru sistemele de semnalizare, alarmare și alertare în caz de incendiu',
    publishedIn: 'M. Of. nr. 123 bis din 19 februarie 2007',
    status: 'activ',
    keyObligations: [
      'Instalarea sistemelor de detecție și alarmare la incendiu',
      'Verificarea periodică a funcționării sistemelor',
      'Mentenanța preventivă a instalațiilor',
      'Testarea lunară a semnalelor de alarmă'
    ]
  },
  {
    id: 'omai-132-2007',
    type: 'ordin',
    number: '132',
    year: 2007,
    title: 'OMAI nr. 132/2007 privind aprobarea Normelor specifice de apărare împotriva incendiilor pentru laboratoare, activități de cercetare-dezvoltare și activități didactice',
    publishedIn: 'M. Of. nr. 191 din 21 martie 2007',
    status: 'activ',
    keyObligations: [
      'Aplicarea măsurilor specifice pentru laboratoare și spații de cercetare',
      'Depozitarea și manipularea în siguranță a substanțelor periculoase',
      'Dotarea cu echipamente PSI adecvate riscurilor',
      'Instruirea specifică a personalului de cercetare'
    ]
  },
  {
    id: 'omai-353-2013',
    type: 'ordin',
    number: '353',
    year: 2013,
    title: 'OMAI nr. 353/2013 privind aprobarea Normelor de securitate la incendiu pentru blocuri de locuințe',
    publishedIn: 'M. Of. nr. 223 din 18 aprilie 2013',
    status: 'activ',
    keyObligations: [
      'Asigurarea funcționării căilor de evacuare în blocuri',
      'Verificarea hidranților interiori',
      'Instruirea locatarilor privind măsurile PSI',
      'Menținerea în funcțiune a instalațiilor de detectare/alarmare'
    ]
  },
  {
    id: 'omai-121-2015',
    type: 'ordin',
    number: '121',
    year: 2015,
    title: 'OMAI nr. 121/2015 privind completarea OMAI nr. 163/2007 pentru aprobarea Normelor generale de apărare împotriva incendiilor',
    publishedIn: 'M. Of. nr. 141 din 26 februarie 2015',
    status: 'activ',
    keyObligations: [
      'Actualizarea obligațiilor privind planurile de evacuare',
      'Completarea cerințelor pentru instalațiile de detecție',
      'Reglementarea verificărilor periodice',
      'Modificări privind documentația PSI'
    ]
  },
  {
    id: 'omai-199-2018',
    type: 'ordin',
    number: '199',
    year: 2018,
    title: 'OMAI nr. 199/2018 privind aprobarea Normelor de securitate la incendiu pentru substanțe și preparate periculoase',
    publishedIn: 'M. Of. nr. 1067 din 18 decembrie 2018',
    status: 'activ',
    keyObligations: [
      'Clasificarea și etichetarea substanțelor periculoase conform reglementărilor',
      'Depozitarea în condiții de siguranță a materialelor inflamabile',
      'Asigurarea ventilației adecvate în spațiile de depozitare',
      'Elaborarea planurilor de intervenție pentru substanțe periculoase'
    ]
  },
  {
    id: 'omai-97-2010',
    type: 'ordin',
    number: '97',
    year: 2010,
    title: 'OMAI nr. 97/2010 privind aprobarea Normelor specifice de apărare împotriva incendiilor pentru spectacole, evenimente culturale, festivaluri și manifestări similare',
    publishedIn: 'M. Of. nr. 125 din 25 februarie 2010',
    status: 'activ',
    keyObligations: [
      'Obținerea acordului ISU pentru evenimente cu peste 150 participanți',
      'Asigurarea căilor de evacuare și a ieșirilor de urgență',
      'Dotarea cu echipamente PSI portabile',
      'Instruirea personalului de securitate privind evacuarea',
      'Întocmirea planului de intervenție pentru evenimente'
    ]
  },
  {
    id: 'omai-168-2010',
    type: 'ordin',
    number: '168',
    year: 2010,
    title: 'OMAI nr. 168/2010 privind aprobarea Normelor specifice de apărare împotriva incendiilor pentru muzeul, biblioteci, arhive, case memoriale și alte instituții de cultură',
    publishedIn: 'M. Of. nr. 298 din 6 mai 2010',
    status: 'activ',
    keyObligations: [
      'Protecția patrimoniului cultural împotriva incendiilor',
      'Instalarea sistemelor automate de detecție și stingere',
      'Limitarea accesului publicului în zonele cu risc ridicat',
      'Depozitarea corespunzătoare a materialelor valoroase'
    ]
  },
  {
    id: 'omai-141-2008',
    type: 'ordin',
    number: '141',
    year: 2008,
    title: 'OMAI nr. 141/2008 privind aprobarea Normelor de securitate la incendiu pentru instalațiile de încălzire',
    publishedIn: 'M. Of. nr. 155 din 29 februarie 2008',
    status: 'activ',
    keyObligations: [
      'Instalarea și exploatarea instalațiilor de încălzire conform normelor PSI',
      'Verificarea periodică a coșurilor și canalelor de fum',
      'Asigurarea ventilației pentru centralele termice',
      'Mentenanța preventivă a instalațiilor de încălzire'
    ]
  },
  {
    id: 'omai-158-2011',
    type: 'ordin',
    number: '158',
    year: 2011,
    title: 'OMAI nr. 158/2011 pentru aprobarea Normelor generale privind dotarea cu echipamente, instalaţii, mijloace de apărare împotriva incendiilor şi instrucţiuni de securitate la incendiu',
    publishedIn: 'M. Of. nr. 240 din 6 aprilie 2011',
    status: 'activ',
    keyObligations: [
      'Stabilirea criteriilor de dotare cu stingătoare și hidranți',
      'Calcularea numărului de stingătoare în funcție de suprafață și risc',
      'Afișarea instrucțiunilor de securitate la incendiu',
      'Marcarea și semnalizarea mijloacelor PSI conform standardelor'
    ]
  }
];

/**
 * Funcție helper pentru filtrare după tip de act
 */
export function filterByType(type: LegislativePSI['type']): LegislativePSI[] {
  return legislatiePSICronologic.filter(act => act.type === type);
}

/**
 * Funcție helper pentru filtrare după status
 */
export function filterByStatus(status: LegislativePSI['status']): LegislativePSI[] {
  return legislatiePSICronologic.filter(act => act.status === status);
}

/**
 * Funcție helper pentru căutare după an
 */
export function filterByYear(year: number): LegislativePSI[] {
  return legislatiePSICronologic.filter(act => act.year === year);
}

/**
 * Funcție helper pentru găsirea unui act specific
 */
export function findById(id: string): LegislativePSI | undefined {
  return legislatiePSICronologic.find(act => act.id === id);
}
