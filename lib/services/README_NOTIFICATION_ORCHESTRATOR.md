# Notification Orchestrator Service

Centralized notification dispatch system for the s-s-m.ro platform with intelligent routing, deduplication, and batch digest capabilities.

## Overview

The Notification Orchestrator is a comprehensive service that manages all outgoing notifications across multiple channels (email, SMS, WhatsApp, push, in-app) with respect to user preferences, quiet hours, and organizational settings.

## Features

### ✅ Multi-Channel Support
- **Email** - via Resend API (send-email-batch function)
- **SMS** - via Twilio (planned)
- **WhatsApp** - via Twilio (send-whatsapp function)
- **Push** - Web push notifications (planned)
- **In-App** - Dashboard notifications

### ✅ Intelligent Routing
- Organization preferred channels
- User-level channel preferences
- Priority-based overrides
- Fallback channel support

### ✅ Deduplication
- Configurable time windows (default: 60 minutes)
- Custom deduplication keys
- Per-user, per-organization, or per-resource granularity
- Automatic cleanup of expired entries

### ✅ Batch Digest Mode
- Hourly digest for non-urgent notifications
- Daily digest for low-priority updates
- Grouped by notification type
- Reduces notification fatigue

### ✅ Quiet Hours
- User-defined quiet hours (e.g., 22:00-08:00)
- Non-urgent notifications queued for later
- Urgent notifications bypass quiet hours
- Timezone-aware scheduling

### ✅ Priority Handling
- **Low** - Can be batched, respects quiet hours
- **Medium** - Can be batched, respects quiet hours
- **High** - Immediate delivery, respects quiet hours
- **Urgent** - Immediate delivery, bypasses quiet hours

## Database Schema

### Tables Created

#### `notification_deduplication`
Prevents duplicate notifications within configurable time windows.

```sql
CREATE TABLE notification_deduplication (
  id UUID PRIMARY KEY,
  dedup_key TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### `notification_batch_queue`
Stores notifications for digest mode delivery.

```sql
CREATE TABLE notification_batch_queue (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  organization_id UUID NOT NULL,
  notification_type TEXT NOT NULL,
  priority TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  channels TEXT[] NOT NULL,
  digest_mode TEXT NOT NULL, -- 'hourly' | 'daily'
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### `notification_queue`
Stores scheduled/delayed notifications (quiet hours, etc.).

```sql
CREATE TABLE notification_queue (
  id UUID PRIMARY KEY,
  user_id UUID,
  organization_id UUID NOT NULL,
  notification_type TEXT NOT NULL,
  priority TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  channels TEXT[] NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### `in_app_notifications`
In-app push notifications visible in dashboard.

```sql
CREATE TABLE in_app_notifications (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  organization_id UUID NOT NULL,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL,
  action_url TEXT,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  archived_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Cleanup Functions

- `cleanup_expired_deduplication()` - Remove expired dedup entries
- `cleanup_old_batch_queue()` - Remove processed batches older than 30 days
- `cleanup_old_notification_queue()` - Remove processed queue entries older than 30 days
- `cleanup_old_in_app_notifications()` - Remove read notifications older than 90 days
- `cleanup_expired_in_app_notifications()` - Remove expired notifications

## Usage

### Basic Usage

```typescript
import { sendNotification } from '@/lib/services/notification-orchestrator';

// Send a medical expiry alert
await sendNotification({
  type: 'alert_medical_expiry',
  organizationId: 'org-uuid',
  userId: 'user-uuid',
  priority: 'high',
  subject: 'Aviz Medical Expiră în 7 Zile',
  message: 'Avizul medical pentru angajatul Ion Popescu expiră pe 2026-02-20.',
  data: {
    employeeName: 'Ion Popescu',
    expiryDate: '2026-02-20',
    daysLeft: 7,
  },
  actionUrl: 'https://app.s-s-m.ro/dashboard/medical',
});
```

### Advanced Usage

```typescript
import { NotificationOrchestrator } from '@/lib/services/notification-orchestrator';

const orchestrator = new NotificationOrchestrator();

// Send with custom deduplication
await orchestrator.sendNotification({
  type: 'alert_equipment_expiry',
  organizationId: 'org-uuid',
  userId: 'user-uuid',
  priority: 'medium',
  subject: 'Stingător Necesită Verificare',
  message: 'Stingătorul din hol expiră în 15 zile.',

  // Custom deduplication
  deduplicationKey: 'equipment:stingator-123:expiry',
  deduplicationWindow: 120, // 2 hours

  // Allow batching
  allowBatching: true,
  batchWindow: 30, // minutes

  // Custom data
  data: {
    equipmentId: 'stingator-123',
    equipmentType: 'stingator',
    location: 'Hol etaj 1',
    expiryDate: '2026-02-28',
  },

  actionUrl: 'https://app.s-s-m.ro/dashboard/equipment/stingator-123',
});
```

### Force Specific Channels

```typescript
// Send urgent alert via all channels
await sendNotification({
  type: 'system_alert',
  organizationId: 'org-uuid',
  userId: 'user-uuid',
  priority: 'urgent',
  subject: 'URGENT: Acțiune Necesară',
  message: 'Inspectoratul ITM a programat o verificare mâine.',

  // Force specific channels, ignore user preferences
  channels: ['email', 'sms', 'whatsapp', 'push'],
  forceChannels: true,

  data: {
    inspectionDate: '2026-02-14',
    authority: 'ITM București',
  },
});
```

### Batch Digest Processing (Cron Job)

```typescript
import { processBatchDigests } from '@/lib/services/notification-orchestrator';

// In cron job (hourly)
const result = await processBatchDigests('hourly');
console.log(`Processed: ${result.processed}, Sent: ${result.sent}, Errors: ${result.errors}`);

// In cron job (daily)
const result = await processBatchDigests('daily');
console.log(`Processed: ${result.processed}, Sent: ${result.sent}, Errors: ${result.errors}`);
```

## Notification Types

```typescript
type NotificationType =
  | 'alert_medical_expiry'        // Medical examination expiring
  | 'alert_equipment_expiry'      // Equipment inspection due
  | 'alert_document_expiry'       // Document expiring
  | 'alert_training_reminder'     // Training session reminder
  | 'alert_inspection_due'        // Inspection scheduled
  | 'alert_compliance_deadline'   // Compliance deadline approaching
  | 'report_monthly'              // Monthly report
  | 'report_weekly'               // Weekly report
  | 'fraud_alert'                 // Fraud detection alert
  | 'system_alert'                // System notification
  | 'audit_log_alert'             // Audit log alert
  | 'custom';                     // Custom notification
```

## User Preferences

Users can configure notification preferences via the dashboard:

```typescript
// User preferences stored in user_preferences table
{
  email_notifications: true,        // Enable/disable email
  sms_notifications: false,         // Enable/disable SMS
  whatsapp_notifications: true,     // Enable/disable WhatsApp
  push_notifications: true,         // Enable/disable push
  digest_mode: 'realtime',          // 'realtime' | 'hourly' | 'daily'
  quiet_hours_start: '22:00',       // Quiet hours start (HH:MM)
  quiet_hours_end: '08:00',         // Quiet hours end (HH:MM)
}
```

## Organization Settings

Organizations configure default channels:

```typescript
// In organizations table
{
  preferred_channels: ['email', 'whatsapp'],  // Default channels
  country_code: 'RO',                         // For timezone/formatting
  timezone: 'Europe/Bucharest',               // For scheduling
}
```

## Integration with Existing Systems

### Email Integration

Uses the existing `send-email-batch` Edge Function:
- Leverages Resend API
- Uses predefined templates
- Logs to `email_delivery_log` table

### WhatsApp Integration

Uses the existing `send-whatsapp` Edge Function:
- Leverages Twilio API
- Uses approved WhatsApp templates
- Logs to `whatsapp_delivery_log` table

### Alert System Integration

The orchestrator integrates with the existing alert check system (`app/api/alerts/check/route.ts`):

```typescript
// Example: Refactor existing alert check to use orchestrator
import { sendNotification } from '@/lib/services/notification-orchestrator';

for (const alert of alerts) {
  await sendNotification({
    type: 'alert_medical_expiry',
    organizationId: alert.org_id,
    priority: alert.urgency === 'expired' ? 'urgent' : 'high',
    subject: `Aviz Medical ${alert.urgency === 'expired' ? 'EXPIRAT' : 'Expiră'}`,
    message: `${alert.employee_name} - ${alert.expiry_date}`,
    data: {
      employeeName: alert.employee_name,
      expiryDate: alert.expiry_date,
      daysLeft: alert.days_left,
    },
  });
}
```

## Migration Steps

1. **Run SQL Migration**
   ```bash
   # Apply migration to Supabase
   supabase db push
   ```

2. **Update Environment Variables** (if needed)
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-url
   SUPABASE_SERVICE_ROLE_KEY=your-key
   ```

3. **Test Notification Sending**
   ```typescript
   // Test in development
   await sendNotification({
     type: 'system_alert',
     organizationId: 'test-org',
     userId: 'test-user',
     priority: 'low',
     subject: 'Test Notification',
     message: 'This is a test.',
   });
   ```

4. **Setup Cron Jobs** (Vercel Cron or scheduled functions)
   - Hourly digest: `processBatchDigests('hourly')`
   - Daily digest: `processBatchDigests('daily')`
   - Cleanup: Call cleanup functions weekly

## Best Practices

### 1. Always Set Priority Correctly
- `urgent` - For critical alerts requiring immediate action
- `high` - For important alerts that should be delivered soon
- `medium` - For routine notifications (can be batched)
- `low` - For informational updates (can be batched)

### 2. Use Deduplication Keys
Prevent duplicate notifications for the same event:

```typescript
deduplicationKey: `medical:${employeeId}:expiry:${expiryDate}`,
deduplicationWindow: 60, // Don't send again within 1 hour
```

### 3. Enable Batching for Non-Urgent Notifications
Reduce notification fatigue:

```typescript
allowBatching: true,
batchWindow: 30, // Can wait up to 30 minutes for similar notifications
```

### 4. Provide Action URLs
Always include a link to relevant dashboard page:

```typescript
actionUrl: `https://app.s-s-m.ro/dashboard/medical/${recordId}`,
```

### 5. Include Rich Data
Pass all relevant data for email templates:

```typescript
data: {
  employeeName: 'Ion Popescu',
  expiryDate: '2026-02-20',
  daysLeft: 7,
  jobTitle: 'Sudor',
  examinationType: 'periodic',
},
```

## Performance Considerations

- **Deduplication** - Indexed lookups, auto-cleanup of expired entries
- **Batch Processing** - Efficient grouping and digest generation
- **Channel Dispatch** - Parallel execution with Promise.allSettled
- **Database Queries** - Optimized with proper indexes
- **Cleanup Jobs** - Regular cleanup prevents table bloat

## Security

- **RLS Policies** - All tables have Row Level Security enabled
- **Service Role** - Orchestrator uses service role for privileged operations
- **User Isolation** - Users can only view their own notifications
- **Audit Trail** - All notifications logged to `notification_log` table

## Monitoring

Track notification metrics:

```sql
-- Notification success rate by channel
SELECT
  channel,
  COUNT(*) as total,
  SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
  ROUND(100.0 * SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate
FROM notification_log
WHERE sent_at > NOW() - INTERVAL '7 days'
GROUP BY channel;

-- Deduplication effectiveness
SELECT
  COUNT(*) as total_dedup_hits,
  COUNT(DISTINCT dedup_key) as unique_keys
FROM notification_deduplication
WHERE created_at > NOW() - INTERVAL '7 days';

-- Batch digest stats
SELECT
  digest_mode,
  COUNT(*) as queued,
  SUM(CASE WHEN processed THEN 1 ELSE 0 END) as processed
FROM notification_batch_queue
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY digest_mode;
```

## Troubleshooting

### Notifications Not Sending

1. Check user preferences - ensure channel is enabled
2. Check organization settings - ensure channel is in `preferred_channels`
3. Check quiet hours - non-urgent notifications may be queued
4. Check deduplication - may be preventing duplicate sends
5. Check logs in `notification_log` table for errors

### Batch Digests Not Processing

1. Ensure cron job is running
2. Check `notification_batch_queue` table for pending entries
3. Check user email addresses are valid
4. Check `processed` flag is being set correctly

### Deduplication Not Working

1. Verify deduplication keys are consistent
2. Check `notification_deduplication` table
3. Ensure cleanup function is running regularly
4. Verify time windows are set correctly

## Future Enhancements

- [ ] SMS integration via Twilio
- [ ] Web push notifications via service workers
- [ ] WhatsApp Business API templates
- [ ] Notification preferences UI in dashboard
- [ ] A/B testing for notification content
- [ ] Advanced analytics dashboard
- [ ] Rate limiting per channel
- [ ] Retry logic with exponential backoff
- [ ] Notification templates manager
- [ ] Multi-language support for notifications

## License

Part of the s-s-m.ro platform © 2026
