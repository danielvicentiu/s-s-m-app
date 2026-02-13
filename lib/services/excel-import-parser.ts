/**
 * Excel Import Parser Service
 *
 * Provides Excel XLSX parsing with validation, column mapping auto-detection,
 * and comprehensive error/warning collection for employees, trainings, and medical records.
 * Uses SheetJS (xlsx) library for reading Excel files.
 */

import * as XLSX from 'xlsx';

// ============================================================================
// RE-EXPORT TYPES FROM CSV PARSER
// ============================================================================

export type {
  ParseResult,
  ParseError,
  ParseWarning,
  EmployeeData,
  TrainingData,
  MedicalData
} from './csv-import-parser';

import type {
  ParseResult,
  ParseError,
  ParseWarning,
  EmployeeData,
  TrainingData,
  MedicalData
} from './csv-import-parser';

// ============================================================================
// COLUMN MAPPING CONFIGURATIONS
// ============================================================================

const EMPLOYEE_COLUMN_MAPPINGS = {
  firstName: ['firstname', 'first_name', 'prenume', 'nume_prenume', 'given_name', 'prenom'],
  lastName: ['lastname', 'last_name', 'nume', 'family_name', 'nom'],
  email: ['email', 'e-mail', 'mail', 'email_address', 'adresa_email'],
  phone: ['phone', 'telefon', 'tel', 'mobile', 'telephone', 'phone_number'],
  position: ['position', 'functie', 'job', 'job_title', 'post', 'rol', 'function'],
  department: ['department', 'departament', 'dept', 'division', 'sector'],
  employmentDate: ['employment_date', 'data_angajare', 'hire_date', 'start_date', 'data_start'],
  birthDate: ['birth_date', 'data_nastere', 'dob', 'date_of_birth', 'birthday'],
  cnp: ['cnp', 'personal_code', 'cod_numeric_personal'],
  idCard: ['id_card', 'ci', 'carte_identitate', 'buletin', 'id_number']
};

const TRAINING_COLUMN_MAPPINGS = {
  employeeEmail: ['employee_email', 'email', 'email_angajat', 'participant_email'],
  employeeName: ['employee_name', 'nume_angajat', 'participant', 'name', 'participant_name'],
  trainingType: ['training_type', 'tip_instruire', 'course', 'type', 'curs', 'training'],
  trainingDate: ['training_date', 'data_instruire', 'date', 'course_date', 'data'],
  expiryDate: ['expiry_date', 'data_expirare', 'valid_until', 'expiration', 'valabil_pana'],
  instructor: ['instructor', 'instructor_name', 'trainer', 'formator'],
  duration: ['duration', 'durata', 'hours', 'ore', 'length'],
  certificateNumber: ['certificate_number', 'nr_certificat', 'cert_no', 'certificate', 'certificat'],
  notes: ['notes', 'observatii', 'remarks', 'comments', 'note']
};

const MEDICAL_COLUMN_MAPPINGS = {
  employeeEmail: ['employee_email', 'email', 'email_angajat'],
  employeeName: ['employee_name', 'nume_angajat', 'name', 'participant'],
  examDate: ['exam_date', 'data_examen', 'examination_date', 'data_control', 'date'],
  expiryDate: ['expiry_date', 'data_expirare', 'valid_until', 'valabil_pana', 'next_exam'],
  examType: ['exam_type', 'tip_examen', 'type', 'examination_type', 'control_medical'],
  result: ['result', 'rezultat', 'status', 'outcome', 'verdict'],
  restrictions: ['restrictions', 'restrictii', 'limitations', 'conditii'],
  doctorName: ['doctor_name', 'doctor', 'medic', 'physician'],
  clinicName: ['clinic_name', 'clinic', 'clinica', 'medical_center'],
  certificateNumber: ['certificate_number', 'nr_certificat', 'cert_no', 'certificate'],
  notes: ['notes', 'observatii', 'remarks', 'comments']
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert Excel buffer to worksheet
 */
function bufferToWorksheet(buffer: ArrayBuffer): XLSX.WorkSheet | null {
  try {
    const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });

    // Use first sheet
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) return null;

    return workbook.Sheets[firstSheetName];
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return null;
  }
}

/**
 * Convert worksheet to array of arrays (similar to CSV rows)
 */
function worksheetToRows(worksheet: XLSX.WorkSheet): any[][] {
  // Convert to JSON with header option to get raw array
  const data = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: '',
    raw: false // Convert dates and numbers to strings
  });

  return data as any[][];
}

/**
 * Normalize column name for matching
 */
function normalizeColumnName(name: string): string {
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '_');
}

/**
 * Auto-detect column mapping from header row
 */
function detectColumnMapping<T extends Record<string, any>>(
  headerRow: any[],
  mappings: Record<keyof T, string[]>
): Map<number, keyof T> {
  const columnMap = new Map<number, keyof T>();
  const normalizedHeaders = headerRow.map(h => normalizeColumnName(String(h || '')));

  for (const [field, aliases] of Object.entries(mappings) as [keyof T, string[]][]) {
    const normalizedAliases = aliases.map(a => normalizeColumnName(a));

    for (let i = 0; i < normalizedHeaders.length; i++) {
      if (normalizedAliases.includes(normalizedHeaders[i])) {
        columnMap.set(i, field);
        break;
      }
    }
  }

  return columnMap;
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate date format (supports multiple formats)
 */
function parseDate(dateValue: any): Date | null {
  if (!dateValue) return null;

  // If already a Date object (from Excel)
  if (dateValue instanceof Date) {
    return isNaN(dateValue.getTime()) ? null : dateValue;
  }

  const dateStr = String(dateValue).trim();
  if (!dateStr) return null;

  const formats = [
    // ISO format
    /^(\d{4})-(\d{2})-(\d{2})$/,
    // European format
    /^(\d{2})\.(\d{2})\.(\d{4})$/,
    /^(\d{2})\/(\d{2})\/(\d{4})$/,
    /^(\d{2})-(\d{2})-(\d{4})$/
  ];

  for (const format of formats) {
    const match = dateStr.match(format);
    if (match) {
      let year: number, month: number, day: number;

      if (match[1].length === 4) {
        // ISO format: YYYY-MM-DD
        year = parseInt(match[1]);
        month = parseInt(match[2]);
        day = parseInt(match[3]);
      } else {
        // European format: DD.MM.YYYY or DD/MM/YYYY
        day = parseInt(match[1]);
        month = parseInt(match[2]);
        year = parseInt(match[3]);
      }

      const date = new Date(year, month - 1, day);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }

  return null;
}

/**
 * Validate CNP (Romanian Personal Numerical Code)
 */
function isValidCNP(cnp: string): boolean {
  if (!cnp || cnp.length !== 13) return false;
  if (!/^\d{13}$/.test(cnp)) return false;

  const checksum = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
  let sum = 0;

  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnp[i]) * checksum[i];
  }

  const control = sum % 11 === 10 ? 1 : sum % 11;
  return control === parseInt(cnp[12]);
}

/**
 * Normalize Romanian result value
 */
function normalizeResult(result: string): 'apt' | 'inapt' | 'apt_restrictii' | null {
  const normalized = result.toLowerCase().trim();

  if (['apt', 'aptă', 'apti', 'fit', 'suitable'].includes(normalized)) {
    return 'apt';
  }

  if (['inapt', 'inaptă', 'inapti', 'unfit', 'unsuitable'].includes(normalized)) {
    return 'inapt';
  }

  if ([
    'apt_restrictii',
    'apt cu restrictii',
    'apt_cu_restrictii',
    'restrictii',
    'fit with restrictions',
    'conditional'
  ].includes(normalized.replace(/\s+/g, '_'))) {
    return 'apt_restrictii';
  }

  return null;
}

/**
 * Convert cell value to string, handling various Excel types
 */
function cellToString(value: any): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) {
    // Format date as YYYY-MM-DD
    return value.toISOString().split('T')[0];
  }
  return String(value).trim();
}

// ============================================================================
// EMPLOYEE EXCEL PARSER
// ============================================================================

/**
 * Parse employee Excel with validation
 */
export function parseEmployeeExcel(buffer: ArrayBuffer): ParseResult<EmployeeData> {
  const errors: ParseError[] = [];
  const warnings: ParseWarning[] = [];
  const parsed: EmployeeData[] = [];

  try {
    const worksheet = bufferToWorksheet(buffer);

    if (!worksheet) {
      errors.push({
        row: 0,
        message: 'Fișierul Excel nu poate fi citit sau este invalid',
        severity: 'error'
      });
      return { parsed, errors, warnings, totalRows: 0, successCount: 0, errorCount: 1 };
    }

    const rows = worksheetToRows(worksheet);

    if (rows.length === 0) {
      errors.push({
        row: 0,
        message: 'Fișierul Excel este gol',
        severity: 'error'
      });
      return { parsed, errors, warnings, totalRows: 0, successCount: 0, errorCount: 1 };
    }

    const headerRow = rows[0];
    const columnMap = detectColumnMapping<EmployeeData>(headerRow, EMPLOYEE_COLUMN_MAPPINGS);

    // Validate required columns
    const requiredFields: (keyof EmployeeData)[] = ['firstName', 'lastName', 'email'];
    const mappedFields = Array.from(columnMap.values());
    const missingFields = requiredFields.filter(field => {
      return !mappedFields.includes(field);
    });

    if (missingFields.length > 0) {
      errors.push({
        row: 1,
        message: `Lipsesc coloane obligatorii: ${missingFields.join(', ')}`,
        severity: 'error'
      });
      return { parsed, errors, warnings, totalRows: rows.length - 1, successCount: 0, errorCount: 1 };
    }

    // Process data rows
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 1;
      const rowErrors: ParseError[] = [];
      const rowWarnings: ParseWarning[] = [];

      if (row.every(cell => !cellToString(cell))) {
        continue; // Skip empty rows
      }

      const employee: Partial<EmployeeData> = {};

      // Map columns to fields
      const columnEntries = Array.from(columnMap.entries());
      for (const [colIndex, field] of columnEntries) {
        const value = cellToString(row[colIndex]);

        if (value) {
          (employee as any)[field] = value;
        }
      }

      // Validate required fields
      if (!employee.firstName) {
        rowErrors.push({
          row: rowNum,
          field: 'firstName',
          message: 'Prenumele este obligatoriu',
          severity: 'error'
        });
      }

      if (!employee.lastName) {
        rowErrors.push({
          row: rowNum,
          field: 'lastName',
          message: 'Numele de familie este obligatoriu',
          severity: 'error'
        });
      }

      if (!employee.email) {
        rowErrors.push({
          row: rowNum,
          field: 'email',
          message: 'Email-ul este obligatoriu',
          severity: 'error'
        });
      } else if (!isValidEmail(employee.email)) {
        rowErrors.push({
          row: rowNum,
          field: 'email',
          value: employee.email,
          message: 'Format email invalid',
          severity: 'error'
        });
      }

      // Validate optional fields
      if (employee.employmentDate) {
        const date = parseDate(employee.employmentDate);
        if (!date) {
          rowWarnings.push({
            row: rowNum,
            field: 'employmentDate',
            value: employee.employmentDate,
            message: 'Format dată angajare invalid (se așteaptă YYYY-MM-DD sau DD.MM.YYYY)',
            severity: 'warning'
          });
        } else {
          employee.employmentDate = date.toISOString().split('T')[0];
        }
      }

      if (employee.birthDate) {
        const date = parseDate(employee.birthDate);
        if (!date) {
          rowWarnings.push({
            row: rowNum,
            field: 'birthDate',
            value: employee.birthDate,
            message: 'Format dată naștere invalid',
            severity: 'warning'
          });
        } else {
          employee.birthDate = date.toISOString().split('T')[0];
        }
      }

      if (employee.cnp && !isValidCNP(employee.cnp)) {
        rowWarnings.push({
          row: rowNum,
          field: 'cnp',
          value: employee.cnp,
          message: 'CNP invalid (verifică lungimea și cifra de control)',
          severity: 'warning'
        });
      }

      if (employee.phone && employee.phone.length < 10) {
        rowWarnings.push({
          row: rowNum,
          field: 'phone',
          value: employee.phone,
          message: 'Număr telefon posibil incomplet',
          severity: 'warning'
        });
      }

      // Add to results
      if (rowErrors.length === 0) {
        parsed.push(employee as EmployeeData);
      }

      errors.push(...rowErrors);
      warnings.push(...rowWarnings);
    }

    return {
      parsed,
      errors,
      warnings,
      totalRows: rows.length - 1,
      successCount: parsed.length,
      errorCount: errors.length
    };

  } catch (error) {
    errors.push({
      row: 0,
      message: `Eroare la parsarea Excel: ${error instanceof Error ? error.message : 'Eroare necunoscută'}`,
      severity: 'error'
    });

    return {
      parsed,
      errors,
      warnings,
      totalRows: 0,
      successCount: 0,
      errorCount: errors.length
    };
  }
}

// ============================================================================
// TRAINING EXCEL PARSER
// ============================================================================

/**
 * Parse training Excel with validation
 */
export function parseTrainingExcel(buffer: ArrayBuffer): ParseResult<TrainingData> {
  const errors: ParseError[] = [];
  const warnings: ParseWarning[] = [];
  const parsed: TrainingData[] = [];

  try {
    const worksheet = bufferToWorksheet(buffer);

    if (!worksheet) {
      errors.push({
        row: 0,
        message: 'Fișierul Excel nu poate fi citit sau este invalid',
        severity: 'error'
      });
      return { parsed, errors, warnings, totalRows: 0, successCount: 0, errorCount: 1 };
    }

    const rows = worksheetToRows(worksheet);

    if (rows.length === 0) {
      errors.push({
        row: 0,
        message: 'Fișierul Excel este gol',
        severity: 'error'
      });
      return { parsed, errors, warnings, totalRows: 0, successCount: 0, errorCount: 1 };
    }

    const headerRow = rows[0];
    const columnMap = detectColumnMapping<TrainingData>(headerRow, TRAINING_COLUMN_MAPPINGS);

    // Validate required columns
    const requiredFields: (keyof TrainingData)[] = ['employeeEmail', 'trainingType', 'trainingDate'];
    const mappedFields = Array.from(columnMap.values());
    const missingFields = requiredFields.filter(field => {
      return !mappedFields.includes(field);
    });

    if (missingFields.length > 0) {
      errors.push({
        row: 1,
        message: `Lipsesc coloane obligatorii: ${missingFields.join(', ')}`,
        severity: 'error'
      });
      return { parsed, errors, warnings, totalRows: rows.length - 1, successCount: 0, errorCount: 1 };
    }

    // Process data rows
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 1;
      const rowErrors: ParseError[] = [];
      const rowWarnings: ParseWarning[] = [];

      if (row.every(cell => !cellToString(cell))) {
        continue; // Skip empty rows
      }

      const training: Partial<TrainingData> = {};

      // Map columns to fields
      for (const [colIndex, field] of columnMap.entries()) {
        const value = cellToString(row[colIndex]);

        if (value) {
          if (field === 'duration') {
            const duration = parseFloat(value);
            if (!isNaN(duration)) {
              training.duration = duration;
            }
          } else {
            (training as any)[field] = value;
          }
        }
      }

      // Validate required fields
      if (!training.employeeEmail) {
        rowErrors.push({
          row: rowNum,
          field: 'employeeEmail',
          message: 'Email angajat este obligatoriu',
          severity: 'error'
        });
      } else if (!isValidEmail(training.employeeEmail)) {
        rowErrors.push({
          row: rowNum,
          field: 'employeeEmail',
          value: training.employeeEmail,
          message: 'Format email invalid',
          severity: 'error'
        });
      }

      if (!training.trainingType) {
        rowErrors.push({
          row: rowNum,
          field: 'trainingType',
          message: 'Tipul instruirii este obligatoriu',
          severity: 'error'
        });
      }

      if (!training.trainingDate) {
        rowErrors.push({
          row: rowNum,
          field: 'trainingDate',
          message: 'Data instruirii este obligatorie',
          severity: 'error'
        });
      } else {
        const date = parseDate(training.trainingDate);
        if (!date) {
          rowErrors.push({
            row: rowNum,
            field: 'trainingDate',
            value: training.trainingDate,
            message: 'Format dată invalid (se așteaptă YYYY-MM-DD sau DD.MM.YYYY)',
            severity: 'error'
          });
        } else {
          training.trainingDate = date.toISOString().split('T')[0];
        }
      }

      // Validate optional fields
      if (training.expiryDate) {
        const date = parseDate(training.expiryDate);
        if (!date) {
          rowWarnings.push({
            row: rowNum,
            field: 'expiryDate',
            value: training.expiryDate,
            message: 'Format dată expirare invalid',
            severity: 'warning'
          });
        } else {
          training.expiryDate = date.toISOString().split('T')[0];

          // Check if expiry is before training date
          const trainingDateObj = parseDate(training.trainingDate);
          if (trainingDateObj && date < trainingDateObj) {
            rowWarnings.push({
              row: rowNum,
              field: 'expiryDate',
              message: 'Data expirării este înainte de data instruirii',
              severity: 'warning'
            });
          }
        }
      }

      if (training.duration !== undefined && training.duration <= 0) {
        rowWarnings.push({
          row: rowNum,
          field: 'duration',
          value: training.duration,
          message: 'Durata trebuie să fie pozitivă',
          severity: 'warning'
        });
      }

      // Add to results
      if (rowErrors.length === 0) {
        parsed.push(training as TrainingData);
      }

      errors.push(...rowErrors);
      warnings.push(...rowWarnings);
    }

    return {
      parsed,
      errors,
      warnings,
      totalRows: rows.length - 1,
      successCount: parsed.length,
      errorCount: errors.length
    };

  } catch (error) {
    errors.push({
      row: 0,
      message: `Eroare la parsarea Excel: ${error instanceof Error ? error.message : 'Eroare necunoscută'}`,
      severity: 'error'
    });

    return {
      parsed,
      errors,
      warnings,
      totalRows: 0,
      successCount: 0,
      errorCount: errors.length
    };
  }
}

// ============================================================================
// MEDICAL EXCEL PARSER
// ============================================================================

/**
 * Parse medical Excel with validation
 */
export function parseMedicalExcel(buffer: ArrayBuffer): ParseResult<MedicalData> {
  const errors: ParseError[] = [];
  const warnings: ParseWarning[] = [];
  const parsed: MedicalData[] = [];

  try {
    const worksheet = bufferToWorksheet(buffer);

    if (!worksheet) {
      errors.push({
        row: 0,
        message: 'Fișierul Excel nu poate fi citit sau este invalid',
        severity: 'error'
      });
      return { parsed, errors, warnings, totalRows: 0, successCount: 0, errorCount: 1 };
    }

    const rows = worksheetToRows(worksheet);

    if (rows.length === 0) {
      errors.push({
        row: 0,
        message: 'Fișierul Excel este gol',
        severity: 'error'
      });
      return { parsed, errors, warnings, totalRows: 0, successCount: 0, errorCount: 1 };
    }

    const headerRow = rows[0];
    const columnMap = detectColumnMapping<MedicalData>(headerRow, MEDICAL_COLUMN_MAPPINGS);

    // Validate required columns
    const requiredFields: (keyof MedicalData)[] = [
      'employeeEmail',
      'examDate',
      'expiryDate',
      'examType',
      'result'
    ];
    const missingFields = requiredFields.filter(field => {
      return ![...columnMap.values()].includes(field);
    });

    if (missingFields.length > 0) {
      errors.push({
        row: 1,
        message: `Lipsesc coloane obligatorii: ${missingFields.join(', ')}`,
        severity: 'error'
      });
      return { parsed, errors, warnings, totalRows: rows.length - 1, successCount: 0, errorCount: 1 };
    }

    // Process data rows
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 1;
      const rowErrors: ParseError[] = [];
      const rowWarnings: ParseWarning[] = [];

      if (row.every(cell => !cellToString(cell))) {
        continue; // Skip empty rows
      }

      const medical: Partial<MedicalData> = {};

      // Map columns to fields
      for (const [colIndex, field] of columnMap.entries()) {
        const value = cellToString(row[colIndex]);

        if (value) {
          (medical as any)[field] = value;
        }
      }

      // Validate required fields
      if (!medical.employeeEmail) {
        rowErrors.push({
          row: rowNum,
          field: 'employeeEmail',
          message: 'Email angajat este obligatoriu',
          severity: 'error'
        });
      } else if (!isValidEmail(medical.employeeEmail)) {
        rowErrors.push({
          row: rowNum,
          field: 'employeeEmail',
          value: medical.employeeEmail,
          message: 'Format email invalid',
          severity: 'error'
        });
      }

      if (!medical.examDate) {
        rowErrors.push({
          row: rowNum,
          field: 'examDate',
          message: 'Data examenului este obligatorie',
          severity: 'error'
        });
      } else {
        const date = parseDate(medical.examDate);
        if (!date) {
          rowErrors.push({
            row: rowNum,
            field: 'examDate',
            value: medical.examDate,
            message: 'Format dată invalid (se așteaptă YYYY-MM-DD sau DD.MM.YYYY)',
            severity: 'error'
          });
        } else {
          medical.examDate = date.toISOString().split('T')[0];
        }
      }

      if (!medical.expiryDate) {
        rowErrors.push({
          row: rowNum,
          field: 'expiryDate',
          message: 'Data expirării este obligatorie',
          severity: 'error'
        });
      } else {
        const date = parseDate(medical.expiryDate);
        if (!date) {
          rowErrors.push({
            row: rowNum,
            field: 'expiryDate',
            value: medical.expiryDate,
            message: 'Format dată invalid',
            severity: 'error'
          });
        } else {
          medical.expiryDate = date.toISOString().split('T')[0];

          // Check if expiry is before exam date
          const examDateObj = parseDate(medical.examDate);
          if (examDateObj && date < examDateObj) {
            rowWarnings.push({
              row: rowNum,
              field: 'expiryDate',
              message: 'Data expirării este înainte de data examenului',
              severity: 'warning'
            });
          }
        }
      }

      if (!medical.examType) {
        rowErrors.push({
          row: rowNum,
          field: 'examType',
          message: 'Tipul examenului este obligatoriu',
          severity: 'error'
        });
      }

      if (!medical.result) {
        rowErrors.push({
          row: rowNum,
          field: 'result',
          message: 'Rezultatul este obligatoriu',
          severity: 'error'
        });
      } else {
        const normalizedResult = normalizeResult(medical.result);
        if (!normalizedResult) {
          rowErrors.push({
            row: rowNum,
            field: 'result',
            value: medical.result,
            message: 'Rezultat invalid (se acceptă: apt, inapt, apt_restrictii)',
            severity: 'error'
          });
        } else {
          medical.result = normalizedResult;
        }
      }

      // Validate restrictions
      if (medical.result === 'apt_restrictii' && !medical.restrictions) {
        rowWarnings.push({
          row: rowNum,
          field: 'restrictions',
          message: 'Se recomandă specificarea restricțiilor pentru rezultat "apt cu restricții"',
          severity: 'warning'
        });
      }

      if (medical.result !== 'apt_restrictii' && medical.restrictions) {
        rowWarnings.push({
          row: rowNum,
          field: 'restrictions',
          message: 'Restricțiile sunt specificate dar rezultatul nu este "apt cu restricții"',
          severity: 'warning'
        });
      }

      // Add to results
      if (rowErrors.length === 0) {
        parsed.push(medical as MedicalData);
      }

      errors.push(...rowErrors);
      warnings.push(...rowWarnings);
    }

    return {
      parsed,
      errors,
      warnings,
      totalRows: rows.length - 1,
      successCount: parsed.length,
      errorCount: errors.length
    };

  } catch (error) {
    errors.push({
      row: 0,
      message: `Eroare la parsarea Excel: ${error instanceof Error ? error.message : 'Eroare necunoscută'}`,
      severity: 'error'
    });

    return {
      parsed,
      errors,
      warnings,
      totalRows: 0,
      successCount: 0,
      errorCount: errors.length
    };
  }
}
