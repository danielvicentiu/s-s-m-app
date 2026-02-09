'use client'

import { CountryCode, COUNTRY_FLAGS, COUNTRY_NAMES } from '@/lib/types'
import { Globe } from 'lucide-react'

interface Props {
  value: CountryCode | 'ALL'
  onChange: (country: CountryCode | 'ALL') => void
  className?: string
}

const COUNTRIES: Array<CountryCode | 'ALL'> = ['ALL', 'RO', 'BG', 'HU', 'DE', 'PL']

export default function CountryFilter({ value, onChange, className = '' }: Props) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className="h-4 w-4 text-gray-400" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as CountryCode | 'ALL')}
        className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors"
      >
        {COUNTRIES.map((code) => (
          <option key={code} value={code}>
            {COUNTRY_FLAGS[code]} {code === 'ALL' ? 'Toate țările' : COUNTRY_NAMES[code as CountryCode]}
          </option>
        ))}
      </select>
    </div>
  )
}
