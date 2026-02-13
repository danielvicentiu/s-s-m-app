/**
 * Tipuri de contracte de muncă în România
 * Conform Legii nr. 53/2003 (Codul Muncii) actualizat
 */

export interface ContractType {
  id: string;
  name: string;
  code: string;
  description: string;
  maxDuration: string | null; // null = nedeterminat
  specificObligations: string[];
}

export const CONTRACT_TYPES: ContractType[] = [
  {
    id: 'cim-nedeterminat',
    name: 'Contract Individual de Muncă pe Durată Nedeterminată',
    code: 'CIM-ND',
    description: 'Contractul standard de muncă, fără termen de încetare prestabilit. Oferă cea mai mare stabilitate pentru angajat.',
    maxDuration: null,
    specificObligations: [
      'Perioada de probă: max 90 zile (max 5 zile pentru funcții de execuție)',
      'Preaviz demisie: min 20 zile lucrătoare (poate fi prelungit prin CCM)',
      'Concediu de odihnă: min 20 zile lucrătoare/an',
      'Fișa postului obligatorie',
      'Instructaj SSM la angajare și periodic',
      'Control medical la angajare și periodic (dacă este cazul)',
      'Evaluare anuală a performanței (recomandat)',
    ],
  },
  {
    id: 'cim-determinat',
    name: 'Contract Individual de Muncă pe Durată Determinată',
    code: 'CIM-DD',
    description: 'Contract cu termen de încetare prestabilit, utilizat pentru necesități temporare sau proiecte cu durată limitată.',
    maxDuration: '36 luni (3 ani)',
    specificObligations: [
      'Durata maximă: 36 luni, inclusiv prelungiri',
      'Prelungiri: maxim 3 prelungiri consecutive',
      'Al 4-lea contract → devine automat nedeterminat',
      'Motivele legale: înlocuire angajat absent, creștere temporară activitate, lucrări sezoniere, lansare activitate nouă',
      'Perioada de probă: max 45 zile (max 5 zile pentru funcții de execuție)',
      'Încetare automată la expirare (fără preaviz necesar)',
      'Toate obligațiile CIM nedeterminat (SSM, medical, fișa postului)',
    ],
  },
  {
    id: 'cim-part-time',
    name: 'Contract Individual de Muncă cu Normă Parțială (Part-Time)',
    code: 'CIM-PT',
    description: 'Contract cu program de lucru redus față de norma completă (8h/zi, 40h/săptămână). Poate fi nedeterminat sau determinat.',
    maxDuration: null, // sau determinat, în funcție de caz
    specificObligations: [
      'Program: mai puțin de 8h/zi sau 40h/săptămână',
      'Salariu proporțional cu timpul lucrat',
      'Concediu de odihnă proporțional (min 20 zile pentru normă întreagă)',
      'Contribuții sociale calculate proporțional',
      'Interzis orele suplimentare (cu excepții limitate)',
      'Posibilitate de cumulare cu alte contracte part-time',
      'Mențiune obligatorie în contract: număr ore/zi și zile/săptămână',
      'Toate obligațiile SSM și medicale standard',
    ],
  },
  {
    id: 'cim-telemunca',
    name: 'Contract Individual de Muncă în Regim de Telemuncă',
    code: 'CIM-TM',
    description: 'Contract pentru muncă prestată în afara sediului angajatorului, folosind tehnologia informației (Legea 81/2018).',
    maxDuration: null,
    specificObligations: [
      'Acord scris obligatoriu pentru telemuncă',
      'Specificarea locului/locurilor de muncă (domiciliu, coworking, etc.)',
      'Angajatorul asigură și întreține echipamentele necesare',
      'Program de lucru flexibil sau fix (stabilit în contract)',
      'Drept de deconectare garantat',
      'Angajatorul suportă costurile: energie, internet, telefon (proporțional)',
      'Evaluare riscuri SSM specifice telemuncii',
      'Control SSM cu preaviz de 24h (cu acordul angajatului pentru domiciliu)',
      'Dreptul angajatului de a reveni la lucru la sediu',
      'Aceleași drepturi ca angajații de la sediu',
    ],
  },
  {
    id: 'cim-domiciliu',
    name: 'Contract Individual de Muncă la Domiciliu',
    code: 'CIM-DOM',
    description: 'Contract pentru activități desfășurate la domiciliul angajatului, cu sau fără utilaje/echipamente furnizate de angajator.',
    maxDuration: null,
    specificObligations: [
      'Activități: confecții, asamblare, ambalare, prelucrări etc.',
      'Specificarea în contract: tipul muncii, cantitate, termen predare',
      'Furnizarea de materii prime/materiale de către angajator',
      'Predare-primire rezultate documentată',
      'Plată în funcție de producție realizată (dacă e cazul)',
      'Interzis pentru activități periculoase sau cu substanțe toxice',
      'Evaluare riscuri SSM la domiciliu (cu acordul angajatului)',
      'Asigurare pentru eventuale daune la echipamente',
      'Program de lucru flexibil, cu termene de livrare',
    ],
  },
  {
    id: 'cim-zilier',
    name: 'Contract Individual de Muncă pentru Zilieri',
    code: 'CIM-ZIL',
    description: 'Contract pentru muncă prestată ocazional, plătită zilnic, în agricultură, construcții sau alte domenii sezoniere.',
    maxDuration: '24 luni cumulat în 3 ani',
    specificObligations: [
      'Durată: maxim 90 zile/an calendaristic per angajator',
      'Maxim 24 luni cumulat în ultimii 3 ani (pentru același angajator)',
      'Depășire limite → devine CIM nedeterminat',
      'Declarare în Revisal în termen de 1 oră de la începere',
      'Plată zilnică sau la final de perioadă',
      'Fără perioadă de probă',
      'Instructaj SSM obligatoriu la fiecare angajare',
      'Fără preaviz la încetare (de nicio parte)',
      'Contribuții sociale calculate zilnic',
      'Domenii: agricultură, silvicultură, construcții, turism',
    ],
  },
  {
    id: 'contract-pfa',
    name: 'Contract de Prestări Servicii cu PFA/II',
    code: 'PFA',
    description: 'Contract civil (nu contract de muncă) între angajator și Persoană Fizică Autorizată sau Întreprinzător Individual.',
    maxDuration: null,
    specificObligations: [
      'NU este contract de muncă (relație civilă, nu de subordonare)',
      'PFA/II lucrează independent, fără program impus',
      'Fără concediu de odihnă, concediu medical sau alte drepturi de angajat',
      'Plată conform factură emisă de PFA/II',
      'Fără obligații SSM pentru angajator (PFA răspunde pentru propria securitate)',
      'Fără contribuții sociale din partea beneficiarului',
      'Contract civil: obiect, termen, preț, penalități',
      'Risc: dacă există subordonare → poate fi recalificat ca CIM de ITM',
      'Indicatori subordonare: program fix, control zilnic, exclusivitate, utilizare echipamente angajator',
    ],
  },
  {
    id: 'cim-sezonier',
    name: 'Contract Individual de Muncă Sezonier',
    code: 'CIM-SEZ',
    description: 'Contract pentru activități ce se desfășoară în mod repetat, în anumite perioade ale anului (anotimpuri, sărbători).',
    maxDuration: '9 luni/an calendaristic',
    specificObligations: [
      'Activități sezoniere: agricultură, turism, HoReCa, comerț sărbători',
      'Perioada maximă: 9 luni în decursul unui an calendaristic',
      'Reangajare: dacă angajatul este rechemat în 3 sezoane consecutive → devine nedeterminat',
      'Mențiune obligatorie în contract: caracter sezonier + perioada',
      'Perioada de probă: max 5-15 zile (în funcție de calificare)',
      'Instructaj SSM la fiecare sezon',
      'Plată conform perioadei lucrate',
      'Concediu de odihnă: proporțional cu timpul lucrat',
      'Prioritate la reangajare în sezonul următor',
    ],
  },
];

/**
 * Helper function pentru verificarea duratei maxime
 */
export function getContractTypeById(id: string): ContractType | undefined {
  return CONTRACT_TYPES.find((ct) => ct.id === id);
}

/**
 * Helper function pentru filtrare după cod
 */
export function getContractTypeByCode(code: string): ContractType | undefined {
  return CONTRACT_TYPES.find((ct) => ct.code === code);
}

/**
 * Helper function pentru contracte cu durată determinată
 */
export function getDeterminedDurationContracts(): ContractType[] {
  return CONTRACT_TYPES.filter((ct) => ct.maxDuration !== null);
}

/**
 * Helper function pentru contracte cu durată nedeterminată
 */
export function getIndeterminateDurationContracts(): ContractType[] {
  return CONTRACT_TYPES.filter((ct) => ct.maxDuration === null);
}
