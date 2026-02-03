# GHID REFERINȚĂ — Terminal, Git, GitHub, Cursor
## Salvează acest fișier. Deschide-l când ai nevoie.
## Data: 4 Februarie 2026

---

## 1. CE ESTE TERMINALUL

Terminalul = o fereastră unde scrii comenzi text în loc să apeși butoane.
E ca un SMS pe care-l trimiți computerului: scrii o comandă, el răspunde.

### Unde îl găsești în Cursor:
- Cursor deschis → meniul de sus → **Terminal** → **New Terminal**
- SAU scurtătura: **Ctrl + `** (tasta de lângă 1, deasupra Tab)
- Apare o fereastră neagră/întunecată în partea de jos a Cursor

### Comenzi de bază (scrii și apeși Enter):
```
ls                    → Arată fișierele din folderul curent
cd nume-folder        → Intră într-un folder
cd ..                 → Iese un nivel mai sus
pwd                   → Arată în ce folder ești acum
cat numefisier.tsx    → Afișează conținutul unui fișier
```

---

## 2. CE ESTE UN REPO (REPOSITORY)

Repo = folder cu tot codul proiectului + istoria tuturor modificărilor.

Gândește-te la el ca la un dosar cu toate versiunile unui document.
- Versiunea 1: am adăugat pagina de login
- Versiunea 2: am schimbat culoarea butonului
- Versiunea 3: am fixat un bug

Git ține minte TOATE versiunile, poți reveni la oricare.

### Unde este repo-ul tău:
- Este folderul **S-S-M-APP** pe care-l vezi în Cursor (stânga)
- Tot ce e în acel folder = repo-ul tău

---

## 3. CE ESTE GIT

Git = programul care urmărește modificările în repo.

### Comenzi Git de bază (în Terminal):
```
git status            → Ce fișiere s-au modificat?
git add .             → Pregătește TOATE modificările pentru salvare
git commit -m "mesaj" → Salvează modificările cu un mesaj descriptiv
git push              → Trimite modificările pe GitHub (cloud)
git pull              → Aduce modificările de pe GitHub pe laptopul tău
git remote -v         → Arată link-ul GitHub al repo-ului
git log --oneline     → Arată istoricul modificărilor
```

### Flux normal de lucru:
```
1. Faci modificări în cod
2. git add .
3. git commit -m "Am adăugat pagina medicina muncii"
4. git push
5. Vercel detectează automat și face deploy
```

---

## 4. CE ESTE GITHUB

GitHub = "Google Drive pentru cod". Repo-ul tău e stocat acolo în cloud.

### Cum găsești link-ul GitHub:
- **Varianta 1:** În Cursor → Terminal → scrie: `git remote -v`
  - Va afișa ceva de genul: `origin https://github.com/NUMELE-TAU/s-s-m-app.git`
  - Ăla e link-ul repo-ului tău

- **Varianta 2:** Deschide https://github.com → login → vezi repo-urile tale în stânga

### Ce face GitHub pentru tine:
- Backup automat al codului (dacă faci git push)
- Vercel citește de aici și face deploy automat
- Poți vedea istoricul tuturor modificărilor

---

## 5. CURSOR — LUCRURI UTILE

### Structura folderelor (stânga = Explorer):
```
S-S-M-APP/
├── app/              ← Paginile aplicației (ce vede userul)
│   ├── dashboard/    ← Pagina principală dashboard
│   ├── layout.tsx    ← Template-ul general (header, sidebar)
│   └── page.tsx      ← Pagina principală (landing/home)
├── lib/              ← Configurare și tipuri
│   ├── supabase.ts   ← Conexiunea la Supabase
│   └── types.ts      ← Tipurile TypeScript (structura datelor)
├── src/components/   ← Componentele reutilizabile
├── .env.local        ← Chei secrete (Supabase URL, API key)
└── package.json      ← Lista librăriilor instalate
```

### Cum deschizi un fișier:
- Click pe el în Explorer (stânga)
- SAU: Ctrl+P → scrie numele fișierului → Enter

### Cum cauți un text în tot proiectul:
- **Ctrl+Shift+F** → scrie textul → vezi toate fișierele care-l conțin
- FOARTE UTIL când trebuie să găsești unde scrie "companies" ca să-l schimbi cu "organizations"

### Cum dai prompt Cursor AI:
- **Ctrl+I** → se deschide chat-ul Cursor AI
- SAU: **Ctrl+L** → Composer (pentru modificări mai mari)
- Scrie ce vrei, ex: "Schimbă toate referințele la companies cu organizations"

---

## 6. SUPABASE — UNDE SUNT LUCRURILE

### Meniul din stânga (icoane):
```
🏠 Table Editor     ← Tabelele tale (vezi datele, adaugi rânduri)
📊 SQL Editor       ← Rulezi comenzi SQL (ce am făcut noi azi)
🔐 Authentication   ← Utilizatorii (login, signup)
📦 Storage          ← Fișiere (PDF-uri, imagini)
⚡ Edge Functions   ← Cod server (nu folosim încă)
📋 Logs             ← Ce s-a întâmplat (erori, query-uri)
⚙️ Settings         ← Configurare proiect
```

### Cum vezi datele dintr-un tabel:
- Table Editor → click pe numele tabelului → vezi rândurile
- Poți filtra, sorta, adăuga manual

### Cum rulezi SQL:
- SQL Editor → New Query (sau +) → paste codul → Run (sau Ctrl+Enter)
- "Success. No rows returned" = OK (pentru INSERT, UPDATE, CREATE)
- Dacă face SELECT, vezi datele în Results

---

## 7. VERCEL — DEPLOY AUTOMAT

Vercel = serverul care rulează aplicația ta pe internet.

### Cum funcționează:
```
Tu faci git push → GitHub primește codul → Vercel detectează → 
Vercel construiește → Site-ul se actualizează automat
```

### Dacă deploy-ul eșuează:
- Du-te pe https://vercel.com → proiectul tău → Deployments
- Click pe ultimul deployment → vezi log-urile de eroare
- Copiază eroarea → paste în chat cu Claude

---

## 8. CUM SĂ ORGANIZEZI SFATURILE

### Creează un folder DOCS în proiect:
```
S-S-M-APP/
├── docs/
│   ├── code-contract.md      ← Reguli de cod (deja planificat)
│   ├── ghid-terminal-git.md  ← ACEST FIȘIER
│   ├── ghid-supabase.md      ← Note despre Supabase
│   └── decizii-proiect.md    ← De ce am ales X în loc de Y
```

### Regulă simplă:
- Învățat ceva nou? → Deschide/creează fișierul potrivit în /docs
- Notează: CE am făcut, CUM, și DE CE
- Data viitoare cauți în /docs înainte de a întreba

### Alternativă rapidă:
- Un singur fișier `docs/JURNAL.md`
- Adaugi la final cu data: "4 Feb 2026: Am învățat cum să..."
- Simplu, cronologic, ușor de căutat cu Ctrl+F

---

## 9. VOCABULAR RAPID

| Termen | Ce înseamnă |
|--------|------------|
| **Repo** | Folderul cu codul + istoria Git |
| **Commit** | O "salvare" cu mesaj descriptiv |
| **Push** | Trimite commit-urile pe GitHub |
| **Pull** | Aduce commit-urile de pe GitHub |
| **Branch** | O "copie" paralelă a codului (pentru experimente) |
| **Deploy** | Publicarea codului pe internet |
| **Terminal** | Fereastra de comenzi text |
| **CLI** | Command Line Interface = Terminal |
| **ENV** | Environment variables = chei secrete (.env.local) |
| **RLS** | Row Level Security = cine vede ce date |
| **FK** | Foreign Key = legătură între tabele |
| **UUID** | ID unic universal (gen: a1b2c3d4-...) |
| **API** | Interfața prin care două programe comunică |
| **PWA** | Progressive Web App = site care arată ca o aplicație |
| **MVP** | Minimum Viable Product = versiunea minimă funcțională |
| **Tier** | Nivel de prioritate (MVP → Tier 2 → Tier 3 → Tier 4) |

---

*Ultima actualizare: 4 Februarie 2026*
*Salvează în: S-S-M-APP/docs/ghid-terminal-git.md*
