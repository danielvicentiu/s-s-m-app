// ============================================================
// S-S-M.RO — DATE DEMO HOTEL
// File: lib/data/demo-data-hotel.ts
// ============================================================
// Hotel: Grand Hotel Panoramic ★★★★★
// Profil: 45 angajați, hotel de lux cu restaurant, spa, evenimente
// Departamente: 6 (Recepție, Housekeeping, Restaurant & Bar, Spa & Wellness, Mentenanță, Administrație)
// Riscuri PSI: RIDICAT (bucătărie, spațiu cazare, flux mare public)
// Echipamente PSI: 38 stingătoare, 6 hidranți interiori, plan evacuare, detectoare fum
// Instruiri: Semestriale obligatorii PSI, HACCP bucătărie
// ============================================================

import type { Organization, MedicalExamination, SafetyEquipment, GeneratedDocument } from '@/lib/types'
import type { TrainingSession, TrainingAssignment } from '@/lib/training-types'

// ============================================================
// ORGANIZAȚIE
// ============================================================

export const demoOrganizationHotel: Partial<Organization> = {
  name: 'Grand Hotel Panoramic',
  cui: 'RO28945612',
  address: 'Bd. Mamaia nr. 255, 900001 Constanța',
  county: 'Constanța',
  contact_email: 'office@grandpanoramic.ro',
  contact_phone: '+40 241 555 777',
  data_completeness: 88,
  employee_count: 45,
  exposure_score: 'ridicat', // PSI ridicat: bucătărie, cazare, flux public
  preferred_channels: ['email', 'whatsapp'],
  cooperation_status: 'active'
}

// ============================================================
// ANGAJAȚI (45)
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

export const demoEmployeesHotel: Partial<DemoEmployee>[] = [
  // ── ADMINISTRAȚIE (5) ──
  { full_name: 'Marinescu Alexandra', job_title: 'Director General', department: 'Administrație', cor_code: '1411', employment_type: 'full_time', employment_start_date: '2015-03-10' },
  { full_name: 'Popescu Victor', job_title: 'Director Operațiuni', department: 'Administrație', cor_code: '1411', employment_type: 'full_time', employment_start_date: '2016-06-15' },
  { full_name: 'Ionescu Claudia', job_title: 'Manager Resurse Umane', department: 'Administrație', cor_code: '1212', employment_type: 'full_time', employment_start_date: '2017-01-20' },
  { full_name: 'Dumitrescu Adrian', job_title: 'Contabil Șef', department: 'Administrație', cor_code: '2411', employment_type: 'full_time', employment_start_date: '2016-09-05' },
  { full_name: 'Georgescu Elena', job_title: 'Inspector SSM & PSI', department: 'Administrație', cor_code: '3152', employment_type: 'full_time', employment_start_date: '2018-02-12' },

  // ── RECEPȚIE (8) ──
  { full_name: 'Stancu Maria', job_title: 'Manager Recepție', department: 'Recepție', cor_code: '1412', employment_type: 'full_time', employment_start_date: '2017-05-10' },
  { full_name: 'Popa Ana', job_title: 'Recepționer Șef de Tură', department: 'Recepție', cor_code: '4221', employment_type: 'full_time', employment_start_date: '2018-03-15' },
  { full_name: 'Radu Ioana', job_title: 'Recepționer', department: 'Recepție', cor_code: '4221', employment_type: 'full_time', employment_start_date: '2019-01-20' },
  { full_name: 'Constantin Mihai', job_title: 'Recepționer', department: 'Recepție', cor_code: '4221', employment_type: 'full_time', employment_start_date: '2019-06-10' },
  { full_name: 'Dragomir Andreea', job_title: 'Recepționer', department: 'Recepție', cor_code: '4221', employment_type: 'full_time', employment_start_date: '2020-02-05' },
  { full_name: 'Munteanu Cristina', job_title: 'Recepționer Night Audit', department: 'Recepție', cor_code: '4221', employment_type: 'full_time', employment_start_date: '2020-08-15' },
  { full_name: 'Florea Gabriel', job_title: 'Concierge', department: 'Recepție', cor_code: '5113', employment_type: 'full_time', employment_start_date: '2018-09-20' },
  { full_name: 'Tudor Vlad', job_title: 'Portbagaj', department: 'Recepție', cor_code: '9113', employment_type: 'part_time', employment_start_date: '2021-05-10' },

  // ── HOUSEKEEPING (12) ──
  { full_name: 'Vasile Monica', job_title: 'Guvernantă Șefă', department: 'Housekeeping', cor_code: '5151', employment_type: 'full_time', employment_start_date: '2016-04-12' },
  { full_name: 'Stoica Carmen', job_title: 'Guvernantă de Etaj', department: 'Housekeeping', cor_code: '5151', employment_type: 'full_time', employment_start_date: '2018-01-15' },
  { full_name: 'Barbu Daniela', job_title: 'Cameristă', department: 'Housekeeping', cor_code: '9112', employment_type: 'full_time', employment_start_date: '2018-07-10' },
  { full_name: 'Nistor Laura', job_title: 'Cameristă', department: 'Housekeeping', cor_code: '9112', employment_type: 'full_time', employment_start_date: '2019-02-20' },
  { full_name: 'Matei Nicoleta', job_title: 'Cameristă', department: 'Housekeeping', cor_code: '9112', employment_type: 'full_time', employment_start_date: '2019-08-05' },
  { full_name: 'Ciobanu Alina', job_title: 'Cameristă', department: 'Housekeeping', cor_code: '9112', employment_type: 'full_time', employment_start_date: '2020-01-15' },
  { full_name: 'Ene Gabriela', job_title: 'Cameristă', department: 'Housekeeping', cor_code: '9112', employment_type: 'full_time', employment_start_date: '2020-06-10' },
  { full_name: 'Lungu Mihaela', job_title: 'Cameristă', department: 'Housekeeping', cor_code: '9112', employment_type: 'part_time', employment_start_date: '2021-03-05' },
  { full_name: 'Sandu Roxana', job_title: 'Cameristă', department: 'Housekeeping', cor_code: '9112', employment_type: 'part_time', employment_start_date: '2021-09-15' },
  { full_name: 'Diaconu Ionela', job_title: 'Lingerie Attendant', department: 'Housekeeping', cor_code: '9121', employment_type: 'full_time', employment_start_date: '2019-05-20' },
  { full_name: 'Oprea Florentina', job_title: 'Îngrijitor Spații Publice', department: 'Housekeeping', cor_code: '9112', employment_type: 'full_time', employment_start_date: '2020-10-01' },
  { full_name: 'Badea Viorica', job_title: 'Îngrijitor Spații Publice', department: 'Housekeeping', cor_code: '9112', employment_type: 'full_time', employment_start_date: '2021-04-10' },

  // ── RESTAURANT & BAR (10) ──
  { full_name: 'Enache Robert', job_title: 'Manager F&B', department: 'Restaurant & Bar', cor_code: '1412', employment_type: 'full_time', employment_start_date: '2017-02-10' },
  { full_name: 'Preda Stefan', job_title: 'Șef Bucătar', department: 'Restaurant & Bar', cor_code: '5120', employment_type: 'full_time', employment_start_date: '2017-08-15' },
  { full_name: 'Tanase Marian', job_title: 'Sous Chef', department: 'Restaurant & Bar', cor_code: '5120', employment_type: 'full_time', employment_start_date: '2018-06-10' },
  { full_name: 'Zamfir Cosmin', job_title: 'Bucătar', department: 'Restaurant & Bar', cor_code: '5120', employment_type: 'full_time', employment_start_date: '2019-03-20' },
  { full_name: 'Neagu Bogdan', job_title: 'Bucătar', department: 'Restaurant & Bar', cor_code: '5120', employment_type: 'full_time', employment_start_date: '2020-01-15' },
  { full_name: 'Lazar Dumitru', job_title: 'Bucătar Rece/Patiser', department: 'Restaurant & Bar', cor_code: '5120', employment_type: 'full_time', employment_start_date: '2019-09-05' },
  { full_name: 'Rusu Diana', job_title: 'Ospătar Șef', department: 'Restaurant & Bar', cor_code: '5131', employment_type: 'full_time', employment_start_date: '2018-04-12' },
  { full_name: 'Filip Andreea', job_title: 'Ospătar', department: 'Restaurant & Bar', cor_code: '5131', employment_type: 'full_time', employment_start_date: '2019-07-20' },
  { full_name: 'Simion George', job_title: 'Ospătar', department: 'Restaurant & Bar', cor_code: '5131', employment_type: 'full_time', employment_start_date: '2020-05-10' },
  { full_name: 'Mocanu Cristian', job_title: 'Barman', department: 'Restaurant & Bar', cor_code: '5132', employment_type: 'full_time', employment_start_date: '2019-11-15' },

  // ── SPA & WELLNESS (5) ──
  { full_name: 'Anton Raluca', job_title: 'Manager Spa', department: 'Spa & Wellness', cor_code: '1412', employment_type: 'full_time', employment_start_date: '2018-03-10' },
  { full_name: 'Cojocaru Ioana', job_title: 'Terapeut Spa', department: 'Spa & Wellness', cor_code: '5142', employment_type: 'full_time', employment_start_date: '2019-01-15' },
  { full_name: 'Croitoru Elena', job_title: 'Terapeut Spa', department: 'Spa & Wellness', cor_code: '5142', employment_type: 'full_time', employment_start_date: '2019-08-20' },
  { full_name: 'Manole Adriana', job_title: 'Maseur Medical', department: 'Spa & Wellness', cor_code: '3232', employment_type: 'full_time', employment_start_date: '2018-09-05' },
  { full_name: 'Avram Cosmina', job_title: 'Recepționer Spa', department: 'Spa & Wellness', cor_code: '4221', employment_type: 'part_time', employment_start_date: '2020-06-10' },

  // ── MENTENANȚĂ (5) ──
  { full_name: 'Voicu Daniel', job_title: 'Șef Mentenanță', department: 'Mentenanță', cor_code: '3123', employment_type: 'full_time', employment_start_date: '2016-07-10' },
  { full_name: 'Dobre Ionut', job_title: 'Tehnician Electrician', department: 'Mentenanță', cor_code: '7412', employment_type: 'full_time', employment_start_date: '2018-02-15' },
  { full_name: 'Iordache Marius', job_title: 'Tehnician Instalator', department: 'Mentenanță', cor_code: '7126', employment_type: 'full_time', employment_start_date: '2018-11-20' },
  { full_name: 'Gheorghiu Sorin', job_title: 'Tehnician HVAC', department: 'Mentenanță', cor_code: '7127', employment_type: 'full_time', employment_start_date: '2019-04-10' },
  { full_name: 'Vlad Constantin', job_title: 'Muncitor Întreținere Generală', department: 'Mentenanță', cor_code: '9329', employment_type: 'full_time', employment_start_date: '2020-03-05' },
]

// ============================================================
// FIȘE MEDICALE (45 angajați - controale diverse)
// ============================================================

export const demoMedicalExaminationsHotel: Partial<MedicalExamination>[] = [
  // ADMINISTRAȚIE (5)
  { employee_name: 'Marinescu Alexandra', job_title: 'Director General', examination_type: 'periodic', examination_date: '2024-11-10', expiry_date: '2025-11-10', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța' },
  { employee_name: 'Popescu Victor', job_title: 'Director Operațiuni', examination_type: 'periodic', examination_date: '2024-10-15', expiry_date: '2025-10-15', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța' },
  { employee_name: 'Ionescu Claudia', job_title: 'Manager Resurse Umane', examination_type: 'periodic', examination_date: '2024-09-20', expiry_date: '2025-09-20', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța' },
  { employee_name: 'Dumitrescu Adrian', job_title: 'Contabil Șef', examination_type: 'periodic', examination_date: '2024-08-25', expiry_date: '2025-08-25', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța' },
  { employee_name: 'Georgescu Elena', job_title: 'Inspector SSM & PSI', examination_type: 'periodic', examination_date: '2025-01-10', expiry_date: '2026-01-10', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța' },

  // RECEPȚIE (8)
  { employee_name: 'Stancu Maria', job_title: 'Manager Recepție', examination_type: 'periodic', examination_date: '2024-11-05', expiry_date: '2025-11-05', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța' },
  { employee_name: 'Popa Ana', job_title: 'Recepționer Șef de Tură', examination_type: 'periodic', examination_date: '2024-10-20', expiry_date: '2025-10-20', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța' },
  { employee_name: 'Radu Ioana', job_title: 'Recepționer', examination_type: 'periodic', examination_date: '2024-09-15', expiry_date: '2025-09-15', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța' },
  { employee_name: 'Constantin Mihai', job_title: 'Recepționer', examination_type: 'periodic', examination_date: '2024-12-10', expiry_date: '2025-12-10', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța' },
  { employee_name: 'Dragomir Andreea', job_title: 'Recepționer', examination_type: 'periodic', examination_date: '2025-01-15', expiry_date: '2026-01-15', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța' },
  { employee_name: 'Munteanu Cristina', job_title: 'Recepționer Night Audit', examination_type: 'periodic', examination_date: '2024-11-20', expiry_date: '2025-11-20', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța' },
  { employee_name: 'Florea Gabriel', job_title: 'Concierge', examination_type: 'periodic', examination_date: '2024-10-05', expiry_date: '2025-10-05', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța' },
  { employee_name: 'Tudor Vlad', job_title: 'Portbagaj', examination_type: 'periodic', examination_date: '2024-12-20', expiry_date: '2025-12-20', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța' },

  // HOUSEKEEPING (12) - Efort fizic + substanțe chimice
  { employee_name: 'Vasile Monica', job_title: 'Guvernantă Șefă', examination_type: 'periodic', examination_date: '2024-11-15', expiry_date: '2025-11-15', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța', restrictions: 'Control anual suplimentar - expunere substanțe chimice' },
  { employee_name: 'Stoica Carmen', job_title: 'Guvernantă de Etaj', examination_type: 'periodic', examination_date: '2024-10-10', expiry_date: '2025-10-10', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța' },
  { employee_name: 'Barbu Daniela', job_title: 'Cameristă', examination_type: 'periodic', examination_date: '2024-09-25', expiry_date: '2025-09-25', result: 'apt_conditionat', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța', restrictions: 'Evitare transport greutăți >15kg' },
  { employee_name: 'Nistor Laura', job_title: 'Cameristă', examination_type: 'periodic', examination_date: '2024-11-25', expiry_date: '2025-11-25', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța' },
  { employee_name: 'Matei Nicoleta', job_title: 'Cameristă', examination_type: 'periodic', examination_date: '2024-12-05', expiry_date: '2025-12-05', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța' },
  { employee_name: 'Ciobanu Alina', job_title: 'Cameristă', examination_type: 'periodic', examination_date: '2025-01-20', expiry_date: '2026-01-20', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța' },
  { employee_name: 'Ene Gabriela', job_title: 'Cameristă', examination_type: 'periodic', examination_date: '2024-10-30', expiry_date: '2025-10-30', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța' },
  { employee_name: 'Lungu Mihaela', job_title: 'Cameristă', examination_type: 'periodic', examination_date: '2024-11-12', expiry_date: '2025-11-12', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța' },
  { employee_name: 'Sandu Roxana', job_title: 'Cameristă', examination_type: 'periodic', examination_date: '2024-12-15', expiry_date: '2025-12-15', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța' },
  { employee_name: 'Diaconu Ionela', job_title: 'Lingerie Attendant', examination_type: 'periodic', examination_date: '2024-09-18', expiry_date: '2025-09-18', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța' },
  { employee_name: 'Oprea Florentina', job_title: 'Îngrijitor Spații Publice', examination_type: 'periodic', examination_date: '2024-10-22', expiry_date: '2025-10-22', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța' },
  { employee_name: 'Badea Viorica', job_title: 'Îngrijitor Spații Publice', examination_type: 'periodic', examination_date: '2024-11-08', expiry_date: '2025-11-08', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța' },

  // RESTAURANT & BAR (10) - OBLIGATORIU anual (manipulare alimente)
  { employee_name: 'Enache Robert', job_title: 'Manager F&B', examination_type: 'periodic', examination_date: '2024-11-01', expiry_date: '2025-11-01', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța', restrictions: 'Control trimestrial bacteriologic (HACCP)' },
  { employee_name: 'Preda Stefan', job_title: 'Șef Bucătar', examination_type: 'periodic', examination_date: '2024-10-25', expiry_date: '2025-10-25', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța', restrictions: 'Control trimestrial bacteriologic (HACCP)' },
  { employee_name: 'Tanase Marian', job_title: 'Sous Chef', examination_type: 'periodic', examination_date: '2024-11-18', expiry_date: '2025-11-18', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța', restrictions: 'Control trimestrial bacteriologic (HACCP)' },
  { employee_name: 'Zamfir Cosmin', job_title: 'Bucătar', examination_type: 'periodic', examination_date: '2024-12-02', expiry_date: '2025-12-02', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța', restrictions: 'Control trimestrial bacteriologic (HACCP)' },
  { employee_name: 'Neagu Bogdan', job_title: 'Bucătar', examination_type: 'periodic', examination_date: '2025-01-08', expiry_date: '2026-01-08', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța', restrictions: 'Control trimestrial bacteriologic (HACCP)' },
  { employee_name: 'Lazar Dumitru', job_title: 'Bucătar Rece/Patiser', examination_type: 'periodic', examination_date: '2024-10-12', expiry_date: '2025-10-12', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța', restrictions: 'Control trimestrial bacteriologic (HACCP)' },
  { employee_name: 'Rusu Diana', job_title: 'Ospătar Șef', examination_type: 'periodic', examination_date: '2024-11-22', expiry_date: '2025-11-22', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța', restrictions: 'Control semestrial bacteriologic' },
  { employee_name: 'Filip Andreea', job_title: 'Ospătar', examination_type: 'periodic', examination_date: '2024-12-18', expiry_date: '2025-12-18', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța', restrictions: 'Control semestrial bacteriologic' },
  { employee_name: 'Simion George', job_title: 'Ospătar', examination_type: 'periodic', examination_date: '2025-01-12', expiry_date: '2026-01-12', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța', restrictions: 'Control semestrial bacteriologic' },
  { employee_name: 'Mocanu Cristian', job_title: 'Barman', examination_type: 'periodic', examination_date: '2024-11-28', expiry_date: '2025-11-28', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța', restrictions: 'Control semestrial bacteriologic' },

  // SPA & WELLNESS (5)
  { employee_name: 'Anton Raluca', job_title: 'Manager Spa', examination_type: 'periodic', examination_date: '2024-10-08', expiry_date: '2025-10-08', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța' },
  { employee_name: 'Cojocaru Ioana', job_title: 'Terapeut Spa', examination_type: 'periodic', examination_date: '2024-11-14', expiry_date: '2025-11-14', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța', restrictions: 'Control musculo-scheletic anual (efort fizic)' },
  { employee_name: 'Croitoru Elena', job_title: 'Terapeut Spa', examination_type: 'periodic', examination_date: '2024-12-10', expiry_date: '2025-12-10', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța', restrictions: 'Control musculo-scheletic anual (efort fizic)' },
  { employee_name: 'Manole Adriana', job_title: 'Maseur Medical', examination_type: 'periodic', examination_date: '2024-09-30', expiry_date: '2025-09-30', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța', restrictions: 'Control musculo-scheletic anual (efort fizic)' },
  { employee_name: 'Avram Cosmina', job_title: 'Recepționer Spa', examination_type: 'periodic', examination_date: '2024-10-16', expiry_date: '2025-10-16', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța' },

  // MENTENANȚĂ (5) - Riscuri electrice, chimice, fizice
  { employee_name: 'Voicu Daniel', job_title: 'Șef Mentenanță', examination_type: 'periodic', examination_date: '2024-11-06', expiry_date: '2025-11-06', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța' },
  { employee_name: 'Dobre Ionut', job_title: 'Tehnician Electrician', examination_type: 'periodic', examination_date: '2024-10-18', expiry_date: '2025-10-18', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța', restrictions: 'Autorizat lucru tensiune - control cardiologic anual' },
  { employee_name: 'Iordache Marius', job_title: 'Tehnician Instalator', examination_type: 'periodic', examination_date: '2024-11-24', expiry_date: '2025-11-24', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța', restrictions: 'Lucru înălțime - control vestibular anual' },
  { employee_name: 'Gheorghiu Sorin', job_title: 'Tehnician HVAC', examination_type: 'periodic', examination_date: '2024-12-12', expiry_date: '2025-12-12', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța', restrictions: 'Expunere freon - control pulmonar anual' },
  { employee_name: 'Vlad Constantin', job_title: 'Muncitor Întreținere Generală', examination_type: 'periodic', examination_date: '2025-01-05', expiry_date: '2026-01-05', result: 'apt', doctor_name: 'Dr. Mihai Popescu', clinic_name: 'Clinica MedWork Constanța' },
]

// ============================================================
// ECHIPAMENTE PSI (44 total)
// ============================================================
// HOTEL = RISC PSI RIDICAT
// - Bucătărie: foc deschis, ulei, grăsimi
// - Cazare: flux mare public, persoane care dorm
// - Echipamente obligatorii: stingătoare, hidranți, detectoare fum, plan evacuare
// ============================================================

export const demoSafetyEquipmentHotel: Partial<SafetyEquipment>[] = [
  // ── STINGĂTOARE (38) - repartizate pe toate etajele și zonele ──

  // PARTER - Zone Publice (8)
  { equipment_type: 'stingator', description: 'Stingător P6 (6kg pulbere ABC)', location: 'Hol principal recepție', serial_number: 'ST-P01-2024', last_inspection_date: '2024-09-15', expiry_date: '2025-09-15', next_inspection_date: '2025-03-15', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător P6 (6kg pulbere ABC)', location: 'Hol acces restaurant', serial_number: 'ST-P02-2024', last_inspection_date: '2024-09-15', expiry_date: '2025-09-15', next_inspection_date: '2025-03-15', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător P6 (6kg pulbere ABC)', location: 'Lobby bar', serial_number: 'ST-P03-2024', last_inspection_date: '2024-09-15', expiry_date: '2025-09-15', next_inspection_date: '2025-03-15', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător CO2 5kg', location: 'Sala conferințe A', serial_number: 'ST-P04-2024', last_inspection_date: '2024-09-15', expiry_date: '2025-09-15', next_inspection_date: '2025-03-15', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător CO2 5kg', location: 'Sala conferințe B', serial_number: 'ST-P05-2024', last_inspection_date: '2024-09-15', expiry_date: '2025-09-15', next_inspection_date: '2025-03-15', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător P6 (6kg pulbere ABC)', location: 'Acces spa & wellness', serial_number: 'ST-P06-2024', last_inspection_date: '2024-09-15', expiry_date: '2025-09-15', next_inspection_date: '2025-03-15', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător P6 (6kg pulbere ABC)', location: 'Hol acces parcare subterană', serial_number: 'ST-P07-2024', last_inspection_date: '2024-09-15', expiry_date: '2025-09-15', next_inspection_date: '2025-03-15', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător P6 (6kg pulbere ABC)', location: 'Zona administrativă', serial_number: 'ST-P08-2024', last_inspection_date: '2024-09-15', expiry_date: '2025-09-15', next_inspection_date: '2025-03-15', inspector_name: 'SC FireGuard SRL', is_compliant: true },

  // BUCĂTĂRIE & RESTAURANT (6) - risc ridicat foc
  { equipment_type: 'stingator', description: 'Stingător K6 Special Bucătărie (grăsimi)', location: 'Bucătărie zona gătit', serial_number: 'ST-B01-2024', last_inspection_date: '2024-10-01', expiry_date: '2025-10-01', next_inspection_date: '2025-04-01', inspector_name: 'SC FireGuard SRL', is_compliant: true, notes: 'Obligatoriu pentru bucătării profesionale - combate incendii ulei/grăsimi' },
  { equipment_type: 'stingator', description: 'Stingător K6 Special Bucătărie (grăsimi)', location: 'Bucătărie zona prăjit', serial_number: 'ST-B02-2024', last_inspection_date: '2024-10-01', expiry_date: '2025-10-01', next_inspection_date: '2025-04-01', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător CO2 5kg', location: 'Bucătărie zona echipamente electrice', serial_number: 'ST-B03-2024', last_inspection_date: '2024-10-01', expiry_date: '2025-10-01', next_inspection_date: '2025-04-01', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător P6 (6kg pulbere ABC)', location: 'Restaurant sala mare', serial_number: 'ST-R01-2024', last_inspection_date: '2024-09-15', expiry_date: '2025-09-15', next_inspection_date: '2025-03-15', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător P6 (6kg pulbere ABC)', location: 'Restaurant terasă interioară', serial_number: 'ST-R02-2024', last_inspection_date: '2024-09-15', expiry_date: '2025-09-15', next_inspection_date: '2025-03-15', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător CO2 5kg', location: 'Bar zona echipamente', serial_number: 'ST-R03-2024', last_inspection_date: '2024-09-15', expiry_date: '2025-09-15', next_inspection_date: '2025-03-15', inspector_name: 'SC FireGuard SRL', is_compliant: true },

  // ETAJUL 1 - Camere (6)
  { equipment_type: 'stingator', description: 'Stingător P6 (6kg pulbere ABC)', location: 'Etaj 1 hol central', serial_number: 'ST-E101-2024', last_inspection_date: '2024-09-20', expiry_date: '2025-09-20', next_inspection_date: '2025-03-20', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător P6 (6kg pulbere ABC)', location: 'Etaj 1 aripă vest', serial_number: 'ST-E102-2024', last_inspection_date: '2024-09-20', expiry_date: '2025-09-20', next_inspection_date: '2025-03-20', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător P6 (6kg pulbere ABC)', location: 'Etaj 1 aripă est', serial_number: 'ST-E103-2024', last_inspection_date: '2024-09-20', expiry_date: '2025-09-20', next_inspection_date: '2025-03-20', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător P6 (6kg pulbere ABC)', location: 'Etaj 1 zona office (etaj tehnic)', serial_number: 'ST-E104-2024', last_inspection_date: '2024-09-20', expiry_date: '2025-09-20', next_inspection_date: '2025-03-20', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător P6 (6kg pulbere ABC)', location: 'Etaj 1 zona lenjerie', serial_number: 'ST-E105-2024', last_inspection_date: '2024-09-20', expiry_date: '2025-09-20', next_inspection_date: '2025-03-20', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător CO2 5kg', location: 'Etaj 1 hol ascensor', serial_number: 'ST-E106-2024', last_inspection_date: '2024-09-20', expiry_date: '2025-09-20', next_inspection_date: '2025-03-20', inspector_name: 'SC FireGuard SRL', is_compliant: true },

  // ETAJUL 2 - Camere (6)
  { equipment_type: 'stingator', description: 'Stingător P6 (6kg pulbere ABC)', location: 'Etaj 2 hol central', serial_number: 'ST-E201-2024', last_inspection_date: '2024-09-20', expiry_date: '2025-09-20', next_inspection_date: '2025-03-20', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător P6 (6kg pulbere ABC)', location: 'Etaj 2 aripă vest', serial_number: 'ST-E202-2024', last_inspection_date: '2024-09-20', expiry_date: '2025-09-20', next_inspection_date: '2025-03-20', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător P6 (6kg pulbere ABC)', location: 'Etaj 2 aripă est', serial_number: 'ST-E203-2024', last_inspection_date: '2024-09-20', expiry_date: '2025-09-20', next_inspection_date: '2025-03-20', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător P6 (6kg pulbere ABC)', location: 'Etaj 2 zona office (etaj tehnic)', serial_number: 'ST-E204-2024', last_inspection_date: '2024-09-20', expiry_date: '2025-09-20', next_inspection_date: '2025-03-20', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător P6 (6kg pulbere ABC)', location: 'Etaj 2 zona lenjerie', serial_number: 'ST-E205-2024', last_inspection_date: '2024-09-20', expiry_date: '2025-09-20', next_inspection_date: '2025-03-20', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător CO2 5kg', location: 'Etaj 2 hol ascensor', serial_number: 'ST-E206-2024', last_inspection_date: '2024-09-20', expiry_date: '2025-09-20', next_inspection_date: '2025-03-20', inspector_name: 'SC FireGuard SRL', is_compliant: true },

  // ETAJUL 3 - Camere (6)
  { equipment_type: 'stingator', description: 'Stingător P6 (6kg pulbere ABC)', location: 'Etaj 3 hol central', serial_number: 'ST-E301-2024', last_inspection_date: '2024-09-20', expiry_date: '2025-09-20', next_inspection_date: '2025-03-20', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător P6 (6kg pulbere ABC)', location: 'Etaj 3 aripă vest', serial_number: 'ST-E302-2024', last_inspection_date: '2024-09-20', expiry_date: '2025-09-20', next_inspection_date: '2025-03-20', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător P6 (6kg pulbere ABC)', location: 'Etaj 3 aripă est', serial_number: 'ST-E303-2024', last_inspection_date: '2024-09-20', expiry_date: '2025-09-20', next_inspection_date: '2025-03-20', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător P6 (6kg pulbere ABC)', location: 'Etaj 3 zona office (etaj tehnic)', serial_number: 'ST-E304-2024', last_inspection_date: '2024-09-20', expiry_date: '2025-09-20', next_inspection_date: '2025-03-20', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător P6 (6kg pulbere ABC)', location: 'Etaj 3 zona lenjerie', serial_number: 'ST-E305-2024', last_inspection_date: '2024-09-20', expiry_date: '2025-09-20', next_inspection_date: '2025-03-20', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător CO2 5kg', location: 'Etaj 3 hol ascensor', serial_number: 'ST-E306-2024', last_inspection_date: '2024-09-20', expiry_date: '2025-09-20', next_inspection_date: '2025-03-20', inspector_name: 'SC FireGuard SRL', is_compliant: true },

  // ZONE TEHNICE (4)
  { equipment_type: 'stingator', description: 'Stingător CO2 5kg', location: 'Sala servere & IT', serial_number: 'ST-TH01-2024', last_inspection_date: '2024-09-15', expiry_date: '2025-09-15', next_inspection_date: '2025-03-15', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător P6 (6kg pulbere ABC)', location: 'Centrală termică', serial_number: 'ST-TH02-2024', last_inspection_date: '2024-09-15', expiry_date: '2025-09-15', next_inspection_date: '2025-03-15', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător CO2 5kg', location: 'Grup electrogen', serial_number: 'ST-TH03-2024', last_inspection_date: '2024-09-15', expiry_date: '2025-09-15', next_inspection_date: '2025-03-15', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător P6 (6kg pulbere ABC)', location: 'Depozit mentenanță', serial_number: 'ST-TH04-2024', last_inspection_date: '2024-09-15', expiry_date: '2025-09-15', next_inspection_date: '2025-03-15', inspector_name: 'SC FireGuard SRL', is_compliant: true },

  // SPA & WELLNESS (2)
  { equipment_type: 'stingator', description: 'Stingător P6 (6kg pulbere ABC)', location: 'Spa zona recepție', serial_number: 'ST-SP01-2024', last_inspection_date: '2024-09-15', expiry_date: '2025-09-15', next_inspection_date: '2025-03-15', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'stingator', description: 'Stingător CO2 5kg', location: 'Spa zona saună & echipamente', serial_number: 'ST-SP02-2024', last_inspection_date: '2024-09-15', expiry_date: '2025-09-15', next_inspection_date: '2025-03-15', inspector_name: 'SC FireGuard SRL', is_compliant: true },

  // ── HIDRANȚI INTERIORI (6) ──
  { equipment_type: 'hidrant', description: 'Hidrant interior DN25 cu furtun 30m', location: 'Parter hol principal', serial_number: 'HI-P01-2023', last_inspection_date: '2024-10-10', expiry_date: '2025-10-10', next_inspection_date: '2025-04-10', inspector_name: 'SC FireGuard SRL', is_compliant: true, notes: 'Control presiune semestrial obligatoriu' },
  { equipment_type: 'hidrant', description: 'Hidrant interior DN25 cu furtun 30m', location: 'Etaj 1 hol central', serial_number: 'HI-E101-2023', last_inspection_date: '2024-10-10', expiry_date: '2025-10-10', next_inspection_date: '2025-04-10', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'hidrant', description: 'Hidrant interior DN25 cu furtun 30m', location: 'Etaj 2 hol central', serial_number: 'HI-E201-2023', last_inspection_date: '2024-10-10', expiry_date: '2025-10-10', next_inspection_date: '2025-04-10', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'hidrant', description: 'Hidrant interior DN25 cu furtun 30m', location: 'Etaj 3 hol central', serial_number: 'HI-E301-2023', last_inspection_date: '2024-10-10', expiry_date: '2025-10-10', next_inspection_date: '2025-04-10', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'hidrant', description: 'Hidrant interior DN25 cu furtun 30m', location: 'Bucătărie acces principal', serial_number: 'HI-B01-2023', last_inspection_date: '2024-10-10', expiry_date: '2025-10-10', next_inspection_date: '2025-04-10', inspector_name: 'SC FireGuard SRL', is_compliant: true },
  { equipment_type: 'hidrant', description: 'Hidrant interior DN25 cu furtun 30m', location: 'Parcare subterană', serial_number: 'HI-PS01-2023', last_inspection_date: '2024-10-10', expiry_date: '2025-10-10', next_inspection_date: '2025-04-10', inspector_name: 'SC FireGuard SRL', is_compliant: true },
]

// ============================================================
// INSTRUIRI PSI & SSM (semestriale obligatorii hotel)
// ============================================================

export const demoTrainingSessionsHotel: Partial<TrainingSession>[] = [
  // ── INSTRUIRE PSI SEMESTRIALĂ IANUARIE 2025 (obligatoriu tot personalul) ──
  {
    training_type: 'psi',
    title: 'Instruire PSI Semestrială - Semestrul I 2025',
    description: 'Instruire obligatorie PSI pentru tot personalul hotelului: risc incendiu ridicat (bucătărie, cazare, flux public mare). Cuprinde: utilizare stingătoare, hidranți, plan evacuare, alarmare, rol fiecare angajat.',
    instructor_name: 'Ing. Georgescu Elena (Inspector SSM & PSI)',
    start_date: '2025-01-20',
    end_date: '2025-01-20',
    duration_hours: 3,
    location: 'Sala conferințe A - Grand Hotel Panoramic',
    max_participants: 25,
    status: 'completed',
    completion_percentage: 100,
    notes: 'Instruire teorie 1.5h + practică stingătoare 1.5h. Toți participanții prezenți. Test final susținut cu succes.'
  },
  {
    training_type: 'psi',
    title: 'Instruire PSI Semestrială - Semestrul I 2025 (Grupa 2)',
    description: 'Instruire obligatorie PSI - grupa 2 (personal ture noapte & part-time). Aceleași teme: stingătoare, hidranți, plan evacuare, alarmare.',
    instructor_name: 'Ing. Georgescu Elena (Inspector SSM & PSI)',
    start_date: '2025-01-22',
    end_date: '2025-01-22',
    duration_hours: 3,
    location: 'Sala conferințe A - Grand Hotel Panoramic',
    max_participants: 20,
    status: 'completed',
    completion_percentage: 100,
    notes: 'Instruire teorie + practică. Participare 100%.'
  },

  // ── INSTRUIRE HACCP BUCĂTĂRIE FEBRUARIE 2025 (obligatoriu manipulatori alimente) ──
  {
    training_type: 'ssm',
    title: 'Instruire HACCP - Igienă Alimentară & Securitate Alimente',
    description: 'Instruire obligatorie pentru tot personalul bucătărie & restaurant. Teme: principii HACCP, igienă personală, temperaturi critice, contaminare încrucișată, depozitare alimente, curățenie & dezinfecție.',
    instructor_name: 'Dr. Andrei Cristescu (Medic Specialist Igienă Alimentară)',
    start_date: '2025-02-05',
    end_date: '2025-02-05',
    duration_hours: 4,
    location: 'Sala conferințe B - Grand Hotel Panoramic',
    max_participants: 15,
    status: 'completed',
    completion_percentage: 100,
    notes: 'Instruire HACCP conform ANSVSA. Toți bucătarii și ospătarii prezenți. Certificat eliberat.'
  },

  // ── INSTRUIRE SSM GENERAL MARTIE 2025 (tot personalul) ──
  {
    training_type: 'ssm',
    title: 'Instruire SSM Periodică - Semestrul I 2025',
    description: 'Instruire periodică SSM pentru tot personalul: identificare riscuri hotel, EIP-uri obligatorii, prevenire accidente, ergonomie, substanțe chimice curățenie, ergonomie mișcare greutăți (housekeeping), prim ajutor.',
    instructor_name: 'Ing. Georgescu Elena (Inspector SSM & PSI)',
    start_date: '2025-03-10',
    end_date: '2025-03-10',
    duration_hours: 2,
    location: 'Sala conferințe A - Grand Hotel Panoramic',
    max_participants: 25,
    status: 'scheduled',
    completion_percentage: 0,
    notes: 'Instruire programată semestrial. Participare obligatorie.'
  },
  {
    training_type: 'ssm',
    title: 'Instruire SSM Periodică - Semestrul I 2025 (Grupa 2)',
    description: 'Instruire SSM - grupa 2 (personal ture noapte & part-time).',
    instructor_name: 'Ing. Georgescu Elena (Inspector SSM & PSI)',
    start_date: '2025-03-12',
    end_date: '2025-03-12',
    duration_hours: 2,
    location: 'Sala conferințe A - Grand Hotel Panoramic',
    max_participants: 20,
    status: 'scheduled',
    completion_percentage: 0,
    notes: 'Instruire programată semestrial.'
  },

  // ── INSTRUIRE PRIM AJUTOR (personal selectat) ──
  {
    training_type: 'prim_ajutor',
    title: 'Curs Prim Ajutor - Personal Cheie Hotel',
    description: 'Instruire prim ajutor pentru personalul cheie (manageri, recepție, spa, mentenanță): resuscitare cardio-pulmonară, stopare hemoragii, fracturi, arsuri, șoc, utilizare DEA (defibrilator extern automat).',
    instructor_name: 'Paramedic Marius Dumitrescu (SMURD Constanța)',
    start_date: '2025-02-15',
    end_date: '2025-02-15',
    duration_hours: 6,
    location: 'Sala conferințe B - Grand Hotel Panoramic',
    max_participants: 15,
    status: 'completed',
    completion_percentage: 100,
    notes: 'Curs certificat Crucea Roșie. 12 participanți au obținut certificat prim ajutor valabil 2 ani.'
  },

  // ── INSTRUIRE SPECIFICĂ MENTENANȚĂ (lucru înălțime, tensiune) ──
  {
    training_type: 'ssm',
    title: 'Instruire SSM Specifică - Lucru la Înălțime & Tensiune',
    description: 'Instruire specializată pentru personalul mentenanță: lucru la înălțime (scări, nacele), lucru sub tensiune, EIP specific, proceduri de blocare/etichetare (LOTO), intervenții urgențe.',
    instructor_name: 'Ing. Adrian Vasile (Consultant SSM Extern)',
    start_date: '2025-01-28',
    end_date: '2025-01-28',
    duration_hours: 4,
    location: 'Depozit mentenanță - Grand Hotel Panoramic',
    max_participants: 5,
    status: 'completed',
    completion_percentage: 100,
    notes: 'Instruire specifică + practică. Toți tehnicienii au susținut testul cu succes.'
  },
]

// ============================================================
// DOCUMENTE GENERATE
// ============================================================

export const demoDocumentsHotel: Partial<GeneratedDocument>[] = [
  {
    document_type: 'fisa_instruire',
    file_name: 'Instruire_PSI_Semestrială_Ian2025_Grupa1.pdf',
    storage_path: 'organizations/grand-hotel-panoramic/trainings/2025-01-20-psi-grupa1.pdf',
    file_size_bytes: 245000,
    content_version: 1,
    legal_basis_version: 'PSI-2024-RO',
    is_locked: true,
    generation_context: { training_type: 'psi', participants: 25, date: '2025-01-20' }
  },
  {
    document_type: 'fisa_instruire',
    file_name: 'Instruire_PSI_Semestrială_Ian2025_Grupa2.pdf',
    storage_path: 'organizations/grand-hotel-panoramic/trainings/2025-01-22-psi-grupa2.pdf',
    file_size_bytes: 198000,
    content_version: 1,
    legal_basis_version: 'PSI-2024-RO',
    is_locked: true,
    generation_context: { training_type: 'psi', participants: 20, date: '2025-01-22' }
  },
  {
    document_type: 'fisa_instruire',
    file_name: 'Instruire_HACCP_Feb2025.pdf',
    storage_path: 'organizations/grand-hotel-panoramic/trainings/2025-02-05-haccp.pdf',
    file_size_bytes: 312000,
    content_version: 1,
    legal_basis_version: 'HACCP-ANSVSA-2024',
    is_locked: true,
    generation_context: { training_type: 'haccp', participants: 15, date: '2025-02-05' }
  },
  {
    document_type: 'fisa_instruire',
    file_name: 'Curs_Prim_Ajutor_Feb2025.pdf',
    storage_path: 'organizations/grand-hotel-panoramic/trainings/2025-02-15-prim-ajutor.pdf',
    file_size_bytes: 428000,
    content_version: 1,
    legal_basis_version: 'SSM-2024-RO',
    is_locked: true,
    generation_context: { training_type: 'prim_ajutor', participants: 12, certified: 12, date: '2025-02-15' }
  },
  {
    document_type: 'raport_conformitate',
    file_name: 'Plan_Evacuare_Hotel_2025.pdf',
    storage_path: 'organizations/grand-hotel-panoramic/psi/plan-evacuare-2025.pdf',
    file_size_bytes: 1850000,
    content_version: 2,
    legal_basis_version: 'PSI-2024-RO',
    is_locked: true,
    generation_context: { document_type: 'plan_evacuare', floors: 4, exits: 8, capacity: 180 }
  },
  {
    document_type: 'raport_conformitate',
    file_name: 'Raport_Echipamente_PSI_Sept2024.pdf',
    storage_path: 'organizations/grand-hotel-panoramic/psi/raport-echipamente-sept-2024.pdf',
    file_size_bytes: 512000,
    content_version: 1,
    legal_basis_version: 'PSI-2024-RO',
    is_locked: true,
    generation_context: { inspection_date: '2024-09-15', total_equipment: 44, compliant: 44, non_compliant: 0 }
  },
]

// ============================================================
// EXPORT COMPLET
// ============================================================

export const demoDataHotel = {
  organization: demoOrganizationHotel,
  employees: demoEmployeesHotel,
  medicalExaminations: demoMedicalExaminationsHotel,
  safetyEquipment: demoSafetyEquipmentHotel,
  trainingSessions: demoTrainingSessionsHotel,
  documents: demoDocumentsHotel,
}
