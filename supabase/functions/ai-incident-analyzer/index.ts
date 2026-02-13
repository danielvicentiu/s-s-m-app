// AI Incident Analyzer Edge Function
// Analyzes workplace incidents to identify root causes, contributing factors,
// and corrective/preventive measures using Claude API

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface RootCause {
  cause: string
  likelihood: 'primary' | 'secondary' | 'contributing'
  explanation: string
}

interface ContributingFactor {
  factor: string
  category: 'human' | 'technical' | 'organizational' | 'environmental'
  impact_level: 'high' | 'medium' | 'low'
}

interface CorrectiveAction {
  action: string
  priority: 'immediate' | 'urgent' | 'high' | 'medium'
  responsible_party: string
  estimated_timeframe: string
}

interface PreventiveMeasure {
  measure: string
  type: 'engineering' | 'administrative' | 'ppe' | 'training' | 'procedural'
  effectiveness: 'high' | 'medium' | 'low'
  implementation_cost: 'low' | 'medium' | 'high'
}

interface SimilarIncident {
  description: string
  common_factors: string[]
  lessons_learned: string
}

interface IncidentAnalysis {
  incident_summary: string
  severity_assessment: 'minor' | 'moderate' | 'serious' | 'critical' | 'catastrophic'
  root_causes: RootCause[]
  contributing_factors: ContributingFactor[]
  immediate_actions: CorrectiveAction[]
  preventive_measures: PreventiveMeasure[]
  similar_incidents: SimilarIncident[]
  legal_implications: string[]
  recommendations_summary: string
}

interface RequestBody {
  incident_description: string
  location: string
  conditions: string
  injuries?: string
  witnesses?: string
  additional_context?: string
  max_tokens?: number
}

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_MAX_TOKENS = 4096

const INCIDENT_ANALYSIS_PROMPT = `You are a Romanian SSM/PSI (Occupational Health & Safety / Fire Safety) expert specialized in incident investigation and root cause analysis.

Analyze the following workplace incident using established investigation methodologies (5 Whys, Fishbone, Swiss Cheese Model).

**INCIDENT DETAILS:**
- Description: {incident_description}
- Location: {location}
- Conditions: {conditions}
{injuries}
{witnesses}
{additional_context}

**YOUR TASK:**
Conduct a comprehensive incident analysis following Romanian SSM/PSI investigation standards (Legea 319/2006, Legea 307/2006).

Provide:

1. **incident_summary** - Brief professional summary of what happened (2-3 sentences in Romanian)

2. **severity_assessment** - Use EXACTLY one of: "minor", "moderate", "serious", "critical", "catastrophic"
   - minor: First aid only, no lost time
   - moderate: Medical treatment, temporary disability
   - serious: Hospitalization, significant injury
   - critical: Life-threatening, permanent disability
   - catastrophic: Fatality or multiple serious injuries

3. **root_causes** - Array of 2-5 identified root causes (not symptoms):
   {
     "cause": "string (in Romanian, specific and actionable)",
     "likelihood": "primary" | "secondary" | "contributing",
     "explanation": "string (why this is considered a root cause)"
   }

4. **contributing_factors** - Array of 3-8 factors that enabled the incident:
   {
     "factor": "string (in Romanian)",
     "category": "human" | "technical" | "organizational" | "environmental",
     "impact_level": "high" | "medium" | "low"
   }

5. **immediate_actions** - Array of 3-6 immediate corrective actions needed NOW:
   {
     "action": "string (specific, actionable in Romanian)",
     "priority": "immediate" | "urgent" | "high" | "medium",
     "responsible_party": "string (role/department)",
     "estimated_timeframe": "string (e.g., 'imediat', '24 ore', '1 săptămână')"
   }

6. **preventive_measures** - Array of 4-10 long-term preventive measures:
   {
     "measure": "string (specific prevention strategy in Romanian)",
     "type": "engineering" | "administrative" | "ppe" | "training" | "procedural",
     "effectiveness": "high" | "medium" | "low",
     "implementation_cost": "low" | "medium" | "high"
   }
   - Prioritize hierarchy of controls: engineering > administrative > PPE

7. **similar_incidents** - Array of 2-4 similar historical incidents (generic, industry-wide):
   {
     "description": "string (brief description in Romanian)",
     "common_factors": ["string", ...] (2-3 common factors),
     "lessons_learned": "string (key lesson from that incident)"
   }

8. **legal_implications** - Array of 2-5 relevant Romanian legal obligations/requirements:
   - Reference specific articles from Legea 319/2006, Legea 307/2006, HG 1425/2006, etc.
   - Include reporting requirements, investigation timelines, penalties if applicable

9. **recommendations_summary** - Executive summary for management (3-5 sentences in Romanian):
   - What went wrong, why, and what MUST change

**IMPORTANT GUIDELINES:**
- Be thorough and professional - this is a formal investigation
- Focus on systemic issues, not individual blame
- Root causes should be actionable and specific
- Use Romanian terminology and language throughout
- Consider both immediate causes and underlying organizational factors
- Reference Romanian SSM/PSI legislation where relevant
- Prioritize worker safety in all recommendations
- Be realistic about implementation costs and timeframes

Return ONLY a valid JSON object with this exact structure:
{
  "incident_summary": "string",
  "severity_assessment": "minor" | "moderate" | "serious" | "critical" | "catastrophic",
  "root_causes": [RootCause],
  "contributing_factors": [ContributingFactor],
  "immediate_actions": [CorrectiveAction],
  "preventive_measures": [PreventiveMeasure],
  "similar_incidents": [SimilarIncident],
  "legal_implications": ["string", ...],
  "recommendations_summary": "string"
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
      location,
      conditions,
      injuries = '',
      witnesses = '',
      additional_context = '',
      max_tokens = DEFAULT_MAX_TOKENS,
    } = body

    // Validate input
    if (!incident_description || typeof incident_description !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid incident_description parameter' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (incident_description.length < 20) {
      return new Response(
        JSON.stringify({ error: 'Incident description too short (minimum 20 characters)' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!location || typeof location !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid location parameter' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!conditions || typeof conditions !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid conditions parameter' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Validate max_tokens
    if (max_tokens < 100 || max_tokens > 8192) {
      return new Response(
        JSON.stringify({ error: 'max_tokens must be between 100 and 8192' }),
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

    // Construct full prompt
    const injuriesStr = injuries ? `\n- Injuries: ${injuries}` : ''
    const witnessesStr = witnesses ? `\n- Witnesses: ${witnesses}` : ''
    const additionalContextStr = additional_context
      ? `\n- Additional Context: ${additional_context}`
      : ''

    const fullPrompt = INCIDENT_ANALYSIS_PROMPT
      .replace('{incident_description}', incident_description)
      .replace('{location}', location)
      .replace('{conditions}', conditions)
      .replace('{injuries}', injuriesStr)
      .replace('{witnesses}', witnessesStr)
      .replace('{additional_context}', additionalContextStr)

    // Call Claude API
    console.log('Calling Claude API for incident analysis...')
    console.log(`Incident: ${incident_description.substring(0, 100)}...`)

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
      if (!analysis.incident_summary || !analysis.severity_assessment) {
        throw new Error('Missing incident_summary or severity_assessment')
      }

      if (!Array.isArray(analysis.root_causes) || analysis.root_causes.length === 0) {
        throw new Error('Missing or invalid root_causes')
      }

      if (!Array.isArray(analysis.contributing_factors) || analysis.contributing_factors.length === 0) {
        throw new Error('Missing or invalid contributing_factors')
      }

      if (!Array.isArray(analysis.immediate_actions) || analysis.immediate_actions.length === 0) {
        throw new Error('Missing or invalid immediate_actions')
      }

      if (!Array.isArray(analysis.preventive_measures) || analysis.preventive_measures.length === 0) {
        throw new Error('Missing or invalid preventive_measures')
      }

      if (!Array.isArray(analysis.similar_incidents)) {
        throw new Error('Missing or invalid similar_incidents')
      }

      if (!Array.isArray(analysis.legal_implications)) {
        throw new Error('Missing or invalid legal_implications')
      }

      if (!analysis.recommendations_summary) {
        throw new Error('Missing recommendations_summary')
      }

      // Validate severity assessment
      const validSeverities = ['minor', 'moderate', 'serious', 'critical', 'catastrophic']
      if (!validSeverities.includes(analysis.severity_assessment)) {
        throw new Error(`Invalid severity_assessment: ${analysis.severity_assessment}`)
      }

      // Validate root causes
      const validLikelihoods = ['primary', 'secondary', 'contributing']
      analysis.root_causes.forEach((cause, index) => {
        if (!cause.cause || !cause.likelihood || !cause.explanation) {
          throw new Error(`Invalid root cause structure at index ${index}`)
        }
        if (!validLikelihoods.includes(cause.likelihood)) {
          throw new Error(`Invalid likelihood at root cause ${index}: ${cause.likelihood}`)
        }
      })

      // Validate contributing factors
      const validCategories = ['human', 'technical', 'organizational', 'environmental']
      const validImpactLevels = ['high', 'medium', 'low']
      analysis.contributing_factors.forEach((factor, index) => {
        if (!factor.factor || !factor.category || !factor.impact_level) {
          throw new Error(`Invalid contributing factor structure at index ${index}`)
        }
        if (!validCategories.includes(factor.category)) {
          throw new Error(`Invalid category at factor ${index}: ${factor.category}`)
        }
        if (!validImpactLevels.includes(factor.impact_level)) {
          throw new Error(`Invalid impact_level at factor ${index}: ${factor.impact_level}`)
        }
      })

      // Validate immediate actions
      const validPriorities = ['immediate', 'urgent', 'high', 'medium']
      analysis.immediate_actions.forEach((action, index) => {
        if (!action.action || !action.priority || !action.responsible_party || !action.estimated_timeframe) {
          throw new Error(`Invalid immediate action structure at index ${index}`)
        }
        if (!validPriorities.includes(action.priority)) {
          throw new Error(`Invalid priority at action ${index}: ${action.priority}`)
        }
      })

      // Validate preventive measures
      const validTypes = ['engineering', 'administrative', 'ppe', 'training', 'procedural']
      const validEffectiveness = ['high', 'medium', 'low']
      const validCosts = ['low', 'medium', 'high']
      analysis.preventive_measures.forEach((measure, index) => {
        if (!measure.measure || !measure.type || !measure.effectiveness || !measure.implementation_cost) {
          throw new Error(`Invalid preventive measure structure at index ${index}`)
        }
        if (!validTypes.includes(measure.type)) {
          throw new Error(`Invalid type at measure ${index}: ${measure.type}`)
        }
        if (!validEffectiveness.includes(measure.effectiveness)) {
          throw new Error(`Invalid effectiveness at measure ${index}: ${measure.effectiveness}`)
        }
        if (!validCosts.includes(measure.implementation_cost)) {
          throw new Error(`Invalid implementation_cost at measure ${index}: ${measure.implementation_cost}`)
        }
      })

      // Validate similar incidents
      analysis.similar_incidents.forEach((incident, index) => {
        if (!incident.description || !Array.isArray(incident.common_factors) || !incident.lessons_learned) {
          throw new Error(`Invalid similar incident structure at index ${index}`)
        }
      })

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

    console.log(`Successfully analyzed incident with severity: ${analysis.severity_assessment}`)
    console.log(`Identified ${analysis.root_causes.length} root causes, ${analysis.immediate_actions.length} immediate actions, ${analysis.preventive_measures.length} preventive measures`)

    // Calculate analysis statistics
    const statistics = {
      root_causes_count: analysis.root_causes.length,
      primary_causes: analysis.root_causes.filter(c => c.likelihood === 'primary').length,
      contributing_factors_count: analysis.contributing_factors.length,
      high_impact_factors: analysis.contributing_factors.filter(f => f.impact_level === 'high').length,
      immediate_actions_count: analysis.immediate_actions.length,
      urgent_actions: analysis.immediate_actions.filter(a => a.priority === 'immediate' || a.priority === 'urgent').length,
      preventive_measures_count: analysis.preventive_measures.length,
      high_effectiveness_measures: analysis.preventive_measures.filter(m => m.effectiveness === 'high').length,
      similar_incidents_found: analysis.similar_incidents.length,
      legal_references_count: analysis.legal_implications.length,
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        analysis: analysis,
        statistics: statistics,
        input_parameters: {
          location,
          conditions,
          has_injuries: !!injuries,
          has_witnesses: !!witnesses,
        },
        metadata: {
          model: 'claude-sonnet-4-5-20250929',
          tokens_used: claudeData.usage,
          analyzed_at: new Date().toISOString(),
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
