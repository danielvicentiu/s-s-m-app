-- ==================================================================
-- B2_bodies_DK_FI_NO_IS_AT_CZ.sql
-- Professional Bodies and Regulatory Authorities for:
-- DK (Denmark), FI (Finland), NO (Norway), IS (Iceland), AT (Austria), CZ (Czech Republic)
-- ==================================================================
-- Generated: 2026-02-15
-- Agent: B2 - Professional Bodies Agent
-- Schema: professional_bodies + legal_form_bodies (M2M junction)
-- ==================================================================

-- ==================================================================
-- DENMARK (DK) - Professional Bodies
-- ==================================================================

INSERT INTO professional_bodies (
  code, country_code, name_local, name_en, abbreviation,
  body_type, website_url, register_url, parent_body_code,
  professions_covered, notes
) VALUES
-- Business & Tax Authorities
('DK-CVR', 'DK',
 'Centrale Virksomhedsregister',
 'Central Business Register', 'CVR',
 'register',
 'https://www.danishbusinessauthority.dk/',
 'https://cvr.dk',
 NULL,
 ARRAY['all companies'],
 'All Danish businesses must register in CVR.'),

('DK-SKAT', 'DK',
 'Skattestyrelsen',
 'Danish Tax Agency', 'SKAT',
 'regulatory_authority',
 'https://skat.dk/en-us/individuals',
 NULL,
 NULL,
 ARRAY['all taxpayers'],
 'National tax authority for Denmark.'),

-- Healthcare Professionals
('DK-STPS', 'DK',
 'Styrelsen for Patientsikkerhed',
 'Danish Patient Safety Authority', 'STPS',
 'regulatory_authority',
 'https://en.stps.dk/',
 'https://en.stps.dk/professionals/authorisation/',
 NULL,
 ARRAY['medic','dentist','nurse','midwife','pharmacist'],
 'Handles authorization for all healthcare professionals in Denmark.'),

('DK-LAEGER', 'DK',
 'Lægeforeningen',
 'Danish Medical Association', NULL,
 'association',
 'https://laeger.dk/foreninger/laegeforeningen/om-laegeforeningen/english/',
 NULL,
 NULL,
 ARRAY['medic'],
 'Professional association for doctors in Denmark.'),

('DK-TAND', 'DK',
 'Tandlægeforeningen',
 'Danish Dental Association', NULL,
 'association',
 'https://www.tandlaegeforeningen.dk/',
 NULL,
 NULL,
 ARRAY['dentist'],
 'Professional association for dentists in Denmark.'),

('DK-APOT', 'DK',
 'Apotekerforeningen',
 'Association of Danish Pharmacies', NULL,
 'association',
 'https://www.apotekerforeningen.dk/',
 NULL,
 NULL,
 ARRAY['pharmacist'],
 'Professional association for pharmacies in Denmark.'),

('DK-LMS', 'DK',
 'Lægemiddelstyrelsen',
 'Danish Medicines Agency', 'LMS',
 'regulatory_authority',
 'https://laegemiddelstyrelsen.dk/en/',
 NULL,
 NULL,
 ARRAY['pharmacist'],
 'Regulates medicines and pharmacies in Denmark.'),

('DK-DYR', 'DK',
 'Den Danske Dyrelægeforening',
 'Danish Veterinary Association', 'DDD',
 'association',
 'https://www.ddd.dk/english/',
 NULL,
 NULL,
 ARRAY['veterinar'],
 'Professional association for veterinarians in Denmark.'),

('DK-FVST', 'DK',
 'Fødevarestyrelsen',
 'Danish Veterinary and Food Administration', 'FVST',
 'regulatory_authority',
 'https://en.foedevarestyrelsen.dk/',
 NULL,
 NULL,
 ARRAY['veterinar'],
 'Regulates veterinary practice and food safety.'),

-- Other Professions
('DK-ARK', 'DK',
 'Akademisk Arkitektforening',
 'Danish Association of Architects', 'AA',
 'association',
 'https://arkitektforeningen.dk/',
 NULL,
 NULL,
 ARRAY['architect'],
 'Professional association for architects in Denmark.'),

('DK-ADV', 'DK',
 'Advokatsamfundet',
 'Danish Bar and Law Society', NULL,
 'bar',
 'https://www.advokatsamfundet.dk/english/',
 'https://www.advokatsamfundet.dk/advokatsoegning/',
 NULL,
 ARRAY['lawyer','advocate'],
 'Mandatory membership for all Danish lawyers.'),

('DK-FSR', 'DK',
 'FSR - Danske Revisorer',
 'FSR - Danish Auditors', 'FSR',
 'association',
 'https://www.fsr.dk/om-fsr/about-fsr',
 NULL,
 NULL,
 ARRAY['auditor','accountant'],
 'Professional body for auditors and accountants.'),

-- Health, Safety & Emergency
('DK-AT', 'DK',
 'Arbejdstilsynet',
 'Danish Working Environment Authority', 'AT',
 'regulatory_authority',
 'https://at.dk/en/',
 NULL,
 NULL,
 ARRAY['occupational safety'],
 'National authority for occupational health and safety.'),

('DK-BRS', 'DK',
 'Beredskabsstyrelsen',
 'Danish Emergency Management Agency', 'DEMA',
 'regulatory_authority',
 'https://www.brs.dk/en',
 NULL,
 NULL,
 ARRAY['fire safety','civil protection'],
 'National emergency management and fire authority.')

ON CONFLICT (code) DO NOTHING;

-- ==================================================================
-- FINLAND (FI) - Professional Bodies
-- ==================================================================

INSERT INTO professional_bodies (
  code, country_code, name_local, name_en, abbreviation,
  body_type, website_url, register_url, parent_body_code,
  professions_covered, notes
) VALUES
-- Business & Tax Authorities
('FI-PRH', 'FI',
 'Patentti- ja rekisterihallitus',
 'Finnish Patent and Registration Office', 'PRH',
 'register',
 'https://www.prh.fi/en/',
 'https://www.ytj.fi/en/',
 NULL,
 ARRAY['all companies'],
 'Finnish Trade Register and business information system.'),

('FI-VERO', 'FI',
 'Verohallinto',
 'Finnish Tax Administration', NULL,
 'regulatory_authority',
 'https://www.vero.fi/en/individuals/',
 NULL,
 NULL,
 ARRAY['all taxpayers'],
 'National tax authority for Finland.'),

-- Healthcare Professionals
('FI-VALVIRA', 'FI',
 'Sosiaali- ja terveysalan lupa- ja valvontavirasto',
 'National Supervisory Authority for Welfare and Health', 'Valvira',
 'regulatory_authority',
 'https://valvira.fi/en/',
 'https://valvira.fi/en/professional_practice_rights/search',
 NULL,
 ARRAY['medic','dentist','nurse','midwife','pharmacist'],
 'Licenses and supervises all healthcare professionals in Finland.'),

('FI-LAAK', 'FI',
 'Suomen Lääkäriliitto',
 'Finnish Medical Association', NULL,
 'association',
 'https://www.laakariliitto.fi/en/fma-organization/',
 NULL,
 NULL,
 ARRAY['medic'],
 'Professional association for doctors in Finland.'),

('FI-HAMMAS', 'FI',
 'Suomen Hammaslääkäriliitto',
 'Finnish Dental Association', NULL,
 'association',
 'https://www.hammaslaakariliitto.fi/en/',
 NULL,
 NULL,
 ARRAY['dentist'],
 'Professional association for dentists in Finland.'),

('FI-APTEEK', 'FI',
 'Suomen Apteekkariliitto',
 'Association of Finnish Pharmacies', NULL,
 'association',
 'https://www.apteekkariliitto.fi/',
 NULL,
 NULL,
 ARRAY['pharmacist'],
 'Professional association for pharmacies in Finland.'),

('FI-ELAIN', 'FI',
 'Suomen Eläinlääkäriliitto',
 'Finnish Veterinary Association', 'SELL',
 'association',
 'https://www.sell.fi/etusivu/english',
 NULL,
 NULL,
 ARRAY['veterinar'],
 'Professional association for veterinarians in Finland.'),

-- Other Professions
('FI-SAFA', 'FI',
 'Suomen Arkkitehtiliitto',
 'Finnish Association of Architects', 'SAFA',
 'association',
 'https://www.safa.fi/en/',
 NULL,
 NULL,
 ARRAY['architect'],
 'Professional association for architects in Finland.'),

('FI-ASIAN', 'FI',
 'Suomen Asianajajaliitto',
 'Finnish Bar Association', NULL,
 'bar',
 'https://asianajajat.fi/en/',
 'https://asianajajat.fi/en/find-an-attorney/',
 NULL,
 ARRAY['lawyer','advocate'],
 'Mandatory membership for advocates in Finland.'),

('FI-TILINT', 'FI',
 'Suomen Tilintarkastajat',
 'Finnish Association of Auditors', NULL,
 'association',
 'https://www.suomentilintarkastajat.fi/',
 NULL,
 NULL,
 ARRAY['auditor','accountant'],
 'Professional body for auditors and accountants.'),

-- Health, Safety & Emergency
('FI-TYOSUO', 'FI',
 'Työsuojeluhallinto',
 'Occupational Safety and Health Administration', 'OSH',
 'regulatory_authority',
 'https://tyosuojelu.fi/en/home',
 NULL,
 NULL,
 ARRAY['occupational safety'],
 'National authority for occupational safety and health.'),

('FI-PELAST', 'FI',
 'Pelastustoimi',
 'Finnish Rescue Services', NULL,
 'regulatory_authority',
 'https://pelastustoimi.fi/en/home',
 NULL,
 NULL,
 ARRAY['fire safety','rescue services'],
 'National coordination for fire and rescue services.'),

('FI-THL', 'FI',
 'Terveyden ja hyvinvoinnin laitos',
 'Finnish Institute for Health and Welfare', 'THL',
 'regulatory_authority',
 'https://thl.fi/en/main-page',
 NULL,
 NULL,
 ARRAY['public health'],
 'National health authority and research institute.')

ON CONFLICT (code) DO NOTHING;

-- ==================================================================
-- NORWAY (NO) - Professional Bodies
-- ==================================================================

INSERT INTO professional_bodies (
  code, country_code, name_local, name_en, abbreviation,
  body_type, website_url, register_url, parent_body_code,
  professions_covered, notes
) VALUES
-- Business & Tax Authorities
('NO-BRREG', 'NO',
 'Brønnøysundregistrene',
 'Brønnøysund Register Centre', 'BRREG',
 'register',
 'https://www.brreg.no/en/',
 'https://www.brreg.no/en/the-business-register/',
 NULL,
 ARRAY['all companies'],
 'Central registry for all Norwegian businesses.'),

('NO-SKATT', 'NO',
 'Skatteetaten',
 'Norwegian Tax Administration', NULL,
 'regulatory_authority',
 'https://www.skatteetaten.no/en/person/',
 NULL,
 NULL,
 ARRAY['all taxpayers'],
 'National tax authority for Norway.'),

-- Healthcare Professionals
('NO-HDIR', 'NO',
 'Helsedirektoratet',
 'Norwegian Directorate of Health', 'HDIR',
 'regulatory_authority',
 'https://www.helsedirektoratet.no/english',
 'https://helsepersonellregisteret.no/en',
 NULL,
 ARRAY['medic','dentist','nurse','midwife','pharmacist','psychologist'],
 'National health authority and healthcare professional registry.'),

('NO-LEGE', 'NO',
 'Den norske legeforeningen',
 'Norwegian Medical Association', 'Legeforeningen',
 'association',
 'https://www.legeforeningen.no/om-oss/english/',
 NULL,
 NULL,
 ARRAY['medic'],
 'Professional association for doctors in Norway.'),

('NO-TANN', 'NO',
 'Den norske tannlegeforening',
 'Norwegian Dental Association', 'NTF',
 'association',
 'https://www.tannlegeforeningen.no/andre/english.html',
 NULL,
 NULL,
 ARRAY['dentist'],
 'Professional association for dentists in Norway.'),

('NO-FARM', 'NO',
 'Norges Farmaceutiske Forening',
 'Norwegian Pharmaceutical Society', 'NFF',
 'association',
 'https://www.farmaceutene.no/engelsk/',
 NULL,
 NULL,
 ARRAY['pharmacist'],
 'Professional association for pharmacists in Norway.'),

('NO-VET', 'NO',
 'Den norske veterinærforening',
 'Norwegian Veterinary Association', 'NVF',
 'association',
 'https://www.vetnett.no/english/category925.html',
 NULL,
 NULL,
 ARRAY['veterinar'],
 'Professional association for veterinarians in Norway.'),

-- Other Professions
('NO-NAL', 'NO',
 'Norske arkitekters landsforbund',
 'National Association of Norwegian Architects', 'NAL',
 'association',
 'https://www.arkitektur.no/',
 NULL,
 NULL,
 ARRAY['architect'],
 'Professional association for architects in Norway.'),

('NO-ADVFOR', 'NO',
 'Advokatforeningen',
 'Norwegian Bar Association', NULL,
 'bar',
 'https://www.advokatforeningen.no/en/',
 'https://www.advokatforeningen.no/finn-advokat/',
 NULL,
 ARRAY['lawyer','advocate'],
 'Mandatory membership for all Norwegian lawyers.'),

('NO-NRRF', 'NO',
 'Den norske Revisorforening',
 'Norwegian Institute of Public Accountants', 'NRRF',
 'association',
 'https://www.revisorforeningen.no/english/the-norwegian-institute-of-public-accountants/',
 NULL,
 NULL,
 ARRAY['auditor','accountant'],
 'Professional body for auditors and accountants.'),

-- Health, Safety & Emergency
('NO-ARBEID', 'NO',
 'Arbeidstilsynet',
 'Norwegian Labour Inspection Authority', NULL,
 'regulatory_authority',
 'https://www.arbeidstilsynet.no/en/',
 NULL,
 NULL,
 ARRAY['occupational safety','labour inspection'],
 'National authority for occupational health and safety.'),

('NO-DSB', 'NO',
 'Direktoratet for samfunnssikkerhet og beredskap',
 'Norwegian Directorate for Civil Protection', 'DSB',
 'regulatory_authority',
 'https://www.dsb.no/en/',
 NULL,
 NULL,
 ARRAY['fire safety','civil protection','emergency management'],
 'National emergency management and fire authority.')

ON CONFLICT (code) DO NOTHING;

-- ==================================================================
-- ICELAND (IS) - Professional Bodies
-- ==================================================================

INSERT INTO professional_bodies (
  code, country_code, name_local, name_en, abbreviation,
  body_type, website_url, register_url, parent_body_code,
  professions_covered, notes
) VALUES
-- Business & Tax Authorities
('IS-RSK', 'IS',
 'Fyrirtækjaskrá Íslands',
 'Business Register', 'RSK',
 'register',
 'https://island.is/en/starting-a-business',
 'https://www.skatturinn.is/english/',
 NULL,
 ARRAY['all companies'],
 'Icelandic business register managed by Revenue and Customs.'),

('IS-SKATT', 'IS',
 'Skatturinn',
 'Iceland Revenue and Customs', 'RSK',
 'regulatory_authority',
 'https://www.skatturinn.is/english/',
 NULL,
 NULL,
 ARRAY['all taxpayers'],
 'National tax and customs authority for Iceland.'),

-- Healthcare Professionals
('IS-LANDLK', 'IS',
 'Embætti landlæknis',
 'Directorate of Health', NULL,
 'regulatory_authority',
 'https://www.landlaeknir.is',
 'https://island.is/en/o/directorate-of-health',
 NULL,
 ARRAY['medic','dentist','nurse','midwife','pharmacist','psychologist'],
 'National health authority and healthcare professional licensing.'),

('IS-MAST', 'IS',
 'Matvælastofnun',
 'Icelandic Food and Veterinary Authority', 'MAST',
 'regulatory_authority',
 'https://www.mast.is/en',
 NULL,
 NULL,
 ARRAY['veterinar'],
 'Regulates veterinary practice and food safety.'),

-- Other Professions
('IS-ARK', 'IS',
 'Arkitektafélag Íslands',
 'Architects Association of Iceland', NULL,
 'association',
 'https://www.honnunarmidstod.is/en/fagfelog/arkitektafelag-islands',
 NULL,
 NULL,
 ARRAY['architect'],
 'Professional association for architects in Iceland.'),

('IS-LMFI', 'IS',
 'Lögmannafélag Íslands',
 'Icelandic Bar Association', 'LMFI',
 'bar',
 'https://lmfi.is/english',
 'https://lmfi.is/english/lawyer-search',
 NULL,
 ARRAY['lawyer','advocate'],
 'Mandatory membership for all Icelandic lawyers.'),

('IS-FLE', 'IS',
 'Félag löggiltra endurskoðenda',
 'Institute of State Authorized Public Accountants', 'FLE',
 'association',
 NULL,
 NULL,
 NULL,
 ARRAY['auditor','accountant'],
 'Professional body for auditors. Founded 1935.'),

-- Health, Safety & Emergency
('IS-VINN', 'IS',
 'Vinnueftirlit ríkisins',
 'Administration of Occupational Safety and Health', 'AOSH',
 'regulatory_authority',
 'https://island.is/en/o/aosh',
 NULL,
 NULL,
 ARRAY['occupational safety'],
 'National authority for occupational safety and health.'),

('IS-ALMAN', 'IS',
 'Almannavarnir ríkisins',
 'Civil Protection and Emergency Management', NULL,
 'regulatory_authority',
 'https://www.almannavarnir.is/english/',
 NULL,
 NULL,
 ARRAY['fire safety','civil protection','emergency management'],
 'National civil protection and emergency management.')

ON CONFLICT (code) DO NOTHING;

-- ==================================================================
-- AUSTRIA (AT) - Professional Bodies
-- ==================================================================

INSERT INTO professional_bodies (
  code, country_code, name_local, name_en, abbreviation,
  body_type, website_url, register_url, parent_body_code,
  professions_covered, notes
) VALUES
-- Business & Tax Authorities
('AT-FB', 'AT',
 'Firmenbuch',
 'Austrian Business Register', 'FB',
 'register',
 'https://www.firmenbuchgrundbuch.at',
 'https://www.firmenbuchgrundbuch.at',
 NULL,
 ARRAY['all companies'],
 'Austrian commercial register managed by Ministry of Justice.'),

('AT-BMF', 'AT',
 'Bundesministerium für Finanzen',
 'Federal Ministry of Finance', 'BMF',
 'regulatory_authority',
 'https://www.bmf.gv.at/en.html',
 NULL,
 NULL,
 ARRAY['all taxpayers'],
 'National tax authority for Austria.'),

-- Healthcare Professionals
('AT-OAK', 'AT',
 'Österreichische Ärztekammer',
 'Austrian Medical Chamber', 'ÖÄK',
 'chamber',
 'https://www.aerztekammer.at/international_e',
 'https://www.aerztekammer.at/aerztesuche',
 NULL,
 ARRAY['medic'],
 'Mandatory membership for all Austrian doctors.'),

('AT-OZAK', 'AT',
 'Österreichische Zahnärztekammer',
 'Austrian Dental Chamber', 'ÖZAK',
 'chamber',
 'https://www.zahnaerztekammer.at/english',
 NULL,
 NULL,
 ARRAY['dentist'],
 'Mandatory membership for all Austrian dentists.'),

('AT-OAPO', 'AT',
 'Österreichische Apothekerkammer',
 'Austrian Pharmacy Chamber', NULL,
 'chamber',
 'https://www.apothekerkammer.at/',
 NULL,
 NULL,
 ARRAY['pharmacist'],
 'Mandatory membership for all Austrian pharmacists.'),

('AT-AGES', 'AT',
 'Agentur für Gesundheit und Ernährungssicherheit',
 'Austrian Agency for Health and Food Safety', 'AGES',
 'regulatory_authority',
 'https://www.ages.at/en/',
 NULL,
 NULL,
 ARRAY['veterinar','food safety'],
 'National authority for health, food safety and veterinary practice.'),

-- Other Professions
('AT-ZT', 'AT',
 'Bundeskammer der Ziviltechniker',
 'Federal Chamber of Architects and Engineering Consultants', 'Arch+Ing',
 'chamber',
 'https://bund.zt.at',
 NULL,
 NULL,
 ARRAY['architect','engineer'],
 'Mandatory membership for architects and engineering consultants.'),

('AT-OERAK', 'AT',
 'Österreichische Rechtsanwaltskammer',
 'Austrian Bar Association', 'ÖRAK',
 'bar',
 'https://www.oerak.at/en/',
 'https://www.oerak.at/rechtsanwaltssuche/',
 NULL,
 ARRAY['lawyer','advocate'],
 'Mandatory membership for all Austrian lawyers.'),

('AT-NOT', 'AT',
 'Österreichische Notariatskammer',
 'Austrian Notary Chamber', NULL,
 'chamber',
 NULL,
 NULL,
 NULL,
 ARRAY['notary'],
 'Mandatory membership for all Austrian notaries.'),

('AT-KSW', 'AT',
 'Kammer der Wirtschaftstreuhänder',
 'Chamber of Public Accountants and Tax Advisors', 'KSW',
 'chamber',
 NULL,
 NULL,
 NULL,
 ARRAY['auditor','accountant','tax advisor'],
 'Mandatory chamber for accountants, auditors and tax advisors. 7,865 members.'),

-- Health, Safety & Emergency
('AT-AI', 'AT',
 'Arbeitsinspektion',
 'Labour Inspectorate', 'AI',
 'regulatory_authority',
 'https://www.arbeitsinspektion.gv.at/Information_in_English/',
 NULL,
 NULL,
 ARRAY['occupational safety','labour inspection'],
 'National authority for occupational health and safety. Covers 3.4M workers.'),

('AT-OEBFV', 'AT',
 'Österreichischer Bundesfeuerwehrverband',
 'Austrian Fire Brigade Association', 'ÖBFV',
 'regulatory_authority',
 'https://www.bundesfeuerwehrverband.at/en/',
 NULL,
 NULL,
 ARRAY['fire safety'],
 'National fire brigade association and coordination body.'),

('AT-BMSGPK', 'AT',
 'Bundesministerium für Soziales, Gesundheit, Pflege und Konsumentenschutz',
 'Federal Ministry of Social Affairs, Health, Care and Consumer Protection', NULL,
 'ministry',
 'https://www.sozialministerium.gv.at/en.html',
 NULL,
 NULL,
 ARRAY['public health','social welfare'],
 'National health and social affairs ministry.')

ON CONFLICT (code) DO NOTHING;

-- ==================================================================
-- CZECH REPUBLIC (CZ) - Professional Bodies
-- ==================================================================

INSERT INTO professional_bodies (
  code, country_code, name_local, name_en, abbreviation,
  body_type, website_url, register_url, parent_body_code,
  professions_covered, notes
) VALUES
-- Business & Tax Authorities
('CZ-OR', 'CZ',
 'Obchodní rejstřík',
 'Commercial Register', 'OR',
 'register',
 'https://www.justice.cz',
 'https://or.justice.cz/ias/ui/rejstrik',
 NULL,
 ARRAY['all companies'],
 'Czech commercial register managed by Ministry of Justice.'),

('CZ-RZP', 'CZ',
 'Živnostenský rejstřík',
 'Trade Licensing Register', 'RZP',
 'register',
 'https://rzp.gov.cz/portal/en/',
 'https://rzp.gov.cz/portal/en/',
 NULL,
 ARRAY['sole traders','trade licenses'],
 'Trade licensing register for individual entrepreneurs.'),

('CZ-FS', 'CZ',
 'Finanční správa',
 'Financial Administration of the Czech Republic', 'FS',
 'regulatory_authority',
 'https://financnisprava.gov.cz/en/index',
 NULL,
 NULL,
 ARRAY['all taxpayers'],
 'National tax authority for Czech Republic.'),

-- Healthcare Professionals
('CZ-CLK', 'CZ',
 'Česká lékařská komora',
 'Czech Medical Chamber', 'ČLK',
 'chamber',
 'https://www.lkcr.cz/czech-medical-chamber-cmc',
 'https://www.lkcr.cz/vyhledavani-lekaru-505.html',
 NULL,
 ARRAY['medic'],
 'Mandatory membership for all 42,000 practicing Czech physicians.'),

('CZ-CSK', 'CZ',
 'Česká stomatologická komora',
 'Czech Dental Chamber', 'ČSK',
 'chamber',
 'https://www.dent.cz/',
 NULL,
 NULL,
 ARRAY['dentist'],
 'Mandatory membership for all Czech dentists. Founded 1991.'),

('CZ-CLnK', 'CZ',
 'Česká lékárnická komora',
 'Czech Chamber of Pharmacists', 'ČLnK',
 'chamber',
 'https://lekarnici.cz/en/',
 NULL,
 NULL,
 ARRAY['pharmacist'],
 'Mandatory membership for all Czech pharmacists. Act No. 220/1991.'),

('CZ-KVL', 'CZ',
 'Komora veterinárních lékařů České republiky',
 'Chamber of Veterinary Surgeons of Czech Republic', 'KVL',
 'chamber',
 'https://vetkom.cz/',
 NULL,
 NULL,
 ARRAY['veterinar'],
 'Mandatory membership for all Czech veterinarians. Founded 1991.'),

-- Other Professions
('CZ-CKA', 'CZ',
 'Česká komora architektů',
 'Czech Chamber of Architects', 'ČKA',
 'chamber',
 'https://en.cka.cz/',
 'https://www.cka.cz/cs/hledani-architektu',
 NULL,
 ARRAY['architect'],
 'Mandatory membership for practicing architects in Czech Republic.'),

('CZ-CAK', 'CZ',
 'Česká advokátní komora',
 'Czech Bar Association', 'ČAK',
 'bar',
 'https://www.cak.cz/en/',
 'https://vyhledavac.cak.cz/','
 NULL,
 ARRAY['lawyer','advocate'],
 'Mandatory membership for all Czech lawyers. Act No. 85/1996 Coll.'),

('CZ-NCK', 'CZ',
 'Notářská komora České republiky',
 'Notarial Chamber of the Czech Republic', 'NČR',
 'chamber',
 'https://www.nkcr.cz/en',
 'https://www.nkcr.cz/seznam-notaru',
 NULL,
 ARRAY['notary'],
 'Mandatory membership for all Czech notaries.'),

('CZ-KA', 'CZ',
 'Komora auditorů České republiky',
 'Chamber of Auditors of the Czech Republic', 'KAČR',
 'chamber',
 'https://www.kacr.cz/en/',
 NULL,
 NULL,
 ARRAY['auditor'],
 'Mandatory membership for all Czech auditors. Founded 1993.'),

('CZ-KU', 'CZ',
 'Komora certifikovaných účetních',
 'Czech Chamber of Certified Accountants', 'KCU',
 'chamber',
 'https://www.komora-ucetnich.cz/',
 NULL,
 NULL,
 ARRAY['accountant'],
 'Professional chamber for certified accountants.'),

-- Health, Safety & Emergency
('CZ-SUIP', 'CZ',
 'Státní úřad inspekce práce',
 'State Labour Inspection Office', 'SÚIP',
 'regulatory_authority',
 'https://www.suip.cz/web/en',
 NULL,
 NULL,
 ARRAY['occupational safety','labour inspection'],
 'National authority for occupational safety and health.'),

('CZ-HZS', 'CZ',
 'Hasičský záchranný sbor České republiky',
 'Fire Rescue Service of the Czech Republic', 'HZS ČR',
 'regulatory_authority',
 'https://hzscr.gov.cz/hasicien/fire-rescue-service-of-czech-republic.aspx',
 NULL,
 NULL,
 ARRAY['fire safety','rescue services'],
 'National fire and rescue service. 14 regional services.'),

('CZ-MZ', 'CZ',
 'Ministerstvo zdravotnictví',
 'Ministry of Health of the Czech Republic', 'MZ',
 'ministry',
 'https://www.mzcr.cz',
 NULL,
 NULL,
 ARRAY['public health'],
 'National health ministry and health authority.'),

('CZ-SZU', 'CZ',
 'Státní zdravotní ústav',
 'State Health Institute', 'SZÚ',
 'regulatory_authority',
 'https://ncez.mzcr.cz/en',
 NULL,
 'CZ-MZ',
 ARRAY['public health','hygiene'],
 'National public health institute under Ministry of Health.')

ON CONFLICT (code) DO NOTHING;

-- ==================================================================
-- JUNCTION TABLE: Legal Forms → Professional Bodies (DK)
-- ==================================================================

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes) VALUES
-- Commercial forms → Business Register + Tax
('DK-APS', 'DK-CVR', 'registration', true, 'All Danish companies must register in CVR'),
('DK-APS', 'DK-SKAT', 'supervision', true, 'Tax registration mandatory'),
('DK-APS', 'DK-AT', 'supervision', true, 'Subject to OSH regulations'),
('DK-AS', 'DK-CVR', 'registration', true, 'All Danish companies must register in CVR'),
('DK-AS', 'DK-SKAT', 'supervision', true, 'Tax registration mandatory'),
('DK-AS', 'DK-AT', 'supervision', true, 'Subject to OSH regulations'),
('DK-PS', 'DK-CVR', 'registration', true, 'All Danish companies must register in CVR'),
('DK-PS', 'DK-SKAT', 'supervision', true, 'Tax registration mandatory'),
('DK-PS', 'DK-AT', 'supervision', true, 'Subject to OSH regulations'),
('DK-IS', 'DK-CVR', 'registration', true, 'All Danish companies must register in CVR'),
('DK-IS', 'DK-SKAT', 'supervision', true, 'Tax registration mandatory'),
('DK-IS', 'DK-AT', 'supervision', true, 'Subject to OSH regulations'),
('DK-KS', 'DK-CVR', 'registration', true, 'All Danish companies must register in CVR'),
('DK-KS', 'DK-SKAT', 'supervision', true, 'Tax registration mandatory'),
('DK-KS', 'DK-AT', 'supervision', true, 'Subject to OSH regulations'),
('DK-SE', 'DK-CVR', 'registration', true, 'European company registration'),
('DK-SE', 'DK-SKAT', 'supervision', true, 'Tax registration mandatory'),
('DK-SE', 'DK-AT', 'supervision', true, 'Subject to OSH regulations'),
('DK-EEIG', 'DK-CVR', 'registration', true, 'EEIG registration in CVR'),
('DK-EEIG', 'DK-SKAT', 'supervision', true, 'Tax registration mandatory'),
('DK-FILIAL', 'DK-CVR', 'registration', true, 'Branch office registration'),
('DK-FILIAL', 'DK-SKAT', 'supervision', true, 'Tax registration mandatory'),
('DK-FILIAL', 'DK-AT', 'supervision', true, 'Subject to OSH regulations'),
('DK-EV', 'DK-CVR', 'registration', true, 'Sole proprietorship registration'),
('DK-EV', 'DK-SKAT', 'supervision', true, 'Tax registration mandatory'),
('DK-EV', 'DK-AT', 'supervision', true, 'Subject to OSH regulations'),
('DK-AMBA', 'DK-CVR', 'registration', true, 'Cooperative registration'),
('DK-AMBA', 'DK-SKAT', 'supervision', true, 'Tax registration mandatory'),
('DK-SOV', 'DK-CVR', 'registration', true, 'State-owned enterprise registration'),
('DK-SOV', 'DK-SKAT', 'supervision', true, 'Tax registration mandatory'),
('DK-SOV', 'DK-AT', 'supervision', true, 'Subject to OSH regulations'),

-- Non-profit forms
('DK-FORENING', 'DK-CVR', 'registration', false, 'Optional CVR registration for associations'),
('DK-FORENING', 'DK-SKAT', 'supervision', true, 'Tax reporting if economic activity'),
('DK-FOND', 'DK-CVR', 'registration', true, 'Foundations must register'),
('DK-FOND', 'DK-SKAT', 'supervision', true, 'Tax registration mandatory'),

-- Healthcare professionals
('DK-MED', 'DK-STPS', 'licensing', true, 'Medical license required'),
('DK-MED', 'DK-LAEGER', 'membership', false, 'Professional association membership optional'),
('DK-MED', 'DK-CVR', 'registration', true, 'Business registration required'),
('DK-MED', 'DK-SKAT', 'supervision', true, 'Tax registration mandatory'),
('DK-MED', 'DK-AT', 'supervision', true, 'Subject to OSH regulations'),
('DK-DENT', 'DK-STPS', 'licensing', true, 'Dental license required'),
('DK-DENT', 'DK-TAND', 'membership', false, 'Professional association membership optional'),
('DK-DENT', 'DK-CVR', 'registration', true, 'Business registration required'),
('DK-DENT', 'DK-SKAT', 'supervision', true, 'Tax registration mandatory'),
('DK-DENT', 'DK-AT', 'supervision', true, 'Subject to OSH regulations'),
('DK-PHARM', 'DK-STPS', 'licensing', true, 'Pharmacy license required'),
('DK-PHARM', 'DK-LMS', 'supervision', true, 'Medicines Agency supervision'),
('DK-PHARM', 'DK-APOT', 'membership', false, 'Association membership optional'),
('DK-PHARM', 'DK-CVR', 'registration', true, 'Business registration required'),
('DK-PHARM', 'DK-SKAT', 'supervision', true, 'Tax registration mandatory'),
('DK-PHARM', 'DK-AT', 'supervision', true, 'Subject to OSH regulations'),
('DK-NURSE', 'DK-STPS', 'licensing', true, 'Nursing authorization required'),
('DK-NURSE', 'DK-SKAT', 'supervision', true, 'Tax registration if self-employed'),
('DK-MID', 'DK-STPS', 'licensing', true, 'Midwife authorization required'),
('DK-MID', 'DK-SKAT', 'supervision', true, 'Tax registration if self-employed'),
('DK-VET', 'DK-STPS', 'licensing', true, 'Veterinary authorization required'),
('DK-VET', 'DK-FVST', 'supervision', true, 'FVST supervision required'),
('DK-VET', 'DK-DYR', 'membership', false, 'Association membership optional'),
('DK-VET', 'DK-CVR', 'registration', true, 'Business registration required'),
('DK-VET', 'DK-SKAT', 'supervision', true, 'Tax registration mandatory'),
('DK-VET', 'DK-AT', 'supervision', true, 'Subject to OSH regulations'),

-- Other regulated professions
('DK-ARK', 'DK-ARK', 'membership', false, 'Association membership optional'),
('DK-ARK', 'DK-CVR', 'registration', true, 'Business registration required'),
('DK-ARK', 'DK-SKAT', 'supervision', true, 'Tax registration mandatory'),
('DK-ADV', 'DK-ADV', 'membership', true, 'Bar membership mandatory'),
('DK-ADV', 'DK-CVR', 'registration', true, 'Business registration required'),
('DK-ADV', 'DK-SKAT', 'supervision', true, 'Tax registration mandatory'),
('DK-REVI', 'DK-FSR', 'membership', false, 'FSR membership optional but common'),
('DK-REVI', 'DK-CVR', 'registration', true, 'Business registration required'),
('DK-REVI', 'DK-SKAT', 'supervision', true, 'Tax registration mandatory')

ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- ==================================================================
-- JUNCTION TABLE: Legal Forms → Professional Bodies (FI)
-- ==================================================================

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes) VALUES
-- Commercial forms → Business Register + Tax
('FI-OY', 'FI-PRH', 'registration', true, 'Trade Register registration mandatory'),
('FI-OY', 'FI-VERO', 'supervision', true, 'Tax registration mandatory'),
('FI-OY', 'FI-TYOSUO', 'supervision', true, 'Subject to OSH regulations'),
('FI-OYJ', 'FI-PRH', 'registration', true, 'Trade Register registration mandatory'),
('FI-OYJ', 'FI-VERO', 'supervision', true, 'Tax registration mandatory'),
('FI-OYJ', 'FI-TYOSUO', 'supervision', true, 'Subject to OSH regulations'),
('FI-AY', 'FI-PRH', 'registration', true, 'Trade Register registration mandatory'),
('FI-AY', 'FI-VERO', 'supervision', true, 'Tax registration mandatory'),
('FI-AY', 'FI-TYOSUO', 'supervision', true, 'Subject to OSH regulations'),
('FI-KY', 'FI-PRH', 'registration', true, 'Trade Register registration mandatory'),
('FI-KY', 'FI-VERO', 'supervision', true, 'Tax registration mandatory'),
('FI-KY', 'FI-TYOSUO', 'supervision', true, 'Subject to OSH regulations'),
('FI-SE', 'FI-PRH', 'registration', true, 'European company registration'),
('FI-SE', 'FI-VERO', 'supervision', true, 'Tax registration mandatory'),
('FI-SE', 'FI-TYOSUO', 'supervision', true, 'Subject to OSH regulations'),
('FI-EEIG', 'FI-PRH', 'registration', true, 'EEIG registration in Trade Register'),
('FI-EEIG', 'FI-VERO', 'supervision', true, 'Tax registration mandatory'),
('FI-SIVU', 'FI-PRH', 'registration', true, 'Branch registration mandatory'),
('FI-SIVU', 'FI-VERO', 'supervision', true, 'Tax registration mandatory'),
('FI-SIVU', 'FI-TYOSUO', 'supervision', true, 'Subject to OSH regulations'),
('FI-TMI', 'FI-PRH', 'registration', true, 'Sole trader registration mandatory'),
('FI-TMI', 'FI-VERO', 'supervision', true, 'Tax registration mandatory'),
('FI-TMI', 'FI-TYOSUO', 'supervision', true, 'Subject to OSH regulations'),
('FI-OSK', 'FI-PRH', 'registration', true, 'Cooperative registration mandatory'),
('FI-OSK', 'FI-VERO', 'supervision', true, 'Tax registration mandatory'),
('FI-OSK', 'FI-TYOSUO', 'supervision', true, 'Subject to OSH regulations'),

-- Non-profit forms
('FI-YHD', 'FI-PRH', 'registration', true, 'Association registration mandatory'),
('FI-YHD', 'FI-VERO', 'supervision', true, 'Tax reporting if economic activity'),
('FI-SAATIO', 'FI-PRH', 'registration', true, 'Foundation registration mandatory'),
('FI-SAATIO', 'FI-VERO', 'supervision', true, 'Tax registration mandatory'),

-- Healthcare professionals
('FI-MED', 'FI-VALVIRA', 'licensing', true, 'Medical license required from Valvira'),
('FI-MED', 'FI-LAAK', 'membership', false, 'Association membership optional'),
('FI-MED', 'FI-PRH', 'registration', true, 'Business registration required'),
('FI-MED', 'FI-VERO', 'supervision', true, 'Tax registration mandatory'),
('FI-MED', 'FI-TYOSUO', 'supervision', true, 'Subject to OSH regulations'),
('FI-DENT', 'FI-VALVIRA', 'licensing', true, 'Dental license required from Valvira'),
('FI-DENT', 'FI-HAMMAS', 'membership', false, 'Association membership optional'),
('FI-DENT', 'FI-PRH', 'registration', true, 'Business registration required'),
('FI-DENT', 'FI-VERO', 'supervision', true, 'Tax registration mandatory'),
('FI-DENT', 'FI-TYOSUO', 'supervision', true, 'Subject to OSH regulations'),
('FI-PHARM', 'FI-VALVIRA', 'licensing', true, 'Pharmacy license required from Valvira'),
('FI-PHARM', 'FI-APTEEK', 'membership', false, 'Association membership optional'),
('FI-PHARM', 'FI-PRH', 'registration', true, 'Business registration required'),
('FI-PHARM', 'FI-VERO', 'supervision', true, 'Tax registration mandatory'),
('FI-PHARM', 'FI-TYOSUO', 'supervision', true, 'Subject to OSH regulations'),
('FI-NURSE', 'FI-VALVIRA', 'licensing', true, 'Nursing license required from Valvira'),
('FI-NURSE', 'FI-VERO', 'supervision', true, 'Tax registration if self-employed'),
('FI-MID', 'FI-VALVIRA', 'licensing', true, 'Midwife license required from Valvira'),
('FI-MID', 'FI-VERO', 'supervision', true, 'Tax registration if self-employed'),
('FI-VET', 'FI-VALVIRA', 'licensing', true, 'Veterinary license required from Valvira'),
('FI-VET', 'FI-ELAIN', 'membership', false, 'Association membership optional'),
('FI-VET', 'FI-PRH', 'registration', true, 'Business registration required'),
('FI-VET', 'FI-VERO', 'supervision', true, 'Tax registration mandatory'),
('FI-VET', 'FI-TYOSUO', 'supervision', true, 'Subject to OSH regulations'),

-- Other regulated professions
('FI-ARK', 'FI-SAFA', 'membership', false, 'SAFA membership optional'),
('FI-ARK', 'FI-PRH', 'registration', true, 'Business registration required'),
('FI-ARK', 'FI-VERO', 'supervision', true, 'Tax registration mandatory'),
('FI-ASIAN', 'FI-ASIAN', 'membership', true, 'Bar membership mandatory for advocates'),
('FI-ASIAN', 'FI-PRH', 'registration', true, 'Business registration required'),
('FI-ASIAN', 'FI-VERO', 'supervision', true, 'Tax registration mandatory'),
('FI-REVI', 'FI-TILINT', 'membership', false, 'Association membership optional'),
('FI-REVI', 'FI-PRH', 'registration', true, 'Business registration required'),
('FI-REVI', 'FI-VERO', 'supervision', true, 'Tax registration mandatory')

ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- ==================================================================
-- JUNCTION TABLE: Legal Forms → Professional Bodies (NO)
-- ==================================================================

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes) VALUES
-- Commercial forms → Business Register + Tax
('NO-AS', 'NO-BRREG', 'registration', true, 'Business Register registration mandatory'),
('NO-AS', 'NO-SKATT', 'supervision', true, 'Tax registration mandatory'),
('NO-AS', 'NO-ARBEID', 'supervision', true, 'Subject to OSH regulations'),
('NO-ASA', 'NO-BRREG', 'registration', true, 'Business Register registration mandatory'),
('NO-ASA', 'NO-SKATT', 'supervision', true, 'Tax registration mandatory'),
('NO-ASA', 'NO-ARBEID', 'supervision', true, 'Subject to OSH regulations'),
('NO-ANS', 'NO-BRREG', 'registration', true, 'Business Register registration mandatory'),
('NO-ANS', 'NO-SKATT', 'supervision', true, 'Tax registration mandatory'),
('NO-ANS', 'NO-ARBEID', 'supervision', true, 'Subject to OSH regulations'),
('NO-DA', 'NO-BRREG', 'registration', true, 'Business Register registration mandatory'),
('NO-DA', 'NO-SKATT', 'supervision', true, 'Tax registration mandatory'),
('NO-DA', 'NO-ARBEID', 'supervision', true, 'Subject to OSH regulations'),
('NO-SE', 'NO-BRREG', 'registration', true, 'European company registration'),
('NO-SE', 'NO-SKATT', 'supervision', true, 'Tax registration mandatory'),
('NO-SE', 'NO-ARBEID', 'supervision', true, 'Subject to OSH regulations'),
('NO-EOFG', 'NO-BRREG', 'registration', true, 'EEIG registration mandatory'),
('NO-EOFG', 'NO-SKATT', 'supervision', true, 'Tax registration mandatory'),
('NO-NUF', 'NO-BRREG', 'registration', true, 'NUF registration mandatory'),
('NO-NUF', 'NO-SKATT', 'supervision', true, 'Tax registration mandatory'),
('NO-NUF', 'NO-ARBEID', 'supervision', true, 'Subject to OSH regulations'),
('NO-FILIAL', 'NO-BRREG', 'registration', true, 'Branch registration mandatory'),
('NO-FILIAL', 'NO-SKATT', 'supervision', true, 'Tax registration mandatory'),
('NO-FILIAL', 'NO-ARBEID', 'supervision', true, 'Subject to OSH regulations'),
('NO-ENK', 'NO-BRREG', 'registration', true, 'Sole proprietorship registration mandatory'),
('NO-ENK', 'NO-SKATT', 'supervision', true, 'Tax registration mandatory'),
('NO-ENK', 'NO-ARBEID', 'supervision', true, 'Subject to OSH regulations'),
('NO-SA', 'NO-BRREG', 'registration', true, 'Cooperative registration mandatory'),
('NO-SA', 'NO-SKATT', 'supervision', true, 'Tax registration mandatory'),
('NO-SA', 'NO-ARBEID', 'supervision', true, 'Subject to OSH regulations'),
('NO-BRL', 'NO-BRREG', 'registration', true, 'Limited partnership with shares registration'),
('NO-BRL', 'NO-SKATT', 'supervision', true, 'Tax registration mandatory'),
('NO-BRL', 'NO-ARBEID', 'supervision', true, 'Subject to OSH regulations'),

-- Non-profit forms
('NO-FOR', 'NO-BRREG', 'registration', false, 'Optional registration for associations'),
('NO-FOR', 'NO-SKATT', 'supervision', true, 'Tax reporting if economic activity'),
('NO-STI', 'NO-BRREG', 'registration', true, 'Foundation registration mandatory'),
('NO-STI', 'NO-SKATT', 'supervision', true, 'Tax registration mandatory'),

-- Healthcare professionals
('NO-MED', 'NO-HDIR', 'licensing', true, 'Medical license required from Health Directorate'),
('NO-MED', 'NO-LEGE', 'membership', false, 'Association membership optional'),
('NO-MED', 'NO-BRREG', 'registration', true, 'Business registration required'),
('NO-MED', 'NO-SKATT', 'supervision', true, 'Tax registration mandatory'),
('NO-MED', 'NO-ARBEID', 'supervision', true, 'Subject to OSH regulations'),
('NO-DENT', 'NO-HDIR', 'licensing', true, 'Dental license required from Health Directorate'),
('NO-DENT', 'NO-TANN', 'membership', false, 'Association membership optional'),
('NO-DENT', 'NO-BRREG', 'registration', true, 'Business registration required'),
('NO-DENT', 'NO-SKATT', 'supervision', true, 'Tax registration mandatory'),
('NO-DENT', 'NO-ARBEID', 'supervision', true, 'Subject to OSH regulations'),
('NO-PHARM', 'NO-HDIR', 'licensing', true, 'Pharmacy license required from Health Directorate'),
('NO-PHARM', 'NO-FARM', 'membership', false, 'Association membership optional'),
('NO-PHARM', 'NO-BRREG', 'registration', true, 'Business registration required'),
('NO-PHARM', 'NO-SKATT', 'supervision', true, 'Tax registration mandatory'),
('NO-PHARM', 'NO-ARBEID', 'supervision', true, 'Subject to OSH regulations'),
('NO-NURSE', 'NO-HDIR', 'licensing', true, 'Nursing license required from Health Directorate'),
('NO-NURSE', 'NO-SKATT', 'supervision', true, 'Tax registration if self-employed'),
('NO-MID', 'NO-HDIR', 'licensing', true, 'Midwife license required from Health Directorate'),
('NO-MID', 'NO-SKATT', 'supervision', true, 'Tax registration if self-employed'),
('NO-VET', 'NO-HDIR', 'licensing', true, 'Veterinary license required from Health Directorate'),
('NO-VET', 'NO-VET', 'membership', false, 'Association membership optional'),
('NO-VET', 'NO-BRREG', 'registration', true, 'Business registration required'),
('NO-VET', 'NO-SKATT', 'supervision', true, 'Tax registration mandatory'),
('NO-VET', 'NO-ARBEID', 'supervision', true, 'Subject to OSH regulations'),

-- Other regulated professions
('NO-ARK', 'NO-NAL', 'membership', false, 'NAL membership optional'),
('NO-ARK', 'NO-BRREG', 'registration', true, 'Business registration required'),
('NO-ARK', 'NO-SKATT', 'supervision', true, 'Tax registration mandatory'),
('NO-ADV', 'NO-ADVFOR', 'membership', true, 'Bar membership mandatory for advocates'),
('NO-ADV', 'NO-BRREG', 'registration', true, 'Business registration required'),
('NO-ADV', 'NO-SKATT', 'supervision', true, 'Tax registration mandatory'),
('NO-REVI', 'NO-NRRF', 'membership', false, 'Association membership optional'),
('NO-REVI', 'NO-BRREG', 'registration', true, 'Business registration required'),
('NO-REVI', 'NO-SKATT', 'supervision', true, 'Tax registration mandatory')

ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- ==================================================================
-- JUNCTION TABLE: Legal Forms → Professional Bodies (IS)
-- ==================================================================

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes) VALUES
-- Commercial forms → Business Register + Tax
('IS-EHF', 'IS-RSK', 'registration', true, 'Business registration mandatory'),
('IS-EHF', 'IS-SKATT', 'supervision', true, 'Tax registration mandatory'),
('IS-EHF', 'IS-VINN', 'supervision', true, 'Subject to OSH regulations'),
('IS-HF', 'IS-RSK', 'registration', true, 'Business registration mandatory'),
('IS-HF', 'IS-SKATT', 'supervision', true, 'Tax registration mandatory'),
('IS-HF', 'IS-VINN', 'supervision', true, 'Subject to OSH regulations'),
('IS-SE', 'IS-RSK', 'registration', true, 'European company registration'),
('IS-SE', 'IS-SKATT', 'supervision', true, 'Tax registration mandatory'),
('IS-SE', 'IS-VINN', 'supervision', true, 'Subject to OSH regulations'),
('IS-EEIG', 'IS-RSK', 'registration', true, 'EEIG registration mandatory'),
('IS-EEIG', 'IS-SKATT', 'supervision', true, 'Tax registration mandatory'),
('IS-FILIAL', 'IS-RSK', 'registration', true, 'Branch registration mandatory'),
('IS-FILIAL', 'IS-SKATT', 'supervision', true, 'Tax registration mandatory'),
('IS-FILIAL', 'IS-VINN', 'supervision', true, 'Subject to OSH regulations'),
('IS-EINST', 'IS-RSK', 'registration', true, 'Sole trader registration mandatory'),
('IS-EINST', 'IS-SKATT', 'supervision', true, 'Tax registration mandatory'),
('IS-EINST', 'IS-VINN', 'supervision', true, 'Subject to OSH regulations'),
('IS-SAMV', 'IS-RSK', 'registration', true, 'Cooperative registration mandatory'),
('IS-SAMV', 'IS-SKATT', 'supervision', true, 'Tax registration mandatory'),
('IS-SAMV', 'IS-VINN', 'supervision', true, 'Subject to OSH regulations'),

-- Non-profit forms
('IS-FELAG', 'IS-RSK', 'registration', false, 'Optional registration for associations'),
('IS-FELAG', 'IS-SKATT', 'supervision', true, 'Tax reporting if economic activity'),
('IS-SJODUR', 'IS-RSK', 'registration', true, 'Foundation registration mandatory'),
('IS-SJODUR', 'IS-SKATT', 'supervision', true, 'Tax registration mandatory'),

-- Healthcare professionals
('IS-MED', 'IS-LANDLK', 'licensing', true, 'Medical license required from Directorate of Health'),
('IS-MED', 'IS-RSK', 'registration', true, 'Business registration required'),
('IS-MED', 'IS-SKATT', 'supervision', true, 'Tax registration mandatory'),
('IS-MED', 'IS-VINN', 'supervision', true, 'Subject to OSH regulations'),
('IS-DENT', 'IS-LANDLK', 'licensing', true, 'Dental license required from Directorate of Health'),
('IS-DENT', 'IS-RSK', 'registration', true, 'Business registration required'),
('IS-DENT', 'IS-SKATT', 'supervision', true, 'Tax registration mandatory'),
('IS-DENT', 'IS-VINN', 'supervision', true, 'Subject to OSH regulations'),
('IS-PHARM', 'IS-LANDLK', 'licensing', true, 'Pharmacy license required from Directorate of Health'),
('IS-PHARM', 'IS-RSK', 'registration', true, 'Business registration required'),
('IS-PHARM', 'IS-SKATT', 'supervision', true, 'Tax registration mandatory'),
('IS-PHARM', 'IS-VINN', 'supervision', true, 'Subject to OSH regulations'),
('IS-NURSE', 'IS-LANDLK', 'licensing', true, 'Nursing license required from Directorate of Health'),
('IS-NURSE', 'IS-SKATT', 'supervision', true, 'Tax registration if self-employed'),
('IS-MID', 'IS-LANDLK', 'licensing', true, 'Midwife license required from Directorate of Health'),
('IS-MID', 'IS-SKATT', 'supervision', true, 'Tax registration if self-employed'),
('IS-VET', 'IS-LANDLK', 'licensing', true, 'Veterinary practice regulated by Directorate of Health'),
('IS-VET', 'IS-MAST', 'licensing', true, 'Veterinary license from MAST'),
('IS-VET', 'IS-RSK', 'registration', true, 'Business registration required'),
('IS-VET', 'IS-SKATT', 'supervision', true, 'Tax registration mandatory'),
('IS-VET', 'IS-VINN', 'supervision', true, 'Subject to OSH regulations'),

-- Other regulated professions
('IS-ARK', 'IS-ARK', 'membership', false, 'Association membership optional'),
('IS-ARK', 'IS-RSK', 'registration', true, 'Business registration required'),
('IS-ARK', 'IS-SKATT', 'supervision', true, 'Tax registration mandatory'),
('IS-LOGM', 'IS-LMFI', 'membership', true, 'Bar membership mandatory for lawyers'),
('IS-LOGM', 'IS-RSK', 'registration', true, 'Business registration required'),
('IS-LOGM', 'IS-SKATT', 'supervision', true, 'Tax registration mandatory'),
('IS-ENDUR', 'IS-FLE', 'membership', false, 'Association membership optional'),
('IS-ENDUR', 'IS-RSK', 'registration', true, 'Business registration required'),
('IS-ENDUR', 'IS-SKATT', 'supervision', true, 'Tax registration mandatory')

ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- ==================================================================
-- JUNCTION TABLE: Legal Forms → Professional Bodies (AT)
-- ==================================================================

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes) VALUES
-- Commercial forms → Business Register + Tax
('AT-GMBH', 'AT-FB', 'registration', true, 'Firmenbuch registration mandatory'),
('AT-GMBH', 'AT-BMF', 'supervision', true, 'Tax registration mandatory'),
('AT-GMBH', 'AT-AI', 'supervision', true, 'Subject to OSH regulations'),
('AT-AG', 'AT-FB', 'registration', true, 'Firmenbuch registration mandatory'),
('AT-AG', 'AT-BMF', 'supervision', true, 'Tax registration mandatory'),
('AT-AG', 'AT-AI', 'supervision', true, 'Subject to OSH regulations'),
('AT-OG', 'AT-FB', 'registration', true, 'Firmenbuch registration mandatory'),
('AT-OG', 'AT-BMF', 'supervision', true, 'Tax registration mandatory'),
('AT-OG', 'AT-AI', 'supervision', true, 'Subject to OSH regulations'),
('AT-KG', 'AT-FB', 'registration', true, 'Firmenbuch registration mandatory'),
('AT-KG', 'AT-BMF', 'supervision', true, 'Tax registration mandatory'),
('AT-KG', 'AT-AI', 'supervision', true, 'Subject to OSH regulations'),
('AT-SE', 'AT-FB', 'registration', true, 'European company registration'),
('AT-SE', 'AT-BMF', 'supervision', true, 'Tax registration mandatory'),
('AT-SE', 'AT-AI', 'supervision', true, 'Subject to OSH regulations'),
('AT-SUCC', 'AT-FB', 'registration', true, 'Branch registration mandatory'),
('AT-SUCC', 'AT-BMF', 'supervision', true, 'Tax registration mandatory'),
('AT-SUCC', 'AT-AI', 'supervision', true, 'Subject to OSH regulations'),
('AT-EU', 'AT-FB', 'registration', true, 'Sole trader registration mandatory'),
('AT-EU', 'AT-BMF', 'supervision', true, 'Tax registration mandatory'),
('AT-EU', 'AT-AI', 'supervision', true, 'Subject to OSH regulations'),
('AT-GENO', 'AT-FB', 'registration', true, 'Cooperative registration mandatory'),
('AT-GENO', 'AT-BMF', 'supervision', true, 'Tax registration mandatory'),
('AT-GENO', 'AT-AI', 'supervision', true, 'Subject to OSH regulations'),

-- Non-profit forms
('AT-VEREIN', 'AT-BMF', 'supervision', true, 'Tax reporting if economic activity'),
('AT-PSG', 'AT-BMF', 'supervision', true, 'Tax registration mandatory'),

-- Healthcare professionals
('AT-ARZT', 'AT-OAK', 'membership', true, 'Medical chamber membership mandatory'),
('AT-ARZT', 'AT-FB', 'registration', true, 'Business registration required if practice'),
('AT-ARZT', 'AT-BMF', 'supervision', true, 'Tax registration mandatory'),
('AT-ARZT', 'AT-AI', 'supervision', true, 'Subject to OSH regulations'),
('AT-ZAHN', 'AT-OZAK', 'membership', true, 'Dental chamber membership mandatory'),
('AT-ZAHN', 'AT-FB', 'registration', true, 'Business registration required'),
('AT-ZAHN', 'AT-BMF', 'supervision', true, 'Tax registration mandatory'),
('AT-ZAHN', 'AT-AI', 'supervision', true, 'Subject to OSH regulations'),
('AT-APOTH', 'AT-OAPO', 'membership', true, 'Pharmacy chamber membership mandatory'),
('AT-APOTH', 'AT-FB', 'registration', true, 'Business registration required'),
('AT-APOTH', 'AT-BMF', 'supervision', true, 'Tax registration mandatory'),
('AT-APOTH', 'AT-AI', 'supervision', true, 'Subject to OSH regulations'),
('AT-PFLEGE', 'AT-BMSGPK', 'supervision', true, 'Health ministry supervision'),
('AT-PFLEGE', 'AT-BMF', 'supervision', true, 'Tax registration if self-employed'),
('AT-HEB', 'AT-BMSGPK', 'supervision', true, 'Health ministry supervision'),
('AT-HEB', 'AT-BMF', 'supervision', true, 'Tax registration if self-employed'),
('AT-TIER', 'AT-AGES', 'licensing', true, 'AGES supervision for veterinary practice'),
('AT-TIER', 'AT-FB', 'registration', true, 'Business registration required'),
('AT-TIER', 'AT-BMF', 'supervision', true, 'Tax registration mandatory'),
('AT-TIER', 'AT-AI', 'supervision', true, 'Subject to OSH regulations'),

-- Other regulated professions
('AT-ARCH', 'AT-ZT', 'membership', true, 'Architects chamber membership mandatory'),
('AT-ARCH', 'AT-FB', 'registration', true, 'Business registration required'),
('AT-ARCH', 'AT-BMF', 'supervision', true, 'Tax registration mandatory'),
('AT-RA', 'AT-OERAK', 'membership', true, 'Bar membership mandatory'),
('AT-RA', 'AT-FB', 'registration', true, 'Business registration required'),
('AT-RA', 'AT-BMF', 'supervision', true, 'Tax registration mandatory'),
('AT-NOT', 'AT-NOT', 'membership', true, 'Notary chamber membership mandatory'),
('AT-NOT', 'AT-BMF', 'supervision', true, 'Tax registration mandatory'),
('AT-STB', 'AT-KSW', 'membership', true, 'KSW chamber membership mandatory'),
('AT-STB', 'AT-FB', 'registration', true, 'Business registration required'),
('AT-STB', 'AT-BMF', 'supervision', true, 'Tax registration mandatory'),
('AT-WP', 'AT-KSW', 'membership', true, 'KSW chamber membership mandatory'),
('AT-WP', 'AT-FB', 'registration', true, 'Business registration required'),
('AT-WP', 'AT-BMF', 'supervision', true, 'Tax registration mandatory')

ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- ==================================================================
-- JUNCTION TABLE: Legal Forms → Professional Bodies (CZ)
-- ==================================================================

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes) VALUES
-- Commercial forms → Business Register + Tax
('CZ-SRO', 'CZ-OR', 'registration', true, 'Commercial Register registration mandatory'),
('CZ-SRO', 'CZ-FS', 'supervision', true, 'Tax registration mandatory'),
('CZ-SRO', 'CZ-SUIP', 'supervision', true, 'Subject to OSH regulations'),
('CZ-AS', 'CZ-OR', 'registration', true, 'Commercial Register registration mandatory'),
('CZ-AS', 'CZ-FS', 'supervision', true, 'Tax registration mandatory'),
('CZ-AS', 'CZ-SUIP', 'supervision', true, 'Subject to OSH regulations'),
('CZ-VOS', 'CZ-OR', 'registration', true, 'Commercial Register registration mandatory'),
('CZ-VOS', 'CZ-FS', 'supervision', true, 'Tax registration mandatory'),
('CZ-VOS', 'CZ-SUIP', 'supervision', true, 'Subject to OSH regulations'),
('CZ-KS', 'CZ-OR', 'registration', true, 'Commercial Register registration mandatory'),
('CZ-KS', 'CZ-FS', 'supervision', true, 'Tax registration mandatory'),
('CZ-KS', 'CZ-SUIP', 'supervision', true, 'Subject to OSH regulations'),
('CZ-DRUZ', 'CZ-OR', 'registration', true, 'Cooperative registration mandatory'),
('CZ-DRUZ', 'CZ-FS', 'supervision', true, 'Tax registration mandatory'),
('CZ-DRUZ', 'CZ-SUIP', 'supervision', true, 'Subject to OSH regulations'),
('CZ-SE', 'CZ-OR', 'registration', true, 'European company registration'),
('CZ-SE', 'CZ-FS', 'supervision', true, 'Tax registration mandatory'),
('CZ-SE', 'CZ-SUIP', 'supervision', true, 'Subject to OSH regulations'),
('CZ-SUCC', 'CZ-OR', 'registration', true, 'Branch registration mandatory'),
('CZ-SUCC', 'CZ-FS', 'supervision', true, 'Tax registration mandatory'),
('CZ-SUCC', 'CZ-SUIP', 'supervision', true, 'Subject to OSH regulations'),
('CZ-OSVC', 'CZ-RZP', 'registration', true, 'Trade license registration mandatory'),
('CZ-OSVC', 'CZ-FS', 'supervision', true, 'Tax registration mandatory'),
('CZ-OSVC', 'CZ-SUIP', 'supervision', true, 'Subject to OSH regulations'),

-- Non-profit and public forms
('CZ-SPOLEK', 'CZ-FS', 'supervision', true, 'Tax reporting if economic activity'),
('CZ-NADACE', 'CZ-OR', 'registration', true, 'Foundation registration mandatory'),
('CZ-NADACE', 'CZ-FS', 'supervision', true, 'Tax registration mandatory'),
('CZ-USTRAV', 'CZ-OR', 'registration', true, 'State institution registration'),
('CZ-USTRAV', 'CZ-FS', 'supervision', true, 'Tax registration mandatory'),
('CZ-OBEC', 'CZ-FS', 'supervision', true, 'Tax reporting mandatory'),
('CZ-PO', 'CZ-FS', 'supervision', true, 'Tax registration mandatory'),

-- Healthcare professionals
('CZ-LEKAR', 'CZ-CLK', 'membership', true, 'Medical chamber membership mandatory'),
('CZ-LEKAR', 'CZ-RZP', 'registration', true, 'Trade license required for private practice'),
('CZ-LEKAR', 'CZ-FS', 'supervision', true, 'Tax registration mandatory'),
('CZ-LEKAR', 'CZ-SUIP', 'supervision', true, 'Subject to OSH regulations'),
('CZ-ZUB', 'CZ-CSK', 'membership', true, 'Dental chamber membership mandatory'),
('CZ-ZUB', 'CZ-RZP', 'registration', true, 'Trade license required for private practice'),
('CZ-ZUB', 'CZ-FS', 'supervision', true, 'Tax registration mandatory'),
('CZ-ZUB', 'CZ-SUIP', 'supervision', true, 'Subject to OSH regulations'),
('CZ-LEKARNIK', 'CZ-CLnK', 'membership', true, 'Pharmacy chamber membership mandatory'),
('CZ-LEKARNIK', 'CZ-RZP', 'registration', true, 'Trade license required'),
('CZ-LEKARNIK', 'CZ-FS', 'supervision', true, 'Tax registration mandatory'),
('CZ-LEKARNIK', 'CZ-SUIP', 'supervision', true, 'Subject to OSH regulations'),
('CZ-SESTRA', 'CZ-MZ', 'supervision', true, 'Health ministry supervision'),
('CZ-SESTRA', 'CZ-FS', 'supervision', true, 'Tax registration if self-employed'),
('CZ-VET', 'CZ-KVL', 'membership', true, 'Veterinary chamber membership mandatory'),
('CZ-VET', 'CZ-RZP', 'registration', true, 'Trade license required'),
('CZ-VET', 'CZ-FS', 'supervision', true, 'Tax registration mandatory'),
('CZ-VET', 'CZ-SUIP', 'supervision', true, 'Subject to OSH regulations'),

-- Other regulated professions
('CZ-ARCH', 'CZ-CKA', 'membership', true, 'Architects chamber membership mandatory'),
('CZ-ARCH', 'CZ-RZP', 'registration', true, 'Trade license required'),
('CZ-ARCH', 'CZ-FS', 'supervision', true, 'Tax registration mandatory'),
('CZ-ADVOKAT', 'CZ-CAK', 'membership', true, 'Bar membership mandatory'),
('CZ-ADVOKAT', 'CZ-FS', 'supervision', true, 'Tax registration mandatory'),
('CZ-NOTAR', 'CZ-NCK', 'membership', true, 'Notary chamber membership mandatory'),
('CZ-NOTAR', 'CZ-FS', 'supervision', true, 'Tax registration mandatory'),
('CZ-AUDITOR', 'CZ-KA', 'membership', true, 'Auditors chamber membership mandatory'),
('CZ-AUDITOR', 'CZ-RZP', 'registration', true, 'Trade license required'),
('CZ-AUDITOR', 'CZ-FS', 'supervision', true, 'Tax registration mandatory'),
('CZ-DANPOR', 'CZ-KU', 'membership', false, 'Accountants chamber membership optional'),
('CZ-DANPOR', 'CZ-RZP', 'registration', true, 'Trade license required'),
('CZ-DANPOR', 'CZ-FS', 'supervision', true, 'Tax registration mandatory')

ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- ==================================================================
-- VERIFICATION QUERIES
-- ==================================================================

-- Count professional bodies per country
SELECT country_code, COUNT(*) as bodies
FROM professional_bodies
WHERE country_code IN ('DK','FI','NO','IS','AT','CZ')
GROUP BY country_code
ORDER BY country_code;

-- Count junction relationships per country
SELECT pb.country_code, COUNT(*) as junctions
FROM legal_form_bodies lfb
JOIN professional_bodies pb ON pb.code = lfb.body_code
WHERE pb.country_code IN ('DK','FI','NO','IS','AT','CZ')
GROUP BY pb.country_code
ORDER BY pb.country_code;

-- ==================================================================
-- END OF FILE
-- ==================================================================
