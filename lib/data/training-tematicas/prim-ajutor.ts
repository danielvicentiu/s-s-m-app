/**
 * Tematica Curs Prim Ajutor ERC BLS (European Resuscitation Council - Basic Life Support)
 *
 * Curs conform ghidurilor ERC pentru Basic Life Support (BLS), orientat pe
 * salvarea vieții în situații de urgență. Programa include atât partea teoretică
 * cât și exercițiile practice obligatorii pe manechin.
 *
 * Durata totală: 8 ore (partea teoretică + practică intensivă)
 * Public țintă: Lucrători desemnați prim ajutor, echipe de intervenție, orice angajat
 * Certificare: Valabilă 2 ani conform ERC
 *
 * Referințe:
 * - ERC Guidelines 2021 (European Resuscitation Council)
 * - Legea 319/2006 (Art. 19 - Obligația de a avea persoane instruite în prim ajutor)
 * - HG 1425/2006 (Norma generală de protecție a muncii - Anexa privind prim ajutorul)
 * - Ordinul MS 1706/2007 privind aprobarea Normelor de aplicare a Legii 95/2006
 *
 * Conținut conform standardelor internaționale:
 * - Lanțul supraviețuirii
 * - Resuscitare cardio-pulmonară (RCP) adult și copil
 * - Utilizare defibrilator automat extern (AED)
 * - Proceduri pentru obstrucție căi aeriene
 * - Poziție laterală de siguranță
 * - Tratament hemoragii, arsuri, fracturi
 */

export interface ModulPrimAjutor {
  /** Numărul modulului (1-8) */
  nr: number;

  /** Titlul modulului */
  titlu: string;

  /** Descriere detaliată a modulului */
  descriere: string;

  /** Durata totală în minute (teorie + practică) */
  durataMinute: number;

  /** Durata partea teoretică în minute */
  durataTeorie: number;

  /** Durata partea practică în minute */
  durataPractica: number;

  /** Puncte cheie de abordat în modul */
  puncteCheie: string[];

  /** Exerciții practice obligatorii */
  exercitiiPractice: string[];

  /** Echipamente necesare pentru practică */
  echipamenteNecesare?: string[];

  /** Criterii de evaluare pentru partea practică */
  criteriiEvaluare?: string[];
}

export interface TematicaPrimAjutorBLS {
  /** Denumirea cursului */
  denumire: string;

  /** Standard internațional urmat */
  standard: string;

  /** Durata totală în ore */
  durataTotalaOre: number;

  /** Ratio teorie/practică */
  ratioTeoriePractica: string;

  /** Valabilitate certificat în ani */
  valabilitateCertificat: number;

  /** Lista modulelor (8 module) */
  module: ModulPrimAjutor[];

  /** Evaluare finală obligatorie */
  evaluareFinala: {
    tipEvaluare: string;
    durataMinute: number;
    criteriiPromovare: string[];
    notaMinimaTrecere: string;
  };

  /** Echipamente obligatorii pentru curs */
  echipamenteObligatorii: string[];

  /** Competențe dobândite */
  competenteDobandite: string[];
}

/**
 * Tematica completă pentru Cursul de Prim Ajutor ERC BLS
 */
const tematicaPrimAjutorBLS: TematicaPrimAjutorBLS = {
  denumire: 'Curs Prim Ajutor ERC BLS (Basic Life Support)',
  standard: 'ERC Guidelines 2021 (European Resuscitation Council)',
  durataTotalaOre: 8,
  ratioTeoriePractica: '40% teorie / 60% practică',
  valabilitateCertificat: 2,
  module: [
    {
      nr: 1,
      titlu: 'Introducere în prim ajutor și lanțul supraviețuirii',
      descriere: 'Concepte fundamentale ale primului ajutor și importanța intervenției rapide',
      durataMinute: 45,
      durataTeorie: 40,
      durataPractica: 5,
      puncteCheie: [
        'Definiție prim ajutor: îngrijire imediată până la sosirea ambulanței',
        'Obligația legală de a acorda prim ajutor (Good Samaritan Law)',
        'Lanțul supraviețuirii: Recunoaștere urgență → Apel 112 → RCP precoce → Defibrilare → Îngrijire avansată',
        'Importanța fiecărui inel din lanț - fiecare minut contează',
        'Statistici: șansele de supraviețuire scad cu 10% pe minut fără RCP',
        'Responsabilități și limite ale celui care acordă prim ajutor',
        'Principiul "primum non nocere" - în primul rând să nu dăunezi',
        'Consimțământ și protecție juridică',
      ],
      exercitiiPractice: [
        'Simulare apel la 112 - ce informații să transmiteți',
        'Identificare situații care necesită prim ajutor vs. urgențe majore',
      ],
      echipamenteNecesare: ['Telefon pentru simulare apel 112', 'Flip chart pentru lanțul supraviețuirii'],
      criteriiEvaluare: [
        'Apelul la 112 conține toate informațiile esențiale',
        'Recunoaștere corectă a situațiilor de urgență',
      ],
    },
    {
      nr: 2,
      titlu: 'Evaluarea victimei și măsuri de siguranță',
      descriere: 'Proceduri de evaluare primară și secundară a victimei în siguranță',
      durataMinute: 50,
      durataTeorie: 30,
      durataPractica: 20,
      puncteCheie: [
        'Principiul DRS ABC: Danger (Pericol) → Response (Răspuns) → Send for help (Apel ajutor) → Airway, Breathing, Circulation',
        'Asigurarea scenei: evaluare pericole (trafic, foc, electricitate, substanțe chimice)',
        'Utilizare echipamente de protecție: mănuși, mască protecție',
        'Evaluare conștiență: "Mă auziți?" + zguduit ușor de umeri',
        'Evaluare respirație: Look, Listen, Feel (10 secunde)',
        'Verificare puls carotidian (doar pentru personalul instruit)',
        'Poziționare victimă: când să mișcăm, când să nu mișcăm',
        'Identificare semne de viață: respirație, tuse, mișcare',
      ],
      exercitiiPractice: [
        'Simulare apropiare de victimă - asigurare scenă',
        'Exercițiu evaluare conștiență pe manechin',
        'Verificare respirație - metodă Look, Listen, Feel',
        'Poziționare corectă a victimei pentru evaluare',
      ],
      echipamenteNecesare: [
        'Manechine de antrenament',
        'Mănuși de protecție',
        'Măști de protecție cu supapă unidirecțională',
      ],
      criteriiEvaluare: [
        'Verificare corectă a siguranței scenei',
        'Evaluare conștiență executată corect',
        'Verificare respirație în maxim 10 secunde',
      ],
    },
    {
      nr: 3,
      titlu: 'Resuscitare cardio-pulmonară (RCP) adult - Teorie și practică',
      descriere: 'Tehnici de RCP conform ghidurilor ERC 2021 pentru adulți',
      durataMinute: 90,
      durataTeorie: 30,
      durataPractica: 60,
      puncteCheie: [
        'Indicații RCP: victimă inconștientă, fără respirație sau respirație anormală (gasping)',
        'Poziționare victimă: suprafață plană, fermă',
        'Poziționare salvator: lângă victimă, la nivelul toracelui',
        'Tehnica compresiilor toracice: centrul pieptului (jumătatea inferioară a sternului)',
        'Adâncimea compresiilor: 5-6 cm (adulți)',
        'Frecvență compresii: 100-120 per minut (ritmul melodiei "Stayin\' Alive")',
        'Revenire completă torace între compresii',
        'Raportul compresii-ventilații: 30:2 (pentru 1 sau 2 salvatori)',
        'Ventilații de salvare: basculare cap, ridicare bărbie, 2 insuflări (1 secundă fiecare)',
        'Verificare expansiune torace la fiecare ventilație',
        'Continuare RCP până la: victima revine, sosește ambulanța, salvator epuizat',
        'RCP doar cu compresii (Hands-Only CPR) dacă salvatorul nu poate/nu dorește ventilații',
      ],
      exercitiiPractice: [
        'Practică compresii toracice pe manechin adult - minim 2 minute continue',
        'Exercițiu ventilații cu mască pe manechin',
        'Simulare RCP complet 30:2 - cicluri de 5 minute',
        'Rotație între salvatori (schimb la fiecare 2 minute pentru a evita epuizarea)',
        'RCP Hands-Only (doar compresii) - simulare situație reală',
      ],
      echipamenteNecesare: [
        'Manechine adulți cu feedback compresii (Resusci Anne sau echivalent)',
        'Măști de protecție pentru ventilații',
        'Cronometru/metronom pentru ritmul compresiilor',
        'Manechin cu indicator adâncime compresii',
      ],
      criteriiEvaluare: [
        'Compresii la adâncimea corectă: 5-6 cm',
        'Frecvență corectă: 100-120/min',
        'Revenire completă torace între compresii',
        'Raport corect 30:2',
        'Ventilații eficiente cu ridicare vizibilă torace',
        'Continuitate - întreruperi minime (<10 secunde)',
      ],
    },
    {
      nr: 4,
      titlu: 'Defibrilare cu AED (Defibrilator Automat Extern)',
      descriere: 'Utilizarea defibrilatorului automat extern conform protocolului ERC',
      durataMinute: 60,
      durataTeorie: 25,
      durataPractica: 35,
      puncteCheie: [
        'Ce este AED: dispozitiv automat care analizează ritmul cardiac și administrează șoc electric',
        'Când se folosește: victimă inconștientă, fără respirație',
        'Localizare AED: în spații publice (aeroporturi, mall-uri, birouri)',
        'Procedură utilizare AED: pornire → aplicare electrozi → analiză automată → șoc (dacă indicat)',
        'Poziționare electrozi: torace gol, uscat - un electrod sub clavicula dreaptă, celălalt sub sânul stâng',
        'Îndepărtare obiecte metalice, bijuterii, plasturi medicamentoși',
        'NU atingeți victima în timpul analizei sau șocului',
        'Continuare RCP imediat după șoc (nu verificați pulsul)',
        'Urmați instrucțiunile vocale ale AED',
        'AED pentru copii: electrozi pediatrici sau mod pediatric (1-8 ani)',
        'Siguranță: "TOATĂ LUMEA LA O PARTE" înainte de șoc',
      ],
      exercitiiPractice: [
        'Simulare completă utilizare AED pe manechin adult',
        'Exercițiu: aplicare corectă electrozi pe manechin gol',
        'Practică RCP + AED - scenarii realiste: victimă găsită inconștientă',
        'Simulare schimb salvatori - continuitate RCP în timp ce se aduce AED',
        'Demonstrație utilizare electrozi pediatrici',
      ],
      echipamenteNecesare: [
        'AED de antrenament (trainer AED)',
        'Manechine adulți și copii',
        'Electrozi de antrenament (adulți și pediatrici)',
        'Foarfece pentru tăiat haine (dacă este cazul)',
      ],
      criteriiEvaluare: [
        'Pornire rapidă AED',
        'Aplicare corectă electrozi (poziție și contact)',
        'Respectarea instrucțiunilor vocale AED',
        'Asigurarea că nimeni nu atinge victima la șoc',
        'Reluare imediată RCP după șoc',
        'Întreruperi minime ale RCP (<10 secunde)',
      ],
    },
    {
      nr: 5,
      titlu: 'RCP la copii și sugari - Particularități',
      descriere: 'Tehnici adaptate de resuscitare pentru copii (1-8 ani) și sugari (<1 an)',
      durataMinute: 70,
      durataTeorie: 25,
      durataPractica: 45,
      puncteCheie: [
        'Definiții: sugar (<1 an), copil (1-8 ani), adult (>8 ani)',
        'Diferențe anatomice și implicații: torace mai flexibil, căi aeriene mai mici',
        'Compresii toracice COPII: o mână sau două mâini, adâncime 5 cm (1/3 din diametrul toracelui)',
        'Compresii toracice SUGARI: 2 degete (index + mijlociu), sub linia mameloanelor, adâncime 4 cm',
        'Frecvență compresii: 100-120/min (același ca la adulți)',
        'Raport compresii-ventilații: 30:2 (un salvator) sau 15:2 (doi salvatori profesioniști)',
        'Ventilații: mai blânde, volum mai mic (suficient să ridice toracele)',
        'Tehnica ventilațiilor la sugar: gură pe gură+nas',
        'Verificare puls: brahial la sugar (interiorul brațului)',
        'Apel 112: pentru copii/sugari - dacă singur, efectuați RCP 1 minut APOI apelați',
      ],
      exercitiiPractice: [
        'Practică compresii pe manechin copil - tehnica cu o mână/două mâini',
        'Practică compresii pe manechin sugar - tehnica cu 2 degete',
        'Exercițiu ventilații la sugar - gură pe gură+nas',
        'Simulare RCP complet copil - raport 30:2',
        'Simulare RCP complet sugar - raport 30:2 (un salvator)',
        'Scenario: copil găsit inconștient - secvență completă',
      ],
      echipamenteNecesare: [
        'Manechin copil (1-8 ani)',
        'Manechin sugar (<1 an)',
        'Măști pediatrice pentru ventilații',
        'AED cu electrozi pediatrici',
      ],
      criteriiEvaluare: [
        'Tehnica corectă compresii: 2 degete la sugar, 1/2 mâini la copil',
        'Adâncime corectă: 4 cm sugar, 5 cm copil',
        'Frecvență 100-120/min',
        'Ventilații blânde, suficiente pentru ridicare torace',
        'Raport corect 30:2',
      ],
    },
    {
      nr: 6,
      titlu: 'Obstrucție căi aeriene (înec) - Adult, copil, sugar',
      descriere: 'Recunoaștere și tratament obstrucție totală sau parțială a căilor aeriene',
      durataMinute: 55,
      durataTeorie: 20,
      durataPractica: 35,
      puncteCheie: [
        'Semne obstrucție PARȚIALĂ: poate tusi, respira, vorbi - "Tusește!"',
        'Semne obstrucție TOTALĂ (severă): nu poate respira, tuse slabă/absentă, nu poate vorbi, semn universal (mâinile la gât)',
        'Tehnica Heimlich (compresii abdominale) la ADULT și COPIL conștient:',
        '  - Poziționare: în spatele victimei',
        '  - Un pumn deasupra ombilicului, sub apendice xifoid',
        '  - Compresii rapide în sus și în interior',
        '  - Repetați până la expulzarea obiectului sau pierderea conștiinței',
        'Tehnica la SUGARI: NU compresii abdominale!',
        '  - 5 lovituri între omoplați (sugar pe antebrațul salvatorului, cap mai jos)',
        '  - 5 compresii toracice (aceeași poziție ca la RCP sugar)',
        'Victimă inconștientă cu obstrucție: începeți RCP (compresiile pot expulza obiectul)',
        'Verificați gura înainte de fiecare ventilație - dacă vedeți obiectul, îndepărtați-l',
        'NU băgați degetele orb în gură - risc de împingere obiect mai adânc',
        'Auto-Heimlich: compresii pe spătarul scaunului sau margine masă',
      ],
      exercitiiPractice: [
        'Practică manevre Heimlich pe adult - poziționare corectă mâini',
        'Simulare obstrucție totală la adult conștient - secvență completă',
        'Practică lovituri între omoplați + compresii toracice pe manechin sugar',
        'Simulare obstrucție la copil - adaptare tehnică',
        'Scenario: victimă cu obstrucție devine inconștientă - tranziție la RCP',
        'Demonstrație auto-Heimlich',
      ],
      echipamenteNecesare: [
        'Manechin adult pentru Heimlich',
        'Manechin sugar pentru obstrucție',
        'Obiecte simulare corp străin',
        'Scaun pentru demonstrație auto-Heimlich',
      ],
      criteriiEvaluare: [
        'Recunoaștere corectă obstrucție severă vs. parțială',
        'Poziționare corectă mâini pentru Heimlich',
        'Tehnica corectă: compresii rapide în sus și în interior',
        'Tehnica corectă la sugar: lovituri între omoplați + compresii toracice',
        'Tranziție corectă la RCP dacă victima devine inconștientă',
      ],
    },
    {
      nr: 7,
      titlu: 'Poziție laterală de siguranță și alte urgențe medicale',
      descriere: 'Poziționare victimă inconștientă care respiră și gestionare urgențe frecvente',
      durataMinute: 60,
      durataTeorie: 25,
      durataPractica: 35,
      puncteCheie: [
        'POZIȚIE LATERALĂ DE SIGURANȚĂ (Recovery Position):',
        '  - Indicații: victimă inconștientă, dar respiră normal',
        '  - Scop: menținere căi aeriene deschise, prevenire aspirație (vărsături)',
        '  - Tehnica: brațul apropiat lângă corp, brațul depărtat peste piept, genunchiul depărtat îndoit, rotație pe lateral',
        '  - Cap ușor hiperextins, gură deschisă spre pământ',
        '  - Monitorizare continuă respirație',
        'HEMORAGII (sângerări):',
        '  - Hemoragie externă: compresie directă cu pansament steril, ridicare membru (dacă nu e fracturat)',
        '  - Hemoragie severă: compresie puternică, adăugare pansamente (nu îndepărtați primul)',
        '  - Punct de compresie arterială (dacă nu funcționează compresie directă)',
        '  - Garou (turnichei): ULTIMĂ SOLUȚIE, doar pentru hemoragii masive membru (traumă extremă, amputație)',
        'ARSURI:',
        '  - Răcire IMEDIATĂ cu apă rece curentă (15-20 minute)',
        '  - Îndepărtare bijuterii, haine necăptușite (nu dacă sunt lipite)',
        '  - Acoperire cu folie sterilă sau pansament umed',
        '  - NU aplicați: gheață, unt, pastă de dinți, alte remedii casnice',
        '  - Arsuri mari sau la față/mâini/articulații: urgență medicală',
        'ȘOC (hipovolemic/traumatic):',
        '  - Semne: piele palidă/rece/umedă, puls rapid/slab, respirație rapidă, confuzie',
        '  - Tratament: victimă culcată, picioare ridicate 30 cm (dacă nu e traumă), menținere căldură',
        'FRACTURI și LUXAȚII:',
        '  - NU repoziționați os sau articulație',
        '  - Imobilizare în poziția găsită',
        '  - Aplicare gheață (cu protecție, nu direct pe piele)',
        '  - Fractură deschisă: acoperire sterilă, NU împingeți osul înapoi',
      ],
      exercitiiPractice: [
        'Practică poziție laterală de siguranță pe persoană reală (în siguranță)',
        'Exercițiu tratament hemoragie: compresie directă + ridicare membru',
        'Demonstrație aplicare garou (pe manechin sau membru sănătos - fără strângere)',
        'Simulare tratament arsură: răcire 15-20 minute, acoperire sterilă',
        'Practică imobilizare fractură antebraț cu atele improvizate',
        'Scenario complex: victimă cu arsură + hemoragie - prioritizare',
      ],
      echipamenteNecesare: [
        'Manechine pentru poziție laterală',
        'Pansamente sterile, comprese',
        'Garou de antrenament',
        'Folii sterile pentru arsuri',
        'Atele pentru imobilizare',
        'Bandaje, eșarfe triunghiulare',
        'Gheață (gelpack)',
      ],
      criteriiEvaluare: [
        'Poziție laterală executată corect - stabilitate și căi aeriene deschise',
        'Compresie eficientă hemoragie',
        'Aplicare corectă garou (doar la indicație)',
        'Răcire arsură minimum 15 minute',
        'Imobilizare corectă fractură',
      ],
    },
    {
      nr: 8,
      titlu: 'Evaluare finală practică și teoretică - Certificare',
      descriere: 'Testare competențe practice și teoretice conform standardelor ERC',
      durataMinute: 90,
      durataTeorie: 30,
      durataPractica: 60,
      puncteCheie: [
        'EVALUARE TEORETICĂ (30 minute):',
        '  - Test scris cu 30 întrebări tip grilă',
        '  - Domenii: lanțul supraviețuirii, RCP adult/copil/sugar, AED, obstrucție căi aeriene',
        '  - Notă minimă promovare: 80% (24/30 întrebări corecte)',
        'EVALUARE PRACTICĂ (60 minute):',
        '  - Scenario 1: RCP adult + AED (evaluare individuală, 8 minute)',
        '  - Scenario 2: RCP copil sau sugar (la alegere, 5 minute)',
        '  - Scenario 3: Obstrucție căi aeriene adult (3 minute)',
        '  - Scenario 4: Poziție laterală + tratament hemoragie/arsură (5 minute)',
        'CRITERII PROMOVARE:',
        '  - Compresii toracice eficiente: adâncime, frecvență, revenire corectă',
        '  - Ventilații eficiente: ridicare vizibilă torace',
        '  - Utilizare corectă AED: aplicare electrozi, respectare instrucțiuni',
        '  - Siguranță: protecție personală, asigurare scenă',
        '  - Apel 112 cu informații complete',
        '  - Continuitate RCP - întreruperi minime',
        'FEEDBACK și ÎMBUNĂTĂȚIRI:',
        '  - Feedback individual pentru fiecare cursant',
        '  - Identificare puncte de îmbunătățit',
        '  - Repetare secvențe pentru cei care nu ating performanța minimă',
        'CERTIFICARE:',
        '  - Certificat ERC BLS valabil 2 ani',
        '  - Card de buzunar cu algoritm RCP',
        '  - Recomandare: refresh anual, recertificare la 2 ani',
      ],
      exercitiiPractice: [
        'Scenario complet 1: Adult găsit inconștient - evaluare, apel 112, RCP, AED',
        'Scenario complet 2: Copil/sugar inconștient - secvență completă RCP',
        'Scenario 3: Adult se îneacă la masă - tratament obstrucție completă',
        'Scenario 4: Victimă inconștientă care respiră + hemoragie brațul - poziție laterală + compresie',
        'Test practic cronometrat cu grilă de evaluare',
      ],
      echipamenteNecesare: [
        'Manechine adulți, copii, sugari',
        'AED trainer',
        'Cronometru',
        'Grile de evaluare pentru instructori',
        'Truse complete de prim ajutor',
        'Certificate ERC BLS',
        'Carduri algoritm RCP',
      ],
      criteriiEvaluare: [
        'Test teoretic: minim 80% (24/30 întrebări)',
        'RCP adult: compresii 5-6 cm, frecvență 100-120/min, raport 30:2 corect',
        'Ventilații: ridicare vizibilă torace',
        'AED: aplicare corectă electrozi, respectare protocoale siguranță',
        'RCP copil/sugar: tehnica și adâncimea corecte',
        'Obstrucție: recunoaștere și tehnica Heimlich corectă',
        'Poziție laterală: execuție corectă, stabilitate',
        'Apel 112: informații complete (ce, unde, cine, când)',
      ],
    },
  ],
  evaluareFinala: {
    tipEvaluare: 'Evaluare mixtă: test teoretic (30 întrebări grilă) + evaluare practică (4 scenarii)',
    durataMinute: 90,
    criteriiPromovare: [
      'Test teoretic: minim 80% corect (24/30 întrebări)',
      'Evaluare practică RCP adult: compresii eficiente (adâncime, frecvență, revenire)',
      'Evaluare practică AED: utilizare corectă și în siguranță',
      'Evaluare practică RCP copil/sugar: adaptare corectă tehnică',
      'Evaluare obstrucție căi aeriene: recunoaștere și intervenție corectă',
      'Demonstrare poziție laterală de siguranță',
      'TOATE scenariile practice trebuie promovate pentru certificare',
    ],
    notaMinimaTrecere: '80% teorie + PROMOVAT la toate scenariile practice',
  },
  echipamenteObligatorii: [
    'Manechine de antrenament adulți (minim 1 la 4 cursanți) cu feedback compresii',
    'Manechine copii și sugari (minim 1 la 6 cursanți)',
    'AED trainer (minim 1 la 6 cursanți)',
    'Măști de protecție pentru ventilații (individuale, de unică folosință)',
    'Mănuși de protecție (cutie)',
    'Pansamente sterile, comprese, bandaje',
    'Garou de antrenament',
    'Folii sterile pentru arsuri',
    'Atele pentru imobilizare',
    'Cronometru/metronom pentru ritmul compresiilor',
    'Dezinfectant pentru manechine',
    'Flip chart/prezentare PowerPoint cu algoritme ERC 2021',
    'Certificate ERC BLS',
    'Carduri de buzunar cu algoritm RCP',
  ],
  competenteDobandite: [
    'Recunoaștere rapidă a urgențelor vitale (stop cardiac, obstrucție căi aeriene)',
    'Executare RCP de calitate înaltă la adulți (compresii + ventilații)',
    'Executare RCP adaptată la copii și sugari',
    'Utilizare defibrilator automat extern (AED) în siguranță',
    'Tratament obstrucție completă căi aeriene (manevre Heimlich) - adult, copil, sugar',
    'Poziționare victimă inconștientă care respiră (poziție laterală de siguranță)',
    'Tratament hemoragii externe (compresie, ridicare, garou)',
    'Tratament arsuri (răcire, acoperire sterilă)',
    'Imobilizare provizorie fracturi',
    'Recunoaștere și tratament inițial șoc',
    'Apel eficient la 112 cu transmitere informații complete',
    'Lucru în echipă pentru resuscitare (coordonare, rotație salvatori)',
    'Asigurare siguranță personală și a scenei intervenției',
  ],
};

/**
 * Returnează tematica completă pentru cursul de Prim Ajutor ERC BLS
 *
 * @returns Tematica completă cu toate cele 8 module
 *
 * @example
 * const tematica = getTematicaPrimAjutorBLS();
 * console.log(tematica.module); // Array cu 8 module
 * console.log(tematica.durataTotalaOre); // 8 ore
 */
export function getTematicaPrimAjutorBLS(): TematicaPrimAjutorBLS {
  return tematicaPrimAjutorBLS;
}

/**
 * Returnează un modul specific din tematica de prim ajutor
 *
 * @param nrModul - Numărul modulului (1-8)
 * @returns Modulul solicitat sau undefined dacă numărul este invalid
 *
 * @example
 * const modul3 = getModulPrimAjutor(3);
 * console.log(modul3.titlu); // "Resuscitare cardio-pulmonară (RCP) adult - Teorie și practică"
 */
export function getModulPrimAjutor(nrModul: number): ModulPrimAjutor | undefined {
  return tematicaPrimAjutorBLS.module.find((m) => m.nr === nrModul);
}

/**
 * Calculează durata totală a părții teoretice
 *
 * @returns Durata totală teorie în minute
 */
export function getDurataTotalaTeorie(): number {
  return tematicaPrimAjutorBLS.module.reduce((total, modul) => total + modul.durataTeorie, 0);
}

/**
 * Calculează durata totală a părții practice
 *
 * @returns Durata totală practică în minute
 */
export function getDurataTotalaPractica(): number {
  return tematicaPrimAjutorBLS.module.reduce((total, modul) => total + modul.durataPractica, 0);
}

/**
 * Verifică dacă tematica respectă standardul 40% teorie / 60% practică
 *
 * @returns Obiect cu durate și procentaje
 */
export function verificaRatioTeoriePractica(): {
  durataTeorie: number;
  durataPractica: number;
  procentTeorie: number;
  procentPractica: number;
  respectaStandard: boolean;
} {
  const durataTeorie = getDurataTotalaTeorie();
  const durataPractica = getDurataTotalaPractica();
  const durataTotal = durataTeorie + durataPractica;

  const procentTeorie = Math.round((durataTeorie / durataTotal) * 100);
  const procentPractica = Math.round((durataPractica / durataTotal) * 100);

  return {
    durataTeorie,
    durataPractica,
    procentTeorie,
    procentPractica,
    respectaStandard: procentTeorie <= 45 && procentPractica >= 55,
  };
}

/**
 * Export implicit
 */
export default tematicaPrimAjutorBLS;
