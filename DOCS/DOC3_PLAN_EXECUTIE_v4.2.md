# DOC3_PLAN_EXECUTIE — S-S-M.RO
> **Versiune:** 4.2 | **Data:** 9 Februarie 2026
> **Changelog v4.2:** Fuziune v4.0 + v4.1. Toate 5 fazele multi-tenant COMPLETATE + backlog detaliat + metrici + riscuri din v4.1. Features LIVE actualizat de la 14 la 31.

---

# 1. SPRINT-URI COMPLETATE

## ✅ Sprint 0 — Fundație (Ian 2026)
- [x] Supabase project setup + 25 tabele
- [x] Next.js 14 PWA + Tailwind
- [x] Vercel deploy + DNS (app.s-s-m.ro)
- [x] Auth (email+parolă + magic link)
- [x] Landing page
- [x] Dashboard cu date reale
- [x] RLS pe toate tabelele

## ✅ Sprint 1 — Alerte (Feb 2026, săpt 1)
- [x] Resend email setup (alerte@s-s-m.ro)
- [x] DKIM + SPF + DMARC configurate
- [x] Vercel Cron zilnic 08:00
- [x] notification_log funcțional
- [x] Secțiune "Ultimele Notificări" pe dashboard

## ✅ Sprint 2 — Training Modules (Feb 2026, săpt 1)
- [x] 9 module de instruire
- [x] Training assignments
- [x] Training sessions cu progres auto-save
- [x] Quiz + verificare
- [x] Certificat PDF auto-generat

## ✅ Sprint 3 — RBAC Dinamic (8 Feb 2026)
- [x] Schema SQL: roles, permissions, user_roles
- [x] 27 roluri populate (4 system + 13 RO + 10 per țară)
- [x] ~210 permisiuni granulare
- [x] 7 funcții helper rbac_* cu fallback pe memberships
- [x] RLS RBAC pe 25+ tabele (policies noi)
- [x] Migrare memberships → user_roles (2 useri, zero downtime)
- [x] lib/rbac.ts + hooks/usePermission.ts
- [x] middleware.ts cu rutare per rol
- [x] Admin UI /admin/roles (4 pagini: listă, editare, creare, asignare)
- [x] 8 queries verificare post-migrare
- [x] Build clean, merged în main, pushed
- [x] Testare live — 27 roluri vizibile, editare funcțională

## ✅ Sprint 4 — Multi-Tenant Complet (9 Feb 2026, ~2 ore)

### ✅ Faza 1 — Tabele Configurabile
- [x] 3 ENUM-uri noi (obligation_frequency, alert_severity, equipment_category)
- [x] CREATE TABLE obligation_types + alert_categories + equipment_types
- [x] RLS pe toate 3 tabelele noi
- [x] Seed data RO: 12 obligații, 12 alerte, 23 echipamente
- [x] Clone RO → BG, HU, DE, PL (funcție helper clone_obligations_to_country)
- [x] Verificare: 60 obligații, 60 alerte, 103 echipamente, 5 țări

### ✅ Faza 2 — next-intl Routing
- [x] next-intl v4.8.2 (deja instalat)
- [x] Path-based routing: /ro, /bg, /hu, /de, /pl
- [x] middleware.ts i18n + x-country-code header
- [x] DOMAIN_CONFIG pregătit (bzr24.bg, sst24.hu, as-dig.de, bhp24.pl)
- [x] 5 fișiere traducere complete (129 chei × 5 limbi = 645 traduceri)
- [x] Layout wrapped cu NextIntlClientProvider
- [x] Selector limbă cu steaguri emoji (LanguageSelector component)
- [x] Build: 90 rute, 0 erori

### ✅ Faza 3 — Admin UI Configurabil
- [x] /admin/obligations — CRUD obligații per țară (R+D complet, C+U placeholder)
- [x] /admin/alert-categories — CRUD categorii alerte
- [x] /admin/equipment-types — CRUD tipuri echipamente (filtrare țară + categorie)
- [x] /admin/countries — Overview 5 țări cu stats
- [x] CountryFilter component reutilizabil
- [x] AdminFormPlaceholder component (link Supabase Table Editor temporar)
- [x] TypeScript interfaces complete (ObligationType, AlertCategory, EquipmentType)
- [x] RBAC protection pe toate paginile admin
- [x] Build: 125 rute, 0 erori

### ✅ Faza 4 — Refactor Dashboard Dinamic
- [x] Dashboard cards generate din obligation_types (nu hardcoded)
- [x] Equipment dropdown din equipment_types
- [x] Alerte din alert_categories
- [x] Country detection helper (locale → country_code)

### ✅ Faza 5 — Landing Pages per Țară
- [x] Landing pages 5 țări funcționale
- [x] Prețuri locale: RO=990 LEI, BG=199 EUR, HU=74.900 HUF, DE=399 EUR, PL=1.690 PLN
- [x] Penalties Calculator dinamic (citește obligation_types din DB, real-time calcul)
- [x] Server/Client component split (SSR + interactivitate)
- [x] Intl.NumberFormat per locale
- [x] 30 traduceri noi (6 chei penalties × 5 limbi)

### ✅ Bonus — Conținut Instruire RO (9 Feb 2026)
- [x] RO_INSTRUCTAJ_GENERAL.md (10 capitole, 30 quiz)
- [x] RO_INSTRUCTAJ_PSI.md (8 capitole, 20 quiz)
- [x] RO_INSTRUCTAJ_LA_LOCUL_DE_MUNCA.md (7 capitole, 20 quiz)
- [x] RO_INSTRUCTAJ_PERIODIC.md (6 capitole, 15 quiz)
- [x] RO_QUIZ_BANK.json (85 întrebări, 0 duplicate, referințe legale exacte)

---

# 2. SPRINT-URI VIITOARE

## Sprint 5 — PDF & Documente (P1 — MONEY MAKER)
- [ ] Fișă instruire PDF conformă ITM (PRIORITATE #1)
- [ ] legal_basis_version pe tabelele SSM
- [ ] Generator documente SSM din template-uri (10 tipuri ITM)
- [ ] Component Kit (5 componente standard)

## Sprint 6 — Onboarding & Client Experience (P1)
- [ ] Onboarding wizard client ("Adaugă firma ta")
- [ ] CRUD forms complete (înlocuiește placeholders admin)
- [ ] Dashboard cu date reale per client (nu demo)

## Sprint 7 — WhatsApp Alerts (P2)
- [ ] Green API integrare
- [ ] WhatsApp templates per limbă
- [ ] Fallback: WhatsApp → SMS → Email

## Sprint 8 — Multilingv Angajați Străini (P2)
- [ ] Traduceri EN, NE, VI pentru module instruire
- [ ] Dicționar multilingv 100 expresii (RO+EN+Nepali+Hindi)
- [ ] Audio instruire (ElevenLabs) pentru modulele gata

## Sprint 9 — Semnătură Electronică (P3)
- [ ] certSIGN AES semnătură electronică RO
- [ ] Evrotrust QES integrare BG
- [ ] HelloSign ca alternativă
- [ ] Workflow semnare documente

## Sprint 10 — REGES Connector (P3)
- [ ] API REGES conectat
- [ ] Import/sync angajați automat
- [ ] Alertare neconformități REGES

## Sprint 11 — Quick-Valid & Advanced (P3)
- [ ] M9a Quick-Valid + Entropy Check
- [ ] Value Preview pe dashboard
- [ ] Scor Expunere
- [ ] Neacțiune Vizibilă protocol complet
- [ ] Calculator SSM-PSI

## Sprint 12 — Marketplace & AI (P4)
- [ ] Marketplace consultanți SSM
- [ ] AI Assistant ("Ce documente îmi trebuie?")
- [ ] Ratings + reviews
- [ ] White-label MVP

---

# 3. BACKLOG DETALIAT PE LUNI

## Februarie 2026 (săpt 3-4)
| # | Task | Prioritate | Estimare |
|---|------|-----------|---------|
| 1 | Fișă instruire PDF conformă ITM | P1 | 3-5 zile |
| 2 | Onboarding wizard client | P1 | 1-2 zile |
| 3 | CRUD forms admin complete | P1 | 2-3 zile |
| 4 | Testare completă multi-tenant | P1 | 1 zi |
| 5 | Email-uri beta DE (4 prieteni) + HU (2) | P1 | 1h |
| 6 | Polița RCP — contactează broker | P0 | 1h |

## Martie 2026
| # | Feature | Prioritate | Estimare |
|---|---------|-----------|---------|
| 1 | Bulgaria Building Week (Sofia) — prezență fizică | P1 | 2-3 zile deplasare |
| 2 | Pitch deck Mediko.org finalizat | P1 | 4h |
| 3 | NIS2 modul — pregătire conținut (examen iunie) | P2 | 10h |
| 4 | Generator documente extins (10 tipuri ITM) | P2 | 12h |
| 5 | WhatsApp alerts (Green API) | P2 | 3h |
| 6 | Eur.Erg. dosar CREE — depunere | P1 | 5h |
| 7 | Cont bancar BG (Revolut Business sau Wise) | P1 | 1h |

## Aprilie 2026
| # | Feature | Prioritate | Estimare |
|---|---------|-----------|---------|
| 1 | Stripe integrare (plăți automate) | P1 | 8h |
| 2 | certSIGN AES semnătură electronică RO | P2 | 6h |
| 3 | Evrotrust QES integrare BG | P2 | 6h |
| 4 | WELL AP certificare ($299) | P2 | Studiu + examen |
| 5 | Onboarding primii 5 clienți BG (pilot gratuit) | P1 | Ongoing |
| 6 | EurOSHM dosar | P2 | 4h |
| 7 | Hetzner migration (de la Vercel) | P2 | 4h |

## Mai-Iunie 2026
| # | Feature | Prioritate | Estimare |
|---|---------|-----------|---------|
| 1 | NIS2 examen (IUNIE) + modul live | P1 | Examen + 20h |
| 2 | Training multilingv (audio ElevenLabs) | P1 | 15h |
| 3 | REGES-Online integrare completă | P1 | 20h |
| 4 | Multilingv angajați străini (EN, NE, VI) | P2 | 10h |
| 5 | MVP curs video cu avatar | P2 | 4h |

## Q3 2026
| # | Feature | Prioritate | Estimare |
|---|---------|-----------|---------|
| 1 | White-label MVP | P2 | 30h |
| 2 | Marketplace v1 | P2 | 25h |
| 3 | HU launch | P1 | 20h |
| 4 | DE cercetare completă | P1 | 15h |

---

# 4. OBIECTIVE TRIMESTRIALE

## Q1 2026 (Jan-Mar) — "Fundație + Primul Export"
- ✅ 31 features live (realizat 9 feb — depășit target de 14)
- ✅ RBAC Dinamic funcțional (8 feb)
- ✅ RLS complet verificat (8 feb)
- ✅ next-intl implementat (9 feb)
- ✅ Multi-tenant complet 5 țări (9 feb)
- ✅ Landing BG/HU/DE/PL live (9 feb)
- ✅ Validare piață DE+HU (8 feb)
- ✅ Conținut instruire RO 4 module + 85 quiz (9 feb)
- 🔴 Fișă instruire PDF conformă ITM
- 🔴 Primele contacte BG (Mediko, Building Week)
- 🔴 Eur.Erg. dosar depus
- 🔴 Polița RCP activă
- 🔴 Email-uri beta DE + HU

## Q2 2026 (Apr-Jun) — "Revenue Export + Certificări"
- [ ] Primii 5 clienți BG (pilot)
- [ ] Primii 2 clienți DE (modul multilingv)
- [ ] NIS2 examen + modul live
- [ ] ITC Level 1 Termografie
- [ ] WELL AP
- [ ] Stripe live (plăți automate)
- [ ] 40 features live

## Q3 2026 (Jul-Sep) — "Scalare"
- [ ] 20 clienți BG
- [ ] 10 clienți DE/AT
- [ ] Break-even Bulgaria (luna 8)
- [ ] White-label partener activ
- [ ] 50 features live

## Q4 2026 (Oct-Dec) — "Consolidare"
- [ ] €75,000 ARR
- [ ] 3 piețe active (RO, BG, DE)
- [ ] Ungaria pilot start
- [ ] 60+ features live

---

# 5. METRICI DE SUCCES

| Metrică | Acum (9 feb) | Target Q2 | Target Q4 |
|---------|-------------|----------|----------|
| Features LIVE | 31 | 40 | 60 |
| Clienți RO | 100+ | 120 | 150 |
| Clienți BG | 0 | 5 (pilot) | 20 |
| Clienți DE | 0 | 2 | 10 |
| ARR | ~€20,000 | ~€35,000 | ~€75,000 |
| Limbi active | 5 (RO,BG,HU,DE,PL) | 7 (+EN,NE) | 8 (+VI) |
| Certificări noi | 0 | 3 (NIS2, ITC, Eur.Erg.) | 5 |
| Module instruire | 4 RO | 4 RO + 2 BG | 4×5 limbi |

---

# 6. RISCURI ȘI MITIGĂRI

| Risc | Probabilitate | Impact | Mitigare |
|------|:---:|:---:|---------|
| Feature creep (107 → overwhelm) | CERT | MARE | Focus Sprint 5-6 (PDF+Onboarding). Restul = backlog |
| Solo developer burnout | MARE | CRITIC | Claude Code paralel 2 laptopuri. Max 3 features/sprint |
| Bulgaria adoptare lentă | MEDIU | MARE | Freemium + pilot gratuit 3 luni |
| Competitor copiază | SCĂZUT | MEDIU | Moat-uri: 20 ani experiență + MABS-VA + multi-tenant 5 țări |
| RLS breach (date expuse) | SCĂZUT | CRITIC | RBAC complet + testare manuală |
| Polița RCP lipsă | CERT | MARE | Sună broker ASAP |
| Traduceri inexacte (BG/HU/DE/PL) | MEDIU | MEDIU | Validare cu native speakers + parteneri locali |

---

# 7. DECIZII CARE AȘTEAPTĂ (Daniel decide)

| # | Decizie | Opțiuni | Impact |
|---|---------|---------|--------|
| 1 | Hetzner migration timeline? | A) Martie / B) Aprilie / C) Rămâi Vercel | Cost €15.90/lună vs €0 |
| 2 | Cont bancar BG: Revolut sau Wise? | A) Revolut / B) Wise / C) DSK Bank | Operațional BG |
| 3 | Mediko: white-label sau parteneriat? | A) White-label / B) Referral / C) Direct | Strategie BG |
| 4 | CRUD forms: acum sau după PDF? | A) Acum / B) După PDF | PDF = revenue, CRUD = convenience |
| 5 | Audio instruire: ElevenLabs sau later? | A) Martie / B) Mai | Nice-to-have vs must-have |

---

# 8. AUDIT TRAIL DOCUMENT

| Versiune | Data | Schimbări |
|----------|------|----------|
| v1.0 | Ian 2026 | Creare |
| v3.0 | 3 Feb 2026 | Consolidare 70+ chaturi |
| v4.0 | 8 Feb 2026 | RBAC P0.0 BLOCANT adăugat |
| v4.1 | 8 Feb 2026 | Restaurat P2 revenue, Sprint 3 BG detaliat, backlog complet, certificări |
| **v4.2** | **9 Feb 2026** | **Multi-tenant 5 faze COMPLETAT. Features LIVE: 14→31. Conținut instruire RO 4 module + 85 quiz. Fuziune v4.0+v4.1. Metrici actualizate. Sprint-uri viitoare reordonat (PDF+Onboarding prioritare).** |
