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
  const [showAddMedical, setShowAddMedical] = useState(false);
  const [showAddEquipment, setShowAddEquipment] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Form state - Medical
  const [medForm, setMedForm] = useState({
    employee_name: '',
    job_title: '',
    examination_type: 'periodic' as 'periodic' | 'angajare' | 'reluare' | 'la_cerere' | 'supraveghere',
    examination_date: '',
    expiry_date: '',
    result: 'apt' as 'apt' | 'apt_conditionat' | 'inapt_temporar' | 'inapt',
    restrictions: '',
    doctor_name: '',
    clinic_name: '',
  });

  // Form state - Equipment
  const [eqForm, setEqForm] = useState({
    equipment_type: 'stingator' as string,
    description: '',
    location: '',
    serial_number: '',
    last_inspection_date: '',
    expiry_date: '',
    next_inspection_date: '',
    inspector_name: '',
    is_compliant: true,
  });

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

      // Notificări recente
      const { data: notifData } = await supabase
        .from('notification_log')
        .select('*')
        .eq('organization_id', orgData.id)
        .order('sent_at', { ascending: false })
        .limit(5);

      setNotifications(notifData || []);

    } catch (err) {
      setError('Eroare neașteptată. Verifică consola (F12).');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddMedical() {
    if (!org || !medForm.employee_name || !medForm.examination_date || !medForm.expiry_date) return;
    setSaving(true);
    const { error } = await supabase.from('medical_examinations').insert({
      organization_id: org.id,
      ...medForm,
      restrictions: medForm.restrictions || null,
    });
    setSaving(false);
    if (error) {
      alert('Eroare la salvare: ' + error.message);
      return;
    }
    setShowAddMedical(false);
    setMedForm({
      employee_name: '', job_title: '', examination_type: 'periodic',
      examination_date: '', expiry_date: '', result: 'apt',
      restrictions: '', doctor_name: '', clinic_name: '',
    });
    fetchData();
  }

  async function handleAddEquipment() {
    if (!org || !eqForm.equipment_type || !eqForm.expiry_date) return;
    setSaving(true);
    const { error } = await supabase.from('safety_equipment').insert({
      organization_id: org.id,
      ...eqForm,
      description: eqForm.description || null,
      location: eqForm.location || null,
      serial_number: eqForm.serial_number || null,
      last_inspection_date: eqForm.last_inspection_date || null,
      next_inspection_date: eqForm.next_inspection_date || null,
      inspector_name: eqForm.inspector_name || null,
    });
    setSaving(false);
    if (error) {
      alert('Eroare la salvare: ' + error.message);
      return;
    }
    setShowAddEquipment(false);
    setEqForm({
      equipment_type: 'stingator', description: '', location: '',
      serial_number: '', last_inspection_date: '', expiry_date: '',
      next_inspection_date: '', inspector_name: '', is_compliant: true,
    });
    fetchData();
  }

  // Statistici
  const medExpired = medicals.filter(m => getExpiryStatus(m.expiry_date) === 'expired');
  const medExpiring = medicals.filter(m => getExpiryStatus(m.expiry_date) === 'expiring');
  const medValid = medicals.filter(m => getExpiryStatus(m.expiry_date) === 'valid');
  const filteredMedicals = medFilter === 'all' ? medicals : medicals.filter(m => getExpiryStatus(m.expiry_date) === medFilter);

  const eqExpired = equipment.filter(e => getExpiryStatus(e.expiry_date) === 'expired');
  const eqExpiring = equipment.filter(e => getExpiryStatus(e.expiry_date) === 'expiring');
  const eqNonCompliant = equipment.filter(e => !e.is_compliant);
  const eqCompliant = equipment.filter(e => e.is_compliant && getExpiryStatus(e.expiry_date) === 'valid');
  const filteredEquipment = eqFilter === 'all' ? equipment
    : eqFilter === 'compliant' ? eqCompliant
    : eqFilter === 'non_compliant' ? eqNonCompliant
    : eqFilter === 'expiring' ? eqExpiring : eqExpired;

  const equipmentLabels: Record<string, string> = {
    stingator: 'Stingător', trusa_prim_ajutor: 'Trusă prim ajutor', hidrant: 'Hidrant',
    detector_fum: 'Detector fum', detector_gaz: 'Detector gaz', iluminat_urgenta: 'Iluminat urgență',
    panou_semnalizare: 'Panou semnalizare', trusa_scule: 'Trusă scule', eip: 'EIP', altul: 'Altul',
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
        <p className="text-red-700 font-medium">{error}</p>
        <button onClick={fetchData} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Reîncearcă</button>
      </div>
    </div>
  );

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">s-s-m.ro</h1>
            <p className="text-sm text-gray-500">{org?.name || 'Dashboard'} {org?.cui ? `• ${org.cui}` : ''}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">Consultant</span>
            <button onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }} className="text-xs text-red-500 hover:underline">Ieși</button>
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
                  org.exposure_score === 'scazut' ? 'text-green-700' : 'text-gray-500'
                }`}>{org.exposure_score === 'necalculat' ? 'Adaugă date pentru calcul' : org.exposure_score}</p>
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
          <button onClick={() => setActiveTab('medicina')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'medicina' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            🏥 Medicina Muncii
            {medExpired.length > 0 && <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">{medExpired.length}</span>}
          </button>
          <button onClick={() => setActiveTab('echipamente')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'echipamente' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            🛡️ Echipamente PSI
            {(eqExpired.length + eqNonCompliant.length) > 0 && <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">{eqExpired.length + eqNonCompliant.length}</span>}
          </button>
        </div>

        {/* ==================== TAB MEDICINA MUNCII ==================== */}
        {activeTab === 'medicina' && (
          <>
            <div className="grid grid-cols-3 gap-4">
              <button onClick={() => setMedFilter(medFilter === 'expired' ? 'all' : 'expired')}
                className={`rounded-xl p-4 text-center transition-all border-2 ${medFilter === 'expired' ? 'border-red-500 shadow-lg' : 'border-transparent'} bg-white shadow-sm hover:shadow-md`}>
                <p className="text-3xl font-black text-red-600">{medExpired.length}</p>
                <p className="text-xs font-medium text-red-500 uppercase tracking-wide">Expirate</p>
              </button>
              <button onClick={() => setMedFilter(medFilter === 'expiring' ? 'all' : 'expiring')}
                className={`rounded-xl p-4 text-center transition-all border-2 ${medFilter === 'expiring' ? 'border-orange-500 shadow-lg' : 'border-transparent'} bg-white shadow-sm hover:shadow-md`}>
                <p className="text-3xl font-black text-orange-500">{medExpiring.length}</p>
                <p className="text-xs font-medium text-orange-500 uppercase tracking-wide">Expiră &lt;30 zile</p>
              </button>
              <button onClick={() => setMedFilter(medFilter === 'valid' ? 'all' : 'valid')}
                className={`rounded-xl p-4 text-center transition-all border-2 ${medFilter === 'valid' ? 'border-green-500 shadow-lg' : 'border-transparent'} bg-white shadow-sm hover:shadow-md`}>
                <p className="text-3xl font-black text-green-600">{medValid.length}</p>
                <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Valide</p>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Medicina Muncii</h2>
                <div className="flex items-center gap-3">
                  {medFilter !== 'all' && <button onClick={() => setMedFilter('all')} className="text-xs text-blue-600 hover:underline">Arată toate</button>}
                  <span className="text-xs text-gray-400">{filteredMedicals.length} înregistrări</span>
                  <button onClick={() => setShowAddMedical(true)}
                    className="px-3 py-1.5 text-xs font-medium text-white rounded-lg transition-colors" style={{ backgroundColor: '#1e40af' }}>
                    + Adaugă fișă
                  </button>
                </div>
              </div>

              {filteredMedicals.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-4xl mb-3">📋</div>
                  <p className="text-gray-500 font-medium">{medicals.length === 0 ? 'Nicio fișă medicală adăugată încă.' : 'Nicio fișă în categoria selectată.'}</p>
                  {medicals.length === 0 && (
                    <button onClick={() => setShowAddMedical(true)} className="mt-3 text-sm font-medium hover:underline" style={{ color: '#1e40af' }}>
                      Adaugă prima fișă medicală →
                    </button>
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
                            <td className="px-6 py-4 font-medium text-gray-900">{med.employee_name}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{med.job_title || '—'}</td>
                            <td className="px-6 py-4"><span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full capitalize">{med.examination_type}</span></td>
                            <td className="px-6 py-4 text-sm text-gray-600">{new Date(med.examination_date).toLocaleDateString('ro-RO')}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{new Date(med.expiry_date).toLocaleDateString('ro-RO')}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${status === 'expired' ? 'bg-red-100 text-red-700' : status === 'expiring' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${status === 'expired' ? 'bg-red-500' : status === 'expiring' ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                                {status === 'expired' ? `Expirat ${Math.abs(days)} zile` : status === 'expiring' ? `Expiră în ${days} zile` : 'Valid'}
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
              <button onClick={() => setEqFilter(eqFilter === 'expired' ? 'all' : 'expired')}
                className={`rounded-xl p-4 text-center transition-all border-2 ${eqFilter === 'expired' ? 'border-red-500 shadow-lg' : 'border-transparent'} bg-white shadow-sm hover:shadow-md`}>
                <p className="text-3xl font-black text-red-600">{eqExpired.length}</p>
                <p className="text-xs font-medium text-red-500 uppercase tracking-wide">Expirate</p>
              </button>
              <button onClick={() => setEqFilter(eqFilter === 'non_compliant' ? 'all' : 'non_compliant')}
                className={`rounded-xl p-4 text-center transition-all border-2 ${eqFilter === 'non_compliant' ? 'border-red-500 shadow-lg' : 'border-transparent'} bg-white shadow-sm hover:shadow-md`}>
                <p className="text-3xl font-black text-red-600">{eqNonCompliant.length}</p>
                <p className="text-xs font-medium text-red-500 uppercase tracking-wide">Neconforme</p>
              </button>
              <button onClick={() => setEqFilter(eqFilter === 'expiring' ? 'all' : 'expiring')}
                className={`rounded-xl p-4 text-center transition-all border-2 ${eqFilter === 'expiring' ? 'border-orange-500 shadow-lg' : 'border-transparent'} bg-white shadow-sm hover:shadow-md`}>
                <p className="text-3xl font-black text-orange-500">{eqExpiring.length}</p>
                <p className="text-xs font-medium text-orange-500 uppercase tracking-wide">Expiră &lt;30 zile</p>
              </button>
              <button onClick={() => setEqFilter(eqFilter === 'compliant' ? 'all' : 'compliant')}
                className={`rounded-xl p-4 text-center transition-all border-2 ${eqFilter === 'compliant' ? 'border-green-500 shadow-lg' : 'border-transparent'} bg-white shadow-sm hover:shadow-md`}>
                <p className="text-3xl font-black text-green-600">{eqCompliant.length}</p>
                <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Conforme</p>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Echipamente PSI</h2>
                <div className="flex items-center gap-3">
                  {eqFilter !== 'all' && <button onClick={() => setEqFilter('all')} className="text-xs text-blue-600 hover:underline">Arată toate</button>}
                  <span className="text-xs text-gray-400">{filteredEquipment.length} echipamente</span>
                  <button onClick={() => setShowAddEquipment(true)}
                    className="px-3 py-1.5 text-xs font-medium text-white rounded-lg transition-colors" style={{ backgroundColor: '#1e40af' }}>
                    + Adaugă echipament
                  </button>
                </div>
              </div>

              {filteredEquipment.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-4xl mb-3">🛡️</div>
                  <p className="text-gray-500 font-medium">{equipment.length === 0 ? 'Niciun echipament adăugat încă.' : 'Niciun echipament în categoria selectată.'}</p>
                  {equipment.length === 0 && (
                    <button onClick={() => setShowAddEquipment(true)} className="mt-3 text-sm font-medium hover:underline" style={{ color: '#1e40af' }}>
                      Adaugă primul echipament →
                    </button>
                  )}
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
                            <td className="px-6 py-4"><span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">{equipmentLabels[eq.equipment_type] || eq.equipment_type}</span></td>
                            <td className="px-6 py-4 font-medium text-gray-900 text-sm">{eq.description || '—'}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{eq.location || '—'}</td>
                            <td className="px-6 py-4 text-xs text-gray-400 font-mono">{eq.serial_number || '—'}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{new Date(eq.expiry_date).toLocaleDateString('ro-RO')}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${eq.is_compliant ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${eq.is_compliant ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                {eq.is_compliant ? 'Conform' : 'Neconform'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${status === 'expired' ? 'bg-red-100 text-red-700' : status === 'expiring' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${status === 'expired' ? 'bg-red-500' : status === 'expiring' ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                                {status === 'expired' ? `Expirat ${Math.abs(days)} zile` : status === 'expiring' ? `Expiră în ${days} zile` : 'Valid'}
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

        {/* ==================== ULTIMELE NOTIFICĂRI ==================== */}
        {notifications.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">📧 Ultimele Notificări</h2>
              <span className="text-xs text-gray-400">{notifications.length} recente</span>
            </div>
            <div className="divide-y divide-gray-100">
              {notifications.map((notif) => {
                const meta = notif.metadata || {};
                const date = notif.sent_at ? new Date(notif.sent_at).toLocaleString('ro-RO') : '—';
                const hasExpired = (meta.expired || 0) > 0;
                const hasCritical = (meta.critical || 0) > 0;
                return (
                  <div key={notif.id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${
                        notif.status === 'sent' ? 'bg-green-500' :
                        notif.status === 'failed' ? 'bg-red-500' : 'bg-gray-400'
                      }`}></span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{meta.subject || 'Alertă SSM'}</p>
                        <p className="text-xs text-gray-500">
                          Către: {notif.recipient} · {date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasExpired && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                          {meta.expired} expirate
                        </span>
                      )}
                      {hasCritical && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">
                          {meta.critical} critice
                        </span>
                      )}
                      {(meta.warning || 0) > 0 && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">
                          {meta.warning} atenție
                        </span>
                      )}
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        notif.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {notif.status === 'sent' ? '✓ Trimis' : '✗ Eroare'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Value Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 border border-gray-200 opacity-60">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📄</span>
              <div><p className="font-bold text-gray-700">PDF Conformitate</p><p className="text-xs text-gray-400">Generare automată raport</p></div>
            </div>
            <div className="mt-3 text-xs bg-gray-100 text-gray-500 px-3 py-2 rounded-lg">🔒 Disponibil când completare date &gt; 80%</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200 opacity-100">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🔔</span>
              <div><p className="font-bold text-gray-700">Alerte Automate</p><p className="text-xs text-gray-400">Email, SMS, WhatsApp</p></div>
            </div>
            <div className="mt-3 text-xs bg-green-100 text-green-700 px-3 py-2 rounded-lg">✅ Activ — Email zilnic la 08:00 via Resend</div>
          </div>
          <a href="/dashboard/training" className="bg-white rounded-xl p-5 border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer block">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📚</span>
              <div><p className="font-bold text-gray-700">Instruiri SSM & PSI</p><p className="text-xs text-gray-400">Module interactive + test</p></div>
            </div>
            <div className="mt-3 text-xs bg-green-100 text-green-700 px-3 py-2 rounded-lg">✅ 9 module active — Click pentru acces</div>
          </a>
        </div>

        {/* Footer */}
        <div className="flex gap-3 pt-4">
          <a href="mailto:daniel@s-s-m.ro" className="flex-1 text-center text-sm bg-white border border-gray-200 rounded-xl py-3 px-4 text-gray-600 hover:bg-gray-50 transition-colors">📧 Contactează consultantul</a>
          <button onClick={fetchData} className="flex-1 text-center text-sm bg-white border border-gray-200 rounded-xl py-3 px-4 text-gray-600 hover:bg-gray-50 transition-colors">🔄 Reîncarcă datele</button>
          <a href="https://s-s-m.ro" className="flex-1 text-center text-sm bg-blue-600 rounded-xl py-3 px-4 text-white hover:bg-blue-700 transition-colors">ℹ️ Despre platformă</a>
        </div>
      </div>

      {/* ==================== MODAL ADAUGĂ FIȘĂ MEDICALĂ ==================== */}
      {showAddMedical && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddMedical(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Adaugă fișă medicală</h3>
              <button onClick={() => setShowAddMedical(false)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={labelClass}>Nume angajat *</label>
                  <input type="text" className={inputClass} placeholder="ex: Popescu Maria"
                    value={medForm.employee_name} onChange={e => setMedForm({...medForm, employee_name: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>Funcție</label>
                  <input type="text" className={inputClass} placeholder="ex: Asistentă medicală"
                    value={medForm.job_title} onChange={e => setMedForm({...medForm, job_title: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>Tip examinare *</label>
                  <select className={inputClass} value={medForm.examination_type} onChange={e => setMedForm({...medForm, examination_type: e.target.value as any})}>
                    <option value="periodic">Periodic</option>
                    <option value="angajare">Angajare</option>
                    <option value="reluare">Reluare activitate</option>
                    <option value="la_cerere">La cerere</option>
                    <option value="supraveghere">Supraveghere</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Data examinare *</label>
                  <input type="date" className={inputClass}
                    value={medForm.examination_date} onChange={e => setMedForm({...medForm, examination_date: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>Data expirare *</label>
                  <input type="date" className={inputClass}
                    value={medForm.expiry_date} onChange={e => setMedForm({...medForm, expiry_date: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>Rezultat *</label>
                  <select className={inputClass} value={medForm.result} onChange={e => setMedForm({...medForm, result: e.target.value as any})}>
                    <option value="apt">Apt</option>
                    <option value="apt_conditionat">Apt condiționat</option>
                    <option value="inapt_temporar">Inapt temporar</option>
                    <option value="inapt">Inapt</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Medic</label>
                  <input type="text" className={inputClass} placeholder="ex: Dr. Ionescu Adrian"
                    value={medForm.doctor_name} onChange={e => setMedForm({...medForm, doctor_name: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Clinica</label>
                  <input type="text" className={inputClass} placeholder="ex: MedLife București"
                    value={medForm.clinic_name} onChange={e => setMedForm({...medForm, clinic_name: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Restricții (dacă apt condiționat)</label>
                  <input type="text" className={inputClass} placeholder="ex: Restricție ridicare greutăți >5kg"
                    value={medForm.restrictions} onChange={e => setMedForm({...medForm, restrictions: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
              <button onClick={() => setShowAddMedical(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Anulează</button>
              <button onClick={handleAddMedical} disabled={saving || !medForm.employee_name || !medForm.examination_date || !medForm.expiry_date}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50" style={{ backgroundColor: '#1e40af' }}>
                {saving ? 'Se salvează...' : 'Salvează fișa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL ADAUGĂ ECHIPAMENT ==================== */}
      {showAddEquipment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddEquipment(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Adaugă echipament PSI</h3>
              <button onClick={() => setShowAddEquipment(false)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Tip echipament *</label>
                  <select className={inputClass} value={eqForm.equipment_type} onChange={e => setEqForm({...eqForm, equipment_type: e.target.value})}>
                    {Object.entries(equipmentLabels).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Serie</label>
                  <input type="text" className={inputClass} placeholder="ex: STG-001-2024"
                    value={eqForm.serial_number} onChange={e => setEqForm({...eqForm, serial_number: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Descriere</label>
                  <input type="text" className={inputClass} placeholder="ex: Stingător P6 pulbere 6kg"
                    value={eqForm.description} onChange={e => setEqForm({...eqForm, description: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>Locație</label>
                  <input type="text" className={inputClass} placeholder="ex: Hol intrare"
                    value={eqForm.location} onChange={e => setEqForm({...eqForm, location: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>Inspector</label>
                  <input type="text" className={inputClass} placeholder="ex: Pirotehnicia SRL"
                    value={eqForm.inspector_name} onChange={e => setEqForm({...eqForm, inspector_name: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>Ultima inspecție</label>
                  <input type="date" className={inputClass}
                    value={eqForm.last_inspection_date} onChange={e => setEqForm({...eqForm, last_inspection_date: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>Data expirare *</label>
                  <input type="date" className={inputClass}
                    value={eqForm.expiry_date} onChange={e => setEqForm({...eqForm, expiry_date: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>Următoarea inspecție</label>
                  <input type="date" className={inputClass}
                    value={eqForm.next_inspection_date} onChange={e => setEqForm({...eqForm, next_inspection_date: e.target.value})} />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input type="checkbox" id="is_compliant" checked={eqForm.is_compliant}
                    onChange={e => setEqForm({...eqForm, is_compliant: e.target.checked})}
                    className="w-4 h-4 rounded border-gray-300" />
                  <label htmlFor="is_compliant" className="text-sm text-gray-700">Echipament conform</label>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
              <button onClick={() => setShowAddEquipment(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Anulează</button>
              <button onClick={handleAddEquipment} disabled={saving || !eqForm.expiry_date}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50" style={{ backgroundColor: '#1e40af' }}>
                {saving ? 'Se salvează...' : 'Salvează echipament'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
