/**
 * ANAF Forms Data
 *
 * Frequently used ANAF (Romanian Tax Authority) forms for fiscal compliance.
 * Each form includes code, name, deadline, frequency, description, and portal link.
 */

export interface AnafForm {
  code: string;
  name: string;
  deadline: string;
  frequency: 'lunar' | 'trimestrial' | 'anual' | 'la_eveniment';
  description: string;
  portalLink: string;
}

export const anafForms: AnafForm[] = [
  {
    code: 'D100',
    name: 'Declarație privind obligațiile de plată la bugetul de stat',
    deadline: '25 ale lunii următoare',
    frequency: 'lunar',
    description: 'Declarație lunară pentru impozitul pe profit/venit, impozit pe dividende, impozit pe venituri din dobânzi, câștiguri din jocuri de noroc și alte impozite reținute la sursă.',
    portalLink: 'https://www.anaf.ro/anaf/internet/ANAF/despre_anaf/strategii_anaf/declaratii_electronice'
  },
  {
    code: 'D112',
    name: 'Declarație privind obligațiile de plată a contribuțiilor sociale',
    deadline: '25 ale lunii următoare',
    frequency: 'lunar',
    description: 'Declarație lunară pentru contribuțiile sociale (CAS, CASS, CAM) datorate pentru angajați și alte persoane asigurate.',
    portalLink: 'https://www.anaf.ro/anaf/internet/ANAF/despre_anaf/strategii_anaf/declaratii_electronice'
  },
  {
    code: 'D300',
    name: 'Declarație privind obligațiile de plată a contribuțiilor sociale datorate de persoane fizice',
    deadline: '25 mai (pentru anul anterior)',
    frequency: 'anual',
    description: 'Declarație anuală pentru contribuțiile sociale (CAS, CASS) datorate de persoanele fizice care realizează venituri din activități independente, asocieri, cedarea folosinței bunurilor, activități agricole, silvicultură și piscicultură.',
    portalLink: 'https://www.anaf.ro/anaf/internet/ANAF/despre_anaf/strategii_anaf/declaratii_electronice'
  },
  {
    code: 'D101',
    name: 'Declarație privind impozitul pe profit',
    deadline: '25 martie (pentru anul anterior)',
    frequency: 'anual',
    description: 'Declarație anuală de impozit pe profit pentru persoanele juridice române și entitățile străine care desfășoară activitate în România prin sediu permanent.',
    portalLink: 'https://www.anaf.ro/anaf/internet/ANAF/despre_anaf/strategii_anaf/declaratii_electronice'
  },
  {
    code: 'D205',
    name: 'Declarație privind venitul estimat/norma de venit',
    deadline: '25 mai (pentru anul curent)',
    frequency: 'anual',
    description: 'Declarație anuală pentru stabilirea venitului estimat/normei de venit pentru anul curent, depusă de persoanele fizice care realizează venituri din activități independente, drepturi de proprietate intelectuală, activități agricole.',
    portalLink: 'https://www.anaf.ro/anaf/internet/ANAF/despre_anaf/strategii_anaf/declaratii_electronice'
  },
  {
    code: 'D394',
    name: 'Declarație informativă privind livrările/prestările și achizițiile efectuate pe teritoriul național',
    deadline: '25 ale lunii următoare trimestrului',
    frequency: 'trimestrial',
    description: 'Declarație trimestrială privind livrările/prestările de bunuri și servicii efectuate către persoane impozabile înregistrate în scopuri de TVA în România și achizițiile de la acestea.',
    portalLink: 'https://www.anaf.ro/anaf/internet/ANAF/despre_anaf/strategii_anaf/declaratii_electronice'
  },
  {
    code: 'D406',
    name: 'Declarație informativă privind impozitul reținut la sursă',
    deadline: 'Ultima zi a lunii următoare trimestrului',
    frequency: 'trimestrial',
    description: 'Declarație informativă trimestrială privind impozitul reținut la sursă pentru veniturile din dividende, dobânzi, drepturi de proprietate intelectuală, servicii, etc.',
    portalLink: 'https://www.anaf.ro/anaf/internet/ANAF/despre_anaf/strategii_anaf/declaratii_electronice'
  },
  {
    code: 'D390',
    name: 'Declarație recapitulativă privind livrările/prestările și achizițiile intracomunitare',
    deadline: '25 ale lunii următoare',
    frequency: 'lunar',
    description: 'Declarație lunară/trimestrială privind achizițiile intracomunitare de bunuri și livrările intracomunitare de bunuri și prestările de servicii către persoane înregistrate în scopuri de TVA în alte state membre.',
    portalLink: 'https://www.anaf.ro/anaf/internet/ANAF/despre_anaf/strategii_anaf/declaratii_electronice'
  },
  {
    code: 'D212',
    name: 'Declarație privind venitul realizat',
    deadline: '25 mai (pentru anul anterior)',
    frequency: 'anual',
    description: 'Declarație anuală privind venitul realizat și impozitul datorat de persoanele fizice care realizează venituri din activități independente, cedarea folosinței bunurilor, activități agricole și alte surse.',
    portalLink: 'https://www.anaf.ro/anaf/internet/ANAF/despre_anaf/strategii_anaf/declaratii_electronice'
  },
  {
    code: 'D210',
    name: 'Declarație privind veniturile realizate din România',
    deadline: '25 mai (pentru anul anterior)',
    frequency: 'anual',
    description: 'Declarație anuală pentru declararea veniturilor realizate de persoanele fizice din România (salarii, dividende, chirii, venituri din investiții, etc.) și pentru regularizarea impozitului anual.',
    portalLink: 'https://www.anaf.ro/anaf/internet/ANAF/despre_anaf/strategii_anaf/declaratii_electronice'
  },
  {
    code: 'D301',
    name: 'Declarație privind venitul asigurat în sistemul public de pensii',
    deadline: '25 mai (pentru anul anterior)',
    frequency: 'anual',
    description: 'Declarație anuală pentru contribuțiile sociale la pensie datorate de asigurații care realizează venituri din activități independente, asocieri, cedarea folosinței bunurilor și activități agricole.',
    portalLink: 'https://www.anaf.ro/anaf/internet/ANAF/despre_anaf/strategii_anaf/declaratii_electronice'
  },
  {
    code: 'D010',
    name: 'Declarație privind cifra de afaceri la care se datorează taxa pe valoarea adăugată',
    deadline: 'În 10 zile de la depășirea plafonului',
    frequency: 'la_eveniment',
    description: 'Declarație pentru informarea organelor fiscale cu privire la depășirea plafonului de scutire de la plata TVA și înregistrarea în scopuri de TVA.',
    portalLink: 'https://www.anaf.ro/anaf/internet/ANAF/despre_anaf/strategii_anaf/declaratii_electronice'
  },
  {
    code: 'D311',
    name: 'Registrul de evidență fiscală',
    deadline: 'Permanent, pentru fiecare operațiune',
    frequency: 'lunar',
    description: 'Registru obligatoriu pentru persoanele fizice autorizate și întreprinderile individuale pentru evidența veniturilor și cheltuielilor desfășurate în sistem real.',
    portalLink: 'https://www.anaf.ro/anaf/internet/ANAF/despre_anaf/strategii_anaf/declaratii_electronice'
  },
  {
    code: 'D600',
    name: 'Declarație privind impozitul specific unor activități',
    deadline: '25 ianuarie (pentru anul curent)',
    frequency: 'anual',
    description: 'Declarație anuală pentru stabilirea impozitului specific anumitor activități (HoReCa, comerț cu amănuntul, servicii) în sistemul de impozitare pe baza normelor de venit.',
    portalLink: 'https://www.anaf.ro/anaf/internet/ANAF/despre_anaf/strategii_anaf/declaratii_electronice'
  },
  {
    code: 'D392',
    name: 'Declarație informativă privind plățile efectuate către persoane fizice și juridice',
    deadline: 'Ultima zi a lunii februarie (pentru anul anterior)',
    frequency: 'anual',
    description: 'Declarație informativă anuală privind plățile efectuate către persoane fizice și juridice pentru servicii, chirii, achiziții de bunuri, comisioane și alte cheltuieli deductibile.',
    portalLink: 'https://www.anaf.ro/anaf/internet/ANAF/despre_anaf/strategii_anaf/declaratii_electronice'
  }
];

/**
 * Get form by code
 */
export function getFormByCode(code: string): AnafForm | undefined {
  return anafForms.find(form => form.code === code);
}

/**
 * Get forms by frequency
 */
export function getFormsByFrequency(frequency: AnafForm['frequency']): AnafForm[] {
  return anafForms.filter(form => form.frequency === frequency);
}

/**
 * Get all form codes
 */
export function getAllFormCodes(): string[] {
  return anafForms.map(form => form.code);
}
