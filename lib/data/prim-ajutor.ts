/**
 * Proceduri de prim ajutor esențiale
 * Date utilizate pentru modulul de training și situații de urgență
 */

export interface PrimAjutorProcedure {
  id: string;
  title: string;
  scenario: string;
  steps: string[];
  doNotDo: string[];
  callEmergency: boolean;
  requiredKit: string[];
}

export const primAjutorProcedures: PrimAjutorProcedure[] = [
  {
    id: 'arsura',
    title: 'Arsură termică',
    scenario: 'Persoana a suferit o arsură de gradul I-III (roșeață, vezicule sau leziuni profunde)',
    steps: [
      'Îndepărtează sursa de căldură și persoana din zona periculoasă',
      'Răcește zona arsă cu apă rece curentă timp de 10-20 minute',
      'Îndepărtează bijuteriile și hainele necoapte de piele (dacă nu sunt lipite)',
      'Acoperă arsura cu un pansament steril sau folie alimentară curată',
      'Nu aplica creme, unguente sau substanțe pe arsură',
      'Monitorizează victima pentru semne de șoc',
      'Solicită ajutor medical pentru arsuri extinse sau de grad II-III'
    ],
    doNotDo: [
      'Nu aplica gheață direct pe arsură',
      'Nu sparge veziculele',
      'Nu aplica paste de dinți, ulei sau alte remedii casnice',
      'Nu îndepărta hainele lipite de piele',
      'Nu folosi vată direct pe rană'
    ],
    callEmergency: true,
    requiredKit: [
      'Comprese sterile',
      'Folie de protecție',
      'Bandaj',
      'Mănuși de protecție'
    ]
  },
  {
    id: 'electrocutare',
    title: 'Electrocutare',
    scenario: 'Persoana a intrat în contact cu o sursă electrică și poate avea arsuri sau stop cardiac',
    steps: [
      'NU atinge victima dacă este încă în contact cu sursa electrică',
      'Întrerupe sursa de curent (deconectează de la priză/tablou)',
      'Dacă nu poți întrerupe curentul, îndepărtează victima cu un obiect uscat izolant (lemn, plastic)',
      'Verifică conștientizarea, respirația și pulsul',
      'Dacă victima nu respiră, începe resuscitarea cardio-respiratorie (RCP)',
      'Tratează arsurile electrice ca arsuri grave',
      'Sună imediat 112, chiar dacă victima pare OK',
      'Monitorizează până la sosirea ambulanței (pot apărea complicații)\'
    ],
    doNotDo: [
      'Nu atinge victima în timp ce este în contact cu curentul',
      'Nu folosești obiecte metalice sau umede pentru a muta victima',
      'Nu presupune că victima este în siguranță după ce își revine'
    ],
    callEmergency: true,
    requiredKit: [
      'Mănuși izolante',
      'Comprese sterile pentru arsuri',
      'DEA (Defibrilator Extern Automat) dacă este disponibil'
    ]
  },
  {
    id: 'cadere-traumatism-cranio-cerebral',
    title: 'Cădere cu traumatism cranio-cerebral',
    scenario: 'Persoana a căzut și s-a lovit la cap, prezintă confuzie, greață sau pierdere de conștiință',
    steps: [
      'Nu mișca victima dacă suspectezi leziune la coloană vertebrală',
      'Sună imediat 112 dacă există pierdere de conștiință, vomă sau convulsii',
      'Imobilizează capul și gâtul în poziția găsită',
      'Monitorizează respirația și starea de conștiință',
      'Dacă victima vomită, întoarce-o pe o parte (EN-BLOC, cu cap și corp)',
      'Aplică compresia ușoară cu cârpă curată pe eventualele răni care sângerează',
      'Nu da apă, mâncare sau medicamente',
      'Ține victima calmă și la căldură până sosește ambulanța'
    ],
    doNotDo: [
      'Nu ridica victima în poziție șezândă',
      'Nu îndepărta obiectele înfipte în cap',
      'Nu aplica presiune directă pe fracturi vizibile ale craniului',
      'Nu lăsa victima să adoarmă în primele ore'
    ],
    callEmergency: true,
    requiredKit: [
      'Guler cervical (dacă este disponibil)',
      'Comprese sterile',
      'Pătură pentru protecție termică',
      'Mănuși de protecție'
    ]
  },
  {
    id: 'taietura-hemoragie',
    title: 'Tăietură profundă cu hemoragie',
    scenario: 'Persoana are o tăietură profundă care sângerează abundent',
    steps: [
      'Pune mănuși de protecție înainte de a trata rana',
      'Așează victima în poziție comodă și calmează-o',
      'Aplică presiune directă fermă pe rană cu o compresă sterilă sau cârpă curată',
      'Ridică membrul lezat deasupra nivelului inimii (dacă nu există suspiciune de fractură)',
      'Dacă sângele pătrunde prin compresă, adaugă altele peste (nu îndepărta prima)',
      'Bandajează ferm dar nu prea strâns (verifică circulația)',
      'Dacă sângerarea nu se oprește după 10 minute de presiune, sună 112',
      'Monitorizează victima pentru semne de șoc'
    ],
    doNotDo: [
      'Nu îndepărta obiecte mari înfipte în rană',
      'Nu aplica garou decât în cazuri extreme de hemoragie la membre',
      'Nu spăla răni adânci sau cu hemoragie activă',
      'Nu întrerupe presiunea în primele minute'
    ],
    callEmergency: true,
    requiredKit: [
      'Mănuși de protecție',
      'Comprese sterile',
      'Bandaj',
      'Garou (doar pentru cazuri extreme)',
      'Soluție salină pentru irigare'
    ]
  },
  {
    id: 'intoxicatie',
    title: 'Intoxicație (inhalare, ingerare, contact)',
    scenario: 'Persoana a fost expusă la substanțe toxice (chimicale, medicamente, gaze)',
    steps: [
      'Asigură siguranța ta — nu intra în zona contaminată fără protecție',
      'Îndepărtează victima din zona toxică la aer curat',
      'Sună imediat 112 și INSP (Centrul Național Antiintoxicații: 021.318.36.06)',
      'Identifică substanța toxică (etichetă, recipient) și păstrează-o pentru echipa medicală',
      'Dacă substanța este pe piele, îndepărtează hainele contaminate și spală cu apă abundentă',
      'Dacă substanța a fost ingerată, NU provoca vărsături (decât la indicația medicului)',
      'Dacă victima este inconștientă, poziționează-o pe o parte',
      'Monitorizează respirația și pulsul până la sosirea ajutorului'
    ],
    doNotDo: [
      'Nu provoca vărsături fără indicație medicală (substanțele corozive pot cauza daune)',
      'Nu da apă sau lapte fără indicație medicală',
      'Nu neutraliza substanțe chimice (poți agrava leziunile)',
      'Nu intra în spații închise cu vapori toxici fără echipament de protecție'
    ],
    callEmergency: true,
    requiredKit: [
      'Mănuși rezistente la chimicale',
      'Apă pentru spălare',
      'Masca de protecție respiratorie',
      'Pături pentru protecție',
      'Cărbune activat (doar la indicația medicului)'
    ]
  },
  {
    id: 'fractura',
    title: 'Fractură (osoasă)',
    scenario: 'Persoana prezintă durere severă, deformare, umflătură și imposibilitate de mișcare a unui membru',
    steps: [
      'Nu mișca victima dacă suspectezi fractură de coloană vertebrală sau bazin',
      'Imobilizează membrul în poziția găsită (nu încerca să „repui" osul)',
      'Folosește atele rigide (planșete, carton) fixate cu bandaje deasupra și dedesubt de fractură',
      'Verifică circulația (puls, căldură, culoare) sub zona imobilizată',
      'Aplică gheață învelită în material textil pentru reducerea umflăturii (10 min cu pauze)',
      'Ridică ușor membrul pentru reducerea edemului (dacă nu există contraindicații)',
      'Tratează victima pentru șoc (poziție comodă, păstrarea căldurii)',
      'Solicită transport medical specializat'
    ],
    doNotDo: [
      'Nu încerca să repui osul în loc',
      'Nu aplica presiune pe zona fracturii',
      'Nu da mâncare sau băuturi (poate fi necesară intervenție chirurgicală)',
      'Nu îndepărta hainele printr-o smulgere (taie-le dacă este necesar)'
    ],
    callEmergency: true,
    requiredKit: [
      'Atele de imobilizare',
      'Bandaje triunghiulare',
      'Comprese',
      'Gheață (comprese reci)',
      'Mănuși de protecție'
    ]
  },
  {
    id: 'stop-cardiac',
    title: 'Stop cardio-respirator',
    scenario: 'Persoana este inconștientă, nu respiră sau respiră anormal (gâfâie) și nu are puls',
    steps: [
      'Verifică siguranța scenei, apoi verifică reactivitatea victimei (strigă și scutură ușor)',
      'Sună imediat 112 sau cere altcuiva să o facă',
      'Deschide căile respiratorii (hiperextensie cap, ridică bărbie)',
      'Începe compresiile toracice: 30 de compresii (ritm 100-120/min, adâncime 5-6 cm)',
      'Efectuează 2 ventilații (dacă ești instruit și echipat), apoi continuă 30:2',
      'Dacă este disponibil DEA (defibrilator), pune-l în funcțiune și urmează instrucțiunile',
      'Continuă RCP fără întreruperi până la sosirea ambulanței sau până victima își revine',
      'Dacă nu ești instruit pentru ventilații, fă doar compresii continue'
    ],
    doNotDo: [
      'Nu întrerupe compresiile mai mult de 10 secunde',
      'Nu aplica compresii prea superficial (sub 5 cm adâncime)',
      'Nu abandona resuscitarea până nu sosește ajutor calificat',
      'Nu folosi DEA pe suprafețe umede sau metalice fără a usca zonele'
    ],
    callEmergency: true,
    requiredKit: [
      'DEA (Defibrilator Extern Automat)',
      'Mască de resuscitare cu supapă unidirecțională',
      'Mănuși de protecție',
      'Foarfece pentru a tăia hainele'
    ]
  },
  {
    id: 'lesin',
    title: 'Leșin (sincopă)',
    scenario: 'Persoana a leșinat brusc și a căzut la pământ, apoi își revine în câteva secunde',
    steps: [
      'Verifică siguranța și răspunsul victimei',
      'Poziționează victima pe spate cu picioarele ridicate 20-30 cm (poziție Trendelenburg)',
      'Asigură aerisire corespunzătoare (deschide ferestre, slăbește haine strânse)',
      'Nu da apă sau mâncare până victima nu este pe deplin conștientă',
      'Monitorizează respirația și pulsul',
      'Dacă victima își revine rapid, lasă-o să se ridice treptat (șezând câteva minute)',
      'Dacă leșinul durează mai mult de 1-2 minute, sună 112',
      'Investighează cauza (căldură, deshidratare, hipoglicemie, emoții)'
    ],
    doNotDo: [
      'Nu da apă victimei inconștiente (risc de sufocare)',
      'Nu lăsa victima să se ridice brusc în picioare',
      'Nu trage victima de haine sau brațe pentru a o ridica',
      'Nu neglija leșinul la persoane cu istoric cardiac sau diabet'
    ],
    callEmergency: false,
    requiredKit: [
      'Pătură sau pernă pentru confort',
      'Apă (după revenire completă)',
      'Glucometru (dacă victima este diabetică)'
    ]
  },
  {
    id: 'corp-strain-ochi',
    title: 'Corp străin în ochi',
    scenario: 'Persoana are un corp străin (praf, așchie, insectă) în ochi și prezintă disconfort, lăcrimare sau durere',
    steps: [
      'Nu freca ochiul afectat',
      'Spală-te pe mâini sau pune mănuși înainte de a examina',
      'Încurajează victima să clipească de mai multe ori (lăcrimile pot elimina corpul)',
      'Dacă corpul este vizibil pe suprafața albă a ochiului sau pe pleoapa inferioară, îndepărtează-l cu colțul unei comprese sterile umede',
      'Clătește ochiul cu apă curată sau ser fiziologic (3-5 minute)',
      'Dacă corpul este înfipt sau se află pe iris/cornee, acoperă ochiul cu o compresă sterilă și mergi la medic',
      'Nu încerca să îndepărtezi obiecte înfipte sau lipite de suprafața ochiului',
      'Solicită ajutor medical pentru corpi străini metalici sau dacă durerea persistă'
    ],
    doNotDo: [
      'Nu freca ochiul',
      'Nu folosi pensete sau unelte ascuțite pentru a îndepărta corpul străin',
      'Nu îndepărta obiecte înfipte în glob ocular',
      'Nu aplica presiune pe ochiul afectat'
    ],
    callEmergency: false,
    requiredKit: [
      'Ser fiziologic sau apă sterilă',
      'Comprese sterile',
      'Mănuși de protecție',
      'Bandă adezivă sau bandaj pentru acoperirea ochiului',
      'Cană oftalmică (pentru spălare)'
    ]
  },
  {
    id: 'soc-anafilactic',
    title: 'Șoc anafilactic (reacție alergică severă)',
    scenario: 'Persoana prezintă reacție alergică severă (înțepătură, aliment, medicament): umflături, dificultăți de respirație, urticarie generalizată',
    steps: [
      'Recunoaște semnele: dificultăți de respirație, umflare a feței/gâtului, urticarie, greață, scăderea tensiunii',
      'Sună imediat 112 — șocul anafilactic este o urgență vitală',
      'Administrează ADRENALINĂ (EpiPen) dacă victima o are prescrisă — inject în mușchiul coapsei',
      'Poziționează victima întinsă pe spate cu picioarele ridicate (dacă nu are dificultăți respiratorii)',
      'Dacă victima are dificultăți de respirație, lasă-o în poziție semi-șezută',
      'Monitorizează respirația și circulația continuu',
      'Fii pregătit să efectuezi RCP dacă este necesar',
      'Pregătește a doua doză de adrenalină (dacă este disponibilă) — poate fi administrată după 5-15 minute'
    ],
    doNotDo: [
      'Nu aștepta să vezi dacă simptomele se ameliorează singure',
      'Nu da medicamente pe cale orală victimei care are dificultăți de înghițire',
      'Nu poziționează victima în poziție care îngreunează respirația',
      'Nu întârzia administrarea adrenalinei dacă este disponibilă'
    ],
    callEmergency: true,
    requiredKit: [
      'EpiPen (adrenalină auto-injectabilă)',
      'Antihistaminice (suplimentar, nu înlocuiesc adrenalina)',
      'Mască cu oxigen (dacă este disponibilă)',
      'Pătură pentru protecție termică',
      'Mănuși de protecție'
    ]
  }
];

/**
 * Helper function pentru a găsi o procedură după ID
 */
export function getProcedureById(id: string): PrimAjutorProcedure | undefined {
  return primAjutorProcedures.find(proc => proc.id === id);
}

/**
 * Helper function pentru proceduri care necesită apel 112
 */
export function getEmergencyProcedures(): PrimAjutorProcedure[] {
  return primAjutorProcedures.filter(proc => proc.callEmergency);
}

/**
 * Helper function pentru proceduri non-critice
 */
export function getNonEmergencyProcedures(): PrimAjutorProcedure[] {
  return primAjutorProcedures.filter(proc => !proc.callEmergency);
}
