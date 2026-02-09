'use client'

import Link from 'next/link'
import { ArrowLeft, Construction } from 'lucide-react'

interface Props {
  title: string
  description: string
  backLink: string
  backLabel: string
}

export default function AdminFormPlaceholder({ title, description, backLink, backLabel }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-12 text-center">
          <Construction className="h-20 w-20 text-orange-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
          <p className="text-lg text-gray-600 mb-8">{description}</p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-left mb-8">
            <h2 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-3">
              Soluție temporară
            </h2>
            <p className="text-sm text-blue-800 leading-relaxed">
              Până la implementarea formularelor CRUD, poți gestiona datele direct din{' '}
              <a
                href="https://supabase.com/dashboard/project/uhccxfyvhjeudkexcgiq/editor"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline hover:text-blue-600"
              >
                Supabase Table Editor
              </a>
              . Toate tabelele au RLS activ și permisiuni configurate pentru super_admin și consultant_ssm.
            </p>
          </div>

          <Link
            href={backLink}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            <ArrowLeft className="h-5 w-5" />
            {backLabel}
          </Link>
        </div>
      </div>
    </div>
  )
}
