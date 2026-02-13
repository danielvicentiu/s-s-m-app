/**
 * Centralized success messages for the application
 * Languages: RO (Romanian), EN (English), BG (Bulgarian), HU (Hungarian), DE (German), PL (Polish)
 */

export type SuccessMessageKey =
  | 'employee_added'
  | 'training_scheduled'
  | 'document_generated'
  | 'profile_updated'
  | 'equipment_registered'
  | 'alert_resolved'
  | 'report_exported'
  | 'import_completed'
  | 'invitation_sent'
  | 'settings_saved'
  | 'training_completed'
  | 'medical_record_added'
  | 'organization_created'
  | 'user_role_assigned'
  | 'penalty_recorded'
  | 'equipment_maintenance_scheduled'
  | 'document_uploaded'
  | 'employee_deleted'
  | 'training_cancelled'
  | 'password_changed';

export type Locale = 'ro' | 'en' | 'bg' | 'hu' | 'de' | 'pl';

export const successMessages: Record<SuccessMessageKey, Record<Locale, string>> = {
  employee_added: {
    ro: 'Angajatul a fost adăugat cu succes',
    en: 'Employee has been added successfully',
    bg: 'Служителят е добавен успешно',
    hu: 'Az alkalmazott sikeresen hozzáadva',
    de: 'Mitarbeiter wurde erfolgreich hinzugefügt',
    pl: 'Pracownik został pomyślnie dodany',
  },
  training_scheduled: {
    ro: 'Instruirea a fost programată cu succes',
    en: 'Training has been scheduled successfully',
    bg: 'Обучението е планирано успешно',
    hu: 'A képzés sikeresen ütemezve',
    de: 'Schulung wurde erfolgreich geplant',
    pl: 'Szkolenie zostało pomyślnie zaplanowane',
  },
  document_generated: {
    ro: 'Documentul a fost generat cu succes',
    en: 'Document has been generated successfully',
    bg: 'Документът е генериран успешно',
    hu: 'A dokumentum sikeresen létrehozva',
    de: 'Dokument wurde erfolgreich erstellt',
    pl: 'Dokument został pomyślnie wygenerowany',
  },
  profile_updated: {
    ro: 'Profilul a fost actualizat cu succes',
    en: 'Profile has been updated successfully',
    bg: 'Профилът е актуализиран успешно',
    hu: 'A profil sikeresen frissítve',
    de: 'Profil wurde erfolgreich aktualisiert',
    pl: 'Profil został pomyślnie zaktualizowany',
  },
  equipment_registered: {
    ro: 'Echipamentul a fost înregistrat cu succes',
    en: 'Equipment has been registered successfully',
    bg: 'Оборудването е регистрирано успешно',
    hu: 'A berendezés sikeresen regisztrálva',
    de: 'Ausrüstung wurde erfolgreich registriert',
    pl: 'Sprzęt został pomyślnie zarejestrowany',
  },
  alert_resolved: {
    ro: 'Alerta a fost rezolvată cu succes',
    en: 'Alert has been resolved successfully',
    bg: 'Сигналът е разрешен успешно',
    hu: 'A figyelmeztetés sikeresen megoldva',
    de: 'Warnung wurde erfolgreich behoben',
    pl: 'Alert został pomyślnie rozwiązany',
  },
  report_exported: {
    ro: 'Raportul a fost exportat cu succes',
    en: 'Report has been exported successfully',
    bg: 'Отчетът е експортиран успешно',
    hu: 'A jelentés sikeresen exportálva',
    de: 'Bericht wurde erfolgreich exportiert',
    pl: 'Raport został pomyślnie wyeksportowany',
  },
  import_completed: {
    ro: 'Importul a fost finalizat cu succes',
    en: 'Import has been completed successfully',
    bg: 'Импортът е завършен успешно',
    hu: 'Az importálás sikeresen befejezve',
    de: 'Import wurde erfolgreich abgeschlossen',
    pl: 'Import został pomyślnie zakończony',
  },
  invitation_sent: {
    ro: 'Invitația a fost trimisă cu succes',
    en: 'Invitation has been sent successfully',
    bg: 'Поканата е изпратена успешно',
    hu: 'A meghívó sikeresen elküldve',
    de: 'Einladung wurde erfolgreich gesendet',
    pl: 'Zaproszenie zostało pomyślnie wysłane',
  },
  settings_saved: {
    ro: 'Setările au fost salvate cu succes',
    en: 'Settings have been saved successfully',
    bg: 'Настройките са запазени успешно',
    hu: 'A beállítások sikeresen mentve',
    de: 'Einstellungen wurden erfolgreich gespeichert',
    pl: 'Ustawienia zostały pomyślnie zapisane',
  },
  training_completed: {
    ro: 'Instruirea a fost finalizată cu succes',
    en: 'Training has been completed successfully',
    bg: 'Обучението е завършено успешно',
    hu: 'A képzés sikeresen befejezve',
    de: 'Schulung wurde erfolgreich abgeschlossen',
    pl: 'Szkolenie zostało pomyślnie ukończone',
  },
  medical_record_added: {
    ro: 'Fișa medicală a fost adăugată cu succes',
    en: 'Medical record has been added successfully',
    bg: 'Медицинската карта е добавена успешно',
    hu: 'Az egészségügyi karton sikeresen hozzáadva',
    de: 'Medizinische Akte wurde erfolgreich hinzugefügt',
    pl: 'Karta medyczna została pomyślnie dodana',
  },
  organization_created: {
    ro: 'Organizația a fost creată cu succes',
    en: 'Organization has been created successfully',
    bg: 'Организацията е създадена успешно',
    hu: 'A szervezet sikeresen létrehozva',
    de: 'Organisation wurde erfolgreich erstellt',
    pl: 'Organizacja została pomyślnie utworzona',
  },
  user_role_assigned: {
    ro: 'Rolul utilizatorului a fost atribuit cu succes',
    en: 'User role has been assigned successfully',
    bg: 'Ролята на потребителя е назначена успешно',
    hu: 'A felhasználói szerepkör sikeresen hozzárendelve',
    de: 'Benutzerrolle wurde erfolgreich zugewiesen',
    pl: 'Rola użytkownika została pomyślnie przypisana',
  },
  penalty_recorded: {
    ro: 'Sancțiunea a fost înregistrată cu succes',
    en: 'Penalty has been recorded successfully',
    bg: 'Санкцията е регистрирана успешно',
    hu: 'A büntetés sikeresen rögzítve',
    de: 'Strafe wurde erfolgreich erfasst',
    pl: 'Kara została pomyślnie zarejestrowana',
  },
  equipment_maintenance_scheduled: {
    ro: 'Mentenanța echipamentului a fost programată cu succes',
    en: 'Equipment maintenance has been scheduled successfully',
    bg: 'Поддръжката на оборудването е планирана успешно',
    hu: 'A berendezés karbantartása sikeresen ütemezve',
    de: 'Wartung der Ausrüstung wurde erfolgreich geplant',
    pl: 'Konserwacja sprzętu została pomyślnie zaplanowana',
  },
  document_uploaded: {
    ro: 'Documentul a fost încărcat cu succes',
    en: 'Document has been uploaded successfully',
    bg: 'Документът е качен успешно',
    hu: 'A dokumentum sikeresen feltöltve',
    de: 'Dokument wurde erfolgreich hochgeladen',
    pl: 'Dokument został pomyślnie przesłany',
  },
  employee_deleted: {
    ro: 'Angajatul a fost șters cu succes',
    en: 'Employee has been deleted successfully',
    bg: 'Служителят е изтрит успешно',
    hu: 'Az alkalmazott sikeresen törölve',
    de: 'Mitarbeiter wurde erfolgreich gelöscht',
    pl: 'Pracownik został pomyślnie usunięty',
  },
  training_cancelled: {
    ro: 'Instruirea a fost anulată cu succes',
    en: 'Training has been cancelled successfully',
    bg: 'Обучението е отменено успешно',
    hu: 'A képzés sikeresen törölve',
    de: 'Schulung wurde erfolgreich storniert',
    pl: 'Szkolenie zostało pomyślnie anulowane',
  },
  password_changed: {
    ro: 'Parola a fost schimbată cu succes',
    en: 'Password has been changed successfully',
    bg: 'Паролата е променена успешно',
    hu: 'A jelszó sikeresen megváltoztatva',
    de: 'Passwort wurde erfolgreich geändert',
    pl: 'Hasło zostało pomyślnie zmienione',
  },
};

/**
 * Get a success message for a specific key and locale
 * @param key - The success message key
 * @param locale - The locale (default: 'ro')
 * @returns The success message in the requested locale
 */
export function getSuccessMessage(
  key: SuccessMessageKey,
  locale: Locale = 'ro'
): string {
  return successMessages[key][locale];
}

/**
 * Get all success messages for a specific locale
 * @param locale - The locale (default: 'ro')
 * @returns All success messages in the requested locale
 */
export function getAllSuccessMessages(
  locale: Locale = 'ro'
): Record<SuccessMessageKey, string> {
  const messages: Record<string, string> = {};

  for (const key in successMessages) {
    messages[key] = successMessages[key as SuccessMessageKey][locale];
  }

  return messages as Record<SuccessMessageKey, string>;
}
