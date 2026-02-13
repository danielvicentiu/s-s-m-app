/**
 * SSM/PSI Glossary - Multilingual terminology database
 *
 * Languages: RO (Romanian), BG (Bulgarian), EN (English), HU (Hungarian), DE (German), FR (French)
 * Categories: safety, health, fire, equipment, documentation, training, legal
 */

export interface GlossaryTerm {
  id: string;
  term: {
    ro: string;
    bg: string;
    en: string;
    hu: string;
    de: string;
    fr: string;
  };
  definition: {
    ro: string;
    bg: string;
    en: string;
    hu: string;
    de: string;
    fr: string;
  };
  category: 'safety' | 'health' | 'fire' | 'equipment' | 'documentation' | 'training' | 'legal';
  relatedTerms: string[];
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    id: 'accident_munca',
    term: {
      ro: 'Accident de muncă',
      bg: 'Трудова злополука',
      en: 'Work accident',
      hu: 'Munkabaleset',
      de: 'Arbeitsunfall',
      fr: 'Accident du travail'
    },
    definition: {
      ro: 'Vătămarea violentă a organismului, precum și intoxicația acută profesională, care au loc în timpul procesului de muncă sau în îndeplinirea îndatoririlor de serviciu și care provoacă incapacitate temporară de muncă de cel puțin 3 zile calendaristice, invaliditate sau deces.',
      bg: 'Насилствено увреждане на организма, както и остра професионална интоксикация, които се случват по време на работния процес или при изпълнение на служебни задължения и причиняват временна неработоспособност от най-малко 3 календарни дни, инвалидност или смърт.',
      en: 'Violent injury to the body, as well as acute occupational intoxication, occurring during the work process or in the performance of official duties and causing temporary incapacity for work of at least 3 calendar days, disability or death.',
      hu: 'A szervezet erőszakos sérülése, valamint akut foglalkozási mérgezés, amely a munkavégzés során vagy a szolgálati kötelezettségek teljesítése közben következik be, és legalább 3 naptári napos munkaképtelenséget, rokkantsá válást vagy halált okoz.',
      de: 'Gewaltsame Verletzung des Körpers sowie akute Berufsvergiftung, die während des Arbeitsprozesses oder bei der Ausführung dienstlicher Pflichten auftreten und eine vorübergehende Arbeitsunfähigkeit von mindestens 3 Kalendertagen, Invalidität oder Tod verursachen.',
      fr: 'Lésion violente du corps ainsi que l\'intoxication professionnelle aiguë survenant au cours du processus de travail ou dans l\'exercice des fonctions officielles et causant une incapacité temporaire de travail d\'au moins 3 jours calendaires, une invalidité ou un décès.'
    },
    category: 'safety',
    relatedTerms: ['incident', 'investigare_accident', 'declarare_accident', 'registru_accidente']
  },
  {
    id: 'boala_profesionala',
    term: {
      ro: 'Boală profesională',
      bg: 'Професионално заболяване',
      en: 'Occupational disease',
      hu: 'Foglalkozási megbetegedés',
      de: 'Berufskrankheit',
      fr: 'Maladie professionnelle'
    },
    definition: {
      ro: 'Afecțiune care se produce ca urmare a exercitării unei meserii sau profesii, cauzată de agenți nocivi fizici, chimici sau biologici caracteristici locului de muncă, precum și de suprasolicitarea diferitelor organe sau sisteme ale organismului, în procesul de muncă.',
      bg: 'Заболяване, което възниква в резултат на упражняване на занаят или професия, причинено от физически, химически или биологични вредни фактори, характерни за работното място, както и от претоварване на различни органи или системи на организма в трудовия процес.',
      en: 'Disease that occurs as a result of practicing a trade or profession, caused by physical, chemical or biological harmful agents characteristic of the workplace, as well as by overloading of various organs or systems of the body during the work process.',
      hu: 'Betegség, amely foglalkozás vagy szakma gyakorlása következtében lép fel, amelyet a munkahelyre jellemző fizikai, kémiai vagy biológiai káros tényezők, valamint a szervezet különböző szervei vagy rendszerei túlterhelése okoz a munkavégzés során.',
      de: 'Erkrankung, die als Folge der Ausübung eines Handwerks oder Berufs auftritt, verursacht durch physikalische, chemische oder biologische schädliche Faktoren, die für den Arbeitsplatz charakteristisch sind, sowie durch Überlastung verschiedener Organe oder Systeme des Körpers während des Arbeitsprozesses.',
      fr: 'Maladie qui survient à la suite de l\'exercice d\'un métier ou d\'une profession, causée par des agents nocifs physiques, chimiques ou biologiques caractéristiques du lieu de travail, ainsi que par la surcharge de divers organes ou systèmes de l\'organisme au cours du processus de travail.'
    },
    category: 'health',
    relatedTerms: ['medicina_muncii', 'control_medical', 'factor_risc', 'agent_nociv']
  },
  {
    id: 'evaluare_riscuri',
    term: {
      ro: 'Evaluare de riscuri',
      bg: 'Оценка на риска',
      en: 'Risk assessment',
      hu: 'Kockázatértékelés',
      de: 'Risikobeurteilung',
      fr: 'Évaluation des risques'
    },
    definition: {
      ro: 'Procesul de evaluare a riscurilor pentru securitatea și sănătatea lucrătorilor ce derivă din prezența factorilor de risc la locul de muncă. Include identificarea factorilor de risc, identificarea lucrătorilor expuși și evaluarea nivelului de risc.',
      bg: 'Процес на оценка на рисковете за безопасността и здравето на работниците, произтичащи от наличието на рискови фактори на работното място. Включва идентифициране на рисковите фактори, идентифициране на експонираните работници и оценка на нивото на риск.',
      en: 'The process of assessing risks to the safety and health of workers arising from the presence of risk factors in the workplace. Includes identification of risk factors, identification of exposed workers and assessment of the level of risk.',
      hu: 'A munkavállalók biztonságát és egészségét fenyegető, a munkahelyen jelenlévő kockázati tényezőkből eredő kockázatok értékelésének folyamata. Magában foglalja a kockázati tényezők azonosítását, az exponált munkavállalók azonosítását és a kockázat szintjének értékelését.',
      de: 'Der Prozess der Bewertung von Risiken für die Sicherheit und Gesundheit der Arbeitnehmer, die sich aus dem Vorhandensein von Risikofaktoren am Arbeitsplatz ergeben. Umfasst die Identifizierung von Risikofaktoren, die Identifizierung exponierter Arbeitnehmer und die Bewertung des Risikoniveaus.',
      fr: 'Le processus d\'évaluation des risques pour la sécurité et la santé des travailleurs découlant de la présence de facteurs de risque sur le lieu de travail. Comprend l\'identification des facteurs de risque, l\'identification des travailleurs exposés et l\'évaluation du niveau de risque.'
    },
    category: 'safety',
    relatedTerms: ['factor_risc', 'masuri_protectie', 'plan_prevenire', 'reevaluare']
  },
  {
    id: 'eip',
    term: {
      ro: 'EIP (Echipament Individual de Protecție)',
      bg: 'ЛПС (Лични предпазни средства)',
      en: 'PPE (Personal Protective Equipment)',
      hu: 'EV (Egyéni védőeszköz)',
      de: 'PSA (Persönliche Schutzausrüstung)',
      fr: 'EPI (Équipement de protection individuelle)'
    },
    definition: {
      ro: 'Echipament destinat a fi purtat sau mânuit de lucrător pentru a-l proteja împotriva unuia sau mai multor riscuri care ar putea să îi pună în pericol sănătatea și securitatea la locul de muncă. Include căști, mănuși, ochelari, încălțăminte de protecție, haine de protecție etc.',
      bg: 'Оборудване, предназначено да се носи или използва от работника, за да го защити от един или повече рискове, които биха могли да застрашат здравето и безопасността му на работното място. Включва каски, ръкавици, очила, предпазна обувка, защитно облекло и др.',
      en: 'Equipment designed to be worn or held by a worker to protect against one or more risks that could endanger their health and safety at work. Includes helmets, gloves, goggles, safety footwear, protective clothing, etc.',
      hu: 'Olyan eszközök, amelyeket a munkavállaló visel vagy használ, hogy megvédje magát egy vagy több olyan kockázattól, amely veszélyeztetheti egészségét és biztonságát a munkahelyen. Ide tartoznak a sisakok, kesztyűk, szemüvegek, védőcipők, védőruházat stb.',
      de: 'Ausrüstung, die vom Arbeitnehmer getragen oder gehalten werden soll, um ihn vor einem oder mehreren Risiken zu schützen, die seine Gesundheit und Sicherheit am Arbeitsplatz gefährden könnten. Umfasst Helme, Handschuhe, Schutzbrillen, Sicherheitsschuhe, Schutzkleidung usw.',
      fr: 'Équipement destiné à être porté ou tenu par un travailleur pour le protéger contre un ou plusieurs risques susceptibles de menacer sa santé et sa sécurité au travail. Comprend les casques, gants, lunettes, chaussures de sécurité, vêtements de protection, etc.'
    },
    category: 'equipment',
    relatedTerms: ['dotare_eip', 'verificare_eip', 'norme_dotare', 'declaratie_conformitate']
  },
  {
    id: 'lucratori_desemnati',
    term: {
      ro: 'Lucrători desemnați',
      bg: 'Определени работници',
      en: 'Designated workers',
      hu: 'Kijelölt munkavállalók',
      de: 'Benannte Arbeitnehmer',
      fr: 'Travailleurs désignés'
    },
    definition: {
      ro: 'Lucrători desemnați de angajator pentru a se ocupa de activitățile de protecție și de activitățile de prevenire a riscurilor profesionale în întreprindere și/sau unitate. Trebuie să aibă pregătire de specialitate.',
      bg: 'Работници, определени от работодателя да се занимават с дейности по защита и превенция на професионалните рискове в предприятието и/или звеното. Трябва да имат специална подготовка.',
      en: 'Workers designated by the employer to deal with protection activities and prevention of occupational risks in the company and/or unit. Must have specialized training.',
      hu: 'A munkáltató által kijelölt munkavállalók, akik a vállalkozásban és/vagy egységben a foglalkozási kockázatok megelőzésével és védelmi tevékenységekkel foglalkoznak. Szakképzettséggel kell rendelkezniük.',
      de: 'Vom Arbeitgeber benannte Arbeitnehmer, die sich mit Schutzaktivitäten und der Vorbeugung von Berufsrisiken im Unternehmen und/oder in der Einheit befassen. Müssen über eine Fachausbildung verfügen.',
      fr: 'Travailleurs désignés par l\'employeur pour s\'occuper des activités de protection et de prévention des risques professionnels dans l\'entreprise et/ou l\'unité. Doivent avoir une formation spécialisée.'
    },
    category: 'safety',
    relatedTerms: ['cssm', 'responsabil_ssm', 'serviciu_intern', 'serviciu_extern']
  },
  {
    id: 'cssm',
    term: {
      ro: 'CSSM (Comitet de Securitate și Sănătate în Muncă)',
      bg: 'КБЗР (Комитет по безопасност и здраве при работа)',
      en: 'OSH Committee (Occupational Safety and Health Committee)',
      hu: 'MBB (Munkavédelmi és Biztonsági Bizottság)',
      de: 'ASA (Arbeitsschutzausschuss)',
      fr: 'CSSCT (Comité de santé, sécurité et conditions de travail)'
    },
    definition: {
      ro: 'Grup de lucru paritetic constituit la nivelul angajatorului, având ca scop asigurarea implicării lucrătorilor la elaborarea și aplicarea deciziilor în domeniul securității și sănătății în muncă. Obligatoriu pentru angajatorii cu minimum 50 de lucrători.',
      bg: 'Паритетна работна група, създадена на нивото на работодателя, с цел осигуряване на участието на работниците в разработването и прилагането на решения в областта на безопасността и здравето при работа. Задължителен за работодатели с минимум 50 работника.',
      en: 'Parity working group established at employer level, aimed at ensuring worker involvement in the development and implementation of decisions in the field of occupational safety and health. Mandatory for employers with a minimum of 50 workers.',
      hu: 'Paritásos munkacsoport, amely a munkáltató szintjén jön létre a munkavállalók bevonásának biztosítása céljából a munkavédelmi és munkaegészségügyi döntések kidolgozásába és végrehajtásába. Kötelező az 50 vagy több munkavállalót foglalkoztató munkáltatók számára.',
      de: 'Paritätische Arbeitsgruppe auf Arbeitgeberebene, die darauf abzielt, die Beteiligung der Arbeitnehmer an der Entwicklung und Umsetzung von Entscheidungen im Bereich Arbeitssicherheit und Gesundheitsschutz sicherzustellen. Obligatorisch für Arbeitgeber mit mindestens 50 Arbeitnehmern.',
      fr: 'Groupe de travail paritaire constitué au niveau de l\'employeur, visant à garantir l\'implication des travailleurs dans l\'élaboration et la mise en œuvre des décisions dans le domaine de la sécurité et de la santé au travail. Obligatoire pour les employeurs de 50 travailleurs minimum.'
    },
    category: 'legal',
    relatedTerms: ['lucratori_desemnati', 'reprezentant_lucratori', 'sedinta_cssm', 'proces_verbal']
  },
  {
    id: 'plan_prevenire',
    term: {
      ro: 'Plan de prevenire și protecție',
      bg: 'План за превенция и защита',
      en: 'Prevention and protection plan',
      hu: 'Megelőzési és védelmi terv',
      de: 'Präventions- und Schutzplan',
      fr: 'Plan de prévention et de protection'
    },
    definition: {
      ro: 'Document ce cuprinde măsurile de prevenire și protecție ce trebuie luate la nivelul angajatorului, pe baza evaluării riscurilor și a reglementărilor legale în vigoare. Include măsuri tehnice, organizatorice, igienico-sanitare și de altă natură.',
      bg: 'Документ, съдържащ мерките за превенция и защита, които трябва да бъдат взети на нивото на работодателя, въз основа на оценката на риска и действащите нормативни разпоредби. Включва технически, организационни, хигиенни и други мерки.',
      en: 'Document containing the prevention and protection measures to be taken at employer level, based on risk assessment and current legal regulations. Includes technical, organizational, hygiene and other measures.',
      hu: 'A munkáltatói szinten meghozandó megelőzési és védelmi intézkedéseket tartalmazó dokumentum, amely a kockázatértékelésen és a hatályos jogszabályokon alapul. Műszaki, szervezési, higiéniai és egyéb intézkedéseket tartalmaz.',
      de: 'Dokument mit den Präventions- und Schutzmaßnahmen, die auf Arbeitgeberebene auf der Grundlage der Risikobewertung und der geltenden Rechtsvorschriften zu ergreifen sind. Umfasst technische, organisatorische, hygienische und andere Maßnahmen.',
      fr: 'Document contenant les mesures de prévention et de protection à prendre au niveau de l\'employeur, basées sur l\'évaluation des risques et la réglementation en vigueur. Comprend des mesures techniques, organisationnelles, d\'hygiène et autres.'
    },
    category: 'documentation',
    relatedTerms: ['evaluare_riscuri', 'masuri_protectie', 'plan_actiune', 'reevaluare']
  },
  {
    id: 'fisa_instruire',
    term: {
      ro: 'Fișă de instruire',
      bg: 'Карта за инструктаж',
      en: 'Training sheet',
      hu: 'Oktatási lap',
      de: 'Unterweisungsblatt',
      fr: 'Fiche d\'instruction'
    },
    definition: {
      ro: 'Document prin care se atestă că lucrătorul a fost instruit în domeniul securității și sănătății în muncă. Conține datele lucrătorului, tipul instruirii, data, durata, tematica abordată și semnătura instructorului și a celui instruit.',
      bg: 'Документ, удостоверяващ, че работникът е бил инструктиран в областта на безопасността и здравето при работа. Съдържа данни за работника, вид на инструктажа, дата, продължителност, обхваната тематика и подписи на инструктора и инструктирания.',
      en: 'Document certifying that the worker has been trained in occupational safety and health. Contains worker data, type of training, date, duration, topics covered and signatures of the instructor and the trainee.',
      hu: 'A munkavédelmi és munkaegészségügyi oktatás megtörténtét igazoló dokumentum. Tartalmazza a munkavállaló adatait, az oktatás típusát, dátumát, időtartamát, a feldolgozott témákat és az oktató és az oktatott aláírását.',
      de: 'Dokument, das bescheinigt, dass der Arbeitnehmer im Bereich Arbeitssicherheit und Gesundheitsschutz unterwiesen wurde. Enthält Arbeitnehmerdaten, Art der Unterweisung, Datum, Dauer, behandelte Themen und Unterschriften des Unterweisers und des Unterwiesenen.',
      fr: 'Document attestant que le travailleur a été formé en matière de sécurité et de santé au travail. Contient les données du travailleur, le type de formation, la date, la durée, les sujets abordés et les signatures de l\'instructeur et du stagiaire.'
    },
    category: 'training',
    relatedTerms: ['instruire_periodica', 'instruire_introductiv_generala', 'instruire_la_locul_munca', 'registru_instruire']
  },
  {
    id: 'incident',
    term: {
      ro: 'Incident',
      bg: 'Инцидент',
      en: 'Incident',
      hu: 'Baleset-közeli esemény',
      de: 'Vorfall',
      fr: 'Incident'
    },
    definition: {
      ro: 'Eveniment neplanificat care are potențialul de a cauza accidente de muncă, boli profesionale sau daune materiale, dar care nu a produs încă vătămări sau pierderi. Include situațiile de "aproape accident".',
      bg: 'Непланирано събитие, което има потенциала да причини трудови злополуки, професионални заболявания или материални щети, но все още не е причинило наранявания или загуби. Включва ситуации на "почти злополука".',
      en: 'Unplanned event that has the potential to cause work accidents, occupational diseases or material damage, but has not yet caused injuries or losses. Includes "near-miss" situations.',
      hu: 'Nem tervezett esemény, amely munkabaleset, foglalkozási megbetegedés vagy anyagi kár okozására alkalmas, de még nem okozott sérülést vagy veszteséget. Magában foglalja a "majdnem baleset" helyzeteket.',
      de: 'Ungeplantes Ereignis, das das Potenzial hat, Arbeitsunfälle, Berufskrankheiten oder Sachschäden zu verursachen, aber noch keine Verletzungen oder Verluste verursacht hat. Umfasst "Beinahe-Unfall"-Situationen.',
      fr: 'Événement non planifié qui a le potentiel de causer des accidents du travail, des maladies professionnelles ou des dommages matériels, mais qui n\'a pas encore causé de blessures ou de pertes. Comprend les situations de "quasi-accident".'
    },
    category: 'safety',
    relatedTerms: ['accident_munca', 'investigare_incident', 'raportare_incident', 'analiza_cauzala']
  },
  {
    id: 'medicina_muncii',
    term: {
      ro: 'Medicina muncii',
      bg: 'Медицина на труда',
      en: 'Occupational medicine',
      hu: 'Foglalkozás-egészségügy',
      de: 'Arbeitsmedizin',
      fr: 'Médecine du travail'
    },
    definition: {
      ro: 'Specialitate medicală care se ocupă cu supravegherea stării de sănătate a lucrătorilor în raport cu cerințele și particularitățile locului de muncă. Include examinări medicale la angajare, periodice și la reluarea activității.',
      bg: 'Медицинска специалност, която се занимава с наблюдение на здравословното състояние на работниците във връзка с изискванията и особеностите на работното място. Включва медицински прегледи при наемане, периодични и при възобновяване на дейността.',
      en: 'Medical specialty dealing with the monitoring of workers\' health in relation to the requirements and particularities of the workplace. Includes medical examinations at hiring, periodic and when resuming activity.',
      hu: 'Olyan orvosi szakterület, amely a munkavállalók egészségi állapotának nyomon követésével foglalkozik a munkahely követelményeivel és sajátosságaival összefüggésben. Magában foglalja a munkába lépéskori, időszakos és munkába visszatérés előtti orvosi vizsgálatokat.',
      de: 'Medizinisches Fachgebiet, das sich mit der Überwachung des Gesundheitszustands der Arbeitnehmer in Bezug auf die Anforderungen und Besonderheiten des Arbeitsplatzes befasst. Umfasst medizinische Untersuchungen bei Einstellung, periodisch und bei Wiederaufnahme der Tätigkeit.',
      fr: 'Spécialité médicale qui s\'occupe de la surveillance de l\'état de santé des travailleurs par rapport aux exigences et particularités du lieu de travail. Comprend des examens médicaux à l\'embauche, périodiques et lors de la reprise d\'activité.'
    },
    category: 'health',
    relatedTerms: ['control_medical', 'aviz_medical', 'boala_profesionala', 'contraindicatii']
  },
  {
    id: 'control_medical',
    term: {
      ro: 'Control medical periodic',
      bg: 'Периодичен медицински преглед',
      en: 'Periodic medical examination',
      hu: 'Időszakos orvosi vizsgálat',
      de: 'Periodische ärztliche Untersuchung',
      fr: 'Examen médical périodique'
    },
    definition: {
      ro: 'Examinare medicală efectuată periodic lucrătorilor expuși la factori de risc profesional, conform legislației în vigoare. Periodicitatea este stabilită în funcție de natura și intensitatea factorilor de risc (anual, la 2 ani, etc.).',
      bg: 'Медицински преглед, извършван периодично на работници, изложени на професионални рискови фактори, съгласно действащото законодателство. Периодичността се определя в зависимост от естеството и интензивността на рисковите фактори (годишно, на 2 години и т.н.).',
      en: 'Medical examination carried out periodically for workers exposed to occupational risk factors, according to current legislation. The frequency is determined according to the nature and intensity of risk factors (annually, every 2 years, etc.).',
      hu: 'Foglalkozási kockázati tényezőknek kitett munkavállalók körében a hatályos jogszabályok szerint rendszeresen elvégzett orvosi vizsgálat. A gyakoriságot a kockázati tényezők jellege és intenzitása határozza meg (évente, 2 évente stb.).',
      de: 'Periodische ärztliche Untersuchung von Arbeitnehmern, die beruflichen Risikofaktoren ausgesetzt sind, gemäß den geltenden Rechtsvorschriften. Die Häufigkeit wird nach Art und Intensität der Risikofaktoren bestimmt (jährlich, alle 2 Jahre usw.).',
      fr: 'Examen médical effectué périodiquement pour les travailleurs exposés à des facteurs de risque professionnels, conformément à la législation en vigueur. La périodicité est déterminée en fonction de la nature et de l\'intensité des facteurs de risque (annuellement, tous les 2 ans, etc.).'
    },
    category: 'health',
    relatedTerms: ['medicina_muncii', 'aviz_medical', 'factor_risc', 'fisa_aptitudini']
  },
  {
    id: 'factor_risc',
    term: {
      ro: 'Factor de risc',
      bg: 'Рисков фактор',
      en: 'Risk factor',
      hu: 'Kockázati tényező',
      de: 'Risikofaktor',
      fr: 'Facteur de risque'
    },
    definition: {
      ro: 'Orice element, agent sau circumstanță prezentă în mediul de muncă care poate cauza accidente, îmbolnăviri profesionale sau alte efecte negative asupra sănătății lucrătorilor. Poate fi de natură fizică, chimică, biologică, ergonomică sau psihosocială.',
      bg: 'Всеки елемент, агент или обстоятелство, присъстващо в работната среда, което може да причини злополуки, професионални заболявания или други отрицателни ефекти върху здравето на работниците. Може да бъде от физически, химически, биологичен, ергономичен или психосоциален характер.',
      en: 'Any element, agent or circumstance present in the work environment that can cause accidents, occupational illnesses or other negative effects on workers\' health. Can be physical, chemical, biological, ergonomic or psychosocial in nature.',
      hu: 'Bármely elem, tényező vagy körülmény a munkakörnyezetben, amely baleseteket, foglalkozási megbetegedéseket vagy egyéb káros hatásokat okozhat a munkavállalók egészségére. Lehet fizikai, kémiai, biológiai, ergonómiai vagy pszichoszociális jellegű.',
      de: 'Jedes Element, jeder Wirkstoff oder Umstand in der Arbeitsumgebung, der Unfälle, Berufskrankheiten oder andere negative Auswirkungen auf die Gesundheit der Arbeitnehmer verursachen kann. Kann physikalischer, chemischer, biologischer, ergonomischer oder psychosozialer Natur sein.',
      fr: 'Tout élément, agent ou circonstance présent dans l\'environnement de travail pouvant causer des accidents, des maladies professionnelles ou d\'autres effets négatifs sur la santé des travailleurs. Peut être de nature physique, chimique, biologique, ergonomique ou psychosociale.'
    },
    category: 'safety',
    relatedTerms: ['evaluare_riscuri', 'identificare_pericole', 'masuri_protectie', 'nivel_risc']
  },
  {
    id: 'instruire_periodica',
    term: {
      ro: 'Instruire periodică',
      bg: 'Периодичен инструктаж',
      en: 'Periodic training',
      hu: 'Időszakos oktatás',
      de: 'Periodische Unterweisung',
      fr: 'Formation périodique'
    },
    definition: {
      ro: 'Instruire în domeniul SSM efectuată la intervale regulate (de regulă anual) pentru a actualiza cunoștințele lucrătorilor privind riscurile la locul de muncă și măsurile de prevenire. Obligatorie pentru toți lucrătorii.',
      bg: 'Инструктаж в областта на БЗР, провеждан на редовни интервали (обикновено годишно) за актуализиране на знанията на работниците относно рисковете на работното място и мерките за превенция. Задължителен за всички работници.',
      en: 'OSH training carried out at regular intervals (usually annually) to update workers\' knowledge about workplace risks and prevention measures. Mandatory for all workers.',
      hu: 'Munkavédelmi oktatás, amelyet rendszeres időközönként (általában évente) tartanak a munkavállalók munkahelyi kockázatokkal és megelőzési intézkedésekkel kapcsolatos ismereteinek frissítése érdekében. Kötelező minden munkavállaló számára.',
      de: 'Arbeitssicherheitsschulung, die in regelmäßigen Abständen (in der Regel jährlich) durchgeführt wird, um das Wissen der Arbeitnehmer über Arbeitsplatzrisiken und Präventionsmaßnahmen zu aktualisieren. Obligatorisch für alle Arbeitnehmer.',
      fr: 'Formation SST effectuée à intervalles réguliers (généralement annuellement) pour actualiser les connaissances des travailleurs sur les risques au travail et les mesures de prévention. Obligatoire pour tous les travailleurs.'
    },
    category: 'training',
    relatedTerms: ['fisa_instruire', 'instruire_introductiv_generala', 'program_instruire', 'registru_instruire']
  },
  {
    id: 'inspectia_muncii',
    term: {
      ro: 'Inspecția Muncii',
      bg: 'Инспекция по труда',
      en: 'Labour Inspectorate',
      hu: 'Munkavédelmi Felügyelőség',
      de: 'Arbeitsinspektion',
      fr: 'Inspection du travail'
    },
    definition: {
      ro: 'Organism de stat specializat care verifică respectarea legislației muncii, inclusiv a normelor de securitate și sănătate în muncă. Are dreptul să efectueze controale, să aplice sancțiuni și să dispună măsuri corective.',
      bg: 'Специализиран държавен орган, който проверява спазването на трудовото законодателство, включително нормите за безопасност и здраве при работа. Има право да извършва проверки, да налага санкции и да разпорежда коригиращи мерки.',
      en: 'Specialized state body that verifies compliance with labour legislation, including occupational safety and health standards. Has the right to conduct inspections, apply sanctions and order corrective measures.',
      hu: 'Szakosított állami szerv, amely ellenőrzi a munkajogszabályok, beleértve a munkabiztonsági és egészségvédelmi normák betartását. Joga van ellenőrzéseket végezni, szankciókat alkalmazni és helyesbítő intézkedéseket elrendelni.',
      de: 'Spezialisierte staatliche Stelle, die die Einhaltung der Arbeitsgesetzgebung einschließlich der Arbeitssicherheits- und Gesundheitsschutznormen überprüft. Hat das Recht, Kontrollen durchzuführen, Sanktionen anzuwenden und Korrekturmaßnahmen anzuordnen.',
      fr: 'Organisme d\'État spécialisé qui vérifie le respect de la législation du travail, y compris les normes de sécurité et de santé au travail. A le droit d\'effectuer des inspections, d\'appliquer des sanctions et d\'ordonner des mesures correctives.'
    },
    category: 'legal',
    relatedTerms: ['control_itm', 'proces_verbal_constatare', 'sanctiuni', 'masuri_dispuse']
  },
  {
    id: 'psi',
    term: {
      ro: 'PSI (Prevenire și Stingere Incendii)',
      bg: 'ПП (Пожарна превенция)',
      en: 'Fire Prevention and Protection',
      hu: 'Tűzvédelem',
      de: 'Brandschutz',
      fr: 'Prévention et protection incendie'
    },
    definition: {
      ro: 'Ansamblul măsurilor de prevenire a producerii incendiilor și de limitare a consecințelor acestora. Include măsuri organizatorice (instrucțiuni, planuri de evacuare), tehnice (instalații de detecție și stingere) și dotări (stingătoare, hidranți).',
      bg: 'Съвкупност от мерки за предотвратяване на възникване на пожари и ограничаване на техните последици. Включва организационни мерки (инструкции, евакуационни планове), технически (системи за откриване и гасене) и оборудване (пожарогасители, хидранти).',
      en: 'Set of measures to prevent fires and limit their consequences. Includes organizational measures (instructions, evacuation plans), technical (detection and extinguishing systems) and equipment (fire extinguishers, hydrants).',
      hu: 'Tűzesetek megelőzését és következményeik korlátozását szolgáló intézkedések összessége. Magában foglalja a szervezési intézkedéseket (utasítások, kiürítési tervek), műszaki megoldásokat (észlelő és oltórendszerek) és felszereléseket (tűzoltó készülékek, tűzcsapok).',
      de: 'Gesamtheit der Maßnahmen zur Verhinderung von Bränden und zur Begrenzung ihrer Folgen. Umfasst organisatorische Maßnahmen (Anweisungen, Evakuierungspläne), technische (Erkennungs- und Löschsysteme) und Ausrüstung (Feuerlöscher, Hydranten).',
      fr: 'Ensemble de mesures pour prévenir les incendies et limiter leurs conséquences. Comprend des mesures organisationnelles (instructions, plans d\'évacuation), techniques (systèmes de détection et d\'extinction) et équipements (extincteurs, bornes d\'incendie).'
    },
    category: 'fire',
    relatedTerms: ['autorizatie_psi', 'instructaj_psi', 'stingator', 'plan_evacuare']
  },
  {
    id: 'responsabil_ssm',
    term: {
      ro: 'Responsabil SSM',
      bg: 'Отговорник по БЗР',
      en: 'OSH Officer',
      hu: 'Munkavédelmi felelős',
      de: 'Sicherheitsbeauftragter',
      fr: 'Responsable SST'
    },
    definition: {
      ro: 'Persoană desemnată sau angajată de angajator pentru a coordona activitatea de securitate și sănătate în muncă. Trebuie să aibă pregătire de specialitate nivel mediu sau superior în domeniul SSM.',
      bg: 'Лице, определено или наето от работодателя за координиране на дейността по безопасност и здраве при работа. Трябва да има средно или висше образование в областта на БЗР.',
      en: 'Person designated or employed by the employer to coordinate occupational safety and health activities. Must have medium or higher level specialized training in OSH.',
      hu: 'A munkáltató által a munkavédelmi és munkaegészségügyi tevékenységek koordinálására kijelölt vagy foglalkoztatott személy. Középfokú vagy felsőfokú munkavédelmi szakképesítéssel kell rendelkeznie.',
      de: 'Von dem Arbeitgeber ernannte oder beschäftigte Person zur Koordinierung der Arbeitssicherheits- und Gesundheitsschutzaktivitäten. Muss über eine mittlere oder höhere Fachausbildung im Bereich Arbeitssicherheit verfügen.',
      fr: 'Personne désignée ou employée par l\'employeur pour coordonner les activités de sécurité et de santé au travail. Doit avoir une formation spécialisée de niveau moyen ou supérieur en SST.'
    },
    category: 'safety',
    relatedTerms: ['lucratori_desemnati', 'serviciu_intern', 'serviciu_extern', 'cssm']
  },
  {
    id: 'declarare_accident',
    term: {
      ro: 'Declararea accidentului de muncă',
      bg: 'Деклариране на трудова злополука',
      en: 'Work accident declaration',
      hu: 'Munkabaleset bejelentése',
      de: 'Arbeitsunfallmeldung',
      fr: 'Déclaration d\'accident du travail'
    },
    definition: {
      ro: 'Procedură obligatorie prin care angajatorul informează Inspectoratul Teritorial de Muncă despre producerea unui accident de muncă, în termen de maximum 24 de ore de la producere. Se face prin completarea Declarației de accident de muncă.',
      bg: 'Задължителна процедура, чрез която работодателят уведомява Териториалната инспекция по труда за настъпила трудова злополука, в срок до 24 часа от настъпването. Извършва се чрез попълване на Декларация за трудова злополука.',
      en: 'Mandatory procedure by which the employer informs the Territorial Labour Inspectorate about the occurrence of a work accident, within a maximum of 24 hours from occurrence. It is done by completing the Work Accident Declaration.',
      hu: 'Kötelező eljárás, amellyel a munkáltató értesíti a Területi Munkaügyi Felügyelőséget a munkabaleset bekövetkezéséről, legfeljebb 24 órán belül. A munkabaleset-bejelentő lap kitöltésével történik.',
      de: 'Obligatorisches Verfahren, bei dem der Arbeitgeber die Territoriale Arbeitsinspektion über das Auftreten eines Arbeitsunfalls innerhalb von maximal 24 Stunden nach dem Ereignis informiert. Erfolgt durch Ausfüllen der Arbeitsunfallmeldung.',
      fr: 'Procédure obligatoire par laquelle l\'employeur informe l\'Inspection territoriale du travail de la survenue d\'un accident du travail, dans un délai maximum de 24 heures. Elle se fait en remplissant la Déclaration d\'accident du travail.'
    },
    category: 'legal',
    relatedTerms: ['accident_munca', 'investigare_accident', 'fisa_accident', 'registru_accidente']
  },
  {
    id: 'registru_accidente',
    term: {
      ro: 'Registrul de evidență a accidentelor de muncă',
      bg: 'Регистър за отчет на трудовите злополуки',
      en: 'Work accidents register',
      hu: 'Munkabaleseti nyilvántartás',
      de: 'Arbeitsunfallregister',
      fr: 'Registre des accidents du travail'
    },
    definition: {
      ro: 'Document obligatoriu în care se înregistrează cronologic toate accidentele de muncă care se produc la angajator. Conține date despre accidentat, circumstanțele accidentului, cauzele și măsurile luate.',
      bg: 'Задължителен документ, в който се регистрират хронологично всички трудови злополуки, настъпили при работодателя. Съдържа данни за пострадалия, обстоятелствата на злополуката, причините и взетите мерки.',
      en: 'Mandatory document in which all work accidents occurring at the employer are chronologically recorded. Contains data about the injured person, accident circumstances, causes and measures taken.',
      hu: 'Kötelező dokumentum, amelyben kronológiai sorrendben rögzítik a munkáltatónál bekövetkezett összes munkabalesetet. Tartalmazza a sérültről, a baleset körülményeiről, okairól és a meghozott intézkedésekről szóló adatokat.',
      de: 'Obligatorisches Dokument, in dem alle beim Arbeitgeber auftretenden Arbeitsunfälle chronologisch erfasst werden. Enthält Daten über die verletzte Person, Unfallumstände, Ursachen und ergriffene Maßnahmen.',
      fr: 'Document obligatoire dans lequel tous les accidents du travail survenus chez l\'employeur sont enregistrés chronologiquement. Contient des données sur la personne blessée, les circonstances de l\'accident, les causes et les mesures prises.'
    },
    category: 'documentation',
    relatedTerms: ['accident_munca', 'declarare_accident', 'fisa_accident', 'investigare_accident']
  },
  {
    id: 'investigare_accident',
    term: {
      ro: 'Investigarea accidentului de muncă',
      bg: 'Разследване на трудова злополука',
      en: 'Work accident investigation',
      hu: 'Munkabaleset kivizsgálása',
      de: 'Arbeitsunfalluntersuchung',
      fr: 'Enquête sur l\'accident du travail'
    },
    definition: {
      ro: 'Procedură derulată de o comisie de cercetare pentru a stabili circumstanțele, cauzele și factorii care au contribuit la producerea accidentului de muncă, precum și pentru a propune măsuri de prevenire. Finalizată prin Fișa de cercetare.',
      bg: 'Процедура, извършвана от комисия за разследване с цел установяване на обстоятелствата, причините и факторите, допринесли за настъпване на трудовата злополука, както и предлагане на превантивни мерки. Завършва с Протокол за разследване.',
      en: 'Procedure carried out by an investigation committee to establish the circumstances, causes and factors that contributed to the work accident, as well as to propose prevention measures. Finalized through the Investigation Form.',
      hu: 'A kivizsgáló bizottság által lefolytatott eljárás a munkabaleset bekövetkezéséhez hozzájáruló körülmények, okok és tényezők megállapítására, valamint a megelőző intézkedések javaslására. Kivizsgálási jegyzőkönyvvel zárul.',
      de: 'Von einem Untersuchungsausschuss durchgeführtes Verfahren zur Feststellung der Umstände, Ursachen und Faktoren, die zum Arbeitsunfall beigetragen haben, sowie zur Vorschlag von Präventionsmaßnahmen. Abgeschlossen durch das Untersuchungsformular.',
      fr: 'Procédure menée par une commission d\'enquête pour établir les circonstances, les causes et les facteurs ayant contribué à l\'accident du travail, ainsi que pour proposer des mesures de prévention. Finalisée par le Formulaire d\'enquête.'
    },
    category: 'safety',
    relatedTerms: ['accident_munca', 'fisa_accident', 'comisie_cercetare', 'masuri_preventive']
  },
  {
    id: 'stingator',
    term: {
      ro: 'Stingător de incendiu',
      bg: 'Пожарогасител',
      en: 'Fire extinguisher',
      hu: 'Tűzoltó készülék',
      de: 'Feuerlöscher',
      fr: 'Extincteur'
    },
    definition: {
      ro: 'Dispozitiv portabil folosit pentru stingerea incendiilor de mici dimensiuni. Există mai multe tipuri (cu pulbere, CO2, spumă, apă) în funcție de clasa de incendiu. Trebuie verificat periodic și revizuit la intervale stabilite.',
      bg: 'Преносимо устройство за гасене на малки пожари. Съществуват различни типове (прахов, CO2, пенен, воден) в зависимост от класа на пожара. Трябва да се проверява периодично и ревизира на определени интервали.',
      en: 'Portable device used to extinguish small fires. There are several types (powder, CO2, foam, water) depending on the fire class. Must be checked periodically and serviced at set intervals.',
      hu: 'Hordozható eszköz kis méretű tüzek oltására. Több típus létezik (porral, CO2-dal, habbal, vízzel) a tűzosztálytól függően. Rendszeresen ellenőrizni és meghatározott időközönként felülvizsgálni kell.',
      de: 'Tragbares Gerät zum Löschen von kleinen Bränden. Es gibt verschiedene Typen (Pulver, CO2, Schaum, Wasser) je nach Brandklasse. Muss regelmäßig überprüft und in festgelegten Intervallen gewartet werden.',
      fr: 'Appareil portable utilisé pour éteindre les petits incendies. Il existe plusieurs types (poudre, CO2, mousse, eau) selon la classe de feu. Doit être vérifié périodiquement et révisé à intervalles définis.'
    },
    category: 'fire',
    relatedTerms: ['psi', 'verificare_stingatoare', 'clasa_incendiu', 'plan_amplasare']
  },
  {
    id: 'plan_evacuare',
    term: {
      ro: 'Plan de evacuare',
      bg: 'Евакуационен план',
      en: 'Evacuation plan',
      hu: 'Kiürítési terv',
      de: 'Evakuierungsplan',
      fr: 'Plan d\'évacuation'
    },
    definition: {
      ro: 'Document grafic afișat la vedere care prezintă traseele de evacuare, ieșirile de urgență, punctele de adunare și amplasarea mijloacelor PSI. Include și instrucțiuni pentru evacuarea în siguranță a persoanelor în caz de incendiu sau situații de urgență.',
      bg: 'Графичен документ, изложен на видно място, който представя маршрутите за евакуация, аварийните изходи, точките за събиране и разположението на средствата за ПП. Включва също инструкции за безопасна евакуация на хората при пожар или извънредни ситуации.',
      en: 'Graphic document displayed visibly showing evacuation routes, emergency exits, assembly points and location of fire protection equipment. Also includes instructions for the safe evacuation of people in case of fire or emergencies.',
      hu: 'Jól látható helyen elhelyezett grafikus dokumentum, amely bemutatja a menekülési útvonalakat, vészkijáratokat, gyülekezési pontokat és a tűzvédelmi eszközök elhelyezését. Utasításokat is tartalmaz a személyek biztonságos kiürítésére tűz vagy vészhelyzet esetén.',
      de: 'Grafisches Dokument, das sichtbar angezeigt wird und Evakuierungswege, Notausgänge, Sammelpunkte und Standorte von Brandschutzeinrichtungen zeigt. Enthält auch Anweisungen für die sichere Evakuierung von Personen im Brandfall oder bei Notfällen.',
      fr: 'Document graphique affiché de manière visible montrant les itinéraires d\'évacuation, les sorties de secours, les points de rassemblement et l\'emplacement des équipements de protection incendie. Comprend également des instructions pour l\'évacuation en toute sécurité des personnes en cas d\'incendie ou d\'urgence.'
    },
    category: 'fire',
    relatedTerms: ['psi', 'iesiri_urgenta', 'instructaj_psi', 'exercitiu_evacuare']
  },
  {
    id: 'autorizatie_psi',
    term: {
      ro: 'Autorizație PSI',
      bg: 'Разрешително за ПП',
      en: 'Fire safety authorization',
      hu: 'Tűzvédelmi engedély',
      de: 'Brandschutzgenehmigung',
      fr: 'Autorisation de sécurité incendie'
    },
    definition: {
      ro: 'Document emis de Inspectoratul pentru Situații de Urgență care atestă că o clădire sau activitate îndeplinește condițiile de prevenire și stingere a incendiilor. Obligatorie pentru anumite categorii de construcții și activități.',
      bg: 'Документ, издаден от Дирекция "Пожарна безопасност и защита на населението", удостоверяващ, че сграда или дейност отговаря на условията за предотвратяване и гасене на пожари. Задължителен за определени категории сгради и дейности.',
      en: 'Document issued by the Emergency Situations Inspectorate certifying that a building or activity meets fire prevention and extinguishing conditions. Mandatory for certain categories of buildings and activities.',
      hu: 'A Sürgősségi Felügyelőség által kiállított dokumentum, amely tanúsítja, hogy egy épület vagy tevékenység megfelel a tűzmegelőzési és oltási feltételeknek. Bizonyos épület- és tevékenységkategóriák esetében kötelező.',
      de: 'Von der Notfallinspektionsbehörde ausgestelltes Dokument, das bescheinigt, dass ein Gebäude oder eine Tätigkeit die Brandschutz- und Löschbedingungen erfüllt. Obligatorisch für bestimmte Kategorien von Gebäuden und Tätigkeiten.',
      fr: 'Document délivré par l\'Inspection des situations d\'urgence certifiant qu\'un bâtiment ou une activité répond aux conditions de prévention et d\'extinction des incendies. Obligatoire pour certaines catégories de bâtiments et d\'activités.'
    },
    category: 'fire',
    relatedTerms: ['psi', 'isu', 'verificare_psi', 'aviz_psi']
  },
  {
    id: 'aviz_medical',
    term: {
      ro: 'Aviz medical de aptitudine',
      bg: 'Медицинско удостоверение за годност',
      en: 'Medical fitness certificate',
      hu: 'Egészségügyi alkalmasság igazolás',
      de: 'Ärztliches Tauglichkeitszeugnis',
      fr: 'Certificat médical d\'aptitude'
    },
    definition: {
      ro: 'Document medical care atestă că o persoană este aptă din punct de vedere medical să desfășoare o anumită activitate profesională. Eliberat în urma controlului medical de medicina muncii, cu mențiunea "apt", "apt condiționat" sau "inapt".',
      bg: 'Медицински документ, удостоверяващ, че лице е медицински годно да извършва определена професионална дейност. Издава се след медицински преглед от медицина на труда, с отбелязване "годен", "условно годен" или "негоден".',
      en: 'Medical document certifying that a person is medically fit to perform a certain professional activity. Issued following the occupational medicine medical examination, with the mention "fit", "fit with conditions" or "unfit".',
      hu: 'Orvosi dokumentum, amely igazolja, hogy egy személy orvosi szempontból alkalmas egy meghatározott szakmai tevékenység végzésére. A foglalkozás-egészségügyi orvosi vizsgálatot követően állítják ki "alkalmas", "feltételekkel alkalmas" vagy "alkalmatlan" megjegyzéssel.',
      de: 'Ärztliches Dokument, das bescheinigt, dass eine Person medizinisch geeignet ist, eine bestimmte berufliche Tätigkeit auszuüben. Ausgestellt nach der arbeitsmedizinischen Untersuchung mit der Angabe "tauglich", "tauglich unter Bedingungen" oder "untauglich".',
      fr: 'Document médical certifiant qu\'une personne est médicalement apte à exercer une certaine activité professionnelle. Délivré suite à l\'examen médical de médecine du travail, avec la mention "apte", "apte avec conditions" ou "inapte".'
    },
    category: 'health',
    relatedTerms: ['control_medical', 'medicina_muncii', 'fisa_aptitudini', 'contraindicatii']
  },
  {
    id: 'instruire_introductiv_generala',
    term: {
      ro: 'Instruire introductiv-generală',
      bg: 'Вúводно-общ инструктаж',
      en: 'General introductory training',
      hu: 'Általános bevezető oktatás',
      de: 'Allgemeine Erstunterweisung',
      fr: 'Formation introductive générale'
    },
    definition: {
      ro: 'Prima instruire SSM efectuată la angajarea unui lucrător, înainte de începerea activității. Cuprinde informații generale despre riscurile la nivel de angajator, regulamentul intern, drepturi și obligații SSM.',
      bg: 'Първият инструктаж по БЗР, провеждан при наемане на работник, преди започване на дейността. Съдържа обща информация за рисковете на ниво работодател, вътрешния правилник, права и задължения по БЗР.',
      en: 'First OSH training carried out when hiring a worker, before starting work. Contains general information about risks at employer level, internal regulations, OSH rights and obligations.',
      hu: 'Az első munkavédelmi oktatás, amelyet a munkavállaló alkalmazásakor, a munkavégzés megkezdése előtt tartanak. Általános információkat tartalmaz a munkáltatói szintű kockázatokról, a belső szabályzatról, a munkavédelmi jogokról és kötelezettségekről.',
      de: 'Erste Arbeitssicherheitsschulung bei der Einstellung eines Arbeitnehmers vor Arbeitsbeginn. Enthält allgemeine Informationen über Risiken auf Arbeitgeberebene, interne Vorschriften, Rechte und Pflichten im Bereich Arbeitssicherheit.',
      fr: 'Première formation SST effectuée lors de l\'embauche d\'un travailleur, avant le début du travail. Contient des informations générales sur les risques au niveau de l\'employeur, le règlement intérieur, les droits et obligations SST.'
    },
    category: 'training',
    relatedTerms: ['instruire_la_locul_munca', 'instruire_periodica', 'fisa_instruire', 'program_instruire']
  },
  {
    id: 'instruire_la_locul_munca',
    term: {
      ro: 'Instruire la locul de muncă',
      bg: 'Инструктаж на работното място',
      en: 'On-the-job training',
      hu: 'Munkahely specifikus oktatás',
      de: 'Arbeitsplatzunterweisung',
      fr: 'Formation au poste de travail'
    },
    definition: {
      ro: 'Instruire SSM specifică efectuată pentru fiecare loc de muncă, care prezintă riscurile concrete ale postului, echipamentele de lucru, procedurile de siguranță și măsurile de protecție specifice. Se efectuează înainte de încredințarea sarcinilor.',
      bg: 'Специфичен инструктаж по БЗР, провеждан за всяко работно място, който представя конкретните рискове на длъжността, работното оборудване, процедурите за безопасност и специфичните защитни мерки. Провежда се преди възлагане на задачите.',
      en: 'Specific OSH training carried out for each workplace, presenting the specific risks of the position, work equipment, safety procedures and specific protection measures. Carried out before assigning tasks.',
      hu: 'Minden munkahelyre vonatkozó specifikus munkavédelmi oktatás, amely bemutatja a munkakör konkrét kockázatait, a munkaeszközöket, a biztonsági eljárásokat és a specifikus védelmi intézkedéseket. A feladatok kiosztása előtt végzik.',
      de: 'Spezifische Arbeitssicherheitsschulung für jeden Arbeitsplatz, die die konkreten Risiken der Position, Arbeitsmittel, Sicherheitsverfahren und spezifische Schutzmaßnahmen darstellt. Wird vor der Aufgabenzuweisung durchgeführt.',
      fr: 'Formation SST spécifique effectuée pour chaque poste de travail, présentant les risques concrets du poste, les équipements de travail, les procédures de sécurité et les mesures de protection spécifiques. Effectuée avant l\'attribution des tâches.'
    },
    category: 'training',
    relatedTerms: ['instruire_introductiv_generala', 'instruire_periodica', 'fisa_post', 'proceduri_lucru']
  },
  {
    id: 'masuri_protectie',
    term: {
      ro: 'Măsuri de protecție',
      bg: 'Защитни мерки',
      en: 'Protection measures',
      hu: 'Védelmi intézkedések',
      de: 'Schutzmaßnahmen',
      fr: 'Mesures de protection'
    },
    definition: {
      ro: 'Acțiuni și dispozitive implementate pentru eliminarea sau reducerea riscurilor profesionale. Pot fi de tip tehnic (dispozitive de protecție, sisteme de ventilație), organizatoric (proceduri, program de lucru) sau individual (EIP).',
      bg: 'Действия и устройства, приложени за елиминиране или намаляване на професионалните рискове. Могат да бъдат технически (защитни устройства, вентилационни системи), организационни (процедури, работен график) или индивидуални (ЛПС).',
      en: 'Actions and devices implemented to eliminate or reduce occupational risks. Can be technical (protective devices, ventilation systems), organizational (procedures, work schedule) or individual (PPE).',
      hu: 'A foglalkozási kockázatok megszüntetésére vagy csökkentésére alkalmazott intézkedések és eszközök. Lehetnek műszaki jellegűek (védőberendezések, szellőztető rendszerek), szervezési jellegűek (eljárások, munkabeosztás) vagy egyéniek (egyéni védőeszközök).',
      de: 'Maßnahmen und Vorrichtungen zur Beseitigung oder Verringerung von Berufsrisiken. Können technisch (Schutzvorrichtungen, Lüftungssysteme), organisatorisch (Verfahren, Arbeitsplan) oder individuell (PSA) sein.',
      fr: 'Actions et dispositifs mis en œuvre pour éliminer ou réduire les risques professionnels. Peuvent être techniques (dispositifs de protection, systèmes de ventilation), organisationnels (procédures, horaire de travail) ou individuels (EPI).'
    },
    category: 'safety',
    relatedTerms: ['evaluare_riscuri', 'eip', 'plan_prevenire', 'dispozitive_protectie']
  },
  {
    id: 'serviciu_extern',
    term: {
      ro: 'Serviciu extern de prevenire și protecție',
      bg: 'Външна служба за превенция и защита',
      en: 'External prevention and protection service',
      hu: 'Külső megelőzési és védelmi szolgálat',
      de: 'Externer Arbeitsschutz-dienst',
      fr: 'Service externe de prévention et protection'
    },
    definition: {
      ro: 'Entitate specializată independentă, autorizată să furnizeze servicii de securitate și sănătate în muncă pentru angajatori care nu au serviciu intern. Oferă consultanță, evaluare riscuri, instruiri și suport în implementarea măsurilor SSM.',
      bg: 'Независима специализирана организация, упълномощена да предоставя услуги по безопасност и здраве при работа на работодатели, които нямат вътрешна служба. Предлага консултации, оценка на риска, обучения и подкрепа при прилагане на мерките по БЗР.',
      en: 'Independent specialized entity authorized to provide occupational safety and health services to employers who do not have an internal service. Offers consulting, risk assessment, training and support in implementing OSH measures.',
      hu: 'Független szakosított szervezet, amely felhatalmazott munkavédelmi és munkaegészségügyi szolgáltatások nyújtására olyan munkáltatók számára, akiknek nincs belső szolgálatuk. Tanácsadást, kockázatértékelést, oktatást és támogatást nyújt a munkavédelmi intézkedések végrehajtásában.',
      de: 'Unabhängige spezialisierte Einrichtung, die berechtigt ist, Arbeitssicherheits- und Gesundheitsschutzdienstleistungen für Arbeitgeber ohne internen Dienst zu erbringen. Bietet Beratung, Risikobewertung, Schulung und Unterstützung bei der Umsetzung von Arbeitssicherheitsmaßnahmen.',
      fr: 'Entité spécialisée indépendante autorisée à fournir des services de sécurité et de santé au travail aux employeurs qui n\'ont pas de service interne. Offre conseil, évaluation des risques, formation et soutien dans la mise en œuvre des mesures SST.'
    },
    category: 'safety',
    relatedTerms: ['serviciu_intern', 'responsabil_ssm', 'consultant_ssm', 'contract_prestari']
  },
  {
    id: 'registru_instruire',
    term: {
      ro: 'Registrul de instruire SSM',
      bg: 'Регистър за инструктажи по БЗР',
      en: 'OSH training register',
      hu: 'Munkavédelmi oktatási nyilvántartás',
      de: 'Arbeitsschutzunterweisungsregister',
      fr: 'Registre de formation SST'
    },
    definition: {
      ro: 'Document obligatoriu în care se consemnează cronologic toate instruirile SSM efectuate la angajator. Include tipul instruirii, participanții, data, durata și semnăturile. Poate fi în format fizic sau electronic.',
      bg: 'Задължителен документ, в който се записват хронологично всички проведени инструктажи по БЗР при работодателя. Включва вида на инструктажа, участниците, датата, продължителността и подписите. Може да бъде във физически или електронен формат.',
      en: 'Mandatory document in which all OSH trainings carried out at the employer are chronologically recorded. Includes training type, participants, date, duration and signatures. Can be in physical or electronic format.',
      hu: 'Kötelező dokumentum, amelyben kronológiai sorrendben rögzítik a munkáltatónál megtartott összes munkavédelmi oktatást. Tartalmazza az oktatás típusát, résztvevőket, dátumot, időtartamot és aláírásokat. Lehet fizikai vagy elektronikus formátumban.',
      de: 'Obligatorisches Dokument, in dem alle beim Arbeitgeber durchgeführten Arbeitssicherheitsschulungen chronologisch erfasst werden. Umfasst Schulungsart, Teilnehmer, Datum, Dauer und Unterschriften. Kann in physischer oder elektronischer Form vorliegen.',
      fr: 'Document obligatoire dans lequel toutes les formations SST effectuées chez l\'employeur sont enregistrées chronologiquement. Comprend le type de formation, les participants, la date, la durée et les signatures. Peut être au format physique ou électronique.'
    },
    category: 'documentation',
    relatedTerms: ['fisa_instruire', 'instruire_periodica', 'evidenta_instruiri', 'program_instruire']
  },
  {
    id: 'echipament_munca',
    term: {
      ro: 'Echipament de muncă',
      bg: 'Работно оборудване',
      en: 'Work equipment',
      hu: 'Munkaeszköz',
      de: 'Arbeitsmittel',
      fr: 'Équipement de travail'
    },
    definition: {
      ro: 'Orice mașină, aparat, unealtă sau instalație utilizată în muncă. Trebuie să fie conform cu cerințele de securitate, verificat periodic și utilizat doar de personal instruit și autorizat (unde este cazul).',
      bg: 'Всяка машина, апарат, инструмент или инсталация, използвани в работата. Трябва да отговарят на изискванията за безопасност, да се проверяват периодично и да се използват само от инструктиран и оторизиран персонал (когато е приложимо).',
      en: 'Any machine, apparatus, tool or installation used at work. Must comply with safety requirements, be periodically checked and used only by trained and authorized personnel (where applicable).',
      hu: 'Bármely gép, készülék, szerszám vagy berendezés, amelyet munkavégzéshez használnak. Meg kell felelnie a biztonsági követelményeknek, rendszeresen ellenőrizni kell, és csak képzett és felhatalmazott személyzet használhatja (adott esetben).',
      de: 'Jede Maschine, jedes Gerät, Werkzeug oder jede Anlage, die bei der Arbeit verwendet wird. Muss den Sicherheitsanforderungen entsprechen, regelmäßig überprüft werden und nur von geschultem und autorisiertem Personal verwendet werden (falls zutreffend).',
      fr: 'Toute machine, appareil, outil ou installation utilisé au travail. Doit être conforme aux exigences de sécurité, vérifié périodiquement et utilisé uniquement par du personnel formé et autorisé (le cas échéant).'
    },
    category: 'equipment',
    relatedTerms: ['verificare_echipamente', 'autorizare_lucrator', 'intretinere_echipamente', 'fisa_tehnica']
  },
  {
    id: 'fisa_post',
    term: {
      ro: 'Fișa postului',
      bg: 'Длъжностна характеристика',
      en: 'Job description',
      hu: 'Munkaköri leírás',
      de: 'Stellenbeschreibung',
      fr: 'Fiche de poste'
    },
    definition: {
      ro: 'Document care definește atribuțiile, responsabilitățile, competențele necesare și condițiile de muncă pentru un anumit post. Trebuie să includă și cerințele SSM specifice postului, riscurile asociate și EIP necesare.',
      bg: 'Документ, който определя задълженията, отговорностите, необходимите компетенции и условията на труд за определена длъжност. Трябва да включва и специфичните изисквания за БЗР на длъжността, свързаните рискове и необходимите ЛПС.',
      en: 'Document defining the duties, responsibilities, required competencies and working conditions for a specific position. Must also include position-specific OSH requirements, associated risks and required PPE.',
      hu: 'Dokumentum, amely meghatározza egy adott munkakör feladatait, felelősségeit, szükséges kompetenciáit és munkakörülményeit. Tartalmaznia kell a munkakör-specifikus munkavédelmi követelményeket, a kapcsolódó kockázatokat és a szükséges egyéni védőeszközöket is.',
      de: 'Dokument, das die Aufgaben, Verantwortlichkeiten, erforderlichen Kompetenzen und Arbeitsbedingungen für eine bestimmte Stelle definiert. Muss auch stellenspezifische Arbeitssicherheitsanforderungen, damit verbundene Risiken und erforderliche PSA enthalten.',
      fr: 'Document définissant les tâches, responsabilités, compétences requises et conditions de travail pour un poste spécifique. Doit également inclure les exigences SST spécifiques au poste, les risques associés et les EPI requis.'
    },
    category: 'documentation',
    relatedTerms: ['atributii_ssm', 'instruire_la_locul_munca', 'evaluare_riscuri', 'responsabilitati']
  },
  {
    id: 'control_itm',
    term: {
      ro: 'Control ITM',
      bg: 'Проверка от Инспекция по труда',
      en: 'Labour Inspectorate inspection',
      hu: 'Munkavédelmi felügyelőségi ellenőrzés',
      de: 'Arbeitsinspektion-kontrolle',
      fr: 'Contrôle de l\'Inspection du travail'
    },
    definition: {
      ro: 'Verificare efectuată de inspectorii de muncă pentru controlul aplicării legislației muncii și SSM. Poate fi planificată sau inopinată. Se finalizează cu proces-verbal de control și, dacă este cazul, proces-verbal de constatare și sancționare.',
      bg: 'Проверка, извършвана от инспектори по труда за контрол на прилагането на трудовото законодателство и БЗР. Може да бъде планирана или внезапна. Завършва с протокол за проверка и, ако е необходимо, протокол за констатиране и санкциониране.',
      en: 'Inspection carried out by labour inspectors to check the application of labour and OSH legislation. Can be planned or unannounced. Finalized with an inspection report and, if applicable, a finding and sanctioning report.',
      hu: 'Munkaügyi felügyelők által végzett ellenőrzés a munkaügyi és munkavédelmi jogszabályok alkalmazásának ellenőrzésére. Lehet tervezett vagy bejelentés nélküli. Ellenőrzési jegyzőkönyvvel, és szükség esetén megállapító és szankcionáló jegyzőkönyvvel zárul.',
      de: 'Von Arbeitsinspektoren durchgeführte Kontrolle zur Überprüfung der Anwendung von Arbeits- und Arbeitssicherheitsvorschriften. Kann geplant oder unangemeldet sein. Abgeschlossen mit einem Kontrollbericht und gegebenenfalls einem Feststellungs- und Sanktionsbericht.',
      fr: 'Inspection effectuée par les inspecteurs du travail pour contrôler l\'application de la législation du travail et de la SST. Peut être planifiée ou inopinée. Finalisée par un rapport d\'inspection et, le cas échéant, un rapport de constatation et de sanction.'
    },
    category: 'legal',
    relatedTerms: ['inspectia_muncii', 'proces_verbal_constatare', 'sanctiuni', 'masuri_dispuse']
  },
  {
    id: 'agent_nociv',
    term: {
      ro: 'Agent nociv',
      bg: 'Вреден агент',
      en: 'Harmful agent',
      hu: 'Káros tényező',
      de: 'Schädlicher Wirkstoff',
      fr: 'Agent nocif'
    },
    definition: {
      ro: 'Substanță, material, factor fizic, biologic sau chimic prezent în mediul de muncă care poate afecta negativ sănătatea lucrătorilor. Include zgomot, vibrații, substanțe chimice periculoase, radiații, agenți biologici etc.',
      bg: 'Вещество, материал, физически, биологичен или химичен фактор, присъстващ в работната среда, който може негативно да повлияе на здравето на работниците. Включва шум, вибрации, опасни химични вещества, радиация, биологични агенти и др.',
      en: 'Substance, material, physical, biological or chemical factor present in the work environment that can negatively affect workers\' health. Includes noise, vibrations, hazardous chemicals, radiation, biological agents, etc.',
      hu: 'A munkakörnyezetben jelenlévő anyag, anyag, fizikai, biológiai vagy kémiai tényező, amely negatívan befolyásolhatja a munkavállalók egészségét. Magában foglalja a zajt, rezgéseket, veszélyes vegyi anyagokat, sugárzást, biológiai tényezőket stb.',
      de: 'Substanz, Material, physikalischer, biologischer oder chemischer Faktor in der Arbeitsumgebung, der die Gesundheit der Arbeitnehmer negativ beeinflussen kann. Umfasst Lärm, Vibrationen, gefährliche Chemikalien, Strahlung, biologische Arbeitsstoffe usw.',
      fr: 'Substance, matériau, facteur physique, biologique ou chimique présent dans l\'environnement de travail pouvant affecter négativement la santé des travailleurs. Comprend le bruit, les vibrations, les produits chimiques dangereux, les radiations, les agents biologiques, etc.'
    },
    category: 'health',
    relatedTerms: ['factor_risc', 'boala_profesionala', 'expunere_profesionala', 'valori_limita']
  },
  {
    id: 'reevaluare',
    term: {
      ro: 'Reevaluare de riscuri',
      bg: 'Преоценка на риска',
      en: 'Risk reassessment',
      hu: 'Kockázat újraértékelése',
      de: 'Risiko-neubewertung',
      fr: 'Réévaluation des risques'
    },
    definition: {
      ro: 'Actualizarea evaluării de riscuri efectuată când intervin modificări în procesul de muncă, echipamente, organizare sau după producerea unor accidente. Obligatorie cel puțin o dată la 3 ani sau ori de câte ori se modifică condițiile de muncă.',
      bg: 'Актуализация на оценката на риска, извършвана при настъпване на промени в работния процес, оборудването, организацията или след настъпване на злополуки. Задължителна поне веднъж на 3 години или винаги когато се променят условията на труд.',
      en: 'Update of risk assessment carried out when changes occur in the work process, equipment, organization or after accidents. Mandatory at least once every 3 years or whenever working conditions change.',
      hu: 'A kockázatértékelés frissítése, amelyet a munkamenet, berendezések, szervezés változásakor vagy balesetek után végeznek. Kötelező legalább 3 évente egyszer vagy bármikor, amikor a munkakörülmények megváltoznak.',
      de: 'Aktualisierung der Risikobewertung bei Änderungen im Arbeitsprozess, bei Ausrüstung, Organisation oder nach Unfällen. Obligatorisch mindestens alle 3 Jahre oder bei Änderung der Arbeitsbedingungen.',
      fr: 'Mise à jour de l\'évaluation des risques effectuée lors de changements dans le processus de travail, l\'équipement, l\'organisation ou après des accidents. Obligatoire au moins une fois tous les 3 ans ou dès que les conditions de travail changent.'
    },
    category: 'safety',
    relatedTerms: ['evaluare_riscuri', 'plan_prevenire', 'modificare_conditii', 'actualizare_masuri']
  },
  {
    id: 'procedura_lucru',
    term: {
      ro: 'Procedură de lucru în siguranță',
      bg: 'Процедура за безопасна работа',
      en: 'Safe work procedure',
      hu: 'Biztonságos munkavégzési eljárás',
      de: 'Sichere Arbeitsanweisung',
      fr: 'Procédure de travail sûre'
    },
    definition: {
      ro: 'Document care descrie pas cu pas modul corect și sigur de efectuare a unei activități de muncă. Include măsurile de siguranță, EIP-ul necesar, riscurile specifice și modul de acțiune în caz de situații de urgență.',
      bg: 'Документ, който описва стъпка по стъпка правилния и безопасен начин за извършване на работна дейност. Включва мерките за безопасност, необходимите ЛПС, специфичните рискове и начина на действие при извънредни ситуации.',
      en: 'Document describing step by step the correct and safe way to perform a work activity. Includes safety measures, required PPE, specific risks and how to act in emergency situations.',
      hu: 'Dokumentum, amely lépésről lépésre leírja egy munkatevékenység helyes és biztonságos végrehajtásának módját. Tartalmazza a biztonsági intézkedéseket, a szükséges egyéni védőeszközöket, a specifikus kockázatokat és a vészhelyzeti eljárásokat.',
      de: 'Dokument, das Schritt für Schritt die korrekte und sichere Durchführung einer Arbeitstätigkeit beschreibt. Umfasst Sicherheitsmaßnahmen, erforderliche PSA, spezifische Risiken und Vorgehensweise in Notfällen.',
      fr: 'Document décrivant étape par étape la manière correcte et sûre d\'effectuer une activité de travail. Comprend les mesures de sécurité, les EPI requis, les risques spécifiques et la conduite à tenir en cas d\'urgence.'
    },
    category: 'documentation',
    relatedTerms: ['instructiuni_lucru', 'instruire_la_locul_munca', 'masuri_protectie', 'permis_lucru']
  },
  {
    id: 'permis_lucru',
    term: {
      ro: 'Permis de lucru',
      bg: 'Разрешително за работа',
      en: 'Work permit',
      hu: 'Munkavégzési engedély',
      de: 'Arbeitserlaubnis',
      fr: 'Permis de travail'
    },
    definition: {
      ro: 'Document care autorizează executarea unor lucrări cu risc ridicat (spații confinate, lucru la înălțime, lucrări la cald etc.). Conține măsurile de siguranță obligatorii, echipamentele necesare, responsabilii și perioada de valabilitate.',
      bg: 'Документ, който разрешава изпълнението на работи с висок риск (затворени пространства, работа на височина, горещи работи и др.). Съдържа задължителните мерки за безопасност, необходимото оборудване, отговорните лица и периода на валидност.',
      en: 'Document authorizing the execution of high-risk works (confined spaces, work at height, hot work, etc.). Contains mandatory safety measures, required equipment, responsible persons and validity period.',
      hu: 'Nagy kockázatú munkák (zárt terek, magasban végzett munka, tűzveszélyes munkák stb.) elvégzését engedélyező dokumentum. Tartalmazza a kötelező biztonsági intézkedéseket, szükséges felszereléseket, felelős személyeket és az érvényességi időszakot.',
      de: 'Dokument, das die Ausführung von Arbeiten mit hohem Risiko (enge Räume, Arbeiten in der Höhe, Heißarbeiten usw.) genehmigt. Enthält obligatorische Sicherheitsmaßnahmen, erforderliche Ausrüstung, verantwortliche Personen und Gültigkeitszeitraum.',
      fr: 'Document autorisant l\'exécution de travaux à haut risque (espaces confinés, travail en hauteur, travaux à chaud, etc.). Contient les mesures de sécurité obligatoires, l\'équipement requis, les personnes responsables et la période de validité.'
    },
    category: 'safety',
    relatedTerms: ['lucru_inaltime', 'spatii_confinate', 'lucrari_cald', 'procedura_lucru']
  },
  {
    id: 'comisie_cercetare',
    term: {
      ro: 'Comisie de cercetare a accidentelor',
      bg: 'Комисия за разследване на злополуки',
      en: 'Accident investigation committee',
      hu: 'Baleset-kivizsgáló bizottság',
      de: 'Untersuchungskommission für Unfälle',
      fr: 'Commission d\'enquête sur les accidents'
    },
    definition: {
      ro: 'Grup constituit din minimum 3 persoane care investighează accidentele de muncă pentru a stabili cauzele și a propune măsuri preventive. Include reprezentanți ai angajatorului, lucrători și poate include inspectori ITM în funcție de gravitate.',
      bg: 'Група от минимум 3 души, която разследва трудовите злополуки, за да установи причините и предложи превантивни мерки. Включва представители на работодателя, работници и може да включва инспектори от Инспекция по труда в зависимост от тежестта.',
      en: 'Group of at least 3 people investigating work accidents to establish causes and propose preventive measures. Includes employer representatives, workers and may include Labour Inspectorate inspectors depending on severity.',
      hu: 'Legalább 3 fős csoport, amely kivizsgálja a munkabaleseteket az okok megállapítása és megelőző intézkedések javaslata céljából. Magában foglalja a munkáltató képviselőit, munkavállalókat, és súlyosságtól függően munkavédelmi felügyelőket is tartalmazhat.',
      de: 'Gruppe von mindestens 3 Personen, die Arbeitsunfälle untersucht, um Ursachen festzustellen und Präventionsmaßnahmen vorzuschlagen. Umfasst Vertreter des Arbeitgebers, Arbeitnehmer und kann je nach Schwere Arbeitsinspektoren einschließen.',
      fr: 'Groupe d\'au moins 3 personnes enquêtant sur les accidents du travail pour établir les causes et proposer des mesures préventives. Comprend des représentants de l\'employeur, des travailleurs et peut inclure des inspecteurs du travail selon la gravité.'
    },
    category: 'safety',
    relatedTerms: ['investigare_accident', 'fisa_accident', 'accident_munca', 'masuri_preventive']
  },
  {
    id: 'fisa_accident',
    term: {
      ro: 'Fișa de cercetare a accidentului',
      bg: 'Протокол за разследване на злополука',
      en: 'Accident investigation form',
      hu: 'Baleset-kivizsgálási jegyzőkönyv',
      de: 'Unfalluntersuchungsformular',
      fr: 'Formulaire d\'enquête sur l\'accident'
    },
    definition: {
      ro: 'Document standard care consemnează rezultatul investigației accidentului de muncă. Include datele accidentatului, descrierea evenimentului, cauzele identificate, factorii contributivi și măsurile de prevenire propuse.',
      bg: 'Стандартен документ, който отразява резултата от разследването на трудовата злополука. Включва данни за пострадалия, описание на събитието, идентифицираните причини, допринасящите фактори и предложените превантивни мерки.',
      en: 'Standard document recording the result of the work accident investigation. Includes data on the injured person, event description, identified causes, contributing factors and proposed prevention measures.',
      hu: 'Szabványos dokumentum, amely rögzíti a munkabaleset kivizsgálásának eredményét. Tartalmazza a sérült adatait, az esemény leírását, az azonosított okokat, közreható tényezőket és a javasolt megelőzési intézkedéseket.',
      de: 'Standarddokument zur Aufzeichnung des Ergebnisses der Arbeitsunfalluntersuchung. Umfasst Daten zur verletzten Person, Ereignisbeschreibung, identifizierte Ursachen, beitragende Faktoren und vorgeschlagene Präventionsmaßnahmen.',
      fr: 'Document standard enregistrant le résultat de l\'enquête sur l\'accident du travail. Comprend les données sur la personne blessée, la description de l\'événement, les causes identifiées, les facteurs contributifs et les mesures de prévention proposées.'
    },
    category: 'documentation',
    relatedTerms: ['investigare_accident', 'comisie_cercetare', 'accident_munca', 'registru_accidente']
  },
  {
    id: 'spatii_confinate',
    term: {
      ro: 'Spații confinate',
      bg: 'Затворени пространства',
      en: 'Confined spaces',
      hu: 'Zárt terek',
      de: 'Enge Räume',
      fr: 'Espaces confinés'
    },
    definition: {
      ro: 'Spații închise sau parțial închise, cu ventilație naturală deficitară, care nu sunt destinate pentru ocupare continuă de către personal (rezervoare, canale, tuneluri, puțuri). Lucrul în astfel de spații necesită permis special și măsuri suplimentare.',
      bg: 'Затворени или частично затворени пространства с недостатъчна естествена вентилация, които не са предназначени за непрекъснато заемане от персонал (резервоари, канали, тунели, кладенци). Работата в такива пространства изисква специално разрешително и допълнителни мерки.',
      en: 'Enclosed or partially enclosed spaces with deficient natural ventilation, not intended for continuous occupation by personnel (tanks, channels, tunnels, wells). Work in such spaces requires special permit and additional measures.',
      hu: 'Zárt vagy részben zárt terek elégtelen természetes szellőzéssel, amelyek nem alkalmasak személyzet folyamatos tartózkodására (tartályok, csatornák, alagutak, kutak). Az ilyen terekben végzett munka különleges engedélyt és további intézkedéseket igényel.',
      de: 'Geschlossene oder teilweise geschlossene Räume mit unzureichender natürlicher Belüftung, die nicht für die kontinuierliche Nutzung durch Personal vorgesehen sind (Tanks, Kanäle, Tunnel, Schächte). Arbeiten in solchen Räumen erfordern eine spezielle Genehmigung und zusätzliche Maßnahmen.',
      fr: 'Espaces clos ou partiellement clos avec ventilation naturelle insuffisante, non destinés à l\'occupation continue par le personnel (réservoirs, canaux, tunnels, puits). Le travail dans de tels espaces nécessite un permis spécial et des mesures supplémentaires.'
    },
    category: 'safety',
    relatedTerms: ['permis_lucru', 'ventilatie', 'atmosfera_toxica', 'echipament_respirator']
  },
  {
    id: 'lucru_inaltime',
    term: {
      ro: 'Lucrul la înălțime',
      bg: 'Работа на височина',
      en: 'Work at height',
      hu: 'Magasban végzett munka',
      de: 'Arbeiten in der Höhe',
      fr: 'Travail en hauteur'
    },
    definition: {
      ro: 'Orice activitate desfășurată la o înălțime de peste 2 metri față de nivelul inferior stabil, unde există risc de cădere. Necesită măsuri speciale de protecție (scări, schele, centuri de siguranță, plase de protecție) și autorizare.',
      bg: 'Всяка дейност, извършвана на височина над 2 метра спрямо стабилното долно ниво, където съществува риск от падане. Изисква специални защитни мерки (стълби, скелета, предпазни колани, предпазни мрежи) и разрешително.',
      en: 'Any activity carried out at a height above 2 meters from the stable lower level, where there is a risk of falling. Requires special protective measures (ladders, scaffolds, safety belts, safety nets) and authorization.',
      hu: 'Bármely tevékenység, amelyet 2 méternél nagyobb magasságban végeznek a stabil alsó szinttől, ahol zuhanásveszély áll fenn. Különleges védelmi intézkedéseket (létrák, állványok, biztonsági övek, védőhálók) és engedélyt igényel.',
      de: 'Jede Tätigkeit in einer Höhe von über 2 Metern über der stabilen unteren Ebene, bei der Sturzgefahr besteht. Erfordert spezielle Schutzmaßnahmen (Leitern, Gerüste, Sicherheitsgurte, Schutznetze) und Genehmigung.',
      fr: 'Toute activité effectuée à une hauteur supérieure à 2 mètres par rapport au niveau inférieur stable, où il existe un risque de chute. Nécessite des mesures de protection spéciales (échelles, échafaudages, harnais de sécurité, filets de sécurité) et une autorisation.'
    },
    category: 'safety',
    relatedTerms: ['permis_lucru', 'eip', 'centura_siguranta', 'schela']
  },
  {
    id: 'verificare_echipamente',
    term: {
      ro: 'Verificare periodică a echipamentelor',
      bg: 'Периодична проверка на оборудването',
      en: 'Periodic equipment inspection',
      hu: 'Berendezések időszakos ellenőrzése',
      de: 'Periodische Geräteinspektion',
      fr: 'Inspection périodique des équipements'
    },
    definition: {
      ro: 'Control tehnic efectuat la intervale stabilite pentru a verifica starea de funcționare și siguranța echipamentelor de muncă. Efectuat de personal competent, cu consemnare în registre de verificare și aplicare de etichete/viniete.',
      bg: 'Технически контрол, извършван на установени интервали за проверка на работното състояние и безопасността на работното оборудване. Извършва се от компетентен персонал, с отразяване в регистри за проверка и поставяне на етикети/стикери.',
      en: 'Technical inspection carried out at established intervals to check the operating condition and safety of work equipment. Performed by competent personnel, with recording in inspection registers and application of labels/stickers.',
      hu: 'Meghatározott időközönként végzett műszaki ellenőrzés a munkaeszközök működési állapotának és biztonságának ellenőrzésére. Kompetens személyzet végzi, ellenőrzési nyilvántartásba való bejegyzéssel és címkék/matricák felhelyezésével.',
      de: 'Technische Inspektion in festgelegten Intervallen zur Überprüfung des Betriebszustands und der Sicherheit von Arbeitsmitteln. Durchgeführt von kompetentem Personal mit Eintragung in Inspektionsregister und Anbringung von Etiketten/Aufklebern.',
      fr: 'Inspection technique effectuée à intervalles établis pour vérifier l\'état de fonctionnement et la sécurité des équipements de travail. Réalisée par du personnel compétent, avec enregistrement dans les registres d\'inspection et application d\'étiquettes/autocollants.'
    },
    category: 'equipment',
    relatedTerms: ['echipament_munca', 'registru_verificari', 'intretinere_echipamente', 'persoana_competenta']
  },
  {
    id: 'santier_temporar',
    term: {
      ro: 'Șantier temporar sau mobil',
      bg: 'Временен или подвижен строителен обект',
      en: 'Temporary or mobile construction site',
      hu: 'Ideiglenes vagy mobil építési munkahely',
      de: 'Temporäre oder mobile Baustelle',
      fr: 'Chantier temporaire ou mobile'
    },
    definition: {
      ro: 'Orice șantier la care se execută lucrări de construcții sau de geniu civil. Necesită Plan de Securitate și Sănătate (PSS), coordonator SSM, notificare prealabilă și respectarea Normelor Generale de Protecția Muncii pentru Construcții.',
      bg: 'Всеки строителен обект, на който се извършват строителни работи или работи на гражданското строителство. Изисква План за безопасност и здраве (ПБЗ), координатор по БЗР, предварително уведомление и спазване на Общите правила за безопасност на труда в строителството.',
      en: 'Any construction site where construction or civil engineering works are carried out. Requires Safety and Health Plan (SHP), OSH coordinator, prior notification and compliance with General Labour Protection Standards for Construction.',
      hu: 'Bármely építési munkahely, ahol építési vagy mélyépítési munkákat végeznek. Biztonsági és egészségvédelmi tervet (BET), munkavédelmi koordinátort, előzetes értesítést és az Általános Építőipari Munkavédelmi szabályok betartását igényli.',
      de: 'Jede Baustelle, auf der Bau- oder Tiefbauarbeiten durchgeführt werden. Erfordert Sicherheits- und Gesundheitsschutzplan (SiGePlan), Arbeitssicherheitskoordinator, Voranmeldung und Einhaltung der Allgemeinen Arbeitsschutznormen für das Bauwesen.',
      fr: 'Tout chantier de construction où sont réalisés des travaux de construction ou de génie civil. Nécessite un Plan de Sécurité et de Santé (PSS), un coordinateur SST, une notification préalable et le respect des Normes Générales de Protection du Travail pour la Construction.'
    },
    category: 'safety',
    relatedTerms: ['pss', 'coordonator_ssm', 'notificare_prealabila', 'ngpm']
  },
  {
    id: 'evaluare_performanta',
    term: {
      ro: 'Evaluarea performanței în SSM',
      bg: 'Оценка на ефективността по БЗР',
      en: 'OSH performance evaluation',
      hu: 'Munkavédelmi teljesítményértékelés',
      de: 'Arbeitsschutz-Leistungsbewertung',
      fr: 'Évaluation de la performance SST'
    },
    definition: {
      ro: 'Proces de monitorizare și măsurare a eficienței sistemului de management SSM prin indicatori (frecvența accidentelor, gravitatea, zile pierdute, conformitate, instruiri efectuate). Permite identificarea zonelor de îmbunătățire.',
      bg: 'Процес на мониторинг и измерване на ефективността на системата за управление на БЗР чрез показатели (честота на злополуките, тежест, изгубени дни, съответствие, проведени обучения). Позволява идентифициране на области за подобрение.',
      en: 'Process of monitoring and measuring the effectiveness of the OSH management system through indicators (accident frequency, severity, days lost, compliance, trainings conducted). Allows identification of areas for improvement.',
      hu: 'A munkavédelmi irányítási rendszer hatékonyságának mutatókon keresztüli nyomon követése és mérése (baleseti gyakoriság, súlyosság, elveszett napok, megfelelőség, elvégzett oktatások). Lehetővé teszi a fejlesztendő területek azonosítását.',
      de: 'Prozess der Überwachung und Messung der Wirksamkeit des Arbeitssicherheitsmanagementsystems durch Indikatoren (Unfallhäufigkeit, Schweregrad, verlorene Tage, Compliance, durchgeführte Schulungen). Ermöglicht die Identifizierung von Verbesserungsbereichen.',
      fr: 'Processus de surveillance et de mesure de l\'efficacité du système de gestion SST par des indicateurs (fréquence des accidents, gravité, jours perdus, conformité, formations dispensées). Permet l\'identification des domaines d\'amélioration.'
    },
    category: 'safety',
    relatedTerms: ['indicatori_ssm', 'audit_ssm', 'imbunatatire_continua', 'raportare_ssm']
  },
  {
    id: 'casm',
    term: {
      ro: 'CASM (Comitetul de Securitate și Sănătate în Muncă)',
      bg: 'КБЗР (Комитет по безопасност и здраве при работа)',
      en: 'OSH Committee',
      hu: 'Munkabiztonsági és Munkaegészségügyi Bizottság',
      de: 'Arbeitsschutzausschuss',
      fr: 'Comité SST'
    },
    definition: {
      ro: 'Organism paritetic la nivel de angajator care asigură consultarea și participarea lucrătorilor în probleme de SSM. Format din reprezentanți ai angajatorului și ai lucrătorilor. Obligatoriu pentru angajatorii cu minimum 50 lucrători.',
      bg: 'Паритетен орган на ниво работодател, който осигурява консултиране и участие на работниците в въпросите на БЗР. Съставен от представители на работодателя и работниците. Задължителен за работодатели с минимум 50 работника.',
      en: 'Parity body at employer level ensuring consultation and participation of workers in OSH issues. Composed of employer and worker representatives. Mandatory for employers with minimum 50 workers.',
      hu: 'Paritásos szerv munkáltatói szinten, amely biztosítja a munkavállalók konzultációját és részvételét a munkavédelmi kérdésekben. A munkáltató és a munkavállalók képviselőiből áll. Kötelező minimum 50 munkavállalót foglalkoztató munkáltatók számára.',
      de: 'Paritätisches Gremium auf Arbeitgeberebene, das die Konsultation und Beteiligung der Arbeitnehmer bei Arbeitssicherheitsfragen gewährleistet. Bestehend aus Vertretern des Arbeitgebers und der Arbeitnehmer. Obligatorisch für Arbeitgeber mit mindestens 50 Arbeitnehmern.',
      fr: 'Organisme paritaire au niveau de l\'employeur assurant la consultation et la participation des travailleurs aux questions SST. Composé de représentants de l\'employeur et des travailleurs. Obligatoire pour les employeurs de 50 travailleurs minimum.'
    },
    category: 'legal',
    relatedTerms: ['cssm', 'reprezentant_lucratori', 'sedinta_cssm', 'consultare_lucratori']
  },
  {
    id: 'pricina_imediata',
    term: {
      ro: 'Pricină imediată (cauză directă)',
      bg: 'Непосредствена причина (пряка причина)',
      en: 'Immediate cause (direct cause)',
      hu: 'Közvetlen ok',
      de: 'Unmittelbare Ursache (direkte Ursache)',
      fr: 'Cause immédiate (cause directe)'
    },
    definition: {
      ro: 'Cauza directă și evidentă care a declanșat accidentul de muncă sau incidentul. Poate fi o acțiune nesigură (comportament uman neadecvat) sau o condiție nesigură (stare tehnico-materială periculoasă). Se stabilește în procesul de investigare.',
      bg: 'Пряката и очевидна причина, която е предизвикала трудовата злополука или инцидента. Може да бъде небезопасно действие (неподходящо човешко поведение) или небезопасно състояние (опасно техническо-материално състояние). Установява се в процеса на разследване.',
      en: 'Direct and obvious cause that triggered the work accident or incident. Can be an unsafe act (inadequate human behavior) or an unsafe condition (dangerous technical-material state). Established in the investigation process.',
      hu: 'Közvetlen és nyilvánvaló ok, amely kiváltotta a munkabalesetet vagy eseményt. Lehet nem biztonságos cselekvés (nem megfelelő emberi viselkedés) vagy nem biztonságos állapot (veszélyes műszaki-anyagi állapot). A kivizsgálási folyamatban állapítják meg.',
      de: 'Direkte und offensichtliche Ursache, die den Arbeitsunfall oder Vorfall ausgelöst hat. Kann eine unsichere Handlung (unangemessenes menschliches Verhalten) oder ein unsicherer Zustand (gefährlicher technisch-materieller Zustand) sein. Wird im Untersuchungsprozess festgestellt.',
      fr: 'Cause directe et évidente qui a déclenché l\'accident du travail ou l\'incident. Peut être un acte dangereux (comportement humain inadéquat) ou une condition dangereuse (état technique-matériel dangereux). Établie dans le processus d\'enquête.'
    },
    category: 'safety',
    relatedTerms: ['investigare_accident', 'cauza_profunda', 'analiza_cauzala', 'masuri_preventive']
  },
  {
    id: 'reprezentant_lucratori',
    term: {
      ro: 'Reprezentant al lucrătorilor cu atribuții specifice în domeniul SSM',
      bg: 'Представител на работниците със специфични задължения в областта на БЗР',
      en: 'Workers\' representative with specific OSH responsibilities',
      hu: 'A munkavállalók munkavédelmi felelősségekkel rendelkező képviselője',
      de: 'Arbeitnehmervertreter mit spezifischen Arbeitssicherheitsaufgaben',
      fr: 'Représentant des travailleurs avec des responsabilités SST spécifiques'
    },
    definition: {
      ro: 'Persoană aleasă de lucrători pentru a-i reprezenta în problemele de securitate și sănătate în muncă. Are dreptul să solicite informații, să participe la controale, să propună măsuri și să sesizeze neregulile. Protejat împotriva concedierii pentru această activitate.',
      bg: 'Лице, избрано от работниците да ги представлява по въпроси на безопасността и здравето при работа. Има право да иска информация, да участва в проверки, да предлага мерки и да сигнализира за нередности. Защитен от уволнение за тази дейност.',
      en: 'Person elected by workers to represent them in occupational safety and health matters. Has the right to request information, participate in inspections, propose measures and report irregularities. Protected against dismissal for this activity.',
      hu: 'A munkavállalók által választott személy, hogy képviselje őket munkavédelmi és munkaegészségügyi ügyekben. Joga van információt kérni, ellenőrzésekben részt venni, intézkedéseket javasolni és szabálytalanságokat jelezni. Védett az elbocsátással szemben e tevékenység miatt.',
      de: 'Von den Arbeitnehmern gewählte Person zur Vertretung in Fragen der Arbeitssicherheit und des Gesundheitsschutzes. Hat das Recht, Informationen anzufordern, an Inspektionen teilzunehmen, Maßnahmen vorzuschlagen und Unregelmäßigkeiten zu melden. Geschützt vor Entlassung für diese Tätigkeit.',
      fr: 'Personne élue par les travailleurs pour les représenter dans les questions de sécurité et de santé au travail. A le droit de demander des informations, de participer aux inspections, de proposer des mesures et de signaler les irrégularités. Protégé contre le licenciement pour cette activité.'
    },
    category: 'legal',
    relatedTerms: ['cssm', 'consultare_lucratori', 'drepturi_ssm', 'protectie_reprezentanti']
  }
];

/**
 * Get glossary term by ID
 */
export function getGlossaryTerm(id: string): GlossaryTerm | undefined {
  return glossaryTerms.find(term => term.id === id);
}

/**
 * Get glossary terms by category
 */
export function getGlossaryTermsByCategory(category: GlossaryTerm['category']): GlossaryTerm[] {
  return glossaryTerms.filter(term => term.category === category);
}

/**
 * Search glossary terms by keyword in any language
 */
export function searchGlossaryTerms(keyword: string, locale: keyof GlossaryTerm['term'] = 'ro'): GlossaryTerm[] {
  const lowerKeyword = keyword.toLowerCase();
  return glossaryTerms.filter(term =>
    term.term[locale].toLowerCase().includes(lowerKeyword) ||
    term.definition[locale].toLowerCase().includes(lowerKeyword)
  );
}

/**
 * Get all categories
 */
export function getGlossaryCategories(): GlossaryTerm['category'][] {
  return ['safety', 'health', 'fire', 'equipment', 'documentation', 'training', 'legal'];
}

/**
 * Get category label in specified language
 */
export function getCategoryLabel(category: GlossaryTerm['category'], locale: 'ro' | 'bg' | 'en' | 'hu' | 'de' | 'fr' = 'ro'): string {
  const labels: Record<GlossaryTerm['category'], Record<string, string>> = {
    safety: {
      ro: 'Securitate',
      bg: 'Безопасност',
      en: 'Safety',
      hu: 'Biztonság',
      de: 'Sicherheit',
      fr: 'Sécurité'
    },
    health: {
      ro: 'Sănătate',
      bg: 'Здраве',
      en: 'Health',
      hu: 'Egészség',
      de: 'Gesundheit',
      fr: 'Santé'
    },
    fire: {
      ro: 'PSI',
      bg: 'ПП',
      en: 'Fire',
      hu: 'Tűzvédelem',
      de: 'Brandschutz',
      fr: 'Incendie'
    },
    equipment: {
      ro: 'Echipamente',
      bg: 'Оборудване',
      en: 'Equipment',
      hu: 'Felszerelés',
      de: 'Ausrüstung',
      fr: 'Équipement'
    },
    documentation: {
      ro: 'Documentație',
      bg: 'Документация',
      en: 'Documentation',
      hu: 'Dokumentáció',
      de: 'Dokumentation',
      fr: 'Documentation'
    },
    training: {
      ro: 'Instruire',
      bg: 'Обучение',
      en: 'Training',
      hu: 'Oktatás',
      de: 'Schulung',
      fr: 'Formation'
    },
    legal: {
      ro: 'Legal',
      bg: 'Правен',
      en: 'Legal',
      hu: 'Jogi',
      de: 'Rechtlich',
      fr: 'Légal'
    }
  };

  return labels[category][locale] || labels[category]['en'];
}
