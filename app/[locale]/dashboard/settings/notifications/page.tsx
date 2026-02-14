// app/[locale]/dashboard/settings/notifications/page.tsx
// Notification Settings Page — Server Component
// Per-alert-type channel configuration (email, push, SMS, WhatsApp)

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import NotificationsClient from './NotificationsClient';

export const metadata = {
  title: 'Setări Notificări | s-s-m.ro',
  description: 'Configurare canale de notificare și preferințe alerte',
};

export default async function NotificationsSettingsPage() {
  const supabase = await createSupabaseServer();
  const { user, error: authError } = await getCurrentUserOrgs();

  if (!user || authError) {
    redirect('/login');
  }

  // Get user preferences for notifications
  const { data: preferencesData } = await supabase
    .from('user_preferences')
    .select('key, value')
    .eq('user_id', user.id)
    .in('key', ['notification_settings', 'quiet_hours']);

  // Parse preferences
  const preferences: Record<string, any> = {};
  preferencesData?.forEach((pref) => {
    try {
      preferences[pref.key] = JSON.parse(pref.value);
    } catch {
      preferences[pref.key] = pref.value;
    }
  });

  return (
    <NotificationsClient
      userId={user.id}
      initialSettings={preferences.notification_settings || {}}
      initialQuietHours={preferences.quiet_hours || {}}
    />
  );
}
