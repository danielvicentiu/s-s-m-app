/**
 * Template contract prestări servicii SSM (Securitate și Sănătate în Muncă)
 *
 * Această structură este folosită pentru generarea automată a contractelor
 * între consultanți SSM și firmele beneficiare.
 */

export interface ContractParty {
  name: string;
  cui: string;
  registru: string;
  sediu: string;
  reprezentant: string;
  functie: string;
  telefon?: string;
  email?: string;
}

export interface ContractData {
  numarContract: string;
  dataContract: string;
  prestator: ContractParty;
  beneficiar: ContractParty;
  numarAngajati: number;
  puncteLucru: string[];
  durata: {
    dataInceput: string;
    dataSfarsit: string;
    perioadaLuni: number;
  };
  pret: {
    valoareLunara: number;
    valoareTotala: number;
    moneda: string;
    termenPlata: number; // zile
  };
}

export const CONTRACT_SSM_TEMPLATE = {
  titlu: "CONTRACT DE PRESTĂRI SERVICII",
  subtitlu: "Servicii de Securitate și Sănătate în Muncă (SSM)",

  preambul: `Încheiat astăzi, {{dataContract}}, între:`,

  parti: {
    prestator: {
      titlu: "PRESTATOR",
      campuri: [
        "{{prestator.name}}, cu sediul în {{prestator.sediu}}",
        "înregistrată la Registrul Comerțului sub nr. {{prestator.registru}}",
        "Cod Fiscal {{prestator.cui}}",
        "reprezentată legal de {{prestator.reprezentant}}, în calitate de {{prestator.functie}}",
        "telefon: {{prestator.telefon}}, email: {{prestator.email}}"
      ]
    },
    beneficiar: {
      titlu: "BENEFICIAR",
      campuri: [
        "{{beneficiar.name}}, cu sediul în {{beneficiar.sediu}}",
        "înregistrată la Registrul Comerțului sub nr. {{beneficiar.registru}}",
        "Cod Fiscal {{beneficiar.cui}}",
        "reprezentată legal de {{beneficiar.reprezentant}}, în calitate de {{beneficiar.functie}}",
        "telefon: {{beneficiar.telefon}}, email: {{beneficiar.email}}"
      ]
    }
  },

  obiect: {
    titlu: "Art. 1 - OBIECTUL CONTRACTULUI",
    continut: [
      "1.1. Obiectul prezentului contract îl constituie prestarea de către PRESTATOR a serviciilor de securitate și sănătate în muncă pentru BENEFICIAR, conform prevederilor Legii nr. 319/2006 privind securitatea și sănătatea în muncă și a normelor metodologice de aplicare.",
      "1.2. Serviciile SSM se vor presta pentru un număr de {{numarAngajati}} angajați ai BENEFICIARULUI.",
      "1.3. Locurile de muncă ale BENEFICIARULUI se află la următoarele adrese: {{puncteLucru}}.",
      "1.4. Serviciile prestate includ, dar nu se limitează la: evaluarea riscurilor, elaborarea documentației SSM, instruirea angajaților, consultanță de specialitate și coordonarea activităților de prevenire și protecție."
    ]
  },

  obligatiiPrestator: {
    titlu: "Art. 2 - OBLIGAȚIILE PRESTATORULUI",
    puncte: [
      {
        nr: "2.1",
        text: "Să efectueze evaluarea inițială a riscurilor de accidentare și îmbolnăvire profesională pentru toate posturile de lucru ale BENEFICIARULUI, conform Hotărârii Guvernului nr. 1425/2006."
      },
      {
        nr: "2.2",
        text: "Să elaboreze și să mențină actualizate toate documentele obligatorii SSM: Planul de prevenire și protecție, Planul de acțiune, Instrucțiunile proprii de securitate și sănătate în muncă, Fișele de expunere la riscuri profesionale."
      },
      {
        nr: "2.3",
        text: "Să organizeze și să desfășoare instruirea de securitate și sănătate în muncă pentru angajații BENEFICIARULUI (instruire la angajare, instruire periodică, instruire la locul de muncă), conform legislației în vigoare."
      },
      {
        nr: "2.4",
        text: "Să asigure consultanță permanentă în domeniul SSM și să răspundă solicitărilor BENEFICIARULUI în termen de maximum 48 ore de la primirea acestora."
      },
      {
        nr: "2.5",
        text: "Să efectueze vizite periodice la sediul/punctele de lucru ale BENEFICIARULUI, minimum o dată pe lună, pentru monitorizarea condițiilor de muncă și verificarea aplicării măsurilor de prevenire."
      },
      {
        nr: "2.6",
        text: "Să participe la cercetarea evenimentelor conform Ordinului 387/2020 și să sprijine BENEFICIARUL în elaborarea măsurilor preventive și corective necesare."
      },
      {
        nr: "2.7",
        text: "Să elaboreze proceduri de lucru în condiții de securitate pentru activitățile cu risc ridicat identificate în cadrul evaluării riscurilor."
      },
      {
        nr: "2.8",
        text: "Să asiste BENEFICIARUL în relația cu Inspectoratul Teritorial de Muncă și alte autorități competente în domeniul SSM."
      },
      {
        nr: "2.9",
        text: "Să informeze BENEFICIARUL cu privire la modificările legislative în domeniul securității și sănătății în muncă și să actualizeze documentația în consecință."
      },
      {
        nr: "2.10",
        text: "Să verifice și să avizeze dotarea cu echipamente individuale de protecție (EIP) a angajaților, conform riscurilor identificate la locurile de muncă."
      },
      {
        nr: "2.11",
        text: "Să coordoneze activitățile de prevenire și protecție și să colaboreze cu serviciul medical de medicina muncii pentru asigurarea unui mediu de lucru sigur."
      },
      {
        nr: "2.12",
        text: "Să elaboreze și să actualizeze registrele și evidențele obligatorii SSM (registrul de instruire, registrul de evidență a accidentelor de muncă, etc.)."
      },
      {
        nr: "2.13",
        text: "Să propună măsuri de îmbunătățire a condițiilor de muncă și să monitorizeze implementarea acestora."
      },
      {
        nr: "2.14",
        text: "Să asigure confidențialitatea tuturor informațiilor obținute în cadrul prestării serviciilor, conform Art. 5 din prezentul contract."
      },
      {
        nr: "2.15",
        text: "Să păstreze evidența tuturor activităților desfășurate și să furnizeze rapoarte lunare/trimestriale BENEFICIARULUI cu privire la stadiul implementării măsurilor de SSM."
      }
    ]
  },

  obligatiiBeneficiar: {
    titlu: "Art. 3 - OBLIGAȚIILE BENEFICIARULUI",
    puncte: [
      {
        nr: "3.1",
        text: "Să furnizeze PRESTATORULUI toate informațiile necesare pentru prestarea serviciilor SSM: organigrama, fișele posturilor, date despre utilaje și echipamente, substanțe chimice utilizate, planuri ale clădirilor, etc."
      },
      {
        nr: "3.2",
        text: "Să asigure accesul reprezentanților PRESTATORULUI la toate locurile de muncă și să faciliteze desfășurarea activităților de evaluare și instruire."
      },
      {
        nr: "3.3",
        text: "Să informeze PRESTATORULUI cu privire la orice modificări intervenite în activitatea desfășurată: angajări/încetări, schimbări de tehnologie, noi utilaje, modificări ale spațiilor de lucru."
      },
      {
        nr: "3.4",
        text: "Să implementeze măsurile de prevenire și protecție stabilite în Planul de acțiune și să înștiințeze PRESTATORULUI despre stadiul implementării acestora."
      },
      {
        nr: "3.5",
        text: "Să asigure participarea angajaților la instruirile SSM organizate de PRESTATOR și să țină evidența datelor de instruire."
      },
      {
        nr: "3.6",
        text: "Să anunțe imediat PRESTATORULUI despre orice accident de muncă sau incident periculos survenit în cadrul activității."
      },
      {
        nr: "3.7",
        text: "Să achite la termen contravalorea serviciilor prestate, conform Art. 4 din prezentul contract."
      },
      {
        nr: "3.8",
        text: "Să desemneze o persoană responsabilă din cadrul organizației pentru colaborarea cu PRESTATORULUI în aplicarea măsurilor de SSM."
      },
      {
        nr: "3.9",
        text: "Să păstreze la sediul societății documentația SSM elaborată de PRESTATOR și să o prezinte la solicitarea autorităților de control."
      },
      {
        nr: "3.10",
        text: "Să respecte recomandările PRESTATORULUI în vederea îmbunătățirii condițiilor de muncă și eliminării/reducerii riscurilor profesionale."
      }
    ]
  },

  durata: {
    titlu: "Art. 4 - DURATA CONTRACTULUI",
    continut: [
      "4.1. Prezentul contract se încheie pe o perioadă de {{durata.perioadaLuni}} luni, începând cu data de {{durata.dataInceput}} și până la data de {{durata.dataSfarsit}}.",
      "4.2. Contractul poate fi prelungit prin acord scris între părți, cu minimum 30 de zile înainte de expirare.",
      "4.3. În cazul în care niciuna dintre părți nu notifică încetarea contractului cu 30 de zile înainte de expirare, contractul se prelungește automat cu aceeași perioadă și în aceleași condiții."
    ]
  },

  pret: {
    titlu: "Art. 5 - PREȚUL ȘI MODALITĂȚILE DE PLATĂ",
    continut: [
      "5.1. Valoarea lunară a serviciilor prestate este de {{pret.valoareLunara}} {{pret.moneda}} + TVA.",
      "5.2. Valoarea totală a contractului pentru întreaga perioadă este de {{pret.valoareTotala}} {{pret.moneda}} + TVA.",
      "5.3. Plata se va efectua lunar, în termen de {{pret.termenPlata}} zile de la emiterea facturii de către PRESTATOR.",
      "5.4. Plata se va face prin transfer bancar în contul PRESTATORULUI comunicat odată cu factura.",
      "5.5. În cazul întârzierii plății peste termenul stabilit, BENEFICIARUL va datora penalități de întârziere de 0,5% pe zi de întârziere, calculate la valoarea facturii neachitate.",
      "5.6. Prețul convenit include toate serviciile menționate la Art. 2 și nu include costurile suplimentare generate de solicitări extraordinare ale BENEFICIARULUI."
    ]
  },

  confidentialitate: {
    titlu: "Art. 6 - CONFIDENȚIALITATE",
    continut: [
      "6.1. Ambele părți se obligă să păstreze confidențialitatea tuturor informațiilor de natură comercială, financiară, tehnică sau de altă natură la care au acces în cadrul executării prezentului contract.",
      "6.2. PRESTATORULUI se obligă să nu dezvăluie către terți date cu caracter personal ale angajaților BENEFICIARULUI, informații despre organizarea internă, procese de producție sau alte informații sensibile.",
      "6.3. Obligația de confidențialitate rămâne în vigoare și după încetarea prezentului contract, pe o perioadă de 3 ani.",
      "6.4. Sunt exceptate de la obligația de confidențialitate informațiile solicitate de autoritățile publice în baza unor prevederi legale sau hotărâri judecătorești."
    ]
  },

  reziliere: {
    titlu: "Art. 7 - REZILIEREA CONTRACTULUI",
    continut: [
      "7.1. Contractul poate fi reziliat prin acordul părților, în orice moment, printr-un act adițional semnat de ambele părți.",
      "7.2. Fiecare parte poate denunța unilateral contractul, cu un preaviz de 30 de zile calendaristice, printr-o notificare scrisă transmisă celeilalte părți.",
      "7.3. Contractul poate fi reziliat imediat, fără preaviz, în următoarele situații:",
      "   a) BENEFICIARUL nu achită contravaloarea serviciilor timp de 60 de zile de la scadență;",
      "   b) PRESTATORULUI nu își îndeplinește obligațiile contractuale esențiale timp de 30 de zile de la notificarea scrisă a BENEFICIARULUI;",
      "   c) Una dintre părți intră în insolvență/faliment;",
      "   d) BENEFICIARUL își încetează activitatea sau își suspendă activitatea pe o perioadă mai mare de 90 de zile.",
      "7.4. La încetarea contractului, indiferent de modalitate, BENEFICIARUL va achita toate sumele datorate pentru serviciile prestate până la data încetării.",
      "7.5. Documentația SSM elaborată de PRESTATOR rămâne proprietatea BENEFICIARULUI și va fi predată la încetarea contractului."
    ]
  },

  dispozitiiFinale: {
    titlu: "Art. 8 - DISPOZIȚII FINALE",
    continut: [
      "8.1. Prezentul contract constituie acordul complet între părți cu privire la obiectul contractului și înlocuiește orice înțelegeri anterioare, scrise sau verbale.",
      "8.2. Orice modificare a prezentului contract se va face prin act adițional semnat de ambele părți.",
      "8.3. În situația în care una sau mai multe dispoziții ale prezentului contract devin nule, nulitatea acestora nu va afecta valabilitatea celorlalte dispoziții.",
      "8.4. Litigiile apărute din executarea prezentului contract vor fi soluționate pe cale amiabilă. În cazul în care acest lucru nu este posibil, litigiile vor fi soluționate de instanțele judecătorești competente.",
      "8.5. Pentru situațiile neprevăzute în prezentul contract se aplică dispozițiile Codului Civil și ale legislației speciale în materie de securitate și sănătate în muncă.",
      "8.6. Prezentul contract a fost încheiat în 2 (două) exemplare originale, câte unul pentru fiecare parte."
    ]
  },

  semnături: {
    titlu: "SEMNĂTURI",
    prestator: {
      titlu: "PRESTATOR",
      campuri: [
        "{{prestator.name}}",
        "{{prestator.reprezentant}}",
        "{{prestator.functie}}",
        "",
        "Semnătură: _______________",
        "Ștampilă"
      ]
    },
    beneficiar: {
      titlu: "BENEFICIAR",
      campuri: [
        "{{beneficiar.name}}",
        "{{beneficiar.reprezentant}}",
        "{{beneficiar.functie}}",
        "",
        "Semnătură: _______________",
        "Ștampilă"
      ]
    }
  }
};

/**
 * Funcție helper pentru înlocuirea placeholder-urilor în template
 */
export function generateContract(data: ContractData): string {
  let contractText = JSON.stringify(CONTRACT_SSM_TEMPLATE);

  // Înlocuire date contract
  contractText = contractText.replace(/{{dataContract}}/g, data.dataContract);
  contractText = contractText.replace(/{{numarAngajati}}/g, data.numarAngajati.toString());
  contractText = contractText.replace(/{{puncteLucru}}/g, data.puncteLucru.join(', '));

  // Înlocuire date prestator
  contractText = contractText.replace(/{{prestator\.name}}/g, data.prestator.name);
  contractText = contractText.replace(/{{prestator\.cui}}/g, data.prestator.cui);
  contractText = contractText.replace(/{{prestator\.registru}}/g, data.prestator.registru);
  contractText = contractText.replace(/{{prestator\.sediu}}/g, data.prestator.sediu);
  contractText = contractText.replace(/{{prestator\.reprezentant}}/g, data.prestator.reprezentant);
  contractText = contractText.replace(/{{prestator\.functie}}/g, data.prestator.functie);
  contractText = contractText.replace(/{{prestator\.telefon}}/g, data.prestator.telefon || '');
  contractText = contractText.replace(/{{prestator\.email}}/g, data.prestator.email || '');

  // Înlocuire date beneficiar
  contractText = contractText.replace(/{{beneficiar\.name}}/g, data.beneficiar.name);
  contractText = contractText.replace(/{{beneficiar\.cui}}/g, data.beneficiar.cui);
  contractText = contractText.replace(/{{beneficiar\.registru}}/g, data.beneficiar.registru);
  contractText = contractText.replace(/{{beneficiar\.sediu}}/g, data.beneficiar.sediu);
  contractText = contractText.replace(/{{beneficiar\.reprezentant}}/g, data.beneficiar.reprezentant);
  contractText = contractText.replace(/{{beneficiar\.functie}}/g, data.beneficiar.functie);
  contractText = contractText.replace(/{{beneficiar\.telefon}}/g, data.beneficiar.telefon || '');
  contractText = contractText.replace(/{{beneficiar\.email}}/g, data.beneficiar.email || '');

  // Înlocuire date durată
  contractText = contractText.replace(/{{durata\.dataInceput}}/g, data.durata.dataInceput);
  contractText = contractText.replace(/{{durata\.dataSfarsit}}/g, data.durata.dataSfarsit);
  contractText = contractText.replace(/{{durata\.perioadaLuni}}/g, data.durata.perioadaLuni.toString());

  // Înlocuire date preț
  contractText = contractText.replace(/{{pret\.valoareLunara}}/g, data.pret.valoareLunara.toString());
  contractText = contractText.replace(/{{pret\.valoareTotala}}/g, data.pret.valoareTotala.toString());
  contractText = contractText.replace(/{{pret\.moneda}}/g, data.pret.moneda);
  contractText = contractText.replace(/{{pret\.termenPlata}}/g, data.pret.termenPlata.toString());

  return contractText;
}

/**
 * Exemplu de date pentru testare
 */
export const SAMPLE_CONTRACT_DATA: ContractData = {
  numarContract: "SSM-2024-001",
  dataContract: "15.01.2024",
  prestator: {
    name: "CONSULTANT SSM SRL",
    cui: "RO12345678",
    registru: "J40/1234/2020",
    sediu: "București, Sector 1, Str. Exemplu nr. 10",
    reprezentant: "Daniel Popescu",
    functie: "Administrator",
    telefon: "+40 722 123 456",
    email: "contact@consultant-ssm.ro"
  },
  beneficiar: {
    name: "FIRMA BENEFICIARA SRL",
    cui: "RO87654321",
    registru: "J40/5678/2019",
    sediu: "București, Sector 2, Str. Test nr. 20",
    reprezentant: "Ion Ionescu",
    functie: "Director General",
    telefon: "+40 733 987 654",
    email: "contact@firma-beneficiara.ro"
  },
  numarAngajati: 25,
  puncteLucru: [
    "București, Sector 2, Str. Test nr. 20",
    "Ilfov, Voluntari, Str. Depozit nr. 5"
  ],
  durata: {
    dataInceput: "01.02.2024",
    dataSfarsit: "31.01.2025",
    perioadaLuni: 12
  },
  pret: {
    valoareLunara: 500,
    valoareTotala: 6000,
    moneda: "RON",
    termenPlata: 15
  }
};
