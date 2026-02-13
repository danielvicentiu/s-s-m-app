/**
 * Organization-related TypeScript types and enums
 * Central type definitions for organizations, memberships, and invitations
 */

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Organization subscription plans
 */
export enum OrgPlan {
  FREE = 'free',
  START = 'start',
  PRO = 'pro',
  ENTERPRISE = 'enterprise'
}

/**
 * Member roles within an organization
 * Note: Migrating to RBAC system (see docs/DOC3_PLAN_EXECUTIE_v4.0.md)
 */
export enum MemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  VIEWER = 'viewer'
}

/**
 * Supported countries for organizations
 */
export enum Country {
  RO = 'RO', // Romania
  BG = 'BG', // Bulgaria
  HU = 'HU', // Hungary
  DE = 'DE', // Germany
  PL = 'PL'  // Poland
}

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Organization settings and preferences
 */
export interface OrganizationSettings {
  // Localization
  defaultLanguage?: 'ro' | 'bg' | 'en' | 'hu' | 'de';
  timezone?: string;

  // Notifications
  emailNotifications?: boolean;
  alertsEnabled?: boolean;

  // Compliance
  complianceModules?: {
    ssm?: boolean; // Securitate și Sănătate în Muncă
    psi?: boolean; // Prevenire și Stingere Incendii
    gdpr?: boolean;
    nis2?: boolean;
  };

  // Custom settings
  [key: string]: any;
}

/**
 * Full organization entity from database
 */
export interface Organization {
  id: string;
  name: string;
  slug?: string;

  // Company details
  cui?: string; // Cod Unic de Înregistrare (Romania)
  reg_com?: string; // Registrul Comerțului
  country: Country;
  city?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;

  // Subscription
  plan: OrgPlan;
  planExpiresAt?: string | null;
  trialEndsAt?: string | null;

  // Settings
  settings?: OrganizationSettings;

  // Metadata
  logoUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

  // Owner reference
  ownerId: string;
}

/**
 * Data required to create a new organization
 */
export interface OrganizationCreate {
  name: string;
  slug?: string;

  // Company details
  cui?: string;
  reg_com?: string;
  country: Country;
  city?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;

  // Optional settings
  plan?: OrgPlan;
  settings?: OrganizationSettings;
  logoUrl?: string;
}

/**
 * Organization membership (user-organization relationship)
 */
export interface Membership {
  id: string;

  // Relations
  userId: string;
  organizationId: string;

  // Role (legacy field, migrating to RBAC)
  role: MemberRole;

  // Permissions (for RBAC migration)
  permissions?: string[];

  // Metadata
  joinedAt: string;
  invitedBy?: string | null;
  isActive: boolean;
  lastAccessAt?: string | null;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

  // Expanded relations (optional, populated by joins)
  organization?: Organization;
  user?: {
    id: string;
    email: string;
    fullName?: string;
    avatarUrl?: string;
  };
}

/**
 * Organization invitation for new members
 */
export interface Invitation {
  id: string;

  // Relations
  organizationId: string;
  invitedBy: string;

  // Invitee details
  email: string;
  role: MemberRole;

  // Status
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  token: string;

  // Expiration
  expiresAt: string;
  acceptedAt?: string | null;

  // Timestamps
  createdAt: string;
  updatedAt: string;

  // Expanded relations (optional)
  organization?: Organization;
  inviter?: {
    id: string;
    email: string;
    fullName?: string;
  };
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Organization with member count (for lists)
 */
export interface OrganizationWithStats extends Organization {
  memberCount?: number;
  activeEmployees?: number;
  pendingAlerts?: number;
}

/**
 * Partial organization update
 */
export type OrganizationUpdate = Partial<Omit<Organization, 'id' | 'createdAt' | 'ownerId'>>;

/**
 * Membership with user details (for member lists)
 */
export interface MembershipWithUser extends Membership {
  user: {
    id: string;
    email: string;
    fullName?: string;
    avatarUrl?: string;
  };
}
