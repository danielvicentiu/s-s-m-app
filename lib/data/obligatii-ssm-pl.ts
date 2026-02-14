/**
 * Obligații BHP (Bezpieczeństwo i Higiena Pracy) pentru Polonia
 * Bază legală: Kodeks pracy Dział X, Rozporządzenie MPiPS
 * Categorii: ocena ryzyka, szkolenia BHP, badania lekarskie, środki ochrony, wypadki przy pracy, służba BHP
 */

export interface ObligatieBHP {
  id: string;
  category: 'ocena_ryzyka' | 'szkolenia_bhp' | 'badania_lekarskie' | 'srodki_ochrony' | 'wypadki_przy_pracy' | 'sluzba_bhp';
  title: string;
  titlePL: string;
  legalBasis: string;
  description: string;
  frequency: 'annual' | 'biannual' | 'monthly' | 'quarterly' | 'on_demand' | 'once' | 'continuous';
  responsibleRole: string;
  penaltyMin: number;
  penaltyMax: number;
  currency: 'PLN';
  authority: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const obligatiiBHPPolonya: ObligatieBHP[] = [
  // OCENA RYZYKA (Evaluarea riscurilor)
  {
    id: 'pl-bhp-001',
    category: 'ocena_ryzyka',
    title: 'Evaluarea riscurilor profesionale',
    titlePL: 'Ocena ryzyka zawodowego',
    legalBasis: 'Art. 226 Kodeksu pracy',
    description: 'Angajatorul trebuie să efectueze și să documenteze evaluarea riscurilor pentru toate locurile de muncă și să actualizeze periodic această evaluare.',
    frequency: 'annual',
    responsibleRole: 'Pracodawca / Służba BHP',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'Państwowa Inspekcja Pracy (PIP)',
    severity: 'critical'
  },
  {
    id: 'pl-bhp-002',
    category: 'ocena_ryzyka',
    title: 'Actualizarea evaluării riscurilor după incident',
    titlePL: 'Aktualizacja oceny ryzyka po wypadku',
    legalBasis: 'Art. 226 § 2 Kodeksu pracy',
    description: 'După orice accident de muncă sau situație periculoasă, evaluarea riscurilor trebuie actualizată pentru locurile de muncă afectate.',
    frequency: 'on_demand',
    responsibleRole: 'Pracodawca / Służba BHP',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'PIP',
    severity: 'high'
  },
  {
    id: 'pl-bhp-003',
    category: 'ocena_ryzyka',
    title: 'Informarea lucrătorilor despre riscuri',
    titlePL: 'Informowanie pracowników o ryzyku',
    legalBasis: 'Art. 226 § 3 Kodeksu pracy',
    description: 'Angajatorul trebuie să informeze fiecare lucrător despre riscurile specifice locului său de muncă și măsurile de protecție aplicate.',
    frequency: 'on_demand',
    responsibleRole: 'Pracodawca / Kierownik',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'PIP',
    severity: 'high'
  },

  // SZKOLENIA BHP (Instruiri BHP)
  {
    id: 'pl-bhp-004',
    category: 'szkolenia_bhp',
    title: 'Instruire BHP inițială (generală)',
    titlePL: 'Szkolenie wstępne ogólne',
    legalBasis: 'Art. 237³ § 2 Kodeksu pracy + Rozporządzenie MPiPS',
    description: 'Instruirea BHP generală obligatorie pentru toți lucrătorii înainte de începerea activității, cu durata minimă de 3 ore (lucrători de birou) sau 6 ore (lucrători fizici).',
    frequency: 'once',
    responsibleRole: 'Pracodawca / Służba BHP',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'PIP',
    severity: 'critical'
  },
  {
    id: 'pl-bhp-005',
    category: 'szkolenia_bhp',
    title: 'Instruire BHP inițială (la locul de muncă)',
    titlePL: 'Szkolenie wstępne stanowiskowe',
    description: 'Instruirea practică la locul de muncă, efectuată de superior direct, cu durata minimă de 8 ore (birou) sau 16 ore (producție).',
    legalBasis: 'Art. 237³ § 2 Kodeksu pracy',
    frequency: 'once',
    responsibleRole: 'Bezpośredni przełożony',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'PIP',
    severity: 'critical'
  },
  {
    id: 'pl-bhp-006',
    category: 'szkolenia_bhp',
    title: 'Instruire BHP periodică pentru lucrători',
    titlePL: 'Szkolenie okresowe pracowników',
    legalBasis: 'Art. 237³ § 3 Kodeksu pracy',
    description: 'Instruire BHP periodică obligatorie: o dată la 3 ani pentru lucrători de birou, o dată pe an pentru lucrători din producție și servicii.',
    frequency: 'annual',
    responsibleRole: 'Pracodawca / Służba BHP',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'PIP',
    severity: 'high'
  },
  {
    id: 'pl-bhp-007',
    category: 'szkolenia_bhp',
    title: 'Instruire BHP pentru conducători și specialiști',
    titlePL: 'Szkolenie BHP dla kierowników i specjalistów',
    legalBasis: 'Rozporządzenie MPiPS z 2004 r.',
    description: 'Instruirea BHP specializată pentru persoane care conduc lucrători (forma I-III), cu durata de 16-40 ore, reînnoire la fiecare 5 ani.',
    frequency: 'biannual',
    responsibleRole: 'Pracodawca',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'PIP',
    severity: 'critical'
  },
  {
    id: 'pl-bhp-008',
    category: 'szkolenia_bhp',
    title: 'Instruire pentru angajați temporari și stagiari',
    titlePL: 'Szkolenie dla pracowników tymczasowych i stażystów',
    legalBasis: 'Art. 237³ Kodeksu pracy',
    description: 'Toți angajații temporari, stagiari și lucrătorii în practică trebuie instruiți BHP înainte de începerea activității.',
    frequency: 'once',
    responsibleRole: 'Pracodawca / Służba BHP',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'PIP',
    severity: 'high'
  },

  // BADANIA LEKARSKIE (Control medical)
  {
    id: 'pl-bhp-009',
    category: 'badania_lekarskie',
    title: 'Control medical la angajare',
    titlePL: 'Badania wstępne',
    legalBasis: 'Art. 229 § 1 Kodeksu pracy',
    description: 'Examen medical obligatoriu înainte de admiterea la muncă pentru toate persoanele, pentru a confirma aptitudinea de a desfășura munca pe postul respectiv.',
    frequency: 'once',
    responsibleRole: 'Pracodawca',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'PIP',
    severity: 'critical'
  },
  {
    id: 'pl-bhp-010',
    category: 'badania_lekarskie',
    title: 'Control medical periodic',
    titlePL: 'Badania okresowe',
    legalBasis: 'Art. 229 § 2 Kodeksu pracy',
    description: 'Examene medicale periodice obligatorii: anual, o dată la 2 ani, sau la 3-4 ani, în funcție de vârstă, tipul muncii și factorii de risc.',
    frequency: 'annual',
    responsibleRole: 'Pracodawca',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'PIP',
    severity: 'high'
  },
  {
    id: 'pl-bhp-011',
    category: 'badania_lekarskie',
    title: 'Control medical de control',
    titlePL: 'Badania kontrolne',
    legalBasis: 'Art. 229 § 3 Kodeksu pracy',
    description: 'Examen medical după absență prelungită din motive de sănătate (peste 30 zile) pentru a confirma aptitudinea de revenire la muncă.',
    frequency: 'on_demand',
    responsibleRole: 'Pracodawca',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'PIP',
    severity: 'high'
  },
  {
    id: 'pl-bhp-012',
    category: 'badania_lekarskie',
    title: 'Documente medicale și păstrarea registrelor',
    titlePL: 'Dokumentacja medyczna i prowadzenie ewidencji',
    legalBasis: 'Art. 229 § 8 Kodeksu pracy',
    description: 'Angajatorul trebuie să țină evidența controalelor medicale și să păstreze copii ale certificatelor medicale pe durata angajării.',
    frequency: 'continuous',
    responsibleRole: 'Pracodawca / HR',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'PIP',
    severity: 'medium'
  },

  // ŚRODKI OCHRONY (Echipamente de protecție)
  {
    id: 'pl-bhp-013',
    category: 'srodki_ochrony',
    title: 'Furnizarea echipamentelor de protecție individuală (EPI)',
    titlePL: 'Zapewnienie środków ochrony indywidualnej (ŚOI)',
    legalBasis: 'Art. 2377 Kodeksu pracy',
    description: 'Angajatorul este obligat să furnizeze gratuit, întreține și înlocuiască EPI-urile conforme cu standardele, în funcție de riscurile identificate.',
    frequency: 'continuous',
    responsibleRole: 'Pracodawca',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'PIP',
    severity: 'high'
  },
  {
    id: 'pl-bhp-014',
    category: 'srodki_ochrony',
    title: 'Furnizarea îmbrăcămintei de lucru și încălțămintei',
    titlePL: 'Zapewnienie odzieży i obuwia roboczego',
    legalBasis: 'Art. 2377 Kodeksu pracy',
    description: 'Îmbrăcăminte și încălțăminte de lucru adecvată pentru protecția împotriva factorilor periculoși, nocivi sau murdari.',
    frequency: 'continuous',
    responsibleRole: 'Pracodawca',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'PIP',
    severity: 'medium'
  },
  {
    id: 'pl-bhp-015',
    category: 'srodki_ochrony',
    title: 'Instrucțiuni de utilizare și întreținere EPI',
    titlePL: 'Instrukcje użytkowania i konserwacji ŚOI',
    legalBasis: 'Rozporządzenie MPiPS w sprawie ŚOI',
    description: 'Instruirea lucrătorilor privind folosirea corectă, întreținerea și păstrarea echipamentelor de protecție furnizate.',
    frequency: 'on_demand',
    responsibleRole: 'Pracodawca / Służba BHP',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'PIP',
    severity: 'medium'
  },
  {
    id: 'pl-bhp-016',
    category: 'srodki_ochrony',
    title: 'Evidența distribuirii EPI',
    titlePL: 'Ewidencja wydawania ŚOI',
    legalBasis: 'Rozporządzenie MPiPS w sprawie ŚOI',
    description: 'Menținerea registrului de distribuire a echipamentelor de protecție individuală cu confirmarea de primire de către lucrători.',
    frequency: 'continuous',
    responsibleRole: 'Pracodawca / Magazynier',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'PIP',
    severity: 'medium'
  },

  // WYPADKI PRZY PRACY (Accidente de muncă)
  {
    id: 'pl-bhp-017',
    category: 'wypadki_przy_pracy',
    title: 'Raportarea imediată a accidentelor grave',
    titlePL: 'Natychmiastowe zgłoszenie wypadków ciężkich',
    legalBasis: 'Art. 234 § 2 Kodeksu pracy',
    description: 'Angajatorul trebuie să raporteze imediat (24 ore) către PIP și procuratură orice accident mortal, grav sau colectiv.',
    frequency: 'on_demand',
    responsibleRole: 'Pracodawca',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'PIP',
    severity: 'critical'
  },
  {
    id: 'pl-bhp-018',
    category: 'wypadki_przy_pracy',
    title: 'Investigarea accidentelor de muncă',
    titlePL: 'Ustalenie okoliczności i przyczyn wypadku',
    legalBasis: 'Art. 234 § 1 Kodeksu pracy',
    description: 'Constituirea comisiei de anchetă și investigarea completă a fiecărui accident de muncă în termen de 14 zile.',
    frequency: 'on_demand',
    responsibleRole: 'Komisja powypadkowa',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'PIP',
    severity: 'critical'
  },
  {
    id: 'pl-bhp-019',
    category: 'wypadki_przy_pracy',
    title: 'Întocmirea protocolului de accident (Protocol)',
    titlePL: 'Sporządzenie protokołu powypadkowego',
    legalBasis: 'Rozporządzenie Rady Ministrów ws. wypadków',
    description: 'Documentarea accidentului de muncă pe formularul oficial (Protocol ZUS-ZW) cu constatările comisiei de anchetă.',
    frequency: 'on_demand',
    responsibleRole: 'Komisja powypadkowa',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'PIP',
    severity: 'high'
  },
  {
    id: 'pl-bhp-020',
    category: 'wypadki_przy_pracy',
    title: 'Registrul de accidente de muncă',
    titlePL: 'Rejestr wypadków przy pracy',
    legalBasis: 'Rozporządzenie Rady Ministrów ws. wypadków',
    description: 'Menținerea registrului de evidență a tuturor accidentelor de muncă (carte de accidente) la locul de muncă.',
    frequency: 'continuous',
    responsibleRole: 'Pracodawca / Służba BHP',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'PIP',
    severity: 'high'
  },
  {
    id: 'pl-bhp-021',
    category: 'wypadki_przy_pracy',
    title: 'Raportare statistică anuală accidente',
    titlePL: 'Roczne sprawozdanie o wypadkach',
    legalBasis: 'Rozporządzenie Rady Ministrów ws. wypadków',
    description: 'Transmiterea raportului anual privind accidentele de muncă către GUS (Oficiul Statistic Central) până la 31 ianuarie.',
    frequency: 'annual',
    responsibleRole: 'Pracodawca',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'PIP / GUS',
    severity: 'medium'
  },

  // SŁUŻBA BHP (Serviciul BHP)
  {
    id: 'pl-bhp-022',
    category: 'sluzba_bhp',
    title: 'Organizarea serviciului BHP',
    titlePL: 'Utworzenie służby bhp',
    legalBasis: 'Art. 237¹ Kodeksu pracy',
    description: 'Angajatorii cu peste 100 angajați trebuie să înființeze serviciu BHP propriu; sub 100 - specialist extern sau pracodawca instruit.',
    frequency: 'continuous',
    responsibleRole: 'Pracodawca',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'PIP',
    severity: 'critical'
  },
  {
    id: 'pl-bhp-023',
    category: 'sluzba_bhp',
    title: 'Calificarea specialistului BHP',
    titlePL: 'Kwalifikacje specjalisty bhp',
    legalBasis: 'Rozporządzenie Rady Ministrów ws. służby bhp',
    description: 'Specialistul BHP trebuie să dețină certificat de absolvire a cursului de tehnician/inginer BHP conform cerințelor legale.',
    frequency: 'continuous',
    responsibleRole: 'Pracodawca',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'PIP',
    severity: 'high'
  },
  {
    id: 'pl-bhp-024',
    category: 'sluzba_bhp',
    title: 'Număr adecvat de specialiști BHP',
    titlePL: 'Odpowiednia liczba pracowników służby bhp',
    legalBasis: 'Rozporządzenie Rady Ministrów ws. służby bhp',
    description: 'Asigurarea numărului minim de specialiști BHP în funcție de numărul de angajați și categoria de risc: 1 specialist la 100-600 lucrători.',
    frequency: 'continuous',
    responsibleRole: 'Pracodawca',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'PIP',
    severity: 'high'
  },
  {
    id: 'pl-bhp-025',
    category: 'sluzba_bhp',
    title: 'Comisia de securitate și sănătate în muncă',
    titlePL: 'Komisja bhp',
    legalBasis: 'Art. 23711 Kodeksu pracy',
    description: 'La angajatori cu peste 250 lucrători, obligația de a constitui o comisie paritară BHP compusă din reprezentanți ai angajatorului și ai angajaților.',
    frequency: 'continuous',
    responsibleRole: 'Pracodawca / Związki zawodowe',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'PIP',
    severity: 'medium'
  },
  {
    id: 'pl-bhp-026',
    category: 'sluzba_bhp',
    title: 'Audituri și controale interne BHP',
    titlePL: 'Kontrole wewnętrzne służby bhp',
    legalBasis: 'Art. 237¹ § 2 Kodeksu pracy',
    description: 'Serviciul BHP trebuie să efectueze audituri și controale periodice ale condițiilor de muncă și respectării normelor de securitate.',
    frequency: 'quarterly',
    responsibleRole: 'Służba BHP',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'PIP',
    severity: 'medium'
  },

  // DIVERSE (Altele)
  {
    id: 'pl-bhp-027',
    category: 'srodki_ochrony',
    title: 'Asigurarea primului ajutor',
    titlePL: 'Zapewnienie środków pierwszej pomocy',
    legalBasis: 'Art. 2095 Kodeksu pracy',
    description: 'Angajatorul trebuie să asigure truse de prim ajutor complet echipate, accesibile și actualizate, precum și personal instruit.',
    frequency: 'continuous',
    responsibleRole: 'Pracodawca',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'PIP',
    severity: 'high'
  },
  {
    id: 'pl-bhp-028',
    category: 'ocena_ryzyka',
    title: 'Măsuri de prevenire a incendiilor',
    titlePL: 'Środki ochrony przeciwpożarowej',
    legalBasis: 'Ustawa o ochronie przeciwpożarowej',
    description: 'Asigurarea stingătoarelor, hidranților, ieșirilor de urgență, instruirea personalului și întocmirea planului de evacuare.',
    frequency: 'annual',
    responsibleRole: 'Pracodawca',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'Straż Pożarna',
    severity: 'high'
  },
  {
    id: 'pl-bhp-029',
    category: 'sluzba_bhp',
    title: 'Regulamentul intern de muncă',
    titlePL: 'Regulamin pracy',
    legalBasis: 'Art. 104 Kodeksu pracy',
    description: 'Angajatori cu peste 20 lucrători trebuie să aibă regulament intern care include și prevederi privind BHP.',
    frequency: 'once',
    responsibleRole: 'Pracodawca',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'PIP',
    severity: 'medium'
  },
  {
    id: 'pl-bhp-030',
    category: 'badania_lekarskie',
    title: 'Supravegherea sănătății lucrătorilor expuși',
    titlePL: 'Nadzór nad stanem zdrowia pracowników narażonych',
    legalBasis: 'Art. 229 Kodeksu pracy',
    description: 'Pentru lucrătorii expuși la factori nocivi (zgomot, substanțe chimice, vibrații), examene medicale mai frecvente și supraveghere specială.',
    frequency: 'annual',
    responsibleRole: 'Pracodawca / Lekarz medycyny pracy',
    penaltyMin: 1000,
    penaltyMax: 30000,
    currency: 'PLN',
    authority: 'PIP',
    severity: 'high'
  }
];

// Export tipizat pentru compatibilitate cu sistemul central
export type CategoryBHP = ObligatieBHP['category'];
export type FrequencyBHP = ObligatieBHP['frequency'];
export type SeverityBHP = ObligatieBHP['severity'];

// Funcție helper pentru filtrare după categorie
export function getObligatiiByCategory(category: CategoryBHP): ObligatieBHP[] {
  return obligatiiBHPPolonya.filter(obl => obl.category === category);
}

// Funcție helper pentru statistici
export function getObligatiiStats() {
  return {
    total: obligatiiBHPPolonya.length,
    byCategory: {
      ocena_ryzyka: getObligatiiByCategory('ocena_ryzyka').length,
      szkolenia_bhp: getObligatiiByCategory('szkolenia_bhp').length,
      badania_lekarskie: getObligatiiByCategory('badania_lekarskie').length,
      srodki_ochrony: getObligatiiByCategory('srodki_ochrony').length,
      wypadki_przy_pracy: getObligatiiByCategory('wypadki_przy_pracy').length,
      sluzba_bhp: getObligatiiByCategory('sluzba_bhp').length
    },
    bySeverity: {
      critical: obligatiiBHPPolonya.filter(o => o.severity === 'critical').length,
      high: obligatiiBHPPolonya.filter(o => o.severity === 'high').length,
      medium: obligatiiBHPPolonya.filter(o => o.severity === 'medium').length,
      low: obligatiiBHPPolonya.filter(o => o.severity === 'low').length
    }
  };
}
