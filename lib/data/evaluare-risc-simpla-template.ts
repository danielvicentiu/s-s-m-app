/**
 * Template pentru Evaluarea Riscurilor Simplificată
 * Destinat firmelor mici cu sub 9 angajați
 * Conform Legii 319/2006 și HG 1425/2006
 */

export interface IdentificareFirma {
  denumire: string;
  cui: string;
  adresa: string;
  telefon: string;
  email: string;
  reprezentantLegal: string;
  numarAngajati: number;
  codCAEN: string;
  dataEvaluare: string;
}

export interface DescriereActivitate {
  activitatePrincipala: string;
  proceseTehnologice: string[];
  echipamenteMuncaUtilizate: string[];
  substanteChimiceUtilizate: string[];
  locuriDeMunca: string[];
}

export interface PericulIdentificat {
  id: string;
  denumire: string;
  categorie: 'fizic' | 'chimic' | 'biologic' | 'ergonomic' | 'psihosocial';
  prezent: boolean;
  descriere?: string;
  locuriAfectate?: string[];
}

export interface EvaluareNivelRisc {
  periculId: string;
  probabilitate: 1 | 2 | 3 | 4; // 1=foarte mica, 2=mica, 3=mare, 4=foarte mare
  gravitate: 1 | 2 | 3 | 4; // 1=usoara, 2=medie, 3=grava, 4=foarte grava
  nivelRisc: number; // probabilitate x gravitate (1-16)
  categorieRisc: 'acceptabil' | 'scazut' | 'mediu' | 'ridicat' | 'foarte ridicat';
}

export interface MasuraPreventie {
  id: string;
  periculId: string;
  descriere: string;
  tip: 'eliminare' | 'substitutie' | 'inginerie' | 'organizatorica' | 'epi';
  responsabil: string;
  termen: string;
  cost?: string;
  prioritate: 'urgent' | 'ridicat' | 'mediu' | 'scazut';
  status: 'planificat' | 'in_implementare' | 'finalizat';
}

export interface EvaluareRiscSimpla {
  id?: string;
  organizationId?: string;
  identificareFirma: IdentificareFirma;
  descriereActivitate: DescriereActivitate;
  pericoleIdentificate: PericulIdentificat[];
  evaluariRisc: EvaluareNivelRisc[];
  masuriPreventie: MasuraPreventie[];
  dataEvaluare: string;
  evaluator: {
    nume: string;
    functie: string;
    semnatura?: string;
  };
  reprezentantFirma: {
    nume: string;
    functie: string;
    semnatura?: string;
  };
}

/**
 * Checklist cu 20 pericole comune pentru firme mici
 */
export const PERICOLE_COMUNE: Omit<PericulIdentificat, 'prezent' | 'descriere' | 'locuriAfectate'>[] = [
  // Pericole fizice
  {
    id: 'P01',
    denumire: 'Căderi la același nivel (pardoseli alunecoase, denivelări)',
    categorie: 'fizic'
  },
  {
    id: 'P02',
    denumire: 'Căderi la nivel diferit (scări, platforme)',
    categorie: 'fizic'
  },
  {
    id: 'P03',
    denumire: 'Contacte electrice directe/indirecte',
    categorie: 'fizic'
  },
  {
    id: 'P04',
    denumire: 'Zgomot peste limita admisă',
    categorie: 'fizic'
  },
  {
    id: 'P05',
    denumire: 'Iluminat inadecvat (insuficient sau excesiv)',
    categorie: 'fizic'
  },
  {
    id: 'P06',
    denumire: 'Microclimat inadecvat (temperatură, umiditate)',
    categorie: 'fizic'
  },
  {
    id: 'P07',
    denumire: 'Loviri de/cu obiecte, utilaje în mișcare',
    categorie: 'fizic'
  },
  {
    id: 'P08',
    denumire: 'Tăieri, înțepături cu unelte/obiecte ascuțite',
    categorie: 'fizic'
  },

  // Pericole chimice
  {
    id: 'P09',
    denumire: 'Expunere la substanțe chimice periculoase',
    categorie: 'chimic'
  },
  {
    id: 'P10',
    denumire: 'Expunere la praf, fum, vapori',
    categorie: 'chimic'
  },

  // Pericole biologice
  {
    id: 'P11',
    denumire: 'Contact cu agenți biologici (bacterii, viruși, mucegaiuri)',
    categorie: 'biologic'
  },

  // Pericole de incendiu
  {
    id: 'P12',
    denumire: 'Incendiu/explozie (materiale inflamabile)',
    categorie: 'fizic'
  },

  // Pericole ergonomice
  {
    id: 'P13',
    denumire: 'Manevrarea manuală a sarcinilor (ridicări, transport)',
    categorie: 'ergonomic'
  },
  {
    id: 'P14',
    denumire: 'Poziții forțate, mișcări repetitive',
    categorie: 'ergonomic'
  },
  {
    id: 'P15',
    denumire: 'Lucru prelungit la calculator (ecran)',
    categorie: 'ergonomic'
  },

  // Pericole psihosociale
  {
    id: 'P16',
    denumire: 'Stres profesional, suprasolicitare',
    categorie: 'psihosocial'
  },
  {
    id: 'P17',
    denumire: 'Violență, hărțuire la locul de muncă',
    categorie: 'psihosocial'
  },

  // Alte pericole
  {
    id: 'P18',
    denumire: 'Circulație vehicule în spații de lucru',
    categorie: 'fizic'
  },
  {
    id: 'P19',
    denumire: 'Lucru în înălțime',
    categorie: 'fizic'
  },
  {
    id: 'P20',
    denumire: 'Interacțiune cu publicul (conflict, agresiune)',
    categorie: 'psihosocial'
  }
];

/**
 * Matricea pentru calculul nivelului de risc
 * Probabilitate (1-4) x Gravitate (1-4) = Nivel Risc (1-16)
 */
export const MATRICE_RISC = {
  getCategorie: (nivelRisc: number): EvaluareNivelRisc['categorieRisc'] => {
    if (nivelRisc <= 2) return 'acceptabil';
    if (nivelRisc <= 4) return 'scazut';
    if (nivelRisc <= 8) return 'mediu';
    if (nivelRisc <= 12) return 'ridicat';
    return 'foarte ridicat';
  },

  getPrioritate: (nivelRisc: number): MasuraPreventie['prioritate'] => {
    if (nivelRisc <= 2) return 'scazut';
    if (nivelRisc <= 4) return 'scazut';
    if (nivelRisc <= 8) return 'mediu';
    if (nivelRisc <= 12) return 'ridicat';
    return 'urgent';
  }
};

/**
 * Etichete pentru probabilitate
 */
export const PROBABILITATE_LABELS = {
  1: 'Foarte mică - Practic imposibil',
  2: 'Mică - Posibil dar puțin probabil',
  3: 'Mare - Destul de probabil',
  4: 'Foarte mare - Se așteaptă să se producă'
};

/**
 * Etichete pentru gravitate
 */
export const GRAVITATE_LABELS = {
  1: 'Ușoară - Leziuni minore, fără absenteism',
  2: 'Medie - Necesită tratament medical, absență scurtă',
  3: 'Gravă - Leziuni serioase, spitalizare',
  4: 'Foarte gravă - Deces sau invaliditate permanentă'
};

/**
 * Template implicit pentru evaluare risc simplificată
 */
export const EVALUARE_RISC_SIMPLA_TEMPLATE: Partial<EvaluareRiscSimpla> = {
  identificareFirma: {
    denumire: '',
    cui: '',
    adresa: '',
    telefon: '',
    email: '',
    reprezentantLegal: '',
    numarAngajati: 0,
    codCAEN: '',
    dataEvaluare: new Date().toISOString().split('T')[0]
  },
  descriereActivitate: {
    activitatePrincipala: '',
    proceseTehnologice: [],
    echipamenteMuncaUtilizate: [],
    substanteChimiceUtilizate: [],
    locuriDeMunca: []
  },
  pericoleIdentificate: PERICOLE_COMUNE.map(p => ({
    ...p,
    prezent: false
  })),
  evaluariRisc: [],
  masuriPreventie: [],
  dataEvaluare: new Date().toISOString().split('T')[0],
  evaluator: {
    nume: '',
    functie: 'Consultant SSM'
  },
  reprezentantFirma: {
    nume: '',
    functie: 'Administrator/Reprezentant Legal'
  }
};

/**
 * Funcție helper pentru calculul nivelului de risc
 */
export function calculeazaNivelRisc(
  probabilitate: number,
  gravitate: number
): { nivelRisc: number; categorieRisc: EvaluareNivelRisc['categorieRisc'] } {
  const nivelRisc = probabilitate * gravitate;
  const categorieRisc = MATRICE_RISC.getCategorie(nivelRisc);
  return { nivelRisc, categorieRisc };
}

/**
 * Funcție helper pentru generarea măsurilor de prevenție pe baza riscurilor evaluate
 */
export function genereazaMasuriRecomandate(
  pericol: PericulIdentificat,
  evaluareRisc: EvaluareNivelRisc
): Partial<MasuraPreventie>[] {
  const masuri: Partial<MasuraPreventie>[] = [];
  const prioritate = MATRICE_RISC.getPrioritate(evaluareRisc.nivelRisc);

  // Mapare pericole -> măsuri tipice
  const masuriTipice: Record<string, string[]> = {
    'P01': ['Menținerea curățeniei și ordinii', 'Semnalizare denivelări', 'Pardoseli antiderapante'],
    'P02': ['Balustrade la scări', 'Iluminat adecvat', 'Marcaje vizibile'],
    'P03': ['Verificare instalații electrice', 'Prize cu protecție', 'Instruire personal'],
    'P04': ['Măsurători nivel zgomot', 'Izolare surse zgomot', 'EPI - protecție auditivă'],
    'P05': ['Asigurare iluminatnatural', 'Iluminat artificial adecvat', 'Curățare corpuri iluminat'],
    'P06': ['Sistem climatizare/ventilație', 'Pauze în condiții extreme', 'Îmbrăcăminte adecvată'],
    'P07': ['Marcarea zonelor periculoase', 'Proceduri de lucru sigure', 'EPI - căști, încălțăminte'],
    'P08': ['Unelte în bună stare', 'EPI - mănuși', 'Instruire utilizare corectă'],
    'P09': ['Fișe siguranță substanțe', 'Depozitare corespunzătoare', 'EPI specific'],
    'P10': ['Sistem ventilație/exhaustare', 'Umidificare zonă lucru', 'EPI - măști'],
    'P11': ['Igienizare regulată', 'Dezinfectante', 'Instruire igienă'],
    'P12': ['Stingătoare funcționale', 'Verificare instalație electrică', 'Plan evacuare'],
    'P13': ['Tehnici corecte ridicare', 'Ajutoare mecanice', 'Instruire'],
    'P14': ['Pauze ergonomice', 'Rotație sarcini', 'Amenajare ergonomică'],
    'P15': ['Ecrane reglabile', 'Pauze regulate', 'Scaune ergonomice'],
    'P16': ['Organizare program', 'Pauze', 'Comunicare deschisă'],
    'P17': ['Proceduri anti-hărțuire', 'Canale raportare', 'Training conștientizare'],
    'P18': ['Marcaje circulație', 'Delimitare zone', 'Semnalizare'],
    'P19': ['Platforme/schele sigure', 'EPI anticădere', 'Instruire lucru înălțime'],
    'P20': ['Proceduri gestionare conflict', 'Sistem alarmă', 'Instruire personal']
  };

  const masuriPentruPericol = masuriTipice[pericol.id] || ['Evaluare detaliată necesară', 'Consultare specialist SSM'];

  masuriPentruPericol.forEach((descriere, index) => {
    masuri.push({
      periculId: pericol.id,
      descriere,
      tip: index === 0 ? 'organizatorica' : (index === masuriPentruPericol.length - 1 ? 'epi' : 'inginerie'),
      prioritate,
      status: 'planificat'
    });
  });

  return masuri;
}
