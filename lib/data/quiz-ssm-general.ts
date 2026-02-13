/**
 * Quiz SSM General - 50 întrebări pentru testarea cunoștințelor SSM
 * Categorii: legislație, EIP, prim ajutor, incendiu, semnalizare, drepturi angajat
 */

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'legislatie' | 'eip' | 'prim-ajutor' | 'incendiu' | 'semnalizare' | 'drepturi-angajat';
}

export const quizSsmGeneral: QuizQuestion[] = [
  // LEGISLAȚIE SSM
  {
    id: 'leg-001',
    question: 'Care este legea cadru privind securitatea și sănătatea în muncă în România?',
    options: [
      'Legea nr. 53/2003',
      'Legea nr. 319/2006',
      'Legea nr. 346/2002',
      'Legea nr. 273/2006'
    ],
    correctIndex: 1,
    explanation: 'Legea nr. 319/2006 este legea cadru privind securitatea și sănătatea în muncă în România, care transpune directivele europene în domeniu.',
    difficulty: 'easy',
    category: 'legislatie'
  },
  {
    id: 'leg-002',
    question: 'La câți angajați este obligatorie desemnarea unui lucrător pentru SSM?',
    options: [
      'De la 10 angajați',
      'De la 20 angajați',
      'De la 50 angajați',
      'Indiferent de numărul de angajați'
    ],
    correctIndex: 3,
    explanation: 'Potrivit Legii 319/2006, angajatorul are obligația de a organiza activitatea de SSM indiferent de numărul de angajați.',
    difficulty: 'medium',
    category: 'legislatie'
  },
  {
    id: 'leg-003',
    question: 'Care este durata minimă a instructajului de SSM la angajare?',
    options: [
      'Minim 4 ore',
      'Minim 6 ore',
      'Minim 8 ore',
      'Nu este specificată o durată minimă'
    ],
    correctIndex: 2,
    explanation: 'Instructajul general la angajare trebuie să aibă o durată de minim 8 ore conform normelor metodologice ale Legii 319/2006.',
    difficulty: 'medium',
    category: 'legislatie'
  },
  {
    id: 'leg-004',
    question: 'Cât durează valabilitatea instructajului periodic de SSM?',
    options: [
      '3 luni',
      '6 luni',
      '12 luni',
      '24 luni'
    ],
    correctIndex: 1,
    explanation: 'Instructajul periodic de SSM se efectuează la intervale de maximum 6 luni pentru lucrătorii din producție și cel puțin o dată pe an pentru cei din administrație.',
    difficulty: 'easy',
    category: 'legislatie'
  },
  {
    id: 'leg-005',
    question: 'Ce sancțiune riscă angajatorul care nu organizează activitatea de SSM?',
    options: [
      'Avertisment',
      'Amendă de la 10.000 la 20.000 lei',
      'Închidere temporară',
      'Amendă de la 1.000 la 5.000 lei'
    ],
    correctIndex: 1,
    explanation: 'Neorganizarea activității de SSM se sancționează cu amendă contravențională de la 10.000 la 20.000 lei conform Legii 319/2006.',
    difficulty: 'hard',
    category: 'legislatie'
  },

  // ECHIPAMENTE INDIVIDUALE DE PROTECȚIE (EIP)
  {
    id: 'eip-001',
    question: 'Care este rolul principal al echipamentului individual de protecție?',
    options: [
      'Să înlocuiască măsurile de protecție colectivă',
      'Să protejeze lucrătorul când alte măsuri sunt insuficiente',
      'Să sporească productivitatea',
      'Să asigure confortul la locul de muncă'
    ],
    correctIndex: 1,
    explanation: 'EIP-ul se utilizează când riscurile nu pot fi evitate sau limitate suficient prin măsuri de protecție colectivă sau prin organizarea muncii.',
    difficulty: 'easy',
    category: 'eip'
  },
  {
    id: 'eip-002',
    question: 'Cine suportă costul achiziționării echipamentului individual de protecție?',
    options: [
      'Angajatul',
      'Angajatorul',
      'Se împarte 50-50',
      'Statul prin ITM'
    ],
    correctIndex: 1,
    explanation: 'Angajatorul are obligația de a furniza gratuit echipamentul individual de protecție necesar și de a asigura întreținerea acestuia.',
    difficulty: 'easy',
    category: 'eip'
  },
  {
    id: 'eip-003',
    question: 'Ce tip de mănuși se folosesc pentru protecția împotriva riscurilor mecanice?',
    options: [
      'Mănuși din latex',
      'Mănuși din piele sau materiale sintetice rezistente',
      'Mănuși de bumbac',
      'Mănuși chirurgicale'
    ],
    correctIndex: 1,
    explanation: 'Pentru riscuri mecanice (tăiere, abraziune, perforare) se utilizează mănuși din piele sau materiale sintetice rezistente, marcate corespunzător.',
    difficulty: 'medium',
    category: 'eip'
  },
  {
    id: 'eip-004',
    question: 'Care este standardul de marcaj CE pentru echipamentele de protecție?',
    options: [
      'ISO 9001',
      'EN 149',
      'Directiva 89/686/CEE (acum Regulamentul UE 2016/425)',
      'ISO 45001'
    ],
    correctIndex: 2,
    explanation: 'EIP-urile trebuie să respecte Regulamentul UE 2016/425 privind echipamentele individuale de protecție și să fie marcate CE.',
    difficulty: 'hard',
    category: 'eip'
  },
  {
    id: 'eip-005',
    question: 'La ce nivel de zgomot devine obligatorie purtarea protecției auditive?',
    options: [
      'De la 80 dB(A)',
      'De la 85 dB(A)',
      'De la 87 dB(A)',
      'De la 90 dB(A)'
    ],
    correctIndex: 1,
    explanation: 'Conform normelor, angajatorul trebuie să pună la dispoziție protecție auditivă de la 80 dB(A), iar purtarea devine obligatorie de la 85 dB(A).',
    difficulty: 'medium',
    category: 'eip'
  },
  {
    id: 'eip-006',
    question: 'Casca de protecție trebuie înlocuită după ce perioadă maximă de utilizare?',
    options: [
      '1 an',
      '2 ani',
      '3-5 ani sau conform indicațiilor producătorului',
      '10 ani'
    ],
    correctIndex: 2,
    explanation: 'Cască de protecție are o durată de viață de 3-5 ani, în funcție de material și condițiile de utilizare, conform specificațiilor producătorului.',
    difficulty: 'medium',
    category: 'eip'
  },
  {
    id: 'eip-007',
    question: 'Ce clasificare au măștile FFP2?',
    options: [
      'Filtrare minimă 80%',
      'Filtrare minimă 94%',
      'Filtrare minimă 99%',
      'Filtrare minimă 99.95%'
    ],
    correctIndex: 1,
    explanation: 'Măștile FFP2 au o eficiență de filtrare de minimum 94% și sunt utilizate pentru protecție împotriva particulelor și aerosolilor.',
    difficulty: 'medium',
    category: 'eip'
  },

  // PRIM AJUTOR
  {
    id: 'pa-001',
    question: 'Care este primul lucru pe care trebuie să-l faci când găsești o victimă inconsistentă?',
    options: [
      'Verific respirația',
      'Sun la 112',
      'Verific siguranța scenei',
      'Încep resuscitarea'
    ],
    correctIndex: 2,
    explanation: 'Prima regulă în prim ajutor este verificarea siguranței scenei pentru a nu deveni tu însuți victimă. Apoi evaluezi victima.',
    difficulty: 'easy',
    category: 'prim-ajutor'
  },
  {
    id: 'pa-002',
    question: 'Care este raportul compresii-ventilații la resuscitarea cardio-pulmonară (RCP)?',
    options: [
      '15:2',
      '30:2',
      '30:1',
      '15:1'
    ],
    correctIndex: 1,
    explanation: 'Raportul standard pentru RCP este 30 compresii toracice urmate de 2 ventilații, atât pentru adulți cât și pentru copii.',
    difficulty: 'easy',
    category: 'prim-ajutor'
  },
  {
    id: 'pa-003',
    question: 'La ce adâncime trebuie efectuate compresiile toracice la un adult?',
    options: [
      '2-3 cm',
      '3-4 cm',
      '5-6 cm',
      '7-8 cm'
    ],
    correctIndex: 2,
    explanation: 'Compresiile toracice la adulți trebuie să aibă o adâncime de 5-6 cm și o frecvență de 100-120/minut pentru a fi eficiente.',
    difficulty: 'medium',
    category: 'prim-ajutor'
  },
  {
    id: 'pa-004',
    question: 'Cum tratezi o arsură de gradul I?',
    options: [
      'Aplici unt sau pastă de dinți',
      'Răcești zona cu apă rece curentă 10-20 minute',
      'Spargi bășicile formate',
      'Aplici gheață direct'
    ],
    correctIndex: 1,
    explanation: 'Arsurile de gradul I se tratează prin răcire cu apă rece curentă timp de 10-20 minute. Nu se aplică substanțe grăsoase sau gheață direct.',
    difficulty: 'easy',
    category: 'prim-ajutor'
  },
  {
    id: 'pa-005',
    question: 'Ce este poziția laterală de siguranță (PLS)?',
    options: [
      'Poziție pentru victimele cu fracturi',
      'Poziție pentru victimele inconștiente care respiră',
      'Poziție pentru victimele cu hemoragie',
      'Poziție pentru victimele cu șoc'
    ],
    correctIndex: 1,
    explanation: 'PLS se utilizează pentru victime inconștiente care respiră normal, pentru a preveni aspirația și a menține căile respiratorii deschise.',
    difficulty: 'medium',
    category: 'prim-ajutor'
  },
  {
    id: 'pa-006',
    question: 'Cum oprești o hemoragie externă abundentă?',
    options: [
      'Aplici un garou imediat',
      'Presiune directă pe rană + ridicarea membrului',
      'Lași să sângereze pentru curățare',
      'Aplici alcool pe rană'
    ],
    correctIndex: 1,
    explanation: 'Hemoragia externă se oprește prin presiune directă pe rană cu un material curat și ridicarea membrului afectat. Garoul este ultimul resort.',
    difficulty: 'easy',
    category: 'prim-ajutor'
  },
  {
    id: 'pa-007',
    question: 'Ce trebuie să conțină obligatoriu trusa de prim ajutor la locul de muncă?',
    options: [
      'Medicamente analgezice',
      'Materiale de pansament sterile, mănuși, foarfecă',
      'Antibiotice',
      'Tranchilizante'
    ],
    correctIndex: 1,
    explanation: 'Trusa de prim ajutor trebuie să conțină materiale de pansament, antiseptice, mănuși, foarfecă, dar NU medicamente care necesită prescripție.',
    difficulty: 'medium',
    category: 'prim-ajutor'
  },
  {
    id: 'pa-008',
    question: 'Care sunt semnele șocului traumatic?',
    options: [
      'Piele caldă și uscată, puls rapid',
      'Piele rece și palidă, transpirații, puls slab și rapid',
      'Febră mare',
      'Dureri abdominale'
    ],
    correctIndex: 1,
    explanation: 'Șocul traumatic se manifestă prin piele rece, palidă și umedă, transpirații, puls slab și rapid, anxietate și potențial pierderea conștiinței.',
    difficulty: 'medium',
    category: 'prim-ajutor'
  },

  // PREVENIREA ȘI STINGEREA INCENDIILOR
  {
    id: 'inc-001',
    question: 'Care sunt cele trei elemente ale triunghiului focului?',
    options: [
      'Căldură, apă, aer',
      'Combustibil, comburant, sursa de aprindere',
      'Foc, fum, căldură',
      'Oxigen, azot, hidrogen'
    ],
    correctIndex: 1,
    explanation: 'Triunghiul focului este format din combustibil (material inflamabil), comburant (oxigen) și sursă de aprindere (căldură/scânteie). Eliminând unul, focul se stinge.',
    difficulty: 'easy',
    category: 'incendiu'
  },
  {
    id: 'inc-002',
    question: 'Ce clasă de incendiu se stinge cu stingător cu pulbere ABC?',
    options: [
      'Doar clasa A (solide)',
      'Doar clasa B (lichide)',
      'Clasele A, B și C (solide, lichide, gaze)',
      'Doar clasa D (metale)'
    ],
    correctIndex: 2,
    explanation: 'Stingătorul cu pulbere ABC este universal și poate stinge incendii de clasele A (solide), B (lichide inflamabile) și C (gaze).',
    difficulty: 'easy',
    category: 'incendiu'
  },
  {
    id: 'inc-003',
    question: 'Cum acționezi corect cu un stingător portabil?',
    options: [
      'Smulg știftul, țintesc flacăra, apeș pârghia',
      'Apeș direct pârghia',
      'Îndrept jetul spre baza focului',
      'Smulg știftul, țintesc baza focului, apeș pârghia'
    ],
    correctIndex: 3,
    explanation: 'Tehnica corectă: smulgi știftul de siguranță, țintești baza focului (nu flacăra), apoi apeși pârghia pentru a pulveriza agentul stingător.',
    difficulty: 'medium',
    category: 'incendiu'
  },
  {
    id: 'inc-004',
    question: 'Ce NU trebuie să folosești pentru a stinge un incendiu la instalații electrice sub tensiune?',
    options: [
      'Stingător cu CO2',
      'Stingător cu pulbere',
      'Apă sau spumă',
      'Nisip uscat'
    ],
    correctIndex: 2,
    explanation: 'Apa și spuma conduc electricitatea și pot provoca electrocutare. Pentru incendii electrice se folosesc CO2, pulbere sau se întrerupe curentul.',
    difficulty: 'easy',
    category: 'incendiu'
  },
  {
    id: 'inc-005',
    question: 'La ce interval se verifică stingătoarele portabile?',
    options: [
      'La fiecare 3 luni',
      'La fiecare 6 luni',
      'Anual',
      'La 2 ani'
    ],
    correctIndex: 1,
    explanation: 'Stingătoarele portabile trebuie verificate la fiecare 6 luni și reîncărcate conform specificațiilor producătorului sau după utilizare.',
    difficulty: 'medium',
    category: 'incendiu'
  },
  {
    id: 'inc-006',
    question: 'Ce înseamnă clasa de incendiu D?',
    options: [
      'Incendii de lichide inflamabile',
      'Incendii de gaze',
      'Incendii de metale',
      'Incendii de echipamente electrice'
    ],
    correctIndex: 2,
    explanation: 'Clasa D reprezintă incendii de metale combustibile (magneziu, aluminiu pulbere, sodiu) care necesită agenți stingători speciali.',
    difficulty: 'medium',
    category: 'incendiu'
  },
  {
    id: 'inc-007',
    question: 'Care este distanța maximă de parcurs până la un stingător în clădiri?',
    options: [
      '10 metri',
      '20 metri',
      '25 metri',
      '50 metri'
    ],
    correctIndex: 2,
    explanation: 'Conform normelor PSI, distanța maximă de parcurs până la cel mai apropiat stingător nu trebuie să depășească 25 metri în clădiri.',
    difficulty: 'hard',
    category: 'incendiu'
  },
  {
    id: 'inc-008',
    question: 'Ce caracteristică are CO2 ca agent stingător?',
    options: [
      'Răcește și înăbușă focul, nu lasă reziduuri',
      'Lasă multă spumă după utilizare',
      'Este toxic în concentrații mari',
      'Răspunsurile a și c sunt corecte'
    ],
    correctIndex: 3,
    explanation: 'CO2 este eficient prin răcire și înăbușire, nu lasă reziduuri, dar în concentrații mari poate fi periculos pentru sănătate (asfixiere).',
    difficulty: 'hard',
    category: 'incendiu'
  },

  // SEMNALIZARE SSM
  {
    id: 'semn-001',
    question: 'Ce formă are un semn de interzicere?',
    options: [
      'Cerc cu dungă diagonală roșie',
      'Triunghi',
      'Pătrat',
      'Dreptunghi verde'
    ],
    correctIndex: 0,
    explanation: 'Semnele de interzicere sunt circulare, cu chenar roșu și o bandă diagonală roșie, pe fond alb (ex: „Fumatul interzis").',
    difficulty: 'easy',
    category: 'semnalizare'
  },
  {
    id: 'semn-002',
    question: 'Ce culoare au semnele de evacuare și salvare?',
    options: [
      'Roșu',
      'Galben',
      'Verde',
      'Albastru'
    ],
    correctIndex: 2,
    explanation: 'Semnele de evacuare, ieșiri de urgență și prim ajutor sunt dreptunghiulare sau pătrate, de culoare verde cu pictogramă albă.',
    difficulty: 'easy',
    category: 'semnalizare'
  },
  {
    id: 'semn-003',
    question: 'Ce formă și culoare are un semn de avertizare?',
    options: [
      'Cerc roșu',
      'Triunghi galben cu chenar negru',
      'Pătrat verde',
      'Cerc albastru'
    ],
    correctIndex: 1,
    explanation: 'Semnele de avertizare sunt triunghiulare, cu fond galben, chenar și simbol negru (ex: „Pericol de electrocutare").',
    difficulty: 'easy',
    category: 'semnalizare'
  },
  {
    id: 'semn-004',
    question: 'Ce semnifică un semn circular pe fond albastru?',
    options: [
      'Interzicere',
      'Avertizare',
      'Obligativitate',
      'Evacuare'
    ],
    correctIndex: 2,
    explanation: 'Semnele circulare pe fond albastru cu pictogramă albă indică obligativitatea unei acțiuni (ex: „Purtarea ochelarilor obligatorie").',
    difficulty: 'medium',
    category: 'semnalizare'
  },
  {
    id: 'semn-005',
    question: 'Unde se amplasează semnele de echipamente de intervenție la incendiu?',
    options: [
      'Pe fundal verde',
      'Pe fundal roșu cu pictogramă albă',
      'Pe fundal galben',
      'Pe fundal albastru'
    ],
    correctIndex: 1,
    explanation: 'Echipamentele de intervenție la incendiu (hidranți, stingătoare) sunt semnalizate cu pătrate sau dreptunghiuri roșii cu simbol alb.',
    difficulty: 'medium',
    category: 'semnalizare'
  },
  {
    id: 'semn-006',
    question: 'Ce înseamnă marcajul galben-negru în zigzag?',
    options: [
      'Zonă de lucru',
      'Obstacol sau zonă periculoasă',
      'Cale de evacuare',
      'Zonă de depozitare'
    ],
    correctIndex: 1,
    explanation: 'Marcajele galben-negru în benzi înclinate indică obstacole, margini de platforme sau zone cu risc de lovire/cădere.',
    difficulty: 'medium',
    category: 'semnalizare'
  },
  {
    id: 'semn-007',
    question: 'Care este semnificația simbolului „craniu cu oase încrucișate"?',
    options: [
      'Risc biologic',
      'Substanțe toxice/otrăvitoare',
      'Risc de explozie',
      'Risc radioactiv'
    ],
    correctIndex: 1,
    explanation: 'Craniul cu oase încrucișate pe fond galben avertizează prezența substanțelor toxice sau otrăvitoare care pot cauza intoxicații grave.',
    difficulty: 'easy',
    category: 'semnalizare'
  },

  // DREPTURI ȘI OBLIGAȚII ANGAJAT
  {
    id: 'drept-001',
    question: 'Are dreptul un angajat să refuze lucrul într-un loc periculos?',
    options: [
      'Nu, sub nicio formă',
      'Da, dacă există pericol grav și iminent pentru viața sa',
      'Doar cu aprobare scrisă de la șef',
      'Doar după ce anunță ITM'
    ],
    correctIndex: 1,
    explanation: 'Conform Legii 319/2006, angajatul poate întrerupe activitatea și părăsi locul de muncă dacă există pericol grav și iminent, fără să fie sancționat.',
    difficulty: 'easy',
    category: 'drepturi-angajat'
  },
  {
    id: 'drept-002',
    question: 'Cine are obligația de a asigura controlul medical la angajare?',
    options: [
      'Angajatul pe cheltuială proprie',
      'Angajatorul gratuit pentru angajat',
      'Medicul de familie',
      'ITM'
    ],
    correctIndex: 1,
    explanation: 'Angajatorul are obligația de a asigura și plăti controlul medical la angajare, periodic și la reluarea activității, conform Legii 319/2006.',
    difficulty: 'easy',
    category: 'drepturi-angajat'
  },
  {
    id: 'drept-003',
    question: 'Poate fi sancționat un angajat care semnalează o situație periculoasă?',
    options: [
      'Da, dacă semnalarea este falsă',
      'Nu, este protejat de lege dacă acționează cu bună credință',
      'Da, dacă afectează producția',
      'Doar dacă nu respectă procedura'
    ],
    correctIndex: 1,
    explanation: 'Angajații care semnalează deficiențe SSM cu bună credință sunt protejați împotriva măsurilor negative din partea angajatorului.',
    difficulty: 'medium',
    category: 'drepturi-angajat'
  },
  {
    id: 'drept-004',
    question: 'Care este obligația angajatului privind EIP-ul primit?',
    options: [
      'Să îl returneze la sfârșitul zilei',
      'Să îl utilizeze conform instrucțiunilor și să îl îngrijească',
      'Să îl împartă cu colegii',
      'Să îl cumpere dacă se deteriorează'
    ],
    correctIndex: 1,
    explanation: 'Angajatul are obligația de a utiliza corect EIP-ul, de a-l îngrijii și de a semnala orice defecțiune sau deteriorare angajatorului.',
    difficulty: 'easy',
    category: 'drepturi-angajat'
  },
  {
    id: 'drept-005',
    question: 'Angajatul poate refuza să participe la instructajul de SSM?',
    options: [
      'Da, dacă cunoaște procedurile',
      'Nu, participarea este obligatorie',
      'Da, dacă are experiență',
      'Doar dacă este în afara programului'
    ],
    correctIndex: 1,
    explanation: 'Participarea la instructajele de SSM este obligatorie pentru toți angajații. Refuzul poate constitui abatere disciplinară.',
    difficulty: 'easy',
    category: 'drepturi-angajat'
  },
  {
    id: 'drept-006',
    question: 'Ce trebuie să facă un angajat dacă observă un echipament defect?',
    options: [
      'Să continue lucrul și să anunțe la sfârșit de tură',
      'Să oprească imediat lucrul și să anunțe superiorul',
      'Să repare singur defecțiunea',
      'Să lase un bilet'
    ],
    correctIndex: 1,
    explanation: 'Angajatul are obligația de a opri imediat utilizarea echipamentului defect și de a informa șeful ierarhic sau responsabilul SSM.',
    difficulty: 'easy',
    category: 'drepturi-angajat'
  },
  {
    id: 'drept-007',
    question: 'În ce condiții poate lucra un angajat peste programul normal în condiții periculoase?',
    options: [
      'Oricând dacă acceptă',
      'Doar cu acordul său scris și cu măsuri suplimentare de protecție',
      'Nu poate lucra niciodată peste program',
      'Doar cu aprobare ITM'
    ],
    correctIndex: 1,
    explanation: 'Munca suplimentară în condiții periculoase necesită acordul angajatului și asigurarea unor măsuri suplimentare de protecție din partea angajatorului.',
    difficulty: 'medium',
    category: 'drepturi-angajat'
  },
  {
    id: 'drept-008',
    question: 'Cine reprezintă interesele lucrătorilor în domeniul SSM la nivel de firmă?',
    options: [
      'Managerul general',
      'Reprezentantul lucrătorilor cu atribuții specifice (RLAS)',
      'Medicul de medicina muncii',
      'Inspectorul ITM'
    ],
    correctIndex: 1,
    explanation: 'RLAS (Reprezentantul Lucrătorilor cu Atribuții Specifice) este ales de angajați pentru a-i reprezenta în problemele de SSM.',
    difficulty: 'medium',
    category: 'drepturi-angajat'
  },

  // ÎNTREBĂRI MIXTE - NIVEL AVANSAT
  {
    id: 'mix-001',
    question: 'Care este durata de păstrare a Registrului de instructaj SSM?',
    options: [
      '1 an',
      '3 ani',
      '5 ani',
      'Permanent (sau minim 10 ani)'
    ],
    correctIndex: 3,
    explanation: 'Registrele de instructaj SSM se păstrează permanent la locul de muncă sau minim 10 ani după încetarea raporturilor de muncă ale ultimului angajat înregistrat.',
    difficulty: 'hard',
    category: 'legislatie'
  },
  {
    id: 'mix-002',
    question: 'Ce clasificare FFP este minimă pentru protecție împotriva COVID-19?',
    options: [
      'FFP1',
      'FFP2',
      'FFP3',
      'Orice mască medicală'
    ],
    correctIndex: 1,
    explanation: 'Pentru protecție împotriva virusurilor și particulelor fine, inclusiv COVID-19, se recomandă minim FFP2 (94% eficiență filtrare).',
    difficulty: 'medium',
    category: 'eip'
  },
  {
    id: 'mix-003',
    question: 'La câte persoane este obligatorie desemnarea unui salvator calificat în prim ajutor?',
    options: [
      'Minim 1 la 10 angajați',
      'Minim 1 la 20 angajați',
      'Minim 1 la 50 angajați',
      'Conform evaluării riscurilor'
    ],
    correctIndex: 3,
    explanation: 'Numărul salvatorilor se stabilește conform evaluării riscurilor, dar ca regulă generală se recomandă 1 salvator la 20-50 angajați.',
    difficulty: 'hard',
    category: 'prim-ajutor'
  },
  {
    id: 'mix-004',
    question: 'Care este ordinul corect de utilizare a metodelor de stingere?',
    options: [
      'Apă - pulbere - CO2 - spumă',
      'Întrerupere sursă - evacuare - stingere - salvare',
      'Stingere - salvare - evacuare - anunțare',
      'Anunțare 112 - evacuare - stingere (dacă e sigur) - salvare'
    ],
    correctIndex: 3,
    explanation: 'Procedura corectă: alarmare 112, evacuare persoane, tentativă stingere doar dacă este sigur și știi să folosești mijloacele, salvare victime.',
    difficulty: 'hard',
    category: 'incendiu'
  },
  {
    id: 'mix-005',
    question: 'Ce înseamnă acronimul RCP?',
    options: [
      'Resuscitare Cardio-Pulmonară',
      'Recuperare Conștientă Precoce',
      'Respirație Controlată Programată',
      'Răspuns Clinic Pozitiv'
    ],
    correctIndex: 0,
    explanation: 'RCP = Resuscitare Cardio-Pulmonară, manevrele de salvare prin compresii toracice și ventilații în caz de stop cardio-respirator.',
    difficulty: 'easy',
    category: 'prim-ajutor'
  },
  {
    id: 'mix-006',
    question: 'Ce indică culoarea portocalie/orange în semnalizarea de securitate?',
    options: [
      'Pericol toxic',
      'Produse chimice periculoase',
      'Componente periculoase ale mașinilor/echipamentelor',
      'Zonă de lucru'
    ],
    correctIndex: 2,
    explanation: 'Culoarea portocalie se folosește pentru a indica părțile periculoase ale mașinilor și echipamentelor (butoane STOP, lame, etc.).',
    difficulty: 'hard',
    category: 'semnalizare'
  },
  {
    id: 'mix-007',
    question: 'Care este conținutul minim al fișei individuale de EIP?',
    options: [
      'Nume, prenume, funcție',
      'Nume, funcție, tip EIP, cantitate, dată eliberare, semnătură',
      'Doar semnătura angajatului',
      'Nu este obligatorie'
    ],
    correctIndex: 1,
    explanation: 'Fișa individuală de EIP trebuie să conțină: date angajat, funcție, tipul și cantitatea EIP-ului, data eliberării și semnătura de primire.',
    difficulty: 'medium',
    category: 'legislatie'
  },
  {
    id: 'mix-008',
    question: 'Când se efectuează instructajul la locul de muncă?',
    options: [
      'Înaintea începerii lucrului pe postul respectiv',
      'În prima lună de activitate',
      'După finalizarea perioadei de probă',
      'Nu este obligatoriu'
    ],
    correctIndex: 0,
    explanation: 'Instructajul la locul de muncă se efectuează înainte ca angajatul să înceapă lucrul efectiv pe postul respectiv, după instructajul general.',
    difficulty: 'medium',
    category: 'legislatie'
  },
  {
    id: 'mix-009',
    question: 'Care este adâncimea minimă a trusă de prim ajutor tip valiza?',
    options: [
      'Nu contează dimensiunea',
      'Minim 10 cm',
      'Minim 15 cm pentru vizibilitate și organizare',
      'Minim 30 cm'
    ],
    correctIndex: 2,
    explanation: 'Trusa de prim ajutor trebuie să fie ușor identificabilă, bine organizată și să conțină toate materialele necesare conform normativelor în vigoare.',
    difficulty: 'hard',
    category: 'prim-ajutor'
  },
  {
    id: 'mix-010',
    question: 'Cum se numește documentul care atestă că un angajat a participat la instructaj?',
    options: [
      'Certificat de instructaj',
      'Fișa postului',
      'Fișa individuală de instructaj (din Registrul de instructaj)',
      'Adeverință de participare'
    ],
    correctIndex: 2,
    explanation: 'Participarea la instructaj se consemnează în Registrul de instructaj SSM, unde fiecare angajat semnează în fișa sa individuală.',
    difficulty: 'medium',
    category: 'legislatie'
  }
];

export default quizSsmGeneral;
