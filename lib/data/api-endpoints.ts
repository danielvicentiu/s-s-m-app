/**
 * API Endpoints Documentation
 *
 * Documentație completă pentru toate endpoint-urile API planificate
 * pentru platforma SSM/PSI.
 *
 * Această documentație servește ca referință pentru implementarea
 * viitoare a API-ului REST și pentru integrări externe.
 */

export interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  description: string;
  authRequired: boolean;
  roleRequired?: string[];
  requestSchema?: Record<string, any>;
  responseSchema?: Record<string, any>;
  example?: {
    request?: any;
    response?: any;
  };
}

export interface ApiEndpointGroup {
  group: string;
  description: string;
  endpoints: ApiEndpoint[];
}

/**
 * Toate endpoint-urile API planificate, grupate pe categorii
 */
export const API_ENDPOINTS: ApiEndpointGroup[] = [
  {
    group: 'auth',
    description: 'Autentificare și gestionare sesiuni',
    endpoints: [
      {
        path: '/api/auth/login',
        method: 'POST',
        description: 'Autentificare utilizator cu email și parolă',
        authRequired: false,
        requestSchema: {
          email: 'string (required)',
          password: 'string (required)',
        },
        responseSchema: {
          user: 'object',
          session: 'object',
          organizationId: 'string',
        },
        example: {
          request: {
            email: 'consultant@example.com',
            password: 'SecurePass123!',
          },
          response: {
            user: {
              id: 'uuid',
              email: 'consultant@example.com',
              role: 'consultant',
            },
            session: {
              access_token: 'jwt-token',
              expires_at: 1234567890,
            },
            organizationId: 'org-uuid',
          },
        },
      },
      {
        path: '/api/auth/logout',
        method: 'POST',
        description: 'Deconectare utilizator',
        authRequired: true,
        responseSchema: {
          success: 'boolean',
        },
        example: {
          response: {
            success: true,
          },
        },
      },
      {
        path: '/api/auth/refresh',
        method: 'POST',
        description: 'Reîmprospătare token sesiune',
        authRequired: true,
        responseSchema: {
          session: 'object',
        },
        example: {
          response: {
            session: {
              access_token: 'new-jwt-token',
              expires_at: 1234567890,
            },
          },
        },
      },
      {
        path: '/api/auth/me',
        method: 'GET',
        description: 'Obține informații utilizator autentificat',
        authRequired: true,
        responseSchema: {
          id: 'string',
          email: 'string',
          profile: 'object',
          organizations: 'array',
          currentRole: 'string',
        },
        example: {
          response: {
            id: 'user-uuid',
            email: 'consultant@example.com',
            profile: {
              firstName: 'Ion',
              lastName: 'Popescu',
              phone: '+40723456789',
            },
            organizations: [
              {
                id: 'org-uuid',
                name: 'Consultanță SSM Pro SRL',
                role: 'consultant',
              },
            ],
            currentRole: 'consultant',
          },
        },
      },
    ],
  },
  {
    group: 'employees',
    description: 'Gestionare angajați',
    endpoints: [
      {
        path: '/api/employees',
        method: 'GET',
        description: 'Listează toți angajații organizației curente',
        authRequired: true,
        roleRequired: ['consultant', 'firma_admin'],
        requestSchema: {
          page: 'number (optional)',
          limit: 'number (optional)',
          search: 'string (optional)',
          status: 'string (optional)',
        },
        responseSchema: {
          data: 'array',
          total: 'number',
          page: 'number',
          limit: 'number',
        },
        example: {
          request: {
            page: 1,
            limit: 20,
            search: 'popescu',
            status: 'active',
          },
          response: {
            data: [
              {
                id: 'emp-uuid',
                firstName: 'Maria',
                lastName: 'Popescu',
                cnp: '1234567890123',
                position: 'Operator producție',
                status: 'active',
                hireDate: '2024-01-15',
              },
            ],
            total: 45,
            page: 1,
            limit: 20,
          },
        },
      },
      {
        path: '/api/employees/:id',
        method: 'GET',
        description: 'Obține detalii complete despre un angajat',
        authRequired: true,
        roleRequired: ['consultant', 'firma_admin'],
        responseSchema: {
          id: 'string',
          firstName: 'string',
          lastName: 'string',
          cnp: 'string',
          position: 'string',
          department: 'string',
          status: 'string',
          hireDate: 'string',
          trainings: 'array',
          medicalRecords: 'array',
          equipment: 'array',
        },
        example: {
          response: {
            id: 'emp-uuid',
            firstName: 'Maria',
            lastName: 'Popescu',
            cnp: '1234567890123',
            position: 'Operator producție',
            department: 'Producție',
            status: 'active',
            hireDate: '2024-01-15',
            trainings: [
              {
                id: 'training-uuid',
                type: 'SSM',
                date: '2024-02-01',
                expiryDate: '2026-02-01',
              },
            ],
            medicalRecords: [],
            equipment: [],
          },
        },
      },
      {
        path: '/api/employees',
        method: 'POST',
        description: 'Adaugă angajat nou',
        authRequired: true,
        roleRequired: ['consultant', 'firma_admin'],
        requestSchema: {
          firstName: 'string (required)',
          lastName: 'string (required)',
          cnp: 'string (required)',
          position: 'string (required)',
          department: 'string (optional)',
          hireDate: 'string (required)',
          email: 'string (optional)',
          phone: 'string (optional)',
        },
        responseSchema: {
          id: 'string',
          success: 'boolean',
        },
        example: {
          request: {
            firstName: 'Ion',
            lastName: 'Ionescu',
            cnp: '1890101123456',
            position: 'Electrician',
            department: 'Mentenanță',
            hireDate: '2024-03-01',
            email: 'ion.ionescu@firma.ro',
            phone: '+40723456789',
          },
          response: {
            id: 'new-emp-uuid',
            success: true,
          },
        },
      },
      {
        path: '/api/employees/:id',
        method: 'PUT',
        description: 'Actualizează date angajat',
        authRequired: true,
        roleRequired: ['consultant', 'firma_admin'],
        requestSchema: {
          firstName: 'string (optional)',
          lastName: 'string (optional)',
          position: 'string (optional)',
          department: 'string (optional)',
          status: 'string (optional)',
          email: 'string (optional)',
          phone: 'string (optional)',
        },
        responseSchema: {
          success: 'boolean',
        },
        example: {
          request: {
            position: 'Electrician Șef',
            department: 'Mentenanță',
          },
          response: {
            success: true,
          },
        },
      },
      {
        path: '/api/employees/:id',
        method: 'DELETE',
        description: 'Șterge angajat (soft delete)',
        authRequired: true,
        roleRequired: ['consultant', 'firma_admin'],
        responseSchema: {
          success: 'boolean',
        },
        example: {
          response: {
            success: true,
          },
        },
      },
    ],
  },
  {
    group: 'trainings',
    description: 'Gestionare instruiri SSM/PSI',
    endpoints: [
      {
        path: '/api/trainings',
        method: 'GET',
        description: 'Listează instruiri pentru organizație',
        authRequired: true,
        roleRequired: ['consultant', 'firma_admin'],
        requestSchema: {
          employeeId: 'string (optional)',
          type: 'string (optional)',
          status: 'string (optional)',
          expiringInDays: 'number (optional)',
        },
        responseSchema: {
          data: 'array',
          total: 'number',
        },
        example: {
          request: {
            type: 'SSM',
            expiringInDays: 30,
          },
          response: {
            data: [
              {
                id: 'training-uuid',
                employeeId: 'emp-uuid',
                employeeName: 'Maria Popescu',
                type: 'SSM',
                date: '2024-01-15',
                expiryDate: '2026-01-15',
                status: 'valid',
                daysUntilExpiry: 25,
              },
            ],
            total: 12,
          },
        },
      },
      {
        path: '/api/trainings',
        method: 'POST',
        description: 'Adaugă instruire nouă',
        authRequired: true,
        roleRequired: ['consultant', 'firma_admin'],
        requestSchema: {
          employeeId: 'string (required)',
          type: 'string (required)',
          date: 'string (required)',
          expiryDate: 'string (optional)',
          instructorName: 'string (optional)',
          notes: 'string (optional)',
        },
        responseSchema: {
          id: 'string',
          success: 'boolean',
        },
        example: {
          request: {
            employeeId: 'emp-uuid',
            type: 'PSI',
            date: '2024-03-01',
            expiryDate: '2025-03-01',
            instructorName: 'Daniel Consultant',
          },
          response: {
            id: 'training-uuid',
            success: true,
          },
        },
      },
      {
        path: '/api/trainings/:id',
        method: 'PUT',
        description: 'Actualizează instruire',
        authRequired: true,
        roleRequired: ['consultant', 'firma_admin'],
        requestSchema: {
          date: 'string (optional)',
          expiryDate: 'string (optional)',
          notes: 'string (optional)',
        },
        responseSchema: {
          success: 'boolean',
        },
      },
      {
        path: '/api/trainings/bulk',
        method: 'POST',
        description: 'Adaugă instruiri în masă pentru mai mulți angajați',
        authRequired: true,
        roleRequired: ['consultant', 'firma_admin'],
        requestSchema: {
          employeeIds: 'array (required)',
          type: 'string (required)',
          date: 'string (required)',
          expiryDate: 'string (optional)',
          instructorName: 'string (optional)',
        },
        responseSchema: {
          created: 'number',
          success: 'boolean',
        },
        example: {
          request: {
            employeeIds: ['emp-1', 'emp-2', 'emp-3'],
            type: 'SSM',
            date: '2024-03-15',
            expiryDate: '2026-03-15',
          },
          response: {
            created: 3,
            success: true,
          },
        },
      },
    ],
  },
  {
    group: 'medical',
    description: 'Gestionare examene medicale',
    endpoints: [
      {
        path: '/api/medical',
        method: 'GET',
        description: 'Listează examene medicale',
        authRequired: true,
        roleRequired: ['consultant', 'firma_admin'],
        requestSchema: {
          employeeId: 'string (optional)',
          status: 'string (optional)',
          expiringInDays: 'number (optional)',
        },
        responseSchema: {
          data: 'array',
          total: 'number',
        },
        example: {
          response: {
            data: [
              {
                id: 'medical-uuid',
                employeeId: 'emp-uuid',
                employeeName: 'Maria Popescu',
                examDate: '2024-01-10',
                expiryDate: '2025-01-10',
                result: 'Apt',
                restrictions: null,
                status: 'valid',
              },
            ],
            total: 35,
          },
        },
      },
      {
        path: '/api/medical',
        method: 'POST',
        description: 'Adaugă examen medical',
        authRequired: true,
        roleRequired: ['consultant', 'firma_admin'],
        requestSchema: {
          employeeId: 'string (required)',
          examDate: 'string (required)',
          expiryDate: 'string (required)',
          result: 'string (required)',
          restrictions: 'string (optional)',
          doctorName: 'string (optional)',
        },
        responseSchema: {
          id: 'string',
          success: 'boolean',
        },
      },
      {
        path: '/api/medical/:id',
        method: 'PUT',
        description: 'Actualizează examen medical',
        authRequired: true,
        roleRequired: ['consultant', 'firma_admin'],
        requestSchema: {
          result: 'string (optional)',
          restrictions: 'string (optional)',
          expiryDate: 'string (optional)',
        },
        responseSchema: {
          success: 'boolean',
        },
      },
    ],
  },
  {
    group: 'equipment',
    description: 'Gestionare echipamente de protecție',
    endpoints: [
      {
        path: '/api/equipment',
        method: 'GET',
        description: 'Listează echipamente de protecție',
        authRequired: true,
        roleRequired: ['consultant', 'firma_admin'],
        requestSchema: {
          employeeId: 'string (optional)',
          type: 'string (optional)',
          status: 'string (optional)',
        },
        responseSchema: {
          data: 'array',
          total: 'number',
        },
        example: {
          response: {
            data: [
              {
                id: 'equip-uuid',
                employeeId: 'emp-uuid',
                type: 'Mănuși protecție',
                issuedDate: '2024-01-15',
                expiryDate: '2024-07-15',
                quantity: 2,
                status: 'active',
              },
            ],
            total: 120,
          },
        },
      },
      {
        path: '/api/equipment',
        method: 'POST',
        description: 'Înregistrează distribuire echipament',
        authRequired: true,
        roleRequired: ['consultant', 'firma_admin'],
        requestSchema: {
          employeeId: 'string (required)',
          type: 'string (required)',
          issuedDate: 'string (required)',
          expiryDate: 'string (optional)',
          quantity: 'number (required)',
        },
        responseSchema: {
          id: 'string',
          success: 'boolean',
        },
      },
      {
        path: '/api/equipment/:id',
        method: 'PUT',
        description: 'Actualizează echipament',
        authRequired: true,
        roleRequired: ['consultant', 'firma_admin'],
        requestSchema: {
          status: 'string (optional)',
          returnedDate: 'string (optional)',
        },
        responseSchema: {
          success: 'boolean',
        },
      },
    ],
  },
  {
    group: 'documents',
    description: 'Gestionare documente',
    endpoints: [
      {
        path: '/api/documents',
        method: 'GET',
        description: 'Listează documente organizație',
        authRequired: true,
        roleRequired: ['consultant', 'firma_admin'],
        requestSchema: {
          type: 'string (optional)',
          employeeId: 'string (optional)',
        },
        responseSchema: {
          data: 'array',
          total: 'number',
        },
        example: {
          response: {
            data: [
              {
                id: 'doc-uuid',
                name: 'Plan de evacuare.pdf',
                type: 'PSI',
                uploadDate: '2024-01-20',
                size: 245678,
                url: 'https://storage.url/doc.pdf',
              },
            ],
            total: 15,
          },
        },
      },
      {
        path: '/api/documents/upload',
        method: 'POST',
        description: 'Încarcă document nou',
        authRequired: true,
        roleRequired: ['consultant', 'firma_admin'],
        requestSchema: {
          file: 'File (required)',
          type: 'string (required)',
          employeeId: 'string (optional)',
          description: 'string (optional)',
        },
        responseSchema: {
          id: 'string',
          url: 'string',
          success: 'boolean',
        },
      },
      {
        path: '/api/documents/:id',
        method: 'DELETE',
        description: 'Șterge document',
        authRequired: true,
        roleRequired: ['consultant', 'firma_admin'],
        responseSchema: {
          success: 'boolean',
        },
      },
    ],
  },
  {
    group: 'reports',
    description: 'Generare rapoarte',
    endpoints: [
      {
        path: '/api/reports/compliance',
        method: 'GET',
        description: 'Generează raport conformitate SSM/PSI',
        authRequired: true,
        roleRequired: ['consultant', 'firma_admin'],
        requestSchema: {
          organizationId: 'string (optional)',
          startDate: 'string (optional)',
          endDate: 'string (optional)',
          format: 'string (optional)', // pdf, excel, json
        },
        responseSchema: {
          summary: 'object',
          details: 'object',
          downloadUrl: 'string (optional)',
        },
        example: {
          response: {
            summary: {
              totalEmployees: 45,
              trainingsValid: 38,
              trainingsExpired: 7,
              medicalValid: 42,
              medicalExpired: 3,
              complianceScore: 87,
            },
            details: {
              expiringTrainings: [],
              expiringMedical: [],
              missingEquipment: [],
            },
            downloadUrl: 'https://storage.url/report.pdf',
          },
        },
      },
      {
        path: '/api/reports/employee/:id',
        method: 'GET',
        description: 'Generează fișă completă angajat',
        authRequired: true,
        roleRequired: ['consultant', 'firma_admin'],
        requestSchema: {
          format: 'string (optional)', // pdf, json
        },
        responseSchema: {
          employee: 'object',
          trainings: 'array',
          medical: 'array',
          equipment: 'array',
          downloadUrl: 'string (optional)',
        },
      },
      {
        path: '/api/reports/audit-log',
        method: 'GET',
        description: 'Raport jurnal audit',
        authRequired: true,
        roleRequired: ['consultant'],
        requestSchema: {
          startDate: 'string (optional)',
          endDate: 'string (optional)',
          action: 'string (optional)',
          userId: 'string (optional)',
        },
        responseSchema: {
          data: 'array',
          total: 'number',
        },
      },
    ],
  },
  {
    group: 'settings',
    description: 'Setări platformă',
    endpoints: [
      {
        path: '/api/settings/organization',
        method: 'GET',
        description: 'Obține setări organizație',
        authRequired: true,
        roleRequired: ['consultant', 'firma_admin'],
        responseSchema: {
          id: 'string',
          name: 'string',
          cui: 'string',
          address: 'string',
          settings: 'object',
        },
      },
      {
        path: '/api/settings/organization',
        method: 'PUT',
        description: 'Actualizează setări organizație',
        authRequired: true,
        roleRequired: ['consultant', 'firma_admin'],
        requestSchema: {
          name: 'string (optional)',
          address: 'string (optional)',
          settings: 'object (optional)',
        },
        responseSchema: {
          success: 'boolean',
        },
      },
      {
        path: '/api/settings/alerts',
        method: 'GET',
        description: 'Obține setări alerte',
        authRequired: true,
        responseSchema: {
          emailNotifications: 'boolean',
          trainingAlertDays: 'number',
          medicalAlertDays: 'number',
        },
      },
      {
        path: '/api/settings/alerts',
        method: 'PUT',
        description: 'Actualizează setări alerte',
        authRequired: true,
        requestSchema: {
          emailNotifications: 'boolean (optional)',
          trainingAlertDays: 'number (optional)',
          medicalAlertDays: 'number (optional)',
        },
        responseSchema: {
          success: 'boolean',
        },
      },
    ],
  },
];

/**
 * Helper pentru căutare endpoint după path și metodă
 */
export function findEndpoint(
  path: string,
  method: string
): ApiEndpoint | undefined {
  for (const group of API_ENDPOINTS) {
    const endpoint = group.endpoints.find(
      (e) => e.path === path && e.method === method
    );
    if (endpoint) return endpoint;
  }
  return undefined;
}

/**
 * Helper pentru listare toate endpoint-urile dintr-un grup
 */
export function getEndpointsByGroup(groupName: string): ApiEndpoint[] {
  const group = API_ENDPOINTS.find((g) => g.group === groupName);
  return group ? group.endpoints : [];
}

/**
 * Helper pentru statistici API
 */
export function getApiStats() {
  const totalEndpoints = API_ENDPOINTS.reduce(
    (sum, group) => sum + group.endpoints.length,
    0
  );
  const endpointsByMethod = API_ENDPOINTS.reduce(
    (acc, group) => {
      group.endpoints.forEach((endpoint) => {
        acc[endpoint.method] = (acc[endpoint.method] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    totalGroups: API_ENDPOINTS.length,
    totalEndpoints,
    endpointsByMethod,
    groups: API_ENDPOINTS.map((g) => ({
      name: g.group,
      count: g.endpoints.length,
    })),
  };
}
