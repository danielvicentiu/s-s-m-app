/**
 * Modele de Instrucțiuni Proprii SSM per Activitate
 * 15 modele standard pentru diferite tipuri de activități profesionale
 */

export interface InstructionSection {
  title: string;
  content: string[];
}

export interface InstructiuneProprie {
  id: string;
  activity: string;
  title: string;
  sections: InstructionSection[];
  legalBasis: string;
  reviewFrequency: string;
}

export const instructiuniPropriiModele: InstructiuneProprie[] = [
  {
    id: 'ip-birou-001',
    activity: 'birou',
    title: 'Instrucțiuni de Securitate și Sănătate în Muncă pentru Activități de Birou',
    sections: [
      {
        title: '1. Domeniu de Aplicare',
        content: [
          'Prezenta instrucțiune se aplică tuturor angajaților care desfășoară activități de birou: lucru la calculator, redactare documente, activități administrative.',
          'Include utilizarea echipamentelor de birou: computer, imprimantă, copiator, telefon, scanner.'
        ]
      },
      {
        title: '2. Riscuri Identificate',
        content: [
          'Posturi de muncă neergonomice — dureri lombare, cervicale',
          'Oboseală vizuală din cauza timpului prelungit la calculator',
          'Pozițiile statice prelungite — probleme circulatorii',
          'Electrocutare de la echipamente defecte',
          'Căderi la același nivel (cabluri, suprafețe alunecoase)',
          'Stres profesional, sarcini multiple simultane'
        ]
      },
      {
        title: '3. Măsuri de Prevenire Obligatorii',
        content: [
          'Reglați înălțimea scaunului astfel încât picioarele să atingă complet podeaua',
          'Așezați monitorul la distanță de 50-70 cm, partea superioară la nivelul ochilor',
          'Utilizați suport pentru picioare dacă este necesar',
          'Faceți pauze de 10 minute la fiecare 50 minute de lucru la calculator',
          'Efectuați exerciții simple pentru ochi și gât în timpul pauzelor',
          'Nu supraîncărcați prize electrice — utilizați prelungitoare autorizate',
          'Mențineți căile de acces libere, fără cabluri sau obiecte pe podea',
          'Raportați imediat orice defecțiune a echipamentelor'
        ]
      },
      {
        title: '4. Echipament de Protecție',
        content: [
          'Nu este necesar echipament de protecție specific',
          'Recomandare: ochelari pentru protecție lumină albastră (opțional)'
        ]
      },
      {
        title: '5. Conduită în Situații de Urgență',
        content: [
          'În caz de incendiu: părăsiți calm zona și anunțați echipa de intervenție',
          'La electrocutare: întrerupeți sursa de curent înainte de a acorda ajutor',
          'La accidente: anunțați imediat responsabilul SSM și primul ajutor',
          'Cunoașteți locația stingătoarelor și ieșirilor de urgență'
        ]
      }
    ],
    legalBasis: 'Legea 319/2006, HG 1091/2006, Norma tehnica generala pentru protectia si igiena muncii',
    reviewFrequency: 'Anual sau la modificarea condițiilor de muncă'
  },

  {
    id: 'ip-constructii-002',
    activity: 'constructii',
    title: 'Instrucțiuni de Securitate și Sănătate în Muncă pentru Lucrări de Construcții',
    sections: [
      {
        title: '1. Domeniu de Aplicare',
        content: [
          'Prezenta instrucțiune se aplică tuturor lucrătorilor din construcții: zidari, dulgheri, fierari-betonisti, muncitori necalificați.',
          'Include lucrări de: zidărie, turnare betoane, montaj armături, finisaje, demolări.'
        ]
      },
      {
        title: '2. Riscuri Identificate',
        content: [
          'Căderi de la înălțime de pe schele, scări, platforme',
          'Prinderi, striviri de obiecte grele (cărămizi, plăci, scule)',
          'Electrocutare de la scule electrice sau instalații',
          'Căderi de materiale de sus — loviri ale lucrătorilor de jos',
          'Răni tăiate, înțepate de la unelte ascuțite',
          'Expunere la praf, zgomot, vibrații',
          'Suprasolicitare fizică — ridicări greutăți',
          'Prăbușiri de construcții temporare'
        ]
      },
      {
        title: '3. Măsuri de Prevenire Obligatorii',
        content: [
          'Purtați OBLIGATORIU: cască, bocanci de protecție, mănuși',
          'Verificați zilnic starea schelelor și parapetelor — raportați defecțiunile',
          'Nu lucrați la înălțime fără centură de siguranță atunci când este necesar',
          'Nu aruncați materiale de sus — folosiți jgheaburi sau coborâți-le controlat',
          'Delimitați zona de lucru la înălțime pentru a proteja lucrătorii de dedesubt',
          'Verificați sculele electrice înainte de utilizare — nu folosiți dacă sunt defecte',
          'Respectați instrucțiunile de utilizare pentru fiecare echipament',
          'Nu ridicați greutăți peste 25 kg fără ajutor sau mijloace mecanice',
          'Păstrați ordinea pe șantier — mutați materialele din căile de acces',
          'Nu consumați alcool înainte sau în timpul programului'
        ]
      },
      {
        title: '4. Echipament de Protecție Obligatoriu',
        content: [
          'Cască de protecție — OBLIGATORIE în toată zona șantierului',
          'Bocanci de protecție cu bombeu metalic',
          'Mănuși de protecție pentru lucrări manuale',
          'Ochelari de protecție pentru lucrări cu discuri abrazive',
          'Centură de siguranță pentru lucru la înălțime (peste 2m)',
          'Vest reflectorizant dacă există circulație de vehicule'
        ]
      },
      {
        title: '5. Conduită în Situații de Urgență',
        content: [
          'La accidente grave: apelați 112 imediat',
          'Opriți lucrul și securizați zona accidentului',
          'Acordați primul ajutor dacă sunteți instruit',
          'Anunțați responsabilul de șantier și responsabilul SSM',
          'Nu mutați victima dacă există suspiciune de fractură de coloană',
          'Documentați locul accidentului prin fotografii (dacă este posibil)'
        ]
      }
    ],
    legalBasis: 'Legea 319/2006, HG 300/2006 privind cerințele minime de securitate și sănătate pentru șantiere',
    reviewFrequency: 'Anual sau la modificarea tehnologiei de lucru'
  },

  {
    id: 'ip-sudura-003',
    activity: 'sudura',
    title: 'Instrucțiuni de Securitate și Sănătate în Muncă pentru Lucrări de Sudură',
    sections: [
      {
        title: '1. Domeniu de Aplicare',
        content: [
          'Prezenta instrucțiune se aplică sudorilor autorizați care efectuează operații de sudare electrică, oxigaz, TIG, MIG-MAG.',
          'Include pregătirea pieselor, sudarea propriu-zisă, curățarea cusăturilor.'
        ]
      },
      {
        title: '2. Riscuri Identificate',
        content: [
          'Arsuri de la flacără, scântei, stropi metalici topiți',
          'Electrocutare de la aparate de sudură defecte',
          'Intoxicații cu fum de sudură (oxizi metalici)',
          'Leziuni oculare de la radiații UV intense (arc electric)',
          'Incendiu/explozie la sudarea în zone cu gaze, lichide inflamabile',
          'Explozie la butelii de gaze comprimate (dacă sunt deteriorate)',
          'Zgomot intens la operații de șlefuire'
        ]
      },
      {
        title: '3. Măsuri de Prevenire Obligatorii',
        content: [
          'Purtați OBLIGATORIU: mască de sudor cu filtru adecvat, mănuși pentru sudori, șorț din piele',
          'Verificați înainte de lucru: starea cablurilor, a clemelor, a manșonului',
          'Nu sudați în zone cu vapori inflamabili sau materiale combustibile',
          'Asigurați ventilație adecvată pentru evacuarea fumului de sudură',
          'Delimitați zona de lucru cu paravane pentru a proteja alți lucrători de radiații',
          'Verificați buteliile de gaze: nu prezintă fisuri, ventilele sunt funcționale',
          'Nu lăsați buteliile la soare sau aproape de surse de căldură',
          'Păstrați un stingător în apropierea locului de sudură',
          'Nu sudați recipienți ce au conținut substanțe inflamabile fără curățare prealabilă',
          'După terminare: deconectați aparatura și verificați absența punctelor incandescente'
        ]
      },
      {
        title: '4. Echipament de Protecție Obligatoriu',
        content: [
          'Mască de sudură cu filtru optic corespunzător (DIN 9-13 după procedeu)',
          'Mănuși pentru sudori din piele',
          'Șorț sau jachetă din piele pentru sudori',
          'Bocanci de protecție',
          'Pantaloni fără tivuri întoarse (risc de acumulare scântei)',
          'Căciulă de protecție sub cască (dacă este cazul)'
        ]
      },
      {
        title: '5. Conduită în Situații de Urgență',
        content: [
          'La incendiu: utilizați stingătorul CO₂ sau pulbere, NU APĂ pe echipament electric',
          'La electrocutare: întrerupeți curentul, apoi acordați primul ajutor',
          'La arsuri: răciți zona cu apă rece 10-15 minute, acoperiți cu pansament steril',
          'La intoxicare cu fum: scoateți victima la aer, asigurați ventilație',
          'Anunțați responsabilul SSM și apelați 112 dacă este necesar'
        ]
      }
    ],
    legalBasis: 'Legea 319/2006, Normativ pentru supravegherea medicală a sudorilor, HG 1091/2006',
    reviewFrequency: 'Anual sau la schimbarea procedeului de sudare'
  },

  {
    id: 'ip-stivuitor-004',
    activity: 'stivuitor',
    title: 'Instrucțiuni de Securitate și Sănătate în Muncă pentru Operatori Stivuitoare',
    sections: [
      {
        title: '1. Domeniu de Aplicare',
        content: [
          'Prezenta instrucțiune se aplică operatorilor de stivuitoare frontale, retractabile, cu contragreutate, autorizați ISCIR.',
          'Include operații de ridicare, transport, depozitare paleți, coborâre sarcini.'
        ]
      },
      {
        title: '2. Riscuri Identificate',
        content: [
          'Răsturnarea stivuitorului din cauza sarcinii prea mari sau instabile',
          'Lovirea pietonilor în zonele de lucru',
          'Căderea sarcinii pe operator sau alte persoane',
          'Coliziuni cu alte stivuitoare, vehicule, structuri',
          'Prinderea extremităților între stivuitor și obstacole',
          'Căderea operatorului de pe stivuitor',
          'Incendiu la stivuitoare cu motoare termice (scurgeri carburant)',
          'Intoxicare cu CO la stivuitoare GPL folosite în spații închise'
        ]
      },
      {
        title: '3. Măsuri de Prevenire Obligatorii',
        content: [
          'Operați stivuitorul DOAR dacă aveți autorizație ISCIR valabilă',
          'Verificați zilnic înainte de utilizare: frâne, direcție, claxon, faruri, furci, lanțuri',
          'Completați fișa de verificare zilnică — raportați orice defecțiune',
          'Nu transportați sarcini peste capacitatea nominală a stivuitorului',
          'Distribuiți sarcina uniform pe ambele furci, cât mai aproape de catarg',
          'Circulați cu sarcina cât mai jos posibil (10-15 cm deasupra solului)',
          'În rampe: urcați cu sarcina în față, coborâți cu sarcina în spate',
          'Nu permiteți nimeni să circule sau să se urce pe stivuitor (cu excepția platformelor autorizate)',
          'Respectați limitele de viteza în incintă (max. 10 km/h sau conform regulamentului)',
          'Claxonați la colțuri și intrări în zone cu vizibilitate redusă',
          'Nu lăsați niciodată stivuitorul cu motorul pornit și nesupravegheat',
          'La terminarea programului: coborâți furcile complet, opriți motorul, trageți frâna de mână'
        ]
      },
      {
        title: '4. Echipament de Protecție Obligatoriu',
        content: [
          'Bocanci de protecție',
          'Vestă reflectorizantă',
          'Cască de protecție (dacă se lucrează în zona cu riscuri la înălțime)',
          'Centura de siguranță dacă stivuitorul este echipat cu sistem de reținere'
        ]
      },
      {
        title: '5. Conduită în Situații de Urgență',
        content: [
          'La răsturnare: NU săriți de pe stivuitor — rămâneți în cabină, apucați volanul, aplicați-vă corpul spre interior',
          'La lovirea unui pieton: opriți imediat, asigurați zona, apelați 112 și primul ajutor',
          'La incendiu: opriți motorul, coborâți rapid, folosiți stingător, evacuați zona',
          'La scurgeri de carburant/ulei: opriți motorul, anunțați responsabilul, absorbați scurgerea',
          'Raportați orice accident sau incident responsabilului SSM'
        ]
      }
    ],
    legalBasis: 'Legea 319/2006, Normativ ISCIR pentru autorizarea operatorilor, HG 1146/2006',
    reviewFrequency: 'Anual sau la schimbarea modelului de stivuitor'
  },

  {
    id: 'ip-inaltime-005',
    activity: 'inaltime',
    title: 'Instrucțiuni de Securitate și Sănătate în Muncă pentru Lucrul la Înălțime',
    sections: [
      {
        title: '1. Domeniu de Aplicare',
        content: [
          'Prezenta instrucțiune se aplică tuturor lucrătorilor care desfășoară activități la înălțimi peste 2 metri: montaj schele, lucrări pe acoperiș, curățare ferestre, instalații electrice aeriene.',
          'Include utilizarea schelelor, platformelor elevatoare, centuri de siguranță, scări.'
        ]
      },
      {
        title: '2. Riscuri Identificate',
        content: [
          'Căderea de la înălțime a lucrătorului — risc major, consecințe grave/mortale',
          'Căderea de obiecte/scule care pot lovi lucrători de la nivelul solului',
          'Ruperea parapeților, platformelor, scărilor',
          'Prăbușirea schelelor temporare',
          'Alunecări pe suprafețe înclinate, umede (acoperișuri)',
          'Electrocutare la contact cu linii electrice aeriene',
          'Dezechilibru, amețeală, leșin la persoane cu probleme medicale'
        ]
      },
      {
        title: '3. Măsuri de Prevenire Obligatorii',
        content: [
          'Nu lucrați la înălțime dacă nu sunteți apt medical și instruit specific',
          'Purtați OBLIGATORIU centură de siguranță ancorată corect (peste 2m)',
          'Verificați punctul de ancorare: trebuie să suporte min. 1000 kg',
          'Verificați starea centurii, cordelei, cârligului înainte de folosire',
          'Delimitați zona de dedesubt pentru a preveni lovirea de obiecte căzute',
          'Folosiți platforme de lucru prevăzute cu parapete pe 3 laturi (min. 1m înălțime)',
          'Nu improvizați platforme din scânduri nesecurizate',
          'Scările: minim 1m peste nivelul de acces, fixate la bază și vârf, unghi 65-75°',
          'La vânt puternic, ploaie, gheață: NU lucrați la înălțime',
          'Nu aruncați scule sau materiale — folosiți coșuri, frânghii de coborâre',
          'Nu transportați obiecte grele în timpul urcării — folosiți mijloace mecanice',
          'Verificați dacă există linii electrice în apropiere — păstrați distanță de min. 3m'
        ]
      },
      {
        title: '4. Echipament de Protecție Obligatoriu',
        content: [
          'Cască de protecție',
          'Centură de siguranță cu dispozitiv anti-cădere (ham complet)',
          'Cordeală de siguranță cu absorbant de șoc',
          'Bocanci de protecție antiderapanți',
          'Mănuși de protecție',
          'Vestă reflectorizantă (dacă lucrați pe drumuri publice)'
        ]
      },
      {
        title: '5. Conduită în Situații de Urgență',
        content: [
          'La cădere suspendată în centură: nu panicați, semnalați colegilor, așteptați salvarea',
          'Salvatorii: coborâți victima rapid (sindromul centurii apare după 10-15 min)',
          'La cădere la sol: nu mutați victima, apelați 112, acordați prim ajutor',
          'La prăbușirea schelei: evacuați zona, verificați victimele, anunțați autoritățile',
          'Orice cădere, chiar fără vătămare aparentă, trebuie raportată și verificată medical'
        ]
      }
    ],
    legalBasis: 'Legea 319/2006, HG 1146/2006 art. specific lucru la înălțime, normative ISCIR',
    reviewFrequency: 'Anual sau la introducerea de noi echipamente'
  },

  {
    id: 'ip-electrician-006',
    activity: 'electrician',
    title: 'Instrucțiuni de Securitate și Sănătate în Muncă pentru Electricieni',
    sections: [
      {
        title: '1. Domeniu de Aplicare',
        content: [
          'Prezenta instrucțiune se aplică electricienilor autorizați ANRE care execută lucrări la instalații electrice de joasă și medie tensiune.',
          'Include instalare, întreținere, reparații, verificări ale instalațiilor electrice.'
        ]
      },
      {
        title: '2. Riscuri Identificate',
        content: [
          'Electrocutare — risc vital, de la atingerea conductorilor sub tensiune',
          'Arsuri electrice grave de la arc electric',
          'Electrizare prin atingere indirectă (carcasa metalică)',
          'Incendiu cauzat de scurtcircuit, suprasarcină',
          'Căderi de la înălțime la intervenții pe stâlpi, tablouri înalte',
          'Explozii la lucru în zone cu atmosferă explozivă',
          'Orbire temporară de la arc electric'
        ]
      },
      {
        title: '3. Măsuri de Prevenire Obligatorii',
        content: [
          'Lucrați la instalații DOAR cu autorizare ANRE valabilă pentru nivelul de tensiune',
          'REGULĂ DE AUR: Considerați orice conductor ca fiind sub tensiune până la verificare',
          'Respectați cele 5 reguli de securitate la lucrul fără tensiune:',
          '  1) Decuplați toate sursele de tensiune',
          '  2) Blocați aparatele de separare în poziție deschis (lacăt + etichetă)',
          '  3) Verificați absența tensiunii cu detector',
          '  4) Realizați punere la pământ și scurtcircuitare',
          '  5) Delimitați zona de lucru',
          'La lucrul sub tensiune: folosiți NUMAI scule izolate, mănuși dielectrice testate, covoraș izolant',
          'Nu purtați obiecte metalice (ceasuri, inele, brățări) la lucrul sub tensiune',
          'Verificați echipamentele de protecție înainte de utilizare (mănuși — test vizual, dată de verificare)',
          'La lucrări în tablouri: deschideți ușa tabloul complet, nu vă aplecați cu fața peste bare',
          'Nu lucrați singur la instalații de medie tensiune',
          'Respectați distanțele minime de siguranță față de părțile active'
        ]
      },
      {
        title: '4. Echipament de Protecție Obligatoriu',
        content: [
          'Mănuși dielectrice (clasa 00/0/1 după tensiune) — verificare 6 luni',
          'Bocanci dielectrici sau covoraș izolant',
          'Scule izolate (1000V) — marcaj specific, stare perfectă',
          'Cască de protecție dielectrică',
          'Ochelari de protecție contra arcului electric',
          'Detector de tensiune corespunzător (verificat periodic)',
          'Vestă reflectorizantă pentru lucrări pe domeniul public'
        ]
      },
      {
        title: '5. Conduită în Situații de Urgență',
        content: [
          'La electrocutare: întrerupeți sursa de curent ÎNAINTE de a atinge victima',
          'Dacă nu puteți întrerupe: îndepărtați victima cu material izolant (lemn uscat, franghie)',
          'Începeți imediat resuscitarea cardio-respiratorie dacă este necesar',
          'Apelați 112 și anunțați electrician desemnat / responsabil SSM',
          'La incendiu electric: folosiți stingător CO₂ sau pulbere, NU APĂ',
          'La arsuri electrice: acoperiți cu pansament steril, NU aplicați creme, transportați urgent la spital',
          'Orice accident electric se raportă și se investighează oficial'
        ]
      }
    ],
    legalBasis: 'Legea 319/2006, Normativ ANRE I7/2011, HG 1146/2006, Normativ C 300/2-2016',
    reviewFrequency: 'Anual sau la modificarea instalațiilor'
  },

  {
    id: 'ip-bucatar-007',
    activity: 'bucatar',
    title: 'Instrucțiuni de Securitate și Sănătate în Muncă pentru Bucătari',
    sections: [
      {
        title: '1. Domeniu de Aplicare',
        content: [
          'Prezenta instrucțiune se aplică bucătarilor și personalului de pregătire alimente în bucătării profesionale, cantine, restaurante.',
          'Include prepararea alimentelor, gătirea, utilizarea echipamentelor termice și a cuțitelor.'
        ]
      },
      {
        title: '2. Riscuri Identificate',
        content: [
          'Arsuri de la suprafețe fierbinți (plită, cuptor, tigăi, oale)',
          'Tăieturi de la cuțite, mașini de tocat, blendere',
          'Alunecări și căderi pe suprafețe ude sau unsurate',
          'Incendiu de la ulei supraîncălzit, grasimi aprinse',
          'Frig intens la manipularea produselor congelate',
          'Arsuri de la abur, apă fierbinte, stropi de ulei',
          'Intoxicații alimentare de la manipulare incorectă',
          'Suprasolicitare lombară de la stat în picioare prelungit',
          'Expunere la zgomot (hote, mixere) și căldură excesivă'
        ]
      },
      {
        title: '3. Măsuri de Prevenire Obligatorii',
        content: [
          'Purtați echipament adecvat: uniformă din bumbac, șorț, bonetă, încălțăminte antiderapantă',
          'Mențineți permanent igiena personală: spălați mâinile frecvent, unghii scurte',
          'Folosiți cuțitele corect: tăiați departe de corp, pe placa de tăiere stabilă',
          'Nu lăsați cuțite în chiuvetă sau ascunse sub alte obiecte',
          'Mâneruiți oalele fierbinți cu lavete uscate sau mănuși termice',
          'Nu umpleți oalele până la refuz — lăsați spațiu pentru fierbere',
          'Deschideți capacele oalelor/cuptoarelor înclinând-le departe de față (risc abur)',
          'Nu turnați apă în ulei fierbinte — risc de explozie',
          'La incendiu de ulei: NU folosiți apă — acoperiți vasul cu capac sau stingeți cu pătură',
          'Curățați imediat scurgerile de lichide sau grăsimi de pe podea',
          'Verificați ca mânerele tigăilor/oalelor să fie orientate spre interior (nu atârnând în afară)',
          'Folosiți mașini de tocat DOAR cu dispozitiv de împingere, nu cu mâna',
          'Deconectați aparatele electrice înainte de curățare',
          'Respectați normele HACCP pentru depozitarea și prepararea alimentelor'
        ]
      },
      {
        title: '4. Echipament de Protecție Obligatoriu',
        content: [
          'Uniformă de bucătărie din bumbac (rezistentă termic)',
          'Șorț',
          'Bonetă sau plasa de păr',
          'Încălțăminte de protecție antiderapantă, închisă',
          'Mănuși termice pentru manipularea vaselor fierbinți',
          'Mănuși de protecție la spălat vase (chimicale)'
        ]
      },
      {
        title: '5. Conduită în Situații de Urgență',
        content: [
          'La arsuri: răciți imediat zona cu apă curentă rece 10-15 min, acoperiți cu pansament steril',
          'La arsuri de gradul II-III (bășici): NU spargeți băși, transportați la spital',
          'La tăieturi: opriți sângerarea prin presiune, ridicați membrul, bandajați steril',
          'La incendiu: folosiți stingător CO₂, pătură, capac — NU APĂ pe ulei',
          'La intoxicare alimentară: anunțați medical de companie și DSP imediat',
          'Cunoașteți locația trusa de prim ajutor și stingătoarelor'
        ]
      }
    ],
    legalBasis: 'Legea 319/2006, HG 1091/2006, normele HACCP, Ordinul 119/2014 igiena produselor alimentare',
    reviewFrequency: 'Anual sau la schimbarea echipamentelor'
  },

  {
    id: 'ip-sofer-008',
    activity: 'sofer',
    title: 'Instrucțiuni de Securitate și Sănătate în Muncă pentru Șoferi Profesioniști',
    sections: [
      {
        title: '1. Domeniu de Aplicare',
        content: [
          'Prezenta instrucțiune se aplică șoferilor profesioniști care conduc vehicule de transport marfă sau persoane: camioane, autocare, dubițe, mașini de serviciu.',
          'Include conducerea vehiculului, încărcarea/descărcarea, întreținerea curentă.'
        ]
      },
      {
        title: '2. Riscuri Identificate',
        content: [
          'Accidente rutiere (coliziuni, tamponări, răsturnări)',
          'Oboseală acumulată de la ore prelungite de condus',
          'Probleme de coloană vertebrală de la poziția șezândă prelungită, vibrații',
          'Stres de la trafic intens, presiune termenelor de livrare',
          'Răni la încărcare/descărcare manuală de marfă',
          'Căderi la urcarea/coborârea din cabină',
          'Accidente la manevra reversei fără observator',
          'Incendiu al vehiculului',
          'Atac/jaf la șoferi de marfă valoroasă'
        ]
      },
      {
        title: '3. Măsuri de Prevenire Obligatorii',
        content: [
          'Dețineți permis de conducere și atestat profesional valabil pentru categoria vehiculului',
          'Efectuați verificarea zilnică pre-demraj: anvelope, lumini, frâne, oglinzi, nivel ulei/lichid frână',
          'Ajustați corect scaunul, tetierele, centura de siguranță, oglinzile',
          'Respectați timpii de condus și de odihnă conform Regulament CE 561/2006',
          'Faceți pauză de 15 min la fiecare 2 ore de condus continuu',
          'NU conduceți sub influența alcoolului, drogurilor sau medicamentelor sedative',
          'NU utilizați telefonul mobil fără hands-free în timpul mersului',
          'Respectați limitele de viteză și regulile de circulație',
          'Adaptați viteza la condițiile meteo (ploaie, ceață, gheață, zăpadă)',
          'La încărcare: repartizați marfa uniform, folosiți chingi de fixare, nu depășiți masa maximă admisă',
          'La descărcare: asigurați vehiculul pe frana de mână, folosiți calele, nu staționați pe pante',
          'Nu coborâți din cabină ținându-vă cu fața spre exterior — risc de cădere',
          'Înainte de manevra reversei: coborâți și verificați vizual sau solicitați ajutor de ghidaj',
          'Opriți motorul înainte de alimentare cu carburant — nu fumați',
          'Purtați vestă reflectorizantă la ieșirea din vehicul pe drumuri publice'
        ]
      },
      {
        title: '4. Echipament de Protecție Obligatoriu',
        content: [
          'Centura de siguranță — purtare obligatorie',
          'Vestă reflectorizantă în vehicul',
          'Triunghiuri reflectorizante',
          'Trusă medicală',
          'Stingător auto verificat',
          'Bocanci de protecție (la încărcare/descărcare)',
          'Mănuși de protecție (la manipularea mărfurilor)'
        ]
      },
      {
        title: '5. Conduită în Situații de Urgență',
        content: [
          'La accident rutier: opriți, semnalizați cu avarii și triunghiuri, apelați 112',
          'Acordați prim ajutor victimelor dacă sunteți instruit',
          'Nu mutați victimele decât dacă există pericol iminent (incendiu, explozie)',
          'La incendiu vehicul: opriți motorul, evacuați, folosiți stingătorul, sunați 112',
          'La pană pe autostradă: trageți pe banda de urgență, evacuați pasagerii în spatele parapetului',
          'La atac/jaf: nu opuneți rezistență fizică, anunțați poliția după plecarea atacatorilor',
          'Raportați orice accident sau incident către angajator și asigurator'
        ]
      }
    ],
    legalBasis: 'Legea 319/2006, OUG 195/2002 privind circulația pe drumuri publice, Regulament CE 561/2006',
    reviewFrequency: 'Anual sau la schimbarea categoriei de vehicul'
  },

  {
    id: 'ip-depozit-009',
    activity: 'depozit',
    title: 'Instrucțiuni de Securitate și Sănătate în Muncă pentru Muncitori în Depozite',
    sections: [
      {
        title: '1. Domeniu de Aplicare',
        content: [
          'Prezenta instrucțiune se aplică muncitorilor din depozite care manipulează, stochează și pregătesc mărfuri: recepție, depozitare, picking, expediere.',
          'Include manipulare manuală, utilizare transpalete manuale, organizare stocuri.'
        ]
      },
      {
        title: '2. Riscuri Identificate',
        content: [
          'Accidente cu stivuitoare și transpalete în zonele de circulație',
          'Căderi de obiecte de pe rafturi înalte',
          'Răni la picioare de la căderile coletelor',
          'Dureri lombare de la ridicare incorectă de greutăți',
          'Prinderi între paleți și rafturi',
          'Alunecări, împiedicări de obiecte lăsate în căi de acces',
          'Loviri de ușile batante ale camerelor frigorifice',
          'Hipotermie în depozitele frigorifice'
        ]
      },
      {
        title: '3. Măsuri de Prevenire Obligatorii',
        content: [
          'Purtați echipament de protecție: bocanci de protecție, vestă reflectorizantă',
          'Ridicați greutățile CORECT: îndoiți genunchii, spinarea dreaptă, ridicați cu picioarele',
          'Nu ridicați manual greutăți peste 25 kg — solicitați ajutor sau folosiți transpalet',
          'Verificați stabilitatea paletului înainte de manipulare',
          'Depozitați coletele grele jos, cele ușoare sus',
          'Nu depășiți înălțimea de siguranță a stivelor de paleți (max. 1,80m fără echipament)',
          'Nu vă apropiați de stivuitoare în mișcare — păstrați min. 1m distanță',
          'Respectați căile de circulație marcate — nu traversați pe diagonală',
          'Nu staționați sau opriți sub sarcini suspendate',
          'Verificați că rafturile metalice sunt stabile, fără bare îndoite',
          'Raportați imediat rafturile avariate sau încărcate excesiv',
          'La lucrul în camerele frigorifice: purtați echipament termic, faceți pauze regulate',
          'Mențineți ordinea: nu lăsați obiecte în căile de acces, mutați ambalajele deșeuri',
          'Închideți sertarele dulapurilor după utilizare'
        ]
      },
      {
        title: '4. Echipament de Protecție Obligatoriu',
        content: [
          'Bocanci de protecție cu bombeu metalic',
          'Vestă reflectorizantă',
          'Mănuși de protecție pentru manipulare',
          'Cască de protecție (dacă se lucrează în zone cu stivuitoare)',
          'Echipament termic (jachetă, pantaloni, căciulă) pentru depozite frigorifice'
        ]
      },
      {
        title: '5. Conduită în Situații de Urgență',
        content: [
          'La accident cu stivuitor: opriți traficul, anunțați imediat responsabilul, acordați prim ajutor',
          'La căderea de obiecte de pe raft: evacuați zona, nu vă apropiați, verificați stabilitatea raftului',
          'La blocarea în camera frigorifică: apăsați butonul de alarmă interioară, bateți în ușă',
          'La incendiu: declanșați alarma, evacuați, apelați 112, utilizați stingător dacă este sigur',
          'La accidente: anunțați responsabilul SSM și completați raportul de accident'
        ]
      }
    ],
    legalBasis: 'Legea 319/2006, HG 1091/2006, Normativ manipulare manuală sarcini',
    reviewFrequency: 'Anual sau la modificarea layout-ului depozitului'
  },

  {
    id: 'ip-curatenie-010',
    activity: 'curatenie',
    title: 'Instrucțiuni de Securitate și Sănătate în Muncă pentru Personal de Curățenie',
    sections: [
      {
        title: '1. Domeniu de Aplicare',
        content: [
          'Prezenta instrucțiune se aplică personalului de curățenie care efectuează operații de igienizare, dezinfectare, curățare în clădiri, birouri, spații publice.',
          'Include curățenie generală, spălat geamuri, dezinfecție grupuri sanitare, colectare deșeuri.'
        ]
      },
      {
        title: '2. Riscuri Identificate',
        content: [
          'Iritații, alergii, arsuri chimice de la detergenți puternici',
          'Alunecări, căderi pe suprafețe ude proaspăt spălate',
          'Căderi de la înălțime la curățarea geamurilor înalte',
          'Tăieturi de la sticle sparte, lamele de ras din deșeuri',
          'Intoxicații de la amestecarea incorectă a substanțelor chimice (ex: clor + amoniac)',
          'Contactul cu deșeuri biologice, contaminare',
          'Dureri lombare de la manipularea găleților, mochetelor umede',
          'Electrocutare de la aspiratoare, mașini de spălat defecte'
        ]
      },
      {
        title: '3. Măsuri de Prevenire Obligatorii',
        content: [
          'Purtați echipament de protecție: mănuși de cauciuc rezistente, șorț impermeabil',
          'Citiți etichetele produselor chimice înainte de utilizare — respectați instrucțiunile',
          'NU amestecați niciodată produse de curățenie (risc de reacții chimice periculoase)',
          'Diluați detergenții concentrați conform instrucțiunilor — nu folosiți concentrați puri',
          'Asigurați ventilație adecvată la utilizarea produselor cu miros puternic',
          'Semnalizați zonele umede cu indicatoare "Atenție — podea udă"',
          'Nu lăsați găleile sau furtunurile în căile de acces',
          'La spălatul geamurilor la înălțime: folosiți scară stabilă sau platformă — nu vă aplecați excesiv',
          'Purtați mănuși rezistente la colectarea deșeurilor — atenție la obiecte ascuțite',
          'La curățarea grupurilor sanitare: folosiți mănuși suplimentare și dezinfectați-vă după',
          'Verificați cablurile electrice ale aspiratoarelor — nu folosiți dacă sunt deteriorate',
          'La manipularea deșeurilor biologice (spitale): folosiți mănuși + mască',
          'Depozitați produsele chimice în spații dedicate, etichetate, la temperatură adecvată'
        ]
      },
      {
        title: '4. Echipament de Protecție Obligatoriu',
        content: [
          'Mănuși de protecție chimică (cauciuc/nitril)',
          'Șorț impermeabil',
          'Încălțăminte antiderapantă, impermeabilă',
          'Ochelari de protecție (la utilizarea substanțelor corosive)',
          'Mască de protecție (la pulverizarea dezinfectanților)',
          'Echipament suplimentar pentru deșeuri biologice (halat, mască FFP2)'
        ]
      },
      {
        title: '5. Conduită în Situații de Urgență',
        content: [
          'La contact cu chimicale pe piele: spălați imediat cu apă abundentă 15 min',
          'La contact cu ochii: clătiți cu apă curentă 15 min, consultați medic',
          'La inhalarea vaporilor toxici: ieșiți la aer curat, anunțați medicul',
          'La intoxicare: apelați 112, păstrați eticheta produsului pentru medici',
          'La tăieturi: curățați rana, aplicați pansament steril, verificați necesitatea antitetanos',
          'La electrocutare: întrerupeți curentul, apoi acordați ajutor',
          'Raportați orice incident responsabilului SSM'
        ]
      }
    ],
    legalBasis: 'Legea 319/2006, HG 1091/2006, Regulamentul CLP pentru substanțe chimice',
    reviewFrequency: 'Anual sau la introducerea de noi produse chimice'
  },

  {
    id: 'ip-laborator-011',
    activity: 'laborator',
    title: 'Instrucțiuni de Securitate și Sănătate în Muncă pentru Personal de Laborator',
    sections: [
      {
        title: '1. Domeniu de Aplicare',
        content: [
          'Prezenta instrucțiune se aplică personalului de laborator (analiști, tehnicieni) care lucrează cu substanțe chimice, reactivi, soluții, echipamente de laborator.',
          'Include manipularea reactivi, prepararea soluțiilor, analize chimice, fizice, biologice.'
        ]
      },
      {
        title: '2. Riscuri Identificate',
        content: [
          'Arsuri chimice de la acizi, baze concentrate',
          'Intoxicații de la inhalarea vaporilor toxici',
          'Incendiu/explozie la substanțe inflamabile (solvenți, gaze)',
          'Contactul cu substanțe cancerigene, mutagene',
          'Spargerea sticlăriei — tăieturi, stropi de reactivi',
          'Contactul cu agenți biologici patogeni (în laborator microbiologie)',
          'Electrocutare de la echipamente defecte',
          'Expunere la radiații (în laboratoare specializate)'
        ]
      },
      {
        title: '3. Măsuri de Prevenire Obligatorii',
        content: [
          'Cunoașteți fișele de securitate (FDS) ale substanțelor cu care lucrați',
          'Purtați PERMANENT halat de laborator din bumbac (manșete lungi), ochelari, mănuși',
          'Nu mâncați, nu beți, nu fumați în laborator',
          'Nu pipetați niciodată cu gura — folosiți pompete',
          'Lucrați sub nișă de exhaustare la manipularea substanțelor volatile/toxice',
          'Etichetați TOATE recipientele cu conținutul, data, numele operatorului',
          'Depozitați substanțele incompatibile separat (acizi ≠ baze, oxidanți ≠ combustibili)',
          'Turnați acidul ÎN APĂ, niciodată invers (risc de fierbere violentă)',
          'La spargerea sticlăriei: nu ridicați cioburile cu mâna — folosiți perie+făraș',
          'Verificați sticla de laborator înainte de utilizare — nu folosiți dacă are fisuri',
          'Nu încălziți lichide inflamabile la flacără deschisă — folosiți baie de apă/ulei',
          'Păstrați solvenții inflamabili în dulapuri metalice speciale, cantități mici',
          'Eliminați deșeurile chimice DOAR în recipientele destinate — nu în chiuvetă',
          'Spălați-vă pe mâini după fiecare manipulare și obligatoriu înainte de a părăsi laboratorul'
        ]
      },
      {
        title: '4. Echipament de Protecție Obligatoriu',
        content: [
          'Halat de laborator din bumbac (manșete lungi, butonată)',
          'Ochelari de protecție chimică (laterale închise)',
          'Mănuși de protecție adecvate substanței (nitril, latex, neopren)',
          'Mască de protecție (FFP2/FFP3 pentru prafuri toxice)',
          'Ecran facial transparent (la risc de proiecții)',
          'Încălțăminte închisă (nu sandale sau pantofi deschiși)'
        ]
      },
      {
        title: '5. Conduită în Situații de Urgență',
        content: [
          'La contact cu chimicale pe piele: spălați 15 min sub duș de urgență',
          'La contact cu ochii: clătiți 15 min la spălător de ochi, consultați medic',
          'La stropi acizi/baze: neutralizați cu bicarbonat/acid slab, apoi spălați',
          'La incendiu: evacuați, declanșați alarma, folosiți stingător CO₂/pulbere, sunați 112',
          'La varsări de chimicale: delimitați zona, absorbiti cu material inert, ventilați',
          'La intoxicare: scoateți victima la aer, apelați 112, păstrați eticheta substanței',
          'Cunoscți locația: duș de urgență, spălător de ochi, stingătoare, kit de absorbție'
        ]
      }
    ],
    legalBasis: 'Legea 319/2006, HG 1091/2006, Regulamentul CLP, HG 857/2011 agenți chimici',
    reviewFrequency: 'Anual sau la introducerea de noi substanțe/procedee'
  },

  {
    id: 'ip-agricultura-012',
    activity: 'agricultura',
    title: 'Instrucțiuni de Securitate și Sănătate în Muncă pentru Muncitori Agricoli',
    sections: [
      {
        title: '1. Domeniu de Aplicare',
        content: [
          'Prezenta instrucțiune se aplică muncitorilor agricoli care desfășoară activități în câmp: lucrări de cultivare, întreținere culturi, recoltare, aplicare tratamente fitosanitare.',
          'Include utilizarea uneltelor manuale, mașinilor agricole simple (necertificate ISCIR).'
        ]
      },
      {
        title: '2. Riscuri Identificate',
        content: [
          'Expunere prelungită la soare — insolații, arsuri solare',
          'Mușcături de șerpi, insecte, animale sălbatice',
          'Intoxicații de la pesticide, ierbicide, fungicide',
          'Tăieturi de la seceri, coase, cuțite',
          'Accidente cu mașini agricole (tractoare, combinări)',
          'Zgârieturi, înțepături de la plante cu spini',
          'Reacții alergice la polen, plante, praful vegetal',
          'Suprasolicitare fizică — dureri lombare, crampe'
        ]
      },
      {
        title: '3. Măsuri de Prevenire Obligatorii',
        content: [
          'Purtați echipament adecvat: pălărie cu boruri largi, îmbrăcăminte lungă, mănuși',
          'Folosiți protecție solară (cremă SPF 30+) pe zonele expuse',
          'Hidratați-vă frecvent — beți apă la fiecare oră',
          'Faceți pauze la umbră în orele foarte calde (12:00-16:00)',
          'Verificați terenul înainte de a începe lucrul — atenție la șerpi, insecte',
          'Purtați cizme înalte în zone cu vegetație deasă',
          'La aplicarea pesticidelor: purtați echipament complet (combinezon, mască, mănuși rezistente chimice)',
          'Respectați termenul de pauză după tratamente — nu intrați în cultură în perioada specificată',
          'Păstrați pesticidele în ambalaje originale, etichetate, departe de alimente',
          'Spălați-vă pe mâini și pe față după contact cu pesticide',
          'Utilizați unelte ascuțite corect întreținute — unelte tocite cresc riscul de accident',
          'Nu vă apropiați de mașinile agricole în funcțiune',
          'La semnale de oboseală extremă sau amețeli: opriți lucrul, anunțați responsabilul'
        ]
      },
      {
        title: '4. Echipament de Protecție Obligatoriu',
        content: [
          'Pălărie cu boruri largi sau șapcă legionară',
          'Îmbrăcăminte lungă din bumbac (cămașă, pantaloni lungi)',
          'Cizme de protecție sau bocanci',
          'Mănuși de protecție mecanică',
          'Ochelari de soare (protecție UV)',
          'Pentru pesticide: combinezon impermeabil, mască cu filtre, mănuși rezistente chimice'
        ]
      },
      {
        title: '5. Conduită în Situații de Urgență',
        content: [
          'La insolație: duceți victima la umbră, răciți-o cu apă, hidrați, apelați 112',
          'La mușcături de șarpe: imobilizați membrul, nu aplicați garou, transportați urgent la spital',
          'La intoxicare cu pesticide: îndepărtați victima de sursă, spălați pielea, apelați 112, prezentați eticheta',
          'La tăieturi: opriți sângerarea prin presiune, curățați cu apă, bandajați steril',
          'La reacții alergice severe (gât umflat, dificultate respirație): apelați 112 imediat',
          'Aveți la dispoziție trusă de prim ajutor și apă potabilă în teren'
        ]
      }
    ],
    legalBasis: 'Legea 319/2006, HG 1091/2006, Legea 256/2018 produse fitosanitare',
    reviewFrequency: 'Anual sau la introducerea de noi pesticide/tehnologii'
  },

  {
    id: 'ip-vopsitor-013',
    activity: 'vopsitor',
    title: 'Instrucțiuni de Securitate și Sănătate în Muncă pentru Vopsitori',
    sections: [
      {
        title: '1. Domeniu de Aplicare',
        content: [
          'Prezenta instrucțiune se aplică vopsitorilor care efectuează lucrări de vopsire industrială, auto, construcții: pregătire suprafețe, aplicare vopsea cu pensula/rola/pistol.',
          'Include prepararea vopselelor, diluare, curățare echipamente.'
        ]
      },
      {
        title: '2. Riscuri Identificate',
        content: [
          'Intoxicații de la inhalarea vaporilor de solvenți (toluen, acetonă, white spirit)',
          'Iritații ale pielii și ochilor de la contact cu vopsele, diluanți',
          'Incendiu/explozie de la vapori inflamabili în spații închise',
          'Alergii, dermatite de la componente chimice',
          'Căderi de la înălțime la vopsirea fațadelor, tavanelor',
          'Expunere la plumb (vopsele vechi, renovări)',
          'Oboseală vizuală, dureri lombare de la poziții incomode',
          'Accidente cu echipamente sub presiune (pistoale de vopsit)'
        ]
      },
      {
        title: '3. Măsuri de Prevenire Obligatorii',
        content: [
          'Citiți fișa de securitate a vopselei înainte de utilizare',
          'Lucrați DOAR în spații bine ventilate sau sub exhaustare forțată',
          'Purtați echipament de protecție: mască cu filtre A1P2, mănuși rezistente chimice, ochelari',
          'La vopsirea în cabină închisă: folosiți semimasca/masca cu filtru corespunzător',
          'Nu fumați și nu apropiați flăcări deschise de zona de vopsire',
          'Păstrați cantități mici de vopsea/diluant la locul de lucru — restul în depozit special',
          'Închideți bine recipientele de vopsea după utilizare',
          'La prepararea vopselei: turnați diluantul ÎN vopsea, amestecați încet (evitați scântei statice)',
          'Verificați pistoalele de vopsit înainte de utilizare — furtunurile să fie intacte',
          'Nu îndreptați niciodată pistoalele spre persoane',
          'La vopsirea la înălțime: folosiți schelă stabilă sau platformă, nu improvizați',
          'Protejați-vă mâinile cu cremă de barieră înainte de lucru',
          'Spălați-vă pe mâini cu apă și săpun, NU cu solvenți',
          'Eliminați deșeurile (recipiente, cârpe îmbibate) în containere metalice închise'
        ]
      },
      {
        title: '4. Echipament de Protecție Obligatoriu',
        content: [
          'Mască de protecție respiratorie cu filtre A1P2 (vapori organici + particule)',
          'Ochelari de protecție',
          'Mănuși de protecție rezistente chimice (nitril)',
          'Combinezon de protecție din material respirant',
          'Bocanci de protecție',
          'Cască de protecție (la lucrul la înălțime)'
        ]
      },
      {
        title: '5. Conduită în Situații de Urgență',
        content: [
          'La intoxicare cu solvenți: duceți victima la aer curat, slăbiți hainele, apelați 112',
          'La contact cu pielea: spălați imediat cu apă și săpun, îndepărtați hainele contaminate',
          'La contact cu ochii: clătiți 15 min cu apă curentă, consultați medic',
          'La incendiu: evacuați, folosiți stingător CO₂/pulbere, NU APĂ, sunați 112',
          'La varsări de vopsea: ventilați, absorbiti cu material inert, colectați ca deșeu periculos',
          'Cunoașteți locația stingătoarelor, dușului de urgență, ieșirilor de urgență'
        ]
      }
    ],
    legalBasis: 'Legea 319/2006, HG 1091/2006, HG 857/2011 agenți chimici, Regulament CLP',
    reviewFrequency: 'Anual sau la schimbarea tipului de vopsea/tehnologie'
  },

  {
    id: 'ip-tamplar-014',
    activity: 'tamplar',
    title: 'Instrucțiuni de Securitate și Sănătate în Muncă pentru Tâmplari',
    sections: [
      {
        title: '1. Domeniu de Aplicare',
        content: [
          'Prezenta instrucțiune se aplică tâmplarilor care prelucrează lemnul: debitare, rindeluire, frezare, asamblare mobilier, montaj ferestre/uși.',
          'Include utilizarea mașinilor de tâmplărie: ferăstrău circular, abricht, rindea electrică, freza.'
        ]
      },
      {
        title: '2. Riscuri Identificate',
        content: [
          'Tăieturi grave, amputări de la ferăstraie circulare, freze',
          'Proiecții de așchii, rumeguș în ochi',
          'Prins, antrenare a mâinilor/hainelor de axele în rotație',
          'Zgomot intens de la mașini — leziuni auditive',
          'Expunere la praf de lemn — alergii, afecțiuni respiratorii',
          'Electrocutare de la mașini defecte',
          'Incendiu de la așchii, rumeguș acumulat + scânteie',
          'Dureri lombare de la manipularea plăcilor grele'
        ]
      },
      {
        title: '3. Măsuri de Prevenire Obligatorii',
        content: [
          'Folosiți mașinile DOAR după instruire specifică — cunoașteți funcționarea lor',
          'Verificați înainte de pornire: protecțiile sunt montate, lama nu are crăpături, cablurile sunt intacte',
          'Purtați echipament de protecție: ochelari, căști antifoncizie, mască praf',
          'Nu purtați mănuși la lucrul cu mașini rotative (risc de prindere)',
          'Nu purtați îmbrăcăminte largă, cravate, bijuterii — pot fi prinse',
          'Părul lung trebuie prins sub căciulă/bandană',
          'La ferăstrăul circular: folosiți împingător pentru piese scurte, NU mâna',
          'Nu îndepărtați niciodată protecțiile de pe mașini',
          'Așteptați oprirea completă a lamei înainte de a atinge piesa sau de a curăța',
          'Nu folosiți aer comprimat pentru curățarea hainelor — risc de proiecții în ochi',
          'Asigurați aspirație la fiecare mașină pentru colectarea prafului',
          'Mențineți ordinea: evacuați rumegușul frecvent (risc incendiu)',
          'La manipularea plăcilor PAL mari: solicitați ajutor sau folosiți cărucior',
          'Deconectați mașina de la curent înainte de întreținere sau schimbarea lamelor'
        ]
      },
      {
        title: '4. Echipament de Protecție Obligatoriu',
        content: [
          'Ochelari de protecție (obligatoriu la toate operațiile)',
          'Căști de protecție antifonică sau dopuri de urechi',
          'Mască de protecție respiratorie FFP2 pentru praf de lemn',
          'Bocanci de protecție',
          'Șorț de lucru din material rezistent',
          'NU mănuși la lucrul cu mașini rotative'
        ]
      },
      {
        title: '5. Conduită în Situații de Urgență',
        content: [
          'La tăieturi grave: apăsați ferm pe rană pentru a opri sângerarea, apelați 112',
          'La amputare: păstrați membrul tăiat în pungă sterilă + gheață, transportați urgent la spital',
          'La proiecții în ochi: NU frecați, clătiți cu apă, consultați medic imediat',
          'La electrocutare: întrerupeți curentul, apoi acordați ajutor',
          'La incendiu: folosiți stingător pulbere/CO₂, evacuați, sunați 112',
          'Cunoașteți locația trusa de prim ajutor, stingătoarelor, butonului de oprire de urgență'
        ]
      }
    ],
    legalBasis: 'Legea 319/2006, HG 1091/2006, HG 493/2006 cerințe minime pentru echipamente de lucru',
    reviewFrequency: 'Anual sau la achiziția de noi mașini'
  },

  {
    id: 'ip-mecanic-015',
    activity: 'mecanic',
    title: 'Instrucțiuni de Securitate și Sănătate în Muncă pentru Mecanici Auto/Utilaje',
    sections: [
      {
        title: '1. Domeniu de Aplicare',
        content: [
          'Prezenta instrucțiune se aplică mecanicilor care efectuează întreținere și reparații la autovehicule, utilaje, mașini: diagnoza, reparații motor, suspensie, frâne, transmisie.',
          'Include ridicarea vehiculelor, sudare, spălare piese cu solvenți.'
        ]
      },
      {
        title: '2. Riscuri Identificate',
        content: [
          'Striviri de la căderea vehiculelor de pe cricuri, elevatoare',
          'Arsuri de la componentele fierbinți (motor, eșapament, lichid răcire)',
          'Electrocutare la vehiculele electrice/hibride',
          'Intoxicații de la gaze de eșapament (CO) în spații închise',
          'Iritații de la contact cu uleiuri, solvenți, lichide de frână',
          'Tăieturi de la table ascuțite, scule',
          'Proiecții de lichide sub presiune (ulei hidraulic, lichid frână)',
          'Incendiu de la scurgeri de carburant, scântei de sudură',
          'Explozii de baterii (hidrogen), pneuri suprapresate'
        ]
      },
      {
        title: '3. Măsuri de Prevenire Obligatorii',
        content: [
          'La ridicarea vehiculului: folosiți cric hidraulic + OBLIGATORIU capiști de siguranță',
          'Nu vă introduceți niciodată sub vehicul susținut doar pe cric',
          'Verificați elevatorul înainte de utilizare — testați blocarea',
          'La lucrul la motorul cald: lăsați să se răcească, deschideți capacul radiatorului cu precauție (risc de abur)',
          'La vehicule electrice/hibride: deconectați bateria HV, urmați procedura specifică, folosiți mănuși dielectrice',
          'Nu porniți motorul în spații închise fără evacuare gazelor de eșapament',
          'Purtați mănuși de protecție la manipularea uleiului, bateriilor',
          'Curățați imediat scurgerile de ulei/carburant de pe podea (risc alunecare + incendiu)',
          'La spălarea pieselor cu solvent: lucrați în zonă ventilată, nu apropiați flăcări',
          'La sudare: îndepărtați materialele combustibile, verificați absența scurgerilor de carburant',
          'La umflarea anvelopelor: folosiți cușcă de protecție sau coloană, nu depășiți presiunea recomandată',
          'La scoaterea bateriilor: evitați scurtcircuitele, purtați ochelari (risc de explozie hidrogen)',
          'Nu purtați inele, brățări metalice — risc de scurtcircuit, prindere',
          'Spălați-vă pe mâini după contact cu uleiuri, solvenți'
        ]
      },
      {
        title: '4. Echipament de Protecție Obligatoriu',
        content: [
          'Bocanci de protecție',
          'Mănuși de protecție mecanică (și chimică pentru solvenți)',
          'Ochelari de protecție',
          'Salopetă de lucru din bumbac',
          'Mănuși dielectrice pentru vehicule electrice',
          'Cască de protecție (în service cu vehicule ridicate)'
        ]
      },
      {
        title: '5. Conduită în Situații de Urgență',
        content: [
          'La căderea vehiculului: nu încercați să opriți căderea, trageți victima rapid din zona de strivire',
          'La striviri: apelați 112, nu mutați victima, asigurați respiraţia',
          'La arsuri: răciți cu apă rece 10-15 min, acoperiți cu pansament steril',
          'La electrocutare: deconectați sursa, apoi acordați ajutor, apelați 112',
          'La intoxicație cu CO: evacuați victima la aer, ventilați, apelați 112',
          'La incendiu: folosiți stingător pulbere/CO₂, NU APĂ pe lichide inflamabile',
          'La contact cu acizi de baterie: spălați abundent cu apă, neutralizați cu bicarbonat'
        ]
      }
    ],
    legalBasis: 'Legea 319/2006, HG 1091/2006, HG 493/2006, Normativ RENAR service auto',
    reviewFrequency: 'Anual sau la introducerea de noi tehnologii (ex: vehicule electrice)'
  }
];

/**
 * Funcție helper pentru a obține un model de instrucțiune după ID
 */
export function getInstructiuneProprieById(id: string): InstructiuneProprie | undefined {
  return instructiuniPropriiModele.find(instructiune => instructiune.id === id);
}

/**
 * Funcție helper pentru a obține toate modelele pentru o anumită activitate
 */
export function getInstructiuniPropriiByActivity(activity: string): InstructiuneProprie[] {
  return instructiuniPropriiModele.filter(instructiune => instructiune.activity === activity);
}

/**
 * Funcție helper pentru a obține lista tuturor activităților disponibile
 */
export function getAllActivities(): string[] {
  return Array.from(new Set(instructiuniPropriiModele.map(i => i.activity)));
}
