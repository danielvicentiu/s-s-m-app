// S-S-M.RO — TEMPLATE-URI DECLARAȚII ANGAJAT
// Template-uri declarații pentru instruiri SSM, primire EIP, stare sănătate
// Data: 13 Februarie 2026

export type DeclaratieType = 'instruire_ssm' | 'primire_eip' | 'stare_sanatate'

export interface DeclaratieField {
  key: string
  label: string
  type: 'text' | 'date' | 'textarea' | 'checkbox' | 'signature' | 'select'
  placeholder?: string
  required?: boolean
  options?: string[]
  defaultValue?: string | boolean
}

export interface DeclaratieTemplate {
  id: DeclaratieType
  title: string
  description: string
  fields: DeclaratieField[]
  legalBasis?: string
  footer?: string
}

// ═══════════════════════════════════════════════════════════════════════════
// DECLARAȚIE INSTRUIRE SSM
// ═══════════════════════════════════════════════════════════════════════════

export const DECLARATIE_INSTRUIRE_SSM: DeclaratieTemplate = {
  id: 'instruire_ssm',
  title: 'Declarație de participare la instruirea SSM',
  description: 'Declarație prin care angajatul confirmă participarea la instruirea de securitate și sănătate în muncă',
  legalBasis: 'Legea nr. 319/2006 privind securitatea și sănătatea în muncă, actualizată',
  fields: [
    {
      key: 'employee_name',
      label: 'Nume și prenume angajat',
      type: 'text',
      placeholder: 'Ex: Popescu Ion',
      required: true
    },
    {
      key: 'cnp',
      label: 'CNP',
      type: 'text',
      placeholder: '13 cifre',
      required: true
    },
    {
      key: 'job_title',
      label: 'Funcția ocupată',
      type: 'text',
      placeholder: 'Ex: Electrician',
      required: true
    },
    {
      key: 'department',
      label: 'Departament/Secție',
      type: 'text',
      placeholder: 'Ex: Producție',
      required: false
    },
    {
      key: 'training_date',
      label: 'Data instruirii',
      type: 'date',
      required: true
    },
    {
      key: 'training_type',
      label: 'Tipul instruirii',
      type: 'select',
      options: [
        'Instruire inițială la angajare',
        'Instruire periodică',
        'Instruire la locul de muncă',
        'Instruire pentru schimbarea locului de muncă',
        'Instruire la reluarea activității'
      ],
      required: true
    },
    {
      key: 'training_duration',
      label: 'Durata instruirii (ore)',
      type: 'text',
      placeholder: 'Ex: 4 ore',
      required: false
    },
    {
      key: 'topics_covered',
      label: 'Teme abordate',
      type: 'textarea',
      placeholder: 'Ex: Utilizarea echipamentelor de protecție, proceduri de urgență, riscuri specifice postului...',
      required: false
    },
    {
      key: 'instructor_name',
      label: 'Nume instructor SSM',
      type: 'text',
      placeholder: 'Ex: Ionescu Maria',
      required: true
    },
    {
      key: 'confirmation',
      label: 'Confirm că am participat la instruirea SSM și am înțeles toate informațiile prezentate',
      type: 'checkbox',
      required: true,
      defaultValue: false
    },
    {
      key: 'materials_received',
      label: 'Am primit materialele de instruire (brosuri, fișe de post, proceduri)',
      type: 'checkbox',
      required: false,
      defaultValue: false
    },
    {
      key: 'questions_answered',
      label: 'Am avut posibilitatea să pun întrebări și am primit răspunsuri clare',
      type: 'checkbox',
      required: false,
      defaultValue: false
    },
    {
      key: 'notes',
      label: 'Observații suplimentare',
      type: 'textarea',
      placeholder: 'Opțional',
      required: false
    },
    {
      key: 'signature_date',
      label: 'Data semnării',
      type: 'date',
      required: true
    },
    {
      key: 'signature',
      label: 'Semnătura angajat',
      type: 'signature',
      required: true
    }
  ],
  footer: 'Această declarație face parte din dosarul de SSM al angajatului și poate fi verificată de inspectorii ITM.'
}

// ═══════════════════════════════════════════════════════════════════════════
// DECLARAȚIE PRIMIRE EIP (Echipament Individual de Protecție)
// ═══════════════════════════════════════════════════════════════════════════

export const DECLARATIE_PRIMIRE_EIP: DeclaratieTemplate = {
  id: 'primire_eip',
  title: 'Declarație de primire echipament individual de protecție (EIP)',
  description: 'Declarație prin care angajatul confirmă primirea echipamentului de protecție necesar desfășurării activității',
  legalBasis: 'HG nr. 1048/2006 privind cerințele minime de securitate și sănătate pentru utilizarea de către lucrători a echipamentelor individuale de protecție la locul de muncă',
  fields: [
    {
      key: 'employee_name',
      label: 'Nume și prenume angajat',
      type: 'text',
      placeholder: 'Ex: Popescu Ion',
      required: true
    },
    {
      key: 'cnp',
      label: 'CNP',
      type: 'text',
      placeholder: '13 cifre',
      required: true
    },
    {
      key: 'job_title',
      label: 'Funcția ocupată',
      type: 'text',
      placeholder: 'Ex: Sudor',
      required: true
    },
    {
      key: 'department',
      label: 'Departament/Secție',
      type: 'text',
      placeholder: 'Ex: Atelier mecanic',
      required: false
    },
    {
      key: 'issue_date',
      label: 'Data primirii EIP',
      type: 'date',
      required: true
    },
    {
      key: 'eip_items',
      label: 'Echipamente primite (pe linii separate)',
      type: 'textarea',
      placeholder: 'Ex:\n- Cască de protecție (1 buc)\n- Mănuși de protecție (2 perechi)\n- Ochelari de protecție (1 buc)\n- Bocanci de siguranță S3 (1 pereche)',
      required: true
    },
    {
      key: 'eip_condition',
      label: 'Starea echipamentului la primire',
      type: 'select',
      options: [
        'Nou',
        'Bună stare',
        'Uzat - dar funcțional'
      ],
      required: true,
      defaultValue: 'Nou'
    },
    {
      key: 'size_fitting',
      label: 'Mărimea echipamentului este potrivită',
      type: 'checkbox',
      required: true,
      defaultValue: false
    },
    {
      key: 'instructions_received',
      label: 'Am primit instrucțiuni de utilizare și întreținere a EIP',
      type: 'checkbox',
      required: true,
      defaultValue: false
    },
    {
      key: 'confirmation_usage',
      label: 'Mă angajez să utilizez EIP în mod corect și conform instrucțiunilor primite',
      type: 'checkbox',
      required: true,
      defaultValue: false
    },
    {
      key: 'confirmation_return',
      label: 'Mă angajez să returnez EIP la încetarea contractului de muncă sau la solicitarea angajatorului',
      type: 'checkbox',
      required: true,
      defaultValue: false
    },
    {
      key: 'replacement_date',
      label: 'Data estimată de înlocuire',
      type: 'date',
      placeholder: 'Când va fi înlocuit echipamentul',
      required: false
    },
    {
      key: 'notes',
      label: 'Observații suplimentare',
      type: 'textarea',
      placeholder: 'Opțional - ex: dimensiuni specifice, preferințe',
      required: false
    },
    {
      key: 'signature_date',
      label: 'Data semnării',
      type: 'date',
      required: true
    },
    {
      key: 'signature',
      label: 'Semnătura angajat',
      type: 'signature',
      required: true
    }
  ],
  footer: 'Angajatorul este obligat să asigure EIP gratuit și să instruiască lucrătorii cu privire la utilizarea corectă a acestuia.'
}

// ═══════════════════════════════════════════════════════════════════════════
// DECLARAȚIE STARE SĂNĂTATE (pentru medicina muncii)
// ═══════════════════════════════════════════════════════════════════════════

export const DECLARATIE_STARE_SANATATE: DeclaratieTemplate = {
  id: 'stare_sanatate',
  title: 'Declarație privind starea de sănătate',
  description: 'Declarație auto-completată de angajat pentru evaluarea inițială a stării de sănătate în vederea controlului medical de medicina muncii',
  legalBasis: 'Legea nr. 319/2006, HG nr. 355/2007 privind supravegherea sănătății lucrătorilor',
  fields: [
    {
      key: 'employee_name',
      label: 'Nume și prenume',
      type: 'text',
      placeholder: 'Ex: Popescu Ion',
      required: true
    },
    {
      key: 'cnp',
      label: 'CNP',
      type: 'text',
      placeholder: '13 cifre',
      required: true
    },
    {
      key: 'birth_date',
      label: 'Data nașterii',
      type: 'date',
      required: true
    },
    {
      key: 'job_title',
      label: 'Funcția pentru care se face examinarea',
      type: 'text',
      placeholder: 'Ex: Operator CNC',
      required: true
    },
    {
      key: 'declaration_date',
      label: 'Data completării',
      type: 'date',
      required: true
    },
    {
      key: 'chronic_diseases',
      label: 'Aveți boli cronice? (diabet, hipertensiune, astm, epilepsie etc.)',
      type: 'textarea',
      placeholder: 'Dacă DA, specificați. Dacă NU, scrieți "NU"',
      required: true
    },
    {
      key: 'allergies',
      label: 'Aveți alergii cunoscute? (medicamente, substanțe chimice, praf, polen etc.)',
      type: 'textarea',
      placeholder: 'Dacă DA, specificați. Dacă NU, scrieți "NU"',
      required: true
    },
    {
      key: 'previous_surgeries',
      label: 'Ați suferit intervenții chirurgicale în ultimii 5 ani?',
      type: 'textarea',
      placeholder: 'Dacă DA, specificați tipul și anul. Dacă NU, scrieți "NU"',
      required: false
    },
    {
      key: 'current_medication',
      label: 'Urmați în prezent un tratament medicamentos permanent?',
      type: 'textarea',
      placeholder: 'Dacă DA, specificați medicamentele. Dacă NU, scrieți "NU"',
      required: false
    },
    {
      key: 'work_accidents',
      label: 'Ați suferit accidente de muncă în trecut?',
      type: 'textarea',
      placeholder: 'Dacă DA, specificați anul și natura accidentului. Dacă NU, scrieți "NU"',
      required: false
    },
    {
      key: 'occupational_diseases',
      label: 'Aveți diagnosticate boli profesionale?',
      type: 'textarea',
      placeholder: 'Dacă DA, specificați. Dacă NU, scrieți "NU"',
      required: false
    },
    {
      key: 'hearing_problems',
      label: 'Aveți probleme de auz?',
      type: 'select',
      options: ['NU', 'DA - ușoare', 'DA - moderate', 'DA - severe'],
      required: true,
      defaultValue: 'NU'
    },
    {
      key: 'vision_problems',
      label: 'Purtați ochelari sau lentile de contact?',
      type: 'select',
      options: ['NU', 'DA - ochelari', 'DA - lentile', 'DA - ambele'],
      required: true,
      defaultValue: 'NU'
    },
    {
      key: 'smoking',
      label: 'Fumați?',
      type: 'select',
      options: ['NU', 'DA - ocazional', 'DA - sub 10 țigări/zi', 'DA - peste 10 țigări/zi'],
      required: false,
      defaultValue: 'NU'
    },
    {
      key: 'alcohol',
      label: 'Consumați băuturi alcoolice?',
      type: 'select',
      options: ['NU', 'DA - ocazional', 'DA - regulat moderat', 'DA - regulat'],
      required: false,
      defaultValue: 'NU'
    },
    {
      key: 'physical_limitations',
      label: 'Aveți limitări fizice care ar putea afecta activitatea profesională? (probleme de mobilitate, dureri cronice etc.)',
      type: 'textarea',
      placeholder: 'Dacă DA, specificați. Dacă NU, scrieți "NU"',
      required: false
    },
    {
      key: 'pregnancy',
      label: 'Sunteți gravidă sau alăptați? (doar pentru femei)',
      type: 'select',
      options: ['NU', 'DA - gravidă', 'DA - alăptez', 'Nu se aplică'],
      required: false,
      defaultValue: 'Nu se aplică'
    },
    {
      key: 'additional_info',
      label: 'Alte informații relevante pentru evaluarea medicală',
      type: 'textarea',
      placeholder: 'Opțional - orice altă informație care considerați că ar trebui cunoscută de medicul de medicina muncii',
      required: false
    },
    {
      key: 'data_consent',
      label: 'Sunt de acord ca datele furnizate să fie utilizate pentru evaluarea medicală și să fie păstrate în dosarul medical',
      type: 'checkbox',
      required: true,
      defaultValue: false
    },
    {
      key: 'truthfulness',
      label: 'Declar pe propria răspundere că informațiile furnizate sunt complete și corespund adevărului',
      type: 'checkbox',
      required: true,
      defaultValue: false
    },
    {
      key: 'signature_date',
      label: 'Data semnării',
      type: 'date',
      required: true
    },
    {
      key: 'signature',
      label: 'Semnătura angajat',
      type: 'signature',
      required: true
    }
  ],
  footer: 'Informațiile furnizate sunt confidențiale și vor fi accesate doar de personalul medical autorizat, conform GDPR și Legii nr. 190/2018.'
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT CONSOLIDAT
// ═══════════════════════════════════════════════════════════════════════════

export const DECLARATIE_TEMPLATES: Record<DeclaratieType, DeclaratieTemplate> = {
  instruire_ssm: DECLARATIE_INSTRUIRE_SSM,
  primire_eip: DECLARATIE_PRIMIRE_EIP,
  stare_sanatate: DECLARATIE_STARE_SANATATE
}

/**
 * Helper: obține template-ul unei declarații după tip
 */
export function getDeclaratieTemplate(type: DeclaratieType): DeclaratieTemplate {
  return DECLARATIE_TEMPLATES[type]
}

/**
 * Helper: obține lista tuturor tipurilor de declarații disponibile
 */
export function getAvailableDeclaratieTypes(): Array<{ id: DeclaratieType; title: string }> {
  return Object.values(DECLARATIE_TEMPLATES).map(template => ({
    id: template.id,
    title: template.title
  }))
}

/**
 * Helper: validează dacă toate câmpurile obligatorii au fost completate
 */
export function validateDeclaratieData(
  type: DeclaratieType,
  data: Record<string, any>
): { valid: boolean; missingFields: string[] } {
  const template = getDeclaratieTemplate(type)
  const missingFields: string[] = []

  template.fields.forEach(field => {
    if (field.required) {
      const value = data[field.key]
      if (value === undefined || value === null || value === '' || value === false) {
        missingFields.push(field.label)
      }
    }
  })

  return {
    valid: missingFields.length === 0,
    missingFields
  }
}
