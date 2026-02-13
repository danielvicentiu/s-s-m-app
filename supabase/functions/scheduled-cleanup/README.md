# Scheduled Cleanup Edge Function

## Descriere

Edge Function pentru curățarea automată și programată a datelor vechi și fișierelor orfane din platforma s-s-m.ro.

Funcția rulează **săptămânal** (recomandat: Duminica la 2 AM) și efectuează următoarele operații de curățare:

## Operații de Curățare

### 1. **Ștergere Records Soft-Deleted** (90+ zile)
- Șterge permanent înregistrările cu `deleted_at` mai vechi de 90 zile
- Tabele verificate:
  - `organizations`
  - `employees`
  - `medical_examinations`
  - `safety_equipment`
  - `trainings`
  - `documents`
  - `generated_documents`
  - `alerts`
  - `fraud_alerts`
  - `penalties`
  - `equipment_types`
  - `alert_categories`
  - `obligation_types`

### 2. **Ștergere Fișiere Orfane din Storage**
- Identifică fișierele din Storage care nu mai sunt referite în baza de date
- Verifică referințe în:
  - `generated_documents.storage_path`
  - `profiles.avatar_url`
- Șterge fișierele nereferate pentru a elibera spațiu

### 3. **Ștergere Audit Logs** (1+ an)
- Șterge înregistrările din `audit_log` mai vechi de 1 an (365 zile)
- Păstrează doar istoricul recent pentru debugging și compliance

### 4. **Ștergere Sesiuni Expirate** (30+ zile)
- Șterge sesiunile expirate mai vechi de 30 zile
- Necesită RPC function `cleanup_expired_sessions` (opțional)

### 5. **Ștergere Delivery Logs** (6+ luni)
- Șterge logurile de email/WhatsApp mai vechi de 6 luni (180 zile)
- Tabele:
  - `email_delivery_log`
  - `whatsapp_delivery_log`

## Configurare

### Variabile de Mediu

```bash
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CLEANUP_SECRET=optional_secret_token  # Pentru securitate suplimentară
```

### Deploy

```bash
# Deploy Edge Function
supabase functions deploy scheduled-cleanup

# Setează variabilele de mediu
supabase secrets set SUPABASE_URL="your_supabase_url"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
supabase secrets set CLEANUP_SECRET="your_secret_token"
```

### Configurare Cron Job (Supabase)

În Supabase Dashboard → Edge Functions → Cron Jobs:

```sql
-- Rulează în fiecare Duminică la 2:00 AM UTC
SELECT cron.schedule(
  'weekly-cleanup',
  '0 2 * * 0',  -- Cron expression: Sunday at 2 AM
  $$
  SELECT
    net.http_post(
      url := 'https://uhccxfyvhjeudkexcgiq.supabase.co/functions/v1/scheduled-cleanup',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer YOUR_CLEANUP_SECRET'
      ),
      body := '{}'::jsonb
    ) as request_id;
  $$
);
```

**Alternative Cron Expressions:**
- Daily at 3 AM: `0 3 * * *`
- Bi-weekly (1st and 15th): `0 2 1,15 * *`
- Monthly (1st at 2 AM): `0 2 1 * *`

### Invocare Manuală

```bash
# Testare locală (fără auth)
curl -X POST http://localhost:54321/functions/v1/scheduled-cleanup \
  -H "Content-Type: application/json" \
  -d '{}'

# Invocare production (cu auth)
curl -X POST https://uhccxfyvhjeudkexcgiq.supabase.co/functions/v1/scheduled-cleanup \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLEANUP_SECRET" \
  -d '{}'
```

## Răspuns

### Success Response

```json
{
  "success": true,
  "summary": {
    "timestamp": "2026-02-13T02:00:00.000Z",
    "totalRecordsDeleted": 1247,
    "totalErrors": 0,
    "executionTimeMs": 3450,
    "results": [
      {
        "task": "Soft-deleted records cleanup",
        "success": true,
        "recordsDeleted": 450,
        "details": "organizations: 12 records, employees: 234 records, medical_examinations: 204 records"
      },
      {
        "task": "Orphaned files cleanup",
        "success": true,
        "recordsDeleted": 23,
        "details": "Deleted files: avatars/old_file_1.jpg, documents/orphan_doc.pdf, ..."
      },
      {
        "task": "Audit logs cleanup",
        "success": true,
        "recordsDeleted": 1500,
        "details": "Deleted audit logs older than 365 days"
      },
      {
        "task": "Expired sessions cleanup",
        "success": true,
        "recordsDeleted": 0,
        "details": "Session cleanup RPC not configured (optional)"
      },
      {
        "task": "Delivery logs cleanup",
        "success": true,
        "recordsDeleted": 274,
        "details": "email_delivery_log: 180 records, whatsapp_delivery_log: 94 records"
      }
    ]
  },
  "message": "Cleanup completed: 1247 records deleted in 3450ms"
}
```

### Error Response

```json
{
  "error": "Cleanup failed",
  "message": "Error details here",
  "executionTimeMs": 120
}
```

## Logging

Dacă tabela `cleanup_log` există, funcția va înregistra automat rezultatele fiecărei execuții:

```sql
-- Tabel opțional pentru logging
CREATE TABLE cleanup_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_timestamp timestamptz NOT NULL,
  total_records_deleted int NOT NULL,
  total_errors int NOT NULL,
  results jsonb NOT NULL,
  execution_time_ms int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

## Perioada de Retenție (Configurabil)

Valorile implicite sunt definite în constante:

```typescript
const SOFT_DELETE_RETENTION_DAYS = 90;        // 3 luni
const AUDIT_LOG_RETENTION_DAYS = 365;         // 1 an
const SESSION_RETENTION_DAYS = 30;            // 1 lună
const DELIVERY_LOG_RETENTION_DAYS = 180;      // 6 luni
```

Pentru a modifica perioadele de retenție, editează constantele în `index.ts` și re-deploy funcția.

## Securitate

- **Service Role Key**: Funcția folosește `SUPABASE_SERVICE_ROLE_KEY` pentru acces complet
- **Authorization Header**: Opțional, verifică `CLEANUP_SECRET` pentru securitate suplimentară
- **RLS Bypass**: Funcția operează cu privilegii service_role pentru a șterge date din orice organizație

⚠️ **IMPORTANT**: Nu expune public această funcție fără autentificare!

## Monitorizare

Verifică execuția funcției în:
1. **Supabase Logs** → Edge Functions → scheduled-cleanup
2. **Tabel `cleanup_log`** (dacă este creat)
3. **Alertele Cron** → Verifică dacă cron job-ul rulează

## Troubleshooting

### Funcția nu șterge nicio înregistrare
- Verifică dacă tabelele au coloana `deleted_at`
- Verifică perioada de retenție (poate fi prea lungă)
- Verifică RLS policies pe tabele

### Erori de permisiuni
- Verifică că `SUPABASE_SERVICE_ROLE_KEY` este corect setat
- Verifică că Edge Function are access la Storage API

### Fișiere orfane nu sunt șterse
- Verifică că Storage buckets sunt configurate corect
- Verifică că Storage RLS permite ștergerea cu service_role

### Sesiuni expirate nu sunt șterse
- Creează RPC function `cleanup_expired_sessions` (opțional)
- Sau ignoră această operație (este marcată ca opțională)

## Exemple de Utilizare

### Test Dry-Run (fără ștergere efectivă)

Pentru a testa funcția fără a șterge date, modifică temporar funcțiile de cleanup să returneze doar count-uri.

### Rulare Ad-Hoc

Pentru curățare urgentă sau testare:

```bash
# Invoke direct din Supabase Dashboard
# Edge Functions → scheduled-cleanup → Invoke
```

## Changelog

- **2026-02-13**: Versiune inițială cu 5 operații de cleanup

## Autor

Generat de Claude pentru platforma s-s-m.ro
