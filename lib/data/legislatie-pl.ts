/**
 * Legislative acts database for Poland (PL)
 * Main SSM (Occupational Safety and Health) regulations
 */

export interface LegislativeAct {
  id: string;
  title: string;
  titlePL: string;
  number: string;
  domain: 'ssm' | 'psi' | 'medical' | 'general';
  description: string;
}

export const legislatiePL: LegislativeAct[] = [
  {
    id: 'pl-kodeks-pracy',
    title: 'Codul muncii',
    titlePL: 'Kodeks pracy',
    number: 'Ustawa z dnia 26 czerwca 1974 r. (Dz.U. 2023 poz. 1465)',
    domain: 'general',
    description: 'Actul normativ fundamental care reglementează relațiile de muncă în Polonia, inclusiv prevederi privind securitatea și sănătatea în muncă, timpul de lucru, concediile și drepturile angajaților.'
  },
  {
    id: 'pl-rozp-bhp',
    title: 'Regulamentul general privind securitatea și sănătatea în muncă',
    titlePL: 'Rozporządzenie w sprawie ogólnych przepisów bezpieczeństwa i higieny pracy',
    number: 'Rozporządzenie z dnia 26 września 1997 r. (Dz.U. 2003 Nr 169 poz. 1650)',
    domain: 'ssm',
    description: 'Reglementări generale privind asigurarea condițiilor de securitate și igienă în muncă, organizarea locurilor de muncă, obligațiile angajatorului și ale lucrătorilor.'
  },
  {
    id: 'pl-sluzba-bhp',
    title: 'Organizarea serviciului SSM în întreprindere',
    titlePL: 'Rozporządzenie w sprawie służby bezpieczeństwa i higieny pracy',
    number: 'Rozporządzenie z dnia 2 września 1997 r. (Dz.U. 1997 Nr 109 poz. 704)',
    domain: 'ssm',
    description: 'Definește modul de organizare a serviciului de securitate și sănătate în muncă, numărul necesar de specialiști BHP, calificările acestora și domeniile lor de responsabilitate.'
  },
  {
    id: 'pl-szkolenia-bhp',
    title: 'Instruirea în domeniul securității și sănătății în muncă',
    titlePL: 'Rozporządzenie w sprawie szkolenia w dziedzinie bezpieczeństwa i higieny pracy',
    number: 'Rozporządzenie z dnia 27 lipca 2004 r. (Dz.U. 2004 Nr 180 poz. 1860)',
    domain: 'ssm',
    description: 'Stabilește tipurile obligatorii de instruire BHP (instruire inițială, periodică, pentru conducători), formele, durata și conținutul acestora.'
  },
  {
    id: 'pl-wypadki-przy-pracy',
    title: 'Procedura de investigare a accidentelor de muncă',
    titlePL: 'Rozporządzenie w sprawie ustalania okoliczności i przyczyn wypadków przy pracy',
    number: 'Rozporządzenie z dnia 1 lipca 2009 r. (Dz.U. 2009 Nr 105 poz. 870)',
    domain: 'ssm',
    description: 'Reglementează procedura de stabilire a împrejurărilor și cauzelor accidentelor de muncă, obligația de notificare, termenele de investigare și documentația necesară.'
  },
  {
    id: 'pl-badania-lekarskie',
    title: 'Controalele medicale profilactice ale lucrătorilor',
    titlePL: 'Rozporządzenie w sprawie profilaktycznych badań lekarskich pracowników',
    number: 'Rozporządzenie z dnia 10 grudnia 2021 r. (Dz.U. 2021 poz. 2314)',
    domain: 'medical',
    description: 'Stabilește tipurile de controale medicale obligatorii (inițiale, periodice, de control), frecvența acestora în funcție de factorii de risc și categoriile de lucrători supuși acestor controale.'
  },
  {
    id: 'pl-czynniki-szkodliwe',
    title: 'Valori maxime admise pentru agenți nocivi în mediul de lucru',
    titlePL: 'Rozporządzenie w sprawie najwyższych dopuszczalnych stężeń i natężeń czynników szkodliwych dla zdrowia w środowisku pracy',
    number: 'Rozporządzenie z dnia 12 czerwca 2018 r. (Dz.U. 2021 poz. 325)',
    domain: 'ssm',
    description: 'Definește valorile maxime admise (NDS, NDSCh) pentru concentrațiile de substanțe chimice, nivelurile de zgomot, vibrații și alți factori nocivi în mediul de lucru.'
  },
  {
    id: 'pl-ochrona-przeciwpozarowa',
    title: 'Protecția împotriva incendiilor a clădirilor și altor construcții',
    titlePL: 'Rozporządzenie w sprawie ochrony przeciwpożarowej budynków, innych obiektów budowlanych i terenów',
    number: 'Rozporządzenie z dnia 7 czerwca 2010 r. (Dz.U. 2023 poz. 822)',
    domain: 'psi',
    description: 'Reglementări tehnice privind protecția împotriva incendiilor: căi de evacuare, sisteme de alarmă, echipamente de stingere, instruirea angajaților și planurile de evacuare.'
  },
  {
    id: 'pl-prace-niebezpieczne',
    title: 'Lucrări deosebit de periculoase',
    titlePL: 'Rozporządzenie w sprawie wykazu prac szczególnie niebezpiecznych',
    number: 'Rozporządzenie z dnia 26 września 1997 r. (Dz.U. 2003 Nr 193 poz. 1881)',
    domain: 'ssm',
    description: 'Lista lucrărilor deosebit de periculoase care necesită proceduri speciale de autorizare, supraveghere continuă și măsuri suplimentare de protecție (lucrări la înălțime, în spații înguste, cu substanțe toxice etc.).'
  },
  {
    id: 'pl-srodki-ochrony-indywidualnej',
    title: 'Echipamentele individuale de protecție',
    titlePL: 'Rozporządzenie w sprawie minimalnych wymagań dotyczących środków ochrony indywidualnej',
    number: 'Rozporządzenie z dnia 20 grudnia 2022 r. (Dz.U. 2023 poz. 19)',
    domain: 'ssm',
    description: 'Cerințe minime privind punerea la dispoziție, utilizarea și întreținerea echipamentelor individuale de protecție (EIP), precum și obligațiile angajatorului de a asigura EIP-uri adecvate riscurilor identificate.'
  }
];

export default legislatiePL;
