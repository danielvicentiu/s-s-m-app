/**
 * Conținut obligatoriu trusă prim ajutor
 * Conform Ordinul MS 427/2002
 */

export interface KitPrimAjutorItem {
  name: string;
  quantity: number;
  description: string;
  expirationMonths: number | null; // null = nu expiră
  category: 'bandaje' | 'dezinfectanti' | 'instrumente' | 'medicamente' | 'diverse';
}

export const KIT_PRIM_AJUTOR_OBLIGATORIU: KitPrimAjutorItem[] = [
  // BANDAJE
  {
    name: 'Tifon steril',
    quantity: 5,
    description: 'Comprese de tifon steril pentru pansamente',
    expirationMonths: 60,
    category: 'bandaje',
  },
  {
    name: 'Vată sterilă',
    quantity: 2,
    description: 'Pachete de vată sterilă pentru curățare și pansamente',
    expirationMonths: 60,
    category: 'bandaje',
  },
  {
    name: 'Bandaj elastic',
    quantity: 3,
    description: 'Bandaje elastice pentru fixare și susținere (7-10 cm)',
    expirationMonths: null,
    category: 'bandaje',
  },
  {
    name: 'Leucoplast hârtie',
    quantity: 2,
    description: 'Rolă leucoplast din hârtie (2,5 cm x 5 m)',
    expirationMonths: 60,
    category: 'bandaje',
  },
  {
    name: 'Plasturi bucată',
    quantity: 20,
    description: 'Plasturi adezivi sterili diferite dimensiuni',
    expirationMonths: 60,
    category: 'bandaje',
  },
  {
    name: 'Comprese sterile',
    quantity: 10,
    description: 'Comprese sterile individual ambalate (10x10 cm)',
    expirationMonths: 60,
    category: 'bandaje',
  },

  // DEZINFECTANȚI
  {
    name: 'Alcool sanitar 70%',
    quantity: 1,
    description: 'Flacon alcool sanitar 70% (250 ml)',
    expirationMonths: 36,
    category: 'dezinfectanti',
  },
  {
    name: 'Apă oxigenată 3%',
    quantity: 1,
    description: 'Soluție apă oxigenată 3% (100 ml)',
    expirationMonths: 24,
    category: 'dezinfectanti',
  },
  {
    name: 'Tinctură de iod 2%',
    quantity: 1,
    description: 'Flacon tinctură de iod 2% (10-20 ml)',
    expirationMonths: 36,
    category: 'dezinfectanti',
  },
  {
    name: 'Betadină',
    quantity: 1,
    description: 'Soluție antiseptică Betadină (50 ml)',
    expirationMonths: 36,
    category: 'dezinfectanti',
  },

  // INSTRUMENTE
  {
    name: 'Foarfece medicală',
    quantity: 1,
    description: 'Foarfece medicală cu vârf rotunjit pentru tăiat bandaje',
    expirationMonths: null,
    category: 'instrumente',
  },
  {
    name: 'Pensă anatomică',
    quantity: 1,
    description: 'Pensă anatomică sterilă pentru extragere corpuri străine',
    expirationMonths: null,
    category: 'instrumente',
  },
  {
    name: 'Ace de siguranță',
    quantity: 6,
    description: 'Ace de siguranță pentru fixare bandaje',
    expirationMonths: null,
    category: 'instrumente',
  },
  {
    name: 'Termometru medical',
    quantity: 1,
    description: 'Termometru medical digital',
    expirationMonths: null,
    category: 'instrumente',
  },
  {
    name: 'Mănuși sterile',
    quantity: 3,
    description: 'Perechi de mănuși sterile de unică folosință',
    expirationMonths: 60,
    category: 'instrumente',
  },

  // MEDICAMENTE
  {
    name: 'Paracetamol 500mg',
    quantity: 1,
    description: 'Cutie paracetamol tablete (antifebrile, analgezic)',
    expirationMonths: 36,
    category: 'medicamente',
  },
  {
    name: 'Acid acetilsalicilic',
    quantity: 1,
    description: 'Cutie aspirină tablete (analgezic, antiinflamator)',
    expirationMonths: 36,
    category: 'medicamente',
  },
  {
    name: 'Cărbune medicinal',
    quantity: 1,
    description: 'Cutie cărbune medicinal (intoxicații)',
    expirationMonths: 36,
    category: 'medicamente',
  },
  {
    name: 'Picături oftalmice',
    quantity: 1,
    description: 'Flacon picături oftalmice sterile',
    expirationMonths: 24,
    category: 'medicamente',
  },
  {
    name: 'Cremă arsuri',
    quantity: 1,
    description: 'Tub cremă pentru arsuri ușoare',
    expirationMonths: 36,
    category: 'medicamente',
  },

  // DIVERSE
  {
    name: 'Triunghiuri textile',
    quantity: 2,
    description: 'Triunghiuri textile pentru susținere și imobilizare',
    expirationMonths: null,
    category: 'diverse',
  },
  {
    name: 'Saci plastic',
    quantity: 3,
    description: 'Pungi plastic pentru deșeuri medicale contaminate',
    expirationMonths: null,
    category: 'diverse',
  },
  {
    name: 'Ghid prim ajutor',
    quantity: 1,
    description: 'Manual de prim ajutor în limba română',
    expirationMonths: null,
    category: 'diverse',
  },
  {
    name: 'Pix/creion',
    quantity: 1,
    description: 'Pentru completare fișă de intervenție',
    expirationMonths: null,
    category: 'diverse',
  },
  {
    name: 'Fișe de intervenție',
    quantity: 5,
    description: 'Formulare pentru înregistrarea intervenției de prim ajutor',
    expirationMonths: null,
    category: 'diverse',
  },
];

/**
 * Categorizare articole pentru afișare
 */
export const KIT_PRIM_AJUTOR_BY_CATEGORY = {
  bandaje: KIT_PRIM_AJUTOR_OBLIGATORIU.filter(item => item.category === 'bandaje'),
  dezinfectanti: KIT_PRIM_AJUTOR_OBLIGATORIU.filter(item => item.category === 'dezinfectanti'),
  instrumente: KIT_PRIM_AJUTOR_OBLIGATORIU.filter(item => item.category === 'instrumente'),
  medicamente: KIT_PRIM_AJUTOR_OBLIGATORIU.filter(item => item.category === 'medicamente'),
  diverse: KIT_PRIM_AJUTOR_OBLIGATORIU.filter(item => item.category === 'diverse'),
};

/**
 * Labels categorii în română
 */
export const CATEGORY_LABELS = {
  bandaje: 'Bandaje și Pansamente',
  dezinfectanti: 'Dezinfectanți',
  instrumente: 'Instrumente Medicale',
  medicamente: 'Medicamente',
  diverse: 'Diverse',
} as const;
