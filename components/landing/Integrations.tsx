import React from 'react';

export default function Integrations() {
  const integrations = [
    { name: 'REGES', color: 'from-blue-500 to-blue-600' },
    { name: 'Revisal', color: 'from-green-500 to-green-600' },
    { name: 'WhatsApp', color: 'from-emerald-500 to-emerald-600' },
    { name: 'Email', color: 'from-purple-500 to-purple-600' },
    { name: 'PDF', color: 'from-red-500 to-red-600' },
    { name: 'Excel', color: 'from-teal-500 to-teal-600' },
    { name: 'Google Calendar', color: 'from-orange-500 to-orange-600' },
    { name: 'Supabase', color: 'from-emerald-500 to-green-600' },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Integrări cu instrumentele tale
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Se integrează cu instrumentele pe care le folosești deja
          </p>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${integration.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />

              {/* Logo Placeholder */}
              <div className="relative z-10 text-center">
                <div className={`w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br ${integration.color} flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300`}>
                  {integration.name.substring(0, 2).toUpperCase()}
                </div>
                <p className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                  {integration.name}
                </p>
              </div>

              {/* Border Glow Effect */}
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${integration.color} blur-xl -z-10`} style={{ padding: '2px' }} />
            </div>
          ))}
        </div>

        {/* Additional Text */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Și multe altele în curând...
          </p>
        </div>
      </div>
    </section>
  );
}
