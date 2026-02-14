# Generate Invoice Edge Function

Generează facturi PDF pentru abonamentele organizațiilor și le salvează în Supabase Storage.

## Funcționalitate

- Generează facturi PDF cu header-ul provider-ului (S-S-M.RO)
- Include detaliile client-ului (organizație)
- Calculează automat items (plan abonament, utilizatori suplimentari)
- Aplică TVA 19%
- Suportă RON și EUR
- Salvează PDF în Supabase Storage
- Returnează URL public al facturii

## Request

```typescript
POST /generate-invoice
Authorization: Bearer <supabase-auth-token>
Content-Type: application/json

{
  "org_id": "uuid-organization-id",
  "period": "2024-01",
  "currency": "RON" // optional, default: RON
}
```

## Response

```json
{
  "success": true,
  "invoice_number": "SSM-202401-ABC12345",
  "url": "https://storage-url/invoices/org-id/invoice.pdf",
  "total": 595.0,
  "currency": "RON"
}
```

## Calcul Factură

1. **Abonament bază**: Prețul planului activ
2. **Utilizatori suplimentari**: 50 RON / 10 EUR per user peste limită
3. **Subtotal**: Suma items
4. **TVA**: 19% din subtotal
5. **Total**: Subtotal + TVA

## Securitate

- Necesită autentificare Supabase
- Verifică membership-ul utilizatorului în organizație
- Folosește SUPABASE_SERVICE_ROLE_KEY pentru operațiuni privilegiate

## Storage

Facturile sunt salvate în:
```
documents/invoices/{org_id}/{invoice_number}.pdf
```

## Database

Funcția încearcă să salveze un record în tabela `invoices` (dacă există):
- invoice_number
- organization_id
- period
- subtotal
- vat_amount
- total
- currency
- status: 'issued'
- file_url
- items (JSON)
- created_by

## Deployment

```bash
supabase functions deploy generate-invoice --no-verify-jwt
```

## Environment Variables

Sunt setate automat de Supabase:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY

## PDF Generation

Funcția folosește **pdf-lib** (v1.17.1) pentru generarea profesională de PDF-uri:
- Layout A4 standard (595.28 x 841.89 points)
- Font-uri embedded (Helvetica, Helvetica-Bold)
- Brand colors (#2563eb blue pentru accente)
- Header cu detalii provider și invoice
- Tabel items cu coloane formatate
- Secțiune totals cu TVA
- Footer informativ

## Example Usage

```typescript
const response = await fetch('https://project.supabase.co/functions/v1/generate-invoice', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    org_id: 'org-uuid',
    period: '2024-01',
    currency: 'RON',
  }),
})

const { url, invoice_number, total } = await response.json()
console.log(`Factură generată: ${invoice_number} - ${url}`)
```
