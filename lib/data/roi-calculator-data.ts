/**
 * ROI Calculator Data
 *
 * Provides cost estimates for SSM/PSI compliance calculations across different countries.
 * Data includes penalties, accident costs, manual management time, and consultant rates.
 */

export type CountryCode = 'RO' | 'BG' | 'HU' | 'DE';
export type CompanySize = 'small' | 'medium' | 'large' | 'enterprise';
export type PenaltySeverity = 'minor' | 'moderate' | 'serious' | 'critical';
export type AccidentSeverity = 'minor' | 'moderate' | 'serious' | 'fatal';

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
}

export interface PenaltyCost {
  min: number;
  max: number;
  average: number;
}

export interface AccidentCost {
  min: number;
  max: number;
  average: number;
}

export interface ManualManagementTime {
  hoursPerMonth: number;
  description: string;
}

export interface ConsultantRate {
  hourlyRate: number;
  monthlyRetainer: number;
  description: string;
}

export interface CountryROIData {
  country: CountryCode;
  countryName: string;
  currency: CurrencyInfo;

  // ITM (Labour Inspectorate) penalties by severity
  penalties: Record<PenaltySeverity, PenaltyCost>;

  // Workplace accident costs by severity
  accidents: Record<AccidentSeverity, AccidentCost>;

  // Manual management time by company size (hours/month)
  manualManagement: Record<CompanySize, ManualManagementTime>;

  // External SSM consultant costs
  consultantRates: ConsultantRate;
}

/**
 * Romania (RO) - RON currency
 */
const romaniaData: CountryROIData = {
  country: 'RO',
  countryName: 'România',
  currency: {
    code: 'RON',
    symbol: 'lei',
    name: 'Leu românesc'
  },

  penalties: {
    minor: {
      min: 2000,
      max: 10000,
      average: 6000
    },
    moderate: {
      min: 10000,
      max: 25000,
      average: 17500
    },
    serious: {
      min: 25000,
      max: 50000,
      average: 37500
    },
    critical: {
      min: 50000,
      max: 100000,
      average: 75000
    }
  },

  accidents: {
    minor: {
      min: 50000,
      max: 100000,
      average: 75000
    },
    moderate: {
      min: 100000,
      max: 250000,
      average: 175000
    },
    serious: {
      min: 250000,
      max: 500000,
      average: 375000
    },
    fatal: {
      min: 500000,
      max: 1500000,
      average: 1000000
    }
  },

  manualManagement: {
    small: {
      hoursPerMonth: 20,
      description: '1-50 angajați: documente de bază, instruiri simple'
    },
    medium: {
      hoursPerMonth: 40,
      description: '51-250 angajați: documentație extinsă, multiple locații'
    },
    large: {
      hoursPerMonth: 80,
      description: '251-1000 angajați: procese complexe, departamente multiple'
    },
    enterprise: {
      hoursPerMonth: 160,
      description: '1000+ angajați: procese enterprise, multiple regiuni'
    }
  },

  consultantRates: {
    hourlyRate: 200,
    monthlyRetainer: 3000,
    description: 'Consultant SSM extern cu experiență medie'
  }
};

/**
 * Bulgaria (BG) - BGN currency
 */
const bulgariaData: CountryROIData = {
  country: 'BG',
  countryName: 'България',
  currency: {
    code: 'BGN',
    symbol: 'лв',
    name: 'Български лев'
  },

  penalties: {
    minor: {
      min: 1000,
      max: 5000,
      average: 3000
    },
    moderate: {
      min: 5000,
      max: 15000,
      average: 10000
    },
    serious: {
      min: 15000,
      max: 30000,
      average: 22500
    },
    critical: {
      min: 30000,
      max: 60000,
      average: 45000
    }
  },

  accidents: {
    minor: {
      min: 30000,
      max: 60000,
      average: 45000
    },
    moderate: {
      min: 60000,
      max: 150000,
      average: 105000
    },
    serious: {
      min: 150000,
      max: 300000,
      average: 225000
    },
    fatal: {
      min: 300000,
      max: 900000,
      average: 600000
    }
  },

  manualManagement: {
    small: {
      hoursPerMonth: 18,
      description: '1-50 служители: основна документация'
    },
    medium: {
      hoursPerMonth: 35,
      description: '51-250 служители: разширена документация'
    },
    large: {
      hoursPerMonth: 70,
      description: '251-1000 служители: сложни процеси'
    },
    enterprise: {
      hoursPerMonth: 140,
      description: '1000+ служители: корпоративни процеси'
    }
  },

  consultantRates: {
    hourlyRate: 100,
    monthlyRetainer: 1800,
    description: 'Външен консултант ОЗ с опит'
  }
};

/**
 * Hungary (HU) - HUF currency
 */
const hungaryData: CountryROIData = {
  country: 'HU',
  countryName: 'Magyarország',
  currency: {
    code: 'HUF',
    symbol: 'Ft',
    name: 'Magyar forint'
  },

  penalties: {
    minor: {
      min: 500000,
      max: 2000000,
      average: 1250000
    },
    moderate: {
      min: 2000000,
      max: 5000000,
      average: 3500000
    },
    serious: {
      min: 5000000,
      max: 10000000,
      average: 7500000
    },
    critical: {
      min: 10000000,
      max: 20000000,
      average: 15000000
    }
  },

  accidents: {
    minor: {
      min: 10000000,
      max: 20000000,
      average: 15000000
    },
    moderate: {
      min: 20000000,
      max: 50000000,
      average: 35000000
    },
    serious: {
      min: 50000000,
      max: 100000000,
      average: 75000000
    },
    fatal: {
      min: 100000000,
      max: 300000000,
      average: 200000000
    }
  },

  manualManagement: {
    small: {
      hoursPerMonth: 22,
      description: '1-50 alkalmazott: alapdokumentáció'
    },
    medium: {
      hoursPerMonth: 45,
      description: '51-250 alkalmazott: bővített dokumentáció'
    },
    large: {
      hoursPerMonth: 90,
      description: '251-1000 alkalmazott: összetett folyamatok'
    },
    enterprise: {
      hoursPerMonth: 180,
      description: '1000+ alkalmazott: vállalati folyamatok'
    }
  },

  consultantRates: {
    hourlyRate: 50000,
    monthlyRetainer: 750000,
    description: 'Külső munkavédelmi tanácsadó tapasztalattal'
  }
};

/**
 * Germany (DE) - EUR currency
 */
const germanyData: CountryROIData = {
  country: 'DE',
  countryName: 'Deutschland',
  currency: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro'
  },

  penalties: {
    minor: {
      min: 500,
      max: 2000,
      average: 1250
    },
    moderate: {
      min: 2000,
      max: 10000,
      average: 6000
    },
    serious: {
      min: 10000,
      max: 25000,
      average: 17500
    },
    critical: {
      min: 25000,
      max: 50000,
      average: 37500
    }
  },

  accidents: {
    minor: {
      min: 10000,
      max: 25000,
      average: 17500
    },
    moderate: {
      min: 25000,
      max: 75000,
      average: 50000
    },
    serious: {
      min: 75000,
      max: 150000,
      average: 112500
    },
    fatal: {
      min: 150000,
      max: 500000,
      average: 325000
    }
  },

  manualManagement: {
    small: {
      hoursPerMonth: 25,
      description: '1-50 Mitarbeiter: Basisdokumentation'
    },
    medium: {
      hoursPerMonth: 50,
      description: '51-250 Mitarbeiter: erweiterte Dokumentation'
    },
    large: {
      hoursPerMonth: 100,
      description: '251-1000 Mitarbeiter: komplexe Prozesse'
    },
    enterprise: {
      hoursPerMonth: 200,
      description: '1000+ Mitarbeiter: Unternehmensprozesse'
    }
  },

  consultantRates: {
    hourlyRate: 120,
    monthlyRetainer: 2500,
    description: 'Externer Arbeitssicherheitsberater mit Erfahrung'
  }
};

/**
 * All country data indexed by country code
 */
export const roiData: Record<CountryCode, CountryROIData> = {
  RO: romaniaData,
  BG: bulgariaData,
  HU: hungaryData,
  DE: germanyData
};

/**
 * Get ROI data for a specific country
 */
export function getCountryROIData(country: CountryCode): CountryROIData {
  return roiData[country];
}

/**
 * Calculate potential annual savings
 */
export interface ROICalculation {
  manualManagementCost: number;
  potentialPenaltyCost: number;
  potentialAccidentCost: number;
  totalAnnualRisk: number;
  platformCost: number;
  netSavings: number;
  roi: number; // percentage
  paybackMonths: number;
}

export function calculateROI(
  country: CountryCode,
  companySize: CompanySize,
  platformMonthlyCost: number,
  riskFactors: {
    penaltyProbability?: number; // 0-1
    accidentProbability?: number; // 0-1
    averageHourlyEmployeeCost?: number;
  } = {}
): ROICalculation {
  const data = getCountryROIData(country);

  const {
    penaltyProbability = 0.3,
    accidentProbability = 0.1,
    averageHourlyEmployeeCost = data.consultantRates.hourlyRate * 0.5
  } = riskFactors;

  // Manual management cost (internal time)
  const monthlyManagementHours = data.manualManagement[companySize].hoursPerMonth;
  const manualManagementCost = monthlyManagementHours * averageHourlyEmployeeCost * 12;

  // Potential penalty cost (expected value)
  const averagePenalty = (
    data.penalties.minor.average +
    data.penalties.moderate.average +
    data.penalties.serious.average +
    data.penalties.critical.average
  ) / 4;
  const potentialPenaltyCost = averagePenalty * penaltyProbability;

  // Potential accident cost (expected value)
  const averageAccident = (
    data.accidents.minor.average +
    data.accidents.moderate.average +
    data.accidents.serious.average
  ) / 3;
  const potentialAccidentCost = averageAccident * accidentProbability;

  // Total annual costs
  const totalAnnualRisk = manualManagementCost + potentialPenaltyCost + potentialAccidentCost;
  const platformCost = platformMonthlyCost * 12;
  const netSavings = totalAnnualRisk - platformCost;

  // ROI calculations
  const roi = platformCost > 0 ? (netSavings / platformCost) * 100 : 0;
  const paybackMonths = netSavings > 0 ? (platformCost / (netSavings / 12)) : 0;

  return {
    manualManagementCost,
    potentialPenaltyCost,
    potentialAccidentCost,
    totalAnnualRisk,
    platformCost,
    netSavings,
    roi,
    paybackMonths: Math.max(0, paybackMonths)
  };
}

/**
 * Format currency value with proper symbol
 */
export function formatCurrency(value: number, country: CountryCode): string {
  const data = getCountryROIData(country);
  const formatted = new Intl.NumberFormat('ro-RO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);

  return `${formatted} ${data.currency.symbol}`;
}
