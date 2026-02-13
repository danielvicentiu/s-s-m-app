/**
 * Template decizie numire lucrători desemnați SSM
 * Bază legală: Legea 319/2006 art. 20 - privind securitatea și sănătatea în muncă
 */

export interface LucratorDesemnat {
  nume: string;
  prenume: string;
  functie: string;
  cnp?: string;
}

export interface DecizieLD {
  numarDecizie: string;
  dataDecizie: string;
  organizationName: string;
  cui: string;
  adresa: string;
  angajator: {
    nume: string;
    functie: string;
  };
  lucratori: LucratorDesemnat[];
  dataInceput: string;
}

export const ATRIBUTII_LUCRATORI_DESEMNATI = [
  'Verifică locurile de muncă și se asigură că acestea sunt sigure și fără riscuri pentru sănătate, în conformitate cu prevederile Legii nr. 319/2006 și ale normelor specifice de securitate și sănătate în muncă aplicabile activității desfășurate',
  'Supravegheză aplicarea de către toți lucrătorii a măsurilor de prevenire și protecție stabilite prin planul de prevenire și protecție',
  'Verifică modul în care lucrătorii respectă obligațiile ce le revin, potrivit legii și dispozițiilor angajatorului, privind securitatea și sănătatea în muncă',
  'Verifică și se asigură că utilajele, instalațiile, echipamentele tehnice și sculele sunt menținute în stare de funcționare normală',
  'Verifică și se asigură că echipamentele individuale de protecție sunt utilizate corespunzător de către lucrători',
  'Consemnează în scris și raportează angajatorului deficiențele constatate în ceea ce privește securitatea și sănătatea în muncă, precum și orice alte aspecte care pot afecta securitatea și sănătatea lucrătorilor',
  'Propune angajatorului măsuri de îmbunătățire a condițiilor de muncă și de prevenire a accidentelor de muncă și bolilor profesionale',
  'Participă la instruirea lucrătorilor în domeniul securității și sănătății în muncă',
  'Verifică existența și conținutul documentelor și înregistrărilor privind securitatea și sănătatea în muncă',
  'Participă la cercetarea evenimentelor conform procedurilor legale',
  'Informează imediat angajatorul despre orice deficiență sau pericol identificat în procesul de muncă',
  'Își însuși și să aprofundeze cunoștințele în domeniul securității și sănătății în muncă prin participarea la cursuri de formare/perfecționare organizate de angajator sau de structuri specializate'
];

export const RESPONSABILITATI_LUCRATORI_DESEMNATI = [
  'Pentru neîndeplinirea sau îndeplinirea necorespunzătoare a atribuțiilor prevăzute în prezenta decizie, lucrătorul desemnat răspunde disciplinar, contravențional, civil sau penal, după caz',
  'Lucrătorul desemnat are dreptul de a refuza executarea sarcinilor de serviciu dacă acestea prezintă un pericol grav și imediat pentru viața și sănătatea sa, fără a fi sancționat disciplinar',
  'Lucrătorul desemnat beneficiază de protecție împotriva concedierii sau a altor măsuri discriminatorii ca urmare a exercitării atribuțiilor stabilite prin prezenta decizie'
];

export function generateDecizieLD(data: DecizieLD): string {
  const lucratoriList = data.lucratori
    .map((l, idx) => `${idx + 1}. ${l.nume} ${l.prenume} - ${l.functie}${l.cnp ? ` (CNP: ${l.cnp})` : ''}`)
    .join('\n');

  return `
DECIZIE Nr. ${data.numarDecizie}
din data de ${data.dataDecizie}

privind numirea lucrătorilor desemnați
pentru activitatea de securitate și sănătate în muncă

Având în vedere:
- Prevederile Legii nr. 319/2006 privind securitatea și sănătatea în muncă, cu modificările și completările ulterioare, în special art. 20;
- Hotărârea Guvernului nr. 1425/2006 pentru aprobarea Normelor metodologice de aplicare a prevederilor Legii nr. 319/2006;
- Necesitatea asigurării unui climat de securitate și sănătate în muncă la nivelul societății;
- Necesitatea îndeplinirii obligațiilor legale privind supravegherea aplicării măsurilor de prevenire și protecție;

În temeiul art. 20 din Legea nr. 319/2006,

${data.angajator.functie} ${data.organizationName}

DECIDE:

Art. 1. Numirea lucrătorilor desemnați

Se numesc în calitate de lucrători desemnați pentru activitatea de securitate și sănătate în muncă, începând cu data de ${data.dataInceput}, următoarele persoane:

${lucratoriList}

Art. 2. Baza legală

Prezenta decizie este emisă în baza art. 20 din Legea nr. 319/2006 privind securitatea și sănătatea în muncă, care prevede că angajatorul poate desemna unul sau mai mulți lucrători pentru a se ocupa de activitățile de prevenire și protecție în domeniul securității și sănătății în muncă.

Art. 3. Atribuțiile lucrătorilor desemnați

Lucrătorii desemnați au următoarele atribuții:

${ATRIBUTII_LUCRATORI_DESEMNATI.map((atr, idx) => `${idx + 1}. ${atr};`).join('\n\n')}

Art. 4. Responsabilități

${RESPONSABILITATI_LUCRATORI_DESEMNATI.map((resp, idx) => `${idx + 1}. ${resp}.`).join('\n\n')}

Art. 5. Timp de lucru alocat

Lucrătorii desemnați beneficiază de timpul necesar îndeplinirii atribuțiilor prevăzute la art. 3, fără ca aceasta să conducă la diminuarea salariului sau a altor drepturi.

Art. 6. Formare profesională

Angajatorul asigură formarea adecvată a lucrătorilor desemnați în domeniul securității și sănătății în muncă, prin organizarea de cursuri de pregătire inițială și de perfecționare periodică.

Art. 7. Dispoziții finale

(1) Lucrătorii desemnați colaborează cu serviciul extern de prevenire și protecție contractat de societate.

(2) Lucrătorii desemnați raportează periodic angajatorului și serviciului extern de prevenire și protecție cu privire la activitatea desfășurată și deficiențele constatate.

(3) Prezenta decizie se comunică lucrătorilor desemnați, serviciului extern de prevenire și protecție, precum și Inspectoratului Teritorial de Muncă, dacă este cazul.

(4) Executarea prezentei decizii revine lucrătorilor desemnați numiți la art. 1, șefilor ierarhici ai acestora și serviciului de resurse umane.


${data.angajator.functie},
${data.angajator.nume}

Semnătura: _______________


Am luat la cunoștință,

${data.lucratori.map((l) => `
${l.nume} ${l.prenume}
Data: _______________
Semnătura: _______________
`).join('\n')}


---
Societatea: ${data.organizationName}
CUI: ${data.cui}
Adresa: ${data.adresa}
`.trim();
}

// Exemplu de utilizare
export const exempluDecizieLD: DecizieLD = {
  numarDecizie: '123/SSM',
  dataDecizie: '15.01.2025',
  organizationName: 'S.C. EXEMPLU S.R.L.',
  cui: 'RO12345678',
  adresa: 'Str. Exemplu nr. 1, București, Sector 1',
  angajator: {
    nume: 'Popescu Ion',
    functie: 'Director General'
  },
  lucratori: [
    {
      nume: 'Ionescu',
      prenume: 'Maria',
      functie: 'Inginer SSM',
      cnp: '2850101123456'
    },
    {
      nume: 'Georgescu',
      prenume: 'Andrei',
      functie: 'Tehnician',
      cnp: '1750202234567'
    }
  ],
  dataInceput: '01.02.2025'
};
