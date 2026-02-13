/**
 * Boli profesionale conform HG 1425/2006 Anexa 22
 * Lista bolilor profesionale recunoscute în România
 */

export type BoalaProfesionalaCategory =
  | 'respiratorii'
  | 'dermatologice'
  | 'musculoscheletale'
  | 'toxice'
  | 'neurologice'
  | 'cardiovasculare'
  | 'infectioase'
  | 'cancer'
  | 'auditiv'
  | 'oftalmologice';

export type MedicalSurveillanceFrequency =
  | 'lunar'
  | 'trimestrial'
  | 'semestrial'
  | 'anual'
  | 'biennial';

export interface BoalaProfesionala {
  id: string;
  name: string;
  category: BoalaProfesionalaCategory;
  causativeAgents: string[];
  affectedCAEN: string[];
  medicalSurveillance: {
    frequency: MedicalSurveillanceFrequency;
    requiredTests: string[];
  };
  legalBasis: string;
  description?: string;
}

export const boliProfesionale: BoalaProfesionala[] = [
  // BOLI RESPIRATORII
  {
    id: 'BP001',
    name: 'Silicoza',
    category: 'respiratorii',
    causativeAgents: ['Praf de siliciu cristalin (cuarț)', 'Dioxid de siliciu'],
    affectedCAEN: ['0710', '0729', '2399', '2610', '2320', '4399'],
    medicalSurveillance: {
      frequency: 'anual',
      requiredTests: ['Radiografie pulmonară', 'Spirometrie', 'Examen clinic']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.1.01',
    description: 'Pneumoconioză cauzată de inhalarea prelungită de praf cu conținut de siliciu cristalin'
  },
  {
    id: 'BP002',
    name: 'Asbestoza',
    category: 'respiratorii',
    causativeAgents: ['Fibre de azbest', 'Praf de azbest'],
    affectedCAEN: ['2351', '4399', '4329', '3311'],
    medicalSurveillance: {
      frequency: 'anual',
      requiredTests: ['Radiografie pulmonară', 'CT toracic', 'Spirometrie', 'Markeri tumorali']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.1.02',
    description: 'Fibroză pulmonară difuză cauzată de inhalarea de fibre de azbest'
  },
  {
    id: 'BP003',
    name: 'Pneumoconioză a minerilor de cărbune',
    category: 'respiratorii',
    causativeAgents: ['Praf de cărbune', 'Praf minier'],
    affectedCAEN: ['0510', '0520', '1910'],
    medicalSurveillance: {
      frequency: 'anual',
      requiredTests: ['Radiografie pulmonară', 'Spirometrie', 'Examen clinic']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.1.03'
  },
  {
    id: 'BP004',
    name: 'Bissinoza',
    category: 'respiratorii',
    causativeAgents: ['Praf de bumbac', 'Praf de in', 'Praf de cânepă'],
    affectedCAEN: ['1310', '1392', '1393', '1394'],
    medicalSurveillance: {
      frequency: 'anual',
      requiredTests: ['Spirometrie', 'Test de provocare bronșică', 'Examen clinic']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.1.04',
    description: 'Afecțiune respiratorie cauzată de inhalarea prafului de fibre textile vegetale'
  },
  {
    id: 'BP005',
    name: 'Astm bronșic ocupațional',
    category: 'respiratorii',
    causativeAgents: ['Izocianați', 'Praf de lemn', 'Farine', 'Latex', 'Coloranți reactivi', 'Aldehide'],
    affectedCAEN: ['1610', '1620', '1071', '2053', '2120', '2220'],
    medicalSurveillance: {
      frequency: 'semestrial',
      requiredTests: ['Spirometrie', 'Test de provocare bronșică', 'IgE specifice', 'Peak-flow monitoring']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.1.05'
  },

  // BOLI DERMATOLOGICE
  {
    id: 'BP006',
    name: 'Dermatită de contact alergică',
    category: 'dermatologice',
    causativeAgents: ['Crom', 'Nichel', 'Cobalt', 'Rășini epoxidice', 'Latex', 'Dezinfectanți'],
    affectedCAEN: ['2410', '2420', '2561', '2562', '8610', '8690'],
    medicalSurveillance: {
      frequency: 'semestrial',
      requiredTests: ['Examen dermatologic', 'Patch test', 'Teste alergologice']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.2.01'
  },
  {
    id: 'BP007',
    name: 'Dermatită de contact iritativă',
    category: 'dermatologice',
    causativeAgents: ['Acizi', 'Alcalii', 'Solvenți organici', 'Detergenți', 'Uleiuri minerale'],
    affectedCAEN: ['2011', '2013', '2020', '2051', '4520', '8121'],
    medicalSurveillance: {
      frequency: 'semestrial',
      requiredTests: ['Examen dermatologic', 'Evaluare barieră cutanată']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.2.02'
  },
  {
    id: 'BP008',
    name: 'Urticarie de contact',
    category: 'dermatologice',
    causativeAgents: ['Latex', 'Proteine animale', 'Faine', 'Plante'],
    affectedCAEN: ['8610', '1071', '1051', '0141'],
    medicalSurveillance: {
      frequency: 'semestrial',
      requiredTests: ['Examen dermatologic', 'Teste alergologice', 'IgE specifice']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.2.03'
  },

  // BOLI MUSCULOSCHELETALE
  {
    id: 'BP009',
    name: 'Tendinită și tenosinovită la încheietura mâinii',
    category: 'musculoscheletale',
    causativeAgents: ['Mișcări repetitive', 'Efort fizic intens', 'Poziții forțate', 'Vibrații'],
    affectedCAEN: ['1610', '1620', '2573', '2562', '4520', '4120'],
    medicalSurveillance: {
      frequency: 'anual',
      requiredTests: ['Examen ortopedic', 'Ecografie articulară', 'Teste funcționale']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.3.01'
  },
  {
    id: 'BP010',
    name: 'Sindrom de tunel carpian',
    category: 'musculoscheletale',
    causativeAgents: ['Mișcări repetitive de flexie-extensie', 'Presiune pe încheietura mâinii', 'Vibrații'],
    affectedCAEN: ['1610', '2573', '6201', '7220', '4520'],
    medicalSurveillance: {
      frequency: 'anual',
      requiredTests: ['Examen neurologic', 'EMG', 'Teste de provocare (Phalen, Tinel)']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.3.02'
  },
  {
    id: 'BP011',
    name: 'Epicondilită',
    category: 'musculoscheletale',
    causativeAgents: ['Mișcări repetitive de pronație-supinație', 'Efort fizic intens al antebrațului'],
    affectedCAEN: ['4120', '4520', '4399', '1610'],
    medicalSurveillance: {
      frequency: 'anual',
      requiredTests: ['Examen ortopedic', 'Ecografie', 'Teste funcționale']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.3.03'
  },
  {
    id: 'BP012',
    name: 'Bursită prepatellară și infrapatellară',
    category: 'musculoscheletale',
    causativeAgents: ['Lucru în genunchi prelungit', 'Presiune repetată pe genunchi'],
    affectedCAEN: ['4120', '4330', '4333', '4399', '0161'],
    medicalSurveillance: {
      frequency: 'anual',
      requiredTests: ['Examen ortopedic', 'Ecografie', 'Radiografie']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.3.04'
  },
  {
    id: 'BP013',
    name: 'Leziuni ale meniscului',
    category: 'musculoscheletale',
    causativeAgents: ['Poziția în genunchi prelungită', 'Mișcări de răsucire', 'Efort fizic intens'],
    affectedCAEN: ['0710', '4120', '4399', '0161'],
    medicalSurveillance: {
      frequency: 'anual',
      requiredTests: ['Examen ortopedic', 'RMN genunchi', 'Teste McMurray']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.3.05'
  },

  // BOLI TOXICE
  {
    id: 'BP014',
    name: 'Intoxicație cronică cu plumb',
    category: 'toxice',
    causativeAgents: ['Plumb și compuși ai plumbului'],
    affectedCAEN: ['2410', '2442', '3832', '2612', '4677'],
    medicalSurveillance: {
      frequency: 'trimestrial',
      requiredTests: ['Plumbemie', 'Hemoleucogramă', 'ALA urinară', 'Coproporfirină urinară', 'Funcție renală']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.4.01'
  },
  {
    id: 'BP015',
    name: 'Intoxicație cronică cu mercur',
    category: 'toxice',
    causativeAgents: ['Mercur și compuși ai mercurului'],
    affectedCAEN: ['2011', '2612', '3250', '2680'],
    medicalSurveillance: {
      frequency: 'trimestrial',
      requiredTests: ['Mercur urinar', 'Mercur sanguin', 'Examen neurologic', 'Examen psihiatric', 'Funcție renală']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.4.02'
  },
  {
    id: 'BP016',
    name: 'Intoxicație cronică cu benzen',
    category: 'toxice',
    causativeAgents: ['Benzen'],
    affectedCAEN: ['1910', '2011', '4671', '4730'],
    medicalSurveillance: {
      frequency: 'trimestrial',
      requiredTests: ['Hemoleucogramă completă', 'Acid fenilmercapturic urinar', 'Examen hematologic']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.4.03'
  },
  {
    id: 'BP017',
    name: 'Intoxicație cu solvenți organici',
    category: 'toxice',
    causativeAgents: ['Toluen', 'Xilen', 'Acetonă', 'Metil-etil-cetonă', 'White spirit'],
    affectedCAEN: ['2011', '2020', '4752', '2562', '1629'],
    medicalSurveillance: {
      frequency: 'semestrial',
      requiredTests: ['Funcție hepatică', 'Funcție renală', 'Examen neurologic', 'Metaboliți urinari specifici']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.4.04'
  },
  {
    id: 'BP018',
    name: 'Intoxicație cu monoxid de carbon',
    category: 'toxice',
    causativeAgents: ['Monoxid de carbon (CO)'],
    affectedCAEN: ['2410', '2431', '2920', '4520', '0710'],
    medicalSurveillance: {
      frequency: 'semestrial',
      requiredTests: ['Carboxihemoglobină', 'Examen cardiovascular', 'Examen neurologic', 'EKG']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.4.05'
  },
  {
    id: 'BP019',
    name: 'Intoxicație cu crom hexavalent',
    category: 'toxice',
    causativeAgents: ['Compuși ai cromului hexavalent'],
    affectedCAEN: ['2410', '2561', '2562', '2573'],
    medicalSurveillance: {
      frequency: 'semestrial',
      requiredTests: ['Crom urinar', 'Funcție renală', 'Funcție hepatică', 'Examen ORL']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.4.06'
  },
  {
    id: 'BP020',
    name: 'Intoxicație cu cadmiu',
    category: 'toxice',
    causativeAgents: ['Cadmiu și compuși ai cadmiului'],
    affectedCAEN: ['2410', '2442', '2720', '2612'],
    medicalSurveillance: {
      frequency: 'semestrial',
      requiredTests: ['Cadmiu urinar', 'Beta-2-microglobulină urinară', 'Funcție renală', 'Densitometrie osoasă']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.4.07'
  },

  // BOLI NEUROLOGICE
  {
    id: 'BP021',
    name: 'Polineuropatie toxică',
    category: 'neurologice',
    causativeAgents: ['Plumb', 'Mercur', 'Solvenți organici', 'Arsenic', 'n-Hexan'],
    affectedCAEN: ['2011', '2020', '2410', '2612'],
    medicalSurveillance: {
      frequency: 'semestrial',
      requiredTests: ['Examen neurologic', 'EMG', 'Electroneurografie', 'Biomarkeri toxici']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.5.01'
  },
  {
    id: 'BP022',
    name: 'Sindrom de vibrații mână-braț',
    category: 'neurologice',
    causativeAgents: ['Vibrații transmise la mână-braț'],
    affectedCAEN: ['0710', '1610', '2562', '2573', '4120', '4399'],
    medicalSurveillance: {
      frequency: 'anual',
      requiredTests: ['Examen neurologic', 'Teste sensibilitate vibratorie', 'Termografie', 'Doppler vascular']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.5.02'
  },
  {
    id: 'BP023',
    name: 'Encefalopatie toxică cronică',
    category: 'neurologice',
    causativeAgents: ['Solvenți organici', 'Plumb', 'Mercur', 'Monoxid de carbon'],
    affectedCAEN: ['2011', '2020', '2410', '4752'],
    medicalSurveillance: {
      frequency: 'anual',
      requiredTests: ['Examen neuropsihologic', 'EEG', 'RMN cerebral', 'Biomarkeri toxici']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.5.03'
  },

  // BOLI CARDIOVASCULARE
  {
    id: 'BP024',
    name: 'Boală cardiovasculară indusă de zgomot',
    category: 'cardiovasculare',
    causativeAgents: ['Zgomot > 85 dB(A) expunere prelungită'],
    affectedCAEN: ['2410', '2431', '2511', '2920', '4120'],
    medicalSurveillance: {
      frequency: 'anual',
      requiredTests: ['Examen cardiovascular', 'EKG', 'Tensiune arterială', 'Audiogramă', 'Ecografie cardiacă']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.6.01'
  },
  {
    id: 'BP025',
    name: 'Fenomenul Raynaud ocupațional',
    category: 'cardiovasculare',
    causativeAgents: ['Vibrații transmise la mână', 'Clorură de vinil', 'Expunere la frig'],
    affectedCAEN: ['0710', '1610', '2220', '2573', '4120'],
    medicalSurveillance: {
      frequency: 'anual',
      requiredTests: ['Examen vascular', 'Doppler arterial', 'Test la frig', 'Capilaroscopie']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.6.02'
  },

  // BOLI INFECTIOASE
  {
    id: 'BP026',
    name: 'Tuberculoză ocupațională',
    category: 'infectioase',
    causativeAgents: ['Mycobacterium tuberculosis'],
    affectedCAEN: ['8610', '8690', '8710', '8720', '8730'],
    medicalSurveillance: {
      frequency: 'anual',
      requiredTests: ['Radiografie pulmonară', 'Test Mantoux/IGRA', 'Examen clinic', 'Examen spută dacă e cazul']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.7.01'
  },
  {
    id: 'BP027',
    name: 'Hepatită virală ocupațională (B și C)',
    category: 'infectioase',
    causativeAgents: ['Virus hepatitic B', 'Virus hepatitic C'],
    affectedCAEN: ['8610', '8690', '8621', '8622'],
    medicalSurveillance: {
      frequency: 'anual',
      requiredTests: ['Markeri virali HBV/HCV', 'Transaminaze', 'Funcție hepatică', 'Ecografie abdominală']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.7.02'
  },
  {
    id: 'BP028',
    name: 'HIV/SIDA ocupațional',
    category: 'infectioase',
    causativeAgents: ['Virus imunodeficiență umană (HIV)'],
    affectedCAEN: ['8610', '8690', '8621', '8622'],
    medicalSurveillance: {
      frequency: 'trimestrial',
      requiredTests: ['Test HIV', 'CD4 count', 'Viral load', 'Examen clinic complet']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.7.03'
  },
  {
    id: 'BP029',
    name: 'Bruceloză',
    category: 'infectioase',
    causativeAgents: ['Brucella spp.'],
    affectedCAEN: ['0141', '0142', '1011', '1012', '7500'],
    medicalSurveillance: {
      frequency: 'anual',
      requiredTests: ['Teste serologice Brucella', 'Hemoleucogramă', 'Examen clinic']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.7.04'
  },
  {
    id: 'BP030',
    name: 'Leptospiroză',
    category: 'infectioase',
    causativeAgents: ['Leptospira spp.'],
    affectedCAEN: ['0141', '0161', '3600', '3700', '3811'],
    medicalSurveillance: {
      frequency: 'anual',
      requiredTests: ['Teste serologice Leptospira', 'Funcție renală', 'Funcție hepatică', 'Examen clinic']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.7.05'
  },

  // CANCER OCUPAȚIONAL
  {
    id: 'BP031',
    name: 'Cancer pulmonar indus de azbest',
    category: 'cancer',
    causativeAgents: ['Fibre de azbest'],
    affectedCAEN: ['2351', '4329', '4399', '3311'],
    medicalSurveillance: {
      frequency: 'anual',
      requiredTests: ['CT toracic', 'Radiografie pulmonară', 'Markeri tumorali', 'Examen clinic']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.8.01'
  },
  {
    id: 'BP032',
    name: 'Mezoteliom pleural',
    category: 'cancer',
    causativeAgents: ['Fibre de azbest'],
    affectedCAEN: ['2351', '4329', '4399', '3311'],
    medicalSurveillance: {
      frequency: 'anual',
      requiredTests: ['CT toracic', 'Markeri tumorali (mesotelină)', 'Biopsie dacă e cazul']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.8.02'
  },
  {
    id: 'BP033',
    name: 'Leucemie indusă de benzen',
    category: 'cancer',
    causativeAgents: ['Benzen'],
    affectedCAEN: ['1910', '2011', '4671'],
    medicalSurveillance: {
      frequency: 'trimestrial',
      requiredTests: ['Hemoleucogramă completă', 'Frotiu sanguin', 'Examen hematologic', 'Medulogramă dacă e cazul']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.8.03'
  },
  {
    id: 'BP034',
    name: 'Cancer vezică urinară (amine aromatice)',
    category: 'cancer',
    causativeAgents: ['Benzidină', '2-Naftilamină', '4-Aminobifenil', 'Coloranți azo'],
    affectedCAEN: ['2012', '2013', '2030', '2051'],
    medicalSurveillance: {
      frequency: 'anual',
      requiredTests: ['Citologie urinară', 'Ecografie renală/vezicală', 'Markeri tumorali urinari']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.8.04'
  },
  {
    id: 'BP035',
    name: 'Cancer nazal și sinusuri paranazale',
    category: 'cancer',
    causativeAgents: ['Praf de lemn dur', 'Praf de nichel', 'Compuși ai cromului hexavalent'],
    affectedCAEN: ['1610', '1621', '1622', '3102', '2410'],
    medicalSurveillance: {
      frequency: 'anual',
      requiredTests: ['Examen ORL', 'Endoscopie nazală', 'CT sinusuri', 'Biopsie dacă e cazul']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.8.05'
  },

  // BOLI AUDITIV
  {
    id: 'BP036',
    name: 'Hipoacuzie neurosenzorială indusă de zgomot',
    category: 'auditiv',
    causativeAgents: ['Zgomot > 85 dB(A) expunere prelungită'],
    affectedCAEN: ['2410', '2511', '2562', '2920', '4120', '1610'],
    medicalSurveillance: {
      frequency: 'anual',
      requiredTests: ['Audiogramă tonală', 'Audiogramă vocală', 'Impedanțometrie', 'Otoemisiuni acustice']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.9.01'
  },
  {
    id: 'BP037',
    name: 'Traumă acustică acută',
    category: 'auditiv',
    causativeAgents: ['Zgomot impulsiv > 140 dB'],
    affectedCAEN: ['0710', '2410', '2511', '2540', '2920'],
    medicalSurveillance: {
      frequency: 'semestrial',
      requiredTests: ['Audiogramă tonală', 'Examen ORL', 'Impedanțometrie']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.9.02'
  },

  // BOLI OFTALMOLOGICE
  {
    id: 'BP038',
    name: 'Cataractă indusă de radiații',
    category: 'oftalmologice',
    causativeAgents: ['Radiații ionizante', 'Radiații infraroșii', 'Microunde'],
    affectedCAEN: ['2410', '2431', '2511', '8610', '7112'],
    medicalSurveillance: {
      frequency: 'anual',
      requiredTests: ['Examen oftalmologic complet', 'Lampă cu fantă', 'Acuitate vizuală', 'Presiune intraoculară']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.10.01'
  },
  {
    id: 'BP039',
    name: 'Conjunctivită și keratită chimică',
    category: 'oftalmologice',
    causativeAgents: ['Acizi', 'Alcalii', 'Solvenți organici', 'Vapori iritanți'],
    affectedCAEN: ['2011', '2013', '2020', '2051', '2059'],
    medicalSurveillance: {
      frequency: 'semestrial',
      requiredTests: ['Examen oftalmologic', 'Lampă cu fantă', 'Test Schirmer', 'Acuitate vizuală']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.10.02'
  },
  {
    id: 'BP040',
    name: 'Leziuni retiniene induse de laser',
    category: 'oftalmologice',
    causativeAgents: ['Radiații laser'],
    affectedCAEN: ['2610', '2630', '2670', '7112', '8610'],
    medicalSurveillance: {
      frequency: 'anual',
      requiredTests: ['Examen oftalmologic', 'Fond de ochi', 'OCT retină', 'Câmp vizual', 'Acuitate vizuală']
    },
    legalBasis: 'HG 1425/2006 Anexa 22, poz. 1.10.03'
  }
];

/**
 * Helper functions pentru căutare și filtrare
 */

export function getBoalaProfesionalaById(id: string): BoalaProfesionala | undefined {
  return boliProfesionale.find(boala => boala.id === id);
}

export function getBoliProfesionaleByCategory(category: BoalaProfesionalaCategory): BoalaProfesionala[] {
  return boliProfesionale.filter(boala => boala.category === category);
}

export function getBoliProfesionaleByCAEN(caenCode: string): BoalaProfesionala[] {
  return boliProfesionale.filter(boala =>
    boala.affectedCAEN.some(code => code.startsWith(caenCode))
  );
}

export function getBoliProfesionaleByAgent(agent: string): BoalaProfesionala[] {
  const searchTerm = agent.toLowerCase();
  return boliProfesionale.filter(boala =>
    boala.causativeAgents.some(a => a.toLowerCase().includes(searchTerm))
  );
}

export const categorii: { value: BoalaProfesionalaCategory; label: string }[] = [
  { value: 'respiratorii', label: 'Boli respiratorii' },
  { value: 'dermatologice', label: 'Boli dermatologice' },
  { value: 'musculoscheletale', label: 'Boli musculoscheletale' },
  { value: 'toxice', label: 'Intoxicații profesionale' },
  { value: 'neurologice', label: 'Boli neurologice' },
  { value: 'cardiovasculare', label: 'Boli cardiovasculare' },
  { value: 'infectioase', label: 'Boli infecțioase' },
  { value: 'cancer', label: 'Cancer ocupațional' },
  { value: 'auditiv', label: 'Boli auditiv' },
  { value: 'oftalmologice', label: 'Boli oftalmologice' }
];
