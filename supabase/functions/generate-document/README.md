# Generate Document Edge Function

Supabase Edge Function pentru generarea automată de documente PDF din template-uri HTML pentru platforma s-s-m.ro.

## Descriere

Această funcție generează documente SSM/PSI în format PDF pornind de la template-uri HTML predefinite. Funcția:
1. Primește tip template și ID-uri de organizație/angajați
2. Extrage date din baza de date Supabase
3. Populează template-ul HTML cu datele extrase
4. Convertește HTML în PDF
5. Uploadează PDF-ul în Supabase Storage
6. Returnează URL-ul public al documentului generat

## Template-uri Disponibile

### 1. `fisa_instruire` - Fișă de Instruire SSM
Document pentru evidențierea instruirii periodice SSM, conține:
- Date organizație (nume, CUI, adresă)
- Informații instruire (dată, tip, instructor, durată)
- Tabel participanți cu semnături
- Footer cu bază legală

**Use case:** După o sesiune de instruire SSM, se generează fișa cu toți participanții.

### 2. `plan_prevenire` - Plan de Prevenire și Protecție
Document comprehensiv pentru planul anual SSM, conține:
- Date de identificare organizație
- Obiective plan prevenire
- Structură organizatorică SSM
- Lista angajați cu funcții și coduri COR
- Măsuri de prevenire generale și specifice
- Program instruire
- Proceduri urgență
- Plan revizuire

**Use case:** Elaborarea planului anual de prevenire pentru organizație.

### 3. `decizie_cssm` - Decizie Constituire CSSM
Document legal pentru constituirea Comitetului SSM, conține:
- Header organizație formal
- Decizie cu număr și dată
- Considerente legale (Legea 319/2006)
- Articole cu atribuții CSSM
- Tabel membri comitet cu funcții
- Zone semnături formale

**Use case:** Constituirea CSSM pentru organizații cu peste 50 salariați.

## Deployment

```bash
# Deploy funcția
supabase functions deploy generate-document

# Set environment variables (dacă nu sunt setate)
supabase secrets set SUPABASE_URL=your_url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_key
```

## API Usage

### Endpoint
```
POST https://uhccxfyvhjeudkexcgiq.supabase.co/functions/v1/generate-document
```

### Headers
```
Authorization: Bearer YOUR_ANON_KEY
Content-Type: application/json
```

### Request Body

#### Exemplu 1: Fișă Instruire
```json
{
  "template_type": "fisa_instruire",
  "org_id": "uuid-organizatie",
  "employee_ids": ["uuid-ang-1", "uuid-ang-2", "uuid-ang-3"],
  "additional_params": {
    "instructor_name": "Ing. Ion Popescu",
    "duration_hours": 2,
    "location": "Sala de conferințe, etaj 1",
    "training_date": "2026-02-15"
  }
}
```

#### Exemplu 2: Plan Prevenire
```json
{
  "template_type": "plan_prevenire",
  "org_id": "uuid-organizatie",
  "employee_ids": [],
  "additional_params": {
    "ssm_responsible": "Ing. Maria Ionescu",
    "specific_measures": "Risc ergonomic: pauzele obligatorii la 2 ore. Risc chimic: ventilație forțată.",
    "evacuation_procedure": "Ieșiri marcate cu verde, punct întâlnire în parcare",
    "first_aid": "Trusă nivel 2, 3 persoane instruite prim ajutor",
    "fire_procedure": "10 stingătoare verificate ISCIR, hidrant interior funcțional"
  }
}
```

#### Exemplu 3: Decizie CSSM
```json
{
  "template_type": "decizie_cssm",
  "org_id": "uuid-organizatie",
  "additional_params": {
    "cssm_members": [
      {
        "name": "Popescu Ion",
        "job_title": "Director General",
        "cssm_role": "Președinte"
      },
      {
        "name": "Ionescu Maria",
        "job_title": "HR Manager",
        "cssm_role": "Secretar"
      },
      {
        "name": "Georgescu Andrei",
        "job_title": "Reprezentant Angajați",
        "cssm_role": "Membru"
      }
    ]
  }
}
```

### Response

#### Success (200)
```json
{
  "success": true,
  "document_id": "uuid-document",
  "url": "https://storage.supabase.co/documents/org-id/fisa_instruire_timestamp.pdf",
  "file_name": "fisa_instruire_org-id_2026-02-13.pdf",
  "template_type": "fisa_instruire",
  "organization_id": "uuid-org",
  "employee_count": 15,
  "file_size_bytes": 45678
}
```

#### Error (400)
```json
{
  "error": "Invalid template_type",
  "allowed": ["fisa_instruire", "plan_prevenire", "decizie_cssm"]
}
```

#### Error (404)
```json
{
  "error": "Organization not found"
}
```

#### Error (500)
```json
{
  "error": "Internal server error",
  "message": "Storage upload failed: ..."
}
```

## Database Tables Used

### Input Tables
- `organizations` - date organizație (nume, CUI, adresă)
- `employees` - date angajați (nume, funcție, departament, COR)

### Output Tables
- `generated_documents` - metadata documente generate
- Supabase Storage bucket `documents` - fișiere PDF

## Storage Structure

```
documents/
└── {org_id}/
    ├── fisa_instruire_{org_id}_{timestamp}.pdf
    ├── plan_prevenire_{org_id}_{timestamp}.pdf
    └── decizie_cssm_{org_id}_{timestamp}.pdf
```

## Notes

### PDF Generation
Funcția actuală returnează HTML convertit direct în bytes. Pentru producție, se recomandă integrarea cu un serviciu dedicat de generare PDF:
- **Browserless.io** - Headless Chrome as a service
- **Gotenberg** - Docker-based PDF generation
- **PDFShift** - API pentru HTML to PDF
- **Puppeteer** în container separat

### RLS (Row Level Security)
Funcția folosește `SUPABASE_SERVICE_ROLE_KEY` pentru a bypassa RLS. Asigurați-vă că validați permisiunile la nivel de aplicație înainte de a apela funcția.

### File Size Limits
Supabase Storage are limite de upload:
- Free tier: 1GB total
- Pro tier: 100GB total
- File size max: 50MB per file

### Legal Compliance
Template-urile sunt conforme cu:
- Legea 319/2006 privind securitatea și sănătatea în muncă
- HG 1425/2006 - Norme metodologice
- Ordin 1091/2016 privind registrul general de evidență

## Testing

```bash
# Test local cu supabase CLI
supabase functions serve generate-document

# Test API call
curl -X POST http://localhost:54321/functions/v1/generate-document \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "template_type": "fisa_instruire",
    "org_id": "test-org-id",
    "employee_ids": ["emp-1", "emp-2"]
  }'
```

## Maintenance

### Actualizare Template-uri
Template-urile HTML sunt definite în `DOCUMENT_TEMPLATES` object. Pentru actualizări:
1. Modifică template-ul dorit în cod
2. Testează local
3. Deploy cu `supabase functions deploy generate-document`

### Monitorizare
Verifică logs pentru erori:
```bash
supabase functions logs generate-document
```

## Future Enhancements

- [ ] Integrare serviciu real PDF (Gotenberg/Browserless)
- [ ] Support pentru limba multiplă (RO, EN, BG, HU, DE)
- [ ] Template-uri custom uploadate de utilizatori
- [ ] Watermark și semnatură digitală
- [ ] Batch generation pentru multiple organizații
- [ ] Email automat după generare
- [ ] Versionare documente (V1, V2, etc.)
