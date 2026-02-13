/**
 * Template pentru Fișa Postului cu responsabilități SSM
 * Conform legislației românești privind securitatea și sănătatea în muncă
 */

export interface FisaPostSSMTemplate {
  identificare: {
    denumirePost: string;
    compartiment: string;
    subordonatFata: string;
    areInSubordonare: string;
    inlocuireAbsenta: string;
  };
  cerinte: {
    studii: string;
    experienta: string;
    cunostinte: string[];
    abilitati: string[];
    alteCerinte: string[];
  };
  atributii: {
    principale: string[];
    secundare: string[];
  };
  responsabilitatiSSM: {
    puncte: string[];
  };
  eipNecesar: {
    echipamente: string[];
    observatii: string;
  };
  instruire: {
    instruireInitiala: boolean;
    instruirePeriodica: string;
    instruireLocMunca: boolean;
    evaluareCompetente: boolean;
  };
  riscuri: {
    identificate: string[];
    masuri: string[];
  };
}

/**
 * Template standard cu cele 15 responsabilități SSM obligatorii
 * conform Legii 319/2006 și normelor metodologice
 */
export const responsabilitatiSSMStandard: string[] = [
  "1. Să cunoască și să respecte normele și instrucțiunile de securitate și sănătate în muncă aplicabile la locul de muncă.",
  "2. Să utilizeze corect echipamentele tehnice, substanțele periculoase, echipamentele de transport și alte mijloace de producție.",
  "3. Să utilizeze corect echipamentul individual de protecție acordat și, după utilizare, să îl îngrijească, să îl curețe, să îl dezinfecteze și să îl depoziteze în locuri special amenajate.",
  "4. Să nu procedeze la scoaterea din funcțiune, la modificarea, schimbarea sau înlăturarea arbitrară a dispozitivelor de securitate proprii, în special ale echipamentelor tehnice, echipamentelor de protecție, instalațiilor și clădirilor, și să utilizeze corect aceste dispozitive.",
  "5. Să comunice imediat angajatorului și/sau lucrătorilor desemnați orice situație de muncă despre care au motive întemeiate să o considere un pericol pentru securitatea și sănătatea lucrătorilor, precum și orice deficiență a sistemelor de protecție.",
  "6. Să aducă la cunoștință conducătorului locului de muncă și/sau angajatorului accidentele suferite de propria persoană.",
  "7. Să coopereze cu angajatorul și/sau cu lucrătorii desemnați, astfel încât să permită angajatorului să se asigure că mediul de muncă și condițiile de lucru sunt sigure și fără riscuri pentru securitate și sănătate, în domeniul său de activitate.",
  "8. Să dea relații și să furnizeze informații inspectorilor de muncă și inspectorilor sanitari cu privire la aspectele de securitate și sănătate în muncă.",
  "9. Să urmeze instruirea în domeniul securității și sănătății în muncă.",
  "10. Să utilizeze aparatura, instrumentarul și substanțele chimice numai în scopul pentru care au fost concepute și în conformitate cu instrucțiunile primite.",
  "11. Să se conformeze măsurilor stabilite de către comitetul de securitate și sănătate în muncă.",
  "12. Să-și însușească și să respecte măsurile de prim ajutor, de stingere a incendiilor și de evacuare a lucrătorilor în caz de pericol grav și iminent.",
  "13. Să nu consume băuturi alcoolice și alte substanțe interzise pe durata programului de lucru.",
  "14. Să semnaleze orice defecțiuni tehnice sau alte situații care constituie un pericol de accidentare sau îmbolnăvire profesională.",
  "15. Să participe, la solicitarea angajatorului sau a organelor de control, la cercetarea evenimentelor care au dus sau puteau duce la producerea unui accident de muncă sau a unei boli profesionale."
];

/**
 * Template implicit pentru Fișa Postului
 * Poate fi customizat pentru fiecare post în parte
 */
export const fisaPostSSMTemplateDefault: Partial<FisaPostSSMTemplate> = {
  identificare: {
    denumirePost: "",
    compartiment: "",
    subordonatFata: "",
    areInSubordonare: "",
    inlocuireAbsenta: ""
  },
  cerinte: {
    studii: "",
    experienta: "",
    cunostinte: [],
    abilitati: [],
    alteCerinte: []
  },
  atributii: {
    principale: [],
    secundare: []
  },
  responsabilitatiSSM: {
    puncte: responsabilitatiSSMStandard
  },
  eipNecesar: {
    echipamente: [],
    observatii: ""
  },
  instruire: {
    instruireInitiala: true,
    instruirePeriodica: "Anual",
    instruireLocMunca: true,
    evaluareCompetente: true
  },
  riscuri: {
    identificate: [],
    masuri: []
  }
};

/**
 * Exemple de EIP (Echipament Individual de Protecție) comune
 * pentru diferite tipuri de posturi
 */
export const eipComune = {
  birou: [
    "Nu este cazul sau echipamente ergonomice (suport laptop, suport încheieturi)"
  ],
  productie: [
    "Încălțăminte de protecție cu bombeu metalic",
    "Mănuși de protecție",
    "Ochelari de protecție",
    "Vestă reflectorizantă",
    "Cască de protecție"
  ],
  constructii: [
    "Cască de protecție",
    "Încălțăminte de protecție S3",
    "Vestă reflectorizantă",
    "Mănuși de protecție",
    "Ochelari de protecție",
    "Ham de siguranță (pentru lucru la înălțime)"
  ],
  medical: [
    "Mănuși medicale",
    "Mască de protecție",
    "Halat de protecție",
    "Ochelari de protecție",
    "Bonete"
  ],
  laborator: [
    "Halat de laborator",
    "Mănuși rezistente la substanțe chimice",
    "Ochelari de protecție",
    "Mască cu filtru (dacă este cazul)"
  ]
};

/**
 * Exemple de riscuri comune și măsuri de prevenire
 * pentru diferite categorii de posturi
 */
export const riscuriComune = {
  birou: {
    riscuri: [
      "Efort vizual prelungit la calculator",
      "Posturi de lucru neergonomice",
      "Sedentarism",
      "Stres psihosocial",
      "Căderi de la același nivel (podele alunecoase, cabluri)"
    ],
    masuri: [
      "Pauze regulate, exerciții pentru ochi",
      "Reglarea corectă a scaunului și monitorului",
      "Pauze active, schimbarea poziției",
      "Management corespunzător al sarcinilor de lucru",
      "Menținerea ordinii la locul de muncă, fixarea cablurilor"
    ]
  },
  productie: {
    riscuri: [
      "Contact cu mașini și echipamente în mișcare",
      "Manipulare greutăți",
      "Zgomot ocupațional",
      "Expunere la substanțe chimice",
      "Risc electric"
    ],
    masuri: [
      "Utilizarea dispozitivelor de protecție ale mașinilor",
      "Instruire privind manipularea corectă, utilizare dispozitive de ridicare",
      "Utilizare căști antifonice, monitorizare nivel zgomot",
      "Ventilație adecvată, utilizare EIP specific, fișe de securitate",
      "Verificări periodice instalații electrice, instruire personal"
    ]
  },
  constructii: {
    riscuri: [
      "Cădere de la înălțime",
      "Lovire de/cu obiecte",
      "Prindere/strivire",
      "Electrocutare",
      "Condiții meteorologice nefavorabile"
    ],
    masuri: [
      "Utilizare ham de siguranță, platforme de lucru sigure, balustrade",
      "Semnalizare zonă lucru, utilizare cască de protecție",
      "Proceduri de lucru sigure, instruire personal",
      "Verificare instalații, utilizare echipamente conforme",
      "Adaptarea programului de lucru, echipament adecvat"
    ]
  }
};

/**
 * Helper function pentru generarea unei fișe de post complete
 */
export function generareFisaPost(
  dateBaza: Partial<FisaPostSSMTemplate>,
  categoriePost: keyof typeof eipComune = 'birou',
  categorieRiscuri: keyof typeof riscuriComune = 'birou'
): FisaPostSSMTemplate {
  return {
    identificare: {
      ...fisaPostSSMTemplateDefault.identificare!,
      ...dateBaza.identificare
    },
    cerinte: {
      ...fisaPostSSMTemplateDefault.cerinte!,
      ...dateBaza.cerinte
    },
    atributii: {
      ...fisaPostSSMTemplateDefault.atributii!,
      ...dateBaza.atributii
    },
    responsabilitatiSSM: {
      puncte: responsabilitatiSSMStandard
    },
    eipNecesar: {
      echipamente: dateBaza.eipNecesar?.echipamente || eipComune[categoriePost],
      observatii: dateBaza.eipNecesar?.observatii || ""
    },
    instruire: {
      ...fisaPostSSMTemplateDefault.instruire!,
      ...dateBaza.instruire
    },
    riscuri: {
      identificate: dateBaza.riscuri?.identificate || riscuriComune[categorieRiscuri].riscuri,
      masuri: dateBaza.riscuri?.masuri || riscuriComune[categorieRiscuri].masuri
    }
  };
}
