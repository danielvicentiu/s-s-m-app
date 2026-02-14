// S-S-M.RO — COMPLETE DATABASE TYPES
// Generated from Supabase schema migrations
// Date: 14 February 2026

// ══════════════════════════════════════════════════════════════════════════════
// ENUMS & UNION TYPES
// ══════════════════════════════════════════════════════════════════════════════

export type ExposureScore = 'necalculat' | 'scazut' | 'mediu' | 'ridicat' | 'critic';
export type CooperationStatus = 'active' | 'warning' | 'uncooperative';
export type MembershipRole = 'consultant' | 'firma_admin' | 'angajat';
export type ExamType =
  | 'periodic'
  | 'angajare'
  | 'reluare'
  | 'la_cerere'
  | 'supraveghere'
  | 'post_accident'
  | 'reevaluare';
export type ExamResult = 'apt' | 'apt_conditionat' | 'inapt_temporar' | 'inapt';
export type RiskLevel = 'scazut' | 'mediu' | 'ridicat' | 'critic';
export type EquipmentType =
  | 'stingator'
  | 'trusa_prim_ajutor'
  | 'hidrant'
  | 'detector_fum'
  | 'detector_gaz'
  | 'iluminat_urgenta'
  | 'panou_semnalizare'
  | 'trusa_scule'
  | 'eip'
  | 'altul';
export type InspectionStatus = 'pass' | 'fail' | 'conditional';
export type EquipmentCondition = 'good' | 'fair' | 'poor';
export type EquipmentAssignmentStatus = 'active' | 'returned' | 'damaged' | 'lost';
export type IncidentType =
  | 'accident_fatal'
  | 'accident_serious'
  | 'accident_minor'
  | 'near_miss'
  | 'property_damage'
  | 'environmental'
  | 'security';
export type IncidentStatus =
  | 'reported'
  | 'under_investigation'
  | 'awaiting_corrective_actions'
  | 'corrective_actions_in_progress'
  | 'closed'
  | 'archived';
export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';
export type ActionType = 'immediate' | 'corrective' | 'preventive';
export type ActionStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type AuditType = 'ssm_general' | 'psi' | 'gdpr' | 'iso_45001';
export type AuditStatus = 'draft' | 'in_progress' | 'completed' | 'archived';
export type AuditAnswer = 'compliant' | 'non_compliant' | 'partial' | 'na';
export type PreventionPlanStatus = 'draft' | 'approved' | 'active' | 'archived';
export type PreventionPriority = 'urgent' | 'high' | 'medium' | 'low';
export type ImplementationStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'delayed'
  | 'cancelled';
export type DocumentCategory =
  | 'fisa_ssm'
  | 'fisa_psi'
  | 'raport_conformitate'
  | 'fisa_instruire'
  | 'proces_verbal'
  | 'certificat'
  | 'contract'
  | 'procedura'
  | 'politica'
  | 'altul';
export type DocumentStatus = 'draft' | 'final' | 'archived';
export type ActivityType =
  | 'employee_created'
  | 'employee_updated'
  | 'employee_deleted'
  | 'training_created'
  | 'training_completed'
  | 'training_updated'
  | 'medical_created'
  | 'medical_updated'
  | 'medical_expiring'
  | 'medical_expired'
  | 'equipment_created'
  | 'equipment_updated'
  | 'equipment_expiring'
  | 'equipment_expired'
  | 'alert_created'
  | 'alert_resolved'
  | 'incident_created'
  | 'incident_updated'
  | 'document_generated'
  | 'document_uploaded'
  | 'audit_started'
  | 'audit_completed'
  | 'user_joined'
  | 'user_left'
  | 'settings_changed'
  | 'other';
export type ActivitySeverity = 'info' | 'warning' | 'error' | 'success';
export type AlertSeverity = 'info' | 'warning' | 'critical' | 'expired';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved' | 'dismissed';
export type CalendarEventType =
  | 'meeting'
  | 'inspection'
  | 'deadline'
  | 'training_external'
  | 'holiday'
  | 'maintenance'
  | 'other';
export type ContactRequestType = 'demo' | 'suport' | 'parteneriat';
export type ContactStatus = 'new' | 'in_progress' | 'resolved' | 'archived';
export type NewsletterSource = 'landing' | 'blog' | 'footer';
export type SubscriptionStatus = 'active' | 'unsubscribed';
export type WebhookStatus = 'pending' | 'success' | 'failed';
export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'cancelled';
export type Currency = 'RON' | 'EUR' | 'BGN' | 'HUF' | 'PLN';
export type CountryCode = 'RO' | 'BG' | 'HU' | 'DE' | 'PL';
export type ObligationFrequency =
  | 'annual'
  | 'biannual'
  | 'quarterly'
  | 'monthly'
  | 'weekly'
  | 'daily'
  | 'on_demand'
  | 'once'
  | 'at_hire'
  | 'at_termination'
  | 'continuous'
  | 'unknown';
export type ObligationStatus = 'draft' | 'validated' | 'approved' | 'published' | 'archived';
export type OrgObligationStatus = 'pending' | 'acknowledged' | 'compliant' | 'non_compliant';
export type RegesStatus = 'active' | 'inactive' | 'error';
export type RegesMessageType =
  | 'employee_create'
  | 'employee_update'
  | 'employee_delete'
  | 'contract_create'
  | 'contract_update'
  | 'contract_end';
export type RegesMessageStatus = 'queued' | 'sending' | 'sent' | 'accepted' | 'rejected' | 'error';
export type RegesReceiptStatus = 'accepted' | 'rejected' | 'pending_validation';
export type RegesResultType = 'success' | 'partial_success' | 'failure';
export type RegesEmploymentStatus = 'active' | 'departed' | 'suspended';
export type AuditLogEntityType =
  | 'reges_connection'
  | 'reges_outbox'
  | 'reges_receipt'
  | 'reges_result'
  | 'employee'
  | 'contract'
  | 'organization'
  | 'user';

// ══════════════════════════════════════════════════════════════════════════════
// TABLE TYPES
// ══════════════════════════════════════════════════════════════════════════════

// ──────────────────────────────────────────────────────────────────────────────
// CORE TABLES
// ──────────────────────────────────────────────────────────────────────────────

export interface Organizations {
  Row: {
    id: string;
    name: string;
    cui: string | null;
    address: string | null;
    county: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    data_completeness: number;
    exposure_score: ExposureScore;
    preferred_channels: string[];
    cooperation_status: CooperationStatus;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    name: string;
    cui?: string | null;
    address?: string | null;
    county?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    data_completeness?: number;
    exposure_score?: ExposureScore;
    preferred_channels?: string[];
    cooperation_status?: CooperationStatus;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    name?: string;
    cui?: string | null;
    address?: string | null;
    county?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    data_completeness?: number;
    exposure_score?: ExposureScore;
    preferred_channels?: string[];
    cooperation_status?: CooperationStatus;
    created_at?: string;
    updated_at?: string;
  };
}

export interface Employees {
  Row: {
    id: string;
    organization_id: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    job_title: string | null;
    department: string | null;
    hire_date: string | null;
    cor_code: string | null;
    cnp_hash: string | null;
    user_id: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  Insert: {
    id?: string;
    organization_id: string;
    full_name: string;
    email?: string | null;
    phone?: string | null;
    job_title?: string | null;
    department?: string | null;
    hire_date?: string | null;
    cor_code?: string | null;
    cnp_hash?: string | null;
    user_id?: string | null;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
  };
  Update: {
    id?: string;
    organization_id?: string;
    full_name?: string;
    email?: string | null;
    phone?: string | null;
    job_title?: string | null;
    department?: string | null;
    hire_date?: string | null;
    cor_code?: string | null;
    cnp_hash?: string | null;
    user_id?: string | null;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
  };
}

export interface Locations {
  Row: {
    id: string;
    organization_id: string;
    name: string;
    address: string | null;
    county: string | null;
    city: string | null;
    postal_code: string | null;
    contact_person: string | null;
    contact_phone: string | null;
    contact_email: string | null;
    description: string | null;
    is_primary: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  Insert: {
    id?: string;
    organization_id: string;
    name: string;
    address?: string | null;
    county?: string | null;
    city?: string | null;
    postal_code?: string | null;
    contact_person?: string | null;
    contact_phone?: string | null;
    contact_email?: string | null;
    description?: string | null;
    is_primary?: boolean;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
  };
  Update: {
    id?: string;
    organization_id?: string;
    name?: string;
    address?: string | null;
    county?: string | null;
    city?: string | null;
    postal_code?: string | null;
    contact_person?: string | null;
    contact_phone?: string | null;
    contact_email?: string | null;
    description?: string | null;
    is_primary?: boolean;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// MEDICAL & TRAINING
// ──────────────────────────────────────────────────────────────────────────────

export interface MedicalExams {
  Row: {
    id: string;
    organization_id: string;
    employee_name: string;
    cnp_hash: string | null;
    job_title: string | null;
    examination_type: string | null;
    exam_type: ExamType | null;
    examination_date: string;
    expiry_date: string;
    result: ExamResult;
    restrictions: string | null;
    doctor_name: string | null;
    doctor_specialization: string | null;
    clinic_name: string | null;
    fitness_file_url: string | null;
    cost: number | null;
    next_exam_date: string | null;
    risk_level: RiskLevel | null;
    notes: string | null;
    content_version: number;
    legal_basis_version: string;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    organization_id: string;
    employee_name: string;
    cnp_hash?: string | null;
    job_title?: string | null;
    examination_type?: string | null;
    exam_type?: ExamType | null;
    examination_date: string;
    expiry_date: string;
    result: ExamResult;
    restrictions?: string | null;
    doctor_name?: string | null;
    doctor_specialization?: string | null;
    clinic_name?: string | null;
    fitness_file_url?: string | null;
    cost?: number | null;
    next_exam_date?: string | null;
    risk_level?: RiskLevel | null;
    notes?: string | null;
    content_version?: number;
    legal_basis_version: string;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    organization_id?: string;
    employee_name?: string;
    cnp_hash?: string | null;
    job_title?: string | null;
    examination_type?: string | null;
    exam_type?: ExamType | null;
    examination_date?: string;
    expiry_date?: string;
    result?: ExamResult;
    restrictions?: string | null;
    doctor_name?: string | null;
    doctor_specialization?: string | null;
    clinic_name?: string | null;
    fitness_file_url?: string | null;
    cost?: number | null;
    next_exam_date?: string | null;
    risk_level?: RiskLevel | null;
    notes?: string | null;
    content_version?: number;
    legal_basis_version?: string;
    created_at?: string;
    updated_at?: string;
  };
}

export interface Trainings {
  Row: {
    id: string;
    organization_id: string;
    employee_id: string | null;
    training_type: string;
    training_date: string;
    trainer_name: string | null;
    duration_hours: number | null;
    certificate_url: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    organization_id: string;
    employee_id?: string | null;
    training_type: string;
    training_date: string;
    trainer_name?: string | null;
    duration_hours?: number | null;
    certificate_url?: string | null;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    organization_id?: string;
    employee_id?: string | null;
    training_type?: string;
    training_date?: string;
    trainer_name?: string | null;
    duration_hours?: number | null;
    certificate_url?: string | null;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// EQUIPMENT
// ──────────────────────────────────────────────────────────────────────────────

export interface SafetyEquipment {
  Row: {
    id: string;
    organization_id: string;
    equipment_type: EquipmentType;
    description: string | null;
    location: string | null;
    serial_number: string | null;
    last_inspection_date: string | null;
    next_inspection_date: string | null;
    expiry_date: string;
    inspector_name: string | null;
    is_compliant: boolean;
    notes: string | null;
    content_version: number;
    legal_basis_version: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  Insert: {
    id?: string;
    organization_id: string;
    equipment_type: EquipmentType;
    description?: string | null;
    location?: string | null;
    serial_number?: string | null;
    last_inspection_date?: string | null;
    next_inspection_date?: string | null;
    expiry_date: string;
    inspector_name?: string | null;
    is_compliant?: boolean;
    notes?: string | null;
    content_version?: number;
    legal_basis_version: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
  };
  Update: {
    id?: string;
    organization_id?: string;
    equipment_type?: EquipmentType;
    description?: string | null;
    location?: string | null;
    serial_number?: string | null;
    last_inspection_date?: string | null;
    next_inspection_date?: string | null;
    expiry_date?: string;
    inspector_name?: string | null;
    is_compliant?: boolean;
    notes?: string | null;
    content_version?: number;
    legal_basis_version?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
  };
}

export interface EmployeeEquipment {
  Row: {
    id: string;
    employee_id: string;
    equipment_type_id: string;
    quantity: number;
    assigned_date: string;
    return_date: string | null;
    condition_on_assign: EquipmentCondition;
    condition_on_return: EquipmentCondition | null;
    assigned_by: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    employee_id: string;
    equipment_type_id: string;
    quantity?: number;
    assigned_date?: string;
    return_date?: string | null;
    condition_on_assign?: EquipmentCondition;
    condition_on_return?: EquipmentCondition | null;
    assigned_by?: string | null;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    employee_id?: string;
    equipment_type_id?: string;
    quantity?: number;
    assigned_date?: string;
    return_date?: string | null;
    condition_on_assign?: EquipmentCondition;
    condition_on_return?: EquipmentCondition | null;
    assigned_by?: string | null;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
  };
}

export interface InspectionChecklists {
  Row: {
    id: string;
    equipment_type: EquipmentType;
    checklist_item: string;
    description: string | null;
    is_critical: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    equipment_type: EquipmentType;
    checklist_item: string;
    description?: string | null;
    is_critical?: boolean;
    display_order?: number;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    equipment_type?: EquipmentType;
    checklist_item?: string;
    description?: string | null;
    is_critical?: boolean;
    display_order?: number;
    created_at?: string;
    updated_at?: string;
  };
}

export interface EquipmentInspections {
  Row: {
    id: string;
    equipment_id: string;
    organization_id: string;
    inspection_date: string;
    inspector_name: string;
    inspector_role: string;
    overall_status: InspectionStatus;
    checklist_results: Record<string, unknown>;
    observations: string | null;
    photo_urls: string[] | null;
    next_inspection_date: string | null;
    created_at: string;
    updated_at: string;
    created_by: string | null;
  };
  Insert: {
    id?: string;
    equipment_id: string;
    organization_id: string;
    inspection_date?: string;
    inspector_name: string;
    inspector_role: string;
    overall_status: InspectionStatus;
    checklist_results: Record<string, unknown>;
    observations?: string | null;
    photo_urls?: string[] | null;
    next_inspection_date?: string | null;
    created_at?: string;
    updated_at?: string;
    created_by?: string | null;
  };
  Update: {
    id?: string;
    equipment_id?: string;
    organization_id?: string;
    inspection_date?: string;
    inspector_name?: string;
    inspector_role?: string;
    overall_status?: InspectionStatus;
    checklist_results?: Record<string, unknown>;
    observations?: string | null;
    photo_urls?: string[] | null;
    next_inspection_date?: string | null;
    created_at?: string;
    updated_at?: string;
    created_by?: string | null;
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// INCIDENTS
// ──────────────────────────────────────────────────────────────────────────────

export interface Incidents {
  Row: {
    id: string;
    organization_id: string;
    incident_type: IncidentType;
    incident_date: string;
    incident_time: string;
    location_id: string | null;
    location_description: string | null;
    affected_employee_id: string | null;
    affected_employee_name: string | null;
    description: string;
    immediate_cause: string | null;
    immediate_actions_taken: string | null;
    severity: IncidentSeverity;
    witness_employee_ids: string[] | null;
    witness_names: string[] | null;
    requires_itm_notification: boolean;
    itm_notified_at: string | null;
    itm_notification_method: string | null;
    photo_urls: string[] | null;
    status: IncidentStatus;
    reported_by: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  Insert: {
    id?: string;
    organization_id: string;
    incident_type: IncidentType;
    incident_date: string;
    incident_time: string;
    location_id?: string | null;
    location_description?: string | null;
    affected_employee_id?: string | null;
    affected_employee_name?: string | null;
    description: string;
    immediate_cause?: string | null;
    immediate_actions_taken?: string | null;
    severity: IncidentSeverity;
    witness_employee_ids?: string[] | null;
    witness_names?: string[] | null;
    requires_itm_notification?: boolean;
    itm_notified_at?: string | null;
    itm_notification_method?: string | null;
    photo_urls?: string[] | null;
    status?: IncidentStatus;
    reported_by?: string | null;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
  };
  Update: {
    id?: string;
    organization_id?: string;
    incident_type?: IncidentType;
    incident_date?: string;
    incident_time?: string;
    location_id?: string | null;
    location_description?: string | null;
    affected_employee_id?: string | null;
    affected_employee_name?: string | null;
    description?: string;
    immediate_cause?: string | null;
    immediate_actions_taken?: string | null;
    severity?: IncidentSeverity;
    witness_employee_ids?: string[] | null;
    witness_names?: string[] | null;
    requires_itm_notification?: boolean;
    itm_notified_at?: string | null;
    itm_notification_method?: string | null;
    photo_urls?: string[] | null;
    status?: IncidentStatus;
    reported_by?: string | null;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
  };
}

export interface InvestigationSteps {
  Row: {
    id: string;
    incident_id: string;
    step_order: number;
    step_name: string;
    step_description: string | null;
    is_completed: boolean;
    completed_at: string | null;
    completed_by: string | null;
    responsible_user_id: string | null;
    document_url: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    incident_id: string;
    step_order: number;
    step_name: string;
    step_description?: string | null;
    is_completed?: boolean;
    completed_at?: string | null;
    completed_by?: string | null;
    responsible_user_id?: string | null;
    document_url?: string | null;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    incident_id?: string;
    step_order?: number;
    step_name?: string;
    step_description?: string | null;
    is_completed?: boolean;
    completed_at?: string | null;
    completed_by?: string | null;
    responsible_user_id?: string | null;
    document_url?: string | null;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
  };
}

export interface RootCauseAnalysis {
  Row: {
    id: string;
    incident_id: string;
    why_level_1: string;
    why_level_2: string | null;
    why_level_3: string | null;
    why_level_4: string | null;
    why_level_5: string | null;
    root_cause_conclusion: string | null;
    contributing_factors: string[] | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    incident_id: string;
    why_level_1: string;
    why_level_2?: string | null;
    why_level_3?: string | null;
    why_level_4?: string | null;
    why_level_5?: string | null;
    root_cause_conclusion?: string | null;
    contributing_factors?: string[] | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    incident_id?: string;
    why_level_1?: string;
    why_level_2?: string | null;
    why_level_3?: string | null;
    why_level_4?: string | null;
    why_level_5?: string | null;
    root_cause_conclusion?: string | null;
    contributing_factors?: string[] | null;
    created_at?: string;
    updated_at?: string;
  };
}

export interface CorrectiveActions {
  Row: {
    id: string;
    incident_id: string;
    action_description: string;
    action_type: ActionType;
    responsible_user_id: string | null;
    responsible_name: string | null;
    deadline: string | null;
    status: ActionStatus;
    completed_at: string | null;
    verification_notes: string | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    incident_id: string;
    action_description: string;
    action_type: ActionType;
    responsible_user_id?: string | null;
    responsible_name?: string | null;
    deadline?: string | null;
    status?: ActionStatus;
    completed_at?: string | null;
    verification_notes?: string | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    incident_id?: string;
    action_description?: string;
    action_type?: ActionType;
    responsible_user_id?: string | null;
    responsible_name?: string | null;
    deadline?: string | null;
    status?: ActionStatus;
    completed_at?: string | null;
    verification_notes?: string | null;
    created_at?: string;
    updated_at?: string;
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// AUDITS & COMPLIANCE
// ──────────────────────────────────────────────────────────────────────────────

export interface AuditQuestions {
  Row: {
    id: string;
    audit_type: AuditType;
    category: string;
    question_text: string;
    legal_reference: string | null;
    weight: number;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    audit_type: AuditType;
    category: string;
    question_text: string;
    legal_reference?: string | null;
    weight?: number;
    display_order?: number;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    audit_type?: AuditType;
    category?: string;
    question_text?: string;
    legal_reference?: string | null;
    weight?: number;
    display_order?: number;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
  };
}

export interface Audits {
  Row: {
    id: string;
    organization_id: string;
    audit_type: AuditType;
    audit_date: string;
    auditor_name: string;
    auditor_id: string | null;
    status: AuditStatus;
    progress_percentage: number;
    total_questions: number;
    answered_questions: number;
    compliant_answers: number;
    partial_answers: number;
    non_compliant_answers: number;
    na_answers: number;
    compliance_score: number;
    weighted_score: number;
    findings: string[] | null;
    non_conformities: string[] | null;
    corrective_actions: string[] | null;
    recommendations: string[] | null;
    report_generated_at: string | null;
    report_url: string | null;
    notes: string | null;
    started_at: string;
    completed_at: string | null;
    created_by: string | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    organization_id: string;
    audit_type: AuditType;
    audit_date?: string;
    auditor_name: string;
    auditor_id?: string | null;
    status?: AuditStatus;
    progress_percentage?: number;
    total_questions?: number;
    answered_questions?: number;
    compliant_answers?: number;
    partial_answers?: number;
    non_compliant_answers?: number;
    na_answers?: number;
    compliance_score?: number;
    weighted_score?: number;
    findings?: string[] | null;
    non_conformities?: string[] | null;
    corrective_actions?: string[] | null;
    recommendations?: string[] | null;
    report_generated_at?: string | null;
    report_url?: string | null;
    notes?: string | null;
    started_at?: string;
    completed_at?: string | null;
    created_by?: string | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    organization_id?: string;
    audit_type?: AuditType;
    audit_date?: string;
    auditor_name?: string;
    auditor_id?: string | null;
    status?: AuditStatus;
    progress_percentage?: number;
    total_questions?: number;
    answered_questions?: number;
    compliant_answers?: number;
    partial_answers?: number;
    non_compliant_answers?: number;
    na_answers?: number;
    compliance_score?: number;
    weighted_score?: number;
    findings?: string[] | null;
    non_conformities?: string[] | null;
    corrective_actions?: string[] | null;
    recommendations?: string[] | null;
    report_generated_at?: string | null;
    report_url?: string | null;
    notes?: string | null;
    started_at?: string;
    completed_at?: string | null;
    created_by?: string | null;
    created_at?: string;
    updated_at?: string;
  };
}

export interface AuditResponses {
  Row: {
    id: string;
    audit_id: string;
    question_id: string;
    answer: AuditAnswer;
    comment: string | null;
    evidence_files: string[] | null;
    evidence_description: string | null;
    requires_action: boolean;
    action_description: string | null;
    action_deadline: string | null;
    action_assigned_to: string | null;
    action_status: ActionStatus | null;
    answered_by: string | null;
    answered_at: string;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    audit_id: string;
    question_id: string;
    answer: AuditAnswer;
    comment?: string | null;
    evidence_files?: string[] | null;
    evidence_description?: string | null;
    requires_action?: boolean;
    action_description?: string | null;
    action_deadline?: string | null;
    action_assigned_to?: string | null;
    action_status?: ActionStatus | null;
    answered_by?: string | null;
    answered_at?: string;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    audit_id?: string;
    question_id?: string;
    answer?: AuditAnswer;
    comment?: string | null;
    evidence_files?: string[] | null;
    evidence_description?: string | null;
    requires_action?: boolean;
    action_description?: string | null;
    action_deadline?: string | null;
    action_assigned_to?: string | null;
    action_status?: ActionStatus | null;
    answered_by?: string | null;
    answered_at?: string;
    created_at?: string;
    updated_at?: string;
  };
}

export interface RiskAssessments {
  Row: {
    id: string;
    organization_id: string;
    assessment_date: string;
    location: string | null;
    assessed_by: string | null;
    status: string;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    organization_id: string;
    assessment_date: string;
    location?: string | null;
    assessed_by?: string | null;
    status: string;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    organization_id?: string;
    assessment_date?: string;
    location?: string | null;
    assessed_by?: string | null;
    status?: string;
    created_at?: string;
    updated_at?: string;
  };
}

export interface PreventionPlans {
  Row: {
    id: string;
    organization_id: string;
    risk_assessment_id: string | null;
    plan_name: string;
    plan_date: string;
    valid_from: string;
    valid_until: string | null;
    approved_by_name: string | null;
    approved_by_title: string | null;
    approval_date: string | null;
    status: PreventionPlanStatus;
    notes: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  Insert: {
    id?: string;
    organization_id: string;
    risk_assessment_id?: string | null;
    plan_name: string;
    plan_date?: string;
    valid_from?: string;
    valid_until?: string | null;
    approved_by_name?: string | null;
    approved_by_title?: string | null;
    approval_date?: string | null;
    status?: PreventionPlanStatus;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
  };
  Update: {
    id?: string;
    organization_id?: string;
    risk_assessment_id?: string | null;
    plan_name?: string;
    plan_date?: string;
    valid_from?: string;
    valid_until?: string | null;
    approved_by_name?: string | null;
    approved_by_title?: string | null;
    approval_date?: string | null;
    status?: PreventionPlanStatus;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
  };
}

export interface PreventionMeasures {
  Row: {
    id: string;
    prevention_plan_id: string;
    risk_assessment_hazard_id: string | null;
    risk_name: string;
    risk_level: number | null;
    risk_level_label: string | null;
    technical_measure: string | null;
    organizational_measure: string | null;
    hygiene_measure: string | null;
    responsible_person: string | null;
    responsible_title: string | null;
    deadline: string | null;
    priority: PreventionPriority | null;
    resources_needed: string | null;
    estimated_cost: number | null;
    implementation_status: ImplementationStatus;
    completion_date: string | null;
    completion_notes: string | null;
    display_order: number;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    prevention_plan_id: string;
    risk_assessment_hazard_id?: string | null;
    risk_name: string;
    risk_level?: number | null;
    risk_level_label?: string | null;
    technical_measure?: string | null;
    organizational_measure?: string | null;
    hygiene_measure?: string | null;
    responsible_person?: string | null;
    responsible_title?: string | null;
    deadline?: string | null;
    priority?: PreventionPriority | null;
    resources_needed?: string | null;
    estimated_cost?: number | null;
    implementation_status?: ImplementationStatus;
    completion_date?: string | null;
    completion_notes?: string | null;
    display_order?: number;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    prevention_plan_id?: string;
    risk_assessment_hazard_id?: string | null;
    risk_name?: string;
    risk_level?: number | null;
    risk_level_label?: string | null;
    technical_measure?: string | null;
    organizational_measure?: string | null;
    hygiene_measure?: string | null;
    responsible_person?: string | null;
    responsible_title?: string | null;
    deadline?: string | null;
    priority?: PreventionPriority | null;
    resources_needed?: string | null;
    estimated_cost?: number | null;
    implementation_status?: ImplementationStatus;
    completion_date?: string | null;
    completion_notes?: string | null;
    display_order?: number;
    created_at?: string;
    updated_at?: string;
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// DOCUMENTS
// ──────────────────────────────────────────────────────────────────────────────

export interface Documents {
  Row: {
    id: string;
    organization_id: string;
    title: string;
    description: string | null;
    category: DocumentCategory;
    status: DocumentStatus;
    file_url: string;
    file_name: string;
    file_size_bytes: number | null;
    mime_type: string | null;
    storage_path: string;
    tags: string[] | null;
    uploaded_by: string | null;
    is_locked: boolean;
    version: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  Insert: {
    id?: string;
    organization_id: string;
    title: string;
    description?: string | null;
    category: DocumentCategory;
    status?: DocumentStatus;
    file_url: string;
    file_name: string;
    file_size_bytes?: number | null;
    mime_type?: string | null;
    storage_path: string;
    tags?: string[] | null;
    uploaded_by?: string | null;
    is_locked?: boolean;
    version?: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
  };
  Update: {
    id?: string;
    organization_id?: string;
    title?: string;
    description?: string | null;
    category?: DocumentCategory;
    status?: DocumentStatus;
    file_url?: string;
    file_name?: string;
    file_size_bytes?: number | null;
    mime_type?: string | null;
    storage_path?: string;
    tags?: string[] | null;
    uploaded_by?: string | null;
    is_locked?: boolean;
    version?: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// ALERTS & ACTIVITY
// ──────────────────────────────────────────────────────────────────────────────

export interface ManualAlerts {
  Row: {
    id: string;
    organization_id: string;
    severity: AlertSeverity;
    category: string;
    title: string;
    description: string | null;
    expiry_date: string | null;
    status: AlertStatus;
    acknowledged_at: string | null;
    acknowledged_by: string | null;
    resolved_at: string | null;
    resolved_by: string | null;
    dismissed_at: string | null;
    dismissed_by: string | null;
    metadata: Record<string, unknown>;
    created_by: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  Insert: {
    id?: string;
    organization_id: string;
    severity: AlertSeverity;
    category: string;
    title: string;
    description?: string | null;
    expiry_date?: string | null;
    status?: AlertStatus;
    acknowledged_at?: string | null;
    acknowledged_by?: string | null;
    resolved_at?: string | null;
    resolved_by?: string | null;
    dismissed_at?: string | null;
    dismissed_by?: string | null;
    metadata?: Record<string, unknown>;
    created_by?: string | null;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
  };
  Update: {
    id?: string;
    organization_id?: string;
    severity?: AlertSeverity;
    category?: string;
    title?: string;
    description?: string | null;
    expiry_date?: string | null;
    status?: AlertStatus;
    acknowledged_at?: string | null;
    acknowledged_by?: string | null;
    resolved_at?: string | null;
    resolved_by?: string | null;
    dismissed_at?: string | null;
    dismissed_by?: string | null;
    metadata?: Record<string, unknown>;
    created_by?: string | null;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
  };
}

export interface ActivityFeed {
  Row: {
    id: string;
    organization_id: string;
    activity_type: ActivityType;
    title: string;
    description: string | null;
    actor_id: string | null;
    actor_name: string | null;
    subject_type: string | null;
    subject_id: string | null;
    subject_name: string | null;
    metadata: Record<string, unknown>;
    severity: ActivitySeverity;
    icon: string | null;
    created_at: string;
    deleted_at: string | null;
  };
  Insert: {
    id?: string;
    organization_id: string;
    activity_type: ActivityType;
    title: string;
    description?: string | null;
    actor_id?: string | null;
    actor_name?: string | null;
    subject_type?: string | null;
    subject_id?: string | null;
    subject_name?: string | null;
    metadata?: Record<string, unknown>;
    severity?: ActivitySeverity;
    icon?: string | null;
    created_at?: string;
    deleted_at?: string | null;
  };
  Update: {
    id?: string;
    organization_id?: string;
    activity_type?: ActivityType;
    title?: string;
    description?: string | null;
    actor_id?: string | null;
    actor_name?: string | null;
    subject_type?: string | null;
    subject_id?: string | null;
    subject_name?: string | null;
    metadata?: Record<string, unknown>;
    severity?: ActivitySeverity;
    icon?: string | null;
    created_at?: string;
    deleted_at?: string | null;
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// USER & AUTH
// ──────────────────────────────────────────────────────────────────────────────

export interface Memberships {
  Row: {
    id: string;
    user_id: string;
    organization_id: string;
    role: MembershipRole;
    is_active: boolean;
    joined_at: string;
    deleted_at: string | null;
  };
  Insert: {
    id?: string;
    user_id: string;
    organization_id: string;
    role: MembershipRole;
    is_active?: boolean;
    joined_at?: string;
    deleted_at?: string | null;
  };
  Update: {
    id?: string;
    user_id?: string;
    organization_id?: string;
    role?: MembershipRole;
    is_active?: boolean;
    joined_at?: string;
    deleted_at?: string | null;
  };
}

export interface Profiles {
  Row: {
    id: string;
    full_name: string;
    phone: string | null;
    avatar_url: string | null;
    role: string | null;
    created_at: string;
  };
  Insert: {
    id: string;
    full_name: string;
    phone?: string | null;
    avatar_url?: string | null;
    role?: string | null;
    created_at?: string;
  };
  Update: {
    id?: string;
    full_name?: string;
    phone?: string | null;
    avatar_url?: string | null;
    role?: string | null;
    created_at?: string;
  };
}

export interface UserPreferences {
  Row: {
    id: string;
    user_id: string;
    key: string;
    value: string;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    key: string;
    value: string;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    key?: string;
    value?: string;
    created_at?: string;
    updated_at?: string;
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// CALENDAR
// ──────────────────────────────────────────────────────────────────────────────

export interface CalendarEvents {
  Row: {
    id: string;
    organization_id: string;
    title: string;
    description: string | null;
    event_type: CalendarEventType;
    start_date: string;
    end_date: string | null;
    all_day: boolean;
    related_employee_id: string | null;
    related_training_id: string | null;
    related_equipment_id: string | null;
    related_medical_id: string | null;
    color: string;
    location: string | null;
    reminder_minutes: number[] | null;
    created_by: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  Insert: {
    id?: string;
    organization_id: string;
    title: string;
    description?: string | null;
    event_type: CalendarEventType;
    start_date: string;
    end_date?: string | null;
    all_day?: boolean;
    related_employee_id?: string | null;
    related_training_id?: string | null;
    related_equipment_id?: string | null;
    related_medical_id?: string | null;
    color?: string;
    location?: string | null;
    reminder_minutes?: number[] | null;
    created_by?: string | null;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
  };
  Update: {
    id?: string;
    organization_id?: string;
    title?: string;
    description?: string | null;
    event_type?: CalendarEventType;
    start_date?: string;
    end_date?: string | null;
    all_day?: boolean;
    related_employee_id?: string | null;
    related_training_id?: string | null;
    related_equipment_id?: string | null;
    related_medical_id?: string | null;
    color?: string;
    location?: string | null;
    reminder_minutes?: number[] | null;
    created_by?: string | null;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// COMMUNICATIONS
// ──────────────────────────────────────────────────────────────────────────────

export interface ContactMessages {
  Row: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    request_type: ContactRequestType;
    message: string;
    status: ContactStatus;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    name: string;
    email: string;
    phone?: string | null;
    company?: string | null;
    request_type: ContactRequestType;
    message: string;
    status?: ContactStatus;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string | null;
    company?: string | null;
    request_type?: ContactRequestType;
    message?: string;
    status?: ContactStatus;
    created_at?: string;
    updated_at?: string;
  };
}

export interface NewsletterSubscribers {
  Row: {
    id: string;
    email: string;
    source: NewsletterSource;
    status: SubscriptionStatus;
    unsubscribe_token: string;
    subscribed_at: string;
    unsubscribed_at: string | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    email: string;
    source: NewsletterSource;
    status?: SubscriptionStatus;
    unsubscribe_token: string;
    subscribed_at?: string;
    unsubscribed_at?: string | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    email?: string;
    source?: NewsletterSource;
    status?: SubscriptionStatus;
    unsubscribe_token?: string;
    subscribed_at?: string;
    unsubscribed_at?: string | null;
    created_at?: string;
    updated_at?: string;
  };
}

export interface EmailDeliveryLog {
  Row: {
    id: string;
    email: string;
    template_name: string;
    message_id: string;
    batch_id: string;
    status: string;
    error_message: string | null;
    sent_at: string;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    email: string;
    template_name: string;
    message_id: string;
    batch_id: string;
    status: string;
    error_message?: string | null;
    sent_at?: string;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    email?: string;
    template_name?: string;
    message_id?: string;
    batch_id?: string;
    status?: string;
    error_message?: string | null;
    sent_at?: string;
    created_at?: string;
    updated_at?: string;
  };
}

export interface WhatsappDeliveryLog {
  Row: {
    id: string;
    phone: string;
    template_name: string;
    message_id: string;
    status: string;
    error_message: string | null;
    sent_at: string;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    phone: string;
    template_name: string;
    message_id: string;
    status: string;
    error_message?: string | null;
    sent_at?: string;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    phone?: string;
    template_name?: string;
    message_id?: string;
    status?: string;
    error_message?: string | null;
    sent_at?: string;
    created_at?: string;
    updated_at?: string;
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// API & WEBHOOKS
// ──────────────────────────────────────────────────────────────────────────────

export interface ApiKeys {
  Row: {
    id: string;
    organization_id: string;
    name: string;
    description: string | null;
    key_hash: string;
    key_prefix: string;
    permissions: string[];
    rate_limit_per_minute: number;
    last_used_at: string | null;
    total_requests: number;
    is_active: boolean;
    expires_at: string | null;
    created_by: string | null;
    created_at: string;
    updated_at: string;
    revoked_at: string | null;
    revoked_by: string | null;
  };
  Insert: {
    id?: string;
    organization_id: string;
    name: string;
    description?: string | null;
    key_hash: string;
    key_prefix: string;
    permissions: string[];
    rate_limit_per_minute?: number;
    last_used_at?: string | null;
    total_requests?: number;
    is_active?: boolean;
    expires_at?: string | null;
    created_by?: string | null;
    created_at?: string;
    updated_at?: string;
    revoked_at?: string | null;
    revoked_by?: string | null;
  };
  Update: {
    id?: string;
    organization_id?: string;
    name?: string;
    description?: string | null;
    key_hash?: string;
    key_prefix?: string;
    permissions?: string[];
    rate_limit_per_minute?: number;
    last_used_at?: string | null;
    total_requests?: number;
    is_active?: boolean;
    expires_at?: string | null;
    created_by?: string | null;
    created_at?: string;
    updated_at?: string;
    revoked_at?: string | null;
    revoked_by?: string | null;
  };
}

export interface ApiKeyUsageLog {
  Row: {
    id: string;
    api_key_id: string;
    endpoint: string;
    method: string;
    status_code: number | null;
    ip_address: string | null;
    user_agent: string | null;
    request_size_bytes: number | null;
    response_size_bytes: number | null;
    duration_ms: number | null;
    error_message: string | null;
    created_at: string;
  };
  Insert: {
    id?: string;
    api_key_id: string;
    endpoint: string;
    method: string;
    status_code?: number | null;
    ip_address?: string | null;
    user_agent?: string | null;
    request_size_bytes?: number | null;
    response_size_bytes?: number | null;
    duration_ms?: number | null;
    error_message?: string | null;
    created_at?: string;
  };
  Update: {
    id?: string;
    api_key_id?: string;
    endpoint?: string;
    method?: string;
    status_code?: number | null;
    ip_address?: string | null;
    user_agent?: string | null;
    request_size_bytes?: number | null;
    response_size_bytes?: number | null;
    duration_ms?: number | null;
    error_message?: string | null;
    created_at?: string;
  };
}

export interface Webhooks {
  Row: {
    id: string;
    organization_id: string;
    url: string;
    events: string[];
    secret: string;
    is_active: boolean;
    created_by: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  Insert: {
    id?: string;
    organization_id: string;
    url: string;
    events: string[];
    secret: string;
    is_active?: boolean;
    created_by: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
  };
  Update: {
    id?: string;
    organization_id?: string;
    url?: string;
    events?: string[];
    secret?: string;
    is_active?: boolean;
    created_by?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
  };
}

export interface WebhookDeliveryLog {
  Row: {
    id: string;
    webhook_id: string;
    event_type: string;
    payload: Record<string, unknown>;
    status: WebhookStatus;
    http_status_code: number | null;
    response_body: string | null;
    error_message: string | null;
    attempts: number;
    created_at: string;
    delivered_at: string | null;
  };
  Insert: {
    id?: string;
    webhook_id: string;
    event_type: string;
    payload: Record<string, unknown>;
    status?: WebhookStatus;
    http_status_code?: number | null;
    response_body?: string | null;
    error_message?: string | null;
    attempts?: number;
    created_at?: string;
    delivered_at?: string | null;
  };
  Update: {
    id?: string;
    webhook_id?: string;
    event_type?: string;
    payload?: Record<string, unknown>;
    status?: WebhookStatus;
    http_status_code?: number | null;
    response_body?: string | null;
    error_message?: string | null;
    attempts?: number;
    created_at?: string;
    delivered_at?: string | null;
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// BILLING
// ──────────────────────────────────────────────────────────────────────────────

export interface Invoices {
  Row: {
    id: string;
    invoice_number: string;
    organization_id: string;
    period: string;
    subtotal: number;
    vat_amount: number;
    total: number;
    currency: Currency;
    status: InvoiceStatus;
    file_url: string | null;
    items: Record<string, unknown>;
    due_date: string | null;
    paid_at: string | null;
    created_by: string | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    invoice_number: string;
    organization_id: string;
    period: string;
    subtotal: number;
    vat_amount: number;
    total: number;
    currency: Currency;
    status?: InvoiceStatus;
    file_url?: string | null;
    items: Record<string, unknown>;
    due_date?: string | null;
    paid_at?: string | null;
    created_by?: string | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    invoice_number?: string;
    organization_id?: string;
    period?: string;
    subtotal?: number;
    vat_amount?: number;
    total?: number;
    currency?: Currency;
    status?: InvoiceStatus;
    file_url?: string | null;
    items?: Record<string, unknown>;
    due_date?: string | null;
    paid_at?: string | null;
    created_by?: string | null;
    created_at?: string;
    updated_at?: string;
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// OBLIGATIONS
// ──────────────────────────────────────────────────────────────────────────────

export interface Obligations {
  Row: {
    id: string;
    source_legal_act: string;
    source_article_id: string | null;
    source_article_number: string | null;
    country_code: CountryCode;
    obligation_text: string;
    who: string[];
    deadline: string | null;
    frequency: ObligationFrequency | null;
    penalty: string | null;
    penalty_min: number | null;
    penalty_max: number | null;
    penalty_currency: string | null;
    evidence_required: string[];
    confidence: number;
    validation_score: number;
    status: ObligationStatus;
    published: boolean;
    published_at: string | null;
    caen_codes: string[];
    industry_tags: string[];
    extracted_at: string;
    validated_at: string | null;
    approved_at: string | null;
    approved_by: string | null;
    created_at: string;
    updated_at: string;
    language: string;
    deduplication_hash: string | null;
    metadata: Record<string, unknown>;
  };
  Insert: {
    id?: string;
    source_legal_act: string;
    source_article_id?: string | null;
    source_article_number?: string | null;
    country_code: CountryCode;
    obligation_text: string;
    who: string[];
    deadline?: string | null;
    frequency?: ObligationFrequency | null;
    penalty?: string | null;
    penalty_min?: number | null;
    penalty_max?: number | null;
    penalty_currency?: string | null;
    evidence_required: string[];
    confidence: number;
    validation_score: number;
    status?: ObligationStatus;
    published?: boolean;
    published_at?: string | null;
    caen_codes: string[];
    industry_tags: string[];
    extracted_at?: string;
    validated_at?: string | null;
    approved_at?: string | null;
    approved_by?: string | null;
    created_at?: string;
    updated_at?: string;
    language?: string;
    deduplication_hash?: string | null;
    metadata?: Record<string, unknown>;
  };
  Update: {
    id?: string;
    source_legal_act?: string;
    source_article_id?: string | null;
    source_article_number?: string | null;
    country_code?: CountryCode;
    obligation_text?: string;
    who?: string[];
    deadline?: string | null;
    frequency?: ObligationFrequency | null;
    penalty?: string | null;
    penalty_min?: number | null;
    penalty_max?: number | null;
    penalty_currency?: string | null;
    evidence_required?: string[];
    confidence?: number;
    validation_score?: number;
    status?: ObligationStatus;
    published?: boolean;
    published_at?: string | null;
    caen_codes?: string[];
    industry_tags?: string[];
    extracted_at?: string;
    validated_at?: string | null;
    approved_at?: string | null;
    approved_by?: string | null;
    created_at?: string;
    updated_at?: string;
    language?: string;
    deduplication_hash?: string | null;
    metadata?: Record<string, unknown>;
  };
}

export interface OrganizationObligations {
  Row: {
    id: string;
    organization_id: string;
    obligation_id: string;
    status: OrgObligationStatus;
    assigned_at: string;
    acknowledged_at: string | null;
    acknowledged_by: string | null;
    compliant_at: string | null;
    compliant_by: string | null;
    notes: string | null;
    evidence_urls: string[];
    assigned_by: string | null;
    match_score: number;
    match_reason: string | null;
  };
  Insert: {
    id?: string;
    organization_id: string;
    obligation_id: string;
    status?: OrgObligationStatus;
    assigned_at?: string;
    acknowledged_at?: string | null;
    acknowledged_by?: string | null;
    compliant_at?: string | null;
    compliant_by?: string | null;
    notes?: string | null;
    evidence_urls?: string[];
    assigned_by?: string | null;
    match_score?: number;
    match_reason?: string | null;
  };
  Update: {
    id?: string;
    organization_id?: string;
    obligation_id?: string;
    status?: OrgObligationStatus;
    assigned_at?: string;
    acknowledged_at?: string | null;
    acknowledged_by?: string | null;
    compliant_at?: string | null;
    compliant_by?: string | null;
    notes?: string | null;
    evidence_urls?: string[];
    assigned_by?: string | null;
    match_score?: number;
    match_reason?: string | null;
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// FEATURE FLAGS
// ──────────────────────────────────────────────────────────────────────────────

export interface FeatureFlags {
  Row: {
    id: string;
    flag_key: string;
    flag_name: string;
    description: string | null;
    is_enabled: boolean;
    category: string | null;
    last_changed_at: string;
    last_changed_by: string | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    flag_key: string;
    flag_name: string;
    description?: string | null;
    is_enabled?: boolean;
    category?: string | null;
    last_changed_at?: string;
    last_changed_by?: string | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    flag_key?: string;
    flag_name?: string;
    description?: string | null;
    is_enabled?: boolean;
    category?: string | null;
    last_changed_at?: string;
    last_changed_by?: string | null;
    created_at?: string;
    updated_at?: string;
  };
}

export interface FeatureFlagOverrides {
  Row: {
    id: string;
    flag_id: string;
    organization_id: string;
    is_enabled: boolean;
    reason: string | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    flag_id: string;
    organization_id: string;
    is_enabled: boolean;
    reason?: string | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    flag_id?: string;
    organization_id?: string;
    is_enabled?: boolean;
    reason?: string | null;
    created_at?: string;
    updated_at?: string;
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// REGES INTEGRATION
// ──────────────────────────────────────────────────────────────────────────────

export interface RegesConnections {
  Row: {
    id: string;
    organization_id: string;
    cui: string;
    reges_user_id: string;
    reges_employer_id: string;
    status: RegesStatus;
    last_sync_at: string | null;
    error_message: string | null;
    encrypted_credentials: string;
    encryption_key_version: string;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    organization_id: string;
    cui: string;
    reges_user_id: string;
    reges_employer_id: string;
    status: RegesStatus;
    last_sync_at?: string | null;
    error_message?: string | null;
    encrypted_credentials: string;
    encryption_key_version?: string;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    organization_id?: string;
    cui?: string;
    reges_user_id?: string;
    reges_employer_id?: string;
    status?: RegesStatus;
    last_sync_at?: string | null;
    error_message?: string | null;
    encrypted_credentials?: string;
    encryption_key_version?: string;
    created_at?: string;
    updated_at?: string;
  };
}

export interface RegesOutbox {
  Row: {
    id: string;
    organization_id: string;
    connection_id: string;
    message_type: RegesMessageType;
    payload: Record<string, unknown>;
    status: RegesMessageStatus;
    priority: number;
    attempts: number;
    max_attempts: number;
    scheduled_at: string;
    sent_at: string | null;
    completed_at: string | null;
    error_message: string | null;
    receipt_id: string | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    organization_id: string;
    connection_id: string;
    message_type: RegesMessageType;
    payload: Record<string, unknown>;
    status?: RegesMessageStatus;
    priority?: number;
    attempts?: number;
    max_attempts?: number;
    scheduled_at?: string;
    sent_at?: string | null;
    completed_at?: string | null;
    error_message?: string | null;
    receipt_id?: string | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    organization_id?: string;
    connection_id?: string;
    message_type?: RegesMessageType;
    payload?: Record<string, unknown>;
    status?: RegesMessageStatus;
    priority?: number;
    attempts?: number;
    max_attempts?: number;
    scheduled_at?: string;
    sent_at?: string | null;
    completed_at?: string | null;
    error_message?: string | null;
    receipt_id?: string | null;
    created_at?: string;
    updated_at?: string;
  };
}

export interface RegesReceipts {
  Row: {
    id: string;
    outbox_id: string;
    receipt_number: string | null;
    receipt_date: string;
    status: RegesReceiptStatus;
    validation_errors: Record<string, unknown> | null;
    raw_response: Record<string, unknown>;
    created_at: string;
  };
  Insert: {
    id?: string;
    outbox_id: string;
    receipt_number?: string | null;
    receipt_date: string;
    status: RegesReceiptStatus;
    validation_errors?: Record<string, unknown> | null;
    raw_response: Record<string, unknown>;
    created_at?: string;
  };
  Update: {
    id?: string;
    outbox_id?: string;
    receipt_number?: string | null;
    receipt_date?: string;
    status?: RegesReceiptStatus;
    validation_errors?: Record<string, unknown> | null;
    raw_response?: Record<string, unknown>;
    created_at?: string;
  };
}

export interface RegesResults {
  Row: {
    id: string;
    receipt_id: string;
    result_type: RegesResultType;
    employee_external_id: string | null;
    contract_external_id: string | null;
    reges_employee_id: string | null;
    reges_contract_id: string | null;
    details: Record<string, unknown> | null;
    created_at: string;
  };
  Insert: {
    id?: string;
    receipt_id: string;
    result_type: RegesResultType;
    employee_external_id?: string | null;
    contract_external_id?: string | null;
    reges_employee_id?: string | null;
    reges_contract_id?: string | null;
    details?: Record<string, unknown> | null;
    created_at?: string;
  };
  Update: {
    id?: string;
    receipt_id?: string;
    result_type?: RegesResultType;
    employee_external_id?: string | null;
    contract_external_id?: string | null;
    reges_employee_id?: string | null;
    reges_contract_id?: string | null;
    details?: Record<string, unknown> | null;
    created_at?: string;
  };
}

export interface RegesEmployeeSnapshots {
  Row: {
    id: string;
    connection_id: string;
    organization_id: string;
    cnp: string;
    full_name: string;
    reges_employee_id: string | null;
    position: string | null;
    contract_type: string | null;
    employment_status: RegesEmploymentStatus;
    start_date: string | null;
    end_date: string | null;
    snapshot_date: string;
    raw_data: Record<string, unknown>;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    connection_id: string;
    organization_id: string;
    cnp: string;
    full_name: string;
    reges_employee_id?: string | null;
    position?: string | null;
    contract_type?: string | null;
    employment_status: RegesEmploymentStatus;
    start_date?: string | null;
    end_date?: string | null;
    snapshot_date?: string;
    raw_data: Record<string, unknown>;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    connection_id?: string;
    organization_id?: string;
    cnp?: string;
    full_name?: string;
    reges_employee_id?: string | null;
    position?: string | null;
    contract_type?: string | null;
    employment_status?: RegesEmploymentStatus;
    start_date?: string | null;
    end_date?: string | null;
    snapshot_date?: string;
    raw_data?: Record<string, unknown>;
    created_at?: string;
    updated_at?: string;
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// AUDIT LOG
// ──────────────────────────────────────────────────────────────────────────────

export interface AuditLog {
  Row: {
    id: string;
    organization_id: string | null;
    user_id: string | null;
    action: string;
    entity_type: AuditLogEntityType;
    entity_id: string | null;
    old_values: Record<string, unknown> | null;
    new_values: Record<string, unknown> | null;
    metadata: Record<string, unknown> | null;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
  };
  Insert: {
    id?: string;
    organization_id?: string | null;
    user_id?: string | null;
    action: string;
    entity_type: AuditLogEntityType;
    entity_id?: string | null;
    old_values?: Record<string, unknown> | null;
    new_values?: Record<string, unknown> | null;
    metadata?: Record<string, unknown> | null;
    ip_address?: string | null;
    user_agent?: string | null;
    created_at?: string;
  };
  Update: {
    id?: string;
    organization_id?: string | null;
    user_id?: string | null;
    action?: string;
    entity_type?: AuditLogEntityType;
    entity_id?: string | null;
    old_values?: Record<string, unknown> | null;
    new_values?: Record<string, unknown> | null;
    metadata?: Record<string, unknown> | null;
    ip_address?: string | null;
    user_agent?: string | null;
    created_at?: string;
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// DATABASE INTERFACE
// ══════════════════════════════════════════════════════════════════════════════

export interface Database {
  public: {
    Tables: {
      organizations: Organizations;
      employees: Employees;
      locations: Locations;
      medical_exams: MedicalExams;
      trainings: Trainings;
      safety_equipment: SafetyEquipment;
      employee_equipment: EmployeeEquipment;
      inspection_checklists: InspectionChecklists;
      equipment_inspections: EquipmentInspections;
      incidents: Incidents;
      investigation_steps: InvestigationSteps;
      root_cause_analysis: RootCauseAnalysis;
      corrective_actions: CorrectiveActions;
      audit_questions: AuditQuestions;
      audits: Audits;
      audit_responses: AuditResponses;
      risk_assessments: RiskAssessments;
      prevention_plans: PreventionPlans;
      prevention_measures: PreventionMeasures;
      documents: Documents;
      manual_alerts: ManualAlerts;
      activity_feed: ActivityFeed;
      memberships: Memberships;
      profiles: Profiles;
      user_preferences: UserPreferences;
      calendar_events: CalendarEvents;
      contact_messages: ContactMessages;
      newsletter_subscribers: NewsletterSubscribers;
      email_delivery_log: EmailDeliveryLog;
      whatsapp_delivery_log: WhatsappDeliveryLog;
      api_keys: ApiKeys;
      api_key_usage_log: ApiKeyUsageLog;
      webhooks: Webhooks;
      webhook_delivery_log: WebhookDeliveryLog;
      invoices: Invoices;
      obligations: Obligations;
      organization_obligations: OrganizationObligations;
      feature_flags: FeatureFlags;
      feature_flag_overrides: FeatureFlagOverrides;
      reges_connections: RegesConnections;
      reges_outbox: RegesOutbox;
      reges_receipts: RegesReceipts;
      reges_results: RegesResults;
      reges_employee_snapshots: RegesEmployeeSnapshots;
      audit_log: AuditLog;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      exposure_score: ExposureScore;
      cooperation_status: CooperationStatus;
      membership_role: MembershipRole;
      exam_type: ExamType;
      exam_result: ExamResult;
      risk_level: RiskLevel;
      equipment_type: EquipmentType;
      inspection_status: InspectionStatus;
      equipment_condition: EquipmentCondition;
      equipment_assignment_status: EquipmentAssignmentStatus;
      incident_type: IncidentType;
      incident_status: IncidentStatus;
      incident_severity: IncidentSeverity;
      action_type: ActionType;
      action_status: ActionStatus;
      audit_type: AuditType;
      audit_status: AuditStatus;
      audit_answer: AuditAnswer;
      prevention_plan_status: PreventionPlanStatus;
      prevention_priority: PreventionPriority;
      implementation_status: ImplementationStatus;
      document_category: DocumentCategory;
      document_status: DocumentStatus;
      activity_type: ActivityType;
      activity_severity: ActivitySeverity;
      alert_severity: AlertSeverity;
      alert_status: AlertStatus;
      calendar_event_type: CalendarEventType;
      contact_request_type: ContactRequestType;
      contact_status: ContactStatus;
      newsletter_source: NewsletterSource;
      subscription_status: SubscriptionStatus;
      webhook_status: WebhookStatus;
      invoice_status: InvoiceStatus;
      currency: Currency;
      country_code: CountryCode;
      obligation_frequency: ObligationFrequency;
      obligation_status: ObligationStatus;
      org_obligation_status: OrgObligationStatus;
      reges_status: RegesStatus;
      reges_message_type: RegesMessageType;
      reges_message_status: RegesMessageStatus;
      reges_receipt_status: RegesReceiptStatus;
      reges_result_type: RegesResultType;
      reges_employment_status: RegesEmploymentStatus;
      audit_log_entity_type: AuditLogEntityType;
    };
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// HELPER TYPES
// ══════════════════════════════════════════════════════════════════════════════

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
