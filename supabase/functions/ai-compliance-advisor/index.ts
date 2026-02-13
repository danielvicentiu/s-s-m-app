// AI Compliance Advisor Edge Function
// Analyzes organization compliance data and provides prioritized recommendations
// Uses Claude API to generate actionable insights with deadlines, costs, and risk assessment

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

// Types
interface ComplianceScore {
  category: string // 'medical', 'trainings', 'equipment', 'documents', 'psi'
  score: number // 0-100
  total_items: number
  compliant_items: number
  non_compliant_items: number
  expiring_soon: number // items expiring in next 30 days
}

interface ComplianceGap {
  category: string
  item_type: string // 'medical_record', 'training', 'equipment', 'document'
  item_id: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  deadline?: string // ISO date
  affected_employees?: number
}

interface ComplianceHistory {
  date: string // ISO date
  overall_score: number
  category_scores: Record<string, number>
}

interface RequestBody {
  organization_id: string
  compliance_scores: ComplianceScore[]
  compliance_gaps: ComplianceGap[]
  compliance_history?: ComplianceHistory[]
  organization_context?: {
    name?: string
    industry?: string
    employee_count?: number
    country?: string
  }
  locale?: string
  max_tokens?: number
}

interface RecommendedAction {
  priority: number // 1-5 (1 = highest)
  category: string
  title: string
  description: string
  deadline: string // ISO date or "URGENT" or "30 days" etc
  estimated_cost: string // "Low", "Medium", "High", or specific range
  estimated_effort: string // "1-2 hours", "1 day", "1 week", etc
  risk_if_not_addressed: string
  affected_compliance_areas: string[]
  action_steps: string[]
}

interface ComplianceAnalysis {
  overall_assessment: string
  compliance_trend: 'improving' | 'stable' | 'declining'
  critical_issues_count: number
  top_priorities: RecommendedAction[]
  quick_wins: string[] // Easy actions with high impact
  long_term_recommendations: string[]
  estimated_total_cost: string
  estimated_timeline: string
}

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_MAX_TOKENS = 4096
const SUPPORTED_LOCALES = ['ro', 'en', 'bg', 'hu', 'de']

const LOCALE_INSTRUCTIONS = {
  ro: {
    language: 'Romanian',
    legislation: 'Romanian SSM/PSI legislation (Legea 319/2006, Legea 307/2006)',
  },
  en: {
    language: 'English',
    legislation: 'EU OSH Framework Directive 89/391/EEC',
  },
  bg: {
    language: 'Bulgarian',
    legislation: 'Bulgarian OHS legislation',
  },
  hu: {
    language: 'Hungarian',
    legislation: 'Hungarian OHS legislation',
  },
  de: {
    language: 'German',
    legislation: 'German OHS legislation (Arbeitsschutzgesetz)',
  },
}

function buildCompliancePrompt(data: RequestBody): string {
  const localeInfo = LOCALE_INSTRUCTIONS[data.locale as keyof typeof LOCALE_INSTRUCTIONS] || LOCALE_INSTRUCTIONS.ro
  const orgContext = data.organization_context || {}

  // Calculate overall score
  const overallScore = data.compliance_scores.length > 0
    ? Math.round(data.compliance_scores.reduce((sum, s) => sum + s.score, 0) / data.compliance_scores.length)
    : 0

  // Group gaps by severity
  const criticalGaps = data.compliance_gaps.filter(g => g.severity === 'critical')
  const highGaps = data.compliance_gaps.filter(g => g.severity === 'high')
  const mediumGaps = data.compliance_gaps.filter(g => g.severity === 'medium')

  // Determine trend
  let trend = 'stable'
  if (data.compliance_history && data.compliance_history.length >= 2) {
    const recent = data.compliance_history[data.compliance_history.length - 1]
    const previous = data.compliance_history[data.compliance_history.length - 2]
    if (recent.overall_score > previous.overall_score + 5) trend = 'improving'
    else if (recent.overall_score < previous.overall_score - 5) trend = 'declining'
  }

  return `You are an expert SSM/PSI (Occupational Health & Safety / Fire Safety) compliance advisor with 20+ years of experience in ${orgContext.country || 'Romania'}.

**ORGANIZATION CONTEXT:**
- Name: ${orgContext.name || 'N/A'}
- Industry: ${orgContext.industry || 'General'}
- Employees: ${orgContext.employee_count || 'N/A'}
- Country: ${orgContext.country || 'Romania'}

**CURRENT COMPLIANCE STATUS:**
- Overall Compliance Score: ${overallScore}%
- Trend: ${trend}

**COMPLIANCE SCORES BY CATEGORY:**
${data.compliance_scores.map(s => `- ${s.category}: ${s.score}% (${s.compliant_items}/${s.total_items} compliant, ${s.expiring_soon} expiring soon)`).join('\n')}

**COMPLIANCE GAPS:**
- Critical Issues: ${criticalGaps.length}
- High Priority Issues: ${highGaps.length}
- Medium Priority Issues: ${mediumGaps.length}

**DETAILED GAPS:**
${data.compliance_gaps.slice(0, 20).map(g => `- [${g.severity.toUpperCase()}] ${g.category}: ${g.description}${g.deadline ? ` (deadline: ${g.deadline})` : ''}${g.affected_employees ? ` - affects ${g.affected_employees} employees` : ''}`).join('\n')}

${data.compliance_history && data.compliance_history.length > 0 ? `**HISTORICAL TREND (last ${data.compliance_history.length} periods):**
${data.compliance_history.map(h => `- ${h.date}: ${h.overall_score}%`).join('\n')}` : ''}

---

**YOUR TASK:**

As an expert compliance advisor, analyze this organization's SSM/PSI compliance data and provide:

1. **overall_assessment** - Brief executive summary (2-3 sentences) of the organization's compliance status and main concerns in ${localeInfo.language}.

2. **compliance_trend** - One of: "improving", "stable", or "declining"

3. **critical_issues_count** - Number of critical compliance issues requiring immediate attention

4. **top_priorities** - Array of EXACTLY 5 MOST IMPORTANT recommended actions, prioritized by urgency and impact. Each action MUST include:
   - **priority**: Number 1-5 (1 = most urgent/critical)
   - **category**: Compliance category (medical, trainings, equipment, documents, psi)
   - **title**: Clear, actionable title (in ${localeInfo.language})
   - **description**: Detailed explanation of the issue and why it matters (in ${localeInfo.language})
   - **deadline**: Realistic deadline ("URGENT - 7 days", "30 days", "Q1 2026", etc.) in ${localeInfo.language}
   - **estimated_cost**: Cost range ("100-500 EUR", "Low", "Medium", "High") in ${localeInfo.language}
   - **estimated_effort**: Time/effort required ("2-4 hours", "1-2 days", "1 week") in ${localeInfo.language}
   - **risk_if_not_addressed**: Clear explanation of legal, financial, or safety risks (in ${localeInfo.language})
   - **affected_compliance_areas**: Array of compliance areas this addresses
   - **action_steps**: Array of 3-5 specific, concrete steps to resolve (in ${localeInfo.language})

5. **quick_wins** - Array of 3-5 easy actions with high impact that can be completed quickly (in ${localeInfo.language})

6. **long_term_recommendations** - Array of 3-5 strategic recommendations for improving overall compliance (in ${localeInfo.language})

7. **estimated_total_cost** - Total estimated cost to address all top priorities (in ${localeInfo.language})

8. **estimated_timeline** - Overall timeline to achieve full compliance (in ${localeInfo.language})

**IMPORTANT REQUIREMENTS:**
- ALL text content MUST be in ${localeInfo.language}
- Reference specific ${localeInfo.legislation} where applicable
- Prioritize actions based on legal risk, safety impact, and urgency
- Be specific about deadlines - use actual dates or specific timeframes
- Provide realistic cost and effort estimates
- Focus on actionable, concrete recommendations
- Consider the organization's size (${orgContext.employee_count || 'unknown'} employees) and industry (${orgContext.industry || 'general'})
- EXACTLY 5 items in top_priorities array (no more, no less)

Return ONLY a valid JSON object matching this exact structure:
{
  "overall_assessment": "string",
  "compliance_trend": "improving" | "stable" | "declining",
  "critical_issues_count": number,
  "top_priorities": [
    {
      "priority": number (1-5),
      "category": "string",
      "title": "string",
      "description": "string",
      "deadline": "string",
      "estimated_cost": "string",
      "estimated_effort": "string",
      "risk_if_not_addressed": "string",
      "affected_compliance_areas": ["string"],
      "action_steps": ["string"]
    }
  ],
  "quick_wins": ["string"],
  "long_term_recommendations": ["string"],
  "estimated_total_cost": "string",
  "estimated_timeline": "string"
}

Return ONLY the JSON object, no explanations or markdown code blocks.`
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
      organization_id,
      compliance_scores,
      compliance_gaps,
      compliance_history = [],
      organization_context = {},
      locale = 'ro',
      max_tokens = DEFAULT_MAX_TOKENS
    } = body

    // Validate required fields
    if (!organization_id || typeof organization_id !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid organization_id' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!Array.isArray(compliance_scores) || compliance_scores.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing or empty compliance_scores array' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!Array.isArray(compliance_gaps)) {
      return new Response(
        JSON.stringify({ error: 'compliance_gaps must be an array' }),
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

    // Get Supabase config for potential future use (logging, etc.)
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    // Initialize Supabase client (for potential logging)
    let supabase = null
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    }

    // Build prompt
    const prompt = buildCompliancePrompt(body)

    // Call Claude API
    console.log(`Generating compliance analysis for organization: ${organization_id} (${normalizedLocale})`)
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

    // Parse generated compliance analysis
    let analysis: ComplianceAnalysis
    try {
      // Clean potential markdown code blocks
      const cleanedText = generatedText
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim()

      analysis = JSON.parse(cleanedText)

      // Validate structure
      if (!analysis.overall_assessment || !analysis.compliance_trend) {
        throw new Error('Invalid analysis structure: missing required fields')
      }

      if (!Array.isArray(analysis.top_priorities) || analysis.top_priorities.length !== 5) {
        throw new Error(`Expected exactly 5 top priorities, got ${analysis.top_priorities?.length || 0}`)
      }

      if (!Array.isArray(analysis.quick_wins) || !Array.isArray(analysis.long_term_recommendations)) {
        throw new Error('Invalid analysis structure: quick_wins and long_term_recommendations must be arrays')
      }

      // Validate each top priority
      analysis.top_priorities.forEach((action, index) => {
        if (
          typeof action.priority !== 'number' ||
          action.priority < 1 ||
          action.priority > 5 ||
          !action.category ||
          !action.title ||
          !action.description ||
          !action.deadline ||
          !action.estimated_cost ||
          !action.estimated_effort ||
          !action.risk_if_not_addressed ||
          !Array.isArray(action.affected_compliance_areas) ||
          !Array.isArray(action.action_steps)
        ) {
          throw new Error(`Invalid action structure at priority ${index + 1}`)
        }
      })

      // Validate compliance_trend
      if (!['improving', 'stable', 'declining'].includes(analysis.compliance_trend)) {
        throw new Error(`Invalid compliance_trend: ${analysis.compliance_trend}`)
      }

    } catch (parseError) {
      console.error('Failed to parse compliance analysis:', parseError)
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

    console.log(`Successfully generated compliance analysis with ${analysis.top_priorities.length} priorities`)

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        organization_id,
        analysis,
        metadata: {
          locale: normalizedLocale,
          overall_score: Math.round(compliance_scores.reduce((sum, s) => sum + s.score, 0) / compliance_scores.length),
          total_gaps: compliance_gaps.length,
          critical_gaps: compliance_gaps.filter(g => g.severity === 'critical').length,
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
