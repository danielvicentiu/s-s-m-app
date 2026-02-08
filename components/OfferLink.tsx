'use client'

import { useState } from 'react'
import { Send, ExternalLink } from 'lucide-react'

interface Props {
  activityId: string | null
  employeeCount: string
  orgType: string
}

export default function OfferLink({ activityId, employeeCount, orgType }: Props) {
  const [cui, setCui] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const [offerLink, setOfferLink] = useState('')

  const handleGenerateLink = async () => {
    if (!activityId) {
      alert('Selectează mai întâi o activitate')
      return
    }

    setLoading(true)

    // Generate unique ID
    const linkId = Math.random().toString(36).substring(2, 15)
    const params = new URLSearchParams({
      activity: activityId,
      employees: employeeCount,
      org: orgType,
      ...(cui && { cui }),
    })

    const generatedLink = `${window.location.origin}/oferta/${linkId}?${params.toString()}`
    setOfferLink(generatedLink)

    // Show reward message if CUI provided
    if (cui) {
      setShowReward(true)
      // TODO: Optional - fetch ANAF data and recalculate with real CAEN
    }

    setLoading(false)
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Bună! Vreau o ofertă pentru conformitate SSM/PSI.\n\nActivitate: ${activityId}\nAngajați: ${employeeCount}\n${cui ? `CUI: ${cui}` : ''}`
    )
    window.open(`https://wa.me/40700000000?text=${message}`, '_blank')
  }

  return (
    <div className="mt-12 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-2 border-blue-500/30 rounded-2xl p-8">
      <h3 className="text-2xl font-black text-white mb-2 text-center">
        Primește oferta ta personalizată
      </h3>
      <p className="text-gray-400 text-center mb-6">
        OPȚIONAL — lasă datele doar dacă vrei ofertă exactă pe firma ta
      </p>

      {showReward && (
        <div className="mb-6 bg-green-600/20 border-2 border-green-500/50 rounded-xl p-6 text-center">
          <h4 className="text-xl font-black text-green-300 mb-2">
            ✨ Oferta ta — EXACT ce ai nevoie
          </h4>
          <p className="text-green-200 text-sm">
            Personalizată și pliată STRICT pe obligațiile tale.
            <br />
            Nimic în plus, nimic în minus.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* CUI Field */}
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">
            CUI firmă (opțional)
          </label>
          <input
            type="text"
            value={cui}
            onChange={(e) => setCui(e.target.value)}
            placeholder="RO12345678"
            className="w-full bg-[#1a2332] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Vrei oferta exactă pe firma ta? Datele se auto-completează de la ANAF.
          </p>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">
            Email (opțional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contact@firma.ro"
            className="w-full bg-[#1a2332] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Pentru trimitere link ofertă</p>
        </div>

        {/* Phone Field */}
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-300 mb-2">
            Telefon/WhatsApp (opțional)
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+40 700 000 000"
            className="w-full bg-[#1a2332] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Te contactăm doar când vrei tu
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={handleGenerateLink}
          disabled={loading || !activityId}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <Send className="w-5 h-5" />
          {loading ? 'Generez...' : 'Primește oferta ta'}
        </button>

        <button
          onClick={handleWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Scrie-ne acum!
        </button>
      </div>

      {offerLink && (
        <div className="mt-6 bg-[#1a2332] border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={offerLink}
              readOnly
              className="flex-1 bg-[#0B1120] border border-gray-700 rounded-lg px-4 py-2 text-white text-sm"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(offerLink)
                alert('Link copiat!')
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Copiază
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Link-ul expiră în 7 zile. Poți să-l trimiți pe WhatsApp sau email.
          </p>
        </div>
      )}

      <div className="mt-6 text-center text-xs text-gray-500">
        Toate câmpurile sunt opționale. Nu blochează nimic.
      </div>
    </div>
  )
}
