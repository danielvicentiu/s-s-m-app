# Multi-Country Expansion Guide

## Overview

Acest ghid descrie procesul complet de adăugare a unei țări noi în platforma s-s-m.ro.
Platforma suportă multi-țară pentru legislație SSM/PSI, cu configurări specifice pentru fiecare jurisdicție.

**Țări suportate actual:** 🇷🇴 România, 🇧🇬 Bulgaria, 🇭🇺 Ungaria, 🇩🇪 Germania

---

## Checklist Adăugare Țară Nouă

Urmează pașii în ordine pentru a adăuga o țară nouă în platformă:

### 1. ✅ Verificare Prerequisite

- [ ] Confirmare legislație SSM/PSI pentru țara țintă
- [ ] Traduceri disponibile (minim EN + limba locală)
- [ ] Cod țară ISO 3166-1 alpha-2 (ex: RO, BG, HU, DE)
- [ ] Informații valută și timezone
- [ ] Lista sărbători legale pentru anul curent

### 2. 📊 Configurare Bază de Date

- [ ] Rulează migrarea SQL pentru `countries` table (vezi Template SQL)
- [ ] Adaugă recordul țării în `countries` table
- [ ] Verifică RLS policies pentru acces multi-țară

### 3. 🌐 Configurare Traduceri (next-intl)

- [ ] Adaugă locale în `i18n.ts` configuration
- [ ] Creează `messages/{locale}.json` cu traduceri complete
- [ ] Adaugă traduceri legislație specifică în `legislation.{locale}.json`
- [ ] Testează routing pentru `/{locale}/dashboard`

### 4. ⚖️ Date Legislație SSM/PSI

- [ ] Seed date pentru `legislation_requirements` (vezi Template)
- [ ] Configurare frequency pentru inspecții (ITM, ISU/PSI)
- [ ] Link-uri documentație oficială guvernamentală
- [ ] Date compliance deadlines specifice țării

### 5. 💰 Configurare Penalități

- [ ] Adaugă penalties în `penalties` table
- [ ] Configurare currency și amounts conform legislației locale
- [ ] Mapare penalty categories (training, medical, equipment, etc.)
- [ ] Link-uri către legislația de referință

### 6. 📚 Training Types Specifice

- [ ] Seed `training_types` cu categorii locale:
  - SSM general (Safety at Work)
  - PSI/Fire Safety
  - First Aid
  - Lucru la înălțime (Work at Height)
  - ATEX (dacă aplicabil)
  - Specifice industriei
- [ ] Configurare validity_months pentru fiecare tip
- [ ] Adaugă is_mandatory flag unde e cazul

### 7. 🏥 Cerințe Medicale

- [ ] Configurare `medical_requirement_templates` pentru țară
- [ ] Definire job categories și riscuri asociate
- [ ] Frequency pentru medical exams (yearly, biannual, etc.)
- [ ] Required tests per risk category

### 8. 🗓️ Sărbători Legale

- [ ] Seed `public_holidays` table pentru țara nouă
- [ ] Adaugă minimum 2 ani de sărbători (anul curent + următorul)
- [ ] Flag pentru work-free days vs. observances
- [ ] Actualizare anuală obligatorie

### 9. 💱 Valută și Format

- [ ] Adaugă currency code (EUR, RON, BGN, HUF)
- [ ] Configurare currency formatting în frontend
- [ ] Conversion rates (dacă raportare multi-currency)
- [ ] Tax rates specifice (VAT, etc.)

### 10. ⏰ Timezone și Format Date

- [ ] Configurare timezone (Europe/Bucharest, Europe/Sofia, etc.)
- [ ] Date format preferences (DD/MM/YYYY vs MM/DD/YYYY)
- [ ] Time format (24h vs 12h)
- [ ] Week start day (Monday/Sunday)

### 11. 📄 Template Documente

- [ ] Template-uri specifice țării în `document_templates`
- [ ] Contract de muncă standard
- [ ] Fișă SSM
- [ ] Registre obligatorii
- [ ] Rapoarte inspecție ITM/ISU echivalent

### 12. 🏢 Configurare Organizații

- [ ] Permettere selectare țară la crearea organizației
- [ ] Validare fiscal code format (CUI, VAT, etc.)
- [ ] Address format validation
- [ ] Company registration number format

### 13. 🔍 Update Business Logic

- [ ] Filtrare employees/organizations by country
- [ ] Alerts și reminders cu legislație specifică țării
- [ ] Raportare segregată pe țară
- [ ] Dashboard metrics filtrate per country

### 14. 🧪 Testing și Validare

- [ ] Test crearea organizație pentru țara nouă
- [ ] Test employees cu cerințe specifice țării
- [ ] Test alerts pentru deadlines legislație locală
- [ ] Test rapoarte și export date
- [ ] Verificare traduceri în toate paginile

### 15. 📚 Documentație și Deploy

- [ ] Update README cu țara nouă
- [ ] Documentație admin pentru configurare țară
- [ ] Deploy la staging pentru QA
- [ ] Deploy la production după aprobare
- [ ] Comunicare către utilizatori

---

## Template: Country Configuration File

Creează `config/countries/{country_code}.ts`:

```typescript
// config/countries/ro.ts
export const RomaniaConfig = {
  code: 'RO',
  name: 'Romania',
  localName: 'România',
  flag: '🇷🇴',

  // Locale & Formatting
  locale: 'ro-RO',
  timezone: 'Europe/Bucharest',
  currency: 'RON',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  weekStart: 'monday',

  // Legislation
  legislation: {
    ssmAuthority: 'ITM', // Inspectoratul Teritorial de Muncă
    psiAuthority: 'ISU', // Inspectoratul pentru Situații de Urgență
    ssmInspectionFrequency: 12, // months
    psiInspectionFrequency: 12, // months
    officialSources: [
      {
        name: 'Legea 319/2006 - SSM',
        url: 'https://legislatie.just.ro/Public/DetaliiDocument/73789'
      },
      {
        name: 'Legea 307/2006 - PSI',
        url: 'https://legislatie.just.ro/Public/DetaliiDocument/73671'
      }
    ]
  },

  // Training Requirements
  trainingDefaults: {
    ssmGeneral: {
      name: 'Instructaj SSM General',
      validityMonths: 12,
      isMandatory: true
    },
    psiGeneral: {
      name: 'Instructaj PSI',
      validityMonths: 12,
      isMandatory: true
    },
    firstAid: {
      name: 'Prim Ajutor',
      validityMonths: 24,
      isMandatory: false
    }
  },

  // Medical Requirements
  medicalDefaults: {
    generalExam: {
      frequency: 12, // months
      requiredTests: ['general_health', 'vision', 'hearing']
    },
    highRiskExam: {
      frequency: 6, // months
      requiredTests: ['general_health', 'vision', 'hearing', 'respiratory', 'cardiovascular']
    }
  },

  // Business Validation
  validation: {
    fiscalCodeFormat: /^RO\d{2,10}$/, // CUI format
    fiscalCodeExample: 'RO12345678',
    phoneFormat: /^(\+40|0)[0-9]{9}$/,
    phoneExample: '+40712345678',
    postalCodeFormat: /^\d{6}$/,
    postalCodeExample: '123456'
  },

  // Penalties Reference
  penaltyRanges: {
    training: {
      min: 1500, // RON
      max: 5000,
      currency: 'RON'
    },
    medical: {
      min: 2000,
      max: 10000,
      currency: 'RON'
    },
    equipment: {
      min: 3000,
      max: 15000,
      currency: 'RON'
    }
  }
};
```

---

## Template: SQL Migration pentru Țară Nouă

```sql
-- Migration: Add new country support (Example: Austria)
-- File: supabase/migrations/YYYYMMDDHHMMSS_add_austria_country.sql

BEGIN;

-- 1. Add country record
INSERT INTO countries (code, name, local_name, flag, locale, timezone, currency, enabled)
VALUES (
  'AT',
  'Austria',
  'Österreich',
  '🇦🇹',
  'de-AT',
  'Europe/Vienna',
  'EUR',
  true
);

-- 2. Add legislation requirements
INSERT INTO legislation_requirements (country_code, category, requirement, frequency_months, is_mandatory, reference_url)
VALUES
  ('AT', 'ssm', 'Arbeitnehmerschutzgesetz (ASchG) - General Safety', 12, true, 'https://www.ris.bka.gv.at'),
  ('AT', 'psi', 'Fire Safety Inspections', 12, true, 'https://www.ris.bka.gv.at'),
  ('AT', 'medical', 'Occupational Health Examinations', 12, true, 'https://www.ris.bka.gv.at');

-- 3. Add training types
INSERT INTO training_types (country_code, name, name_local, category, validity_months, is_mandatory)
VALUES
  ('AT', 'General OSH Training', 'Allgemeine Sicherheitsunterweisung', 'ssm', 12, true),
  ('AT', 'Fire Safety Training', 'Brandschutzschulung', 'psi', 12, true),
  ('AT', 'First Aid Training', 'Erste-Hilfe-Schulung', 'first_aid', 24, false);

-- 4. Add penalties
INSERT INTO penalties (country_code, category, min_amount, max_amount, currency, severity, description, legal_reference)
VALUES
  ('AT', 'training', 1000, 5000, 'EUR', 'medium', 'Failure to provide mandatory OSH training', 'ASchG §99'),
  ('AT', 'medical', 2000, 10000, 'EUR', 'high', 'Missing occupational health examinations', 'ASchG §99'),
  ('AT', 'equipment', 1500, 7500, 'EUR', 'medium', 'Missing or defective safety equipment', 'ASchG §99');

-- 5. Add public holidays (example for 2026)
INSERT INTO public_holidays (country_code, date, name, name_local, is_work_free)
VALUES
  ('AT', '2026-01-01', 'New Year''s Day', 'Neujahr', true),
  ('AT', '2026-01-06', 'Epiphany', 'Heilige Drei Könige', true),
  ('AT', '2026-04-06', 'Easter Monday', 'Ostermontag', true),
  ('AT', '2026-05-01', 'Labour Day', 'Staatsfeiertag', true),
  ('AT', '2026-05-14', 'Ascension Day', 'Christi Himmelfahrt', true),
  ('AT', '2026-05-25', 'Whit Monday', 'Pfingstmontag', true),
  ('AT', '2026-06-04', 'Corpus Christi', 'Fronleichnam', true),
  ('AT', '2026-08-15', 'Assumption Day', 'Mariä Himmelfahrt', true),
  ('AT', '2026-10-26', 'National Day', 'Nationalfeiertag', true),
  ('AT', '2026-11-01', 'All Saints'' Day', 'Allerheiligen', true),
  ('AT', '2026-12-08', 'Immaculate Conception', 'Mariä Empfängnis', true),
  ('AT', '2026-12-25', 'Christmas Day', 'Weihnachten', true),
  ('AT', '2026-12-26', 'St. Stephen''s Day', 'Stefanitag', true);

-- 6. Add medical requirement templates
INSERT INTO medical_requirement_templates (country_code, job_category, risk_level, frequency_months, required_tests)
VALUES
  ('AT', 'office', 'low', 24, ARRAY['general_health', 'vision']),
  ('AT', 'construction', 'high', 12, ARRAY['general_health', 'vision', 'hearing', 'respiratory', 'cardiovascular']),
  ('AT', 'manufacturing', 'medium', 12, ARRAY['general_health', 'vision', 'hearing']);

COMMIT;
```

---

## Template: Traduceri pentru Țară Nouă

Creează `messages/de-AT.json` (exemplu Austria):

```json
{
  "common": {
    "country": "Țară",
    "language": "Limbă",
    "currency": "Valută"
  },
  "legislation": {
    "ssm": {
      "title": "Arbeitnehmerschutzgesetz",
      "description": "Legea protecției lucrătorilor în Austria",
      "authority": "Arbeitsinspektion",
      "inspectionFrequency": "Controale anuale obligatorii"
    },
    "psi": {
      "title": "Brandschutz",
      "description": "Prevenirea și protecția împotriva incendiilor",
      "authority": "Feuerwehr / Brandschutzbeauftragte",
      "inspectionFrequency": "Controale anuale obligatorii"
    }
  },
  "training": {
    "types": {
      "ssmGeneral": "Allgemeine Sicherheitsunterweisung",
      "psiGeneral": "Brandschutzschulung",
      "firstAid": "Erste-Hilfe-Schulung",
      "workAtHeight": "Schulung für Arbeiten in der Höhe"
    }
  },
  "penalties": {
    "categories": {
      "training": "Schulungsverstöße",
      "medical": "Gesundheitsuntersuchungen",
      "equipment": "Sicherheitsausrüstung"
    }
  }
}
```

---

## Verificare și Testing

### Checklist Post-Implementation

```bash
# 1. Verifică configurația
npm run type-check

# 2. Verifică traducerile
npm run i18n:validate

# 3. Build fără erori
npm run build

# 4. Test local
npm run dev
# Accesează: http://localhost:3000/de-AT/dashboard

# 5. Verifică baza de date
# SQL query pentru verificare completitudine:
SELECT
  c.code,
  COUNT(DISTINCT lr.id) as legislation_count,
  COUNT(DISTINCT tt.id) as training_types_count,
  COUNT(DISTINCT p.id) as penalties_count,
  COUNT(DISTINCT ph.id) as holidays_count
FROM countries c
LEFT JOIN legislation_requirements lr ON lr.country_code = c.code
LEFT JOIN training_types tt ON tt.country_code = c.code
LEFT JOIN penalties p ON p.country_code = c.code
LEFT JOIN public_holidays ph ON ph.country_code = c.code
WHERE c.code = 'AT' -- Schimbă cu codul țării noi
GROUP BY c.code;
```

### Minimum Requirements per Country

- ✅ 1 country record în `countries`
- ✅ Minimum 3 legislation requirements (SSM, PSI, medical)
- ✅ Minimum 5 training types
- ✅ Minimum 10 penalties (diverse categorii)
- ✅ Minimum 10 public holidays per year
- ✅ Minimum 3 medical requirement templates
- ✅ Complete translations în `messages/{locale}.json`

---

## Maintenance și Updates

### Actualizări Anuale

**Decembrie - Ianuarie (fiecare an):**

1. **Public Holidays** - Actualizează sărbători pentru anul următor
2. **Penalties** - Verifică modificări legislație și ajustează sumele
3. **Legislation Requirements** - Verifică updates în legislație
4. **Training Types** - Adaugă noi categorii dacă legislația a schimbat

### Actualizări Ad-Hoc

- **Legislație nouă** - Adaugă requirements în 30 zile de la publicare
- **Modificări penalties** - Update imediat după modificare oficială
- **Traduceri** - Review trimestrial pentru acuratețe

---

## Contact și Suport

**Responsabil Multi-Country:** Daniel (Consultant SSM principal)
**Issues Legislație:** Verifică întotdeauna surse oficiale guvernamentale
**Issues Tehnice:** docs/DOC3_PLAN_EXECUTIE_v4.0.md pentru RBAC și permisiuni

---

## Resurse Externe Utile

### Legislație SSM/PSI Europeană

- 🇪🇺 **EU-OSHA**: https://osha.europa.eu/en/legislation
- 🇪🇺 **EU Directive 89/391/EEC**: Framework OSH directive
- 🇪🇺 **EU Fire Safety Standards**: EN 13501 (classification), EN 3 (extinguishers)

### Standarde și Certificări

- **ISO 45001**: Occupational Health & Safety Management
- **ISO 14001**: Environmental Management (complementar PSI)

### Translation Resources

- **EU Terminology**: https://iate.europa.eu/
- **Country-specific OSH terms**: Verifică site-urile autorităților locale

---

**Ultima actualizare:** 2026-02-13
**Versiune document:** 1.0
**Autor:** Daniel (s-s-m.ro)
