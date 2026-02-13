/**
 * Coduri CAEN relevante pentru SSM (Securitatea și Sănătatea în Muncă)
 * Top 50 de activități economice cu specificațiile lor de risc și cerințe SSM
 */

export type RiskLevel = 'scazut' | 'mediu' | 'ridicat' | 'foarte_ridicat';

export interface CAENCode {
  code: string;
  name: string;
  riskLevel: RiskLevel;
  requiredSSMDocs: string[];
  typicalHazards: string[];
  inspectionFrequency: string;
}

export const coduriCAEN: CAENCode[] = [
  // Construcții - risc foarte ridicat
  {
    code: '4120',
    name: 'Lucrări de construcții a clădirilor rezidențiale și nerezidențiale',
    riskLevel: 'foarte_ridicat',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Plan de securitate și sănătate',
      'Documentație pentru lucru la înălțime',
      'Autorizații operare echipamente',
      'Instrucțiuni de lucru specifice',
      'Fișe individuate de instruire',
    ],
    typicalHazards: [
      'Cădere de la înălțime',
      'Lovire de obiecte',
      'Prindere/strivire',
      'Electrocutare',
      'Intoxicații cu substanțe chimice',
      'Colaps de structuri',
    ],
    inspectionFrequency: 'lunar',
  },
  {
    code: '4211',
    name: 'Construcții de drumuri și autostrăzi',
    riskLevel: 'foarte_ridicat',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Plan de securitate și sănătate',
      'Plan de circulație',
      'Autorizații operare mașini',
      'Instrucțiuni lucru în condiții speciale',
    ],
    typicalHazards: [
      'Accidente rutiere',
      'Lovire de mașini',
      'Expunere la vibrații',
      'Zgomot intens',
      'Praf și vapori bituminoși',
      'Lovire de vehicule în trafic',
    ],
    inspectionFrequency: 'lunar',
  },
  {
    code: '4312',
    name: 'Lucrări de pregătire a terenului',
    riskLevel: 'foarte_ridicat',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Autorizații săpături',
      'Plan de securitate',
      'Instrucțiuni operative',
    ],
    typicalHazards: [
      'Surpare terasamente',
      'Lovire de excavatoare',
      'Contact cu utilități îngropate',
      'Alunecare teren',
      'Prindere între pământ și mașini',
    ],
    inspectionFrequency: 'lunar',
  },
  {
    code: '4321',
    name: 'Lucrări de instalații electrice',
    riskLevel: 'foarte_ridicat',
    requiredSSMDocs: [
      'Autorizație electrician',
      'Plan de prevenire și protecție',
      'Instrucțiuni lucru sub tensiune',
      'Verificări instalații',
      'Fișe echipament protecție',
    ],
    typicalHazards: [
      'Electrocutare',
      'Arsuri electrice',
      'Electrizare',
      'Incendiu',
      'Explozie',
      'Cădere de la înălțime',
    ],
    inspectionFrequency: 'lunar',
  },
  {
    code: '4329',
    name: 'Alte lucrări de instalații pentru construcții',
    riskLevel: 'ridicat',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Autorizații specifice',
      'Instrucțiuni tehnice',
      'Fișe instruire',
    ],
    typicalHazards: [
      'Cădere de la înălțime',
      'Lovire de obiecte',
      'Arsuri',
      'Intoxicații',
      'Tăieturi',
    ],
    inspectionFrequency: 'lunar',
  },

  // Industrie prelucrătoare - risc ridicat/foarte ridicat
  {
    code: '1010',
    name: 'Prelucrarea și conservarea cărnii',
    riskLevel: 'ridicat',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Control medical periodic',
      'Instrucțiuni utilaje tăiere',
      'Plan HACCP',
      'Evaluare risc biologic',
    ],
    typicalHazards: [
      'Tăieturi de cuțite',
      'Expunere la frig',
      'Risc biologic',
      'Mișcări repetitive',
      'Contaminare biologică',
      'Alunecări pe suprafețe umede',
    ],
    inspectionFrequency: 'lunar',
  },
  {
    code: '1520',
    name: 'Fabricarea încălțămintei',
    riskLevel: 'mediu',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Evaluare risc chimic',
      'Fișe siguranță produse',
      'Control medical',
    ],
    typicalHazards: [
      'Expunere solventi',
      'Vapori cleiuri',
      'Mișcări repetitive',
      'Zgomot moderat',
      'Praf',
    ],
    inspectionFrequency: 'trimestrial',
  },
  {
    code: '1610',
    name: 'Tăierea și rindeluirea lemnului',
    riskLevel: 'ridicat',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Autorizații mașini prelucrare lemn',
      'Instrucțiuni operare',
      'Plan PSI specific',
    ],
    typicalHazards: [
      'Tăieturi și amputări',
      'Praf de lemn',
      'Zgomot intens',
      'Proiecții așchii',
      'Incendiu',
      'Vibrații',
    ],
    inspectionFrequency: 'lunar',
  },
  {
    code: '2011',
    name: 'Fabricarea gazelor industriale',
    riskLevel: 'foarte_ridicat',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Plan de intervenție în caz de accident',
      'Autorizații SEVESO',
      'Fișe siguranță toate gazele',
      'Plan evacuare',
      'Control medical special',
    ],
    typicalHazards: [
      'Explozie',
      'Intoxicații',
      'Asfixiere',
      'Arsuri criogenice',
      'Incendiu',
      'Expunere substanțe toxice',
    ],
    inspectionFrequency: 'săptămânal',
  },
  {
    code: '2420',
    name: 'Fabricarea tuburilor, țevilor din oțel',
    riskLevel: 'ridicat',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Autorizații mașini',
      'Verificări echipamente sub presiune',
      'Control medical',
    ],
    typicalHazards: [
      'Arsuri termice',
      'Lovire de obiecte grele',
      'Zgomot intens',
      'Radiații termice',
      'Prindere',
      'Expunere la căldură extremă',
    ],
    inspectionFrequency: 'lunar',
  },
  {
    code: '2511',
    name: 'Fabricarea de construcții metalice',
    riskLevel: 'ridicat',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Autorizații sudură',
      'Verificări utilaje',
      'Instrucțiuni de lucru',
    ],
    typicalHazards: [
      'Arsuri de sudură',
      'Electrocutare',
      'Vapori metalici',
      'Proiecții metalice',
      'Zgomot',
      'Radiații UV',
    ],
    inspectionFrequency: 'lunar',
  },
  {
    code: '2593',
    name: 'Fabricarea de produse din sârmă',
    riskLevel: 'mediu',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Verificări mașini',
      'Instrucțiuni operare',
    ],
    typicalHazards: [
      'Tăieturi',
      'Prindere',
      'Zgomot',
      'Vibrații',
      'Lovire de obiecte',
    ],
    inspectionFrequency: 'trimestrial',
  },

  // Transport și depozitare
  {
    code: '4941',
    name: 'Transporturi rutiere de mărfuri',
    riskLevel: 'ridicat',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Instrucțiuni șoferi',
      'Verificări vehicule',
      'Documente ADR (dacă aplicabil)',
    ],
    typicalHazards: [
      'Accidente rutiere',
      'Răsturnare vehicul',
      'Lovire în manipulare',
      'Oboseală',
      'Stres',
      'Tulburări musculo-scheletice',
    ],
    inspectionFrequency: 'trimestrial',
  },
  {
    code: '5210',
    name: 'Depozitări',
    riskLevel: 'mediu',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Plan PSI',
      'Autorizații stivuitor',
      'Instrucțiuni manipulare',
    ],
    typicalHazards: [
      'Lovire de stivuitor',
      'Cădere obiecte',
      'Prindere',
      'Incendiu',
      'Tulburări musculo-scheletice',
    ],
    inspectionFrequency: 'trimestrial',
  },

  // Comerț
  {
    code: '4711',
    name: 'Comerț cu amănuntul în magazine nespecializate',
    riskLevel: 'scazut',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Plan PSI',
      'Instrucțiuni angajați',
    ],
    typicalHazards: [
      'Alunecări',
      'Tăieturi minore',
      'Jaf/agresiune',
      'Stres',
      'Tulburări musculo-scheletice',
    ],
    inspectionFrequency: 'semestrial',
  },
  {
    code: '4730',
    name: 'Comerț cu amănuntul cu carburanți',
    riskLevel: 'ridicat',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Plan PSI detaliat',
      'Plan de intervenție',
      'Autorizații pompieri',
      'Control scurgeri',
    ],
    typicalHazards: [
      'Incendiu',
      'Explozie',
      'Intoxicații vapori',
      'Jaf',
      'Expunere chimică',
    ],
    inspectionFrequency: 'lunar',
  },
  {
    code: '4771',
    name: 'Comerț cu amănuntul cu îmbrăcăminte',
    riskLevel: 'scazut',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Plan PSI',
      'Instrucțiuni angajați',
    ],
    typicalHazards: [
      'Alunecări',
      'Stres',
      'Tulburări musculo-scheletice minore',
      'Oboseală',
    ],
    inspectionFrequency: 'semestrial',
  },

  // Servicii IT și birou
  {
    code: '6201',
    name: 'Activități de realizare a soft-ului la comandă',
    riskLevel: 'scazut',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Evaluare ergonomie birou',
      'Instrucțiuni DSE',
    ],
    typicalHazards: [
      'Tulburări musculo-scheletice',
      'Oboseală vizuală',
      'Stres',
      'Sedentarism',
      'Electrocutare (risc minor)',
    ],
    inspectionFrequency: 'anual',
  },
  {
    code: '6202',
    name: 'Activități de consultanță în tehnologia informației',
    riskLevel: 'scazut',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Evaluare ergonomie',
      'Instrucțiuni lucru la calculator',
    ],
    typicalHazards: [
      'Tulburări musculo-scheletice',
      'Oboseală vizuală',
      'Stres',
      'Sedentarism',
    ],
    inspectionFrequency: 'anual',
  },

  // Industrie alimentară
  {
    code: '1071',
    name: 'Fabricarea pâinii și a produselor proaspete de patiserie',
    riskLevel: 'mediu',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Control medical periodic',
      'Plan HACCP',
      'Instrucțiuni utilaje',
    ],
    typicalHazards: [
      'Arsuri termice',
      'Tăieturi',
      'Expunere căldură',
      'Risc biologic',
      'Mișcări repetitive',
      'Alergii (făină)',
    ],
    inspectionFrequency: 'trimestrial',
  },
  {
    code: '1105',
    name: 'Fabricarea berii',
    riskLevel: 'mediu',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Control medical',
      'Verificări echipamente sub presiune',
      'Plan HACCP',
    ],
    typicalHazards: [
      'Asfixiere CO2',
      'Arsuri',
      'Expunere substanțe chimice',
      'Alunecări',
      'Lovire',
      'Spații confined',
    ],
    inspectionFrequency: 'trimestrial',
  },

  // Sănătate și asistență socială
  {
    code: '8610',
    name: 'Activități de asistență spitalicească',
    riskLevel: 'ridicat',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Evaluare risc biologic',
      'Plan gestionare deșeuri medicale',
      'Control medical specific',
      'Vaccinări',
      'Protocol expunere',
    ],
    typicalHazards: [
      'Risc biologic major',
      'Înțepături cu ace',
      'Infecții',
      'Radiații',
      'Substanțe chimice',
      'Violență',
      'Stres extrem',
    ],
    inspectionFrequency: 'lunar',
  },
  {
    code: '8690',
    name: 'Alte activități referitoare la sănătatea umană',
    riskLevel: 'mediu',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Evaluare risc biologic',
      'Control medical',
      'Protocol dezinfecție',
    ],
    typicalHazards: [
      'Risc biologic',
      'Înțepături',
      'Infecții',
      'Substanțe dezinfectante',
      'Stres',
    ],
    inspectionFrequency: 'trimestrial',
  },

  // Servicii de curățenie
  {
    code: '8121',
    name: 'Activități generale de curățare a clădirilor',
    riskLevel: 'mediu',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Fișe siguranță produse',
      'Evaluare risc chimic',
      'Instrucțiuni utilizare produse',
    ],
    typicalHazards: [
      'Expunere substanțe chimice',
      'Alunecări',
      'Cădere de la înălțime',
      'Dermatite',
      'Intoxicații',
      'Tulburări musculo-scheletice',
    ],
    inspectionFrequency: 'trimestrial',
  },

  // Industrie chimică
  {
    code: '2030',
    name: 'Fabricarea vopselelor și lacurilor',
    riskLevel: 'ridicat',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Fișe siguranță toate produsele',
      'Evaluare ATEX',
      'Plan de intervenție',
      'Control medical special',
    ],
    typicalHazards: [
      'Intoxicații',
      'Incendiu',
      'Explozie',
      'Expunere solventi',
      'Boli profesionale',
      'Arsuri chimice',
    ],
    inspectionFrequency: 'lunar',
  },
  {
    code: '2120',
    name: 'Fabricarea preparatelor farmaceutice',
    riskLevel: 'ridicat',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Evaluare risc chimic și biologic',
      'Control medical special',
      'Plan GMP',
      'Monitorizare expunere',
    ],
    typicalHazards: [
      'Expunere substanțe active',
      'Risc biologic',
      'Contaminare încrucișată',
      'Alergii',
      'Intoxicații',
    ],
    inspectionFrequency: 'lunar',
  },

  // Agricultură și silvicultură
  {
    code: '0111',
    name: 'Cultivarea cerealelor',
    riskLevel: 'mediu',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Autorizații mașini agricole',
      'Instrucțiuni pesticide',
      'Fișe siguranță produse',
    ],
    typicalHazards: [
      'Accidente cu mașini',
      'Expunere pesticide',
      'Lovire/strivire',
      'Răsturnare tractoare',
      'Zgomot',
      'Vibrații',
    ],
    inspectionFrequency: 'trimestrial',
  },
  {
    code: '0220',
    name: 'Exploatare forestieră',
    riskLevel: 'foarte_ridicat',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Autorizații drujbă',
      'Instrucțiuni tăiere arbori',
      'Plan de intervenție',
    ],
    typicalHazards: [
      'Cădere arbori',
      'Tăieturi drujbă',
      'Lovire de crengi',
      'Cădere de la înălțime',
      'Atacuri animale',
      'Zgomot extrem',
      'Vibrații',
    ],
    inspectionFrequency: 'lunar',
  },

  // Minerit
  {
    code: '0710',
    name: 'Extracția minereurilor feroase',
    riskLevel: 'foarte_ridicat',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Plan de evacuare',
      'Plan ventilație',
      'Control medical special',
      'Autorizații explozivi',
      'Monitorizare continuă',
    ],
    typicalHazards: [
      'Surpări',
      'Explozie',
      'Intoxicații gaze',
      'Asfixiere',
      'Praf de siliciu',
      'Zgomot extrem',
      'Vibrații',
    ],
    inspectionFrequency: 'săptămânal',
  },
  {
    code: '0812',
    name: 'Extracția pietrei ornamentale',
    riskLevel: 'ridicat',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Autorizații explozivi',
      'Verificări mașini',
      'Control medical',
    ],
    typicalHazards: [
      'Surpări',
      'Explozie',
      'Praf de siliciu',
      'Lovire de pietre',
      'Zgomot intens',
      'Vibrații',
    ],
    inspectionFrequency: 'lunar',
  },

  // Hoteluri și restaurante
  {
    code: '5510',
    name: 'Hoteluri și alte facilități de cazare similare',
    riskLevel: 'scazut',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Plan PSI',
      'Plan evacuare',
      'Instrucțiuni angajați',
    ],
    typicalHazards: [
      'Alunecări',
      'Tulburări musculo-scheletice',
      'Expunere produse curățenie',
      'Stres',
      'Incendiu',
    ],
    inspectionFrequency: 'semestrial',
  },
  {
    code: '5610',
    name: 'Restaurante',
    riskLevel: 'mediu',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Plan HACCP',
      'Plan PSI',
      'Control medical',
      'Instrucțiuni bucătărie',
    ],
    typicalHazards: [
      'Arsuri',
      'Tăieturi',
      'Alunecări',
      'Incendiu',
      'Risc biologic',
      'Stres',
    ],
    inspectionFrequency: 'trimestrial',
  },

  // Educație
  {
    code: '8510',
    name: 'Învățământ preșcolar',
    riskLevel: 'scazut',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Plan PSI',
      'Plan evacuare',
      'Control medical',
    ],
    typicalHazards: [
      'Risc biologic (boli copii)',
      'Stres',
      'Tulburări vocale',
      'Alunecări',
      'Agresiune',
    ],
    inspectionFrequency: 'anual',
  },
  {
    code: '8520',
    name: 'Învățământ primar',
    riskLevel: 'scazut',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Plan PSI',
      'Plan evacuare',
    ],
    typicalHazards: [
      'Risc biologic minor',
      'Stres',
      'Tulburări vocale',
      'Agresiune',
    ],
    inspectionFrequency: 'anual',
  },

  // Activități sportive
  {
    code: '9311',
    name: 'Activități ale bazelor sportive',
    riskLevel: 'mediu',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Plan PSI',
      'Plan de prim ajutor',
      'Verificări echipamente',
    ],
    typicalHazards: [
      'Accidentări sportive',
      'Electrocutare',
      'Incendiu',
      'Înec (piscine)',
      'Căderi',
      'Loviri',
    ],
    inspectionFrequency: 'trimestrial',
  },
  {
    code: '9329',
    name: 'Alte activități recreative și distractive',
    riskLevel: 'mediu',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Plan PSI',
      'Verificări echipamente',
      'Instrucțiuni siguranță',
    ],
    typicalHazards: [
      'Accidentări',
      'Căderi',
      'Electrocutare',
      'Incendiu',
      'Panică',
    ],
    inspectionFrequency: 'trimestrial',
  },

  // Administrație publică
  {
    code: '8411',
    name: 'Activități generale ale administrației publice',
    riskLevel: 'scazut',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Plan PSI',
      'Evaluare ergonomie',
    ],
    typicalHazards: [
      'Tulburări musculo-scheletice',
      'Stres',
      'Oboseală vizuală',
      'Sedentarism',
      'Agresiune (citizen contact)',
    ],
    inspectionFrequency: 'anual',
  },

  // Reparații auto
  {
    code: '4520',
    name: 'Întreținerea și repararea autovehiculelor',
    riskLevel: 'mediu',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Fișe siguranță produse',
      'Autorizații echipamente',
      'Instrucțiuni operare',
    ],
    typicalHazards: [
      'Lovire de mașini',
      'Prindere',
      'Arsuri',
      'Expunere chimice',
      'Incendiu',
      'Tăieturi',
    ],
    inspectionFrequency: 'trimestrial',
  },

  // Textile
  {
    code: '1310',
    name: 'Pregătirea fibrelor și filarea textilelor',
    riskLevel: 'mediu',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Control medical',
      'Evaluare praf organic',
      'Verificări mașini',
    ],
    typicalHazards: [
      'Praf textil',
      'Zgomot intens',
      'Prindere în mașini',
      'Vibrații',
      'Alergii',
    ],
    inspectionFrequency: 'trimestrial',
  },
  {
    code: '1392',
    name: 'Fabricarea de articole confecționate din textile',
    riskLevel: 'scazut',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Instrucțiuni mașini de cusut',
      'Evaluare ergonomie',
    ],
    typicalHazards: [
      'Înțepături',
      'Tulburări musculo-scheletice',
      'Oboseală vizuală',
      'Mișcări repetitive',
    ],
    inspectionFrequency: 'semestrial',
  },

  // Reciclare
  {
    code: '3832',
    name: 'Recuperarea materialelor reciclabile sortate',
    riskLevel: 'mediu',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Evaluare risc biologic',
      'Plan PSI',
      'Instrucțiuni manipulare',
    ],
    typicalHazards: [
      'Tăieturi',
      'Înțepături',
      'Risc biologic',
      'Expunere substanțe reziduale',
      'Lovire de mașini',
      'Incendiu',
    ],
    inspectionFrequency: 'trimestrial',
  },

  // Producție energie
  {
    code: '3511',
    name: 'Producția de energie electrică',
    riskLevel: 'foarte_ridicat',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Autorizații electricieni',
      'Instrucțiuni lucru sub tensiune',
      'Plan de intervenție',
      'Control medical special',
    ],
    typicalHazards: [
      'Electrocutare',
      'Arsuri electrice',
      'Explozie',
      'Incendiu',
      'Cădere de la înălțime',
      'Radiații',
    ],
    inspectionFrequency: 'lunar',
  },

  // Colectare deșeuri
  {
    code: '3811',
    name: 'Colectarea deșeurilor nepericuloase',
    riskLevel: 'mediu',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Autorizații șoferi',
      'Instrucțiuni manipulare',
      'Control medical',
    ],
    typicalHazards: [
      'Accidente rutiere',
      'Lovire de mașini',
      'Risc biologic',
      'Tăieturi/înțepături',
      'Tulburări musculo-scheletice',
      'Atacuri animale',
    ],
    inspectionFrequency: 'trimestrial',
  },
  {
    code: '3812',
    name: 'Colectarea deșeurilor periculoase',
    riskLevel: 'ridicat',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Autorizații speciale',
      'Plan de intervenție',
      'Fișe siguranță',
      'Control medical special',
    ],
    typicalHazards: [
      'Expunere substanțe toxice',
      'Intoxicații',
      'Arsuri chimice',
      'Contaminare',
      'Incendiu',
      'Explozie',
    ],
    inspectionFrequency: 'lunar',
  },

  // Imprimare și editură
  {
    code: '1811',
    name: 'Tipărire de ziare',
    riskLevel: 'mediu',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Fișe siguranță cerneluri',
      'Verificări mașini',
      'Evaluare risc chimic',
    ],
    typicalHazards: [
      'Expunere solventi',
      'Prindere în rulouri',
      'Zgomot',
      'Vibrații',
      'Tăieturi',
    ],
    inspectionFrequency: 'trimestrial',
  },

  // Telecomunicații
  {
    code: '6110',
    name: 'Telecomunicații prin rețele cu cablu',
    riskLevel: 'mediu',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Autorizații lucru la înălțime',
      'Instrucțiuni tehnice',
      'Control medical',
    ],
    typicalHazards: [
      'Cădere de la înălțime',
      'Electrocutare',
      'Lovire în trafic',
      'Tăieturi',
      'Expunere condiții meteo',
    ],
    inspectionFrequency: 'trimestrial',
  },

  // Servicii poștale
  {
    code: '5310',
    name: 'Activități poștale desfășurate sub obligația serviciului universal',
    riskLevel: 'scazut',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Instrucțiuni șoferi/curieri',
      'Evaluare ergonomie',
    ],
    typicalHazards: [
      'Accidente rutiere',
      'Tulburări musculo-scheletice',
      'Jaf/agresiune',
      'Atacuri câini',
      'Expunere condiții meteo',
    ],
    inspectionFrequency: 'semestrial',
  },

  // Activități financiare
  {
    code: '6419',
    name: 'Alte intermedieri monetare',
    riskLevel: 'scazut',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Plan jaf/agresiune',
      'Evaluare ergonomie',
    ],
    typicalHazards: [
      'Jaf',
      'Agresiune',
      'Stres extrem',
      'Tulburări musculo-scheletice',
      'Oboseală vizuală',
    ],
    inspectionFrequency: 'semestrial',
  },

  // Arhitectură
  {
    code: '7111',
    name: 'Activități de arhitectură',
    riskLevel: 'scazut',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Evaluare ergonomie',
      'Instrucțiuni vizite șantier',
    ],
    typicalHazards: [
      'Tulburări musculo-scheletice',
      'Oboseală vizuală',
      'Stres',
      'Accidente șantier (vizite)',
      'Sedentarism',
    ],
    inspectionFrequency: 'anual',
  },

  // Servicii veterinare
  {
    code: '7500',
    name: 'Activități veterinare',
    riskLevel: 'mediu',
    requiredSSMDocs: [
      'Plan de prevenire și protecție',
      'Evaluare risc biologic',
      'Control medical',
      'Vaccinări',
      'Protocol expunere',
    ],
    typicalHazards: [
      'Mușcături/zgârieturi animale',
      'Risc biologic',
      'Radiații (RX)',
      'Expunere medicamente',
      'Înțepături cu ace',
      'Alergii',
    ],
    inspectionFrequency: 'trimestrial',
  },
];

/**
 * Găsește un cod CAEN după codul numeric
 * @param code - Codul CAEN (ex: "4120")
 * @returns Obiectul CAENCode sau undefined dacă nu este găsit
 */
export function getCAENByCode(code: string): CAENCode | undefined {
  return coduriCAEN.find((caen) => caen.code === code);
}

/**
 * Filtrează coduri CAEN după nivel de risc
 * @param riskLevel - Nivelul de risc
 * @returns Array de coduri CAEN cu nivelul de risc specificat
 */
export function getCAENByRiskLevel(riskLevel: RiskLevel): CAENCode[] {
  return coduriCAEN.filter((caen) => caen.riskLevel === riskLevel);
}

/**
 * Returnează toate codurile CAEN sortate după nivel de risc (descrescător)
 * @returns Array de coduri CAEN sortate
 */
export function getCAENSortedByRisk(): CAENCode[] {
  const riskOrder: Record<RiskLevel, number> = {
    foarte_ridicat: 4,
    ridicat: 3,
    mediu: 2,
    scazut: 1,
  };

  return [...coduriCAEN].sort(
    (a, b) => riskOrder[b.riskLevel] - riskOrder[a.riskLevel]
  );
}

/**
 * Caută coduri CAEN după text în nume sau cod
 * @param searchTerm - Termenul de căutare
 * @returns Array de coduri CAEN care conțin termenul
 */
export function searchCAEN(searchTerm: string): CAENCode[] {
  const term = searchTerm.toLowerCase();
  return coduriCAEN.filter(
    (caen) =>
      caen.code.includes(term) ||
      caen.name.toLowerCase().includes(term) ||
      caen.typicalHazards.some((hazard) => hazard.toLowerCase().includes(term))
  );
}
