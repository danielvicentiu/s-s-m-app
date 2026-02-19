/**
 * Hardcoded list of key Polish BHP (Bezpieczeństwo i Higiena Pracy) acts.
 * ELI format used by Sejm API: {journal}/{year}/{number}
 * where journal is: DU = Dziennik Ustaw (Journal of Laws)
 */

export interface BhpActRef {
  eli: string;          // e.g. "DU/2023/1465"
  domains: string[];    // SSM domain tags
  keywords: string[];   // search keywords
}

export const bhpActs: BhpActRef[] = [
  {
    eli: 'DU/2023/1465',
    domains: ['bhp', 'prawo_pracy'],
    keywords: ['kodeks pracy', 'stosunek pracy', 'umowa o pracę', 'wynagrodzenie', 'bezpieczeństwo pracy'],
  },
  {
    eli: 'DU/2003/1650',
    domains: ['bhp', 'ogólne'],
    keywords: ['bhp ogólne', 'rozporządzenie', 'minimalne wymagania bhp', 'zakład pracy'],
  },
  {
    eli: 'DU/2004/1860',
    domains: ['bhp', 'szkolenia'],
    keywords: ['szkolenia bhp', 'instruktaż', 'szkolenie wstępne', 'szkolenie okresowe'],
  },
  {
    eli: 'DU/2024/275',
    domains: ['psi', 'ochrona_przeciwpozarowa'],
    keywords: ['ochrona przeciwpożarowa', 'straż pożarna', 'ewakuacja', 'bezpieczeństwo pożarowe'],
  },
  {
    eli: 'DU/2024/97',
    domains: ['bhp', 'inspekcja_pracy'],
    keywords: ['Państwowa Inspekcja Pracy', 'PIP', 'inspektor pracy', 'kontrola bhp'],
  },
  {
    eli: 'DU/2003/858',
    domains: ['bhp', 'maszyny'],
    keywords: ['maszyny', 'urządzenia techniczne', 'minimalne wymagania maszyn', 'bezpieczeństwo maszyn'],
  },
  {
    eli: 'DU/2022/1816',
    domains: ['bhp', 'substancje_chemiczne'],
    keywords: ['substancje chemiczne', 'preparaty niebezpieczne', 'czynniki chemiczne', 'karty charakterystyki'],
  },
  {
    eli: 'DU/2024/1222',
    domains: ['bhp', 'czynniki_szkodliwe'],
    keywords: ['czynniki szkodliwe', 'czynniki biologiczne', 'NDN', 'NDS', 'narażenie zawodowe'],
  },
];
