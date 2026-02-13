// Extended SSM Quiz Bank - 100 additional questions organized by safety modules
// Created for s-s-m.ro platform - workplace safety training

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  module: string;
}

export const quizBankExtended: QuizQuestion[] = [
  // ==================== LUCRU LA ÎNĂLȚIME (15 questions) ====================
  {
    id: 'height_001',
    question: 'De la ce înălțime este considerat "lucru la înălțime" conform legislației SSM?',
    options: [
      'De la 1 metru',
      'De la 2 metri',
      'De la 3 metri',
      'De la 5 metri'
    ],
    correctIndex: 1,
    explanation: 'Lucrul la înălțime este definit ca activitate desfășurată la o înălțime de minimum 2 metri față de nivelul de referință.',
    difficulty: 'easy',
    module: 'lucru_inaltime'
  },
  {
    id: 'height_002',
    question: 'Care este lungimea maximă permisă pentru o scară portabilă utilizată pentru acces?',
    options: [
      '3 metri',
      '5 metri',
      '8 metri',
      '10 metri'
    ],
    correctIndex: 1,
    explanation: 'Scările portabile pentru acces nu trebuie să depășească 5 metri lungime pentru a asigura stabilitatea și siguranța.',
    difficulty: 'medium',
    module: 'lucru_inaltime'
  },
  {
    id: 'height_003',
    question: 'Centura de siguranță folosită la lucrul la înălțime trebuie verificată:',
    options: [
      'O dată pe an',
      'Înainte de fiecare utilizare',
      'O dată la 6 luni',
      'Doar când pare deteriorată'
    ],
    correctIndex: 1,
    explanation: 'Echipamentul de protecție individuală pentru lucrul la înălțime trebuie verificat vizual și funcțional înainte de fiecare utilizare.',
    difficulty: 'easy',
    module: 'lucru_inaltime'
  },
  {
    id: 'height_004',
    question: 'Unghiul optim de sprijinire a unei scări față de perete este:',
    options: [
      '45 de grade',
      '60 de grade',
      '75 de grade',
      '90 de grade'
    ],
    correctIndex: 2,
    explanation: 'Unghiul optim este de aproximativ 75 de grade (raport 1:4 - pentru 4m înălțime, baza scării la 1m de perete).',
    difficulty: 'medium',
    module: 'lucru_inaltime'
  },
  {
    id: 'height_005',
    question: 'Schelele mobile pot fi utilizate la o înălțime maximă de:',
    options: [
      '6 metri',
      '8 metri',
      '12 metri',
      'Nu există limită'
    ],
    correctIndex: 2,
    explanation: 'Schelele mobile sunt permise până la 12 metri înălțime, cu respectarea raportului stabilitate înălțime/bază.',
    difficulty: 'hard',
    module: 'lucru_inaltime'
  },
  {
    id: 'height_006',
    question: 'Platforma de lucru la înălțime trebuie să aibă balustrade de protecție cu înălțimea minimă de:',
    options: [
      '90 cm',
      '100 cm',
      '110 cm',
      '120 cm'
    ],
    correctIndex: 1,
    explanation: 'Balustrादele de protecție trebuie să aibă minimum 100 cm înălțime pentru a preveni căderile.',
    difficulty: 'medium',
    module: 'lucru_inaltime'
  },
  {
    id: 'height_007',
    question: 'La lucrul pe acoperiș cu pantă mai mare de 30°, este obligatorie utilizarea:',
    options: [
      'Încălțăminte antiderapantă',
      'Sistem de prindere și centură de siguranță',
      'Cască de protecție',
      'Mănuși de protecție'
    ],
    correctIndex: 1,
    explanation: 'Pentru acoperișuri cu pantă peste 30°, este obligatoriu sistemul de prindere cu centură pentru prevenirea căderii.',
    difficulty: 'medium',
    module: 'lucru_inaltime'
  },
  {
    id: 'height_008',
    question: 'Distanța maximă de cădere liberă permisă cu sistem de oprire a căderii este:',
    options: [
      '1 metru',
      '2 metri',
      '4 metri',
      '6 metri'
    ],
    correctIndex: 3,
    explanation: 'Sistemul de oprire a căderii trebuie proiectat astfel încât distanța de cădere liberă să nu depășească 6 metri.',
    difficulty: 'hard',
    module: 'lucru_inaltime'
  },
  {
    id: 'height_009',
    question: 'Plasa de siguranță pentru protecția la cădere trebuie instalată la maximum:',
    options: [
      '2 metri sub locul de lucru',
      '3 metri sub locul de lucru',
      '6 metri sub locul de lucru',
      '10 metri sub locul de lucru'
    ],
    correctIndex: 2,
    explanation: 'Plasele de siguranță trebuie poziționate la maximum 6 metri sub nivelul de lucru pentru eficiență maximă.',
    difficulty: 'hard',
    module: 'lucru_inaltime'
  },
  {
    id: 'height_010',
    question: 'Lucrul pe scări este interzis când viteza vântului depășește:',
    options: [
      '20 km/h',
      '40 km/h',
      '60 km/h',
      '80 km/h'
    ],
    correctIndex: 1,
    explanation: 'La viteză vântului peste 40 km/h (aproximativ 11 m/s), lucrul pe scări și schele devine periculos.',
    difficulty: 'medium',
    module: 'lucru_inaltime'
  },
  {
    id: 'height_011',
    question: 'Schelele trebuie ancorate la structura clădirii la fiecare:',
    options: [
      '2 metri vertical și 4 metri orizontal',
      '4 metri vertical și 6 metri orizontal',
      '6 metri vertical și 8 metri orizontal',
      '8 metri vertical și 10 metri orizontal'
    ],
    correctIndex: 1,
    explanation: 'Ancorarea standard a schelelor este la 4 metri pe verticală și 6 metri pe orizontală.',
    difficulty: 'hard',
    module: 'lucru_inaltime'
  },
  {
    id: 'height_012',
    question: 'Lățimea minimă a platformei de lucru pe schelă trebuie să fie:',
    options: [
      '40 cm',
      '60 cm',
      '80 cm',
      '100 cm'
    ],
    correctIndex: 1,
    explanation: 'Platforma de lucru trebuie să aibă minimum 60 cm lățime pentru circulație și lucru în siguranță.',
    difficulty: 'easy',
    module: 'lucru_inaltime'
  },
  {
    id: 'height_013',
    question: 'Autorizația de lucru la înălțime este necesară pentru lucrări peste:',
    options: [
      '2 metri',
      '3 metri',
      '5 metri',
      'Nu este obligatorie'
    ],
    correctIndex: 1,
    explanation: 'Autorizația de lucru la înălțime este necesară pentru lucrări executate la peste 3 metri înălțime.',
    difficulty: 'medium',
    module: 'lucru_inaltime'
  },
  {
    id: 'height_014',
    question: 'Punctul de ancorare pentru centură de siguranță trebuie să reziste la o forță de minimum:',
    options: [
      '5 kN (aproximativ 500 kg)',
      '10 kN (aproximativ 1000 kg)',
      '15 kN (aproximativ 1500 kg)',
      '20 kN (aproximativ 2000 kg)'
    ],
    correctIndex: 2,
    explanation: 'Punctul de ancorare trebuie să reziste la minimum 15 kN pentru a prelua forța în caz de cădere.',
    difficulty: 'hard',
    module: 'lucru_inaltime'
  },
  {
    id: 'height_015',
    question: 'Instructajul specific pentru lucrul la înălțime trebuie refăcut:',
    options: [
      'La fiecare 6 luni',
      'O dată pe an',
      'La fiecare schimbare de șantier',
      'La începerea lucrărilor și periodic conform evaluării riscurilor'
    ],
    correctIndex: 3,
    explanation: 'Instructajul se efectuează la începerea lucrărilor și periodic conform planului de prevenire și evaluării riscurilor.',
    difficulty: 'medium',
    module: 'lucru_inaltime'
  },

  // ==================== SUBSTANȚE PERICULOASE (15 questions) ====================
  {
    id: 'hazmat_001',
    question: 'Pictograma cu craniu și oase încrucișate pe etichetă indică:',
    options: [
      'Substanță iritantă',
      'Substanță toxică/otrăvitoare',
      'Substanță corosivă',
      'Substanță inflamabilă'
    ],
    correctIndex: 1,
    explanation: 'Craniul cu oase încrucișate este pictograma standard pentru substanțe toxice acute conform CLP.',
    difficulty: 'easy',
    module: 'substante_periculoase'
  },
  {
    id: 'hazmat_002',
    question: 'Fișa de securitate (FDS/MSDS) a substanței chimice trebuie să conțină:',
    options: [
      '8 secțiuni',
      '12 secțiuni',
      '16 secțiuni',
      '20 secțiuni'
    ],
    correctIndex: 2,
    explanation: 'Fișa de securitate conform REACH/CLP conține 16 secțiuni standardizate cu informații complete despre substanță.',
    difficulty: 'medium',
    module: 'substante_periculoase'
  },
  {
    id: 'hazmat_003',
    question: 'Depozitarea substanțelor inflamabile trebuie să se facă:',
    options: [
      'Împreună cu substanțele corosive',
      'Într-un spațiu ventilat, separat de surse de aprindere',
      'În depozitul general, pe orice raft',
      'Lângă substanțele oxidante'
    ],
    correctIndex: 1,
    explanation: 'Substanțele inflamabile necesită depozitare separată, în spații ventilate, departe de surse de căldură și aprindere.',
    difficulty: 'easy',
    module: 'substante_periculoase'
  },
  {
    id: 'hazmat_004',
    question: 'Echipamentul de protecție pentru manipularea acizilor tari include obligatoriu:',
    options: [
      'Doar mănuși',
      'Mănuși și ochelari de protecție',
      'Mănuși, ochelari, șorț rezistent chimic',
      'Doar ochelari de protecție'
    ],
    correctIndex: 2,
    explanation: 'Manipularea acizilor tari necesită protecție completă: mănuși rezistente chimic, ochelari și șorț/halat protector.',
    difficulty: 'easy',
    module: 'substante_periculoase'
  },
  {
    id: 'hazmat_005',
    question: 'Valoarea limită de expunere profesională (VLE) reprezintă:',
    options: [
      'Concentrația maximă permisă pentru 15 minute',
      'Concentrația medie permisă pe 8 ore de lucru',
      'Concentrația toxică mortală',
      'Concentrația de la care apare iritația'
    ],
    correctIndex: 1,
    explanation: 'VLE (TWA) este concentrația medie permisă pentru o zi de lucru de 8 ore și săptămână de 40 ore.',
    difficulty: 'medium',
    module: 'substante_periculoase'
  },
  {
    id: 'hazmat_006',
    question: 'Substanțele CMR sunt:',
    options: [
      'Corosive, Mutagene, Radioactive',
      'Cancerigene, Mutagene, Reprotoxice',
      'Combustibile, Metalice, Reactive',
      'Compuse, Mixte, Rafinate'
    ],
    correctIndex: 1,
    explanation: 'CMR = Cancerigene, Mutagene și toxic Reprotoxice - substanțe cu risc ridicat pentru sănătate.',
    difficulty: 'medium',
    module: 'substante_periculoase'
  },
  {
    id: 'hazmat_007',
    question: 'În caz de revărsat de acid pe piele, primul lucru de făcut este:',
    options: [
      'Aplicarea unei baze pentru neutralizare',
      'Clătirea abundentă cu apă timp de minimum 15 minute',
      'Ștergerea cu un prosop',
      'Aplicarea unei creme'
    ],
    correctIndex: 1,
    explanation: 'Clătirea imediată și abundentă cu apă este prioritară - neutralizarea chimică poate agrava arsura.',
    difficulty: 'easy',
    module: 'substante_periculoase'
  },
  {
    id: 'hazmat_008',
    question: 'Dușul de siguranță trebuie amplasat la o distanță maximă de:',
    options: [
      '5 metri de locul de lucru',
      '10 metri de locul de lucru',
      '15 metri de locul de lucru',
      '20 metri de locul de lucru'
    ],
    correctIndex: 1,
    explanation: 'Dușul de siguranță trebuie accesibil în maximum 10 secunde (aproximativ 10 metri) pentru intervenție rapidă.',
    difficulty: 'medium',
    module: 'substante_periculoase'
  },
  {
    id: 'hazmat_009',
    question: 'Masca cu filtru pentru substanțe organice volatile are codul de culoare:',
    options: [
      'Maro (A)',
      'Gri (B)',
      'Galben (E)',
      'Verde (K)'
    ],
    correctIndex: 0,
    explanation: 'Filtrul tip A (maro) este pentru vapori organici cu punct de fierbere >65°C (solvenți, benzine, etc.).',
    difficulty: 'hard',
    module: 'substante_periculoase'
  },
  {
    id: 'hazmat_010',
    question: 'Recipientele cu substanțe chimice trebuie etichetate cu:',
    options: [
      'Doar numele substanței',
      'Numele substanței și pictogramele de pericol',
      'Numele substanței, pictogramele de pericol, mențiuni de avertizare și pericol',
      'Doar pictogramele de pericol'
    ],
    correctIndex: 2,
    explanation: 'Eticheta conform CLP include: identificare, pictograme, mențiuni H și P, furnizor - informații complete.',
    difficulty: 'medium',
    module: 'substante_periculoase'
  },
  {
    id: 'hazmat_011',
    question: 'Transvazarea substanțelor chimice în recipiente fără etichetă este:',
    options: [
      'Permisă dacă știi ce conține',
      'Permisă doar temporar',
      'Interzisă - fiecare recipient trebuie etichetat',
      'Permisă pentru substanțe ne-periculoase'
    ],
    correctIndex: 2,
    explanation: 'Orice recipient cu substanțe chimice trebuie etichetat corespunzător - riscul confuziei este foarte mare.',
    difficulty: 'easy',
    module: 'substante_periculoase'
  },
  {
    id: 'hazmat_012',
    question: 'Depozitarea substanțelor oxidante împreună cu substanțe inflamabile poate cauza:',
    options: [
      'Nu există risc',
      'Risc de incendiu sau explozie',
      'Doar degajări de miros',
      'Degradarea substanțelor'
    ],
    correctIndex: 1,
    explanation: 'Oxidanții reacționează violent cu inflamabilii - risc major de incendiu/explozie. Depozitare separată obligatorie.',
    difficulty: 'easy',
    module: 'substante_periculoase'
  },
  {
    id: 'hazmat_013',
    question: 'Monitorizarea medicală a lucrătorilor expuși la substanțe CMR se face:',
    options: [
      'O dată la 2 ani',
      'O dată pe an',
      'La 6 luni',
      'Conform protocolului specific substanței'
    ],
    correctIndex: 3,
    explanation: 'Pentru substanțe CMR, supravegherea medicală se face conform protocolului specific - poate fi de la lunar la anual.',
    difficulty: 'hard',
    module: 'substante_periculoase'
  },
  {
    id: 'hazmat_014',
    question: 'Aerisirea încăperii după manipularea solvenților volatili trebuie făcută:',
    options: [
      'Nu este necesară',
      'Doar dacă miroase',
      'Continuu pe durata lucrului și după',
      'O dată pe zi'
    ],
    correctIndex: 2,
    explanation: 'Solvenții volatili necesită ventilare continuă pentru menținerea concentrației sub VLE și eliminarea vaporilor.',
    difficulty: 'medium',
    module: 'substante_periculoase'
  },
  {
    id: 'hazmat_015',
    question: 'Durata maximă de utilizare a unui filtru de mască pentru substanțe chimice depinde de:',
    options: [
      'Întotdeauna 8 ore',
      'Concentrația substanței și saturația filtrului',
      'Doar de dorința utilizatorului',
      'Este nelimitat dacă nu e vizibil deteriorat'
    ],
    correctIndex: 1,
    explanation: 'Filtrul trebuie înlocuit când se saturează (miros, gust, rezistență respirație) sau conform recomandărilor producătorului.',
    difficulty: 'medium',
    module: 'substante_periculoase'
  },

  // ==================== ECHIPAMENTE ELECTRICE (15 questions) ====================
  {
    id: 'electric_001',
    question: 'Tensiunea considerată "joasă tensiune" în sisteme electrice este:',
    options: [
      'Sub 50V',
      'Sub 1000V curent alternativ',
      'Sub 1500V curent continuu',
      'Sub 1000V AC sau sub 1500V DC'
    ],
    correctIndex: 3,
    explanation: 'Joasa tensiune: sub 1000V curent alternativ sau sub 1500V curent continuu conform standardelor.',
    difficulty: 'medium',
    module: 'echipamente_electrice'
  },
  {
    id: 'electric_002',
    question: 'Culorile cablului electric de protecție (împământare) sunt:',
    options: [
      'Roșu',
      'Negru',
      'Galben-verde',
      'Albastru'
    ],
    correctIndex: 2,
    explanation: 'Conductorul de protecție (PE - împământare) este întotdeauna galben-verde conform standardelor.',
    difficulty: 'easy',
    module: 'echipamente_electrice'
  },
  {
    id: 'electric_003',
    question: 'Verificarea periodică a instalațiilor electrice în spații industriale se face la:',
    options: [
      '6 luni',
      '1 an',
      '2 ani',
      '5 ani'
    ],
    correctIndex: 1,
    explanation: 'Verificarea tehnică periodică a instalațiilor electrice industriale este obligatorie anual.',
    difficulty: 'medium',
    module: 'echipamente_electrice'
  },
  {
    id: 'electric_004',
    question: 'Aparatul care protejează persoanele împotriva electrocutării este:',
    options: [
      'Siguranța fuzibilă',
      'Întrerupătorul automat',
      'Releu diferențial (RCD)',
      'Contactorul'
    ],
    correctIndex: 2,
    explanation: 'Releul diferențial (RCD/DDR) detectează curenții de scurgere și protejează persoanele prin declanșare rapidă.',
    difficulty: 'easy',
    module: 'echipamente_electrice'
  },
  {
    id: 'electric_005',
    question: 'Sensibilitatea recomandată a releului diferențial pentru protecția persoanelor în locuințe este:',
    options: [
      '10 mA',
      '30 mA',
      '100 mA',
      '300 mA'
    ],
    correctIndex: 1,
    explanation: '30 mA este sensibilitatea standard pentru protecția persoanelor în instalații rezidențiale și birouri.',
    difficulty: 'medium',
    module: 'echipamente_electrice'
  },
  {
    id: 'electric_006',
    question: 'Lucrările la instalații electrice sub tensiune pot fi executate doar de:',
    options: [
      'Orice electrician',
      'Personal autorizat ANRE cu instruire specifică',
      'Șeful de echipă',
      'Oricare angajat cu experiență'
    ],
    correctIndex: 1,
    explanation: 'Lucrările sub tensiune necesită autorizație ANRE specifică și instruire specializată conform normelor.',
    difficulty: 'easy',
    module: 'echipamente_electrice'
  },
  {
    id: 'electric_007',
    question: 'Distanța minimă de siguranță față de o linie electrică aeriană de 20kV este:',
    options: [
      '1 metru',
      '3 metri',
      '5 metri',
      '10 metri'
    ],
    correctIndex: 1,
    explanation: 'Pentru 20kV, distanța minimă de siguranță (DMS) este de 3 metri conform normativelor ANRE.',
    difficulty: 'hard',
    module: 'echipamente_electrice'
  },
  {
    id: 'electric_008',
    question: 'Clasa de protecție I la echipamente electrice înseamnă:',
    options: [
      'Dublu izolat',
      'Cu împământare obligatorie',
      'Tensiune foarte joasă de siguranță',
      'Protecție IP65'
    ],
    correctIndex: 1,
    explanation: 'Clasa I necesită împământare - protecția prin conectarea carcasei metalice la conductorul de protecție.',
    difficulty: 'medium',
    module: 'echipamente_electrice'
  },
  {
    id: 'electric_009',
    question: 'Simbolul IP44 pe un echipament electric indică:',
    options: [
      'Protecție totală la apă și praf',
      'Protecție la stropire și particule >1mm',
      'Fără protecție',
      'Protecție doar la praf'
    ],
    correctIndex: 1,
    explanation: 'IP44: prima cifră 4 = protecție la obiecte >1mm, a doua cifră 4 = protecție la stropire din orice direcție.',
    difficulty: 'hard',
    module: 'echipamente_electrice'
  },
  {
    id: 'electric_010',
    question: 'Înainte de orice intervenție la un echipament electric trebuie să:',
    options: [
      'Anunți șeful',
      'Deconectezi tensiunea și verifici absența acesteia',
      'Pui mănuși',
      'Citești instrucțiunile'
    ],
    correctIndex: 1,
    explanation: 'Regula de aur: Deconectare - Verificare - Împământare - Delimitare - Permis de lucru (pentru instalații).',
    difficulty: 'easy',
    module: 'echipamente_electrice'
  },
  {
    id: 'electric_011',
    question: 'Prelungitoarele electrice folosite în șantiere trebuie să fie:',
    options: [
      'Orice prelungitor standard',
      'Cu protecție IP44 minimum și cablu H07RN-F',
      'Doar pentru interior',
      'Cu siguranță fuzibilă'
    ],
    correctIndex: 1,
    explanation: 'Prelungitoarele pentru șantiere necesită IP44+, cablu cauciucat rezistent (H07RN-F) și eventual RCD integrat.',
    difficulty: 'medium',
    module: 'echipamente_electrice'
  },
  {
    id: 'electric_012',
    question: 'Tensiunea de siguranță în spații cu risc crescut (umede, metalice) este:',
    options: [
      '12V',
      '24V',
      '50V',
      '110V'
    ],
    correctIndex: 1,
    explanation: '24V curent alternativ este tensiunea de siguranță pentru spații cu risc crescut de electrocutare.',
    difficulty: 'medium',
    module: 'echipamente_electrice'
  },
  {
    id: 'electric_013',
    question: 'Un cablu electric deteriorat trebuie:',
    options: [
      'Izolat cu bandă adezivă',
      'Scos din uz și înlocuit',
      'Folosit cu atenție',
      'Reparat provizoriu'
    ],
    correctIndex: 1,
    explanation: 'Cablurile deteriorate prezintă risc de electrocutare și incendiu - trebuie înlocuite, nu reparate.',
    difficulty: 'easy',
    module: 'echipamente_electrice'
  },
  {
    id: 'electric_014',
    question: 'Testarea releului diferențial prin butonul TEST trebuie făcută:',
    options: [
      'O dată pe an',
      'Lunar',
      'La fiecare 6 luni',
      'Nu este necesară'
    ],
    correctIndex: 1,
    explanation: 'Testarea lunară a RCD prin butonul TEST asigură funcționarea corectă a protecției diferențiale.',
    difficulty: 'medium',
    module: 'echipamente_electrice'
  },
  {
    id: 'electric_015',
    question: 'Electrocutarea cu curent alternativ 230V poate fi mortală de la:',
    options: [
      '5 mA',
      '30 mA',
      '50 mA',
      '100 mA'
    ],
    correctIndex: 2,
    explanation: '50 mA curent alternativ prin corp poate provoca fibrilație ventriculară mortală. 30 mA = pragul protecției.',
    difficulty: 'hard',
    module: 'echipamente_electrice'
  },

  // ==================== INCENDIU ȘI EVACUARE (15 questions) ====================
  {
    id: 'fire_001',
    question: 'Clasele de incendiu sunt marcate cu litere. Clasa A reprezintă:',
    options: [
      'Lichide inflamabile',
      'Materiale solide (lemn, hârtie, textile)',
      'Gaze',
      'Metale'
    ],
    correctIndex: 1,
    explanation: 'Clasa A = materiale solide organice care formează jar (lemn, hârtie, textile, plastic).',
    difficulty: 'easy',
    module: 'incendiu_evacuare'
  },
  {
    id: 'fire_002',
    question: 'Stingătorul cu pulbere ABC poate fi folosit pentru:',
    options: [
      'Doar incendii clasa A',
      'Incendii clasa A, B și C',
      'Doar incendii electrice',
      'Doar incendii cu lichide'
    ],
    correctIndex: 1,
    explanation: 'Stingătorul ABC este universal pentru solide (A), lichide (B) și gaze (C) - cel mai versatil.',
    difficulty: 'easy',
    module: 'incendiu_evacuare'
  },
  {
    id: 'fire_003',
    question: 'Lățimea minimă a căilor de evacuare în clădiri trebuie să fie:',
    options: [
      '80 cm',
      '90 cm',
      '120 cm',
      '150 cm'
    ],
    correctIndex: 1,
    explanation: 'Căile de evacuare trebuie să aibă minimum 90 cm lățime liberă pentru circulație sigură în caz de urgență.',
    difficulty: 'medium',
    module: 'incendiu_evacuare'
  },
  {
    id: 'fire_004',
    question: 'Distanța maximă de parcurs până la ieșire/scară evacuare într-o clădire fără hidranți este:',
    options: [
      '15 metri',
      '25 metri',
      '35 metri',
      '50 metri'
    ],
    correctIndex: 2,
    explanation: 'Fără instalație de stingere, distanța maximă până la evacuare este 35 metri pentru siguranță.',
    difficulty: 'hard',
    module: 'incendiu_evacuare'
  },
  {
    id: 'fire_005',
    question: 'Un stingător portabil de 6kg pulbere are autonomia de aproximativ:',
    options: [
      '5-8 secunde',
      '10-15 secunde',
      '30 secunde',
      '1 minut'
    ],
    correctIndex: 1,
    explanation: 'Un stingător de 6kg ABC funcționează aproximativ 10-15 secunde - trebuie utilizat eficient și rapid.',
    difficulty: 'medium',
    module: 'incendiu_evacuare'
  },
  {
    id: 'fire_006',
    question: 'Ușile pe căile de evacuare trebuie să se deschidă:',
    options: [
      'În sensul de evacuare (spre exterior)',
      'În ambele sensuri',
      'Spre interior',
      'Nu contează'
    ],
    correctIndex: 0,
    explanation: 'Ușile de evacuare se deschid în sensul de evacuare pentru a facilita ieșirea rapidă în caz de panică.',
    difficulty: 'easy',
    module: 'incendiu_evacuare'
  },
  {
    id: 'fire_007',
    question: 'Depozitarea materialelor inflamabile în cantități mari necesită:',
    options: [
      'Doar ventiлație',
      'Autorizație ISU și măsuri speciale de siguranță',
      'Nimic special',
      'Doar stingătoare'
    ],
    correctIndex: 1,
    explanation: 'Depozitele de inflamabile necesită autorizație ISU, separare, ventilație, detectie și stingere conformă.',
    difficulty: 'easy',
    module: 'incendiu_evacuare'
  },
  {
    id: 'fire_008',
    question: 'Semnalizarea ieșirilor de evacuare trebuie să fie:',
    options: [
      'Doar pictograme',
      'Iluminată permanent sau de urgență',
      'Vopsită pe ușă',
      'Nu este obligatorie'
    ],
    correctIndex: 1,
    explanation: 'Semnalizarea evacuării trebuie iluminată permanent sau prin iluminat de siguranță în caz de pană.',
    difficulty: 'medium',
    module: 'incendiu_evacuare'
  },
  {
    id: 'fire_009',
    question: 'La un incendiu cu echipamente electrice sub tensiune se folosește:',
    options: [
      'Apă',
      'Spumă',
      'CO2 sau pulbere',
      'Nisip'
    ],
    correctIndex: 2,
    explanation: 'Pentru incendii electrice: CO2 (neconductor) sau pulbere ABC. NICIODATĂ apă (risc electrocutare).',
    difficulty: 'easy',
    module: 'incendiu_evacuare'
  },
  {
    id: 'fire_010',
    question: 'Verificarea și întreținerea stingătoarelor se face:',
    options: [
      'La fiecare 2 ani',
      'Anual',
      'La 6 luni',
      'Când expiră'
    ],
    correctIndex: 1,
    explanation: 'Verificarea anuală obligatorie + verificare la 5 ani (reîncărcare) pentru menținerea funcționalității.',
    difficulty: 'medium',
    module: 'incendiu_evacuare'
  },
  {
    id: 'fire_011',
    question: 'Triunghiul focului este format din:',
    options: [
      'Combustibil, oxigen, căldură',
      'Foc, fum, căldură',
      'Apă, aer, foc',
      'Lemn, benzină, oxigen'
    ],
    correctIndex: 0,
    explanation: 'Focul necesită 3 elemente: combustibil (material), comburant (oxigen) și energie de activare (căldură).',
    difficulty: 'easy',
    module: 'incendiu_evacuare'
  },
  {
    id: 'fire_012',
    question: 'Evacuarea în caz de incendiu se face folosind:',
    options: [
      'Liftul pentru rapiditate',
      'Doar scările',
      'Ferestre',
      'Așteptând pompierii'
    ],
    correctIndex: 1,
    explanation: 'NICIODATĂ lift în caz de incendiu! Doar scări - liftul poate rămâne blocat sau duce în zona afectată.',
    difficulty: 'easy',
    module: 'incendiu_evacuare'
  },
  {
    id: 'fire_013',
    question: 'Planul de evacuare trebuie să fie afișat:',
    options: [
      'Doar la intrare',
      'La fiecare etaj, vizibil',
      'Nu este obligatoriu',
      'Doar în biroul șefului'
    ],
    correctIndex: 1,
    explanation: 'Planul de evacuare trebuie afișat la fiecare nivel, vizibil, cu trasee marcate și puncte de adunare.',
    difficulty: 'medium',
    module: 'incendiu_evacuare'
  },
  {
    id: 'fire_014',
    question: 'Exercițiul de evacuare în clădiri cu peste 50 persoane trebuie executat:',
    options: [
      'O dată pe an',
      'De 2 ori pe an',
      'Nu este obligatoriu',
      'La fiecare 3 ani'
    ],
    correctIndex: 1,
    explanation: 'Pentru clădiri cu peste 50 persoane, exercițiile de evacuare sunt obligatorii de minimum 2 ori/an.',
    difficulty: 'medium',
    module: 'incendiu_evacuare'
  },
  {
    id: 'fire_015',
    question: 'Hidranții interiori trebuie amplasați astfel încât să acopere orice punct la maximum:',
    options: [
      '15 metri',
      '25 metri',
      '30 metri',
      '50 metri'
    ],
    correctIndex: 2,
    explanation: 'Hidranții interiori trebuie poziționați pentru acoperire la maximum 30 metri rază de acțiune.',
    difficulty: 'hard',
    module: 'incendiu_evacuare'
  },

  // ==================== ERGONOMIE LA BIROU (10 questions) ====================
  {
    id: 'ergo_001',
    question: 'Înălțimea optimă a monitorului: partea superioară la nivelul:',
    options: [
      'Frunții',
      'Ochilor sau puțin sub',
      'Nasului',
      'Bărbiei'
    ],
    correctIndex: 1,
    explanation: 'Partea de sus a monitorului la nivelul ochilor sau puțin sub - privirea ușor în jos, cap în poziție neutră.',
    difficulty: 'easy',
    module: 'ergonomie_birou'
  },
  {
    id: 'ergo_002',
    question: 'Distanța optimă între ochi și monitor este:',
    options: [
      '30-40 cm',
      '50-70 cm',
      '80-100 cm',
      'Peste 100 cm'
    ],
    correctIndex: 1,
    explanation: '50-70 cm (lungimea brațului) este distanța optimă pentru confort vizual și postură corectă.',
    difficulty: 'easy',
    module: 'ergonomie_birou'
  },
  {
    id: 'ergo_003',
    question: 'Unghiul format de cot la lucrul pe tastatură trebuie să fie:',
    options: [
      '60-70 grade',
      '90-110 grade',
      '120-130 grade',
      '180 grade'
    ],
    correctIndex: 1,
    explanation: 'Cotul la aproximativ 90° (sau ușor mai deschis) cu antebrațele orizontale reduce tensiunea musculară.',
    difficulty: 'medium',
    module: 'ergonomie_birou'
  },
  {
    id: 'ergo_004',
    question: 'Pauza recomandată pentru utilizatorii de calculatoare este:',
    options: [
      '5 minute la fiecare oră',
      '10 minute la fiecare 2 ore',
      '15 minute la fiecare 2 ore',
      'Nu este necesară'
    ],
    correctIndex: 2,
    explanation: 'Regula 20-20-20: la fiecare 20 min, privește 20 secunde la 20 picioare distanță + pauză 15 min/2 ore.',
    difficulty: 'medium',
    module: 'ergonomie_birou'
  },
  {
    id: 'ergo_005',
    question: 'Scaunul de birou ergonomic trebuie să aibă obligatoriu:',
    options: [
      'Doar rotile',
      'Spătar reglabil, șezut reglabil pe înălțime, suport lombar',
      'Doar înălțime reglabilă',
      'Culoare plăcută'
    ],
    correctIndex: 1,
    explanation: 'Scaunul ergonomic necesită: înălțime reglabilă, spătar cu suport lombar, adâncime șezut ajustabilă.',
    difficulty: 'easy',
    module: 'ergonomie_birou'
  },
  {
    id: 'ergo_006',
    question: 'Iluminarea recomandată pentru lucru la birou este:',
    options: [
      '100-200 lux',
      '300-500 lux',
      '800-1000 lux',
      'Peste 1500 lux'
    ],
    correctIndex: 1,
    explanation: '300-500 lux este nivelul optim pentru lucru la calculator - evită oboseala vizuală și reflecțiile.',
    difficulty: 'hard',
    module: 'ergonomie_birou'
  },
  {
    id: 'ergo_007',
    question: 'Picioarele utilizatorului la calculator trebuie să fie:',
    options: [
      'Atârnând liber',
      'Încrucișate',
      'Sprijinite complet pe podea sau suport',
      'Pe vârfuri'
    ],
    correctIndex: 2,
    explanation: 'Picioarele complet sprijinite pe podea (sau suport dacă scaunul e prea înalt) asigură stabilitate și circulație.',
    difficulty: 'easy',
    module: 'ergonomie_birou'
  },
  {
    id: 'ergo_008',
    question: 'Mouse-ul trebuie poziționat:',
    options: [
      'Cât mai departe',
      'La același nivel cu tastatura, aproape de corp',
      'Pe partea opusă tastaturii',
      'Nu contează'
    ],
    correctIndex: 1,
    explanation: 'Mouse-ul aproape de corp, la același nivel cu tastatura evită suprasolicitarea umărului și brațului.',
    difficulty: 'easy',
    module: 'ergonomie_birou'
  },
  {
    id: 'ergo_009',
    question: 'Temperatura optimă în birouri pentru confort este:',
    options: [
      '16-18°C',
      '20-24°C',
      '26-28°C',
      'Peste 30°C'
    ],
    correctIndex: 1,
    explanation: '20-24°C este intervalul optim de temperatură pentru muncă la birou conform standardelor ergonomice.',
    difficulty: 'medium',
    module: 'ergonomie_birou'
  },
  {
    id: 'ergo_010',
    question: 'Utilizarea laptopului fără accesorii ergonomice pe perioade lungi:',
    options: [
      'Este perfect OK',
      'Poate cauza dureri cervicale și de încheieturi',
      'Este recomandată',
      'Nu are impact'
    ],
    correctIndex: 1,
    explanation: 'Laptopul necesită suport pentru monitor + tastatură externă pentru poziție ergonomică corectă pe termen lung.',
    difficulty: 'easy',
    module: 'ergonomie_birou'
  },

  // ==================== CONSTRUCȚII (15 questions) ====================
  {
    id: 'construction_001',
    question: 'Casca de protecție pe șantier trebuie purtată:',
    options: [
      'Doar când lucrezi la înălțime',
      'Doar când există risc evident',
      'Permanent în zona de șantier',
      'Nu este obligatorie'
    ],
    correctIndex: 2,
    explanation: 'Casca de protecție este obligatorie permanent în zona de șantier - risc constant de cădere obiecte.',
    difficulty: 'easy',
    module: 'constructii'
  },
  {
    id: 'construction_002',
    question: 'Planul de securitate și sănătate (PSS) pentru șantier este obligatoriu când:',
    options: [
      'Întotdeauna',
      'Peste 30 zile-lucrător sau lucrări periculoase',
      'Doar pentru clădiri peste 3 etaje',
      'Nu este niciodată obligatoriu'
    ],
    correctIndex: 1,
    explanation: 'PSS este obligatoriu pentru șantiere cu peste 30 zile-lucrător SAU lucrări enumerate în anexa legislației.',
    difficulty: 'medium',
    module: 'constructii'
  },
  {
    id: 'construction_003',
    question: 'Adâncimea minimă la care trebuie protejate săpăturile pentru prevenirea prăbușirilor este:',
    options: [
      '0.5 metri',
      '1 metru',
      '1.25 metri',
      '2 metri'
    ],
    correctIndex: 2,
    explanation: 'Săpături peste 1.25 m necesită protecție prin taluzare, sprijinire sau blindare conform normelor.',
    difficulty: 'medium',
    module: 'constructii'
  },
  {
    id: 'construction_004',
    question: 'Încălțămintea de protecție pe șantier trebuie să aibă obligatoriu:',
    options: [
      'Doar branț rezistent',
       'Bombeu metalic/composite și talpă antiperforate',
      'Doar talpă antiderapantă',
      'Nu este necesară protecție'
    ],
    correctIndex: 1,
    explanation: 'Încălțămintea S3 standard pentru construcții: bombeu protecție, talpă antiperforate, antiderapantă, rezistentă.',
    difficulty: 'easy',
    module: 'constructii'
  },
  {
    id: 'construction_005',
    question: 'Coordonatorul de securitate (CSC) pe șantier trebuie să fie:',
    options: [
      'Șeful de șantier',
      'Orice inginer',
      'Persoană fizică/juridică atestată de MLPDA',
      'Nu este necesar'
    ],
    correctIndex: 2,
    explanation: 'CSC trebuie atestat de Ministerul Muncii conform legislației - rol distinct de șef șantier.',
    difficulty: 'medium',
    module: 'constructii'
  },
  {
    id: 'construction_006',
    question: 'Delimitarea șantierului față de domeniul public se face prin:',
    options: [
      'Bandă de avertizare',
      'Gard/împrejmuire solidă minimum 2m înălțime',
      'Nu este necesară',
      'Conuri de semnalizare'
    ],
    correctIndex: 1,
    explanation: 'Șantierul trebuie împrejmuit cu gard solid minimum 2 metri pentru protecția publicului și securitate.',
    difficulty: 'easy',
    module: 'constructii'
  },
  {
    id: 'construction_007',
    question: 'Platformele de lucru temporare trebuie să reziste la o sarcină de minimum:',
    options: [
      '75 kg/mp',
      '150 kg/mp',
      '300 kg/mp',
      '600 kg/mp'
    ],
    correctIndex: 2,
    explanation: 'Platformele de lucru trebuie dimensionate pentru minimum 300 kg/mp (persoane + materiale + echipamente).',
    difficulty: 'hard',
    module: 'constructii'
  },
  {
    id: 'construction_008',
    question: 'Betonarea în condiții de temperaturi sub 5°C necesită:',
    options: [
      'Se poate face normal',
      'Măsuri speciale (aditivi, încălzire, protecție)',
      'Este complet interzisă',
      'Doar dozaj mai mare de ciment'
    ],
    correctIndex: 1,
    explanation: 'Sub 5°C: aditivi antigel, protecție termică, monitorizare - riscul înghețării apei din beton.',
    difficulty: 'medium',
    module: 'constructii'
  },
  {
    id: 'construction_009',
    question: 'Accesul lucrătorilor în excavații cu adâncime >1.25m se face prin:',
    options: [
      'Sărituri',
      'Scări sigure, fixate',
      'Coborâre pe pereți',
      'Nu contează'
    ],
    correctIndex: 1,
    explanation: 'Excavațiile necesită acces sigur prin scări fixate corespunzător - interzis accesul prin sărituri sau cățărare.',
    difficulty: 'easy',
    module: 'constructii'
  },
  {
    id: 'construction_010',
    question: 'Demolările controlate necesită:',
    options: [
      'Doar echipă de muncitori',
      'Proiect de demolire, autorizații, personal specializat',
      'Nimic special',
      'Doar utilaje'
    ],
    correctIndex: 1,
    explanation: 'Demolările necesită documentație completă: proiect, autorizație, plan de securitate, personal atestat.',
    difficulty: 'medium',
    module: 'constructii'
  },
  {
    id: 'construction_011',
    question: 'Protecția colectivă față de protecția individuală este:',
    options: [
      'Mai puțin importantă',
      'La fel de importantă',
      'Prioritară - se montează întâi',
      'Opțională'
    ],
    correctIndex: 2,
    explanation: 'Ierarhia prevenției: 1.Eliminare risc, 2.Protecție colectivă, 3.Protecție individuală - în această ordine!',
    difficulty: 'medium',
    module: 'constructii'
  },
  {
    id: 'construction_012',
    question: 'Plasele de protecție la fațadă trebuie să depășească ultimul nivel cu:',
    options: [
      '50 cm',
      '1 metru',
      '1.5 metri',
      '2 metri'
    ],
    correctIndex: 1,
    explanation: 'Plasele de protecție trebuie să depășească ultimul nivel de lucru cu minimum 1 metru pentru eficiență.',
    difficulty: 'hard',
    module: 'constructii'
  },
  {
    id: 'construction_013',
    question: 'Utilajele de construcții pot fi operate doar de:',
    options: [
      'Orice muncitor',
      'Personal autorizat ISCIR cu certificat valabil',
      'Șeful de șantier',
      'Operatori cu experiență'
    ],
    correctIndex: 1,
    explanation: 'Utilajele (macarale, buldozere, etc.) necesită autorizație ISCIR specifică + instructaj pe echipament.',
    difficulty: 'easy',
    module: 'constructii'
  },
  {
    id: 'construction_014',
    question: 'Verificarea zilnică a utilajelor pe șantier se face de către:',
    options: [
      'Coordonator securitate',
      'Operatorul utilajului înainte de utilizare',
      'Șeful de șantier',
      'Nu este necesară'
    ],
    correctIndex: 1,
    explanation: 'Operatorul trebuie să verifice zilnic starea utilajului înainte de pornire - verificare pre-operațională.',
    difficulty: 'medium',
    module: 'constructii'
  },
  {
    id: 'construction_015',
    question: 'Distanța de siguranță față de linia electrică aeriană pentru utilaje este minimum:',
    options: [
      '1 metru',
      '3 metri',
      '5 metri',
      'Conform tabelului DMS funcție de tensiune'
    ],
    correctIndex: 3,
    explanation: 'DMS variază cu tensiunea: 3m pentru până la 20kV, 5m pentru 20-110kV, etc. - conform normativ ANRE.',
    difficulty: 'hard',
    module: 'constructii'
  },

  // ==================== DEPOZITARE (15 questions) ====================
  {
    id: 'storage_001',
    question: 'Înălțimea maximă de stivuire manuală a materialelor pe paleți este:',
    options: [
      '1.5 metri',
      '2 metri',
      '3 metri',
      'Nu există limită'
    ],
    correctIndex: 1,
    explanation: 'Pentru stivuire manuală, maximum 2 metri pentru stabilitate și siguranță în manipulare.',
    difficulty: 'medium',
    module: 'depozitare'
  },
  {
    id: 'storage_002',
    question: 'Coridoarele de circulație în depozite trebuie să aibă lățimea minimă de:',
    options: [
      '60 cm',
      '80 cm',
      '120 cm',
      '200 cm'
    ],
    correctIndex: 2,
    explanation: 'Coridoarele principale minimum 120 cm pentru circulație sigură a persoanelor și transportul manual.',
    difficulty: 'medium',
    module: 'depozitare'
  },
  {
    id: 'storage_003',
    question: 'Sistemele de rafturi metalice trebuie verificate:',
    options: [
      'La montaj',
      'Anual',
      'La montaj și periodic (anual sau după deteriorări)',
      'Nu necesită verificare'
    ],
    correctIndex: 2,
    explanation: 'Rafturile necesită verificare la montaj, anuală și după orice impact sau deteriorare pentru siguranță.',
    difficulty: 'medium',
    module: 'depozitare'
  },
  {
    id: 'storage_004',
    question: 'Capacitatea portantă a rafturilor trebuie:',
    options: [
      'Afișată vizibil pe fiecare nivel',
      'Doar în documentație',
      'Nu trebuie specificată',
      'Doar operatorul să o știe'
    ],
    correctIndex: 0,
    explanation: 'Fiecare nivel de raft trebuie marcat clar cu sarcina maximă admisibilă pentru prevenirea supraîncărcării.',
    difficulty: 'easy',
    module: 'depozitare'
  },
  {
    id: 'storage_005',
    question: 'Depozitarea materialelor pe suprafețe deschise necesită:',
    options: [
      'Plasare direct pe pământ',
      'Fundație/platformă stabilă, drenaj, protecție',
      'Doar acoperire cu prelată',
      'Nimic special'
    ],
    correctIndex: 1,
    explanation: 'Depozitare exterioară: platformă consolidată, drenaj pentru apă, protecție față de intemperii.',
    difficulty: 'medium',
    module: 'depozitare'
  },
  {
    id: 'storage_006',
    question: 'Manipularea manuală a sarcinilor peste 25kg (bărbați) se consideră:',
    options: [
      'Normală',
      'Risc ridicat - necesită evaluare și măsuri',
      'Acceptabilă fără restricții',
      'Permisă permanent'
    ],
    correctIndex: 1,
    explanation: 'Peste 25 kg pentru bărbați (15kg femei) = risc ridicat necesită: evaluare, instruire, mijloace mecanice.',
    difficulty: 'easy',
    module: 'depozitare'
  },
  {
    id: 'storage_007',
    question: 'Blocarea roților platformelor/cărucioare mobile în timpul încărcării este:',
    options: [
      'Opțională',
      'Obligatorie',
      'Nu este necesară',
      'Doar pentru încărcări grele'
    ],
    correctIndex: 1,
    explanation: 'Blocarea roților este obligatorie pentru prevenirea deplasării accidentale și răsturnării în timpul încărcării.',
    difficulty: 'easy',
    module: 'depozitare'
  },
  {
    id: 'storage_008',
    question: 'Stivuirea sacilor se face:',
    options: [
      'În încrucișat pentru stabilitate',
      'Drept unul peste altul',
      'Orizontal',
      'Nu contează'
    ],
    correctIndex: 0,
    explanation: 'Stivuirea în încrucișat (perpendicular pe straturi) asigură stabilitate și previne prăbușirea.',
    difficulty: 'medium',
    module: 'depozitare'
  },
  {
    id: 'storage_009',
    question: 'Materialele lungi (țevi, bare) se depozitează:',
    options: [
      'Vertical întotdeauna',
      'Pe suporturi orizontale adecvate sau stelaje',
      'Direct pe podea',
      'Sprijinite de perete'
    ],
    correctIndex: 1,
    explanation: 'Materiale lungi: suporturi orizontale stabile, prevenire rostogolire, accesibile și organizate în siguranță.',
    difficulty: 'easy',
    module: 'depozitare'
  },
  {
    id: 'storage_010',
    question: 'Depozitul de substanțe inflamabile trebuie să fie:',
    options: [
      'Împreună cu restul materialelor',
      'Separat, ventilat, cu instalații antiex',
      'În subsolul clădirii',
      'Lângă birou'
    ],
    correctIndex: 1,
    explanation: 'Inflamabile: depozit separat, ventilație, instalații antiex, separare de oxidanți, detectie și stingere.',
    difficulty: 'easy',
    module: 'depozitare'
  },
  {
    id: 'storage_011',
    question: 'Distanța între stivă și sprinklere/instalații de stingere trebuie să fie minimum:',
    options: [
      '30 cm',
      '50 cm',
      '80 cm',
      '150 cm'
    ],
    correctIndex: 2,
    explanation: 'Minimum 80 cm-1m distanță față de sprinklere pentru funcționare corectă și acoperire completă.',
    difficulty: 'hard',
    module: 'depozitare'
  },
  {
    id: 'storage_012',
    question: 'Marcajele pe podea pentru delimitare zone depozitare trebuie să fie:',
    options: [
      'Doar vopsite',
      'Vizibile, durabile, respectate strict',
      'Opționale',
      'Nu sunt necesare'
    ],
    correctIndex: 1,
    explanation: 'Marcajele clare (vopsea/bandă) delimitează căi circulație, zone depozitare, urgențe - respectare strictă.',
    difficulty: 'medium',
    module: 'depozitare'
  },
  {
    id: 'storage_013',
    question: 'Utilizarea motostivuitoarelor în depozite necesită:',
    options: [
      'Orice șofer',
      'Operator autorizat ISCIR specific pentru stivuitoare',
      'Doar permis auto',
      'Experiență generală'
    ],
    correctIndex: 1,
    explanation: 'Stivuitoarele necesită autorizație ISCIR specifică + instructaj pe model specific + verificări periodice.',
    difficulty: 'easy',
    module: 'depozitare'
  },
  {
    id: 'storage_014',
    question: 'Paleții deteriorați (crăpați, cu cuie ieșite) trebuie:',
    options: [
      'Folosiți cu grijă',
      'Scoși din uz imediat',
      'Reparați provizoriu',
      'Folosiți doar pentru marfă ușoară'
    ],
    correctIndex: 1,
    explanation: 'Paleții deteriorați = risc de prăbușire marfă, accidentare - scoatere imediată din uz, înlocuire sau reparație profesională.',
    difficulty: 'easy',
    module: 'depozitare'
  },
  {
    id: 'storage_015',
    question: 'Controlul temperatură și umiditate în depozite este necesar pentru:',
    options: [
      'Doar produse alimentare',
      'Produse sensibile conform specificațiilor',
      'Nu este niciodată necesar',
      'Doar iarna'
    ],
    correctIndex: 1,
    explanation: 'Materiale sensibile (chimicale, farmaceutice, alimentare, electronice) necesită condiții controlate conform specificațiilor.',
    difficulty: 'medium',
    module: 'depozitare'
  }
];

// Export helper functions
export const getQuestionsByModule = (module: string): QuizQuestion[] => {
  return quizBankExtended.filter(q => q.module === module);
};

export const getQuestionsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): QuizQuestion[] => {
  return quizBankExtended.filter(q => q.difficulty === difficulty);
};

export const getRandomQuestions = (count: number): QuizQuestion[] => {
  const shuffled = [...quizBankExtended].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const modules = {
  lucru_inaltime: 'Lucru la înălțime',
  substante_periculoase: 'Substanțe periculoase',
  echipamente_electrice: 'Echipamente electrice',
  incendiu_evacuare: 'Incendiu și evacuare',
  ergonomie_birou: 'Ergonomie la birou',
  constructii: 'Construcții',
  depozitare: 'Depozitare'
} as const;

export default quizBankExtended;
