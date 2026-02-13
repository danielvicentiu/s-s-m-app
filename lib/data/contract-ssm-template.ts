/**
 * Template contract prestări servicii SSM
 * Contract între firmă (beneficiar) și consultant extern SSM (prestator)
 */

export interface ContractSSMData {
  // Părți contractante - Prestator
  prestatorNumeFirma: string;
  prestatorCUI: string;
  prestatorRegCom: string;
  prestatorSediu: string;
  prestatorReprezentant: string;
  prestatorFunctie: string;

  // Părți contractante - Beneficiar
  beneficiarNumeFirma: string;
  beneficiarCUI: string;
  beneficiarRegCom: string;
  beneficiarSediu: string;
  beneficiarReprezentant: string;
  beneficiarFunctie: string;

  // Obiect contract
  numarAngajati: number;
  puncteLucru: string[];
  domeniuActivitate: string;

  // Durată
  dataInceput: string;
  dataFinal: string;

  // Preț și plată
  valoareMensualaCuTVA: number;
  valoareMensualeFaraTVA: number;
  TVA: number;
  termenPlata: number; // zile
  contBancar: string;
  banca: string;

  // Date semnătură
  dataSemnare: string;
  locSemnare: string;
}

export const contractSSMTemplate = {
  /**
   * Generează textul complet al contractului SSM
   */
  generateContract: (data: ContractSSMData): string => {
    return `
CONTRACT DE PRESTĂRI SERVICII
Protecția și Securitatea Muncii

Nr. _________ / ${data.dataSemnare}


PĂRȚILE CONTRACTANTE

Între:

1. ${data.prestatorNumeFirma}, cu sediul în ${data.prestatorSediu}, înregistrată la Registrul Comerțului sub nr. ${data.prestatorRegCom}, Cod Unic de Înregistrare ${data.prestatorCUI}, reprezentată legal prin ${data.prestatorReprezentant}, în calitate de ${data.prestatorFunctie}, denumită în continuare PRESTATOR,

și

2. ${data.beneficiarNumeFirma}, cu sediul în ${data.beneficiarSediu}, înregistrată la Registrul Comerțului sub nr. ${data.beneficiarRegCom}, Cod Unic de Înregistrare ${data.beneficiarCUI}, reprezentată legal prin ${data.beneficiarReprezentant}, în calitate de ${data.beneficiarFunctie}, denumită în continuare BENEFICIAR,


OBIECTUL CONTRACTULUI

Art. 1. PRESTATORUL se obligă să presteze servicii de protecție a muncii pentru BENEFICIAR, în conformitate cu prevederile Legii nr. 319/2006 privind securitatea și sănătatea în muncă și a normelor subsecvente.

Art. 2. Activitatea se desfășoară pentru un număr de ${data.numarAngajati} angajați ai BENEFICIARULUI, în următoarele puncte de lucru:
${data.puncteLucru.map(punct => `   - ${punct}`).join('\n')}

Art. 3. Domeniul de activitate al BENEFICIARULUI: ${data.domeniuActivitate}.


OBLIGAȚIILE PRESTATORULUI

Art. 4. PRESTATORUL se obligă să:

4.1. Elaboreze și să actualizeze documentele obligatorii în domeniul securității și sănătății în muncă:
   - Planul de prevenire și protecție
   - Instrucțiunile proprii de securitate și sănătate în muncă
   - Planul de intervenție în situații de urgență
   - Fișele de aptitudini pentru fiecare post de lucru

4.2. Asigure instruirea angajaților BENEFICIARULUI în domeniul securității și sănătății în muncă:
   - Instruire generală pentru angajații nou-încadrați
   - Instruire periodică conform legislației în vigoare
   - Instruire la locul de muncă
   - Completarea fișelor de instructaj și ținerea evidenței

4.3. Efectueze identificarea și evaluarea riscurilor pentru toate locurile de muncă și funcțiile existente la BENEFICIAR.

4.4. Consilieze angajatorul privind:
   - Planificarea activităților de prevenire
   - Îmbunătățirea continuă a condițiilor de muncă
   - Respectarea legislației în domeniu

4.5. Verifice aplicarea legislației în domeniul securității și sănătății în muncă la nivelul unității BENEFICIARULUI.

4.6. Participe la controlul modului de aplicare a normelor de securitate și sănătate în muncă în colaborare cu persoanele desemnate din cadrul BENEFICIARULUI.

4.7. Propună măsuri tehnice, organizatorice și sanitare de protecție și de prevenire a accidentelor de muncă și bolilor profesionale.

4.8. Verifice și contrasemneze instrucțiunile de lucru din punct de vedere al securității muncii.

4.9. Analizeze cauzele producerii accidentelor de muncă și bolilor profesionale și propună măsuri pentru evitarea producerii acestora.

4.10. Participe la întocmirea documentației pentru înregistrarea și raportarea accidentelor de muncă conform legislației în vigoare.

4.11. Efectueze verificări periodice ale echipamentelor de protecție individuală și colectivă.

4.12. Verifice existența și valabilitatea autorizațiilor, avizelor și a altor documente cerute de legislația în vigoare.

4.13. Asigure consultanță pentru întocmirea rapoartelor și statisticilor cerute de legislația în vigoare.

4.14. Răspundă solicitărilor BENEFICIARULUI în termen de maximum 48 de ore de la sesizare.

4.15. Păstreze confidențialitatea asupra tuturor informațiilor obținute în urma derulării prezentului contract.


OBLIGAȚIILE BENEFICIARULUI

Art. 5. BENEFICIARUL se obligă să:

5.1. Asigure accesul PRESTATORULUI în toate punctele de lucru și la toate documentele necesare pentru îndeplinirea obligațiilor contractuale.

5.2. Desemneze o persoană responsabilă pentru coordonarea activității de securitate și sănătate în muncă din cadrul unității.

5.3. Pună la dispoziția PRESTATORULUI toate informațiile necesare privind:
   - Structura organizatorică
   - Numărul și fluctuația angajaților
   - Procesele tehnologice
   - Echipamentele și substanțele utilizate

5.4. Anunțe PRESTATORUL despre orice modificare în structura organizatorică, procesele tehnologice sau schimbări legislative relevante.

5.5. Asigure participarea angajaților la instruirile programate de PRESTATOR.

5.6. Implementeze măsurile de prevenire și protecție propuse de PRESTATOR.

5.7. Achiziționeze echipamentele de protecție individuală și colectivă recomandate de PRESTATOR.

5.8. Informeze PRESTATORUL despre orice accident de muncă sau incident periculos în termen de 24 ore de la producere.

5.9. Achite la termen contravaloarea serviciilor conform prezentului contract.

5.10. Respecte confidențialitatea asupra datelor și informațiilor personale ale PRESTATORULUI.


DURATA CONTRACTULUI

Art. 6. Prezentul contract se încheie pe o perioadă determinată de la data de ${data.dataInceput} până la data de ${data.dataFinal}.

Art. 7. Contractul se prelungește automat cu perioade succesive de 12 luni, dacă niciuna dintre părți nu notifică intenția de neprelungire cu minimum 30 de zile înainte de expirare.


PREȚUL ȘI PLATA

Art. 8. Pentru serviciile prestate, BENEFICIARUL se obligă să plătească PRESTATORULUI suma de ${data.valoareMensualaCuTVA.toFixed(2)} lei lunar, din care:
   - Valoare fără TVA: ${data.valoareMensualeFaraTVA.toFixed(2)} lei
   - TVA ${data.TVA}%: ${(data.valoareMensualaCuTVA - data.valoareMensualeFaraTVA).toFixed(2)} lei

Art. 9. Plata se va efectua lunar, în baza facturii fiscale emise de PRESTATOR, în termen de ${data.termenPlata} zile de la data emiterii facturii.

Art. 10. Plățile se vor efectua prin transfer bancar în contul PRESTATORULUI:
   IBAN: ${data.contBancar}
   Banca: ${data.banca}

Art. 11. În cazul întârzierii plății, BENEFICIARUL datorează penalități de întârziere conform legislației în vigoare.


CONFIDENȚIALITATE

Art. 12. Ambele părți se obligă să păstreze confidențialitatea asupra tuturor informațiilor obținute în cadrul derulării prezentului contract.

Art. 13. Obligația de confidențialitate rămâne în vigoare și după încetarea contractului, pentru o perioadă de 5 ani.

Art. 14. Sunt exceptate de la obligația de confidențialitate informațiile:
   - Care devin publice fără încălcarea prezentului contract
   - Care trebuie comunicate autorităților în baza legii
   - Care sunt solicitate de instanțele judecătorești


REZILIEREA CONTRACTULUI

Art. 15. Prezentul contract poate înceta:
   a) La expirarea perioadei pentru care a fost încheiat
   b) Prin acordul de voință al părților
   c) Prin denunțare unilaterală cu un preaviz de 30 zile
   d) În caz de forță majoră

Art. 16. Rezilierea contractului din culpa uneia dintre părți dă dreptul părții nevinovate la despăgubiri.

Art. 17. Partea care invocă forța majoră este obligată să notifice celeilalte părți, în termen de 5 zile de la apariția evenimentului, și să prezinte documentele doveditoare.


SOLUȚIONAREA LITIGIILOR

Art. 18. Litigiile apărute în legătură cu prezentul contract se vor rezolva pe cale amiabilă.

Art. 19. În cazul în care nu se poate ajunge la o înțelegere amiabilă, litigiile vor fi soluționate de instanțele judecătorești competente.


DISPOZIȚII FINALE

Art. 20. Prezentul contract constituie acordul integral între părți și înlocuiește orice înțelegeri anterioare verbale sau scrise.

Art. 21. Orice modificare a prezentului contract se va face prin act adițional semnat de ambele părți.

Art. 22. Prezentul contract a fost încheiat astăzi, ${data.dataSemnare}, în ${data.locSemnare}, în 2 exemplare originale, câte unul pentru fiecare parte.


PRESTATOR                                           BENEFICIAR

${data.prestatorNumeFirma}                          ${data.beneficiarNumeFirma}
${data.prestatorReprezentant}                       ${data.beneficiarReprezentant}
${data.prestatorFunctie}                            ${data.beneficiarFunctie}


Semnătură și ștampilă                               Semnătură și ștampilă
_____________________                               _____________________
`;
  },

  /**
   * Secțiuni obligatorii ale contractului
   */
  sections: {
    partiContractante: 'Părțile Contractante',
    obiectContract: 'Obiectul Contractului',
    obligatiiPrestator: 'Obligațiile Prestatorului',
    obligatiiBeneficiar: 'Obligațiile Beneficiarului',
    durataContract: 'Durata Contractului',
    pretPlata: 'Prețul și Plata',
    confidentialitate: 'Confidențialitate',
    reziliere: 'Rezilierea Contractului',
    litigii: 'Soluționarea Litigiilor',
    dispozitiiFinale: 'Dispoziții Finale',
  },

  /**
   * Validare date contract
   */
  validateContractData: (data: Partial<ContractSSMData>): string[] => {
    const errors: string[] = [];

    // Validare prestator
    if (!data.prestatorNumeFirma) errors.push('Nume firmă prestator lipsă');
    if (!data.prestatorCUI) errors.push('CUI prestator lipsă');
    if (!data.prestatorRegCom) errors.push('Nr. Reg. Com. prestator lipsă');
    if (!data.prestatorSediu) errors.push('Sediu prestator lipsă');
    if (!data.prestatorReprezentant) errors.push('Reprezentant prestator lipsă');
    if (!data.prestatorFunctie) errors.push('Funcție reprezentant prestator lipsă');

    // Validare beneficiar
    if (!data.beneficiarNumeFirma) errors.push('Nume firmă beneficiar lipsă');
    if (!data.beneficiarCUI) errors.push('CUI beneficiar lipsă');
    if (!data.beneficiarRegCom) errors.push('Nr. Reg. Com. beneficiar lipsă');
    if (!data.beneficiarSediu) errors.push('Sediu beneficiar lipsă');
    if (!data.beneficiarReprezentant) errors.push('Reprezentant beneficiar lipsă');
    if (!data.beneficiarFunctie) errors.push('Funcție reprezentant beneficiar lipsă');

    // Validare detalii contract
    if (!data.numarAngajati || data.numarAngajati < 1) {
      errors.push('Număr angajați invalid');
    }
    if (!data.puncteLucru || data.puncteLucru.length === 0) {
      errors.push('Puncte de lucru lipsă');
    }
    if (!data.domeniuActivitate) errors.push('Domeniu activitate lipsă');

    // Validare durată
    if (!data.dataInceput) errors.push('Data început contract lipsă');
    if (!data.dataFinal) errors.push('Data final contract lipsă');

    // Validare preț
    if (!data.valoareMensualaCuTVA || data.valoareMensualaCuTVA <= 0) {
      errors.push('Valoare contract invalidă');
    }
    if (!data.valoareMensualeFaraTVA || data.valoareMensualeFaraTVA <= 0) {
      errors.push('Valoare fără TVA invalidă');
    }
    if (!data.TVA || data.TVA < 0) errors.push('TVA invalid');
    if (!data.termenPlata || data.termenPlata < 1) {
      errors.push('Termen plată invalid');
    }
    if (!data.contBancar) errors.push('Cont bancar lipsă');
    if (!data.banca) errors.push('Nume bancă lipsă');

    // Validare semnătură
    if (!data.dataSemnare) errors.push('Data semnare lipsă');
    if (!data.locSemnare) errors.push('Loc semnare lipsă');

    return errors;
  },

  /**
   * Date exemplu pentru testare
   */
  exampleData: (): ContractSSMData => ({
    prestatorNumeFirma: 'SSM CONSULT SRL',
    prestatorCUI: 'RO12345678',
    prestatorRegCom: 'J40/1234/2020',
    prestatorSediu: 'București, Str. Exemplu nr. 1',
    prestatorReprezentant: 'Ion Popescu',
    prestatorFunctie: 'Administrator',

    beneficiarNumeFirma: 'FIRMA EXEMPLU SRL',
    beneficiarCUI: 'RO87654321',
    beneficiarRegCom: 'J40/5678/2015',
    beneficiarSediu: 'București, Str. Model nr. 10',
    beneficiarReprezentant: 'Maria Ionescu',
    beneficiarFunctie: 'Director General',

    numarAngajati: 25,
    puncteLucru: ['Sediu principal - București', 'Depozit - Ploiești'],
    domeniuActivitate: 'Comerț cu amănuntul',

    dataInceput: '01.03.2026',
    dataFinal: '28.02.2027',

    valoareMensualaCuTVA: 1190,
    valoareMensualeFaraTVA: 1000,
    TVA: 19,
    termenPlata: 15,
    contBancar: 'RO49AAAA1B31007593840000',
    banca: 'BRD - Groupe Société Générale',

    dataSemnare: '01.03.2026',
    locSemnare: 'București',
  }),
};
