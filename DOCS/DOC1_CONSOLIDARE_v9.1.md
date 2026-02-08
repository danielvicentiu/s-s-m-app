# DOC1_CONSOLIDARE — S-S-M.RO
> **Versiune:** 9.1 | **Data:** 8 Februarie 2026
> **Scop:** Sursă unică de adevăr — VIZIUNE COMPLETĂ a proiectului s-s-m.ro
> **Changelog v9.1:** RBAC Dinamic 17+ roluri, Viziune Exhaustivă 20 secțiuni, Glosar 30+ termeni. Corecție: restaurat tot conținutul din v8.1 + adăugări noi.

---

## GLOSAR AUTOMAT

| Termen | Explicație | Context |
|--------|-----------|---------|
| **SSM** | Securitate și Sănătate în Muncă | Cadru legislativ RO (Legea 319/2006) |
| **PSI** | Prevenire și Stingere Incendii | Cadru legislativ RO (Legea 307/2006) |
| **RBAC** | Role-Based Access Control | Sistem de control acces bazat pe roluri — cine vede ce, cine face ce |
| **RLS** | Row Level Security | Politici PostgreSQL/Supabase — restricționează accesul la nivel de rând |
| **JSONB** | JSON Binary | Tip PostgreSQL — JSON indexabil, folosit pentru metadata flexibilă |
| **ITM** | Inspectoratul Teritorial de Muncă | Autoritate control SSM în România |
| **IGSU** | Inspectoratul General pentru Situații de Urgență | Autoritate control PSI în România |
| **ANSPDCP** | Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal | Autoritate GDPR România |
| **REGES** | Registrul Electronic de Evidență a Salariaților | Sistem ITM obligatoriu — înlocuiește REVISAL |
| **STM** | Служба по трудова медицина (BG) | Serviciu Medicina Muncii — furnizor autorizat SSM Bulgaria |
| **ЗБУТ** | Здравословни и безопасни условия на труд | SSM în Bulgaria |
| **ГИТ** | Главна инспекция по труда | Inspecția Muncii Bulgaria — echivalent ITM |
| **NIS2** | Network and Information Security Directive 2 | Directivă UE 2022/2555 securitate cibernetică |
| **ISCIR** | Inspecția de Stat pentru Controlul Cazanelor, Recipientelor sub Presiune și Instalațiilor de Ridicat | Autoritate RO echipamente sub presiune |
| **RSVTI** | Responsabil cu Supravegherea Tehnică a Instalațiilor | Persoană certificată ISCIR |
| **BLS** | Basic Life Support | Protocol resuscitare — Daniel e instructor ERC |
| **AES** | Advanced Electronic Signature | Semnătură electronică avansată (certSIGN RO) |
| **QES** | Qualified Electronic Signature | Semnătură electronică calificată (Evrotrust BG) — cel mai înalt nivel legal |
| **EOOD** | Еднолично дружество с ограничена отговорност | SRL asociat unic Bulgaria |
| **OOD** | Дружество с ограничена отговорност | SRL Bulgaria |
| **PWA** | Progressive Web App | Aplicație web funcțională offline, instalabilă pe telefon |
| **MABS-VA** | [CONFIDENȚIAL] | Modul biometric/ergonomic avansat — zero detalii până validare + OSIM |
| **Entropy Check** | Verificare anti-fraudă instruiri | Detectează răspunsuri identice, timing suspect |
| **Neacțiune Vizibilă** | Protocol documentat 15 zile | Dovadă că angajatorul a fost notificat și nu a acționat |
| **Concierge / Digital Sedative** | Filozofia platformei | Clientul cumpără LINIȘTE, nu un tool |
| **CCF** | Camera Consultanților Fiscali | Organism profesional RO |
| **OMMF** | Országos Munkavédelmi és Munkaügyi Főfelügyelőség | Inspecția Muncii Ungaria |
| **BG (Berufsgenossenschaft)** | Asociația Profesională | Organism german asigurări accidente muncă |
| **PIP** | Państwowa Inspekcja Pracy | Inspecția Muncii Polonia |
| **BHP** | Bezpieczeństwo i Higiena Pracy | SSM în Polonia |
| **CAEN** | Clasificarea Activităților din Economia Națională | Cod activitate economică RO |
| **QuickValid** | Verificare identitate instruire | Selfie + semnătură + device info — dovadă prezență |
| **Cascadă** | Logica moștenire periodicitate | Angajat → Loc muncă → Firmă → Default |
| **ZZUT/ЗЗБУТ** | Закон за здравословни и безопасни условия на труд | Legea SSM Bulgaria |
| **ArbSchG** | Arbeitsschutzgesetz | Legea protecției muncii Germania |
| **DGUV** | Deutsche Gesetzliche Unfallversicherung | Asigurare legală accidente Germania |

---

# 1. CE ESTE S-S-M.RO

## 1.1 Definiție
SaaS multi-country pentru managementul conformității SSM (Securitate și Sănătate în Muncă) și PSI (Prevenire și Stingere Incendii). Destinat consultanților autorizați și STM-urilor din Europa Centrală și de Est.

## 1.2 Filozofie: "Concierge / Digital Sedative"
Clientul cumpără **LINIȘTE**, nu un tool. Platforma e instrumentul prin care consultantul oferă servicii premium automatizate. "Vinzi liniște" — nu software.

**Strategia de vânzare (pas cu pas):**
1. Câștigă încrederea clientului prin consultanță personalizată (cum face Daniel de 20+ ani)
2. Introduce platforma ca "asistent" care monitorizează totul automat
3. Clientul vede valoarea: alerte automate, documente gata, examene programate
4. Dezvălui gradul complet de automatizare doar DUPĂ ce clientul e dependent de confort
5. Upsell natural: module suplimentare, alerte suplimentare, acces parteneri

## 1.3 Ce NU suntem
- **NU ERP** — nu gestionăm contabilitate, facturare generală, HR complet
- **NU LMS generic** — instruirile sunt specifice SSM/PSI, nu cursuri generice
- **NU competăm pe preț** — competăm pe expertiza transpusă în cod
- **NU SaaS impersonal** — fiecare client are un consultant dedicat

## 1.4 Calculator Unic SSM-PSI
Instrument unic pe piață: estimează costul conformității SSM+PSI pe baza nr. angajați, CAEN, nr. puncte de lucru, echipamente. Include estimare amenzi potențiale vs. cost serviciu. **Diferențiator de vânzare major** — niciun competitor oferă asta.

---

# 2. DIFERENȚIATORI UNICI (MOAT)

| # | Moat | Descriere | Nivel Implementare |
|---|------|-----------|-------------------|
| 1 | **20+ ani experiență SSM** | Logica de business din practică reală — sute de controale ITM | 🟡 Transpus parțial în cod |
| 2 | **Instruire audio multilingvă** | Limbi rare: nepaleză, vietnameză, sinhaleză, bangla, hindi, urdu + standard (EN, FR, DE, HU, BG). Zero competitori | 🔴 Planificat (ElevenLabs API) |
| 3 | **Multi-country nativ** | RO, BG, HU, DE, PL — conformitate legală per jurisdicție, nu doar traducere | 🟡 Schema SQL gata, neaplicat |
| 4 | **Entropy Check v2** | Anti-fraudă: răspunsuri identice consecutive, timing <3s, pattern-uri grup | 🟡 Cod parțial, netestat |
| 5 | **Neacțiune Vizibilă** | Protocol 15 zile: notificare → reminder 7 zile → reminder 3 zile → escalare. Timestamp + delivery confirmation pe fiecare pas | 🔴 Protocol definit, cod negenerat |
| 6 | **MABS-VA** | **CONFIDENȚIAL** — Zero mențiuni publice/private până la validare + OSIM | ⬛ SECRET |
| 7 | **Termografie ITC Level 1** | Expertiză Daniel — modul Li-Ion Safety, senzori termici, LoRaWAN | ⚪ Idee, tabel sensor_gateways definit |

---

# 3. STACK TEHNIC

| Componentă | Tehnologie | Status |
|------------|-----------|--------|
| Frontend | Next.js 14 (App Router) PWA | ✅ LIVE |
| Backend/DB | Supabase (PostgreSQL + Auth + Edge Functions + Storage) | ✅ LIVE |
| Hosting actual | Vercel | ✅ LIVE |
| Hosting viitor | Hetzner CPX31 €15.90/lună (martie 2026 — s-s-m.ro + stiri24-7 + stiripeglob.ro) | 🔄 PLANIFICAT |
| Email | Resend (alerte@s-s-m.ro, DKIM+SPF+DMARC) | ✅ LIVE |
| Cron | Vercel Cron (zilnic 08:00) | ✅ LIVE |
| i18n | next-intl | 🔴 DE IMPLEMENTAT |
| Plăți | Stripe (multi-currency: EUR, RON, BGN, HUF) | 🔴 PLANIFICAT |
| Automatizări | n8n | 🔴 PLANIFICAT |
| PDF | Puppeteer / React-PDF | 🟡 PARȚIAL |
| Semnătură electronică | certSIGN AES (RO) / Evrotrust QES (BG) | 🔴 PLANIFICAT |
| Video | Cloudflare Stream / Bunny | 🔴 PLANIFICAT |
| Audio instruiri | ElevenLabs | 🔴 PLANIFICAT |
| Traduceri | DeepL API | 🔴 PLANIFICAT |
| IDE | Cursor | ✅ |
| Repo | GitHub | ✅ |

**Link-uri:**
- Dashboard live: https://app.s-s-m.ro (sau https://s-s-m-app.vercel.app/dashboard)
- GitHub: https://github.com/danielvicentiu/s-s-m-app
- Folder local: C:\Dev\s-s-m-app
- Supabase: uhccxfyvhjeudkexcgiq.supabase.co
- Vercel: https://vercel.com/daniels-projects-41315de8/s-s-m-app

---

# 4. BAZA DE DATE — 25+ TABELE

## 4.1 Tabele Originale (20)

| # | Tabel | Scop | RLS |
|---|-------|------|-----|
| 1 | organizations | Firmele client | ✅ |
| 2 | profiles | Profiluri utilizatori (auth) | ✅ |
| 3 | memberships | Relația user ↔ organizație + rol | ✅ |
| 4 | employees | Angajații fiecărei firme | ✅ |
| 5 | locations | Sedii/puncte de lucru | ✅ |
| 6 | jurisdictions | Județe/ITM-uri arondate | ✅ |
| 7 | medical_examinations | Examene medicale + next_exam_date | ✅ |
| 8 | safety_equipment | Stingătoare, hidranți, echipamente PSI | ✅ |
| 9 | training_modules | Module instruire SSM/PSI | ✅ |
| 10 | training_assignments | Asignare module → angajați | ✅ |
| 11 | training_sessions | Sesiuni instruire | ✅ |
| 12 | test_questions | Întrebări teste instruire | ✅ |
| 13 | notification_log | Istoric notificări trimise | ✅ |
| 14 | alert_preferences | Preferințe alerte per organizație | ✅ |
| 15 | generated_documents | Documente generate (PDF) | ✅ |
| 16 | fraud_alerts | Entropy Check — alerte anti-fraudă | ✅ |
| 17 | organized_training_sessions | Sesiuni instruire organizate | ✅ |
| 18 | authorities | ITM, IGSU, ANSPDCP — autorități control | ✅ |
| 19 | penalty_rules | Reguli amenzi per autoritate | ✅ |
| 20 | penalty_visibility | Vizualizare amenzi Value Preview | ✅ |

## 4.2 Tabele REGES (5)

| # | Tabel | Scop | RLS |
|---|-------|------|-----|
| 21 | reges_connections | Conexiuni REGES per organizație | ✅ |
| 22 | reges_transmissions | Log transmisii API | ✅ |
| 23 | reges_nomenclatures | Nomenclatoare REGES locale | ✅ |
| 24 | reges_employee_snapshots | Snapshot angajați din REGES | ✅ |
| 25 | reges_audit_log | Audit trail operațiuni REGES | ✅ |

## 4.3 Tabele RBAC Dinamic (3 NOI — P0)

| # | Tabel | Scop | Status |
|---|-------|------|--------|
| 26 | roles | Roluri dinamice per țară | 🔴 DE CREAT |
| 27 | permissions | Permisiuni per rol: resource × action × restricții | 🔴 DE CREAT |
| 28 | user_roles | Asignare user → rol (cu company_id, location_id, expires_at) | 🔴 DE CREAT |

## 4.4 Tabele Multi-Country (planificate, SQL gata, neaplicat)

| Tabel | Scop |
|-------|------|
| countries | Țări active + configurație per țară |
| document_templates | Template-uri documente per țară (6 template-uri BG pregătite) |
| document_signatures | Semnături electronice per document |
| stm_partners | Parteneri STM per țară |
| + country_code pe toate tabelele existente | Filtrare per jurisdicție |

## 4.5 ⚠️ SECURITATE RLS
- **STATUS la 5 feb:** 6 tabele NU aveau RLS
- **STATUS la 7 feb:** RLS aplicat pe 25 tabele (verificat în chat "RLS completion")
- **ACȚIUNE:** Verifică în Supabase Dashboard că TOATE au RLS ENABLED + policies active
- **La migrare RBAC:** Toate RLS policies rescrise să verifice `permissions`, nu rol hardcodat

---

# 5. ROLURI ȘI ACCES — SISTEM DINAMIC RBAC

## 5.1 Principiu Fundamental
Rolurile **NU** sunt hardcodate. Admin (Daniel) creează/șterge/modifică orice rol din UI, per țară, fără cod, fără deploy. Mâine apare "Responsabil NIS2" → Daniel creează rolul, setează permisiunile, asignează userului. Schema suportă orice rol viitor, în orice țară.

## 5.2 Schema RBAC Dinamică (P0 — BLOCANT, DE IMPLEMENTAT)

### Tabel: `roles`
```
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
role_key        TEXT UNIQUE NOT NULL
role_name       TEXT NOT NULL
description     TEXT
country_code    TEXT (nullable)    -- NULL = global, 'RO'/'BG'/'HU'/'DE'/'PL' = specific
is_system       BOOLEAN DEFAULT false  -- true = nu poate fi șters
is_active       BOOLEAN DEFAULT true
created_by      UUID REFERENCES auth.users
created_at      TIMESTAMPTZ DEFAULT now()
metadata        JSONB DEFAULT '{}'
```

### Tabel: `permissions`
```
id                  UUID PRIMARY KEY DEFAULT gen_random_uuid()
role_id             UUID REFERENCES roles(id) ON DELETE CASCADE
resource            TEXT NOT NULL        -- 'employees', 'equipment', 'trainings', 'dashboard'
action              TEXT NOT NULL        -- 'create', 'read', 'update', 'delete', 'export', 'delegate'
field_restrictions  JSONB DEFAULT '{}'   -- {"cnp": "masked", "salary": "hidden"}
conditions          JSONB DEFAULT '{}'   -- {"own_company": true, "supplier_category": "psi"}
country_code        TEXT (nullable)
is_active           BOOLEAN DEFAULT true
UNIQUE(role_id, resource, action, country_code)
```

### Tabel: `user_roles`
```
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE
role_id     UUID REFERENCES roles(id) ON DELETE CASCADE
company_id  UUID REFERENCES organizations(id) (nullable)
location_id UUID REFERENCES locations(id) (nullable)
granted_by  UUID REFERENCES auth.users(id)
granted_at  TIMESTAMPTZ DEFAULT now()
expires_at  TIMESTAMPTZ (nullable)    -- NULL = permanent, data = temporar
UNIQUE(user_id, role_id, company_id)
```

**STATUS ACTUAL:** 3 roluri hardcodate în memberships.role ('consultant', 'firma_admin', 'angajat') → NECESITĂ MIGRARE

### Plan Migrare:
1. Creează tabelele roles, permissions, user_roles
2. Populează cu cele 17+ roluri identificate
3. Migrează date din memberships.role → user_roles
4. Actualizează RLS policies să citească din permissions
5. Actualizează middleware Next.js
6. Păstrează memberships.role ca backup 30 zile, apoi depreciate

## 5.3 Roluri Identificate (17+ core, extensibile infinit)

### TIER 1 — LIVE (4 roluri, codate, funcționale)

| # | Rol | role_key | country | Vede | Poate face |
|---|-----|----------|---------|------|-----------|
| 1 | **Super Admin** (Daniel) | `super_admin` | NULL | TOT | Configurare sistem, facturare, management parteneri, CRUD roluri |
| 2 | **Consultant SSM** | `consultant_ssm` | NULL | Toate firmele alocate | CRUD angajați, examene, echipamente, instruiri, alerte |
| 3 | **Firma Admin** | `firma_admin` | NULL | DOAR firma lui (RLS) | Dashboard propriu, adaugă angajați, primește alerte |
| 4 | **Angajat** | `angajat` | NULL | DOAR datele proprii | Instruiri, teste, certificat, examene proprii |

### TIER 2 — PLANIFICATE RO (13 roluri, schema definită, necodate)

| # | Rol | role_key | Ce vede | Valoare business |
|---|-----|----------|---------|-----------------|
| 5 | **Partener Contabil** | `partener_contabil` | Read-only firme afiliate: scor, expirări, alerte | Cross-sell: contabilul devine early warning |
| 6 | **Furnizor PSI** | `furnizor_psi` | Echipamente din categoria lui la firmele selectate | Lead generation automat |
| 7 | **Furnizor ISCIR/RSVTI** | `furnizor_iscir` | Echipamente sub supraveghere ISCIR | Similar PSI, lifturi/compresoare |
| 8 | **Medic Medicina Muncii** | `medic_mm` | Programări examene, fișe aptitudine | Confirmare examene direct în platformă |
| 9 | **Auditor Extern** | `auditor_extern` | Read-only temporar (expires_at!), scor + documente | Audit ISO — acces limitat timp |
| 10 | **Inspector ITM** | `inspector_itm` | Dashboard special: rapoarte, status conformitate | DIFERENȚIATOR UNIC — inspecția devine formalitate |
| 11 | **Inspector IGSU** (PSI) | `inspector_igsu` | Doar PSI: stingătoare, PRAM, evacuare | Specializat incendii |
| 12 | **Inspector ANSPDCP** | `inspector_anspdcp` | Doar GDPR: registre, DPO | Modulul GDPR add-on |
| 13 | **Lucrător Desemnat** | `lucrator_desemnat` | Mai mult decât angajat, mai puțin decât consultant | Obligatoriu legal <50 ang. fără serviciu extern |
| 14 | **White-Label / STM** | `white_label_stm` | DOAR clienții lui, sub brandul lui | Scalare: partener plătește licență |
| 15 | **Responsabil SSM Intern** | `responsabil_ssm_intern` | Firma lui + raportare către consultant | Firmă mare cu dept. SSM intern |
| 16 | **Training Provider** | `training_provider` | Module instruire proprii + statistici | Marketplace cursuri specializate |
| 17 | **Responsabil NIS2** | `responsabil_nis2` | Modul NIS2: audit, plan conformitate | Apărut recent legislativ! |

### TIER 3 — SPECIFICE PER ȚARĂ

| Țară | Rol | role_key | Echivalent RO | Legislație |
|------|-----|----------|---------------|-----------|
| 🇧🇬 BG | Consultant ЗБУТ | `zbut_consultant_bg` | Consultant SSM | ЗЗБУТ, Наредба РД-07-2 |
| 🇧🇬 BG | Inspector ГИТ | `inspector_git_bg` | Inspector ITM | ЗЗБУТ |
| 🇧🇬 BG | STM Partner | `stm_partner_bg` | White-Label STM | ЗЗБУТ |
| 🇭🇺 HU | Munkavédelmi szakember | `munkavedelmi_hu` | Consultant SSM | Munkavédelmi törvény |
| 🇭🇺 HU | Inspector OMMF | `inspector_ommf_hu` | Inspector ITM | Munkavédelmi törvény |
| 🇩🇪 DE | Sicherheitsingenieur | `sicherheitsingenieur_de` | Consultant SSM | ArbSchG, DGUV |
| 🇩🇪 DE | Betriebsarzt | `betriebsarzt_de` | Medic MM | DGUV Vorschrift 2 |
| 🇩🇪 DE | Berufsgenossenschaft | `berufsgenossenschaft_de` | Auditor/Inspector | ArbSchG |
| 🇵🇱 PL | Specjalista BHP | `specjalista_bhp_pl` | Consultant SSM | Kodeks pracy |
| 🇵🇱 PL | Inspector PIP | `inspector_pip_pl` | Inspector ITM | Kodeks pracy |

### TIER 4 — VIITOARE (oricând creabile din admin UI)
Orice rol nou apărut legislativ, în orice țară. Exemplu: UE introduce mâine o directivă nouă cu un rol obligatoriu → Daniel creează în 5 minute din admin panel.

### Dashboard per Rol

| Rol | Dashboard | Widgets principale |
|-----|-----------|-------------------|
| Super Admin | Admin Panel complet | Toate firmele, toți utilizatorii, logs, facturare, CRUD roluri |
| Consultant SSM | Dashboard multi-firmă | Scor per firmă, expirări iminente, alerte agregate, risc financiar |
| Firma Admin | Dashboard firmă | Status propriu, angajați, echipamente, următoarele acțiuni |
| Angajat | Portal personal | Instruirile mele, examenele mele, certificatele mele |
| Partener Contabil | Read-only dashboard | Scor conformitate clienți comuni, alerte |
| Furnizor PSI | Pipeline echipamente | Ce expiră, la cine, contact direct |
| Medic MM | Calendar examene | Programări, fișe de completat, statistici |
| Inspector ITM | Raport conformitate | Status per firmă/județ, istoric, documente |
| White-Label STM | Dashboard rebranded | Ca Consultant SSM dar sub brandul lui |
| Lucrător Desemnat | Dashboard simplificat | Ca Firma Admin + raportare consultant |
| Responsabil NIS2 | Modul NIS2 | Evaluare risc cyber, incidente, măsuri, raportare |

Autentificare: Magic link + parolă

---

# 6. FUNCȚIONALITĂȚI — 107 IDENTIFICATE

## 6.1 Statistici

| Categorie | Nr | % |
|-----------|---:|--:|
| 🟢 LIVE | 14 | 13% |
| 🟡 COD EXISTĂ (netestat) | 7 | 7% |
| 🔴 PLANIFICAT (schema/prompt gata) | 42 | 39% |
| ⚪ IDEE (propusă) | 44 | 41% |
| **TOTAL** | **107** | 100% |

## 6.2 Ce e LIVE (14 funcționalități)
1. Dashboard consultant — vizualizare toate firmele
2. Dashboard firmă — status propriu
3. Tracking medicina muncii (alerte 30/7 zile)
4. Tracking echipamente PSI (stingătoare, hidranți)
5. Alerte email automate (Resend, cron zilnic 08:00)
6. Notification log (istoric complet)
7. Înrolare angajați (formular)
8. Sesiuni instruire (creare + tracking)
9. Teste quiz (întrebări + scor)
10. Generare certificate PDF (pass/fail)
11. Audit trail (JSONB)
12. Concierge/Delegare servicii expirate
13. Feature discovery tracking (click pe carduri inactive)
14. Autentificare Supabase Auth

## 6.3 Funcționalități Prioritare P0-P2 (next)
- **P0:** RBAC Dinamic (rescriere fundație roluri)
- **P0:** RLS complet pe tabelele multi-country
- **P1:** next-intl i18n framework
- **P1:** Deploy landing BG
- **P1:** Dicționar multilingv 100-200 expresii
- **P1:** Video avatar curs pilot (Synthesia/HeyGen)
- **P2:** WhatsApp alerts (Green API)
- **P2:** Generator documente (fișe post, tematici)
- **P2:** Raportare neconformități (PWA + GPS + poză)

## 6.4 Planificate — Schema/Prompt Gata (42)
[NOTĂ: Lista completă detaliată este în MANUAL_PLATFORMA_SSM.md. Aici categorizat:]

- **RBAC Dinamic** (3): roles table, permissions table, user_roles table + Admin UI + migrare
- **Multi-country** (6): next-intl, countries table, document_templates, landing BG, landing HU, landing DE
- **Training multilingv** (8): audio limbi rare, video avatar, dicționar 200 expresii, cursuri 9 module, testare automată, certificat PDF, recertificare periodică, training marketplace
- **Documente** (6): generator documente SSM complet, fișe post bilingve, GDPR template-uri, proceduri urgență, cod conduită, anti-hărțuire
- **Integrări** (5): REGES-Online complet, ANAF API, certSIGN, Evrotrust, Stripe
- **Moat-uri** (5): Entropy Check v2, Neacțiune Vizibilă, Calculator SSM-PSI, Concierge/Delegare, AI Legislative Parsing
- **Raportare** (4): Dashboard multi-client selector, export rapoarte, statistici agregate, benchmarking
- **Comunicare** (4): WhatsApp alerte, SMS alerte, push notifications, email templates per eveniment
- **NIS2** (4): evaluare risc cyber, raportare incidente, măsuri tehnice, audit trail
- **Module UE noi** (8): Cod Conduită multilingv, Fișe Post bilingve (Directiva 2019/1152), GDPR limba lucrătorului, Proceduri Urgență vizuale, Drepturi și Obligații per țară, Anti-Hărțuire adaptat cultural, Orientare Culturală/Onboarding, Documentare Primul Ajutor

## 6.5 Idei — Propuse, Neformalizate (44)
- **Marketplace** (8): furnizori PSI, ISCIR, MM, cursuri, echipamente, consultanți, avocați muncă, traducători
- **AI/ML** (6): compliance matrix engine, AI legislative parsing, predictive alerts, document OCR scan, chatbot SSM, AI risk scoring
- **Senzori/IoT** (5): Li-Ion safety, LoRaWAN gateways, termografie, monitorizare mediu, alarme automate
- **White-label** (4): branding custom, domeniu custom, facturare proprie, API partener
- **Expansiune** (6): GCC (UAE, Qatar, Saudi), Nordice, UK, Turcia, Serbia, Croația
- **Altele** (7+): mobile app nativă, offline mode complet, API publică, webhook-uri, SSO enterprise, 2FA obligatoriu, audit log complet
- **Import/Export** (4+): CSV/Excel import angajați, OCR PDF fișe medicale, export rapoarte per autoritate, bulk operations
- **Comunicare avansată** (4+): chatbot SSM pentru angajați, notificări push, calendar integrare, video call cu consultant

---

# 7. MULTI-COUNTRY — PIEȚE ȚINTĂ

| # | Țară | Model | Status | Preț |
|---|------|-------|--------|------|
| 1 | 🇷🇴 România | SaaS direct | ✅ LIVE (100+ clienți, €200/an) | €200/an micro |
| 2 | 🇧🇬 Bulgaria | SaaS + parteneriate STM | 🔴 Landing gata, nedeploy-at | €50/100/200 per firmă/an |
| 3 | 🇭🇺 Ungaria | SaaS direct | ⚪ Cerere confirmată (2 prieteni) | €5-10/angajat |
| 4 | 🇩🇪 Germania/Austria | Modul multilingv white-label | ⚪ Cerere confirmată (4 prieteni) | €200-500/lună/client B2B |

**Firme BG existente:** 2 × EOOD+OOD în Ruse, active, fără activitate fiscală, fără cont bancar
**Bancă BG recomandată:** Revolut Business / Wise Business
**Target partener BG:** Mediko.org (STM #1, portal basic PDF → white-label oportunitate)

**Validare Piață Reală (8 feb 2026):**
- 4 prieteni din Germania — ENTUZIASMAȚI, ar folosi de mâine
- 2 prieteni din Ungaria — ENTUZIASMAȚI, ar folosi de mâine
- = cerere reală confirmată pentru DE + HU, nu doar teorie

**Framework Orice Țară Nouă:**
1. Cercetare legislativă (2 runde × 3 AI, zero contradicții obligatoriu)
2. Identificare roluri specifice locale
3. Creare roluri + permisiuni din Admin UI (zero cod)
4. Traducere template-uri documente (DeepL + expert local)
5. Partener local STM identificat
6. Landing page localizată
7. Firmă locală sau parteneriat

**Revenue potențial export (3-5 ani):**

| Țară | Potențial anual |
|------|----------------|
| 🇭🇺 Ungaria | €500K-2M |
| 🇧🇬 Bulgaria | €200K-500K |
| 🇩🇪🇦🇹 DACH | €300K-1M |
| 🇷🇸 Serbia | €50K-150K |
| 🇺🇦 Ucraina (post-război) | €1-5M |

---

# 8. COMPETIȚIE

## 8.1 România
| Competitor | Punct forte | Punct slab | s-s-m.ro avantaj |
|-----------|-------------|------------|-----------------|
| Euramis.ro | Market leader, UX decent | Scump, fără multilingv | Preț + multilingv |
| SSMatic.ro | Documente gratuite (lead magnet) | Website static, fără e-learning | Full platform |
| SSMGuard | Trial disponibil | UX basic | Superior UX + moat-uri |
| SSM-Romania.ro | Hartă furnizori | Consultanță tradițională | Digital-first |
| Protectia-muncii.eu | Preț mic | Template-uri generice | Personalizare + AI |

**Avantaj competitiv clar:** Niciun competitor RO oferă multi-country + multilingv + REGES + Entropy Check + RBAC dinamic + marketplace.

## 8.2 Bulgaria
| Competitor | Tip | Punct slab |
|-----------|-----|-----------|
| OHS Manager (ohsmanager.bg) | Software SSM | UX învechit, fără multilingvism |
| Stm-soft.com | ERP dedicat STM | Foarte tehnic, greu de folosit |
| zbut.eu / otgovori.info | Conținut/Forum | Nu SaaS, doar bibliotecă |
| Mediko.org | STM #1 BG | Portal basic PDF → TARGET PARTENER |

---

# 9. MONETIZARE

## 9.1 România — Clienți existenți
- 100+ clienți activi × €200/an = **€20,000/an ARR**
- Strategia "Silent Migration" — converteam fără onboarding

## 9.2 Pricing SaaS (target)
| Tier | Preț | Include |
|------|------|---------|
| Micro (1-5 ang.) | FREE | Compliance tracking basic |
| Standard (6-50 ang.) | €200/an | Toate features + alerte + PDF |
| Corporate (50+ ang.) | €500-2,000/an | White-label, API, SLA |
| Consultant/STM | €30-100/lună | Marketplace listing + leads |

## 9.3 Add-on-uri Premium
| Add-on | Preț | Status |
|--------|------|--------|
| GDPR (DPO externalizat) | €300/an | Disponibil (Daniel certificat) |
| NIS2 | €500/an | După examen iunie 2026 |
| BLS / Prim Ajutor | Per curs | Daniel = instructor ERC BLS |
| RSVTI | Per echipament | Daniel = RSVTI |
| Termografie Li-Ion | Premium | După ITC Level 1 |
| Instruiri multilingve (limbi rare) | +€5/angajat | Planificat |
| Marketplace listing (furnizori) | €20-50/lună | Planificat |
| Calculator SSM-PSI premium | Free (lead generation) | Planificat |

## 9.4 Proiecții Revenue
| An | România | Export | Total |
|----|---------|-------|-------|
| An 1 | €20,000 (existent) + €10,000 (SaaS nou) | €0 | €30,000 |
| An 2 | €50,000 | €25,000 (BG+HU pilot) | €75,000 |
| An 3 | €125,000 | €200,000 | €325,000 |
| An 5 | €500,000 | €1,000,000 | €1,500,000 |

---

# 10. CERTIFICĂRI DANIEL (Actuale + În Curs)

| Certificare | Status | Relevanță platformă |
|------------|--------|-------------------|
| ERC BLS Instructor | ✅ Activ | Add-on Prim Ajutor |
| RSVTI | ✅ Activ | Add-on echipamente ISCIR |
| Evaluator Risc Incendiu | ✅ Activ | Modul PSI |
| Management Situații de Urgență | ✅ Activ | Plan urgență generator |
| Formator ANC | ✅ Activ | Cursuri acreditate |
| Specialist GDPR | ✅ Activ | Add-on GDPR |
| Consultant Fiscal (CCF) | ✅ Activ | Consultanță integrată |
| Expert Legislația Muncii | ✅ Activ | Core platform |
| Termografie ITC Level 1 | ✅ Activ | Modul Li-Ion Safety |
| NIS2 | 🔴 Examen IUNIE 2026 | Add-on NIS2 |
| WELL AP | 🔴 Q2 2026 ($299) | Premium wellness |
| Eur.Erg. CREE | 🔴 Dosar martie, decizie iunie | PRIMUL DIN ROMÂNIA |
| EurOSHM | 🔴 Q2 2026 | Credibilitate europeană |
| NEBOSH/IOSH | 🔴 În evaluare | Certificare internațională DE/UK |
| Polița RCP | 🔴 URGENT | Răspundere civilă profesională |

**Firme Separate Autorizate:**
| Firmă | Autorizare |
|-------|-----------|
| Firmă SSM | Abilitată ITM (100+ clienți) |
| Firmă PSI | Autorizată IGSU |
| Firmă GDPR | Certificare ANSPDCP |
| Consultanță Fiscală | Membru CCF |
| EOOD Ruse (BG) | Activă, fără activitate fiscală |
| OOD Ruse (BG) | Activă, fără activitate fiscală |

---

# 11. LEGISLAȚIE CRITICĂ

## 11.1 România
- Legea 319/2006 (SSM) + HG 1425/2006 (norme)
- Legea 307/2006 (PSI)
- GDPR: retenție 10 ani documente SSM
- Semnătură: Basic (OTP+hash) intern, eIDAS pentru raportări ITM
- Autorități: ITM (per județ), IGSU, ANSPDCP, ISCIR, ANSSM
- Specificitate: REGES-Online (obligatoriu, integrare API unică)

## 11.2 Bulgaria
- ЗЗБУТ (Legea SSM BG) + Наредба РД-07-2 (instruiri)
- STM-ul RO NU e suficient — obligatoriu STM bulgar autorizat
- Echivalare studii: prin NACID (Directiva 2005/36/CE)
- Registrul Electronic de Muncă BG lansat 2025
- Amenzi ГИТ: 750-7.500 EUR/abatere
- Evrotrust = QTSP dominant BG pentru semnătură QES
- Cercetare completă: 2 runde × 3 AI, zero contradicții

## 11.3 Ungaria
- Munkavédelmi törvény (1993. évi XCIII. törvény)
- Fost OMMF → acum Pest Megyei Kormányhivatal
- Munkavédelmi szakember obligatoriu
- Status cercetare: preliminară — necesită 2 runde × 3 AI

## 11.4 Germania
- Arbeitsschutzgesetz (ArbSchG), DGUV Vorschriften
- Berufsgenossenschaften (BG), Gewerbeaufsichtsämter
- Sicherheitsingenieur + Betriebsarzt obligatorii (DGUV Vorschrift 2)
- Piață premium, reglementări stricte
- Cerere reală confirmată (4 prieteni)

## 11.5 Polonia
- Kodeks pracy (Rozdział X), rozporządzenia szczegółowe
- PIP (Państwowa Inspekcja Pracy)
- Specjalista BHP obligatoriu, piață mare (38M locuitori)
- Cercetare: nu a început

---

# 12. CONCIERGE/DELEGARE + NEACȚIUNE VIZIBILĂ + ENTROPY CHECK

## 12.1 Concierge/Delegare
Platforma nu doar monitorizează — ACȚIONEAZĂ:
- Programare automată examene la apropierea expirării
- Notificare furnizor PSI când stingătorul expiră
- Generare document SSM la schimbare legislativă
- Alertare angajator + consultant + autoritate simultan
- Delegare sarcini către parteneri marketplace

## 12.2 Neacțiune Vizibilă (Protocol 15 zile)
```
Ziua 0:  Notificare angajator (email + SMS + platformă)
Ziua 7:  Reminder — "Nu ați acționat. Risc amenzi Y lei"
Ziua 15: Escalare — document neacțiune generat automat cu TOATE dovezile
```
Valoare: Consultantul dovedește legal că și-a făcut treaba.

## 12.3 Entropy Check v2
```
Test completat →
├─ Instruire organizată ACUM? → ALLOW
├─ Același USER > 3 teste în 5 min? → BLOCK + alertă
├─ Aceeași FIRMĂ > 3 teste 5 min, useri diferiți? → FLAG (posibil legitimă)
└─ Altfel → ALLOW
```

---

# 13. MABS-VA

**⬛ CONFIDENȚIAL** — Zero detalii publice/private până la validare funcțională + opinii independente + OSIM. **Povestea oficială (ChatGPT, Gemini):** "Am abandonat, rezultate inconsistente."

---

# 14. WHITE-LABEL & MARKETPLACE

## 14.1 White-Label
- Partener STM: licență €500-1000/lună, platformă sub brandul lui
- 10 parteneri × €750/lună = €90,000/an

## 14.2 Marketplace
- Furnizori PSI, ISCIR, MM, cursuri, echipamente
- Listing plătit (€20-50/lună) sau comision per tranzacție
- Lead generation automat din expirări

---

# 15. ECOSYSTEM CROSS-PLATFORM

| Platformă | Legătură cu s-s-m.ro |
|-----------|---------------------|
| stiripeglob.ro | B2B news monitoring — trafic + credibilitate |
| stiri24-7.com.ro | News — articole SSM, awareness |
| seniorfm.ro | Media — content marketing |
| diaspora24.ro | Diaspora RO — target muncitori străini |
| hortinfo.ro | Agricultură — nișă SSM agricol |

---

# 16. PROBLEME CUNOSCUTE / ATENȚIONĂRI

| Problemă | Severitate | Status |
|----------|-----------|--------|
| Feature creep (107 features, 13% live) | ⚠️ MARE | Gemini recomandă: taie 50% din idei |
| RBAC hardcodat (3 roluri) | 🔴 BLOCANT | P0 — rescriere necesară |
| RLS pe tabelele multi-country | 🔴 CRITIC | SQL gata, neaplicat |
| next-intl neimplementat | 🔴 BLOCANT export | Fără el, fiecare limbă = refactoring |
| Limba maghiară în tier FREE dar neimplementată | ⚠️ MEDIU | Promisă, nelivrată |
| 8 module UE noi niciodată codate | ⚠️ MEDIU | Doar în doc strategie |
| Moat-uri: concept puternic, zero cod | ⚠️ MEDIU | Entropy Check singura implementată parțial |
| Polița RCP lipsă | 🔴 URGENT | Fără ea, risc personal |

---

# 17. RISCURI ȘI MITIGĂRI

| Risc | Prob. | Impact | Mitigare |
|------|:---:|:---:|---------|
| Solo developer overload | 🔴 | 🔴 | Prioritizare strictă, Claude Code, angajare eventual |
| Feature creep (107!) | 🔴 | 🟡 | Taie 50% idei, focus 14→42 planificate |
| Competiție RO (SSMatic FREE) | 🟡 | 🟡 | Moat-uri unice |
| Legislație BG/HU/DE se schimbă | 🟡 | 🟡 | RBAC dinamic + AI parsing + partener local |
| Mediko refuză parteneriat | 🟡 | 🟢 | Direct-to-market cu EOOD |
| REGES API instabilă | 🟡 | 🔴 | Offline mode + sync periodic |
| Breach date / atac cyber | 🟢 | 🔴 | RLS, ISO 27001, NIS2, AES-256 |
| Polița RCP expirată | 🟡 | 🔴 | URGENT: broker luni 10 feb |
| Burnout Daniel | 🔴 | 🔴 | Pauze, delegare AI, prioritizare |

---

# 18. DECIZII CARE AȘTEAPTĂ

| # | Decizie | Opțiuni | Impact |
|---|---------|---------|--------|
| 1 | Taie din cele 44 idei (⚪)? | A) Da, taie 50% / B) Păstrează backlog | Focalizare vs. optionalitate |
| 2 | Hetzner migration timeline? | A) Martie / B) Aprilie / C) Rămâi Vercel | Cost €15.90/lună vs €0 |
| 3 | Cont bancar BG: Revolut sau Wise? | A) Revolut / B) Wise / C) DSK Bank | Operațional BG |
| 4 | Mediko: white-label sau parteneriat? | A) White-label / B) Referral / C) Direct | Strategie BG |
| 5 | Limba maghiară: rămâne FREE? | A) Da / B) Mută la Pro | Promisiune vs. resource |
| 6 | Polița RCP tip/limită | Oferte broker | 10 feb URGENT |
| 7 | Firmă HU — înființare sau parteneriat | Cercetare HU | Q2 2026 |
| 8 | NEBOSH/IOSH — merită? | Prioritizare certificări | Q2 2026 |
| 9 | Mobile app nativă vs. PWA only | Feedback utilizatori | Q4 2026 |
| 10 | MABS-VA timeline dezvăluire | Validare + OSIM | Daniel decide |

---

# 19. AUDIT OBSERVAȚII (Gemini, 8 feb 2026)

1. "Feature Creep" — 107 funcționalități, 13% live. Risc "Winamp al SSM-ului"
2. RLS incomplet = vulnerabilitate critică
3. Recomandare: taie 50% din idei (⚪), stabilizează cele 42 planificate (🔴)
4. Focus pe revenue-generating features, nu pe "nice to have"

---

# 20. AUDIT TRAIL DOCUMENT

| Versiune | Data | Schimbări majore |
|----------|------|-----------------|
| v1.0 | Ian 2026 | Creare inițială |
| v3.0 | 3 Feb 2026 | Consolidare Runda 3 |
| v8.1 | 8 Feb 2026 | 15 secțiuni, consolidare 70+ chaturi |
| **v9.1** | **8 Feb 2026** | **RBAC Dinamic 17+ roluri, Viziune 20 secțiuni, Glosar 30+ termeni, schema SQL, dashboard per rol, legislație per țară, riscuri, decizii. Corecție v9.0: restaurat P0-P2 prioritare, certificări complete, pricing detaliat.** |

---

> **NOTĂ:** Acest document este SURSA DE ADEVĂR. Chat nou s-s-m.ro → Daniel uploadează DOC1 + DOC3. Claude citește ÎNAINTE de a răspunde. NU inventează — ÎNTREABĂ.
