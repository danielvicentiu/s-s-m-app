'use client';

import { Resource, Action } from '@/lib/rbac';
import { Check } from 'lucide-react';

// All available resources and actions
const RESOURCES: Resource[] = [
  'organizations',
  'employees',
  'locations',
  'equipment',
  'medical',
  'trainings',
  'documents',
  'alerts',
  'dashboard',
  'reports',
  'fraud',
  'jurisdictions',
  'roles_admin',
  'reges',
  'memberships',
  'profiles',
  'notifications',
  'penalties',
  'audit_log',
];

const ACTIONS: Action[] = ['create', 'read', 'update', 'delete', 'export', 'delegate'];

// Resource display names (Romanian)
const RESOURCE_NAMES: Record<string, string> = {
  organizations: 'Organizații',
  employees: 'Angajați',
  locations: 'Locații',
  equipment: 'Echipamente',
  medical: 'Medicina Muncii',
  trainings: 'Instruiri',
  documents: 'Documente',
  alerts: 'Alerte',
  dashboard: 'Dashboard',
  reports: 'Rapoarte',
  fraud: 'Detectare Fraudă',
  jurisdictions: 'Jurisdicții',
  roles_admin: 'Administrare Roluri',
  reges: 'Reges',
  memberships: 'Membri Organizații',
  profiles: 'Profiluri Utilizatori',
  notifications: 'Notificări',
  penalties: 'Penalități',
  audit_log: 'Jurnal Audit',
};

// Action display names (Romanian)
const ACTION_NAMES: Record<Action, string> = {
  create: 'Creare',
  read: 'Citire',
  update: 'Modificare',
  delete: 'Ștergere',
  export: 'Export',
  delegate: 'Delegare',
};

interface Permission {
  resource: Resource;
  action: Action;
}

interface PermissionsMatrixProps {
  permissions: Permission[];
  onChange?: (permissions: Permission[]) => void;
  readOnly?: boolean;
  highlightNone?: boolean;
}

export function PermissionsMatrix({
  permissions,
  onChange,
  readOnly = false,
  highlightNone = false,
}: PermissionsMatrixProps) {
  const hasPermission = (resource: Resource, action: Action): boolean => {
    return permissions.some(p => p.resource === resource && p.action === action);
  };

  const togglePermission = (resource: Resource, action: Action) => {
    if (readOnly || !onChange) return;

    const exists = hasPermission(resource, action);
    if (exists) {
      // Remove permission
      onChange(permissions.filter(p => !(p.resource === resource && p.action === action)));
    } else {
      // Add permission
      onChange([...permissions, { resource, action }]);
    }
  };

  const toggleAllForResource = (resource: Resource) => {
    if (readOnly || !onChange) return;

    const resourcePerms = permissions.filter(p => p.resource === resource);
    if (resourcePerms.length === ACTIONS.length) {
      // Remove all
      onChange(permissions.filter(p => p.resource !== resource));
    } else {
      // Add all
      const newPerms = permissions.filter(p => p.resource !== resource);
      ACTIONS.forEach(action => {
        newPerms.push({ resource, action });
      });
      onChange(newPerms);
    }
  };

  const toggleAllForAction = (action: Action) => {
    if (readOnly || !onChange) return;

    const actionPerms = permissions.filter(p => p.action === action);
    if (actionPerms.length === RESOURCES.length) {
      // Remove all
      onChange(permissions.filter(p => p.action !== action));
    } else {
      // Add all
      const newPerms = permissions.filter(p => p.action !== action);
      RESOURCES.forEach(resource => {
        newPerms.push({ resource, action });
      });
      onChange(newPerms);
    }
  };

  const getResourcePermCount = (resource: Resource): number => {
    return permissions.filter(p => p.resource === resource).length;
  };

  const getActionPermCount = (action: Action): number => {
    return permissions.filter(p => p.action === action).length;
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-20 bg-gray-50 border border-gray-300 px-4 py-2 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Resurse
                  </span>
                  <span className="text-xs text-gray-500">
                    {permissions.length} permisiuni
                  </span>
                </div>
              </th>
              {ACTIONS.map((action) => (
                <th
                  key={action}
                  className="border border-gray-300 bg-gray-50 px-3 py-2 text-center"
                >
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => toggleAllForAction(action)}
                      disabled={readOnly}
                      className={`text-xs font-semibold uppercase tracking-wider ${
                        readOnly
                          ? 'text-gray-700 cursor-default'
                          : 'text-blue-700 hover:text-blue-900 cursor-pointer'
                      }`}
                      title={readOnly ? '' : `Toggle all ${action}`}
                    >
                      {ACTION_NAMES[action]}
                    </button>
                    <span className="text-xs text-gray-500">
                      {getActionPermCount(action)}/{RESOURCES.length}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RESOURCES.map((resource, idx) => {
              const permCount = getResourcePermCount(resource);
              const hasAnyPerm = permCount > 0;

              return (
                <tr
                  key={resource}
                  className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition`}
                >
                  <td className="sticky left-0 z-10 border border-gray-300 px-4 py-2 bg-inherit">
                    <button
                      onClick={() => toggleAllForResource(resource)}
                      disabled={readOnly}
                      className={`flex items-center justify-between w-full text-left ${
                        readOnly ? 'cursor-default' : 'cursor-pointer'
                      }`}
                      title={readOnly ? '' : `Toggle all for ${resource}`}
                    >
                      <span
                        className={`text-sm font-medium ${
                          highlightNone && !hasAnyPerm
                            ? 'text-red-600'
                            : hasAnyPerm
                            ? 'text-gray-900'
                            : 'text-gray-500'
                        }`}
                      >
                        {RESOURCE_NAMES[resource] || resource}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {permCount}/{ACTIONS.length}
                      </span>
                    </button>
                  </td>
                  {ACTIONS.map((action) => {
                    const checked = hasPermission(resource, action);
                    return (
                      <td
                        key={`${resource}-${action}`}
                        className="border border-gray-300 px-3 py-2 text-center"
                      >
                        <button
                          onClick={() => togglePermission(resource, action)}
                          disabled={readOnly}
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                            checked
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'bg-white border-gray-300 hover:border-blue-400'
                          } ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
                          title={`${ACTION_NAMES[action]} ${RESOURCE_NAMES[resource] || resource}`}
                        >
                          {checked && <Check className="h-4 w-4" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!readOnly && (
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <div>
            Click pe numele resursei pentru a selecta/deselecta toate acțiunile pentru acea resursă
          </div>
          <div>
            Click pe numele acțiunii pentru a selecta/deselecta toate resursele pentru acea acțiune
          </div>
        </div>
      )}
    </div>
  );
}
