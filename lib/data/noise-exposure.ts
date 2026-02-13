/**
 * Noise Exposure Database
 *
 * Based on EU Directive 2003/10/EC on minimum health and safety requirements
 * regarding exposure of workers to risks arising from physical agents (noise)
 *
 * Key legal limits:
 * - Lower action level: 80 dB(A) daily exposure / 135 dB(C) peak
 * - Upper action level: 85 dB(A) daily exposure / 137 dB(C) peak
 * - Exposure limit value: 87 dB(A) daily exposure / 140 dB(C) peak
 */

export interface NoiseExposureData {
  id: string;
  workplaceType: string;
  workplaceTypeRo: string;
  typicalDb: number; // Typical noise level in dB(A)
  maxDb: number; // Maximum peak noise level in dB(C)
  exposureLimitHours: number; // Maximum safe exposure hours at typical level
  requiredHearingProtection: 'none' | 'optional' | 'mandatory' | 'enhanced';
  hearingProtectionType: string;
  audiometryFrequency: 'annual' | 'biannual' | 'triennial' | 'on_hire_only';
  audiometryFrequencyMonths: number;
  riskLevel: 'low' | 'medium' | 'high' | 'very_high';
  actionLevel: 'below_80' | '80_to_85' | '85_to_87' | 'above_87';
  legalNotes: string;
  controlMeasures: string[];
}

export const LEGAL_LIMITS = {
  lowerActionLevel: {
    daily: 80, // dB(A)
    peak: 135, // dB(C)
  },
  upperActionLevel: {
    daily: 85, // dB(A)
    peak: 137, // dB(C)
  },
  exposureLimit: {
    daily: 87, // dB(A)
    peak: 140, // dB(C)
  },
} as const;

export const noiseExposureDatabase: NoiseExposureData[] = [
  {
    id: 'construction-site',
    workplaceType: 'Construction Site',
    workplaceTypeRo: 'Șantier Construcții',
    typicalDb: 88,
    maxDb: 140,
    exposureLimitHours: 2.5,
    requiredHearingProtection: 'mandatory',
    hearingProtectionType: 'Antifoane cu atenuare SNR ≥ 25 dB',
    audiometryFrequency: 'annual',
    audiometryFrequencyMonths: 12,
    riskLevel: 'very_high',
    actionLevel: 'above_87',
    legalNotes: 'Depășește limita de expunere (87 dB). Protecție auditivă obligatorie.',
    controlMeasures: [
      'Utilizare obligatorie antifoane/căști',
      'Limitare timp expunere la max 2.5h/zi',
      'Semnalizare zone zgomot ridicat',
      'Audiometrie anuală obligatorie',
      'Program supraveghere medicală',
      'Instrucție specifică risc zgomot',
    ],
  },
  {
    id: 'manufacturing-metalwork',
    workplaceType: 'Metal Manufacturing Workshop',
    workplaceTypeRo: 'Atelier Prelucrare Metale',
    typicalDb: 90,
    maxDb: 142,
    exposureLimitHours: 2,
    requiredHearingProtection: 'mandatory',
    hearingProtectionType: 'Antifoane personalizate SNR ≥ 30 dB',
    audiometryFrequency: 'annual',
    audiometryFrequencyMonths: 12,
    riskLevel: 'very_high',
    actionLevel: 'above_87',
    legalNotes: 'Nivel critic de zgomot. Risc ridicat de pierdere auditivă.',
    controlMeasures: [
      'Protecție auditivă cu atenuare ridicată',
      'Rotație personal pentru reducere expunere',
      'Cabine insonorizate pentru operatori',
      'Întreținere preventivă utilaje zgomotoase',
      'Audiometrie anuală + controale medicale frecvente',
      'Evaluare zilnică expunere personală',
    ],
  },
  {
    id: 'woodworking',
    workplaceType: 'Woodworking Shop',
    workplaceTypeRo: 'Atelier Tâmplărie',
    typicalDb: 86,
    maxDb: 138,
    exposureLimitHours: 4,
    requiredHearingProtection: 'mandatory',
    hearingProtectionType: 'Antifoane sau căști SNR ≥ 20 dB',
    audiometryFrequency: 'annual',
    audiometryFrequencyMonths: 12,
    riskLevel: 'high',
    actionLevel: '85_to_87',
    legalNotes: 'Între nivelul de acțiune superior (85 dB) și limita de expunere.',
    controlMeasures: [
      'Protecție auditivă obligatorie',
      'Limitare expunere la 4h/zi',
      'Utilizare ferăstraie cu emisii reduse',
      'Sistemul aspirație rumegus (reduce zgomot)',
      'Audiometrie anuală',
      'Instruire utilizare corectă EPI',
    ],
  },
  {
    id: 'textile-factory',
    workplaceType: 'Textile Factory',
    workplaceTypeRo: 'Fabrică Textile',
    typicalDb: 84,
    maxDb: 136,
    exposureLimitHours: 8,
    requiredHearingProtection: 'mandatory',
    hearingProtectionType: 'Antifoane SNR ≥ 15 dB',
    audiometryFrequency: 'annual',
    audiometryFrequencyMonths: 12,
    riskLevel: 'high',
    actionLevel: '80_to_85',
    legalNotes: 'Între nivelul inferior (80 dB) și superior (85 dB) de acțiune.',
    controlMeasures: [
      'Protecție auditivă obligatorie',
      'Marcare zone expunere zgomot',
      'Întreținere preventivă mașini textile',
      'Audiometrie anuală',
      'Pauze în zone cu zgomot redus',
      'Monitorizare expunere personală',
    ],
  },
  {
    id: 'call-center',
    workplaceType: 'Call Center',
    workplaceTypeRo: 'Call Center',
    typicalDb: 65,
    maxDb: 110,
    exposureLimitHours: 8,
    requiredHearingProtection: 'none',
    hearingProtectionType: 'Nu este necesară',
    audiometryFrequency: 'on_hire_only',
    audiometryFrequencyMonths: 0,
    riskLevel: 'low',
    actionLevel: 'below_80',
    legalNotes: 'Sub nivelul inferior de acțiune. Risc scăzut.',
    controlMeasures: [
      'Căști cu limitare volum max',
      'Pauze regulate pentru odihnă auditivă',
      'Reglare nivel volum individual',
      'Instruire utilizare corectă echipament',
      'Supraveghiere calitate sunet',
    ],
  },
  {
    id: 'office',
    workplaceType: 'Office Environment',
    workplaceTypeRo: 'Birou',
    typicalDb: 55,
    maxDb: 85,
    exposureLimitHours: 8,
    requiredHearingProtection: 'none',
    hearingProtectionType: 'Nu este necesară',
    audiometryFrequency: 'on_hire_only',
    audiometryFrequencyMonths: 0,
    riskLevel: 'low',
    actionLevel: 'below_80',
    legalNotes: 'Nivel confortabil. Fără risc auditiv.',
    controlMeasures: [
      'Menținere nivel zgomot confortabil',
      'Panouri fonoabsorbante dacă e necesar',
      'Zone liniștite pentru concentrare',
      'Control zgomot echipamente',
    ],
  },
  {
    id: 'airport-ground',
    workplaceType: 'Airport Ground Operations',
    workplaceTypeRo: 'Operațiuni Aeroportuare la Sol',
    typicalDb: 95,
    maxDb: 145,
    exposureLimitHours: 1,
    requiredHearingProtection: 'enhanced',
    hearingProtectionType: 'Căști + antifoane (protecție dublă) SNR ≥ 35 dB',
    audiometryFrequency: 'biannual',
    audiometryFrequencyMonths: 6,
    riskLevel: 'very_high',
    actionLevel: 'above_87',
    legalNotes: 'Nivel extrem de periculos. Protecție dublă obligatorie.',
    controlMeasures: [
      'Protecție auditivă dublă obligatorie',
      'Expunere limitată la max 1h/zi',
      'Rotație frecventă personal',
      'Audiometrie la 6 luni',
      'Supraveghere medicală intensivă',
      'Semnalizare vizuală zone periculoase',
      'Comunicare prin radio, nu verbal',
    ],
  },
  {
    id: 'nightclub-bar',
    workplaceType: 'Nightclub/Bar Staff',
    workplaceTypeRo: 'Personal Club/Bar',
    typicalDb: 92,
    maxDb: 143,
    exposureLimitHours: 1.5,
    requiredHearingProtection: 'mandatory',
    hearingProtectionType: 'Antifoane muzicieni (filtru liniar) SNR ≥ 25 dB',
    audiometryFrequency: 'annual',
    audiometryFrequencyMonths: 12,
    riskLevel: 'very_high',
    actionLevel: 'above_87',
    legalNotes: 'Risc sever. Multe cazuri pierdere auditivă în industrie.',
    controlMeasures: [
      'Antifoane speciale pentru muzică',
      'Limitare ture de lucru',
      'Zone de odihnă cu zgomot redus',
      'Audiometrie anuală obligatorie',
      'Limitare volum sistem audio',
      'Pauze în zone liniștite',
    ],
  },
  {
    id: 'printing-press',
    workplaceType: 'Printing Press',
    workplaceTypeRo: 'Tipografie',
    typicalDb: 83,
    maxDb: 135,
    exposureLimitHours: 8,
    requiredHearingProtection: 'mandatory',
    hearingProtectionType: 'Antifoane SNR ≥ 15 dB',
    audiometryFrequency: 'annual',
    audiometryFrequencyMonths: 12,
    riskLevel: 'high',
    actionLevel: '80_to_85',
    legalNotes: 'Nivelul de acțiune superior. Protecție obligatorie.',
    controlMeasures: [
      'Protecție auditivă obligatorie',
      'Carcase fonoabsorbante pe utilaje',
      'Întreținere regulată mașini',
      'Audiometrie anuală',
      'Instrucție specific zgomot',
    ],
  },
  {
    id: 'mining',
    workplaceType: 'Mining Operations',
    workplaceTypeRo: 'Exploatare Minieră',
    typicalDb: 94,
    maxDb: 144,
    exposureLimitHours: 1,
    requiredHearingProtection: 'enhanced',
    hearingProtectionType: 'Protecție dublă: antifoane + căști SNR ≥ 35 dB',
    audiometryFrequency: 'biannual',
    audiometryFrequencyMonths: 6,
    riskLevel: 'very_high',
    actionLevel: 'above_87',
    legalNotes: 'Risc extrem. Monitorizare strictă obligatorie.',
    controlMeasures: [
      'Protecție auditivă dublă',
      'Expunere max 1h la fața locului',
      'Rotație echipe',
      'Audiometrie la 6 luni',
      'Supraveghere medicală permanentă',
      'Utilaje cu emisii reduse zgomot',
      'Ventilație (reduce zgomot)',
    ],
  },
  {
    id: 'food-processing',
    workplaceType: 'Food Processing Plant',
    workplaceTypeRo: 'Fabrică Procesare Alimente',
    typicalDb: 81,
    maxDb: 133,
    exposureLimitHours: 8,
    requiredHearingProtection: 'optional',
    hearingProtectionType: 'Antifoane recomandate SNR ≥ 10 dB',
    audiometryFrequency: 'annual',
    audiometryFrequencyMonths: 12,
    riskLevel: 'medium',
    actionLevel: '80_to_85',
    legalNotes: 'Nivel de acțiune inferior depășit. Protecție recomandată.',
    controlMeasures: [
      'Punere la dispoziție protecție auditivă',
      'Marcare zone zgomot > 80 dB',
      'Instruire utilizare EPI',
      'Audiometrie anuală',
      'Reducere zgomot la sursă unde e posibil',
    ],
  },
  {
    id: 'warehouse-logistics',
    workplaceType: 'Warehouse/Logistics',
    workplaceTypeRo: 'Depozit/Logistică',
    typicalDb: 78,
    maxDb: 130,
    exposureLimitHours: 8,
    requiredHearingProtection: 'none',
    hearingProtectionType: 'Nu este necesară (disponibilă la cerere)',
    audiometryFrequency: 'triennial',
    audiometryFrequencyMonths: 36,
    riskLevel: 'low',
    actionLevel: 'below_80',
    legalNotes: 'Sub nivelul de acțiune. Risc minim.',
    controlMeasures: [
      'Monitorizare periodică zgomot',
      'Întreținere cărucioare/stivuitoare',
      'Protecție disponibilă la cerere',
      'Audiometrie la angajare și periodic',
    ],
  },
  {
    id: 'agriculture-tractor',
    workplaceType: 'Agriculture (Tractor Operation)',
    workplaceTypeRo: 'Agricultură (Operare Tractor)',
    typicalDb: 85,
    maxDb: 137,
    exposureLimitHours: 8,
    requiredHearingProtection: 'mandatory',
    hearingProtectionType: 'Antifoane SNR ≥ 20 dB',
    audiometryFrequency: 'annual',
    audiometryFrequencyMonths: 12,
    riskLevel: 'high',
    actionLevel: '85_to_87',
    legalNotes: 'La limita superioară de acțiune. Protecție obligatorie.',
    controlMeasures: [
      'Protecție auditivă obligatorie',
      'Cabine tractoare insonorizate',
      'Întreținere sistem evacuare',
      'Audiometrie anuală',
      'Limitare ore expunere zilnică',
    ],
  },
  {
    id: 'dentist-clinic',
    workplaceType: 'Dental Clinic',
    workplaceTypeRo: 'Cabinet Stomatologic',
    typicalDb: 72,
    maxDb: 115,
    exposureLimitHours: 8,
    requiredHearingProtection: 'none',
    hearingProtectionType: 'Nu este necesară',
    audiometryFrequency: 'on_hire_only',
    audiometryFrequencyMonths: 0,
    riskLevel: 'low',
    actionLevel: 'below_80',
    legalNotes: 'Nivel acceptabil. Fără măsuri speciale.',
    controlMeasures: [
      'Echipamente stomatologice moderne (zgomot redus)',
      'Întreținere preventivă',
      'Monitorizare confort acustic',
    ],
  },
  {
    id: 'live-music-venue',
    workplaceType: 'Live Music Venue Staff',
    workplaceTypeRo: 'Personal Sală Concerte',
    typicalDb: 96,
    maxDb: 146,
    exposureLimitHours: 0.5,
    requiredHearingProtection: 'enhanced',
    hearingProtectionType: 'Antifoane personalizate muzicieni SNR ≥ 30 dB',
    audiometryFrequency: 'biannual',
    audiometryFrequencyMonths: 6,
    riskLevel: 'very_high',
    actionLevel: 'above_87',
    legalNotes: 'Risc extrem sever. Protecție specială obligatorie.',
    controlMeasures: [
      'Antifoane speciale cu răspuns plat',
      'Expunere max 30 min în zona sonoră critică',
      'Rotație personal (scenă/backstage)',
      'Audiometrie la 6 luni',
      'Zone refugiu cu zgomot < 70 dB',
      'Monitorizare dozimetrie personală',
      'Limitare nivel SPL conform legislație',
    ],
  },
];

/**
 * Calculate exposure limit hours for a given noise level
 * Based on 3dB exchange rate (doubling rule)
 * Reference: 87 dB for 8 hours
 */
export function calculateExposureLimitHours(dbLevel: number): number {
  if (dbLevel <= 87) return 8;
  const difference = dbLevel - 87;
  const halvings = difference / 3;
  return 8 / Math.pow(2, halvings);
}

/**
 * Determine action level based on noise exposure
 */
export function getActionLevel(dbLevel: number): NoiseExposureData['actionLevel'] {
  if (dbLevel < 80) return 'below_80';
  if (dbLevel < 85) return '80_to_85';
  if (dbLevel < 87) return '85_to_87';
  return 'above_87';
}

/**
 * Get required hearing protection based on noise level
 */
export function getRequiredProtection(
  dbLevel: number
): NoiseExposureData['requiredHearingProtection'] {
  if (dbLevel < 80) return 'none';
  if (dbLevel < 85) return 'optional';
  if (dbLevel < 90) return 'mandatory';
  return 'enhanced';
}

/**
 * Get audiometry frequency based on risk level
 */
export function getAudiometryFrequency(
  dbLevel: number
): NoiseExposureData['audiometryFrequency'] {
  if (dbLevel < 80) return 'on_hire_only';
  if (dbLevel < 85) return 'triennial';
  if (dbLevel < 90) return 'annual';
  return 'biannual';
}

/**
 * Find workplace data by ID
 */
export function getNoiseExposureById(id: string): NoiseExposureData | undefined {
  return noiseExposureDatabase.find((workplace) => workplace.id === id);
}

/**
 * Filter workplaces by risk level
 */
export function getWorkplacesByRiskLevel(
  riskLevel: NoiseExposureData['riskLevel']
): NoiseExposureData[] {
  return noiseExposureDatabase.filter((workplace) => workplace.riskLevel === riskLevel);
}

/**
 * Get all workplaces exceeding exposure limit
 */
export function getHighRiskWorkplaces(): NoiseExposureData[] {
  return noiseExposureDatabase.filter(
    (workplace) => workplace.typicalDb >= LEGAL_LIMITS.exposureLimit.daily
  );
}
