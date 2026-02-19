// public/firebase-messaging-sw.js
// Firebase Cloud Messaging Service Worker
// Gestionează notificările în background (când app-ul nu este activ)

importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

// Încearcă să încarce configurația din endpoint-ul dinamic (care citește din env vars)
// Dacă nu reușește (e.g. offline), folosește self.__FIREBASE_CONFIG setat anterior
try {
  importScripts('/api/notifications/firebase-config');
} catch (e) {
  // Ignoră eroarea — self.__FIREBASE_CONFIG va fi {} dacă nu s-a setat
}

const firebaseConfig = self.__FIREBASE_CONFIG || {};

// Nu inițializa dacă config-ul e gol (evită erori Firebase în dev fără config)
if (!firebaseConfig.projectId) {
  console.warn('[FCM SW] Firebase config lipsă — notificările push nu sunt active.');
}

if (firebaseConfig.projectId) {
  firebase.initializeApp(firebaseConfig);
}

const messaging = firebaseConfig.projectId ? firebase.messaging() : null;

// ---------------------------------------------------------------------------
// onBackgroundMessage — notificări primite când app-ul este în background/închis
// ---------------------------------------------------------------------------
if (messaging) messaging.onBackgroundMessage((payload) => {
  console.log('[FCM SW] Background message received:', payload.messageId);

  const notification = payload.notification || {};
  const data = payload.data || {};

  const title = notification.title || data.title || 'S-S-M Notificare';
  const body = notification.body || data.body || '';

  // Iconița: verificăm ce avem disponibil
  // Dacă public/icons/ nu există, folosim favicon.ico
  const icon = notification.icon || '/favicon.ico';
  const badge = '/favicon.ico';

  // URL-ul de deschis la click
  const clickUrl = data.url || '/dashboard/alerts';

  const notificationOptions = {
    body,
    icon,
    badge,
    tag: data.alert_id || payload.messageId || 'ssm-notification',
    data: {
      url: clickUrl,
      ...data,
    },
    requireInteraction: data.type === 'ssm_alert',
    vibrate: [200, 100, 200],
  };

  return self.registration.showNotification(title, notificationOptions);
});

// ---------------------------------------------------------------------------
// notificationclick — deschide URL-ul la click pe notificare
// ---------------------------------------------------------------------------
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/dashboard/alerts';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Dacă app-ul e deja deschis, focusează-l
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Altfel, deschide o fereastră nouă
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
