/**
 * SSM/PSI Authorities Database per Country
 * Occupational Health & Safety and Fire Safety Authorities
 * Coverage: RO, BG, HU, DE, PL
 */

export interface Authority {
  name: string;
  acronym: string;
  website: string;
  phone: string;
  email?: string;
}

export interface CountryAuthorities {
  countryCode: string;
  countryName: string;
  mainAuthority: Authority;
  secondaryAuthorities: Authority[];
  reportingObligations: {
    accidentReporting: string;
    periodicReports: string;
    specialReports: string;
  };
  inspectionFrequency: {
    routine: string;
    riskBased: string;
    postAccident: string;
  };
  emergencyContacts: {
    workAccidents: string;
    fireEmergency: string;
  };
}

export const authoritiesPerCountry: Record<string, CountryAuthorities> = {
  RO: {
    countryCode: 'RO',
    countryName: 'România',
    mainAuthority: {
      name: 'Inspecția Muncii',
      acronym: 'ITM',
      website: 'https://www.inspectiamuncii.ro',
      phone: '+40 21 302 53 80',
      email: 'itm@inspectiamuncii.ro',
    },
    secondaryAuthorities: [
      {
        name: 'Inspectoratul General pentru Situații de Urgență',
        acronym: 'IGSU',
        website: 'https://www.igsu.ro',
        phone: '112',
        email: 'oficiu@igsu.ro',
      },
      {
        name: 'Direcția de Sănătate Publică',
        acronym: 'DSP',
        website: 'https://www.ms.ro',
        phone: '+40 21 307 47 00',
        email: 'dsp@ms.ro',
      },
      {
        name: 'Comisia Națională pentru Controlul Activităților Nucleare',
        acronym: 'CNCAN',
        website: 'https://www.cncan.ro',
        phone: '+40 21 203 39 12',
        email: 'office@cncan.ro',
      },
    ],
    reportingObligations: {
      accidentReporting: 'Accident mortal: imediat (max 8 ore). Accident grav: 24 ore. Accident ușor: lunar (registru)',
      periodicReports: 'Raportări statistice anuale către ITM până la 31 ianuarie pentru anul precedent',
      specialReports: 'Boli profesionale: 24 ore către ITM și DSP. Incident major: notificare imediată',
    },
    inspectionFrequency: {
      routine: 'Inspecții generale: 1-3 ani în funcție de risc',
      riskBased: 'Activități cu risc ridicat: anual. Risc mediu: la 2 ani. Risc scăzut: la 3 ani',
      postAccident: 'Inspecție în 24-48 ore de la notificare',
    },
    emergencyContacts: {
      workAccidents: '112 (urgențe) / ITM territorial',
      fireEmergency: '112 (pompieri)',
    },
  },

  BG: {
    countryCode: 'BG',
    countryName: 'Bulgaria',
    mainAuthority: {
      name: 'Изпълнителна агенция „Главна инспекция по труда"',
      acronym: 'ГИТ / GIT',
      website: 'https://www.gli.government.bg',
      phone: '+359 2 8119 443',
      email: 'git@labor.government.bg',
    },
    secondaryAuthorities: [
      {
        name: 'Главна дирекция „Пожарна безопасност и защита на населението"',
        acronym: 'ГДПБЗН / GDPBZN',
        website: 'https://www.mvr.bg',
        phone: '112',
        email: 'info@mvr.bg',
      },
      {
        name: 'Регионална здравна инспекция',
        acronym: 'РЗИ / RZI',
        website: 'https://www.rzi.bg',
        phone: '+359 2 930 50 45',
        email: 'rzi@rzi.bg',
      },
      {
        name: 'Агенция за ядрено регулиране',
        acronym: 'АЯР / AYR',
        website: 'https://www.bnra.bg',
        phone: '+359 2 940 69 00',
        email: 'bnra@bnra.bg',
      },
    ],
    reportingObligations: {
      accidentReporting: 'Смъртен случай: незабавно. Тежка злополука: 24 часа. Лека злополука: регистър',
      periodicReports: 'Годишни статистически отчети до ГИТ до 31 януари',
      specialReports: 'Професионални заболявания: 3 дни до ГИТ и РЗИ. Колективна злополука: незабавно',
    },
    inspectionFrequency: {
      routine: 'Планови проверки: 1-4 години според рисков профил',
      riskBased: 'Висок риск: годишно. Среден риск: на 2 години. Нисък риск: на 4 години',
      postAccident: 'Проверка в рамките на 24-72 часа след уведомяване',
    },
    emergencyContacts: {
      workAccidents: '112 / Териториална дирекция ГИТ',
      fireEmergency: '112 (пожарна)',
    },
  },

  HU: {
    countryCode: 'HU',
    countryName: 'Magyarország',
    mainAuthority: {
      name: 'Nemzeti Munkaügyi Hivatal',
      acronym: 'NMH',
      website: 'https://www.munka.hu',
      phone: '+36 1 474 1600',
      email: 'nmh@munka.hu',
    },
    secondaryAuthorities: [
      {
        name: 'Országos Katasztrófavédelmi Főigazgatóság',
        acronym: 'OKF',
        website: 'https://www.katasztrofavedelem.hu',
        phone: '112',
        email: 'titkarsag@katved.gov.hu',
      },
      {
        name: 'Nemzeti Népegészségügyi és Gyógyszerészeti Központ',
        acronym: 'NNGYK',
        website: 'https://www.nnk.gov.hu',
        phone: '+36 1 476 1100',
        email: 'titkarsag@nnk.gov.hu',
      },
      {
        name: 'Magyar Bányászati és Földtani Szolgálat',
        acronym: 'MBFSZ',
        website: 'https://www.mbfsz.gov.hu',
        phone: '+36 1 301 2900',
        email: 'mbfsz@mbfsz.gov.hu',
      },
    ],
    reportingObligations: {
      accidentReporting: 'Halálos baleset: azonnal. Súlyos baleset: 24 órán belül. Könnyű baleset: nyilvántartás',
      periodicReports: 'Éves munkaügyi statisztikai jelentés január 31-ig az NMH-nak',
      specialReports: 'Foglalkozási megbetegedés: 24 órán belül NMH és NNGYK. Tömeges baleset: azonnali bejelentés',
    },
    inspectionFrequency: {
      routine: 'Rendszeres ellenőrzés: 1-3 évente kockázati besorolás alapján',
      riskBased: 'Magas kockázat: évente. Közepes kockázat: 2 évente. Alacsony kockázat: 3 évente',
      postAccident: 'Helyszíni vizsgálat 24-48 órán belül bejelentés után',
    },
    emergencyContacts: {
      workAccidents: '112 (mentők) / Területi munkaügyi központ',
      fireEmergency: '112 (tűzoltóság)',
    },
  },

  DE: {
    countryCode: 'DE',
    countryName: 'Deutschland',
    mainAuthority: {
      name: 'Deutsche Gesetzliche Unfallversicherung',
      acronym: 'DGUV',
      website: 'https://www.dguv.de',
      phone: '+49 30 13001-0',
      email: 'info@dguv.de',
    },
    secondaryAuthorities: [
      {
        name: 'Bundesanstalt für Arbeitsschutz und Arbeitsmedizin',
        acronym: 'BAuA',
        website: 'https://www.baua.de',
        phone: '+49 231 9071-0',
        email: 'info-zentrum@baua.bund.de',
      },
      {
        name: 'Gewerbeaufsichtsämter / Staatliche Arbeitsschutzämter',
        acronym: 'GAA',
        website: 'https://www.arbeitsschutz.de',
        phone: 'Variiert nach Bundesland',
        email: 'info@arbeitsschutz.de',
      },
      {
        name: 'Berufsgenossenschaften',
        acronym: 'BG',
        website: 'https://www.bgw-online.de',
        phone: 'Variiert nach Branche',
        email: 'info@bgw-online.de',
      },
      {
        name: 'Feuerwehr und Katastrophenschutz',
        acronym: 'Feuerwehr',
        website: 'https://www.feuerwehr.de',
        phone: '112',
        email: 'info@feuerwehr.de',
      },
    ],
    reportingObligations: {
      accidentReporting: 'Tödlicher Unfall: sofort. Schwerer Unfall (>3 Tage AU): 3 Tage. Meldepflicht an BG und GAA',
      periodicReports: 'Jährliche Unfallanzeigen an zuständige Berufsgenossenschaft bis 31. Januar',
      specialReports: 'Berufskrankheiten: unverzüglich an BG. Massenunfall: sofortige Meldung an Behörden',
    },
    inspectionFrequency: {
      routine: 'Regelprüfungen: alle 2-5 Jahre je nach Betriebsgröße und Gefährdungspotenzial',
      riskBased: 'Hochrisiko: jährlich. Mittleres Risiko: alle 2-3 Jahre. Niedriges Risiko: alle 5 Jahre',
      postAccident: 'Untersuchung innerhalb 24-72 Stunden nach Meldung',
    },
    emergencyContacts: {
      workAccidents: '112 (Notruf) / Zuständige Berufsgenossenschaft',
      fireEmergency: '112 (Feuerwehr)',
    },
  },

  PL: {
    countryCode: 'PL',
    countryName: 'Polska',
    mainAuthority: {
      name: 'Państwowa Inspekcja Pracy',
      acronym: 'PIP',
      website: 'https://www.pip.gov.pl',
      phone: '+48 22 661 84 00',
      email: 'krgp@gip.pip.gov.pl',
    },
    secondaryAuthorities: [
      {
        name: 'Komenda Główna Państwowej Straży Pożarnej',
        acronym: 'KG PSP',
        website: 'https://www.straz.gov.pl',
        phone: '112',
        email: 'kancelaria@kgpsp.gov.pl',
      },
      {
        name: 'Główny Inspektorat Sanitarny',
        acronym: 'GIS',
        website: 'https://www.gis.gov.pl',
        phone: '+48 22 536 11 00',
        email: 'gis@gis.gov.pl',
      },
      {
        name: 'Wyższy Urząd Górniczy',
        acronym: 'WUG',
        website: 'https://www.wug.gov.pl',
        phone: '+48 32 43 67 100',
        email: 'wug@wug.gov.pl',
      },
      {
        name: 'Państwowa Agencja Atomistyki',
        acronym: 'PAA',
        website: 'https://www.paa.gov.pl',
        phone: '+48 22 695 92 00',
        email: 'sekretariat@paa.gov.pl',
      },
    ],
    reportingObligations: {
      accidentReporting: 'Wypadek śmiertelny: natychmiast. Wypadek ciężki: 24 godziny. Wypadek lekki: rejestr zakładowy',
      periodicReports: 'Roczne sprawozdania statystyczne do PIP do 31 stycznia za rok poprzedni',
      specialReports: 'Choroby zawodowe: 14 dni do PIP i GIS. Wypadek zbiorowy (≥5 osób): natychmiastowe zgłoszenie',
    },
    inspectionFrequency: {
      routine: 'Kontrole planowe: co 1-3 lata w zależności od kategorii ryzyka zakładu',
      riskBased: 'Wysokie ryzyko: rocznie. Średnie ryzyko: co 2 lata. Niskie ryzyko: co 3 lata',
      postAccident: 'Kontrola pounfallowa w ciągu 24-48 godzin od zgłoszenia',
    },
    emergencyContacts: {
      workAccidents: '112 (pogotowie) / Okręgowy Inspektorat Pracy',
      fireEmergency: '112 (straż pożarna)',
    },
  },
};

/**
 * Get authorities data for a specific country
 * @param countryCode - ISO 3166-1 alpha-2 country code (RO, BG, HU, DE, PL)
 * @returns CountryAuthorities object or undefined if country not found
 */
export function getAuthoritiesByCountry(
  countryCode: string
): CountryAuthorities | undefined {
  return authoritiesPerCountry[countryCode.toUpperCase()];
}

/**
 * Get list of all supported countries
 * @returns Array of country codes
 */
export function getSupportedCountries(): string[] {
  return Object.keys(authoritiesPerCountry);
}

/**
 * Get main authority for a country
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns Authority object or undefined
 */
export function getMainAuthority(countryCode: string): Authority | undefined {
  const country = getAuthoritiesByCountry(countryCode);
  return country?.mainAuthority;
}

/**
 * Search for authority by acronym across all countries
 * @param acronym - Authority acronym (e.g., "ITM", "DGUV")
 * @returns Array of matching countries with the authority
 */
export function findAuthorityByAcronym(acronym: string): {
  countryCode: string;
  authority: Authority;
  type: 'main' | 'secondary';
}[] {
  const results: {
    countryCode: string;
    authority: Authority;
    type: 'main' | 'secondary';
  }[] = [];

  for (const [code, data] of Object.entries(authoritiesPerCountry)) {
    if (data.mainAuthority.acronym.includes(acronym)) {
      results.push({
        countryCode: code,
        authority: data.mainAuthority,
        type: 'main',
      });
    }

    data.secondaryAuthorities.forEach((auth) => {
      if (auth.acronym.includes(acronym)) {
        results.push({
          countryCode: code,
          authority: auth,
          type: 'secondary',
        });
      }
    });
  }

  return results;
}

export default authoritiesPerCountry;
