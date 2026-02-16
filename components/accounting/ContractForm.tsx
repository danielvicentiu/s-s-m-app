'use client';

/**
 * ContractForm - Modal form for creating/editing accounting contracts
 * Created: 2026-02-16
 */

import { useState, useEffect } from 'react';
import {
  AccountingContract,
  CreateContractInput,
  Currency,
  ACCOUNTING_SERVICES,
  AccountingServiceType,
} from '@/lib/services/accounting-types';

interface ContractFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contract: Partial<CreateContractInput>) => Promise<void>;
  contract?: AccountingContract | null;
}

export default function ContractForm({ isOpen, onClose, onSave, contract }: ContractFormProps) {
  const [loading, setLoading] = useState(false);
  const [lookingUpCUI, setLookingUpCUI] = useState(false);
  const [formData, setFormData] = useState({
    client_name: '',
    client_cui: '',
    client_j_number: '',
    contract_number: '',
    contract_date: '',
    monthly_fee: '',
    currency: 'RON' as Currency,
    payment_day: '',
    start_date: '',
    notes: '',
    services: [] as AccountingServiceType[],
  });

  useEffect(() => {
    if (contract) {
      setFormData({
        client_name: contract.client_name || '',
        client_cui: contract.client_cui || '',
        client_j_number: contract.client_j_number || '',
        contract_number: contract.contract_number || '',
        contract_date: contract.contract_date || '',
        monthly_fee: contract.monthly_fee?.toString() || '',
        currency: contract.currency || 'RON',
        payment_day: contract.payment_day?.toString() || '',
        start_date: contract.start_date || '',
        notes: contract.notes || '',
        services: contract.services?.map((s) => s.type) || [],
      });
    } else {
      // Reset form for new contract
      setFormData({
        client_name: '',
        client_cui: '',
        client_j_number: '',
        contract_number: '',
        contract_date: '',
        monthly_fee: '',
        currency: 'RON',
        payment_day: '',
        start_date: '',
        notes: '',
        services: [],
      });
    }
  }, [contract, isOpen]);

  const handleCUILookup = async () => {
    if (!formData.client_cui) return;

    setLookingUpCUI(true);
    try {
      const response = await fetch(`/api/anaf?cui=${formData.client_cui}`);
      const data = await response.json();

      if (data.success && data.data) {
        setFormData((prev) => ({
          ...prev,
          client_name: data.data.name || prev.client_name,
          client_j_number: data.data.registrationNumber || prev.client_j_number,
        }));
      }
    } catch (error) {
      console.error('Error looking up CUI:', error);
    } finally {
      setLookingUpCUI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const contractData: Partial<CreateContractInput> = {
        client_name: formData.client_name,
        client_cui: formData.client_cui || undefined,
        client_j_number: formData.client_j_number || undefined,
        contract_number: formData.contract_number || undefined,
        contract_date: formData.contract_date || undefined,
        services: formData.services.map((type) => ({
          type,
          label: ACCOUNTING_SERVICES[type],
          enabled: true,
        })),
        monthly_fee: formData.monthly_fee ? parseFloat(formData.monthly_fee) : undefined,
        currency: formData.currency,
        payment_day: formData.payment_day ? parseInt(formData.payment_day, 10) : undefined,
        start_date: formData.start_date || undefined,
        notes: formData.notes || undefined,
      };

      await onSave(contractData);
      onClose();
    } catch (error) {
      console.error('Error saving contract:', error);
      alert('Eroare la salvarea contractului');
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (service: AccountingServiceType) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-semibold text-gray-900">
            {contract ? 'Editare contract' : 'Contract nou'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Client Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Informații client</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Denumire client *
                </label>
                <input
                  type="text"
                  required
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CUI
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.client_cui}
                    onChange={(e) => setFormData({ ...formData, client_cui: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleCUILookup}
                    disabled={lookingUpCUI || !formData.client_cui}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    {lookingUpCUI ? 'Se verifică...' : 'ANAF'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nr. J
                </label>
                <input
                  type="text"
                  value={formData.client_j_number}
                  onChange={(e) => setFormData({ ...formData, client_j_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Contract Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Detalii contract</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nr. contract
                </label>
                <input
                  type="text"
                  value={formData.contract_number}
                  onChange={(e) => setFormData({ ...formData, contract_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data contract
                </label>
                <input
                  type="date"
                  value={formData.contract_date}
                  onChange={(e) => setFormData({ ...formData, contract_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data start
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zi plată
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={formData.payment_day}
                  onChange={(e) => setFormData({ ...formData, payment_day: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Financial */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Financiar</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tarif lunar
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.monthly_fee}
                  onChange={(e) => setFormData({ ...formData, monthly_fee: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monedă
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value as Currency })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="RON">RON</option>
                  <option value="EUR">EUR</option>
                  <option value="HUF">HUF</option>
                </select>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Servicii contractate</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(ACCOUNTING_SERVICES).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.services.includes(key as AccountingServiceType)}
                    onChange={() => toggleService(key as AccountingServiceType)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Note sau observații suplimentare..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Anulează
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Se salvează...' : 'Salvează'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
