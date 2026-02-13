-- ============================================================================
-- SEED DATA pentru s-s-m.ro
-- Organizație demo cu angajați, instruiri, examinări medicale, echipamente
-- ============================================================================

-- 1. ORGANIZAȚIE DEMO
INSERT INTO organizations (id, name, cui, registration_number, address, city, county, country, phone, email, industry, employee_count, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Demo Construct SRL',
  '12345678',
  'J40/1234/2020',
  'Strada Constructorilor nr. 15',
  'București',
  'București',
  'România',
  '+40212345678',
  'contact@democonstruct.ro',
  'Construcții',
  25,
  NOW(),
  NOW()
);

-- 2. ANGAJAȚI (25 persoane cu nume românești)
INSERT INTO employees (id, organization_id, first_name, last_name, email, phone, cnp, position, department, hire_date, employment_type, status, created_at, updated_at)
VALUES
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Ion', 'Popescu', 'ion.popescu@democonstruct.ro', '+40721234501', '1850315123456', 'Șef șantier', 'Producție', '2020-01-15', 'full_time', 'active', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Maria', 'Ionescu', 'maria.ionescu@democonstruct.ro', '+40721234502', '2900512234567', 'Inginer constructor', 'Producție', '2020-02-01', 'full_time', 'active', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Vasile', 'Georgescu', 'vasile.georgescu@democonstruct.ro', '+40721234503', '1780823345678', 'Maistru', 'Producție', '2020-03-10', 'full_time', 'active', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Elena', 'Dumitrescu', 'elena.dumitrescu@democonstruct.ro', '+40721234504', '2851204456789', 'Contabil șef', 'Financiar', '2020-01-20', 'full_time', 'active', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Andrei', 'Constantin', 'andrei.constantin@democonstruct.ro', '+40721234505', '1920617567890', 'Șofer autocamion', 'Transport', '2020-04-05', 'full_time', 'active', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Ana', 'Stoica', 'ana.stoica@democonstruct.ro', '+40721234506', '2880923678901', 'HR Manager', 'Resurse Umane', '2020-02-15', 'full_time', 'active', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Gheorghe', 'Popa', 'gheorghe.popa@democonstruct.ro', '+40721234507', '1750418789012', 'Sudor', 'Producție', '2021-01-10', 'full_time', 'active', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Mihaela', 'Marin', 'mihaela.marin@democonstruct.ro', '+40721234508', '2910226890123', 'Secretar', 'Administrativ', '2021-03-01', 'full_time', 'active', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Constantin', 'Radu', 'constantin.radu@democonstruct.ro', '+40721234509', '1830709901234', 'Electrician', 'Producție', '2021-05-15', 'full_time', 'active', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Daniela', 'Stancu', 'daniela.stancu@democonstruct.ro', '+40721234510', '2870831012345', 'Inginer', 'Producție', '2021-06-01', 'full_time', 'active', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Nicolae', 'Vasilescu', 'nicolae.vasilescu@democonstruct.ro', '+40721234511', '1760520123456', 'Instalator', 'Producție', '2021-07-10', 'full_time', 'active', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Ioana', 'Mocanu', 'ioana.mocanu@democonstruct.ro', '+40721234512', '2900714234567', 'Arhitect', 'Proiectare', '2021-09-01', 'full_time', 'active', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Florin', 'Dobre', 'florin.dobre@democonstruct.ro', '+40721234513', '1880305345678', 'Mecanic utilaje', 'Întreținere', '2022-01-15', 'full_time', 'active', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Cristina', 'Nedelcu', 'cristina.nedelcu@democonstruct.ro', '+40721234514', '2860419456789', 'Economist', 'Financiar', '2022-02-01', 'full_time', 'active', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Marius', 'Enache', 'marius.enache@democonstruct.ro', '+40721234515', '1910628567890', 'Fierar betonist', 'Producție', '2022-03-10', 'full_time', 'active', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Simona', 'Tudor', 'simona.tudor@democonstruct.ro', '+40721234516', '2890811678901', 'Jurist', 'Legal', '2022-04-05', 'full_time', 'active', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Petru', 'Cristea', 'petru.cristea@democonstruct.ro', '+40721234517', '1790122789012', 'Zidар', 'Producție', '2022-05-15', 'full_time', 'active', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Gabriela', 'Marinescu', 'gabriela.marinescu@democonstruct.ro', '+40721234518', '2920507890123', 'IT Specialist', 'IT', '2022-06-01', 'full_time', 'active', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Adrian', 'Lungu', 'adrian.lungu@democonstruct.ro', '+40721234519', '1840913901234', 'Pavator', 'Producție', '2023-01-10', 'full_time', 'active', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Raluca', 'Barbulescu', 'raluca.barbulescu@democonstruct.ro', '+40721234520', '2880625012345', 'Marketing Manager', 'Marketing', '2023-02-15', 'full_time', 'active', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Sorin', 'Florea', 'sorin.florea@democonstruct.ro', '+40721234521', '1870318123456', 'Operator excavator', 'Producție', '2023-03-20', 'full_time', 'active', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Lavinia', 'Preda', 'lavinia.preda@democonstruct.ro', '+40721234522', '2910429234567', 'Asistent manager', 'Administrativ', '2023-05-01', 'full_time', 'active', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Bogdan', 'Ilie', 'bogdan.ilie@democonstruct.ro', '+40721234523', '1930804345678', 'Tâmplar', 'Producție', '2023-07-10', 'full_time', 'active', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Alina', 'Stefan', 'alina.stefan@democonstruct.ro', '+40721234524', '2850211456789', 'Administrator', 'Administrativ', '2024-01-15', 'full_time', 'active', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Laurentiu', 'Matei', 'laurentiu.matei@democonstruct.ro', '+40721234525', '1960522567890', 'Responsabil SSM', 'SSM', '2024-02-01', 'full_time', 'active', NOW(), NOW());

-- 3. INSTRUIRI SSM (10 training sessions)
INSERT INTO trainings (id, organization_id, employee_id, training_type, training_date, expiry_date, instructor_name, duration_hours, status, notes, created_at, updated_at)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  e.id,
  CASE (row_number() OVER ()) % 3
    WHEN 0 THEN 'SSM periodic'
    WHEN 1 THEN 'PSI'
    ELSE 'Lucru la înălțime'
  END,
  DATE '2024-01-15' + (row_number() OVER ()) * INTERVAL '10 days',
  DATE '2025-01-15' + (row_number() OVER ()) * INTERVAL '10 days',
  CASE (row_number() OVER ()) % 2
    WHEN 0 THEN 'Ing. Daniel Popescu'
    ELSE 'Ing. Alexandra Mihail'
  END,
  CASE (row_number() OVER ()) % 3
    WHEN 0 THEN 8
    WHEN 1 THEN 4
    ELSE 6
  END,
  'completed',
  'Instruire realizată conform normelor în vigoare',
  NOW(),
  NOW()
FROM employees e
WHERE e.organization_id = '00000000-0000-0000-0000-000000000001'
LIMIT 10;

-- 4. EXAMINĂRI MEDICALE (25 medical exams - câte unul per angajat)
INSERT INTO medical_exams (id, organization_id, employee_id, exam_type, exam_date, expiry_date, medical_center, doctor_name, result, restrictions, notes, created_at, updated_at)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  e.id,
  CASE (row_number() OVER ()) % 3
    WHEN 0 THEN 'Angajare'
    WHEN 1 THEN 'Periodic'
    ELSE 'Control'
  END,
  DATE '2024-01-01' + (row_number() OVER ()) * INTERVAL '5 days',
  DATE '2025-01-01' + (row_number() OVER ()) * INTERVAL '5 days',
  CASE (row_number() OVER ()) % 3
    WHEN 0 THEN 'Clinica Medicală Sănătatea'
    WHEN 1 THEN 'Centrul Medical ProVita'
    ELSE 'Policlinica Centrală'
  END,
  CASE (row_number() OVER ()) % 4
    WHEN 0 THEN 'Dr. Andreea Popescu'
    WHEN 1 THEN 'Dr. Mihai Ionescu'
    WHEN 2 THEN 'Dr. Carmen Vasile'
    ELSE 'Dr. George Stanciu'
  END,
  CASE (row_number() OVER ()) % 10
    WHEN 0 THEN 'apt_with_restrictions'
    ELSE 'apt'
  END,
  CASE (row_number() OVER ()) % 10
    WHEN 0 THEN 'Nu se recomandă lucrul la înălțime'
    ELSE NULL
  END,
  'Examinare medicală de medicina muncii',
  NOW(),
  NOW()
FROM employees e
WHERE e.organization_id = '00000000-0000-0000-0000-000000000001';

-- 5. ECHIPAMENTE (15 items)
INSERT INTO equipment (id, organization_id, name, category, manufacturer, model, serial_number, purchase_date, last_inspection_date, next_inspection_date, status, location, notes, created_at, updated_at)
VALUES
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Excavator Caterpillar', 'Utilaje grele', 'Caterpillar', '320D', 'CAT320D-2020-001', '2020-03-15', '2024-01-10', '2025-01-10', 'operational', 'Șantier Pipera', 'ITP la zi', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Automacara Liebherr', 'Utilaje grele', 'Liebherr', 'LTM 1050', 'LIE1050-2019-002', '2019-06-20', '2024-02-05', '2025-02-05', 'operational', 'Șantier Militari', 'ISCIR la zi', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Betoniera Schwing', 'Utilaje grele', 'Schwing', 'S32X', 'SCH32X-2021-003', '2021-01-10', '2024-01-20', '2025-01-20', 'operational', 'Șantier Drumul Taberei', 'Revizie tehnică efectuată', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Generator Caterpillar', 'Echipamente electrice', 'Caterpillar', 'XQ60', 'CATXQ60-2020-004', '2020-08-15', '2024-03-01', '2025-03-01', 'operational', 'Depozit', 'Funcționare optimă', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Aparat sudură Lincoln', 'Echipamente sudură', 'Lincoln Electric', 'Invertec V350', 'LINV350-2022-005', '2022-05-10', '2024-02-15', '2025-02-15', 'operational', 'Atelier', 'Verificare electrică OK', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Compactor Bomag', 'Utilaje grele', 'Bomag', 'BW 213 D', 'BOM213D-2020-006', '2020-11-20', '2024-01-25', '2025-01-25', 'operational', 'Șantier Pipera', 'Revizie la zi', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Schela modulară 200mp', 'Echipamente siguranță', 'Layher', 'Allround', 'LAY-AR-2019-007', '2019-04-10', '2024-02-10', '2025-02-10', 'operational', 'Șantier Militari', 'Inspecție tehnică efectuată', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Platformă elevatoare JLG', 'Utilaje grele', 'JLG', '660SJ', 'JLG660-2021-008', '2021-07-15', '2024-03-05', '2025-03-05', 'operational', 'Șantier Drumul Taberei', 'ISCIR valabil', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Încărcător frontal Volvo', 'Utilaje grele', 'Volvo', 'L90H', 'VOLL90-2020-009', '2020-02-20', '2024-01-30', '2025-01-30', 'operational', 'Șantier Pipera', 'Service complet efectuat', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Buldozer Komatsu', 'Utilaje grele', 'Komatsu', 'D65PX', 'KOMD65-2019-010', '2019-09-10', '2024-02-20', '2025-02-20', 'operational', 'Șantier Militari', 'Mentenanță preventivă la zi', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Stivuitor Linde', 'Utilaje depozit', 'Linde', 'H30D', 'LINH30-2022-011', '2022-03-15', '2024-03-10', '2025-03-10', 'operational', 'Depozit', 'ISCIR valabil', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Tăietor beton Husqvarna', 'Echipamente mici', 'Husqvarna', 'FS 524', 'HUSFS-2021-012', '2021-10-05', '2024-02-25', '2025-02-25', 'operational', 'Atelier', 'Verificare tehnică OK', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Pompă beton Putzmeister', 'Utilaje grele', 'Putzmeister', 'M47-5', 'PUTM47-2020-013', '2020-12-10', '2024-01-15', '2025-01-15', 'operational', 'Șantier Drumul Taberei', 'Revizie completă', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Freză asfalt Wirtgen', 'Utilaje grele', 'Wirtgen', 'W 50 DC', 'WIRW50-2019-014', '2019-05-20', '2024-03-15', '2025-03-15', 'maintenance', 'Service', 'În reparație - sistem hidraulic', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Cilindru compactor Dynapac', 'Utilaje grele', 'Dynapac', 'CA2500D', 'DYNCA-2021-015', '2021-08-25', '2024-02-28', '2025-02-28', 'operational', 'Șantier Pipera', 'Funcționare normală', NOW(), NOW());

-- 6. ALERTE (10 alerts)
INSERT INTO alerts (id, organization_id, type, severity, title, description, due_date, status, assigned_to, created_at, updated_at)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  CASE (row_number() OVER ()) % 4
    WHEN 0 THEN 'medical_exam'
    WHEN 1 THEN 'training'
    WHEN 2 THEN 'equipment_inspection'
    ELSE 'document_expiry'
  END,
  CASE (row_number() OVER ()) % 3
    WHEN 0 THEN 'high'
    WHEN 1 THEN 'medium'
    ELSE 'low'
  END,
  CASE (row_number() OVER ()) % 4
    WHEN 0 THEN 'Examinare medicală expiră în 30 zile'
    WHEN 1 THEN 'Instruire SSM necesară'
    WHEN 2 THEN 'Inspecție utilaj programată'
    ELSE 'Document expiră în curând'
  END,
  CASE (row_number() OVER ()) % 4
    WHEN 0 THEN 'Examinarea medicală pentru angajatul ' || e.first_name || ' ' || e.last_name || ' expiră la data de ' || TO_CHAR(CURRENT_DATE + INTERVAL '30 days', 'DD.MM.YYYY')
    WHEN 1 THEN 'Este necesară programarea instruirii SSM periodice pentru angajatul ' || e.first_name || ' ' || e.last_name
    WHEN 2 THEN 'Inspecția tehnică pentru echipamentul din dotare trebuie efectuată în termen de 15 zile'
    ELSE 'Documentul de conformitate expiră în următoarele 45 zile și necesită reînnoire'
  END,
  CURRENT_DATE + (row_number() OVER ()) * INTERVAL '15 days',
  CASE (row_number() OVER ()) % 3
    WHEN 0 THEN 'pending'
    WHEN 1 THEN 'in_progress'
    ELSE 'pending'
  END,
  e.id,
  NOW(),
  NOW()
FROM employees e
WHERE e.organization_id = '00000000-0000-0000-0000-000000000001'
LIMIT 10;

-- 7. NOTIFICĂRI (50 notifications)
INSERT INTO notifications (id, user_id, type, title, message, read, created_at)
SELECT
  gen_random_uuid(),
  e.id,
  CASE (row_number() OVER ()) % 5
    WHEN 0 THEN 'alert'
    WHEN 1 THEN 'training'
    WHEN 2 THEN 'medical'
    WHEN 3 THEN 'document'
    ELSE 'system'
  END,
  CASE (row_number() OVER ()) % 10
    WHEN 0 THEN 'Examinare medicală programată'
    WHEN 1 THEN 'Instruire SSM obligatorie'
    WHEN 2 THEN 'Document adăugat'
    WHEN 3 THEN 'Actualizare profil'
    WHEN 4 THEN 'Alertă de siguranță'
    WHEN 5 THEN 'Inspecție echipament'
    WHEN 6 THEN 'Mesaj nou de la administrator'
    WHEN 7 THEN 'Raport lunar disponibil'
    WHEN 8 THEN 'Certificat actualizat'
    ELSE 'Notificare sistem'
  END,
  CASE (row_number() OVER ()) % 10
    WHEN 0 THEN 'Aveți programată examinarea medicală pentru data de ' || TO_CHAR(CURRENT_DATE + INTERVAL '20 days', 'DD.MM.YYYY') || ' la ora 10:00'
    WHEN 1 THEN 'Este obligatorie participarea la instruirea SSM din data de ' || TO_CHAR(CURRENT_DATE + INTERVAL '10 days', 'DD.MM.YYYY')
    WHEN 2 THEN 'A fost adăugat un document nou în sistemul dumneavoastră. Vă rugăm să îl verificați.'
    WHEN 3 THEN 'Vă rugăm să vă actualizați datele de contact în profil pentru a primi notificări corecte.'
    WHEN 4 THEN 'Atenție: Au fost raportate condiții meteo nefavorabile pe șantier. Respectați măsurile de siguranță.'
    WHEN 5 THEN 'Echipamentul de protecție trebuie inspectat înainte de următoarea utilizare.'
    WHEN 6 THEN 'Administratorul a trimis un mesaj important privind programul săptămânii viitoare.'
    WHEN 7 THEN 'Raportul lunar de SSM pentru luna ' || TO_CHAR(CURRENT_DATE, 'Month') || ' este disponibil în secțiunea Rapoarte.'
    WHEN 8 THEN 'Certificatul dumneavoastră de calificare a fost actualizat cu succes în sistem.'
    ELSE 'Sistemul a fost actualizat. Vă rugăm să vă reconectați pentru a beneficia de noile funcționalități.'
  END,
  (row_number() OVER ()) % 3 = 0, -- unele citite, altele nu
  NOW() - (row_number() OVER ()) * INTERVAL '12 hours'
FROM employees e
WHERE e.organization_id = '00000000-0000-0000-0000-000000000001'
CROSS JOIN generate_series(1, 2) -- 25 employees * 2 = 50 notifications
LIMIT 50;

-- ============================================================================
-- SUCCES: Date seed inserate pentru Demo Construct SRL
-- - 1 organizație
-- - 25 angajați
-- - 10 instruiri SSM
-- - 25 examinări medicale
-- - 15 echipamente
-- - 10 alerte
-- - 50 notificări
-- ============================================================================
