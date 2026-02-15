# S-S-M.RO Legal Forms Ecosystem — Context Document
## Last Updated: 16 Feb 2026, Session Bodies+Tax Multi-Agent
## Version: v8

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
| professional_bodies | 16 | ✅ Live |
| legal_form_bodies | 5 | ✅ Live |
| legal_acts_monitor | — | ✅ Created (M7, 9 acte seed) |

### Row Counts (VERIFIED 16 Feb 2026)
| Table | Count | Breakdown |
|-------|-------|-----------|
| legal_forms | **797** ✅ | 34 țări complete |
| professional_bodies | **474** ✅ | 34 țări complete |
| legal_form_bodies | **1678** ✅ | 31 țări (⚠️ GR/CY/RS junctions pending) |
| legal_form_tax_info | **~302** ✅ | 34 țări complete |

### Professional Bodies per Country (474 total)
| Country | Bodies | Country | Bodies | Country | Bodies | Country | Bodies |
|---------|--------|---------|--------|---------|--------|---------|--------|
| AT | 13 | EE | 14 | IS | 9 | MT | 13 |
| BE | 14 | ES | 12 | IT | 12 | NL | 13 |
| BG | 11 | FI | 13 | LI | 13 | NO | 12 |
| CH | 13 | FR | 14 | LT | 15 | PL | 11 |
| CY | 15 | GR | 15 | LU | 13 | PT | 13 |
| CZ | 16 | HR | 20 | LV | 14 | RO | 30 |
| DE | 10 | HU | 8 | ME | 13 | RS | 15 |
| DK | 14 | IE | 13 | MK | 13 | SE | 14 |
|  |  |  |  |  |  | SI | 18 |
|  |  |  |  |  |  | SK | 18 |

### Junctions per Country (1678 total)
| Country | Junctions | Country | Junctions | Country | Junctions |
|---------|-----------|---------|-----------|---------|-----------|
| AT | 26 | FR | 79 | ME | 72 |
| BE | 64 | HR | 63 | MK | 72 |
| BG | 24 | HU | 8 | MT | 62 |
| CH | 55 | IE | 55 | NL | 54 |
| CZ | 29 | IS | 54 | NO | 69 |
| DE | 17 | IT | 57 | PL | 20 |
| DK | 70 | LI | 52 | PT | 42 |
| EE | 58 | LT | 73 | RO | 101 |
| ES | 51 | LU | 59 | SE | 61 |
| FI | 63 | LV | 61 | SI | 70 |
| ⚠️ GR, CY, RS: bodies exist but junctions pending | | SK | 37 |

### Tax Info per Country (~302 total)
| Country | Rows | Country | Rows | Country | Rows |
|---------|------|---------|------|---------|------|
| AT | ~5 | FI | 6 | ME | 6 |
| BE | 6 | FR | 13 | MK | 6 |
| BG | 23 | GR | 6 | MT | 6 |
| CH | 6 | HR | ~5 | NL | 7 |
| CY | 5 | HU | 18 | NO | 6 |
| CZ | ~5 | IE | 7 | PL | 20 |
| DE | 23 | IS | 6 | PT | 7 |
| DK | 6 | IT | 10 | RO | 28 |
| EE | 6 | LI | 6 | RS | 6 |
| ES | 7 | LT | 7 | SE | 6 |
|  |  | LU | 7 | SI | ~5 |
|  |  | LV | 6 | SK | ~5 |

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
10. R1-P4_PART1_COMMERCIAL.sql              — 59 forme AT/CZ/SK/SI/HR
11. R1-P4-PART2_PROFESSIONS_VERIFIED.sql    — 52 profesii AT/CZ/SK/SI/HR
12. R1-P5_GR_CY_RS_MK_ME.sql               — ~122 forme GR/CY/RS/MK/ME
13. R1-P6_IE_CH_LU_LI_MT_BE.sql            — 122 forme IE/CH/LU/LI/MT/BE
14. R1-P7_LT_LV_EE.sql                     — 68 forme LT/LV/EE
15. RO_professional_bodies.sql              — 30 RO bodies + 101 junctions ✅ 15 Feb
16. RO_legal_form_tax_info.sql              — 28 RO tax_info (2026 fiscal) ✅ 15 Feb
17. B1_bodies_FR_IT_ES_PT_NL_SE.sql         — 78 bodies + 344 junctions ✅ 16 Feb
18. B2_SAFE.sql                             — DK/FI/NO/IS/AT/CZ bodies + junctions ✅ 16 Feb
19. B3_SAFE.sql                             — SK/SI/HR/GR/CY/RS bodies + junctions ✅ 16 Feb
20. B4_bodies_MK_ME_IE_CH_LU_LI.sql        — MK/ME/IE/CH/LU/LI bodies + junctions ✅ 16 Feb
21. B5_FIXED.sql                            — MT/BE/LT/LV/EE bodies + junctions ✅ 16 Feb
22. T1_tax_FR_IT_ES_PT_NL_SE_DK_FI_NO_IS.sql — 10 țări tax_info ✅ 16 Feb
23. T2_FIXED_AT_CZ_SK_SI_HR.sql            — 5 țări tax_info ✅ 16 Feb
24. T2b_tax_GR_CY_RS_MK_ME.sql             — 5 țări tax_info ✅ 16 Feb
25. T3_FIXED_IE_CH_LU_LI_MT_BE_LT_LV_EE.sql — 9 țări tax_info ✅ 16 Feb
26. Deduplicare tax_info                     — DELETE duplicates ✅ 16 Feb
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

### FR-EE (celelalte 29 țări) — ✅ LIVE (vezi v6 pt coduri complete)

---

## RO PROFESSIONAL BODY CODES (30)

### Ordine profesionale (19)
RO-CMR, RO-OAMGMAMR, RO-CMDR, RO-CFR, RO-CMVRO, RO-OBBCSSR,
RO-UNBR, RO-UNNPR, RO-UNEJ, RO-UNPIR,
RO-CECCAR, RO-CAFR, RO-ANEVAR, RO-CCF-BODY,
RO-OAR, RO-CPR, RO-ONCGC, RO-MJ-TRAD, RO-CM-MED

### Autorități reglementare (10)
RO-ITM, RO-ISU, RO-DSP, RO-ANAF, RO-ANRE, RO-ANCOM, RO-ASF, RO-BNR, RO-ISC, RO-ISCIR

### Registru (1)
RO-ONRC

---

## RO FISCAL THRESHOLDS 2026 (VERIFIED)

| Indicator | Valoare | Sursă |
|-----------|---------|-------|
| TVA standard | 21% (de la 1 aug 2025) | Legea 141/2025 |
| TVA redus | 11% (cotă unică) | Legea 141/2025 |
| Plafon scutire TVA | 395.000 RON | OG 22/2025 |
| Impozit profit | 16% | Cod Fiscal |
| Impozit micro | 1% (cotă unică, plafon 100K EUR) | OUG 89/2025 + OUG 156/2024 |
| IMCA | 0,5% (firme >50M EUR) | Legea 239/2025 |
| Impozit dividende | 16% (PJ→PJ și PJ→PF) | Legea 141/2025 |
| CAS angajat | 25% din brut | Cod Fiscal |
| CASS angajat | 10% din brut | Cod Fiscal |
| Impozit salariu | 10% | Cod Fiscal |
| CAM angajator | 2,25% din brut | Cod Fiscal |
| Salariu minim | 4.050 RON (ian-iun) / 4.325 RON (iul-dec) | HG |
| Capital minim SRL | 1 RON (sau 5.000 RON dacă CA>400K) | Legea 239/2025 |
| PFA CAS | 25% peste 12 SM, plafonat 24 SM | Cod Fiscal |
| PFA CASS | 10%, minim 6 SM, plafon 72 SM | Cod Fiscal |

---

## GAPS & KNOWN ISSUES

1. **Junctions GR/CY/RS**: Bodies există (15/15/15) dar legal_form_bodies = 0. B3 agent nu a generat junctions pentru aceste 3 țări.
2. **SK-ADVOKAT, CZ-USTRAV, SI-Ustanova**: Coduri în DOC1 dar lipsesc din legal_forms. Junctions spre ele sunt skipped.
3. **AT/CZ/SK/SI/HR profession codes**: Unele coduri profesionale (AT-ARZT, SK-DANPOR etc.) nu sunt în legal_forms. Junctions skipped cu EXCEPTION handler.
4. **Tax info duplicate check**: Rulat DELETE deduplicare, dar verifică periodic.

---

## M7 LEGISLATIVE MONITOR STATUS

| Component | Status |
|-----------|--------|
| legal_acts_monitor tabel | ✅ Creat, 9 acte seed |
| M7-001-migration-SAFE.sql | ✅ Gata de rulat |
| ro-adapter.ts | ✅ Scris, aliniat la schema reală |
| ro-soap-client.ts | ⚠️ Prompt gata, neexecutat |
| ro-html-parser.ts | ⚠️ Prompt gata, neexecutat |
| change-detector.ts | ⚠️ Prompt gata, neexecutat |
| notification-service.ts | ⚠️ Prompt gata, neexecutat |
| cron extend | ⚠️ Neexecutat |
| Chat M7 | https://claude.ai/chat/990e2318-08a2-4294-9deb-708cece1e2f0 |

---

## NEXT STEPS (Priority Order)

| # | Task | Status | Efort |
|---|------|--------|-------|
| 1 | ~~R1 legal_forms 34 țări~~ | ✅ DONE (797) | — |
| 2 | ~~R1 professional_bodies 34 țări~~ | ✅ DONE (474) | — |
| 3 | ~~R1 legal_form_bodies junctions~~ | ✅ 31/34 (1678) | — |
| 4 | ~~R2 legal_form_tax_info 34 țări~~ | ✅ DONE (~302) | — |
| 5 | ~~RO Bodies + RO Tax 2026~~ | ✅ DONE | — |
| 6 | Fix junctions GR/CY/RS | 🟡 TODO | 1h |
| 7 | Fix missing legal_forms codes (SK-ADVOKAT etc.) | 🟡 TODO | 30min |
| 8 | **M7 Legislative Monitor deploy** | 🟡 NEXT | 2h |
| 9 | R2 Payroll Pack — contribution breakdowns | 🟠 LATER | 4h |
| 10 | R3 Incorporation — legal_form_incorporation | 🟠 LATER | 6h |
| 11 | R4 Treaties/Licenses/Quals | 🟠 LATER | 10h |

---

## PLATFORM STATUS SUMMARY (16 Feb 2026)

| Metric | Valoare |
|--------|---------|
| Features live | ~38/107 |
| Tabele Supabase | ~69 public |
| legal_acts | 105 (22 cu full extracție) |
| legal_obligations | 65 |
| legal_forms | **797** ✅ (34 țări) |
| professional_bodies | **474** ✅ (34 țări) |
| legal_form_bodies | **1678** (31 țări, 3 pending) |
| legal_form_tax_info | **~302** ✅ (34 țări) |
| Pipeline M1-M5 | ✅ LIVE pe producție |
| Pipeline M6 | ⚠️ Cod creat, NE-deployat |
| Pipeline M7 | ⚠️ Arhitectură gata, deploy pending |
| TypeScript build | ⚠️ ignoreBuildErrors = true |
