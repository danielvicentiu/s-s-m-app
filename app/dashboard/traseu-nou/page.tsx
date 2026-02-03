'use client';
import { useState } from 'react';

export default function TraseuNou() {
  const [durata, setDurata] = useState(0);
  const [recomandare, setRecomandare] = useState(0);

  // Logica AI: Calculează o marjă generoasă (+50% din ce zice omul)
  const handleDurataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    setDurata(val);
    setRecomandare(Math.ceil(val * 1.5)); // Marja de siguranță de 50%
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-sm border mt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Declarație Traseu Deplasare</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Adresa de plecare (unde locuiești efectiv)</label>
          <input type="text" className="w-full p-3 border rounded-lg mt-1" placeholder="Ex: Str. Chiriilor nr. 5, Sector 3" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Durata estimată de deplasare (minute)</label>
          <input 
            type="number" 
            onChange={handleDurataChange}
            className="w-full p-3 border rounded-lg mt-1" 
            placeholder="Cât faci de obicei?" 
          />
        </div>

        {durata > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-blue-800 text-sm">
              ✨ <strong>Sugestie AI de Siguranță:</strong> Pentru a fi protejat legal în caz de trafic, greve sau lucrări, recomandăm declararea unei durate de <strong>{recomandare} minute</strong>.
            </p>
            <button className="mt-2 text-xs font-bold text-blue-600 underline">
              Acceptă recomandarea AI
            </button>
          </div>
        )}

        <div className="pt-6 border-t">
          <p className="text-xs text-gray-500 mb-4 italic">
            * Această declarație se semnează electronic și este valabilă conform legii accidentelor de muncă (traseu).
          </p>
          <button className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition">
            Salvează și Semnează
          </button>
        </div>
      </div>
    </div>
  );
}