# AGENT B2 — Professional Bodies: DK, FI, NO, IS, AT, CZ
# Rulează cu: claude-code --model claude-sonnet-4-5-20250929
# Output: B2_bodies_DK_FI_NO_IS_AT_CZ.sql

## CONTEXT
Construiesc o bază de date PostgreSQL (Supabase) cu corpuri profesionale și autorități de reglementare per țară, pentru o platformă de conformitate SSM/PSI europeană (s-s-m.ro). Tabelul `legal_forms` există deja populat. Tabelul `professional_bodies` și `legal_form_bodies` (junction M2M) există deja cu date pentru RO, BG, HU, DE, PL.

## TASK
Generează un fișier SQL unic (`B2_bodies_DK_FI_NO_IS_AT_CZ.sql`) care inserează:
1. Professional bodies (ordine profesionale, camere, autorități de reglementare) pentru DK, FI, NO, IS, AT, CZ
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

### DK (22)
DK-APS, DK-AS, DK-PS, DK-IS, DK-KS, DK-SE, DK-EEIG, DK-FILIAL,
DK-EV,
DK-MED, DK-DENT, DK-PHARM, DK-NURSE, DK-MID, DK-VET, DK-ARK, DK-ADV, DK-REVI,
DK-FORENING, DK-FOND,
DK-AMBA,
DK-SOV

### FI (20)
FI-OY, FI-OYJ, FI-AY, FI-KY, FI-SE, FI-EEIG, FI-SIVU,
FI-TMI,
FI-MED, FI-DENT, FI-PHARM, FI-NURSE, FI-MID, FI-VET, FI-ARK, FI-ASIAN, FI-REVI,
FI-YHD, FI-SAATIO,
FI-OSK

### NO (22)
NO-AS, NO-ASA, NO-ANS, NO-DA, NO-SE, NO-EOFG, NO-NUF, NO-FILIAL,
NO-ENK,
NO-MED, NO-DENT, NO-PHARM, NO-NURSE, NO-MID, NO-VET, NO-ARK, NO-ADV, NO-REVI,
NO-FOR, NO-STI,
NO-SA, NO-BRL

### IS (18)
IS-EHF, IS-HF, IS-SE, IS-EEIG, IS-FILIAL,
IS-EINST,
IS-MED, IS-DENT, IS-PHARM, IS-NURSE, IS-MID, IS-VET, IS-ARK, IS-LOGM, IS-ENDUR,
IS-FELAG, IS-SJODUR,
IS-SAMV

### AT (21)
AT-GMBH, AT-AG, AT-OG, AT-KG, AT-SE, AT-SUCC, AT-EU, AT-VEREIN, AT-PSG, AT-GENO,
AT-ARZT, AT-ZAHN, AT-APOTH, AT-PFLEGE, AT-HEB, AT-TIER, AT-ARCH, AT-RA, AT-STB, AT-WP,
AT-NOT, AT-PSYTHER, AT-PSYCH, AT-PHYSIO, AT-ZTGEO, AT-ZTING, AT-MEDIATOR, AT-BIBU, AT-PATENT, AT-SACHV, AT-DOLM

### CZ (22)
CZ-SRO, CZ-AS, CZ-VOS, CZ-KS, CZ-DRUZ, CZ-SE, CZ-SUCC, CZ-OSVC, CZ-SPOLEK, CZ-NADACE, CZ-USTRAV, CZ-OBEC, CZ-PO,
CZ-LEKAR, CZ-ZUB, CZ-LEKARNIK, CZ-SESTRA, CZ-ARCH, CZ-VET, CZ-ADVOKAT,
CZ-NOTAR, CZ-EXEKUTOR, CZ-AUDITOR, CZ-DANPOR, CZ-PORODASI, CZ-INZAUT, CZ-ZUIG, CZ-TLUMOC, CZ-ZNALEC

## REGULI OBLIGATORII
1. `ON CONFLICT (code) DO NOTHING` pe INSERT professional_bodies
2. `ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING` pe INSERT legal_form_bodies
3. Code format: `{CC}-{ABBREVIATION}` (ex: DK-STPS, FI-VALVIRA, NO-HELSETILSYNET)
4. Caută pe web URL-urile oficiale pentru fiecare body
5. Per țară include MINIM:
   - Registru comercial (register)
   - Autoritate fiscală (regulatory_authority)
   - Ordin/autoritate medici (order/chamber)
   - Ordin/autoritate dentiști
   - Ordin farmaciști
   - Ordin veterinari
   - Barou avocați (bar)
   - Cameră notari (dacă există)
   - Ordin arhitecți
   - Cameră contabili/auditori
   - Autoritate SSM/muncă (regulatory_authority)
   - Autoritate PSI/pompieri (regulatory_authority)
   - Autoritate sanitară (regulatory_authority)
6. Junction `legal_form_bodies`: leagă FIECARE formă juridică de body-urile relevante
   - Toate formele comerciale → registru + fiscală + SSM
   - Profesii medicale → ordin profesional + sanitară + fiscală
   - Avocați → barou + fiscală
7. body_type corect: ordine='order'/'chamber', barouri='bar', registre='register', autorități stat='regulatory_authority'
8. Fișierul SQL = self-contained, gata de copy-paste în Supabase SQL Editor
9. La final adaugă query de verificare:
```sql
SELECT country_code, COUNT(*) as bodies FROM professional_bodies 
WHERE country_code IN ('DK','FI','NO','IS','AT','CZ') GROUP BY country_code ORDER BY country_code;

SELECT pb.country_code, COUNT(*) as junctions FROM legal_form_bodies lfb
JOIN professional_bodies pb ON pb.code = lfb.body_code
WHERE pb.country_code IN ('DK','FI','NO','IS','AT','CZ') GROUP BY pb.country_code ORDER BY pb.country_code;
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
Salvează ca: B2_bodies_DK_FI_NO_IS_AT_CZ.sql
