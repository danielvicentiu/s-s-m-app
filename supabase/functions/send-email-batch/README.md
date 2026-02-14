# send-email-batch Edge Function

Supabase Edge Function pentru trimiterea de email-uri în batch via Resend API.

## Caracteristici

- **Batch Processing**: Trimite până la 100 de email-uri per batch (limită Resend API)
- **Personalizare per destinatar**: Fiecare destinatar poate avea parametri custom
- **Template-uri predefinite**: 5 template-uri HTML responsive pentru SSM/PSI
- **Tracking**: Logare completă în `email_delivery_log` pentru fiecare email trimis
- **Validare**: Verificare email-uri, limite batch, template-uri disponibile

## Environment Variables

Setează în Supabase Dashboard → Edge Functions → Settings:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
SUPABASE_URL=https://uhccxfyvhjeudkexcgiq.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Deploy

```bash
supabase functions deploy send-email-batch
```

## Template-uri Disponibile

1. **training_reminder** - Reminder instruire SSM
2. **medical_expiry** - Aviz medical expirat
3. **equipment_inspection** - Verificare tehnică echipament
4. **document_expiry** - Document expirat
5. **alert_notification** - Alertă SSM generală

## Request Format

```typescript
POST https://uhccxfyvhjeudkexcgiq.supabase.co/functions/v1/send-email-batch

Headers:
  Authorization: Bearer <ANON_KEY>
  Content-Type: application/json

Body:
{
  "recipients": [
    {
      "email": "ion.popescu@example.com",
      "name": "Ion Popescu",
      "params": {
        "date": "15.03.2026",
        "time": "10:00",
        "location": "Sala de conferințe A",
        "confirm_url": "https://app.s-s-m.ro/trainings/123/confirm"
      }
    },
    {
      "email": "maria.ionescu@example.com",
      "name": "Maria Ionescu",
      "params": {
        "date": "15.03.2026",
        "time": "10:00",
        "location": "Sala de conferințe A",
        "confirm_url": "https://app.s-s-m.ro/trainings/123/confirm"
      }
    }
  ],
  "template": "training_reminder",
  "subject": "Reminder: Instruire SSM - 15.03.2026",
  "from": {
    "email": "contact@s-s-m.ro",
    "name": "Daniel - Consultant SSM"
  },
  "params": {
    "company_name": "SC Example SRL"
  }
}
```

## Parametri

### `recipients` (required)
Array de obiecte cu destinatari:
- `email` (required): Adresa de email
- `name` (optional): Numele destinatarului
- `params` (optional): Parametri custom pentru acest destinatar

**Limită**: Max 100 destinatari per request

### `template` (required)
Numele template-ului (vezi lista mai sus)

### `subject` (required)
Subject-ul email-ului

### `from` (optional)
Obiect cu informații expeditor:
- `email`: Adresa email expeditor
- `name`: Numele expeditorului

**Default**: `noreply@s-s-m.ro` / `s-s-m.ro Platform`

### `params` (optional)
Parametri globali aplicați tuturor destinatarilor. Se pot suprascrie cu `recipient.params`.

## Response Format

### Success (200)
```json
{
  "success": true,
  "batchId": "batch_abc123xyz",
  "status": "sent",
  "recipients_count": 2,
  "template": "training_reminder",
  "messages": [
    {
      "email": "ion.popescu@example.com",
      "messageId": "msg_1234567890"
    },
    {
      "email": "maria.ionescu@example.com",
      "messageId": "msg_0987654321"
    }
  ]
}
```

### Error (400/404/500)
```json
{
  "error": "Batch size exceeds maximum of 100 recipients",
  "provided": 150,
  "max_allowed": 100
}
```

## Parametri Template

### training_reminder
- `name`: Numele destinatarului (opțional)
- `date`: Data instruirii (ex: "15.03.2026")
- `time`: Ora instruirii (ex: "10:00")
- `location`: Locația (ex: "Sala de conferințe A")
- `confirm_url`: Link confirmare participare

### medical_expiry
- `name`: Numele destinatarului (opțional)
- `expiry_date`: Data expirării (ex: "30.03.2026")
- `schedule_url`: Link programare consultație

### equipment_inspection
- `name`: Numele destinatarului (opțional)
- `equipment_name`: Numele echipamentului
- `deadline`: Termenul limită verificare
- `equipment_code`: Serie/cod echipament
- `details_url`: Link către detalii echipament

### document_expiry
- `name`: Numele destinatarului (opțional)
- `document_name`: Numele documentului
- `expiry_date`: Data expirării
- `document_type`: Tipul documentului
- `renew_url`: Link reînnoire

### alert_notification
- `name`: Numele destinatarului (opțional)
- `alert_message`: Mesajul alertei
- `priority`: Prioritate (low/medium/high)
- `alert_details`: Detalii suplimentare
- `action_url`: Link către alertă

## Delivery Tracking

Toate email-urile trimise sunt logare în tabela `email_delivery_log`:

```sql
SELECT
  email,
  template_name,
  message_id,
  batch_id,
  status,
  sent_at
FROM email_delivery_log
WHERE batch_id = 'batch_abc123xyz'
ORDER BY sent_at DESC;
```

## Rate Limits

- **Resend API**: 100 email-uri per request batch
- **Funcție**: Limită hard-coded la 100 destinatari per call

Pentru volume mai mari, fă multiple request-uri cu batch-uri de max 100.

## Exemple Utilizare

### Frontend (TypeScript)
```typescript
import { createSupabaseBrowser } from '@/lib/supabase/client';

async function sendTrainingReminders(trainingId: string) {
  const supabase = createSupabaseBrowser();

  // Get training participants
  const { data: participants } = await supabase
    .from('training_participants')
    .select('employee:employees(email, full_name)')
    .eq('training_id', trainingId);

  // Get training details
  const { data: training } = await supabase
    .from('trainings')
    .select('date, time, location')
    .eq('id', trainingId)
    .single();

  // Prepare recipients
  const recipients = participants.map(p => ({
    email: p.employee.email,
    name: p.employee.full_name,
    params: {
      date: new Date(training.date).toLocaleDateString('ro-RO'),
      time: training.time,
      location: training.location,
      confirm_url: `https://app.s-s-m.ro/trainings/${trainingId}/confirm`,
    },
  }));

  // Send batch
  const { data, error } = await supabase.functions.invoke('send-email-batch', {
    body: {
      recipients,
      template: 'training_reminder',
      subject: 'Reminder: Instruire SSM Programată',
      from: {
        email: 'contact@s-s-m.ro',
        name: 'Daniel - Consultant SSM',
      },
    },
  });

  if (error) {
    console.error('Failed to send emails:', error);
    return;
  }

  console.log(`Sent ${data.recipients_count} emails, batch ID: ${data.batchId}`);
}
```

### Batch Processing pentru volume mari
```typescript
async function sendLargeEmailBatch(allRecipients: EmailRecipient[]) {
  const BATCH_SIZE = 100;
  const batches = [];

  for (let i = 0; i < allRecipients.length; i += BATCH_SIZE) {
    batches.push(allRecipients.slice(i, i + BATCH_SIZE));
  }

  const results = [];
  for (const batch of batches) {
    const { data } = await supabase.functions.invoke('send-email-batch', {
      body: {
        recipients: batch,
        template: 'alert_notification',
        subject: 'Alertă SSM Importantă',
      },
    });
    results.push(data);

    // Wait 1 second between batches to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return results;
}
```

## Testing

```bash
# Test local cu Deno
deno run --allow-net --allow-env index.ts

# Test cu curl
curl -X POST https://uhccxfyvhjeudkexcgiq.supabase.co/functions/v1/send-email-batch \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "recipients": [
      {
        "email": "test@example.com",
        "name": "Test User",
        "params": {
          "date": "15.03.2026",
          "time": "10:00",
          "location": "Online",
          "confirm_url": "https://app.s-s-m.ro/test"
        }
      }
    ],
    "template": "training_reminder",
    "subject": "Test Email"
  }'
```

## Erori Comune

### 400 - Invalid email addresses
Verifică că toate email-urile sunt în format valid (user@domain.com)

### 400 - Batch size exceeds maximum
Reduce numărul de destinatari la max 100 per request

### 404 - Template not found
Verifică că template-ul există în lista de template-uri disponibile

### 500 - Resend API error
Verifică că `RESEND_API_KEY` este setat corect și valid

## Logs

Vezi logs în Supabase Dashboard → Edge Functions → send-email-batch → Logs

```bash
# Sau via CLI
supabase functions logs send-email-batch
```
