/**
 * Timezone configuration for SSM platform
 * Supports Romania, Bulgaria, Hungary, Germany, Poland, and UTC
 */

export interface Timezone {
  id: string;
  name: string;
  offset: string;
  dstOffset: string;
  label: string;
  country: string;
}

export const timezones: Timezone[] = [
  {
    id: 'Europe/Bucharest',
    name: 'Eastern European Time',
    offset: '+02:00',
    dstOffset: '+03:00',
    label: 'București (EET, UTC+2/+3)',
    country: 'RO'
  },
  {
    id: 'Europe/Sofia',
    name: 'Eastern European Time',
    offset: '+02:00',
    dstOffset: '+03:00',
    label: 'Sofia (EET, UTC+2/+3)',
    country: 'BG'
  },
  {
    id: 'Europe/Budapest',
    name: 'Central European Time',
    offset: '+01:00',
    dstOffset: '+02:00',
    label: 'Budapest (CET, UTC+1/+2)',
    country: 'HU'
  },
  {
    id: 'Europe/Berlin',
    name: 'Central European Time',
    offset: '+01:00',
    dstOffset: '+02:00',
    label: 'Berlin (CET, UTC+1/+2)',
    country: 'DE'
  },
  {
    id: 'Europe/Warsaw',
    name: 'Central European Time',
    offset: '+01:00',
    dstOffset: '+02:00',
    label: 'Warsaw (CET, UTC+1/+2)',
    country: 'PL'
  },
  {
    id: 'UTC',
    name: 'Coordinated Universal Time',
    offset: '+00:00',
    dstOffset: '+00:00',
    label: 'UTC (Coordinated Universal Time)',
    country: 'INTL'
  }
];

/**
 * Get timezone by ID
 */
export function getTimezoneById(id: string): Timezone | undefined {
  return timezones.find(tz => tz.id === id);
}

/**
 * Get timezones by country code
 */
export function getTimezonesByCountry(countryCode: string): Timezone[] {
  return timezones.filter(tz => tz.country === countryCode.toUpperCase());
}

/**
 * Get default timezone (Europe/Bucharest - Romania)
 */
export function getDefaultTimezone(): Timezone {
  return timezones[0];
}

/**
 * Format timezone for display in select/dropdown
 */
export function formatTimezoneLabel(timezone: Timezone): string {
  return timezone.label;
}
