# Send WhatsApp Edge Function

Supabase Edge Function for sending WhatsApp messages via Twilio API with template matching, rate limiting, and delivery logging.

## Features

- ✅ Twilio WhatsApp API integration
- ✅ Pre-approved message templates (5 templates x 5 languages)
- ✅ Rate limiting: 100 messages/hour per phone number
- ✅ Delivery status logging to database
- ✅ Multi-language support (RO, EN, BG, HU, DE)
- ✅ Phone number validation (international format)
- ✅ CORS enabled

## Environment Variables

Set these in Supabase Dashboard → Edge Functions → Configuration:

```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_FROM=+14155238886
SUPABASE_URL=https://uhccxfyvhjeudkexcgiq.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Deployment

```bash
# Deploy function
supabase functions deploy send-whatsapp

# Test locally
supabase functions serve send-whatsapp
```

## API Request

**Endpoint:** `https://uhccxfyvhjeudkexcgiq.supabase.co/functions/v1/send-whatsapp`

**Method:** `POST`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_ANON_KEY",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "phone": "+40712345678",
  "template_name": "training_reminder",
  "template_params": {
    "date": "15.02.2026",
    "time": "10:00",
    "location": "Sala de Conferință A"
  },
  "locale": "ro"
}
```

## Available Templates

### 1. `training_reminder`
Parameters: `date`, `time`, `location`

### 2. `medical_expiry`
Parameters: `expiry_date`

### 3. `equipment_inspection`
Parameters: `equipment_name`, `deadline`

### 4. `document_expiry`
Parameters: `document_name`, `expiry_date`

### 5. `alert_notification`
Parameters: `alert_message`, `priority`

## Response

**Success (200):**
```json
{
  "success": true,
  "messageId": "SM1234567890abcdef",
  "status": "queued",
  "phone": "+40712345678",
  "template_name": "training_reminder",
  "locale": "ro",
  "rate_limit": {
    "remaining": 99,
    "reset_at": "2026-02-13T16:30:00.000Z"
  }
}
```

**Rate Limited (429):**
```json
{
  "error": "Rate limit exceeded",
  "message": "Maximum 100 messages per hour",
  "reset_at": "2026-02-13T16:30:00.000Z"
}
```

**Error (400/404/500):**
```json
{
  "error": "Template not found",
  "available_templates": ["training_reminder", "medical_expiry", ...]
}
```

## Rate Limiting

- **Limit:** 100 messages per hour per phone number
- **Window:** Rolling 1-hour window
- **Headers:** `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Database Logging

All messages are logged to `whatsapp_delivery_log` table:

```sql
CREATE TABLE whatsapp_delivery_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  template_name text NOT NULL,
  message_id text NOT NULL,
  status text NOT NULL,
  error_message text,
  sent_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
```

## Usage Example (TypeScript)

```typescript
const response = await fetch(
  'https://uhccxfyvhjeudkexcgiq.supabase.co/functions/v1/send-whatsapp',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabase.auth.session()?.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone: '+40712345678',
      template_name: 'training_reminder',
      template_params: {
        date: '15.02.2026',
        time: '10:00',
        location: 'Sala de Conferință A',
      },
      locale: 'ro',
    }),
  }
);

const data = await response.json();
console.log('Message ID:', data.messageId);
```

## Twilio Setup

1. Create Twilio account: https://www.twilio.com/console
2. Request WhatsApp sender approval
3. Get credentials: Account SID, Auth Token
4. Get WhatsApp-enabled phone number (e.g., +14155238886)
5. Set up message templates in Twilio Console

## Notes

- Phone numbers must be in international format: `+<country_code><number>`
- All templates are pre-approved and localized
- Rate limiter uses in-memory storage (resets on function restart)
- Delivery logs are stored permanently in Supabase
- CORS is enabled for all origins (adjust in production)
