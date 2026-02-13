# Alert Digest Edge Function

Supabase Edge Function care generează și trimite rapoarte zilnice cu alerte SSM/PSI noi.

## Descriere

Această funcție:
1. **Colectează** toate alertele noi create în ultimele 24 ore pentru o organizație
2. **Grupează** alertele după severitate (critical, expired, warning, info)
3. **Generează** un email HTML formatat cu toate alertele
4. **Trimite** emailul via Resend API către adresa de contact a organizației
5. **Logează** trimiterea în tabela `notification_log`

## Configurare

### 1. Variabile de Mediu

Configurați următoarele secrets în Supabase Dashboard:

```bash
# Supabase (deja configurate automat)
SUPABASE_URL=https://uhccxfyvhjeudkexcgiq.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Resend API
RESEND_API_KEY=<your-resend-api-key>
```

### 2. Deploy

```bash
# Deploy funcția
supabase functions deploy alert-digest

# Testare locală
supabase functions serve alert-digest
```

## Utilizare

### Manual Invoke

```bash
# Via cURL
curl -X POST 'https://uhccxfyvhjeudkexcgiq.supabase.co/functions/v1/alert-digest' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"org_id": "uuid-organizatie"}'
```

### Scheduled Daily (Cron)

Pentru rulare automată zilnică, configurați un cron job în Supabase sau folosiți un serviciu extern (Vercel Cron, GitHub Actions, etc.):

#### Opțiune 1: Supabase Cron (când va fi disponibil)

```sql
-- Rulează zilnic la 08:00 UTC
SELECT cron.schedule(
  'daily-alert-digest',
  '0 8 * * *',
  $$
  SELECT net.http_post(
    url := 'https://uhccxfyvhjeudkexcgiq.supabase.co/functions/v1/alert-digest',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
    ),
    body := jsonb_build_object('org_id', org.id)
  )
  FROM organizations org
  WHERE org.is_active = true;
  $$
);
```

#### Opțiune 2: GitHub Actions

Creați `.github/workflows/alert-digest.yml`:

```yaml
name: Daily Alert Digest

on:
  schedule:
    - cron: '0 8 * * *'  # 08:00 UTC daily
  workflow_dispatch:

jobs:
  send-digest:
    runs-on: ubuntu-latest
    steps:
      - name: Send Alert Digests
        run: |
          curl -X POST '${{ secrets.SUPABASE_URL }}/functions/v1/alert-digest' \
            -H 'Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}' \
            -H 'Content-Type: application/json' \
            -d '{"org_id": "${{ secrets.ORG_ID }}"}'
```

#### Opțiune 3: Vercel Cron API Route

Creați `app/api/cron/alert-digest/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  // Verifică authorization token pentru securitate
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createSupabaseServer()

  // Obține toate organizațiile active
  const { data: orgs } = await supabase
    .from('organizations')
    .select('id')
    .eq('is_active', true)

  const results = []

  // Trimite digest pentru fiecare organizație
  for (const org of orgs || []) {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/functions/v1/alert-digest`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ org_id: org.id }),
      }
    )

    const result = await response.json()
    results.push({ org_id: org.id, ...result })
  }

  return NextResponse.json({ success: true, results })
}
```

Apoi în `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/alert-digest",
    "schedule": "0 8 * * *"
  }]
}
```

## Request Format

```typescript
interface AlertDigestRequest {
  org_id: string;  // UUID organizației
}
```

## Response Format

### Success (cu alerte)

```json
{
  "success": true,
  "message": "Alert digest sent successfully",
  "org_id": "uuid-organizatie",
  "email": "contact@firma.ro",
  "alert_count": 15,
  "breakdown": {
    "critical": 3,
    "expired": 2,
    "warning": 7,
    "info": 3
  },
  "resend_id": "re_abc123xyz"
}
```

### Success (fără alerte)

```json
{
  "success": true,
  "message": "No new alerts to report",
  "alert_count": 0
}
```

### Error

```json
{
  "error": "Internal server error",
  "message": "Failed to fetch alerts: ..."
}
```

## Email Template

Emailul generat include:

- **Header**: Gradient albastru cu titlu și dată
- **Summary**: Număr total de alerte noi
- **Secțiuni per severitate** (în ordine):
  - 🔴 Critice
  - ⛔ Expirate
  - ⚠️ Atenționări
  - ℹ️ Informări
- **CTA**: Link către dashboard-ul de alerte
- **Footer**: Branding S-S-M.RO

Fiecare alertă afișează:
- Titlu
- Descriere (dacă există)
- Data expirării
- Zile până la expirare
- Tip entitate

## Monitorizare

Funcția logează în `notification_log`:

```sql
SELECT
  sent_at,
  recipient,
  status,
  metadata->>'alert_count' as alert_count,
  metadata->>'resend_id' as resend_id
FROM notification_log
WHERE notification_type = 'report_monthly'  -- sau alert_digest
ORDER BY sent_at DESC
LIMIT 20;
```

## Troubleshooting

### Emailul nu se trimite

1. Verificați că `RESEND_API_KEY` este configurat corect
2. Verificați că organizația are `contact_email` setat
3. Verificați logs-urile funcției: `supabase functions logs alert-digest`

### Nicio alertă în digest

- Funcția trimite email doar dacă există alerte noi în ultimele 24h
- Verificați view-ul `v_active_alerts` pentru organizația respectivă

### Rate limiting Resend

- Free tier Resend: 100 emails/zi
- Paid tier: 1000+ emails/zi
- Implementați batching dacă aveți multe organizații

## Next Steps

- [ ] Adăugați tip nou în `notification_type` enum: `alert_digest`
- [ ] Implementați preferințe per organizație (zilnic/săptămânal)
- [ ] Adăugați suport multi-limba (BG, HU, DE, PL)
- [ ] Testați cu organizații reale
- [ ] Monitorizați rate de deschidere via Resend webhooks
