/**
 * Template pentru Decizie de numire Comitet de Securitate și Sănătate în Muncă (CSSM)
 * Bază legală: Legea 319/2006 privind securitatea și sănătatea în muncă, art. 18
 */

export interface CSSMMember {
  name: string;
  position: string;
  role: 'presedinte' | 'membru' | 'secretar';
}

export interface DecizieCASSMData {
  organizationName: string;
  organizationAddress: string;
  cui: string;
  decisionNumber: string;
  decisionDate: string;
  employerName: string;
  employerPosition: string;
  members: CSSMMember[];
  meetingFrequency: string; // ex: "trimestrial", "semestrial"
}

export const CSSM_ATRIBUTII = [
  'Analizează problemele de securitate și sănătate în muncă și propune măsuri de îmbunătățire a condițiilor de muncă',
  'Urmărește aplicarea în practică a măsurilor privind securitatea și sănătatea în muncă',
  'Analizează cauzele accidentelor de muncă, îmbolnăvirilor profesionale și propune măsuri de prevenire',
  'Avizează proiectele de instrucțiuni proprii pentru completarea și/sau aplicarea reglementărilor de securitate și sănătate în muncă',
  'Analizează și avizează regulamentul intern al unității din punctul de vedere al respectării reglementărilor de securitate și sănătate în muncă',
  'Verifică condițiile de acordare a echipamentului individual de protecție și de lucru, precum și a alimentației de protecție',
  'Promovează mijloacele de informare și de propagandă privind securitatea și sănătatea în muncă',
  'Efectuează controale proprii la locurile de muncă și propune măsuri de îmbunătățire a condițiilor de muncă',
  'Dezbate raportul scris privind situația securității și sănătății în muncă, prezentat cel puțin o dată pe an de către angajator',
  'Cooperează cu serviciile externe de prevenire și protecție și cu inspectorii de muncă'
];

export const BAZA_LEGALA = {
  lege: 'Legea nr. 319/2006',
  titlu: 'Legea securității și sănătății în muncă',
  articol: 'art. 18',
  descriere: 'privind constituirea și funcționarea Comitetului de securitate și sănătate în muncă'
};

export const generateDecizieCASSMTemplate = (data: DecizieCASSMData): string => {
  const presedinte = data.members.find(m => m.role === 'presedinte');
  const secretar = data.members.find(m => m.role === 'secretar');
  const membrii = data.members.filter(m => m.role === 'membru');

  return `
DECIZIE
Nr. ${data.decisionNumber} din ${data.decisionDate}

privind numirea Comitetului de Securitate și Sănătate în Muncă (CSSM)

${data.employerName}, în calitate de ${data.employerPosition} al ${data.organizationName},
cu sediul în ${data.organizationAddress}, CUI ${data.cui},

Având în vedere:
- Prevederile Legii nr. 319/2006 privind securitatea și sănătatea în muncă, cu modificările și completările ulterioare, în special art. 18;
- Necesitatea asigurării unui cadru organizatoric pentru implementarea și monitorizarea măsurilor de securitate și sănătate în muncă;
- Consultarea reprezentanților lucrătorilor;

DECID:

Art. 1. Se constituie Comitetul de Securitate și Sănătate în Muncă (CSSM) al ${data.organizationName}, cu următoarea componență:

Președinte:
${presedinte ? `- ${presedinte.name}, ${presedinte.position}` : '- [Nume și prenume], [Funcție]'}

Secretar:
${secretar ? `- ${secretar.name}, ${secretar.position}` : '- [Nume și prenume], [Funcție]'}

Membri:
${membrii.length > 0
  ? membrii.map(m => `- ${m.name}, ${m.position}`).join('\n')
  : `- [Nume și prenume membru 1], [Funcție]
- [Nume și prenume membru 2], [Funcție]
- [Nume și prenume membru 3], [Funcție]`}

Art. 2. Comitetul de Securitate și Sănătate în Muncă are următoarele atribuții principale:

${CSSM_ATRIBUTII.map((atributie, index) => `${index + 1}. ${atributie};`).join('\n')}

Art. 3. Comitetul de Securitate și Sănătate în Muncă se întrunește ${data.meetingFrequency || 'trimestrial'} sau ori de câte ori este necesar, la solicitarea membrilor săi sau a angajatorului.

Art. 4. Membrii comitetului au obligația de a participa la ședințele convocate și de a îndeplini sarcinile stabilite în cadrul acestora.

Art. 5. Prezenta decizie intră în vigoare la data semnării și se aduce la cunoștința tuturor salariaților.

Art. 6. Cu aducerea la îndeplinire a prezentei decizii se însărcinează Serviciul de Securitate și Sănătate în Muncă.


Data: ${data.decisionDate}


ANGAJATOR,
${data.employerName}
${data.employerPosition}


Semnătura: _________________


Am luat la cunoștință,

Președinte CSSM,
${presedinte?.name || '[Nume și prenume]'}
Semnătura: _________________

Secretar CSSM,
${secretar?.name || '[Nume și prenume]'}
Semnătura: _________________
`.trim();
};

export default generateDecizieCASSMTemplate;
