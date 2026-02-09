// app/unauthorized/page.tsx
// Pagină afișată când userul nu are permisiuni pentru o resursă
// Design consistent cu dashboard-ul (Tailwind, rounded-2xl, blue-600 accent)

import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <svg
              className="h-10 w-10 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Titlu */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acces interzis
          </h1>

          {/* Mesaj */}
          <p className="text-gray-600 mb-8">
            Nu aveți acces la această pagină. Dacă considerați că ar trebui să aveți acces,
            contactați administratorul sistemului.
          </p>

          {/* Butoane */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Înapoi la Dashboard
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Pagina principală
            </Link>
          </div>

          {/* Info suplimentară */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Cod eroare: <span className="font-mono font-semibold">403 Forbidden</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
