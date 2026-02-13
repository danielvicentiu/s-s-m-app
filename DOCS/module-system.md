# OP-LEGO Module System Architecture

## Overview

The OP-LEGO (Operational LEGO) module system is a flexible, organization-specific architecture that allows granular activation of SSM/PSI compliance features. Each organization can enable only the modules they need, creating a customized compliance management experience.

**Philosophy**: Like LEGO blocks, modules are independent yet interconnected components that can be assembled in various combinations to build complete compliance solutions.

## Core Principles

1. **Module Independence**: Each module is self-contained with its own data models, UI, and business logic
2. **Declarative Activation**: Organizations explicitly enable modules via feature flags
3. **Dependency Management**: Modules declare their dependencies; system enforces activation order
4. **Progressive Enhancement**: New modules can be added without affecting existing ones
5. **Zero-Cost Abstraction**: Disabled modules have no runtime overhead or database footprint

---

## Module Catalog

### M1: Organizations & Memberships (CORE)
**Status**: ✅ Active
**Dependencies**: None (foundation module)
**Tables**: `organizations`, `memberships`, `profiles`

**Description**: Foundation module managing organization structure and user memberships. Always active.

**Features**:
- Organization creation and management
- User invitations and memberships
- Role assignment (transitioning to RBAC)
- Organization switching

---

### M2: Employees Management
**Status**: ✅ Active
**Dependencies**: M1
**Tables**: `employees`

**Description**: Employee registry with personal data, contracts, and organizational assignment.

**Features**:
- Employee CRUD operations
- Contract tracking (contract_number, contract_start/end)
- Department assignment
- Soft delete support
- Employee search and filtering

**Activation Check**:
```typescript
const { data: module } = await supabase
  .from('organization_modules')
  .select('enabled')
  .eq('organization_id', orgId)
  .eq('module_code', 'M2')
  .single();

if (!module?.enabled) {
  throw new Error('Employees module not enabled');
}
```

---

### M3: Medical Records & Monitoring
**Status**: ✅ Active
**Dependencies**: M2 (requires employees)
**Tables**: `medical_records`

**Description**: Medical examination tracking and health surveillance.

**Features**:
- Medical exam scheduling and recording
- Exam type tracking (angajare, periodic, reluare muncă)
- Medical contraindications management
- Expiration alerts
- Exam history per employee

**UI Location**: `/dashboard/medical`

---

### M4: Training & Certifications
**Status**: ✅ Active
**Dependencies**: M2
**Tables**: `trainings`, `training_sessions`, `training_participants`

**Description**: SSM/PSI training management and certification tracking.

**Features**:
- Training program definition
- Training session scheduling
- Participant tracking
- Certification issuance
- Training expiration monitoring
- Training history per employee

**UI Location**: `/dashboard/trainings`

---

### M5: Equipment & Tools Management
**Status**: ✅ Active
**Dependencies**: M1
**Tables**: `equipment`

**Description**: Work equipment and protective equipment inventory and inspection tracking.

**Features**:
- Equipment inventory (EIP, EPI, fire equipment)
- Inspection scheduling and recording
- Equipment assignment to employees
- Maintenance history
- Expiration alerts

**UI Location**: `/dashboard/equipment`

---

### M6: Documents & Templates
**Status**: ✅ Active
**Dependencies**: M1
**Tables**: `documents`, `document_templates`

**Description**: Document management with template-based generation.

**Features**:
- Document upload and storage
- Template management (SSM/PSI forms)
- Document generation from templates
- Document categorization
- Version control
- Document expiration tracking

**UI Location**: `/dashboard/documents`

---

### M7: Incidents & Accidents
**Status**: ✅ Active
**Dependencies**: M2
**Tables**: `incidents`

**Description**: Workplace incident reporting with ITM notification workflow.

**Features**:
- Incident registration (date, location, severity)
- Injury classification (mortal, collective, individual)
- Automatic ITM notification requirements
- Incident investigation tracking
- Incident statistics and reports
- Timeline tracking (discovery → reporting → resolution)

**UI Location**: `/dashboard/incidents`

**ITM Notification Logic**:
- Mortal accidents: immediate ITM notification required
- Collective accidents (3+ injured): ITM notification required
- Individual non-fatal: internal tracking only

---

### M8: Inspections & Checklists
**Status**: ✅ Active
**Dependencies**: M1
**Tables**: `inspection_checklists`, `inspection_items`, `inspection_results`

**Description**: Inspection preparation checklists for ITM and ISU/PSI audits.

**Features**:
- Pre-built checklists (ITM SSM, ISU/PSI)
- Checklist item completion tracking
- Deadline management
- Responsible person assignment
- Inspection readiness reports
- Gap analysis

**Checklist Types**:
- **ITM SSM**: 15-item checklist (registre, fișe, instructiuni, etc.)
- **ISU/PSI**: 15-item checklist (autorizații, avize, instalații, etc.)

**UI Location**: `/dashboard/inspections`

---

### M9: Alerts & Notifications
**Status**: ✅ Active
**Dependencies**: M1 (can integrate with M3, M4, M5, M6)
**Tables**: `alerts`, `alert_subscriptions`

**Description**: Multi-channel alert system for compliance deadlines and events.

**Features**:
- Alert rule configuration (type, threshold, recipients)
- Multi-channel delivery (email, SMS, in-app, push)
- Alert priority levels (low, medium, high, critical)
- Automatic alert triggers (expirations, deadlines)
- Alert history and acknowledgment
- Customizable alert templates

**Alert Types**:
- `medical_expiring`: Medical exams expiring soon
- `training_expiring`: Training certifications expiring
- `equipment_inspection_due`: Equipment inspection deadlines
- `document_expiring`: Document expirations
- `incident_reported`: New incident notifications
- `custom`: User-defined alerts

**UI Location**: `/dashboard/alerts`

---

### M10: GDPR Compliance
**Status**: ✅ Active
**Dependencies**: M2
**Tables**: `gdpr_consents`, `gdpr_requests`, `gdpr_audit_log`

**Description**: GDPR compliance tracking and data subject rights management.

**Features**:
- Consent tracking (photo, video, data processing)
- Data retention policy enforcement
- Right to access (SAR - Subject Access Request)
- Right to erasure (deletion requests)
- Right to portability (data export)
- Processing activity records (ROPA)
- GDPR audit trail

**Consent Types**:
- `photo_consent`: Photo usage permission
- `video_consent`: Video surveillance consent
- `data_processing`: Personal data processing consent
- `marketing`: Marketing communications consent

**UI Location**: `/dashboard/gdpr`

---

### M11: Penalties & Sanctions (FUTURE)
**Status**: 🔧 Planned
**Dependencies**: M1
**Tables**: `penalties` (exists but not fully implemented)

**Description**: ITM/ISU penalty tracking and compliance monitoring.

**Features** (Planned):
- Penalty registration from ITM/ISU inspections
- Fine amount tracking
- Rectification deadline management
- Appeal tracking
- Penalty statistics and reports
- Compliance improvement recommendations

**UI Location**: `/dashboard/penalties` (to be created)

---

## Module Dependencies Graph

```
M1 (Organizations) ← CORE
├── M2 (Employees)
│   ├── M3 (Medical)
│   ├── M4 (Training)
│   ├── M7 (Incidents)
│   └── M10 (GDPR)
├── M5 (Equipment)
├── M6 (Documents)
├── M8 (Inspections)
├── M9 (Alerts)
└── M11 (Penalties)
```

**Dependency Rules**:
- M1 is always enabled (core functionality)
- M3, M4, M7, M10 require M2 (need employee records)
- All other modules only require M1
- M9 (Alerts) can integrate with any module

---

## Module Activation System

### Database Schema

```sql
-- Module definitions
CREATE TABLE modules (
  code TEXT PRIMARY KEY,           -- 'M1', 'M2', etc.
  name TEXT NOT NULL,              -- 'Employees Management'
  description TEXT,
  dependencies TEXT[],             -- ['M1', 'M2']
  is_core BOOLEAN DEFAULT false,   -- Core modules cannot be disabled
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization-specific module activation
CREATE TABLE organization_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  module_code TEXT REFERENCES modules(code),
  enabled BOOLEAN DEFAULT false,
  enabled_at TIMESTAMPTZ,
  enabled_by UUID REFERENCES profiles(id),
  settings JSONB DEFAULT '{}',     -- Module-specific configuration
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(organization_id, module_code)
);

-- Index for fast lookups
CREATE INDEX idx_org_modules_enabled
ON organization_modules(organization_id, enabled)
WHERE enabled = true;
```

### Feature Flag Interface

```typescript
// lib/modules/types.ts
export type ModuleCode =
  | 'M1'  // Organizations (core)
  | 'M2'  // Employees
  | 'M3'  // Medical
  | 'M4'  // Training
  | 'M5'  // Equipment
  | 'M6'  // Documents
  | 'M7'  // Incidents
  | 'M8'  // Inspections
  | 'M9'  // Alerts
  | 'M10' // GDPR
  | 'M11'; // Penalties

export interface Module {
  code: ModuleCode;
  name: string;
  description: string;
  dependencies: ModuleCode[];
  isCore: boolean;
}

export interface OrganizationModule {
  id: string;
  organizationId: string;
  moduleCode: ModuleCode;
  enabled: boolean;
  enabledAt?: string;
  enabledBy?: string;
  settings?: Record<string, any>;
}

// lib/modules/registry.ts
export const MODULE_REGISTRY: Record<ModuleCode, Module> = {
  M1: {
    code: 'M1',
    name: 'Organizations & Memberships',
    description: 'Core organization and user management',
    dependencies: [],
    isCore: true,
  },
  M2: {
    code: 'M2',
    name: 'Employees Management',
    description: 'Employee registry and contract tracking',
    dependencies: ['M1'],
    isCore: false,
  },
  M3: {
    code: 'M3',
    name: 'Medical Records',
    description: 'Medical examination tracking',
    dependencies: ['M1', 'M2'],
    isCore: false,
  },
  // ... etc
};
```

### Module Activation API

```typescript
// lib/modules/activation.ts
import { createSupabaseServer } from '@/lib/supabase/server';
import { MODULE_REGISTRY } from './registry';

export async function enableModule(
  organizationId: string,
  moduleCode: ModuleCode,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createSupabaseServer();

  // 1. Check dependencies
  const module = MODULE_REGISTRY[moduleCode];
  const missingDeps = await checkDependencies(organizationId, module.dependencies);

  if (missingDeps.length > 0) {
    return {
      success: false,
      error: `Missing dependencies: ${missingDeps.join(', ')}`
    };
  }

  // 2. Enable module
  const { error } = await supabase
    .from('organization_modules')
    .upsert({
      organization_id: organizationId,
      module_code: moduleCode,
      enabled: true,
      enabled_at: new Date().toISOString(),
      enabled_by: userId,
    });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function isModuleEnabled(
  organizationId: string,
  moduleCode: ModuleCode
): Promise<boolean> {
  // Core modules always enabled
  if (MODULE_REGISTRY[moduleCode].isCore) {
    return true;
  }

  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from('organization_modules')
    .select('enabled')
    .eq('organization_id', organizationId)
    .eq('module_code', moduleCode)
    .single();

  return data?.enabled ?? false;
}

async function checkDependencies(
  organizationId: string,
  dependencies: ModuleCode[]
): Promise<ModuleCode[]> {
  const missing: ModuleCode[] = [];

  for (const dep of dependencies) {
    const enabled = await isModuleEnabled(organizationId, dep);
    if (!enabled) {
      missing.push(dep);
    }
  }

  return missing;
}
```

### UI Integration

```typescript
// components/ModuleGuard.tsx
'use client';

import { useEffect, useState } from 'react';
import { ModuleCode } from '@/lib/modules/types';
import { isModuleEnabled } from '@/lib/modules/activation';

interface ModuleGuardProps {
  moduleCode: ModuleCode;
  organizationId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ModuleGuard({
  moduleCode,
  organizationId,
  children,
  fallback
}: ModuleGuardProps) {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    isModuleEnabled(organizationId, moduleCode)
      .then(setEnabled)
      .finally(() => setLoading(false));
  }, [organizationId, moduleCode]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!enabled) {
    return fallback ?? (
      <div className="p-6 text-center">
        <p className="text-gray-500">
          Acest modul nu este activat pentru organizația dvs.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
```

---

## Creating a New Module

### Step-by-Step Guide

#### 1. Define Module Metadata

Add module definition to `lib/modules/registry.ts`:

```typescript
export const MODULE_REGISTRY: Record<ModuleCode, Module> = {
  // ... existing modules
  M12: {
    code: 'M12',
    name: 'Risk Assessment',
    description: 'Workplace risk evaluation and management',
    dependencies: ['M1', 'M2'],
    isCore: false,
  },
};
```

#### 2. Create Database Schema

Create migration file `docs/migration_m12_risk_assessment.sql`:

```sql
-- M12: Risk Assessment Module
CREATE TABLE risk_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  risk_type TEXT NOT NULL, -- 'mechanical', 'chemical', 'biological', etc.
  severity TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
  probability TEXT NOT NULL, -- 'unlikely', 'possible', 'probable', 'certain'
  risk_score INTEGER GENERATED ALWAYS AS (
    CASE severity
      WHEN 'low' THEN 1
      WHEN 'medium' THEN 2
      WHEN 'high' THEN 3
      WHEN 'critical' THEN 4
    END *
    CASE probability
      WHEN 'unlikely' THEN 1
      WHEN 'possible' THEN 2
      WHEN 'probable' THEN 3
      WHEN 'certain' THEN 4
    END
  ) STORED,
  mitigation_measures TEXT,
  status TEXT DEFAULT 'identified', -- 'identified', 'mitigated', 'accepted'
  assessed_by UUID REFERENCES profiles(id),
  assessed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view risks in their organization"
  ON risk_assessments FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships WHERE user_id = auth.uid()
    )
  );

-- Add module to registry
INSERT INTO modules (code, name, description, dependencies, is_core) VALUES
  ('M12', 'Risk Assessment', 'Workplace risk evaluation and management', ARRAY['M1', 'M2'], false);
```

#### 3. Create Types

```typescript
// lib/types.ts (add to existing types)
export interface RiskAssessment {
  id: string;
  organizationId: string;
  employeeId: string;
  riskType: 'mechanical' | 'chemical' | 'biological' | 'ergonomic' | 'psychosocial';
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: 'unlikely' | 'possible' | 'probable' | 'certain';
  riskScore: number;
  mitigationMeasures?: string;
  status: 'identified' | 'mitigated' | 'accepted';
  assessedBy?: string;
  assessedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### 4. Create API Routes

```typescript
// app/api/risk-assessments/route.ts
import { createSupabaseServer } from '@/lib/supabase/server';
import { isModuleEnabled } from '@/lib/modules/activation';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = await createSupabaseServer();
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('organizationId');

  if (!orgId) {
    return NextResponse.json({ error: 'Missing organizationId' }, { status: 400 });
  }

  // Check module activation
  const moduleEnabled = await isModuleEnabled(orgId, 'M12');
  if (!moduleEnabled) {
    return NextResponse.json(
      { error: 'Risk Assessment module not enabled' },
      { status: 403 }
    );
  }

  const { data, error } = await supabase
    .from('risk_assessments')
    .select('*')
    .eq('organization_id', orgId)
    .order('risk_score', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
```

#### 5. Create UI Components

```typescript
// app/dashboard/risk-assessment/page.tsx
import { ModuleGuard } from '@/components/ModuleGuard';
import { RiskAssessmentList } from '@/components/risk-assessment/RiskAssessmentList';

export default function RiskAssessmentPage() {
  return (
    <ModuleGuard
      moduleCode="M12"
      organizationId={currentOrgId}
      fallback={
        <div className="p-8 text-center">
          <h2 className="text-xl font-semibold">Modul Evaluare Riscuri</h2>
          <p className="text-gray-500 mt-2">
            Acest modul nu este activ. Contactați administratorul.
          </p>
        </div>
      }
    >
      <RiskAssessmentList />
    </ModuleGuard>
  );
}
```

#### 6. Add Navigation

Only show menu items for enabled modules:

```typescript
// components/Navigation.tsx
const menuItems = [
  { href: '/dashboard', label: 'Dashboard', module: 'M1' },
  { href: '/dashboard/employees', label: 'Angajați', module: 'M2' },
  { href: '/dashboard/medical', label: 'Medical', module: 'M3' },
  { href: '/dashboard/risk-assessment', label: 'Evaluare Riscuri', module: 'M12' },
];

const enabledItems = await Promise.all(
  menuItems.map(async (item) => ({
    ...item,
    enabled: await isModuleEnabled(orgId, item.module)
  }))
);

const visibleItems = enabledItems.filter(item => item.enabled);
```

#### 7. Register Module

Insert into database:

```sql
INSERT INTO modules (code, name, description, dependencies, is_core) VALUES
  ('M12', 'Risk Assessment', 'Workplace risk evaluation and management', ARRAY['M1', 'M2'], false);
```

#### 8. Enable for Organizations

Via admin UI or SQL:

```sql
INSERT INTO organization_modules (organization_id, module_code, enabled, enabled_by)
VALUES ('org-uuid-here', 'M12', true, 'admin-user-uuid');
```

---

## Module Configuration

Modules can have custom settings stored in `organization_modules.settings` (JSONB):

```typescript
// Example: M9 (Alerts) custom settings
{
  "emailEnabled": true,
  "smsEnabled": false,
  "defaultRecipients": ["admin@example.com"],
  "alertThresholds": {
    "medical_expiring": 30,  // days before expiration
    "training_expiring": 60
  }
}

// Example: M10 (GDPR) custom settings
{
  "retentionPeriod": 36,  // months
  "autoDeleteEnabled": false,
  "dpoEmail": "dpo@example.com",
  "consentRequired": ["photo", "video", "data_processing"]
}
```

Access settings:

```typescript
const { data } = await supabase
  .from('organization_modules')
  .select('settings')
  .eq('organization_id', orgId)
  .eq('module_code', 'M9')
  .single();

const alertThresholds = data?.settings?.alertThresholds;
```

---

## Migration Strategy

### Phase 1: Foundation (Current)
- ✅ All 11 modules implemented as monolithic features
- ✅ Features work but no activation control

### Phase 2: Schema Setup
- [ ] Create `modules` and `organization_modules` tables
- [ ] Populate `modules` table with M1-M11 definitions
- [ ] Enable all modules for existing organizations (backward compatibility)

### Phase 3: Code Refactoring
- [ ] Wrap UI routes with `ModuleGuard`
- [ ] Add module checks to API routes
- [ ] Update navigation to respect module activation

### Phase 4: Admin UI
- [ ] Create `/admin/modules` page for module management
- [ ] Allow enabling/disabling modules per organization
- [ ] Show dependency graph and warnings

### Phase 5: Optimization
- [ ] Add module usage analytics
- [ ] Optimize database queries with module filters
- [ ] Implement lazy loading for disabled modules

---

## Benefits

1. **Customization**: Each organization pays only for features they use
2. **Simplicity**: Disabled modules don't clutter the UI
3. **Performance**: Disabled modules have zero runtime cost
4. **Scalability**: Easy to add new modules without breaking existing ones
5. **Compliance**: Granular control over data processing (GDPR-friendly)
6. **Testing**: Easier to test modules in isolation

---

## Architectural Decisions

### Why JSONB for Settings?
- Flexibility: Each module can define custom configuration
- Schema evolution: No migrations needed for new settings
- Query performance: Postgres JSONB indexes support fast lookups

### Why Separate `modules` and `organization_modules`?
- Single source of truth for module definitions
- Many-to-many relationship (one module → many orgs)
- Easy to add module-level metadata (version, deprecation, etc.)

### Why Not Use Next.js Feature Flags?
- Organization-specific activation (not app-wide)
- Database-driven (no code deployments for activation)
- Runtime configuration (can change without restart)

### Why String Codes ('M1', 'M2')?
- Human-readable in database queries
- Stable identifiers (won't change with refactoring)
- Easy to reference in documentation and SQL

---

## Future Enhancements

1. **Module Marketplace**: Allow third-party module development
2. **Module Versioning**: Support multiple versions of same module
3. **Module Analytics**: Track usage metrics per module
4. **Module Dependencies Graph UI**: Visual representation of dependencies
5. **Module API**: Expose REST/GraphQL API for module management
6. **Module Templates**: Pre-configured module bundles (e.g., "SSM Starter Pack")
7. **Module Webhooks**: Trigger events on module enable/disable
8. **Module Audit**: Track all module activation changes

---

## Related Documentation

- `docs/DOC3_PLAN_EXECUTIE_v4.0.md` - RBAC migration plan
- `docs/DOC1_sistem_SSM.md` - Overall system architecture
- `docs/migration_*.sql` - Database migration files
- `lib/rbac.ts` - Role-based access control implementation

---

**Last Updated**: 2026-02-13
**Author**: Claude (based on s-s-m.ro codebase analysis)
**Status**: Architecture Document
