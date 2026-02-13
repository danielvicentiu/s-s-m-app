'use client';

import { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, Users, Clock, Save, Loader2 } from 'lucide-react';

// Types pentru configurarea alertelor
export type AlertType = 'medical' | 'equipment' | 'training';
export type AlertChannel = 'email' | 'in_app' | 'both';
export type AlertRecipient = 'admin' | 'manager' | 'employee' | 'all';
export type ReminderFrequency = 'once' | 'daily' | 'weekly';

export interface AlertDayConfig {
  enabled: boolean;
  days: number;
}

export interface AlertTypeConfig {
  enabled: boolean;
  daysBefore: AlertDayConfig[];
  channels: AlertChannel;
  recipients: AlertRecipient[];
  reminderFrequency: ReminderFrequency;
}

export interface AlertSettings {
  medical: AlertTypeConfig;
  equipment: AlertTypeConfig;
  training: AlertTypeConfig;
}

interface AlertConfigFormProps {
  organizationId: string;
  initialSettings?: Partial<AlertSettings>;
  onSave?: (settings: AlertSettings) => Promise<void>;
  onCancel?: () => void;
}

// Configurație default
const defaultAlertConfig: AlertTypeConfig = {
  enabled: false,
  daysBefore: [
    { enabled: true, days: 30 },
    { enabled: true, days: 14 },
    { enabled: true, days: 7 },
    { enabled: true, days: 1 },
  ],
  channels: 'both',
  recipients: ['admin'],
  reminderFrequency: 'once',
};

const defaultSettings: AlertSettings = {
  medical: { ...defaultAlertConfig },
  equipment: { ...defaultAlertConfig },
  training: { ...defaultAlertConfig },
};

// Labels pentru afișare
const alertTypeLabels: Record<AlertType, { title: string; icon: string; description: string }> = {
  medical: {
    title: 'Fișe medicale',
    icon: '🏥',
    description: 'Alerte pentru expirarea fișelor medicale',
  },
  equipment: {
    title: 'Echipamente PSI',
    icon: '🧯',
    description: 'Alerte pentru verificări și expirări echipamente',
  },
  training: {
    title: 'Instruiri SSM',
    icon: '📚',
    description: 'Alerte pentru instruiri în curs sau restante',
  },
};

const channelLabels: Record<AlertChannel, string> = {
  email: 'Email',
  in_app: 'În aplicație',
  both: 'Ambele',
};

const recipientLabels: Record<AlertRecipient, string> = {
  admin: 'Administrator',
  manager: 'Manager',
  employee: 'Angajat',
  all: 'Toți',
};

const reminderFrequencyLabels: Record<ReminderFrequency, string> = {
  once: 'O singură dată',
  daily: 'Zilnic',
  weekly: 'Săptămânal',
};

export function AlertConfigForm({
  organizationId,
  initialSettings,
  onSave,
  onCancel,
}: AlertConfigFormProps) {
  const [settings, setSettings] = useState<AlertSettings>({
    ...defaultSettings,
    ...initialSettings,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  // Update config pentru un tip de alertă specific
  const updateAlertType = (type: AlertType, updates: Partial<AlertTypeConfig>) => {
    setSettings(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        ...updates,
      },
    }));
  };

  // Toggle zile înainte pentru un tip de alertă
  const toggleDayBefore = (type: AlertType, dayIndex: number) => {
    setSettings(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        daysBefore: prev[type].daysBefore.map((day, idx) =>
          idx === dayIndex ? { ...day, enabled: !day.enabled } : day
        ),
      },
    }));
  };

  // Toggle recipient
  const toggleRecipient = (type: AlertType, recipient: AlertRecipient) => {
    setSettings(prev => {
      const currentRecipients = prev[type].recipients;
      const newRecipients = currentRecipients.includes(recipient)
        ? currentRecipients.filter(r => r !== recipient)
        : [...currentRecipients, recipient];

      return {
        ...prev,
        [type]: {
          ...prev[type],
          recipients: newRecipients.length > 0 ? newRecipients : ['admin'],
        },
      };
    });
  };

  // Salvare setări
  const handleSave = async () => {
    setIsSaving(true);
    setSavedMessage(null);

    try {
      if (onSave) {
        await onSave(settings);
      }
      setSavedMessage('Configurația a fost salvată cu succes!');
      setTimeout(() => setSavedMessage(null), 3000);
    } catch (error) {
      console.error('Error saving alert settings:', error);
      setSavedMessage('Eroare la salvarea configurației.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
            <Bell className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Configurare Alerte</h2>
            <p className="text-sm text-gray-500">
              Configurați alertele pentru organizația dvs.
            </p>
          </div>
        </div>
      </div>

      {/* Success message */}
      {savedMessage && (
        <div
          className={`rounded-lg p-4 ${
            savedMessage.includes('Eroare')
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-green-50 text-green-800 border border-green-200'
          }`}
        >
          {savedMessage}
        </div>
      )}

      {/* Alert Types Configuration */}
      <div className="space-y-6">
        {(Object.keys(alertTypeLabels) as AlertType[]).map(type => {
          const config = settings[type];
          const labels = alertTypeLabels[type];

          return (
            <div key={type} className="rounded-2xl border border-gray-200 bg-white p-6">
              {/* Type Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{labels.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{labels.title}</h3>
                    <p className="text-sm text-gray-500">{labels.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={e => updateAlertType(type, { enabled: e.target.checked })}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                </label>
              </div>

              {/* Configuration (visible doar dacă enabled) */}
              {config.enabled && (
                <div className="space-y-4 border-t border-gray-100 pt-4">
                  {/* Zile înainte */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Clock className="h-4 w-4" />
                      Zile înainte de expirare
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {config.daysBefore.map((day, index) => (
                        <label
                          key={index}
                          className={`flex cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                            day.enabled
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={day.enabled}
                            onChange={() => toggleDayBefore(type, index)}
                            className="sr-only"
                          />
                          <span>{day.days} zile</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Canal notificare */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Mail className="h-4 w-4" />
                      Canal de notificare
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(Object.keys(channelLabels) as AlertChannel[]).map(channel => (
                        <label
                          key={channel}
                          className={`flex cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                            config.channels === channel
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`channel-${type}`}
                            checked={config.channels === channel}
                            onChange={() => updateAlertType(type, { channels: channel })}
                            className="sr-only"
                          />
                          <span>{channelLabels[channel]}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Destinatari */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Users className="h-4 w-4" />
                      Destinatari
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {(Object.keys(recipientLabels) as AlertRecipient[]).map(recipient => (
                        <label
                          key={recipient}
                          className={`flex cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                            config.recipients.includes(recipient)
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={config.recipients.includes(recipient)}
                            onChange={() => toggleRecipient(type, recipient)}
                            className="sr-only"
                          />
                          <span>{recipientLabels[recipient]}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Frecvență reminder */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Smartphone className="h-4 w-4" />
                      Frecvență reminder
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(Object.keys(reminderFrequencyLabels) as ReminderFrequency[]).map(
                        frequency => (
                          <label
                            key={frequency}
                            className={`flex cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                              config.reminderFrequency === frequency
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`frequency-${type}`}
                              checked={config.reminderFrequency === frequency}
                              onChange={() =>
                                updateAlertType(type, { reminderFrequency: frequency })
                              }
                              className="sr-only"
                            />
                            <span>{reminderFrequencyLabels[frequency]}</span>
                          </label>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
        {onCancel && (
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Anulează
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Se salvează...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Salvează configurația
            </>
          )}
        </button>
      </div>
    </div>
  );
}
