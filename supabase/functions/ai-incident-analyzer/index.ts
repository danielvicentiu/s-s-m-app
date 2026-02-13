// AI Incident Analyzer Edge Function
// Analyzes workplace incidents using Claude API
// Provides root cause analysis, contributing factors, and corrective/preventive actions

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface IncidentAnalysis {
  incident_summary: string
  severity_assessment: {
    level: 'low' | 'medium' | 'high' | 'critical'
    reasoning: string
  }
  root_causes: {
    primary: string[]
    secondary: string[]
  }
  contributing_factors: {
    human_factors: string[]
    organizational_factors: string[]
    environmental_factors: string[]
    equipment_factors: string[]
  }
  immediate_actions: {
    priority: 'immediate' | 'urgent' | 'standard'
    action: string
    responsible_party: string
    timeline: string
  }[]
  corrective_measures: {
    short_term: {
      measure: string
      timeline: string
      resources_needed: string
    }[]
    long_term: {
      measure: string
      timeline: string
      resources_needed: string
    }[]
  }
  preventive_measures: {
    technical_controls: string[]
    administrative_controls: string[]
    ppe_requirements: string[]
    training_recommendations: string[]
  }
  similar_incidents: {
    description: string
    lessons_learned: string
    prevention_method: string
  }[]
  compliance_implications: {
    legislation_references: string[]
    potential_violations: string[]
    reporting_requirements: string[]
  }
  recommendations_priority: {
    critical: string[]
    high: string[]
    medium: string[]
    low: string[]
  }
}

interface RequestBody {
  incident_description: string
  location?: string
  conditions?: string
  industry?: string
  locale?: string
  max_tokens?: number
}

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_MAX_TOKENS = 8192
const SUPPORTED_LOCALES = ['ro', 'en', 'bg', 'hu', 'de']

const LOCALE_INSTRUCTIONS = {
  ro: {
    language: 'Romanian',
    region: 'Romania',
    legislation: 'Romanian SSM/PSI legislation (Legea 319/2006, Legea 307/2006, Normele metodologice)',
    regulatory_body: 'Inspectoratul Teritorial de Muncă (ITM)',
  },
  en: {
    language: 'English',
    region: 'European Union',
    legislation: 'EU OSH Framework Directive 89/391/EEC and relevant directives',
    regulatory_body: 'National Labour Inspectorate / HSE',
  },
  bg: {
    language: 'Bulgarian',
    region: 'Bulgaria',
    legislation: 'Bulgarian OHS legislation (Закон за здравословни и безопасни условия на труд)',
    regulatory_body: 'Executive Agency "General Labor Inspectorate"',
  },
  hu: {
    language: 'Hungarian',
    region: 'Hungary',
    legislation: 'Hungarian OHS legislation (1993. évi XCIII. törvény)',
    regulatory_body: 'Országos Munkavédelmi és Munkaügyi Főfelügyelőség',
  },
  de: {
    language: 'German',
    region: 'Germany',
    legislation: 'German OHS legislation (Arbeitsschutzgesetz - ArbSchG, DGUV Vorschriften)',
    regulatory_body: 'Gewerbeaufsichtsamt / Berufsgenossenschaft',
  },
}

function buildIncidentAnalysisPrompt(
  incidentDescription: string,
  location: string,
  conditions: string,
  industry: string,
  locale: string
): string {
  const localeInfo = LOCALE_INSTRUCTIONS[locale as keyof typeof LOCALE_INSTRUCTIONS] || LOCALE_INSTRUCTIONS.ro

  return `You are a senior SSM/PSI (Occupational Health & Safety / Fire Safety) investigator with 25+ years of experience in incident analysis and root cause investigation. You specialize in workplace safety across multiple industries.

**INCIDENT DETAILS:**
- **Description**: ${incidentDescription}
- **Location**: ${location || 'Not specified'}
- **Conditions**: ${conditions || 'Not specified'}
- **Industry**: ${industry || 'General'}
- **Language**: ${localeInfo.language}
- **Applicable Legislation**: ${localeInfo.legislation}
- **Region**: ${localeInfo.region}
- **Regulatory Body**: ${localeInfo.regulatory_body}

**YOUR TASK:**
Perform a comprehensive incident analysis following industry best practices (including ILO guidelines, Heinrich Pyramid, Swiss Cheese Model, and 5 Whys methodology).

Provide a detailed analysis in ${localeInfo.language} with the following structure:

1. **incident_summary** - Clear, objective summary of the incident (2-3 sentences in ${localeInfo.language})

2. **severity_assessment** - Assess the severity:
   - **level**: 'low' | 'medium' | 'high' | 'critical' (based on actual/potential consequences)
   - **reasoning**: Explain why this severity level was assigned (in ${localeInfo.language})

3. **root_causes** - Identify root causes using 5 Whys methodology:
   - **primary**: Array of 2-4 primary root causes (fundamental issues that directly led to incident)
   - **secondary**: Array of 2-4 secondary root causes (underlying systemic issues)
   All in ${localeInfo.language}

4. **contributing_factors** - Categorize contributing factors (Swiss Cheese Model):
   - **human_factors**: Human error, fatigue, lack of awareness (2-4 items)
   - **organizational_factors**: Procedures, policies, safety culture (2-4 items)
   - **environmental_factors**: Weather, lighting, noise, workspace layout (1-3 items)
   - **equipment_factors**: Tools, machinery, PPE issues (1-3 items)
   All in ${localeInfo.language}

5. **immediate_actions** - Array of 3-5 immediate actions taken or required:
   Each action should have:
   - **priority**: 'immediate' (within 1 hour) | 'urgent' (within 24h) | 'standard' (within 1 week)
   - **action**: What must be done (in ${localeInfo.language})
   - **responsible_party**: Who should execute this (role, not name)
   - **timeline**: Specific timeframe

6. **corrective_measures** - Corrective actions to address this specific incident:
   - **short_term**: Array of 3-5 short-term corrective measures (1-4 weeks):
     - **measure**: Description in ${localeInfo.language}
     - **timeline**: Specific timeframe
     - **resources_needed**: Personnel, budget, equipment needed
   - **long_term**: Array of 2-4 long-term corrective measures (1-6 months):
     - Same structure as short_term

7. **preventive_measures** - Preventive measures to avoid similar incidents (hierarchy of controls):
   - **technical_controls**: Engineering controls, equipment modifications (3-5 items in ${localeInfo.language})
   - **administrative_controls**: Procedures, policies, work permits (3-5 items in ${localeInfo.language})
   - **ppe_requirements**: Personal protective equipment recommendations (2-4 items in ${localeInfo.language})
   - **training_recommendations**: Training programs needed (2-4 items in ${localeInfo.language})

8. **similar_incidents** - Array of 2-4 similar historical incidents:
   Each incident:
   - **description**: Brief description of similar incident (in ${localeInfo.language})
   - **lessons_learned**: Key lessons from that incident (in ${localeInfo.language})
   - **prevention_method**: How it was prevented from recurring (in ${localeInfo.language})

9. **compliance_implications** - Legal and regulatory considerations:
   - **legislation_references**: Array of 3-5 specific articles/regulations from ${localeInfo.legislation} that apply
   - **potential_violations**: Array of 1-3 potential legal violations (in ${localeInfo.language})
   - **reporting_requirements**: Array of 2-4 mandatory reporting obligations to ${localeInfo.regulatory_body} (in ${localeInfo.language})

10. **recommendations_priority** - All recommendations organized by priority:
    - **critical**: Array of must-do actions (immediate safety concerns)
    - **high**: Array of should-do actions (significant risk reduction)
    - **medium**: Array of recommended actions (risk mitigation)
    - **low**: Array of optional improvements (best practices)
    All in ${localeInfo.language}

**IMPORTANT REQUIREMENTS:**
- ALL content must be in ${localeInfo.language}
- Be specific and actionable - avoid generic statements
- Reference specific ${localeInfo.legislation} articles where applicable
- Consider industry-specific risks for ${industry}
- Use technical SSM/PSI terminology correctly
- Base analysis on established investigation methodologies
- Prioritize employee safety above all else
- Include both immediate and systemic recommendations
- Reference similar real-world incidents when relevant
- Ensure all timelines are realistic and achievable

Return ONLY a valid JSON object matching this exact structure. No markdown code blocks, no explanations.

{
  "incident_summary": "string",
  "severity_assessment": {
    "level": "low" | "medium" | "high" | "critical",
    "reasoning": "string"
  },
  "root_causes": {
    "primary": ["string"],
    "secondary": ["string"]
  },
  "contributing_factors": {
    "human_factors": ["string"],
    "organizational_factors": ["string"],
    "environmental_factors": ["string"],
    "equipment_factors": ["string"]
  },
  "immediate_actions": [
    {
      "priority": "immediate" | "urgent" | "standard",
      "action": "string",
      "responsible_party": "string",
      "timeline": "string"
    }
  ],
  "corrective_measures": {
    "short_term": [
      {
        "measure": "string",
        "timeline": "string",
        "resources_needed": "string"
      }
    ],
    "long_term": [
      {
        "measure": "string",
        "timeline": "string",
        "resources_needed": "string"
      }
    ]
  },
  "preventive_measures": {
    "technical_controls": ["string"],
    "administrative_controls": ["string"],
    "ppe_requirements": ["string"],
    "training_recommendations": ["string"]
  },
  "similar_incidents": [
    {
      "description": "string",
      "lessons_learned": "string",
      "prevention_method": "string"
    }
  ],
  "compliance_implications": {
    "legislation_references": ["string"],
    "potential_violations": ["string"],
    "reporting_requirements": ["string"]
  },
  "recommendations_priority": {
    "critical": ["string"],
    "high": ["string"],
    "medium": ["string"],
    "low": ["string"]
  }
}

Return ONLY the JSON object.`
}

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
      location = 'Locație nespecificată',
      conditions = 'Condiții nespecificate',
      industry = 'General',
      locale = 'ro',
      max_tokens = DEFAULT_MAX_TOKENS
    } = body

    // Validate incident_description
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
        JSON.stringify({ error: 'incident_description too short (minimum 20 characters)' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (incident_description.length > 10000) {
      return new Response(
        JSON.stringify({ error: 'incident_description too long (maximum 10000 characters)' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Validate locale
    const normalizedLocale = locale.toLowerCase()
    if (!SUPPORTED_LOCALES.includes(normalizedLocale)) {
      return new Response(
        JSON.stringify({
          error: `Unsupported locale: ${locale}. Supported: ${SUPPORTED_LOCALES.join(', ')}`
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Validate max_tokens
    if (max_tokens < 2000 || max_tokens > 16384) {
      return new Response(
        JSON.stringify({ error: 'max_tokens must be between 2000 and 16384' }),
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

    // Build prompt
    const prompt = buildIncidentAnalysisPrompt(
      incident_description,
      location,
      conditions,
      industry,
      normalizedLocale
    )

    // Call Claude API
    console.log(`Analyzing incident: ${incident_description.substring(0, 100)}... (${normalizedLocale})`)
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
            content: prompt,
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
    const generatedText = claudeData.content?.[0]?.text

    if (!generatedText) {
      console.error('No text in Claude response:', claudeData)
      return new Response(
        JSON.stringify({ error: 'No response from AI service' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Parse generated incident analysis
    let incidentAnalysis: IncidentAnalysis
    try {
      // Clean potential markdown code blocks
      const cleanedText = generatedText
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim()

      incidentAnalysis = JSON.parse(cleanedText)

      // Validate structure
      if (!incidentAnalysis.incident_summary || !incidentAnalysis.severity_assessment) {
        throw new Error('Invalid analysis structure: missing incident_summary or severity_assessment')
      }

      if (!incidentAnalysis.root_causes || !Array.isArray(incidentAnalysis.root_causes.primary)) {
        throw new Error('Invalid analysis structure: root_causes must contain primary array')
      }

      if (!incidentAnalysis.contributing_factors) {
        throw new Error('Invalid analysis structure: missing contributing_factors')
      }

      if (!Array.isArray(incidentAnalysis.immediate_actions)) {
        throw new Error('Invalid analysis structure: immediate_actions must be an array')
      }

      if (!incidentAnalysis.corrective_measures?.short_term || !incidentAnalysis.corrective_measures?.long_term) {
        throw new Error('Invalid analysis structure: corrective_measures must have short_term and long_term arrays')
      }

      if (!incidentAnalysis.preventive_measures) {
        throw new Error('Invalid analysis structure: missing preventive_measures')
      }

      if (!Array.isArray(incidentAnalysis.similar_incidents)) {
        throw new Error('Invalid analysis structure: similar_incidents must be an array')
      }

      if (!incidentAnalysis.compliance_implications) {
        throw new Error('Invalid analysis structure: missing compliance_implications')
      }

      if (!incidentAnalysis.recommendations_priority) {
        throw new Error('Invalid analysis structure: missing recommendations_priority')
      }

      // Validate severity level
      const validSeverityLevels = ['low', 'medium', 'high', 'critical']
      if (!validSeverityLevels.includes(incidentAnalysis.severity_assessment.level)) {
        throw new Error(`Invalid severity level: ${incidentAnalysis.severity_assessment.level}`)
      }

      // Validate immediate actions priorities
      incidentAnalysis.immediate_actions.forEach((action, index) => {
        const validPriorities = ['immediate', 'urgent', 'standard']
        if (!validPriorities.includes(action.priority)) {
          throw new Error(`Invalid priority at immediate_actions[${index}]: ${action.priority}`)
        }
      })

    } catch (parseError) {
      console.error('Failed to parse incident analysis:', parseError)
      console.error('Raw response:', generatedText)
      return new Response(
        JSON.stringify({
          error: 'Failed to parse AI response',
          message: parseError instanceof Error ? parseError.message : 'Unknown parsing error',
          raw_response: generatedText.substring(0, 500),
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    console.log(`Successfully analyzed incident with ${incidentAnalysis.immediate_actions.length} immediate actions and ${incidentAnalysis.similar_incidents.length} similar incidents`)

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        analysis: incidentAnalysis,
        metadata: {
          incident_description: incident_description.substring(0, 200),
          location,
          conditions,
          industry,
          locale: normalizedLocale,
          severity: incidentAnalysis.severity_assessment.level,
          immediate_actions_count: incidentAnalysis.immediate_actions.length,
          similar_incidents_count: incidentAnalysis.similar_incidents.length,
          model: 'claude-sonnet-4-5-20250929',
          tokens_used: claudeData.usage,
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
