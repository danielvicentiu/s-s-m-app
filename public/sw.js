// S-S-M.RO — SERVICE WORKER pentru Push Notifications
// Data: 13 Februarie 2026

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  event.waitUntil(self.clients.claim())
})

self.addEventListener('push', (event) => {
  console.log('Push notification received:', event)

  if (!event.data) {
    console.warn('Push event has no data')
    return
  }

  try {
    const data = event.data.json()
    const title = data.title || 'S-S-M.ro Notificare'
    const options = {
      body: data.body || '',
      icon: data.icon || '/icon-192x192.png',
      badge: data.badge || '/badge-72x72.png',
      data: data.data || {},
      tag: 'ssm-notification',
      requireInteraction: false,
      vibrate: [200, 100, 200]
    }

    event.waitUntil(
      self.registration.showNotification(title, options)
    )
  } catch (error) {
    console.error('Failed to parse push notification:', error)
  }
})

self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)

  event.notification.close()

  const urlToOpen = event.notification.data?.url || '/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Verifică dacă există deja o fereastră deschisă
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i]
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus()
          }
        }
        // Dacă nu, deschide o fereastră nouă
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen)
        }
      })
  )
})

self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event)
})
