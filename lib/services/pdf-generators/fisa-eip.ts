// lib/services/pdf-generators/fisa-eip.ts
// Generator PDF Fișă individuală de atribuire EIP conform HG 1048/2006

import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { createSupabaseServer } from '@/lib/supabase/server'

// ========== TYPES ==========

interface Employee {
  id: string
  full_name: string
  job_title: string | null
  department: string | null
  hire_date: string | null
  organization_id: string
}

interface Organization {
  id: string
  name: string
  cui: string | null
  address: string | null
  contact_phone: string | null
  contact_email: string | null
}

interface EquipmentAssignment {
  id: string
  equipment_type_id: string
  quantity: number
  assignment_date: string
  return_date: string | null
  status: string
  notes: string | null
  digital_signature: boolean
  equipment_types: {
    name: string
    category: string
  }
}

interface FisaEIPData {
  employee: Employee
  organization: Organization
  assignments: EquipmentAssignment[]
}

// ========== PDF GENERATOR ==========

/**
 * Generează PDF Fișă individuală de atribuire EIP conform HG 1048/2006
 * @param employeeId - ID angajat din Supabase
 * @param orgId - ID organizație din Supabase
 * @returns Buffer cu PDF-ul generat
 */
export async function generateFisaEIPPDF(
  employeeId: string,
  orgId: string
): Promise<Buffer> {
  // Fetch data from Supabase
  const data = await fetchFisaEIPData(employeeId, orgId)

  // Generate PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  // Configure fonts
  pdf.setFont('helvetica')

  // Add content
  addHeader(pdf, data.organization, data.employee)
  addEmployeeInfo(pdf, data.employee)
  addEquipmentTable(pdf, data.assignments)
  addFooter(pdf)

  // Convert to buffer
  const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))
  return pdfBuffer
}

// ========== DATA FETCHING ==========

async function fetchFisaEIPData(
  employeeId: string,
  orgId: string
): Promise<FisaEIPData> {
  const supabase = await createSupabaseServer()

  // Fetch employee
  const { data: employee, error: empError } = await supabase
    .from('employees')
    .select('*')
    .eq('id', employeeId)
    .eq('organization_id', orgId)
    .single()

  if (empError || !employee) {
    throw new Error(`Employee not found: ${empError?.message || 'Unknown error'}`)
  }

  // Fetch organization
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .single()

  if (orgError || !organization) {
    throw new Error(`Organization not found: ${orgError?.message || 'Unknown error'}`)
  }

  // Fetch equipment assignments for employee, ordered by date
  const { data: assignments, error: assignError } = await supabase
    .from('employee_equipment')
    .select(`
      id,
      equipment_type_id,
      quantity,
      assignment_date,
      return_date,
      status,
      notes,
      digital_signature,
      equipment_types!inner(name, category)
    `)
    .eq('employee_id', employeeId)
    .order('assignment_date', { ascending: true })

  if (assignError) {
    throw new Error(`Failed to fetch equipment assignments: ${assignError.message}`)
  }

  return {
    employee,
    organization,
    assignments: assignments || []
  }
}

// ========== PDF SECTIONS ==========

function addHeader(pdf: jsPDF, org: Organization, employee: Employee): void {
  const pageWidth = pdf.internal.pageSize.getWidth()

  // Organization name - centered, bold
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  const orgName = org.name || 'Organizație'
  const orgNameWidth = pdf.getTextWidth(orgName)
  pdf.text(orgName, (pageWidth - orgNameWidth) / 2, 20)

  // Organization details - centered
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')

  let yPos = 26
  if (org.cui) {
    const cuiText = `CUI: ${org.cui}`
    const cuiWidth = pdf.getTextWidth(cuiText)
    pdf.text(cuiText, (pageWidth - cuiWidth) / 2, yPos)
    yPos += 4
  }

  if (org.address) {
    const addressWidth = pdf.getTextWidth(org.address)
    pdf.text(org.address, (pageWidth - addressWidth) / 2, yPos)
    yPos += 4
  }

  const contactParts = []
  if (org.contact_phone) contactParts.push(`Tel: ${org.contact_phone}`)
  if (org.contact_email) contactParts.push(`Email: ${org.contact_email}`)

  if (contactParts.length > 0) {
    const contactText = contactParts.join(' | ')
    const contactWidth = pdf.getTextWidth(contactText)
    pdf.text(contactText, (pageWidth - contactWidth) / 2, yPos)
  }

  // Horizontal line
  pdf.setLineWidth(0.5)
  pdf.line(15, 42, pageWidth - 15, 42)

  // Document title - centered, bold
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  const title = 'FIȘĂ INDIVIDUALĂ DE ATRIBUIRE'
  const titleWidth = pdf.getTextWidth(title)
  pdf.text(title, (pageWidth - titleWidth) / 2, 50)

  // Subtitle - centered
  pdf.setFontSize(10)
  const subtitle = 'ECHIPAMENTE INDIVIDUALE DE PROTECȚIE (EIP)'
  const subtitleWidth = pdf.getTextWidth(subtitle)
  pdf.text(subtitle, (pageWidth - subtitleWidth) / 2, 56)

  // Legal reference - centered
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'normal')
  const legalRef = 'conform HG 1048/2006'
  const legalRefWidth = pdf.getTextWidth(legalRef)
  pdf.text(legalRef, (pageWidth - legalRefWidth) / 2, 61)
}

function addEmployeeInfo(pdf: jsPDF, employee: Employee): void {
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')

  const leftMargin = 15
  let yPos = 70

  // Employee name
  pdf.setFont('helvetica', 'bold')
  pdf.text('Nume și prenume angajat:', leftMargin, yPos)
  pdf.setFont('helvetica', 'normal')
  pdf.text(employee.full_name, leftMargin + 60, yPos)
  yPos += 7

  // Job title
  if (employee.job_title) {
    pdf.setFont('helvetica', 'bold')
    pdf.text('Funcția:', leftMargin, yPos)
    pdf.setFont('helvetica', 'normal')
    pdf.text(employee.job_title, leftMargin + 60, yPos)
    yPos += 7
  }

  // Department
  if (employee.department) {
    pdf.setFont('helvetica', 'bold')
    pdf.text('Departament:', leftMargin, yPos)
    pdf.setFont('helvetica', 'normal')
    pdf.text(employee.department, leftMargin + 60, yPos)
    yPos += 7
  }

  // Hire date
  if (employee.hire_date) {
    pdf.setFont('helvetica', 'bold')
    pdf.text('Data angajării:', leftMargin, yPos)
    pdf.setFont('helvetica', 'normal')
    const formattedDate = formatDate(employee.hire_date)
    pdf.text(formattedDate, leftMargin + 60, yPos)
  }
}

function addEquipmentTable(pdf: jsPDF, assignments: EquipmentAssignment[]): void {
  const startY = 100

  // Table header
  const headers = [
    'Nr.\ncrt.',
    'Denumire EIP',
    'Cant.',
    'Data\natribuire',
    'Semnătura\nprimire',
    'Data\nreturnare',
    'Semnătura\nreturnare',
    'Observații'
  ]

  // Table rows
  const rows = assignments.map((assignment, index) => [
    (index + 1).toString(),
    assignment.equipment_types?.name || 'N/A',
    assignment.quantity.toString(),
    formatDate(assignment.assignment_date),
    assignment.digital_signature ? '✓ Digital' : '',
    assignment.return_date ? formatDate(assignment.return_date) : '',
    assignment.return_date && assignment.digital_signature ? '✓ Digital' : '',
    assignment.notes || ''
  ])

  // If no assignments, add empty rows for future entries
  if (rows.length === 0) {
    for (let i = 0; i < 10; i++) {
      rows.push([
        (i + 1).toString(),
        '',
        '',
        '',
        '',
        '',
        '',
        ''
      ])
    }
  } else if (rows.length < 10) {
    // Add a few empty rows for future entries
    const currentCount = rows.length
    for (let i = 0; i < Math.min(5, 10 - currentCount); i++) {
      rows.push([
        (currentCount + i + 1).toString(),
        '',
        '',
        '',
        '',
        '',
        '',
        ''
      ])
    }
  }

  autoTable(pdf, {
    head: [headers],
    body: rows,
    startY: startY,
    margin: { left: 15, right: 15 },
    styles: {
      fontSize: 8,
      cellPadding: 2,
      lineColor: [0, 0, 0],
      lineWidth: 0.1
    },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle'
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },   // Nr. crt
      1: { cellWidth: 40 },                      // Denumire EIP
      2: { cellWidth: 12, halign: 'center' },   // Cant.
      3: { cellWidth: 20, halign: 'center' },   // Data atribuire
      4: { cellWidth: 22, halign: 'center' },   // Semnătura primire
      5: { cellWidth: 20, halign: 'center' },   // Data returnare
      6: { cellWidth: 22, halign: 'center' },   // Semnătura returnare
      7: { cellWidth: 34 }                       // Observații
    },
    bodyStyles: {
      valign: 'middle'
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    }
  })

  // Add note below table
  const finalY = (pdf as any).lastAutoTable.finalY || startY + 100

  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'italic')
  pdf.text(
    'Notă: Angajatul are obligația de a utiliza EIP-urile primite conform instrucțiunilor.',
    15,
    finalY + 8
  )
  pdf.text(
    'EIP-urile deteriorate sau pierdute se raportează imediat superiorului direct.',
    15,
    finalY + 13
  )

  // Legal reference
  pdf.setFont('helvetica', 'normal')
  pdf.text(
    'Prezenta fișă se completează conform prevederilor HG 1048/2006 privind cerințele minime de securitate și sănătate',
    15,
    finalY + 20
  )
  pdf.text(
    'pentru utilizarea de către lucrători a echipamentelor individuale de protecție la locul de muncă.',
    15,
    finalY + 25
  )
}

function addFooter(pdf: jsPDF): void {
  const pageCount = pdf.getNumberOfPages()
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'normal')

  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i)

    // Page number - centered at bottom
    const pageText = `Pagina ${i} din ${pageCount}`
    const textWidth = pdf.getTextWidth(pageText)
    pdf.text(pageText, (pageWidth - textWidth) / 2, pageHeight - 10)

    // Generated date - right aligned
    const dateText = `Generat: ${formatDate(new Date().toISOString())}`
    const dateWidth = pdf.getTextWidth(dateText)
    pdf.text(dateText, pageWidth - 15 - dateWidth, pageHeight - 10)

    // Powered by text - left aligned
    pdf.text('s-s-m.ro', 15, pageHeight - 10)
  }
}

// ========== HELPER FUNCTIONS ==========

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}
