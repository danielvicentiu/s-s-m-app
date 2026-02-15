-- ============================================================================
-- B4_bodies_MK_ME_IE_CH_LU_LI.sql
-- Professional Bodies for MK, ME, IE, CH, LU, LI
-- Generated: 2026-02-15
-- ============================================================================

-- Insert professional bodies for 6 countries
INSERT INTO professional_bodies (
  code, country_code, name_local, name_en, abbreviation,
  body_type, website_url, register_url, professions_covered,
  contact_email, contact_phone, address, notes
) VALUES

-- ============================================================================
-- NORTH MACEDONIA (MK)
-- ============================================================================
('MK-CRM', 'MK', 'Централен Регистар на Република Северна Македонија', 'Central Registry of North Macedonia', 'CRM',
  'register', 'https://crm.com.mk/en', 'https://e-submit.crm.com.mk/eFiling/en/home.aspx',
  ARRAY['all_legal_entities'], 'e-registracija@crm.org.mk', '+389 2 3288-298',
  'Kuzman Josifovski Pitu, Skopje 1300', 'Official commercial register'),

('MK-PRO', 'MK', 'Управа за јавни приходи', 'Public Revenue Office', 'UJP',
  'agency', 'https://www.ujp.gov.mk', NULL,
  ARRAY['all_legal_entities'], NULL, '+389 2 3299 500',
  'Boulevard Kuzman Josifovski Pitu 1, 1000 Skopje', 'Tax authority'),

('MK-LKM', 'MK', 'Лекарска комора на РСМ', 'Doctor''s Chamber of North Macedonia', 'LKM',
  'chamber', 'https://www.lkm.org.mk/en', 'https://lkm.org.mk/en/record/102/838/registry-of-doctors',
  ARRAY['doctor'], 'info@lkm.org.mk', NULL, 'Skopje', 'Issues working licences for doctors'),

('MK-DENT', 'MK', 'Стоматолошка комора на РСМ', 'Dental Chamber of North Macedonia', 'SKM',
  'chamber', NULL, NULL, ARRAY['dentist'], NULL, NULL, 'Skopje', 'Dental practitioners chamber'),

('MK-PHARM', 'MK', 'Фармацевтска комора на РСМ', 'Pharmaceutical Chamber of North Macedonia', 'FKM',
  'chamber', NULL, NULL, ARRAY['pharmacist'], NULL, NULL, 'Skopje', 'Pharmacists chamber'),

('MK-VET', 'MK', 'Ветеринарна комора на РСМ', 'Veterinary Chamber of North Macedonia', 'VKM',
  'chamber', NULL, NULL, ARRAY['veterinarian'], NULL, NULL, 'Skopje', 'Veterinary practitioners chamber'),

('MK-BAR', 'MK', 'Адвокатска комора на РСМ', 'Bar Association of North Macedonia', 'AKRSM',
  'bar', NULL, NULL, ARRAY['lawyer'], NULL, NULL, 'Skopje', 'Bar association for lawyers'),

('MK-NOT', 'MK', 'Нотарска комора на РСМ', 'Notary Chamber of North Macedonia', 'NKRSM',
  'chamber', NULL, NULL, ARRAY['notary'], NULL, NULL, 'Skopje', 'Notaries chamber'),

('MK-ARCH', 'MK', 'Комора на архитекти на РСМ', 'Chamber of Architects of North Macedonia', 'KARSM',
  'chamber', NULL, NULL, ARRAY['architect'], NULL, NULL, 'Skopje', 'Architects chamber'),

('MK-ACC', 'MK', 'Институт на овластени ревизори на РСМ', 'Institute of Certified Auditors', 'IOR',
  'institute', NULL, NULL, ARRAY['accountant'], NULL, NULL, 'Skopje', 'Accountants and auditors'),

('MK-LISP', 'MK', 'Државен инспекторат за труд', 'State Labour Inspectorate', 'DIT',
  'inspectorate', NULL, NULL, ARRAY['safety_manager'], NULL, NULL, 'Skopje', 'Occupational safety and health inspectorate'),

('MK-FIRE', 'MK', 'Дирекција за заштита и спасување', 'Directorate for Protection and Rescue', 'DZS',
  'agency', NULL, NULL, ARRAY['fire_safety_manager'], NULL, NULL, 'Skopje', 'Fire safety and civil protection'),

('MK-HEALTH', 'MK', 'Министерство за здравство', 'Ministry of Health', 'MZ',
  'ministry', NULL, NULL, ARRAY['doctor','dentist','pharmacist','nurse','midwife'],
  NULL, NULL, 'Skopje', 'Health authority'),

-- ============================================================================
-- MONTENEGRO (ME)
-- ============================================================================
('ME-CRPS', 'ME', 'Централни регистар привредних субјеката', 'Central Registry of Business Entities', 'CRPS',
  'register', 'http://www.pretraga.crps.me', NULL,
  ARRAY['all_legal_entities'], 'crps.tax@gov.me', '+382 20 230 858',
  'RBC Business Center, Ilije Plamenca 2, 81000 Podgorica', 'Official commercial register'),

('ME-TAX', 'ME', 'Пореска управа', 'Tax Administration', 'PU',
  'agency', 'https://www.poreskauprava.gov.me', 'https://eprijava.tax.gov.me',
  ARRAY['all_legal_entities'], NULL, '+382 20 448 169',
  'Šarla De Gola 2, 20000 Podgorica', 'Tax authority'),

('ME-LKC', 'ME', 'Љекарска комора Црне Горе', 'Medical Chamber of Montenegro', 'LKCG',
  'chamber', 'https://ljekarskakomora.me', NULL,
  ARRAY['doctor'], 'lkomcg@t-com.me', '+382 20 230-129',
  'Ul. Slobode br. 64/1, 81000 Podgorica', 'Medical doctors chamber'),

('ME-DENT', 'ME', 'Стоматолошка комора Црне Горе', 'Dental Chamber of Montenegro', 'SKCG',
  'chamber', NULL, NULL, ARRAY['dentist'], NULL, NULL, 'Podgorica', 'Dental practitioners chamber'),

('ME-PHARM', 'ME', 'Фармацеутска комора Црне Горе', 'Pharmaceutical Chamber of Montenegro', 'FKCG',
  'chamber', NULL, NULL, ARRAY['pharmacist'], NULL, NULL, 'Podgorica', 'Pharmacists chamber'),

('ME-VET', 'ME', 'Ветеринарска комора Црне Горе', 'Veterinary Chamber of Montenegro', 'VKCG',
  'chamber', NULL, NULL, ARRAY['veterinarian'], NULL, NULL, 'Podgorica', 'Veterinary practitioners chamber'),

('ME-BAR', 'ME', 'Адвокатска комора Црне Горе', 'Bar Association of Montenegro', 'AKCG',
  'bar', NULL, NULL, ARRAY['lawyer'], NULL, NULL, 'Podgorica', 'Bar association for lawyers'),

('ME-NOT', 'ME', 'Нотарска комора Црне Горе', 'Notary Chamber of Montenegro', 'NKCG',
  'chamber', NULL, NULL, ARRAY['notary'], NULL, NULL, 'Podgorica', 'Notaries chamber'),

('ME-ARCH', 'ME', 'Инжењерска комора Црне Горе', 'Engineering Chamber of Montenegro', 'IKCG',
  'chamber', NULL, NULL, ARRAY['architect','engineer'], NULL, NULL, 'Podgorica', 'Engineers and architects chamber'),

('ME-ACC', 'ME', 'Институт овлашћених ревизора', 'Institute of Certified Auditors', 'IOR',
  'institute', NULL, NULL, ARRAY['accountant'], NULL, NULL, 'Podgorica', 'Accountants and auditors'),

('ME-LISP', 'ME', 'Инспекција рада', 'Labour Inspectorate', 'IR',
  'inspectorate', NULL, NULL, ARRAY['safety_manager'], NULL, NULL, 'Podgorica', 'Occupational safety and health inspectorate'),

('ME-FIRE', 'ME', 'Управа за заштиту и спашавање', 'Directorate for Protection and Rescue', 'UZS',
  'agency', NULL, NULL, ARRAY['fire_safety_manager'], NULL, NULL, 'Podgorica', 'Fire safety and civil protection'),

('ME-HEALTH', 'ME', 'Министарство здравља', 'Ministry of Health', 'MZ',
  'ministry', NULL, NULL, ARRAY['doctor','dentist','pharmacist','nurse','midwife'],
  NULL, NULL, 'Podgorica', 'Health authority'),

-- ============================================================================
-- IRELAND (IE)
-- ============================================================================
('IE-CRO', 'IE', 'Companies Registration Office', 'Companies Registration Office', 'CRO',
  'agency', 'https://www.cro.ie', 'https://www.cro.ie',
  ARRAY['all_legal_entities'], 'cro.info@enterprise.gov.ie', '+353 1 804 5200',
  'Bloom House, Gloucester Place Lower, Dublin 1', 'Official commercial register'),

('IE-REV', 'IE', 'Office of the Revenue Commissioners', 'Revenue Commissioners', 'Revenue',
  'agency', 'https://www.revenue.ie', NULL,
  ARRAY['all_legal_entities'], NULL, NULL, 'Dublin Castle, Dublin', 'Tax authority'),

('IE-MC', 'IE', 'Medical Council', 'Medical Council', 'IMC',
  'council', 'https://www.medicalcouncil.ie', 'https://opd.medicalcouncil.ie',
  ARRAY['doctor'], NULL, NULL, 'Ireland', 'Medical practitioners registration'),

('IE-DC', 'IE', 'Dental Council', 'Dental Council', 'DC',
  'council', 'https://www.dentalcouncil.ie', 'https://www.dentalcouncil.ie',
  ARRAY['dentist'], NULL, NULL, 'Ireland', 'Dental practitioners registration'),

('IE-PSI', 'IE', 'Pharmaceutical Society of Ireland', 'Pharmaceutical Society of Ireland', 'PSI',
  'regulatory_authority', 'https://www.psi.ie', 'https://registrations.thepsi.ie',
  ARRAY['pharmacist'], NULL, NULL, 'PSI House, 15-19 Fenian Street, Dublin 2, D02 TD72', 'Pharmacy regulator'),

('IE-VCI', 'IE', 'Veterinary Council of Ireland', 'Veterinary Council of Ireland', 'VCI',
  'council', 'https://www.vci.ie', NULL,
  ARRAY['veterinarian'], 'info@vci.ie', NULL, '53 Lansdowne Road', 'Veterinary practitioners registration'),

('IE-LS', 'IE', 'Law Society of Ireland', 'Law Society of Ireland', 'LSI',
  'regulatory_authority', 'https://www.lawsociety.ie', 'https://www.lawsociety.ie/find-a-solicitor',
  ARRAY['solicitor'], NULL, NULL, 'Blackhall Place, Dublin 7', 'Solicitors regulatory body'),

('IE-BAR', 'IE', 'The Bar of Ireland', 'The Bar of Ireland', 'Bar',
  'bar', 'https://www.lawlibrary.ie', 'https://www.lawlibrary.ie/find-a-barrister',
  ARRAY['barrister'], NULL, NULL, 'Four Courts, Dublin 7', 'Barristers representative body'),

('IE-RIAI', 'IE', 'Royal Institute of the Architects of Ireland', 'Royal Institute of the Architects of Ireland', 'RIAI',
  'institute', 'https://www.riai.ie', 'https://www.riai.ie/work-with-an-architect/register-of-architects',
  ARRAY['architect'], NULL, NULL, '8 Merrion Square, Dublin 2', 'Architects registration and regulatory body'),

('IE-CAI', 'IE', 'Chartered Accountants Ireland', 'Chartered Accountants Ireland', 'CAI',
  'institute', 'https://www.charteredaccountants.ie', NULL,
  ARRAY['accountant'], NULL, NULL, 'Chartered Accountants House, 47-49 Pearse Street, Dublin 2', 'Chartered accountants body'),

('IE-HSA', 'IE', 'Health and Safety Authority', 'Health and Safety Authority', 'HSA',
  'regulatory_authority', 'https://www.hsa.ie', NULL,
  ARRAY['safety_manager'], NULL, NULL, 'Metropolitan Building, James Joyce Street, Dublin 1', 'Occupational health and safety authority'),

('IE-FIRE', 'IE', 'Fire and Emergency Services', 'Fire and Emergency Services', 'FES',
  'agency', NULL, NULL, ARRAY['fire_safety_manager'], NULL, NULL, 'Local authority fire services', 'Fire safety - local authority responsibility'),

('IE-HIQA', 'IE', 'Health Information and Quality Authority', 'Health Information and Quality Authority', 'HIQA',
  'regulatory_authority', 'https://www.hiqa.ie', NULL,
  ARRAY['doctor','dentist','pharmacist','nurse','midwife'], NULL, NULL, 'George''s Court, George''s Lane, Dublin 7', 'Health services regulator'),

-- ============================================================================
-- SWITZERLAND (CH)
-- ============================================================================
('CH-ZEFIX', 'CH', 'Zentraler Firmenindex', 'Central Business Name Index', 'ZEFIX',
  'register', 'https://www.zefix.ch', 'https://www.zefix.ch/en/search/entity/welcome',
  ARRAY['all_legal_entities'], NULL, NULL, 'Federal Office of Justice, Bern', 'Official commercial register portal'),

('CH-FTA', 'CH', 'Eidgenössische Steuerverwaltung', 'Federal Tax Administration', 'ESTV',
  'agency', 'https://www.estv.admin.ch', NULL,
  ARRAY['all_legal_entities'], 'info@estv.admin.ch', '+41 58 462 71 01',
  'Eigerstrasse 65, 3003 Bern', 'Federal tax authority'),

('CH-FMH', 'CH', 'Verbindung der Schweizer Ärztinnen und Ärzte', 'Swiss Medical Association', 'FMH',
  'association', 'https://www.fmh.ch', 'https://doctorfmh.ch/en',
  ARRAY['doctor'], 'info@fmh.ch', '+41 31 359 11 11',
  'Elfenstrasse 18, 3000 Bern 16', 'Professional association of Swiss doctors'),

('CH-SSO', 'CH', 'Schweizerische Zahnärzte-Gesellschaft', 'Swiss Dental Association', 'SSO',
  'association', 'https://www.sso.ch', NULL,
  ARRAY['dentist'], NULL, NULL, 'Bern', 'Professional dental organization'),

('CH-PHARM', 'CH', 'Schweizerischer Apothekerverband', 'Swiss Pharmacists Association', 'pharmaSuisse',
  'association', 'https://www.pharmasuisse.org', NULL,
  ARRAY['pharmacist'], NULL, NULL, 'Bern', 'Pharmacists professional association'),

('CH-GST', 'CH', 'Gesellschaft Schweizer Tierärztinnen und Tierärzte', 'Swiss Veterinary Association', 'GST',
  'association', 'https://www.gstsvs.ch', NULL,
  ARRAY['veterinarian'], NULL, NULL, 'Bern', 'Veterinary practitioners association'),

('CH-SAV', 'CH', 'Schweizerischer Anwaltsverband', 'Swiss Bar Association', 'SAV',
  'association', 'https://www.sav-fsa.ch', 'https://www.sav-fsa.ch/en/anwaltsregister',
  ARRAY['lawyer'], NULL, NULL, 'Laupenstrasse 41, 3008 Bern', 'Swiss lawyers association'),

('CH-NOT', 'CH', 'Schweizerische Notarenkammer', 'Swiss Notaries Chamber', 'SNK',
  'chamber', NULL, NULL, ARRAY['notary'], NULL, NULL, 'Bern', 'Notaries chamber - cantonal regulation'),

('CH-SIA', 'CH', 'Schweizerischer Ingenieur- und Architektenverein', 'Swiss Society of Engineers and Architects', 'SIA',
  'association', 'https://www.sia.ch', NULL,
  ARRAY['architect','engineer'], 'sia@sia.ch', '+41 44 283 15 15',
  'Selnaustrasse 16, CH-8027 Zürich', 'Engineers and architects professional association'),

('CH-TREUHAND', 'CH', 'TREUHAND|SUISSE', 'Swiss Fiduciary Association', 'TREUHAND',
  'association', 'https://www.treuhandsuisse.ch', NULL,
  ARRAY['accountant','tax_advisor'], NULL, NULL, 'Switzerland', 'Accountants and fiduciaries association'),

('CH-SECO', 'CH', 'Staatssekretariat für Wirtschaft', 'State Secretariat for Economic Affairs', 'SECO',
  'agency', 'https://www.seco.admin.ch', NULL,
  ARRAY['safety_manager'], 'info@seco.admin.ch', '+41 58 462 56 56',
  'Holzikofenweg 36, CH-3003 Bern', 'Federal labour inspectorate'),

('CH-VKF', 'CH', 'Vereinigung Kantonaler Feuerversicherungen', 'Association of Cantonal Fire Insurance', 'VKF',
  'association', 'https://www.vkf.ch', NULL,
  ARRAY['fire_safety_manager'], NULL, NULL, 'Bern', 'Fire protection regulations authority'),

('CH-BAG', 'CH', 'Bundesamt für Gesundheit', 'Federal Office of Public Health', 'BAG',
  'agency', 'https://www.bag.admin.ch', NULL,
  ARRAY['doctor','dentist','pharmacist','nurse','midwife'], NULL, NULL, 'Bern', 'Federal health authority'),

-- ============================================================================
-- LUXEMBOURG (LU)
-- ============================================================================
('LU-RCS', 'LU', 'Registre de Commerce et des Sociétés', 'Trade and Companies Register', 'RCS',
  'register', 'https://www.lbr.lu', 'https://www.lbr.lu/mjrcs-resa',
  ARRAY['all_legal_entities'], NULL, NULL, 'Luxembourg Business Registers', 'Official commercial register'),

('LU-ACD', 'LU', 'Administration des contributions directes', 'Luxembourg Inland Revenue', 'ACD',
  'agency', 'https://acd.gouvernement.lu', 'https://www.acd.lu',
  ARRAY['all_legal_entities'], NULL, NULL, 'Luxembourg', 'Direct tax authority'),

('LU-CMDS', 'LU', 'Collège Médical', 'Medical College', 'CMDS',
  'council', 'https://www.collegemedical.lu', NULL,
  ARRAY['doctor'], NULL, '+352 478 5542',
  '90 Boulevard de la Pétrusse, L-2320 Luxembourg', 'Medical practitioners licensing'),

('LU-DENT', 'LU', 'Ordre des Médecins-Dentistes', 'Order of Dentists', 'OMD',
  'order', NULL, NULL, ARRAY['dentist'], NULL, NULL, 'Luxembourg', 'Dental practitioners order'),

('LU-PHARM', 'LU', 'Ordre des Pharmaciens', 'Order of Pharmacists', 'OPL',
  'order', NULL, NULL, ARRAY['pharmacist'], NULL, NULL, 'Luxembourg', 'Pharmacists order'),

('LU-VET', 'LU', 'Ordre des Médecins Vétérinaires', 'Order of Veterinarians', 'OMV',
  'order', NULL, NULL, ARRAY['veterinarian'], NULL, NULL, 'Luxembourg', 'Veterinary practitioners order'),

('LU-BAR', 'LU', 'Ordre des Avocats', 'Luxembourg Bar', 'OALU',
  'bar', 'https://www.barreau.lu', NULL,
  ARRAY['lawyer'], NULL, NULL, '175 rue de Beggen, L-1220 Luxembourg', 'Luxembourg bar association'),

('LU-NOT', 'LU', 'Chambre des Notaires', 'Chamber of Notaries', 'CDN',
  'chamber', 'https://www.notaires.lu', NULL,
  ARRAY['notary'], NULL, NULL, '11 rue du Saint-Esprit, L-1475 Luxembourg', 'Notaries chamber'),

('LU-OAI', 'LU', 'Ordre des Architectes et des Ingénieurs-Conseils', 'Order of Architects and Consulting Engineers', 'OAI',
  'order', 'https://www.oai.lu', NULL,
  ARRAY['architect','engineer'], 'oai@oai.lu', '+352 42 24 06',
  '6 boulevard Grande-Duchesse Charlotte, L-1330 Luxembourg', 'Architects and engineers order'),

('LU-IRE', 'LU', 'Institut des Réviseurs d''Entreprises', 'Institute of Auditors', 'IRE',
  'institute', 'https://www.ire.lu', NULL,
  ARRAY['accountant'], NULL, NULL, 'Luxembourg', 'Auditors institute'),

('LU-ITM', 'LU', 'Inspection du travail et des mines', 'Labour and Mines Inspectorate', 'ITM',
  'inspectorate', 'https://itm.public.lu', NULL,
  ARRAY['safety_manager'], 'info@itm.etat.lu', '+352 247-76100',
  '3 rue des Primeurs, 2361 Strassen', 'Labour inspection and occupational safety'),

('LU-FIRE', 'LU', 'Service d''Incendie et d''Ambulance', 'Fire and Ambulance Service', 'CGDIS',
  'agency', 'https://www.cgdis.lu', NULL,
  ARRAY['fire_safety_manager'], NULL, NULL, 'Luxembourg', 'Fire safety and emergency services'),

('LU-MS', 'LU', 'Ministère de la Santé', 'Ministry of Health', 'MS',
  'ministry', 'https://sante.public.lu', NULL,
  ARRAY['doctor','dentist','pharmacist','nurse','midwife'],
  'professions.medicales@ms.etat.lu', NULL, 'Luxembourg', 'Health authority'),

-- ============================================================================
-- LIECHTENSTEIN (LI)
-- ============================================================================
('LI-HR', 'LI', 'Handelsregister', 'Commercial Register', 'HR',
  'register', 'https://www.handelsregister.li', NULL,
  ARRAY['all_legal_entities'], NULL, NULL,
  'Amt für Justiz, Vaduz', 'Official commercial register'),

('LI-STV', 'LI', 'Steuerverwaltung', 'Tax Administration', 'STV',
  'agency', 'https://www.llv.li/en/national-administration/fiscal-authority', NULL,
  ARRAY['all_legal_entities'], NULL, NULL, 'Vaduz', 'Tax authority'),

('LI-AK', 'LI', 'Ärztekammer', 'Medical Chamber', 'AK',
  'chamber', 'https://www.aerztekammer.li', NULL,
  ARRAY['doctor'], NULL, NULL, 'Vaduz', 'Medical practitioners chamber'),

('LI-DENT', 'LI', 'Zahnärztekammer', 'Dental Chamber', 'ZAK',
  'chamber', NULL, NULL, ARRAY['dentist'], NULL, NULL, 'Vaduz', 'Dental practitioners chamber'),

('LI-PHARM', 'LI', 'Apothekerverband', 'Pharmacists Association', 'APV',
  'association', NULL, NULL, ARRAY['pharmacist'], NULL, NULL, 'Vaduz', 'Pharmacists association'),

('LI-VET', 'LI', 'Veterinäramt', 'Veterinary Office', 'VETA',
  'agency', NULL, NULL, ARRAY['veterinarian'], NULL, NULL, 'Vaduz', 'Veterinary authority'),

('LI-RAK', 'LI', 'Rechtsanwaltskammer', 'Bar Association', 'RAK',
  'chamber', NULL, NULL, ARRAY['lawyer'], NULL, NULL, 'Vaduz', 'Lawyers chamber'),

('LI-NOT', 'LI', 'Notariatskammer', 'Notaries Chamber', 'NK',
  'chamber', NULL, NULL, ARRAY['notary'], NULL, NULL, 'Vaduz', 'Notaries chamber'),

('LI-LIA', 'LI', 'Liechtensteinische Ingenieur- und Architektenvereinigung', 'Liechtenstein Engineers and Architects Association', 'LIA',
  'association', 'https://www.lia.li', NULL,
  ARRAY['architect','engineer'], NULL, NULL, 'Vaduz', 'Engineers and architects association'),

('LI-TREUHAND', 'LI', 'Treuhandverband', 'Fiduciary Association', 'TV',
  'association', NULL, NULL, ARRAY['accountant','tax_advisor'], NULL, NULL, 'Vaduz', 'Accountants and fiduciaries association'),

('LI-AVW', 'LI', 'Amt für Volkswirtschaft', 'Office of Economic Affairs', 'AVW',
  'agency', 'https://www.llv.li', NULL,
  ARRAY['safety_manager'], NULL, NULL, 'Vaduz', 'Labour and occupational safety supervision'),

('LI-FIRE', 'LI', 'Landesfeuerwehrverband', 'National Fire Service Association', 'LFV',
  'association', NULL, NULL, ARRAY['fire_safety_manager'], NULL, NULL, 'Vaduz', 'Fire safety coordination'),

('LI-HEALTH', 'LI', 'Amt für Gesundheit', 'Office of Public Health', 'AG',
  'agency', 'https://www.llv.li/en/national-administration/office-of-public-health', NULL,
  ARRAY['doctor','dentist','pharmacist','nurse','midwife'], NULL, NULL, 'Vaduz', 'Health authority')

ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- LEGAL FORM BODIES JUNCTIONS
-- ============================================================================

-- Insert junctions between legal forms and professional bodies
-- Pattern: ALL commercial forms → register + tax + labour
--          Professional forms → specific order + health + tax

-- ============================================================================
-- NORTH MACEDONIA (MK)
-- ============================================================================

-- Commercial forms → register, tax, labour
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT
  lf.code,
  'MK-CRM',
  'registration',
  true,
  'Mandatory commercial registration'
FROM legal_forms lf
WHERE lf.country_code = 'MK'
  AND lf.code NOT LIKE '%-MED'
  AND lf.code NOT LIKE '%-DENT'
  AND lf.code NOT LIKE '%-PHARM'
  AND lf.code NOT LIKE '%-VET'
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT
  lf.code,
  'MK-PRO',
  'registration',
  true,
  'Mandatory tax registration'
FROM legal_forms lf
WHERE lf.country_code = 'MK'
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT
  lf.code,
  'MK-LISP',
  'supervision',
  true,
  'Occupational safety supervision'
FROM legal_forms lf
WHERE lf.country_code = 'MK'
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- Medical professionals → medical chamber + health authority
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT
  lf.code,
  'MK-LKM',
  'licensing',
  true,
  'Medical licence required'
FROM legal_forms lf
WHERE lf.country_code = 'MK' AND lf.code LIKE '%-MED'
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT
  lf.code,
  'MK-HEALTH',
  'supervision',
  true,
  'Health authority supervision'
FROM legal_forms lf
WHERE lf.country_code = 'MK' AND (lf.code LIKE '%-MED' OR lf.code LIKE '%-DENT' OR lf.code LIKE '%-PHARM' OR lf.code LIKE '%-VET')
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- Dentists
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT lf.code, 'MK-DENT', 'licensing', true, 'Dental licence required'
FROM legal_forms lf WHERE lf.country_code = 'MK' AND lf.code LIKE '%-DENT'
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- Pharmacists
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT lf.code, 'MK-PHARM', 'licensing', true, 'Pharmaceutical licence required'
FROM legal_forms lf WHERE lf.country_code = 'MK' AND lf.code LIKE '%-PHARM'
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- Veterinarians
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT lf.code, 'MK-VET', 'licensing', true, 'Veterinary licence required'
FROM legal_forms lf WHERE lf.country_code = 'MK' AND lf.code LIKE '%-VET'
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- ============================================================================
-- MONTENEGRO (ME)
-- ============================================================================

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT
  lf.code,
  'ME-CRPS',
  'registration',
  true,
  'Mandatory commercial registration'
FROM legal_forms lf
WHERE lf.country_code = 'ME'
  AND lf.code NOT LIKE '%-MED'
  AND lf.code NOT LIKE '%-DENT'
  AND lf.code NOT LIKE '%-PHARM'
  AND lf.code NOT LIKE '%-VET'
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT
  lf.code,
  'ME-TAX',
  'registration',
  true,
  'Mandatory tax registration'
FROM legal_forms lf
WHERE lf.country_code = 'ME'
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT
  lf.code,
  'ME-LISP',
  'supervision',
  true,
  'Occupational safety supervision'
FROM legal_forms lf
WHERE lf.country_code = 'ME'
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- Medical professionals
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT lf.code, 'ME-LKC', 'licensing', true, 'Medical licence required'
FROM legal_forms lf WHERE lf.country_code = 'ME' AND lf.code LIKE '%-MED'
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT lf.code, 'ME-DENT', 'licensing', true, 'Dental licence required'
FROM legal_forms lf WHERE lf.country_code = 'ME' AND lf.code LIKE '%-DENT'
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT lf.code, 'ME-PHARM', 'licensing', true, 'Pharmaceutical licence required'
FROM legal_forms lf WHERE lf.country_code = 'ME' AND lf.code LIKE '%-PHARM'
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT lf.code, 'ME-VET', 'licensing', true, 'Veterinary licence required'
FROM legal_forms lf WHERE lf.country_code = 'ME' AND lf.code LIKE '%-VET'
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT lf.code, 'ME-HEALTH', 'supervision', true, 'Health authority supervision'
FROM legal_forms lf WHERE lf.country_code = 'ME'
  AND (lf.code LIKE '%-MED' OR lf.code LIKE '%-DENT' OR lf.code LIKE '%-PHARM' OR lf.code LIKE '%-VET')
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- ============================================================================
-- IRELAND (IE) - Using explicit codes from prompt
-- ============================================================================

-- Commercial forms → register, tax, labour
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
VALUES
  ('IE-LTD', 'IE-CRO', 'registration', true, 'Mandatory company registration'),
  ('IE-DAC', 'IE-CRO', 'registration', true, 'Mandatory company registration'),
  ('IE-PLC', 'IE-CRO', 'registration', true, 'Mandatory company registration'),
  ('IE-CLG', 'IE-CRO', 'registration', true, 'Mandatory company registration'),
  ('IE-ULC', 'IE-CRO', 'registration', true, 'Mandatory company registration'),
  ('IE-SE', 'IE-CRO', 'registration', true, 'Mandatory company registration'),
  ('IE-LP', 'IE-CRO', 'registration', true, 'Mandatory partnership registration'),
  ('IE-EEIG', 'IE-CRO', 'registration', true, 'Mandatory EEIG registration'),
  ('IE-BRANCH', 'IE-CRO', 'registration', true, 'Mandatory branch registration'),
  ('IE-SOLE', 'IE-CRO', 'registration', false, 'Business name registration'),
  ('IE-CHARITY', 'IE-CRO', 'registration', true, 'Charity registration'),
  ('IE-COOP', 'IE-CRO', 'registration', true, 'Cooperative registration')
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- All forms → tax
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
VALUES
  ('IE-LTD', 'IE-REV', 'registration', true, 'Tax registration'),
  ('IE-DAC', 'IE-REV', 'registration', true, 'Tax registration'),
  ('IE-PLC', 'IE-REV', 'registration', true, 'Tax registration'),
  ('IE-CLG', 'IE-REV', 'registration', true, 'Tax registration'),
  ('IE-ULC', 'IE-REV', 'registration', true, 'Tax registration'),
  ('IE-SE', 'IE-REV', 'registration', true, 'Tax registration'),
  ('IE-LP', 'IE-REV', 'registration', true, 'Tax registration'),
  ('IE-EEIG', 'IE-REV', 'registration', true, 'Tax registration'),
  ('IE-BRANCH', 'IE-REV', 'registration', true, 'Tax registration'),
  ('IE-SOLE', 'IE-REV', 'registration', true, 'Tax registration'),
  ('IE-MED', 'IE-REV', 'registration', true, 'Tax registration'),
  ('IE-DENT', 'IE-REV', 'registration', true, 'Tax registration'),
  ('IE-PHARM', 'IE-REV', 'registration', true, 'Tax registration'),
  ('IE-NURSE', 'IE-REV', 'registration', true, 'Tax registration'),
  ('IE-MID', 'IE-REV', 'registration', true, 'Tax registration'),
  ('IE-VET', 'IE-REV', 'registration', true, 'Tax registration'),
  ('IE-ARCH', 'IE-REV', 'registration', true, 'Tax registration'),
  ('IE-SOL', 'IE-REV', 'registration', true, 'Tax registration'),
  ('IE-CHARITY', 'IE-REV', 'registration', true, 'Tax registration'),
  ('IE-COOP', 'IE-REV', 'registration', true, 'Tax registration')
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- All forms → HSA
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
VALUES
  ('IE-LTD', 'IE-HSA', 'supervision', true, 'Health and safety compliance'),
  ('IE-DAC', 'IE-HSA', 'supervision', true, 'Health and safety compliance'),
  ('IE-PLC', 'IE-HSA', 'supervision', true, 'Health and safety compliance'),
  ('IE-CLG', 'IE-HSA', 'supervision', true, 'Health and safety compliance'),
  ('IE-ULC', 'IE-HSA', 'supervision', true, 'Health and safety compliance'),
  ('IE-SE', 'IE-HSA', 'supervision', true, 'Health and safety compliance'),
  ('IE-LP', 'IE-HSA', 'supervision', true, 'Health and safety compliance'),
  ('IE-EEIG', 'IE-HSA', 'supervision', true, 'Health and safety compliance'),
  ('IE-BRANCH', 'IE-HSA', 'supervision', true, 'Health and safety compliance'),
  ('IE-SOLE', 'IE-HSA', 'supervision', true, 'Health and safety compliance'),
  ('IE-CHARITY', 'IE-HSA', 'supervision', true, 'Health and safety compliance'),
  ('IE-COOP', 'IE-HSA', 'supervision', true, 'Health and safety compliance')
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- Professional forms
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
VALUES
  ('IE-MED', 'IE-MC', 'licensing', true, 'Medical Council registration'),
  ('IE-MED', 'IE-HIQA', 'supervision', true, 'Health services regulation'),
  ('IE-DENT', 'IE-DC', 'licensing', true, 'Dental Council registration'),
  ('IE-DENT', 'IE-HIQA', 'supervision', true, 'Health services regulation'),
  ('IE-PHARM', 'IE-PSI', 'licensing', true, 'PSI registration'),
  ('IE-PHARM', 'IE-HIQA', 'supervision', true, 'Health services regulation'),
  ('IE-NURSE', 'IE-HIQA', 'supervision', true, 'Health services regulation'),
  ('IE-MID', 'IE-HIQA', 'supervision', true, 'Health services regulation'),
  ('IE-VET', 'IE-VCI', 'licensing', true, 'Veterinary Council registration'),
  ('IE-ARCH', 'IE-RIAI', 'licensing', true, 'RIAI registration'),
  ('IE-SOL', 'IE-LS', 'licensing', true, 'Law Society registration')
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- ============================================================================
-- SWITZERLAND (CH) - Using explicit codes from prompt
-- ============================================================================

-- Commercial forms → register, tax, labour
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
VALUES
  ('CH-AG', 'CH-ZEFIX', 'registration', true, 'Mandatory commercial registration'),
  ('CH-GMBH', 'CH-ZEFIX', 'registration', true, 'Mandatory commercial registration'),
  ('CH-KOLL', 'CH-ZEFIX', 'registration', true, 'Mandatory partnership registration'),
  ('CH-KOMM', 'CH-ZEFIX', 'registration', true, 'Mandatory partnership registration'),
  ('CH-KOMMAG', 'CH-ZEFIX', 'registration', true, 'Mandatory company registration'),
  ('CH-BRANCH', 'CH-ZEFIX', 'registration', true, 'Mandatory branch registration'),
  ('CH-EINZEL', 'CH-ZEFIX', 'registration', false, 'Optional sole proprietor registration'),
  ('CH-VEREIN', 'CH-ZEFIX', 'registration', false, 'Optional association registration'),
  ('CH-STIFTUNG', 'CH-ZEFIX', 'registration', true, 'Mandatory foundation registration'),
  ('CH-GENO', 'CH-ZEFIX', 'registration', true, 'Mandatory cooperative registration'),
  ('CH-PUB', 'CH-ZEFIX', 'registration', true, 'Public entity registration')
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- All forms → tax
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
VALUES
  ('CH-AG', 'CH-FTA', 'registration', true, 'Tax registration'),
  ('CH-GMBH', 'CH-FTA', 'registration', true, 'Tax registration'),
  ('CH-KOLL', 'CH-FTA', 'registration', true, 'Tax registration'),
  ('CH-KOMM', 'CH-FTA', 'registration', true, 'Tax registration'),
  ('CH-KOMMAG', 'CH-FTA', 'registration', true, 'Tax registration'),
  ('CH-BRANCH', 'CH-FTA', 'registration', true, 'Tax registration'),
  ('CH-EINZEL', 'CH-FTA', 'registration', true, 'Tax registration'),
  ('CH-MED', 'CH-FTA', 'registration', true, 'Tax registration'),
  ('CH-DENT', 'CH-FTA', 'registration', true, 'Tax registration'),
  ('CH-PHARM', 'CH-FTA', 'registration', true, 'Tax registration'),
  ('CH-VET', 'CH-FTA', 'registration', true, 'Tax registration'),
  ('CH-NURSE', 'CH-FTA', 'registration', true, 'Tax registration'),
  ('CH-HEB', 'CH-FTA', 'registration', true, 'Tax registration'),
  ('CH-ARCH', 'CH-FTA', 'registration', true, 'Tax registration'),
  ('CH-RA', 'CH-FTA', 'registration', true, 'Tax registration'),
  ('CH-STB', 'CH-FTA', 'registration', true, 'Tax registration'),
  ('CH-REVI', 'CH-FTA', 'registration', true, 'Tax registration'),
  ('CH-VEREIN', 'CH-FTA', 'registration', true, 'Tax registration'),
  ('CH-STIFTUNG', 'CH-FTA', 'registration', true, 'Tax registration'),
  ('CH-GENO', 'CH-FTA', 'registration', true, 'Tax registration'),
  ('CH-PUB', 'CH-FTA', 'registration', true, 'Tax registration')
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- All forms → SECO
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
VALUES
  ('CH-AG', 'CH-SECO', 'supervision', true, 'Occupational safety supervision'),
  ('CH-GMBH', 'CH-SECO', 'supervision', true, 'Occupational safety supervision'),
  ('CH-KOLL', 'CH-SECO', 'supervision', true, 'Occupational safety supervision'),
  ('CH-KOMM', 'CH-SECO', 'supervision', true, 'Occupational safety supervision'),
  ('CH-KOMMAG', 'CH-SECO', 'supervision', true, 'Occupational safety supervision'),
  ('CH-BRANCH', 'CH-SECO', 'supervision', true, 'Occupational safety supervision'),
  ('CH-EINZEL', 'CH-SECO', 'supervision', true, 'Occupational safety supervision'),
  ('CH-VEREIN', 'CH-SECO', 'supervision', true, 'Occupational safety supervision'),
  ('CH-GENO', 'CH-SECO', 'supervision', true, 'Occupational safety supervision')
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- Professional forms
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
VALUES
  ('CH-MED', 'CH-FMH', 'membership', false, 'FMH membership recommended'),
  ('CH-MED', 'CH-BAG', 'supervision', true, 'Federal health authority oversight'),
  ('CH-DENT', 'CH-SSO', 'membership', false, 'SSO membership recommended'),
  ('CH-DENT', 'CH-BAG', 'supervision', true, 'Federal health authority oversight'),
  ('CH-PHARM', 'CH-PHARM', 'membership', false, 'pharmaSuisse membership recommended'),
  ('CH-PHARM', 'CH-BAG', 'supervision', true, 'Federal health authority oversight'),
  ('CH-VET', 'CH-GST', 'membership', false, 'GST membership recommended'),
  ('CH-VET', 'CH-BAG', 'supervision', true, 'Federal health authority oversight'),
  ('CH-NURSE', 'CH-BAG', 'supervision', true, 'Federal health authority oversight'),
  ('CH-HEB', 'CH-BAG', 'supervision', true, 'Federal health authority oversight'),
  ('CH-ARCH', 'CH-SIA', 'membership', false, 'SIA membership recommended'),
  ('CH-RA', 'CH-SAV', 'membership', true, 'Bar association membership'),
  ('CH-STB', 'CH-TREUHAND', 'membership', false, 'Professional association membership'),
  ('CH-REVI', 'CH-TREUHAND', 'membership', false, 'Professional association membership')
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- ============================================================================
-- LUXEMBOURG (LU) - Using explicit codes from prompt
-- ============================================================================

-- Commercial forms → register, tax, labour
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
VALUES
  ('LU-SARL', 'LU-RCS', 'registration', true, 'Mandatory commercial registration'),
  ('LU-SARLS', 'LU-RCS', 'registration', true, 'Mandatory commercial registration'),
  ('LU-SA', 'LU-RCS', 'registration', true, 'Mandatory commercial registration'),
  ('LU-SAS', 'LU-RCS', 'registration', true, 'Mandatory commercial registration'),
  ('LU-SCA', 'LU-RCS', 'registration', true, 'Mandatory commercial registration'),
  ('LU-SENC', 'LU-RCS', 'registration', true, 'Mandatory partnership registration'),
  ('LU-SCS', 'LU-RCS', 'registration', true, 'Mandatory partnership registration'),
  ('LU-SCSP', 'LU-RCS', 'registration', true, 'Mandatory partnership registration'),
  ('LU-SE', 'LU-RCS', 'registration', true, 'Mandatory SE registration'),
  ('LU-BRANCH', 'LU-RCS', 'registration', true, 'Mandatory branch registration'),
  ('LU-EI', 'LU-RCS', 'registration', true, 'Sole proprietor registration'),
  ('LU-ASBL', 'LU-RCS', 'registration', true, 'Non-profit registration'),
  ('LU-FOND', 'LU-RCS', 'registration', true, 'Foundation registration'),
  ('LU-SC', 'LU-RCS', 'registration', true, 'Cooperative registration')
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- All forms → tax
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
VALUES
  ('LU-SARL', 'LU-ACD', 'registration', true, 'Tax registration'),
  ('LU-SARLS', 'LU-ACD', 'registration', true, 'Tax registration'),
  ('LU-SA', 'LU-ACD', 'registration', true, 'Tax registration'),
  ('LU-SAS', 'LU-ACD', 'registration', true, 'Tax registration'),
  ('LU-SCA', 'LU-ACD', 'registration', true, 'Tax registration'),
  ('LU-SENC', 'LU-ACD', 'registration', true, 'Tax registration'),
  ('LU-SCS', 'LU-ACD', 'registration', true, 'Tax registration'),
  ('LU-SCSP', 'LU-ACD', 'registration', true, 'Tax registration'),
  ('LU-SE', 'LU-ACD', 'registration', true, 'Tax registration'),
  ('LU-BRANCH', 'LU-ACD', 'registration', true, 'Tax registration'),
  ('LU-EI', 'LU-ACD', 'registration', true, 'Tax registration'),
  ('LU-MED', 'LU-ACD', 'registration', true, 'Tax registration'),
  ('LU-DENT', 'LU-ACD', 'registration', true, 'Tax registration'),
  ('LU-PHARM', 'LU-ACD', 'registration', true, 'Tax registration'),
  ('LU-VET', 'LU-ACD', 'registration', true, 'Tax registration'),
  ('LU-ARCH', 'LU-ACD', 'registration', true, 'Tax registration'),
  ('LU-AVT', 'LU-ACD', 'registration', true, 'Tax registration'),
  ('LU-NOT', 'LU-ACD', 'registration', true, 'Tax registration'),
  ('LU-ASBL', 'LU-ACD', 'registration', true, 'Tax registration'),
  ('LU-FOND', 'LU-ACD', 'registration', true, 'Tax registration'),
  ('LU-SC', 'LU-ACD', 'registration', true, 'Tax registration')
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- All forms → ITM
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
VALUES
  ('LU-SARL', 'LU-ITM', 'supervision', true, 'Labour and safety supervision'),
  ('LU-SARLS', 'LU-ITM', 'supervision', true, 'Labour and safety supervision'),
  ('LU-SA', 'LU-ITM', 'supervision', true, 'Labour and safety supervision'),
  ('LU-SAS', 'LU-ITM', 'supervision', true, 'Labour and safety supervision'),
  ('LU-SCA', 'LU-ITM', 'supervision', true, 'Labour and safety supervision'),
  ('LU-SENC', 'LU-ITM', 'supervision', true, 'Labour and safety supervision'),
  ('LU-SCS', 'LU-ITM', 'supervision', true, 'Labour and safety supervision'),
  ('LU-SCSP', 'LU-ITM', 'supervision', true, 'Labour and safety supervision'),
  ('LU-SE', 'LU-ITM', 'supervision', true, 'Labour and safety supervision'),
  ('LU-BRANCH', 'LU-ITM', 'supervision', true, 'Labour and safety supervision'),
  ('LU-EI', 'LU-ITM', 'supervision', true, 'Labour and safety supervision'),
  ('LU-ASBL', 'LU-ITM', 'supervision', true, 'Labour and safety supervision'),
  ('LU-SC', 'LU-ITM', 'supervision', true, 'Labour and safety supervision')
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- Professional forms
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
VALUES
  ('LU-MED', 'LU-CMDS', 'licensing', true, 'Medical licence required'),
  ('LU-MED', 'LU-MS', 'supervision', true, 'Health ministry supervision'),
  ('LU-DENT', 'LU-DENT', 'licensing', true, 'Dental order registration'),
  ('LU-DENT', 'LU-MS', 'supervision', true, 'Health ministry supervision'),
  ('LU-PHARM', 'LU-PHARM', 'licensing', true, 'Pharmacist order registration'),
  ('LU-PHARM', 'LU-MS', 'supervision', true, 'Health ministry supervision'),
  ('LU-VET', 'LU-VET', 'licensing', true, 'Veterinary order registration'),
  ('LU-VET', 'LU-MS', 'supervision', true, 'Health ministry supervision'),
  ('LU-ARCH', 'LU-OAI', 'licensing', true, 'OAI registration required'),
  ('LU-AVT', 'LU-BAR', 'licensing', true, 'Bar registration required'),
  ('LU-NOT', 'LU-NOT', 'licensing', true, 'Notary chamber registration')
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- ============================================================================
-- LIECHTENSTEIN (LI) - Using explicit codes from prompt
-- ============================================================================

-- Commercial forms → register, tax, labour
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
VALUES
  ('LI-AG', 'LI-HR', 'registration', true, 'Mandatory commercial registration'),
  ('LI-GMBH', 'LI-HR', 'registration', true, 'Mandatory commercial registration'),
  ('LI-ANSTALT', 'LI-HR', 'registration', true, 'Mandatory establishment registration'),
  ('LI-STIFTUNG', 'LI-HR', 'registration', true, 'Mandatory foundation registration'),
  ('LI-TRUST', 'LI-HR', 'registration', true, 'Mandatory trust registration'),
  ('LI-KOMMAG', 'LI-HR', 'registration', true, 'Mandatory company registration'),
  ('LI-BRANCH', 'LI-HR', 'registration', true, 'Mandatory branch registration'),
  ('LI-EINZEL', 'LI-HR', 'registration', false, 'Optional sole proprietor registration'),
  ('LI-VEREIN', 'LI-HR', 'registration', false, 'Optional association registration'),
  ('LI-GENO', 'LI-HR', 'registration', true, 'Mandatory cooperative registration'),
  ('LI-PUB', 'LI-HR', 'registration', true, 'Public entity registration')
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- All forms → tax
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
VALUES
  ('LI-AG', 'LI-STV', 'registration', true, 'Tax registration'),
  ('LI-GMBH', 'LI-STV', 'registration', true, 'Tax registration'),
  ('LI-ANSTALT', 'LI-STV', 'registration', true, 'Tax registration'),
  ('LI-STIFTUNG', 'LI-STV', 'registration', true, 'Tax registration'),
  ('LI-TRUST', 'LI-STV', 'registration', true, 'Tax registration'),
  ('LI-KOMMAG', 'LI-STV', 'registration', true, 'Tax registration'),
  ('LI-BRANCH', 'LI-STV', 'registration', true, 'Tax registration'),
  ('LI-EINZEL', 'LI-STV', 'registration', true, 'Tax registration'),
  ('LI-MED', 'LI-STV', 'registration', true, 'Tax registration'),
  ('LI-DENT', 'LI-STV', 'registration', true, 'Tax registration'),
  ('LI-PHARM', 'LI-STV', 'registration', true, 'Tax registration'),
  ('LI-VET', 'LI-STV', 'registration', true, 'Tax registration'),
  ('LI-NURSE', 'LI-STV', 'registration', true, 'Tax registration'),
  ('LI-HEB', 'LI-STV', 'registration', true, 'Tax registration'),
  ('LI-ARCH', 'LI-STV', 'registration', true, 'Tax registration'),
  ('LI-RA', 'LI-STV', 'registration', true, 'Tax registration'),
  ('LI-TREUH', 'LI-STV', 'registration', true, 'Tax registration'),
  ('LI-VEREIN', 'LI-STV', 'registration', true, 'Tax registration'),
  ('LI-GENO', 'LI-STV', 'registration', true, 'Tax registration'),
  ('LI-PUB', 'LI-STV', 'registration', true, 'Tax registration')
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- All commercial forms → labour
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
VALUES
  ('LI-AG', 'LI-AVW', 'supervision', true, 'Occupational safety supervision'),
  ('LI-GMBH', 'LI-AVW', 'supervision', true, 'Occupational safety supervision'),
  ('LI-ANSTALT', 'LI-AVW', 'supervision', true, 'Occupational safety supervision'),
  ('LI-KOMMAG', 'LI-AVW', 'supervision', true, 'Occupational safety supervision'),
  ('LI-BRANCH', 'LI-AVW', 'supervision', true, 'Occupational safety supervision'),
  ('LI-EINZEL', 'LI-AVW', 'supervision', true, 'Occupational safety supervision'),
  ('LI-VEREIN', 'LI-AVW', 'supervision', true, 'Occupational safety supervision'),
  ('LI-GENO', 'LI-AVW', 'supervision', true, 'Occupational safety supervision')
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- Professional forms
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
VALUES
  ('LI-MED', 'LI-AK', 'membership', true, 'Medical chamber membership'),
  ('LI-MED', 'LI-HEALTH', 'supervision', true, 'Health authority supervision'),
  ('LI-DENT', 'LI-DENT', 'membership', true, 'Dental chamber membership'),
  ('LI-DENT', 'LI-HEALTH', 'supervision', true, 'Health authority supervision'),
  ('LI-PHARM', 'LI-PHARM', 'membership', true, 'Pharmacist association membership'),
  ('LI-PHARM', 'LI-HEALTH', 'supervision', true, 'Health authority supervision'),
  ('LI-VET', 'LI-VET', 'licensing', true, 'Veterinary office registration'),
  ('LI-VET', 'LI-HEALTH', 'supervision', true, 'Health authority supervision'),
  ('LI-NURSE', 'LI-HEALTH', 'supervision', true, 'Health authority supervision'),
  ('LI-HEB', 'LI-HEALTH', 'supervision', true, 'Health authority supervision'),
  ('LI-ARCH', 'LI-LIA', 'membership', false, 'LIA membership recommended'),
  ('LI-RA', 'LI-RAK', 'membership', true, 'Bar association membership'),
  ('LI-TREUH', 'LI-TREUHAND', 'membership', false, 'Professional association membership')
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Count professional bodies by country
SELECT
  country_code,
  COUNT(*) as body_count,
  string_agg(DISTINCT body_type::text, ', ' ORDER BY body_type::text) as body_types
FROM professional_bodies
WHERE country_code IN ('MK','ME','IE','CH','LU','LI')
GROUP BY country_code
ORDER BY country_code;

-- Count legal form bodies junctions by country
SELECT
  pb.country_code,
  COUNT(*) as junction_count,
  COUNT(DISTINCT lfb.legal_form_code) as legal_form_count,
  COUNT(DISTINCT lfb.body_code) as body_count
FROM legal_form_bodies lfb
JOIN professional_bodies pb ON pb.code = lfb.body_code
WHERE pb.country_code IN ('MK','ME','IE','CH','LU','LI')
GROUP BY pb.country_code
ORDER BY pb.country_code;

-- ============================================================================
-- END OF FILE
-- ============================================================================
