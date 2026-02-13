# Generate Invoice Edge Function

Generează facturi PDF pentru organizații în platforma s-s-m.ro.

## Descriere

Această funcție Edge primește ID-ul unei organizații și perioada de facturare, calculează costurile pe bază de abonament și utilizatori activi, generează un document HTML (conversia la PDF urmează a fi implementată), și îl uploadează în Supabase Storage.

## Endpoint

```
POST https://[PROJECT_ID].supabase.co/functions/v1/generate-invoice
```

## Autentificare

Funcția necesită Supabase Service Role Key pentru acces complet la baza de date și storage.

## Request Body

```json
{
  "org_id": "uuid-organization-id",
  "period": "2026-02",
  "currency": "RON"
}
```

### Parametri

- `org_id` (obligatoriu): UUID al organizației pentru care se generează factura
- `period` (obligatoriu): Perioada de facturare (format: "YYYY-MM" sau "Q1-2026")
- `currency` (opțional): Moneda ("RON" sau "EUR", default: "RON")

## Response

### Succes (200)

```json
{
  "success": true,
  "invoice_number": "INV-202602-ABC123-X7Y9Z",
  "url": "https://[project].supabase.co/storage/v1/object/public/invoices/2026/INV-202602-ABC123-X7Y9Z.html",
  "invoice_data": {
    "subtotal": "249,99 RON",
    "vat": "47,50 RON",
    "total": "297,49 RON",
    "currency": "RON",
    "period": "2026-02"
  }
}
```

### Eroare (400/404/500)

```json
{
  "error": "Organization not found",
  "message": "Detailed error message"
}
```

## Logica de Calcul

### Prețuri Abonament

- **Plan de bază**: 249.99 RON / 49.99 EUR (include 1 utilizator)
- **Utilizatori adițional**: 49.99 RON / 9.99 EUR per utilizator

### TVA

- Rata TVA: **19%** (conform legislației RO)

### Exemplu Calcul

Organizație cu 5 utilizatori activi (RON):
- Plan de bază: 249.99 RON
- 4 utilizatori extra × 49.99 RON = 199.96 RON
- **Subtotal**: 449.95 RON
- **TVA (19%)**: 85.49 RON
- **TOTAL**: 535.44 RON

## Structura Facturii

Factura generată include:

### Header
- Logo s-s-m.ro
- Număr factură (format: INV-YYYYMM-ORGPREFIX-TIMESTAMP)
- Data emiterii
- Perioada facturată

### Furnizor (Provider)
- Nume: S-S-M.RO SRL
- CUI: RO12345678
- Adresa completă
- Email, telefon
- Detalii bancare (IBAN)

### Client
- Date organizație din baza de date:
  - Nume
  - CUI
  - Adresă
  - Email, telefon contact

### Items
Tabel cu:
- Descriere serviciu
- Cantitate
- Preț unitar
- Total

### Totale
- Subtotal
- TVA (19%)
- **TOTAL de plată**

### Footer
- Informații plată (banca, IBAN, termen)
- Contact facturare

## Storage

Facturile sunt stocate în bucket-ul `invoices` cu structura:

```
invoices/
  2026/
    INV-202602-ABC123-X7Y9Z.html
  2025/
    ...
```

## Database

Opțional, factura este înregistrată în tabela `invoices`:

```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE NOT NULL,
  organization_id UUID REFERENCES organizations(id),
  period TEXT NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  vat_amount DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('RON', 'EUR')),
  file_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'generated',
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Exemple de Utilizare

### cURL

```bash
curl -X POST \
  'https://uhccxfyvhjeudkexcgiq.supabase.co/functions/v1/generate-invoice' \
  -H 'Authorization: Bearer [SERVICE_ROLE_KEY]' \
  -H 'Content-Type: application/json' \
  -d '{
    "org_id": "123e4567-e89b-12d3-a456-426614174000",
    "period": "2026-02",
    "currency": "RON"
  }'
```

### JavaScript/TypeScript

```typescript
const { data, error } = await supabase.functions.invoke('generate-invoice', {
  body: {
    org_id: organizationId,
    period: '2026-02',
    currency: 'RON'
  }
});

if (error) {
  console.error('Error:', error);
} else {
  console.log('Invoice URL:', data.url);
  window.open(data.url, '_blank');
}
```

## Dezvoltare Viitoare

### TODO: Conversie la PDF

Funcția curentă generează HTML. Pentru conversie la PDF real, opțiuni:

1. **PDF Service API** (recomandat pentru producție)
   - PDFShift: https://pdfshift.io
   - DocRaptor: https://docraptor.com
   - CloudConvert API

2. **Puppeteer în serviciu separat**
   - Nu rulează nativ în Deno Edge Functions
   - Necesită container Docker separat

3. **Biblioteci PDF native**
   - pdfkit pentru Deno
   - jsPDF (client-side alternative)

### Exemplu integrare PDFShift

```typescript
const pdfResponse = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${btoa(PDFSHIFT_API_KEY + ':')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    source: html,
    landscape: false,
    use_print: true
  })
});

const pdfBuffer = await pdfResponse.arrayBuffer();
```

## Deploy

```bash
# Deploy funcția
supabase functions deploy generate-invoice

# Testare locală
supabase functions serve generate-invoice
```

## Environment Variables

Setate automat de Supabase:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Securitate

- ✅ RLS activ pe tabele
- ✅ Service Role Key pentru acces complet
- ✅ CORS configurat
- ✅ Validare input
- ⚠️ Recomandare: adaugă rate limiting în producție

## License

Proprietate S-S-M.RO © 2026
