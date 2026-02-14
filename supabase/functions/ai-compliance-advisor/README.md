# AI Compliance Advisor Edge Function

## Overview

This Supabase Edge Function uses Claude AI to analyze organization compliance data and generate strategic, prioritized recommendations for SSM/PSI compliance improvement.

## Features

- **Comprehensive Analysis**: Analyzes compliance scores, gaps, and historical trends
- **Prioritized Recommendations**: Top 5 actions ranked by urgency and impact
- **Actionable Insights**: Specific steps, deadlines, costs, and effort estimates
- **Risk Assessment**: Clear explanation of consequences if recommendations not addressed
- **Strategic Planning**: Quick wins and long-term goals for sustained compliance

## API Endpoint

```
POST /functions/v1/ai-compliance-advisor
```

## Request Body

```typescript
{
  organization_name: string         // Organization name
  industry: string                  // Industry/sector (e.g., "Construcții", "Fabricație")
  employee_count: number            // Number of employees (positive integer)
  compliance_scores: [              // Current compliance scores by category
    {
      category: string              // e.g., "Evaluare Riscuri", "Instruire SSM"
      score: number                 // Points achieved
      max_score: number             // Maximum possible points
      percentage: number            // Score as percentage (0-100)
    }
  ]
  compliance_gaps: [                // Identified compliance gaps (can be empty array)
    {
      category: string              // Compliance category
      description: string           // Gap description
      severity: 'low' | 'medium' | 'high' | 'critical'
    }
  ]
  compliance_history?: [            // Optional: historical compliance data
    {
      date: string                  // ISO date (YYYY-MM-DD)
      overall_score: number         // Overall compliance percentage at that time
      notes?: string                // Optional notes
    }
  ]
  additional_context?: string       // Optional: extra context (recent audits, changes, etc.)
  max_tokens?: number               // Optional: 1000-8192 (default: 4096)
}
```

## Response

```typescript
{
  success: true
  advisory: {
    overall_assessment: string      // 2-3 sentence summary in Romanian
    compliance_trend: 'improving' | 'stable' | 'declining' | 'unknown'
    priority_recommendations: [     // Top 5 recommendations, ordered by priority
      {
        priority: number            // 1-5 (1 = highest)
        title: string               // Action title (Romanian)
        description: string         // What and why (Romanian)
        category: string            // Compliance category
        recommended_deadline: string // e.g., "30 zile", "urgent - 7 zile"
        estimated_cost: string      // e.g., "500-1000 RON", "cost minim - intern"
        estimated_effort: string    // e.g., "2-4 ore", "1-2 zile"
        risk_if_not_addressed: string // Consequences if not done
        action_steps: string[]      // Specific actionable steps
        legal_references?: string[] // Optional: relevant laws
      }
    ]
    quick_wins: string[]            // 3-5 easy, high-impact improvements
    long_term_goals: string[]       // 3-4 strategic improvements
  }
  statistics: {
    total_recommendations: number
    critical_priority: number       // Count with priority = 1
    high_priority: number           // Count with priority <= 2
    quick_wins_count: number
    long_term_goals_count: number
  }
  input_summary: {
    organization: string
    industry: string
    employee_count: number
    scores_analyzed: number
    gaps_identified: number
    history_entries: number
  }
  metadata: {
    model: string
    tokens_used: object
    generated_at: string            // ISO timestamp
  }
}
```

## Example Usage

```bash
curl -X POST https://uhccxfyvhjeudkexcgiq.supabase.co/functions/v1/ai-compliance-advisor \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "organization_name": "Construct Pro SRL",
    "industry": "Construcții",
    "employee_count": 45,
    "compliance_scores": [
      {
        "category": "Evaluare Riscuri",
        "score": 65,
        "max_score": 100,
        "percentage": 65
      },
      {
        "category": "Instruire SSM",
        "score": 80,
        "max_score": 100,
        "percentage": 80
      },
      {
        "category": "Control Tehnic PSI",
        "score": 40,
        "max_score": 100,
        "percentage": 40
      }
    ],
    "compliance_gaps": [
      {
        "category": "PSI",
        "description": "Control tehnic PSI expirat cu 4 luni",
        "severity": "critical"
      },
      {
        "category": "Evaluare Riscuri",
        "description": "Evaluare riscuri neactualizată pentru postul Electrician",
        "severity": "high"
      }
    ],
    "compliance_history": [
      {
        "date": "2025-11-15",
        "overall_score": 68,
        "notes": "După instruire generală SSM"
      },
      {
        "date": "2026-01-10",
        "overall_score": 62,
        "notes": "Control PSI expirat"
      }
    ]
  }'
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing or invalid [parameter_name] parameter"
}
```

### 500 Internal Server Error
```json
{
  "error": "AI service error",
  "details": "Status 500"
}
```

## Environment Variables

- `ANTHROPIC_API_KEY` - Required: Claude API key

## Deployment

```bash
# Deploy to Supabase
supabase functions deploy ai-compliance-advisor

# Set environment variable
supabase secrets set ANTHROPIC_API_KEY=your_api_key_here
```

## Use Cases

1. **Compliance Dashboard**: Generate real-time recommendations based on org compliance status
2. **Action Planning**: Create prioritized action plans with deadlines and cost estimates
3. **Risk Management**: Identify and prioritize compliance risks
4. **Audit Preparation**: Get strategic guidance before ITM/ISU inspections
5. **Progress Tracking**: Analyze compliance trends over time

## Legal Framework

Based on Romanian SSM/PSI legislation:
- Legea 319/2006 - SSM framework law
- Legea 307/2006 - PSI framework law
- HG 1425/2006 - Risk assessment methodology
- Industry-specific regulations

## Model

Uses Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) for expert-level compliance advisory.

## Cost Considerations

- Token usage varies based on input size (typically 2000-4000 tokens)
- Recommended to cache results and regenerate only when compliance data changes
- Consider implementing rate limiting for cost control
