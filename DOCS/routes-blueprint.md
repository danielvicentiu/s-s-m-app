# s-s-m.ro — Routes Blueprint
> Versiune: 1.0 | Data: 2026-02-19 | Status: Reference document

## Convenții
- **Locale**: `app/[locale]/...` (ro, bg, hu, de, pl, en)
- **Route groups**: `(public)` / `(manager)` / `(worker)` / `(admin)`
- **Țara**: derivată din `org.country` (nu din URL pentru app)
- **Auth**: middleware.ts per route group

---

## 1) PUBLIC
```
/[locale]/
  (public)/
    page                        ✅ live
    pricing                     ✅ live
    features
    industries
    security
    status
    roadmap
    docs/
      getting-started
      integrations
      api
      changelog
    legal/
      terms
      privacy
      dpa
      cookies
    contact
```

---

## 2) AUTH
```
/[locale]/
  login                         ✅ live
  register
  auth/
    verify-email
    forgot-password
    reset-password
    mfa
    sso
    logout
```

---

## 3) MANAGER APP (dashboard B2B)
```
/[locale]/
  (manager)/
    dashboard/
      page                      ✅ live — overview
      employees/
        page                    ✅ live
        import                  ✅ live
        [employeeId]
      ssm/
        page                    ✅ live
        risk-assessment
        instructions
        trainings
        documents
      psi/
        page                    ✅ live
        extinguishers
        drills
        emergency-plans
        documents
      medical/
        page                    ✅ live
        exams
        providers
        documents
      iscir/
        page                    ✅ live
        equipment
        inspections
        documents
      gdpr/
        page                    ✅ live
        processing-activities
        data-subject-requests
        vendors
        documents
      nis2/
        page                    ✅ live
        controls
        incidents
        policies
        evidence
      training/
        page                    ✅ live
        courses
        assignments
        results
      alerts/
        page                    ✅ live
        rules                   ← P1 self-service
        notifications
        history
      reports/
        page                    ✅ live
        exports
        schedules
      ai-assistant/
        page                    ✅ live
        chat
        knowledge-base
      documents/
        page
        templates
        generator               ← P1 self-service
        archive
      incidents/
        page
        near-miss               ✅ live
        actions
      assets/
        page
        equipment
        inspections
      integrations/
        page
        email
        webhooks
        hr-import
        identity
      org/
        page
        settings
        locations
        members
        roles                   ← P1 self-service (după Capabilities)
        contractors
      security/
        page
        sessions
        devices
        api-keys
      audit/
        page
        search
        exports                 ← P2 (după audit_log hash chaining)
      billing/
        page
        plan
        invoices                ← P1 self-service
        payment-methods
        usage
      help/
        page
        onboarding              ← P1 self-service
        diagnostics             ← P2 (după correlation_id)
        faq
        support
```

---

## 4) WORKER PORTAL
```
/[locale]/
  (worker)/
    portal/
      page                      ← P1 (today feed: tasks + alerts)
      tasks/
        page
        [taskId]
      training/
        page
        [courseId]
        [courseId]/quiz
        [courseId]/certificate
      signatures/
        page
        [signatureId]
      documents/
        page
        [documentId]
      incidents/
        new
        history
      near-miss/
        new
        history
      ppe/
        page
      profile/
        page
        language
        consents
        notifications
      help/
        page
        faq
        contact
```

---

## 5) ADMIN / OPS (intern)
```
/[locale]/
  (admin)/
    admin/
      page                      ✅ live
      orgs/
        page
        [orgId]
        [orgId]/health          ← P2 ops
        [orgId]/audit
      users/
        page
        [userId]
      jobs/
        page
        runs
        failures
        retries
      pipeline/
        page                    ✅ live (M1-M7)
        runs
        sources
        errors
      legislation/
        page                    ✅ live
        sources
        batches
        diff
      batch                     ✅ live
      cron-dashboard            ✅ live
      iscir-daily               ✅ live
      feature-flags/
        page
      audit/
        page
      support/
        page
      billing/
        page
        disputes
      system/
        page
        logs
        status
```

---

## Ordine implementare recomandată

| Prioritate | Task | Effort | Dependință |
|-----------|------|--------|-----------|
| P0 | Route Groups restructurare | 5-6h CC | — |
| P0 | JWT app_metadata + RLS | 3-4h CC | — |
| P0 | Capabilities table + can() | 2-3h CC | JWT |
| P1 | /portal/ worker layout | 3-4h CC | Route Groups |
| P1 | alerts/rules + templates | 3-4h CC | — |
| P1 | documents/generator | 4-5h CC | — |
| P1 | billing/invoices (Stripe) | 4-5h CC | — |
| P1 | org/roles + simulator | 3-4h CC | Capabilities |
| P2 | audit_log hash chaining | 4-5h CC | — |
| P2 | FCM push notifications | 4-5h CC | — |
| P2 | help/diagnostics | 2-3h CC | correlation_id |
| P3 | /[country]/[locale]/ public | 3-4h CC | — |

---

## Legende
- ✅ live — implementat și deployed pe main
- ← P0/P1/P2/P3 — prioritate implementare
- Fără marcaj — planificat, neimplementat
