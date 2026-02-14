'use client'

import { useEffect, useCallback, useRef } from 'react'
import { Lock, X, Sparkles, Check, ArrowRight } from 'lucide-react'
import { pricingPlans, type PricingPlan } from '@/lib/data/pricing-plans'
import Link from 'next/link'

interface UpgradePromptProps {
  feature: string
  currentPlan: 'free' | 'start' | 'pro' | 'enterprise'
  requiredPlan: 'start' | 'pro' | 'enterprise'
  isOpen: boolean
  onClose: () => void
}

export function UpgradePrompt({
  feature,
  currentPlan,
  requiredPlan,
  isOpen,
  onClose,
}: UpgradePromptProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      closeButtonRef.current?.focus()
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  const currentPlanData = pricingPlans.find((p) => p.id === currentPlan)
  const requiredPlanData = pricingPlans.find((p) => p.id === requiredPlan)

  if (!currentPlanData || !requiredPlanData) return null

  // Extrage beneficiile principale ale planului necesar
  const mainBenefits = requiredPlanData.features.slice(0, 4)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-dialog-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-0 overflow-hidden">
        {/* Header gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
          {/* Close button */}
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            aria-label="Închide"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Lock icon */}
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>

          {/* Title */}
          <h3
            id="upgrade-dialog-title"
            className="text-2xl font-bold text-center mb-2"
          >
            Această funcționalitate necesită planul {requiredPlanData.name}
          </h3>

          {/* Feature name */}
          <p className="text-center text-white/90 text-sm">
            {feature}
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Description */}
          <div className="mb-6">
            <div className="flex items-start gap-3 mb-4">
              <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                Upgrade la planul <span className="font-semibold text-blue-600">{requiredPlanData.name}</span>{' '}
                pentru a debloca această funcționalitate și multe altele care te vor ajuta să gestionezi
                compliance-ul mai eficient.
              </p>
            </div>
          </div>

          {/* Main benefits */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Beneficii incluse în {requiredPlanData.name}:
            </p>
            <ul className="space-y-2">
              {mainBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Comparison */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Planul curent</p>
                <p className="text-lg font-semibold text-gray-900">{currentPlanData.name}</p>
                <p className="text-xs text-gray-600">
                  {currentPlanData.price.monthly === 0
                    ? 'Gratuit'
                    : `${currentPlanData.price.monthly} RON/lună`}
                </p>
              </div>

              <ArrowRight className="w-5 h-5 text-gray-400 mx-3" />

              <div className="flex-1">
                <p className="text-xs text-blue-600 mb-1">Upgrade la</p>
                <p className="text-lg font-semibold text-blue-600">{requiredPlanData.name}</p>
                <p className="text-xs text-gray-600">
                  {requiredPlanData.price.monthly === 0
                    ? 'La cerere'
                    : `${requiredPlanData.price.monthly} RON/lună`}
                </p>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col gap-3">
            <Link
              href="/dashboard/billing"
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Upgrade acum
            </Link>

            <Link
              href="/pricing"
              className="w-full px-6 py-3 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors text-center"
            >
              Află mai multe despre planuri
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
