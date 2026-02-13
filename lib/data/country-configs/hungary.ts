/**
 * Country-specific configuration for Hungary (HU)
 * SSM (Munkavédelem) and PSI (Tűzvédelem) regulations
 * Legal basis: 1993. évi XCIII. törvény a munkavédelemről
 */

export interface TrainingType {
  id: string;
  name: string;
  nameHU: string;
  duration: number; // hours
  validityPeriod: number; // months
  required: boolean;
  category: 'ssm' | 'psi' | 'medical' | 'special';
}

export interface MedicalRequirement {
  id: string;
  jobCategory: string;
  jobCategoryHU: string;
  frequency: number; // months
  requiredExams: string[];
}

export interface PublicHoliday {
  date: string; // MM-DD format
  name: string;
  nameHU: string;
}

export interface Authority {
  name: string;
  nameHU: string;
  abbreviation: string;
  website: string;
  emergencyContact: string;
}

export interface PenaltyRange {
  category: string;
  categoryHU: string;
  minAmount: number; // HUF
  maxAmount: number; // HUF
  description: string;
  descriptionHU: string;
}

export interface DocumentTemplate {
  id: string;
  type: string;
  name: string;
  nameHU: string;
  required: boolean;
  legalBasis: string;
}

export interface LegislativeAct {
  id: string;
  title: string;
  titleHU: string;
  number: string;
  domain: 'ssm' | 'psi' | 'medical' | 'general';
  description: string;
  descriptionHU: string;
}

export interface CountryConfig {
  countryCode: string;
  countryName: string;
  currency: string;
  legislation: LegislativeAct[];
  trainingTypes: TrainingType[];
  medicalRequirements: MedicalRequirement[];
  publicHolidays: PublicHoliday[];
  authorities: Authority[];
  penalties: PenaltyRange[];
  documentTemplates: DocumentTemplate[];
}

// Hungarian SSM/PSI legislation
const legislation: LegislativeAct[] = [
  {
    id: 'hu-munkavedelmi-torveny',
    title: 'Legea privind protecția muncii',
    titleHU: '1993. évi XCIII. törvény a munkavédelemről',
    number: '1993. évi XCIII. törvény',
    domain: 'general',
    description: 'Actul normativ fundamental care reglementează protecția muncii în Ungaria, stabilind obligațiile angajatorului și drepturile angajaților în domeniul securității și sănătății în muncă.',
    descriptionHU: 'A munkavédelem alapvető jogszabálya Magyarországon, amely meghatározza a munkáltató kötelezettségeit és a munkavállalók jogait a munkavédelem területén.'
  },
  {
    id: 'hu-munka-torvenykonyve',
    title: 'Codul muncii ungar',
    titleHU: '2012. évi I. törvény a Munka Törvénykönyvéről',
    number: '2012. évi I. törvény',
    domain: 'general',
    description: 'Codul muncii care reglementează relațiile de muncă, inclusiv aspecte generale privind securitatea și sănătatea angajaților.',
    descriptionHU: 'A munkajogi szabályozás alapja, amely tartalmazza a munkaviszonyra vonatkozó általános előírásokat, beleértve a munkavállalók biztonságát és egészségét.'
  },
  {
    id: 'hu-munkavedelmi-kepzes',
    title: 'Instruirea în domeniul protecției muncii',
    titleHU: '5/1993. (XII. 26.) MüM rendelet a munkavédelmi oktatásról',
    number: '5/1993. (XII. 26.) MüM rendelet',
    domain: 'ssm',
    description: 'Reglementează tipurile obligatorii de instruire în domeniul protecției muncii: instruire generală, instruire specifică postului și instruire periodică.',
    descriptionHU: 'A munkavédelmi oktatás kötelező formáit szabályozza: általános munkavédelmi oktatás, munkakör-specifikus oktatás és időszakos oktatás.'
  },
  {
    id: 'hu-munkavedelmi-szakember',
    title: 'Specialiști în protecția muncii',
    titleHU: '3/2002. (II. 15.) SzCsM-EüM rendelet a munkavédelmi szakemberek képesítéséről',
    number: '3/2002. (II. 15.) SzCsM-EüM rendelet',
    domain: 'ssm',
    description: 'Stabilește cerințele de calificare pentru specialiștii în protecția muncii, categoriile acestora și obligațiile angajatorului privind angajarea acestora.',
    descriptionHU: 'A munkavédelmi szakemberek képesítési követelményeit, kategóriáit és a munkáltató alkalmazási kötelezettségét határozza meg.'
  },
  {
    id: 'hu-munkabaleset',
    title: 'Investigarea accidentelor de muncă',
    titleHU: '63/1999. (XII. 3.) GM rendelet a munkahelyi balesetek bejelentéséről',
    number: '63/1999. (XII. 3.) GM rendelet',
    domain: 'ssm',
    description: 'Procedura de raportare și investigare a accidentelor de muncă, obligațiile de notificare către autorități și documentația necesară.',
    descriptionHU: 'A munkahelyi balesetek bejelentésének és kivizsgálásának eljárását, a hatóságok felé történő bejelentési kötelezettséget és a szükséges dokumentációt szabályozza.'
  },
  {
    id: 'hu-munkaalkalmassag',
    title: 'Examinări medicale de aptitudine profesională',
    titleHU: '33/1998. (VI. 24.) NM rendelet a munkaköri, szakmai, illetve személyi higiénés alkalmasság orvosi vizsgálatáról',
    number: '33/1998. (VI. 24.) NM rendelet',
    domain: 'medical',
    description: 'Stabilește tipurile de controale medicale obligatorii: inițiale, periodice și de control, frecvența acestora în funcție de riscurile profesionale.',
    descriptionHU: 'A munkaköri, szakmai és személyi higiénés alkalmassági vizsgálatok típusait, gyakoriságát és a foglalkozási kockázatokhoz igazodó követelményeit határozza meg.'
  },
  {
    id: 'hu-veszelyes-anyagok',
    title: 'Manipularea substanțelor periculoase',
    titleHU: '25/2000. (IX. 30.) EüM-SzCsM rendelet a veszélyes anyagokkal kapcsolatos munkáltatói kötelezettségekről',
    number: '25/2000. (IX. 30.) EüM-SzCsM rendelet',
    domain: 'ssm',
    description: 'Obligațiile angajatorului privind manipularea substanțelor chimice periculoase, evaluarea riscurilor și măsurile de protecție.',
    descriptionHU: 'A munkáltató veszélyes anyagokkal kapcsolatos kötelezettségeit, a kockázatértékelést és a védelmi intézkedéseket szabályozza.'
  },
  {
    id: 'hu-tuzvedelem',
    title: 'Protecția împotriva incendiilor',
    titleHU: '54/2014. (XII. 5.) BM rendelet az Országos Tűzvédelmi Szabályzatról',
    number: '54/2014. (XII. 5.) BM rendelet',
    domain: 'psi',
    description: 'Regulamentul național de protecție împotriva incendiilor: cerințe pentru căi de evacuare, sisteme de alarmă, echipamente de stingere și instruirea personalului.',
    descriptionHU: 'Az Országos Tűzvédelmi Szabályzat: a menekülési útvonalak, a riasztórendszerek, a tűzoltó berendezések és a személyzet oktatásának követelményei.'
  },
  {
    id: 'hu-egyeni-vedoeszkozok',
    title: 'Echipamente individuale de protecție',
    titleHU: '9/2020. (XII. 23.) ITM rendelet az egyéni védőeszközök követelményeiről',
    number: '9/2020. (XII. 23.) ITM rendelet',
    domain: 'ssm',
    description: 'Cerințe privind echipamentele individuale de protecție, obligațiile angajatorului de a asigura EIP-uri adecvate și normele de utilizare.',
    descriptionHU: 'Az egyéni védőeszközök követelményei, a munkáltató eszközbiztosítási kötelezettsége és a használati szabályok.'
  },
  {
    id: 'hu-munkahely-minimum-kovetelmenyek',
    title: 'Cerințe minime pentru locurile de muncă',
    titleHU: '3/2002. (II. 8.) SzCsM-EüM rendelet a munkahelyek munkavédelmi követelményeinek minimális szintjéről',
    number: '3/2002. (II. 8.) SzCsM-EüM rendelet',
    domain: 'ssm',
    description: 'Stabilește cerințele minime de securitate și sănătate pentru organizarea locurilor de muncă: iluminat, ventilație, temperatură, spațiu de lucru.',
    descriptionHU: 'A munkahelyek biztonsági és egészségügyi minimumkövetelményeit határozza meg: világítás, szellőzés, hőmérséklet, munkaterület.'
  }
];

// Training types for Hungary
const trainingTypes: TrainingType[] = [
  {
    id: 'hu-altalanos-munkavedelmi',
    name: 'Instruire generală în protecția muncii',
    nameHU: 'Általános munkavédelmi oktatás',
    duration: 8,
    validityPeriod: 24,
    required: true,
    category: 'ssm'
  },
  {
    id: 'hu-munkakori-oktat',
    name: 'Instruire specifică postului',
    nameHU: 'Munkakör-specifikus oktatás',
    duration: 4,
    validityPeriod: 12,
    required: true,
    category: 'ssm'
  },
  {
    id: 'hu-idoszakos-oktat',
    name: 'Instruire periodică SSM',
    nameHU: 'Időszakos munkavédelmi oktatás',
    duration: 4,
    validityPeriod: 12,
    required: true,
    category: 'ssm'
  },
  {
    id: 'hu-tuzvedelem',
    name: 'Instruire protecție împotriva incendiilor',
    nameHU: 'Tűzvédelmi oktatás',
    duration: 3,
    validityPeriod: 12,
    required: true,
    category: 'psi'
  },
  {
    id: 'hu-elsosegely',
    name: 'Curs prim ajutor',
    nameHU: 'Elsősegélynyújtó tanfolyam',
    duration: 8,
    validityPeriod: 24,
    required: false,
    category: 'medical'
  },
  {
    id: 'hu-magasban-vegzett-munka',
    name: 'Lucrări la înălțime',
    nameHU: 'Magasban végzett munka',
    duration: 6,
    validityPeriod: 12,
    required: false,
    category: 'special'
  },
  {
    id: 'hu-villamos-biztonsag',
    name: 'Siguranță electrică',
    nameHU: 'Villamos biztonsági oktatás',
    duration: 8,
    validityPeriod: 36,
    required: false,
    category: 'special'
  },
  {
    id: 'hu-veszelyes-anyagok',
    name: 'Manipularea substanțelor periculoase',
    nameHU: 'Veszélyes anyagok kezelése',
    duration: 6,
    validityPeriod: 12,
    required: false,
    category: 'special'
  }
];

// Medical examination requirements
const medicalRequirements: MedicalRequirement[] = [
  {
    id: 'hu-med-admin',
    jobCategory: 'Muncă administrativă',
    jobCategoryHU: 'Adminisztratív munka',
    frequency: 48,
    requiredExams: ['general_health', 'vision']
  },
  {
    id: 'hu-med-production',
    jobCategory: 'Muncă în producție',
    jobCategoryHU: 'Termelő munka',
    frequency: 24,
    requiredExams: ['general_health', 'vision', 'hearing', 'musculoskeletal']
  },
  {
    id: 'hu-med-hazardous',
    jobCategory: 'Lucru cu substanțe periculoase',
    jobCategoryHU: 'Veszélyes anyagokkal végzett munka',
    frequency: 12,
    requiredExams: ['general_health', 'respiratory', 'blood_tests', 'dermatology']
  },
  {
    id: 'hu-med-height',
    jobCategory: 'Lucrări la înălțime',
    jobCategoryHU: 'Magasban végzett munka',
    frequency: 12,
    requiredExams: ['general_health', 'vision', 'cardiovascular', 'neurological', 'vestibular']
  },
  {
    id: 'hu-med-drivers',
    jobCategory: 'Conducători auto profesioniști',
    jobCategoryHU: 'Hivatásos gépjárművezetők',
    frequency: 12,
    requiredExams: ['general_health', 'vision', 'hearing', 'neurological', 'cardiovascular']
  },
  {
    id: 'hu-med-food-handling',
    jobCategory: 'Manipulatori alimente',
    jobCategoryHU: 'Élelmiszert kezelők',
    frequency: 12,
    requiredExams: ['general_health', 'infectious_diseases', 'dermatology', 'stool_culture']
  }
];

// Hungarian public holidays
const publicHolidays: PublicHoliday[] = [
  { date: '01-01', name: 'Anul Nou', nameHU: 'Újév' },
  { date: '03-15', name: 'Ziua Revoluției de la 1848', nameHU: '1848-as forradalom ünnepe' },
  { date: '04-18', name: 'Vinerea Mare', nameHU: 'Nagypéntek' }, // Variable, example date
  { date: '04-21', name: 'Paștele', nameHU: 'Húsvét vasárnap' }, // Variable, example date
  { date: '04-22', name: 'Lunea Paștelui', nameHU: 'Húsvét hétfő' }, // Variable, example date
  { date: '05-01', name: 'Ziua Muncii', nameHU: 'A munka ünnepe' },
  { date: '06-09', name: 'Rusalii', nameHU: 'Pünkösd vasárnap' }, // Variable, example date
  { date: '06-10', name: 'Lunea Rusaliilor', nameHU: 'Pünkösd hétfő' }, // Variable, example date
  { date: '08-20', name: 'Ziua Sfântului Ștefan', nameHU: 'Szent István ünnepe' },
  { date: '10-23', name: 'Ziua Revoluției de la 1956', nameHU: '1956-os forradalom ünnepe' },
  { date: '11-01', name: 'Ziua Tuturor Sfinților', nameHU: 'Mindenszentek' },
  { date: '12-25', name: 'Crăciunul', nameHU: 'Karácsony' },
  { date: '12-26', name: 'A doua zi de Crăciun', nameHU: 'Karácsony második napja' }
];

// Competent authority
const authorities: Authority[] = [
  {
    name: 'Inspectoratul de Stat pentru Protecția Muncii',
    nameHU: 'Országos Munkavédelmi és Munkaügyi Főfelügyelőség (OMMF)',
    abbreviation: 'OMMF',
    website: 'https://www.munkavedelemfelügyelet.kormany.hu',
    emergencyContact: '104' // General emergency number in Hungary
  },
  {
    name: 'Comandamentul Național de Pompieri',
    nameHU: 'Országos Katasztrófavédelmi Főigazgatóság',
    abbreviation: 'OKF',
    website: 'https://www.katasztrofavedelem.hu',
    emergencyContact: '105'
  },
  {
    name: 'Centrul Național de Sănătate Publică',
    nameHU: 'Nemzeti Népegészségügyi és Gyógyszerészeti Központ',
    abbreviation: 'NNGYK',
    website: 'https://www.nnk.gov.hu',
    emergencyContact: '+36 1 476 1100'
  }
];

// Penalty ranges (in HUF - Hungarian Forint)
const penalties: PenaltyRange[] = [
  {
    category: 'Lipsă instruire SSM obligatorie',
    categoryHU: 'Kötelező munkavédelmi oktatás hiánya',
    minAmount: 100000,
    maxAmount: 1000000,
    description: 'Angajatorul nu a asigurat instruirea obligatorie în protecția muncii pentru angajați.',
    descriptionHU: 'A munkáltató nem biztosította a munkavállalók kötelező munkavédelmi oktatását.'
  },
  {
    category: 'Lipsă specialist protecție muncii',
    categoryHU: 'Munkavédelmi szakember hiánya',
    minAmount: 200000,
    maxAmount: 2000000,
    description: 'Angajatorul nu a angajat specialist calificat în protecția muncii conform legislației.',
    descriptionHU: 'A munkáltató nem alkalmazott képesített munkavédelmi szakembert a jogszabályok szerint.'
  },
  {
    category: 'Lipsă examinări medicale',
    categoryHU: 'Munkaköri alkalmassági vizsgálat hiánya',
    minAmount: 150000,
    maxAmount: 1500000,
    description: 'Angajații lucrează fără examene medicale valabile de aptitudine profesională.',
    descriptionHU: 'A munkavállalók érvényes munkaköri alkalmassági vizsgálat nélkül dolgoznak.'
  },
  {
    category: 'Lipsă echipamente de protecție',
    categoryHU: 'Egyéni védőeszközök hiánya',
    minAmount: 100000,
    maxAmount: 1000000,
    description: 'Angajatorul nu a asigurat echipamente individuale de protecție adecvate riscurilor.',
    descriptionHU: 'A munkáltató nem biztosította a kockázatoknak megfelelő egyéni védőeszközöket.'
  },
  {
    category: 'Neraportare accident de muncă',
    categoryHU: 'Munkabaleset be nem jelentése',
    minAmount: 300000,
    maxAmount: 3000000,
    description: 'Accidentul de muncă nu a fost raportat autorităților în termenul legal.',
    descriptionHU: 'A munkahelyi balesetet nem jelentették be a hatóságoknak a jogszabályi határidőn belül.'
  },
  {
    category: 'Nerespectare norme PSI',
    categoryHU: 'Tűzvédelmi előírások megsértése',
    minAmount: 200000,
    maxAmount: 5000000,
    description: 'Încălcarea gravă a normelor de protecție împotriva incendiilor.',
    descriptionHU: 'A tűzvédelmi előírások súlyos megsértése.'
  },
  {
    category: 'Lipsă evaluare riscuri',
    categoryHU: 'Kockázatértékelés hiánya',
    minAmount: 200000,
    maxAmount: 2000000,
    description: 'Angajatorul nu a efectuat evaluarea riscurilor profesionale conform legii.',
    descriptionHU: 'A munkáltató nem végezte el a munkavédelmi kockázatértékelést a törvény szerint.'
  },
  {
    category: 'Condiții periculoase de muncă',
    categoryHU: 'Veszélyes munkafeltételek',
    minAmount: 500000,
    maxAmount: 10000000,
    description: 'Menținerea condițiilor de muncă care prezintă pericol grav pentru viața sau sănătatea angajaților.',
    descriptionHU: 'Olyan munkafeltételek fenntartása, amelyek súlyos veszélyt jelentenek a munkavállalók életére vagy egészségére.'
  }
];

// Document templates required in Hungary
const documentTemplates: DocumentTemplate[] = [
  {
    id: 'hu-doc-risk-assessment',
    type: 'risk_assessment',
    name: 'Evaluare riscuri profesionale',
    nameHU: 'Kockázatértékelés',
    required: true,
    legalBasis: '1993. évi XCIII. törvény 54. §'
  },
  {
    id: 'hu-doc-ssm-regulations',
    type: 'internal_regulations',
    name: 'Regulament intern SSM',
    nameHU: 'Munkavédelmi szabályzat',
    required: true,
    legalBasis: '1993. évi XCIII. törvény 54. §'
  },
  {
    id: 'hu-doc-psi-regulations',
    type: 'fire_safety_regulations',
    name: 'Regulament protecție incendiu',
    nameHU: 'Tűzvédelmi szabályzat',
    required: true,
    legalBasis: '54/2014. (XII. 5.) BM rendelet'
  },
  {
    id: 'hu-doc-training-register',
    type: 'training_log',
    name: 'Registru instruiri SSM',
    nameHU: 'Munkavédelmi oktatási napló',
    required: true,
    legalBasis: '5/1993. (XII. 26.) MüM rendelet'
  },
  {
    id: 'hu-doc-accident-register',
    type: 'accident_log',
    name: 'Registru accidente de muncă',
    nameHU: 'Munkabaleset nyilvántartás',
    required: true,
    legalBasis: '63/1999. (XII. 3.) GM rendelet'
  },
  {
    id: 'hu-doc-medical-register',
    type: 'medical_log',
    name: 'Registru examinări medicale',
    nameHU: 'Alkalmassági vizsgálatok nyilvántartása',
    required: true,
    legalBasis: '33/1998. (VI. 24.) NM rendelet'
  },
  {
    id: 'hu-doc-eip-register',
    type: 'ppe_log',
    name: 'Registru EIP distribuite',
    nameHU: 'Egyéni védőeszköz kiadási napló',
    required: true,
    legalBasis: '9/2020. (XII. 23.) ITM rendelet'
  },
  {
    id: 'hu-doc-evacuation-plan',
    type: 'evacuation_plan',
    name: 'Plan de evacuare',
    nameHU: 'Menekülési terv',
    required: true,
    legalBasis: '54/2014. (XII. 5.) BM rendelet'
  },
  {
    id: 'hu-doc-hazardous-substances',
    type: 'hazardous_substances_registry',
    name: 'Registru substanțe periculoase',
    nameHU: 'Veszélyes anyagok nyilvántartása',
    required: false,
    legalBasis: '25/2000. (IX. 30.) EüM-SzCsM rendelet'
  },
  {
    id: 'hu-doc-equipment-inspection',
    type: 'equipment_inspection_log',
    name: 'Registru verificări echipamente',
    nameHU: 'Munkaeszköz felülvizsgálati napló',
    required: true,
    legalBasis: '3/2002. (II. 8.) SzCsM-EüM rendelet'
  }
];

// Main Hungary configuration export
export const hungaryConfig: CountryConfig = {
  countryCode: 'HU',
  countryName: 'Hungary',
  currency: 'HUF',
  legislation,
  trainingTypes,
  medicalRequirements,
  publicHolidays,
  authorities,
  penalties,
  documentTemplates
};

export default hungaryConfig;
