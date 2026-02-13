// ============================================================
// S-S-M.RO — DATE DEMO FIRMĂ CONSTRUCȚII
// File: lib/data/demo-data-construction.ts
// ============================================================
// Firma: BuildMax SRL
// Profil: 80 angajați, lucrări construcții civile și industriale
// Departamente: 6 (Șantier Nord, Șantier Sud, Șantier Est, Utilaje, Transport, Administrativ)
// Șantiere active: 3 (Complex rezidențial Nord, Hală industrială Sud, Pod rutier Est)
// ============================================================

import type { Organization, MedicalExamination, SafetyEquipment, GeneratedDocument } from '@/lib/types'
import type { TrainingSession, TrainingAssignment } from '@/lib/training-types'

// ============================================================
// ORGANIZAȚIE
// ============================================================

export const demoOrganizationConstruction: Partial<Organization> = {
  name: 'BuildMax SRL',
  cui: 'RO35678901',
  address: 'Calea Bucureștilor nr. 120, 077190 Voluntari, Ilfov',
  county: 'Ilfov',
  contact_email: 'office@buildmax.ro',
  contact_phone: '+40 21 456 7890',
  data_completeness: 82,
  employee_count: 80,
  exposure_score: 'ridicat',
  preferred_channels: ['email', 'sms', 'whatsapp'],
  cooperation_status: 'active'
}

// ============================================================
// ANGAJAȚI (80)
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

export const demoEmployeesConstruction: Partial<DemoEmployee>[] = [
  // ── MANAGEMENT (5) ──
  { full_name: 'Popescu Dan', job_title: 'Director General', department: 'Administrativ', cor_code: '1120', employment_type: 'full_time', employment_start_date: '2012-01-15' },
  { full_name: 'Ionescu Andrei', job_title: 'Director Tehnic', department: 'Administrativ', cor_code: '1321', employment_type: 'full_time', employment_start_date: '2013-03-20' },
  { full_name: 'Georgescu Elena', job_title: 'Director Financiar', department: 'Administrativ', cor_code: '1211', employment_type: 'full_time', employment_start_date: '2014-06-10' },
  { full_name: 'Dumitrescu Mihai', job_title: 'Manager Proiecte', department: 'Administrativ', cor_code: '1323', employment_type: 'full_time', employment_start_date: '2015-09-01' },
  { full_name: 'Stancu Carmen', job_title: 'Manager HR & SSM', department: 'Administrativ', cor_code: '1212', employment_type: 'full_time', employment_start_date: '2016-02-15' },

  // ── ȘANTIER NORD - Complex Rezidențial (25 angajați) ──
  { full_name: 'Munteanu Ion', job_title: 'Șef Șantier', department: 'Șantier Nord', cor_code: '3123', employment_type: 'full_time', employment_start_date: '2017-04-10' },
  { full_name: 'Popa Vasile', job_title: 'Inginer Șantier', department: 'Șantier Nord', cor_code: '2142', employment_type: 'full_time', employment_start_date: '2018-05-20' },
  { full_name: 'Constantinescu Adrian', job_title: 'Maistru Constructor', department: 'Șantier Nord', cor_code: '3123', employment_type: 'full_time', employment_start_date: '2018-08-15' },
  { full_name: 'Radu Gheorghe', job_title: 'Fierar-betonist', department: 'Șantier Nord', cor_code: '7112', employment_type: 'full_time', employment_start_date: '2019-03-01' },
  { full_name: 'Florea Constantin', job_title: 'Fierar-betonist', department: 'Șantier Nord', cor_code: '7112', employment_type: 'full_time', employment_start_date: '2019-03-01' },
  { full_name: 'Marinescu Marius', job_title: 'Fierar-betonist', department: 'Șantier Nord', cor_code: '7112', employment_type: 'full_time', employment_start_date: '2019-06-15' },
  { full_name: 'Tudor Cristian', job_title: 'Fierar-betonist', department: 'Șantier Nord', cor_code: '7112', employment_type: 'full_time', employment_start_date: '2020-01-20' },
  { full_name: 'Ciobanu Daniel', job_title: 'Zidar', department: 'Șantier Nord', cor_code: '7122', employment_type: 'full_time', employment_start_date: '2019-07-10' },
  { full_name: 'Nistor Alexandru', job_title: 'Zidar', department: 'Șantier Nord', cor_code: '7122', employment_type: 'full_time', employment_start_date: '2019-07-10' },
  { full_name: 'Barbu Ionuț', job_title: 'Zidar', department: 'Șantier Nord', cor_code: '7122', employment_type: 'full_time', employment_start_date: '2020-02-05' },
  { full_name: 'Vlad Robert', job_title: 'Zidar', department: 'Șantier Nord', cor_code: '7122', employment_type: 'full_time', employment_start_date: '2020-04-15' },
  { full_name: 'Ene Marian', job_title: 'Zidar', department: 'Șantier Nord', cor_code: '7122', employment_type: 'full_time', employment_start_date: '2020-08-01' },
  { full_name: 'Matei Gabriel', job_title: 'Tencuitor', department: 'Șantier Nord', cor_code: '7131', employment_type: 'full_time', employment_start_date: '2021-01-10' },
  { full_name: 'Dumitrescu Sorin', job_title: 'Tencuitor', department: 'Șantier Nord', cor_code: '7131', employment_type: 'full_time', employment_start_date: '2021-01-10' },
  { full_name: 'Stoica Bogdan', job_title: 'Tencuitor', department: 'Șantier Nord', cor_code: '7131', employment_type: 'full_time', employment_start_date: '2021-05-20' },
  { full_name: 'Dragomir Claudiu', job_title: 'Faianțar-parchetar', department: 'Șantier Nord', cor_code: '7133', employment_type: 'full_time', employment_start_date: '2021-09-01' },
  { full_name: 'Sandu Florin', job_title: 'Faianțar-parchetar', department: 'Șantier Nord', cor_code: '7133', employment_type: 'full_time', employment_start_date: '2022-01-15' },
  { full_name: 'Badea Gheorghe', job_title: 'Dulgeriu', department: 'Șantier Nord', cor_code: '7115', employment_type: 'full_time', employment_start_date: '2020-06-10' },
  { full_name: 'Lungu Cosmin', job_title: 'Dulgeriu', department: 'Șantier Nord', cor_code: '7115', employment_type: 'full_time', employment_start_date: '2021-03-20' },
  { full_name: 'Croitoru Viorel', job_title: 'Muncitor Necalificat', department: 'Șantier Nord', cor_code: '9313', employment_type: 'full_time', employment_start_date: '2022-07-01' },
  { full_name: 'Gheorghiu Emil', job_title: 'Muncitor Necalificat', department: 'Șantier Nord', cor_code: '9313', employment_type: 'full_time', employment_start_date: '2022-09-15' },
  { full_name: 'Manole Liviu', job_title: 'Muncitor Necalificat', department: 'Șantier Nord', cor_code: '9313', employment_type: 'full_time', employment_start_date: '2023-02-01' },
  { full_name: 'Avram Nicolae', job_title: 'Muncitor Necalificat', department: 'Șantier Nord', cor_code: '9313', employment_type: 'full_time', employment_start_date: '2023-06-10' },
  { full_name: 'Diaconu Stefan', job_title: 'Muncitor Necalificat', department: 'Șantier Nord', cor_code: '9313', employment_type: 'contract', employment_start_date: '2024-01-15' },
  { full_name: 'Oprea Petrică', job_title: 'Muncitor Necalificat', department: 'Șantier Nord', cor_code: '9313', employment_type: 'contract', employment_start_date: '2024-03-20' },

  // ── ȘANTIER SUD - Hală Industrială (20 angajați) ──
  { full_name: 'Voicu Ștefan', job_title: 'Șef Șantier', department: 'Șantier Sud', cor_code: '3123', employment_type: 'full_time', employment_start_date: '2018-02-10' },
  { full_name: 'Dobre Mihail', job_title: 'Inginer Șantier', department: 'Șantier Sud', cor_code: '2142', employment_type: 'full_time', employment_start_date: '2019-01-15' },
  { full_name: 'Iordache Lucian', job_title: 'Maistru Constructor', department: 'Șantier Sud', cor_code: '3123', employment_type: 'full_time', employment_start_date: '2019-05-20' },
  { full_name: 'Preda Victor', job_title: 'Fierar-betonist', department: 'Șantier Sud', cor_code: '7112', employment_type: 'full_time', employment_start_date: '2020-03-01' },
  { full_name: 'Enache Grigore', job_title: 'Fierar-betonist', department: 'Șantier Sud', cor_code: '7112', employment_type: 'full_time', employment_start_date: '2020-03-01' },
  { full_name: 'Tanase Petru', job_title: 'Fierar-betonist', department: 'Șantier Sud', cor_code: '7112', employment_type: 'full_time', employment_start_date: '2020-07-15' },
  { full_name: 'Rusu Aurel', job_title: 'Sudor Construcții Metalice', department: 'Șantier Sud', cor_code: '7212', employment_type: 'full_time', employment_start_date: '2019-09-10' },
  { full_name: 'Neagu Pavel', job_title: 'Sudor Construcții Metalice', department: 'Șantier Sud', cor_code: '7212', employment_type: 'full_time', employment_start_date: '2020-02-20' },
  { full_name: 'Zamfir Dorel', job_title: 'Lăcătuș Construcții Metalice', department: 'Șantier Sud', cor_code: '7214', employment_type: 'full_time', employment_start_date: '2020-06-01' },
  { full_name: 'Cojocaru Silviu', job_title: 'Zidar', department: 'Șantier Sud', cor_code: '7122', employment_type: 'full_time', employment_start_date: '2021-01-10' },
  { full_name: 'Lazar Ioan', job_title: 'Zidar', department: 'Șantier Sud', cor_code: '7122', employment_type: 'full_time', employment_start_date: '2021-01-10' },
  { full_name: 'Simion Dumitru', job_title: 'Zidar', department: 'Șantier Sud', cor_code: '7122', employment_type: 'full_time', employment_start_date: '2021-04-15' },
  { full_name: 'Mocanu Vasile', job_title: 'Montator Construcții Metalice', department: 'Șantier Sud', cor_code: '7214', employment_type: 'full_time', employment_start_date: '2021-08-01' },
  { full_name: 'Filip Adrian', job_title: 'Montator Construcții Metalice', department: 'Șantier Sud', cor_code: '7214', employment_type: 'full_time', employment_start_date: '2021-10-15' },
  { full_name: 'Anton George', job_title: 'Tâmplar Construcții', department: 'Șantier Sud', cor_code: '7115', employment_type: 'full_time', employment_start_date: '2022-02-01' },
  { full_name: 'Dinu Marian', job_title: 'Muncitor Necalificat', department: 'Șantier Sud', cor_code: '9313', employment_type: 'full_time', employment_start_date: '2022-06-10' },
  { full_name: 'Panait Valentin', job_title: 'Muncitor Necalificat', department: 'Șantier Sud', cor_code: '9313', employment_type: 'full_time', employment_start_date: '2022-09-01' },
  { full_name: 'Cristea Bogdan', job_title: 'Muncitor Necalificat', department: 'Șantier Sud', cor_code: '9313', employment_type: 'full_time', employment_start_date: '2023-01-15' },
  { full_name: 'Neacșu Adrian', job_title: 'Muncitor Necalificat', department: 'Șantier Sud', cor_code: '9313', employment_type: 'contract', employment_start_date: '2024-02-01' },
  { full_name: 'Iacob Marius', job_title: 'Muncitor Necalificat', department: 'Șantier Sud', cor_code: '9313', employment_type: 'contract', employment_start_date: '2024-05-10' },

  // ── ȘANTIER EST - Pod Rutier (15 angajați) ──
  { full_name: 'Alexandrescu Tiberiu', job_title: 'Șef Șantier', department: 'Șantier Est', cor_code: '3123', employment_type: 'full_time', employment_start_date: '2019-06-01' },
  { full_name: 'Bălan Radu', job_title: 'Inginer Șantier', department: 'Șantier Est', cor_code: '2142', employment_type: 'full_time', employment_start_date: '2020-02-15' },
  { full_name: 'Costin Mircea', job_title: 'Maistru Constructor', department: 'Șantier Est', cor_code: '3123', employment_type: 'full_time', employment_start_date: '2020-07-01' },
  { full_name: 'Dragnea Florian', job_title: 'Fierar-betonist Poduri', department: 'Șantier Est', cor_code: '7112', employment_type: 'full_time', employment_start_date: '2021-01-10' },
  { full_name: 'Enescu Gabriel', job_title: 'Fierar-betonist Poduri', department: 'Șantier Est', cor_code: '7112', employment_type: 'full_time', employment_start_date: '2021-01-10' },
  { full_name: 'Fărcaș Ionuț', job_title: 'Fierar-betonist Poduri', department: 'Șantier Est', cor_code: '7112', employment_type: 'full_time', employment_start_date: '2021-03-20' },
  { full_name: 'Grigorescu Andrei', job_title: 'Cofrare Poduri', department: 'Șantier Est', cor_code: '7119', employment_type: 'full_time', employment_start_date: '2021-05-15' },
  { full_name: 'Horia Sorin', job_title: 'Cofrare Poduri', department: 'Șantier Est', cor_code: '7119', employment_type: 'full_time', employment_start_date: '2021-08-01' },
  { full_name: 'Ilie Cristian', job_title: 'Montator Cabluri Precompresie', department: 'Șantier Est', cor_code: '7119', employment_type: 'full_time', employment_start_date: '2022-01-10' },
  { full_name: 'Jucan Daniel', job_title: 'Alpinist Utilitar', department: 'Șantier Est', cor_code: '9329', employment_type: 'full_time', employment_start_date: '2022-04-15' },
  { full_name: 'Kerekes László', job_title: 'Alpinist Utilitar', department: 'Șantier Est', cor_code: '9329', employment_type: 'full_time', employment_start_date: '2022-06-20' },
  { full_name: 'Lungu Eduard', job_title: 'Muncitor Necalificat', department: 'Șantier Est', cor_code: '9313', employment_type: 'full_time', employment_start_date: '2023-02-01' },
  { full_name: 'Mihăilescu Robert', job_title: 'Muncitor Necalificat', department: 'Șantier Est', cor_code: '9313', employment_type: 'full_time', employment_start_date: '2023-05-10' },
  { full_name: 'Năstase Viorel', job_title: 'Muncitor Necalificat', department: 'Șantier Est', cor_code: '9313', employment_type: 'contract', employment_start_date: '2024-01-20' },
  { full_name: 'Olteanu Emil', job_title: 'Muncitor Necalificat', department: 'Șantier Est', cor_code: '9313', employment_type: 'contract', employment_start_date: '2024-04-01' },

  // ── UTILAJE ȘI TRANSPORT (10 angajați) ──
  { full_name: 'Pavel Gheorghe', job_title: 'Șef Utilaje', department: 'Utilaje', cor_code: '3123', employment_type: 'full_time', employment_start_date: '2016-08-01' },
  { full_name: 'Rățoi Dumitru', job_title: 'Operator Macara Turnată 25T', department: 'Utilaje', cor_code: '8343', employment_type: 'full_time', employment_start_date: '2017-03-15' },
  { full_name: 'Sava Constantin', job_title: 'Operator Macara Mobilă 50T', department: 'Utilaje', cor_code: '8343', employment_type: 'full_time', employment_start_date: '2018-01-20' },
  { full_name: 'Țurcanu Vasile', job_title: 'Operator Excavator', department: 'Utilaje', cor_code: '8342', employment_type: 'full_time', employment_start_date: '2018-06-10' },
  { full_name: 'Ungureanu Adrian', job_title: 'Operator Buldoexcavator', department: 'Utilaje', cor_code: '8342', employment_type: 'full_time', employment_start_date: '2019-02-15' },
  { full_name: 'Vlădescu Marian', job_title: 'Operator Autobetonieră', department: 'Utilaje', cor_code: '8332', employment_type: 'full_time', employment_start_date: '2019-07-01' },
  { full_name: 'Wagner Klaus', job_title: 'Operator Pompă Beton', department: 'Utilaje', cor_code: '8189', employment_type: 'full_time', employment_start_date: '2020-01-10' },
  { full_name: 'Zanfir Ionuț', job_title: 'Șofer Camion 24T', department: 'Transport', cor_code: '8332', employment_type: 'full_time', employment_start_date: '2019-04-20' },
  { full_name: 'Bădescu Florin', job_title: 'Șofer Camion 12T', department: 'Transport', cor_code: '8332', employment_type: 'full_time', employment_start_date: '2020-09-15' },
  { full_name: 'Cîrlan Gabriel', job_title: 'Operator Stivuitor 3T', department: 'Utilaje', cor_code: '8344', employment_type: 'full_time', employment_start_date: '2021-05-01' },

  // ── ADMINISTRATIV (5 angajați) ──
  { full_name: 'Dinescu Ana', job_title: 'Contabil Șef', department: 'Administrativ', cor_code: '2411', employment_type: 'full_time', employment_start_date: '2015-04-10' },
  { full_name: 'Eftimie Raluca', job_title: 'Inspector SSM', department: 'Administrativ', cor_code: '2149', employment_type: 'full_time', employment_start_date: '2017-09-01' },
  { full_name: 'Gheorghiță Daniela', job_title: 'Inspector Resurse Umane', department: 'Administrativ', cor_code: '2412', employment_type: 'full_time', employment_start_date: '2018-03-15' },
  { full_name: 'Herescu Mihaela', job_title: 'Secretar', department: 'Administrativ', cor_code: '4120', employment_type: 'full_time', employment_start_date: '2019-06-20' },
  { full_name: 'Ispas Ioana', job_title: 'Referent Logistică', department: 'Administrativ', cor_code: '4321', employment_type: 'full_time', employment_start_date: '2020-11-10' }
]

// ============================================================
// EXAMENE MEDICALE (40)
// ============================================================

export const demoMedicalExamsConstruction: Partial<MedicalExamination>[] = [
  // Management
  { employee_name: 'Popescu Dan', job_title: 'Director General', examination_type: 'periodic', examination_date: '2025-10-15', expiry_date: '2026-10-15', result: 'apt', doctor_name: 'Dr. Andreea Popescu', clinic_name: 'Clinica MedWork Voluntari' },
  { employee_name: 'Ionescu Andrei', job_title: 'Director Tehnic', examination_type: 'periodic', examination_date: '2025-09-20', expiry_date: '2026-09-20', result: 'apt', doctor_name: 'Dr. Andreea Popescu', clinic_name: 'Clinica MedWork Voluntari' },

  // Șantier Nord - riscuri înălțime, vibrații
  { employee_name: 'Munteanu Ion', job_title: 'Șef Șantier', examination_type: 'periodic', examination_date: '2025-11-05', expiry_date: '2026-11-05', result: 'apt', doctor_name: 'Dr. Andreea Popescu', clinic_name: 'Clinica MedWork Voluntari' },
  { employee_name: 'Popa Vasile', job_title: 'Inginer Șantier', examination_type: 'periodic', examination_date: '2025-10-20', expiry_date: '2026-10-20', result: 'apt', doctor_name: 'Dr. Andreea Popescu', clinic_name: 'Clinica MedWork Voluntari' },
  { employee_name: 'Radu Gheorghe', job_title: 'Fierar-betonist', examination_type: 'periodic', examination_date: '2025-09-10', expiry_date: '2026-03-10', result: 'apt', doctor_name: 'Dr. Ion Marinescu', clinic_name: 'Clinica MedWork Voluntari', notes: 'Lucru la înălțime + vibrații, reexaminare 6 luni' },
  { employee_name: 'Florea Constantin', job_title: 'Fierar-betonist', examination_type: 'periodic', examination_date: '2025-09-10', expiry_date: '2026-03-10', result: 'apt', doctor_name: 'Dr. Ion Marinescu', clinic_name: 'Clinica MedWork Voluntari', notes: 'Lucru la înălțime + vibrații, reexaminare 6 luni' },
  { employee_name: 'Marinescu Marius', job_title: 'Fierar-betonist', examination_type: 'periodic', examination_date: '2025-08-25', expiry_date: '2026-02-25', result: 'apt', doctor_name: 'Dr. Ion Marinescu', clinic_name: 'Clinica MedWork Voluntari', notes: 'Lucru la înălțime, reexaminare 6 luni' },
  { employee_name: 'Tudor Cristian', job_title: 'Fierar-betonist', examination_type: 'periodic', examination_date: '2025-07-15', expiry_date: '2026-01-15', result: 'apt_conditionat', restrictions: 'Protecție spate obligatorie la manipulare greutăți', doctor_name: 'Dr. Ion Marinescu', clinic_name: 'Clinica MedWork Voluntari' },
  { employee_name: 'Ciobanu Daniel', job_title: 'Zidar', examination_type: 'periodic', examination_date: '2025-10-01', expiry_date: '2026-04-01', result: 'apt', doctor_name: 'Dr. Ion Marinescu', clinic_name: 'Clinica MedWork Voluntari', notes: 'Lucru la înălțime, reexaminare 6 luni' },
  { employee_name: 'Nistor Alexandru', job_title: 'Zidar', examination_type: 'periodic', examination_date: '2025-10-01', expiry_date: '2026-04-01', result: 'apt', doctor_name: 'Dr. Ion Marinescu', clinic_name: 'Clinica MedWork Voluntari', notes: 'Lucru la înălțime, reexaminare 6 luni' },
  { employee_name: 'Barbu Ionuț', job_title: 'Zidar', examination_type: 'periodic', examination_date: '2025-09-15', expiry_date: '2026-03-15', result: 'apt', doctor_name: 'Dr. Ion Marinescu', clinic_name: 'Clinica MedWork Voluntari', notes: 'Lucru la înălțime, reexaminare 6 luni' },
  { employee_name: 'Badea Gheorghe', job_title: 'Dulgeriu', examination_type: 'periodic', examination_date: '2025-08-10', expiry_date: '2026-02-10', result: 'apt', doctor_name: 'Dr. Ion Marinescu', clinic_name: 'Clinica MedWork Voluntari', notes: 'Lucru la înălțime + zgomot, reexaminare 6 luni' },
  { employee_name: 'Oprea Petrică', job_title: 'Muncitor Necalificat', examination_type: 'angajare', examination_date: '2024-03-15', expiry_date: '2025-03-15', result: 'apt', doctor_name: 'Dr. Andreea Popescu', clinic_name: 'Clinica MedWork Voluntari', notes: 'EXPIRAT - Contract, reexaminare urgentă' },

  // Șantier Sud - riscuri sudură, înălțime
  { employee_name: 'Voicu Ștefan', job_title: 'Șef Șantier', examination_type: 'periodic', examination_date: '2025-11-10', expiry_date: '2026-11-10', result: 'apt', doctor_name: 'Dr. Andreea Popescu', clinic_name: 'Clinica MedWork Voluntari' },
  { employee_name: 'Dobre Mihail', job_title: 'Inginer Șantier', examination_type: 'periodic', examination_date: '2025-10-25', expiry_date: '2026-10-25', result: 'apt', doctor_name: 'Dr. Andreea Popescu', clinic_name: 'Clinica MedWork Voluntari' },
  { employee_name: 'Rusu Aurel', job_title: 'Sudor Construcții Metalice', examination_type: 'periodic', examination_date: '2025-09-05', expiry_date: '2026-03-05', result: 'apt', doctor_name: 'Dr. Ion Marinescu', clinic_name: 'Clinica MedWork Voluntari', notes: 'Expus radiații UV, reexaminare 6 luni' },
  { employee_name: 'Neagu Pavel', job_title: 'Sudor Construcții Metalice', examination_type: 'periodic', examination_date: '2025-09-05', expiry_date: '2026-03-05', result: 'apt', doctor_name: 'Dr. Ion Marinescu', clinic_name: 'Clinica MedWork Voluntari', notes: 'Expus radiații UV, reexaminare 6 luni' },
  { employee_name: 'Zamfir Dorel', job_title: 'Lăcătuș Construcții Metalice', examination_type: 'periodic', examination_date: '2025-08-20', expiry_date: '2026-02-20', result: 'apt', doctor_name: 'Dr. Ion Marinescu', clinic_name: 'Clinica MedWork Voluntari', notes: 'Lucru la înălțime, reexaminare 6 luni' },
  { employee_name: 'Mocanu Vasile', job_title: 'Montator Construcții Metalice', examination_type: 'periodic', examination_date: '2025-07-30', expiry_date: '2026-01-30', result: 'apt', doctor_name: 'Dr. Ion Marinescu', clinic_name: 'Clinica MedWork Voluntari', notes: 'Lucru la înălțime, reexaminare 6 luni' },
  { employee_name: 'Filip Adrian', job_title: 'Montator Construcții Metalice', examination_type: 'periodic', examination_date: '2025-07-30', expiry_date: '2026-01-30', result: 'apt', doctor_name: 'Dr. Ion Marinescu', clinic_name: 'Clinica MedWork Voluntari', notes: 'Lucru la înălțime, reexaminare 6 luni' },
  { employee_name: 'Neacșu Adrian', job_title: 'Muncitor Necalificat', examination_type: 'angajare', examination_date: '2024-01-25', expiry_date: '2025-01-25', result: 'apt', doctor_name: 'Dr. Andreea Popescu', clinic_name: 'Clinica MedWork Voluntari', notes: 'EXPIRAT - Contract' },

  // Șantier Est - riscuri înălțime mare, alpinism utilitar
  { employee_name: 'Alexandrescu Tiberiu', job_title: 'Șef Șantier', examination_type: 'periodic', examination_date: '2025-11-20', expiry_date: '2026-11-20', result: 'apt', doctor_name: 'Dr. Andreea Popescu', clinic_name: 'Clinica MedWork Voluntari' },
  { employee_name: 'Bălan Radu', job_title: 'Inginer Șantier', examination_type: 'periodic', examination_date: '2025-10-30', expiry_date: '2026-10-30', result: 'apt', doctor_name: 'Dr. Andreea Popescu', clinic_name: 'Clinica MedWork Voluntari' },
  { employee_name: 'Dragnea Florian', job_title: 'Fierar-betonist Poduri', examination_type: 'periodic', examination_date: '2025-09-20', expiry_date: '2026-03-20', result: 'apt', doctor_name: 'Dr. Ion Marinescu', clinic_name: 'Clinica MedWork Voluntari', notes: 'Lucru la înălțime mare (>15m), reexaminare 6 luni' },
  { employee_name: 'Enescu Gabriel', job_title: 'Fierar-betonist Poduri', examination_type: 'periodic', examination_date: '2025-09-20', expiry_date: '2026-03-20', result: 'apt', doctor_name: 'Dr. Ion Marinescu', clinic_name: 'Clinica MedWork Voluntari', notes: 'Lucru la înălțime mare (>15m), reexaminare 6 luni' },
  { employee_name: 'Fărcaș Ionuț', job_title: 'Fierar-betonist Poduri', examination_type: 'periodic', examination_date: '2025-08-15', expiry_date: '2026-02-15', result: 'apt', doctor_name: 'Dr. Ion Marinescu', clinic_name: 'Clinica MedWork Voluntari', notes: 'Lucru la înălțime mare, reexaminare 6 luni' },
  { employee_name: 'Jucan Daniel', job_title: 'Alpinist Utilitar', examination_type: 'periodic', examination_date: '2025-07-10', expiry_date: '2026-01-10', result: 'apt', doctor_name: 'Dr. Specialist Medicina Muncii', clinic_name: 'Centrul Medical București', notes: 'Alpinism utilitar - risc foarte ridicat, reexaminare 6 luni' },
  { employee_name: 'Kerekes László', job_title: 'Alpinist Utilitar', examination_type: 'periodic', examination_date: '2025-07-10', expiry_date: '2026-01-10', result: 'apt', doctor_name: 'Dr. Specialist Medicina Muncii', clinic_name: 'Centrul Medical București', notes: 'Alpinism utilitar - risc foarte ridicat, reexaminare 6 luni' },
  { employee_name: 'Năstase Viorel', job_title: 'Muncitor Necalificat', examination_type: 'angajare', examination_date: '2024-01-15', expiry_date: '2025-01-15', result: 'apt', doctor_name: 'Dr. Andreea Popescu', clinic_name: 'Clinica MedWork Voluntari', notes: 'EXPIRAT - Contract' },

  // Utilaje și Transport - operatori ISCIR
  { employee_name: 'Pavel Gheorghe', job_title: 'Șef Utilaje', examination_type: 'periodic', examination_date: '2025-11-15', expiry_date: '2026-11-15', result: 'apt', doctor_name: 'Dr. Andreea Popescu', clinic_name: 'Clinica MedWork Voluntari' },
  { employee_name: 'Rățoi Dumitru', job_title: 'Operator Macara Turnată 25T', examination_type: 'periodic', examination_date: '2025-10-10', expiry_date: '2026-10-10', result: 'apt', doctor_name: 'Dr. Ion Marinescu', clinic_name: 'Clinica MedWork Voluntari', notes: 'Operator macara ISCIR' },
  { employee_name: 'Sava Constantin', job_title: 'Operator Macara Mobilă 50T', examination_type: 'periodic', examination_date: '2025-09-25', expiry_date: '2026-09-25', result: 'apt', doctor_name: 'Dr. Ion Marinescu', clinic_name: 'Clinica MedWork Voluntari', notes: 'Operator macara ISCIR' },
  { employee_name: 'Țurcanu Vasile', job_title: 'Operator Excavator', examination_type: 'periodic', examination_date: '2025-08-30', expiry_date: '2026-02-28', result: 'apt', doctor_name: 'Dr. Ion Marinescu', clinic_name: 'Clinica MedWork Voluntari', notes: 'Vibrații + zgomot, reexaminare 6 luni' },
  { employee_name: 'Ungureanu Adrian', job_title: 'Operator Buldoexcavator', examination_type: 'periodic', examination_date: '2025-08-30', expiry_date: '2026-02-28', result: 'apt', doctor_name: 'Dr. Ion Marinescu', clinic_name: 'Clinica MedWork Voluntari', notes: 'Vibrații + zgomot, reexaminare 6 luni' },
  { employee_name: 'Vlădescu Marian', job_title: 'Operator Autobetonieră', examination_type: 'periodic', examination_date: '2025-10-05', expiry_date: '2026-10-05', result: 'apt', doctor_name: 'Dr. Ion Marinescu', clinic_name: 'Clinica MedWork Voluntari' },
  { employee_name: 'Wagner Klaus', job_title: 'Operator Pompă Beton', examination_type: 'periodic', examination_date: '2025-09-12', expiry_date: '2026-09-12', result: 'apt', doctor_name: 'Dr. Ion Marinescu', clinic_name: 'Clinica MedWork Voluntari' },
  { employee_name: 'Zanfir Ionuț', job_title: 'Șofer Camion 24T', examination_type: 'periodic', examination_date: '2025-11-01', expiry_date: '2026-11-01', result: 'apt', doctor_name: 'Dr. Andreea Popescu', clinic_name: 'Clinica MedWork Voluntari' },
  { employee_name: 'Bădescu Florin', job_title: 'Șofer Camion 12T', examination_type: 'periodic', examination_date: '2025-10-18', expiry_date: '2026-10-18', result: 'apt', doctor_name: 'Dr. Andreea Popescu', clinic_name: 'Clinica MedWork Voluntari' },
  { employee_name: 'Cîrlan Gabriel', job_title: 'Operator Stivuitor 3T', examination_type: 'periodic', examination_date: '2025-09-08', expiry_date: '2026-09-08', result: 'apt', doctor_name: 'Dr. Ion Marinescu', clinic_name: 'Clinica MedWork Voluntari', notes: 'Operator stivuitor ISCIR' },

  // Administrativ
  { employee_name: 'Eftimie Raluca', job_title: 'Inspector SSM', examination_type: 'periodic', examination_date: '2025-12-01', expiry_date: '2026-12-01', result: 'apt', doctor_name: 'Dr. Andreea Popescu', clinic_name: 'Clinica MedWork Voluntari' }
]

// ============================================================
// ECHIPAMENTE (40: 25 ISCIR + 15 EIP + EPI speciale)
// ============================================================

export const demoEquipmentConstruction: Partial<SafetyEquipment>[] = [
  // ── MACARALE (6) ──
  { equipment_type: 'altul', description: 'Macara Turnată POTAIN MD 365B - 25T (ISCIR)', location: 'Șantier Nord - Turn A', serial_number: 'MAC-TURN-2019-001', last_inspection_date: '2025-09-15', expiry_date: '2026-09-15', next_inspection_date: '2026-09-15', inspector_name: 'Ing. Marin Vasile - ISCIR', is_compliant: true, notes: 'Înălțime 65m' },
  { equipment_type: 'altul', description: 'Macara Turnată LIEBHERR 130 EC-B - 12T (ISCIR)', location: 'Șantier Nord - Turn B', serial_number: 'MAC-TURN-2020-002', last_inspection_date: '2025-08-20', expiry_date: '2026-08-20', next_inspection_date: '2026-08-20', inspector_name: 'Ing. Marin Vasile - ISCIR', is_compliant: true, notes: 'Înălțime 45m' },
  { equipment_type: 'altul', description: 'Macara Turnată COMEDIL CBR 40 - 8T (ISCIR)', location: 'Șantier Sud', serial_number: 'MAC-TURN-2021-003', last_inspection_date: '2025-07-10', expiry_date: '2026-07-10', next_inspection_date: '2026-07-10', inspector_name: 'Ing. Marin Vasile - ISCIR', is_compliant: true, notes: 'Înălțime 35m' },
  { equipment_type: 'altul', description: 'Macara Mobilă GROVE GMK5150L - 50T (ISCIR)', location: 'Șantier Est', serial_number: 'MAC-MOB-2018-001', last_inspection_date: '2025-10-05', expiry_date: '2026-10-05', next_inspection_date: '2026-10-05', inspector_name: 'Ing. Marin Vasile - ISCIR', is_compliant: true, notes: 'Brațul 60m' },
  { equipment_type: 'altul', description: 'Macara Mobilă LIEBHERR LTM 1100 - 100T (ISCIR)', location: 'Șantier Est', serial_number: 'MAC-MOB-2019-002', last_inspection_date: '2024-11-20', expiry_date: '2025-11-20', next_inspection_date: '2025-11-20', inspector_name: 'Ing. Marin Vasile - ISCIR', is_compliant: false, notes: 'EXPIRAT - Programat reînnoire 18.02.2026' },
  { equipment_type: 'altul', description: 'Macara Auto FASSI F545RA - 18T (ISCIR)', location: 'Șantier Sud', serial_number: 'MAC-AUTO-2020-001', last_inspection_date: '2025-06-15', expiry_date: '2026-06-15', next_inspection_date: '2026-06-15', inspector_name: 'Ing. Marin Vasile - ISCIR', is_compliant: true },

  // ── UTILAJE GRELE (8) ──
  { equipment_type: 'altul', description: 'Excavator CATERPILLAR 336 - 36T (ISCIR)', location: 'Șantier Nord', serial_number: 'EXC-2017-001', last_inspection_date: '2025-09-01', expiry_date: '2026-09-01', next_inspection_date: '2026-09-01', inspector_name: 'Ing. Marin Vasile - ISCIR', is_compliant: true },
  { equipment_type: 'altul', description: 'Excavator VOLVO EC380DL - 38T (ISCIR)', location: 'Șantier Est', serial_number: 'EXC-2019-002', last_inspection_date: '2025-08-10', expiry_date: '2026-08-10', next_inspection_date: '2026-08-10', inspector_name: 'Ing. Marin Vasile - ISCIR', is_compliant: true },
  { equipment_type: 'altul', description: 'Buldoexcavator JCB 4CX - 8T (ISCIR)', location: 'Șantier Sud', serial_number: 'BUL-2018-001', last_inspection_date: '2025-07-20', expiry_date: '2026-07-20', next_inspection_date: '2026-07-20', inspector_name: 'Ing. Marin Vasile - ISCIR', is_compliant: true },
  { equipment_type: 'altul', description: 'Buldozer CATERPILLAR D6K - 18T (ISCIR)', location: 'Șantier Nord', serial_number: 'BUL-2019-002', last_inspection_date: '2025-06-25', expiry_date: '2026-06-25', next_inspection_date: '2026-06-25', inspector_name: 'Ing. Marin Vasile - ISCIR', is_compliant: true },
  { equipment_type: 'altul', description: 'Stivuitor TOYOTA 7FD30 - 3T (ISCIR)', location: 'Depozit Central', serial_number: 'STIV-2020-001', last_inspection_date: '2025-10-12', expiry_date: '2026-10-12', next_inspection_date: '2026-10-12', inspector_name: 'Ing. Marin Vasile - ISCIR', is_compliant: true },
  { equipment_type: 'altul', description: 'Stivuitor MANITOU MT 1440 - 4T (ISCIR)', location: 'Șantier Sud', serial_number: 'STIV-2021-002', last_inspection_date: '2025-09-18', expiry_date: '2026-09-18', next_inspection_date: '2026-09-18', inspector_name: 'Ing. Marin Vasile - ISCIR', is_compliant: true },
  { equipment_type: 'altul', description: 'Automacara GROVE TMS 9000-2 - 90T (ISCIR)', location: 'Șantier Est', serial_number: 'AMAC-2017-001', last_inspection_date: '2025-05-20', expiry_date: '2026-05-20', next_inspection_date: '2026-05-20', inspector_name: 'Ing. Marin Vasile - ISCIR', is_compliant: true, notes: 'Telescopic 51m' },
  { equipment_type: 'altul', description: 'Lift mobil GENIE GTH-5519 - 2.5T/19m (ISCIR)', location: 'Șantier Nord', serial_number: 'LIFT-2020-001', last_inspection_date: '2025-08-05', expiry_date: '2026-08-05', next_inspection_date: '2026-08-05', inspector_name: 'Ing. Marin Vasile - ISCIR', is_compliant: true },

  // ── ECHIPAMENTE BETON (5) ──
  { equipment_type: 'altul', description: 'Autobetonieră MERCEDES 4140 - 10m³ (ISCIR)', location: 'Șantier Nord', serial_number: 'ABTN-2019-001', last_inspection_date: '2025-09-10', expiry_date: '2026-09-10', next_inspection_date: '2026-09-10', inspector_name: 'Ing. Marin Vasile - ISCIR', is_compliant: true },
  { equipment_type: 'altul', description: 'Autobetonieră IVECO 410 - 9m³ (ISCIR)', location: 'Șantier Sud', serial_number: 'ABTN-2020-002', last_inspection_date: '2025-08-22', expiry_date: '2026-08-22', next_inspection_date: '2026-08-22', inspector_name: 'Ing. Marin Vasile - ISCIR', is_compliant: true },
  { equipment_type: 'altul', description: 'Pompă Beton PUTZMEISTER BSF 47Z - 47m (ISCIR)', location: 'Șantier Est', serial_number: 'PBTN-2018-001', last_inspection_date: '2025-10-01', expiry_date: '2026-10-01', next_inspection_date: '2026-10-01', inspector_name: 'Ing. Marin Vasile - ISCIR', is_compliant: true },
  { equipment_type: 'altul', description: 'Pompă Beton SCHWING S42SX - 42m (ISCIR)', location: 'Șantier Nord', serial_number: 'PBTN-2019-002', last_inspection_date: '2025-09-15', expiry_date: '2026-09-15', next_inspection_date: '2026-09-15', inspector_name: 'Ing. Marin Vasile - ISCIR', is_compliant: true },
  { equipment_type: 'altul', description: 'Malaxor beton LIEBHERR HTM 905 - 500L', location: 'Șantier Sud', serial_number: 'MAL-2021-001', last_inspection_date: '2025-07-30', expiry_date: '2026-07-30', next_inspection_date: '2026-07-30', inspector_name: 'Ing. Marin Vasile - ISCIR', is_compliant: true },

  // ── COMPRESOARE ȘI INSTALAȚII (6) ──
  { equipment_type: 'altul', description: 'Compresor ATLAS COPCO XATS 750 - 25m³/min (ISCIR)', location: 'Șantier Est', serial_number: 'COMP-2019-001', last_inspection_date: '2025-08-15', expiry_date: '2026-08-15', next_inspection_date: '2026-08-15', inspector_name: 'Ing. Marin Vasile - ISCIR', is_compliant: true },
  { equipment_type: 'altul', description: 'Compresor SULLAIR 185 - 5.3m³/min (ISCIR)', location: 'Șantier Nord', serial_number: 'COMP-2020-002', last_inspection_date: '2025-07-20', expiry_date: '2026-07-20', next_inspection_date: '2026-07-20', inspector_name: 'Ing. Marin Vasile - ISCIR', is_compliant: true },
  { equipment_type: 'altul', description: 'Generator SDMO V700C2 - 700kVA (ISCIR)', location: 'Șantier Nord', serial_number: 'GEN-2018-001', last_inspection_date: '2025-10-08', expiry_date: '2026-10-08', next_inspection_date: '2026-10-08', inspector_name: 'Ing. Marin Vasile - ISCIR', is_compliant: true },
  { equipment_type: 'altul', description: 'Generator FG WILSON P550 - 550kVA (ISCIR)', location: 'Șantier Sud', serial_number: 'GEN-2019-002', last_inspection_date: '2025-09-22', expiry_date: '2026-09-22', next_inspection_date: '2026-09-22', inspector_name: 'Ing. Marin Vasile - ISCIR', is_compliant: true },
  { equipment_type: 'altul', description: 'Generator CUMMINS C400D5 - 400kVA (ISCIR)', location: 'Șantier Est', serial_number: 'GEN-2020-003', last_inspection_date: '2025-08-28', expiry_date: '2026-08-28', next_inspection_date: '2026-08-28', inspector_name: 'Ing. Marin Vasile - ISCIR', is_compliant: true },
  { equipment_type: 'altul', description: 'Instalație Apă Caldă Șantier - 1000L (ISCIR)', location: 'Șantier Nord - Bază', serial_number: 'IAC-2019-001', last_inspection_date: '2024-12-10', expiry_date: '2025-12-10', next_inspection_date: '2025-12-10', inspector_name: 'Ing. Marin Vasile - ISCIR', is_compliant: false, notes: 'EXPIRAT - Contact ISCIR urgent' },

  // ── EIP - ECHIPAMENTE ELECTROIZOLANTE (10) ──
  { equipment_type: 'eip', description: 'Mănuși izolante 1000V electricieni - set 8 perechi', location: 'Șantier Nord - Panou Electric', serial_number: 'EIP-MAN-2024-001', last_inspection_date: '2025-10-15', expiry_date: '2026-10-15', next_inspection_date: '2026-10-15', inspector_name: 'Laborator Autorizat TestSafe', is_compliant: true },
  { equipment_type: 'eip', description: 'Cizme izolante 1000V - set 6 perechi', location: 'Șantier Sud - Panou Electric', serial_number: 'EIP-CIZ-2024-002', last_inspection_date: '2025-10-15', expiry_date: '2026-10-15', next_inspection_date: '2026-10-15', inspector_name: 'Laborator Autorizat TestSafe', is_compliant: true },
  { equipment_type: 'eip', description: 'Cască protecție electrică - set 4 buc', location: 'Șantier Est - Container Echipamente', serial_number: 'EIP-CAS-2024-003', last_inspection_date: '2025-09-20', expiry_date: '2026-09-20', next_inspection_date: '2026-09-20', inspector_name: 'Laborator Autorizat TestSafe', is_compliant: true },
  { equipment_type: 'eip', description: 'Scule izolate 1000V - truse complete 3 buc', location: 'Depozit Central', serial_number: 'EIP-SCU-2024-004', last_inspection_date: '2025-09-10', expiry_date: '2026-09-10', next_inspection_date: '2026-09-10', inspector_name: 'Laborator Autorizat TestSafe', is_compliant: true },
  { equipment_type: 'eip', description: 'Bară izolantă telescopică 20kV', location: 'Șantier Nord - Panou Electric', serial_number: 'EIP-BAR-2023-001', last_inspection_date: '2025-08-15', expiry_date: '2026-08-15', next_inspection_date: '2026-08-15', inspector_name: 'Laborator Autorizat TestSafe', is_compliant: true },
  { equipment_type: 'eip', description: 'Covoraș izolant cauciuc 1000V - 5 buc', location: 'Șantier Sud - Panou Electric', serial_number: 'EIP-COV-2024-005', last_inspection_date: '2025-07-25', expiry_date: '2026-07-25', next_inspection_date: '2026-07-25', inspector_name: 'Laborator Autorizat TestSafe', is_compliant: true },
  { equipment_type: 'eip', description: 'Dispozitiv verificare absență tensiune 0.4-20kV', location: 'Șantier Nord - Panou Electric', serial_number: 'EIP-VAT-2023-002', last_inspection_date: '2025-06-10', expiry_date: '2026-06-10', next_inspection_date: '2026-06-10', inspector_name: 'Laborator Autorizat TestSafe', is_compliant: true },
  { equipment_type: 'eip', description: 'Legătură scurtcircuitare portabilă 20kV', location: 'Șantier Est - Container Echipamente', serial_number: 'EIP-LSC-2023-003', last_inspection_date: '2024-12-05', expiry_date: '2025-12-05', next_inspection_date: '2025-12-05', inspector_name: 'Laborator Autorizat TestSafe', is_compliant: false, notes: 'EXPIRAT - Retest urgent' },
  { equipment_type: 'eip', description: 'Indicator tensiune 0.4-20kV - 3 buc', location: 'Depozit Central', serial_number: 'EIP-IND-2024-006', last_inspection_date: '2025-05-15', expiry_date: '2026-05-15', next_inspection_date: '2026-05-15', inspector_name: 'Laborator Autorizat TestSafe', is_compliant: true },
  { equipment_type: 'eip', description: 'Mănuși dielecrice lucru sub tensiune - 4 perechi', location: 'Șantier Sud - Panou Electric', serial_number: 'EIP-MAN-2024-007', last_inspection_date: '2025-04-20', expiry_date: '2026-04-20', next_inspection_date: '2026-04-20', inspector_name: 'Laborator Autorizat TestSafe', is_compliant: true },

  // ── EPI SPECIALE ÎNĂLȚIME (5) ──
  { equipment_type: 'altul', description: 'Ham de siguranță alpinism utilitar - set 4 buc', location: 'Șantier Est - Echipament Alpinism', serial_number: 'HAM-2024-001', last_inspection_date: '2025-09-01', expiry_date: '2026-09-01', next_inspection_date: '2026-09-01', inspector_name: 'Inspector Alpinism Utilitar Autorizat', is_compliant: true, notes: 'Inspecție vizuală lunară obligatorie' },
  { equipment_type: 'altul', description: 'Corzi alpinism utilitar statice 11mm - 8 buc x 50m', location: 'Șantier Est - Echipament Alpinism', serial_number: 'CORD-2024-001', last_inspection_date: '2025-09-01', expiry_date: '2026-09-01', next_inspection_date: '2026-09-01', inspector_name: 'Inspector Alpinism Utilitar Autorizat', is_compliant: true },
  { equipment_type: 'altul', description: 'Caschete alpinism - set 6 buc', location: 'Șantier Est - Echipament Alpinism', serial_number: 'CAS-2024-002', last_inspection_date: '2025-08-15', expiry_date: '2026-08-15', next_inspection_date: '2026-08-15', inspector_name: 'Inspector Alpinism Utilitar Autorizat', is_compliant: true },
  { equipment_type: 'altul', description: 'Puncte de ancorare mobile - set 10 buc', location: 'Șantier Nord - Acoperișuri', serial_number: 'ANC-2023-001', last_inspection_date: '2025-07-10', expiry_date: '2026-07-10', next_inspection_date: '2026-07-10', inspector_name: 'Inspector Alpinism Utilitar Autorizat', is_compliant: true },
  { equipment_type: 'altul', description: 'Platforme elevatoare mobile - 2 buc (ISCIR)', location: 'Șantier Sud', serial_number: 'PLAT-2020-001', last_inspection_date: '2025-06-20', expiry_date: '2026-06-20', next_inspection_date: '2026-06-20', inspector_name: 'Ing. Marin Vasile - ISCIR', is_compliant: true, notes: 'Înălțime max 15m' }
]

// ============================================================
// INSTRUIRI / SESIUNI TRAINING (40)
// ============================================================

export const demoTrainingSessionsConstruction: Partial<TrainingSession>[] = [
  // Instruiri generale SSM construcții
  { worker_id: 'demo-emp-001', instructor_name: 'Eftimie Raluca', session_date: '2025-11-10', duration_minutes: 180, language: 'ro', location: 'Bază BuildMax', test_score: 92, test_questions_total: 25, test_questions_correct: 23, verification_result: 'admis', notes: 'SSM Construcții - Management' },
  { worker_id: 'demo-emp-002', instructor_name: 'Eftimie Raluca', session_date: '2025-11-10', duration_minutes: 180, language: 'ro', location: 'Bază BuildMax', test_score: 88, test_questions_total: 25, test_questions_correct: 22, verification_result: 'admis', notes: 'SSM Construcții - Management' },
  { worker_id: 'demo-emp-006', instructor_name: 'Eftimie Raluca', session_date: '2025-10-20', duration_minutes: 240, language: 'ro', location: 'Șantier Nord', test_score: 85, test_questions_total: 30, test_questions_correct: 25, verification_result: 'admis', notes: 'SSM - Șef Șantier' },
  { worker_id: 'demo-emp-031', instructor_name: 'Eftimie Raluca', session_date: '2025-10-25', duration_minutes: 240, language: 'ro', location: 'Șantier Sud', test_score: 83, test_questions_total: 30, test_questions_correct: 24, verification_result: 'admis', notes: 'SSM - Șef Șantier' },
  { worker_id: 'demo-emp-051', instructor_name: 'Eftimie Raluca', session_date: '2025-11-05', duration_minutes: 240, language: 'ro', location: 'Șantier Est', test_score: 87, test_questions_total: 30, test_questions_correct: 26, verification_result: 'admis', notes: 'SSM - Șef Șantier' },

  // Instruiri lucru la înălțime (obligatorii peste 2m)
  { worker_id: 'demo-emp-009', instructor_name: 'Formator Extern Alpinism', session_date: '2025-09-15', duration_minutes: 480, language: 'ro', location: 'Șantier Nord', test_score: 89, test_questions_total: 35, test_questions_correct: 31, verification_result: 'admis', notes: 'Lucru la înălțime >5m - Fierar-betonist' },
  { worker_id: 'demo-emp-010', instructor_name: 'Formator Extern Alpinism', session_date: '2025-09-15', duration_minutes: 480, language: 'ro', location: 'Șantier Nord', test_score: 86, test_questions_total: 35, test_questions_correct: 30, verification_result: 'admis', notes: 'Lucru la înălțime >5m - Fierar-betonist' },
  { worker_id: 'demo-emp-011', instructor_name: 'Formator Extern Alpinism', session_date: '2025-09-15', duration_minutes: 480, language: 'ro', location: 'Șantier Nord', test_score: 84, test_questions_total: 35, test_questions_correct: 29, verification_result: 'admis', notes: 'Lucru la înălțime >5m - Fierar-betonist' },
  { worker_id: 'demo-emp-012', instructor_name: 'Formator Extern Alpinism', session_date: '2025-08-20', duration_minutes: 480, language: 'ro', location: 'Șantier Nord', test_score: 82, test_questions_total: 35, test_questions_correct: 28, verification_result: 'admis', notes: 'Lucru la înălțime >5m - Fierar-betonist' },
  { worker_id: 'demo-emp-013', instructor_name: 'Formator Extern Alpinism', session_date: '2025-10-05', duration_minutes: 360, language: 'ro', location: 'Șantier Nord', test_score: 87, test_questions_total: 30, test_questions_correct: 26, verification_result: 'admis', notes: 'Lucru la înălțime - Zidar' },
  { worker_id: 'demo-emp-014', instructor_name: 'Formator Extern Alpinism', session_date: '2025-10-05', duration_minutes: 360, language: 'ro', location: 'Șantier Nord', test_score: 85, test_questions_total: 30, test_questions_correct: 25, verification_result: 'admis', notes: 'Lucru la înălțime - Zidar' },
  { worker_id: 'demo-emp-015', instructor_name: 'Formator Extern Alpinism', session_date: '2025-09-20', duration_minutes: 360, language: 'ro', location: 'Șantier Nord', test_score: 81, test_questions_total: 30, test_questions_correct: 24, verification_result: 'admis', notes: 'Lucru la înălțime - Zidar' },

  // Instruiri alpinism utilitar (poduri - înălțime mare)
  { worker_id: 'demo-emp-060', instructor_name: 'Formator Alpinism Utilitar Certificat', session_date: '2025-07-10', duration_minutes: 720, language: 'ro', location: 'Centru Formare București', test_score: 92, test_questions_total: 50, test_questions_correct: 46, verification_result: 'admis', notes: 'Certificare alpinism utilitar nivel avansat' },
  { worker_id: 'demo-emp-061', instructor_name: 'Formator Alpinism Utilitar Certificat', session_date: '2025-07-10', duration_minutes: 720, language: 'ro', location: 'Centru Formare București', test_score: 90, test_questions_total: 50, test_questions_correct: 45, verification_result: 'admis', notes: 'Certificare alpinism utilitar nivel avansat' },

  // Instruiri ISCIR - operatori macara
  { worker_id: 'demo-emp-067', instructor_name: 'Formator ISCIR Autorizat', session_date: '2024-11-15', duration_minutes: 960, language: 'ro', location: 'Centru Formare ISCIR București', test_score: 94, test_questions_total: 60, test_questions_correct: 56, verification_result: 'admis', notes: 'Certificat macarale turnate - EXPIRAT noiembrie 2025, reînnoire programată martie 2026' },
  { worker_id: 'demo-emp-068', instructor_name: 'Formator ISCIR Autorizat', session_date: '2025-09-20', duration_minutes: 960, language: 'ro', location: 'Centru Formare ISCIR București', test_score: 91, test_questions_total: 60, test_questions_correct: 54, verification_result: 'admis', notes: 'Certificat macarale mobile - valabil până septembrie 2026' },

  // Instruiri ISCIR - operatori excavatoare
  { worker_id: 'demo-emp-069', instructor_name: 'Formator ISCIR Autorizat', session_date: '2025-08-10', duration_minutes: 720, language: 'ro', location: 'Centru Formare ISCIR București', test_score: 88, test_questions_total: 50, test_questions_correct: 44, verification_result: 'admis', notes: 'Certificat excavator' },
  { worker_id: 'demo-emp-070', instructor_name: 'Formator ISCIR Autorizat', session_date: '2025-08-10', duration_minutes: 720, language: 'ro', location: 'Centru Formare ISCIR București', test_score: 86, test_questions_total: 50, test_questions_correct: 43, verification_result: 'admis', notes: 'Certificat buldoexcavator' },

  // Instruiri ISCIR - stivuitorist
  { worker_id: 'demo-emp-076', instructor_name: 'Formator ISCIR Stivuitor', session_date: '2025-09-05', duration_minutes: 480, language: 'ro', location: 'Bază BuildMax', test_score: 89, test_questions_total: 35, test_questions_correct: 31, verification_result: 'admis', notes: 'Certificat operator stivuitor' },

  // Instruiri sudură construcții metalice
  { worker_id: 'demo-emp-037', instructor_name: 'Formator Sudură Autorizat', session_date: '2025-09-01', duration_minutes: 600, language: 'ro', location: 'Șantier Sud', test_score: 93, test_questions_total: 40, test_questions_correct: 37, verification_result: 'admis', notes: 'Sudură construcții metalice - procedeu MIG/MAG' },
  { worker_id: 'demo-emp-038', instructor_name: 'Formator Sudură Autorizat', session_date: '2025-09-01', duration_minutes: 600, language: 'ro', location: 'Șantier Sud', test_score: 90, test_questions_total: 40, test_questions_correct: 36, verification_result: 'admis', notes: 'Sudură construcții metalice - procedeu MIG/MAG' },

  // Instruiri săpături și gropi adânci
  { worker_id: 'demo-emp-069', instructor_name: 'Eftimie Raluca', session_date: '2025-10-10', duration_minutes: 240, language: 'ro', location: 'Șantier Nord', test_score: 84, test_questions_total: 30, test_questions_correct: 25, verification_result: 'admis', notes: 'Risc săpături și prăbușire terasamente' },
  { worker_id: 'demo-emp-070', instructor_name: 'Eftimie Raluca', session_date: '2025-10-10', duration_minutes: 240, language: 'ro', location: 'Șantier Nord', test_score: 82, test_questions_total: 30, test_questions_correct: 24, verification_result: 'admis', notes: 'Risc săpături și prăbușire terasamente' },

  // Instruiri PSI construcții
  { worker_id: 'demo-emp-001', instructor_name: 'Inspector PSI Extern', session_date: '2025-12-05', duration_minutes: 240, language: 'ro', location: 'Bază BuildMax', test_score: 95, test_questions_total: 30, test_questions_correct: 28, verification_result: 'admis', notes: 'PSI Construcții - Echipă intervenție' },
  { worker_id: 'demo-emp-006', instructor_name: 'Inspector PSI Extern', session_date: '2025-12-05', duration_minutes: 240, language: 'ro', location: 'Bază BuildMax', test_score: 92, test_questions_total: 30, test_questions_correct: 27, verification_result: 'admis', notes: 'PSI Construcții - Echipă intervenție' },
  { worker_id: 'demo-emp-031', instructor_name: 'Inspector PSI Extern', session_date: '2025-12-05', duration_minutes: 240, language: 'ro', location: 'Bază BuildMax', test_score: 90, test_questions_total: 30, test_questions_correct: 27, verification_result: 'admis', notes: 'PSI Construcții - Echipă intervenție' },
  { worker_id: 'demo-emp-051', instructor_name: 'Inspector PSI Extern', session_date: '2025-12-05', duration_minutes: 240, language: 'ro', location: 'Bază BuildMax', test_score: 89, test_questions_total: 30, test_questions_correct: 26, verification_result: 'admis', notes: 'PSI Construcții - Echipă intervenție' },

  // Instruiri prim ajutor
  { worker_id: 'demo-emp-002', instructor_name: 'Medic SMURD', session_date: '2025-11-15', duration_minutes: 360, language: 'ro', location: 'Bază BuildMax', test_score: 93, test_questions_total: 35, test_questions_correct: 32, verification_result: 'admis', notes: 'Prim ajutor - Echipă medicală șantier' },
  { worker_id: 'demo-emp-007', instructor_name: 'Medic SMURD', session_date: '2025-11-15', duration_minutes: 360, language: 'ro', location: 'Bază BuildMax', test_score: 90, test_questions_total: 35, test_questions_correct: 31, verification_result: 'admis', notes: 'Prim ajutor - Echipă medicală șantier' },
  { worker_id: 'demo-emp-032', instructor_name: 'Medic SMURD', session_date: '2025-11-15', duration_minutes: 360, language: 'ro', location: 'Bază BuildMax', test_score: 88, test_questions_total: 35, test_questions_correct: 30, verification_result: 'admis', notes: 'Prim ajutor - Echipă medicală șantier' },
  { worker_id: 'demo-emp-052', instructor_name: 'Medic SMURD', session_date: '2025-11-15', duration_minutes: 360, language: 'ro', location: 'Bază BuildMax', test_score: 87, test_questions_total: 35, test_questions_correct: 30, verification_result: 'admis', notes: 'Prim ajutor - Echipă medicală șantier' },

  // Instruiri riscuri electrice
  { worker_id: 'demo-emp-066', instructor_name: 'Eftimie Raluca', session_date: '2025-10-15', duration_minutes: 240, language: 'ro', location: 'Șantier Nord', test_score: 91, test_questions_total: 30, test_questions_correct: 27, verification_result: 'admis', notes: 'Risc electric - Șef utilaje' },
  { worker_id: 'demo-emp-067', instructor_name: 'Eftimie Raluca', session_date: '2025-09-25', duration_minutes: 180, language: 'ro', location: 'Șantier Nord', test_score: 86, test_questions_total: 25, test_questions_correct: 21, verification_result: 'admis', notes: 'Risc electric - Operator macara' },
  { worker_id: 'demo-emp-068', instructor_name: 'Eftimie Raluca', session_date: '2025-09-25', duration_minutes: 180, language: 'ro', location: 'Șantier Est', test_score: 84, test_questions_total: 25, test_questions_correct: 21, verification_result: 'admis', notes: 'Risc electric - Operator macara' },

  // Instruiri riscuri mecanice și transporturi interne
  { worker_id: 'demo-emp-073', instructor_name: 'Eftimie Raluca', session_date: '2025-10-20', duration_minutes: 180, language: 'ro', location: 'Bază BuildMax', test_score: 88, test_questions_total: 25, test_questions_correct: 22, verification_result: 'admis', notes: 'Șofer camion - risc rutier' },
  { worker_id: 'demo-emp-074', instructor_name: 'Eftimie Raluca', session_date: '2025-10-20', duration_minutes: 180, language: 'ro', location: 'Bază BuildMax', test_score: 85, test_questions_total: 25, test_questions_correct: 21, verification_result: 'admis', notes: 'Șofer camion - risc rutier' },

  // Instruiri muncitori necalificați - riscuri generale șantier
  { worker_id: 'demo-emp-025', instructor_name: 'Eftimie Raluca', session_date: '2025-09-30', duration_minutes: 120, language: 'ro', location: 'Șantier Nord', test_score: 78, test_questions_total: 20, test_questions_correct: 15, verification_result: 'admis', notes: 'SSM General - Muncitor necalificat' },
  { worker_id: 'demo-emp-026', instructor_name: 'Eftimie Raluca', session_date: '2025-09-30', duration_minutes: 120, language: 'ro', location: 'Șantier Nord', test_score: 76, test_questions_total: 20, test_questions_correct: 15, verification_result: 'admis', notes: 'SSM General - Muncitor necalificat' },
  { worker_id: 'demo-emp-049', instructor_name: 'Eftimie Raluca', session_date: '2025-10-12', duration_minutes: 120, language: 'ro', location: 'Șantier Sud', test_score: 75, test_questions_total: 20, test_questions_correct: 15, verification_result: 'admis', notes: 'SSM General - Muncitor necalificat' },
  { worker_id: 'demo-emp-050', instructor_name: 'Eftimie Raluca', session_date: '2025-10-12', duration_minutes: 120, language: 'ro', location: 'Șantier Sud', test_score: 73, test_questions_total: 20, test_questions_correct: 14, verification_result: 'admis', notes: 'SSM General - Muncitor necalificat' }
]

// ============================================================
// DOCUMENTE GENERATE (12)
// ============================================================

export const demoDocumentsConstruction: Partial<GeneratedDocument>[] = [
  { document_type: 'raport_conformitate', file_name: 'Raport_Conformitate_SSM_Constructii_2025_Q4.pdf', file_size_bytes: 3456789, storage_path: '/documents/buildmax/raport_2025_q4.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { period: 'Q4 2025', generator: 'consultant', sectors: '3 șantiere' } },
  { document_type: 'fisa_medicina_muncii', file_name: 'Fisa_MM_Operatori_ISCIR_2025.pdf', file_size_bytes: 1876543, storage_path: '/documents/buildmax/fisa_mm_iscir.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { department: 'Utilaje', category: 'Operatori ISCIR' } },
  { document_type: 'fisa_medicina_muncii', file_name: 'Fisa_MM_Lucru_Inaltime_2025.pdf', file_size_bytes: 2123456, storage_path: '/documents/buildmax/fisa_mm_inaltime.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { risk: 'Lucru la înălțime', workers: 35 } },
  { document_type: 'fisa_echipamente', file_name: 'Fisa_Echipamente_ISCIR_Macarale_2025.pdf', file_size_bytes: 1654321, storage_path: '/documents/buildmax/fisa_iscir_macarale.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { equipment_type: 'Macarale ISCIR', count: 6 } },
  { document_type: 'fisa_echipamente', file_name: 'Fisa_Echipamente_ISCIR_Utilaje_2025.pdf', file_size_bytes: 1456789, storage_path: '/documents/buildmax/fisa_iscir_utilaje.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { equipment_type: 'Utilaje grele ISCIR', count: 13 } },
  { document_type: 'fisa_echipamente', file_name: 'Fisa_Echipamente_EIP_2025.pdf', file_size_bytes: 987654, storage_path: '/documents/buildmax/fisa_eip.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { equipment_type: 'EIP', count: 10 } },
  { document_type: 'fisa_instruire', file_name: 'Fisa_Instruire_Lucru_Inaltime_2025.pdf', file_size_bytes: 876543, storage_path: '/documents/buildmax/fisa_instruire_inaltime.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { training_type: 'Lucru la înălțime', sessions: 12 } },
  { document_type: 'fisa_instruire', file_name: 'Fisa_Instruire_Alpinism_Utilitar_2025.pdf', file_size_bytes: 765432, storage_path: '/documents/buildmax/fisa_alpinism.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { training_type: 'Alpinism utilitar', sessions: 2 } },
  { document_type: 'fisa_instruire', file_name: 'Certificari_ISCIR_2025.pdf', file_size_bytes: 654321, storage_path: '/documents/buildmax/certificari_iscir.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { training_type: 'Certificări ISCIR', operators: 7 } },
  { document_type: 'raport_neactiune', file_name: 'Raport_Ignorare_Alerte_Q3_2025.pdf', file_size_bytes: 345678, storage_path: '/documents/buildmax/raport_ignorare_q3.pdf', is_locked: false, ignored_notifications_count: 4, generation_context: { period: 'Q3 2025', ignored_count: 4 } },
  { document_type: 'altul', file_name: 'Plan_Prevenire_Protectie_Constructii_2025.pdf', file_size_bytes: 2987654, storage_path: '/documents/buildmax/ppp_2025.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { doc_type: 'PPP', year: 2025, sites: 3 } },
  { document_type: 'altul', file_name: 'Registru_Evaluare_Riscuri_Constructii_2025.pdf', file_size_bytes: 3123456, storage_path: '/documents/buildmax/rer_2025.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { doc_type: 'RER', year: 2025, risks: ['înălțime', 'săpături', 'electric', 'utilaje grele'] } }
]

// ============================================================
// ALERTE (10)
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

export const demoAlertsConstruction: Partial<DemoAlert>[] = [
  {
    alert_type: 'medical_expiry',
    severity: 'expired',
    title: 'Fișă medicală expirată - Oprea Petrică (Muncitor)',
    description: 'Fișa de medicina muncii a expirat la 15.03.2025. Lucrător contract pe șantier - risc ridicat până la reexaminare.',
    related_entity_type: 'employee',
    related_entity_id: 'demo-emp-030',
    action_required: 'Programare urgentă examen medical sau suspendare temporară',
    due_date: '2026-02-20',
    is_resolved: false
  },
  {
    alert_type: 'medical_expiry',
    severity: 'expired',
    title: 'Fișă medicală expirată - Neacșu Adrian (Muncitor)',
    description: 'Fișa de medicina muncii a expirat la 25.01.2025. Contract pe Șantier Sud - reexaminare urgentă.',
    related_entity_type: 'employee',
    related_entity_id: 'demo-emp-049',
    action_required: 'Programare examen medical sau suspendare lucrări',
    due_date: '2026-02-18',
    is_resolved: false
  },
  {
    alert_type: 'medical_expiry',
    severity: 'expired',
    title: 'Fișă medicală expirată - Năstase Viorel (Muncitor)',
    description: 'Fișa de medicina muncii a expirat la 15.01.2025. Contract pe Șantier Est - reexaminare obligatorie.',
    related_entity_type: 'employee',
    related_entity_id: 'demo-emp-064',
    action_required: 'Programare clinică înainte de repunere în lucru',
    due_date: '2026-02-19',
    is_resolved: false
  },
  {
    alert_type: 'equipment_expiry',
    severity: 'expired',
    title: 'Inspecție ISCIR expirată - Macara Mobilă LIEBHERR 100T',
    description: 'Inspecția ISCIR a expirat la 20.11.2025. Macara nu poate fi utilizată conform legislației - risc major pe Șantier Est.',
    related_entity_type: 'equipment',
    related_entity_id: 'demo-equip-005',
    action_required: 'Contact urgent ISCIR pentru reprogramare inspecție',
    due_date: '2026-02-17',
    is_resolved: false
  },
  {
    alert_type: 'equipment_expiry',
    severity: 'expired',
    title: 'Inspecție ISCIR expirată - Instalație Apă Caldă Șantier',
    description: 'Inspecția ISCIR a expirat la 10.12.2025. Instalație nu poate funcționa - risc explozie.',
    related_entity_type: 'equipment',
    related_entity_id: 'demo-equip-026',
    action_required: 'Contact ISCIR urgent sau închidere instalație',
    due_date: '2026-02-16',
    is_resolved: false
  },
  {
    alert_type: 'equipment_expiry',
    severity: 'expired',
    title: 'Test EIP expirat - Legătură scurtcircuitare 20kV',
    description: 'Testul laborator pentru EIP a expirat la 05.12.2025. Risc electrocutare dacă se utilizează pe șantier.',
    related_entity_type: 'equipment',
    related_entity_id: 'demo-equip-033',
    action_required: 'Trimitere urgentă la laborator autorizat TestSafe',
    due_date: '2026-02-15',
    is_resolved: false
  },
  {
    alert_type: 'training_expiry',
    severity: 'critical',
    title: 'Certificare ISCIR expirată - Operator Macara Turnată',
    description: 'Certificarea ISCIR pentru operator macara turnată a expirat în noiembrie 2025. Reprogramare martie 2026.',
    related_entity_type: 'training',
    related_entity_id: 'demo-train-015',
    action_required: 'Programare urgent formator ISCIR pentru reînnoire',
    due_date: '2026-03-15',
    is_resolved: false
  },
  {
    alert_type: 'compliance_issue',
    severity: 'warning',
    title: 'Lipsă echipament protecție înălțime pe Șantier Est',
    description: 'Pe Șantier Est (pod) lipsesc 2 seturi complete ham + coardă pentru lucrătorii noi (Olteanu, Năstase).',
    related_entity_type: 'general',
    related_entity_id: null,
    action_required: 'Achiziție urgentă 2 seturi complete echipament alpinism utilitar',
    due_date: '2026-02-25',
    is_resolved: false
  },
  {
    alert_type: 'compliance_issue',
    severity: 'critical',
    title: 'Săpături nesecurizate pe Șantier Nord - risc prăbușire',
    description: 'Săpăturile pentru fundații Turn C depășesc 3m adâncime fără sprijinire laterală conformă. Risc prăbușire pereți.',
    related_entity_type: 'general',
    related_entity_id: null,
    action_required: 'Sistare lucrări și montare urgentă sprijinire metalică',
    due_date: '2026-02-14',
    is_resolved: false
  },
  {
    alert_type: 'safety_incident',
    severity: 'warning',
    title: 'Incident minor pe Șantier Sud - lovire cu material',
    description: 'Zidar Cojocaru Silviu lovit ușor la mână de placă metalică căzută (2m înălțime). Prim ajutor pe loc, refuz spital.',
    related_entity_type: 'employee',
    related_entity_id: 'demo-emp-040',
    action_required: 'Completare Registru Incidente + instruire suplimentară echipă',
    due_date: '2026-02-20',
    is_resolved: false
  }
]

// ============================================================
// EXPORT COMPLET
// ============================================================

export const demoDataConstruction = {
  organization: demoOrganizationConstruction,
  employees: demoEmployeesConstruction,
  medicalExams: demoMedicalExamsConstruction,
  equipment: demoEquipmentConstruction,
  trainingSessions: demoTrainingSessionsConstruction,
  documents: demoDocumentsConstruction,
  alerts: demoAlertsConstruction,
  stats: {
    totalEmployees: 80,
    departments: 6,
    activeSites: 3,
    trainingSessions: 40,
    medicalExams: 40,
    equipment: 40,
    equipmentISCIR: 25,
    equipmentEIP: 10,
    equipmentSpecial: 5,
    documents: 12,
    alerts: 10,
    alertsCritical: 7,
    alertsExpired: 6
  }
}
