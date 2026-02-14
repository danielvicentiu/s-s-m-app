// AI Incident Analyzer Edge Function
// Analyzes workplace SSM/PSI incidents to identify root causes, contributing factors,
// immediate corrective actions, long-term preventive measures, and similar historical patterns
// Uses Claude API to provide comprehensive incident investigation insights

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface IncidentCondition {
  type: string // e.g., "weather", "lighting", "noise_level", "temperature", "equipment_state"
  description: string
}

interface RequestBody {
  incident_description: string // Detailed description of what happened
  incident_location: string // Where it occurred (e.g., "zona productie", "depozit", "santier")
  incident_conditions: IncidentCondition[] // Environmental/situational conditions
  incident_date?: string // ISO date string
  injured_person_role?: string // Job position of injured person (if applicable)
  injury_severity?: 'minor' | 'moderate' | 'severe' | 'fatal' | 'none' // Injury severity
  witnesses_count?: number // Number of witnesses
  equipment_involved?: string[] // Equipment/machinery involved
  additional_context?: string // Any other relevant information
  max_tokens?: number
}

interface RootCause {
  category: string // e.g., "Human Factor", "Equipment Failure", "Organizational", "Environmental"
  description: string // Clear explanation in Romanian
  likelihood: 'very_likely' | 'likely' | 'possible' | 'unlikely' // How likely this was the root cause
  evidence: string // Why we believe this is a root cause
}

interface ContributingFactor {
  factor: string // Short name
  description: string // Explanation in Romanian
  impact_level: 'high' | 'medium' | 'low' // How much it contributed
}

interface CorrectiveAction {
  action: string // Short title
  description: string // Detailed explanation in Romanian
  priority: 'immediate' | 'urgent' | 'high' | 'medium' // Priority level
  implementation_timeframe: string // e.g., "imediat", "24 ore", "7 zile"
  responsible_party: string // Who should implement (e.g., "manager SSM", "supervizor productie")
  estimated_cost: string // Cost estimate in RON or description
  effectiveness_rating: number // 1-5 (how effective this action would be)
}

interface PreventiveMeasure {
  measure: string // Short title
  description: string // Detailed explanation in Romanian
  implementation_type: 'technical' | 'organizational' | 'behavioral' | 'training' // Type of measure
  implementation_timeframe: string // e.g., "1-3 luni", "6 luni", "continuu"
  estimated_cost: string // Cost estimate
  expected_impact: string // What improvement we expect to see
  legal_requirement: boolean // Is this legally mandated?
  legal_references?: string[] // Relevant laws if applicable
}

interface SimilarIncident {
  incident_type: string // Type of similar incident
  common_pattern: string // What pattern is common
  key_differences: string // How it differs from current incident
  lessons_learned: string // What should be learned from historical patterns
}

interface IncidentAnalysis {
  incident_summary: string // Brief summary of the incident in Romanian
  severity_assessment: {
    actual_severity: string // What actually happened
    potential_severity: string // What could have happened (worst case)
    severity_factors: string[] // What made it severe or could have made it worse
  }
  root_causes: RootCause[]
  contributing_factors: ContributingFactor[]
  immediate_corrective_actions: CorrectiveAction[]
  long_term_preventive_measures: PreventiveMeasure[]
  similar_historical_incidents: SimilarIncident[]
  investigation_recommendations: string[] // How to conduct full investigation
  training_recommendations: string[] // What training should be provided
  legal_compliance_notes: string // Legal obligations following incident (in Romanian)
}

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_MAX_TOKENS = 6144

const INCIDENT_ANALYSIS_PROMPT = `You are a senior Romanian SSM/PSI (Occupational Health & Safety / Fire Safety) incident investigation expert with 20+ years of experience in root cause analysis and accident prevention.

Analyze the following workplace incident and provide a comprehensive investigation report.

**INCIDENT DETAILS:**
- Description: {incident_description}
- Location: {incident_location}
- Date: {incident_date}
{injured_person_role}
{injury_severity}
{witnesses_count}
{equipment_involved}

**CONDITIONS AT TIME OF INCIDENT:**
{incident_conditions}

{additional_context}

**YOUR TASK:**
Conduct a thorough incident investigation following Romanian legislation (Legea 319/2006, HG 1425/2006) and international best practices (ISO 45001, ILO guidelines).

Use systematic investigation methods including:
- 5 Whys analysis
- Fishbone/Ishikawa diagram thinking (Man, Machine, Method, Material, Environment)
- Swiss Cheese Model (multiple failures alignment)
- Human Factors Analysis (HFACS framework)

Provide the following analysis:

1. **incident_summary** - Brief 2-3 sentence summary of what happened (in Romanian)

2. **severity_assessment** - Assess the severity:
   - **actual_severity** - What actually happened (injuries, damage, etc.)
   - **potential_severity** - Worst case scenario that could have occurred
   - **severity_factors** - Array of factors that affected severity (e.g., "PPE usage", "quick response", "lack of guards")

3. **root_causes** - Identify 2-4 ROOT CAUSES (not symptoms). For each:
   - **category** - "Human Factor" | "Equipment Failure" | "Organizational" | "Environmental" | "Design Flaw"
   - **description** - Clear explanation in Romanian (why this is a root cause)
   - **likelihood** - "very_likely" | "likely" | "possible" | "unlikely"
   - **evidence** - What evidence supports this as root cause

4. **contributing_factors** - Identify 3-6 factors that contributed but weren't root causes:
   - **factor** - Short name (e.g., "Zgomot excesiv", "Grabă", "Lipsa instruire")
   - **description** - Explanation in Romanian
   - **impact_level** - "high" | "medium" | "low"

5. **immediate_corrective_actions** - 3-5 actions to take RIGHT NOW to prevent recurrence:
   - **action** - Short title (e.g., "Oprire echipament defect")
   - **description** - Detailed explanation in Romanian
   - **priority** - "immediate" | "urgent" | "high" | "medium"
   - **implementation_timeframe** - e.g., "imediat", "24 ore", "48 ore", "7 zile"
   - **responsible_party** - Who implements (e.g., "manager SSM", "sef productie", "tehnician")
   - **estimated_cost** - Cost in RON or description (e.g., "cost minim", "500-1000 RON")
   - **effectiveness_rating** - 1-5 (5 = most effective)

6. **long_term_preventive_measures** - 4-6 systemic improvements for long-term prevention:
   - **measure** - Short title
   - **description** - Detailed explanation in Romanian
   - **implementation_type** - "technical" | "organizational" | "behavioral" | "training"
   - **implementation_timeframe** - e.g., "1-3 luni", "3-6 luni", "continuu"
   - **estimated_cost** - Cost estimate in RON
   - **expected_impact** - What improvement we expect
   - **legal_requirement** - true if legally mandated, false if recommended
   - **legal_references** - Array of laws if applicable (e.g., ["Legea 319/2006"])

7. **similar_historical_incidents** - 2-3 similar incident patterns from SSM/PSI history:
   - **incident_type** - Type of similar incident
   - **common_pattern** - What pattern repeats
   - **key_differences** - How this incident differs
   - **lessons_learned** - Key lessons from historical patterns

8. **investigation_recommendations** - Array of 3-5 steps for conducting full investigation (in Romanian)

9. **training_recommendations** - Array of 3-4 specific training needs identified (in Romanian)

10. **legal_compliance_notes** - Brief paragraph on legal obligations following this incident (reporting requirements, ITM notification, etc.) in Romanian

**IMPORTANT CONSIDERATIONS:**
- Distinguish ROOT CAUSES (fundamental reasons) from SYMPTOMS (surface-level observations)
- Apply "5 Whys" thinking - dig deeper than obvious answers
- Consider human factors (fatigue, stress, competence, communication)
- Consider organizational factors (safety culture, procedures, supervision, resources)
- Consider technical factors (equipment design, maintenance, guards)
- Consider environmental factors (lighting, noise, weather, housekeeping)
- Be specific and actionable in recommendations
- Prioritize based on effectiveness and ease of implementation
- Follow Romanian legal requirements for incident investigation
- Use clear Romanian language for all text fields
- Be thorough but realistic
- Consider both immediate and systemic solutions

Return ONLY a valid JSON object with this exact structure:
{
  "incident_summary": "string",
  "severity_assessment": {
    "actual_severity": "string",
    "potential_severity": "string",
    "severity_factors": ["string"]
  },
  "root_causes": [
    {
      "category": "string",
      "description": "string",
      "likelihood": "very_likely|likely|possible|unlikely",
      "evidence": "string"
    }
  ],
  "contributing_factors": [
    {
      "factor": "string",
      "description": "string",
      "impact_level": "high|medium|low"
    }
  ],
  "immediate_corrective_actions": [
    {
      "action": "string",
      "description": "string",
      "priority": "immediate|urgent|high|medium",
      "implementation_timeframe": "string",
      "responsible_party": "string",
      "estimated_cost": "string",
      "effectiveness_rating": 1-5
    }
  ],
  "long_term_preventive_measures": [
    {
      "measure": "string",
      "description": "string",
      "implementation_type": "technical|organizational|behavioral|training",
      "implementation_timeframe": "string",
      "estimated_cost": "string",
      "expected_impact": "string",
      "legal_requirement": boolean,
      "legal_references": ["string"]
    }
  ],
  "similar_historical_incidents": [
    {
      "incident_type": "string",
      "common_pattern": "string",
      "key_differences": "string",
      "lessons_learned": "string"
    }
  ],
  "investigation_recommendations": ["string"],
  "training_recommendations": ["string"],
  "legal_compliance_notes": "string"
}

Return ONLY the JSON object, no explanations or markdown.`

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Parse request body
    const body: RequestBody = await req.json()
    const {
      incident_description,
      incident_location,
      incident_conditions,
      incident_date = new Date().toISOString(),
      injured_person_role = '',
      injury_severity = '',
      witnesses_count = 0,
      equipment_involved = [],
      additional_context = '',
      max_tokens = DEFAULT_MAX_TOKENS,
    } = body

    // Validate input
    if (!incident_description || typeof incident_description !== 'string' || incident_description.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid incident_description parameter (must be at least 10 characters)' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!incident_location || typeof incident_location !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid incident_location parameter' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!Array.isArray(incident_conditions)) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid incident_conditions parameter (must be array)' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Validate each condition
    for (const condition of incident_conditions) {
      if (!condition.type || !condition.description) {
        return new Response(
          JSON.stringify({ error: 'Each incident condition must have type and description' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }
    }

    // Validate max_tokens
    if (max_tokens < 2000 || max_tokens > 16000) {
      return new Response(
        JSON.stringify({ error: 'max_tokens must be between 2000 and 16000' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get API key from environment
    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not configured')
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Format conditions
    const conditionsText = incident_conditions.length > 0
      ? incident_conditions
          .map(c => `- ${c.type}: ${c.description}`)
          .join('\n')
      : 'No specific conditions documented.'

    // Format optional fields
    const injuredRoleText = injured_person_role
      ? `- Injured Person Role: ${injured_person_role}`
      : ''

    const injurySeverityText = injury_severity
      ? `- Injury Severity: ${injury_severity}`
      : ''

    const witnessesText = witnesses_count > 0
      ? `- Witnesses: ${witnesses_count}`
      : ''

    const equipmentText = equipment_involved.length > 0
      ? `- Equipment Involved: ${equipment_involved.join(', ')}`
      : ''

    const contextText = additional_context
      ? `\n**ADDITIONAL CONTEXT:**\n${additional_context}`
      : ''

    // Format date for display
    const displayDate = incident_date ? new Date(incident_date).toLocaleDateString('ro-RO') : 'unknown'

    // Construct full prompt
    const fullPrompt = INCIDENT_ANALYSIS_PROMPT
      .replace('{incident_description}', incident_description)
      .replace('{incident_location}', incident_location)
      .replace('{incident_date}', displayDate)
      .replace('{injured_person_role}', injuredRoleText)
      .replace('{injury_severity}', injurySeverityText)
      .replace('{witnesses_count}', witnessesText)
      .replace('{equipment_involved}', equipmentText)
      .replace('{incident_conditions}', conditionsText)
      .replace('{additional_context}', contextText)

    // Call Claude API
    console.log('Calling Claude API for incident analysis...')
    console.log(`Parameters: location=${incident_location}, conditions=${incident_conditions.length}`)

    const claudeResponse = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: max_tokens,
        messages: [
          {
            role: 'user',
            content: fullPrompt,
          },
        ],
      }),
    })

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text()
      console.error('Claude API error:', errorText)
      return new Response(
        JSON.stringify({
          error: 'AI service error',
          details: `Status ${claudeResponse.status}`,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const claudeData = await claudeResponse.json()
    const extractedText = claudeData.content?.[0]?.text

    if (!extractedText) {
      console.error('No text in Claude response:', claudeData)
      return new Response(
        JSON.stringify({ error: 'No response from AI service' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Parse incident analysis
    let analysis: IncidentAnalysis
    try {
      // Clean potential markdown code blocks
      const cleanedText = extractedText
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim()

      analysis = JSON.parse(cleanedText)

      // Validate structure
      if (
        !analysis.incident_summary ||
        !analysis.severity_assessment ||
        !Array.isArray(analysis.root_causes) ||
        !Array.isArray(analysis.contributing_factors) ||
        !Array.isArray(analysis.immediate_corrective_actions) ||
        !Array.isArray(analysis.long_term_preventive_measures) ||
        !Array.isArray(analysis.similar_historical_incidents) ||
        !Array.isArray(analysis.investigation_recommendations) ||
        !Array.isArray(analysis.training_recommendations) ||
        !analysis.legal_compliance_notes
      ) {
        throw new Error('Invalid incident analysis structure')
      }

      // Validate severity_assessment
      if (
        !analysis.severity_assessment.actual_severity ||
        !analysis.severity_assessment.potential_severity ||
        !Array.isArray(analysis.severity_assessment.severity_factors)
      ) {
        throw new Error('Invalid severity_assessment structure')
      }

      // Validate root causes (should have at least 1)
      if (analysis.root_causes.length === 0) {
        throw new Error('No root causes identified')
      }

      analysis.root_causes.forEach((cause, index) => {
        if (!cause.category || !cause.description || !cause.likelihood || !cause.evidence) {
          throw new Error(`Invalid root cause structure at index ${index}`)
        }
      })

      // Validate contributing factors
      analysis.contributing_factors.forEach((factor, index) => {
        if (!factor.factor || !factor.description || !factor.impact_level) {
          throw new Error(`Invalid contributing factor structure at index ${index}`)
        }
      })

      // Validate immediate corrective actions
      if (analysis.immediate_corrective_actions.length === 0) {
        throw new Error('No immediate corrective actions identified')
      }

      analysis.immediate_corrective_actions.forEach((action, index) => {
        if (
          !action.action ||
          !action.description ||
          !action.priority ||
          !action.implementation_timeframe ||
          !action.responsible_party ||
          !action.estimated_cost ||
          typeof action.effectiveness_rating !== 'number'
        ) {
          throw new Error(`Invalid corrective action structure at index ${index}`)
        }
        if (action.effectiveness_rating < 1 || action.effectiveness_rating > 5) {
          throw new Error(`Invalid effectiveness_rating at index ${index}: ${action.effectiveness_rating}`)
        }
      })

      // Validate preventive measures
      if (analysis.long_term_preventive_measures.length === 0) {
        throw new Error('No long-term preventive measures identified')
      }

      analysis.long_term_preventive_measures.forEach((measure, index) => {
        if (
          !measure.measure ||
          !measure.description ||
          !measure.implementation_type ||
          !measure.implementation_timeframe ||
          !measure.estimated_cost ||
          !measure.expected_impact ||
          typeof measure.legal_requirement !== 'boolean'
        ) {
          throw new Error(`Invalid preventive measure structure at index ${index}`)
        }
      })

      // Sort corrective actions by priority
      const priorityOrder = { immediate: 1, urgent: 2, high: 3, medium: 4 }
      analysis.immediate_corrective_actions.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      )

    } catch (parseError) {
      console.error('Failed to parse incident analysis:', parseError)
      console.error('Raw response:', extractedText)
      return new Response(
        JSON.stringify({
          error: 'Failed to parse AI response',
          details: parseError instanceof Error ? parseError.message : 'Unknown error',
          raw_response: extractedText.substring(0, 500),
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    console.log('Successfully generated incident analysis')
    console.log(`Root causes: ${analysis.root_causes.length}, Contributing factors: ${analysis.contributing_factors.length}`)
    console.log(`Corrective actions: ${analysis.immediate_corrective_actions.length}, Preventive measures: ${analysis.long_term_preventive_measures.length}`)

    // Calculate statistics
    const stats = {
      root_causes_count: analysis.root_causes.length,
      contributing_factors_count: analysis.contributing_factors.length,
      immediate_actions_count: analysis.immediate_corrective_actions.length,
      preventive_measures_count: analysis.long_term_preventive_measures.length,
      similar_incidents_found: analysis.similar_historical_incidents.length,
      immediate_priority_actions: analysis.immediate_corrective_actions.filter(
        a => a.priority === 'immediate'
      ).length,
      high_impact_factors: analysis.contributing_factors.filter(
        f => f.impact_level === 'high'
      ).length,
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        analysis: analysis,
        statistics: stats,
        input_summary: {
          incident_location,
          incident_date: displayDate,
          conditions_analyzed: incident_conditions.length,
          equipment_involved: equipment_involved.length,
          has_injury: !!injury_severity,
        },
        metadata: {
          model: 'claude-sonnet-4-5-20250929',
          tokens_used: claudeData.usage,
          generated_at: new Date().toISOString(),
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
