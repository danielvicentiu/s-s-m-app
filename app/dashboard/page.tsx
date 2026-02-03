'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import {
  MedicalExamination, Organization, SafetyEquipment,
  getExpiryStatus, getDaysUntilExpiry
} from '@/lib/types';

type Tab = 'medicina' | 'echipamente';

export default function DashboardPage() {
  const [org, setOrg] = useState<Organization | null>(null);
  const [medicals, setMedicals] = useState<MedicalExamination[]>([]);
  const [equipment, setEquipment] = useState<SafetyEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [medFilter, setMedFilter] = useState<'all' | 'valid' | 'expiring' | 'expired'>('all');
  const [eqFilter, setEqFilter] = useState<'all' | 'compliant' | 'non_compliant' | 'expiring' | 'expired'>('all');
  const [activeTab, setActiveTab] = useState<Tab>('medicina');
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

      const { data: medData } = await supabase
        .from('medical_examinations')
        .select('*')
        .eq('organization_id', orgData.id)
        .order('expiry_date', { ascending: true });

      const { data: eqData } = await supabase
        .from('safety_equipment')
        .select('*')
        .eq('organization_id', orgData.id)
        .order('expiry_date', { ascending: true });

      setMedicals(medData || []);
      setEquipment(eqData || []);
    } catch (err) {
      console.error('Eroare:', err);
      setError('Eroare neașteptată. Verifică consola (F12).');
    } finally {
      setLoading(false);
    }
  }

  // Statistici Medicina Muncii
  const medExpired = medicals.filter(m => getExpiryStatus(m.expiry_date) === 'expired');
  const medExpiring = medicals.filter(m => getExpiryStatus(m.expiry_date) === 'expiring');
  const medValid = medicals.filter(m => getExpiryStatus(m.expiry_date) === 'valid');

  const filteredMedicals = medFilter === 'all' ? medicals
    : medicals.filter(m => getExpiryStatus(m.expiry_date) === medFilter);

  // Statistici Echipamente PSI
  const eqExpired = equipment.filter(e => getExpiryStatus(e.expiry_date) === 'expired');
  const eqExpiring = equipment.filter(e => getExpiryStatus(e.expiry_date) === 'expiring');
  const eqNonCompliant = equipment.filter(e => !e.is_compliant);
  const eqCompliant = equipment.filter(e => e.is_compliant && getExpiryStatus(e.expiry_date) === 'valid');

  const filteredEquipment = eqFilter === 'all' ? equipment
    : eqFilter === 'compliant' ? eqCompliant
    : eqFilter === 'non_compliant' ? eqNonCompliant
    : eqFilter === 'expiring' ? eqExpiring
    : eqExpired;

  // Mapare tip echipament -> label românesc
  const equipmentLabels: Record<string, string> = {
    stingator: 'Stingător',
    trusa_prim_ajutor: 'Trusă prim ajutor',
    hidrant: 'Hidrant',
    detector_fum: 'Detector fum',
    detector_gaz: 'Detector gaz',
    iluminat_urgenta: 'Iluminat urgență',
    panou_semnalizare: 'Panou semnalizare',
    trusa_scule: 'Trusă scule',
    eip: 'EIP',
    altul: 'Altul',
  };

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
      {/* Header */}
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

        {/* Scor Expunere */}
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

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('medicina')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'medicina'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🏥 Medicina Muncii
            {medExpired.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                {medExpired.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('echipamente')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'echipamente'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🛡️ Echipamente PSI
            {(eqExpired.length + eqNonCompliant.length) > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                {eqExpired.length + eqNonCompliant.length}
              </span>
            )}
          </button>
        </div>

        {/* ==================== TAB MEDICINA MUNCII ==================== */}
        {activeTab === 'medicina' && (
          <>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setMedFilter(medFilter === 'expired' ? 'all' : 'expired')}
                className={`rounded-xl p-4 text-center transition-all border-2 ${
                  medFilter === 'expired' ? 'border-red-500 shadow-lg' : 'border-transparent'
                } bg-white shadow-sm hover:shadow-md`}
              >
                <p className="text-3xl font-black text-red-600">{medExpired.length}</p>
                <p className="text-xs font-medium text-red-500 uppercase tracking-wide">Expirate</p>
              </button>
              <button
                onClick={() => setMedFilter(medFilter === 'expiring' ? 'all' : 'expiring')}
                className={`rounded-xl p-4 text-center transition-all border-2 ${
                  medFilter === 'expiring' ? 'border-orange-500 shadow-lg' : 'border-transparent'
                } bg-white shadow-sm hover:shadow-md`}
              >
                <p className="text-3xl font-black text-orange-500">{medExpiring.length}</p>
                <p className="text-xs font-medium text-orange-500 uppercase tracking-wide">Expiră &lt;30 zile</p>
              </button>
              <button
                onClick={() => setMedFilter(medFilter === 'valid' ? 'all' : 'valid')}
                className={`rounded-xl p-4 text-center transition-all border-2 ${
                  medFilter === 'valid' ? 'border-green-500 shadow-lg' : 'border-transparent'
                } bg-white shadow-sm hover:shadow-md`}
              >
                <p className="text-3xl font-black text-green-600">{medValid.length}</p>
                <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Valide</p>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Medicina Muncii</h2>
                <div className="flex items-center gap-2">
                  {medFilter !== 'all' && (
                    <button onClick={() => setMedFilter('all')} className="text-xs text-blue-600 hover:underline">
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
                    {medicals.length === 0 ? 'Nicio fișă medicală adăugată încă.' : 'Nicio fișă în categoria selectată.'}
                  </p>
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
                            <td className="px-6 py-4 font-medium text-gray-900">{med.employee_name}</td>
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
          </>
        )}

        {/* ==================== TAB ECHIPAMENTE PSI ==================== */}
        {activeTab === 'echipamente' && (
          <>
            <div className="grid grid-cols-4 gap-4">
              <button
                onClick={() => setEqFilter(eqFilter === 'expired' ? 'all' : 'expired')}
                className={`rounded-xl p-4 text-center transition-all border-2 ${
                  eqFilter === 'expired' ? 'border-red-500 shadow-lg' : 'border-transparent'
                } bg-white shadow-sm hover:shadow-md`}
              >
                <p className="text-3xl font-black text-red-600">{eqExpired.length}</p>
                <p className="text-xs font-medium text-red-500 uppercase tracking-wide">Expirate</p>
              </button>
              <button
                onClick={() => setEqFilter(eqFilter === 'non_compliant' ? 'all' : 'non_compliant')}
                className={`rounded-xl p-4 text-center transition-all border-2 ${
                  eqFilter === 'non_compliant' ? 'border-red-500 shadow-lg' : 'border-transparent'
                } bg-white shadow-sm hover:shadow-md`}
              >
                <p className="text-3xl font-black text-red-600">{eqNonCompliant.length}</p>
                <p className="text-xs font-medium text-red-500 uppercase tracking-wide">Neconforme</p>
              </button>
              <button
                onClick={() => setEqFilter(eqFilter === 'expiring' ? 'all' : 'expiring')}
                className={`rounded-xl p-4 text-center transition-all border-2 ${
                  eqFilter === 'expiring' ? 'border-orange-500 shadow-lg' : 'border-transparent'
                } bg-white shadow-sm hover:shadow-md`}
              >
                <p className="text-3xl font-black text-orange-500">{eqExpiring.length}</p>
                <p className="text-xs font-medium text-orange-500 uppercase tracking-wide">Expiră &lt;30 zile</p>
              </button>
              <button
                onClick={() => setEqFilter(eqFilter === 'compliant' ? 'all' : 'compliant')}
                className={`rounded-xl p-4 text-center transition-all border-2 ${
                  eqFilter === 'compliant' ? 'border-green-500 shadow-lg' : 'border-transparent'
                } bg-white shadow-sm hover:shadow-md`}
              >
                <p className="text-3xl font-black text-green-600">{eqCompliant.length}</p>
                <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Conforme</p>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Echipamente PSI</h2>
                <div className="flex items-center gap-2">
                  {eqFilter !== 'all' && (
                    <button onClick={() => setEqFilter('all')} className="text-xs text-blue-600 hover:underline">
                      Arată toate
                    </button>
                  )}
                  <span className="text-xs text-gray-400">{filteredEquipment.length} echipamente</span>
                </div>
              </div>

              {filteredEquipment.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-4xl mb-3">🛡️</div>
                  <p className="text-gray-500 font-medium">
                    {equipment.length === 0 ? 'Niciun echipament adăugat încă.' : 'Niciun echipament în categoria selectată.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                      <tr>
                        <th className="px-6 py-3">Tip</th>
                        <th className="px-6 py-3">Descriere</th>
                        <th className="px-6 py-3">Locație</th>
                        <th className="px-6 py-3">Serie</th>
                        <th className="px-6 py-3">Expiră</th>
                        <th className="px-6 py-3">Conformitate</th>
                        <th className="px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredEquipment.map((eq) => {
                        const status = getExpiryStatus(eq.expiry_date);
                        const days = getDaysUntilExpiry(eq.expiry_date);
                        return (
                          <tr key={eq.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
                                {equipmentLabels[eq.equipment_type] || eq.equipment_type}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-900 text-sm">{eq.description || '—'}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{eq.location || '—'}</td>
                            <td className="px-6 py-4 text-xs text-gray-400 font-mono">{eq.serial_number || '—'}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {new Date(eq.expiry_date).toLocaleDateString('ro-RO')}
                            </td>
                            <td className="px-6 py-4">
                              {eq.is_compliant ? (
                                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                  Conform
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-700">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                  Neconform
                                </span>
                              )}
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
          </>
        )}

        {/* Value Preview Cards */}
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
              <span className="text-2xl">📚</span>
              <div>
                <p className="font-bold text-gray-700">Instruiri SSM</p>
                <p className="text-xs text-gray-400">Module interactive + test</p>
              </div>
            </div>
            <div className="mt-3 text-xs bg-gray-100 text-gray-500 px-3 py-2 rounded-lg">
              🔒 Conținut în pregătire — 3 module
            </div>
          </div>
        </div>

        {/* Footer */}
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
