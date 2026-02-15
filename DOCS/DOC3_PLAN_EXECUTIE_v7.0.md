# DOC3_PLAN_EXECUTIE — S-S-M.RO
> **Versiune:** 7.0 | **Data:** 15 Februarie 2026
> **Changelog v7.0:** Sprint 5 (M5 Publishing + Fundația SQL 002) COMPLET. Build Vercel fixat. Pricing update €350-1200 (multi-AI). Andrei onboarding docs A1-A5. Git cleanup 640+ tasks. 27 idei Gemini integrate. Sprint 6 (i18n BG + Comparații + Onboarding) definit. legal_acts 22→105. DB 46→49.

---

# 1. SPRINT-URI COMPLETATE

## ✅ Sprint 0 — Fundație (Ian 2026)
[Identic v6.0 — Supabase + Next.js + Vercel + Auth + Landing + Dashboard]

## ✅ Sprint 1 — Alerte (Feb 2026, săpt 1)
[Identic v6.0 — Resend + DKIM/SPF/DMARC + Cron + notification_log]

## ✅ Sprint 2 — Training Modules (Feb 2026, săpt 1)
[Identic v6.0 — 9 module + assignments + sessions + quiz + certificat PDF]

## ✅ Sprint 3 — RBAC Dinamic (8 Feb 2026)
[Identic v6.0 — 27 roluri, 210 permisiuni, 7 funcții, admin UI, migrare]

## ✅ Sprint 4 — Multi-Tenant Complet (9 Feb 2026)
[Identic v6.0 — 5 faze, obligation_types, alert_categories, equipment_types, next-intl, admin UI, landing 5 țări, conținut instruire 4 module + 85 quiz]

## ✅ Sprint 4.5 — Pipeline Legislativ (10-11 Feb 2026)
[Identic v6.0 — M1-M3 LIVE, UI filtrare sidebar, taxonomie 8/92, Vercel Pro]

## ✅ Sprint 4.6 — OP-LEGO Arhitectură Modulară (11 Feb 2026)
[Identic v6.0 — 5 tabele, 45 țări, 11 module, 55 config, 3 funcții, 10 RLS, 23 indexuri]

## 🆕 ✅ Sprint 5 — M5 Publishing + Fundație SQL (12-15 Feb 2026)

### ✅ M5 Publishing
- [x] organization_obligations table (auto-match country/domain/CAEN + manual override)
- [x] publish_batches table (bulk operations tracking)
- [x] Admin UI /admin/publish (select obligations → preview matching → override → publish)
- [x] Dashboard widgets organizații (tracking compliance status)
- [x] RLS policies via memberships.role (NU profiles.system_role — fix 42703)
- [x] Deploy pe app.s-s-m.ro

### ✅ Fundația SQL 002 — 7/7 verificat
- [x] topic_tags pe legal_obligations (TEXT[] + GIN index)
- [x] organization_caen_codes (N:N, RLS via memberships.role)
- [x] subscribed_countries pe organizations (TEXT[], default țara)
- [x] practical_interpretation pe organization_obligations (TEXT)
- [x] obligation_translations (tabel nou: language_code, verified, AI model)
- [x] notification_preferences (email, push, Telegram, WhatsApp, SMS)
- [x] v_obligations_by_country_topic (VIEW comparații legislative)

### ✅ Build & Deploy
- [x] Build Vercel fixat (8 module lipsă + ignoreBuildErrors: true)
- [x] Vercel preview deploys DEZACTIVAT (cost $100 incident)
- [x] Git branch cleanup (640+ tasks, 113+ branches across 4 laptopuri)

### ✅ Strategie & Documentare
- [x] Consultare multi-AI (16 analize Gemini+ChatGPT): pricing, market, risk
- [x] Pricing update: €200 → €350-1200/an (validat)
- [x] SSM-RO-Platform-Overview.docx (versiune publică, zero referințe tehnice)
- [x] SSM-RO-Platform-Overview-INTERNAL.docx (versiune cu referințe tehnice)
- [x] Strategie dezvăluire treptată + protecție competitivă
- [x] Andrei onboarding docs (A1-A5), setup pending

---

# 2. SPRINT-URI VIITOARE

## Sprint 6 — i18n BG + Comparații + Onboarding (16-22 Feb) — 🔄 IN PROGRESS

### P0 — TESTARE INTEGRARE
- [ ] topic_tags filtering pe /admin/legal funcționează
- [ ] v_obligations_by_country_topic returnează date corecte
- [ ] organization_caen_codes se populează din onboarding
- [ ] notification_preferences se creează la onboarding

### P1 — CORE
- [ ] Comparații legislative /admin/legal-compare (4h)
- [ ] i18n Bulgaria complet (bg.json + UI + testing)
- [ ] Onboarding wizard client ("Adaugă firma ta") cu CUI lookup openapi.ro
- [ ] CRUD forms admin complete (replace placeholders)
- [ ] Testare completă multi-tenant

### P2
- [ ] Email-uri beta DE (4 prieteni) + HU (2)
- [ ] Poliță RCP — contactează broker
- [ ] Andrei: GitHub + Supabase + Vercel access + clone repo

## Sprint 7 — Template-uri BG + Server (23 Feb - 8 Mar)
- [ ] ATX server setup (arrives ~24 Feb)
- [ ] Template-uri documente BG (6 tipuri ITM)
- [ ] Andrei: SOAP client legislatie.just.ro funcțional
- [ ] Andrei: Bulk import pipeline
- [ ] Hetzner CPX31 migration
- [ ] Pitch deck Mediko.org
- [ ] NIS2 modul — pregătire conținut

## Sprint 8 — Fișă instruire PDF + CRUD (Mar S1-S2)
- [ ] Fișă instruire PDF conformă ITM (P0 — MONEY MAKER)
- [ ] legal_basis_version pe tabelele SSM
- [ ] Generator documente SSM din template-uri (10 tipuri ITM)
- [ ] OP-LEGO TypeScript middleware (6 fișiere)
- [ ] OP-LEGO Admin UI module management

## Sprint 9 — Training Multilingv + Integrări (Mar S3-S4)
- [ ] Training module audio ElevenLabs (RO + EN + BG)
- [ ] REGES connector cercetare + prima integrare
- [ ] WhatsApp alerts (Green API / Twilio)
- [ ] Dicționar multilingv 100 expresii SSM

## Sprint 10 — Payments + NIS2 (Apr)
- [ ] Stripe live + SmartBill integrare
- [ ] NIS2 eligibility test pe landing
- [ ] NIS2 modul base (checklist + gap analysis)
- [ ] certSIGN AES (RO) + Evrotrust QES (BG)

## Sprint 11 — Quick-Valid + Advanced (Mai)
- [ ] Quick-Valid M9a + Entropy Check
- [ ] Value Preview dashboard
- [ ] Scor Expunere per organizație
- [ ] Neacțiune Vizibilă protocol

## Sprint 12 — Marketplace & AI (Jun+)
- [ ] Marketplace consultanți SSM
- [ ] AI Assistant ("Ce documente îmi trebuie?")
- [ ] White-label MVP

---

# 3. IDEI NEIMPLEMENTATE (din chaturi vechi + Gemini)

## Din chaturi Claude (extras 15 Feb):
1. OCR document scanning
2. AI legislative parsing avansat (Compliance Matrix Engine)
3. Mini-tools pe landing page (calculator SSM, checklist ITM)
4. Multi-client selector dashboard
5. Hartă legislativă MVP cu conexiuni vizuale
6. UI raportare neconformități (telefon: foto + GPS + submit)
7. UI registru mentenanță (CRUD pe maintenance_registry)
8. Etichetare rafturi + Controale periodice (tabele create, UI nu)
9. Fit for Duty cu exoscheleți, senzori ergonomici, IoT
10. WELL API ecosistem

## Din Gemini (extras 15 Feb) — TIER 1:
11. AI-Posture (MediaPipe/TensorFlow.js) — analiză posturală camera telefon → fișă ergonomică
12. Thermography Reporting Agent — upload FLIR → AI hotspots → raport tehnic
13. Predictive Risk Scoring — "Martie + Construcții = căderi +20%"
14. Butonul "Rezolvă" pe deficiențe → marketplace parteneri
15. Dashboard "Audit Ready" — pregătit de control ITM? DA/NU
16. Whistleblowing anonim — obligatoriu 50+ angajați (Directiva UE 2019/1937)
17. ERC First Aid Simulator — scenarii interactive prim ajutor
18. Digital Signage — indicatori SSM pe ecrane în hală

## Din Gemini — TIER 2 (2027+):
19. Tender AI (SEAP/SICAP scraping licitații SSM)
20. Wearable Safety API (smartwatch fatigue management)
21. AI Vision Lite (foto șantier → AI check casc/vestă/balustradă)
22. Zero-Admin Dashboard (furnizori urcă docs direct)

## Din Gemini — lista 100 oportunități:
23. Monitorizare "Lista Neagră" ANAF
24. Audit GDPR automat fișiere partajate
25. Raport ESG automat
26. Audit Log UI (interfață pe JSONB audit trail)
27. Calcul taxă dizabilitate (add-on CCF/fiscal)

---

# 4. OBIECTIVE TRIMESTRIALE

## Q1 2026 (Jan-Mar)
- ✅ 38+ features live (depășit target 14)
- ✅ RBAC + Multi-tenant + OP-LEGO + Pipeline M1-M6 LIVE
- 🆕 ✅ M5 Publishing + Fundația SQL 002
- 🆕 ✅ Pricing validat €350-1200
- 🔴 Fișă instruire PDF, Contacte BG, Poliță RCP, OP-LEGO TypeScript

## Q2 2026 (Apr-Jun)
- [ ] Primii 5 clienți BG + 2 DE
- [ ] NIS2 examen + modul live
- [ ] Stripe + certSIGN/Evrotrust
- [ ] 50 features live

## Q3-Q4 2026
- [ ] 20 BG, 10 DE/AT, White-label, Marketplace v1
- [ ] €75.000 ARR target

---

# 5. METRICI

| Metrică | Acum (15 Feb) | Target Q2 | Target Q4 |
|---------|-------------|----------|----------|
| Features LIVE | 38+ | 50 | 65 |
| Clienți RO | 100+ | 120 | 150 |
| Clienți BG | 0 | 5 | 20 |
| ARR | ~€20.000 | ~€42.000 | ~€75.000 |
| legal_acts DB | 🆕 105 | 150+ | 200+ |
| Tabele DB | 🆕 49 | 53+ | 58+ |
| Țări DB | 45 (5 active) | 45 (7 active) | 45 (10 active) |

---

# 6. DECIZII PENDING

| # | Decizie | Opțiuni |
|---|---------|---------|
| 1 | Hetzner migration? | Mar / Apr / Rămâi Vercel |
| 2 | Cont bancar BG? | Revolut / Wise / DSK Bank |
| 3 | Mediko: white-label sau parteneriat? | WL / Referral / Direct |
| 4 | OP-LEGO Pricing model? | Bază+extra / Prețuri actuale / Hybrid |
| 5 | FK constraints pe tabelele existente? | Acum / Sprint 8 / Nu |
| 🆕 6 | Landing language scroll order? | Modificabil — verifică LandingClient.tsx |
| 🆕 7 | Prețuri landing vs pricing tiers noi? | 990 LEI pe site vs €350 tier nou |

---

# 7. AUDIT TRAIL

| Versiune | Data | Schimbări |
|----------|------|----------|
| v1.0-v4.2 | Ian-9 Feb | Fundație → Alerte → Training → RBAC → Multi-tenant |
| v5.0 | 11 Feb | Pipeline M1-M3 + Taxonomie + Vercel Pro |
| v6.0 | 11 Feb | OP-LEGO DB (5 tabele, 45 țări, 11 module) |
| **v7.0** | **15 Feb** | **Sprint 5 COMPLET: M5 Publishing + Fundația SQL 002 (7/7). Build fix. Pricing €350-1200 (multi-AI). legal_acts 105. DB 49. Andrei docs. Git cleanup. 27 idei Gemini. Platform Overview 2v.** |
