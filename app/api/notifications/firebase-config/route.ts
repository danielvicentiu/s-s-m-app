// app/api/notifications/firebase-config/route.ts
// Servește configurația Firebase ca JavaScript pentru service worker
// Toate variabilele NEXT_PUBLIC_* sunt publice — safe to expose

import { NextResponse } from 'next/server'

export async function GET() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
  }

  const js = `self.__FIREBASE_CONFIG = ${JSON.stringify(config)};`

  return new NextResponse(js, {
    headers: {
      'Content-Type': 'text/javascript',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
