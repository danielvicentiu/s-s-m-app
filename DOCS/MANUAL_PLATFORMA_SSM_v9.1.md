# MANUAL PLATFORMA S-S-M.RO
> **Versiune:** 9.1 | **Data:** 9 Februarie 2026 | **31 funcționalități LIVE**

---

# 1. ACCES PLATFORMĂ

| Ce | URL |
|---|---|
| Landing RO | https://app.s-s-m.ro/ro |
| Landing BG | https://app.s-s-m.ro/bg |
| Landing HU | https://app.s-s-m.ro/hu |
| Landing DE | https://app.s-s-m.ro/de |
| Landing PL | https://app.s-s-m.ro/pl |
| Dashboard | https://app.s-s-m.ro/ro/dashboard |
| Admin Roluri | https://app.s-s-m.ro/ro/admin/roles |
| Admin Obligații | https://app.s-s-m.ro/ro/admin/obligations |
| Admin Alerte | https://app.s-s-m.ro/ro/admin/alert-categories |
| Admin Echipamente | https://app.s-s-m.ro/ro/admin/equipment-types |
| Admin Țări | https://app.s-s-m.ro/ro/admin/countries |
| GitHub | https://github.com/danielvicentiu/s-s-m-app |
| Supabase | uhccxfyvhjeudkexcgiq.supabase.co |

---

# 2. AUTENTIFICARE

Două metode funcționale:
- **Email + Parolă** (Test1234! pentru cont test)
- **Magic Link** (link pe email, fără parolă)

---

# 3. STRUCTURA BAZEI DE DATE

## 3.1 Tabele (31+ total)

**CORE (11):** organizations, profiles, memberships, employees, locations, medical_records, safety_equipment, notification_log, training_modules, training_assignments, training_sessions

**RBAC (3):** roles (27 roluri), permissions (~210), user_roles

**CONFIGURABILE (3):** obligation_types (~60), alert_categories (~60), equipment_types (~103)

**EXTENDED (5+):** jurisdictions, authorities, alert_preferences, countries, document_templates

**REGES (3-4):** reges_outbox, reges_receipts, reges_results (⚠️ verifică cu SELECT)

## 3.2 Views (5)
v_dashboard_overview, v_active_alerts, v_medical_status, v_equipment_status, v_training_progress

## 3.3 Funcții RBAC (7)
rbac_has_role(), rbac_has_role_in_org(), rbac_get_my_org_ids(), rbac_is_super_admin(), rbac_has_permission(), + 2 helper

## 3.4 ENUM-uri (3 noi)
obligation_frequency, alert_severity, equipment_category

---

# 4. SISTEM RBAC

## 4.1 Roluri (27 total)

**System (4):** super_admin, consultant_ssm, firma_admin, angajat

**România (13):** partener_contabil, furnizor_psi, furnizor_iscir_rsvti, medic_medicina_muncii, auditor_extern, inspector_itm, inspector_igsu, inspector_anspdcp, lucrator_desemnat, white_label_stm, responsabil_ssm_intern, training_provider, responsabil_nis2

**Per țară (10):** BG (3), HU (2), DE (3), PL (2)

## 4.2 Permisiuni
- super_admin: ~114 permisiuni
- consultant_ssm: ~75
- firma_admin: ~16
- angajat: ~5

## 4.3 Admin UI (/admin/roles)
CRUD complet: listă, editare cu matrice permisiuni, creare, asignare. Zero cod pentru modificări.

---

# 5. MULTI-TENANT / MULTI-COUNTRY

## 5.1 Limbi active (5)
RO (default), BG, HU, DE, PL

## 5.2 Routing
Path-based: /ro/dashboard, /bg/dashboard, etc.
DOMAIN_CONFIG pregătit pentru domenii viitoare (bzr24.bg, sst24.hu, as-dig.de, bhp24.pl)

## 5.3 Traduceri
129 chei × 5 limbi = 645 traduceri. Fișiere: messages/{ro,bg,hu,de,pl}.json
Terminologie profesională per țară (ЗБУТ, Munkavédelem, Arbeitsschutz, BHP)

## 5.4 Prețuri locale
RO: 990 LEI/an | BG: 199 EUR/an | HU: 74.900 HUF/an | DE: 399 EUR/an | PL: 1.690 PLN/an

## 5.5 Obligații per țară
12 tipuri obligații × 5 țări = ~60 records. BG/HU/DE/PL clonate din RO cu marcaj ⚠️ ADAPTEAZĂ.

## 5.6 Echipamente per țară
~103 tipuri echipamente. 11 stingătoare + 12 alte echipamente RO, clonate per țară.

---

# 6. ADMIN UI — PAGINI CONFIGURARE

## 6.1 /admin/obligations
Lista obligații legale per țară. Filtrare per țară, stats cards, delete cu confirmare (doar non-system, doar super_admin). Create/Edit = placeholder (Supabase Table Editor).

## 6.2 /admin/alert-categories
Categorii alerte cu severity badges, canale notificare, FK la obligation_types.

## 6.3 /admin/equipment-types
Tipuri echipamente cu filtrare per țară + categorie. 14 categorii (fire_extinguisher, iscir_equipment, electrical, etc.)

## 6.4 /admin/countries
Overview: 5 țări cu stats (nr obligații, alerte, echipamente per țară). Link-uri rapide la listele filtrate.

---

# 7. LANDING PAGES

## 7.1 Funcționalități
- Server/Client component split (SSR + interactivitate)
- Prețuri locale din messages/*.json
- Penalties Calculator dinamic (citește obligation_types din DB)
- Selector limbă cu steaguri emoji
- Intl.NumberFormat per locale

## 7.2 Penalties Calculator
Checkbox interactiv per obligație legală. Calcul real-time risc financiar (penalty_min + penalty_max). Moneda corectă per țară. Demonstrează ROI: risc amenzi vs cost platformă.

---

# 8. EMAIL ALERTE

- Provider: Resend (alerte@s-s-m.ro)
- DKIM + SPF + DMARC configurate
- Vercel Cron: zilnic 08:00
- notification_log funcțional
- Secțiune "Ultimele Notificări" pe dashboard

---

# 9. TRAINING MODULES

- 9 module de instruire
- Training assignments (atribuire cursuri → angajați)
- Training sessions cu progres auto-save
- Quiz + verificare
- Certificat PDF auto-generat

---

# 10. DEPLOYMENT

- **Vercel:** Auto-deploy din GitHub main branch
- **125 rute generate** (5 limbi × ~25 pagini)
- **Build time:** ~20-30 secunde
- **Zero erori TypeScript**

---

# 11. COMENZI UTILE

```bash
# Dezvoltare locală
npm run dev

# Build producție
npm run build

# Git workflow
git pull origin main --rebase    # sincronizare
git push origin main             # deploy automat

# Supabase types (dacă schema se schimbă)
npx supabase gen types typescript --project-id uhccxfyvhjeudkexcgiq > src/types/database.types.ts
```

---

# 12. CRONOLOGIE DEZVOLTARE

| Data | Ce s-a făcut |
|------|-------------|
| Ian 2026 | Fundație: Supabase + Next.js + Vercel + Auth + Landing + Dashboard |
| Feb săpt 1 | Alerte email Resend + Training modules + Equipment management |
| 8 Feb | RBAC dinamic: 27 roluri, 210 permisiuni, admin UI, RLS 25+ tabele |
| 9 Feb | MULTI-TENANT COMPLET: 5 faze în ~2 ore |
| 9 Feb | Tabele configurabile + next-intl + Admin UI + Refactor dashboard + Landing 5 țări |
