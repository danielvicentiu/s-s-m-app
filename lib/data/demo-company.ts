/**
 * Demo Company Data
 *
 * Complete dataset for SC Demo Construct SRL
 * Used for testing, demos, and development
 *
 * Contains:
 * - Company details
 * - 25 employees with realistic names and positions
 * - 5 trainings (2 expired, 1 expiring soon, 2 valid)
 * - 10 medical records (3 expired)
 * - 8 equipment items (2 with overdue inspections)
 * - 15 active alerts
 */

export const demoCompany = {
  organization: {
    name: 'SC Demo Construct SRL',
    cui: '12345678',
    reg_com: 'J40/1234/2020',
    address: 'Strada Constructorilor nr. 45, Sector 3, București',
    phone: '+40 21 123 4567',
    email: 'contact@democonstruct.ro',
    industry: 'construction',
    employee_count: 25,
    country: 'RO',
    city: 'București',
    postal_code: '031234',
    created_at: '2020-03-15T10:00:00Z',
    status: 'active'
  },

  employees: [
    // Management
    {
      first_name: 'Ion',
      last_name: 'Popescu',
      cnp: '1750612401234',
      position: 'Director General',
      department: 'Management',
      employment_date: '2020-03-15',
      email: 'ion.popescu@democonstruct.ro',
      phone: '+40 722 123 456',
      status: 'active'
    },
    {
      first_name: 'Maria',
      last_name: 'Ionescu',
      cnp: '2780523401234',
      position: 'Director Financiar',
      department: 'Financiar',
      employment_date: '2020-04-01',
      email: 'maria.ionescu@democonstruct.ro',
      phone: '+40 722 234 567',
      status: 'active'
    },
    {
      first_name: 'Gheorghe',
      last_name: 'Dumitrescu',
      cnp: '1720815401234',
      position: 'Director Tehnic',
      department: 'Tehnic',
      employment_date: '2020-03-20',
      email: 'gheorghe.dumitrescu@democonstruct.ro',
      phone: '+40 722 345 678',
      status: 'active'
    },

    // Office staff
    {
      first_name: 'Elena',
      last_name: 'Stanciu',
      cnp: '2850923401234',
      position: 'Contabil Șef',
      department: 'Financiar',
      employment_date: '2020-05-10',
      email: 'elena.stanciu@democonstruct.ro',
      phone: '+40 722 456 789',
      status: 'active'
    },
    {
      first_name: 'Mihai',
      last_name: 'Georgescu',
      cnp: '1900214401234',
      position: 'Responsabil Achiziții',
      department: 'Achiziții',
      employment_date: '2020-06-01',
      email: 'mihai.georgescu@democonstruct.ro',
      phone: '+40 722 567 890',
      status: 'active'
    },
    {
      first_name: 'Ana',
      last_name: 'Munteanu',
      cnp: '2920305401234',
      position: 'Secretar',
      department: 'Administrativ',
      employment_date: '2021-01-15',
      email: 'ana.munteanu@democonstruct.ro',
      phone: '+40 722 678 901',
      status: 'active'
    },

    // Construction site managers
    {
      first_name: 'Vasile',
      last_name: 'Popa',
      cnp: '1740523401234',
      position: 'Șef Șantier',
      department: 'Execuție',
      employment_date: '2020-04-15',
      email: 'vasile.popa@democonstruct.ro',
      phone: '+40 722 789 012',
      status: 'active'
    },
    {
      first_name: 'Constantin',
      last_name: 'Radu',
      cnp: '1760812401234',
      position: 'Șef Șantier',
      department: 'Execuție',
      employment_date: '2020-07-01',
      email: 'constantin.radu@democonstruct.ro',
      phone: '+40 722 890 123',
      status: 'active'
    },
    {
      first_name: 'Florin',
      last_name: 'Barbu',
      cnp: '1811025401234',
      position: 'Maistru Constructor',
      department: 'Execuție',
      employment_date: '2021-02-01',
      email: 'florin.barbu@democonstruct.ro',
      phone: '+40 722 901 234',
      status: 'active'
    },

    // Skilled workers
    {
      first_name: 'Adrian',
      last_name: 'Constantinescu',
      cnp: '1830618401234',
      position: 'Zidar',
      department: 'Execuție',
      employment_date: '2020-05-20',
      email: 'adrian.constantinescu@democonstruct.ro',
      phone: '+40 723 012 345',
      status: 'active'
    },
    {
      first_name: 'Daniel',
      last_name: 'Cristea',
      cnp: '1850923401234',
      position: 'Zidar',
      department: 'Execuție',
      employment_date: '2020-06-10',
      email: 'daniel.cristea@democonstruct.ro',
      phone: '+40 723 123 456',
      status: 'active'
    },
    {
      first_name: 'Marius',
      last_name: 'Tudor',
      cnp: '1870214401234',
      position: 'Zidar',
      department: 'Execuție',
      employment_date: '2021-03-01',
      email: 'marius.tudor@democonstruct.ro',
      phone: '+40 723 234 567',
      status: 'active'
    },
    {
      first_name: 'Andrei',
      last_name: 'Stoica',
      cnp: '1890507401234',
      position: 'Fierar Betonist',
      department: 'Execuție',
      employment_date: '2020-08-01',
      email: 'andrei.stoica@democonstruct.ro',
      phone: '+40 723 345 678',
      status: 'active'
    },
    {
      first_name: 'Nicolae',
      last_name: 'Matei',
      cnp: '1820730401234',
      position: 'Fierar Betonist',
      department: 'Execuție',
      employment_date: '2020-09-15',
      email: 'nicolae.matei@democonstruct.ro',
      phone: '+40 723 456 789',
      status: 'active'
    },
    {
      first_name: 'Cristian',
      last_name: 'Marinescu',
      cnp: '1910123401234',
      position: 'Instalator',
      department: 'Execuție',
      employment_date: '2021-01-10',
      email: 'cristian.marinescu@democonstruct.ro',
      phone: '+40 723 567 890',
      status: 'active'
    },
    {
      first_name: 'Gabriel',
      last_name: 'Dinu',
      cnp: '1930815401234',
      position: 'Electrician',
      department: 'Execuție',
      employment_date: '2021-02-15',
      email: 'gabriel.dinu@democonstruct.ro',
      phone: '+40 723 678 901',
      status: 'active'
    },
    {
      first_name: 'Ionuț',
      last_name: 'Manole',
      cnp: '1950428401234',
      position: 'Tâmplar',
      department: 'Execuție',
      employment_date: '2021-04-01',
      email: 'ionut.manole@democonstruct.ro',
      phone: '+40 723 789 012',
      status: 'active'
    },

    // General workers
    {
      first_name: 'Alexandru',
      last_name: 'Ilie',
      cnp: '1970612401234',
      position: 'Muncitor Necalificat',
      department: 'Execuție',
      employment_date: '2021-05-01',
      email: 'alexandru.ilie@democonstruct.ro',
      phone: '+40 723 890 123',
      status: 'active'
    },
    {
      first_name: 'Stefan',
      last_name: 'Vasilescu',
      cnp: '1990923401234',
      position: 'Muncitor Necalificat',
      department: 'Execuție',
      employment_date: '2021-06-15',
      email: 'stefan.vasilescu@democonstruct.ro',
      phone: '+40 723 901 234',
      status: 'active'
    },
    {
      first_name: 'Sorin',
      last_name: 'Luca',
      cnp: '1840305401234',
      position: 'Muncitor Necalificat',
      department: 'Execuție',
      employment_date: '2021-07-01',
      email: 'sorin.luca@democonstruct.ro',
      phone: '+40 724 012 345',
      status: 'active'
    },

    // Drivers and operators
    {
      first_name: 'Lucian',
      last_name: 'Stan',
      cnp: '1800714401234',
      position: 'Operator Excavator',
      department: 'Execuție',
      employment_date: '2020-10-01',
      email: 'lucian.stan@democonstruct.ro',
      phone: '+40 724 123 456',
      status: 'active'
    },
    {
      first_name: 'Claudiu',
      last_name: 'Dumitru',
      cnp: '1860123401234',
      position: 'Operator Macara',
      department: 'Execuție',
      employment_date: '2020-11-15',
      email: 'claudiu.dumitru@democonstruct.ro',
      phone: '+40 724 234 567',
      status: 'active'
    },
    {
      first_name: 'Radu',
      last_name: 'Neagu',
      cnp: '1880518401234',
      position: 'Șofer Camion',
      department: 'Transport',
      employment_date: '2021-03-15',
      email: 'radu.neagu@democonstruct.ro',
      phone: '+40 724 345 678',
      status: 'active'
    },
    {
      first_name: 'Bogdan',
      last_name: 'Florea',
      cnp: '1920925401234',
      position: 'Șofer Camion',
      department: 'Transport',
      employment_date: '2021-08-01',
      email: 'bogdan.florea@democonstruct.ro',
      phone: '+40 724 456 789',
      status: 'active'
    },
    {
      first_name: 'Viorel',
      last_name: 'Ciobanu',
      cnp: '1940207401234',
      position: 'Magaziner',
      department: 'Depozit',
      employment_date: '2021-09-01',
      email: 'viorel.ciobanu@democonstruct.ro',
      phone: '+40 724 567 890',
      status: 'active'
    }
  ],

  trainings: [
    // Expired trainings
    {
      training_type: 'SSM Introductiv',
      completion_date: '2023-01-15',
      expiration_date: '2024-01-15',
      status: 'expired',
      provider: 'SSM Consulting Pro',
      certificate_number: 'SSM-2023-001',
      notes: 'Instruire inițială SSM pentru toți angajații',
      employee_count: 25
    },
    {
      training_type: 'PSI',
      completion_date: '2023-03-20',
      expiration_date: '2024-03-20',
      status: 'expired',
      provider: 'Inspectoratul pentru Situații de Urgență',
      certificate_number: 'PSI-2023-045',
      notes: 'Instruire prevenire și stingere incendii',
      employee_count: 25
    },

    // Expiring soon
    {
      training_type: 'Lucru la Înălțime',
      completion_date: '2025-01-10',
      expiration_date: '2026-04-10',
      status: 'valid',
      provider: 'Alpinism Industrial SRL',
      certificate_number: 'ALT-2025-012',
      notes: 'Instruire pentru lucrătorii care lucrează la înălțime peste 2m',
      employee_count: 12
    },

    // Valid trainings
    {
      training_type: 'Conducere Utilaje de Construcții',
      completion_date: '2024-06-15',
      expiration_date: '2027-06-15',
      status: 'valid',
      provider: 'Școala de Conducători Auto ProDrive',
      certificate_number: 'UTIL-2024-089',
      notes: 'Autorizare operare excavator și macara',
      employee_count: 2
    },
    {
      training_type: 'Prim Ajutor',
      completion_date: '2024-09-01',
      expiration_date: '2026-09-01',
      status: 'valid',
      provider: 'Crucea Roșie Română',
      certificate_number: 'PA-2024-234',
      notes: 'Curs prim ajutor pentru responsabili SSM',
      employee_count: 5
    }
  ],

  medicalRecords: [
    // Expired medical records
    {
      employee_index: 0, // Ion Popescu
      exam_date: '2023-02-01',
      expiration_date: '2024-02-01',
      exam_type: 'periodic',
      medical_center: 'Clinica MedWork',
      doctor_name: 'Dr. Andreea Vlad',
      result: 'apt',
      restrictions: 'Fără restricții',
      status: 'expired'
    },
    {
      employee_index: 6, // Vasile Popa
      exam_date: '2023-04-10',
      expiration_date: '2024-04-10',
      exam_type: 'periodic',
      medical_center: 'Centrul Medical SSM Plus',
      doctor_name: 'Dr. Mihai Popescu',
      result: 'apt',
      restrictions: 'Fără restricții',
      status: 'expired'
    },
    {
      employee_index: 9, // Adrian Constantinescu
      exam_date: '2023-05-15',
      expiration_date: '2024-05-15',
      exam_type: 'periodic',
      medical_center: 'Clinica MedWork',
      doctor_name: 'Dr. Andreea Vlad',
      result: 'apt_restrictii',
      restrictions: 'Nu poate lucra la înălțime peste 5m',
      status: 'expired'
    },

    // Valid medical records
    {
      employee_index: 1, // Maria Ionescu
      exam_date: '2025-01-10',
      expiration_date: '2026-01-10',
      exam_type: 'periodic',
      medical_center: 'Clinica MedWork',
      doctor_name: 'Dr. Andreea Vlad',
      result: 'apt',
      restrictions: 'Fără restricții',
      status: 'valid'
    },
    {
      employee_index: 2, // Gheorghe Dumitrescu
      exam_date: '2024-11-20',
      expiration_date: '2025-11-20',
      exam_type: 'periodic',
      medical_center: 'Centrul Medical SSM Plus',
      doctor_name: 'Dr. Mihai Popescu',
      result: 'apt',
      restrictions: 'Fără restricții',
      status: 'valid'
    },
    {
      employee_index: 7, // Constantin Radu
      exam_date: '2024-07-15',
      expiration_date: '2025-07-15',
      exam_type: 'periodic',
      medical_center: 'Clinica MedWork',
      doctor_name: 'Dr. Andreea Vlad',
      result: 'apt',
      restrictions: 'Fără restricții',
      status: 'valid'
    },
    {
      employee_index: 20, // Lucian Stan
      exam_date: '2024-10-05',
      expiration_date: '2025-10-05',
      exam_type: 'periodic',
      medical_center: 'Centrul Medical SSM Plus',
      doctor_name: 'Dr. Mihai Popescu',
      result: 'apt',
      restrictions: 'Fără restricții',
      status: 'valid'
    },
    {
      employee_index: 21, // Claudiu Dumitru
      exam_date: '2024-10-05',
      expiration_date: '2025-10-05',
      exam_type: 'periodic',
      medical_center: 'Centrul Medical SSM Plus',
      doctor_name: 'Dr. Mihai Popescu',
      result: 'apt',
      restrictions: 'Fără restricții',
      status: 'valid'
    },
    {
      employee_index: 15, // Gabriel Dinu
      exam_date: '2024-12-01',
      expiration_date: '2025-12-01',
      exam_type: 'angajare',
      medical_center: 'Clinica MedWork',
      doctor_name: 'Dr. Andreea Vlad',
      result: 'apt',
      restrictions: 'Fără restricții',
      status: 'valid'
    },
    {
      employee_index: 22, // Radu Neagu
      exam_date: '2025-01-20',
      expiration_date: '2026-01-20',
      exam_type: 'periodic',
      medical_center: 'Centrul Medical SSM Plus',
      doctor_name: 'Dr. Mihai Popescu',
      result: 'apt',
      restrictions: 'Fără restricții',
      status: 'valid'
    }
  ],

  equipment: [
    // Equipment with overdue inspections
    {
      name: 'Excavator Caterpillar 320D',
      equipment_type: 'excavator',
      serial_number: 'CAT320D-2018-4567',
      manufacturer: 'Caterpillar',
      manufacture_date: '2018-05-10',
      purchase_date: '2020-06-15',
      last_inspection_date: '2024-01-20',
      next_inspection_date: '2025-01-20',
      status: 'overdue',
      location: 'Șantier Pipera',
      responsible_person: 'Lucian Stan',
      notes: 'Verificare tehnică anuală depășită'
    },
    {
      name: 'Macara Turn Liebherr 71K',
      equipment_type: 'crane',
      serial_number: 'LBR71K-2019-8901',
      manufacturer: 'Liebherr',
      manufacture_date: '2019-08-15',
      purchase_date: '2020-09-01',
      last_inspection_date: '2024-02-10',
      next_inspection_date: '2025-02-10',
      status: 'overdue',
      location: 'Șantier Floreasca',
      responsible_person: 'Claudiu Dumitru',
      notes: 'Verificare tehnică periodică expirată'
    },

    // Valid equipment
    {
      name: 'Schelă Metalică Modulară',
      equipment_type: 'scaffolding',
      serial_number: 'SCH-MOD-2020-001',
      manufacturer: 'ProScaff',
      manufacture_date: '2020-03-01',
      purchase_date: '2020-04-15',
      last_inspection_date: '2025-01-05',
      next_inspection_date: '2025-07-05',
      status: 'valid',
      location: 'Șantier Pipera',
      responsible_person: 'Vasile Popa',
      notes: 'Inspecție semestrială conform normelor'
    },
    {
      name: 'Betoniera 500L',
      equipment_type: 'mixer',
      serial_number: 'BET500-2021-234',
      manufacturer: 'Imer',
      manufacture_date: '2021-01-20',
      purchase_date: '2021-02-10',
      last_inspection_date: '2024-11-15',
      next_inspection_date: '2025-11-15',
      status: 'valid',
      location: 'Depozit Central',
      responsible_person: 'Constantin Radu',
      notes: 'Verificare anuală'
    },
    {
      name: 'Generator Electric 100kW',
      equipment_type: 'generator',
      serial_number: 'GEN-100-2020-567',
      manufacturer: 'SDMO',
      manufacture_date: '2020-07-10',
      purchase_date: '2020-08-01',
      last_inspection_date: '2024-08-15',
      next_inspection_date: '2025-08-15',
      status: 'valid',
      location: 'Șantier Floreasca',
      responsible_person: 'Gabriel Dinu',
      notes: 'Verificare electrică anuală'
    },
    {
      name: 'Compactor Tandem 3T',
      equipment_type: 'compactor',
      serial_number: 'CMP-3T-2021-890',
      manufacturer: 'Bomag',
      manufacture_date: '2021-04-05',
      purchase_date: '2021-05-20',
      last_inspection_date: '2024-10-01',
      next_inspection_date: '2025-10-01',
      status: 'valid',
      location: 'Șantier Pipera',
      responsible_person: 'Florin Barbu',
      notes: 'Verificare tehnică anuală'
    },
    {
      name: 'Pompă Beton Statică',
      equipment_type: 'concrete_pump',
      serial_number: 'PMP-STAT-2019-345',
      manufacturer: 'Putzmeister',
      manufacture_date: '2019-11-10',
      purchase_date: '2020-01-15',
      last_inspection_date: '2024-12-20',
      next_inspection_date: '2025-12-20',
      status: 'valid',
      location: 'Șantier Floreasca',
      responsible_person: 'Vasile Popa',
      notes: 'Verificare hidraulică anuală'
    },
    {
      name: 'Nacela Elevatoare 18m',
      equipment_type: 'aerial_platform',
      serial_number: 'NAC-18M-2022-678',
      manufacturer: 'Genie',
      manufacture_date: '2022-02-15',
      purchase_date: '2022-03-10',
      last_inspection_date: '2024-09-05',
      next_inspection_date: '2025-09-05',
      status: 'valid',
      location: 'Șantier Pipera',
      responsible_person: 'Constantin Radu',
      notes: 'Verificare tehnică anuală'
    }
  ],

  alerts: [
    // Critical alerts - expired documents
    {
      alert_type: 'medical_expired',
      severity: 'critical',
      title: 'Control medical expirat - Ion Popescu',
      description: 'Controlul medical periodic pentru Director General Ion Popescu a expirat la data de 01.02.2024',
      related_entity: 'employee',
      related_entity_id: 0,
      status: 'active',
      created_at: '2024-02-02T08:00:00Z',
      due_date: '2024-02-01'
    },
    {
      alert_type: 'medical_expired',
      severity: 'critical',
      title: 'Control medical expirat - Vasile Popa',
      description: 'Controlul medical periodic pentru Șef Șantier Vasile Popa a expirat la data de 10.04.2024',
      related_entity: 'employee',
      related_entity_id: 6,
      status: 'active',
      created_at: '2024-04-11T08:00:00Z',
      due_date: '2024-04-10'
    },
    {
      alert_type: 'medical_expired',
      severity: 'critical',
      title: 'Control medical expirat - Adrian Constantinescu',
      description: 'Controlul medical periodic pentru Zidar Adrian Constantinescu a expirat la data de 15.05.2024',
      related_entity: 'employee',
      related_entity_id: 9,
      status: 'active',
      created_at: '2024-05-16T08:00:00Z',
      due_date: '2024-05-15'
    },

    // High severity alerts - expired trainings
    {
      alert_type: 'training_expired',
      severity: 'high',
      title: 'Instruire SSM expirată',
      description: 'Instruirea SSM Introductiv pentru 25 angajați a expirat la data de 15.01.2024. Este necesară re-instruirea urgentă.',
      related_entity: 'training',
      related_entity_id: 0,
      status: 'active',
      created_at: '2024-01-16T08:00:00Z',
      due_date: '2024-01-15'
    },
    {
      alert_type: 'training_expired',
      severity: 'high',
      title: 'Instruire PSI expirată',
      description: 'Instruirea PSI pentru 25 angajați a expirat la data de 20.03.2024. Reprogramare urgentă necesară.',
      related_entity: 'training',
      related_entity_id: 1,
      status: 'active',
      created_at: '2024-03-21T08:00:00Z',
      due_date: '2024-03-20'
    },

    // High severity - equipment inspections overdue
    {
      alert_type: 'inspection_overdue',
      severity: 'high',
      title: 'Inspecție excavator depășită',
      description: 'Verificarea tehnică pentru Excavator Caterpillar 320D era programată pe 20.01.2025. Utilizarea echipamentului trebuie suspendată.',
      related_entity: 'equipment',
      related_entity_id: 0,
      status: 'active',
      created_at: '2025-01-21T08:00:00Z',
      due_date: '2025-01-20'
    },
    {
      alert_type: 'inspection_overdue',
      severity: 'high',
      title: 'Inspecție macara turn depășită',
      description: 'Verificarea tehnică pentru Macara Turn Liebherr 71K era programată pe 10.02.2025. URGENT: echipamentul nu poate fi utilizat.',
      related_entity: 'equipment',
      related_entity_id: 1,
      status: 'active',
      created_at: '2025-02-11T08:00:00Z',
      due_date: '2025-02-10'
    },

    // Medium severity - expiring soon
    {
      alert_type: 'training_expiring',
      severity: 'medium',
      title: 'Instruire Lucru la Înălțime expiră în 56 zile',
      description: 'Instruirea pentru Lucru la Înălțime pentru 12 angajați expiră pe 10.04.2026. Programați re-instruirea.',
      related_entity: 'training',
      related_entity_id: 2,
      status: 'active',
      created_at: '2026-02-13T08:00:00Z',
      due_date: '2026-04-10'
    },
    {
      alert_type: 'medical_expiring',
      severity: 'medium',
      title: 'Control medical expiră în curând - Lucian Stan',
      description: 'Controlul medical pentru Operator Excavator Lucian Stan expiră pe 05.10.2025. Programați controlul medical.',
      related_entity: 'employee',
      related_entity_id: 20,
      status: 'active',
      created_at: '2025-08-05T08:00:00Z',
      due_date: '2025-10-05'
    },
    {
      alert_type: 'medical_expiring',
      severity: 'medium',
      title: 'Control medical expiră în curând - Claudiu Dumitru',
      description: 'Controlul medical pentru Operator Macara Claudiu Dumitru expiră pe 05.10.2025. Programați controlul medical.',
      related_entity: 'employee',
      related_entity_id: 21,
      status: 'active',
      created_at: '2025-08-05T08:00:00Z',
      due_date: '2025-10-05'
    },

    // Low severity - informational
    {
      alert_type: 'document_expiring',
      severity: 'low',
      title: 'Autorizația PSI se apropie de expirare',
      description: 'Autorizația PSI a organizației expiră în 90 de zile. Inițiați procedura de reînnoire.',
      related_entity: 'organization',
      related_entity_id: null,
      status: 'active',
      created_at: '2026-01-15T08:00:00Z',
      due_date: '2026-04-15'
    },
    {
      alert_type: 'inspection_upcoming',
      severity: 'low',
      title: 'Inspecție schelă metalică programată',
      description: 'Verificarea semestrială pentru Schelă Metalică Modulară este programată pe 05.07.2025.',
      related_entity: 'equipment',
      related_entity_id: 2,
      status: 'active',
      created_at: '2025-05-05T08:00:00Z',
      due_date: '2025-07-05'
    },
    {
      alert_type: 'inspection_upcoming',
      severity: 'low',
      title: 'Inspecție generator programată',
      description: 'Verificarea electrică anuală pentru Generator Electric 100kW este programată pe 15.08.2025.',
      related_entity: 'equipment',
      related_entity_id: 4,
      status: 'active',
      created_at: '2025-06-15T08:00:00Z',
      due_date: '2025-08-15'
    },
    {
      alert_type: 'document_upcoming',
      severity: 'low',
      title: 'Raport SSM trimestrial',
      description: 'Raportul SSM pentru trimestrul I 2026 trebuie prezentat până pe 15.04.2026.',
      related_entity: 'organization',
      related_entity_id: null,
      status: 'active',
      created_at: '2026-01-01T08:00:00Z',
      due_date: '2026-04-15'
    },
    {
      alert_type: 'training_upcoming',
      severity: 'low',
      title: 'Instruire periodică planificată',
      description: 'Instruire SSM periodică pentru toți angajații planificată pentru luna martie 2026.',
      related_entity: 'training',
      related_entity_id: null,
      status: 'active',
      created_at: '2026-02-01T08:00:00Z',
      due_date: '2026-03-15'
    }
  ]
};

// Helper type exports for TypeScript
export type DemoEmployee = typeof demoCompany.employees[0];
export type DemoTraining = typeof demoCompany.trainings[0];
export type DemoMedicalRecord = typeof demoCompany.medicalRecords[0];
export type DemoEquipment = typeof demoCompany.equipment[0];
export type DemoAlert = typeof demoCompany.alerts[0];

// Utility functions for seeding
export const getDemoEmployeeByIndex = (index: number) => {
  return demoCompany.employees[index];
};

export const getExpiredMedicalRecords = () => {
  return demoCompany.medicalRecords.filter(record => record.status === 'expired');
};

export const getExpiredTrainings = () => {
  return demoCompany.trainings.filter(training => training.status === 'expired');
};

export const getOverdueEquipment = () => {
  return demoCompany.equipment.filter(equipment => equipment.status === 'overdue');
};

export const getCriticalAlerts = () => {
  return demoCompany.alerts.filter(alert => alert.severity === 'critical');
};

export const getHighSeverityAlerts = () => {
  return demoCompany.alerts.filter(alert => alert.severity === 'high');
};
