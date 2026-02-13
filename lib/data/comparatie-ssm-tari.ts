/**
 * Matrice comparativă SSM/PSI pentru 5 țări europene
 * Date: 2026-02-13
 * Țări: România (RO), Bulgaria (BG), Ungaria (HU), Germania (DE), UK (EN)
 */

export interface CriteriuSSM {
  criteriu: string;
  ro: string;
  bg: string;
  hu: string;
  de: string;
  en: string;
}

export const comparatieSsmTari: CriteriuSSM[] = [
  {
    criteriu: "Obligativitate evaluare risc",
    ro: "Obligatoriu pentru toți angajatorii (Legea 319/2006)",
    bg: "Obligatoriu pentru toți angajatorii (Закон за здравословни и безопасни условия на труд)",
    hu: "Obligatoriu pentru toți angajatorii (1993. évi XCIII. törvény)",
    de: "Obligatoriu pentru toți angajatorii (Arbeitsschutzgesetz §5)",
    en: "Obligatoriu pentru toți angajatorii cu 5+ salariați (Management of Health and Safety at Work Regulations 1999)"
  },
  {
    criteriu: "Frecvență instruire SSM",
    ro: "Inițială + periodic anual (Hotărâre 1425/2006)",
    bg: "Inițială + periodic anual",
    hu: "Inițială + periodic anual (minimum)",
    de: "Inițială + periodic conform evaluării riscului",
    en: "Inițială + periodic conform evaluării riscului (recomandat anual)"
  },
  {
    criteriu: "Examen medical obligatoriu",
    ro: "Da - angajare + periodic (Legea 319/2006, art. 18)",
    bg: "Da - angajare + periodic conform certificat medical",
    hu: "Da - angajare + periodic conform riscurilor",
    de: "Da - pentru posturi cu risc specific (ArbMedVV)",
    en: "Da - pentru posturi cu risc specific (Health and Safety at Work Act)"
  },
  {
    criteriu: "Comitet SSM obligatoriu de la",
    ro: "50+ angajați (Legea 319/2006, art. 17)",
    bg: "50+ angajați",
    hu: "50+ angajați (Mvt. 70. §)",
    de: "20+ angajați (Arbeitsschutzgesetz §11)",
    en: "50+ angajați sau risc semnificativ (Safety Representatives and Safety Committees Regulations 1977)"
  },
  {
    criteriu: "Serviciu SSM extern obligatoriu de la",
    ro: "1+ angajați dacă nu are lucrător desemnat (Legea 319/2006)",
    bg: "1+ angajați dacă nu are lucrător desemnat",
    hu: "1+ angajați dacă nu are lucrător desemnat",
    de: "1+ angajați - Betriebsarzt și Fachkraft für Arbeitssicherheit (ASiG)",
    en: "Nu este obligatoriu serviciu extern - HSE poate impune conform riscului"
  },
  {
    criteriu: "Raportare accidente - termen",
    ro: "24 ore pentru ITM (accidente grave/mortale - imediat)",
    bg: "24 ore pentru inspectoratul muncii",
    hu: "8 ore pentru autorități (accidente grave - imediat)",
    de: "3 zile pentru Berufsgenossenschaft (accidente grave - imediat)",
    en: "15 zile pentru HSE prin RIDDOR (accidente grave - imediat)"
  },
  {
    criteriu: "Sancțiune maximă contravenție SSM",
    ro: "Până la 300.000 RON (~60.000 EUR) pentru persoane juridice",
    bg: "Până la 10.000 BGN (~5.000 EUR)",
    hu: "Până la 2.000.000 HUF (~5.000 EUR)",
    de: "Până la 25.000 EUR (sau penal pentru încălcări grave)",
    en: "Nelimitat - poate ajunge la milioane GBP pentru încălcări grave (Health and Safety at Work Act)"
  },
  {
    criteriu: "Lucrător desemnat SSM obligatoriu",
    ro: "Da - 1-9 angajați poate fi angajatorul însuși (Legea 319/2006)",
    bg: "Da - minimum 1 lucrător desemnat sau serviciu extern",
    hu: "Da - poate fi angajatorul pentru sub 50 angajați",
    de: "Nu - obligatoriu specialist extern (Fachkraft für Arbeitssicherheit)",
    en: "Nu este obligatoriu - depinde de evaluarea riscului (recomandat competent person)"
  },
  {
    criteriu: "Plan evacuare/urgență",
    ro: "Obligatoriu pentru toate organizațiile (Legea 307/2006 PSI + Legea 319/2006)",
    bg: "Obligatoriu pentru toate organizațiile",
    hu: "Obligatoriu pentru toate organizațiile",
    de: "Obligatoriu pentru toate organizațiile (Arbeitsschutzgesetz §10)",
    en: "Obligatoriu pentru toate organizațiile (Regulatory Reform Fire Safety Order 2005)"
  },
  {
    criteriu: "Audit intern SSM periodic",
    ro: "Recomandat dar nu explicit obligatoriu în legislație",
    bg: "Obligatoriu periodic - conform politicii companiei",
    hu: "Obligatoriu periodic pentru companii mari",
    de: "Nu explicit obligatoriu - dar rezultă din îndatorirea de evaluare continuă (§3 ArbSchG)",
    en: "Nu explicit obligatoriu - dar recomandat ca best practice (HSE Guidance)"
  }
];

export const tariDisponibile = [
  { cod: "ro", nume: "România", flag: "🇷🇴" },
  { cod: "bg", nume: "Bulgaria", flag: "🇧🇬" },
  { cod: "hu", nume: "Ungaria", flag: "🇭🇺" },
  { cod: "de", nume: "Germania", flag: "🇩🇪" },
  { cod: "en", nume: "Marea Britanie", flag: "🇬🇧" }
] as const;

export type CodTara = typeof tariDisponibile[number]["cod"];

/**
 * Helper function pentru a obține datele unui criteriu specific
 */
export function getCriteriuByName(nume: string): CriteriuSSM | undefined {
  return comparatieSsmTari.find(
    c => c.criteriu.toLowerCase().includes(nume.toLowerCase())
  );
}

/**
 * Helper function pentru a obține toate criteriile pentru o țară
 */
export function getCriteriiByTara(codTara: CodTara): { criteriu: string; valoare: string }[] {
  return comparatieSsmTari.map(c => ({
    criteriu: c.criteriu,
    valoare: c[codTara]
  }));
}

/**
 * Helper function pentru a compara 2 țări pe un criteriu
 */
export function compareTari(
  criteriu: string,
  tara1: CodTara,
  tara2: CodTara
): { criteriu: string; tara1: string; tara2: string } | undefined {
  const data = getCriteriuByName(criteriu);
  if (!data) return undefined;

  return {
    criteriu: data.criteriu,
    tara1: data[tara1],
    tara2: data[tara2]
  };
}
