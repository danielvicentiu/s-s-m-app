# AI Training Content Generator

Edge Function that generates personalized SSM/PSI training content using Claude API.

## Features

- 🎯 **Personalized Content**: Generates training content based on training type and industry
- 🌍 **Multi-language Support**: RO, EN, BG, HU, DE
- 📚 **Comprehensive Structure**: Topics, key points, practical examples, quiz questions
- ⚖️ **Legislation-Aware**: References appropriate local legislation for each locale
- ✅ **Validated Output**: Ensures exactly 10 quiz questions and proper structure

## Request

**Endpoint**: `POST /ai-training-content`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer <SUPABASE_ANON_KEY>
```

**Body**:
```json
{
  "training_type": "Instruire PSI",
  "industry": "Fabricatie",
  "locale": "ro",
  "max_tokens": 4096
}
```

**Parameters**:
- `training_type` (required, string): Type of training (e.g., "Instruire PSI", "Protecția Muncii", "Fire Safety")
- `industry` (optional, string): Industry sector (default: "General")
- `locale` (optional, string): Language/region code - "ro", "en", "bg", "hu", "de" (default: "ro")
- `max_tokens` (optional, number): Maximum tokens for Claude API (1000-8192, default: 4096)

## Response

**Success** (200):
```json
{
  "success": true,
  "content": {
    "training_title": "Instruire PSI pentru Fabricație",
    "total_duration_minutes": 180,
    "topics": [
      {
        "title": "Introducere în PSI",
        "duration_minutes": 30,
        "key_points": [
          "Legislație PSI în România",
          "Responsabilități legale",
          "..."
        ],
        "practical_examples": [
          "Exemplu dintr-o fabrică de mobilă",
          "..."
        ]
      }
    ],
    "quiz_questions": [
      {
        "question": "Care este frecvența verificării stingătoarelor?",
        "options": ["Lunar", "Trimestrial", "Semestrial", "Anual"],
        "correct_answer_index": 2,
        "explanation": "Conform legislației, stingătoarele se verifică semestrial."
      }
    ],
    "additional_resources": [
      "Legea 307/2006 privind apărarea împotriva incendiilor",
      "..."
    ]
  },
  "metadata": {
    "training_type": "Instruire PSI",
    "industry": "Fabricatie",
    "locale": "ro",
    "topics_count": 6,
    "quiz_questions_count": 10,
    "total_duration_minutes": 180,
    "model": "claude-sonnet-4-5-20250929",
    "tokens_used": {
      "input_tokens": 850,
      "output_tokens": 2500
    }
  }
}
```

**Error** (400/500):
```json
{
  "error": "Error message",
  "details": "Additional details"
}
```

## Supported Locales

| Locale | Language | Legislation Reference |
|--------|----------|----------------------|
| `ro` | Romanian | Legea 319/2006, Legea 307/2006 |
| `en` | English | EU OSH Framework Directive 89/391/EEC |
| `bg` | Bulgarian | Закон за здравословни и безопасни условия на труд |
| `hu` | Hungarian | 1993. évi XCIII. törvény |
| `de` | German | Arbeitsschutzgesetz (ArbSchG) |

## Output Structure

### TopicContent
- `title`: Topic title in requested language
- `duration_minutes`: Realistic duration (10-45 minutes)
- `key_points`: 4-6 key learning points
- `practical_examples`: 2-4 industry-specific examples

### QuizQuestion
- `question`: Question text
- `options`: Array of 4 answer options
- `correct_answer_index`: Index (0-3) of correct answer
- `explanation`: Brief explanation of correct answer

**Important**: Function always returns EXACTLY 10 quiz questions.

## Environment Variables

Required in Supabase Edge Functions settings:
- `ANTHROPIC_API_KEY`: Your Anthropic API key

## Example Usage

```typescript
const response = await fetch(
  'https://uhccxfyvhjeudkexcgiq.supabase.co/functions/v1/ai-training-content',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      training_type: 'Lucru la Înălțime',
      industry: 'Construcții',
      locale: 'ro',
    }),
  }
)

const data = await response.json()
if (data.success) {
  console.log(`Generated ${data.content.topics.length} topics`)
  console.log(`Quiz: ${data.content.quiz_questions.length} questions`)
}
```

## Error Handling

- **400**: Invalid parameters (missing training_type, unsupported locale, invalid max_tokens)
- **405**: Method not allowed (only POST supported)
- **500**: AI service error, parsing error, or internal error

## Notes

- Training content is generated in real-time; responses may take 5-15 seconds
- Content is tailored to the specified industry with relevant examples
- Legislation references are locale-specific
- Duration estimates are realistic and practical for actual training sessions
