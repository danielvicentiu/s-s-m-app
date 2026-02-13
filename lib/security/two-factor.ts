/**
 * Two-Factor Authentication (2FA) Module
 *
 * Provides TOTP-based two-factor authentication compatible with Google Authenticator
 * and other standard authenticator apps, plus backup codes functionality.
 *
 * Features:
 * - TOTP secret generation and verification
 * - QR code generation for easy setup
 * - Backup codes generation and verification
 * - Enable/disable 2FA with validation
 */

import { TOTP, Secret } from 'otpauth';
import * as QRCode from 'qrcode';
import { createSupabaseServer } from '@/lib/supabase/server';
import { createSupabaseBrowser } from '@/lib/supabase/client';

// Constants
const TOTP_ISSUER = 's-s-m.ro';
const TOTP_ALGORITHM = 'SHA1';
const TOTP_DIGITS = 6;
const TOTP_PERIOD = 30; // seconds
const BACKUP_CODE_LENGTH = 8;
const BACKUP_CODE_CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excludes ambiguous chars

export interface TwoFactorSecret {
  secret: string;
  uri: string;
}

export interface QRCodeResult {
  qrCodeDataUrl: string;
  secret: string;
  uri: string;
}

export interface BackupCode {
  code: string;
  used: boolean;
}

export interface TwoFactorStatus {
  enabled: boolean;
  backupCodesRemaining: number;
}

/**
 * Generates a new TOTP secret for a user
 *
 * @param userId - The user's ID
 * @param userEmail - The user's email (displayed in authenticator app)
 * @returns Secret string and OTP auth URI
 */
export async function generateSecret(userId: string, userEmail: string): Promise<TwoFactorSecret> {
  try {
    // Generate a random secret
    const secret = new Secret({ size: 20 });

    // Create TOTP instance
    const totp = new TOTP({
      issuer: TOTP_ISSUER,
      label: userEmail,
      algorithm: TOTP_ALGORITHM,
      digits: TOTP_DIGITS,
      period: TOTP_PERIOD,
      secret: secret,
    });

    // Generate OTPAuth URI for QR code
    const uri = totp.toString();

    return {
      secret: secret.base32,
      uri,
    };
  } catch (error) {
    console.error('Error generating 2FA secret:', error);
    throw new Error('Nu s-a putut genera secretul 2FA');
  }
}

/**
 * Generates a QR code for TOTP setup
 *
 * @param secret - The TOTP secret (base32 encoded)
 * @param userEmail - The user's email
 * @returns QR code as data URL, secret, and URI
 */
export async function generateQRCode(secret: string, userEmail: string): Promise<QRCodeResult> {
  try {
    // Reconstruct the TOTP with the provided secret
    const totp = new TOTP({
      issuer: TOTP_ISSUER,
      label: userEmail,
      algorithm: TOTP_ALGORITHM,
      digits: TOTP_DIGITS,
      period: TOTP_PERIOD,
      secret: Secret.fromBase32(secret),
    });

    const uri = totp.toString();

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(uri, {
      errorCorrectionLevel: 'M',
      width: 300,
      margin: 2,
    });

    return {
      qrCodeDataUrl,
      secret,
      uri,
    };
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Nu s-a putut genera codul QR pentru 2FA');
  }
}

/**
 * Verifies a TOTP token against a user's secret
 *
 * @param userId - The user's ID
 * @param token - The 6-digit token from authenticator app
 * @param window - Time window for validation (default: 1 = ±30 seconds)
 * @returns True if token is valid, false otherwise
 */
export async function verifyToken(
  userId: string,
  token: string,
  window: number = 1
): Promise<boolean> {
  try {
    const supabase = await createSupabaseServer();

    // Get user's 2FA secret from profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('two_factor_secret')
      .eq('id', userId)
      .single();

    if (error || !profile?.two_factor_secret) {
      console.error('Error fetching 2FA secret:', error);
      return false;
    }

    // Create TOTP instance with user's secret
    const totp = new TOTP({
      issuer: TOTP_ISSUER,
      algorithm: TOTP_ALGORITHM,
      digits: TOTP_DIGITS,
      period: TOTP_PERIOD,
      secret: Secret.fromBase32(profile.two_factor_secret),
    });

    // Validate token with time window
    const delta = totp.validate({
      token,
      window,
    });

    // delta is null if invalid, or number if valid (indicating time offset)
    return delta !== null;
  } catch (error) {
    console.error('Error verifying 2FA token:', error);
    return false;
  }
}

/**
 * Verifies a TOTP token for browser/client-side usage
 *
 * @param userId - The user's ID
 * @param token - The 6-digit token from authenticator app
 * @param window - Time window for validation (default: 1 = ±30 seconds)
 * @returns True if token is valid, false otherwise
 */
export async function verifyTokenClient(
  userId: string,
  token: string,
  window: number = 1
): Promise<boolean> {
  try {
    const supabase = createSupabaseBrowser();

    // Get user's 2FA secret from profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('two_factor_secret')
      .eq('id', userId)
      .single();

    if (error || !profile?.two_factor_secret) {
      console.error('Error fetching 2FA secret:', error);
      return false;
    }

    // Create TOTP instance with user's secret
    const totp = new TOTP({
      issuer: TOTP_ISSUER,
      algorithm: TOTP_ALGORITHM,
      digits: TOTP_DIGITS,
      period: TOTP_PERIOD,
      secret: Secret.fromBase32(profile.two_factor_secret),
    });

    // Validate token with time window
    const delta = totp.validate({
      token,
      window,
    });

    return delta !== null;
  } catch (error) {
    console.error('Error verifying 2FA token:', error);
    return false;
  }
}

/**
 * Enables 2FA for a user after verifying setup token
 *
 * @param userId - The user's ID
 * @param secret - The TOTP secret to save
 * @param token - Verification token from authenticator app
 * @returns Success status and backup codes if successful
 */
export async function enable2FA(
  userId: string,
  secret: string,
  token: string
): Promise<{ success: boolean; backupCodes?: string[]; error?: string }> {
  try {
    const supabase = await createSupabaseServer();

    // First verify the token with the provided secret
    const totp = new TOTP({
      issuer: TOTP_ISSUER,
      algorithm: TOTP_ALGORITHM,
      digits: TOTP_DIGITS,
      period: TOTP_PERIOD,
      secret: Secret.fromBase32(secret),
    });

    const delta = totp.validate({
      token,
      window: 1,
    });

    if (delta === null) {
      return {
        success: false,
        error: 'Codul de verificare este invalid sau a expirat',
      };
    }

    // Generate backup codes
    const backupCodesResult = await generateBackupCodes(userId, 10);
    if (!backupCodesResult.success || !backupCodesResult.codes) {
      return {
        success: false,
        error: 'Nu s-au putut genera codurile de backup',
      };
    }

    // Save the secret and enable 2FA
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        two_factor_secret: secret,
        two_factor_enabled: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error enabling 2FA:', updateError);
      return {
        success: false,
        error: 'Nu s-a putut activa autentificarea cu doi factori',
      };
    }

    return {
      success: true,
      backupCodes: backupCodesResult.codes,
    };
  } catch (error) {
    console.error('Error enabling 2FA:', error);
    return {
      success: false,
      error: 'Eroare la activarea autentificării cu doi factori',
    };
  }
}

/**
 * Disables 2FA for a user after verifying current token
 *
 * @param userId - The user's ID
 * @param token - Current valid token from authenticator app
 * @returns Success status
 */
export async function disable2FA(
  userId: string,
  token: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // First verify the token
    const isValid = await verifyToken(userId, token);

    if (!isValid) {
      return {
        success: false,
        error: 'Codul de verificare este invalid',
      };
    }

    const supabase = await createSupabaseServer();

    // Disable 2FA and clear secret
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        two_factor_secret: null,
        two_factor_enabled: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error disabling 2FA:', updateError);
      return {
        success: false,
        error: 'Nu s-a putut dezactiva autentificarea cu doi factori',
      };
    }

    // Delete all backup codes
    const { error: deleteError } = await supabase
      .from('two_factor_backup_codes')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting backup codes:', deleteError);
      // Don't fail the entire operation if backup codes deletion fails
    }

    return { success: true };
  } catch (error) {
    console.error('Error disabling 2FA:', error);
    return {
      success: false,
      error: 'Eroare la dezactivarea autentificării cu doi factori',
    };
  }
}

/**
 * Generates a random backup code
 *
 * @param length - Length of the code
 * @returns Random alphanumeric code
 */
function generateRandomCode(length: number): string {
  let code = '';
  const charset = BACKUP_CODE_CHARSET;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    code += charset[randomIndex];
  }

  return code;
}

/**
 * Hashes a backup code for storage (simple hash for demo - use bcrypt in production)
 *
 * @param code - The plain text code
 * @returns Hashed code
 */
async function hashBackupCode(code: string): Promise<string> {
  // In production, use bcrypt or similar
  // For now, we'll store them in plain text in the database
  // and rely on RLS and encryption at rest
  return code;
}

/**
 * Generates backup codes for 2FA recovery
 *
 * @param userId - The user's ID
 * @param count - Number of codes to generate (default: 10)
 * @returns Array of backup codes
 */
export async function generateBackupCodes(
  userId: string,
  count: number = 10
): Promise<{ success: boolean; codes?: string[]; error?: string }> {
  try {
    const supabase = await createSupabaseServer();

    // Delete existing backup codes
    const { error: deleteError } = await supabase
      .from('two_factor_backup_codes')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting old backup codes:', deleteError);
    }

    // Generate new codes
    const codes: string[] = [];
    const codeRecords = [];

    for (let i = 0; i < count; i++) {
      const code = generateRandomCode(BACKUP_CODE_LENGTH);
      codes.push(code);

      const hashedCode = await hashBackupCode(code);
      codeRecords.push({
        user_id: userId,
        code: hashedCode,
        used: false,
      });
    }

    // Insert new backup codes
    const { error: insertError } = await supabase
      .from('two_factor_backup_codes')
      .insert(codeRecords);

    if (insertError) {
      console.error('Error inserting backup codes:', insertError);
      return {
        success: false,
        error: 'Nu s-au putut genera codurile de backup',
      };
    }

    return {
      success: true,
      codes,
    };
  } catch (error) {
    console.error('Error generating backup codes:', error);
    return {
      success: false,
      error: 'Eroare la generarea codurilor de backup',
    };
  }
}

/**
 * Verifies a backup code and marks it as used
 *
 * @param userId - The user's ID
 * @param code - The backup code to verify
 * @returns True if code is valid and unused, false otherwise
 */
export async function verifyBackupCode(userId: string, code: string): Promise<boolean> {
  try {
    const supabase = await createSupabaseServer();

    // Find the backup code
    const { data: backupCode, error: fetchError } = await supabase
      .from('two_factor_backup_codes')
      .select('*')
      .eq('user_id', userId)
      .eq('code', code)
      .eq('used', false)
      .single();

    if (fetchError || !backupCode) {
      console.error('Error fetching backup code:', fetchError);
      return false;
    }

    // Mark the code as used
    const { error: updateError } = await supabase
      .from('two_factor_backup_codes')
      .update({ used: true })
      .eq('id', backupCode.id);

    if (updateError) {
      console.error('Error marking backup code as used:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error verifying backup code:', error);
    return false;
  }
}

/**
 * Gets 2FA status for a user
 *
 * @param userId - The user's ID
 * @returns 2FA enabled status and backup codes remaining
 */
export async function get2FAStatus(userId: string): Promise<TwoFactorStatus> {
  try {
    const supabase = await createSupabaseServer();

    // Get 2FA enabled status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('two_factor_enabled')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching 2FA status:', profileError);
      return {
        enabled: false,
        backupCodesRemaining: 0,
      };
    }

    // Count unused backup codes
    const { count, error: countError } = await supabase
      .from('two_factor_backup_codes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('used', false);

    if (countError) {
      console.error('Error counting backup codes:', countError);
    }

    return {
      enabled: profile?.two_factor_enabled || false,
      backupCodesRemaining: count || 0,
    };
  } catch (error) {
    console.error('Error getting 2FA status:', error);
    return {
      enabled: false,
      backupCodesRemaining: 0,
    };
  }
}

// Export types and constants for external use
export { TOTP_ISSUER, TOTP_DIGITS, TOTP_PERIOD };
