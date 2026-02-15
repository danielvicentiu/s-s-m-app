-- =====================================================================================
-- B3: Professional Bodies and Junctions for SK, SI, HR, GR, CY, RS
-- Generated: 2026-02-15
-- Agent: claude-sonnet-4-5
-- Purpose: Insert professional bodies and legal_form_bodies junctions for 6 countries
-- =====================================================================================

-- =====================================================================================
-- PART 1: PROFESSIONAL BODIES
-- =====================================================================================

-- -------------------------------------------------------------------------------------
-- SLOVAKIA (SK) — 18 bodies
-- -------------------------------------------------------------------------------------

INSERT INTO professional_bodies (code, country_code, name_local, name_en, abbreviation, body_type, website_url, register_url, professions_covered, notes) VALUES
('SK-OBCHREG', 'SK', 'Obchodný register', 'Commercial Register', 'OR SR', 'register', 'https://www.orsr.sk', 'https://www.orsr.sk', '{"all_commercial_entities"}', 'Central commercial register managed by district courts'),
('SK-DANUR', 'SK', 'Daňový úrad', 'Tax Office', 'DÚ', 'regulatory_authority', 'https://www.financnasprava.sk', NULL, '{"all_taxable_entities"}', 'Financial Administration - tax registration and supervision'),
('SK-NIP', 'SK', 'Národný inšpektorát práce', 'National Labour Inspectorate', 'NIP', 'inspectorate', 'https://www.ip.gov.sk', NULL, '{"occupational_safety"}', 'Labour inspection including OSH compliance'),
('SK-HZS', 'SK', 'Hasičský a záchranný zbor', 'Fire and Rescue Corps', 'HaZZ', 'inspectorate', 'https://www.minv.sk/hazz', NULL, '{"fire_safety"}', 'Fire safety inspections and emergency response'),
('SK-SLK', 'SK', 'Slovenská lekárska komora', 'Slovak Medical Chamber', 'SLK', 'chamber', 'https://www.lekom.sk', 'https://www.lekom.sk/registre', '{"physicians"}', 'Mandatory membership for physicians'),
('SK-SKZL', 'SK', 'Slovenská komora zubných lekárov', 'Slovak Chamber of Dentists', 'SK ZL', 'chamber', 'https://www.skzl.sk', 'https://www.skzl.sk/clenovia', '{"dentists"}', 'Mandatory membership for dentists'),
('SK-SLEKAR', 'SK', 'Slovenská lekárnická komora', 'Slovak Pharmaceutical Chamber', 'SLeK', 'chamber', 'https://www.slk.sk', 'https://www.slk.sk/register', '{"pharmacists"}', 'Mandatory membership for pharmacists'),
('SK-SKSAPA', 'SK', 'Slovenská komora sestier a pôrodných asistentiek', 'Slovak Chamber of Nurses and Midwives', 'SK SaPA', 'chamber', 'https://www.sksapa.sk', 'https://www.sksapa.sk/register', '{"nurses","midwives"}', 'Mandatory membership for nurses and midwives'),
('SK-SKVL', 'SK', 'Slovenská komora veterinárnych lekárov', 'Slovak Chamber of Veterinarians', 'SKVL', 'chamber', 'https://www.skvl.sk', 'https://www.skvl.sk/clenovia', '{"veterinarians"}', 'Mandatory membership for veterinarians'),
('SK-SAK', 'SK', 'Slovenská advokátska komora', 'Slovak Bar Association', 'SAK', 'bar', 'https://www.sak.sk', 'https://www.sak.sk/zoznam-advokatov', '{"lawyers"}', 'Mandatory membership for advocates'),
('SK-NK', 'SK', 'Notárska komora Slovenskej republiky', 'Notarial Chamber of the Slovak Republic', 'NK SR', 'chamber', 'https://www.notar.sk', 'https://www.notar.sk/zoznam-notarov', '{"notaries"}', 'Mandatory membership for notaries'),
('SK-SKE', 'SK', 'Slovenská komora exekútorov', 'Slovak Chamber of Executors', 'SKE', 'chamber', 'https://www.ske.sk', 'https://www.ske.sk/zoznam', '{"executors"}', 'Mandatory membership for judicial executors'),
('SK-KAS', 'SK', 'Komora audítorov Slovenska', 'Chamber of Auditors of Slovakia', 'KAS', 'chamber', 'https://www.udva.sk', 'https://www.udva.sk/zoznamy', '{"auditors"}', 'Statutory audit oversight and licensing'),
('SK-SKDP', 'SK', 'Slovenská komora daňových poradcov', 'Slovak Chamber of Tax Advisors', 'SKDP', 'chamber', 'https://www.skdp.sk', 'https://www.skdp.sk/zoznam', '{"tax_advisors"}', 'Mandatory membership for tax advisors'),
('SK-SKA', 'SK', 'Slovenská komora architektov', 'Slovak Chamber of Architects', 'SKA', 'chamber', 'https://www.komarch.sk', 'https://www.komarch.sk/register', '{"architects"}', 'Mandatory membership for architects'),
('SK-SKGK', 'SK', 'Slovenská komora geodetov a kartografov', 'Slovak Chamber of Surveyors and Cartographers', 'SKGK', 'chamber', 'https://www.skgk.sk', 'https://www.skgk.sk/clenovia', '{"surveyors","cartographers"}', 'Mandatory membership for licensed surveyors'),
('SK-SKTP', 'SK', 'Slovenská komora tlmočníkov a prekladateľov', 'Slovak Chamber of Interpreters and Translators', 'SKTP', 'chamber', 'https://www.sktp.sk', 'https://www.sktp.sk/zoznam', '{"interpreters","translators"}', 'Court-appointed interpreters and translators'),
('SK-KZ', 'SK', 'Register znalcov, tlmočníkov a prekladateľov', 'Register of Experts, Interpreters and Translators', 'KZ', 'register', 'https://www.justice.gov.sk', 'https://www.justice.gov.sk/Stranky/Registre/Zoznam-znalcov.aspx', '{"court_experts"}', 'Ministry of Justice register of court experts')
ON CONFLICT (code) DO NOTHING;

-- -------------------------------------------------------------------------------------
-- SLOVENIA (SI) — 18 bodies
-- -------------------------------------------------------------------------------------

INSERT INTO professional_bodies (code, country_code, name_local, name_en, abbreviation, body_type, website_url, register_url, professions_covered, notes) VALUES
('SI-AJPES', 'SI', 'Agencija Republike Slovenije za javnopravne evidence in storitve', 'Agency of the Republic of Slovenia for Public Legal Records and Related Services', 'AJPES', 'agency', 'https://www.ajpes.si', 'https://www.ajpes.si/prs', '{"all_commercial_entities"}', 'Business register and statistical data'),
('SI-FURS', 'SI', 'Finančna uprava Republike Slovenije', 'Financial Administration of the Republic of Slovenia', 'FURS', 'regulatory_authority', 'https://www.fu.gov.si', NULL, '{"all_taxable_entities"}', 'Tax administration and enforcement'),
('SI-IRSD', 'SI', 'Inšpektorat Republike Slovenije za delo', 'Labour Inspectorate of the Republic of Slovenia', 'IRSD', 'inspectorate', 'https://www.gov.si/drzavni-organi/organi-v-sestavi/inspektorat-za-delo/', NULL, '{"occupational_safety"}', 'Labour and OSH inspection'),
('SI-URSZR', 'SI', 'Uprava Republike Slovenije za zaščito in reševanje', 'Administration for Civil Protection and Disaster Relief', 'URSZR', 'agency', 'https://www.gov.si/drzavni-organi/organi-v-sestavi/uprava-za-zascito-in-resevanje/', NULL, '{"fire_safety","civil_protection"}', 'Fire safety and emergency management'),
('SI-ZZS', 'SI', 'Zdravniška zbornica Slovenije', 'Medical Chamber of Slovenia', 'ZZS', 'chamber', 'https://www.zdravniskazbornica.si', 'https://www.zdravniskazbornica.si/informacije-javnega-znacaja/javni-registri', '{"physicians"}', 'Mandatory membership for physicians'),
('SI-SZDSZM', 'SI', 'Slovensko zdravniško društvo - Sekcija za zobno medicino', 'Slovenian Medical Association - Dental Section', 'SZD', 'association', 'https://www.szd.si', NULL, '{"dentists"}', 'Professional association for dentists; ZZS handles licensing'),
('SI-LZS', 'SI', 'Lekarniška zbornica Slovenije', 'Pharmaceutical Chamber of Slovenia', 'LZS', 'chamber', 'https://www.lzs.si', 'https://www.lzs.si/javni-registri', '{"pharmacists"}', 'Mandatory membership for pharmacists'),
('SI-ZZBNS', 'SI', 'Zbornica zdravstvene in babiške nege Slovenije', 'Chamber of Nurses and Midwives of Slovenia', 'ZZBNS', 'chamber', 'https://www.zbornica-zveza.si', 'https://www.zbornica-zveza.si/javni-registri', '{"nurses","midwives"}', 'Mandatory membership for nurses and midwives'),
('SI-VZS', 'SI', 'Veterinarska zbornica Slovenije', 'Veterinary Chamber of Slovenia', 'VZS', 'chamber', 'https://www.vzs.si', 'https://www.vzs.si/clanstvo', '{"veterinarians"}', 'Mandatory membership for veterinarians'),
('SI-OZS', 'SI', 'Odvetniška zbornica Slovenije', 'Bar Association of Slovenia', 'OZS', 'bar', 'https://www.odv-zb.si', 'https://www.odv-zb.si/imenik-odvetnikov', '{"lawyers"}', 'Mandatory membership for lawyers'),
('SI-NZS', 'SI', 'Notarska zbornica Slovenije', 'Notarial Chamber of Slovenia', 'NZS', 'chamber', 'https://www.notar-z.si', 'https://www.notar-z.si/notarji', '{"notaries"}', 'Mandatory membership for notaries'),
('SI-IZS', 'SI', 'Inženirska zbornica Slovenije', 'Engineering Chamber of Slovenia', 'IZS', 'chamber', 'https://www.izs.si', 'https://www.izs.si/javni-registri', '{"architects","civil_engineers","structural_engineers"}', 'Mandatory membership for architects and engineers'),
('SI-GURS', 'SI', 'Geodetska uprava Republike Slovenije', 'Surveying and Mapping Authority of the Republic of Slovenia', 'GURS', 'agency', 'https://www.gov.si/drzavni-organi/organi-v-sestavi/geodetska-uprava/', 'https://www.gov.si/drzavni-organi/organi-v-sestavi/geodetska-uprava/registri/', '{"surveyors"}', 'Surveying license register'),
('SI-SIR', 'SI', 'Slovenski inštitut za revizijo', 'Slovenian Institute of Auditors', 'SIR', 'institute', 'https://www.si-revizija.si', 'https://www.si-revizija.si/clanica/register-revizorjev', '{"auditors"}', 'Statutory audit oversight'),
('SI-DSKP', 'SI', 'Društvo slovenskih književnih prevajalcev', 'Association of Slovene Literary Translators', 'DSKP', 'association', 'https://www.dskp.si', NULL, '{"translators"}', 'Professional association; court interpreters registered by Ministry of Justice'),
('SI-MP-IZVED', 'SI', 'Ministrstvo za pravosodje - Register izvedencev', 'Ministry of Justice - Expert Register', 'MP', 'register', 'https://www.mp.gov.si', 'https://www.mp.gov.si/pravna_podrocja/civilno_pravo/izvedenci_cenilci_tolmaci_in_prevajalci/', '{"court_experts"}', 'Court-appointed experts register'),
('SI-ZPIZ', 'SI', 'Zavod za pokojninsko in invalidsko zavarovanje Slovenije', 'Pension and Disability Insurance Institute of Slovenia', 'ZPIZ', 'agency', 'https://www.zpiz.si', NULL, '{"social_insurance"}', 'Mandatory social insurance registration'),
('SI-ZZZS', 'SI', 'Zavod za zdravstveno zavarovanje Slovenije', 'Health Insurance Institute of Slovenia', 'ZZZS', 'agency', 'https://www.zzzs.si', NULL, '{"health_insurance"}', 'Mandatory health insurance registration')
ON CONFLICT (code) DO NOTHING;

-- -------------------------------------------------------------------------------------
-- CROATIA (HR) — 20 bodies
-- -------------------------------------------------------------------------------------

INSERT INTO professional_bodies (code, country_code, name_local, name_en, abbreviation, body_type, website_url, register_url, professions_covered, notes) VALUES
('HR-TSREG', 'HR', 'Sudski registar - Trgovački sudovi', 'Court Register - Commercial Courts', 'SR', 'register', 'https://sudreg.pravosudje.hr', 'https://sudreg.pravosudje.hr/registar', '{"all_commercial_entities"}', 'Commercial register managed by commercial courts'),
('HR-POREZNA', 'HR', 'Porezna uprava', 'Tax Administration', 'PU', 'regulatory_authority', 'https://www.porezna-uprava.hr', NULL, '{"all_taxable_entities"}', 'Tax registration and enforcement'),
('HR-DI', 'HR', 'Državni inspektorat', 'State Inspectorate', 'DI', 'inspectorate', 'https://www.di.hr', NULL, '{"occupational_safety","labour"}', 'Labour inspection and OSH enforcement'),
('HR-DUZS', 'HR', 'Državna uprava za zaštitu i spašavanje', 'Directorate for Civil Protection', 'DUZS', 'agency', 'https://civilna-zastita.gov.hr', NULL, '{"fire_safety","civil_protection"}', 'Fire safety and emergency management'),
('HR-HLK', 'HR', 'Hrvatska liječnička komora', 'Croatian Medical Chamber', 'HLK', 'chamber', 'https://www.hlk.hr', 'https://www.hlk.hr/imenik-clanova', '{"physicians"}', 'Mandatory membership for physicians'),
('HR-HKDM', 'HR', 'Hrvatska komora dentalne medicine', 'Croatian Chamber of Dental Medicine', 'HKDM', 'chamber', 'https://www.hkdm.hr', 'https://www.hkdm.hr/imenik', '{"dentists"}', 'Mandatory membership for dentists'),
('HR-HLJEK', 'HR', 'Hrvatska ljekarnička komora', 'Croatian Pharmaceutical Chamber', 'HLjK', 'chamber', 'https://www.hljk.hr', 'https://www.hljk.hr/imenik', '{"pharmacists"}', 'Mandatory membership for pharmacists'),
('HR-HKMS', 'HR', 'Hrvatska komora medicinskih sestara', 'Croatian Nursing Chamber', 'HKMS', 'chamber', 'https://www.hkms.hr', 'https://www.hkms.hr/imenik', '{"nurses"}', 'Mandatory membership for nurses'),
('HR-HKP', 'HR', 'Hrvatska komora primalja', 'Croatian Midwives Chamber', 'HKP', 'chamber', 'https://www.komora-primalja.hr', 'https://www.komora-primalja.hr/imenik', '{"midwives"}', 'Mandatory membership for midwives'),
('HR-HVK', 'HR', 'Hrvatska veterinarska komora', 'Croatian Veterinary Chamber', 'HVK', 'chamber', 'https://www.hvk.hr', 'https://www.hvk.hr/imenik', '{"veterinarians"}', 'Mandatory membership for veterinarians'),
('HR-HOK', 'HR', 'Hrvatska odvjetnička komora', 'Croatian Bar Association', 'HOK', 'bar', 'https://www.hok-cba.hr', 'https://www.hok-cba.hr/imenik', '{"lawyers"}', 'Mandatory membership for lawyers'),
('HR-JBK', 'HR', 'Javnobilježnička komora', 'Notarial Chamber', 'JBK', 'chamber', 'https://www.hjk.hr', 'https://www.hjk.hr/imenik', '{"notaries"}', 'Mandatory membership for notaries'),
('HR-HKA', 'HR', 'Hrvatska komora arhitekata', 'Croatian Chamber of Architects', 'HKA', 'chamber', 'https://www.arhitekti-hka.hr', 'https://www.arhitekti-hka.hr/imenik', '{"architects"}', 'Mandatory membership for architects'),
('HR-HKOING', 'HR', 'Hrvatska komora ovlaštenih inženjera', 'Croatian Chamber of Chartered Engineers', 'HKOING', 'chamber', 'https://www.hkoing.hr', 'https://www.hkoing.hr/imenik', '{"civil_engineers","structural_engineers"}', 'Mandatory membership for chartered engineers'),
('HR-HKOG', 'HR', 'Hrvatska komora ovlaštenih inženjera geodezije', 'Croatian Chamber of Chartered Geodetic Engineers', 'HKOG', 'chamber', 'https://www.hkog.hr', 'https://www.hkog.hr/imenik', '{"surveyors"}', 'Mandatory membership for surveyors'),
('HR-HRK', 'HR', 'Hrvatski revizorski zbor', 'Croatian Audit Chamber', 'HRZ', 'chamber', 'https://www.revizorska-komora.hr', 'https://www.revizorska-komora.hr/registar', '{"auditors"}', 'Statutory audit oversight'),
('HR-HKPS', 'HR', 'Hrvatska komora poreznih savjetnika', 'Croatian Chamber of Tax Advisors', 'HKPS', 'chamber', 'https://www.hkps.hr', 'https://www.hkps.hr/imenik', '{"tax_advisors"}', 'Mandatory membership for tax advisors'),
('HR-HDST', 'HR', 'Hrvatsko društvo sudskih tumača', 'Croatian Association of Court Interpreters', 'HDST', 'association', 'https://www.hdst.hr', NULL, '{"court_interpreters"}', 'Professional association; Ministry of Justice maintains official register'),
('HR-HDSV', 'HR', 'Hrvatsko društvo sudskih vještaka', 'Croatian Association of Court Experts', 'HDSV', 'association', 'https://www.hdsv.hr', NULL, '{"court_experts"}', 'Professional association; Ministry of Justice maintains official register'),
('HR-HKP-PSI', 'HR', 'Hrvatska komora psihologa', 'Croatian Chamber of Psychologists', 'HKP', 'chamber', 'https://www.komora-psihologa.hr', 'https://www.komora-psihologa.hr/imenik', '{"psychologists"}', 'Mandatory membership for psychologists')
ON CONFLICT (code) DO NOTHING;

-- -------------------------------------------------------------------------------------
-- GREECE (GR) — 15 bodies
-- -------------------------------------------------------------------------------------

INSERT INTO professional_bodies (code, country_code, name_local, name_en, abbreviation, body_type, website_url, register_url, professions_covered, notes) VALUES
('GR-GEMI', 'GR', 'Γενικό Εμπορικό Μητρώο', 'General Commercial Registry', 'ΓΕΜΗ', 'register', 'https://www.businessportal.gr', 'https://www.businessportal.gr/services', '{"all_commercial_entities"}', 'Central business register operated by chambers of commerce'),
('GR-AADE', 'GR', 'Ανεξάρτητη Αρχή Δημοσίων Εσόδων', 'Independent Authority for Public Revenue', 'ΑΑΔΕ', 'regulatory_authority', 'https://www.aade.gr', NULL, '{"all_taxable_entities"}', 'Tax administration - mandatory AFM registration'),
('GR-SEPE', 'GR', 'Σώμα Επιθεώρησης Εργασίας', 'Labour Inspectorate', 'ΣΕΠΕ', 'inspectorate', 'https://www.ypakp.gr/sepe', NULL, '{"occupational_safety","labour"}', 'Labour and OSH inspection'),
('GR-FIRE', 'GR', 'Πυροσβεστική Υπηρεσία', 'Hellenic Fire Service', 'ΠΥ', 'agency', 'https://www.fireservice.gr', NULL, '{"fire_safety"}', 'Fire safety inspections and approvals'),
('GR-ISA', 'GR', 'Ιατρικός Σύλλογος Αθηνών', 'Medical Association of Athens', 'ΙΣΑ', 'association', 'https://www.isathens.gr', 'https://www.isathens.gr/members', '{"physicians"}', 'Regional medical associations; ISA is largest'),
('GR-OSA', 'GR', 'Οδοντιατρικός Σύλλογος Αθηνών', 'Dental Association of Athens', 'ΟΣΑ', 'association', 'https://www.osa.gr', 'https://www.osa.gr/members', '{"dentists"}', 'Regional dental associations; OSA is largest'),
('GR-PFS', 'GR', 'Πανελλήνιος Φαρμακευτικός Σύλλογος', 'Panhellenic Pharmaceutical Association', 'ΠΦΣ', 'association', 'https://www.pfs.gr', 'https://www.pfs.gr/members', '{"pharmacists"}', 'National pharmacy professional body'),
('GR-PONEN', 'GR', 'Πανελλήνια Ομοσπονδία Εργαζομένων στα Δημόσια Νοσοκομεία', 'Panhellenic Federation of Public Hospital Workers', 'ΠΟΕΝΕΝ', 'association', 'https://www.poedin.gr', NULL, '{"nurses"}', 'Nursing professional union'),
('GR-PKS', 'GR', 'Πανελλήνιος Κτηνιατρικός Σύλλογος', 'Panhellenic Veterinary Association', 'ΠΚΣ', 'association', 'https://www.pvetassoc.gr', 'https://www.pvetassoc.gr/members', '{"veterinarians"}', 'National veterinary professional body'),
('GR-DSA', 'GR', 'Δικηγορικοί Σύλλογοι Ελλάδας', 'Bar Associations of Greece', 'ΔΣΑ', 'bar', 'https://www.dsa.gr', 'https://www.dsa.gr/members', '{"lawyers"}', 'Regional bar associations coordinated nationally'),
('GR-SSA', 'GR', 'Συμβολαιογραφικοί Σύλλογοι Ελλάδας', 'Notarial Associations of Greece', 'ΣΣ', 'association', 'https://www.symvoliografoi.gr', 'https://www.symvoliografoi.gr/members', '{"notaries"}', 'Regional notarial associations'),
('GR-TEE', 'GR', 'Τεχνικό Επιμελητήριο Ελλάδας', 'Technical Chamber of Greece', 'ΤΕΕ', 'chamber', 'https://www.tee.gr', 'https://www.tee.gr/members', '{"architects","civil_engineers","mechanical_engineers","electrical_engineers"}', 'Mandatory membership for technical professionals'),
('GR-SOEL', 'GR', 'Σώμα Ορκωτών Ελεγκτών Λογιστών', 'Institute of Certified Public Accountants', 'ΣΟΕΛ', 'institute', 'https://www.soel.gr', 'https://www.soel.gr/members', '{"auditors","accountants"}', 'Statutory audit oversight and accounting profession'),
('GR-IKA', 'GR', 'Ηλεκτρονική Εθνική Υπηρεσία Κοινωνικής Ασφάλισης', 'Electronic National Social Security Services', 'e-ΕΦΚΑ', 'agency', 'https://www.efka.gov.gr', NULL, '{"social_insurance"}', 'Unified social insurance authority'),
('GR-EOPYY', 'GR', 'Εθνικός Οργανισμός Παροχής Υπηρεσιών Υγείας', 'National Organization for Healthcare Services Provision', 'ΕΟΠΥΥ', 'agency', 'https://www.eopyy.gov.gr', NULL, '{"health_insurance"}', 'National health insurance organization')
ON CONFLICT (code) DO NOTHING;

-- -------------------------------------------------------------------------------------
-- CYPRUS (CY) — 15 bodies
-- -------------------------------------------------------------------------------------

INSERT INTO professional_bodies (code, country_code, name_local, name_en, abbreviation, body_type, website_url, register_url, professions_covered, notes) VALUES
('CY-ROC', 'CY', 'Έφορος Εταιρειών και Επίσημος Παραλήπτης', 'Registrar of Companies and Official Receiver', 'ROC', 'register', 'https://www.mcit.gov.cy/drcor', 'https://efiling.drcor.mcit.gov.cy/DrcorPublic/', '{"all_commercial_entities"}', 'Companies registration under Ministry of Energy, Commerce and Industry'),
('CY-TAXCY', 'CY', 'Τμήμα Φορολογίας', 'Tax Department', 'TD', 'regulatory_authority', 'https://www.mof.gov.cy/tax', NULL, '{"all_taxable_entities"}', 'Tax registration and administration'),
('CY-DLI', 'CY', 'Τμήμα Επιθεώρησης Εργασίας', 'Department of Labour Inspection', 'DLI', 'inspectorate', 'https://www.mlsi.gov.cy/dli', NULL, '{"occupational_safety","labour"}', 'Labour and OSH inspection'),
('CY-FIRE', 'CY', 'Πυροσβεστική Υπηρεσία Κύπρου', 'Cyprus Fire Service', 'ΠΥΚ', 'agency', 'https://www.moi.gov.cy/fire', NULL, '{"fire_safety"}', 'Fire safety inspections and emergency response'),
('CY-CMA', 'CY', 'Κυπριακός Ιατρικός Σύλλογος', 'Cyprus Medical Association', 'CMA', 'association', 'https://www.cyma.org.cy', 'https://www.cyma.org.cy/members', '{"physicians"}', 'Mandatory registration with Medical Council; CMA is professional body'),
('CY-CDA', 'CY', 'Κυπριακός Οδοντιατρικός Σύλλογος', 'Cyprus Dental Association', 'CDA', 'association', 'https://www.cyda.org.cy', 'https://www.cyda.org.cy/members', '{"dentists"}', 'Mandatory registration with Dental Council'),
('CY-PS', 'CY', 'Φαρμακευτικές Υπηρεσίες', 'Pharmaceutical Services', 'PS', 'regulatory_authority', 'https://www.moh.gov.cy/pharma', 'https://www.moh.gov.cy/pharma/register', '{"pharmacists"}', 'Ministry of Health - Pharmacists register'),
('CY-CNC', 'CY', 'Συμβούλιο Αδειοδότησης και Εποπτείας Νοσηλευτών', 'Cyprus Nursing and Midwifery Council', 'CNC', 'council', 'https://www.moh.gov.cy/nursing', 'https://www.moh.gov.cy/nursing/register', '{"nurses"}', 'Nursing registration and licensing'),
('CY-CMC', 'CY', 'Συμβούλιο Μαιών', 'Midwifery Council', 'CMC', 'council', 'https://www.moh.gov.cy/midwifery', 'https://www.moh.gov.cy/midwifery/register', '{"midwives"}', 'Midwifery registration - often integrated with nursing'),
('CY-CVC', 'CY', 'Κτηνιατρικό Συμβούλιο Κύπρου', 'Cyprus Veterinary Council', 'CVC', 'council', 'https://www.moa.gov.cy/vet', 'https://www.moa.gov.cy/vet/register', '{"veterinarians"}', 'Veterinary licensing under Ministry of Agriculture'),
('CY-CBA', 'CY', 'Παγκύπριος Δικηγορικός Σύλλογος', 'Cyprus Bar Association', 'CBA', 'bar', 'https://www.cyprusbarassociation.org', 'https://www.cyprusbarassociation.org/members', '{"lawyers"}', 'Mandatory membership for advocates'),
('CY-ETEK', 'CY', 'Επιστημονικό Τεχνικό Επιμελητήριο Κύπρου', 'Cyprus Scientific and Technical Chamber', 'ΕΤΕΚ', 'chamber', 'https://www.etek.org.cy', 'https://www.etek.org.cy/register', '{"architects","civil_engineers","mechanical_engineers","electrical_engineers"}', 'Mandatory membership for technical professionals'),
('CY-ICPAC', 'CY', 'Institute of Certified Public Accountants of Cyprus', 'Institute of Certified Public Accountants of Cyprus', 'ICPAC', 'institute', 'https://www.icpac.org.cy', 'https://www.icpac.org.cy/members', '{"auditors","accountants"}', 'Statutory audit oversight'),
('CY-SIS', 'CY', 'Υπηρεσίες Κοινωνικών Ασφαλίσεων', 'Social Insurance Services', 'SIS', 'agency', 'https://www.mlsi.gov.cy/sis', NULL, '{"social_insurance"}', 'Mandatory social insurance registration'),
('CY-GHS', 'CY', 'Γενικό Σύστημα Υγείας', 'General Healthcare System', 'ΓΕΣΥ', 'agency', 'https://www.gesy.org.cy', NULL, '{"health_insurance"}', 'National health insurance scheme')
ON CONFLICT (code) DO NOTHING;

-- -------------------------------------------------------------------------------------
-- SERBIA (RS) — 15 bodies
-- -------------------------------------------------------------------------------------

INSERT INTO professional_bodies (code, country_code, name_local, name_en, abbreviation, body_type, website_url, register_url, professions_covered, notes) VALUES
('RS-APR', 'RS', 'Агенција за привредне регистре', 'Business Registers Agency', 'АПР', 'agency', 'https://www.apr.gov.rs', 'https://www.apr.gov.rs/registri.1435.html', '{"all_commercial_entities"}', 'Central business register'),
('RS-PU', 'RS', 'Пореска управа', 'Tax Administration', 'ПУ', 'regulatory_authority', 'https://www.poreskauprava.gov.rs', NULL, '{"all_taxable_entities"}', 'Tax registration and enforcement'),
('RS-UIP', 'RS', 'Управа за инспекцијске послове', 'Inspectorate Directorate', 'УИП', 'inspectorate', 'https://www.uip.gov.rs', NULL, '{"occupational_safety","labour"}', 'Labour and OSH inspection'),
('RS-SVS', 'RS', 'Сектор за ванредне ситуације', 'Sector for Emergency Management', 'СВС', 'agency', 'https://www.mup.gov.rs/wps/portal/sr/ministarstvo/organizacija/vu', NULL, '{"fire_safety","civil_protection"}', 'Fire safety and emergency management under Ministry of Interior'),
('RS-LKS', 'RS', 'Лекарска комора Србије', 'Medical Chamber of Serbia', 'ЛКС', 'chamber', 'https://www.lks.org.rs', 'https://www.lks.org.rs/imenik', '{"physicians"}', 'Mandatory membership for physicians'),
('RS-SKS', 'RS', 'Стоматолошка комора Србије', 'Dental Chamber of Serbia', 'СКС', 'chamber', 'https://www.stomkom.rs', 'https://www.stomkom.rs/imenik', '{"dentists"}', 'Mandatory membership for dentists'),
('RS-FKS', 'RS', 'Фармацеутска комора Србије', 'Pharmaceutical Chamber of Serbia', 'ФКС', 'chamber', 'https://www.farmkom.rs', 'https://www.farmkom.rs/imenik', '{"pharmacists"}', 'Mandatory membership for pharmacists'),
('RS-KMSTS', 'RS', 'Комора медицинских сестара и техничара Србије', 'Chamber of Nurses and Health Technicians of Serbia', 'КМСТС', 'chamber', 'https://www.kmszts.rs', 'https://www.kmszts.rs/imenik', '{"nurses","health_technicians"}', 'Mandatory membership for nurses'),
('RS-VKS', 'RS', 'Ветеринарска комора Србије', 'Veterinary Chamber of Serbia', 'ВКС', 'chamber', 'https://www.vks.org.rs', 'https://www.vks.org.rs/imenik', '{"veterinarians"}', 'Mandatory membership for veterinarians'),
('RS-AKS', 'RS', 'Адвокатска комора Србије', 'Bar Association of Serbia', 'АКС', 'bar', 'https://www.aks.org.rs', 'https://www.aks.org.rs/imenik', '{"lawyers"}', 'Mandatory membership for advocates'),
('RS-JBKS', 'RS', 'Јавнобележничка комора Србије', 'Notarial Chamber of Serbia', 'ЈБКС', 'chamber', 'https://www.jbkomora.rs', 'https://www.jbkomora.rs/imenik', '{"notaries"}', 'Mandatory membership for notaries'),
('RS-IKS', 'RS', 'Инжењерска комора Србије', 'Engineering Chamber of Serbia', 'ИКС', 'chamber', 'https://www.ingkomora.rs', 'https://www.ingkomora.rs/imenik', '{"architects","civil_engineers","mechanical_engineers"}', 'Mandatory membership for engineers and architects'),
('RS-RGZ', 'RS', 'Републички геодетски завод', 'Republic Geodetic Authority', 'РГЗ', 'agency', 'https://www.rgz.gov.rs', 'https://www.rgz.gov.rs/registri', '{"surveyors"}', 'Surveying license register'),
('RS-KOR', 'RS', 'Комора овлашћених ревизора', 'Chamber of Authorized Auditors', 'КОР', 'chamber', 'https://www.kor.org.rs', 'https://www.kor.org.rs/registar', '{"auditors"}', 'Statutory audit oversight'),
('RS-PIO', 'RS', 'Републички фонд за пензијско и инвалидско осигурање', 'Republic Pension and Disability Insurance Fund', 'ПИО', 'agency', 'https://www.pio.rs', NULL, '{"social_insurance"}', 'Mandatory pension and disability insurance')
ON CONFLICT (code) DO NOTHING;

-- =====================================================================================
-- PART 2: LEGAL_FORM_BODIES JUNCTIONS
-- =====================================================================================

-- -------------------------------------------------------------------------------------
-- SLOVAKIA (SK) — Junctions for 22 legal forms
-- -------------------------------------------------------------------------------------

-- Commercial entities → Register + Tax + SSM + Fire
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes) VALUES
('SK-SRO', 'SK-OBCHREG', 'registration', true, 'Commercial register mandatory'),
('SK-SRO', 'SK-DANUR', 'registration', true, 'Tax registration mandatory'),
('SK-SRO', 'SK-NIP', 'supervision', true, 'OSH supervision if employees'),
('SK-SRO', 'SK-HZS', 'supervision', true, 'Fire safety supervision'),
('SK-AS', 'SK-OBCHREG', 'registration', true, 'Commercial register mandatory'),
('SK-AS', 'SK-DANUR', 'registration', true, 'Tax registration mandatory'),
('SK-AS', 'SK-NIP', 'supervision', true, 'OSH supervision if employees'),
('SK-AS', 'SK-HZS', 'supervision', true, 'Fire safety supervision'),
('SK-VOS', 'SK-OBCHREG', 'registration', true, 'Commercial register mandatory'),
('SK-VOS', 'SK-DANUR', 'registration', true, 'Tax registration mandatory'),
('SK-VOS', 'SK-NIP', 'supervision', true, 'OSH supervision if employees'),
('SK-VOS', 'SK-HZS', 'supervision', true, 'Fire safety supervision'),
('SK-KS', 'SK-OBCHREG', 'registration', true, 'Commercial register mandatory'),
('SK-KS', 'SK-DANUR', 'registration', true, 'Tax registration mandatory'),
('SK-KS', 'SK-NIP', 'supervision', true, 'OSH supervision if employees'),
('SK-KS', 'SK-HZS', 'supervision', true, 'Fire safety supervision'),
('SK-JSA', 'SK-OBCHREG', 'registration', true, 'Commercial register mandatory'),
('SK-JSA', 'SK-DANUR', 'registration', true, 'Tax registration mandatory'),
('SK-JSA', 'SK-NIP', 'supervision', true, 'OSH supervision if employees'),
('SK-JSA', 'SK-HZS', 'supervision', true, 'Fire safety supervision'),
('SK-SE', 'SK-OBCHREG', 'registration', true, 'SE registration'),
('SK-SE', 'SK-DANUR', 'registration', true, 'Tax registration mandatory'),
('SK-SE', 'SK-NIP', 'supervision', true, 'OSH supervision'),
('SK-SE', 'SK-HZS', 'supervision', true, 'Fire safety supervision'),
('SK-SUCC', 'SK-OBCHREG', 'registration', true, 'Branch registration'),
('SK-SUCC', 'SK-DANUR', 'registration', true, 'Tax registration mandatory'),
('SK-SUCC', 'SK-NIP', 'supervision', true, 'OSH supervision'),
('SK-SUCC', 'SK-HZS', 'supervision', true, 'Fire safety supervision'),

-- Sole trader
('SK-SZCO', 'SK-DANUR', 'registration', true, 'Tax registration mandatory for sole traders'),
('SK-SZCO', 'SK-NIP', 'supervision', true, 'OSH if employees'),
('SK-SZCO', 'SK-HZS', 'supervision', false, 'Fire safety if applicable'),

-- Nonprofits and cooperatives
('SK-OBZDR', 'SK-DANUR', 'registration', true, 'Tax registration'),
('SK-NAD', 'SK-DANUR', 'registration', true, 'Tax registration'),
('SK-DRUZ', 'SK-DANUR', 'registration', true, 'Tax registration'),
('SK-SP', 'SK-OBCHREG', 'registration', true, 'Cooperative register'),
('SK-SP', 'SK-DANUR', 'registration', true, 'Tax registration'),
('SK-SP', 'SK-NIP', 'supervision', true, 'OSH supervision'),

-- Regulated professions → Chamber + Tax + SSM
('SK-ADVOKAT', 'SK-SAK', 'membership', true, 'Mandatory bar membership'),
('SK-ADVOKAT', 'SK-DANUR', 'registration', true, 'Tax registration'),
('SK-NOTAR', 'SK-NK', 'licensing', true, 'Notarial license mandatory'),
('SK-NOTAR', 'SK-DANUR', 'registration', true, 'Tax registration'),
('SK-EXEKUTOR', 'SK-SKE', 'licensing', true, 'Executor license mandatory'),
('SK-EXEKUTOR', 'SK-DANUR', 'registration', true, 'Tax registration'),
('SK-AUDITOR', 'SK-KAS', 'licensing', true, 'Auditor license mandatory'),
('SK-AUDITOR', 'SK-DANUR', 'registration', true, 'Tax registration'),
('SK-DANPOR', 'SK-SKDP', 'membership', true, 'Tax advisor chamber membership'),
('SK-DANPOR', 'SK-DANUR', 'registration', true, 'Tax registration'),
('SK-LEKAR', 'SK-SLK', 'membership', true, 'Medical chamber membership'),
('SK-LEKAR', 'SK-DANUR', 'registration', true, 'Tax registration'),
('SK-ZUB', 'SK-SKZL', 'membership', true, 'Dental chamber membership'),
('SK-ZUB', 'SK-DANUR', 'registration', true, 'Tax registration'),
('SK-FARM', 'SK-SLEKAR', 'membership', true, 'Pharmaceutical chamber membership'),
('SK-FARM', 'SK-DANUR', 'registration', true, 'Tax registration'),
('SK-SESTRA', 'SK-SKSAPA', 'membership', true, 'Nursing chamber membership'),
('SK-SESTRA', 'SK-DANUR', 'registration', true, 'Tax registration'),
('SK-PA', 'SK-SKSAPA', 'membership', true, 'Midwife chamber membership'),
('SK-PA', 'SK-DANUR', 'registration', true, 'Tax registration'),
('SK-ARCH', 'SK-SKA', 'membership', true, 'Architects chamber membership'),
('SK-ARCH', 'SK-DANUR', 'registration', true, 'Tax registration'),
('SK-VET', 'SK-SKVL', 'membership', true, 'Veterinary chamber membership'),
('SK-VET', 'SK-DANUR', 'registration', true, 'Tax registration'),
('SK-GEOD', 'SK-SKGK', 'membership', true, 'Surveyor chamber membership'),
('SK-GEOD', 'SK-DANUR', 'registration', true, 'Tax registration'),
('SK-TLMOCNIK', 'SK-SKTP', 'membership', true, 'Interpreter/translator chamber'),
('SK-TLMOCNIK', 'SK-DANUR', 'registration', true, 'Tax registration'),
('SK-ZNALEC', 'SK-KZ', 'licensing', true, 'Court expert register'),
('SK-ZNALEC', 'SK-DANUR', 'registration', true, 'Tax registration')
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- -------------------------------------------------------------------------------------
-- SLOVENIA (SI) — Junctions for 21 legal forms
-- -------------------------------------------------------------------------------------

-- Commercial entities → AJPES + FURS + Labour + Fire
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes) VALUES
('SI-DOO', 'SI-AJPES', 'registration', true, 'Business register mandatory'),
('SI-DOO', 'SI-FURS', 'registration', true, 'Tax registration mandatory'),
('SI-DOO', 'SI-IRSD', 'supervision', true, 'Labour inspection'),
('SI-DOO', 'SI-URSZR', 'supervision', true, 'Fire safety'),
('SI-DOO', 'SI-ZPIZ', 'registration', true, 'Social insurance'),
('SI-DD', 'SI-AJPES', 'registration', true, 'Business register mandatory'),
('SI-DD', 'SI-FURS', 'registration', true, 'Tax registration mandatory'),
('SI-DD', 'SI-IRSD', 'supervision', true, 'Labour inspection'),
('SI-DD', 'SI-URSZR', 'supervision', true, 'Fire safety'),
('SI-DD', 'SI-ZPIZ', 'registration', true, 'Social insurance'),
('SI-DNO', 'SI-AJPES', 'registration', true, 'Business register mandatory'),
('SI-DNO', 'SI-FURS', 'registration', true, 'Tax registration mandatory'),
('SI-DNO', 'SI-IRSD', 'supervision', true, 'Labour inspection'),
('SI-DNO', 'SI-URSZR', 'supervision', true, 'Fire safety'),
('SI-DNO', 'SI-ZPIZ', 'registration', true, 'Social insurance'),
('SI-KD', 'SI-AJPES', 'registration', true, 'Business register mandatory'),
('SI-KD', 'SI-FURS', 'registration', true, 'Tax registration mandatory'),
('SI-KD', 'SI-IRSD', 'supervision', true, 'Labour inspection'),
('SI-KD', 'SI-URSZR', 'supervision', true, 'Fire safety'),
('SI-KD', 'SI-ZPIZ', 'registration', true, 'Social insurance'),
('SI-SE', 'SI-AJPES', 'registration', true, 'SE registration'),
('SI-SE', 'SI-FURS', 'registration', true, 'Tax registration'),
('SI-SE', 'SI-IRSD', 'supervision', true, 'Labour inspection'),
('SI-SE', 'SI-URSZR', 'supervision', true, 'Fire safety'),
('SI-SE', 'SI-ZPIZ', 'registration', true, 'Social insurance'),
('SI-SUCC', 'SI-AJPES', 'registration', true, 'Branch registration'),
('SI-SUCC', 'SI-FURS', 'registration', true, 'Tax registration'),
('SI-SUCC', 'SI-IRSD', 'supervision', true, 'Labour inspection'),
('SI-SUCC', 'SI-URSZR', 'supervision', true, 'Fire safety'),
('SI-SUCC', 'SI-ZPIZ', 'registration', true, 'Social insurance'),

-- Sole trader
('SI-SP', 'SI-AJPES', 'registration', true, 'Sole trader registration'),
('SI-SP', 'SI-FURS', 'registration', true, 'Tax registration'),
('SI-SP', 'SI-IRSD', 'supervision', true, 'OSH if employees'),
('SI-SP', 'SI-ZPIZ', 'registration', true, 'Social insurance'),
('SI-SP', 'SI-ZZZS', 'registration', true, 'Health insurance'),

-- Nonprofits and cooperatives
('SI-DRUSTVO', 'SI-AJPES', 'registration', true, 'Association register'),
('SI-DRUSTVO', 'SI-FURS', 'registration', true, 'Tax registration'),
('SI-Ustanova', 'SI-AJPES', 'registration', true, 'Foundation register'),
('SI-Ustanova', 'SI-FURS', 'registration', true, 'Tax registration'),
('SI-ZADRUGA', 'SI-AJPES', 'registration', true, 'Cooperative register'),
('SI-ZADRUGA', 'SI-FURS', 'registration', true, 'Tax registration'),
('SI-ZADRUGA', 'SI-IRSD', 'supervision', true, 'Labour inspection'),
('SI-JZ', 'SI-FURS', 'registration', true, 'Tax registration'),

-- Regulated professions → Chamber + AJPES + FURS
('SI-ODVETNIK', 'SI-OZS', 'membership', true, 'Bar membership mandatory'),
('SI-ODVETNIK', 'SI-FURS', 'registration', true, 'Tax registration'),
('SI-ODVETNIK', 'SI-ZPIZ', 'registration', true, 'Social insurance'),
('SI-ZDRAVNIK', 'SI-ZZS', 'membership', true, 'Medical chamber membership'),
('SI-ZDRAVNIK', 'SI-FURS', 'registration', true, 'Tax registration'),
('SI-ZDRAVNIK', 'SI-ZPIZ', 'registration', true, 'Social insurance'),
('SI-ARH', 'SI-IZS', 'membership', true, 'Engineering chamber membership'),
('SI-ARH', 'SI-FURS', 'registration', true, 'Tax registration'),
('SI-ARH', 'SI-ZPIZ', 'registration', true, 'Social insurance'),
('SI-VET', 'SI-VZS', 'membership', true, 'Veterinary chamber membership'),
('SI-VET', 'SI-FURS', 'registration', true, 'Tax registration'),
('SI-VET', 'SI-ZPIZ', 'registration', true, 'Social insurance'),
('SI-NOTAR', 'SI-NZS', 'licensing', true, 'Notarial license mandatory'),
('SI-NOTAR', 'SI-FURS', 'registration', true, 'Tax registration'),
('SI-ZOBOZDR', 'SI-ZZS', 'membership', true, 'Medical chamber - dentistry section'),
('SI-ZOBOZDR', 'SI-FURS', 'registration', true, 'Tax registration'),
('SI-ZOBOZDR', 'SI-ZPIZ', 'registration', true, 'Social insurance'),
('SI-FARM', 'SI-LZS', 'membership', true, 'Pharmaceutical chamber membership'),
('SI-FARM', 'SI-FURS', 'registration', true, 'Tax registration'),
('SI-FARM', 'SI-ZPIZ', 'registration', true, 'Social insurance'),
('SI-MEDS', 'SI-ZZBNS', 'membership', true, 'Nursing chamber membership'),
('SI-MEDS', 'SI-FURS', 'registration', true, 'Tax registration'),
('SI-MEDS', 'SI-ZPIZ', 'registration', true, 'Social insurance'),
('SI-BABICA', 'SI-ZZBNS', 'membership', true, 'Midwifery chamber membership'),
('SI-BABICA', 'SI-FURS', 'registration', true, 'Tax registration'),
('SI-BABICA', 'SI-ZPIZ', 'registration', true, 'Social insurance'),
('SI-INZGR', 'SI-IZS', 'membership', true, 'Engineering chamber - civil engineering'),
('SI-INZGR', 'SI-FURS', 'registration', true, 'Tax registration'),
('SI-INZGR', 'SI-ZPIZ', 'registration', true, 'Social insurance'),
('SI-GEOD', 'SI-GURS', 'licensing', true, 'Surveyor license from GURS'),
('SI-GEOD', 'SI-FURS', 'registration', true, 'Tax registration'),
('SI-GEOD', 'SI-ZPIZ', 'registration', true, 'Social insurance'),
('SI-REVIZOR', 'SI-SIR', 'membership', true, 'Auditor membership mandatory'),
('SI-REVIZOR', 'SI-FURS', 'registration', true, 'Tax registration'),
('SI-REVIZOR', 'SI-ZPIZ', 'registration', true, 'Social insurance'),
('SI-TOLMAC', 'SI-MP-IZVED', 'licensing', true, 'Court interpreter registration'),
('SI-TOLMAC', 'SI-FURS', 'registration', true, 'Tax registration'),
('SI-TOLMAC', 'SI-ZPIZ', 'registration', true, 'Social insurance'),
('SI-IZVED', 'SI-MP-IZVED', 'licensing', true, 'Court expert registration'),
('SI-IZVED', 'SI-FURS', 'registration', true, 'Tax registration'),
('SI-IZVED', 'SI-ZPIZ', 'registration', true, 'Social insurance')
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- -------------------------------------------------------------------------------------
-- CROATIA (HR) — Junctions for 25 legal forms
-- -------------------------------------------------------------------------------------

-- Commercial entities → Court register + Tax + Labour + Fire
INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes) VALUES
('HR-DOO', 'HR-TSREG', 'registration', true, 'Court register mandatory'),
('HR-DOO', 'HR-POREZNA', 'registration', true, 'Tax registration mandatory'),
('HR-DOO', 'HR-DI', 'supervision', true, 'Labour and OSH inspection'),
('HR-DOO', 'HR-DUZS', 'supervision', true, 'Fire safety'),
('HR-JDOO', 'HR-TSREG', 'registration', true, 'Court register mandatory'),
('HR-JDOO', 'HR-POREZNA', 'registration', true, 'Tax registration mandatory'),
('HR-JDOO', 'HR-DI', 'supervision', true, 'Labour and OSH inspection'),
('HR-JDOO', 'HR-DUZS', 'supervision', true, 'Fire safety'),
('HR-DD', 'HR-TSREG', 'registration', true, 'Court register mandatory'),
('HR-DD', 'HR-POREZNA', 'registration', true, 'Tax registration mandatory'),
('HR-DD', 'HR-DI', 'supervision', true, 'Labour and OSH inspection'),
('HR-DD', 'HR-DUZS', 'supervision', true, 'Fire safety'),
('HR-JTD', 'HR-TSREG', 'registration', true, 'Court register mandatory'),
('HR-JTD', 'HR-POREZNA', 'registration', true, 'Tax registration mandatory'),
('HR-JTD', 'HR-DI', 'supervision', true, 'Labour and OSH inspection'),
('HR-JTD', 'HR-DUZS', 'supervision', true, 'Fire safety'),
('HR-KD', 'HR-TSREG', 'registration', true, 'Court register mandatory'),
('HR-KD', 'HR-POREZNA', 'registration', true, 'Tax registration mandatory'),
('HR-KD', 'HR-DI', 'supervision', true, 'Labour and OSH inspection'),
('HR-KD', 'HR-DUZS', 'supervision', true, 'Fire safety'),
('HR-SE', 'HR-TSREG', 'registration', true, 'SE registration'),
('HR-SE', 'HR-POREZNA', 'registration', true, 'Tax registration'),
('HR-SE', 'HR-DI', 'supervision', true, 'Labour inspection'),
('HR-SE', 'HR-DUZS', 'supervision', true, 'Fire safety'),
('HR-POD', 'HR-TSREG', 'registration', true, 'Branch registration'),
('HR-POD', 'HR-POREZNA', 'registration', true, 'Tax registration'),
('HR-POD', 'HR-DI', 'supervision', true, 'Labour inspection'),
('HR-POD', 'HR-DUZS', 'supervision', true, 'Fire safety'),

-- Sole trader (Obrt)
('HR-OBRT', 'HR-TSREG', 'registration', true, 'Craft register'),
('HR-OBRT', 'HR-POREZNA', 'registration', true, 'Tax registration'),
('HR-OBRT', 'HR-DI', 'supervision', true, 'OSH if employees'),
('HR-OBRT', 'HR-DUZS', 'supervision', false, 'Fire safety if applicable'),

-- Nonprofits and cooperatives
('HR-UDRUGA', 'HR-POREZNA', 'registration', true, 'Tax registration'),
('HR-ZAKL', 'HR-POREZNA', 'registration', true, 'Tax registration'),
('HR-ZADR', 'HR-TSREG', 'registration', true, 'Cooperative register'),
('HR-ZADR', 'HR-POREZNA', 'registration', true, 'Tax registration'),
('HR-ZADR', 'HR-DI', 'supervision', true, 'Labour inspection'),
('HR-JU', 'HR-POREZNA', 'registration', true, 'Tax registration'),
('HR-TP', 'HR-POREZNA', 'registration', true, 'Tax registration'),

-- Regulated professions → Chamber + Tax
('HR-ODVJET', 'HR-HOK', 'membership', true, 'Bar membership mandatory'),
('HR-ODVJET', 'HR-POREZNA', 'registration', true, 'Tax registration'),
('HR-LIJEC', 'HR-HLK', 'membership', true, 'Medical chamber membership'),
('HR-LIJEC', 'HR-POREZNA', 'registration', true, 'Tax registration'),
('HR-DENT', 'HR-HKDM', 'membership', true, 'Dental chamber membership'),
('HR-DENT', 'HR-POREZNA', 'registration', true, 'Tax registration'),
('HR-LJEK', 'HR-HLJEK', 'membership', true, 'Pharmaceutical chamber membership'),
('HR-LJEK', 'HR-POREZNA', 'registration', true, 'Tax registration'),
('HR-MEDSES', 'HR-HKMS', 'membership', true, 'Nursing chamber membership'),
('HR-MEDSES', 'HR-POREZNA', 'registration', true, 'Tax registration'),
('HR-PRIMALJA', 'HR-HKP', 'membership', true, 'Midwife chamber membership'),
('HR-PRIMALJA', 'HR-POREZNA', 'registration', true, 'Tax registration'),
('HR-ARH', 'HR-HKA', 'membership', true, 'Architects chamber membership'),
('HR-ARH', 'HR-POREZNA', 'registration', true, 'Tax registration'),
('HR-VET', 'HR-HVK', 'membership', true, 'Veterinary chamber membership'),
('HR-VET', 'HR-POREZNA', 'registration', true, 'Tax registration'),
('HR-JAVBIL', 'HR-JBK', 'licensing', true, 'Notarial license mandatory'),
('HR-JAVBIL', 'HR-POREZNA', 'registration', true, 'Tax registration'),
('HR-OVLING', 'HR-HKOING', 'membership', true, 'Engineers chamber membership'),
('HR-OVLING', 'HR-POREZNA', 'registration', true, 'Tax registration'),
('HR-GEOD', 'HR-HKOG', 'membership', true, 'Surveyor chamber membership'),
('HR-GEOD', 'HR-POREZNA', 'registration', true, 'Tax registration'),
('HR-REVIZOR', 'HR-HRK', 'membership', true, 'Auditor chamber membership'),
('HR-REVIZOR', 'HR-POREZNA', 'registration', true, 'Tax registration'),
('HR-POREZ', 'HR-HKPS', 'membership', true, 'Tax advisor chamber membership'),
('HR-POREZ', 'HR-POREZNA', 'registration', true, 'Tax registration'),
('HR-TUMAC', 'HR-HDST', 'membership', false, 'Professional association; Ministry register mandatory'),
('HR-TUMAC', 'HR-POREZNA', 'registration', true, 'Tax registration'),
('HR-VJEST', 'HR-HDSV', 'membership', false, 'Professional association; Ministry register mandatory'),
('HR-VJEST', 'HR-POREZNA', 'registration', true, 'Tax registration'),
('HR-PSIH', 'HR-HKP-PSI', 'membership', true, 'Psychologist chamber membership'),
('HR-PSIH', 'HR-POREZNA', 'registration', true, 'Tax registration')
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- =====================================================================================
-- PART 3: GREECE, CYPRUS, SERBIA — JUNCTIONS PENDING
-- =====================================================================================

-- -------------------------------------------------------------------------------------
-- ⚠️ GR, CY, RS JUNCTIONS: Requires exact legal_form codes from database
-- -------------------------------------------------------------------------------------
--
-- To complete junctions for GR, CY, RS, first extract codes with:
--
--   SELECT code, name_local, category
--   FROM legal_forms
--   WHERE country_code IN ('GR','CY','RS')
--   ORDER BY country_code, category, code;
--
-- Then add junctions following the pattern:
-- - Commercial entities → GEMI/ROC/APR (register) + Tax + Labour + Fire
-- - Sole traders → Tax + (optional) SSM/Fire
-- - Regulated professions → Professional chamber/council + Tax
-- - Nonprofits → Tax (+ register if applicable)
--
-- Example for Greece (once codes are known):
-- INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory) VALUES
-- ('GR-EPE', 'GR-GEMI', 'registration', true),
-- ('GR-EPE', 'GR-AADE', 'registration', true),
-- ('GR-EPE', 'GR-SEPE', 'supervision', true),
-- ('GR-EPE', 'GR-FIRE', 'supervision', true),
-- ... etc
--
-- Same pattern applies to CY and RS with their respective body codes.
--
-- -------------------------------------------------------------------------------------

-- =====================================================================================
-- VERIFICATION QUERIES
-- =====================================================================================

-- Count bodies per country
-- SELECT country_code, COUNT(*) as bodies
-- FROM professional_bodies
-- WHERE country_code IN ('SK','SI','HR','GR','CY','RS')
-- GROUP BY country_code
-- ORDER BY country_code;

-- Count junctions per country
-- SELECT pb.country_code, COUNT(*) as junctions
-- FROM legal_form_bodies lfb
-- JOIN professional_bodies pb ON pb.code = lfb.body_code
-- WHERE pb.country_code IN ('SK','SI','HR','GR','CY','RS')
-- GROUP BY pb.country_code
-- ORDER BY pb.country_code;

-- List all professional bodies
-- SELECT code, country_code, abbreviation, name_en, body_type
-- FROM professional_bodies
-- WHERE country_code IN ('SK','SI','HR','GR','CY','RS')
-- ORDER BY country_code, body_type, code;

-- =====================================================================================
-- END OF FILE
-- =====================================================================================
