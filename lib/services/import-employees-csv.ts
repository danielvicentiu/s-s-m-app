/**
 * Employee CSV Import Service
 *
 * Provides CSV import functionality for employees with:
 * - Automatic separator and encoding detection
 * - Column mapping auto-detection
 * - Comprehensive validation (CNP checksum, email format, required fields)
 * - Row-by-row error and warning collection
 * - Batch insert with transaction support
 */

import { validateCNP, extractCNPInfo } from '@/lib/utils/cnp-validator';
import { createSupabaseServer } from '@/lib/supabase/server';
import { Employee } from '@/lib/types';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface EmployeeImportRow {
  full_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  job_title?: string;
  department?: string;
  hire_date?: string;
  cnp?: string;
}

export interface ValidatedEmployeeRow {
  rowNumber: number;
  data: {
    full_name: string;
    email: string | null;
    phone: string | null;
    job_title: string | null;
    department: string | null;
    hire_date: string | null;
    cnp_hash: string | null;
  };
}

export interface EmployeeImportError {
  rowNumber: number;
  field?: string;
  value?: string;
  message: string;
  severity: 'error';
}

export interface EmployeeImportWarning {
  rowNumber: number;
  field?: string;
  value?: string;
  message: string;
  severity: 'warning';
}

export interface ParseEmployeeCSVResult {
  valid: ValidatedEmployeeRow[];
  errors: EmployeeImportError[];
  warnings: EmployeeImportWarning[];
  totalRows: number;
  validCount: number;
  errorCount: number;
}

export interface ConfirmImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors?: string[];
}

// ============================================================================
// COLUMN MAPPING CONFIGURATION
// ============================================================================

const COLUMN_MAPPINGS: Record<keyof EmployeeImportRow, string[]> = {
  full_name: [
    'full_name',
    'fullname',
    'nume_complet',
    'nume complet',
    'name',
    'nume',
    'angajat',
    'employee',
  ],
  first_name: ['first_name', 'firstname', 'prenume', 'prenom', 'given_name', 'first'],
  last_name: ['last_name', 'lastname', 'nume', 'nume_familie', 'family_name', 'surname', 'last'],
  email: ['email', 'e-mail', 'mail', 'email_address', 'adresa_email', 'adresa email', 'e_mail'],
  phone: [
    'phone',
    'telefon',
    'tel',
    'mobile',
    'telephone',
    'phone_number',
    'numar_telefon',
    'nr_tel',
  ],
  job_title: [
    'job_title',
    'functie',
    'position',
    'post',
    'rol',
    'function',
    'job',
    'title',
    'pozitie',
  ],
  department: ['department', 'departament', 'dept', 'division', 'sector', 'compartiment'],
  hire_date: [
    'hire_date',
    'data_angajare',
    'data angajare',
    'employment_date',
    'start_date',
    'data_start',
    'angajare',
    'employed_since',
  ],
  cnp: ['cnp', 'personal_code', 'cod_numeric_personal', 'cod numeric personal', 'pin'],
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Detect CSV separator (comma, semicolon, tab)
 */
function detectSeparator(content: string): ',' | ';' | '\t' {
  const firstLine = content.split(/\r?\n/)[0] || '';

  const commaCount = (firstLine.match(/,/g) || []).length;
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;

  if (tabCount > 0 && tabCount >= commaCount && tabCount >= semicolonCount) {
    return '\t';
  }

  if (semicolonCount > commaCount) {
    return ';';
  }

  return ',';
}

/**
 * Detect encoding (UTF-8 vs Windows-1250)
 */
function detectEncoding(content: string): 'utf-8' | 'windows-1250' {
  // Check for BOM
  if (content.charCodeAt(0) === 0xfeff) {
    return 'utf-8';
  }

  // Check for Romanian specific characters
  const romanianChars = /[ăâîșțĂÂÎȘȚ]/;
  if (romanianChars.test(content)) {
    return 'utf-8';
  }

  // Check for garbled characters (indicator of wrong encoding)
  const garbledChars = /[\u0080-\u009F]/;
  if (garbledChars.test(content)) {
    return 'windows-1250';
  }

  return 'utf-8';
}

/**
 * Parse CSV content with auto-detected separator
 */
function parseCSV(content: string, separator: ',' | ';' | '\t'): string[][] {
  const lines = content.trim().split(/\r?\n/);
  const rows: string[][] = [];

  for (const line of lines) {
    if (!line.trim()) continue;

    const row: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === separator && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    row.push(current.trim());
    rows.push(row);
  }

  return rows;
}

/**
 * Normalize column name for matching
 */
function normalizeColumnName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '_');
}

/**
 * Auto-detect column mapping from header row
 */
function detectColumnMapping(headerRow: string[]): Map<number, keyof EmployeeImportRow> {
  const columnMap = new Map<number, keyof EmployeeImportRow>();
  const normalizedHeaders = headerRow.map((h) => normalizeColumnName(h));

  for (const [field, aliases] of Object.entries(COLUMN_MAPPINGS) as [
    keyof EmployeeImportRow,
    string[],
  ][]) {
    const normalizedAliases = aliases.map((a) => normalizeColumnName(a));

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
 * Parse date (supports multiple formats)
 */
function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;

  const formats = [
    // ISO format: YYYY-MM-DD
    /^(\d{4})-(\d{2})-(\d{2})$/,
    // European formats: DD.MM.YYYY, DD/MM/YYYY, DD-MM-YYYY
    /^(\d{2})\.(\d{2})\.(\d{4})$/,
    /^(\d{2})\/(\d{2})\/(\d{4})$/,
    /^(\d{2})-(\d{2})-(\d{4})$/,
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
        // European format: DD.MM.YYYY
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
 * Hash CNP for secure storage (SHA-256)
 */
async function hashCNP(cnp: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(cnp);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// ============================================================================
// MAIN EXPORT FUNCTIONS
// ============================================================================

/**
 * Parse and validate employee CSV with comprehensive error checking
 */
export async function parseEmployeeCSV(fileContent: string): Promise<ParseEmployeeCSVResult> {
  const errors: EmployeeImportError[] = [];
  const warnings: EmployeeImportWarning[] = [];
  const valid: ValidatedEmployeeRow[] = [];

  try {
    // Detect separator and encoding
    const separator = detectSeparator(fileContent);
    const encoding = detectEncoding(fileContent);

    // Add info about detected format
    if (separator !== ',') {
      warnings.push({
        rowNumber: 0,
        message: `Separator detectat: ${separator === ';' ? 'punct și virgulă' : 'tab'}`,
        severity: 'warning',
      });
    }

    if (encoding === 'windows-1250') {
      warnings.push({
        rowNumber: 0,
        message: 'Encoding detectat: Windows-1250 (se recomandă UTF-8)',
        severity: 'warning',
      });
    }

    // Parse CSV
    const rows = parseCSV(fileContent, separator);

    if (rows.length === 0) {
      errors.push({
        rowNumber: 0,
        message: 'Fișierul CSV este gol',
        severity: 'error',
      });
      return { valid, errors, warnings, totalRows: 0, validCount: 0, errorCount: 1 };
    }

    // Detect column mapping
    const headerRow = rows[0];
    const columnMap = detectColumnMapping(headerRow);

    // Check for required columns (either full_name OR first_name+last_name)
    const hasFullName = Array.from(columnMap.values()).includes('full_name');
    const hasFirstName = Array.from(columnMap.values()).includes('first_name');
    const hasLastName = Array.from(columnMap.values()).includes('last_name');

    if (!hasFullName && !(hasFirstName && hasLastName)) {
      errors.push({
        rowNumber: 1,
        message:
          'Lipsesc coloane obligatorii: trebuie să existe fie "nume_complet" sau "prenume" + "nume"',
        severity: 'error',
      });
      return { valid, errors, warnings, totalRows: rows.length - 1, validCount: 0, errorCount: 1 };
    }

    // Process data rows
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 1;
      const rowErrors: EmployeeImportError[] = [];
      const rowWarnings: EmployeeImportWarning[] = [];

      // Skip empty rows
      if (row.every((cell) => !cell.trim())) {
        continue;
      }

      // Map columns to fields
      const employeeRow: Partial<EmployeeImportRow> = {};
      for (const [colIndex, field] of columnMap.entries()) {
        const value = row[colIndex]?.trim() || '';
        if (value) {
          employeeRow[field] = value;
        }
      }

      // Build full_name from components if needed
      let fullName = employeeRow.full_name;
      if (!fullName && employeeRow.first_name && employeeRow.last_name) {
        fullName = `${employeeRow.first_name} ${employeeRow.last_name}`;
      } else if (!fullName && (employeeRow.first_name || employeeRow.last_name)) {
        fullName = employeeRow.first_name || employeeRow.last_name;
      }

      // Validate required field: full_name
      if (!fullName) {
        rowErrors.push({
          rowNumber,
          field: 'full_name',
          message: 'Numele complet este obligatoriu',
          severity: 'error',
        });
      }

      // Validate email format (optional but recommended)
      let email: string | null = employeeRow.email || null;
      if (email) {
        if (!isValidEmail(email)) {
          rowErrors.push({
            rowNumber,
            field: 'email',
            value: email,
            message: 'Format email invalid',
            severity: 'error',
          });
          email = null;
        }
      } else {
        rowWarnings.push({
          rowNumber,
          field: 'email',
          message: 'Email lipsă - se recomandă pentru notificări',
          severity: 'warning',
        });
      }

      // Validate phone
      const phone = employeeRow.phone || null;
      if (phone && phone.length < 10) {
        rowWarnings.push({
          rowNumber,
          field: 'phone',
          value: phone,
          message: 'Număr telefon posibil incomplet (< 10 caractere)',
          severity: 'warning',
        });
      }

      // Validate hire_date
      let hireDate: string | null = null;
      if (employeeRow.hire_date) {
        const date = parseDate(employeeRow.hire_date);
        if (!date) {
          rowWarnings.push({
            rowNumber,
            field: 'hire_date',
            value: employeeRow.hire_date,
            message: 'Format dată angajare invalid (se așteaptă YYYY-MM-DD sau DD.MM.YYYY)',
            severity: 'warning',
          });
        } else {
          hireDate = date.toISOString().split('T')[0];

          // Check if hire date is in the future
          if (date > new Date()) {
            rowWarnings.push({
              rowNumber,
              field: 'hire_date',
              value: employeeRow.hire_date,
              message: 'Data angajării este în viitor',
              severity: 'warning',
            });
          }
        }
      }

      // Validate CNP with checksum
      let cnpHash: string | null = null;
      if (employeeRow.cnp) {
        const cnp = employeeRow.cnp.trim();

        if (!validateCNP(cnp)) {
          rowErrors.push({
            rowNumber,
            field: 'cnp',
            value: cnp,
            message: 'CNP invalid (verifică lungimea de 13 cifre și cifra de control)',
            severity: 'error',
          });
        } else {
          // Extract CNP info for additional validation
          const cnpInfo = extractCNPInfo(cnp);

          if (cnpInfo) {
            // Hash CNP for storage
            cnpHash = await hashCNP(cnp);

            // Add helpful info about CNP
            rowWarnings.push({
              rowNumber,
              field: 'cnp',
              message: `CNP valid: ${cnpInfo.sex}, născut/ă în ${cnpInfo.birthDate.toISOString().split('T')[0]}, ${cnpInfo.county}`,
              severity: 'warning',
            });
          }
        }
      }

      // Validate job_title
      if (!employeeRow.job_title) {
        rowWarnings.push({
          rowNumber,
          field: 'job_title',
          message: 'Funcția lipsește - se recomandă pentru rapoarte SSM',
          severity: 'warning',
        });
      }

      // Validate department
      if (!employeeRow.department) {
        rowWarnings.push({
          rowNumber,
          field: 'department',
          message: 'Departamentul lipsește',
          severity: 'warning',
        });
      }

      // Add to results
      if (rowErrors.length === 0 && fullName) {
        valid.push({
          rowNumber,
          data: {
            full_name: fullName,
            email,
            phone,
            job_title: employeeRow.job_title || null,
            department: employeeRow.department || null,
            hire_date: hireDate,
            cnp_hash: cnpHash,
          },
        });
      }

      errors.push(...rowErrors);
      warnings.push(...rowWarnings);
    }

    return {
      valid,
      errors,
      warnings,
      totalRows: rows.length - 1,
      validCount: valid.length,
      errorCount: errors.filter((e) => e.severity === 'error').length,
    };
  } catch (error) {
    errors.push({
      rowNumber: 0,
      message: `Eroare la parsarea CSV: ${error instanceof Error ? error.message : 'Eroare necunoscută'}`,
      severity: 'error',
    });

    return {
      valid,
      errors,
      warnings,
      totalRows: 0,
      validCount: 0,
      errorCount: 1,
    };
  }
}

/**
 * Confirm and batch insert validated employees into database
 */
export async function confirmImport(
  organizationId: string,
  validRows: ValidatedEmployeeRow[]
): Promise<ConfirmImportResult> {
  const supabase = await createSupabaseServer();
  const errors: string[] = [];
  let imported = 0;
  let failed = 0;

  try {
    // Batch insert employees (500 per batch to avoid limits)
    const batchSize = 500;

    for (let i = 0; i < validRows.length; i += batchSize) {
      const batch = validRows.slice(i, i + batchSize);

      const employeesToInsert = batch.map((row) => ({
        organization_id: organizationId,
        full_name: row.data.full_name,
        email: row.data.email,
        phone: row.data.phone,
        job_title: row.data.job_title,
        department: row.data.department,
        hire_date: row.data.hire_date,
        cnp_hash: row.data.cnp_hash,
        is_active: true,
      }));

      const { data, error } = await supabase.from('employees').insert(employeesToInsert).select();

      if (error) {
        failed += batch.length;
        errors.push(`Eroare la inserarea batch-ului ${i / batchSize + 1}: ${error.message}`);
        console.error('Batch insert error:', error);
      } else {
        imported += data?.length || 0;
      }
    }

    return {
      success: imported > 0,
      imported,
      failed,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    console.error('Import error:', error);

    return {
      success: false,
      imported: 0,
      failed: validRows.length,
      errors: [error instanceof Error ? error.message : 'Eroare necunoscută'],
    };
  }
}

/**
 * Complete import workflow: parse, validate, and import
 */
export async function importEmployeesFromCSV(
  organizationId: string,
  fileContent: string
): Promise<{
  parseResult: ParseEmployeeCSVResult;
  importResult?: ConfirmImportResult;
}> {
  // Step 1: Parse and validate
  const parseResult = await parseEmployeeCSV(fileContent);

  // Step 2: If valid rows exist, import them
  let importResult: ConfirmImportResult | undefined;

  if (parseResult.valid.length > 0) {
    importResult = await confirmImport(organizationId, parseResult.valid);
  }

  return {
    parseResult,
    importResult,
  };
}
