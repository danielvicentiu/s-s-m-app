# DOC3_PLAN_EXECUTIE — S-S-M.RO
> **Versiune:** 4.1 | **Data:** 8 Februarie 2026
> **Scop:** Plan concret de execuție — CE, CÂND, CUM, CINE
> **Changelog v4.1:** RBAC Dinamic P0.0 BLOCANT cu instrucțiuni Claude Code. Corecție: restaurat P2 revenue features, Sprint 3 BG Go-Live detaliat, backlog Martie/Aprilie complet, certificări integrate în timeline.

---

# 1. PRIORITĂȚI IMEDIATE (Săptămâna 9-10 Feb 2026)

## P0 — FUNDAȚIE RBAC DINAMIC + SECURITATE (Blocker absolut)

| # | Task | Estimare | Instrucțiuni | Status |
|---|------|---------|-------------|--------|
| P0.0 | RESCRIERE RBAC: migrare de la 3 roluri hardcodate → schema dinamică (roles + permissions + user_roles cu country_code, JSONB conditions, field_restrictions) | 3-5 zile | Claude Code — instrucțiuni complete mai jos | 🔴 BLOCANT |
| P0.1 | Verificare RLS pe TOATE 25 tabelele (Supabase Dashboard) | 15 min | Check: Authentication → Policies per tabel | 🔴 VERIFICĂ |
| P0.2 | RLS actualizat pentru RBAC dinamic (verifică permisiuni din tabel, nu rol hardcodat) | 2h | Depinde de P0.0 | 🔴 |
| P0.3 | Admin UI management roluri (CRUD roluri + permisiuni fără cod) | 1 zi | /admin/roles → formular creare rol, setare permisiuni | 🔴 |
| P0.4 | Polița RCP — contactează broker asigurări | 1h | Daniel: sună luni dimineață | 🔴 URGENT |

## P1 — FUNDAȚIE EXPORT (Blocant pentru BG/HU/DE)

| # | Task | Estimare | Dependențe | Status |
|---|------|---------|-----------|--------|
| P1.1 | Instalare next-intl + configurare middleware | 2h | Claude Code instrucțiuni | 🔴 |
| P1.2 | Aplicare SQL multi-country pe Supabase | 30 min | SQL gata din consolidare | 🔴 |
| P1.3 | Deploy landing page BG pe Vercel | 1h | Cod gata: app/bg/page.tsx | 🔴 |
| P1.4 | Email beta DE (4 prieteni) | 30 min | Draft gata | 🔴 |
| P1.5 | Email beta HU (2 prieteni) | 30 min | Traducere necesară | 🔴 |

## P2 — FEATURES REVENUE (Generează venituri noi)

| # | Task | Estimare | Impact | Status |
|---|------|---------|--------|--------|
| P2.1 | Dicționar multilingv 100 expresii (RO+EN+Nepali+Hindi) | 3h | DIFERENȚIATOR #1 | 🔴 |
| P2.2 | MVP curs video cu avatar (1 curs pilot "Intro SSM") | 4h | Proof-of-concept e-learning | 🔴 |
| P2.3 | WhatsApp alerts (Green API) | 3h | Canal alternativ email | 🔴 |
| P2.4 | Generator documente SSM (fișe post, tematici) | 4h | Cerere top clienți | 🔴 |

---

# 2. SPRINT-URI PLANIFICATE

## Sprint 1: RBAC Dinamic + Securitate (9-16 Feb)
**Obiectiv:** Fundație roluri dinamice funcțională + zero vulnerabilități
**Blocant pentru:** Multi-country, White-label, orice rol nou

### Ziua 1 — Luni 10 Feb

**Task P0.0: Schema SQL RBAC**
Output: Tabelele roles, permissions, user_roles create și populate în Supabase

Instrucțiuni Claude Code:
```
Creează schema RBAC dinamică în Supabase.

1. CREATE TABLE roles (id UUID PK, role_key TEXT UNIQUE, role_name TEXT, description TEXT, country_code TEXT nullable, is_system BOOLEAN DEFAULT false, is_active BOOLEAN DEFAULT true, created_by UUID, created_at TIMESTAMPTZ, metadata JSONB DEFAULT '{}')

2. CREATE TABLE permissions (id UUID PK, role_id UUID FK→roles ON DELETE CASCADE, resource TEXT, action TEXT, field_restrictions JSONB DEFAULT '{}', conditions JSONB DEFAULT '{}', country_code TEXT nullable, is_active BOOLEAN DEFAULT true, UNIQUE(role_id, resource, action, country_code))

3. CREATE TABLE user_roles (id UUID PK, user_id UUID FK→auth.users ON DELETE CASCADE, role_id UUID FK→roles ON DELETE CASCADE, company_id UUID FK→organizations nullable, location_id UUID FK→locations nullable, granted_by UUID FK→auth.users, granted_at TIMESTAMPTZ DEFAULT now(), expires_at TIMESTAMPTZ nullable, UNIQUE(user_id, role_id, company_id))

4. INSERT 17 roluri RO: super_admin(NULL,true), consultant_ssm(NULL,true), firma_admin(NULL,true), angajat(NULL,true), partener_contabil(RO), furnizor_psi(RO), furnizor_iscir(RO), medic_mm(RO), auditor_extern(NULL), inspector_itm(RO), inspector_igsu(RO), inspector_anspdcp(RO), lucrator_desemnat(RO), white_label_stm(NULL), responsabil_ssm_intern(RO), training_provider(NULL), responsabil_nis2(NULL)

5. INSERT 10 roluri per țară: zbut_consultant_bg(BG), inspector_git_bg(BG), stm_partner_bg(BG), munkavedelmi_hu(HU), inspector_ommf_hu(HU), sicherheitsingenieur_de(DE), betriebsarzt_de(DE), berufsgenossenschaft_de(DE), specjalista_bhp_pl(PL), inspector_pip_pl(PL)

6. INSERT permisiuni TIER 1:
   - super_admin: ALL resources × ALL actions × no restrictions
   - consultant_ssm: employees/equipment/trainings/medical/documents/dashboard/reports/alerts × CRUD+export
   - firma_admin: employees(read+create), equipment(read), trainings(read), medical(read), dashboard(read), documents(read), alerts(read) — conditions: {"own_company": true}
   - angajat: trainings(read), medical(read own), documents(read own), dashboard(read own) — conditions: {"own_user": true}

7. RLS ENABLED pe cele 3 tabele noi.

Supabase project: uhccxfyvhjeudkexcgiq. Folder: C:\Dev\s-s-m-app.
```

**Task P0.4: Polița RCP** — Daniel sună broker.

### Ziua 2 — Marți 11 Feb

**Task P0.0: Middleware Next.js Autorizare Dinamică**
Output: Fiecare request verifică rol din DB, rutare per permissions

Instrucțiuni Claude Code:
```
Actualizează middleware Next.js pentru autorizare dinamică.

1. Creează lib/rbac.ts:
   - getMyRoles(userId): user_roles JOIN roles → array roluri active
   - hasPermission(userId, resource, action): permissions → boolean
   - getFieldRestrictions(userId, resource): field_restrictions JSONB
   - Cache cu React cache() per request

2. Actualizează middleware.ts:
   /admin/* → super_admin
   /consultant/* → consultant_ssm sau echivalent per țară
   /firma/* → firma_admin
   /angajat/* → angajat
   /inspector/* → inspector_*
   403 dacă fără permisiune

3. Sistem ÎN PARALEL cu cel vechi. Fallback pe memberships.role dacă user_roles gol.
```

### Ziua 3 — Miercuri 12 Feb

**Task P0.2: RLS Policies Actualizate**
Output: Toate 25+ tabele verifică permissions din DB

Instrucțiuni Claude Code:
```
Actualizează RLS pe TOATE tabelele.

PRINCIPIU: Fiecare policy verifică:
1. User are rol activ în user_roles (is_active, expires_at)
2. Rolul are permisiune pe resource + action
3. Condițiile JSONB satisfăcute (own_company, own_user)

APLICĂ pe: organizations, profiles, memberships, employees, locations, jurisdictions, medical_examinations, safety_equipment, training_modules, training_assignments, training_sessions, test_questions, notification_log, alert_preferences, generated_documents, fraud_alerts, organized_training_sessions, authorities, penalty_rules, penalty_visibility, reges_connections, reges_transmissions, reges_nomenclatures, reges_employee_snapshots, reges_audit_log + roles, permissions, user_roles.

Prefix 'rbac_' pe policies noi. NU șterge cele vechi până la testare.
```

### Ziua 4 — Joi 13 Feb

**Task P0.3: Admin UI /admin/roles**
Output: Daniel creează/modifică/șterge roluri din browser

Instrucțiuni Claude Code:
```
Creează /admin/roles:
1. /app/admin/roles/page.tsx — lista roluri (tabel cu filtrare per țară, buton "Adaugă Rol Nou")
2. /app/admin/roles/[id]/page.tsx — editare rol + secțiune PERMISIUNI editabilă (resource × action checkboxes)
3. /app/admin/roles/new/page.tsx — creare rol nou
4. /app/admin/roles/assign/page.tsx — asignare rol la user (dropdown user, rol, company, location, expires_at)

Doar super_admin accesează /admin/*. Verifică cu hasPermission.
Tailwind, consistent cu dashboard existent.
```

### Ziua 5 — Vineri 14 Feb

**Task P0.1: Verificare Completă + Teste**

Checklist:
- [ ] Login super_admin → vede tot
- [ ] Login consultant_ssm → vede doar firmele alocate
- [ ] Login firma_admin → vede doar firma lui
- [ ] Login angajat → vede doar datele proprii
- [ ] Creare rol nou din Admin UI → funcționează
- [ ] Asignare rol → funcționează
- [ ] Dezactivare rol → pierde acces instant
- [ ] expires_at → dezactivare automată
- [ ] RLS: firma_admin NU vede altă firmă (test SQL direct)
- [ ] Screenshot: Supabase Dashboard → RLS ENABLED ✅ pe toate

### Ziua 6 — Sâmbătă 15 Feb

Buffer + cleanup + documentare.

---

## Sprint 2: Multi-Country Fundație + Landing BG (17-22 Feb)
**Obiectiv:** Export-ready + primul contact BG
**Prerequisite:** Sprint 1 finalizat

| Zi | Task | Output concret |
|---|------|---------------|
| Luni 17 | P1.1: next-intl install + config | /ro/ și /bg/ routes funcționale |
| Marți 18 | P1.2: SQL multi-country aplicat | Tabele countries + document_templates populate |
| Miercuri 19 | P1.3: Landing BG deploy | URL live verificabil |
| Joi 20 | P1.4 + P1.5: Email-uri beta DE + HU | 6 email-uri trimise (4 DE + 2 HU) |
| Vineri 21 | P2.1: Dicționar multilingv 50 expresii | Pagina /dictionary funcțională |

Instrucțiuni Claude Code next-intl:
```
npm install next-intl
Structură: messages/ro.json, messages/bg.json, messages/hu.json, messages/de.json
i18n.ts (default: 'ro'), middleware.ts cu i18n routing
Restructurare: app/ → app/[locale]/
Toate textele hardcodate → useTranslations()
Test: /ro/dashboard + /bg/dashboard funcționează
```

---

## Sprint 3: Bulgaria Go-Live (23 Feb - 1 Mar)
**Obiectiv:** Primul contact real cu piața BG

| Zi | Task | Output concret |
|---|------|---------------|
| Luni 24 | Pitch deck Mediko.org finalizat | PDF 10 slides |
| Marți 25 | Email outreach: Mediko + Av. Marinov + Camera Comerț RO-BG | 3 email-uri trimise |
| Miercuri 26 | Pregătire Bulgaria Building Week (Sofia, Martie) | Materiale + plan vizită |
| Joi 27 | Cont bancar BG (Revolut Business sau Wise) | Cont activ |
| Vineri 28 | Răspunsuri beta DE/HU — colectare feedback | Document feedback consolidat |

---

# 3. BACKLOG PRIORITIZAT (Lunile 2-3)

## Martie 2026
| # | Feature | Prioritate | Estimare |
|---|---------|-----------|---------|
| 1 | Bulgaria Building Week (Sofia) — prezență fizică | P1 | 2-3 zile deplasare |
| 2 | NIS2 modul — pregătire conținut (examen iunie) | P2 | 10h |
| 3 | Raportare neconformități PWA (GPS + poză) | P2 | 8h |
| 4 | Generator documente extins (10 tipuri ITM) | P2 | 12h |
| 5 | Hetzner migration (de la Vercel) | P2 | 4h |
| 6 | Eur.Erg. dosar CREE — depunere | P1 | 5h |

## Aprilie 2026
| # | Feature | Prioritate | Estimare |
|---|---------|-----------|---------|
| 1 | Stripe integrare (plăți automate) | P1 | 8h |
| 2 | certSIGN AES semnătură electronică RO | P2 | 6h |
| 3 | Evrotrust QES integrare BG | P2 | 6h |
| 4 | WELL AP certificare ($299) | P2 | Studiu + examen |
| 5 | Onboarding primii 5 clienți BG (pilot gratuit) | P1 | Ongoing |
| 6 | EurOSHM dosar | P2 | 4h |

## Mai-Iunie 2026
| # | Feature | Prioritate | Estimare |
|---|---------|-----------|---------|
| 1 | NIS2 examen (IUNIE) + modul live | P1 | Examen + 20h |
| 2 | Training multilingv (audio ElevenLabs) | P1 | 15h |
| 3 | REGES-Online integrare completă | P1 | 20h |
| 4 | Neacțiune Vizibilă protocol complet | P2 | 8h |
| 5 | Calculator SSM-PSI | P2 | 10h |
| 6 | WhatsApp alerte | P2 | 3h |

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
- ✅ 14 features live (realizat)
- ✅ Manual v8.0 consolidat (realizat 8 feb)
- ✅ Validare piață DE+HU (realizat 8 feb)
- 🔴 RBAC Dinamic funcțional
- 🔴 RLS complet verificat
- 🔴 next-intl implementat
- 🔴 Landing BG live
- 🔴 Primele contacte BG (Mediko, Building Week)
- 🔴 Eur.Erg. dosar depus
- 🔴 Polița RCP activă

## Q2 2026 (Apr-Jun) — "Revenue Export + Certificări"
- [ ] Primii 5 clienți BG (pilot)
- [ ] Primii 2 clienți DE (modul multilingv)
- [ ] NIS2 examen + modul live
- [ ] ITC Level 1 Termografie
- [ ] WELL AP
- [ ] Stripe live (plăți automate)
- [ ] 25 features live (de la 14)

## Q3 2026 (Jul-Sep) — "Scalare"
- [ ] 20 clienți BG
- [ ] 10 clienți DE/AT
- [ ] Break-even Bulgaria (luna 8)
- [ ] White-label partener activ
- [ ] 40 features live

## Q4 2026 (Oct-Dec) — "Consolidare"
- [ ] €75,000 ARR
- [ ] 3 piețe active (RO, BG, DE)
- [ ] Ungaria pilot start
- [ ] 50+ features live

---

# 5. METRICI DE SUCCES

| Metrică | Acum | Target Q2 | Target Q4 |
|---------|------|----------|----------|
| Features LIVE | 14 | 25 | 50 |
| Clienți RO | 100+ | 120 | 150 |
| Clienți BG | 0 | 5 (pilot) | 20 |
| Clienți DE | 0 | 2 | 10 |
| ARR | ~€20,000 | ~€35,000 | ~€75,000 |
| Limbi active | 1 (RO) | 4 (RO, BG, EN, HU) | 6 |
| Certificări noi | 0 | 3 (NIS2, ITC, Eur.Erg.) | 5 |

---

# 6. RISCURI ȘI MITIGĂRI

| Risc | Probabilitate | Impact | Mitigare |
|------|:---:|:---:|---------|
| Feature creep (107 → overwhelm) | CERT | MARE | Taie 50% din ⚪ idei. Focus doar pe 🔴 |
| Solo developer burnout | MARE | CRITIC | Claude Code + n8n. Max 3 features/sprint |
| Bulgaria adoptare lentă | MEDIU | MARE | Freemium + pilot gratuit 3 luni |
| Competitor copiază | SCĂZUT | MEDIU | Moat-uri: 20 ani + MABS-VA + Entropy Check |
| RLS breach (date expuse) | SCĂZUT | CRITIC | P0 — rezolvă ÎNAINTE de orice |
| Polița RCP lipsă | CERT | MARE | Sună broker LUNI |

---

# 7. DECIZII CARE AȘTEAPTĂ (Daniel decide)

| # | Decizie | Opțiuni | Impact |
|---|---------|---------|--------|
| 1 | Taie din cele 44 idei (⚪)? | A) Da, taie 50% / B) Păstrează backlog | Focalizare vs. optionalitate |
| 2 | Hetzner migration timeline? | A) Martie / B) Aprilie / C) Rămâi Vercel | Cost €15.90/lună vs €0 |
| 3 | Cont bancar BG: Revolut sau Wise? | A) Revolut / B) Wise / C) DSK Bank | Operațional BG |
| 4 | Mediko: white-label sau parteneriat? | A) White-label / B) Referral / C) Direct | Strategie BG |
| 5 | Limba maghiară: rămâne FREE? | A) Da / B) Mută la Pro | Promisiune vs. resource |

---

# 8. AUDIT TRAIL DOCUMENT

| Versiune | Data | Schimbări |
|----------|------|----------|
| v1.0 | Ian 2026 | Creare |
| v3.0 | 8 Feb 2026 | Consolidare 70+ chaturi |
| **v4.1** | **8 Feb 2026** | **RBAC P0.0 BLOCANT cu instrucțiuni Claude Code per task. Corecție v4.0: restaurat P2 revenue features (dicționar, video, WhatsApp, generator documente), Sprint 3 BG Go-Live detaliat, backlog Martie/Aprilie/Mai-Iunie complet, certificări integrate (NIS2, ITC, WELL AP, Eur.Erg., EurOSHM).** |

---

> **NOTĂ:** Plan actualizat la finalul fiecărui sprint. Sprint 1 RBAC = BLOCANT.
