'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Users,
  GraduationCap,
  Heart,
  Package,
  FileText,
  BarChart3,
  Settings,
  Video,
  Mail,
  X,
  ChevronRight,
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  videoUrl?: string;
}

const categories: Category[] = [
  { id: 'primi-pasi', name: 'Primii pași', icon: BookOpen },
  { id: 'angajati', name: 'Angajați', icon: Users },
  { id: 'instruire', name: 'Instruire', icon: GraduationCap },
  { id: 'medical', name: 'Medical', icon: Heart },
  { id: 'echipamente', name: 'Echipamente', icon: Package },
  { id: 'documente', name: 'Documente', icon: FileText },
  { id: 'rapoarte', name: 'Rapoarte', icon: BarChart3 },
  { id: 'setari', name: 'Setări', icon: Settings },
];

const articles: Article[] = [
  // Primii pași
  {
    id: 'pp-1',
    category: 'primi-pasi',
    title: 'Cum configurez contul organizației?',
    content: `# Configurare cont organizație

Pentru a configura contul organizației tale, urmează acești pași:

1. **Accesează Setări** - Click pe avatarul tău din colțul dreapta-sus și selectează "Setări organizație"
2. **Completează datele firmei** - Adaugă CUI, nume companie, adresă și detalii de contact
3. **Setează logo-ul** - Încarcă logo-ul companiei (va apărea pe documente și rapoarte)
4. **Configurează notificări** - Alege ce tipuri de alerte dorești să primești

**Consiliu**: Asigură-te că datele CUI sunt corecte - acestea vor fi folosite pentru generarea automată a documentelor oficiale.`,
  },
  {
    id: 'pp-2',
    category: 'primi-pasi',
    title: 'Cum adaug primul angajat?',
    content: `# Adăugare primul angajat

Pasul inițial pentru a folosi platforma este adăugarea angajaților:

1. **Navighează la Angajați** - Din meniul lateral, selectează secțiunea "Angajați"
2. **Click "Adaugă angajat"** - Butonul albastru din colțul dreapta-sus
3. **Completează formularul**:
   - Date personale (nume, CNP, date contact)
   - Funcție și departament
   - Data angajării
   - Documente necesare (CI, contract)

4. **Salvează** - Angajatul va apărea în listă și va fi eligibil pentru instruiri și examinări medicale

**Important**: CNP-ul trebuie să fie valid și unic în sistem.`,
  },
  {
    id: 'pp-3',
    category: 'primi-pasi',
    title: 'Ce înseamnă alertele de pe dashboard?',
    content: `# Înțelegerea alertelor

Dashboard-ul afișează alerte pentru a te ajuta să menții compliance-ul:

## Tipuri de alerte

- 🔴 **Critice** (roșu) - Acțiune imediată necesară (ex: instruire expirată)
- 🟡 **Atenție** (galben) - Expirare în următoarele 30 de zile
- 🔵 **Informative** (albastru) - Notificări generale

## Acțiuni rapide

Click pe orice alertă pentru a vedea detalii și acțiuni disponibile. Poți:
- Programa instruire/examinare
- Marca ca rezolvată
- Amâna temporar (cu justificare)

**Consiliu**: Verifică dashboard-ul zilnic pentru a rămâne la zi cu toate obligațiile.`,
  },
  {
    id: 'pp-4',
    category: 'primi-pasi',
    title: 'Cum generez primul raport?',
    content: `# Generare rapoarte

Platforma generează automat rapoarte profesionale pentru autoritățile de control:

1. **Accesează Rapoarte** - Din meniul lateral
2. **Selectează tipul de raport**:
   - Raport instruire SSM
   - Raport examinări medicale
   - Raport echipamente
   - Registre conforme legislație

3. **Alege perioada** - Selectează intervalul de timp dorit
4. **Filtrează** - Opțional, filtrează pe departament sau locație
5. **Generează PDF** - Click pe "Generează raport" pentru descărcare

Rapoartele includ automat logo-ul companiei și sunt conforme cu cerințele legale.`,
  },
  {
    id: 'pp-5',
    category: 'primi-pasi',
    title: 'Cum invit colegi să folosească platforma?',
    content: `# Invitare membri echipă

Pentru a invita colegi din echipa ta:

1. **Setări → Membri echipă** - Accesează secțiunea de membri
2. **Click "Invită membru"** - Butonul de invitare
3. **Introdu email-ul** - Email-ul colegului tău
4. **Selectează rol**:
   - **Administrator** - Acces complet
   - **Consultant SSM** - Gestionează toate aspectele SSM
   - **Angajat** - Acces limitat la propriile date

5. **Trimite invitație** - Un email va fi trimis automat

Colegul va primi un link de activare și va putea seta propria parolă.`,
  },

  // Angajați
  {
    id: 'ang-1',
    category: 'angajati',
    title: 'Cum import angajați în masă din Excel?',
    content: `# Import masiv angajați

Pentru companii cu multe persoane, poți importa angajați din fișiere Excel:

1. **Descarcă șablonul** - Click pe "Import" → "Descarcă șablon Excel"
2. **Completează fișierul** cu datele angajaților:
   - Coloane obligatorii: Nume, Prenume, CNP, Funcție
   - Coloane opționale: Email, Telefon, Departament, Data angajării

3. **Încarcă fișierul** - Drag & drop sau selectează fișierul
4. **Validare** - Sistemul verifică automat CNP-urile și datele
5. **Confirmă importul** - Revizuiește și confirmă

**Format acceptat**: .xlsx, .csv (maxim 500 angajați per import)

**Consiliu**: Verifică șablonul pentru a vedea exact ce coloane sunt necesare.`,
  },
  {
    id: 'ang-2',
    category: 'angajati',
    title: 'Cum gestionez departamentele și funcțiile?',
    content: `# Organizare departamente și funcții

Structurează organizația pentru raportare mai ușoară:

## Crearea departamentelor

1. **Setări → Structură organizatorică**
2. **Adaugă departament nou** - Exemplu: "Producție", "Administrație", "Logistică"
3. **Setează responsabil** - Opțional, desemnează un șef de departament

## Gestionarea funcțiilor

1. **Setări → Funcții**
2. **Adaugă funcție** - Exemplu: "Electrician", "Sudor", "Contabil"
3. **Asociază cod COR** - Important pentru conformitatea cu legislația
4. **Specifică riscuri** - Definește riscurile specifice funcției

Aceste setări vor fi folosite automat la generarea documentelor și rapoartelor.`,
  },
  {
    id: 'ang-3',
    category: 'angajati',
    title: 'Cum urmăresc istoricul unui angajat?',
    content: `# Istoric complet angajat

Fiecare angajat are o fișă completă cu tot istoricul:

## Accesare istoric

Click pe numele angajatului → Tab "Istoric complet"

## Ce poți vedea:

- **Instruiri** - Toate instruirile urmate (SSM, PSI, Prim Ajutor)
- **Medical** - Examinări medicale și avize
- **Echipamente** - EIP atribuite și înlocuite
- **Incidente** - Eventuri înregistrate (dacă există)
- **Documente** - Contracte, fișe post, evaluări de risc
- **Modificări date** - Audit trail complet

## Export

Poți exporta istoricul complet ca PDF pentru arhivare sau prezentare inspectorilor ITM.`,
  },
  {
    id: 'ang-4',
    category: 'angajati',
    title: 'Ce fac când un angajat pleacă din firmă?',
    content: `# Încetare contract de muncă

Când un angajat părăsește compania:

1. **Marchează ca inactiv** - Profil angajat → "Încetare contract"
2. **Specifică data** - Data efectivă a plecării
3. **Motiv** - Demisie, concediere, pensionare, etc.
4. **Returnare EIP** - Confirmă returnarea echipamentelor

## Ce se întâmplă:

- ✅ Angajatul rămâne în istoric (pentru audit)
- ✅ Nu mai apare în listele active
- ✅ Nu mai generează alerte
- ✅ Istoricul și documentele rămân disponibile

**Important**: Nu șterge niciodată angajații - menține istoricul pentru conformitate legală!`,
  },
  {
    id: 'ang-5',
    category: 'angajati',
    title: 'Cum generez fișa de aptitudini?',
    content: `# Generare fișă de aptitudini

Fișa de aptitudini este obligatorie pentru fiecare angajat:

1. **Profil angajat → Documente**
2. **Click "Generează fișă de aptitudini"**
3. **Verifică datele**:
   - Funcția și codul COR
   - Riscurile identificate
   - EIP necesare
   - Instruiri obligatorii

4. **Generează PDF** - Descarcă sau trimite direct angajatului

Fișa se actualizează automat când modifici funcția sau riscurile asociate.

**Consiliu**: Generează fișa după fiecare evaluare de risc sau modificare de post.`,
  },

  // Instruire
  {
    id: 'inst-1',
    category: 'instruire',
    title: 'Cum programez o instruire SSM?',
    content: `# Programare instruire SSM

Instruirea periodică este obligatorie conform Legii 319/2006:

1. **Instruire → Programare nouă**
2. **Selectează tipul**:
   - Instruire inițială (angajați noi)
   - Instruire periodică (6 luni / 1 an / 2 ani)
   - Instruire la locul de muncă
   - Instruire suplimentară

3. **Selectează participanți** - Individual sau pe departamente
4. **Setează data și ora** - Calendarul verifică automat disponibilitatea
5. **Adaugă tematică** - Subiecte conform HG 1425/2006
6. **Confirmă** - Participanții primesc notificare automată

**Periodicitate**:
- Muncitori: 6 luni - 1 an
- Personal TESA: 2 ani`,
  },
  {
    id: 'inst-2',
    category: 'instruire',
    title: 'Cum înregistrez o instruire efectuată?',
    content: `# Înregistrare instruire

După efectuarea instruirii:

1. **Instruire → Instruiri în desfășurare**
2. **Selectează instruirea** - Click pe sesiunea corectă
3. **Marchează prezența** - Bifează participanții prezenți
4. **Încarcă proces verbal** - PDF semnat și scanat
5. **Încarcă poze** (opțional) - Dovezi foto din timpul instruirii
6. **Finalizează** - Status se schimbă în "Completat"

## Se actualizează automat:

- ✅ Data următoarei instruiri
- ✅ Certificatele angajaților
- ✅ Alertele de expirare
- ✅ Rapoartele de conformitate`,
  },
  {
    id: 'inst-3',
    category: 'instruire',
    title: 'Ce este matricea de instruire?',
    content: `# Matricea de instruire

Vizualizare simplă a stării instruirilor pentru toți angajații:

## Accesare

**Instruire → Matrice** - Vezi tot status-ul dintr-o privire

## Culori:

- 🟢 **Verde** - Instruire la zi (valabilă)
- 🟡 **Galben** - Expirare în 30 zile
- 🔴 **Roșu** - Instruire expirată
- ⚪ **Gri** - Nicio instruire înregistrată

## Filtrare:

- Pe departament
- Pe tip instruire
- Pe status

Click pe orice celulă pentru a vedea detalii și a programa instruire.

**Consiliu**: Exportă matricea lunar pentru arhivă și raportare către management.`,
  },
  {
    id: 'inst-4',
    category: 'instruire',
    title: 'Cum generez procesul verbal de instruire?',
    content: `# Proces verbal instruire

Platforma generează automat PV-ul conform legislației:

1. **După programarea instruirii** - Accesează sesiunea
2. **Click "Generează PV"** - Înainte sau după instruire
3. **PV-ul include automat**:
   - Date companie (CUI, adresă, etc.)
   - Lista participanților
   - Tematica instruirii
   - Durata și locul desfășurării
   - Semnăturile (placeholder pentru completare)

4. **Printează** - Pentru semnare de către participanți
5. **Scanează și încarcă** - După semnare, încarcă PDF-ul semnat

**Format**: Conforme cu HG 1425/2006 și Legea 319/2006`,
  },
  {
    id: 'inst-5',
    category: 'instruire',
    title: 'Cum urmăresc instruirile expirante?',
    content: `# Monitorizare instruiri expirante

Evită amenzile cu sistemul automat de alerte:

## Dashboard principal

Widget "Instruiri expirante" - Vezi rapid ce urmează

## Alerte automate

Sistemul trimite notificări:
- 📧 **Cu 60 zile înainte** - Reminder planificare
- 📧 **Cu 30 zile înainte** - Alertă urgentă
- 📧 **La expirare** - Notificare critică

## Setări notificări

**Setări → Notificări** - Configurează:
- Cine primește alertele
- Cu câte zile înainte
- Pe email și/sau SMS

**Consiliu**: Programează instruirile cu 45 zile înainte de expirare pentru a avea marja de timp.`,
  },

  // Medical
  {
    id: 'med-1',
    category: 'medical',
    title: 'Cum programez examinări medicale?',
    content: `# Programare examinări medicale

Examinările medicale sunt obligatorii conform Legii 319/2006:

1. **Medical → Programare nouă**
2. **Selectează tipul**:
   - Examinare la angajare (obligatorie pentru toți)
   - Examinare periodică (anual, bianual)
   - Examinare la reluarea activității
   - Control medical suplimentar

3. **Selectează angajații** - Individual sau grup
4. **Alege furnizor medical** - Din lista ta sau adaugă unul nou
5. **Setează data** - Sincronizare opțională cu calendarul cabinetului
6. **Confirmă** - Angajații primesc SMS/email automat

**Periodicitate**:
- Standard: la 2 ani
- Muncă noapte / risc crescut: anual`,
  },
  {
    id: 'med-2',
    category: 'medical',
    title: 'Cum înregistrez avizul medical?',
    content: `# Înregistrare aviz medical

După examinarea la cabinet:

1. **Medical → Programări active**
2. **Selectează programarea** - Click pe angajat
3. **Înregistrează rezultatul**:
   - ✅ **Apt** - Angajat apt pentru funcție
   - ⚠️ **Apt cu recomandări** - Apt cu restricții
   - ❌ **Inapt** - Inapt temporar/definitiv

4. **Încarcă aviz** - PDF/imagine aviz medical original
5. **Data următoarei examinări** - Setată automat sau manual
6. **Recomandări** - Notează eventualele restricții

Sistemul actualizează automat status-ul și alertele.`,
  },
  {
    id: 'med-3',
    category: 'medical',
    title: 'Ce fac cu angajații inapți?',
    content: `# Gestionare angajați inapți

Când un angajat primește aviz de inaptitudine:

## Inapt temporar

1. **Înregistrează perioada** - Durata inaptitudinii
2. **Status "Suspendat temporar"** - Angajatul nu poate lucra
3. **La revenire** - Programează control medical
4. **După aviz favorabil** - Reactivează angajatul

## Inapt definitiv

1. **Evaluează opțiuni**:
   - Schimbare post (dacă este posibil)
   - Încetare contract (conform Codului Muncii)

2. **Documentează** - Avizul medical și decizia

**Important**: Inapt nu înseamnă automat concediere - evaluează alternative conform legii!`,
  },
  {
    id: 'med-4',
    category: 'medical',
    title: 'Cum gestionez furnizorii de servicii medicale?',
    content: `# Gestionare furnizori medicali

Adaugă și gestionează cabinete de medicina muncii:

1. **Setări → Furnizori medicali**
2. **Adaugă furnizor**:
   - Nume cabinet/spital
   - Date contact (telefon, email)
   - Adresă
   - Program
   - Tarife (opțional)

3. **Medic de medicina muncii** - Specifică numele medicului

## Beneficii:

- ✅ Selecție rapidă la programare
- ✅ Istoric colaborare
- ✅ Rapoarte automate către furnizor
- ✅ Sincronizare calendare (premium)

**Consiliu**: Adaugă notițe despre serviciile oferite și experiența ta cu fiecare furnizor.`,
  },
  {
    id: 'med-5',
    category: 'medical',
    title: 'Cum export registrul medical?',
    content: `# Export registru medical

Registrul medical este obligatoriu și supus controlului ITM:

1. **Medical → Rapoarte**
2. **Selectează "Registru medical"**
3. **Filtrează perioada** - An calendaristic sau custom
4. **Opțiuni export**:
   - PDF (pentru printare/arhivare)
   - Excel (pentru analiză)

## Registrul include:

- Toate examinările efectuate
- Rezultatele (apt/inapt)
- Data următoarei examinări
- Furnizor medical
- Observații

**Format**: Conform Ordinului 1030/2006

**Consiliu**: Exportă registrul la final de an și păstrează-l minim 5 ani.`,
  },

  // Echipamente
  {
    id: 'ech-1',
    category: 'echipamente',
    title: 'Cum adaug echipamente de protecție (EIP)?',
    content: `# Adăugare echipamente de protecție

Gestionează EIP-urile conform Legii 319/2006:

1. **Echipamente → Adaugă echipament**
2. **Completează detalii**:
   - Denumire (ex: "Cască protecție")
   - Categorie (protecție cap, mâini, ochi, etc.)
   - Normă de dotare (ex: 1 bucată/6 luni)
   - Producător și model
   - Număr serie / lot

3. **Certificări** - Încarcă certificatul de conformitate
4. **Cantitate stoc** - Câte bucăți ai disponibile
5. **Salvează** - Echipamentul devine disponibil pentru atribuire

**Important**: Fiecare EIP trebuie să aibă certificat de conformitate CE!`,
  },
  {
    id: 'ech-2',
    category: 'echipamente',
    title: 'Cum atribui EIP angajaților?',
    content: `# Atribuire echipamente angajați

După definirea EIP-urilor:

1. **Echipamente → Atribuiri**
2. **Click "Atribuire nouă"**
3. **Selectează angajat** - Individual sau pe departament
4. **Selectează echipament** - Din lista ta
5. **Cantitate** - Conform normei de dotare
6. **Data atribuirii** - Implicit astăzi
7. **Data expirării** - Calculată automat din normă

Angajatul primește notificare și poate semna electronic procesul de predare-primire.

## Se generează automat:

- Proces verbal predare-primire EIP
- Alertă la expirare
- Fișa de evidență EIP`,
  },
  {
    id: 'ech-3',
    category: 'echipamente',
    title: 'Cum urmăresc echipamentele ISCIR?',
    content: `# Gestionare echipamente ISCIR

Pentru echipamente sub control ISCIR (lifturi, centrale termice, etc.):

1. **Echipamente → ISCIR**
2. **Adaugă echipament**:
   - Tip (lift, cazane, aparate presiune, etc.)
   - Număr inventar
   - Număr de fabricație
   - An fabricație
   - Producător

3. **Verificări periodice**:
   - Încarcă buletinul ISCIR
   - Data verificării
   - Data următoarei verificări
   - Status (admis/respins)

## Alerte automate:

- 📧 **Cu 60 zile înainte** - Reminder verificare
- 📧 **Cu 30 zile înainte** - Alertă urgentă
- 📧 **La expirare** - Notificare critică

**Important**: Echipamentele cu buletine expirate NU pot funcționa legal!`,
  },
  {
    id: 'ech-4',
    category: 'echipamente',
    title: 'Cum programez inspecții tehnice?',
    content: `# Inspecții tehnice periodice

Pentru echipamentele de lucru (mașini, unelte electrice):

1. **Echipamente → Inspecții**
2. **Selectează echipamentul**
3. **Programare inspecție**:
   - Tip (inițială, periodică, după reparație)
   - Data planificată
   - Inspector (intern sau extern)
   - Check-list specific echipamentului

4. **Efectuare inspecție** - Completează check-list-ul
5. **Rezultat**:
   - ✅ Admis funcționare
   - ⚠️ Admis cu observații
   - ❌ Interzis utilizare

6. **Generează fișă inspecție** - PDF pentru arhivă

Echipamentele respinse sunt automat blocate pentru atribuire până la remediere.`,
  },
  {
    id: 'ech-5',
    category: 'echipamente',
    title: 'Cum export evidența EIP?',
    content: `# Export evidență echipamente

Pentru raportare și control ITM:

1. **Echipamente → Rapoarte**
2. **Selectează raport**:
   - **Registru EIP** - Toate EIP-urile și stocul
   - **Fișă angajat** - EIP atribuite unui angajat
   - **PV predare-primire** - Procesele verbale
   - **EIP expirante** - Ce trebuie înlocuit

3. **Filtrează**:
   - Pe departament
   - Pe categorie echipament
   - Pe perioadă

4. **Export** - PDF, Excel sau print direct

**Consiliu**: Exportă lunar raportul EIP expirante pentru a planifica achizițiile.`,
  },

  // Documente
  {
    id: 'doc-1',
    category: 'documente',
    title: 'Ce documente generează automat platforma?',
    content: `# Documente generate automat

Platforma generează toate documentele SSM obligatorii:

## Documente angajați:

- ✅ Fișă de aptitudini
- ✅ Fișă individuală de protecție
- ✅ Proces verbal instruire SSM/PSI
- ✅ Proces verbal predare-primire EIP
- ✅ Certificat instruire

## Documente organizație:

- ✅ Planul de prevenire și protecție (PPP)
- ✅ Registru de instruire
- ✅ Registru medical
- ✅ Registru EIP
- ✅ Registru control ISCIR
- ✅ Rapoarte pentru ITM/ISU

Toate documentele includ automat logo-ul companiei și sunt conforme cu legislația.`,
  },
  {
    id: 'doc-2',
    category: 'documente',
    title: 'Cum încărc documente externe?',
    content: `# Încărcare documente externe

Pentru documente create manual sau primite de la terți:

1. **Documente → Încărcare document**
2. **Selectează tipul**:
   - Contracte (externalizare SSM, medicina muncii)
   - Autorizații (PSI, ISCIR, mediu)
   - Evaluări de risc
   - Rapoarte de audit
   - Procese verbale
   - Altele

3. **Încarcă fișier** - PDF, Word, Excel, imagini (max 10MB)
4. **Asociază la** - Organizație, angajat, departament sau echipament
5. **Setează expirare** (opțional) - Pentru documente cu valabilitate
6. **Adaugă etichete** - Pentru căutare ușoară

Documentele cu expirare generează alerte automate.`,
  },
  {
    id: 'doc-3',
    category: 'documente',
    title: 'Cum organizez biblioteca de documente?',
    content: `# Organizare documente

Sistemul de foldere și etichete pentru organizare eficientă:

## Structură automată:

- 📁 **Pe angajat** - Toate documentele unui angajat
- 📁 **Pe departament** - Documente departamentale
- 📁 **Pe echipament** - Certificate, buletine
- 📁 **Pe tip** - Instruiri, medical, EIP, etc.

## Etichete personalizate:

Creează etichete proprii:
- "Audit 2026", "ITM", "Urgent", "Arhivă", etc.

## Căutare avansată:

- Pe nume document
- Pe tip
- Pe etichetă
- Pe perioadă încărcare
- Pe status (activ/expirat)

**Consiliu**: Folosește etichete pentru pregătirea rapidă a documentelor la control ITM.`,
  },
  {
    id: 'doc-4',
    category: 'documente',
    title: 'Cum pregatesc dosarul pentru controlul ITM?',
    content: `# Pregătire control ITM

În caz de control ITM, pregătește rapid documentația:

1. **Documente → Pachet ITM**
2. **Selectează perioada** - Ultimul an sau custom
3. **Sistemul pregătește automat**:
   - ✅ Planul de prevenire și protecție
   - ✅ Registrul de instruire
   - ✅ Registrul medical
   - ✅ Evidență EIP
   - ✅ Contracte externalizare (dacă e cazul)
   - ✅ Evaluări de risc
   - ✅ Procese verbale CA SSM

4. **Generează arhivă ZIP** - Toate documentele într-un singur fișier
5. **Sau printează** - Versiune fizică pentru dosar

**Consiliu**: Generează pachetul ITM lunar și păstrează-l actualizat pentru a fi pregătit oricând.`,
  },
  {
    id: 'doc-5',
    category: 'documente',
    title: 'Cum setez semnături electronice?',
    content: `# Semnături electronice

Reduce hârtia cu semnături digitale:

## Configurare:

1. **Setări → Semnături electronice**
2. **Activează funcția** - Disponibilă în planul Premium
3. **Încarcă semnături**:
   - Semnătură reprezentant legal
   - Semnătură consultant SSM
   - Ștampilă firmă (PNG transparent)

## Utilizare:

- Documentele generate includ automat semnăturile
- Angajații pot semna online (pe telefon/tabletă)
- Se păstrează audit trail complet

## Valabilitate juridică:

Semnăturile electronice simple sunt valabile conform Regulamentului eIDAS pentru:
- Documente interne
- Procese verbale
- Fișe individuale

**Important**: Pentru documente oficiale către autorități, verifică acceptarea semnăturii electronice.`,
  },

  // Rapoarte
  {
    id: 'rap-1',
    category: 'rapoarte',
    title: 'Ce rapoarte pot genera?',
    content: `# Tipuri de rapoarte

Platforma oferă rapoarte complete pentru management și autorități:

## Rapoarte SSM:

- 📊 **Dashboard general** - Status complet organizație
- 📊 **Raport instruiri** - Toate instruirile și status-ul lor
- 📊 **Raport medical** - Examinări și avize medicale
- 📊 **Raport EIP** - Echipamente atribuite și stoc
- 📊 **Raport incidente** - Evenimente și măsuri

## Rapoarte conformitate:

- ✅ **Scor conformitate** - % conformitate cu legislația
- ✅ **Alerte active** - Ce necesită atenție
- ✅ **Trend historic** - Evoluție în timp

## Export:

- PDF (prezentare/arhivă)
- Excel (analiză)
- Powerpoint (prezentări board)

Toate rapoartele pot fi programate să fie trimise automat lunar.`,
  },
  {
    id: 'rap-2',
    category: 'rapoarte',
    title: 'Cum analizez costurile cu SSM?',
    content: `# Raport costuri SSM

Urmărește investiția în sănătate și securitate:

1. **Rapoarte → Costuri SSM**
2. **Vezi breakdown detaliat**:
   - 💰 Instruiri (interne/externe)
   - 💰 Examinări medicale
   - 💰 EIP (achiziție + mentenanță)
   - 💰 Consultanță externalizată
   - 💰 Verificări periodice (ISCIR)
   - 💰 Amenzi și penalități (dacă există)

3. **Analiză**:
   - Cost per angajat
   - Cost per departament
   - Trend anual
   - Comparație cu buget

4. **Export** - Pentru raportare CFO/management

**Insight**: Costul prevenirii este mult mai mic decât costul accidentelor și amenzilor!`,
  },
  {
    id: 'rap-3',
    category: 'rapoarte',
    title: 'Cum urmăresc indicatorii de performanță?',
    content: `# KPI-uri SSM

Măsoară eficiența programului de SSM:

## Indicatori principali:

- 📈 **Rata de conformitate** - % angajați cu toate la zi
- 📈 **Rata instruirilor la timp** - % instruiri făcute înainte de expirare
- 📈 **Rata de participare** - % prezență la instruiri
- 📈 **Frecvența incidentelor** - Număr incidente/1000 angajați
- 📈 **Zile pierdute** - Zile pierdute din cauza accidentelor
- 📈 **Timp mediu răspuns** - La alerte și notificări

## Vizualizare:

- Dashboard interactiv
- Grafice trend
- Comparație lună vs. lună
- Benchmark (dacă disponibil)

**Consiliu**: Prezintă KPI-urile lunar în ședința CA SSM pentru îmbunătățire continuă.`,
  },
  {
    id: 'rap-4',
    category: 'rapoarte',
    title: 'Cum programez rapoarte automate?',
    content: `# Rapoarte programate

Primește rapoarte automat, fără să le ceri manual:

1. **Rapoarte → Programare automată**
2. **Creează programare nouă**:
   - Tip raport (SSM, medical, EIP, etc.)
   - Frecvență (zilnic, săptămânal, lunar)
   - Zi și oră (ex: Luni dimineața, 9:00)
   - Format (PDF, Excel)

3. **Destinatari**:
   - Adaugă email-urile
   - Management, consultanți, HR, etc.

4. **Salvează** - Rapoartele vor fi trimise automat

## Exemple utile:

- 📧 Luni dimineața: Raport alerte active
- 📧 Prima zi a lunii: Raport instruiri expirante
- 📧 Ultima zi a lunii: Raport KPI-uri SSM

**Planul Professional+** permite până la 10 programări automate.`,
  },
  {
    id: 'rap-5',
    category: 'rapoarte',
    title: 'Cum export date pentru analiza externă?',
    content: `# Export date brute

Pentru analiză avansată în Excel/Power BI:

1. **Rapoarte → Export date**
2. **Selectează entități**:
   - ☑️ Angajați
   - ☑️ Instruiri
   - ☑️ Medical
   - ☑️ Echipamente
   - ☑️ Incidente
   - ☑️ Alerte

3. **Selectează perioada** - Ultimul an sau tot istoricul
4. **Format**:
   - **CSV** - Universal, pentru orice tool
   - **Excel** - Cu foi separate per entitate
   - **JSON** - Pentru dezvoltatori

5. **Descarcă** - Fișier ZIP cu toate datele

**Confidențialitate**: Datele sunt exportate criptate și trebuie să ai rol Administrator.

**Consiliu**: Ideal pentru analiza în Power BI sau Google Data Studio.`,
  },

  // Setări
  {
    id: 'set-1',
    category: 'setari',
    title: 'Cum personalizez notificările?',
    content: `# Configurare notificări

Controlează ce alerte primești și cum:

1. **Setări → Notificări**
2. **Canale de notificare**:
   - ✉️ Email
   - 📱 SMS (planul Premium)
   - 🔔 Notificări în platformă
   - 💬 Slack/Teams integration (Enterprise)

3. **Tipuri de alerte**:
   - Instruiri expirante (30/60 zile înainte)
   - Examinări medicale expirante
   - EIP de înlocuit
   - Verificări ISCIR
   - Incidente raportate
   - Activitate contul tău

4. **Frecvență rezumate**:
   - Zilnic (9:00 AM)
   - Săptămânal (Luni)
   - Lunar (prima zi)

**Consiliu**: Activează notificări SMS pentru alertele critice ca să nu ratezi nimic important!`,
  },
  {
    id: 'set-2',
    category: 'setari',
    title: 'Cum gestionez utilizatorii și permisiunile?',
    content: `# Gestionare utilizatori

Controlează cine are acces și la ce:

## Roluri disponibile:

### Administrator organizație
- ✅ Acces complet
- ✅ Adaugă/șterge utilizatori
- ✅ Modifică setări organizație
- ✅ Export date sensibile

### Consultant SSM
- ✅ Gestionează toate modulele SSM
- ✅ Creează rapoarte
- ✅ Programează instruiri/medical
- ⛔ Nu poate modifica setări organizație

### Manager departament
- ✅ Vezi doar departamentul lui
- ✅ Rapoarte pentru echipa lui
- ⛔ Nu poate modifica date

### Angajat
- ✅ Vezi propriile date
- ✅ Semnează documente
- ⛔ Nu poate vedea alți angajați

## Adăugare utilizator:

**Setări → Utilizatori → Invită** - Email + rol`,
  },
  {
    id: 'set-3',
    category: 'setari',
    title: 'Cum integrez cu alte platforme?',
    content: `# Integrări disponibile

Conectează platforma SSM cu alte sisteme:

## Integrări HR:

- 👥 **Import angajați** - CSV/Excel automat
- 👥 **Sincronizare** - API pentru sisteme HR
- 👥 **Webhook-uri** - Notificări în timp real

## Integrări comunicare:

- 📧 **Email** - SMTP custom pentru brandul tău
- 💬 **Slack** - Alerte în canale Slack
- 💬 **Microsoft Teams** - Notificări în Teams

## Integrări financiare:

- 💳 **Facturare** - Export pentru contabilitate
- 💳 **Stripe** - Pentru plăți online (planuri)

## API developer:

- 🔧 **REST API** - Documentație completă
- 🔧 **Webhooks** - Evenimente în timp real
- 🔧 **Rate limits** - Conform planului

**Planul Enterprise** include suport dedicat pentru integrări custom.`,
  },
  {
    id: 'set-4',
    category: 'setari',
    title: 'Cum configurez backup și securitate?',
    content: `# Backup și securitate

Datele tale sunt în siguranță:

## Backup automat:

- ✅ **Zilnic** - Backup complet
- ✅ **Retenție** - 30 zile istoric
- ✅ **Redundanță** - Multiple locații geografice
- ✅ **Criptare** - AES-256

## Restaurare date:

1. **Setări → Backup & Restore**
2. **Vezi istoricul** - Toate backup-urile disponibile
3. **Selectează data** - Din ultimele 30 zile
4. **Restaurează** - Confirmare necesară

⚠️ **Atenție**: Restaurarea suprascrie datele curente!

## Securitate:

- 🔒 **2FA** - Autentificare cu doi factori (recomandat!)
- 🔒 **SSO** - Single Sign-On pentru Enterprise
- 🔒 **IP whitelist** - Restricționează accesul
- 🔒 **Audit log** - Toate acțiunile înregistrate

**Important**: Activează 2FA din Setări → Securitate`,
  },
  {
    id: 'set-5',
    category: 'setari',
    title: 'Cum personalizez brand-ul organizației?',
    content: `# Personalizare brand

Fă platforma să arate ca a ta:

1. **Setări → Brand**
2. **Logo organizație**:
   - Încarcă logo (PNG/SVG, max 2MB)
   - Apare pe documente și rapoarte
   - Dimensiune recomandată: 300x100px

3. **Culori principale**:
   - Culoare primară (butoane, accent)
   - Culoare secundară
   - Preview în timp real

4. **Email-uri**:
   - Footer personalizat
   - Domeniu custom (ex: notificari@firma-ta.ro)
   - Șablon email cu brandul tău

5. **Documente**:
   - Antet personalizat
   - Footer (adresă, telefon, email, web)

Toate documentele generate vor include automat brandul tău.

**Planul Business+** include domeniu email custom pentru notificări.`,
  },
];

export default function HelpCenterClient() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'normal' as 'low' | 'normal' | 'high',
  });

  // Search functionality
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles;

    const query = searchQuery.toLowerCase();
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) || article.content.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Get articles for selected category
  const categoryArticles = selectedCategory
    ? articles.filter((a) => a.category === selectedCategory)
    : [];

  // Render markdown-style content
  const renderContent = (content: string) => {
    return content.split('\n').map((line, idx) => {
      if (line.startsWith('# ')) {
        return (
          <h1 key={idx} className="text-2xl font-bold mt-4 mb-2">
            {line.replace('# ', '')}
          </h1>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-xl font-semibold mt-3 mb-2">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-lg font-semibold mt-2 mb-1">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.match(/^- \*\*/)) {
        const text = line.replace(/^- \*\*/, '').replace(/\*\*/, '');
        const [title, ...rest] = text.split(' - ');
        return (
          <li key={idx} className="ml-4 mb-1">
            <strong>{title}</strong>
            {rest.length > 0 && ` - ${rest.join(' - ')}`}
          </li>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <li key={idx} className="ml-4 mb-1">
            {line.replace('- ', '')}
          </li>
        );
      }
      if (line.match(/^\d+\./)) {
        return (
          <li key={idx} className="ml-4 mb-1 list-decimal">
            {line.replace(/^\d+\.\s*/, '')}
          </li>
        );
      }
      if (line.startsWith('**')) {
        return (
          <p key={idx} className="mb-2">
            <strong>{line.replace(/\*\*/g, '')}</strong>
          </p>
        );
      }
      if (line.trim() === '') {
        return <br key={idx} />;
      }
      return (
        <p key={idx} className="mb-2">
          {line}
        </p>
      );
    });
  };

  // Handle contact form submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send to an API
    alert('Mesajul tău a fost trimis! Echipa noastră va răspunde în curând.');
    setShowContactForm(false);
    setContactForm({ subject: '', message: '', priority: 'normal' });
  };

  // Main view - categories
  if (!selectedCategory && !selectedArticle && searchQuery === '') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">Centru de ajutor</h1>
            <p className="mb-6 text-lg text-gray-600">
              Găsește răspunsuri rapid la întrebările tale despre platforma SSM
            </p>

            {/* Search bar */}
            <div className="mx-auto max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Caută în articole..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-gray-900 shadow-sm transition-shadow focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Categories grid */}
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon;
              const count = articles.filter((a) => a.category === category.id).length;

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition-all hover:border-blue-500 hover:shadow-md"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-blue-50 p-3 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">{count} articole</p>
                </button>
              );
            })}
          </div>

          {/* Contact support */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-8 text-center">
            <Mail className="mx-auto mb-4 h-12 w-12 text-blue-600" />
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Nu găsești ce cauți?</h2>
            <p className="mb-4 text-gray-600">Echipa noastră de suport este aici să te ajute</p>
            <button
              onClick={() => setShowContactForm(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              <Mail className="h-5 w-5" />
              Contactează suportul
            </button>
          </div>
        </div>

        {/* Contact form modal */}
        {showContactForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Contactează suportul</h2>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Subiect</label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Scurt rezumat al problemei..."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Prioritate</label>
                  <select
                    value={contactForm.priority}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        priority: e.target.value as 'low' | 'normal' | 'high',
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Scăzută - Întrebare generală</option>
                    <option value="normal">Normală - Am nevoie de ajutor</option>
                    <option value="high">Ridicată - Problemă urgentă</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Mesaj</label>
                  <textarea
                    required
                    rows={6}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descrie problema sau întrebarea ta în detaliu..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="flex-1 rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Anulează
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                  >
                    Trimite mesaj
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Search results view
  if (searchQuery) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-4xl">
          {/* Search header */}
          <div className="mb-6">
            <button
              onClick={() => setSearchQuery('')}
              className="mb-4 text-blue-600 hover:text-blue-700"
            >
              ← Înapoi la categorii
            </button>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Caută în articole..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          </div>

          {/* Search results */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              {filteredArticles.length} rezultate găsite
            </h2>
            <div className="space-y-4">
              {filteredArticles.map((article) => {
                const category = categories.find((c) => c.id === article.category);
                return (
                  <button
                    key={article.id}
                    onClick={() => {
                      setSelectedArticle(article);
                      setSearchQuery('');
                    }}
                    className="w-full rounded-xl border border-gray-200 p-4 text-left transition-all hover:border-blue-500 hover:shadow-md"
                  >
                    <div className="mb-2 text-sm text-blue-600">{category?.name}</div>
                    <h3 className="mb-1 font-semibold text-gray-900">{article.title}</h3>
                    <p className="line-clamp-2 text-sm text-gray-600">
                      {article.content.substring(0, 150)}...
                    </p>
                  </button>
                );
              })}
              {filteredArticles.length === 0 && (
                <p className="py-8 text-center text-gray-500">
                  Nu am găsit niciun articol care să corespundă căutării tale.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Category articles view
  if (selectedCategory && !selectedArticle) {
    const category = categories.find((c) => c.id === selectedCategory);
    const Icon = category?.icon || BookOpen;

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-4xl">
          {/* Category header */}
          <button
            onClick={() => setSelectedCategory(null)}
            className="mb-4 text-blue-600 hover:text-blue-700"
          >
            ← Înapoi la categorii
          </button>

          <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm">
            <div className="mb-4 inline-flex rounded-xl bg-blue-50 p-4 text-blue-600">
              <Icon className="h-8 w-8" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">{category?.name}</h1>
            <p className="text-gray-600">{categoryArticles.length} articole în această categorie</p>
          </div>

          {/* Video placeholder */}
          <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <Video className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Video tutorial</h2>
            </div>
            <div className="flex aspect-video items-center justify-center rounded-xl bg-gray-100">
              <div className="text-center">
                <Video className="mx-auto mb-2 h-16 w-16 text-gray-400" />
                <p className="text-gray-500">Video tutorial disponibil în curând</p>
              </div>
            </div>
          </div>

          {/* Articles list */}
          <div className="space-y-4">
            {categoryArticles.map((article) => (
              <button
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="w-full rounded-2xl border border-gray-200 bg-white p-6 text-left transition-all hover:border-blue-500 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">{article.title}</h3>
                  <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-400" />
                </div>
                <p className="line-clamp-2 text-sm text-gray-600">
                  {article.content.substring(0, 200)}...
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Article detail view
  if (selectedArticle) {
    const category = categories.find((c) => c.id === selectedArticle.category);

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-4xl">
          {/* Article header */}
          <button
            onClick={() => {
              setSelectedArticle(null);
              setSelectedCategory(selectedArticle.category);
            }}
            className="mb-4 text-blue-600 hover:text-blue-700"
          >
            ← Înapoi la {category?.name}
          </button>

          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="mb-4 text-sm text-blue-600">{category?.name}</div>
            <h1 className="mb-6 text-3xl font-bold text-gray-900">{selectedArticle.title}</h1>

            {/* Article content */}
            <div className="prose prose-blue max-w-none text-gray-700">
              {renderContent(selectedArticle.content)}
            </div>

            {/* Help footer */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <p className="mb-4 text-sm text-gray-600">A fost util acest articol?</p>
              <div className="flex gap-3">
                <button className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                  👍 Da
                </button>
                <button className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                  👎 Nu
                </button>
              </div>
            </div>
          </div>

          {/* Related articles */}
          <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Articole similare</h2>
            <div className="space-y-3">
              {articles
                .filter(
                  (a) => a.category === selectedArticle.category && a.id !== selectedArticle.id
                )
                .slice(0, 3)
                .map((article) => (
                  <button
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className="flex w-full items-center justify-between rounded-xl border border-gray-200 p-4 text-left transition-all hover:border-blue-500"
                  >
                    <span className="font-medium text-gray-900">{article.title}</span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
