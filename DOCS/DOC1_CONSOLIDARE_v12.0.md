# DOC1_CONSOLIDARE — S-S-M.RO
> **Versiune:** 12.0 | **Data:** 15 Februarie 2026
> **Changelog v12.0:** M5 Publishing LIVE (organization_obligations + publish_batches). Fundația SQL 002 (7 elemente: topic_tags, CAEN N:N, subscribed_countries, practical_interpretation, obligation_translations, notification_preferences, v_obligations_by_country_topic). Build Vercel fixat. Pricing update €350-1200/an. legal_acts: 22→105. DB: 46→49 tabele. Andrei onboarding. Git cleanup 640+ tasks. 27 idei Gemini integrate. SSM-RO-Platform-Overview 2 versiuni.

---

# 1. VIZIUNE ȘI STRATEGIE

## 1.1 Ce este s-s-m.ro
Platformă digitală SaaS de management SSM/PSI pentru firme mici și mijlocii. PWA (Progressive Web App) cu acces de pe orice dispozitiv.

## 1.2 Propunere de valoare
- Conformitate SSM/PSI simplificată — un singur loc
- Acces 24/7 din orice loc (cloud)
- Instruiri de urgență instant (angajat nou → test în 30 min)
- Multilingv (RO, BG, HU, DE, PL, EN — LIVE; apoi NE, VI)
- 20+ ani experiență consultanță → digitalizat în platformă
- Pipeline legislativ automatizat: import text → extracție AI → validare → publishing
- Arhitectură modulară LEGO: 11 module activabile/dezactivabile per organizație
- 🆕 M5 Publishing: obligații aprobate → distribuite automat la organizații

## 1.3 Audiențe (4 segmente)
1. **SME-uri românești** (300K+ angajatori) — target principal
2. **Muncitori străini** (300K+ în RO) — interfață în limba nativă
3. **Consultanți SSM** (1.500+ firme autorizate) — marketplace + tools
4. **Corporate** — enterprise features

## 1.4 Viziune multi-country (45 țări europene)
- **Faza 1 (acum):** România (s-s-m.ro) — produs matur
- **Faza 2 (Q2 2026):** Bulgaria (s-s-m.ro/bg → bzr24.bg), Ungaria (s-s-m.ro/hu)
- **Faza 3 (Q3-Q4 2026):** Germania (as-dig.de), Polonia (bhp24.pl)
- **Faza 4 (2027):** Restul EU (45 țări seed-uite în DB)

---

# 2. ARHITECTURĂ TEHNICĂ

## 2.1 Tech Stack
| Component | Tehnologie | Status |
|-----------|-----------|--------|
| Frontend | Next.js 16.1.4 (Turbopack, App Router) + Tailwind CSS | ✅ LIVE |
| Backend | Supabase (PostgreSQL + Auth + Storage + RLS) | ✅ LIVE |
| Hosting | Vercel Pro (Edge Network, Frankfurt region) | ✅ LIVE |
| Email | Resend (alerte@s-s-m.ro, DKIM+SPF+DMARC) | ✅ LIVE |
| Cron | Vercel Cron (zilnic 08:00) | ✅ LIVE |
| PWA | next-pwa + manifest.json | ✅ LIVE |
| AI | Claude Sonnet 4 API (extracție legislativă) | ✅ LIVE |
| IDE | Cursor + Claude Code | ✅ Activ |
| Repo | GitHub (danielvicentiu/s-s-m-app) | ✅ Activ |
| i18n | next-intl v4.8.2 (path-based routing) | ✅ LIVE |

## 2.2 Supabase Project
- **URL:** uhccxfyvhjeudkexcgiq.supabase.co
- **Folder local:** C:\Dev\s-s-m-app
- **Dashboard:** https://app.s-s-m.ro

## 2.3 Database Schema — 49 tabele

### Tabele CORE (11): organizations, profiles, memberships, employees, locations, medical_records, safety_equipment, notification_log, training_modules, training_assignments, training_sessions

### Tabele RBAC (3): roles (27 roluri), permissions (~210), user_roles

### Tabele PIPELINE LEGISLATIV (5):
| Tabel | Records |
|-------|---------|
| legal_acts | 🆕 105 (era 22) |
| legal_obligations | 65 |
| legal_penalties | 1 |
| legal_cross_references | 22 |
| legal_taxonomy | 92 |

### 🆕 Tabele M5 PUBLISHING (2, create 15 Feb):
| Tabel | Scop | Records |
|-------|------|---------|
| organization_obligations | Obligații publicate per organizație, auto-match + manual | 1 |
| publish_batches | Batch tracking pentru bulk publishing | 0 |

### Tabele CONFIGURABILE (3): obligation_types (~60), alert_categories (~60), equipment_types (~103)

### Tabele OP-LEGO (5): countries (45 țări), module_definitions (11 module), country_module_config (55), organization_modules, organization_module_countries

### 🆕 Tabele FUNDAȚIE SQL 002 (3 noi, 15 Feb):
| Tabel | Scop |
|-------|------|
| organization_caen_codes | N:N organizație↔CAEN, RLS via memberships.role |
| obligation_translations | Traduceri obligații per limbă, verified, AI model |
| notification_preferences | Canale: email, push, Telegram, WhatsApp, SMS |

### 🆕 Coloane noi FUNDAȚIE SQL 002 (15 Feb):
- legal_obligations.topic_tags (TEXT[] + GIN index)
- organizations.subscribed_countries (TEXT[])
- organization_obligations.practical_interpretation (TEXT)

### 🆕 View nou:
- v_obligations_by_country_topic (obligații aprobate + acte + tags per țară)

### Tabele EXTENDED (4+): jurisdictions, authorities, alert_preferences, document_templates
### Tabele REGES (4): reges_connections, reges_outbox, reges_receipts, reges_results
### Alte tabele: audit_log, fraud_alerts, generated_documents, medical_examinations, organized_training_sessions, penalty_rules, penalty_visibility, test_questions, legal_act_modifications, legal_act_translations, legal_jurisprudence, legal_training_requirements

## 2.4 Views și Funcții
- 5 views dashboard + 2 views full + 🆕 v_obligations_by_country_topic
- 🆕 67+ indexuri (64 existente + 3 fundație SQL 002)
- 7 funcții RBAC + 3 funcții OP-LEGO
- ⚠️ RLS: TOATE policies via **memberships.role** (NU profiles.system_role — eroare 42703 fixată 15 Feb)

## 2.5 Arhitectură Multi-Tenant (LIVE)
```
ROUTING: Path-based (next-intl v4.8.2)
  s-s-m.ro/ro → locale=ro, country=RO, currency=RON  ✅
  s-s-m.ro/bg → locale=bg, country=BG, currency=EUR  ✅
  s-s-m.ro/hu → locale=hu, country=HU, currency=HUF  ✅
  s-s-m.ro/de → locale=de, country=DE, currency=EUR  ✅
  s-s-m.ro/pl → locale=pl, country=PL, currency=PLN  ✅
  s-s-m.ro/en → locale=en, country=INT, currency=EUR  ✅

DOMAIN_CONFIG pregătit: bzr24.bg, sst24.hu, as-dig.de, bhp24.pl
```

---

# 3. PIPELINE LEGISLATIV AI (M1-M6) — COMPLET ✅

| Modul | Funcție | Status |
|-------|---------|--------|
| M1 | Import text legislativ (URL fetch + paste manual) | ✅ LIVE |
| M2 | Extracție AI (Claude Sonnet, chunk 50K) | ✅ LIVE |
| M3 | Validator structural (6 checks, scor 0-100) | ✅ LIVE |
| M4 | Preview & aprobare admin (/admin/legal) | ✅ LIVE |
| 🆕 M5 | Publishing organizații (auto-match country/domain/CAEN + manual override) | ✅ LIVE 15 Feb |
| 🆕 M6 | Batch Processing (publish_batches, bulk operations) | ✅ LIVE 15 Feb |

---

# 4. FEATURES

## 4.1 LIVE (38+)
1-37: Tot ce era în v11.0 (dashboard, admin, RBAC, multi-tenant, pipeline M1-M3, OP-LEGO DB, training, alerte, landing pages 5 țări, conținut instruire, etc.)

🆕 Adăugat 12-15 Feb:
| # | Feature | Status |
|---|---------|--------|
| 38 | M5 Publishing (organization_obligations + auto-match) | ✅ LIVE |
| 39 | M6 Batch Processing (publish_batches) | ✅ LIVE |
| 40 | Fundația SQL 002 (topic_tags, CAEN N:N, subscribed_countries, translations, notifications) | ✅ DB LIVE |
| 41 | v_obligations_by_country_topic (view comparații legislative) | ✅ DB LIVE |
| 42 | Build Vercel fixat (8 module lipsă + ignoreBuildErrors) | ✅ LIVE |

## 4.2 PLANIFICAT PRIORITAR
| # | Funcționalitate | Prioritate |
|---|----------------|-----------|
| 43 | Comparații legislative /admin/legal-compare | P1 |
| 44 | CRUD forms complete (replace placeholders) | P1 |
| 45 | Onboarding wizard client ("Adaugă firma") | P1 |
| 46 | Fișă instruire PDF conformă ITM | P0 — MONEY MAKER |
| 47 | OP-LEGO TypeScript middleware (6 fișiere) | P1 |
| 48 | OP-LEGO Pricing seed | P1 |
| 49 | i18n BG complet | P1 |

---

# 5. REVENUE MODEL

## 🆕 5.1 Pricing actualizat (14 Feb 2026 — validat multi-AI)
| Tier | Preț/an | Target |
|------|---------|--------|
| Starter | €350 (~1.750 RON) | Micro-firme 1-9 angajați |
| Professional | €600 (~3.000 RON) | IMM-uri 10-49 angajați |
| Enterprise | €1.200 (~6.000 RON) | 50+ angajați / consultanți |
| Consultant | €200/client | Firme SSM extern |

Add-on: NIS2 ~€150, Audit checklists ~€100, REGES ~€80, Training multilingv ~€120

## 5.2 Prețuri locale landing (actuale pe site)
RO: 990 LEI/an | BG: 199 EUR/an | HU: 74.900 HUF/an | DE: 399 EUR/an | PL: 1.690 PLN/an

## 5.3 Proiecții
- An 1: 100+ clienți RO × ~€350 = €35.000
- An 2: +BG +HU = €50.000-80.000
- An 3: +DE +PL = €125.000-200.000

---

# 6. COMPETIȚIE

| Feature | ssmatic.ro | gossm.ro | SSM.ro (Consultia) | **S-S-M.RO** |
|---------|-----------|----------|---------------------|-------------|
| Multi-country | ❌ | ❌ | ❌ | ✅ 45 țări DB |
| RBAC dinamic | ❌ | ❌ | ❌ | ✅ 27 roluri |
| Pipeline legislativ AI | ❌ | ❌ | ❌ | ✅ M1-M6 LIVE |
| Arhitectură modulară | ❌ | ❌ | ❌ | ✅ 11 module LEGO |
| Multilingv | ❌ | ❌ | ❌ | ✅ 6 limbi |
| 🆕 Publishing auto-match | ❌ | ❌ | ❌ | ✅ M5 LIVE |

USP-uri: Pipeline AI M1-M6, multi-country 45 țări, OP-LEGO 11 module, MABS-VA (SECRET!)

🆕 Idei noi (Gemini 15 Feb): AI-Posture, Thermography Agent, Predictive Risk Scoring, Buton "Rezolvă", Dashboard "Audit Ready", Whistleblowing, First Aid Simulator, Digital Signage, Tender AI, Wearable Safety, AI Vision Lite

---

# 7. ECHIPĂ & INFRASTRUCTURE (🆕 15 Feb)

- **Daniel:** Fondator/CTO, solo developer, 14+ certificări
- **Andrei:** Collaborator (onboarding docs A1-A5 create 12 Feb, setup pending). Task: SOAP client legislatie.just.ro + bulk import
- **QC collaborator:** 4h/zi traduceri + quality control
- **Dev ops:** 4 laptopuri (A/B/C/D) cu Claude Code agents. 640+ tasks, 113+ branches.
- **ATX server:** Ryzen 7 5700X / 64GB RAM — arrives ~24 Feb
- **Budget:** Claude €200/lună Max 20x. Vercel Pro $20/lună + spend $50.

---

# 8. CERTIFICĂRI

Active: SSM (L319/2006), PSI, GDPR/DPO, Risk Evaluator, RSVTI, ERC BLS Instructor, Emergency Management, CCF, Expert Labor Law
In progress: NIS2 Auditor (iunie 2026), IOSH Chartered, ENSHPO EurOSHM, IAPP CIPP/E

---

# 9. DECIZII ARHITECTURALE CHEIE

Tot ce era în v11.0 PLUS:
| Data | Decizie | Rațional |
|------|---------|----------|
| 🆕 14 Feb | Pricing increase €350-1200 | Validat prin consultare multi-AI (Gemini+ChatGPT) |
| 🆕 15 Feb | M5 Publishing cu auto-match | country_code + domain + CAEN matching automat |
| 🆕 15 Feb | Fundația SQL 002 | Pregătire comparații legislative + traduceri + notificări |
| 🆕 15 Feb | memberships.role ONLY | profiles.system_role NU EXISTĂ (eroare 42703 fixată) |
| 🆕 15 Feb | Vercel preview deploys OFF | Cost control ($100 incident) |
| 🆕 15 Feb | country_code = TEXT liber | Poate primi orice țară fără migration, nu e limitat la 5 |

---

# 10. LINKURI IMPORTANTE

- **App LIVE:** https://app.s-s-m.ro
- **GitHub:** https://github.com/danielvicentiu/s-s-m-app
- **Supabase:** uhccxfyvhjeudkexcgiq.supabase.co
- **Admin Legal Acts:** https://app.s-s-m.ro/ro/admin/legal-acts
- **Admin Legal Import:** https://app.s-s-m.ro/ro/admin/legal-import

---

# 11. AUDIT TRAIL

| Versiune | Data | Schimbări |
|----------|------|----------|
| v1.0 | Ian 2026 | Creare |
| v9.1 | 9 Feb | Multi-tenant 5 faze, 31 features |
| v10.0 | 11 Feb | Pipeline M1-M3, 37 features, Next.js 16.1.4 |
| v11.0 | 11 Feb | OP-LEGO: 5 tabele, 45 țări, 11 module, DB 46 tabele |
| **v12.0** | **15 Feb** | **M5 Publishing LIVE. Fundația SQL 002 (7 elemente). Build fix. Pricing €350-1200. legal_acts 22→105. DB 49 tabele. Andrei onboarding. Git cleanup. 27 idei Gemini. Platform Overview 2 versiuni.** |
