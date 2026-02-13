import { createSupabaseBrowser } from '@/lib/supabase/client';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

/**
 * Realtime Dashboard Service
 *
 * Provides real-time subscriptions for dashboard widgets to auto-refresh
 * when data changes in Supabase (alerts, employees, trainings).
 */

export type AlertPayload = {
  id: string;
  organization_id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  related_entity_type?: string;
  related_entity_id?: string;
  resolved_at?: string | null;
  created_at: string;
};

export type EmployeePayload = {
  id: string;
  organization_id: string;
  first_name: string;
  last_name: string;
  position?: string;
  status: 'active' | 'inactive' | 'suspended';
  deleted_at?: string | null;
};

export type TrainingPayload = {
  id: string;
  organization_id: string;
  title: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  scheduled_date?: string;
  completed_date?: string;
  deleted_at?: string | null;
};

/**
 * Subscribe to real-time alerts for an organization
 * Triggers callback when new alerts are created or existing ones are updated
 */
export function subscribeToAlerts(
  orgId: string,
  onNewAlert: (payload: RealtimePostgresChangesPayload<AlertPayload>) => void
): RealtimeChannel {
  const supabase = createSupabaseBrowser();

  const channel = supabase
    .channel(`alerts-${orgId}`)
    .on(
      'postgres_changes',
      {
        event: '*', // Listen to INSERT, UPDATE, DELETE
        schema: 'public',
        table: 'alerts',
        filter: `organization_id=eq.${orgId}`,
      },
      (payload) => {
        console.log('Real-time alert update:', payload);
        onNewAlert(payload as RealtimePostgresChangesPayload<AlertPayload>);
      }
    )
    .subscribe((status) => {
      console.log(`Alerts subscription status for org ${orgId}:`, status);
    });

  return channel;
}

/**
 * Subscribe to real-time employee changes for an organization
 * Triggers callback when employees are added, updated, or deleted
 */
export function subscribeToEmployeeChanges(
  orgId: string,
  onChange: (payload: RealtimePostgresChangesPayload<EmployeePayload>) => void
): RealtimeChannel {
  const supabase = createSupabaseBrowser();

  const channel = supabase
    .channel(`employees-${orgId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'employees',
        filter: `organization_id=eq.${orgId}`,
      },
      (payload) => {
        console.log('Real-time employee update:', payload);
        onChange(payload as RealtimePostgresChangesPayload<EmployeePayload>);
      }
    )
    .subscribe((status) => {
      console.log(`Employees subscription status for org ${orgId}:`, status);
    });

  return channel;
}

/**
 * Subscribe to real-time training updates for an organization
 * Triggers callback when trainings are scheduled, completed, or cancelled
 */
export function subscribeToTrainingUpdates(
  orgId: string,
  onUpdate: (payload: RealtimePostgresChangesPayload<TrainingPayload>) => void
): RealtimeChannel {
  const supabase = createSupabaseBrowser();

  const channel = supabase
    .channel(`trainings-${orgId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'trainings',
        filter: `organization_id=eq.${orgId}`,
      },
      (payload) => {
        console.log('Real-time training update:', payload);
        onUpdate(payload as RealtimePostgresChangesPayload<TrainingPayload>);
      }
    )
    .subscribe((status) => {
      console.log(`Trainings subscription status for org ${orgId}:`, status);
    });

  return channel;
}

/**
 * Subscribe to multiple dashboard updates at once
 * Returns an object with all channels for easy cleanup
 */
export function subscribeToDashboard(
  orgId: string,
  callbacks: {
    onAlert?: (payload: RealtimePostgresChangesPayload<AlertPayload>) => void;
    onEmployeeChange?: (payload: RealtimePostgresChangesPayload<EmployeePayload>) => void;
    onTrainingUpdate?: (payload: RealtimePostgresChangesPayload<TrainingPayload>) => void;
  }
): {
  alertsChannel: RealtimeChannel | null;
  employeesChannel: RealtimeChannel | null;
  trainingsChannel: RealtimeChannel | null;
  unsubscribeAll: () => void;
} {
  const channels: RealtimeChannel[] = [];

  const alertsChannel = callbacks.onAlert
    ? subscribeToAlerts(orgId, callbacks.onAlert)
    : null;

  const employeesChannel = callbacks.onEmployeeChange
    ? subscribeToEmployeeChanges(orgId, callbacks.onEmployeeChange)
    : null;

  const trainingsChannel = callbacks.onTrainingUpdate
    ? subscribeToTrainingUpdates(orgId, callbacks.onTrainingUpdate)
    : null;

  if (alertsChannel) channels.push(alertsChannel);
  if (employeesChannel) channels.push(employeesChannel);
  if (trainingsChannel) channels.push(trainingsChannel);

  const unsubscribeAll = () => {
    const supabase = createSupabaseBrowser();
    channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    console.log(`Unsubscribed from all dashboard channels for org ${orgId}`);
  };

  return {
    alertsChannel,
    employeesChannel,
    trainingsChannel,
    unsubscribeAll,
  };
}

/**
 * Cleanup helper for a single channel
 * Call this in component unmount or cleanup
 */
export function unsubscribeChannel(channel: RealtimeChannel): void {
  const supabase = createSupabaseBrowser();
  supabase.removeChannel(channel);
}
