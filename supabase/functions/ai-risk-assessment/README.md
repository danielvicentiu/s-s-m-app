# AI Risk Assessment Edge Function

Generates comprehensive SSM/PSI risk assessments using Claude API based on industry, job positions, and location type.

## Endpoint

```
POST https://uhccxfyvhjeudkexcgiq.supabase.co/functions/v1/ai-risk-assessment
```

## Request Body

```typescript
{
  "industry": string,              // e.g., "fabricatie", "constructii", "retail", "IT"
  "job_positions": string[],       // e.g., ["sudor", "manager", "operator masina"]
  "location_type": string,         // e.g., "interior", "exterior", "mixt", "santier"
  "specific_context"?: string,     // optional additional context
  "language"?: "ro" | "en" | "bg" | "hu" | "de"  // default: "ro"
}
```

## Response

```typescript
{
  "success": true,
  "assessment": {
    "industry": string,
    "job_positions": string[],
    "location_type": string,
    "hazards": [
      {
        "id": string,                    // e.g., "HAZ-001"
        "name": string,                  // e.g., "Zgomot excesiv"
        "description": string,           // Detailed description
        "category": "physical" | "chemical" | "biological" | "ergonomic" | "psychosocial" | "fire",
        "affected_positions": string[],  // Job positions affected
        "probability": 1 | 2 | 3 | 4 | 5,  // 1=foarte redusă, 5=foarte mare
        "severity": 1 | 2 | 3 | 4 | 5,     // 1=neglijabilă, 5=catastrofală
        "risk_level": "low" | "medium" | "high" | "critical",
        "control_measures": [
          {
            "type": "elimination" | "substitution" | "engineering" | "administrative" | "ppe",
            "description": string,
            "priority": "high" | "medium" | "low",
            "responsible": string,
            "deadline_suggestion": string
          }
        ]
      }
    ],
    "summary": {
      "total_hazards": number,
      "critical_risks": number,
      "high_risks": number,
      "medium_risks": number,
      "low_risks": number
    }
  },
  "metadata": {
    "model": "claude-sonnet-4-5-20250929",
    "tokens_used": {...},
    "generated_at": string
  }
}
```

## Risk Level Calculation

Risk Level = Probability × Severity

- **1-4**: Low risk
- **5-9**: Medium risk
- **10-15**: High risk
- **16-25**: Critical risk

## Probability Scale

1. **Foarte redusă**: Once per 10+ years
2. **Redusă**: Once per 5-10 years
3. **Medie**: Once per 1-5 years
4. **Mare**: Multiple times per year
5. **Foarte mare**: Daily/weekly occurrence

## Severity Scale

1. **Neglijabilă**: No injury
2. **Mică**: First aid needed
3. **Medie**: Medical treatment required
4. **Mare**: Hospitalization required
5. **Catastrofală**: Death or permanent disability

## Control Measures Hierarchy

Following Romanian SSM best practices (Legea 319/2006):

1. **Elimination**: Remove the hazard completely
2. **Substitution**: Replace with less hazardous alternative
3. **Engineering Controls**: Isolate people from hazard (guards, ventilation, etc.)
4. **Administrative Controls**: Change work procedures, training, signage
5. **PPE**: Personal protective equipment (last resort)

## Example Request

```bash
curl -X POST https://uhccxfyvhjeudkexcgiq.supabase.co/functions/v1/ai-risk-assessment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -d '{
    "industry": "fabricatie",
    "job_positions": ["sudor", "operator masina de frezat", "manager productie"],
    "location_type": "interior",
    "specific_context": "Hala de productie cu utilaje CNC si zona de sudura",
    "language": "ro"
  }'
```

## Example Response

```json
{
  "success": true,
  "assessment": {
    "industry": "fabricatie",
    "job_positions": ["sudor", "operator masina de frezat", "manager productie"],
    "location_type": "interior",
    "hazards": [
      {
        "id": "HAZ-001",
        "name": "Expunere la fum de sudură",
        "description": "Inhalarea fumului toxic rezultat din procesul de sudură, conținând particule metalice și gaze nocive care pot afecta sistemul respirator.",
        "category": "chemical",
        "affected_positions": ["sudor"],
        "probability": 5,
        "severity": 4,
        "risk_level": "critical",
        "control_measures": [
          {
            "type": "engineering",
            "description": "Instalare sistem de ventilație localizată la punctele de sudură",
            "priority": "high",
            "responsible": "Manager SSM",
            "deadline_suggestion": "30 zile"
          },
          {
            "type": "ppe",
            "description": "Utilizare masca de protecție cu filtru P3 pentru sudori",
            "priority": "high",
            "responsible": "Manager productie",
            "deadline_suggestion": "imediat"
          }
        ]
      }
    ],
    "summary": {
      "total_hazards": 15,
      "critical_risks": 2,
      "high_risks": 5,
      "medium_risks": 6,
      "low_risks": 2
    }
  },
  "metadata": {
    "model": "claude-sonnet-4-5-20250929",
    "tokens_used": { "input_tokens": 1250, "output_tokens": 3420 },
    "generated_at": "2026-02-13T14:30:00.000Z"
  }
}
```

## Environment Variables

Required in Supabase Edge Functions settings:

```
ANTHROPIC_API_KEY=your_claude_api_key_here
```

## Deployment

```bash
# Deploy function
supabase functions deploy ai-risk-assessment

# Test locally
supabase functions serve ai-risk-assessment
```

## Use Cases

1. **Initial Risk Assessment**: Generate comprehensive risk assessment for new companies/locations
2. **Job Position Analysis**: Evaluate specific hazards for individual job roles
3. **Industry-Specific Risks**: Get tailored risk assessments based on industry standards
4. **Multi-language Support**: Generate assessments in Romanian, English, Bulgarian, Hungarian, German
5. **Compliance Documentation**: Create structured risk data for SSM compliance reports

## Integration Example

```typescript
import { createSupabaseBrowser } from '@/lib/supabase/client'

async function generateRiskAssessment(
  industry: string,
  jobPositions: string[],
  locationType: string
) {
  const supabase = createSupabaseBrowser()

  const { data, error } = await supabase.functions.invoke('ai-risk-assessment', {
    body: {
      industry,
      job_positions: jobPositions,
      location_type: locationType,
      language: 'ro'
    }
  })

  if (error) {
    console.error('Risk assessment error:', error)
    return null
  }

  return data.assessment
}

// Usage
const assessment = await generateRiskAssessment(
  'constructii',
  ['zidar', 'electrician', 'maistru'],
  'santier'
)

console.log(`Found ${assessment.summary.total_hazards} hazards`)
console.log(`Critical risks: ${assessment.summary.critical_risks}`)
```

## Notes

- Uses Claude Sonnet 4.5 for high-quality risk assessments
- Follows Romanian SSM legislation (Legea 319/2006)
- Includes fire safety (PSI) considerations
- Provides actionable control measures with hierarchy
- Returns structured JSON for easy database integration
- Supports multiple languages for EU compliance
