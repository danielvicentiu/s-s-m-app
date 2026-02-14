## 📝 Descriere

<!-- Descrie modificările tale în 2-3 propoziții -->

## 🎯 Tip schimbare

<!-- Marchează cu [x] opțiunea corespunzătoare -->

- [ ] 🐛 Bug fix (non-breaking change care rezolvă o problemă)
- [ ] ✨ Feature nou (non-breaking change care adaugă funcționalitate)
- [ ] 💥 Breaking change (modificare care afectează funcționalitatea existentă)
- [ ] 📝 Documentație
- [ ] ♻️ Refactoring (fără schimbări funcționale)
- [ ] 🎨 UI/UX improvements
- [ ] ⚡ Performance improvements
- [ ] 🗃️ Database migrations

## 🔗 Issue / Context

<!-- Link către issue sau documentație relevantă -->

Closes #(issue number)
Refs: docs/DOC_NAME.md

## 🧪 Cum a fost testat?

<!-- Descrie pașii pentru a testa modificările -->

**Environment:**
- [ ] Local development
- [ ] Supabase staging
- [ ] Production preview

**Test Steps:**
1.
2.
3.

**Edge cases testate:**
- [ ] Empty state
- [ ] Error handling
- [ ] Permission boundaries (RLS)
- [ ] Large datasets
- [ ] Mobile/tablet view

## 📸 Screenshots / Video

<!-- Dacă schimbarea afectează UI, adaugă screenshots sau video -->

### Before
<!-- Screenshot înainte -->

### After
<!-- Screenshot după -->

## ✅ Checklist

### General
- [ ] Codul respectă [ghidul de stil](../CONTRIBUTING.md#convenții-de-cod)
- [ ] Am testat modificările local
- [ ] `npm run lint` trece fără erori
- [ ] `npm run build` trece fără erori
- [ ] Commit messages respectă [convenția](../CONTRIBUTING.md#commit-messages)
- [ ] Branch name respectă convenția `bg/feature-name`

### Cod
- [ ] TypeScript strict mode — fără `any` (sau justificat)
- [ ] Folosesc alias `@/` pentru imports
- [ ] Componente client au directive `'use client'`
- [ ] Error handling implementat cu try-catch
- [ ] Console errors în engleză, UI errors în română

### Database (dacă aplicabil)
- [ ] RLS activat pe tabele noi
- [ ] Migrări SQL în `supabase/migrations/` cu format `YYYYMMDD_name.sql`
- [ ] Indexuri adăugate pentru query-uri noi
- [ ] Folosesc soft delete (`deleted_at`) nu hard delete
- [ ] Am testat RLS pentru toate rolurile (consultant, firma_admin, angajat)

### UI/UX (dacă aplicabil)
- [ ] Design consistent cu dashboard-ul (rounded-2xl, gray-50, blue-600)
- [ ] Responsive pe mobile/tablet/desktop
- [ ] Accesibilitate — keyboard navigation funcționează
- [ ] Loading states implementate
- [ ] Error states implementate
- [ ] Empty states implementate (folosind `EmptyState` component)

### Security
- [ ] Nu expun date sensibile în client
- [ ] Input validation pe server
- [ ] RBAC/permissions verificate corect
- [ ] Nu folosesc `localStorage`/`sessionStorage` în server components

### Documentation
- [ ] Comentarii pentru logică complexă
- [ ] JSDoc pentru funcții publice
- [ ] README.md actualizat (dacă e cazul)
- [ ] CLAUDE.md actualizat (dacă schimbări majore)

## 🔒 Breaking Changes

<!-- Dacă DA, descrie impact și plan de migrare -->

- [ ] NU are breaking changes
- [ ] Are breaking changes (descris mai jos)

<!-- Dacă DA:
**Impact:**
-

**Migration plan:**
1.
2.
-->

## 📚 Context adițional

<!-- Orice alt context util pentru reviewers -->

### Dependencies
<!-- Pachete noi adăugate? -->

### Performance considerations
<!-- Impactează performance? Query-uri noi? -->

### Future work
<!-- Follow-up tasks necesare? -->

## 👀 Reviewers

<!-- Tag specific reviewers dacă este cazul -->
<!-- @username -->

---

**Checklist pentru maintainer (la merge):**
- [ ] Toate checks CI sunt verzi
- [ ] Migrări SQL testate pe staging
- [ ] Documentation actualizată
- [ ] Branch protejat actualizat (dacă e cazul)
