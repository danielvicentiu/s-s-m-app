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
  "incident_location": "Depozit, zona de rafturi înalte",
  "incident_conditions": [
    {
      "type": "weather",
      "description": "Pardoseală umedă din cauza ploii"
    },
    {
      "type": "lighting",
      "description": "Iluminare insuficientă în zonă"
    },
    {
      "type": "equipment_state",
      "description": "Scară deteriorată, trepte slăbite"
    }
  ],
  "incident_date": "2026-02-13T15:30:00Z",
  "injured_person_role": "Operator depozit",
  "injury_severity": "severe",
  "witnesses_count": 2,
  "equipment_involved": ["Scară metalică", "Echipament protecție"],
  "additional_context": "Incident s-a produs la sfârșitul programului, angajatul avea experiență de 3 ani",
  "max_tokens": 6144
}
```

### Required Parameters

- `incident_description` (string): Detailed description of what happened (minimum 10 characters)
- `incident_location` (string): Where the incident occurred
- `incident_conditions` (array): Array of condition objects with `type` and `description`

### Optional Parameters

- `incident_date` (string): ISO date string (default: current date)
- `injured_person_role` (string): Job position of injured person
- `injury_severity` (string): "minor" | "moderate" | "severe" | "fatal" | "none"
- `witnesses_count` (number): Number of witnesses
- `equipment_involved` (array): Array of equipment/machinery names
- `additional_context` (string): Any additional relevant information
- `max_tokens` (number): Maximum tokens for AI response (2000-16000, default: 6144)

## Response Format

```json
{
  "success": true,
  "analysis": {
    "incident_summary": "Angajat a suferit o cădere de la înălțime...",
    "severity_assessment": {
      "actual_severity": "Fractură gleznă, contuzii multiple, necesită spitalizare",
      "potential_severity": "Cădere de la înălțime mai mare putea cauza leziuni grave cap/coloană sau deces",
      "severity_factors": ["Lipsa echipament protecție cădere", "Scară deteriorată", "Suprafață umedă"]
    },
    "root_causes": [
      {
        "category": "Equipment Failure",
        "description": "Utilizarea unei scări deteriorate, neînlocuită la timp",
        "likelihood": "very_likely",
        "evidence": "Scara avea trepte slăbite și nu fusese inspectată de 6 luni"
      }
    ],
    "contributing_factors": [
      {
        "factor": "Iluminare insuficientă",
        "description": "Zona de lucru avea sub 50 lux, sub minimul legal de 200 lux",
        "impact_level": "high"
      }
    ],
    "immediate_corrective_actions": [
      {
        "action": "Scoaterea din uz a tuturor scărilor deteriorate",
        "description": "Identificare și etichetare imediată a echipamentelor defecte, înlocuire urgentă",
        "priority": "immediate",
        "implementation_timeframe": "imediat",
        "responsible_party": "Manager SSM + Sef depozit",
        "estimated_cost": "2000-3000 RON (scări noi)",
        "effectiveness_rating": 5
      }
    ],
    "long_term_preventive_measures": [
      {
        "measure": "Program de inspecție zilnică a echipamentelor",
        "description": "Implementare checklist zilnic pentru toate echipamentele de lucru la înălțime",
        "implementation_type": "organizational",
        "implementation_timeframe": "1-2 luni",
        "estimated_cost": "500-1000 RON (formare + proceduri)",
        "expected_impact": "Reducere cu 80% a incidentelor legate de echipamente defecte",
        "legal_requirement": true,
        "legal_references": ["Legea 319/2006 Art. 7", "HG 1425/2006"]
      }
    ],
    "similar_historical_incidents": [
      {
        "incident_type": "Căzături de la înălțime în depozite",
        "common_pattern": "Echipament deteriorat + condiții de iluminare slabe + presiune timp",
        "key_differences": "În acest caz scara era vizibil deteriorată dar totuși utilizată",
        "lessons_learned": "Inspecția regulată și cultura de oprire a lucrului în condiții nesigure"
      }
    ],
    "investigation_recommendations": [
      "Fotografiere completă a locului incidentului și echipamentului",
      "Interviuri cu toți martorii în primele 24 ore",
      "Verificare registru inspecții echipamente ultimele 6 luni",
      "Analiza condiții iluminare cu luxmetru",
      "Raport complet ITM în termen legal"
    ],
    "training_recommendations": [
      "Instruire SSM pentru toți angajații depozit privind lucrul la înălțime",
      "Formare identificare echipamente defecte și procedură raportare",
      "Training First Aid pentru supervizori",
      "Sesiune conștientizare despre dreptul de refuz în condiții nesigure"
    ],
    "legal_compliance_notes": "Conform Legea 319/2006 și HG 1425/2006, angajatorul trebuie să notifice ITM în 24 ore pentru accident grav. Investigația trebuie finalizată în 15 zile lucrătoare. Raportul de anchetă se păstrează minim 10 ani. Riscul de amendă ITM: 10.000-20.000 RON pentru echipament defect + posibile sancțiuni pentru condiții de lucru nesigure."
  },
  "statistics": {
    "root_causes_count": 3,
    "contributing_factors_count": 5,
    "immediate_actions_count": 5,
    "preventive_measures_count": 6,
    "similar_incidents_found": 2,
    "immediate_priority_actions": 2,
    "high_impact_factors": 3
  },
  "input_summary": {
    "incident_location": "Depozit, zona de rafturi înalte",
    "incident_date": "13.02.2026",
    "conditions_analyzed": 3,
    "equipment_involved": 2,
    "has_injury": true
  },
  "metadata": {
    "model": "claude-sonnet-4-5-20250929",
    "tokens_used": {
      "input_tokens": 1234,
      "output_tokens": 2345
    },
    "generated_at": "2026-02-13T10:30:00.000Z"
  }
}
```

## Analysis Components

### Severity Assessment
Structured assessment with:
- `actual_severity`: What actually happened (injuries, damage)
- `potential_severity`: Worst case scenario that could have occurred
- `severity_factors`: Array of factors affecting severity

### Root Cause Categories
- `Human Factor`: Training gaps, fatigue, competence, communication
- `Equipment Failure`: Maintenance, design, deterioration
- `Organizational`: Procedures, supervision, safety culture, resources
- `Environmental`: Lighting, noise, weather, housekeeping
- `Design Flaw`: Inherent design issues in equipment/processes

### Root Cause Likelihood
- `very_likely`: Strong evidence this was the root cause
- `likely`: Probable root cause based on available evidence
- `possible`: Could be a root cause, needs further investigation
- `unlikely`: Less likely but worth considering

### Contributing Factor Impact
- `high`: Significant contribution to incident occurrence
- `medium`: Moderate contribution
- `low`: Minor contribution but still relevant

### Action Priorities
- `immediate`: Must be done right now (within hours)
- `urgent`: Must be done within 24-48 hours
- `high`: Should be done within 1 week
- `medium`: Should be done within 1 month

### Preventive Measure Types
- `technical`: Engineering controls, equipment modifications
- `organizational`: Procedures, policies, management systems
- `behavioral`: Safety culture, awareness, supervision
- `training`: Skills development, competence building

## Environment Variables

- `ANTHROPIC_API_KEY`: Required - Your Anthropic API key

## Error Responses

### 400 Bad Request
- Missing or invalid required parameters
- Incident description too short (< 10 characters)
- Invalid incident_conditions (must be array with type and description)
- Invalid max_tokens value (must be 2000-16000)

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
      incident_location: 'Zona de încărcare, rampa 3',
      incident_conditions: [
        {
          type: 'weather',
          description: 'Ploaie torențială, vizibilitate redusă sub 10 metri'
        },
        {
          type: 'traffic',
          description: 'Trafic intens de stivuitoare, 3 unități active simultan'
        },
        {
          type: 'workspace',
          description: 'Zonă fără delimitare clară între pietoni și vehicule'
        }
      ],
      incident_date: '2026-02-13T14:20:00Z',
      injured_person_role: 'Muncitor depozit',
      injury_severity: 'moderate',
      witnesses_count: 3,
      equipment_involved: ['Stivuitor Linde', 'Palet EUR'],
      additional_context: 'Operator stivuitor avea 5 ani experiență, angajatul rănit era nou (2 săptămâni)',
    }),
  }
)

const data = await response.json()
console.log('Analysis:', data.analysis)
console.log('Root Causes:', data.analysis.root_causes)
console.log('Immediate Actions:', data.analysis.immediate_corrective_actions)
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
