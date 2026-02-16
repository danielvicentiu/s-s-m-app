-- Migration: Scan Pipeline Universal - OCR + AI extraction pentru documente SSM/PSI/contabilitate
-- Created: 2026-02-16

-- Tabel: Templates pentru tipuri de documente
CREATE TABLE IF NOT EXISTS document_scan_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_key TEXT UNIQUE NOT NULL,
    name_ro TEXT NOT NULL,
    name_en TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('ssm', 'psi', 'medical', 'equipment', 'general', 'accounting')),
    fields JSONB NOT NULL,
    extraction_prompt TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabel: Document scans procesate
CREATE TABLE IF NOT EXISTS document_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    template_key TEXT REFERENCES document_scan_templates(template_key) ON DELETE SET NULL,
    original_filename TEXT NOT NULL,
    storage_path TEXT,
    extracted_data JSONB,
    confidence_score NUMERIC(5,2),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'reviewed')),
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index pentru queries frecvente
CREATE INDEX idx_document_scans_org_template_status ON document_scans(org_id, template_key, status);
CREATE INDEX idx_document_scans_created_at ON document_scans(created_at DESC);

-- RLS pentru document_scan_templates
ALTER TABLE document_scan_templates ENABLE ROW LEVEL SECURITY;

-- Admin: full access
CREATE POLICY "Admin full access on templates" ON document_scan_templates
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid()
            AND r.name = 'admin'
        )
    );

-- Consultant: read access
CREATE POLICY "Consultant read templates" ON document_scan_templates
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid()
            AND r.name IN ('consultant', 'firma_admin', 'angajat')
        )
    );

-- RLS pentru document_scans
ALTER TABLE document_scans ENABLE ROW LEVEL SECURITY;

-- Users see only own org scans
CREATE POLICY "Users see own org scans" ON document_scans
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM memberships m
            WHERE m.org_id = document_scans.org_id
            AND m.user_id = auth.uid()
        )
    );

-- Users can insert scans for own org
CREATE POLICY "Users insert own org scans" ON document_scans
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM memberships m
            WHERE m.org_id = document_scans.org_id
            AND m.user_id = auth.uid()
        )
    );

-- Users can update own org scans
CREATE POLICY "Users update own org scans" ON document_scans
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM memberships m
            WHERE m.org_id = document_scans.org_id
            AND m.user_id = auth.uid()
        )
    );

-- INSERT Templates: 21 template-uri pentru documente SSM/PSI/contabilitate

-- SSM Templates
INSERT INTO document_scan_templates (template_key, name_ro, name_en, category, fields, extraction_prompt) VALUES
('contract_munca', 'Contract de muncă', 'Employment Contract', 'ssm',
'[{"key":"nume_angajat","label":"Nume angajat","type":"text"},{"key":"prenume","label":"Prenume","type":"text"},{"key":"cnp","label":"CNP","type":"cnp","validation":"cnp"},{"key":"functie","label":"Funcția","type":"text"},{"key":"data_angajarii","label":"Data angajării","type":"date"},{"key":"tip_contract","label":"Tip contract","type":"select","options":["nedeterminat","determinat"]},{"key":"norma","label":"Norma","type":"select","options":["8h","6h","4h"]},{"key":"loc_munca","label":"Loc de muncă","type":"text"},{"key":"cui_angajator","label":"CUI angajator","type":"text"},{"key":"denumire_angajator","label":"Denumire angajator","type":"text"}]',
'Extrage datele contractului de muncă. Caută: nume complet angajat, CNP, funcția, data angajării, tip contract (nedeterminat/determinat), norma de lucru, locul de muncă, CUI și denumirea angajatorului.'),

('fisa_instruire_ig', 'Fișă instruire IG (Generală)', 'General Instruction Form', 'ssm',
'[{"key":"nume_angajat","label":"Nume angajat","type":"text"},{"key":"prenume","label":"Prenume","type":"text"},{"key":"cnp","label":"CNP","type":"cnp","validation":"cnp"},{"key":"functie","label":"Funcția","type":"text"},{"key":"data_instruirii","label":"Data instruirii","type":"date"},{"key":"instructor","label":"Instructor SSM","type":"text"},{"key":"durata_ore","label":"Durată (ore)","type":"number"}]',
'Extrage datele fișei de instruire generală (IG). Caută: nume complet angajat, CNP, funcția, data instruirii, numele instructorului SSM, durata în ore.'),

('fisa_instruire_llm', 'Fișă instruire LLM (La locul de muncă)', 'On-the-Job Training Form', 'ssm',
'[{"key":"nume_angajat","label":"Nume angajat","type":"text"},{"key":"prenume","label":"Prenume","type":"text"},{"key":"cnp","label":"CNP","type":"cnp","validation":"cnp"},{"key":"functie","label":"Funcția","type":"text"},{"key":"data_instruirii","label":"Data instruirii","type":"date"},{"key":"sef_direct","label":"Șef direct","type":"text"},{"key":"durata_ore","label":"Durată (ore)","type":"number"},{"key":"teme_abordate","label":"Teme abordate","type":"text"}]',
'Extrage datele fișei de instruire la locul de muncă (LLM). Caută: nume complet angajat, CNP, funcția, data instruirii, șeful direct, durata în ore, temele abordate.'),

('fisa_instruire_periodica', 'Fișă instruire periodică', 'Periodic Training Form', 'ssm',
'[{"key":"nume_angajat","label":"Nume angajat","type":"text"},{"key":"prenume","label":"Prenume","type":"text"},{"key":"cnp","label":"CNP","type":"cnp","validation":"cnp"},{"key":"functie","label":"Funcția","type":"text"},{"key":"data_instruirii","label":"Data instruirii","type":"date"},{"key":"data_urmatoare","label":"Data următoare instruire","type":"date"},{"key":"instructor","label":"Instructor SSM","type":"text"},{"key":"nota","label":"Nota/Calificativ","type":"text"}]',
'Extrage datele fișei de instruire periodică. Caută: nume complet angajat, CNP, funcția, data instruirii curente, data următoarei instruiri, instructor SSM, nota/calificativ.'),

('proces_verbal_instruire', 'Proces-verbal instruire colectivă', 'Group Training Record', 'ssm',
'[{"key":"data_instruirii","label":"Data instruirii","type":"date"},{"key":"tip_instruire","label":"Tip instruire","type":"select","options":["IG","periodica","tematica"]},{"key":"instructor","label":"Instructor","type":"text"},{"key":"numar_participanti","label":"Număr participanți","type":"number"},{"key":"teme_abordate","label":"Teme abordate","type":"text"}]',
'Extrage datele procesului-verbal de instruire colectivă. Caută: data instruirii, tipul instruirii (IG/periodică/tematică), instructor, număr participanți, temele abordate.'),

('fisa_post', 'Fișa postului', 'Job Description', 'ssm',
'[{"key":"functie","label":"Funcția","type":"text"},{"key":"departament","label":"Departament","type":"text"},{"key":"sef_ierarhic","label":"Șef ierarhic","type":"text"},{"key":"salariu_brut","label":"Salariu brut","type":"number"},{"key":"studii_necesare","label":"Studii necesare","type":"text"},{"key":"experienta_ani","label":"Experiență (ani)","type":"number"}]',
'Extrage datele fișei postului. Caută: denumirea funcției, departament, șef ierarhic, salariu brut, studii necesare, experiență cerută (în ani).'),

('decizie_numire_cssm', 'Decizie numire CSSM', 'HSW Committee Appointment Decision', 'ssm',
'[{"key":"numar_decizie","label":"Număr decizie","type":"text"},{"key":"data_decizie","label":"Data deciziei","type":"date"},{"key":"nume_membru","label":"Nume membru CSSM","type":"text"},{"key":"functie_membru","label":"Funcția membrului","type":"text"},{"key":"rol_cssm","label":"Rol în CSSM","type":"select","options":["președinte","secretar","membru"]},{"key":"data_expirare","label":"Data expirare mandat","type":"date"}]',
'Extrage datele deciziei de numire în CSSM. Caută: număr și data deciziei, nume membru, funcția în firmă, rolul în CSSM (președinte/secretar/membru), data expirării mandatului.'),

('tematica_instruire', 'Tematică instruire SSM', 'HSW Training Syllabus', 'ssm',
'[{"key":"luna","label":"Luna","type":"text"},{"key":"an","label":"An","type":"number"},{"key":"tema_principala","label":"Tema principală","type":"text"},{"key":"durata_ore","label":"Durată estimată (ore)","type":"number"},{"key":"responsabil","label":"Responsabil instruire","type":"text"}]',
'Extrage datele tematicii de instruire SSM. Caută: luna și anul, tema principală, durata estimată în ore, responsabil de instruire.'),

('test_verificare', 'Test de verificare SSM', 'HSW Knowledge Test', 'ssm',
'[{"key":"nume_angajat","label":"Nume angajat","type":"text"},{"key":"data_test","label":"Data testului","type":"date"},{"key":"numar_intrebari","label":"Număr întrebări","type":"number"},{"key":"raspunsuri_corecte","label":"Răspunsuri corecte","type":"number"},{"key":"nota","label":"Nota","type":"number"},{"key":"rezultat","label":"Rezultat","type":"select","options":["promovat","respins"]}]',
'Extrage datele testului de verificare SSM. Caută: nume angajat, data testului, număr întrebări, răspunsuri corecte, nota obținută, rezultat (promovat/respins).'),

('declaratie_proprie_raspundere', 'Declarație pe proprie răspundere', 'Statutory Declaration', 'ssm',
'[{"key":"nume_declarant","label":"Nume declarant","type":"text"},{"key":"cnp","label":"CNP","type":"cnp","validation":"cnp"},{"key":"data_declaratie","label":"Data declarației","type":"date"},{"key":"obiect_declaratie","label":"Obiectul declarației","type":"text"}]',
'Extrage datele declarației pe proprie răspundere. Caută: nume complet declarant, CNP, data declarației, obiectul/scopul declarației.');

-- PSI Templates
INSERT INTO document_scan_templates (template_key, name_ro, name_en, category, fields, extraction_prompt) VALUES
('autorizatie_psi', 'Autorizație PSI', 'Fire Safety Authorization', 'psi',
'[{"key":"numar_autorizatie","label":"Număr autorizație","type":"text"},{"key":"data_emiterii","label":"Data emiterii","type":"date"},{"key":"data_expirarii","label":"Data expirării","type":"date"},{"key":"cui_beneficiar","label":"CUI beneficiar","type":"cui","validation":"cui"},{"key":"denumire_beneficiar","label":"Denumire beneficiar","type":"text"},{"key":"adresa_obiectiv","label":"Adresa obiectiv","type":"text"},{"key":"emitent","label":"Emitent (ISU)","type":"text"}]',
'Extrage datele autorizației PSI. Caută: număr autorizație, data emiterii, data expirării, CUI și denumirea beneficiarului, adresa obiectivului, emitent (ISU).'),

('revizie_stingator', 'Revizie stingător', 'Fire Extinguisher Service', 'psi',
'[{"key":"nr_serie_stingator","label":"Nr. serie stingător","type":"text"},{"key":"tip_stingator","label":"Tip stingător","type":"select","options":["pulbere","CO2","spuma","apa"]},{"key":"capacitate","label":"Capacitate (kg/L)","type":"number"},{"key":"data_revizie","label":"Data revizie","type":"date"},{"key":"data_urmatoare_revizie","label":"Data următoare revizie","type":"date"},{"key":"firma_service","label":"Firma service","type":"text"},{"key":"rezultat","label":"Rezultat","type":"select","options":["apt","inapt"]}]',
'Extrage datele reviziei stingătorului. Caută: număr serie, tip stingător (pulbere/CO2/spumă/apă), capacitate, data revizie, data următoare revizie, firma service, rezultat (apt/inapt).'),

('decizie_numire_responsabil_psi', 'Decizie numire responsabil PSI', 'Fire Safety Officer Appointment', 'psi',
'[{"key":"numar_decizie","label":"Număr decizie","type":"text"},{"key":"data_decizie","label":"Data deciziei","type":"date"},{"key":"nume_responsabil","label":"Nume responsabil PSI","type":"text"},{"key":"cnp","label":"CNP","type":"cnp","validation":"cnp"},{"key":"functie","label":"Funcția","type":"text"},{"key":"curs_psi","label":"Certificat curs PSI","type":"text"}]',
'Extrage datele deciziei de numire responsabil PSI. Caută: număr și data deciziei, nume responsabil PSI, CNP, funcția în firmă, certificat curs PSI.'),

('plan_evacuare', 'Plan de evacuare', 'Evacuation Plan', 'psi',
'[{"key":"obiectiv","label":"Obiectiv/Clădire","type":"text"},{"key":"adresa","label":"Adresă","type":"text"},{"key":"numar_etaje","label":"Număr etaje","type":"number"},{"key":"capacitate_persoane","label":"Capacitate (persoane)","type":"number"},{"key":"numar_iesiri","label":"Număr ieșiri urgență","type":"number"},{"key":"data_elaborare","label":"Data elaborare","type":"date"},{"key":"responsabil","label":"Responsabil PSI","type":"text"}]',
'Extrage datele planului de evacuare. Caută: denumire obiectiv/clădire, adresă, număr etaje, capacitate în persoane, număr ieșiri de urgență, data elaborare, responsabil PSI.');

-- Medical Templates
INSERT INTO document_scan_templates (template_key, name_ro, name_en, category, fields, extraction_prompt) VALUES
('certificat_medical_aptitudine', 'Certificat medical de aptitudine', 'Medical Fitness Certificate', 'medical',
'[{"key":"nume_angajat","label":"Nume angajat","type":"text"},{"key":"prenume","label":"Prenume","type":"text"},{"key":"cnp","label":"CNP","type":"cnp","validation":"cnp"},{"key":"functie","label":"Funcția","type":"text"},{"key":"data_examinarii","label":"Data examinării","type":"date"},{"key":"rezultat","label":"Rezultat","type":"select","options":["apt","apt cu recomandari","inapt temporar","inapt"]},{"key":"data_urmatoare","label":"Data următoare control","type":"date"},{"key":"medic","label":"Medic de medicină a muncii","type":"text"}]',
'Extrage datele certificatului medical de aptitudine. Caută: nume complet angajat, CNP, funcția, data examinării, rezultat (apt/apt cu recomandări/inapt temporar/inapt), data următorului control, nume medic de medicină a muncii.'),

('fisa_aptitudine', 'Fișa de aptitudine', 'Medical Aptitude Form', 'medical',
'[{"key":"nume_angajat","label":"Nume angajat","type":"text"},{"key":"cnp","label":"CNP","type":"cnp","validation":"cnp"},{"key":"functie","label":"Funcția","type":"text"},{"key":"data_examen","label":"Data examen","type":"date"},{"key":"tensiune","label":"Tensiune arterială","type":"text"},{"key":"puls","label":"Puls","type":"number"},{"key":"greutate","label":"Greutate (kg)","type":"number"},{"key":"inaltime","label":"Înălțime (cm)","type":"number"},{"key":"observatii","label":"Observații medicale","type":"text"}]',
'Extrage datele fișei de aptitudine medicală. Caută: nume complet angajat, CNP, funcția, data examen, tensiune arterială, puls, greutate, înălțime, observații medicale.');

-- Equipment Templates
INSERT INTO document_scan_templates (template_key, name_ro, name_en, category, fields, extraction_prompt) VALUES
('verificare_iscir', 'Verificare ISCIR', 'ISCIR Technical Inspection', 'equipment',
'[{"key":"nr_inventar","label":"Nr. inventar echipament","type":"text"},{"key":"tip_echipament","label":"Tip echipament","type":"text"},{"key":"serie_fabricatie","label":"Serie fabricație","type":"text"},{"key":"data_verificare","label":"Data verificare","type":"date"},{"key":"data_urmatoare","label":"Data următoare verificare","type":"date"},{"key":"verificator","label":"Verificator ISCIR","type":"text"},{"key":"rezultat","label":"Rezultat","type":"select","options":["admis","respins"]}]',
'Extrage datele verificării ISCIR. Caută: număr inventar echipament, tip echipament, serie fabricație, data verificare, data următoare verificare, nume verificator ISCIR, rezultat (admis/respins).'),

('certificat_verificare_instalatie', 'Certificat verificare instalație', 'Installation Verification Certificate', 'equipment',
'[{"key":"tip_instalatie","label":"Tip instalație","type":"text"},{"key":"nr_certificat","label":"Nr. certificat","type":"text"},{"key":"data_verificare","label":"Data verificare","type":"date"},{"key":"data_expirare","label":"Data expirare","type":"date"},{"key":"parametri_tehnici","label":"Parametri tehnici","type":"text"},{"key":"firma_verificatoare","label":"Firma verificatoare","type":"text"},{"key":"rezultat","label":"Rezultat","type":"select","options":["corespunzător","necorespunzător"]}]',
'Extrage datele certificatului de verificare instalație. Caută: tip instalație, număr certificat, data verificare, data expirare, parametri tehnici, firma verificatoare, rezultat (corespunzător/necorespunzător).'),

('registru_verificare_tehnica', 'Registru verificare tehnică', 'Technical Inspection Register', 'equipment',
'[{"key":"nr_registru","label":"Nr. registru","type":"text"},{"key":"data_inregistrare","label":"Data înregistrare","type":"date"},{"key":"echipament","label":"Echipament verificat","type":"text"},{"key":"tip_verificare","label":"Tip verificare","type":"select","options":["periodică","reparație","punere în funcțiune"]},{"key":"rezultat","label":"Rezultat","type":"text"},{"key":"observatii","label":"Observații","type":"text"}]',
'Extrage datele din registrul de verificare tehnică. Caută: număr registru, data înregistrare, echipament verificat, tip verificare (periodică/reparație/punere în funcțiune), rezultat, observații.');

-- General Templates
INSERT INTO document_scan_templates (template_key, name_ro, name_en, category, fields, extraction_prompt) VALUES
('permis_lucru', 'Permis de lucru', 'Work Permit', 'general',
'[{"key":"nr_permis","label":"Nr. permis","type":"text"},{"key":"data_emitere","label":"Data emitere","type":"date"},{"key":"data_expirare","label":"Data expirare","type":"date"},{"key":"tip_lucrare","label":"Tip lucrare","type":"select","options":["înălțime","spații confinate","foc deschis","electric","alte lucrări periculoase"]},{"key":"locatie","label":"Locație lucrare","type":"text"},{"key":"responsabil_lucru","label":"Responsabil lucrare","type":"text"},{"key":"emitent_permis","label":"Emitent permis","type":"text"}]',
'Extrage datele permisului de lucru. Caută: număr permis, data emitere, data expirare, tip lucrare (înălțime/spații confinate/foc deschis/electric/alte), locație, responsabil lucrare, emitent permis.');

-- Accounting Template
INSERT INTO document_scan_templates (template_key, name_ro, name_en, category, fields, extraction_prompt) VALUES
('bon_fiscal_echipament', 'Bon fiscal echipament protecție', 'Protective Equipment Receipt', 'accounting',
'[{"key":"nr_bon","label":"Nr. bon fiscal","type":"text"},{"key":"data_achizitie","label":"Data achiziție","type":"date"},{"key":"denumire_furnizor","label":"Denumire furnizor","type":"text"},{"key":"cui_furnizor","label":"CUI furnizor","type":"cui","validation":"cui"},{"key":"tip_echipament","label":"Tip echipament","type":"text"},{"key":"cantitate","label":"Cantitate","type":"number"},{"key":"pret_unitar","label":"Preț unitar","type":"number"},{"key":"total","label":"Total","type":"number"},{"key":"tva","label":"TVA","type":"number"}]',
'Extrage datele bonului fiscal pentru echipament de protecție. Caută: număr bon, data achiziție, denumire și CUI furnizor, tip echipament, cantitate, preț unitar, total, TVA.');

-- Grant permissions pentru functii uuid_generate_v4
GRANT EXECUTE ON FUNCTION uuid_generate_v4() TO authenticated;
