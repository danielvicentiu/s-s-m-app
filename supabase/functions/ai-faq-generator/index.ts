// AI FAQ Generator Edge Function
// Generates personalized SSM/PSI FAQs for employers based on industry and country
// Supports multiple locales: RO, EN, BG, HU, DE

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface FAQItem {
  question: string
  answer: string
  legal_basis: string[]
  category: string
}

interface FAQResponse {
  faqs: FAQItem[]
  metadata: {
    industry: string
    country: string
    locale: string
    generated_at: string
  }
}

interface RequestBody {
  industry: string
  country: string
  locale?: string
  max_tokens?: number
}

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_MAX_TOKENS = 4096
const SUPPORTED_LOCALES = ['ro', 'en', 'bg', 'hu', 'de']

const LOCALE_LEGISLATION = {
  ro: {
    language: 'Romanian',
    country_name: 'România',
    legislation: 'Legea 319/2006, Legea 307/2006, HG 1425/2006, HG 971/2006, HG 1048/2006',
    legislation_detail: 'Romanian SSM/PSI legislation including Legea securității și sănătății în muncă nr. 319/2006, Legea securității și sănătății în muncă în construcții nr. 307/2006, and related government decisions',
  },
  en: {
    language: 'English',
    country_name: 'European Union',
    legislation: 'EU OSH Framework Directive 89/391/EEC, Fire Safety Directive 89/106/EEC',
    legislation_detail: 'EU Occupational Safety and Health Framework Directive 89/391/EEC and relevant sector-specific directives',
  },
  bg: {
    language: 'Bulgarian',
    country_name: 'България',
    legislation: 'Закон за здравословни и безопасни условия на труд (ЗЗБУТ), Наредба № 7/1999',
    legislation_detail: 'Bulgarian OHS legislation including the Law on Healthy and Safe Working Conditions and related ordinances',
  },
  hu: {
    language: 'Hungarian',
    country_name: 'Magyarország',
    legislation: '1993. évi XCIII. törvény, 5/1993. (XII. 26.) MüM rendelet',
    legislation_detail: 'Hungarian OHS legislation including Act XCIII of 1993 on Occupational Safety and related ministerial decrees',
  },
  de: {
    language: 'German',
    country_name: 'Deutschland',
    legislation: 'Arbeitsschutzgesetz (ArbSchG), Arbeitsstättenverordnung (ArbStättV)',
    legislation_detail: 'German OHS legislation including the Occupational Safety and Health Act (Arbeitsschutzgesetz) and Workplace Ordinance',
  },
}

const COUNTRY_LOCALE_MAP: { [key: string]: string } = {
  'romania': 'ro',
  'ro': 'ro',
  'bulgaria': 'bg',
  'bg': 'bg',
  'hungary': 'hu',
  'hu': 'hu',
  'germany': 'de',
  'de': 'de',
  'eu': 'en',
  'european union': 'en',
}

function buildFAQPrompt(industry: string, country: string, locale: string): string {
  const localeInfo = LOCALE_LEGISLATION[locale as keyof typeof LOCALE_LEGISLATION] || LOCALE_LEGISLATION.ro

  return `You are an expert SSM/PSI (Occupational Health & Safety / Fire Safety) consultant with 20+ years of experience helping employers understand their legal obligations.

Generate EXACTLY 20 practical, frequently asked questions (FAQs) that employers in the **${industry}** industry in **${localeInfo.country_name}** commonly ask about workplace safety and fire safety compliance.

**Language**: ALL content must be in ${localeInfo.language}
**Applicable Legislation**: ${localeInfo.legislation_detail}
**Industry**: ${industry}
**Country/Region**: ${localeInfo.country_name}

For each FAQ, provide:
1. **question** - A practical question an employer would actually ask (in ${localeInfo.language})
2. **answer** - Clear, actionable answer in simple language (3-5 sentences, in ${localeInfo.language})
3. **legal_basis** - Array of specific legal references (e.g., ["Art. 5 Legea 319/2006", "Art. 12 HG 1425/2006"])
4. **category** - One of these categories (in ${localeInfo.language}):
   - "Documentație obligatorie" / "Mandatory Documentation" / "Задължителна документация" / "Kötelező dokumentáció" / "Pflichtdokumentation"
   - "Instruire și formare" / "Training and Education" / "Обучение и инструктаж" / "Képzés és oktatás" / "Schulung und Ausbildung"
   - "Echipament de protecție" / "Personal Protective Equipment" / "Лични предпазни средства" / "Egyéni védőeszközök" / "Persönliche Schutzausrüstung"
   - "Control medical" / "Medical Surveillance" / "Медицински преглед" / "Orvosi vizsgálat" / "Arbeitsmedizinische Vorsorge"
   - "Prevenirea incendiilor" / "Fire Prevention" / "Пожарна безопасност" / "Tűzvédelem" / "Brandschutz"
   - "Amenajare spații" / "Workplace Layout" / "Организация на работното място" / "Munkahely kialakítás" / "Arbeitsplatzgestaltung"
   - "Evaluare riscuri" / "Risk Assessment" / "Оценка на рисковете" / "Kockázatértékelés" / "Gefährdungsbeurteilung"
   - "Accidente și raportare" / "Incidents and Reporting" / "Инциденти и докладване" / "Balesetek és bejelentés" / "Unfälle und Meldung"

Important requirements:
- Questions should be PRACTICAL and SPECIFIC to ${industry} employers in ${localeInfo.country_name}
- Use SIMPLE, NON-TECHNICAL language that business owners can understand
- Answers should be ACTIONABLE - tell them WHAT to do, not just theory
- Legal references must be SPECIFIC and REAL (based on ${localeInfo.legislation})
- Cover a diverse range of categories (don't focus on just one area)
- Questions should reflect what employers ACTUALLY worry about (costs, deadlines, penalties, procedures)
- EXACTLY 20 FAQs (no more, no less)
- Examples of good questions:
  - "Câte ore de instruire SSM trebuie să fac pentru un angajat nou?"
  - "Ce amenzi risc dacă nu am evaluarea de risc actualizată?"
  - "Trebuie să cumpăr stingătoare pentru un birou de 50mp?"
  - "Cât costă controlul medical periodic pentru un angajat?"

Return ONLY a valid JSON object matching this exact structure:
{
  "faqs": [
    {
      "question": "string",
      "answer": "string",
      "legal_basis": ["string"],
      "category": "string"
    }
  ]
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
      industry,
      country,
      locale,
      max_tokens = DEFAULT_MAX_TOKENS
    } = body

    // Validate industry
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
        JSON.stringify({ error: 'Industry too short (minimum 3 characters)' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Validate country
    if (!country || typeof country !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid country parameter' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Determine locale from country if not explicitly provided
    const normalizedCountry = country.toLowerCase()
    const determinedLocale = locale?.toLowerCase() || COUNTRY_LOCALE_MAP[normalizedCountry] || 'ro'

    // Validate locale
    if (!SUPPORTED_LOCALES.includes(determinedLocale)) {
      return new Response(
        JSON.stringify({
          error: `Unsupported locale: ${determinedLocale}. Supported: ${SUPPORTED_LOCALES.join(', ')}`
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

    // Build prompt
    const prompt = buildFAQPrompt(industry, country, determinedLocale)

    // Call Claude API
    console.log(`Generating FAQs for: ${industry} in ${country} (${determinedLocale})`)
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

    // Parse generated FAQ content
    let faqData: { faqs: FAQItem[] }
    try {
      // Clean potential markdown code blocks
      const cleanedText = generatedText
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim()

      faqData = JSON.parse(cleanedText)

      // Validate structure
      if (!Array.isArray(faqData.faqs)) {
        throw new Error('Invalid FAQ structure: faqs must be an array')
      }

      // Validate FAQ count
      if (faqData.faqs.length !== 20) {
        console.warn(`Expected exactly 20 FAQs, got ${faqData.faqs.length}`)
        // Don't fail - just warn, as we want to be flexible
      }

      // Validate each FAQ
      faqData.faqs.forEach((faq, index) => {
        if (
          !faq.question ||
          !faq.answer ||
          !Array.isArray(faq.legal_basis) ||
          !faq.category
        ) {
          throw new Error(`Invalid FAQ structure at index ${index}: missing required fields`)
        }

        if (typeof faq.question !== 'string' || typeof faq.answer !== 'string') {
          throw new Error(`Invalid FAQ structure at index ${index}: question and answer must be strings`)
        }

        if (faq.legal_basis.length === 0) {
          console.warn(`FAQ at index ${index} has no legal basis references`)
        }
      })

    } catch (parseError) {
      console.error('Failed to parse FAQ content:', parseError)
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

    console.log(`Successfully generated ${faqData.faqs.length} FAQs for ${industry} in ${country}`)

    // Build response
    const response: FAQResponse = {
      faqs: faqData.faqs,
      metadata: {
        industry,
        country,
        locale: determinedLocale,
        generated_at: new Date().toISOString(),
      }
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        ...response,
        api_metadata: {
          faqs_count: faqData.faqs.length,
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
