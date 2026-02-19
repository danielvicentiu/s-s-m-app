# DOC1_CONSOLIDARE — S-S-M.RO
> **Versiune:** 13.0 | **Data:** 20 Februarie 2026
> **Changelog v13.0:** v0 redesign complet (Landing, Login, Onboarding, Dashboard, AI Assistant, Email). PIN auth E2E. AI-KB module (import, search, detail). Resend email templates integrate. ModuleGate sidebar dinamic. Twilio Verify serviciu creat (OTP WhatsApp→SMS→Voice). OTP system 4 tabele create. TOTP Google Authenticator. Provider adapter skeleton (SMSLink RO). Upload portal mobil token-based. Bulk upload multi-file. JWT metadata sync migration. FCM push infra. Route groups restructurare. NIS2 audit report. Mojibake encoding fixat. GDPR cleanup Storage. Smart search + an opțional bulk import. 17 acte UE importate. Andrei A1-A6 task-uri. Build 468 pagini 0 erori.

---

# 1. VIZIUNE ȘI STRATEGIE

## 1.1 Ce este s-s-m.ro
Platformă digitală SaaS de management SSM/PSI/GDPR/NIS2 pentru firme mici și mijlocii. PWA (Progressive Web App) cu acces de pe orice dispozitiv.

## 1.2 Piețe țintă
România (activ), Bulgaria (pregătire Q1 2026), Ungaria, Germania, Polonia (2027+).

## 1.3 Stack Tehnic
- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Storage + RLS + Edge Functions)
- **Deploy:** Vercel (Production) — app.s-s-m.ro
- **Email:** Resend (alerte@s-s-m.ro, DKIM+SPF+DMARC) — 3 templates React Email
- **SMS/WhatsApp/Voice:** Twilio (Account: [REDACTED], Verify SID: [REDACTED])
- **AI:** Claude API (ANTHROPIC_API_KEY) — AI Assistant + Document extraction + Legislative parsing
- **Monitorizare legislativă:** SOAP client legislatie.just.ro
- **Limbi:** 6 (ro, en, bg, hu, de, pl)

## 1.4 Echipa
- **Daniel** — Fondator, arhitect, developer principal. 20+ ani experiență SSM/PSI. Certificări: ERC BLS, RSVTI, Evaluator Risc, CCF, NIS2 (examen iunie 2026).
- **Andrei** — Colaborator tehnic. 3 dispozitive (Ryzen desktop, Server Ubuntu, Fedora laptop). Task-uri A1-A6 atribuite 18 feb.

---

# 2. FEATURES LIVE PE MAIN (20 Feb 2026)

## 2.1 Core Platform
| # | Feature | Status | Commit ref |
|---|---------|--------|------------|
| 1 | Landing page (v0 redesign) | ✅ LIVE | ddb81851 |
| 2 | Login + Magic Link + Parolă | ✅ LIVE | — |
| 3 | Onboarding 4-step (CUI auto ANAF) | ✅ LIVE | 989099cbe |
| 4 | Dashboard Overview | ✅ LIVE | — |
| 5 | PIN Auth (frontend + backend + middleware + E2E) | ✅ LIVE | f31b931a8 |
| 6 | Email Alerts via Resend (CRON 08:00) | ✅ LIVE | — |
| 7 | Pricing page | ✅ LIVE | — |

## 2.2 Module SSM/PSI/Medical
| # | Feature | Status |
|---|---------|--------|
| 8 | Training Sessions + Calendar instruiri | ✅ LIVE |
| 9 | PSI Equipment Tracking (verificări, stingătoare) | ✅ LIVE |
| 10 | Medical Examinations Tracking | ✅ LIVE |
| 11 | ISCIR Equipment + QR Code + verificări zilnice | ✅ LIVE |
| 12 | Near Miss Reporting (sidebar) | ✅ LIVE |
| 13 | Employees CRUD + Import REGES | ✅ LIVE |
| 14 | Equipment management | ✅ LIVE |

## 2.3 Legislație & Compliance
| # | Feature | Status |
|---|---------|--------|
| 15 | Legal Bulk Import (smart search + an opțional) | ✅ LIVE | bc3037cb0 |
| 16 | Legislative Monitor M1-M7 pipeline | ✅ LIVE |
| 17 | M5 Publishing (organization_obligations + auto-match) | ✅ LIVE |
| 18 | M6 Batch Processing | ✅ LIVE |
| 19 | Client Obligations dashboard | ✅ LIVE |
| 20 | 105 legal_acts + 65 legal_obligations în DB | ✅ LIVE |
| 21 | 17 acte UE importate bulk | ✅ LIVE |

## 2.4 AI & Documents
| # | Feature | Status | Commit ref |
|---|---------|--------|------------|
| 22 | AI Assistant chat | ✅ LIVE | — |
| 23 | AI Knowledge Base (import JSON, search, detail) | ✅ LIVE | a07aa21ad |
| 24 | Document Scan (OCR + AI extraction) | ✅ LIVE | — |
| 25 | Batch Scan multi-file | ✅ LIVE | — |
| 26 | Upload Portal mobil (token-based, no auth) | ✅ LIVE | — |
| 27 | Reports PDF (SSM/PSI) | ✅ LIVE | — |
| 28 | 21 scan templates (SSM+PSI+HR+Contabilitate) | ✅ LIVE | — |

## 2.5 Admin & Infrastructure
| # | Feature | Status | Commit ref |
|---|---------|--------|------------|
| 29 | RBAC 27 roluri + JWT metadata sync | ✅ LIVE | c66ab89d |
| 30 | OP-LEGO multi-country (5 tabele, 45 țări, 11 module) | ✅ LIVE | e27de62 |
| 31 | ModuleGate sidebar dinamic (active/trial/inactive) | ✅ LIVE | 0d28cffed |
| 32 | org_modules seed (9 active + 4 trial + 4 inactive Demo SRL) | ✅ LIVE | — |
| 33 | Contabilitate modul | ✅ LIVE | — |
| 34 | Admin pages (legislation, config, access) | ✅ LIVE | — |
| 35 | i18n 6 limbi | ✅ LIVE | — |
| 36 | CNP/CUI/IBAN validators | ✅ LIVE | 3ace19e64 |

## 2.6 Alerte & Comunicare
| # | Feature | Status | Commit ref |
|---|---------|--------|------------|
| 37 | Twilio Alerts (WhatsApp→SMS→Email cascade) | ✅ LIVE | — |
| 38 | Twilio webhook (delivery status + reply DA/OK) | ✅ LIVE | — |
| 39 | CRON check-expiries zilnic 06:00 | ✅ LIVE | — |
| 40 | CRON monthly report 1 ale lunii 08:00 | ✅ LIVE | — |
| 41 | Resend email templates (BunVenit, AlerteConformitate, InstruireProgramata) | ✅ LIVE | c6235dbe3 |
| 42 | Email send unified endpoint | ✅ LIVE | c6235dbe3 |

## 2.7 Implementat 20 Feb (CC în curs)
| # | Feature | Status |
|---|---------|--------|
| 43 | OTP System (Twilio Verify + TOTP + device trust) | 🔄 CC rulează |
| 44 | OTP Provider adapter (Twilio/Custom/SMSLink skeleton) | 🔄 CC rulează |

**TOTAL: 42 features LIVE + 2 în curs = 44**

---

# 3. BAZA DE DATE SUPABASE

## 3.1 Tabele (69+ confirmate)
**Core:** organizations, profiles, memberships, employees, locations
**Legislație:** legal_acts (105), legal_obligations (65), organization_obligations, publish_batches, obligation_translations, jurisdictions
**Tracking:** training_sessions, training_assignments, medical_examinations, safety_equipment, psi_equipment, iscir_equipment
**Alerte:** alert_configurations, alert_logs, alert_usage, notification_preferences
**Documents:** document_scans, document_scan_templates (21), reports
**AI:** ai_conversations, ai_artifacts, ai_knowledge_extracts
**Auth:** pin_auth, fcm_tokens, onboarding_steps, user_roles, role_capabilities, capabilities
**OTP (20 Feb):** otp_sessions, trusted_devices, totp_secrets, otp_configurations
**OP-LEGO:** countries (45), module_definitions (11), country_module_config (55), organization_modules, organization_module_countries
**Altele:** organization_caen_codes, upload_links, import_logs, near_miss_reports, accounting_*, maintenance_*

## 3.2 Views
v_dashboard_overview, v_active_alerts, v_medical_status, v_equipment_status, v_training_status, v_obligations_by_country_topic, training_calendar_view, v_employees_full, legal_acts_full

## 3.3 RBAC
- 27 roluri across 5 țări (super_admin, consultant_ssm, firma_admin, angajat, etc.)
- JWT app_metadata sync (trigger pe user_roles)
- RLS pe toate tabelele, bazate pe auth.uid() + memberships JOIN
- 64+ indexuri (GIN, btree, composite)

---

# 4. MULTI-COUNTRY

| Țară | Sursa legislativă | Status | Monedă |
|------|------------------|--------|--------|
| RO | legislatie.just.ro (SOAP) | ACTIV | RON |
| BG | lex.bg | Pregătire Q1 2026 | EUR (eurozonă 2025) |
| HU | njt.hu | 2027+ | HUF |
| DE | gesetze-im-internet.de | 2027+ | EUR |
| PL | isap.sejm.gov.pl (REST) | 2027+ | PLN |

---

# 5. PRICING MODEL (14 Feb 2026)

| Tier | Preț/an | Target |
|------|---------|--------|
| Starter | €350 (~1.750 RON) | Micro-firme 1-9 angajați |
| Professional | €600 (~3.000 RON) | IMM-uri 10-49 angajați |
| Enterprise | €1.200 (~6.000 RON) | 50+ angajați / consultanți |
| Consultant | €200/client | Firme SSM extern |

Add-on modules: NIS2 (~€150), Audit checklists (~€100), REGES (~€80), Training multilingv (~€120)

---

# 6. INTEGRĂRI EXTERNE

| Serviciu | Scop | Status |
|----------|------|--------|
| Supabase | DB + Auth + Storage + RLS | ✅ ACTIV |
| Vercel | Deploy + CRON | ✅ ACTIV |
| Resend | Email alerts | ✅ ACTIV (3 templates) |
| Twilio | SMS + WhatsApp + Voice + Verify OTP | ✅ CONFIGURAT |
| Claude API | AI Assistant + Extraction + Parsing | ✅ ACTIV |
| ANAF API | CUI auto-complete onboarding | ✅ ACTIV |
| legislatie.just.ro | SOAP legislative import | ✅ ACTIV |
| Firebase FCM | Push notifications | ⬜ Infra creată, nedeployat |

---

# 7. STRUCTURA FIȘIERE (KEY PATHS)

```
app/[locale]/(manager)/dashboard/ — Dashboard principal (patron/consultant)
app/[locale]/(manager)/dashboard/alerts/ — Alerte & Notificări
app/[locale]/(manager)/dashboard/ai-kb/ — AI Knowledge Base
app/[locale]/(manager)/dashboard/settings/ — Setări
app/[locale]/otp/ — OTP verification page (20 Feb)
app/[locale]/upload/[token]/ — Portal upload mobil (token-based)
app/[locale]/admin/ — Admin pages
app/api/otp/ — OTP API routes (send, verify, totp/setup, totp/verify, devices)
app/api/email/send/ — Unified email endpoint
app/api/webhooks/twilio/ — Twilio delivery + reply webhook
app/api/cron/ — CRON jobs (check-expiries, monthly-report)
lib/otp/ — OTP providers (twilioVerify, totp, custom, factory, deviceTrust)
lib/alerts/ — Twilio alerts (client, service, templates)
components/emails/ — React Email templates
components/email-templates/ — BunVenit, AlerteConformitate, InstruireProgramata
```

---

# 8. ENVIRONMENT VARIABLES (Vercel)

| Variabilă | Status |
|-----------|--------|
| ANTHROPIC_API_KEY | ✅ |
| TWILIO_ACCOUNT_SID | ✅ [REDACTED]... |
| TWILIO_AUTH_TOKEN | ✅ |
| TWILIO_WHATSAPP_FROM | ✅ +14155238886 |
| TWILIO_SMS_FROM | ✅ |
| TWILIO_VERIFY_SERVICE_SID | ✅ [REDACTED]... |
| CRON_SECRET | ✅ |
| RESEND_API_KEY | ✅ |
| NEXT_PUBLIC_SUPABASE_URL | ✅ |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | ✅ |
| SUPABASE_SERVICE_ROLE_KEY | ✅ |

---

# 9. COMPETIȚIE

| Competitor | CA 2024 | Model | Avantajul nostru |
|-----------|---------|-------|-----------------|
| SSM.ro (Consultia) | 2.6M RON | 1 leu/lună/ang | AI legislativ, multi-country, OTP modern |
| EasySSM | 151K RON | Abonament | Modular, scalabil, OP-LEGO |
| CloudSSM.ro | N/A | TBD | Pipeline AI, Twilio cascade |

---

# 10. DECIZII STRATEGICE PERMANENTE

1. **Pricing:** €350-1200/an (validat multi-AI)
2. **Consultant-first GTM:** Parteneriate consultanți ca canal primar
3. **BG first export:** Bulgaria eurozonă, piață accesibilă
4. **MABS-VA secret:** NU dezvălui extern
5. **Dezvăluire treptată:** Strat 1 (prezentare) → Strat 2 (demo) → Strat 3 (partener)
6. **RLS via memberships.role:** NU profiles.system_role
7. **Vercel preview deploys OFF:** Cost control
8. **DOC1+DOC3 obligatoriu:** Fiecare chat nou = documente actualizate
9. **VA-AI în client-facing:** Nu Claude/Anthropic

---

# 11. AUDIT TRAIL

| Versiune | Data | Schimbări |
|----------|------|----------|
| v1.0-v9.1 | Ian-9 Feb | Fundație → Alerte → Training → RBAC → Multi-tenant |
| v10.0 | 11 Feb | Pipeline M1-M3 + Taxonomie + Vercel Pro |
| v11.0 | 11 Feb | OP-LEGO DB (5 tabele, 45 țări, 11 module) |
| v12.0 | 15 Feb | M5 Publishing + SQL 002 + Pricing €350-1200 + 27 idei Gemini |
| **v13.0** | **20 Feb** | **v0 redesign complet. PIN auth E2E. AI-KB module. Resend templates. ModuleGate sidebar. Twilio Verify + OTP system (4 tabele). TOTP. Upload portal mobil. JWT sync. FCM infra. NIS2 audit. 42→44 features. 49→69+ tabele. Build 468p 0 erori.** |

