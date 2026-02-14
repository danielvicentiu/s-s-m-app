# Excel Export Edge Function

Edge Function pentru export date în format Excel (XLSX) cu SheetJS.

## Funcționalitate

Primește `org_id` și `export_type`, extrage datele din Supabase, generează fișier XLSX cu multiple sheets, headers bold, auto-width columns, și returnează URL signed pentru download.

## Request Body

```json
{
  "org_id": "uuid",
  "export_type": "employees" | "trainings" | "medical" | "equipment" | "compliance",
  "filters": {
    "start_date": "2025-01-01",
    "end_date": "2025-12-31",
    "status": "completed",
    "location_id": "uuid"
  }
}
```

## Export Types

### 1. `employees` - Export Angajați
- **Sheets:** Angajați + Rezumat
- **Coloane:** Nume, Post, Departament, Locație, Email, Telefon, Data Angajării, Activ, Cod COR
- **Statistici:** Total, Activi, Inactivi

### 2. `trainings` - Export Instruiri
- **Sheets:** Instruiri + Rezumat
- **Coloane:** Angajat, Post, Curs, Cod Curs, Status, Progres, Scor Quiz, Date, Certificat
- **Statistici:** Total, Finalizate, În Progres, Neîncepute, Rata Finalizare

### 3. `medical` - Export Medicina Muncii
- **Sheets:** Medicina Muncii + Rezumat
- **Coloane:** Angajat, Post, Tip Examinare, Date, Rezultat, Restricții, Medic, Clinică
- **Statistici:** Total, Pe Rezultate (Apt/Inapt), Expirate, Expiră în 30 Zile

### 4. `equipment` - Export Echipamente PSI
- **Sheets:** Echipamente + Rezumat
- **Coloane:** Tip, Descriere, Locație, Serie, Date Verificări, Inspector, Conform
- **Statistici:** Total, Conforme/Neconforme, Expirate, Pe Tipuri

### 5. `compliance` - Export Conformitate (Overview)
- **Sheets:** Rezumat Conformitate + Alerte
- **Conținut:**
  - Rezumat: Statistici agregate din toate categoriile
  - Alerte: Liste cu elemente expirate sau expirând în 30 zile (Medicina Muncii + Echipamente)
  - Sortare: După zile rămase (cele mai critice primele)

## Response

```json
{
  "success": true,
  "download_url": "https://...signed-url...",
  "file_name": "Firma_angajati_2026-02-13.xlsx",
  "export_type": "employees",
  "expires_in": 3600
}
```

## Features

### Excel Formatting
- ✅ **Multiple sheets** per export type
- ✅ **Bold headers** cu background gri
- ✅ **Auto-width columns** (max 50 caractere)
- ✅ **Summary sheets** cu statistici
- ✅ **Date româneești** (DD.MM.YYYY)

### Storage
- ✅ Upload în `documents/exports/temp/{org_id}/`
- ✅ **Signed URL** valid 1 oră
- ✅ Filename sanitizat (fără diacritice, caractere speciale)

### Security
- ✅ **Auth:** Bearer token required
- ✅ **RLS:** Verificare membership per org
- ✅ **Privacy:** CNP hash masked (nu se exportă)

## Deployment

```bash
supabase functions deploy export-excel
```

## Environment Variables

Uses Supabase service role key (auto-configured):
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Example Usage

```typescript
const response = await fetch(
  'https://uhccxfyvhjeudkexcgiq.supabase.co/functions/v1/export-excel',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      org_id: 'abc-123',
      export_type: 'employees',
    }),
  }
)

const { download_url } = await response.json()
window.open(download_url, '_blank')
```

## Dependencies

- `https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs` - SheetJS for Excel generation
- `@supabase/supabase-js@2.39.3` - Supabase client

## Notes

- Fișierele se păstrează temporar în Storage (cleanup manual sau cron job periodic)
- Signed URL expiră după 1 oră (securitate)
- Suportă filtrare pe date, status, locație (optional)
- Toate textele sunt în română (conform cu platforma)
