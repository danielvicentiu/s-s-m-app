/**
 * RBAC SERVICE — Dynamic Role-Based Access Control
 *
 * Replaces hardcoded memberships.role with flexible roles/permissions system
 * Tables: roles, permissions, user_roles
 *
 * @module rbac-service
 * @created 2026-02-13
 */

import { createSupabaseServer } from '@/lib/supabase/server';
import { Resource, Action, RoleKey } from '@/lib/rbac';

// ──────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────

export interface Role {
  id: string;
  role_key: RoleKey;
  role_name: string;
  description: string | null;
  country_code: string | null;
  is_system: boolean;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  metadata: Record<string, any>;
}

export interface Permission {
  id: string;
  role_id: string;
  resource: Resource;
  action: Action;
  field_restrictions: Record<string, string>;
  conditions: Record<string, any>;
  country_code: string | null;
  is_active: boolean;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  company_id: string | null;
  location_id: string | null;
  granted_by: string | null;
  granted_at: string;
  expires_at: string | null;
  is_active: boolean;
}

export interface CreateRoleInput {
  role_key: RoleKey;
  role_name: string;
  description?: string;
  country_code?: string | null;
  is_system?: boolean;
  metadata?: Record<string, any>;
}

export interface UpdateRoleInput {
  role_name?: string;
  description?: string;
  country_code?: string | null;
  is_active?: boolean;
  metadata?: Record<string, any>;
}

export interface CreatePermissionInput {
  resource: Resource;
  action: Action;
  field_restrictions?: Record<string, string>;
  conditions?: Record<string, any>;
  country_code?: string | null;
}

export interface AssignRoleInput {
  user_id: string;
  role_id: string;
  company_id?: string | null;
  location_id?: string | null;
  expires_at?: string | null;
}

// ──────────────────────────────────────────────────────────────
// ROLE MANAGEMENT
// ──────────────────────────────────────────────────────────────

/**
 * Get all roles for an organization context (filtered by country if needed)
 * If orgId provided, returns roles relevant to that org's country_code
 */
export async function getRoles(orgId?: string): Promise<Role[]> {
  const supabase = await createSupabaseServer();

  let query = supabase
    .from('roles')
    .select('*')
    .order('role_name');

  // If orgId provided, filter by organization's country
  if (orgId) {
    const { data: org } = await supabase
      .from('organizations')
      .select('country_code')
      .eq('id', orgId)
      .single();

    if (org?.country_code) {
      // Return roles for this country OR global roles (country_code IS NULL)
      query = query.or(`country_code.eq.${org.country_code},country_code.is.null`);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('[rbac-service] getRoles error:', error);
    throw new Error(`Failed to fetch roles: ${error.message}`);
  }

  return data || [];
}

/**
 * Get a single role by ID
 */
export async function getRole(roleId: string): Promise<Role | null> {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('id', roleId)
    .single();

  if (error) {
    console.error('[rbac-service] getRole error:', error);
    return null;
  }

  return data;
}

/**
 * Get a role by role_key (unique identifier)
 */
export async function getRoleByKey(roleKey: RoleKey): Promise<Role | null> {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('role_key', roleKey)
    .single();

  if (error) {
    console.error('[rbac-service] getRoleByKey error:', error);
    return null;
  }

  return data;
}

/**
 * Create a new role
 * Only super_admin can create roles
 */
export async function createRole(input: CreateRoleInput): Promise<Role> {
  const supabase = await createSupabaseServer();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Authentication required');
  }

  // Check for duplicate role_key
  const existing = await getRoleByKey(input.role_key);
  if (existing) {
    throw new Error(`Role with key "${input.role_key}" already exists`);
  }

  const { data, error } = await supabase
    .from('roles')
    .insert({
      role_key: input.role_key,
      role_name: input.role_name,
      description: input.description || null,
      country_code: input.country_code || null,
      is_system: input.is_system || false,
      metadata: input.metadata || {},
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('[rbac-service] createRole error:', error);
    throw new Error(`Failed to create role: ${error.message}`);
  }

  return data;
}

/**
 * Update an existing role
 * System roles (is_system=true) have restrictions
 */
export async function updateRole(roleId: string, input: UpdateRoleInput): Promise<Role> {
  const supabase = await createSupabaseServer();

  // Check if role is system-protected
  const existing = await getRole(roleId);
  if (!existing) {
    throw new Error('Role not found');
  }

  if (existing.is_system) {
    // System roles can only update description and metadata
    if (input.role_name || input.country_code !== undefined || input.is_active === false) {
      throw new Error('System roles cannot be renamed, moved, or deactivated');
    }
  }

  const { data, error } = await supabase
    .from('roles')
    .update({
      ...(input.role_name && { role_name: input.role_name }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.country_code !== undefined && { country_code: input.country_code }),
      ...(input.is_active !== undefined && { is_active: input.is_active }),
      ...(input.metadata && { metadata: input.metadata }),
    })
    .eq('id', roleId)
    .select()
    .single();

  if (error) {
    console.error('[rbac-service] updateRole error:', error);
    throw new Error(`Failed to update role: ${error.message}`);
  }

  return data;
}

/**
 * Delete a role (soft delete via is_active = false)
 * System roles cannot be deleted
 */
export async function deleteRole(roleId: string): Promise<void> {
  const supabase = await createSupabaseServer();

  // Check if role is system-protected
  const existing = await getRole(roleId);
  if (!existing) {
    throw new Error('Role not found');
  }

  if (existing.is_system) {
    throw new Error('System roles cannot be deleted');
  }

  // Soft delete — set is_active = false
  const { error } = await supabase
    .from('roles')
    .update({ is_active: false })
    .eq('id', roleId);

  if (error) {
    console.error('[rbac-service] deleteRole error:', error);
    throw new Error(`Failed to delete role: ${error.message}`);
  }
}

// ──────────────────────────────────────────────────────────────
// PERMISSION MANAGEMENT
// ──────────────────────────────────────────────────────────────

/**
 * Get all permissions for a role
 */
export async function getRolePermissions(roleId: string): Promise<Permission[]> {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from('permissions')
    .select('*')
    .eq('role_id', roleId)
    .eq('is_active', true)
    .order('resource');

  if (error) {
    console.error('[rbac-service] getRolePermissions error:', error);
    throw new Error(`Failed to fetch permissions: ${error.message}`);
  }

  return data || [];
}

/**
 * Add permission to a role
 */
export async function addPermission(
  roleId: string,
  input: CreatePermissionInput
): Promise<Permission> {
  const supabase = await createSupabaseServer();

  // Check for duplicate permission
  const { data: existing } = await supabase
    .from('permissions')
    .select('id')
    .eq('role_id', roleId)
    .eq('resource', input.resource)
    .eq('action', input.action)
    .eq('country_code', input.country_code || null)
    .single();

  if (existing) {
    throw new Error(`Permission for ${input.resource}:${input.action} already exists for this role`);
  }

  const { data, error } = await supabase
    .from('permissions')
    .insert({
      role_id: roleId,
      resource: input.resource,
      action: input.action,
      field_restrictions: input.field_restrictions || {},
      conditions: input.conditions || {},
      country_code: input.country_code || null,
    })
    .select()
    .single();

  if (error) {
    console.error('[rbac-service] addPermission error:', error);
    throw new Error(`Failed to add permission: ${error.message}`);
  }

  return data;
}

/**
 * Update a permission
 */
export async function updatePermission(
  permissionId: string,
  input: Partial<CreatePermissionInput>
): Promise<Permission> {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from('permissions')
    .update({
      ...(input.field_restrictions && { field_restrictions: input.field_restrictions }),
      ...(input.conditions && { conditions: input.conditions }),
      ...(input.country_code !== undefined && { country_code: input.country_code }),
    })
    .eq('id', permissionId)
    .select()
    .single();

  if (error) {
    console.error('[rbac-service] updatePermission error:', error);
    throw new Error(`Failed to update permission: ${error.message}`);
  }

  return data;
}

/**
 * Remove a permission (soft delete)
 */
export async function removePermission(permissionId: string): Promise<void> {
  const supabase = await createSupabaseServer();

  const { error } = await supabase
    .from('permissions')
    .update({ is_active: false })
    .eq('id', permissionId);

  if (error) {
    console.error('[rbac-service] removePermission error:', error);
    throw new Error(`Failed to remove permission: ${error.message}`);
  }
}

/**
 * Bulk update permissions for a role
 * Replaces all permissions with the new set
 */
export async function updateRolePermissions(
  roleId: string,
  permissions: CreatePermissionInput[]
): Promise<Permission[]> {
  const supabase = await createSupabaseServer();

  // Deactivate all existing permissions
  await supabase
    .from('permissions')
    .update({ is_active: false })
    .eq('role_id', roleId);

  // Insert new permissions
  const newPermissions = permissions.map(p => ({
    role_id: roleId,
    resource: p.resource,
    action: p.action,
    field_restrictions: p.field_restrictions || {},
    conditions: p.conditions || {},
    country_code: p.country_code || null,
  }));

  const { data, error } = await supabase
    .from('permissions')
    .insert(newPermissions)
    .select();

  if (error) {
    console.error('[rbac-service] updateRolePermissions error:', error);
    throw new Error(`Failed to update permissions: ${error.message}`);
  }

  return data || [];
}

// ──────────────────────────────────────────────────────────────
// USER ROLE ASSIGNMENT
// ──────────────────────────────────────────────────────────────

/**
 * Assign a role to a user
 * Can be scoped to a company/location
 */
export async function assignRole(input: AssignRoleInput): Promise<UserRole> {
  const supabase = await createSupabaseServer();

  // Get current user (who is granting the role)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Authentication required');
  }

  // Check for duplicate assignment
  const { data: existing } = await supabase
    .from('user_roles')
    .select('id')
    .eq('user_id', input.user_id)
    .eq('role_id', input.role_id)
    .eq('company_id', input.company_id || null)
    .single();

  if (existing) {
    throw new Error('This role is already assigned to the user for this company');
  }

  const { data, error } = await supabase
    .from('user_roles')
    .insert({
      user_id: input.user_id,
      role_id: input.role_id,
      company_id: input.company_id || null,
      location_id: input.location_id || null,
      granted_by: user.id,
      expires_at: input.expires_at || null,
    })
    .select()
    .single();

  if (error) {
    console.error('[rbac-service] assignRole error:', error);
    throw new Error(`Failed to assign role: ${error.message}`);
  }

  return data;
}

/**
 * Revoke a role from a user (soft delete)
 */
export async function revokeRole(userRoleId: string): Promise<void> {
  const supabase = await createSupabaseServer();

  const { error } = await supabase
    .from('user_roles')
    .update({ is_active: false })
    .eq('id', userRoleId);

  if (error) {
    console.error('[rbac-service] revokeRole error:', error);
    throw new Error(`Failed to revoke role: ${error.message}`);
  }
}

/**
 * Get all roles assigned to a user
 */
export async function getUserRoles(userId: string, orgId?: string): Promise<UserRole[]> {
  const supabase = await createSupabaseServer();

  let query = supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (orgId) {
    query = query.eq('company_id', orgId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[rbac-service] getUserRoles error:', error);
    throw new Error(`Failed to fetch user roles: ${error.message}`);
  }

  return data || [];
}

/**
 * Get all users with a specific role
 */
export async function getRoleUsers(roleId: string, orgId?: string): Promise<UserRole[]> {
  const supabase = await createSupabaseServer();

  let query = supabase
    .from('user_roles')
    .select('*')
    .eq('role_id', roleId)
    .eq('is_active', true);

  if (orgId) {
    query = query.eq('company_id', orgId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[rbac-service] getRoleUsers error:', error);
    throw new Error(`Failed to fetch role users: ${error.message}`);
  }

  return data || [];
}

// ──────────────────────────────────────────────────────────────
// PERMISSION CHECKING
// ──────────────────────────────────────────────────────────────

/**
 * Check if a user has permission for a resource/action
 * This is the core permission check function
 */
export async function checkPermission(
  userId: string,
  orgId: string | null,
  resource: Resource,
  action: Action
): Promise<boolean> {
  const supabase = await createSupabaseServer();

  // First check if user is super_admin
  const { data: superAdminRole } = await supabase
    .from('user_roles')
    .select('roles!inner(role_key)')
    .eq('user_id', userId)
    .eq('is_active', true)
    .eq('roles.role_key', 'super_admin')
    .single();

  if (superAdminRole) {
    return true; // Super admin has all permissions
  }

  // Get user's active roles for this org (or global roles)
  let roleQuery = supabase
    .from('user_roles')
    .select('role_id')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (orgId) {
    roleQuery = roleQuery.or(`company_id.eq.${orgId},company_id.is.null`);
  } else {
    roleQuery = roleQuery.is('company_id', null);
  }

  const { data: userRoles, error: rolesError } = await roleQuery;

  if (rolesError || !userRoles || userRoles.length === 0) {
    return false;
  }

  const roleIds = userRoles.map(ur => ur.role_id);

  // Check if any of these roles has the required permission
  const { data: permissions, error: permError } = await supabase
    .from('permissions')
    .select('id')
    .in('role_id', roleIds)
    .eq('resource', resource)
    .eq('action', action)
    .eq('is_active', true);

  if (permError) {
    console.error('[rbac-service] checkPermission error:', permError);
    return false;
  }

  return (permissions?.length ?? 0) > 0;
}

/**
 * Get all permissions for a user (aggregated from all their roles)
 */
export async function getUserPermissions(
  userId: string,
  orgId?: string | null
): Promise<Permission[]> {
  const supabase = await createSupabaseServer();

  // Get user's active roles
  let roleQuery = supabase
    .from('user_roles')
    .select('role_id')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (orgId) {
    roleQuery = roleQuery.or(`company_id.eq.${orgId},company_id.is.null`);
  }

  const { data: userRoles } = await roleQuery;

  if (!userRoles || userRoles.length === 0) {
    return [];
  }

  const roleIds = userRoles.map(ur => ur.role_id);

  // Get all permissions for these roles
  const { data: permissions, error } = await supabase
    .from('permissions')
    .select('*')
    .in('role_id', roleIds)
    .eq('is_active', true);

  if (error) {
    console.error('[rbac-service] getUserPermissions error:', error);
    return [];
  }

  return permissions || [];
}

/**
 * Check if a user has a specific role
 */
export async function hasUserRole(
  userId: string,
  roleKey: RoleKey,
  orgId?: string | null
): Promise<boolean> {
  const supabase = await createSupabaseServer();

  let query = supabase
    .from('user_roles')
    .select('roles!inner(role_key)')
    .eq('user_id', userId)
    .eq('is_active', true)
    .eq('roles.role_key', roleKey);

  if (orgId) {
    query = query.eq('company_id', orgId);
  }

  const { data } = await query;

  return (data?.length ?? 0) > 0;
}

// ──────────────────────────────────────────────────────────────
// EXPORTS
// ──────────────────────────────────────────────────────────────

export default {
  // Role management
  getRoles,
  getRole,
  getRoleByKey,
  createRole,
  updateRole,
  deleteRole,

  // Permission management
  getRolePermissions,
  addPermission,
  updatePermission,
  removePermission,
  updateRolePermissions,

  // User role assignment
  assignRole,
  revokeRole,
  getUserRoles,
  getRoleUsers,

  // Permission checking
  checkPermission,
  getUserPermissions,
  hasUserRole,
};
