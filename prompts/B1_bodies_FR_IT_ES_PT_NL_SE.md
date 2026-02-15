# AGENT B1 — Professional Bodies: FR, IT, ES, PT, NL, SE
# Rulează cu: claude-code --model claude-sonnet-4-5-20250929
# Output: B1_bodies_FR_IT_ES_PT_NL_SE.sql

## CONTEXT
Construiesc o bază de date PostgreSQL (Supabase) cu corpuri profesionale și autorități de reglementare per țară, pentru o platformă de conformitate SSM/PSI europeană (s-s-m.ro). Tabelul `legal_forms` există deja populat. Tabelul `professional_bodies` și `legal_form_bodies` (junction M2M) există deja cu date pentru RO, BG, HU, DE, PL.

## TASK
Generează un fișier SQL unic (`B1_bodies_FR_IT_ES_PT_NL_SE.sql`) care inserează:
1. Professional bodies (ordine profesionale, camere, autorități de reglementare) pentru FR, IT, ES, PT, NL, SE
2. Junction links `legal_form_bodies` care leagă fiecare formă juridică de body-urile relevante

## SCHEMA EXACTĂ — NU modifica, NU adăuga coloane

```sql
CREATE TABLE professional_bodies (
  code TEXT PRIMARY KEY,
  country_code TEXT NOT NULL,
  name_local TEXT NOT NULL,
  name_en TEXT NOT NULL,
  abbreviation TEXT,
  body_type TEXT NOT NULL CHECK (body_type IN (
    'chamber','bar','institute','inspectorate','council','ministry',
    'register','order','association','board','agency',
    'regulatory_authority','other'
  )),
  website_url TEXT,
  register_url TEXT,
  parent_body_code TEXT REFERENCES professional_bodies(code),
  professions_covered TEXT[],
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE legal_form_bodies (
  legal_form_code TEXT NOT NULL REFERENCES legal_forms(code) ON DELETE CASCADE,
  body_code TEXT NOT NULL REFERENCES professional_bodies(code) ON DELETE CASCADE,
  relationship TEXT NOT NULL CHECK (relationship IN (
    'registration','membership','licensing','supervision','accreditation'
  )),
  is_mandatory BOOLEAN DEFAULT true,
  notes TEXT,
  PRIMARY KEY (legal_form_code, body_code, relationship)
);
```

## LEGAL_FORM CODES PER ȚARĂ (EXISTENTE — referențiază doar aceste coduri!)

### FR (29)
FR-SARL, FR-EURL, FR-SAS, FR-SASU, FR-SA, FR-SNC, FR-SCS, FR-SE, FR-EEIG, FR-GIE, FR-SUCC,
FR-EI, FR-MICRO,
FR-MED, FR-DENT, FR-PHARM, FR-ARCHI, FR-VET, FR-AVOC, FR-NOT, FR-INFIRM, FR-SELARL,
FR-ASSOC, FR-FOND, FR-SYND,
FR-SCOP, FR-SCIC,
FR-EPIC, FR-SEM

### IT (22)
IT-SRL, IT-SRLS, IT-SPA, IT-SAPA, IT-SNC, IT-SAS, IT-SS, IT-SE, IT-EEIG, IT-SUCC,
IT-DITTA,
IT-MED, IT-DENT, IT-VET, IT-AVV, IT-NOT, IT-ARCHI, IT-COMM,
IT-ASSOC, IT-FOND,
IT-COOP,
IT-ENTEPU

### ES (19)
ES-SL, ES-SLU, ES-SA, ES-SLP, ES-SC, ES-CB, ES-UTE, ES-AIE, ES-SE, ES-SUCC,
ES-AUTONOMO,
ES-MED, ES-DENT, ES-FARM, ES-AVOC, ES-PSI,
ES-ASOC, ES-FOND,
ES-COOP

### PT (15)
PT-LDA, PT-UNIP, PT-SA, PT-SNC, PT-SCS, PT-SE, PT-EEIG, PT-SUCC,
PT-ENI,
PT-MED, PT-DENT, PT-PSI,
PT-ASOC, PT-FUND,
PT-COOP

### NL (19)
NL-BV, NL-NV, NL-VOF, NL-CV, NL-MAAT, NL-SE, NL-EEIG, NL-SUCC,
NL-EEN,
NL-MED, NL-DENT, NL-PHARM, NL-ARCHI, NL-ADV, NL-NOT, NL-ACCT,
NL-STICHT, NL-VER,
NL-COOP

### SE (21)
SE-AB, SE-AB-PUB, SE-HB, SE-KB, SE-SE, SE-EEIG, SE-FILIAL,
SE-EF,
SE-MED, SE-DENT, SE-PHARM, SE-NURSE, SE-MID, SE-VET, SE-ARK, SE-ADV, SE-AUD,
SE-IDEELL, SE-BRF, SE-STIFT,
SE-EKFOR

## REGULI OBLIGATORII
1. `ON CONFLICT (code) DO NOTHING` pe INSERT professional_bodies
2. `ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING` pe INSERT legal_form_bodies
3. Code format: `{CC}-{ABBREVIATION}` (ex: FR-CNOM, IT-FNOMCeO, ES-CGCOM)
4. Caută pe web URL-urile oficiale pentru fiecare body
5. Per țară include:
   - Registru comercial (register)
   - Autoritate fiscală (regulatory_authority)
   - Ordin medici (order/chamber)
   - Ordin dentiști
   - Ordin farmaciști
   - Ordin veterinari
   - Barou avocați (bar)
   - Cameră notari
   - Ordin arhitecți
   - Cameră contabili/auditori
   - Autoritate SSM/muncă (regulatory_authority)
   - Autoritate PSI/pompieri (regulatory_authority)
   - Autoritate sanitară (regulatory_authority)
   - Alte ordine relevante pentru formele juridice existente
6. Junction `legal_form_bodies`: leagă FIECARE formă juridică de body-urile relevante
   - Toate formele comerciale → registru + fiscală + SSM
   - Profesii medicale → ordin profesional + sanitară + fiscală
   - Avocați → barou + fiscală
   - etc.
7. body_type corect:
   - Ordine profesionale = 'order' sau 'chamber'
   - Barouri = 'bar'
   - Registre = 'register'
   - Autorități de stat = 'regulatory_authority'
8. Fișierul SQL trebuie să fie self-contained, gata de copy-paste în Supabase SQL Editor
9. La final adaugă query de verificare:
```sql
SELECT country_code, COUNT(*) as bodies FROM professional_bodies 
WHERE country_code IN ('FR','IT','ES','PT','NL','SE') GROUP BY country_code ORDER BY country_code;

SELECT pb.country_code, COUNT(*) as junctions FROM legal_form_bodies lfb
JOIN professional_bodies pb ON pb.code = lfb.body_code
WHERE pb.country_code IN ('FR','IT','ES','PT','NL','SE') GROUP BY pb.country_code ORDER BY pb.country_code;
```

## EXEMPLU FORMAT (din RO deja executat)

```sql
INSERT INTO professional_bodies (
  code, country_code, name_local, name_en, abbreviation,
  body_type, website_url, register_url, parent_body_code,
  professions_covered, notes
) VALUES
('RO-CMR', 'RO',
 'Colegiul Medicilor din România',
 'Romanian College of Physicians', 'CMR',
 'order',
 'https://www.cmr.ro',
 'https://www.cmr.ro/registrul-medicilor/',
 NULL,
 ARRAY['medic','medic specialist'],
 'Legea 95/2006. Înscriere obligatorie.')
ON CONFLICT (code) DO NOTHING;

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes) VALUES
('RO-CMI', 'RO-CMR', 'membership', true, 'Medic titular = membru CMR obligatoriu')
ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;
```

## EXECUȚIE
Generează DIRECT fișierul SQL complet. NU întreba. NU propune variante. EXECUTĂ.
Salvează ca: B1_bodies_FR_IT_ES_PT_NL_SE.sql
