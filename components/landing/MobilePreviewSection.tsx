'use client';

import { Bell, CheckCircle2, AlertTriangle, Smartphone, Zap, Globe } from 'lucide-react';

export default function MobilePreviewSection() {
  // Floating notification badges data
  const notifications = [
    {
      icon: CheckCircle2,
      text: 'Training completat',
      color: 'bg-green-500',
      position: 'top-left',
      delay: 0,
    },
    {
      icon: AlertTriangle,
      text: 'Alertă expirare',
      color: 'bg-amber-500',
      position: 'top-right',
      delay: 0.5,
    },
    {
      icon: Bell,
      text: 'Notificare nouă',
      color: 'bg-blue-500',
      position: 'bottom-left',
      delay: 1,
    },
  ];

  const features = [
    {
      icon: Smartphone,
      title: 'Dashboard responsive',
      description: 'Interfață optimizată pentru toate dispozitivele',
    },
    {
      icon: Bell,
      title: 'Notificări push',
      description: 'Alerte instant pentru documente și evenimente',
    },
    {
      icon: Zap,
      title: 'Acțiuni rapide',
      description: 'Acces rapid la funcțiile principale din mobile',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Phone mockup with dashboard */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Floating notifications */}
            {notifications.map((notification, index) => (
              <div
                key={index}
                className={`absolute z-10 ${
                  notification.position === 'top-left'
                    ? 'top-8 left-4 sm:left-12'
                    : notification.position === 'top-right'
                    ? 'top-20 right-4 sm:right-12'
                    : 'bottom-24 left-8 sm:left-16'
                }`}
              >
                <div className="bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-gray-100">
                  <div className={`${notification.color} p-2 rounded-lg`}>
                    <notification.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                    {notification.text}
                  </span>
                </div>
              </div>
            ))}

            {/* Phone mockup */}
            <div
              className="relative"
            >
              {/* Phone frame */}
              <div className="relative w-[300px] sm:w-[340px] h-[600px] sm:h-[680px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                {/* Phone notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-3xl z-10" />

                {/* Screen */}
                <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Dashboard screenshot mockup */}
                  <div className="h-full bg-gradient-to-br from-blue-50 to-gray-50 p-6">
                    {/* Status bar */}
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-6">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-gray-400 rounded-sm" />
                        <div className="w-4 h-4 bg-gray-400 rounded-sm" />
                        <div className="w-4 h-4 bg-gray-400 rounded-sm" />
                      </div>
                    </div>

                    {/* Header */}
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h3>
                      <p className="text-sm text-gray-600">Bună ziua, Daniel</p>
                    </div>

                    {/* Stats cards */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="text-3xl font-bold text-blue-600 mb-1">47</div>
                        <div className="text-xs text-gray-600">Angajați</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="text-3xl font-bold text-green-600 mb-1">12</div>
                        <div className="text-xs text-gray-600">Trainings</div>
                      </div>
                    </div>

                    {/* Alert card */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-semibold text-amber-900 mb-1">
                            Alertă expirare
                          </div>
                          <div className="text-xs text-amber-700">
                            5 documente expiră în 30 zile
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <button className="bg-blue-600 text-white rounded-lg py-3 text-sm font-medium">
                        Adaugă angajat
                      </button>
                      <button className="bg-white text-gray-700 border border-gray-200 rounded-lg py-3 text-sm font-medium">
                        Rapoarte
                      </button>
                    </div>
                  </div>
                </div>

                {/* Phone buttons */}
                <div className="absolute right-0 top-32 w-1 h-12 bg-gray-800 rounded-l" />
                <div className="absolute right-0 top-48 w-1 h-16 bg-gray-800 rounded-l" />
                <div className="absolute left-0 top-40 w-1 h-8 bg-gray-800 rounded-r" />
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl -z-10 scale-95" />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="text-center lg:text-left">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Globe className="w-4 h-4" />
                <span>Disponibil pe toate platformele</span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Acces de{' '}
                <span className="text-blue-600">oriunde</span>
              </h2>

              <p className="text-lg sm:text-xl text-gray-600 mb-12 leading-relaxed">
                Gestionează compliance-ul SSM/PSI din orice dispozitiv.
                Dashboard-ul responsive și notificările instant îți oferă
                control total în orice moment.
              </p>

              {/* Features list */}
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4"
                  >
                    <div className="bg-blue-100 p-3 rounded-xl flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
