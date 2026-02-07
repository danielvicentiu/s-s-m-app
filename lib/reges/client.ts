// ============================================================
// S-S-M.RO — REGES API Client
// File: lib/reges/client.ts
//
// Client HTTP pentru REGES API (ANRE)
// Endpoints: employees, contracts, employer info
// ============================================================

import { getAccessToken } from './auth';

// REGES API base URL
const REGES_API_BASE = 'https://reges.anre.ro/api/v1';

// ============================================================
// Types - REGES API Responses
// ============================================================

/**
 * Angajat din REGES
 */
export interface RegesEmployee {
  id: string;
  cnp: string;
  nume: string;
  prenume: string;
  functie: string;
  tipContract: string;
  dataAngajare: string; // ISO date
  dataIncetare?: string; // ISO date
  status: 'activ' | 'plecat' | 'suspendat';
  codCOR?: string;
  salariuBrut?: number;
  departament?: string;
}

/**
 * Contract de muncă din REGES
 */
export interface RegesContract {
  id: string;
  angajatId: string;
  cnp: string;
  tipContract: 'CIM' | 'CIM_DETERMINATE' | 'COLABORARE' | 'PFA';
  dataInceput: string; // ISO date
  dataSfarsit?: string; // ISO date
  functie: string;
  normaTimpLucru: number; // 1.0 = full-time, 0.5 = part-time
  salariuBrut?: number;
  status: 'activ' | 'suspendat' | 'incetat';
}

/**
 * Info angajator din REGES
 */
export interface RegesEmployer {
  id: string;
  cui: string;
  denumire: string;
  adresa: string;
  codCAEN: string;
  telefon?: string;
  email?: string;
  numarAngajati: number;
  dataInregistrare: string; // ISO date
}

// ============================================================
// Generic REGES Request
// ============================================================
/**
 * Apel generic către REGES API
 *
 * @param connectionId - ID conexiune (pentru auth token)
 * @param encryptedCreds - Credențiale criptate
 * @param endpoint - Endpoint API (ex: '/employees')
 * @returns Date JSON din API
 */
async function regesRequest<T>(
  connectionId: string,
  encryptedCreds: string,
  endpoint: string
): Promise<T> {
  // Get access token (uses cache if available)
  const token = await getAccessToken(connectionId, encryptedCreds);

  // Make API request
  const url = `${REGES_API_BASE}${endpoint}`;
  console.log(`[REGES Client] Fetching: ${url}`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `REGES API error: ${response.status} ${response.statusText}. ` +
          `Details: ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`[REGES Client] Error fetching ${endpoint}:`, error);

    throw new Error(
      `Failed to fetch from REGES API (${endpoint}): ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

// ============================================================
// Get Employees
// ============================================================
/**
 * Obține lista angajaților din REGES
 *
 * @param connectionId - ID conexiune REGES
 * @param encryptedCreds - Credențiale criptate
 * @returns Array de angajați
 *
 * @example
 * const employees = await getEmployees(connId, encCreds);
 * console.log(`Found ${employees.length} employees`);
 */
export async function getEmployees(
  connectionId: string,
  encryptedCreds: string
): Promise<RegesEmployee[]> {
  return regesRequest<RegesEmployee[]>(connectionId, encryptedCreds, '/employees');
}

// ============================================================
// Get Contracts
// ============================================================
/**
 * Obține lista contractelor de muncă din REGES
 *
 * @param connectionId - ID conexiune REGES
 * @param encryptedCreds - Credențiale criptate
 * @returns Array de contracte
 *
 * @example
 * const contracts = await getContracts(connId, encCreds);
 */
export async function getContracts(
  connectionId: string,
  encryptedCreds: string
): Promise<RegesContract[]> {
  return regesRequest<RegesContract[]>(connectionId, encryptedCreds, '/contracts');
}

// ============================================================
// Get Employer Info
// ============================================================
/**
 * Obține informații despre angajator din REGES
 *
 * @param connectionId - ID conexiune REGES
 * @param encryptedCreds - Credențiale criptate
 * @returns Info angajator
 *
 * @example
 * const employer = await getEmployerInfo(connId, encCreds);
 * console.log(`Employer: ${employer.denumire}, CUI: ${employer.cui}`);
 */
export async function getEmployerInfo(
  connectionId: string,
  encryptedCreds: string
): Promise<RegesEmployer> {
  return regesRequest<RegesEmployer>(connectionId, encryptedCreds, '/employer');
}

// ============================================================
// Get Employee by CNP
// ============================================================
/**
 * Obține un angajat specific după CNP
 *
 * @param connectionId - ID conexiune REGES
 * @param encryptedCreds - Credențiale criptate
 * @param cnp - Cod Numeric Personal
 * @returns Angajat sau null dacă nu există
 *
 * @example
 * const employee = await getEmployeeByCNP(connId, encCreds, '1234567890123');
 */
export async function getEmployeeByCNP(
  connectionId: string,
  encryptedCreds: string,
  cnp: string
): Promise<RegesEmployee | null> {
  const employees = await getEmployees(connectionId, encryptedCreds);
  return employees.find((emp) => emp.cnp === cnp) || null;
}

// ============================================================
// Test Connection
// ============================================================
/**
 * Testează conexiunea la REGES (apelează /employer pentru verificare)
 *
 * @param connectionId - ID conexiune REGES
 * @param encryptedCreds - Credențiale criptate
 * @returns true dacă conexiunea funcționează
 *
 * @example
 * const isValid = await testConnection(connId, encCreds);
 * if (!isValid) console.error('Connection failed');
 */
export async function testConnection(
  connectionId: string,
  encryptedCreds: string
): Promise<boolean> {
  try {
    await getEmployerInfo(connectionId, encryptedCreds);
    return true;
  } catch (error) {
    console.error('[REGES Client] Connection test failed:', error);
    return false;
  }
}
