'use client';

import { Calendar, Users, ArrowRight, ShieldCheck } from 'lucide-react';

interface ServiceCardProps {
  service: {
    id: string;
    service_name: string;
    current_status: 'green' | 'yellow' | 'red' | 'blue';
    expiration_date: string;
    worker_count: number;
  };
  onDelegate: (id: string, name: string, companyId: string) => void;
  companyId: string;
}

export function ServiceCard({ service, onDelegate, companyId }: ServiceCardProps) {
  const isRed = service.current_status === 'red';
  const isBlue = service.current_status === 'blue';

  return (
    <div className={`p-6 rounded-2xl border transition-all duration-300 ${
      isRed ? 'bg-red-500/10 border-red-500/50' : 
      isBlue ? 'bg-blue-500/10 border-blue-500/50' : 
      'bg-slate-800 border-slate-700'
    }`}>
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-slate-700/50 rounded-xl">
          <ShieldCheck className={isRed ? 'text-red-400' : 'text-teal-400'} size={24} />
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          isRed ? 'bg-red-500 text-white' : 
          isBlue ? 'bg-blue-500 text-white' : 
          'bg-green-500 text-white'
        }`}>
          {service.current_status === 'red' ? 'Expirat' : 
           service.current_status === 'blue' ? 'În procesare' : 'Conform'}
        </span>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 uppercase">{service.service_name}</h3>
      
      <div className="space-y-3 mb-8">
        <div className="flex items-center text-slate-400 gap-2">
          <Calendar size={16} />
          <span>Expiră la: {service.expiration_date}</span>
        </div>
        <div className="flex items-center text-slate-400 gap-2">
          <Users size={16} />
          <span>{service.worker_count} Angajați</span>
        </div>
      </div>

      <button 
        onClick={() => onDelegate(service.id, service.service_name, companyId)}
        disabled={isBlue}
        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
          isRed ? 'bg-teal-500 hover:bg-teal-400 text-slate-900' : 
          isBlue ? 'bg-slate-700 text-slate-400 cursor-not-allowed' :
          'bg-slate-700 hover:bg-slate-600 text-white'
        }`}
      >
        {isBlue ? 'Cerere trimisă' : '🎯 Delegă către SSM Consultanță'}
        {!isBlue && <ArrowRight size={18} />}
      </button>
    </div>
  );
}