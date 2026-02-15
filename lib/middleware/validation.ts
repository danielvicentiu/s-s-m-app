// lib/middleware/validation.ts
// Validation schemas for API routes

export interface OrganizationInput {
  name: string
  cui?: string
  country_code?: string
  caen_code?: string
  industry_domain?: string
  address?: string
  city?: string
  county?: string
  email?: string
  phone?: string
}

export const organizationSchema = {
  validate(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
      errors.push('name is required and must be at least 2 characters')
    }

    if (data.cui && typeof data.cui !== 'string') {
      errors.push('cui must be a string')
    }

    if (data.country_code && typeof data.country_code !== 'string') {
      errors.push('country_code must be a string')
    }

    if (data.email && typeof data.email === 'string' && !data.email.includes('@')) {
      errors.push('email must be a valid email address')
    }

    return { valid: errors.length === 0, errors }
  },

  parse(data: any): OrganizationInput {
    const result = this.validate(data)
    if (!result.valid) {
      throw new Error(`Validation failed: ${result.errors.join(', ')}`)
    }
    return {
      name: data.name.trim(),
      cui: data.cui?.trim() || undefined,
      country_code: data.country_code || 'RO',
      caen_code: data.caen_code?.trim() || undefined,
      industry_domain: data.industry_domain?.trim() || undefined,
      address: data.address?.trim() || undefined,
      city: data.city?.trim() || undefined,
      county: data.county?.trim() || undefined,
      email: data.email?.trim() || undefined,
      phone: data.phone?.trim() || undefined,
    }
  }
}
