'use client';

import { useEffect, useState } from 'react';

const INTEGRATIONS = [
  { name: 'Stripe', color: '#635BFF', description: 'Payments & Billing' },
  { name: 'Resend', color: '#000000', description: 'Email Delivery' },
  { name: 'Twilio', color: '#F22F46', description: 'SMS & WhatsApp' },
  { name: 'Supabase', color: '#3ECF8E', description: 'Database & Auth' },
  { name: 'Vercel', color: '#000000', description: 'Hosting & Deploy' },
  { name: 'REGES', color: '#0066CC', description: 'Company Registry' },
  { name: 'certSIGN', color: '#E31E24', description: 'Digital Signatures' },
  { name: 'legislatie.just.ro', color: '#1E3A8A', description: 'Legal Framework' },
];

export default function IntegrationSection() {
  const [activeConnections, setActiveConnections] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomCount = Math.floor(Math.random() * 3) + 2;
      const connections = Array.from(
        { length: randomCount },
        () => Math.floor(Math.random() * INTEGRATIONS.length)
      );
      setActiveConnections(connections);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold mb-6">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            Connected Ecosystem
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Integrat cu Ecosistemul Digital
          </h2>
          <p className="text-xl text-gray-600">
            Conexiuni native cu serviciile esențiale pentru compliance SSM/PSI.
            API-uri robuste și sincronizare în timp real.
          </p>
        </div>

        {/* Integration Grid with Connection Lines */}
        <div className="relative max-w-5xl mx-auto">
          {/* SVG for connection lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
          >
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
                <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Draw connection lines between active integrations */}
            {activeConnections.map((fromIndex, i) => {
              const toIndex = (fromIndex + 1 + i) % INTEGRATIONS.length;
              const fromRow = Math.floor(fromIndex / 4);
              const fromCol = fromIndex % 4;
              const toRow = Math.floor(toIndex / 4);
              const toCol = toIndex % 4;

              // Calculate positions (approximate grid positions)
              const fromX = (fromCol + 0.5) * 25; // percentage
              const fromY = (fromRow + 0.5) * 50; // percentage
              const toX = (toCol + 0.5) * 25;
              const toY = (toRow + 0.5) * 50;

              return (
                <line
                  key={`${fromIndex}-${toIndex}-${i}`}
                  x1={`${fromX}%`}
                  y1={`${fromY}%`}
                  x2={`${toX}%`}
                  y2={`${toY}%`}
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                  className="animate-pulse-slow"
                >
                  <animate
                    attributeName="stroke-dasharray"
                    from="0,1000"
                    to="1000,0"
                    dur="2s"
                    repeatCount="1"
                  />
                </line>
              );
            })}
          </svg>

          {/* Integration logos grid */}
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            {INTEGRATIONS.map((integration, index) => (
              <div
                key={integration.name}
                className={`group relative bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  activeConnections.includes(index)
                    ? 'border-blue-400 shadow-lg shadow-blue-100'
                    : ''
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {/* Active indicator */}
                {activeConnections.includes(index) && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-pulse">
                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping" />
                  </div>
                )}

                {/* Logo placeholder */}
                <div className="flex flex-col items-center text-center space-y-3">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md transition-transform group-hover:scale-110"
                    style={{
                      backgroundColor: integration.color,
                    }}
                  >
                    {integration.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {integration.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {integration.description}
                    </p>
                  </div>
                </div>

                {/* Hover effect glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity"
                  style={{
                    backgroundColor: integration.color,
                  }}
                />
              </div>
            ))}
          </div>

          {/* API Badge */}
          <div className="mt-12 flex justify-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="font-semibold">API REST Documentat</span>
              </div>
              <span className="text-blue-100">•</span>
              <span className="text-sm">OpenAPI 3.0</span>
              <span className="text-blue-100">•</span>
              <span className="text-sm">Webhook Support</span>
            </div>
          </div>
        </div>

        {/* Bottom info */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            + integrări custom disponibile prin API
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>99.9% Uptime SLA</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Real-time Sync</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Secure & Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
