// AI Training Content Generator Edge Function
// Generates personalized SSM/PSI training content using Claude API
// Supports multiple locales: RO, EN, BG, HU, DE

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface TopicContent {
  title: string
  duration_minutes: number
  key_points: string[]
  practical_examples: string[]
}

interface QuizQuestion {
  question: string
  options: string[]
  correct_answer_index: number
  explanation: string
}

interface TrainingContent {
  training_title: string
  total_duration_minutes: number
  topics: TopicContent[]
  quiz_questions: QuizQuestion[]
  additional_resources: string[]
}

interface RequestBody {
  training_type: string
  industry?: string
  locale?: string
  max_tokens?: number
}

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_MAX_TOKENS = 4096
const SUPPORTED_LOCALES = ['ro', 'en', 'bg', 'hu', 'de']

const LOCALE_INSTRUCTIONS = {
  ro: {
    language: 'Romanian',
    region: 'Romania',
    legislation: 'Romanian SSM/PSI legislation (Legea 319/2006, etc.)',
  },
  en: {
    language: 'English',
    region: 'European Union',
    legislation: 'EU OSH Framework Directive 89/391/EEC and relevant directives',
  },
  bg: {
    language: 'Bulgarian',
    region: 'Bulgaria',
    legislation: 'Bulgarian OHS legislation (Закон за здравословни и безопасни условия на труд)',
  },
  hu: {
    language: 'Hungarian',
    region: 'Hungary',
    legislation: 'Hungarian OHS legislation (1993. évi XCIII. törvény)',
  },
  de: {
    language: 'German',
    region: 'Germany',
    legislation: 'German OHS legislation (Arbeitsschutzgesetz - ArbSchG)',
  },
}

function buildTrainingPrompt(trainingType: string, industry: string, locale: string): string {
  const localeInfo = LOCALE_INSTRUCTIONS[locale as keyof typeof LOCALE_INSTRUCTIONS] || LOCALE_INSTRUCTIONS.ro

  return `You are an expert SSM/PSI (Occupational Health & Safety / Fire Safety) trainer with 20+ years of experience.

Generate comprehensive training content for the following:
- **Training Type**: ${trainingType}
- **Industry**: ${industry || 'General/All industries'}
- **Language**: ${localeInfo.language}
- **Applicable Legislation**: ${localeInfo.legislation}
- **Region**: ${localeInfo.region}

Create a complete training program with the following structure:

1. **training_title** - Engaging title for the training (in ${localeInfo.language})
2. **total_duration_minutes** - Total estimated duration (sum of all topics)
3. **topics** - Array of 5-8 training topics, each containing:
   - **title**: Topic title (in ${localeInfo.language})
   - **duration_minutes**: Estimated duration for this topic (realistic, 10-45 minutes)
   - **key_points**: Array of 4-6 key learning points (in ${localeInfo.language})
   - **practical_examples**: Array of 2-4 real-world examples specific to ${industry || 'various industries'} (in ${localeInfo.language})

4. **quiz_questions** - Array of EXACTLY 10 multiple-choice questions:
   - **question**: Question text (in ${localeInfo.language})
   - **options**: Array of 4 answer options (in ${localeInfo.language})
   - **correct_answer_index**: Index (0-3) of the correct answer
   - **explanation**: Brief explanation of the correct answer (in ${localeInfo.language})

5. **additional_resources** - Array of 3-5 recommended resources (legislation references, websites, documents) in ${localeInfo.language}

Important requirements:
- ALL content must be in ${localeInfo.language}
- Content must be specific to ${trainingType} training
- Use industry-specific examples for ${industry || 'general workplace'}
- Reference appropriate ${localeInfo.region} legislation
- Questions should test understanding, not just memorization
- Ensure realistic time allocations for each topic
- Make content practical and applicable to real workplace scenarios
- EXACTLY 10 quiz questions (no more, no less)

Return ONLY a valid JSON object matching this exact structure:
{
  "training_title": "string",
  "total_duration_minutes": number,
  "topics": [
    {
      "title": "string",
      "duration_minutes": number,
      "key_points": ["string"],
      "practical_examples": ["string"]
    }
  ],
  "quiz_questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correct_answer_index": number (0-3),
      "explanation": "string"
    }
  ],
  "additional_resources": ["string"]
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
      training_type,
      industry = 'General',
      locale = 'ro',
      max_tokens = DEFAULT_MAX_TOKENS
    } = body

    // Validate training_type
    if (!training_type || typeof training_type !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid training_type parameter' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (training_type.length < 3) {
      return new Response(
        JSON.stringify({ error: 'training_type too short (minimum 3 characters)' }),
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

    // Build prompt
    const prompt = buildTrainingPrompt(training_type, industry, normalizedLocale)

    // Call Claude API
    console.log(`Generating training content for: ${training_type} (${normalizedLocale}) in ${industry}`)
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

    // Parse generated training content
    let trainingContent: TrainingContent
    try {
      // Clean potential markdown code blocks
      const cleanedText = generatedText
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim()

      trainingContent = JSON.parse(cleanedText)

      // Validate structure
      if (!trainingContent.training_title || !Array.isArray(trainingContent.topics)) {
        throw new Error('Invalid training content structure: missing required fields')
      }

      if (!Array.isArray(trainingContent.quiz_questions)) {
        throw new Error('Invalid training content structure: quiz_questions must be an array')
      }

      // Validate quiz questions count
      if (trainingContent.quiz_questions.length !== 10) {
        throw new Error(`Expected exactly 10 quiz questions, got ${trainingContent.quiz_questions.length}`)
      }

      // Validate each topic
      trainingContent.topics.forEach((topic, index) => {
        if (
          !topic.title ||
          typeof topic.duration_minutes !== 'number' ||
          !Array.isArray(topic.key_points) ||
          !Array.isArray(topic.practical_examples)
        ) {
          throw new Error(`Invalid topic structure at index ${index}`)
        }
      })

      // Validate each quiz question
      trainingContent.quiz_questions.forEach((question, index) => {
        if (
          !question.question ||
          !Array.isArray(question.options) ||
          question.options.length !== 4 ||
          typeof question.correct_answer_index !== 'number' ||
          question.correct_answer_index < 0 ||
          question.correct_answer_index > 3 ||
          !question.explanation
        ) {
          throw new Error(`Invalid quiz question structure at index ${index}`)
        }
      })

      // Validate additional_resources
      if (!Array.isArray(trainingContent.additional_resources)) {
        throw new Error('Invalid training content structure: additional_resources must be an array')
      }

    } catch (parseError) {
      console.error('Failed to parse training content:', parseError)
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

    console.log(`Successfully generated training with ${trainingContent.topics.length} topics and ${trainingContent.quiz_questions.length} questions`)

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        content: trainingContent,
        metadata: {
          training_type,
          industry,
          locale: normalizedLocale,
          topics_count: trainingContent.topics.length,
          quiz_questions_count: trainingContent.quiz_questions.length,
          total_duration_minutes: trainingContent.total_duration_minutes,
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
