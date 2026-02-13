// S-S-M.RO — PLAN DE PREVENIRE ȘI PROTECȚIE
// Template conform Legea 319/2006 privind securitatea și sănătatea în muncă
// Data: 13 Februarie 2026

export type PlanStatus = 'draft' | 'active' | 'archived' | 'needs_update'
export type RiskLevel = 'scazut' | 'mediu' | 'ridicat' | 'foarte_ridicat'
export type MeasureType = 'tehnica' | 'organizatorica' | 'instruire' | 'EIP' | 'medical'
export type MeasurePriority = 'imediata' | 'urgenta' | 'normala' | 'planificata'
export type MeasureStatus = 'planificata' | 'in_implementare' | 'implementata' | 'verificata' | 'anulata'

// ══════════════════════════════════════════════════════════════════════════════
// STRUCTURA PRINCIPALĂ PLAN PREVENIRE
// ══════════════════════════════════════════════════════════════════════════════

export interface PlanPrevenire {
  // Metadate document
  id: string
  organization_id: string
  version: string // ex: "v1.0", "v1.1"
  status: PlanStatus
  approved_by: string | null
  approved_at: string | null
  valid_from: string
  valid_until: string
  next_review_date: string

  // Date organizație (preluate automat)
  company_name: string
  cui: string
  address: string
  county: string
  contact_email: string
  contact_phone: string
  employee_count: number
  activity_caen: string | null
  activity_description: string | null

  // Responsabili
  employer_name: string
  ssm_consultant_name: string
  ssm_consultant_license: string | null
  psi_consultant_name: string | null
  psi_consultant_license: string | null

  // Secțiuni plan
  sections: {
    evaluareRiscuri: SectiuneEvaluareRiscuri
    masuri: SectiuneMasuri
    instruire: SectiuneInstruire
    supraveghereSanatate: SectiuneSupraveghereSanatate
    echipamente: SectiuneEchipamente
    semnalizare: SectiuneSemnalizare
    primAjutor: SectiunePrimAjutor
    situatiiUrgenta: SectiuneSituatiiUrgenta
  }

  // Anexe și documente asociate
  attachments: PlanAttachment[]

  created_at: string
  updated_at: string
  created_by: string
  updated_by: string | null
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. EVALUAREA RISCURILOR
// ══════════════════════════════════════════════════════════════════════════════

export interface SectiuneEvaluareRiscuri {
  lastEvaluationDate: string
  nextEvaluationDate: string
  evaluationMethod: string // ex: "Matrice risc 5x5", "Fine & Kinney"
  evaluatorName: string

  // Locuri de muncă identificate
  workplaces: WorkplaceRisk[]

  // Riscuri identificate pe categorii
  riscuriIdentificate: {
    fizice: RiskItem[]
    chimice: RiskItem[]
    biologice: RiskItem[]
    ergonomice: RiskItem[]
    psihosociale: RiskItem[]
    mecanice: RiskItem[]
    electrice: RiskItem[]
    incendiu: RiskItem[]
  }

  // Grupuri sensibile expuse
  grupuriSensibile: SensitiveGroup[]

  summary: {
    totalWorkplaces: number
    totalRisks: number
    highRisks: number
    mediumRisks: number
    lowRisks: number
  }
}

export interface WorkplaceRisk {
  id: string
  workplaceName: string // ex: "Birou administrativ", "Depozit"
  location: string
  employeeCount: number
  jobTitles: string[] // posturi din acest loc de muncă
  description: string | null
  mainActivities: string[]
  evaluationDate: string
  evaluator: string
  overallRiskLevel: RiskLevel
  notes: string | null
}

export interface RiskItem {
  id: string
  riskName: string
  description: string
  affectedWorkplaces: string[] // ID-uri din workplaces
  affectedJobTitles: string[]
  exposedEmployeesCount: number

  // Evaluare risc
  probability: 1 | 2 | 3 | 4 | 5 // 1=foarte rar, 5=foarte frecvent
  severity: 1 | 2 | 3 | 4 | 5 // 1=neglijabil, 5=catastrofal
  riskScore: number // probability × severity
  riskLevel: RiskLevel

  // Referințe legale
  legalReference: string | null // ex: "HG 1091/2006, anexa 1"
  exposureLimit: string | null // ex: "85 dBA pentru zgomot"

  // Măsuri actuale și propuse
  currentControls: string[] // măsuri existente
  proposedMeasures: string[] // ID-uri măsuri din SectiuneMasuri

  // Risc rezidual (după măsuri)
  residualRiskLevel: RiskLevel | null

  lastReviewDate: string
  nextReviewDate: string
  status: 'active' | 'controlled' | 'eliminated'
}

export interface SensitiveGroup {
  id: string
  groupType: 'gravide' | 'minori' | 'dizabilitati' | 'noapte' | 'altul'
  groupName: string
  employeeCount: number
  specificRisks: string[]
  specificMeasures: string[]
  legalReference: string | null
}

// ══════════════════════════════════════════════════════════════════════════════
// 2. MĂSURI DE PREVENIRE ȘI PROTECȚIE
// ══════════════════════════════════════════════════════════════════════════════

export interface SectiuneMasuri {
  masuri: PreventionMeasure[]

  summary: {
    totalMeasures: number
    technicalMeasures: number
    organizationalMeasures: number
    ppeMeasures: number
    implemented: number
    planned: number
    inProgress: number
  }
}

export interface PreventionMeasure {
  id: string
  measureCode: string // ex: "M-001", "M-002"
  measureName: string
  description: string
  measureType: MeasureType

  // Asocieri
  relatedRisks: string[] // ID-uri risc din evaluare
  affectedWorkplaces: string[]
  affectedJobTitles: string[]

  // Prioritate și termen
  priority: MeasurePriority
  deadline: string
  status: MeasureStatus

  // Responsabili
  responsiblePerson: string
  verifiedBy: string | null

  // Implementare
  implementationSteps: string[]
  implementationDate: string | null
  verificationDate: string | null
  verificationNotes: string | null

  // Resurse necesare
  estimatedCost: number | null
  budgetApproved: boolean
  requiredResources: string[]

  // Periodicitate
  isRecurring: boolean
  recurrenceInterval: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | null
  nextReviewDate: string | null

  // Eficiență
  effectivenessRating: 1 | 2 | 3 | 4 | 5 | null // 1=ineficient, 5=foarte eficient
  effectivenessNotes: string | null

  created_at: string
  updated_at: string
}

// ══════════════════════════════════════════════════════════════════════════════
// 3. INSTRUIRE ȘI INFORMARE
// ══════════════════════════════════════════════════════════════════════════════

export interface SectiuneInstruire {
  trainingPrograms: TrainingProgram[]

  summary: {
    totalPrograms: number
    employeesCovered: number
    upcomingTrainings: number
    expiredCertifications: number
  }
}

export interface TrainingProgram {
  id: string
  programCode: string // ex: "INST-SSM-001"
  programName: string
  programType: 'introductiv' | 'la_locul_munca' | 'periodic' | 'schimbare_loc' | 'riscuri_grave'

  // Conținut
  topics: string[]
  duration: number // ore
  methodology: string[] // ex: ["prelegere", "demonstrație practică", "teste"]
  materials: string[] // materiale folosite

  // Aplicabilitate
  targetJobTitles: string[]
  targetWorkplaces: string[]
  relatedRisks: string[]

  // Periodicitate
  frequency: 'once' | 'annual' | 'biannual' | 'as_needed'
  validityPeriod: number | null // luni

  // Trainer
  trainerName: string
  trainerQualification: string | null

  // Evaluare
  assessmentMethod: string // ex: "test scris", "demonstrație practică"
  passingScore: number | null

  // Legislație
  legalBasis: string // ex: "HG 1425/2006, art. 18-20"

  lastDeliveryDate: string | null
  nextScheduledDate: string | null

  isActive: boolean
  notes: string | null
}

// ══════════════════════════════════════════════════════════════════════════════
// 4. SUPRAVEGHEREA SĂNĂTĂȚII
// ══════════════════════════════════════════════════════════════════════════════

export interface SectiuneSupraveghereSanatate {
  medicalProvider: {
    clinicName: string
    contractNumber: string | null
    contactPerson: string | null
    phone: string | null
    email: string | null
    contractValidUntil: string | null
  }

  // Factori de risc care necesită supraveghere medicală
  medicalSurveillanceFactors: MedicalSurveillanceFactor[]

  // Program de examene
  examinationSchedule: ExaminationSchedule[]

  summary: {
    employeesUnderSurveillance: number
    upcomingExaminations: number
    expiredExaminations: number
    restrictedEmployees: number
  }
}

export interface MedicalSurveillanceFactor {
  id: string
  factorName: string
  factorType: 'fizic' | 'chimic' | 'biologic' | 'ergonomic' | 'psihosocial'
  description: string

  affectedJobTitles: string[]
  affectedEmployeesCount: number

  // Examene necesare
  requiredExaminations: string[] // ex: ["audiogramă", "spirometrie"]
  examinationFrequency: 'la_angajare' | 'periodic_6_luni' | 'periodic_12_luni' | 'periodic_24_luni' | 'la_cerere'

  // Referințe
  legalBasis: string // ex: "HG 355/2007"
  exposureLimit: string | null

  contraindications: string[] // contraindicații medicale
  notes: string | null
}

export interface ExaminationSchedule {
  id: string
  jobTitle: string
  examinationType: 'angajare' | 'periodic' | 'reluare' | 'supraveghere'
  requiredTests: string[]
  frequency: string // ex: "anual", "la 6 luni"
  nextDueDate: string
  employeesCount: number
  notes: string | null
}

// ══════════════════════════════════════════════════════════════════════════════
// 5. ECHIPAMENTE DE PROTECȚIE
// ══════════════════════════════════════════════════════════════════════════════

export interface SectiuneEchipamente {
  // Echipamente individuale de protecție (EIP)
  eipByJobTitle: JobTitleEIP[]

  // Echipamente colective de protecție
  collectiveEquipment: CollectiveEquipment[]

  // Program dotare și verificare
  maintenanceProgram: {
    inspectionFrequency: string
    responsiblePerson: string
    nextInspectionDate: string
  }

  summary: {
    jobTitlesWithEIP: number
    totalEIPTypes: number
    collectiveEquipmentCount: number
  }
}

export interface JobTitleEIP {
  id: string
  jobTitle: string
  workplace: string
  employeeCount: number

  // EIP necesare
  requiredEIP: EIPItem[]

  // Instruire
  trainingRequired: boolean
  trainingProgramId: string | null

  notes: string | null
}

export interface EIPItem {
  id: string
  eipType: string // ex: "Mănuși protecție", "Ochelari", "Căști antifonică"
  standard: string // ex: "EN 388:2016"
  specification: string // detalii tehnice

  // Asociere risc
  protectsAgainst: string[] // riscuri acoperite

  // Dotare
  quantityPerEmployee: number
  replacementFrequency: string // ex: "lunar", "la uzură"
  estimatedLifespan: string

  // Furnizor
  supplierName: string | null
  lastPurchaseDate: string | null

  issuanceRecord: boolean // dacă se ține evidență dotare
  notes: string | null
}

export interface CollectiveEquipment {
  id: string
  equipmentType: string // ex: "Ventilație", "Gard protecție", "Sistem absorbție zgomot"
  location: string
  description: string

  protectsAgainst: string[] // riscuri
  affectedWorkplaces: string[]

  // Verificare și mentenanță
  inspectionFrequency: string
  lastInspectionDate: string | null
  nextInspectionDate: string

  responsiblePerson: string
  isOperational: boolean

  notes: string | null
}

// ══════════════════════════════════════════════════════════════════════════════
// 6. SEMNALIZARE DE SECURITATE ȘI SĂNĂTATE
// ══════════════════════════════════════════════════════════════════════════════

export interface SectiuneSemnalizare {
  signagePlan: SafetySign[]

  summary: {
    totalSigns: number
    prohibitionSigns: number
    warningSigns: number
    mandatorySigns: number
    emergencySigns: number
    informationSigns: number
  }
}

export interface SafetySign {
  id: string
  signCode: string // ex: "SGN-001"
  signType: 'interzicere' | 'avertizare' | 'obligare' | 'salvare_urgenta' | 'informare' | 'stingere_incendiu'

  // Descriere
  signName: string
  pictogram: string // descriere pictogramă sau cod ISO
  message: string | null // text suplimentar dacă este cazul

  // Localizare
  location: string
  workplace: string
  quantity: number

  // Caracteristici
  isPhotoluminescent: boolean
  dimensions: string // ex: "300x200 mm"
  material: string | null

  // Justificare
  relatedRisk: string | null
  legalRequirement: string // ex: "HG 971/2006"

  installationDate: string | null
  lastInspectionDate: string | null
  condition: 'buna' | 'satisfacatoare' | 'necesita_inlocuire'

  notes: string | null
}

// ══════════════════════════════════════════════════════════════════════════════
// 7. PRIMUL AJUTOR
// ══════════════════════════════════════════════════════════════════════════════

export interface SectiunePrimAjutor {
  // Organizare prim ajutor
  firstAidOrganization: {
    firstAidersCount: number
    firstAiders: FirstAider[]
    firstAidRoomAvailable: boolean
    firstAidRoomLocation: string | null
  }

  // Trusă medicală
  firstAidKits: FirstAidKit[]

  // Proceduri
  emergencyProcedures: EmergencyProcedure[]

  // Contacte urgență
  emergencyContacts: EmergencyContact[]

  summary: {
    totalFirstAiders: number
    certificationsExpiring: number
    totalKits: number
    kitsNeedingRestock: number
  }
}

export interface FirstAider {
  id: string
  employeeName: string
  jobTitle: string
  workplace: string

  certificationNumber: string | null
  certificationDate: string
  certificationExpiry: string
  certifyingOrganization: string

  trainingHours: number
  isActive: boolean

  contactPhone: string | null
  availability: string // ex: "L-V 08:00-16:00"

  notes: string | null
}

export interface FirstAidKit {
  id: string
  kitCode: string
  location: string
  workplace: string

  kitType: 'standard' | 'industrial' | 'transportabil' | 'sala_prim_ajutor'
  capacity: string // ex: "până la 50 angajați"

  // Conținut conform Ord. 1276/2006
  contents: {
    item: string
    requiredQuantity: number
    currentQuantity: number
    expiryDate: string | null
  }[]

  lastInspectionDate: string
  nextInspectionDate: string
  responsiblePerson: string

  needsRestocking: boolean
  notes: string | null
}

export interface EmergencyProcedure {
  id: string
  procedureCode: string
  procedureName: string
  emergencyType: 'accident_munca' | 'incendiu' | 'cutremur' | 'urgenta_medicala' | 'evacuare' | 'altul'

  description: string
  steps: string[] // pași procedură

  responsiblePerson: string
  backupPerson: string | null

  // Comunicare
  alarmMethod: string // ex: "sirenă", "telefon", "megafon"
  evacuationRoutes: string[]
  assemblyPoint: string

  trainingRequired: boolean
  lastDrillDate: string | null
  nextDrillDate: string | null

  relatedDocuments: string[]
  isActive: boolean
}

export interface EmergencyContact {
  id: string
  contactType: 'salvare' | 'pompieri' | 'politie' | 'ambulanta' | 'ITM' | 'medic_medicina_muncii' | 'consultant_ssm' | 'altul'
  organizationName: string
  contactPerson: string | null
  phone: string
  alternativePhone: string | null
  email: string | null
  address: string | null
  availabilitySchedule: string | null
  displayOrder: number
}

// ══════════════════════════════════════════════════════════════════════════════
// 8. SITUAȚII DE URGENȚĂ
// ══════════════════════════════════════════════════════════════════════════════

export interface SectiuneSituatiiUrgenta {
  // Plan de evacuare
  evacuationPlan: {
    hasWrittenPlan: boolean
    planLastUpdated: string | null
    evacuationRoutes: EvacuationRoute[]
    assemblyPoints: AssemblyPoint[]
    evacuationLeaders: string[]
    lastEvacuationDrill: string | null
    nextEvacuationDrill: string
    drillFrequency: string // ex: "semestrial"
  }

  // Prevenire și stingere incendiu
  fireSafety: {
    fireRiskClass: 'A' | 'B' | 'C' | 'D' | 'mic' | 'mediu' | 'mare'
    fireExtinguishers: FireExtinguisher[]
    hydrants: Hydrant[]
    smokeDetectors: number
    fireAlarmSystem: boolean
    sprinklerSystem: boolean
    emergencyLighting: boolean
    lastFireInspection: string | null
    nextFireInspection: string
    fireInspectorName: string | null
  }

  // Responsabili situații urgență
  emergencyTeam: EmergencyTeamMember[]

  summary: {
    totalEvacuationRoutes: number
    totalAssemblyPoints: number
    fireExtinguishersCount: number
    hydrantsCount: number
    emergencyTeamSize: number
  }
}

export interface EvacuationRoute {
  id: string
  routeName: string
  fromLocation: string
  toAssemblyPoint: string
  description: string
  maxCapacity: number
  isAccessible: boolean // accesibil persoane cu dizabilități
  emergencyLighting: boolean
  signageAdequate: boolean
  lastInspectionDate: string | null
  notes: string | null
}

export interface AssemblyPoint {
  id: string
  pointName: string
  location: string
  capacity: number
  isProtected: boolean // protejat de intemperii
  hasFirstAidKit: boolean
  responsiblePerson: string
  signage: boolean
  notes: string | null
}

export interface FireExtinguisher {
  id: string
  extinguisherCode: string
  type: 'pulbere' | 'CO2' | 'spuma' | 'apa' | 'altul'
  capacity: string // ex: "6 kg"
  location: string
  fireClass: string[] // ex: ["A", "B", "C"]
  lastInspectionDate: string
  nextInspectionDate: string
  expiryDate: string
  inspectorName: string | null
  isOperational: boolean
  notes: string | null
}

export interface Hydrant {
  id: string
  hydrantCode: string
  type: 'interior' | 'exterior'
  location: string
  hoseLength: number // metri
  waterPressure: string | null
  lastInspectionDate: string
  nextInspectionDate: string
  isOperational: boolean
  notes: string | null
}

export interface EmergencyTeamMember {
  id: string
  employeeName: string
  role: 'coordonator' | 'echipa_evacuare' | 'prim_ajutor' | 'PSI' | 'comunicare' | 'altul'
  jobTitle: string
  trainingCompleted: boolean
  trainingDate: string | null
  trainingExpiry: string | null
  contactPhone: string | null
  isActive: boolean
  notes: string | null
}

// ══════════════════════════════════════════════════════════════════════════════
// ANEXE ȘI DOCUMENTE
// ══════════════════════════════════════════════════════════════════════════════

export interface PlanAttachment {
  id: string
  attachmentType: 'plan_evacuare' | 'fisa_post' | 'procedura' | 'certificat' | 'contract' | 'raport_evaluare' | 'altul'
  fileName: string
  fileSize: number
  storagePath: string
  uploadedBy: string
  uploadedAt: string
  description: string | null
  relatedSection: string | null // ce secțiune din plan
}

// ══════════════════════════════════════════════════════════════════════════════
// TEMPLATE INIȚIAL PENTRU PLAN NOU
// ══════════════════════════════════════════════════════════════════════════════

export const PLAN_PREVENIRE_EMPTY_TEMPLATE: Omit<
  PlanPrevenire,
  'id' | 'organization_id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'
> = {
  version: 'v1.0',
  status: 'draft',
  approved_by: null,
  approved_at: null,
  valid_from: new Date().toISOString().split('T')[0],
  valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  next_review_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],

  company_name: '',
  cui: '',
  address: '',
  county: '',
  contact_email: '',
  contact_phone: '',
  employee_count: 0,
  activity_caen: null,
  activity_description: null,

  employer_name: '',
  ssm_consultant_name: '',
  ssm_consultant_license: null,
  psi_consultant_name: null,
  psi_consultant_license: null,

  sections: {
    evaluareRiscuri: {
      lastEvaluationDate: new Date().toISOString().split('T')[0],
      nextEvaluationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      evaluationMethod: 'Matrice risc 5x5',
      evaluatorName: '',
      workplaces: [],
      riscuriIdentificate: {
        fizice: [],
        chimice: [],
        biologice: [],
        ergonomice: [],
        psihosociale: [],
        mecanice: [],
        electrice: [],
        incendiu: []
      },
      grupuriSensibile: [],
      summary: {
        totalWorkplaces: 0,
        totalRisks: 0,
        highRisks: 0,
        mediumRisks: 0,
        lowRisks: 0
      }
    },

    masuri: {
      masuri: [],
      summary: {
        totalMeasures: 0,
        technicalMeasures: 0,
        organizationalMeasures: 0,
        ppeMeasures: 0,
        implemented: 0,
        planned: 0,
        inProgress: 0
      }
    },

    instruire: {
      trainingPrograms: [],
      summary: {
        totalPrograms: 0,
        employeesCovered: 0,
        upcomingTrainings: 0,
        expiredCertifications: 0
      }
    },

    supraveghereSanatate: {
      medicalProvider: {
        clinicName: '',
        contractNumber: null,
        contactPerson: null,
        phone: null,
        email: null,
        contractValidUntil: null
      },
      medicalSurveillanceFactors: [],
      examinationSchedule: [],
      summary: {
        employeesUnderSurveillance: 0,
        upcomingExaminations: 0,
        expiredExaminations: 0,
        restrictedEmployees: 0
      }
    },

    echipamente: {
      eipByJobTitle: [],
      collectiveEquipment: [],
      maintenanceProgram: {
        inspectionFrequency: 'lunar',
        responsiblePerson: '',
        nextInspectionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      summary: {
        jobTitlesWithEIP: 0,
        totalEIPTypes: 0,
        collectiveEquipmentCount: 0
      }
    },

    semnalizare: {
      signagePlan: [],
      summary: {
        totalSigns: 0,
        prohibitionSigns: 0,
        warningSigns: 0,
        mandatorySigns: 0,
        emergencySigns: 0,
        informationSigns: 0
      }
    },

    primAjutor: {
      firstAidOrganization: {
        firstAidersCount: 0,
        firstAiders: [],
        firstAidRoomAvailable: false,
        firstAidRoomLocation: null
      },
      firstAidKits: [],
      emergencyProcedures: [],
      emergencyContacts: [
        {
          id: 'emergency-112',
          contactType: 'salvare',
          organizationName: 'Număr Unic de Urgență',
          contactPerson: null,
          phone: '112',
          alternativePhone: null,
          email: null,
          address: null,
          availabilitySchedule: '24/7',
          displayOrder: 1
        },
        {
          id: 'emergency-ambulance',
          contactType: 'ambulanta',
          organizationName: 'Ambulanță',
          contactPerson: null,
          phone: '112',
          alternativePhone: null,
          email: null,
          address: null,
          availabilitySchedule: '24/7',
          displayOrder: 2
        },
        {
          id: 'emergency-fire',
          contactType: 'pompieri',
          organizationName: 'Pompieri',
          contactPerson: null,
          phone: '112',
          alternativePhone: null,
          email: null,
          address: null,
          availabilitySchedule: '24/7',
          displayOrder: 3
        }
      ],
      summary: {
        totalFirstAiders: 0,
        certificationsExpiring: 0,
        totalKits: 0,
        kitsNeedingRestock: 0
      }
    },

    situatiiUrgenta: {
      evacuationPlan: {
        hasWrittenPlan: false,
        planLastUpdated: null,
        evacuationRoutes: [],
        assemblyPoints: [],
        evacuationLeaders: [],
        lastEvacuationDrill: null,
        nextEvacuationDrill: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        drillFrequency: 'semestrial'
      },
      fireSafety: {
        fireRiskClass: 'mic',
        fireExtinguishers: [],
        hydrants: [],
        smokeDetectors: 0,
        fireAlarmSystem: false,
        sprinklerSystem: false,
        emergencyLighting: false,
        lastFireInspection: null,
        nextFireInspection: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fireInspectorName: null
      },
      emergencyTeam: [],
      summary: {
        totalEvacuationRoutes: 0,
        totalAssemblyPoints: 0,
        fireExtinguishersCount: 0,
        hydrantsCount: 0,
        emergencyTeamSize: 0
      }
    }
  },

  attachments: []
}

// ══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════════════════════════

export function calculateRiskLevel(probability: number, severity: number): RiskLevel {
  const score = probability * severity

  if (score >= 20) return 'foarte_ridicat'
  if (score >= 12) return 'ridicat'
  if (score >= 6) return 'mediu'
  return 'scazut'
}

export function getRiskLevelColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    scazut: 'green',
    mediu: 'yellow',
    ridicat: 'orange',
    foarte_ridicat: 'red'
  }
  return colors[level]
}

export function getRiskLevelLabel(level: RiskLevel): string {
  const labels: Record<RiskLevel, string> = {
    scazut: 'Risc scăzut',
    mediu: 'Risc mediu',
    ridicat: 'Risc ridicat',
    foarte_ridicat: 'Risc foarte ridicat'
  }
  return labels[level]
}

export function getMeasureTypeLabel(type: MeasureType): string {
  const labels: Record<MeasureType, string> = {
    tehnica: 'Măsură tehnică',
    organizatorica: 'Măsură organizatorică',
    instruire: 'Instruire/Informare',
    EIP: 'Echipament individual protecție',
    medical: 'Supraveghere medicală'
  }
  return labels[type]
}

export function getMeasurePriorityLabel(priority: MeasurePriority): string {
  const labels: Record<MeasurePriority, string> = {
    imediata: 'Imediată (24h)',
    urgenta: 'Urgentă (1 săptămână)',
    normala: 'Normală (1 lună)',
    planificata: 'Planificată (>1 lună)'
  }
  return labels[priority]
}

export function getMeasureStatusLabel(status: MeasureStatus): string {
  const labels: Record<MeasureStatus, string> = {
    planificata: 'Planificată',
    in_implementare: 'În implementare',
    implementata: 'Implementată',
    verificata: 'Verificată',
    anulata: 'Anulată'
  }
  return labels[status]
}

export function getPlanStatusLabel(status: PlanStatus): string {
  const labels: Record<PlanStatus, string> = {
    draft: 'Ciornă',
    active: 'Activ',
    archived: 'Arhivat',
    needs_update: 'Necesită actualizare'
  }
  return labels[status]
}

export function isExpiringSoon(date: string, daysThreshold: number = 30): boolean {
  const targetDate = new Date(date)
  const today = new Date()
  const diffTime = targetDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays <= daysThreshold && diffDays >= 0
}

export function isExpired(date: string): boolean {
  const targetDate = new Date(date)
  const today = new Date()
  return targetDate < today
}

export function generateMeasureCode(existingMeasures: PreventionMeasure[]): string {
  const maxNumber = existingMeasures.reduce((max, measure) => {
    const match = measure.measureCode.match(/M-(\d+)/)
    if (match) {
      const num = parseInt(match[1], 10)
      return num > max ? num : max
    }
    return max
  }, 0)

  const nextNumber = maxNumber + 1
  return `M-${nextNumber.toString().padStart(3, '0')}`
}

export function updatePlanSummaries(plan: PlanPrevenire): PlanPrevenire {
  // Update evaluare riscuri summary
  const allRisks = [
    ...plan.sections.evaluareRiscuri.riscuriIdentificate.fizice,
    ...plan.sections.evaluareRiscuri.riscuriIdentificate.chimice,
    ...plan.sections.evaluareRiscuri.riscuriIdentificate.biologice,
    ...plan.sections.evaluareRiscuri.riscuriIdentificate.ergonomice,
    ...plan.sections.evaluareRiscuri.riscuriIdentificate.psihosociale,
    ...plan.sections.evaluareRiscuri.riscuriIdentificate.mecanice,
    ...plan.sections.evaluareRiscuri.riscuriIdentificate.electrice,
    ...plan.sections.evaluareRiscuri.riscuriIdentificate.incendiu
  ]

  plan.sections.evaluareRiscuri.summary = {
    totalWorkplaces: plan.sections.evaluareRiscuri.workplaces.length,
    totalRisks: allRisks.length,
    highRisks: allRisks.filter(r => r.riskLevel === 'ridicat' || r.riskLevel === 'foarte_ridicat').length,
    mediumRisks: allRisks.filter(r => r.riskLevel === 'mediu').length,
    lowRisks: allRisks.filter(r => r.riskLevel === 'scazut').length
  }

  // Update masuri summary
  const masuri = plan.sections.masuri.masuri
  plan.sections.masuri.summary = {
    totalMeasures: masuri.length,
    technicalMeasures: masuri.filter(m => m.measureType === 'tehnica').length,
    organizationalMeasures: masuri.filter(m => m.measureType === 'organizatorica').length,
    ppeMeasures: masuri.filter(m => m.measureType === 'EIP').length,
    implemented: masuri.filter(m => m.status === 'implementata' || m.status === 'verificata').length,
    planned: masuri.filter(m => m.status === 'planificata').length,
    inProgress: masuri.filter(m => m.status === 'in_implementare').length
  }

  return plan
}
