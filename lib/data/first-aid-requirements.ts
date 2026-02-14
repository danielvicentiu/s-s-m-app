/**
 * First Aid Requirements for Romanian Companies
 * Based on Romanian SSM legislation (Legea 319/2006, HG 1425/2006)
 */

export interface FirstAidRequirement {
  companySize: string;
  minFirstAiders: number;
  kitType: string;
  kitContents: string[];
  trainingRequired: string;
  refreshInterval: number; // months
  legalBasis: string;
}

export const FIRST_AID_REQUIREMENTS: FirstAidRequirement[] = [
  {
    companySize: 'sub 10 angajați',
    minFirstAiders: 1,
    kitType: 'Trusă standard de prim ajutor',
    kitContents: [
      'Comprese sterile (diverse dimensiuni)',
      'Bandaje elastice',
      'Leucoplast',
      'Foarfecă medicală',
      'Mănuși sterile de unică folosință',
      'Soluție dezinfectantă',
      'Termometru',
      'Ace de siguranță',
      'Pansamente adezive',
      'Truse pentru arsuri minore',
      'Soluție salină pentru spălat ochi',
      'Folie termică',
      'Manual prim ajutor',
    ],
    trainingRequired: 'Curs prim ajutor atestat (minim 8 ore)',
    refreshInterval: 24,
    legalBasis: 'HG 1425/2006, art. 18-20',
  },
  {
    companySize: '10-50 angajați',
    minFirstAiders: 2,
    kitType: 'Trusă standard + dispozitive suplimentare',
    kitContents: [
      'Comprese sterile (diverse dimensiuni)',
      'Bandaje elastice (4-6-8 cm)',
      'Bandaje triunghiulare',
      'Leucoplast hipoalergenic',
      'Foarfecă medicală și pensetă',
      'Mănuși sterile (multiple perechi)',
      'Soluție dezinfectantă (200-500ml)',
      'Termometru digital',
      'Ace de siguranță',
      'Pansamente adezive (diverse dimensiuni)',
      'Truse pentru arsuri (comprese gelifiante)',
      'Soluție salină 500ml',
      'Folie termică de urgență',
      'Coladă cervicală (pentru imobilizare)',
      'RCP mask/shield',
      'Gheață instant',
      'Manual prim ajutor',
      'Lista de telefoane urgență',
    ],
    trainingRequired: 'Curs prim ajutor atestat (minim 16 ore)',
    refreshInterval: 24,
    legalBasis: 'HG 1425/2006, art. 18-20; Legea 319/2006',
  },
  {
    companySize: '50-150 angajați',
    minFirstAiders: 3,
    kitType: 'Trusă avansată + cabinet medical (recomandat)',
    kitContents: [
      'Comprese sterile (toate dimensiunile)',
      'Bandaje elastice și triunghiulare',
      'Leucoplast și plasturi textili',
      'Set chirurgical (foarfecă, pensetă, ace)',
      'Mănuși sterile (50+ perechi)',
      'Soluție dezinfectantă (1L+)',
      'Termometre digitale (2 buc)',
      'Pansamente adezive și hidrocoloidale',
      'Truse arsuri extinse',
      'Soluție salină 1000ml',
      'Foi termice',
      'Coladă cervicală și atele',
      'RCP mask profesional',
      'DEA (defibrilator extern automat) - recomandat',
      'Gheață instant (multiple)',
      'Kit pentru răni hemoragice',
      'Tensometru digital',
      'Glucometru',
      'Tăvi pentru instrumente sterile',
      'Manual prim ajutor și protocoale',
      'Registru intervenții prim ajutor',
    ],
    trainingRequired: 'Curs prim ajutor avansat (24 ore) + recertificare anuală',
    refreshInterval: 12,
    legalBasis: 'HG 1425/2006; Ordinul MS 1030/2009',
  },
  {
    companySize: '150-500 angajați',
    minFirstAiders: 5,
    kitType: 'Cabinet medical obligatoriu cu asistent medical',
    kitContents: [
      'Echipament complet cabinet medical',
      'Trusă urgență extinsă (tip ambulanță)',
      'DEA (defibrilator extern automat) - OBLIGATORIU',
      'Targă rigidă pentru imobilizare',
      'Coladă cervicală și atele diverse',
      'Mănuși, comprese, bandaje (stoc mare)',
      'Soluții dezinfectante și saline (stoc mare)',
      'Medicamente de urgență (conform protocol)',
      'Kit hemoragie severă cu garouri',
      'Oxigen medical portabil',
      'Set intubație (doar personal calificat)',
      'Tensometru profesional',
      'Glucometru și benzi reactive',
      'Termometre medicale',
      'RCP mask profesional și ambu bag',
      'Truse arsuri grave',
      'Pansamente speciale (hidrocoloidale, alginat)',
      'Material suturare (doar asistent/medic)',
      'Dulapuri securizate pentru medicamente',
      'Registre și protocoale complete',
      'Sistem comunicare urgență (112)',
    ],
    trainingRequired: 'Asistent medical angajat + echipă prim ajutor (curs 40 ore)',
    refreshInterval: 12,
    legalBasis: 'HG 1425/2006, art. 21; Legea 95/2006 (Sănătate)',
  },
  {
    companySize: 'peste 500 angajați',
    minFirstAiders: 8,
    kitType: 'Cabinet medical cu medic de medicina muncii',
    kitContents: [
      'Echipament medical complet (grad ambulatoriu)',
      'Multiple truse urgență (distribuite în locații)',
      'DEA (defibrilator) - OBLIGATORIU (minim 1, recomandat 2+)',
      'Tărgi rigide și pliabile',
      'Scaune rulante',
      'Echipament imobilizare completă',
      'Stoc extins materiale consumabile',
      'Medicamente urgență (stoc reglementat)',
      'Oxigen medical (instalație fixă + portabil)',
      'Monitor funcții vitale',
      'EKG portabil',
      'Set reanimare profesional',
      'Aspirator secretii',
      'Kit hemoragie masivă',
      'Truse arsuri și traumatisme',
      'Laborator analize de bază',
      'Frigider pentru medicamente',
      'Dulap medicamente controlate (securizat)',
      'Sistem alertă medicală',
      'Conexiune directă 112/SMURD',
      'Registre medicale complete',
      'Protocol urgențe medicale aprobat',
      'Plan evacuare medicală',
    ],
    trainingRequired: 'Medic medicina muncii + asistent medical + echipă prim ajutor (50 ore)',
    refreshInterval: 6,
    legalBasis: 'HG 1425/2006; Legea 319/2006; Ordinul MS 1030/2009',
  },
];

/**
 * Get first aid requirements based on employee count
 * @param employeeCount - Number of employees in the company
 * @returns FirstAidRequirement object for the company size
 */
export function getFirstAidRequirements(
  employeeCount: number
): FirstAidRequirement {
  if (employeeCount < 10) {
    return FIRST_AID_REQUIREMENTS[0];
  } else if (employeeCount >= 10 && employeeCount < 50) {
    return FIRST_AID_REQUIREMENTS[1];
  } else if (employeeCount >= 50 && employeeCount < 150) {
    return FIRST_AID_REQUIREMENTS[2];
  } else if (employeeCount >= 150 && employeeCount < 500) {
    return FIRST_AID_REQUIREMENTS[3];
  } else {
    return FIRST_AID_REQUIREMENTS[4];
  }
}

/**
 * Check if company meets minimum first aid requirements
 * @param employeeCount - Number of employees
 * @param currentFirstAiders - Current number of trained first aiders
 * @returns Object with compliance status and details
 */
export function checkFirstAidCompliance(
  employeeCount: number,
  currentFirstAiders: number
): {
  isCompliant: boolean;
  requirements: FirstAidRequirement;
  missingFirstAiders: number;
} {
  const requirements = getFirstAidRequirements(employeeCount);
  const missingFirstAiders = Math.max(
    0,
    requirements.minFirstAiders - currentFirstAiders
  );

  return {
    isCompliant: currentFirstAiders >= requirements.minFirstAiders,
    requirements,
    missingFirstAiders,
  };
}
