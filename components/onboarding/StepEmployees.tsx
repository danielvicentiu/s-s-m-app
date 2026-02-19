'use client'

import { StepWrapper } from './StepWrapper'

const RANGES = [
  { value: '1-5', label: '1–5', description: 'Micro' },
  { value: '6-10', label: '6–10', description: 'Mică' },
  { value: '11-20', label: '11–20', description: 'Mică' },
  { value: '21-50', label: '21–50', description: 'Medie' },
  { value: '51-100', label: '51–100', description: 'Medie' },
  { value: '100+', label: '100+', description: 'Mare' },
]

interface Props {
  value: string
  onChange: (range: string) => void
  onNext: () => void
  onBack: () => void
}

export function StepEmployees({ value, onChange, onNext, onBack }: Props) {
  return (
    <StepWrapper
      title="Câți angajați aveți?"
      subtitle="Selectați intervalul aproximativ. Puteți modifica oricând."
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value}
    >
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {RANGES.map((range) => {
          const isSelected = value === range.value
          return (
            <button
              key={range.value}
              type="button"
              onClick={() => onChange(range.value)}
              className={`flex flex-col items-center justify-center rounded-xl border-2 px-3 py-5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                isSelected
                  ? 'border-blue-600 bg-blue-600 text-white shadow-lg scale-105'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <span className={`text-2xl font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                {range.label}
              </span>
              <span
                className={`mt-1 text-xs font-medium ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}
              >
                {range.description}
              </span>
            </button>
          )
        })}
      </div>
    </StepWrapper>
  )
}
