# Webhook Receiver Edge Function

Edge Function pentru primirea și procesarea webhooks de la provideri externi.

## Provideri Suportați

### 1. **Stripe** (producție)
- Payment events: `checkout.session.completed`, `payment_intent.succeeded`, etc.
- Subscription events: `customer.subscription.*`
- Invoice events: `invoice.paid`, `invoice.payment_failed`
- **Validare**: Stripe signature verification cu `STRIPE_WEBHOOK_SECRET`

### 2. **REGES** (mock pentru testing)
- Certificate events: `certificate.issued`, `certificate.updated`, `certificate.revoked`
- Status events: `status.changed`
- **Validare**: HMAC-SHA256 cu `REGES_WEBHOOK_SECRET`

### 3. **certSIGN** (mock pentru testing)
- Signature events: `document.signed`, `signature.verified`
- Timestamp events: `timestamp.applied`
- Error events: `error.occurred`
- **Validare**: HMAC-SHA256 cu `CERTSIGN_WEBHOOK_SECRET`

## Endpoint URL

```
https://[project-ref].supabase.co/functions/v1/webhook-receiver?provider=stripe|reges|certsign
```

## Environment Variables

```bash
# Supabase
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe (producție)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# REGES (mock - optional, default: reges-dev-secret-key)
REGES_WEBHOOK_SECRET=your-secret-here

# certSIGN (mock - optional, default: certsign-dev-secret-key)
CERTSIGN_WEBHOOK_SECRET=your-secret-here
```

## Folosire

### 1. Deploy Edge Function

```bash
supabase functions deploy webhook-receiver
```

### 2. Set environment variables

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
supabase secrets set REGES_WEBHOOK_SECRET=your-secret
supabase secrets set CERTSIGN_WEBHOOK_SECRET=your-secret
```

### 3. Configurare în provider dashboard

**Stripe:**
- Mergi la Dashboard > Developers > Webhooks
- Add endpoint: `https://[project-ref].supabase.co/functions/v1/webhook-receiver?provider=stripe`
- Select events: `checkout.session.completed`, `payment_intent.*`, `customer.subscription.*`, `invoice.*`

**REGES/certSIGN (mock):**
- Folosește endpoint-ul pentru testing:
  - REGES: `...?provider=reges`
  - certSIGN: `...?provider=certsign`

## Testing Local

```bash
# Pornește funcția local
supabase functions serve webhook-receiver

# Test Stripe webhook
curl -X POST http://localhost:54321/functions/v1/webhook-receiver?provider=stripe \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: your-signature" \
  -d '{"type":"checkout.session.completed","id":"evt_test"}'

# Test REGES webhook
curl -X POST http://localhost:54321/functions/v1/webhook-receiver?provider=reges \
  -H "Content-Type: application/json" \
  -H "X-Reges-Signature: sha256=..." \
  -d '{
    "event_type": "certificate.issued",
    "webhook_id": "wh_123",
    "timestamp": "2026-02-13T10:00:00Z",
    "data": {
      "certificate_id": "cert_123",
      "employee_cnp": "1234567890123",
      "organization_cui": "RO12345678"
    }
  }'

# Test certSIGN webhook
curl -X POST http://localhost:54321/functions/v1/webhook-receiver?provider=certsign \
  -H "Content-Type: application/json" \
  -H "X-Certsign-Signature: sha256=..." \
  -d '{
    "event_type": "document.signed",
    "webhook_id": "wh_456",
    "timestamp": "2026-02-13T10:00:00Z",
    "data": {
      "document_id": "doc_123",
      "signer_email": "user@example.com",
      "signature_type": "qualified"
    }
  }'
```

## Logging

Toate webhooks primite sunt loggate în tabela `webhook_logs`:

```sql
SELECT
  provider,
  event_type,
  signature_valid,
  status,
  processing_time_ms,
  created_at
FROM webhook_logs
ORDER BY created_at DESC
LIMIT 50;
```

## Response Format

**Success:**
```json
{
  "received": true,
  "provider": "stripe",
  "event_type": "checkout.session.completed",
  "webhook_id": "evt_xxx",
  "processed": true
}
```

**Error (tot 200 OK pentru a nu retrimite):**
```json
{
  "received": true,
  "error": "Internal processing error",
  "provider": "stripe"
}
```

## Security

- ✅ Signature verification per provider
- ✅ Audit trail în `webhook_logs`
- ✅ RLS activat pe `webhook_logs` (doar consultanți pot vedea)
- ✅ Service role key folosit pentru write
- ✅ Return 200 OK pentru erori de procesare (previne retry loop)
- ✅ Return 500 doar pentru erori critice (permite retry)

## TODO

- [ ] Implementare tabela `certificates` pentru REGES webhooks
- [ ] Notificări în timp real pentru webhooks importante
- [ ] Rate limiting per provider
- [ ] Retry logic pentru operațiuni failed
- [ ] Monitoring și alerting pentru webhook failures
