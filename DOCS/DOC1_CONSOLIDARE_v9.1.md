# DOC1_CONSOLIDARE — S-S-M.RO
> **Versiune:** 9.1 | **Data:** 9 Februarie 2026
> **Changelog v9.1:** Toate 5 fazele multi-tenant COMPLETATE, 31 funcționalități LIVE, prețuri locale, penalties calculator

---

# 1. VIZIUNE ȘI STRATEGIE

## 1.1 Ce este s-s-m.ro
Platformă digitală SaaS de management SSM/PSI pentru firme mici și mijlocii. PWA (Progressive Web App) cu acces de pe orice dispozitiv.

## 1.2 Propunere de valoare
- Conformitate SSM/PSI simplificată — un singur loc
- Acces 24/7 din orice loc (cloud)
- Instruiri de urgență instant (angajat nou → test în 30 min)
- Multilingv (RO, EN, NE, VI — MVP; apoi BG, HU, DE, PL)
- 20+ ani experiență consultanță → digitalizat în platformă

## 1.3 Audiențe (4 segmente)
1. **SME-uri românești** (300K+ angajatori) — target principal
2. **Muncitori străini** (300K+ în RO) — interfață în limba nativă
3. **Consultanți SSM** (1.500+ firme autorizate) — marketplace + tools
4. **Corporate** — enterprise features

## 1.4 🆕 Viziune multi-country (27 țări EU)
- **Faza 1 (acum):** România (s-s-m.ro) — produs matur
- **Faza 2 (Q2 2026):** Bulgaria (s-s-m.ro/bg → bzr24.bg), Ungaria (s-s-m.ro/hu)
- **Faza 3 (Q3-Q4 2026):** Germania (as-dig.de), Polonia (bhp24.pl)
- **Faza 4 (2027):** Restul EU (27 țări, domenii deja achiziționate)

---

# 2. ARHITECTURĂ TEHNICĂ

## 2.1 Tech Stack
| Component | Tehnologie | Status |
|-----------|-----------|--------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS | ✅ LIVE |
| Backend | Supabase (PostgreSQL + Auth + Storage + RLS) | ✅ LIVE |
| Hosting | Vercel (Edge Network) | ✅ LIVE |
| Email | Resend (alerte@s-s-m.ro, DKIM+SPF+DMARC) | ✅ LIVE |
| Cron | Vercel Cron (zilnic 08:00) | ✅ LIVE |
| PWA | next-pwa + manifest.json | ✅ LIVE |
| IDE | Cursor + Claude Code | ✅ Activ |
| Repo | GitHub (danielvicentiu/s-s-m-app) | ✅ Activ |
| i18n | next-intl v4.8.2 (path-based routing) | ✅ LIVE |

## 2.2 Supabase Project
- **URL:** uhccxfyvhjeudkexcgiq.supabase.co
- **Folder local:** C:\Dev\s-s-m-app
- **Dashboard:** https://app.s-s-m.ro

## 2.3 Database Schema — 28+ tabele

### Tabele CORE (existente, cu RLS):
| Tabel | Scop | RLS |
|-------|------|-----|
| organizations | Firme client | ✅ |
| profiles | Profiluri utilizatori | ✅ |
| memberships | Asocieri user↔org (role vechi) | ✅ |
| employees | Angajați per organizație | ✅ |
| locations | Locații/puncte de lucru | ✅ |
| medical_records | Fișe medicina muncii | ✅ |
| safety_equipment | Echipamente PSI (stingătoare, hidranți) | ✅ |
| notification_log | Jurnal notificări trimise | ✅ |
| training_modules | Module instruire (9 cursuri) | ✅ |
| training_assignments | Atribuiri cursuri→angajați | ✅ |
| training_sessions | Sesiuni cu progres, quiz, certificat | ✅ |

### 🆕 Tabele RBAC (migrate 8 feb 2026, LIVE):
| Tabel | Scop | RLS |
|-------|------|-----|
| roles | 27 roluri (4 system + per țară) | ✅ |
| permissions | Permisiuni granulare per rol (~210 total) | ✅ |
| user_roles | Asocieri user↔rol↔org | ✅ |

### Tabele EXTENDED (existente):
| Tabel | Scop | RLS |
|-------|------|-----|
| jurisdictions | Jurisdicții legale per țară | ✅ |
| authorities | Autorități de control (ITM, IGSU, etc.) | ✅ |
| alert_preferences | Preferințe alerte per user | ✅ |
| countries | Țări cu configurări | ✅ |
| document_templates | Template-uri documente | ✅ |

### Tabele REGES (existente, status ⚠️ — verifică cu SELECT):
reges_outbox, reges_receipts, reges_results SAU reges_transmissions, reges_nomenclatures, reges_employee_snapshots, reges_audit_log

### 🆕 Tabele CONFIGURABILE (create 9 feb 2026, LIVE):
| Tabel | Scop | RLS | Records |
|-------|------|-----|---------|
| obligation_types | Obligații legale per țară (12 tipuri × 5 țări) | ✅ | ~60 |
| alert_categories | Categorii alerte per țară | ✅ | ~60 |
| equipment_types | Tipuri echipamente per țară (stingătoare, ISCIR, etc.) | ✅ | ~103 |

## 2.4 Views și Funcții
- **5 views dashboard:** v_dashboard_overview, v_active_alerts, v_medical_status, v_equipment_status, v_training_progress
- **41 indexuri** performanță
- **7 funcții RBAC:** rbac_has_role(), rbac_has_role_in_org(), rbac_get_my_org_ids(), rbac_is_super_admin(), rbac_has_permission(), etc.
- **Fallback:** Funcțiile RBAC au fallback pe memberships (zero downtime la migrare)

## 2.5 🆕 Arhitectură Multi-Tenant (LIVE din 9 feb 2026)

```
ROUTING: Path-based (next-intl v4.8.2) — LIVE
  s-s-m.ro/ro  → locale=ro, country=RO, currency=RON  ✅
  s-s-m.ro/bg  → locale=bg, country=BG, currency=EUR  ✅
  s-s-m.ro/hu  → locale=hu, country=HU, currency=HUF  ✅
  s-s-m.ro/de  → locale=de, country=DE, currency=EUR  ✅
  s-s-m.ro/pl  → locale=pl, country=PL, currency=PLN  ✅

DOMAIN_CONFIG pregătit (middleware.ts):
  bzr24.bg  → middleware detectează host → locale=bg
  sst24.hu  → middleware detectează host → locale=hu
  as-dig.de → middleware detectează host → locale=de
  bhp24.pl  → middleware detectează host → locale=pl

TRADUCERI: 5 fișiere JSON complete (129 chei × 5 limbi)
  messages/ro.json ✅  messages/bg.json ✅  messages/hu.json ✅
  messages/de.json ✅  messages/pl.json ✅

PREȚURI LOCALE:
  RO: 990 LEI/an | BG: 199 EUR/an | HU: 74.900 HUF/an
  DE: 399 EUR/an | PL: 1.690 PLN/an
```

---

# 3. 🆕 SISTEM RBAC DINAMIC (LIVE din 8 feb 2026)

## 3.1 De la 3 roluri hardcodate → 27 roluri dinamice

### Roluri System (TIER 1 — globale):
| Rol | Permisiuni | Scop |
|-----|-----------|------|
| super_admin | ~114 | Daniel + viitori super admini |
| consultant_ssm | ~75 | Consultanți SSM autorizați |
| firma_admin | ~16 | Administratori firme client |
| angajat | ~5 | Angajați (doar citire proprie) |

### Roluri România (TIER 2):
partener_contabil, furnizor_psi, furnizor_iscir_rsvti, medic_medicina_muncii, auditor_extern, inspector_itm, inspector_igsu, inspector_anspdcp, lucrator_desemnat, white_label_stm, responsabil_ssm_intern, training_provider, responsabil_nis2

### Roluri per țară (TIER 3):
- **BG:** zbut_specialist, git_inspector, stm_partner
- **HU:** munkavedelmi_specialist, ommf_inspector
- **DE:** sicherheitsingenieur, betriebsarzt, bg_inspector
- **PL:** bhp_specialist, pip_inspector

## 3.2 Admin UI
- **URL:** https://app.s-s-m.ro/admin/roles
- **Funcțional:** Lista 27 roluri ✅, Editare rol cu matrice permisiuni ✅, Creare rol nou ✅, Asignare roluri la useri ✅
- **Principiu:** Admin creează/modifică/șterge roluri din UI. Zero cod, zero deploy.

## 3.3 Middleware & Lib
- `lib/rbac.ts` — funcții server-side cu React cache(), fallback pe memberships
- `hooks/usePermission.ts` — client-side permission check
- `middleware.ts` — rute protejate per rol + fallback

## 3.4 RLS Policies
- **25+ tabele** cu policies `rbac_*` noi
- **Policies vechi** păstrate 30 zile (cleanup planificat)
- **Verificare:** 8 queries post-migrare executate ✅

---

# 4. FUNCȚIONALITĂȚI — STATUS

## 4.1 LIVE (14/107 + RBAC)
| # | Funcționalitate | Status |
|---|----------------|--------|
| 1 | Landing page | ✅ LIVE |
| 2 | Auth email+parolă | ✅ LIVE |
| 3 | Auth magic link | ✅ LIVE |
| 4 | Dashboard cu date reale Supabase | ✅ LIVE |
| 5 | Email alerte via Resend | ✅ LIVE |
| 6 | Vercel Cron zilnic 08:00 | ✅ LIVE |
| 7 | Secțiune "Ultimele Notificări" | ✅ LIVE |
| 8 | Training modules (9 cursuri) | ✅ LIVE |
| 9 | Training assignments | ✅ LIVE |
| 10 | Training sessions cu progres | ✅ LIVE |
| 11 | Certificat PDF auto-generat | ✅ LIVE |
| 12 | Equipment management (safety_equipment) | ✅ LIVE |
| 13 | Medical records management | ✅ LIVE |
| 14 | Multi-location per organizație | ✅ LIVE |
| 🆕15 | RBAC Admin UI (/admin/roles) | ✅ LIVE |
| 🆕16 | RBAC funcții helper (7 funcții) | ✅ LIVE |
| 🆕17 | RBAC RLS pe 25+ tabele | ✅ LIVE |
| 🆕18 | next-intl path-based routing (5 limbi) | ✅ LIVE |
| 🆕19 | Tabele configurabile (obligation_types, alert_categories, equipment_types) | ✅ LIVE |
| 🆕20 | Admin UI obligații (/admin/obligations) | ✅ LIVE |
| 🆕21 | Admin UI alerte (/admin/alert-categories) | ✅ LIVE |
| 🆕22 | Admin UI echipamente (/admin/equipment-types) | ✅ LIVE |
| 🆕23 | Admin UI țări (/admin/countries) | ✅ LIVE |
| 🆕24 | Dashboard dinamic (citește din DB, nu hardcoded) | ✅ LIVE |
| 🆕25 | Landing pages 5 țări cu prețuri locale | ✅ LIVE |
| 🆕26 | Penalties Calculator dinamic (din obligation_types) | ✅ LIVE |
| 🆕27 | Traduceri complete 5 limbi (129 chei × 5) | ✅ LIVE |
| 🆕28 | Selector limbă (steaguri emoji) | ✅ LIVE |
| 🆕29 | CountryFilter component reutilizabil | ✅ LIVE |
| 🆕30 | DOMAIN_CONFIG pregătit (middleware) | ✅ LIVE |
| 🆕31 | Server/Client component split (landing) | ✅ LIVE |

## 4.2 PLANIFICAT PRIORITAR
| # | Funcționalitate | Prioritate |
|---|----------------|-----------|
| 22 | CRUD forms complete (înlocuiește placeholders) | P1 |
| 23 | Onboarding wizard client ("Adaugă firma ta") | P1 |
| 24 | Fișă instruire PDF conformă ITM | P0 — MONEY MAKER |
| 25 | Conținut instruire RO (4 module text) | P1 |
| 26 | Quiz bank (85 întrebări cu referințe legale) | P1 |
| 27 | WhatsApp alerts (Green API) | P2 |
| 28 | Audio instruire (ElevenLabs) | P3 |
| 29 | Multilingv angajați străini (EN, NE, VI) | P2 |

## 4.3 BACKLOG (93 funcționalități rămase din 107)
[Vezi DOC3 pentru lista completă cu sprint-uri]

---

# 5. REVENUE MODEL

## 5.1 Prețuri per țară
| Țară | Preț/an | Monedă | Tier |
|------|---------|--------|------|
| România | 990 LEI | RON | Standard |
| Bulgaria | 199 EUR | EUR | Entry (piață nouă) |
| Ungaria | ~75.000 HUF | HUF | TBD |
| Germania | 299-499 EUR | EUR | Premium |
| Polonia | ~1.200 PLN | PLN | TBD |

## 5.2 Proiecții
- An 1: 100+ clienți RO × €200 = €20.000
- An 2: +BG +HU = €50.000-80.000
- An 3: +DE +PL = €125.000-200.000
- An 5: 27 țări target = €1.4M

## 5.3 Validare piață
- 4 contacte DE "entuziasmați"
- 2 contacte HU "interesați"
- BG: Nicio platformă digitală SSM pentru SME-uri (oportunitate majoră)

---

# 6. COMPETIȚIE

| Feature | ssmatic.ro | gossm.ro | ssm-romania.ro | **S-S-M.RO** |
|---------|-----------|----------|----------------|-------------|
| Documente gratuite | ✅ Static | ✅ Dinamic | ❌ | ✅ Generator |
| Instruiri online | ❌ | ✅ | ❌ | ✅ Video/Audio |
| Semnătură digitală | ❌ | ✅ OTP | ❌ | ✅ OTP+eIDAS |
| Marketplace consultanți | ❌ | ⚠️ | ✅ Hartă | ✅ Hartă+Ratings |
| Multilingv | ❌ | ❌ | ❌ | ✅ 6+ limbi |
| AI Assistant | ❌ | ❌ | ❌ | ✅ Planificat |
| Multi-country | ❌ | ❌ | ❌ | 🆕 ✅ 27 țări |
| RBAC dinamic | ❌ | ❌ | ❌ | 🆕 ✅ 27 roluri |

---

# 7. CERTIFICĂRI ȘI AUTORIZAȚII

Daniel: ERC BLS Instructor, RSVTI, Formator ANC, Evaluator Risc Incendiu, NIS2 (examen iunie 2026), Consultant Fiscal CCF, Expert Legislația Muncii.

Firme separate autorizate: SSM (ITM), PSI, GDPR, Fiscal.

---

# 8. INTEGRĂRI PLANIFICATE

| Integrare | Scop | Status |
|-----------|------|--------|
| REGES | Registrul electronic salariați — import date angajați | ⚠️ Tabele create, API neconectat |
| certSIGN / Evrotrust | Semnătură electronică calificată | Planificat |
| WhatsApp (Green API) | Alerte instant | Planificat |
| HelloSign | Semnătură documente | Planificat |
| ANAF (e-Factura) | Facturare automată | Planificat |

---

# 9. DECIZII ARHITECTURALE CHEIE

| Data | Decizie | Rațional |
|------|---------|----------|
| Ian 2026 | Next.js + Supabase (nu WordPress) | Scalabilitate, PWA, multi-tenant |
| Ian 2026 | Vercel (nu self-hosted) | Edge network, auto-scaling, zero DevOps |
| Ian 2026 | Resend (nu SendGrid) | DKIM/SPF/DMARC nativ, pricing |
| 8 Feb 2026 | 🆕 RBAC dinamic (nu hardcoded) | 27 țări × roluri diferite = imposibil hardcoded |
| 9 Feb 2026 | 🆕 Path-based routing (Opțiunea C) | SEO nu e prioritate acum, simplitate maximă |
| 9 Feb 2026 | 🆕 Obligații identice RO inițial per toate țările | Rapid deployment, diferențiere ulterior |
| 9 Feb 2026 | 🆕 Un Supabase + country_code (nu DB separate) | Cost, complexitate, RLS deja funcțional |

---

# 10. RISCURI ȘI MITIGĂRI

| Risc | Severitate | Mitigare |
|------|-----------|----------|
| Solo developer bottleneck | 🔴 HIGH | Claude Code, automatizare maximă |
| Legislație diferită per țară | 🟡 MEDIUM | Tabele configurabile, admin UI |
| Competiție gossm.ro | 🟡 MEDIUM | Multi-country = diferențiator unic |
| Timeline comprimat | 🟡 MEDIUM | Path-based routing = rapid deployment |
| REGES API instabilitate | 🟡 MEDIUM | Fallback manual import |

---

# 11. LINKURI IMPORTANTE

- **App LIVE:** https://app.s-s-m.ro
- **GitHub:** https://github.com/danielvicentiu/s-s-m-app
- **Supabase:** uhccxfyvhjeudkexcgiq.supabase.co
- **Admin RBAC:** https://app.s-s-m.ro/admin/roles
- **Chat RBAC Migration:** https://claude.ai/chat/620ecea6-4396-4fa3-8a21-0ec60f143cdb
- **Chat SQL execution:** https://claude.ai/chat/9e209e0f-d595-46a2-8118-4d5fadf0ddf8
