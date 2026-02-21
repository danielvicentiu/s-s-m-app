#!/usr/bin/env node
// scripts/add-ns-batch3.js
// Adds dataImport, importWizard, modules namespaces to all 6 messages/*.json files

const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '..', 'messages');

// ─── DATA IMPORT ──────────────────────────────────────────────────────────────

const dataImport = {
  ro: {
    title: "Import Date",
    subtitle: "Importă angajați, instruiri, examene medicale și echipamente",
    steps: { upload: "Încărcare", mapping: "Mapare", preview: "Previzualizare", import: "Import" },
    types: { employees: "Angajați", trainings: "Instruiri", medical: "Examene medicale", equipment: "Echipamente" },
    fields: { fullName: "Nume complet", jobTitle: "Funcție", department: "Departament", hireDate: "Data angajare", corCode: "Cod COR", phone: "Telefon", employeeName: "Nume angajat", trainingType: "Tip instruire", trainingDate: "Data instruire", expiryDate: "Data expirare", instructor: "Instructor", notes: "Observații", examinationType: "Tip examen", examinationDate: "Data examen", result: "Rezultat", doctor: "Medic", clinic: "Clinică", restrictions: "Restricții", equipmentType: "Tip echipament", serialNumber: "Număr serie", location: "Locație", lastInspection: "Ultima inspecție", nextInspection: "Următoarea inspecție", description: "Descriere" },
    step1: { importTypeLabel: "Tip import", organizationLabel: "Organizație", uploadLabel: "Fișier (CSV/XLSX)", selectFile: "Selectează fișier", downloadTemplate: "Descarcă template", downloadTemplateFile: "Descarcă", downloadTemplateHint: "Folosește template-ul pentru format corect" },
    step2: { mappingTitle: "Mapare coloane", autoDetect: "Detectare automată", notSet: "Nu este setat" },
    step3: { row: "Rând", status: "Status", data: "Date", valid: "Valid", errors: "Erori", warnings: "Avertizări", issues: "Probleme" },
    step4: { readyTitle: "Gata de import", confirmImport: "Confirmă import", importing: "Se importă...", doneTitle: "Import finalizat", backToDashboard: "Înapoi la dashboard" },
    nav: { back: "Înapoi", continue: "Continuă" },
    errors: { selectOrg: "Selectează o organizație", emptyFile: "Fișierul este gol", readError: "Eroare la citire fișier" }
  },
  en: {
    title: "Data Import",
    subtitle: "Import employees, trainings, medical exams and equipment",
    steps: { upload: "Upload", mapping: "Mapping", preview: "Preview", import: "Import" },
    types: { employees: "Employees", trainings: "Trainings", medical: "Medical exams", equipment: "Equipment" },
    fields: { fullName: "Full name", jobTitle: "Job title", department: "Department", hireDate: "Hire date", corCode: "COR code", phone: "Phone", employeeName: "Employee name", trainingType: "Training type", trainingDate: "Training date", expiryDate: "Expiry date", instructor: "Instructor", notes: "Notes", examinationType: "Exam type", examinationDate: "Exam date", result: "Result", doctor: "Doctor", clinic: "Clinic", restrictions: "Restrictions", equipmentType: "Equipment type", serialNumber: "Serial number", location: "Location", lastInspection: "Last inspection", nextInspection: "Next inspection", description: "Description" },
    step1: { importTypeLabel: "Import type", organizationLabel: "Organization", uploadLabel: "File (CSV/XLSX)", selectFile: "Select file", downloadTemplate: "Download template", downloadTemplateFile: "Download", downloadTemplateHint: "Use the template for correct format" },
    step2: { mappingTitle: "Column mapping", autoDetect: "Auto-detect", notSet: "Not set" },
    step3: { row: "Row", status: "Status", data: "Data", valid: "Valid", errors: "Errors", warnings: "Warnings", issues: "Issues" },
    step4: { readyTitle: "Ready to import", confirmImport: "Confirm import", importing: "Importing...", doneTitle: "Import complete", backToDashboard: "Back to dashboard" },
    nav: { back: "Back", continue: "Continue" },
    errors: { selectOrg: "Select an organization", emptyFile: "File is empty", readError: "Error reading file" }
  },
  bg: {
    title: "Импорт на данни",
    subtitle: "Импортирайте служители, обучения, медицински прегледи и оборудване",
    steps: { upload: "Качване", mapping: "Съпоставяне", preview: "Преглед", import: "Импорт" },
    types: { employees: "Служители", trainings: "Обучения", medical: "Медицински прегледи", equipment: "Оборудване" },
    fields: { fullName: "Пълно име", jobTitle: "Длъжност", department: "Отдел", hireDate: "Дата на назначаване", corCode: "COR код", phone: "Телефон", employeeName: "Име на служител", trainingType: "Вид обучение", trainingDate: "Дата на обучение", expiryDate: "Дата на изтичане", instructor: "Инструктор", notes: "Бележки", examinationType: "Вид преглед", examinationDate: "Дата на преглед", result: "Резултат", doctor: "Лекар", clinic: "Клиника", restrictions: "Ограничения", equipmentType: "Вид оборудване", serialNumber: "Сериен номер", location: "Местоположение", lastInspection: "Последна инспекция", nextInspection: "Следваща инспекция", description: "Описание" },
    step1: { importTypeLabel: "Вид импорт", organizationLabel: "Организация", uploadLabel: "Файл (CSV/XLSX)", selectFile: "Избери файл", downloadTemplate: "Изтегли шаблон", downloadTemplateFile: "Изтегли", downloadTemplateHint: "Използвайте шаблона за правилен формат" },
    step2: { mappingTitle: "Съпоставяне на колони", autoDetect: "Автоматично разпознаване", notSet: "Не е зададено" },
    step3: { row: "Ред", status: "Статус", data: "Данни", valid: "Валидно", errors: "Грешки", warnings: "Предупреждения", issues: "Проблеми" },
    step4: { readyTitle: "Готово за импорт", confirmImport: "Потвърди импорт", importing: "Импортиране...", doneTitle: "Импортът е завършен", backToDashboard: "Обратно към таблото" },
    nav: { back: "Назад", continue: "Продължи" },
    errors: { selectOrg: "Изберете организация", emptyFile: "Файлът е празен", readError: "Грешка при четене на файл" }
  },
  hu: {
    title: "Adatimport",
    subtitle: "Munkavállalók, képzések, orvosi vizsgálatok és berendezések importálása",
    steps: { upload: "Feltöltés", mapping: "Megfeleltetés", preview: "Előnézet", import: "Import" },
    types: { employees: "Munkavállalók", trainings: "Képzések", medical: "Orvosi vizsgálatok", equipment: "Berendezések" },
    fields: { fullName: "Teljes név", jobTitle: "Beosztás", department: "Részleg", hireDate: "Felvétel dátuma", corCode: "COR kód", phone: "Telefon", employeeName: "Munkavállaló neve", trainingType: "Képzés típusa", trainingDate: "Képzés dátuma", expiryDate: "Lejárat dátuma", instructor: "Oktató", notes: "Megjegyzések", examinationType: "Vizsgálat típusa", examinationDate: "Vizsgálat dátuma", result: "Eredmény", doctor: "Orvos", clinic: "Klinika", restrictions: "Korlátozások", equipmentType: "Berendezés típusa", serialNumber: "Sorozatszám", location: "Helyszín", lastInspection: "Utolsó ellenőrzés", nextInspection: "Következő ellenőrzés", description: "Leírás" },
    step1: { importTypeLabel: "Import típusa", organizationLabel: "Szervezet", uploadLabel: "Fájl (CSV/XLSX)", selectFile: "Fájl kiválasztása", downloadTemplate: "Sablon letöltése", downloadTemplateFile: "Letöltés", downloadTemplateHint: "Használja a sablont a helyes formátumhoz" },
    step2: { mappingTitle: "Oszlopmegfeleltetés", autoDetect: "Automatikus felismerés", notSet: "Nincs beállítva" },
    step3: { row: "Sor", status: "Státusz", data: "Adatok", valid: "Érvényes", errors: "Hibák", warnings: "Figyelmeztetések", issues: "Problémák" },
    step4: { readyTitle: "Importálásra kész", confirmImport: "Import megerősítése", importing: "Importálás...", doneTitle: "Import kész", backToDashboard: "Vissza az irányítópultra" },
    nav: { back: "Vissza", continue: "Folytatás" },
    errors: { selectOrg: "Válasszon szervezetet", emptyFile: "A fájl üres", readError: "Hiba a fájl olvasásakor" }
  },
  de: {
    title: "Datenimport",
    subtitle: "Mitarbeiter, Schulungen, Arbeitsmedizin und Geräte importieren",
    steps: { upload: "Hochladen", mapping: "Zuordnung", preview: "Vorschau", import: "Import" },
    types: { employees: "Mitarbeiter", trainings: "Schulungen", medical: "Arbeitsmedizinische Untersuchungen", equipment: "Geräte" },
    fields: { fullName: "Vollständiger Name", jobTitle: "Berufsbezeichnung", department: "Abteilung", hireDate: "Einstellungsdatum", corCode: "COR-Code", phone: "Telefon", employeeName: "Mitarbeitername", trainingType: "Schulungsart", trainingDate: "Schulungsdatum", expiryDate: "Ablaufdatum", instructor: "Ausbilder", notes: "Anmerkungen", examinationType: "Untersuchungsart", examinationDate: "Untersuchungsdatum", result: "Ergebnis", doctor: "Arzt", clinic: "Klinik", restrictions: "Einschränkungen", equipmentType: "Gerätetyp", serialNumber: "Seriennummer", location: "Standort", lastInspection: "Letzte Inspektion", nextInspection: "Nächste Inspektion", description: "Beschreibung" },
    step1: { importTypeLabel: "Importart", organizationLabel: "Organisation", uploadLabel: "Datei (CSV/XLSX)", selectFile: "Datei auswählen", downloadTemplate: "Vorlage herunterladen", downloadTemplateFile: "Herunterladen", downloadTemplateHint: "Verwenden Sie die Vorlage für das richtige Format" },
    step2: { mappingTitle: "Spaltenzuordnung", autoDetect: "Automatische Erkennung", notSet: "Nicht festgelegt" },
    step3: { row: "Zeile", status: "Status", data: "Daten", valid: "Gültig", errors: "Fehler", warnings: "Warnungen", issues: "Probleme" },
    step4: { readyTitle: "Bereit zum Import", confirmImport: "Import bestätigen", importing: "Importieren...", doneTitle: "Import abgeschlossen", backToDashboard: "Zurück zum Dashboard" },
    nav: { back: "Zurück", continue: "Weiter" },
    errors: { selectOrg: "Organisation auswählen", emptyFile: "Datei ist leer", readError: "Fehler beim Lesen der Datei" }
  },
  pl: {
    title: "Import danych",
    subtitle: "Importuj pracowników, szkolenia, badania lekarskie i sprzęt",
    steps: { upload: "Przesyłanie", mapping: "Mapowanie", preview: "Podgląd", import: "Import" },
    types: { employees: "Pracownicy", trainings: "Szkolenia", medical: "Badania lekarskie", equipment: "Sprzęt" },
    fields: { fullName: "Imię i nazwisko", jobTitle: "Stanowisko", department: "Dział", hireDate: "Data zatrudnienia", corCode: "Kod COR", phone: "Telefon", employeeName: "Imię i nazwisko pracownika", trainingType: "Typ szkolenia", trainingDate: "Data szkolenia", expiryDate: "Data wygaśnięcia", instructor: "Instruktor", notes: "Uwagi", examinationType: "Typ badania", examinationDate: "Data badania", result: "Wynik", doctor: "Lekarz", clinic: "Klinika", restrictions: "Ograniczenia", equipmentType: "Typ sprzętu", serialNumber: "Numer seryjny", location: "Lokalizacja", lastInspection: "Ostatnia inspekcja", nextInspection: "Następna inspekcja", description: "Opis" },
    step1: { importTypeLabel: "Typ importu", organizationLabel: "Organizacja", uploadLabel: "Plik (CSV/XLSX)", selectFile: "Wybierz plik", downloadTemplate: "Pobierz szablon", downloadTemplateFile: "Pobierz", downloadTemplateHint: "Użyj szablonu dla poprawnego formatu" },
    step2: { mappingTitle: "Mapowanie kolumn", autoDetect: "Automatyczne wykrywanie", notSet: "Nie ustawiono" },
    step3: { row: "Wiersz", status: "Status", data: "Dane", valid: "Prawidłowe", errors: "Błędy", warnings: "Ostrzeżenia", issues: "Problemy" },
    step4: { readyTitle: "Gotowe do importu", confirmImport: "Potwierdź import", importing: "Importowanie...", doneTitle: "Import zakończony", backToDashboard: "Powrót do pulpitu" },
    nav: { back: "Wstecz", continue: "Dalej" },
    errors: { selectOrg: "Wybierz organizację", emptyFile: "Plik jest pusty", readError: "Błąd podczas odczytu pliku" }
  }
};

// ─── IMPORT WIZARD ────────────────────────────────────────────────────────────

const importWizard = {
  ro: {
    header: { title: "Import Wizard", organization: "Organizație", dashboard: "Dashboard" },
    fields: { firstName: "Prenume", lastName: "Nume", jobTitle: "Funcție", department: "Departament", hireDate: "Data angajării", contractEndDate: "Data sfârșit contract", phone: "Telefon", corCode: "Cod COR", corTitle: "Denumire COR", contractNumber: "Nr. contract", contractType: "Tip contract", status: "Status" },
    step1: { title: "Încarcă fișier", description: "Selectează fișierul CSV sau XLSX pentru import", selectFile: "Selectează fișier", dropZoneTitle: "Trage fișierul aici sau click pentru selectare", dropZoneFormats: "Formate acceptate: CSV, XLSX, XLS", previewTitle: "Previzualizare", rowsDetected: "rânduri detectate", headerOnRow: "Header pe rândul" },
    step2: { title: "Selectează profil", description: "Alege profilul de import potrivit", manualTitle: "Manual", manualDesc: "Mapare manuală a coloanelor", regesSalariatiTitle: "REGES Salariați", regesSalariatiDesc: "Export date personale angajați din REGES Online", regesContracteTitle: "REGES Contracte", regesContracteDesc: "Export contracte de muncă din REGES Online", regesNote: "Profilul REGES detectează automat coloanele standard" },
    step3: { title: "Mapare coloane", description: "Asociază coloanele din fișier cu câmpurile din sistem", ignoreOption: "— Ignoră —", validateButton: "Validează", previewLabel: "Previzualizare mapare", previewDesc: "Verifică dacă maparea este corectă" },
    step4: { title: "Validare și import", importButton: "Importă", selectAll: "Selectează tot", deselectAll: "Deselectează tot", autoMapping: "Mapare automată", previewTitle: "Previzualizare date", mappingCount: "coloane mapate", colFullName: "Nume complet", statsDetected: "Detectate", statsValid: "Valide", statsErrors: "Erori", statsWarnings: "Avertizări", validationList: "Lista validări" },
    step5: { importing: "Se importă...", done: "Import finalizat!", progressLabel: "Progres", successCount: "Importate cu succes", failedCount: "Eșuate", profileUsed: "Profil folosit", viewEmployees: "Vezi angajații" },
    nav: { back: "Înapoi", newImport: "Import nou" },
    validation: { firstNameRequired: "Prenumele este obligatoriu", lastNameRequired: "Numele este obligatoriu", cnpInvalid: "CNP invalid", cnpDuplicate: "CNP duplicat în fișier", cnpExistsInOrg: "CNP există deja în organizație", emailInvalid: "Email invalid", hireDateInvalid: "Data angajării invalidă", corCodeFormat: "Format cod COR invalid" },
    errors: { emptyFile: "Fișierul este gol", readError: "Eroare la citire fișier" }
  },
  en: {
    header: { title: "Import Wizard", organization: "Organization", dashboard: "Dashboard" },
    fields: { firstName: "First name", lastName: "Last name", jobTitle: "Job title", department: "Department", hireDate: "Hire date", contractEndDate: "Contract end date", phone: "Phone", corCode: "COR code", corTitle: "COR title", contractNumber: "Contract no.", contractType: "Contract type", status: "Status" },
    step1: { title: "Upload file", description: "Select CSV or XLSX file for import", selectFile: "Select file", dropZoneTitle: "Drag file here or click to select", dropZoneFormats: "Accepted formats: CSV, XLSX, XLS", previewTitle: "Preview", rowsDetected: "rows detected", headerOnRow: "Header on row" },
    step2: { title: "Select profile", description: "Choose the appropriate import profile", manualTitle: "Manual", manualDesc: "Manual column mapping", regesSalariatiTitle: "REGES Employees", regesSalariatiDesc: "Employee personal data export from REGES Online", regesContracteTitle: "REGES Contracts", regesContracteDesc: "Employment contracts export from REGES Online", regesNote: "REGES profile auto-detects standard columns" },
    step3: { title: "Column mapping", description: "Map file columns to system fields", ignoreOption: "— Ignore —", validateButton: "Validate", previewLabel: "Mapping preview", previewDesc: "Verify mapping is correct" },
    step4: { title: "Validation and import", importButton: "Import", selectAll: "Select all", deselectAll: "Deselect all", autoMapping: "Auto mapping", previewTitle: "Data preview", mappingCount: "columns mapped", colFullName: "Full name", statsDetected: "Detected", statsValid: "Valid", statsErrors: "Errors", statsWarnings: "Warnings", validationList: "Validation list" },
    step5: { importing: "Importing...", done: "Import complete!", progressLabel: "Progress", successCount: "Successfully imported", failedCount: "Failed", profileUsed: "Profile used", viewEmployees: "View employees" },
    nav: { back: "Back", newImport: "New import" },
    validation: { firstNameRequired: "First name is required", lastNameRequired: "Last name is required", cnpInvalid: "Invalid CNP", cnpDuplicate: "Duplicate CNP in file", cnpExistsInOrg: "CNP already exists in organization", emailInvalid: "Invalid email", hireDateInvalid: "Invalid hire date", corCodeFormat: "Invalid COR code format" },
    errors: { emptyFile: "File is empty", readError: "Error reading file" }
  },
  bg: {
    header: { title: "Import Wizard", organization: "Организация", dashboard: "Табло" },
    fields: { firstName: "Собствено име", lastName: "Фамилно име", jobTitle: "Длъжност", department: "Отдел", hireDate: "Дата на назначаване", contractEndDate: "Дата на прекратяване на договора", phone: "Телефон", corCode: "COR код", corTitle: "COR наименование", contractNumber: "№ на договор", contractType: "Вид договор", status: "Статус" },
    step1: { title: "Качи файл", description: "Изберете CSV или XLSX файл за импорт", selectFile: "Избери файл", dropZoneTitle: "Плъзнете файл тук или кликнете за избор", dropZoneFormats: "Приети формати: CSV, XLSX, XLS", previewTitle: "Преглед", rowsDetected: "открити реда", headerOnRow: "Заглавие на ред" },
    step2: { title: "Избери профил", description: "Изберете подходящия профил за импорт", manualTitle: "Ръчно", manualDesc: "Ръчно съпоставяне на колони", regesSalariatiTitle: "REGES Служители", regesSalariatiDesc: "Експорт на лични данни на служители от REGES Online", regesContracteTitle: "REGES Договори", regesContracteDesc: "Експорт на трудови договори от REGES Online", regesNote: "Профилът REGES автоматично разпознава стандартните колони" },
    step3: { title: "Съпоставяне на колони", description: "Свържете колоните от файла с полетата в системата", ignoreOption: "— Игнорирай —", validateButton: "Валидирай", previewLabel: "Преглед на съпоставянето", previewDesc: "Проверете дали съпоставянето е правилно" },
    step4: { title: "Валидиране и импорт", importButton: "Импортирай", selectAll: "Избери всички", deselectAll: "Отмени избора на всички", autoMapping: "Автоматично съпоставяне", previewTitle: "Преглед на данните", mappingCount: "съпоставени колони", colFullName: "Пълно име", statsDetected: "Открити", statsValid: "Валидни", statsErrors: "Грешки", statsWarnings: "Предупреждения", validationList: "Списък за валидиране" },
    step5: { importing: "Импортиране...", done: "Импортът е завършен!", progressLabel: "Напредък", successCount: "Успешно импортирани", failedCount: "Неуспешни", profileUsed: "Използван профил", viewEmployees: "Виж служителите" },
    nav: { back: "Назад", newImport: "Нов импорт" },
    validation: { firstNameRequired: "Собственото име е задължително", lastNameRequired: "Фамилното име е задължително", cnpInvalid: "Невалиден CNP", cnpDuplicate: "Дублиран CNP във файла", cnpExistsInOrg: "CNP вече съществува в организацията", emailInvalid: "Невалиден имейл", hireDateInvalid: "Невалидна дата на назначаване", corCodeFormat: "Невалиден формат на COR код" },
    errors: { emptyFile: "Файлът е празен", readError: "Грешка при четене на файл" }
  },
  hu: {
    header: { title: "Import Wizard", organization: "Szervezet", dashboard: "Irányítópult" },
    fields: { firstName: "Keresztnév", lastName: "Vezetéknév", jobTitle: "Beosztás", department: "Részleg", hireDate: "Felvétel dátuma", contractEndDate: "Szerződés vége", phone: "Telefon", corCode: "COR kód", corTitle: "COR megnevezés", contractNumber: "Szerződés száma", contractType: "Szerződés típusa", status: "Státusz" },
    step1: { title: "Fájl feltöltése", description: "Válasszon CSV vagy XLSX fájlt az importáláshoz", selectFile: "Fájl kiválasztása", dropZoneTitle: "Húzza ide a fájlt, vagy kattintson a kiválasztáshoz", dropZoneFormats: "Elfogadott formátumok: CSV, XLSX, XLS", previewTitle: "Előnézet", rowsDetected: "sor érzékelve", headerOnRow: "Fejléc a soron" },
    step2: { title: "Profil kiválasztása", description: "Válassza ki a megfelelő importálási profilt", manualTitle: "Manuális", manualDesc: "Manuális oszlopmegfeleltetés", regesSalariatiTitle: "REGES Munkavállalók", regesSalariatiDesc: "Munkavállalói személyes adatok exportálása a REGES Online-ból", regesContracteTitle: "REGES Szerződések", regesContracteDesc: "Munkaszerződések exportálása a REGES Online-ból", regesNote: "A REGES profil automatikusan felismeri a standard oszlopokat" },
    step3: { title: "Oszlopmegfeleltetés", description: "Fájloszlopok hozzárendelése a rendszer mezőihez", ignoreOption: "— Figyelmen kívül hagy —", validateButton: "Érvényesítés", previewLabel: "Megfeleltetés előnézete", previewDesc: "Ellenőrizze, hogy a megfeleltetés helyes-e" },
    step4: { title: "Érvényesítés és importálás", importButton: "Importálás", selectAll: "Összes kiválasztása", deselectAll: "Kijelölés megszüntetése", autoMapping: "Automatikus megfeleltetés", previewTitle: "Adatok előnézete", mappingCount: "oszlop hozzárendelve", colFullName: "Teljes név", statsDetected: "Érzékelt", statsValid: "Érvényes", statsErrors: "Hibák", statsWarnings: "Figyelmeztetések", validationList: "Érvényesítési lista" },
    step5: { importing: "Importálás...", done: "Import kész!", progressLabel: "Haladás", successCount: "Sikeresen importálva", failedCount: "Sikertelen", profileUsed: "Használt profil", viewEmployees: "Munkavállalók megtekintése" },
    nav: { back: "Vissza", newImport: "Új import" },
    validation: { firstNameRequired: "A keresztnév kötelező", lastNameRequired: "A vezetéknév kötelező", cnpInvalid: "Érvénytelen CNP", cnpDuplicate: "Duplikált CNP a fájlban", cnpExistsInOrg: "A CNP már létezik a szervezetben", emailInvalid: "Érvénytelen e-mail", hireDateInvalid: "Érvénytelen felvételi dátum", corCodeFormat: "Érvénytelen COR kódformátum" },
    errors: { emptyFile: "A fájl üres", readError: "Hiba a fájl olvasásakor" }
  },
  de: {
    header: { title: "Import Wizard", organization: "Organisation", dashboard: "Dashboard" },
    fields: { firstName: "Vorname", lastName: "Nachname", jobTitle: "Berufsbezeichnung", department: "Abteilung", hireDate: "Einstellungsdatum", contractEndDate: "Vertragsende", phone: "Telefon", corCode: "COR-Code", corTitle: "COR-Bezeichnung", contractNumber: "Vertragsnummer", contractType: "Vertragsart", status: "Status" },
    step1: { title: "Datei hochladen", description: "CSV- oder XLSX-Datei für den Import auswählen", selectFile: "Datei auswählen", dropZoneTitle: "Datei hierher ziehen oder klicken zum Auswählen", dropZoneFormats: "Akzeptierte Formate: CSV, XLSX, XLS", previewTitle: "Vorschau", rowsDetected: "Zeilen erkannt", headerOnRow: "Kopfzeile in Zeile" },
    step2: { title: "Profil auswählen", description: "Geeignetes Importprofil auswählen", manualTitle: "Manuell", manualDesc: "Manuelle Spaltenzuordnung", regesSalariatiTitle: "REGES Mitarbeiter", regesSalariatiDesc: "Export von Mitarbeiterpersonaldaten aus REGES Online", regesContracteTitle: "REGES Verträge", regesContracteDesc: "Export von Arbeitsverträgen aus REGES Online", regesNote: "Das REGES-Profil erkennt Standardspalten automatisch" },
    step3: { title: "Spaltenzuordnung", description: "Dateispalten den Systemfeldern zuordnen", ignoreOption: "— Ignorieren —", validateButton: "Validieren", previewLabel: "Zuordnungsvorschau", previewDesc: "Überprüfen Sie die Zuordnung" },
    step4: { title: "Validierung und Import", importButton: "Importieren", selectAll: "Alle auswählen", deselectAll: "Auswahl aufheben", autoMapping: "Automatische Zuordnung", previewTitle: "Datenvorschau", mappingCount: "Spalten zugeordnet", colFullName: "Vollständiger Name", statsDetected: "Erkannt", statsValid: "Gültig", statsErrors: "Fehler", statsWarnings: "Warnungen", validationList: "Validierungsliste" },
    step5: { importing: "Importieren...", done: "Import abgeschlossen!", progressLabel: "Fortschritt", successCount: "Erfolgreich importiert", failedCount: "Fehlgeschlagen", profileUsed: "Verwendetes Profil", viewEmployees: "Mitarbeiter anzeigen" },
    nav: { back: "Zurück", newImport: "Neuer Import" },
    validation: { firstNameRequired: "Vorname ist erforderlich", lastNameRequired: "Nachname ist erforderlich", cnpInvalid: "Ungültige CNP", cnpDuplicate: "Doppelte CNP in der Datei", cnpExistsInOrg: "CNP existiert bereits in der Organisation", emailInvalid: "Ungültige E-Mail", hireDateInvalid: "Ungültiges Einstellungsdatum", corCodeFormat: "Ungültiges COR-Codeformat" },
    errors: { emptyFile: "Datei ist leer", readError: "Fehler beim Lesen der Datei" }
  },
  pl: {
    header: { title: "Import Wizard", organization: "Organizacja", dashboard: "Pulpit" },
    fields: { firstName: "Imię", lastName: "Nazwisko", jobTitle: "Stanowisko", department: "Dział", hireDate: "Data zatrudnienia", contractEndDate: "Data zakończenia umowy", phone: "Telefon", corCode: "Kod COR", corTitle: "Nazwa COR", contractNumber: "Nr umowy", contractType: "Typ umowy", status: "Status" },
    step1: { title: "Prześlij plik", description: "Wybierz plik CSV lub XLSX do importu", selectFile: "Wybierz plik", dropZoneTitle: "Przeciągnij plik tutaj lub kliknij, aby wybrać", dropZoneFormats: "Akceptowane formaty: CSV, XLSX, XLS", previewTitle: "Podgląd", rowsDetected: "wykrytych wierszy", headerOnRow: "Nagłówek w wierszu" },
    step2: { title: "Wybierz profil", description: "Wybierz odpowiedni profil importu", manualTitle: "Ręcznie", manualDesc: "Ręczne mapowanie kolumn", regesSalariatiTitle: "REGES Pracownicy", regesSalariatiDesc: "Eksport danych osobowych pracowników z REGES Online", regesContracteTitle: "REGES Umowy", regesContracteDesc: "Eksport umów o pracę z REGES Online", regesNote: "Profil REGES automatycznie wykrywa standardowe kolumny" },
    step3: { title: "Mapowanie kolumn", description: "Przypisz kolumny pliku do pól systemu", ignoreOption: "— Ignoruj —", validateButton: "Waliduj", previewLabel: "Podgląd mapowania", previewDesc: "Sprawdź, czy mapowanie jest poprawne" },
    step4: { title: "Walidacja i import", importButton: "Importuj", selectAll: "Zaznacz wszystko", deselectAll: "Odznacz wszystko", autoMapping: "Automatyczne mapowanie", previewTitle: "Podgląd danych", mappingCount: "zmapowanych kolumn", colFullName: "Imię i nazwisko", statsDetected: "Wykryte", statsValid: "Prawidłowe", statsErrors: "Błędy", statsWarnings: "Ostrzeżenia", validationList: "Lista walidacji" },
    step5: { importing: "Importowanie...", done: "Import zakończony!", progressLabel: "Postęp", successCount: "Zaimportowano pomyślnie", failedCount: "Nieudane", profileUsed: "Użyty profil", viewEmployees: "Zobacz pracowników" },
    nav: { back: "Wstecz", newImport: "Nowy import" },
    validation: { firstNameRequired: "Imię jest wymagane", lastNameRequired: "Nazwisko jest wymagane", cnpInvalid: "Nieprawidłowy CNP", cnpDuplicate: "Zduplikowany CNP w pliku", cnpExistsInOrg: "CNP już istnieje w organizacji", emailInvalid: "Nieprawidłowy e-mail", hireDateInvalid: "Nieprawidłowa data zatrudnienia", corCodeFormat: "Nieprawidłowy format kodu COR" },
    errors: { emptyFile: "Plik jest pusty", readError: "Błąd podczas odczytu pliku" }
  }
};

// ─── MODULES ──────────────────────────────────────────────────────────────────

const modules = {
  ro: {
    title: "Module",
    subtitle: "Module OP-LEGO disponibile pentru organizația ta",
    breadcrumb: "Module",
    section: { core: "Module de bază", standalone: "Module standard", premium: "Module premium" },
    status: { active: "Activ", trial: "Trial", suspended: "Suspendat", inactive: "Inactiv" },
    category: { core: "Inclus", standalone: "Standard", premium: "Premium" },
    stats: { active: "Active", trial: "Trial", available: "Disponibile" },
    card: { activeSince: "Activ din", trialExpires: "Trial expiră", contactAdmin: "Contactează administratorul" },
    info: { title: "Module OP-LEGO", message: "Activează modulele de care ai nevoie. Fiecare modul adaugă funcționalități specifice." },
    footer: { title: "Ai nevoie de mai multe module?", message: "Contactează-ne pentru un plan personalizat.", contactButton: "Contactează-ne" }
  },
  en: {
    title: "Modules",
    subtitle: "OP-LEGO modules available for your organization",
    breadcrumb: "Modules",
    section: { core: "Core modules", standalone: "Standard modules", premium: "Premium modules" },
    status: { active: "Active", trial: "Trial", suspended: "Suspended", inactive: "Inactive" },
    category: { core: "Included", standalone: "Standard", premium: "Premium" },
    stats: { active: "Active", trial: "Trial", available: "Available" },
    card: { activeSince: "Active since", trialExpires: "Trial expires", contactAdmin: "Contact administrator" },
    info: { title: "OP-LEGO Modules", message: "Activate the modules you need. Each module adds specific functionality." },
    footer: { title: "Need more modules?", message: "Contact us for a customized plan.", contactButton: "Contact us" }
  },
  bg: {
    title: "Модули",
    subtitle: "Налични OP-LEGO модули за вашата организация",
    breadcrumb: "Модули",
    section: { core: "Основни модули", standalone: "Стандартни модули", premium: "Премиум модули" },
    status: { active: "Активен", trial: "Trial", suspended: "Спрян", inactive: "Неактивен" },
    category: { core: "Включен", standalone: "Стандартен", premium: "Премиум" },
    stats: { active: "Активни", trial: "Trial", available: "Налични" },
    card: { activeSince: "Активен от", trialExpires: "Trial изтича", contactAdmin: "Свържете се с администратора" },
    info: { title: "OP-LEGO модули", message: "Активирайте необходимите модули. Всеки модул добавя специфични функционалности." },
    footer: { title: "Нуждаете се от повече модули?", message: "Свържете се с нас за персонализиран план.", contactButton: "Свържете се с нас" }
  },
  hu: {
    title: "Modulok",
    subtitle: "Az OP-LEGO modulok elérhetők az Ön szervezete számára",
    breadcrumb: "Modulok",
    section: { core: "Alap modulok", standalone: "Standard modulok", premium: "Prémium modulok" },
    status: { active: "Aktív", trial: "Trial", suspended: "Felfüggesztett", inactive: "Inaktív" },
    category: { core: "Belefoglalt", standalone: "Standard", premium: "Prémium" },
    stats: { active: "Aktív", trial: "Trial", available: "Elérhető" },
    card: { activeSince: "Aktív óta", trialExpires: "Trial lejár", contactAdmin: "Kapcsolatfelvétel az adminisztrátorral" },
    info: { title: "OP-LEGO modulok", message: "Aktiválja a szükséges modulokat. Minden modul specifikus funkcionalitást ad hozzá." },
    footer: { title: "Több modulra van szüksége?", message: "Vegye fel velünk a kapcsolatot egy személyre szabott tervért.", contactButton: "Kapcsolatfelvétel" }
  },
  de: {
    title: "Module",
    subtitle: "Für Ihre Organisation verfügbare OP-LEGO-Module",
    breadcrumb: "Module",
    section: { core: "Kernmodule", standalone: "Standardmodule", premium: "Premium-Module" },
    status: { active: "Aktiv", trial: "Trial", suspended: "Gesperrt", inactive: "Inaktiv" },
    category: { core: "Enthalten", standalone: "Standard", premium: "Premium" },
    stats: { active: "Aktiv", trial: "Trial", available: "Verfügbar" },
    card: { activeSince: "Aktiv seit", trialExpires: "Trial läuft ab", contactAdmin: "Administrator kontaktieren" },
    info: { title: "OP-LEGO-Module", message: "Aktivieren Sie die benötigten Module. Jedes Modul fügt spezifische Funktionen hinzu." },
    footer: { title: "Benötigen Sie mehr Module?", message: "Kontaktieren Sie uns für einen individuellen Plan.", contactButton: "Kontakt aufnehmen" }
  },
  pl: {
    title: "Moduły",
    subtitle: "Moduły OP-LEGO dostępne dla Twojej organizacji",
    breadcrumb: "Moduły",
    section: { core: "Moduły podstawowe", standalone: "Moduły standardowe", premium: "Moduły premium" },
    status: { active: "Aktywny", trial: "Trial", suspended: "Zawieszony", inactive: "Nieaktywny" },
    category: { core: "W zestawie", standalone: "Standardowy", premium: "Premium" },
    stats: { active: "Aktywne", trial: "Trial", available: "Dostępne" },
    card: { activeSince: "Aktywny od", trialExpires: "Trial wygasa", contactAdmin: "Skontaktuj się z administratorem" },
    info: { title: "Moduły OP-LEGO", message: "Aktywuj potrzebne moduły. Każdy moduł dodaje określone funkcjonalności." },
    footer: { title: "Potrzebujesz więcej modułów?", message: "Skontaktuj się z nami w sprawie spersonalizowanego planu.", contactButton: "Skontaktuj się" }
  }
};

// ─── MERGE & WRITE ────────────────────────────────────────────────────────────

const locales = ['ro', 'en', 'bg', 'hu', 'de', 'pl'];
let totalAdded = 0;

for (const locale of locales) {
  const filePath = path.join(messagesDir, `${locale}.json`);
  const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const added = [];

  if (!existing.dataImport) {
    existing.dataImport = dataImport[locale];
    added.push('dataImport');
  } else {
    console.log(`  [SKIP] ${locale}.json already has "dataImport"`);
  }

  if (!existing.importWizard) {
    existing.importWizard = importWizard[locale];
    added.push('importWizard');
  } else {
    console.log(`  [SKIP] ${locale}.json already has "importWizard"`);
  }

  if (!existing.modules) {
    existing.modules = modules[locale];
    added.push('modules');
  } else {
    console.log(`  [SKIP] ${locale}.json already has "modules"`);
  }

  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2) + '\n', 'utf8');

  if (added.length > 0) {
    console.log(`✓ ${locale}.json — added: ${added.join(', ')}`);
    totalAdded += added.length;
  } else {
    console.log(`  ${locale}.json — nothing new to add`);
  }
}

console.log(`\nDone. Total namespaces added: ${totalAdded}`);
