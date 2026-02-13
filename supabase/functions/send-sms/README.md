# Send SMS Edge Function

Supabase Edge Function pentru trimiterea de SMS-uri prin Twilio API cu tracking cost per organizație.

## Caracteristici

- ✅ Trimitere SMS prin Twilio API
- ✅ Detecție automată country code (20+ țări suportate)
- ✅ Truncare automată la 160 caractere (limită SMS)
- ✅ Rate limiting: 100 SMS/oră per număr telefon
- ✅ Cost tracking per organizație (USD)
- ✅ Log complet pentru fiecare SMS trimis
- ✅ Suport multilingv (ro, en, bg, hu, de)
- ✅ Validare format telefon internațional

## Cerințe

### Environment Variables (Supabase Secrets)

```bash
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_SMS_FROM=+1234567890  # Your Twilio phone number

# Supabase (auto-set)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Database Migration

Rulează migrarea pentru a crea tabelele necesare:

```bash
# Apply migration
supabase db push

# Or manually run:
psql -h db.uhccxfyvhjeudkexcgiq.supabase.co -U postgres -d postgres -f supabase/migrations/20260213_sms_delivery_log.sql
```

## Deploy

```bash
# Deploy function
supabase functions deploy send-sms

# Set secrets
supabase secrets set TWILIO_ACCOUNT_SID=your_account_sid
supabase secrets set TWILIO_AUTH_TOKEN=your_auth_token
supabase secrets set TWILIO_SMS_FROM=+1234567890
```

## Usage

### Request Format

```typescript
POST https://uhccxfyvhjeudkexcgiq.supabase.co/functions/v1/send-sms

Headers:
  Authorization: Bearer YOUR_ANON_KEY
  Content-Type: application/json

Body:
{
  "phone": "+40712345678",           // Required: International format
  "message": "Mesajul tău aici",     // Required: Max 160 chars (auto-truncate)
  "locale": "ro",                    // Optional: ro, en, bg, hu, de (default: ro)
  "organization_id": "uuid"          // Optional: For cost tracking
}
```

### Response Format

#### Success (200)

```json
{
  "success": true,
  "messageId": "SM1234567890abcdef",
  "status": "queued",
  "phone": "+40712345678",
  "message": "Mesajul tău aici",
  "message_length": 17,
  "truncated": false,
  "country": {
    "code": "RO",
    "name": "Romania"
  },
  "cost_usd": 0.0155,
  "locale": "ro",
  "rate_limit": {
    "remaining": 99,
    "reset_at": "2026-02-13T16:00:00.000Z"
  }
}
```

#### Error Responses

**400 Bad Request** - Invalid input
```json
{
  "error": "Invalid phone format. Use international format: +40712345678"
}
```

**429 Too Many Requests** - Rate limit exceeded
```json
{
  "error": "Rate limit exceeded",
  "message": "Maximum 100 SMS per hour per phone number",
  "reset_at": "2026-02-13T16:00:00.000Z"
}
```

**500 Internal Server Error** - Server error
```json
{
  "error": "Internal server error",
  "message": "Twilio API error: ..."
}
```

## Cost Tracking

### Supported Countries & Costs (USD per SMS)

| Country | Code | Cost/SMS | Phone Prefix |
|---------|------|----------|--------------|
| Romania | RO | $0.0155 | +40 |
| Bulgaria | BG | $0.0191 | +359 |
| Hungary | HU | $0.0201 | +36 |
| Germany | DE | $0.0747 | +49 |
| Austria | AT | $0.0654 | +43 |
| Czech Republic | CZ | $0.0234 | +420 |
| Slovakia | SK | $0.0312 | +421 |
| Poland | PL | $0.0187 | +48 |
| United States | US | $0.0079 | +1 |
| United Kingdom | GB | $0.0447 | +44 |
| France | FR | $0.0730 | +33 |
| Italy | IT | $0.0734 | +39 |
| Spain | ES | $0.0797 | +34 |
| Portugal | PT | $0.0512 | +351 |
| Belgium | BE | $0.0701 | +32 |
| Netherlands | NL | $0.0981 | +31 |
| Switzerland | CH | $0.0451 | +41 |
| Sweden | SE | $0.0512 | +46 |
| Norway | NO | $0.0631 | +47 |
| Denmark | DK | $0.0423 | +45 |
| Finland | FI | $0.0834 | +358 |

### Query Cost Tracking

```sql
-- Monthly costs per organization
SELECT
  o.name as organization_name,
  sct.period_start,
  sct.period_end,
  sct.total_sms_sent,
  sct.total_cost_usd
FROM sms_cost_tracking sct
JOIN organizations o ON o.id = sct.organization_id
WHERE sct.period_start >= date_trunc('month', now())
ORDER BY sct.total_cost_usd DESC;

-- SMS delivery logs with costs
SELECT
  sdl.sent_at,
  sdl.phone,
  sdl.country_code,
  sdl.status,
  sdl.cost_usd,
  sdl.message
FROM sms_delivery_log sdl
WHERE sdl.organization_id = 'your-org-id'
ORDER BY sdl.sent_at DESC
LIMIT 100;

-- Failed SMS (for debugging)
SELECT
  sdl.sent_at,
  sdl.phone,
  sdl.status,
  sdl.error_message
FROM sms_delivery_log sdl
WHERE sdl.status = 'failed'
ORDER BY sdl.sent_at DESC;
```

## Rate Limiting

- **Limit**: 100 SMS per hour per phone number
- **Window**: Rolling 1-hour window
- **Headers**:
  - `X-RateLimit-Limit: 100`
  - `X-RateLimit-Remaining: 99`
  - `X-RateLimit-Reset: 1707840000000` (timestamp)

## Example Usage (TypeScript)

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://uhccxfyvhjeudkexcgiq.supabase.co',
  'your-anon-key'
);

async function sendSMS(phone: string, message: string, organizationId?: string) {
  const { data, error } = await supabase.functions.invoke('send-sms', {
    body: {
      phone,
      message,
      locale: 'ro',
      organization_id: organizationId,
    },
  });

  if (error) {
    console.error('Error sending SMS:', error);
    return null;
  }

  console.log('SMS sent:', data.messageId);
  console.log('Cost:', data.cost_usd, 'USD');
  console.log('Rate limit remaining:', data.rate_limit.remaining);

  return data;
}

// Example: Send training reminder
await sendSMS(
  '+40712345678',
  'Reminder: Aveți instruire SSM programată mâine la ora 10:00.',
  'org-uuid-here'
);
```

## Testing

```bash
# Test locally
supabase functions serve send-sms

# Test with curl
curl -i --location --request POST 'http://localhost:54321/functions/v1/send-sms' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "phone": "+40712345678",
    "message": "Test SMS from Supabase Edge Function",
    "locale": "ro",
    "organization_id": "your-org-id"
  }'
```

## Security

- ✅ RLS enabled on both tables (`sms_delivery_log`, `sms_cost_tracking`)
- ✅ Service role required for inserting logs
- ✅ Users can only view logs for their organization
- ✅ Consultants can view all logs
- ✅ Phone validation prevents invalid numbers
- ✅ Rate limiting prevents abuse
- ✅ Automatic cost tracking per organization

## Troubleshooting

### Error: "Missing Twilio configuration"
- Check that all Twilio secrets are set: `supabase secrets list`
- Set missing secrets: `supabase secrets set TWILIO_ACCOUNT_SID=...`

### Error: "Invalid phone format"
- Phone must be in international format: `+<country_code><number>`
- Example: `+40712345678` (Romania), `+359888123456` (Bulgaria)

### Error: "Rate limit exceeded"
- Wait until reset time (1 hour from first request)
- Check rate limit headers in response
- Implement exponential backoff in your client

### SMS not delivered
- Check `sms_delivery_log` table for error messages
- Verify phone number is valid and can receive SMS
- Check Twilio console for delivery status
- Ensure Twilio account has sufficient balance

## Related Functions

- `send-whatsapp` - Send WhatsApp messages via Twilio
- `ai-obligation-extractor` - Extract SSM obligations from documents

## Changelog

### 2026-02-13 - Initial Release
- Created send-sms Edge Function
- Added country code detection (20+ countries)
- Implemented rate limiting (100 SMS/hour)
- Added cost tracking per organization
- Created database tables for logging and cost tracking
- Auto-truncate messages to 160 characters
- Multi-language support (ro, en, bg, hu, de)
