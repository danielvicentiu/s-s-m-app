// AI FAQ Generator Edge Function
// Generates 20 personalized FAQ items for employers based on industry and country
// Provides practical SSM/PSI questions with legal basis and simple language

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Anthropic from "npm:@anthropic-ai/sdk@0.32.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FAQItem {
  question: string
  answer: string
  legal_basis: string[]
  category: 'ssm' | 'psi' | 'medical' | 'training' | 'equipment' | 'documentation'
  relevance_score: number
}

interface FAQResponse {
  faqs: FAQItem[]
  industry: string
  country: string
  locale: string
}

interface RequestBody {
  industry: string
  country: string
  locale?: string
  max_tokens?: number
}

const DEFAULT_MAX_TOKENS = 8192
const CLAUDE_MODEL = 'claude-sonnet-4-5-20250929'

// Multi-locale prompts
const LOCALE_CONFIGS: Record<string, {
  language: string
  legislation_framework: string
  examples: string
}> = {
  ro: {
    language: 'Romanian (Română)',
    legislation_framework: 'Legea 319/2006 (SSM), Legea 307/2006 (PSI), HG 1425/2006, Ordinele specifice',
    examples: 'De exemplu: "Câți angajați trebuie să aibă fișa postului actualizată cu riscuri SSM?"'
  },
  bg: {
    language: 'Bulgarian (Български)',
    legislation_framework: 'Закон за здравословни и безопасни условия на труд, Закон за пожарна безопасност и защита на населението',
    examples: 'Например: "Колко служители трябва да имат актуализирана длъжностна характеристика с рискове на безопасност?"'
  },
  en: {
    language: 'English',
    legislation_framework: 'Health and Safety at Work Act, Fire Safety Regulations (adapt to UK/EU/local context)',
    examples: 'For example: "How many employees need updated job descriptions with safety risks?"'
  },
  hu: {
    language: 'Hungarian (Magyar)',
    legislation_framework: 'Munkavédelmi törvény, Tűzvédelmi szabályozás',
    examples: 'Például: "Hány alkalmazottnak kell frissített munkaköri leírással rendelkeznie biztonsági kockázatokkal?"'
  },
  de: {
    language: 'German (Deutsch)',
    legislation_framework: 'Arbeitsschutzgesetz (ArbSchG), Brandschutzvorschriften',
    examples: 'Zum Beispiel: "Wie viele Mitarbeiter benötigen aktualisierte Stellenbeschreibungen mit Sicherheitsrisiken?"'
  }
}

const FAQ_GENERATION_PROMPT = `You are an expert SSM/PSI (Occupational Health & Safety / Fire Safety) consultant with 20+ years of experience across multiple European countries.

Generate 20 highly practical, industry-specific FAQ items for an employer in the following sector:

**EMPLOYER PROFILE:**
- Industry: {industry}
- Country: {country}
- Target Language: {language}

**YOUR TASK:**
Create 20 FAQ items that answer the most common, practical questions employers in this industry have about SSM/PSI compliance.

**CRITICAL REQUIREMENTS:**

1. **Questions must be PRACTICAL and SPECIFIC** to {industry}:
   - Focus on real day-to-day compliance questions
   - Address industry-specific risks and scenarios
   - Avoid generic questions that apply to all industries
   {examples}

2. **Answers must be ACTIONABLE and CLEAR**:
   - Use simple, non-technical language (Explain Like I'm 5 principle)
   - Provide concrete steps or checklists where applicable
   - Maximum 3-4 sentences per answer (concise and focused)
   - Avoid legal jargon - write for busy managers, not lawyers

3. **Legal Basis must be ACCURATE and RELEVANT**:
   - Reference specific articles from: {legislation_framework}
   - Include 1-3 legal references per answer
   - Format as short citations (e.g., "Art. 7, Legea 319/2006")

4. **Category Distribution** (must total exactly 20 items):
   - ssm: 7-8 items (general workplace safety)
   - psi: 3-4 items (fire safety)
   - medical: 2-3 items (medical surveillance, first aid)
   - training: 3-4 items (safety training, instruction)
   - equipment: 2-3 items (PPE, work equipment)
   - documentation: 2 items (required documents, records)

5. **Relevance Score** (1-10):
   - 9-10: Critical, high-frequency questions for this industry
   - 7-8: Important, common questions
   - 5-6: Useful, moderate frequency
   - Prioritize higher scores - average should be 7.5+

**INDUSTRY-SPECIFIC FOCUS:**

For {industry} in {country}, consider:
- Typical workplace hazards and risks specific to this sector
- Common compliance gaps or violations in this industry
- Seasonal or cyclical safety issues
- Industry-specific equipment, processes, or materials
- Typical company size and organizational structure
- Regulatory enforcement priorities in {country}

**LANGUAGE AND TONE:**

- Write ENTIRELY in {language}
- Use professional but approachable tone
- Avoid bureaucratic language
- Write as if answering a colleague's question over coffee
- Use local terminology and conventions for {country}

**OUTPUT FORMAT:**

Return ONLY a valid JSON object with this EXACT structure:

{{
  "faqs": [
    {{
      "question": "string (the practical question in {language})",
      "answer": "string (clear, actionable answer in {language}, 3-4 sentences max)",
      "legal_basis": ["string", ...] (1-3 legal citations),
      "category": "ssm" | "psi" | "medical" | "training" | "equipment" | "documentation",
      "relevance_score": number (1-10, how critical is this for {industry})
    }},
    ... (exactly 20 items total)
  ]
}}

**VALIDATION CHECKLIST:**
- ✓ Exactly 20 FAQ items
- ✓ All text in {language}
- ✓ Questions are industry-specific, not generic
- ✓ Answers are concise (3-4 sentences max)
- ✓ Legal basis includes 1-3 citations per item
- ✓ Category distribution matches requirements
- ✓ Relevance scores average 7.5 or higher
- ✓ All legal references are appropriate for {country}

Return ONLY the JSON object, no explanations, no markdown code blocks.`

Deno.serve(async (req) => {
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
      country,
      locale = 'ro',
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

    if (industry.length < 3) {
      return new Response(
        JSON.stringify({ error: 'Industry name too short (minimum 3 characters)' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!country || typeof country !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid country parameter' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (country.length < 2) {
      return new Response(
        JSON.stringify({ error: 'Country name too short (minimum 2 characters)' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Validate locale
    if (!LOCALE_CONFIGS[locale]) {
      return new Response(
        JSON.stringify({
          error: `Unsupported locale: ${locale}`,
          supported_locales: Object.keys(LOCALE_CONFIGS)
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Validate max_tokens
    if (max_tokens < 1000 || max_tokens > 16384) {
      return new Response(
        JSON.stringify({ error: 'max_tokens must be between 1000 and 16384' }),
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

    // Get locale configuration
    const localeConfig = LOCALE_CONFIGS[locale]

    // Construct full prompt
    const fullPrompt = FAQ_GENERATION_PROMPT
      .replace(/{industry}/g, industry)
      .replace(/{country}/g, country)
      .replace(/{language}/g, localeConfig.language)
      .replace(/{legislation_framework}/g, localeConfig.legislation_framework)
      .replace(/{examples}/g, localeConfig.examples)

    // Call Claude API using Anthropic SDK
    console.log('Calling Claude API for FAQ generation...')
    console.log(`Industry: ${industry}, Country: ${country}, Locale: ${locale}`)

    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    let claudeData: any;
    let extractedText: string;

    try {
      const message = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: max_tokens,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: fullPrompt,
          },
        ],
      });

      const content = message.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude API');
      }

      extractedText = content.text;
      claudeData = {
        usage: message.usage,
        model: message.model,
      };

    } catch (apiError) {
      console.error('Claude API error:', apiError);
      return new Response(
        JSON.stringify({
          error: 'AI service error',
          details: apiError instanceof Error ? apiError.message : 'Unknown error',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!extractedText) {
      console.error('No text in Claude response');
      return new Response(
        JSON.stringify({ error: 'No response from AI service' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse FAQ response
    let faqResponse: { faqs: FAQItem[] }
    try {
      // Clean potential markdown code blocks
      const cleanedText = extractedText
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim()

      faqResponse = JSON.parse(cleanedText)

      // Validate structure
      if (!Array.isArray(faqResponse.faqs)) {
        throw new Error('Missing or invalid faqs array')
      }

      if (faqResponse.faqs.length !== 20) {
        throw new Error(`Expected 20 FAQ items, got ${faqResponse.faqs.length}`)
      }

      // Validate each FAQ item
      const validCategories = ['ssm', 'psi', 'medical', 'training', 'equipment', 'documentation']

      faqResponse.faqs.forEach((faq, index) => {
        if (!faq.question || typeof faq.question !== 'string') {
          throw new Error(`Invalid question at index ${index}`)
        }

        if (faq.question.length < 10) {
          throw new Error(`Question too short at index ${index}`)
        }

        if (!faq.answer || typeof faq.answer !== 'string') {
          throw new Error(`Invalid answer at index ${index}`)
        }

        if (faq.answer.length < 20) {
          throw new Error(`Answer too short at index ${index}`)
        }

        if (!Array.isArray(faq.legal_basis)) {
          throw new Error(`Invalid legal_basis at index ${index}`)
        }

        if (faq.legal_basis.length === 0 || faq.legal_basis.length > 3) {
          throw new Error(`legal_basis must have 1-3 items at index ${index}`)
        }

        if (!faq.category || !validCategories.includes(faq.category)) {
          throw new Error(`Invalid category at index ${index}: ${faq.category}`)
        }

        if (typeof faq.relevance_score !== 'number' || faq.relevance_score < 1 || faq.relevance_score > 10) {
          throw new Error(`Invalid relevance_score at index ${index}: ${faq.relevance_score}`)
        }
      })

      // Validate category distribution
      const categoryCount: Record<string, number> = {
        ssm: 0,
        psi: 0,
        medical: 0,
        training: 0,
        equipment: 0,
        documentation: 0,
      }

      faqResponse.faqs.forEach(faq => {
        categoryCount[faq.category]++
      })

      // Check if distribution is reasonable (not too strict, but ensure variety)
      if (categoryCount.ssm < 5 || categoryCount.ssm > 10) {
        console.warn(`SSM category count (${categoryCount.ssm}) outside recommended range (7-8)`)
      }
      if (categoryCount.psi < 2 || categoryCount.psi > 6) {
        console.warn(`PSI category count (${categoryCount.psi}) outside recommended range (3-4)`)
      }

    } catch (parseError) {
      console.error('Failed to parse FAQ response:', parseError)
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

    console.log(`Successfully generated ${faqResponse.faqs.length} FAQ items`)

    // Calculate statistics
    const categoryDistribution: Record<string, number> = {
      ssm: 0,
      psi: 0,
      medical: 0,
      training: 0,
      equipment: 0,
      documentation: 0,
    }

    let totalRelevance = 0
    faqResponse.faqs.forEach(faq => {
      categoryDistribution[faq.category]++
      totalRelevance += faq.relevance_score
    })

    const avgRelevance = totalRelevance / faqResponse.faqs.length

    const statistics = {
      total_faqs: faqResponse.faqs.length,
      category_distribution: categoryDistribution,
      average_relevance_score: Math.round(avgRelevance * 10) / 10,
      high_priority_count: faqResponse.faqs.filter(f => f.relevance_score >= 9).length,
      legal_references_total: faqResponse.faqs.reduce((sum, f) => sum + f.legal_basis.length, 0),
    }

    console.log('Category distribution:', categoryDistribution)
    console.log('Average relevance:', avgRelevance.toFixed(2))

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        faqs: faqResponse.faqs,
        input_parameters: {
          industry,
          country,
          locale,
        },
        statistics,
        metadata: {
          model: CLAUDE_MODEL,
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
