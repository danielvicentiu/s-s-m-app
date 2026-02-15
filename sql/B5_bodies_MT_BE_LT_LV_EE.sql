-- =====================================================
-- B5: Professional Bodies — MT, BE, LT, LV, EE
-- Generated: 2026-02-15
-- Countries: Malta, Belgium, Lithuania, Latvia, Estonia
-- =====================================================

-- =====================================================
-- MALTA (MT) — 13 bodies
-- =====================================================

INSERT INTO professional_bodies (code, country_code, name_local, name_en, abbreviation, body_type, website_url, register_url, professions_covered, notes)
VALUES
  -- Registry & Tax
  ('MT-MBR', 'MT', 'Malta Business Registry', 'Malta Business Registry', 'MBR', 'register',
   'https://registry.mbr.mt', 'https://registry.mbr.mt/ROC',
   ARRAY['all_companies'],
   'Central business registry for all Maltese entities'),

  ('MT-CfR', 'MT', 'Commissioner for Revenue', 'Commissioner for Revenue', 'CfR', 'regulatory_authority',
   'https://cfr.gov.mt', NULL,
   ARRAY['all_legal_forms'],
   'Tax authority for Malta'),

  -- Healthcare professions
  ('MT-MC', 'MT', 'Medical Council', 'Medical Council', 'MC', 'council',
   'https://medicalcouncil.mt', 'https://medicalcouncil.mt/register',
   ARRAY['medical_doctor'],
   'Regulates medical practitioners in Malta'),

  ('MT-DC', 'MT', 'Dental Council', 'Dental Council', 'DC', 'council',
   'https://dentalcouncil.mt', NULL,
   ARRAY['dentist'],
   'Regulates dental practitioners'),

  ('MT-PC', 'MT', 'Pharmacy Council', 'Pharmacy Council', 'PC', 'council',
   'https://pharmacycouncil.mt', NULL,
   ARRAY['pharmacist'],
   'Regulates pharmacists'),

  ('MT-VC', 'MT', 'Veterinary Council', 'Veterinary Council', 'VC', 'council',
   'https://vetcouncil.mt', NULL,
   ARRAY['veterinarian'],
   'Regulates veterinarians'),

  -- Legal professions
  ('MT-CoA', 'MT', 'Chamber of Advocates', 'Chamber of Advocates', 'CoA', 'chamber',
   'https://chamberofadvocates.mt', NULL,
   ARRAY['lawyer'],
   'Bar association for advocates in Malta'),

  ('MT-NC', 'MT', 'Notarial Council', 'Notarial Council', 'NC', 'council',
   'https://notaries.mt', NULL,
   ARRAY['notary'],
   'Regulates notaries public'),

  -- Technical professions
  ('MT-CACE', 'MT', 'Chamber of Architects and Civil Engineers', 'Chamber of Architects and Civil Engineers', 'CACE', 'chamber',
   'https://ktparchitects.com', NULL,
   ARRAY['architect', 'civil_engineer'],
   'Professional body for architects and engineers'),

  -- Health & Safety
  ('MT-OHSA', 'MT', 'Occupational Health and Safety Authority', 'Occupational Health and Safety Authority', 'OHSA', 'regulatory_authority',
   'https://ohsa.org.mt', NULL,
   ARRAY['ohs_consultant', 'ohs_coordinator'],
   'National authority for workplace health and safety'),

  ('MT-CPD', 'MT', 'Malta Civil Protection Department', 'Malta Civil Protection Department', 'CPD', 'agency',
   'https://homeaffairs.gov.mt/en/mhas-departments/civil-protection-department', NULL,
   ARRAY['fire_safety_officer'],
   'Fire and civil protection authority'),

  ('MT-HA', 'MT', 'Health Authority', 'Health Authority', 'HA', 'regulatory_authority',
   'https://deputyprimeminister.gov.mt/en/health-promotion/Pages/Health-Authority.aspx', NULL,
   ARRAY['all_health_professions'],
   'Superintendence of public health'),

  ('MT-MIA', 'MT', 'Malta Institute of Accountants', 'Malta Institute of Accountants', 'MIA', 'institute',
   'https://miamalta.org', NULL,
   ARRAY['accountant', 'auditor'],
   'Professional accountancy body')

ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- BELGIUM (BE) — 14 bodies
-- =====================================================

INSERT INTO professional_bodies (code, country_code, name_local, name_en, abbreviation, body_type, website_url, register_url, professions_covered, notes)
VALUES
  -- Registry & Tax
  ('BE-KBO', 'BE', 'Kruispuntbank van Ondernemingen / Banque-Carrefour des Entreprises', 'Crossroads Bank for Enterprises', 'KBO/BCE', 'register',
   'https://kbopub.economie.fgov.be', 'https://kbopub.economie.fgov.be',
   ARRAY['all_companies'],
   'Central enterprise database for Belgium'),

  ('BE-SPF', 'BE', 'SPF Finances / FOD Financiën', 'Federal Public Service Finance', 'SPF/FOD', 'ministry',
   'https://finances.belgium.be', NULL,
   ARRAY['all_legal_forms'],
   'Federal tax authority'),

  -- Healthcare professions
  ('BE-RIZIV', 'BE', 'Rijksinstituut voor ziekte- en invaliditeitsverzekering / INAMI', 'National Institute for Health and Disability Insurance', 'RIZIV/INAMI', 'regulatory_authority',
   'https://www.riziv.fgov.be', NULL,
   ARRAY['medical_doctor', 'dentist', 'pharmacist', 'nurse', 'midwife'],
   'Health professions registration authority'),

  ('BE-OMA', 'BE', 'Ordre des médecins / Orde van Artsen', 'Order of Physicians', 'INAMI', 'order',
   'https://ordomedic.be', NULL,
   ARRAY['medical_doctor'],
   'Medical council for Belgium'),

  ('BE-CD', 'BE', 'Commission dentaire / Tandheelkundige Commissie', 'Dental Commission', 'CD', 'council',
   'https://commissiontandarts.be', NULL,
   ARRAY['dentist'],
   'Dental practitioners regulatory body'),

  ('BE-OPH', 'BE', 'Ordre des pharmaciens / Orde van Apothekers', 'Order of Pharmacists', 'OPH', 'order',
   'https://www.ordredespharmaciensbe', NULL,
   ARRAY['pharmacist'],
   'Pharmacists professional order'),

  ('BE-OMV', 'BE', 'Ordre des médecins vétérinaires / Orde van Dierenartsen', 'Order of Veterinarians', 'OMV', 'order',
   'https://ordedesdierenartsen.be', NULL,
   ARRAY['veterinarian'],
   'Veterinary council'),

  -- Legal professions
  ('BE-OVB', 'BE', 'Ordre français du barreau / Orde van Vlaamse Balies', 'Bar Association', 'OVB', 'bar',
   'https://avocats.be', NULL,
   ARRAY['lawyer'],
   'Belgian bar associations (bilingual)'),

  ('BE-OA', 'BE', 'Ordre des architectes / Orde van Architecten', 'Order of Architects', 'OA', 'order',
   'https://ordredesarchitectes.be', NULL,
   ARRAY['architect'],
   'Architects professional order'),

  ('BE-IEC', 'BE', 'Institut des Experts-comptables et des Conseils fiscaux / Instituut van de Accountants', 'Institute of Accountants and Tax Advisors', 'IEC/IAB', 'institute',
   'https://ipcf.be', NULL,
   ARRAY['accountant', 'tax_advisor'],
   'Accountancy professional body'),

  -- Health & Safety
  ('BE-FEDRIS', 'BE', 'Agence fédérale des risques professionnels / Federaal Agentschap voor Beroepsrisico\'s', 'Federal Agency for Occupational Risks', 'FEDRIS', 'agency',
   'https://www.fedris.be', NULL,
   ARRAY['ohs_consultant', 'ohs_coordinator'],
   'Occupational health and safety authority'),

  ('BE-SPF-ET', 'BE', 'SPF Emploi, Travail et Concertation sociale / FOD Werkgelegenheid', 'Federal Public Service Employment, Labour and Social Dialogue', 'SPF/FOD', 'ministry',
   'https://emploi.belgique.be', NULL,
   ARRAY['ohs_consultant'],
   'Labour inspectorate and workplace safety'),

  ('BE-FS', 'BE', 'Service d\'Incendie et d\'Aide médicale urgente / Brandweer', 'Fire and Emergency Medical Services', 'SIAMU', 'agency',
   'https://www.pompiers.be', NULL,
   ARRAY['fire_safety_officer'],
   'Fire services authority'),

  ('BE-AFMPS', 'BE', 'Agence fédérale des médicaments et des produits de santé / FAGG', 'Federal Agency for Medicines and Health Products', 'AFMPS/FAGG', 'agency',
   'https://www.afmps.be', NULL,
   ARRAY['all_health_professions'],
   'Health products regulatory authority')

ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- LITHUANIA (LT) — 15 bodies
-- =====================================================

INSERT INTO professional_bodies (code, country_code, name_local, name_en, abbreviation, body_type, website_url, register_url, professions_covered, notes)
VALUES
  -- Registry & Tax
  ('LT-RC', 'LT', 'Registrų centras', 'State Enterprise Centre of Registers', 'RC', 'register',
   'https://www.registrucentras.lt', 'https://www.registrucentras.lt/jar',
   ARRAY['all_companies'],
   'Central business register for Lithuania'),

  ('LT-VMI', 'LT', 'Valstybinė mokesčių inspekcija', 'State Tax Inspectorate', 'VMI', 'inspectorate',
   'https://www.vmi.lt', NULL,
   ARRAY['all_legal_forms'],
   'Tax authority'),

  -- Healthcare professions
  ('LT-LGD', 'LT', 'Lietuvos gydytojų draugija', 'Lithuanian Medical Association', 'LGD', 'association',
   'https://lgd.lt', NULL,
   ARRAY['medical_doctor'],
   'Voluntary medical association'),

  ('LT-ORC', 'LT', 'Odontologų rūmai', 'Lithuanian Dental Chamber', 'OR', 'chamber',
   'https://www.odontologurumai.lt', NULL,
   ARRAY['dentist'],
   'Mandatory chamber for dentists'),

  ('LT-LFD', 'LT', 'Lietuvos farmacijos draugija', 'Lithuanian Pharmaceutical Society', 'LFD', 'association',
   'https://www.farmacija.lt', NULL,
   ARRAY['pharmacist'],
   'Pharmaceutical professional body'),

  ('LT-VVT', 'LT', 'Valstybinė maisto ir veterinarijos tarnyba', 'State Food and Veterinary Service', 'VMVT', 'inspectorate',
   'https://vmvt.lt', NULL,
   ARRAY['veterinarian'],
   'Veterinary regulatory authority'),

  -- Legal professions
  ('LT-LAD', 'LT', 'Lietuvos advokatūra', 'Lithuanian Bar Association', 'LAD', 'bar',
   'https://www.advokatura.lt', NULL,
   ARRAY['lawyer'],
   'Bar association for advocates'),

  ('LT-NR', 'LT', 'Lietuvos notarų rūmai', 'Lithuanian Chamber of Notaries', 'LNR', 'chamber',
   'https://www.notarai.lt', NULL,
   ARRAY['notary'],
   'Notaries chamber'),

  ('LT-AR', 'LT', 'Architektų rūmai', 'Lithuanian Union of Architects', 'AR', 'chamber',
   'https://architektusajunga.lt', NULL,
   ARRAY['architect'],
   'Architects professional body'),

  ('LT-AuR', 'LT', 'Auditorių rūmai', 'Chamber of Auditors of Lithuania', 'AR', 'chamber',
   'https://www.lar.lt', NULL,
   ARRAY['auditor'],
   'Statutory auditors chamber'),

  -- Health & Safety
  ('LT-VDI', 'LT', 'Valstybinė darbo inspekcija', 'State Labour Inspectorate', 'VDI', 'inspectorate',
   'https://www.vdi.lt', NULL,
   ARRAY['ohs_consultant', 'ohs_coordinator'],
   'Labour inspection and workplace safety authority'),

  ('LT-PAGD', 'LT', 'Priešgaisrinės apsaugos ir gelbėjimo departamentas', 'Fire and Rescue Department', 'PAGD', 'agency',
   'https://www.vpgt.lt', NULL,
   ARRAY['fire_safety_officer'],
   'Fire safety regulatory authority'),

  ('LT-SAM', 'LT', 'Sveikatos apsaugos ministerija', 'Ministry of Health', 'SAM', 'ministry',
   'https://sam.lrv.lt', NULL,
   ARRAY['all_health_professions'],
   'Health ministry overseeing health professionals'),

  ('LT-VLK', 'LT', 'Valstybinė ligonių kasa', 'National Health Insurance Fund', 'VLK', 'agency',
   'https://www.vlk.lt', NULL,
   ARRAY['medical_doctor', 'dentist', 'nurse'],
   'Health insurance and provider registration'),

  ('LT-LAASP', 'LT', 'Lietuvos apskaitos ir audito specialistų profesinė organizacija', 'Lithuanian Association of Accountants and Auditors', 'LAASP', 'association',
   'https://www.laaa.lt', NULL,
   ARRAY['accountant'],
   'Accountants professional association')

ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- LATVIA (LV) — 14 bodies
-- =====================================================

INSERT INTO professional_bodies (code, country_code, name_local, name_en, abbreviation, body_type, website_url, register_url, professions_covered, notes)
VALUES
  -- Registry & Tax
  ('LV-UR', 'LV', 'Uzņēmumu reģistrs', 'Register of Enterprises', 'UR', 'register',
   'https://www.ur.gov.lv', 'https://www.ur.gov.lv',
   ARRAY['all_companies'],
   'Central commercial register'),

  ('LV-VID', 'LV', 'Valsts ieņēmumu dienests', 'State Revenue Service', 'VID', 'agency',
   'https://www.vid.gov.lv', NULL,
   ARRAY['all_legal_forms'],
   'Tax and customs authority'),

  -- Healthcare professions
  ('LV-LDA', 'LV', 'Latvijas Ārstu biedrība', 'Latvian Medical Association', 'LAB', 'association',
   'https://www.arstubiedriba.lv', NULL,
   ARRAY['medical_doctor'],
   'Voluntary medical association'),

  ('LV-VI', 'LV', 'Veselības inspekcija', 'Health Inspectorate', 'VI', 'inspectorate',
   'https://www.vi.gov.lv', 'https://www.vi.gov.lv/lv/systems',
   ARRAY['medical_doctor', 'dentist', 'pharmacist', 'nurse', 'midwife'],
   'Health professions licensing authority'),

  ('LV-LSB', 'LV', 'Latvijas Zobārstu biedrība', 'Latvian Dental Association', 'LZB', 'association',
   'https://www.lzb.lv', NULL,
   ARRAY['dentist'],
   'Dental professional association'),

  ('LV-LFB', 'LV', 'Latvijas Farmaceitu biedrība', 'Latvian Pharmaceutical Association', 'LFB', 'association',
   'https://www.farmacija.lv', NULL,
   ARRAY['pharmacist'],
   'Pharmacists association'),

  ('LV-PVD', 'LV', 'Pārtikas un veterinārais dienests', 'Food and Veterinary Service', 'PVD', 'agency',
   'https://www.pvd.gov.lv', NULL,
   ARRAY['veterinarian'],
   'Veterinary regulatory body'),

  -- Legal professions
  ('LV-LA', 'LV', 'Latvijas Advokātūra', 'Latvian Bar Association', 'LA', 'bar',
   'https://www.advokatura.lv', NULL,
   ARRAY['lawyer'],
   'Bar for advocates'),

  ('LV-NP', 'LV', 'Latvijas Zvērinātu notāru padome', 'Latvian Council of Sworn Notaries', 'LZNP', 'council',
   'https://www.notariats.lv', NULL,
   ARRAY['notary'],
   'Notaries council'),

  ('LV-ZTP', 'LV', 'Latvijas Zvērinātu tiesu izpildītāju padome', 'Latvian Council of Sworn Bailiffs', 'LZTIP', 'council',
   'https://www.tzip.lv', NULL,
   ARRAY['bailiff'],
   'Bailiffs council'),

  ('LV-AA', 'LV', 'Latvijas Arhitektu savienība', 'Latvian Union of Architects', 'LAS', 'association',
   'https://www.latarh.lv', NULL,
   ARRAY['architect'],
   'Architects professional body'),

  -- Health & Safety
  ('LV-VDI', 'LV', 'Valsts darba inspekcija', 'State Labour Inspectorate', 'VDI', 'inspectorate',
   'https://www.vdi.gov.lv', NULL,
   ARRAY['ohs_consultant', 'ohs_coordinator'],
   'Labour and workplace safety inspectorate'),

  ('LV-VUGD', 'LV', 'Valsts ugunsdzēsības un glābšanas dienests', 'State Fire and Rescue Service', 'VUGD', 'agency',
   'https://www.vugd.gov.lv', NULL,
   ARRAY['fire_safety_officer'],
   'Fire safety authority'),

  ('LV-LGRK', 'LV', 'Latvijas Grāmatvežu un revidentu komercsabiedrība', 'Latvian Association of Certified Accountants', 'LGRK', 'association',
   'https://www.lrca.lv', NULL,
   ARRAY['accountant'],
   'Accountants professional body')

ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- ESTONIA (EE) — 14 bodies
-- =====================================================

INSERT INTO professional_bodies (code, country_code, name_local, name_en, abbreviation, body_type, website_url, register_url, professions_covered, notes)
VALUES
  -- Registry & Tax
  ('EE-TTJA', 'EE', 'Tarbijakaitse ja Tehnilise Järelevalve Amet / Registrite ja Infosüsteemide Keskus', 'Centre of Registers and Information Systems', 'RIK', 'register',
   'https://www.rik.ee', 'https://ariregister.rik.ee',
   ARRAY['all_companies'],
   'Central commercial register'),

  ('EE-MTA', 'EE', 'Maksu- ja Tolliamet', 'Tax and Customs Board', 'MTA', 'board',
   'https://www.emta.ee', NULL,
   ARRAY['all_legal_forms'],
   'Tax authority'),

  -- Healthcare professions
  ('EE-EAL', 'EE', 'Eesti Arstide Liit', 'Estonian Medical Association', 'EAL', 'association',
   'https://www.arstideliit.ee', NULL,
   ARRAY['medical_doctor'],
   'Medical association'),

  ('EE-TI', 'EE', 'Terviseamet', 'Health Board', 'TA', 'board',
   'https://www.terviseamet.ee', 'https://www.terviseamet.ee/et/registrid',
   ARRAY['medical_doctor', 'dentist', 'pharmacist', 'nurse', 'midwife'],
   'Health professions licensing authority'),

  ('EE-HAL', 'EE', 'Eesti Hambaarstide Liit', 'Estonian Dental Association', 'EHL', 'association',
   'https://www.ehl.ee', NULL,
   ARRAY['dentist'],
   'Dental association'),

  ('EE-EAÜ', 'EE', 'Eesti Apteekrite Ühing', 'Estonian Pharmacists\' Association', 'EAÜ', 'association',
   'https://www.apteekur.ee', NULL,
   ARRAY['pharmacist'],
   'Pharmacists association'),

  ('EE-VLI', 'EE', 'Veterinaar- ja Toiduamet', 'Veterinary and Food Board', 'VTA', 'board',
   'https://pta.agri.ee', NULL,
   ARRAY['veterinarian'],
   'Veterinary regulatory authority'),

  -- Legal professions
  ('EE-EAK', 'EE', 'Eesti Advokatuur', 'Estonian Bar Association', 'EAK', 'bar',
   'https://www.advokatuur.ee', NULL,
   ARRAY['lawyer'],
   'Bar association'),

  ('EE-ENK', 'EE', 'Eesti Notarite Koda', 'Estonian Chamber of Notaries', 'ENK', 'chamber',
   'https://www.notar.ee', NULL,
   ARRAY['notary'],
   'Notaries chamber'),

  ('EE-EAL-A', 'EE', 'Eesti Arhitektide Liit', 'Union of Estonian Architects', 'EAL', 'association',
   'https://www.arhliit.ee', NULL,
   ARRAY['architect'],
   'Architects professional union'),

  ('EE-EAA', 'EE', 'Eesti Audiitorkogu', 'Estonian Board of Auditors', 'EAA', 'board',
   'https://www.audiitorkogu.ee', NULL,
   ARRAY['auditor'],
   'Statutory auditors board'),

  -- Health & Safety
  ('EE-TI-T', 'EE', 'Tööinspektsioon', 'Labour Inspectorate', 'TI', 'inspectorate',
   'https://www.ti.ee', NULL,
   ARRAY['ohs_consultant', 'ohs_coordinator'],
   'Occupational health and safety authority'),

  ('EE-PMA', 'EE', 'Päästeamet', 'Rescue Board', 'PA', 'board',
   'https://www.rescue.ee', NULL,
   ARRAY['fire_safety_officer'],
   'Fire and rescue services'),

  ('EE-ERAA', 'EE', 'Eesti Raamatupidajate Assotsiatsioon', 'Estonian Accountants Association', 'ERAA', 'association',
   'https://www.eraa.ee', NULL,
   ARRAY['accountant'],
   'Accountants association')

ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- JUNCTIONS: legal_form_bodies
-- =====================================================

-- ---------------------
-- MALTA (MT) — 20 forms
-- ---------------------

-- All company forms → Registry + Tax + OHSA
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT
  lf.code,
  'MT-MBR',
  'registration',
  true,
  'Mandatory registration with Malta Business Registry'
FROM legal_forms lf
WHERE lf.code IN ('MT-LTD', 'MT-PLC', 'MT-ENC', 'MT-ECOMM', 'MT-SE', 'MT-EEIG', 'MT-BRANCH', 'MT-CELL', 'MT-SOLE', 'MT-VOL', 'MT-COOP')
ON CONFLICT DO NOTHING;

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT
  lf.code,
  'MT-CfR',
  'registration',
  true,
  'Tax registration required'
FROM legal_forms lf
WHERE lf.code IN ('MT-LTD', 'MT-PLC', 'MT-ENC', 'MT-ECOMM', 'MT-SE', 'MT-EEIG', 'MT-BRANCH', 'MT-CELL', 'MT-SOLE', 'MT-VOL', 'MT-COOP',
                  'MT-MED', 'MT-DENT', 'MT-PHARM', 'MT-NURSE', 'MT-MID', 'MT-VET', 'MT-ARCH', 'MT-AVV', 'MT-NOT')
ON CONFLICT DO NOTHING;

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT
  lf.code,
  'MT-OHSA',
  'supervision',
  true,
  'Workplace health and safety compliance'
FROM legal_forms lf
WHERE lf.code IN ('MT-LTD', 'MT-PLC', 'MT-ENC', 'MT-ECOMM', 'MT-SE', 'MT-EEIG', 'MT-BRANCH', 'MT-CELL', 'MT-SOLE', 'MT-COOP',
                  'MT-MED', 'MT-DENT', 'MT-PHARM', 'MT-VET', 'MT-ARCH', 'MT-AVV', 'MT-NOT')
ON CONFLICT DO NOTHING;

-- Professional forms → respective councils + Health Authority
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
VALUES
  ('MT-MED', 'MT-MC', 'licensing', true, 'Medical Council license required'),
  ('MT-DENT', 'MT-DC', 'licensing', true, 'Dental Council license required'),
  ('MT-PHARM', 'MT-PC', 'licensing', true, 'Pharmacy Council license required'),
  ('MT-NURSE', 'MT-MC', 'licensing', true, 'Nursing registration with Medical Council'),
  ('MT-MID', 'MT-MC', 'licensing', true, 'Midwifery registration'),
  ('MT-VET', 'MT-VC', 'licensing', true, 'Veterinary Council license'),
  ('MT-ARCH', 'MT-CACE', 'membership', true, 'Chamber membership mandatory'),
  ('MT-AVV', 'MT-CoA', 'membership', true, 'Bar enrollment required'),
  ('MT-NOT', 'MT-NC', 'licensing', true, 'Notarial Council license')
ON CONFLICT DO NOTHING;

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT
  lf.code,
  'MT-HA',
  'supervision',
  true,
  'Health Authority oversight'
FROM legal_forms lf
WHERE lf.code IN ('MT-MED', 'MT-DENT', 'MT-PHARM', 'MT-NURSE', 'MT-MID')
ON CONFLICT DO NOTHING;

-- ---------------------
-- BELGIUM (BE) — 20 forms
-- ---------------------

-- All company forms → KBO + SPF + SSM
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT
  lf.code,
  'BE-KBO',
  'registration',
  true,
  'Mandatory registration with KBO/BCE'
FROM legal_forms lf
WHERE lf.code IN ('BE-SRL', 'BE-SA', 'BE-SNC', 'BE-SCOMM', 'BE-MAAT', 'BE-SE', 'BE-EEIG', 'BE-BRANCH', 'BE-INDEP', 'BE-ASBL', 'BE-FOND', 'BE-SC')
ON CONFLICT DO NOTHING;

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT
  lf.code,
  'BE-SPF',
  'registration',
  true,
  'Tax registration required'
FROM legal_forms lf
WHERE lf.code IN ('BE-SRL', 'BE-SA', 'BE-SNC', 'BE-SCOMM', 'BE-MAAT', 'BE-SE', 'BE-EEIG', 'BE-BRANCH', 'BE-INDEP', 'BE-ASBL', 'BE-FOND', 'BE-SC',
                  'BE-MED', 'BE-DENT', 'BE-PHARM', 'BE-NURSE', 'BE-MID', 'BE-VET', 'BE-ARCH', 'BE-AVT')
ON CONFLICT DO NOTHING;

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT
  lf.code,
  'BE-FEDRIS',
  'supervision',
  true,
  'Occupational risk management'
FROM legal_forms lf
WHERE lf.code IN ('BE-SRL', 'BE-SA', 'BE-SNC', 'BE-SCOMM', 'BE-MAAT', 'BE-SE', 'BE-EEIG', 'BE-BRANCH', 'BE-INDEP', 'BE-SC',
                  'BE-MED', 'BE-DENT', 'BE-PHARM', 'BE-VET', 'BE-ARCH', 'BE-AVT')
ON CONFLICT DO NOTHING;

-- Professional forms → respective orders + RIZIV
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
VALUES
  ('BE-MED', 'BE-RIZIV', 'registration', true, 'INAMI/RIZIV registration mandatory'),
  ('BE-MED', 'BE-OMA', 'membership', true, 'Order of Physicians membership'),
  ('BE-DENT', 'BE-RIZIV', 'registration', true, 'INAMI/RIZIV registration'),
  ('BE-DENT', 'BE-CD', 'supervision', true, 'Dental Commission oversight'),
  ('BE-PHARM', 'BE-RIZIV', 'registration', true, 'INAMI/RIZIV registration'),
  ('BE-PHARM', 'BE-OPH', 'membership', true, 'Order of Pharmacists membership'),
  ('BE-NURSE', 'BE-RIZIV', 'registration', true, 'INAMI/RIZIV registration'),
  ('BE-MID', 'BE-RIZIV', 'registration', true, 'INAMI/RIZIV registration'),
  ('BE-VET', 'BE-OMV', 'membership', true, 'Order of Veterinarians membership'),
  ('BE-ARCH', 'BE-OA', 'membership', true, 'Order of Architects membership'),
  ('BE-AVT', 'BE-OVB', 'membership', true, 'Bar admission required')
ON CONFLICT DO NOTHING;

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT
  lf.code,
  'BE-AFMPS',
  'supervision',
  true,
  'Health products regulatory oversight'
FROM legal_forms lf
WHERE lf.code IN ('BE-MED', 'BE-DENT', 'BE-PHARM', 'BE-NURSE', 'BE-MID')
ON CONFLICT DO NOTHING;

-- ---------------------
-- LITHUANIA (LT) — 25 forms
-- ---------------------

-- All company forms → RC + VMI + VDI
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT
  lf.code,
  'LT-RC',
  'registration',
  true,
  'Mandatory registration with Centre of Registers'
FROM legal_forms lf
WHERE lf.code IN ('LT-UAB', 'LT-AB', 'LT-MB', 'LT-TUB', 'LT-KUB', 'LT-SE', 'LT-EEIG', 'LT-BRANCH', 'LT-II', 'LT-IV', 'LT-VERSLO', 'LT-ASOC', 'LT-VBI', 'LT-FOND', 'LT-COOP')
ON CONFLICT DO NOTHING;

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT
  lf.code,
  'LT-VMI',
  'registration',
  true,
  'Tax registration required'
FROM legal_forms lf
WHERE lf.code IN ('LT-UAB', 'LT-AB', 'LT-MB', 'LT-TUB', 'LT-KUB', 'LT-SE', 'LT-EEIG', 'LT-BRANCH', 'LT-II', 'LT-IV', 'LT-VERSLO', 'LT-ASOC', 'LT-VBI', 'LT-FOND', 'LT-COOP',
                  'LT-MED', 'LT-DENT', 'LT-PHARM', 'LT-NURSE', 'LT-MID', 'LT-VET', 'LT-ARCH', 'LT-ADV', 'LT-NOT', 'LT-AUD')
ON CONFLICT DO NOTHING;

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT
  lf.code,
  'LT-VDI',
  'supervision',
  true,
  'Labour inspectorate supervision'
FROM legal_forms lf
WHERE lf.code IN ('LT-UAB', 'LT-AB', 'LT-MB', 'LT-TUB', 'LT-KUB', 'LT-SE', 'LT-EEIG', 'LT-BRANCH', 'LT-II', 'LT-IV', 'LT-VERSLO', 'LT-COOP',
                  'LT-MED', 'LT-DENT', 'LT-PHARM', 'LT-VET', 'LT-ARCH', 'LT-ADV', 'LT-NOT', 'LT-AUD')
ON CONFLICT DO NOTHING;

-- Professional forms → respective bodies
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
VALUES
  ('LT-MED', 'LT-SAM', 'licensing', true, 'Ministry of Health licensing'),
  ('LT-MED', 'LT-VLK', 'registration', true, 'Health insurance registration'),
  ('LT-DENT', 'LT-ORC', 'membership', true, 'Dental Chamber membership mandatory'),
  ('LT-DENT', 'LT-VLK', 'registration', true, 'Health insurance registration'),
  ('LT-PHARM', 'LT-SAM', 'licensing', true, 'Pharmacy licensing'),
  ('LT-NURSE', 'LT-SAM', 'licensing', true, 'Nursing license'),
  ('LT-NURSE', 'LT-VLK', 'registration', true, 'Health insurance registration'),
  ('LT-MID', 'LT-SAM', 'licensing', true, 'Midwifery license'),
  ('LT-VET', 'LT-VVT', 'licensing', true, 'Veterinary license mandatory'),
  ('LT-ARCH', 'LT-AR', 'membership', false, 'Voluntary membership'),
  ('LT-ADV', 'LT-LAD', 'membership', true, 'Bar admission required'),
  ('LT-NOT', 'LT-NR', 'membership', true, 'Notarial chamber membership mandatory'),
  ('LT-AUD', 'LT-AuR', 'licensing', true, 'Auditors chamber license')
ON CONFLICT DO NOTHING;

-- ---------------------
-- LATVIA (LV) — 22 forms
-- ---------------------

-- All company forms → UR + VID + VDI
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT
  lf.code,
  'LV-UR',
  'registration',
  true,
  'Mandatory registration with Register of Enterprises'
FROM legal_forms lf
WHERE lf.code IN ('LV-SIA', 'LV-AS', 'LV-PS', 'LV-KS', 'LV-SE', 'LV-EEIG', 'LV-BRANCH', 'LV-IK', 'LV-BIEDR', 'LV-NODIB', 'LV-COOP', 'LV-PUB')
ON CONFLICT DO NOTHING;

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT
  lf.code,
  'LV-VID',
  'registration',
  true,
  'Tax registration required'
FROM legal_forms lf
WHERE lf.code IN ('LV-SIA', 'LV-AS', 'LV-PS', 'LV-KS', 'LV-SE', 'LV-EEIG', 'LV-BRANCH', 'LV-IK', 'LV-BIEDR', 'LV-NODIB', 'LV-COOP', 'LV-PUB',
                  'LV-MED', 'LV-DENT', 'LV-PHARM', 'LV-NURSE', 'LV-MID', 'LV-VET', 'LV-ARCH', 'LV-ADV', 'LV-NOT', 'LV-BAILIFF')
ON CONFLICT DO NOTHING;

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT
  lf.code,
  'LV-VDI',
  'supervision',
  true,
  'Labour inspectorate supervision'
FROM legal_forms lf
WHERE lf.code IN ('LV-SIA', 'LV-AS', 'LV-PS', 'LV-KS', 'LV-SE', 'LV-EEIG', 'LV-BRANCH', 'LV-IK', 'LV-COOP',
                  'LV-MED', 'LV-DENT', 'LV-PHARM', 'LV-VET', 'LV-ARCH', 'LV-ADV', 'LV-NOT', 'LV-BAILIFF')
ON CONFLICT DO NOTHING;

-- Professional forms → respective bodies
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
VALUES
  ('LV-MED', 'LV-VI', 'licensing', true, 'Health Inspectorate license'),
  ('LV-DENT', 'LV-VI', 'licensing', true, 'Dental license from Health Inspectorate'),
  ('LV-PHARM', 'LV-VI', 'licensing', true, 'Pharmacy license'),
  ('LV-NURSE', 'LV-VI', 'licensing', true, 'Nursing license'),
  ('LV-MID', 'LV-VI', 'licensing', true, 'Midwifery license'),
  ('LV-VET', 'LV-PVD', 'licensing', true, 'Veterinary license mandatory'),
  ('LV-ARCH', 'LV-AA', 'membership', false, 'Voluntary membership'),
  ('LV-ADV', 'LV-LA', 'membership', true, 'Bar admission required'),
  ('LV-NOT', 'LV-NP', 'membership', true, 'Sworn notaries council membership'),
  ('LV-BAILIFF', 'LV-ZTP', 'membership', true, 'Sworn bailiffs council membership')
ON CONFLICT DO NOTHING;

-- ---------------------
-- ESTONIA (EE) — 21 forms
-- ---------------------

-- All company forms → RIK + MTA + TI
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT
  lf.code,
  'EE-TTJA',
  'registration',
  true,
  'Mandatory registration with RIK'
FROM legal_forms lf
WHERE lf.code IN ('EE-OU', 'EE-AS', 'EE-TU', 'EE-UU', 'EE-SE', 'EE-EEIG', 'EE-BRANCH', 'EE-FIE', 'EE-MTU', 'EE-SA', 'EE-TULIST', 'EE-PUB')
ON CONFLICT DO NOTHING;

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT
  lf.code,
  'EE-MTA',
  'registration',
  true,
  'Tax registration required'
FROM legal_forms lf
WHERE lf.code IN ('EE-OU', 'EE-AS', 'EE-TU', 'EE-UU', 'EE-SE', 'EE-EEIG', 'EE-BRANCH', 'EE-FIE', 'EE-MTU', 'EE-SA', 'EE-TULIST', 'EE-PUB',
                  'EE-MED', 'EE-DENT', 'EE-PHARM', 'EE-NURSE', 'EE-MID', 'EE-VET', 'EE-ARCH', 'EE-ADV', 'EE-NOT')
ON CONFLICT DO NOTHING;

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
SELECT
  lf.code,
  'EE-TI-T',
  'supervision',
  true,
  'Labour inspectorate supervision'
FROM legal_forms lf
WHERE lf.code IN ('EE-OU', 'EE-AS', 'EE-TU', 'EE-UU', 'EE-SE', 'EE-EEIG', 'EE-BRANCH', 'EE-FIE', 'EE-SA',
                  'EE-MED', 'EE-DENT', 'EE-PHARM', 'EE-VET', 'EE-ARCH', 'EE-ADV', 'EE-NOT')
ON CONFLICT DO NOTHING;

-- Professional forms → respective bodies
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes)
VALUES
  ('EE-MED', 'EE-TI', 'licensing', true, 'Health Board license'),
  ('EE-DENT', 'EE-TI', 'licensing', true, 'Dental license from Health Board'),
  ('EE-PHARM', 'EE-TI', 'licensing', true, 'Pharmacy license'),
  ('EE-NURSE', 'EE-TI', 'licensing', true, 'Nursing license'),
  ('EE-MID', 'EE-TI', 'licensing', true, 'Midwifery license'),
  ('EE-VET', 'EE-VLI', 'licensing', true, 'Veterinary license mandatory'),
  ('EE-ARCH', 'EE-EAL-A', 'membership', false, 'Voluntary membership'),
  ('EE-ADV', 'EE-EAK', 'membership', true, 'Bar admission required'),
  ('EE-NOT', 'EE-ENK', 'membership', true, 'Notaries chamber membership mandatory')
ON CONFLICT DO NOTHING;

-- =====================================================
-- END OF FILE
-- =====================================================
