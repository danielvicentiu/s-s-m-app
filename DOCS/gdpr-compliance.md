# GDPR Compliance Documentation
## s-s-m.ro Platform — Conformitate GDPR

**Versiune:** 1.0
**Ultima actualizare:** 13 februarie 2026
**Responsabil:** Daniel (Consultant SSM/PSI, Owner)
**Platformă:** https://app.s-s-m.ro

---

## 1. INTRODUCERE

Platforma s-s-m.ro procesează date cu caracter personal ale consultanților SSM/PSI, administratorilor de firme și angajaților din România, Bulgaria, Ungaria și Germania. Acest document detaliază conformitatea cu Regulamentul General privind Protecția Datelor (GDPR - EU 2016/679).

### 1.1 Cadru legal aplicabil
- **GDPR (EU 2016/679)** — regulament european privind protecția datelor
- **Legea 190/2018** — implementarea GDPR în România
- **Legislație specifică:** Bulgaria (LPPD), Ungaria (LXIII/2018), Germania (BDSG)
- **Legislație sector:** Legea 319/2006 (SSM), Legea 307/2006 (PSI)

---

## 2. INVENTAR DATE PERSONALE

### 2.1 Categorii de persoane vizate (Data Subjects)

| Categorie | Descriere | Volume estimat |
|-----------|-----------|----------------|
| **Consultanți SSM/PSI** | Profesioniști înregistrați pe platformă | 100+ utilizatori activi |
| **Administratori firme** | Reprezentanți legali ai organizațiilor client | 500+ utilizatori |
| **Angajați** | Personal înregistrat în firmele client | 5000+ înregistrări |
| **Contacte organizații** | Persoane de contact pentru firme | 1000+ contacte |

### 2.2 Tipuri de date procesate

#### A. Date de identificare
- **Tabele:** `profiles`, `employees`, `organizations`
- **Câmpuri:**
  - Nume complet (`full_name`, `first_name`, `last_name`)
  - CNP/identificator național
  - Dată naștere
  - Email
  - Telefon
  - Adresă postală
  - Funcție/poziție

#### B. Date medicale (categorii speciale - Art. 9 GDPR)
- **Tabele:** `medical_records`, `medical_checkups`
- **Câmpuri:**
  - Tip aviz medical (`aviz_type`)
  - Data examinării (`checkup_date`)
  - Data expirării (`expiry_date`)
  - Status aptitudine (`is_fit_for_work`)
  - Restricții medicale (`restrictions`)
  - Documente scanate (certificate medicale)
  - **Bază legală:** Obligație legală (Legea 319/2006, Art. 18-19)

#### C. Date de formare profesională
- **Tabele:** `trainings`, `training_participations`
- **Câmpuri:**
  - Tip instruire SSM/PSI
  - Date participare
  - Certificate obținute
  - Evaluări/teste

#### D. Date de echipamente de protecție
- **Tabele:** `equipment`, `equipment_assignments`
- **Câmpuri:**
  - Echipament alocat
  - Mărime
  - Date distribuire/returnare

#### E. Date de acces și autentificare
- **Tabele:** `profiles`, `audit_log`, Supabase Auth
- **Câmpuri:**
  - Email (username)
  - Parolă hash (Supabase Auth)
  - Data ultimei autentificări (`last_sign_in_at`)
  - IP address (audit log)
  - Browser/User Agent

#### F. Date de activitate (audit trail)
- **Tabele:** `audit_log`
- **Câmpuri:**
  - User ID
  - Acțiune efectuată
  - Timestamp
  - IP address
  - Resurse accesate

### 2.3 Fluxuri de date

```
┌─────────────────┐
│  Data Subject   │
│  (angajat)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────────┐
│ Organizație     │─────▶│  Platformă       │
│ (Client)        │      │  s-s-m.ro        │
└─────────────────┘      └────────┬─────────┘
                                  │
                         ┌────────┴────────┐
                         ▼                 ▼
                  ┌─────────────┐   ┌─────────────┐
                  │  Supabase   │   │   Vercel    │
                  │  (Database) │   │  (Hosting)  │
                  └─────────────┘   └─────────────┘
```

---

## 3. REGISTRUL ACTIVITĂȚILOR DE PRELUCRARE
**(Art. 30 GDPR)**

### 3.1 Activitate: Gestionare utilizatori platformă

| Element | Detalii |
|---------|---------|
| **Scop prelucrare** | Autentificare, control acces, administrare cont |
| **Categorii date** | Identificare, email, parolă hash, date acces |
| **Categorii persoane** | Consultanți, administratori firme, angajați |
| **Destinatari** | Supabase (procesator), Vercel (hosting) |
| **Transferuri internaționale** | Supabase EU (Frankfurt), Vercel EU |
| **Termene stocare** | Contul activ + 1 an după ștergere (soft delete) |
| **Măsuri securitate** | Encryption at rest/transit, RLS, MFA opțional |

### 3.2 Activitate: Evidența medicală SSM

| Element | Detalii |
|---------|---------|
| **Scop prelucrare** | Conformitate Legea 319/2006 — avize medicale SSM |
| **Categorii date** | Date medicale (Art. 9 GDPR), CNP, aptitudine muncă |
| **Categorii persoane** | Angajați din organizațiile client |
| **Destinatari** | Consultant SSM, Angajator, Autorități (ITM la solicitare) |
| **Transferuri internaționale** | NU (toate datele în EU) |
| **Termene stocare** | 5 ani de la încetarea contractului de muncă (Legea 319/2006) |
| **Măsuri securitate** | RLS strict, acces pe bază de rol, encryption, audit log |

### 3.3 Activitate: Instruire SSM/PSI

| Element | Detalii |
|---------|---------|
| **Scop prelucrare** | Evidență instruiri obligatorii (Legea 319/2006, HG 1425/2006) |
| **Categorii date** | Identificare, funcție, date instruire, certificate |
| **Categorii persoane** | Angajați |
| **Destinatari** | Consultant SSM/PSI, Angajator, Autorități (ITM) |
| **Transferuri internaționale** | NU |
| **Termene stocare** | 10 ani (Legea 319/2006, Art. 30) |
| **Măsuri securitate** | RLS, encryption, backup zilnic |

### 3.4 Activitate: Audit și monitorizare sistem

| Element | Detalii |
|---------|---------|
| **Scop prelucrare** | Securitate sistem, detectare încălcări, conformitate |
| **Categorii date** | User ID, IP, timestamp, acțiuni, resurse accesate |
| **Categorii persoane** | Toți utilizatorii platformei |
| **Destinatari** | Administrator platformă (Daniel) |
| **Transferuri internaționale** | NU |
| **Termene stocare** | 12 luni (retention audit log) |
| **Măsuri securitate** | Acces restricționat, logs encrypted |

---

## 4. BAZE LEGALE PRELUCRARE
**(Art. 6 și Art. 9 GDPR)**

### 4.1 Baze legale principale

| Scop prelucrare | Bază legală GDPR | Legislație specifică |
|----------------|------------------|---------------------|
| **Evidență medicală SSM** | Art. 9(2)(b) — obligație dreptul muncii<br>Art. 6(1)(c) — obligație legală | Legea 319/2006, Art. 18-19<br>HG 355/2007 |
| **Instruiri SSM/PSI** | Art. 6(1)(c) — obligație legală | Legea 319/2006, Art. 18<br>HG 1425/2006 |
| **Gestionare cont utilizator** | Art. 6(1)(b) — executare contract | Termeni și Condiții platformă |
| **Alerte și notificări** | Art. 6(1)(f) — interes legitim | Prevenire accidente, compliance |
| **Audit log** | Art. 6(1)(f) — interes legitim | Securitate sistem, prevenire fraude |
| **Echipamente de protecție** | Art. 6(1)(c) — obligație legală | Legea 319/2006, Art. 108-109 |

### 4.2 Consimțământ explicit (când este necesar)

- **Newsletter/Marketing:** Checkbox explicit la înregistrare (opțional)
- **Partajare date cu terți** (în afara obligațiilor legale): Consimțământ explicit
- **Profilare automată:** NU este implementată momentan

---

## 5. DREPTURI PERSOANE VIZATE
**(Art. 12-22 GDPR)**

### 5.1 Dreptul de acces (Art. 15)

**Procedură:**
1. Solicitare prin email la: **gdpr@s-s-m.ro** sau **daniel@s-s-m.ro**
2. Verificare identitate (copie CI/pașaport)
3. Răspuns în **max 30 zile** cu:
   - Date procesate
   - Scopuri prelucrare
   - Destinatari
   - Termene stocare
   - Drepturi disponibile

**Implementare tehnică:**
```sql
-- Query pentru export date utilizator
SELECT * FROM profiles WHERE id = '[user_id]';
SELECT * FROM employees WHERE organization_id IN (
  SELECT organization_id FROM memberships WHERE user_id = '[user_id]'
);
SELECT * FROM medical_records WHERE employee_id IN (...);
SELECT * FROM trainings WHERE organization_id IN (...);
-- etc.
```

### 5.2 Dreptul de rectificare (Art. 16)

**Procedură:**
- Utilizatorii pot modifica direct datele de profil în `/dashboard/settings`
- Pentru date medicale/instruiri: solicitare prin consultant SSM
- Pentru date controlate (CNP, certificat naștere): verificare documente

**Implementare tehnică:**
- Update queries cu audit trail
- Validare date noi (format, completitudine)

### 5.3 Dreptul de ștergere ("dreptul de a fi uitat") (Art. 17)

**Condiții aplicare:**
- ✅ Datele nu mai sunt necesare pentru scopul inițial
- ✅ Persoana își retrage consimțământul (dacă acesta era baza legală)
- ✅ Datele au fost procesate ilegal
- ❌ **EXCEPȚII:** Date necesare pentru conformitate legală (registre SSM — min. 5-10 ani)

**Procedură:**
1. Solicitare scrisă la gdpr@s-s-m.ro
2. Verificare eligibilitate (nu există obligație legală stocare)
3. **Soft delete** (marcare `deleted_at`) + anonimizare
4. Confirmare în 30 zile

**Implementare tehnică:**
```sql
-- Soft delete (nu hard delete din cauza obligațiilor legale)
UPDATE profiles SET deleted_at = NOW(), email = 'deleted_user_[id]@deleted.local' WHERE id = '[user_id]';
UPDATE employees SET deleted_at = NOW(), first_name = '[ȘTERS]', last_name = '[ȘTERS]', cnp = NULL WHERE id = '[emp_id]';
```

### 5.4 Dreptul la portabilitate (Art. 20)

**Procedură:**
1. Solicitare prin email
2. Export date în format **JSON** sau **CSV**
3. Livrare prin email securizat sau download link (expirare 7 zile)

**Implementare tehnică:**
```typescript
// api/gdpr/export
export async function exportUserData(userId: string) {
  const data = {
    profile: await getProfile(userId),
    organizations: await getUserOrganizations(userId),
    employees: await getEmployees(userId),
    trainings: await getTrainings(userId),
    // etc.
  };
  return JSON.stringify(data, null, 2);
}
```

### 5.5 Dreptul de opoziție (Art. 21)

**Aplicabil pentru:**
- Marketing/newsletter (opoziție necondiționată)
- Prelucrări bazate pe interes legitim (opoziție cu motive specifice)

**NU se aplică pentru:**
- Obligații legale (evidențe SSM/PSI)

### 5.6 Dreptul de a nu fi supus deciziilor automate (Art. 22)

**Status:** Platforma **NU** folosește profilare automată sau decizii exclusiv automate cu efecte juridice.

---

## 6. DATA PROTECTION OFFICER (DPO)

### 6.1 Necesitate DPO

**Evaluare Art. 37 GDPR:**
- ✅ Prelucrare date medicale (categorii speciale) la scară largă
- ✅ Monitorizare sistematică (audit log)
- ⚠️ **Recomandare:** Desemnare DPO (chiar dacă nu este obligatoriu strict pentru platformele <250 angajați)

### 6.2 Contact DPO (propus)

**Temporar (până la desemnare oficială):**
```
Responsabil protecție date: Daniel
Email: gdpr@s-s-m.ro / daniel@s-s-m.ro
Telefon: [LA COMPLETAT]
Adresă: [LA COMPLETAT]
```

**Recomandare:** Externalizare servicii DPO sau formare internă certificată.

---

## 7. EVALUAREA IMPACTULUI ASUPRA PROTECȚIEI DATELOR (DPIA)
**(Art. 35 GDPR)**

### 7.1 Necesitate DPIA

**Trigger-uri:**
- ✅ Prelucrare date medicale la scară largă
- ✅ Monitorizare sistematică (audit logs, IP tracking)
- ⚠️ **Concluzie:** DPIA este **recomandată**

### 7.2 Sumar DPIA — Platforma s-s-m.ro

| Element | Evaluare |
|---------|----------|
| **Descriere prelucrare** | Platformă SaaS pentru gestionare compliance SSM/PSI, incluzând date medicale angajați |
| **Necesitate și proporționalitate** | ✅ Justificată de obligații legale (Legea 319/2006, 307/2006) |
| **Riscuri pentru persoane** | Dezvăluire date medicale, acces neautorizat, profilare discriminatorie |
| **Măsuri atenuare** | RLS, encryption, MFA, audit log, RBAC, acces bazat pe necesitate |
| **Risc rezidual** | **SCĂZUT** (după implementare măsuri) |
| **Consultare DPO** | [LA COMPLETAT după desemnare] |
| **Aprobare** | Daniel (Owner) — [DATA] |

### 7.3 Măsuri de securitate (Art. 32 GDPR)

#### A. Măsuri tehnice
- ✅ **Encryption at rest:** Supabase PostgreSQL (AES-256)
- ✅ **Encryption in transit:** TLS 1.3 (HTTPS obligatoriu)
- ✅ **Row Level Security (RLS):** Toate tabelele protejate
- ✅ **Password hashing:** bcrypt (Supabase Auth)
- ✅ **Audit logging:** Toate acțiunile critice (`audit_log`)
- ✅ **Backup zilnic:** Supabase automatic backups (point-in-time recovery)
- 🔄 **MFA (Multi-Factor Authentication):** În implementare
- 🔄 **RBAC dinamic:** Migrare în curs (docs/DOC3)

#### B. Măsuri organizatorice
- ✅ **Access control:** Acces bazat pe rol (consultant/firma_admin/angajat)
- ✅ **Need-to-know principle:** RLS policies limitate per organizație
- ✅ **Pseudonimizare:** User IDs (UUID), nu CNP în queries
- ⚠️ **Training GDPR:** Recomandare pentru consultanți
- ⚠️ **Data breach procedure:** Documentat în acest fișier (Secțiunea 8)

#### C. Măsuri de monitorizare
- ✅ **Intrusion detection:** Vercel Web Application Firewall
- ✅ **Anomaly detection:** Rate limiting, failed login tracking
- ✅ **Regular audits:** Review logs lunar

---

## 8. PROCEDURA DE NOTIFICARE A ÎNCĂLCĂRILOR DE DATE
**(Art. 33-34 GDPR)**

### 8.1 Definiție breach

O încălcare poate include:
- Acces neautorizat la date (hack, furt credențiale)
- Pierdere/distrugere date (failure backup)
- Dezvăluire accidentală (email trimis greșit)
- Modificare neautorizată

### 8.2 Procedură pas cu pas

#### FAZA 1: Detectare și evaluare (0-12 ore)
1. **Detectare:** Audit log, monitoring Supabase/Vercel, raportare utilizator
2. **Alertare:** Email imediat la daniel@s-s-m.ro + DPO (când este desemnat)
3. **Evaluare preliminară:**
   - Ce date au fost compromise?
   - Câte persoane afectate?
   - Risc ridicat pentru drepturi/libertăți? (date medicale → DA)

#### FAZA 2: Containment (12-24 ore)
4. **Izolare:** Oprire sistem afectat, schimbare credențiale, patch vulnerabilitate
5. **Investigare:** Cauză root, extent breach, logs forensics
6. **Documentare:** Incident report în `audit_log` sau fișier dedicat

#### FAZA 3: Notificare (24-72 ore)
7. **Notificare autoritate (Art. 33):**
   - **Destinatar:** ANSPDCP (România) — https://dataprotection.ro
   - **Termen:** **Max 72 ore** de la conștientizare
   - **Conținut:**
     - Natura încălcării
     - Categorii și număr persoane/înregistrări afectate
     - Contact DPO
     - Consecințe probabile
     - Măsuri adoptate/propuse
   - **Formular:** https://dataprotection.ro/index.jsp?page=Notificare_Incalcare

8. **Notificare persoane afectate (Art. 34):**
   - **Când:** Risc ridicat pentru drepturi/libertăți (ex: date medicale expuse)
   - **Mod:** Email direct + notificare în platformă
   - **Conținut:**
     - Descriere clară și simplă a breach-ului
     - Contact DPO
     - Consecințe probabile
     - Măsuri recomandate (schimbare parolă, monitorizare cont)

#### FAZA 4: Remediere și prevenție (7-30 zile)
9. **Remediere:** Fix vulnerabilitate, restore backup (dacă necesar)
10. **Analiză post-incident:** Lessons learned, update DPIA
11. **Update proceduri:** Patch management, training, policies

### 8.3 Template email notificare utilizatori

```
Subiect: [URGENT] Notificare incident securitate — Platforma s-s-m.ro

Stimate utilizator,

Vă informăm că pe data [DATA] am detectat un incident de securitate care a afectat
datele dumneavoastră personale din platforma s-s-m.ro.

Date afectate: [SPECIFICARE — ex: nume, email, date medicale]
Cauză: [SCURTĂ DESCRIERE]

Măsuri adoptate:
- [MĂSURĂ 1]
- [MĂSURĂ 2]

Ce trebuie să faceți:
- Schimbați parola contului dumneavoastră imediat
- Monitorizați orice activitate suspectă în cont
- Contactați-ne la gdpr@s-s-m.ro pentru întrebări

Autoritatea de supraveghere (ANSPDCP) a fost notificată conform Art. 33 GDPR.

Ne cerem scuze pentru inconvenient și vă asigurăm că luăm toate măsurile pentru
prevenirea unor incidente viitoare.

Cu respect,
Echipa s-s-m.ro
Contact DPO: gdpr@s-s-m.ro
```

### 8.4 Registrul încălcărilor

**Locație:** `docs/data-breaches-register.md` (creat la nevoie, confidențial)

**Conținut obligatoriu (Art. 33(5)):**
- Data și ora detectării
- Natura încălcării
- Persoane/date afectate
- Consecințe
- Măsuri adoptate
- Notificări efectuate (ANSPDCP, persoane)

---

## 9. SUB-PROCESATORI (Art. 28 GDPR)

### 9.1 Lista sub-procesatori

| Sub-procesator | Serviciu | Locație date | DPA semnat | Certificări |
|----------------|----------|--------------|------------|-------------|
| **Supabase Inc.** | Database hosting, Auth | EU (Frankfurt, Germania) | ✅ Da ([link](https://supabase.com/dpa)) | SOC 2 Type II, ISO 27001 |
| **Vercel Inc.** | Hosting, CDN | EU (Frankfurt) | ✅ Da ([link](https://vercel.com/legal/dpa)) | SOC 2, ISO 27001 |
| **Resend** (dacă folosit) | Email transactional | EU | ⚠️ Verificare necesară | - |

### 9.2 Contracte de prelucrare (DPA — Data Processing Agreement)

**Obligații sub-procesatori:**
- Prelucrare doar pe instrucțiuni documentate
- Confidențialitate personal
- Măsuri de securitate adecvate (Art. 32)
- Asistență pentru drepturi persoane vizate
- Asistență DPIA și notificare breach
- Ștergere/returnare date la încetare contract

**Link-uri DPA:**
- Supabase: https://supabase.com/docs/company/dpa
- Vercel: https://vercel.com/legal/dpa

### 9.3 Transferuri internaționale

**Status:** TOATE datele sunt stocate în **EU (Frankfurt, Germania)**.

**Mecanisme (dacă se extinde în afara EU):**
- Standard Contractual Clauses (SCCs) — 2021 version
- Adequacy decisions (UK, Elveția)
- ❌ **NU** Privacy Shield (invalidat — Schrems II)

---

## 10. TERMENE DE STOCARE DATELOR

### 10.1 Principiul limitării stocării (Art. 5(1)(e))

| Tip date | Termen stocare | Bază legală |
|----------|----------------|-------------|
| **Date medicale SSM** | **5 ani** de la încetarea contractului de muncă | Legea 319/2006 |
| **Instruiri SSM/PSI** | **10 ani** de la efectuare | Legea 319/2006, Art. 30 |
| **Documente echipamente** | **5 ani** de la returnare | Legea 319/2006 |
| **Contracte de muncă** | **75 ani** (dacă includ date pensie) | Legea arhivelor |
| **Audit logs** | **12 luni** | Interes legitim (securitate) |
| **Conturi inactive** | **24 luni** → soft delete | Politică internă |
| **Date backup** | **30 zile** (point-in-time recovery) | Disaster recovery |

### 10.2 Procedură ștergere automată

**Implementare tehnică (exemplu):**
```sql
-- Cron job lunar: ștergere audit logs > 12 luni
DELETE FROM audit_log WHERE created_at < NOW() - INTERVAL '12 months';

-- Cron job semestrial: soft delete conturi inactive > 24 luni
UPDATE profiles SET deleted_at = NOW()
WHERE last_sign_in_at < NOW() - INTERVAL '24 months'
  AND deleted_at IS NULL;
```

---

## 11. POLITICI ȘI DOCUMENTE ASOCIATE

### 11.1 Documente publice (obligatorii Art. 13-14)

- ✅ **Privacy Policy** — `/privacy-policy` (website public)
- ✅ **Terms of Service** — `/terms-of-service`
- ✅ **Cookie Policy** — `/cookie-policy` (dacă se folosesc cookies)
- 🔄 **Formular consimțământ** — La înregistrare

### 11.2 Documente interne

- ✅ **GDPR Compliance Documentation** — Acest fișier
- 🔄 **Data Breach Response Plan** — Secțiunea 8
- 🔄 **DPIA — Full Assessment** — Secțiunea 7 (sumar)
- 🔄 **Employee GDPR Training** — La implementat

### 11.3 Registre obligatorii

- ✅ **Registrul activităților de prelucrare** — Secțiunea 3
- ✅ **Registrul sub-procesatori** — Secțiunea 9
- 🔄 **Registrul încălcărilor** — `docs/data-breaches-register.md` (la nevoie)

---

## 12. CONFORMITATE ȘI AUDIT

### 12.1 Responsabilități

| Rol | Responsabilitate |
|-----|------------------|
| **Owner (Daniel)** | Operator de date (controller), decizie strategică GDPR |
| **DPO (propus)** | Consiliere, audit, contact autoritate, training |
| **Developer** | Implementare privacy by design, securitate tehnică |
| **Consultanți SSM** | Colectare legală date, informare angajați |

### 12.2 Plan de audit

**Frecvență:** Semestrial (iunie, decembrie)

**Checklist audit:**
- [ ] Review registrul activităților de prelucrare
- [ ] Verificare RLS policies (Supabase)
- [ ] Testare procedură export date (portabilitate)
- [ ] Review audit logs pentru acces neautorizat
- [ ] Update sub-procesatori și DPA-uri
- [ ] Verificare termene stocare (cleanup date expirate)
- [ ] Test procedură data breach (simulation)
- [ ] Update Privacy Policy (dacă necesare modificări)

### 12.3 Contact autoritate

**România:**
```
Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP)
Adresă: B-dul G-ral. Gheorghe Magheru 28-30, Sector 1, București
Telefon: +40 21 252 5599
Email: anspdcp@dataprotection.ro
Website: https://www.dataprotection.ro
```

**Bulgaria, Ungaria, Germania:** Contact autorități locale dacă se extinde operațiunile.

---

## 13. ACTUALIZĂRI DOCUMENT

| Versiune | Dată | Autor | Modificări |
|----------|------|-------|------------|
| 1.0 | 13.02.2026 | Claude Code | Creare inițială document GDPR compliance |

---

## 14. RECOMANDĂRI URMĂTORII PAȘI

### Prioritate ÎNALTĂ
1. ✅ **Desemnare DPO** (intern sau externalizat)
2. ✅ **Completare DPIA full** (folosind template ANSPDCP)
3. ✅ **Implementare export date automat** (portabilitate)
4. ✅ **Update Privacy Policy** cu detalii din acest document
5. ✅ **Setup email gdpr@s-s-m.ro** (dedicat)

### Prioritate MEDIE
6. ⚠️ **Training GDPR pentru consultanți** (online course)
7. ⚠️ **Simulare data breach** (test procedură)
8. ⚠️ **Review și update DPA-uri** sub-procesatori
9. ⚠️ **Implementare MFA** (securitate suplimentară)
10. ⚠️ **Automatizare cleanup date** (cron jobs)

### Prioritate SCĂZUTĂ
11. 🔄 **Certificare ISO 27001** (dacă crește business-ul)
12. 🔄 **External audit GDPR** (consultant extern)
13. 🔄 **Cookie consent management** (dacă se adaugă analytics)

---

**Document întocmit conform GDPR (EU 2016/679) și Legea 190/2018.**

**Ultima actualizare:** 13 februarie 2026
**Contact:** gdpr@s-s-m.ro | daniel@s-s-m.ro
