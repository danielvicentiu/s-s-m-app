import React from 'react';

// Mock data types
interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  uptime: number; // percentage
}

interface Incident {
  id: string;
  date: string;
  service: string;
  title: string;
  status: 'resolved' | 'investigating' | 'monitoring';
  description: string;
}

interface UptimeDay {
  day: number;
  status: 'operational' | 'degraded' | 'down';
}

// Mock data - 90 days uptime (most operational, few degraded days)
const generateUptimeData = (): UptimeDay[] => {
  const data: UptimeDay[] = [];
  for (let i = 90; i >= 1; i--) {
    const random = Math.random();
    let status: 'operational' | 'degraded' | 'down' = 'operational';
    if (random < 0.02) status = 'degraded';
    if (random < 0.005) status = 'down';
    data.push({ day: i, status });
  }
  return data;
};

// Mock services data
const services: ServiceStatus[] = [
  { name: 'Web App', status: 'operational', uptime: 99.8 },
  { name: 'API', status: 'operational', uptime: 99.9 },
  { name: 'Database', status: 'operational', uptime: 99.95 },
  { name: 'Email', status: 'degraded', uptime: 98.5 },
  { name: 'Auth', status: 'operational', uptime: 99.99 },
];

// Mock incidents
const incidents: Incident[] = [
  {
    id: '1',
    date: '2024-12-15',
    service: 'Email',
    title: 'Întârzieri la livrarea emailurilor',
    status: 'monitoring',
    description: 'Am identificat întârzieri în procesarea emailurilor. Echipa monitorizează situația.',
  },
  {
    id: '2',
    date: '2024-11-28',
    service: 'API',
    title: 'Lentoare API - rezolvat',
    status: 'resolved',
    description: 'Performanță redusă a API-ului între 14:00-15:30. Problema a fost rezolvată prin optimizare cache.',
  },
  {
    id: '3',
    date: '2024-11-10',
    service: 'Database',
    title: 'Mentenanță programată - finalizată',
    status: 'resolved',
    description: 'Mentenanță de rutină a bazei de date. Downtime: 15 minute.',
  },
];

// Status badge component
const StatusBadge = ({ status }: { status: 'operational' | 'degraded' | 'down' }) => {
  const statusConfig = {
    operational: {
      label: 'Operațional',
      className: 'bg-green-100 text-green-800 border-green-200',
      dot: 'bg-green-500',
    },
    degraded: {
      label: 'Performanță redusă',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      dot: 'bg-yellow-500',
    },
    down: {
      label: 'Indisponibil',
      className: 'bg-red-100 text-red-800 border-red-200',
      dot: 'bg-red-500',
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${config.className}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
      {config.label}
    </div>
  );
};

// Incident status badge
const IncidentStatusBadge = ({ status }: { status: 'resolved' | 'investigating' | 'monitoring' }) => {
  const statusConfig = {
    resolved: {
      label: 'Rezolvat',
      className: 'bg-gray-100 text-gray-700',
    },
    investigating: {
      label: 'În investigare',
      className: 'bg-blue-100 text-blue-700',
    },
    monitoring: {
      label: 'În monitorizare',
      className: 'bg-yellow-100 text-yellow-700',
    },
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

export default function StatusPage() {
  const uptimeData = generateUptimeData();
  const overallStatus = services.every(s => s.status === 'operational')
    ? 'operational'
    : services.some(s => s.status === 'down')
    ? 'down'
    : 'degraded';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Status Servicii S-S-M.ro
          </h1>
          <div className="flex items-center justify-center gap-3">
            <StatusBadge status={overallStatus} />
            <p className="text-gray-600">
              Toate sistemele funcționează normal
            </p>
          </div>
        </div>

        {/* Services Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Servicii</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {services.map((service) => (
              <div key={service.name} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <h3 className="font-medium text-gray-900 min-w-[120px]">
                    {service.name}
                  </h3>
                  <StatusBadge status={service.status} />
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{service.uptime}%</span> uptime
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Uptime - Last 90 Days */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Disponibilitate - Ultimele 90 de zile
            </h2>
            <p className="text-sm text-gray-600">
              Istoric disponibilitate pentru toate serviciile
            </p>
          </div>
          <div className="px-6 py-6">
            <div className="flex gap-[2px] items-end h-12">
              {uptimeData.map((day, index) => {
                const heightClass = day.status === 'operational' ? 'h-full' : day.status === 'degraded' ? 'h-2/3' : 'h-1/3';
                const colorClass = day.status === 'operational' ? 'bg-green-500' : day.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500';

                return (
                  <div
                    key={index}
                    className={`flex-1 ${heightClass} ${colorClass} rounded-sm hover:opacity-80 transition-opacity cursor-pointer`}
                    title={`Acum ${day.day} zile: ${day.status === 'operational' ? 'Operațional' : day.status === 'degraded' ? 'Performanță redusă' : 'Indisponibil'}`}
                  ></div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>90 zile în urmă</span>
              <span>Astăzi</span>
            </div>
            <div className="flex items-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                <span className="text-gray-600">Operațional</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
                <span className="text-gray-600">Performanță redusă</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                <span className="text-gray-600">Indisponibil</span>
              </div>
            </div>
          </div>
        </div>

        {/* Incident History */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Istoric Incidente
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {incidents.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                Nu există incidente raportate
              </div>
            ) : (
              incidents.map((incident) => (
                <div key={incident.id} className="px-6 py-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-medium text-gray-900">
                          {incident.title}
                        </h3>
                        <IncidentStatusBadge status={incident.status} />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <span>{incident.service}</span>
                        <span>•</span>
                        <time>{new Date(incident.date).toLocaleDateString('ro-RO', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                      </div>
                      <p className="text-gray-700 text-sm">
                        {incident.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Ultima actualizare: {new Date().toLocaleString('ro-RO')}</p>
        </div>
      </div>
    </div>
  );
}
