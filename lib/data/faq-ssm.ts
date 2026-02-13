/**
 * FAQ SSM - Întrebări Frecvente despre Securitatea și Sănătatea în Muncă
 *
 * Categorii:
 * - obligatii-angajator: Obligații generale ale angajatorului
 * - instructaj: Instructaj SSM și PSI
 * - eip: Echipament Individual de Protecție
 * - accidente: Accidente de muncă și boli profesionale
 * - control-itm: Control ITM și inspecții
 * - amenzi: Amenzi și sancțiuni
 * - documente: Documente și evidențe SSM
 */

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'obligatii-angajator' | 'instructaj' | 'eip' | 'accidente' | 'control-itm' | 'amenzi' | 'documente';
  legalReference: string;
}

export const faqCategories = {
  'obligatii-angajator': 'Obligații angajator',
  'instructaj': 'Instructaj SSM',
  'eip': 'Echipament Individual de Protecție',
  'accidente': 'Accidente de muncă',
  'control-itm': 'Control ITM',
  'amenzi': 'Amenzi și sancțiuni',
  'documente': 'Documente SSM'
} as const;

export const faqData: FaqItem[] = [
  // OBLIGAȚII ANGAJATOR
  {
    id: 'ob-01',
    question: 'Care sunt obligațiile de bază ale angajatorului în domeniul SSM?',
    answer: 'Angajatorul are obligația să asigure securitatea și sănătatea lucrătorilor în toate aspectele legate de muncă. Trebuie să organizeze activitatea de prevenire și protecție, să evalueze riscurile pentru fiecare loc de muncă, să instruiască periodic angajații și să asigure supravegherea medicală. De asemenea, are obligația să furnizeze echipamentul individual de protecție gratuit și să actualizeze documentația SSM în funcție de modificările din activitate.',
    category: 'obligatii-angajator',
    legalReference: 'Legea 319/2006, art. 6-7'
  },
  {
    id: 'ob-02',
    question: 'Este obligatoriu să angajez consultant SSM extern sau pot desemna salariat?',
    answer: 'Dacă firma are sub 50 de angajați, poți opta pentru servicii externe SSM de la consultant autorizat. Pentru firme cu 50-249 angajați, trebuie un specialist SSM cu normă parțială (minim 25%). Peste 250 angajați, e obligatoriu un specialist SSM cu normă întreagă. Alternativ, angajatorul poate urma cursul de 80 ore și poate asigura el însuși SSM dacă are sub 9 angajați și lucrează efectiv în firmă.',
    category: 'obligatii-angajator',
    legalReference: 'Legea 319/2006, art. 18; HG 1425/2006'
  },
  {
    id: 'ob-03',
    question: 'Trebuie să organizez comitet de securitate și sănătate în muncă?',
    answer: 'Comitetul de securitate și sănătate în muncă este obligatoriu pentru firmele cu minimum 50 de angajați. Comitetul are rol consultativ și include reprezentanți ai angajatorului și ai lucrătorilor. Se întrunește trimestrial sau ori de câte ori este necesar și avizează măsurile de prevenire, documentația SSM și programul anual de instruire. Angajatorul trebuie să asigure condițiile pentru funcționarea comitetului.',
    category: 'obligatii-angajator',
    legalReference: 'Legea 319/2006, art. 18; HG 1425/2006, art. 27-35'
  },
  {
    id: 'ob-04',
    question: 'Cum se face evaluarea riscurilor de accidentare și îmbolnăvire profesională?',
    answer: 'Evaluarea riscurilor se realizează de către lucrători cu competență SSM (consultant sau specialist) pentru fiecare loc de muncă. Se identifică pericolele, se evaluează riscurile asociate, se stabilesc măsuri de prevenire și se întocmește Planul de prevenire și protecție. Evaluarea se revizuiește periodic, după accidente, modificări tehnologice sau la solicitarea ITM. Documentul trebuie aprobat de angajator și adus la cunoștința lucrătorilor.',
    category: 'obligatii-angajator',
    legalReference: 'Legea 319/2006, art. 10; HG 1425/2006, art. 63-76'
  },
  {
    id: 'ob-05',
    question: 'Care este diferența între consultant SSM și responsabil PSI?',
    answer: 'Consultantul SSM se ocupă de securitatea și sănătatea în muncă (prevenirea accidentelor și bolilor profesionale), în timp ce responsabilul PSI gestionează prevenirea și stingerea incendiilor. SSM este reglementat de Legea 319/2006, iar PSI de Legea 307/2006. Ambele servicii sunt obligatorii, dar separate. Multe persoane dețin ambele autorizații și pot furniza servicii integrate, dar documentația și responsabilitățile sunt distincte.',
    category: 'obligatii-angajator',
    legalReference: 'Legea 319/2006; Legea 307/2006'
  },
  {
    id: 'ob-06',
    question: 'Trebuie să am autorizație de funcționare din punct de vedere al securității în muncă?',
    answer: 'Da, angajatorul are obligația să obțină autorizația de funcționare din punct de vedere al securității în muncă de la Inspectoratul Teritorial de Muncă. Autorizația se solicită înainte de începerea activității și se reînnoiește la modificări importante ale activității sau la schimbarea sediului. Pentru obținere, trebuie să ai întocmită documentația SSM (evaluarea riscurilor, fișe de instruire, contract cu consultant SSM sau specialist angajat).',
    category: 'obligatii-angajator',
    legalReference: 'Legea 319/2006, art. 11; HG 1425/2006, art. 77-82'
  },

  // INSTRUCTAJ
  {
    id: 'in-01',
    question: 'Ce tipuri de instructaje SSM există și când se efectuează?',
    answer: 'Există 5 tipuri de instructaje: instructajul general (la angajare), instructajul la locul de muncă (înainte de începerea activității), instructajul periodic (anual sau semestrial, după caz), instructajul suplimentar (la introducerea de utilaje noi, modificări tehnologice) și instructajul ocazional (pentru vizitatori, delegați). Instructajul la locul de muncă se face obligatoriu înainte ca angajatul să înceapă lucrul efectiv și trebuie însoțit de verificarea cunoștințelor.',
    category: 'instructaj',
    legalReference: 'HG 1425/2006, art. 190-203'
  },
  {
    id: 'in-02',
    question: 'Cine poate efectua instructajul SSM?',
    answer: 'Instructajul general se efectuează de către persoana desemnată de angajator (consultant SSM sau specialist SSM). Instructajul la locul de muncă se face de către șeful direct sau persoană desemnată care cunoaște perfect riscurile postului. Instructajul periodic poate fi făcut de șeful ierarhic direct, iar dacă firma nu are suficiente competențe interne, poate apela la consultantul SSM extern. Este esențial ca persoana care instruiește să aibă cunoștințele necesare.',
    category: 'instructaj',
    legalReference: 'HG 1425/2006, art. 193-197'
  },
  {
    id: 'in-03',
    question: 'Cat de des se face instructajul periodic și cum se documentează?',
    answer: 'Instructajul periodic se efectuează anual pentru lucrări cu risc scăzut și semestrial sau chiar lunar pentru lucrări cu risc crescut (înălțime, spații confinate, substanțe toxice). Fiecare instructaj trebuie consemnat în fișa individuală de instructaj a angajatului, semnată de instructor și instruit. Se verifică cunoștințele prin probe orale sau practice și rezultatul se consemnează. Fișele de instructaj se păstrează pe toată durata contractului de muncă și 5 ani după încetare.',
    category: 'instructaj',
    legalReference: 'HG 1425/2006, art. 199-203'
  },
  {
    id: 'in-04',
    question: 'Ce se întâmplă dacă angajatul refuză să participe la instructaj?',
    answer: 'Participarea la instructajele SSM este obligatorie conform Legii 319/2006. Dacă angajatul refuză, angajatorul trebuie să îi comunice în scris consecințele și să îi solicite prezența. Refuzul repetat poate constitui abatere disciplinară și poate duce la aplicarea sancțiunilor prevăzute în Regulamentul Intern, inclusiv desfacerea contractului de muncă. De asemenea, angajatul nu poate fi admis la lucru fără instructaj, conform reglementărilor SSM.',
    category: 'instructaj',
    legalReference: 'Legea 319/2006, art. 28; Codul Muncii, art. 247-248'
  },
  {
    id: 'in-05',
    question: 'Trebuie refăcut instructajul după revenirea din concediu medical lung?',
    answer: 'Da, după absențe îndelungate (peste 30 zile) datorate concediului medical, maternitate sau alte motive, angajatul trebuie supus unui instructaj de revenire. Acesta acoperă modificările intervenite în timpul absenței, rememorarea procedurilor de siguranță și verificarea aptitudinilor. Nu este același lucru cu instructajul la locul de muncă, dar are caracter obligatoriu. Se consemnează în fișa individuală de instructaj cu mențiunea "instructaj de revenire".',
    category: 'instructaj',
    legalReference: 'HG 1425/2006, art. 201'
  },
  {
    id: 'in-06',
    question: 'Există obligația să instruiesc angajații în limba pe care o înțeleg?',
    answer: 'Da, instructajul trebuie efectuat într-o limbă pe care angajatul o înțelege perfect. Pentru lucrătorii străini sau care nu vorbesc limba română, angajatorul are obligația să asigure traducere sau să folosească materiale multilingve. Este inacceptabil din punct de vedere legal și etic să se facă instructaj într-o limbă pe care angajatul nu o înțelege, deoarece acesta nu își poate însuși informațiile de securitate necesare.',
    category: 'instructaj',
    legalReference: 'HG 1425/2006, art. 192'
  },

  // ECHIPAMENT INDIVIDUAL DE PROTECȚIE
  {
    id: 'eip-01',
    question: 'Cine suportă costurile pentru echipamentul individual de protecție?',
    answer: 'Angajatorul are obligația legală să furnizeze gratuit echipamentul individual de protecție (EIP) necesar fiecărui angajat, în funcție de riscurile evaluate la locul de muncă. Nu se pot percepe costuri de la angajați și nu se poate deduce din salariu. De asemenea, angajatorul trebuie să asigure întreținerea, curățarea, dezinfectarea și înlocuirea EIP deteriorat. Cheltuielile cu EIP sunt integral deductibile fiscal pentru companie.',
    category: 'eip',
    legalReference: 'Legea 319/2006, art. 8; HG 1048/2006'
  },
  {
    id: 'eip-02',
    question: 'Cum stabilesc ce echipament de protecție trebuie să ofer angajaților?',
    answer: 'Echipamentul individual de protecție se stabilește pe baza evaluării riscurilor și conform Hotărârii 1048/2006, care prevede categoriile de EIP pentru fiecare tip de activitate. Pentru fiecare loc de muncă se întocmește o Fișă de dotare cu EIP care specifică: cască, mănuși, ochelari, încălțăminte de protecție, protecții auditive etc. și normele de înlocuire. Consultantul SSM te ajută să determini corect EIP necesar în funcție de riscurile identificate.',
    category: 'eip',
    legalReference: 'HG 1048/2006'
  },
  {
    id: 'eip-03',
    question: 'Ce fac dacă angajatul refuză să poarte echipamentul de protecție?',
    answer: 'Purtarea EIP este obligatorie conform legii și a Regulamentului Intern. Dacă angajatul refuză, nu îi permiți accesul în zonele cu risc. Documentezi refuzul în scris și aplici sancțiuni disciplinare progresive: avertisment scris, reducere salariu, suspendare, eventual desfacere contract. Responsabilitatea pentru accident revenind angajatului dacă nu purta EIP obligatoriu. Este esențial să ai dovada că ai furnizat EIP, ai instruit angajatul și ai supervizat respectarea obligației.',
    category: 'eip',
    legalReference: 'Legea 319/2006, art. 28; Codul Muncii, art. 264'
  },
  {
    id: 'eip-04',
    question: 'Care este perioada de utilizare pentru echipamentul de protecție?',
    answer: 'Normele de dotare cu EIP prevăd perioade standard: încălțăminte de protecție 12-18 luni, mănuși 1-6 luni (în funcție de tip), căști de protecție până la deteriorare, ochelari de protecție 12 luni, halate 18-24 luni. Aceste termene sunt orientative - dacă echipamentul se deteriorează mai repede, trebuie înlocuit imediat. Se întocmește Fișă de evidență individuală EIP pentru fiecare angajat, semnată la primire.',
    category: 'eip',
    legalReference: 'HG 1048/2006, Anexa 2'
  },
  {
    id: 'eip-05',
    question: 'Trebuie să asigur EIP și pentru lucrătorii temporari sau delegați?',
    answer: 'Da, absolut. Orice persoană care intră în spațiul tău de producție sau în zone cu risc trebuie dotată cu EIP corespunzător, indiferent de tipul contractului (angajat propriu, delegat, munca temporară, colaborator). Angajatorul la care se prestează activitatea are responsabilitatea să asigure protecția tuturor persoanelor prezente. Pentru vizitatori sau persoane care intră ocazional, asiguri EIP de utilizare comună (cască vizitator, vest reflectorizant).',
    category: 'eip',
    legalReference: 'Legea 319/2006, art. 8; Legea 53/2003, art. 94'
  },
  {
    id: 'eip-06',
    question: 'EIP trebuie să aibă certificare sau declarație de conformitate?',
    answer: 'Da, tot echipamentul individual de protecție trebuie să respecte cerințele esențiale de sănătate și securitate și să fie marcat CE. Furnizorul trebuie să îți dea declarația de conformitate și, pentru EIP categoria II și III (riscuri medii și ridicate), certificatul de examinare UE. Păstrează aceste documente - sunt verificate de ITM. Nu cumpăra EIP fără certificare, chiar dacă este mai ieftin, deoarece este ilegal și pui în pericol angajații.',
    category: 'eip',
    legalReference: 'Regulamentul UE 2016/425; HG 1029/2008'
  },

  // ACCIDENTE DE MUNCĂ
  {
    id: 'ac-01',
    question: 'Ce este considerat accident de muncă și care sunt criteriile?',
    answer: 'Accidentul de muncă este vătămarea violentă a organismului, îmbolnăvirea acută sau decesul, produse în timpul procesului de muncă sau în îndeplinirea îndatoririlor de serviciu. Trebuie îndeplinite 3 criterii: să se producă la locul de muncă sau în deplasare în interes de serviciu, în timpul programului de lucru sau intervalelor de odihnă, și să existe legătură de cauzalitate cu munca prestată. Accidentele în afara programului sau în drum spre/de la serviciu nu sunt accidente de muncă.',
    category: 'accidente',
    legalReference: 'Legea 346/2002, art. 3; HG 355/2007, art. 2'
  },
  {
    id: 'ac-02',
    question: 'Ce obligații am imediat după producerea unui accident de muncă?',
    answer: 'Imediat după accident, acorzi sau asiguri primul ajutor și transport medical urgență. Oprești activitatea dacă pericolul persistă și securizezi locul accidentului. Anunți ITM în maxim 3 zile lucrătoare și declari online accidentul în Revisal. Constitui comisia de cercetare (cu reprezentant ITM pentru accidente grave, colective sau mortale). Nu modifici situația de la locul accidentului până la finalizarea anchetei, exceptând salvarea victimelor.',
    category: 'accidente',
    legalReference: 'Legea 319/2006, art. 24; HG 1425/2006, art. 28-40'
  },
  {
    id: 'ac-03',
    question: 'Cine face parte din comisia de cercetare a accidentului de muncă?',
    answer: 'Comisia de cercetare include minimum 3 persoane: reprezentant al angajatorului (de regulă șeful direct), reprezentant al lucrătorilor (lider sindical sau ales de colectiv) și specialist SSM. Pentru accidente grave, colective sau mortale, participă obligatoriu și inspector ITM. Comisia are 15 zile să întocmească Procesul verbal de cercetare, în care stabilește cauzele, împrejurările și măsurile de prevenire. Nerespectarea procedurii atrage sancțiuni pentru angajator.',
    category: 'accidente',
    legalReference: 'HG 1425/2006, art. 33-40'
  },
  {
    id: 'ac-04',
    question: 'Pot fi tras la răspundere penal pentru accidente de muncă?',
    answer: 'Da, angajatorul sau persoanele responsabile cu SSM pot răspunde penal dacă accidentul s-a produs din culpă (neglijență, nerespectare legislație) și a rezultat vătămare corporală gravă sau deces. Infracțiunea de vătămare corporală din culpă sau ucidere din culpă se pedepsește conform Codului Penal. De asemenea, pot fi aplicate amenzi contravenționale și daune civile. Este esențial să îndeplinești toate obligațiile SSM pentru a preveni răspunderea penală.',
    category: 'accidente',
    legalReference: 'Codul Penal, art. 192, 196; Legea 319/2006, art. 44'
  },
  {
    id: 'ac-05',
    question: 'Care este diferența între accident de muncă și boală profesională?',
    answer: 'Accidentul de muncă este o vătămare violentă, produsă brusc (moment unic), în timp ce boala profesională este afectare a sănătății cauzată de expunere prelungită la factori de risc profesional (substanțe chimice, zgomot, vibrații, praf). Bolile profesionale sunt enumerate în listele oficiale și se stabilesc prin investigație epidemiologică. Ambele dau dreptul la despăgubiri de la asigurări sociale, dar procedura de recunoaștere a bolii profesionale este mai complexă și implică Comisia de expertize medicale.',
    category: 'accidente',
    legalReference: 'Legea 346/2002; HG 1425/2006, art. 41-59'
  },
  {
    id: 'ac-06',
    question: 'Trebuie să am încheiat asigurare pentru riscul de accident de muncă?',
    answer: 'Nu există asigurare obligatorie privată pentru accidente de muncă, însă angajatorul plătește contribuția la asigurări sociale de stat (CAM), care acoperă riscul de accident și boală profesională. Din această contribuție, angajatul primește despăgubiri, indemnizație, spitalizare. Multe firme încheie totuși asigurări private suplimentare pentru angajați, pentru acoperiri mai mari și proceduri mai rapide, dar nu este obligatoriu legal. Asigurarea răspunderii civile delictuale este recomandată.',
    category: 'accidente',
    legalReference: 'Legea 346/2002, art. 42-52'
  },

  // CONTROL ITM
  {
    id: 'ct-01',
    question: 'Cu ce frecvență vine ITM în control și cum mă pregătesc?',
    answer: 'Inspectoratul Teritorial de Muncă poate efectua controale neplanificate oricând sau planificate periodic. Nu există frecvență fixă, dar firmele cu risc crescut sau istoric de neconformități sunt verificate mai des. Pentru a fi pregătit: asigură-te că ai documentația SSM completă și actualizată, fișele de instructaj semnate, contractul cu consultant SSM valabil, EIP disponibil pentru toți angajații, registrul agricol electronic la zi, și evidența timpului de lucru conformă.',
    category: 'control-itm',
    legalReference: 'Legea 108/1999; OUG 96/2003'
  },
  {
    id: 'ct-02',
    question: 'Ce documente verifică inspectorul ITM la control SSM?',
    answer: 'Inspectorul ITM verifică: autorizația de funcționare SSM, contractul/decizia pentru servicii SSM, fișierul cu evaluarea riscurilor și planul de prevenire, fișele postului cu atribuțiile SSM, fișele individuale de instructaj actualizate, avizele medicale de la medicina muncii, dotarea cu EIP și fișele de eliberare, registrul de evidență a accidentelor de muncă, procese verbale de cercetare a accidentelor, și rapoartele anuale de activitate SSM.',
    category: 'control-itm',
    legalReference: 'Legea 319/2006; HG 1425/2006; OUG 96/2003'
  },
  {
    id: 'ct-03',
    question: 'Pot refuza accesul inspectorului ITM în firmă?',
    answer: 'Nu, refuzul accesului inspectorului ITM constituie infracțiune de ultraj și obstrucționarea activității de control. Inspectorul are dreptul legal să intre liber în orice unitate, fără anunț prealabil, să verifice documente, să discute cu angajații și să ia fotografii. Trebuie să pui la dispoziție toate documentele solicitate și să asiguri acces în toate zonele. Obstrucționarea poate atrage amendă penală și chiar închisoare. Colaborarea promptă este în interesul tău.',
    category: 'control-itm',
    legalReference: 'Legea 108/1999, art. 16; Codul Penal, art. 257'
  },
  {
    id: 'ct-04',
    question: 'Pot contesta procesul verbal de contravenție aplicat de ITM?',
    answer: 'Da, poți contesta procesul verbal de contravenție în termen de 15 zile de la comunicare, la judecătoria în a cărei circumscripție s-a săvârșit contravenția. Contestația suspendă executarea, deci nu plătești amenda până la soluționarea definitivă. Este recomandat să te consulți cu un avocat specializat în dreptul muncii pentru a pregăti o contestație fundamentată. Dacă recunoști nelegalitățile constatate, poți plăti în 15 zile cu reducere de 50%.',
    category: 'control-itm',
    legalReference: 'OG 2/2001, art. 31-35'
  },
  {
    id: 'ct-05',
    question: 'Ce înseamnă măsura de oprire a activității și când se aplică?',
    answer: 'Oprirea activității este cea mai severă măsură și se aplică când există pericol iminent pentru viața sau sănătatea lucrătorilor: muncă la înălțime fără protecție, utilaje fără apărători, lucru cu substanțe toxice fără autorizare, muncă nedeclarată, lipsă autorizație de securitate. Activitatea este oprită total sau parțial până la remedierea deficiențelor. Reluarea se face doar după verificare ITM și ridicare proces verbal de control. Oprirea nejustificată a activității poate fi contestată.',
    category: 'control-itm',
    legalReference: 'Legea 319/2006, art. 43; OUG 96/2003, art. 12'
  },
  {
    id: 'ct-06',
    question: 'Poate ITM să verifice și raporturile de muncă și salarizarea?',
    answer: 'Da, ITM verifică atât aspectele de SSM, cât și de relații de muncă: existența contractelor individuale de muncă, înregistrarea în Revisal, plata salariului minim pe economie și pe meserii, respectarea timpului de muncă și repaus, acordarea concediilor de odihnă, și plata orelor suplimentare. Inspectorii pot verifica pontaje, state de plată, ordine de plată, foi de prezență. Neregulile privind munca la negru, salariul sub minim sau neplata orelor suplimentare atrag amenzi majore.',
    category: 'control-itm',
    legalReference: 'Legea 108/1999; Legea 53/2003; OUG 96/2003'
  },

  // AMENZI ȘI SANCȚIUNI
  {
    id: 'am-01',
    question: 'Care sunt amenzile pentru lipsa documentației SSM?',
    answer: 'Amenzile pentru nerespectarea legislației SSM variază astfel: lipsa evaluării riscurilor 10.000-20.000 lei, lipsa instructajului SSM 1.500-3.000 lei/persoană neînstruită, lipsa serviciilor SSM 6.000-8.000 lei, lipsa EIP 1.500-3.000 lei/persoană, lipsa autorizației de funcționare 5.000-10.000 lei. Amenzile se aplică per neconformitate și se pot cumula. La recidivă, limitele se dublează. În plus, se pot dispune măsuri de oprire temporară a activității.',
    category: 'amenzi',
    legalReference: 'Legea 319/2006, art. 44; OUG 96/2003, art. 24'
  },
  {
    id: 'am-02',
    question: 'Ce sancțiuni risc pentru munca nedeclarată sau parțial nedeclarată?',
    answer: 'Munca nedeclarată (la negru) este sancționată foarte dur: amendă de 20.000 lei per persoană depistată, obligația plății tuturor contribuțiilor sociale și impozitelor cu majorări și penalități retroactiv, posibila oprire a activității și răspundere penală pentru evaziune fiscală dacă prejudiciul depășește 100.000 lei. Munca parțial nedeclarată (declarare salariu minim, dar plată mai mare) atrage aceleași sancțiuni. ITM colaborează cu ANAF și Poliția în astfel de cazuri.',
    category: 'amenzi',
    legalReference: 'Legea 53/2003, art. 260; Legea 241/2005; Codul Fiscal'
  },
  {
    id: 'am-03',
    question: 'Ce se întâmplă dacă nu declar accidentul de muncă?',
    answer: 'Nedeclararea sau declararea necorespunzătoare a accidentului de muncă constituie contravenție gravă, sancționată cu amendă de 15.000-20.000 lei pentru angajator. În plus, victima sau familia pot introduce acțiune civilă pentru daune morale și materiale. Dacă accidentul a avut urmări grave sau deces, nedeclararea poate constitui infracțiune de omisiune și favorizare. Angajatorul răspunde și pentru despăgubiri dacă se dovedește că accidentul s-a produs din culpa sa.',
    category: 'amenzi',
    legalReference: 'Legea 319/2006, art. 44; HG 1425/2006, art. 28'
  },
  {
    id: 'am-04',
    question: 'Pot beneficia de reducere la amendă dacă plătesc rapid?',
    answer: 'Da, conform OG 2/2001, dacă plătești amenda în termen de 15 zile de la data comunicării procesului verbal de contravenție, beneficiezi de o reducere de 50% din cuantumul amenzii. Plata cu reducere echivalează cu recunoașterea contravenției și renunțarea la contestație. Dacă ai contestat procesul verbal, nu mai poți beneficia de reducere. Reducerea se aplică doar la amenzile contravenționale, nu și la restituirea prejudiciilor sau măsurile complementare.',
    category: 'amenzi',
    legalReference: 'OG 2/2001, art. 29'
  },
  {
    id: 'am-05',
    question: 'Răspund penal sau doar contravențional pentru nerespectarea SSM?',
    answer: 'Depinde de gravitatea faptei. Majoritatea încălcărilor SSM sunt contravenții (amendă). Însă, dacă din nerespectarea normelor SSM rezultă un accident grav, vătămare corporală sau deces, angajatorul sau persoanele responsabile pot răspunde penal pentru infracțiuni de ucidere din culpă, vătămare din culpă sau de neluarea măsurilor de securitate în muncă. Pedeapsa poate fi închisoare de la 6 luni la 5 ani. Jurisprudența arată că instanțele condamnă efectiv în astfel de cazuri.',
    category: 'amenzi',
    legalReference: 'Codul Penal, art. 192, 196, 349; Legea 319/2006, art. 44'
  },
  {
    id: 'am-06',
    question: 'Angajații mei pot fi amendați individual pentru nerespectarea SSM?',
    answer: 'Da, lucrătorii au obligații legale de a respecta măsurile SSM, de a utiliza corect EIP, de a nu îndepărta dispozitivele de protecție și de a respecta instrucțiunile primite. Nerespectarea acestor obligații poate fi sancționată contravențional de către inspectorii ITM cu amendă între 100-500 lei. În plus, angajatorul poate aplica sancțiuni disciplinare conform Codului Muncii și Regulamentului Intern: avertisment, retrogradare, reducere salariu sau desfacere contract.',
    category: 'amenzi',
    legalReference: 'Legea 319/2006, art. 28, 44; Codul Muncii, art. 264'
  },

  // DOCUMENTE SSM
  {
    id: 'doc-01',
    question: 'Care sunt documentele SSM obligatorii pe care trebuie să le am în firmă?',
    answer: 'Documentele obligatorii SSM sunt: autorizația de funcționare ITM, contractul cu consultantul SSM sau decizia pentru specialist, fișierul cu evaluarea riscurilor pentru toate locurile de muncă, planul de prevenire și protecție, fișele de instruire (generale și pe posturi), fișele individuale de instructaj pentru fiecare angajat, fișele de dotare cu EIP pe posturi, registrul de evidență EIP, avizele medicale de la medicina muncii, raportul anual de activitate SSM, și dosarul cu procese verbale de cercetare a accidentelor (dacă există).',
    category: 'documente',
    legalReference: 'Legea 319/2006; HG 1425/2006'
  },
  {
    id: 'doc-02',
    question: 'Cât timp trebuie păstrate documentele SSM?',
    answer: 'Documentele SSM au termene diferite de păstrare: fișele individuale de instructaj se păstrează pe toată durata contractului de muncă plus 5 ani după încetare, evaluarea riscurilor și planul de prevenire se păstrează până la următoarea revizuire, dar minimum 5 ani, procesele verbale de cercetare a accidentelor se păstrează permanent (peste 75 ani), avizele medicale se păstrează conform legislației GDPR - 5 ani după încetare, rapoartele anuale SSM se păstrează 10 ani.',
    category: 'documente',
    legalReference: 'HG 1425/2006; Legea 16/1996; GDPR'
  },
  {
    id: 'doc-03',
    question: 'Trebuie să am fișa postului cu atribuții SSM pentru fiecare angajat?',
    answer: 'Da, fiecare angajat trebuie să aibă fișa postului care include o secțiune dedicată responsabilităților SSM specifice postului respectiv: cunoașterea și respectarea instrucțiunilor de protecție a muncii, utilizarea corectă a EIP, participarea la instructaje, sesizarea pericolelor, respectarea normelor de circulație și acces. Fișa postului se semnează de angajat la angajare și la fiecare modificare. Este verificată de ITM și dovedește că angajatul a fost informat despre responsabilitățile sale.',
    category: 'documente',
    legalReference: 'Codul Muncii, art. 17; Legea 319/2006, art. 28'
  },
  {
    id: 'doc-04',
    question: 'Este obligatoriu să am Regulament Intern și ce trebuie să conțină despre SSM?',
    answer: 'Regulamentul Intern este obligatoriu pentru angajatori cu minimum 10 salariați. Trebuie să conțină o secțiune despre securitatea și sănătatea în muncă: reguli de acces și circulație, obligația purtării EIP, regulile de utilizare a echipamentelor, interzicerea consumului de alcool/droguri, procedura de raportare a accidentelor, sancțiunile pentru nerespectarea normelor SSM. Regulamentul se înregistrează la ITM, se aduce la cunoștința angajaților și se afișează la loc vizibil.',
    category: 'documente',
    legalReference: 'Codul Muncii, art. 241-243; Legea 319/2006, art. 7'
  },
  {
    id: 'doc-05',
    question: 'Trebuie să întocmesc raport anual de activitate SSM?',
    answer: 'Da, angajatorul are obligația să întocmească anual raportul de activitate de prevenire și protecție, care se prezintă la Adunarea Generală a Acționarilor sau Asociaților. Raportul cuprinde: situația accidentelor de muncă și a bolilor profesionale, acțiunile de prevenire efectuate, programul de instruire realizat, investițiile în SSM, măsurile de protecție implementate și obiectivele pentru anul următor. Raportul se păstrează 10 ani și se poate solicita de ITM la control.',
    category: 'documente',
    legalReference: 'HG 1425/2006, art. 95-96'
  },
  {
    id: 'doc-06',
    question: 'Pot ține documentele SSM în format electronic sau trebuie pe hârtie?',
    answer: 'Documentele SSM pot fi ținute în format electronic, cu respectarea cerințelor legale de semnătură electronică calificată sau avansată. Fișele individuale de instructaj pot fi ținute electronic dacă sunt semnate cu semnătură electronică de ambele părți. La control ITM, trebuie să poți prezenta documentele imediat, fie pe ecran, fie tipărite. Este recomandat să ai backup permanent și să asiguri protecția datelor conform GDPR. Multe firme țin atât electronic (pentru ușurință), cât și un dosar fizic.',
    category: 'documente',
    legalReference: 'Legea 455/2001; Regulamentul eIDAS; GDPR'
  }
];

/**
 * Helper functions pentru filtrare și căutare
 */
export function getFaqByCategory(category: FaqItem['category']): FaqItem[] {
  return faqData.filter(item => item.category === category);
}

export function searchFaq(query: string): FaqItem[] {
  const lowerQuery = query.toLowerCase();
  return faqData.filter(
    item =>
      item.question.toLowerCase().includes(lowerQuery) ||
      item.answer.toLowerCase().includes(lowerQuery)
  );
}

export function getFaqById(id: string): FaqItem | undefined {
  return faqData.find(item => item.id === id);
}

export function getAllCategories(): Array<{ key: FaqItem['category']; label: string; count: number }> {
  return Object.entries(faqCategories).map(([key, label]) => ({
    key: key as FaqItem['category'],
    label,
    count: faqData.filter(item => item.category === key).length
  }));
}
