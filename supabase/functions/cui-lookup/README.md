# CUI Lookup Edge Function

Supabase Edge Function pentru căutarea datelor firmelor românești prin CUI (Cod Unic de Înregistrare) folosind API-ul public ANAF.

## Funcționalități

- ✅ **Validare CUI**: Verifică formatul și cifra de control CUI
- ✅ **Normalizare**: Acceptă CUI cu/fără prefix RO, cu/fără spații
- ✅ **API ANAF**: Integrare cu API-ul oficial openapi.anaf.ro
- ✅ **Date complete**: Denumire, adresă, stare înregistrare, status TVA
- ✅ **Rate limiting**: 60 cereri/oră per IP
- ✅ **Error handling**: Mesaje de eroare clare în limba română
- ✅ **CORS enabled**: Poate fi apelat din browser

## API Usage

### Endpoint

```
POST https://[PROJECT_REF].supabase.co/functions/v1/cui-lookup
```

### Request Headers

```
Content-Type: application/json
Authorization: Bearer [ANON_KEY]
```

### Request Body

```json
{
  "cui": "12345678"
}
```

Formatul CUI acceptat:
- `12345678` - doar cifre
- `RO12345678` - cu prefix RO
- `RO 1234 5678` - cu spații (vor fi eliminate automat)

### Response (Success)

```json
{
  "success": true,
  "cui": 12345678,
  "denumire": "EXAMPLE SRL",
  "adresa": "Str. Exemplu nr. 1, București",
  "nrRegCom": "J40/1234/2020",
  "telefon": "0212345678",
  "fax": null,
  "codPostal": "123456",
  "stare_inregistrare": "INREGISTRAT",
  "data_inregistrare": "2020-01-15",
  "cod_CAEN": "6201",
  "tva": {
    "platitor_tva": true,
    "data_inceput_tva": "2020-02-01",
    "data_sfarsit_tva": null,
    "data_actualizare_tva": "2020-02-01",
    "inactiv_tva": false,
    "data_inactiv_tva": null,
    "split_tva": false
  },
  "forma_juridica": "SOCIETATE CU RASPUNDERE LIMITATA",
  "iban": "RO49AAAA1B31007593840000",
  "rate_limit": {
    "remaining": 59,
    "reset_at": "2026-02-13T15:00:00.000Z"
  }
}
```

### Response (Error - CUI invalid)

```json
{
  "error": "CUI invalid",
  "message": "Cifra de control este incorectă"
}
```

### Response (Error - Firma nu există)

```json
{
  "error": "Eroare internă",
  "message": "Firma nu a fost găsită în baza de date ANAF"
}
```

### Response (Error - Rate limit)

```json
{
  "error": "Rate limit depășit",
  "message": "Maxim 60 cereri pe oră",
  "reset_at": "2026-02-13T15:00:00.000Z"
}
```

## Rate Limiting

- **Limită**: 60 cereri/oră per IP
- **Headers**:
  - `X-RateLimit-Limit: 60`
  - `X-RateLimit-Remaining: 59`
  - `X-RateLimit-Reset: [timestamp]`

## Validare CUI

Funcția validează CUI-ul folosind algoritmul oficial:

1. **Format**: 2-10 cifre
2. **Prefix**: Acceptă opțional "RO" (va fi eliminat)
3. **Checksum**: Validare cifră de control folosind cheia de control [7,5,3,2,1,7,5,3,2]

### Exemplu validare checksum

```
CUI: 12345678
Padding: 0012345678
Control key: 7 5 3 2 1 7 5 3 2 (x)
Digits:      0 0 1 2 3 4 5 6 7 (8=check digit)
Sum: 0*7 + 0*5 + 1*3 + 2*2 + 3*1 + 4*7 + 5*5 + 6*3 + 7*2 = 102
Control: (102 * 10) % 11 = 8 ✅
```

## ANAF API

Funcția folosește API-ul oficial ANAF:
- **URL**: `https://webservicesp.anaf.ro/PlatitorTvaRest/api/v8/ws/tva`
- **Documentație**: https://static.anaf.ro/static/10/Anaf/Informatii_R/documentatie_WS_SPPV_v8.htm

## Deploy

```bash
# Deploy funcția
supabase functions deploy cui-lookup

# Testare locală
supabase functions serve cui-lookup
```

## Testing

```bash
# Test cu curl
curl -X POST https://[PROJECT_REF].supabase.co/functions/v1/cui-lookup \
  -H "Authorization: Bearer [ANON_KEY]" \
  -H "Content-Type: application/json" \
  -d '{"cui":"12345678"}'

# Test cu JavaScript
const response = await fetch('https://[PROJECT_REF].supabase.co/functions/v1/cui-lookup', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer [ANON_KEY]',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ cui: 'RO12345678' }),
});

const data = await response.json();
console.log(data);
```

## Erori comune

| Error | Cauză | Soluție |
|-------|-------|---------|
| `CUI lipsește` | Request body nu conține câmpul `cui` | Adaugă `{"cui":"12345678"}` în body |
| `CUI invalid: trebuie să conțină doar cifre` | CUI conține caractere non-numerice (după eliminarea RO) | Verifică că CUI-ul este corect |
| `CUI invalid: lungime incorectă` | CUI are mai puțin de 2 sau mai mult de 10 cifre | CUI trebuie să aibă 2-10 cifre |
| `Cifra de control este incorectă` | Checksum-ul CUI-ului este invalid | Verifică că ai introdus CUI-ul corect |
| `Firma nu a fost găsită` | ANAF nu are date pentru acest CUI | Verifică că firma este înregistrată |
| `Rate limit depășit` | Ai depășit 60 cereri/oră | Așteaptă până la `reset_at` |

## Integrare în aplicație

```typescript
// lib/api/cui-lookup.ts
export async function lookupCUI(cui: string) {
  const supabase = createSupabaseBrowser();

  const { data, error } = await supabase.functions.invoke('cui-lookup', {
    body: { cui },
  });

  if (error) throw error;
  return data;
}

// Usage in component
const handleLookup = async () => {
  try {
    const data = await lookupCUI('12345678');
    console.log('Denumire:', data.denumire);
    console.log('Adresă:', data.adresa);
    console.log('Plătitor TVA:', data.tva.platitor_tva);
  } catch (error) {
    console.error('Eroare căutare CUI:', error);
  }
};
```

## Note

- Funcția folosește in-memory rate limiting (se resetează la restart)
- Pentru production, consideră implementarea unui rate limiter persistent (Redis/Supabase)
- API-ul ANAF poate avea întreruperi - implementează retry logic în client
- Date actualizate zilnic de către ANAF
