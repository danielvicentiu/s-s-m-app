// AI Risk Assessment Edge Function
// Generates comprehensive SSM/PSI risk assessments based on industry, job positions, and location type
// Uses Claude API to identify hazards, assess probability/severity, and recommend control measures

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface JobPosition {
  title: string // e.g., "Operator CNC", "Electrician", "Sudor"
  count: number // Number of employees in this position
  description?: string // Optional details about the role
}

interface ControlMeasure {
  type: 'elimination' | 'substitution' | 'engineering' | 'administrative' | 'ppe' // Hierarchy of controls
  description: string
  implementation_priority: 'immediate' | 'short_term' | 'long_term'
  estimated_cost: string // e.g., "500-1000 RON", "cost minim", "2000-5000 RON"
  legal_requirement: boolean // Is this legally mandated?
}

interface IdentifiedHazard {
  hazard_name: string // e.g., "Expunere zgomot", "Risc cadere de la inaltime", "Substante chimice"
  hazard_category: string // e.g., "Fizic", "Mecanic", "Chimic", "Biologic", "Ergonomic", "Psihosocial"
  affected_positions: string[] // Which job positions are affected
  hazard_description: string // Detailed description in Romanian
  probability: 1 | 2 | 3 | 4 | 5 // 1=foarte rara, 2=rara, 3=posibila, 4=probabila, 5=foarte probabila
  severity: 1 | 2 | 3 | 4 | 5 // 1=neglijabila, 2=mica, 3=medie, 4=mare, 5=catastrofala
  risk_level: 'trivial' | 'acceptable' | 'moderate' | 'substantial' | 'intolerable' // Calculated from P×S
  risk_score: number // Numerical score (P × S)
  control_measures: ControlMeasure[]
  legal_references: string[] // Relevant Romanian laws/norms
}

interface RiskAssessmentSummary {
  total_hazards: number
  intolerable_risks: number
  substantial_risks: number
  moderate_risks: number
  acceptable_risks: number
  trivial_risks: number
  priority_actions: string[] // Top 3-5 immediate actions needed
  estimated_total_cost: string // Overall cost range to address all risks
}

interface RiskAssessment {
  organization_profile: {
    industry: string
    location_type: string
    total_positions: number
    total_employees: number
  }
  identified_hazards: IdentifiedHazard[]
  summary: RiskAssessmentSummary
  general_recommendations: string[] // Overall safety recommendations
  legal_compliance_notes: string // Key legal requirements to follow
}

interface RequestBody {
  industry: string // e.g., "fabricatie metalurgica", "constructii", "horeca"
  job_positions: JobPosition[]
  location_type: string // e.g., "fabrica", "santier", "birou", "depozit"
  organization_size?: number // Total employee count
  additional_context?: string // Special conditions, equipment used, etc.
  max_tokens?: number
}

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_MAX_TOKENS = 8192

const RISK_ASSESSMENT_PROMPT = `You are a senior Romanian SSM/PSI (Occupational Health & Safety / Fire Safety) risk assessment expert with 20+ years of experience.

Generate a comprehensive workplace risk assessment based on the following information:

**ORGANIZATION PROFILE:**
- Industry: {industry}
- Location Type: {location_type}
- Total Employees: {organization_size}

**JOB POSITIONS:**
{job_positions}

{additional_context}

**YOUR TASK:**
Conduct a thorough risk assessment following Romanian legislation (Legea 319/2006, HG 1425/2006) and international standards (ISO 45001).

**RISK ASSESSMENT METHODOLOGY:**
- Probability Scale: 1=foarte rară (<5% șansă), 2=rară (5-25%), 3=posibilă (25-50%), 4=probabilă (50-75%), 5=foarte probabilă (>75%)
- Severity Scale: 1=neglijabilă (fără răniți), 2=mică (îngrijiri medicale), 3=medie (incapacitate <3 zile), 4=mare (incapacitate >3 zile), 5=catastrofală (deces/invaliditate)
- Risk Score: probability × severity (1-25)
- Risk Levels:
  - 1-3: trivial (risc neglijabil, nu necesită măsuri suplimentare)
  - 4-6: acceptable (risc acceptabil cu monitorizare)
  - 8-12: moderate (risc moderat, necesită măsuri în 3-6 luni)
  - 15-16: substantial (risc substanțial, necesită măsuri în 1-3 luni)
  - 20-25: intolerable (risc intolerabil, STOP activitate până la măsuri)

**HIERARCHY OF CONTROLS (in priority order):**
1. **elimination** - Eliminate hazard completely
2. **substitution** - Replace with less dangerous alternative
3. **engineering** - Engineering controls (guards, ventilation, isolation)
4. **administrative** - Procedures, training, signage, rotation
5. **ppe** - Personal Protective Equipment (last resort)

For each identified hazard, provide:
1. **hazard_name** - Short name (e.g., "Zgomot excesiv", "Risc electrocutare")
2. **hazard_category** - Category: "Fizic", "Mecanic", "Chimic", "Biologic", "Ergonomic", "Psihosocial", "Incendiu"
3. **affected_positions** - Array of job position titles affected
4. **hazard_description** - Detailed description in Romanian (2-3 sentences)
5. **probability** - 1-5 rating
6. **severity** - 1-5 rating
7. **risk_level** - Calculated level: "trivial", "acceptable", "moderate", "substantial", "intolerable"
8. **risk_score** - Numerical score (probability × severity)
9. **control_measures** - Array of specific control measures:
   - **type** - Control type (elimination/substitution/engineering/administrative/ppe)
   - **description** - Clear description in Romanian
   - **implementation_priority** - "immediate" (0-1 lună), "short_term" (1-6 luni), "long_term" (>6 luni)
   - **estimated_cost** - Cost range in RON or description (e.g., "500-1000 RON", "cost minim", "10.000-20.000 RON")
   - **legal_requirement** - true if legally mandated, false if recommended
10. **legal_references** - Array of relevant Romanian laws (e.g., ["Legea 319/2006", "HG 1425/2006", "Norma 16/1998"])

Provide summary with:
- **total_hazards** - Total number of hazards identified
- **intolerable_risks** - Count of intolerable risks (20-25)
- **substantial_risks** - Count of substantial risks (15-16)
- **moderate_risks** - Count of moderate risks (8-12)
- **acceptable_risks** - Count of acceptable risks (4-6)
- **trivial_risks** - Count of trivial risks (1-3)
- **priority_actions** - Array of top 3-5 immediate actions needed (in Romanian)
- **estimated_total_cost** - Overall cost range to implement all controls (e.g., "15.000-30.000 RON")

Include:
- **general_recommendations** - Array of 3-5 overall safety recommendations
- **legal_compliance_notes** - Brief paragraph on key legal requirements (in Romanian)

**IMPORTANT CONSIDERATIONS:**
- Be thorough and identify ALL relevant hazards for the industry and positions
- Consider both SSM (safety/health) and PSI (fire) hazards
- Prioritize legally required control measures
- Be realistic with probability/severity ratings based on industry statistics
- Consider common Romanian workplace conditions
- Follow hierarchy of controls strictly
- Provide practical, actionable control measures
- Include specific cost estimates when possible
- Reference relevant Romanian legislation
- Use clear Romanian language for all text fields

Return ONLY a valid JSON object with this exact structure:
{
  "organization_profile": {
    "industry": "string",
    "location_type": "string",
    "total_positions": number,
    "total_employees": number
  },
  "identified_hazards": [
    {
      "hazard_name": "string",
      "hazard_category": "string",
      "affected_positions": ["string"],
      "hazard_description": "string",
      "probability": 1-5,
      "severity": 1-5,
      "risk_level": "trivial|acceptable|moderate|substantial|intolerable",
      "risk_score": number,
      "control_measures": [
        {
          "type": "elimination|substitution|engineering|administrative|ppe",
          "description": "string",
          "implementation_priority": "immediate|short_term|long_term",
          "estimated_cost": "string",
          "legal_requirement": boolean
        }
      ],
      "legal_references": ["string"]
    }
  ],
  "summary": {
    "total_hazards": number,
    "intolerable_risks": number,
    "substantial_risks": number,
    "moderate_risks": number,
    "acceptable_risks": number,
    "trivial_risks": number,
    "priority_actions": ["string"],
    "estimated_total_cost": "string"
  },
  "general_recommendations": ["string"],
  "legal_compliance_notes": "string"
}

Return ONLY the JSON object, no explanations or markdown.`

// Helper function to calculate risk level from score
function calculateRiskLevel(score: number): 'trivial' | 'acceptable' | 'moderate' | 'substantial' | 'intolerable' {
  if (score <= 3) return 'trivial'
  if (score <= 6) return 'acceptable'
  if (score <= 12) return 'moderate'
  if (score <= 16) return 'substantial'
  return 'intolerable'
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
      organization_size,
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

    // Validate each job position
    for (const position of job_positions) {
      if (!position.title || typeof position.title !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Each job position must have a valid title' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }
      if (!position.count || typeof position.count !== 'number' || position.count < 1) {
        return new Response(
          JSON.stringify({ error: 'Each job position must have a valid count (positive number)' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }
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
    if (max_tokens < 1000 || max_tokens > 16000) {
      return new Response(
        JSON.stringify({ error: 'max_tokens must be between 1000 and 16000' }),
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

    // Calculate total employees if not provided
    const totalEmployees = organization_size || job_positions.reduce((sum, pos) => sum + pos.count, 0)

    // Format job positions
    const positionsText = job_positions
      .map(
        (pos) =>
          `- ${pos.title}: ${pos.count} angajat${pos.count > 1 ? 'i' : ''}${
            pos.description ? ` - ${pos.description}` : ''
          }`
      )
      .join('\n')

    // Format additional context
    const contextText = additional_context
      ? `\n**ADDITIONAL CONTEXT:**\n${additional_context}`
      : ''

    // Construct full prompt
    const fullPrompt = RISK_ASSESSMENT_PROMPT.replace('{industry}', industry)
      .replace('{location_type}', location_type)
      .replace('{organization_size}', totalEmployees.toString())
      .replace('{job_positions}', positionsText)
      .replace('{additional_context}', contextText)

    // Call Claude API
    console.log('Calling Claude API for risk assessment...')
    console.log(
      `Parameters: industry=${industry}, location=${location_type}, positions=${job_positions.length}, employees=${totalEmployees}`
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
    let assessment: RiskAssessment
    try {
      // Clean potential markdown code blocks
      const cleanedText = extractedText
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim()

      assessment = JSON.parse(cleanedText)

      // Validate structure
      if (
        !assessment.organization_profile ||
        !Array.isArray(assessment.identified_hazards) ||
        !assessment.summary ||
        !Array.isArray(assessment.general_recommendations) ||
        !assessment.legal_compliance_notes
      ) {
        throw new Error('Invalid risk assessment structure')
      }

      // Validate and recalculate risk levels for each hazard
      assessment.identified_hazards.forEach((hazard, index) => {
        if (
          !hazard.hazard_name ||
          !hazard.hazard_category ||
          !Array.isArray(hazard.affected_positions) ||
          !hazard.hazard_description ||
          !hazard.probability ||
          !hazard.severity ||
          !Array.isArray(hazard.control_measures) ||
          !Array.isArray(hazard.legal_references)
        ) {
          throw new Error(`Invalid hazard structure at index ${index}`)
        }

        // Validate probability and severity
        if (hazard.probability < 1 || hazard.probability > 5) {
          throw new Error(`Invalid probability at index ${index}: ${hazard.probability}`)
        }
        if (hazard.severity < 1 || hazard.severity > 5) {
          throw new Error(`Invalid severity at index ${index}: ${hazard.severity}`)
        }

        // Recalculate risk score and level to ensure consistency
        hazard.risk_score = hazard.probability * hazard.severity
        hazard.risk_level = calculateRiskLevel(hazard.risk_score)

        // Validate control measures
        hazard.control_measures.forEach((measure, mIndex) => {
          if (
            !measure.type ||
            !measure.description ||
            !measure.implementation_priority ||
            !measure.estimated_cost ||
            typeof measure.legal_requirement !== 'boolean'
          ) {
            throw new Error(
              `Invalid control measure structure at hazard ${index}, measure ${mIndex}`
            )
          }
        })
      })

      // Recalculate summary statistics to ensure consistency
      assessment.summary.total_hazards = assessment.identified_hazards.length
      assessment.summary.intolerable_risks = assessment.identified_hazards.filter(
        (h) => h.risk_level === 'intolerable'
      ).length
      assessment.summary.substantial_risks = assessment.identified_hazards.filter(
        (h) => h.risk_level === 'substantial'
      ).length
      assessment.summary.moderate_risks = assessment.identified_hazards.filter(
        (h) => h.risk_level === 'moderate'
      ).length
      assessment.summary.acceptable_risks = assessment.identified_hazards.filter(
        (h) => h.risk_level === 'acceptable'
      ).length
      assessment.summary.trivial_risks = assessment.identified_hazards.filter(
        (h) => h.risk_level === 'trivial'
      ).length

      // Sort hazards by risk score (highest first)
      assessment.identified_hazards.sort((a, b) => b.risk_score - a.risk_score)
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

    console.log(
      `Successfully generated risk assessment with ${assessment.identified_hazards.length} hazards`
    )
    console.log(
      `Risk distribution: ${assessment.summary.intolerable_risks} intolerable, ${assessment.summary.substantial_risks} substantial, ${assessment.summary.moderate_risks} moderate`
    )

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        assessment: assessment,
        input_summary: {
          industry,
          location_type,
          positions_analyzed: job_positions.length,
          total_employees: totalEmployees,
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
