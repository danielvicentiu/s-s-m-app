/**
 * Amenzi ISU (Inspecția de Stat pentru Situații de Urgență)
 * Baza legală: OG 60/1997, Legea 307/2006 privind apărarea împotriva incendiilor
 * Valori actualizate conform legislației în vigoare
 */

export interface AmenziISU {
  id: string;
  violation: string;
  legalBasis: string;
  minFine: number; // RON
  maxFine: number; // RON
  applicableTo: 'PF' | 'PJ' | 'PF/PJ'; // Persoană Fizică / Persoană Juridică
  commonInspectionFindings: string[];
}

export const amenziISU: AmenziISU[] = [
  {
    id: 'isu-001',
    violation: 'Lipsa autorizației de securitate la incendiu pentru construcții',
    legalBasis: 'Legea 307/2006, art. 17',
    minFine: 10000,
    maxFine: 30000,
    applicableTo: 'PJ',
    commonInspectionFindings: [
      'Clădire fără autorizație ISU valabilă',
      'Schimbare destinație fără reautorizare',
      'Extindere construcție fără aviz ISU'
    ]
  },
  {
    id: 'isu-002',
    violation: 'Nerespectarea măsurilor stabilite prin autorizația de securitate la incendiu',
    legalBasis: 'Legea 307/2006, art. 18',
    minFine: 5000,
    maxFine: 20000,
    applicableTo: 'PJ',
    common InspectionFindings: [
      'Modificări aduse clădirii fără actualizare autorizație',
      'Neîndeplinirea condițiilor din aviz ISU',
      'Depășirea capacității autorizate'
    ]
  },
  {
    id: 'isu-003',
    violation: 'Lipsa mijloacelor tehnice de apărare împotriva incendiilor',
    legalBasis: 'OG 60/1997, art. 3',
    minFine: 3000,
    maxFine: 15000,
    applicableTo: 'PJ',
    commonInspectionFindings: [
      'Lipsa stingătoarelor în numărul necesar',
      'Stingătoare expirate sau defecte',
      'Hidranți interiori lipsă sau nefuncționali'
    ]
  },
  {
    id: 'isu-004',
    violation: 'Sisteme de detecție și alarmare la incendiu defecte sau inexistente',
    legalBasis: 'Legea 307/2006, art. 19',
    minFine: 5000,
    maxFine: 25000,
    applicableTo: 'PJ',
    commonInspectionFindings: [
      'Centrală incendiu defectă',
      'Detectori de fum lipsă sau nefuncționali',
      'Butoane de alarmă neoperaționale'
    ]
  },
  {
    id: 'isu-005',
    violation: 'Sisteme de stingere automată defecte sau nemontate conform proiectului',
    legalBasis: 'Legea 307/2006, art. 19',
    minFine: 10000,
    maxFine: 40000,
    applicableTo: 'PJ',
    commonInspectionFindings: [
      'Sprinklere blocate sau defecte',
      'Sistem de stingere cu gaz nereîncarcat',
      'Pompă de incendiu nefuncțională'
    ]
  },
  {
    id: 'isu-006',
    violation: 'Căi de evacuare blocate, obstrucționate sau insuficiente',
    legalBasis: 'OG 60/1997, art. 5',
    minFine: 4000,
    maxFine: 18000,
    applicableTo: 'PJ',
    commonInspectionFindings: [
      'Depozitare materiale pe căile de evacuare',
      'Uși evacuare blocate cu lacăt',
      'Lățime insuficientă a coridoarelor'
    ]
  },
  {
    id: 'isu-007',
    violation: 'Lipsa sau iluminatul de siguranță defect',
    legalBasis: 'Legea 307/2006, art. 20',
    minFine: 2000,
    maxFine: 10000,
    applicableTo: 'PJ',
    commonInspectionFindings: [
      'Iluminat evacuare nefuncțional',
      'Baterii de urgență descărcate',
      'Pictograme EXIT arse sau lipsă'
    ]
  },
  {
    id: 'isu-008',
    violation: 'Depozitare necorespunzătoare de substanțe combustibile/inflamabile',
    legalBasis: 'OG 60/1997, art. 6',
    minFine: 5000,
    maxFine: 25000,
    applicableTo: 'PJ',
    commonInspectionFindings: [
      'Substanțe inflamabile în spații neautorizate',
      'Depozitare neconformă cu fișele tehnice',
      'Lipsa ventilației adecvate'
    ]
  },
  {
    id: 'isu-009',
    violation: 'Lipsa instructajului de securitate la incendiu pentru angajați',
    legalBasis: 'Legea 307/2006, art. 22',
    minFine: 3000,
    maxFine: 12000,
    applicableTo: 'PJ',
    commonInspectionFindings: [
      'Fișe de instructaj necompletate',
      'Angajați neinstruiți la angajare',
      'Lipsa documentelor de instructaj periodic'
    ]
  },
  {
    id: 'isu-010',
    violation: 'Lipsa planurilor de evacuare și a schemelor de amplasare a mijloacelor PSI',
    legalBasis: 'OG 60/1997, art. 4',
    minFine: 2000,
    maxFine: 8000,
    applicableTo: 'PJ',
    commonInspectionFindings: [
      'Planuri evacuare lipsă sau neactualizate',
      'Scheme PSI neafișate',
      'Planuri ilizibile sau deteriorate'
    ]
  },
  {
    id: 'isu-011',
    violation: 'Neefectuarea verificărilor periodice ale instalațiilor electrice',
    legalBasis: 'Legea 307/2006, art. 21',
    minFine: 4000,
    maxFine: 16000,
    applicableTo: 'PJ',
    commonInspectionFindings: [
      'Lipsa rapoartelor de verificare electrică',
      'Instalații improvizate sau neconforme',
      'Prize și cablaje deteriorate'
    ]
  },
  {
    id: 'isu-012',
    violation: 'Lipsa personalului instruit pentru acordarea primului ajutor și evacuare',
    legalBasis: 'Legea 307/2006, art. 23',
    minFine: 2500,
    maxFine: 10000,
    applicableTo: 'PJ',
    commonInspectionFindings: [
      'Niciun angajat cu atribuții PSI desemnat',
      'Lipsa echipei de evacuare',
      'Personal PSI fără pregătire periodică'
    ]
  },
  {
    id: 'isu-013',
    violation: 'Nerespectarea distanțelor de siguranță la depozitarea materialelor',
    legalBasis: 'OG 60/1997, art. 7',
    minFine: 3000,
    maxFine: 14000,
    applicableTo: 'PJ',
    commonInspectionFindings: [
      'Depozitare prea aproape de surse de căldură',
      'Stive materiale prea înalte',
      'Acces blocat la hidranți'
    ]
  },
  {
    id: 'isu-014',
    violation: 'Fumatul în zone interzise sau lipsa indicatoarelor',
    legalBasis: 'OG 60/1997, art. 8',
    minFine: 500,
    maxFine: 2500,
    applicableTo: 'PF',
    commonInspectionFindings: [
      'Angajați fumând în zone interzise',
      'Lipsa indicatoarelor "Fumatul interzis"',
      'Cenușiere improvizate'
    ]
  },
  {
    id: 'isu-015',
    violation: 'Modificarea sau dezactivarea sistemelor de securitate la incendiu',
    legalBasis: 'Legea 307/2006, art. 24',
    minFine: 8000,
    maxFine: 35000,
    applicableTo: 'PJ',
    commonInspectionFindings: [
      'Detectori dezactivați intenționat',
      'Barierat uși antifoc',
      'Închis robinetul de hidrant'
    ]
  },
  {
    id: 'isu-016',
    violation: 'Lipsa sau registrului de evidență a verificărilor PSI',
    legalBasis: 'Legea 307/2006, art. 25',
    minFine: 2000,
    maxFine: 9000,
    applicableTo: 'PJ',
    commonInspectionFindings: [
      'Registru PSI neținut',
      'Verificări neînregistrate',
      'Rapoarte de service lipsă pentru echipamente PSI'
    ]
  },
  {
    id: 'isu-017',
    violation: 'Uși și ferestre antifoc defecte sau lipsa acestora',
    legalBasis: 'Legea 307/2006, art. 19',
    minFine: 6000,
    maxFine: 28000,
    applicableTo: 'PJ',
    commonInspectionFindings: [
      'Uși antifoc blocate în poziție deschisă',
      'Sistemul de autoînchidere defect',
      'Garnituri antifoc deteriorate'
    ]
  },
  {
    id: 'isu-018',
    violation: 'Desfășurarea de activități cu foc deschis fără permis',
    legalBasis: 'OG 60/1997, art. 9',
    minFine: 3500,
    maxFine: 15000,
    applicableTo: 'PJ',
    commonInspectionFindings: [
      'Sudură fără permis de lucru cu foc',
      'Lipsa supravegherii la lucrări cu flacără',
      'Absența stingătoarelor la locul de lucru'
    ]
  },
  {
    id: 'isu-019',
    violation: 'Lipsa hidranților exteriori sau accesul blocat la aceștia',
    legalBasis: 'Legea 307/2006, art. 26',
    minFine: 4000,
    maxFine: 18000,
    applicableTo: 'PJ',
    commonInspectionFindings: [
      'Hidranți exteriori îngropați sau inaccesibili',
      'Marcaj hidranți lipsă',
      'Hidranți îngheța ți sau nefuncționali'
    ]
  },
  {
    id: 'isu-020',
    violation: 'Nerespectarea capacității maxime de persoane în spații publice',
    legalBasis: 'Legea 307/2006, art. 27',
    minFine: 5000,
    maxFine: 22000,
    applicableTo: 'PJ',
    commonInspectionFindings: [
      'Depășirea capacității autorizate',
      'Lipsa afișării capacității maxime',
      'Vânzare bilete peste capacitate'
    ]
  },
  {
    id: 'isu-021',
    violation: 'Lipsa scenariului de securitate la incendiu',
    legalBasis: 'Legea 307/2006, art. 28',
    minFine: 3000,
    maxFine: 13000,
    applicableTo: 'PJ',
    commonInspectionFindings: [
      'Scenariu PSI neelaborat',
      'Scenariu neactualizat cu modificările clădirii',
      'Scenariul neprezentaț autorităților'
    ]
  },
  {
    id: 'isu-022',
    violation: 'Ventilație mecanică defectă în spații cu risc de incendiu',
    legalBasis: 'Legea 307/2006, art. 19',
    minFine: 4500,
    maxFine: 19000,
    applicableTo: 'PJ',
    commonInspectionFindings: [
      'Sistem de ventilație nefuncțional',
      'Filtre neînlocuite',
      'Evacuare fum/gaze defectă'
    ]
  },
  {
    id: 'isu-023',
    violation: 'Organizarea de evenimente fără aviz ISU',
    legalBasis: 'Legea 307/2006, art. 29',
    minFine: 6000,
    maxFine: 25000,
    applicableTo: 'PJ',
    commonInspectionFindings: [
      'Evenimente cu peste 300 persoane fără aviz',
      'Concerte/spectacole fără aprobare ISU',
      'Standuri temporare neavizate'
    ]
  },
  {
    id: 'isu-024',
    violation: 'Împiedicarea accesului echipajelor de intervenție',
    legalBasis: 'OG 60/1997, art. 11',
    minFine: 7000,
    maxFine: 30000,
    applicableTo: 'PJ',
    commonInspectionFindings: [
      'Drumuri de acces blocate',
      'Porți încuiate fără acces alternativ',
      'Platforme pentru autospeciale ocupate'
    ]
  },
  {
    id: 'isu-025',
    violation: 'Neconformitatea instalațiilor de încălzire și ventilație',
    legalBasis: 'Legea 307/2006, art. 30',
    minFine: 4000,
    maxFine: 17000,
    applicableTo: 'PJ',
    commonInspectionFindings: [
      'Coșuri de fum nerevizuite',
      'Sobe improvizate neconforme',
      'Instalații termice fără verificări periodice'
    ]
  }
];

/**
 * Funcții helper pentru lucrul cu amenzile ISU
 */

export function getAmenziByApplicability(type: 'PF' | 'PJ'): AmenziISU[] {
  return amenziISU.filter(
    (amenda) => amenda.applicableTo === type || amenda.applicableTo === 'PF/PJ'
  );
}

export function getAmendaById(id: string): AmenziISU | undefined {
  return amenziISU.find((amenda) => amenda.id === id);
}

export function searchAmenzi(query: string): AmenziISU[] {
  const lowerQuery = query.toLowerCase();
  return amenziISU.filter(
    (amenda) =>
      amenda.violation.toLowerCase().includes(lowerQuery) ||
      amenda.commonInspectionFindings.some((finding) =>
        finding.toLowerCase().includes(lowerQuery)
      )
  );
}

export function getTotalFineRange(): { min: number; max: number } {
  const totalMin = amenziISU.reduce((sum, amenda) => sum + amenda.minFine, 0);
  const totalMax = amenziISU.reduce((sum, amenda) => sum + amenda.maxFine, 0);
  return { min: totalMin, max: totalMax };
}
