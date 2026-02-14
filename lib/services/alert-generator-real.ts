/**
 * Alert Generator Service
 *
 * Automated alert generation from Supabase data:
 * - Training expiries
 * - Medical examination expiries
 * - Equipment inspection due dates
 * - Document expiries
 *
 * Creates alerts with deduplication logic.
 */

import { createSupabaseServer } from '@/lib/supabase/server';
import { Database } from '@/lib/types';

type AlertType = Database['public']['Tables']['alerts']['Row']['type'];
type AlertSeverity = Database['public']['Tables']['alerts']['Row']['severity'];

interface AlertCreationParams {
  organizationId: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  entityType?: string;
  entityId?: string;
  dueDate?: string;
  metadata?: Record<string, any>;
}

interface ExpiryCheckResult {
  count: number;
  alerts: AlertCreationParams[];
}

/**
 * Check for training expiries
 * Looks for trainings where next_date is within warningDays
 */
export async function checkTrainingExpiries(
  organizationId: string,
  warningDays: number = 30
): Promise<ExpiryCheckResult> {
  const supabase = await createSupabaseServer();

  try {
    const warningDate = new Date();
    warningDate.setDate(warningDate.getDate() + warningDays);
    const warningDateStr = warningDate.toISOString().split('T')[0];

    const today = new Date().toISOString().split('T')[0];

    // Query trainings that are due within warningDays
    const { data: trainings, error } = await supabase
      .from('trainings')
      .select(`
        id,
        employee_id,
        training_type,
        next_date,
        employees!inner(
          id,
          first_name,
          last_name,
          organization_id
        )
      `)
      .eq('employees.organization_id', organizationId)
      .gte('next_date', today)
      .lte('next_date', warningDateStr)
      .is('deleted_at', null);

    if (error) {
      console.error('Error checking training expiries:', error);
      return { count: 0, alerts: [] };
    }

    const alerts: AlertCreationParams[] = (trainings || []).map((training) => {
      const employee = training.employees as any;
      const daysUntilExpiry = Math.ceil(
        (new Date(training.next_date!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        organizationId,
        type: 'training_expiry',
        severity: daysUntilExpiry <= 7 ? 'critical' : daysUntilExpiry <= 14 ? 'high' : 'medium',
        title: `Instruire ${training.training_type} expiră în ${daysUntilExpiry} zile`,
        description: `Angajat: ${employee.first_name} ${employee.last_name}. Data expirare: ${new Date(training.next_date!).toLocaleDateString('ro-RO')}`,
        entityType: 'training',
        entityId: training.id,
        dueDate: training.next_date!,
        metadata: {
          employeeId: training.employee_id,
          trainingType: training.training_type,
          daysUntilExpiry,
        },
      };
    });

    return { count: alerts.length, alerts };
  } catch (error) {
    console.error('Exception in checkTrainingExpiries:', error);
    return { count: 0, alerts: [] };
  }
}

/**
 * Check for medical examination expiries
 * Looks for medical_records where next_exam_date is within warningDays
 */
export async function checkMedicalExpiries(
  organizationId: string,
  warningDays: number = 30
): Promise<ExpiryCheckResult> {
  const supabase = await createSupabaseServer();

  try {
    const warningDate = new Date();
    warningDate.setDate(warningDate.getDate() + warningDays);
    const warningDateStr = warningDate.toISOString().split('T')[0];

    const today = new Date().toISOString().split('T')[0];

    // Query medical records that are due within warningDays
    const { data: medicalRecords, error } = await supabase
      .from('medical_records')
      .select(`
        id,
        employee_id,
        exam_type,
        next_exam_date,
        employees!inner(
          id,
          first_name,
          last_name,
          organization_id
        )
      `)
      .eq('employees.organization_id', organizationId)
      .gte('next_exam_date', today)
      .lte('next_exam_date', warningDateStr)
      .is('deleted_at', null);

    if (error) {
      console.error('Error checking medical expiries:', error);
      return { count: 0, alerts: [] };
    }

    const alerts: AlertCreationParams[] = (medicalRecords || []).map((record) => {
      const employee = record.employees as any;
      const daysUntilExpiry = Math.ceil(
        (new Date(record.next_exam_date!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        organizationId,
        type: 'medical_expiry',
        severity: daysUntilExpiry <= 7 ? 'critical' : daysUntilExpiry <= 14 ? 'high' : 'medium',
        title: `Control medical ${record.exam_type} expiră în ${daysUntilExpiry} zile`,
        description: `Angajat: ${employee.first_name} ${employee.last_name}. Data expirare: ${new Date(record.next_exam_date!).toLocaleDateString('ro-RO')}`,
        entityType: 'medical_record',
        entityId: record.id,
        dueDate: record.next_exam_date!,
        metadata: {
          employeeId: record.employee_id,
          examType: record.exam_type,
          daysUntilExpiry,
        },
      };
    });

    return { count: alerts.length, alerts };
  } catch (error) {
    console.error('Exception in checkMedicalExpiries:', error);
    return { count: 0, alerts: [] };
  }
}

/**
 * Check for equipment inspection due dates
 * Looks for equipment where next_inspection is within warningDays
 */
export async function checkEquipmentInspections(
  organizationId: string,
  warningDays: number = 30
): Promise<ExpiryCheckResult> {
  const supabase = await createSupabaseServer();

  try {
    const warningDate = new Date();
    warningDate.setDate(warningDate.getDate() + warningDays);
    const warningDateStr = warningDate.toISOString().split('T')[0];

    const today = new Date().toISOString().split('T')[0];

    // Query equipment that needs inspection within warningDays
    const { data: equipment, error } = await supabase
      .from('equipment')
      .select('id, name, serial_number, next_inspection, equipment_type, location')
      .eq('organization_id', organizationId)
      .gte('next_inspection', today)
      .lte('next_inspection', warningDateStr)
      .is('deleted_at', null);

    if (error) {
      console.error('Error checking equipment inspections:', error);
      return { count: 0, alerts: [] };
    }

    const alerts: AlertCreationParams[] = (equipment || []).map((item) => {
      const daysUntilInspection = Math.ceil(
        (new Date(item.next_inspection!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        organizationId,
        type: 'equipment_inspection',
        severity: daysUntilInspection <= 7 ? 'critical' : daysUntilInspection <= 14 ? 'high' : 'medium',
        title: `Verificare echipament ${item.name} în ${daysUntilInspection} zile`,
        description: `Echipament: ${item.name} (${item.serial_number || 'fără serie'}). Tip: ${item.equipment_type}. Data verificare: ${new Date(item.next_inspection!).toLocaleDateString('ro-RO')}`,
        entityType: 'equipment',
        entityId: item.id,
        dueDate: item.next_inspection!,
        metadata: {
          equipmentName: item.name,
          serialNumber: item.serial_number,
          equipmentType: item.equipment_type,
          location: item.location,
          daysUntilInspection,
        },
      };
    });

    return { count: alerts.length, alerts };
  } catch (error) {
    console.error('Exception in checkEquipmentInspections:', error);
    return { count: 0, alerts: [] };
  }
}

/**
 * Check for document expiries
 * Looks for documents where expiry_date is within warningDays
 */
export async function checkDocumentExpiries(
  organizationId: string,
  warningDays: number = 30
): Promise<ExpiryCheckResult> {
  const supabase = await createSupabaseServer();

  try {
    const warningDate = new Date();
    warningDate.setDate(warningDate.getDate() + warningDays);
    const warningDateStr = warningDate.toISOString().split('T')[0];

    const today = new Date().toISOString().split('T')[0];

    // Query documents that expire within warningDays
    const { data: documents, error } = await supabase
      .from('documents')
      .select('id, name, document_type, expiry_date, file_url')
      .eq('organization_id', organizationId)
      .gte('expiry_date', today)
      .lte('expiry_date', warningDateStr)
      .is('deleted_at', null);

    if (error) {
      console.error('Error checking document expiries:', error);
      return { count: 0, alerts: [] };
    }

    const alerts: AlertCreationParams[] = (documents || []).map((doc) => {
      const daysUntilExpiry = Math.ceil(
        (new Date(doc.expiry_date!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        organizationId,
        type: 'document_expiry',
        severity: daysUntilExpiry <= 7 ? 'critical' : daysUntilExpiry <= 14 ? 'high' : 'medium',
        title: `Document ${doc.document_type} expiră în ${daysUntilExpiry} zile`,
        description: `Document: ${doc.name}. Data expirare: ${new Date(doc.expiry_date!).toLocaleDateString('ro-RO')}`,
        entityType: 'document',
        entityId: doc.id,
        dueDate: doc.expiry_date!,
        metadata: {
          documentName: doc.name,
          documentType: doc.document_type,
          fileUrl: doc.file_url,
          daysUntilExpiry,
        },
      };
    });

    return { count: alerts.length, alerts };
  } catch (error) {
    console.error('Exception in checkDocumentExpiries:', error);
    return { count: 0, alerts: [] };
  }
}

/**
 * Create an alert with deduplication logic
 * Checks if alert already exists by type + entityId + dueDate
 */
async function createAlertIfNotExists(params: AlertCreationParams): Promise<boolean> {
  const supabase = await createSupabaseServer();

  try {
    // Check for existing alert with same type, entity, and due date
    const { data: existing, error: checkError } = await supabase
      .from('alerts')
      .select('id, resolved_at')
      .eq('organization_id', params.organizationId)
      .eq('type', params.type)
      .eq('entity_id', params.entityId || '')
      .eq('due_date', params.dueDate || '')
      .is('resolved_at', null)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing alert:', checkError);
      return false;
    }

    // If alert already exists and is not resolved, skip creation
    if (existing) {
      return false;
    }

    // Create new alert
    const { error: createError } = await supabase
      .from('alerts')
      .insert({
        organization_id: params.organizationId,
        type: params.type,
        severity: params.severity,
        title: params.title,
        description: params.description,
        entity_type: params.entityType,
        entity_id: params.entityId,
        due_date: params.dueDate,
        metadata: params.metadata,
        created_at: new Date().toISOString(),
      });

    if (createError) {
      console.error('Error creating alert:', createError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception in createAlertIfNotExists:', error);
    return false;
  }
}

/**
 * Generate all alerts for an organization
 * Runs all expiry checks and creates alerts
 */
export async function generateAllAlerts(
  organizationId: string,
  warningDays: number = 30
): Promise<{
  success: boolean;
  totalChecked: number;
  totalCreated: number;
  breakdown: {
    trainings: { checked: number; created: number };
    medical: { checked: number; created: number };
    equipment: { checked: number; created: number };
    documents: { checked: number; created: number };
  };
}> {
  try {
    // Run all checks in parallel
    const [trainingsResult, medicalResult, equipmentResult, documentsResult] = await Promise.all([
      checkTrainingExpiries(organizationId, warningDays),
      checkMedicalExpiries(organizationId, warningDays),
      checkEquipmentInspections(organizationId, warningDays),
      checkDocumentExpiries(organizationId, warningDays),
    ]);

    // Collect all alerts
    const allAlerts = [
      ...trainingsResult.alerts,
      ...medicalResult.alerts,
      ...equipmentResult.alerts,
      ...documentsResult.alerts,
    ];

    // Create alerts with deduplication
    const creationResults = await Promise.all(
      allAlerts.map((alert) => createAlertIfNotExists(alert))
    );

    const totalCreated = creationResults.filter((result) => result === true).length;

    // Calculate breakdown
    let trainingsCreated = 0;
    let medicalCreated = 0;
    let equipmentCreated = 0;
    let documentsCreated = 0;

    for (let i = 0; i < creationResults.length; i++) {
      if (creationResults[i]) {
        const alert = allAlerts[i];
        if (alert.type === 'training_expiry') trainingsCreated++;
        else if (alert.type === 'medical_expiry') medicalCreated++;
        else if (alert.type === 'equipment_inspection') equipmentCreated++;
        else if (alert.type === 'document_expiry') documentsCreated++;
      }
    }

    return {
      success: true,
      totalChecked: allAlerts.length,
      totalCreated,
      breakdown: {
        trainings: { checked: trainingsResult.count, created: trainingsCreated },
        medical: { checked: medicalResult.count, created: medicalCreated },
        equipment: { checked: equipmentResult.count, created: equipmentCreated },
        documents: { checked: documentsResult.count, created: documentsCreated },
      },
    };
  } catch (error) {
    console.error('Exception in generateAllAlerts:', error);
    return {
      success: false,
      totalChecked: 0,
      totalCreated: 0,
      breakdown: {
        trainings: { checked: 0, created: 0 },
        medical: { checked: 0, created: 0 },
        equipment: { checked: 0, created: 0 },
        documents: { checked: 0, created: 0 },
      },
    };
  }
}
