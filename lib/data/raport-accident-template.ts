// S-S-M.RO — TEMPLATE RAPORT CERCETARE ACCIDENT DE MUNCĂ
// Conform Legea 319/2006 art. 29 - Cerințe cercetare accidente de muncă
// Data: 13 Februarie 2026

export type AccidentCauseType =
  | 'cauza_tehnica'
  | 'cauza_umana'
  | 'lipsa_instructaj'
  | 'lipsa_echipament_protectie'
  | 'lipsa_supraveghere'
  | 'conditii_lucru_necorespunzatoare'
  | 'echipament_defect'
  | 'organizare_necorespunzatoare'
  | 'factori_mediu'
  | 'alta_cauza'

export type AccidentSeverity =
  | 'usor'
  | 'mediu'
  | 'grav'
  | 'mortal'
  | 'colectiv'

export type AccidentWorkRegime =
  | 'program_normal'
  | 'ore_suplimentare'
  | 'tura_noapte'
  | 'delegatie'
  | 'altul'

export interface CommissionMember {
  name: string
  position: string
  role: 'presedinte' | 'membru' | 'secretar'
  qualification?: string
  employmentType: 'angajat' | 'ITM' | 'consultant_extern' | 'sindicate' | 'altul'
}

export interface AccidentVictim {
  fullName: string
  cnp?: string
  jobTitle: string
  department?: string
  seniority?: string // ex: "2 ani"
  employmentType: 'norma_intreaga' | 'part_time' | 'delegat' | 'subcontractor'
  hasValidMedicalExam: boolean
  hasValidSafetyTraining: boolean
  lastSafetyTrainingDate?: string
}

export interface AccidentWitness {
  fullName: string
  jobTitle?: string
  contactPhone?: string
  statement: string
}

export interface AccidentCause {
  type: AccidentCauseType
  description: string
  isPrimaryCase: boolean
}

export interface ProposedMeasure {
  description: string
  responsiblePerson: string
  deadline: string // ISO date format
  estimatedCost?: number
  priority: 'urgent' | 'ridicata' | 'medie' | 'scazuta'
  legalReference?: string
}

export interface AccidentInvestigationReport {
  // Identificare raport
  reportNumber?: string
  reportDate: string // ISO date format

  // Date accident
  accidentDate: string // ISO date format
  accidentTime: string // HH:mm format
  accidentLocation: string
  accidentLocationDetails?: string // ex: "Hala producție, poziția stâlp A5"

  // Date victimă
  victim: AccidentVictim

  // Severitate și clasificare
  severity: AccidentSeverity
  workRegime: AccidentWorkRegime
  daysOfWorkIncapacity?: number
  requiresHospitalization: boolean

  // Descriere accident
  accidentDescription: string
  activityPerformed: string // ce activitate desfășura victima
  equipmentInvolved?: string[] // echipamente implicate
  environmentalConditions?: string // ex: "ploaie, temperatură 5°C"

  // Martori
  witnesses: AccidentWitness[]

  // Cauze identificate (conform Legea 319/2006)
  causes: AccidentCause[]

  // Măsuri propuse
  proposedMeasures: ProposedMeasure[]

  // Comisia de cercetare
  investigationCommission: CommissionMember[]
  investigationStartDate: string // ISO date format
  investigationEndDate: string // ISO date format

  // Notificări legale
  notifiedITM: boolean
  itmNotificationDate?: string // ISO date format
  itmNotificationNumber?: string

  notifiedPolice: boolean
  policeNotificationDate?: string // ISO date format

  notifiedInsurerCASS: boolean
  cassNotificationDate?: string // ISO date format

  // Documente anexate
  attachedDocuments?: string[] // lista nume fișiere/documente

  // Concluzii și avize
  conclusions: string
  itmOpinion?: string

  // Metadata
  organizationId: string
  createdBy: string
  createdAt: string
  updatedAt?: string
  approvedBy?: string
  approvedAt?: string

  // Conformitate legal
  contentVersion: number
  legalBasisVersion: string // ex: "Legea 319/2006"
}

// Template implicit pentru raport nou
export const createAccidentReportTemplate = (
  organizationId: string,
  createdBy: string
): AccidentInvestigationReport => {
  const now = new Date().toISOString()
  const today = new Date().toISOString().split('T')[0]

  return {
    reportDate: today,
    accidentDate: today,
    accidentTime: '08:00',
    accidentLocation: '',
    victim: {
      fullName: '',
      jobTitle: '',
      employmentType: 'norma_intreaga',
      hasValidMedicalExam: false,
      hasValidSafetyTraining: false,
    },
    severity: 'usor',
    workRegime: 'program_normal',
    requiresHospitalization: false,
    accidentDescription: '',
    activityPerformed: '',
    witnesses: [],
    causes: [],
    proposedMeasures: [],
    investigationCommission: [],
    investigationStartDate: today,
    investigationEndDate: today,
    notifiedITM: false,
    notifiedPolice: false,
    notifiedInsurerCASS: false,
    conclusions: '',
    organizationId,
    createdBy,
    createdAt: now,
    contentVersion: 1,
    legalBasisVersion: 'Legea 319/2006 art. 29',
  }
}

// Tipuri standard de cauze (conform practică ITM)
export const ACCIDENT_CAUSE_LABELS: Record<AccidentCauseType, string> = {
  cauza_tehnica: 'Cauză tehnică (echipament defect, uzură)',
  cauza_umana: 'Cauză umană (eroare umană, neatenție)',
  lipsa_instructaj: 'Lipsa instructajului de SSM sau instructaj incomplet',
  lipsa_echipament_protectie: 'Lipsa echipamentului individual de protecție (EIP)',
  lipsa_supraveghere: 'Lipsa supravegherii/coordonării lucrărilor',
  conditii_lucru_necorespunzatoare: 'Condiții de lucru necorespunzătoare',
  echipament_defect: 'Echipament de muncă defect sau neautorizat',
  organizare_necorespunzatoare: 'Organizare necorespunzătoare a muncii',
  factori_mediu: 'Factori de mediu (vânt, ploaie, temperatură extremă)',
  alta_cauza: 'Altă cauză',
}

export const SEVERITY_LABELS: Record<AccidentSeverity, string> = {
  usor: 'Ușor (1-3 zile incapacitate)',
  mediu: 'Mediu (4-30 zile incapacitate)',
  grav: 'Grav (>30 zile sau invaliditate)',
  mortal: 'Mortal',
  colectiv: 'Colectiv (3+ victime)',
}

export const WORK_REGIME_LABELS: Record<AccidentWorkRegime, string> = {
  program_normal: 'Program normal de lucru',
  ore_suplimentare: 'Ore suplimentare',
  tura_noapte: 'Tură de noapte',
  delegatie: 'Delegație/detașare',
  altul: 'Altul',
}

// Helper: Verificare completitudine raport (pentru validare)
export const validateAccidentReport = (
  report: AccidentInvestigationReport
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!report.accidentDate) errors.push('Data accidentului este obligatorie')
  if (!report.accidentTime) errors.push('Ora accidentului este obligatorie')
  if (!report.accidentLocation) errors.push('Locul accidentului este obligatoriu')
  if (!report.victim.fullName) errors.push('Numele victimei este obligatoriu')
  if (!report.victim.jobTitle) errors.push('Funcția victimei este obligatorie')
  if (!report.accidentDescription || report.accidentDescription.length < 50) {
    errors.push('Descrierea accidentului trebuie să aibă minim 50 caractere')
  }
  if (!report.activityPerformed) errors.push('Activitatea desfășurată este obligatorie')
  if (report.causes.length === 0) errors.push('Trebuie identificată cel puțin o cauză')
  if (report.proposedMeasures.length === 0) errors.push('Trebuie propusă cel puțin o măsură')
  if (report.investigationCommission.length < 2) {
    errors.push('Comisia de cercetare trebuie să aibă minim 2 membri')
  }
  if (!report.conclusions || report.conclusions.length < 30) {
    errors.push('Concluziile trebuie să aibă minim 30 caractere')
  }

  // Validări severitate
  if (report.severity === 'grav' || report.severity === 'mortal' || report.severity === 'colectiv') {
    if (!report.notifiedITM) {
      errors.push('Pentru accidente grave/mortale/colective notificarea ITM este obligatorie')
    }
  }

  if (report.severity === 'mortal' && !report.notifiedPolice) {
    errors.push('Pentru accidente mortale notificarea Poliției este obligatorie')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Helper: Calcul termen notificare ITM (24h pentru grave, 48h pentru ușoare)
export const getITMNotificationDeadline = (
  accidentDate: string,
  severity: AccidentSeverity
): Date => {
  const accident = new Date(accidentDate)
  const hoursToAdd = ['grav', 'mortal', 'colectiv'].includes(severity) ? 24 : 48
  return new Date(accident.getTime() + hoursToAdd * 60 * 60 * 1000)
}
