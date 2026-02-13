export interface HelpArticle {
  id: string;
  slug: string;
  title: string;
  category: 'Primii Pasi' | 'Angajati' | 'Instruiri' | 'Medical' | 'Echipamente' | 'Rapoarte' | 'Admin';
  content: string;
  relatedArticles: string[];
}

export const helpArticles: HelpArticle[] = [
  // Primii Pași (5 articole)
  {
    id: '1',
    slug: 'cum-incep',
    title: 'Cum încep să folosesc platforma?',
    category: 'Primii Pasi',
    content: `Platforma s-s-m.ro este concepută pentru a simplifica managementul securității și sănătății în muncă (SSM) și prevenirea situațiilor de urgență (PSI). După autentificare, veți fi direcționat către dashboard-ul principal unde puteți accesa toate funcționalitățile platformei.

Pentru a începe, recomandăm să completați mai întâi profilul organizației dumneavoastră în secțiunea Admin. Aici puteți adăuga detaliile companiei, configura setările și invita membrii echipei. Consultanții SSM pot gestiona mai multe organizații din același cont.

În funcție de rolul dumneavoastră (consultant, administrator firmă sau angajat), veți avea acces la diferite module ale platformei. Navigați prin meniurile laterale pentru a explora funcționalitățile disponibile: gestionarea angajaților, programarea instruirilor, monitorizarea certificatelor medicale și echipamentelor de protecție.`,
    relatedArticles: ['2', '3', '21']
  },
  {
    id: '2',
    slug: 'roluri-utilizatori',
    title: 'Ce roluri există în platformă?',
    category: 'Primii Pasi',
    content: `Platforma suportă trei tipuri principale de roluri, fiecare cu permisiuni specifice. Rolul de Consultant SSM/PSI are acces complet la toate funcționalitățile și poate gestiona mai multe organizații simultan, crea rapoarte și documenta complete, și supraveghea conformitatea pentru toți clienții.

Administratorul de Firmă poate gestiona angajații propriei organizații, programa instruiri și examene medicale, și accesa rapoarte pentru compania sa. Acest rol este ideal pentru responsabilii SSM din cadrul companiilor care gestionează intern conformitatea.

Angajatul are acces limitat la propriile date: poate vizualiza certificatele medicale personale, istoricul instruirilor urmate, și echipamentele de protecție alocate. Poate primi notificări despre scadențe și poate încărca documente solicitate de administrator.`,
    relatedArticles: ['1', '21', '22']
  },
  {
    id: '3',
    slug: 'navigare-dashboard',
    title: 'Cum navighezi în dashboard?',
    category: 'Primii Pasi',
    content: `Dashboard-ul principal oferă o vedere de ansamblu asupra tuturor aspectelor importante ale conformității SSM. Cardurile colorate de pe pagina principală afișează statistici în timp real: numărul de angajați activi, instruiri planificate, certificate medicale care expiră curând și alerte active care necesită atenție.

Meniul lateral din stânga oferă acces rapid la toate modulele platformei. Fiecare secțiune este organizată logic: Angajați pentru managementul forței de muncă, Instruiri pentru training-uri SSM/PSI, Medical pentru examene și certificate medicale, Echipamente pentru evidența echipamentelor de protecție, și Rapoarte pentru generarea documentelor de conformitate.

În colțul din dreapta sus găsiți meniul de profil unde puteți schimba organizația activă (dacă gestionați mai multe companii), accesa setările contului și ieși din aplicație. Notificările și alertele importante sunt afișate printr-o iconă cu badge numeric.`,
    relatedArticles: ['1', '4', '5']
  },
  {
    id: '4',
    slug: 'notificari-alerte',
    title: 'Cum funcționează notificările și alertele?',
    category: 'Primii Pasi',
    content: `Sistemul de notificări vă ține informat despre toate evenimentele importante legate de conformitatea SSM. Alertele sunt generate automat cu 30, 14 și 7 zile înainte de expirarea certificatelor medicale, autorizațiilor de lucru sau instruirilor SSM/PSI. Aceasta vă permite să planificați din timp reînnoirile necesare.

Notificările sunt codificate prin culori pentru prioritizare rapidă: roșu pentru situații urgente (documente expirate), portocaliu pentru avertismente (expirare în 14 zile), și galben pentru atenționări (expirare în 30 zile). Puteți accesa centrul de notificări din bara de navigare superioară.

Fiecare alertă include un link direct către elementul care necesită atenție, permițându-vă să acționați imediat. Puteți marca notificările ca citite sau le puteți respinge dacă au fost rezolvate. Consultanții primesc notificări consolidate pentru toate organizațiile pe care le gestionează.`,
    relatedArticles: ['3', '15', '20']
  },
  {
    id: '5',
    slug: 'setari-profil',
    title: 'Cum îmi configurez profilul și setările?',
    category: 'Primii Pasi',
    content: `Profilul dumneavoastră poate fi accesat din meniul din colțul dreapta sus al aplicației. Aici puteți actualiza informațiile personale: nume, email, telefon și fotografia de profil. Este important să mențineți datele de contact actualizate pentru a primi notificări importante.

În secțiunea Setări puteți configura preferințele de notificare: alegeți ce tipuri de alerte doriți să primiți prin email sau în aplicație, setați intervalele de timp pentru reminder-uri și configurați limba preferată a interfeței (română, engleză, germană, maghiară sau bulgară).

Pentru consultanții care gestionează mai multe organizații, setările permit configurarea organizației implicite la autentificare și personalizarea dashboard-ului pentru fiecare client. Puteți de asemenea să gestionați dispozitivele conectate și să vizualizați istoricul activității din contul dumneavoastră pentru securitate sporită.`,
    relatedArticles: ['1', '2', '23']
  },

  // Angajați (4 articole)
  {
    id: '6',
    slug: 'adaugare-angajat',
    title: 'Cum adaug un angajat nou?',
    category: 'Angajati',
    content: `Pentru a adăuga un angajat nou, navigați la secțiunea Angajați din meniul lateral și apăsați butonul "Adaugă Angajat" din colțul dreapta sus. Veți fi direcționat către un formular unde trebuie să completați datele obligatorii: nume, prenume, CNP, funcția ocupată și data angajării.

Formularul include și câmpuri opționale dar importante: email de contact, număr de telefon, departament, tipul de contract (determinat/nedeterminat), și nota referitoare la riscurile specifice postului. Asigurați-vă că funcția introdusă corespunde cu cea din Registrul de evidență a salariaților pentru conformitate cu legislația.

După salvare, angajatul va apărea în lista principală și va primi automat un ID unic în sistem. Puteți apoi să îi atribuiți instruiri obligatorii, să îi programați examenul medical și să îi alocați echipamente de protecție necesare postului. Sistemul va genera automat alertele pentru scadențele asociate acestui angajat.`,
    relatedArticles: ['7', '8', '10']
  },
  {
    id: '7',
    slug: 'editare-angajat',
    title: 'Cum modific datele unui angajat?',
    category: 'Angajati',
    content: `Pentru a modifica informațiile unui angajat existent, accesați lista de angajați și identificați persoana dorită folosind funcția de căutare sau filtrele disponibile. Apăsați pe numele angajatului pentru a deschide fișa completă, apoi selectați butonul "Editează" din colțul dreapta sus.

Puteți actualiza orice informație cu excepția CNP-ului care servește ca identificator unic în sistem. Modificările frecvente includ: schimbarea funcției la promovare, actualizarea datelor de contact, modificarea departamentului sau notele privind riscurile postului. Toate modificările sunt înregistrate în istoricul de audit pentru trasabilitate.

După salvarea modificărilor, sistemul va verifica automat dacă schimbarea funcției necesită instruiri suplimentare sau alte documente de conformitate. De exemplu, promovarea la un post cu responsabilități de securitate va declanșa sugestii pentru instruiri specifice. Fișa angajatului va reflecta imediat noile informații.`,
    relatedArticles: ['6', '8', '24']
  },
  {
    id: '8',
    slug: 'dezactivare-angajat',
    title: 'Cum dezactivez un angajat care a plecat?',
    category: 'Angajati',
    content: `Când un angajat părăsește organizația, nu trebuie să îl ștergeți din sistem pentru a păstra istoricul și conformitatea cu legislația. În schimb, utilizați funcția de dezactivare. Accesați fișa angajatului, apăsați "Editează" și setați câmpul "Status" pe "Inactiv", apoi completați data încetării contractului.

Angajații dezactivați nu mai apar în listele active și rapoartele curente, dar rămân accesibili în arhivă pentru audituri și verificări ulterioare. Toate certificatele medicale, instruirile absolvite și echipamentele alocate vor fi marcate ca arhivate, iar alertele viitoare pentru acest angajat vor fi anulate automat.

Este important să păstrați datele angajaților pentru minimum 5 ani conform cerințelor legale privind evidența instruirilor SSM. Puteți genera rapoarte istorice care includ și angajații inactivi selectând opțiunea corespunzătoare în filtrul de status din secțiunea Rapoarte.`,
    relatedArticles: ['6', '7', '24']
  },
  {
    id: '9',
    slug: 'import-angajati',
    title: 'Pot importa mai mulți angajați dintr-un fișier Excel?',
    category: 'Angajati',
    content: `Da, platforma oferă funcționalitate de import în bloc pentru situațiile în care aveți mulți angajați de adăugat simultan. Navigați la secțiunea Angajați și apăsați butonul "Import Excel" din zona de acțiuni. Mai întâi, descărcați șablonul Excel furnizat care conține toate coloanele necesare cu formatare corectă.

Completați șablonul cu datele angajaților respectând strict formatul indicat: CNP fără spații, date în format DD.MM.YYYY, funcții exact ca în Registrul general de evidență. Verificați că nu aveți CNP-uri duplicate și că toate câmpurile obligatorii sunt completate. Salvați fișierul și încărcați-l folosind butonul din interfață.

Sistemul va valida automat datele și va afișa un raport preliminar cu eventualele erori sau avertismente. Puteți corecta erorile în Excel și reîncărca fișierul sau puteți finaliza importul pentru înregistrările valide. După import, veți primi un raport detaliat cu numărul de angajați adăugați cu succes și lista eventualelor probleme întâmpinate.`,
    relatedArticles: ['6', '24', '19']
  },

  // Instruiri (4 articole)
  {
    id: '10',
    slug: 'programare-instruire',
    title: 'Cum programez o instruire SSM?',
    category: 'Instruiri',
    content: `Pentru a programa o instruire SSM sau PSI, accesați modulul Instruiri din meniul principal și selectați "Programează Instruire". Alegeți tipul de instruire: instructaj general (la angajare), instructaj periodic (anual sau conform procedurilor), instructaj la locul de muncă sau instruire PSI. Fiecare tip are periodicitatea și conținutul stabilite de legislație.

Selectați angajații care trebuie să participe la instruire. Puteți alege individual sau puteți selecta un departament întreg. Sistemul va afișa automat angajații care au instruiri expirate sau care se apropie de scadență pentru tipul selectat. Setați data și ora instruirii, locația și instructorul responsabil.

După confirmarea programării, fiecare participant va primi o notificare cu detaliile instruirii. Platforma generează automat fișa de instructaj cu conținutul specific riscurilor identificate pentru posturile respective. La finalizarea instruirii, puteți marca participanții ca prezenți și sistemul va actualiza automat datele de conformitate și va genera următoarea scadență.`,
    relatedArticles: ['11', '12', '6']
  },
  {
    id: '11',
    slug: 'tipuri-instruiri',
    title: 'Ce tipuri de instruiri există și când sunt obligatorii?',
    category: 'Instruiri',
    content: `Legislația SSM prevede mai multe tipuri de instruiri obligatorii. Instructajul general se efectuează obligatoriu la angajare, înainte ca salariatul să înceapă activitatea. Acesta acoperă riscurile generale din organizație, proceduri de urgență, obligații și drepturi SSM. Platforma generează automat conținutul conform Legii 319/2006.

Instructajul la locul de muncă se realizează imediat după cel general și este specific postului și echipamentelor utilizate. Acesta trebuie repetat la schimbarea locului de muncă, modificarea procesului tehnologic sau după un accident de muncă. Instructajul periodic se efectuează anual pentru majoritatea funcțiilor sau la 6 luni pentru lucrări cu risc ridicat.

Instruirea PSI (prevenirea și stingerea incendiilor) este obligatorie anual pentru toți angajații, cu program adaptat specificulului activității. Platforma calculează automat următoarea scadență pentru fiecare tip de instruire pe baza datei ultimei participări și periodicității legale, generând alerte cu 30 de zile înainte de expirare.`,
    relatedArticles: ['10', '12', '15']
  },
  {
    id: '12',
    slug: 'generare-fisa-instructaj',
    title: 'Cum generez fișa de instructaj?',
    category: 'Instruiri',
    content: `Fișa de instructaj se generează automat la programarea unei instruiri noi. Navigați la secțiunea Instruiri, selectați instruirea dorită și apăsați butonul "Generează Fișă". Sistemul va crea un document completat cu datele organizației, tipul instruirii, conținutul specific conform normelor în vigoare și lista participanților.

Conținutul fișei este precompletat pe baza tipului de instruire și funcțiilor participanților, incluzând riscurile identificate în evaluarea specifică a posturilor respective. Puteți personaliza conținutul adăugând aspecte specifice activității dumneavoastră sau eliminând secțiuni nerelevante. Fișa include și spațiul pentru semnăturile participanților și instructorului.

După finalizarea instruirii, puteți încărca fișa semnată scanată în platformă pentru arhivare digitală. Documentul va fi atașat automat la înregistrarea instruirii și va fi disponibil pentru rapoarte și audituri ulterioare. Fișele pot fi descărcate în format PDF sau Word pentru printare și semnare fizică.`,
    relatedArticles: ['10', '11', '19']
  },
  {
    id: '13',
    slug: 'istoric-instruiri',
    title: 'Unde văd istoricul instruirilor unui angajat?',
    category: 'Instruiri',
    content: `Istoricul complet al instruirilor pentru fiecare angajat este disponibil în fișa individuală. Navigați la secțiunea Angajați, selectați angajatul dorit și accesați tab-ul "Instruiri". Aici veți vedea o listă cronologică cu toate instruirile la care a participat, inclusiv data, tipul instruirii, instructorul și statusul certificatului.

Pentru fiecare instruire sunt afișate detalii complete: durata, conținutul parcurs, rezultatul evaluării (dacă este cazul) și documentele atașate. Puteți descărca fișele de instructaj semnate și puteți vizualiza nota de participare. Instruirile sunt marcate cu culori diferite pentru a identifica rapid cele valide, cele aproape de expirare și cele expirate.

Sistemul calculează automat următoarea dată când angajatul trebuie să repete instruirea pe baza periodicității legale. Un banner de avertizare va apărea cu 30 de zile înainte de expirare. Puteți exporta întregul istoric într-un raport PDF pentru dosarul personal al angajatului sau pentru prezentarea la inspectorii ITM.`,
    relatedArticles: ['10', '11', '19']
  },

  // Medical (4 articole)
  {
    id: '14',
    slug: 'adaugare-examen-medical',
    title: 'Cum înregistrez un examen medical?',
    category: 'Medical',
    content: `Pentru a înregistra un examen medical, accesați fișa angajatului din secțiunea Angajați și navigați la tab-ul "Medical". Apăsați "Adaugă Examen Medical" și completați formularul cu datele obligatorii: tipul examenului (la angajare, periodic, la reluarea activității), data efectuării, furnizorul medical și rezultatul (apt/apt cu restricții/inapt).

Introduceți data următorului control medical conform recomandărilor medicului de medicina muncii, care variază în funcție de vârstă și factorii de risc: anual pentru majoritatea funcțiilor, la 6 luni pentru expuneri la risc ridicat sau la 3 luni pentru tineri sub 18 ani. Sistemul va genera automat o alertă cu 30 de zile înainte de expirarea certificatului.

Puteți atașa avizul medical scanat pentru arhivare digitală securizată. Documentul va fi criptat și accesibil doar persoanelor autorizate conform GDPR. Dacă examenul relevă restricții sau aptitudine condiționată, introduceți detaliile în câmpul "Observații" pentru a fi luate în considerare la alocarea sarcinilor de lucru.`,
    relatedArticles: ['15', '16', '6']
  },
  {
    id: '15',
    slug: 'alerte-expirare-medical',
    title: 'Cum primesc alerte pentru certificate medicale ce expiră?',
    category: 'Medical',
    content: `Sistemul de alertare automată monitorizează continuu toate certificatele medicale și generează notificări la intervale prestabilite. Prima alertă este trimisă cu 30 de zile înainte de expirare, apoi cu 14 zile, 7 zile și în ziua expirării. După expirare, alertele devin critice și angajatul apare ca non-conform în rapoarte.

Alertele sunt vizibile în mai multe locuri: în centrul de notificări (iconița cu clopoțel din bara superioară), pe dashboard-ul principal în cardul "Alerte Active" și în lista de angajați printr-o iconă roșie de avertizare. Consultanții primesc un email zilnic consolidat cu toate expirările din organizațiile pe care le gestionează.

Puteți personaliza frecvența și tipul notificărilor în secțiunea Setări. Recomandăm să păstrați toate tipurile de alerte activate pentru a nu rata termene legale importante. La primirea unei alerte, apăsați pe link pentru a accesa direct fișa angajatului și a programa noul examen medical.`,
    relatedArticles: ['14', '16', '4']
  },
  {
    id: '16',
    slug: 'periodicitate-examen-medical',
    title: 'Cât de des trebuie făcut examenul medical?',
    category: 'Medical',
    content: `Periodicitatea examenelor medicale de medicina muncii este stabilită de legislație în funcție de mai mulți factori. Regula generală pentru adulții fără expuneri speciale este examenul medical anual. Această perioadă poate fi redusă de medicul de medicina muncii dacă identifică factori de risc specific locului de muncă.

Pentru tinerii sub 18 ani, examenul medical este obligatoriu la fiecare 3 luni indiferent de tipul activității. Lucrătorii expuși la factori nocivi profesioniști (zgomot peste 85dB, substanțe chimice, vibrații, radiații) pot necesita controale la 6 luni. Persoanele peste 50 de ani în funcții cu solicitare fizică pot avea periodicitate redusă la 6-8 luni.

Medicul de medicina muncii stabilește exact perioada până la următorul control și o înscrie în avizul medical. Introducând această dată în platformă, sistemul va calcula automat scadența și va genera alertele corespunzătoare. Este important să respectați strict recomandarea medicului pentru a menține conformitatea și a proteja sănătatea angajaților.`,
    relatedArticles: ['14', '15', '11']
  },
  {
    id: '17',
    slug: 'angajat-inapt',
    title: 'Ce fac dacă un angajat este declarat inapt medical?',
    category: 'Medical',
    content: `Când un angajat primește aviz medical "Inapt" pentru postul curent, acesta nu mai poate desfășura activitatea respectivă conform Legii 319/2006. Primul pas este să înregistrați imediat rezultatul în platformă selectând "Inapt" în câmpul "Rezultat examen" și notând recomandările medicului în secțiunea "Observații".

Angajatul va fi marcat automat ca non-conform și va apărea cu alertă roșie în rapoarte. Conform legislației muncii, angajatorul are obligația să încerce relocarea salariatului pe un alt post compatibil cu restricțiile medicale. Platforma vă permite să modificați funcția angajatului și să verificați compatibilitatea cu avizul medical primit.

Dacă relocarea nu este posibilă și aptitudinea medicală nu poate fi restabilită în 90 de zile, poate fi necesară suspendarea sau încetarea contractului de muncă conform Codului Muncii. Documentați tot procesul în platforma și păstrați toate avizele medicale pentru eventuale dispute. Consultați un specialist în dreptul muncii pentru procedura corectă specifică situației.`,
    relatedArticles: ['14', '15', '7']
  },

  // Echipamente (3 articole)
  {
    id: '18',
    slug: 'alocare-epi',
    title: 'Cum aloc echipamente de protecție unui angajat?',
    category: 'Echipamente',
    content: `Pentru a aloca echipamente de protecție individuală (EPI), navigați la fișa angajatului și selectați tab-ul "Echipamente". Apăsați "Alocă EPI" și veți vedea lista echipamentelor necesare pentru postul respectiv, generate automat pe baza evaluării riscurilor profesionale specifice funcției.

Selectați echipamentele din listă (cască, mănuși, ochelari, încălțăminte de protecție, etc.) și completați detaliile: marca și modelul echipamentului, data alocării, numărul de bucăți și perioada de utilizare normată conform normelor HG 1048/2006. Platforma include deja periodicitatea standard pentru echipamentele comune: 12 luni pentru încălțăminte, 6 luni pentru mănuși de protecție, etc.

După alocare, angajatul trebuie să semneze procesul verbal de predare-primire EPI. Puteți genera acest document direct din platformă, îl puteți printa pentru semnare și apoi îl încărcați scanat. Sistemul va calcula automat următoarea dată de înlocuire și va genera alerte când echipamentul se apropie de limita perioadei de utilizare.`,
    relatedArticles: ['19', '20', '6']
  },
  {
    id: '19',
    slug: 'raport-epi',
    title: 'Cum generez raportul cu echipamentele alocate?',
    category: 'Echipamente',
    content: `Raportul cu echipamentele de protecție alocate este disponibil în secțiunea Rapoarte. Selectați "Raport EPI" și alegeți perioada dorită și filtrele necesare: departament specific, tip de echipament, status (active/expirate), sau angajați individuali. Raportul va include toate alocările care îndeplinesc criteriile selectate.

Documentul generat conține pentru fiecare angajat: numele, funcția, lista echipamentelor alocate cu data predării, perioada normată de utilizare, data scadentă de înlocuire și statusul curent (activ/expirat/aproape de expirare). Raportul este disponibil pentru vizualizare în browser, export PDF pentru printare sau export Excel pentru procesare ulterioară.

Acest raport este util pentru planificarea achizițiilor de EPI, pentru verificări interne de conformitate și pentru prezentarea la inspectorii ITM. Recomandăm generarea lui lunar pentru a identifica din timp echipamentele care trebuie reînnoite și a evita situațiile de non-conformitate. Puteți programa generarea automată și primirea lui prin email.`,
    relatedArticles: ['18', '20', '25']
  },
  {
    id: '20',
    slug: 'inlocuire-epi',
    title: 'Cum înregistrez înlocuirea unui echipament uzat?',
    category: 'Echipamente',
    category: 'Echipamente',
    content: `Când un echipament de protecție ajunge la finalul perioadei de utilizare sau se uzează prematur, trebuie înregistrată înlocuirea. Accesați fișa angajatului, tab-ul "Echipamente" și identificați echipamentul care necesită înlocuire. Apăsați butonul "Înlocuiește" pentru a deschide formularul specific.

În formularul de înlocuire, sistemul va prelua automat datele echipamentului vechi și va crea o nouă alocare cu aceleași caracteristici. Actualizați data alocării cu data curentă și, dacă este cazul, modificați marca sau modelul dacă ați achiziționat echipamente noi. Vechea alocare va fi marcată automat ca "Închisă" și arhivată pentru istoric.

Dacă înlocuirea se face înainte de termen din cauza uzurii sau deteriorării, notați motivul în câmpul "Observații" - aceasta este important pentru analiza calității echipamentelor și pentru fundamentarea bugetului viitor. Generați noul proces verbal de predare-primire pentru semnarea angajatului. Istoricul complet al alocărilor rămâne disponibil pentru audit.`,
    relatedArticles: ['18', '19', '15']
  },

  // Rapoarte (3 articole)
  {
    id: '21',
    slug: 'tipuri-rapoarte',
    title: 'Ce rapoarte pot genera din platformă?',
    category: 'Rapoarte',
    content: `Platforma oferă o gamă completă de rapoarte pentru conformitatea SSM/PSI. Raportul de Conformitate Generală oferă o vedere de ansamblu asupra statusului organizației: procentul de angajați cu examene medicale valide, instruiri la zi, EPI alocate corect și alerte active. Acest raport este ideal pentru managementul de top și consiliul de administrație.

Rapoartele specifice pe module includ: Raport Angajați (lista completă cu status conformitate), Raport Instruiri (istoricul și planificarea instruirilor), Raport Medical (scadențe examene și statistici aptitudine), Raport EPI (echipamente alocate și necesare înlocuire), și Raport Alerte (toate non-conformitățile active). Fiecare poate fi filtrat pe departamente, perioade sau angajați specifici.

Rapoartele legale predefinite includ documentele necesare pentru ITM: Raport anual SSM, Registrul de evidență a instruirilor, Fișa de evidență medicală agregată. Acestea respectă exact formatul cerut de legislație și pot fi generate instant la solicitarea inspectorilor. Toate rapoartele sunt exportabile în PDF, Excel sau Word.`,
    relatedArticles: ['22', '23', '25']
  },
  {
    id: '22',
    slug: 'programare-rapoarte-automate',
    title: 'Pot programa rapoarte automate recurente?',
    category: 'Rapoarte',
    content: `Da, platforma permite programarea rapoartelor automate pentru distribuire recurentă. Navigați la secțiunea Rapoarte, selectați tipul de raport dorit și apăsați "Programează". Alegeți frecvența: zilnică, săptămânală, lunară sau la date specifice (de exemplu, în fiecare zi de 1 a lunii pentru raportul lunar).

Configurați parametrii raportului: filtre, format de export (PDF sau Excel) și destinatarii emailului. Puteți adăuga mai multe adrese de email pentru a distribui automat raportul către manageri, responsabili SSM sau autorități. Raportul va fi generat automat la ora programată și trimis tuturor destinatarilor, fără să necesite intervenție manuală.

Rapoartele automate sunt utile pentru: raportarea lunară către managementul de top, sincronizarea săptămânală cu echipa HR pentru angajați cu examene medicale expirate, sau dashboardul zilnic de alerte pentru consultantul SSM. Puteți modifica sau șterge programările oricând din secțiunea "Rapoarte Programate" a setărilor.`,
    relatedArticles: ['21', '23', '4']
  },
  {
    id: '23',
    slug: 'export-date-excel',
    title: 'Cum export datele în Excel pentru procesare?',
    category: 'Rapoarte',
    content: `Majoritatea listelor și rapoartelor din platformă pot fi exportate în format Excel pentru analiză în profunzime sau integrare cu alte sisteme. În orice listă (Angajați, Instruiri, Medical, Echipamente), veți găsi un buton "Export Excel" în zona de acțiuni din colțul dreapta sus al tabelului.

Fișierul Excel generat va include toate coloanele vizibile în listă, respectând filtrele pe care le-ați aplicat. De exemplu, dacă ați filtrat doar angajații din departamentul "Producție" cu examene medicale expirate, exportul va conține doar aceste înregistrări. Datele sunt formatate corect cu antetele pe primul rând și filtre active.

Pentru exporte complexe cu date din mai multe module, utilizați Rapoartele personalizate. Aici puteți selecta exact ce câmpuri doriți să includeți din diferite entități: angajați cu instruirile lor, examene medicale și EPI-uri alocate, totul într-un singur fișier. Formatarea Excel permite continuarea analizei cu formule, pivot tables sau grafice în Excel.`,
    relatedArticles: ['21', '22', '9']
  },

  // Admin (6 articole)
  {
    id: '24',
    slug: 'gestionare-organizatie',
    title: 'Cum gestionez datele organizației?',
    category: 'Admin',
    content: `Datele organizației se administrează din secțiunea Admin, accesibilă doar utilizatorilor cu rol de Administrator sau Consultant. Aici puteți actualiza informații esențiale: denumirea completă a firmei, CUI/CIF, cod CAEN al activității principale, adresa sediului social și datele de contact (telefon, email, website).

Este important să mențineți aceste informații actualizate deoarece apar automat în toate documentele generate de platformă: rapoarte, fișe de instructaj, procese verbale de predare-primire EPI. Schimbările de adresă, denumire sau reprezentant legal trebuie actualizate prompt pentru conformitatea documentelor oficiale.

În această secțiune puteți de asemenea încărca logo-ul companiei care va apărea pe documentele generate, configura numărul de înregistrare al documentelor SSM și seta preferințele organizaționale: limba implicită a documentelor, formatul datelor, și template-urile personalizate pentru rapoarte. Toate modificările sunt salvate instant și aplicate imediat.`,
    relatedArticles: ['25', '2', '5']
  },
  {
    id: '25',
    slug: 'adaugare-utilizatori',
    title: 'Cum adaug noi utilizatori în platformă?',
    category: 'Admin',
    content: `Pentru a adăuga un nou utilizator, navigați la Admin > Utilizatori și apăsați "Invită Utilizator". Introduceți adresa de email a persoanei și selectați rolul: Consultant (acces complet, mai multe organizații), Administrator Firmă (gestionare propria organizație) sau Angajat (acces doar la datele personale).

După trimiterea invitației, persoana va primi un email cu link-ul de activare a contului. La primul acces, va trebui să își seteze parola și să completeze datele de profil. Până la activarea contului, invitația va apărea cu status "În așteptare" în lista de utilizatori. Puteți resende invitația sau o puteți anula dacă este cazul.

Pentru consultanți care gestionează mai mulți clienți, puteți asocia același utilizator cu mai multe organizații din secțiunea "Membri organizație". Astfel, consultantul va putea comuta între organizații din meniul de profil fără a se deautentifica. Fiecare rol are permisiuni specifice configurate conform politicii RBAC a platformei.`,
    relatedArticles: ['24', '2', '21']
  },
  {
    id: '26',
    slug: 'configurare-permisiuni',
    title: 'Cum configurez permisiunile utilizatorilor?',
    category: 'Admin',
    content: `Sistemul de permisiuni se bazează pe roluri predefinite (RBAC - Role Based Access Control). Fiecare rol are un set clar de permisiuni: Consultantul are acces complet la toate funcționalitățile pentru toate organizațiile pe care le gestionează, poate crea și modifica orice date, genera rapoarte și invita utilizatori noi.

Administratorul de Firmă poate gestiona angajații propriei organizații, programa instruiri și examene medicale, aloca EPI și genera rapoarte, dar nu poate modifica setările organizației sau gestiona utilizatori. Angajatul are acces read-only la propriile date: poate vizualiza certificatul medical, istoricul instruirilor și EPI-urile alocate, dar nu poate modifica nimic.

Pentru scenarii speciale, platforma permite crearea de roluri personalizate cu permisiuni granulare. Accesați Admin > Roluri și Permisiuni, apăsați "Rol Nou" și selectați exact ce acțiuni poate efectua acest rol: vizualizare angajați (fără CNP), editare instruiri, export rapoarte, etc. Atribuiți apoi rolul personalizat utilizatorilor doriti din lista de membri.`,
    relatedArticles: ['25', '2', '24']
  },
  {
    id: '27',
    slug: 'audit-log',
    title: 'Unde văd istoricul modificărilor în platformă?',
    category: 'Admin',
    content: `Toate acțiunile importante sunt înregistrate automat în jurnalul de audit (Audit Log), accesibil administratorilor din Admin > Istoric Modificări. Aici puteți vedea cronologic cine a făcut ce modificare, când și din ce dispozitiv. Fiecare înregistrare include: utilizatorul, tipul acțiunii (creare, editare, ștergere), entitatea afectată și timestamp-ul exact.

Jurnalul de audit este esențial pentru conformitatea GDPR și pentru investigarea incidentelor. De exemplu, puteți afla cine a modificat datele unui angajat, când a fost șters un document sau cine a accesat datele medicale sensibile. Toate accesările datelor cu caracter personal sunt loguite conform cerințelor de trasabilitate.

Puteți filtra jurnalul după: utilizator, tip de acțiune, entitate afectată (angajați, instruiri, etc.) sau perioadă de timp. Exportul în Excel este disponibil pentru analize detaliate sau pentru furnizarea către autoritățile de control. Înregistrările din audit log sunt șterse automat după 7 ani conform politicii de păstrare a datelor.`,
    relatedArticles: ['24', '26', '7']
  },
  {
    id: '28',
    slug: 'backup-date',
    title: 'Cum sunt protejate datele mele? Există backup?',
    category: 'Admin',
    content: `Toate datele platformei sunt stocate în Supabase, o infrastructură enterprise-grade cu redundanță și backup automat. Baza de date este replicată în timp real pe mai multe servere pentru disponibilitate maximă. Backup-uri complete sunt realizate zilnic și sunt păstrate timp de 30 de zile, permițând restaurarea datelor în caz de incident.

Datele sensibile (examene medicale, CNP-uri) sunt criptate atât în tranzit (HTTPS/TLS) cât și în repaus (AES-256). Accesul la date este restricționat prin Row Level Security (RLS) la nivel de bază de date, astfel încât utilizatorii pot accesa doar datele organizațiilor la care au acces explicit. Conformitate completă cu GDPR pentru protecția datelor cu caracter personal.

Ca măsură suplimentară de siguranță, recomandăm export-uri periodice ale datelor importante în format Excel din secțiunea Rapoarte. Acestea pot fi stocate local sau în cloud-ul companiei dumneavoastră. În caz de necesitate, echipa de suport poate restaura datele din backup-urile zilnice la cererea administratorului organizației.`,
    relatedArticles: ['24', '27', '23']
  },
  {
    id: '29',
    slug: 'suport-tehnic',
    title: 'Cum contactez suportul tehnic?',
    category: 'Admin',
    content: `Suportul tehnic este disponibil prin mai multe canale în funcție de urgența situației. Pentru întrebări generale și asistență în utilizarea platformei, accesați Centrul de Ajutor din meniul principal (iconița cu semnul întrebării) unde găsiți aceste articole și tutoriale video. Majoritatea problemelor comune sunt documentate aici.

Pentru probleme tehnice sau erori în funcționarea platformei, utilizați formularul de contact disponibil în footer sau trimiteți un email la support@s-s-m.ro. Includeți o descriere detaliată a problemei, pașii pentru reproducere și, dacă este posibil, capturi de ecran. Timpul de răspuns standard este de 24 de ore în zilele lucrătoare.

Pentru situații urgente care blochează activitatea (imposibilitatea accesării platformei, pierderea datelor, probleme de securitate), sunați la numărul de telefon de urgență afișat în email-ul de bun venit. Suportul telefonic pentru urgențe este disponibil L-V între 9:00-18:00. Consultanții cu pachete premium beneficiază de suport prioritar cu timp de răspuns sub 4 ore.`,
    relatedArticles: ['1', '5', '24']
  }
];

export function getArticleBySlug(slug: string): HelpArticle | undefined {
  return helpArticles.find(article => article.slug === slug);
}

export function getArticlesByCategory(category: HelpArticle['category']): HelpArticle[] {
  return helpArticles.filter(article => article.category === category);
}

export function getRelatedArticles(articleId: string): HelpArticle[] {
  const article = helpArticles.find(a => a.id === articleId);
  if (!article) return [];

  return article.relatedArticles
    .map(id => helpArticles.find(a => a.id === id))
    .filter((a): a is HelpArticle => a !== undefined);
}

export const categories: HelpArticle['category'][] = [
  'Primii Pasi',
  'Angajati',
  'Instruiri',
  'Medical',
  'Echipamente',
  'Rapoarte',
  'Admin'
];
