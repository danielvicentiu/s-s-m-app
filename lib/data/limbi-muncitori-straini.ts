/**
 * Lista limbilor vorbite de muncitorii străini în România
 * Utilizat pentru training SSM multilingv și comunicare în siguranța muncii
 */

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  speakersInRomania: number; // estimare număr vorbitori în România
  commonSectors: string[]; // sectoare unde sunt comuni vorbitorii
}

export const limbiMuncitoriStraini: LanguageInfo[] = [
  {
    code: 'ro',
    name: 'Română',
    nativeName: 'Română',
    flag: '🇷🇴',
    speakersInRomania: 19_000_000,
    commonSectors: ['Toate sectoarele'],
  },
  {
    code: 'en',
    name: 'Engleză',
    nativeName: 'English',
    flag: '🇬🇧',
    speakersInRomania: 150_000,
    commonSectors: ['IT', 'Servicii', 'Management', 'Construcții'],
  },
  {
    code: 'ne',
    name: 'Nepaleză',
    nativeName: 'नेपाली',
    flag: '🇳🇵',
    speakersInRomania: 80_000,
    commonSectors: ['Construcții', 'Horeca', 'Agricultură', 'Logistică'],
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    speakersInRomania: 45_000,
    commonSectors: ['IT', 'Construcții', 'Producție', 'Servicii'],
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🇧🇩',
    speakersInRomania: 35_000,
    commonSectors: ['Construcții', 'Producție', 'Agricultură', 'Horeca'],
  },
  {
    code: 'si',
    name: 'Sinhala',
    nativeName: 'සිංහල',
    flag: '🇱🇰',
    speakersInRomania: 25_000,
    commonSectors: ['Construcții', 'Agricultură', 'Horeca', 'Curățenie'],
  },
  {
    code: 'vi',
    name: 'Vietnameză',
    nativeName: 'Tiếng Việt',
    flag: '🇻🇳',
    speakersInRomania: 20_000,
    commonSectors: ['Producție', 'Textile', 'Agricultură', 'Construcții'],
  },
  {
    code: 'zh',
    name: 'Chineză',
    nativeName: '中文',
    flag: '🇨🇳',
    speakersInRomania: 15_000,
    commonSectors: ['Comerț', 'Producție', 'Construcții', 'Servicii'],
  },
  {
    code: 'tr',
    name: 'Turcă',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    speakersInRomania: 30_000,
    commonSectors: ['Construcții', 'Comerț', 'Transport', 'Horeca'],
  },
  {
    code: 'ar',
    name: 'Arabă',
    nativeName: 'العربية',
    flag: '🇸🇦',
    speakersInRomania: 12_000,
    commonSectors: ['Servicii', 'Comerț', 'IT', 'Construcții'],
  },
  {
    code: 'fr',
    name: 'Franceză',
    nativeName: 'Français',
    flag: '🇫🇷',
    speakersInRomania: 40_000,
    commonSectors: ['Servicii', 'Management', 'IT', 'Educație'],
  },
  {
    code: 'es',
    name: 'Spaniolă',
    nativeName: 'Español',
    flag: '🇪🇸',
    speakersInRomania: 18_000,
    commonSectors: ['Servicii', 'Turism', 'IT', 'Construcții'],
  },
  {
    code: 'pt',
    name: 'Portugheză',
    nativeName: 'Português',
    flag: '🇵🇹',
    speakersInRomania: 8_000,
    commonSectors: ['Construcții', 'Servicii', 'IT', 'Comerț'],
  },
  {
    code: 'ru',
    name: 'Rusă',
    nativeName: 'Русский',
    flag: '🇷🇺',
    speakersInRomania: 50_000,
    commonSectors: ['Construcții', 'Comerț', 'Transport', 'Servicii'],
  },
];

/**
 * Helper functions pentru lucru cu limbile muncitorilor străini
 */

export function getLanguageByCode(code: string): LanguageInfo | undefined {
  return limbiMuncitoriStraini.find((lang) => lang.code === code);
}

export function getLanguagesBySector(sector: string): LanguageInfo[] {
  return limbiMuncitoriStraini.filter((lang) =>
    lang.commonSectors.some(
      (s) => s.toLowerCase().includes(sector.toLowerCase())
    )
  );
}

export function getTotalForeignSpeakers(): number {
  // Exclude Romanian speakers
  return limbiMuncitoriStraini
    .filter((lang) => lang.code !== 'ro')
    .reduce((sum, lang) => sum + lang.speakersInRomania, 0);
}

export function getTopLanguagesBySpeakers(limit: number = 5): LanguageInfo[] {
  return [...limbiMuncitoriStraini]
    .filter((lang) => lang.code !== 'ro')
    .sort((a, b) => b.speakersInRomania - a.speakersInRomania)
    .slice(0, limit);
}
