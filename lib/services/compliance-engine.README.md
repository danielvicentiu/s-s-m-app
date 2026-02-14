# Compliance Engine - Usage Guide

## Overview

The Compliance Engine (`lib/services/compliance-engine.ts`) provides comprehensive compliance scoring and gap analysis for organizations. It analyzes data across 6 categories and generates actionable reports.

## Quick Start

```typescript
import { getComplianceReport } from '@/lib/services/compliance-engine'

// Get complete compliance report
const report = await getComplianceReport(organizationId)

console.log('Overall Score:', report.overall_score) // 0-100
console.log('Critical Gaps:', report.gaps.filter(g => g.severity === 'critical'))
console.log('Next Actions:', report.next_actions)
```

## Report Structure

### 1. Overall Score (0-100)
Weighted average across all categories:
- Medical: 25%
- Training: 25%
- Equipment: 20%
- Documents: 10%
- Incidents: 10%
- Risk Assessments: 10%

### 2. Category Scores
Each category includes:
- `score`: Current score (0-100)
- `percentage`: Score as percentage
- `total_items`: Total items in category
- `compliant_items`: Items in good standing
- `expiring_items`: Items expiring within 30 days
- `expired_items`: Items already expired

**Example:**
```typescript
{
  training: {
    score: 85,
    percentage: 85,
    total_items: 100,
    compliant_items: 75,
    expiring_items: 15,
    expired_items: 10
  }
}
```

### 3. Gaps Array
Identified compliance gaps with:
- `category`: Which area has the gap
- `description`: Human-readable description (Romanian)
- `severity`: critical | high | medium | low
- `action_needed`: What to do about it
- `affected_count`: Number of items affected
- `department`: (optional) Specific department

**Example:**
```typescript
{
  category: 'medical',
  description: '15 fișe medicale expirate',
  severity: 'critical',
  action_needed: 'Programați controale medicale de urgență',
  affected_count: 15
}
```

### 4. Next Actions
Prioritized action items:
- `priority`: 1-10 (1 = most urgent)
- `action`: What needs to be done
- `category`: Related category
- `due_date`: Suggested completion date (ISO 8601)
- `affected_count`: Number of items

**Example:**
```typescript
{
  priority: 1,
  action: 'Programați controale medicale pentru fișele care expiră',
  category: 'medical',
  due_date: '2026-02-28',
  affected_count: 8
}
```

### 5. Department Scores
Per-department breakdown:
- `department`: Department name
- `overall_score`: Department score (0-100)
- `employee_count`: Number of employees
- `issues`: Breakdown of problems

**Example:**
```typescript
{
  department: 'Producție',
  overall_score: 72,
  employee_count: 45,
  issues: {
    expired_medical: 5,
    missing_trainings: 8,
    expired_equipment: 0
  }
}
```

### 6. Trends (30d and 90d)
Historical compliance trends:
```typescript
{
  date: '2026-02-14',
  overall_score: 85,
  training_score: 90,
  medical_score: 80,
  equipment_score: 85
}
```

**Note:** Currently returns empty arrays. Requires historical data table implementation.

## Scoring Logic

### Medical Records
- **Compliant (100%):** Valid until > 30 days
- **Expiring (50%):** Valid until ≤ 30 days
- **Expired (0%):** Past expiry date

### Trainings
- **Compliant (100%):** Training completed
- **Expiring (50%):** Training in progress
- **Expired (0%):** Training not started

### Equipment
- **Compliant (100%):** Valid and is_compliant = true
- **Expiring (50%):** Valid until ≤ 30 days
- **Expired (0%):** Past expiry date

### Documents
- **Compliant (100%):** Document is locked
- **Expiring (50%):** Document unlocked
- **Expired (0%):** N/A

### Incidents
- **Compliant (100%):** Incident closed
- **Expiring (50%):** Open non-critical incident
- **Expired (0%):** Critical open incident

### Risk Assessments
- **Compliant (100%):** Approved assessment
- **Expiring (50%):** Draft assessment
- **Expired (0%):** High-risk hazards (risk_level ≥ 15)

## Cache Management

Reports are cached for 1 hour per organization.

```typescript
import { clearComplianceCache, getCacheStats } from '@/lib/services/compliance-engine'

// Clear specific org cache
clearComplianceCache(organizationId)

// Clear all caches
clearComplianceCache()

// Get cache statistics
const stats = getCacheStats()
console.log('Cached reports:', stats.size)
console.log('Org IDs:', stats.keys)
```

## Data Sources

The engine queries these Supabase tables:
- `employees` - Employee list and departments
- `medical_records` - Medical examination records
- `training_assignments` + `training_sessions` - Training data
- `safety_equipment` - PSI equipment
- `generated_documents` - Generated compliance documents
- `incidents` - Incident reports
- `risk_assessments` + `risk_assessment_hazards` - Risk assessments

## Example: Dashboard Widget

```typescript
// app/[locale]/dashboard/compliance/page.tsx
import { getComplianceReport } from '@/lib/services/compliance-engine'

export default async function CompliancePage({ params }: { params: { locale: string } }) {
  const orgId = '...' // Get from session
  const report = await getComplianceReport(orgId)

  return (
    <div>
      <h1>Raport Conformitate</h1>

      {/* Overall Score */}
      <div className="text-4xl font-bold">
        {report.overall_score}%
      </div>

      {/* Critical Gaps */}
      <div>
        <h2>Probleme Critice</h2>
        {report.gaps
          .filter(g => g.severity === 'critical')
          .map(gap => (
            <div key={gap.description} className="bg-red-50 p-4">
              <p className="font-semibold">{gap.description}</p>
              <p className="text-sm">{gap.action_needed}</p>
            </div>
          ))
        }
      </div>

      {/* Next Actions */}
      <div>
        <h2>Acțiuni Următoare</h2>
        {report.next_actions.map(action => (
          <div key={action.priority}>
            {action.priority}. {action.action}
            {action.due_date && ` (până la ${action.due_date})`}
          </div>
        ))}
      </div>

      {/* Department Scores */}
      <div>
        <h2>Scoruri pe Departamente</h2>
        {report.per_department_scores.map(dept => (
          <div key={dept.department}>
            <strong>{dept.department}</strong>: {dept.overall_score}%
            ({dept.employee_count} angajați)
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Example: API Route

```typescript
// app/api/compliance/route.ts
import { getComplianceReport } from '@/lib/services/compliance-engine'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get org ID from query or user membership
  const url = new URL(request.url)
  const orgId = url.searchParams.get('orgId')

  if (!orgId) {
    return Response.json({ error: 'Missing orgId' }, { status: 400 })
  }

  try {
    const report = await getComplianceReport(orgId)
    return Response.json(report)
  } catch (error) {
    console.error('Compliance report error:', error)
    return Response.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}
```

## Performance

- **First call:** ~2-3 seconds (8 parallel queries)
- **Cached calls:** <10ms
- **Cache duration:** 1 hour
- **Recommendation:** Trigger cache refresh via cron job every hour

## Future Enhancements

1. **Historical Trends:**
   - Create `compliance_history` table
   - Store daily snapshots
   - Enable real trend analysis

2. **Benchmarking:**
   - Compare against industry averages
   - Show percentile ranking

3. **Predictive Analytics:**
   - Forecast upcoming compliance issues
   - Identify patterns

4. **Multi-country Support:**
   - Country-specific compliance rules
   - Different scoring weights per country

5. **Webhooks:**
   - Trigger webhooks on score changes
   - Alert on critical gaps

## Support

For issues or questions, contact the development team or refer to:
- `docs/DOC1_CONSOLIDARE_v9.2.md` - Platform documentation
- `CLAUDE.md` - Project guidelines
