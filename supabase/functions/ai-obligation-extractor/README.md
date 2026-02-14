# AI Obligation Extractor Edge Function

Edge Function pentru extragerea automată a obligațiilor SSM/PSI din texte legislative folosind Claude API.

## Funcționalitate

Primește text legislativ (legi, hotărâri, ordine) și extrage obligații structurate:
- **article**: Referința articolului (ex: "Art. 5 alin. 3")
- **obligation_text**: Descrierea obligației în română
- **deadline**: Termen limită dacă există (ex: "30 zile", "anual")
- **penalty**: Penalitate dacă există (ex: "500-2000 RON")
- **applicable_industries**: Coduri industrii aplicabile

## Request

```http
POST /ai-obligation-extractor
Content-Type: application/json

{
  "legislation_text": "Art. 5. (1) Angajatorul are obligația să...",
  "legislation_title": "Legea nr. 319/2006" (optional),
  "max_tokens": 4096 (optional, default: 4096, max: 8192)
}
```

## Response

```json
{
  "success": true,
  "obligations": [
    {
      "article": "Art. 5 alin. 1",
      "obligation_text": "Angajatorul trebuie să efectueze evaluarea riscurilor",
      "deadline": "anual",
      "penalty": "1000-5000 RON",
      "applicable_industries": ["toate"]
    }
  ],
  "metadata": {
    "count": 1,
    "model": "claude-sonnet-4-5-20250929",
    "tokens_used": { "input_tokens": 150, "output_tokens": 300 }
  }
}
```

## Environment Variables

Necesită configurare în Supabase Dashboard:
- `ANTHROPIC_API_KEY`: API key pentru Claude (obligatoriu)

## Deployment

```bash
# Deploy to Supabase
supabase functions deploy ai-obligation-extractor

# Test local
supabase functions serve ai-obligation-extractor
```

## Error Handling

- **400**: Input invalid (text prea scurt, parametri lipsa)
- **405**: Method not allowed (doar POST)
- **500**: Eroare AI service sau parsing

## Limitări

- Minimum 50 caractere text legislativ
- Maximum 8192 tokens pentru răspuns
- Necesită ANTHROPIC_API_KEY configurat
- Folosește Claude Sonnet 4.5 model

## Integrare

Folosit în:
- `/app/admin/legislation/[id]/extract` - Extracție automată obligații
- Background jobs pentru procesare bulk legislație
