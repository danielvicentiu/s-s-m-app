# Edge Function: send-sms

Trimite SMS via Twilio cu country code detection, rate limiting, și cost tracking.

## Features

- ✅ Trimitere SMS via Twilio API
- ✅ Country code detection automată (RO, BG, HU, DE, US, UK)
- ✅ Normalizare număr de telefon la format internațional
- ✅ Validare lungime mesaj (max 160 caractere)
- ✅ Rate limiting (100 SMS/oră per organizație)
- ✅ Cost tracking (€0.05/SMS estimat)
- ✅ Logging în tabela `sms_delivery_log`
- ✅ CORS support
- ✅ Metadata personalizabil

## Environment Variables

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+40123456789  # Număr Twilio expeditor
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Database Setup

Tabelă necesară: `sms_delivery_log`

```sql
CREATE TABLE IF NOT EXISTS sms_delivery_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  message_id TEXT, -- Twilio Message SID
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed')),
  error_message TEXT,
  cost_eur DECIMAL(10, 4) DEFAULT 0,
  country_code TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pentru rate limiting
CREATE INDEX idx_sms_delivery_org_created
ON sms_delivery_log(organization_id, created_at DESC);

-- Index pentru rapoarte
CREATE INDEX idx_sms_delivery_status
ON sms_delivery_log(status, created_at DESC);
```

## Request Format

```typescript
POST https://your-project.supabase.co/functions/v1/send-sms

Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_ANON_KEY

Body:
{
  "phone": "+40712345678",        // Obligatoriu
  "message": "Mesaj test SMS",    // Obligatoriu, max 160 chars
  "locale": "ro",                 // Opțional (ro/en/bg/hu/de)
  "organizationId": "uuid",       // Opțional (pentru rate limiting)
  "metadata": {                   // Opțional
    "userId": "uuid",
    "type": "alert",
    "alertId": "uuid"
  }
}
```

## Response Format

### Success (200)

```json
{
  "success": true,
  "messageId": "SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "details": {
    "phone": "+40712345678",
    "messageLength": 15,
    "estimatedCost": 0.05,
    "countryCode": "RO"
  }
}
```

### Error (400/429/500)

```json
{
  "success": false,
  "error": "Message too long. Maximum 160 characters allowed.",
  "details": {
    "messageLength": 180,
    "maxLength": 160
  }
}
```

## Country Code Detection

Funcția detectează automat țara bazat pe prefix:

| Prefix | Country Code | Țară |
|--------|-------------|------|
| +40, 0040 | RO | România |
| +359, 00359 | BG | Bulgaria |
| +36, 0036 | HU | Ungaria |
| +49, 0049 | DE | Germania |
| +1 | US | SUA |
| +44 | UK | Regatul Unit |

## Phone Number Normalization

Exemple de normalizare:

- `0712345678` → `+40712345678` (RO)
- `+40712345678` → `+40712345678` (deja normalizat)
- `0040712345678` → `+40712345678` (00 → +)
- `712345678` → `+40712345678` (RO detectat)

## Rate Limiting

- **Limită:** 100 SMS/oră per organizație
- **Verificare:** bazată pe `sms_delivery_log.created_at`
- **Răspuns:** HTTP 429 dacă limita e depășită
- **Reset:** automat după 1 oră

## Cost Tracking

- **Cost estimat:** €0.05/SMS
- **Tracking:** în coloana `cost_eur`
- **Raportare:** agregare după `organization_id` și `created_at`

## Usage Examples

### JavaScript/TypeScript

```typescript
const response = await fetch(
  'https://your-project.supabase.co/functions/v1/send-sms',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({
      phone: '+40712345678',
      message: 'Alertă SSM: Inspectie programata pentru maine.',
      organizationId: 'org-uuid',
      metadata: {
        alertType: 'inspection',
        alertId: 'alert-uuid'
      }
    })
  }
)

const result = await response.json()
console.log('SMS sent:', result.messageId)
```

### cURL

```bash
curl -X POST \
  https://your-project.supabase.co/functions/v1/send-sms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "phone": "+40712345678",
    "message": "Test SMS",
    "organizationId": "org-uuid"
  }'
```

## Error Handling

| Error | Status | Descriere |
|-------|--------|-----------|
| Missing fields | 400 | `phone` sau `message` lipsesc |
| Message too long | 400 | Mesaj > 160 caractere |
| Rate limit exceeded | 429 | Depășire limită 100 SMS/oră |
| Twilio API error | 500 | Eroare la trimitere SMS |
| Internal error | 500 | Eroare neprevăzută |

## Monitoring

### Query pentru rapoarte

```sql
-- SMS trimise azi per organizație
SELECT
  organization_id,
  COUNT(*) as total_sms,
  SUM(cost_eur) as total_cost,
  COUNT(*) FILTER (WHERE status = 'sent') as successful,
  COUNT(*) FILTER (WHERE status = 'failed') as failed
FROM sms_delivery_log
WHERE created_at >= CURRENT_DATE
GROUP BY organization_id;

-- SMS eșuate cu erori
SELECT
  phone,
  error_message,
  created_at
FROM sms_delivery_log
WHERE status = 'failed'
ORDER BY created_at DESC
LIMIT 100;

-- Cost total lunar
SELECT
  DATE_TRUNC('month', created_at) as month,
  SUM(cost_eur) as total_cost,
  COUNT(*) as total_sms
FROM sms_delivery_log
WHERE status = 'sent'
GROUP BY month
ORDER BY month DESC;
```

## Testing

```bash
# Deploy funcția
supabase functions deploy send-sms

# Test local
supabase functions serve send-sms

# Test cu curl
curl -X POST http://localhost:54321/functions/v1/send-sms \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+40712345678",
    "message": "Test SMS"
  }'
```

## Security Notes

- ✅ Service role key folosit doar server-side
- ✅ Rate limiting per organizație
- ✅ Validare input strictă
- ✅ Logging complet pentru audit
- ✅ CORS configurat corect
- ⚠️ Nu expune Twilio credentials în client
- ⚠️ Verifică permission în RLS pentru `sms_delivery_log`

## Twilio Setup

1. Creează cont Twilio: https://www.twilio.com/
2. Obține credențiale: Account SID + Auth Token
3. Cumpără număr de telefon pentru expeditor
4. Configurează environment variables în Supabase Dashboard

## Related Functions

- `send-whatsapp` — trimitere mesaje WhatsApp
- `send-email-batch` — trimitere email batch

## Version

v1.0.0 — 2026-02-14
