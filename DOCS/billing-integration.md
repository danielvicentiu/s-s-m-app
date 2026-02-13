# Billing Integration Guide - Stripe

## Overview

This document describes the Stripe integration for s-s-m.ro platform, covering subscription management, multi-country pricing, usage metering, invoicing, and customer self-service portal.

**Stack:**
- Stripe API v2024-11-20+
- Next.js 14 App Router (Server Actions for mutations)
- Supabase (subscription state + audit trail)
- TypeScript strict mode

---

## 1. Products & Plans Setup

### 1.1 Product Structure

Create products in Stripe Dashboard (or via API):

**Product 1: SSM/PSI Consultant**
- Name: "SSM/PSI Consultant Plan"
- Description: "Full platform access for occupational health & fire safety consultants"
- Features:
  - Unlimited organizations management
  - Unlimited employees
  - Medical records tracking
  - Equipment & inspections
  - Training management
  - Alerts & notifications
  - Document generation
  - Audit logs

**Product 2: Company Admin**
- Name: "Company Admin Plan"
- Description: "Self-service access for companies managing their own compliance"
- Features:
  - Single organization
  - Up to 50 employees (base)
  - Medical records tracking
  - Equipment management
  - Training tracking
  - Basic alerts
  - Document storage

**Product 3: Employee Access** (optional, add-on)
- Name: "Employee Portal Access"
- Description: "Read-only access for employees to view their records"
- Priced per employee/month

### 1.2 Price Configuration Per Country

Create prices for each product in multiple currencies:

```typescript
// lib/stripe/config.ts
export const PRICE_CONFIG = {
  consultant: {
    RO: {
      priceId: 'price_consultant_ron_monthly',
      currency: 'RON',
      amount: 29900, // 299 RON/month
      interval: 'month'
    },
    BG: {
      priceId: 'price_consultant_bgn_monthly',
      currency: 'BGN',
      amount: 11900, // ~60 EUR in BGN
      interval: 'month'
    },
    HU: {
      priceId: 'price_consultant_huf_monthly',
      currency: 'HUF',
      amount: 2390000, // ~60 EUR in HUF
      interval: 'month'
    },
    DE: {
      priceId: 'price_consultant_eur_monthly',
      currency: 'EUR',
      amount: 5900, // 59 EUR/month
      interval: 'month'
    },
    EN: {
      priceId: 'price_consultant_eur_monthly', // Default to EUR
      currency: 'EUR',
      amount: 5900,
      interval: 'month'
    }
  },
  company: {
    RO: {
      priceId: 'price_company_ron_monthly',
      currency: 'RON',
      amount: 14900, // 149 RON/month
      interval: 'month'
    },
    BG: {
      priceId: 'price_company_bgn_monthly',
      currency: 'BGN',
      amount: 5900,
      interval: 'month'
    },
    // ... similar for HU, DE, EN
  }
} as const;

export type CountryCode = 'RO' | 'BG' | 'HU' | 'DE' | 'EN';
export type PlanType = 'consultant' | 'company';

export function getPriceId(plan: PlanType, country: CountryCode): string {
  return PRICE_CONFIG[plan][country].priceId;
}
```

**Stripe CLI setup:**

```bash
# Create prices programmatically
stripe prices create \
  --product prod_CONSULTANT_ID \
  --currency ron \
  --unit-amount 29900 \
  --recurring interval=month \
  --nickname "Consultant Plan - Romania (RON)"
```

---

## 2. Database Schema

### 2.1 Subscriptions Table

```sql
-- supabase/migrations/YYYYMMDD_add_billing_tables.sql

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Stripe references
  stripe_customer_id TEXT UNIQUE NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,

  -- Subscription details
  plan_type TEXT NOT NULL CHECK (plan_type IN ('consultant', 'company', 'employee_addon')),
  status TEXT NOT NULL CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'paused')),

  -- Billing cycle
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,

  -- Usage limits (for company plan)
  employee_limit INTEGER DEFAULT 50,

  -- Metadata
  trial_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_subscriptions_org ON subscriptions(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status) WHERE deleted_at IS NULL;

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their org subscriptions"
  ON subscriptions FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND deleted_at IS NULL
    )
  );

CREATE POLICY "Admins can manage subscriptions"
  ON subscriptions FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid()
      AND role IN ('consultant', 'firma_admin')
      AND deleted_at IS NULL
    )
  );
```

### 2.2 Usage Records Table (for metered billing)

```sql
CREATE TABLE usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Usage details
  metric_type TEXT NOT NULL CHECK (metric_type IN ('employees', 'documents', 'api_calls')),
  quantity INTEGER NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),

  -- Stripe sync
  stripe_usage_record_id TEXT,
  synced_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_usage_org_metric ON usage_records(organization_id, metric_type, recorded_at);
CREATE INDEX idx_usage_subscription ON usage_records(subscription_id);

-- Enable RLS
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their org usage"
  ON usage_records FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND deleted_at IS NULL
    )
  );
```

### 2.3 Invoices Table

```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,

  -- Stripe references
  stripe_invoice_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent_id TEXT,

  -- Invoice details
  invoice_number TEXT,
  amount_due INTEGER NOT NULL, -- in cents
  amount_paid INTEGER DEFAULT 0,
  currency TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'open', 'paid', 'uncollectible', 'void')),

  -- Dates
  invoice_date TIMESTAMPTZ NOT NULL,
  due_date TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,

  -- Files
  invoice_pdf_url TEXT,
  hosted_invoice_url TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoices_org ON invoices(organization_id);
CREATE INDEX idx_invoices_subscription ON invoices(subscription_id);
CREATE INDEX idx_invoices_stripe ON invoices(stripe_invoice_id);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their org invoices"
  ON invoices FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships
      WHERE user_id = auth.uid() AND deleted_at IS NULL
    )
  );
```

---

## 3. Checkout Flow

### 3.1 Server Action: Create Checkout Session

```typescript
// app/actions/billing.ts
'use server';

import { createSupabaseServer } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/client';
import { getPriceId, type PlanType, type CountryCode } from '@/lib/stripe/config';
import { redirect } from 'next/navigation';

export async function createCheckoutSession(
  organizationId: string,
  planType: PlanType,
  country: CountryCode
) {
  const supabase = await createSupabaseServer();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Utilizator neautentificat');
  }

  // Verify user has admin access to organization
  const { data: membership } = await supabase
    .from('memberships')
    .select('role')
    .eq('user_id', user.id)
    .eq('organization_id', organizationId)
    .is('deleted_at', null)
    .single();

  if (!membership || !['consultant', 'firma_admin'].includes(membership.role)) {
    throw new Error('Acces interzis');
  }

  // Get or create Stripe customer
  const { data: org } = await supabase
    .from('organizations')
    .select('name, email, stripe_customer_id')
    .eq('id', organizationId)
    .single();

  if (!org) {
    throw new Error('Organizație negăsită');
  }

  let customerId = org.stripe_customer_id;

  if (!customerId) {
    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: org.email || user.email,
      name: org.name,
      metadata: {
        organization_id: organizationId,
        user_id: user.id
      }
    });

    customerId = customer.id;

    // Save customer ID
    await supabase
      .from('organizations')
      .update({ stripe_customer_id: customerId })
      .eq('id', organizationId);
  }

  // Get price ID for plan and country
  const priceId = getPriceId(planType, country);

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/billing`,
    metadata: {
      organization_id: organizationId,
      user_id: user.id,
      plan_type: planType
    },
    subscription_data: {
      metadata: {
        organization_id: organizationId,
        plan_type: planType
      },
      trial_period_days: 14 // 14 days trial
    },
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    tax_id_collection: {
      enabled: true // Collect VAT/Tax IDs
    }
  });

  // Audit log
  await supabase.from('audit_log').insert({
    user_id: user.id,
    organization_id: organizationId,
    action: 'billing.checkout_created',
    details: { session_id: session.id, plan_type: planType }
  });

  redirect(session.url!);
}
```

### 3.2 Success Page Component

```typescript
// app/dashboard/billing/success/page.tsx
import { createSupabaseServer } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/client';
import { redirect } from 'next/navigation';

export default async function CheckoutSuccessPage({
  searchParams
}: {
  searchParams: { session_id?: string }
}) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    redirect('/dashboard/billing');
  }

  // Retrieve session to verify
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== 'paid') {
    redirect('/dashboard/billing?error=payment_failed');
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-green-900 mb-4">
          ✓ Abonament activat cu succes!
        </h1>
        <p className="text-green-700 mb-6">
          Plata a fost procesată și abonamentul dvs. este acum activ.
        </p>
        <a
          href="/dashboard/billing"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Vezi detalii abonament
        </a>
      </div>
    </div>
  );
}
```

---

## 4. Webhook Handling

### 4.1 Webhook Endpoint

```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role for webhooks
  { auth: { persistSession: false } }
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const organizationId = session.metadata?.organization_id;
  const planType = session.metadata?.plan_type;

  if (!organizationId || !planType) {
    console.error('Missing metadata in checkout session');
    return;
  }

  // Subscription will be created via customer.subscription.created event
  // Just log the successful checkout
  await supabaseAdmin.from('audit_log').insert({
    organization_id: organizationId,
    action: 'billing.checkout_completed',
    details: { session_id: session.id, plan_type: planType }
  });
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const organizationId = subscription.metadata.organization_id;

  if (!organizationId) {
    console.error('Missing organization_id in subscription metadata');
    return;
  }

  const subscriptionData = {
    organization_id: organizationId,
    stripe_customer_id: subscription.customer as string,
    stripe_subscription_id: subscription.id,
    stripe_price_id: subscription.items.data[0]?.price.id,
    plan_type: subscription.metadata.plan_type || 'company',
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
    trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
    updated_at: new Date().toISOString()
  };

  // Upsert subscription
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert(subscriptionData, {
      onConflict: 'stripe_subscription_id'
    });

  if (error) {
    console.error('Failed to upsert subscription:', error);
    throw error;
  }

  // Audit log
  await supabaseAdmin.from('audit_log').insert({
    organization_id: organizationId,
    action: 'billing.subscription_updated',
    details: { subscription_id: subscription.id, status: subscription.status }
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Failed to update canceled subscription:', error);
  }

  // Audit log
  const organizationId = subscription.metadata.organization_id;
  if (organizationId) {
    await supabaseAdmin.from('audit_log').insert({
      organization_id: organizationId,
      action: 'billing.subscription_canceled',
      details: { subscription_id: subscription.id }
    });
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  // Get subscription
  const { data: subscription } = await supabaseAdmin
    .from('subscriptions')
    .select('organization_id, id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!subscription) return;

  // Save invoice record
  await supabaseAdmin.from('invoices').upsert({
    organization_id: subscription.organization_id,
    subscription_id: subscription.id,
    stripe_invoice_id: invoice.id,
    stripe_payment_intent_id: invoice.payment_intent as string,
    invoice_number: invoice.number,
    amount_due: invoice.amount_due,
    amount_paid: invoice.amount_paid,
    currency: invoice.currency,
    status: invoice.status!,
    invoice_date: new Date(invoice.created * 1000).toISOString(),
    due_date: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
    paid_at: invoice.status_transitions.paid_at ? new Date(invoice.status_transitions.paid_at * 1000).toISOString() : null,
    invoice_pdf_url: invoice.invoice_pdf,
    hosted_invoice_url: invoice.hosted_invoice_url,
    updated_at: new Date().toISOString()
  }, {
    onConflict: 'stripe_invoice_id'
  });

  // Audit log
  await supabaseAdmin.from('audit_log').insert({
    organization_id: subscription.organization_id,
    action: 'billing.invoice_paid',
    details: {
      invoice_id: invoice.id,
      amount: invoice.amount_paid,
      currency: invoice.currency
    }
  });
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  const { data: subscription } = await supabaseAdmin
    .from('subscriptions')
    .select('organization_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!subscription) return;

  // Create alert for payment failure
  await supabaseAdmin.from('alerts').insert({
    organization_id: subscription.organization_id,
    title: 'Plată eșuată',
    description: `Plata pentru factura ${invoice.number} a eșuat. Vă rugăm să actualizați metoda de plată.`,
    type: 'payment_failed',
    severity: 'high',
    status: 'pending'
  });

  // Audit log
  await supabaseAdmin.from('audit_log').insert({
    organization_id: subscription.organization_id,
    action: 'billing.payment_failed',
    details: { invoice_id: invoice.id }
  });
}

async function handleTrialWillEnd(subscription: Stripe.Subscription) {
  const organizationId = subscription.metadata.organization_id;

  if (!organizationId) return;

  // Create alert 3 days before trial ends
  await supabaseAdmin.from('alerts').insert({
    organization_id: organizationId,
    title: 'Perioada de probă se încheie în curând',
    description: 'Perioada dvs. de probă se va încheia în 3 zile. Asigurați-vă că aveți o metodă de plată configurată.',
    type: 'trial_ending',
    severity: 'medium',
    status: 'pending'
  });
}
```

### 4.2 Webhook Configuration

**Via Stripe Dashboard:**
1. Go to Developers → Webhooks
2. Add endpoint: `https://app.s-s-m.ro/api/webhooks/stripe`
3. Select events:
   - checkout.session.completed
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.paid
   - invoice.payment_failed
   - customer.subscription.trial_will_end

**Via Stripe CLI (for testing):**

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Save the webhook secret to `.env.local`:
```
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

---

## 5. Usage Metering

### 5.1 Track Employee Count

```typescript
// lib/billing/usage.ts
import { createClient } from '@supabase/supabase-js';
import { stripe } from '@/lib/stripe/client';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function reportEmployeeUsage(organizationId: string) {
  // Get current employee count
  const { count } = await supabaseAdmin
    .from('employees')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .is('deleted_at', null);

  if (count === null) return;

  // Get subscription with metered pricing (if applicable)
  const { data: subscription } = await supabaseAdmin
    .from('subscriptions')
    .select('stripe_subscription_id, stripe_price_id')
    .eq('organization_id', organizationId)
    .eq('status', 'active')
    .single();

  if (!subscription) return;

  // Report usage to Stripe (for metered billing)
  // This requires the price to be configured as metered in Stripe
  try {
    const usageRecord = await stripe.subscriptionItems.createUsageRecord(
      subscription.stripe_subscription_id,
      {
        quantity: count,
        timestamp: Math.floor(Date.now() / 1000),
        action: 'set' // 'set' = replace total, 'increment' = add to total
      }
    );

    // Save local record
    await supabaseAdmin.from('usage_records').insert({
      subscription_id: subscription.stripe_subscription_id,
      organization_id: organizationId,
      metric_type: 'employees',
      quantity: count,
      stripe_usage_record_id: usageRecord.id,
      synced_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to report usage:', error);
  }
}

// Run daily via cron job or Edge Function
export async function syncAllUsageMetrics() {
  const { data: activeSubscriptions } = await supabaseAdmin
    .from('subscriptions')
    .select('organization_id')
    .eq('status', 'active');

  if (!activeSubscriptions) return;

  for (const sub of activeSubscriptions) {
    await reportEmployeeUsage(sub.organization_id);
  }
}
```

### 5.2 Enforce Limits

```typescript
// lib/billing/limits.ts
export async function checkEmployeeLimit(organizationId: string): Promise<boolean> {
  const supabase = await createSupabaseServer();

  // Get subscription limits
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('employee_limit')
    .eq('organization_id', organizationId)
    .eq('status', 'active')
    .single();

  if (!subscription) {
    // No active subscription = free tier limit
    const freeLimit = 5;
    const { count } = await supabase
      .from('employees')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .is('deleted_at', null);

    return (count || 0) < freeLimit;
  }

  // Check against subscription limit
  const { count } = await supabase
    .from('employees')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .is('deleted_at', null);

  return (count || 0) < subscription.employee_limit;
}
```

---

## 6. Customer Portal

### 6.1 Create Portal Session

```typescript
// app/actions/billing.ts
export async function createPortalSession(organizationId: string) {
  const supabase = await createSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Get Stripe customer ID
  const { data: org } = await supabase
    .from('organizations')
    .select('stripe_customer_id')
    .eq('id', organizationId)
    .single();

  if (!org?.stripe_customer_id) {
    throw new Error('No subscription found');
  }

  // Create portal session
  const session = await stripe.billingPortal.sessions.create({
    customer: org.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/billing`
  });

  redirect(session.url);
}
```

### 6.2 Portal Button Component

```typescript
// components/billing/PortalButton.tsx
'use client';

import { createPortalSession } from '@/app/actions/billing';
import { useState } from 'react';

export function CustomerPortalButton({ organizationId }: { organizationId: string }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await createPortalSession(organizationId);
    } catch (error) {
      console.error(error);
      alert('Eroare la deschiderea portalului');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? 'Se încarcă...' : 'Gestionează abonament'}
    </button>
  );
}
```

**Portal features (configured in Stripe Dashboard):**
- Update payment method
- View invoices
- Download receipts
- Cancel subscription
- Update billing address

---

## 7. Invoice PDF Generation

### 7.1 Custom Invoice Template (Optional)

If you need custom invoices beyond Stripe's default PDFs:

```typescript
// lib/billing/invoice-pdf.ts
import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';

export async function generateInvoicePDF(invoiceData: {
  invoiceNumber: string;
  organizationName: string;
  amount: number;
  currency: string;
  date: Date;
  items: Array<{ description: string; amount: number }>;
}) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const filename = `invoice-${invoiceData.invoiceNumber}.pdf`;
    const stream = createWriteStream(filename);

    doc.pipe(stream);

    // Header
    doc.fontSize(20).text('FACTURĂ', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Nr. ${invoiceData.invoiceNumber}`);
    doc.text(`Data: ${invoiceData.date.toLocaleDateString('ro-RO')}`);
    doc.moveDown();

    // Client info
    doc.text(`Client: ${invoiceData.organizationName}`);
    doc.moveDown();

    // Items
    doc.fontSize(14).text('Servicii:');
    invoiceData.items.forEach(item => {
      doc.fontSize(10).text(`${item.description}: ${item.amount} ${invoiceData.currency}`);
    });
    doc.moveDown();

    // Total
    doc.fontSize(14).text(`Total: ${invoiceData.amount} ${invoiceData.currency}`, { align: 'right' });

    doc.end();

    stream.on('finish', () => resolve(filename));
    stream.on('error', reject);
  });
}
```

**Note:** Stripe automatically generates invoice PDFs. Use custom generation only if you need specific Romanian compliance fields (e.g., CUI, series/number format).

---

## 8. Testing with Stripe CLI

### 8.1 Installation

```bash
# Windows (via Scoop)
scoop install stripe

# Or download from https://stripe.com/docs/stripe-cli
```

### 8.2 Login

```bash
stripe login
```

### 8.3 Test Webhooks Locally

```bash
# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# In another terminal, trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger invoice.paid
```

### 8.4 Test Payment Flow

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

Any future expiry date, any 3-digit CVC.

### 8.5 Create Test Products

```bash
# Create product
stripe products create --name="Test Consultant Plan"

# Create price
stripe prices create \
  --product=prod_XXX \
  --currency=ron \
  --unit-amount=29900 \
  --recurring interval=month
```

---

## 9. Environment Variables

```env
# .env.local

# Stripe keys (get from Dashboard)
STRIPE_PUBLIC_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase (existing)
NEXT_PUBLIC_SUPABASE_URL=https://uhccxfyvhjeudkexcgiq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

**Production (.env.production):**
```env
STRIPE_PUBLIC_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_live_xxxxx
NEXT_PUBLIC_SITE_URL=https://app.s-s-m.ro
```

---

## 10. Subscription Lifecycle States

| State | Description | User Actions | System Actions |
|-------|-------------|--------------|----------------|
| `trialing` | 14-day free trial active | Full access | Alert 3 days before end |
| `active` | Paid subscription active | Full access | Monthly invoice generation |
| `past_due` | Payment failed, retry in progress | Limited access (grace period) | Send payment alerts |
| `incomplete` | First payment failed | No access | Prompt to update payment |
| `canceled` | Canceled, active until period end | Full access until end date | Block access after period end |
| `paused` | Subscription paused (future feature) | Read-only access | No billing |

### Grace Period Logic

```typescript
// lib/billing/access.ts
export async function hasActiveSubscription(organizationId: string): Promise<boolean> {
  const supabase = await createSupabaseServer();

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status, current_period_end')
    .eq('organization_id', organizationId)
    .single();

  if (!subscription) return false;

  // Allow access during grace period (7 days past due)
  if (subscription.status === 'past_due') {
    const gracePeriodEnd = new Date(subscription.current_period_end);
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 7);
    return new Date() < gracePeriodEnd;
  }

  return ['active', 'trialing'].includes(subscription.status);
}
```

---

## 11. Migration Checklist

- [ ] Create Stripe account and get API keys
- [ ] Set up products and prices in Stripe Dashboard (or via CLI)
- [ ] Run database migration (subscriptions, usage_records, invoices tables)
- [ ] Add Stripe keys to environment variables
- [ ] Implement checkout flow (Server Action + success page)
- [ ] Deploy webhook endpoint to production
- [ ] Configure webhook in Stripe Dashboard (production endpoint)
- [ ] Test webhook with Stripe CLI locally
- [ ] Add Customer Portal integration
- [ ] Implement access control based on subscription status
- [ ] Set up usage metering (if using metered billing)
- [ ] Configure Stripe tax settings (VAT/TVA for EU countries)
- [ ] Test full flow: checkout → webhook → portal → cancellation
- [ ] Add billing page to dashboard UI
- [ ] Document for team in Romanian

---

## 12. Security Best Practices

1. **Never expose secret keys**: Only use `STRIPE_PUBLIC_KEY` on client
2. **Validate webhooks**: Always verify signature with `stripe.webhooks.constructEvent`
3. **Use service role for webhooks**: Bypass RLS with `SUPABASE_SERVICE_ROLE_KEY`
4. **Idempotency**: Stripe webhooks can retry; use `stripe_subscription_id` as unique key
5. **Audit everything**: Log all billing actions to `audit_log`
6. **Test mode first**: Always test in Stripe test mode before going live
7. **Rate limiting**: Add rate limiting to webhook endpoint (Vercel Edge Config)
8. **PCI compliance**: Never handle raw card data; let Stripe handle it

---

## 13. Support & Resources

- **Stripe Docs**: https://stripe.com/docs
- **Stripe CLI**: https://stripe.com/docs/stripe-cli
- **Webhook Testing**: https://stripe.com/docs/webhooks/test
- **Tax/VAT**: https://stripe.com/docs/tax
- **Customer Portal**: https://stripe.com/docs/billing/subscriptions/integrating-customer-portal

---

## Appendix: Quick Reference

### Price IDs (Update after creation)

```typescript
// lib/stripe/price-ids.ts
export const PRICE_IDS = {
  consultant_ron: 'price_xxxxx',
  consultant_eur: 'price_xxxxx',
  company_ron: 'price_xxxxx',
  company_eur: 'price_xxxxx',
} as const;
```

### Stripe CLI Commands

```bash
# List products
stripe products list

# List prices
stripe prices list

# Get customer
stripe customers retrieve cus_xxxxx

# Get subscription
stripe subscriptions retrieve sub_xxxxx

# Cancel subscription (test)
stripe subscriptions cancel sub_xxxxx

# Trigger webhook event
stripe trigger customer.subscription.updated
```

---

**Document Version:** 1.0
**Last Updated:** 2026-02-13
**Author:** Claude (AI Assistant)
**Status:** Ready for implementation
