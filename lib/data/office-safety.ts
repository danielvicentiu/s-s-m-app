/**
 * Office Safety and VDT Requirements
 * Based on HG 1028/2006 (Romania) - Workplace ergonomics and display screen equipment
 */

export interface OfficeSafetyRequirement {
  id: string;
  category: 'ergonomics' | 'environment' | 'health' | 'psychosocial' | 'emergency' | 'electrical';
  title: string;
  description: string;
  legalReference: string;
  checklistItems: string[];
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'biennial' | 'continuous';
  responsible: string;
  consequences?: string;
}

export const officeSafetyRequirements: OfficeSafetyRequirement[] = [
  {
    id: 'ergo-001',
    category: 'ergonomics',
    title: 'Ergonomia stației de lucru cu calculator',
    description: 'Amenajarea ergonomică a locului de muncă pentru utilizatorii de echipamente cu ecran de vizualizare (VDT) conform cerințelor minime de securitate și sănătate.',
    legalReference: 'HG 1028/2006, Anexa I',
    checklistItems: [
      'Masa de lucru are dimensiuni suficiente (min. 80x120 cm)',
      'Înălțimea mesei permite poziționarea confortabilă a brațelor (70-75 cm)',
      'Scaunul este reglabil în înălțime (38-54 cm)',
      'Scaunul are spătar reglabil și suport lombar',
      'Scaunul are bază cu 5 roți pentru stabilitate',
      'Distanța ochi-monitor este între 50-70 cm',
      'Monitorul este poziționat la înălțimea ochilor sau sub',
      'Tastatura și mouse-ul sunt la aceeași înălțime',
      'Există spațiu suficient pentru picioare (min. 60 cm lățime)',
    ],
    frequency: 'quarterly',
    responsible: 'Consultant SSM / Responsabil SSM',
    consequences: 'Tulburări musculo-scheletice (TMS), dureri de spate, sindrom de tunel carpian',
  },
  {
    id: 'ergo-002',
    category: 'ergonomics',
    title: 'Caracteristicile ecranului de vizualizare',
    description: 'Ecranul trebuie să fie stabil, fără tremurări, cu luminozitate și contrast reglabile.',
    legalReference: 'HG 1028/2006, Anexa I, pct. 1(b)',
    checklistItems: [
      'Ecranul nu prezintă tremurări (flicker)',
      'Luminozitatea este reglabilă și adaptată iluminatului ambiant',
      'Contrastul este reglabil',
      'Ecranul poate fi orientat și înclinat (basculant)',
      'Dimensiunea caracterelor este adecvată (min. 3mm înălțime)',
      'Distanța între caractere și linii asigură lizibilitate bună',
      'Imaginea este stabilă, fără reflexii deranjante',
      'Filtru anti-reflexie dacă este necesar',
    ],
    frequency: 'annual',
    responsible: 'Consultant SSM / Responsabil IT',
    consequences: 'Oboseală vizuală, cefalee, scăderea productivității',
  },
  {
    id: 'env-001',
    category: 'environment',
    title: 'Iluminatul la locul de muncă cu VDT',
    description: 'Iluminatul general și local trebuie să asigure un nivel adecvat de luminozitate, fără reflexii sau străluciri pe ecran.',
    legalReference: 'HG 1028/2006, Anexa I, pct. 2',
    checklistItems: [
      'Nivelul de iluminare este între 300-500 lux pentru birouri',
      'Nu există reflexii pe ecran de la ferestre sau surse de lumină',
      'Ferestrele au jaluzele/perdele reglabile',
      'Iluminatul artificial este uniform, fără zone de umbră',
      'Sursele de lumină nu sunt vizibile direct în câmpul vizual',
      'Raportul de luminozitate între ecran și mediul înconjurător este 1:3 - 3:1',
      'Lumina naturală este preferată și controlată',
    ],
    frequency: 'annual',
    responsible: 'Consultant SSM / Responsabil clădire',
    consequences: 'Oboseală vizuală, dureri de cap, scăderea acuității vizuale',
  },
  {
    id: 'env-002',
    category: 'environment',
    title: 'Temperatura și umiditatea aerului',
    description: 'Condițiile de microclimat trebuie să asigure confortul termic al lucrătorilor.',
    legalReference: 'HG 1028/2006, Anexa I, pct. 3(a)',
    checklistItems: [
      'Temperatura aerului este între 20-24°C (sezon rece) / 23-26°C (sezon cald)',
      'Umiditatea relativă este între 40-60%',
      'Viteza curentului de aer este sub 0,2 m/s',
      'Nu există curenți de aer neplăcuți',
      'Sistemul de ventilație/climatizare funcționează corespunzător',
      'Nu există surse de căldură excesivă în apropiere',
      'Aerul este reînnoit periodic (minim 30 mc/h/persoană)',
    ],
    frequency: 'monthly',
    responsible: 'Responsabil clădire / Responsabil SSM',
    consequences: 'Disconfort termic, scăderea concentrării, creșterea absenteismului',
  },
  {
    id: 'env-003',
    category: 'environment',
    title: 'Zgomotul și vibrațiile',
    description: 'Nivelul de zgomot în birouri trebuie să fie sub limitele care afectează concentrarea și comunicarea.',
    legalReference: 'HG 1028/2006, Anexa I, pct. 3(b)',
    checklistItems: [
      'Nivelul de zgomot de fond este sub 55 dB(A)',
      'Zgomotul echipamentelor (imprimante, copiatoare) este izolat',
      'Nu există surse de zgomot constant deranjante',
      'Spațiile open-space au panouri fonoabsorbante',
      'Sunt disponibile săli separate pentru conversații telefonice',
      'Echipamentele zgomotoase sunt amplasate în zone separate',
    ],
    frequency: 'annual',
    responsible: 'Consultant SSM / Responsabil clădire',
    consequences: 'Scăderea concentrării, stres, oboseală auditivă',
  },
  {
    id: 'health-001',
    category: 'health',
    title: 'Pauze și schimbarea activității pentru utilizatori VDT',
    description: 'Lucrătorii care utilizează în mod obișnuit echipamente cu ecran de vizualizare trebuie să beneficieze de pauze periodice.',
    legalReference: 'HG 1028/2006, art. 6',
    checklistItems: [
      'Pauză de 5-10 minute la fiecare oră de lucru continuu la VDT',
      'Pauză de 15 minute la fiecare 2 ore de lucru continuu',
      'Pauzele sunt incluse în timpul de lucru',
      'Se recomandă alternarea sarcinilor (lucru la calculator / alte activități)',
      'Exerciții de relaxare oculară la fiecare 30 minute',
      'Exerciții de stretching pentru gât, umeri, mâini',
      'Se evită lucrul continuu la VDT peste 6 ore/zi',
    ],
    frequency: 'continuous',
    responsible: 'Manager / Supraveghetor direct',
    consequences: 'Sindrom de vedere la calculator (CVS), TMS, scăderea productivității',
  },
  {
    id: 'health-002',
    category: 'health',
    title: 'Examen oftalmologic pentru utilizatori VDT',
    description: 'Lucrătorii trebuie să beneficieze de examinare oftalmologică periodică și echipament de corecție dacă este necesar.',
    legalReference: 'HG 1028/2006, art. 7',
    checklistItems: [
      'Control oftalmologic la angajare pentru utilizatori VDT',
      'Control oftalmologic periodic (la fiecare 2 ani sau anual dacă se constată probleme)',
      'Control oftalmologic la cerere dacă apar tulburări vizuale',
      'Furnizarea de ochelari specifici pentru lucru la calculator (dacă este prescris)',
      'Costul examinării și al ochelarilor este suportat de angajator',
      'Documentarea rezultatelor în fișa medicală',
    ],
    frequency: 'biennial',
    responsible: 'Medic de medicina muncii / HR',
    consequences: 'Deteriorarea vederii, oboseală oculară, cefalee',
  },
  {
    id: 'health-003',
    category: 'health',
    title: 'Informare și instruire SSM pentru lucru la VDT',
    description: 'Lucrătorii trebuie informați și instruiți privind riscurile și măsurile de prevenire specifice muncii la calculator.',
    legalReference: 'HG 1028/2006, art. 8',
    checklistItems: [
      'Instruire inițială SSM include specificul lucrului la VDT',
      'Instruire privind reglarea corectă a mobilierului ergonomic',
      'Informare despre necesitatea pauzelor și exercițiilor',
      'Instruire privind poziția corectă de lucru',
      'Informare despre simptomele oboselii vizuale și TMS',
      'Instrucțiuni privind solicitarea controalelor oftalmologice',
      'Documentarea instruirii în registrul de instruire SSM',
    ],
    frequency: 'annual',
    responsible: 'Consultant SSM / Responsabil SSM',
    consequences: 'Neconștientizarea riscurilor, adoptarea unor poziții de lucru nocive',
  },
  {
    id: 'psycho-001',
    category: 'psychosocial',
    title: 'Riscuri psihosociale - sarcina de muncă și ritm',
    description: 'Sarcina de muncă și ritmul acesteia trebuie să fie adaptate capacităților lucrătorului.',
    legalReference: 'HG 1028/2006, Anexa I, pct. 4',
    checklistItems: [
      'Volumul de muncă este rezonabil și realist',
      'Termenele limită sunt realizabile fără suprasolicitare',
      'Nu există presiune constantă pentru depășirea programului',
      'Lucrătorul are control asupra ritmului de lucru',
      'Taskurile sunt variate și nu repetitive excesiv',
      'Există pauze adecvate pentru recuperare',
      'Se monitorizează semnele de burnout și stres',
      'Feedback constructiv și suport managerial',
    ],
    frequency: 'quarterly',
    responsible: 'Manager / HR / Consultant SSM',
    consequences: 'Burnout, stres cronic, anxietate, scăderea performanței',
  },
  {
    id: 'psycho-002',
    category: 'psychosocial',
    title: 'Monotonie și monotonie senzorială',
    description: 'Prevenirea efectelor nocive ale muncii repetitive și lipsei de stimulare.',
    legalReference: 'HG 1028/2006, Anexa I, pct. 4',
    checklistItems: [
      'Rotația sarcinilor pentru evitarea monotoniei',
      'Varierea tipurilor de activități pe parcursul zilei',
      'Posibilitatea interacțiunii sociale cu colegii',
      'Spații de relaxare disponibile',
      'Stimulare cognitivă prin sarcini variate',
      'Posibilitatea deplasării și schimbării poziției',
      'Activități de team building și socializare',
    ],
    frequency: 'quarterly',
    responsible: 'Manager / HR',
    consequences: 'Scăderea motivației, oboseală psihică, erori frecvente',
  },
  {
    id: 'emergency-001',
    category: 'emergency',
    title: 'Evacuare în caz de urgență - birouri',
    description: 'Măsuri de evacuare și intervenție în situații de urgență specifice birourilor.',
    legalReference: 'HG 1028/2006, coroborat cu legislația PSI',
    checklistItems: [
      'Planul de evacuare este afișat vizibil în birouri',
      'Căile de evacuare sunt marcate și iluminate',
      'Ieșirile de urgență sunt deblocate permanent',
      'Instructaj de evacuare la angajare și anual',
      'Exercițiu practic de evacuare minim anual',
      'Există persoane desemnate pentru evacuare pe fiecare nivel/zonă',
      'Punctul de adunare este cunoscut de toți angajații',
      'Trusa de prim ajutor este accesibilă și completă',
      'Numere de urgență afișate vizibil (112, pompieri, SMURD)',
    ],
    frequency: 'annual',
    responsible: 'Responsabil PSI / Consultant SSM',
    consequences: 'Răni, panică, întârzieri în evacuare, victime în caz de incendiu',
  },
  {
    id: 'emergency-002',
    category: 'emergency',
    title: 'Prevenirea și stingerea incendiilor în birouri',
    description: 'Măsuri de prevenire și combatere a incendiilor specifice spațiilor de birouri.',
    legalReference: 'Legea 307/2006, HG 571/2016',
    checklistItems: [
      'Stingătoare portative amplasate la max 15m distanță',
      'Stingătoare verificate și revizie tehnică la zi',
      'Interzicerea fumatului în birouri (sau zone desemnate)',
      'Echipamente electrice certificate și verificate periodic',
      'Cablaje electrice în stare bună, fără improvizații',
      'Nu se depozitează materiale inflamabile în birouri',
      'Căile de evacuare libere, fără obstacole',
      'Instalații de detectare și alarmă funcționale (dacă există)',
      'Personal instruit pentru utilizarea stingătoarelor',
    ],
    frequency: 'quarterly',
    responsible: 'Responsabil PSI',
    consequences: 'Incendiu, distrugeri materiale, victime, oprirea activității',
  },
  {
    id: 'electrical-001',
    category: 'electrical',
    title: 'Siguranța instalațiilor electrice în birouri',
    description: 'Verificarea și întreținerea instalațiilor electrice pentru prevenirea electrocutărilor și incendiilor.',
    legalReference: 'HG 1028/2006, coroborat cu I7/2011',
    checklistItems: [
      'Instalațiile electrice au verificare ANRE la zi',
      'Prize și întrerupătoare în stare bună, fără improvizații',
      'Cablurile nu sunt deteriorate sau cu izolație defectă',
      'Nu se utilizează prelungitoare supraîncărcate (max 3500W)',
      'Echipamentele electrice au certificat de conformitate',
      'Există prize suficiente, fără conectori multipli înlănțuiți',
      'Tabloul electric este accesibil și marcat',
      'Dispozitive de protecție (disjunctoare diferențiale) funcționale',
      'Întreruperea alimentării electrice în caz de pericol este rapidă',
    ],
    frequency: 'annual',
    responsible: 'Electrician autorizat / Responsabil mentenanță',
    consequences: 'Electrocutare, incendiu de natură electrică, daune echipamente',
  },
  {
    id: 'electrical-002',
    category: 'electrical',
    title: 'Utilizarea corectă a echipamentelor electrice',
    description: 'Reguli de utilizare a echipamentelor electrice de către personal.',
    legalReference: 'HG 1028/2006, I7/2011',
    checklistItems: [
      'Nu se operează echipamente electrice cu mâinile umede',
      'Nu se utilizează echipamente cu defecțiuni vizibile',
      'Echipamentele se deconectează de la priză când nu sunt folosite',
      'Nu se lasă echipamente în funcțiune nesupravegheate (ex: încălzitoare)',
      'Nu se modifică sau repară instalații electrice de către personal neautorizat',
      'Se raportează imediat orice defecțiune electrică',
      'Nu se folosesc adaptoare și prelungitoare neautorizate',
      'Echipamentele personale (laptopuri, încărcătoare) sunt verificate',
    ],
    frequency: 'continuous',
    responsible: 'Toți angajații / Supraveghetor',
    consequences: 'Electrocutare, scurtcircuit, incendiu, daune materiale',
  },
  {
    id: 'ergo-003',
    category: 'ergonomics',
    title: 'Spațiu de lucru și libertate de mișcare',
    description: 'Asigurarea unui spațiu adecvat pentru mobilitate și confort la locul de muncă.',
    legalReference: 'HG 1028/2006, Anexa I, pct. 5',
    checklistItems: [
      'Spațiu minim de 10 mp/persoană în open-space',
      'Spațiu minim de 8 mp/persoană în birouri individuale',
      'Libertate de mișcare pentru schimbarea poziției',
      'Acces ușor la echipamente și documente',
      'Căi de circulație libere, min. 80 cm lățime',
      'Mobilier dispus ergonomic, fără obstacole',
      'Posibilitatea de a sta în picioare și de a te mișca',
      'Zonă de depozitare pentru obiecte personale',
    ],
    frequency: 'annual',
    responsible: 'Responsabil spații / HR',
    consequences: 'Senzație de claustrofobie, stres, TMS, accidente prin împiedicare',
  },
];

/**
 * Get requirements by category
 */
export function getRequirementsByCategory(category: OfficeSafetyRequirement['category']): OfficeSafetyRequirement[] {
  return officeSafetyRequirements.filter(req => req.category === category);
}

/**
 * Get requirements by frequency
 */
export function getRequirementsByFrequency(frequency: OfficeSafetyRequirement['frequency']): OfficeSafetyRequirement[] {
  return officeSafetyRequirements.filter(req => req.frequency === frequency);
}

/**
 * Get requirement by ID
 */
export function getRequirementById(id: string): OfficeSafetyRequirement | undefined {
  return officeSafetyRequirements.find(req => req.id === id);
}

/**
 * Get all categories
 */
export function getAllCategories(): OfficeSafetyRequirement['category'][] {
  return ['ergonomics', 'environment', 'health', 'psychosocial', 'emergency', 'electrical'];
}

/**
 * Get category label in Romanian
 */
export function getCategoryLabel(category: OfficeSafetyRequirement['category']): string {
  const labels: Record<OfficeSafetyRequirement['category'], string> = {
    ergonomics: 'Ergonomie',
    environment: 'Mediu de lucru',
    health: 'Sănătate',
    psychosocial: 'Riscuri psihosociale',
    emergency: 'Situații de urgență',
    electrical: 'Siguranță electrică',
  };
  return labels[category];
}

/**
 * Get frequency label in Romanian
 */
export function getFrequencyLabel(frequency: OfficeSafetyRequirement['frequency']): string {
  const labels: Record<OfficeSafetyRequirement['frequency'], string> = {
    continuous: 'Continuu',
    daily: 'Zilnic',
    weekly: 'Săptămânal',
    monthly: 'Lunar',
    quarterly: 'Trimestrial',
    annual: 'Anual',
    biennial: 'La 2 ani',
  };
  return labels[frequency];
}
