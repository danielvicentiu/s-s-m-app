/**
 * Obligații Protecție Împotriva Incendiilor (PSI) - Bulgaria
 *
 * Bază legală:
 * - Zakon za Ministerstvo na vatreshnite raboti (MBR) - Legea pentru Ministerul Afacerilor Interne
 * - Naredba Iz-2377/2011 - Normativ pentru protecția împotriva incendiilor
 *
 * @note Valorile penalităților sunt în EUR și pot varia în funcție de
 * categoria organizației și gravitatea încălcării
 */

export interface ObligatiePSIBG {
  id: string;
  nume: string;
  descriere: string;
  categorie: 'documentatie' | 'echipamente' | 'instruire' | 'verificari' | 'evacuare';
  frecventa: 'unica' | 'lunara' | 'trimestriala' | 'semestriala' | 'anuala';
  articolLegal: string;
  penalitate: number; // EUR
  detalii: string[];
}

export const obligatiiPSIBulgaria: ObligatiePSIBG[] = [
  {
    id: 'psi-bg-001',
    nume: 'План за евакуация (Plan de evacuare)',
    descriere: 'Elaborarea și afișarea planurilor de evacuare în caz de incendiu',
    categorie: 'documentatie',
    frecventa: 'unica',
    articolLegal: 'Naredba Iz-2377/2011, Чл. 12',
    penalitate: 500,
    detalii: [
      'Plan de evacuare pentru fiecare nivel/zonă',
      'Afișare la loc vizibil',
      'Actualizare la modificări în clădire',
      'Trasee de evacuare marcate clar'
    ]
  },
  {
    id: 'psi-bg-002',
    nume: 'Пожарогасители (Stingătoare portabile)',
    descriere: 'Dotare cu stingătoare portabile conform normativului',
    categorie: 'echipamente',
    frecventa: 'anuala',
    articolLegal: 'Naredba Iz-2377/2011, Чл. 15',
    penalitate: 300,
    detalii: [
      'Minimum 1 stingător la 200 mp',
      'Tip ABC sau conform riscurilor specifice',
      'Verificare anuală de către firma autorizată',
      'Afișare la înălțime maximă 1.5m'
    ]
  },
  {
    id: 'psi-bg-003',
    nume: 'Автоматична пожароизвестителна система (Sistem de detectie incendiu)',
    descriere: 'Instalare și mentenanță sistem automat de detectare incendiu',
    categorie: 'echipamente',
    frecventa: 'semestriala',
    articolLegal: 'Naredba Iz-2377/2011, Чл. 18',
    penalitate: 1000,
    detalii: [
      'Obligatoriu pentru clădiri >500 mp sau >10 persoane',
      'Verificare semestrială de către firma autorizată',
      'Testare funcționalitate detectori',
      'Înregistrare în jurnal de întreținere'
    ]
  },
  {
    id: 'psi-bg-004',
    nume: 'Обучение на персонала (Instruire personal)',
    descriere: 'Instruire periodică a personalului în domeniul protecției împotriva incendiilor',
    categorie: 'instruire',
    frecventa: 'anuala',
    articolLegal: 'Naredba Iz-2377/2011, Чл. 24',
    penalitate: 400,
    detalii: [
      'Instruire inițială la angajare',
      'Reinstruire anuală',
      'Tematică: prevenire, alarmare, evacuare, stingere',
      'Proces-verbal semnat de participanți'
    ]
  },
  {
    id: 'psi-bg-005',
    nume: 'Учения за евакуация (Exerciții de evacuare)',
    descriere: 'Organizarea și desfășurarea de exerciții practice de evacuare',
    categorie: 'evacuare',
    frecventa: 'anuala',
    articolLegal: 'Naredba Iz-2377/2011, Чл. 26',
    penalitate: 600,
    detalii: [
      'Minimum 1 exercițiu anual',
      'Participarea tuturor angajaților',
      'Cronometrare timp de evacuare',
      'Raport cu concluzii și măsuri'
    ]
  },
  {
    id: 'psi-bg-006',
    nume: 'Ръководител за безопасност (Responsabil securitate la incendiu)',
    descriere: 'Desemnarea unui responsabil cu protecția împotriva incendiilor',
    categorie: 'documentatie',
    frecventa: 'unica',
    articolLegal: 'Zakon za MBR, Чл. 94',
    penalitate: 350,
    detalii: [
      'Decizie scrisă de desemnare',
      'Atribuții și responsabilități clare',
      'Cursuri de specializare recomandate',
      'Actualizare la schimbarea persoanei'
    ]
  },
  {
    id: 'psi-bg-007',
    nume: 'Пожарна книга (Registru protecție incendiu)',
    descriere: 'Întocmire și actualizare registru evidență măsuri de protecție',
    categorie: 'documentatie',
    frecventa: 'lunara',
    articolLegal: 'Naredba Iz-2377/2011, Чл. 10',
    penalitate: 250,
    detalii: [
      'Evidență instruiri și exerciții',
      'Verificări echipamente',
      'Neconformități și măsuri corective',
      'Inspecții autorități'
    ]
  },
  {
    id: 'psi-bg-008',
    nume: 'Хидранти (Hidranti interiori)',
    descriere: 'Verificare funcționalitate hidranti interiori',
    categorie: 'echipamente',
    frecventa: 'trimestriala',
    articolLegal: 'Naredba Iz-2377/2011, Чл. 16',
    penalitate: 450,
    detalii: [
      'Verificare presiune apă',
      'Test funcționalitate furtun și jet',
      'Verificare stare cutie hidrant',
      'Înregistrare în fișă de verificare'
    ]
  },
  {
    id: 'psi-bg-009',
    nume: 'Аварийно осветление (Iluminat de urgență)',
    descriere: 'Sistem de iluminat funcțional pe traseele de evacuare',
    categorie: 'echipamente',
    frecventa: 'lunara',
    articolLegal: 'Naredba Iz-2377/2011, Чл. 20',
    penalitate: 300,
    detalii: [
      'Verificare lunară funcționalitate',
      'Autonomie minimum 1 oră',
      'Acoperire toate traseele de evacuare',
      'Înlocuire becuri arse în max 48h'
    ]
  },
  {
    id: 'psi-bg-010',
    nume: 'Изходи за евакуация (Ieșiri de evacuare)',
    descriere: 'Menținere ieșiri de urgență deblocate și semnalizate',
    categorie: 'evacuare',
    frecventa: 'lunara',
    articolLegal: 'Naredba Iz-2377/2011, Чл. 13',
    penalitate: 800,
    detalii: [
      'Verificare deblocare uși',
      'Trasee libere de obstacole',
      'Semnalizare fotoluminiscentă funcțională',
      'Lățime conformă cu număr persoane'
    ]
  },
  {
    id: 'psi-bg-011',
    nume: 'Системи за автоматично пожарогасене (Sistem automat de stingere)',
    descriere: 'Mentenanță sistem de stingere automată (sprinklere, gaz)',
    categorie: 'echipamente',
    frecventa: 'semestriala',
    articolLegal: 'Naredba Iz-2377/2011, Чл. 19',
    penalitate: 1500,
    detalii: [
      'Obligatoriu pentru spații cu risc ridicat',
      'Verificare tehnică semestrială',
      'Test funcționalitate sisteme',
      'Contract service cu firmă autorizată'
    ]
  },
  {
    id: 'psi-bg-012',
    nume: 'Пожарна декларация (Declarație de securitate la incendiu)',
    descriere: 'Declarație conformitate cu cerințele de protecție împotriva incendiilor',
    categorie: 'documentatie',
    frecventa: 'unica',
    articolLegal: 'Naredba Iz-2377/2011, Чл. 8',
    penalitate: 700,
    detalii: [
      'Obligatorie pentru clădiri cu destinație publică',
      'Elaborată de expert autorizat',
      'Depunere la inspectoratul local',
      'Actualizare la modificări majore'
    ]
  },
  {
    id: 'psi-bg-013',
    nume: 'Пожарна тревога (Alarmă de incendiu)',
    descriere: 'Sistem manual de alarmă în caz de incendiu',
    categorie: 'echipamente',
    frecventa: 'trimestriala',
    articolLegal: 'Naredba Iz-2377/2011, Чл. 21',
    penalitate: 400,
    detalii: [
      'Butoane de alarmă la locuri accesibile',
      'Verificare trimestrială funcționalitate',
      'Audibilitate în toată clădirea',
      'Instrucțiuni clare de utilizare'
    ]
  },
  {
    id: 'psi-bg-014',
    nume: 'Електрически инсталации (Instalații electrice)',
    descriere: 'Verificare conformitate instalații electrice pentru prevenirea incendiilor',
    categorie: 'verificari',
    frecventa: 'anuala',
    articolLegal: 'Naredba Iz-2377/2011, Чл. 30',
    penalitate: 500,
    detalii: [
      'Verificare anuală de electrician autorizat',
      'Sisteme de protecție funcționale',
      'Tablouri electrice conforme',
      'Proces-verbal verificare tehnică'
    ]
  },
  {
    id: 'psi-bg-015',
    nume: 'Складове за опасни вещества (Depozitare substanțe periculoase)',
    descriere: 'Conformitate depozitare materiale inflamabile și periculoase',
    categorie: 'verificari',
    frecventa: 'lunara',
    articolLegal: 'Naredba Iz-2377/2011, Чл. 35',
    penalitate: 1200,
    detalii: [
      'Spații dedicate, separate',
      'Ventilație adecvată',
      'Semnalizare specifică',
      'Fișe de siguranță disponibile'
    ]
  },
  {
    id: 'psi-bg-016',
    nume: 'Пътища за достъп (Căi de acces pompieri)',
    descriere: 'Menținere căi de acces libere pentru autovehiculele de pompieri',
    categorie: 'evacuare',
    frecventa: 'lunara',
    articolLegal: 'Naredba Iz-2377/2011, Чл. 14',
    penalitate: 600,
    detalii: [
      'Lățime minimum 3.5m',
      'Fără obstacole permanente sau temporare',
      'Semnalizare "Accesul interzis"',
      'Verificare lunară și îndepărtare obstacole'
    ]
  },
  {
    id: 'psi-bg-017',
    nume: 'Горими материали (Materiale combustibile)',
    descriere: 'Control și limitare cantități materiale combustibile',
    categorie: 'verificari',
    frecventa: 'lunara',
    articolLegal: 'Naredba Iz-2377/2011, Чл. 33',
    penalitate: 350,
    detalii: [
      'Cantități minime necesare',
      'Depozitare în locuri sigure',
      'Distanțe de siguranță față de surse de căldură',
      'Evacuare zilnică reziduuri combustibile'
    ]
  },
  {
    id: 'psi-bg-018',
    nume: 'Сертификати за пожарна безопасност (Certificate securitate la incendiu)',
    descriere: 'Documente doveditoare conformitate echipamente și sisteme',
    categorie: 'documentatie',
    frecventa: 'unica',
    articolLegal: 'Naredba Iz-2377/2011, Чл. 9',
    penalitate: 400,
    detalii: [
      'Certificate pentru stingătoare',
      'Certificate pentru sisteme detectie/stingere',
      'Documente firma service autorizată',
      'Arhivare minimum 5 ani'
    ]
  },
  {
    id: 'psi-bg-019',
    nume: 'Забрана за тютюнопушене (Interdicție de fumat)',
    descriere: 'Reglementare și semnalizare zone cu interdicție de fumat',
    categorie: 'verificari',
    frecventa: 'lunara',
    articolLegal: 'Naredba Iz-2377/2011, Чл. 32',
    penalitate: 250,
    detalii: [
      'Semnalizare clară zone interzise',
      'Zone dedicate pentru fumători',
      'Scrumiere metalice în locuri sigure',
      'Instruirea personalului și vizitatorilor'
    ]
  },
  {
    id: 'psi-bg-020',
    nume: 'Пожарна инспекция (Inspecție autorități)',
    descriere: 'Conformare la recomandările din rapoartele de inspecție',
    categorie: 'verificari',
    frecventa: 'anuala',
    articolLegal: 'Zakon za MBR, Чл. 95',
    penalitate: 1000,
    detalii: [
      'Inspecții periodice ale pompierilor',
      'Implementare măsuri dispuse',
      'Termene de conformare respectate',
      'Comunicare scrisă cu autoritatea'
    ]
  }
];

/**
 * Funcție helper pentru filtrare după categorie
 */
export function getObligatiiByCategorie(categorie: ObligatiePSIBG['categorie']): ObligatiePSIBG[] {
  return obligatiiPSIBulgaria.filter(obl => obl.categorie === categorie);
}

/**
 * Funcție helper pentru filtrare după frecvență
 */
export function getObligatiiByFrecventa(frecventa: ObligatiePSIBG['frecventa']): ObligatiePSIBG[] {
  return obligatiiPSIBulgaria.filter(obl => obl.frecventa === frecventa);
}

/**
 * Funcție helper pentru obținere obligație după ID
 */
export function getObligatieById(id: string): ObligatiePSIBG | undefined {
  return obligatiiPSIBulgaria.find(obl => obl.id === id);
}

/**
 * Funcție helper pentru calculare penalitate totală potențială
 */
export function getTotalPenalitati(): number {
  return obligatiiPSIBulgaria.reduce((sum, obl) => sum + obl.penalitate, 0);
}
