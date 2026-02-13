/**
 * Autoritățile SSM (Securitate și Sănătate în Muncă) din 5 țări europene
 * Datele includ informații de contact, competențe și proceduri de inspecție
 */

export interface SSMAuthority {
  country: string;
  countryCode: string;
  authorityName: string;
  abbreviation: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  competences: string[];
  inspectionProcedure: string;
  complaintURL: string;
}

export const ssmAuthorities: SSMAuthority[] = [
  {
    country: "România",
    countryCode: "RO",
    authorityName: "Inspecția Muncii",
    abbreviation: "ITM",
    website: "https://www.inspectmun.ro",
    phone: "+40 21 302 54 02",
    email: "contact@inspectiamuncii.ro",
    address: "Str. Mendeleev nr. 28-30, Sector 1, București, 010362",
    competences: [
      "Verificarea respectării legislației muncii",
      "Controlul condițiilor de securitate și sănătate în muncă",
      "Investigarea accidentelor de muncă și bolilor profesionale",
      "Aplicarea de sancțiuni contravenționale",
      "Monitorizarea timpului de muncă și odihnă",
      "Verificarea documentației SSM (evaluări de risc, fișe de aptitudine)",
      "Control asupra echipamentelor individuale de protecție (EIP)",
      "Verificarea instruirii lucrătorilor în domeniul SSM"
    ],
    inspectionProcedure: "Inspecțiile ITM pot fi anunțate sau inopinate. Inspectorii verifică documentația SSM, condițiile de la locul de muncă, intervievează angajați și pot solicita măsuri corective imediate. Se întocmește proces-verbal cu constatări și termene de remediere. În caz de pericol iminent, se poate dispune oprirea activității.",
    complaintURL: "https://www.inspectmun.ro/reclamatii"
  },
  {
    country: "Bulgaria",
    countryCode: "BG",
    authorityName: "Glavna Inspekcia po Trud",
    abbreviation: "GLI",
    website: "https://www.gli.government.bg",
    phone: "+359 2 8119 443",
    email: "info@gli.government.bg",
    address: "bul. Knyaz Dondukov 3, 1000 Sofia, Bulgaria",
    competences: [
      "Controlul asupra respectării legislației muncii",
      "Supravegherea condițiilor de securitate și sănătate",
      "Investigarea accidentelor de muncă grave și mortale",
      "Emiterea de ordine de remediere și sancțiuni",
      "Verificarea contractelor de muncă și a timpului de lucru",
      "Monitorizarea utilizării echipamentelor de protecție",
      "Control asupra evaluărilor de risc ocupațional",
      "Verificarea instruirii obligatorii în domeniul SSM"
    ],
    inspectionProcedure: "GLI efectuează inspecții periodice și inopinate. Inspectorii au dreptul de acces nelimitat în toate spațiile de muncă, pot examina documente, intervievează angajați fără supraveghere și pot dispune măsuri imediate. Se emite protocol de inspecție cu termene clare. Neconformitățile majore pot duce la suspendarea activității până la remediere.",
    complaintURL: "https://www.gli.government.bg/bg/stranici/signali-296"
  },
  {
    country: "Ungaria",
    countryCode: "HU",
    authorityName: "Országos Munkavédelmi és Munkaügyi Főfelügyelőség",
    abbreviation: "OMMF",
    website: "https://www.munkavedelemfelugyelet.hu",
    phone: "+36 1 450 2190",
    email: "info@ommf.gov.hu",
    address: "Bp. XIII. ker. Váci út 73., Budapest, 1134",
    competences: [
      "Supravegherea respectării legislației muncii și SSM",
      "Controlul implementării măsurilor de prevenire",
      "Investigarea accidentelor de muncă și îmbolnăvirilor profesionale",
      "Autorizarea serviciilor externe de prevenire",
      "Aplicarea sancțiunilor administrative",
      "Verificarea echipamentelor de muncă și de protecție",
      "Monitorizarea expunerii la agenți nocivi",
      "Control asupra documentației de evaluare a riscurilor"
    ],
    inspectionProcedure: "OMMF desfășoară inspecții planificate și ad-hoc bazate pe sesizări sau accidente. Inspectorii verifică conformitatea cu reglementările SSM, analizează documentația, efectuează măsurători ale factorilor de risc și pot impune măsuri corective cu termene. În situații critice, pot dispune închiderea imediată a locului de muncă.",
    complaintURL: "https://www.munkavedelemfelugyelet.hu/lakossagi-bejelentes"
  },
  {
    country: "Germania",
    countryCode: "DE",
    authorityName: "Bundesanstalt für Arbeitsschutz und Arbeitsmedizin / Gewerbeaufsicht",
    abbreviation: "BAuA",
    website: "https://www.baua.de",
    phone: "+49 231 9071 2071",
    email: "info@baua.bund.de",
    address: "Friedrich-Henkel-Weg 1-25, 44149 Dortmund, Deutschland",
    competences: [
      "Cercetare și consultanță în domeniul protecției muncii",
      "Elaborarea de standarde și reglementări tehnice",
      "Controlul respectării legii privind securitatea și sănătatea",
      "Evaluarea substanțelor periculoase și autorizații",
      "Supravegherea aplicării directivelor UE în domeniul SSM",
      "Investigarea accidentelor de muncă și bolilor ocupaționale",
      "Certificarea echipamentelor de protecție",
      "Instruirea inspectorilor de muncă la nivel federal"
    ],
    inspectionProcedure: "Sistemul german este descentralizat: BAuA coordonează la nivel federal, iar inspecțiile concrete sunt efectuate de Gewerbeaufsicht la nivel de landuri. Inspecțiile verifică implementarea evaluărilor de risc, măsurile de protecție tehnică și organizațională, instruirea lucrătorilor și supravegherea medicală. Se emit rapoarte detaliate cu recomandări obligatorii.",
    complaintURL: "https://www.baua.de/DE/Themen/Arbeitsgestaltung-im-Betrieb/Beschwerde/Beschwerde_node.html"
  },
  {
    country: "Polonia",
    countryCode: "PL",
    authorityName: "Państwowa Inspekcja Pracy",
    abbreviation: "PIP",
    website: "https://www.pip.gov.pl",
    phone: "+48 22 661 64 59",
    email: "kancelaria@gip.pip.gov.pl",
    address: "ul. Barska 28/30, 02-315 Warszawa, Polska",
    competences: [
      "Supravegherea conformității cu legislația muncii",
      "Controlul condițiilor de securitate și igienă în muncă",
      "Investigarea accidentelor de muncă și bolilor profesionale",
      "Verificarea legalității relațiilor de muncă",
      "Aplicarea de sancțiuni și ordine de remediere",
      "Monitorizarea timpului de muncă și a concediilor",
      "Control asupra echipamentelor de lucru și protecție",
      "Verificarea documentației SSM și a instruirilor periodice"
    ],
    inspectionProcedure: "PIP efectuează inspecții planificate și neplanificate, inclusiv controale tematice. Inspectorii au autoritate extinsă: acces nelimitat în incinte, dreptul de a examina orice document, interviuri confidențiale cu angajații. Se întocmesc protocoale cu constatări și decizii cu caracter obligatoriu. Nerespectarea poate duce la amenzi substanțiale sau suspendarea activității.",
    complaintURL: "https://www.pip.gov.pl/pl/kontakt/zglaszanie-problemow"
  }
];

/**
 * Returnează autoritatea SSM pentru o țară specifică
 */
export function getAuthorityByCountryCode(countryCode: string): SSMAuthority | undefined {
  return ssmAuthorities.find(auth => auth.countryCode === countryCode);
}

/**
 * Returnează lista de țări disponibile
 */
export function getAvailableCountries(): Array<{ code: string; name: string }> {
  return ssmAuthorities.map(auth => ({
    code: auth.countryCode,
    name: auth.country
  }));
}
