// app/[locale]/dashboard/settings/billing/BillingClient.tsx
// Client component — pagină facturare cu planuri, istoric, acțiuni

'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import {
  ArrowLeft,
  CreditCard,
  Calendar,
  Download,
  AlertTriangle,
  CheckCircle2,
  Package,
  Clock,
  FileText
} from 'lucide-react'

interface PaymentMethod {
  type: 'card'
  last4: string
  brand: string
  expiryMonth: number
  expiryYear: number
}

interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  description: string
  pdfUrl: string
}

interface BillingData {
  currentPlan: string
  planPrice: number
  currency: string
  billingCycle: string
  nextPaymentDate: string
  paymentMethod: PaymentMethod
  invoices: Invoice[]
}

interface Props {
  user: User
  organizationId: string | null
  billingData: BillingData
}

export default function BillingClient({ user, organizationId, billingData }: Props) {
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showChangePlanDialog, setShowChangePlanDialog] = useState(false)

  // Format date helper
  function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ro-RO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  // Format currency helper
  function formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  // Handler pentru download PDF factură
  function handleDownloadInvoice(invoice: Invoice) {
    // Placeholder — în viitor Stripe API sau generare PDF server-side
    alert(`Se descarcă factura ${invoice.id}`)
  }

  // Handler pentru schimbare plan
  function handleChangePlan() {
    setShowChangePlanDialog(true)
  }

  // Handler pentru anulare abonament
  function handleCancelSubscription() {
    setShowCancelDialog(true)
  }

  // Confirmă anulare
  function confirmCancel() {
    // Placeholder — în viitor API call către Stripe/DB
    alert('Abonamentul va fi anulat la sfârșitul perioadei curente de facturare.')
    setShowCancelDialog(false)
  }

  // Status badge pentru facturi
  function InvoiceStatusBadge({ status }: { status: Invoice['status'] }) {
    const config = {
      paid: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500', label: 'Plătită' },
      pending: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500', label: 'În așteptare' },
      failed: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', label: 'Eșuată' }
    }

    const c = config[status]

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
        {c.label}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Facturare și abonament</h1>
            <p className="text-sm text-gray-500">
              Gestionează planul tău, metodele de plată și istoricul facturilor
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-8 space-y-6">
        {/* Plan curent */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Plan curent</h2>
                <p className="text-sm text-gray-500">Abonament activ</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl font-semibold text-sm">
              <CheckCircle2 className="h-4 w-4" />
              Activ
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Plan detalii */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
              <div className="text-sm text-blue-700 font-semibold mb-2">Plan</div>
              <div className="text-2xl font-black text-blue-900 mb-1">{billingData.currentPlan}</div>
              <div className="text-blue-700 font-semibold">
                {formatCurrency(billingData.planPrice, billingData.currency)}/{billingData.billingCycle}
              </div>
            </div>

            {/* Următoarea plată */}
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600 font-semibold mb-2">
                <Calendar className="h-4 w-4" />
                Următoarea plată
              </div>
              <div className="text-lg font-bold text-gray-900 mb-1">
                {formatDate(billingData.nextPaymentDate)}
              </div>
              <div className="text-sm text-gray-600">
                {formatCurrency(billingData.planPrice, billingData.currency)}
              </div>
            </div>

            {/* Metodă plată */}
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600 font-semibold mb-2">
                <CreditCard className="h-4 w-4" />
                Metodă de plată
              </div>
              <div className="text-lg font-bold text-gray-900 mb-1">
                {billingData.paymentMethod.brand} •••• {billingData.paymentMethod.last4}
              </div>
              <div className="text-sm text-gray-600">
                Expiră {billingData.paymentMethod.expiryMonth}/{billingData.paymentMethod.expiryYear}
              </div>
            </div>
          </div>

          {/* Acțiuni plan */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={handleChangePlan}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              Schimbă planul
            </button>
            <button
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Actualizează metoda de plată
            </button>
            <button
              onClick={handleCancelSubscription}
              className="px-6 py-3 bg-white text-red-600 border-2 border-red-200 rounded-xl font-semibold hover:bg-red-50 transition flex items-center gap-2 ml-auto"
            >
              <AlertTriangle className="h-4 w-4" />
              Anulează abonamentul
            </button>
          </div>
        </div>

        {/* Istoric facturi */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gray-100 rounded-xl">
              <FileText className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Istoric facturi</h2>
              <p className="text-sm text-gray-500">Toate facturile tale anterioare</p>
            </div>
          </div>

          {/* Tabel facturi */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-bold text-gray-600 uppercase tracking-wide pb-3">
                    Număr factură
                  </th>
                  <th className="text-left text-xs font-bold text-gray-600 uppercase tracking-wide pb-3">
                    Data
                  </th>
                  <th className="text-left text-xs font-bold text-gray-600 uppercase tracking-wide pb-3">
                    Descriere
                  </th>
                  <th className="text-right text-xs font-bold text-gray-600 uppercase tracking-wide pb-3">
                    Sumă
                  </th>
                  <th className="text-center text-xs font-bold text-gray-600 uppercase tracking-wide pb-3">
                    Status
                  </th>
                  <th className="text-right text-xs font-bold text-gray-600 uppercase tracking-wide pb-3">
                    Acțiuni
                  </th>
                </tr>
              </thead>
              <tbody>
                {billingData.invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-4">
                      <div className="font-semibold text-gray-900">{invoice.id}</div>
                    </td>
                    <td className="py-4">
                      <div className="text-gray-600">{formatDate(invoice.date)}</div>
                    </td>
                    <td className="py-4">
                      <div className="text-gray-600 text-sm">{invoice.description}</div>
                    </td>
                    <td className="py-4 text-right">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(invoice.amount, billingData.currency)}
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <InvoiceStatusBadge status={invoice.status} />
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleDownloadInvoice(invoice)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Download className="h-4 w-4" />
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {billingData.invoices.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Nu există facturi în istoric</p>
            </div>
          )}
        </div>

        {/* Info card */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
          <div className="flex gap-3">
            <Clock className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-blue-900 mb-1">Facturare automată</h3>
              <p className="text-sm text-blue-700">
                Abonamentul tău se reînnoiește automat la sfârșitul fiecărei perioade de facturare.
                Vei primi o factură proforma cu 3 zile înainte de data plății.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Dialog schimbare plan */}
      {showChangePlanDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Schimbă planul</h2>
            <p className="text-gray-600 mb-6">
              Selectează un plan nou pentru organizația ta. Modificările vor intra în vigoare imediat,
              iar diferența de preț va fi calculată proporțional.
            </p>

            {/* Placeholder planuri disponibile */}
            <div className="space-y-3 mb-6">
              <div className="p-4 border-2 border-blue-600 bg-blue-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900">Professional</div>
                    <div className="text-sm text-gray-600">299 RON/lună • Plan curent</div>
                  </div>
                  <div className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg">
                    Activ
                  </div>
                </div>
              </div>
              <div className="p-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900">Enterprise</div>
                    <div className="text-sm text-gray-600">599 RON/lună • Funcții avansate</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowChangePlanDialog(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Anulează
              </button>
              <button
                onClick={() => {
                  alert('Funcționalitate în dezvoltare - integrare Stripe')
                  setShowChangePlanDialog(false)
                }}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Confirmă schimbarea
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog anulare abonament */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Anulează abonamentul?</h2>
            </div>

            <p className="text-gray-600 mb-6">
              Ești sigur că vrei să anulezi abonamentul? Vei păstra accesul până la data de{' '}
              <strong>{formatDate(billingData.nextPaymentDate)}</strong>, după care contul va fi
              dezactivat.
            </p>

            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-orange-800">
                <strong>Atenție:</strong> Datele tale vor fi păstrate timp de 30 de zile după anulare.
                Poți reactiva abonamentul oricând în această perioadă.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Renunță
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
              >
                Da, anulează
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
