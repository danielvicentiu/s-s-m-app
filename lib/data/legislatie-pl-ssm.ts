/**
 * Polish SSM (Safety and Health at Work) Legislative Database
 * Base legislativă SSM Polonia - 15 acte normative principale
 */

export interface LegislationActPL {
  id: string;
  type: 'code' | 'act' | 'regulation' | 'directive';
  titlePL: string;
  titleEN: string;
  issueDate?: string;
  effectiveDate?: string;
  journalReference?: string;
  keyObligations: string[];
  penalties: {
    min: number;
    max: number;
    currency: 'PLN';
    notes?: string;
  };
  relevantArticles?: string[];
  links?: {
    officialText?: string;
    guidance?: string;
  };
}

export const legislatiePL: LegislationActPL[] = [
  {
    id: 'pl-kodeks-pracy',
    type: 'code',
    titlePL: 'Ustawa z dnia 26 czerwca 1974 r. - Kodeks pracy',
    titleEN: 'Labour Code Act of 26 June 1974',
    issueDate: '1974-06-26',
    effectiveDate: '1975-01-01',
    journalReference: 'Dz.U. 1974 Nr 24 poz. 141',
    keyObligations: [
      'Zapewnienie bezpiecznych i higienicznych warunków pracy (art. 207)',
      'Przeprowadzanie oceny ryzyka zawodowego dla stanowisk pracy',
      'Organizacja szkoleń BHP dla wszystkich pracowników',
      'Przeprowadzanie badań lekarskich pracowników przed i w trakcie zatrudnienia',
      'Zapewnienie odzieży i obuwia roboczego oraz środków ochrony indywidualnej',
      'Prowadzenie dokumentacji wypadków przy pracy i chorób zawodowych',
      'Powołanie służby BHP lub wyznaczenie pracownika ds. BHP',
      'Konsultowanie działań z zakresie BHP z pracownikami lub ich przedstawicielami',
    ],
    penalties: {
      min: 1000,
      max: 30000,
      currency: 'PLN',
      notes: 'Grzywna za wykroczenia przeciwko prawom pracownika (art. 281-283)',
    },
    relevantArticles: ['art. 207-237^8', 'art. 281-283'],
    links: {
      officialText: 'https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=wdu19740240141',
    },
  },
  {
    id: 'pl-sluzba-bhp',
    type: 'regulation',
    titlePL: 'Rozporządzenie Rady Ministrów z dnia 2 września 1997 r. w sprawie służby bezpieczeństwa i higieny pracy',
    titleEN: 'Regulation of the Council of Ministers of 2 September 1997 on occupational health and safety service',
    issueDate: '1997-09-02',
    effectiveDate: '1997-10-02',
    journalReference: 'Dz.U. 1997 Nr 109 poz. 704',
    keyObligations: [
      'Zatrudnienie pracowników służby BHP w zależności od liczby pracowników',
      'Do 100 pracowników - 1 pracownik służby BHP na pełen etat',
      'Powyżej 600 pracowników - 1 pracownik służby BHP na każdych 600 pracowników',
      'Służba BHP podlega bezpośrednio pracodawcy',
      'Zadania: doradztwo, kontrola warunków pracy, udział w ustalaniu okoliczności wypadków',
      'Pracownik służby BHP musi posiadać odpowiednie kwalifikacje',
    ],
    penalties: {
      min: 1000,
      max: 30000,
      currency: 'PLN',
      notes: 'Sankcje zgodne z Kodeksem Pracy za brak służby BHP',
    },
    relevantArticles: ['§1-11'],
  },
  {
    id: 'pl-szkolenia-bhp',
    type: 'regulation',
    titlePL: 'Rozporządzenie Ministra Gospodarki i Pracy z dnia 27 lipca 2004 r. w sprawie szkolenia w dziedzinie bezpieczeństwa i higieny pracy',
    titleEN: 'Regulation of the Minister of Economy and Labour of 27 July 2004 on training in occupational health and safety',
    issueDate: '2004-07-27',
    effectiveDate: '2004-09-28',
    journalReference: 'Dz.U. 2004 Nr 180 poz. 1860',
    keyObligations: [
      'Szkolenie wstępne: instruktaż ogólny + stanowiskowy przed dopuszczeniem do pracy',
      'Szkolenie okresowe pracowników na stanowiskach robotniczych - co 3 lata',
      'Szkolenie okresowe pracowników administracyjno-biurowych - co 6 lat',
      'Szkolenie okresowe pracodawców i kierowników - co 5 lat',
      'Prowadzenie dokumentacji szkoleń BHP (karty, listy obecności)',
      'Szkolenia prowadzone przez jednostki posiadające akredytację',
    ],
    penalties: {
      min: 1000,
      max: 30000,
      currency: 'PLN',
      notes: 'Grzywna za niedopełnienie obowiązku szkolenia pracowników',
    },
    relevantArticles: ['§3-13'],
  },
  {
    id: 'pl-badania-lekarskie',
    type: 'regulation',
    titlePL: 'Rozporządzenie Ministra Zdrowia i Opieki Społecznej z dnia 30 maja 1996 r. w sprawie przeprowadzania badań lekarskich pracowników',
    titleEN: 'Regulation of the Minister of Health and Social Welfare of 30 May 1996 on medical examinations of employees',
    issueDate: '1996-05-30',
    effectiveDate: '1996-12-01',
    journalReference: 'Dz.U. 1996 Nr 69 poz. 332',
    keyObligations: [
      'Badania wstępne - przed rozpoczęciem pracy (ważne 30 dni)',
      'Badania okresowe - w terminach określonych przez lekarza medycyny pracy',
      'Badania kontrolne - po zwolnieniu lekarskim powyżej 30 dni',
      'Pracodawca ponosi koszty badań i zapewnia czas na ich przeprowadzenie',
      'Lekarz medycyny pracy wystawia orzeczenie o zdolności/niezdolności do pracy',
      'Dokumentacja medyczna przechowywana przez pracodawcę',
    ],
    penalties: {
      min: 1000,
      max: 30000,
      currency: 'PLN',
      notes: 'Zatrudnienie bez badań lekarskich stanowi wykroczenie',
    },
    relevantArticles: ['§1-9'],
  },
  {
    id: 'pl-ocena-ryzyka',
    type: 'regulation',
    titlePL: 'Rozporządzenie Ministra Pracy i Polityki Socjalnej z dnia 26 września 1997 r. w sprawie ogólnych przepisów bezpieczeństwa i higieny pracy',
    titleEN: 'Regulation of the Minister of Labour and Social Policy of 26 September 1997 on general health and safety regulations',
    issueDate: '1997-09-26',
    effectiveDate: '1997-11-16',
    journalReference: 'Dz.U. 1997 Nr 129 poz. 844',
    keyObligations: [
      'Przeprowadzenie oceny ryzyka zawodowego dla wszystkich stanowisk pracy',
      'Dokumentowanie oceny ryzyka i dostęp dla pracowników',
      'Aktualizacja oceny przy zmianach organizacyjnych lub technologicznych',
      'Stosowanie środków eliminujących lub ograniczających ryzyko zawodowe',
      'Informowanie pracowników o zagrożeniach na stanowisku pracy',
      'Zapewnienie instrukcji BHP na stanowiskach pracy',
      'Oznakowanie miejsc niebezpiecznych i dróg ewakuacyjnych',
    ],
    penalties: {
      min: 1000,
      max: 30000,
      currency: 'PLN',
      notes: 'Brak oceny ryzyka lub jej nieaktualizowanie',
    },
    relevantArticles: ['§39-43'],
  },
  {
    id: 'pl-srodki-ochrony',
    type: 'regulation',
    titlePL: 'Rozporządzenie Ministra Pracy i Polityki Socjalnej z dnia 26 września 1997 r. w sprawie ogólnych przepisów bezpieczeństwa i higieny pracy',
    titleEN: 'Regulation on Personal Protective Equipment provisions',
    issueDate: '1997-09-26',
    effectiveDate: '1997-11-16',
    journalReference: 'Dz.U. 1997 Nr 129 poz. 844',
    keyObligations: [
      'Zapewnienie środków ochrony indywidualnej (ŚOI) bezpłatnie dla pracowników',
      'ŚOI muszą posiadać certyfikaty zgodności z normami UE',
      'Przeszkolenie pracowników w zakresie użytkowania ŚOI',
      'Zapewnienie odzieży i obuwia roboczego zgodnie z warunkami pracy',
      'Wymiana ŚOI po upływie terminu przydatności lub zniszczeniu',
      'Prowadzenie ewidencji wydanych środków ochrony',
    ],
    penalties: {
      min: 1000,
      max: 30000,
      currency: 'PLN',
      notes: 'Niedostarczenie wymaganych środków ochrony indywidualnej',
    },
    relevantArticles: ['§44-50'],
  },
  {
    id: 'pl-wypadki-przy-pracy',
    type: 'regulation',
    titlePL: 'Rozporządzenie Rady Ministrów z dnia 1 lipca 2009 r. w sprawie ustalania okoliczności i przyczyn wypadków przy pracy',
    titleEN: 'Regulation of the Council of Ministers of 1 July 2009 on determining circumstances and causes of accidents at work',
    issueDate: '2009-07-01',
    effectiveDate: '2009-09-01',
    journalReference: 'Dz.U. 2009 Nr 105 poz. 870',
    keyObligations: [
      'Niezwłoczne zawiadomienie PIP, prokuratury i ZUS o wypadku śmiertelnym/ciężkim',
      'Powołanie zespołu powypadkowego do ustalenia okoliczności wypadku',
      'Sporządzenie protokołu powypadkowego (druk Z-10) w terminie 14 dni',
      'Rejestr wypadków przy pracy prowadzony w zakładzie',
      'Analiza przyczyn wypadków i wdrażanie działań zapobiegawczych',
      'Statystyczna karta wypadku przekazywana do GUS',
    ],
    penalties: {
      min: 1000,
      max: 30000,
      currency: 'PLN',
      notes: 'Nieprawidłowe ustalenie okoliczności lub ukrycie wypadku',
    },
    relevantArticles: ['§1-16'],
  },
  {
    id: 'pl-choroby-zawodowe',
    type: 'regulation',
    titlePL: 'Rozporządzenie Rady Ministrów z dnia 30 czerwca 2009 r. w sprawie chorób zawodowych',
    titleEN: 'Regulation of the Council of Ministers of 30 June 2009 on occupational diseases',
    issueDate: '2009-06-30',
    effectiveDate: '2009-09-01',
    journalReference: 'Dz.U. 2009 Nr 105 poz. 869',
    keyObligations: [
      'Zgłaszanie podejrzenia choroby zawodowej do PIP i ZUS',
      'Prowadzenie rejestru osób narażonych na czynniki szkodliwe',
      'Stosowanie profilaktyki dla pracowników narażonych',
      'Współpraca z lekarzem medycyny pracy w zakresie chorób zawodowych',
      'Wypłata odszkodowania z tytułu choroby zawodowej',
      'Lista 26 kategorii chorób zawodowych zgodnie z załącznikiem',
    ],
    penalties: {
      min: 1000,
      max: 30000,
      currency: 'PLN',
      notes: 'Niezgłoszenie choroby zawodowej lub brak profilaktyki',
    },
    relevantArticles: ['§1-5'],
  },
  {
    id: 'pl-praca-na-wysokosci',
    type: 'regulation',
    titlePL: 'Rozporządzenie Ministra Pracy i Polityki Socjalnej z dnia 26 września 1997 r. - przepisy dot. pracy na wysokości',
    titleEN: 'Regulation on work at height provisions',
    issueDate: '1997-09-26',
    effectiveDate: '1997-11-16',
    journalReference: 'Dz.U. 1997 Nr 129 poz. 844',
    keyObligations: [
      'Praca na wysokości powyżej 1 metra wymaga zabezpieczeń',
      'Stosowanie balustrad, siatek ochronnych lub uprzęży',
      'Szkolenie pracowników wykonujących pracę na wysokości',
      'Badania lekarskie dla pracowników pracujących na wysokości',
      'Kontrola stanu technicznego rusztowań i drabin',
      'Zakaz pracy na wysokości w warunkach atmosferycznych zagrażających BHP',
    ],
    penalties: {
      min: 1000,
      max: 30000,
      currency: 'PLN',
      notes: 'Brak zabezpieczeń przy pracy na wysokości',
    },
    relevantArticles: ['§106-134'],
  },
  {
    id: 'pl-maszyny-urzadzenia',
    type: 'regulation',
    titlePL: 'Rozporządzenie Ministra Gospodarki z dnia 30 października 2002 r. w sprawie minimalnych wymagań dotyczących bezpieczeństwa i higieny pracy w zakresie użytkowania maszyn',
    titleEN: 'Regulation of the Minister of Economy of 30 October 2002 on minimum requirements for machinery safety',
    issueDate: '2002-10-30',
    effectiveDate: '2003-07-05',
    journalReference: 'Dz.U. 2002 Nr 191 poz. 1596',
    keyObligations: [
      'Maszyny muszą posiadać deklarację zgodności CE',
      'Instrukcje obsługi maszyn dostępne w języku polskim',
      'Okresowe przeglądy i konserwacja maszyn zgodnie z instrukcją',
      'Szkolenie pracowników obsługujących maszyny',
      'Zabezpieczenia ruchomych części maszyn',
      'Przycisk awaryjnego zatrzymania (STOP) na każdej maszynie',
      'Ewidencja przeglądów i napraw maszyn',
    ],
    penalties: {
      min: 1000,
      max: 30000,
      currency: 'PLN',
      notes: 'Użytkowanie maszyn niezgodnych z wymaganiami BHP',
    },
    relevantArticles: ['§2-10'],
  },
  {
    id: 'pl-substancje-chemiczne',
    type: 'regulation',
    titlePL: 'Rozporządzenie Ministra Zdrowia z dnia 2 lutego 2011 r. w sprawie badań i pomiarów czynników szkodliwych dla zdrowia w środowisku pracy',
    titleEN: 'Regulation of the Minister of Health of 2 February 2011 on testing and measurement of harmful factors in the workplace',
    issueDate: '2011-02-02',
    effectiveDate: '2011-05-01',
    journalReference: 'Dz.U. 2011 Nr 33 poz. 166',
    keyObligations: [
      'Pomiary substancji chemicznych, pyłów, hałasu w środowisku pracy',
      'Częstotliwość pomiarów zgodna z poziomem zagrożenia',
      'Pomiary wykonywane przez akredytowane laboratoria',
      'Dokumentacja pomiarów przechowywana minimum 40 lat',
      'Informowanie pracowników o wynikach pomiarów',
      'Działania naprawcze przy przekroczeniu norm',
    ],
    penalties: {
      min: 1000,
      max: 30000,
      currency: 'PLN',
      notes: 'Brak pomiarów lub nieprawidłowe pomiary czynników szkodliwych',
    },
    relevantArticles: ['§1-13'],
  },
  {
    id: 'pl-pierwsza-pomoc',
    type: 'regulation',
    titlePL: 'Rozporządzenie Ministra Pracy i Polityki Socjalnej z dnia 26 września 1997 r. - przepisy dot. pierwszej pomocy',
    titleEN: 'Regulation on first aid provisions in the workplace',
    issueDate: '1997-09-26',
    effectiveDate: '1997-11-16',
    journalReference: 'Dz.U. 1997 Nr 129 poz. 844',
    keyObligations: [
      'Apteczki pierwszej pomocy rozmieszczone w miejscach pracy',
      'Minimum 1 przeszkolony pracownik na 10 pracowników (pierwsza pomoc)',
      'Instrukcje udzielania pierwszej pomocy w widocznych miejscach',
      'Numery alarmowe widoczne przy telefonach',
      'Dostęp do telefonu dla wezwania pomocy',
      'Okresowa kontrola zawartości apteczek',
    ],
    penalties: {
      min: 1000,
      max: 30000,
      currency: 'PLN',
      notes: 'Brak apteczek lub przeszkolonych pracowników',
    },
    relevantArticles: ['§51-53'],
  },
  {
    id: 'pl-czas-pracy',
    type: 'act',
    titlePL: 'Kodeks Pracy - Rozdział VI: Czas pracy (art. 128-151)',
    titleEN: 'Labour Code - Chapter VI: Working Time',
    issueDate: '1974-06-26',
    effectiveDate: '1975-01-01',
    journalReference: 'Dz.U. 1974 Nr 24 poz. 141',
    keyObligations: [
      'Maksymalny czas pracy: 8 godzin na dobę, 40 godzin tygodniowo',
      'Praca w systemie równoważnym - średnio 40h/tydzień w okresie rozliczeniowym',
      'Minimalny odpoczynek dobowy: 11 godzin',
      'Minimalny odpoczynek tygodniowy: 35 godzin nieprzerwanie',
      'Praca w godzinach nadliczbowych nie więcej niż 150h rocznie',
      'Dopłata za nadgodziny: 100% lub 50% wynagrodzenia',
      'Ewidencja czasu pracy dla każdego pracownika',
    ],
    penalties: {
      min: 1000,
      max: 30000,
      currency: 'PLN',
      notes: 'Naruszenie przepisów o czasie pracy i odpoczynku',
    },
    relevantArticles: ['art. 128-151'],
  },
  {
    id: 'pl-inspekcja-pracy',
    type: 'act',
    titlePL: 'Ustawa z dnia 13 kwietnia 2007 r. o Państwowej Inspekcji Pracy',
    titleEN: 'Act of 13 April 2007 on the National Labour Inspectorate',
    issueDate: '2007-04-13',
    effectiveDate: '2007-06-15',
    journalReference: 'Dz.U. 2007 Nr 89 poz. 589',
    keyObligations: [
      'Umożliwienie kontroli PIP w zakładzie pracy bez uprzedzenia',
      'Udostępnienie dokumentacji BHP, płacowej, czasu pracy inspektorowi',
      'Wykonanie zaleceń pokontrolnych w wyznaczonym terminie',
      'Możliwość wstrzymania prac przez inspektora w razie zagrożenia',
      'Prawo PIP do nakładania mandatów karnych i kierowania wniosków do sądu',
      'Możliwość odwołania się od decyzji inspektora pracy',
    ],
    penalties: {
      min: 1000,
      max: 30000,
      currency: 'PLN',
      notes: 'Mandaty karne nakładane bezpośrednio przez inspektorów PIP',
    },
    relevantArticles: ['art. 1-21, art. 27-32'],
  },
  {
    id: 'pl-pracodawcy-zagraniczni',
    type: 'act',
    titlePL: 'Ustawa z dnia 10 czerwca 2016 r. o delegowaniu pracowników w ramach świadczenia usług',
    titleEN: 'Act of 10 June 2016 on posting of workers in the framework of provision of services',
    issueDate: '2016-06-10',
    effectiveDate: '2016-06-18',
    journalReference: 'Dz.U. 2016 poz. 868',
    keyObligations: [
      'Zgłoszenie delegowania pracowników do Polski do PIP (7 dni przed)',
      'Zapewnienie warunków BHP zgodnych z polskimi przepisami',
      'Stosowanie polskiego minimalnego wynagrodzenia dla delegowanych',
      'Przechowywanie dokumentacji pracowniczej w miejscu wykonywania pracy',
      'Wyznaczenie osoby upoważnionej do kontaktu z PIP w Polsce',
      'Przestrzeganie polskich przepisów o czasie pracy i odpoczynku',
    ],
    penalties: {
      min: 1000,
      max: 30000,
      currency: 'PLN',
      notes: 'Kary za brak zgłoszenia lub nieprzestrzeganie przepisów polskich',
    },
    relevantArticles: ['art. 1-20'],
  },
];

/**
 * Helper functions for working with Polish legislation
 */

export function getLegislationById(id: string): LegislationActPL | undefined {
  return legislatiePL.find((act) => act.id === id);
}

export function getLegislationByType(type: LegislationActPL['type']): LegislationActPL[] {
  return legislatiePL.filter((act) => act.type === type);
}

export function searchLegislation(query: string): LegislationActPL[] {
  const lowerQuery = query.toLowerCase();
  return legislatiePL.filter(
    (act) =>
      act.titlePL.toLowerCase().includes(lowerQuery) ||
      act.titleEN.toLowerCase().includes(lowerQuery) ||
      act.keyObligations.some((obligation) =>
        obligation.toLowerCase().includes(lowerQuery)
      )
  );
}

export function getLegislationStats() {
  return {
    total: legislatiePL.length,
    byType: {
      code: getLegislationByType('code').length,
      act: getLegislationByType('act').length,
      regulation: getLegislationByType('regulation').length,
      directive: getLegislationByType('directive').length,
    },
    totalObligations: legislatiePL.reduce(
      (sum, act) => sum + act.keyObligations.length,
      0
    ),
  };
}
