'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { MedicalExamination, Organization, getExpiryStatus, getDaysUntilExpiry } from '@/lib/types';

export default function DashboardPage() {
  const [org, setOrg] = useState<Organization | null>(null);
  const [medicals, setMedicals] = useState<MedicalExamination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'valid' | 'expiring' | 'expired'>('all');
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .limit(1)
        .single();

      if (orgError) {
        console.error('Eroare organizații:', orgError);
        setError('Nu s-au putut încărca datele. Verifică conexiunea Supabase.');
        setLoading(false);
        return;
      }

      setOrg(orgData);

      const { data: medData, error: medError } = await supabase
        .from('medical_examinations')
        .select('*')
        .eq('organization_id', orgData.id)
        .order('expiry_date', { ascending: true });

      if (medError) {
        console.error('Eroare fișe medicale:', medError);
      }

      setMedicals(medData || []);
    } catch (err) {
      console.error('Eroare:', err);
      setError('Eroare neașteptată. Verifică consola (F12).');
    } finally {
      setLoading(false);
    }
  }

  const expired = medicals.filter(m => getExpiryStatus(m.expiry_date) === 'expired');
  const expiring = medicals.filter(m => getExpiryStatus(m.expiry_date) === 'expiring');
  const valid = medicals.filter(m => getExpiryStatus(m.expiry_date) === 'valid');

  const filteredMedicals = filter === 'all' ? medicals
    : medicals.filter(m => getExpiryStatus(m.expiry_date) === filter);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Se încarcă datele...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center">
        <div className="text-red-500 text-4xl mb-3">⚠️</div>
        <p className="text-red-700 font-medium">{error}</p>
        <button onClick={fetchData} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Reîncearcă
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">s-s-m.ro</h1>
            <p className="text-sm text-gray-500">
              {org?.name || 'Dashboard'} {org?.cui ? `• ${org.cui}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">Consultant</span>
            <button
              onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }}
              className="text-xs text-red-500 hover:underline"
            >
              Ieși
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">

        {org && (
          <div className={`rounded-xl p-4 border ${
            org.exposure_score === 'critic' ? 'bg-red-50 border-red-300' :
            org.exposure_score === 'ridicat' ? 'bg-orange-50 border-orange-300' :
            org.exposure_score === 'mediu' ? 'bg-yellow-50 border-yellow-300' :
            org.exposure_score === 'scazut' ? 'bg-green-50 border-green-300' :
            'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Risc Control ITM</p>
                <p className={`text-lg font-bold uppercase ${
                  org.exposure_score === 'critic' ? 'text-red-700' :
                  org.exposure_score === 'ridicat' ? 'text-orange-700' :
                  org.exposure_score === 'mediu' ? 'text-yellow-700' :
                  org.exposure_score === 'scazut' ? 'text-green-700' :
                  'text-gray-500'
                }`}>
                  {org.exposure_score === 'necalculat' ? 'Adaugă date pentru calcul' : org.exposure_score}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Completare date</p>
                <p className="text-lg font-bold text-gray-800">{org.data_completeness}%</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => setFilter(filter === 'expired' ? 'all' : 'expired')}
            className={`rounded-xl p-4 text-center transition-all border-2 ${
              filter === 'expired' ? 'border-red-500 shadow-lg' : 'border-transparent'
            } bg-white shadow-sm hover:shadow-md`}
          >
            <p className="text-3xl font-black text-red-600">{expired.length}</p>
            <p className="text-xs font-medium text-red-500 uppercase tracking-wide">Expirate</p>
          </button>

          <button
            onClick={() => setFilter(filter === 'expiring' ? 'all' : 'expiring')}
            className={`rounded-xl p-4 text-center transition-all border-2 ${
              filter === 'expiring' ? 'border-orange-500 shadow-lg' : 'border-transparent'
            } bg-white shadow-sm hover:shadow-md`}
          >
            <p className="text-3xl font-black text-orange-500">{expiring.length}</p>
            <p className="text-xs font-medium text-orange-500 uppercase tracking-wide">Expiră &lt;30 zile</p>
          </button>

          <button
            onClick={() => setFilter(filter === 'valid' ? 'all' : 'valid')}
            className={`rounded-xl p-4 text-center transition-all border-2 ${
              filter === 'valid' ? 'border-green-500 shadow-lg' : 'border-transparent'
            } bg-white shadow-sm hover:shadow-md`}
          >
            <p className="text-3xl font-black text-green-600">{valid.length}</p>
            <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Valide</p>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Medicina Muncii</h2>
            <div className="flex items-center gap-2">
              {filter !== 'all' && (
                <button onClick={() => setFilter('all')} className="text-xs text-blue-600 hover:underline">
                  Arată toate
                </button>
              )}
              <span className="text-xs text-gray-400">{filteredMedicals.length} înregistrări</span>
            </div>
          </div>

          {filteredMedicals.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-gray-500 font-medium">
                {medicals.length === 0
                  ? 'Nicio fișă medicală adăugată încă.'
                  : 'Nicio fișă în categoria selectată.'}
              </p>
              {medicals.length === 0 && (
                <p className="text-sm text-gray-400 mt-1">
                  Adaugă fișe medicale din Supabase → Table Editor → medical_examinations → Insert
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <tr>
                    <th className="px-6 py-3">Angajat</th>
                    <th className="px-6 py-3">Funcție</th>
                    <th className="px-6 py-3">Tip</th>
                    <th className="px-6 py-3">Data examinare</th>
                    <th className="px-6 py-3">Expiră</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredMedicals.map((med) => {
                    const status = getExpiryStatus(med.expiry_date);
                    const days = getDaysUntilExpiry(med.expiry_date);
                    return (
                      <tr key={med.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{med.employee_name}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{med.job_title || '—'}</td>
                        <td className="px-6 py-4">
                          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full capitalize">
                            {med.examination_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(med.examination_date).toLocaleDateString('ro-RO')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(med.expiry_date).toLocaleDateString('ro-RO')}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                            status === 'expired' ? 'bg-red-100 text-red-700' :
                            status === 'expiring' ? 'bg-orange-100 text-orange-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              status === 'expired' ? 'bg-red-500' :
                              status === 'expiring' ? 'bg-orange-500' :
                              'bg-green-500'
                            }`}></span>
                            {status === 'expired' ? `Expirat ${Math.abs(days)} zile` :
                             status === 'expiring' ? `Expiră în ${days} zile` :
                             'Valid'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 border border-gray-200 opacity-60">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📄</span>
              <div>
                <p className="font-bold text-gray-700">PDF Conformitate</p>
                <p className="text-xs text-gray-400">Generare automată raport</p>
              </div>
            </div>
            <div className="mt-3 text-xs bg-gray-100 text-gray-500 px-3 py-2 rounded-lg">
              🔒 Disponibil când completare date &gt; 80%
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 opacity-60">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🔔</span>
              <div>
                <p className="font-bold text-gray-700">Alerte Automate</p>
                <p className="text-xs text-gray-400">Email, SMS, WhatsApp</p>
              </div>
            </div>
            <div className="mt-3 text-xs bg-gray-100 text-gray-500 px-3 py-2 rounded-lg">
              🔒 Se configurează cu n8n — în curând
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 opacity-60">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🛡️</span>
              <div>
                <p className="font-bold text-gray-700">Echipamente PSI</p>
                <p className="text-xs text-gray-400">Stingătoare, truse, detectoare</p>
              </div>
            </div>
            <div className="mt-3 text-xs bg-gray-100 text-gray-500 px-3 py-2 rounded-lg">
              🔒 Disponibil după finalizarea Medicina Muncii
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <a href="mailto:daniel@s-s-m.ro"
             className="flex-1 text-center text-sm bg-white border border-gray-200 rounded-xl py-3 px-4 text-gray-600 hover:bg-gray-50 transition-colors">
            📧 Contactează consultantul
          </a>
          <button onClick={fetchData}
            className="flex-1 text-center text-sm bg-white border border-gray-200 rounded-xl py-3 px-4 text-gray-600 hover:bg-gray-50 transition-colors">
            🔄 Reîncarcă datele
          </button>
          <a href="https://s-s-m.ro"
             className="flex-1 text-center text-sm bg-blue-600 rounded-xl py-3 px-4 text-white hover:bg-blue-700 transition-colors">
            ℹ️ Despre platformă
          </a>
        </div>

      </div>
    </div>
  );
}
