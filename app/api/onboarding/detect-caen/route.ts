// app/api/onboarding/detect-caen/route.ts
// Detectare cod CAEN din text liber via Claude AI

import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== 'string' || text.trim().length < 5) {
      return NextResponse.json({ error: 'Text prea scurt.' }, { status: 400 })
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      system:
        'Ești expert în clasificarea CAEN. Primești o descriere de activitate în română. Returnează JSON array cu max 3 coduri CAEN potrivite: [{"code": "1071", "label": "Fabricarea pâinii..."}]. Doar JSON, fără explicații, fără markdown.',
      messages: [
        {
          role: 'user',
          content: text.trim(),
        },
      ],
    })

    const rawContent = message.content[0]
    if (rawContent.type !== 'text') {
      return NextResponse.json({ suggestions: [] })
    }

    // Parse JSON — curăță markdown dacă există
    const cleaned = rawContent.text
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/gi, '')
      .trim()

    let suggestions: { code: string; label: string }[] = []
    try {
      const parsed = JSON.parse(cleaned)
      if (Array.isArray(parsed)) {
        suggestions = parsed
          .filter((s) => s && typeof s.code === 'string' && typeof s.label === 'string')
          .slice(0, 3)
      }
    } catch {
      console.error('Claude response parse error:', cleaned)
    }

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('detect-caen error:', error)
    return NextResponse.json(
      { error: 'Eroare la detectare. Încercați din nou.' },
      { status: 500 }
    )
  }
}
