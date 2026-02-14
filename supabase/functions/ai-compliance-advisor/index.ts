// AI Compliance Advisor Edge Function
// Analyzes organization compliance data and generates prioritized recommendations
// Uses Claude API to provide actionable insights with deadlines, costs, and risk assessments

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface ComplianceGap {
  category: string // e.g., "Evaluare Riscuri", "Instruire SSM", "Control Tehnic PSI"
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

interface ComplianceScore {
  category: string
  score: number // 0-100
  max_score: number
  percentage: number
}

interface ComplianceHistoryEntry {
  date: string // ISO date
  overall_score: number
  notes?: string
}

interface RequestBody {
  organization_name: string
  industry: string
  employee_count: number
  compliance_scores: ComplianceScore[]
  compliance_gaps: ComplianceGap[]
  compliance_history?: ComplianceHistoryEntry[]
  additional_context?: string
  max_tokens?: number
}

interface PriorityRecommendation {
  priority: number // 1-5 (1 = highest priority)
  title: string
  description: string
  category: string
  recommended_deadline: string // e.g., "30 zile", "3 luni", "urgent - 7 zile"
  estimated_cost: string // e.g., "500-1000 RON", "2000-3000 RON", "variabil"
  estimated_effort: string // e.g., "2-4 ore", "1-2 zile", "1 săptămână"
  risk_if_not_addressed: string // Clear explanation of consequences
  action_steps: string[] // Specific actionable steps
  legal_references?: string[] // Relevant Romanian laws
}

interface ComplianceAdvisory {
  overall_assessment: string // Summary of compliance status in Romanian
  compliance_trend: 'improving' | 'stable' | 'declining' | 'unknown'
  priority_recommendations: PriorityRecommendation[]
  quick_wins: string[] // Easy improvements with high impact
  long_term_goals: string[] // Strategic improvements
}

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_MAX_TOKENS = 4096

const ADVISORY_PROMPT = `You are a senior Romanian SSM/PSI (Occupational Health & Safety / Fire Safety) compliance consultant with 20+ years of experience.

Analyze the following organization's compliance data and generate a strategic advisory report with prioritized recommendations.

**ORGANIZATION DATA:**
- Organization: {organization_name}
- Industry: {industry}
- Employee Count: {employee_count}

**CURRENT COMPLIANCE SCORES:**
{compliance_scores}

**IDENTIFIED GAPS:**
{compliance_gaps}

**COMPLIANCE HISTORY:**
{compliance_history}

{additional_context}

**YOUR TASK:**
Provide a comprehensive compliance advisory with:

1. **overall_assessment** - Brief 2-3 sentence summary of the organization's compliance status in Romanian. Be direct and honest about the situation.

2. **compliance_trend** - Based on history (if available), assess if compliance is:
   - "improving" - scores are increasing, gaps being addressed
   - "stable" - consistent performance, no major changes
   - "declining" - scores decreasing, new gaps appearing
   - "unknown" - insufficient historical data

3. **priority_recommendations** - Top 5 most important actions, ordered by priority (1 = most urgent). For each:
   - **priority** - 1-5 (1 = highest, most urgent)
   - **title** - Short, action-oriented title in Romanian (e.g., "Actualizare Evaluare Riscuri")
   - **description** - Clear explanation of what needs to be done and why (2-3 sentences, Romanian)
   - **category** - Main compliance category (e.g., "Evaluare Riscuri", "Instruire SSM", "PSI")
   - **recommended_deadline** - Realistic timeframe (e.g., "urgent - 7 zile", "30 zile", "2-3 luni")
   - **estimated_cost** - Cost range in RON or description (e.g., "500-1000 RON", "2000-5000 RON", "cost minim - intern")
   - **estimated_effort** - Time investment (e.g., "2-4 ore", "1-2 zile", "1 săptămână consultanță")
   - **risk_if_not_addressed** - Clear consequences if not done (e.g., "Amenzi 10.000-20.000 RON de la ITM", "Risc accidente grave", "Suspendare activitate")
   - **action_steps** - Array of 3-5 specific, actionable steps in Romanian
   - **legal_references** - Relevant laws/norms (e.g., ["Legea 319/2006", "HG 1425/2006"]) - optional

4. **quick_wins** - Array of 3-5 easy improvements with high impact (simple, low-cost, quick to implement)

5. **long_term_goals** - Array of 3-4 strategic improvements for sustained compliance excellence

**PRIORITIZATION CRITERIA:**
- Legal urgency (risk of fines/sanctions)
- Safety risk (risk of accidents/injuries)
- Impact on overall compliance score
- Ease of implementation
- Cost-effectiveness

**IMPORTANT CONSIDERATIONS:**
- Follow Romanian SSM/PSI legislation (Legea 319/2006, Legea 307/2006, HG 1425/2006, etc.)
- Consider industry-specific requirements
- Be practical and realistic with deadlines/costs
- Focus on actionable, measurable recommendations
- Consider organization size (employee count) in recommendations
- Use clear Romanian language for all text fields
- Base priority on actual risk and legal requirements

Return ONLY a valid JSON object with this exact structure:
{
  "overall_assessment": "string",
  "compliance_trend": "improving" | "stable" | "declining" | "unknown",
  "priority_recommendations": [
    {
      "priority": 1-5,
      "title": "string",
      "description": "string",
      "category": "string",
      "recommended_deadline": "string",
      "estimated_cost": "string",
      "estimated_effort": "string",
      "risk_if_not_addressed": "string",
      "action_steps": ["string", ...],
      "legal_references": ["string", ...] // optional
    }
  ],
  "quick_wins": ["string", ...],
  "long_term_goals": ["string", ...]
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
      organization_name,
      industry,
      employee_count,
      compliance_scores,
      compliance_gaps,
      compliance_history = [],
      additional_context = '',
      max_tokens = DEFAULT_MAX_TOKENS,
    } = body

    // Validate input
    if (!organization_name || typeof organization_name !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid organization_name parameter' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!industry || typeof industry !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid industry parameter' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!employee_count || typeof employee_count !== 'number' || employee_count < 1) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid employee_count parameter (must be positive number)' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!Array.isArray(compliance_scores) || compliance_scores.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid compliance_scores parameter (must be non-empty array)' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!Array.isArray(compliance_gaps)) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid compliance_gaps parameter (must be array)' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Validate max_tokens
    if (max_tokens < 1000 || max_tokens > 8192) {
      return new Response(
        JSON.stringify({ error: 'max_tokens must be between 1000 and 8192' }),
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

    // Format compliance scores
    const scoresText = compliance_scores
      .map(s => `- ${s.category}: ${s.score}/${s.max_score} (${s.percentage.toFixed(1)}%)`)
      .join('\n')

    // Format compliance gaps
    const gapsText = compliance_gaps.length > 0
      ? compliance_gaps
          .map(g => `- [${g.severity.toUpperCase()}] ${g.category}: ${g.description}`)
          .join('\n')
      : 'No specific gaps identified.'

    // Format compliance history
    const historyText = compliance_history.length > 0
      ? compliance_history
          .slice(-5) // Last 5 entries
          .map(h => `- ${h.date}: ${h.overall_score}% ${h.notes ? `(${h.notes})` : ''}`)
          .join('\n')
      : 'No historical data available.'

    // Format additional context
    const contextText = additional_context
      ? `\n**ADDITIONAL CONTEXT:**\n${additional_context}`
      : ''

    // Construct full prompt
    const fullPrompt = ADVISORY_PROMPT
      .replace('{organization_name}', organization_name)
      .replace('{industry}', industry)
      .replace('{employee_count}', employee_count.toString())
      .replace('{compliance_scores}', scoresText)
      .replace('{compliance_gaps}', gapsText)
      .replace('{compliance_history}', historyText)
      .replace('{additional_context}', contextText)

    // Call Claude API
    console.log('Calling Claude API for compliance advisory...')
    console.log(`Parameters: org=${organization_name}, industry=${industry}, employees=${employee_count}`)

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

    // Parse compliance advisory
    let advisory: ComplianceAdvisory
    try {
      // Clean potential markdown code blocks
      const cleanedText = extractedText
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim()

      advisory = JSON.parse(cleanedText)

      // Validate structure
      if (
        !advisory.overall_assessment ||
        !advisory.compliance_trend ||
        !Array.isArray(advisory.priority_recommendations) ||
        !Array.isArray(advisory.quick_wins) ||
        !Array.isArray(advisory.long_term_goals)
      ) {
        throw new Error('Invalid advisory structure')
      }

      // Validate compliance_trend
      const validTrends = ['improving', 'stable', 'declining', 'unknown']
      if (!validTrends.includes(advisory.compliance_trend)) {
        throw new Error(`Invalid compliance_trend: ${advisory.compliance_trend}`)
      }

      // Validate recommendations (should have exactly 5)
      if (advisory.priority_recommendations.length !== 5) {
        console.warn(`Warning: Expected 5 recommendations, got ${advisory.priority_recommendations.length}`)
      }

      // Validate each recommendation
      advisory.priority_recommendations.forEach((rec, index) => {
        if (
          !rec.title ||
          !rec.description ||
          !rec.category ||
          !rec.recommended_deadline ||
          !rec.estimated_cost ||
          !rec.estimated_effort ||
          !rec.risk_if_not_addressed ||
          !Array.isArray(rec.action_steps) ||
          rec.action_steps.length === 0
        ) {
          throw new Error(`Invalid recommendation structure at index ${index}`)
        }
        if (rec.priority < 1 || rec.priority > 5) {
          throw new Error(`Invalid priority at index ${index}: ${rec.priority}`)
        }
      })

      // Sort recommendations by priority (just to be safe)
      advisory.priority_recommendations.sort((a, b) => a.priority - b.priority)

    } catch (parseError) {
      console.error('Failed to parse compliance advisory:', parseError)
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

    console.log(`Successfully generated compliance advisory with ${advisory.priority_recommendations.length} recommendations`)

    // Calculate statistics
    const stats = {
      total_recommendations: advisory.priority_recommendations.length,
      critical_priority: advisory.priority_recommendations.filter(r => r.priority === 1).length,
      high_priority: advisory.priority_recommendations.filter(r => r.priority <= 2).length,
      quick_wins_count: advisory.quick_wins.length,
      long_term_goals_count: advisory.long_term_goals.length,
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        advisory: advisory,
        statistics: stats,
        input_summary: {
          organization: organization_name,
          industry,
          employee_count,
          scores_analyzed: compliance_scores.length,
          gaps_identified: compliance_gaps.length,
          history_entries: compliance_history.length,
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
