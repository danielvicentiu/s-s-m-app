/**
 * Romanian Work Schedule Types
 * Tipuri de program de lucru conform legislației muncii din România
 *
 * Legal basis:
 * - Codul Muncii (Legea 53/2003, republicată, cu modificările ulterioare)
 * - Legea 319/2006 privind sănătatea și securitatea în muncă
 * - HG 1425/2006 pentru aprobarea Normelor metodologice
 */

export interface WorkScheduleType {
  id: string;
  name: string;
  description: string;
  hoursPerDay: number;
  daysPerWeek: number;
  nightShift: boolean;
  specificRisks: string[];
  additionalMedical: string[];
  legalBasis: string;
}

export const WORK_SCHEDULE_TYPES: WorkScheduleType[] = [
  {
    id: 'normal_8h',
    name: 'Program normal 8 ore',
    description: 'Program standard de lucru cu 8 ore pe zi, 5 zile pe săptămână, conform art. 111-112 din Codul Muncii',
    hoursPerDay: 8,
    daysPerWeek: 5,
    nightShift: false,
    specificRisks: [
      'Posturi de lucru cu efort vizual prelungit',
      'Poziție șezândă prelungită',
      'Stres organizațional'
    ],
    additionalMedical: [
      'Control oftalmologic anual pentru lucrul la calculator',
      'Evaluare ergonomică a postului de lucru'
    ],
    legalBasis: 'Codul Muncii - art. 111, 112; Durata normală a timpului de lucru este de 8 ore pe zi și 40 de ore pe săptămână'
  },
  {
    id: 'shift_12_24',
    name: 'Program 12/24 (12 ore lucru, 24 ore repaus)',
    description: 'Program în ture de 12 ore urmat de 24 ore repaus, specific serviciilor de urgență, pompieri, personal medical',
    hoursPerDay: 12,
    daysPerWeek: 3.5, // ~3-4 zile pe săptămână în medie
    nightShift: true,
    specificRisks: [
      'Oboseală acumulată din ture prelungite',
      'Tulburări ale ritmului circadian',
      'Privare de somn',
      'Stres crescut în situații de urgență',
      'Risc cardiovascular crescut'
    ],
    additionalMedical: [
      'EKG anual obligatoriu',
      'Screening cardiovascular complet',
      'Evaluare psihologică periodică',
      'Teste vigilență și atenție',
      'Control endocrinologic (metabolismul afectat de munca nocturnă)'
    ],
    legalBasis: 'Codul Muncii - art. 115, 116 (muncă în ture); art. 123-125 (munca de noapte); OMS 1513/2006 - norme SSM pentru servicii de urgență'
  },
  {
    id: 'shift_12_48',
    name: 'Program 12/48 (12 ore lucru, 48 ore repaus)',
    description: 'Program de 12 ore urmat de 48 ore (2 zile) repaus, utilizat în servicii de intervenție, securitate, pază',
    hoursPerDay: 12,
    daysPerWeek: 2.33, // ~2-3 zile pe săptămână
    nightShift: true,
    specificRisks: [
      'Dezechilibre ale ritmului circadian',
      'Oboseală cronică',
      'Izolare socială din cauza programului atipic',
      'Vigilență scăzută la sfârșitul turei',
      'Risc metabolic (diabet, obezitate)'
    ],
    additionalMedical: [
      'Evaluare cardiovasculară extinsă (Holter, ecocardiografie)',
      'Analize metabolice complete (glicemie, profil lipidic)',
      'Evaluare psihologică semestrială',
      'Control oftalmologic pentru lucrul nocturn',
      'Screening apnee în somn'
    ],
    legalBasis: 'Codul Muncii - art. 115-116 (ture); art. 123-125 (munca de noapte); HG 1425/2006 pentru servicii cu continuitate'
  },
  {
    id: 'rotating_shifts',
    name: 'Program în ture rotative (3x8)',
    description: 'Program cu ture rotative de 8 ore (dimineață/după-amiază/noapte), schimbare săptămânală sau lunară, specific producției continue',
    hoursPerDay: 8,
    daysPerWeek: 5,
    nightShift: true,
    specificRisks: [
      'Desincronizare circadiană severă',
      'Tulburări de somn cronice',
      'Probleme digestive (sindrom intestin iritabil)',
      'Risc cardiovascular crescut cu 40%',
      'Risc oncologic (clasificat IARC Group 2A)',
      'Depresie și anxietate',
      'Conflict familie-muncă'
    ],
    additionalMedical: [
      'Evaluare cardiovasculară anuală obligatorie (EKG, TA Holter)',
      'Screening cancere (colon, sân, prostată) conform vârstei',
      'Evaluare gastrointestinală (endoscopie la semne)',
      'Evaluare psihologică anuală',
      'Analize metabolice complete',
      'Evaluare calitate somn (chestionar Pittsburgh)',
      'Contraindicații: diabet zaharat instabil, epilepsie, tulburări psihiatrice severe'
    ],
    legalBasis: 'Codul Muncii - art. 115, 116, 123-125; Decizia IARC (2019) - munca în ture de noapte = probabil cancerigen; HG 1425/2006 - supraveghere medicală strictă'
  },
  {
    id: 'night_shift_permanent',
    name: 'Program de noapte permanent',
    description: 'Program exclusiv nocturn (22:00-06:00), specific pentru agenți de securitate, personal tehnic în mentenanță',
    hoursPerDay: 8,
    daysPerWeek: 5,
    nightShift: true,
    specificRisks: [
      'Inversiune cronică ritm circadian',
      'Privare cronică de lumină naturală → deficit vitamina D',
      'Izolare socială majoră',
      'Tulburări de somn persistente',
      'Risc metabolic foarte crescut',
      'Risc cardiovascular crescut',
      'Depresie sezonieră'
    ],
    additionalMedical: [
      'Evaluare cardiovasculară completă (EKG, ecocardiografie, teste de efort)',
      'Dozare vitamina D și suplimentare obligatorie',
      'Screening metabolic (diabet, dislipidemi)',
      'Evaluare psihologică semestrială',
      'Control oftalmologic pentru adaptare la lumină scăzută',
      'Screening oncologic conform vârstei',
      'Contraindicații absolute: cardiopatie ischemică, diabet tip 1, epilepsie, tulburări psihiatrice grave, vârstă >55 ani (cu evaluare individuală)'
    ],
    legalBasis: 'Codul Muncii - art. 123-125; Art. 124: interzis femeile gravide și tineri <18 ani; spor minim 25%; Legea 319/2006 - supraveghere medicală intensivă; IARC Monograph 124 (2019)'
  },
  {
    id: 'part_time',
    name: 'Program cu normă parțială (part-time)',
    description: 'Program redus (4-6 ore/zi sau 2-3 zile/săptămână), pentru salariați cu contract part-time conform art. 103-105 Codul Muncii',
    hoursPerDay: 4, // variabil, exemplu 4h
    daysPerWeek: 5, // sau mai puțin
    nightShift: false,
    specificRisks: [
      'Intensitate crescută a activității în timpul mai scurt',
      'Lipsa pauzelor adecvate',
      'Stres pentru îndeplinirea sarcinilor în timp limitat'
    ],
    additionalMedical: [
      'Control medical de bază conform fișei postului',
      'Evaluare ergonomică dacă munca este intensivă',
      'Fără cerințe suplimentare față de norma întreagă'
    ],
    legalBasis: 'Codul Muncii - art. 103-105 (munca cu normă parțială); Aceleași drepturi SSM ca și salariații cu normă întreagă'
  },
  {
    id: 'remote_work',
    name: 'Telemuncă (remote work)',
    description: 'Muncă la distanță cu utilizare intensivă a tehnologiei IT, reglementată prin Legea telemuncii 81/2018',
    hoursPerDay: 8,
    daysPerWeek: 5,
    nightShift: false,
    specificRisks: [
      'Sedentarism prelungit',
      'Sindrom ergonomic (TMS - tulburări musculo-scheletice)',
      'Oboseală vizuală (computer vision syndrome)',
      'Izolare socială',
      'Dificultăți în separarea muncă-viață personală',
      'Tulburări de somn din expunere seară la ecrane',
      'Risc ergonomic dacă nu există amenajare corespunzătoare'
    ],
    additionalMedical: [
      'Control oftalmologic anual obligatoriu',
      'Evaluare ergonomică a spațiului de lucru la domiciliu',
      'Screening TMS (dureri cervicale, lombare, sindrom tunel carpian)',
      'Evaluare psihosocială pentru burnout și izolare',
      'Recomandări pentru pauze active și mișcare'
    ],
    legalBasis: 'Legea 81/2018 privind telemunca; Codul Muncii - art. 108^1-108^10; HG 1425/2006 - aplicabilă și la telemuncă; Angajatorul obligat să asigure condiții ergonomice și echipament adecvat'
  },
  {
    id: 'home_based_work',
    name: 'Muncă la domiciliu',
    description: 'Muncă desfășurată la domiciliu cu predare periodicele de lucrări (ex: artizanat, asamblare, procesare date), conform art. 108 Codul Muncii',
    hoursPerDay: 0, // flexibil, fără program fix
    daysPerWeek: 0, // flexibil
    nightShift: false,
    specificRisks: [
      'Lipsă supraveghere SSM directă',
      'Condiții de lucru necontrolate',
      'Risc ergonomic ridicat (mobilier neadecvat)',
      'Utilizare posibilă substanțe periculoase fără EIP',
      'Lipsa echipamentelor de protecție',
      'Izolare profesională completă',
      'Suprasolicitare fără pauze reglementate'
    ],
    additionalMedical: [
      'Control medical inițial și periodic conform riscurilor specifice activității',
      'Evaluare a spațiului de lucru la domiciliu (vizită SSM)',
      'Instruire SSM adaptată pentru lucrul izolat',
      'Evaluare psihosocială',
      'Identificare riscuri specifice: chimice, ergonomice, electrice',
      'Furnizare EIP dacă e cazul'
    ],
    legalBasis: 'Codul Muncii - art. 108-110 (munca la domiciliu); Legea 319/2006 - obligații SSM ale angajatorului rămân valabile; Angajatorul trebuie să asigure condiții de SSM și la domiciliul salariatului'
  }
];

/**
 * Găsește un tip de program după ID
 */
export function getWorkScheduleTypeById(id: string): WorkScheduleType | undefined {
  return WORK_SCHEDULE_TYPES.find(type => type.id === id);
}

/**
 * Filtrează tipurile de program care includ schimburi de noapte
 */
export function getNightShiftSchedules(): WorkScheduleType[] {
  return WORK_SCHEDULE_TYPES.filter(type => type.nightShift);
}

/**
 * Calculează ore săptămânale pentru un tip de program
 */
export function calculateWeeklyHours(scheduleType: WorkScheduleType): number {
  return scheduleType.hoursPerDay * scheduleType.daysPerWeek;
}
