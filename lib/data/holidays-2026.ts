/**
 * Sărbători legale România 2026
 * Conform Legii nr. 53/2003 - Codul muncii
 */

export interface Holiday {
  date: string; // Format: YYYY-MM-DD
  name: string;
  type: 'national' | 'religious';
}

export const holidays2026: Holiday[] = [
  {
    date: '2026-01-01',
    name: 'Anul Nou',
    type: 'national',
  },
  {
    date: '2026-01-02',
    name: 'Anul Nou',
    type: 'national',
  },
  {
    date: '2026-01-24',
    name: 'Ziua Unirii Principatelor Române',
    type: 'national',
  },
  {
    date: '2026-04-17',
    name: 'Vinerea Mare',
    type: 'religious',
  },
  {
    date: '2026-04-20',
    name: 'Paștele Ortodox - a doua zi',
    type: 'religious',
  },
  {
    date: '2026-05-01',
    name: 'Ziua Muncii',
    type: 'national',
  },
  {
    date: '2026-06-01',
    name: 'Ziua Copilului',
    type: 'national',
  },
  {
    date: '2026-06-08',
    name: 'Rusaliile - a doua zi',
    type: 'religious',
  },
  {
    date: '2026-08-15',
    name: 'Adormirea Maicii Domnului',
    type: 'religious',
  },
  {
    date: '2026-11-30',
    name: 'Sfântul Apostol Andrei',
    type: 'religious',
  },
  {
    date: '2026-12-01',
    name: 'Ziua Națională a României',
    type: 'national',
  },
  {
    date: '2026-12-25',
    name: 'Crăciunul',
    type: 'religious',
  },
  {
    date: '2026-12-26',
    name: 'Crăciunul - a doua zi',
    type: 'religious',
  },
];

/**
 * Verifică dacă o dată este sărbătoare legală în România (2026)
 * @param date - Data de verificat (Date object sau string YYYY-MM-DD)
 * @returns true dacă data este sărbătoare legală
 */
export function isHoliday(date: Date | string): boolean {
  const dateStr = typeof date === 'string'
    ? date
    : date.toISOString().split('T')[0];

  return holidays2026.some(holiday => holiday.date === dateStr);
}

/**
 * Returnează informații despre sărbătoare (dacă există)
 * @param date - Data de verificat (Date object sau string YYYY-MM-DD)
 * @returns Holiday object sau null
 */
export function getHolidayInfo(date: Date | string): Holiday | null {
  const dateStr = typeof date === 'string'
    ? date
    : date.toISOString().split('T')[0];

  return holidays2026.find(holiday => holiday.date === dateStr) || null;
}

/**
 * Returnează toate sărbătorile dintr-o lună specificată
 * @param month - Luna (1-12)
 * @returns Array de Holiday objects
 */
export function getHolidaysByMonth(month: number): Holiday[] {
  return holidays2026.filter(holiday => {
    const holidayMonth = parseInt(holiday.date.split('-')[1], 10);
    return holidayMonth === month;
  });
}
