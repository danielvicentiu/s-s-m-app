# Performance Benchmarks — s-s-m.ro

**Data actualizare:** 2026-02-13
**Aplicație:** [app.s-s-m.ro](https://app.s-s-m.ro)
**Stack:** Next.js 14 (App Router) + Supabase + TypeScript + Vercel

---

## 📊 Web Vitals — Ținte de Performanță

Performance targets bazate pe [Core Web Vitals](https://web.dev/vitals/) și best practices pentru aplicații enterprise.

| Metrică | Descriere | Țintă | Status |
|---------|-----------|-------|--------|
| **LCP** (Largest Contentful Paint) | Timpul până la încărcarea celui mai mare element vizibil | **< 2.5s** | 🟡 În curs de măsurare |
| **FID** (First Input Delay) | Timpul până la prima interacțiune utilizator | **< 100ms** | 🟡 În curs de măsurare |
| **CLS** (Cumulative Layout Shift) | Stabilitatea vizuală (fără mișcări layout) | **< 0.1** | 🟡 În curs de măsurare |
| **TTFB** (Time to First Byte) | Timpul până la primul byte de la server | **< 600ms** | 🟡 În curs de măsurare |
| **TTI** (Time to Interactive) | Timpul până când pagina devine complet interactivă | **< 3.8s** | 🟡 În curs de măsurare |

**Legenda:**
- 🟢 **Verde** = Țintă atinsă
- 🟡 **Galben** = În lucru / Necesită îmbunătățiri
- 🔴 **Roșu** = Sub țintă (necesită optimizare urgentă)

---

## 🚀 Performance Targets — Componente Aplicație

### API Response Times

| Endpoint Type | Descriere | Țintă | Current | Status |
|--------------|-----------|-------|---------|--------|
| **API Generic** | Request-response mediu | **< 200ms** | TBD | 🟡 |
| **GET** (simple queries) | Fetch date simplu (ex: listă utilizatori) | **< 150ms** | TBD | 🟡 |
| **GET** (complex queries) | Query-uri cu JOIN-uri multiple | **< 300ms** | TBD | 🟡 |
| **POST/PUT** | Create/Update operații | **< 250ms** | TBD | 🟡 |
| **DELETE** | Soft delete operații | **< 150ms** | TBD | 🟡 |
| **Search** | Full-text search în baza de date | **< 500ms** | TBD | 🟡 |
| **Bulk Operations** | Import/export/batch processing | **< 2s** | TBD | 🟡 |

### Page Load Times

| Pagină | Descriere | Țintă | Current | Status |
|--------|-----------|-------|---------|--------|
| **Dashboard** | Pagina principală după login | **< 3s** | TBD | 🟡 |
| **List Pages** | Pagini cu liste (employees, trainings, etc.) | **< 2s** | TBD | 🟡 |
| **Detail Pages** | Pagini detalii (employee profile, training details) | **< 1.5s** | TBD | 🟡 |
| **Forms** | Pagini cu formulare (create/edit) | **< 1s** | TBD | 🟡 |
| **Reports** | Generare rapoarte PDF | **< 5s** | TBD | 🟡 |
| **Auth Pages** | Login/Register | **< 1s** | TBD | 🟡 |

### Interactive Features

| Feature | Descriere | Țintă | Current | Status |
|---------|-----------|-------|---------|--------|
| **Search (Client)** | Search în liste client-side | **< 100ms** | TBD | 🟡 |
| **Search (Server)** | Search cu API call | **< 500ms** | TBD | 🟡 |
| **Filter/Sort** | Filtrare și sortare liste | **< 200ms** | TBD | 🟡 |
| **Modal Open** | Deschidere dialog/modal | **< 50ms** | TBD | 🟡 |
| **Navigation** | Tranziție între pagini | **< 300ms** | TBD | 🟡 |

---

## 📈 Current vs Target — Tabel Sumar

| Categorie | Metrică | Target | Current | Gap | Priority |
|-----------|---------|--------|---------|-----|----------|
| **Web Vitals** | LCP | < 2.5s | TBD | - | 🔴 High |
| **Web Vitals** | FID | < 100ms | TBD | - | 🔴 High |
| **Web Vitals** | CLS | < 0.1 | TBD | - | 🟡 Medium |
| **API** | Response Time | < 200ms | TBD | - | 🔴 High |
| **Dashboard** | Load Time | < 3s | TBD | - | 🔴 High |
| **Lists** | Load Time | < 2s | TBD | - | 🟡 Medium |
| **Search** | Response Time | < 500ms | TBD | - | 🟡 Medium |

---

## 🛠️ Optimization Strategies

### 1. **Frontend Optimization**

#### 1.1 Code Splitting & Lazy Loading
```typescript
// Lazy load heavy components
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <Skeleton />,
  ssr: false
});

// Route-based code splitting (built-in în Next.js App Router)
// Fiecare route în app/ este automat split
```

**Impact:** Reduce bundle size cu 30-50%, îmbunătățește LCP

#### 1.2 Image Optimization
```typescript
// Folosește Next.js Image component
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={50}
  priority // pentru hero images
  placeholder="blur" // pentru smooth loading
/>
```

**Impact:** Reduce LCP cu până la 50% pentru pagini image-heavy

#### 1.3 Font Optimization
```typescript
// În layout.tsx - folosește next/font
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // evită FOIT
  preload: true
});
```

**Impact:** Reduce CLS, îmbunătățește TTFB

#### 1.4 Client-Side Caching
```typescript
// SWR pentru data fetching cu cache
import useSWR from 'swr';

const { data, error } = useSWR('/api/employees', fetcher, {
  revalidateOnFocus: false,
  dedupingInterval: 60000 // 1 minut
});
```

**Impact:** Reduce API calls cu 40-60%, îmbunătățește perceived performance

#### 1.5 React Performance
```typescript
// Memoization pentru componente heavy
const EmployeeTable = memo(({ employees }) => {
  return <Table data={employees} />;
});

// useMemo pentru computații costisitoare
const filteredEmployees = useMemo(
  () => employees.filter(e => e.active),
  [employees]
);

// useCallback pentru funcții pasate ca props
const handleDelete = useCallback((id) => {
  deleteEmployee(id);
}, []);
```

**Impact:** Reduce re-renders cu 50-70%, îmbunătățește FID

---

### 2. **Backend Optimization**

#### 2.1 Database Indexing
```sql
-- Index pentru query-uri frecvente
CREATE INDEX idx_employees_org_active
ON employees(organization_id, is_active)
WHERE deleted_at IS NULL;

CREATE INDEX idx_trainings_expiry
ON trainings(organization_id, expiry_date)
WHERE deleted_at IS NULL;

CREATE INDEX idx_medical_records_status
ON medical_records(employee_id, status, expires_at);

-- Full-text search index
CREATE INDEX idx_employees_search
ON employees USING gin(to_tsvector('romanian', name || ' ' || email));
```

**Impact:** Reduce query time cu 60-80%

#### 2.2 Query Optimization
```typescript
// ❌ N+1 problem
const employees = await supabase.from('employees').select('*');
for (const emp of employees) {
  const trainings = await supabase
    .from('trainings')
    .eq('employee_id', emp.id);
}

// ✅ Join query
const employees = await supabase
  .from('employees')
  .select(`
    *,
    trainings (*)
  `)
  .eq('organization_id', orgId);
```

**Impact:** Reduce API response time cu 70-90%

#### 2.3 Pagination
```typescript
// Implementare cursor-based pagination pentru liste mari
const PAGE_SIZE = 50;

const { data, error } = await supabase
  .from('employees')
  .select('*')
  .range(offset, offset + PAGE_SIZE - 1)
  .order('created_at', { ascending: false });
```

**Impact:** Reduce load time cu 50-80% pentru liste mari

#### 2.4 Caching Strategy
```typescript
// API route cu cache headers
export async function GET(request: Request) {
  const data = await fetchData();

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    }
  });
}
```

**Impact:** Reduce server load cu 40-60%, îmbunătățește TTFB

#### 2.5 Connection Pooling
```typescript
// Supabase folosește connection pooling built-in
// Configurare optimă în supabase/config.toml
[db]
pool_size = 15
max_client_conn = 100
```

**Impact:** Reduce connection overhead cu 30-50%

---

### 3. **Network Optimization**

#### 3.1 CDN & Edge Caching
```javascript
// vercel.json configuration
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**Impact:** Reduce TTFB cu 40-70% pentru static assets

#### 3.2 Compression
```javascript
// Vercel activează automat compression (gzip/brotli)
// Asigură-te că response-urile sunt > 1KB pentru a activa compression
```

**Impact:** Reduce bandwidth cu 60-80%

#### 3.3 Prefetching
```typescript
// Next.js Link component cu prefetch
<Link href="/dashboard" prefetch={true}>
  Dashboard
</Link>

// Prefetch manual pentru critical routes
router.prefetch('/dashboard');
```

**Impact:** Reduce perceived load time cu 50-70%

---

### 4. **Monitoring & Measuring**

#### 4.1 Web Vitals Tracking
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

#### 4.2 Custom Performance Monitoring
```typescript
// lib/monitoring/performance.ts
export function measureAPIResponse(endpoint: string, duration: number) {
  if (typeof window !== 'undefined' && 'performance' in window) {
    performance.mark(`api-${endpoint}-end`);
    performance.measure(`api-${endpoint}`, `api-${endpoint}-start`, `api-${endpoint}-end`);
  }

  // Send to analytics
  console.log(`[Performance] ${endpoint}: ${duration}ms`);
}
```

#### 4.3 Lighthouse CI
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://app.s-s-m.ro
            https://app.s-s-m.ro/dashboard
          uploadArtifacts: true
```

---

## 🎯 Implementation Roadmap

### Phase 1: Baseline Measurement (Săptămâna 1-2)
- [ ] Setup Vercel Analytics & Speed Insights
- [ ] Implement custom performance monitoring
- [ ] Run Lighthouse audits pe pagini principale
- [ ] Documentare rezultate baseline în acest document

### Phase 2: Quick Wins (Săptămâna 3-4)
- [ ] Optimize images (convert la WebP, add lazy loading)
- [ ] Add database indexes pe query-uri frecvente
- [ ] Implement pagination pe liste mari (> 100 records)
- [ ] Enable Edge caching pentru static assets

### Phase 3: Deep Optimization (Săptămâna 5-8)
- [ ] Implement code splitting pentru componente heavy
- [ ] Add SWR/React Query pentru client-side caching
- [ ] Optimize complex queries (reduce N+1, add JOINs)
- [ ] Implement React memoization pe componente critice

### Phase 4: Advanced (Săptămâna 9-12)
- [ ] Implement ISR (Incremental Static Regeneration) pentru pagini statice
- [ ] Add service worker pentru offline support
- [ ] Optimize bundle size (analyze cu @next/bundle-analyzer)
- [ ] Implement progressive loading pentru dashboard

---

## 📝 Measuring & Reporting

### Tools utilizate:
1. **Vercel Analytics** — Real User Monitoring (RUM)
2. **Vercel Speed Insights** — Web Vitals tracking
3. **Lighthouse CI** — Automated audits
4. **Chrome DevTools** — Network & Performance profiling
5. **Supabase Dashboard** — Database query performance

### Reporting cadence:
- **Săptămânal:** Review Web Vitals în Vercel Dashboard
- **Bi-weekly:** Lighthouse audit pe pagini critice
- **Lunar:** Performance report complet (acest document actualizat)

---

## 📚 Referințe

- [Core Web Vitals](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Supabase Performance Tips](https://supabase.com/docs/guides/platform/performance)
- [Vercel Analytics](https://vercel.com/docs/analytics)

---

**Ultima actualizare:** 2026-02-13
**Next review:** 2026-03-13
