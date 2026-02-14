# Push Notification Service

Service complet pentru Web Push Notifications în platforma S-S-M.ro.

## Setup

### 1. Generare VAPID Keys

```bash
npx web-push generate-vapid-keys
```

### 2. Configurare Environment Variables

Adaugă în `.env.local`:

```env
# VAPID Keys pentru Web Push
NEXT_PUBLIC_VAPID_PUBLIC_KEY="BKxxx..."
VAPID_PRIVATE_KEY="xxx..."
VAPID_EMAIL="admin@s-s-m.ro"
```

### 3. Migrare Bază de Date

```bash
# Rulează migrarea pentru tabela push_subscriptions
supabase migration up
```

### 4. Icon-uri Notificări

Creează următoarele icon-uri în `public/icons/`:
- `icon-192x192.png` - Icon principal notificare
- `badge-72x72.png` - Badge small pentru Android
- `icon-512x512.png` - Icon mare pentru instalare PWA

## Utilizare

### Client-Side

#### 1. Înregistrare Service Worker

```typescript
import { registerServiceWorker } from '@/lib/services/push-notification-service'

// Pe app initialization
await registerServiceWorker()
```

#### 2. Cerere Permisiune

```typescript
import { requestPermission, isPushNotificationSupported } from '@/lib/services/push-notification-service'

if (isPushNotificationSupported()) {
  const permission = await requestPermission()

  if (permission === 'granted') {
    console.log('Notification permission granted')
  }
}
```

#### 3. Subscribe la Push Notifications

```typescript
import { subscribeToPush } from '@/lib/services/push-notification-service'

const subscription = await subscribeToPush(userId, organizationId)

if (subscription) {
  console.log('Successfully subscribed to push notifications')
}
```

#### 4. Unsubscribe

```typescript
import { unsubscribeFromPush } from '@/lib/services/push-notification-service'

const success = await unsubscribeFromPush(userId)
```

#### 5. Test Notificare

```typescript
import { showTestNotification } from '@/lib/services/push-notification-service'

await showTestNotification()
```

### Server-Side

#### 1. Trimitere Notificare la Un User

```typescript
import { sendPushToUser } from '@/lib/services/push-notification-service'

const count = await sendPushToUser(
  userId,
  'Titlu Notificare',
  'Mesaj notificare aici',
  '/icons/icon-192x192.png',
  '/dashboard/alerts',
  { alertId: '123', priority: 'high' }
)

console.log(`Sent to ${count} devices`)
```

#### 2. Trimitere Notificare la Organizație

```typescript
import { sendPushToOrganization } from '@/lib/services/push-notification-service'

const count = await sendPushToOrganization(
  organizationId,
  'Actualizare Legislație',
  'O nouă legislație a fost publicată',
  '/icons/icon-192x192.png',
  '/dashboard/legislation',
  { legislationId: '456' }
)
```

#### 3. Trimitere Directă la Subscription

```typescript
import { sendPushNotification } from '@/lib/services/push-notification-service'

const success = await sendPushNotification(
  subscription,
  'Titlu',
  'Mesaj',
  '/icons/icon-192x192.png',
  '/dashboard',
  { customData: 'value' }
)
```

## Integrare cu Notification Orchestrator

Push notifications se integrează automat cu `notification-orchestrator.ts`:

```typescript
import { sendNotification } from '@/lib/services/notification-orchestrator'

await sendNotification({
  orgId: organizationId,
  userId: userId,
  type: 'medical_exam_expiry',
  priority: 'warning',
  category: 'medical',
  subject: 'Examen medical expiră în 7 zile',
  message: 'Examenul medical pentru Ion Popescu expiră pe 21.02.2026',
  data: {
    employeeName: 'Ion Popescu',
    expiryDate: '2026-02-21',
    daysRemaining: 7
  },
  actionUrl: '/dashboard/medical'
})

// Orchestratorul va trimite automat prin push dacă:
// - User-ul are push activat în preferințe
// - Browser-ul suportă push notifications
// - User-ul are subscription activ
```

## API Reference

### Client-Side Functions

#### `registerServiceWorker(): Promise<ServiceWorkerRegistration | null>`
Înregistrează service worker-ul pentru push notifications.

#### `requestPermission(): Promise<NotificationPermission>`
Solicită permisiune de la user pentru notificări. Returnează: `'granted'`, `'denied'`, sau `'default'`.

#### `subscribeToPush(userId: string, organizationId: string): Promise<PushSubscription | null>`
Creează un push subscription și îl salvează în baza de date.

#### `unsubscribeFromPush(userId: string): Promise<boolean>`
Șterge subscription-ul push al user-ului.

#### `getCurrentSubscription(): Promise<PushSubscription | null>`
Obține subscription-ul curent al browser-ului.

#### `isPushNotificationSupported(): boolean`
Verifică dacă browser-ul suportă push notifications.

#### `getNotificationPermission(): NotificationPermission`
Obține statusul curent al permisiunii de notificări.

#### `showTestNotification(): Promise<boolean>`
Afișează o notificare de test pentru verificare.

### Server-Side Functions

#### `sendPushNotification(subscription, title, body, icon?, url?, data?): Promise<boolean>`
Trimite o notificare push către un subscription specific.

#### `sendPushToUser(userId, title, body, icon?, url?, data?): Promise<number>`
Trimite notificare către toate device-urile unui user. Returnează numărul de device-uri la care s-a trimis cu succes.

#### `sendPushToOrganization(organizationId, title, body, icon?, url?, data?): Promise<number>`
Trimite notificare către toți membrii unei organizații.

## Database Schema

```sql
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  organization_id UUID REFERENCES organizations(id),
  endpoint TEXT NOT NULL,
  keys JSONB NOT NULL,
  user_agent TEXT,
  platform TEXT,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, endpoint)
)
```

## Service Worker Events

Service worker-ul (`public/sw.js`) gestionează următoarele evenimente:

### `push`
Primește notificările push și le afișează.

### `notificationclick`
Gestionează click-ul pe notificare - deschide URL-ul specificat.

### `notificationclose`
Tracking când user-ul închide o notificare fără să dea click.

## Best Practices

### 1. Request Permission la Momentul Potrivit
Nu cere permisiune imediat la loading. Așteaptă un action context-relevant:

```typescript
// ❌ Rău - imediat la page load
useEffect(() => {
  requestPermission()
}, [])

// ✅ Bine - după ce user-ul interacționează
<Button onClick={async () => {
  const permission = await requestPermission()
  if (permission === 'granted') {
    await subscribeToPush(userId, orgId)
  }
}}>
  Activează Notificări
</Button>
```

### 2. Verifică Support Înainte
```typescript
if (!isPushNotificationSupported()) {
  // Ascunde butonul de activare notificări
  return null
}
```

### 3. Gestionează Erori Gracefully
```typescript
try {
  await subscribeToPush(userId, orgId)
} catch (error) {
  showToast('Eroare la activarea notificărilor', 'error')
}
```

### 4. Curăță Subscriptions Expirate
```sql
-- Rulează periodic (cron job)
SELECT cleanup_expired_push_subscriptions();
```

## Browser Support

- ✅ Chrome 42+
- ✅ Firefox 44+
- ✅ Edge 17+
- ✅ Opera 37+
- ✅ Samsung Internet 4+
- ❌ Safari (iOS) - Nu suportă Web Push
- ⚠️ Safari (macOS) - Suport limitat din Safari 16+

## Troubleshooting

### Push notifications nu sosesc

1. **Verifică VAPID keys**
   ```bash
   echo $NEXT_PUBLIC_VAPID_PUBLIC_KEY
   echo $VAPID_PRIVATE_KEY
   ```

2. **Verifică subscription în DB**
   ```sql
   SELECT * FROM push_subscriptions WHERE user_id = 'xxx';
   ```

3. **Verifică service worker**
   - Deschide DevTools → Application → Service Workers
   - Verifică dacă `/sw.js` este înregistrat și activ

4. **Verifică permisiuni browser**
   - Deschide DevTools → Console
   - Rulează: `Notification.permission`
   - Ar trebui să returneze `'granted'`

### Subscription eșuează

1. **Clear browser cache și service worker**
   ```javascript
   await unregisterServiceWorker()
   location.reload()
   ```

2. **Verifică SSL** - Web Push necesită HTTPS (excepție: localhost)

3. **Verifică browser support**
   ```javascript
   console.log('Push supported:', isPushNotificationSupported())
   ```

## Security

- **VAPID Private Key**: Nu expune niciodată în client-side code
- **RLS Policies**: Activat pe `push_subscriptions` - users văd doar propriile subscriptions
- **HTTPS Required**: Web Push funcționează doar pe HTTPS (excepție: localhost)
- **Token Rotation**: Subscriptions expiră automat după 90 zile de inactivitate

## Performance

- **Batch Sending**: Pentru organizații mari, folosește batch processing
- **Rate Limiting**: Implementat în Edge Function pentru a preveni spam
- **Cleanup**: Subscriptions expirate sunt șterse automat lunar

## Testing

### Local Testing

```typescript
// 1. Test service worker registration
const sw = await registerServiceWorker()
console.log('SW registered:', !!sw)

// 2. Test permission request
const permission = await requestPermission()
console.log('Permission:', permission)

// 3. Test subscription
const sub = await subscribeToPush(userId, orgId)
console.log('Subscription:', sub)

// 4. Test notification display
await showTestNotification()
```

### Production Testing

```bash
# Send test push from Edge Function
curl -X POST https://uhccxfyvhjeudkexcgiq.supabase.co/functions/v1/send-push-notification \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "subscription": {...},
    "notification": {
      "title": "Test",
      "body": "Test message"
    }
  }'
```

## Next Steps

1. **Creare Edge Function**: `supabase/functions/send-push-notification/`
2. **Implementare UI**: Component pentru gestionare preferințe push în settings
3. **Analytics**: Track notification delivery rate și engagement
4. **A/B Testing**: Testează diferite formats și timing pentru notificări
