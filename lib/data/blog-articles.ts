export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  date: string;
  category: string;
  readTime: number;
  tags: string[];
  image?: string;
}

export const blogArticles: BlogArticle[] = [
  {
    slug: "cum-te-pregatesti-pentru-control-itm",
    title: "Cum te pregătești pentru un control ITM: Ghid complet 2026",
    excerpt: "Inspectoratul Teritorial de Muncă poate veni oricând. Descoperă ce documente trebuie să ai pregătite și cum eviți amenzile.",
    content: `# Cum te pregătești pentru un control ITM: Ghid complet 2026

Un control de la Inspectoratul Teritorial de Muncă (ITM) poate părea intimidant, dar cu o pregătire corectă, poți trece prin el fără probleme. În acest ghid complet, îți prezentăm tot ce trebuie să știi pentru a fi pregătit.

## Ce verifică ITM la un control

Inspectorii ITM verifică conformitatea companiei tale cu legislația muncii din România. Principalele aspecte verificate includ: contractele individuale de muncă (CIM), evidența programului de lucru, documentele de securitate și sănătate în muncă (SSM), precum și respectarea normelor de protecție a muncii.

## Documentele obligatorii

**Contracte și dosare personal**: Asigură-te că ai CIM-uri pentru toți angajații, înregistrate în Revisal în termen de 20 de zile de la angajare. Fișele de post trebuie să fie actualizate și semnate de fiecare angajat. Registrul general de evidență a salariaților trebuie completat corect.

**Documentație SSM**: Evaluarea riscurilor trebuie actualizată anual sau când apar modificări în procesul de muncă. Fișele de aptitudini sunt obligatorii pentru toți angajații și trebuie emise de medicul de medicina muncii. Programul de instruire în SSM trebuie să includă instructajul introductiv-general, instructajul la locul de muncă și instructajul periodic.

**Evidența timpului de lucru**: Foile colective de prezență sau sistemul electronic de pontaj trebuie să fie corecte și actualizate zilnic. Planificarea concediilor de odihnă pentru anul în curs trebuie afișată și comunicată angajaților. Evidența orelor suplimentare trebuie păstrată cu atenție, întrucât este frecvent verificată.

## Pregătirea zilei controlului

În ziua controlului, desemnează o persoană responsabilă care va interacționa cu inspectorii. De obicei, aceasta este reprezentantul legal sau responsabilul cu resursele umane. Pregătește un spațiu separat unde inspectorii pot lucra liniștit și pot consulta documentele.

Fii transparent și cooperant. Nu încerca să ascunzi probleme, ci explică situația reală. Inspectorii apreciază onestitatea și pot oferi recomandări în loc de amenzi, dacă văd bună-credință.

## Greșelile frecvente

**CIM-uri neînregistrate în Revisal**: Aceasta este cea mai frecventă greșeală și poate atrage amenzi substanțiale. Verifică periodic raportul Revisal să fie sincronizat cu realitatea.

**Evidența timpului de lucru incompletă**: Multe companii nu țin evidența corectă a orelor de muncă, ceea ce poate duce la suspiciuni de muncă la negru sau nedeclarată.

**Instructaje SSM neefectuate**: Lipsa dovezilor pentru instructajele periodice (semnături, procese-verbale) este o altă problemă frecventă care atrage amenzi considerabile.

## Sancțiuni și cum le eviți

Amenzile ITM variază de la 1.500 lei la 30.000 lei, în funcție de gravitatea abaterii. Pentru abateri grave, precum munca nedeclarată, amenzile pot ajunge până la 100.000 lei. Cel mai bun mod de a evita sancțiunile este să ai un sistem de compliance continuu, nu doar pregătiri de момента.

## Concluzie

Un control ITM nu trebuie să fie un coșmar. Cu documentație la zi, procese clare și transparență, poți trece prin control fără probleme. Investește în sisteme digitale de management al resurselor umane și SSM pentru a automatiza compliance-ul și a reduce riscul de erori umane.`,
    author: {
      name: "Daniel Popescu",
      role: "Consultant SSM Senior",
    },
    date: "2026-02-10",
    category: "Compliance",
    readTime: 8,
    tags: ["ITM", "Control", "Compliance", "Documentație SSM"],
  },
  {
    slug: "top-10-amenzi-ssm-romania-2026",
    title: "Top 10 amenzi SSM în România (2026): Cum le eviți",
    excerpt: "Lista celor mai frecvente amenzi pentru neconformități SSM și soluții practice pentru a le preveni.",
    content: `# Top 10 amenzi SSM în România (2026): Cum le eviți

În România, nerespectarea normelor de securitate și sănătate în muncă (SSM) poate costa companiile scump. Iată cele mai frecvente amenzi și cum le poți evita.

## 1. Lipsa evaluării riscurilor (10.000 - 20.000 lei)

Evaluarea riscurilor este documentul fundamental în SSM. Fiecare angajator are obligația să identifice pericolele la locul de muncă și să evalueze riscurile pentru fiecare post. Documentul trebuie actualizat anual sau când apar modificări semnificative în procesul de muncă.

**Soluția**: Angajează un consultant SSM sau folosește platforme digitale specializate pentru a crea și menține la zi evaluarea riscurilor. Include toți angajații în proces și asigură-te că fiecare a fost informat asupra riscurilor specifice postului său.

## 2. Absența fișelor de aptitudini (5.000 - 10.000 lei)

Fișa de aptitudini este documentul medical care atestă că angajatul este apt pentru postul ocupat. Aceasta trebuie emisă de medicul de medicina muncii înainte de angajare și reînnoită periodic conform riscurilor identificate.

**Soluția**: Stabilește un parteneriat cu o clinică de medicina muncii de încredere. Creează un calendar cu scadențele fișelor de aptitudini și trimite remind-uri automate angajaților cu 30 de zile înainte de expirare.

## 3. Instructaje SSM neefectuate (3.000 - 8.000 lei)

Instructajele în SSM sunt obligatorii: introductiv-general (la angajare), la locul de muncă (înainte de începerea activității) și periodic (anual sau semestrial). Fiecare instructaj trebuie documentat și semnat de angajat.

**Soluția**: Digitalizează procesul de instructaj. Folosește platforme online care permit e-learning pentru instructajul general și păstrează evidența electronică a tuturor semnăturilor și proceselor-verbale.

## 4. EIP necorespunzătoare sau absente (8.000 - 15.000 lei)

Echipamentele individuale de protecție (EIP) trebuie să fie adecvate riscurilor, certificate conform standardelor europene și distribuite gratuit tuturor angajaților expuși la riscuri. Evidența EIP trebuie păstrată riguros.

**Soluția**: Creează o fișă personalizată pentru fiecare angajat cu EIP-urile necesare conform fișei postului. Păstrează dovada distribuirii (semnături, fotografii) și înlocuiește EIP-urile deteriorate imediat.

## 5. Lipsa autorizațiilor pentru lucrări periculoase (10.000 - 25.000 lei)

Pentru lucrări în spații închise, lucrări la înălțime, lucrări la instaliții electrice sub tensiune și alte activități periculoase, este necesară autorizația prealabilă și permisul de lucru.

**Soluția**: Identifică toate activitățile periculoase din companie. Întocmește proceduri clare pentru emiterea permiselor de lucru și asigură-te că personalul responsabil este instruit corespunzător.

## 6. Comitetul de securitate lipsă (5.000 - 10.000 lei)

Companiile cu peste 50 de angajați au obligația de a constitui Comitetul de Securitate și Sănătate în Muncă (CSSM). Acesta trebuie să se întrunească trimestrial și să țină evidența ședințelor.

**Soluția**: Constituie CSSM conform legii, cu reprezentanți ai angajatorului și ai angajaților. Programează ședințe trimestriale și documentează procesele-verbale. Afișează componența CSSM la loc vizibil.

## 7. Planul de prevenire și protecție absent (6.000 - 12.000 lei)

Planul de prevenire și protecție (PPP) este documentul care cuprinde măsurile concrete de prevenire a accidentelor de muncă și bolilor profesionale. Trebuie actualizat anual.

**Soluția**: Colaborează cu consultantul SSM pentru a elabora un PPP realist și aplicabil. Include responsabilități clare, termene și buget pentru fiecare măsură de prevenție.

## 8. Registre SSM incomplete (2.000 - 5.000 lei)

Registrele SSM obligatorii includ: registrul de instructaj, registrul de evidență a accidentelor de muncă, registrul de evidență a echipamentelor de muncă și altele specifice domeniului de activitate.

**Soluția**: Centralizează toate registrele SSM într-o platformă digitală. Automatizează completarea și primește notificări când sunt necesare actualizări.

## 9. Verificări tehnice neefectuate (7.000 - 15.000 lei)

Echipamentele de muncă trebuie verificate periodic de persoane autorizate (ISCIR pentru echipamente sub presiune, electromecanici autorizați pentru instalații electrice etc.). Lipsa verificărilor sau a documentației poate atrage amenzi grave.

**Soluția**: Creează un calendar anual cu toate verificările tehnice obligatorii. Contractează furnizori autorizați și păstrează toate buletinele de verificare într-un dosar unic.

## 10. Marcaj de securitate lipsă (3.000 - 7.000 lei)

Marcajul de securitate (indicatoare, panouri de avertizare, marcaje podea) trebuie să fie vizibil, în conformitate cu standardele și actualizat permanent. Absența acestuia sau degradarea poate atrage sancțiuni.

**Soluția**: Realizează un audit al marcajului de securitate existent. Comandă indicatoare conform standardelor SR EN ISO 7010 și stabilește un program de verificare semestrială a stării acestora.

## Concluzie

Prevenirea este mai ieftină decât amenzile. Investește în sisteme de management SSM profesionale, colaborează cu consultanți de încredere și menține documentația la zi. Un sistem digital de compliance SSM poate reduce dramatic riscul de amenzi și poate îmbunătăți cultura de securitate în companie.`,
    author: {
      name: "Daniel Popescu",
      role: "Consultant SSM Senior",
    },
    date: "2026-02-08",
    category: "Legislație",
    readTime: 10,
    tags: ["Amenzi", "SSM", "Compliance", "Prevenție"],
  },
  {
    slug: "ghid-evaluare-riscuri-profesionale",
    title: "Ghid complet: Evaluarea riscurilor profesionale pas cu pas",
    excerpt: "Tot ce trebuie să știi despre evaluarea riscurilor: metodologii, etape practice și exemple concrete.",
    content: `# Ghid complet: Evaluarea riscurilor profesionale pas cu pas

Evaluarea riscurilor profesionale este fundația oricărui sistem de management al securității și sănătății în muncă. Iată cum să o realizezi corect.

## Ce este evaluarea riscurilor?

Evaluarea riscurilor este procesul sistematic de identificare a pericolelor la locul de muncă, evaluare a probabilității și severității consecințelor și stabilirea măsurilor de prevenire și protecție. Este obligatorie pentru toate companiile, indiferent de mărime sau domeniu.

Documentul de evaluare a riscurilor (DUER) trebuie să fie actualizat anual sau ori de câte ori apar modificări semnificative: noi echipamente, noi procese tehnologice, schimbări în organizare sau după un accident de muncă.

## Cadrul legal

În România, evaluarea riscurilor este reglementată de Legea 319/2006 și HG 1425/2006. Angajatorul are obligația legală să asigure securitatea și sănătatea lucrătorilor în toate aspectele legate de muncă. Nerespectarea acestei obligații poate atrage amenzi între 10.000 și 20.000 lei.

## Etapa 1: Identificarea pericolelor

**Pericolele fizice**: zgomot, vibrații, iluminat inadecvat, temperatură extremă, radiații, electricitate. Acestea sunt cele mai frecvente în mediul industrial și de construcții.

**Pericolele chimice**: substanțe toxice, corozive, inflamabile, pulberi, vapori. Orice substanță chimică utilizată trebuie să aibă fișa de securitate (MSDS) și trebuie evaluate riscurile de expunere.

**Pericolele biologice**: bacterii, viruși, fungi, paraziți. Relevante pentru spitale, laboratoare, industria alimentară, agricultură.

**Pericolele ergonomice**: posturi de muncă neergonomice, mișcări repetitive, manipulare manuală de sarcini, poziții forțate. Acestea pot cauza afecțiuni musculo-scheletice pe termen lung.

**Pericolele psihosociale**: stres, hărțuire, violență, program prelungit, muncă monotonă. Deși mai greu de cuantificat, impactul asupra sănătății poate fi semnificativ.

## Etapa 2: Identificarea persoanelor expuse

Nu toți angajații sunt expuși la aceleași riscuri. Grupează angajații după posturi similare (Grup Omogen de Expunere - GOE) și identifică:
- Numărul de persoane expuse
- Durata expunerii (ore/zi, zile/an)
- Categoria speciale: tineri sub 18 ani, femei gravide, persoane cu dizabilități

## Etapa 3: Evaluarea riscurilor

Pentru fiecare pericol identificat, evaluează:

**Probabilitatea (P)**: Ce șanse sunt să se producă un accident sau îmbolnăvire?
- 1 = Puțin probabil
- 2 = Probabil
- 3 = Foarte probabil

**Severitatea (S)**: Cât de grave ar fi consecințele?
- 1 = Leziuni minore
- 2 = Leziuni medii, absențe scurte
- 3 = Leziuni grave, invaliditate sau deces

**Nivelul de risc (R) = P × S**:
- 1-2: Risc minor (verde)
- 3-4: Risc mediu (galben)
- 6-9: Risc major (roșu)

## Etapa 4: Stabilirea măsurilor de prevenire

Conform principiului ierarhizării măsurilor de prevenție:

**Nivel 1 - Eliminarea pericolului**: Înlocuiește substanța toxică cu una inofensivă, automatizează procesul periculos.

**Nivel 2 - Protecție colectivă**: Ventilație, insonorizare, balustrade, garduri de protecție, sisteme de detecție.

**Nivel 3 - Protecție individuală**: EIP (echipamente individuale de protecție) - căști, mănuși, ochelari, măști.

**Nivel 4 - Măsuri organizatorice**: Rotația personalului, reducerea timpului de expunere, instruire, supraveghere.

## Etapa 5: Documentarea

Evaluarea riscurilor trebuie documentată într-un format clar și accesibil:
- Fișă de evaluare pentru fiecare post de muncă
- Lista pericolelor și riscurilor
- Nivelul de risc calculat
- Măsuri de prevenire stabilite
- Responsabili și termene
- Semnături: evaluator, reprezentant CSSM, angajator

## Etapa 6: Comunicarea și instruirea

Evaluarea riscurilor nu este un document birocratic, ci un instrument de lucru:
- Fiecare angajat trebuie informat despre riscurile postului său
- Integrează evaluarea în instructajul la locul de muncă
- Afișează sinteze la loc vizibil
- Folosește evaluarea pentru planificarea măsurilor de prevenție

## Monitorizare și actualizare

Programează revizuiri periodice:
- Anual (obligatoriu)
- După achiziția de noi echipamente
- După modificări în procesul tehnologic
- După un accident de muncă
- La recomandarea inspectorilor ITM/ISU/DSP

## Greșeli frecvente

**Evaluare prea generică**: Nu copia modele de pe internet. Fiecare loc de muncă este unic.

**Subestimarea riscurilor**: Fii realist. Un risc evaluat greșit poate duce la accidente.

**Lipsa măsurilor concrete**: Nu scrie măsuri vagi gen "se va avea grijă". Specifică exact ce, cine, când.

**Neimplicarea angajaților**: Ei cunosc cel mai bine pericolele. Consultă-i în procesul de evaluare.

## Concluzie

Evaluarea riscurilor este un proces continuu, nu o formalitate unică. Investește timp și resurse în realizarea corectă, implică angajații și actualizează permanent. O evaluare de calitate protejează viața angajaților și te scutește de amenzi și accidente.`,
    author: {
      name: "Daniel Popescu",
      role: "Consultant SSM Senior",
    },
    date: "2026-02-05",
    category: "SSM",
    readTime: 12,
    tags: ["Evaluare riscuri", "SSM", "Metodologie", "DUER"],
  },
  {
    slug: "nis2-directive-imm-uri-romania",
    title: "Directiva NIS2: Ce trebuie să știe IMM-urile din România",
    excerpt: "Ghid practic despre noua directivă europeană de securitate cibernetică și impactul asupra companiilor românești.",
    content: `# Directiva NIS2: Ce trebuie să știe IMM-urile din România

Directiva NIS2 (Network and Information Security) aduce schimbări majore în securitatea cibernetică la nivel european. Dacă ai o companie în România, iată ce trebuie să știi.

## Ce este NIS2?

NIS2 este actualizarea directivei europene privind securitatea rețelelor și a sistemelor informatice, adoptată în 2022 și transpusă în legislația românească în 2024. Obiectivul: creșterea nivelului de securitate cibernetică în UE, în contextul creșterii atacurilor informatice.

Față de varianta anterioară (NIS1), NIS2 extinde semnificativ numărul de sectoare acoperite și include și companii medii, nu doar marile corporații.

## Cine este afectat?

**Entități esențiale** (10+ sectoare): energie, transport, bancă, infrastructură financiară, sănătate, apă, infrastructură digitală, administrație publică, spațiu.

**Entități importante** (8+ sectoare): servicii poștale, gestionare deșeuri, industrie chimică, producție alimentară, industrie prelucrătoare, furnizori digitali, cercetare.

**Criteriul dimensiunii**: Companiile cu 50+ angajați și cifră de afaceri/bilanț peste 10 milioane EUR intră sub incidența NIS2 dacă activează în sectoarele menționate.

## Obligații principale pentru companii

**1. Măsuri tehnice și organizatorice**

Companiile trebuie să implementeze măsuri de securitate cibernetică adecvate riscurilor:
- Politici de securitate a informațiilor
- Managementul incidentelor de securitate
- Continuitate operațională (backup, disaster recovery)
- Securitatea lanțului de aprovizionare
- Evaluarea regulată a vulnerabilităților
- Criptografie și control acces
- Securitate fizică a infrastructurii IT

**2. Raportarea incidentelor**

Companiile au obligația de a raporta incidentele de securitate cibernetică către CERT-RO:
- Notificare inițială: în 24 ore de la detectare
- Raport intermediar: în 72 ore
- Raport final: în maxim 1 lună

Neraportarea incidentelor atrage sancțiuni severe.

**3. Managementul riscurilor**

Evaluarea riscurilor cibernetice trebuie să fie un proces continuu:
- Identificarea activelor critice
- Analiza amenințărilor și vulnerabilităților
- Evaluarea impactului potential
- Plan de tratare a riscurilor
- Monitorizare și revizuire periodică

## Guvernanța corporativă

NIS2 aduce o schimbare importantă: **responsabilitatea personală a conducerii**. Managementul de vârf (CA, CEO, directori) devine direct responsabil pentru conformitatea cu NIS2. Aceștia trebuie să:
- Aprobe măsurile de securitate cibernetică
- Monitorizeze implementarea
- Participe la training-uri specifice
- Răspundă personal în caz de neconformitate

## Sancțiuni

NIS2 prevede amenzi substanțiale pentru neconformitate:

**Entități esențiale**: până la 10.000.000 EUR sau 2% din cifra de afaceri globală anuală (oricare este mai mare)

**Entități importante**: până la 7.000.000 EUR sau 1,4% din cifra de afaceri globală

Pe lângă amenzi, autoritățile pot impune:
- Obligativitatea unui audit extern
- Interdicții temporare de exercitare a funcțiilor de conducere
- Publicarea neconformităților

## Pași pentru conformare

**Pas 1: Evaluare inițială** (Săptămânile 1-2)
- Verifică dacă intri sub incidența NIS2
- Identifică sectorul și categoria (esențială/importantă)
- Realizează un gap analysis: ce ai vs ce cere NIS2

**Pas 2: Politici și proceduri** (Luna 1-2)
- Elaborează Politica de Securitate Informațională
- Creează proceduri pentru managementul incidentelor
- Stabilește responsabilități clare (rol CISO sau echivalent)

**Pas 3: Măsuri tehnice** (Luna 2-4)
- Implementează soluții de detectare și răspuns (EDR, SIEM)
- Configurează backup-uri automate și testate
- Segmentează rețeaua
- Implementează autentificare multi-factor (MFA)

**Pas 4: Training și conștientizare** (Luna 3-6)
- Instruiește managementul superior
- Training pentru echipa IT
- Campanii de awareness pentru toți angajații

**Pas 5: Testare și audit** (Luna 6+)
- Teste de penetrare (pentest)
- Simulări de incident (tabletop exercises)
- Audit extern pentru validare

## Securitatea lanțului de aprovizionare

NIS2 cere atenție specială la furnizorii terți:
- Evaluarea securității cibernetice a partenerilor
- Clauze contractuale specifice privind securitatea
- Monitorizarea continuă a furnizorilor critici
- Plan de contingență în caz de compromitere a unui furnizor

## Resurse și sprijin

**CERT-RO**: Autoritatea națională pentru incidente de securitate cibernetică. Oferă alertă, rapoarte de vulnerabilități, best practices.

**DNSC** (Directoratul Național de Securitate Cibernetică): Autoritate de supraveghere pentru NIS2 în România.

**Programe de finanțare**: Verifică dacă ești eligibil pentru fonduri europene destinate securității cibernetice (POC Plus 2021-2027).

## Concluzie

NIS2 nu este doar o povară birocratică, ci o oportunitate de a-ți consolida poziția pe piață. Companiile care implementează corect NIS2 dobândesc un avantaj competitiv: încrederea clienților, reziliență operațională și protecție împotriva atacurilor cibernetice tot mai sofisticate.

Începe pregătirea acum. Conformarea retroactivă va fi mult mai costisitoare și riscantă decât implementarea proactivă.`,
    author: {
      name: "Daniel Popescu",
      role: "Consultant SSM Senior",
    },
    date: "2026-02-01",
    category: "Securitate Cibernetică",
    readTime: 11,
    tags: ["NIS2", "Securitate cibernetică", "Compliance", "IMM"],
  },
  {
    slug: "instructaj-ssm-tipuri-frecventa",
    title: "Instructajul SSM: Tipuri, frecvență și greșeli de evitat",
    excerpt: "Ghid detaliat despre toate tipurile de instructaje SSM obligatorii și cum să le organizezi eficient.",
    content: `# Instructajul SSM: Tipuri, frecvență și greșeli de evitat

Instructajul în domeniul securității și sănătății în muncă este o obligație legală esențială. Iată tot ce trebuie să știi pentru a-l organiza corect.

## De ce este important instructajul SSM?

Statisticile arată că peste 60% din accidentele de muncă se datorează nerespectării normelor de securitate sau lipsei de cunoștințe. Instructajul corect poate preveni majoritatea acestor tragedii și poate salva vieți.

Din perspectivă legală, instructajul este obligatoriu conform Legii 319/2006. Lipsa dovezilor de instructaj poate atrage amenzi între 3.000 și 8.000 lei și răspundere penală în caz de accident grav.

## Tipuri de instructaje SSM

**1. Instructajul introductiv-general**

Se efectuează la angajare, înainte ca salariatul să înceapă munca. Este realizat de responsabilul SSM sau de persoana desemnată de angajator.

Conținut obligatoriu:
- Legislația SSM aplicabilă
- Drepturile și obligațiile angajaților
- Riscurile generale în companie
- Măsuri de prim ajutor și evacuare
- Utilizarea EIP (echipamente de protecție)
- Proceduri în caz de urgență

Durata minimă: 8 ore pentru muncitori, 6 ore pentru alte categorii.

Documentare: Proces-verbal semnat, păstrat în dosarul personal.

**2. Instructajul la locul de muncă**

Se efectuează imediat după instructajul introductiv-general, la locul efectiv de muncă, de către șeful direct sau o persoană desemnată.

Conținut specific:
- Riscurile specifice postului
- Funcționarea echipamentelor de lucru
- Proceduri de lucru în siguranță
- EIP specifice și modul de utilizare
- Exemple de accidente anterioare similare

Durata: Minimum o zi lucrătoare, în funcție de complexitatea postului.

Documentare: Fișă de instructaj la locul de muncă, semnată de instruit și instructor.

**3. Instructajul periodic**

Se efectuează periodic pentru menținerea și actualizarea cunoștințelor.

Frecvența:
- Lunar: pentru lucrări cu risc ridicat (înălțime, substanțe periculoase, etc.)
- Trimestrial: pentru lucrări cu risc mediu
- Semestrial: pentru lucrări cu risc scăzut
- Anual: pentru personalul administrativ

Conținut:
- Actualizări legislative
- Accidente recente și lecții învățate
- Proceduri noi
- Reamintirea procedurilor critice

Documentare: Fișă de instructaj periodic, evidență în registrul de instructaj.

**4. Instructajul suplimentar**

Se efectuează în situații speciale:

**Când este necesar:**
- Introducerea de echipamente noi
- Schimbarea tehnologiei de lucru
- Executarea de lucrări ocazionale
- După un accident de muncă
- După absențe îndelungate (>60 zile)
- La reluarea activității după suspend

Documentare: Fișă de instructaj suplimentar cu motivația specifică.

## Metode eficiente de instructaj

**Prezentare teoretică**: Power Point, materiale video, manuale. Eficientă pentru aspectele legislative și teoretice.

**Demonstrație practică**: Instructorul demonstrează corect, apoi angajatul repetă sub supraveghere. Esențială pentru proceduri practice.

**E-learning**: Platforme digitale pentru instructajul introductiv-general și periodic. Permite evidență automată, teste de verificare și flexibilitate.

**Simulări**: Exerciții de evacuare, simulări de incendiu, exerciții de prim ajutor. Vitale pentru pregătirea situațiilor de urgență.

## Verificarea înțelegerii

Nu este suficient să ții instructajul - trebuie să te asiguri că a fost înțeles:

- Test scris (minimum 10 întrebări, prag 80%)
- Demonstrație practică evaluată
- Verificare la locul de muncă în primele zile
- Feedback de la șeful direct

Dacă angajatul nu promovează testul, instructajul se reia.

## Documentarea instructajului

**Evidențe obligatorii:**

**Registrul de instructaj**: Format tipizat, numerotare continuă, legat și numerotat. Conține: data, tipul instructajului, numele instructorului și al instruitului, semnături.

**Fișe individuale**: Pentru fiecare angajat, păstrate în dosarul personal. Include toate instructajele efectuate.

**Procese-verbale**: Pentru instructajul introductiv-general, semnate de responsabilul SSM și angajat.

**Teme tratate**: Conspecte, prezentări, materiale folosite, păstrate și disponibile pentru control.

**Păstrare**: Minimum 5 ani sau pe toată durata contractului de muncă.

## Greșeli frecvente

**Instructaj formal, fără conținut real**: "Semnează aici" fără explicații reale. Riscant și ineficient.

**Lipsă dovezi**: Instructaj efectuat, dar fără semnături sau documentație. La control, lipsa dovezii = lipsa instructajului.

**Frecvență nerespectată**: Instructajul periodic întârziat sau omis.

**Instructor necalificat**: Instructajul trebuie făcut de persoană competentă (responsabil SSM sau persoană instruită special).

**Limba străină**: Angajați străini instruiți în română, fără traducător sau materiale în limba lor.

## Responsabilități

**Angajatorul**: Asigură resurse, program, documentare, verifică eficiența.

**Responsabilul SSM**: Elaborează conținut, efectuează instructajul introductiv-general, instruiește instructorii.

**Șefii direcți**: Efectuează instructajul la locul de muncă și cel periodic, monitorizează aplicarea.

**Angajații**: Participă activ, înțeleg, aplică, solicită lămuriri.

## Digitalizarea instructajului

Platformele digitale moderne oferă:
- Bază de date centralizată
- Notificări automate pentru scadențe
- E-learning pentru instructaj teoretic
- Teste automate de verificare
- Rapoarte și statistici
- Arhivare electronică conformă legal

## Concluzie

Instructajul SSM nu este o formalitate birocratică, ci un instrument vital de protecție a vieții angajaților. Investește timp și resurse în instructaje de calitate, adaptate specificului companiei tale. Un angajat bine instruit este un angajat în siguranță.`,
    author: {
      name: "Daniel Popescu",
      role: "Consultant SSM Senior",
    },
    date: "2026-01-28",
    category: "SSM",
    readTime: 9,
    tags: ["Instructaj", "SSM", "Training", "Prevenție"],
  },
  {
    slug: "echipamente-protectie-individuala-ghid",
    title: "EIP - Echipamentele Individuale de Protecție: Ghid complet",
    excerpt: "Tot ce trebuie să știi despre alegerea, distribuirea și întreținerea echipamentelor de protecție individuală.",
    content: `# EIP - Echipamentele Individuale de Protecție: Ghid complet

Echipamentele Individuale de Protecție (EIP) reprezintă ultima barieră între angajat și pericol. Iată cum să le alegi, distribui și gestionezi corect.

## Ce sunt EIP-urile?

EIP-urile sunt echipamente destinate să fie purtate sau ținute de lucrător pentru a-l proteja împotriva unuia sau mai multor riscuri care ar putea să îi pună în pericol sănătatea sau securitatea la locul de muncă.

Conform Legii 319/2006, angajatorul are obligația să furnizeze gratuit EIP adecvate riscurilor identificate în evaluarea riscurilor. Costul EIP nu poate fi transferat angajatului.

## Principiul ierarhiei măsurilor

**Important**: EIP-urile reprezintă ultimul nivel de protecție. Înainte de a recurge la EIP, angajatorul trebuie să încerce:

1. **Eliminarea pericolului**: schimbarea procesului tehnologic
2. **Protecție colectivă**: ventilație, insonorizare, bariere
3. **Măsuri organizatorice**: rotație, reducerea timpului de expunere
4. **Abia apoi**: echipamente individuale de protecție

## Categorii de EIP

**Categoria I - Risc minimal**
- Mănuși de grădinărit
- Ochelari de soare fără funcție de protecție industrială
- Îmbrăcăminte pentru protecție împotriva vremii

Autocertificare de către producător, fără organisme notificate.

**Categoria II - Risc mediu**
- Majoritatea EIP-urilor industriale
- Căști de protecție
- Mănuși mecanice
- Încălțăminte de siguranță standard

Certificare prin examinare de tip UE de către organism notificat.

**Categoria III - Risc mortal sau ireversibil**
- Protecție respiratorie (măști, aparate cu aer)
- Echipament pentru lucru la înălțime
- Îmbrăcăminte de protecție chimică
- Echipament pentru pompieri

Certificare strictă + supraveghere continuă a producției.

## Alegerea EIP-urilor corecte

**Pas 1: Consultă evaluarea riscurilor**
Identifică riscurile specifice fiecărui post: impact, zgomot, substanțe chimice, înălțime, temperatură, etc.

**Pas 2: Specifică cerințele tehnice**
Pentru fiecare EIP, identifică:
- Standardul aplicabil (ex: EN 388 pentru mănuși mecanice)
- Nivelul de protecție necesar (ex: S1, S2, S3 pentru încălțăminte)
- Caracteristici speciale (antistatică, rezistentă chimic, etc.)

**Pas 3: Verifică certificările**
Fiecare EIP trebuie să aibă:
- Marcaj CE
- Declarație de conformitate
- Note de informare în română
- Certificat de la organism notificat (categoria II și III)

**Pas 4: Testează ergonomia**
Implică angajații în alegere. EIP incomod nu va fi purtat corect:
- Dimensiuni variate (S, M, L, XL)
- Compatibilitate între echipamente
- Confort pentru durata schimbului

## EIP-uri pe categorii de riscuri

**Protecția capului**
- Căști de protecție (EN 397): șantiere, depozite, producție
- Căști pentru salvare (EN 12492): lucru la înălțime
- Bonetă/plasă păr: industria alimentară

**Protecția ochilor și feței**
- Ochelari de protecție (EN 166): proiecții, praf, substanțe chimice
- Ecrane faciale: sudură, prelucrare metal, substanțe chimice
- Ochelari pentru laser (EN 207/208)

**Protecția auditivă**
- Dopuri de urechi (SNR 20-37 dB): zgomot moderat-ridicat
- Cască fonică (SNR 25-35 dB): zgomot ridicat, confort prelungit
- Combinații (SNR până la 45 dB): zgomot extrem

**Protecția respiratorie**
- Semimască filtrare (FFP1/FFP2/FFP3): praf, aerosoli, viruși
- Semimască cu filtre interschimbabile: gaze, vapori specifici
- Aparate cu aer comprimat: atmosferă toxică, spații închise

**Protecția mâinilor**
- Mănuși mecanice (EN 388): abraziune, tăiere, înțepare, rupere
- Mănuși chimice (EN 374): substanțe corozive, toxice
- Mănuși termice (EN 407/511): căldură, frig, sudură
- Mănuși electrice (EN 60903): lucru sub tensiune

**Protecția picioarelor**
- S1: gheată ușoară, absorbție șocuri, antistatică
- S2: + rezistență la apă
- S3: + lamelă antiperforație, talpă anti-alunecare
- S4/S5: cizme cauciuc/PVC pentru medii umede

**Protecția corpului**
- Îmbrăcăminte de înaltă vizibilitate (EN ISO 20471): drumuri, șantiere
- Îmbrăcăminte de protecție chimică (tip 3-6): substanțe periculoase
- Îmbrăcăminte ignifugă (EN ISO 11612): sudori, pompieri
- Șorțuri, jambiere: sudură, prelucrare metal

**Protecția la înălțime**
- Ham de siguranță (EN 361)
- Sistem anti-cădere (EN 363)
- Cordă, absorbant șoc, ancoraj

## Distribuirea EIP-urilor

**Proces formal:**
1. Determinare necesități conform evaluării riscurilor
2. Achiziție EIP certificate
3. Instruire utilizare corectă
4. Distribuire cu semnătură în fișa de dotare
5. Verificare periodică a utilizării corecte

**Fișa de dotare individuală:**
- Nume angajat, post
- Lista EIP necesare conform fișei postului
- Data distribuirii, cantitate
- Termen de uzură normal
- Data înlocuirii
- Semnături primire

**Frecvența înlocuirii:**
- Conform termenului de uzură normal stabilit de producător
- La deteriorare, indiferent de termen
- La modificarea riscurilor
- La cererea angajatului (uzură prematură justificată)

## Întreținerea și depozitarea

**Responsabilitatea angajatorului:**
- Verificare periodică a stării EIP
- Spălare/curățare (fără costuri pentru angajat)
- Reparare sau înlocuire la deteriorare
- Depozitare corectă în afara programului

**Responsabilitatea angajatului:**
- Utilizare conform instrucțiunilor
- Păstrare în condiții corespunzătoare
- Raportare deteriorări
- Nemodificare

**Condiții de depozitare:**
- Spații curate, uscate, ventilate
- Temperatură controlată (15-25°C)
- Feriti de lumină solară directă
- Separate de substanțe chimice
- Etichetare clară (tip, mărime, termen valabilitate)

## Verificări periodice

EIP-urile din categoria III necesită verificări regulate:
- Harnașamente: verificare vizuală înainte de fiecare utilizare + control detaliat semestrial
- Aparate respiratorii: verificare funcțională săptămânală
- Îmbrăcăminte chimică: test de etanșeitate periodic

Ține registru de verificări cu date, constatări, semnături.

## Greșeli frecvente

**EIP inadecvate**: mănuși textile pentru substanțe chimice, încălțăminte S1 pe șantier (trebuie S3).

**Lipsă instruire**: EIP distribuit fără explicații de utilizare corectă.

**Lipsă evidență**: EIP distribuit fără semnătură, imposibil de dovedit la control.

**Transfer cost**: rețineri din salariu pentru EIP - ILEGAL.

**EIP deteriorate**: EIP uzate neînlocuite la timp, risc de accident.

## Sancțiuni

Lipsa EIP sau EIP inadecvate: 8.000 - 15.000 lei amendă.
La accident de muncă din cauza lipsei EIP: răspundere penală posibilă.

## Concluzie

EIP-urile sunt investiție în siguranță, nu cheltuială. Alege echipamente de calitate, instruiește corect angajații, monitorizează utilizarea și înlocuiește la timp. Viața angajaților tăi merită.`,
    author: {
      name: "Daniel Popescu",
      role: "Consultant SSM Senior",
    },
    date: "2026-01-25",
    category: "SSM",
    readTime: 10,
    tags: ["EIP", "Echipamente protecție", "Siguranță", "SSM"],
  },
  {
    slug: "medicina-muncii-ghid-angajatori",
    title: "Medicina Muncii: Ghid complet pentru angajatori",
    excerpt: "Tot ce trebuie să știi despre serviciile de medicina muncii: controale medicale, avize, frecvență și responsabilități.",
    content: `# Medicina Muncii: Ghid complet pentru angajatori

Medicina muncii este un domeniu esențial pentru protecția sănătății angajaților. Iată tot ce trebuie să știi ca angajator.

## Ce este medicina muncii?

Medicina muncii este specialitatea medicală care se ocupă de prevenirea îmbolnăvirilor profesionale, monitorizarea stării de sănătate a lucrătorilor și evaluarea aptitudinii acestora pentru munca desfășurată.

Conform Legii 319/2006, fiecare angajator trebuie să asigure supraveghere medicală pentru toți angajații, proporțional cu riscurile la care sunt expuși.

## Obligații legale ale angajatorului

**Contract cu serviciu medicina muncii**: Angajatorul trebuie să încheie contract cu un medic specialist în medicina muncii sau cu o unitate furnizoare de servicii de medicina muncii autorizată.

**Controlul medical la angajare**: Niciun salariat nu poate începe munca fără control medical prealabil și fișa de aptitudine medicală.

**Controale periodice**: Frecvența este stabilită de medicul de medicina muncii în funcție de riscurile la locul de muncă.

**Informarea medicului**: Angajatorul trebuie să transmită medicului de medicina muncii evaluarea riscurilor și modificările intervenite.

## Tipuri de controale medicale

**1. Controlul medical la angajare**

**Când**: Înainte de începerea activității, obligatoriu pentru toți angajații.

**Scop**: Stabilirea aptitudinii pentru postul solicitat, identificarea contraindicațiilor.

**Documente necesare:**
- Fișa postului cu riscuri identificate
- Trimitere de la angajator
- CI, asigurare de sănătate
- Analize și investigații (în funcție de riscuri)

**Rezultat**: Fișa de aptitudine cu mențiunea: apt, apt condiționat sau inapt.

**Valabilitate**: Conform riscurilor, între 6 luni și 2 ani.

**2. Controlul medical periodic**

**Frecvența depinde de riscuri:**
- La 6 luni: expunere substanțe toxice, muncă nocturnă permanentă, radiații
- Anual: zgomot > 85 dB, vibrații, praf, risc biologic, efort fizic intens
- La 2 ani: muncă birou fără riscuri speciale
- La 3 ani: posturi administrative fără riscuri

**Scop**: Monitorizarea stării de sănătate, depistarea precoce a îmbolnăvirilor profesionale, confirmarea menținerii aptitudinii.

**Organizare**: Responsabilitatea angajatorului de a programa și a asigura prezența angajaților.

**Timpul pentru control**: Pe timpul programului de lucru, fără afectarea salariului.

**3. Controlul medical la reluarea activității**

**Când:**
- După concediu medical > 90 zile
- După boală profesională
- După accident de muncă cu incapacitate temporară de muncă

**Scop**: Verificarea recuperării și a menținerii aptitudinii.

**4. Controlul medical la cerere**

**La solicitarea:**
- Angajatului (suspiciune îmbolnăvire profesională)
- Angajatorului (îndoieli privind aptitudinea)
- Medicului de familie

**Observații și analize**

În funcție de riscurile la locul de muncă, medicul poate solicita:

**Analize de laborator:**
- Hemoleucogramă (sânge complet)
- Transaminaze (ficat): pentru expunere la substanțe hepatotoxice
- Glicemie, colesterol: posturi sedentare, risc cardiovascular
- Analiză urină: expunere metale grele, solvenți
- Teste toxicologice specifice

**Investigații paraclinice:**
- Audiogramă: expunere zgomot > 80 dB
- Spirometrie: expunere praf, substanțe iritante respiratorii
- Radiografie toracică: expunere silice, azbest, pulberi fibroase
- EKG: muncitori peste 40 ani, posturi cu responsabilitate deosebită
- Examen oftalmologic: muncă la calculator > 4h/zi, sudori
- Examen psihologic: șoferi profesioniști, operatori utilaje periculoase

## Fișa de aptitudine

**Conținut obligatoriu:**
- Date angajat
- Post ocupat / solicitat
- Riscurile evaluate de medicul de medicina muncii
- Concluzia: apt / apt cu recomandări / apt condiționat / inapt
- Recomandări pentru angajator și angajat
- Termen de valabilitate
- Data următorului control
- Semnătura și parafa medicului

**Mențiuni posibile:**

**Apt**: Salariatul poate desfășura activitatea fără restricții.

**Apt cu recomandări**: Apt, dar cu recomandări de supraveghere sau măsuri de protecție suplimentare.

**Apt condiționat**: Apt temporar, cu condiții specifice (ex: fără ore suplimentare, fără muncă nocturnă, cu pauze suplimentare).

**Inapt temporar**: Contraindicație temporară (ex: sarcină pentru muncă cu substanțe toxice).

**Inapt permanent**: Contraindicație definitivă pentru postul respectiv.

## Inaptitudinea medicală

**Inaptitudine temporară**: Angajatul este mutat temporar pe alt post compatibil sau este suspendat contractul cu drepturi de salariu conform legislației.

**Inaptitudine permanentă**: Angajatorul trebuie să caute un post compatibil în companie. Dacă nu există, se poate ajunge la desfacerea contractului de muncă pentru inaptitudine.

**Important**: Concedierea pentru inaptitudine este posibilă doar după evaluare DGASPC și ofertă de reconversie profesională.

## Dosarul medical de medicina muncii

Pentru fiecare angajat, medicul de medicina muncii întocmește și păstrează un dosar medical confidențial care include:
- Fișă de expunere la riscuri profesionale
- Rezultate analize și investigații
- Fișe de aptitudine emise
- Evoluția stării de sănătate
- Îmbolnăviri profesionale diagnosticate

Dosarul este confidențial, păstrat la medic, cu acces restrict.

## Costuri

**Suportat de angajator**: TOATE costurile pentru serviciile de medicina muncii (consultații, analize, investigații) sunt suportate de angajator. Nu pot fi transferate angajatului.

**Tarife orientative (2026):**
- Control medical simplu (birou, fără riscuri): 80-120 lei
- Control cu riscuri medii (analize standard): 150-250 lei
- Control cu riscuri ridicate (analize + investigații complexe): 300-500 lei

**Observație**: Tarifele variază în funcție de furnizor și de amploarea investigațiilor necesare.

## Alegerea furnizorului de medicina muncii

**Criterii de selecție:**
- Autorizație de funcționare valabilă
- Medici specialiști în medicina muncii (nu rezidenți)
- Dotări tehnice adecvate (analize și investigații în același loc sau parteneriate clare)
- Acoperire geografică (clinici aproape de sediile companiei)
- Disponibilitate (programări rapide, flexibilitate)
- Raport calitate-preț
- Sistem informatic (fișe digitale, reminder-e automate)

**Verificări necesare:**
- Autorizație sanitară de funcționare
- Certificate de absolvire medicină + specialitatea medicina muncii
- Asigurare de malpraxis
- Referințe de la alți clienți

## Responsabilități

**Angajatorul:**
- Contractează servicii medicina muncii
- Informează medicul despre riscuri (transmite evaluarea riscurilor)
- Programează controalele medicale
- Asigură prezența angajaților
- Respectă recomandările medicale
- Păstrează copii fișe de aptitudine

**Medicul de medicina muncii:**
- Evaluează riscurile din punct de vedere medical
- Efectuează controale medicale
- Emite fișe de aptitudine
- Consiliază angajatorul privind măsurile de protecție a sănătății
- Supraveghează starea de sănătate a colectivității de muncă
- Raportează bolile profesionale

**Angajatul:**
- Se prezintă la controalele programate
- Furnizează informații corecte medicului
- Respectă recomandările medicale
- Anunță modificări ale stării de sănătate

## Sancțiuni pentru neconformitate

- Lipsa controlului medical la angajare: 5.000 - 10.000 lei
- Neefectuarea controalelor periodice: 5.000 - 10.000 lei
- Lipsa contractului cu medicina muncii: 3.000 - 6.000 lei
- Angajat cu fișă de inaptitudine pe post: 8.000 - 15.000 lei + răspundere penală la accident

## Concluzie

Medicina muncii nu este o formalitate, ci un instrument de protecție a sănătății angajaților. Un sistem bine organizat de supraveghere medicală poate preveni îmbolnăviri profesionale, poate reduce absențele și poate crește productivitatea. Alege un furnizor de calitate și respectă cu strictețe programul de controale medicale.`,
    author: {
      name: "Daniel Popescu",
      role: "Consultant SSM Senior",
    },
    date: "2026-01-22",
    category: "Medicina Muncii",
    readTime: 11,
    tags: ["Medicina muncii", "Fișă aptitudine", "Control medical", "Sănătate"],
  },
  {
    slug: "prevenirea-incendiilor-firme",
    title: "Prevenirea și Stingerea Incendiilor (PSI): Ghid pentru firme",
    excerpt: "Normele PSI, autorizații, instalații de stingere și pregătirea angajaților pentru situații de urgență.",
    content: `# Prevenirea și Stingerea Incendiilor (PSI): Ghid pentru firme

Incendiile pot distruge în câteva ore munca de ani de zile. Iată tot ce trebuie să știi pentru a-ți proteja compania.

## Cadrul legal PSI în România

Legislația principală:
- Legea 307/2006 privind apărarea împotriva incendiilor
- Normativ P118/2013 - Normativ de siguranță la foc
- HG 571/2016 - Regulament de planificare, organizare, pregătire și intervenție în situații de urgență

Responsabilitatea principală pentru prevenirea incendiilor revine administratorului/proprietarului clădirii și angajatorului.

## Autorizația de securitate la incendiu (ASI)

**Cine trebuie să obțină ASI:**
Toate persoanele juridice care desfășoară activități în clădiri, cu excepții limitate (locuințe individuale, anexe gospodărești).

**Procedura de obținere:**

1. **Documentație necesară:**
   - Cerere tip
   - Plan de situație și plan arhitectură
   - Memoriu tehnic PSI
   - Scenariul de securitate la incendiu
   - Dovada proprietății/contractului de închiriere
   - Certificate de conformitate pentru instalațiile PSI

2. **Depunere la ISU** (Inspectoratul pentru Situații de Urgență) județean

3. **Control ISU**: Verificare conformitate documentație și teren

4. **Emitere autorizație**: Valabilitate 1-4 ani, în funcție de categoria de risc

**Categorii de risc incendiu:**

- **A - Foarte mare**: facilități cu substanțe explozive, inflamabile
- **B - Mare**: producție, depozite cu materiale combustibile
- **C - Mediu**: birouri, comerț, învățământ
- **D - Scăzut**: depozite materiale incombustibile

**Sancțiuni**: Desfășurarea activității fără ASI: 5.000 - 10.000 lei + suspendarea activității.

## Scenariul de securitate la incendiu

Document obligatoriu care cuprinde:

**Descrierea activității**: Suprafață, număr personal, programe de lucru, substanțe/materiale utilizate.

**Identificarea pericolelor**: Surse de aprindere, materiale combustibile, căi de propagare.

**Măsuri de prevenire:**
- Organizatorice: regulament intern PSI, responsabili, instruire
- Tehnice: instalații de stingere, detectare, alarmă, evacuare
- Constructive: compartimentare foc, rezistență la foc, căi de evacuare

**Planul de evacuare**: Trasee, puncte de adunare, responsabilități.

**Planul de intervenție**: Proceduri de alertare, prim-intervenție, coordonare cu pompieri.

**Scenarii de incendiu**: Simulări pentru diferite zone ale clădirii.

## Instalații și echipamente PSI

**1. Stingătoare portabile**

**Tipuri:**
- **Pulbere**: Universal, pentru foc A, B, C (lemn, lichide, gaze)
- **CO2**: Pentru echipamente electrice, fără reziduuri
- **Spumă**: Pentru lichide inflamabile
- **Apă**: Pentru materiale solide combustibile

**Amplasare:**
- Vizibile, ușor accesibile
- Suspensie la 1,5m sau suport
- Marcaj conform SR EN ISO 7010
- Distanță max 25m între stingătoare (clădiri normale)

**Întreținere:**
- Verificare lunară: presiune manometru, stare generală
- Revizie anuală: de către personal autorizat IGSU
- Reîncărcare: după utilizare sau conform termenului (2-5 ani)

**2. Hidranți interiori**

Pentru clădiri cu risc mediu-mare, suprafață > 500 mp sau peste 2 niveluri.

**Componente**: Cutie metal/plastic, furtun 20-30m, racord, robinet.

**Verificare:**
- Lunară: presiune apă, stare furtun
- Anuală: test funcțional, desfășurare furtun
- La 5 ani: probă hidraulică furtun

**3. Instalații de detectare și alarmare**

**Detectori de fum**: Pentru birouri, hoteluri, spitale. Detectare precoce.

**Detectori de căldură**: Pentru bucătării, garaje. Rezistenți fals alarme.

**Detectori de flacără**: Pentru rafinării, depozite combustibili. Răspuns rapid.

**Buton manual alarmare**: La ieșiri, pe căi evacuare, vizibil.

**Centrală de detectare incendiu**: Monitorizează detectori, activează alarmă, transmite alerte.

**4. Instalații de stingere automată**

**Sprinklere (apă)**: Activare automată la temperatură, acoperire uniformă.

**Gaze (FM-200, NOVEC, CO2)**: Pentru serverare, muzee, arhive. Fără deteriorare echipamente.

**Spumă**: Pentru depozite lichide inflamabile.

**5. Sisteme de evacuare fum și căldură (SEFC)**

Ferestre, trape, ventilatoare pentru evacuarea fumului în caz de incendiu. Facilitează evacuarea și intervenția pompierilor.

## Pregătirea personalului

**1. Instruirea în PSI**

**Obligatorie pentru toți angajații**, conform Legii 307/2006.

**Frecvența:**
- Anual: personal administrativ, birou
- Semestrial: personal producție, depozite
- La angajare: instructaj introductiv

**Conținut:**
- Cauzele și consecințele incendiilor
- Măsuri de prevenire
- Utilizarea stingătoarelor și hidranților
- Procedura de evacuare
- Prim ajutor

**Documentare**: Proces-verbal de instruire, semnat de participanți.

**2. Exerciții de evacuare**

**Frecvența**: Minimum anual, recomandat semestrial.

**Organizare:**
- Scenariu prestabilit (dar necomunicat angajaților)
- Activare alarmă
- Evacuare conform planului
- Adunare la punctul stabilit
- Numărătoare personal
- Cronometrare
- Debriefing și îmbunătățiri

**Documentare**: Raport exercițiu cu constatări și măsuri corective.

**3. Echipa de prim-intervenție**

Formată din angajați instruiți special, minimum 1 la 50 angajați.

**Responsabilități:**
- Intervenție inițială cu stingătoare/hidranți
- Asistarea evacuării
- Alertarea ISU
- Coordonare până la sosirea pompierilor

**Instruire**: Curs specializat la ISU sau furnizor autorizat, cu aplicații practice.

## Măsuri organizatorice

**Responsabil PSI**: Persoană desemnată, cu atribuții clare (poate fi și responsabilul SSM).

**Regulament intern PSI**: Proceduri, responsabilități, interdicții (fumat, flăcări deschise).

**Verificări periodice:**
- Zilnic: căi de evacuare libere, uși deschise în sens evacuare
- Săptămânal: funcționare sisteme alarmare
- Lunar: stingătoare, hidranți, detectori
- Anual: revizie completă instalații

**Întreținerea ordinii**: Evitarea depozitării materiale combustibile pe căi evacuare, lângă surse de căldură sau instalații electrice.

## Greșeli frecvente

**Căi de evacuare blocate**: Depozitare, mobilier, încuiere uși. EXTREM DE PERICULOS.

**Stingătoare expirate sau descărcate**: Presiune scăzută, lipsă revizie anuală.

**Lipsă instruire**: Personal neinstruit, care nu știe să folosească stingătorul.

**Improvizații electrice**: Prize prelungite, cabluri deteriorate, suprasolicitare. Cauza nr. 1 a incendiilor în birouri.

**Lipsă autorizație**: Funcționare fără ASI sau cu ASI expirată.

## Verificări ISU

ISU efectuează controale periodice sau inopinate. Verifică:
- Valabilitate ASI
- Funcționare instalații PSI
- Evidența instruirilor și exercițiilor
- Căi de evacuare libere
- Respectare scenariul de securitate

La constatarea neconformităților: **somație** (15-30 zile remediere) sau **amendă** (3.000-20.000 lei) și **suspendare activitate** în cazuri grave.

## Concluzie

PSI nu este doar conformitate birocratică, ci protecție reală. Un incendiu poate distruge tot ce ai construit. Investește în instalații de calitate, instruiește personalul, menține echipamentele la zi și verifică periodic totul. Siguranța angajaților și continuitatea afacerii tale depind de asta.`,
    author: {
      name: "Daniel Popescu",
      role: "Consultant SSM Senior",
    },
    date: "2026-01-18",
    category: "PSI",
    readTime: 10,
    tags: ["PSI", "Incendii", "Autorizație ISU", "Siguranță"],
  },
  {
    slug: "accidente-munca-procedura-investigare",
    title: "Accidente de muncă: Procedura de investigare și declarare",
    excerpt: "Ghid complet despre cum să gestionezi un accident de muncă: cercetare, declarare ITM și măsuri de prevenire.",
    content: `# Accidente de muncă: Procedura de investigare și declarare

Accidentele de muncă sunt situații pe care niciun angajator nu și le dorește. Însă dacă se întâmplă, procedura corectă poate face diferența între o soluționare legală și probleme juridice grave.

## Ce este un accident de muncă?

Conform Legii 346/2002, accidentul de muncă este vătămarea violentă a organismului, precum și intoxicația acută profesională, care au loc în timpul procesului de muncă sau în îndeplinirea îndatoririlor de serviciu, indiferent de natura juridică a contractului în baza căruia se desfășoară activitatea, și care provoacă incapacitate temporară de muncă de cel puțin 3 zile calendaristice, invaliditate sau deces.

**Caracteristici esențiale:**
- Vătămare violentă (brusc, nu treptat ca bolile profesionale)
- În timpul/cu ocazia muncii
- Incapacitate minimum 3 zile, invaliditate sau deces
- Relație de cauzalitate între activitate și vătămare

**Accidente asimilate:**
- În deplasare de serviciu
- La ședințe/cursuri obligatorii
- Pe traseul domiciliu-serviciu (în anumite condiții)

**NU sunt accidente de muncă:**
- Auto-vătămări intenționate
- Sub influența alcoolului/drogurilor (cu excepții)
- Încălcări grave ale normelor SSM de către victimă (dacă nu există și responsabilitate angajator)

## Clasificarea accidentelor

**După gravitate:**
- **Ușoare**: Incapacitate temporară 3-90 zile
- **Grave**: Incapacitate > 90 zile sau invaliditate parțială
- **Mortale**: Deces

**După numărul victimelor:**
- **Individuale**: O singură persoană
- **Colective**: 2+ persoane simultan

## Măsuri imediate după accident

**1. Oprirea lucrului** (dacă persistă pericolul)

**2. Acordarea primului ajutor**
- Persoană instruită
- Chemare ambulanță (112) pentru cazuri grave
- Stabilizare victimă până la sosirea medicilor

**3. Păstrarea locului accidentului**
- NU modifica nimic
- Fotografiază/filmează scena
- Izolează zona
- Excepție: pericol iminent pentru alții

**4. Asigurarea de martori**
- Identifică persoanele prezente
- Notează coordonatele
- Recoltează declarații preliminare

**5. Anunțare imediată:**
- Responsabilul SSM
- Conducerea companiei
- ITM (Inspectoratul Teritorial de Muncă) - pentru accidente grave/mortale, în max 24 ore

## Cercetarea accidentului de muncă

**Componența comisiei de cercetare:**

**Accidente ușoare:**
- Responsabilul SSM
- Reprezentant angajator
- Reprezentant sindical sau al lucrătorilor
- Alte persoane (medic medicina muncii, specialist tehnic)

**Accidente grave/mortale/colective:**
- Inspector ITM (președinte)
- Polițist (dacă există elemente de răspundere penală)
- Reprezentant angajator
- Responsabil SSM
- Reprezentant sindical
- Medic medicina muncii

**Termenul de cercetare:**
- Accidente ușoare: Maximum 15 zile
- Accidente grave: Maximum 30 zile
- Accidente mortale: Maximum 45 zile (cu posibilitate prelungire)

**Etapele cercetării:**

**1. Vizită la locul accidentului**
- Examinare scenă
- Măsurători, fotografii, schiță
- Identificare cauze posibile

**2. Audierea martorilor**
- Declarații scrise, semnate
- Descriere secvență fapte
- Condiții de muncă observate

**3. Audierea victimei** (dacă este posibil)

**4. Examinarea documentelor:**
- Contract muncă, fișa postului
- Evaluarea riscurilor pentru postul respectiv
- Fișe instructaj SSM
- Fișa aptitudine medicală
- Documentație tehnică echipamente
- Buletine verificare tehnică
- EIP distribuite

**5. Stabilirea cauzelor:**
- **Cauze directe**: Acțiuni/condiții imediate (ex: lipsa barei de protecție)
- **Cauze indirecte**: Deficiențe organizatorice (ex: lipsă supraveghere, instructaj incomplet)
- **Cauze fundamentale**: Deficiențe de sistem (ex: lipsă cultură de securitate, presiuni pentru productivitate)

**6. Stabilirea responsabilităților:**
- Responsabilitate angajator (lipsa măsurilor de protecție)
- Responsabilitate victimă (nerespectare proceduri)
- Responsabilitate terți (furnizori, contractori)
- Responsabilitate împărțită (procente)

**7. Măsuri de prevenire:**
- Măsuri tehnice (montare protecții, înlocuire echipamente)
- Măsuri organizatorice (proceduri noi, supraveghere)
- Măsuri de instruire (re-instruire, instruiri suplimentare)
- Termene și responsabili pentru fiecare măsură

## Procesul-verbal de cercetare

Document oficial care cuprinde:
- Date accident (dată, oră, loc)
- Date victimă (nume, funcție, vechime, vârstă)
- Componența comisiei
- Descriere accident
- Declarații martori și victimă
- Analiza cauzelor
- Stabilirea responsabilităților
- Încadrare juridică (accident de muncă sau NU)
- Măsuri de prevenire
- Anexe (schiță, fotografii, declarații, documente)

Procesul-verbal se întocmește în **3 exemplare**:
- Angajator
- Victimă sau familie
- ITM (pentru accidente grave/mortale/colective)

Se semnează de toți membrii comisiei. Opiniile divergente se consemnează separat.

## Declararea accidentului de muncă

**REVISAL**: Toate accidentele de muncă (inclusiv ușoare) se declară în REVISAL în termen de 3 zile lucrătoare de la încheierea cercetării.

**ITM**: Accidentele grave, mortale și colective se raportează la ITM în max 24 ore de la producere (telefonic/email), apoi prin proces-verbal oficial.

**Asigurator (CAM)**: Declararea accidentului pentru acordarea prestațiilor (indemnizație, compensații).

## Consecințe pentru angajator

**Răspundere civilă**: Despăgubiri către victimă sau familie (diferența față de prestațiile asigurării sociale).

**Răspundere contravențională**: Amenzi între 10.000-30.000 lei pentru încălcări SSM care au dus la accident.

**Răspundere penală**: Investigație penală pentru accidente grave/mortale cu responsabilitate angajator (vătămare corporală din culpă, omor din culpă).

**Creșterea primei CAM**: Istoric negativ de accidente crește contribuția la asigurările sociale.

## Drepturi victimă

- Indemnizație 100% din salariu pe toată perioada incapacității temporare
- Compensații pentru invaliditate (% conform gradului)
- Despăgubiri către familie (caz deces)
- Daune morale suplimentare (prin instanță, dacă se dovedește culpa angajatorului)

## Prevenirea accidentelor de muncă

**Analiza statistică**: Păstrează evidența tuturor accidentelor (inclusiv micro-traumatisme) pentru a identifica tipare.

**Near-miss reporting**: Încurajează raportarea incidentelor fără consecințe (aproape-accidente) pentru a preveni repetarea cu consecințe grave.

**Cultura de securitate**: Creează un mediu în care securitatea este prioritate, nu productivitatea cu orice preț.

**Audit periodic**: Verificări regulate ale riscurilor, instructajelor, echipamentelor.

**Învățare din erori**: Fiecare accident trebuie să ducă la îmbunătățiri sistemice, nu doar la sancționarea cuiva.

## Concluzie

Accidentele de muncă se pot preveni în marea majoritate a cazurilor. Investește în evaluări corecte ale riscurilor, instructaje de calitate, echipamente conforme și supraveghere continuă. Dacă totuși se întâmplă un accident, gestionează-l cu profesionalism, transparență și concentrare pe lecțiile învățate pentru viitor.`,
    author: {
      name: "Daniel Popescu",
      role: "Consultant SSM Senior",
    },
    date: "2026-01-15",
    category: "SSM",
    readTime: 12,
    tags: ["Accidente muncă", "Investigare", "ITM", "Cercetare accident"],
  },
  {
    slug: "registre-ssm-obligatorii-2026",
    title: "Registrele SSM obligatorii în 2026: Lista completă",
    excerpt: "Toate registrele și evidențele SSM pe care trebuie să le deții în companie pentru a fi conform cu legislația.",
    content: `# Registrele SSM obligatorii în 2026: Lista completă

Pentru conformitatea cu legislația SSM, fiecare companie trebuie să mențină o serie de registre și evidențe. Iată lista completă și cum să le gestionezi corect.

## 1. Registrul de instructaj SSM

**Obligativitate**: TOATE companiile, indiferent de mărime.

**Bază legală**: Legea 319/2006, HG 1425/2006.

**Format**: Tipizat, numerotat, legat, ștampilat. Poate fi și electronic (cu semnătură electronică calificată).

**Conținut pentru fiecare instructaj:**
- Nr. crt.
- Data instructajului
- Tipul (introductiv, locul de muncă, periodic, suplimentar)
- Numele și prenumele instructorului
- Numele și prenumele instruitului
- Funcția instruitului
- Teme tratate
- Durata (ore)
- Semnătura instructorului
- Semnătura instruitului

**Păstrare**: Permanent, minimum 5 ani după încetarea contractului de muncă.

**Greșeli frecvente**: Semnături lipsă, date incomplete, registru nelegat/nenumerotat, lipsa temelor tratate.

## 2. Registrul de evidență a accidentelor de muncă

**Obligativitate**: TOATE companiile care au avut cel puțin un accident de muncă.

**Bază legală**: Legea 319/2006, Legea 346/2002.

**Conținut:**
- Nr. crt.
- Data și ora accidentului
- Locul accidentului (locație exactă)
- Numele și prenumele victimei
- Funcția victimei
- Descriere succintă a accidentului
- Natura leziunilor
- Cauzele accidentului
- Gravitatea (ușor, grav, mortal)
- Zile de incapacitate
- Măsuri de prevenire dispuse
- Nr. și data procesului-verbal de cercetare

**Păstrare**: Permanent.

**Important**: Include DOAR accidentele încadrate oficial ca accidente de muncă, nu orice incident sau micro-traumatism.

## 3. Registrul de evidență al echipamentelor de muncă

**Obligativitate**: Companii care utilizează echipamente de muncă (mașini, utilaje, scule electrice, etc.).

**Bază legală**: HG 1146/2006.

**Conținut:**
- Denumirea și tipul echipamentului
- Nr. de identificare / serie
- Anul fabricației
- Data punerii în funcțiune
- Verificări periodice efectuate (date, rezultate)
- Defecțiuni constatate și remedieri
- Persoane autorizate să opereze echipamentul

**Important**: Pentru echipamente supuse ISCIR (căldură, ridicat, presiune), buletinele de verificare se păstrează separat și sunt evidențiate în registru.

**Păstrare**: Pe toată durata utilizării echipamentului + 5 ani după casare.

## 4. Registrul de evidență a echipamentelor individuale de protecție (EIP)

**Obligativitate**: Companii care distribuie EIP angajaților.

**Bază legală**: HG 1425/2006.

**Conținut:**
- Numele angajatului, funcția
- Tipul EIP distribuit
- Cantitatea
- Data distribuirii
- Termen de uzură normală
- Data înlocuirii
- Semnătura angajatului la primire

**Variante**: Poate fi registru centralizat sau fișe individuale pe angajat (recomandat).

**Păstrare**: Pe durata contractului de muncă + 5 ani.

**Important**: Include TOATE EIP-urile (căști, mănuși, ochelari, încălțăminte, îmbrăcăminte, măști, etc.).

## 5. Registrul de evidență a lucrărilor executate în regie proprie

**Obligativitate**: Companii care execută lucrări de construcții, reparații, montaj în regie proprie.

**Bază legală**: Legea 319/2006.

**Conținut:**
- Data începerii lucrării
- Descrierea lucrării
- Locul de execuție
- Personal implicat
- Șeful de lucrare
- Riscuri identificate
- Măsuri de protecție aplicate
- Data finalizării
- Observații (incidente, modificări)

**Păstrare**: 5 ani.

## 6. Fișele de expunere la factori de risc

**Obligativitate**: Companii cu angajați expuși la:
- Zgomot > 80 dB
- Vibrații
- Substanțe chimice periculoase
- Agenți biologici
- Radiații
- Praf fibrogen
- Efort fizic intens
- Muncă nocturnă

**Bază legală**: HG 355/2007, OMS 261/2018.

**Conținut:**
- Date angajat
- Post ocupat
- Factorul de risc (natura, intensitate)
- Perioada de expunere (data început - sfârșit)
- Echipamente de protecție utilizate
- Controale medicale efectuate
- Rezultate măsurători (nivo, doze)

**Păstrare**: 40 ani după încetarea expunerii (sau toată viața pentru substanțe cancerigene, mutagene).

**Important**: Fișele se transmit medicului de medicina muncii și la schimbarea locului de muncă (la noul angajator).

## 7. Registrul de procese-verbale ale Comitetului de Securitate și Sănătate în Muncă (CSSM)

**Obligativitate**: Companii cu 50+ angajați (obligatoriu CSSM).

**Bază legală**: Legea 319/2006.

**Conținut:**
- Data ședinței
- Ordinea de zi
- Participanți (semnături)
- Probleme dezbătute
- Hotărâri adoptate
- Responsabili și termene
- Procese-verbale anterioare - stadiul îndeplinirii

**Frecvența ședințelor**: Trimestrial (obligatoriu) + extraordinar la nevoi.

**Păstrare**: Permanent.

## 8. Registrul de evidență a zonelor cu risc ridicat și specific

**Obligativitate**: Companii care au zone cu risc ridicat (spații închise, lucru la înălțime, ATEX, etc.).

**Bază legală**: Normative specifice (ATEX, spații închise, etc.).

**Conținut:**
- Locația zonei
- Tipul riscului
- Măsuri de protecție
- Personal autorizat acces
- Permise de lucru emise (nr., date)
- Incidente/accidente în zona respectivă

**Păstrare**: 5 ani.

## 9. Fișele de date de securitate (FDS/MSDS) pentru substanțe chimice

**Obligativitate**: Companii care utilizează substanțe/preparate chimice periculoase.

**Bază legală**: Regulamentul REACH (CE) 1907/2006.

**Conținut FDS** (furnizat de producător):
- Identificarea substanței
- Identificarea pericolelor
- Compoziție
- Măsuri de prim ajutor
- Măsuri de stingere incendiu
- Măsuri în caz de dispersie accidentală
- Manipulare și depozitare
- Control expunere / protecție individuală
- Proprietăți fizico-chimice
- Stabilitate și reactivitate
- Informații toxicologice
- Informații ecologice
- Eliminare
- Informații de transport
- Informații de reglementare
- Alte informații

**Păstrare**: Accesibile la locul de utilizare + arhivă 10 ani după încetarea utilizării.

**Important**: FDS trebuie în limba română, actualizate (valabilitate 5 ani), accesibile angajaților expuși.

## 10. Registrul de evidență a controalelor efectuate de organe de control

**Obligativitate**: Recomandat TOATE companiile (ajută la tracking măsuri impuse).

**Conținut:**
- Data controlului
- Organul de control (ITM, ISU, DSP, ISCIR, etc.)
- Numele inspectorului
- Scopul controlului
- Deficiențe constatate
- Măsuri dispuse
- Termene
- Sancțiuni aplicate (amenzi, avertismente)
- Stadiu îndeplinire măsuri
- Semnătura reprezentantului companiei

**Păstrare**: Permanent.

## Recomandări generale

**Digitalizare**: Platformele SSM digitale permit păstrarea electronică a registrelor, cu backup automat, reminder-e scadențe, acces securizat.

**Actualizare**: Registrele trebuie completate prompt, nu retroactiv. Completări la zi = dovadă serioasa gestiune.

**Accesibilitate**: Registrele trebuie disponibile pentru control ITM/ISU oricând.

**Responsabil**: Desemnează o persoană responsabilă pentru completare și păstrare (de obicei responsabilul SSM sau HR).

**Backup**: Păstrează copii (fizice sau digitale) în locație separată, pentru protecție în caz de incendiu/inundație.

## Sancțiuni pentru lipsă/necompletare registre

Lipsa registrului de instructaj: 3.000 - 8.000 lei
Lipsa evidenței accidentelor: 5.000 - 10.000 lei
Lipsă fișe expunere: 10.000 - 20.000 lei
Registre incomplete/neactualizate: 2.000 - 5.000 lei

## Concluzie

Registrele SSM nu sunt birocratizare inutilă, ci instrumente de management al siguranței. Păstrarea lor corectă demonstrează seriozitatea abordării SSM, te protejează la controale și, cel mai important, ajută la prevenirea accidentelor prin tracking-ul sistematic al riscurilor și măsurilor luate.`,
    author: {
      name: "Daniel Popescu",
      role: "Consultant SSM Senior",
    },
    date: "2026-01-12",
    category: "SSM",
    readTime: 9,
    tags: ["Registre SSM", "Documentație", "Evidențe", "Compliance"],
  },
];

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return blogArticles.find((article) => article.slug === slug);
}

export function getArticlesByCategory(category: string): BlogArticle[] {
  return blogArticles.filter((article) => article.category === category);
}

export function getArticlesByTag(tag: string): BlogArticle[] {
  return blogArticles.filter((article) => article.tags.includes(tag));
}

export function getAllCategories(): string[] {
  return Array.from(new Set(blogArticles.map((article) => article.category)));
}

export function getAllTags(): string[] {
  return Array.from(
    new Set(blogArticles.flatMap((article) => article.tags))
  );
}

export function getRecentArticles(limit: number = 5): BlogArticle[] {
  return blogArticles
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}
