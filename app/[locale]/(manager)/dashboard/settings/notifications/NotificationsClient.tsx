// app/[locale]/dashboard/settings/notifications/NotificationsClient.tsx
// Client component — Notification settings with per-alert-type channel configuration

'use client';

import { useState } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  Moon,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react';

type NotificationChannel = 'email' | 'push' | 'sms' | 'whatsapp';
type NotificationTiming = 'immediate' | 'daily_digest' | 'weekly_digest';

interface AlertTypeSettings {
  channels: NotificationChannel[];
  timing: NotificationTiming;
  enabled: boolean;
}

interface NotificationSettings {
  training_expiring?: AlertTypeSettings;
  training_expired?: AlertTypeSettings;
  medical_expiring?: AlertTypeSettings;
  medical_expired?: AlertTypeSettings;
  equipment_expiring?: AlertTypeSettings;
  equipment_expired?: AlertTypeSettings;
  documents_pending?: AlertTypeSettings;
  documents_expiring?: AlertTypeSettings;
  legislation_updates?: AlertTypeSettings;
  incident_created?: AlertTypeSettings;
  compliance_critical?: AlertTypeSettings;
}

interface QuietHours {
  enabled: boolean;
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  days: number[]; // 0-6, 0 = Sunday
}

interface Props {
  userId: string;
  initialSettings: NotificationSettings;
  initialQuietHours: QuietHours;
}

// Alert type definitions with icons and descriptions
const ALERT_TYPES = [
  {
    key: 'training_expiring',
    label: 'Instruire în expirare',
    description: 'Instruiri care expiră în următoarele 30 de zile',
    icon: '📚',
    category: 'Instruiri',
  },
  {
    key: 'training_expired',
    label: 'Instruire expirată',
    description: 'Instruiri care au expirat și necesită reînnoire',
    icon: '⚠️',
    category: 'Instruiri',
  },
  {
    key: 'medical_expiring',
    label: 'Examen medical în expirare',
    description: 'Examene medicale care expiră în următoarele 30 de zile',
    icon: '🏥',
    category: 'Medicina Muncii',
  },
  {
    key: 'medical_expired',
    label: 'Examen medical expirat',
    description: 'Examene medicale expirate',
    icon: '🚨',
    category: 'Medicina Muncii',
  },
  {
    key: 'equipment_expiring',
    label: 'Echipament în expirare',
    description: 'Echipamente PSI/SSM care expiră în curând',
    icon: '🧯',
    category: 'Echipamente',
  },
  {
    key: 'equipment_expired',
    label: 'Echipament expirat',
    description: 'Echipamente expirate care necesită verificare/înlocuire',
    icon: '❌',
    category: 'Echipamente',
  },
  {
    key: 'documents_pending',
    label: 'Documente în așteptare',
    description: 'Documente care necesită semnătură sau aprobare',
    icon: '📄',
    category: 'Documente',
  },
  {
    key: 'documents_expiring',
    label: 'Documente în expirare',
    description: 'Autorizații, acreditări care expiră',
    icon: '📋',
    category: 'Documente',
  },
  {
    key: 'legislation_updates',
    label: 'Actualizări legislative',
    description: 'Modificări în legislația SSM/PSI relevantă',
    icon: '📜',
    category: 'Legislație',
  },
  {
    key: 'incident_created',
    label: 'Incident nou',
    description: 'Notificare imediată la raportarea unui incident',
    icon: '🆘',
    category: 'Incidente',
  },
  {
    key: 'compliance_critical',
    label: 'Conformitate critică',
    description: 'Alerte de conformitate cu termen scurt',
    icon: '⚡',
    category: 'Conformitate',
  },
];

const CHANNEL_INFO = {
  email: { icon: Mail, label: 'Email', color: 'blue' },
  push: { icon: Bell, label: 'Push', color: 'purple' },
  sms: { icon: Smartphone, label: 'SMS', color: 'green' },
  whatsapp: { icon: MessageSquare, label: 'WhatsApp', color: 'emerald' },
};

const TIMING_OPTIONS = [
  { value: 'immediate', label: 'Imediat', description: 'Notificare instantanee' },
  { value: 'daily_digest', label: 'Rezumat zilnic', description: 'O dată pe zi, dimineața' },
  { value: 'weekly_digest', label: 'Rezumat săptămânal', description: 'Lunea dimineața' },
];

const DAYS_OF_WEEK = [
  { value: 0, label: 'D' }, // Sunday
  { value: 1, label: 'L' },
  { value: 2, label: 'Ma' },
  { value: 3, label: 'Mi' },
  { value: 4, label: 'J' },
  { value: 5, label: 'V' },
  { value: 6, label: 'S' },
];

export default function NotificationsClient({
  userId,
  initialSettings,
  initialQuietHours,
}: Props) {
  const supabase = createSupabaseBrowser();

  // Initialize default settings for each alert type
  const defaultSettings: AlertTypeSettings = {
    channels: ['email'],
    timing: 'immediate',
    enabled: true,
  };

  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const initialized: NotificationSettings = {};
    ALERT_TYPES.forEach((alert) => {
      initialized[alert.key as keyof NotificationSettings] =
        initialSettings[alert.key as keyof NotificationSettings] || defaultSettings;
    });
    return initialized;
  });

  const [quietHours, setQuietHours] = useState<QuietHours>(
    initialQuietHours.enabled
      ? initialQuietHours
      : {
          enabled: false,
          start_time: '22:00',
          end_time: '08:00',
          days: [0, 1, 2, 3, 4, 5, 6], // All days by default
        }
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Toggle channel for specific alert type
  const toggleChannel = (alertKey: string, channel: NotificationChannel) => {
    setSettings((prev) => {
      const alertSettings = prev[alertKey as keyof NotificationSettings] || defaultSettings;
      const channels = alertSettings.channels.includes(channel)
        ? alertSettings.channels.filter((ch) => ch !== channel)
        : [...alertSettings.channels, channel];

      return {
        ...prev,
        [alertKey]: {
          ...alertSettings,
          channels,
        },
      };
    });
  };

  // Update timing for specific alert type
  const updateTiming = (alertKey: string, timing: NotificationTiming) => {
    setSettings((prev) => ({
      ...prev,
      [alertKey]: {
        ...(prev[alertKey as keyof NotificationSettings] || defaultSettings),
        timing,
      },
    }));
  };

  // Toggle alert type enabled/disabled
  const toggleAlertEnabled = (alertKey: string) => {
    setSettings((prev) => {
      const alertSettings = prev[alertKey as keyof NotificationSettings] || defaultSettings;
      return {
        ...prev,
        [alertKey]: {
          ...alertSettings,
          enabled: !alertSettings.enabled,
        },
      };
    });
  };

  // Toggle quiet hours day
  const toggleQuietHoursDay = (day: number) => {
    setQuietHours((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  // Save settings to database
  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // Upsert notification settings
      const { error: settingsError } = await supabase
        .from('user_preferences')
        .upsert(
          {
            user_id: userId,
            key: 'notification_settings',
            value: JSON.stringify(settings),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,key' }
        );

      if (settingsError) throw settingsError;

      // Upsert quiet hours
      const { error: quietHoursError } = await supabase
        .from('user_preferences')
        .upsert(
          {
            user_id: userId,
            key: 'quiet_hours',
            value: JSON.stringify(quietHours),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,key' }
        );

      if (quietHoursError) throw quietHoursError;

      setMessage({ type: 'success', text: 'Setări salvate cu succes!' });

      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error('Error saving notification settings:', error);
      setMessage({ type: 'error', text: 'Eroare la salvare: ' + error.message });
    } finally {
      setSaving(false);
    }
  };

  // Group alerts by category
  const groupedAlerts = ALERT_TYPES.reduce((acc, alert) => {
    if (!acc[alert.category]) {
      acc[alert.category] = [];
    }
    acc[alert.category].push(alert);
    return acc;
  }, {} as Record<string, typeof ALERT_TYPES>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/settings"
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Bell className="w-7 h-7 text-blue-600" />
                  Setări Notificări
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Configurare canale și frecvență notificări per tip de alertă
                </p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Se salvează...' : 'Salvează setări'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <div className="flex gap-4">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Personalizează notificările tale
              </h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                Configurează pentru fiecare tip de alertă canalele de notificare preferate (email,
                push, SMS, WhatsApp) și frecvența de livrare (imediat, rezumat zilnic sau
                săptămânal). Setările de quiet hours previne notificările în orele de odihnă.
              </p>
            </div>
          </div>
        </div>

        {/* Quiet Hours Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Moon className="w-6 h-6 text-purple-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Ore de liniște (Quiet Hours)</h2>
              <p className="text-sm text-gray-600 mt-0.5">
                Nu primi notificări în intervalul specificat
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Enable/Disable Toggle */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={quietHours.enabled}
                onChange={(e) =>
                  setQuietHours((prev) => ({ ...prev, enabled: e.target.checked }))
                }
                className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
              />
              <span className="font-medium text-gray-700 group-hover:text-gray-900">
                Activează orele de liniște
              </span>
            </label>

            {quietHours.enabled && (
              <>
                {/* Time Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Ora de început
                    </label>
                    <input
                      type="time"
                      value={quietHours.start_time}
                      onChange={(e) =>
                        setQuietHours((prev) => ({ ...prev, start_time: e.target.value }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Ora de sfârșit
                    </label>
                    <input
                      type="time"
                      value={quietHours.end_time}
                      onChange={(e) =>
                        setQuietHours((prev) => ({ ...prev, end_time: e.target.value }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Days of Week */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Zilele săptămânii
                  </label>
                  <div className="flex gap-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <button
                        key={day.value}
                        onClick={() => toggleQuietHoursDay(day.value)}
                        className={`flex-1 py-2 px-3 rounded-xl font-medium transition-colors ${
                          quietHours.days.includes(day.value)
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Alert Types Settings - Grouped by Category */}
        <div className="space-y-6">
          {Object.entries(groupedAlerts).map(([category, alerts]) => (
            <div key={category} className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{category}</h2>

              <div className="space-y-6">
                {alerts.map((alert) => {
                  const alertSettings =
                    settings[alert.key as keyof NotificationSettings] || defaultSettings;

                  return (
                    <div
                      key={alert.key}
                      className={`border rounded-xl p-5 transition-all ${
                        alertSettings.enabled
                          ? 'border-gray-200 bg-white'
                          : 'border-gray-100 bg-gray-50 opacity-60'
                      }`}
                    >
                      {/* Alert Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3 flex-1">
                          <span className="text-2xl">{alert.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">{alert.label}</h3>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={alertSettings.enabled}
                                  onChange={() => toggleAlertEnabled(alert.key)}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                          </div>
                        </div>
                      </div>

                      {alertSettings.enabled && (
                        <>
                          {/* Channels */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              Canale de notificare
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {(Object.keys(CHANNEL_INFO) as NotificationChannel[]).map(
                                (channel) => {
                                  const ChannelIcon = CHANNEL_INFO[channel].icon;
                                  const isActive = alertSettings.channels.includes(channel);

                                  return (
                                    <button
                                      key={channel}
                                      onClick={() => toggleChannel(alert.key, channel)}
                                      className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium transition-all ${
                                        isActive
                                          ? `bg-${CHANNEL_INFO[channel].color}-600 text-white shadow-sm`
                                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                      }`}
                                    >
                                      <ChannelIcon className="w-4 h-4" />
                                      <span className="text-sm">{CHANNEL_INFO[channel].label}</span>
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          </div>

                          {/* Timing */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              Frecvență notificări
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {TIMING_OPTIONS.map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() =>
                                    updateTiming(alert.key, option.value as NotificationTiming)
                                  }
                                  className={`text-left p-3 rounded-xl border-2 transition-all ${
                                    alertSettings.timing === option.value
                                      ? 'border-blue-600 bg-blue-50'
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <div className="font-medium text-gray-900 text-sm">
                                    {option.label}
                                  </div>
                                  <div className="text-xs text-gray-600 mt-0.5">
                                    {option.description}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Se salvează...' : 'Salvează toate setările'}
          </button>
        </div>
      </div>
    </div>
  );
}
