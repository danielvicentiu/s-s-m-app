# Push Notifications Service — S-S-M.ro

Serviciu complet pentru Web Push Notifications cu VAPID authentication și integrare Supabase.

## 📋 Componente

### 1. **push-notification-service.ts**
Serviciu principal cu funcțiile:
- `isPushSupported()` — verifică suport browser
- `registerServiceWorker()` — înregistrează SW
- `requestPermission()` — solicită permisiune notificări
- `subscribeToPush(userId)` — abonare + salvare în DB
- `unsubscribeFromPush(userId)` — dezabonare
- `getCurrentSubscription(userId)` — obține subscription curent
- `sendPushNotification(subscription, payload)` — trimite notificare
- `sendPushToOrganization(orgId, payload)` — trimite la organizație

### 2. **Migration SQL**
`supabase/migrations/20260213_push_subscriptions.sql`
- Tabel `push_subscriptions` cu RLS policies
- Indexuri pentru performanță
- Trigger pentru `updated_at`

### 3. **Service Worker**
`public/sw.js`
- Handler pentru evenimente push
- Afișare notificări
- Click handler cu navigare

### 4. **Types**
`lib/types/push-notification.types.ts`
- Tipuri TypeScript pentru toate componentele

## 🚀 Setup

### 1. Generare VAPID Keys

```bash
# Instalează web-push global
npm install -g web-push

# Generează keys
npx web-push generate-vapid-keys
```

### 2. Configurare Environment Variables

Adaugă în `.env.local`:

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
```

⚠️ **IMPORTANT:** Nu commit-a `VAPID_PRIVATE_KEY` în git!

### 3. Rulare Migration

```bash
# Conectează-te la Supabase
psql postgres://[connection-string]

# Rulează migration-ul
\i supabase/migrations/20260213_push_subscriptions.sql
```

Sau din Supabase Dashboard → SQL Editor → paste conținutul fișierului.

### 4. Instalare Dependențe (pentru server-side sending)

```bash
npm install web-push
```

## 💻 Utilizare

### Client-side: Abonare la Push

```typescript
import { subscribeToPush, requestPermission } from '@/lib/services/push-notification-service'

async function enablePushNotifications() {
  try {
    // Verifică permisiunea
    const permission = await requestPermission()

    if (permission === 'granted') {
      // Abonează utilizatorul
      const subscription = await subscribeToPush(userId)
      console.log('Subscribed:', subscription)
    }
  } catch (error) {
    console.error('Failed to enable push notifications:', error)
  }
}
```

### Server-side: Trimitere Notificare

```typescript
import { sendPushNotification } from '@/lib/services/push-notification-service'

// Obține subscription din DB
const subscription = await supabase
  .from('push_subscriptions')
  .select('*')
  .eq('user_id', userId)
  .eq('is_active', true)
  .single()

// Trimite notificare
await sendPushNotification(subscription.data, {
  title: 'Control medical expiră în 7 zile',
  body: 'Ion Popescu — control medical pentru operare mașini',
  icon: '/icon-192x192.png',
  url: '/dashboard/medical'
})
```

### API Route Example

```typescript
// app/api/push/send/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { sendPushNotification } from '@/lib/services/push-notification-service'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const { userId, title, body, url } = await request.json()

  const supabase = createSupabaseServer()

  // Verifică autentificare
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Obține subscription
  const { data: subscription } = await supabase
    .from('push_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single()

  if (!subscription) {
    return NextResponse.json({ error: 'No active subscription' }, { status: 404 })
  }

  // Trimite notificare
  const success = await sendPushNotification(subscription, {
    title,
    body,
    url
  })

  return NextResponse.json({ success })
}
```

## 🔐 Securitate

### RLS Policies

Tabelul `push_subscriptions` are RLS activat cu următoarele policies:

1. **Users can view own subscriptions** — fiecare user vede doar propriile subscription-uri
2. **Users can create own subscriptions** — fiecare user poate crea subscription-uri doar pentru el
3. **Users can update own subscriptions** — fiecare user poate actualiza doar propriile subscription-uri
4. **Users can delete own subscriptions** — fiecare user poate șterge doar propriile subscription-uri
5. **Consultants can view org subscriptions** — consultanții văd subscription-urile organizațiilor lor

### Best Practices

- ✅ VAPID private key doar în `.env.local` (server-side)
- ✅ VAPID public key poate fi expus (client-side)
- ✅ Verifică întotdeauna permisiunea înainte de abonare
- ✅ Marchează subscription-urile invalide ca `is_active = false`
- ✅ Verifică autentificare în API routes
- ✅ Nu trimite notificări spam — respectă preferințele utilizatorului

## 📱 Suport Browsere

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome | ✅ 42+ | ✅ 42+ |
| Firefox | ✅ 44+ | ✅ 48+ |
| Safari | ✅ 16+ | ✅ 16.4+ |
| Edge | ✅ 17+ | ✅ 17+ |
| Opera | ✅ 29+ | ✅ 29+ |

## 🧪 Testing

### Test Local

```typescript
// În browser console
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('SW registered:', reg))
    .catch(err => console.error('SW registration failed:', err))
}
```

### Test Notificare

```typescript
// După abonare
new Notification('Test', {
  body: 'Aceasta este o notificare de test',
  icon: '/icon-192x192.png'
})
```

## 🔧 Troubleshooting

### "Push notifications not supported"
- Verifică că HTTPS este activat (localhost e OK pentru development)
- Verifică suport browser

### "Notification permission denied"
- User-ul a refuzat permisiunea — ghidează-l să o activeze din setări browser

### "Service Worker registration failed"
- Verifică că fișierul `/sw.js` există în `public/`
- Verifică console pentru erori

### "VAPID public key not configured"
- Adaugă `NEXT_PUBLIC_VAPID_PUBLIC_KEY` în `.env.local`
- Restart Next.js dev server

### Subscription nu se salvează în DB
- Verifică RLS policies în Supabase
- Verifică că `user_id` e corect

## 📚 Resurse

- [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [VAPID](https://datatracker.ietf.org/doc/html/rfc8292)
- [web-push library](https://github.com/web-push-libs/web-push)

## 🎯 Next Steps

1. ✅ Setup complet — migrare DB, VAPID keys, service worker
2. ⏳ Integrare în UI — buton "Activează Notificări" în Dashboard
3. ⏳ API routes — endpoint-uri pentru trimitere notificări
4. ⏳ Automatizare — trigger-e pentru alerte expirare (medical, PSI)
5. ⏳ Analytics — tracking open rate, click rate
6. ⏳ Preferințe — setări user pentru tipuri de notificări

---

**Creat:** 13 Februarie 2026
**Versiune:** 1.0.0
**Autor:** Claude Sonnet 4.5
