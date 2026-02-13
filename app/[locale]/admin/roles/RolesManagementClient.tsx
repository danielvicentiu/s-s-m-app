'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Plus, Lock, Globe, CheckCircle, XCircle, Save, Edit3 } from 'lucide-react';
import { PermissionsMatrix } from '@/components/admin/PermissionsMatrix';
import { CreateRoleModal } from '@/components/admin/CreateRoleModal';
import { Resource, Action } from '@/lib/rbac';

interface Permission {
  id: string;
  resource: Resource;
  action: Action;
}

interface Role {
  id: string;
  role_key: string;
  role_name: string;
  description: string | null;
  country_code: string | null;
  is_system: boolean;
  is_active: boolean;
  metadata: any;
  created_at: string;
  permissions: Permission[];
}

interface RolesManagementClientProps {
  initialRoles: Role[];
}

export function RolesManagementClient({ initialRoles }: RolesManagementClientProps) {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(
    initialRoles.length > 0 ? initialRoles[0].id : null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const selectedRole = roles.find((r) => r.id === selectedRoleId);

  const handlePermissionsChange = (permissions: { resource: Resource; action: Action }[]) => {
    if (!selectedRoleId) return;

    setRoles((prev) =>
      prev.map((role) =>
        role.id === selectedRoleId
          ? {
              ...role,
              permissions: permissions.map((p) => ({
                id: '', // Will be generated on save
                resource: p.resource,
                action: p.action,
              })),
            }
          : role
      )
    );

    // Auto-mark as editing
    if (editingRoleId !== selectedRoleId) {
      setEditingRoleId(selectedRoleId);
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedRoleId || !selectedRole) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/roles/${selectedRoleId}/permissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          permissions: selectedRole.permissions.map((p) => ({
            resource: p.resource,
            action: p.action,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save permissions');
      }

      // Refresh to get IDs
      const { permissions } = await response.json();
      setRoles((prev) =>
        prev.map((role) =>
          role.id === selectedRoleId ? { ...role, permissions } : role
        )
      );

      setEditingRoleId(null);
      alert('Permisiuni salvate cu succes!');
    } catch (error) {
      console.error('Error saving permissions:', error);
      alert('Eroare la salvarea permisiunilor');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateSuccess = () => {
    // Refresh page to get new role
    window.location.reload();
  };

  const stats = {
    total: roles.length,
    active: roles.filter((r) => r.is_active).length,
    system: roles.filter((r) => r.is_system).length,
    countries: [...new Set(roles.map((r) => r.country_code).filter(Boolean))].length,
  };

  return (
    <>
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Shield className="h-7 w-7 text-blue-600" />
                Matrice Permisiuni RBAC
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Editare permisiuni granulare per rol — Resource × Action Matrix
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/roles/assign"
                className="px-4 py-2.5 rounded-lg text-sm font-semibold border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Asignare Roluri
              </Link>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Rol Nou
              </button>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
              <div className="text-3xl font-black text-blue-600">{stats.total}</div>
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-widest mt-1">
                Total Roluri
              </div>
            </div>
            <div className="bg-green-50 rounded-xl border border-green-100 p-4">
              <div className="text-3xl font-black text-green-600">{stats.active}</div>
              <div className="text-xs font-semibold text-green-600 uppercase tracking-widest mt-1">
                Active
              </div>
            </div>
            <div className="bg-purple-50 rounded-xl border border-purple-100 p-4">
              <div className="text-3xl font-black text-purple-600">{stats.system}</div>
              <div className="text-xs font-semibold text-purple-600 uppercase tracking-widest mt-1">
                System Roles
              </div>
            </div>
            <div className="bg-orange-50 rounded-xl border border-orange-100 p-4">
              <div className="text-3xl font-black text-orange-600">{stats.countries}</div>
              <div className="text-xs font-semibold text-orange-600 uppercase tracking-widest mt-1">
                Țări
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* SIDEBAR - Role List */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden sticky top-6">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Selectează Rol
                </h3>
              </div>
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRoleId(role.id)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-100 transition-colors ${
                      selectedRoleId === role.id
                        ? 'bg-blue-50 border-l-4 border-l-blue-600'
                        : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {role.is_system && <Lock className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900 truncate">
                          {role.role_name}
                        </div>
                        <div className="text-xs text-gray-500 font-mono truncate">
                          {role.role_key}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {role.country_code ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-blue-50 text-blue-700">
                              <Globe className="h-3 w-3" />
                              {role.country_code}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">Global</span>
                          )}
                          <span className="text-xs text-gray-500">
                            {role.permissions.length} perm.
                          </span>
                        </div>
                      </div>
                      {editingRoleId === role.id && (
                        <Edit3 className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MAIN CONTENT - Permissions Matrix */}
          <div className="col-span-12 lg:col-span-9">
            {selectedRole ? (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {/* Role Header */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-gray-900">{selectedRole.role_name}</h2>
                        {selectedRole.is_system && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-medium">
                            <Lock className="h-3 w-3" />
                            System Role
                          </span>
                        )}
                        {selectedRole.is_active ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-medium">
                            <CheckCircle className="h-3 w-3" />
                            Activ
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-medium">
                            <XCircle className="h-3 w-3" />
                            Inactiv
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 font-mono mt-1">{selectedRole.role_key}</div>
                      {selectedRole.description && (
                        <p className="text-sm text-gray-600 mt-2">{selectedRole.description}</p>
                      )}
                    </div>
                    {!selectedRole.is_system && editingRoleId === selectedRole.id && (
                      <button
                        onClick={handleSavePermissions}
                        disabled={saving}
                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4" />
                        {saving ? 'Se salvează...' : 'Salvează Permisiuni'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Permissions Matrix */}
                <div className="p-6">
                  {selectedRole.is_system ? (
                    <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Lock className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-yellow-900">
                            Rol de sistem (read-only)
                          </h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Rolurile de sistem nu pot fi editate. Acestea sunt gestionate automat de platformă.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    editingRoleId === selectedRole.id && (
                      <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Edit3 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-semibold text-blue-900">Mod editare activ</h4>
                            <p className="text-sm text-blue-700 mt-1">
                              Modificările nu sunt salvate automat. Apasă "Salvează Permisiuni" pentru a aplica
                              schimbările.
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  <PermissionsMatrix
                    permissions={selectedRole.permissions.map((p) => ({
                      resource: p.resource,
                      action: p.action,
                    }))}
                    onChange={selectedRole.is_system ? undefined : handlePermissionsChange}
                    readOnly={selectedRole.is_system}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Selectează un rol</h3>
                <p className="text-sm text-gray-500">
                  Alege un rol din lista din stânga pentru a edita permisiunile
                </p>
              </div>
            )}
          </div>
        </div>

        {/* LINK ÎNAPOI */}
        <div className="mt-6">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
            ← Înapoi la Dashboard
          </Link>
        </div>
      </main>

      {/* Create Role Modal */}
      <CreateRoleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
}
