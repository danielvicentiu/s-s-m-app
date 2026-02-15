-- =====================================================
-- PROFESSIONAL BODIES: FR, IT, ES, PT, NL, SE
-- Generated: 2026-02-15
-- Agent: B1
-- =====================================================

-- =====================================================
-- FRANCE (FR) - Professional Bodies
-- =====================================================

INSERT INTO professional_bodies (
  code, country_code, name_local, name_en, abbreviation,
  body_type, website_url, register_url, parent_body_code,
  professions_covered, notes
) VALUES
-- Registru comercial
('FR-INPI', 'FR',
 'Institut National de la Propriété Industrielle',
 'National Institute of Industrial Property', 'INPI',
 'register',
 'https://www.inpi.fr',
 'https://data.inpi.fr',
 NULL,
 ARRAY['all companies'],
 'Registru național pentru firme. RCS (Registre du Commerce et des Sociétés).'),

-- Autoritate fiscală
('FR-DGFIP', 'FR',
 'Direction Générale des Finances Publiques',
 'Directorate General of Public Finances', 'DGFiP',
 'regulatory_authority',
 'https://www.impots.gouv.fr',
 NULL,
 NULL,
 ARRAY['all companies','all professionals'],
 'Autoritate fiscală națională. Gestionează TVA, impozite, declarații fiscale.'),

-- Ordin medici
('FR-CNOM', 'FR',
 'Conseil National de l''Ordre des Médecins',
 'National Council of the Order of Physicians', 'CNOM',
 'order',
 'https://www.conseil-national.medecin.fr',
 'https://www.conseil-national.medecin.fr/annuaire',
 NULL,
 ARRAY['médecin','médecin spécialiste'],
 'Ordine națională. Înscriere obligatorie pentru practică medicală.'),

-- Ordin dentiști
('FR-CNOD', 'FR',
 'Conseil National de l''Ordre des Chirurgiens-Dentistes',
 'National Council of the Order of Dental Surgeons', 'CNOD',
 'order',
 'https://www.ordre-chirurgiens-dentistes.fr',
 'https://www.ordre-chirurgiens-dentistes.fr/annuaire.html',
 NULL,
 ARRAY['chirurgien-dentiste','dentiste'],
 'Ordine națională. Înscriere obligatorie.'),

-- Ordin farmaciști
('FR-CNOP', 'FR',
 'Conseil National de l''Ordre des Pharmaciens',
 'National Council of the Order of Pharmacists', 'CNOP',
 'order',
 'http://www.ordre.pharmacien.fr',
 'http://www.ordre.pharmacien.fr/annuaire',
 NULL,
 ARRAY['pharmacien'],
 'Ordine națională. Loi 2004-806.'),

-- Ordin veterinari
('FR-CNOV', 'FR',
 'Conseil National de l''Ordre des Vétérinaires',
 'National Council of the Order of Veterinarians', 'CNOV',
 'order',
 'https://www.veterinaire.fr',
 'https://www.veterinaire.fr/annuaire',
 NULL,
 ARRAY['vétérinaire'],
 'Ordine națională. Înscriere obligatorie.'),

-- Barou avocați
('FR-CNB', 'FR',
 'Conseil National des Barreaux',
 'National Council of Bar Associations', 'CNB',
 'bar',
 'https://www.cnb.avocat.fr',
 'https://www.cnb.avocat.fr/annuaire-des-avocats',
 NULL,
 ARRAY['avocat'],
 'Barou național. Reglementează profesia de avocat în Franța.'),

-- Cameră notari
('FR-CSN', 'FR',
 'Conseil Supérieur du Notariat',
 'Supreme Council of Notaries', 'CSN',
 'chamber',
 'https://www.notaires.fr',
 'https://www.notaires.fr/fr/annuaires-notaire',
 NULL,
 ARRAY['notaire'],
 'Cameră națională. Înscriere obligatorie pentru notari.'),

-- Ordin arhitecți
('FR-CNOA', 'FR',
 'Conseil National de l''Ordre des Architectes',
 'National Council of the Order of Architects', 'CNOA',
 'order',
 'https://www.architectes.org',
 'https://www.architectes.org/annuaire',
 NULL,
 ARRAY['architecte'],
 'Ordine națională. Loi 1977-02 du 3 janvier 1977.'),

-- Ordin infirmiere
('FR-ONI', 'FR',
 'Ordre National des Infirmiers',
 'National Order of Nurses', 'ONI',
 'order',
 'https://www.ordre-infirmiers.fr',
 'https://www.ordre-infirmiers.fr/annuaire-des-infirmiers.html',
 NULL,
 ARRAY['infirmier','infirmière'],
 'Ordine națională. Loi n° 2006-1668.'),

-- Cameră experți contabili
('FR-CSOEC', 'FR',
 'Conseil Supérieur de l''Ordre des Experts-Comptables',
 'Supreme Council of the Order of Chartered Accountants', 'CSOEC',
 'order',
 'https://www.experts-comptables.fr',
 'https://www.experts-comptables.fr/annuaire',
 NULL,
 ARRAY['expert-comptable'],
 'Ordine națională pentru experți contabili.'),

-- Autoritate SSM/muncă
('FR-DREETS', 'FR',
 'Direction Régionale de l''Économie, de l''Emploi, du Travail et des Solidarités',
 'Regional Directorate for Economy, Employment, Labour and Solidarity', 'DREETS',
 'regulatory_authority',
 'https://travail-emploi.gouv.fr',
 NULL,
 NULL,
 ARRAY['all companies'],
 'Autoritate regională pentru inspecția muncii, SSM, drepturi salariați.'),

-- Autoritate PSI
('FR-DGSCGC', 'FR',
 'Direction Générale de la Sécurité Civile et de la Gestion des Crises',
 'Directorate General for Civil Protection and Crisis Management', 'DGSCGC',
 'regulatory_authority',
 'https://www.interieur.gouv.fr/Le-ministere/DGSCGC',
 NULL,
 NULL,
 ARRAY['all companies'],
 'Autoritate națională pentru securitate la incendiu (pompieri).'),

-- Autoritate sanitară
('FR-ARS', 'FR',
 'Agences Régionales de Santé',
 'Regional Health Agencies', 'ARS',
 'regulatory_authority',
 'https://www.ars.sante.fr',
 NULL,
 NULL,
 ARRAY['health professionals','medical facilities'],
 'Autorități regionale de sănătate publică.')

ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- ITALY (IT) - Professional Bodies
-- =====================================================

INSERT INTO professional_bodies (
  code, country_code, name_local, name_en, abbreviation,
  body_type, website_url, register_url, parent_body_code,
  professions_covered, notes
) VALUES
-- Registru comercial
('IT-CCIAA', 'IT',
 'Camere di Commercio, Industria, Artigianato e Agricoltura',
 'Chambers of Commerce, Industry, Crafts and Agriculture', 'CCIAA',
 'register',
 'https://www.unioncamere.gov.it',
 'https://www.registroimprese.it',
 NULL,
 ARRAY['all companies'],
 'Registru comercial național (Registro delle Imprese).'),

-- Autoritate fiscală
('IT-ADE', 'IT',
 'Agenzia delle Entrate',
 'Revenue Agency', 'ADE',
 'regulatory_authority',
 'https://www.agenziaentrate.gov.it',
 NULL,
 NULL,
 ARRAY['all companies','all professionals'],
 'Autoritate fiscală națională. Gestionează impozite, TVA, declarații.'),

-- Ordin medici
('IT-FNOMCEO', 'IT',
 'Federazione Nazionale degli Ordini dei Medici Chirurghi e degli Odontoiatri',
 'National Federation of Orders of Physicians and Dentists', 'FNOMCeO',
 'order',
 'https://portale.fnomceo.it',
 'https://portale.fnomceo.it/fnomceo/showArticolo.2puntOT?id=115184',
 NULL,
 ARRAY['medico','medico specialista','odontoiatra'],
 'Federație națională. Înscriere obligatorie pentru medici și dentiști.'),

-- Ordin farmaciști
('IT-FOFI', 'IT',
 'Federazione degli Ordini dei Farmacisti Italiani',
 'Federation of Orders of Italian Pharmacists', 'FOFI',
 'order',
 'https://www.fofi.it',
 'https://www.fofi.it/albo-unico-nazionale',
 NULL,
 ARRAY['farmacista'],
 'Federație națională. Albo Unico Nazionale.'),

-- Ordin veterinari
('IT-FNOVI', 'IT',
 'Federazione Nazionale Ordini Veterinari Italiani',
 'National Federation of Orders of Italian Veterinarians', 'FNOVI',
 'order',
 'https://www.fnovi.it',
 'https://www.fnovi.it/albo-unico',
 NULL,
 ARRAY['veterinario'],
 'Federație națională. Albo Unico Nazionale.'),

-- Barou avocați
('IT-CNF', 'IT',
 'Consiglio Nazionale Forense',
 'National Forensic Council', 'CNF',
 'bar',
 'https://www.consiglionazionaleforense.it',
 'https://www.consiglionazionaleforense.it/site/home/area-pubblica/ricerca-avvocato.html',
 NULL,
 ARRAY['avvocato'],
 'Consiliu național al avocaților. Înscriere în albo obligatorie.'),

-- Consiliu național notari
('IT-CNN', 'IT',
 'Consiglio Nazionale del Notariato',
 'National Council of Notaries', 'CNN',
 'council',
 'https://www.notariato.it',
 'https://www.notariato.it/it/trova-notaio',
 NULL,
 ARRAY['notaio'],
 'Consiliu național. Reglementează profesia de notar.'),

-- Ordin arhitecți
('IT-CNAPPC', 'IT',
 'Consiglio Nazionale Architetti, Pianificatori, Paesaggisti e Conservatori',
 'National Council of Architects, Planners, Landscape Architects and Conservators', 'CNAPPC',
 'council',
 'https://www.awn.it',
 'https://www.awn.it/cerca-professionista',
 NULL,
 ARRAY['architetto','pianificatore','paesaggista'],
 'Consiliu național. Albo unico.'),

-- Ordin comercianți (ragionieri)
('IT-CNDCEC', 'IT',
 'Consiglio Nazionale dei Dottori Commercialisti e degli Esperti Contabili',
 'National Council of Chartered Accountants and Accounting Experts', 'CNDCEC',
 'council',
 'https://www.commercialisti.it',
 'https://www.commercialisti.it/web/guest/elenco-iscritti',
 NULL,
 ARRAY['dottore commercialista','esperto contabile'],
 'Consiliu național pentru contabili și auditori.'),

-- Autoritate SSM/muncă
('IT-INL', 'IT',
 'Ispettorato Nazionale del Lavoro',
 'National Labour Inspectorate', 'INL',
 'inspectorate',
 'https://www.ispettorato.gov.it',
 NULL,
 NULL,
 ARRAY['all companies'],
 'Inspectorat național al muncii. SSM, contracte de muncă, drepturi salariați.'),

-- Autoritate PSI
('IT-VVF', 'IT',
 'Corpo Nazionale dei Vigili del Fuoco',
 'National Fire Brigade', 'CNVVF',
 'regulatory_authority',
 'https://www.vigilfuoco.it',
 NULL,
 NULL,
 ARRAY['all companies'],
 'Corp național pompieri. Prevenzione incendi.'),

-- Autoritate sanitară
('IT-MIN-SAL', 'IT',
 'Ministero della Salute',
 'Ministry of Health', 'MinSal',
 'ministry',
 'https://www.salute.gov.it',
 NULL,
 NULL,
 ARRAY['health professionals','medical facilities'],
 'Ministerul Sănătății. Reglementează profesioniști medicali.')

ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- SPAIN (ES) - Professional Bodies
-- =====================================================

INSERT INTO professional_bodies (
  code, country_code, name_local, name_en, abbreviation,
  body_type, website_url, register_url, parent_body_code,
  professions_covered, notes
) VALUES
-- Registru comercial
('ES-RMC', 'ES',
 'Registro Mercantil Central',
 'Central Commercial Register', 'RMC',
 'register',
 'https://www.rmc.es',
 'https://www.rmc.es/Consultas.aspx',
 NULL,
 ARRAY['all companies'],
 'Registru comercial național spaniol.'),

-- Autoritate fiscală
('ES-AEAT', 'ES',
 'Agencia Estatal de Administración Tributaria',
 'State Tax Administration Agency', 'AEAT',
 'regulatory_authority',
 'https://www.agenciatributaria.es',
 NULL,
 NULL,
 ARRAY['all companies','all professionals'],
 'Autoritate fiscală națională. IVA, IRPF, impuesto sociedades.'),

-- Ordin medici
('ES-CGCOM', 'ES',
 'Consejo General de Colegios Oficiales de Médicos',
 'General Council of Official Medical Associations', 'CGCOM',
 'council',
 'https://www.cgcom.es',
 'https://www.cgcom.es/colegiados',
 NULL,
 ARRAY['médico','médico especialista'],
 'Consiliu general național. Înscriere în Colegio Oficial obligatorie.'),

-- Ordin dentiști
('ES-CGCOE', 'ES',
 'Consejo General de Colegios de Odontólogos y Estomatólogos de España',
 'General Council of Colleges of Dentists and Stomatologists of Spain', 'CGCOE',
 'council',
 'https://www.consejodentistas.es',
 'https://www.consejodentistas.es/ciudadanos/directorio-de-dentistas.html',
 NULL,
 ARRAY['odontólogo','estomatólogo'],
 'Consiliu general. Înscriere obligatorie.'),

-- Ordin farmaciști
('ES-CGCOF', 'ES',
 'Consejo General de Colegios Oficiales de Farmacéuticos',
 'General Council of Official Colleges of Pharmacists', 'CGCOF',
 'council',
 'https://www.portalfarma.com',
 'https://www.portalfarma.com/ciudadanos/buscadorfarmacias/Paginas/default.aspx',
 NULL,
 ARRAY['farmacéutico'],
 'Consiliu general. Înscriere în Colegio obligatorie.'),

-- Ordin veterinari
('ES-CGCVE', 'ES',
 'Consejo General de Colegios Veterinarios de España',
 'General Council of Veterinary Colleges of Spain', 'CGCVE',
 'council',
 'https://www.colvet.es',
 'https://www.colvet.es/node/1418',
 NULL,
 ARRAY['veterinario'],
 'Consiliu general. Înscriere obligatorie.'),

-- Barou avocați
('ES-CGAE', 'ES',
 'Consejo General de la Abogacía Española',
 'General Council of Spanish Lawyers', 'CGAE',
 'bar',
 'https://www.abogacia.es',
 'https://www.abogacia.es/ciudadania/encontrar-abogado/',
 NULL,
 ARRAY['abogado'],
 'Consiliu general al barourilor. Înscriere obligatorie în Colegio.'),

-- Ordin psihologi
('ES-COP', 'ES',
 'Consejo General de la Psicología de España',
 'General Council of Psychology of Spain', 'COP',
 'council',
 'https://www.cop.es',
 'https://www.cop.es/registro-de-psicologos',
 NULL,
 ARRAY['psicólogo'],
 'Consiliu general. Înscriere obligatorie.'),

-- Ordin arhitecți
('ES-CSCAE', 'ES',
 'Consejo Superior de los Colegios de Arquitectos de España',
 'Superior Council of Colleges of Architects of Spain', 'CSCAE',
 'council',
 'https://www.cscae.com',
 'https://www.cscae.com/area-publica/busqueda-de-arquitectos',
 NULL,
 ARRAY['arquitecto'],
 'Consiliu superior. Înscriere în Colegio obligatorie.'),

-- Autoritate SSM/muncă
('ES-ITSS', 'ES',
 'Inspección de Trabajo y Seguridad Social',
 'Labour and Social Security Inspectorate', 'ITSS',
 'inspectorate',
 'https://www.mites.gob.es',
 NULL,
 NULL,
 ARRAY['all companies'],
 'Inspectorat de muncă. SSM, contracte, drepturi salariați.'),

-- Autoritate PSI
('ES-DGPCE', 'ES',
 'Dirección General de Protección Civil y Emergencias',
 'Directorate General for Civil Protection and Emergencies', 'DGPCE',
 'regulatory_authority',
 'https://www.interior.gob.es/opencms/es/ministerio/organos-directivos/direccion-general-de-proteccion-civil/',
 NULL,
 NULL,
 ARRAY['all companies'],
 'Direcție generală protecție civilă și pompieri.'),

-- Autoritate sanitară
('ES-AEMPS', 'ES',
 'Agencia Española de Medicamentos y Productos Sanitarios',
 'Spanish Agency for Medicines and Health Products', 'AEMPS',
 'agency',
 'https://www.aemps.gob.es',
 NULL,
 NULL,
 ARRAY['health professionals','medical facilities'],
 'Agenție națională de sănătate.')

ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- PORTUGAL (PT) - Professional Bodies
-- =====================================================

INSERT INTO professional_bodies (
  code, country_code, name_local, name_en, abbreviation,
  body_type, website_url, register_url, parent_body_code,
  professions_covered, notes
) VALUES
-- Registru comercial
('PT-RNPC', 'PT',
 'Registo Nacional de Pessoas Coletivas',
 'National Register of Legal Entities', 'RNPC',
 'register',
 'https://justica.gov.pt',
 'https://www.empresaonline.pt',
 NULL,
 ARRAY['all companies'],
 'Registru comercial național (Conservatória do Registo Comercial).'),

-- Autoritate fiscală
('PT-AT', 'PT',
 'Autoridade Tributária e Aduaneira',
 'Tax and Customs Authority', 'AT',
 'regulatory_authority',
 'https://www.portaldasfinancas.gov.pt',
 NULL,
 NULL,
 ARRAY['all companies','all professionals'],
 'Autoritate fiscală națională. IVA, IRS, IRC, declarații fiscale.'),

-- Ordin medici
('PT-OM', 'PT',
 'Ordem dos Médicos',
 'Order of Physicians', 'OM',
 'order',
 'https://www.ordemdosmedicos.pt',
 'https://www.ordemdosmedicos.pt/pesquisar-medicos/',
 NULL,
 ARRAY['médico','médico especialista'],
 'Ordine națională. Înscriere obligatorie pentru practică medicală.'),

-- Ordin dentiști
('PT-OMD', 'PT',
 'Ordem dos Médicos Dentistas',
 'Order of Dental Surgeons', 'OMD',
 'order',
 'https://www.omd.pt',
 'https://www.omd.pt/procurar-medico-dentista',
 NULL,
 ARRAY['médico dentista'],
 'Ordine națională. Înscriere obligatorie.'),

-- Ordin farmaciști
('PT-OF', 'PT',
 'Ordem dos Farmacêuticos',
 'Order of Pharmacists', 'OF',
 'order',
 'https://www.ordemfarmaceuticos.pt',
 'https://www.ordemfarmaceuticos.pt/pt/pesquisar-membros/',
 NULL,
 ARRAY['farmacêutico'],
 'Ordine națională. Înscriere obligatorie.'),

-- Ordin veterinari
('PT-OMV', 'PT',
 'Ordem dos Médicos Veterinários',
 'Order of Veterinarians', 'OMV',
 'order',
 'https://www.omv.pt',
 'https://www.omv.pt/pesquisa-de-medicos-veterinarios/',
 NULL,
 ARRAY['médico veterinário'],
 'Ordine națională. Înscriere obligatorie.'),

-- Barou avocați
('PT-OA', 'PT',
 'Ordem dos Advogados',
 'Portuguese Bar Association', 'OA',
 'bar',
 'https://www.oa.pt',
 'https://www.oa.pt/cd/default.aspx?sidc=58595',
 NULL,
 ARRAY['advogado'],
 'Barou național. Înscriere obligatorie pentru practică.'),

-- Ordin arhitecți
('PT-OA-ARQ', 'PT',
 'Ordem dos Arquitetos',
 'Order of Architects', 'OA',
 'order',
 'https://www.arquitectos.pt',
 'https://www.arquitectos.pt/pt/pesquisa-de-membros',
 NULL,
 ARRAY['arquiteto'],
 'Ordine națională. Înscriere obligatorie.'),

-- Ordin contabili
('PT-OCC', 'PT',
 'Ordem dos Contabilistas Certificados',
 'Order of Certified Accountants', 'OCC',
 'order',
 'https://www.occ.pt',
 'https://www.occ.pt/pt/pesquisa-de-membros/',
 NULL,
 ARRAY['contabilista certificado'],
 'Ordine națională pentru contabili certificați.'),

-- Ordin psihologi
('PT-OPP', 'PT',
 'Ordem dos Psicólogos Portugueses',
 'Portuguese Psychologists Association', 'OPP',
 'order',
 'https://www.ordemdospsicologos.pt',
 'https://www.ordemdospsicologos.pt/pt/psicologos',
 NULL,
 ARRAY['psicólogo'],
 'Ordine națională. Cédula profissional obligatorie.'),

-- Autoritate SSM/muncă
('PT-ACT', 'PT',
 'Autoridade para as Condições do Trabalho',
 'Authority for Working Conditions', 'ACT',
 'regulatory_authority',
 'https://www.act.gov.pt',
 NULL,
 NULL,
 ARRAY['all companies'],
 'Autoritate pentru condiții de muncă. SSM, inspecție, drepturi salariați.'),

-- Autoritate PSI
('PT-ANEPC', 'PT',
 'Autoridade Nacional de Emergência e Proteção Civil',
 'National Authority for Emergency and Civil Protection', 'ANEPC',
 'regulatory_authority',
 'https://www.prociv.gov.pt',
 NULL,
 NULL,
 ARRAY['all companies'],
 'Autoritate națională protecție civilă și pompieri.'),

-- Autoritate sanitară
('PT-DGS', 'PT',
 'Direção-Geral da Saúde',
 'Directorate-General of Health', 'DGS',
 'regulatory_authority',
 'https://www.dgs.pt',
 NULL,
 NULL,
 ARRAY['health professionals','medical facilities'],
 'Direcție generală de sănătate publică.')

ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- NETHERLANDS (NL) - Professional Bodies
-- =====================================================

INSERT INTO professional_bodies (
  code, country_code, name_local, name_en, abbreviation,
  body_type, website_url, register_url, parent_body_code,
  professions_covered, notes
) VALUES
-- Registru comercial
('NL-KVK', 'NL',
 'Kamer van Koophandel',
 'Chamber of Commerce', 'KVK',
 'chamber',
 'https://www.kvk.nl',
 'https://www.kvk.nl/zoeken/',
 NULL,
 ARRAY['all companies'],
 'Registru comercial național (Handelsregister).'),

-- Autoritate fiscală
('NL-BD', 'NL',
 'Belastingdienst',
 'Tax Administration', 'BD',
 'regulatory_authority',
 'https://www.belastingdienst.nl',
 NULL,
 NULL,
 ARRAY['all companies','all professionals'],
 'Autoritate fiscală națională. BTW, vennootschapsbelasting, declarații.'),

-- Registru medici
('NL-BIG', 'NL',
 'BIG-register (Beroepen in de Individuele Gezondheidszorg)',
 'Individual Healthcare Professions Register', 'BIG',
 'register',
 'https://www.bigregister.nl',
 'https://www.bigregister.nl/zoek-zorgverlener',
 NULL,
 ARRAY['arts','tandarts','apotheker','verpleegkundige','verloskundige'],
 'Registru național pentru profesioniști medicali. Obligatoriu pentru practică.'),

-- Asociația medicilor (KNMG)
('NL-KNMG', 'NL',
 'Koninklijke Nederlandsche Maatschappij tot bevordering der Geneeskunst',
 'Royal Dutch Medical Association', 'KNMG',
 'association',
 'https://www.knmg.nl',
 NULL,
 NULL,
 ARRAY['arts'],
 'Asociație profesională medicală. Membru voluntar dar larg răspândită.'),

-- Asociația dentiști
('NL-KNMT', 'NL',
 'Koninklijke Nederlandse Maatschappij tot bevordering der Tandheelkunde',
 'Royal Dutch Dental Association', 'KNMT',
 'association',
 'https://www.knmt.nl',
 NULL,
 NULL,
 ARRAY['tandarts'],
 'Asociație profesională pentru dentiști.'),

-- Asociația farmaciști
('NL-KNMP', 'NL',
 'Koninklijke Nederlandse Maatschappij ter bevordering der Pharmacie',
 'Royal Dutch Pharmacists Association', 'KNMP',
 'association',
 'https://www.knmp.nl',
 NULL,
 NULL,
 ARRAY['apotheker'],
 'Asociație profesională pentru farmaciști.'),

-- Barou avocați
('NL-NOvA', 'NL',
 'Nederlandse Orde van Advocaten',
 'Netherlands Bar Association', 'NOvA',
 'bar',
 'https://www.advocatenorde.nl',
 'https://www.advocatenorde.nl/zoek-een-advocaat',
 NULL,
 ARRAY['advocaat'],
 'Barou național. Înscriere obligatorie pentru practică.'),

-- Asociația notari
('NL-KNB', 'NL',
 'Koninklijke Notariële Beroepsorganisatie',
 'Royal Notarial Professional Organization', 'KNB',
 'association',
 'https://www.knb.nl',
 'https://www.notaris.nl/notaris-zoeken',
 NULL,
 ARRAY['notaris'],
 'Organizație profesională pentru notari. Înscriere obligatorie.'),

-- Registru arhitecți
('NL-BNA', 'NL',
 'Bond van Nederlandse Architecten',
 'Association of Dutch Architects', 'BNA',
 'association',
 'https://www.bna.nl',
 'https://www.bna.nl/architecten-zoeken',
 NULL,
 ARRAY['architect'],
 'Asociație profesională pentru arhitecți.'),

-- Cameră contabili
('NL-NBA', 'NL',
 'Nederlandse Beroepsorganisatie van Accountants',
 'Netherlands Institute of Chartered Accountants', 'NBA',
 'association',
 'https://www.nba.nl',
 'https://www.nba.nl/zoek-een-accountant/',
 NULL,
 ARRAY['accountant'],
 'Organizație profesională pentru contabili și auditori.'),

-- Autoritate SSM/muncă
('NL-ILT', 'NL',
 'Inspectie Leefomgeving en Transport',
 'Human Environment and Transport Inspectorate', 'ILT',
 'inspectorate',
 'https://www.ilent.nl',
 NULL,
 NULL,
 ARRAY['all companies'],
 'Inspectorat pentru mediu, transport, muncă. Include SSM (Arbeidsinspectie).'),

-- Autoritate PSI
('NL-BRAND', 'NL',
 'Brandweer Nederland',
 'Fire Service Netherlands', 'Brandweer',
 'regulatory_authority',
 'https://www.brandweer.nl',
 NULL,
 NULL,
 ARRAY['all companies'],
 'Serviciu național pompieri. Prevenire incendii.'),

-- Autoritate sanitară
('NL-IGJ', 'NL',
 'Inspectie Gezondheidszorg en Jeugd',
 'Health and Youth Care Inspectorate', 'IGJ',
 'inspectorate',
 'https://www.igj.nl',
 NULL,
 NULL,
 ARRAY['health professionals','medical facilities'],
 'Inspectorat pentru îngrijirea sănătății.')

ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- SWEDEN (SE) - Professional Bodies
-- =====================================================

INSERT INTO professional_bodies (
  code, country_code, name_local, name_en, abbreviation,
  body_type, website_url, register_url, parent_body_code,
  professions_covered, notes
) VALUES
-- Registru comercial
('SE-BVR', 'SE',
 'Bolagsverket',
 'Swedish Companies Registration Office', 'BVR',
 'register',
 'https://www.bolagsverket.se',
 'https://www.bolagsverket.se/ff/foretagsformer/aktiebolag/registrera',
 NULL,
 ARRAY['all companies'],
 'Registru comercial național (Companies House).'),

-- Autoritate fiscală
('SE-SKV', 'SE',
 'Skatteverket',
 'Swedish Tax Agency', 'SKV',
 'regulatory_authority',
 'https://www.skatteverket.se',
 NULL,
 NULL,
 ARRAY['all companies','all professionals'],
 'Autoritate fiscală națională. Moms (TVA), företagsskatt, deklarationer.'),

-- Autoritate medicală (Socialstyrelsen)
('SE-SOS', 'SE',
 'Socialstyrelsen',
 'National Board of Health and Welfare', 'SoS',
 'board',
 'https://www.socialstyrelsen.se',
 'https://legitimation.socialstyrelsen.se/legitimation/',
 NULL,
 ARRAY['läkare','tandläkare','apotekare','sjuksköterska','barnmorska','veterinär'],
 'Autoritate națională sănătate. Licențiază profesioniști medicali (legitimation).'),

-- Asociația medicilor
('SE-LF', 'SE',
 'Läkarförbundet',
 'Swedish Medical Association', 'LF',
 'association',
 'https://www.lakartidningen.se',
 NULL,
 NULL,
 ARRAY['läkare'],
 'Asociație profesională pentru medici. Membru voluntar.'),

-- Asociația dentiști
('SE-TLV', 'SE',
 'Sveriges Tandläkarförbund',
 'Swedish Dental Association', 'STF',
 'association',
 'https://www.tandlakarforbundet.se',
 NULL,
 NULL,
 ARRAY['tandläkare'],
 'Asociație profesională pentru dentiști.'),

-- Asociația farmaciști
('SE-FARM', 'SE',
 'Sveriges Farmaceuter',
 'Swedish Pharmacists Association', 'SF',
 'association',
 'https://www.sverigesfarmaceuter.se',
 NULL,
 NULL,
 ARRAY['apotekare'],
 'Asociație profesională pentru farmaciști.'),

-- Asociația asistente medicale
('SE-SSF', 'SE',
 'Svensk sjuksköterskeförening',
 'Swedish Association of Health Professionals', 'SSF',
 'association',
 'https://www.swenurse.se',
 NULL,
 NULL,
 ARRAY['sjuksköterska'],
 'Asociație profesională pentru asistente medicale.'),

-- Asociația moașe
('SE-SBF', 'SE',
 'Svenska Barnmorskeförbundet',
 'Swedish Association of Midwives', 'SBF',
 'association',
 'https://www.barnmorskeforbundet.se',
 NULL,
 NULL,
 ARRAY['barnmorska'],
 'Asociație profesională pentru moașe.'),

-- Asociația veterinari
('SE-SVF', 'SE',
 'Sveriges Veterinärförbund',
 'Swedish Veterinary Association', 'SVF',
 'association',
 'https://www.svf.se',
 NULL,
 NULL,
 ARRAY['veterinär'],
 'Asociație profesională pentru veterinari.'),

-- Barou avocați
('SE-ADVOKAT', 'SE',
 'Sveriges Advokatsamfund',
 'Swedish Bar Association', 'Advokatsamfundet',
 'bar',
 'https://www.advokatsamfundet.se',
 'https://www.advokatsamfundet.se/Advokatsokning/',
 NULL,
 ARRAY['advokat'],
 'Barou național. Titlu "advokat" protejat, membru voluntar dar prestigios.'),

-- Asociația arhitecți
('SE-ARK', 'SE',
 'Sveriges Arkitekter',
 'Swedish Association of Architects', 'Sveriges Arkitekter',
 'association',
 'https://www.arkitekt.se',
 NULL,
 NULL,
 ARRAY['arkitekt'],
 'Asociație profesională pentru arhitecți.'),

-- Autoritate SSM/muncă
('SE-AV', 'SE',
 'Arbetsmiljöverket',
 'Swedish Work Environment Authority', 'AV',
 'regulatory_authority',
 'https://www.av.se',
 NULL,
 NULL,
 ARRAY['all companies'],
 'Autoritate pentru mediul de lucru (SSM). Inspecție, reglementări.'),

-- Autoritate PSI
('SE-MSB', 'SE',
 'Myndigheten för samhällsskydd och beredskap',
 'Swedish Civil Contingencies Agency', 'MSB',
 'agency',
 'https://www.msb.se',
 NULL,
 NULL,
 ARRAY['all companies'],
 'Agenție protecție civilă, pompieri, prevenire incendii.'),

-- Autoritate sanitară (IVO)
('SE-IVO', 'SE',
 'Inspektionen för vård och omsorg',
 'Health and Social Care Inspectorate', 'IVO',
 'inspectorate',
 'https://www.ivo.se',
 NULL,
 NULL,
 ARRAY['health professionals','medical facilities'],
 'Inspectorat pentru îngrijirea sănătății.')

ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- JUNCTION LINKS: FRANCE (FR)
-- =====================================================

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes) VALUES
-- Toate formele comerciale standard → INPI (registru) + DGFIP (fiscală) + DREETS (SSM)
('FR-SARL', 'FR-INPI', 'registration', true, 'Immatriculation RCS obligatorie'),
('FR-SARL', 'FR-DGFIP', 'supervision', true, 'Déclarations fiscales TVA, IS'),
('FR-SARL', 'FR-DREETS', 'supervision', true, 'Inspection du travail, SSM'),
('FR-SARL', 'FR-DGSCGC', 'supervision', true, 'Sécurité incendie'),

('FR-EURL', 'FR-INPI', 'registration', true, 'Immatriculation RCS obligatoire'),
('FR-EURL', 'FR-DGFIP', 'supervision', true, 'Déclarations fiscales'),
('FR-EURL', 'FR-DREETS', 'supervision', true, 'Inspection du travail'),
('FR-EURL', 'FR-DGSCGC', 'supervision', true, 'Sécurité incendie'),

('FR-SAS', 'FR-INPI', 'registration', true, 'Immatriculation RCS obligatoire'),
('FR-SAS', 'FR-DGFIP', 'supervision', true, 'Déclarations fiscales'),
('FR-SAS', 'FR-DREETS', 'supervision', true, 'Inspection du travail'),
('FR-SAS', 'FR-DGSCGC', 'supervision', true, 'Sécurité incendie'),

('FR-SASU', 'FR-INPI', 'registration', true, 'Immatriculation RCS obligatoire'),
('FR-SASU', 'FR-DGFIP', 'supervision', true, 'Déclarations fiscales'),
('FR-SASU', 'FR-DREETS', 'supervision', true, 'Inspection du travail'),
('FR-SASU', 'FR-DGSCGC', 'supervision', true, 'Sécurité incendie'),

('FR-SA', 'FR-INPI', 'registration', true, 'Immatriculation RCS obligatoire'),
('FR-SA', 'FR-DGFIP', 'supervision', true, 'Déclarations fiscales'),
('FR-SA', 'FR-DREETS', 'supervision', true, 'Inspection du travail'),
('FR-SA', 'FR-DGSCGC', 'supervision', true, 'Sécurité incendie'),

('FR-SNC', 'FR-INPI', 'registration', true, 'Immatriculation RCS obligatoire'),
('FR-SNC', 'FR-DGFIP', 'supervision', true, 'Déclarations fiscales'),
('FR-SNC', 'FR-DREETS', 'supervision', true, 'Inspection du travail'),
('FR-SNC', 'FR-DGSCGC', 'supervision', true, 'Sécurité incendie'),

('FR-SCS', 'FR-INPI', 'registration', true, 'Immatriculation RCS obligatoire'),
('FR-SCS', 'FR-DGFIP', 'supervision', true, 'Déclarations fiscales'),
('FR-SCS', 'FR-DREETS', 'supervision', true, 'Inspection du travail'),
('FR-SCS', 'FR-DGSCGC', 'supervision', true, 'Sécurité incendie'),

('FR-SE', 'FR-INPI', 'registration', true, 'Immatriculation RCS obligatoire'),
('FR-SE', 'FR-DGFIP', 'supervision', true, 'Déclarations fiscales'),
('FR-SE', 'FR-DREETS', 'supervision', true, 'Inspection du travail'),
('FR-SE', 'FR-DGSCGC', 'supervision', true, 'Sécurité incendie'),

('FR-EEIG', 'FR-INPI', 'registration', true, 'Immatriculation obligatoire'),
('FR-EEIG', 'FR-DGFIP', 'supervision', true, 'Déclarations fiscales'),

('FR-GIE', 'FR-INPI', 'registration', true, 'Immatriculation obligatoire'),
('FR-GIE', 'FR-DGFIP', 'supervision', true, 'Déclarations fiscales'),

('FR-SUCC', 'FR-INPI', 'registration', true, 'Immatriculation succursale'),
('FR-SUCC', 'FR-DGFIP', 'supervision', true, 'Déclarations fiscales'),
('FR-SUCC', 'FR-DREETS', 'supervision', true, 'Inspection du travail'),

('FR-EI', 'FR-INPI', 'registration', true, 'Immatriculation obligatoire'),
('FR-EI', 'FR-DGFIP', 'supervision', true, 'Déclarations fiscales'),
('FR-EI', 'FR-DREETS', 'supervision', true, 'Inspection du travail'),

('FR-MICRO', 'FR-INPI', 'registration', true, 'Immatriculation simplifiée'),
('FR-MICRO', 'FR-DGFIP', 'supervision', true, 'Régime micro-fiscal'),

-- Profesii medicale
('FR-MED', 'FR-CNOM', 'membership', true, 'Inscription Ordre obligatoire'),
('FR-MED', 'FR-DGFIP', 'supervision', true, 'Déclarations revenus BNC/libéral'),
('FR-MED', 'FR-ARS', 'supervision', true, 'Autorité sanitaire régionale'),

('FR-DENT', 'FR-CNOD', 'membership', true, 'Inscription Ordre obligatoire'),
('FR-DENT', 'FR-DGFIP', 'supervision', true, 'Déclarations fiscales'),
('FR-DENT', 'FR-ARS', 'supervision', true, 'Autorité sanitaire'),

('FR-PHARM', 'FR-CNOP', 'membership', true, 'Inscription Ordre obligatoire'),
('FR-PHARM', 'FR-DGFIP', 'supervision', true, 'Déclarations fiscales'),
('FR-PHARM', 'FR-ARS', 'supervision', true, 'Autorité sanitaire'),

('FR-VET', 'FR-CNOV', 'membership', true, 'Inscription Ordre obligatoire'),
('FR-VET', 'FR-DGFIP', 'supervision', true, 'Déclarations fiscales'),

('FR-ARCHI', 'FR-CNOA', 'membership', true, 'Inscription Ordre obligatoire'),
('FR-ARCHI', 'FR-DGFIP', 'supervision', true, 'Déclarations fiscales'),

('FR-AVOC', 'FR-CNB', 'membership', true, 'Inscription barreau obligatoire'),
('FR-AVOC', 'FR-DGFIP', 'supervision', true, 'Déclarations fiscales'),

('FR-NOT', 'FR-CSN', 'membership', true, 'Nomination par Garde des Sceaux'),
('FR-NOT', 'FR-DGFIP', 'supervision', true, 'Déclarations fiscales'),

('FR-INFIRM', 'FR-ONI', 'membership', true, 'Inscription Ordre obligatoire'),
('FR-INFIRM', 'FR-DGFIP', 'supervision', true, 'Déclarations fiscales'),
('FR-INFIRM', 'FR-ARS', 'supervision', true, 'Autorité sanitaire'),

('FR-SELARL', 'FR-INPI', 'registration', true, 'Immatriculation RCS'),
('FR-SELARL', 'FR-DGFIP', 'supervision', true, 'Déclarations fiscales'),
('FR-SELARL', 'FR-CSOEC', 'membership', true, 'Si exercice comptable'),

-- Asociații, fundații
('FR-ASSOC', 'FR-DGFIP', 'supervision', true, 'Si activitate economică: TVA'),
('FR-FOND', 'FR-DGFIP', 'supervision', true, 'Déclarations fiscales fondations'),

-- Cooperative
('FR-SCOP', 'FR-INPI', 'registration', true, 'Immatriculation RCS'),
('FR-SCOP', 'FR-DGFIP', 'supervision', true, 'Déclarations fiscales'),
('FR-SCOP', 'FR-DREETS', 'supervision', true, 'Inspection du travail'),

('FR-SCIC', 'FR-INPI', 'registration', true, 'Immatriculation RCS'),
('FR-SCIC', 'FR-DGFIP', 'supervision', true, 'Déclarations fiscales'),
('FR-SCIC', 'FR-DREETS', 'supervision', true, 'Inspection du travail'),

-- Entități publice
('FR-EPIC', 'FR-DGFIP', 'supervision', true, 'Déclarations fiscales'),
('FR-SEM', 'FR-INPI', 'registration', true, 'Immatriculation RCS'),
('FR-SEM', 'FR-DGFIP', 'supervision', true, 'Déclarations fiscales'),

('FR-SYND', 'FR-DGFIP', 'supervision', false, 'Déclarations si activitate economică')

ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- =====================================================
-- JUNCTION LINKS: ITALY (IT)
-- =====================================================

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes) VALUES
-- Forme comerciale standard → CCIAA (registru) + ADE (fiscală) + INL (SSM)
('IT-SRL', 'IT-CCIAA', 'registration', true, 'Iscrizione Registro Imprese obbligatoria'),
('IT-SRL', 'IT-ADE', 'supervision', true, 'Partita IVA, dichiarazioni fiscali'),
('IT-SRL', 'IT-INL', 'supervision', true, 'Ispezione del lavoro, SSL'),
('IT-SRL', 'IT-VVF', 'supervision', true, 'Prevenzione incendi'),

('IT-SRLS', 'IT-CCIAA', 'registration', true, 'Iscrizione Registro Imprese'),
('IT-SRLS', 'IT-ADE', 'supervision', true, 'Partita IVA'),
('IT-SRLS', 'IT-INL', 'supervision', true, 'SSL'),
('IT-SRLS', 'IT-VVF', 'supervision', true, 'Prevenzione incendi'),

('IT-SPA', 'IT-CCIAA', 'registration', true, 'Iscrizione Registro Imprese'),
('IT-SPA', 'IT-ADE', 'supervision', true, 'Partita IVA'),
('IT-SPA', 'IT-INL', 'supervision', true, 'SSL'),
('IT-SPA', 'IT-VVF', 'supervision', true, 'Prevenzione incendi'),

('IT-SAPA', 'IT-CCIAA', 'registration', true, 'Iscrizione Registro Imprese'),
('IT-SAPA', 'IT-ADE', 'supervision', true, 'Partita IVA'),
('IT-SAPA', 'IT-INL', 'supervision', true, 'SSL'),

('IT-SNC', 'IT-CCIAA', 'registration', true, 'Iscrizione Registro Imprese'),
('IT-SNC', 'IT-ADE', 'supervision', true, 'Partita IVA'),
('IT-SNC', 'IT-INL', 'supervision', true, 'SSL'),

('IT-SAS', 'IT-CCIAA', 'registration', true, 'Iscrizione Registro Imprese'),
('IT-SAS', 'IT-ADE', 'supervision', true, 'Partita IVA'),
('IT-SAS', 'IT-INL', 'supervision', true, 'SSL'),

('IT-SS', 'IT-CCIAA', 'registration', true, 'Iscrizione Registro Imprese'),
('IT-SS', 'IT-ADE', 'supervision', true, 'Partita IVA'),
('IT-SS', 'IT-INL', 'supervision', true, 'SSL'),

('IT-SE', 'IT-CCIAA', 'registration', true, 'Iscrizione Registro Imprese'),
('IT-SE', 'IT-ADE', 'supervision', true, 'Partita IVA'),
('IT-SE', 'IT-INL', 'supervision', true, 'SSL'),

('IT-EEIG', 'IT-CCIAA', 'registration', true, 'Iscrizione obbligatoria'),
('IT-EEIG', 'IT-ADE', 'supervision', true, 'Partita IVA'),

('IT-SUCC', 'IT-CCIAA', 'registration', true, 'Iscrizione succursale'),
('IT-SUCC', 'IT-ADE', 'supervision', true, 'Partita IVA'),
('IT-SUCC', 'IT-INL', 'supervision', true, 'SSL'),

('IT-DITTA', 'IT-CCIAA', 'registration', true, 'Iscrizione ditta individuale'),
('IT-DITTA', 'IT-ADE', 'supervision', true, 'Partita IVA'),
('IT-DITTA', 'IT-INL', 'supervision', true, 'SSL'),

-- Profesii medicale
('IT-MED', 'IT-FNOMCEO', 'membership', true, 'Iscrizione albo obbligatoria'),
('IT-MED', 'IT-ADE', 'supervision', true, 'Partita IVA libero professionista'),
('IT-MED', 'IT-MIN-SAL', 'supervision', true, 'Autorità sanitaria'),

('IT-DENT', 'IT-FNOMCEO', 'membership', true, 'Iscrizione albo odontoiatri'),
('IT-DENT', 'IT-ADE', 'supervision', true, 'Partita IVA'),
('IT-DENT', 'IT-MIN-SAL', 'supervision', true, 'Autorità sanitaria'),

('IT-VET', 'IT-FNOVI', 'membership', true, 'Iscrizione albo veterinari'),
('IT-VET', 'IT-ADE', 'supervision', true, 'Partita IVA'),

('IT-AVV', 'IT-CNF', 'membership', true, 'Iscrizione albo avvocati'),
('IT-AVV', 'IT-ADE', 'supervision', true, 'Partita IVA'),

('IT-NOT', 'IT-CNN', 'membership', true, 'Iscrizione ruolo notai'),
('IT-NOT', 'IT-ADE', 'supervision', true, 'Partita IVA'),

('IT-ARCHI', 'IT-CNAPPC', 'membership', true, 'Iscrizione albo architetti'),
('IT-ARCHI', 'IT-ADE', 'supervision', true, 'Partita IVA'),

('IT-COMM', 'IT-CNDCEC', 'membership', true, 'Iscrizione albo commercialisti'),
('IT-COMM', 'IT-ADE', 'supervision', true, 'Partita IVA'),

-- Asociații, fundații
('IT-ASSOC', 'IT-ADE', 'supervision', true, 'Partita IVA dacă activitate economică'),
('IT-FOND', 'IT-ADE', 'supervision', true, 'Dichiarazioni fiscali fondazioni'),

-- Cooperative
('IT-COOP', 'IT-CCIAA', 'registration', true, 'Iscrizione Registro Imprese'),
('IT-COOP', 'IT-ADE', 'supervision', true, 'Partita IVA'),
('IT-COOP', 'IT-INL', 'supervision', true, 'SSL'),

-- Entități publice
('IT-ENTEPU', 'IT-ADE', 'supervision', true, 'Dichiarazioni fiscali')

ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- =====================================================
-- JUNCTION LINKS: SPAIN (ES)
-- =====================================================

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes) VALUES
-- Forme comerciale standard → RMC (registru) + AEAT (fiscală) + ITSS (SSM)
('ES-SL', 'ES-RMC', 'registration', true, 'Inscripción Registro Mercantil obligatoria'),
('ES-SL', 'ES-AEAT', 'supervision', true, 'NIF, IVA, Impuesto sobre Sociedades'),
('ES-SL', 'ES-ITSS', 'supervision', true, 'Inspección de Trabajo, PRL'),
('ES-SL', 'ES-DGPCE', 'supervision', true, 'Protección contra incendios'),

('ES-SLU', 'ES-RMC', 'registration', true, 'Inscripción Registro Mercantil'),
('ES-SLU', 'ES-AEAT', 'supervision', true, 'NIF, declaraciones fiscales'),
('ES-SLU', 'ES-ITSS', 'supervision', true, 'PRL'),
('ES-SLU', 'ES-DGPCE', 'supervision', true, 'Protección incendios'),

('ES-SA', 'ES-RMC', 'registration', true, 'Inscripción Registro Mercantil'),
('ES-SA', 'ES-AEAT', 'supervision', true, 'NIF, declaraciones fiscales'),
('ES-SA', 'ES-ITSS', 'supervision', true, 'PRL'),
('ES-SA', 'ES-DGPCE', 'supervision', true, 'Protección incendios'),

('ES-SLP', 'ES-RMC', 'registration', true, 'Inscripción Registro Mercantil'),
('ES-SLP', 'ES-AEAT', 'supervision', true, 'NIF, declaraciones fiscales'),
('ES-SLP', 'ES-ITSS', 'supervision', true, 'PRL'),

('ES-SC', 'ES-RMC', 'registration', true, 'Inscripción Registro Mercantil'),
('ES-SC', 'ES-AEAT', 'supervision', true, 'NIF, declaraciones fiscales'),
('ES-SC', 'ES-ITSS', 'supervision', true, 'PRL'),

('ES-CB', 'ES-RMC', 'registration', true, 'Inscripción Registro Mercantil'),
('ES-CB', 'ES-AEAT', 'supervision', true, 'NIF, declaraciones fiscales'),
('ES-CB', 'ES-ITSS', 'supervision', true, 'PRL'),

('ES-UTE', 'ES-RMC', 'registration', true, 'Inscripción Registro Mercantil'),
('ES-UTE', 'ES-AEAT', 'supervision', true, 'NIF'),

('ES-AIE', 'ES-RMC', 'registration', true, 'Inscripción Registro Mercantil'),
('ES-AIE', 'ES-AEAT', 'supervision', true, 'NIF'),

('ES-SE', 'ES-RMC', 'registration', true, 'Inscripción Registro Mercantil'),
('ES-SE', 'ES-AEAT', 'supervision', true, 'NIF'),
('ES-SE', 'ES-ITSS', 'supervision', true, 'PRL'),

('ES-SUCC', 'ES-RMC', 'registration', true, 'Inscripción sucursal'),
('ES-SUCC', 'ES-AEAT', 'supervision', true, 'NIF'),
('ES-SUCC', 'ES-ITSS', 'supervision', true, 'PRL'),

('ES-AUTONOMO', 'ES-AEAT', 'supervision', true, 'NIF, declaraciones IRPF'),
('ES-AUTONOMO', 'ES-ITSS', 'supervision', true, 'PRL autónomos'),

-- Profesii medicale
('ES-MED', 'ES-CGCOM', 'membership', true, 'Colegiación obligatoria'),
('ES-MED', 'ES-AEAT', 'supervision', true, 'IRPF actividad profesional'),
('ES-MED', 'ES-AEMPS', 'supervision', true, 'Autoridad sanitaria'),

('ES-DENT', 'ES-CGCOE', 'membership', true, 'Colegiación obligatoria'),
('ES-DENT', 'ES-AEAT', 'supervision', true, 'IRPF actividad profesional'),
('ES-DENT', 'ES-AEMPS', 'supervision', true, 'Autoridad sanitaria'),

('ES-FARM', 'ES-CGCOF', 'membership', true, 'Colegiación obligatoria'),
('ES-FARM', 'ES-AEAT', 'supervision', true, 'IRPF'),
('ES-FARM', 'ES-AEMPS', 'supervision', true, 'Autoridad sanitaria'),

('ES-AVOC', 'ES-CGAE', 'membership', true, 'Colegiación obligatoria'),
('ES-AVOC', 'ES-AEAT', 'supervision', true, 'IRPF'),

('ES-PSI', 'ES-COP', 'membership', true, 'Colegiación obligatoria'),
('ES-PSI', 'ES-AEAT', 'supervision', true, 'IRPF'),

-- Asociații, fundații
('ES-ASOC', 'ES-AEAT', 'supervision', true, 'NIF dacă activitate economică'),
('ES-FOND', 'ES-AEAT', 'supervision', true, 'Declaraciones fiscales fundaciones'),

-- Cooperative
('ES-COOP', 'ES-RMC', 'registration', true, 'Inscripción Registro Mercantil'),
('ES-COOP', 'ES-AEAT', 'supervision', true, 'NIF, régimen fiscal especial cooperativas'),
('ES-COOP', 'ES-ITSS', 'supervision', true, 'PRL')

ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- =====================================================
-- JUNCTION LINKS: PORTUGAL (PT)
-- =====================================================

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes) VALUES
-- Forme comerciale standard → RNPC (registru) + AT (fiscală) + ACT (SSM)
('PT-LDA', 'PT-RNPC', 'registration', true, 'Registo comercial obrigatório'),
('PT-LDA', 'PT-AT', 'supervision', true, 'NIF, IVA, IRC, declarações fiscais'),
('PT-LDA', 'PT-ACT', 'supervision', true, 'Inspeção do trabalho, SST'),
('PT-LDA', 'PT-ANEPC', 'supervision', true, 'Segurança contra incêndios'),

('PT-UNIP', 'PT-RNPC', 'registration', true, 'Registo comercial obrigatório'),
('PT-UNIP', 'PT-AT', 'supervision', true, 'NIF, declarações fiscais'),
('PT-UNIP', 'PT-ACT', 'supervision', true, 'SST'),
('PT-UNIP', 'PT-ANEPC', 'supervision', true, 'Segurança incêndios'),

('PT-SA', 'PT-RNPC', 'registration', true, 'Registo comercial obrigatório'),
('PT-SA', 'PT-AT', 'supervision', true, 'NIF, declarações fiscais'),
('PT-SA', 'PT-ACT', 'supervision', true, 'SST'),
('PT-SA', 'PT-ANEPC', 'supervision', true, 'Segurança incêndios'),

('PT-SNC', 'PT-RNPC', 'registration', true, 'Registo comercial obrigatório'),
('PT-SNC', 'PT-AT', 'supervision', true, 'NIF, declarações fiscais'),
('PT-SNC', 'PT-ACT', 'supervision', true, 'SST'),

('PT-SCS', 'PT-RNPC', 'registration', true, 'Registo comercial obrigatório'),
('PT-SCS', 'PT-AT', 'supervision', true, 'NIF, declarações fiscais'),
('PT-SCS', 'PT-ACT', 'supervision', true, 'SST'),

('PT-SE', 'PT-RNPC', 'registration', true, 'Registo comercial obrigatório'),
('PT-SE', 'PT-AT', 'supervision', true, 'NIF, declarações fiscales'),
('PT-SE', 'PT-ACT', 'supervision', true, 'SST'),

('PT-EEIG', 'PT-RNPC', 'registration', true, 'Registo obrigatório'),
('PT-EEIG', 'PT-AT', 'supervision', true, 'NIF'),

('PT-SUCC', 'PT-RNPC', 'registration', true, 'Registo sucursal'),
('PT-SUCC', 'PT-AT', 'supervision', true, 'NIF'),
('PT-SUCC', 'PT-ACT', 'supervision', true, 'SST'),

('PT-ENI', 'PT-RNPC', 'registration', true, 'Registo empresário individual'),
('PT-ENI', 'PT-AT', 'supervision', true, 'NIF, declarações IRS'),
('PT-ENI', 'PT-ACT', 'supervision', true, 'SST'),

-- Profesii medicale
('PT-MED', 'PT-OM', 'membership', true, 'Inscrição Ordem obrigatória'),
('PT-MED', 'PT-AT', 'supervision', true, 'IRS atividade profissional'),
('PT-MED', 'PT-DGS', 'supervision', true, 'Autoridade sanitária'),

('PT-DENT', 'PT-OMD', 'membership', true, 'Inscrição Ordem obrigatória'),
('PT-DENT', 'PT-AT', 'supervision', true, 'IRS'),
('PT-DENT', 'PT-DGS', 'supervision', true, 'Autoridade sanitária'),

('PT-PSI', 'PT-OPP', 'membership', true, 'Cédula profissional obrigatória'),
('PT-PSI', 'PT-AT', 'supervision', true, 'IRS'),

-- Asociații, fundații
('PT-ASOC', 'PT-AT', 'supervision', true, 'NIF dacă atividade económica'),
('PT-FUND', 'PT-AT', 'supervision', true, 'Declarações fiscais fundações'),

-- Cooperative
('PT-COOP', 'PT-RNPC', 'registration', true, 'Registo obrigatório'),
('PT-COOP', 'PT-AT', 'supervision', true, 'NIF, regime fiscal especial cooperativas'),
('PT-COOP', 'PT-ACT', 'supervision', true, 'SST')

ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- =====================================================
-- JUNCTION LINKS: NETHERLANDS (NL)
-- =====================================================

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes) VALUES
-- Forme comerciale standard → KVK (registru) + BD (fiscală) + ILT (SSM)
('NL-BV', 'NL-KVK', 'registration', true, 'Inschrijving Handelsregister verplicht'),
('NL-BV', 'NL-BD', 'supervision', true, 'BTW, vennootschapsbelasting'),
('NL-BV', 'NL-ILT', 'supervision', true, 'Arbeidsinspectie'),
('NL-BV', 'NL-BRAND', 'supervision', true, 'Brandveiligheid'),

('NL-NV', 'NL-KVK', 'registration', true, 'Inschrijving Handelsregister'),
('NL-NV', 'NL-BD', 'supervision', true, 'BTW, vennootschapsbelasting'),
('NL-NV', 'NL-ILT', 'supervision', true, 'Arbeidsinspectie'),
('NL-NV', 'NL-BRAND', 'supervision', true, 'Brandveiligheid'),

('NL-VOF', 'NL-KVK', 'registration', true, 'Inschrijving Handelsregister'),
('NL-VOF', 'NL-BD', 'supervision', true, 'BTW, inkomstenbelasting'),
('NL-VOF', 'NL-ILT', 'supervision', true, 'Arbeidsinspectie'),

('NL-CV', 'NL-KVK', 'registration', true, 'Inschrijving Handelsregister'),
('NL-CV', 'NL-BD', 'supervision', true, 'BTW'),
('NL-CV', 'NL-ILT', 'supervision', true, 'Arbeidsinspectie'),

('NL-MAAT', 'NL-KVK', 'registration', true, 'Inschrijving Handelsregister'),
('NL-MAAT', 'NL-BD', 'supervision', true, 'BTW, inkomstenbelasting'),

('NL-SE', 'NL-KVK', 'registration', true, 'Inschrijving Handelsregister'),
('NL-SE', 'NL-BD', 'supervision', true, 'BTW'),
('NL-SE', 'NL-ILT', 'supervision', true, 'Arbeidsinspectie'),

('NL-EEIG', 'NL-KVK', 'registration', true, 'Inschrijving verplicht'),
('NL-EEIG', 'NL-BD', 'supervision', true, 'BTW'),

('NL-SUCC', 'NL-KVK', 'registration', true, 'Inschrijving filiaal'),
('NL-SUCC', 'NL-BD', 'supervision', true, 'BTW'),
('NL-SUCC', 'NL-ILT', 'supervision', true, 'Arbeidsinspectie'),

('NL-EEN', 'NL-KVK', 'registration', true, 'Inschrijving eenmanszaak'),
('NL-EEN', 'NL-BD', 'supervision', true, 'BTW, inkomstenbelasting'),
('NL-EEN', 'NL-ILT', 'supervision', true, 'Arbeidsinspectie'),

-- Profesii medicale
('NL-MED', 'NL-BIG', 'registration', true, 'BIG-registratie verplicht'),
('NL-MED', 'NL-KNMG', 'membership', false, 'Lidmaatschap vrijwillig maar gebruikelijk'),
('NL-MED', 'NL-BD', 'supervision', true, 'Inkomstenbelasting zelfstandige'),
('NL-MED', 'NL-IGJ', 'supervision', true, 'Inspectie gezondheidszorg'),

('NL-DENT', 'NL-BIG', 'registration', true, 'BIG-registratie verplicht'),
('NL-DENT', 'NL-KNMT', 'membership', false, 'Lidmaatschap vrijwillig'),
('NL-DENT', 'NL-BD', 'supervision', true, 'Inkomstenbelasting'),
('NL-DENT', 'NL-IGJ', 'supervision', true, 'Inspectie gezondheidszorg'),

('NL-PHARM', 'NL-BIG', 'registration', true, 'BIG-registratie verplicht'),
('NL-PHARM', 'NL-KNMP', 'membership', false, 'Lidmaatschap vrijwillig'),
('NL-PHARM', 'NL-BD', 'supervision', true, 'Inkomstenbelasting'),
('NL-PHARM', 'NL-IGJ', 'supervision', true, 'Inspectie gezondheidszorg'),

('NL-ADV', 'NL-NOvA', 'membership', true, 'Inschrijving advocatenorde verplicht'),
('NL-ADV', 'NL-BD', 'supervision', true, 'Inkomstenbelasting'),

('NL-NOT', 'NL-KNB', 'membership', true, 'Benoeming en inschrijving verplicht'),
('NL-NOT', 'NL-BD', 'supervision', true, 'Inkomstenbelasting'),

('NL-ARCHI', 'NL-BNA', 'membership', false, 'Lidmaatschap vrijwillig'),
('NL-ARCHI', 'NL-BD', 'supervision', true, 'Inkomstenbelasting'),

('NL-ACCT', 'NL-NBA', 'membership', true, 'Inschrijving verplicht voor accountant-titel'),
('NL-ACCT', 'NL-BD', 'supervision', true, 'Inkomstenbelasting'),

-- Fundații, asociații
('NL-STICHT', 'NL-KVK', 'registration', true, 'Inschrijving Handelsregister'),
('NL-STICHT', 'NL-BD', 'supervision', true, 'BTW dacă activiteit economică'),

('NL-VER', 'NL-KVK', 'registration', true, 'Inschrijving Handelsregister'),
('NL-VER', 'NL-BD', 'supervision', true, 'BTW dacă activiteit economică'),

-- Cooperative
('NL-COOP', 'NL-KVK', 'registration', true, 'Inschrijving Handelsregister'),
('NL-COOP', 'NL-BD', 'supervision', true, 'BTW, vennootschapsbelasting'),
('NL-COOP', 'NL-ILT', 'supervision', true, 'Arbeidsinspectie')

ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- =====================================================
-- JUNCTION LINKS: SWEDEN (SE)
-- =====================================================

INSERT INTO legal_form_bodies (legal_form_code, body_code, relationship, is_mandatory, notes) VALUES
-- Forme comerciale standard → BVR (registru) + SKV (fiscală) + AV (SSM)
('SE-AB', 'SE-BVR', 'registration', true, 'Registrering Bolagsverket obligatorisk'),
('SE-AB', 'SE-SKV', 'supervision', true, 'Moms, företagsskatt, deklarationer'),
('SE-AB', 'SE-AV', 'supervision', true, 'Arbetsmiljöverket'),
('SE-AB', 'SE-MSB', 'supervision', true, 'Brandskydd'),

('SE-AB-PUB', 'SE-BVR', 'registration', true, 'Registrering publikt aktiebolag'),
('SE-AB-PUB', 'SE-SKV', 'supervision', true, 'Moms, deklarationer'),
('SE-AB-PUB', 'SE-AV', 'supervision', true, 'Arbetsmiljö'),
('SE-AB-PUB', 'SE-MSB', 'supervision', true, 'Brandskydd'),

('SE-HB', 'SE-BVR', 'registration', true, 'Registrering handelsbolag'),
('SE-HB', 'SE-SKV', 'supervision', true, 'Moms, inkomstdeklarationer'),
('SE-HB', 'SE-AV', 'supervision', true, 'Arbetsmiljö'),

('SE-KB', 'SE-BVR', 'registration', true, 'Registrering kommanditbolag'),
('SE-KB', 'SE-SKV', 'supervision', true, 'Moms'),
('SE-KB', 'SE-AV', 'supervision', true, 'Arbetsmiljö'),

('SE-SE', 'SE-BVR', 'registration', true, 'Registrering europabolag'),
('SE-SE', 'SE-SKV', 'supervision', true, 'Moms, deklarationer'),
('SE-SE', 'SE-AV', 'supervision', true, 'Arbetsmiljö'),

('SE-EEIG', 'SE-BVR', 'registration', true, 'Registrering EEIG'),
('SE-EEIG', 'SE-SKV', 'supervision', true, 'Moms'),

('SE-FILIAL', 'SE-BVR', 'registration', true, 'Registrering filial'),
('SE-FILIAL', 'SE-SKV', 'supervision', true, 'Moms'),
('SE-FILIAL', 'SE-AV', 'supervision', true, 'Arbetsmiljö'),

('SE-EF', 'SE-BVR', 'registration', true, 'Registrering enskild firma'),
('SE-EF', 'SE-SKV', 'supervision', true, 'Moms, inkomstdeklaration'),
('SE-EF', 'SE-AV', 'supervision', true, 'Arbetsmiljö'),

-- Profesii medicale (toate cu legitimation prin SoS)
('SE-MED', 'SE-SOS', 'licensing', true, 'Legitimation obligatorisk'),
('SE-MED', 'SE-LF', 'membership', false, 'Medlemskap frivilligt'),
('SE-MED', 'SE-SKV', 'supervision', true, 'Inkomstdeklaration egenföretagare'),
('SE-MED', 'SE-IVO', 'supervision', true, 'Tillsyn vårdverksamhet'),

('SE-DENT', 'SE-SOS', 'licensing', true, 'Legitimation obligatorisk'),
('SE-DENT', 'SE-TLV', 'membership', false, 'Medlemskap frivilligt'),
('SE-DENT', 'SE-SKV', 'supervision', true, 'Inkomstdeklaration'),
('SE-DENT', 'SE-IVO', 'supervision', true, 'Tillsyn'),

('SE-PHARM', 'SE-SOS', 'licensing', true, 'Legitimation obligatorisk'),
('SE-PHARM', 'SE-FARM', 'membership', false, 'Medlemskap frivilligt'),
('SE-PHARM', 'SE-SKV', 'supervision', true, 'Inkomstdeklaration'),
('SE-PHARM', 'SE-IVO', 'supervision', true, 'Tillsyn'),

('SE-NURSE', 'SE-SOS', 'licensing', true, 'Legitimation sjuksköterska'),
('SE-NURSE', 'SE-SSF', 'membership', false, 'Medlemskap frivilligt'),
('SE-NURSE', 'SE-SKV', 'supervision', true, 'Inkomstdeklaration'),
('SE-NURSE', 'SE-IVO', 'supervision', true, 'Tillsyn'),

('SE-MID', 'SE-SOS', 'licensing', true, 'Legitimation barnmorska'),
('SE-MID', 'SE-SBF', 'membership', false, 'Medlemskap frivilligt'),
('SE-MID', 'SE-SKV', 'supervision', true, 'Inkomstdeklaration'),
('SE-MID', 'SE-IVO', 'supervision', true, 'Tillsyn'),

('SE-VET', 'SE-SOS', 'licensing', true, 'Legitimation veterinär'),
('SE-VET', 'SE-SVF', 'membership', false, 'Medlemskap frivilligt'),
('SE-VET', 'SE-SKV', 'supervision', true, 'Inkomstdeklaration'),

('SE-ARK', 'SE-ARK', 'membership', false, 'Medlemskap frivilligt'),
('SE-ARK', 'SE-SKV', 'supervision', true, 'Inkomstdeklaration'),

('SE-ADV', 'SE-ADVOKAT', 'membership', false, 'Advokat-titel skyddad, medlemskap frivilligt'),
('SE-ADV', 'SE-SKV', 'supervision', true, 'Inkomstdeklaration'),

('SE-AUD', 'SE-BVR', 'registration', true, 'Registrering godkänd/auktoriserad revisor'),
('SE-AUD', 'SE-SKV', 'supervision', true, 'Inkomstdeklaration'),

-- Asociații ideale
('SE-IDEELL', 'SE-SKV', 'supervision', true, 'Moms dacă ekonomisk verksamhet'),

-- BRF (asociații de proprietari)
('SE-BRF', 'SE-BVR', 'registration', true, 'Registrering bostadsrättsförening'),
('SE-BRF', 'SE-SKV', 'supervision', true, 'Deklarationer'),

-- Fundații
('SE-STIFT', 'SE-SKV', 'supervision', true, 'Deklarationer stiftelser'),

-- Cooperative economice
('SE-EKFOR', 'SE-BVR', 'registration', true, 'Registrering ekonomisk förening'),
('SE-EKFOR', 'SE-SKV', 'supervision', true, 'Moms, deklarationer'),
('SE-EKFOR', 'SE-AV', 'supervision', true, 'Arbetsmiljö')

ON CONFLICT (legal_form_code, body_code, relationship) DO NOTHING;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Count professional bodies per country
SELECT country_code, COUNT(*) as bodies
FROM professional_bodies
WHERE country_code IN ('FR','IT','ES','PT','NL','SE')
GROUP BY country_code
ORDER BY country_code;

-- Count junction links per country
SELECT pb.country_code, COUNT(*) as junctions
FROM legal_form_bodies lfb
JOIN professional_bodies pb ON pb.code = lfb.body_code
WHERE pb.country_code IN ('FR','IT','ES','PT','NL','SE')
GROUP BY pb.country_code
ORDER BY pb.country_code;

-- Total summary
SELECT
  'Total bodies FR+IT+ES+PT+NL+SE' as metric,
  COUNT(*) as count
FROM professional_bodies
WHERE country_code IN ('FR','IT','ES','PT','NL','SE')
UNION ALL
SELECT
  'Total junctions FR+IT+ES+PT+NL+SE' as metric,
  COUNT(*) as count
FROM legal_form_bodies lfb
JOIN professional_bodies pb ON pb.code = lfb.body_code
WHERE pb.country_code IN ('FR','IT','ES','PT','NL','SE');
