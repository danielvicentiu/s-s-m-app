# S-S-M.RO Legal Forms Ecosystem — Context Document
## Last Updated: 15 Feb 2026, Session RO-Complete (Bodies + Tax)
## Version: v7

---

## DATABASE STATUS (Supabase Production)

### Tables Created (schema-6-tables.sql)
| Table | Columns | Status |
|-------|---------|--------|
| legal_forms | 23 | ✅ Live |
| legal_form_tax_info | 25 | ✅ Live |
| legal_form_incorporation | 45+ | ✅ Empty |
| tax_treaties | 12 | ✅ Empty |
| sector_licenses | 18 | ✅ Empty |
| qualification_recognition_paths | 22 | ✅ Empty |
| professional_bodies | 16 | ✅ Live (from 001_migration + RO) |
| legal_form_bodies | 5 | ✅ Live (from 001_migration + RO) |

### Row Counts
| Table | Count | Breakdown |
|-------|-------|-----------|
| legal_forms | **797** ✅ | RO=74, BG=26, HU=18, DE=25, PL=24, FR=29, IT=22, ES=19, PT=15, NL=19, SE=21, DK=22, FI=20, NO=22, IS=18, AT=21, CZ=22, SK=22, SI=21, HR=25, GR=~20, CY=~20, RS=~20, MK=~20, ME=~22 (R1-P5), IE=20, CH=21, LU=21, LI=20, MT=20, BE=20 (R1-P6), LT=25, LV=22, EE=21 (R1-P7) |
| professional_bodies | **70** | BG=11, HU=8, DE=10, PL=11, **RO=30** (20 ordine/corpuri + 10 regulatory_authority + 1 register) ⚠️ restul țărilor = PENDING |
| legal_form_bodies | **170** | BG/HU/DE/PL=69, **RO=101** ⚠️ restul țărilor = PENDING |
| legal_form_tax_info | **112** | BG=23, HU=18, DE=23, PL=20, **RO=28** ⚠️ restul = PENDING |

---

## FILES EXECUTED IN SUPABASE (in order)

```
 1. schema-6-tables.sql                      — 6 tables + indexes + triggers
 2. legal-forms-schema-ro.sql                — 74 RO legal_forms seed
 3. 001_professional_bodies_MIGRATION.sql     — CREATE professional_bodies + legal_form_bodies
 4. R1-P1_CONSOLIDATED.sql                   — 74 legal_forms (BG 19, HU 15, DE 21, PL 19)
 5. R1-P1-P2_PROFESSIONAL_BODIES.sql         — 40 bodies + 61 junctions
 6. R1-P1-P2_ADDITIONS.sql                   — 9 legal_forms + 8 junctions
 7. R2-P1_TAX_INFO_CONSOLIDATED.sql          — 10 prereq legal_forms + 84 tax_info rows
 8. R1-P2_CONSOLIDATED.sql                   — 104 legal_forms (FR 29, IT 22, ES 19, PT 15, NL 19)
 9. R1-P3_CONSOLIDATED.sql                   — 103 legal_forms (SE 21, DK 22, FI 20, NO 22, IS 18)
10. R1-P4_PART1_COMMERCIAL.sql              — 59 forme AT/CZ/SK/SI/HR ✅ EXECUTAT
11. R1-P4-PART2_PROFESSIONS_VERIFIED.sql    — 52 profesii AT/CZ/SK/SI/HR ✅ EXECUTAT
12. R1-P5_GR_CY_RS_MK_ME.sql               — ~122 forme GR/CY/RS/MK/ME ✅ EXECUTAT
13. R1-P6_IE_CH_LU_LI_MT_BE.sql            — 122 forme IE/CH/LU/LI/MT/BE ✅ EXECUTAT 15 Feb 2026
14. R1-P7_LT_LV_EE.sql                     — 68 forme LT/LV/EE ✅ EXECUTAT 15 Feb 2026
15. RO_professional_bodies.sql              — 30 RO bodies (20 ordine + 10 reg.auth + 1 register) + 101 junctions ✅ EXECUTAT 15 Feb 2026
16. RO_legal_form_tax_info.sql              — 28 RO tax_info rows (date fiscale 2026) ✅ EXECUTAT 15 Feb 2026
```

---

## EXISTING LEGAL_FORM CODES

### RO (74) — ✅ LIVE
RO-SRL, RO-SRLD, RO-SA, RO-SNC, RO-SCS, RO-SCA, RO-SE, RO-GIE, RO-GEIE,
RO-PFA, RO-II, RO-IF,
RO-CMI, RO-CMG, RO-CMA, RO-SCP-MED, RO-CMD, RO-LAB-MED,
RO-BIF, RO-FARM,
RO-CAB-AV, RO-CAB-AV-AS, RO-SCA-AV, RO-SPARL,
RO-BN, RO-BNA, RO-SCPN,
RO-BEJ, RO-BEJA, RO-SCPEJ,
RO-BM, RO-SCP-MED2,
RO-CEC, RO-SCP-EC, RO-CCON, RO-CAB-AUD, RO-SOC-AUD, RO-CCF, RO-SCP-CF,
RO-BA, RO-BAA, RO-SCP-ARH,
RO-CPI, RO-CPA, RO-SCP-PSI,
RO-CVA, RO-CVG, RO-SCP-VET,
RO-BGC, RO-SCP-GEO, RO-BEV, RO-SOC-EV,
RO-BDP, RO-TRAD, RO-PIL, RO-SCP-INS,
RO-CAB-AMG, RO-CAB-MOASA,
RO-ASOC, RO-FUND, RO-FED, RO-SIND, RO-PATR, RO-PART, RO-CULT, RO-HOA,
RO-COOP, RO-COOP-CR, RO-COOP-AGR, RO-GAL,
RO-RA, RO-IP, RO-CN, RO-SP

### BG (26) — ✅ LIVE
BG-ET, BG-EOOD, BG-OOD, BG-EAD, BG-AD, BG-SD, BG-KD, BG-KDA, BG-DPC, BG-SE,
BG-BRANCH, BG-BULSTAT, BG-EEIG,
BG-MD-SOLO, BG-DENT-SOLO, BG-PHARM-SOLO, BG-LAW-SOLO, BG-NOT, BG-NOTK, BG-BAILIFF,
BG-CPA, BG-PSI, BG-DRUZH, BG-IDES,
BG-NPO-ASSOC, BG-NPO-FOUND, BG-CHITALISHTE, BG-COOP, BG-PUB-MUNI

### HU (18) — ✅ LIVE
HU-EV, HU-KKT, HU-BT, HU-KFT, HU-ZRT, HU-NYRT, HU-SE, HU-BRANCH, HU-EEIG,
HU-MD-SOLO, HU-DENT-SOLO, HU-PHARM, HU-LAW, HU-PATENT, HU-MSUK,
HU-NPO-EGYES, HU-NPO-ALAP, HU-COOP, HU-PUB-MUNI

### DE (25) — ✅ LIVE
DE-EK, DE-GEWERBE, DE-FREIBERUF, DE-GMBH, DE-UG, DE-AG, DE-SE,
DE-OHG, DE-KG, DE-GMBHCOKG, DE-GBR, DE-PARTG, DE-PARTGMBB, DE-EEIG, DE-BRANCH,
DE-MD-SOLO, DE-DENT-SOLO, DE-PHARM, DE-LAW, DE-ING, DE-STB, DE-BINGK,
DE-NPO-EV, DE-NPO-STIFT, DE-COOP, DE-PUB-AOR

### PL (24) — ✅ LIVE
PL-JDG, PL-SC, PL-SPJ, PL-SPP, PL-SPK, PL-SKA, PL-SPZOO, PL-SA, PL-PSA, PL-SE,
PL-BRANCH, PL-EEIG,
PL-MD-SOLO, PL-DENT-SOLO, PL-PHARM, PL-LAW, PL-RADCA, PL-TAX, PL-VET,
PL-KILW, PL-KIRP, PL-KRDP, PL-PIEL,
PL-NPO-ASSOC, PL-NPO-FOUND, PL-COOP, PL-PUB-MUNI

### FR (29) — ✅ LIVE
FR-SARL, FR-EURL, FR-SAS, FR-SASU, FR-SA, FR-SNC, FR-SCS, FR-SE, FR-EEIG, FR-GIE, FR-SUCC,
FR-EI, FR-MICRO,
FR-MED, FR-DENT, FR-PHARM, FR-ARCHI, FR-VET, FR-AVOC, FR-NOT, FR-INFIRM, FR-SELARL,
FR-ASSOC, FR-FOND, FR-SYND,
FR-SCOP, FR-SCIC,
FR-EPIC, FR-SEM

### IT (22) — ✅ LIVE
IT-SRL, IT-SRLS, IT-SPA, IT-SAPA, IT-SNC, IT-SAS, IT-SS, IT-SE, IT-EEIG, IT-SUCC,
IT-DITTA,
IT-MED, IT-DENT, IT-VET, IT-AVV, IT-NOT, IT-ARCHI, IT-COMM,
IT-ASSOC, IT-FOND,
IT-COOP,
IT-ENTEPU

### ES (19) — ✅ LIVE
ES-SL, ES-SLU, ES-SA, ES-SLP, ES-SC, ES-CB, ES-UTE, ES-AIE, ES-SE, ES-SUCC,
ES-AUTONOMO,
ES-MED, ES-DENT, ES-FARM, ES-AVOC, ES-PSI,
ES-ASOC, ES-FOND,
ES-COOP

### PT (15) — ✅ LIVE
PT-LDA, PT-UNIP, PT-SA, PT-SNC, PT-SCS, PT-SE, PT-EEIG, PT-SUCC,
PT-ENI,
PT-MED, PT-DENT, PT-PSI,
PT-ASOC, PT-FUND,
PT-COOP

### NL (19) — ✅ LIVE
NL-BV, NL-NV, NL-VOF, NL-CV, NL-MAAT, NL-SE, NL-EEIG, NL-SUCC,
NL-EEN,
NL-MED, NL-DENT, NL-PHARM, NL-ARCHI, NL-ADV, NL-NOT, NL-ACCT,
NL-STICHT, NL-VER,
NL-COOP

### SE (21) — ✅ LIVE
SE-AB, SE-AB-PUB, SE-HB, SE-KB, SE-SE, SE-EEIG, SE-FILIAL,
SE-EF,
SE-MED, SE-DENT, SE-PHARM, SE-NURSE, SE-MID, SE-VET, SE-ARK, SE-ADV, SE-AUD,
SE-IDEELL, SE-BRF, SE-STIFT,
SE-EKFOR

### DK (22) — ✅ LIVE
DK-APS, DK-AS, DK-PS, DK-IS, DK-KS, DK-SE, DK-EEIG, DK-FILIAL,
DK-EV,
DK-MED, DK-DENT, DK-PHARM, DK-NURSE, DK-MID, DK-VET, DK-ARK, DK-ADV, DK-REVI,
DK-FORENING, DK-FOND,
DK-AMBA,
DK-SOV

### FI (20) — ✅ LIVE
FI-OY, FI-OYJ, FI-AY, FI-KY, FI-SE, FI-EEIG, FI-SIVU,
FI-TMI,
FI-MED, FI-DENT, FI-PHARM, FI-NURSE, FI-MID, FI-VET, FI-ARK, FI-ASIAN, FI-REVI,
FI-YHD, FI-SAATIO,
FI-OSK

### NO (22) — ✅ LIVE
NO-AS, NO-ASA, NO-ANS, NO-DA, NO-SE, NO-EOFG, NO-NUF, NO-FILIAL,
NO-ENK,
NO-MED, NO-DENT, NO-PHARM, NO-NURSE, NO-MID, NO-VET, NO-ARK, NO-ADV, NO-REVI,
NO-FOR, NO-STI,
NO-SA, NO-BRL

### IS (18) — ✅ LIVE
IS-EHF, IS-HF, IS-SE, IS-EEIG, IS-FILIAL,
IS-EINST,
IS-MED, IS-DENT, IS-PHARM, IS-NURSE, IS-MID, IS-VET, IS-ARK, IS-LOGM, IS-ENDUR,
IS-FELAG, IS-SJODUR,
IS-SAMV

### AT (21) — ✅ LIVE
AT-GMBH, AT-AG, AT-OG, AT-KG, AT-SE, AT-SUCC, AT-EU, AT-VEREIN, AT-PSG, AT-GENO,
AT-ARZT, AT-ZAHN, AT-APOTH, AT-PFLEGE, AT-HEB, AT-TIER, AT-ARCH, AT-RA, AT-STB, AT-WP,
AT-NOT, AT-PSYTHER, AT-PSYCH, AT-PHYSIO, AT-ZTGEO, AT-ZTING, AT-MEDIATOR, AT-BIBU, AT-PATENT, AT-SACHV, AT-DOLM

### CZ (22) — ✅ LIVE
CZ-SRO, CZ-AS, CZ-VOS, CZ-KS, CZ-DRUZ, CZ-SE, CZ-SUCC, CZ-OSVC, CZ-SPOLEK, CZ-NADACE, CZ-USTRAV, CZ-OBEC, CZ-PO,
CZ-LEKAR, CZ-ZUB, CZ-LEKARNIK, CZ-SESTRA, CZ-ARCH, CZ-VET, CZ-ADVOKAT,
CZ-NOTAR, CZ-EXEKUTOR, CZ-AUDITOR, CZ-DANPOR, CZ-PORODASI, CZ-INZAUT, CZ-ZUIG, CZ-TLUMOC, CZ-ZNALEC

### SK (22) — ✅ LIVE
SK-SRO, SK-AS, SK-VOS, SK-KS, SK-JSA, SK-SE, SK-SUCC, SK-SZCO, SK-OBZDR, SK-NAD, SK-DRUZ, SK-SP,
SK-ADVOKAT, SK-DANPOR, SK-LEKAR, SK-ARCH, SK-VET,
SK-NOTAR, SK-EXEKUTOR, SK-AUDITOR, SK-FARM, SK-ZUB, SK-SESTRA, SK-PA, SK-GEOD, SK-TLMOCNIK, SK-ZNALEC

### SI (21) — ✅ LIVE
SI-DOO, SI-DD, SI-DNO, SI-KD, SI-SE, SI-SUCC, SI-SP, SI-DRUSTVO, SI-Ustanova, SI-ZADRUGA, SI-JZ,
SI-ODVETNIK, SI-ZDRAVNIK, SI-ARH, SI-VET,
SI-NOTAR, SI-ZOBOZDR, SI-FARM, SI-MEDS, SI-BABICA, SI-INZGR, SI-GEOD, SI-REVIZOR, SI-TOLMAC, SI-IZVED

### HR (25) — ✅ LIVE
HR-DOO, HR-JDOO, HR-DD, HR-JTD, HR-KD, HR-SE, HR-POD, HR-OBRT, HR-UDRUGA, HR-ZAKL, HR-ZADR, HR-JU, HR-TP,
HR-ODVJET, HR-LIJEC, HR-ARH, HR-VET,
HR-JAVBIL, HR-DENT, HR-LJEK, HR-MEDSES, HR-PRIMALJA, HR-OVLING, HR-GEOD, HR-REVIZOR, HR-POREZ, HR-TUMAC, HR-VJEST, HR-PSIH

### GR (~20) — ✅ LIVE (R1-P5)
### CY (~20) — ✅ LIVE (R1-P5)
### RS (~20) — ✅ LIVE (R1-P5)
### MK (~20) — ✅ LIVE (R1-P5)
### ME (~22) — ✅ LIVE (R1-P5)

### IE (20) — ✅ LIVE (R1-P6)
IE-LTD, IE-DAC, IE-PLC, IE-CLG, IE-ULC, IE-SE, IE-LP, IE-EEIG, IE-BRANCH,
IE-SOLE,
IE-MED, IE-DENT, IE-PHARM, IE-NURSE, IE-MID, IE-VET, IE-ARCH, IE-SOL,
IE-CHARITY,
IE-COOP

### CH (21) — ✅ LIVE (R1-P6)
CH-AG, CH-GMBH, CH-KOLL, CH-KOMM, CH-KOMMAG, CH-BRANCH,
CH-EINZEL,
CH-MED, CH-DENT, CH-PHARM, CH-VET, CH-NURSE, CH-HEB, CH-ARCH, CH-RA, CH-STB, CH-REVI,
CH-VEREIN, CH-STIFTUNG,
CH-GENO,
CH-PUB

### LU (21) — ✅ LIVE (R1-P6)
LU-SARL, LU-SARLS, LU-SA, LU-SAS, LU-SCA, LU-SENC, LU-SCS, LU-SCSP, LU-SE, LU-BRANCH,
LU-EI,
LU-MED, LU-DENT, LU-PHARM, LU-VET, LU-ARCH, LU-AVT, LU-NOT,
LU-ASBL, LU-FOND,
LU-SC

### LI (20) — ✅ LIVE (R1-P6)
LI-AG, LI-GMBH, LI-ANSTALT, LI-STIFTUNG, LI-TRUST, LI-KOMMAG, LI-BRANCH,
LI-EINZEL,
LI-MED, LI-DENT, LI-PHARM, LI-VET, LI-NURSE, LI-HEB, LI-ARCH, LI-RA, LI-TREUH,
LI-VEREIN,
LI-GENO,
LI-PUB

### MT (20) — ✅ LIVE (R1-P6)
MT-LTD, MT-PLC, MT-ENC, MT-ECOMM, MT-SE, MT-EEIG, MT-BRANCH, MT-CELL,
MT-SOLE,
MT-MED, MT-DENT, MT-PHARM, MT-NURSE, MT-MID, MT-VET, MT-ARCH, MT-AVV, MT-NOT,
MT-VOL,
MT-COOP

### BE (20) — ✅ LIVE (R1-P6)
BE-SRL, BE-SA, BE-SNC, BE-SCOMM, BE-MAAT, BE-SE, BE-EEIG, BE-BRANCH,
BE-INDEP,
BE-MED, BE-DENT, BE-PHARM, BE-NURSE, BE-MID, BE-VET, BE-ARCH, BE-AVT,
BE-ASBL, BE-FOND,
BE-SC

### LT (25) — ✅ LIVE (R1-P7)
LT-UAB, LT-AB, LT-MB, LT-TUB, LT-KUB, LT-SE, LT-EEIG, LT-BRANCH,
LT-II, LT-IV, LT-VERSLO,
LT-MED, LT-DENT, LT-PHARM, LT-NURSE, LT-MID, LT-VET, LT-ARCH, LT-ADV, LT-NOT, LT-AUD,
LT-ASOC, LT-VBI, LT-FOND,
LT-COOP

### LV (22) — ✅ LIVE (R1-P7)
LV-SIA, LV-AS, LV-PS, LV-KS, LV-SE, LV-EEIG, LV-BRANCH,
LV-IK,
LV-MED, LV-DENT, LV-PHARM, LV-NURSE, LV-MID, LV-VET, LV-ARCH, LV-ADV, LV-NOT, LV-BAILIFF,
LV-BIEDR, LV-NODIB,
LV-COOP,
LV-PUB

### EE (21) — ✅ LIVE (R1-P7)
EE-OU, EE-AS, EE-TU, EE-UU, EE-SE, EE-EEIG, EE-BRANCH,
EE-FIE,
EE-MED, EE-DENT, EE-PHARM, EE-NURSE, EE-MID, EE-VET, EE-ARCH, EE-ADV, EE-NOT,
EE-MTU, EE-SA,
EE-TULIST,
EE-PUB

---

## EXISTING PROFESSIONAL_BODY CODES (70) — RO/BG/HU/DE/PL

### RO (30) — ✅ LIVE (RO-Complete session)
**Ordine profesionale (19):**
RO-CMR, RO-OAMGMAMR, RO-CMDR, RO-CFR, RO-CMVRO, RO-OBBCSSR,
RO-UNBR, RO-UNNPR, RO-UNEJ, RO-UNPIR,
RO-CECCAR, RO-CAFR, RO-ANEVAR, RO-CCF,
RO-OAR, RO-CPR, RO-ONCGC, RO-MJ-TRAD, RO-CM

**Autorități de reglementare (10):**
RO-ITM, RO-ISU, RO-DSP, RO-ANAF, RO-ANRE, RO-ANCOM, RO-ASF, RO-BNR, RO-ISC, RO-ISCIR

**Registre (1):**
RO-ONRC

### BG (11)
BG-TR, BG-BZS, BG-BPHU, BG-NOTK, BG-CHSI, BG-BAK, BG-IDES, BG-KAB, BG-BLS, BG-KNSB, BG-BULSTAT-REG

### HU (8)
HU-MOK, HU-MGYK, HU-MUK, HU-MKVK, HU-MEK, HU-MSZ, HU-OTSZ, HU-SZABKAM

### DE (10)
DE-BRAK, DE-BNOTK, DE-BSTBK, DE-IDW, DE-BAK, DE-BINGK, DE-ABDA, DE-KBV, DE-KZBV, DE-HR

### PL (11)
PL-NRA, PL-KIRP-BODY, PL-KRN, PL-KRDP-BODY, PL-NRL, PL-NIL, PL-NRL-VET, PL-PIIB, PL-PIBR, PL-KRS, PL-CEIDG

---

## RO TAX INFO — FORME ACOPERITE (28)

RO-SRL, RO-SRLD, RO-SA, RO-SNC, RO-SCS, RO-SCA, RO-SE, RO-GIE,
RO-PFA, RO-II, RO-IF,
RO-CMI, RO-CMD, RO-FARM,
RO-CAB-AV, RO-SCA-AV, RO-BN,
RO-CEC, RO-CAB-AUD, RO-CCF,
RO-ASOC, RO-FUND, RO-FED,
RO-COOP,
RO-RA, RO-IP, RO-CN, RO-SP

---

## VERIFIED FISCAL THRESHOLDS 2025-2026

| Country | VAT Standard | VAT Reduced | VAT Threshold | CIT | Micro | Dividend | Social Employer | Social Employee |
|---------|-------------|-------------|---------------|-----|-------|----------|----------------|-----------------|
| **RO** | **21%** (aug 2025) | **11%** | **395.000 RON** (sept 2025) | **16%** | **1% unic** (plafon 100K EUR) | **16%** (ian 2026) | CAM 2,25% | CAS 25% + CASS 10% |
| BG | 20% | 9% | 100k BGN / 51130 EUR (Apr 2025) | 10% flat | N/A | 5% WHT | ~18.92% | ~13.78% |
| HU | 27% | 5%/18% | 18M HUF (from 2025) | 9% | N/A | 15%+13% SZOCHO | 13% SZOCHO | 18.5% TB |
| DE | 19% | 7% | 25k/100k EUR (Kleinunternehmer 2025) | 15.825%+GewSt | N/A | 26.375% KapESt | ~20% | ~20% |
| PL | 23% | 5%/8% | 200k PLN | 9%/19% | N/A | 19% | ~20.48% | ~13.71% |

**RO Legislație fiscală 2026 (surse verificate 15 feb 2026):**
- Legea 141/2025 (Pachetul 1): TVA 21%, dividende 16%
- Legea 239/2025 (Pachetul 2): IMCA 0,5%, capital SRL 5K RON pt CA>400K
- OUG 89/2025 (trenuleț): micro cotă unică 1%, eliminare 3%
- OUG 156/2024: plafon micro 100K EUR din 2026
- OG 22/2025: plafon scutire TVA 395.000 RON
- Salariu minim: 4.050 RON (ian-iun), 4.325 RON (iul-dec 2026)

**BG Euro adoption: 1 January 2026 (1 EUR = 1.95583 BGN)**

---

## SCHEMA REFERENCE: legal_forms

```sql
CREATE TABLE legal_forms (
  code TEXT PRIMARY KEY,
  country_code TEXT NOT NULL,
  name_local TEXT NOT NULL,
  name_en TEXT NOT NULL,
  abbreviation TEXT,
  category TEXT NOT NULL CHECK (category IN ('commercial','sole_trader','liberal_profession','nonprofit','public','cooperative')),
  has_legal_personality BOOLEAN DEFAULT true,
  max_employees INTEGER,
  max_associates INTEGER,
  max_caen_codes INTEGER,
  parent_legislation TEXT,
  registration_body TEXT,
  required_credentials TEXT[],         -- ← ARRAY!
  required_documents TEXT[],           -- ← ARRAY!
  professional_body_url TEXT,
  onboarding_checklist JSONB,          -- ← JSONB! format: ["step1","step2"]
  eu_auto_recognition BOOLEAN DEFAULT false,
  eu_recognition_directive TEXT,
  epc_available BOOLEAN DEFAULT false,
  country_specific_code TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**⚠️ IMPORTANT:** `required_credentials` și `required_documents` sunt **TEXT[]** (PostgreSQL ARRAY). Format corect: `'{"item1","item2"}'`. NU plain text! `onboarding_checklist` este **JSONB**: `'["step1","step2"]'`.

---

## SCHEMA REFERENCE: legal_form_tax_info

```sql
CREATE TABLE legal_form_tax_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_form_code TEXT NOT NULL REFERENCES legal_forms(code) ON DELETE CASCADE,
  country_code TEXT NOT NULL,
  vat_required BOOLEAN,
  vat_threshold TEXT,
  vat_rate_standard DECIMAL,
  vat_rate_reduced TEXT,
  default_tax_regime TEXT,
  tax_regime_options TEXT[] DEFAULT '{}',
  corporate_tax_rate TEXT,
  income_tax_rate TEXT,
  dividend_tax_rate TEXT,
  salary_tax_rate TEXT,
  social_contributions_employer TEXT,
  social_contributions_employee TEXT,
  min_capital TEXT,
  offshore_eligible BOOLEAN DEFAULT false,
  special_tax_status TEXT,
  fiscal_reporting TEXT,
  fiscal_authority TEXT,
  fiscal_authority_url TEXT,
  valid_from DATE,
  valid_until DATE,
  last_verified DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## SCHEMA REFERENCE: professional_bodies + junction

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

---

## "DE VERIFICAT" ITEMS

### Din R1-P4 (AT/CZ/SK/SI/HR):
- Multiple items — vezi DOC3 pentru lista completă

### Din R1-P6 (IE/CH/LU/LI/MT/BE):
- **CH-NURSE**: Scope exact bilateral auto-recognition for nurses via AFMP
- **BE-DENT**: Status Ordre des Dentistes (se înființa ca organism separat)
- **LI-ARCH**: Registration body exact și title protection requirements

### Din R1-P7 (LT/LV/EE):
- **GR/CY/RS/MK/ME**: Exact counts de verificat cu `SELECT country_code, COUNT(*) FROM legal_forms WHERE country_code IN ('GR','CY','RS','MK','ME') GROUP BY country_code`

---

## NEXT STEPS (Priority Order Actualizat)

| # | Task | Status | Depends On |
|---|------|--------|------------|
| 1 | ~~R1-P1 — BG/HU/DE/PL legal_forms~~ | ✅ DONE | — |
| 2 | ~~R1-P2 — FR/IT/ES/PT/NL legal_forms~~ | ✅ DONE | — |
| 3 | ~~R1-P3 — SE/DK/FI/NO/IS legal_forms~~ | ✅ DONE | — |
| 4 | ~~R1-P4 — AT/CZ/SK/SI/HR legal_forms~~ | ✅ DONE (111 forme) | — |
| 5 | ~~R1-P5 — GR/CY/RS/MK/ME legal_forms~~ | ✅ DONE (~122 forme) | — |
| 6 | ~~R1-P6 — IE/CH/LU/LI/MT/BE legal_forms~~ | ✅ DONE (122 forme) | — |
| 7 | ~~R1-P7 — LT/LV/EE legal_forms~~ | ✅ DONE (68 forme) | — |
| 8 | ~~RO Bodies + RO Tax~~ | ✅ DONE (30 bodies + 101 junctions + 28 tax) | — |
| 9 | Verificare "De verificat" items din R1-P4/P6/P7 | 🟡 TODO | — |
| 10 | **R1 Professional Bodies — FR/IT/ES/PT/NL** | 🟡 NEXT | — |
| 11 | R1 Professional Bodies — SE/DK/FI/NO/IS | 🟡 TODO | — |
| 12 | R1 Professional Bodies — AT/CZ/SK/SI/HR | 🟡 TODO | — |
| 13 | R1 Professional Bodies — GR/CY/RS/MK/ME + IE/CH/LU/LI/MT/BE + LT/LV/EE | 🟡 TODO | — |
| 14 | R2 Tax Info — FR/IT/ES/PT/NL | 🟡 TODO | — |
| 15 | R2 Tax Info — restul țărilor | 🟡 TODO | — |
| 16 | M7 Legislative Monitor (S1→S2) | 🟠 PLANNED | — |
| 17 | R2 Payroll Pack — contribution breakdowns | 🟠 LATER | Tax info |
| 18 | R3 Incorporation — legal_form_incorporation | 🟠 LATER | All forms |
| 19 | R4 Treaties/Licenses/Quals | 🟠 LATER | All above |

---

## CHAT STRUCTURE FOR CONTINUATION

| Chat Title | Context to Upload | Scope |
|------------|-------------------|-------|
| `LF R1 Bodies — FR/IT/ES/PT/NL` | DOC1 v7 | professional_bodies + legal_form_bodies |
| `LF R1 Bodies — NORDICS` | DOC1 v7 | SE/DK/FI/NO/IS bodies |
| `LF R1 Bodies — CENTRAL EU` | DOC1 v7 | AT/CZ/SK/SI/HR bodies |
| `LF R1 Bodies — REST` | DOC1 v7 | GR/CY/RS/MK/ME + IE/CH/LU/LI/MT/BE + LT/LV/EE |
| `LF R2 Tax — FR/IT/ES` | DOC1 v7 + fiscal data | legal_form_tax_info |
| `M7 Legislative Monitor` | DOC1 v7 | Tabel monitor + Edge Function + cron |

---

## PLATFORM STATUS SUMMARY (15 Feb 2026)

| Metric | Valoare |
|--------|---------|
| Features live | ~38/107 |
| Tabele Supabase | ~69 public |
| legal_acts | 105 (22 cu full extracție) |
| legal_obligations | 65 |
| legal_forms | **797** ✅ (34 țări) |
| professional_bodies | **70** ✅ (5 țări: RO/BG/HU/DE/PL) |
| legal_form_bodies | **170** ✅ (5 țări) |
| legal_form_tax_info | **112** ✅ (5 țări: RO/BG/HU/DE/PL) |
| Țări rămase legal_forms | **0** ✅ R1 COMPLET |
| Țări rămase bodies | **29** (din 34) |
| Țări rămase tax_info | **29** (din 34) |
| Pipeline M1-M5 | ✅ LIVE pe producție |
| Pipeline M6 | ⚠️ Cod creat, NE-deployat |
| Pipeline M7 | 🟡 PLANIFICAT (Legislative Monitor) |
| TypeScript build | ⚠️ ignoreBuildErrors = true |
