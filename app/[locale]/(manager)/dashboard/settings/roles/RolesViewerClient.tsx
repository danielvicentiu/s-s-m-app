'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Lock, Globe, Info, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PermissionsMatrix } from '@/components/admin/PermissionsMatrix';
import { Resource, Action, UserRole } from '@/lib/rbac';

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
  created_at: string;
  permissions: Permission[];
}

interface RolesViewerClientProps {
  roles: Role[];
  organizationName: string;
  userRoles: UserRole[];
}

export function RolesViewerClient({ roles, organizationName, userRoles }: RolesViewerClientProps) {
  const t = useTranslations('roles')
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(
    roles.length > 0 ? roles[0].id : null
  );

  const selectedRole = roles.find((r) => r.id === selectedRoleId);

  // Check if user has any of the displayed roles
  const userRoleKeys = userRoles.map((r) => r.role_key);
  const userHasRole = (roleKey: string) => userRoleKeys.includes(roleKey);

  return (
    <>
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Link href="/dashboard" className="hover:text-gray-700">
                  Dashboard
                </Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/dashboard/settings" className="hover:text-gray-700">
                  {t('breadcrumbSettings')}
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900 font-medium">{t('breadcrumbRoles')}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Shield className="h-7 w-7 text-blue-600" />
                {t('pageTitle')}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {t('pageSubtitle', { organizationName })}
              </p>
            </div>
          </div>

          {/* INFO BANNER */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900">{t('readOnlyTitle')}</h3>
                <p className="text-sm text-blue-700 mt-1">
                  {t('readOnlyDesc')}
                </p>
                <div className="mt-3">
                  <p className="text-sm text-blue-900 font-medium">{t('yourActiveRoles')}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userRoles.map((role, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-800 text-sm font-medium"
                      >
                        <Shield className="h-3.5 w-3.5" />
                        {role.role_name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* SIDEBAR - Role List */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden sticky top-6">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  {t('availableRoles')}
                </h3>
              </div>
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                {roles.map((role) => {
                  const isUserRole = userHasRole(role.role_key);

                  return (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRoleId(role.id)}
                      className={`w-full text-left px-4 py-3 border-b border-gray-100 transition-colors ${
                        selectedRoleId === role.id
                          ? 'bg-blue-50 border-l-4 border-l-blue-600'
                          : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                      } ${isUserRole ? 'bg-green-50/50' : ''}`}
                    >
                      <div className="flex items-start gap-2">
                        {role.is_system && (
                          <Lock className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold text-sm text-gray-900 truncate">
                              {role.role_name}
                            </div>
                            {isUserRole && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-green-100 text-green-800 font-medium">
                                {t('you')}
                              </span>
                            )}
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
                              {t('permissionsCount', { count: role.permissions.length })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}

                {roles.length === 0 && (
                  <div className="px-4 py-8 text-center">
                    <Shield className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">{t('noRoles')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* MAIN CONTENT - Permissions Matrix */}
          <div className="col-span-12 lg:col-span-8">
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
                        {userHasRole(selectedRole.role_key) && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-medium">
                            <Shield className="h-3 w-3" />
                            {t('yourRole')}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 font-mono mt-1">{selectedRole.role_key}</div>
                      {selectedRole.description && (
                        <p className="text-sm text-gray-600 mt-2">{selectedRole.description}</p>
                      )}
                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                        <span>
                          <strong className="font-medium text-gray-700">
                            {selectedRole.permissions.length}
                          </strong>{' '}
                          {t('activePermissions')}
                        </span>
                        {selectedRole.country_code && (
                          <span className="inline-flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {t('availableIn', { countryCode: selectedRole.country_code })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Permissions Matrix */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      {t('matrixTitle')}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {t('matrixDesc')}
                    </p>
                  </div>

                  <PermissionsMatrix
                    permissions={selectedRole.permissions.map((p) => ({
                      resource: p.resource,
                      action: p.action,
                    }))}
                    readOnly={true}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('selectRole')}</h3>
                <p className="text-sm text-gray-500">
                  {t('selectRoleDesc')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* LINK ÎNAPOI */}
        <div className="mt-6">
          <Link href="/dashboard/settings" className="text-sm text-gray-500 hover:text-gray-700">
            {t('backToSettings')}
          </Link>
        </div>
      </main>
    </>
  );
}
