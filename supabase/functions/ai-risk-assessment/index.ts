// AI Risk Assessment Edge Function
// Generates structured SSM/PSI risk assessments using Claude API
// Analyzes hazards, probability, severity, and control measures

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface IdentifiedHazard {
  hazard_name: string
  hazard_description: string
  probability: 'rare' | 'unlikely' | 'possible' | 'likely' | 'certain'
  severity: 'negligible' | 'minor' | 'moderate' | 'major' | 'catastrophic'
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  control_measures: string[]
  legal_references?: string[]
}

interface RiskAssessment {
  summary: string
  hazards: IdentifiedHazard[]
  general_recommendations: string[]
}

interface RequestBody {
  industry: string
  job_positions: string[]
  location_type: string
  additional_context?: string
  max_tokens?: number
}

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_MAX_TOKENS = 4096

const RISK_ASSESSMENT_PROMPT = `You are a Romanian SSM/PSI (Occupational Health & Safety / Fire Safety) expert with deep knowledge of Romanian legislation and EU safety directives.

Generate a comprehensive risk assessment for the following workplace parameters.

**INPUT PARAMETERS:**
- Industry/Sector: {industry}
- Job Positions: {job_positions}
- Location Type: {location_type}
{additional_context}

**YOUR TASK:**
Identify all relevant workplace hazards and assess their risks following Romanian SSM/PSI methodology.

For each hazard, provide:
1. **hazard_name** - Short name (e.g., "Căzături de la înălțime", "Incendiu")
2. **hazard_description** - Detailed description in Romanian (what can happen, under what circumstances)
3. **probability** - Use EXACTLY one of: "rare", "unlikely", "possible", "likely", "certain"
   - rare: Once every 10+ years
   - unlikely: Once every 5-10 years
   - possible: Once every 1-5 years
   - likely: Multiple times per year
   - certain: Expected regularly
4. **severity** - Use EXACTLY one of: "negligible", "minor", "moderate", "major", "catastrophic"
   - negligible: Minor discomfort, no medical treatment
   - minor: First aid needed, no lost time
   - moderate: Medical treatment, temporary disability
   - major: Serious injury, permanent disability possible
   - catastrophic: Fatality or multiple serious injuries
5. **risk_level** - Use EXACTLY one of: "low", "medium", "high", "critical"
   - Calculate as: probability × severity (standard risk matrix)
6. **control_measures** - Array of specific, actionable prevention measures in Romanian (minimum 3)
7. **legal_references** - Array of relevant Romanian laws/norms (e.g., ["Legea 319/2006", "Norma PSI"]) - optional

Also provide:
- **summary** - Brief overview of the risk profile in Romanian (2-3 sentences)
- **general_recommendations** - Array of 3-5 overarching safety recommendations in Romanian

**IMPORTANT CONSIDERATIONS:**
- Follow Romanian SSM methodology (Legea 319/2006, HG 1425/2006)
- Follow PSI requirements (Legea 307/2006, Norma PSI)
- Consider specific industry risks
- Be thorough - identify ALL relevant hazards (minimum 5, typically 8-15)
- Focus on realistic, practical control measures
- Use Romanian terminology and language
- Consider both safety (SSM) and fire (PSI) hazards

Return ONLY a valid JSON object with this exact structure:
{
  "summary": "string",
  "hazards": [
    {
      "hazard_name": "string",
      "hazard_description": "string",
      "probability": "rare" | "unlikely" | "possible" | "likely" | "certain",
      "severity": "negligible" | "minor" | "moderate" | "major" | "catastrophic",
      "risk_level": "low" | "medium" | "high" | "critical",
      "control_measures": ["string", "string", ...],
      "legal_references": ["string", ...] // optional
    }
  ],
  "general_recommendations": ["string", "string", ...]
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
      industry,
      job_positions,
      location_type,
      additional_context = '',
      max_tokens = DEFAULT_MAX_TOKENS,
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
        JSON.stringify({ error: 'Missing or invalid job_positions parameter (must be non-empty array)' }),
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
    const jobPositionsStr = job_positions.join(', ')
    const additionalContextStr = additional_context
      ? `\n- Additional Context: ${additional_context}`
      : ''

    const fullPrompt = RISK_ASSESSMENT_PROMPT
      .replace('{industry}', industry)
      .replace('{job_positions}', jobPositionsStr)
      .replace('{location_type}', location_type)
      .replace('{additional_context}', additionalContextStr)

    // Call Claude API
    console.log('Calling Claude API for risk assessment...')
    console.log(`Parameters: industry=${industry}, positions=${jobPositionsStr}, location=${location_type}`)

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

    // Parse risk assessment
    let riskAssessment: RiskAssessment
    try {
      // Clean potential markdown code blocks
      const cleanedText = extractedText
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim()

      riskAssessment = JSON.parse(cleanedText)

      // Validate structure
      if (!riskAssessment.summary || !Array.isArray(riskAssessment.hazards) || !Array.isArray(riskAssessment.general_recommendations)) {
        throw new Error('Invalid risk assessment structure')
      }

      // Validate each hazard
      const validProbabilities = ['rare', 'unlikely', 'possible', 'likely', 'certain']
      const validSeverities = ['negligible', 'minor', 'moderate', 'major', 'catastrophic']
      const validRiskLevels = ['low', 'medium', 'high', 'critical']

      riskAssessment.hazards.forEach((hazard, index) => {
        if (!hazard.hazard_name || !hazard.hazard_description) {
          throw new Error(`Missing hazard name or description at index ${index}`)
        }
        if (!validProbabilities.includes(hazard.probability)) {
          throw new Error(`Invalid probability at index ${index}: ${hazard.probability}`)
        }
        if (!validSeverities.includes(hazard.severity)) {
          throw new Error(`Invalid severity at index ${index}: ${hazard.severity}`)
        }
        if (!validRiskLevels.includes(hazard.risk_level)) {
          throw new Error(`Invalid risk_level at index ${index}: ${hazard.risk_level}`)
        }
        if (!Array.isArray(hazard.control_measures) || hazard.control_measures.length === 0) {
          throw new Error(`Missing or invalid control_measures at index ${index}`)
        }
      })

      if (riskAssessment.hazards.length < 3) {
        console.warn('Warning: Less than 3 hazards identified, expected more comprehensive assessment')
      }

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

    console.log(`Successfully generated risk assessment with ${riskAssessment.hazards.length} hazards`)

    // Calculate risk statistics
    const riskStats = {
      total_hazards: riskAssessment.hazards.length,
      critical_risks: riskAssessment.hazards.filter(h => h.risk_level === 'critical').length,
      high_risks: riskAssessment.hazards.filter(h => h.risk_level === 'high').length,
      medium_risks: riskAssessment.hazards.filter(h => h.risk_level === 'medium').length,
      low_risks: riskAssessment.hazards.filter(h => h.risk_level === 'low').length,
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        assessment: riskAssessment,
        statistics: riskStats,
        input_parameters: {
          industry,
          job_positions,
          location_type,
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
