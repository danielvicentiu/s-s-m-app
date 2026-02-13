# Export Excel Edge Function

Supabase Edge Function pentru generarea de export-uri Excel (.xlsx) cu date din platformă.

## Caracteristici

- 📊 **5 Tipuri de Export**: employees, trainings, medical, equipment, compliance
- 📑 **Multiple Sheet-uri**: Date principale + foi sumare/statistici
- 🎨 **Formatare Excel**: Headers bold, auto-width columns, formatare profesională
- 🔒 **Securitate**: RLS check via Supabase, URL signed temporar (1h)
- 📦 **Storage Temporar**: Upload în bucket `temp-exports`, auto-cleanup posibil
- 🔍 **Filtrare**: Support pentru filtre customizate per export type

## Deployment

```bash
# Deploy function
supabase functions deploy export-excel

# Set environment variables (dacă nu sunt deja setate)
supabase secrets set SUPABASE_URL=https://uhccxfyvhjeudkexcgiq.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

## Creare Storage Bucket

Înainte de prima utilizare, creează bucket-ul pentru export-uri temporare:

```sql
-- Run în Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('temp-exports', 'temp-exports', false);

-- RLS Policy: Allow authenticated users to upload/read their org exports
CREATE POLICY "Users can upload exports for their org"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'temp-exports' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can read exports for their org"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'temp-exports');

CREATE POLICY "Service role can manage all exports"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'temp-exports');
```

## API Usage

### Request

```typescript
POST https://uhccxfyvhjeudkexcgiq.supabase.co/functions/v1/export-excel
Content-Type: application/json
Authorization: Bearer <anon-key>

{
  "org_id": "uuid-of-organization",
  "export_type": "employees" | "trainings" | "medical" | "equipment" | "compliance",
  "filters": {
    // Optional filters specific to export type
  }
}
```

### Response

```json
{
  "success": true,
  "download_url": "https://...signed-url...",
  "file_name": "Angajati_2026-02-13.xlsx",
  "expires_at": "2026-02-13T15:00:00.000Z",
  "records_count": 42
}
```

## Export Types

### 1. Employees Export

```json
{
  "org_id": "uuid",
  "export_type": "employees",
  "filters": {
    "is_active": true,        // Optional: filter by active status
    "department": "IT"        // Optional: filter by department
  }
}
```

**Sheets generate:**
- `Angajați`: Date complete angajați
- `Sumar`: Statistici generale (total, activi, inactivi, departamente)

**Coloane:**
- ID, Nume Complet, Funcție, Cod COR, Departament
- Data Angajare, Tip Angajare, Activ, Email, Telefon
- Data Creare

---

### 2. Trainings Export

```json
{
  "org_id": "uuid",
  "export_type": "trainings",
  "filters": {
    "status": "completed",    // Optional: assigned, in_progress, completed, overdue
    "category": "ssm"         // Optional: ssm, psi, su, nis2, custom
  }
}
```

**Sheets generate:**
- `Instruiri`: Date complete instruiri
- `Statistici`: Total, completate, depășite, rată completare, scor mediu

**Coloane:**
- ID Atribuire, Nume Angajat, Cod Modul, Titlu Modul
- Categorie, Tip Instruire, Obligatoriu, Status
- Data Scadență, Data Completare, Data Sesiune, Instructor
- Scor Test, Durată, Următoarea Scadență

---

### 3. Medical Export

```json
{
  "org_id": "uuid",
  "export_type": "medical",
  "filters": {
    "result": "apt",                          // Optional: apt, apt_conditionat, inapt_temporar, inapt
    "examination_type": "periodic"            // Optional: periodic, angajare, reluare, etc.
  }
}
```

**Sheets generate:**
- `Medicina Muncii`: Date complete examene medicale
- `Status Sumar`: Breakdown pe status (valabil, atenție, urgent, expirat)

**Coloane:**
- ID, Nume Angajat, Funcție, Tip Examinare
- Data Examinare, Data Expirare, Zile Până Expirare, Status
- Rezultat, Restricții, Doctor, Clinică, Observații

---

### 4. Equipment Export

```json
{
  "org_id": "uuid",
  "export_type": "equipment",
  "filters": {
    "equipment_type": "stingator",    // Optional: specific equipment type
    "is_compliant": true              // Optional: filter by compliance
  }
}
```

**Sheets generate:**
- `Echipamente PSI`: Date complete echipamente
- `Pe Tipuri`: Breakdown pe tip echipament

**Coloane:**
- ID, Tip Echipament, Descriere, Locație, Serie
- Ultima Inspecție, Data Expirare, Zile Până Expirare, Status
- Următoarea Inspecție, Inspector, Conform, Observații

---

### 5. Compliance Export

```json
{
  "org_id": "uuid",
  "export_type": "compliance"
  // No filters - generates overview of all compliance areas
}
```

**Sheets generate:**
- `Conformitate Generală`: Status per categorie (Medicina Muncii, Echipamente PSI, Instruiri SSM)
- `Indicatori Generali`: Metrici aggregate overall

**Coloane:**
- Categorie, Total Elemente, Conforme, Expiră în 30 zile
- Expirate, Rată Conformitate, Status

---

## Client-Side Example

```typescript
import { createSupabaseBrowser } from '@/lib/supabase/client'

async function exportToExcel(orgId: string, exportType: string) {
  const supabase = createSupabaseBrowser()

  // Get current session for auth
  const { data: { session } } = await supabase.auth.getSession()

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/export-excel`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`
      },
      body: JSON.stringify({
        org_id: orgId,
        export_type: exportType,
        filters: {} // Optional
      })
    }
  )

  const result = await response.json()

  if (result.success) {
    // Trigger download
    window.open(result.download_url, '_blank')

    console.log(`Downloaded: ${result.file_name}`)
    console.log(`Records: ${result.records_count}`)
    console.log(`Expires: ${result.expires_at}`)
  } else {
    console.error('Export failed:', result.error)
  }
}

// Usage
exportToExcel('org-uuid', 'employees')
```

## Status Calculation Logic

**Expiry Status:**
- `EXPIRAT`: Data expirare în trecut
- `URGENT`: Expiră în ≤ 7 zile
- `ATENȚIE`: Expiră în ≤ 30 zile
- `VALABIL`: Expiră în > 30 zile

**Compliance Status:**
- `CRITIC`: Există elemente expirate
- `ATENȚIE`: Există elemente care expiră în 30 zile
- `CONFORM`: Toate elementele sunt valabile

## Excel Features

### Headers
- **Bold font**
- Gray background (#E5E7EB)
- Center alignment

### Columns
- Auto-fit width based on content
- Max width: 50 characters (prevents excessively wide columns)
- Min width: 10 characters

### Data Formatting
- Dates: Romanian format (DD.MM.YYYY)
- Booleans: "Da" / "Nu"
- Percentages: "XX.X%"
- UUIDs: Shortened to first 8 characters for readability

## Performance

- Small datasets (< 100 records): < 1 second
- Medium datasets (100-1000 records): 1-3 seconds
- Large datasets (1000+ records): 3-10 seconds

## Storage Cleanup

File-urile rămân în storage timp de 1h (signed URL expiry). Pentru auto-cleanup, se poate configura o politică Supabase Storage sau un cron job separat:

```sql
-- Optional: Create cleanup function
CREATE OR REPLACE FUNCTION cleanup_old_exports()
RETURNS void AS $$
BEGIN
  DELETE FROM storage.objects
  WHERE bucket_id = 'temp-exports'
  AND created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule via pg_cron (if available)
SELECT cron.schedule('cleanup-exports', '0 2 * * *', 'SELECT cleanup_old_exports()');
```

## Error Handling

**Common Errors:**

1. **Missing org_id**: HTTP 400
2. **Invalid export_type**: HTTP 400
3. **Database fetch error**: HTTP 500
4. **Storage upload error**: HTTP 500
5. **URL generation error**: HTTP 500

Toate erorile returnează:
```json
{
  "success": false,
  "error": "Error message description"
}
```

## Testing

```bash
# Test local cu Supabase CLI
supabase functions serve export-excel

# Test request
curl -X POST http://localhost:54321/functions/v1/export-excel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <anon-key>" \
  -d '{
    "org_id": "test-uuid",
    "export_type": "employees"
  }'
```

## Future Enhancements

- [ ] Add PDF export option
- [ ] Add CSV export option
- [ ] Email export directly to user
- [ ] Schedule recurring exports
- [ ] Add custom column selection
- [ ] Add data aggregation options
- [ ] Multi-language support for column headers
- [ ] Add charts/graphs to Excel sheets
- [ ] Batch export (multiple orgs at once)
- [ ] Export history tracking

## Dependencies

- **Deno std**: HTTP server
- **@supabase/supabase-js**: Database & Storage
- **SheetJS (xlsx)**: Excel file generation

## License

Part of s-s-m.ro platform — Internal use only
