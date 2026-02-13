/**
 * Centralized error messages in 6 languages
 * Languages: RO (Romanian), EN (English), BG (Bulgarian), HU (Hungarian), DE (German), PL (Polish)
 */

export type ErrorCode =
  // Validation errors
  | 'REQUIRED_FIELD'
  | 'INVALID_EMAIL'
  | 'INVALID_CNP'
  | 'INVALID_CUI'
  | 'INVALID_PHONE'
  | 'INVALID_DATE'
  | 'INVALID_FORMAT'
  | 'PASSWORD_TOO_SHORT'
  | 'PASSWORD_MISMATCH'
  | 'INVALID_LENGTH'
  // Auth errors
  | 'UNAUTHORIZED'
  | 'SESSION_EXPIRED'
  | 'INVALID_CREDENTIALS'
  | 'ACCESS_DENIED'
  | 'TOKEN_INVALID'
  | 'ACCOUNT_DISABLED'
  // CRUD errors
  | 'CREATE_FAILED'
  | 'UPDATE_FAILED'
  | 'DELETE_FAILED'
  | 'FETCH_FAILED'
  | 'SAVE_FAILED'
  | 'DUPLICATE_ENTRY'
  | 'NOT_FOUND'
  // Network errors
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'CONNECTION_FAILED'
  | 'SERVICE_UNAVAILABLE'
  // Business logic errors
  | 'EMPLOYEE_LIMIT_REACHED'
  | 'MODULE_INACTIVE'
  | 'SUBSCRIPTION_EXPIRED'
  | 'INSUFFICIENT_PERMISSIONS'
  | 'ORGANIZATION_NOT_FOUND'
  | 'INVALID_ORGANIZATION'
  | 'ALREADY_EXISTS'
  | 'OPERATION_NOT_ALLOWED'
  | 'DEPENDENCY_EXISTS'
  | 'INVALID_STATUS'
  | 'DATE_IN_PAST'
  | 'DATE_IN_FUTURE';

export type Language = 'ro' | 'en' | 'bg' | 'hu' | 'de' | 'pl';

export const ERROR_MESSAGES: Record<ErrorCode, Record<Language, string>> = {
  // Validation errors
  REQUIRED_FIELD: {
    ro: 'Acest câmp este obligatoriu',
    en: 'This field is required',
    bg: 'Това поле е задължително',
    hu: 'Ez a mező kötelező',
    de: 'Dieses Feld ist erforderlich',
    pl: 'To pole jest wymagane',
  },
  INVALID_EMAIL: {
    ro: 'Adresa de email nu este validă',
    en: 'Email address is not valid',
    bg: 'Имейл адресът не е валиден',
    hu: 'Az e-mail cím nem érvényes',
    de: 'E-Mail-Adresse ist ungültig',
    pl: 'Adres e-mail jest nieprawidłowy',
  },
  INVALID_CNP: {
    ro: 'CNP-ul introdus nu este valid',
    en: 'The CNP entered is not valid',
    bg: 'Въведеният ЕГН не е валиден',
    hu: 'A megadott személyi szám érvénytelen',
    de: 'Die eingegebene CNP ist ungültig',
    pl: 'Wprowadzony CNP jest nieprawidłowy',
  },
  INVALID_CUI: {
    ro: 'CUI-ul introdus nu este valid',
    en: 'The CUI entered is not valid',
    bg: 'Въведеният ЕИК не е валиден',
    hu: 'A megadott adószám érvénytelen',
    de: 'Die eingegebene Steuernummer ist ungültig',
    pl: 'Wprowadzony NIP jest nieprawidłowy',
  },
  INVALID_PHONE: {
    ro: 'Numărul de telefon nu este valid',
    en: 'Phone number is not valid',
    bg: 'Телефонният номер не е валиден',
    hu: 'A telefonszám érvénytelen',
    de: 'Telefonnummer ist ungültig',
    pl: 'Numer telefonu jest nieprawidłowy',
  },
  INVALID_DATE: {
    ro: 'Data introdusă nu este validă',
    en: 'The date entered is not valid',
    bg: 'Въведената дата не е валидна',
    hu: 'A megadott dátum érvénytelen',
    de: 'Das eingegebene Datum ist ungültig',
    pl: 'Wprowadzona data jest nieprawidłowa',
  },
  INVALID_FORMAT: {
    ro: 'Formatul nu este valid',
    en: 'Format is not valid',
    bg: 'Форматът не е валиден',
    hu: 'A formátum érvénytelen',
    de: 'Format ist ungültig',
    pl: 'Format jest nieprawidłowy',
  },
  PASSWORD_TOO_SHORT: {
    ro: 'Parola trebuie să aibă cel puțin 8 caractere',
    en: 'Password must be at least 8 characters',
    bg: 'Паролата трябва да бъде поне 8 символа',
    hu: 'A jelszónak legalább 8 karakterből kell állnia',
    de: 'Das Passwort muss mindestens 8 Zeichen lang sein',
    pl: 'Hasło musi mieć co najmniej 8 znaków',
  },
  PASSWORD_MISMATCH: {
    ro: 'Parolele nu se potrivesc',
    en: 'Passwords do not match',
    bg: 'Паролите не съвпадат',
    hu: 'A jelszavak nem egyeznek',
    de: 'Passwörter stimmen nicht überein',
    pl: 'Hasła nie pasują do siebie',
  },
  INVALID_LENGTH: {
    ro: 'Lungimea nu este validă',
    en: 'Length is not valid',
    bg: 'Дължината не е валидна',
    hu: 'A hossz érvénytelen',
    de: 'Länge ist ungültig',
    pl: 'Długość jest nieprawidłowa',
  },

  // Auth errors
  UNAUTHORIZED: {
    ro: 'Nu aveți permisiunea să efectuați această acțiune',
    en: 'You do not have permission to perform this action',
    bg: 'Нямате разрешение да извършите това действие',
    hu: 'Nincs jogosultsága ennek a műveletnek a végrehajtásához',
    de: 'Sie haben keine Berechtigung, diese Aktion auszuführen',
    pl: 'Nie masz uprawnień do wykonania tej akcji',
  },
  SESSION_EXPIRED: {
    ro: 'Sesiunea dvs. a expirat. Vă rugăm să vă autentificați din nou',
    en: 'Your session has expired. Please log in again',
    bg: 'Вашата сесия е изтекла. Моля, влезте отново',
    hu: 'A munkamenete lejárt. Kérjük, jelentkezzen be újra',
    de: 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an',
    pl: 'Twoja sesja wygasła. Zaloguj się ponownie',
  },
  INVALID_CREDENTIALS: {
    ro: 'Email sau parolă incorectă',
    en: 'Incorrect email or password',
    bg: 'Грешен имейл или парола',
    hu: 'Helytelen e-mail vagy jelszó',
    de: 'Falsche E-Mail oder Passwort',
    pl: 'Nieprawidłowy adres e-mail lub hasło',
  },
  ACCESS_DENIED: {
    ro: 'Acces interzis',
    en: 'Access denied',
    bg: 'Достъпът е отказан',
    hu: 'Hozzáférés megtagadva',
    de: 'Zugriff verweigert',
    pl: 'Dostęp zabroniony',
  },
  TOKEN_INVALID: {
    ro: 'Token-ul de autentificare nu este valid',
    en: 'Authentication token is not valid',
    bg: 'Токенът за удостоверяване не е валиден',
    hu: 'A hitelesítési token érvénytelen',
    de: 'Authentifizierungstoken ist ungültig',
    pl: 'Token uwierzytelniający jest nieprawidłowy',
  },
  ACCOUNT_DISABLED: {
    ro: 'Contul dvs. este dezactivat. Contactați administratorul',
    en: 'Your account is disabled. Contact the administrator',
    bg: 'Вашият акаунт е деактивиран. Свържете се с администратора',
    hu: 'Fiókja letiltva. Forduljon a rendszergazdához',
    de: 'Ihr Konto ist deaktiviert. Kontaktieren Sie den Administrator',
    pl: 'Twoje konto jest wyłączone. Skontaktuj się z administratorem',
  },

  // CRUD errors
  CREATE_FAILED: {
    ro: 'Crearea înregistrării a eșuat',
    en: 'Failed to create record',
    bg: 'Неуспешно създаване на запис',
    hu: 'A rekord létrehozása sikertelen',
    de: 'Datensatz konnte nicht erstellt werden',
    pl: 'Nie udało się utworzyć rekordu',
  },
  UPDATE_FAILED: {
    ro: 'Actualizarea înregistrării a eșuat',
    en: 'Failed to update record',
    bg: 'Неуспешна актуализация на запис',
    hu: 'A rekord frissítése sikertelen',
    de: 'Datensatz konnte nicht aktualisiert werden',
    pl: 'Nie udało się zaktualizować rekordu',
  },
  DELETE_FAILED: {
    ro: 'Ștergerea înregistrării a eșuat',
    en: 'Failed to delete record',
    bg: 'Неуспешно изтриване на запис',
    hu: 'A rekord törlése sikertelen',
    de: 'Datensatz konnte nicht gelöscht werden',
    pl: 'Nie udało się usunąć rekordu',
  },
  FETCH_FAILED: {
    ro: 'Încărcarea datelor a eșuat',
    en: 'Failed to fetch data',
    bg: 'Неуспешно зареждане на данни',
    hu: 'Az adatok betöltése sikertelen',
    de: 'Daten konnten nicht geladen werden',
    pl: 'Nie udało się pobrać danych',
  },
  SAVE_FAILED: {
    ro: 'Salvarea datelor a eșuat',
    en: 'Failed to save data',
    bg: 'Неуспешно запазване на данни',
    hu: 'Az adatok mentése sikertelen',
    de: 'Daten konnten nicht gespeichert werden',
    pl: 'Nie udało się zapisać danych',
  },
  DUPLICATE_ENTRY: {
    ro: 'Înregistrarea există deja în baza de date',
    en: 'Record already exists in the database',
    bg: 'Записът вече съществува в базата данни',
    hu: 'A rekord már létezik az adatbázisban',
    de: 'Datensatz existiert bereits in der Datenbank',
    pl: 'Rekord już istnieje w bazie danych',
  },
  NOT_FOUND: {
    ro: 'Înregistrarea nu a fost găsită',
    en: 'Record not found',
    bg: 'Записът не е намерен',
    hu: 'A rekord nem található',
    de: 'Datensatz nicht gefunden',
    pl: 'Rekord nie został znaleziony',
  },

  // Network errors
  SERVER_ERROR: {
    ro: 'A apărut o eroare pe server. Vă rugăm să încercați din nou',
    en: 'A server error occurred. Please try again',
    bg: 'Възникна сървърна грешка. Моля, опитайте отново',
    hu: 'Szerverhiba történt. Kérjük, próbálja újra',
    de: 'Ein Serverfehler ist aufgetreten. Bitte versuchen Sie es erneut',
    pl: 'Wystąpił błąd serwera. Spróbuj ponownie',
  },
  NETWORK_ERROR: {
    ro: 'Eroare de conexiune. Verificați conexiunea la internet',
    en: 'Connection error. Check your internet connection',
    bg: 'Грешка в свързването. Проверете интернет връзката си',
    hu: 'Kapcsolódási hiba. Ellenőrizze az internetkapcsolatot',
    de: 'Verbindungsfehler. Überprüfen Sie Ihre Internetverbindung',
    pl: 'Błąd połączenia. Sprawdź połączenie internetowe',
  },
  TIMEOUT: {
    ro: 'Timpul de așteptare a expirat. Încercați din nou',
    en: 'Request timed out. Please try again',
    bg: 'Изтекло време за изчакване. Опитайте отново',
    hu: 'A kérés időtúllépés miatt megszakadt. Próbálja újra',
    de: 'Zeitüberschreitung der Anfrage. Bitte versuchen Sie es erneut',
    pl: 'Upłynął limit czasu żądania. Spróbuj ponownie',
  },
  CONNECTION_FAILED: {
    ro: 'Conexiunea la server a eșuat',
    en: 'Failed to connect to server',
    bg: 'Неуспешна връзка със сървъра',
    hu: 'Nem sikerült csatlakozni a szerverhez',
    de: 'Verbindung zum Server fehlgeschlagen',
    pl: 'Nie udało się połączyć z serwerem',
  },
  SERVICE_UNAVAILABLE: {
    ro: 'Serviciul este temporar indisponibil. Încercați mai târziu',
    en: 'Service is temporarily unavailable. Try again later',
    bg: 'Услугата временно не е достъпна. Опитайте по-късно',
    hu: 'A szolgáltatás átmenetileg nem érhető el. Próbálja később',
    de: 'Der Dienst ist vorübergehend nicht verfügbar. Versuchen Sie es später',
    pl: 'Usługa jest tymczasowo niedostępna. Spróbuj później',
  },

  // Business logic errors
  EMPLOYEE_LIMIT_REACHED: {
    ro: 'Ați atins limita maximă de angajați pentru planul dvs',
    en: 'You have reached the maximum employee limit for your plan',
    bg: 'Достигнахте максималния лимит на служители за вашия план',
    hu: 'Elérte a csomagjában foglalt maximális alkalmazotti létszámot',
    de: 'Sie haben die maximale Mitarbeiteranzahl für Ihren Plan erreicht',
    pl: 'Osiągnąłeś maksymalny limit pracowników dla twojego planu',
  },
  MODULE_INACTIVE: {
    ro: 'Acest modul nu este activ pentru organizația dvs',
    en: 'This module is not active for your organization',
    bg: 'Този модул не е активен за вашата организация',
    hu: 'Ez a modul nem aktív a szervezete számára',
    de: 'Dieses Modul ist für Ihre Organisation nicht aktiv',
    pl: 'Ten moduł nie jest aktywny dla twojej organizacji',
  },
  SUBSCRIPTION_EXPIRED: {
    ro: 'Abonamentul dvs. a expirat. Contactați administratorul',
    en: 'Your subscription has expired. Contact the administrator',
    bg: 'Вашият абонамент е изтекъл. Свържете се с администратора',
    hu: 'Az előfizetése lejárt. Forduljon a rendszergazdához',
    de: 'Ihr Abonnement ist abgelaufen. Kontaktieren Sie den Administrator',
    pl: 'Twoja subskrypcja wygasła. Skontaktuj się z administratorem',
  },
  INSUFFICIENT_PERMISSIONS: {
    ro: 'Nu aveți permisiunile necesare pentru această operațiune',
    en: 'You do not have the necessary permissions for this operation',
    bg: 'Нямате необходимите разрешения за тази операция',
    hu: 'Nincs megfelelő jogosultsága ehhez a művelethez',
    de: 'Sie haben nicht die erforderlichen Berechtigungen für diesen Vorgang',
    pl: 'Nie masz wymaganych uprawnień do tej operacji',
  },
  ORGANIZATION_NOT_FOUND: {
    ro: 'Organizația nu a fost găsită',
    en: 'Organization not found',
    bg: 'Организацията не е намерена',
    hu: 'A szervezet nem található',
    de: 'Organisation nicht gefunden',
    pl: 'Organizacja nie została znaleziona',
  },
  INVALID_ORGANIZATION: {
    ro: 'Organizația nu este validă',
    en: 'Organization is not valid',
    bg: 'Организацията не е валидна',
    hu: 'A szervezet érvénytelen',
    de: 'Organisation ist ungültig',
    pl: 'Organizacja jest nieprawidłowa',
  },
  ALREADY_EXISTS: {
    ro: 'Înregistrarea există deja',
    en: 'Record already exists',
    bg: 'Записът вече съществува',
    hu: 'A rekord már létezik',
    de: 'Datensatz existiert bereits',
    pl: 'Rekord już istnieje',
  },
  OPERATION_NOT_ALLOWED: {
    ro: 'Această operațiune nu este permisă',
    en: 'This operation is not allowed',
    bg: 'Тази операция не е разрешена',
    hu: 'Ez a művelet nem engedélyezett',
    de: 'Dieser Vorgang ist nicht zulässig',
    pl: 'Ta operacja nie jest dozwolona',
  },
  DEPENDENCY_EXISTS: {
    ro: 'Nu se poate șterge. Există înregistrări dependente',
    en: 'Cannot delete. Dependent records exist',
    bg: 'Не може да се изтрие. Съществуват зависими записи',
    hu: 'Nem törölhető. Függő rekordok léteznek',
    de: 'Kann nicht gelöscht werden. Abhängige Datensätze vorhanden',
    pl: 'Nie można usunąć. Istnieją zależne rekordy',
  },
  INVALID_STATUS: {
    ro: 'Starea nu este validă',
    en: 'Status is not valid',
    bg: 'Статусът не е валиден',
    hu: 'Az állapot érvénytelen',
    de: 'Status ist ungültig',
    pl: 'Status jest nieprawidłowy',
  },
  DATE_IN_PAST: {
    ro: 'Data nu poate fi în trecut',
    en: 'Date cannot be in the past',
    bg: 'Датата не може да бъде в миналото',
    hu: 'A dátum nem lehet múltbeli',
    de: 'Datum kann nicht in der Vergangenheit liegen',
    pl: 'Data nie może być w przeszłości',
  },
  DATE_IN_FUTURE: {
    ro: 'Data nu poate fi în viitor',
    en: 'Date cannot be in the future',
    bg: 'Датата не може да бъде в бъдещето',
    hu: 'A dátum nem lehet jövőbeli',
    de: 'Datum kann nicht in der Zukunft liegen',
    pl: 'Data nie może być w przyszłości',
  },
};

/**
 * Get error message by code and language
 * @param code - Error code
 * @param lang - Language code (defaults to 'ro')
 * @returns Translated error message
 */
export function getErrorMessage(code: ErrorCode, lang: Language = 'ro'): string {
  return ERROR_MESSAGES[code]?.[lang] || ERROR_MESSAGES[code]?.ro || 'A apărut o eroare';
}

/**
 * Get all error messages for a specific language
 * @param lang - Language code (defaults to 'ro')
 * @returns Object with all error messages in the specified language
 */
export function getAllErrorMessages(lang: Language = 'ro'): Record<ErrorCode, string> {
  const messages = {} as Record<ErrorCode, string>;
  for (const code in ERROR_MESSAGES) {
    messages[code as ErrorCode] = ERROR_MESSAGES[code as ErrorCode][lang];
  }
  return messages;
}
