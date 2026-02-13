# AI Incident Analyzer Edge Function

Analyzes workplace incidents to identify root causes, contributing factors, corrective actions, and preventive measures using Claude API.

## Purpose

This Edge Function provides comprehensive incident investigation analysis for SSM/PSI workplace incidents, following Romanian safety investigation standards (Legea 319/2006, Legea 307/2006).

## Features

- **Root Cause Analysis**: Identifies 2-5 root causes using established methodologies (5 Whys, Fishbone, Swiss Cheese Model)
- **Contributing Factors**: Categorizes factors by type (human, technical, organizational, environmental)
- **Immediate Actions**: Prioritized corrective actions with responsible parties and timeframes
- **Preventive Measures**: Long-term prevention strategies following hierarchy of controls
- **Similar Incidents**: Historical incident patterns and lessons learned
- **Legal Implications**: Relevant Romanian SSM/PSI legal requirements and obligations
- **Professional Summary**: Executive recommendations for management

## API Endpoint

```
POST /functions/v1/ai-incident-analyzer
```

## Request Format

```json
{
  "incident_description": "Angajat a căzut de pe scară în timpul lucrului la înălțime",
  "location": "Depozit, zona de rafturi înalte",
  "conditions": "Pardoseală umedă, iluminare insuficientă, scară deteriorată",
  "injuries": "Fractură gleznă, contuzii multiple",
  "witnesses": "2 colegi prezenți în zonă",
  "additional_context": "Incident s-a produs la sfârșitul programului",
  "max_tokens": 4096
}
```

### Required Parameters

- `incident_description` (string): Detailed description of what happened (minimum 20 characters)
- `location` (string): Where the incident occurred
- `conditions` (string): Environmental/workplace conditions at time of incident

### Optional Parameters

- `injuries` (string): Description of injuries sustained
- `witnesses` (string): Information about witnesses
- `additional_context` (string): Any additional relevant information
- `max_tokens` (number): Maximum tokens for AI response (100-8192, default: 4096)

## Response Format

```json
{
  "success": true,
  "analysis": {
    "incident_summary": "Angajat a suferit o cădere de la înălțime...",
    "severity_assessment": "serious",
    "root_causes": [
      {
        "cause": "Utilizarea unei scări deteriorate, neînlocuită la timp",
        "likelihood": "primary",
        "explanation": "Cauza directă a accidentului, echipamentul defect ar fi trebuit scos din uz"
      }
    ],
    "contributing_factors": [
      {
        "factor": "Iluminare insuficientă în zona de lucru",
        "category": "technical",
        "impact_level": "high"
      }
    ],
    "immediate_actions": [
      {
        "action": "Scoaterea imediată din uz a tuturor scărilor deteriorate",
        "priority": "immediate",
        "responsible_party": "Responsabil SSM",
        "estimated_timeframe": "imediat"
      }
    ],
    "preventive_measures": [
      {
        "measure": "Implementare program de inspecție zilnică a echipamentelor",
        "type": "administrative",
        "effectiveness": "high",
        "implementation_cost": "low"
      }
    ],
    "similar_incidents": [
      {
        "description": "Căzături de la înălțime în depozite și hale industriale",
        "common_factors": ["echipament defect", "lipsa inspecțiilor", "condiții de iluminare"],
        "lessons_learned": "Inspecția regulată și înlocuirea echipamentelor este esențială"
      }
    ],
    "legal_implications": [
      "Art. 7, Legea 319/2006 - Angajatorul trebuie să asigure echipamente în stare bună de funcționare",
      "Art. 12, HG 1425/2006 - Obligația de investigare a tuturor accidentelor de muncă"
    ],
    "recommendations_summary": "Accidentul a fost cauzat de utilizarea unei scări deteriorate..."
  },
  "statistics": {
    "root_causes_count": 3,
    "primary_causes": 1,
    "contributing_factors_count": 6,
    "high_impact_factors": 3,
    "immediate_actions_count": 5,
    "urgent_actions": 3,
    "preventive_measures_count": 8,
    "high_effectiveness_measures": 5,
    "similar_incidents_found": 3,
    "legal_references_count": 4
  },
  "input_parameters": {
    "location": "Depozit, zona de rafturi înalte",
    "conditions": "Pardoseală umedă, iluminare insuficientă, scară deteriorată",
    "has_injuries": true,
    "has_witnesses": true
  },
  "metadata": {
    "model": "claude-sonnet-4-5-20250929",
    "tokens_used": {
      "input_tokens": 1234,
      "output_tokens": 2345
    },
    "analyzed_at": "2026-02-13T10:30:00.000Z"
  }
}
```

## Analysis Components

### Severity Assessment
- `minor`: First aid only, no lost time
- `moderate`: Medical treatment, temporary disability
- `serious`: Hospitalization, significant injury
- `critical`: Life-threatening, permanent disability
- `catastrophic`: Fatality or multiple serious injuries

### Root Cause Likelihood
- `primary`: Main direct cause of the incident
- `secondary`: Important contributing cause
- `contributing`: Additional factors that enabled the incident

### Contributing Factor Categories
- `human`: Human behavior, fatigue, training gaps
- `technical`: Equipment, tools, technology failures
- `organizational`: Procedures, policies, management systems
- `environmental`: Lighting, temperature, workspace conditions

### Action Priorities
- `immediate`: Must be done right now (within hours)
- `urgent`: Must be done within 24-48 hours
- `high`: Should be done within 1 week
- `medium`: Should be done within 1 month

### Preventive Measure Types
Following hierarchy of controls:
1. `engineering`: Physical changes, guards, automation (most effective)
2. `administrative`: Procedures, training, work permits
3. `ppe`: Personal protective equipment (least effective)
4. `training`: Skills development, awareness
5. `procedural`: Updated procedures and protocols

## Environment Variables

- `ANTHROPIC_API_KEY`: Required - Your Anthropic API key

## Error Responses

### 400 Bad Request
- Missing or invalid required parameters
- Incident description too short (< 20 characters)
- Invalid max_tokens value

### 405 Method Not Allowed
- Non-POST request method

### 500 Internal Server Error
- AI service not configured (missing API key)
- Claude API error
- Failed to parse AI response
- Unexpected internal error

## Example Usage

```typescript
const response = await fetch(
  'https://uhccxfyvhjeudkexcgiq.supabase.co/functions/v1/ai-incident-analyzer',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({
      incident_description: 'Angajat a fost lovit de un palet în timpul operațiunilor de încărcare cu stivuitorul',
      location: 'Zona de încărcare, rampa 3',
      conditions: 'Trafic intens, vizibilitate redusă din cauza ploii, zonă fără delimitare clară',
      injuries: 'Traumatism membrului inferior, necesită transport la spital',
      witnesses: '3 angajați prezenți, operator stivuitor și 2 muncitori',
    }),
  }
)

const data = await response.json()
console.log('Analysis:', data.analysis)
console.log('Statistics:', data.statistics)
```

## Investigation Methodologies

The function applies multiple proven incident investigation techniques:

1. **5 Whys**: Drills down to root causes by repeatedly asking "why"
2. **Fishbone Diagram (Ishikawa)**: Categorizes causes (human, technical, organizational, environmental)
3. **Swiss Cheese Model**: Identifies multiple defensive layers that failed
4. **Hierarchy of Controls**: Prioritizes engineering controls over administrative and PPE

## Legal Framework

Analysis considers Romanian SSM/PSI legislation:
- Legea 319/2006 - SSM Framework Law
- Legea 307/2006 - PSI Framework Law
- HG 1425/2006 - SSM Implementation Norms
- Other relevant sector-specific regulations

## Best Practices

1. **Provide detailed descriptions**: More context = better analysis
2. **Include all available information**: Injuries, witnesses, conditions
3. **Focus on facts, not blame**: The AI focuses on systemic issues
4. **Use analysis for learning**: Implement recommended preventive measures
5. **Document properly**: Save analysis results for regulatory compliance

## Limitations

- AI analysis supplements but does NOT replace professional incident investigation
- Results should be reviewed by qualified SSM professionals
- Legal compliance is the organization's responsibility
- Generic similar incidents are illustrative, not case-specific research
- Always consult with legal/safety experts for serious incidents

## Integration

This function can be integrated with:
- Incident reporting systems
- Safety management platforms
- Audit and compliance tracking
- Training and awareness programs
- Legal documentation workflows
