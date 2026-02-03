# 🗂️ BACKLOG FEATURES - s-s-m.ro

**Status:** Ideas to validate AFTER first demo calls
**Source:** Gemini suggestions + Daniel's expertise
**Last update:** 26 Ianuarie 2026

---

## 🚨 REGULA DE AUR

**NU construi features ÎNAINTE să validezi need-ul cu clienți reali.**

Procesul corect:
1. Demo cu dashboard actual
2. Întrebi: "Ce lipsește ca să fie perfect pentru voi?"
3. Dacă 3+ clienți cer același lucru → intră în roadmap
4. Altfel → rămâne în backlog

---

## 📋 FEATURES PROPOSED

### 1. ProtocolControl Component (Checklist ITM)

**Source:** Gemini suggestion
**Status:** ❌ REJECTED - Daniel insight

**Motivul respingerii:**
> "Checklist ITM e diferit de la companie la companie, depinde de activitate, riscuri, locație, etc. Nu trebuie să fie vizibil decât la nevoie, punctual, poate o dată la 5 ani e folosit, în rest, nu îi interesează decât pe 3% din clienți."

**Alternative:**
- Dacă UN client corporat mare cere → construim checklist CUSTOM pentru el
- Sau → PDF descărcabil cu "Protocol Generic ITM" (low-tech, no-code)
- Sau → Link către ghid extern (blog post s-s-m.ro)

**Effort dacă se cere:** 30 min
**Trigger validare:** Dacă 3+ clienți Enterprise cer explicit

**Cod salvat (dacă e nevoie):**
```tsx
// components/ProtocolControl.tsx
import { ShieldCheck, CheckCircle2, FileText, PhoneCall } from 'lucide-react';

export default function ProtocolControl() {
  const steps = [
    { title: "Verifică legitimația inspectorului", sub: "Notează nume + instituție." },
    { title: "Prezintă Registrul Unic de Control", sub: "Ține-l la îndemână, fără grabă." },
    { title: "Deschide Arhiva Cloud s-s-m.ro", sub: "Arată documentele cerute, în ordine." },
    { title: "Apelează Expertul (dacă e necesar)", sub: "Pentru clarificări, fără panică." }
  ];

  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
        <div>
          <h2 className="text-slate-900 font-bold text-lg">Protocol Asistență Control</h2>
          <p className="text-slate-500 text-xs">Checklist ITM • pași de buzunar</p>
        </div>
        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> PREGĂTIT
        </div>
      </div>

      <div className="p-5 space-y-4">
        {steps.map((step, idx) => (
          <div key={idx} className="flex gap-4 items-start">
            <div className="bg-slate-900 text-white rounded-full p-1 mt-0.5">
              <CheckCircle2 size={16} />
            </div>
            <div>
              <p className="text-slate-800 font-bold text-sm leading-tight">{step.title}</p>
              <p className="text-slate-500 text-[11px] mt-0.5">{step.sub}</p>
            </div>
          </div>
        ))}
        
        <div className="bg-slate-50 rounded-2xl p-3 text-[11px] text-slate-600 italic text-center border border-slate-100">
          Vibe: ordine, control, siguranță. Urmezi lista.
        </div>
      </div>

      <div className="p-5 bg-white grid grid-cols-2 gap-3 pt-0">
        <button className="flex items-center justify-center gap-2 bg-white text-slate-700 py-3.5 rounded-2xl text-xs font-bold border border-slate-200 shadow-sm">
          <FileText size={16} className="text-slate-400" /> Arhivă Documente
        </button>
        <a href="tel:0700000000" className="flex items-center justify-center gap-2 bg-[#1e293b] text-white py-3.5 rounded-2xl text-xs font-bold shadow-md">
          <PhoneCall size={16} /> APEL EXPERT SSM
        </a>
      </div>
    </section>
  );
}
```

---

### 2. Portal HR - Google Sheets Integration

**Source:** Gemini suggestion + STRATEGIE_EURAMIS.md (pag. 192-197)
**Status:** ⏳ BACKLOG - aștept validare demo calls

**Problema identificată:**
> "HR angajează → Email către SSM → Excel manual → Programare telefon medicina muncii → Reminder manual → Lipsă tracking → ITM inspecție → Panică"

**Soluția propusă:**
1. HR introduce date în Google Sheet shared (Nume, CNP, Funcție, Data angajării)
2. s-s-m.ro detectează automat rând nou (Make.com sau Vercel Cron)
3. Trigger automat:
   - Email pre-completat către Medlife/Sanador pentru medicina muncii
   - Alert către SSM consultant (Daniel)
   - WhatsApp către worker cu link instruire
4. Tracking status: "Programat" → "Efectuat" → "Certificat încărcat"

**Întrebări de validat în demo calls:**
- [ ] Preferă Google Sheets vs email parsing vs webhook API?
- [ ] Cât de des adaugă angajați noi? (zilnic/săptămânal/lunar)
- [ ] Cine introduce datele: HR direct sau SSM consultant?
- [ ] Ce sistem HR folosesc acum? (Excel, SAP, Saga, FluxHR, manual)
- [ ] Ar plăti extra €300-500 pentru integrare custom?

**Effort estimat:**
- Google Sheets API: 2-3 ore
- Email parsing (Brevo): 1-2 ore
- Webhook API custom: 2-4 ore

**Trigger implementare:**
- Dacă 5+ clienți corporate cer → implementăm Google Sheets (80% use case)
- Dacă 2+ clienți Enterprise cer SAP/Saga → implementăm webhook

**Prioritate:** Luna 2-3 (după primii 10 clienți semnați)

---

### 3. Multi-Company Selector (Dashboard)

**Source:** STRATEGIE_EURAMIS.md (pag. 168)
**Status:** ⏳ BACKLOG - implementare Săptămâna 3-4

**Problema:**
Dashboard actual arată doar 1 companie (CMI Multescu hardcodat).
Pentru consultant SSM cu 100 clienți → trebuie să vadă TOATE companiile.

**Soluție:**
Dropdown în header dashboard:
```
[CMI Multescu ▼]
├─ CMI Multescu
├─ Construct Elite SRL
├─ TechSoft Innovation
├─ Restaurant La Bunici
└─ + Adaugă companie
```

Click → dashboard se refreshează cu datele companiei selectate.

**Effort:** 1-2 ore
**Prioritate:** MEDIE-RIDICATĂ (ai 100 clienți!)
**Trigger:** După Vercel deploy + primele 3 demo calls

**Implementare:**
```typescript
// Exemplu cod:
const [selectedCompany, setSelectedCompany] = useState(COMPANY_ID);

useEffect(() => {
  fetchCompanyData(selectedCompany);
}, [selectedCompany]);
```

---

### 4. Export Rapoarte ITM (PDF)

**Source:** STRATEGIE_EURAMIS.md (pag. 176-177)
**Status:** ⏳ BACKLOG - implementare Luna 2

**Problema:**
> "Raportare ITM: 3 zile de panică să strângă hârtii"

**Soluție:**
Click buton "Raport ITM" → generează PDF cu:
- Logo companie + date CUI
- Lista angajați + funcții
- Certificate medicina muncii (scan-uri)
- Certificate instruiri SSM/PSI
- Registru securitate muncii
- Semnături electronice eIDAS (dacă posibil)

**Tehnologie:**
- `react-pdf` sau `puppeteer` (server-side)
- Template PDF customizabil per companie
- Storage în Supabase Storage

**Effort:** 4-6 ore
**Prioritate:** RIDICATĂ (diferențiator major vs Euramis)
**Trigger:** După primii 5 clienți (ca să testezi template-ul real)

---

### 5. Email Notifications (Brevo Integration)

**Source:** STRATEGIE_EURAMIS.md (pag. 179)
**Status:** ⏳ BACKLOG - implementare Luna 2

**Funcționalitate:**
- Alert medicina muncii expirare: 30/15/7 zile
- Alert PSI stingătoare: 30 zile înainte
- Sumar săptămânal către manageri (Luni dimineață)
- Alert ITM inspecție programată

**Tehnologie:**
- Brevo API (ai deja abonament)
- Vercel Cron Jobs (daily check)
- Template emails responsive

**Effort:** 2-3 ore
**Prioritate:** MEDIE-RIDICATĂ
**Trigger:** După primii 10 clienți (volum care justifică automation)

---

### 6. WhatsApp Notifications (Green API)

**Source:** STRATEGIE_EURAMIS.md (pag. 269)
**Status:** ⏳ BACKLOG - implementare Luna 3-4

**Funcționalitate:**
- Worker primește link instruire pe WhatsApp
- Click → video training → quiz → semnătură digitală
- Status delivery: "Trimis" → "Citit" → "Completat"
- Reminder automat dacă nu completează în 7 zile

**Tehnologie:**
- Green API (ai menționat în strategie)
- Alternative: Twilio WhatsApp API, Meta Business API

**Effort:** 4-6 ore (learning curve API + integration)
**Prioritate:** RIDICATĂ pentru corporații (muncitori străini)
**Trigger:** După feedback demo: "Muncitorii noștri nu citesc email-uri"

**Cost:** ~€50-100/lună (în funcție de volum mesaje)

---

### 7. QR Code Equipment Tracking

**Source:** STRATEGIE_EURAMIS.md (pag. 275)
**Status:** ⏳ BACKLOG - implementare Luna 4

**Funcționalitate:**
- Generează QR code pentru fiecare stingător/echipament ISCIR
- Scan → vezi istoric verificări
- Scan → raportează problemă (vandalizat, lipsă, expirat)
- Generează raport PDF instant

**Tehnologie:**
- `qrcode.react` pentru generare
- Camera API pentru scan (PWA)
- Printable labels pentru stingătoare

**Effort:** 3-4 ore
**Prioritate:** MEDIE (nice-to-have, nu deal-breaker)
**Trigger:** Dacă 3+ clienți manufacturingcorporat cer

---

### 8. Waze-Style Risk Reporting

**Source:** STRATEGIE_EURAMIS.md (pag. 281)
**Status:** ⏳ BACKLOG - implementare Luna 5-6

**Funcționalitate:**
- Worker raportează risc pe hartă șantier
- Foto + descriere + GPS location
- Manager vede live dashboard cu pin-uri
- Tracking până la rezolvare
- Statistici: "Top 5 riscuri raportate luna aceasta"

**Tehnologie:**
- Google Maps API sau Mapbox
- Supabase Realtime pentru live updates
- Camera API pentru poze

**Effort:** 6-8 ore (complex feature)
**Prioritate:** SCĂZUTĂ (construcții/șantiere only, niche)
**Trigger:** Dacă ai 5+ clienți construcții care cer explicit

---

### 9. AI Chatbot Legislație SSM

**Source:** STRATEGIE_EURAMIS.md (pag. 284)
**Status:** ⏳ BACKLOG - implementare Anul 2

**Funcționalitate:**
User întreabă: "Ce spune legea despre lucrul la înălțime?"
Bot răspunde instant cu:
- Articol legislativ relevant
- Link Monitorul Oficial
- Interpretare simplificată
- Acțiuni practice

**Tehnologie:**
- Claude API sau GPT-4 (tu ai acces Claude Pro!)
- RAG (Retrieval Augmented Generation) cu bază legislație
- Embed Monitorul Oficial + norme SSM

**Effort:** 10-15 ore (research + implementation)
**Prioritate:** SCĂZUTĂ (nice-to-have, nu critical)
**Trigger:** După €50.000+ ARR (când ai resurse)

**Cost:** €200-500/lună (API calls)

---

## 📊 PRIORITIZARE FEATURES (DUPĂ VALIDARE)

### 🔴 CRITICE (Luna 2-3)
1. Multi-Company Selector (ai 100 clienți!)
2. Export Rapoarte PDF (diferențiator major)
3. Email Notifications (automation core)

### 🟡 IMPORTANTE (Luna 3-5)
4. Portal HR Integration (dacă validat în demo)
5. WhatsApp Notifications (dacă cerut de corporate)

### 🟢 NICE-TO-HAVE (Luna 6+)
6. QR Code Equipment
7. Waze Risk Reporting
8. AI Chatbot

### ⚪ REJECTED/LOW PRIORITY
- ProtocolControl ITM (3% use case, custom per client)

---

## 🎯 NEXT STEPS

**ACUM:**
1. ✅ Salvat backlog features
2. ⏳ Deploy Vercel (PRIORITATE 1)
3. ⏳ Pitch Deck + Case Study (PRIORITATE 2)

**DUPĂ PRIMELE 3 DEMO CALLS:**
1. Analizezi feedback: "Ce v-a lipsit?"
2. Compari cu backlog: ce coincide?
3. Prioritizezi top 3 features cerute
4. Implementezi în ordine

**REGULA:**
Features se construiesc DUPĂ validare, NU înainte.
Excepție: Features critice pentru demo (Export PDF, Multi-Company).

---

**Versiune:** 1.0
**Update:** După fiecare demo call cu feedback real
