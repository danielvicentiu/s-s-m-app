// lib/api/validation.ts
// Zod validation schemas for API V1

import { z } from 'zod'

/**
 * Schema: Create Organization
 */
export const createOrganizationSchema = z.object({
  name: z.string().min(2, 'Numele trebuie să aibă minim 2 caractere').max(255),
  cui: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  county: z.string().optional().nullable(),
  contact_email: z.string().email('Email invalid').optional().nullable(),
  contact_phone: z.string().optional().nullable(),
  preferred_channels: z.array(z.enum(['email', 'whatsapp', 'sms', 'push'])).optional().default([]),
  cooperation_status: z.enum(['active', 'warning', 'uncooperative']).optional().default('active'),
  exposure_score: z.enum(['necalculat', 'scazut', 'mediu', 'ridicat', 'critic']).optional().default('necalculat')
})

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>

/**
 * Schema: Update Organization (partial)
 */
export const updateOrganizationSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  cui: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  county: z.string().optional().nullable(),
  contact_email: z.string().email('Email invalid').optional().nullable(),
  contact_phone: z.string().optional().nullable(),
  preferred_channels: z.array(z.enum(['email', 'whatsapp', 'sms', 'push'])).optional(),
  cooperation_status: z.enum(['active', 'warning', 'uncooperative']).optional(),
  exposure_score: z.enum(['necalculat', 'scazut', 'mediu', 'ridicat', 'critic']).optional()
})

export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>

/**
 * Schema: Query parameters for filtering organizations
 */
export const organizationQuerySchema = z.object({
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  cooperation_status: z.enum(['active', 'warning', 'uncooperative']).optional(),
  exposure_score: z.enum(['necalculat', 'scazut', 'mediu', 'ridicat', 'critic']).optional(),
  county: z.string().optional(),
  search: z.string().optional()
})

export type OrganizationQueryParams = z.infer<typeof organizationQuerySchema>

/**
 * Schema: Create Employee
 */
export const createEmployeeSchema = z.object({
  organization_id: z.string().uuid('ID organizație invalid'),
  full_name: z.string().min(2, 'Numele trebuie să aibă minim 2 caractere').max(255),
  cnp: z.string().optional().nullable(),
  email: z.string().email('Email invalid').optional().nullable(),
  phone: z.string().optional().nullable(),
  job_title: z.string().optional().nullable(),
  cor_code: z.string().optional().nullable(),
  nationality: z.string().optional().default('RO'),
  hire_date: z.string().optional().nullable(),
  termination_date: z.string().optional().nullable(),
  is_active: z.boolean().optional().default(true),
  user_id: z.string().uuid().optional().nullable()
})

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>

/**
 * Schema: Update Employee (partial)
 */
export const updateEmployeeSchema = z.object({
  full_name: z.string().min(2).max(255).optional(),
  cnp: z.string().optional().nullable(),
  email: z.string().email('Email invalid').optional().nullable(),
  phone: z.string().optional().nullable(),
  job_title: z.string().optional().nullable(),
  cor_code: z.string().optional().nullable(),
  nationality: z.string().optional(),
  hire_date: z.string().optional().nullable(),
  termination_date: z.string().optional().nullable(),
  is_active: z.boolean().optional()
})

export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>

/**
 * Custom validation: CNP (Cod Numeric Personal)
 * 13 digits for Romanian CNP
 */
export function validateCNP(cnp: string): boolean {
  if (!cnp || cnp.length !== 13) return false
  if (!/^\d{13}$/.test(cnp)) return false

  // Basic validation: first digit 1-8 (sex + century)
  const firstDigit = parseInt(cnp[0])
  if (firstDigit < 1 || firstDigit > 8) return false

  return true
}

/**
 * Custom validation: Email uniqueness check
 * Should be called in route handlers
 */
export function validateEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Schema: Create Training Assignment (single or multi-employee)
 */
export const createTrainingAssignmentSchema = z.object({
  organization_id: z.string().uuid('ID organizație invalid'),
  module_id: z.string().uuid('ID modul invalid'),
  worker_ids: z.array(z.string().uuid('ID angajat invalid')).min(1, 'Trebuie să selectezi cel puțin un angajat'),
  assigned_by: z.string().uuid('ID utilizator invalid'),
  due_date: z.string().optional().nullable(),
  notes: z.string().optional().nullable()
})

export type CreateTrainingAssignmentInput = z.infer<typeof createTrainingAssignmentSchema>

/**
 * Schema: Update Training Assignment (partial)
 */
export const updateTrainingAssignmentSchema = z.object({
  status: z.enum(['assigned', 'in_progress', 'completed', 'overdue', 'expired', 'exempted']).optional(),
  due_date: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  completed_at: z.string().optional().nullable(),
  next_due_date: z.string().optional().nullable()
})

export type UpdateTrainingAssignmentInput = z.infer<typeof updateTrainingAssignmentSchema>

/**
 * Schema: Query parameters for filtering trainings
 */
export const trainingQuerySchema = z.object({
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  organization_id: z.string().uuid().optional(),
  worker_id: z.string().uuid().optional(),
  module_id: z.string().uuid().optional(),
  status: z.enum(['assigned', 'in_progress', 'completed', 'overdue', 'expired', 'exempted']).optional(),
  category: z.enum(['ssm', 'psi', 'su', 'nis2', 'custom']).optional(),
  training_type: z.enum(['introductiv_general', 'la_locul_de_munca', 'periodic', 'suplimentar', 'psi', 'situatii_urgenta', 'custom']).optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  search: z.string().optional()
})

export type TrainingQueryParams = z.infer<typeof trainingQuerySchema>
