/**
 * Legislație SSM Bulgaria
 * Acte normative principale pentru Sănătate și Securitate în Muncă (Bulgaria)
 */

export interface LegislationBG {
  id: string;
  title: string;
  titleBG: string;
  number: string;
  year: number;
  domain: 'ssm' | 'psi' | 'medicina_muncii' | 'conditii_munca';
  description: string;
}

export const legislatieBG: LegislationBG[] = [
  {
    id: 'zzut',
    title: 'Legea Sănătății și Securității Muncii',
    titleBG: 'Закон за здравословни и безопасни условия на труд (ЗЗБУТ)',
    number: 'ДВ бр. 124',
    year: 1997,
    domain: 'ssm',
    description: 'Actul normativ de bază care reglementează condițiile de sănătate și securitate în muncă în Bulgaria. Stabilește obligațiile angajatorului și drepturile angajaților.'
  },
  {
    id: 'naredba-7',
    title: 'Ordonanța nr. 7 - Cerințe minime pentru securitate și sănătate la locul de muncă',
    titleBG: 'Наредба № 7 за минималните изисквания за здравословни и безопасни условия на труд на работните места',
    number: 'ДВ бр. 82',
    year: 2005,
    domain: 'conditii_munca',
    description: 'Stabilește cerințele minime pentru amenajarea și organizarea locurilor de muncă, asigurarea condițiilor de lucru sigure și sănătoase.'
  },
  {
    id: 'naredba-rd-07-2',
    title: 'Ordonanța RD-07-2 - Instruirea lucrătorilor în SSM',
    titleBG: 'Наредба № РД-07-2 за условията и реда за провеждане на периодично обучение и инструктаж на работниците и служителите',
    number: 'ДВ бр. 52',
    year: 2009,
    domain: 'ssm',
    description: 'Reglementează condițiile și procedura de desfășurare a instruirii periodice și instruirii lucrătorilor în domeniul securității și sănătății în muncă.'
  },
  {
    id: 'naredba-3',
    title: 'Ordonanța nr. 3 - Protecția lucrătorilor împotriva riscurilor legate de agenți chimici',
    titleBG: 'Наредба № 3 за защита на работещите от рискове, свързани с експозиция на химични агенти',
    number: 'ДВ бр. 45',
    year: 2003,
    domain: 'ssm',
    description: 'Stabilește cerințe pentru protecția lucrătorilor expuși la agenți chimici periculoși, măsuri de prevenire și echipamente de protecție necesare.'
  },
  {
    id: 'naredba-5',
    title: 'Ordonanța nr. 5 - Controlul medical al lucrătorilor',
    titleBG: 'Наредба № 5 за реда, начина и периодичността на извършване на медицински прегледи',
    number: 'ДВ бр. 45',
    year: 2006,
    domain: 'medicina_muncii',
    description: 'Reglementează modul, periodicitatea și condițiile de efectuare a examenelor medicale preventive și periodice ale lucrătorilor.'
  },
  {
    id: 'naredba-1',
    title: 'Ordonanța nr. 1 - Cerințe pentru munca cu echipamente cu ecran de vizualizare',
    titleBG: 'Наредба № 1 за минималните изисквания за осигуряване на здравословни и безопасни условия на труд при работа с видеодисплеи',
    number: 'ДВ бр. 11',
    year: 2008,
    domain: 'conditii_munca',
    description: 'Stabilește cerințele minime pentru asigurarea condițiilor sănătoase și sigure de muncă la locurile de muncă cu echipamente cu ecran de vizualizare.'
  },
  {
    id: 'naredba-2',
    title: 'Ordonanța nr. 2 - Protecția lucrătorilor împotriva zgomotului',
    titleBG: 'Наредба № 2 за минималните изисквания за здравословни и безопасни условия на труд при работа в среда с шум',
    number: 'ДВ бр. 94',
    year: 2007,
    domain: 'ssm',
    description: 'Reglementează măsurile de protecție a lucrătorilor împotriva riscurilor pentru sănătate cauzate de expunerea la zgomot la locul de muncă.'
  },
  {
    id: 'naredba-pожзashita',
    title: 'Ordonanța privind apărarea împotriva incendiilor',
    titleBG: 'Наредба за реда за издаване на удостоверения за противопожарна безопасност',
    number: 'ДВ бр. 80',
    year: 2016,
    domain: 'psi',
    description: 'Stabilește procedura de eliberare a certificatelor de siguranță la incendiu și cerințele pentru prevenirea și stingerea incendiilor.'
  },
  {
    id: 'naredba-8',
    title: 'Ordonanța nr. 8 - Manipularea manuală a sarcinilor',
    titleBG: 'Наредба № 8 за минималните изисквания за здравословни и безопасни условия на труд при ръчно пренасяне на тежести',
    number: 'ДВ бр. 86',
    year: 2005,
    domain: 'ssm',
    description: 'Reglementează cerințele minime pentru protecția lucrătorilor la manipularea manuală a sarcinilor care prezintă riscuri de leziuni dorso-lombare.'
  },
  {
    id: 'naredba-6',
    title: 'Ordonanța nr. 6 - Cerințe pentru echipamentele individuale de protecție',
    titleBG: 'Наредба № 6 за минималните изисквания за осигуряване на лични предпазни средства',
    number: 'ДВ бр. 104',
    year: 2005,
    domain: 'ssm',
    description: 'Stabilește cerințele minime pentru asigurarea, utilizarea și întreținerea echipamentelor individuale de protecție (EIP) la locul de muncă.'
  }
];

export default legislatieBG;
