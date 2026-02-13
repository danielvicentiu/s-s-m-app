/**
 * EIP Catalog - Echipament Individual de Protecție
 * Personal Protective Equipment catalog with standards and maintenance requirements
 */

export type EIPCategory =
  | 'cap'           // Head protection
  | 'ochi'          // Eye protection
  | 'auz'           // Hearing protection
  | 'respirator'    // Respiratory protection
  | 'maini'         // Hand protection
  | 'picioare'      // Foot protection
  | 'corp'          // Body protection
  | 'cadere';       // Fall protection

export interface EIP {
  id: string;
  name: string;
  category: EIPCategory;
  standard: string;
  inspectionFrequency: number; // months
  lifespan: number; // years
  storageRequirements: string;
  replacementCriteria: string[];
}

export const EIP_CATALOG: EIP[] = [
  // HEAD PROTECTION (Cap)
  {
    id: 'cap-001',
    name: 'Cască de protecție pentru industrie',
    category: 'cap',
    standard: 'EN 397',
    inspectionFrequency: 6,
    lifespan: 5,
    storageRequirements: 'Depozitare la temperatură 15-25°C, ferit de lumina directă a soarelui',
    replacementCriteria: [
      'Fisuri vizibile în carcasă',
      'Deformări permanente',
      'Impact semnificativ (înlocuire imediată)',
      'Expirarea termenului de valabilitate'
    ]
  },
  {
    id: 'cap-002',
    name: 'Cască cu ventilație pentru climă caldă',
    category: 'cap',
    standard: 'EN 397',
    inspectionFrequency: 6,
    lifespan: 4,
    storageRequirements: 'Depozitare la loc uscat, ventilat',
    replacementCriteria: [
      'Deteriorarea sistemului de ventilație',
      'Fisuri în materialul carcasei',
      'Banda interioară ruptă sau deformată'
    ]
  },
  {
    id: 'cap-003',
    name: 'Cască pentru lucru la înălțime',
    category: 'cap',
    standard: 'EN 12492',
    inspectionFrequency: 3,
    lifespan: 3,
    storageRequirements: 'Depozitare suspendată, ferit de substanțe chimice',
    replacementCriteria: [
      'Orice fisură sau crăpătură',
      'După orice cădere sau impact',
      'Uzură vizibilă a sistemului de prindere'
    ]
  },
  {
    id: 'cap-004',
    name: 'Bonetă de protecție anti-bump',
    category: 'cap',
    standard: 'EN 812',
    inspectionFrequency: 12,
    lifespan: 3,
    storageRequirements: 'Depozitare la loc uscat',
    replacementCriteria: [
      'Deformări vizibile',
      'Uzură materialului exterior'
    ]
  },
  {
    id: 'cap-005',
    name: 'Cască electrician (izolată)',
    category: 'cap',
    standard: 'EN 397 + EN 50365',
    inspectionFrequency: 3,
    lifespan: 3,
    storageRequirements: 'Depozitare ferit de umiditate și surse de căldură',
    replacementCriteria: [
      'Pierderea proprietăților dielectrice (testare)',
      'Fisuri sau deteriorări vizibile',
      'Contact cu substanțe chimice agresive'
    ]
  },

  // EYE PROTECTION (Ochi)
  {
    id: 'ochi-001',
    name: 'Ochelari de protecție cu lentile transparente',
    category: 'ochi',
    standard: 'EN 166',
    inspectionFrequency: 1,
    lifespan: 2,
    storageRequirements: 'Depozitare în toc protector, la loc uscat',
    replacementCriteria: [
      'Zgârieturi pe lentile care afectează vizibilitatea',
      'Cadru deformat sau rupt',
      'Pierderea protecției laterale'
    ]
  },
  {
    id: 'ochi-002',
    name: 'Ochelari cu protecție UV',
    category: 'ochi',
    standard: 'EN 166 + EN 170',
    inspectionFrequency: 3,
    lifespan: 2,
    storageRequirements: 'Toc protector, ferit de lumina directă',
    replacementCriteria: [
      'Deteriorarea filtrului UV',
      'Lentile zgâriate',
      'Rama deteriorată'
    ]
  },
  {
    id: 'ochi-003',
    name: 'Ochelari pentru sudură',
    category: 'ochi',
    standard: 'EN 166 + EN 169',
    inspectionFrequency: 1,
    lifespan: 3,
    storageRequirements: 'Cutie protectoare, departe de surse de căldură',
    replacementCriteria: [
      'Deteriorarea filtrului de sudură',
      'Fisuri în lentile',
      'Rama slăbită'
    ]
  },
  {
    id: 'ochi-004',
    name: 'Vizor facial pentru protecție chimică',
    category: 'ochi',
    standard: 'EN 166',
    inspectionFrequency: 1,
    lifespan: 1,
    storageRequirements: 'Depozitare orizontală, ferit de substanțe chimice',
    replacementCriteria: [
      'Opacizare sau zgârieturi',
      'Fisuri în ecran',
      'Deteriorarea sistemului de fixare'
    ]
  },
  {
    id: 'ochi-005',
    name: 'Ochelari anti-aburire pentru medii umede',
    category: 'ochi',
    standard: 'EN 166',
    inspectionFrequency: 1,
    lifespan: 1,
    storageRequirements: 'Toc ventilat, evitarea condensului',
    replacementCriteria: [
      'Pierderea proprietăților anti-aburire',
      'Zgârieturi pe lentile',
      'Deteriorarea benzii elastice'
    ]
  },

  // HEARING PROTECTION (Auz)
  {
    id: 'auz-001',
    name: 'Antifoane externe standard',
    category: 'auz',
    standard: 'EN 352-1',
    inspectionFrequency: 6,
    lifespan: 3,
    storageRequirements: 'Depozitare în husă, la temperatură ambientală',
    replacementCriteria: [
      'Deteriorarea pernițelor',
      'Arcul deformat sau rupt',
      'Pierderea capacității de atenuare (testare)'
    ]
  },
  {
    id: 'auz-002',
    name: 'Dopuri de urechi din spumă',
    category: 'auz',
    standard: 'EN 352-2',
    inspectionFrequency: 0.25, // lunar
    lifespan: 0.08, // ~1 lună (usage-dependent)
    storageRequirements: 'Ambalaj sigilat, igienizat',
    replacementCriteria: [
      'După fiecare utilizare (model de unică folosință)',
      'Murdărire vizibilă',
      'Pierderea elasticității'
    ]
  },
  {
    id: 'auz-003',
    name: 'Dopuri de urechi reutilizabile cu șnur',
    category: 'auz',
    standard: 'EN 352-2',
    inspectionFrequency: 1,
    lifespan: 1,
    storageRequirements: 'Cutie curată, personalizată',
    replacementCriteria: [
      'Murdărire persistentă',
      'Deteriorarea materialului',
      'Șnur rupt'
    ]
  },
  {
    id: 'auz-004',
    name: 'Antifoane cu atenuare activă',
    category: 'auz',
    standard: 'EN 352-1',
    inspectionFrequency: 3,
    lifespan: 5,
    storageRequirements: 'Cutie protectoare cu baterii scoase',
    replacementCriteria: [
      'Defecțiuni electronice',
      'Deteriorarea pernițelor',
      'Pierderea funcției de atenuare'
    ]
  },
  {
    id: 'auz-005',
    name: 'Antifoane pentru casca de protecție',
    category: 'auz',
    standard: 'EN 352-3',
    inspectionFrequency: 6,
    lifespan: 3,
    storageRequirements: 'Montate pe cască sau în husă',
    replacementCriteria: [
      'Sistemul de prindere deteriorat',
      'Pernițe uzate',
      'Incompatibilitate cu noua cască'
    ]
  },

  // RESPIRATORY PROTECTION (Respirator)
  {
    id: 'resp-001',
    name: 'Mască FFP1 de unică folosință',
    category: 'respirator',
    standard: 'EN 149',
    inspectionFrequency: 0,
    lifespan: 0.01, // 1 schimb de lucru
    storageRequirements: 'Ambalaj sigilat, loc uscat',
    replacementCriteria: [
      'După un schimb de lucru',
      'Deteriorare vizibilă',
      'Umezire'
    ]
  },
  {
    id: 'resp-002',
    name: 'Mască FFP2 cu supapă',
    category: 'respirator',
    standard: 'EN 149',
    inspectionFrequency: 0,
    lifespan: 0.02, // ~1 săptămână uso
    storageRequirements: 'Ambalaj individual, loc ventilat',
    replacementCriteria: [
      'După 8-40 ore de utilizare',
      'Supapă blocată',
      'Bandă elastică deteriorată'
    ]
  },
  {
    id: 'resp-003',
    name: 'Mască FFP3 pentru protecție maximă',
    category: 'respirator',
    standard: 'EN 149',
    inspectionFrequency: 0,
    lifespan: 0.01,
    storageRequirements: 'Ambalaj sigilat steril',
    replacementCriteria: [
      'După utilizare',
      'Orice deteriorare',
      'Dificultăți de respirație'
    ]
  },
  {
    id: 'resp-004',
    name: 'Semi-mască reutilizabilă cu filtru P3',
    category: 'respirator',
    standard: 'EN 140 + EN 143',
    inspectionFrequency: 1,
    lifespan: 5,
    storageRequirements: 'Cutie ermetică, curată, fără filtre montate',
    replacementCriteria: [
      'Deteriorarea materialului elastic',
      'Pierderea etanșeității (testare)',
      'Fisuri în corpul măștii'
    ]
  },
  {
    id: 'resp-005',
    name: 'Filtru P3 pentru semi-mască',
    category: 'respirator',
    standard: 'EN 143',
    inspectionFrequency: 0.5,
    lifespan: 0.5,
    storageRequirements: 'Ambalaj sigilat până la folosire',
    replacementCriteria: [
      'Creșterea rezistenței la respirație',
      'După expunere la nivel maxim de poluanți',
      'Termen de valabilitate expirat'
    ]
  },
  {
    id: 'resp-006',
    name: 'Mască integrală cu filtru combinat',
    category: 'respirator',
    standard: 'EN 136',
    inspectionFrequency: 1,
    lifespan: 10,
    storageRequirements: 'Cutie protectoare, dezinfectată după utilizare',
    replacementCriteria: [
      'Deteriorarea vizorului',
      'Pierderea etanșeității',
      'Sistem de prindere deteriorat'
    ]
  },

  // HAND PROTECTION (Mâini)
  {
    id: 'maini-001',
    name: 'Mănuși din piele pentru lucru mecanic',
    category: 'maini',
    standard: 'EN 388',
    inspectionFrequency: 1,
    lifespan: 1,
    storageRequirements: 'Loc uscat, ventilat',
    replacementCriteria: [
      'Găuri sau rupturi',
      'Uzură severă a pieii',
      'Pierderea flexibilității'
    ]
  },
  {
    id: 'maini-002',
    name: 'Mănuși din nitril rezistente la substanțe chimice',
    category: 'maini',
    standard: 'EN 374',
    inspectionFrequency: 0,
    lifespan: 0.5,
    storageRequirements: 'Ambalaj sigilat, ferit de ozon și lumină',
    replacementCriteria: [
      'Perforări sau fisuri',
      'Decolorare',
      'După expunere la chimicale agresive'
    ]
  },
  {
    id: 'maini-003',
    name: 'Mănuși dielectrice clasa 0 (1000V)',
    category: 'maini',
    standard: 'EN 60903',
    inspectionFrequency: 6,
    lifespan: 3,
    storageRequirements: 'Cutie specială, ferit de umiditate, testare periodică',
    replacementCriteria: [
      'Eșec la testarea dielectrică',
      'Perforări sau tăieturi',
      'Degradare vizibilă a materialului'
    ]
  },
  {
    id: 'maini-004',
    name: 'Mănuși anti-tăiere nivel 5',
    category: 'maini',
    standard: 'EN 388 (nivel 5)',
    inspectionFrequency: 1,
    lifespan: 1,
    storageRequirements: 'Loc curat și uscat',
    replacementCriteria: [
      'Fibre tăiate sau deteriorate',
      'Pierderea integrității',
      'Uzură vizibilă'
    ]
  },
  {
    id: 'maini-005',
    name: 'Mănuși termice pentru temperaturi ridicate',
    category: 'maini',
    standard: 'EN 407',
    inspectionFrequency: 3,
    lifespan: 2,
    storageRequirements: 'Loc răcoros, ferit de surse de căldură',
    replacementCriteria: [
      'Deteriorarea stratului termoizolant',
      'Arsuri sau pete',
      'Cusături deteriorate'
    ]
  },

  // FOOT PROTECTION (Picioare)
  {
    id: 'picioare-001',
    name: 'Bocanci de protecție S3 cu bombeu metalic',
    category: 'picioare',
    standard: 'EN ISO 20345 S3',
    inspectionFrequency: 3,
    lifespan: 2,
    storageRequirements: 'Loc uscat, ventilat, evitarea deformărilor',
    replacementCriteria: [
      'Talpă uzată sau desprinzându-se',
      'Bombeu deformat',
      'Pierderea impermeabilității',
      'Uzură severă a materialului superior'
    ]
  },
  {
    id: 'picioare-002',
    name: 'Bocanci dielectrici pentru electricieni',
    category: 'picioare',
    standard: 'EN ISO 20345 S3 + proprietăți dielectrice',
    inspectionFrequency: 6,
    lifespan: 2,
    storageRequirements: 'Depozitare uscată, testare periodică',
    replacementCriteria: [
      'Pierderea proprietăților dielectrice',
      'Deteriorarea tălpii',
      'Fisuri în material'
    ]
  },
  {
    id: 'picioare-003',
    name: 'Sandale de protecție S1 pentru vară',
    category: 'picioare',
    standard: 'EN ISO 20345 S1',
    inspectionFrequency: 3,
    lifespan: 1,
    storageRequirements: 'Loc uscat',
    replacementCriteria: [
      'Deteriorarea bombéului',
      'Uzură talpă',
      'Curele rupte'
    ]
  },
  {
    id: 'picioare-004',
    name: 'Cizme de cauciuc impermeabile',
    category: 'picioare',
    standard: 'EN ISO 20345 S5',
    inspectionFrequency: 6,
    lifespan: 3,
    storageRequirements: 'Suspendate sau pe suport, ferit de lumina soarelui',
    replacementCriteria: [
      'Fisuri în cauciuc',
      'Pierderea impermeabilității',
      'Deteriorarea tălpii'
    ]
  },
  {
    id: 'picioare-005',
    name: 'Ghete anti-static ESD',
    category: 'picioare',
    standard: 'EN ISO 20345 S1 + ESD',
    inspectionFrequency: 3,
    lifespan: 1,
    storageRequirements: 'Loc uscat, testare ESD periodică',
    replacementCriteria: [
      'Pierderea proprietăților anti-statice',
      'Uzură talpă',
      'Deteriorare material superior'
    ]
  },

  // BODY PROTECTION (Corp)
  {
    id: 'corp-001',
    name: 'Vestă reflectorizantă clasa 2',
    category: 'corp',
    standard: 'EN ISO 20471',
    inspectionFrequency: 3,
    lifespan: 2,
    storageRequirements: 'Atârnat, ferit de lumina directă',
    replacementCriteria: [
      'Pierderea reflectorizării',
      'Rupturi sau deteriorări',
      'Murdărire persistentă care afectează vizibilitatea'
    ]
  },
  {
    id: 'corp-002',
    name: 'Combinezon de protecție chimică tip 3',
    category: 'corp',
    standard: 'EN 14605',
    inspectionFrequency: 0,
    lifespan: 0.01,
    storageRequirements: 'Ambalaj sigilat până la utilizare',
    replacementCriteria: [
      'După utilizare (de unică folosință)',
      'Orice perforare sau rupere',
      'Contact cu substanțe chimice'
    ]
  },
  {
    id: 'corp-003',
    name: 'Costum anti-foc pentru sudori',
    category: 'corp',
    standard: 'EN ISO 11612',
    inspectionFrequency: 6,
    lifespan: 3,
    storageRequirements: 'Atârnat, curățat conform instrucțiunilor producătorului',
    replacementCriteria: [
      'Deteriorarea materialului ignifug',
      'Găuri sau arsuri',
      'După expunere la temperaturi extreme'
    ]
  },
  {
    id: 'corp-004',
    name: 'Șorț din piele pentru sudură',
    category: 'corp',
    standard: 'EN ISO 11611',
    inspectionFrequency: 3,
    lifespan: 3,
    storageRequirements: 'Atârnat pe cuier, loc uscat',
    replacementCriteria: [
      'Găuri sau rupturi în piele',
      'Curele deteriorate',
      'Pierderea flexibilității'
    ]
  },
  {
    id: 'corp-005',
    name: 'Jachetă de iarnă reflectorizantă',
    category: 'corp',
    standard: 'EN ISO 20471 + EN 342',
    inspectionFrequency: 12,
    lifespan: 3,
    storageRequirements: 'Atârnat, curățare profesională recomandată',
    replacementCriteria: [
      'Pierderea benzilor reflectorizante',
      'Deteriorarea izolației termice',
      'Fermoar sau nasturi nefuncționali'
    ]
  },

  // FALL PROTECTION (Cădere)
  {
    id: 'cadere-001',
    name: 'Ham de siguranță pentru lucru la înălțime',
    category: 'cadere',
    standard: 'EN 361',
    inspectionFrequency: 6,
    lifespan: 5,
    storageRequirements: 'Atârnat, ferit de substanțe chimice și lumina UV',
    replacementCriteria: [
      'După orice cădere oprită',
      'Uzură centuri sau cusături',
      'Coroziune pe componente metalice',
      'Deteriorarea cataramelor'
    ]
  },
  {
    id: 'cadere-002',
    name: 'Dispozitiv antcădere cu cablu retractabil',
    category: 'cadere',
    standard: 'EN 360',
    inspectionFrequency: 12,
    lifespan: 10,
    storageRequirements: 'Protejat de praf, grăsime periodică conform manual',
    replacementCriteria: [
      'După activare (oprirea unei căderi)',
      'Cablul uzat sau deteriorat',
      'Mecanism de blocare defect',
      'Carcasă fisurată'
    ]
  },
  {
    id: 'cadere-003',
    name: 'Absorbant de șoc pentru ham',
    category: 'cadere',
    standard: 'EN 355',
    inspectionFrequency: 6,
    lifespan: 5,
    storageRequirements: 'Loc uscat, evitarea îndoirilor permanente',
    replacementCriteria: [
      'După orice activare',
      'Deteriorare ambalaj protector',
      'Cusături deteriorate'
    ]
  },
  {
    id: 'cadere-004',
    name: 'Frânghie de siguranță cu dispozitiv',
    category: 'cadere',
    standard: 'EN 353-2',
    inspectionFrequency: 3,
    lifespan: 5,
    storageRequirements: 'Rulată corect, protejată de umiditate',
    replacementCriteria: [
      'După oprirea unei căderi',
      'Uzură fibre franghie',
      'Dispozitiv blocat sau defect'
    ]
  },
  {
    id: 'cadere-005',
    name: 'Sistem de ancorare mobil pentru acoperiș',
    category: 'cadere',
    standard: 'EN 795',
    inspectionFrequency: 12,
    lifespan: 10,
    storageRequirements: 'Depozitare orizontală, verificare componente metalice',
    replacementCriteria: [
      'Coroziune avansată',
      'Deformări structurale',
      'După orice incident de cădere',
      'Piese lipsă sau deteriorate'
    ]
  }
];

/**
 * Get all EIP items by category
 */
export function getEIPByCategory(category: EIPCategory): EIP[] {
  return EIP_CATALOG.filter(eip => eip.category === category);
}

/**
 * Get all EIP categories with counts
 */
export function getEIPCategorySummary() {
  const summary: Record<EIPCategory, number> = {
    cap: 0,
    ochi: 0,
    auz: 0,
    respirator: 0,
    maini: 0,
    picioare: 0,
    corp: 0,
    cadere: 0
  };

  EIP_CATALOG.forEach(eip => {
    summary[eip.category]++;
  });

  return summary;
}

/**
 * Get EIP by ID
 */
export function getEIPById(id: string): EIP | undefined {
  return EIP_CATALOG.find(eip => eip.id === id);
}

/**
 * Get all EIPs that require inspection in the next N months
 */
export function getEIPsDueForInspection(monthsAhead: number = 1): EIP[] {
  return EIP_CATALOG.filter(eip => eip.inspectionFrequency > 0 && eip.inspectionFrequency <= monthsAhead);
}

/**
 * Category labels in Romanian
 */
export const EIP_CATEGORY_LABELS: Record<EIPCategory, string> = {
  cap: 'Protecția capului',
  ochi: 'Protecția ochilor',
  auz: 'Protecția auzului',
  respirator: 'Protecția respiratorie',
  maini: 'Protecția mâinilor',
  picioare: 'Protecția picioarelor',
  corp: 'Protecția corpului',
  cadere: 'Protecția la cădere'
};
