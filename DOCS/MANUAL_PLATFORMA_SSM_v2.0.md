# S-S-M.RO — Manual Complet al Platformei
## Versiunea 2.0 — 8 Februarie 2026
> **Changelog v2.0:** Secțiunea 3 (Roluri) rescrisă complet — de la 3 roluri hardcodate la RBAC Dinamic 17+ roluri. Secțiunea 4 adăugat tabele RBAC + REGES + authorities. Secțiunea 9 extinsă cu dashboard per rol.

---

# CUPRINS

1. [Ce este s-s-m.ro](#1-ce-este-s-s-mro)
2. [Arhitectura platformei](#2-arhitectura-platformei)
3. [Roluri și acces](#3-roluri-și-acces)
4. [Tabelele bazei de date — explicație completă](#4-tabelele-bazei-de-date)
   - 4.1 organizations
   - 4.2 profiles
   - 4.3 memberships
   - 4.4 employees
   - 4.5 locations
   - 4.6 jurisdictions
   - 4.7 medical_examinations
   - 4.8 safety_equipment
   - 4.9 training_modules
   - 4.10 training_assignments
   - 4.11 training_sessions
   - 4.12 test_questions
   - 4.13 notification_log
   - 4.14 alert_preferences
   - 4.15 generated_documents
   - 4.16 fraud_alerts
   - 4.17 organized_training_sessions
5. [Logica Periodicitate — Cascadă](#5-logica-periodicitate)
6. [Entropy Check v2 — Anti-fraudă instruiri](#6-entropy-check-v2)
7. [Sistemul de alerte automate](#7-sistemul-de-alerte)
8. [Neacțiune Vizibilă — Protocolul de 15 zile](#8-neacțiune-vizibilă)
9. [Dashboard — ce vede fiecare rol](#9-dashboard)
10. [Ghid utilizator — Medicina Muncii](#10-ghid-medicina-muncii)
11. [Ghid utilizator — Echipamente PSI](#11-ghid-echipamente-psi)
12. [Ghid utilizator — Instruiri SSM/PSI](#12-ghid-instruiri)
13. [Scenarii reale și cum le rezolvă platforma](#13-scenarii-reale)
14. [Glosar de termeni](#14-glosar)

---

# 1. CE ESTE S-S-M.RO

s-s-m.ro este o platformă digitală de management al conformității SSM (Securitate și Sănătate în Muncă) și PSI (Prevenire și Stingere Incendii).

**Problema pe care o rezolvă:** Consultantul SSM gestionează zeci/sute de firme simultan. Fișele medicale, echipamentele PSI, instruirile — toate au date de expirare. Când ceva expiră și ITM vine la control, firma primește amendă, iar consultantul pierde clientul.

**Soluția:** Platforma centralizează toate datele, calculează automat ce expiră, trimite alerte email cu 30 de zile înainte, și oferă un dashboard vizual atât consultantului cât și firmei client.

**Cine folosește platforma:**
- **Consultantul SSM** (Daniel și echipa) — vede TOATE firmele, gestionează tot
- **Firma client** (administratorul firmei) — vede DOAR firma lui, primește alerte
- **Angajatul** — accesează instruiri, completează teste, vede propriile date

---

# 2. ARHITECTURA PLATFORMEI

**Tehnologii:**
- **Frontend:** Next.js (React) — afișează paginile
- **Backend:** Supabase (PostgreSQL) — stochează datele
- **Email:** Resend — trimite alertele automate
- **Hosting:** Vercel — rulează aplicația
- **Domeniu:** app.s-s-m.ro

**Cum funcționează:**
```
Utilizator → app.s-s-m.ro → Next.js pe Vercel → Supabase (date)
                                                → Resend (email-uri)
Cron Job (zilnic 08:00) → verifică expirări → trimite email → logează în notification_log
```

---

# 3. ROLURI ȘI ACCES — SISTEM DINAMIC RBAC

## ⚠️ SCHIMBARE MAJORĂ (8 feb 2026)
Platforma trece de la **3 roluri hardcodate** la un **sistem RBAC dinamic** cu 17+ roluri, extensibil per țară, fără cod. Secțiunea de mai jos descrie STAREA FINALĂ (după migrare). Până la implementare, sistemul curent funcționează cu cele 3 roluri originale.

## 3.0 Principiu Fundamental
Rolurile **NU mai sunt hardcodate** în memberships.role. Admin (Daniel) creează/șterge/modifică orice rol din Admin UI (/admin/roles), per țară, fără cod, fără deploy. Schema suportă orice rol viitor legislativ.

## 3.1 Schema RBAC (tabele noi — DE IMPLEMENTAT P0)

**`roles`** — Definește rolurile disponibile
- id, role_key (UNIQUE), role_name, description
- country_code (NULL = global, 'RO'/'BG' = specific țară)
- is_system (true = nu poate fi șters: admin, consultant, angajat)
- is_active (soft delete), created_by, created_at, metadata (JSONB)

**`permissions`** — Ce poate face fiecare rol
- role_id → roles
- resource (tabel/modul: 'employees', 'equipment', 'trainings')
- action ('create', 'read', 'update', 'delete', 'export', 'delegate')
- field_restrictions (JSONB: {"cnp": "masked", "salary": "hidden"})
- conditions (JSONB: {"own_company": true, "supplier_category": "psi"})
- country_code (nullable), is_active

**`user_roles`** — Asignare utilizator → rol
- user_id → auth.users, role_id → roles
- company_id → organizations (nullable — NULL = acces global)
- location_id → locations (nullable — NULL = toate locațiile)
- granted_by, granted_at, expires_at (nullable — NULL = permanent)

## 3.2 TIER 1 — ROLURI LIVE (4 roluri, codate, funcționale)

### Super Admin (Daniel) — `role_key: super_admin`
**Cine:** Daniel. Contul unic cu acces total.
**Ce vede:** TOT — toate firmele, toți utilizatorii, toate configurările.
**Ce poate face:** Configurare sistem, facturare, management parteneri, CRUD roluri din Admin UI, acces la toate tabelele fără restricții.

### Consultant SSM — `role_key: consultant_ssm`
**Cine:** Daniel și viitorii colaboratori SSM.
**Ce vede:** Dashboard cu TOATE firmele alocate. Fișe medicale, echipamente, instruiri, alerte agregate.
**Ce poate face:** CRUD angajați, examene, echipamente, instruiri. Programează sesiuni. Generează documente PDF. Setează frecvențe.
**Restricții:** Vede DOAR firmele la care e asociat (prin user_roles.company_id sau memberships).

### Firma Admin — `role_key: firma_admin`
**Cine:** Administratorul sau HR-ul firmei client.
**Ce vede:** Dashboard DOAR cu firma lui. Fișe, echipamente, instruiri, alerte.
**Ce poate face:** Vizualizare, adaugă angajați, vede rapoarte conformitate.
**Restricții:** conditions: {"own_company": true}. NU vede alte firme.

### Angajat — `role_key: angajat`
**Cine:** Angajatul firmei client.
**Ce vede:** Propriile date — instruiri, teste, fișă medicală.
**Ce poate face:** Completează instruiri, dă teste, vede status propriu.
**Restricții:** conditions: {"own_user": true}. NU vede datele altor angajați sau firmei.

## 3.3 TIER 2 — ROLURI PLANIFICATE (13 roluri, schema definită, necodate)

| # | Rol | role_key | Ce vede | Valoare business |
|---|-----|----------|---------|-----------------|
| 5 | **Partener Contabil** | partener_contabil | Read-only firme afiliate: scor, expirări, alerte | Cross-sell: contabilul devine early warning |
| 6 | **Furnizor PSI** | furnizor_psi | Echipamente din categoria lui la firmele selectate | Lead generation automat din expirări |
| 7 | **Furnizor ISCIR/RSVTI** | furnizor_iscir | Echipamente sub supraveghere ISCIR | Lifturi, compresoare, recipiente |
| 8 | **Medic Medicina Muncii** | medic_mm | Programări examene, fișe aptitudine | Confirmare examene direct în platformă |
| 9 | **Auditor Extern** | auditor_extern | Read-only TEMPORAR (expires_at!), scor + documente | Audit ISO — acces limitat timp |
| 10 | **Inspector ITM** | inspector_itm | Dashboard special: rapoarte, status conformitate | DIFERENȚIATOR UNIC — controlul devine formalitate |
| 11 | **Inspector IGSU (PSI)** | inspector_igsu | Doar PSI: stingătoare, PRAM, evacuare | Specializat incendii |
| 12 | **Inspector ANSPDCP** | inspector_anspdcp | Doar GDPR: registre, DPO | Modulul GDPR add-on |
| 13 | **Lucrător Desemnat** | lucrator_desemnat | Mai mult decât angajat, mai puțin decât consultant | Obligatoriu legal: firme <50 ang. fără serviciu extern |
| 14 | **White-Label / STM** | white_label_stm | DOAR clienții lui, sub brandul lui | Scalare: partener plătește licență lunară |
| 15 | **Responsabil SSM Intern** | responsabil_ssm_intern | Firma lui + raportare către consultant | Firmă mare cu dept. SSM intern |
| 16 | **Training Provider** | training_provider | Module instruire proprii + statistici | Marketplace cursuri specializate |
| 17 | **Responsabil NIS2** | responsabil_nis2 | Modul NIS2: audit, plan conformitate | Apărut recent legislativ! |

## 3.4 TIER 3 — SPECIFICE PER ȚARĂ

| Țară | Rol | role_key | Echivalent RO |
|------|-----|----------|---------------|
| 🇧🇬 Bulgaria | Consultant ЗБУТ | zbut_consultant_bg | Consultant SSM |
| 🇧🇬 Bulgaria | Inspector ГИТ | inspector_git_bg | Inspector ITM |
| 🇧🇬 Bulgaria | STM Partner | stm_partner_bg | White-Label STM |
| 🇭🇺 Ungaria | Munkavédelmi szakember | munkavedelmi_hu | Consultant SSM |
| 🇭🇺 Ungaria | Inspector OMMF | inspector_ommf_hu | Inspector ITM |
| 🇩🇪 Germania | Sicherheitsingenieur | sicherheitsingenieur_de | Consultant SSM |
| 🇩🇪 Germania | Betriebsarzt | betriebsarzt_de | Medic MM |
| 🇩🇪 Germania | Berufsgenossenschaft | berufsgenossenschaft_de | Auditor/Inspector |
| 🇵🇱 Polonia | Specjalista BHP | specjalista_bhp_pl | Consultant SSM |
| 🇵🇱 Polonia | Inspector PIP | inspector_pip_pl | Inspector ITM |

## 3.5 TIER 4 — VIITOARE
Orice rol nou creat din Admin UI. Exemplu: UE introduce mâine directivă cu rol obligatoriu → Daniel creează în 5 minute din /admin/roles.

## 3.6 Plan Migrare (de la 3 roluri → RBAC dinamic)
1. Creează tabele roles, permissions, user_roles
2. Populează cu 17+ roluri
3. Migrează date din memberships.role → user_roles
4. Actualizează RLS → verifică permissions, nu memberships
5. Actualizează middleware Next.js
6. Păstrează memberships.role backup 30 zile

Autentificare: Magic link + parolă (neschimbat)

---

# 4. TABELELE BAZEI DE DATE

## 4.1 ORGANIZATIONS (Firme/Organizații)

**Ce stochează:** Datele fiecărei firme client.

| Câmp | Tip | Obligatoriu | Explicație |
|------|-----|-------------|------------|
| `id` | UUID | Auto | Identificator unic, generat automat |
| `name` | Text | DA | Numele firmei (ex: "SC Exemplu SRL") |
| `cui` | Text | DA | Codul Unic de Înregistrare (ex: "RO12345678"). Identifică firma la ONRC/ANAF |
| `address` | Text | NU | Adresa sediului social |
| `county` | Text | NU | Județul (ex: "Bihor", "București") |
| `contact_email` | Text | DA | Email-ul persoanei de contact din firmă. AICI se trimit alertele |
| `contact_phone` | Text | NU | Telefon contact |
| `data_completeness` | Integer | Auto (0) | Cât la sută din date sunt completate (0-100). Calculat automat |
| `exposure_score` | Text | Auto | Scorul de expunere la riscuri: "necalculat", "scăzut", "mediu", "ridicat", "critic" |
| `preferred_channels` | Array | Auto | Cum vrea clientul să primească alerte: ['email'], ['email','sms'], etc. |
| `cooperation_status` | Text | Auto | Status colaborare: "active", "paused", "terminated" |
| `medical_exam_months` | Integer | Auto (12) | **PERIODICITATE DEFAULT:** La câte luni se face medicina muncii |
| `osh_training_months` | Integer | Auto (6) | La câte luni se face instruirea SSM |
| `fire_training_months` | Integer | Auto (6) | La câte luni se face instruirea PSI |
| `created_at` | Timestamp | Auto | Când a fost adăugată firma |
| `updated_at` | Timestamp | Auto | Ultima modificare |

**De ce medical_exam_months e pe firmă?** Pentru că MAJORITATEA angajaților dintr-o firmă au aceeași periodicitate. Excepțiile se setează pe loc de muncă sau individual (vezi Cascada, secțiunea 5).

**Exemplu concret:**
- SC TechPro SRL, CUI RO44556677, contact@techpro.ro
- Periodicitate default: medicina muncii la 12 luni, instruire SSM la 6 luni
- 30 angajați IT → toți moștenesc 12 luni
- 2 ingineri care merg în hală → setezi 6 luni individual pe ei

---

## 4.2 PROFILES (Profiluri utilizatori)

**Ce stochează:** Datele utilizatorilor care se loghează în platformă.

| Câmp | Tip | Obligatoriu | Explicație |
|------|-----|-------------|------------|
| `id` | UUID | Auto | Legat de Supabase Auth (contul de login) |
| `full_name` | Text | DA | Numele complet |
| `email` | Text | DA | Email-ul de login |
| `phone` | Text | NU | Telefon |
| `avatar_url` | Text | NU | Poza de profil (URL) |
| `created_at` | Timestamp | Auto | Când a fost creat contul |

**Diferența între profiles și employees:** `profiles` = utilizatori cu CONT de login. `employees` = angajații firmelor (nu toți au cont). Un angajat POATE avea și profil (dacă i se dă acces la platformă), dar nu e obligatoriu.

**Exemplu:** Firma are 50 angajați (în `employees`). Doar administratorul firmei are cont (în `profiles`). Consultantul Daniel are cont (în `profiles`). Cei 50 de angajați NU au cont decât dacă trebuie să facă instruiri online.

---

## 4.3 MEMBERSHIPS (Asocieri utilizator ↔ firmă)

**Ce stochează:** Cine are acces la ce firmă și cu ce rol.

| Câmp | Tip | Obligatoriu | Explicație |
|------|-----|-------------|------------|
| `id` | UUID | Auto | Identificator unic |
| `user_id` | UUID | DA | Cine (din profiles) |
| `organization_id` | UUID | DA | La ce firmă |
| `role` | Text | DA | Ce rol: 'consultant', 'firma_admin', 'angajat' |
| `is_active` | Boolean | Auto (true) | Dacă e activ (false = acces suspendat) |
| `joined_at` | Timestamp | Auto | Când a fost adăugat |

**Reguli stricte (constraints):**
- **UNIQUE (user_id, organization_id):** Un utilizator NU poate fi de 2 ori în aceeași firmă
- **CHECK role:** Rolul poate fi DOAR 'consultant', 'firma_admin', sau 'angajat'

**De ce e important?** Acesta este tabelul pe care se bazează TOATĂ securitatea (RLS). Când Daniel se loghează, Supabase verifică: "În ce organizații apare Daniel în memberships?" → Arată DOAR datele acelor organizații.

**Exemplu:**
- Daniel (user_id: abc) → SC TechPro (org_id: 111) → role: consultant
- Daniel (user_id: abc) → SC Construct (org_id: 222) → role: consultant
- Maria (user_id: def) → SC TechPro (org_id: 111) → role: firma_admin
- Ion (user_id: ghi) → SC TechPro (org_id: 111) → role: angajat

Rezultat: Daniel vede TechPro + Construct. Maria vede doar TechPro. Ion vede doar ce-l privește pe el din TechPro.

---

## 4.4 EMPLOYEES (Angajați)

**Ce stochează:** Toți angajații tuturor firmelor client.

| Câmp | Tip | Obligatoriu | Explicație |
|------|-----|-------------|------------|
| `id` | UUID | Auto | Identificator unic |
| `organization_id` | UUID | DA | Firma la care lucrează |
| `full_name` | Text | DA | Numele complet |
| `cnp_hash` | Text | NU | CNP-ul criptat SHA-256. NU stocăm CNP-ul real (GDPR) |
| `nationality` | Text | NU | Cetățenia (important pt angajați străini) |
| `preferred_language` | Text | NU | Limba preferată (RO, EN, HU, etc.) — pt instruiri multilingve |
| `job_title` | Text | DA | Funcția/postul (ex: "Operator CNC", "Contabil") |
| `department` | Text | NU | Departamentul |
| `hire_date` | Date | DA | Data angajării |
| `home_location_id` | UUID | NU | Locul de muncă "de acasă" (sediul unde e repartizat) |
| `work_location_id` | UUID | NU | Locul de muncă efectiv (poate diferi de home) |
| `mobility_type` | Text | NU | Tipul de mobilitate (vezi mai jos) |
| `delegation_start_date` | Date | NU | Dacă e detașat: de când |
| `delegation_end_date` | Date | NU | Dacă e detașat: până când |
| `host_country` | Text | NU | Țara gazdă (dacă e detașat cross-border) |
| `host_employer` | Text | NU | Angajatorul gazdă |
| `phone` | Text | NU | Telefon angajat |
| `email` | Text | NU | Email angajat |
| `is_active` | Boolean | Auto (true) | Activ/inactiv (nu se șterge, se dezactivează) |
| `termination_date` | Date | NU | Data încetării contractului |
| `user_id` | UUID | NU | Dacă angajatul are și cont de login (legătura cu profiles) |
| `medical_exam_months` | Integer | NU | **Override individual** — periodicitate medicina muncii |
| `osh_training_months` | Integer | NU | Override individual — periodicitate instruire SSM |
| `fire_training_months` | Integer | NU | Override individual — periodicitate instruire PSI |
| `created_at` | Timestamp | Auto | |
| `updated_at` | Timestamp | Auto | |

**mobility_type — valori posibile:**
- `sedentary` — lucrează fix într-un loc (birou, fabrică)
- `mobile` — se deplasează între puncte de lucru ale aceleiași firme
- `delegated` — detașat la altă firmă din România
- `cross_border` — detașat în altă țară (UE)
- `remote` — lucru de acasă

**De ce home_location_id ȘI work_location_id?**
Scenariul real: Ion este angajat la sediul din Cluj (home), dar lucrează efectiv la punctul de lucru din Dej (work). Legislația SSM se aplică conform locului de muncă EFECTIV, nu conform sediului.

**De ce cnp_hash și nu CNP-ul real?**
GDPR. CNP-ul este dată personală sensibilă. Stocăm doar hash-ul SHA-256, care permite verificare ("e același angajat?") dar nu permite reconstruirea CNP-ului.

**De ce medical_exam_months poate fi NULL?**
NULL = "nu e setat individual, moștenește de la locul de muncă sau firmă" (vezi Cascada, secțiunea 5).

---

## 4.5 LOCATIONS (Puncte de lucru)

**Ce stochează:** Sedii, filiale, puncte de lucru ale firmelor.

| Câmp | Tip | Obligatoriu | Explicație |
|------|-----|-------------|------------|
| `id` | UUID | Auto | |
| `organization_id` | UUID | DA | Firma căreia îi aparține |
| `name` | Text | DA | Numele punctului de lucru (ex: "Sediu central", "Hala producție Dej") |
| `location_type` | Text | DA | Tip: 'headquarters', 'branch', 'warehouse', 'factory', 'office', 'site' |
| `address` | Text | DA | Adresa completă |
| `city` | Text | DA | Orașul |
| `county` | Text | DA | Județul |
| `country` | Text | Auto ('RO') | Țara (important pt firme cu puncte de lucru în alte țări) |
| `coordinates` | JSONB | NU | GPS: {"lat": 47.05, "lng": 21.93} — pentru harta viitoare |
| `is_active` | Boolean | Auto (true) | |
| `is_primary` | Boolean | Auto (false) | Dacă e sediul social principal |
| `caen_code` | Text | NU | Codul CAEN al activității din acel punct de lucru |
| `itm_jurisdiction` | Text | NU | ITM-ul competent (ex: "ITM Bihor") |
| `isu_jurisdiction` | Text | NU | ISU-ul competent (ex: "ISU Crișana") |
| `contact_person` | Text | NU | Persoana de contact la acel punct |
| `contact_phone` | Text | NU | |
| `jurisdiction_id` | UUID | NU | Legătura cu tabelul jurisdictions (legislație) |
| `medical_exam_months` | Integer | NU | **Override per punct de lucru** |
| `osh_training_months` | Integer | NU | Override per punct de lucru |
| `fire_training_months` | Integer | NU | Override per punct de lucru |
| `created_at` | Timestamp | Auto | |
| `updated_at` | Timestamp | Auto | |

**De ce caen_code?** Diferite activități CAEN au cerințe SSM diferite. Hala de producție (CAEN 25xx) are alt profil de risc decât biroul de proiectare (CAEN 71xx).

**De ce itm_jurisdiction și isu_jurisdiction?** La control, trebuie să știi care ITM/ISU este competent pentru acel punct de lucru. E determinat de județ, nu de sediul social.

**Exemplu:**
- SC TechPro SRL — sediu în Cluj → ITM Cluj
- SC TechPro SRL — punct de lucru în Dej (tot jud. Cluj) → ITM Cluj
- SC TechPro SRL — punct de lucru în Oradea → ITM Bihor (altul!)

---

## 4.6 JURISDICTIONS (Legislație per țară)

**Ce stochează:** Cerințele legale SSM/PSI pentru fiecare țară în care operezi.

| Câmp | Tip | Obligatoriu | Explicație |
|------|-----|-------------|------------|
| `id` | UUID | Auto | |
| `country_code` | Text | DA | Cod țară ISO: 'RO', 'BG', 'HU', 'PL', 'DE' |
| `country_name` | Text | DA | Numele complet |
| `osh_law_name` | Text | DA | Legea SSM principală (ex: "Legea 319/2006") |
| `osh_law_reference` | Text | DA | Referința completă |
| `medical_exam_frequency_months` | Integer | DA | Frecvența LEGALĂ minimă a examenelor medicale |
| `fire_safety_training_months` | Integer | DA | Frecvența LEGALĂ minimă instruire PSI |
| `general_osh_training_months` | Integer | DA | Frecvența LEGALĂ minimă instruire SSM |
| `fire_extinguisher_check_months` | Integer | DA | Verificare stingătoare |
| `labor_inspection_name` | Text | DA | Numele autorității (ex: "Inspectoratul Teritorial de Muncă") |
| `fire_authority_name` | Text | DA | Autoritatea PSI |
| `requires_osh_consultant` | Boolean | DA | Dacă legea CERE consultant extern SSM |
| `requires_external_osh_service` | Boolean | DA | Dacă cere serviciu extern |
| `multilingual_training_required` | Boolean | DA | Dacă instruirile trebuie în limba angajatului |
| `document_language` | Text | DA | Limba oficială a documentelor |
| `additional_languages` | Array | NU | Limbi suplimentare acceptate |
| `notes` | Text | NU | Observații |
| `is_active` | Boolean | Auto (true) | |
| `updated_at` | Timestamp | Auto | |

**De ce există acest tabel?** Pentru expansiunea UE. Când consultantul SSM va lucra cu firme din Bulgaria sau Ungaria, legislația e diferită. Platforma știe automat: "firma X are punct de lucru în Bulgaria → aplicăm legislația bulgară la acel punct."

---

## 4.7 MEDICAL_EXAMINATIONS (Fișe medicale / Aptitudini)

**Ce stochează:** Fiecare examen medical (fișă de aptitudine) al fiecărui angajat.

| Câmp | Tip | Obligatoriu | Explicație |
|------|-----|-------------|------------|
| `id` | UUID | Auto | |
| `organization_id` | UUID | DA | Firma |
| `employee_id` | UUID | NU | Legătura cu tabelul employees. NULL dacă angajatul nu e încă în sistem |
| `employee_name` | Text | DA | Numele angajatului (salvat direct, pt cazul când employee_id nu e setat) |
| `cnp_hash` | Text | NU | CNP criptat (GDPR) |
| `job_title` | Text | NU | Funcția la momentul examinării |
| `examination_type` | Text | Auto ('periodic') | Tipul examinării — vezi mai jos |
| `examination_date` | Date | DA | Data când s-a făcut examinarea |
| `expiry_date` | Date | DA | Data când expiră fișa de aptitudine |
| `result` | Text | Auto ('apt') | Rezultatul — vezi mai jos |
| `restrictions` | Text | NU | Restricții medicale (ex: "fără efort fizic intens") |
| `doctor_name` | Text | NU | Numele medicului de medicina muncii |
| `clinic_name` | Text | NU | Policlinica/clinica |
| `notes` | Text | NU | Observații suplimentare |
| `content_version` | Integer | Auto (1) | Versiunea conținutului (pt tracking modificări) |
| `legal_basis_version` | Text | Auto | Baza legală: "HG355/2007_v2024" |
| `location_id` | UUID | NU | Punctul de lucru aferent |
| `created_at` | Timestamp | Auto | |
| `updated_at` | Timestamp | Auto | |

**examination_type — valori posibile:**
| Valoare | Când se face | Cine decide |
|---------|-------------|-------------|
| `angajare` | La angajare, ÎNAINTE de semnarea contractului | Obligatoriu legal |
| `adaptare` | După angajare, pentru adaptare la locul de muncă | Medicul de medicina muncii |
| `periodic` | La interval regulat (6/12 luni, depinde de risc) | Obligatoriu legal |
| `reluare` | La revenirea după concediu medical > 90 zile | Obligatoriu legal |
| `la_cerere` | Când angajatorul sau angajatul solicită | La cerere |

**result — valori posibile:**
| Valoare | Înseamnă | Ce se întâmplă |
|---------|----------|----------------|
| `apt` | Apt pentru muncă, fără restricții | Nimic, totul OK |
| `apt_conditionat` | Apt DAR cu restricții | Trebuie respectate restricțiile (câmpul `restrictions`) |
| `inapt_temporar` | Inapt temporar | Se reexaminează după tratament |
| `inapt` | Inapt definitiv | Nu poate presta acea muncă. Reconversie profesională |

**De ce employee_name e separat de employee_id?** Scenariul real: Consultantul primește fișa medicală de la clinică ÎNAINTE de a introduce angajatul în sistem. Completează numele, apoi asociază cu employee_id mai târziu.

**Baza legală:** HG 355/2007 privind supravegherea sănătății lucrătorilor, cu modificările ulterioare.

---

## 4.8 SAFETY_EQUIPMENT (Echipamente PSI)

**Ce stochează:** Stingătoare, truse, hidranți, detectoare — tot ce are dată de verificare.

| Câmp | Tip | Explicație |
|------|-----|------------|
| `id` | UUID | |
| `organization_id` | UUID | Firma |
| `equipment_type` | Text | Tip: 'stingator', 'trusa_prim_ajutor', 'hidrant', 'detector_fum', 'iluminat_urgenta' |
| `description` | Text | Descriere / Identificare (ex: "Stingător P6 etaj 2, hol") |
| `location` | Text | Unde se află fizic |
| `serial_number` | Text | Număr de serie |
| `last_check_date` | Date | Ultima verificare |
| `expiry_date` | Date | Când expiră verificarea |
| `content_version` | Integer | Versiunea conținutului |
| `legal_basis_version` | Text | Baza legală: ex. "Legea307/2006_v2024" |
| `created_at` | Timestamp | |
| `updated_at` | Timestamp | |

**Baza legală:** Legea 307/2006 privind apărarea împotriva incendiilor, cu normele de aplicare.

---

## 4.9 TRAINING_MODULES (Module de instruire)

**Ce stochează:** Modulele de training SSM/PSI disponibile.

| Câmp | Tip | Explicație |
|------|-----|------------|
| `id` | UUID | |
| `title` | Text | Titlul modulului (ex: "Instruire introductiv-generală SSM") |
| `description` | Text | Descriere detaliată |
| `category` | Text | Categorie: 'ssm_introductiv', 'ssm_la_locul_de_munca', 'ssm_periodic', 'psi_introductiv', 'psi_periodic' |
| `duration_minutes` | Integer | Durata minimă în minute |
| `content_url` | Text | Link către materialul de instruire |
| `is_active` | Boolean | |
| `created_by` | UUID | Consultantul care l-a creat |
| `created_at` | Timestamp | |
| `updated_at` | Timestamp | |

**Tipuri de instruire conform legislației:**
1. **Introductiv-generală (SSM)** — la angajare, o singură dată
2. **La locul de muncă (SSM)** — la angajare + la schimbarea postului
3. **Periodică (SSM)** — la interval regulat (3-12 luni)
4. **PSI introductivă** — la angajare
5. **PSI periodică** — la interval regulat

---

## 4.10 TRAINING_ASSIGNMENTS (Asignări instruiri)

**Ce stochează:** Ce modul e asignat cărei firme/grup de angajați.

| Câmp | Tip | Explicație |
|------|-----|------------|
| `id` | UUID | |
| `module_id` | UUID | Ce modul |
| `organization_id` | UUID | Ce firmă |
| `assigned_by` | UUID | Cine a asignat (consultantul) |
| `due_date` | Date | Termen limită |
| `is_active` | Boolean | |
| `created_at` | Timestamp | |

---

## 4.11 TRAINING_SESSIONS (Sesiuni de instruire completate)

**Ce stochează:** Fiecare instruire efectiv realizată — DOVADA că angajatul a fost instruit.

| Câmp | Tip | Explicație |
|------|-----|------------|
| `id` | UUID | |
| `organization_id` | UUID | Firma |
| `module_id` | UUID | Ce modul a parcurs |
| `assignment_id` | UUID | Din ce asignare |
| `worker_id` | UUID | Angajatul (employee_id) |
| `instructor_name` | Text | Numele instructorului |
| `instructor_id` | UUID | ID-ul instructorului (dacă e în sistem) |
| `instructor_authorization` | Text | Nr. autorizație instructor |
| `session_date` | Date | Data instruirii |
| `start_time` | Timestamp | Ora începerii |
| `end_time` | Timestamp | Ora terminării |
| `duration_minutes` | Integer | Durata în minute |
| `language` | Text | Limba instruirii |
| `location` | Text | Locul instruirii |
| `test_score` | Numeric | Scor test (ex: 85.5) |
| `test_questions_total` | Integer | Câte întrebări |
| `test_questions_correct` | Integer | Câte corecte |
| `test_answers_json` | JSONB | Răspunsurile detaliate (pt audit) |
| `verification_result` | Text | 'passed', 'failed', 'pending' |
| `quickvalid_selfie_hash` | Text | Hash selfie verificare identitate |
| `quickvalid_signature_hash` | Text | Hash semnătură |
| `quickvalid_timestamp` | Timestamp | Când s-a verificat identitatea |
| `quickvalid_device_info` | JSONB | Dispozitiv, browser, OS |
| `fisa_document_id` | UUID | PDF-ul generat (fișa de instruire) |
| `fisa_generated_at` | Timestamp | Când s-a generat fișa |
| `audit_trail` | JSONB | Jurnal complet al sesiunii |
| `ip_address` | INET | IP-ul de la care s-a făcut |
| `user_agent` | Text | Browser-ul folosit |
| `notes` | Text | Observații |
| `content_version` | Integer | Versiunea conținutului |
| `legal_basis_version` | Text | Baza legală |
| `created_at` | Timestamp | |
| `updated_at` | Timestamp | |

**De ce atâtea câmpuri de verificare (quickvalid_*)?** QuickValid este sistemul anti-fraudă la nivel de instruire. Verifică:
- **Selfie** — persoana din fața ecranului e cea care trebuie să fie
- **Semnătură** — dovadă de prezență
- **Device info** — pe ce dispozitiv s-a făcut
- **IP** — de unde s-a conectat
- **Timestamp** — verificare temporală

Aceste date sunt esențiale la un control ITM care pune la îndoială veridicitatea instruirilor.

---

## 4.12 TEST_QUESTIONS (Întrebări teste)

**Ce stochează:** Banca de întrebări pentru testele de verificare post-instruire.

| Câmp | Tip | Explicație |
|------|-----|------------|
| `id` | UUID | |
| `module_id` | UUID | La ce modul aparține |
| `question_text` | Text | Textul întrebării |
| `options` | JSONB | Variantele de răspuns |
| `correct_answer` | Text | Răspunsul corect |
| `difficulty` | Text | 'easy', 'medium', 'hard' |
| `is_active` | Boolean | |
| `created_at` | Timestamp | |

---

## 4.13 NOTIFICATION_LOG (Jurnalul notificărilor)

**Ce stochează:** FIECARE email/alertă trimisă. NU stochează conținutul (GDPR), doar faptul că s-a trimis.

| Câmp | Tip | Explicație |
|------|-----|------------|
| `id` | UUID | |
| `organization_id` | UUID | Către ce firmă |
| `notification_type` | Text | Tipul: 'expiry_alert', 'weekly_summary', 'fraud_alert' |
| `sent_at` | Timestamp | Când s-a trimis |
| `status` | Text | 'sent', 'failed', 'pending' |
| `channel` | Text | 'email', 'sms', 'whatsapp' |

**De ce NU stocăm conținutul email-ului?** GDPR + Code Contract: logăm EVENIMENTUL, nu CONȚINUTUL. Știm că "pe 6 Feb la 08:00 s-a trimis alertă de expirare către SC TechPro" — dar nu stocăm textul complet.

---

## 4.14 ALERT_PREFERENCES (Preferințe alertare)

**Ce stochează:** Cum vrea fiecare firmă să primească alertele.

| Câmp | Tip | Explicație |
|------|-----|------------|
| `id` | UUID | |
| `organization_id` | UUID | Firma |
| `channel` | Text | 'email', 'sms', 'whatsapp', 'push' |
| `is_enabled` | Boolean | Activ/inactiv |
| `recipient_email` | Text | Email destinatar |
| `recipient_phone` | Text | Telefon destinatar |
| `escalation_email` | Text | Email escalare (dacă nu se acționează) |
| `created_at` | Timestamp | |
| `updated_at` | Timestamp | |

**Ce e escalation_email?** Dacă trimitem alertă pe email și nimeni nu acționează 15 zile (Neacțiune Vizibilă), trimitem la escalation_email (de ex: directorul general, nu doar HR-ul).

---

## 4.15 GENERATED_DOCUMENTS (Documente generate)

**Ce stochează:** PDF-uri, fișe, rapoarte generate de platformă.

| Câmp | Tip | Explicație |
|------|-----|------------|
| `id` | UUID | |
| `organization_id` | UUID | Pentru ce firmă |
| `document_type` | Text | 'fisa_aptitudine', 'fisa_instruire', 'raport_conformitate' |
| `content_version` | Integer | |
| `legal_basis_version` | Text | |
| `file_url` | Text | Link-ul de descărcare |
| `generated_by` | UUID | Cine l-a generat |
| `created_at` | Timestamp | |

---

## 4.16 FRAUD_ALERTS (Alerte fraudă)

**Ce stochează:** Tentativele suspecte detectate de Entropy Check.

| Câmp | Tip | Explicație |
|------|-----|------------|
| `id` | UUID | |
| `organization_id` | UUID | Firma |
| `alert_type` | Text | Tipul — vezi mai jos |
| `severity` | Text | 'low', 'medium', 'high', 'critical' |
| `details` | JSONB | Detalii tehnice (IP-uri, timestamps, user agents) |
| `organized_session_id` | UUID | Dacă era instruire organizată (NULL dacă fraudă) |
| `is_resolved` | Boolean | Rezolvat/nerezolvat |
| `resolved_by` | UUID | Cine l-a rezolvat |
| `resolved_at` | Timestamp | Când |
| `created_at` | Timestamp | |

**alert_type — valori:**
| Valoare | Ce înseamnă | Acțiune |
|---------|-------------|---------|
| `individual_fraud` | Același user > 3 teste în 5 min | **BLOCARE** + alertă consultant |
| `group_session_detected` | Mulți useri diferiți testează rapid din aceeași firmă | **LOG** doar (posibil instruire legitimă) |
| `organized_training` | Instruire programată, totul normal | **IGNORAT** — doar log |

---

## 4.17 ORGANIZED_TRAINING_SESSIONS (Instruiri programate)

**Ce stochează:** Sesiunile de instruire programate de consultant sau firma_admin.

| Câmp | Tip | Explicație |
|------|-----|------------|
| `id` | UUID | |
| `organization_id` | UUID | Firma |
| `scheduled_by` | UUID | Cine a programat |
| `title` | Text | Ex: "Instruire SSM periodică Q1 2026" |
| `start_time` | Timestamp | Începe la |
| `end_time` | Timestamp | Termină la (max 8 ore de la start) |
| `location` | Text | Unde se desfășoară |
| `device_note` | Text | Ex: "tabletă partajată la recepție" |
| `max_participants` | Integer | Câți participanți maxim |
| `is_active` | Boolean | |
| `created_at` | Timestamp | |

**De ce device_note?** Scenariul real: 15 angajați fac instruirea pe o singură tabletă oferită de firmă, în pauza de masă. Fără acest context, Entropy Check ar putea interpreta ca fraudă (multe teste, same IP, same device). Cu device_note și organized_session, totul e OK.

**Constrângere:** Fereastra nu poate fi mai mare de 8 ore (CHECK constraint).

---

## 4.18 AUTHORITIES (Autorități de control)

**Ce stochează:** ITM, IGSU, ANSPDCP și alte autorități de control.

| Câmp | Tip | Explicație |
|------|-----|------------|
| `id` | UUID | Identificator unic |
| `name` | Text | Numele autorității (ex: "ITM Bihor") |
| `type` | Text | 'itm', 'igsu', 'anspdcp', 'iscir' |
| `jurisdiction` | Text | Zona de competență |
| `contact_info` | JSONB | Date contact |
| `is_active` | Boolean | |

---

## 4.19 PENALTY_RULES (Reguli amenzi per autoritate)

**Ce stochează:** Amenzile posibile per tip neconformitate.

| Câmp | Tip | Explicație |
|------|-----|------------|
| `id` | UUID | |
| `authority_id` | UUID | Autoritatea competentă |
| `violation_type` | Text | Tip neconformitate |
| `min_fine` | Numeric | Amenda minimă (RON) |
| `max_fine` | Numeric | Amenda maximă (RON) |
| `legal_basis` | Text | Baza legală |

---

## 4.20 PENALTY_VISIBILITY (Value Preview amenzi)

**Ce stochează:** Vizualizare amenzi potențiale per firmă — funcționalitate "cât te costă neconformitatea".

---

## 4.21-4.25 TABELE REGES

| # | Tabel | Scop |
|---|-------|------|
| 4.21 | `reges_connections` | Conexiuni REGES per organizație |
| 4.22 | `reges_transmissions` | Log transmisii API REGES |
| 4.23 | `reges_nomenclatures` | Nomenclatoare REGES locale |
| 4.24 | `reges_employee_snapshots` | Snapshot angajați importați din REGES |
| 4.25 | `reges_audit_log` | Audit trail operațiuni REGES |

**REGES = Registrul Electronic de Evidență a Salariaților** — înlocuiește REVISAL. Integrarea API e DIFERENȚIATOR UNIC (niciun competitor o are).

---

## 4.26-4.28 TABELE RBAC DINAMIC (NOI — P0, DE IMPLEMENTAT)

| # | Tabel | Scop | Status |
|---|-------|------|--------|
| 4.26 | `roles` | Roluri dinamice per țară (role_key, country_code, is_system, metadata JSONB) | 🔴 DE CREAT |
| 4.27 | `permissions` | Permisiuni per rol: resource × action × field_restrictions × conditions (JSONB) | 🔴 DE CREAT |
| 4.28 | `user_roles` | Asignare user → rol (cu company_id, location_id, expires_at) | 🔴 DE CREAT |

Detalii schema completă — vezi DOC1_CONSOLIDARE secțiunea 5.2.

--- — CASCADĂ

**Principiu:** Cel mai specific câștigă.

```
Se verifică angajatul → are medical_exam_months setat?
  DA → folosește valoarea angajatului
  NU → Se verifică locul de muncă (work_location_id) → are medical_exam_months setat?
    DA → folosește valoarea locului de muncă
    NU → Se verifică firma → are medical_exam_months setat?
      DA → folosește valoarea firmei
      NU → DEFAULT: 12 luni
```

**Exemplu complet — SC TechPro SRL (30 angajați IT):**

| Nivel | medical_exam_months | Cine moștenește |
|-------|---------------------|-----------------|
| **Firmă** | 12 | Toți angajații fără setare individuală |
| **Birou Proiectare (location)** | NULL → 12 de la firmă | Angajații din birou |
| **Hala Producție (location)** | 6 | Angajații din hală |
| **Ing. Popescu (employee)** | 6 (individual, coboară des în hală) | Doar el |
| **Ing. Ionescu (employee)** | NULL → 12 de la birou/firmă | Doar el |

**Funcția SQL:** `get_frequency(employee_id, 'medical')` → returnează automat valoarea corectă urmând cascada.

**Același sistem funcționează pentru:**
- `medical_exam_months` — medicina muncii
- `osh_training_months` — instruire SSM
- `fire_training_months` — instruire PSI

---

# 6. ENTROPY CHECK v2 — ANTI-FRAUDĂ INSTRUIRI

**Problemă:** Cineva completează testele pentru toți angajații (fraudă).

**Soluție:** Verificare automată la fiecare test completat.

```
Test completat →
│
├─ Există instruire organizată ACUM pentru firma asta?
│   DA → ALLOW (nu verificăm nimic)
│   Motiv: Consultantul a programat instruirea, totul e legitim
│
├─ Același USER a făcut > 3 teste în 5 minute?
│   DA → BLOCK (fraudă individuală)
│   Motiv: O persoană NU poate face 3 teste în 5 minute pt ea însăși
│   Acțiune: Blochează testul + alertă consultant
│
├─ Aceeași FIRMĂ are > 3 teste în 5 minute, DAR useri diferiți?
│   DA → FLAG (instruire de grup neprogramată)
│   Motiv: Posibil legitimă (tabletă partajată), dar nu a fost programată
│   Acțiune: Log + flag în fraud_alerts, NU blochează
│
└─ Altfel → ALLOW (normal)
```

**Scenariu real 1 — LEGITIM:**
> Firma Construct SRL, 15 muncitori. Consultantul programează "Instruire PSI Q1" pe 10 Feb, 10:00-12:00. Muncitorii vin pe rând la tabletă, fac testul. Entropy Check vede instruirea organizată → ALLOW pe toți.

**Scenariu real 2 — FRAUDĂ:**
> HR-ul firmei vrea să bifeze instruirile fără să le facă real. Intră pe contul fiecărui angajat și completează testul în 30 secunde. Entropy Check vede: același IP, timp minim, pattern suspect → BLOCK + alertă Daniel.

**Scenariu real 3 — ZONA GRII:**
> Firma face instruire ad-hoc (neanunțată). 8 angajați completează pe tabletă în 20 minute. Nu e fraudă, dar nici nu a fost programată. Entropy Check → FLAG. Daniel vede alertă, verifică cu firma, totul OK → marchează "rezolvat".

---

# 7. SISTEMUL DE ALERTE AUTOMATE

**Când se trimit:**
- Zilnic la 08:00 (Vercel Cron Job)
- Verifică TOATE fișele medicale și echipamentele

**Ce verifică:**
1. Ce a expirat deja → alertă ROȘIE
2. Ce expiră în 30 zile → alertă PORTOCALIE
3. Ce expiră în 60 zile → alertă GALBENĂ (doar în weekly summary)

**Unde se trimite:**
- Email la `contact_email` din organizations
- Email la consultant
- (Viitor: SMS, WhatsApp, Push)

**Logare:** Fiecare alertă se logează în `notification_log` (doar evenimentul, nu conținutul).

---

# 8. NEACȚIUNE VIZIBILĂ — PROTOCOLUL DE 15 ZILE

**Concept:** Dacă trimiți o alertă și clientul nu face nimic timp de 15 zile, statusul se schimbă în "IGNORAT".

**De ce e important?** La control ITM, consultantul poate demonstra: "Am trimis 3 alerte pe email, clientul nu a acționat. Dovadă: notification_log + status IGNORAT."

**Fluxul:**
```
Ziua 0: Alertă trimisă → status: 'notified'
Ziua 7: Reminder → status: 'reminded'
Ziua 15: Nicio acțiune → status: 'ignored'
         → Escalare la escalation_email
         → Vizibil în dashboard cu badge roșu "IGNORAT"
```

**Ce vede consultantul:** În dashboard — lista cu fișe/echipamente IGNORATE, grupate pe firmă. Poate decide: sună clientul, trimite scrisoare, sau documentează non-conformitatea.

---

# 9. DASHBOARD — CE VEDE FIECARE ROL

## Super Admin (Daniel)
- **Admin Panel complet** — toți utilizatorii, toate firmele, logs, facturare, configurare
- **CRUD Roluri** — /admin/roles: creare/editare/ștergere roluri, asignare permisiuni
- Acces la TOATE tabelele fără restricții

## Consultant SSM
- **Risc Control ITM** — scor agregat pe toate firmele alocate
- **Tabs:** Medicina Muncii | Echipamente PSI
- **Countere:** Expirate (roșu) | Expiră <30 zile (portocaliu) | Valide (verde)
- **Tabel:** Toate fișele/echipamentele, sortate după urgență
- **Notificări:** Ultimele alerte trimise
- **Link-uri:** Medicina Muncii, Instruiri, PDF Conformitate

## Firma Admin
- Același layout ca consultant, dar **DOAR datele firmei lui**
- Buton "Contactează consultantul"
- Vede periodicitatea fiecărui angajat

## Angajat
- Propriile instruiri + teste
- Status fișă medicală
- Module de training asignate

## Partener Contabil (TIER 2 — planificat)
- **Read-only** firme afiliate: scor conformitate, expirări, alerte
- NU poate modifica nimic — doar vizualizare

## Furnizor PSI (TIER 2 — planificat)
- **Pipeline echipamente** din categoria lui la firmele selectate
- Ce expiră, la cine, contact direct → lead generation automat

## Medic Medicina Muncii (TIER 2 — planificat)
- **Calendar examene** — programări, fișe de completat, statistici
- Confirmare examene direct în platformă

## Inspector ITM (TIER 2 — planificat)
- **Dashboard special** — rapoarte status conformitate per firmă/județ
- DIFERENȚIATOR UNIC — controlul devine formalitate

## Auditor Extern (TIER 2 — planificat)
- **Read-only temporar** — acces cu expires_at automat
- Scor conformitate + documente → audit ISO

## White-Label / STM (TIER 2 — planificat)
- **Dashboard rebranded** — ca Consultant SSM, dar sub brandul partenerului
- DOAR clienții lui vizibili

## Lucrător Desemnat (TIER 2 — planificat)
- **Dashboard simplificat** — ca Firma Admin + raportare către consultant

## Responsabil NIS2 (TIER 2 — planificat)
- **Modul NIS2 dedicat** — evaluare risc cyber, raportare incidente, măsuri, audit trail

## Roluri per țară (TIER 3)
- Echivalentele locale ale rolurilor RO — aceleași dashboarduri, adaptate legislativ

---

# 10. GHID UTILIZATOR — MEDICINA MUNCII

## Adaugă o fișă medicală

1. Click **"+ Adaugă fișă"** (buton albastru, dreapta sus)
2. **Selectează organizația** din dropdown
3. **Selectează angajatul** din dropdown (se auto-completează numele și funcția) SAU completează manual
4. **Tip examinare:** Periodic / Angajare / Adaptare / Reluare / La cerere
5. **Rezultat:** Apt / Apt condiționat / Inapt temporar / Inapt
6. **Data examinare:** Când s-a făcut
7. **Data expirare:** Când expiră fișa
8. **Doctor + Clinică:** Opțional dar recomandat
9. **Restricții:** Dacă e "Apt condiționat" — ce restricții are
10. Click **"Adaugă fișa"**

## Editează o fișă

- Click pe iconița creion (✏️) din dreptul fișei
- Modifică ce trebuie
- Click **"Salvează modificările"**

## Șterge o fișă

- Click pe iconița coș de gunoi (🗑️)
- Confirmă ștergerea

## Filtrare

- **Per organizație:** Dropdown "Toate organizațiile"
- **Per status:** "Expirate" / "Expiră curând" / "Valide"
- **Căutare:** Scrie numele angajatului în câmpul "Caută..."

## Sortare

- Click pe header-ul oricărei coloane (Angajat, Funcție, Data, etc.)
- Click din nou pentru ordine inversă

---

# 11. GHID UTILIZATOR — ECHIPAMENTE PSI

Similar cu Medicina Muncii. Câmpuri specifice:
- **Tip echipament:** Stingător / Trusă prim ajutor / Hidrant / Detector fum / Iluminat urgență
- **Număr serie:** Identificator unic al echipamentului
- **Locație:** Unde se află fizic (ex: "Etaj 2, hol principal")

---

# 12. GHID UTILIZATOR — INSTRUIRI SSM/PSI

## Parcurge o instruire (ca angajat)

1. Loghează-te
2. Vei vedea modulele asignate ție
3. Click pe modul → parcurge materialul
4. La final → test de verificare
5. Trebuie minim 70% corect pentru "passed"

## Programează o instruire (ca consultant)

1. Pagina de instruiri → "Programează sesiune"
2. Selectează firma + modulul
3. Setează data/ora start și finish
4. Opțional: notă despre dispozitiv ("tabletă partajată")
5. Salvează → Entropy Check va permite teste fără alertă în acea fereastră

---

# 13. SCENARII REALE ȘI CUM LE REZOLVĂ PLATFORMA

## Scenariu 1: "Firma are 3 sedii în județe diferite"
→ Creezi 3 entries în `locations` cu `county` diferit. Fiecare are `itm_jurisdiction` și `isu_jurisdiction` propriu. Angajații sunt asignați la locațiile corecte prin `work_location_id`.

## Scenariu 2: "Inginerul proiectant coboară des în hala de producție"
→ Are `work_location_id` = birou proiectare, dar `medical_exam_months` = 6 setat individual (override). Toți ceilalți din birou rămân la 12 luni.

## Scenariu 3: "Firma detașează 5 angajați în Germania"
→ Acei angajați au `mobility_type` = 'cross_border', `host_country` = 'DE'. Platforma aplică legislația din `jurisdictions` pentru Germania la acei angajați.

## Scenariu 4: "Clientul nu răspunde la alerte de 3 săptămâni"
→ Neacțiune Vizibilă: după 15 zile, status = 'ignored'. Consultantul are dovadă documentată. La escalation_email se trimite alertă suplimentară.

## Scenariu 5: "Instruire pe tabletă partajată, 15 angajați în pauza de masă"
→ Consultantul programează organized_training_session. Entropy Check permite toate testele fără alertă.

## Scenariu 6: "HR-ul completează testele pentru toți angajații"
→ Entropy Check detectează: același user_id, > 3 teste în 5 minute → BLOCK + alertă consultant.

## Scenariu 7: "Firma nouă, 50 angajați, trebuie introduse toate datele"
→ (Viitor) Import CSV/Excel cu lista angajaților. Sau manual: Adaugă angajat → Adaugă fișă medicală, unul câte unul.

## Scenariu 8: "Clientul trimite PDF cu fișele medicale"
→ (Viitor) OCR: upload PDF → Google Cloud Vision extrage textul → Claude API structurează datele → se populează automat medical_examinations.

---

# 14. GLOSAR DE TERMENI

| Termen | Explicație |
|--------|------------|
| **SSM** | Securitate și Sănătate în Muncă |
| **PSI** | Prevenire și Stingere Incendii |
| **ITM** | Inspectoratul Teritorial de Muncă — autoritatea care controlează firmele |
| **ISU** | Inspectoratul pentru Situații de Urgență — autoritatea PSI |
| **CUI** | Cod Unic de Înregistrare — identificatorul fiscal al firmei |
| **CNP** | Cod Numeric Personal — criptat SHA-256 în platformă |
| **CAEN** | Clasificarea Activităților din Economia Națională |
| **RLS** | Row Level Security — securitatea la nivel de rând din Supabase |
| **GDPR** | Regulamentul General de Protecție a Datelor |
| **Fișă de aptitudine** | Documentul emis de medicul de medicina muncii care atestă aptitudinea |
| **Entropy Check** | Sistemul anti-fraudă la instruiri |
| **QuickValid** | Verificarea identității la instruire (selfie + semnătură) |
| **Neacțiune Vizibilă** | Protocolul de 15 zile — alertă → reminder → ignorat |
| **Cascadă** | Logica de moștenire a periodicității: Angajat → Loc de muncă → Firmă |
| **HG 355/2007** | Hotărârea de Guvern privind supravegherea sănătății lucrătorilor |
| **Legea 319/2006** | Legea securității și sănătății în muncă |
| **Legea 307/2006** | Legea privind apărarea împotriva incendiilor |

---

*Document generat pentru s-s-m.ro — Versiunea 2.0*
*Actualizat: 8 Februarie 2026*
*Autor: Daniel + Claude AI*
*Changelog v2.0: Secțiunea 3 rescrisă (RBAC Dinamic 17+ roluri), Secțiunea 4 extinsă (tabele 4.18-4.28), Secțiunea 9 extinsă (dashboard per rol)*
