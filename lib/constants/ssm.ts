/**
 * SSM/PSI Constants
 * Constante pentru Securitatea și Sănătatea Muncii și Prevenirea Stingerii Incendiilor
 * Multi-country support: RO, BG, HU, DE
 */

// ============================================================================
// TRAINING TYPES - Tipuri de instruiri
// ============================================================================

export const TRAINING_TYPES = {
  INDUCTION: 'induction', // Instruire la angajare
  PERIODIC: 'periodic', // Instruire periodică
  WORKSTATION: 'workstation', // Instruire la locul de muncă
  RISK_CHANGE: 'risk_change', // Instruire la schimbarea riscurilor
  PSI: 'psi', // Instruire PSI (Prevenirea și Stingerea Incendiilor)
  FIRST_AID: 'first_aid', // Prim ajutor
  SPECIALIZED: 'specialized', // Instruire specializată (lucru la înălțime, spații confinate, etc.)
} as const;

export type TrainingType = typeof TRAINING_TYPES[keyof typeof TRAINING_TYPES];

// ============================================================================
// TRAINING FREQUENCIES - Frecvențe instruiri
// ============================================================================

export const TRAINING_FREQUENCIES = {
  ONCE: 'once', // O singură dată (ex: instruire la angajare)
  MONTHLY: 'monthly', // Lunar
  QUARTERLY: 'quarterly', // Trimestrial
  BIANNUAL: 'biannual', // Semestrial
  ANNUAL: 'annual', // Anual
  BIENNIAL: 'biennial', // La 2 ani
} as const;

export type TrainingFrequency = typeof TRAINING_FREQUENCIES[keyof typeof TRAINING_FREQUENCIES];

// Mapare tip instruire → frecvență recomandată
export const TRAINING_TYPE_TO_FREQUENCY: Record<TrainingType, TrainingFrequency> = {
  [TRAINING_TYPES.INDUCTION]: TRAINING_FREQUENCIES.ONCE,
  [TRAINING_TYPES.PERIODIC]: TRAINING_FREQUENCIES.ANNUAL,
  [TRAINING_TYPES.WORKSTATION]: TRAINING_FREQUENCIES.ANNUAL,
  [TRAINING_TYPES.RISK_CHANGE]: TRAINING_FREQUENCIES.ONCE,
  [TRAINING_TYPES.PSI]: TRAINING_FREQUENCIES.ANNUAL,
  [TRAINING_TYPES.FIRST_AID]: TRAINING_FREQUENCIES.BIENNIAL,
  [TRAINING_TYPES.SPECIALIZED]: TRAINING_FREQUENCIES.ANNUAL,
};

// ============================================================================
// MEDICAL EXAM TYPES - Tipuri de examene medicale
// ============================================================================

export const MEDICAL_EXAM_TYPES = {
  PRE_EMPLOYMENT: 'pre_employment', // La angajare
  PERIODIC: 'periodic', // Periodic
  RESUMPTION: 'resumption', // La reluarea activității (după concediu medical >30 zile)
  JOB_CHANGE: 'job_change', // La schimbarea locului de muncă
  AT_REQUEST: 'at_request', // La cerere (angajat sau angajator)
  END_OF_EMPLOYMENT: 'end_of_employment', // La încetarea contractului (dacă a lucrat cu substanțe periculoase)
} as const;

export type MedicalExamType = typeof MEDICAL_EXAM_TYPES[keyof typeof MEDICAL_EXAM_TYPES];

// ============================================================================
// EIP CATEGORIES - Categorii Echipamente Individuale de Protecție
// ============================================================================

export const EIP_CATEGORIES = {
  HEAD: 'head', // Protecția capului (cască)
  EYES: 'eyes', // Protecția ochilor (ochelari)
  HEARING: 'hearing', // Protecția auzului (antifoane, dopuri)
  RESPIRATORY: 'respiratory', // Protecția respiratorie (măști, respiratoare)
  HANDS: 'hands', // Protecția mâinilor (mănuși)
  FEET: 'feet', // Protecția picioarelor (încălțăminte de protecție)
  BODY: 'body', // Protecția corpului (combinezoane, șorțuri)
  FALL_PROTECTION: 'fall_protection', // Protecție la cădere de la înălțime (hamuri, centuri)
  HIGH_VISIBILITY: 'high_visibility', // Îmbrăcăminte de înaltă vizibilitate (veste reflectorizante)
} as const;

export type EIPCategory = typeof EIP_CATEGORIES[keyof typeof EIP_CATEGORIES];

// ============================================================================
// RISK LEVELS - Niveluri de risc
// ============================================================================

export const RISK_LEVELS = {
  LOW: 'low', // Risc scăzut
  MEDIUM: 'medium', // Risc mediu
  HIGH: 'high', // Risc ridicat
  CRITICAL: 'critical', // Risc critic
} as const;

export type RiskLevel = typeof RISK_LEVELS[keyof typeof RISK_LEVELS];

// Valori numerice pentru calcule
export const RISK_LEVEL_VALUES: Record<RiskLevel, number> = {
  [RISK_LEVELS.LOW]: 1,
  [RISK_LEVELS.MEDIUM]: 2,
  [RISK_LEVELS.HIGH]: 3,
  [RISK_LEVELS.CRITICAL]: 4,
};

// Culori pentru UI
export const RISK_LEVEL_COLORS: Record<RiskLevel, string> = {
  [RISK_LEVELS.LOW]: 'green',
  [RISK_LEVELS.MEDIUM]: 'yellow',
  [RISK_LEVELS.HIGH]: 'orange',
  [RISK_LEVELS.CRITICAL]: 'red',
};

// ============================================================================
// DOCUMENT TYPES - Tipuri de documente SSM
// ============================================================================

export const DOCUMENT_TYPES = {
  FISA_POST: 'fisa_post', // Fișa postului
  INSTRUCTIUNE_PROPRIE: 'instructiune_proprie', // Instrucțiune proprie SSM
  EVALUARE_RISC: 'evaluare_risc', // Plan de prevenire și protecție (Evaluare de risc)
  CONTRACT_SSM: 'contract_ssm', // Contract servicii SSM externe
  AVIZ_PSI: 'aviz_psi', // Aviz PSI
  AUTORIZATIE_PSI: 'autorizatie_psi', // Autorizație PSI
  REGISTRU_INSTRUIRE: 'registru_instruire', // Registru instruire SSM
  REGISTRU_CONTROL: 'registru_control', // Registru control ITM
  FISA_APTITUDINE: 'fisa_aptitudine', // Fișă aptitudine medicală
  PROCES_VERBAL: 'proces_verbal', // Proces verbal (controale, sancțiuni)
  RAPORT_INCIDENT: 'raport_incident', // Raport incident/accident de muncă
  CERTIFICAT_CALITATE: 'certificat_calitate', // Certificat calitate EIP
  DECLARATIE_CONFORMITATE: 'declaratie_conformitate', // Declarație de conformitate EIP
  OTHER: 'other', // Alte documente
} as const;

export type DocumentType = typeof DOCUMENT_TYPES[keyof typeof DOCUMENT_TYPES];

// ============================================================================
// ALERT SEVERITIES - Niveluri de severitate alerte
// ============================================================================

export const ALERT_SEVERITIES = {
  INFO: 'info', // Informativ
  WARNING: 'warning', // Avertizare
  URGENT: 'urgent', // Urgent
  CRITICAL: 'critical', // critic
} as const;

export type AlertSeverity = typeof ALERT_SEVERITIES[keyof typeof ALERT_SEVERITIES];

// Culori pentru UI
export const ALERT_SEVERITY_COLORS: Record<AlertSeverity, string> = {
  [ALERT_SEVERITIES.INFO]: 'blue',
  [ALERT_SEVERITIES.WARNING]: 'yellow',
  [ALERT_SEVERITIES.URGENT]: 'orange',
  [ALERT_SEVERITIES.CRITICAL]: 'red',
};

// Icoane pentru UI (lucide-react icons)
export const ALERT_SEVERITY_ICONS: Record<AlertSeverity, string> = {
  [ALERT_SEVERITIES.INFO]: 'Info',
  [ALERT_SEVERITIES.WARNING]: 'AlertTriangle',
  [ALERT_SEVERITIES.URGENT]: 'AlertCircle',
  [ALERT_SEVERITIES.CRITICAL]: 'AlertOctagon',
};

// ============================================================================
// COMPLIANCE THRESHOLDS - Praguri de conformitate
// ============================================================================

export const COMPLIANCE_THRESHOLDS = {
  EXCELLENT: 95, // >= 95% - Conformitate excelentă
  GOOD: 80, // >= 80% - Conformitate bună
  ACCEPTABLE: 60, // >= 60% - Conformitate acceptabilă
  POOR: 40, // >= 40% - Conformitate slabă
  // < 40% - Neconformitate critică
} as const;

// Mapare score → nivel
export function getComplianceLevel(score: number): keyof typeof COMPLIANCE_THRESHOLDS | 'critical' {
  if (score >= COMPLIANCE_THRESHOLDS.EXCELLENT) return 'EXCELLENT';
  if (score >= COMPLIANCE_THRESHOLDS.GOOD) return 'GOOD';
  if (score >= COMPLIANCE_THRESHOLDS.ACCEPTABLE) return 'ACCEPTABLE';
  if (score >= COMPLIANCE_THRESHOLDS.POOR) return 'POOR';
  return 'critical';
}

// Culori pentru afișare
export const COMPLIANCE_COLORS: Record<keyof typeof COMPLIANCE_THRESHOLDS | 'critical', string> = {
  EXCELLENT: 'green',
  GOOD: 'blue',
  ACCEPTABLE: 'yellow',
  POOR: 'orange',
  critical: 'red',
};

// ============================================================================
// INSPECTION INTERVALS - Intervale de control per țară
// ============================================================================

export const COUNTRIES = {
  RO: 'ro', // România
  BG: 'bg', // Bulgaria
  HU: 'hu', // Ungaria
  DE: 'de', // Germania
} as const;

export type Country = typeof COUNTRIES[keyof typeof COUNTRIES];

// Intervale de inspecție în luni pentru fiecare țară
export const INSPECTION_INTERVALS: Record<Country, {
  ITM_ROUTINE: number; // Inspecția Muncii - control de rutină
  PSI_ROUTINE: number; // PSI - control de rutină
  MEDICAL_PERIODIC: number; // Control medical periodic (default)
  MEDICAL_RISK_JOBS: number; // Control medical pentru locuri cu risc ridicat
  EIP_INSPECTION: number; // Control EIP (vizual, funcțional)
  TRAINING_PERIODIC: number; // Instruire periodică
  FIRE_EXTINGUISHER: number; // Verificare stingătoare
  HYDRANT_INSPECTION: number; // Verificare hidranti
  EMERGENCY_LIGHTING: number; // Verificare iluminat siguranță
  EVACUATION_PLAN_REVIEW: number; // Revizuire plan evacuare
}> = {
  [COUNTRIES.RO]: {
    ITM_ROUTINE: 12, // ITM - minimum o dată pe an (poate fi mai des în funcție de risc)
    PSI_ROUTINE: 12, // ISU - control anual
    MEDICAL_PERIODIC: 12, // Examen medical anual (default)
    MEDICAL_RISK_JOBS: 6, // Examen medical semestrial pentru riscuri speciale
    EIP_INSPECTION: 3, // Control EIP trimestrial
    TRAINING_PERIODIC: 12, // Instruire anuală
    FIRE_EXTINGUISHER: 12, // Verificare anuală + service
    HYDRANT_INSPECTION: 6, // Verificare semestrială
    EMERGENCY_LIGHTING: 6, // Verificare semestrială
    EVACUATION_PLAN_REVIEW: 12, // Revizuire anuală
  },
  [COUNTRIES.BG]: {
    ITM_ROUTINE: 12,
    PSI_ROUTINE: 12,
    MEDICAL_PERIODIC: 12,
    MEDICAL_RISK_JOBS: 6,
    EIP_INSPECTION: 6,
    TRAINING_PERIODIC: 12,
    FIRE_EXTINGUISHER: 12,
    HYDRANT_INSPECTION: 6,
    EMERGENCY_LIGHTING: 6,
    EVACUATION_PLAN_REVIEW: 12,
  },
  [COUNTRIES.HU]: {
    ITM_ROUTINE: 12,
    PSI_ROUTINE: 12,
    MEDICAL_PERIODIC: 12,
    MEDICAL_RISK_JOBS: 6,
    EIP_INSPECTION: 6,
    TRAINING_PERIODIC: 12,
    FIRE_EXTINGUISHER: 12,
    HYDRANT_INSPECTION: 6,
    EMERGENCY_LIGHTING: 6,
    EVACUATION_PLAN_REVIEW: 12,
  },
  [COUNTRIES.DE]: {
    ITM_ROUTINE: 12,
    PSI_ROUTINE: 12,
    MEDICAL_PERIODIC: 36, // Germania - la 3 ani pentru joburi non-risc
    MEDICAL_RISK_JOBS: 12, // Anual pentru joburi cu risc
    EIP_INSPECTION: 12,
    TRAINING_PERIODIC: 12,
    FIRE_EXTINGUISHER: 24, // Germania - la 2 ani
    HYDRANT_INSPECTION: 12,
    EMERGENCY_LIGHTING: 12,
    EVACUATION_PLAN_REVIEW: 24, // Germania - la 2 ani
  },
};

// Helper function - obține intervale pentru o țară
export function getInspectionIntervals(country: Country) {
  return INSPECTION_INTERVALS[country] || INSPECTION_INTERVALS[COUNTRIES.RO];
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  TRAINING_TYPES,
  TRAINING_FREQUENCIES,
  TRAINING_TYPE_TO_FREQUENCY,
  MEDICAL_EXAM_TYPES,
  EIP_CATEGORIES,
  RISK_LEVELS,
  RISK_LEVEL_VALUES,
  RISK_LEVEL_COLORS,
  DOCUMENT_TYPES,
  ALERT_SEVERITIES,
  ALERT_SEVERITY_COLORS,
  ALERT_SEVERITY_ICONS,
  COMPLIANCE_THRESHOLDS,
  COMPLIANCE_COLORS,
  COUNTRIES,
  INSPECTION_INTERVALS,
  getComplianceLevel,
  getInspectionIntervals,
};
