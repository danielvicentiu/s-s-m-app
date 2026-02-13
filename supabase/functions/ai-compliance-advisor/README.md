# AI Compliance Advisor Edge Function

## Overview

This Supabase Edge Function analyzes organization compliance data and provides AI-powered recommendations using Claude API. It generates prioritized action items with deadlines, cost estimates, effort estimates, and risk assessments to help organizations maintain SSM/PSI compliance.

## Features

- **Comprehensive Analysis**: Analyzes compliance scores, gaps, and historical trends
- **Prioritized Recommendations**: Top 5 actions ranked by urgency and impact
- **Cost & Effort Estimates**: Realistic estimates for each recommended action
- **Risk Assessment**: Clear explanation of risks if actions are not taken
- **Quick Wins**: Easy, high-impact actions that can be completed quickly
- **Multilingual Support**: RO, EN, BG, HU, DE
- **Legislation-Aware**: References applicable local legislation

## Deployment

```bash
supabase functions deploy ai-compliance-advisor
```

## Environment Variables

Required in Supabase Edge Functions settings:

- `ANTHROPIC_API_KEY` - Claude API key for AI analysis
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for database access

## API Endpoint

```
POST https://<project-ref>.supabase.co/functions/v1/ai-compliance-advisor
```

## Request Body

```typescript
{
  organization_id: string                    // Required: Organization UUID
  compliance_scores: ComplianceScore[]      // Required: Current scores by category
  compliance_gaps: ComplianceGap[]          // Required: List of compliance issues
  compliance_history?: ComplianceHistory[]  // Optional: Historical trend data
  organization_context?: {                  // Optional: Organization details
    name?: string
    industry?: string
    employee_count?: number
    country?: string
  }
  locale?: string                           // Optional: 'ro' (default), 'en', 'bg', 'hu', 'de'
  max_tokens?: number                       // Optional: 1000-8192, default 4096
}
```

### ComplianceScore

```typescript
{
  category: string              // 'medical', 'trainings', 'equipment', 'documents', 'psi'
  score: number                 // 0-100
  total_items: number
  compliant_items: number
  non_compliant_items: number
  expiring_soon: number         // Items expiring in next 30 days
}
```

### ComplianceGap

```typescript
{
  category: string
  item_type: string             // 'medical_record', 'training', 'equipment', 'document'
  item_id: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  deadline?: string             // ISO date
  affected_employees?: number
}
```

### ComplianceHistory

```typescript
{
  date: string                  // ISO date
  overall_score: number
  category_scores: Record<string, number>
}
```

## Response

```typescript
{
  success: true,
  organization_id: string,
  analysis: {
    overall_assessment: string
    compliance_trend: 'improving' | 'stable' | 'declining'
    critical_issues_count: number
    top_priorities: RecommendedAction[]      // Exactly 5 items
    quick_wins: string[]                     // 3-5 easy actions
    long_term_recommendations: string[]      // 3-5 strategic recommendations
    estimated_total_cost: string
    estimated_timeline: string
  },
  metadata: {
    locale: string
    overall_score: number
    total_gaps: number
    critical_gaps: number
    model: string
    tokens_used: object
    generated_at: string
  }
}
```

### RecommendedAction

```typescript
{
  priority: number                       // 1-5 (1 = most urgent)
  category: string
  title: string
  description: string
  deadline: string                       // "URGENT - 7 days", "30 days", "Q1 2026", etc.
  estimated_cost: string                 // "100-500 EUR", "Low", "Medium", "High"
  estimated_effort: string               // "2-4 hours", "1-2 days", "1 week"
  risk_if_not_addressed: string
  affected_compliance_areas: string[]
  action_steps: string[]                 // 3-5 specific steps
}
```

## Example Usage

```typescript
const response = await fetch(
  'https://uhccxfyvhjeudkexcgiq.supabase.co/functions/v1/ai-compliance-advisor',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({
      organization_id: 'abc-123-def-456',
      compliance_scores: [
        {
          category: 'medical',
          score: 75,
          total_items: 50,
          compliant_items: 38,
          non_compliant_items: 12,
          expiring_soon: 5
        },
        {
          category: 'trainings',
          score: 60,
          total_items: 100,
          compliant_items: 60,
          non_compliant_items: 40,
          expiring_soon: 15
        }
      ],
      compliance_gaps: [
        {
          category: 'medical',
          item_type: 'medical_record',
          item_id: 'med-001',
          description: 'Aviz medical expirat pentru Ion Popescu',
          severity: 'critical',
          deadline: '2026-02-20',
          affected_employees: 1
        },
        {
          category: 'trainings',
          item_type: 'training',
          item_id: 'train-123',
          description: 'Instruire PSI lipsă pentru 15 angajați',
          severity: 'high',
          affected_employees: 15
        }
      ],
      compliance_history: [
        {
          date: '2026-01-01',
          overall_score: 70,
          category_scores: { medical: 75, trainings: 65 }
        },
        {
          date: '2026-02-01',
          overall_score: 68,
          category_scores: { medical: 75, trainings: 60 }
        }
      ],
      organization_context: {
        name: 'ACME Industries SRL',
        industry: 'Manufacturing',
        employee_count: 50,
        country: 'Romania'
      },
      locale: 'ro'
    })
  }
)

const data = await response.json()
console.log(data.analysis.top_priorities)
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing or invalid organization_id"
}
```

### 405 Method Not Allowed
```json
{
  "error": "Method not allowed"
}
```

### 500 Internal Server Error
```json
{
  "error": "AI service error",
  "details": "Status 500"
}
```

## Cost Considerations

- Uses Claude Sonnet 4.5 model
- Typical request: 1500-2500 input tokens, 2000-4000 output tokens
- Estimate: ~$0.02-0.05 per analysis
- Consider caching results (e.g., once per day per organization)

## Integration Example

```typescript
// app/api/compliance-analysis/route.ts
import { createSupabaseServer } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = createSupabaseServer()

  // Get organization data
  const { organization_id } = await request.json()

  // Fetch compliance data from database
  const [scores, gaps, history] = await Promise.all([
    fetchComplianceScores(supabase, organization_id),
    fetchComplianceGaps(supabase, organization_id),
    fetchComplianceHistory(supabase, organization_id)
  ])

  // Call Edge Function
  const { data } = await supabase.functions.invoke('ai-compliance-advisor', {
    body: {
      organization_id,
      compliance_scores: scores,
      compliance_gaps: gaps,
      compliance_history: history,
      organization_context: {
        name: 'My Company',
        industry: 'Construction',
        employee_count: 75,
        country: 'Romania'
      },
      locale: 'ro'
    }
  })

  return Response.json(data)
}
```

## Notes

- Always provide meaningful compliance_scores and compliance_gaps for accurate analysis
- Historical data improves trend analysis but is optional
- Results are in the specified locale (Romanian by default)
- The function returns exactly 5 top priorities, ranked by urgency
- Action steps are specific and actionable
- Cost and effort estimates are realistic and tailored to organization size

## Related Functions

- `ai-training-content` - Generate training materials
- `ai-obligation-extractor` - Extract legislative obligations
- `send-email-batch` - Notify stakeholders of recommendations
