/**
 * FAQ PSI (Prevenire și Stingere Incendii)
 * Întrebări frecvente pentru utilizatorii platformei s-s-m.ro
 */

export interface FaqPsiItem {
  id: string;
  question: string;
  answer: string;
  category: 'autorizare' | 'stingatoare' | 'evacuare' | 'control-isu' | 'amenzi' | 'documente';
  legalReference: string;
}

export const faqPsiCategories = {
  autorizare: 'Autorizare PSI',
  stingatoare: 'Stingătoare și Echipamente',
  evacuare: 'Evacuare și Planuri',
  'control-isu': 'Control ISU',
  amenzi: 'Amenzi și Sancțiuni',
  documente: 'Documente și Raportare',
} as const;

export const faqPsiData: FaqPsiItem[] = [
  // AUTORIZARE PSI
  {
    id: 'aut-001',
    question: 'Ce firme au nevoie de autorizație PSI?',
    answer: 'Autorizația PSI este obligatorie pentru toate persoanele juridice și fizice autorizate care desfășoară activități economice, indiferent de domeniu. Aceasta include: spații comerciale, birouri, producție, depozitare, HoReCa, spații medicale, educaționale și orice altă activitate economică. Excepție fac doar locuințele private fără activitate comercială.',
    category: 'autorizare',
    legalReference: 'Legea 307/2006 privind apărarea împotriva incendiilor, Art. 18',
  },
  {
    id: 'aut-002',
    question: 'Cât timp este valabilă autorizația PSI?',
    answer: 'Autorizația de securitate la incendiu este valabilă pe durata existenței construcției/spațiului și a destinației pentru care a fost eliberată. Nu are termen de expirare, însă devine nulă dacă se modifică destinația spațiului, structura clădirii sau dacă se schimbă tipul de activitate desfășurată. În aceste cazuri trebuie obținută o nouă autorizație.',
    category: 'autorizare',
    legalReference: 'H.G. 571/2016, Art. 11',
  },
  {
    id: 'aut-003',
    question: 'Ce documente sunt necesare pentru obținerea autorizației PSI?',
    answer: 'Documentele necesare includ: cerere de eliberare (model ISU), dovada calității de proprietar/chiriaș (contract închiriere), plan de situație și amplasare, memoriu tehnic PSI întocmit de un expert, aviz PSI la proiect (pentru construcții noi), dovada achitării taxei, copie CI/CUI solicitant. Pentru spații închiriate, este necesar acordul proprietarului.',
    category: 'autorizare',
    legalReference: 'H.G. 571/2016, Anexa 2',
  },
  {
    id: 'aut-004',
    question: 'Cine poate întocmi documentația pentru autorizația PSI?',
    answer: 'Documentația tehnică (memoriul tehnic PSI, scenariile de securitate la incendiu) poate fi întocmită doar de persoane autorizate ISU ca experți tehnici cu competență în domeniul securității la incendiu. Aceștia trebuie să dețină certificat de expert tehnic valabil emis de Inspectoratul pentru Situații de Urgență. Consultanții PSI din platformă pot realiza această documentație.',
    category: 'autorizare',
    legalReference: 'Ordinul MAI 163/2007, modificat',
  },

  // STINGĂTOARE
  {
    id: 'sting-001',
    question: 'Câte stingătoare trebuie să am în firmă?',
    answer: 'Numărul de stingătoare depinde de suprafața spațiului, tipul activității și clasa de risc de incendiu. În general: 1 stingător la 200-250 mp pentru birouri (risc mic), 1 stingător la 100-150 mp pentru depozite/producție (risc mediu-mare). Distanța maximă de parcurs până la cel mai apropiat stingător nu trebuie să depășească 25-30 metri. Consultantul PSI calculează exact necesarul.',
    category: 'stingatoare',
    legalReference: 'Normativ P118/3-2015, Cap. 4',
  },
  {
    id: 'sting-002',
    question: 'Cât de des trebuie reverificate stingătoarele?',
    answer: 'Stingătoarele trebuie verificate periodic astfel: verificare vizuală lunară (intern, de către responsabilul PSI), verificare tehnică anuală (de către firme autorizate, cu etichetare), reîncărcare la 3-5 ani (în funcție de tip) sau după utilizare. La verificarea anuală se testează presiunea, starea agentului de stingere, funcționarea mecanismelor și se aplică eticheta de verificare.',
    category: 'stingatoare',
    legalReference: 'SR EN 3-7:2007, Normativ P118/3-2015',
  },
  {
    id: 'sting-003',
    question: 'Ce tip de stingător trebuie să aleg?',
    answer: 'Tipul stingătorului depinde de materiale/substanțe prezente: pulbere ABC (universal, cel mai folosit - lemn, hârtie, lichide, echipamente electrice), spumă (lichide inflamabile, nu pentru echipamente sub tensiune), CO2 (ideal pentru echipamente electrice, servere, tablouri), apă (doar incendii clasa A - lemn, hârtie). Pentru birouri: pulbere ABC. Pentru servere: CO2. Pentru bucătării: K (grăsimi).',
    category: 'stingatoare',
    legalReference: 'SR EN 3-7:2007',
  },
  {
    id: 'sting-004',
    question: 'Unde trebuie amplasate stingătoarele?',
    answer: 'Stingătoarele se montează: la loc vizibil și ușor accesibil, pe trasee de evacuare (lângă ieșiri), la 1.5m înălțime (mâner superior), cu marcaj vizibil (semnalizare fotoluminiscentă), protejate de lovire dar nu în dulapuri încuiate. Evitați: spatele ușilor, după obiecte, zone aglomerate. Fiecare nivel al clădirii trebuie să aibă minimum un stingător. Marcați locația pe planul de evacuare.',
    category: 'stingatoare',
    legalReference: 'Normativ P118/3-2015, Art. 4.2',
  },

  // EVACUARE
  {
    id: 'evac-001',
    question: 'Este obligatoriu planul de evacuare?',
    answer: 'Da, planul de evacuare este obligatoriu pentru toate spațiile cu activitate economică, indiferent de număr de angajați sau suprafață. Planul trebuie să fie vizibil, actualizat, fotoluminiscent sau iluminat, afișat la fiecare nivel/secțiune. Conține: traseele de evacuare, locația stingătoarelor, a hidrților, punctul de adunare, instrucțiuni de urgență și numerele de urgență (112, pompieri, salvare).',
    category: 'evacuare',
    legalReference: 'H.G. 571/2016, Anexa 7',
  },
  {
    id: 'evac-002',
    question: 'Cât de des trebuie făcut instructajul de evacuare?',
    answer: 'Instructajul privind măsurile de apărare împotriva incendiilor se face: la angajare (instructaj initial PSI), periodic anual pentru toți angajații, la schimbarea locului de muncă sau a atribuțiilor, după modificări ale condițiilor de muncă. Exercițiul practic de evacuare se recomandă anual, fiind obligatoriu pentru spații cu risc ridicat (producție, depozite substanțe periculoase, spații publice cu peste 50 persoane).',
    category: 'evacuare',
    legalReference: 'Ordinul MAI 163/2007, Art. 28-30',
  },
  {
    id: 'evac-003',
    question: 'Câte ieșiri de evacuare trebuie să existe?',
    answer: 'Numărul minim de ieșiri depinde de: numărul de persoane, destinația spațiului și clasa de risc. În general: minimum 2 ieșiri pentru spații peste 50 persoane sau cu risc mediu/ridicat, 1 ieșire poate fi suficientă pentru birouri mici sub 50 persoane cu risc scăzut. Ieșirile trebuie în direcții opuse, lățime minimă 0.90m, deschidere în sensul evacuării, nesigurante cu lacăt pe timpul programului.',
    category: 'evacuare',
    legalReference: 'Normativ P118/1-2015, Cap. 5',
  },
  {
    id: 'evac-004',
    question: 'Ce trebuie să conțină punctul de adunare?',
    answer: 'Punctul de adunare în caz de evacuare trebuie: marcat clar cu indicator vizibil, amplasat la distanță sigură de clădire (min 10-15m), accesibil pentru echipajele de intervenție, suficient de mare pentru toți ocupanții, protejat de căderi de obiecte, menționat în planul de evacuare și cunoscut de toți angajații. Se recomandă un responsabil pentru numărătoarea persoanelor evacuate și comunicarea cu serviciile de urgență.',
    category: 'evacuare',
    legalReference: 'Normativ P118/3-2015',
  },

  // CONTROL ISU
  {
    id: 'ctrl-001',
    question: 'Cât de des vine ISU la control?',
    answer: 'Frecvența controalelor ISU depinde de clasa de risc: risc ridicat (producție, depozite materiale periculoase) - anual sau la 2 ani, risc mediu (HoReCa, ateliere) - la 2-4 ani, risc scăzut (birouri, comerț) - la 4-6 ani sau aleatoriu. Primul control se face de regulă la 6-12 luni de la autorizare. ISU poate efectua și controale inopinate ca urmare a sesizărilor sau în perioade de campanie națională.',
    category: 'control-isu',
    legalReference: 'Legea 307/2006, Art. 24',
  },
  {
    id: 'ctrl-002',
    question: 'Ce verifică ISU la control?',
    answer: 'La control, ISU verifică: autorizația PSI valabilă, registrele PSI (instructaje, verificări), existența și starea stingătoarelor (etichetare la zi), planurile de evacuare afișate, traseele de evacuare libere și semnalizate, ieșirile de urgență funcționale (neîncuiate), instalațiile electrice conforme, respectarea măsurilor din autorizație, existența responsabilului PSI, cunoștințele angajaților despre proceduri. Se întocmește proces-verbal.',
    category: 'control-isu',
    legalReference: 'H.G. 571/2016, Anexa 6',
  },
  {
    id: 'ctrl-003',
    question: 'Ce documente trebuie pregătite pentru controlul ISU?',
    answer: 'Documente obligatorii: autorizația de securitate la incendiu (original), registrul de instructaj PSI (cu semnături), registrul de verificare stingătoare/hidrați, documentele de verificare tehnică anuală (de la firme autorizate), planul de evacuare actualizat, documentele de numire a responsabilului PSI, planul de prevenire și protecție (pentru spații cu risc), rapoartele de verificare instalații electrice, dovada întreținerii sistemelor de semnalizare/alarmare (dacă există).',
    category: 'control-isu',
    legalReference: 'Ordinul MAI 163/2007',
  },
  {
    id: 'ctrl-004',
    question: 'Pot refuza controlul ISU dacă nu sunt anunțat în prealabil?',
    answer: 'Nu, controalele ISU pot fi atât programate (cu notificare prealabilă), cât și inopinate (fără anunț). Refuzul de a permite accesul inspectorilor ISU în exercitarea atribuțiilor de serviciu constituie contravenție și se sancționează cu amendă. Reprezentantul legal sau responsabilul PSI trebuie să faciliteze controlul, să prezinte documentele solicitate și să însoțească echipa de control în spațiu.',
    category: 'control-isu',
    legalReference: 'Legea 307/2006, Art. 25, Art. 32',
  },

  // AMENZI
  {
    id: 'amenda-001',
    question: 'Ce amendă primesc dacă nu am autorizație PSI?',
    answer: 'Lipsa autorizației de securitate la incendiu se sancționează astfel: persoane juridice: 10.000 - 15.000 lei, persoane fizice autorizate: 2.000 - 3.000 lei. Sancțiunea contravențională se poate completa cu măsura complementară de sistare temporară a activității până la obținerea autorizației. Amenda se poate reduce cu 50% dacă se achită în 15 zile de la comunicare și se remediază neconformitatea.',
    category: 'amenzi',
    legalReference: 'Legea 307/2006, Art. 32, lit. a',
  },
  {
    id: 'amenda-002',
    question: 'Ce amendă este pentru stingătoare expirate?',
    answer: 'Nerespectarea obligației de verificare și întreținere a mijloacelor de apărare împotriva incendiilor (stingătoare, hidrați) se sancționează cu amendă: 4.000 - 6.000 lei pentru persoane juridice, 1.000 - 1.500 lei pentru persoane fizice. Se verifică eticheta de verificare anuală și termenul de reîncărcare. Stingătoarele fără etichetă la zi sau expirate sunt considerate neconforme și trebuie înlocuite/reverificate imediat.',
    category: 'amenzi',
    legalReference: 'Legea 307/2006, Art. 32, lit. f',
  },
  {
    id: 'amenda-003',
    question: 'Ce risc este dacă nu am instructaj PSI pentru angajați?',
    answer: 'Neefectuarea instructajului de apărare împotriva incendiilor pentru angajați se sancționează cu amendă de 3.000 - 5.000 lei pentru persoane juridice. Fiecare angajat trebuie să aibă înregistrat în registrul PSI: instructajul inițial (la angajare), instructajul periodic (anual) și instructaje la nevoie (schimbare post, modificări). Lipsa registrului sau a semnăturilor angajaților constituie dovada neefectuării instructajului.',
    category: 'amenzi',
    legalReference: 'Legea 307/2006, Art. 32, lit. e',
  },
  {
    id: 'amenda-004',
    question: 'Pot contesta procesul-verbal de la ISU?',
    answer: 'Da, procesul-verbal poate fi contestat în termen de 15 zile de la comunicare, la instanța judecătorească competentă (secția contencios administrativ). Contestația nu suspendă executarea, dar puteți solicita simultan suspendarea la instanță. Este recomandat să remediați neconformitățile rapid și să solicitați o nouă verificare ISU pentru a confirma conformitatea, ceea ce poate susține contestația. Consultați un avocat specializat pentru contestații.',
    category: 'amenzi',
    legalReference: 'O.G. 2/2001, Legea 554/2004',
  },

  // DOCUMENTE
  {
    id: 'doc-001',
    question: 'Ce este registrul de instructaj PSI și cum se completează?',
    answer: 'Registrul de instructaj PSI este un document obligatoriu în care se înregistrează toate instructajele efectuate. Conține: data instructajului, numele și prenumele persoanei instruite, tipul instructajului (inițial/periodic), tematica, durata, numele instructorului, semnătura celui instruit. Se numerotează paginile și se înregistrează la ISU sau se ștampilează. Trebuie păstrat minimum 5 ani. Platformă s-s-m.ro permite gestionarea digitală a instructajelor.',
    category: 'documente',
    legalReference: 'Ordinul MAI 163/2007, Anexa 10',
  },
  {
    id: 'doc-002',
    question: 'Cine poate fi responsabil PSI în firmă?',
    answer: 'Responsabil PSI poate fi: persoană din cadrul firmei (angajat/administrator) care a absolvit un curs de responsabil PSI autorizat ISU, consultant PSI extern (cu contract de prestări servicii), pentru firme mici (sub 10 angajați, risc scăzut) - administratorul după instructaj. Responsabilul trebuie desemnat prin decizie scrisă, să dețină certificat valabil și să cunoască specificul activității. Poate deservi mai multe firme simultan (consultant extern).',
    category: 'documente',
    legalReference: 'Ordinul MAI 163/2007, Art. 12-14',
  },
  {
    id: 'doc-003',
    question: 'Ce este scenariul de securitate la incendiu?',
    answer: 'Scenariul de securitate la incendiu este un document tehnic care analizează și descrie: caracteristicile construcției/spațiului, tipul activității și riscurile specifice, sursele potențiale de incendiu, măsurile de prevenire necesare, mijloacele de stingere și intervenție, traseele și procedurile de evacuare, sarcinile personalului. Este întocmit de expert tehnic PSI și face parte din documentația pentru autorizația PSI. Se actualizează la modificări semnificative.',
    category: 'documente',
    legalReference: 'H.G. 571/2016, Anexa 3',
  },
  {
    id: 'doc-004',
    question: 'Trebuie să raportez incidentele PSI către autorități?',
    answer: 'Da, trebuie raportate: incendiile (indiferent de amploare) - raportare imediată la 112 și ISU, accidentele prin incendiu cu victime - raportare către ITM și ISU în 24 ore, incidentele majore (pericol de explozie, substanțe periculoase) - raportare imediată. Se întocmește raport intern de cercetare cu cauze și măsuri corective. Neraportarea poate atrage răspundere contravențională sau penală. Păstrați documentația minimum 5 ani.',
    category: 'documente',
    legalReference: 'Legea 307/2006, Art. 15, Legea 319/2006',
  },
  {
    id: 'doc-005',
    question: 'Ce documente trebuie actualizate la schimbarea sediului?',
    answer: 'La schimbarea sediului firmei trebuie: obținută nouă autorizație PSI pentru noul spațiu (autorizația veche nu se transferă), actualizat planul de evacuare specific noului layout, refăcut inventarul mijloacelor PSI (stingătoare, hidrați conform noului spațiu), re-instruiți angajații cu privire la noile trasee de evacuare și punctul de adunare, notificat ISU despre schimbarea sediului, actualizate documentele firmei (CUI, registrul comerțului) cu noua adresă. Consultantul PSI poate coordona tot procesul.',
    category: 'documente',
    legalReference: 'H.G. 571/2016',
  },
];

/**
 * Returnează toate categoriile unice din FAQ
 */
export function getFaqCategories() {
  return Object.keys(faqPsiCategories) as Array<keyof typeof faqPsiCategories>;
}

/**
 * Returnează întrebările filtrate după categorie
 */
export function getFaqByCategory(category: keyof typeof faqPsiCategories) {
  return faqPsiData.filter((item) => item.category === category);
}

/**
 * Returnează o întrebare specifică după ID
 */
export function getFaqById(id: string) {
  return faqPsiData.find((item) => item.id === id);
}

/**
 * Caută în întrebări și răspunsuri după cuvinte cheie
 */
export function searchFaq(searchTerm: string) {
  const term = searchTerm.toLowerCase();
  return faqPsiData.filter(
    (item) =>
      item.question.toLowerCase().includes(term) ||
      item.answer.toLowerCase().includes(term) ||
      item.legalReference.toLowerCase().includes(term)
  );
}
