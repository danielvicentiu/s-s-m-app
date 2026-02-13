// ============================================================
// S-S-M.RO — DATE DEMO FIRMĂ IT
// File: lib/data/demo-data-it.ts
// ============================================================
// Firma: TechSoft SRL
// Profil: 30 angajați, development software & IT services
// Departamente: 4 (Development, IT Support, Management, Sales)
// Caracteristici: 60% telemuncă, low risk, mostly VDT, riscuri ergonomice/psihosociale
// Compliance: NIS2 requirements, examene oftalmologice obligatorii
// ============================================================

import type { Organization, MedicalExamination, SafetyEquipment, GeneratedDocument } from '@/lib/types'
import type { TrainingSession, TrainingAssignment } from '@/lib/training-types'

// ============================================================
// ORGANIZAȚIE
// ============================================================

export const demoOrganizationIT: Partial<Organization> = {
  name: 'TechSoft SRL',
  cui: 'RO42567890',
  address: 'Str. Aviatorilor nr. 42, 011853 București, Sector 1',
  county: 'București',
  contact_email: 'office@techsoft.ro',
  contact_phone: '+40 31 456 7890',
  data_completeness: 92,
  employee_count: 30,
  exposure_score: 'scazut',
  preferred_channels: ['email', 'slack'],
  cooperation_status: 'active'
}

// ============================================================
// ANGAJAȚI (30)
// ============================================================

export interface DemoEmployee {
  id: string
  organization_id: string
  full_name: string
  cnp_hash: string
  job_title: string
  department: string
  employment_start_date: string
  employment_type: 'full_time' | 'part_time' | 'contract'
  cor_code: string
  is_active: boolean
  created_at: string
}

export const demoEmployeesIT: Partial<DemoEmployee>[] = [
  // ── MANAGEMENT (4) ──
  { full_name: 'Popescu Alexandra', job_title: 'CEO & Co-Founder', department: 'Management', cor_code: '1120', employment_type: 'full_time', employment_start_date: '2018-01-15' },
  { full_name: 'Ionescu Radu', job_title: 'CTO & Co-Founder', department: 'Management', cor_code: '1330', employment_type: 'full_time', employment_start_date: '2018-01-15' },
  { full_name: 'Georgescu Maria', job_title: 'CFO', department: 'Management', cor_code: '1211', employment_type: 'full_time', employment_start_date: '2019-03-01' },
  { full_name: 'Dumitrescu Andrei', job_title: 'HR Manager', department: 'Management', cor_code: '1212', employment_type: 'full_time', employment_start_date: '2020-06-15' },

  // ── DEVELOPMENT (18) ──
  { full_name: 'Munteanu Victor', job_title: 'Tech Lead Backend', department: 'Development', cor_code: '2512', employment_type: 'full_time', employment_start_date: '2019-02-10' },
  { full_name: 'Popa Cristina', job_title: 'Tech Lead Frontend', department: 'Development', cor_code: '2512', employment_type: 'full_time', employment_start_date: '2019-05-20' },
  { full_name: 'Constantinescu Dan', job_title: 'Senior Full-Stack Developer', department: 'Development', cor_code: '2512', employment_type: 'full_time', employment_start_date: '2019-09-01' },
  { full_name: 'Radu Elena', job_title: 'Senior Full-Stack Developer', department: 'Development', cor_code: '2512', employment_type: 'full_time', employment_start_date: '2020-01-15' },
  { full_name: 'Florea Mihai', job_title: 'Senior Backend Developer', department: 'Development', cor_code: '2512', employment_type: 'full_time', employment_start_date: '2020-04-10' },
  { full_name: 'Marinescu Ana', job_title: 'Senior Frontend Developer (React)', department: 'Development', cor_code: '2512', employment_type: 'full_time', employment_start_date: '2020-08-01' },
  { full_name: 'Tudor Bogdan', job_title: 'Mid-Level Backend Developer', department: 'Development', cor_code: '2512', employment_type: 'full_time', employment_start_date: '2021-02-15' },
  { full_name: 'Ciobanu Diana', job_title: 'Mid-Level Frontend Developer', department: 'Development', cor_code: '2512', employment_type: 'full_time', employment_start_date: '2021-06-01' },
  { full_name: 'Nistor Gabriel', job_title: 'Mid-Level Full-Stack Developer', department: 'Development', cor_code: '2512', employment_type: 'full_time', employment_start_date: '2021-09-15' },
  { full_name: 'Barbu Ioana', job_title: 'Junior Backend Developer', department: 'Development', cor_code: '2512', employment_type: 'full_time', employment_start_date: '2022-03-01' },
  { full_name: 'Vlad Alexandru', job_title: 'Junior Frontend Developer', department: 'Development', cor_code: '2512', employment_type: 'full_time', employment_start_date: '2022-07-10' },
  { full_name: 'Ene Larisa', job_title: 'Junior Full-Stack Developer', department: 'Development', cor_code: '2512', employment_type: 'full_time', employment_start_date: '2023-01-20' },
  { full_name: 'Matei Robert', job_title: 'DevOps Engineer', department: 'Development', cor_code: '2522', employment_type: 'full_time', employment_start_date: '2020-11-01' },
  { full_name: 'Dumitrescu Sofia', job_title: 'QA Engineer', department: 'Development', cor_code: '2519', employment_type: 'full_time', employment_start_date: '2021-04-15' },
  { full_name: 'Stoica Adrian', job_title: 'UI/UX Designer', department: 'Development', cor_code: '2166', employment_type: 'full_time', employment_start_date: '2021-08-01' },
  { full_name: 'Dragomir Carmen', job_title: 'Product Manager', department: 'Development', cor_code: '2431', employment_type: 'full_time', employment_start_date: '2022-01-10' },
  { full_name: 'Sandu Claudiu', job_title: 'Scrum Master', department: 'Development', cor_code: '2431', employment_type: 'full_time', employment_start_date: '2022-05-01' },
  { full_name: 'Badea Simona', job_title: 'Business Analyst', department: 'Development', cor_code: '2431', employment_type: 'full_time', employment_start_date: '2023-02-15' },

  // ── IT SUPPORT (5) ──
  { full_name: 'Lungu Stefan', job_title: 'IT Support Lead', department: 'IT Support', cor_code: '2522', employment_type: 'full_time', employment_start_date: '2019-07-01' },
  { full_name: 'Croitoru Monica', job_title: 'System Administrator', department: 'IT Support', cor_code: '2522', employment_type: 'full_time', employment_start_date: '2020-10-15' },
  { full_name: 'Gheorghiu Florin', job_title: 'Network Administrator', department: 'IT Support', cor_code: '2522', employment_type: 'full_time', employment_start_date: '2021-03-10' },
  { full_name: 'Manole Denisa', job_title: 'IT Support Specialist', department: 'IT Support', cor_code: '3512', employment_type: 'full_time', employment_start_date: '2022-09-01' },
  { full_name: 'Avram Ionut', job_title: 'Cybersecurity Specialist (NIS2)', department: 'IT Support', cor_code: '2529', employment_type: 'full_time', employment_start_date: '2024-01-15' },

  // ── SALES & SUPPORT (3) ──
  { full_name: 'Diaconu Nicoleta', job_title: 'Sales Manager', department: 'Sales', cor_code: '2431', employment_type: 'full_time', employment_start_date: '2020-02-01' },
  { full_name: 'Oprea Marius', job_title: 'Account Manager', department: 'Sales', cor_code: '2433', employment_type: 'full_time', employment_start_date: '2021-05-15' },
  { full_name: 'Preda Raluca', job_title: 'Customer Success Manager', department: 'Sales', cor_code: '2433', employment_type: 'full_time', employment_start_date: '2022-11-01' }
]

// ============================================================
// EXAMENE MEDICALE (30 - Toate cu examene oftalmologice VDT)
// ============================================================

export const demoMedicalExamsIT: Partial<MedicalExamination>[] = [
  // Management
  { employee_name: 'Popescu Alexandra', job_title: 'CEO & Co-Founder', examination_type: 'periodic', examination_date: '2025-11-15', expiry_date: '2026-11-15', result: 'apt', doctor_name: 'Dr. Mihai Vasilescu', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT inclus - apt' },
  { employee_name: 'Ionescu Radu', job_title: 'CTO & Co-Founder', examination_type: 'periodic', examination_date: '2025-11-15', expiry_date: '2026-11-15', result: 'apt_conditionat', restrictions: 'Ochelari corecție VDT obligatorii', doctor_name: 'Dr. Mihai Vasilescu', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT - miopie ușoară' },
  { employee_name: 'Georgescu Maria', job_title: 'CFO', examination_type: 'periodic', examination_date: '2025-10-20', expiry_date: '2026-10-20', result: 'apt', doctor_name: 'Dr. Ana Popa', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT inclus - apt' },
  { employee_name: 'Dumitrescu Andrei', job_title: 'HR Manager', examination_type: 'periodic', examination_date: '2025-09-10', expiry_date: '2026-09-10', result: 'apt', doctor_name: 'Dr. Mihai Vasilescu', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT inclus - apt' },

  // Development - Tech Leads
  { employee_name: 'Munteanu Victor', job_title: 'Tech Lead Backend', examination_type: 'periodic', examination_date: '2025-08-15', expiry_date: '2026-08-15', result: 'apt_conditionat', restrictions: 'Pauze regulate la 2h, ochelari anti-blue light', doctor_name: 'Dr. Ana Popa', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT - oboseală oculară cronică' },
  { employee_name: 'Popa Cristina', job_title: 'Tech Lead Frontend', examination_type: 'periodic', examination_date: '2025-07-25', expiry_date: '2026-07-25', result: 'apt', doctor_name: 'Dr. Mihai Vasilescu', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT inclus - apt' },

  // Development - Senior
  { employee_name: 'Constantinescu Dan', job_title: 'Senior Full-Stack Developer', examination_type: 'periodic', examination_date: '2025-06-30', expiry_date: '2026-06-30', result: 'apt', doctor_name: 'Dr. Ana Popa', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT inclus - apt' },
  { employee_name: 'Radu Elena', job_title: 'Senior Full-Stack Developer', examination_type: 'periodic', examination_date: '2025-05-18', expiry_date: '2026-05-18', result: 'apt_conditionat', restrictions: 'Ochelari corecție VDT, pauze la 2h', doctor_name: 'Dr. Mihai Vasilescu', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT - astigmatism ușor' },
  { employee_name: 'Florea Mihai', job_title: 'Senior Backend Developer', examination_type: 'periodic', examination_date: '2025-12-01', expiry_date: '2026-12-01', result: 'apt', doctor_name: 'Dr. Ana Popa', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT inclus - apt' },
  { employee_name: 'Marinescu Ana', job_title: 'Senior Frontend Developer (React)', examination_type: 'periodic', examination_date: '2025-11-10', expiry_date: '2026-11-10', result: 'apt', doctor_name: 'Dr. Mihai Vasilescu', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT inclus - apt' },

  // Development - Mid-Level
  { employee_name: 'Tudor Bogdan', job_title: 'Mid-Level Backend Developer', examination_type: 'periodic', examination_date: '2025-10-05', expiry_date: '2026-10-05', result: 'apt', doctor_name: 'Dr. Ana Popa', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT inclus - apt' },
  { employee_name: 'Ciobanu Diana', job_title: 'Mid-Level Frontend Developer', examination_type: 'periodic', examination_date: '2025-09-20', expiry_date: '2026-09-20', result: 'apt', doctor_name: 'Dr. Mihai Vasilescu', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT inclus - apt' },
  { employee_name: 'Nistor Gabriel', job_title: 'Mid-Level Full-Stack Developer', examination_type: 'periodic', examination_date: '2025-08-25', expiry_date: '2026-08-25', result: 'apt', doctor_name: 'Dr. Ana Popa', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT inclus - apt' },

  // Development - Junior
  { employee_name: 'Barbu Ioana', job_title: 'Junior Backend Developer', examination_type: 'periodic', examination_date: '2025-07-15', expiry_date: '2026-07-15', result: 'apt', doctor_name: 'Dr. Mihai Vasilescu', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT inclus - apt' },
  { employee_name: 'Vlad Alexandru', job_title: 'Junior Frontend Developer', examination_type: 'periodic', examination_date: '2025-06-10', expiry_date: '2026-06-10', result: 'apt', doctor_name: 'Dr. Ana Popa', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT inclus - apt' },
  { employee_name: 'Ene Larisa', job_title: 'Junior Full-Stack Developer', examination_type: 'angajare', examination_date: '2025-01-15', expiry_date: '2026-01-15', result: 'apt', doctor_name: 'Dr. Mihai Vasilescu', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT inclus - apt' },

  // Development - Other roles
  { employee_name: 'Matei Robert', job_title: 'DevOps Engineer', examination_type: 'periodic', examination_date: '2025-12-10', expiry_date: '2026-12-10', result: 'apt', doctor_name: 'Dr. Ana Popa', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT inclus - apt' },
  { employee_name: 'Dumitrescu Sofia', job_title: 'QA Engineer', examination_type: 'periodic', examination_date: '2025-11-25', expiry_date: '2026-11-25', result: 'apt', doctor_name: 'Dr. Mihai Vasilescu', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT inclus - apt' },
  { employee_name: 'Stoica Adrian', job_title: 'UI/UX Designer', examination_type: 'periodic', examination_date: '2025-10-15', expiry_date: '2026-10-15', result: 'apt_conditionat', restrictions: 'Ochelari anti-blue light recomandat', doctor_name: 'Dr. Ana Popa', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT - lucru intens grafică' },
  { employee_name: 'Dragomir Carmen', job_title: 'Product Manager', examination_type: 'periodic', examination_date: '2025-09-05', expiry_date: '2026-09-05', result: 'apt', doctor_name: 'Dr. Mihai Vasilescu', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT inclus - apt' },
  { employee_name: 'Sandu Claudiu', job_title: 'Scrum Master', examination_type: 'periodic', examination_date: '2025-08-01', expiry_date: '2026-08-01', result: 'apt', doctor_name: 'Dr. Ana Popa', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT inclus - apt' },
  { employee_name: 'Badea Simona', job_title: 'Business Analyst', examination_type: 'angajare', examination_date: '2025-02-10', expiry_date: '2026-02-10', result: 'apt', doctor_name: 'Dr. Mihai Vasilescu', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT inclus - apt' },

  // IT Support
  { employee_name: 'Lungu Stefan', job_title: 'IT Support Lead', examination_type: 'periodic', examination_date: '2025-07-20', expiry_date: '2026-07-20', result: 'apt', doctor_name: 'Dr. Ana Popa', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT inclus - apt' },
  { employee_name: 'Croitoru Monica', job_title: 'System Administrator', examination_type: 'periodic', examination_date: '2025-06-25', expiry_date: '2026-06-25', result: 'apt', doctor_name: 'Dr. Mihai Vasilescu', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT inclus - apt' },
  { employee_name: 'Gheorghiu Florin', job_title: 'Network Administrator', examination_type: 'periodic', examination_date: '2025-05-30', expiry_date: '2026-05-30', result: 'apt', doctor_name: 'Dr. Ana Popa', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT inclus - apt' },
  { employee_name: 'Manole Denisa', job_title: 'IT Support Specialist', examination_type: 'periodic', examination_date: '2025-04-15', expiry_date: '2026-04-15', result: 'apt', doctor_name: 'Dr. Mihai Vasilescu', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT inclus - apt' },
  { employee_name: 'Avram Ionut', job_title: 'Cybersecurity Specialist (NIS2)', examination_type: 'angajare', examination_date: '2024-01-10', expiry_date: '2025-01-10', result: 'apt', doctor_name: 'Dr. Ana Popa', clinic_name: 'Clinica MedWork București', notes: 'EXPIRAT - Examen oftalmologic VDT necesar urgent' },

  // Sales
  { employee_name: 'Diaconu Nicoleta', job_title: 'Sales Manager', examination_type: 'periodic', examination_date: '2025-03-20', expiry_date: '2026-03-20', result: 'apt', doctor_name: 'Dr. Mihai Vasilescu', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT inclus - apt' },
  { employee_name: 'Oprea Marius', job_title: 'Account Manager', examination_type: 'periodic', examination_date: '2025-02-25', expiry_date: '2026-02-25', result: 'apt', doctor_name: 'Dr. Ana Popa', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT inclus - apt' },
  { employee_name: 'Preda Raluca', job_title: 'Customer Success Manager', examination_type: 'periodic', examination_date: '2025-01-30', expiry_date: '2026-01-30', result: 'apt', doctor_name: 'Dr. Mihai Vasilescu', clinic_name: 'Clinica MedWork București', notes: 'Examen oftalmologic VDT inclus - apt' }
]

// ============================================================
// ECHIPAMENTE (8 - Low risk IT environment)
// ============================================================

export const demoEquipmentIT: Partial<SafetyEquipment>[] = [
  // Siguranță electrică birou
  { equipment_type: 'altul', description: 'Tablou electric principal birou 400V', location: 'Etaj 3 - Sala serverelor', serial_number: 'TAB-ELEC-2022-001', last_inspection_date: '2025-09-15', expiry_date: '2026-09-15', next_inspection_date: '2026-09-15', inspector_name: 'Electrician Autorizat ANRE', is_compliant: true },
  { equipment_type: 'altul', description: 'UPS APC Smart-UPS 10kVA', location: 'Etaj 3 - Sala serverelor', serial_number: 'UPS-2021-001', last_inspection_date: '2025-08-20', expiry_date: '2026-08-20', next_inspection_date: '2026-08-20', inspector_name: 'Service autorizat APC', is_compliant: true },
  { equipment_type: 'altul', description: 'Sistem climatizare precizie sala servere', location: 'Etaj 3 - Sala serverelor', serial_number: 'CLIM-2020-001', last_inspection_date: '2025-07-10', expiry_date: '2026-07-10', next_inspection_date: '2026-07-10', inspector_name: 'Service climatizare autorizat', is_compliant: true },
  { equipment_type: 'altul', description: 'Generator curent diesel 50kVA', location: 'Terasă tehnică', serial_number: 'GEN-2021-002', last_inspection_date: '2025-06-05', expiry_date: '2026-06-05', next_inspection_date: '2026-06-05', inspector_name: 'Service autorizat generatoare', is_compliant: true },

  // PSI
  { equipment_type: 'altul', description: 'Stingător CO2 5kg - set 8 buc', location: 'Birou - toate etajele', serial_number: 'PSI-STING-2024-001', last_inspection_date: '2025-11-01', expiry_date: '2026-11-01', next_inspection_date: '2026-11-01', inspector_name: 'Inspector PSI autorizat', is_compliant: true, notes: '2 stingătoare/etaj' },
  { equipment_type: 'altul', description: 'Sistem detecție incendiu sala servere', location: 'Etaj 3 - Sala serverelor', serial_number: 'PSI-DET-2022-001', last_inspection_date: '2025-10-15', expiry_date: '2026-10-15', next_inspection_date: '2026-10-15', inspector_name: 'Inspector PSI autorizat', is_compliant: true },
  { equipment_type: 'altul', description: 'Sistem stingere automată FM-200 sala servere', location: 'Etaj 3 - Sala serverelor', serial_number: 'PSI-FM200-2022-002', last_inspection_date: '2025-09-20', expiry_date: '2026-09-20', next_inspection_date: '2026-09-20', inspector_name: 'Inspector PSI autorizat', is_compliant: true },

  // Evacuation
  { equipment_type: 'altul', description: 'Sistem iluminat siguranță evacuare', location: 'Toate etajele', serial_number: 'EVAC-LED-2023-001', last_inspection_date: '2025-08-10', expiry_date: '2026-08-10', next_inspection_date: '2026-08-10', inspector_name: 'Electrician Autorizat', is_compliant: true }
]

// ============================================================
// INSTRUIRI / SESIUNI TRAINING (35)
// ============================================================

export const demoTrainingSessionsIT: Partial<TrainingSession>[] = [
  // Instruiri SSM generale - Management
  { worker_id: 'demo-emp-001', instructor_name: 'Consultant SSM Extern', session_date: '2025-11-05', duration_minutes: 120, language: 'ro', location: 'Sala conferințe - online', test_score: 96, test_questions_total: 20, test_questions_correct: 19, verification_result: 'admis' },
  { worker_id: 'demo-emp-002', instructor_name: 'Consultant SSM Extern', session_date: '2025-11-05', duration_minutes: 120, language: 'ro', location: 'Sala conferințe - online', test_score: 94, test_questions_total: 20, test_questions_correct: 18, verification_result: 'admis' },
  { worker_id: 'demo-emp-003', instructor_name: 'Consultant SSM Extern', session_date: '2025-11-05', duration_minutes: 120, language: 'ro', location: 'Sala conferințe - online', test_score: 92, test_questions_total: 20, test_questions_correct: 18, verification_result: 'admis' },
  { worker_id: 'demo-emp-004', instructor_name: 'Consultant SSM Extern', session_date: '2025-11-05', duration_minutes: 120, language: 'ro', location: 'Sala conferințe - online', test_score: 90, test_questions_total: 20, test_questions_correct: 18, verification_result: 'admis' },

  // Instruiri ergonomie VDT - Development team (18 angajați)
  { worker_id: 'demo-emp-005', instructor_name: 'Medic Medicina Muncii', session_date: '2025-10-15', duration_minutes: 180, language: 'ro', location: 'Online - Zoom', test_score: 89, test_questions_total: 25, test_questions_correct: 22, verification_result: 'admis' },
  { worker_id: 'demo-emp-006', instructor_name: 'Medic Medicina Muncii', session_date: '2025-10-15', duration_minutes: 180, language: 'ro', location: 'Online - Zoom', test_score: 91, test_questions_total: 25, test_questions_correct: 22, verification_result: 'admis' },
  { worker_id: 'demo-emp-007', instructor_name: 'Medic Medicina Muncii', session_date: '2025-10-15', duration_minutes: 180, language: 'ro', location: 'Online - Zoom', test_score: 88, test_questions_total: 25, test_questions_correct: 22, verification_result: 'admis' },
  { worker_id: 'demo-emp-008', instructor_name: 'Medic Medicina Muncii', session_date: '2025-10-15', duration_minutes: 180, language: 'ro', location: 'Online - Zoom', test_score: 86, test_questions_total: 25, test_questions_correct: 21, verification_result: 'admis' },
  { worker_id: 'demo-emp-009', instructor_name: 'Medic Medicina Muncii', session_date: '2025-10-15', duration_minutes: 180, language: 'ro', location: 'Online - Zoom', test_score: 92, test_questions_total: 25, test_questions_correct: 23, verification_result: 'admis' },
  { worker_id: 'demo-emp-010', instructor_name: 'Medic Medicina Muncii', session_date: '2025-10-15', duration_minutes: 180, language: 'ro', location: 'Online - Zoom', test_score: 87, test_questions_total: 25, test_questions_correct: 21, verification_result: 'admis' },
  { worker_id: 'demo-emp-011', instructor_name: 'Medic Medicina Muncii', session_date: '2025-10-15', duration_minutes: 180, language: 'ro', location: 'Online - Zoom', test_score: 90, test_questions_total: 25, test_questions_correct: 22, verification_result: 'admis' },
  { worker_id: 'demo-emp-012', instructor_name: 'Medic Medicina Muncii', session_date: '2025-10-15', duration_minutes: 180, language: 'ro', location: 'Online - Zoom', test_score: 85, test_questions_total: 25, test_questions_correct: 21, verification_result: 'admis' },
  { worker_id: 'demo-emp-013', instructor_name: 'Medic Medicina Muncii', session_date: '2025-10-15', duration_minutes: 180, language: 'ro', location: 'Online - Zoom', test_score: 84, test_questions_total: 25, test_questions_correct: 21, verification_result: 'admis' },
  { worker_id: 'demo-emp-014', instructor_name: 'Medic Medicina Muncii', session_date: '2025-10-15', duration_minutes: 180, language: 'ro', location: 'Online - Zoom', test_score: 88, test_questions_total: 25, test_questions_correct: 22, verification_result: 'admis' },
  { worker_id: 'demo-emp-015', instructor_name: 'Medic Medicina Muncii', session_date: '2025-10-15', duration_minutes: 180, language: 'ro', location: 'Online - Zoom', test_score: 86, test_questions_total: 25, test_questions_correct: 21, verification_result: 'admis' },
  { worker_id: 'demo-emp-016', instructor_name: 'Medic Medicina Muncii', session_date: '2025-10-15', duration_minutes: 180, language: 'ro', location: 'Online - Zoom', test_score: 82, test_questions_total: 25, test_questions_correct: 20, verification_result: 'admis' },
  { worker_id: 'demo-emp-017', instructor_name: 'Medic Medicina Muncii', session_date: '2025-10-15', duration_minutes: 180, language: 'ro', location: 'Online - Zoom', test_score: 89, test_questions_total: 25, test_questions_correct: 22, verification_result: 'admis' },
  { worker_id: 'demo-emp-018', instructor_name: 'Medic Medicina Muncii', session_date: '2025-10-15', duration_minutes: 180, language: 'ro', location: 'Online - Zoom', test_score: 90, test_questions_total: 25, test_questions_correct: 22, verification_result: 'admis' },
  { worker_id: 'demo-emp-019', instructor_name: 'Medic Medicina Muncii', session_date: '2025-10-15', duration_minutes: 180, language: 'ro', location: 'Online - Zoom', test_score: 87, test_questions_total: 25, test_questions_correct: 21, verification_result: 'admis' },
  { worker_id: 'demo-emp-020', instructor_name: 'Medic Medicina Muncii', session_date: '2025-10-15', duration_minutes: 180, language: 'ro', location: 'Online - Zoom', test_score: 91, test_questions_total: 25, test_questions_correct: 22, verification_result: 'admis' },
  { worker_id: 'demo-emp-021', instructor_name: 'Medic Medicina Muncii', session_date: '2025-10-15', duration_minutes: 180, language: 'ro', location: 'Online - Zoom', test_score: 85, test_questions_total: 25, test_questions_correct: 21, verification_result: 'admis' },
  { worker_id: 'demo-emp-022', instructor_name: 'Medic Medicina Muncii', session_date: '2025-10-15', duration_minutes: 180, language: 'ro', location: 'Online - Zoom', test_score: 88, test_questions_total: 25, test_questions_correct: 22, verification_result: 'admis' },

  // Instruiri PSI pentru tot personalul
  { worker_id: 'demo-emp-001', instructor_name: 'Inspector PSI Extern', session_date: '2025-12-05', duration_minutes: 120, language: 'ro', location: 'Sala conferințe', test_score: 95, test_questions_total: 20, test_questions_correct: 19, verification_result: 'admis' },
  { worker_id: 'demo-emp-005', instructor_name: 'Inspector PSI Extern', session_date: '2025-12-05', duration_minutes: 120, language: 'ro', location: 'Sala conferințe', test_score: 92, test_questions_total: 20, test_questions_correct: 18, verification_result: 'admis' },
  { worker_id: 'demo-emp-023', instructor_name: 'Inspector PSI Extern', session_date: '2025-12-05', duration_minutes: 120, language: 'ro', location: 'Sala conferințe', test_score: 90, test_questions_total: 20, test_questions_correct: 18, verification_result: 'admis' },

  // Instruiri Cybersecurity NIS2
  { worker_id: 'demo-emp-027', instructor_name: 'Consultant Cybersecurity NIS2', session_date: '2025-09-20', duration_minutes: 480, language: 'en', location: 'Online - Teams', test_score: 94, test_questions_total: 50, test_questions_correct: 47, verification_result: 'admis' },
  { worker_id: 'demo-emp-002', instructor_name: 'Consultant Cybersecurity NIS2', session_date: '2025-09-20', duration_minutes: 240, language: 'en', location: 'Online - Teams', test_score: 91, test_questions_total: 30, test_questions_correct: 27, verification_result: 'admis' },
  { worker_id: 'demo-emp-005', instructor_name: 'Consultant Cybersecurity NIS2', session_date: '2025-09-20', duration_minutes: 240, language: 'en', location: 'Online - Teams', test_score: 88, test_questions_total: 30, test_questions_correct: 26, verification_result: 'admis' },

  // Instruiri riscuri psihosociale
  { worker_id: 'demo-emp-001', instructor_name: 'Psiholog Organizațional', session_date: '2025-08-10', duration_minutes: 180, language: 'ro', location: 'Online - Zoom', test_score: 93, test_questions_total: 25, test_questions_correct: 23, verification_result: 'admis' },
  { worker_id: 'demo-emp-004', instructor_name: 'Psiholog Organizațional', session_date: '2025-08-10', duration_minutes: 180, language: 'ro', location: 'Online - Zoom', test_score: 89, test_questions_total: 25, test_questions_correct: 22, verification_result: 'admis' },
  { worker_id: 'demo-emp-005', instructor_name: 'Psiholog Organizațional', session_date: '2025-08-10', duration_minutes: 180, language: 'ro', location: 'Online - Zoom', test_score: 87, test_questions_total: 25, test_questions_correct: 21, verification_result: 'admis' },

  // Prim ajutor
  { worker_id: 'demo-emp-004', instructor_name: 'Medic SMURD', session_date: '2025-11-20', duration_minutes: 360, language: 'ro', location: 'Sala conferințe', test_score: 92, test_questions_total: 35, test_questions_correct: 32, verification_result: 'admis' },
  { worker_id: 'demo-emp-023', instructor_name: 'Medic SMURD', session_date: '2025-11-20', duration_minutes: 360, language: 'ro', location: 'Sala conferințe', test_score: 88, test_questions_total: 35, test_questions_correct: 30, verification_result: 'admis' },
  { worker_id: 'demo-emp-025', instructor_name: 'Medic SMURD', session_date: '2025-11-20', duration_minutes: 360, language: 'ro', location: 'Sala conferințe', test_score: 90, test_questions_total: 35, test_questions_correct: 31, verification_result: 'admis' }
]

// ============================================================
// DOCUMENTE GENERATE (12)
// ============================================================

export const demoDocumentsIT: Partial<GeneratedDocument>[] = [
  { document_type: 'raport_conformitate', file_name: 'Raport_Conformitate_SSM_TechSoft_2025_Q4.pdf', file_size_bytes: 1876543, storage_path: '/documents/techsoft/raport_2025_q4.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { period: 'Q4 2025', generator: 'consultant' } },
  { document_type: 'fisa_medicina_muncii', file_name: 'Fisa_MM_VDT_TechSoft_2025.pdf', file_size_bytes: 2345678, storage_path: '/documents/techsoft/fisa_mm_vdt.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { category: 'VDT Workers', total: 30 } },
  { document_type: 'fisa_echipamente', file_name: 'Fisa_Echipamente_PSI_2025.pdf', file_size_bytes: 654321, storage_path: '/documents/techsoft/fisa_psi.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { equipment_type: 'PSI' } },
  { document_type: 'fisa_instruire', file_name: 'Fisa_Instruire_Ergonomie_VDT_Oct2025.pdf', file_size_bytes: 987654, storage_path: '/documents/techsoft/fisa_ergonomie_vdt.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { training_type: 'Ergonomie VDT', month: 'Octombrie 2025' } },
  { document_type: 'fisa_instruire', file_name: 'Fisa_Instruire_PSI_Dec2025.pdf', file_size_bytes: 456789, storage_path: '/documents/techsoft/fisa_psi_dec.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { training_type: 'PSI', month: 'Decembrie 2025' } },
  { document_type: 'altul', file_name: 'Plan_Prevenire_Protectie_TechSoft_2025.pdf', file_size_bytes: 1456789, storage_path: '/documents/techsoft/ppp_2025.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { doc_type: 'PPP', year: 2025 } },
  { document_type: 'altul', file_name: 'Registru_Evaluare_Riscuri_IT_2025.pdf', file_size_bytes: 1234567, storage_path: '/documents/techsoft/rer_it_2025.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { doc_type: 'RER', industry: 'IT Services' } },
  { document_type: 'altul', file_name: 'Evaluare_Riscuri_Ergonomice_VDT.pdf', file_size_bytes: 876543, storage_path: '/documents/techsoft/eval_ergo_vdt.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { doc_type: 'Evaluare Ergonomică', focus: 'VDT' } },
  { document_type: 'altul', file_name: 'Evaluare_Riscuri_Psihosociale_2025.pdf', file_size_bytes: 1123456, storage_path: '/documents/techsoft/eval_psihosociale.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { doc_type: 'Evaluare Psihosocială', year: 2025 } },
  { document_type: 'altul', file_name: 'Plan_NIS2_Compliance_TechSoft_2024.pdf', file_size_bytes: 2876543, storage_path: '/documents/techsoft/nis2_compliance.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { doc_type: 'NIS2 Compliance Plan', year: 2024 } },
  { document_type: 'altul', file_name: 'Procedura_Telemunca_SSM_2025.pdf', file_size_bytes: 765432, storage_path: '/documents/techsoft/procedura_telemunca.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { doc_type: 'Procedură Telemuncă', percentage: '60%' } },
  { document_type: 'altul', file_name: 'Ghid_Ergonomie_Birou_Acasa.pdf', file_size_bytes: 567890, storage_path: '/documents/techsoft/ghid_ergo_acasa.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { doc_type: 'Ghid Angajați', topic: 'Ergonomie Home Office' } }
]

// ============================================================
// ALERTE (5 - Low risk environment)
// ============================================================

export interface DemoAlert {
  id: string
  organization_id: string
  alert_type: 'medical_expiry' | 'equipment_expiry' | 'training_expiry' | 'document_missing' | 'compliance_issue' | 'safety_incident'
  severity: 'info' | 'warning' | 'critical' | 'expired'
  title: string
  description: string
  related_entity_type: 'employee' | 'equipment' | 'training' | 'document' | 'general'
  related_entity_id: string | null
  action_required: string
  due_date: string | null
  is_resolved: boolean
  created_at: string
}

export const demoAlertsIT: Partial<DemoAlert>[] = [
  {
    alert_type: 'medical_expiry',
    severity: 'expired',
    title: 'Fișă medicală expirată - Avram Ionut (Cybersecurity)',
    description: 'Fișa de medicina muncii a expirat la data de 10.01.2025. Necesită reexaminare urgentă inclusiv control oftalmologic VDT.',
    related_entity_type: 'employee',
    related_entity_id: 'demo-emp-027',
    action_required: 'Programare urgentă examen medical + oftalmologic',
    due_date: '2026-02-20',
    is_resolved: false
  },
  {
    alert_type: 'compliance_issue',
    severity: 'warning',
    title: 'Audit NIS2 programat - martie 2026',
    description: 'Audit NIS2 compliance programat pentru martie 2026. Verificare necesară: documentație SSM cybersecurity, training echipă IT, proceduri incident response.',
    related_entity_type: 'general',
    related_entity_id: null,
    action_required: 'Pregătire audit: verificare documentație, update proceduri, training refresh',
    due_date: '2026-03-01',
    is_resolved: false
  },
  {
    alert_type: 'training_expiry',
    severity: 'info',
    title: 'Reînnoire instruire ergonomie VDT - Q2 2026',
    description: 'Instruirea de ergonomie pentru lucru VDT (octombrie 2025) necesită reînnoire pentru toți developerii în Q2 2026.',
    related_entity_type: 'training',
    related_entity_id: 'demo-train-005',
    action_required: 'Programare sesiune instruire ergonomie VDT aprilie-iunie 2026',
    due_date: '2026-06-30',
    is_resolved: false
  },
  {
    alert_type: 'document_missing',
    severity: 'warning',
    title: 'Lipsă evaluare ergonomică individual - 3 angajați telemuncă',
    description: 'Trei angajați nou angajați în telemuncă (Barbu Ioana, Vlad Alexandru, Ene Larisa) nu au evaluare ergonomică pentru home office.',
    related_entity_type: 'document',
    related_entity_id: null,
    action_required: 'Completare chestionar evaluare ergonomică home office + vizită consultant SSM',
    due_date: '2026-03-15',
    is_resolved: false
  },
  {
    alert_type: 'compliance_issue',
    severity: 'info',
    title: 'Review proceduri riscuri psihosociale',
    description: 'Review anual al procedurilor de identificare și gestionare riscuri psihosociale (stress, burnout, overwork în IT) programat pentru februarie 2026.',
    related_entity_type: 'general',
    related_entity_id: null,
    action_required: 'Sesiune evaluare psihosocială + workshop management',
    due_date: '2026-02-28',
    is_resolved: false
  }
]

// ============================================================
// EXPORT COMPLET
// ============================================================

export const demoDataIT = {
  organization: demoOrganizationIT,
  employees: demoEmployeesIT,
  medicalExams: demoMedicalExamsIT,
  equipment: demoEquipmentIT,
  trainingSessions: demoTrainingSessionsIT,
  documents: demoDocumentsIT,
  alerts: demoAlertsIT,
  stats: {
    totalEmployees: 30,
    departments: 4,
    trainingSessions: 35,
    medicalExams: 30,
    equipment: 8,
    documents: 12,
    alerts: 5,
    alertsExpired: 1,
    teleworkPercentage: 60,
    vdtWorkers: 30,
    lowRisk: true,
    nis2Compliant: true
  }
}
