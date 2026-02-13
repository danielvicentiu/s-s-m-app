/**
 * Empty State Configurations
 *
 * Centralized configuration for empty states across all dashboard sections.
 * Supports 6 languages: RO, EN, BG, HU, DE, FR
 */

export interface EmptyStateConfig {
  title: {
    ro: string;
    en: string;
    bg: string;
    hu: string;
    de: string;
    fr: string;
  };
  description: {
    ro: string;
    en: string;
    bg: string;
    hu: string;
    de: string;
    fr: string;
  };
  actionLabel: {
    ro: string;
    en: string;
    bg: string;
    hu: string;
    de: string;
    fr: string;
  };
  actionHref: string;
}

export const emptyStateConfigs: Record<string, EmptyStateConfig> = {
  employees: {
    title: {
      ro: "Niciun angajat adăugat",
      en: "No employees added",
      bg: "Няма добавени служители",
      hu: "Nincs hozzáadott alkalmazott",
      de: "Keine Mitarbeiter hinzugefügt",
      fr: "Aucun employé ajouté"
    },
    description: {
      ro: "Adaugă primul angajat pentru a începe gestionarea dosarelor de securitate și sănătate în muncă.",
      en: "Add your first employee to start managing occupational health and safety records.",
      bg: "Добавете първия служител, за да започнете управлението на записи за здраве и безопасност при работа.",
      hu: "Adja hozzá az első alkalmazottat a munkahelyi egészségügyi és biztonsági nyilvántartások kezeléséhez.",
      de: "Fügen Sie Ihren ersten Mitarbeiter hinzu, um mit der Verwaltung der Arbeitsschutzunterlagen zu beginnen.",
      fr: "Ajoutez votre premier employé pour commencer à gérer les dossiers de santé et sécurité au travail."
    },
    actionLabel: {
      ro: "Adaugă angajat",
      en: "Add employee",
      bg: "Добавяне на служител",
      hu: "Alkalmazott hozzáadása",
      de: "Mitarbeiter hinzufügen",
      fr: "Ajouter un employé"
    },
    actionHref: "/dashboard/employees/new"
  },

  trainings: {
    title: {
      ro: "Niciun instructaj înregistrat",
      en: "No trainings recorded",
      bg: "Няма записани обучения",
      hu: "Nincs rögzített képzés",
      de: "Keine Schulungen erfasst",
      fr: "Aucune formation enregistrée"
    },
    description: {
      ro: "Începe să înregistrezi instructajele de securitate și sănătate în muncă pentru angajații tăi.",
      en: "Start recording occupational health and safety trainings for your employees.",
      bg: "Започнете да записвате обучения по здраве и безопасност при работа за вашите служители.",
      hu: "Kezdje el rögzíteni a munkahelyi egészségügyi és biztonsági képzéseket alkalmazottai számára.",
      de: "Beginnen Sie mit der Erfassung von Arbeitsschutzschulungen für Ihre Mitarbeiter.",
      fr: "Commencez à enregistrer les formations en santé et sécurité au travail pour vos employés."
    },
    actionLabel: {
      ro: "Adaugă instructaj",
      en: "Add training",
      bg: "Добавяне на обучение",
      hu: "Képzés hozzáadása",
      de: "Schulung hinzufügen",
      fr: "Ajouter une formation"
    },
    actionHref: "/dashboard/trainings/new"
  },

  medical: {
    title: {
      ro: "Nicio fișă medicală",
      en: "No medical records",
      bg: "Няма медицински досиета",
      hu: "Nincs egészségügyi karton",
      de: "Keine Gesundheitsakten",
      fr: "Aucun dossier médical"
    },
    description: {
      ro: "Adaugă fișele medicale ale angajaților pentru a urmări examenele periodice și recomandările medicale.",
      en: "Add employee medical records to track periodic examinations and medical recommendations.",
      bg: "Добавете медицински досиета на служителите, за да проследявате периодични прегледи и медицински препоръки.",
      hu: "Adjon hozzá alkalmazotti egészségügyi kartonokat az időszakos vizsgálatok és orvosi ajánlások nyomon követéséhez.",
      de: "Fügen Sie Gesundheitsakten der Mitarbeiter hinzu, um regelmäßige Untersuchungen und medizinische Empfehlungen zu verfolgen.",
      fr: "Ajoutez des dossiers médicaux des employés pour suivre les examens périodiques et les recommandations médicales."
    },
    actionLabel: {
      ro: "Adaugă fișă medicală",
      en: "Add medical record",
      bg: "Добавяне на медицинско досие",
      hu: "Egészségügyi karton hozzáadása",
      de: "Gesundheitsakte hinzufügen",
      fr: "Ajouter un dossier médical"
    },
    actionHref: "/dashboard/medical/new"
  },

  equipment: {
    title: {
      ro: "Niciun echipament înregistrat",
      en: "No equipment registered",
      bg: "Няма регистрирано оборудване",
      hu: "Nincs regisztrált felszerelés",
      de: "Keine Ausrüstung registriert",
      fr: "Aucun équipement enregistré"
    },
    description: {
      ro: "Adaugă echipamentele de protecție și utilajele pentru a gestiona verificările periodice și documentația tehnică.",
      en: "Add protective equipment and machinery to manage periodic inspections and technical documentation.",
      bg: "Добавете предпазно оборудване и машини за управление на периодични проверки и техническа документация.",
      hu: "Adjon hozzá védőfelszereléseket és gépeket az időszakos ellenőrzések és műszaki dokumentáció kezeléséhez.",
      de: "Fügen Sie Schutzausrüstung und Maschinen hinzu, um regelmäßige Inspektionen und technische Dokumentation zu verwalten.",
      fr: "Ajoutez des équipements de protection et des machines pour gérer les inspections périodiques et la documentation technique."
    },
    actionLabel: {
      ro: "Adaugă echipament",
      en: "Add equipment",
      bg: "Добавяне на оборудване",
      hu: "Felszerelés hozzáadása",
      de: "Ausrüstung hinzufügen",
      fr: "Ajouter un équipement"
    },
    actionHref: "/dashboard/equipment/new"
  },

  documents: {
    title: {
      ro: "Niciun document încărcat",
      en: "No documents uploaded",
      bg: "Няма качени документи",
      hu: "Nincs feltöltött dokumentum",
      de: "Keine Dokumente hochgeladen",
      fr: "Aucun document téléchargé"
    },
    description: {
      ro: "Încarcă și organizează documentele SSM/PSI: proceduri, instrucțiuni, planuri de evacuare și alte acte necesare.",
      en: "Upload and organize OSH/Fire safety documents: procedures, instructions, evacuation plans and other required documents.",
      bg: "Качете и организирайте документи за БЗР/пожарна безопасност: процедури, инструкции, планове за евакуация и други необходими документи.",
      hu: "Töltsön fel és rendszerezzen munkavédelmi/tűzvédelmi dokumentumokat: eljárások, utasítások, evakuációs tervek és egyéb szükséges dokumentumok.",
      de: "Laden Sie Arbeitsschutz-/Brandschutzdokumente hoch und organisieren Sie diese: Verfahren, Anweisungen, Evakuierungspläne und andere erforderliche Dokumente.",
      fr: "Téléchargez et organisez les documents SST/sécurité incendie : procédures, instructions, plans d'évacuation et autres documents requis."
    },
    actionLabel: {
      ro: "Încarcă document",
      en: "Upload document",
      bg: "Качване на документ",
      hu: "Dokumentum feltöltése",
      de: "Dokument hochladen",
      fr: "Télécharger un document"
    },
    actionHref: "/dashboard/documents/upload"
  },

  alerts: {
    title: {
      ro: "Nicio alertă activă",
      en: "No active alerts",
      bg: "Няма активни предупреждения",
      hu: "Nincs aktív figyelmeztetés",
      de: "Keine aktiven Warnungen",
      fr: "Aucune alerte active"
    },
    description: {
      ro: "Toate documentele și verificările sunt la zi. Vei fi notificat automat când se apropie termenele de valabilitate.",
      en: "All documents and inspections are up to date. You will be automatically notified when validity deadlines approach.",
      bg: "Всички документи и проверки са актуални. Ще бъдете автоматично уведомени, когато наближават крайни срокове за валидност.",
      hu: "Minden dokumentum és ellenőrzés naprakész. Automatikusan értesítést kap, amikor közelednek az érvényességi határidők.",
      de: "Alle Dokumente und Inspektionen sind auf dem neuesten Stand. Sie werden automatisch benachrichtigt, wenn Gültigkeitsfristen näher rücken.",
      fr: "Tous les documents et inspections sont à jour. Vous serez automatiquement notifié lorsque les échéances de validité approchent."
    },
    actionLabel: {
      ro: "Verifică documentele",
      en: "Check documents",
      bg: "Проверка на документи",
      hu: "Dokumentumok ellenőrzése",
      de: "Dokumente überprüfen",
      fr: "Vérifier les documents"
    },
    actionHref: "/dashboard/documents"
  },

  reports: {
    title: {
      ro: "Niciun raport generat",
      en: "No reports generated",
      bg: "Няма генерирани отчети",
      hu: "Nincs létrehozott jelentés",
      de: "Keine Berichte erstellt",
      fr: "Aucun rapport généré"
    },
    description: {
      ro: "Generează rapoarte SSM/PSI pentru a vizualiza statistici, compliance și evoluția indicatorilor de siguranță.",
      en: "Generate OSH/Fire safety reports to visualize statistics, compliance and safety indicators evolution.",
      bg: "Генерирайте отчети за БЗР/пожарна безопасност за визуализиране на статистика, съответствие и развитие на показателите за безопасност.",
      hu: "Hozzon létre munkavédelmi/tűzvédelmi jelentéseket a statisztikák, megfelelőség és biztonsági mutatók alakulásának megjelenítéséhez.",
      de: "Erstellen Sie Arbeitsschutz-/Brandschutzberichte, um Statistiken, Compliance und die Entwicklung von Sicherheitsindikatoren zu visualisieren.",
      fr: "Générez des rapports SST/sécurité incendie pour visualiser les statistiques, la conformité et l'évolution des indicateurs de sécurité."
    },
    actionLabel: {
      ro: "Generează raport",
      en: "Generate report",
      bg: "Генериране на отчет",
      hu: "Jelentés létrehozása",
      de: "Bericht erstellen",
      fr: "Générer un rapport"
    },
    actionHref: "/dashboard/reports/new"
  },

  incidents: {
    title: {
      ro: "Niciun incident înregistrat",
      en: "No incidents recorded",
      bg: "Няма записани инциденти",
      hu: "Nincs rögzített esemény",
      de: "Keine Vorfälle erfasst",
      fr: "Aucun incident enregistré"
    },
    description: {
      ro: "Înregistrează evenimentele și incidentele de muncă pentru a menține istoric complet și a îmbunătăți măsurile de prevenție.",
      en: "Record work events and incidents to maintain complete history and improve prevention measures.",
      bg: "Записвайте работни събития и инциденти, за да поддържате пълна история и да подобрите мерките за превенция.",
      hu: "Rögzítse a munkahelyi eseményeket és incidenseket a teljes előzmények megőrzése és a megelőző intézkedések javítása érdekében.",
      de: "Erfassen Sie Arbeitsereignisse und Vorfälle, um eine vollständige Historie zu führen und Präventivmaßnahmen zu verbessern.",
      fr: "Enregistrez les événements et incidents de travail pour maintenir un historique complet et améliorer les mesures de prévention."
    },
    actionLabel: {
      ro: "Înregistrează incident",
      en: "Record incident",
      bg: "Записване на инцидент",
      hu: "Esemény rögzítése",
      de: "Vorfall erfassen",
      fr: "Enregistrer un incident"
    },
    actionHref: "/dashboard/incidents/new"
  },

  departments: {
    title: {
      ro: "Niciun departament creat",
      en: "No departments created",
      bg: "Няма създадени отдели",
      hu: "Nincs létrehozott osztály",
      de: "Keine Abteilungen erstellt",
      fr: "Aucun département créé"
    },
    description: {
      ro: "Organizează angajații pe departamente pentru o gestionare mai eficientă a responsabilităților și documentației SSM/PSI.",
      en: "Organize employees by departments for more efficient management of OSH/Fire safety responsibilities and documentation.",
      bg: "Организирайте служителите по отдели за по-ефективно управление на отговорностите и документацията за БЗР/пожарна безопасност.",
      hu: "Rendszerezze az alkalmazottakat osztályok szerint a munkavédelmi/tűzvédelmi felelősségek és dokumentáció hatékonyabb kezeléséhez.",
      de: "Organisieren Sie Mitarbeiter nach Abteilungen für eine effizientere Verwaltung von Arbeitsschutz-/Brandschutzverantwortlichkeiten und -dokumentation.",
      fr: "Organisez les employés par départements pour une gestion plus efficace des responsabilités et de la documentation SST/sécurité incendie."
    },
    actionLabel: {
      ro: "Creează departament",
      en: "Create department",
      bg: "Създаване на отдел",
      hu: "Osztály létrehozása",
      de: "Abteilung erstellen",
      fr: "Créer un département"
    },
    actionHref: "/dashboard/departments/new"
  },

  activity: {
    title: {
      ro: "Nicio activitate recent",
      en: "No recent activity",
      bg: "Няма скорошна активност",
      hu: "Nincs közelmúltbeli tevékenység",
      de: "Keine aktuelle Aktivität",
      fr: "Aucune activité récente"
    },
    description: {
      ro: "Istoricul activităților va apărea aici pe măsură ce utilizezi platforma. Vei putea urmări toate modificările importante.",
      en: "Activity history will appear here as you use the platform. You will be able to track all important changes.",
      bg: "Историята на дейностите ще се появи тук, докато използвате платформата. Ще можете да проследявате всички важни промени.",
      hu: "A tevékenység előzményei itt jelennek meg a platform használata során. Nyomon követheti az összes fontos módosítást.",
      de: "Der Aktivitätsverlauf wird hier angezeigt, während Sie die Plattform nutzen. Sie können alle wichtigen Änderungen verfolgen.",
      fr: "L'historique des activités apparaîtra ici au fur et à mesure que vous utilisez la plateforme. Vous pourrez suivre tous les changements importants."
    },
    actionLabel: {
      ro: "Accesează dashboard",
      en: "Go to dashboard",
      bg: "Към таблото",
      hu: "Ugrás a vezérlőpultra",
      de: "Zum Dashboard",
      fr: "Accéder au tableau de bord"
    },
    actionHref: "/dashboard"
  }
};

/**
 * Helper function to get empty state config for a specific section and locale
 */
export function getEmptyStateConfig(
  section: keyof typeof emptyStateConfigs,
  locale: 'ro' | 'en' | 'bg' | 'hu' | 'de' | 'fr' = 'ro'
) {
  const config = emptyStateConfigs[section];

  if (!config) {
    return null;
  }

  return {
    title: config.title[locale],
    description: config.description[locale],
    actionLabel: config.actionLabel[locale],
    actionHref: config.actionHref
  };
}
