// data/caen-activities.ts
// Top 150 activități CAEN cu keywords pentru autocomplete

export interface CaenActivity {
  code: string
  label_ro: string
  keywords: string[]
}

export const caenActivities: CaenActivity[] = [
  { code: '1011', label_ro: 'Prelucrarea și conservarea cărnii', keywords: ['carne', 'abator', 'carmangerie', 'măcelărie', 'mezeluri', 'porc', 'vita'] },
  { code: '1013', label_ro: 'Fabricarea produselor din carne (inclusiv din carne de pasăre)', keywords: ['mezeluri', 'cârnați', 'șuncă', 'salam', 'preparate carne'] },
  { code: '1021', label_ro: 'Prelucrarea și conservarea peștelui', keywords: ['pește', 'pescărie', 'fructe mare', 'conserve pește', 'seafood'] },
  { code: '1031', label_ro: 'Prelucrarea și conservarea cartofilor', keywords: ['cartofi', 'chips', 'conserve legume', 'procesare cartofi'] },
  { code: '1032', label_ro: 'Fabricarea sucurilor de fructe și legume', keywords: ['sucuri', 'suc fructe', 'nectare', 'juice'] },
  { code: '1039', label_ro: 'Prelucrarea și conservarea fructelor și legumelor', keywords: ['fructe', 'legume', 'conserve', 'murături', 'gem', 'dulceață', 'compot'] },
  { code: '1051', label_ro: 'Fabricarea produselor lactate și a brânzeturilor', keywords: ['lapte', 'brânză', 'lactate', 'iaurt', 'smântână', 'unt', 'dairy'] },
  { code: '1061', label_ro: 'Fabricarea produselor de morărit', keywords: ['moară', 'făină', 'morărit', 'grâu', 'porumb', 'cereale'] },
  { code: '1071', label_ro: 'Fabricarea pâinii; fabricarea prăjiturilor și a produselor proaspete de patiserie', keywords: ['cofetărie', 'patiserie', 'prăjituri', 'brutărie', 'pâine', 'panificație', 'cozonac', 'tort', 'coffee shop', 'cof'] },
  { code: '1072', label_ro: 'Fabricarea biscuiților, pișcoturilor și a produselor conservate de patiserie', keywords: ['biscuiți', 'pișcoturi', 'napolitane', 'vafe', 'produse conservate patiserie'] },
  { code: '1082', label_ro: 'Fabricarea produselor din cacao, ciocolatei și a produselor zaharoase', keywords: ['ciocolată', 'bomboane', 'cacao', 'dulciuri', 'zahăr', 'cofetărie', 'candy'] },
  { code: '1083', label_ro: 'Prelucrarea ceaiului și cafelei', keywords: ['cafea', 'ceai', 'torrefacție', 'coffee', 'expresso', 'boabe cafea'] },
  { code: '1085', label_ro: 'Fabricarea mâncărurilor preparate', keywords: ['mâncare gătită', 'catering', 'preparate culinare', 'bucătărie', 'restaurant producție'] },
  { code: '1089', label_ro: 'Fabricarea altor produse alimentare', keywords: ['condimente', 'sosuri', 'oțet', 'muștar', 'maioneză', 'alimente'] },
  { code: '1101', label_ro: 'Distilarea, rafinarea și mixarea băuturilor alcoolice', keywords: ['alcool', 'băuturi spirtoase', 'distilerie', 'vodcă', 'whisky', 'rachiu', 'țuică'] },
  { code: '1102', label_ro: 'Fabricarea vinurilor din struguri', keywords: ['vin', 'vie', 'cramă', 'viticultură', 'vinificație', 'struguri'] },
  { code: '1105', label_ro: 'Fabricarea berii', keywords: ['bere', 'berărie', 'hamei', 'malț', 'brewery'] },
  { code: '1107', label_ro: 'Fabricarea băuturilor răcoritoare nealcoolice', keywords: ['băuturi răcoritoare', 'sucuri carbogazoase', 'apă minerală', 'sifon', 'soft drinks'] },
  { code: '1310', label_ro: 'Pregătirea fibrelor textile și filarea acestora', keywords: ['textile', 'fibre', 'filare', 'bumbac', 'lână', 'mătase'] },
  { code: '1392', label_ro: 'Fabricarea de articole textile confecționate, cu excepția îmbrăcămintei și lenjeriei de pat', keywords: ['textile', 'confecții', 'perdele', 'draperii', 'perne', 'textile casnice'] },
  { code: '1411', label_ro: 'Fabricarea articolelor de îmbrăcăminte din piele', keywords: ['piele', 'îmbrăcăminte', 'geacă piele', 'confecții piele'] },
  { code: '1414', label_ro: 'Fabricarea de lenjerie de corp', keywords: ['lenjerie', 'confecții', 'cămăși', 'tricouri', 'haine'] },
  { code: '1419', label_ro: 'Fabricarea altor articole de îmbrăcăminte și accesorii', keywords: ['haine', 'confecții', 'îmbrăcăminte', 'rochii', 'pantaloni', 'fashion'] },
  { code: '1520', label_ro: 'Fabricarea încălțămintei', keywords: ['pantofi', 'încălțăminte', 'ghete', 'cizme', 'tălpi', 'shoes'] },
  { code: '1623', label_ro: 'Fabricarea altor elemente de dulgherie și tâmplărie pentru construcții', keywords: ['tâmplărie', 'ferestre', 'uși', 'lemn', 'parchet', 'mobilier baie'] },
  { code: '1624', label_ro: 'Fabricarea ambalajelor din lemn', keywords: ['paleți', 'lăzi lemn', 'ambalaje lemn', 'palete'] },
  { code: '1629', label_ro: 'Fabricarea altor produse din lemn', keywords: ['lemn', 'prelucrare lemn', 'cherestea', 'mobilier lemn', 'sculptură lemn'] },
  { code: '1712', label_ro: 'Fabricarea hârtiei și cartonului', keywords: ['hârtie', 'carton', 'celuloză', 'ambalaje hârtie'] },
  { code: '1722', label_ro: 'Fabricarea produselor de uz gospoadresc și sanitar, din hârtie sau carton', keywords: ['hârtie igienică', 'șervețele', 'scutece', 'absorbante', 'tissue'] },
  { code: '1811', label_ro: 'Tipărirea ziarelor', keywords: ['ziar', 'presă', 'tipografie', 'printare', 'publicații'] },
  { code: '1812', label_ro: 'Alte activități de tipărire', keywords: ['tipografie', 'imprimerie', 'print', 'ambalaje tipărite', 'cărți de vizită', 'fluturaș'] },
  { code: '2012', label_ro: 'Fabricarea coloranților și pigmenților', keywords: ['vopsele', 'coloranți', 'pigmenți', 'lacuri'] },
  { code: '2041', label_ro: 'Fabricarea săpunurilor, detergenților și a produselor de întreținere', keywords: ['detergenți', 'săpun', 'produse curățenie', 'dezinfectanți', 'cleaning'] },
  { code: '2042', label_ro: 'Fabricarea parfumurilor și produselor cosmetice (de toaletă)', keywords: ['cosmetice', 'parfumuri', 'cremă', 'make-up', 'beauty', 'cosmetics'] },
  { code: '2211', label_ro: 'Fabricarea anvelopelor și a camerelor de aer', keywords: ['anvelope', 'cauciuc', 'pneuri', 'tires'] },
  { code: '2351', label_ro: 'Fabricarea cimentului', keywords: ['ciment', 'materiale construcții', 'beton'] },
  { code: '2363', label_ro: 'Fabricarea betonului', keywords: ['beton', 'prefabricate', 'stație beton', 'beton marfă'] },
  { code: '2511', label_ro: 'Fabricarea de structuri metalice și componente ale structurilor', keywords: ['metal', 'structuri metalice', 'sudură', 'hale metalice', 'construcții metalice'] },
  { code: '2512', label_ro: 'Fabricarea de uși și ferestre din metal', keywords: ['uși metal', 'ferestre metal', 'aluminiu', 'PVC', 'tâmplărie aluminiu'] },
  { code: '2573', label_ro: 'Fabricarea sculelor', keywords: ['scule', 'unelte', 'burghie', 'freze', 'tools'] },
  { code: '2814', label_ro: 'Fabricarea altor robinete și ventile', keywords: ['robineți', 'ventile', 'fitinguri', 'instalații sanitare'] },
  { code: '2825', label_ro: 'Fabricarea echipamentelor de ventilație și frigorifice, exclusiv cele de uz casnic', keywords: ['climatizare', 'ventilație', 'refrigerare', 'HVAC', 'frigorific'] },
  { code: '2910', label_ro: 'Fabricarea autovehiculelor de transport rutier', keywords: ['automobile', 'mașini', 'caroserie', 'autovehicule'] },
  { code: '3101', label_ro: 'Fabricarea de mobilă pentru birouri și magazine', keywords: ['mobilă birou', 'mobilier office', 'birouri', 'scaune birou'] },
  { code: '3102', label_ro: 'Fabricarea de mobilă pentru bucătărie', keywords: ['mobilă bucătărie', 'bucătărie', 'kitchen', 'dulapuri'] },
  { code: '3109', label_ro: 'Fabricarea de mobilă n.c.a.', keywords: ['mobilă', 'mobilier', 'furniture', 'tapițerie'] },
  { code: '3512', label_ro: 'Distribuția energiei electrice', keywords: ['electricitate', 'energie electrică', 'distribuție curent', 'furnizor energie'] },
  { code: '3600', label_ro: 'Captarea, tratarea și distribuția apei', keywords: ['apă', 'alimentare apă', 'RAJAC', 'distribuție apă'] },
  { code: '3811', label_ro: 'Colectarea deșeurilor nepericuloase', keywords: ['deșeuri', 'gunoi', 'colectare', 'reciclare', 'salubrizare'] },
  { code: '3812', label_ro: 'Colectarea deșeurilor periculoase', keywords: ['deșeuri periculoase', 'chimice', 'medicale', 'ulei uzat'] },
  { code: '3832', label_ro: 'Recuperarea materialelor reciclabile sortate', keywords: ['reciclare', 'dezmembrare', 'fier vechi', 'plastic reciclat', 'hârtie reciclată'] },
  { code: '4110', label_ro: 'Dezvoltare (promovare) imobiliară', keywords: ['imobiliare', 'construcții', 'developer', 'promotor imobiliar', 'ansamblu rezidențial'] },
  { code: '4120', label_ro: 'Lucrări de construcții a clădirilor rezidențiale și nerezidențiale', keywords: ['construcții', 'constructor', 'clădiri', 'case', 'blocuri', 'construcții civile'] },
  { code: '4211', label_ro: 'Lucrări de construcții ale drumurilor și autostrăzilor', keywords: ['drumuri', 'șosele', 'autostrăzi', 'asfalt', 'construcții drumuri', 'con'] },
  { code: '4213', label_ro: 'Construcția de poduri și tuneluri', keywords: ['poduri', 'tuneluri', 'viaducte', 'construcții hidrotehnice'] },
  { code: '4221', label_ro: 'Lucrări de construcții ale proiectelor utilitare pentru fluide', keywords: ['rețele apă', 'canalizare', 'gaze', 'conducte', 'instalații utilități'] },
  { code: '4299', label_ro: 'Lucrări de construcții ale altor proiecte inginerești n.c.a.', keywords: ['construcții inginerești', 'instalații industriale', 'montaj industrial'] },
  { code: '4311', label_ro: 'Lucrări de demolare a construcțiilor', keywords: ['demolare', 'dezmembrare', 'șantier demolare'] },
  { code: '4312', label_ro: 'Lucrări de pregătire a terenului', keywords: ['terasamente', 'excavații', 'fundații', 'nivelare teren', 'pregătire șantier'] },
  { code: '4321', label_ro: 'Lucrări de instalații electrice', keywords: ['electrician', 'instalații electrice', 'panouri electrice', 'cablaje', 'tablouri electrice'] },
  { code: '4322', label_ro: 'Lucrări de instalații sanitare, de încălzire și de aer condiționat', keywords: ['instalator', 'instalații sanitare', 'încălzire', 'aer condiționat', 'termoficare', 'HVAC'] },
  { code: '4329', label_ro: 'Alte lucrări de instalații pentru construcții', keywords: ['instalații gaze', 'instalații termice', 'detectare incendiu', 'sprinklere', 'PSI instalații'] },
  { code: '4331', label_ro: 'Lucrări de ipsoserie', keywords: ['ipsoserie', 'glet', 'tencuială', 'zugrăveală', 'finisaje interioare'] },
  { code: '4332', label_ro: 'Lucrări de tâmplărie și dulgherie', keywords: ['tâmplărie', 'lemn', 'parchet', 'dulapuri', 'montaj uși'] },
  { code: '4333', label_ro: 'Lucrări de pardosire și placare a pereților', keywords: ['gresie', 'faianță', 'parchet', 'marmură', 'pardoseli', 'placare pereți'] },
  { code: '4334', label_ro: 'Lucrări de vopsitorie, zugrăveli și montări de geamuri', keywords: ['zugrăveală', 'vopsit', 'geamuri', 'vitralii', 'decoratori interiori'] },
  { code: '4339', label_ro: 'Alte lucrări de finisare a construcțiilor', keywords: ['finisaje', 'renovare', 'construcții finisare', 'amenajări interioare'] },
  { code: '4391', label_ro: 'Lucrări de învelitori, șarpante și terase la construcții', keywords: ['acoperiș', 'învelitoare', 'șarpantă', 'terasă', 'jgheaburi', 'roofing'] },
  { code: '4399', label_ro: 'Alte lucrări speciale de construcții n.c.a.', keywords: ['construcții speciale', 'hidroizolații', 'termoizolații', 'izolații', 'impermeabilizare'] },
  { code: '4511', label_ro: 'Comerț cu autovehicule', keywords: ['mașini', 'dealership', 'autovehicule', 'showroom auto', 'vânzare mașini'] },
  { code: '4520', label_ro: 'Întreținerea și repararea autovehiculelor', keywords: ['service auto', 'mecanică auto', 'reparații auto', 'tinichigerie', 'vulcanizare', 'ITP'] },
  { code: '4531', label_ro: 'Comerț cu ridicata de piese și accesorii pentru autovehicule', keywords: ['piese auto', 'accesorii auto', 'distribuitoare piese', 'furnizor piese'] },
  { code: '4532', label_ro: 'Comerț cu amănuntul de piese și accesorii pentru autovehicule', keywords: ['piese auto retail', 'magazin piese auto', 'accesorii auto', 'uleiuri auto'] },
  { code: '4711', label_ro: 'Comerț cu amănuntul în magazine nespecializate, cu vânzare predominantă de produse alimentare', keywords: ['supermarket', 'alimentară', 'magazin mixt', 'bacănie', 'colonie', 'minimarket'] },
  { code: '4719', label_ro: 'Comerț cu amănuntul în magazine nespecializate', keywords: ['magazin', 'comerț', 'retail', 'shop', 'vânzare'] },
  { code: '4721', label_ro: 'Comerț cu amănuntul al fructelor și legumelor proaspete', keywords: ['legume fructe', 'zarzavat', 'piață', 'legumărie'] },
  { code: '4724', label_ro: 'Comerț cu amănuntul al pâinii, produselor de patiserie și zaharoase', keywords: ['brutărie', 'cofetărie', 'patiserie', 'prăjituri', 'magazin pâine'] },
  { code: '4741', label_ro: 'Comerț cu amănuntul al calculatoarelor, unităților periferice și software-ului', keywords: ['calculatoare', 'IT', 'laptop', 'software', 'hardware', 'electronics'] },
  { code: '4751', label_ro: 'Comerț cu amănuntul al textilelor', keywords: ['textile', 'stofe', 'materiale textile', 'mercerie'] },
  { code: '4752', label_ro: 'Comerț cu amănuntul al articolelor de fierărie, al articolelor din sticlă și al celor pentru vopsit', keywords: ['fierărie', 'scule', 'materiale construcții', 'vopsele', 'bricolaj'] },
  { code: '4753', label_ro: 'Comerț cu amănuntul al covoarelor, carpetelor, tapetelor și al altor acoperitoare de podea și pereți', keywords: ['covoare', 'parchet', 'tapete', 'decorațiuni'] },
  { code: '4761', label_ro: 'Comerț cu amănuntul al cărților', keywords: ['cărți', 'librărie', 'papetărie', 'rechizite', 'books'] },
  { code: '4771', label_ro: 'Comerț cu amănuntul al îmbrăcămintei', keywords: ['haine', 'îmbrăcăminte', 'boutique', 'fashion', 'magazin haine'] },
  { code: '4772', label_ro: 'Comerț cu amănuntul al încălțămintei și articolelor din piele', keywords: ['pantofi', 'încălțăminte', 'geante', 'piele', 'magazin pantofi'] },
  { code: '4773', label_ro: 'Comerț cu amănuntul al medicamentelor în farmacii', keywords: ['farmacie', 'medicamente', 'farmacist', 'produse farmacie'] },
  { code: '4776', label_ro: 'Comerț cu amănuntul al florilor, plantelor și semințelor; comerț cu amănuntul al animalelor de companie și a hranei pentru acestea', keywords: ['florărie', 'flori', 'plante', 'animale', 'pet shop', 'semințe'] },
  { code: '4777', label_ro: 'Comerț cu amănuntul al ceasurilor și bijuteriilor', keywords: ['bijuterii', 'ceasuri', 'aurărie', 'giuvaiergerie', 'jewelry'] },
  { code: '4941', label_ro: 'Transporturi rutiere de mărfuri', keywords: ['transport marfă', 'camionagiu', 'logistică', 'TIR', 'camion', 'freight', 'curierat'] },
  { code: '4942', label_ro: 'Servicii de mutare', keywords: ['mutări', 'transport mobilă', 'mudanță', 'moving'] },
  { code: '4950', label_ro: 'Transporturi prin conducte', keywords: ['conducte', 'gaze', 'petrol', 'pipeline'] },
  { code: '5010', label_ro: 'Transporturi maritime și costiere de pasageri', keywords: ['transport maritim', 'nave', 'feribot', 'croazieră'] },
  { code: '5110', label_ro: 'Transporturi aeriene de pasageri', keywords: ['aviație', 'transport aerian', 'aeroport', 'aeronavă'] },
  { code: '5210', label_ro: 'Depozitare', keywords: ['depozit', 'warehouse', 'logistică', 'stocare', 'depozitare marfă'] },
  { code: '5221', label_ro: 'Activități de servicii anexe pentru transporturi terestre', keywords: ['parcare', 'service auto', 'stații verificare', 'taximetrie', 'remorcări'] },
  { code: '5310', label_ro: 'Activități ale poștei naționale', keywords: ['poștă', 'colete', 'scrisori', 'postal'] },
  { code: '5320', label_ro: 'Alte activități poștale și de curier', keywords: ['curierat', 'livrare', 'colete', 'courier', 'livrare rapidă', 'DHL', 'FedEx', 'Urgent Cargus'] },
  { code: '5510', label_ro: 'Hoteluri și alte facilități de cazare similare', keywords: ['hotel', 'cazare', 'hostel', 'motel', 'pensiune', 'accommodation', 'resort'] },
  { code: '5520', label_ro: 'Facilități de cazare pentru vacanțe și perioade de scurtă durată', keywords: ['cabane', 'vile', 'apartament turism', 'airbnb', 'cazare scurtă'] },
  { code: '5530', label_ro: 'Parcuri pentru rulote, camping și tabere', keywords: ['camping', 'corturi', 'rulote', 'tabere'] },
  { code: '5610', label_ro: 'Restaurante', keywords: ['restaurant', 'mâncare', 'bucătărie', 'local', 'bistro', 'terasa', 'fast food'] },
  { code: '5621', label_ro: 'Activități de catering pentru evenimente', keywords: ['catering', 'evenimente', 'nuntă', 'recepție', 'mâncare evenimente'] },
  { code: '5629', label_ro: 'Alte servicii de alimentație', keywords: ['cantină', 'restaurant angajați', 'food service', 'cantine'] },
  { code: '5630', label_ro: 'Baruri și alte activități de servire a băuturilor', keywords: ['bar', 'pub', 'cafenea', 'café', 'club', 'nightclub', 'lounge'] },
  { code: '5811', label_ro: 'Activități de editare a cărților', keywords: ['editură', 'cărți', 'publicare', 'publishing', 'tipărituri'] },
  { code: '5813', label_ro: 'Activități de editare a ziarelor', keywords: ['ziare', 'presă', 'jurnalism', 'news', 'media'] },
  { code: '5920', label_ro: 'Activități de realizare a înregistrărilor audio', keywords: ['studio', 'muzică', 'înregistrări', 'album', 'recording'] },
  { code: '6010', label_ro: 'Activități de difuzare a programelor de radio', keywords: ['radio', 'broadcast', 'stație radio', 'emisiuni'] },
  { code: '6020', label_ro: 'Activități de producție și difuzare de programe de televiziune', keywords: ['televiziune', 'TV', 'producție video', 'broadcast'] },
  { code: '6110', label_ro: 'Activități de telecomunicații prin rețele cu fir', keywords: ['telecomunicații', 'internet', 'fibră optică', 'ISP', 'provider internet'] },
  { code: '6120', label_ro: 'Activități de telecomunicații prin rețele fără fir', keywords: ['telefonie mobilă', 'wireless', 'GSM', 'rețea mobilă', '5G'] },
  { code: '6201', label_ro: 'Activități de realizare a soft-ului la comandă (software orientat client)', keywords: ['software', 'programare', 'dezvoltare software', 'IT', 'coding', 'developer', 'aplicații'] },
  { code: '6202', label_ro: 'Activități de consultanță în tehnologia informației', keywords: ['consultanță IT', 'IT consulting', 'tehnologie', 'digitalizare', 'sisteme informatice'] },
  { code: '6203', label_ro: 'Activități de management al resurselor informatice (IT management)', keywords: ['administrare IT', 'server', 'cloud', 'IT management', 'suport tehnic', 'helpdesk'] },
  { code: '6209', label_ro: 'Alte activități de servicii privind tehnologia informației', keywords: ['IT', 'tehnologie', 'servicii informatice', 'web design', 'hosting'] },
  { code: '6311', label_ro: 'Prelucrarea datelor, administrarea paginilor web și activități conexe', keywords: ['web hosting', 'cloud', 'data center', 'hosting', 'server', 'baze de date'] },
  { code: '6312', label_ro: 'Portaluri web', keywords: ['portal web', 'website', 'online', 'platformă web', 'marketplace'] },
  { code: '6420', label_ro: 'Activități ale holdingurilor', keywords: ['holding', 'grup de firme', 'investiții', 'participații'] },
  { code: '6491', label_ro: 'Activități de leasing financiar', keywords: ['leasing', 'finanțare', 'credit leasing', 'chirie financiară'] },
  { code: '6499', label_ro: 'Alte intermedieri financiare n.c.a.', keywords: ['intermediere financiară', 'brokeraj', 'schimb valutar', 'transfer bani'] },
  { code: '6512', label_ro: 'Activități de asigurare, cu excepția celor de viață', keywords: ['asigurări', 'broker asigurări', 'RCA', 'CASCO', 'asigurare', 'broker'] },
  { code: '6612', label_ro: 'Activități ale burselor de valori', keywords: ['bursă', 'acțiuni', 'titluri de valoare', 'tranzacții bursiere'] },
  { code: '6622', label_ro: 'Activități ale agenților și brokerilor de asigurări', keywords: ['broker asigurări', 'agent asigurări', 'polițe', 'asigurare auto'] },
  { code: '6810', label_ro: 'Cumpărarea și vânzarea de bunuri imobiliare proprii', keywords: ['imobiliare', 'tranzacții imobiliare', 'vânzare teren', 'vânzare apartament', 'real estate'] },
  { code: '6820', label_ro: 'Închirierea și subînchirierea bunurilor imobiliare proprii sau închiriate', keywords: ['închiriere', 'chirie', 'închiriere spații', 'proprietar', 'administrare imobile'] },
  { code: '6831', label_ro: 'Agenții imobiliare', keywords: ['agenție imobiliară', 'agent imobiliar', 'tranzacții imobiliare', 'broker imobiliar'] },
  { code: '6910', label_ro: 'Activități juridice', keywords: ['avocat', 'drept', 'juridic', 'cabinet avocatură', 'notar', 'executor judecătoresc'] },
  { code: '6920', label_ro: 'Activități de contabilitate și audit financiar; consultanță în domeniul fiscal', keywords: ['contabilitate', 'contabil', 'audit', 'fiscal', 'taxe', 'bilanț', 'TVA', 'declarații'] },
  { code: '7010', label_ro: 'Activități ale direcțiilor (centralelor), birourilor administrative centralizate', keywords: ['management', 'administrare centrală', 'holding', 'sediu central'] },
  { code: '7021', label_ro: 'Activități de consultanță în domeniul relațiilor publice și al comunicării', keywords: ['PR', 'comunicare', 'relații publice', 'media', 'publicitate'] },
  { code: '7022', label_ro: 'Activități de consultanță pentru afaceri și management', keywords: ['consultanță afaceri', 'management consulting', 'strategie', 'business'] },
  { code: '7111', label_ro: 'Activități de arhitectură', keywords: ['arhitectură', 'arhitect', 'proiectare', 'design arhitectural', 'urbanism'] },
  { code: '7112', label_ro: 'Activități de inginerie și consultanță tehnică legate de acestea', keywords: ['inginerie', 'proiectare tehnică', 'consultant tehnic', 'inginer', 'proiect tehnic', 'SSM', 'PSI'] },
  { code: '7120', label_ro: 'Activități de testare și analiză tehnică', keywords: ['laborator', 'testare', 'verificare tehnică', 'inspecție', 'certificare'] },
  { code: '7211', label_ro: 'Cercetare-dezvoltare în biotehnologie', keywords: ['biotehnologie', 'cercetare', 'R&D', 'laborator cercetare'] },
  { code: '7219', label_ro: 'Alte activități de cercetare-dezvoltare în știinte naturale și inginerie', keywords: ['cercetare', 'R&D', 'inovație', 'laborator', 'știință'] },
  { code: '7311', label_ro: 'Activități ale agențiilor de publicitate', keywords: ['publicitate', 'agenție publicitate', 'advertising', 'reclame', 'marketing'] },
  { code: '7312', label_ro: 'Servicii de reprezentare media', keywords: ['media', 'publicitate media', 'spații publicitare', 'media buying'] },
  { code: '7320', label_ro: 'Activități de studiere a pieței și de sondare a opiniei publice', keywords: ['cercetare piață', 'sondaje', 'marketing research', 'focus grup'] },
  { code: '7410', label_ro: 'Activități de design specializat', keywords: ['design', 'grafică', 'UI/UX', 'designer', 'branding', 'logo'] },
  { code: '7420', label_ro: 'Activități fotografice', keywords: ['fotografie', 'fotograf', 'studio foto', 'fotografii eveniment'] },
  { code: '7430', label_ro: 'Activități de traducere scrisă și orală (interpreți)', keywords: ['traduceri', 'traducător', 'interpretat', 'birou traduceri'] },
  { code: '7490', label_ro: 'Alte activități profesionale, științifice și tehnice n.c.a.', keywords: ['consultanță', 'expertiză', 'servicii profesionale', 'SSM', 'PSI', 'mediu', 'securitate muncă'] },
  { code: '7500', label_ro: 'Activități veterinare', keywords: ['veterinar', 'cabinet veterinar', 'animale', 'clinică animale'] },
  { code: '7711', label_ro: 'Activități de închiriere și leasing cu autoturisme și autovehicule rutiere ușoare', keywords: ['rent a car', 'închiriere mașini', 'leasing auto', 'car rental'] },
  { code: '7712', label_ro: 'Activități de închiriere și leasing cu autovehicule rutiere grele', keywords: ['închiriere camioane', 'leasing camioane', 'transport', 'vehicule grele'] },
  { code: '7733', label_ro: 'Activități de închiriere și leasing cu mașini și echipamente de birou (inclusiv calculatoare)', keywords: ['închiriere echipamente', 'leasing IT', 'copiatoare', 'echipamente birou'] },
  { code: '7810', label_ro: 'Activități ale agențiilor de plasare a forței de muncă', keywords: ['agenție muncă', 'recrutare', 'plasare forță muncă', 'angajare', 'HR', 'recruitment'] },
  { code: '7820', label_ro: 'Activități de contractare, pe baze temporare, a personalului', keywords: ['muncă temporară', 'agenție temporară', 'angajați temporari', 'staff leasing'] },
  { code: '7830', label_ro: 'Servicii de furnizare și management a forței de muncă', keywords: ['outsourcing HR', 'furnizare personal', 'servicii HR', 'management resurse umane'] },
  { code: '7911', label_ro: 'Activități ale agențiilor turistice', keywords: ['turism', 'agenție turism', 'vacanțe', 'excursii', 'bilete avion'] },
  { code: '7990', label_ro: 'Alte servicii de rezervare și asistență turistică n.c.a.', keywords: ['turism', 'rezervări', 'ghid turistic', 'aventură', 'tour operator'] },
  { code: '8010', label_ro: 'Activități de protecție și gardă', keywords: ['securitate', 'pază', 'gardă', 'supraveghere', 'security', 'bodyguard'] },
  { code: '8020', label_ro: 'Activități de servicii privind sistemele de securitate', keywords: ['alarme', 'sisteme securitate', 'supraveghere video', 'CCTV', 'control acces'] },
  { code: '8110', label_ro: 'Activități de servicii suport combinate', keywords: ['facility management', 'administrare clădiri', 'servicii suport', 'mentenanță clădiri'] },
  { code: '8121', label_ro: 'Activități generale de curățenie a clădirilor', keywords: ['curățenie', 'servicii curățenie', 'menaj', 'cleaning', 'igienizare'] },
  { code: '8122', label_ro: 'Alte activități de curățenie și de salubrizare', keywords: ['dezinfecție', 'deratizare', 'dezinsecție', 'salubrizare', 'curățenie industrială'] },
  { code: '8130', label_ro: 'Activități de întreținere peisagistică', keywords: ['grădinărit', 'amenajare peisagistică', 'gazon', 'curățenie exterioară', 'parcuri grădinit'] },
  { code: '8211', label_ro: 'Activități combinate de secretariat', keywords: ['secretariat', 'BPO', 'outsourcing administrativ', 'back office'] },
  { code: '8219', label_ro: 'Fotocopiere, pregătire de documente și alte activități specializate de secretariat', keywords: ['copiere', 'scanare', 'documente', 'legătorie', 'binding'] },
  { code: '8230', label_ro: 'Activități de organizare a expoziților, târgurilor și congreselor', keywords: ['evenimente', 'conferințe', 'târguri', 'expoziții', 'congrese', 'event management'] },
  { code: '8291', label_ro: 'Activități ale agențiilor de colectare a creanțelor și ale birourilor de raportare a creditelor', keywords: ['recuperare creanțe', 'colectare datorii', 'birou credit'] },
  { code: '8520', label_ro: 'Învățământ primar', keywords: ['școală', 'educație', 'învățământ primar', 'copii', 'elevi'] },
  { code: '8531', label_ro: 'Învățământ secundar general', keywords: ['liceu', 'gimnaziu', 'educație', 'profesori', 'elevi'] },
  { code: '8552', label_ro: 'Activități de instruire sportivă, recreațională și de agrement', keywords: ['sport', 'fitness', 'sală sport', 'instructor', 'cursuri sport', 'antrenament'] },
  { code: '8553', label_ro: 'Activități ale școlilor de conducere (pilotaj)', keywords: ['școală șoferi', 'auto-școală', 'permis conducere', 'instructori auto'] },
  { code: '8559', label_ro: 'Alte forme de învățământ n.c.a.', keywords: ['cursuri', 'formare profesională', 'training', 'curs', 'calificare', 'autorizare SSM'] },
  { code: '8610', label_ro: 'Activități de asistență spitalicească', keywords: ['spital', 'clinică', 'sănătate', 'medici', 'pacienți', 'asistență medicală'] },
  { code: '8621', label_ro: 'Activități de asistență medicală generală', keywords: ['medic de familie', 'cabinet medical', 'consultații', 'doctor', 'sănătate'] },
  { code: '8622', label_ro: 'Activități de asistență medicală specializată', keywords: ['specialist', 'clinică specialitate', 'radiologie', 'cardiologie', 'chirurgie'] },
  { code: '8623', label_ro: 'Activități de asistență stomatologică', keywords: ['stomatologie', 'dentist', 'cabinet dentar', 'ortodonție', 'implant dentar'] },
  { code: '8690', label_ro: 'Alte activități referitoare la sănătatea umană', keywords: ['fizioterapie', 'kinetoterapie', 'laborator analize', 'optică medicală', 'recuperare medicală'] },
  { code: '8710', label_ro: 'Activități ale centrelor de îngrijire medicală', keywords: ['centru rezidențial', 'îngrijire bătrâni', 'centre recuperare', 'cămine'] },
  { code: '8790', label_ro: 'Alte activități de asistență socială, fără cazare', keywords: ['asistență socială', 'servicii sociale', 'îngrijire la domiciliu', 'ajutor social'] },
  { code: '9001', label_ro: 'Activități de interpretare artistică (spectacole)', keywords: ['spectacole', 'teatru', 'muzică', 'artiști', 'concert', 'show'] },
  { code: '9321', label_ro: 'Activitățile parcurilor de distracții și a parcurilor tematice', keywords: ['parc distracții', 'atracții', 'divertisment', 'entertainment'] },
  { code: '9329', label_ro: 'Alte activități recreative și distractive n.c.a.', keywords: ['bowling', 'paintball', 'escape room', 'karting', 'divertisment'] },
  { code: '9411', label_ro: 'Activități ale organizațiilor economice, patronale și profesionale', keywords: ['asociație patronală', 'cameră comerț', 'organizație patronală', 'sindicat'] },
  { code: '9412', label_ro: 'Activități ale organizațiilor profesionale', keywords: ['asociație profesională', 'ordin profesional', 'federație', 'consorțiu'] },
  { code: '9511', label_ro: 'Repararea calculatoarelor și a echipamentelor periferice', keywords: ['service calculatoare', 'reparații laptop', 'IT support', 'service IT'] },
  { code: '9521', label_ro: 'Repararea aparatelor electronice de uz casnic', keywords: ['service electrocasnice', 'reparații TV', 'service audio-video'] },
  { code: '9529', label_ro: 'Repararea altor bunuri de uz personal și gospodăresc', keywords: ['reparații încălțăminte', 'ceasornicar', 'cizmar', 'service diverse'] },
  { code: '9601', label_ro: 'Spălarea și curățarea (uscată) a articolelor textile și a produselor din blană', keywords: ['curătorie', 'spălătorie', 'dry cleaning', 'curățare haine'] },
  { code: '9602', label_ro: 'Coafură și alte activități de înfrumusețare', keywords: ['frizerie', 'coafor', 'salon', 'hair salon', 'barbershop', 'beauty salon'] },
  { code: '9603', label_ro: 'Activități de pompe funebre și similare', keywords: ['pompe funebre', 'servicii funerare', 'înmormântare', 'sicrie'] },
  { code: '9604', label_ro: 'Activități de întreținere corporală', keywords: ['spa', 'masaj', 'salon beauty', 'estetică', 'wellness', 'saună', 'frizerie'] },
  { code: '9609', label_ro: 'Alte activități de servicii n.c.a.', keywords: ['servicii diverse', 'reparații', 'confecții', 'alte servicii'] },
]

// Normalizare diacritice pentru căutare
function normalize(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

// Căutare activități CAEN
export function searchCaenActivities(query: string, limit = 8): CaenActivity[] {
  if (!query || query.trim().length < 2) return []

  const normalizedQuery = normalize(query)
  const words = normalizedQuery.split(/\s+/).filter((w) => w.length >= 2)

  const scored = caenActivities.map((activity) => {
    const normalizedLabel = normalize(activity.label_ro)
    const normalizedKeywords = activity.keywords.map(normalize)
    const normalizedCode = activity.code

    let score = 0

    // Potrivire exactă cod
    if (normalizedCode === normalizedQuery) score += 100

    // Potrivire prefix cod
    if (normalizedCode.startsWith(normalizedQuery)) score += 50

    // Fiecare cuvânt din query
    for (const word of words) {
      // În label
      if (normalizedLabel.includes(word)) score += 10
      if (normalizedLabel.startsWith(word)) score += 5

      // În keywords
      for (const kw of normalizedKeywords) {
        if (kw === word) score += 20
        if (kw.startsWith(word)) score += 15
        if (kw.includes(word)) score += 8
      }
    }

    return { activity, score }
  })

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.activity)
}
