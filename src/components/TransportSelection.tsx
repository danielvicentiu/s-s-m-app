'use client';
import { useState } from 'react';

export default function TransportSelection({ onComplete }: { onComplete: (data: any) => void }) {
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [time, setTime] = useState('');
  const [itinerary, setItinerary] = useState('');

  const transportOptions = [
    { id: 'auto', label: 'Auto Personal', icon: '🚗' },
    { id: 'pietonal', label: 'Pietonal', icon: '🚶' },
    { id: 'stb', label: 'STB / Autobuz', icon: '🚌' },
    { id: 'metrou', label: 'Metrou', icon: '🚇' },
    { id: 'tren', label: 'Tren (CFR)', icon: '🚆' },
    { id: 'bicicleta', label: 'Bicicletă / Trotinetă', icon: '🚲' },
    { id: 'taxi', label: 'Taxi / Uber', icon: '🚕' }
  ];

  const handleToggle = (label: string) => {
    setSelectedModes(prev => prev.includes(label) ? prev.filter(m => m !== label) : [...prev, label]);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-slate-900 border border-slate-700 rounded-[2rem] shadow-2xl">
      <h2 className="text-2xl font-black uppercase text-teal-400 mb-2 italic">Traseu Deplasare</h2>
      <p className="text-slate-400 text-xs mb-8 uppercase tracking-widest">Configurare necesară pentru Fișa SSM (Albastră)</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {transportOptions.map(opt => (
          <button key={opt.id} onClick={() => handleToggle(opt.label)}
            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
              selectedModes.includes(opt.label) ? 'border-teal-500 bg-teal-500/10' : 'border-slate-800 bg-slate-800'
            }`}>
            <span className="text-2xl">{opt.icon}</span>
            <span className="text-[10px] font-bold uppercase">{opt.label}</span>
          </button>
        ))}
      </div>

      <div className="mb-8">
        <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Timp Estimat (Minute)</label>
        <div className="flex gap-2 mb-4">
          {[15, 30, 45, 60, 90, 120].map(m => (
            <button key={m} onClick={() => setTime(m.toString())} className="px-3 py-1 bg-slate-800 rounded-md text-[10px] font-bold hover:bg-teal-500 transition-colors">
              {m} min
            </button>
          ))}
        </div>
        <input type="number" value={time} onChange={(e) => setTime(e.target.value)} placeholder="Scrie manual (ex: 240)..."
          className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-teal-400 font-bold outline-none focus:border-teal-400" />
      </div>

      <button onClick={() => onComplete({ selectedModes, time, itinerary })}
        className="w-full py-4 bg-teal-500 text-black font-black uppercase rounded-xl hover:scale-[1.02] transition-transform">
        Confirmă Traseul și Începe Testul
      </button>
    </div>
  );
}