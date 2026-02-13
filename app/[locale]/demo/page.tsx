// app/[locale]/demo/page.tsx
// Pagină DEMO publică (fără autentificare)
// Dashboard interactiv cu date fictive pentru a demonstra capabilitățile platformei

'use client'

import { useState } from 'react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import {
  Users,
  AlertTriangle,
  TrendingUp,
  Building2,
  Award,
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle2,
  ArrowRight,
  Eye,
  Activity
} from 'lucide-react'
import Link from 'next/link'

// Date demo pentru companie fictivă
const DEMO_DATA = {
  company: {
    name: 'Demo Company SRL',
    cui: 'RO12345678',
    employees: 25,
    score: 78,
    status: 'active' as const
  },
  alerts: [
    {
      id: 1,
      type: 'medical',
      message: '3 angajați cu aviz medical expirat în 15 zile',
      severity: 'expiring',
      daysRemaining: 15,
      icon: Users
    },
    {
      id: 2,
      type: 'equipment',
      message: 'Echipament PSI necesită verificare',
      severity: 'expiring',
      daysRemaining: 7,
      icon: ShieldCheck
    },
    {
      id: 3,
      type: 'training',
      message: '5 angajați necesită instruire SSM de reîmprospătare',
      severity: 'expired',
      daysRemaining: 0,
      icon: Award
    }
  ],
  stats: {
    medical: { total: 25, valid: 18, expiring: 4, expired: 3 },
    equipment: { total: 12, valid: 9, expiring: 2, expired: 1 },
    trainings: { total: 25, valid: 15, expiring: 5, expired: 5 }
  },
  recentActivity: [
    { id: 1, text: 'Aviz medical actualizat - Ion Popescu', time: '2 ore' },
    { id: 2, text: 'Instruire SSM finalizată - echipa producție', time: '1 zi' },
    { id: 3, text: 'Echipament PSI verificat - stingătoare', time: '3 zile' },
    { id: 4, text: 'Raport lunar SSM generat', time: '5 zile' }
  ]
}

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<'medical' | 'equipment' | 'trainings'>('medical')

  const currentStats = DEMO_DATA.stats[activeTab]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header cu CTA sticky */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">s-s-m.ro</h1>
                <p className="text-xs text-gray-500">Platformă SSM/PSI Digitală</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
                <Eye className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-900">Mod demonstrație</span>
              </div>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
              >
                Înregistrare gratuită
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Banner demo */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Bine ați venit la demonstrația interactivă!</h2>
              <p className="text-blue-100 mb-4 max-w-2xl">
                Explorați capabilitățile platformei s-s-m.ro cu date demo.
                Vedeți cum gestionați eficient conformitatea SSM/PSI pentru firma dumneavoastră.
              </p>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm font-medium">Aceasta este o demonstrație. Înregistrați-vă pentru date reale.</span>
              </div>
            </div>
            <Building2 className="w-16 h-16 text-white/30 hidden lg:block" />
          </div>
        </div>

        {/* Company Info Card */}
        <div className="mb-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-gray-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{DEMO_DATA.company.name}</h3>
                <p className="text-sm text-gray-500">CUI: {DEMO_DATA.company.cui}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-3xl font-bold text-gray-900">{DEMO_DATA.company.score}</span>
                <span className="text-sm text-gray-500">/100</span>
              </div>
              <p className="text-xs text-gray-500">Scor conformitate</p>
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">

          {/* Coloana stânga - Alerte */}
          <div className="lg:col-span-2 space-y-6">

            {/* Alerte active */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Alerte active
                </h3>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                  {DEMO_DATA.alerts.length} notificări
                </span>
              </div>
              <div className="space-y-3">
                {DEMO_DATA.alerts.map((alert) => {
                  const Icon = alert.icon
                  return (
                    <div
                      key={alert.id}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-orange-300 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          alert.severity === 'expired' ? 'bg-red-100' : 'bg-orange-100'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            alert.severity === 'expired' ? 'text-red-600' : 'text-orange-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 mb-1">{alert.message}</p>
                          <div className="flex items-center gap-2">
                            {alert.daysRemaining > 0 ? (
                              <>
                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                <span className="text-xs text-gray-500">Peste {alert.daysRemaining} zile</span>
                              </>
                            ) : (
                              <StatusBadge status="expired" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Tabs și conținut */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">

              {/* Tabs */}
              <div className="border-b border-gray-200 px-6">
                <div className="flex gap-1">
                  {(['medical', 'equipment', 'trainings'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab === 'medical' && 'Avize medicale'}
                      {tab === 'equipment' && 'Echipamente PSI'}
                      {tab === 'trainings' && 'Instruiri SSM'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Stats counters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900">{currentStats.total}</div>
                    <div className="text-xs text-gray-500 mt-1">Total</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="text-2xl font-bold text-green-700">{currentStats.valid}</div>
                    <div className="text-xs text-green-600 mt-1">Valide</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <div className="text-2xl font-bold text-orange-700">{currentStats.expiring}</div>
                    <div className="text-xs text-orange-600 mt-1">Expiră</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
                    <div className="text-2xl font-bold text-red-700">{currentStats.expired}</div>
                    <div className="text-xs text-red-600 mt-1">Expirate</div>
                  </div>
                </div>

                {/* Sample table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Angajat</th>
                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Data emitere</th>
                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Data expirare</th>
                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">Ion Popescu</td>
                        <td className="py-3 px-4 text-gray-600">15.01.2025</td>
                        <td className="py-3 px-4 text-gray-600">15.01.2026</td>
                        <td className="py-3 px-4"><StatusBadge status="valid" /></td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">Maria Ionescu</td>
                        <td className="py-3 px-4 text-gray-600">20.12.2024</td>
                        <td className="py-3 px-4 text-gray-600">28.02.2026</td>
                        <td className="py-3 px-4"><StatusBadge status="expiring" /></td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">Gheorghe Popa</td>
                        <td className="py-3 px-4 text-gray-600">10.10.2024</td>
                        <td className="py-3 px-4 text-gray-600">10.01.2026</td>
                        <td className="py-3 px-4"><StatusBadge status="expired" /></td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">Ana Vasile</td>
                        <td className="py-3 px-4 text-gray-600">05.11.2024</td>
                        <td className="py-3 px-4 text-gray-600">05.11.2025</td>
                        <td className="py-3 px-4"><StatusBadge status="valid" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Coloana dreapta - Info și activitate */}
          <div className="space-y-6">

            {/* Statistici rapide */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Statistici
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Angajați</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{DEMO_DATA.company.employees}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Conformitate</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{DEMO_DATA.company.score}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-gray-700">Alerte</span>
                  </div>
                  <span className="text-lg font-bold text-orange-600">{DEMO_DATA.alerts.length}</span>
                </div>
              </div>
            </div>

            {/* Activitate recentă */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                Activitate recentă
              </h3>
              <div className="space-y-3">
                {DEMO_DATA.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{activity.text}</p>
                      <p className="text-xs text-gray-400 mt-1">acum {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
              <h3 className="font-bold text-lg mb-2">Gata să începeți?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Creați-vă contul gratuit și digitalizați conformitatea SSM/PSI a companiei dumneavoastră.
              </p>
              <Link
                href="/register"
                className="block w-full text-center px-4 py-3 bg-white text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors shadow-lg"
              >
                Începeți acum
              </Link>
              <Link
                href="/login"
                className="block w-full text-center px-4 py-2 mt-2 text-white/90 hover:text-white text-sm transition-colors"
              >
                Am deja cont
              </Link>
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">De ce s-s-m.ro?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Conformitate automată</h3>
              <p className="text-sm text-gray-600">
                Urmăriți automat avizele medicale, echipamentele PSI și instruirile SSM. Primiți notificări înainte de expirare.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Rapoarte instant</h3>
              <p className="text-sm text-gray-600">
                Generați rapoarte SSM/PSI complete în câteva secunde. Export PDF pentru ITM și alte autorități.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Suport expert</h3>
              <p className="text-sm text-gray-600">
                Platforma dezvoltată de consultanți SSM cu 20+ ani experiență. Funcționalități validate de profesioniști.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2026 s-s-m.ro - Platformă SSM/PSI Digitală</p>
            <p className="mt-2">Dezvoltat de consultanți SSM pentru consultanți SSM</p>
          </div>
        </div>
      </div>
    </div>
  )
}
