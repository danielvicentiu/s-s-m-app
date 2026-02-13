// ============================================================
// S-S-M.RO — DEMO DATA: BULGARIAN CONSTRUCTION COMPANY
// File: lib/data/demo-data-bulgarian.ts
// ============================================================
// Company: Стройтех ЕООД (Stroytech EOOD)
// Location: Ruse, Bulgaria
// Profile: 35 employees, civil and industrial construction
// Departments: 4 (Main Site, Machinery, Transport, Administrative)
// Active sites: 2 (Residential Complex, Industrial Warehouse)
// Legislation: Bulgarian ЗЗБУТ (Закон за здравословни и безопасни условия на труд)
// Multi-country capability demonstration for S-S-M.RO platform
// ============================================================

import type { Organization, MedicalExamination, SafetyEquipment, GeneratedDocument } from '@/lib/types'
import type { TrainingSession, TrainingAssignment } from '@/lib/training-types'

// ============================================================
// ORGANIZATION — СТРОЙТЕХ ЕООД
// ============================================================

export const demoOrganizationBulgaria: Partial<Organization> = {
  name: 'Стройтех ЕООД',
  cui: 'BG204567890',
  address: 'ул. Придунавска 45, 7000 Русе, България',
  county: 'Ruse',
  contact_email: 'office@stroytech.bg',
  contact_phone: '+359 82 456 789',
  data_completeness: 78,
  employee_count: 35,
  exposure_score: 'ridicat',
  preferred_channels: ['email', 'whatsapp'],
  cooperation_status: 'active'
}

// ============================================================
// EMPLOYEES (35) — СЛУЖИТЕЛИ
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

export const demoEmployeesBulgaria: Partial<DemoEmployee>[] = [
  // ── MANAGEMENT / РЪКОВОДСТВО (4) ──
  { full_name: 'Петров Иван', job_title: 'Управител / CEO', department: 'Административен', cor_code: '1120', employment_type: 'full_time', employment_start_date: '2015-03-01' },
  { full_name: 'Димитрова Мария', job_title: 'Главен инженер / Chief Engineer', department: 'Административен', cor_code: '1321', employment_type: 'full_time', employment_start_date: '2016-06-15' },
  { full_name: 'Георгиев Стоян', job_title: 'Финансов директор / CFO', department: 'Административен', cor_code: '1211', employment_type: 'full_time', employment_start_date: '2017-02-10' },
  { full_name: 'Костова Елена', job_title: 'Специалист ЗБУТ / OSH Specialist', department: 'Административен', cor_code: '2422', employment_type: 'full_time', employment_start_date: '2018-09-01' },

  // ── MAIN CONSTRUCTION SITE / ОСНОВЕН ОБЕКТ (18) ──
  { full_name: 'Йорданов Христо', job_title: 'Началник обект / Site Manager', department: 'Основен обект', cor_code: '3123', employment_type: 'full_time', employment_start_date: '2019-04-15' },
  { full_name: 'Николов Петър', job_title: 'Инженер строителство / Construction Engineer', department: 'Основен обект', cor_code: '2142', employment_type: 'full_time', employment_start_date: '2020-01-20' },
  { full_name: 'Стоянов Георги', job_title: 'Майстор строител / Master Builder', department: 'Основен обект', cor_code: '3123', employment_type: 'full_time', employment_start_date: '2020-05-10' },
  { full_name: 'Василев Димитър', job_title: 'Арматурист / Rebar Worker', department: 'Основен обект', cor_code: '7112', employment_type: 'full_time', employment_start_date: '2021-02-01' },
  { full_name: 'Тодоров Илия', job_title: 'Арматурист / Rebar Worker', department: 'Основен обект', cor_code: '7112', employment_type: 'full_time', employment_start_date: '2021-02-01' },
  { full_name: 'Иванов Красимир', job_title: 'Арматурист / Rebar Worker', department: 'Основен обект', cor_code: '7112', employment_type: 'full_time', employment_start_date: '2021-06-15' },
  { full_name: 'Младенов Борислав', job_title: 'Зидар / Mason', department: 'Основен обект', cor_code: '7122', employment_type: 'full_time', employment_start_date: '2021-03-20' },
  { full_name: 'Ангелов Валентин', job_title: 'Зидар / Mason', department: 'Основен обект', cor_code: '7122', employment_type: 'full_time', employment_start_date: '2021-03-20' },
  { full_name: 'Христов Николай', job_title: 'Зидар / Mason', department: 'Основен обект', cor_code: '7122', employment_type: 'full_time', employment_start_date: '2021-08-10' },
  { full_name: 'Господинов Атанас', job_title: 'Зидар / Mason', department: 'Основен обект', cor_code: '7122', employment_type: 'full_time', employment_start_date: '2022-01-15' },
  { full_name: 'Симеонов Васил', job_title: 'Мазач / Plasterer', department: 'Основен обект', cor_code: '7131', employment_type: 'full_time', employment_start_date: '2022-06-01' },
  { full_name: 'Колев Стефан', job_title: 'Мазач / Plasterer', department: 'Основен обект', cor_code: '7131', employment_type: 'full_time', employment_start_date: '2022-06-01' },
  { full_name: 'Александров Радослав', job_title: 'Шпакловчик / Spackling Worker', department: 'Основен обект', cor_code: '7131', employment_type: 'full_time', employment_start_date: '2022-09-15' },
  { full_name: 'Генов Любомир', job_title: 'Дърводелец / Carpenter', department: 'Основен обект', cor_code: '7115', employment_type: 'full_time', employment_start_date: '2021-10-05' },
  { full_name: 'Павлов Мирослав', job_title: 'Дърводелец / Carpenter', department: 'Основен обект', cor_code: '7115', employment_type: 'full_time', employment_start_date: '2022-03-20' },
  { full_name: 'Митев Емил', job_title: 'Некв. работник / Unskilled Worker', department: 'Основен обект', cor_code: '9313', employment_type: 'full_time', employment_start_date: '2023-01-10' },
  { full_name: 'Рангелов Пламен', job_title: 'Некв. работник / Unskilled Worker', department: 'Основен обект', cor_code: '9313', employment_type: 'contract', employment_start_date: '2023-07-15' },
  { full_name: 'Кирилов Ивайло', job_title: 'Некв. работник / Unskilled Worker', department: 'Основен обект', cor_code: '9313', employment_type: 'contract', employment_start_date: '2024-02-01' },

  // ── MACHINERY & TRANSPORT / ТЕХНИКА И ТРАНСПОРТ (8) ──
  { full_name: 'Танев Благой', job_title: 'Началник техника / Machinery Chief', department: 'Техника', cor_code: '3123', employment_type: 'full_time', employment_start_date: '2018-05-10' },
  { full_name: 'Величков Петко', job_title: 'Оператор кран / Crane Operator', department: 'Техника', cor_code: '8343', employment_type: 'full_time', employment_start_date: '2020-02-15' },
  { full_name: 'Костадинов Румен', job_title: 'Оператор багер / Excavator Operator', department: 'Техника', cor_code: '8342', employment_type: 'full_time', employment_start_date: '2020-06-20' },
  { full_name: 'Денчев Христо', job_title: 'Оператор булдозер / Bulldozer Operator', department: 'Техника', cor_code: '8342', employment_type: 'full_time', employment_start_date: '2021-03-10' },
  { full_name: 'Русев Тодор', job_title: 'Шофьор камион / Truck Driver', department: 'Транспорт', cor_code: '8332', employment_type: 'full_time', employment_start_date: '2019-09-01' },
  { full_name: 'Борисов Димо', job_title: 'Шофьор камион / Truck Driver', department: 'Транспорт', cor_code: '8332', employment_type: 'full_time', employment_start_date: '2020-11-15' },
  { full_name: 'Маринов Спас', job_title: 'Оператор бетон помпа / Concrete Pump Operator', department: 'Техника', cor_code: '8343', employment_type: 'full_time', employment_start_date: '2021-07-20' },
  { full_name: 'Захариев Йордан', job_title: 'Оператор мотокар / Forklift Operator', department: 'Техника', cor_code: '8344', employment_type: 'full_time', employment_start_date: '2022-04-05' },

  // ── WELDING & METALWORK / ЗАВАРЧИЦИ (4) ──
  { full_name: 'Георгиев Боян', job_title: 'Заварчик / Welder', department: 'Основен обект', cor_code: '7212', employment_type: 'full_time', employment_start_date: '2020-08-15' },
  { full_name: 'Стоилов Любен', job_title: 'Заварчик / Welder', department: 'Основен обект', cor_code: '7212', employment_type: 'full_time', employment_start_date: '2021-01-20' },
  { full_name: 'Недялков Васил', job_title: 'Монтажник метал / Metal Fitter', department: 'Основен обект', cor_code: '7214', employment_type: 'full_time', employment_start_date: '2021-09-10' },

  // ── ADMINISTRATIVE / АДМИНИСТРАЦИЯ (1) ──
  { full_name: 'Добрева Силвия', job_title: 'Счетоводител / Accountant', department: 'Административен', cor_code: '3313', employment_type: 'full_time', employment_start_date: '2019-01-15' }
]

// ============================================================
// MEDICAL EXAMINATIONS (35) — МЕДИЦИНСКИ ПРЕГЛЕДИ
// ============================================================

export const demoMedicalExaminationsBulgaria: Partial<MedicalExamination>[] = [
  // Management — периодични прегледи
  { employee_name: 'Петров Иван', job_title: 'Управител / CEO', examination_type: 'periodic', examination_date: '2025-10-10', expiry_date: '2026-10-10', result: 'apt', doctor_name: 'Д-р Ивана Стоянова', clinic_name: 'Медицински център Русе' },
  { employee_name: 'Димитрова Мария', job_title: 'Главен инженер', examination_type: 'periodic', examination_date: '2025-09-15', expiry_date: '2026-09-15', result: 'apt', doctor_name: 'Д-р Ивана Стоянова', clinic_name: 'Медицински център Русе' },
  { employee_name: 'Георгиев Стоян', job_title: 'Финансов директор', examination_type: 'periodic', examination_date: '2025-08-20', expiry_date: '2026-08-20', result: 'apt', doctor_name: 'Д-р Ивана Стоянова', clinic_name: 'Медицински център Русе' },
  { employee_name: 'Костова Елена', job_title: 'Специалист ЗБУТ', examination_type: 'periodic', examination_date: '2025-11-05', expiry_date: '2026-11-05', result: 'apt', doctor_name: 'Д-р Ивана Стоянова', clinic_name: 'Медицински център Русе' },

  // Main Site — работа на височина, вибрации, шум
  { employee_name: 'Йорданов Христо', job_title: 'Началник обект', examination_type: 'periodic', examination_date: '2025-10-20', expiry_date: '2026-10-20', result: 'apt', doctor_name: 'Д-р Ивана Стоянова', clinic_name: 'Медицински център Русе' },
  { employee_name: 'Николов Петър', job_title: 'Инженер строителство', examination_type: 'periodic', examination_date: '2025-09-25', expiry_date: '2026-09-25', result: 'apt', doctor_name: 'Д-р Ивана Стоянова', clinic_name: 'Медицински център Русе' },
  { employee_name: 'Стоянов Георги', job_title: 'Майстор строител', examination_type: 'periodic', examination_date: '2025-11-10', expiry_date: '2026-11-10', result: 'apt', doctor_name: 'Д-р Ивана Стоянова', clinic_name: 'Медицински център Русе' },
  { employee_name: 'Василев Димитър', job_title: 'Арматурист', examination_type: 'periodic', examination_date: '2025-08-15', expiry_date: '2026-02-15', result: 'apt', doctor_name: 'Д-р Георги Петров', clinic_name: 'Медицински център Русе', notes: 'Работа на височина + вибрации, преглед на 6 месеца' },
  { employee_name: 'Тодоров Илия', job_title: 'Арматурист', examination_type: 'periodic', examination_date: '2025-08-15', expiry_date: '2026-02-15', result: 'apt', doctor_name: 'Д-р Георги Петров', clinic_name: 'Медицински център Русе', notes: 'Работа на височина + вибрации, преглед на 6 месеца' },
  { employee_name: 'Иванов Красимир', job_title: 'Арматурист', examination_type: 'periodic', examination_date: '2025-09-10', expiry_date: '2026-03-10', result: 'apt', doctor_name: 'Д-р Георги Петров', clinic_name: 'Медицински център Русе', notes: 'Работа на височина, преглед на 6 месеца' },
  { employee_name: 'Младенов Борислав', job_title: 'Зидар', examination_type: 'periodic', examination_date: '2025-10-05', expiry_date: '2026-04-05', result: 'apt', doctor_name: 'Д-р Георги Петров', clinic_name: 'Медицински център Русе', notes: 'Работа на височина, преглед на 6 месеца' },
  { employee_name: 'Ангелов Валентин', job_title: 'Зидар', examination_type: 'periodic', examination_date: '2025-10-05', expiry_date: '2026-04-05', result: 'apt', doctor_name: 'Д-р Георги Петров', clinic_name: 'Медицински център Русе', notes: 'Работа на височина, преглед на 6 месеца' },
  { employee_name: 'Христов Николай', job_title: 'Зидар', examination_type: 'periodic', examination_date: '2025-09-20', expiry_date: '2026-03-20', result: 'apt', doctor_name: 'Д-р Георги Петров', clinic_name: 'Медицински център Русе', notes: 'Работа на височина, преглед на 6 месеца' },
  { employee_name: 'Господинов Атанас', job_title: 'Зидар', examination_type: 'periodic', examination_date: '2025-08-25', expiry_date: '2026-02-25', result: 'apt', doctor_name: 'Д-р Георги Петров', clinic_name: 'Медицински център Русе', notes: 'Работа на височина, преглед на 6 месеца' },
  { employee_name: 'Симеонов Васил', job_title: 'Мазач', examination_type: 'periodic', examination_date: '2025-11-15', expiry_date: '2026-05-15', result: 'apt', doctor_name: 'Д-р Георги Петров', clinic_name: 'Медицински център Русе', notes: 'Химични вещества, преглед на 6 месеца' },
  { employee_name: 'Колев Стефан', job_title: 'Мазач', examination_type: 'periodic', examination_date: '2025-11-15', expiry_date: '2026-05-15', result: 'apt', doctor_name: 'Д-р Георги Петров', clinic_name: 'Медицински център Русе', notes: 'Химични вещества, преглед на 6 месеца' },
  { employee_name: 'Александров Радослав', job_title: 'Шпакловчик', examination_type: 'periodic', examination_date: '2025-10-25', expiry_date: '2026-04-25', result: 'apt', doctor_name: 'Д-р Георги Петров', clinic_name: 'Медицински център Русе', notes: 'Прах, преглед на 6 месеца' },
  { employee_name: 'Генов Любомир', job_title: 'Дърводелец', examination_type: 'periodic', examination_date: '2025-09-30', expiry_date: '2026-03-30', result: 'apt', doctor_name: 'Д-р Георги Петров', clinic_name: 'Медицински център Русе', notes: 'Шум + вибрации, преглед на 6 месеца' },
  { employee_name: 'Павлов Мирослав', job_title: 'Дърводелец', examination_type: 'periodic', examination_date: '2025-09-30', expiry_date: '2026-03-30', result: 'apt', doctor_name: 'Д-р Георги Петров', clinic_name: 'Медицински център Русе', notes: 'Шум + вибрации, преглед на 6 месеца' },
  { employee_name: 'Митев Емил', job_title: 'Некв. работник', examination_type: 'periodic', examination_date: '2025-08-10', expiry_date: '2026-08-10', result: 'apt', doctor_name: 'Д-р Ивана Стоянова', clinic_name: 'Медицински център Русе' },
  { employee_name: 'Рангелов Пламен', job_title: 'Некв. работник', examination_type: 'angajare', examination_date: '2024-07-10', expiry_date: '2025-07-10', result: 'apt', doctor_name: 'Д-р Ивана Стоянова', clinic_name: 'Медицински център Русе', notes: 'ИЗТЕКЪЛ - договор, спешен преглед' },
  { employee_name: 'Кирилов Ивайло', job_title: 'Некв. работник', examination_type: 'angajare', examination_date: '2024-01-25', expiry_date: '2025-01-25', result: 'apt', doctor_name: 'Д-р Ивана Стоянова', clinic_name: 'Медицински център Русе', notes: 'ИЗТЕКЪЛ - договор' },

  // Machinery & Transport — оператори, шофьори
  { employee_name: 'Танев Благой', job_title: 'Началник техника', examination_type: 'periodic', examination_date: '2025-11-20', expiry_date: '2026-11-20', result: 'apt', doctor_name: 'Д-р Ивана Стоянова', clinic_name: 'Медицински център Русе' },
  { employee_name: 'Величков Петко', job_title: 'Оператор кран', examination_type: 'periodic', examination_date: '2025-10-15', expiry_date: '2026-10-15', result: 'apt', doctor_name: 'Д-р Георги Петров', clinic_name: 'Медицински център Русе', notes: 'Оператор кран - специализиран преглед' },
  { employee_name: 'Костадинов Румен', job_title: 'Оператор багер', examination_type: 'periodic', examination_date: '2025-09-05', expiry_date: '2026-03-05', result: 'apt', doctor_name: 'Д-р Георги Петров', clinic_name: 'Медицински център Русе', notes: 'Вибрации + шум, преглед на 6 месеца' },
  { employee_name: 'Денчев Христо', job_title: 'Оператор булдозер', examination_type: 'periodic', examination_date: '2025-09-05', expiry_date: '2026-03-05', result: 'apt', doctor_name: 'Д-р Георги Петров', clinic_name: 'Медицински център Русе', notes: 'Вибрации + шум, преглед на 6 месеца' },
  { employee_name: 'Русев Тодор', job_title: 'Шофьор камион', examination_type: 'periodic', examination_date: '2025-11-01', expiry_date: '2026-11-01', result: 'apt', doctor_name: 'Д-р Ивана Стоянова', clinic_name: 'Медицински център Русе' },
  { employee_name: 'Борисов Димо', job_title: 'Шофьор камион', examination_type: 'periodic', examination_date: '2025-10-18', expiry_date: '2026-10-18', result: 'apt', doctor_name: 'Д-р Ивана Стоянова', clinic_name: 'Медицински център Русе' },
  { employee_name: 'Маринов Спас', job_title: 'Оператор бетон помпа', examination_type: 'periodic', examination_date: '2025-09-12', expiry_date: '2026-09-12', result: 'apt', doctor_name: 'Д-р Георги Петров', clinic_name: 'Медицински център Русе' },
  { employee_name: 'Захариев Йордан', job_title: 'Оператор мотокар', examination_type: 'periodic', examination_date: '2025-10-08', expiry_date: '2026-10-08', result: 'apt', doctor_name: 'Д-р Георги Петров', clinic_name: 'Медицински център Русе', notes: 'Оператор мотокар' },

  // Welding & Metalwork — заварчици
  { employee_name: 'Георгиев Боян', job_title: 'Заварчик', examination_type: 'periodic', examination_date: '2025-08-20', expiry_date: '2026-02-20', result: 'apt', doctor_name: 'Д-р Георги Петров', clinic_name: 'Медицински център Русе', notes: 'UV лъчи + метални пари, преглед на 6 месеца' },
  { employee_name: 'Стоилов Любен', job_title: 'Заварчик', examination_type: 'periodic', examination_date: '2025-08-20', expiry_date: '2026-02-20', result: 'apt', doctor_name: 'Д-р Георги Петров', clinic_name: 'Медицински център Русе', notes: 'UV лъчи + метални пари, преглед на 6 месеца' },
  { employee_name: 'Недялков Васил', job_title: 'Монтажник метал', examination_type: 'periodic', examination_date: '2025-09-15', expiry_date: '2026-03-15', result: 'apt', doctor_name: 'Д-р Георги Петров', clinic_name: 'Медицински център Русе', notes: 'Работа на височина, преглед на 6 месеца' },

  // Administrative
  { employee_name: 'Добрева Силвия', job_title: 'Счетоводител', examination_type: 'periodic', examination_date: '2025-12-01', expiry_date: '2026-12-01', result: 'apt', doctor_name: 'Д-р Ивана Стоянова', clinic_name: 'Медицински център Русе' }
]

// ============================================================
// TRAINING SESSIONS (25) — ОБУЧЕНИЯ ЗБУТ
// ============================================================

export const demoTrainingSessionsBulgaria: Partial<TrainingSession>[] = [
  // General OSH training — Общо обучение ЗБУТ
  { worker_id: 'demo-emp-bg-001', instructor_name: 'Костова Елена', session_date: '2025-11-10', duration_minutes: 180, language: 'bg', location: 'Офис Стройтех', test_score: 90, test_questions_total: 25, test_questions_correct: 22, verification_result: 'admis', notes: 'ЗБУТ - Ръководство' },
  { worker_id: 'demo-emp-bg-002', instructor_name: 'Костова Елена', session_date: '2025-11-10', duration_minutes: 180, language: 'bg', location: 'Офис Стройтех', test_score: 88, test_questions_total: 25, test_questions_correct: 22, verification_result: 'admis', notes: 'ЗБУТ - Ръководство' },
  { worker_id: 'demo-emp-bg-005', instructor_name: 'Костова Елена', session_date: '2025-10-15', duration_minutes: 240, language: 'bg', location: 'Обект Русе', test_score: 86, test_questions_total: 30, test_questions_correct: 25, verification_result: 'admis', notes: 'ЗБУТ - Началник обект' },

  // Height work training — Работа на височина
  { worker_id: 'demo-emp-bg-008', instructor_name: 'Външен обучител', session_date: '2025-09-10', duration_minutes: 480, language: 'bg', location: 'Обект Русе', test_score: 85, test_questions_total: 35, test_questions_correct: 29, verification_result: 'admis', notes: 'Работа на височина >5m - Арматурист' },
  { worker_id: 'demo-emp-bg-009', instructor_name: 'Външен обучител', session_date: '2025-09-10', duration_minutes: 480, language: 'bg', location: 'Обект Русе', test_score: 83, test_questions_total: 35, test_questions_correct: 29, verification_result: 'admis', notes: 'Работа на височина >5m - Арматурист' },
  { worker_id: 'demo-emp-bg-010', instructor_name: 'Външен обучител', session_date: '2025-09-10', duration_minutes: 480, language: 'bg', location: 'Обект Русе', test_score: 81, test_questions_total: 35, test_questions_correct: 28, verification_result: 'admis', notes: 'Работа на височина >5m - Арматурист' },
  { worker_id: 'demo-emp-bg-011', instructor_name: 'Външен обучител', session_date: '2025-10-05', duration_minutes: 360, language: 'bg', location: 'Обект Русе', test_score: 84, test_questions_total: 30, test_questions_correct: 25, verification_result: 'admis', notes: 'Работа на височина - Зидар' },
  { worker_id: 'demo-emp-bg-012', instructor_name: 'Външен обучител', session_date: '2025-10-05', duration_minutes: 360, language: 'bg', location: 'Обект Русе', test_score: 82, test_questions_total: 30, test_questions_correct: 24, verification_result: 'admis', notes: 'Работа на височина - Зидар' },
  { worker_id: 'demo-emp-bg-013', instructor_name: 'Външен обучител', session_date: '2025-09-20', duration_minutes: 360, language: 'bg', location: 'Обект Русе', test_score: 80, test_questions_total: 30, test_questions_correct: 24, verification_result: 'admis', notes: 'Работа на височина - Зидар' },

  // Machinery operator training — Оператори на техника
  { worker_id: 'demo-emp-bg-024', instructor_name: 'Сертифициран инструктор', session_date: '2025-08-15', duration_minutes: 720, language: 'bg', location: 'Техникум Русе', test_score: 92, test_questions_total: 50, test_questions_correct: 46, verification_result: 'admis', notes: 'Сертификат кран оператор - валиден до август 2026' },
  { worker_id: 'demo-emp-bg-025', instructor_name: 'Сертифициран инструктор', session_date: '2025-07-20', duration_minutes: 600, language: 'bg', location: 'Техникум Русе', test_score: 88, test_questions_total: 45, test_questions_correct: 39, verification_result: 'admis', notes: 'Сертификат багерист' },
  { worker_id: 'demo-emp-bg-026', instructor_name: 'Сертифициран инструктор', session_date: '2025-07-20', duration_minutes: 600, language: 'bg', location: 'Техникум Русе', test_score: 86, test_questions_total: 45, test_questions_correct: 38, verification_result: 'admis', notes: 'Сертификат булдозерист' },
  { worker_id: 'demo-emp-bg-031', instructor_name: 'Сертифициран инструктор', session_date: '2025-09-01', duration_minutes: 480, language: 'bg', location: 'База Стройтех', test_score: 87, test_questions_total: 35, test_questions_correct: 30, verification_result: 'admis', notes: 'Сертификат мотокарист' },

  // Welding training — Заваръчни работи
  { worker_id: 'demo-emp-bg-032', instructor_name: 'Инструктор заваряване', session_date: '2025-08-25', duration_minutes: 600, language: 'bg', location: 'Обект Русе', test_score: 91, test_questions_total: 40, test_questions_correct: 36, verification_result: 'admis', notes: 'Заваряване строителни конструкции - MIG/MAG' },
  { worker_id: 'demo-emp-bg-033', instructor_name: 'Инструктор заваряване', session_date: '2025-08-25', duration_minutes: 600, language: 'bg', location: 'Обект Русе', test_score: 89, test_questions_total: 40, test_questions_correct: 35, verification_result: 'admis', notes: 'Заваряване строителни конструкции - MIG/MAG' },

  // Fire safety training — ПБЗ (Пожарна безопасност и защита)
  { worker_id: 'demo-emp-bg-001', instructor_name: 'Инспектор ПБЗ', session_date: '2025-12-01', duration_minutes: 240, language: 'bg', location: 'База Стройтех', test_score: 94, test_questions_total: 30, test_questions_correct: 28, verification_result: 'admis', notes: 'ПБЗ - Екип за реагиране' },
  { worker_id: 'demo-emp-bg-005', instructor_name: 'Инспектор ПБЗ', session_date: '2025-12-01', duration_minutes: 240, language: 'bg', location: 'База Стройтех', test_score: 91, test_questions_total: 30, test_questions_correct: 27, verification_result: 'admis', notes: 'ПБЗ - Екип за реагиране' },
  { worker_id: 'demo-emp-bg-023', instructor_name: 'Инспектор ПБЗ', session_date: '2025-12-01', duration_minutes: 240, language: 'bg', location: 'База Стройтех', test_score: 89, test_questions_total: 30, test_questions_correct: 26, verification_result: 'admis', notes: 'ПБЗ - Екип за реагиране' },

  // First aid training — Първа помощ
  { worker_id: 'demo-emp-bg-002', instructor_name: 'Медик БЧК', session_date: '2025-11-20', duration_minutes: 360, language: 'bg', location: 'База Стройтех', test_score: 92, test_questions_total: 35, test_questions_correct: 32, verification_result: 'admis', notes: 'Първа помощ - Екип на обект' },
  { worker_id: 'demo-emp-bg-006', instructor_name: 'Медик БЧК', session_date: '2025-11-20', duration_minutes: 360, language: 'bg', location: 'База Стройтех', test_score: 88, test_questions_total: 35, test_questions_correct: 30, verification_result: 'admis', notes: 'Първа помощ - Екип на обект' },
  { worker_id: 'demo-emp-bg-023', instructor_name: 'Медик БЧК', session_date: '2025-11-20', duration_minutes: 360, language: 'bg', location: 'База Стройтех', test_score: 86, test_questions_total: 35, test_questions_correct: 30, verification_result: 'admis', notes: 'Първа помощ - Екип на обект' },

  // Electrical safety training — Електробезопасност
  { worker_id: 'demo-emp-bg-024', instructor_name: 'Костова Елена', session_date: '2025-10-10', duration_minutes: 240, language: 'bg', location: 'База Стройтех', test_score: 89, test_questions_total: 30, test_questions_correct: 26, verification_result: 'admis', notes: 'Електробезопасност - Оператор кран' },

  // General workers training — Общо обучение за работници
  { worker_id: 'demo-emp-bg-020', instructor_name: 'Костова Елена', session_date: '2025-09-25', duration_minutes: 120, language: 'bg', location: 'Обект Русе', test_score: 76, test_questions_total: 20, test_questions_correct: 15, verification_result: 'admis', notes: 'ЗБУТ Общо - Некв. работник' },
  { worker_id: 'demo-emp-bg-021', instructor_name: 'Костова Елена', session_date: '2025-09-25', duration_minutes: 120, language: 'bg', location: 'Обект Русе', test_score: 74, test_questions_total: 20, test_questions_correct: 14, verification_result: 'admis', notes: 'ЗБУТ Общо - Некв. работник' }
]

// ============================================================
// SAFETY EQUIPMENT (8) — ОБОРУДВАНЕ ЗА БЕЗОПАСНОСТ
// ============================================================

export const demoEquipmentBulgaria: Partial<SafetyEquipment>[] = [
  { equipment_name: 'Кран кула Potain MC 85A', equipment_type: 'macara', serial_number: 'PT-MC85A-2018-BG-0045', acquisition_date: '2018-06-15', last_inspection_date: '2025-09-10', next_inspection_date: '2026-03-10', status: 'functional', location: 'Обект Русе - Жилищен комплекс', notes: 'Кран 25T - валиден сертификат' },
  { equipment_name: 'Багер Caterpillar 320D', equipment_type: 'macara', serial_number: 'CAT-320D-2020-BG-0112', acquisition_date: '2020-03-20', last_inspection_date: '2025-08-15', next_inspection_date: '2026-02-15', status: 'functional', location: 'База Стройтех', notes: 'Багер 20T - сертифициран' },
  { equipment_name: 'Булдозер Komatsu D61PX', equipment_type: 'macara', serial_number: 'KOM-D61-2019-BG-0078', acquisition_date: '2019-11-10', last_inspection_date: '2025-07-20', next_inspection_date: '2026-01-20', status: 'functional', location: 'Обект Русе - Склад', notes: 'Булдозер - сертифициран' },
  { equipment_name: 'Бетон помпа Putzmeister BSF 36.4', equipment_type: 'macara', serial_number: 'PTZ-BSF36-2021-BG-0034', acquisition_date: '2021-05-15', last_inspection_date: '2025-10-05', next_inspection_date: '2026-04-05', status: 'functional', location: 'Обект Русе - Жилищен комплекс', notes: 'Помпа бетон - проверка на 6 месеца' },
  { equipment_name: 'Мотокар Linde H30T', equipment_type: 'macara', serial_number: 'LIN-H30T-2022-BG-0091', acquisition_date: '2022-04-01', last_inspection_date: '2025-09-05', next_inspection_date: '2026-03-05', status: 'functional', location: 'База Стройтех', notes: 'Мотокар 3T - сертифициран' },
  { equipment_name: 'Предпазни колани EN 361', equipment_type: 'echipament_individual', serial_number: 'HARNESS-2024-LOT-35', acquisition_date: '2024-01-20', last_inspection_date: '2025-11-10', next_inspection_date: '2026-11-10', status: 'functional', location: 'Обект Русе', notes: '35 броя предпазни колани - работа на височина' },
  { equipment_name: 'Защитни каски EN 397', equipment_type: 'echipament_individual', serial_number: 'HELMET-2023-LOT-50', acquisition_date: '2023-02-10', last_inspection_date: '2025-10-15', next_inspection_date: '2028-02-10', status: 'functional', location: 'Обекти', notes: '50 броя защитни каски' },
  { equipment_name: 'Пожарогасители CO2 5kg', equipment_type: 'psi_echipament', serial_number: 'CO2-5KG-2024-LOT-12', acquisition_date: '2024-03-15', last_inspection_date: '2025-09-01', next_inspection_date: '2026-03-01', status: 'functional', location: 'Обекти + База', notes: '12 броя CO2 пожарогасители' }
]

// ============================================================
// GENERATED DOCUMENTS (8) — ГЕНЕРИРАНИ ДОКУМЕНТИ
// ============================================================

export const demoDocumentsBulgaria: Partial<GeneratedDocument>[] = [
  { document_type: 'raport_conformitate', file_name: 'Доклад_Съответствие_ЗБУТ_Q4_2025.pdf', file_size_bytes: 2876543, storage_path: '/documents/stroytech/raport_2025_q4.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { period: 'Q4 2025', generator: 'consultant', sites: '2 обекта' } },
  { document_type: 'fisa_medicina_muncii', file_name: 'Картон_Медицински_Прегледи_Оператори_2025.pdf', file_size_bytes: 1654321, storage_path: '/documents/stroytech/kartoni_mm_operatori.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { department: 'Техника', category: 'Оператори' } },
  { document_type: 'fisa_medicina_muncii', file_name: 'Картон_Медицински_Прегледи_Височина_2025.pdf', file_size_bytes: 1876543, storage_path: '/documents/stroytech/kartoni_mm_visochina.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { risk: 'Работа на височина', workers: 15 } },
  { document_type: 'fisa_echipamente', file_name: 'Списък_Техника_Сертификати_2025.pdf', file_size_bytes: 1456789, storage_path: '/documents/stroytech/tehnika_sertifikati.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { equipment_type: 'Строителна техника', count: 5 } },
  { document_type: 'fisa_echipamente', file_name: 'Списък_ЛПС_2025.pdf', file_size_bytes: 876543, storage_path: '/documents/stroytech/lps.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { equipment_type: 'ЛПС (Лични предпазни средства)', count: 85 } },
  { document_type: 'fisa_instruire', file_name: 'Протоколи_Обучения_Височина_2025.pdf', file_size_bytes: 765432, storage_path: '/documents/stroytech/obuchenia_visochina.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { training_type: 'Работа на височина', sessions: 6 } },
  { document_type: 'altul', file_name: 'План_Безопасност_Здраве_Обекти_2025.pdf', file_size_bytes: 2654321, storage_path: '/documents/stroytech/pbz_2025.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { doc_type: 'ПБЗ (План БЗР)', year: 2025, sites: 2 } },
  { document_type: 'altul', file_name: 'Оценка_Рискове_Строителство_2025.pdf', file_size_bytes: 2987654, storage_path: '/documents/stroytech/ocenka_riskove_2025.pdf', is_locked: true, ignored_notifications_count: 0, generation_context: { doc_type: 'Оценка на риска', year: 2025, risks: ['височина', 'техника', 'заваряване', 'шум'] } }
]

// ============================================================
// ALERTS (8) — ИЗВЕСТИЯ
// ============================================================

export interface DemoAlert {
  id: string
  organization_id: string
  alert_type: 'medical_expiry' | 'equipment_expiry' | 'training_expiry' | 'document_missing' | 'compliance_issue' | 'safety_incident'
  severity: 'info' | 'warning' | 'critical' | 'expired'
  title: string
  message: string
  employee_name?: string
  equipment_name?: string
  due_date?: string
  created_at: string
  is_acknowledged: boolean
}

export const demoAlertsBulgaria: Partial<DemoAlert>[] = [
  { alert_type: 'medical_expiry', severity: 'expired', title: 'Изтекъл медицински преглед', message: 'Медицинският преглед на Рангелов Пламен е изтекъл на 10.07.2025. Необходима е спешна проверка.', employee_name: 'Рангелов Пламен', due_date: '2025-07-10', created_at: '2025-07-11T08:00:00Z', is_acknowledged: false },
  { alert_type: 'medical_expiry', severity: 'expired', title: 'Изтекъл медицински преглед', message: 'Медицинският преглед на Кирилов Ивайло е изтекъл на 25.01.2025. Спешна проверка.', employee_name: 'Кирилов Ивайло', due_date: '2025-01-25', created_at: '2025-01-26T08:00:00Z', is_acknowledged: false },
  { alert_type: 'medical_expiry', severity: 'critical', title: 'Медицински преглед изтича скоро', message: 'Медицинският преглед на Василев Димитър изтича на 15.02.2026 (14 дни). Резервирайте час.', employee_name: 'Василев Димитър', due_date: '2026-02-15', created_at: '2026-02-01T08:00:00Z', is_acknowledged: false },
  { alert_type: 'equipment_expiry', severity: 'critical', title: 'Проверка на техника изтича', message: 'Проверката на Багер Caterpillar 320D изтича на 15.02.2026 (15 дни). Резервирайте инспекция.', equipment_name: 'Багер Caterpillar 320D', due_date: '2026-02-15', created_at: '2026-01-31T08:00:00Z', is_acknowledged: false },
  { alert_type: 'equipment_expiry', severity: 'warning', title: 'Проверка на техника изтича', message: 'Проверката на Булдозер Komatsu D61PX изтича на 20.01.2026 (38 дни).', equipment_name: 'Булдозер Komatsu D61PX', due_date: '2026-01-20', created_at: '2025-12-13T08:00:00Z', is_acknowledged: true },
  { alert_type: 'training_expiry', severity: 'warning', title: 'Обновяване на обучение', message: 'Обучението за работа на височина на Младенов Борислав трябва да се обнови в следващите 60 дни.', employee_name: 'Младенов Борислав', due_date: '2026-04-05', created_at: '2026-02-04T08:00:00Z', is_acknowledged: false },
  { alert_type: 'compliance_issue', severity: 'warning', title: 'Липсващ документ', message: 'Документ "Инструкции за безопасност при заваряване" не е наличен в системата за обект Русе - Склад.', created_at: '2026-01-20T08:00:00Z', is_acknowledged: false },
  { alert_type: 'document_missing', severity: 'info', title: 'Актуализация на оценка на риска', message: 'Оценката на риска за обект Русе - Жилищен комплекс трябва да се актуализира до края на Q1 2026.', created_at: '2026-01-15T08:00:00Z', is_acknowledged: true }
]

// ============================================================
// PENALTIES — BULGARIAN LEGISLATION (ЗЗБУТ)
// ============================================================
// References Bulgarian legislation ZZBBUT (Закон за здравословни и безопасни условия на труд)
// Authority: ИА "ГИТ" (Изпълнителна агенция "Главна инспекция по труда")
// Currency: EUR (Bulgaria uses BGN but EU penalties often in EUR)
// ============================================================

export interface Penalty {
  id: string
  article: string
  offense: string
  offenseBG: string
  minFine: number
  maxFine: number
  currency: 'EUR'
  authority: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
}

export const penaltiesBulgaria: Penalty[] = [
  {
    id: 'bg-pen-001',
    article: 'ЗЗБУТ чл. 415 (1)',
    offense: 'Absența serviciului de securitate și sănătate în muncă',
    offenseBG: 'Липса на служба по безопасност и здраве при работа',
    minFine: 1500,
    maxFine: 5000,
    currency: 'EUR',
    authority: 'ИА "ГИТ"',
    severity: 'critical',
    description: 'Angajatorul nu a organizat serviciul ZBUT conform legislației, expunând lucrătorii la riscuri negestionate.'
  },
  {
    id: 'bg-pen-002',
    article: 'ЗЗБУТ чл. 416 (2)',
    offense: 'Absența evaluării riscurilor profesionale',
    offenseBG: 'Липса на оценка на риска',
    minFine: 1000,
    maxFine: 4000,
    currency: 'EUR',
    authority: 'ИА "ГИТ"',
    severity: 'critical',
    description: 'Angajatorul nu a efectuat evaluarea riscurilor pentru locurile de muncă, încălcând obligația fundamentală de prevenire.'
  },
  {
    id: 'bg-pen-003',
    article: 'ЗЗБУТ чл. 417 (1)',
    offense: 'Instruire OSH insuficientă sau inexistentă',
    offenseBG: 'Липса на инструктаж по безопасност и здраве',
    minFine: 500,
    maxFine: 2000,
    currency: 'EUR',
    authority: 'ИА "ГИТ"',
    severity: 'high',
    description: 'Lucrătorii nu au primit instruirea obligatorie ZBUT, fiind expuși la pericole fără cunoștințe de prevenire.'
  },
  {
    id: 'bg-pen-004',
    article: 'ЗЗБУТ чл. 418 (3)',
    offense: 'Absența controalelor medicale profilactice',
    offenseBG: 'Липса на профилактични медицински прегледи',
    minFine: 800,
    maxFine: 3000,
    currency: 'EUR',
    authority: 'ИА "ГИТ"',
    severity: 'high',
    description: 'Lucrătorii nu au efectuat controale medicale obligatorii pentru funcțiile cu risc, încălcând legislația sanitară.'
  },
  {
    id: 'bg-pen-005',
    article: 'ЗЗБУТ чл. 419 (1)',
    offense: 'Nerespectarea normelor de securitate la lucrul la înălțime',
    offenseBG: 'Неспазване на изискванията за работа на височина',
    minFine: 1200,
    maxFine: 4500,
    currency: 'EUR',
    authority: 'ИА "ГИТ"',
    severity: 'critical',
    description: 'Lucrări la înălțime executate fără sisteme de protecție antipădere sau fără instruire specifică, risc vital pentru lucrători.'
  },
  {
    id: 'bg-pen-006',
    article: 'ЗЗБУТ чл. 420 (2)',
    offense: 'EIP-uri neconforme sau insuficiente',
    offenseBG: 'Липса или неизправни ЛПС (Лични предпазни средства)',
    minFine: 600,
    maxFine: 2500,
    currency: 'EUR',
    authority: 'ИА "ГИТ"',
    severity: 'medium',
    description: 'Echipamentele individuale de protecție nu sunt asigurate sau nu sunt conforme cu standardele EN, expunând lucrătorii.'
  },
  {
    id: 'bg-pen-007',
    article: 'ЗЗБУТ чл. 421 (4)',
    offense: 'Nerespectarea măsurilor de protecție împotriva incendiilor',
    offenseBG: 'Неспазване на противопожарни мерки',
    minFine: 700,
    maxFine: 3000,
    currency: 'EUR',
    authority: 'ИА "ГИТ"',
    severity: 'high',
    description: 'Lipsa stingătoarelor funcționale, căi de evacuare blocate sau instruire PSI inexistentă.'
  },
  {
    id: 'bg-pen-008',
    article: 'ЗЗБУТ чл. 422 (1)',
    offense: 'Nerespectarea cerințelor pentru echipamente de lucru',
    offenseBG: 'Неизправно работно оборудване',
    minFine: 1000,
    maxFine: 4000,
    currency: 'EUR',
    authority: 'ИА "ГИТ"',
    severity: 'critical',
    description: 'Utilaje sau scule defecte utilizate în producție, fără verificări tehnice periodice conform legislației.'
  },
  {
    id: 'bg-pen-009',
    article: 'ЗЗБУТ чл. 423 (2)',
    offense: 'Neinformarea autorităților despre accidente de muncă',
    offenseBG: 'Неподаване на сигнал за трудова злополука',
    minFine: 1500,
    maxFine: 6000,
    currency: 'EUR',
    authority: 'ИА "ГИТ"',
    severity: 'critical',
    description: 'Angajatorul nu a notificat GIT despre accidente grave, încălcând procedura obligatorie de investigare.'
  },
  {
    id: 'bg-pen-010',
    article: 'ЗЗБУТ чл. 424 (3)',
    offense: 'Depășirea valorilor maxime admise pentru factori nocivi',
    offenseBG: 'Превишени ПДК (Пределно допустими концентрации)',
    minFine: 1200,
    maxFine: 5000,
    currency: 'EUR',
    authority: 'ИА "ГИТ"',
    severity: 'critical',
    description: 'Niveluri de zgomot, substanțe chimice sau vibrații peste limitele legale, afectând sănătatea lucrătorilor.'
  }
]

// ============================================================
// BULGARIAN LEGISLATION DATABASE
// ============================================================

export interface LegislativeAct {
  id: string
  title: string
  titleBG: string
  number: string
  domain: 'ssm' | 'psi' | 'medical' | 'general'
  description: string
}

export const legislationBulgaria: LegislativeAct[] = [
  {
    id: 'bg-zzbbut',
    title: 'Legea privind condițiile de muncă sănătoase și sigure',
    titleBG: 'Закон за здравословни и безопасни условия на труд (ЗЗБУТ)',
    number: 'ДВ бр. 124 от 1997г., изм. ДВ бр. 102 от 2023г.',
    domain: 'ssm',
    description: 'Actul normativ fundamental pentru securitatea și sănătatea în muncă în Bulgaria, stabilind obligațiile angajatorului, drepturile lucrătorilor, organizarea serviciilor ZBUT și sancțiunile pentru încălcări.'
  },
  {
    id: 'bg-kz',
    title: 'Codul muncii',
    titleBG: 'Кодекс на труда (КТ)',
    number: 'ДВ бр. 26 от 1986г., изм. ДВ бр. 105 от 2024г.',
    domain: 'general',
    description: 'Reglementează relațiile de muncă în Bulgaria, inclusiv contracte, timp de lucru, concedii, și responsabilități generale ale angajatorului și angajatului.'
  },
  {
    id: 'bg-naredba-1',
    title: 'Ordin Nr. 1 privind organizarea serviciului de securitate și sănătate',
    titleBG: 'Наредба № 1 за реда, начина и периодичността на извършване на оценка на риска',
    number: 'ДВ бр. 96 от 2011г.',
    domain: 'ssm',
    description: 'Definește metodologia de evaluare a riscurilor profesionale, frecvența reevaluărilor și documentația necesară.'
  },
  {
    id: 'bg-naredba-5',
    title: 'Ordin Nr. 5 privind controlul medical profilactic',
    titleBG: 'Наредба № 5 за реда и начина за провеждане на периодично обучение и инструктаж на работниците и служителите',
    number: 'ДВ бр. 102 от 2008г.',
    domain: 'ssm',
    description: 'Stabilește tipurile de instruire obligatorie (inițială, periodică, la locul de muncă), duratele și tematicile pentru diferite profesii.'
  },
  {
    id: 'bg-naredba-3',
    title: 'Ordin Nr. 3 privind normele minime de securitate la lucrul la înălțime',
    titleBG: 'Наредба № 3 за минималните изисквания за безопасност и опазване на здравето на работещите при извършване на строителни и монтажни работи',
    number: 'ДВ бр. 37 от 2004г.',
    domain: 'ssm',
    description: 'Reglementări specifice pentru construcții: lucrul la înălțime, săpături, eșafodaje, utilizarea utilajelor, măsuri de protecție colectivă și individuală.'
  },
  {
    id: 'bg-naredba-7',
    title: 'Ordin Nr. 7 privind controalele medicale ale lucrătorilor',
    titleBG: 'Наредба № 7 за минималните изисквания за безопасност и опазване здравето на работещите при използване на работно оборудване',
    number: 'ДВ бр. 92 от 2005г.',
    domain: 'ssm',
    description: 'Cerințe pentru verificarea, întreținerea și utilizarea în siguranță a echipamentelor de lucru, inclusiv macarale, utilaje, scule electrice.'
  },
  {
    id: 'bg-naredba-4',
    title: 'Ordin Nr. 4 privind protecția împotriva incendiilor',
    titleBG: 'Наредба № 4 за реда за провеждане на периодичните медицински прегледи',
    number: 'ДВ бр. 120 от 2009г., изм. ДВ бр. 78 от 2023г.',
    domain: 'medical',
    description: 'Stabilește tipurile de controale medicale (la angajare, periodice, de control), categoriile de lucrători expuși și frecvența examinărilor.'
  },
  {
    id: 'bg-zakon-pbzn',
    title: 'Legea privind protecția împotriva incendiilor și salvarea',
    titleBG: 'Закон за защита при бедствия (ЗЗБ)',
    number: 'ДВ бр. 102 از 2006г., изм. ДВ бр. 98 от 2024г.',
    domain: 'psi',
    description: 'Reglementări privind prevenirea incendiilor, echipamente de stingere, planuri de evacuare, instruirea angajaților și responsabilități ale angajatorului.'
  },
  {
    id: 'bg-naredba-pdk',
    title: 'Ordin privind valorile maxime admise pentru agenți nocivi',
    titleBG: 'Наредба № 13 за защита на работещите от рискове, свързани с експозиция на химични агенти при работа',
    number: 'ДВ бр. 54 от 2004г., изм. ДВ бр. 45 от 2023г.',
    domain: 'ssm',
    description: 'Definește valorile maxime admise (PDK) pentru substanțe chimice, niveluri de zgomot, vibrații și alți factori nocivi în mediul de lucru.'
  },
  {
    id: 'bg-naredba-lps',
    title: 'Ordin privind echipamentele individuale de protecție',
    titleBG: 'Наредба № 3 за минималните изисквания за безопасност и здраве при използване на лични предпазни средства',
    number: 'ДВ бр. 46 от 2001г.',
    domain: 'ssm',
    description: 'Cerințe minime pentru LPS-uri (căști, mănuși, ochelari, centuri de siguranță), obligația angajatorului de a le asigura gratuit și conform riscurilor.'
  }
]

export default {
  demoOrganizationBulgaria,
  demoEmployeesBulgaria,
  demoMedicalExaminationsBulgaria,
  demoTrainingSessionsBulgaria,
  demoEquipmentBulgaria,
  demoDocumentsBulgaria,
  demoAlertsBulgaria,
  penaltiesBulgaria,
  legislationBulgaria
}
