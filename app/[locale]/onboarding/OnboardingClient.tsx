'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ProgressBar } from '@/components/onboarding/ProgressBar'
import { StepActivity } from '@/components/onboarding/StepActivity'
import { StepEmployees } from '@/components/onboarding/StepEmployees'
import { StepCompany } from '@/components/onboarding/StepCompany'
import { StepConfirm } from '@/components/onboarding/StepConfirm'
import type { CaenActivity } from '@/data/caen-activities'
import type { CompanyFormData } from '@/components/onboarding/StepCompany'

const STEP_LABELS = ['Activitate', 'Angajați', 'Date firmă', 'Confirmare']

interface Props {
  user: { id: string; email: string }
}

export default function OnboardingClient({ user }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')

  // Step 1
  const [activities, setActivities] = useState<CaenActivity[]>([])

  // Step 2
  const [employeeRange, setEmployeeRange] = useState('')

  // Step 3
  const [company, setCompany] = useState<CompanyFormData>({
    name: '',
    cui: '',
    address: '',
    county: '',
    caen_code: '',
    tva: false,
    email: user.email,
    phone: '',
  })

  const goNext = useCallback(() => {
    setDirection('forward')
    setStep((s) => Math.min(s + 1, 4))
  }, [])

  const goBack = useCallback(() => {
    setDirection('back')
    setStep((s) => Math.max(s - 1, 1))
  }, [])

  const handleComplete = async () => {
    const res = await fetch('/api/onboarding/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        activities: activities.map((a) => ({ code: a.code, label: a.label_ro })),
        employee_range: employeeRange,
        company: {
          name: company.name || undefined,
          cui: company.cui || undefined,
          address: company.address || undefined,
          county: company.county || undefined,
          caen_code: company.caen_code || undefined,
          tva: company.tva,
        },
        email: company.email || user.email,
        phone: company.phone || undefined,
      }),
    })

    const data = await res.json()

    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Eroare la finalizare.')
    }

    // Redirect after short delay (let animation play)
    setTimeout(() => {
      router.push(data.redirect || '/dashboard')
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-center border-b border-gray-200 bg-white px-6 py-4">
        <span className="text-lg font-extrabold tracking-tight text-gray-900">
          s-s-m<span className="text-blue-600">.ro</span>
        </span>
      </header>

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-8 sm:px-6">
        {/* Progress bar */}
        <div className="mb-10">
          <ProgressBar currentStep={step} steps={STEP_LABELS} />
        </div>

        {/* Step card */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 sm:p-8">
          <div
            key={step}
            style={{
              animation: `${direction === 'forward' ? 'slideInRight' : 'slideInLeft'} 250ms both`,
            }}
          >
            {step === 1 && (
              <StepActivity selected={activities} onChange={setActivities} onNext={goNext} />
            )}
            {step === 2 && (
              <StepEmployees
                value={employeeRange}
                onChange={setEmployeeRange}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {step === 3 && (
              <StepCompany
                data={company}
                onChange={setCompany}
                onNext={goNext}
                onBack={goBack}
                userEmail={user.email}
              />
            )}
            {step === 4 && (
              <StepConfirm
                activities={activities}
                employeeRange={employeeRange}
                company={company}
                onBack={goBack}
                onConfirm={handleComplete}
              />
            )}
          </div>
        </div>

        {/* Skip option for step 3 */}
        {step === 3 && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={goNext}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
            >
              Sari peste — completez mai târziu
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
