'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Resource, Action } from '@/lib/rbac';
import { CountryCode } from '@/lib/types';
import { PermissionsMatrix } from './PermissionsMatrix';
import { AlertCircle, Loader2 } from 'lucide-react';

interface Permission {
  resource: Resource;
  action: Action;
}

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateRoleModal({ isOpen, onClose, onSuccess }: CreateRoleModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [roleKey, setRoleKey] = useState<string>('');
  const [roleName, setRoleName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [countryCode, setCountryCode] = useState<CountryCode | ''>('');
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const resetForm = () => {
    setRoleKey('');
    setRoleName('');
    setDescription('');
    setCountryCode('');
    setPermissions([]);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!roleKey.trim()) {
      setError('Role Key este obligatoriu');
      return;
    }

    if (!roleName.trim()) {
      setError('Numele rolului este obligatoriu');
      return;
    }

    if (permissions.length === 0) {
      setError('Trebuie să selectați cel puțin o permisiune');
      return;
    }

    setLoading(true);

    try {
      // Create role
      const roleResponse = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role_key: roleKey,
          role_name: roleName,
          description: description || null,
          country_code: countryCode || null,
          is_system: false,
          metadata: {},
        }),
      });

      if (!roleResponse.ok) {
        const errorData = await roleResponse.json();
        throw new Error(errorData.error || 'Failed to create role');
      }

      const { role } = await roleResponse.json();

      // Add permissions
      const permissionsResponse = await fetch(`/api/admin/roles/${role.id}/permissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions }),
      });

      if (!permissionsResponse.ok) {
        throw new Error('Failed to add permissions');
      }

      // Success
      resetForm();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || 'A apărut o eroare la crearea rolului');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Creare Rol Nou" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900">Eroare</h4>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Basic info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="roleKey" className="block text-sm font-medium text-gray-700 mb-1">
              Role Key <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="roleKey"
              value={roleKey}
              onChange={(e) => setRoleKey(e.target.value)}
              placeholder="ex: custom_role_name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Identificator unic (snake_case, doar litere mici și underscore)
            </p>
          </div>

          <div>
            <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 mb-1">
              Nume Rol <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="roleName"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="ex: Manager Operațional"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Nume afișat în interfață
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descriere
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descriere rol și responsabilități..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="countryCode" className="block text-sm font-medium text-gray-700 mb-1">
            Țară
          </label>
          <select
            id="countryCode"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value as CountryCode | '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="">Global (toate țările)</option>
            <option value="RO">🇷🇴 România</option>
            <option value="BG">🇧🇬 Bulgaria</option>
            <option value="HU">🇭🇺 Ungaria</option>
            <option value="DE">🇩🇪 Germania</option>
            <option value="PL">🇵🇱 Polonia</option>
          </select>
        </div>

        {/* Permissions Matrix */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Permisiuni <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-gray-500">
              {permissions.length} permisiuni selectate
            </span>
          </div>
          <div className="border border-gray-300 rounded-lg p-4 max-h-96 overflow-auto">
            <PermissionsMatrix
              permissions={permissions}
              onChange={setPermissions}
              highlightNone={true}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Anulează
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Se creează...' : 'Creează Rol'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
