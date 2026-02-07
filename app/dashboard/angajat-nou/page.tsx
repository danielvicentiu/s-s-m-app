'use client';
import { useState, useEffect } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/client';

const supabase = createSupabaseBrowser();

export default function AngajatNou() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cnp: '',
    phoneNumber: '',
    companyId: '',
    shoeSize: '42', // Valoare default normală
    clothingSize: 'M',
    isApt: false
  });

  useEffect(() => {
    async function getCompanies() {
      const { data, error } = await supabase.from('organizations').select('id, name').order('name');
      if (data) setCompanies(data);
    }
    getCompanies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // VALIDARE CNP: Trebuie să aibă exact 13 cifre și să fie doar cifre
    const cnpRegex = /^[0-9]{13}$/;
    if (!cnpRegex.test(formData.cnp)) {
      alert("Eroare: CNP-ul trebuie să conțină exact 13 cifre!");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('employees').insert([{
      first_name: formData.firstName,
      last_name: formData.lastName,
      cnp: formData.cnp,
      phone_number: formData.phoneNumber,
      company_id: formData.companyId,
      shoe_size: parseInt(formData.shoeSize),
      clothing_size: formData.clothingSize,
      is_apt: formData.isApt,
    }]);

    if (error) {
      alert("Eroare la salvare: " + error.message);
    } else {
      alert("Angajat înregistrat cu succes!");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-sm border mt-10 text-black">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 uppercase tracking-tight">Înregistrare Angajat</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SELECTIE COMPANIE */}
        <div className="p-4 bg-gray-50 rounded-xl border">
          <label className="block text-xs font-black text-gray-500 uppercase mb-2 italic">Entitate Juridică / Holding</label>
          <select 
            className="w-full p-3 border rounded-lg bg-white"
            value={formData.companyId}
            onChange={(e) => setFormData({...formData, companyId: e.target.value})}
            required
          >
            <option value="">Alege firma...</option>
            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* IDENTITATE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Nume" required className="p-3 border rounded-lg" onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
          <input type="text" placeholder="Prenume" required className="p-3 border rounded-lg" onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" placeholder="CNP (Exact 13 cifre)" maxLength={13} required 
            className="p-3 border rounded-lg font-mono focus:ring-2 focus:ring-blue-500 outline-none" 
            onChange={(e) => setFormData({...formData, cnp: e.target.value})} 
          />
          <input type="tel" placeholder="Telefon (pt. SMS OTP)" required className="p-3 border rounded-lg" onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
        </div>

        {/* ECHIPAMENT - SELECTII LIMITATE */}
        <div className="pt-6 border-t">
          <h2 className="text-sm font-black text-gray-400 uppercase mb-4">Măsuri Echipament Protecție</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500">Mărime Încălțăminte</label>
              <select 
                className="w-full p-3 border rounded-lg bg-white"
                value={formData.shoeSize}
                onChange={(e) => setFormData({...formData, shoeSize: e.target.value})}
              >
                {[...Array(13)].map((_, i) => (
                  <option key={i} value={36 + i}>{36 + i}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500">Mărime Haine</label>
              <select 
                className="w-full p-3 border rounded-lg bg-white"
                value={formData.clothingSize}
                onChange={(e) => setFormData({...formData, clothingSize: e.target.value})}
              >
                {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* STATUS MEDICAL */}
        <div className="pt-6 border-t">
          <label className={`flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${formData.isApt ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-100'}`}>
            <input 
              type="checkbox" className="w-6 h-6 rounded text-green-600" 
              onChange={(e) => setFormData({...formData, isApt: e.target.checked})} 
            />
            <span className={`text-sm font-bold uppercase ${formData.isApt ? 'text-green-700' : 'text-red-700'}`}>
              {formData.isApt ? 'Angajat Declarat APT' : 'Confirmă statusul medical (Apt/Inapt)'}
            </span>
          </label>
        </div>

        <button 
          disabled={loading}
          className={`w-full py-4 rounded-xl font-black text-white shadow-lg transition-all uppercase ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Se procesează...' : 'Înregistrează în Baza de Date'}
        </button>
      </form>
    </div>
  );
}