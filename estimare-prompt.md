# TASK: Refă complet pagina /onboarding → /estimare

## CONTEXT
Pagina actuală de onboarding cere date personale (nume firmă, adresă, CNP angajați) — GREȘIT. Nimeni nu dă date personale pentru o simplă estimare de preț. Refă COMPLET cu filozofia de mai jos.

## FILOZOFIE
- ZERO date personale, ZERO login, ZERO salvare în bază de date
- Pagina e PUBLICĂ — oricine intră pe s-s-m.ro/estimare vede instant ce servicii îi trebuie și cât costă
- Totul se calculează client-side, nu trimite nimic la Supabase
- Scopul: vizitatorul înțelege în 60 secunde ce riscă și cât costă prevenția
- Nimeni nu completează câmpuri care nu-i aduc valoare imediată
- Niciun câmp nu e obligatoriu decât activitatea

## CE CONSTRUIEȘTI — Pagina /estimare (înlocuiește /onboarding)

### Pas 1: "Ce activitate ai?" (SINGURA ÎNTREBARE OBLIGATORIE)
- Input autocomplete cu search
- User scrie primele litere → apar sugestii din lista de activități comune în LIMBAJ UMAN
- Exemplu: scriu "cof" → apare "Cofetărie / Patiserie", "Coffee shop / Cafenea"
- Scriu "con" → "Construcții civile", "Consultanță management", "Contabilitate"
- Scriu "friz" → "Frizerie / Coafor / Salon beauty"
- Codul CAEN apare DISCRET în paranteză lângă selecție, dar userul NU trebuie să-l știe sau selecteze
- AI deduce CAEN-ul din ce scrie userul
- Include SINONIME/CUVINTE CHEIE pentru meserii care în limbaj uzual au altă denumire:
  - "mecanic auto" = "Întreținere și reparare autovehicule" (CAEN 4520)
  - "croitor" = "Fabricare articole de îmbrăcăminte" (CAEN 1413)
  - "zugrav" = "Lucrări de finisare" (CAEN 4334)
  - "instalator" = "Lucrări de instalații sanitare, de încălzire" (CAEN 4322)
  - "electrician" = "Lucrări de instalații electrice" (CAEN 4321)
  - "grădinar" = "Activități de întreținere peisagistică" (CAEN 8130)
  - "babysitter/bonă" = "Activități de asistență socială" (CAEN 8891)
  - "taximetrist/uber" = "Transporturi cu taxiuri" (CAEN 4932)
  - etc. — INCLUDE CÂT MAI MULTE sinonime populare
- Dacă nu găsește → câmp liber "Descrie ce faci" (text) → AI deduce
- INCLUDE ÎN JSON TOATE CODURILE CAEN Rev.3 (din 2025) — lista completă, nu doar 50

### Pas 2: "Câți angajați ai?" (OPȚIONAL — default: va fi presetat pe baza formei de organizare)
- Selector: **0** | 1-5 | 6-10 | 11-20 | 21-50 | 50+
- **0 = fără angajați** — pentru PFA/SRL cu asociat unic care lucrează doar pe dividende
- Dacă alege 0 → estimarea se ajustează: nu mai apare medicina muncii angajați, nu mai apar instruiri periodice multiple, dar RĂMÂN obligațiile proprii (SSM propriu, PSI, stingătoare, etc.)

### Pas 2.5: "Ai PFA, SRL sau altceva?" (COMPLET OPȚIONAL — default: SRL)
- Apare DISCRET, mic, sub selectorul de angajați — NU evidențiat, NU obligatoriu
- SRL vine PRESELECTAT. Dacă userul nu atinge nimic → merge cu SRL automat
- Dropdown sau chips MIC. Userul poate schimba DOAR dacă vrea
- Opțiuni (toate formele legale din România):
  - **SRL** — Societate cu Răspundere Limitată (DEFAULT)
  - **SRL-D** — SRL Debutant
  - **SA** — Societate pe Acțiuni
  - **SNC** — Societate în Nume Colectiv
  - **SCS** — Societate în Comandită Simplă
  - **SCA** — Societate în Comandită pe Acțiuni
  - **PFA** — Persoană Fizică Autorizată (max 3 angajați)
  - **II** — Întreprindere Individuală (max 8 angajați)
  - **IF** — Întreprindere Familială (fără angajați terți)
  - **ONG/Asociație** — Organizație Non-Guvernamentală
  - **Fundație**
  - **Cooperativă**
  - **CMI** — Cabinet Medical Individual
  - **Cabinet avocat**
  - **Birou Notar**
  - **BIF** — Birou Individual Farmacist
  - **RA** — Regie Autonomă
  - **Instituție publică**
- Dacă alege PFA → slider-ul de angajați se limitează automat la max 3 (restricție legală, PFA nu poate avea mai mult). Afișează mesaj scurt explicativ: "PFA: maxim 3 angajați conform legii"
- Dacă alege II → slider-ul se limitează la max 8, cu mesaj: "II: maxim 8 angajați"
- Dacă alege IF → angajați = 0 automat + mesaj: "IF: doar membri familie, fără salariați terți"
- Acestea sunt restricții AUTOMATE invizibile — userul nu trebuie să știe de ele decât dacă încalcă limita
- Afectează estimarea (ex: PFA fără angajați are alte obligații decât SRL cu 50 angajați)

### Pas 3: "Ce posturi/funcții ai?" (OPȚIONAL — pentru estimare mai precisă)
- Chips/tags selectabile din listă predefinită bazată pe ACTIVITATEA aleasă la Pas 1 (NU pe codul CAEN — userul nu a ales CAEN, AI l-a dedus)
- Exemplu pt "construcții": muncitor necalificat, zidar, sudor, macaragiu, electrician, fierar betonist, instalator, șef șantier, inginer
- Exemplu pt "restaurant": bucătar, ajutor bucătar, ospătar, barman, casier, manager
- Include meserii din COR (Clasificarea Ocupațiilor din România) relevante pentru activitate
- Include SINONIME populare (ex: "ospătar" = "chelner", "patiser" = "cofetar")
- Poate adăuga manual: câmp text "Altă funcție"
- **ZERO NUME ANGAJAȚI, ZERO CNP, ZERO DATE PERSONALE**

### Pas 4: REZULTAT — Estimare completă (afișare INSTANT, fără buton submit)
Afișează automat pe măsură ce completează:

**A) Servicii OBLIGATORII pentru activitatea ta:**
- Lista generată automat din tipul de activitate: evaluare riscuri, plan prevenire, instruiri SSM, instruiri PSI, medicina muncii, stingătoare, PRAM, etc.
- Fiecare cu: estimare cost + amendă dacă lipsește + referință lege
- Checkbox-uri bifate default — userul poate DEBIFA ce consideră că are deja
- Dacă debifează (ex: "am deja stingătoarele verificate") → scade din cost, rămâne riscul afișat dar marcat "acoperit"

**B) Totaluri live (bară fixă jos):**
- Cost prevenție: X.XXX — X.XXX RON/an
- Risc amenzi: XX.XXX — XX.XXX RON
- Raport: "Amenzile costă Nx mai mult decât prevenția"
- Mesaj: "Noi ne ocupăm de tot. Tu ai liniște."

**C) CTA (Call to Action) — OPȚIONAL, discret, la final:**
- Buton WhatsApp: **"Scrie-ne acum!"** (NU "Contactează-ne", NU "Sună", NU "Discută cu consultantul")
- "Primește oferta ta" → generează link temporar unic: **s-s-m.ro/oferta/[id-unic]**
  - Mesaj pe pagina ofertei DOAR PENTRU CINE LASĂ CUI: **"Oferta ta — EXACT ce ai nevoie. Personalizată și pliată STRICT pe obligațiile tale. Nimic în plus, nimic în minus."**
  - Acest mesaj este un REWARD — apare DOAR când userul completează CUI. Fără CUI, userul primește estimarea generică (care e tot bună, dar generală). Cu CUI → simte diferența, simte avantajul, simte că a primit ceva personalizat pentru că a avut încredere
  - Cu CUI: datele firmei se auto-completează de la ANAF (denumire, adresă, CAEN real) → estimarea se recalculează pe baza CAEN-ului real al firmei, nu pe ce a scris generic
  - Link-ul stochează estimarea curentă (parametri în URL sau localStorage)
  - Poate fi trimis pe WhatsApp/email clientului
  - Are expirare (7 zile)
  - NU necesită email obligatoriu
  - Opțional: câmp email dacă vrea să primească link-ul și pe email
- **CUI = OPȚIONAL** — câmp separat la final: "Vrei oferta exactă pe firma ta?" Dacă completează CUI → auto-populate date firmă cu API ANAF. E valoros pentru lead generation dar NICIODATĂ obligatoriu
- **Telefon/WhatsApp = OPȚIONAL** — cu text: "Te contactăm doar când vrei tu"
- **Email = OPȚIONAL** — pentru trimitere link ofertă
- Toate 3 câmpurile apar DOAR la final, DUPĂ ce userul a văzut deja estimarea completă. Nu blochează nimic.

## CERINȚE TEHNICE
- Route: `/estimare` (șterge sau redirectează `/onboarding` → `/estimare`)
- ZERO Supabase calls pentru estimare — totul client-side
- SINGURA excepție Supabase: salvare link temporar ofertă (dacă implementezi)
- ZERO login required — pagină publică
- Responsive mobile-first
- Date CAEN + obligații + sinonime + COR funcții hardcoded în JSON local
- Design: dark theme consistent cu restul s-s-m.ro (Navy #0B1120 + accente)
- Rezultatul se actualizează LIVE pe măsură ce userul completează (nu la final)

## STRUCTURĂ FIȘIERE
```
src/data/caen-activities.json      — TOATE codurile CAEN Rev.3 cu sinonime limbaj uman
src/data/job-roles-by-activity.json — funcții COR mapate pe tipuri de activitate + sinonime
src/data/org-types.json            — forme de organizare cu restricții (max angajați etc.)
src/data/obligations-matrix.json   — obligații SSM/PSI/Med.Muncii per tip activitate + form org
app/estimare/page.tsx              — pagina principală
components/ActivitySearch.tsx      — autocomplete activitate cu AI deducere + sinonime
components/EmployeeCount.tsx       — selector nr angajați (include opțiunea 0)
components/OrgTypeSelector.tsx     — forma de organizare (default SRL)
components/RoleSelector.tsx        — chips funcții bazate pe activitate (nu CAEN)
components/EstimateResult.tsx      — rezultat live cu calcule + toggle amenzi + bifare
components/OfferLink.tsx           — generator link temporar ofertă
```

## CE NU FACE
- NU salvează date personale
- NU cere login/autentificare
- NU cere nume, CNP, adresă, telefon
- NU are "Contactează-ne" sau "Sună-ne"
- NU blochează rezultatul în spatele unui formular
- NU forțează completarea tuturor câmpurilor — doar activitatea e nevoie

## AMENZI — FOLOSEȘTE ACESTE VALORI (din legislație actualizată)
### SSM (Legea 319/2006, Art.39):
- Evaluare riscuri lipsă: 4.000-8.000 RON
- Plan prevenire lipsă: 5.000-10.000 RON
- Autorizare SSM lipsă: 5.000-10.000 RON  
- Instruire SSM lipsă: 4.000-8.000 RON
- Fișe post fără atribuții SSM: 4.000-8.000 RON
- Instrucțiuni proprii lipsă: 4.000-8.000 RON
- EIP neacordat: 4.000-8.000 RON
- Necomunicare accidente: 3.500-7.000 RON

### PSI (Legea 307/2006):
- Fără autorizație ISU: 20.000-50.000 RON
- Stingătoare neverificate: 1.000-2.500 RON
- Instruire PSI lipsă: 1.000-2.500 RON
- Plan evacuare lipsă: 1.000-2.500 RON
- Fără cadru tehnic PSI: 1.000-2.500 RON
- PRAM neverificat: 1.000-2.500 RON

### Medicina Muncii (HG 355/2007 + HG 857/2011):
- Fără examen medical angajare: 5.000-10.000 RON
- Fără examen periodic: 5.000-10.000 RON
- Fără truse prim ajutor: 4.000-8.000 RON

## FORME DE ORGANIZARE — RESTRICȚII AUTOMATE
```json
{
  "PFA": { "maxAngajati": 3, "maxCAEN": 5, "personalitateJuridica": false },
  "II": { "maxAngajati": 8, "maxCAEN": 10, "personalitateJuridica": false },
  "IF": { "maxAngajati": 0, "note": "Doar membri familie", "personalitateJuridica": false },
  "SRL": { "maxAngajati": null, "maxCAEN": null, "personalitateJuridica": true },
  "SRL-D": { "maxAngajati": null, "maxCAEN": 5, "personalitateJuridica": true },
  "SA": { "maxAngajati": null, "personalitateJuridica": true, "note": "Min 2 acționari" },
  "ONG": { "maxAngajati": null, "personalitateJuridica": true },
  "CMI": { "maxAngajati": null, "personalitateJuridica": false, "note": "Cabinet Medical" }
}
```

## TONE OF VOICE — MESAJE PE PAGINĂ
- "Noi ne ocupăm de tot. Tu ai liniște."
- "Prevenția costă de Nx mai puțin decât o singură amendă."
- "Zero dosare. Zero griji. Zero surprize la control."
- "Oferta ta — EXACT ce ai nevoie. Personalizată și pliată STRICT pe obligațiile tale. Nimic în plus, nimic în minus." — **DOAR pentru cine lasă CUI** (reward pt încredere)
- Buton WhatsApp: **"Scrie-ne acum!"**
- NU folosi: "Contactați-ne", "Sună-ne", "Discutați cu un consultant", "Completați formularul"

## DIFERENȚIERE ANONIM vs CUI (IMPORTANT!)
- **Fără CUI:** Estimare generică bazată pe activitate + nr. angajați. Utilă, dar generală. Mesaj standard.
- **Cu CUI:** Estimare PERSONALIZATĂ pe firma reală (CAEN real de la ANAF, adresă, denumire). Mesaj special de reward. Userul simte diferența — a primit ceva valoros pentru că a avut încredere să lase CUI-ul. Asta motivează mai mulți să completeze.

## PRIORITATE IMPLEMENTARE
1. ActivitySearch cu autocomplete + sinonime (CORE)
2. EmployeeCount cu opțiunea 0
3. OrgTypeSelector cu default SRL
4. EstimateResult cu calcule live + bifare/debifare
5. RoleSelector (opțional, enhancement)
6. OfferLink cu link temporar (enhancement)
