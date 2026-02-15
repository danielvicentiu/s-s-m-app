# AGENT B5 — Professional Bodies: MT, BE, LT, LV, EE
# Rulează cu: claude-code --model claude-sonnet-4-5-20250929
# Output: B5_bodies_MT_BE_LT_LV_EE.sql

## CONTEXT
Bază de date PostgreSQL (Supabase) cu corpuri profesionale per țară, platformă SSM/PSI europeană (s-s-m.ro).

## TASK
Generează `B5_bodies_MT_BE_LT_LV_EE.sql` cu bodies + junctions pentru MT, BE, LT, LV, EE.

## SCHEMA
```sql
-- professional_bodies: code TEXT PK, country_code, name_local, name_en, abbreviation,
--   body_type CHECK('chamber','bar','institute','inspectorate','council','ministry',
--     'register','order','association','board','agency','regulatory_authority','other'),
--   website_url, register_url, parent_body_code FK self, professions_covered TEXT[],
--   contact_email, contact_phone, address, notes

-- legal_form_bodies: legal_form_code FK, body_code FK, 
--   relationship CHECK('registration','membership','licensing','supervision','accreditation'),
--   is_mandatory BOOLEAN, notes, PK(legal_form_code, body_code, relationship)
```

## LEGAL_FORM CODES

### MT (20)
MT-LTD, MT-PLC, MT-ENC, MT-ECOMM, MT-SE, MT-EEIG, MT-BRANCH, MT-CELL,
MT-SOLE,
MT-MED, MT-DENT, MT-PHARM, MT-NURSE, MT-MID, MT-VET, MT-ARCH, MT-AVV, MT-NOT,
MT-VOL, MT-COOP

### BE (20)
BE-SRL, BE-SA, BE-SNC, BE-SCOMM, BE-MAAT, BE-SE, BE-EEIG, BE-BRANCH,
BE-INDEP,
BE-MED, BE-DENT, BE-PHARM, BE-NURSE, BE-MID, BE-VET, BE-ARCH, BE-AVT,
BE-ASBL, BE-FOND, BE-SC

### LT (25)
LT-UAB, LT-AB, LT-MB, LT-TUB, LT-KUB, LT-SE, LT-EEIG, LT-BRANCH,
LT-II, LT-IV, LT-VERSLO,
LT-MED, LT-DENT, LT-PHARM, LT-NURSE, LT-MID, LT-VET, LT-ARCH, LT-ADV, LT-NOT, LT-AUD,
LT-ASOC, LT-VBI, LT-FOND, LT-COOP

### LV (22)
LV-SIA, LV-AS, LV-PS, LV-KS, LV-SE, LV-EEIG, LV-BRANCH,
LV-IK,
LV-MED, LV-DENT, LV-PHARM, LV-NURSE, LV-MID, LV-VET, LV-ARCH, LV-ADV, LV-NOT, LV-BAILIFF,
LV-BIEDR, LV-NODIB, LV-COOP, LV-PUB

### EE (21)
EE-OU, EE-AS, EE-TU, EE-UU, EE-SE, EE-EEIG, EE-BRANCH,
EE-FIE,
EE-MED, EE-DENT, EE-PHARM, EE-NURSE, EE-MID, EE-VET, EE-ARCH, EE-ADV, EE-NOT,
EE-MTU, EE-SA, EE-TULIST, EE-PUB

## REGULI
1. ON CONFLICT DO NOTHING pe ambele INSERT-uri
2. Code: `{CC}-{ABBREVIATION}`
3. Web search pt URL-uri oficiale
4. Per țară: registru, fiscală, medici, dentiști, farmaciști, veterinari, avocați, notari, arhitecți, contabili, SSM, PSI, sanitară
5. Junction: toate formele → registru+fiscală+SSM; profesii → ordin+sanitară+fiscală
6. SQL self-contained

Verificare:
```sql
SELECT country_code, COUNT(*) FROM professional_bodies WHERE country_code IN ('MT','BE','LT','LV','EE') GROUP BY country_code;
SELECT pb.country_code, COUNT(*) FROM legal_form_bodies lfb JOIN professional_bodies pb ON pb.code=lfb.body_code WHERE pb.country_code IN ('MT','BE','LT','LV','EE') GROUP BY pb.country_code;
```

## EXECUȚIE DIRECTĂ. NU întreba. Salvează ca: B5_bodies_MT_BE_LT_LV_EE.sql
