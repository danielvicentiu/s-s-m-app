'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Calculator, AlertTriangle, CheckCircle, XCircle, ChevronRight, RotateCcw } from 'lucide-react'

interface FormData {
  caen: string
  employees: string
  hazardous: boolean | null
  height: boolean | null
  pressure: boolean | null
  evacuation: boolean | null
}

type RiskLevel = 'low' | 'medium' | 'high' | 'veryHigh'

const CAEN_RISK_SCORES: Record<string, number> = {
  construction: 40,
  manufacturing: 30,
  transport: 25,
  services: 10,
  retail: 10,
  hospitality: 15,
  it: 5,
  health: 20,
  education: 5,
  other: 15,
}

export default function CalculatorRiscPage() {
  const t = useTranslations('calculatorRisc')
  const [formData, setFormData] = useState<FormData>({
    caen: '',
    employees: '',
    hazardous: null,
    height: null,
    pressure: null,
    evacuation: null,
  })
  const [showResults, setShowResults] = useState(false)

  const handleInputChange = (field: keyof FormData, value: string | boolean | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const calculateRiskScore = (): number => {
    let score = 0

    // Base score from CAEN domain (0-40 points)
    if (formData.caen) {
      score += CAEN_RISK_SCORES[formData.caen] || 15
    }

    // Employee count impact (0-20 points)
    const employeeCount = parseInt(formData.employees) || 0
    if (employeeCount > 0) {
      if (employeeCount < 10) score += 5
      else if (employeeCount < 50) score += 10
      else if (employeeCount < 100) score += 15
      else score += 20
    }

    // Hazardous substances (+15 points)
    if (formData.hazardous === true) score += 15

    // Work at height (+10 points)
    if (formData.height === true) score += 10

    // Pressure equipment (+10 points)
    if (formData.pressure === true) score += 10

    // No evacuation plan (-5 points protection, adds risk)
    if (formData.evacuation === false) score += 5

    return Math.min(score, 100)
  }

  const getRiskLevel = (score: number): RiskLevel => {
    if (score < 30) return 'low'
    if (score < 55) return 'medium'
    if (score < 75) return 'high'
    return 'veryHigh'
  }

  const isFormValid = () => {
    return (
      formData.caen !== '' &&
      formData.employees !== '' &&
      formData.hazardous !== null &&
      formData.height !== null &&
      formData.pressure !== null &&
      formData.evacuation !== null
    )
  }

  const handleCalculate = () => {
    if (isFormValid()) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setFormData({
      caen: '',
      employees: '',
      hazardous: null,
      height: null,
      pressure: null,
      evacuation: null,
    })
    setShowResults(false)
  }

  const score = calculateRiskScore()
  const level = getRiskLevel(score)

  const getLevelColor = (l: RiskLevel) => {
    switch (l) {
      case 'low':
        return 'text-green-600'
      case 'medium':
        return 'text-yellow-600'
      case 'high':
        return 'text-orange-600'
      case 'veryHigh':
        return 'text-red-600'
    }
  }

  const getLevelBgColor = (l: RiskLevel) => {
    switch (l) {
      case 'low':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'veryHigh':
        return 'bg-red-100 text-red-800'
    }
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('results.title')}
              </h1>
              <div className="flex items-center justify-center mb-6">
                <div className={`text-6xl md:text-7xl font-bold ${getLevelColor(level)}`}>
                  {score}
                  <span className="text-3xl md:text-4xl text-gray-400">/100</span>
                </div>
              </div>
              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold ${getLevelBgColor(level)}`}>
                {level === 'low' ? (
                  <CheckCircle className="w-6 h-6" />
                ) : level === 'veryHigh' ? (
                  <XCircle className="w-6 h-6" />
                ) : (
                  <AlertTriangle className="w-6 h-6" />
                )}
                {t(`results.level.${level}`)}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <p className="text-gray-700 text-center leading-relaxed mb-4">
                {t(`results.description.${level}`)}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('results.recommendations.title')}
              </h2>
              <div className="bg-blue-50 rounded-xl p-6">
                <ul className="space-y-3">
                  {(t.raw(`results.recommendations.${level}`) as string[]).map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 md:p-8 mb-8 text-white">
              <h3 className="text-2xl font-bold mb-2">{t('cta.title')}</h3>
              <p className="text-blue-100 mb-4">{t('cta.description')}</p>
              <a
                href="/auth/signup"
                className="inline-block bg-white text-blue-600 font-semibold py-3 px-6 rounded-xl hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
              >
                {t('cta.button')}
                <ChevronRight className="inline-block ml-2 w-5 h-5" />
              </a>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleReset}
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-center font-semibold py-4 px-6 rounded-xl transition-colors"
              >
                <RotateCcw className="inline-block mr-2 w-5 h-5" />
                {t('reset')}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            {t('badge')}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Calculator className="w-6 h-6 text-blue-600" />
            {t('formTitle')}
          </h2>

          <div className="space-y-6">
            {/* CAEN Domain */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('fields.caen.label')}
              </label>
              <select
                value={formData.caen}
                onChange={(e) => handleInputChange('caen', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="">{t('fields.caen.placeholder')}</option>
                {Object.keys(CAEN_RISK_SCORES).map((key) => (
                  <option key={key} value={key}>
                    {t(`caenOptions.${key}`)}
                  </option>
                ))}
              </select>
            </div>

            {/* Number of Employees */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('fields.employees.label')}
              </label>
              <input
                type="number"
                min="1"
                value={formData.employees}
                onChange={(e) => handleInputChange('employees', e.target.value)}
                placeholder={t('fields.employees.placeholder')}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Hazardous Substances */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('fields.hazardous.label')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleInputChange('hazardous', true)}
                  className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                    formData.hazardous === true
                      ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-md'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {t('fields.hazardous.yes')}
                </button>
                <button
                  onClick={() => handleInputChange('hazardous', false)}
                  className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                    formData.hazardous === false
                      ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-md'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {t('fields.hazardous.no')}
                </button>
              </div>
            </div>

            {/* Work at Height */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('fields.height.label')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleInputChange('height', true)}
                  className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                    formData.height === true
                      ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-md'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {t('fields.height.yes')}
                </button>
                <button
                  onClick={() => handleInputChange('height', false)}
                  className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                    formData.height === false
                      ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-md'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {t('fields.height.no')}
                </button>
              </div>
            </div>

            {/* Pressure Equipment */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('fields.pressure.label')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleInputChange('pressure', true)}
                  className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                    formData.pressure === true
                      ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-md'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {t('fields.pressure.yes')}
                </button>
                <button
                  onClick={() => handleInputChange('pressure', false)}
                  className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                    formData.pressure === false
                      ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-md'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {t('fields.pressure.no')}
                </button>
              </div>
            </div>

            {/* Evacuation Plan */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('fields.evacuation.label')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleInputChange('evacuation', true)}
                  className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                    formData.evacuation === true
                      ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-md'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {t('fields.evacuation.yes')}
                </button>
                <button
                  onClick={() => handleInputChange('evacuation', false)}
                  className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                    formData.evacuation === false
                      ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-md'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {t('fields.evacuation.no')}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleCalculate}
              disabled={!isFormValid()}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                isFormValid()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Calculator className="w-5 h-5" />
              {t('calculate')}
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          {t('footer')}
        </div>
      </div>
    </div>
  )
}
