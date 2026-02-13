/**
 * Loading Messages Data
 *
 * Fun and informative loading messages for the SSM/PSI platform
 * Supports 6 languages: RO, EN, BG, HU, DE, FR
 */

export type LoadingMessageType = 'checking' | 'generating' | 'processing' | 'tip';

export interface LoadingMessage {
  id: string;
  type: LoadingMessageType;
  ro: string;
  en: string;
  bg: string;
  hu: string;
  de: string;
  fr: string;
}

export const loadingMessages: LoadingMessage[] = [
  // Checking messages (1-5)
  {
    id: 'checking_1',
    type: 'checking',
    ro: 'Se verifică conformitatea SSM...',
    en: 'Checking OSH compliance...',
    bg: 'Проверка на съответствието с БЗР...',
    hu: 'Munkavédelmi megfelelőség ellenőrzése...',
    de: 'Überprüfung der Arbeitssicherheit...',
    fr: 'Vérification de la conformité SST...',
  },
  {
    id: 'checking_2',
    type: 'checking',
    ro: 'Se analizează documentele...',
    en: 'Analyzing documents...',
    bg: 'Анализ на документите...',
    hu: 'Dokumentumok elemzése...',
    de: 'Dokumente werden analysiert...',
    fr: 'Analyse des documents...',
  },
  {
    id: 'checking_3',
    type: 'checking',
    ro: 'Se validează datele introduse...',
    en: 'Validating entered data...',
    bg: 'Валидиране на въведените данни...',
    hu: 'Bevitt adatok ellenőrzése...',
    de: 'Eingegebene Daten werden validiert...',
    fr: 'Validation des données saisies...',
  },
  {
    id: 'checking_4',
    type: 'checking',
    ro: 'Se verifică certificatele medicale...',
    en: 'Checking medical certificates...',
    bg: 'Проверка на медицинските свидетелства...',
    hu: 'Orvosi igazolások ellenőrzése...',
    de: 'Ärztliche Bescheinigungen werden geprüft...',
    fr: 'Vérification des certificats médicaux...',
  },
  {
    id: 'checking_5',
    type: 'checking',
    ro: 'Se scanează echipamentele de protecție...',
    en: 'Scanning protective equipment...',
    bg: 'Сканиране на предпазно оборудване...',
    hu: 'Védőfelszerelések szkennelése...',
    de: 'Schutzausrüstung wird gescannt...',
    fr: 'Scan des équipements de protection...',
  },

  // Generating messages (6-10)
  {
    id: 'generating_1',
    type: 'generating',
    ro: 'Se generează raportul...',
    en: 'Generating report...',
    bg: 'Генериране на доклад...',
    hu: 'Jelentés készítése...',
    de: 'Bericht wird erstellt...',
    fr: 'Génération du rapport...',
  },
  {
    id: 'generating_2',
    type: 'generating',
    ro: 'Se creează documentația...',
    en: 'Creating documentation...',
    bg: 'Създаване на документация...',
    hu: 'Dokumentáció létrehozása...',
    de: 'Dokumentation wird erstellt...',
    fr: 'Création de la documentation...',
  },
  {
    id: 'generating_3',
    type: 'generating',
    ro: 'Se exportă datele în Excel...',
    en: 'Exporting data to Excel...',
    bg: 'Експорт на данни в Excel...',
    hu: 'Adatok exportálása Excelbe...',
    de: 'Daten werden nach Excel exportiert...',
    fr: 'Export des données vers Excel...',
  },
  {
    id: 'generating_4',
    type: 'generating',
    ro: 'Se generează PDF-ul...',
    en: 'Generating PDF...',
    bg: 'Генериране на PDF...',
    hu: 'PDF készítése...',
    de: 'PDF wird erstellt...',
    fr: 'Génération du PDF...',
  },
  {
    id: 'generating_5',
    type: 'generating',
    ro: 'Se pregătește registrul de instructaje...',
    en: 'Preparing training register...',
    bg: 'Подготовка на регистър за обучения...',
    hu: 'Oktatási nyilvántartás előkészítése...',
    de: 'Schulungsregister wird vorbereitet...',
    fr: 'Préparation du registre de formation...',
  },

  // Processing messages (11-15)
  {
    id: 'processing_1',
    type: 'processing',
    ro: 'Se procesează informațiile...',
    en: 'Processing information...',
    bg: 'Обработка на информация...',
    hu: 'Információk feldolgozása...',
    de: 'Informationen werden verarbeitet...',
    fr: 'Traitement des informations...',
  },
  {
    id: 'processing_2',
    type: 'processing',
    ro: 'Se sincronizează datele...',
    en: 'Synchronizing data...',
    bg: 'Синхронизиране на данни...',
    hu: 'Adatok szinkronizálása...',
    de: 'Daten werden synchronisiert...',
    fr: 'Synchronisation des données...',
  },
  {
    id: 'processing_3',
    type: 'processing',
    ro: 'Se calculează termenele de expirare...',
    en: 'Calculating expiration dates...',
    bg: 'Изчисляване на крайни срокове...',
    hu: 'Lejárati dátumok számítása...',
    de: 'Ablaufdaten werden berechnet...',
    fr: 'Calcul des dates d\'expiration...',
  },
  {
    id: 'processing_4',
    type: 'processing',
    ro: 'Se actualizează notificările...',
    en: 'Updating notifications...',
    bg: 'Актуализиране на известия...',
    hu: 'Értesítések frissítése...',
    de: 'Benachrichtigungen werden aktualisiert...',
    fr: 'Mise à jour des notifications...',
  },
  {
    id: 'processing_5',
    type: 'processing',
    ro: 'Se salvează modificările...',
    en: 'Saving changes...',
    bg: 'Запазване на промените...',
    hu: 'Módosítások mentése...',
    de: 'Änderungen werden gespeichert...',
    fr: 'Enregistrement des modifications...',
  },

  // SSM Tips (16-20)
  {
    id: 'tip_1',
    type: 'tip',
    ro: 'Știai că? Instructajul periodic se face anual pentru locurile de muncă fără riscuri!',
    en: 'Did you know? Periodic training is annual for workplaces without risks!',
    bg: 'Знаете ли? Периодичното обучение е годишно за работни места без рискове!',
    hu: 'Tudtad? Az ismétlő oktatás éves kockázat nélküli munkahelyeken!',
    de: 'Wussten Sie? Regelmäßige Schulungen sind jährlich für risikofreie Arbeitsplätze!',
    fr: 'Le saviez-vous? La formation périodique est annuelle pour les postes sans risques!',
  },
  {
    id: 'tip_2',
    type: 'tip',
    ro: 'Știai că? Controlul medical la angajare este obligatoriu pentru TOȚI angajații!',
    en: 'Did you know? Pre-employment medical examination is mandatory for ALL employees!',
    bg: 'Знаете ли? Предварителният медицински преглед е задължителен за ВСИЧКИ служители!',
    hu: 'Tudtad? A foglalkoztatás előtti orvosi vizsgálat MINDEN munkavállalónak kötelező!',
    de: 'Wussten Sie? Die Einstellungsuntersuchung ist für ALLE Mitarbeiter verpflichtend!',
    fr: 'Le saviez-vous? L\'examen médical d\'embauche est obligatoire pour TOUS les employés!',
  },
  {
    id: 'tip_3',
    type: 'tip',
    ro: 'Știai că? Echipamentele de protecție trebuie verificate lunar!',
    en: 'Did you know? Protective equipment must be checked monthly!',
    bg: 'Знаете ли? Предпазното оборудване трябва да се проверява месечно!',
    hu: 'Tudtad? A védőfelszereléseket havonta kell ellenőrizni!',
    de: 'Wussten Sie? Schutzausrüstung muss monatlich geprüft werden!',
    fr: 'Le saviez-vous? Les équipements de protection doivent être vérifiés mensuellement!',
  },
  {
    id: 'tip_4',
    type: 'tip',
    ro: 'Știai că? Fișa de aptitudini trebuie păstrată 40 de ani!',
    en: 'Did you know? Fitness certificates must be kept for 40 years!',
    bg: 'Знаете ли? Свидетелствата за годност трябва да се съхраняват 40 години!',
    hu: 'Tudtad? Az alkalmassági lapokat 40 évig kell megőrizni!',
    de: 'Wussten Sie? Eignungsbescheinigungen müssen 40 Jahre aufbewahrt werden!',
    fr: 'Le saviez-vous? Les certificats d\'aptitude doivent être conservés 40 ans!',
  },
  {
    id: 'tip_5',
    type: 'tip',
    ro: 'Știai că? Registrul de instructaje se păstrează 10 ani după închiderea lui!',
    en: 'Did you know? Training register must be kept for 10 years after closure!',
    bg: 'Знаете ли? Регистърът за обучения се съхранява 10 години след затварянето му!',
    hu: 'Tudtad? Az oktatási nyilvántartást 10 évig kell megőrizni lezárása után!',
    de: 'Wussten Sie? Das Schulungsregister muss 10 Jahre nach Schließung aufbewahrt werden!',
    fr: 'Le saviez-vous? Le registre de formation doit être conservé 10 ans après sa fermeture!',
  },
];

/**
 * Get a random loading message for a specific locale
 * @param locale - Language code (ro, en, bg, hu, de, fr)
 * @param type - Optional filter by message type
 * @returns Localized loading message string
 */
export function getLoadingMessage(
  locale: 'ro' | 'en' | 'bg' | 'hu' | 'de' | 'fr' = 'ro',
  type?: LoadingMessageType
): string {
  const filteredMessages = type
    ? loadingMessages.filter((msg) => msg.type === type)
    : loadingMessages;

  const randomIndex = Math.floor(Math.random() * filteredMessages.length);
  const message = filteredMessages[randomIndex];

  return message[locale];
}

/**
 * Get all loading messages for a specific locale
 * @param locale - Language code (ro, en, bg, hu, de, fr)
 * @returns Array of localized loading message strings
 */
export function getAllLoadingMessages(
  locale: 'ro' | 'en' | 'bg' | 'hu' | 'de' | 'fr' = 'ro'
): string[] {
  return loadingMessages.map((msg) => msg[locale]);
}

/**
 * Get loading messages grouped by type for a specific locale
 * @param locale - Language code (ro, en, bg, hu, de, fr)
 * @returns Object with messages grouped by type
 */
export function getLoadingMessagesByType(
  locale: 'ro' | 'en' | 'bg' | 'hu' | 'de' | 'fr' = 'ro'
): Record<LoadingMessageType, string[]> {
  return {
    checking: loadingMessages
      .filter((msg) => msg.type === 'checking')
      .map((msg) => msg[locale]),
    generating: loadingMessages
      .filter((msg) => msg.type === 'generating')
      .map((msg) => msg[locale]),
    processing: loadingMessages
      .filter((msg) => msg.type === 'processing')
      .map((msg) => msg[locale]),
    tip: loadingMessages
      .filter((msg) => msg.type === 'tip')
      .map((msg) => msg[locale]),
  };
}
