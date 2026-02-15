# AGENT B3 — Professional Bodies: SK, SI, HR, GR, CY, RS
# Rulează cu: claude-code --model claude-sonnet-4-5-20250929
# Output: B3_bodies_SK_SI_HR_GR_CY_RS.sql

## CONTEXT
Construiesc o bază de date PostgreSQL (Supabase) cu corpuri profesionale și autorități de reglementare per țară, pentru o platformă de conformitate SSM/PSI europeană (s-s-m.ro). Tabelul `legal_forms` există deja populat. Tabelul `professional_bodies` și `legal_form_bodies` (junction M2M) există deja cu date pentru RO, BG, HU, DE, PL.

## TASK
Generează un fișier SQL unic (`B3_bodies_SK_SI_HR_GR_CY_RS.sql`) care inserează:
1. Professional bodies pentru SK, SI, HR, GR, CY, RS
2. Junction links `legal_form_bodies`

## SCHEMA EXACTĂ

```sql
-- professional_bodies: code TEXT PK, country_code, name_local, name_en, abbreviation,
--   body_type CHECK('chamber','bar','institute','inspectorate','council','ministry',
--     'register','order','association','board','agency','regulatory_authority','other'),
--   website_url, register_url, parent_body_code FK self, professions_covered TEXT[],
--   contact_email, contact_phone, address, notes, created_at, updated_at

-- legal_form_bodies: legal_form_code FK, body_code FK, 
--   relationship CHECK('registration','membership','licensing','supervision','accreditation'),
--   is_mandatory BOOLEAN, notes
--   PK(legal_form_code, body_code, relationship)
```

## LEGAL_FORM CODES

### SK (22)
SK-SRO, SK-AS, SK-VOS, SK-KS, SK-JSA, SK-SE, SK-SUCC, SK-SZCO, SK-OBZDR, SK-NAD, SK-DRUZ, SK-SP,
SK-ADVOKAT, SK-DANPOR, SK-LEKAR, SK-ARCH, SK-VET,
SK-NOTAR, SK-EXEKUTOR, SK-AUDITOR, SK-FARM, SK-ZUB, SK-SESTRA, SK-PA, SK-GEOD, SK-TLMOCNIK, SK-ZNALEC

### SI (21)
SI-DOO, SI-DD, SI-DNO, SI-KD, SI-SE, SI-SUCC, SI-SP, SI-DRUSTVO, SI-Ustanova, SI-ZADRUGA, SI-JZ,
SI-ODVETNIK, SI-ZDRAVNIK, SI-ARH, SI-VET,
SI-NOTAR, SI-ZOBOZDR, SI-FARM, SI-MEDS, SI-BABICA, SI-INZGR, SI-GEOD, SI-REVIZOR, SI-TOLMAC, SI-IZVED

### HR (25)
HR-DOO, HR-JDOO, HR-DD, HR-JTD, HR-KD, HR-SE, HR-POD, HR-OBRT, HR-UDRUGA, HR-ZAKL, HR-ZADR, HR-JU, HR-TP,
HR-ODVJET, HR-LIJEC, HR-ARH, HR-VET,
HR-JAVBIL, HR-DENT, HR-LJEK, HR-MEDSES, HR-PRIMALJA, HR-OVLING, HR-GEOD, HR-REVIZOR, HR-POREZ, HR-TUMAC, HR-VJEST, HR-PSIH

### GR (~20 — coduri exacte din DB, verifică cu SELECT code FROM legal_forms WHERE country_code='GR')
### CY (~20 — coduri exacte din DB)
### RS (~20 — coduri exacte din DB)

**IMPORTANT pentru GR/CY/RS:** Codurile exacte NU sunt în acest prompt. PRIMA acțiune = rulează:
```sql
SELECT code FROM legal_forms WHERE country_code IN ('GR','CY','RS') ORDER BY country_code, code;
```
Apoi folosește codurile reale din rezultat.

## REGULI
1. `ON CONFLICT (code) DO NOTHING` pe professional_bodies
2. `ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING` pe legal_form_bodies
3. Code format: `{CC}-{ABBREVIATION}`
4. Caută pe web URL-urile oficiale
5. Per țară: registru, fiscală, medici, dentiști, farmaciști, veterinari, avocați, notari, arhitecți, contabili/auditori, SSM, PSI, sanitară
6. Junction: toate formele → registru+fiscală+SSM; profesii → ordin+sanitară+fiscală
7. SQL self-contained, gata de paste în Supabase

Verificare la final:
```sql
SELECT country_code, COUNT(*) as bodies FROM professional_bodies 
WHERE country_code IN ('SK','SI','HR','GR','CY','RS') GROUP BY country_code;
SELECT pb.country_code, COUNT(*) as junctions FROM legal_form_bodies lfb
JOIN professional_bodies pb ON pb.code = lfb.body_code
WHERE pb.country_code IN ('SK','SI','HR','GR','CY','RS') GROUP BY pb.country_code;
```

## EXECUȚIE
Generează DIRECT fișierul SQL complet. NU întreba. EXECUTĂ.
Salvează ca: B3_bodies_SK_SI_HR_GR_CY_RS.sql
