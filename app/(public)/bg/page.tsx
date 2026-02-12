// app/(public)/bg/page.tsx
// Landing page static pentru Bulgaria
// Versiune hardcoded cu texte în limba bulgară

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BulgariaLandingPage() {
  const router = useRouter()

  // Mock obligations pentru Bulgaria (pot fi fetchuite dinamic mai târziu)
  const obligations: any[] = []

  // Penalties calculator state
  const [selectedPenalties, setSelectedPenalties] = useState<Set<string>>(new Set())

  const togglePenalty = (id: string) => {
    const newSet = new Set(selectedPenalties)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedPenalties(newSet)
  }

  const totalPenaltyMin = obligations
    .filter(o => selectedPenalties.has(o.id))
    .reduce((sum, o) => sum + (o.penalty_min || 0), 0)

  const totalPenaltyMax = obligations
    .filter(o => selectedPenalties.has(o.id))
    .reduce((sum, o) => sum + (o.penalty_max || 0), 0)

  const currencySymbol = 'EUR'

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('bg-BG', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const pricingFeatures = [
    'Трудова медицина — неограничено проследяване',
    'ПБ Оборудване — пълен инвентар',
    'Автоматични имейл известия ежедневно',
    'Финансов риск — изчисляване на глоби от ИА "ГИТ"',
    'Мулти-организация — неограничен брой фирми',
    'PDF Справки — автоматично генериране',
    'Приоритетна техническа поддръжка',
    'Автоматичен ежедневен бекъп',
    'Безплатни актуализации',
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-black text-gray-900">s-s-m.ro</div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden md:block">
              Функционалности
            </a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden md:block">
              Цена
            </a>
            <button
              onClick={() => router.push('/bg/login')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              Влез в платформата
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-6 bg-blue-50 text-blue-600 border border-blue-200">
            Дигитална платформа за ЗБУТ и ПБ
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Съответствие ЗБУТ и ПБ<br />
            <span className="text-blue-600">100% автоматизирано</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Управлявайте трудовата медицина, ПБ оборудването, известията и справките от една платформа. Нула бюрокрация, нула глоби от ИА "ГИТ".
          </p>
          <button
            onClick={() => router.push('/bg/login')}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
          >
            Започни сега →
          </button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Всичко, от което се нуждаеш на едно място</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              6 интегрирани модула за пълно съответствие ЗБУТ и ПБ
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Трудова медицина */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-600 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                🏥
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Трудова медицина</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Проследяване на медицински досиета, автоматични известия за изтичане, пълна отчетност за служител в реално време.
              </p>
            </div>

            {/* Feature 2: ПБ Оборудване */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-600 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                🧯
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">ПБ Оборудване</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Инвентар на пожарогасители, хидранти, детектори за дим. Планиране на проверки, дневници за поддръжка, QR код проследяване.
              </p>
            </div>

            {/* Feature 3: Автоматични известия */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-600 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                🔔
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Автоматични известия</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Ежедневен имейл за предстоящи изтичания (30/15/7 дни). Интеграция Resend, WhatsApp известия (скоро).
              </p>
            </div>

            {/* Feature 4: Финансов риск */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-600 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                💰
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Финансов риск</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Автоматично изчисляване на потенциални глоби от ИА "ГИТ" / ГДПБЗН. Разбивка по орган, оценка мин-макс в €.
              </p>
            </div>

            {/* Feature 5: Мулти-организация */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-600 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                🏢
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Мулти-организация</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Управлявайте 100+ фирми от едно табло. Незабавно филтриране, запазени предпочитания, мулти-тенант архитектура.
              </p>
            </div>

            {/* Feature 6: PDF Справки */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-600 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                📄
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">PDF Справки</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Автоматично генериране на справки за ИА "ГИТ", SHA256 хеш за неизменяемост, облачен архив, 1-клик експорт.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Penalties Calculator */}
      {obligations.length > 0 && (
        <section id="penalties" className="py-20 px-6 bg-red-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-gray-900 mb-4">Глоби без съответствие ЗБУТ</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Изчислете финансовия си риск ако липсват задължителни документи
              </p>
            </div>

            <div className="bg-white rounded-2xl border-2 border-red-200 p-8 shadow-xl">
              <p className="text-center text-gray-700 mb-6">Контролните органи могат да наложат глоби между:</p>

              {/* Total Risk Banner */}
              {selectedPenalties.size > 0 && (
                <div className="bg-red-600 text-white rounded-xl p-6 mb-8 text-center">
                  <div className="text-sm font-semibold mb-2">Общ риск глоби:</div>
                  <div className="text-4xl font-black">
                    {formatCurrency(totalPenaltyMin)} - {formatCurrency(totalPenaltyMax)} {currencySymbol}
                  </div>
                </div>
              )}

              <h3 className="font-bold text-gray-900 mb-4">Маркирайте какво НЕ е в ред:</h3>

              <div className="space-y-3">
                {obligations.map((obligation) => (
                  <label
                    key={obligation.id}
                    className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-red-300 cursor-pointer transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPenalties.has(obligation.id)}
                      onChange={() => togglePenalty(obligation.id)}
                      className="mt-1 w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{obligation.name}</div>
                      {obligation.description && (
                        <div className="text-sm text-gray-500 mt-1">{obligation.description}</div>
                      )}
                      <div className="text-sm text-red-600 font-bold mt-2">
                        Глоба: {formatCurrency(obligation.penalty_min || 0)} - {formatCurrency(obligation.penalty_max || 0)} {currencySymbol}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <p className="text-xs text-gray-400 text-center mt-6">
                Приблизителни стойности според действащото законодателство. Реалните глоби могат да варират.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Прозрачна цена</h2>
            <p className="text-gray-600 text-lg">Един план, всички функционалности</p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl border-2 border-blue-600 p-8 shadow-xl">
              <div className="text-center mb-6">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 mb-4">
                  ПРОФЕСИОНАЛЕН ПЛАН
                </div>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-5xl font-black text-gray-900">199 EUR</span>
                  <span className="text-gray-500">/год.</span>
                </div>
                <p className="text-sm text-gray-500">за организация</p>
              </div>

              <ul className="space-y-3 mb-8">
                {pricingFeatures.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      ✓
                    </span>
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => router.push('/bg/login')}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg"
              >
                Започни сега →
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                Без такса за настройка. Откажи по всяко време.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="text-2xl font-black text-gray-900 mb-2">s-s-m.ro</div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Дигитална платформа за съответствие ЗБУТ и ПБ. Трудова медицина, ПБ оборудване, автоматични известия.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Навигация</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="text-gray-600 hover:text-blue-600 transition">
                    Функционалности
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition">
                    Цена
                  </a>
                </li>
                <li>
                  <button onClick={() => router.push('/bg/login')} className="text-gray-600 hover:text-blue-600 transition">
                    Login
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Контакт</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>📧 contact@s-s-m.ro</li>
                <li>📞 +359 800 000 00</li>
                <li>📍 София, България</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400">
              © 2026 s-s-m.ro. Всички права запазени.
            </p>
            <div className="flex gap-6 text-xs text-gray-400">
              <a href="#" className="hover:text-blue-600 transition">Условия за ползване</a>
              <a href="#" className="hover:text-blue-600 transition">Поверителност</a>
              <a href="#" className="hover:text-blue-600 transition">GDPR</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
