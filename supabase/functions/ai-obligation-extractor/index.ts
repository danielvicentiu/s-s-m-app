// AI Obligation Extractor Edge Function
// Extracts structured SSM/PSI obligations from legislation text using Claude API

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface ExtractedObligation {
  article: string
  obligation_text: string
  deadline: string | null
  penalty: string | null
  applicable_industries: string[]
}

interface RequestBody {
  legislation_text: string
  legislation_title?: string
  max_tokens?: number
}

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_MAX_TOKENS = 4096

const EXTRACTION_PROMPT = `You are a Romanian SSM/PSI (Occupational Health & Safety / Fire Safety) legal expert.
Extract structured obligations from the provided legislation text.

For each obligation, extract:
1. **article** - The article/section reference (e.g., "Art. 5 alin. 3", "Art. 12")
2. **obligation_text** - Clear description of the obligation in Romanian (what must be done)
3. **deadline** - Time limit if specified (e.g., "30 zile", "anual", "lunar", null if not specified)
4. **penalty** - Penalty amount/range if specified (e.g., "500-2000 RON", "amenda contraventionala", null if not specified)
5. **applicable_industries** - Array of industry codes or categories (e.g., ["fabricatie", "constructii", "toate"] or empty array if general)

Return ONLY a valid JSON array of obligations. Each obligation must follow this structure:
{
  "article": "string",
  "obligation_text": "string",
  "deadline": "string | null",
  "penalty": "string | null",
  "applicable_industries": ["string"]
}

Important:
- Extract ALL obligations from the text
- Be specific and precise in obligation descriptions
- Use Romanian language for obligation_text
- If no deadline/penalty, use null
- If general obligation, use empty array for applicable_industries
- Return ONLY the JSON array, no explanations

Legislation text:
`

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
    const { legislation_text, legislation_title = '', max_tokens = DEFAULT_MAX_TOKENS } = body

    // Validate input
    if (!legislation_text || typeof legislation_text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid legislation_text parameter' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (legislation_text.length < 50) {
      return new Response(
        JSON.stringify({ error: 'Legislation text too short (minimum 50 characters)' }),
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
    const fullPrompt = legislation_title
      ? `${EXTRACTION_PROMPT}\n\nTitle: ${legislation_title}\n\n${legislation_text}`
      : `${EXTRACTION_PROMPT}\n\n${legislation_text}`

    // Call Claude API
    console.log('Calling Claude API for obligation extraction...')
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

    // Parse extracted obligations
    let obligations: ExtractedObligation[]
    try {
      // Clean potential markdown code blocks
      const cleanedText = extractedText
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim()

      obligations = JSON.parse(cleanedText)

      // Validate structure
      if (!Array.isArray(obligations)) {
        throw new Error('Response is not an array')
      }

      // Validate each obligation
      obligations.forEach((obligation, index) => {
        if (
          !obligation.article ||
          !obligation.obligation_text ||
          !Array.isArray(obligation.applicable_industries)
        ) {
          throw new Error(`Invalid obligation structure at index ${index}`)
        }
      })
    } catch (parseError) {
      console.error('Failed to parse obligations:', parseError)
      console.error('Raw response:', extractedText)
      return new Response(
        JSON.stringify({
          error: 'Failed to parse AI response',
          raw_response: extractedText.substring(0, 500),
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    console.log(`Successfully extracted ${obligations.length} obligations`)

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        obligations: obligations,
        metadata: {
          count: obligations.length,
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
