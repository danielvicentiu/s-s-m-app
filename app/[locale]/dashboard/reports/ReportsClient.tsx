// app/dashboard/reports/ReportsClient.tsx
// Pagină Rapoarte — 6 carduri raport cu export PDF/CSV
// Carduri: Conformitate SSM, Instruiri, Medical, Echipamente, Alerte, Activitate

'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import {
  FileText,
  GraduationCap,
  Stethoscope,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Download,
  ArrowLeft,
  FileSpreadsheet
} from 'lucide-react'

interface Props {
  user: { id: string; email: string }
  organizations: Array<{ id: string; name: string; cui: string }>
}

interface ReportCard {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  bgColor: string
  metrics?: {
    label: string
    value: string | number
  }[]
}

export default function ReportsClient({ user, organizations }: Props) {
  const router = useRouter()
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState<string | null>(null)

  // Definirea cardurilor de rapoarte
  const reportCards: ReportCard[] = [
    {
      id: 'conformitate-ssm',
      title: 'Conformitate SSM',
      description: 'Raport complet privind conformitatea cu legislația SSM',
      icon: <ShieldCheck className="h-8 w-8" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      metrics: [
        { label: 'Nivel conformitate', value: '87%' },
        { label: 'Documente lipsă', value: '3' },
        { label: 'Actualizări necesare', value: '5' }
      ]
    },
    {
      id: 'instruiri',
      title: 'Instruiri',
      description: 'Situația instruirilor SSM și PSI pe angajați',
      icon: <GraduationCap className="h-8 w-8" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      metrics: [
        { label: 'Angajați instruiți', value: '142' },
        { label: 'Instruiri expirate', value: '8' },
        { label: 'Instruiri această lună', value: '23' }
      ]
    },
    {
      id: 'medical',
      title: 'Medical',
      description: 'Evidența controlurilor medicale periodice',
      icon: <Stethoscope className="h-8 w-8" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      metrics: [
        { label: 'Controale valabile', value: '156' },
        { label: 'Expiră în 30 zile', value: '12' },
        { label: 'Restricții medicale', value: '4' }
      ]
    },
    {
      id: 'echipamente',
      title: 'Echipamente',
      description: 'Starea echipamentelor PSI și verificările tehnice',
      icon: <FileText className="h-8 w-8" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      metrics: [
        { label: 'Total echipamente', value: '89' },
        { label: 'Verificări expirate', value: '6' },
        { label: 'Verificări în 60 zile', value: '15' }
      ]
    },
    {
      id: 'alerte',
      title: 'Alerte',
      description: 'Centralizator alerte active și istorice',
      icon: <AlertTriangle className="h-8 w-8" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      metrics: [
        { label: 'Alerte active', value: '18' },
        { label: 'Urgente (< 7 zile)', value: '5' },
        { label: 'Atenționări', value: '13' }
      ]
    },
    {
      id: 'activitate',
      title: 'Activitate',
      description: 'Jurnal activități și modificări în sistem',
      icon: <Activity className="h-8 w-8" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      metrics: [
        { label: 'Acțiuni astăzi', value: '47' },
        { label: 'Utilizatori activi', value: '12' },
        { label: 'Documente create', value: '8' }
      ]
    }
  ]

  async function handleExportPDF(reportId: string) {
    setIsExporting(`${reportId}-pdf`)

    try {
      // TODO: Implementare export PDF
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Exporting PDF for:', reportId)

      // Placeholder: în viitor se va apela API pentru generare PDF
      alert(`Export PDF pentru ${reportCards.find(r => r.id === reportId)?.title} va fi disponibil în curând`)
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Eroare la export PDF')
    } finally {
      setIsExporting(null)
    }
  }

  async function handleExportCSV(reportId: string) {
    setIsExporting(`${reportId}-csv`)

    try {
      // TODO: Implementare export CSV
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Exporting CSV for:', reportId)

      // Placeholder: în viitor se va apela API pentru generare CSV
      alert(`Export CSV pentru ${reportCards.find(r => r.id === reportId)?.title} va fi disponibil în curând`)
    } catch (error) {
      console.error('Error exporting CSV:', error)
      alert('Eroare la export CSV')
    } finally {
      setIsExporting(null)
    }
  }

  function handleCardClick(reportId: string) {
    // TODO: Naviga la pagina detaliată a raportului
    setSelectedReport(reportId)
    console.log('Opening detailed report:', reportId)

    // Placeholder: în viitor se va naviga la rută dedicată
    alert(`Vizualizare detaliată raport ${reportCards.find(r => r.id === reportId)?.title} va fi disponibilă în curând`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/dashboard')}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Înapoi la Dashboard</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Rapoarte</h1>
            <p className="text-gray-600 mt-1">
              Generează și exportă rapoarte pentru toate modulele platformei
            </p>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportCards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            {/* Card Header */}
            <div className={`${card.bgColor} p-6 cursor-pointer`} onClick={() => handleCardClick(card.id)}>
              <div className="flex items-start gap-4">
                <div className={`${card.color} flex-shrink-0`}>
                  {card.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Metrics */}
            {card.metrics && (
              <div className="p-6 border-t border-gray-100">
                <div className="space-y-3">
                  {card.metrics.map((metric, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{metric.label}</span>
                      <span className="text-sm font-semibold text-gray-900">{metric.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Export Buttons */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleExportPDF(card.id)
                }}
                disabled={isExporting === `${card.id}-pdf`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4" />
                {isExporting === `${card.id}-pdf` ? 'Se exportă...' : 'PDF'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleExportCSV(card.id)
                }}
                disabled={isExporting === `${card.id}-csv`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileSpreadsheet className="h-4 w-4" />
                {isExporting === `${card.id}-csv` ? 'Se exportă...' : 'CSV'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Footer */}
      <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 mt-0.5">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              Rapoartele sunt în curs de dezvoltare
            </h4>
            <p className="text-sm text-blue-700">
              Metricile afișate sunt demonstrative. Funcționalitatea completă de generare
              rapoarte și export va fi disponibilă în următoarea versiune.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
