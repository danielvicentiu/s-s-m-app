/**
 * Tematică instruire introductiv-generală SSM
 * Conform Legii 319/2006 privind securitatea și sănătatea în muncă
 * Durata totală: 8 ore
 */

export interface TrainingTopic {
  id: number;
  title: string;
  duration_hours: number;
  content: string[];
  verification_method: string;
  legal_basis: string;
}

export const introductivGeneralTopics: TrainingTopic[] = [
  {
    id: 1,
    title: "Introducere în securitatea și sănătatea în muncă",
    duration_hours: 0.5,
    content: [
      "Concepte de bază: securitate, sănătate, accident de muncă, boală profesională",
      "Importanța securității muncii pentru angajator și angajat",
      "Cadrul legislativ general în domeniul SSM",
      "Obligațiile angajatorului și drepturile angajatului",
      "Structura serviciului de prevenire și protecție",
    ],
    verification_method: "Discuții interactive și evaluare orală",
    legal_basis: "Legea 319/2006, art. 18, alin. (1), lit. a)",
  },
  {
    id: 2,
    title: "Legislația în domeniul securității și sănătății în muncă",
    duration_hours: 0.5,
    content: [
      "Legea 319/2006 - prevederi generale",
      "Normele metodologice de aplicare a Legii 319/2006",
      "Directivele europene transpuse în legislația națională",
      "Răspunderea juridică în domeniul SSM (civilă, penală, contravențională)",
      "Rolul inspectoratului teritorial de muncă",
    ],
    verification_method: "Test scris cu întrebări legislative",
    legal_basis: "Legea 319/2006, art. 18, alin. (1), lit. b)",
  },
  {
    id: 3,
    title: "Drepturile și obligațiile lucrătorilor în domeniul SSM",
    duration_hours: 0.5,
    content: [
      "Dreptul la informare și instruire",
      "Dreptul la echipament individual de protecție",
      "Dreptul de a refuza munca în condiții de pericol grav și iminent",
      "Obligația de a utiliza corect echipamentele de muncă și protecție",
      "Obligația de a respecta instrucțiunile de securitate",
      "Obligația de a raporta situațiile periculoase",
    ],
    verification_method: "Studii de caz și discuții",
    legal_basis: "Legea 319/2006, art. 18, alin. (1), lit. c)",
  },
  {
    id: 4,
    title: "Evaluarea riscurilor profesionale",
    duration_hours: 0.5,
    content: [
      "Conceptul de risc profesional și factor de risc",
      "Metodologia de evaluare a riscurilor",
      "Identificarea pericolelor la locul de muncă",
      "Estimarea și ierarhizarea riscurilor",
      "Planul de prevenire și protecție",
      "Monitorizarea și reevaluarea periodică",
    ],
    verification_method: "Exemplificare practică pe baza locului de muncă",
    legal_basis: "Legea 319/2006, art. 18, alin. (1), lit. d)",
  },
  {
    id: 5,
    title: "Măsuri de prevenire și protecție",
    duration_hours: 0.5,
    content: [
      "Principiile generale de prevenire",
      "Ierarhia măsurilor de prevenire (eliminare, substituție, măsuri tehnice, organizatorice, EIP)",
      "Măsuri tehnice de prevenire și protecție",
      "Măsuri organizatorice (proceduri, instrucțiuni)",
      "Semnalizarea de securitate la locul de muncă",
      "Sisteme de avertizare și alarmă",
    ],
    verification_method: "Identificarea măsurilor la locul de muncă",
    legal_basis: "Legea 319/2006, art. 18, alin. (1), lit. e)",
  },
  {
    id: 6,
    title: "Echipamentul individual de protecție (EIP)",
    duration_hours: 0.5,
    content: [
      "Clasificarea și tipurile de EIP",
      "Criterii de selecție a EIP în funcție de riscuri",
      "Reguli de utilizare, întreținere și depozitare",
      "Verificarea stării tehnice a EIP",
      "Obligativitatea purtării EIP",
      "Înlocuirea EIP uzat sau defect",
    ],
    verification_method: "Demonstrație practică de utilizare corectă a EIP",
    legal_basis: "HG 1048/2006 privind cerințele minime de securitate și sănătate pentru utilizarea EIP",
  },
  {
    id: 7,
    title: "Accidente de muncă - prevenire, cercetare, înregistrare",
    duration_hours: 1.0,
    content: [
      "Definirea accidentului de muncă conform legislației",
      "Cauzele principale ale accidentelor de muncă",
      "Măsuri de prevenire a accidentelor",
      "Obligația declarării și cercetării accidentelor",
      "Procedura de cercetare - termene, comisie, proces-verbal",
      "Raportarea către ITM și asigurător",
      "Măsuri post-accident și lecții învățate",
    ],
    verification_method: "Analiza unui caz real de accident de muncă",
    legal_basis: "Legea 319/2006, art. 18, alin. (1), lit. f); HG 1425/2006",
  },
  {
    id: 8,
    title: "Bolile profesionale - identificare și prevenire",
    duration_hours: 0.5,
    content: [
      "Definirea bolii profesionale",
      "Lista bolilor profesionale recunoscute în România",
      "Factorii de risc pentru boli profesionale (chimici, fizici, biologici, ergonomici)",
      "Supravegherea stării de sănătate a lucrătorilor",
      "Controlul medical periodic",
      "Măsuri de prevenire a îmbolnăvirilor profesionale",
    ],
    verification_method: "Prezentare factori de risc specifici domeniului",
    legal_basis: "Legea 319/2006; HG 1169/2011 privind bolile profesionale",
  },
  {
    id: 9,
    title: "Igiena muncii și ergonomie",
    duration_hours: 0.5,
    content: [
      "Condiții optime de mediu de lucru (temperatură, iluminat, ventilație, zgomot)",
      "Norme de igienă la locul de muncă",
      "Principii de ergonomie - organizarea locului de muncă",
      "Prevenirea tulburărilor musculo-scheletice",
      "Muncă la calculator - pauze, poziționare corectă",
      "Facilitățile pentru lucrători (vestiare, grupuri sanitare, cantină)",
    ],
    verification_method: "Verificare practică a condițiilor de la locul de muncă",
    legal_basis: "Legea 319/2006, art. 18, alin. (1), lit. g)",
  },
  {
    id: 10,
    title: "Utilizarea în condiții de securitate a echipamentelor de muncă",
    duration_hours: 0.5,
    content: [
      "Definiția echipamentului de muncă",
      "Cerințe minime de securitate pentru echipamente",
      "Verificarea tehnică inițială și periodică",
      "Autorizarea lucrătorilor pentru echipamente speciale",
      "Instrucțiuni de utilizare și întreținere",
      "Identificarea defecțiunilor și raportarea acestora",
      "Interzicerea utilizării echipamentelor defecte",
    ],
    verification_method: "Demonstrație pe echipamentele din unitate",
    legal_basis: "HG 1146/2006 privind cerințele minime de securitate și sănătate pentru utilizarea echipamentelor de muncă",
  },
  {
    id: 11,
    title: "Prevenirea și stingerea incendiilor (PSI) - noțiuni de bază",
    duration_hours: 1.0,
    content: [
      "Clasificarea și factorii incendiilor",
      "Triunghiul focului și condițiile declanșării incendiului",
      "Clasificarea materialelor combustibile",
      "Căile de propagare a incendiilor",
      "Măsuri de prevenire a incendiilor",
      "Comportament în caz de incendiu - evacuare, alarmare",
      "Mijloace de stingere - clasificare și utilizare corectă",
      "Planul de evacuare și punctele de adunare",
    ],
    verification_method: "Simulare de evacuare și demonstrație practică stingătoare",
    legal_basis: "Legea 307/2006 privind apărarea împotriva incendiilor",
  },
  {
    id: 12,
    title: "Prim ajutor la locul de muncă",
    duration_hours: 1.0,
    content: [
      "Principiile acordării primului ajutor",
      "Evaluarea victimei și apelarea serviciilor de urgență 112",
      "Resuscitarea cardio-pulmonară (RCP) - noțiuni teoretice",
      "Stoparea hemoragiilor",
      "Tratarea arsurilor, fracturilor, entorselor",
      "Poziția laterală de siguranță",
      "Trusa de prim ajutor - componență și localizare",
      "Limite legale - când NU trebuie să intervii",
    ],
    verification_method: "Demonstrație practică pe manechin (dacă este disponibil)",
    legal_basis: "Legea 319/2006, art. 18, alin. (1), lit. h); Ordinul 96/2016",
  },
  {
    id: 13,
    title: "Circulația pe teritoriul unității",
    duration_hours: 0.5,
    content: [
      "Trasee de circulație pentru personal și mijloace de transport",
      "Semnalizarea căilor de circulație",
      "Reguli de circulație pietonală în incintă",
      "Circulația autovehiculelor și utilajelor în unitate",
      "Zone cu acces restricționat",
      "Zonele de lucru la înălțime - escaladare scări, platforme",
      "Prevenirea accidentelor la trecerea la nivel cu calea ferată (dacă este cazul)",
    ],
    verification_method: "Tur de familiarizare pe teritoriul unității",
    legal_basis: "Legea 319/2006, art. 18, alin. (1), lit. i)",
  },
  {
    id: 14,
    title: "Riscuri specifice locului de muncă",
    duration_hours: 0.5,
    content: [
      "Identificarea riscurilor specifice postului ocupat",
      "Substanțe periculoase utilizate - fișe de securitate",
      "Expunerea la agenți fizici (zgomot, vibrații, radiații)",
      "Riscuri ergonomice - manipulare manuală, posturi forțate",
      "Riscuri psihosociale - stres, hărțuire",
      "Măsuri specifice de protecție pentru postul ocupat",
      "Instrucțiuni proprii de securitate",
    ],
    verification_method: "Prezentare și explicare instrucțiuni proprii SSM",
    legal_basis: "Legea 319/2006, art. 18, alin. (1), lit. j)",
  },
  {
    id: 15,
    title: "Evaluare finală și închiderea instruirii",
    duration_hours: 0.5,
    content: [
      "Recapitularea principalelor aspecte predate",
      "Clarificări și răspunsuri la întrebări",
      "Test de evaluare finală scris",
      "Completarea fișei de instruire individuală",
      "Semnarea fișei de prezență și a registrului de instructaj",
      "Feedback de la cursanți",
    ],
    verification_method: "Test scris final cu minimum 15 întrebări",
    legal_basis: "Legea 319/2006, art. 18, alin. (2)",
  },
];

/**
 * Calculează durata totală a instruirii
 */
export const getTotalDuration = (): number => {
  return introductivGeneralTopics.reduce(
    (sum, topic) => sum + topic.duration_hours,
    0
  );
};

/**
 * Returnează tematica formatată pentru export/raportare
 */
export const getFormattedTopics = () => {
  return {
    title: "Instruire Introductiv-Generală SSM",
    legal_basis: "Legea 319/2006, art. 18",
    total_duration_hours: getTotalDuration(),
    topics: introductivGeneralTopics,
  };
};

export default introductivGeneralTopics;
