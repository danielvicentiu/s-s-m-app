/**
 * COR (Clasificarea Ocupațiilor din România) Codes Database
 *
 * Contains 80 frequent occupation codes used in Romanian workplaces
 * for SSM compliance, medical examinations, and training requirements.
 */

export type RiskLevel = 'low' | 'medium' | 'high' | 'very_high';

export interface CORCode {
  code: string; // 6-digit COR code
  name: string; // Romanian occupation name
  group: string; // Major occupation group
  riskLevel: RiskLevel; // Workplace risk assessment
  requiredQualification: string; // Minimum required qualification
  typicalEIP: string[]; // Typical Personal Protective Equipment (Echipamente Individuale de Protecție)
}

export const corCodes: CORCode[] = [
  // Group 1: Legislators, senior officials and managers
  {
    code: '111101',
    name: 'Director general',
    group: 'Legislatori, înalți funcționari și conducători de unități',
    riskLevel: 'low',
    requiredQualification: 'Studii superioare + experiență',
    typicalEIP: [],
  },
  {
    code: '112001',
    name: 'Director departament',
    group: 'Legislatori, înalți funcționari și conducători de unități',
    riskLevel: 'low',
    requiredQualification: 'Studii superioare',
    typicalEIP: [],
  },
  {
    code: '121101',
    name: 'Director financiar',
    group: 'Legislatori, înalți funcționari și conducători de unități',
    riskLevel: 'low',
    requiredQualification: 'Studii superioare în economie',
    typicalEIP: [],
  },
  {
    code: '131101',
    name: 'Manager producție',
    group: 'Legislatori, înalți funcționari și conducători de unități',
    riskLevel: 'medium',
    requiredQualification: 'Studii superioare + experiență tehnică',
    typicalEIP: ['cască protecție', 'încălțăminte de protecție'],
  },

  // Group 2: Professionals
  {
    code: '214201',
    name: 'Inginer constructor',
    group: 'Specialiști cu ocupații intelectuale și științifice',
    riskLevel: 'medium',
    requiredQualification: 'Diplomă de inginer',
    typicalEIP: ['cască protecție', 'încălțăminte de protecție', 'vestă reflectorizantă'],
  },
  {
    code: '214301',
    name: 'Inginer electromecanic',
    group: 'Specialiști cu ocupații intelectuale și științifice',
    riskLevel: 'high',
    requiredQualification: 'Diplomă de inginer',
    typicalEIP: ['cască protecție', 'mănuși dielectrice', 'încălțăminte dielectrică', 'ochelari protecție'],
  },
  {
    code: '214901',
    name: 'Inginer mecanic',
    group: 'Specialiști cu ocupații intelectuale și științifice',
    riskLevel: 'medium',
    requiredQualification: 'Diplomă de inginer',
    typicalEIP: ['cască protecție', 'încălțăminte de protecție', 'mănuși'],
  },
  {
    code: '215101',
    name: 'Inginer electronist',
    group: 'Specialiști cu ocupații intelectuale și științifice',
    riskLevel: 'medium',
    requiredQualification: 'Diplomă de inginer',
    typicalEIP: ['mănuși dielectrice', 'ochelari protecție'],
  },
  {
    code: '221101',
    name: 'Medic specialist',
    group: 'Specialiști cu ocupații intelectuale și științifice',
    riskLevel: 'medium',
    requiredQualification: 'Diplomă medicină + rezidențiat',
    typicalEIP: ['mănuși sterile', 'mască protecție', 'halat medical'],
  },
  {
    code: '222101',
    name: 'Asistent medical',
    group: 'Specialiști cu ocupații intelectuale și științifice',
    riskLevel: 'medium',
    requiredQualification: 'Școală postliceală sanitară',
    typicalEIP: ['mănuși medicale', 'mască protecție', 'halat medical'],
  },
  {
    code: '241101',
    name: 'Economist',
    group: 'Specialiști cu ocupații intelectuale și științifice',
    riskLevel: 'low',
    requiredQualification: 'Studii superioare economice',
    typicalEIP: [],
  },
  {
    code: '241201',
    name: 'Contabil',
    group: 'Specialiști cu ocupații intelectuale și științifice',
    riskLevel: 'low',
    requiredQualification: 'Studii superioare/medii economice',
    typicalEIP: [],
  },
  {
    code: '242101',
    name: 'Consilier juridic',
    group: 'Specialiști cu ocupații intelectuale și științifice',
    riskLevel: 'low',
    requiredQualification: 'Facultate de drept',
    typicalEIP: [],
  },
  {
    code: '251101',
    name: 'Analist programator',
    group: 'Specialiști cu ocupații intelectuale și științifice',
    riskLevel: 'low',
    requiredQualification: 'Studii superioare informatică',
    typicalEIP: [],
  },

  // Group 3: Technicians and associate professionals
  {
    code: '311501',
    name: 'Tehnician constructor',
    group: 'Tehnicieni, maeștri și asimilați',
    riskLevel: 'medium',
    requiredQualification: 'Școală postliceală tehnică',
    typicalEIP: ['cască protecție', 'încălțăminte de protecție', 'vestă reflectorizantă'],
  },
  {
    code: '311901',
    name: 'Tehnician mecanic',
    group: 'Tehnicieni, maeștri și asimilați',
    riskLevel: 'medium',
    requiredQualification: 'Școală postliceală tehnică',
    typicalEIP: ['cască protecție', 'mănuși', 'ochelari protecție'],
  },
  {
    code: '312101',
    name: 'Tehnician electronist',
    group: 'Tehnicieni, maeștri și asimilați',
    riskLevel: 'medium',
    requiredQualification: 'Școală postliceală tehnică',
    typicalEIP: ['mănuși dielectrice', 'ochelari protecție'],
  },
  {
    code: '313101',
    name: 'Tehnician electromecanic',
    group: 'Tehnicieni, maeștri și asimilați',
    riskLevel: 'high',
    requiredQualification: 'Școală postliceală tehnică',
    typicalEIP: ['cască protecție', 'mănuși dielectrice', 'încălțăminte dielectrică'],
  },
  {
    code: '331401',
    name: 'Contabil',
    group: 'Tehnicieni, maeștri și asimilați',
    riskLevel: 'low',
    requiredQualification: 'Studii medii economice',
    typicalEIP: [],
  },
  {
    code: '335101',
    name: 'Inspector SSM',
    group: 'Tehnicieni, maeștri și asimilați',
    riskLevel: 'medium',
    requiredQualification: 'Curs SSM autorizat',
    typicalEIP: ['cască protecție', 'încălțăminte de protecție', 'vestă reflectorizantă'],
  },

  // Group 4: Clerical support workers
  {
    code: '411001',
    name: 'Secretar',
    group: 'Funcționari administrativi',
    riskLevel: 'low',
    requiredQualification: 'Studii medii',
    typicalEIP: [],
  },
  {
    code: '412001',
    name: 'Operator introducere date',
    group: 'Funcționari administrativi',
    riskLevel: 'low',
    requiredQualification: 'Studii medii',
    typicalEIP: [],
  },
  {
    code: '419001',
    name: 'Arhivar',
    group: 'Funcționari administrativi',
    riskLevel: 'low',
    requiredQualification: 'Studii medii',
    typicalEIP: [],
  },
  {
    code: '422101',
    name: 'Casier',
    group: 'Funcționari administrativi',
    riskLevel: 'low',
    requiredQualification: 'Studii medii',
    typicalEIP: [],
  },

  // Group 5: Service and sales workers
  {
    code: '511101',
    name: 'Ospătar',
    group: 'Lucrători în domeniul serviciilor',
    riskLevel: 'low',
    requiredQualification: 'Studii generale + curs calificare',
    typicalEIP: ['mănuși', 'șorț protecție'],
  },
  {
    code: '512101',
    name: 'Bucătar',
    group: 'Lucrători în domeniul serviciilor',
    riskLevel: 'medium',
    requiredQualification: 'Școală profesională',
    typicalEIP: ['șorț protecție', 'mănuși termice', 'încălțăminte antiderapantă'],
  },
  {
    code: '516101',
    name: 'Agent de pază',
    group: 'Lucrători în domeniul serviciilor',
    riskLevel: 'medium',
    requiredQualification: 'Studii medii + curs pază',
    typicalEIP: ['vestă protecție', 'lanternă'],
  },
  {
    code: '522101',
    name: 'Vânzător',
    group: 'Lucrători în domeniul serviciilor',
    riskLevel: 'low',
    requiredQualification: 'Studii generale',
    typicalEIP: [],
  },
  {
    code: '524101',
    name: 'Operator call center',
    group: 'Lucrători în domeniul serviciilor',
    riskLevel: 'low',
    requiredQualification: 'Studii medii',
    typicalEIP: [],
  },

  // Group 6: Skilled agricultural workers
  {
    code: '611001',
    name: 'Agricultor',
    group: 'Lucrători calificați în agricultură',
    riskLevel: 'medium',
    requiredQualification: 'Studii generale',
    typicalEIP: ['mănuși', 'încălțăminte de protecție', 'pălărie'],
  },
  {
    code: '612001',
    name: 'Crescător animale',
    group: 'Lucrători calificați în agricultură',
    riskLevel: 'medium',
    requiredQualification: 'Studii generale',
    typicalEIP: ['mănuși', 'cizme protecție', 'halat lucru'],
  },

  // Group 7: Craft and related trades workers
  {
    code: '711101',
    name: 'Zidar',
    group: 'Meseriași și lucrători calificați în meserii',
    riskLevel: 'high',
    requiredQualification: 'Școală profesională',
    typicalEIP: ['cască protecție', 'mănuși', 'încălțăminte de protecție', 'centură lombară'],
  },
  {
    code: '711201',
    name: 'Tencuitor',
    group: 'Meseriași și lucrători calificați în meserii',
    riskLevel: 'high',
    requiredQualification: 'Școală profesională',
    typicalEIP: ['cască protecție', 'mănuși', 'încălțăminte de protecție', 'ochelari protecție'],
  },
  {
    code: '711301',
    name: 'Dulgher',
    group: 'Meseriași și lucrători calificați în meserii',
    riskLevel: 'high',
    requiredQualification: 'Școală profesională',
    typicalEIP: ['cască protecție', 'mănuși', 'încălțăminte de protecție', 'centură de siguranță'],
  },
  {
    code: '712101',
    name: 'Fierar betonist',
    group: 'Meseriași și lucrători calificați în meserii',
    riskLevel: 'high',
    requiredQualification: 'Școală profesională',
    typicalEIP: ['cască protecție', 'mănuși', 'încălțăminte de protecție', 'centură lombară'],
  },
  {
    code: '713101',
    name: 'Zugrav',
    group: 'Meseriași și lucrători calificați în meserii',
    riskLevel: 'medium',
    requiredQualification: 'Școală profesională',
    typicalEIP: ['mască protecție respiratorie', 'mănuși', 'ochelari protecție', 'combinezon'],
  },
  {
    code: '721101',
    name: 'Formator',
    group: 'Meseriași și lucrători calificați în meserii',
    riskLevel: 'high',
    requiredQualification: 'Școală profesională',
    typicalEIP: ['mănuși termo-rezistente', 'ochelari protecție', 'șorț din piele', 'cască protecție'],
  },
  {
    code: '721201',
    name: 'Sudor',
    group: 'Meseriași și lucrători calificați în meserii',
    riskLevel: 'very_high',
    requiredQualification: 'Școală profesională + autorizare ISCIR',
    typicalEIP: ['mască sudură', 'mănuși sudură', 'șorț din piele', 'încălțăminte de protecție', 'ecran protecție'],
  },
  {
    code: '722101',
    name: 'Potcovar',
    group: 'Meseriași și lucrători calificați în meserii',
    riskLevel: 'high',
    requiredQualification: 'Școală profesională',
    typicalEIP: ['mănuși termo-rezistente', 'șorț din piele', 'ochelari protecție', 'încălțăminte de protecție'],
  },
  {
    code: '723101',
    name: 'Strungar',
    group: 'Meseriași și lucrători calificați în meserii',
    riskLevel: 'high',
    requiredQualification: 'Școală profesională',
    typicalEIP: ['ochelari protecție', 'mănuși', 'încălțăminte de protecție', 'halat lucru'],
  },
  {
    code: '723201',
    name: 'Frezor',
    group: 'Meseriași și lucrători calificați în meserii',
    riskLevel: 'high',
    requiredQualification: 'Școală profesională',
    typicalEIP: ['ochelari protecție', 'mănuși', 'încălțăminte de protecție', 'halat lucru'],
  },
  {
    code: '723301',
    name: 'Rectificator',
    group: 'Meseriași și lucrători calificați în meserii',
    riskLevel: 'high',
    requiredQualification: 'Școală profesională',
    typicalEIP: ['ochelari protecție', 'mănuși', 'încălțăminte de protecție', 'halat lucru'],
  },
  {
    code: '731101',
    name: 'Mecanic auto',
    group: 'Meseriași și lucrători calificați în meserii',
    riskLevel: 'medium',
    requiredQualification: 'Școală profesională',
    typicalEIP: ['mănuși', 'halat lucru', 'încălțăminte de protecție'],
  },
  {
    code: '732101',
    name: 'Electrician',
    group: 'Meseriași și lucrători calificați în meserii',
    riskLevel: 'very_high',
    requiredQualification: 'Școală profesională + autorizare ANRE',
    typicalEIP: ['mănuși dielectrice', 'încălțăminte dielectrică', 'cască protecție', 'scule izolate'],
  },
  {
    code: '732201',
    name: 'Electrician electronist',
    group: 'Meseriași și lucrători calificați în meserii',
    riskLevel: 'high',
    requiredQualification: 'Școală profesională + autorizare',
    typicalEIP: ['mănuși dielectrice', 'încălțăminte dielectrică', 'ochelari protecție'],
  },
  {
    code: '741101',
    name: 'Instalator',
    group: 'Meseriași și lucrători calificați în meserii',
    riskLevel: 'high',
    requiredQualification: 'Școală profesională + autorizare ISCIR',
    typicalEIP: ['mănuși', 'încălțăminte de protecție', 'genunchiere', 'cască protecție'],
  },
  {
    code: '742101',
    name: 'Stivuitorist',
    group: 'Meseriași și lucrători calificați în meserii',
    riskLevel: 'high',
    requiredQualification: 'Permis de conducere stivuitor + autorizare ISCIR',
    typicalEIP: ['cască protecție', 'încălțăminte de protecție', 'vestă reflectorizantă'],
  },
  {
    code: '751101',
    name: 'Brutar',
    group: 'Meseriași și lucrători calificați în meserii',
    riskLevel: 'medium',
    requiredQualification: 'Școală profesională',
    typicalEIP: ['mănuși termo-rezistente', 'șorț protecție', 'încălțăminte antiderapantă'],
  },
  {
    code: '752101',
    name: 'Tâmplar',
    group: 'Meseriași și lucrători calificați în meserii',
    riskLevel: 'high',
    requiredQualification: 'Școală profesională',
    typicalEIP: ['ochelari protecție', 'mănuși', 'mască protecție respiratorie', 'căști antifonice'],
  },
  {
    code: '753101',
    name: 'Croitor',
    group: 'Meseriași și lucrători calificați în meserii',
    riskLevel: 'low',
    requiredQualification: 'Școală profesională',
    typicalEIP: ['mănuși', 'ochelari protecție'],
  },
  {
    code: '754101',
    name: 'Tamplar mobilă',
    group: 'Meseriași și lucrători calificați în meserii',
    riskLevel: 'high',
    requiredQualification: 'Școală profesională',
    typicalEIP: ['ochelari protecție', 'mănuși', 'mască protecție respiratorie', 'căști antifonice'],
  },

  // Group 8: Plant and machine operators and assemblers
  {
    code: '811101',
    name: 'Operator extracție minereuri',
    group: 'Operatori mașini și instalații',
    riskLevel: 'very_high',
    requiredQualification: 'Școală profesională + autorizare',
    typicalEIP: ['cască protecție', 'mască protecție respiratorie', 'mănuși', 'încălțăminte de protecție', 'lampa miner'],
  },
  {
    code: '812101',
    name: 'Operator instalație producție ciment',
    group: 'Operatori mașini și instalații',
    riskLevel: 'high',
    requiredQualification: 'Școală profesională',
    typicalEIP: ['mască protecție respiratorie', 'ochelari protecție', 'mănuși', 'încălțăminte de protecție'],
  },
  {
    code: '813101',
    name: 'Operator instalație chimică',
    group: 'Operatori mașini și instalații',
    riskLevel: 'very_high',
    requiredQualification: 'Școală profesională + autorizare',
    typicalEIP: ['mască protecție chimică', 'mănuși chimice', 'combinezon protecție chimică', 'ochelari protecție'],
  },
  {
    code: '815101',
    name: 'Operator mașini prelucrare lemn',
    group: 'Operatori mașini și instalații',
    riskLevel: 'high',
    requiredQualification: 'Școală profesională',
    typicalEIP: ['ochelari protecție', 'mască protecție respiratorie', 'mănuși', 'căști antifonice'],
  },
  {
    code: '817101',
    name: 'Operator linie asamblare',
    group: 'Operatori mașini și instalații',
    riskLevel: 'medium',
    requiredQualification: 'Studii generale',
    typicalEIP: ['mănuși', 'ochelari protecție', 'încălțăminte de protecție'],
  },
  {
    code: '818101',
    name: 'Macaragiu',
    group: 'Operatori mașini și instalații',
    riskLevel: 'very_high',
    requiredQualification: 'Autorizare ISCIR macaragiu',
    typicalEIP: ['cască protecție', 'mănuși', 'încălțăminte de protecție', 'vestă reflectorizantă'],
  },
  {
    code: '821101',
    name: 'Operator mașini asamblare',
    group: 'Operatori mașini și instalații',
    riskLevel: 'medium',
    requiredQualification: 'Școală profesională',
    typicalEIP: ['ochelari protecție', 'mănuși', 'încălțăminte de protecție'],
  },
  {
    code: '832101',
    name: 'Șofer autobuz',
    group: 'Operatori mașini și instalații',
    riskLevel: 'medium',
    requiredQualification: 'Permis categoria D + CPC',
    typicalEIP: ['vestă reflectorizantă', 'încălțăminte confortabilă'],
  },
  {
    code: '832201',
    name: 'Șofer autocamion',
    group: 'Operatori mașini și instalații',
    riskLevel: 'medium',
    requiredQualification: 'Permis categoria C + CPC',
    typicalEIP: ['vestă reflectorizantă', 'mănuși', 'încălțăminte de protecție'],
  },
  {
    code: '832301',
    name: 'Șofer autoturism',
    group: 'Operatori mașini și instalații',
    riskLevel: 'low',
    requiredQualification: 'Permis categoria B',
    typicalEIP: ['vestă reflectorizantă'],
  },
  {
    code: '833101',
    name: 'Tractorist',
    group: 'Operatori mașini și instalații',
    riskLevel: 'medium',
    requiredQualification: 'Permis tractor',
    typicalEIP: ['cască protecție', 'mănuși', 'încălțăminte de protecție'],
  },
  {
    code: '834101',
    name: 'Operator utilaj agricol',
    group: 'Operatori mașini și instalații',
    riskLevel: 'medium',
    requiredQualification: 'Permis utilaj + curs calificare',
    typicalEIP: ['cască protecție', 'mănuși', 'mască protecție respiratorie'],
  },
  {
    code: '834201',
    name: 'Operator buldozer',
    group: 'Operatori mașini și instalații',
    riskLevel: 'high',
    requiredQualification: 'Permis utilaj + autorizare',
    typicalEIP: ['cască protecție', 'mănuși', 'încălțăminte de protecție', 'vestă reflectorizantă'],
  },
  {
    code: '834301',
    name: 'Operator excavator',
    group: 'Operatori mașini și instalații',
    riskLevel: 'high',
    requiredQualification: 'Permis utilaj + autorizare',
    typicalEIP: ['cască protecție', 'mănuși', 'încălțăminte de protecție', 'vestă reflectorizantă'],
  },

  // Group 9: Elementary occupations
  {
    code: '911101',
    name: 'Muncitor necalificat în construcții',
    group: 'Muncitori necalificați',
    riskLevel: 'high',
    requiredQualification: 'Studii generale',
    typicalEIP: ['cască protecție', 'mănuși', 'încălțăminte de protecție', 'vestă reflectorizantă'],
  },
  {
    code: '911201',
    name: 'Muncitor necalificat în silvicultură',
    group: 'Muncitori necalificați',
    riskLevel: 'high',
    requiredQualification: 'Studii generale',
    typicalEIP: ['cască protecție', 'mănuși', 'încălțăminte de protecție', 'pantaloni protecție'],
  },
  {
    code: '921101',
    name: 'Muncitor necalificat în agricultură',
    group: 'Muncitori necalificați',
    riskLevel: 'medium',
    requiredQualification: 'Studii generale',
    typicalEIP: ['mănuși', 'încălțăminte de protecție', 'pălărie'],
  },
  {
    code: '931101',
    name: 'Muncitor necalificat în industrie',
    group: 'Muncitori necalificați',
    riskLevel: 'medium',
    requiredQualification: 'Studii generale',
    typicalEIP: ['mănuși', 'încălțăminte de protecție', 'halat lucru', 'ochelari protecție'],
  },
  {
    code: '932101',
    name: 'Ambalator manual',
    group: 'Muncitori necalificați',
    riskLevel: 'low',
    requiredQualification: 'Studii generale',
    typicalEIP: ['mănuși', 'încălțăminte de protecție'],
  },
  {
    code: '933101',
    name: 'Hamal',
    group: 'Muncitori necalificați',
    riskLevel: 'high',
    requiredQualification: 'Studii generale',
    typicalEIP: ['mănuși', 'încălțăminte de protecție', 'centură lombară'],
  },
  {
    code: '933201',
    name: 'Manipulant mărfuri',
    group: 'Muncitori necalificați',
    riskLevel: 'medium',
    requiredQualification: 'Studii generale',
    typicalEIP: ['mănuși', 'încălțăminte de protecție', 'centură lombară', 'vestă reflectorizantă'],
  },
  {
    code: '941101',
    name: 'Îngrijitor clădiri',
    group: 'Muncitori necalificați',
    riskLevel: 'low',
    requiredQualification: 'Studii generale',
    typicalEIP: ['mănuși', 'încălțăminte de protecție'],
  },
  {
    code: '941201',
    name: 'Muncitor în salubritate',
    group: 'Muncitori necalificați',
    riskLevel: 'medium',
    requiredQualification: 'Studii generale',
    typicalEIP: ['mănuși', 'încălțăminte de protecție', 'vestă reflectorizantă', 'halat lucru'],
  },
  {
    code: '941301',
    name: 'Operator curățenie',
    group: 'Muncitori necalificați',
    riskLevel: 'low',
    requiredQualification: 'Studii generale',
    typicalEIP: ['mănuși', 'încălțăminte antiderapantă'],
  },
  {
    code: '942101',
    name: 'Spălător auto',
    group: 'Muncitori necalificați',
    riskLevel: 'low',
    requiredQualification: 'Studii generale',
    typicalEIP: ['mănuși impermeabile', 'șorț impermeabil', 'cizme'],
  },
  {
    code: '951101',
    name: 'Vânzător ambulant',
    group: 'Muncitori necalificați',
    riskLevel: 'low',
    requiredQualification: 'Studii generale',
    typicalEIP: [],
  },
  {
    code: '962101',
    name: 'Colector gunoi',
    group: 'Muncitori necalificați',
    riskLevel: 'medium',
    requiredQualification: 'Studii generale',
    typicalEIP: ['mănuși', 'încălțăminte de protecție', 'vestă reflectorizantă', 'halat lucru'],
  },
  {
    code: '962201',
    name: 'Sortator deșeuri',
    group: 'Muncitori necalificați',
    riskLevel: 'medium',
    requiredQualification: 'Studii generale',
    typicalEIP: ['mănuși', 'încălțăminte de protecție', 'mască protecție respiratorie', 'halat lucru'],
  },

  // Additional important occupations
  {
    code: '216101',
    name: 'Arhitect',
    group: 'Specialiști cu ocupații intelectuale și științifice',
    riskLevel: 'low',
    requiredQualification: 'Diplomă arhitectură + autorizare',
    typicalEIP: ['cască protecție (vizite șantier)'],
  },
  {
    code: '243101',
    name: 'Manager vânzări',
    group: 'Specialiști cu ocupații intelectuale și științifice',
    riskLevel: 'low',
    requiredQualification: 'Studii superioare',
    typicalEIP: [],
  },
  {
    code: '252101',
    name: 'Administrator baze de date',
    group: 'Specialiști cu ocupații intelectuale și științifice',
    riskLevel: 'low',
    requiredQualification: 'Studii superioare informatică',
    typicalEIP: [],
  },
  {
    code: '132101',
    name: 'Manager resurse umane',
    group: 'Legislatori, înalți funcționari și conducători de unități',
    riskLevel: 'low',
    requiredQualification: 'Studii superioare',
    typicalEIP: [],
  },
  {
    code: '265101',
    name: 'Instructor SSM',
    group: 'Specialiști cu ocupații intelectuale și științifice',
    riskLevel: 'low',
    requiredQualification: 'Curs formator SSM autorizat',
    typicalEIP: [],
  },
  {
    code: '343101',
    name: 'Asistent manager',
    group: 'Tehnicieni, maeștri și asimilați',
    riskLevel: 'low',
    requiredQualification: 'Studii medii/superioare',
    typicalEIP: [],
  },
  {
    code: '722201',
    name: 'Lăcătuș mecanic',
    group: 'Meseriași și lucrători calificați în meserii',
    riskLevel: 'high',
    requiredQualification: 'Școală profesională',
    typicalEIP: ['ochelari protecție', 'mănuși', 'încălțăminte de protecție', 'halat lucru'],
  },
  {
    code: '753201',
    name: 'Confecționer textile',
    group: 'Meseriași și lucrători calificați în meserii',
    riskLevel: 'low',
    requiredQualification: 'Școală profesională',
    typicalEIP: ['mănuși', 'ochelari protecție'],
  },
];

/**
 * Search COR codes by code, name, or group
 */
export function searchCOR(query: string): CORCode[] {
  if (!query || query.trim().length === 0) {
    return corCodes;
  }

  const normalizedQuery = query.toLowerCase().trim();

  return corCodes.filter(
    (cor) =>
      cor.code.includes(normalizedQuery) ||
      cor.name.toLowerCase().includes(normalizedQuery) ||
      cor.group.toLowerCase().includes(normalizedQuery)
  );
}

/**
 * Get COR code by exact code match
 */
export function getCORByCode(code: string): CORCode | undefined {
  return corCodes.find((cor) => cor.code === code);
}

/**
 * Get all COR codes by risk level
 */
export function getCORByRiskLevel(riskLevel: RiskLevel): CORCode[] {
  return corCodes.filter((cor) => cor.riskLevel === riskLevel);
}

/**
 * Get all COR codes by group
 */
export function getCORByGroup(group: string): CORCode[] {
  return corCodes.filter((cor) => cor.group === group);
}

/**
 * Get all unique groups
 */
export function getAllGroups(): string[] {
  return Array.from(new Set(corCodes.map((cor) => cor.group)));
}
