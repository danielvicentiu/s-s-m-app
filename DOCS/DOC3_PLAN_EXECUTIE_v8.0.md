# DOC3_PLAN_EXECUTIE — S-S-M.RO
> **Versiune:** 8.0 | **Data:** 20 Februarie 2026
> **Changelog v8.0:** Sprint 6 (v0 redesign + fixes) COMPLET. Sprint 7 (AI-KB + Resend + ModuleGate + Twilio + OTP) IN PROGRESS. Andrei A1-A6. NIS2 examen. Push notifications infra. Upload portal mobil. JWT metadata sync. Route groups restructurare.

---

# 1. SPRINT HISTORY (COMPLET)

## Sprint 1-4 (Ian - 8 Feb): Fundație + RBAC + OP-LEGO
- DB schema 46 tabele, auth, dashboard, email alerts, training, RBAC 27 roluri
- OP-LEGO: 5 tabele, 45 țări, 11 module, 3 funcții, 10 RLS, 23 indexuri
- Pipeline M1-M3 legislativ + taxonomie

## Sprint 5 (9-15 Feb): M5 Publishing + SQL 002 + Pricing
- M5 organization_obligations + auto-match + publish_batches LIVE
- Fundația SQL 002: 7 elemente (topic_tags, CAEN N:N, subscribed_countries, practical_interpretation, obligation_translations, notification_preferences, view)
- Pricing validat multi-AI: €350-1200/an
- Build Vercel fixat, legal_acts 22→105, DB 46→49
- 27 idei Gemini integrate + Platform Overview 2 versiuni
- DOC1 v12.0 + DOC3 v7.0 pushed pe main

## Sprint 6 (16-19 Feb): Redesign v0 + Tracking modules + Andrei
- v0 redesign complet: Landing, Login, Onboarding, Dashboard, AI Assistant, Email templates
- PSI + Medical + ISCIR tracking modules LIVE
- Near Miss reporting + sidebar
- Scan pipeline + batch multi-file + auto-detect tip document
- Calendar instruiri + Reports PDF
- Contabilitate modul + validators CNP/CUI/IBAN
- Upload portal mobil (token-based, no auth)
- JWT metadata sync migration (SECURITY DEFINER, trigger pe user_roles)
- Route groups restructurare: (public), (manager), (worker), (admin)
- FCM push infra (fcm_tokens table, Firebase project)
- Andrei onboarding: 3 dispozitive, A1-A6 task-uri trimise
- SOAP bulk import (Andrei) merged pe main
- Smart search + an opțional pentru bulk import
- Encoding mojibake fixat (29 secvențe, 7 fișiere)
- GDPR cleanup: anonimizat employees/organizations/reports, șters bonuri Storage
- 17 acte UE importate bulk
- Git: 11+ commits pushed, build 468 pagini 0 erori

## Sprint 7 (19-20 Feb): AI-KB + Alerte + OTP — IN PROGRESS
### ✅ COMPLETAT 19-20 Feb:
- AI-KB module (import JSON, search full-text, detail page, sidebar link) — `a07aa21ad`
- Resend email templates integrate (3 templates + endpoint unificat) — `c6235dbe3`
- ModuleGate sidebar dinamic (active/trial/inactive badges) — `0d28cffed`
- org_modules seed Demo SRL: 9 active + 4 trial + 4 inactive
- Twilio Verify serviciu creat (S-S-M Platform, 4 canale: SMS/WhatsApp/Email/Voice)
- Twilio webhook setat: app.s-s-m.ro/api/webhooks/twilio
- OTP migration SQL: 4 tabele (otp_sessions, trusted_devices, totp_secrets, otp_configurations)
- TWILIO_VERIFY_SERVICE_SID adăugat în Vercel
- PIN auth frontend complet + settings + middleware redirect
- @react-email/render instalat, build clean

### 🔄 IN PROGRESS:
- CC OTP System (Twilio Verify + TOTP + device trust + provider adapter) — estimare 25-35 min

### ⏳ DE FĂCUT Sprint 7:
- Verificare CC OTP → push → merge main
- DOC1 v13.0 + DOC3 v8.0 update ✅ (acest document)
- Verificare progres Andrei A1-A6
- Landing BG + traduceri (CC)
- temp/ cleanup (weekend)

---

# 2. TASK-URI ANDREI (A1-A6)

| Task | Descriere | Dispozitiv | Status |
|------|-----------|------------|--------|
| A1 | Traduceri ro.json → bg.json | Server (tmux) | ⏳ |
| A2 | FAQ SSM română (40 items) | Fedora (tmux) | ⏳ |
| A3 | QA testing manual app.s-s-m.ro | Ryzen | ⏳ |
| A4 | WSDL Analysis legislatie.just.ro | Săptămânal | ⏳ |
| A5 | SOAP client Node.js | Săptămânal | ⏳ |
| A6 | Bulk legislative search UI | Săptămânal | ⏳ |

---

# 3. ROADMAP SPRINT 8-12

## Sprint 8 (Săpt 4, 24-28 Feb): BG Market + Landing
- Landing page BG (traduceri, prețuri EUR)
- i18n BG complet (bg.json verificat)
- Legal compare /admin/legal-compare
- Fișă instruire PDF conformă ITM (P0 MONEY MAKER)
- OTP Custom provider (SMSLink RO integration reală)
- Push notifications Web Push (Firebase FCM)

## Sprint 9 (Săpt 5, 3-7 Mar): Semnătură electronică + Onboarding client
- Semnătură electronică SES (Canvas HTML5 + metadata)
- AES via eSemneaza.ro (API integration)
- Client onboarding flow complet (CUI → auto-fill → module select → pay)
- White-label explorare (consultanți SSM)

## Sprint 10 (Săpt 6, 10-14 Mar): Advanced compliance
- NIS2 modul complet (pre-examen iunie 2026)
- GDPR modul complet
- Compliance Matrix Engine (AI legislative parsing avansat)
- Hartă legislativă MVP cu conexiuni vizuale

## Sprint 11 (Săpt 7-8, 17-28 Mar): Scale + Quality
- Multi-client selector dashboard
- UI raportare neconformități (foto + GPS + submit)
- Registru mentenanță UI
- Performance optimization + caching
- E2E testing suite

## Sprint 12 (Aprilie): BG Launch + Consultanți
- BG market soft launch (5 clienți pilot)
- Consultant partner onboarding
- Mini-tools landing page (calculator SSM, checklist ITM)
- Gamification Safety Points (Bronze/Silver/Gold)

---

# 4. CERTIFICĂRI & EXAMENE

| Certificare | Status | Deadline |
|------------|--------|----------|
| NIS2 Auditor | Examen | Iunie 2026 |
| IOSH Chartered | Experiential route | În curs |
| ErgoWork / SEMML | Înscriere | Cerere trimisă |
| European Ergonomist | Explorare | 2026-2027 |

---

# 5. METRICI TARGET

| Metrica | Acum | Q1 2026 | Q2 2026 |
|---------|------|---------|---------|
| Features LIVE | 44 | 55+ | 70+ |
| Tabele DB | 69+ | 80+ | 90+ |
| Clienți pilot | 3 | 10 | 25 |
| Țări active | 1 (RO) | 2 (RO+BG) | 2-3 |
| Revenue lunar | €0 | €500 | €2.000 |

---

# 6. DECIZII PENDING

| # | Decizie | Opțiuni |
|---|---------|---------|
| 1 | Hetzner migration? | Mar / Apr / Rămâi Vercel |
| 2 | Cont bancar BG? | Revolut / Wise / DSK Bank |
| 3 | White-label sau referral? | WL / Referral / Direct |
| 4 | OP-LEGO Pricing seed? | Bază+extra / Prețuri actuale / Hybrid |
| 5 | FK constraints? | Acum / Sprint 10 / Nu |
| 6 | Prețuri landing vs tiers? | 990 LEI site vs €350 tier nou |
| 7 | OTP Custom provider? | SMSLink / Vonage / MessageBird |
| 8 | Aplicație mobilă nativă? | PWA only / Expo React Native / Flutter |

---

# 7. REGULI PERMANENTE

1. **DOC1 + DOC3** se actualizează la finalul fiecărui sprint
2. **MANUAL** se actualizează lunar (ultima versiune: v9.2, 9 Feb)
3. **Prețuri:** RON (RO), EUR (BG), HUF (HU), EUR (DE), PLN (PL)
4. **COR nu CAEN** pentru instruire
5. **GDPR și NIS2** = module SEPARATE
6. **VA-AI** în client-facing (nu Claude/Anthropic)
7. **memberships.role** = sursa RBAC
8. **Vercel preview OFF** — cost control
9. **CC Sonnet** = cod >50 linii. **Cursor** = 1-5 linii. **Opus** = strategie/arhitectură.
10. **NU DROP/DELETE** fără confirmare explicită Daniel

---

# 8. AUDIT TRAIL

| Versiune | Data | Schimbări |
|----------|------|----------|
| v1.0-v4.2 | Ian-9 Feb | Fundație → RBAC → Multi-tenant |
| v5.0-v6.0 | 11 Feb | Pipeline M1-M3 + OP-LEGO |
| v7.0 | 15 Feb | Sprint 5: M5 + SQL 002 + Pricing + Gemini |
| **v8.0** | **20 Feb** | **Sprint 6 COMPLET (redesign + tracking + Andrei). Sprint 7 IN PROGRESS (AI-KB + Resend + ModuleGate + Twilio Verify + OTP 4 tabele + TOTP + provider adapter). 42→44 features. 49→69+ tabele. Build 468p 0 erori.** |
