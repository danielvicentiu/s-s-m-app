/**
 * Legislație SSM/PSI Ungaria
 * Hungarian Occupational Health & Safety Legislative Acts
 */

export interface LegislativeActHU {
  id: string;
  title: string;
  titleHU: string;
  number: string;
  year: number;
  domain: 'SSM' | 'PSI' | 'SSM_PSI';
  description: string;
}

export const legislatieHU: LegislativeActHU[] = [
  {
    id: 'hu-1',
    title: 'Act on Occupational Safety and Health',
    titleHU: 'A munkavédelemről szóló törvény',
    number: '1993. évi XCIII.',
    year: 1993,
    domain: 'SSM',
    description: 'Legea cadru privind securitatea și sănătatea în muncă în Ungaria. Stabilește obligațiile angajatorilor și drepturile lucrătorilor în domeniul protecției muncii.'
  },
  {
    id: 'hu-2',
    title: 'Government Decree on the detailed occupational safety and health requirements',
    titleHU: 'A munkahelyek munkavédelmi követelményeinek minimális szintjéről szóló kormányrendelet',
    number: '3/2002. (II. 8.) SzCsM-EüM',
    year: 2002,
    domain: 'SSM',
    description: 'Cerințe minime de securitate și sănătate pentru locurile de muncă. Definește standardele tehnice și organizatorice obligatorii.'
  },
  {
    id: 'hu-3',
    title: 'Decree on the use of personal protective equipment at work',
    titleHU: 'Az egyéni védőeszközök követelményeiről és megfelelőségének tanúsításáról szóló rendelet',
    number: '59/1999. (XII. 15.) EüM',
    year: 1999,
    domain: 'SSM',
    description: 'Reglementări privind echipamentele individuale de protecție (EIP). Stabilește cerințele pentru selecția, utilizarea și întreținerea EIP-urilor.'
  },
  {
    id: 'hu-4',
    title: 'Act on Fire Protection',
    titleHU: 'A tűz elleni védekezésről, a műszaki mentésről és a tűzoltóságról szóló törvény',
    number: '1996. évi XXXI.',
    year: 1996,
    domain: 'PSI',
    description: 'Legea cadru privind protecția împotriva incendiilor. Reglementează prevenirea, intervenția și organizarea serviciilor de pompieri.'
  },
  {
    id: 'hu-5',
    title: 'Government Decree on Occupational Health Services',
    titleHU: 'A munkavédelmi szakértői, a munkavédelmi megbízotti képzés követelményeiről szóló rendelet',
    number: '5/1993. (XII. 26.) MüM',
    year: 1993,
    domain: 'SSM',
    description: 'Cerințe privind serviciile de medicină a muncii și experții SSM. Definește calificările și responsabilitățile specialiștilor în protecția muncii.'
  },
  {
    id: 'hu-6',
    title: 'Decree on manual handling of loads',
    titleHU: 'A kézi tehermozgatás minimális munkavédelmi követelményeiről szóló rendelet',
    number: '48/2006. (XII. 29.) EüM',
    year: 2006,
    domain: 'SSM',
    description: 'Cerințe minime de securitate pentru manipularea manuală a sarcinilor. Limitări de greutate și măsuri de prevenire a accidentelor.'
  },
  {
    id: 'hu-7',
    title: 'Government Decree on work equipment safety requirements',
    titleHU: 'A munkaeszközök biztonsági követelményeinek minimális szintjéről szóló rendelet',
    number: '14/2004. (IV. 19.) FMM',
    year: 2004,
    domain: 'SSM',
    description: 'Cerințe minime de securitate pentru echipamentele de lucru. Reglementează utilizarea în siguranță a mașinilor și instalațiilor.'
  },
  {
    id: 'hu-8',
    title: 'Decree on chemical safety at workplace',
    titleHU: 'A veszélyes anyagokkal és a veszélyes készítményekkel kapcsolatos egyes eljárások, illetve tevékenységek részletes szabályairól szóló rendelet',
    number: '25/2000. (IX. 30.) EüM-SzCsM',
    year: 2000,
    domain: 'SSM',
    description: 'Norme de securitate pentru lucrul cu substanțe chimice periculoase. Include cerințe pentru depozitare, manipulare și protecție.'
  },
  {
    id: 'hu-9',
    title: 'Government Decree on fire safety technical requirements',
    titleHU: 'Az Országos Tűzvédelmi Szabályzatról szóló kormányrendelet',
    number: '54/2014. (XII. 5.) BM',
    year: 2014,
    domain: 'PSI',
    description: 'Regulament național de securitate la incendiu. Stabilește cerințele tehnice pentru prevenirea și combaterea incendiilor în clădiri.'
  },
  {
    id: 'hu-10',
    title: 'Decree on occupational safety training',
    titleHU: 'A munkavédelmi képzés részletes szabályairól szóló rendelet',
    number: '10/2001. (VIII. 3.) SzCsM',
    year: 2001,
    domain: 'SSM',
    description: 'Reglementări detaliate privind instruirea SSM. Definește tipurile de instruire obligatorie, periodicitatea și conținutul programelor de formare.'
  }
];
