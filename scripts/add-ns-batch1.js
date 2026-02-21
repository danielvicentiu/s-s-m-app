#!/usr/bin/env node
// scripts/add-ns-batch1.js
// Adds gdpr, medical, iscir namespaces to all 6 messages/*.json files

const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '..', 'messages');

// ─── GDPR ────────────────────────────────────────────────────────────────────

const gdpr = {
  ro: {
    title: "GDPR - Protecția Datelor",
    subtitle: "Registru prelucrări, consimțăminte și DPO",
    tabs: { processingRegistry: "Registru Prelucrări", consents: "Consimțăminte" },
    stats: { processingActivities: "Activități prelucrare", activeConsents: "Consimțăminte active", dpoConfigured: "DPO configurat", dpoNotConfigured: "DPO neconfigurat", dpiaRequired: "DPIA necesară" },
    legalBasis: { consent: "Consimțământ", contract: "Contract", legalObligation: "Obligație legală", vitalInterest: "Interes vital", publicInterest: "Interes public", legitimateInterest: "Interes legitim" },
    consentType: { processing: "Prelucrare date", marketing: "Marketing", profiling: "Profilare", transfer: "Transfer date", specialCategories: "Categorii speciale", other: "Altele" },
    status: { active: "Activ", inactive: "Inactiv", underReview: "În revizuire", archived: "Arhivat" },
    filter: { all: "Toate", active: "Active", withdrawn: "Retrase", allStatuses: "Toate statusurile", allLegalBases: "Toate bazele legale" },
    processing: { addActivity: "Adaugă activitate", newTitle: "Activitate nouă", editTitle: "Editează activitate", emptyTitle: "Nicio activitate", emptyMessage: "Adaugă prima activitate de prelucrare.", searchPlaceholder: "Caută activități...", activityNameLabel: "Denumire activitate", activityNamePlaceholder: "ex: Prelucrare date angajați", purposeLabel: "Scop", purposePlaceholder: "ex: Gestiune resurse umane", legalBasisLabel: "Bază legală", statusLabel: "Status", dataSubjectsLabel: "Subiecți date", dataSubjectsPlaceholder: "ex: Angajați, candidați", dataCategoriesLabel: "Categorii date", dataCategoriesPlaceholder: "ex: Date identificare, contact", retentionPeriodLabel: "Perioadă retenție", retentionPeriodPlaceholder: "ex: 5 ani", crossBorderTransfer: "Transfer transfrontalier", dpiaRequired: "DPIA necesară", dpiaCompleted: "DPIA finalizată", dpiaDateLabel: "Data DPIA" },
    consent: { addConsent: "Adaugă consimțământ", newTitle: "Consimțământ nou", editTitle: "Editează consimțământ", emptyTitle: "Niciun consimțământ", emptyMessage: "Adaugă primul consimțământ.", searchPlaceholder: "Caută consimțăminte...", personNameLabel: "Nume persoană", personNamePlaceholder: "ex: Ion Popescu", emailLabel: "Email", typeLabel: "Tip consimțământ", purposeLabel: "Scop", purposePlaceholder: "ex: Newsletter marketing", givenAtLabel: "Data acordare", notesLabel: "Observații", notesPlaceholder: "Observații suplimentare...", withdraw: "Retrage", withdrawTitle: "Retrage consimțământ", active: "Activ", withdrawn: "Retras" },
    dpo: { title: "Responsabil Protecția Datelor (DPO)", subtitle: "Configurare DPO intern sau extern", typeLabel: "Tip DPO", internal: "Intern", external: "Extern", nameLabel: "Nume DPO", namePlaceholder: "ex: Maria Ionescu", emailLabel: "Email", phoneLabel: "Telefon", companyLabel: "Companie (dacă extern)", companyPlaceholder: "ex: DPO Consulting SRL", appointmentDateLabel: "Data numirii", contractExpiryLabel: "Expirare contract", anspdcpNotified: "ANSPDCP notificat", anspdcpNotificationDateLabel: "Data notificării", notesLabel: "Observații", notesPlaceholder: "Informații suplimentare...", save: "Salvează", saving: "Se salvează...", savedSuccess: "DPO salvat cu succes!" },
    table: { activity: "Activitate", legalBasis: "Bază legală", status: "Status", actions: "Acțiuni", person: "Persoană", type: "Tip", purpose: "Scop", givenAt: "Data acordare" },
    actions: { edit: "Editează", delete: "Șterge", cancel: "Anulează", create: "Creează", update: "Actualizează" },
    confirm: { deleteTitle: "Confirmi ștergerea?", deleteProcessingMessage: "Activitatea de prelucrare va fi ștearsă definitiv.", deleteConsentMessage: "Consimțământul va fi șters definitiv." },
    errors: { createError: "Eroare la creare", updateError: "Eroare la actualizare", deleteError: "Eroare la ștergere", saveError: "Eroare la salvare", withdrawError: "Eroare la retragere consimțământ" }
  },
  en: {
    title: "GDPR - Data Protection",
    subtitle: "Processing registry, consents and DPO",
    tabs: { processingRegistry: "Processing Registry", consents: "Consents" },
    stats: { processingActivities: "Processing activities", activeConsents: "Active consents", dpoConfigured: "DPO configured", dpoNotConfigured: "DPO not configured", dpiaRequired: "DPIA required" },
    legalBasis: { consent: "Consent", contract: "Contract", legalObligation: "Legal obligation", vitalInterest: "Vital interest", publicInterest: "Public interest", legitimateInterest: "Legitimate interest" },
    consentType: { processing: "Data processing", marketing: "Marketing", profiling: "Profiling", transfer: "Data transfer", specialCategories: "Special categories", other: "Other" },
    status: { active: "Active", inactive: "Inactive", underReview: "Under review", archived: "Archived" },
    filter: { all: "All", active: "Active", withdrawn: "Withdrawn", allStatuses: "All statuses", allLegalBases: "All legal bases" },
    processing: { addActivity: "Add activity", newTitle: "New activity", editTitle: "Edit activity", emptyTitle: "No activities", emptyMessage: "Add the first processing activity.", searchPlaceholder: "Search activities...", activityNameLabel: "Activity name", activityNamePlaceholder: "e.g.: Employee data processing", purposeLabel: "Purpose", purposePlaceholder: "e.g.: Human resources management", legalBasisLabel: "Legal basis", statusLabel: "Status", dataSubjectsLabel: "Data subjects", dataSubjectsPlaceholder: "e.g.: Employees, candidates", dataCategoriesLabel: "Data categories", dataCategoriesPlaceholder: "e.g.: Identification data, contact", retentionPeriodLabel: "Retention period", retentionPeriodPlaceholder: "e.g.: 5 years", crossBorderTransfer: "Cross-border transfer", dpiaRequired: "DPIA required", dpiaCompleted: "DPIA completed", dpiaDateLabel: "DPIA date" },
    consent: { addConsent: "Add consent", newTitle: "New consent", editTitle: "Edit consent", emptyTitle: "No consents", emptyMessage: "Add the first consent.", searchPlaceholder: "Search consents...", personNameLabel: "Person name", personNamePlaceholder: "e.g.: John Smith", emailLabel: "Email", typeLabel: "Consent type", purposeLabel: "Purpose", purposePlaceholder: "e.g.: Marketing newsletter", givenAtLabel: "Given at", notesLabel: "Notes", notesPlaceholder: "Additional notes...", withdraw: "Withdraw", withdrawTitle: "Withdraw consent", active: "Active", withdrawn: "Withdrawn" },
    dpo: { title: "Data Protection Officer (DPO)", subtitle: "Internal or external DPO configuration", typeLabel: "DPO type", internal: "Internal", external: "External", nameLabel: "DPO name", namePlaceholder: "e.g.: John Smith", emailLabel: "Email", phoneLabel: "Phone", companyLabel: "Company (if external)", companyPlaceholder: "e.g.: DPO Consulting Ltd", appointmentDateLabel: "Appointment date", contractExpiryLabel: "Contract expiry", anspdcpNotified: "ANSPDCP notified", anspdcpNotificationDateLabel: "Notification date", notesLabel: "Notes", notesPlaceholder: "Additional information...", save: "Save", saving: "Saving...", savedSuccess: "DPO saved successfully!" },
    table: { activity: "Activity", legalBasis: "Legal basis", status: "Status", actions: "Actions", person: "Person", type: "Type", purpose: "Purpose", givenAt: "Given at" },
    actions: { edit: "Edit", delete: "Delete", cancel: "Cancel", create: "Create", update: "Update" },
    confirm: { deleteTitle: "Confirm deletion?", deleteProcessingMessage: "The processing activity will be permanently deleted.", deleteConsentMessage: "The consent will be permanently deleted." },
    errors: { createError: "Error creating", updateError: "Error updating", deleteError: "Error deleting", saveError: "Error saving", withdrawError: "Error withdrawing consent" }
  },
  bg: {
    title: "GDPR - Защита на данните",
    subtitle: "Регистър за обработване, съгласия и DPO",
    tabs: { processingRegistry: "Регистър за обработване", consents: "Съгласия" },
    stats: { processingActivities: "Дейности по обработване", activeConsents: "Активни съгласия", dpoConfigured: "DPO конфигуриран", dpoNotConfigured: "DPO не е конфигуриран", dpiaRequired: "DPIA задължителна" },
    legalBasis: { consent: "Съгласие", contract: "Договор", legalObligation: "Правно задължение", vitalInterest: "Жизненоважен интерес", publicInterest: "Обществен интерес", legitimateInterest: "Легитимен интерес" },
    consentType: { processing: "Обработване на данни", marketing: "Маркетинг", profiling: "Профилиране", transfer: "Прехвърляне на данни", specialCategories: "Специални категории", other: "Друго" },
    status: { active: "Активен", inactive: "Неактивен", underReview: "В преглед", archived: "Архивиран" },
    filter: { all: "Всички", active: "Активни", withdrawn: "Оттеглени", allStatuses: "Всички статуси", allLegalBases: "Всички правни основания" },
    processing: { addActivity: "Добави дейност", newTitle: "Нова дейност", editTitle: "Редактирай дейност", emptyTitle: "Няма дейности", emptyMessage: "Добавете първата дейност по обработване.", searchPlaceholder: "Търси дейности...", activityNameLabel: "Наименование на дейността", activityNamePlaceholder: "напр.: Обработване на данни на служители", purposeLabel: "Цел", purposePlaceholder: "напр.: Управление на човешки ресурси", legalBasisLabel: "Правно основание", statusLabel: "Статус", dataSubjectsLabel: "Субекти на данни", dataSubjectsPlaceholder: "напр.: Служители, кандидати", dataCategoriesLabel: "Категории данни", dataCategoriesPlaceholder: "напр.: Данни за идентификация, контакт", retentionPeriodLabel: "Период на съхранение", retentionPeriodPlaceholder: "напр.: 5 години", crossBorderTransfer: "Трансгранично предаване", dpiaRequired: "DPIA задължителна", dpiaCompleted: "DPIA завършена", dpiaDateLabel: "Дата на DPIA" },
    consent: { addConsent: "Добави съгласие", newTitle: "Ново съгласие", editTitle: "Редактирай съгласие", emptyTitle: "Няма съгласия", emptyMessage: "Добавете първото съгласие.", searchPlaceholder: "Търси съгласия...", personNameLabel: "Име на лицето", personNamePlaceholder: "напр.: Иван Петров", emailLabel: "Имейл", typeLabel: "Вид съгласие", purposeLabel: "Цел", purposePlaceholder: "напр.: Маркетингов бюлетин", givenAtLabel: "Дата на предоставяне", notesLabel: "Бележки", notesPlaceholder: "Допълнителни бележки...", withdraw: "Оттегли", withdrawTitle: "Оттегли съгласие", active: "Активно", withdrawn: "Оттеглено" },
    dpo: { title: "Длъжностно лице по защита на данните (DPO)", subtitle: "Конфигурация на вътрешен или външен DPO", typeLabel: "Вид DPO", internal: "Вътрешен", external: "Външен", nameLabel: "Име на DPO", namePlaceholder: "напр.: Мария Иванова", emailLabel: "Имейл", phoneLabel: "Телефон", companyLabel: "Компания (ако е външен)", companyPlaceholder: "напр.: DPO Consulting ЕООД", appointmentDateLabel: "Дата на назначаване", contractExpiryLabel: "Изтичане на договора", anspdcpNotified: "ANSPDCP уведомен", anspdcpNotificationDateLabel: "Дата на уведомяване", notesLabel: "Бележки", notesPlaceholder: "Допълнителна информация...", save: "Запази", saving: "Запазване...", savedSuccess: "DPO е запазен успешно!" },
    table: { activity: "Дейност", legalBasis: "Правно основание", status: "Статус", actions: "Действия", person: "Лице", type: "Вид", purpose: "Цел", givenAt: "Дата на предоставяне" },
    actions: { edit: "Редактирай", delete: "Изтрий", cancel: "Откажи", create: "Създай", update: "Актуализирай" },
    confirm: { deleteTitle: "Потвърждавате изтриването?", deleteProcessingMessage: "Дейността по обработване ще бъде изтрита окончателно.", deleteConsentMessage: "Съгласието ще бъде изтрито окончателно." },
    errors: { createError: "Грешка при създаване", updateError: "Грешка при актуализиране", deleteError: "Грешка при изтриване", saveError: "Грешка при запазване", withdrawError: "Грешка при оттегляне на съгласие" }
  },
  hu: {
    title: "GDPR - Adatvédelem",
    subtitle: "Adatkezelési nyilvántartás, hozzájárulások és DPO",
    tabs: { processingRegistry: "Adatkezelési nyilvántartás", consents: "Hozzájárulások" },
    stats: { processingActivities: "Adatkezelési tevékenységek", activeConsents: "Aktív hozzájárulások", dpoConfigured: "DPO konfigurálva", dpoNotConfigured: "DPO nincs konfigurálva", dpiaRequired: "DPIA szükséges" },
    legalBasis: { consent: "Hozzájárulás", contract: "Szerződés", legalObligation: "Jogi kötelezettség", vitalInterest: "Létfontosságú érdek", publicInterest: "Közérdek", legitimateInterest: "Jogos érdek" },
    consentType: { processing: "Adatkezelés", marketing: "Marketing", profiling: "Profilalkotás", transfer: "Adattovábbítás", specialCategories: "Különleges kategóriák", other: "Egyéb" },
    status: { active: "Aktív", inactive: "Inaktív", underReview: "Felülvizsgálat alatt", archived: "Archivált" },
    filter: { all: "Összes", active: "Aktív", withdrawn: "Visszavont", allStatuses: "Összes státusz", allLegalBases: "Összes jogalap" },
    processing: { addActivity: "Tevékenység hozzáadása", newTitle: "Új tevékenység", editTitle: "Tevékenység szerkesztése", emptyTitle: "Nincs tevékenység", emptyMessage: "Adja hozzá az első adatkezelési tevékenységet.", searchPlaceholder: "Tevékenységek keresése...", activityNameLabel: "Tevékenység neve", activityNamePlaceholder: "pl.: Munkavállalói adatok kezelése", purposeLabel: "Cél", purposePlaceholder: "pl.: Emberi erőforrások kezelése", legalBasisLabel: "Jogalap", statusLabel: "Státusz", dataSubjectsLabel: "Érintettek", dataSubjectsPlaceholder: "pl.: Munkavállalók, jelöltek", dataCategoriesLabel: "Adatkategóriák", dataCategoriesPlaceholder: "pl.: Azonosítási adatok, kapcsolattartás", retentionPeriodLabel: "Megőrzési idő", retentionPeriodPlaceholder: "pl.: 5 év", crossBorderTransfer: "Határokon átnyúló adattovábbítás", dpiaRequired: "DPIA szükséges", dpiaCompleted: "DPIA elvégezve", dpiaDateLabel: "DPIA dátuma" },
    consent: { addConsent: "Hozzájárulás hozzáadása", newTitle: "Új hozzájárulás", editTitle: "Hozzájárulás szerkesztése", emptyTitle: "Nincs hozzájárulás", emptyMessage: "Adja hozzá az első hozzájárulást.", searchPlaceholder: "Hozzájárulások keresése...", personNameLabel: "Személy neve", personNamePlaceholder: "pl.: Kovács János", emailLabel: "E-mail", typeLabel: "Hozzájárulás típusa", purposeLabel: "Cél", purposePlaceholder: "pl.: Marketing hírlevél", givenAtLabel: "Megadás dátuma", notesLabel: "Megjegyzések", notesPlaceholder: "További megjegyzések...", withdraw: "Visszavon", withdrawTitle: "Hozzájárulás visszavonása", active: "Aktív", withdrawn: "Visszavont" },
    dpo: { title: "Adatvédelmi tisztviselő (DPO)", subtitle: "Belső vagy külső DPO konfigurálása", typeLabel: "DPO típusa", internal: "Belső", external: "Külső", nameLabel: "DPO neve", namePlaceholder: "pl.: Kovács Mária", emailLabel: "E-mail", phoneLabel: "Telefon", companyLabel: "Cég (ha külső)", companyPlaceholder: "pl.: DPO Consulting Kft.", appointmentDateLabel: "Kinevezés dátuma", contractExpiryLabel: "Szerződés lejárata", anspdcpNotified: "ANSPDCP értesítve", anspdcpNotificationDateLabel: "Értesítés dátuma", notesLabel: "Megjegyzések", notesPlaceholder: "További információk...", save: "Mentés", saving: "Mentés...", savedSuccess: "DPO sikeresen mentve!" },
    table: { activity: "Tevékenység", legalBasis: "Jogalap", status: "Státusz", actions: "Műveletek", person: "Személy", type: "Típus", purpose: "Cél", givenAt: "Megadás dátuma" },
    actions: { edit: "Szerkesztés", delete: "Törlés", cancel: "Mégse", create: "Létrehozás", update: "Frissítés" },
    confirm: { deleteTitle: "Megerősíti a törlést?", deleteProcessingMessage: "Az adatkezelési tevékenység véglegesen törlődik.", deleteConsentMessage: "A hozzájárulás véglegesen törlődik." },
    errors: { createError: "Hiba a létrehozáskor", updateError: "Hiba a frissítéskor", deleteError: "Hiba a törlésnél", saveError: "Hiba a mentésnél", withdrawError: "Hiba a hozzájárulás visszavonásakor" }
  },
  de: {
    title: "DSGVO - Datenschutz",
    subtitle: "Verarbeitungsregister, Einwilligungen und DPO",
    tabs: { processingRegistry: "Verarbeitungsregister", consents: "Einwilligungen" },
    stats: { processingActivities: "Verarbeitungstätigkeiten", activeConsents: "Aktive Einwilligungen", dpoConfigured: "DPO konfiguriert", dpoNotConfigured: "DPO nicht konfiguriert", dpiaRequired: "DPIA erforderlich" },
    legalBasis: { consent: "Einwilligung", contract: "Vertrag", legalObligation: "Rechtliche Verpflichtung", vitalInterest: "Lebenswichtiges Interesse", publicInterest: "Öffentliches Interesse", legitimateInterest: "Berechtigtes Interesse" },
    consentType: { processing: "Datenverarbeitung", marketing: "Marketing", profiling: "Profiling", transfer: "Datenübermittlung", specialCategories: "Besondere Kategorien", other: "Sonstige" },
    status: { active: "Aktiv", inactive: "Inaktiv", underReview: "In Prüfung", archived: "Archiviert" },
    filter: { all: "Alle", active: "Aktiv", withdrawn: "Widerrufen", allStatuses: "Alle Status", allLegalBases: "Alle Rechtsgrundlagen" },
    processing: { addActivity: "Tätigkeit hinzufügen", newTitle: "Neue Tätigkeit", editTitle: "Tätigkeit bearbeiten", emptyTitle: "Keine Tätigkeiten", emptyMessage: "Fügen Sie die erste Verarbeitungstätigkeit hinzu.", searchPlaceholder: "Tätigkeiten suchen...", activityNameLabel: "Tätigkeitsname", activityNamePlaceholder: "z.B.: Verarbeitung von Mitarbeiterdaten", purposeLabel: "Zweck", purposePlaceholder: "z.B.: Personalverwaltung", legalBasisLabel: "Rechtsgrundlage", statusLabel: "Status", dataSubjectsLabel: "Betroffene Personen", dataSubjectsPlaceholder: "z.B.: Mitarbeiter, Bewerber", dataCategoriesLabel: "Datenkategorien", dataCategoriesPlaceholder: "z.B.: Identifikationsdaten, Kontakt", retentionPeriodLabel: "Aufbewahrungsfrist", retentionPeriodPlaceholder: "z.B.: 5 Jahre", crossBorderTransfer: "Grenzüberschreitende Übermittlung", dpiaRequired: "DPIA erforderlich", dpiaCompleted: "DPIA abgeschlossen", dpiaDateLabel: "DPIA-Datum" },
    consent: { addConsent: "Einwilligung hinzufügen", newTitle: "Neue Einwilligung", editTitle: "Einwilligung bearbeiten", emptyTitle: "Keine Einwilligungen", emptyMessage: "Fügen Sie die erste Einwilligung hinzu.", searchPlaceholder: "Einwilligungen suchen...", personNameLabel: "Personenname", personNamePlaceholder: "z.B.: Max Mustermann", emailLabel: "E-Mail", typeLabel: "Einwilligungstyp", purposeLabel: "Zweck", purposePlaceholder: "z.B.: Marketing-Newsletter", givenAtLabel: "Erteilt am", notesLabel: "Anmerkungen", notesPlaceholder: "Weitere Anmerkungen...", withdraw: "Widerrufen", withdrawTitle: "Einwilligung widerrufen", active: "Aktiv", withdrawn: "Widerrufen" },
    dpo: { title: "Datenschutzbeauftragter (DPO)", subtitle: "Konfiguration des internen oder externen DPO", typeLabel: "DPO-Typ", internal: "Intern", external: "Extern", nameLabel: "DPO-Name", namePlaceholder: "z.B.: Maria Müller", emailLabel: "E-Mail", phoneLabel: "Telefon", companyLabel: "Unternehmen (wenn extern)", companyPlaceholder: "z.B.: DPO Consulting GmbH", appointmentDateLabel: "Bestellungsdatum", contractExpiryLabel: "Vertragsablauf", anspdcpNotified: "ANSPDCP benachrichtigt", anspdcpNotificationDateLabel: "Benachrichtigungsdatum", notesLabel: "Anmerkungen", notesPlaceholder: "Weitere Informationen...", save: "Speichern", saving: "Speichern...", savedSuccess: "DPO erfolgreich gespeichert!" },
    table: { activity: "Tätigkeit", legalBasis: "Rechtsgrundlage", status: "Status", actions: "Aktionen", person: "Person", type: "Typ", purpose: "Zweck", givenAt: "Erteilt am" },
    actions: { edit: "Bearbeiten", delete: "Löschen", cancel: "Abbrechen", create: "Erstellen", update: "Aktualisieren" },
    confirm: { deleteTitle: "Löschung bestätigen?", deleteProcessingMessage: "Die Verarbeitungstätigkeit wird endgültig gelöscht.", deleteConsentMessage: "Die Einwilligung wird endgültig gelöscht." },
    errors: { createError: "Fehler beim Erstellen", updateError: "Fehler beim Aktualisieren", deleteError: "Fehler beim Löschen", saveError: "Fehler beim Speichern", withdrawError: "Fehler beim Widerrufen der Einwilligung" }
  },
  pl: {
    title: "RODO - Ochrona danych",
    subtitle: "Rejestr przetwarzania, zgody i DPO",
    tabs: { processingRegistry: "Rejestr przetwarzania", consents: "Zgody" },
    stats: { processingActivities: "Czynności przetwarzania", activeConsents: "Aktywne zgody", dpoConfigured: "DPO skonfigurowany", dpoNotConfigured: "DPO nieskonfigurowany", dpiaRequired: "DPIA wymagana" },
    legalBasis: { consent: "Zgoda", contract: "Umowa", legalObligation: "Obowiązek prawny", vitalInterest: "Żywotny interes", publicInterest: "Interes publiczny", legitimateInterest: "Prawnie uzasadniony interes" },
    consentType: { processing: "Przetwarzanie danych", marketing: "Marketing", profiling: "Profilowanie", transfer: "Przekazywanie danych", specialCategories: "Szczególne kategorie", other: "Inne" },
    status: { active: "Aktywny", inactive: "Nieaktywny", underReview: "W przeglądzie", archived: "Zarchiwizowany" },
    filter: { all: "Wszystkie", active: "Aktywne", withdrawn: "Wycofane", allStatuses: "Wszystkie statusy", allLegalBases: "Wszystkie podstawy prawne" },
    processing: { addActivity: "Dodaj czynność", newTitle: "Nowa czynność", editTitle: "Edytuj czynność", emptyTitle: "Brak czynności", emptyMessage: "Dodaj pierwszą czynność przetwarzania.", searchPlaceholder: "Szukaj czynności...", activityNameLabel: "Nazwa czynności", activityNamePlaceholder: "np.: Przetwarzanie danych pracowników", purposeLabel: "Cel", purposePlaceholder: "np.: Zarządzanie zasobami ludzkimi", legalBasisLabel: "Podstawa prawna", statusLabel: "Status", dataSubjectsLabel: "Osoby, których dane dotyczą", dataSubjectsPlaceholder: "np.: Pracownicy, kandydaci", dataCategoriesLabel: "Kategorie danych", dataCategoriesPlaceholder: "np.: Dane identyfikacyjne, kontaktowe", retentionPeriodLabel: "Okres przechowywania", retentionPeriodPlaceholder: "np.: 5 lat", crossBorderTransfer: "Przekazywanie transgraniczne", dpiaRequired: "DPIA wymagana", dpiaCompleted: "DPIA ukończona", dpiaDateLabel: "Data DPIA" },
    consent: { addConsent: "Dodaj zgodę", newTitle: "Nowa zgoda", editTitle: "Edytuj zgodę", emptyTitle: "Brak zgód", emptyMessage: "Dodaj pierwszą zgodę.", searchPlaceholder: "Szukaj zgód...", personNameLabel: "Imię i nazwisko", personNamePlaceholder: "np.: Jan Kowalski", emailLabel: "E-mail", typeLabel: "Typ zgody", purposeLabel: "Cel", purposePlaceholder: "np.: Newsletter marketingowy", givenAtLabel: "Data udzielenia", notesLabel: "Uwagi", notesPlaceholder: "Dodatkowe uwagi...", withdraw: "Wycofaj", withdrawTitle: "Wycofaj zgodę", active: "Aktywna", withdrawn: "Wycofana" },
    dpo: { title: "Inspektor Ochrony Danych (DPO)", subtitle: "Konfiguracja wewnętrznego lub zewnętrznego DPO", typeLabel: "Typ DPO", internal: "Wewnętrzny", external: "Zewnętrzny", nameLabel: "Imię i nazwisko DPO", namePlaceholder: "np.: Anna Kowalska", emailLabel: "E-mail", phoneLabel: "Telefon", companyLabel: "Firma (jeśli zewnętrzny)", companyPlaceholder: "np.: DPO Consulting Sp. z o.o.", appointmentDateLabel: "Data powołania", contractExpiryLabel: "Wygaśnięcie umowy", anspdcpNotified: "ANSPDCP powiadomiony", anspdcpNotificationDateLabel: "Data powiadomienia", notesLabel: "Uwagi", notesPlaceholder: "Dodatkowe informacje...", save: "Zapisz", saving: "Zapisywanie...", savedSuccess: "DPO zapisany pomyślnie!" },
    table: { activity: "Czynność", legalBasis: "Podstawa prawna", status: "Status", actions: "Akcje", person: "Osoba", type: "Typ", purpose: "Cel", givenAt: "Data udzielenia" },
    actions: { edit: "Edytuj", delete: "Usuń", cancel: "Anuluj", create: "Utwórz", update: "Zaktualizuj" },
    confirm: { deleteTitle: "Potwierdzasz usunięcie?", deleteProcessingMessage: "Czynność przetwarzania zostanie trwale usunięta.", deleteConsentMessage: "Zgoda zostanie trwale usunięta." },
    errors: { createError: "Błąd podczas tworzenia", updateError: "Błąd podczas aktualizacji", deleteError: "Błąd podczas usuwania", saveError: "Błąd podczas zapisywania", withdrawError: "Błąd podczas wycofywania zgody" }
  }
};

// ─── MEDICAL ─────────────────────────────────────────────────────────────────

const medical = {
  ro: {
    title: "Medicina Muncii",
    examType: { periodic: "Periodic", angajare: "Angajare", reluare: "Reluare", laCerere: "La cerere", controlPeriodic: "Control periodic", controlAngajare: "Control angajare", fisaAptitudine: "Fișă aptitudine", fisaPsihologica: "Fișă psihologică", supraveghere: "Supraveghere" },
    result: { apt: "Apt", aptConditionat: "Apt condiționat", inaptTemporar: "Inapt temporar", inapt: "Inapt", inAsteptare: "În așteptare" },
    appointmentStatus: { programat: "Programat", confirmat: "Confirmat", efectuat: "Efectuat", anulat: "Anulat", reprogramat: "Reprogramat" },
    status: { expired: "Expirat", expiredDesc: "Fișa medicală a expirat", expiringSoon: "Expiră curând", expiringSoonDesc: "Fișa medicală expiră în curând", valid: "Valid", validDesc: "Fișa medicală este validă", noRecord: "Fără fișă", noRecordDesc: "Nu există fișă medicală", undefined: "Nedefinit", undefinedDesc: "Data expirare nedefinită" },
    alertLevel: { expirat: "Expirat", urgent: "Urgent", atentie: "Atenție", ok: "OK", nedefinit: "Nedefinit" },
    tab: { records: "Fișe medicale", appointments: "Programări", alerts: "Alerte" },
    subtitle: { records: "Fișe medicale înregistrate", appointments: "Programări examene medicale", alerts: "Alerte expirate și urgente" },
    stats: { totalRecords: "Total fișe", valid: "Valide", expired: "Expirate", expiring30: "Expiră în 30 zile", totalAppointments: "Total programări", scheduled: "Programate", confirmed: "Confirmate", done: "Efectuate" },
    col: { employee: "Angajat", jobTitle: "Funcție", type: "Tip", date: "Data", examDate: "Data examen", expiryDate: "Data expirare", expires: "Expiră", daysLeft: "Zile rămase", result: "Rezultat", status: "Status", clinic: "Clinică", priority: "Prioritate" },
    form: { addRecord: "Adaugă fișă", addRecordBtn: "Adaugă", editRecord: "Editează fișă", examType: "Tip examen", examDate: "Data examen", expiryDate: "Data expirare", result: "Rezultat", doctor: "Medic", clinic: "Clinică", clinicAddress: "Adresă clinică", documentNumber: "Nr. document", restrictions: "Restricții", riskFactors: "Factori de risc", notes: "Observații", extraDetails: "Detalii suplimentare", validityMonths: "Valabilitate (luni)", employee: "Angajat", employeeName: "Nume angajat", selectEmployee: "Selectează angajat", selectEmployeeManual: "Selectează manual", organization: "Organizație", selectOrg: "Selectează organizație", jobTitle: "Funcție", save: "Salvează", saveChanges: "Salvează modificări", scheduleExam: "Programează examen", editAppointment: "Editează programare", date: "Data", time: "Ora" },
    btn: { addRecord: "Adaugă fișă", schedule: "Programează" },
    filter: { allOrgs: "Toate organizațiile", allTypes: "Toate tipurile", allResults: "Toate rezultatele", allStatuses: "Toate statusurile", expired: "Expirate", expiringSoon: "Expiră curând", valid: "Valide" },
    empty: { noRecords: "Nicio fișă medicală", noRecordsDesc: "Adaugă prima fișă medicală.", noRecordsFilter: "Niciun rezultat pentru filtrele selectate.", noAppointments: "Nicio programare", noAppointmentsDesc: "Programează primul examen medical.", noAppointmentsFilter: "Nicio programare pentru filtrele selectate.", noAlerts: "Nicio alertă", noAlertsDesc: "Toate fișele sunt valide.", noAlertsFilter: "Nicio alertă pentru filtrele selectate." },
    confirm: { delete: "Confirmi ștergerea?", deleteRecord: "Șterge fișa medicală", deleteRecordMsg: "Fișa va fi ștearsă definitiv.", deleteAppointment: "Șterge programarea", deleteAppointmentMsg: "Programarea va fi anulată definitiv.", deleteForever: "Șterge definitiv" },
    errors: { saveRecord: "Eroare la salvare fișă", deleteRecord: "Eroare la ștergere fișă", saveAppointment: "Eroare la salvare programare", deleteAppointment: "Eroare la ștergere programare" },
    loading: { data: "Se încarcă datele...", appointments: "Se încarcă programările...", alerts: "Se încarcă alertele..." },
    alerts: { warning: "Atenție", warningMessage: "Există fișe expirate sau aproape de expirare." },
    daysText: { expired: "Expirat de {days} zile", expiredShort: "Expirat", expiring: "Expiră în {days} zile", valid: "Valid — {days} zile rămase" },
    employee: { employeeInfo: "Informații angajat", jobTitle: "Funcție", department: "Departament", organization: "Organizație", hireDate: "Data angajării", lastExam: "Ultimul examen", latestBadge: "Status curent", noJobTitle: "Fără funcție", noExams: "Niciun examen", noExamsDesc: "Adaugă primul examen medical.", addRecord: "Adaugă fișă", addRecordAction: "Adaugă fișă medicală", tabStatus: "Status", tabHistory: "Istoric", tabAppointments: "Programări", historyDate: "Data", historyExpiry: "Expirare", historyDr: "Medic", examType: "Tip examen", result: "Rezultat", doctorClinic: "Medic / Clinică", riskFactors: "Factori de risc", activeRestrictions: "Restricții active", noRestrictions: "Fără restricții", noAppointments: "Nicio programare", noAppointmentsDesc: "Nu există programări pentru acest angajat.", modalTitle: "Adaugă fișă medicală", modalSubmit: "Salvează" },
    page: { title: "Examene Medicale", searchPlaceholder: "Caută angajat, medic...", total: "Total", totalExams: "examene înregistrate", count: "{count} examene", show: "Afișează", pagination: "Pagina {page} din {total}", noExams: "Niciun examen", noExamsDesc: "Adaugă primul examen medical pentru a începe.", noResults: "Niciun rezultat", noResultsDesc: "Nu există examene care să corespundă căutării.", colExamType: "Tip examen", colDoctor: "Medic", colNextExam: "Următorul examen" },
    examination_type: "Tip examen",
    examination_date: "Data examen",
    next_exam: "Următorul examen",
    doctor_name: "Medic",
    employee_name: "Angajat"
  },
  en: {
    title: "Occupational Medicine",
    examType: { periodic: "Periodic", angajare: "Employment", reluare: "Return", laCerere: "On request", controlPeriodic: "Periodic check", controlAngajare: "Employment check", fisaAptitudine: "Fitness certificate", fisaPsihologica: "Psychological certificate", supraveghere: "Surveillance" },
    result: { apt: "Fit", aptConditionat: "Conditionally fit", inaptTemporar: "Temporarily unfit", inapt: "Unfit", inAsteptare: "Pending" },
    appointmentStatus: { programat: "Scheduled", confirmat: "Confirmed", efectuat: "Completed", anulat: "Cancelled", reprogramat: "Rescheduled" },
    status: { expired: "Expired", expiredDesc: "Medical record has expired", expiringSoon: "Expiring soon", expiringSoonDesc: "Medical record is expiring soon", valid: "Valid", validDesc: "Medical record is valid", noRecord: "No record", noRecordDesc: "No medical record exists", undefined: "Undefined", undefinedDesc: "Expiry date undefined" },
    alertLevel: { expirat: "Expired", urgent: "Urgent", atentie: "Warning", ok: "OK", nedefinit: "Undefined" },
    tab: { records: "Medical records", appointments: "Appointments", alerts: "Alerts" },
    subtitle: { records: "Registered medical records", appointments: "Medical examination appointments", alerts: "Expired and urgent alerts" },
    stats: { totalRecords: "Total records", valid: "Valid", expired: "Expired", expiring30: "Expiring in 30 days", totalAppointments: "Total appointments", scheduled: "Scheduled", confirmed: "Confirmed", done: "Completed" },
    col: { employee: "Employee", jobTitle: "Job title", type: "Type", date: "Date", examDate: "Exam date", expiryDate: "Expiry date", expires: "Expires", daysLeft: "Days left", result: "Result", status: "Status", clinic: "Clinic", priority: "Priority" },
    form: { addRecord: "Add record", addRecordBtn: "Add", editRecord: "Edit record", examType: "Exam type", examDate: "Exam date", expiryDate: "Expiry date", result: "Result", doctor: "Doctor", clinic: "Clinic", clinicAddress: "Clinic address", documentNumber: "Document no.", restrictions: "Restrictions", riskFactors: "Risk factors", notes: "Notes", extraDetails: "Additional details", validityMonths: "Validity (months)", employee: "Employee", employeeName: "Employee name", selectEmployee: "Select employee", selectEmployeeManual: "Select manually", organization: "Organization", selectOrg: "Select organization", jobTitle: "Job title", save: "Save", saveChanges: "Save changes", scheduleExam: "Schedule exam", editAppointment: "Edit appointment", date: "Date", time: "Time" },
    btn: { addRecord: "Add record", schedule: "Schedule" },
    filter: { allOrgs: "All organizations", allTypes: "All types", allResults: "All results", allStatuses: "All statuses", expired: "Expired", expiringSoon: "Expiring soon", valid: "Valid" },
    empty: { noRecords: "No medical records", noRecordsDesc: "Add the first medical record.", noRecordsFilter: "No results for the selected filters.", noAppointments: "No appointments", noAppointmentsDesc: "Schedule the first medical exam.", noAppointmentsFilter: "No appointments for the selected filters.", noAlerts: "No alerts", noAlertsDesc: "All records are valid.", noAlertsFilter: "No alerts for the selected filters." },
    confirm: { delete: "Confirm deletion?", deleteRecord: "Delete medical record", deleteRecordMsg: "The record will be permanently deleted.", deleteAppointment: "Delete appointment", deleteAppointmentMsg: "The appointment will be permanently cancelled.", deleteForever: "Delete permanently" },
    errors: { saveRecord: "Error saving record", deleteRecord: "Error deleting record", saveAppointment: "Error saving appointment", deleteAppointment: "Error deleting appointment" },
    loading: { data: "Loading data...", appointments: "Loading appointments...", alerts: "Loading alerts..." },
    alerts: { warning: "Warning", warningMessage: "There are expired or nearly expired records." },
    daysText: { expired: "Expired {days} days ago", expiredShort: "Expired", expiring: "Expires in {days} days", valid: "Valid — {days} days remaining" },
    employee: { employeeInfo: "Employee information", jobTitle: "Job title", department: "Department", organization: "Organization", hireDate: "Hire date", lastExam: "Last exam", latestBadge: "Current status", noJobTitle: "No job title", noExams: "No exams", noExamsDesc: "Add the first medical exam.", addRecord: "Add record", addRecordAction: "Add medical record", tabStatus: "Status", tabHistory: "History", tabAppointments: "Appointments", historyDate: "Date", historyExpiry: "Expiry", historyDr: "Doctor", examType: "Exam type", result: "Result", doctorClinic: "Doctor / Clinic", riskFactors: "Risk factors", activeRestrictions: "Active restrictions", noRestrictions: "No restrictions", noAppointments: "No appointments", noAppointmentsDesc: "No appointments for this employee.", modalTitle: "Add medical record", modalSubmit: "Save" },
    page: { title: "Medical Examinations", searchPlaceholder: "Search employee, doctor...", total: "Total", totalExams: "registered exams", count: "{count} exams", show: "Show", pagination: "Page {page} of {total}", noExams: "No exams", noExamsDesc: "Add the first medical exam to get started.", noResults: "No results", noResultsDesc: "No exams matching the search.", colExamType: "Exam type", colDoctor: "Doctor", colNextExam: "Next exam" },
    examination_type: "Exam type",
    examination_date: "Exam date",
    next_exam: "Next exam",
    doctor_name: "Doctor",
    employee_name: "Employee"
  },
  bg: {
    title: "Трудова медицина",
    examType: { periodic: "Периодичен", angajare: "Постъпване на работа", reluare: "Завръщане", laCerere: "По искане", controlPeriodic: "Периодична проверка", controlAngajare: "Проверка при постъпване", fisaAptitudine: "Удостоверение за годност", fisaPsihologica: "Психологическо удостоверение", supraveghere: "Наблюдение" },
    result: { apt: "Годен", aptConditionat: "Условно годен", inaptTemporar: "Временно негоден", inapt: "Негоден", inAsteptare: "Изчакващ" },
    appointmentStatus: { programat: "Насрочен", confirmat: "Потвърден", efectuat: "Извършен", anulat: "Отменен", reprogramat: "Препланиран" },
    status: { expired: "Изтекъл", expiredDesc: "Медицинското досие е изтекло", expiringSoon: "Скоро изтича", expiringSoonDesc: "Медицинското досие скоро ще изтече", valid: "Валидно", validDesc: "Медицинското досие е валидно", noRecord: "Без досие", noRecordDesc: "Няма медицинско досие", undefined: "Неопределен", undefinedDesc: "Датата на изтичане не е определена" },
    alertLevel: { expirat: "Изтекъл", urgent: "Спешен", atentie: "Внимание", ok: "OK", nedefinit: "Неопределен" },
    tab: { records: "Медицински досиета", appointments: "Прегледи", alerts: "Сигнали" },
    subtitle: { records: "Регистрирани медицински досиета", appointments: "Насрочени медицински прегледи", alerts: "Изтекли и спешни сигнали" },
    stats: { totalRecords: "Общо досиета", valid: "Валидни", expired: "Изтекли", expiring30: "Изтичат до 30 дни", totalAppointments: "Общо прегледи", scheduled: "Насрочени", confirmed: "Потвърдени", done: "Извършени" },
    col: { employee: "Служител", jobTitle: "Длъжност", type: "Вид", date: "Дата", examDate: "Дата на преглед", expiryDate: "Дата на изтичане", expires: "Изтича", daysLeft: "Остават дни", result: "Резултат", status: "Статус", clinic: "Клиника", priority: "Приоритет" },
    form: { addRecord: "Добави досие", addRecordBtn: "Добави", editRecord: "Редактирай досие", examType: "Вид преглед", examDate: "Дата на преглед", expiryDate: "Дата на изтичане", result: "Резултат", doctor: "Лекар", clinic: "Клиника", clinicAddress: "Адрес на клиника", documentNumber: "№ на документ", restrictions: "Ограничения", riskFactors: "Рискови фактори", notes: "Бележки", extraDetails: "Допълнителни данни", validityMonths: "Валидност (месеци)", employee: "Служител", employeeName: "Име на служител", selectEmployee: "Избери служител", selectEmployeeManual: "Избери ръчно", organization: "Организация", selectOrg: "Избери организация", jobTitle: "Длъжност", save: "Запази", saveChanges: "Запази промените", scheduleExam: "Насрочи преглед", editAppointment: "Редактирай преглед", date: "Дата", time: "Час" },
    btn: { addRecord: "Добави досие", schedule: "Насрочи" },
    filter: { allOrgs: "Всички организации", allTypes: "Всички видове", allResults: "Всички резултати", allStatuses: "Всички статуси", expired: "Изтекли", expiringSoon: "Скоро изтичащи", valid: "Валидни" },
    empty: { noRecords: "Няма медицински досиета", noRecordsDesc: "Добавете първото медицинско досие.", noRecordsFilter: "Няма резултати за избраните филтри.", noAppointments: "Няма прегледи", noAppointmentsDesc: "Насрочете първия медицински преглед.", noAppointmentsFilter: "Няма прегледи за избраните филтри.", noAlerts: "Няма сигнали", noAlertsDesc: "Всички досиета са валидни.", noAlertsFilter: "Няма сигнали за избраните филтри." },
    confirm: { delete: "Потвърждавате изтриването?", deleteRecord: "Изтрий медицинско досие", deleteRecordMsg: "Досието ще бъде изтрито окончателно.", deleteAppointment: "Изтрий преглед", deleteAppointmentMsg: "Прегледът ще бъде отменен окончателно.", deleteForever: "Изтрий окончателно" },
    errors: { saveRecord: "Грешка при запазване на досие", deleteRecord: "Грешка при изтриване на досие", saveAppointment: "Грешка при запазване на преглед", deleteAppointment: "Грешка при изтриване на преглед" },
    loading: { data: "Зареждане на данни...", appointments: "Зареждане на прегледи...", alerts: "Зареждане на сигнали..." },
    alerts: { warning: "Внимание", warningMessage: "Има изтекли или почти изтекли досиета." },
    daysText: { expired: "Изтекъл преди {days} дни", expiredShort: "Изтекъл", expiring: "Изтича след {days} дни", valid: "Валидно — {days} дни остават" },
    employee: { employeeInfo: "Информация за служителя", jobTitle: "Длъжност", department: "Отдел", organization: "Организация", hireDate: "Дата на назначаване", lastExam: "Последен преглед", latestBadge: "Текущ статус", noJobTitle: "Без длъжност", noExams: "Няма прегледи", noExamsDesc: "Добавете първия медицински преглед.", addRecord: "Добави досие", addRecordAction: "Добави медицинско досие", tabStatus: "Статус", tabHistory: "История", tabAppointments: "Прегледи", historyDate: "Дата", historyExpiry: "Изтичане", historyDr: "Лекар", examType: "Вид преглед", result: "Резултат", doctorClinic: "Лекар / Клиника", riskFactors: "Рискови фактори", activeRestrictions: "Активни ограничения", noRestrictions: "Без ограничения", noAppointments: "Няма прегледи", noAppointmentsDesc: "Няма прегледи за този служител.", modalTitle: "Добави медицинско досие", modalSubmit: "Запази" },
    page: { title: "Медицински прегледи", searchPlaceholder: "Търси служител, лекар...", total: "Общо", totalExams: "регистрирани прегледи", count: "{count} прегледа", show: "Покажи", pagination: "Страница {page} от {total}", noExams: "Няма прегледи", noExamsDesc: "Добавете първия медицински преглед, за да започнете.", noResults: "Няма резултати", noResultsDesc: "Няма прегледи, отговарящи на търсенето.", colExamType: "Вид преглед", colDoctor: "Лекар", colNextExam: "Следващ преглед" },
    examination_type: "Вид преглед",
    examination_date: "Дата на преглед",
    next_exam: "Следващ преглед",
    doctor_name: "Лекар",
    employee_name: "Служител"
  },
  hu: {
    title: "Foglalkozás-egészségügy",
    examType: { periodic: "Időszakos", angajare: "Felvételkor", reluare: "Visszatéréskor", laCerere: "Kérésre", controlPeriodic: "Időszakos ellenőrzés", controlAngajare: "Felvételi ellenőrzés", fisaAptitudine: "Alkalmassági igazolás", fisaPsihologica: "Pszichológiai igazolás", supraveghere: "Megfigyelés" },
    result: { apt: "Alkalmas", aptConditionat: "Feltételesen alkalmas", inaptTemporar: "Ideiglenesen alkalmatlan", inapt: "Alkalmatlan", inAsteptare: "Függőben" },
    appointmentStatus: { programat: "Ütemezett", confirmat: "Megerősített", efectuat: "Elvégzett", anulat: "Lemondott", reprogramat: "Átütemezett" },
    status: { expired: "Lejárt", expiredDesc: "Az egészségügyi lap lejárt", expiringSoon: "Hamarosan lejár", expiringSoonDesc: "Az egészségügyi lap hamarosan lejár", valid: "Érvényes", validDesc: "Az egészségügyi lap érvényes", noRecord: "Nincs lap", noRecordDesc: "Nem létezik egészségügyi lap", undefined: "Meghatározatlan", undefinedDesc: "A lejárati dátum nincs meghatározva" },
    alertLevel: { expirat: "Lejárt", urgent: "Sürgős", atentie: "Figyelmeztetés", ok: "OK", nedefinit: "Meghatározatlan" },
    tab: { records: "Egészségügyi lapok", appointments: "Időpontok", alerts: "Riasztások" },
    subtitle: { records: "Regisztrált egészségügyi lapok", appointments: "Foglalkozás-egészségügyi vizsgálatok időpontjai", alerts: "Lejárt és sürgős riasztások" },
    stats: { totalRecords: "Összes lap", valid: "Érvényes", expired: "Lejárt", expiring30: "30 napon belül lejár", totalAppointments: "Összes időpont", scheduled: "Ütemezett", confirmed: "Megerősített", done: "Elvégzett" },
    col: { employee: "Munkavállaló", jobTitle: "Beosztás", type: "Típus", date: "Dátum", examDate: "Vizsgálat dátuma", expiryDate: "Lejárat dátuma", expires: "Lejár", daysLeft: "Hátralévő napok", result: "Eredmény", status: "Státusz", clinic: "Klinika", priority: "Prioritás" },
    form: { addRecord: "Lap hozzáadása", addRecordBtn: "Hozzáadás", editRecord: "Lap szerkesztése", examType: "Vizsgálat típusa", examDate: "Vizsgálat dátuma", expiryDate: "Lejárat dátuma", result: "Eredmény", doctor: "Orvos", clinic: "Klinika", clinicAddress: "Klinika címe", documentNumber: "Dokumentum száma", restrictions: "Korlátozások", riskFactors: "Kockázati tényezők", notes: "Megjegyzések", extraDetails: "További részletek", validityMonths: "Érvényesség (hónap)", employee: "Munkavállaló", employeeName: "Munkavállaló neve", selectEmployee: "Munkavállaló kiválasztása", selectEmployeeManual: "Manuális kiválasztás", organization: "Szervezet", selectOrg: "Szervezet kiválasztása", jobTitle: "Beosztás", save: "Mentés", saveChanges: "Változtatások mentése", scheduleExam: "Vizsgálat ütemezése", editAppointment: "Időpont szerkesztése", date: "Dátum", time: "Idő" },
    btn: { addRecord: "Lap hozzáadása", schedule: "Ütemezés" },
    filter: { allOrgs: "Összes szervezet", allTypes: "Összes típus", allResults: "Összes eredmény", allStatuses: "Összes státusz", expired: "Lejárt", expiringSoon: "Hamarosan lejár", valid: "Érvényes" },
    empty: { noRecords: "Nincsenek egészségügyi lapok", noRecordsDesc: "Adja hozzá az első egészségügyi lapot.", noRecordsFilter: "Nincs eredmény a kiválasztott szűrőkhöz.", noAppointments: "Nincsenek időpontok", noAppointmentsDesc: "Ütemezze az első orvosi vizsgálatot.", noAppointmentsFilter: "Nincs időpont a kiválasztott szűrőkhöz.", noAlerts: "Nincsenek riasztások", noAlertsDesc: "Minden lap érvényes.", noAlertsFilter: "Nincs riasztás a kiválasztott szűrőkhöz." },
    confirm: { delete: "Megerősíti a törlést?", deleteRecord: "Egészségügyi lap törlése", deleteRecordMsg: "A lap véglegesen törlődik.", deleteAppointment: "Időpont törlése", deleteAppointmentMsg: "Az időpont véglegesen lemondásra kerül.", deleteForever: "Végleges törlés" },
    errors: { saveRecord: "Hiba a lap mentésekor", deleteRecord: "Hiba a lap törlésekor", saveAppointment: "Hiba az időpont mentésekor", deleteAppointment: "Hiba az időpont törlésekor" },
    loading: { data: "Adatok betöltése...", appointments: "Időpontok betöltése...", alerts: "Riasztások betöltése..." },
    alerts: { warning: "Figyelmeztetés", warningMessage: "Vannak lejárt vagy hamarosan lejáró lapok." },
    daysText: { expired: "{days} napja lejárt", expiredShort: "Lejárt", expiring: "{days} nap múlva lejár", valid: "Érvényes — {days} nap maradt" },
    employee: { employeeInfo: "Munkavállaló adatai", jobTitle: "Beosztás", department: "Részleg", organization: "Szervezet", hireDate: "Felvétel dátuma", lastExam: "Utolsó vizsgálat", latestBadge: "Jelenlegi státusz", noJobTitle: "Nincs beosztás", noExams: "Nincs vizsgálat", noExamsDesc: "Adja hozzá az első orvosi vizsgálatot.", addRecord: "Lap hozzáadása", addRecordAction: "Egészségügyi lap hozzáadása", tabStatus: "Státusz", tabHistory: "Előzmények", tabAppointments: "Időpontok", historyDate: "Dátum", historyExpiry: "Lejárat", historyDr: "Orvos", examType: "Vizsgálat típusa", result: "Eredmény", doctorClinic: "Orvos / Klinika", riskFactors: "Kockázati tényezők", activeRestrictions: "Aktív korlátozások", noRestrictions: "Nincsenek korlátozások", noAppointments: "Nincsenek időpontok", noAppointmentsDesc: "Nincsenek időpontok ehhez a munkavállalóhoz.", modalTitle: "Egészségügyi lap hozzáadása", modalSubmit: "Mentés" },
    page: { title: "Orvosi vizsgálatok", searchPlaceholder: "Munkavállaló, orvos keresése...", total: "Összesen", totalExams: "regisztrált vizsgálat", count: "{count} vizsgálat", show: "Megjelenítés", pagination: "{page}. oldal / {total}", noExams: "Nincsenek vizsgálatok", noExamsDesc: "Adja hozzá az első orvosi vizsgálatot a kezdéshez.", noResults: "Nincs eredmény", noResultsDesc: "Nincs a keresésnek megfelelő vizsgálat.", colExamType: "Vizsgálat típusa", colDoctor: "Orvos", colNextExam: "Következő vizsgálat" },
    examination_type: "Vizsgálat típusa",
    examination_date: "Vizsgálat dátuma",
    next_exam: "Következő vizsgálat",
    doctor_name: "Orvos",
    employee_name: "Munkavállaló"
  },
  de: {
    title: "Arbeitsmedizin",
    examType: { periodic: "Periodisch", angajare: "Einstellung", reluare: "Wiedereingliederung", laCerere: "Auf Anfrage", controlPeriodic: "Periodische Kontrolle", controlAngajare: "Einstellungsuntersuchung", fisaAptitudine: "Eignungsbescheinigung", fisaPsihologica: "Psychologische Bescheinigung", supraveghere: "Überwachung" },
    result: { apt: "Geeignet", aptConditionat: "Bedingt geeignet", inaptTemporar: "Vorübergehend nicht geeignet", inapt: "Nicht geeignet", inAsteptare: "Ausstehend" },
    appointmentStatus: { programat: "Geplant", confirmat: "Bestätigt", efectuat: "Durchgeführt", anulat: "Abgesagt", reprogramat: "Umgeplant" },
    status: { expired: "Abgelaufen", expiredDesc: "Der Gesundheitsnachweis ist abgelaufen", expiringSoon: "Läuft bald ab", expiringSoonDesc: "Der Gesundheitsnachweis läuft bald ab", valid: "Gültig", validDesc: "Der Gesundheitsnachweis ist gültig", noRecord: "Kein Nachweis", noRecordDesc: "Es existiert kein Gesundheitsnachweis", undefined: "Undefiniert", undefinedDesc: "Ablaufdatum nicht definiert" },
    alertLevel: { expirat: "Abgelaufen", urgent: "Dringend", atentie: "Warnung", ok: "OK", nedefinit: "Undefiniert" },
    tab: { records: "Gesundheitsnachweise", appointments: "Termine", alerts: "Warnungen" },
    subtitle: { records: "Registrierte Gesundheitsnachweise", appointments: "Termine für arbeitsmedizinische Untersuchungen", alerts: "Abgelaufene und dringende Warnungen" },
    stats: { totalRecords: "Nachweise gesamt", valid: "Gültig", expired: "Abgelaufen", expiring30: "Läuft in 30 Tagen ab", totalAppointments: "Termine gesamt", scheduled: "Geplant", confirmed: "Bestätigt", done: "Durchgeführt" },
    col: { employee: "Mitarbeiter", jobTitle: "Berufsbezeichnung", type: "Typ", date: "Datum", examDate: "Untersuchungsdatum", expiryDate: "Ablaufdatum", expires: "Läuft ab", daysLeft: "Verbleibende Tage", result: "Ergebnis", status: "Status", clinic: "Klinik", priority: "Priorität" },
    form: { addRecord: "Nachweis hinzufügen", addRecordBtn: "Hinzufügen", editRecord: "Nachweis bearbeiten", examType: "Untersuchungstyp", examDate: "Untersuchungsdatum", expiryDate: "Ablaufdatum", result: "Ergebnis", doctor: "Arzt", clinic: "Klinik", clinicAddress: "Klinikadresse", documentNumber: "Dokument-Nr.", restrictions: "Einschränkungen", riskFactors: "Risikofaktoren", notes: "Anmerkungen", extraDetails: "Weitere Details", validityMonths: "Gültigkeit (Monate)", employee: "Mitarbeiter", employeeName: "Mitarbeitername", selectEmployee: "Mitarbeiter auswählen", selectEmployeeManual: "Manuell auswählen", organization: "Organisation", selectOrg: "Organisation auswählen", jobTitle: "Berufsbezeichnung", save: "Speichern", saveChanges: "Änderungen speichern", scheduleExam: "Untersuchung planen", editAppointment: "Termin bearbeiten", date: "Datum", time: "Uhrzeit" },
    btn: { addRecord: "Nachweis hinzufügen", schedule: "Planen" },
    filter: { allOrgs: "Alle Organisationen", allTypes: "Alle Typen", allResults: "Alle Ergebnisse", allStatuses: "Alle Status", expired: "Abgelaufen", expiringSoon: "Läuft bald ab", valid: "Gültig" },
    empty: { noRecords: "Keine Gesundheitsnachweise", noRecordsDesc: "Fügen Sie den ersten Gesundheitsnachweis hinzu.", noRecordsFilter: "Keine Ergebnisse für die ausgewählten Filter.", noAppointments: "Keine Termine", noAppointmentsDesc: "Planen Sie die erste arbeitsmedizinische Untersuchung.", noAppointmentsFilter: "Keine Termine für die ausgewählten Filter.", noAlerts: "Keine Warnungen", noAlertsDesc: "Alle Nachweise sind gültig.", noAlertsFilter: "Keine Warnungen für die ausgewählten Filter." },
    confirm: { delete: "Löschen bestätigen?", deleteRecord: "Gesundheitsnachweis löschen", deleteRecordMsg: "Der Nachweis wird endgültig gelöscht.", deleteAppointment: "Termin löschen", deleteAppointmentMsg: "Der Termin wird endgültig abgesagt.", deleteForever: "Endgültig löschen" },
    errors: { saveRecord: "Fehler beim Speichern des Nachweises", deleteRecord: "Fehler beim Löschen des Nachweises", saveAppointment: "Fehler beim Speichern des Termins", deleteAppointment: "Fehler beim Löschen des Termins" },
    loading: { data: "Daten werden geladen...", appointments: "Termine werden geladen...", alerts: "Warnungen werden geladen..." },
    alerts: { warning: "Warnung", warningMessage: "Es gibt abgelaufene oder bald ablaufende Nachweise." },
    daysText: { expired: "Vor {days} Tagen abgelaufen", expiredShort: "Abgelaufen", expiring: "Läuft in {days} Tagen ab", valid: "Gültig — {days} Tage verbleibend" },
    employee: { employeeInfo: "Mitarbeiterinformationen", jobTitle: "Berufsbezeichnung", department: "Abteilung", organization: "Organisation", hireDate: "Einstellungsdatum", lastExam: "Letzte Untersuchung", latestBadge: "Aktueller Status", noJobTitle: "Keine Berufsbezeichnung", noExams: "Keine Untersuchungen", noExamsDesc: "Fügen Sie die erste arbeitsmedizinische Untersuchung hinzu.", addRecord: "Nachweis hinzufügen", addRecordAction: "Gesundheitsnachweis hinzufügen", tabStatus: "Status", tabHistory: "Verlauf", tabAppointments: "Termine", historyDate: "Datum", historyExpiry: "Ablauf", historyDr: "Arzt", examType: "Untersuchungstyp", result: "Ergebnis", doctorClinic: "Arzt / Klinik", riskFactors: "Risikofaktoren", activeRestrictions: "Aktive Einschränkungen", noRestrictions: "Keine Einschränkungen", noAppointments: "Keine Termine", noAppointmentsDesc: "Keine Termine für diesen Mitarbeiter.", modalTitle: "Gesundheitsnachweis hinzufügen", modalSubmit: "Speichern" },
    page: { title: "Arbeitsmedizinische Untersuchungen", searchPlaceholder: "Mitarbeiter, Arzt suchen...", total: "Gesamt", totalExams: "registrierte Untersuchungen", count: "{count} Untersuchungen", show: "Anzeigen", pagination: "Seite {page} von {total}", noExams: "Keine Untersuchungen", noExamsDesc: "Fügen Sie die erste arbeitsmedizinische Untersuchung hinzu, um zu beginnen.", noResults: "Keine Ergebnisse", noResultsDesc: "Keine der Suche entsprechenden Untersuchungen.", colExamType: "Untersuchungstyp", colDoctor: "Arzt", colNextExam: "Nächste Untersuchung" },
    examination_type: "Untersuchungstyp",
    examination_date: "Untersuchungsdatum",
    next_exam: "Nächste Untersuchung",
    doctor_name: "Arzt",
    employee_name: "Mitarbeiter"
  },
  pl: {
    title: "Medycyna Pracy",
    examType: { periodic: "Okresowy", angajare: "Wstępny", reluare: "Powrotny", laCerere: "Na żądanie", controlPeriodic: "Kontrola okresowa", controlAngajare: "Kontrola wstępna", fisaAptitudine: "Zaświadczenie o zdolności", fisaPsihologica: "Zaświadczenie psychologiczne", supraveghere: "Nadzór" },
    result: { apt: "Zdolny", aptConditionat: "Warunkowo zdolny", inaptTemporar: "Czasowo niezdolny", inapt: "Niezdolny", inAsteptare: "Oczekujący" },
    appointmentStatus: { programat: "Zaplanowane", confirmat: "Potwierdzone", efectuat: "Wykonane", anulat: "Anulowane", reprogramat: "Przeplanowane" },
    status: { expired: "Wygasłe", expiredDesc: "Orzeczenie lekarskie wygasło", expiringSoon: "Wkrótce wygasa", expiringSoonDesc: "Orzeczenie lekarskie wkrótce wygaśnie", valid: "Ważne", validDesc: "Orzeczenie lekarskie jest ważne", noRecord: "Brak orzeczenia", noRecordDesc: "Brak orzeczenia lekarskiego", undefined: "Nieokreślone", undefinedDesc: "Data wygaśnięcia nieokreślona" },
    alertLevel: { expirat: "Wygasłe", urgent: "Pilne", atentie: "Uwaga", ok: "OK", nedefinit: "Nieokreślone" },
    tab: { records: "Orzeczenia lekarskie", appointments: "Wizyty", alerts: "Alerty" },
    subtitle: { records: "Zarejestrowane orzeczenia lekarskie", appointments: "Zaplanowane badania lekarskie", alerts: "Wygasłe i pilne alerty" },
    stats: { totalRecords: "Łączna liczba orzeczeń", valid: "Ważne", expired: "Wygasłe", expiring30: "Wygasają w ciągu 30 dni", totalAppointments: "Łączna liczba wizyt", scheduled: "Zaplanowane", confirmed: "Potwierdzone", done: "Wykonane" },
    col: { employee: "Pracownik", jobTitle: "Stanowisko", type: "Typ", date: "Data", examDate: "Data badania", expiryDate: "Data wygaśnięcia", expires: "Wygasa", daysLeft: "Pozostałe dni", result: "Wynik", status: "Status", clinic: "Klinika", priority: "Priorytet" },
    form: { addRecord: "Dodaj orzeczenie", addRecordBtn: "Dodaj", editRecord: "Edytuj orzeczenie", examType: "Typ badania", examDate: "Data badania", expiryDate: "Data wygaśnięcia", result: "Wynik", doctor: "Lekarz", clinic: "Klinika", clinicAddress: "Adres kliniki", documentNumber: "Nr dokumentu", restrictions: "Ograniczenia", riskFactors: "Czynniki ryzyka", notes: "Uwagi", extraDetails: "Dodatkowe szczegóły", validityMonths: "Ważność (miesiące)", employee: "Pracownik", employeeName: "Imię i nazwisko pracownika", selectEmployee: "Wybierz pracownika", selectEmployeeManual: "Wybierz ręcznie", organization: "Organizacja", selectOrg: "Wybierz organizację", jobTitle: "Stanowisko", save: "Zapisz", saveChanges: "Zapisz zmiany", scheduleExam: "Zaplanuj badanie", editAppointment: "Edytuj wizytę", date: "Data", time: "Godzina" },
    btn: { addRecord: "Dodaj orzeczenie", schedule: "Zaplanuj" },
    filter: { allOrgs: "Wszystkie organizacje", allTypes: "Wszystkie typy", allResults: "Wszystkie wyniki", allStatuses: "Wszystkie statusy", expired: "Wygasłe", expiringSoon: "Wkrótce wygasające", valid: "Ważne" },
    empty: { noRecords: "Brak orzeczeń lekarskich", noRecordsDesc: "Dodaj pierwsze orzeczenie lekarskie.", noRecordsFilter: "Brak wyników dla wybranych filtrów.", noAppointments: "Brak wizyt", noAppointmentsDesc: "Zaplanuj pierwsze badanie lekarskie.", noAppointmentsFilter: "Brak wizyt dla wybranych filtrów.", noAlerts: "Brak alertów", noAlertsDesc: "Wszystkie orzeczenia są ważne.", noAlertsFilter: "Brak alertów dla wybranych filtrów." },
    confirm: { delete: "Potwierdzasz usunięcie?", deleteRecord: "Usuń orzeczenie lekarskie", deleteRecordMsg: "Orzeczenie zostanie trwale usunięte.", deleteAppointment: "Usuń wizytę", deleteAppointmentMsg: "Wizyta zostanie trwale anulowana.", deleteForever: "Usuń trwale" },
    errors: { saveRecord: "Błąd podczas zapisywania orzeczenia", deleteRecord: "Błąd podczas usuwania orzeczenia", saveAppointment: "Błąd podczas zapisywania wizyty", deleteAppointment: "Błąd podczas usuwania wizyty" },
    loading: { data: "Ładowanie danych...", appointments: "Ładowanie wizyt...", alerts: "Ładowanie alertów..." },
    alerts: { warning: "Uwaga", warningMessage: "Istnieją wygasłe lub wkrótce wygasające orzeczenia." },
    daysText: { expired: "Wygasłe {days} dni temu", expiredShort: "Wygasłe", expiring: "Wygasa za {days} dni", valid: "Ważne — {days} dni pozostało" },
    employee: { employeeInfo: "Informacje o pracowniku", jobTitle: "Stanowisko", department: "Dział", organization: "Organizacja", hireDate: "Data zatrudnienia", lastExam: "Ostatnie badanie", latestBadge: "Bieżący status", noJobTitle: "Brak stanowiska", noExams: "Brak badań", noExamsDesc: "Dodaj pierwsze badanie lekarskie.", addRecord: "Dodaj orzeczenie", addRecordAction: "Dodaj orzeczenie lekarskie", tabStatus: "Status", tabHistory: "Historia", tabAppointments: "Wizyty", historyDate: "Data", historyExpiry: "Wygaśnięcie", historyDr: "Lekarz", examType: "Typ badania", result: "Wynik", doctorClinic: "Lekarz / Klinika", riskFactors: "Czynniki ryzyka", activeRestrictions: "Aktywne ograniczenia", noRestrictions: "Brak ograniczeń", noAppointments: "Brak wizyt", noAppointmentsDesc: "Brak wizyt dla tego pracownika.", modalTitle: "Dodaj orzeczenie lekarskie", modalSubmit: "Zapisz" },
    page: { title: "Badania lekarskie", searchPlaceholder: "Szukaj pracownika, lekarza...", total: "Łącznie", totalExams: "zarejestrowanych badań", count: "{count} badań", show: "Pokaż", pagination: "Strona {page} z {total}", noExams: "Brak badań", noExamsDesc: "Dodaj pierwsze badanie lekarskie, aby rozpocząć.", noResults: "Brak wyników", noResultsDesc: "Brak badań odpowiadających wyszukiwaniu.", colExamType: "Typ badania", colDoctor: "Lekarz", colNextExam: "Następne badanie" },
    examination_type: "Typ badania",
    examination_date: "Data badania",
    next_exam: "Następne badanie",
    doctor_name: "Lekarz",
    employee_name: "Pracownik"
  }
};

// ─── ISCIR ────────────────────────────────────────────────────────────────────

const iscir = {
  ro: {
    title: "ISCIR - Echipamente sub Presiune",
    subtitle: "Gestiune echipamente ISCIR, verificări și autorizații",
    addEquipment: "Adaugă echipament",
    recentEquipment: "Echipamente recente",
    equipmentType: { cazan: "Cazan", recipientPresiune: "Recipient sub presiune", lift: "Lift", macara: "Macara", stivuitor: "Stivuitor", instalatieGpl: "Instalație GPL", compresor: "Compresor", autoclave: "Autoclave", altul: "Altul" },
    status: { activ: "Activ", expirat: "Expirat", inVerificare: "În verificare", oprit: "Oprit", casat: "Casat" },
    verificationType: { periodica: "Periodică", accidentala: "Accidentală", punereInFunctiune: "Punere în funcțiune", reparatie: "Reparație", modernizare: "Modernizare" },
    result: { admis: "Admis", admisConditionat: "Admis condiționat", respins: "Respins" },
    alert: { expired: "Expirat", urgent: "Urgent", warning: "Atenție", ok: "OK" },
    alertBadge: { expired: "Expirat", urgent: "Urgent", warning: "Atenție", ok: "OK" },
    tabs: { dashboard: "Panou", equipment: "Echipamente", verifications: "Verificări", alerts: "Alerte" },
    stats: { total: "Total echipamente", active: "Active", expired: "Expirate", stopped: "Oprite" },
    table: { type: "Tip", identifier: "Identificator", iscirNr: "Nr. ISCIR", location: "Locație", status: "Status", verification: "Verificare", actions: "Acțiuni" },
    filter: { allOrgs: "Toate organizațiile", allTypes: "Toate tipurile", allStatuses: "Toate statusurile", searchPlaceholder: "Caută echipament..." },
    form: { titleAdd: "Adaugă echipament ISCIR", titleEdit: "Editează echipament", equipmentType: "Tip echipament", identifier: "Identificator", serialNumber: "Număr serie", registrationNumber: "Număr înregistrare", manufacturer: "Producător", model: "Model", manufactureYear: "Anul fabricației", capacity: "Capacitate / Parametri", location: "Locație", status: "Status", authorizationNumber: "Nr. autorizație", authorizationExpiry: "Expirare autorizație", verifInterval: "Interval verificare (luni)", nextVerifDate: "Data următoarei verificări", rsvtiResponsible: "Responsabil RSVTI", observations: "Observații", save: "Salvează", saving: "Se salvează...", cancel: "Anulează" },
    verifForm: { title: "Înregistrează verificare", equipment: "Echipament", verifDate: "Data verificare", verifType: "Tip verificare", result: "Rezultat", inspectorName: "Nume inspector", inspectorId: "ID inspector", bulletinNumber: "Nr. buletin", nextVerifDate: "Data următoarei verificări", prescriptions: "Prescripții", prescriptionsDeadline: "Termen prescripții", saveVerification: "Salvează verificare" },
    verifications: { title: "Istoric verificări", colDate: "Data", colType: "Tip", colEquipment: "Echipament", colResult: "Rezultat", colInspector: "Inspector", colBulletin: "Nr. buletin" },
    alertsTab: { title: "Alerte verificări", colAlertLevel: "Nivel", colDaysLeft: "Zile rămase", colVerifDate: "Data verificare", verify: "Verifică" },
    timeline: { bulletin: "Buletin", inspector: "Inspector", nextVerif: "Următoarea verificare", prescriptions: "Prescripții", prescriptionsDeadline: "Termen prescripții" },
    detail: { backToIscir: "Înapoi la ISCIR", technicalData: "Date tehnice", capacityParams: "Capacitate / Parametri", installDate: "Data instalare", lastVerif: "Ultima verificare", nextVerif: "Următoarea verificare", verifInterval: "Interval verificare", months: "luni", daysLeft: "zile rămase", daysOverdue: "zile depășire", authorizationExpiry: "Expirare autorizație", organization: "Organizație", locationTitle: "Locație", rsvtiTitle: "Responsabil RSVTI", verifHistory: "Istoric verificări", verifCalendar: "Calendar verificări", dailyChecksTitle: "Verificări zilnice", dailyCheck: "Verificare zilnică", dailyCheckRequired: "Necesită verificare zilnică", noDailyChecks: "Nicio verificare zilnică", showAll: "Afișează toate", showLess: "Afișează mai puțin", qrCode: "Cod QR", qrError: "Eroare generare QR", qrScanInstruction: "Scanează pentru verificare rapidă", operatorPage: "Pagina operator", addVerification: "Adaugă verificare", addFirstVerif: "Adaugă prima verificare", add: "Adaugă", close: "Închide", yes: "Da", no: "Nu" },
    deleteDialog: { title: "Confirmi ștergerea?", message: "Echipamentul va fi șters definitiv.", delete: "Șterge", deleting: "Se șterge..." },
    empty: { noEquipment: "Niciun echipament", noVerifications: "Nicio verificare", noAlerts: "Nicio alertă" },
    errors: { saveEquipment: "Eroare la salvare echipament", deleteEquipment: "Eroare la ștergere echipament", saveVerification: "Eroare la salvare verificare" },
    dailyRow: { operator: "Operator", pointsOk: "Puncte OK", issuesFound: "Probleme", signed: "Semnat" }
  },
  en: {
    title: "ISCIR - Pressure Equipment",
    subtitle: "ISCIR equipment management, verifications and authorizations",
    addEquipment: "Add equipment",
    recentEquipment: "Recent equipment",
    equipmentType: { cazan: "Boiler", recipientPresiune: "Pressure vessel", lift: "Lift", macara: "Crane", stivuitor: "Forklift", instalatieGpl: "LPG installation", compresor: "Compressor", autoclave: "Autoclave", altul: "Other" },
    status: { activ: "Active", expirat: "Expired", inVerificare: "Under verification", oprit: "Stopped", casat: "Decommissioned" },
    verificationType: { periodica: "Periodic", accidentala: "Accidental", punereInFunctiune: "Commissioning", reparatie: "Repair", modernizare: "Modernization" },
    result: { admis: "Approved", admisConditionat: "Conditionally approved", respins: "Rejected" },
    alert: { expired: "Expired", urgent: "Urgent", warning: "Warning", ok: "OK" },
    alertBadge: { expired: "Expired", urgent: "Urgent", warning: "Warning", ok: "OK" },
    tabs: { dashboard: "Dashboard", equipment: "Equipment", verifications: "Verifications", alerts: "Alerts" },
    stats: { total: "Total equipment", active: "Active", expired: "Expired", stopped: "Stopped" },
    table: { type: "Type", identifier: "Identifier", iscirNr: "ISCIR No.", location: "Location", status: "Status", verification: "Verification", actions: "Actions" },
    filter: { allOrgs: "All organizations", allTypes: "All types", allStatuses: "All statuses", searchPlaceholder: "Search equipment..." },
    form: { titleAdd: "Add ISCIR equipment", titleEdit: "Edit equipment", equipmentType: "Equipment type", identifier: "Identifier", serialNumber: "Serial number", registrationNumber: "Registration number", manufacturer: "Manufacturer", model: "Model", manufactureYear: "Year of manufacture", capacity: "Capacity / Parameters", location: "Location", status: "Status", authorizationNumber: "Authorization no.", authorizationExpiry: "Authorization expiry", verifInterval: "Verification interval (months)", nextVerifDate: "Next verification date", rsvtiResponsible: "RSVTI responsible", observations: "Observations", save: "Save", saving: "Saving...", cancel: "Cancel" },
    verifForm: { title: "Record verification", equipment: "Equipment", verifDate: "Verification date", verifType: "Verification type", result: "Result", inspectorName: "Inspector name", inspectorId: "Inspector ID", bulletinNumber: "Bulletin no.", nextVerifDate: "Next verification date", prescriptions: "Prescriptions", prescriptionsDeadline: "Prescriptions deadline", saveVerification: "Save verification" },
    verifications: { title: "Verification history", colDate: "Date", colType: "Type", colEquipment: "Equipment", colResult: "Result", colInspector: "Inspector", colBulletin: "Bulletin no." },
    alertsTab: { title: "Verification alerts", colAlertLevel: "Level", colDaysLeft: "Days left", colVerifDate: "Verification date", verify: "Verify" },
    timeline: { bulletin: "Bulletin", inspector: "Inspector", nextVerif: "Next verification", prescriptions: "Prescriptions", prescriptionsDeadline: "Prescriptions deadline" },
    detail: { backToIscir: "Back to ISCIR", technicalData: "Technical data", capacityParams: "Capacity / Parameters", installDate: "Installation date", lastVerif: "Last verification", nextVerif: "Next verification", verifInterval: "Verification interval", months: "months", daysLeft: "days left", daysOverdue: "days overdue", authorizationExpiry: "Authorization expiry", organization: "Organization", locationTitle: "Location", rsvtiTitle: "RSVTI responsible", verifHistory: "Verification history", verifCalendar: "Verification calendar", dailyChecksTitle: "Daily checks", dailyCheck: "Daily check", dailyCheckRequired: "Requires daily check", noDailyChecks: "No daily checks", showAll: "Show all", showLess: "Show less", qrCode: "QR Code", qrError: "QR generation error", qrScanInstruction: "Scan for quick verification", operatorPage: "Operator page", addVerification: "Add verification", addFirstVerif: "Add first verification", add: "Add", close: "Close", yes: "Yes", no: "No" },
    deleteDialog: { title: "Confirm deletion?", message: "The equipment will be permanently deleted.", delete: "Delete", deleting: "Deleting..." },
    empty: { noEquipment: "No equipment", noVerifications: "No verifications", noAlerts: "No alerts" },
    errors: { saveEquipment: "Error saving equipment", deleteEquipment: "Error deleting equipment", saveVerification: "Error saving verification" },
    dailyRow: { operator: "Operator", pointsOk: "Points OK", issuesFound: "Issues", signed: "Signed" }
  },
  bg: {
    title: "ISCIR - Съоръжения под налягане",
    subtitle: "Управление на ISCIR съоръжения, проверки и разрешения",
    addEquipment: "Добави съоръжение",
    recentEquipment: "Последни съоръжения",
    equipmentType: { cazan: "Котел", recipientPresiune: "Съд под налягане", lift: "Асансьор", macara: "Кран", stivuitor: "Мотокар", instalatieGpl: "LPG инсталация", compresor: "Компресор", autoclave: "Автоклав", altul: "Друго" },
    status: { activ: "Активен", expirat: "Изтекъл", inVerificare: "В проверка", oprit: "Спрян", casat: "Бракуван" },
    verificationType: { periodica: "Периодична", accidentala: "Аварийна", punereInFunctiune: "Въвеждане в експлоатация", reparatie: "Ремонт", modernizare: "Модернизация" },
    result: { admis: "Одобрен", admisConditionat: "Условно одобрен", respins: "Отхвърлен" },
    alert: { expired: "Изтекъл", urgent: "Спешен", warning: "Внимание", ok: "OK" },
    alertBadge: { expired: "Изтекъл", urgent: "Спешен", warning: "Внимание", ok: "OK" },
    tabs: { dashboard: "Табло", equipment: "Съоръжения", verifications: "Проверки", alerts: "Сигнали" },
    stats: { total: "Общо съоръжения", active: "Активни", expired: "Изтекли", stopped: "Спрени" },
    table: { type: "Вид", identifier: "Идентификатор", iscirNr: "ISCIR №", location: "Местоположение", status: "Статус", verification: "Проверка", actions: "Действия" },
    filter: { allOrgs: "Всички организации", allTypes: "Всички видове", allStatuses: "Всички статуси", searchPlaceholder: "Търси съоръжение..." },
    form: { titleAdd: "Добави ISCIR съоръжение", titleEdit: "Редактирай съоръжение", equipmentType: "Вид съоръжение", identifier: "Идентификатор", serialNumber: "Сериен номер", registrationNumber: "Регистрационен номер", manufacturer: "Производител", model: "Модел", manufactureYear: "Година на производство", capacity: "Капацитет / Параметри", location: "Местоположение", status: "Статус", authorizationNumber: "№ на разрешение", authorizationExpiry: "Изтичане на разрешението", verifInterval: "Интервал на проверка (месеци)", nextVerifDate: "Дата на следваща проверка", rsvtiResponsible: "Отговорник RSVTI", observations: "Забележки", save: "Запази", saving: "Запазване...", cancel: "Откажи" },
    verifForm: { title: "Регистрирай проверка", equipment: "Съоръжение", verifDate: "Дата на проверка", verifType: "Вид проверка", result: "Резултат", inspectorName: "Име на инспектора", inspectorId: "ID на инспектора", bulletinNumber: "№ на бюлетин", nextVerifDate: "Дата на следваща проверка", prescriptions: "Предписания", prescriptionsDeadline: "Срок за предписания", saveVerification: "Запази проверка" },
    verifications: { title: "История на проверките", colDate: "Дата", colType: "Вид", colEquipment: "Съоръжение", colResult: "Резултат", colInspector: "Инспектор", colBulletin: "№ на бюлетин" },
    alertsTab: { title: "Сигнали за проверки", colAlertLevel: "Ниво", colDaysLeft: "Остават дни", colVerifDate: "Дата на проверка", verify: "Провери" },
    timeline: { bulletin: "Бюлетин", inspector: "Инспектор", nextVerif: "Следваща проверка", prescriptions: "Предписания", prescriptionsDeadline: "Срок за предписания" },
    detail: { backToIscir: "Обратно към ISCIR", technicalData: "Технически данни", capacityParams: "Капацитет / Параметри", installDate: "Дата на монтаж", lastVerif: "Последна проверка", nextVerif: "Следваща проверка", verifInterval: "Интервал на проверка", months: "месеца", daysLeft: "дни остават", daysOverdue: "дни закъснение", authorizationExpiry: "Изтичане на разрешението", organization: "Организация", locationTitle: "Местоположение", rsvtiTitle: "Отговорник RSVTI", verifHistory: "История на проверките", verifCalendar: "Календар на проверките", dailyChecksTitle: "Ежедневни проверки", dailyCheck: "Ежедневна проверка", dailyCheckRequired: "Изисква ежедневна проверка", noDailyChecks: "Няма ежедневни проверки", showAll: "Покажи всички", showLess: "Покажи по-малко", qrCode: "QR код", qrError: "Грешка при генериране на QR", qrScanInstruction: "Сканирай за бърза проверка", operatorPage: "Страница на оператора", addVerification: "Добави проверка", addFirstVerif: "Добави първа проверка", add: "Добави", close: "Затвори", yes: "Да", no: "Не" },
    deleteDialog: { title: "Потвърждавате изтриването?", message: "Съоръжението ще бъде изтрито окончателно.", delete: "Изтрий", deleting: "Изтриване..." },
    empty: { noEquipment: "Няма съоръжения", noVerifications: "Няма проверки", noAlerts: "Няма сигнали" },
    errors: { saveEquipment: "Грешка при запазване на съоръжение", deleteEquipment: "Грешка при изтриване на съоръжение", saveVerification: "Грешка при запазване на проверка" },
    dailyRow: { operator: "Оператор", pointsOk: "Точки OK", issuesFound: "Проблеми", signed: "Подписано" }
  },
  hu: {
    title: "ISCIR - Nyomástartó berendezések",
    subtitle: "ISCIR berendezések kezelése, ellenőrzések és engedélyek",
    addEquipment: "Berendezés hozzáadása",
    recentEquipment: "Legutóbbi berendezések",
    equipmentType: { cazan: "Kazán", recipientPresiune: "Nyomástartó edény", lift: "Lift", macara: "Daru", stivuitor: "Targonca", instalatieGpl: "LPG berendezés", compresor: "Kompresszor", autoclave: "Autokláv", altul: "Egyéb" },
    status: { activ: "Aktív", expirat: "Lejárt", inVerificare: "Ellenőrzés alatt", oprit: "Leállított", casat: "Selejtezett" },
    verificationType: { periodica: "Időszakos", accidentala: "Rendkívüli", punereInFunctiune: "Üzembe helyezés", reparatie: "Javítás", modernizare: "Korszerűsítés" },
    result: { admis: "Jóváhagyott", admisConditionat: "Feltételesen jóváhagyott", respins: "Elutasított" },
    alert: { expired: "Lejárt", urgent: "Sürgős", warning: "Figyelmeztetés", ok: "OK" },
    alertBadge: { expired: "Lejárt", urgent: "Sürgős", warning: "Figyelmeztetés", ok: "OK" },
    tabs: { dashboard: "Irányítópult", equipment: "Berendezések", verifications: "Ellenőrzések", alerts: "Riasztások" },
    stats: { total: "Összes berendezés", active: "Aktív", expired: "Lejárt", stopped: "Leállított" },
    table: { type: "Típus", identifier: "Azonosító", iscirNr: "ISCIR szám", location: "Helyszín", status: "Státusz", verification: "Ellenőrzés", actions: "Műveletek" },
    filter: { allOrgs: "Összes szervezet", allTypes: "Összes típus", allStatuses: "Összes státusz", searchPlaceholder: "Berendezés keresése..." },
    form: { titleAdd: "ISCIR berendezés hozzáadása", titleEdit: "Berendezés szerkesztése", equipmentType: "Berendezés típusa", identifier: "Azonosító", serialNumber: "Sorozatszám", registrationNumber: "Regisztrációs szám", manufacturer: "Gyártó", model: "Modell", manufactureYear: "Gyártási év", capacity: "Kapacitás / Paraméterek", location: "Helyszín", status: "Státusz", authorizationNumber: "Engedély száma", authorizationExpiry: "Engedély lejárata", verifInterval: "Ellenőrzési időköz (hónap)", nextVerifDate: "Következő ellenőrzés dátuma", rsvtiResponsible: "RSVTI felelős", observations: "Megjegyzések", save: "Mentés", saving: "Mentés...", cancel: "Mégse" },
    verifForm: { title: "Ellenőrzés rögzítése", equipment: "Berendezés", verifDate: "Ellenőrzés dátuma", verifType: "Ellenőrzés típusa", result: "Eredmény", inspectorName: "Ellenőr neve", inspectorId: "Ellenőr azonosítója", bulletinNumber: "Bülletin száma", nextVerifDate: "Következő ellenőrzés dátuma", prescriptions: "Előírások", prescriptionsDeadline: "Előírások határideje", saveVerification: "Ellenőrzés mentése" },
    verifications: { title: "Ellenőrzési előzmények", colDate: "Dátum", colType: "Típus", colEquipment: "Berendezés", colResult: "Eredmény", colInspector: "Ellenőr", colBulletin: "Bülletin száma" },
    alertsTab: { title: "Ellenőrzési riasztások", colAlertLevel: "Szint", colDaysLeft: "Hátralévő napok", colVerifDate: "Ellenőrzés dátuma", verify: "Ellenőrzés" },
    timeline: { bulletin: "Bülletin", inspector: "Ellenőr", nextVerif: "Következő ellenőrzés", prescriptions: "Előírások", prescriptionsDeadline: "Előírások határideje" },
    detail: { backToIscir: "Vissza az ISCIR-hez", technicalData: "Műszaki adatok", capacityParams: "Kapacitás / Paraméterek", installDate: "Telepítés dátuma", lastVerif: "Utolsó ellenőrzés", nextVerif: "Következő ellenőrzés", verifInterval: "Ellenőrzési időköz", months: "hónap", daysLeft: "nap van hátra", daysOverdue: "nap késedelemben", authorizationExpiry: "Engedély lejárata", organization: "Szervezet", locationTitle: "Helyszín", rsvtiTitle: "RSVTI felelős", verifHistory: "Ellenőrzési előzmények", verifCalendar: "Ellenőrzési naptár", dailyChecksTitle: "Napi ellenőrzések", dailyCheck: "Napi ellenőrzés", dailyCheckRequired: "Napi ellenőrzés szükséges", noDailyChecks: "Nincs napi ellenőrzés", showAll: "Összes megjelenítése", showLess: "Kevesebb megjelenítése", qrCode: "QR kód", qrError: "QR generálási hiba", qrScanInstruction: "Szkenneld a gyors ellenőrzéshez", operatorPage: "Kezelői oldal", addVerification: "Ellenőrzés hozzáadása", addFirstVerif: "Első ellenőrzés hozzáadása", add: "Hozzáadás", close: "Bezárás", yes: "Igen", no: "Nem" },
    deleteDialog: { title: "Megerősíti a törlést?", message: "A berendezés véglegesen törlődik.", delete: "Törlés", deleting: "Törlés..." },
    empty: { noEquipment: "Nincs berendezés", noVerifications: "Nincs ellenőrzés", noAlerts: "Nincs riasztás" },
    errors: { saveEquipment: "Hiba a berendezés mentésekor", deleteEquipment: "Hiba a berendezés törlésekor", saveVerification: "Hiba az ellenőrzés mentésekor" },
    dailyRow: { operator: "Kezelő", pointsOk: "Pontok OK", issuesFound: "Problémák", signed: "Aláírva" }
  },
  de: {
    title: "ISCIR - Druckgeräte",
    subtitle: "ISCIR-Geräteverwaltung, Prüfungen und Genehmigungen",
    addEquipment: "Gerät hinzufügen",
    recentEquipment: "Neueste Geräte",
    equipmentType: { cazan: "Kessel", recipientPresiune: "Druckbehälter", lift: "Aufzug", macara: "Kran", stivuitor: "Gabelstapler", instalatieGpl: "LPG-Anlage", compresor: "Kompressor", autoclave: "Autoklav", altul: "Sonstige" },
    status: { activ: "Aktiv", expirat: "Abgelaufen", inVerificare: "In Prüfung", oprit: "Gestoppt", casat: "Außer Betrieb" },
    verificationType: { periodica: "Periodisch", accidentala: "Außerordentlich", punereInFunctiune: "Inbetriebnahme", reparatie: "Reparatur", modernizare: "Modernisierung" },
    result: { admis: "Zugelassen", admisConditionat: "Bedingt zugelassen", respins: "Abgelehnt" },
    alert: { expired: "Abgelaufen", urgent: "Dringend", warning: "Warnung", ok: "OK" },
    alertBadge: { expired: "Abgelaufen", urgent: "Dringend", warning: "Warnung", ok: "OK" },
    tabs: { dashboard: "Dashboard", equipment: "Geräte", verifications: "Prüfungen", alerts: "Warnungen" },
    stats: { total: "Geräte gesamt", active: "Aktiv", expired: "Abgelaufen", stopped: "Gestoppt" },
    table: { type: "Typ", identifier: "Kennung", iscirNr: "ISCIR-Nr.", location: "Standort", status: "Status", verification: "Prüfung", actions: "Aktionen" },
    filter: { allOrgs: "Alle Organisationen", allTypes: "Alle Typen", allStatuses: "Alle Status", searchPlaceholder: "Gerät suchen..." },
    form: { titleAdd: "ISCIR-Gerät hinzufügen", titleEdit: "Gerät bearbeiten", equipmentType: "Gerätetyp", identifier: "Kennung", serialNumber: "Seriennummer", registrationNumber: "Registrierungsnummer", manufacturer: "Hersteller", model: "Modell", manufactureYear: "Herstellungsjahr", capacity: "Kapazität / Parameter", location: "Standort", status: "Status", authorizationNumber: "Genehmigungsnummer", authorizationExpiry: "Genehmigungsablauf", verifInterval: "Prüfintervall (Monate)", nextVerifDate: "Datum der nächsten Prüfung", rsvtiResponsible: "RSVTI-Verantwortlicher", observations: "Beobachtungen", save: "Speichern", saving: "Speichern...", cancel: "Abbrechen" },
    verifForm: { title: "Prüfung erfassen", equipment: "Gerät", verifDate: "Prüfdatum", verifType: "Prüfungsart", result: "Ergebnis", inspectorName: "Name des Prüfers", inspectorId: "ID des Prüfers", bulletinNumber: "Protokollnummer", nextVerifDate: "Datum der nächsten Prüfung", prescriptions: "Auflagen", prescriptionsDeadline: "Auflagenfrist", saveVerification: "Prüfung speichern" },
    verifications: { title: "Prüfungshistorie", colDate: "Datum", colType: "Typ", colEquipment: "Gerät", colResult: "Ergebnis", colInspector: "Prüfer", colBulletin: "Protokollnummer" },
    alertsTab: { title: "Prüfungswarnungen", colAlertLevel: "Stufe", colDaysLeft: "Verbleibende Tage", colVerifDate: "Prüfdatum", verify: "Prüfen" },
    timeline: { bulletin: "Protokoll", inspector: "Prüfer", nextVerif: "Nächste Prüfung", prescriptions: "Auflagen", prescriptionsDeadline: "Auflagenfrist" },
    detail: { backToIscir: "Zurück zu ISCIR", technicalData: "Technische Daten", capacityParams: "Kapazität / Parameter", installDate: "Installationsdatum", lastVerif: "Letzte Prüfung", nextVerif: "Nächste Prüfung", verifInterval: "Prüfintervall", months: "Monate", daysLeft: "Tage verbleibend", daysOverdue: "Tage überfällig", authorizationExpiry: "Genehmigungsablauf", organization: "Organisation", locationTitle: "Standort", rsvtiTitle: "RSVTI-Verantwortlicher", verifHistory: "Prüfungshistorie", verifCalendar: "Prüfungskalender", dailyChecksTitle: "Tägliche Prüfungen", dailyCheck: "Tägliche Prüfung", dailyCheckRequired: "Tägliche Prüfung erforderlich", noDailyChecks: "Keine täglichen Prüfungen", showAll: "Alle anzeigen", showLess: "Weniger anzeigen", qrCode: "QR-Code", qrError: "QR-Generierungsfehler", qrScanInstruction: "Scannen für schnelle Prüfung", operatorPage: "Bedienerseite", addVerification: "Prüfung hinzufügen", addFirstVerif: "Erste Prüfung hinzufügen", add: "Hinzufügen", close: "Schließen", yes: "Ja", no: "Nein" },
    deleteDialog: { title: "Löschung bestätigen?", message: "Das Gerät wird endgültig gelöscht.", delete: "Löschen", deleting: "Löschen..." },
    empty: { noEquipment: "Keine Geräte", noVerifications: "Keine Prüfungen", noAlerts: "Keine Warnungen" },
    errors: { saveEquipment: "Fehler beim Speichern des Geräts", deleteEquipment: "Fehler beim Löschen des Geräts", saveVerification: "Fehler beim Speichern der Prüfung" },
    dailyRow: { operator: "Bediener", pointsOk: "Punkte OK", issuesFound: "Probleme", signed: "Unterzeichnet" }
  },
  pl: {
    title: "ISCIR - Urządzenia ciśnieniowe",
    subtitle: "Zarządzanie urządzeniami ISCIR, kontrole i zezwolenia",
    addEquipment: "Dodaj urządzenie",
    recentEquipment: "Ostatnie urządzenia",
    equipmentType: { cazan: "Kocioł", recipientPresiune: "Zbiornik ciśnieniowy", lift: "Winda", macara: "Dźwig", stivuitor: "Wózek widłowy", instalatieGpl: "Instalacja LPG", compresor: "Kompresor", autoclave: "Autoklaw", altul: "Inne" },
    status: { activ: "Aktywny", expirat: "Wygasły", inVerificare: "W trakcie kontroli", oprit: "Zatrzymany", casat: "Wycofany z eksploatacji" },
    verificationType: { periodica: "Okresowa", accidentala: "Awaryjna", punereInFunctiune: "Uruchomienie", reparatie: "Naprawa", modernizare: "Modernizacja" },
    result: { admis: "Zatwierdzony", admisConditionat: "Warunkowo zatwierdzony", respins: "Odrzucony" },
    alert: { expired: "Wygasły", urgent: "Pilny", warning: "Ostrzeżenie", ok: "OK" },
    alertBadge: { expired: "Wygasły", urgent: "Pilny", warning: "Ostrzeżenie", ok: "OK" },
    tabs: { dashboard: "Pulpit", equipment: "Urządzenia", verifications: "Kontrole", alerts: "Alerty" },
    stats: { total: "Łączna liczba urządzeń", active: "Aktywne", expired: "Wygasłe", stopped: "Zatrzymane" },
    table: { type: "Typ", identifier: "Identyfikator", iscirNr: "Nr ISCIR", location: "Lokalizacja", status: "Status", verification: "Kontrola", actions: "Akcje" },
    filter: { allOrgs: "Wszystkie organizacje", allTypes: "Wszystkie typy", allStatuses: "Wszystkie statusy", searchPlaceholder: "Szukaj urządzenia..." },
    form: { titleAdd: "Dodaj urządzenie ISCIR", titleEdit: "Edytuj urządzenie", equipmentType: "Typ urządzenia", identifier: "Identyfikator", serialNumber: "Numer seryjny", registrationNumber: "Numer rejestracyjny", manufacturer: "Producent", model: "Model", manufactureYear: "Rok produkcji", capacity: "Pojemność / Parametry", location: "Lokalizacja", status: "Status", authorizationNumber: "Nr zezwolenia", authorizationExpiry: "Wygaśnięcie zezwolenia", verifInterval: "Interwał kontroli (miesiące)", nextVerifDate: "Data następnej kontroli", rsvtiResponsible: "Odpowiedzialny RSVTI", observations: "Obserwacje", save: "Zapisz", saving: "Zapisywanie...", cancel: "Anuluj" },
    verifForm: { title: "Zarejestruj kontrolę", equipment: "Urządzenie", verifDate: "Data kontroli", verifType: "Typ kontroli", result: "Wynik", inspectorName: "Imię i nazwisko inspektora", inspectorId: "ID inspektora", bulletinNumber: "Nr protokołu", nextVerifDate: "Data następnej kontroli", prescriptions: "Zalecenia", prescriptionsDeadline: "Termin zaleceń", saveVerification: "Zapisz kontrolę" },
    verifications: { title: "Historia kontroli", colDate: "Data", colType: "Typ", colEquipment: "Urządzenie", colResult: "Wynik", colInspector: "Inspektor", colBulletin: "Nr protokołu" },
    alertsTab: { title: "Alerty kontroli", colAlertLevel: "Poziom", colDaysLeft: "Pozostałe dni", colVerifDate: "Data kontroli", verify: "Sprawdź" },
    timeline: { bulletin: "Protokół", inspector: "Inspektor", nextVerif: "Następna kontrola", prescriptions: "Zalecenia", prescriptionsDeadline: "Termin zaleceń" },
    detail: { backToIscir: "Powrót do ISCIR", technicalData: "Dane techniczne", capacityParams: "Pojemność / Parametry", installDate: "Data instalacji", lastVerif: "Ostatnia kontrola", nextVerif: "Następna kontrola", verifInterval: "Interwał kontroli", months: "miesięcy", daysLeft: "dni pozostało", daysOverdue: "dni przeterminowania", authorizationExpiry: "Wygaśnięcie zezwolenia", organization: "Organizacja", locationTitle: "Lokalizacja", rsvtiTitle: "Odpowiedzialny RSVTI", verifHistory: "Historia kontroli", verifCalendar: "Kalendarz kontroli", dailyChecksTitle: "Codzienne kontrole", dailyCheck: "Codzienna kontrola", dailyCheckRequired: "Wymaga codziennej kontroli", noDailyChecks: "Brak codziennych kontroli", showAll: "Pokaż wszystkie", showLess: "Pokaż mniej", qrCode: "Kod QR", qrError: "Błąd generowania QR", qrScanInstruction: "Skanuj do szybkiej weryfikacji", operatorPage: "Strona operatora", addVerification: "Dodaj kontrolę", addFirstVerif: "Dodaj pierwszą kontrolę", add: "Dodaj", close: "Zamknij", yes: "Tak", no: "Nie" },
    deleteDialog: { title: "Potwierdzasz usunięcie?", message: "Urządzenie zostanie trwale usunięte.", delete: "Usuń", deleting: "Usuwanie..." },
    empty: { noEquipment: "Brak urządzeń", noVerifications: "Brak kontroli", noAlerts: "Brak alertów" },
    errors: { saveEquipment: "Błąd podczas zapisywania urządzenia", deleteEquipment: "Błąd podczas usuwania urządzenia", saveVerification: "Błąd podczas zapisywania kontroli" },
    dailyRow: { operator: "Operator", pointsOk: "Punkty OK", issuesFound: "Problemy", signed: "Podpisane" }
  }
};

// ─── MERGE & WRITE ────────────────────────────────────────────────────────────

const locales = ['ro', 'en', 'bg', 'hu', 'de', 'pl'];

let totalAdded = 0;

for (const locale of locales) {
  const filePath = path.join(messagesDir, `${locale}.json`);
  const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  let added = [];

  if (!existing.gdpr) {
    existing.gdpr = gdpr[locale];
    added.push('gdpr');
  } else {
    console.log(`  [SKIP] ${locale}.json already has "gdpr"`);
  }

  if (!existing.medical) {
    existing.medical = medical[locale];
    added.push('medical');
  } else {
    console.log(`  [SKIP] ${locale}.json already has "medical"`);
  }

  if (!existing.iscir) {
    existing.iscir = iscir[locale];
    added.push('iscir');
  } else {
    console.log(`  [SKIP] ${locale}.json already has "iscir"`);
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
