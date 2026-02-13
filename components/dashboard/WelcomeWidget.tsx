'use client'

import { UserCircle, AlertTriangle, TrendingUp, UserPlus, Calendar, FileText } from 'lucide-react'
import { useEffect, useState } from 'react'

interface WelcomeWidgetProps {
  userName: string
  activeAlertsCount: number
  complianceScore: number
  onAddEmployee?: () => void
  onScheduleTraining?: () => void
  onViewReport?: () => void
}

export function WelcomeWidget({
  userName,
  activeAlertsCount,
  complianceScore,
  onAddEmployee,
  onScheduleTraining,
  onViewReport
}: WelcomeWidgetProps) {
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()

    if (hour >= 5 && hour < 12) {
      setGreeting('Bună dimineața')
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Bună ziua')
    } else if (hour >= 18 && hour < 22) {
      setGreeting('Bună seara')
    } else {
      setGreeting('Bună')
    }
  }, [])

  // Determină culoarea pentru scorul de conformitate
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-50'
    if (score >= 70) return 'bg-orange-50'
    return 'bg-red-50'
  }

  // Extrage prenumele
  const firstName = userName.split(' ')[0] || userName

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header cu gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-2">
              {greeting}, {firstName}!
            </h1>
            <p className="text-blue-100 text-sm">
              Bine ai revenit pe platforma SSM
            </p>
          </div>
          <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm">
            <UserCircle className="w-10 h-10 text-white" />
          </div>
        </div>
      </div>

      {/* Statistici principale */}
      <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Alerte active */}
          <div className="flex items-start gap-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
              activeAlertsCount > 0 ? 'bg-orange-100' : 'bg-green-100'
            }`}>
              <AlertTriangle className={`w-5 h-5 ${
                activeAlertsCount > 0 ? 'text-orange-600' : 'text-green-600'
              }`} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-0.5">Alerte active</p>
              <p className="text-2xl font-bold text-gray-900">{activeAlertsCount}</p>
            </div>
          </div>

          {/* Scor conformitate */}
          <div className="flex items-start gap-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${getScoreBgColor(complianceScore)}`}>
              <TrendingUp className={`w-5 h-5 ${getScoreColor(complianceScore)}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-0.5">Scor conformitate</p>
              <p className={`text-2xl font-bold ${getScoreColor(complianceScore)}`}>
                {complianceScore}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Acțiuni rapide */}
      <div className="px-6 py-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Acțiuni rapide</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Adaugă angajat */}
          {onAddEmployee && (
            <button
              onClick={onAddEmployee}
              className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all group"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                <UserPlus className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                Adaugă angajat
              </span>
            </button>
          )}

          {/* Programează instruire */}
          {onScheduleTraining && (
            <button
              onClick={onScheduleTraining}
              className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all group"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">
                Programează instruire
              </span>
            </button>
          )}

          {/* Vezi raport */}
          {onViewReport && (
            <button
              onClick={onViewReport}
              className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all group"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-50 group-hover:bg-green-100 transition-colors">
                <FileText className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">
                Vezi raport
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
