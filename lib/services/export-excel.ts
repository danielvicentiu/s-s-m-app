// lib/services/export-excel.ts
// Excel XLSX Export Service: Generate multi-sheet Excel workbooks
// Uses SheetJS (xlsx) for comprehensive Excel generation
// Date: 14 Februarie 2026

import * as XLSX from 'xlsx';
import { createSupabaseServer } from '@/lib/supabase/server';

// ========== TYPES ==========

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface ExportResult {
  success: boolean;
  buffer?: Buffer;
  filename: string;
  error?: string;
}

// ========== HELPER FUNCTIONS ==========

/**
 * Format date for Excel (DD.MM.YYYY)
 */
function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';

  try {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  } catch {
    return '';
  }
}

/**
 * Calculate expiry status
 */
function getExpiryStatus(expiryDate: string | null): string {
  if (!expiryDate) return 'Necunoscut';

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) return 'Expirat';
  if (daysUntilExpiry <= 30) return 'Expiră în curând';
  return 'Valid';
}

/**
 * Format boolean for Excel
 */
function formatBoolean(value: boolean | null): string {
  if (value === null || value === undefined) return '';
  return value ? 'Da' : 'Nu';
}

// Reserved for future use: Cell coloring based on status
// function getStatusColor(status: string): { fgColor: { rgb: string } } | undefined {
//   const statusColors: Record<string, string> = {
//     'Expirat': 'FFCCCC',           // Light red
//     'Expiră în curând': 'FFF4CC',  // Light yellow
//     'Valid': 'CCFFCC',             // Light green
//     'Completat': 'CCFFCC',         // Light green
//     'În curs': 'E6F2FF',           // Light blue
//     'Depășit': 'FFCCCC',           // Light red
//     'Apt': 'CCFFCC',               // Light green
//     'Inapt': 'FFCCCC',             // Light red
//     'Apt condiționat': 'FFF4CC',   // Light yellow
//     'Inapt temporar': 'FFE6CC',    // Light orange
//     'Da': 'CCFFCC',                // Light green
//     'Nu': 'FFCCCC'                 // Light red
//   }
//
//   const color = statusColors[status]
//   return color ? { fgColor: { rgb: color } } : undefined
// }

// Reserved for future use: Apply cell formatting with styling
// function formatCell(
//   value: string | number | boolean | Date,
//   options: {
//     bold?: boolean
//     color?: string
//     bgColor?: string
//     align?: 'left' | 'center' | 'right'
//   } = {}
// ): XLSX.CellObject {
//   const cell: XLSX.CellObject = { v: value, t: 's' }
//
//   // Determine cell type
//   if (typeof value === 'number') {
//     cell.t = 'n'
//   } else if (typeof value === 'boolean') {
//     cell.t = 'b'
//   } else if (value instanceof Date) {
//     cell.t = 'd'
//   }
//
//   // Apply styling
//   cell.s = {
//     font: {
//       bold: options.bold,
//       color: options.color ? { rgb: options.color } : undefined
//     },
//     fill: options.bgColor ? {
//       patternType: 'solid',
//       fgColor: { rgb: options.bgColor }
//     } : undefined,
//     alignment: {
//       horizontal: options.align || 'left',
//       vertical: 'center',
//       wrapText: false
//     },
//     border: {
//       top: { style: 'thin', color: { rgb: 'CCCCCC' } },
//       bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
//       left: { style: 'thin', color: { rgb: 'CCCCCC' } },
//       right: { style: 'thin', color: { rgb: 'CCCCCC' } }
//     }
//   }
//
//   return cell
// }

/**
 * Auto-size columns based on content
 */
function autoSizeColumns(worksheet: XLSX.WorkSheet): void {
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  const columnWidths: number[] = [];

  // Calculate max width for each column
  for (let C = range.s.c; C <= range.e.c; ++C) {
    let maxWidth = 10; // Minimum width

    for (let R = range.s.r; R <= range.e.r; ++R) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = worksheet[cellAddress];

      if (cell && cell.v) {
        const cellValue = String(cell.v);
        const cellWidth = cellValue.length;
        maxWidth = Math.max(maxWidth, cellWidth);
      }
    }

    // Cap at 50 characters max
    columnWidths.push(Math.min(maxWidth + 2, 50));
  }

  worksheet['!cols'] = columnWidths.map((w) => ({ wch: w }));
}

// Reserved for future use: Add styled header rows
// function addHeaderRow(worksheet: XLSX.WorkSheet, headers: string[]): void {
//   headers.forEach((header, index) => {
//     const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index })
//     worksheet[cellAddress] = formatCell(header, {
//       bold: true,
//       bgColor: '4472C4',
//       color: 'FFFFFF',
//       align: 'center'
//     })
//   })
// }

// ========== EXPORT FUNCTIONS ==========

/**
 * Export employees to Excel with comprehensive data
 */
export async function exportEmployeesExcel(organizationId: string): Promise<ExportResult> {
  try {
    const supabase = await createSupabaseServer();

    // Fetch employees
    const { data: employees, error } = await supabase
      .from('employees')
      .select('*')
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .order('full_name', { ascending: true });

    if (error) {
      console.error('Error fetching employees:', error);
      return {
        success: false,
        filename: '',
        error: 'Eroare la încărcarea angajaților',
      };
    }

    if (!employees || employees.length === 0) {
      return {
        success: false,
        filename: '',
        error: 'Nu există angajați de exportat',
      };
    }

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Sheet 1: Angajați
    const employeesData = employees.map((emp) => ({
      ID: emp.id,
      'Nume complet': emp.full_name,
      Email: emp.email || '',
      Telefon: emp.phone || '',
      Funcție: emp.job_title || '',
      Departament: emp.department || '',
      'Cod COR': emp.cor_code || '',
      'Data angajării': formatDate(emp.hire_date),
      Activ: formatBoolean(emp.is_active),
      'Data creării': formatDate(emp.created_at),
    }));

    const employeesSheet = XLSX.utils.json_to_sheet(employeesData);
    autoSizeColumns(employeesSheet);

    // Add to workbook
    XLSX.utils.book_append_sheet(workbook, employeesSheet, 'Angajați');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `angajati_${timestamp}.xlsx`;

    return {
      success: true,
      buffer: Buffer.from(buffer),
      filename,
    };
  } catch (err) {
    console.error('Error exporting employees Excel:', err);
    return {
      success: false,
      filename: '',
      error: 'Eroare la generarea fișierului Excel',
    };
  }
}

/**
 * Export comprehensive compliance report with multiple sheets
 * Includes: Angajati, Instruiri, Medical, Echipamente, Rezumat
 */
export async function exportComplianceReportExcel(organizationId: string): Promise<ExportResult> {
  try {
    const supabase = await createSupabaseServer();

    // Fetch all data in parallel
    const [employeesResult, trainingsResult, medicalResult, equipmentResult] = await Promise.all([
      // Employees
      supabase
        .from('employees')
        .select('*')
        .eq('organization_id', organizationId)
        .is('deleted_at', null)
        .order('full_name', { ascending: true }),

      // Trainings
      supabase
        .from('training_assignments')
        .select(
          `
          *,
          employees:worker_id (full_name, job_title, department),
          training_modules:module_id (code, title, category, training_type)
        `
        )
        .eq('organization_id', organizationId)
        .order('assigned_at', { ascending: false }),

      // Medical examinations
      supabase
        .from('medical_examinations')
        .select('*')
        .eq('organization_id', organizationId)
        .order('examination_date', { ascending: false }),

      // Safety equipment
      supabase
        .from('safety_equipment')
        .select('*')
        .eq('organization_id', organizationId)
        .order('equipment_type', { ascending: true }),
    ]);

    // Check for errors
    if (
      employeesResult.error ||
      trainingsResult.error ||
      medicalResult.error ||
      equipmentResult.error
    ) {
      console.error('Error fetching data:', {
        employees: employeesResult.error,
        trainings: trainingsResult.error,
        medical: medicalResult.error,
        equipment: equipmentResult.error,
      });
      return {
        success: false,
        filename: '',
        error: 'Eroare la încărcarea datelor',
      };
    }

    const employees = employeesResult.data || [];
    const trainings = trainingsResult.data || [];
    const medicalExams = medicalResult.data || [];
    const equipment = equipmentResult.data || [];

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // ========== SHEET 1: Angajați ==========
    const employeesData = employees.map((emp) => ({
      ID: emp.id,
      'Nume complet': emp.full_name,
      Email: emp.email || '',
      Telefon: emp.phone || '',
      Funcție: emp.job_title || '',
      Departament: emp.department || '',
      'Cod COR': emp.cor_code || '',
      'Data angajării': formatDate(emp.hire_date),
      Activ: formatBoolean(emp.is_active),
      'Data creării': formatDate(emp.created_at),
    }));

    const employeesSheet = XLSX.utils.json_to_sheet(employeesData);
    autoSizeColumns(employeesSheet);
    XLSX.utils.book_append_sheet(workbook, employeesSheet, 'Angajați');

    // ========== SHEET 2: Instruiri ==========
    const statusLabels: Record<string, string> = {
      assigned: 'Atribuit',
      in_progress: 'În curs',
      completed: 'Completat',
      overdue: 'Depășit',
      expired: 'Expirat',
      exempted: 'Exceptat',
    };

    const categoryLabels: Record<string, string> = {
      ssm: 'SSM',
      psi: 'PSI',
      su: 'Situații de urgență',
      nis2: 'NIS2',
      custom: 'Personalizat',
    };

    const typeLabels: Record<string, string> = {
      introductiv_general: 'Introductiv general',
      la_locul_de_munca: 'La locul de muncă',
      periodic: 'Periodic',
      suplimentar: 'Suplimentar',
      psi: 'PSI',
      situatii_urgenta: 'Situații de urgență',
      custom: 'Personalizat',
    };

    const trainingsData = trainings.map((training) => {
      const employee = training.employees as {
        full_name?: string;
        job_title?: string | null;
        department?: string | null;
      } | null;
      const trainingModule = training.training_modules as {
        code?: string;
        title?: string;
        category?: string;
        training_type?: string;
      } | null;

      return {
        'ID Atribuire': training.id,
        Angajat: employee?.full_name || 'Necunoscut',
        Funcție: employee?.job_title || '',
        Departament: employee?.department || '',
        'Cod modul': trainingModule?.code || '',
        'Titlu modul': trainingModule?.title || '',
        Categorie: categoryLabels[trainingModule?.category || ''] || trainingModule?.category || '',
        'Tip instruire':
          typeLabels[trainingModule?.training_type || ''] || trainingModule?.training_type || '',
        'Data atribuirii': formatDate(training.assigned_at),
        'Data scadentă': formatDate(training.due_date),
        Status: statusLabels[training.status] || training.status,
        'Data finalizării': formatDate(training.completed_at),
        'Data următorului control': formatDate(training.next_due_date),
        Observații: training.notes || '',
      };
    });

    const trainingsSheet = XLSX.utils.json_to_sheet(trainingsData);
    autoSizeColumns(trainingsSheet);
    XLSX.utils.book_append_sheet(workbook, trainingsSheet, 'Instruiri');

    // ========== SHEET 3: Medicina Muncii ==========
    const examTypeLabels: Record<string, string> = {
      periodic: 'Periodic',
      angajare: 'La angajare',
      reluare: 'La reluare',
      la_cerere: 'La cerere',
      supraveghere: 'Supraveghere specială',
      post_accident: 'Post-accident',
      reevaluare: 'Reevaluare',
    };

    const resultLabels: Record<string, string> = {
      apt: 'Apt',
      apt_conditionat: 'Apt condiționat',
      inapt_temporar: 'Inapt temporar',
      inapt: 'Inapt',
    };

    const riskLabels: Record<string, string> = {
      scazut: 'Scăzut',
      mediu: 'Mediu',
      ridicat: 'Ridicat',
      critic: 'Critic',
    };

    const medicalData = medicalExams.map((exam) => ({
      ID: exam.id,
      'Nume angajat': exam.employee_name,
      Funcție: exam.job_title || '',
      'Tip examinare':
        examTypeLabels[exam.exam_type || exam.examination_type] ||
        exam.exam_type ||
        exam.examination_type ||
        '',
      'Data examinării': formatDate(exam.examination_date),
      'Data expirării': formatDate(exam.expiry_date),
      Status: getExpiryStatus(exam.expiry_date),
      Rezultat: resultLabels[exam.result] || exam.result,
      Restricții: exam.restrictions || '',
      Medic: exam.doctor_name || '',
      'Specializare medic': exam.doctor_specialization || '',
      Clinică: exam.clinic_name || '',
      'Nivel risc': riskLabels[exam.risk_level || ''] || exam.risk_level || '',
      'Cost (RON)': exam.cost || '',
      'Data următorului control': formatDate(exam.next_exam_date),
      Observații: exam.notes || '',
    }));

    const medicalSheet = XLSX.utils.json_to_sheet(medicalData);
    autoSizeColumns(medicalSheet);
    XLSX.utils.book_append_sheet(workbook, medicalSheet, 'Medicina Muncii');

    // ========== SHEET 4: Echipamente ==========
    const equipmentTypeLabels: Record<string, string> = {
      stingator: 'Stingător',
      trusa_prim_ajutor: 'Trusă prim ajutor',
      hidrant: 'Hidrant interior',
      detector_fum: 'Detector fum',
      detector_gaz: 'Detector gaz',
      iluminat_urgenta: 'Iluminat urgență',
      panou_semnalizare: 'Panou semnalizare',
      trusa_scule: 'Trusă scule',
      eip: 'EIP (Echipament individual protecție)',
      altul: 'Altul',
    };

    const equipmentData = equipment.map((item) => ({
      ID: item.id,
      'Tip echipament': equipmentTypeLabels[item.equipment_type] || item.equipment_type,
      Descriere: item.description || '',
      Locație: item.location || '',
      'Serie/Nr. inventar': item.serial_number || '',
      'Data ultimei verificări': formatDate(item.last_inspection_date),
      'Data expirării': formatDate(item.expiry_date),
      Status: getExpiryStatus(item.expiry_date),
      'Data următoarei inspecții': formatDate(item.next_inspection_date),
      Inspector: item.inspector_name || '',
      Conform: formatBoolean(item.is_compliant),
      Observații: item.notes || '',
    }));

    const equipmentSheet = XLSX.utils.json_to_sheet(equipmentData);
    autoSizeColumns(equipmentSheet);
    XLSX.utils.book_append_sheet(workbook, equipmentSheet, 'Echipamente');

    // ========== SHEET 5: Rezumat Conformitate ==========
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Calculate statistics
    const expiredMedical = medicalExams.filter((m) => new Date(m.expiry_date) < now).length;
    const expiringMedical = medicalExams.filter((m) => {
      const expiry = new Date(m.expiry_date);
      return expiry >= now && expiry <= thirtyDaysFromNow;
    }).length;
    const validMedical = medicalExams.length - expiredMedical - expiringMedical;

    const expiredEquipment = equipment.filter((e) => new Date(e.expiry_date) < now).length;
    const expiringEquipment = equipment.filter((e) => {
      const expiry = new Date(e.expiry_date);
      return expiry >= now && expiry <= thirtyDaysFromNow;
    }).length;
    const nonCompliantEquipment = equipment.filter((e) => !e.is_compliant).length;
    const validEquipment = equipment.length - expiredEquipment - expiringEquipment;

    const completedTrainings = trainings.filter((t) => t.status === 'completed').length;
    const overdueTrainings = trainings.filter((t) => t.status === 'overdue').length;
    const pendingTrainings = trainings.filter(
      (t) => t.status === 'assigned' || t.status === 'in_progress'
    ).length;

    const summaryData = [
      {
        Categorie: 'Angajați',
        Total: employees.length,
        Activi: employees.filter((e) => e.is_active).length,
        Inactivi: employees.filter((e) => !e.is_active).length,
        Observații: '',
      },
      {
        Categorie: 'Instruiri',
        Total: trainings.length,
        Activi: completedTrainings,
        Inactivi: overdueTrainings,
        Observații: `${pendingTrainings} în curs`,
      },
      {
        Categorie: 'Medicina muncii',
        Total: medicalExams.length,
        Activi: validMedical,
        Inactivi: expiredMedical,
        Observații: `${expiringMedical} expiră în 30 zile`,
      },
      {
        Categorie: 'Echipamente',
        Total: equipment.length,
        Activi: validEquipment,
        Inactivi: expiredEquipment,
        Observații: `${nonCompliantEquipment} neconforme, ${expiringEquipment} expiră în 30 zile`,
      },
    ];

    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    autoSizeColumns(summarySheet);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Rezumat');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `raport_conformitate_${timestamp}.xlsx`;

    return {
      success: true,
      buffer: Buffer.from(buffer),
      filename,
    };
  } catch (err) {
    console.error('Error exporting compliance report Excel:', err);
    return {
      success: false,
      filename: '',
      error: 'Eroare la generarea raportului Excel',
    };
  }
}
