// AI Risk Assessment Edge Function
// Generates structured SSM/PSI risk assessments using Claude API
// Based on industry, job positions, and location type

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface Hazard {
  id: string
  name: string
  description: string
  category: 'physical' | 'chemical' | 'biological' | 'ergonomic' | 'psychosocial' | 'fire'
  affected_positions: string[]
  probability: 1 | 2 | 3 | 4 | 5 // 1=foarte redusă, 5=foarte mare
  severity: 1 | 2 | 3 | 4 | 5 // 1=neglijabilă, 5=catastrofală
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  control_measures: ControlMeasure[]
}

interface ControlMeasure {
  type: 'elimination' | 'substitution' | 'engineering' | 'administrative' | 'ppe'
  description: string
  priority: 'high' | 'medium' | 'low'
  responsible: string
  deadline_suggestion: string
}

interface RequestBody {
  industry: string // e.g., "fabricatie", "constructii", "retail", "IT"
  job_positions: string[] // e.g., ["sudor", "manager", "operator masina"]
  location_type: string // e.g., "interior", "exterior", "mixt", "santier"
  specific_context?: string // optional additional context
  language?: 'ro' | 'en' | 'bg' | 'hu' | 'de' // default: ro
}

interface RiskAssessmentResponse {
  success: true
  assessment: {
    industry: string
    job_positions: string[]
    location_type: string
    hazards: Hazard[]
    summary: {
      total_hazards: number
      critical_risks: number
      high_risks: number
      medium_risks: number
      low_risks: number
    }
  }
  metadata: {
    model: string
    tokens_used: any
    generated_at: string
  }
}

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_MAX_TOKENS = 8192

const RISK_ASSESSMENT_PROMPT = `You are a Romanian SSM/PSI (Occupational Health & Safety / Fire Safety) expert conducting a professional risk assessment.

Based on the provided industry, job positions, and location type, generate a comprehensive risk assessment following Romanian SSM legislation (Legea 319/2006).

**Input Information:**
- Industry: {industry}
- Job Positions: {job_positions}
- Location Type: {location_type}
{specific_context}

**Your Task:**
Identify ALL relevant hazards for these job positions in this industry and location. For each hazard, provide:

1. **id** - Unique identifier (e.g., "HAZ-001", "HAZ-002")
2. **name** - Short hazard name in {language} (e.g., "Zgomot excesiv", "Cădere de la înălțime")
3. **description** - Detailed description of the hazard and how exposure occurs (150-300 characters)
4. **category** - One of: "physical", "chemical", "biological", "ergonomic", "psychosocial", "fire"
5. **affected_positions** - Array of job positions affected (from the input list)
6. **probability** - Likelihood of occurrence (1-5):
   - 1 = foarte redusă (very low, once per 10+ years)
   - 2 = redusă (low, once per 5-10 years)
   - 3 = medie (medium, once per 1-5 years)
   - 4 = mare (high, multiple times per year)
   - 5 = foarte mare (very high, daily/weekly)
7. **severity** - Impact if hazard occurs (1-5):
   - 1 = neglijabilă (negligible, no injury)
   - 2 = mică (minor, first aid)
   - 3 = medie (moderate, medical treatment)
   - 4 = mare (major, hospitalization)
   - 5 = catastrofală (catastrophic, death/permanent disability)
8. **risk_level** - Calculate using probability × severity:
   - 1-4: "low"
   - 5-9: "medium"
   - 10-15: "high"
   - 16-25: "critical"
9. **control_measures** - Array of specific control measures following hierarchy:
   - Each measure has:
     - **type**: "elimination", "substitution", "engineering", "administrative", "ppe"
     - **description**: Specific action in {language} (e.g., "Instalare panouri fonoabsorbante")
     - **priority**: "high" (critical/high risks), "medium" (medium risks), "low" (low risks)
     - **responsible**: Role responsible (e.g., "Manager SSM", "Șef șantier", "Director executiv")
     - **deadline_suggestion**: Timeframe (e.g., "imediat", "30 zile", "90 zile", "anual")

**Important Guidelines:**
- Be comprehensive: include physical, chemical, biological, ergonomic, psychosocial, and fire hazards
- Be specific to the industry and job positions provided
- Use Romanian SSM terminology and standards
- Follow the hierarchy of controls (elimination > substitution > engineering > administrative > PPE)
- Prioritize high-severity and high-probability risks
- Provide practical, actionable control measures
- Consider both routine and non-routine operations
- Include emergency scenarios (fire, medical emergency, accidents)

**Output Format:**
Return ONLY a valid JSON object with this exact structure:
{
  "hazards": [
    {
      "id": "HAZ-001",
      "name": "string",
      "description": "string",
      "category": "physical|chemical|biological|ergonomic|psychosocial|fire",
      "affected_positions": ["string"],
      "probability": 1-5,
      "severity": 1-5,
      "risk_level": "low|medium|high|critical",
      "control_measures": [
        {
          "type": "elimination|substitution|engineering|administrative|ppe",
          "description": "string",
          "priority": "high|medium|low",
          "responsible": "string",
          "deadline_suggestion": "string"
        }
      ]
    }
  ]
}

Return ONLY the JSON, no explanations or markdown code blocks.`

const LANGUAGE_NAMES: Record<string, string> = {
  ro: 'Romanian',
  en: 'English',
  bg: 'Bulgarian',
  hu: 'Hungarian',
  de: 'German',
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
      industry,
      job_positions,
      location_type,
      specific_context = '',
      language = 'ro',
    } = body

    // Validate input
    if (!industry || typeof industry !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid industry parameter' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!Array.isArray(job_positions) || job_positions.length === 0) {
      return new Response(
        JSON.stringify({ error: 'job_positions must be a non-empty array' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!location_type || typeof location_type !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid location_type parameter' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!['ro', 'en', 'bg', 'hu', 'de'].includes(language)) {
      return new Response(
        JSON.stringify({ error: 'language must be one of: ro, en, bg, hu, de' }),
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
    const contextSection = specific_context
      ? `- Specific Context: ${specific_context}`
      : ''

    const fullPrompt = RISK_ASSESSMENT_PROMPT
      .replace('{industry}', industry)
      .replace('{job_positions}', job_positions.join(', '))
      .replace('{location_type}', location_type)
      .replace('{specific_context}', contextSection)
      .replace(/{language}/g, LANGUAGE_NAMES[language])

    // Call Claude API
    console.log(
      `Generating risk assessment for industry: ${industry}, positions: ${job_positions.join(', ')}`
    )
    const claudeResponse = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: DEFAULT_MAX_TOKENS,
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

    // Parse risk assessment
    let hazards: Hazard[]
    try {
      // Clean potential markdown code blocks
      const cleanedText = extractedText
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim()

      const parsedData = JSON.parse(cleanedText)
      hazards = parsedData.hazards

      // Validate structure
      if (!Array.isArray(hazards)) {
        throw new Error('hazards is not an array')
      }

      // Validate each hazard
      hazards.forEach((hazard, index) => {
        if (
          !hazard.id ||
          !hazard.name ||
          !hazard.description ||
          !hazard.category ||
          !Array.isArray(hazard.affected_positions) ||
          typeof hazard.probability !== 'number' ||
          typeof hazard.severity !== 'number' ||
          !hazard.risk_level ||
          !Array.isArray(hazard.control_measures)
        ) {
          throw new Error(`Invalid hazard structure at index ${index}`)
        }

        // Validate probability and severity ranges
        if (hazard.probability < 1 || hazard.probability > 5) {
          throw new Error(`Invalid probability value at index ${index}`)
        }
        if (hazard.severity < 1 || hazard.severity > 5) {
          throw new Error(`Invalid severity value at index ${index}`)
        }

        // Validate risk_level calculation
        const riskScore = hazard.probability * hazard.severity
        const expectedRiskLevel =
          riskScore <= 4
            ? 'low'
            : riskScore <= 9
            ? 'medium'
            : riskScore <= 15
            ? 'high'
            : 'critical'

        if (hazard.risk_level !== expectedRiskLevel) {
          console.warn(
            `Risk level mismatch at index ${index}: expected ${expectedRiskLevel}, got ${hazard.risk_level}`
          )
          // Auto-correct risk level
          hazard.risk_level = expectedRiskLevel
        }

        // Validate control measures
        hazard.control_measures.forEach((measure, mIndex) => {
          if (!measure.type || !measure.description || !measure.priority) {
            throw new Error(
              `Invalid control measure at hazard ${index}, measure ${mIndex}`
            )
          }
        })
      })
    } catch (parseError) {
      console.error('Failed to parse risk assessment:', parseError)
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

    // Calculate summary statistics
    const summary = {
      total_hazards: hazards.length,
      critical_risks: hazards.filter((h) => h.risk_level === 'critical').length,
      high_risks: hazards.filter((h) => h.risk_level === 'high').length,
      medium_risks: hazards.filter((h) => h.risk_level === 'medium').length,
      low_risks: hazards.filter((h) => h.risk_level === 'low').length,
    }

    console.log(
      `Successfully generated risk assessment: ${summary.total_hazards} hazards (${summary.critical_risks} critical, ${summary.high_risks} high)`
    )

    // Return success response
    const response: RiskAssessmentResponse = {
      success: true,
      assessment: {
        industry,
        job_positions,
        location_type,
        hazards,
        summary,
      },
      metadata: {
        model: 'claude-sonnet-4-5-20250929',
        tokens_used: claudeData.usage,
        generated_at: new Date().toISOString(),
      },
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
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
