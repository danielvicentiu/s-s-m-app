# AI Risk Assessment Edge Function

Generates comprehensive SSM/PSI risk assessments using Claude AI. Analyzes workplace hazards based on industry, job positions, and location type, providing structured risk evaluations with probability, severity, and control measures.

## Endpoint

```
POST https://<project-ref>.supabase.co/functions/v1/ai-risk-assessment
```

## Headers

```
Authorization: Bearer <anon-key>
Content-Type: application/json
```

## Request Body

```typescript
{
  "industry": string,              // e.g., "Construcții", "Fabricație metal", "IT"
  "job_positions": string[],       // e.g., ["Electrician", "Manager", "Sudor"]
  "location_type": string,         // e.g., "Șantier", "Birou", "Fabrică", "Depozit"
  "additional_context"?: string,   // Optional: extra details about workplace
  "max_tokens"?: number           // Optional: 100-8192, default 4096
}
```

## Response

```typescript
{
  "success": true,
  "assessment": {
    "summary": string,              // Overview in Romanian
    "hazards": [
      {
        "hazard_name": string,      // e.g., "Căzături de la înălțime"
        "hazard_description": string, // Detailed description in Romanian
        "probability": "rare" | "unlikely" | "possible" | "likely" | "certain",
        "severity": "negligible" | "minor" | "moderate" | "major" | "catastrophic",
        "risk_level": "low" | "medium" | "high" | "critical",
        "control_measures": string[], // Prevention measures (min 3)
        "legal_references"?: string[] // Optional: ["Legea 319/2006", ...]
      }
    ],
    "general_recommendations": string[] // 3-5 overarching recommendations
  },
  "statistics": {
    "total_hazards": number,
    "critical_risks": number,
    "high_risks": number,
    "medium_risks": number,
    "low_risks": number
  },
  "input_parameters": {
    "industry": string,
    "job_positions": string[],
    "location_type": string
  },
  "metadata": {
    "model": string,
    "tokens_used": object,
    "generated_at": string
  }
}
```

## Risk Assessment Methodology

### Probability Scale
- **rare**: Once every 10+ years
- **unlikely**: Once every 5-10 years
- **possible**: Once every 1-5 years
- **likely**: Multiple times per year
- **certain**: Expected regularly

### Severity Scale
- **negligible**: Minor discomfort, no medical treatment
- **minor**: First aid needed, no lost time
- **moderate**: Medical treatment, temporary disability
- **major**: Serious injury, permanent disability possible
- **catastrophic**: Fatality or multiple serious injuries

### Risk Level (Probability × Severity)
- **low**: Acceptable risk, monitor
- **medium**: Tolerable risk, reduce if practical
- **high**: Unacceptable risk, control measures required
- **critical**: Immediate action required

## Examples

### Construction Site Example

```bash
curl -X POST https://<project-ref>.supabase.co/functions/v1/ai-risk-assessment \
  -H "Authorization: Bearer <anon-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "industry": "Construcții civile",
    "job_positions": ["Electrician", "Zidar", "Maistru șantier"],
    "location_type": "Șantier construcție imobil rezidențial",
    "additional_context": "Lucrări la înălțime, instalații electrice"
  }'
```

### Office Example

```bash
curl -X POST https://<project-ref>.supabase.co/functions/v1/ai-risk-assessment \
  -H "Authorization: Bearer <anon-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "industry": "IT / Software",
    "job_positions": ["Programator", "Manager proiect", "Analist"],
    "location_type": "Birou open-space",
    "additional_context": "Muncă la calculator, 8 ore/zi"
  }'
```

### Manufacturing Example

```bash
curl -X POST https://<project-ref>.supabase.co/functions/v1/ai-risk-assessment \
  -H "Authorization: Bearer <anon-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "industry": "Fabricație componente metalice",
    "job_positions": ["Sudor", "Operator strung CNC", "Lăcătuș"],
    "location_type": "Hală producție",
    "additional_context": "Prelucrare metale, sudură, mașini-unelte"
  }'
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing or invalid industry parameter"
}
```

### 500 Internal Server Error
```json
{
  "error": "AI service not configured"
}
```

### 500 Parse Error
```json
{
  "error": "Failed to parse AI response",
  "details": "Invalid probability at index 2: very_high",
  "raw_response": "..."
}
```

## Environment Variables

Set in Supabase Edge Functions settings:

```
ANTHROPIC_API_KEY=sk-ant-...
```

## Legal Framework

The risk assessment follows Romanian SSM/PSI legislation:

- **Legea 319/2006** - SSM (Occupational Health & Safety)
- **HG 1425/2006** - Risk assessment methodology
- **Legea 307/2006** - PSI (Fire Safety)
- **Norma PSI** - Fire safety technical regulations

## Use Cases

1. **Initial Risk Assessment** - Generate comprehensive risk analysis for new workplaces
2. **Job-Specific Assessments** - Analyze risks for specific positions
3. **Periodic Reviews** - Update risk assessments annually or when conditions change
4. **Compliance Documentation** - Generate documentation for SSM/PSI inspections
5. **Training Material** - Use identified hazards for safety training content

## Deployment

```bash
# Deploy the function
supabase functions deploy ai-risk-assessment

# Test the function
supabase functions invoke ai-risk-assessment --data '{
  "industry": "Construcții",
  "job_positions": ["Electrician"],
  "location_type": "Șantier"
}'
```

## Performance

- **Average response time**: 5-15 seconds (depending on complexity)
- **Token usage**: 1500-3500 tokens typically
- **Model**: Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)
- **Hazard count**: Typically 8-15 hazards per assessment

## Notes

- All hazard descriptions and recommendations are in Romanian
- Legal references are optional but recommended for compliance
- The function validates all enum values (probability, severity, risk_level)
- Minimum 3 control measures per hazard
- Comprehensive assessment includes both SSM and PSI hazards
