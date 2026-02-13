// app/admin/countries/page.tsx
// Admin UI: Overview țări configurate
// Acces: super_admin și consultant_ssm

import { Globe, FileText, Bell, Package } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isSuperAdmin, hasRole } from '@/lib/rbac'
import { createSupabaseServer } from '@/lib/supabase/server'
import { COUNTRY_FLAGS, COUNTRY_NAMES, COUNTRY_CURRENCIES, type CountryCode } from '@/lib/types'

const COUNTRIES: CountryCode[] = ['RO', 'BG', 'HU', 'DE', 'PL']

export default async function AdminCountriesPage() {
  // GUARD: Verificare super_admin sau consultant_ssm
  const admin = await isSuperAdmin()
  const consultant = await hasRole('consultant_ssm')

  if (!admin && !consultant) {redirect('/unauthorized')}

  const supabase = await createSupabaseServer()

  // Fetch statistici per țară
  const countriesData = await Promise.all(
    COUNTRIES.map(async (code) => {
      const [obligations, alerts, equipment] = await Promise.all([
        supabase
          .from('obligation_types')
          .select('id', { count: 'exact', head: true })
          .eq('country_code', code),
        supabase
          .from('alert_categories')
          .select('id', { count: 'exact', head: true })
          .eq('country_code', code),
        supabase
          .from('equipment_types')
          .select('id', { count: 'exact', head: true })
          .eq('country_code', code),
      ])

      return {
        code,
        name: COUNTRY_NAMES[code],
        flag: COUNTRY_FLAGS[code],
        currency: COUNTRY_CURRENCIES[code],
        obligations_count: obligations.count || 0,
        alerts_count: alerts.count || 0,
        equipment_count: equipment.count || 0,
      }
    })
  )

  // Statistici totale
  const totals = {
    obligations: countriesData.reduce((sum, c) => sum + c.obligations_count, 0),
    alerts: countriesData.reduce((sum, c) => sum + c.alerts_count, 0),
    equipment: countriesData.reduce((sum, c) => sum + c.equipment_count, 0),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Globe className="h-7 w-7 text-blue-600" />
              Țări Configurate — Overview
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              5 țări active cu obligații, alerte și echipamente configurate
            </p>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
              <div className="text-3xl font-black text-blue-600">{totals.obligations}</div>
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-widest mt-1">
                Total Obligații
              </div>
            </div>
            <div className="bg-green-50 rounded-xl border border-green-100 p-4">
              <div className="text-3xl font-black text-green-600">{totals.alerts}</div>
              <div className="text-xs font-semibold text-green-600 uppercase tracking-widest mt-1">
                Total Alerte
              </div>
            </div>
            <div className="bg-purple-50 rounded-xl border border-purple-100 p-4">
              <div className="text-3xl font-black text-purple-600">{totals.equipment}</div>
              <div className="text-xs font-semibold text-purple-600 uppercase tracking-widest mt-1">
                Total Echipamente
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-6">
        {/* GRID ȚĂRI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {countriesData.map((country) => (
            <div
              key={country.code}
              className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-600 hover:shadow-xl transition-all"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="text-5xl">{country.flag}</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{country.name}</h3>
                  <p className="text-sm text-gray-500">{country.code} • {country.currency}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Obligații</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{country.obligations_count}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Alerte</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{country.alerts_count}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">Echipamente</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">{country.equipment_count}</span>
                </div>
              </div>

              {/* Links */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
                <Link
                  href={`/admin/obligations?country=${country.code}`}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Vezi obligații →
                </Link>
                <Link
                  href={`/admin/alert-categories?country=${country.code}`}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Vezi alerte →
                </Link>
                <Link
                  href={`/admin/equipment-types?country=${country.code}`}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Vezi echipamente →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* LINK ÎNAPOI */}
        <div className="mt-6 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Înapoi la Dashboard
          </Link>
          <Link
            href="/admin/roles"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Admin Roluri →
          </Link>
        </div>
      </main>
    </div>
  )
}
