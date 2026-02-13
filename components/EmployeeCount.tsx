'use client'

interface Props {
  count: string
  onChange: (count: string) => void
  maxEmployees?: number | null
}

export default function EmployeeCount({ count, onChange, maxEmployees }: Props) {
  const ranges = ['0', '1-5', '6-10', '11-20', '21-50', '50+']

  const getFilteredRanges = () => {
    if (!maxEmployees) {return ranges}

    // Filter based on maxEmployees restriction
    return ranges.filter((range) => {
      if (range === '0') {return true}
      if (range === '50+') {return maxEmployees >= 50}

      const max = parseInt(range.split('-')[1] || range)
      return max <= maxEmployees
    })
  }

  const filteredRanges = getFilteredRanges()

  return (
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2">
        Câți angajați ai?
      </label>
      <p className="text-xs text-gray-500 mb-3">
        Opțional — va fi presetat pe baza formei de organizare
      </p>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {filteredRanges.map((range) => (
          <button
            key={range}
            onClick={() => onChange(range)}
            className={`px-4 py-3 rounded-lg font-semibold transition-all ${
              count === range
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-[#1a2332] text-gray-400 border border-gray-700 hover:border-blue-500 hover:text-white'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {count === '0' && (
        <div className="mt-3 bg-yellow-600/10 border border-yellow-500/30 rounded-lg px-4 py-2">
          <p className="text-sm text-yellow-200">
            <strong>0 angajați:</strong> Fără salariați — pentru PFA/SRL cu asociat unic care
            lucrează doar pe dividende. Rămân obligații proprii (SSM, PSI, stingătoare).
          </p>
        </div>
      )}

      {maxEmployees && count && (
        <div className="mt-2 text-xs text-gray-500">
          {maxEmployees === 3 && '⚠️ PFA: maxim 3 angajați conform legii'}
          {maxEmployees === 8 && '⚠️ II: maxim 8 angajați'}
        </div>
      )}
    </div>
  )
}
