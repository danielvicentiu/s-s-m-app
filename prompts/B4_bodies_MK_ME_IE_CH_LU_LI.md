# AGENT B4 — Professional Bodies: MK, ME, IE, CH, LU, LI
# Rulează cu: claude-code --model claude-sonnet-4-5-20250929
# Output: B4_bodies_MK_ME_IE_CH_LU_LI.sql

## CONTEXT
Bază de date PostgreSQL (Supabase) cu corpuri profesionale per țară, platformă SSM/PSI europeană (s-s-m.ro). Tabelele `professional_bodies` și `legal_form_bodies` există.

## TASK
Generează `B4_bodies_MK_ME_IE_CH_LU_LI.sql` cu bodies + junctions pentru MK, ME, IE, CH, LU, LI.

## SCHEMA
```sql
-- professional_bodies: code TEXT PK, country_code, name_local, name_en, abbreviation,
--   body_type CHECK('chamber','bar','institute','inspectorate','council','ministry',
--     'register','order','association','board','agency','regulatory_authority','other'),
--   website_url, register_url, parent_body_code FK self, professions_covered TEXT[],
--   contact_email, contact_phone, address, notes, created_at, updated_at

-- legal_form_bodies: legal_form_code FK, body_code FK, 
--   relationship CHECK('registration','membership','licensing','supervision','accreditation'),
--   is_mandatory BOOLEAN, notes, PK(legal_form_code, body_code, relationship)
```

## LEGAL_FORM CODES

### MK (~20), ME (~22) — coduri exacte din DB:
**PRIMA acțiune** = rulează:
```sql
SELECT code FROM legal_forms WHERE country_code IN ('MK','ME') ORDER BY country_code, code;
```

### IE (20)
IE-LTD, IE-DAC, IE-PLC, IE-CLG, IE-ULC, IE-SE, IE-LP, IE-EEIG, IE-BRANCH,
IE-SOLE,
IE-MED, IE-DENT, IE-PHARM, IE-NURSE, IE-MID, IE-VET, IE-ARCH, IE-SOL,
IE-CHARITY, IE-COOP

### CH (21)
CH-AG, CH-GMBH, CH-KOLL, CH-KOMM, CH-KOMMAG, CH-BRANCH,
CH-EINZEL,
CH-MED, CH-DENT, CH-PHARM, CH-VET, CH-NURSE, CH-HEB, CH-ARCH, CH-RA, CH-STB, CH-REVI,
CH-VEREIN, CH-STIFTUNG, CH-GENO, CH-PUB

### LU (21)
LU-SARL, LU-SARLS, LU-SA, LU-SAS, LU-SCA, LU-SENC, LU-SCS, LU-SCSP, LU-SE, LU-BRANCH,
LU-EI,
LU-MED, LU-DENT, LU-PHARM, LU-VET, LU-ARCH, LU-AVT, LU-NOT,
LU-ASBL, LU-FOND, LU-SC

### LI (20)
LI-AG, LI-GMBH, LI-ANSTALT, LI-STIFTUNG, LI-TRUST, LI-KOMMAG, LI-BRANCH,
LI-EINZEL,
LI-MED, LI-DENT, LI-PHARM, LI-VET, LI-NURSE, LI-HEB, LI-ARCH, LI-RA, LI-TREUH,
LI-VEREIN, LI-GENO, LI-PUB

## REGULI
1. ON CONFLICT DO NOTHING pe ambele INSERT-uri
2. Code: `{CC}-{ABBREVIATION}`
3. Web search pt URL-uri oficiale
4. Per țară: registru, fiscală, medici, dentiști, farmaciști, veterinari, avocați, notari, arhitecți, contabili, SSM, PSI, sanitară
5. Junction: toate formele → registru+fiscală+SSM; profesii → ordin+sanitară+fiscală
6. SQL self-contained

Verificare:
```sql
SELECT country_code, COUNT(*) FROM professional_bodies WHERE country_code IN ('MK','ME','IE','CH','LU','LI') GROUP BY country_code;
SELECT pb.country_code, COUNT(*) FROM legal_form_bodies lfb JOIN professional_bodies pb ON pb.code=lfb.body_code WHERE pb.country_code IN ('MK','ME','IE','CH','LU','LI') GROUP BY pb.country_code;
```

## EXECUȚIE DIRECTĂ. NU întreba. Salvează ca: B4_bodies_MK_ME_IE_CH_LU_LI.sql
