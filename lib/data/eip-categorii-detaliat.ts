/**
 * Categorii EIP (Echipamente Individuale de Protecție) conform HG 1048/2006
 * Anexa 1 - Categorii de EIP și standardele aplicabile
 *
 * Sursa legală: HG 1048/2006 privind cerințele minime de securitate și sănătate
 * pentru utilizarea de către lucrători a echipamentelor individuale de protecție la locul de muncă
 */

export interface EIPCategory {
  id: string;
  name: string;
  category: 'cap' | 'ochi' | 'urechi' | 'respirator' | 'maini' | 'picioare' | 'corp' | 'cadere';
  standard: string;
  inspectionInterval: number; // luni
  replacementCriteria: string[];
  storageRequirements: string;
  legalBasis: string;
}

export const EIP_CATEGORIES: EIPCategory[] = [
  // PROTECȚIA CAPULUI
  {
    id: 'cap-001',
    name: 'Cască de protecție industrială',
    category: 'cap',
    standard: 'EN 397',
    inspectionInterval: 6,
    replacementCriteria: [
      'Fisuri sau deformări vizibile',
      'Impact semnificativ (chiar dacă nu sunt deteriorări vizibile)',
      'Expirarea termenului de valabilitate (de regulă 3-5 ani)',
      'Decolorare sau degradare UV'
    ],
    storageRequirements: 'Depozitare la temperatura camerei (15-25°C), ferit de lumina directă a soarelui, umiditate și substanțe chimice',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 1.1'
  },
  {
    id: 'cap-002',
    name: 'Cască pentru industria minieră',
    category: 'cap',
    standard: 'EN 14052',
    inspectionInterval: 3,
    replacementCriteria: [
      'Deteriorări mecanice (fisuri, spărturi)',
      'După orice impact major',
      'Sistem de reglaj defect',
      'Deteriorarea sistemului de iluminare integrat'
    ],
    storageRequirements: 'Depozitare în spații uscate, ferit de temperaturi extreme (-10°C până +40°C)',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 1.1'
  },
  {
    id: 'cap-003',
    name: 'Bonete/Cagule de protecție',
    category: 'cap',
    standard: 'EN 812',
    inspectionInterval: 12,
    replacementCriteria: [
      'Uzură excesivă a materialului',
      'Rupturi sau găuri',
      'Pierderea elasticității',
      'Contaminare chimică'
    ],
    storageRequirements: 'Păstrare în locuri curate, uscate, ferit de surse de căldură',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 1.2'
  },

  // PROTECȚIA OCHILOR ȘI FEȚEI
  {
    id: 'ochi-001',
    name: 'Ochelari de protecție cu lentile filtrante',
    category: 'ochi',
    standard: 'EN 166, EN 169',
    inspectionInterval: 3,
    replacementCriteria: [
      'Zgârieturi sau deteriorări ale lentilelor',
      'Rama deformată sau fisurată',
      'Pierderea proprietăților de filtrare',
      'Sistem de ventilație blocat'
    ],
    storageRequirements: 'Depozitare în etui protector, la temperatura camerei, ferit de praf și umiditate',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 2.1'
  },
  {
    id: 'ochi-002',
    name: 'Ochelari de protecție împotriva particulelor',
    category: 'ochi',
    standard: 'EN 166',
    inspectionInterval: 6,
    replacementCriteria: [
      'Lentile zgâriate care reduc vizibilitatea',
      'Degradarea ramei',
      'Pierderea etanșeității (pentru modele închise)',
      'Banderola elastică deteriorată'
    ],
    storageRequirements: 'Curățare regulată, depozitare în cutii închise, evitarea contactului cu substanțe chimice',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 2.1'
  },
  {
    id: 'ochi-003',
    name: 'Ecran facial de protecție',
    category: 'ochi',
    standard: 'EN 166',
    inspectionInterval: 3,
    replacementCriteria: [
      'Fisuri sau zgârieturi profunde pe vizor',
      'Sistem de fixare deteriorat',
      'Pierderea transparenței',
      'Deformări ale vizorului'
    ],
    storageRequirements: 'Depozitare pe suprafețe plane, ferit de presiune sau temperaturi ridicate',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 2.2'
  },
  {
    id: 'ochi-004',
    name: 'Mască de sudură',
    category: 'ochi',
    standard: 'EN 175, EN 169',
    inspectionInterval: 1,
    replacementCriteria: [
      'Fisuri în corpul măștii',
      'Filtru optic deteriorat sau expirat',
      'Sistem de reglaj defect',
      'Pentru măști automate: defecțiune senzor'
    ],
    storageRequirements: 'Depozitare în spații uscate, verificare baterii pentru măști automate, protejare filtre optice',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 2.2'
  },

  // PROTECȚIA AUZULUI
  {
    id: 'urechi-001',
    name: 'Antifoane (dopuri de urechi)',
    category: 'urechi',
    standard: 'EN 352-2',
    inspectionInterval: 1,
    replacementCriteria: [
      'Uzură vizibilă, deformare',
      'Pierderea elasticității',
      'Contaminare sau murdărire excesivă',
      'Pentru dopuri refolosibile: după 6 luni de utilizare'
    ],
    storageRequirements: 'Păstrare în cutii igienice individuale, ferit de praf, umiditate și temperaturi extreme',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 3.1'
  },
  {
    id: 'urechi-002',
    name: 'Antifoane tip cască (căști antifonului)',
    category: 'urechi',
    standard: 'EN 352-1',
    inspectionInterval: 6,
    replacementCriteria: [
      'Pernițe degradate sau turtite',
      'Fisuri în cupe',
      'Bandă de cap ruptă sau deformată',
      'Pierderea capacității de atenuare'
    ],
    storageRequirements: 'Depozitare în locuri curate, evitarea comprimării prelungite, curățare regulată cu detergenți blânzi',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 3.1'
  },
  {
    id: 'urechi-003',
    name: 'Antifoane cu atenuare activă',
    category: 'urechi',
    standard: 'EN 352-4',
    inspectionInterval: 3,
    replacementCriteria: [
      'Defecțiuni ale sistemului electronic',
      'Baterii consumate (verificare regulată)',
      'Deteriorarea componentelor pasive',
      'Pierderea funcționalității active'
    ],
    storageRequirements: 'Depozitare cu baterii scoase pentru perioade lungi, protecție împotriva umidității, temperatura 10-30°C',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 3.1'
  },

  // PROTECȚIA RESPIRATORIE
  {
    id: 'respirator-001',
    name: 'Semimasca filtranta FFP1',
    category: 'respirator',
    standard: 'EN 149',
    inspectionInterval: 1,
    replacementCriteria: [
      'După o tură de lucru (pentru modele de unică folosință)',
      'Rezistență crescută la respirație',
      'Deteriorarea materialului filtrant',
      'Benzi elastice uzate',
      'Clip nazal deformat'
    ],
    storageRequirements: 'Depozitare în ambalaj original sigilat, ferit de umiditate, praf și contaminanți, temperatura 5-30°C',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 4.1'
  },
  {
    id: 'respirator-002',
    name: 'Semimasca filtranta FFP2',
    category: 'respirator',
    standard: 'EN 149',
    inspectionInterval: 1,
    replacementCriteria: [
      'După o tură de lucru sau maxim 8 ore',
      'Deteriorare vizibilă',
      'Dificultăți la respirație',
      'Umezire internă excesivă',
      'Pierderea etanșeității faciale'
    ],
    storageRequirements: 'Ambalaj original închis, zona uscată și răcoroasă, fără expunere la lumina directă a soarelui',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 4.1'
  },
  {
    id: 'respirator-003',
    name: 'Semimasca filtranta FFP3',
    category: 'respirator',
    standard: 'EN 149',
    inspectionInterval: 1,
    replacementCriteria: [
      'Imediat după utilizare în medii periculoase',
      'Maxim 8 ore de utilizare',
      'Orice deteriorare a supapei de expirare',
      'Pierderea capacității de filtrare',
      'Contaminare exterioară'
    ],
    storageRequirements: 'Stocare individuală în pungi sigilate, evitarea contaminării încrucișate, temperatura controlată',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 4.1'
  },
  {
    id: 'respirator-004',
    name: 'Masca integrala cu filtre',
    category: 'respirator',
    standard: 'EN 136',
    inspectionInterval: 1,
    replacementCriteria: [
      'Vizor zgâriat sau fisurat',
      'Pierderea etanșeității (test negativ)',
      'Supape de respirație deteriorate',
      'Sistemul de harnașament uzat',
      'Filtre expirate sau saturate'
    ],
    storageRequirements: 'Depozitare în cutii dedicate, cu filtre demontate, curățare după fiecare utilizare, verificare supape',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 4.2'
  },
  {
    id: 'respirator-005',
    name: 'Aparat de respirat cu aer comprimat',
    category: 'respirator',
    standard: 'EN 137',
    inspectionInterval: 1,
    replacementCriteria: [
      'Conform programului de întreținere al producătorului',
      'După teste hidrostatice negative',
      'Deteriorări ale tubulaturii',
      'Defecțiuni ale regulatorului de presiune',
      'Expirarea certificării'
    ],
    storageRequirements: 'Depozitare în spații dedicate, verificare presiune butelii, menținere la temperatura camerei, service periodic certificat',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 4.3'
  },

  // PROTECȚIA MÂINILOR
  {
    id: 'maini-001',
    name: 'Mănuși de protecție mecanică',
    category: 'maini',
    standard: 'EN 388',
    inspectionInterval: 1,
    replacementCriteria: [
      'Rupturi, găuri sau uzură excesivă',
      'Pierderea rezistenței la tăiere/abraziune',
      'Deteriorarea cusăturilor',
      'Contaminare cu substanțe periculoase'
    ],
    storageRequirements: 'Depozitare în locuri uscate, curate, ferit de lumina directă a soarelui și surse de căldură',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 5.1'
  },
  {
    id: 'maini-002',
    name: 'Mănuși de protecție chimică',
    category: 'maini',
    standard: 'EN 374',
    inspectionInterval: 1,
    replacementCriteria: [
      'După fiecare utilizare (pentru unele substanțe)',
      'Fisuri, găuri sau decolorare',
      'Pierderea impermeabilității',
      'Degradare vizibilă a materialului',
      'Expirarea termenului de valabilitate'
    ],
    storageRequirements: 'Stocare în ambalaj original, temperatura controlată (5-25°C), ferit de ozon și lumină UV',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 5.2'
  },
  {
    id: 'maini-003',
    name: 'Mănuși dielectrice',
    category: 'maini',
    standard: 'EN 60903',
    inspectionInterval: 6,
    replacementCriteria: [
      'După test dielectric negativ',
      'Fisuri, găuri sau degradare a materialului',
      'Expirarea certificării (testare la 6 luni)',
      'Orice deteriorare vizibilă'
    ],
    storageRequirements: 'Depozitare în cutii dedicate cu talc, ferit de obiecte ascuțite, verificare și testare periodică obligatorie',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 5.3'
  },
  {
    id: 'maini-004',
    name: 'Mănuși de protecție termică',
    category: 'maini',
    standard: 'EN 407',
    inspectionInterval: 3,
    replacementCriteria: [
      'Deteriorarea stratului izolant',
      'Arsuri, găuri sau decolorare',
      'Pierderea flexibilității',
      'Cusături deteriorate',
      'Capacitate redusă de protecție termică'
    ],
    storageRequirements: 'Depozitare la temperatura camerei, ferit de umiditate și substanțe chimice care pot afecta proprietățile termice',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 5.4'
  },

  // PROTECȚIA PICIOARELOR
  {
    id: 'picioare-001',
    name: 'Încălțăminte de protecție S1',
    category: 'picioare',
    standard: 'EN ISO 20345',
    inspectionInterval: 6,
    replacementCriteria: [
      'Degradarea bombei de protecție',
      'Uzură excesivă a tălpii',
      'Pierderea rezistenței la apă',
      'Deteriorarea sistemului de închidere',
      'Fisuri în material'
    ],
    storageRequirements: 'Depozitare în locuri uscate, ventilate, ferit de surse de căldură directă, uscare naturală după utilizare',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 6.1'
  },
  {
    id: 'picioare-002',
    name: 'Încălțăminte de protecție S3',
    category: 'picioare',
    standard: 'EN ISO 20345',
    inspectionInterval: 6,
    replacementCriteria: [
      'Deteriorarea bombei de oțel/compozit',
      'Pierderea proprietăților antiperforație',
      'Uzură crampoanelor',
      'Degradarea rezistenței la apă',
      'Deformări ale structurii'
    ],
    storageRequirements: 'Curățare după utilizare, uscare la temperatura camerei, verificare regulată a tălpii antiperforație',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 6.1'
  },
  {
    id: 'picioare-003',
    name: 'Cizme de cauciuc',
    category: 'picioare',
    standard: 'EN ISO 20345',
    inspectionInterval: 3,
    replacementCriteria: [
      'Fisuri în materialul de cauciuc',
      'Pierderea elasticității',
      'Deteriorarea tălpii antiderapante',
      'Infiltrații de apă',
      'Degradare UV (decolorare, fragilizare)'
    ],
    storageRequirements: 'Depozitare verticală sau atârnate, ferit de lumina directă a soarelui, temperatura 5-25°C, fără deformări',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 6.2'
  },
  {
    id: 'picioare-004',
    name: 'Încălțăminte dielectrică',
    category: 'picioare',
    standard: 'EN ISO 20345',
    inspectionInterval: 6,
    replacementCriteria: [
      'După test dielectric negativ',
      'Contaminare cu substanțe conductoare',
      'Deteriorarea tălpii izolante',
      'Fisuri sau perforări',
      'Expirarea certificării'
    ],
    storageRequirements: 'Stocare pe rafturi de lemn/plastic, ferit de umiditate, testare dielectrică periodică obligatorie',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 6.3'
  },

  // PROTECȚIA CORPULUI
  {
    id: 'corp-001',
    name: 'Îmbrăcăminte de lucru de înaltă vizibilitate',
    category: 'corp',
    standard: 'EN ISO 20471',
    inspectionInterval: 6,
    replacementCriteria: [
      'Degradarea materialului reflectorizant',
      'Decolorarea materialului fluorescent',
      'Rupturi sau zgârieturi ale benzilor reflectorizante',
      'Contaminare excesivă care afectează vizibilitatea',
      'Pierderea conformității cu standardul'
    ],
    storageRequirements: 'Spălare conform instrucțiunilor producătorului, depozitare ferit de lumina directă, evitarea temperaturilor extreme',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 7.1'
  },
  {
    id: 'corp-002',
    name: 'Îmbrăcăminte de protecție împotriva substanțelor chimice',
    category: 'corp',
    standard: 'EN 14605',
    inspectionInterval: 1,
    replacementCriteria: [
      'După fiecare utilizare (pentru tipuri de unică folosință)',
      'Rupturi, perforări sau fisuri',
      'Deteriorarea cusăturilor',
      'Pierderea impermeabilității',
      'Contaminare chimică'
    ],
    storageRequirements: 'Depozitare în ambalaj original sigilat până la utilizare, temperatura controlată, ferit de lumină UV și ozon',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 7.2'
  },
  {
    id: 'corp-003',
    name: 'Vestă de protecție antiglonț',
    category: 'corp',
    standard: 'EN 1063',
    inspectionInterval: 12,
    replacementCriteria: [
      'După orice impact balistic',
      'Deteriorare vizibilă a plăcilor balistice',
      'Expirarea termenului de valabilitate (5-10 ani)',
      'Degradarea huselor sau sistemului de purtare',
      'Test balistic negativ'
    ],
    storageRequirements: 'Depozitare plată, ferit de umiditate și temperaturi extreme, verificare anuală de către specialiști',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 7.3'
  },
  {
    id: 'corp-004',
    name: 'Îmbrăcăminte de protecție pentru sudori',
    category: 'corp',
    standard: 'EN ISO 11611',
    inspectionInterval: 3,
    replacementCriteria: [
      'Arsuri, găuri sau deteriorări ale materialului',
      'Degradarea cusăturilor',
      'Pierderea proprietăților ignifuge',
      'Uzură excesivă în zonele de expunere',
      'Decolorare semnificativă'
    ],
    storageRequirements: 'Curățare regulată fără înmuiere prelungită, uscare la aer, evitarea contactului cu uleiuri sau grăsimi',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 7.4'
  },
  {
    id: 'corp-005',
    name: 'Șorț de protecție',
    category: 'corp',
    standard: 'EN ISO 13688',
    inspectionInterval: 6,
    replacementCriteria: [
      'Rupturi, găuri sau uzură excesivă',
      'Pierderea rezistenței la agenți specifici',
      'Deteriorarea sistemului de prindere',
      'Contaminare permanentă',
      'Pierderea impermeabilității (pentru șorțuri impermeabile)'
    ],
    storageRequirements: 'Atârnare pe cârlige dedicate, curățare după utilizare, depozitare în spații uscate și ventilate',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 7.5'
  },

  // PROTECȚIA ÎMPOTRIVA CĂDERILOR
  {
    id: 'cadere-001',
    name: 'Ham de siguranță',
    category: 'cadere',
    standard: 'EN 361',
    inspectionInterval: 12,
    replacementCriteria: [
      'După orice cădere reținută',
      'Deteriorarea curelelor (tăieturi, uzură, arsuri)',
      'Catarame sau elemente metalice deteriorate/corodate',
      'Cusături rupte sau slăbite',
      'Expirarea termenului de valabilitate (conform producător)',
      'Test de verificare negativ'
    ],
    storageRequirements: 'Depozitare atârnat, ferit de substanțe chimice, uleiuri, surse de căldură și lumină UV directă',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 8.1'
  },
  {
    id: 'cadere-002',
    name: 'Dispozitiv antică­dere tip absorbant de șoc',
    category: 'cadere',
    standard: 'EN 355',
    inspectionInterval: 12,
    replacementCriteria: [
      'După activare (absorbția unui șoc)',
      'Deteriorarea ambalajului absorbantului',
      'Conector deteriorat sau corodat',
      'Expirarea perioadei de valabilitate',
      'Orice deteriorare vizibilă'
    ],
    storageRequirements: 'Depozitare în loc uscat, ferit de temperaturi extreme (-20°C până +50°C), verificare periodică obligatorie',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 8.2'
  },
  {
    id: 'cadere-003',
    name: 'Coardă de siguranță cu dispozitiv de blocare',
    category: 'cadere',
    standard: 'EN 353-2',
    inspectionInterval: 12,
    replacementCriteria: [
      'După orice cădere',
      'Uzură excesivă a corzii (destrămare, tăieturi)',
      'Defecțiunea dispozitivului de blocare',
      'Coroziunea pieselor metalice',
      'Test funcțional negativ',
      'Termenul de valabilitate depășit'
    ],
    storageRequirements: 'Păstrare înfășurată corespunzător, ferit de agresori chimici, verificare funcțională înainte de fiecare utilizare',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 8.3'
  },
  {
    id: 'cadere-004',
    name: 'Sistem de poziționare la locul de muncă',
    category: 'cadere',
    standard: 'EN 358',
    inspectionInterval: 12,
    replacementCriteria: [
      'Deteriorarea centurii sau hamului',
      'Catarame sau conectori deteriorați',
      'Cusături slăbite sau rupte',
      'Corzi uzate sau tăiate',
      'Eșec la testele de verificare anuală'
    ],
    storageRequirements: 'Depozitare în condiții curate și uscate, protejat de lumina solară directă, verificare înainte de fiecare utilizare',
    legalBasis: 'HG 1048/2006, Anexa 1, pct. 8.4'
  }
];

/**
 * Grupare categorii EIP după tipul de protecție
 */
export const EIP_BY_CATEGORY = {
  cap: EIP_CATEGORIES.filter(eip => eip.category === 'cap'),
  ochi: EIP_CATEGORIES.filter(eip => eip.category === 'ochi'),
  urechi: EIP_CATEGORIES.filter(eip => eip.category === 'urechi'),
  respirator: EIP_CATEGORIES.filter(eip => eip.category === 'respirator'),
  maini: EIP_CATEGORIES.filter(eip => eip.category === 'maini'),
  picioare: EIP_CATEGORIES.filter(eip => eip.category === 'picioare'),
  corp: EIP_CATEGORIES.filter(eip => eip.category === 'corp'),
  cadere: EIP_CATEGORIES.filter(eip => eip.category === 'cadere')
};

/**
 * Obține categoria EIP după ID
 */
export function getEIPById(id: string): EIPCategory | undefined {
  return EIP_CATEGORIES.find(eip => eip.id === id);
}

/**
 * Obține categoriile EIP după tip de protecție
 */
export function getEIPByCategory(category: EIPCategory['category']): EIPCategory[] {
  return EIP_CATEGORIES.filter(eip => eip.category === category);
}

/**
 * Obține categoriile EIP care necesită inspecție în luna curentă
 */
export function getEIPForInspection(lastInspectionDate: Date, currentDate: Date = new Date()): EIPCategory[] {
  const monthsSinceInspection =
    (currentDate.getFullYear() - lastInspectionDate.getFullYear()) * 12 +
    (currentDate.getMonth() - lastInspectionDate.getMonth());

  return EIP_CATEGORIES.filter(eip => monthsSinceInspection >= eip.inspectionInterval);
}
