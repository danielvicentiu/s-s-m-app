/**
 * Confined Spaces Module - Safety Requirements and Procedures
 *
 * Comprehensive data structure for confined space work requirements
 * including definitions, atmospheric testing, permits, teams, equipment, and emergency procedures
 *
 * Compliant with Romanian SSM regulations and international standards (OSHA, EN standards)
 */

export interface ConfinedSpaceDefinition {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  examples: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface AtmosphericParameter {
  parameter: string;
  unit: string;
  safeRange: {
    min: number;
    max: number;
  };
  criticalLevels: {
    dangerLow?: number;
    dangerHigh?: number;
  };
  testingFrequency: string;
  equipment: string[];
  notes: string;
}

export interface PermitField {
  fieldId: string;
  fieldName: string;
  fieldType: 'text' | 'number' | 'date' | 'time' | 'checkbox' | 'signature' | 'select' | 'textarea';
  required: boolean;
  section: string;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  helpText?: string;
}

export interface TeamMember {
  role: string;
  responsibilities: string[];
  qualifications: string[];
  minimumNumber: number;
  equipment: string[];
}

export interface SafetyEquipment {
  id: string;
  name: string;
  category: 'atmospheric' | 'ppe' | 'rescue' | 'communication' | 'ventilation';
  mandatory: boolean;
  specifications: string[];
  inspectionFrequency: string;
  certifications: string[];
}

export interface EmergencyProcedure {
  step: number;
  action: string;
  responsibleRole: string;
  timeframe: string;
  critical: boolean;
}

export interface TrainingModule {
  id: string;
  title: string;
  duration: string;
  topics: string[];
  practicalExercises: string[];
  frequency: string;
  certification: boolean;
}

// CONFINED SPACE DEFINITIONS
export const confinedSpaceDefinitions: ConfinedSpaceDefinition[] = [
  {
    id: 'cs-tank',
    name: 'Rezervoare și Tancuri',
    description: 'Spații închise pentru depozitarea lichidelor sau gazelor',
    characteristics: [
      'Spațiu limitat pentru intrare/ieșire',
      'Ventilație naturală insuficientă',
      'Risc de acumulare gaze nocive',
      'Posibilitate de înecare în substanțe fluide'
    ],
    examples: [
      'Rezervoare de combustibil',
      'Tancuri de stocare chimicale',
      'Silozuri cerealiere',
      'Rezervoare de apă'
    ],
    riskLevel: 'critical'
  },
  {
    id: 'cs-sewer',
    name: 'Canale și Sisteme de Canalizare',
    description: 'Conducte și tuneluri pentru transport ape uzate',
    characteristics: [
      'Atmosferă toxică (H2S, CH4)',
      'Risc de explozie',
      'Spațiu restrâns',
      'Umiditate ridicată'
    ],
    examples: [
      'Canale de canalizare',
      'Puțuri de vizitare',
      'Stații de pompare',
      'Tuneluri de utilități'
    ],
    riskLevel: 'critical'
  },
  {
    id: 'cs-pit',
    name: 'Gropi și Excavații',
    description: 'Spații adânci sub nivelul solului',
    characteristics: [
      'Risc de prăbușire',
      'Deficiență de oxigen',
      'Acumulare gaze grele',
      'Dificultate de evacuare'
    ],
    examples: [
      'Gropi de inspecție',
      'Fose septice',
      'Tuneluri',
      'Cameră de cablu'
    ],
    riskLevel: 'high'
  },
  {
    id: 'cs-vessel',
    name: 'Vase și Echipamente Industriale',
    description: 'Echipamente de proces industrial închise',
    characteristics: [
      'Reziduuri chimice',
      'Temperaturi extreme posibile',
      'Spațiu confinat',
      'Accesibilitate redusă'
    ],
    examples: [
      'Reactoare chimice',
      'Cazane',
      'Schimbătoare de căldură',
      'Coloane de distilare'
    ],
    riskLevel: 'critical'
  },
  {
    id: 'cs-confined',
    name: 'Spații Închise Generale',
    description: 'Alte tipuri de spații cu acces restricționat',
    characteristics: [
      'Ventilație inadecvată',
      'Intrare/ieșire limitată',
      'Nu sunt proiectate pentru ocupare continuă'
    ],
    examples: [
      'Poduri',
      'Subsoluri',
      'Containere',
      'Tuneluri de cabluri'
    ],
    riskLevel: 'medium'
  }
];

// ATMOSPHERIC TESTING PARAMETERS
export const atmosphericParameters: AtmosphericParameter[] = [
  {
    parameter: 'Oxigen (O₂)',
    unit: '%',
    safeRange: {
      min: 19.5,
      max: 23.5
    },
    criticalLevels: {
      dangerLow: 19.5,
      dangerHigh: 23.5
    },
    testingFrequency: 'Continuu în timpul lucrului, minimum la fiecare 15 minute',
    equipment: [
      'Detector multi-gaz cu senzor O₂',
      'Detector portabil cu alarmă',
      'Sistem de monitorizare continuă'
    ],
    notes: 'PRIORITATE 1: Testarea oxigenului se face PRIMA, înainte de orice altă măsurătoare. Sub 19.5% = INTERZIS ACCESUL'
  },
  {
    parameter: 'Limite Explozive Inferioare (LEL)',
    unit: '%',
    safeRange: {
      min: 0,
      max: 10
    },
    criticalLevels: {
      dangerHigh: 10
    },
    testingFrequency: 'Continuu, la fiecare 15 minute minimum',
    equipment: [
      'Explosimetru certificat',
      'Detector multi-gaz cu senzor combustibil',
      'Sistem de alarmă automată'
    ],
    notes: 'Peste 10% LEL = EVACUARE IMEDIATĂ. Peste 25% LEL = RISC MAJOR DE EXPLOZIE'
  },
  {
    parameter: 'Hidrogen Sulfurat (H₂S)',
    unit: 'ppm',
    safeRange: {
      min: 0,
      max: 10
    },
    criticalLevels: {
      dangerHigh: 10
    },
    testingFrequency: 'Continuu în zonele cu risc de H₂S',
    equipment: [
      'Detector H₂S dedicat',
      'Detector multi-gaz cu senzor H₂S',
      'Alarmă cu prag configurat la 10 ppm'
    ],
    notes: 'GAZ EXTREM DE TOXIC. 10-100 ppm = iritații, >100 ppm = pericol mortal, >500 ppm = moarte rapidă. Miros de ouă stricate dispare la concentrații înalte!'
  },
  {
    parameter: 'Monoxid de Carbon (CO)',
    unit: 'ppm',
    safeRange: {
      min: 0,
      max: 35
    },
    criticalLevels: {
      dangerHigh: 35
    },
    testingFrequency: 'Continuu, verificare la fiecare 15 minute',
    equipment: [
      'Detector CO certificat',
      'Detector multi-gaz cu senzor CO',
      'Sistem de monitorizare continuă'
    ],
    notes: 'GAZ INCOLOR, INODOR, TOXIC. Peste 35 ppm = depășire limită expunere 8h. Peste 200 ppm = simptome severe în 2-3 ore'
  },
  {
    parameter: 'Dioxid de Carbon (CO₂)',
    unit: 'ppm',
    safeRange: {
      min: 0,
      max: 5000
    },
    criticalLevels: {
      dangerHigh: 5000
    },
    testingFrequency: 'La intrarea în spațiu și periodic',
    equipment: [
      'Detector CO₂',
      'Detector multi-gaz'
    ],
    notes: '5000 ppm (0.5%) = limită 8h TWA. Peste 4% = respirație dificilă, peste 10% = pierdere conștiență rapidă'
  }
];

// WORK PERMIT TEMPLATE FIELDS
export const permitTemplateFields: PermitField[] = [
  // SECTION 1: GENERAL INFORMATION
  {
    fieldId: 'permit_number',
    fieldName: 'Număr Permis',
    fieldType: 'text',
    required: true,
    section: 'Informații Generale',
    validation: {
      pattern: '^CS-[0-9]{4}-[0-9]{4}$'
    },
    helpText: 'Format: CS-YYYY-NNNN'
  },
  {
    fieldId: 'issue_date',
    fieldName: 'Data Emiterii',
    fieldType: 'date',
    required: true,
    section: 'Informații Generale'
  },
  {
    fieldId: 'valid_from',
    fieldName: 'Valabil De La',
    fieldType: 'time',
    required: true,
    section: 'Informații Generale'
  },
  {
    fieldId: 'valid_until',
    fieldName: 'Valabil Până La',
    fieldType: 'time',
    required: true,
    section: 'Informații Generale',
    helpText: 'Maxim 8 ore per permis. Pentru lucrări mai lungi, emiteți permis nou'
  },
  {
    fieldId: 'location',
    fieldName: 'Locația Spațiului Închis',
    fieldType: 'textarea',
    required: true,
    section: 'Informații Generale',
    helpText: 'Descriere detaliată: adresă, hală, nivel, identificare echipament'
  },
  {
    fieldId: 'space_type',
    fieldName: 'Tipul Spațiului',
    fieldType: 'select',
    required: true,
    section: 'Informații Generale',
    options: [
      'Rezervor/Tanc',
      'Canal/Canalizare',
      'Groapă/Excavație',
      'Vas Industrial',
      'Tunel',
      'Siloz',
      'Puț',
      'Altul'
    ]
  },
  {
    fieldId: 'work_description',
    fieldName: 'Descrierea Lucrării',
    fieldType: 'textarea',
    required: true,
    section: 'Informații Generale',
    helpText: 'Descriere detaliată a operațiunilor ce vor fi efectuate'
  },

  // SECTION 2: ATMOSPHERIC TESTING
  {
    fieldId: 'oxygen_level',
    fieldName: 'Nivel Oxigen (%)',
    fieldType: 'number',
    required: true,
    section: 'Testare Atmosferă',
    validation: {
      min: 0,
      max: 25
    },
    helpText: 'Interval sigur: 19.5% - 23.5%'
  },
  {
    fieldId: 'lel_level',
    fieldName: 'LEL (%)',
    fieldType: 'number',
    required: true,
    section: 'Testare Atmosferă',
    validation: {
      min: 0,
      max: 100
    },
    helpText: 'Trebuie să fie sub 10%'
  },
  {
    fieldId: 'h2s_level',
    fieldName: 'H₂S (ppm)',
    fieldType: 'number',
    required: true,
    section: 'Testare Atmosferă',
    validation: {
      min: 0,
      max: 1000
    },
    helpText: 'Limită: 10 ppm'
  },
  {
    fieldId: 'co_level',
    fieldName: 'CO (ppm)',
    fieldType: 'number',
    required: true,
    section: 'Testare Atmosferă',
    validation: {
      min: 0,
      max: 1000
    },
    helpText: 'Limită: 35 ppm'
  },
  {
    fieldId: 'co2_level',
    fieldName: 'CO₂ (ppm)',
    fieldType: 'number',
    required: false,
    section: 'Testare Atmosferă',
    helpText: 'Limită: 5000 ppm (0.5%)'
  },
  {
    fieldId: 'testing_equipment',
    fieldName: 'Echipament Testare Utilizat',
    fieldType: 'text',
    required: true,
    section: 'Testare Atmosferă',
    helpText: 'Model, număr serie, data ultimei calibrări'
  },
  {
    fieldId: 'continuous_monitoring',
    fieldName: 'Monitorizare Continuă Activată',
    fieldType: 'checkbox',
    required: true,
    section: 'Testare Atmosferă'
  },

  // SECTION 3: HAZARD ASSESSMENT
  {
    fieldId: 'hazard_isolation',
    fieldName: 'Izolare Surse Periculoase',
    fieldType: 'checkbox',
    required: true,
    section: 'Evaluare Pericole',
    helpText: 'LOTO aplicat, conducte blocate, etc.'
  },
  {
    fieldId: 'ventilation_required',
    fieldName: 'Ventilație Necesară',
    fieldType: 'checkbox',
    required: true,
    section: 'Evaluare Pericole'
  },
  {
    fieldId: 'ventilation_type',
    fieldName: 'Tip Ventilație',
    fieldType: 'select',
    required: false,
    section: 'Evaluare Pericole',
    options: [
      'Naturală',
      'Mecanică - Suflare',
      'Mecanică - Exhaustare',
      'Mixtă'
    ]
  },
  {
    fieldId: 'hot_work',
    fieldName: 'Lucrări la Cald',
    fieldType: 'checkbox',
    required: true,
    section: 'Evaluare Pericole',
    helpText: 'Sudură, tăiere, șlefuire - necesită permis separat'
  },
  {
    fieldId: 'confined_space_cleaned',
    fieldName: 'Spațiu Curățat și Ventilat',
    fieldType: 'checkbox',
    required: true,
    section: 'Evaluare Pericole'
  },
  {
    fieldId: 'special_hazards',
    fieldName: 'Pericole Speciale Identificate',
    fieldType: 'textarea',
    required: false,
    section: 'Evaluare Pericole',
    helpText: 'Chimicale reziduale, temperaturi extreme, electricitate, etc.'
  },

  // SECTION 4: TEAM AND RESPONSIBILITIES
  {
    fieldId: 'entry_supervisor_name',
    fieldName: 'Supervizor Intrare - Nume',
    fieldType: 'text',
    required: true,
    section: 'Echipă și Responsabilități'
  },
  {
    fieldId: 'entry_supervisor_signature',
    fieldName: 'Supervizor Intrare - Semnătură',
    fieldType: 'signature',
    required: true,
    section: 'Echipă și Responsabilități'
  },
  {
    fieldId: 'attendant_name',
    fieldName: 'Supraveghetor Exterior - Nume',
    fieldType: 'text',
    required: true,
    section: 'Echipă și Responsabilități'
  },
  {
    fieldId: 'attendant_signature',
    fieldName: 'Supraveghetor Exterior - Semnătură',
    fieldType: 'signature',
    required: true,
    section: 'Echipă și Responsabilități'
  },
  {
    fieldId: 'entrants',
    fieldName: 'Persoane Autorizate Intrare',
    fieldType: 'textarea',
    required: true,
    section: 'Echipă și Responsabilități',
    helpText: 'Nume complet, funcție - câte unul pe linie'
  },
  {
    fieldId: 'rescue_team',
    fieldName: 'Echipă Salvare Desemnată',
    fieldType: 'text',
    required: true,
    section: 'Echipă și Responsabilități',
    helpText: 'Echipă internă sau externă, număr telefon contact'
  },

  // SECTION 5: EQUIPMENT AND PPE
  {
    fieldId: 'ppe_required',
    fieldName: 'EIP Necesar',
    fieldType: 'textarea',
    required: true,
    section: 'Echipament și EIP',
    helpText: 'Listați tot echipamentul de protecție necesar'
  },
  {
    fieldId: 'breathing_apparatus',
    fieldName: 'Aparat Respirator',
    fieldType: 'select',
    required: true,
    section: 'Echipament și EIP',
    options: [
      'Nu este necesar',
      'SCBA (Self-Contained Breathing Apparatus)',
      'Mască cu filtru',
      'Sistem cu aer suflat'
    ]
  },
  {
    fieldId: 'retrieval_system',
    fieldName: 'Sistem de Recuperare',
    fieldType: 'checkbox',
    required: true,
    section: 'Echipament și EIP',
    helpText: 'Ham + coardă + troliu/tripod'
  },
  {
    fieldId: 'communication_method',
    fieldName: 'Metodă Comunicare',
    fieldType: 'select',
    required: true,
    section: 'Echipament și EIP',
    options: [
      'Radio portabil',
      'Telefon',
      'Semnale vizuale',
      'Semnale prin tragere coardă'
    ]
  },
  {
    fieldId: 'lighting',
    fieldName: 'Iluminat Antiex',
    fieldType: 'checkbox',
    required: true,
    section: 'Echipament și EIP'
  },

  // SECTION 6: EMERGENCY PROCEDURES
  {
    fieldId: 'emergency_contacts',
    fieldName: 'Contacte Urgență',
    fieldType: 'textarea',
    required: true,
    section: 'Proceduri Urgență',
    helpText: 'Pompieri: 112, Salvare: contact echipă, Manager SSM: telefon'
  },
  {
    fieldId: 'evacuation_plan',
    fieldName: 'Plan Evacuare Stabilit',
    fieldType: 'checkbox',
    required: true,
    section: 'Proceduri Urgență'
  },
  {
    fieldId: 'rescue_equipment_location',
    fieldName: 'Locație Echipament Salvare',
    fieldType: 'text',
    required: true,
    section: 'Proceduri Urgență'
  },

  // SECTION 7: AUTHORIZATIONS
  {
    fieldId: 'ssm_manager_name',
    fieldName: 'Manager SSM - Nume',
    fieldType: 'text',
    required: true,
    section: 'Autorizări'
  },
  {
    fieldId: 'ssm_manager_signature',
    fieldName: 'Manager SSM - Semnătură',
    fieldType: 'signature',
    required: true,
    section: 'Autorizări'
  },
  {
    fieldId: 'ssm_manager_date',
    fieldName: 'Manager SSM - Data',
    fieldType: 'date',
    required: true,
    section: 'Autorizări'
  },
  {
    fieldId: 'operations_manager_name',
    fieldName: 'Manager Operațiuni - Nume',
    fieldType: 'text',
    required: true,
    section: 'Autorizări'
  },
  {
    fieldId: 'operations_manager_signature',
    fieldName: 'Manager Operațiuni - Semnătură',
    fieldType: 'signature',
    required: true,
    section: 'Autorizări'
  },
  {
    fieldId: 'permit_closed_date',
    fieldName: 'Data Închidere Permis',
    fieldType: 'date',
    required: false,
    section: 'Autorizări'
  },
  {
    fieldId: 'permit_closed_signature',
    fieldName: 'Semnătură Închidere Permis',
    fieldType: 'signature',
    required: false,
    section: 'Autorizări'
  }
];

// MINIMUM TEAM REQUIREMENTS
export const minimumTeam: TeamMember[] = [
  {
    role: 'Supervizor Intrare (Entry Supervisor)',
    responsibilities: [
      'Coordonează toate activitățile din spațiul închis',
      'Verifică completarea permisului de lucru',
      'Asigură testarea atmosferei înainte și în timpul lucrului',
      'Autorizează intrarea și evacuarea',
      'Anulează permisul dacă apar condiții periculoase',
      'Verifică echipamentul și instruirea echipei'
    ],
    qualifications: [
      'Instruire specifică spații închise - nivel avansat',
      'Experiență minimum 2 ani în domeniu',
      'Cunoștințe despre pericolele specifice locației',
      'Certificat valabil pentru lucru în spații închise'
    ],
    minimumNumber: 1,
    equipment: [
      'Detector multi-gaz',
      'Copie permis de lucru',
      'Mijloc de comunicare',
      'Lista echipă și contacte urgență'
    ]
  },
  {
    role: 'Supraveghetor Exterior (Attendant/Hole Watch)',
    responsibilities: [
      'NU părăsește zona de intrare pentru NICIUN motiv',
      'Monitorizează continuu lucrătorii din interior',
      'Menține comunicare permanentă cu cei din interior',
      'Monitorizează detectorul de gaze',
      'Interzice accesul persoanelor neautorizate',
      'NU intră în spațiu pentru salvare - alertează echipa de salvare',
      'Declanșează procedurile de urgență la nevoie'
    ],
    qualifications: [
      'Instruire specifică rol de supraveghetor exterior',
      'Cunoaștere proceduri de urgență',
      'Capacitate de a recunoaște semnele de pericol',
      'Certificat valabil'
    ],
    minimumNumber: 1,
    equipment: [
      'Mijloc de comunicare (radio + telefon)',
      'Detector de gaze cu alarmă vizibilă',
      'Copie permis de lucru',
      'Lista contacte urgență',
      'Fluier sau sirenă de alarmă'
    ]
  },
  {
    role: 'Lucrător Autorizat (Authorized Entrant)',
    responsibilities: [
      'Cunoaște pericolele spațiului închis',
      'Utilizează corect echipamentul de protecție',
      'Menține comunicare cu supraveghetorul exterior',
      'Alertează despre orice condiție periculoasă',
      'Evacuează IMEDIAT la semnalul de alarmă',
      'Poartă echipamentul de recuperare atașat'
    ],
    qualifications: [
      'Instruire specifică spații închise',
      'Apt medical pentru lucru în spații închise',
      'Instruire utilizare EIP specific',
      'Instruire prim ajutor (recomandat)',
      'Certificat valabil'
    ],
    minimumNumber: 1,
    equipment: [
      'EIP complet conform evaluării',
      'Ham de siguranță cu punct de ancorare dorsal',
      'Cască cu iluminat antiex',
      'Radio portabil sau sistem comunicare',
      'Detector personal de gaze (recomandat)'
    ]
  },
  {
    role: 'Echipă Salvare (Rescue Team)',
    responsibilities: [
      'Disponibilă IMEDIAT în caz de urgență',
      'Instruită în tehnici salvare spații închise',
      'Dotată cu echipament salvare complet',
      'Efectuează extragerea victimelor în siguranță',
      'Acordă primul ajutor',
      'NU intră fără echipament de respirat autonom'
    ],
    qualifications: [
      'Instruire avansată salvare spații închise',
      'Certificat SCBA (Self-Contained Breathing Apparatus)',
      'Primul ajutor',
      'Antrenament regulat (trimestrial)',
      'Apt medical',
      'CPR certification'
    ],
    minimumNumber: 2,
    equipment: [
      'SCBA (aparate respirat autonome)',
      'Sistem recuperare (troliu/tripod + coardă)',
      'Ham salvare full-body',
      'Trusa prim ajutor avansată',
      'Mijloace comunicare',
      'Iluminat puternic antiex',
      'Detector multi-gaz',
      'Targetă/scăpare'
    ]
  }
];

// MANDATORY SAFETY EQUIPMENT
export const mandatorySafetyEquipment: SafetyEquipment[] = [
  {
    id: 'eq-multigas',
    name: 'Detector Multi-Gaz',
    category: 'atmospheric',
    mandatory: true,
    specifications: [
      'Senzorii: O₂, LEL, H₂S, CO (minimum)',
      'Alarme sonore și vizuale',
      'Calibrat în ultimele 30 zile',
      'Certificat ATEX/IECEx pentru zone cu risc de explozie',
      'Baterii încărcate complet',
      'Certificat de calibrare valabil'
    ],
    inspectionFrequency: 'Zilnic înainte de utilizare + calibrare lunară',
    certifications: ['ATEX', 'IECEx', 'ISO 17025 (laborator calibrare)']
  },
  {
    id: 'eq-ventilation',
    name: 'Sistem Ventilație Mecanică',
    category: 'ventilation',
    mandatory: true,
    specifications: [
      'Capacitate minimum 6 schimburi aer/oră',
      'Motor antiex dacă atmosferă potențial explozivă',
      'Furtune antistatice',
      'Debit verificabil',
      'Admisie aer curat verificată'
    ],
    inspectionFrequency: 'Înainte de fiecare utilizare',
    certifications: ['ATEX (dacă aplicabil)', 'CE']
  },
  {
    id: 'eq-retrieval',
    name: 'Sistem Recuperare (Tripod + Troliu)',
    category: 'rescue',
    mandatory: true,
    specifications: [
      'Capacitate minimum 200 kg',
      'Tripod cu înălțime reglabilă',
      'Troliu manual sau electric certificat',
      'Coardă/cablu 10-30m (funcție de adâncime)',
      'Frână automată',
      'Certificat de conformitate valabil'
    ],
    inspectionFrequency: 'Lunar + înainte de utilizare',
    certifications: ['EN 795', 'EN 1496', 'Certificate de conformitate']
  },
  {
    id: 'eq-harness',
    name: 'Ham Full-Body cu D-Ring Dorsal',
    category: 'ppe',
    mandatory: true,
    specifications: [
      'Punct ancorare dorsal pentru recuperare verticală',
      'Ham full-body (nu centură)',
      'Dimensiune corectă pentru purtător',
      'Fără deteriorări vizibile',
      'Etichetă identificare intactă cu data fabricației'
    ],
    inspectionFrequency: 'Înainte de fiecare utilizare + inspecție anuală de către persoană competentă',
    certifications: ['EN 361', 'ANSI Z359.11']
  },
  {
    id: 'eq-scba',
    name: 'SCBA (Aparat Respirat Autonom)',
    category: 'ppe',
    mandatory: false,
    specifications: [
      'Butelie cu minimum 30 minute autonomie',
      'Presiune completă (200-300 bar)',
      'Mască facială cu vedere completă',
      'Sistem alarmă presiune joasă funcțional',
      'Inspecție tehnică la zi'
    ],
    inspectionFrequency: 'Lunar + înainte de utilizare',
    certifications: ['EN 137', 'NIOSH']
  },
  {
    id: 'eq-radio',
    name: 'Sistem Comunicare (Radio Portabil)',
    category: 'communication',
    mandatory: true,
    specifications: [
      'Certificat ATEX pentru zona cu risc',
      'Baterii încărcate',
      'Testat funcționalitate comunicare din interiorul spațiului',
      'Canal dedicat operațiunii',
      'Backup (telefon mobil pentru supraveghetor)'
    ],
    inspectionFrequency: 'Înainte de fiecare utilizare',
    certifications: ['ATEX (dacă aplicabil)', 'CE']
  },
  {
    id: 'eq-lighting',
    name: 'Iluminat Antiex',
    category: 'ppe',
    mandatory: true,
    specifications: [
      'Certificat ATEX/IECEx',
      'Lanternă frontală + lanternă portabilă',
      'Baterii încărcate complet',
      'Funcționalitate verificată',
      'Minimum 200 lumeni'
    ],
    inspectionFrequency: 'Înainte de fiecare utilizare',
    certifications: ['ATEX', 'IECEx']
  },
  {
    id: 'eq-firstaid',
    name: 'Trusă Prim Ajutor Avansată',
    category: 'rescue',
    mandatory: true,
    specifications: [
      'Echipament resuscitare (BVM)',
      'Oxigen medical portabil (opțional dar recomandat)',
      'Bandaje, comprese sterile',
      'Termocuverturi',
      'Defibrillator AED (recomandat)',
      'Verificată complet, fără materiale expirate'
    ],
    inspectionFrequency: 'Lunar',
    certifications: ['Conforme standarde medicale']
  },
  {
    id: 'eq-ppe-standard',
    name: 'EIP Standard',
    category: 'ppe',
    mandatory: true,
    specifications: [
      'Cască protecție',
      'Ochelari/vizor protecție',
      'Mănuși protecție (funcție de pericol specific)',
      'Bocanci de siguranță',
      'Îmbrăcăminte protecție (funcție de pericol)',
      'Protecție auditivă (dacă necesar)',
      'Toate certificate CE, în stare bună'
    ],
    inspectionFrequency: 'Înainte de fiecare utilizare',
    certifications: ['EN 397 (cască)', 'EN 166 (ochelari)', 'EN 388 (mănuși)', 'EN ISO 20345 (bocanci)']
  }
];

// EMERGENCY PROCEDURES
export const emergencyProcedures: EmergencyProcedure[] = [
  {
    step: 1,
    action: 'SUPRAVEGHETOR EXTERIOR: La primul semn de pericol (alarmă gaze, strigăt, pierdere contact, comportament anormal) - ACTIVEAZĂ ALARMA! Trage de coardă pentru semnal evacuare.',
    responsibleRole: 'Supraveghetor Exterior',
    timeframe: 'IMEDIAT (0-5 secunde)',
    critical: true
  },
  {
    step: 2,
    action: 'SUPRAVEGHETOR EXTERIOR: Sună 112 și alertează echipa de salvare desemnată. NU intra în spațiu pentru salvare! Menține poziția la intrare.',
    responsibleRole: 'Supraveghetor Exterior',
    timeframe: 'IMEDIAT (5-15 secunde)',
    critical: true
  },
  {
    step: 3,
    action: 'LUCRĂTORI INTERIOR: La semnalul de alarmă - OPRIRE IMEDIAT activități și EVACUARE prin cea mai apropiată ieșire. NU încerca să ajuți colegii inconștienți - evacuează-te!',
    responsibleRole: 'Lucrători Autorizați',
    timeframe: 'IMEDIAT',
    critical: true
  },
  {
    step: 4,
    action: 'SUPERVIZOR INTRARE: Alertează toate persoanele din zonă, oprește orice activitate, asigură-te că supraveghetorul a sunat la urgență, pregătește zona pentru echipa de salvare.',
    responsibleRole: 'Supervizor Intrare',
    timeframe: '0-30 secunde',
    critical: true
  },
  {
    step: 5,
    action: 'ECHIPĂ SALVARE: Echipează SCBA și echipament salvare COMPLET înainte de intrare. NU intra NICIODATĂ fără SCBA, chiar dacă victima e vizibilă!',
    responsibleRole: 'Echipă Salvare',
    timeframe: '1-3 minute',
    critical: true
  },
  {
    step: 6,
    action: 'ECHIPĂ SALVARE: Atașează sisteme de siguranță și comunicare. Minimum 2 salvatori - unul intră, unul asigură din exterior. Folosește sistemul de recuperare pentru extragere.',
    responsibleRole: 'Echipă Salvare',
    timeframe: '2-5 minute',
    critical: true
  },
  {
    step: 7,
    action: 'Extragere victimă folosind ham și sistem de recuperare. Tractare controlată, evitare lovituri. Mutare în zonă sigură, aer curat.',
    responsibleRole: 'Echipă Salvare',
    timeframe: '5-10 minute',
    critical: true
  },
  {
    step: 8,
    action: 'Evaluare victimă: verifică conștiența, respirația, pulsul. Începe resuscitare (CPR) dacă necesar. Administrează oxigen dacă disponibil. Poziție de siguranță dacă inconștientă dar respiră.',
    responsibleRole: 'Echipă Salvare / Prim Ajutor',
    timeframe: 'IMEDIAT după extragere',
    critical: true
  },
  {
    step: 9,
    action: 'Continuă resuscitare și îngrijiri până la sosirea ambulanței. Informează paramedicii despre: tipul spațiului, durata expunerii, tipul de gaze detectate, măsuri luate.',
    responsibleRole: 'Echipă Prim Ajutor',
    timeframe: 'Continuu până la predare către personal medical',
    critical: true
  },
  {
    step: 10,
    action: 'Anulare permis lucru, izolare zonă, păstrare echipament pentru investigație. NU permite reluarea lucrului fără aprobare management și SSM.',
    responsibleRole: 'Supervizor Intrare',
    timeframe: 'După stabilizare situație',
    critical: false
  },
  {
    step: 11,
    action: 'Investigație incident: echipă SSM documentează cauza, interviază martori, verifică echipament. Raportare ITM conform legislației (în max 24 ore pentru accidente grave).',
    responsibleRole: 'Manager SSM',
    timeframe: '24-48 ore',
    critical: false
  }
];

// TRAINING MODULES
export const trainingModules: TrainingModule[] = [
  {
    id: 'csm-basic',
    title: 'Instruire Inițială - Lucru în Spații Închise',
    duration: '8 ore (1 zi)',
    topics: [
      'Definiții și tipuri de spații închise',
      'Identificare pericole: atmosferice, fizice, chimice, biologice',
      'Legislație SSM aplicabilă (OUG 111/2010, Norme SSM)',
      'Anatomia permisului de lucru',
      'Roluri și responsabilități echipă',
      'Testare atmosferă - teorie și practică',
      'EIP specific și utilizare corectă',
      'Proceduri de intrare și evacuare',
      'Principii de bază salvare și prim ajutor',
      'Studii de caz - accidente reale'
    ],
    practicalExercises: [
      'Utilizare detector multi-gaz - calibrare și testare',
      'Echipare corectă ham și sistem recuperare',
      'Completare permis de lucru - exercițiu',
      'Simulare comunicare interior-exterior',
      'Simulare alarmă și evacuare'
    ],
    frequency: 'Inițial + Reîmprospătare anuală',
    certification: true
  },
  {
    id: 'csm-entrant',
    title: 'Instruire Lucrător Autorizat (Entrant)',
    duration: '4 ore',
    topics: [
      'Responsabilități specifice lucrător autorizat',
      'Recunoaștere simptome expunere la gaze',
      'Utilizare EIP specific',
      'Comunicare eficientă cu supraveghetorul',
      'Când și cum să evacuezi',
      'Proceduri urgență din perspectiva lucrătorului'
    ],
    practicalExercises: [
      'Echipare completă EIP sub cronometru',
      'Intrare și ieșire dintr-un spațiu simulat',
      'Comunicare prin radio în condiții de zgomot',
      'Răspuns la semnale alarmă'
    ],
    frequency: 'Anual',
    certification: true
  },
  {
    id: 'csm-attendant',
    title: 'Instruire Supraveghetor Exterior (Attendant)',
    duration: '6 ore',
    topics: [
      'Responsabilități critice ale supraveghetorului',
      'DE CE NU intri NICIODATĂ pentru salvare',
      'Monitorizare continuă - ce să urmărești',
      'Utilizare detector gaze și interpretare alarme',
      'Activare proceduri urgență',
      'Gestionare stres în situații de criză',
      'Comunicare cu echipa de salvare și servicii urgență'
    ],
    practicalExercises: [
      'Monitorizare lucrători în spațiu simulat',
      'Simulare pierdere contact - declanșare alarmă',
      'Apel 112 - exercițiu comunicare clară',
      'Scenarii de criză - luare decizii rapide'
    ],
    frequency: 'Anual',
    certification: true
  },
  {
    id: 'csm-supervisor',
    title: 'Instruire Supervizor Intrare (Entry Supervisor)',
    duration: '8 ore',
    topics: [
      'Rolul de lider al operațiunii',
      'Evaluare completă pericole',
      'Completare și autorizare permis',
      'Verificare competențe echipă',
      'Testare atmosferă - protocoale avansate',
      'Când să anulezi un permis',
      'Coordonare cu alte permise (lucru la cald, LOTO)',
      'Investigație incidente',
      'Documentare și raportare'
    ],
    practicalExercises: [
      'Evaluare completă locație reală',
      'Completare permis lucru - scenarii complexe',
      'Inspecție echipament - identificare neconformități',
      'Simulare coordonare operațiune completă',
      'Simulare situație critică - decizie anulare permis'
    ],
    frequency: 'Inițial + Reîmprospătare la 2 ani',
    certification: true
  },
  {
    id: 'csm-rescue',
    title: 'Instruire Echipă Salvare Spații Închise',
    duration: '16 ore (2 zile)',
    topics: [
      'Tehnici avansate salvare din spații închise',
      'Utilizare SCBA în situații de urgență',
      'Sisteme de recuperare - verticală și orizontală',
      'Evaluare rapidă victimă în condiții periculoase',
      'CPR și prim ajutor avansat',
      'Lucru în echipă sub presiune',
      'Proceduri salvare pentru diferite tipuri spații',
      'Autosalvare și salvare coechipier',
      'Gestionare stres post-traumatic'
    ],
    practicalExercises: [
      'Exercițiu complet: echipare SCBA sub 2 minute',
      'Coborâre în spațiu cu SCBA + extragere manechin',
      'Salvare din rezervor orizontal',
      'Salvare din canal vertical adânc',
      'CPR în condiții dificile (spațiu restrâns)',
      'Simulare incident cu multiple victime',
      'Exercițiu nocturn',
      'Simulare condiții meteo adverse'
    ],
    frequency: 'Inițial + Reîmprospătare anuală + Exerciții trimestriale',
    certification: true
  },
  {
    id: 'csm-atmospheric',
    title: 'Testare și Monitorizare Atmosferă',
    duration: '4 ore',
    topics: [
      'Tipuri de pericole atmosferice',
      'Funcționarea detectorilor multi-gaz',
      'Calibrare și bump-test',
      'Interpretare citiri și alarme',
      'Ordinea testării: O₂ → LEL → Toxic (H₂S, CO)',
      'Strategii de testare pentru spații mari',
      'Detectoare portabile vs fixe vs continue',
      'Înregistrare și documentare rezultate',
      'Când atmosfera devine IDLH (Immediately Dangerous to Life or Health)'
    ],
    practicalExercises: [
      'Calibrare detector multi-gaz - procedură completă',
      'Bump test pre-utilizare',
      'Testare atmosferă în spațiu simulat - zonare',
      'Identificare gaze - exercițiu orb',
      'Interpretare alarme - scenarii diverse'
    ],
    frequency: 'Anual pentru personal care efectuează teste',
    certification: true
  },
  {
    id: 'csm-hotwork',
    title: 'Lucrări la Cald în Spații Închise',
    duration: '4 ore',
    topics: [
      'Pericole combinate: atmosferă + lucru la cald',
      'Când e INTERZIS lucrul la cald',
      'Pregătire spațiu pentru sudură/tăiere',
      'Monitorizare continuă LEL',
      'Ventilație forțată pentru evacuare fum',
      'Permise multiple - coordonare',
      'Pază anti-incendiu în timpul și după lucrări',
      'Echipament PPE suplimentar'
    ],
    practicalExercises: [
      'Evaluare risc pentru lucrare la cald',
      'Pregătire spațiu - curățare reziduuri inflamabile',
      'Monitorizare LEL în timp real în timpul sudării simulate',
      'Stingere incendiu în spațiu închis - exercițiu'
    ],
    frequency: 'La nevoie, pentru personal calificat sudură',
    certification: false
  }
];

// EXPORT UTILITY FUNCTIONS
export const getPermitFieldsBySection = (section: string): PermitField[] => {
  return permitTemplateFields.filter(field => field.section === section);
};

export const getAtmosphericTestingChecklist = (): string[] => {
  return [
    '1. Verifică calibrarea detectorului (ultimele 30 zile)',
    '2. Efectuează bump test înainte de utilizare',
    '3. Testează ÎNTOTDEAUNA în ordinea: O₂ → LEL → H₂S → CO',
    '4. Testează la TOATE nivelurile spațiului (sus, mijloc, jos)',
    '5. Testează înainte de intrare și CONTINUU în timpul lucrului',
    '6. Dacă orice parametru iese din interval SIGUR → OPRIRE, EVACUARE, VENTILARE',
    '7. Așteaptă minimum 15-30 minute ventilare forțată, apoi RE-TESTEAZĂ',
    '8. Documentează TOATE citirile în permisul de lucru',
    '9. Menține alarmele activate pe detector',
    '10. Asigură-te că supraveghetorul poate vedea detectorul'
  ];
};

export const getPreEntryChecklist = (): string[] => {
  return [
    '☐ Permis de lucru completat și autorizat de persoane competente',
    '☐ Toate persoanele implicate au fost instruite și sunt calificate',
    '☐ Atmosfera a fost testată și este SIGURĂ (O₂: 19.5-23.5%, LEL <10%, H₂S <10ppm, CO <35ppm)',
    '☐ Ventilație mecanică instalată și funcțională (dacă necesară)',
    '☐ Izolarea surselor de energie finalizată (LOTO)',
    '☐ Spațiul a fost curățat de reziduuri periculoase',
    '☐ Sistem de recuperare instalat și testat',
    '☐ EIP complet disponibil și verificat',
    '☐ Sistem de comunicare testat (radio, telefon)',
    '☐ Supraveghetor exterior desemnat și la post',
    '☐ Echipă de salvare alertată și disponibilă',
    '☐ Echipament de urgență la locație (SCBA, trusă prim ajutor)',
    '☐ Contacte urgență afișate vizibil',
    '☐ Zonă securizată - accesul neautorizaților blocat',
    '☐ Iluminat adecvat verificat',
    '☐ Condiții meteo acceptabile (dacă relevant)',
    '☐ Detector multi-gaz calibrat și funcțional',
    '☐ Briefing de siguranță efectuat cu toată echipa'
  ];
};

export const getCommonMistakesAndHowToAvoidThem = (): Array<{mistake: string, consequence: string, prevention: string}> => {
  return [
    {
      mistake: 'Intrare fără testare atmosferă sau bazându-se pe un singur test',
      consequence: 'Moarte prin asfixiere, intoxicare sau explozie. 60% din decesele în spații închise',
      prevention: 'Testare OBLIGATORIE înainte de intrare + monitorizare CONTINUĂ. Verifică la toate nivelurile.'
    },
    {
      mistake: 'Supraveghetor exterior intră pentru salvare fără echipament',
      consequence: '30% din victime sunt salvatori improvizați! Transformi 1 victimă în 2.',
      prevention: 'Instruire clară: NICIODATĂ nu intra fără SCBA. Cheamă echipa de salvare instruită.'
    },
    {
      mistake: 'Bazarea pe miros pentru detectarea H₂S',
      consequence: 'H₂S paralizează nervul olfactiv la concentrații >100ppm. "Nu mai miroase = pericol EXTREM"',
      prevention: 'Folosește NUMAI detector calibrat. Nu te baza pe simțuri pentru gaze.'
    },
    {
      mistake: 'Ventilare insuficientă sau oprire ventilație în timpul lucrului',
      consequence: 'Reapariție atmosferă periculoasă, intoxicație graduală',
      prevention: 'Ventilație CONTINUĂ pe toată durata lucrului. Nu opri ventilatorul "pentru a auzi mai bine".'
    },
    {
      mistake: 'Nu este desemnat supraveghetor exterior sau acesta părăsește poziția',
      consequence: 'Nimeni nu observă când lucrătorii au probleme. Întârziere fatală în salvare.',
      prevention: 'Supraveghetor DEDICAT care NU părăsește poziția pentru NICIUN motiv. Rotație dacă pauză.'
    },
    {
      mistake: 'Permis completat parțial sau "pe genunchi" pentru "câteva minute"',
      consequence: 'Pericole neidentificate, echipament lipsă, responsabilități neclare',
      prevention: 'ZERO toleranță. Fiecare intrare = permis COMPLET. "Repede" = "periculos".'
    },
    {
      mistake: 'Lipsa sistemului de recuperare sau ham purtat incorect',
      consequence: 'Imposibilitate extragere rapidă în caz de urgență',
      prevention: 'Ham OBLIGATORIU chiar pentru "doar mă uit înăuntru". Atașat ÎNAINTE de intrare.'
    },
    {
      mistake: 'Testare doar la intrare, nu și în profunzime',
      consequence: 'Straturi de gaze grele (H₂S, CO₂) pot fi la fund chiar dacă sus e sigur',
      prevention: 'Testează la TOATE nivelurile: sus, mijloc, jos. Cobori detectorul pe coardă dacă necesar.'
    },
    {
      mistake: 'Ignorarea avertismentelor detectoarelor "din grabă"',
      consequence: 'Expunere periculoasă, posibil fatală',
      prevention: 'La ORICE alarmă → STOP imediat → EVACUARE → INVESTIGAȚIE. Fără excepții.'
    },
    {
      mistake: 'Instruire formală dar fără exerciții practice',
      consequence: 'Panică și erori fatale în situații reale de urgență',
      prevention: 'Exerciții practice regulate (trimestrial pentru echipe salvare). Simulări realiste.'
    },
    {
      mistake: 'Detector necalibrat sau cu baterii slabe',
      consequence: 'Citiri false = false siguranță',
      prevention: 'Calibrare lunară + bump test ZILNIC + verificare baterii. Înregistrează în jurnal.'
    },
    {
      mistake: 'Lucru solitar în spațiu închis',
      consequence: 'Dacă apare o problemă, nu există nimeni să observe și să salveze',
      prevention: 'MINIMUM 2 persoane: 1 înăuntru + 1 supraveghetor afară. ÎNTOTDEAUNA.'
    }
  ];
};

// REGULATIONS REFERENCE
export const regulationsReference = {
  romania: {
    primary: [
      'OUG 111/2010 - Securitatea și sănătatea în muncă',
      'Legea 319/2006 - Legea securității și sănătății în muncă',
      'HG 1091/2006 - Cerințe minime de securitate pentru lucrători'
    ],
    specific: [
      'Normele generale de protecție a muncii (NGPM) - Capitolul specific spații închise',
      'OSHA 1910.146 - Standard internațional de referință (aplicat voluntar)',
      'EN 14143 - Ventilarea spațiilor închise'
    ],
    related: [
      'Norme ISCIR pentru echipamente sub presiune',
      'Reglementări ITM locale - pot fi mai stricte'
    ]
  },
  international: {
    standards: [
      'ISO 45001 - Sisteme de management SSM',
      'EN 14143 - Ventilation for confined spaces',
      'ANSI Z117.1 - Safety Requirements for Confined Spaces',
      'CSA Z1006 - Management of Work in Confined Spaces'
    ]
  }
};

export default {
  confinedSpaceDefinitions,
  atmosphericParameters,
  permitTemplateFields,
  minimumTeam,
  mandatorySafetyEquipment,
  emergencyProcedures,
  trainingModules,
  getPermitFieldsBySection,
  getAtmosphericTestingChecklist,
  getPreEntryChecklist,
  getCommonMistakesAndHowToAvoidThem,
  regulationsReference
};
