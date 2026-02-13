/**
 * CSV Import Templates
 * Definește structura și validările pentru importul CSV pe diferite entități
 */

export interface CSVColumn {
  name: string;
  type: 'text' | 'email' | 'phone' | 'date' | 'number' | 'select';
  required: boolean;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    options?: string[];
  };
  example: string;
  description?: string;
}

export interface CSVTemplate {
  templateName: string;
  entity: 'employees' | 'trainings' | 'medical' | 'equipment';
  columns: CSVColumn[];
  sampleData: Record<string, string>[];
}

// Template 1: Angajați
export const employeesTemplate: CSVTemplate = {
  templateName: 'Import Angajați',
  entity: 'employees',
  columns: [
    {
      name: 'nume',
      type: 'text',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 100
      },
      example: 'Popescu',
      description: 'Numele de familie al angajatului'
    },
    {
      name: 'prenume',
      type: 'text',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 100
      },
      example: 'Ion',
      description: 'Prenumele angajatului'
    },
    {
      name: 'CNP',
      type: 'text',
      required: true,
      validation: {
        pattern: '^[1-9][0-9]{12}$',
        minLength: 13,
        maxLength: 13
      },
      example: '1850101123456',
      description: 'Cod Numeric Personal (13 cifre)'
    },
    {
      name: 'functie',
      type: 'text',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 100
      },
      example: 'Inginer',
      description: 'Funcția ocupată în cadrul firmei'
    },
    {
      name: 'departament',
      type: 'text',
      required: false,
      validation: {
        maxLength: 100
      },
      example: 'Producție',
      description: 'Departamentul din care face parte'
    },
    {
      name: 'dataAngajare',
      type: 'date',
      required: true,
      validation: {
        pattern: '^\\d{4}-\\d{2}-\\d{2}$'
      },
      example: '2023-01-15',
      description: 'Data angajării (format: YYYY-MM-DD)'
    },
    {
      name: 'email',
      type: 'email',
      required: false,
      validation: {
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
      },
      example: 'ion.popescu@firma.ro',
      description: 'Adresa de email (opțional)'
    },
    {
      name: 'telefon',
      type: 'phone',
      required: false,
      validation: {
        pattern: '^(\\+4|0)[0-9]{9}$'
      },
      example: '0721234567',
      description: 'Număr de telefon (opțional)'
    }
  ],
  sampleData: [
    {
      nume: 'Popescu',
      prenume: 'Ion',
      CNP: '1850101123456',
      functie: 'Inginer',
      departament: 'Producție',
      dataAngajare: '2023-01-15',
      email: 'ion.popescu@firma.ro',
      telefon: '0721234567'
    },
    {
      nume: 'Ionescu',
      prenume: 'Maria',
      CNP: '2900215234567',
      functie: 'Economist',
      departament: 'Financiar',
      dataAngajare: '2023-03-20',
      email: 'maria.ionescu@firma.ro',
      telefon: '0732345678'
    },
    {
      nume: 'Georgescu',
      prenume: 'Andrei',
      CNP: '1750320345678',
      functie: 'Tehnician',
      departament: 'Mentenanță',
      dataAngajare: '2023-06-10',
      email: 'andrei.georgescu@firma.ro',
      telefon: '0743456789'
    }
  ]
};

// Template 2: Instruiri SSM
export const trainingsTemplate: CSVTemplate = {
  templateName: 'Import Instruiri SSM',
  entity: 'trainings',
  columns: [
    {
      name: 'CNP',
      type: 'text',
      required: true,
      validation: {
        pattern: '^[1-9][0-9]{12}$',
        minLength: 13,
        maxLength: 13
      },
      example: '1850101123456',
      description: 'CNP-ul angajatului care a participat la instruire'
    },
    {
      name: 'tipInstruire',
      type: 'select',
      required: true,
      validation: {
        options: ['Instruire Introductiv-Generală', 'Instruire la Locul de Muncă', 'Instruire Periodică']
      },
      example: 'Instruire Periodică',
      description: 'Tipul instruirii efectuate'
    },
    {
      name: 'dataInstruire',
      type: 'date',
      required: true,
      validation: {
        pattern: '^\\d{4}-\\d{2}-\\d{2}$'
      },
      example: '2024-01-15',
      description: 'Data la care s-a efectuat instruirea (format: YYYY-MM-DD)'
    },
    {
      name: 'dataExpirare',
      type: 'date',
      required: true,
      validation: {
        pattern: '^\\d{4}-\\d{2}-\\d{2}$'
      },
      example: '2025-01-15',
      description: 'Data la care expiră valabilitatea instruirii (format: YYYY-MM-DD)'
    },
    {
      name: 'instructor',
      type: 'text',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 100
      },
      example: 'Ionescu Daniel',
      description: 'Numele instructorului care a efectuat instruirea'
    },
    {
      name: 'durata',
      type: 'number',
      required: true,
      validation: {
        pattern: '^[0-9]+(\\.[0-9]+)?$'
      },
      example: '2.5',
      description: 'Durata instruirii în ore'
    },
    {
      name: 'locatie',
      type: 'text',
      required: false,
      validation: {
        maxLength: 200
      },
      example: 'Sala de conferințe, Sediu',
      description: 'Locația unde s-a desfășurat instruirea (opțional)'
    },
    {
      name: 'observatii',
      type: 'text',
      required: false,
      validation: {
        maxLength: 500
      },
      example: 'Instruire cu prezentare PowerPoint și demonstrații practice',
      description: 'Observații suplimentare (opțional)'
    }
  ],
  sampleData: [
    {
      CNP: '1850101123456',
      tipInstruire: 'Instruire Periodică',
      dataInstruire: '2024-01-15',
      dataExpirare: '2025-01-15',
      instructor: 'Ionescu Daniel',
      durata: '2.5',
      locatie: 'Sala de conferințe, Sediu',
      observatii: 'Instruire cu prezentare PowerPoint'
    },
    {
      CNP: '2900215234567',
      tipInstruire: 'Instruire la Locul de Muncă',
      dataInstruire: '2024-02-10',
      dataExpirare: '2025-02-10',
      instructor: 'Popescu Mihai',
      durata: '3',
      locatie: 'Atelier producție',
      observatii: 'Demonstrații practice cu echipamente'
    },
    {
      CNP: '1750320345678',
      tipInstruire: 'Instruire Introductiv-Generală',
      dataInstruire: '2024-03-05',
      dataExpirare: '2025-03-05',
      instructor: 'Ionescu Daniel',
      durata: '4',
      locatie: 'Sala de conferințe, Sediu',
      observatii: 'Instruire pentru angajați noi'
    }
  ]
};

// Template 3: Examene Medicale
export const medicalTemplate: CSVTemplate = {
  templateName: 'Import Examene Medicale',
  entity: 'medical',
  columns: [
    {
      name: 'CNP',
      type: 'text',
      required: true,
      validation: {
        pattern: '^[1-9][0-9]{12}$',
        minLength: 13,
        maxLength: 13
      },
      example: '1850101123456',
      description: 'CNP-ul angajatului care a efectuat controlul medical'
    },
    {
      name: 'tipControl',
      type: 'select',
      required: true,
      validation: {
        options: ['Control Medical Periodic', 'Control Medical la Angajare', 'Control Medical de Reluare']
      },
      example: 'Control Medical Periodic',
      description: 'Tipul controlului medical efectuat'
    },
    {
      name: 'dataControl',
      type: 'date',
      required: true,
      validation: {
        pattern: '^\\d{4}-\\d{2}-\\d{2}$'
      },
      example: '2024-01-20',
      description: 'Data la care s-a efectuat controlul medical (format: YYYY-MM-DD)'
    },
    {
      name: 'dataExpirare',
      type: 'date',
      required: true,
      validation: {
        pattern: '^\\d{4}-\\d{2}-\\d{2}$'
      },
      example: '2025-01-20',
      description: 'Data la care expiră valabilitatea controlului (format: YYYY-MM-DD)'
    },
    {
      name: 'medicCabinet',
      type: 'text',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 200
      },
      example: 'Dr. Vasilescu Ana - Cabinet Medicina Muncii',
      description: 'Numele medicului și cabinetul medical'
    },
    {
      name: 'avizMedical',
      type: 'select',
      required: true,
      validation: {
        options: ['Apt', 'Apt cu Restricții', 'Inapt Temporar', 'Inapt']
      },
      example: 'Apt',
      description: 'Rezultatul controlului medical'
    },
    {
      name: 'restrictii',
      type: 'text',
      required: false,
      validation: {
        maxLength: 500
      },
      example: 'Fără port sarcini peste 15kg',
      description: 'Restricții medicale (dacă există)'
    },
    {
      name: 'observatii',
      type: 'text',
      required: false,
      validation: {
        maxLength: 500
      },
      example: 'Examen complet efectuat, toate analizele în limite normale',
      description: 'Observații suplimentare (opțional)'
    }
  ],
  sampleData: [
    {
      CNP: '1850101123456',
      tipControl: 'Control Medical Periodic',
      dataControl: '2024-01-20',
      dataExpirare: '2025-01-20',
      medicCabinet: 'Dr. Vasilescu Ana - Cabinet Medicina Muncii',
      avizMedical: 'Apt',
      restrictii: '',
      observatii: 'Examen complet, analize normale'
    },
    {
      CNP: '2900215234567',
      tipControl: 'Control Medical la Angajare',
      dataControl: '2024-03-18',
      dataExpirare: '2025-03-18',
      medicCabinet: 'Dr. Popescu Mihai - Clinica Sănătatea',
      avizMedical: 'Apt',
      restrictii: '',
      observatii: 'Control la angajare, fără probleme'
    },
    {
      CNP: '1750320345678',
      tipControl: 'Control Medical Periodic',
      dataControl: '2024-06-05',
      dataExpirare: '2025-06-05',
      medicCabinet: 'Dr. Vasilescu Ana - Cabinet Medicina Muncii',
      avizMedical: 'Apt cu Restricții',
      restrictii: 'Fără port sarcini peste 15kg',
      observatii: 'Recomandat ergonomic la locul de muncă'
    }
  ]
};

// Template 4: Echipamente de Protecție
export const equipmentTemplate: CSVTemplate = {
  templateName: 'Import Echipamente de Protecție',
  entity: 'equipment',
  columns: [
    {
      name: 'CNP',
      type: 'text',
      required: true,
      validation: {
        pattern: '^[1-9][0-9]{12}$',
        minLength: 13,
        maxLength: 13
      },
      example: '1850101123456',
      description: 'CNP-ul angajatului căruia i s-a atribuit echipamentul'
    },
    {
      name: 'tipEchipament',
      type: 'text',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 100
      },
      example: 'Cască de protecție',
      description: 'Tipul echipamentului de protecție'
    },
    {
      name: 'categorie',
      type: 'select',
      required: true,
      validation: {
        options: ['Protecție Cap', 'Protecție Ochi', 'Protecție Auz', 'Protecție Mâini', 'Protecție Picioare', 'Protecție Corp', 'Protecție Respirație']
      },
      example: 'Protecție Cap',
      description: 'Categoria echipamentului'
    },
    {
      name: 'producator',
      type: 'text',
      required: false,
      validation: {
        maxLength: 100
      },
      example: '3M',
      description: 'Producătorul echipamentului (opțional)'
    },
    {
      name: 'model',
      type: 'text',
      required: false,
      validation: {
        maxLength: 100
      },
      example: 'X5000',
      description: 'Modelul echipamentului (opțional)'
    },
    {
      name: 'dataAtribuire',
      type: 'date',
      required: true,
      validation: {
        pattern: '^\\d{4}-\\d{2}-\\d{2}$'
      },
      example: '2024-01-15',
      description: 'Data la care s-a atribuit echipamentul (format: YYYY-MM-DD)'
    },
    {
      name: 'dataExpirare',
      type: 'date',
      required: false,
      validation: {
        pattern: '^\\d{4}-\\d{2}-\\d{2}$'
      },
      example: '2026-01-15',
      description: 'Data expirării/înlocuirii echipamentului (format: YYYY-MM-DD, opțional)'
    },
    {
      name: 'cantitate',
      type: 'number',
      required: true,
      validation: {
        pattern: '^[0-9]+$'
      },
      example: '1',
      description: 'Numărul de bucăți atribuite'
    },
    {
      name: 'observatii',
      type: 'text',
      required: false,
      validation: {
        maxLength: 500
      },
      example: 'Echipament nou, conform cu EN 397',
      description: 'Observații suplimentare (opțional)'
    }
  ],
  sampleData: [
    {
      CNP: '1850101123456',
      tipEchipament: 'Cască de protecție',
      categorie: 'Protecție Cap',
      producator: '3M',
      model: 'X5000',
      dataAtribuire: '2024-01-15',
      dataExpirare: '2026-01-15',
      cantitate: '1',
      observatii: 'Echipament nou, conform cu EN 397'
    },
    {
      CNP: '2900215234567',
      tipEchipament: 'Mănuși de protecție',
      categorie: 'Protecție Mâini',
      producator: 'Uvex',
      model: 'Phynomic C5',
      dataAtribuire: '2024-02-10',
      dataExpirare: '2024-08-10',
      cantitate: '3',
      observatii: 'Înlocuire la 6 luni'
    },
    {
      CNP: '1750320345678',
      tipEchipament: 'Bocanci de siguranță',
      categorie: 'Protecție Picioare',
      producator: 'Cofra',
      model: 'New Sheffield S3',
      dataAtribuire: '2024-06-05',
      dataExpirare: '2025-06-05',
      cantitate: '1',
      observatii: 'Mărimea 42, variantă fără metal'
    }
  ]
};

// Array cu toate template-urile
export const csvTemplates: CSVTemplate[] = [
  employeesTemplate,
  trainingsTemplate,
  medicalTemplate,
  equipmentTemplate
];

/**
 * Generează un fișier CSV din template
 */
export function generateCSVTemplate(template: CSVTemplate): string {
  // Header: numele coloanelor
  const headers = template.columns.map(col => col.name).join(',');

  // Rows: sample data
  const rows = template.sampleData.map(row => {
    return template.columns
      .map(col => {
        const value = row[col.name] || '';
        // Escape values that contain commas or quotes
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(',');
  });

  return [headers, ...rows].join('\n');
}

/**
 * Găsește un template după entitate
 */
export function getTemplateByEntity(entity: string): CSVTemplate | undefined {
  return csvTemplates.find(t => t.entity === entity);
}

/**
 * Validează o linie CSV conform cu template-ul
 */
export function validateCSVRow(
  row: Record<string, string>,
  template: CSVTemplate
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Verifică toate coloanele required
  for (const column of template.columns) {
    if (column.required && (!row[column.name] || row[column.name].trim() === '')) {
      errors.push(`Câmpul "${column.name}" este obligatoriu`);
      continue;
    }

    const value = row[column.name];
    if (!value || value.trim() === '') continue;

    // Validări specifice pe tip
    if (column.validation) {
      // Pattern validation
      if (column.validation.pattern) {
        const regex = new RegExp(column.validation.pattern);
        if (!regex.test(value)) {
          errors.push(`Câmpul "${column.name}" are format invalid. Exemplu: ${column.example}`);
        }
      }

      // Length validation
      if (column.validation.minLength && value.length < column.validation.minLength) {
        errors.push(`Câmpul "${column.name}" trebuie să aibă minimum ${column.validation.minLength} caractere`);
      }

      if (column.validation.maxLength && value.length > column.validation.maxLength) {
        errors.push(`Câmpul "${column.name}" trebuie să aibă maximum ${column.validation.maxLength} caractere`);
      }

      // Options validation (select fields)
      if (column.validation.options && !column.validation.options.includes(value)) {
        errors.push(`Câmpul "${column.name}" trebuie să fie una din valorile: ${column.validation.options.join(', ')}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
