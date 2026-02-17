'use client'

// app/[locale]/dashboard/reports/ReportsClient.tsx
// Componentă client pentru gestionarea rapoartelor PDF
// Data: 17 Februarie 2026

import { useState } from 'react'
import { Report, REPORT_TYPE_LABELS, ReportType } from '@/lib/types'

interface ReportsClientProps {
  user: { id: string; email: string }
  reports: Report[]
  organizations: Array<{ id: string; name: string; cui: string | null }>
  selectedOrgId?: string
}

export default function ReportsClient({
  user,
  reports: initialReports,
  organizations,
  selectedOrgId,
}: ReportsClientProps) {
  const [reports, setReports] = useState<Report[]>(initialReports)
  const [selectedOrg, setSelectedOrg] = useState(selectedOrgId || 'all')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showGenerateDialog, setShowGenerateDialog] = useState(false)
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('situatie_ssm')

  // Handle organization filter change
  const handleOrgChange = (orgId: string) => {
    setSelectedOrg(orgId)
    const params = new URLSearchParams()
    if (orgId !== 'all') params.set('org', orgId)
    window.location.href = `/dashboard/reports?${params.toString()}`
  }

  // Handle generate report
  const handleGenerateReport = async () => {
    if (selectedOrg === 'all') {
      alert('Vă rugăm selectați o organizație specifică')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization_id: selectedOrg,
          report_type: selectedReportType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Eroare la generare raport')
      }

      // Add new report to list
      setReports([data.report, ...reports])
      setShowGenerateDialog(false)
      alert('Raport generat cu succes!')
    } catch (error: any) {
      console.error('Generate report error:', error)
      alert('Eroare: ' + error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  // Handle view report (open in new tab)
  const handleViewReport = (report: Report) => {
    const newWindow = window.open('', '_blank')
    if (newWindow) {
      newWindow.document.write(report.html_content)
      newWindow.document.close()
    }
  }

  // Handle download PDF (print)
  const handleDownloadPDF = (report: Report) => {
    const newWindow = window.open('', '_blank')
    if (newWindow) {
      newWindow.document.write(report.html_content)
      newWindow.document.close()
      setTimeout(() => {
        newWindow.print()
      }, 500)
    }
  }

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📊 Rapoarte PDF Automate</h1>
              <p className="text-gray-600 mt-1">
                Generează și descarcă rapoarte SSM și PSI
              </p>
            </div>
            <button
              onClick={() => setShowGenerateDialog(true)}
              disabled={selectedOrg === 'all'}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Generează Raport Nou
            </button>
          </div>

          {/* Organization Filter */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrează după organizație
            </label>
            <select
              value={selectedOrg}
              onChange={(e) => handleOrgChange(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toate organizațiile</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} {org.cui ? `(${org.cui})` : ''}
                </option>
              ))}
            </select>
            {selectedOrg === 'all' && (
              <p className="text-sm text-amber-600 mt-2">
                ⚠️ Selectați o organizație pentru a putea genera rapoarte noi
              </p>
            )}
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {reports.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nu există rapoarte generate
              </h3>
              <p className="text-gray-600">
                Generați primul raport pentru a-l vedea aici
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Titlu Raport
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tip
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organizație
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data Generare
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acțiuni
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {report.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {REPORT_TYPE_LABELS[report.report_type as ReportType]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {report.organizations?.name || 'N/A'}
                        </div>
                        {report.organizations?.cui && (
                          <div className="text-xs text-gray-500">
                            CUI: {report.organizations.cui}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(report.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleViewReport(report)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          Vizualizează
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(report)}
                          className="text-green-600 hover:text-green-900 transition-colors"
                        >
                          Descarcă PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Generate Report Dialog */}
      {showGenerateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Generează Raport Nou
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tip Raport
              </label>
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value as ReportType)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(REPORT_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-900">
                <strong>Organizație selectată:</strong>{' '}
                {organizations.find((o) => o.id === selectedOrg)?.name || 'N/A'}
              </p>
              <p className="text-xs text-blue-700 mt-2">
                Raportul va include toate datele disponibile pentru această organizație.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowGenerateDialog(false)}
                disabled={isGenerating}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Anulează
              </button>
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isGenerating ? 'Generare...' : 'Generează'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
