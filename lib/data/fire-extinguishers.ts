/**
 * Fire Extinguishers Database
 *
 * Comprehensive database of fire extinguisher types with technical specifications,
 * fire class ratings, operational parameters, and placement requirements.
 *
 * Based on Romanian and European fire safety standards (PSI).
 */

export type FireClass = 'A' | 'B' | 'C' | 'D' | 'F';

export interface FireExtinguisherType {
  id: string;
  name: string;
  nameRO: string;
  type: 'powder' | 'co2' | 'foam' | 'water' | 'halotron' | 'wet_chemical';

  // Fire class effectiveness
  fireClasses: {
    class: FireClass;
    effectiveness: 'excellent' | 'good' | 'suitable' | 'not_recommended';
    rating: string; // e.g., "21A", "144B", "75F"
  }[];

  // Technical specifications
  specifications: {
    capacityKg: number[];
    capacityLiters?: number[];
    operatingTimeSeconds: number;
    effectiveRangeMeters: number;
    operatingTemperatureMin: number;
    operatingTemperatureMax: number;
    pressureBar: number;
    weightKg: number[];
  };

  // Maintenance and inspection
  maintenance: {
    inspectionFrequencyMonths: number;
    hydrostaticTestYears: number;
    refillAfterUse: boolean;
    averageLifespanYears: number;
  };

  // Placement requirements
  placement: {
    maxCoverageAreaSqm: number;
    maxDistanceToExtinguisher: number; // meters
    heightFromFloorCm: {
      min: number;
      max: number;
    };
    quantityPerArea: {
      areaSqm: number;
      minUnits: number;
    }[];
  };

  // Safety and usage
  safety: {
    conductiveAgent: boolean; // Can conduct electricity
    environmentalConcerns: string[];
    suitableForEnclosedSpaces: boolean;
    residueLevel: 'none' | 'minimal' | 'moderate' | 'high';
  };

  // Applications
  applications: {
    recommended: string[];
    notRecommended: string[];
  };

  description: string;
  descriptionRO: string;
}

export const fireExtinguishers: FireExtinguisherType[] = [
  {
    id: 'powder-abc',
    name: 'ABC Dry Powder',
    nameRO: 'Pulbere ABC',
    type: 'powder',
    fireClasses: [
      { class: 'A', effectiveness: 'excellent', rating: '21A' },
      { class: 'B', effectiveness: 'excellent', rating: '144B' },
      { class: 'C', effectiveness: 'excellent', rating: 'C' },
      { class: 'D', effectiveness: 'not_recommended', rating: '-' },
      { class: 'F', effectiveness: 'not_recommended', rating: '-' }
    ],
    specifications: {
      capacityKg: [1, 2, 3, 4, 6, 9, 12],
      operatingTimeSeconds: 12,
      effectiveRangeMeters: 5,
      operatingTemperatureMin: -30,
      operatingTemperatureMax: 60,
      pressureBar: 15,
      weightKg: [2.5, 4, 5.5, 7, 10, 14, 18]
    },
    maintenance: {
      inspectionFrequencyMonths: 12,
      hydrostaticTestYears: 5,
      refillAfterUse: true,
      averageLifespanYears: 20
    },
    placement: {
      maxCoverageAreaSqm: 200,
      maxDistanceToExtinguisher: 25,
      heightFromFloorCm: {
        min: 80,
        max: 150
      },
      quantityPerArea: [
        { areaSqm: 200, minUnits: 1 },
        { areaSqm: 500, minUnits: 3 },
        { areaSqm: 1000, minUnits: 5 }
      ]
    },
    safety: {
      conductiveAgent: false,
      environmentalConcerns: ['Creates dust cloud', 'Difficult cleanup', 'May damage sensitive equipment'],
      suitableForEnclosedSpaces: false,
      residueLevel: 'high'
    },
    applications: {
      recommended: [
        'Birouri generale',
        'Depozite',
        'Garaje și ateliere',
        'Spații comerciale',
        'Zone de producție',
        'Școli și instituții publice'
      ],
      notRecommended: [
        'Bucătării profesionale',
        'Camere server',
        'Laboratoare',
        'Spații cu echipamente sensibile',
        'Zone cu incendii de metale'
      ]
    },
    description: 'Multi-purpose dry powder extinguisher suitable for most common fire types',
    descriptionRO: 'Stingător universal cu pulbere chimică, potrivit pentru majoritatea tipurilor de incendii'
  },
  {
    id: 'co2',
    name: 'Carbon Dioxide (CO2)',
    nameRO: 'Dioxid de Carbon (CO2)',
    type: 'co2',
    fireClasses: [
      { class: 'A', effectiveness: 'not_recommended', rating: '-' },
      { class: 'B', effectiveness: 'excellent', rating: '89B' },
      { class: 'C', effectiveness: 'excellent', rating: 'C' },
      { class: 'D', effectiveness: 'not_recommended', rating: '-' },
      { class: 'F', effectiveness: 'not_recommended', rating: '-' }
    ],
    specifications: {
      capacityKg: [2, 5, 10, 20, 30, 50],
      operatingTimeSeconds: 10,
      effectiveRangeMeters: 2,
      operatingTemperatureMin: -30,
      operatingTemperatureMax: 60,
      pressureBar: 60,
      weightKg: [6, 14, 24, 44, 64, 104]
    },
    maintenance: {
      inspectionFrequencyMonths: 12,
      hydrostaticTestYears: 10,
      refillAfterUse: true,
      averageLifespanYears: 25
    },
    placement: {
      maxCoverageAreaSqm: 150,
      maxDistanceToExtinguisher: 15,
      heightFromFloorCm: {
        min: 80,
        max: 150
      },
      quantityPerArea: [
        { areaSqm: 150, minUnits: 1 },
        { areaSqm: 400, minUnits: 3 },
        { areaSqm: 800, minUnits: 5 }
      ]
    },
    safety: {
      conductiveAgent: false,
      environmentalConcerns: ['Displacement of oxygen in enclosed spaces', 'Cold discharge (-78°C)', 'Risk of frostbite'],
      suitableForEnclosedSpaces: false,
      residueLevel: 'none'
    },
    applications: {
      recommended: [
        'Camere server și IT',
        'Echipamente electrice',
        'Laboratoare',
        'Spații cu aparatură sensibilă',
        'Birouri cu electronice',
        'Centrale telefonice'
      ],
      notRecommended: [
        'Incendii de hârtie/lemn',
        'Bucătării profesionale',
        'Spații foarte mici închise',
        'Zone cu metale reactive',
        'Materiale adânc încorporate'
      ]
    },
    description: 'Clean agent extinguisher ideal for electrical fires and sensitive equipment',
    descriptionRO: 'Stingător cu agent curat, ideal pentru incendii electrice și echipamente sensibile'
  },
  {
    id: 'foam-ab',
    name: 'Foam (AFFF)',
    nameRO: 'Spumă (AFFF)',
    type: 'foam',
    fireClasses: [
      { class: 'A', effectiveness: 'excellent', rating: '21A' },
      { class: 'B', effectiveness: 'excellent', rating: '144B' },
      { class: 'C', effectiveness: 'not_recommended', rating: '-' },
      { class: 'D', effectiveness: 'not_recommended', rating: '-' },
      { class: 'F', effectiveness: 'not_recommended', rating: '-' }
    ],
    specifications: {
      capacityLiters: [2, 3, 6, 9, 25, 50],
      operatingTimeSeconds: 20,
      effectiveRangeMeters: 6,
      operatingTemperatureMin: 5,
      operatingTemperatureMax: 60,
      pressureBar: 12,
      weightKg: [4, 6, 12, 18, 35, 70]
    },
    maintenance: {
      inspectionFrequencyMonths: 12,
      hydrostaticTestYears: 5,
      refillAfterUse: true,
      averageLifespanYears: 15
    },
    placement: {
      maxCoverageAreaSqm: 200,
      maxDistanceToExtinguisher: 25,
      heightFromFloorCm: {
        min: 80,
        max: 150
      },
      quantityPerArea: [
        { areaSqm: 200, minUnits: 1 },
        { areaSqm: 500, minUnits: 3 },
        { areaSqm: 1000, minUnits: 5 }
      ]
    },
    safety: {
      conductiveAgent: true,
      environmentalConcerns: ['Contains water - conducts electricity', 'PFAS chemicals in AFFF', 'Requires cleanup'],
      suitableForEnclosedSpaces: true,
      residueLevel: 'moderate'
    },
    applications: {
      recommended: [
        'Stații de carburanți',
        'Depozite de combustibili',
        'Ateliere auto',
        'Zone de stocare lichide inflamabile',
        'Hangare aeronave',
        'Facilități petroliere'
      ],
      notRecommended: [
        'Echipamente electrice sub tensiune',
        'Bucătării profesionale',
        'Camere server',
        'Zone cu temperaturi sub 5°C',
        'Incendii de metale'
      ]
    },
    description: 'Foam extinguisher excellent for liquid fires and surface fires',
    descriptionRO: 'Stingător cu spumă, excelent pentru incendii de lichide și incendii de suprafață'
  },
  {
    id: 'water',
    name: 'Water',
    nameRO: 'Apă',
    type: 'water',
    fireClasses: [
      { class: 'A', effectiveness: 'excellent', rating: '13A' },
      { class: 'B', effectiveness: 'not_recommended', rating: '-' },
      { class: 'C', effectiveness: 'not_recommended', rating: '-' },
      { class: 'D', effectiveness: 'not_recommended', rating: '-' },
      { class: 'F', effectiveness: 'not_recommended', rating: '-' }
    ],
    specifications: {
      capacityLiters: [6, 9, 50],
      operatingTimeSeconds: 60,
      effectiveRangeMeters: 8,
      operatingTemperatureMin: 5,
      operatingTemperatureMax: 60,
      pressureBar: 10,
      weightKg: [10, 14, 60]
    },
    maintenance: {
      inspectionFrequencyMonths: 12,
      hydrostaticTestYears: 5,
      refillAfterUse: true,
      averageLifespanYears: 15
    },
    placement: {
      maxCoverageAreaSqm: 200,
      maxDistanceToExtinguisher: 25,
      heightFromFloorCm: {
        min: 80,
        max: 150
      },
      quantityPerArea: [
        { areaSqm: 200, minUnits: 1 },
        { areaSqm: 500, minUnits: 3 },
        { areaSqm: 1000, minUnits: 5 }
      ]
    },
    safety: {
      conductiveAgent: true,
      environmentalConcerns: ['Conducts electricity - dangerous for electrical fires', 'Can freeze in cold temperatures', 'Water damage to property'],
      suitableForEnclosedSpaces: true,
      residueLevel: 'minimal'
    },
    applications: {
      recommended: [
        'Incendii de hârtie',
        'Incendii de lemn',
        'Incendii de textile',
        'Biblioteci',
        'Depozite de materiale solide',
        'Zone de producție lemn'
      ],
      notRecommended: [
        'Echipamente electrice',
        'Incendii de lichide inflamabile',
        'Bucătării profesionale',
        'Zone cu metale reactive',
        'Spații cu temperaturi sub 5°C',
        'Incendii chimice'
      ]
    },
    description: 'Simple and effective for common combustible materials like wood, paper, and textiles',
    descriptionRO: 'Simplu și eficient pentru materiale combustibile comune precum lemn, hârtie și textile'
  },
  {
    id: 'halotron',
    name: 'Halotron I (Clean Agent)',
    nameRO: 'Halotron I (Agent Curat)',
    type: 'halotron',
    fireClasses: [
      { class: 'A', effectiveness: 'good', rating: '4A' },
      { class: 'B', effectiveness: 'excellent', rating: '89B' },
      { class: 'C', effectiveness: 'excellent', rating: 'C' },
      { class: 'D', effectiveness: 'not_recommended', rating: '-' },
      { class: 'F', effectiveness: 'not_recommended', rating: '-' }
    ],
    specifications: {
      capacityKg: [2.7, 5.4, 11],
      operatingTimeSeconds: 15,
      effectiveRangeMeters: 4,
      operatingTemperatureMin: -18,
      operatingTemperatureMax: 49,
      pressureBar: 14,
      weightKg: [6, 12, 24]
    },
    maintenance: {
      inspectionFrequencyMonths: 12,
      hydrostaticTestYears: 12,
      refillAfterUse: true,
      averageLifespanYears: 20
    },
    placement: {
      maxCoverageAreaSqm: 150,
      maxDistanceToExtinguisher: 15,
      heightFromFloorCm: {
        min: 80,
        max: 150
      },
      quantityPerArea: [
        { areaSqm: 150, minUnits: 1 },
        { areaSqm: 400, minUnits: 3 },
        { areaSqm: 800, minUnits: 5 }
      ]
    },
    safety: {
      conductiveAgent: false,
      environmentalConcerns: ['Low ozone depletion potential', 'Environmentally friendlier than Halon', 'Minimal atmospheric impact'],
      suitableForEnclosedSpaces: true,
      residueLevel: 'none'
    },
    applications: {
      recommended: [
        'Centre de date',
        'Muzee și galerii',
        'Biblioteci cu documente valoroase',
        'Echipamente medicale',
        'Aviație',
        'Vehicule de lux',
        'Spații cu echipamente scumpe'
      ],
      notRecommended: [
        'Bucătării profesionale',
        'Incendii de metale reactive',
        'Spații foarte mari deschise',
        'Zone cu incendii adânci de Clasa A'
      ]
    },
    description: 'Premium clean agent extinguisher with no residue, ideal for high-value equipment',
    descriptionRO: 'Stingător premium cu agent curat fără reziduuri, ideal pentru echipamente de valoare'
  },
  {
    id: 'wet-chemical',
    name: 'Wet Chemical (Class F/K)',
    nameRO: 'Agent Chimic Umed (Clasa F)',
    type: 'wet_chemical',
    fireClasses: [
      { class: 'A', effectiveness: 'good', rating: '13A' },
      { class: 'B', effectiveness: 'suitable', rating: '75B' },
      { class: 'C', effectiveness: 'not_recommended', rating: '-' },
      { class: 'D', effectiveness: 'not_recommended', rating: '-' },
      { class: 'F', effectiveness: 'excellent', rating: '75F' }
    ],
    specifications: {
      capacityLiters: [2, 3, 6, 9],
      operatingTimeSeconds: 20,
      effectiveRangeMeters: 3,
      operatingTemperatureMin: 5,
      operatingTemperatureMax: 60,
      pressureBar: 10,
      weightKg: [4, 6, 12, 18]
    },
    maintenance: {
      inspectionFrequencyMonths: 12,
      hydrostaticTestYears: 5,
      refillAfterUse: true,
      averageLifespanYears: 15
    },
    placement: {
      maxCoverageAreaSqm: 100,
      maxDistanceToExtinguisher: 10,
      heightFromFloorCm: {
        min: 80,
        max: 120
      },
      quantityPerArea: [
        { areaSqm: 100, minUnits: 1 },
        { areaSqm: 250, minUnits: 2 },
        { areaSqm: 500, minUnits: 4 }
      ]
    },
    safety: {
      conductiveAgent: true,
      environmentalConcerns: ['Contains potassium acetate solution', 'Requires cleanup', 'Slippery residue'],
      suitableForEnclosedSpaces: true,
      residueLevel: 'moderate'
    },
    applications: {
      recommended: [
        'Bucătării comerciale',
        'Restaurante',
        'Cantinele',
        'Fast-food',
        'Hoteluri - zone de gătit',
        'Spații cu friteuze',
        'Zone de preparare alimente'
      ],
      notRecommended: [
        'Echipamente electrice',
        'Incendii de metale',
        'Zone fără grăsimi animale/vegetale',
        'Spații industriale generale',
        'Depozite'
      ]
    },
    description: 'Specialized extinguisher for cooking oil and grease fires in commercial kitchens',
    descriptionRO: 'Stingător specializat pentru incendii cu uleiuri și grăsimi în bucătării profesionale'
  }
];

/**
 * Get fire extinguisher by ID
 */
export function getFireExtinguisherById(id: string): FireExtinguisherType | undefined {
  return fireExtinguishers.find(ext => ext.id === id);
}

/**
 * Get fire extinguishers suitable for a specific fire class
 */
export function getExtinguishersByFireClass(
  fireClass: FireClass,
  minEffectiveness: 'suitable' | 'good' | 'excellent' = 'suitable'
): FireExtinguisherType[] {
  const effectivenessOrder = {
    'not_recommended': 0,
    'suitable': 1,
    'good': 2,
    'excellent': 3
  };

  const minLevel = effectivenessOrder[minEffectiveness];

  return fireExtinguishers.filter(ext => {
    const classRating = ext.fireClasses.find(fc => fc.class === fireClass);
    if (!classRating) return false;
    return effectivenessOrder[classRating.effectiveness] >= minLevel;
  });
}

/**
 * Calculate required number of extinguishers for given area
 */
export function calculateRequiredExtinguishers(
  extinguisherId: string,
  totalAreaSqm: number
): number {
  const extinguisher = getFireExtinguisherById(extinguisherId);
  if (!extinguisher) return 0;

  const placement = extinguisher.placement.quantityPerArea;

  // Find the applicable area bracket
  for (let i = placement.length - 1; i >= 0; i--) {
    if (totalAreaSqm >= placement[i].areaSqm) {
      const ratio = totalAreaSqm / placement[i].areaSqm;
      return Math.ceil(ratio * placement[i].minUnits);
    }
  }

  // If area is smaller than smallest bracket, use minimum
  return placement[0].minUnits;
}

/**
 * Get recommended extinguisher types for a specific environment
 */
export function getRecommendedExtinguishersForEnvironment(
  environment: string
): FireExtinguisherType[] {
  const envLower = environment.toLowerCase();

  return fireExtinguishers.filter(ext =>
    ext.applications.recommended.some(rec =>
      rec.toLowerCase().includes(envLower)
    )
  );
}

/**
 * Check if extinguisher requires refill after use
 */
export function requiresRefillAfterUse(extinguisherId: string): boolean {
  const extinguisher = getFireExtinguisherById(extinguisherId);
  return extinguisher?.maintenance.refillAfterUse ?? true;
}

/**
 * Get next inspection date based on last inspection
 */
export function getNextInspectionDate(
  extinguisherId: string,
  lastInspectionDate: Date
): Date {
  const extinguisher = getFireExtinguisherById(extinguisherId);
  if (!extinguisher) return new Date();

  const nextDate = new Date(lastInspectionDate);
  nextDate.setMonth(nextDate.getMonth() + extinguisher.maintenance.inspectionFrequencyMonths);

  return nextDate;
}

export default fireExtinguishers;
