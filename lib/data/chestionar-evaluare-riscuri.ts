/**
 * Chestionar Evaluare Riscuri SSM
 * 60 întrebări grupate pe 11 categorii conform metodologiei de evaluare riscuri
 */

export type RiskLevel = 'scazut' | 'mediu' | 'ridicat' | 'foarte_ridicat';

export interface QuestionOption {
  value: RiskLevel;
  label: string;
}

export interface RiskQuestion {
  id: string;
  question: string;
  category: string;
  options: QuestionOption[];
  correctAnswer: RiskLevel;
  explanation: string;
}

export const riskQuestions: RiskQuestion[] = [
  // ORGANIZARE (10 întrebări)
  {
    id: 'org-001',
    question: 'Există proceduri operaționale scrise și actualizate pentru toate activitățile desfășurate?',
    category: 'organizare',
    options: [
      { value: 'scazut', label: 'Da, complete și actualizate anual' },
      { value: 'mediu', label: 'Da, dar unele necesită actualizare' },
      { value: 'ridicat', label: 'Doar pentru câteva activități' },
      { value: 'foarte_ridicat', label: 'Nu există proceduri scrise' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Procedurile operaționale scrise și actualizate reduc semnificativ riscul de accidente prin standardizarea activităților.',
  },
  {
    id: 'org-002',
    question: 'Angajații au primit instructaj periodic de SSM în ultimele 12 luni?',
    category: 'organizare',
    options: [
      { value: 'scazut', label: 'Toți angajații, conform planificării' },
      { value: 'mediu', label: 'Majoritatea, cu mici întârzieri' },
      { value: 'ridicat', label: 'Sub 50% din angajați' },
      { value: 'foarte_ridicat', label: 'Nu s-au efectuat instructaje' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Instructajul periodic asigură conștientizarea continuă a riscurilor și procedurilor de lucru sigur.',
  },
  {
    id: 'org-003',
    question: 'Există un sistem funcțional de raportare și investigare a incidentelor?',
    category: 'organizare',
    options: [
      { value: 'scazut', label: 'Da, cu analiză cauzală și măsuri corective' },
      { value: 'mediu', label: 'Există, dar fără analiză aprofundată' },
      { value: 'ridicat', label: 'Raportare sporadică, fără urmărire' },
      { value: 'foarte_ridicat', label: 'Nu există sistem de raportare' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Sistemul de investigare a incidentelor previne repetarea accidentelor prin identificarea cauzelor profunde.',
  },
  {
    id: 'org-004',
    question: 'Echipamentele de lucru sunt verificate și întreținute conform programului?',
    category: 'organizare',
    options: [
      { value: 'scazut', label: 'Da, cu evidență completă și la zi' },
      { value: 'mediu', label: 'Majoritatea, cu întârzieri minore' },
      { value: 'ridicat', label: 'Parțial, fără evidență clară' },
      { value: 'foarte_ridicat', label: 'Nu există program de întreținere' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Întreținerea preventivă reduce defecțiunile care pot genera accidente de muncă.',
  },
  {
    id: 'org-005',
    question: 'Există personal desemnat și instruit pentru acordarea primului ajutor?',
    category: 'organizare',
    options: [
      { value: 'scazut', label: 'Da, în toate schimburile, cu truse complete' },
      { value: 'mediu', label: 'Da, dar doar în programul de zi' },
      { value: 'ridicat', label: 'Nu există personal instruit' },
      { value: 'foarte_ridicat', label: 'Nu există nici personal, nici truse' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Prezența personalului instruit pentru prim ajutor poate salva vieți în situații de urgență.',
  },
  {
    id: 'org-006',
    question: 'Sunt afișate planuri de evacuare și se efectuează exerciții periodice?',
    category: 'organizare',
    options: [
      { value: 'scazut', label: 'Da, exerciții semestriale cu evidență' },
      { value: 'mediu', label: 'Planuri afișate, exerciții rare' },
      { value: 'ridicat', label: 'Doar planuri afișate, fără exerciții' },
      { value: 'foarte_ridicat', label: 'Nu există planuri de evacuare' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Exercițiile de evacuare pregătesc angajații pentru situații de urgență reale.',
  },
  {
    id: 'org-007',
    question: 'Există evaluare de risc actualizată pentru toate posturile de lucru?',
    category: 'organizare',
    options: [
      { value: 'scazut', label: 'Da, revizuită în ultimele 12 luni' },
      { value: 'mediu', label: 'Da, dar necesită actualizare' },
      { value: 'ridicat', label: 'Parțială, doar pentru anumite posturi' },
      { value: 'foarte_ridicat', label: 'Nu există evaluare de risc' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Evaluarea de risc actualizată este fundamentul prevenirii accidentelor de muncă.',
  },
  {
    id: 'org-008',
    question: 'Comunicarea privind SSM către angajați este clară și periodică?',
    category: 'organizare',
    options: [
      { value: 'scazut', label: 'Da, multiple canale, lunar' },
      { value: 'mediu', label: 'Ocazional, la solicitare' },
      { value: 'ridicat', label: 'Rareori, informații incomplete' },
      { value: 'foarte_ridicat', label: 'Nu există comunicare SSM' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Comunicarea constantă menține conștientizarea riscurilor și procedurilor de siguranță.',
  },
  {
    id: 'org-009',
    question: 'Angajații noi primesc instruire SSM înainte de începerea activității?',
    category: 'organizare',
    options: [
      { value: 'scazut', label: 'Da, instruire completă + test evaluare' },
      { value: 'mediu', label: 'Da, instruire sumară' },
      { value: 'ridicat', label: 'Instruire minimă, în timpul lucrului' },
      { value: 'foarte_ridicat', label: 'Nu primesc instruire SSM' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Angajații noi sunt cei mai expuși la accidente, instruirea inițială este esențială.',
  },
  {
    id: 'org-010',
    question: 'Există comitet de securitate și sănătate în muncă funcțional?',
    category: 'organizare',
    options: [
      { value: 'scazut', label: 'Da, ședințe trimestriale cu procese-verbale' },
      { value: 'mediu', label: 'Da, dar ședințe neregulate' },
      { value: 'ridicat', label: 'Există formal, dar inactiv' },
      { value: 'foarte_ridicat', label: 'Nu există comitet SSM' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Comitetul SSM asigură implicarea angajaților în îmbunătățirea condițiilor de muncă.',
  },

  // LUCRU LA ÎNĂLȚIME (5 întrebări)
  {
    id: 'inaltime-001',
    question: 'Angajații care lucrează la înălțime au autorizație valabilă?',
    category: 'lucru_la_inaltime',
    options: [
      { value: 'scazut', label: 'Toți angajații, autorizații valide și verificate' },
      { value: 'mediu', label: 'Majoritatea, unele în curs de reînnoire' },
      { value: 'ridicat', label: 'Parțial autorizați' },
      { value: 'foarte_ridicat', label: 'Nu sunt autorizați' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Lucrul la înălțime fără autorizație este interzis și generează risc foarte ridicat de accident mortal.',
  },
  {
    id: 'inaltime-002',
    question: 'Schelele și platformele de lucru sunt verificate înainte de utilizare?',
    category: 'lucru_la_inaltime',
    options: [
      { value: 'scazut', label: 'Da, verificare zilnică cu evidență' },
      { value: 'mediu', label: 'Verificare periodică, fără evidență' },
      { value: 'ridicat', label: 'Verificare sporadică' },
      { value: 'foarte_ridicat', label: 'Nu se verifică' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Verificarea schelelor previne căderile de la înălțime, principala cauză de accidente mortale.',
  },
  {
    id: 'inaltime-003',
    question: 'Echipamentele de protecție împotriva căderilor (hamuri, longe) sunt în stare bună?',
    category: 'lucru_la_inaltime',
    options: [
      { value: 'scazut', label: 'Da, verificate și certificate conform' },
      { value: 'mediu', label: 'În stare acceptabilă, unele uzate' },
      { value: 'ridicat', label: 'Uzate, fără verificare' },
      { value: 'foarte_ridicat', label: 'Nu se folosesc/nu există' },
    ],
    correctAnswer: 'scazut',
    explanation: 'EPI-ul defect la lucrul la înălțime poate fi fatal în caz de cădere.',
  },
  {
    id: 'inaltime-004',
    question: 'Zonele de lucru la înălțime sunt delimitate și semnalizate corespunzător?',
    category: 'lucru_la_inaltime',
    options: [
      { value: 'scazut', label: 'Da, delimitate și cu supraveghere' },
      { value: 'mediu', label: 'Delimitate, dar fără supraveghere constantă' },
      { value: 'ridicat', label: 'Delimitare parțială' },
      { value: 'foarte_ridicat', label: 'Fără delimitare' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Delimitarea protejează atât lucrătorii de la înălțime, cât și pe cei de la sol.',
  },
  {
    id: 'inaltime-005',
    question: 'Există procedură de permis de lucru pentru activități la înălțime?',
    category: 'lucru_la_inaltime',
    options: [
      { value: 'scazut', label: 'Da, obligatorie pentru orice activitate >2m' },
      { value: 'mediu', label: 'Doar pentru lucrări complexe' },
      { value: 'ridicat', label: 'Nu există procedură formală' },
      { value: 'foarte_ridicat', label: 'Nu se emit permise de lucru' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Permisul de lucru asigură verificarea condițiilor de siguranță înainte de începerea lucrărilor.',
  },

  // SUBSTANȚE CHIMICE (5 întrebări)
  {
    id: 'chimice-001',
    question: 'Toate substanțele chimice au fișe de securitate (FDS) disponibile și accesibile?',
    category: 'substante_chimice',
    options: [
      { value: 'scazut', label: 'Da, pentru toate substanțele, actualizate' },
      { value: 'mediu', label: 'Pentru majoritatea, unele lipsesc' },
      { value: 'ridicat', label: 'Parțial, multe lipsesc' },
      { value: 'foarte_ridicat', label: 'Nu există FDS' },
    ],
    correctAnswer: 'scazut',
    explanation: 'FDS-urile sunt obligatorii și conțin informații vitale despre pericole și măsuri de protecție.',
  },
  {
    id: 'chimice-002',
    question: 'Substanțele chimice sunt etichetate corect și depozitate în condiții corespunzătoare?',
    category: 'substante_chimice',
    options: [
      { value: 'scazut', label: 'Da, etichetate CLP, depozitare segregată' },
      { value: 'mediu', label: 'Etichetate, dar depozitare neconformă' },
      { value: 'ridicat', label: 'Etichete incomplete, depozitare haotică' },
      { value: 'foarte_ridicat', label: 'Fără etichetare, depozitare inadecvată' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Etichetarea corectă și depozitarea segregată previn reacții periculoase și intoxicații.',
  },
  {
    id: 'chimice-003',
    question: 'Angajații expuși la substanțe chimice au EPI specific (mănuși, ochelari, măști)?',
    category: 'substante_chimice',
    options: [
      { value: 'scazut', label: 'Da, EPI adecvat pentru fiecare substanță' },
      { value: 'mediu', label: 'Da, dar EPI generic, nespecific' },
      { value: 'ridicat', label: 'Parțial, EPI insuficient' },
      { value: 'foarte_ridicat', label: 'Nu au EPI pentru substanțe chimice' },
    ],
    correctAnswer: 'scazut',
    explanation: 'EPI-ul specific protejează împotriva efectelor acute și cronice ale substanțelor periculoase.',
  },
  {
    id: 'chimice-004',
    question: 'Există ventilație adecvată în zonele de lucru cu substanțe chimice?',
    category: 'substante_chimice',
    options: [
      { value: 'scazut', label: 'Ventilație mecanică, monitorizare calitate aer' },
      { value: 'mediu', label: 'Ventilație naturală suficientă' },
      { value: 'ridicat', label: 'Ventilație insuficientă' },
      { value: 'foarte_ridicat', label: 'Fără ventilație' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Ventilația previne acumularea de vapori și gaze toxice care pot cauza intoxicații.',
  },
  {
    id: 'chimice-005',
    question: 'Există proceduri de intervenție în caz de deversare sau expunere accidentală?',
    category: 'substante_chimice',
    options: [
      { value: 'scazut', label: 'Da, proceduri scrise, kit intervenție, personal instruit' },
      { value: 'mediu', label: 'Proceduri generale, fără kit specific' },
      { value: 'ridicat', label: 'Fără proceduri clare' },
      { value: 'foarte_ridicat', label: 'Nu există nicio procedură' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Intervenția rapidă în caz de deversare poate preveni intoxicații grave și daune de mediu.',
  },

  // ERGONOMIE (5 întrebări)
  {
    id: 'ergo-001',
    question: 'Posturile de lucru sunt adaptate ergonomic (înălțime mese, scaune reglabile)?',
    category: 'ergonomie',
    options: [
      { value: 'scazut', label: 'Da, mobilier ergonomic, reglabil' },
      { value: 'mediu', label: 'Parțial ergonomic, unele deficiențe' },
      { value: 'ridicat', label: 'Mobilier neergonomic, fixat' },
      { value: 'foarte_ridicat', label: 'Fără considerații ergonomice' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Posturile ergonomice previn tulburările musculo-scheletice pe termen lung.',
  },
  {
    id: 'ergo-002',
    question: 'Angajații care manipulează sarcini grele sunt instruiți în tehnici corecte?',
    category: 'ergonomie',
    options: [
      { value: 'scazut', label: 'Da, instruire anuală + demonstrații practice' },
      { value: 'mediu', label: 'Instruire ocazională, fără practică' },
      { value: 'ridicat', label: 'Fără instruire specifică' },
      { value: 'foarte_ridicat', label: 'Nu se respectă limite de greutate' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Tehnicile corecte de ridicare reduc semnificativ accidentele lombare.',
  },
  {
    id: 'ergo-003',
    question: 'Sunt disponibile dispozitive de asistență pentru manipularea sarcinilor (transpalete, stivuitoare)?',
    category: 'ergonomie',
    options: [
      { value: 'scazut', label: 'Da, suficiente și funcționale' },
      { value: 'mediu', label: 'Disponibile, dar insuficiente' },
      { value: 'ridicat', label: 'Puține și defecte' },
      { value: 'foarte_ridicat', label: 'Nu există dispozitive de asistență' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Dispozitivele de asistență reduc solicitarea fizică și riscul de TMS.',
  },
  {
    id: 'ergo-004',
    question: 'Angajații au pauze programate în activități repetitive sau prelungite?',
    category: 'ergonomie',
    options: [
      { value: 'scazut', label: 'Da, pauze reglementate și respectate' },
      { value: 'mediu', label: 'Pauze ocazionale, nereglementate' },
      { value: 'ridicat', label: 'Pauze rare sau nerespectate' },
      { value: 'foarte_ridicat', label: 'Nu sunt permise pauze' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Pauzele regulate previn oboseala acumulată și tulburările musculo-scheletice.',
  },
  {
    id: 'ergo-005',
    question: 'Iluminatul la posturile de lucru este adecvat și reglabil?',
    category: 'ergonomie',
    options: [
      { value: 'scazut', label: 'Da, iluminat conform normelor, reglabil' },
      { value: 'mediu', label: 'Adecvat, dar nereglabil' },
      { value: 'ridicat', label: 'Insuficient în unele zone' },
      { value: 'foarte_ridicat', label: 'Iluminat deficitar generalizat' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Iluminatul adecvat previne oboseala vizuală și erorile de lucru.',
  },

  // ZGOMOT ȘI VIBRAȚII (5 întrebări)
  {
    id: 'zgomot-001',
    question: 'S-au efectuat măsurători de zgomot conform legislației?',
    category: 'zgomot_vibratii',
    options: [
      { value: 'scazut', label: 'Da, măsurători recente (<2 ani), sub VLE' },
      { value: 'mediu', label: 'Da, dar depășiri locale ale VLE' },
      { value: 'ridicat', label: 'Măsurători vechi (>3 ani)' },
      { value: 'foarte_ridicat', label: 'Nu s-au efectuat măsurători' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Măsurătorile de zgomot identifică zonele cu risc de hipoacuzie profesională.',
  },
  {
    id: 'zgomot-002',
    question: 'Angajații expuși la zgomot au căști/dopuri antifon adecvate?',
    category: 'zgomot_vibratii',
    options: [
      { value: 'scazut', label: 'Da, EPI cu atenuare adecvată, purtare obligatorie' },
      { value: 'mediu', label: 'Da, dar purtare neconștientă' },
      { value: 'ridicat', label: 'EPI inadecvat sau insuficient' },
      { value: 'foarte_ridicat', label: 'Nu au EPI antifon' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Protecția auditivă corectă previne pierderea ireversibilă a auzului.',
  },
  {
    id: 'zgomot-003',
    question: 'Zonele cu nivel ridicat de zgomot sunt semnalizate și delimitate?',
    category: 'zgomot_vibratii',
    options: [
      { value: 'scazut', label: 'Da, semnalizare clară, acces restricționat' },
      { value: 'mediu', label: 'Semnalizare parțială' },
      { value: 'ridicat', label: 'Fără semnalizare adecvată' },
      { value: 'foarte_ridicat', label: 'Nu sunt identificate zonele' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Semnalizarea avertizează asupra pericolului și impune folosirea EPI.',
  },
  {
    id: 'zgomot-004',
    question: 'S-au luat măsuri de reducere a zgomotului la sursă (insonorizare, bariere)?',
    category: 'zgomot_vibratii',
    options: [
      { value: 'scazut', label: 'Da, măsuri tehnice eficiente implementate' },
      { value: 'mediu', label: 'Măsuri parțiale, eficiență limitată' },
      { value: 'ridicat', label: 'Nu s-au implementat măsuri tehnice' },
      { value: 'foarte_ridicat', label: 'Nu s-a considerat reducerea la sursă' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Reducerea zgomotului la sursă este cea mai eficientă măsură de protecție.',
  },
  {
    id: 'zgomot-005',
    question: 'Angajații expuși la vibrații au controale medicale specifice?',
    category: 'zgomot_vibratii',
    options: [
      { value: 'scazut', label: 'Da, controale specializate anuale' },
      { value: 'mediu', label: 'Controale generale, fără focus vibrații' },
      { value: 'ridicat', label: 'Controale sporadice' },
      { value: 'foarte_ridicat', label: 'Nu se efectuează controale' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Controalele medicale depistează precoce afecțiunile datorate vibrațiilor (sindrom Raynaud).',
  },

  // ELECTROSECURITATE (5 întrebări)
  {
    id: 'electro-001',
    question: 'Instalațiile electrice au verificări periodice conform ANRE?',
    category: 'electrosecuritate',
    options: [
      { value: 'scazut', label: 'Da, verificări anuale cu buletine valabile' },
      { value: 'mediu', label: 'Verificări cu întârzieri minore' },
      { value: 'ridicat', label: 'Verificări vechi (>2 ani)' },
      { value: 'foarte_ridicat', label: 'Nu s-au efectuat verificări' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Verificările periodice depistează defecțiuni care pot cauza electrocutări sau incendii.',
  },
  {
    id: 'electro-002',
    question: 'Tablourile electrice sunt marcate, închise și accesibile doar personalului autorizat?',
    category: 'electrosecuritate',
    options: [
      { value: 'scazut', label: 'Da, conforme, închise, acces restricționat' },
      { value: 'mediu', label: 'Închise, dar uneori lăsate deschise' },
      { value: 'ridicat', label: 'Neînchise, acces liber' },
      { value: 'foarte_ridicat', label: 'Nemarcare, deteriorate, acces necontrolat' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Accesul neautorizat la tablouri poate cauza electrocutări grave sau mortale.',
  },
  {
    id: 'electro-003',
    question: 'Echipamentele electrice portabile sunt verificate înainte de utilizare?',
    category: 'electrosecuritate',
    options: [
      { value: 'scazut', label: 'Da, verificare vizuală obligatorie, etichetare' },
      { value: 'mediu', label: 'Verificare ocazională' },
      { value: 'ridicat', label: 'Fără verificare sistematică' },
      { value: 'foarte_ridicat', label: 'Se folosesc echipamente deteriorate' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Cablurile și echipamentele deteriorate sunt cauze frecvente de electrocutare.',
  },
  {
    id: 'electro-004',
    question: 'Există dispozitive de protecție diferențială (RCD) funcționale?',
    category: 'electrosecuritate',
    options: [
      { value: 'scazut', label: 'Da, pe toate circuitele, testate lunar' },
      { value: 'mediu', label: 'Există, dar fără testare periodică' },
      { value: 'ridicat', label: 'Doar pe unele circuite' },
      { value: 'foarte_ridicat', label: 'Nu există RCD-uri' },
    ],
    correctAnswer: 'scazut',
    explanation: 'RCD-urile pot salva vieți prin deconectarea rapidă în caz de defect de izolație.',
  },
  {
    id: 'electro-005',
    question: 'Lucrările la instalații electrice sunt efectuate doar de personal autorizat ANRE?',
    category: 'electrosecuritate',
    options: [
      { value: 'scazut', label: 'Da, întotdeauna, cu autorizații valabile' },
      { value: 'mediu', label: 'Majoritatea, cu excepții ocazionale' },
      { value: 'ridicat', label: 'Adesea personal neautorizat' },
      { value: 'foarte_ridicat', label: 'Nu se verifică autorizațiile' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Lucrările neautorizate la instalații electrice sunt interzise și periculoase.',
  },

  // INCENDIU (5 întrebări)
  {
    id: 'incendiu-001',
    question: 'Mijloacele de stingere (stingătoare, hidranti) sunt verificate periodic?',
    category: 'incendiu',
    options: [
      { value: 'scazut', label: 'Da, verificare anuală, etichete la zi' },
      { value: 'mediu', label: 'Verificare cu întârzieri minore' },
      { value: 'ridicat', label: 'Verificare sporadică sau lipsă' },
      { value: 'foarte_ridicat', label: 'Nu s-au verificat niciodată' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Stingătoarele neverificate pot fi nefuncționale în caz de urgență.',
  },
  {
    id: 'incendiu-002',
    question: 'Căile de evacuare și ieșirile de urgență sunt libere și semnalizate?',
    category: 'incendiu',
    options: [
      { value: 'scazut', label: 'Da, libere permanent, semnalizare luminoasă' },
      { value: 'mediu', label: 'Libere, dar semnalizare parțială' },
      { value: 'ridicat', label: 'Partial obstrucționate' },
      { value: 'foarte_ridicat', label: 'Obstrucționate, fără semnalizare' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Căile de evacuare obstrucționate pot duce la victime în caz de incendiu.',
  },
  {
    id: 'incendiu-003',
    question: 'Instalația de detectare și alarmare incendiu este funcțională?',
    category: 'incendiu',
    options: [
      { value: 'scazut', label: 'Da, testată lunar, acoperire completă' },
      { value: 'mediu', label: 'Funcțională, dar testare rar' },
      { value: 'ridicat', label: 'Parțial funcțională sau acoperire incompletă' },
      { value: 'foarte_ridicat', label: 'Nu există sau nefuncțională' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Detectarea precoce a incendiului salvează vieți prin avertizarea rapidă.',
  },
  {
    id: 'incendiu-004',
    question: 'Materialele combustibile sunt depozitate corespunzător și separat de surse de aprindere?',
    category: 'incendiu',
    options: [
      { value: 'scazut', label: 'Da, depozitare segregată, ventilată, ignifugată' },
      { value: 'mediu', label: 'Depozitare acceptabilă, unele deficiențe' },
      { value: 'ridicat', label: 'Depozitare haotică' },
      { value: 'foarte_ridicat', label: 'Lângă surse de aprindere' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Depozitarea necorespunzătoare a combustibililor crește dramatic riscul de incendiu.',
  },
  {
    id: 'incendiu-005',
    question: 'Există echipă de intervenție instruită și dotată pentru stingerea incendiilor?',
    category: 'incendiu',
    options: [
      { value: 'scazut', label: 'Da, echipă instruită anual, echipament complet' },
      { value: 'mediu', label: 'Echipă desemnată, instruire ocazională' },
      { value: 'ridicat', label: 'Fără echipă organizată' },
      { value: 'foarte_ridicat', label: 'Fără echipă și fără instruire' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Intervenția rapidă în faza incipientă poate preveni pagube majore și victime.',
  },

  // ECHIPAMENTE (5 întrebări)
  {
    id: 'echipamente-001',
    question: 'Mașinile și utilajele au declarații de conformitate CE?',
    category: 'echipamente',
    options: [
      { value: 'scazut', label: 'Da, toate cu declarații și marcare CE' },
      { value: 'mediu', label: 'Majoritatea, unele lipsesc' },
      { value: 'ridicat', label: 'Multe fără documentație' },
      { value: 'foarte_ridicat', label: 'Nu există declarații CE' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Declarația CE atestă conformitatea cu cerințele de securitate ale echipamentelor.',
  },
  {
    id: 'echipamente-002',
    question: 'Dispozitivele de protecție ale mașinilor (garduri, opriri de urgență) sunt funcționale?',
    category: 'echipamente',
    options: [
      { value: 'scazut', label: 'Da, toate funcționale, testate periodic' },
      { value: 'mediu', label: 'Funcționale, dar fără testare regulată' },
      { value: 'ridicat', label: 'Unele defecte sau ocolite' },
      { value: 'foarte_ridicat', label: 'Dezactivate sau inexistente' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Dispozitivele de protecție previne accidentele grave (amputări, striviri).',
  },
  {
    id: 'echipamente-003',
    question: 'Operatorii de echipamente periculoase (stivuitoare, macarale) sunt autorizați?',
    category: 'echipamente',
    options: [
      { value: 'scazut', label: 'Da, toți cu autorizații ISCIR valabile' },
      { value: 'mediu', label: 'Majoritatea autorizați' },
      { value: 'ridicat', label: 'Parțial autorizați' },
      { value: 'foarte_ridicat', label: 'Fără autorizații' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Operarea fără autorizație a echipamentelor periculoase este interzisă.',
  },
  {
    id: 'echipamente-004',
    question: 'Echipamentele sub presiune (compresoare, recipiente) au verificări ISCIR la zi?',
    category: 'echipamente',
    options: [
      { value: 'scazut', label: 'Da, verificări conform perioadelor legale' },
      { value: 'mediu', label: 'Verificări cu întârzieri minore' },
      { value: 'ridicat', label: 'Verificări expirate' },
      { value: 'foarte_ridicat', label: 'Nu s-au efectuat verificări' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Echipamentele sub presiune neverificate pot exploda cu consecințe grave.',
  },
  {
    id: 'echipamente-005',
    question: 'Există proceduri de blocare/etichetare (LOTO) pentru întreținerea echipamentelor?',
    category: 'echipamente',
    options: [
      { value: 'scazut', label: 'Da, proceduri LOTO obligatorii, respectate' },
      { value: 'mediu', label: 'Proceduri existente, aplicare inconsecventă' },
      { value: 'ridicat', label: 'Fără proceduri formale LOTO' },
      { value: 'foarte_ridicat', label: 'Întreținere fără deconectare' },
    ],
    correctAnswer: 'scazut',
    explanation: 'LOTO previne accidentele grave cauzate de porniri accidentale în timpul întreținerii.',
  },

  // TRANSPORT INTERN (5 întrebări)
  {
    id: 'transport-001',
    question: 'Căile de circulație pentru mijloace de transport sunt marcate și separate de zone pietonale?',
    category: 'transport_intern',
    options: [
      { value: 'scazut', label: 'Da, marcaj clar, separare fizică' },
      { value: 'mediu', label: 'Marcaj existent, dar fără separare fizică' },
      { value: 'ridicat', label: 'Marcaj parțial sau degradat' },
      { value: 'foarte_ridicat', label: 'Fără marcaj, circulație mixtă' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Separarea căilor de circulație previne accidentele prin lovire cu mijloace de transport.',
  },
  {
    id: 'transport-002',
    question: 'Mijloacele de transport intern (stivuitoare, transpalete) sunt verificate zilnic?',
    category: 'transport_intern',
    options: [
      { value: 'scazut', label: 'Da, checklist zilnic obligatoriu' },
      { value: 'mediu', label: 'Verificare ocazională' },
      { value: 'ridicat', label: 'Fără verificare sistematică' },
      { value: 'foarte_ridicat', label: 'Nu se verifică' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Verificarea zilnică depistează defecțiuni care pot cauza accidente.',
  },
  {
    id: 'transport-003',
    question: 'Încărcarea și fixarea mărfurilor pe mijloace de transport se face conform procedurii?',
    category: 'transport_intern',
    options: [
      { value: 'scazut', label: 'Da, respectare strictă, folosire chingi/curele' },
      { value: 'mediu', label: 'Respectare parțială' },
      { value: 'ridicat', label: 'Fără procedură clară' },
      { value: 'foarte_ridicat', label: 'Încărcare nesigură, fără fixare' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Încărcarea necorespunzătoare poate cauza răsturnări și căderi de mărfuri.',
  },
  {
    id: 'transport-004',
    question: 'Zonele de încărcare/descărcare sunt delimitate și dotate cu echipamente de protecție?',
    category: 'transport_intern',
    options: [
      { value: 'scazut', label: 'Da, rampă, cale rulare, opritori, iluminat' },
      { value: 'mediu', label: 'Delimitate, dar dotare incompletă' },
      { value: 'ridicat', label: 'Fără delimitare clară' },
      { value: 'foarte_ridicat', label: 'Improvizate, nesigure' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Zonele de încărcare neprotejate prezintă risc de cădere de la înălțime sau lovire.',
  },
  {
    id: 'transport-005',
    question: 'Există regulament de circulație intern și limite de viteza afișate?',
    category: 'transport_intern',
    options: [
      { value: 'scazut', label: 'Da, regulament, limite afișate, respectate' },
      { value: 'mediu', label: 'Regulament existent, respectare parțială' },
      { value: 'ridicat', label: 'Fără regulament formal' },
      { value: 'foarte_ridicat', label: 'Fără reguli de circulație' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Regulamentul de circulație previne accidentele prin reglementarea traficului intern.',
  },

  // PSIHOSOCIAL (5 întrebări)
  {
    id: 'psiho-001',
    question: 'S-a efectuat evaluarea riscurilor psihosociale (stres, hărțuire)?',
    category: 'psihosocial',
    options: [
      { value: 'scazut', label: 'Da, evaluare recentă cu plan de măsuri' },
      { value: 'mediu', label: 'Evaluare parțială sau veche' },
      { value: 'ridicat', label: 'Nu s-a efectuat evaluare formală' },
      { value: 'foarte_ridicat', label: 'Subiect ignorat complet' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Riscurile psihosociale afectează sănătatea mintală și productivitatea angajaților.',
  },
  {
    id: 'psiho-002',
    question: 'Există politică anti-hărțuire și canal confidențial de raportare?',
    category: 'psihosocial',
    options: [
      { value: 'scazut', label: 'Da, politică clară, canal funcțional, investigări prompte' },
      { value: 'mediu', label: 'Politică existentă, canal informal' },
      { value: 'ridicat', label: 'Fără politică formală' },
      { value: 'foarte_ridicat', label: 'Subiect tabu, nicio procedură' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Politica anti-hărțuire protejează angajații și previne problemele legale.',
  },
  {
    id: 'psiho-003',
    question: 'Sarcina de lucru este echilibrată și realistă?',
    category: 'psihosocial',
    options: [
      { value: 'scazut', label: 'Da, sarcini clare, termene realizabile' },
      { value: 'mediu', label: 'Uneori supraîncărcare temporară' },
      { value: 'ridicat', label: 'Supraîncărcare frecventă' },
      { value: 'foarte_ridicat', label: 'Cerințe imposibile, burnout generalizat' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Supraîncărcarea cronică duce la burnout, erori și îmbolnăviri.',
  },
  {
    id: 'psiho-004',
    question: 'Angajații primesc feedback regulat și au posibilități de dezvoltare?',
    category: 'psihosocial',
    options: [
      { value: 'scazut', label: 'Da, feedback constructiv, planuri dezvoltare' },
      { value: 'mediu', label: 'Feedback ocazional' },
      { value: 'ridicat', label: 'Feedback rar sau doar negativ' },
      { value: 'foarte_ridicat', label: 'Fără comunicare, izolare' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Lipsa feedback-ului și dezvoltării generează frustrare și demotivare.',
  },
  {
    id: 'psiho-005',
    question: 'Există echilibru între viața profesională și personală (program flexibil, concedii)?',
    category: 'psihosocial',
    options: [
      { value: 'scazut', label: 'Da, flexibilitate, respectarea concediilor' },
      { value: 'mediu', label: 'Flexibilitate limitată' },
      { value: 'ridicat', label: 'Program rigid, presiune ore suplimentare' },
      { value: 'foarte_ridicat', label: 'Așteptări de disponibilitate permanentă' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Lipsa echilibrului muncă-viață afectează sănătatea fizică și psihică.',
  },

  // CONDIȚII MEDIU (5 întrebări)
  {
    id: 'mediu-001',
    question: 'Temperatura la locurile de muncă este menținută în limite confortabile?',
    category: 'conditii_mediu',
    options: [
      { value: 'scazut', label: 'Da, 18-24°C, climatizare/încălzire funcțională' },
      { value: 'mediu', label: 'Variații moderate, în general acceptabil' },
      { value: 'ridicat', label: 'Temperaturi extreme ocazionale' },
      { value: 'foarte_ridicat', label: 'Temperaturi extreme permanente' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Temperaturile extreme afectează confortul, performanța și sănătatea angajaților.',
  },
  {
    id: 'mediu-002',
    question: 'Calitatea aerului (ventilație, praf, fum) este monitorizată și controlată?',
    category: 'conditii_mediu',
    options: [
      { value: 'scazut', label: 'Da, ventilație mecanică, monitorizare, filtrare' },
      { value: 'mediu', label: 'Ventilație naturală suficientă' },
      { value: 'ridicat', label: 'Ventilație insuficientă, aer viciat' },
      { value: 'foarte_ridicat', label: 'Fără ventilație, poluare vizibilă' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Aerul viciat sau poluat cauzează afecțiuni respiratorii și reduce concentrarea.',
  },
  {
    id: 'mediu-003',
    question: 'Umiditatea relativă este în limite optime (40-60%)?',
    category: 'conditii_mediu',
    options: [
      { value: 'scazut', label: 'Da, monitorizată și controlată' },
      { value: 'mediu', label: 'În limite acceptabile, fără control' },
      { value: 'ridicat', label: 'Umiditate excesivă sau prea scăzută' },
      { value: 'foarte_ridicat', label: 'Condens, mucegai sau aer foarte uscat' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Umiditatea necorespunzătoare afectează confortul și favorizează afecțiuni respiratorii.',
  },
  {
    id: 'mediu-004',
    question: 'Există acces la apă potabilă și facilități sanitare adecvate?',
    category: 'conditii_mediu',
    options: [
      { value: 'scazut', label: 'Da, apă potabilă, sanitare curate, în număr suficient' },
      { value: 'mediu', label: 'Existente, dar necesită îmbunătățiri' },
      { value: 'ridicat', label: 'Insuficiente sau condiții precare' },
      { value: 'foarte_ridicat', label: 'Lipsa apei potabile sau sanitare inadecvate' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Facilitățile sanitare adecvate sunt obligatorii și esențiale pentru igienă și sănătate.',
  },
  {
    id: 'mediu-005',
    question: 'Spațiile de lucru sunt curate și ordonate (housekeeping)?',
    category: 'conditii_mediu',
    options: [
      { value: 'scazut', label: 'Da, curățenie zilnică, organizare 5S' },
      { value: 'mediu', label: 'Acceptabil, curățenie regulată' },
      { value: 'ridicat', label: 'Dezordine, curățenie sporadică' },
      { value: 'foarte_ridicat', label: 'Murdărie, acumulări, dezordine generalizată' },
    ],
    correctAnswer: 'scazut',
    explanation: 'Dezordinea și murdăria cresc riscul de accidente (alunecare, împiedicare) și îmbolnăviri.',
  },
];

// Categorii pentru filtrare și raportare
export const riskCategories = [
  { id: 'organizare', name: 'Organizare SSM', questionCount: 10 },
  { id: 'lucru_la_inaltime', name: 'Lucru la înălțime', questionCount: 5 },
  { id: 'substante_chimice', name: 'Substanțe chimice', questionCount: 5 },
  { id: 'ergonomie', name: 'Ergonomie', questionCount: 5 },
  { id: 'zgomot_vibratii', name: 'Zgomot și vibrații', questionCount: 5 },
  { id: 'electrosecuritate', name: 'Electrosecuritate', questionCount: 5 },
  { id: 'incendiu', name: 'Prevenire incendiu', questionCount: 5 },
  { id: 'echipamente', name: 'Echipamente de muncă', questionCount: 5 },
  { id: 'transport_intern', name: 'Transport intern', questionCount: 5 },
  { id: 'psihosocial', name: 'Riscuri psihosociale', questionCount: 5 },
  { id: 'conditii_mediu', name: 'Condiții de mediu', questionCount: 5 },
];

// Funcții utilitare pentru lucrul cu chestionarul
export const getQuestionsByCategory = (category: string): RiskQuestion[] => {
  return riskQuestions.filter((q) => q.category === category);
};

export const getRiskLevelScore = (level: RiskLevel): number => {
  const scores: Record<RiskLevel, number> = {
    scazut: 1,
    mediu: 2,
    ridicat: 3,
    foarte_ridicat: 4,
  };
  return scores[level];
};

export const getRiskLevelLabel = (level: RiskLevel): string => {
  const labels: Record<RiskLevel, string> = {
    scazut: 'Risc scăzut',
    mediu: 'Risc mediu',
    ridicat: 'Risc ridicat',
    foarte_ridicat: 'Risc foarte ridicat',
  };
  return labels[level];
};

export const getRiskLevelColor = (level: RiskLevel): string => {
  const colors: Record<RiskLevel, string> = {
    scazut: 'green',
    mediu: 'yellow',
    ridicat: 'orange',
    foarte_ridicat: 'red',
  };
  return colors[level];
};
