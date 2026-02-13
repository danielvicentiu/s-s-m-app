/**
 * Leave types for Romania
 * Legal basis references Romanian Labour Code (Codul Muncii)
 */

export interface LeaveType {
  id: string;
  name: string;
  daysDefault: number;
  paid: boolean;
  legalBasis: string;
  requiredDocuments: string[];
}

export const LEAVE_TYPES: LeaveType[] = [
  {
    id: 'annual_leave',
    name: 'Concediu de odihnă',
    daysDefault: 21,
    paid: true,
    legalBasis: 'Art. 145, Codul Muncii - minimum 21 zile lucrătoare/an',
    requiredDocuments: [
      'Cerere concediu de odihnă',
      'Programare aprobată de angajator'
    ]
  },
  {
    id: 'medical_leave',
    name: 'Concediu medical',
    daysDefault: 0,
    paid: true,
    legalBasis: 'Art. 171, Codul Muncii - indemnizație CNAS (75-100% din salariu)',
    requiredDocuments: [
      'Certificat medical',
      'Concediu medical electronic (emis de medic)'
    ]
  },
  {
    id: 'maternity_leave',
    name: 'Concediu de maternitate',
    daysDefault: 126,
    paid: true,
    legalBasis: 'Legea 346/2002 - 126 zile (63 zile înainte, 63 zile după naștere)',
    requiredDocuments: [
      'Certificat medical prenatal',
      'Certificat de naștere (după naștere)',
      'Cerere indemnizație maternitate'
    ]
  },
  {
    id: 'paternity_leave',
    name: 'Concediu de paternitate',
    daysDefault: 15,
    paid: true,
    legalBasis: 'Legea 210/1999 - 15 zile lucrătoare în primele 8 săptămâni de la naștere',
    requiredDocuments: [
      'Certificat de naștere',
      'Cerere concediu paternitate',
      'Declarație pe propria răspundere'
    ]
  },
  {
    id: 'professional_training',
    name: 'Concediu pentru formare profesională',
    daysDefault: 10,
    paid: false,
    legalBasis: 'Art. 155, Codul Muncii - minimum 10 zile lucrătoare la 2 ani',
    requiredDocuments: [
      'Cerere concediu formare',
      'Confirmare inscriere curs/program',
      'Plan formare profesională'
    ]
  },
  {
    id: 'family_event',
    name: 'Concediu pentru evenimente familiale',
    daysDefault: 3,
    paid: true,
    legalBasis: 'Art. 157, Codul Muncii - căsătorie (5 zile), deces (3 zile), naștere copil (5 zile)',
    requiredDocuments: [
      'Certificat căsătorie / Certificat deces / Certificat naștere',
      'Cerere concediu evenimente familiale'
    ]
  },
  {
    id: 'unpaid_leave',
    name: 'Concediu fără plată',
    daysDefault: 0,
    paid: false,
    legalBasis: 'Art. 151, Codul Muncii - la solicitarea salariatului, cu acordul angajatorului',
    requiredDocuments: [
      'Cerere concediu fără plată',
      'Aprobare angajator',
      'Act adițional la contract (dacă depășește 30 zile)'
    ]
  }
];

/**
 * Get leave type by ID
 */
export function getLeaveTypeById(id: string): LeaveType | undefined {
  return LEAVE_TYPES.find(type => type.id === id);
}

/**
 * Get all paid leave types
 */
export function getPaidLeaveTypes(): LeaveType[] {
  return LEAVE_TYPES.filter(type => type.paid);
}

/**
 * Get all unpaid leave types
 */
export function getUnpaidLeaveTypes(): LeaveType[] {
  return LEAVE_TYPES.filter(type => !type.paid);
}
