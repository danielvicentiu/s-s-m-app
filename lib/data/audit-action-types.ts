/**
 * Audit Action Types
 *
 * Definește tipurile de acțiuni pentru sistemul de audit log.
 * Fiecare acțiune include: id, action, description și severity.
 */

export type AuditSeverity = 'info' | 'warning' | 'critical';

export interface AuditActionType {
  id: string;
  action: string;
  description: string;
  severity: AuditSeverity;
}

export const AUDIT_ACTION_TYPES: AuditActionType[] = [
  // User & Authentication Actions
  {
    id: 'user-login',
    action: 'user.login',
    description: 'Autentificare utilizator în sistem',
    severity: 'info'
  },
  {
    id: 'user-logout',
    action: 'user.logout',
    description: 'Deconectare utilizator din sistem',
    severity: 'info'
  },
  {
    id: 'user-password-changed',
    action: 'user.password_changed',
    description: 'Schimbare parolă utilizator',
    severity: 'warning'
  },
  {
    id: 'user-role-changed',
    action: 'user.role_changed',
    description: 'Modificare rol utilizator',
    severity: 'critical'
  },

  // Employee Actions
  {
    id: 'employee-created',
    action: 'employee.created',
    description: 'Creare angajat nou',
    severity: 'info'
  },
  {
    id: 'employee-updated',
    action: 'employee.updated',
    description: 'Actualizare date angajat',
    severity: 'info'
  },
  {
    id: 'employee-deleted',
    action: 'employee.deleted',
    description: 'Ștergere angajat',
    severity: 'warning'
  },

  // Training Actions
  {
    id: 'training-scheduled',
    action: 'training.scheduled',
    description: 'Programare instruire SSM/PSI',
    severity: 'info'
  },
  {
    id: 'training-completed',
    action: 'training.completed',
    description: 'Finalizare instruire',
    severity: 'info'
  },
  {
    id: 'training-cancelled',
    action: 'training.cancelled',
    description: 'Anulare instruire programată',
    severity: 'warning'
  },

  // Medical Actions
  {
    id: 'medical-created',
    action: 'medical.created',
    description: 'Adăugare fișă medicală nouă',
    severity: 'info'
  },
  {
    id: 'medical-updated',
    action: 'medical.updated',
    description: 'Actualizare fișă medicală',
    severity: 'warning'
  },
  {
    id: 'medical-expired',
    action: 'medical.expired',
    description: 'Expirare fișă medicală',
    severity: 'critical'
  },

  // Equipment Actions
  {
    id: 'equipment-added',
    action: 'equipment.added',
    description: 'Adăugare echipament de protecție',
    severity: 'info'
  },
  {
    id: 'equipment-assigned',
    action: 'equipment.assigned',
    description: 'Alocare echipament către angajat',
    severity: 'info'
  },
  {
    id: 'equipment-maintenance',
    action: 'equipment.maintenance',
    description: 'Înregistrare mentenanță echipament',
    severity: 'warning'
  },

  // Document Actions
  {
    id: 'document-generated',
    action: 'document.generated',
    description: 'Generare document SSM/PSI',
    severity: 'info'
  },
  {
    id: 'document-uploaded',
    action: 'document.uploaded',
    description: 'Încărcare document în sistem',
    severity: 'info'
  },
  {
    id: 'document-deleted',
    action: 'document.deleted',
    description: 'Ștergere document',
    severity: 'warning'
  },

  // Alert Actions
  {
    id: 'alert-created',
    action: 'alert.created',
    description: 'Creare alertă nouă',
    severity: 'warning'
  },
  {
    id: 'alert-resolved',
    action: 'alert.resolved',
    description: 'Rezolvare alertă',
    severity: 'info'
  },

  // Organization & Settings Actions
  {
    id: 'organization-created',
    action: 'organization.created',
    description: 'Creare organizație nouă',
    severity: 'critical'
  },
  {
    id: 'organization-updated',
    action: 'organization.updated',
    description: 'Actualizare date organizație',
    severity: 'warning'
  },
  {
    id: 'settings-changed',
    action: 'settings.changed',
    description: 'Modificare setări sistem',
    severity: 'warning'
  },

  // System Actions
  {
    id: 'data-export',
    action: 'data.export',
    description: 'Export date din sistem',
    severity: 'warning'
  }
];

/**
 * Helper function pentru a găsi un tip de acțiune după action string
 */
export function getAuditActionType(action: string): AuditActionType | undefined {
  return AUDIT_ACTION_TYPES.find(type => type.action === action);
}

/**
 * Helper function pentru a obține toate acțiunile de o anumită severitate
 */
export function getAuditActionsBySeverity(severity: AuditSeverity): AuditActionType[] {
  return AUDIT_ACTION_TYPES.filter(type => type.severity === severity);
}

/**
 * Helper function pentru a obține toate action strings ca array
 */
export function getAllAuditActions(): string[] {
  return AUDIT_ACTION_TYPES.map(type => type.action);
}
