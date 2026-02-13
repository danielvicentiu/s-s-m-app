export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  category: 'SSM Tips' | 'Legal' | 'News';
  publishDate: string;
  readTime: number;
  tags: string[];
  imageUrl?: string;
}

export const blogArticles: BlogArticle[] = [
  {
    id: '1',
    slug: 'pregatire-control-itm-2024',
    title: 'Cum te pregătești pentru un control ITM în 2024',
    excerpt: 'Controalele ITM pot părea intimidante, dar cu o pregătire adecvată, compania ta va trece cu brio. Descoperă pașii esențiali pentru a fi pregătit.',
    content: `# Cum te pregătești pentru un control ITM în 2024

Controalele Inspecției Muncii sunt o realitate pentru orice angajator din România. Deși pot părea intimidante, cu o pregătire corespunzătoare și documentație la zi, compania ta poate trece cu succes peste această verificare.

## Documentația esențială

Primul pas în pregătirea pentru un control ITM este să ai la îndemână toată documentația obligatorie. Aceasta include contractele individuale de muncă (CIM) pentru toți angajații, actele adiționale, evidența orelor de lucru (pontaj), și registrul general de evidență a salariaților (REVISAL) actualizat. De asemenea, trebuie să ai la dispoziție documentele privind sănătatea și securitatea în muncă.

## Evaluarea riscurilor la locul de muncă

Unul dintre documentele cele mai importante verificate de ITM este evaluarea riscurilor profesionale. Aceasta trebuie să fie realizată pentru fiecare post de muncă din companie și actualizată ori de câte ori apar modificări în procesul de producție sau în condițiile de muncă. Evaluarea trebuie să fie semnată de angajați, confirmând că au fost instruiți în privința riscurilor identificate.

## Instructajele de SSM

Instructajele de securitate și sănătate în muncă trebuie efectuate periodic și corect documentate. Instructajul inițial se face la angajare, urmat de instructaje periodice (anual pentru cele mai multe posturi) și instructaje suplimentare când se schimbă condițiile de muncă sau tehnologia utilizată. Fișele de instructaj trebuie să fie semnate de angajați și păstrate în dosarul personal.

## Controlul medical la angajare și periodic

Angajații trebuie să aibă avizul medical de la medicina muncii, atât la momentul angajării cât și periodic, conform specificului postului. Frecvența examinărilor medicale diferă în funcție de riscurile la care sunt expuși angajații. Lipsa acestor avize medicale poate atrage amenzi substanțiale.

## Concluzie

Pregătirea pentru un control ITM nu trebuie să fie un proces stresant dacă menții documentația la zi pe parcursul întregului an. O abordare proactivă a obligațiilor SSM nu doar că te ajută să eviți amenzile, dar contribuie și la crearea unui mediu de lucru mai sigur pentru angajați. Consultă un specialist SSM pentru a te asigura că respecti toate cerințele legale.`,
    author: {
      name: 'Daniel Popescu',
      role: 'Consultant SSM Senior',
    },
    category: 'SSM Tips',
    publishDate: '2024-01-15',
    readTime: 8,
    tags: ['ITM', 'control', 'documentație', 'compliance'],
  },
  {
    id: '2',
    slug: 'obligatii-angajator-ssm-2024',
    title: 'Obligațiile esențiale ale angajatorului în domeniul SSM',
    excerpt: 'Legislația SSM impune angajatorilor o serie de obligații clare pentru protecția salariaților. Află care sunt cele mai importante responsabilități pe care trebuie să le îndeplinești.',
    content: `# Obligațiile esențiale ale angajatorului în domeniul SSM

Ca angajator în România, ai responsabilitatea legală de a asigura un mediu de lucru sigur și sănătos pentru toți angajații tăi. Legislația SSM stabilește clar aceste obligații, iar nerespectarea lor poate duce la sancțiuni severe.

## Organizarea activității de prevenire și protecție

Conform Legii 319/2006, fiecare angajator trebuie să organizeze activitatea de securitate și sănătate în muncă, fie prin desemnarea unor lucrători, fie prin apelarea la servicii externe de prevenire și protecție. Decizia depinde de numărul de angajați și de complexitatea activității desfășurate. Companiile cu peste 50 de angajați sau cu activități cu risc ridicat trebuie să aibă serviciu intern de prevenire.

## Evaluarea riscurilor profesionale

Angajatorul are obligația de a evalua riscurile pentru securitatea și sănătatea lucrătorilor, inclusiv la alegerea echipamentelor de muncă, a substanțelor sau preparatelor chimice și la amenajarea locurilor de muncă. Această evaluare trebuie să fie documentată și actualizată periodic sau când apar modificări semnificative în procesul de muncă.

## Informarea și instruirea lucrătorilor

Toți lucrătorii trebuie să fie informați și instruiți privind riscurile pentru securitate și sănătate, măsurile de prevenire și protecție, și procedurile de prim ajutor și intervenție în caz de urgență. Instructajele trebuie documentate, iar angajații trebuie să semneze confirmarea că au înțeles informațiile primite. Instruirea nu este un act formal, ci un proces esențial pentru prevenirea accidentelor.

## Supravegherea sănătății lucrătorilor

Angajatorul trebuie să asigure supravegherea sănătății lucrătorilor în raport cu riscurile privind securitatea și sănătatea în muncă la locul de muncă. Aceasta include controlul medical la angajare, controale periodice și, unde este cazul, examene medicale suplimentare. Costurile acestor examinări sunt suportate integral de angajator.

## Asigurarea echipamentelor de protecție

Echipamentele individuale de protecție (EIP) trebuie furnizate gratuit de angajator pentru toate posturile care necesită astfel de echipamente. Acestea trebuie să fie adecvate riscurilor, să fie conforme cu standardele europene și să fie înlocuite periodic. Angajatorul trebuie să țină evidența distribuirii EIP-urilor și să verifice utilizarea lor corectă.`,
    author: {
      name: 'Maria Ionescu',
      role: 'Consultant SSM',
    },
    category: 'Legal',
    publishDate: '2024-01-22',
    readTime: 7,
    tags: ['obligații legale', 'angajator', 'responsabilități', 'legislație'],
  },
  {
    id: '3',
    slug: 'noutati-legislative-ssm-ianuarie-2024',
    title: 'Noutăți legislative SSM - Ianuarie 2024',
    excerpt: 'Noul an aduce modificări importante în legislația SSM. Informează-te despre ultimele schimbări legislative care te afectează direct.',
    content: `# Noutăți legislative SSM - Ianuarie 2024

Începutul anului 2024 vine cu modificări semnificative în cadrul legislativ privind securitatea și sănătatea în muncă. Este esențial ca angajatorii și consultanții SSM să fie la curent cu aceste schimbări pentru a asigura conformitatea completă.

## Modificări la HG 1425/2006

Una dintre cele mai importante modificări se referă la actualizarea Normelor metodologice de aplicare a Legii 319/2006. Aceste modificări aduc clarificări în ceea ce privește responsabilitățile lucrătorilor desemnați și ale serviciilor externe de prevenire și protecție. De asemenea, sunt stabilite mai clar condițiile de autorizare și criteriile de competență pentru furnizorii de servicii SSM externe.

## Actualizări privind munca la înălțime

Reglementările privind munca la înălțime au fost revizuite pentru a se alinia la cele mai recente standarde europene. Noile prevederi stabilesc criterii mai stricte pentru autorizarea lucrătorilor care desfășoară activități la înălțime și specifică mai detaliat echipamentele de protecție necesare. Angajatorii care au angajați ce lucrează la înălțime trebuie să revizuiască procedurile interne și să se asigure că toți lucrătorii au autorizările corespunzătoare.

## Modificări la normele PSI

În domeniul prevenirii și stingerii incendiilor, au fost introduse cerințe suplimentare privind documentația de securitate la incendiu pentru anumite categorii de construcții. Autorizațiile PSI existente rămân valabile, dar pentru orice modificare structurală sau schimbare a destinației spațiilor este necesară reautorizarea. De asemenea, au fost actualizate cerințele pentru instruirea personalului în domeniul PSI.

## Sancțiuni majorate

O modificare importantă se referă la majorarea sancțiunilor pentru nerespectarea legislației SSM. Amenzile contravenționale au fost indexate, iar în cazuri grave de nerespectare a normelor care pun în pericol viața sau sănătatea lucrătorilor, pot fi aplicate și sancțiuni penale. Această măsură subliniază importanța crescută pe care autoritățile o acordă protecției lucrătorilor.

## Concluzii și recomandări

Toate aceste modificări legislative subliniază necesitatea unei abordări proactive în domeniul SSM. Recomandăm tuturor angajatorilor să efectueze un audit complet al documentației SSM pentru a identifica eventualele neconcordanțe cu noile prevederi legale. Consultarea unui specialist SSM certificat poate preveni problemele la viitoarele controale și, mai important, poate salva vieți prin implementarea măsurilor adecvate de protecție.`,
    author: {
      name: 'Daniel Popescu',
      role: 'Consultant SSM Senior',
    },
    category: 'News',
    publishDate: '2024-01-28',
    readTime: 6,
    tags: ['legislație', 'noutăți', 'modificări legale', '2024'],
  },
  {
    id: '4',
    slug: 'echipamente-protectie-individuala-ghid',
    title: 'Ghid complet pentru echipamentele de protecție individuală',
    excerpt: 'Echipamentele de protecție individuală sunt esențiale pentru siguranța angajaților. Descoperă ce tipuri de EIP există, când sunt necesare și cum le alegi corect.',
    content: `# Ghid complet pentru echipamentele de protecție individuală

Echipamentele individuale de protecție (EIP) reprezintă ultima linie de apărare între lucrător și pericolele din mediul de muncă. Alegerea și utilizarea corectă a acestora poate face diferența între un incident minor și un accident grav.

## Ce sunt EIP-urile și când sunt necesare

EIP-urile sunt echipamente destinate să fie purtate sau ținute de lucrător pentru a-l proteja împotriva unuia sau mai multor riscuri care ar putea să îi pună în pericol securitatea sau sănătatea la locul de muncă. Conform legislației, EIP-urile trebuie furnizate gratuit de angajator și sunt obligatorii atunci când riscurile nu pot fi evitate sau suficient reduse prin măsuri de prevenție colectivă sau prin organizarea muncii.

## Categorii principale de EIP

EIP-urile se clasifică în funcție de partea corpului pe care o protejează: protecția capului (căști de protecție), protecția ochilor și feței (ochelari, viziere), protecția respiratorie (măști, respiratoare), protecția auzului (dopuri, cască antifonică), protecția mâinilor și brațelor (mănuși de protecție), protecția picioarelor și picioarelor (încălțăminte de siguranță), protecția corpului (veste reflectorizante, combinezoane) și protecția împotriva căderilor de la înălțime (hamuri, sisteme anti-cădere).

## Criterii de selecție a EIP-urilor

Alegerea EIP-urilor corecte se face în funcție de evaluarea riscurilor specifice locului de muncă. Fiecare EIP trebuie să fie certificat CE și să respecte standardele europene corespunzătoare. Este important ca echipamentele să fie confortabile și să permită efectuarea sarcinilor de muncă fără restricții nejustificate. Un EIP inconfortabil este un EIP care nu va fi purtat, indiferent de cât de bine protejează teoretic.

## Instruirea și întreținerea

Furnizarea EIP-urilor nu este suficientă - angajații trebuie instruiți corespunzător privind modul de utilizare, limitările echipamentului și necesitatea întreținerii. Angajatorul trebuie să asigure curățarea, dezinfectarea, întreținerea și înlocuirea la timp a EIP-urilor. De asemenea, trebuie ținută o evidență strictă a distribuirii echipamentelor către fiecare angajat, care trebuie să semneze de primire.

## Responsabilitățile angajaților

Deși obligația principală revine angajatorului, și angajații au responsabilități clare: să utilizeze EIP-urile conform instruirii primite, să aibă grijă de echipamente, să raporteze imediat orice defecțiune sau deteriorare și să nu modifice echipamentele. Refuzul nejustificat de a utiliza EIP-urile poate constitui abatere disciplinară și poate duce la sancționarea angajatului.`,
    author: {
      name: 'Alexandru Popa',
      role: 'Specialist echipamente SSM',
    },
    category: 'SSM Tips',
    publishDate: '2024-02-05',
    readTime: 9,
    tags: ['EIP', 'echipamente', 'protecție', 'siguranță'],
  },
  {
    id: '5',
    slug: 'medicina-muncii-ce-trebuie-sa-stii',
    title: 'Medicina muncii: ce trebuie să știi ca angajator',
    excerpt: 'Controlul medical periodic este obligatoriu pentru toți angajații. Află ce presupune, cât costă și cum te asiguri că ești în conformitate cu legislația.',
    content: `# Medicina muncii: ce trebuie să știi ca angajator

Medicina muncii reprezintă un domeniu esențial în protecția sănătății angajaților și un aspect fundamental al conformității legale pentru orice angajator. Înțelegerea corectă a obligațiilor în acest domeniu te poate ajuta să eviți sancțiunile și, mai important, să protejezi sănătatea echipei tale.

## Ce este medicina muncii

Medicina muncii este specialitatea medicală care se ocupă cu supravegherea sănătății lucrătorilor în raport cu riscurile profesionale la care sunt expuși. Scopul principal este prevenirea îmbolnăvirilor profesionale și adaptarea locului de muncă la capacitățile fizice și psihice ale lucrătorilor. În România, această activitate este reglementată prin Legea 319/2006 și normele metodologice de aplicare.

## Obligațiile angajatorului

Angajatorul are obligația legală de a încheia un contract cu un furnizor de servicii de medicina muncii autorizat și de a asigura examinarea medicală a tuturor angajaților. Controlul medical este obligatoriu la angajare, periodic (anual, la 2 ani sau la 3 ani, în funcție de factorii de risc), la reluarea activității după o abatere medicală mai mare de 30 de zile și ori de câte ori apare o modificare în starea de sănătate care poate influența capacitatea de muncă. Toate costurile sunt suportate de angajator.

## Tipuri de examene medicale

Examinarea medicală de medicina muncii include un consult medical, completarea fișei de aptitudine și, în funcție de factorii de risc identificați în fișa postului, analize de laborator și investigații suplimentare (audiogramă, spirometrie, EKG, radiografie etc.). De exemplu, pentru lucrători expuși la zgomot este obligatorie audiograma, iar pentru cei care lucrează cu substanțe toxice pot fi necesare analize de sânge specifice.

## Avizul medical și aptitudinea

La finalul examinării, medicul de medicina muncii emite avizul medical care stabilește dacă angajatul este apt, apt condiționat sau inapt pentru postul respectiv. Avizul apt condiționat poate include restricții sau recomandări pentru adaptarea locului de muncă. Un aviz de inapt temporar sau definitiv obligă angajatorul să înceteze repartizarea lucrătorului pe postul respectiv și să caute soluții de redistribuire pe un post compatibil cu starea de sănătate.

## Păstrarea confidențialității

Informațiile medicale sunt strict confidențiale și protejate de GDPR. Angajatorul primește doar avizul final (apt/inapt/apt condiționat) și eventualele recomandări de adaptare a postului, fără detalii medicale despre diagnostice sau tratamente. Dosarele medicale se păstrează la cabinetul de medicina muncii timp de 10 ani după încetarea raporturilor de muncă, iar pentru anumite profesii cu risc (ex: expunere la azbest) durata de păstrare este mai mare.`,
    author: {
      name: 'Dr. Elena Marinescu',
      role: 'Medic medicina muncii',
    },
    category: 'Legal',
    publishDate: '2024-02-12',
    readTime: 7,
    tags: ['medicina muncii', 'control medical', 'aptitudine', 'sănătate'],
  },
  {
    id: '6',
    slug: 'instructaj-ssm-periodic-cum-se-face',
    title: 'Instructajul SSM periodic: cum se realizează corect',
    excerpt: 'Instructajul periodic de SSM este obligatoriu și vital pentru siguranța angajaților. Află cum să îl organizezi eficient și ce conținut trebuie să includă.',
    content: `# Instructajul SSM periodic: cum se realizează corect

Instructajul periodic de securitate și sănătate în muncă este una dintre obligațiile fundamentale ale angajatorului și un instrument esențial în prevenirea accidentelor de muncă. Deși poate părea o formalitate birocratică, un instructaj bine realizat poate salva vieți.

## Cadrul legal al instructajului SSM

Conform Legii 319/2006, toți angajații trebuie să primească instructaj de SSM la angajare (instructaj introductiv-general și la locul de muncă) și periodic pe durata activității. Instructajul introductiv-general se realizează înainte de începerea activității și acoperă informații generale despre riscurile din companie. Instructajul la locul de muncă se focusează pe riscurile specifice postului. Instructajul periodic se realizează anual pentru majoritatea posturilor, sau la 6 luni pentru posturi cu risc ridicat.

## Cine poate realiza instructajul

Instructajul poate fi realizat de șeful locului de muncă, de un lucrător desemnat pregătit corespunzător sau de un consultant SSM extern. Persoana care realizează instructajul trebuie să cunoască în detaliu procesul tehnologic, riscurile specifice și măsurile de prevenire. Este esențial ca instructorul să aibă abilități de comunicare și să se asigure că mesajele sunt înțelese de toți participanții, indiferent de nivelul lor de educație.

## Conținutul instructajului periodic

Un instructaj periodic complet trebuie să acopere: riscurile specifice locului de muncă și cum pot fi evitate, utilizarea corectă a echipamentelor de lucru și a EIP-urilor, regulile de circulație și condiții de lucru sigure, măsuri în caz de incendiu sau alte situații de urgență, proceduri de prim ajutor și raportarea accidentelor sau incidentelor. De asemenea, trebuie abordate orice modificări în procesul de lucru sau echipamentele utilizate de la ultimul instructaj.

## Metode eficiente de realizare

Pentru ca instructajul să fie eficient, nu doar formal, se recomandă utilizarea de exemple concrete, demonstrații practice și, unde este posibil, simulări. Prezentările PowerPoint trebuie completate cu discuții interactive și sesiuni de întrebări-răspunsuri. Este util să se prezinte și cazuri reale de accidente (anonimizate) și analiza cauzelor acestora. Instructajul nu trebuie să fie o simplă citire a unei fișe, ci o oportunitate reală de învățare.

## Documentarea instructajului

După finalizarea instructajului, toți participanții trebuie să semneze fișa de instructaj, confirmând că au înțeles informațiile prezentate. Fișa trebuie să conțină data, numele instructorului, numele participanților, semnăturile și conținutul instructajului. Aceste fișe se păstrează în dosarele personale ale angajaților și trebuie prezentate la controalele ITM. O bună practică este și realizarea unui registru general de instructaje pentru a putea urmări ușor când fiecare angajat trebuie reinstrujat.`,
    author: {
      name: 'Maria Ionescu',
      role: 'Consultant SSM',
    },
    category: 'SSM Tips',
    publishDate: '2024-02-19',
    readTime: 8,
    tags: ['instructaj', 'SSM', 'training', 'siguranță'],
  },
  {
    id: '7',
    slug: 'psi-prevenire-stingere-incendii-ghid',
    title: 'PSI în companie: ghidul complet pentru prevenire și stingere incendii',
    excerpt: 'Securitatea la incendiu nu este opțională. Descoperă ce obligații ai în domeniul PSI și cum poți proteja eficient compania și angajații de riscul de incendiu.',
    content: `# PSI în companie: ghidul complet pentru prevenire și stingere incendii

Prevenirea și stingerea incendiilor (PSI) reprezintă un domeniu distinct dar complementar cu SSM, având propriul cadru legislativ și cerințe specifice. Neglijarea acestui aspect poate avea consecințe devastatoare, atât în plan uman cât și material.

## Cadrul legislativ PSI

Principala lege în domeniul PSI este Legea 307/2006 privind apărarea împotriva incendiilor, modificată și completată prin numeroase acte normative subsecvente. Această lege stabilește măsurile și acțiunile privind prevenirea și stingerea incendiilor, protecția persoanelor, bunurilor și mediului împotriva incendiilor și efectelor acestora. Fiecare construcție sau amenajare care necesită autorizație de construire trebuie să aibă documentație de securitate la incendiu aprobată.

## Autorizația PSI

Orice persoană juridică care desfășoară activități în spații închise sau deschise trebuie să dețină autorizație de securitate la incendiu. Obținerea acesteia presupune întocmirea unui dosar care include documentația de securitate la incendiu (scenariul de securitate), planuri de evacuare, instrucțiuni de apărare împotriva incendiilor și dovada instruirii personalului. Autorizația se eliberează de Inspectoratul pentru Situații de Urgență (ISU) local și trebuie reînnoită periodic sau când apar modificări semnificative.

## Dotări și echipamente PSI

În funcție de destinația și dimensiunea spațiilor, sunt necesare diferite dotări: stingătoare (cu diferite substanțe extinctoare, în funcție de tipul de foc posibil), hidranți interiori și/sau exteriori, sistem de detecție și avertizare incendiu, sistem de iluminat de siguranță și indicatoare de evacuare, uși rezistente la foc, compartimentări corespunzătoare. Toate aceste echipamente trebuie verificate și întreținute periodic, conform reglementărilor în vigoare.

## Instruirea personalului

Similar cu SSM, și în domeniul PSI instruirea personalului este obligatorie. Toți angajații trebuie să cunoască regulile de prevenire a incendiilor specifice locului de muncă, să știe să utilizeze mijloacele de stingere disponibile, să cunoască căile de evacuare și punctele de adunare și să știe cum să acționeze în caz de incendiu. Instruirea se realizează la angajare și periodic (anual sau semestrial pentru posturi cu risc crescut) și trebuie documentată corespunzător.

## Planul de evacuare și exercițiile

Orice spațiu cu personal trebuie să aibă un plan de evacuare afișat vizibil, care să indice căile de evacuare, ieșirile de urgență, locația stingătoarelor și hidranților și punctul de adunare exterior. Periodic (cel puțin anual) trebuie organizate exerciții de evacuare pentru a testa planul și a familiariza personalul cu procedurile. Aceste exerciții trebuie documentate într-un proces-verbal care include timpul de evacuare, problemele identificate și măsurile corective luate.`,
    author: {
      name: 'Ing. Mihai Stanciu',
      role: 'Expert PSI',
    },
    category: 'Legal',
    publishDate: '2024-02-26',
    readTime: 9,
    tags: ['PSI', 'incendiu', 'prevenire', 'evacuare', 'autorizație'],
  },
  {
    id: '8',
    slug: 'evaluare-riscuri-profesionale-metodologie',
    title: 'Evaluarea riscurilor profesionale: metodologie pas cu pas',
    excerpt: 'Evaluarea riscurilor este piatra de temelie a sistemului SSM. Învață cum să realizezi o evaluare completă și conformă cu cerințele legale.',
    content: `# Evaluarea riscurilor profesionale: metodologie pas cu pas

Evaluarea riscurilor profesionale este cel mai important document în sistemul de securitate și sănătate în muncă al oricărei companii. Aceasta stă la baza tuturor celorlalte măsuri de prevenire și este primul lucru verificat în orice control ITM.

## Ce înseamnă evaluarea riscurilor

Evaluarea riscurilor profesionale este procesul sistematic prin care se identifică pericolele la locul de muncă, se evaluează riscurile asociate acestor pericole și se stabilesc măsurile de prevenire și protecție necesare. Un pericol este orice sursă potențială de vătămare sau dăunare a sănătății, în timp ce riscul reprezintă combinația dintre probabilitatea producerii unui eveniment periculos și gravitatea consecințelor acestuia.

## Etapele evaluării riscurilor

Prima etapă constă în identificarea tuturor pericolelor din fiecare loc de muncă: pericole mecanice (mașini, unelte), pericole fizice (zgomot, vibrații, radiații), pericole chimice (substanțe toxice, iritante), pericole biologice (bacterii, viruși), pericole ergonomice (manevrare manuală, posturi forțate) și pericole psihosociale (stres, hărțuire). Această identificare se face prin observație directă, discuții cu angajații și analiza documentației tehnice.

## Metodologia de evaluare

Pentru fiecare pericol identificat se evaluează riscul prin două criterii: probabilitatea (P) - cât de probabil este să se producă evenimentul periculos, și severitatea (S) - cât de grave ar fi consecințele. Fiecare criteriu se notează de obicei de la 1 la 5, iar riscul se calculează ca R = P × S. În funcție de rezultat, riscurile se clasifică în: risc nesemnificativ (1-4), risc mic (5-9), risc mediu (10-15) și risc mare (16-25). Această metodologie poate varia, important este să fie aplicată consecvent.

## Stabilirea măsurilor de prevenire

Pentru fiecare risc identificat trebuie stabilite măsuri de prevenire și protecție, respectând ierarhia: eliminarea riscului (cel mai eficient), substituirea cu ceva mai puțin periculos, măsuri de inginerie (protecții la mașini, ventilație), măsuri administrative (proceduri, rotație personal) și echipamente de protecție individuală (ultima soluție). Fiecare măsură trebuie să aibă un responsabil și un termen de implementare clar.

## Actualizarea evaluării

Evaluarea riscurilor nu este un document static. Trebuie revizuită și actualizată periodic (cel puțin o dată pe an) și ori de câte ori apar modificări: schimbări în procesul tehnologic, noi echipamente, noi substanțe chimice utilizate, modificări ale spațiilor de lucru sau după producerea unui accident sau incident. De asemenea, evaluarea trebuie comunicată și explicată tuturor angajaților vizați, care trebuie să semneze că au luat la cunoștință de riscurile la care sunt expuși.`,
    author: {
      name: 'Daniel Popescu',
      role: 'Consultant SSM Senior',
    },
    category: 'SSM Tips',
    publishDate: '2024-03-04',
    readTime: 10,
    tags: ['evaluare riscuri', 'metodologie', 'prevenire', 'SSM'],
  },
  {
    id: '9',
    slug: 'digitalizare-conformitate-ssm-beneficii',
    title: 'Digitalizarea conformității SSM: beneficii și oportunități',
    excerpt: 'Trecerea de la documentația fizică la platforme digitale SSM poate revoluționa modul în care gestionezi conformitatea. Descoperă avantajele și cum să începi.',
    content: `# Digitalizarea conformității SSM: beneficii și oportunități

În era digitală, tot mai multe companii descoperă beneficiile transformării digitale în domeniul securității și sănătății în muncă. Trecerea de la dosare fizice și foi de hârtie la platforme digitale nu este doar o modernizare, ci o schimbare fundamentală care poate economisi timp, reduce costurile și îmbunătăți conformitatea.

## Provocările sistemului tradițional

Sistemul tradițional de gestionare a documentației SSM prezintă numeroase provocări: dosare voluminoase dificil de actualizat, risc de pierdere sau deteriorare a documentelor, dificultăți în urmărirea scadențelor (controale medicale, instructaje, verificări echipamente), timp considerabil alocat pentru completarea manuală a formularelor și lipsa centralizării informațiilor. În plus, la controalele ITM, găsirea rapidă a documentelor necesare poate fi problematică, generând stres suplimentar.

## Avantajele platformelor digitale SSM

Digitalizarea aduce beneficii multiple: acces instant la orice document din orice locație, actualizare rapidă și sincronizată pentru toți utilizatorii, notificări automate pentru scadențe (examene medicale, instructaje, autorizații), generare automată a rapoartelor și statisticilor, backup automat și securitatea datelor prin cloud, reducerea consumului de hârtie și a impactului asupra mediului. De asemenea, platforma digitală facilitează colaborarea între consultant SSM, angajator și autorități.

## Funcționalități esențiale ale unei platforme SSM

O platformă SSM completă trebuie să includă: gestionarea angajaților și a posturilor, bază de date cu evaluări de riscuri personalizabile, urmărirea controlelor medicale cu notificări automate, programare și documentare instructaje SSM și PSI, evidența echipamentelor de protecție și distribuirea acestora, gestionarea autorizațiilor și certificatelor, raportarea și investigarea accidentelor de muncă, audit trail complet pentru demonstrarea conformității. Interfața trebuie să fie intuitivă și accesibilă pentru utilizatori cu diferite niveluri de experiență tehnică.

## Implementarea cu succes

Tranziția la digital trebuie planificată strategic: începe cu un audit complet al documentației existente, alege o platformă care răspunde nevoilor specifice ale companiei tale, migrează datele în etape, începând cu informațiile curente, instruiește echipa în utilizarea platformei și stabilește proceduri clare pentru menținerea datelor actualizate. Este important să implici de la început atât managementul cât și angajații, explicând beneficiile concrete pentru fiecare categorie.

## Viitorul conformității SSM

Digitalizarea nu este doar o tendință, ci devine rapid standardul industriei. Companiile care adoptă soluții digitale beneficiază de eficiență sporită, costuri reduse și conformitate îmbunătățită. Mai mult, în contextul telemuncii și a forței de muncă distribuite, platformele cloud devin nu doar utile, ci esențiale. Investiția în digitalizarea SSM se amortizează rapid prin economiile de timp și prin reducerea riscului de amenzi pentru neconformități.`,
    author: {
      name: 'Ionuț Dobre',
      role: 'Consultant digitalizare SSM',
    },
    category: 'News',
    publishDate: '2024-03-11',
    readTime: 8,
    tags: ['digitalizare', 'platformă', 'conformitate', 'tehnologie', 'eficiență'],
  },
  {
    id: '10',
    slug: 'accidente-munca-raportare-investigare',
    title: 'Accidente de muncă: proceduri de raportare și investigare',
    excerpt: 'Cum procedezi când se produce un accident de muncă? Află obligațiile legale de raportare, pașii investigației și măsurile pentru prevenirea repetării.',
    content: `# Accidente de muncă: proceduri de raportare și investigare

Producerea unui accident de muncă este un moment critic care necesită acțiune rapidă și corectă din partea angajatorului. Cunoașterea procedurilor legale de raportare și investigare este esențială pentru conformitate și, mai important, pentru prevenirea accidentelor similare în viitor.

## Definiție și categorii de accidente

Conform legislației, accidentul de muncă este vătămarea violentă a organismului, precum și intoxicația acută profesională, care au loc în timpul procesului de muncă sau în îndeplinirea îndatoririlor de serviciu și care provoacă incapacitate temporară de muncă de cel puțin 3 zile calendaristice, invaliditate sau deces. Accidentele se clasifică în: ușoare (3-29 zile ITM), grave (peste 30 zile ITM, fracturi, leziuni interne) și colective (minimum 3 victime simultan) sau mortale. Fiecare categorie are proceduri specifice de raportare.

## Măsuri imediate după accident

Prima prioritate este acordarea primului ajutor și, dacă este necesar, chemarea ambulanței. Salvarea vieții și limitarea consecințelor au întotdeauna prioritate față de orice altă considerație. După asigurarea asistenței medicale, locul accidentului trebuie securizat pentru a preveni alte accidente, dar păstrat nemodificat pentru investigație (doar dacă nu există pericole iminente). Trebuie notificați imediat: conducerea companiei, consultantul SSM, inspectoratul teritorial de muncă (în funcție de gravitate) și, pentru accidente grave sau mortale, parchetul.

## Obligații de raportare

Pentru accidente ușoare, angajatorul trebuie să întocmească fișa de evidență și să păstreze toate dovezile. Pentru accidente grave sau colective, ITM trebuie anunțat telefonic în maximum 24 de ore și în scris prin completarea formularului de declarare în maximum 3 zile lucrătoare. Pentru accidente mortale, anunțarea trebuie făcută imediat, iar investigația se realizează cu participarea reprezentanților ITM și organelor de cercetare penală. Nedeclararea unui accident de muncă constituie contravenție gravă și poate atrage răspundere penală.

## Investigarea accidentului

Investigația are ca scop identificarea cauzelor reale ale accidentului pentru a putea lua măsuri de prevenire. Echipa de cercetare (formată din angajator sau reprezentant, consultant SSM, reprezentant sindicat/angajați și eventual ITM) colectează informații prin: intervievarea victimei (dacă este posibil) și martorilor, analiza locului accidentului și echipamentelor implicate, examinarea documentației (instructaje, autorizări, evaluare riscuri), reconstruirea succesiunii evenimentelor. Este esențial să se identifice cauzele profunde, nu doar cele imediate sau aparente.

## Raportul de cercetare și măsurile corective

Rezultatele investigației se consemnează într-un raport de cercetare care include: descrierea detaliată a accidentului, cauzele identificate (tehnice, organizatorice, umane), vinovății (dacă există), măsurile dispuse pentru prevenirea repetării accidentului și termene de implementare. Raportul trebuie adus la cunoștința tuturor angajaților relevanți. Implementarea efectivă a măsurilor preventive este cea mai importantă consecință a investigației - un accident trebuie să fie o lecție învățată, nu doar o statistică.`,
    author: {
      name: 'Maria Ionescu',
      role: 'Consultant SSM',
    },
    category: 'Legal',
    publishDate: '2024-03-18',
    readTime: 9,
    tags: ['accident', 'raportare', 'investigare', 'ITM', 'prevenire'],
  },
];

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return blogArticles.find(article => article.slug === slug);
}

export function getArticlesByCategory(category: BlogArticle['category']): BlogArticle[] {
  return blogArticles.filter(article => article.category === category);
}

export function getArticlesByTag(tag: string): BlogArticle[] {
  return blogArticles.filter(article => article.tags.includes(tag));
}

export function getAllTags(): string[] {
  const tagsSet = new Set<string>();
  blogArticles.forEach(article => {
    article.tags.forEach(tag => tagsSet.add(tag));
  });
  return Array.from(tagsSet).sort();
}
