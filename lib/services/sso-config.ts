/**
 * SSO Configuration Service
 *
 * Provides SAML-based Single Sign-On integration for enterprise customers.
 * Supports: Azure AD, Google Workspace, Okta, and generic SAML 2.0 providers.
 *
 * Enterprise feature - requires feature flag check before use.
 */

import { createSupabaseServer } from '@/lib/supabase/server';
import { parseStringPromise } from 'xml2js';
import crypto from 'crypto';

export type SAMLProvider = 'azure-ad' | 'google-workspace' | 'okta' | 'generic';

export interface SAMLMetadata {
  entityId: string;
  ssoUrl: string;
  logoutUrl?: string;
  certificate: string;
}

export interface SAMLAttributeMapping {
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  role?: string;
  department?: string;
}

export interface SSOConfig {
  id: string;
  organizationId: string;
  provider: SAMLProvider;
  enabled: boolean;
  metadata: SAMLMetadata;
  attributeMapping: SAMLAttributeMapping;
  autoProvision: boolean;
  defaultRole?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SAMLAssertion {
  nameId: string;
  attributes: Record<string, string | string[]>;
  sessionIndex?: string;
  notBefore?: Date;
  notOnOrAfter?: Date;
}

/**
 * Default attribute mappings for common providers
 */
const DEFAULT_ATTRIBUTE_MAPPINGS: Record<SAMLProvider, SAMLAttributeMapping> = {
  'azure-ad': {
    email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
    firstName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname',
    lastName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname',
    displayName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
    role: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
  },
  'google-workspace': {
    email: 'email',
    firstName: 'firstName',
    lastName: 'lastName',
    displayName: 'displayName',
  },
  'okta': {
    email: 'email',
    firstName: 'firstName',
    lastName: 'lastName',
    displayName: 'displayName',
    role: 'role',
    department: 'department',
  },
  'generic': {
    email: 'email',
    firstName: 'firstName',
    lastName: 'lastName',
    displayName: 'displayName',
  },
};

/**
 * Configure SAML SSO for an organization
 */
export async function configureSAML(
  orgId: string,
  provider: SAMLProvider,
  metadataXml: string,
  options?: {
    autoProvision?: boolean;
    defaultRole?: string;
    customAttributeMapping?: Partial<SAMLAttributeMapping>;
  }
): Promise<{ success: boolean; configId?: string; error?: string }> {
  try {
    const supabase = await createSupabaseServer();

    // Verify user has admin access to organization
    const { data: membership } = await supabase
      .from('memberships')
      .select('role')
      .eq('organization_id', orgId)
      .single();

    if (!membership || !['consultant', 'firma_admin'].includes(membership.role)) {
      return { success: false, error: 'Acces interzis - necesită rol de administrator' };
    }

    // Parse SAML metadata XML
    const metadata = await parseSAMLMetadata(metadataXml);
    if (!metadata) {
      return { success: false, error: 'Metadata XML invalid sau incomplet' };
    }

    // Merge default and custom attribute mappings
    const attributeMapping: SAMLAttributeMapping = {
      ...DEFAULT_ATTRIBUTE_MAPPINGS[provider],
      ...options?.customAttributeMapping,
    };

    // Store SSO configuration
    const { data, error } = await supabase
      .from('sso_configs')
      .upsert({
        organization_id: orgId,
        provider,
        enabled: false, // Start disabled, enable after testing
        metadata,
        attribute_mapping: attributeMapping,
        auto_provision: options?.autoProvision ?? false,
        default_role: options?.defaultRole,
        updated_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error storing SSO config:', error);
      return { success: false, error: 'Eroare la salvarea configurației SSO' };
    }

    // Audit log
    await supabase.from('audit_log').insert({
      organization_id: orgId,
      action: 'sso_configured',
      details: { provider, enabled: false },
    });

    return { success: true, configId: data.id };
  } catch (error) {
    console.error('Error configuring SAML:', error);
    return { success: false, error: 'Eroare la configurarea SSO' };
  }
}

/**
 * Parse SAML metadata XML and extract key configuration
 */
export async function parseSAMLMetadata(
  metadataXml: string
): Promise<SAMLMetadata | null> {
  try {
    const parsed = await parseStringPromise(metadataXml, {
      explicitArray: false,
      tagNameProcessors: [stripNamespace],
    });

    const descriptor =
      parsed.EntityDescriptor?.IDPSSODescriptor ||
      parsed.EntitiesDescriptor?.EntityDescriptor?.IDPSSODescriptor;

    if (!descriptor) {
      console.error('No IDPSSODescriptor found in metadata');
      return null;
    }

    // Extract entity ID
    const entityId =
      parsed.EntityDescriptor?.['$']?.entityID ||
      parsed.EntitiesDescriptor?.EntityDescriptor?.['$']?.entityID;

    if (!entityId) {
      console.error('No entityID found in metadata');
      return null;
    }

    // Extract SSO URL
    const ssoService = Array.isArray(descriptor.SingleSignOnService)
      ? descriptor.SingleSignOnService.find(
          (s: any) => s['$']?.Binding?.includes('HTTP-Redirect') || s['$']?.Binding?.includes('HTTP-POST')
        )
      : descriptor.SingleSignOnService;

    const ssoUrl = ssoService?.['$']?.Location;
    if (!ssoUrl) {
      console.error('No SSO URL found in metadata');
      return null;
    }

    // Extract logout URL (optional)
    const logoutService = Array.isArray(descriptor.SingleLogoutService)
      ? descriptor.SingleLogoutService[0]
      : descriptor.SingleLogoutService;
    const logoutUrl = logoutService?.['$']?.Location;

    // Extract certificate
    const keyDescriptor = Array.isArray(descriptor.KeyDescriptor)
      ? descriptor.KeyDescriptor.find((k: any) => k['$']?.use === 'signing' || !k['$']?.use)
      : descriptor.KeyDescriptor;

    const certificate =
      keyDescriptor?.KeyInfo?.X509Data?.X509Certificate;

    if (!certificate) {
      console.error('No certificate found in metadata');
      return null;
    }

    return {
      entityId,
      ssoUrl,
      logoutUrl,
      certificate: certificate.trim(),
    };
  } catch (error) {
    console.error('Error parsing SAML metadata:', error);
    return null;
  }
}

/**
 * Handle SAML callback and authenticate user
 */
export async function handleSAMLCallback(
  assertion: string,
  orgId: string
): Promise<{
  success: boolean;
  userId?: string;
  profileId?: string;
  error?: string;
}> {
  try {
    const supabase = await createSupabaseServer();

    // Get SSO configuration for organization
    const { data: config } = await supabase
      .from('sso_configs')
      .select('*')
      .eq('organization_id', orgId)
      .eq('enabled', true)
      .single();

    if (!config) {
      return { success: false, error: 'SSO nu este configurat pentru această organizație' };
    }

    // Parse and validate SAML assertion
    const samlData = await parseSAMLAssertion(assertion);
    if (!samlData) {
      return { success: false, error: 'Assertion SAML invalid' };
    }

    // Verify signature
    const isValid = verifySAMLSignature(
      assertion,
      config.metadata.certificate
    );
    if (!isValid) {
      console.error('Invalid SAML signature');
      return { success: false, error: 'Semnătura SAML invalidă' };
    }

    // Check assertion validity period
    if (samlData.notBefore && new Date() < samlData.notBefore) {
      return { success: false, error: 'Assertion SAML nu este încă valid' };
    }
    if (samlData.notOnOrAfter && new Date() > samlData.notOnOrAfter) {
      return { success: false, error: 'Assertion SAML a expirat' };
    }

    // Map SAML attributes to user profile
    const userProfile = mapSAMLAttributes(samlData.attributes, config.attribute_mapping);
    if (!userProfile.email) {
      return { success: false, error: 'Email-ul nu a fost furnizat de provider-ul SSO' };
    }

    // Find or create user
    const { data, error: authError } = await supabase.auth.admin.listUsers();
    const users = data?.users || [];
    const user = authError ? null : users.find(u => u.email === userProfile.email);

    let userId: string;
    let profileId: string;

    if (user) {
      // Existing user
      userId = user.id;

      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      profileId = profile?.id;
    } else {
      // Auto-provision new user if enabled
      if (!config.auto_provision) {
        return {
          success: false,
          error: 'Utilizatorul nu există și auto-provisionarea este dezactivată',
        };
      }

      // Create new user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: userProfile.email,
        email_confirm: true,
        user_metadata: {
          full_name: userProfile.displayName || `${userProfile.firstName} ${userProfile.lastName}`,
          sso_provider: config.provider,
        },
      });

      if (createError || !newUser.user) {
        console.error('Error creating user:', createError);
        return { success: false, error: 'Eroare la crearea utilizatorului' };
      }

      userId = newUser.user.id;

      // Profile is created automatically via trigger
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      profileId = profile?.id;

      // Create membership if default role specified
      if (config.default_role) {
        await supabase.from('memberships').insert({
          organization_id: orgId,
          profile_id: profileId,
          role: config.default_role,
        });
      }
    }

    // Log SSO login
    await supabase.from('audit_log').insert({
      organization_id: orgId,
      profile_id: profileId,
      action: 'sso_login',
      details: {
        provider: config.provider,
        email: userProfile.email,
        nameId: samlData.nameId,
      },
    });

    return { success: true, userId, profileId };
  } catch (error) {
    console.error('Error handling SAML callback:', error);
    return { success: false, error: 'Eroare la procesarea callback-ului SAML' };
  }
}

/**
 * Parse SAML assertion
 */
async function parseSAMLAssertion(
  assertionXml: string
): Promise<SAMLAssertion | null> {
  try {
    const parsed = await parseStringPromise(assertionXml, {
      explicitArray: false,
      tagNameProcessors: [stripNamespace],
    });

    const assertion = parsed.Response?.Assertion || parsed.Assertion;
    if (!assertion) {
      return null;
    }

    // Extract NameID
    const nameId = assertion.Subject?.NameID?._ || assertion.Subject?.NameID;

    // Extract attributes
    const attributes: Record<string, string | string[]> = {};
    const attributeStatement = assertion.AttributeStatement;

    if (attributeStatement?.Attribute) {
      const attrs = Array.isArray(attributeStatement.Attribute)
        ? attributeStatement.Attribute
        : [attributeStatement.Attribute];

      attrs.forEach((attr: any) => {
        const name = attr['$']?.Name;
        const value = attr.AttributeValue;

        if (name && value) {
          attributes[name] = Array.isArray(value)
            ? value.map((v: any) => v._ || v)
            : value._ || value;
        }
      });
    }

    // Extract validity period
    const conditions = assertion.Conditions;
    const notBefore = conditions?.['$']?.NotBefore
      ? new Date(conditions['$'].NotBefore)
      : undefined;
    const notOnOrAfter = conditions?.['$']?.NotOnOrAfter
      ? new Date(conditions['$'].NotOnOrAfter)
      : undefined;

    // Extract session index
    const sessionIndex = assertion.AuthnStatement?.['$']?.SessionIndex;

    return {
      nameId,
      attributes,
      sessionIndex,
      notBefore,
      notOnOrAfter,
    };
  } catch (error) {
    console.error('Error parsing SAML assertion:', error);
    return null;
  }
}

/**
 * Verify SAML signature using certificate
 */
function verifySAMLSignature(
  assertionXml: string,
  certificate: string
): boolean {
  try {
    // Extract signature value from XML
    const signatureMatch = assertionXml.match(/<SignatureValue>([\s\S]*?)<\/SignatureValue>/);
    if (!signatureMatch) {
      console.error('No signature found in assertion');
      return false;
    }

    const signatureValue = signatureMatch[1].replace(/\s/g, '');

    // Extract signed info
    const signedInfoMatch = assertionXml.match(/<SignedInfo[\s\S]*?>([\s\S]*?)<\/SignedInfo>/);
    if (!signedInfoMatch) {
      console.error('No SignedInfo found in assertion');
      return false;
    }

    const signedInfo = `<SignedInfo>${signedInfoMatch[1]}</SignedInfo>`;

    // Verify signature
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(signedInfo);

    const publicKey = `-----BEGIN CERTIFICATE-----\n${certificate}\n-----END CERTIFICATE-----`;
    const isValid = verify.verify(publicKey, signatureValue, 'base64');

    return isValid;
  } catch (error) {
    console.error('Error verifying SAML signature:', error);
    return false;
  }
}

/**
 * Map SAML attributes to user profile
 */
export function mapSAMLAttributes(
  attributes: Record<string, string | string[]>,
  mapping: SAMLAttributeMapping
): {
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  role?: string;
  department?: string;
} {
  const getValue = (key: string): string | undefined => {
    const value = attributes[key];
    if (!value) return undefined;
    return Array.isArray(value) ? value[0] : value;
  };

  return {
    email: getValue(mapping.email),
    firstName: mapping.firstName ? getValue(mapping.firstName) : undefined,
    lastName: mapping.lastName ? getValue(mapping.lastName) : undefined,
    displayName: mapping.displayName ? getValue(mapping.displayName) : undefined,
    role: mapping.role ? getValue(mapping.role) : undefined,
    department: mapping.department ? getValue(mapping.department) : undefined,
  };
}

/**
 * Test SSO connection
 */
export async function testSSOConnection(
  configId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createSupabaseServer();

    const { data: config } = await supabase
      .from('sso_configs')
      .select('*')
      .eq('id', configId)
      .single();

    if (!config) {
      return { success: false, error: 'Configurație SSO nu a fost găsită' };
    }

    // Verify metadata is valid
    if (!config.metadata?.entityId || !config.metadata?.ssoUrl || !config.metadata?.certificate) {
      return { success: false, error: 'Metadata SSO incomplet' };
    }

    // Test certificate format
    try {
      const publicKey = `-----BEGIN CERTIFICATE-----\n${config.metadata.certificate}\n-----END CERTIFICATE-----`;
      crypto.createPublicKey(publicKey);
    } catch {
      return { success: false, error: 'Certificat SSO invalid' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error testing SSO connection:', error);
    return { success: false, error: 'Eroare la testarea conexiunii SSO' };
  }
}

/**
 * Enable/disable SSO for organization
 */
export async function toggleSSO(
  configId: string,
  enabled: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createSupabaseServer();

    // Test connection before enabling
    if (enabled) {
      const test = await testSSOConnection(configId);
      if (!test.success) {
        return { success: false, error: test.error };
      }
    }

    const { error } = await supabase
      .from('sso_configs')
      .update({ enabled, updated_at: new Date().toISOString() })
      .eq('id', configId);

    if (error) {
      console.error('Error toggling SSO:', error);
      return { success: false, error: 'Eroare la actualizarea configurației SSO' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error toggling SSO:', error);
    return { success: false, error: 'Eroare la modificarea stării SSO' };
  }
}

/**
 * Get SSO configuration for organization
 */
export async function getSSOConfig(
  orgId: string
): Promise<SSOConfig | null> {
  try {
    const supabase = await createSupabaseServer();

    const { data } = await supabase
      .from('sso_configs')
      .select('*')
      .eq('organization_id', orgId)
      .single();

    return data;
  } catch (error) {
    console.error('Error getting SSO config:', error);
    return null;
  }
}

/**
 * Helper to strip XML namespace prefixes
 */
function stripNamespace(name: string): string {
  return name.replace(/^.*:/, '');
}
