# AI FAQ Generator Edge Function

Generates 20 personalized FAQ items for employers based on their industry and country, providing practical SSM/PSI questions with legal basis in simple language.

## Purpose

This Edge Function creates industry-specific, country-localized FAQ content for employers to help them understand and comply with SSM (Occupational Health & Safety) and PSI (Fire Safety) regulations. The FAQ items are practical, actionable, and written in non-technical language suitable for busy managers.

## Features

- **Industry-Specific Questions**: Tailored to the unique risks and compliance requirements of each sector
- **Multi-Locale Support**: Available in Romanian, Bulgarian, English, Hungarian, and German
- **Legal Citations**: Each answer includes 1-3 relevant legal references
- **Practical Answers**: Clear, actionable guidance in 3-4 sentences using simple language
- **Categorized Content**: Organized across 6 SSM/PSI topic areas
- **Relevance Scoring**: Each FAQ rated 1-10 based on importance to the industry

## API Endpoint

```
POST /functions/v1/ai-faq-generator
```

## Request Format

```json
{
  "industry": "Construcții și montaje",
  "country": "România",
  "locale": "ro",
  "max_tokens": 8192
}
```

### Required Parameters

- `industry` (string): The employer's industry/sector (minimum 3 characters)
  - Examples: "Construcții și montaje", "Hospitality", "Production Manufacturing", "Retail", "Healthcare"

- `country` (string): The country where the employer operates (minimum 2 characters)
  - Examples: "România", "Bulgaria", "Germany", "Hungary", "United Kingdom"

### Optional Parameters

- `locale` (string): Target language for FAQ content (default: "ro")
  - Supported values: "ro", "bg", "en", "hu", "de"

- `max_tokens` (number): Maximum tokens for AI response (1000-16384, default: 8192)

## Response Format

```json
{
  "success": true,
  "faqs": [
    {
      "question": "Câți lucrători trebuie să aibă autorizație de lucru la înălțime pe șantier?",
      "answer": "Toți lucrătorii care desfășoară activități la înălțimi peste 2 metri trebuie să aibă autorizație conform Ordinului 508/2002. Aceasta se obține după parcurgerea unui curs de 40 ore și promovarea examenului teoretic și practic. Autorizația este valabilă 5 ani și trebuie reînnoită prin curs de reîmprospătare.",
      "legal_basis": [
        "Ordinul 508/2002",
        "Art. 14, HG 1425/2006",
        "Art. 7, Legea 319/2006"
      ],
      "category": "training",
      "relevance_score": 10
    },
    {
      "question": "Ce echipamente de protecție individuală sunt obligatorii pe șantier?",
      "answer": "Minimul obligatoriu include cască de protecție, încălțăminte de siguranță cu bombeu metalic și vestă reflectorizantă. În funcție de activitate, se adaugă mănuși de protecție, ochelari, centuri de siguranță pentru lucru la înălțime, și măști de protecție respiratorie. Angajatorul trebuie să asigure gratuit toate echipamentele și să le înlocuiască când sunt deteriorate.",
      "legal_basis": [
        "HG 1048/2006",
        "Art. 7, lit. b, Legea 319/2006"
      ],
      "category": "equipment",
      "relevance_score": 9
    }
  ],
  "input_parameters": {
    "industry": "Construcții și montaje",
    "country": "România",
    "locale": "ro"
  },
  "statistics": {
    "total_faqs": 20,
    "category_distribution": {
      "ssm": 8,
      "psi": 3,
      "medical": 3,
      "training": 3,
      "equipment": 2,
      "documentation": 1
    },
    "average_relevance_score": 8.2,
    "high_priority_count": 12,
    "legal_references_total": 47
  },
  "metadata": {
    "model": "claude-sonnet-4-5-20250929",
    "tokens_used": {
      "input_tokens": 1456,
      "output_tokens": 3821
    },
    "generated_at": "2026-02-13T14:30:00.000Z"
  }
}
```

## FAQ Item Structure

Each FAQ item contains:

- **question**: Practical question in the target language
- **answer**: Clear, actionable answer (3-4 sentences, simple language)
- **legal_basis**: Array of 1-3 legal citations (e.g., "Art. 7, Legea 319/2006")
- **category**: Topic classification
- **relevance_score**: Importance rating 1-10 for the specific industry

## Categories

FAQ items are distributed across 6 categories:

1. **ssm** (7-8 items): General workplace safety and occupational health
2. **psi** (3-4 items): Fire safety, prevention, emergency procedures
3. **medical** (2-3 items): Medical surveillance, first aid, health monitoring
4. **training** (3-4 items): Safety training, instruction, competency
5. **equipment** (2-3 items): Personal protective equipment, work equipment
6. **documentation** (2 items): Required documents, records, compliance paperwork

## Supported Locales

| Locale | Language | Legislative Framework |
|--------|----------|----------------------|
| `ro` | Romanian (Română) | Legea 319/2006 (SSM), Legea 307/2006 (PSI), HG 1425/2006 |
| `bg` | Bulgarian (Български) | Закон за здравословни и безопасни условия на труд, Закон за пожарна безопасност |
| `en` | English | Health and Safety at Work Act, Fire Safety Regulations |
| `hu` | Hungarian (Magyar) | Munkavédelmi törvény, Tűzvédelmi szabályozás |
| `de` | German (Deutsch) | Arbeitsschutzgesetz (ArbSchG), Brandschutzvorschriften |

## Relevance Scoring

Each FAQ is scored 1-10 based on its importance for the specific industry:

- **9-10**: Critical, high-frequency questions (most common compliance issues)
- **7-8**: Important, common questions (regular compliance topics)
- **5-6**: Useful, moderate frequency (occasional topics)
- **1-4**: Low priority (rare or edge cases) - typically not included

Average relevance score across all 20 items is typically 7.5+ to ensure high-quality, actionable content.

## Environment Variables

- `ANTHROPIC_API_KEY`: Required - Your Anthropic API key

## Error Responses

### 400 Bad Request
- Missing or invalid `industry` parameter
- Missing or invalid `country` parameter
- Industry name too short (< 3 characters)
- Country name too short (< 2 characters)
- Unsupported locale
- Invalid `max_tokens` value

### 405 Method Not Allowed
- Non-POST request method

### 500 Internal Server Error
- AI service not configured (missing API key)
- Claude API error
- Failed to parse AI response
- Invalid FAQ structure returned by AI
- Unexpected internal error

## Example Usage

### Romanian Construction Company

```typescript
const response = await fetch(
  'https://uhccxfyvhjeudkexcgiq.supabase.co/functions/v1/ai-faq-generator',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({
      industry: 'Construcții și montaje',
      country: 'România',
      locale: 'ro',
    }),
  }
)

const data = await response.json()
console.log('FAQs:', data.faqs)
console.log('Statistics:', data.statistics)
```

### Bulgarian Manufacturing Company

```typescript
const response = await fetch(
  'https://uhccxfyvhjeudkexcgiq.supabase.co/functions/v1/ai-faq-generator',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({
      industry: 'Производство на метални изделия',
      country: 'България',
      locale: 'bg',
    }),
  }
)

const data = await response.json()
```

### German Logistics Company

```typescript
const response = await fetch(
  'https://uhccxfyvhjeudkexcgiq.supabase.co/functions/v1/ai-faq-generator',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({
      industry: 'Logistik und Lagerhaltung',
      country: 'Deutschland',
      locale: 'de',
    }),
  }
)

const data = await response.json()
```

## Industry Examples

The function works well with diverse industries:

**High-Risk Industries:**
- Construction and assembly
- Manufacturing (metal, chemical, food processing)
- Mining and quarrying
- Transportation and logistics
- Agriculture and forestry

**Medium-Risk Industries:**
- Retail and commerce
- Hospitality (hotels, restaurants)
- Healthcare facilities
- Education institutions
- Warehousing and storage

**Service Industries:**
- Office environments
- Professional services
- IT and technology
- Financial services
- Real estate management

## Content Quality Standards

Generated FAQ items follow strict quality guidelines:

1. **Practical and Specific**: Questions address real compliance scenarios, not theoretical concepts
2. **Simple Language**: Answers avoid legal jargon and technical terminology
3. **Actionable Guidance**: Each answer provides clear steps or requirements
4. **Legally Accurate**: Legal references are verified and relevant to the country
5. **Industry-Focused**: Content reflects the unique risks and requirements of the sector
6. **Concise Format**: Answers limited to 3-4 sentences for easy readability

## Use Cases

1. **Onboarding Material**: Provide new employers/managers with quick SSM/PSI reference
2. **Knowledge Base**: Build industry-specific help centers
3. **Training Content**: Use as discussion topics in safety training sessions
4. **Compliance Checklists**: Convert FAQ items into actionable compliance tasks
5. **Client Education**: Consultants can use to educate clients about requirements
6. **Self-Assessment**: Employers can check their knowledge against common questions

## Limitations

- FAQ content is AI-generated and should be reviewed by qualified SSM/PSI professionals
- Legal references are indicative - always verify current legislation
- Answers provide general guidance, not case-specific legal advice
- Local regulations may have additional requirements beyond what's mentioned
- Translation quality depends on locale - Romanian (ro) is most comprehensive
- Does not replace professional SSM/PSI consulting or legal advice

## Integration Examples

### Display FAQ on Website

```typescript
async function loadFAQs(industry: string, country: string, locale: string) {
  const response = await fetch('/api/generate-faqs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ industry, country, locale }),
  })

  const { faqs } = await response.json()

  return faqs.map(faq => ({
    id: crypto.randomUUID(),
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    sources: faq.legal_basis.join(', '),
  }))
}
```

### Filter by Category

```typescript
const faqsByCategory = faqs.reduce((acc, faq) => {
  if (!acc[faq.category]) acc[faq.category] = []
  acc[faq.category].push(faq)
  return acc
}, {} as Record<string, FAQItem[]>)

// Display SSM-specific FAQs
const ssmFAQs = faqsByCategory.ssm || []
```

### Sort by Relevance

```typescript
const priorityFAQs = faqs
  .filter(faq => faq.relevance_score >= 9)
  .sort((a, b) => b.relevance_score - a.relevance_score)
```

## Best Practices

1. **Cache Results**: Store generated FAQs to avoid repeated API calls for the same industry/country
2. **Update Regularly**: Regenerate FAQs quarterly to reflect legislative changes
3. **Professional Review**: Have SSM consultants review generated content before publishing
4. **Localization Testing**: Verify terminology is appropriate for the target country
5. **User Feedback**: Collect which FAQs are most useful and regenerate to improve relevance
6. **Combine with Real Data**: Supplement AI-generated FAQs with actual client questions
7. **Legal Disclaimer**: Always include disclaimer that content is for informational purposes

## Performance

- **Response Time**: Typically 8-15 seconds (Claude API processing)
- **Token Usage**: Average 1,500 input tokens, 3,500-4,500 output tokens
- **Cost**: ~$0.05-0.08 per FAQ generation (20 items)
- **Rate Limits**: Subject to Anthropic API rate limits

## Versioning

- Current version uses Claude Sonnet 4.5 model (claude-sonnet-4-5-20250929)
- Prompts optimized for comprehensive, accurate legal references
- Validation ensures exactly 20 items with proper structure
