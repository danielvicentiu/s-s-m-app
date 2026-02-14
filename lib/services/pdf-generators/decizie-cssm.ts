// lib/services/pdf-generators/decizie-cssm.ts
// Generator PDF Decizie constituire Comitet de Securitate și Sănătate în Muncă (CSSM)
// conform Art. 17-18 din Legea 319/2006

import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { createSupabaseServer } from '@/lib/supabase/server'

// ========== TYPES ==========

interface Organization {
  id: string
  name: string
  cui: string | null
  address: string | null
  contact_phone: string | null
  contact_email: string | null
  employee_count?: number
}

interface CSSMMember {
  id: string
  full_name: string
  job_title: string | null
  member_type: 'employer_rep' | 'worker_rep' | 'medical' | 'secretary'
  role_description?: string
}

interface DecizieCSSDMData {
  organization: Organization
  decisionNumber: string
  decisionDate: string
  members: CSSMMember[]
  cssmPresident?: CSSMMember
  cssmSecretary?: CSSMMember
  medicalDoctor?: CSSMMember
  establishmentReason: string
}

// ========== PDF GENERATOR ==========

/**
 * Generează PDF Decizie constituire CSSM conform Legea 319/2006 Art. 17-18
 * @param orgId - ID organizație din Supabase
 * @param options - Opțiuni pentru decizie (număr, dată, motiv)
 * @returns Buffer cu PDF-ul generat
 */
export async function generateDecizieCSSDMPDF(
  orgId: string,
  options?: {
    decisionNumber?: string
    decisionDate?: string
    establishmentReason?: string
  }
): Promise<Buffer> {
  // Fetch data from Supabase
  const data = await fetchDecizieCSSDMData(orgId, options)

  // Generate PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  // Configure fonts
  pdf.setFont('helvetica')

  let currentY = 20

  // Add content
  currentY = addHeader(pdf, data.organization, currentY)
  currentY = addDecisionHeader(pdf, data.decisionNumber, data.decisionDate, currentY)
  currentY = addPreamble(pdf, data.organization, data.establishmentReason, currentY)
  currentY = addDecisionBody(pdf, currentY)
  currentY = addMembersSection(pdf, data.members, currentY, data.cssmPresident, data.cssmSecretary, data.medicalDoctor)
  currentY = addAttributions(pdf, currentY)
  currentY = addMeetingSchedule(pdf, currentY)
  currentY = addFinalProvisions(pdf, currentY)
  addSignatures(pdf)
  addFooter(pdf)

  // Convert to buffer
  const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))
  return pdfBuffer
}

// ========== DATA FETCHING ==========

async function fetchDecizieCSSDMData(
  orgId: string,
  options?: {
    decisionNumber?: string
    decisionDate?: string
    establishmentReason?: string
  }
): Promise<DecizieCSSDMData> {
  const supabase = await createSupabaseServer()

  // Fetch organization
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .single()

  if (orgError || !organization) {
    throw new Error(`Organization not found: ${orgError?.message || 'Unknown error'}`)
  }

  // Fetch active employees for potential CSSM members
  // In a real implementation, you'd have a dedicated cssm_members table
  // For now, we'll fetch key employees (management + workers)
  const { data: employees, error: empError } = await supabase
    .from('employees')
    .select('id, full_name, job_title')
    .eq('organization_id', orgId)
    .eq('is_active', true)
    .order('full_name', { ascending: true })
    .limit(10)

  if (empError) {
    throw new Error(`Failed to fetch employees: ${empError.message}`)
  }

  // Generate decision metadata
  const today = new Date()
  const decisionNumber = options?.decisionNumber || `${today.getFullYear()}/CSSM/${String(today.getMonth() + 1).padStart(2, '0')}`
  const decisionDate = options?.decisionDate || today.toISOString().split('T')[0]
  const establishmentReason = options?.establishmentReason ||
    'În conformitate cu prevederile art. 17 din Legea 319/2006 privind securitatea și sănătatea în muncă'

  // Map employees to CSSM members
  // In production, this would come from a dedicated table with explicit roles
  const members: CSSMMember[] = (employees || []).slice(0, 6).map((emp, index) => ({
    id: emp.id,
    full_name: emp.full_name,
    job_title: emp.job_title || 'Angajat',
    member_type: index < 2 ? 'employer_rep' : 'worker_rep',
    role_description: index < 2 ? 'Reprezentant angajator' : 'Reprezentant lucrători'
  }))

  // Designate president, secretary, and medical doctor
  const cssmPresident = members[0]
  const cssmSecretary = members[1]

  // Mock medical doctor (in production, fetch from a dedicated field/table)
  const medicalDoctor: CSSMMember = {
    id: 'medical-doctor-id',
    full_name: 'Dr. Medicină Muncă',
    job_title: 'Medic de Medicină a Muncii',
    member_type: 'medical',
    role_description: 'Medic participant'
  }

  return {
    organization,
    decisionNumber,
    decisionDate,
    members,
    cssmPresident,
    cssmSecretary,
    medicalDoctor,
    establishmentReason
  }
}

// ========== PDF SECTIONS ==========

function addHeader(pdf: jsPDF, org: Organization, startY: number): number {
  const pageWidth = pdf.internal.pageSize.getWidth()
  let yPos = startY

  // Organization name - centered, bold
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  const orgName = org.name || 'Organizație'
  const orgNameWidth = pdf.getTextWidth(orgName)
  pdf.text(orgName, (pageWidth - orgNameWidth) / 2, yPos)
  yPos += 6

  // Organization details - centered
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')

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
    yPos += 6
  }

  // Horizontal line
  pdf.setLineWidth(0.5)
  pdf.line(15, yPos, pageWidth - 15, yPos)
  yPos += 8

  return yPos
}

function addDecisionHeader(pdf: jsPDF, decisionNumber: string, decisionDate: string, startY: number): number {
  const pageWidth = pdf.internal.pageSize.getWidth()
  let yPos = startY

  // Document title - centered, bold
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  const title = 'DECIZIE'
  const titleWidth = pdf.getTextWidth(title)
  pdf.text(title, (pageWidth - titleWidth) / 2, yPos)
  yPos += 6

  // Subtitle - centered
  pdf.setFontSize(11)
  const subtitle = 'privind constituirea Comitetului de Securitate și Sănătate în Muncă'
  const subtitleWidth = pdf.getTextWidth(subtitle)
  pdf.text(subtitle, (pageWidth - subtitleWidth) / 2, yPos)
  yPos += 8

  // Decision number and date
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  const decisionInfo = `Nr. ${decisionNumber} din ${formatDate(decisionDate)}`
  const decisionInfoWidth = pdf.getTextWidth(decisionInfo)
  pdf.text(decisionInfo, (pageWidth - decisionInfoWidth) / 2, yPos)
  yPos += 10

  return yPos
}

function addPreamble(pdf: jsPDF, org: Organization, reason: string, startY: number): number {
  const leftMargin = 15
  const rightMargin = 15
  const pageWidth = pdf.internal.pageSize.getWidth()
  const maxWidth = pageWidth - leftMargin - rightMargin
  let yPos = startY

  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')

  // Legal basis
  const preambleText = [
    'Având în vedere:',
    '',
    '• Prevederile art. 17 și art. 18 din Legea nr. 319/2006 privind securitatea și sănătate în muncă, republicată;',
    '• Prevederile Hotărârii Guvernului nr. 1425/2006 pentru aprobarea Normelor metodologice de aplicare a prevederilor Legii nr. 319/2006;',
    '• Necesitatea asigurării unui mediu de lucru sigur și sănătos pentru toți lucrătorii;',
    `• Efectivul de ${org.employee_count || 'peste 50'} angajați ai organizației, care impune constituirea CSSM;`,
    '',
    reason
  ]

  for (const line of preambleText) {
    if (line === '') {
      yPos += 4
      continue
    }

    const lines = pdf.splitTextToSize(line, maxWidth)
    for (const splitLine of lines) {
      if (yPos > 270) {
        pdf.addPage()
        yPos = 20
      }
      pdf.text(splitLine, leftMargin, yPos)
      yPos += 5
    }
  }

  yPos += 5

  // Decision statement
  pdf.setFont('helvetica', 'bold')
  const decisionStatement = 'DECIDE:'
  pdf.text(decisionStatement, leftMargin, yPos)
  yPos += 8

  return yPos
}

function addDecisionBody(pdf: jsPDF, startY: number): number {
  const leftMargin = 15
  const rightMargin = 15
  const pageWidth = pdf.internal.pageSize.getWidth()
  const maxWidth = pageWidth - leftMargin - rightMargin
  let yPos = startY

  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')

  const articles = [
    {
      number: 'Art. 1',
      text: 'Se constituie Comitetul de Securitate și Sănătate în Muncă (CSSM) la nivelul organizației, în conformitate cu prevederile art. 17 din Legea nr. 319/2006.'
    },
    {
      number: 'Art. 2',
      text: 'Comitetul are ca scop principal asigurarea implicării lucrătorilor în aplicarea măsurilor de securitate și sănătate în muncă și în îmbunătățirea continuă a condițiilor de muncă.'
    }
  ]

  for (const article of articles) {
    if (yPos > 270) {
      pdf.addPage()
      yPos = 20
    }

    pdf.setFont('helvetica', 'bold')
    pdf.text(article.number, leftMargin, yPos)
    yPos += 5

    pdf.setFont('helvetica', 'normal')
    const lines = pdf.splitTextToSize(article.text, maxWidth - 5)
    for (const line of lines) {
      if (yPos > 270) {
        pdf.addPage()
        yPos = 20
      }
      pdf.text(line, leftMargin + 5, yPos)
      yPos += 5
    }
    yPos += 3
  }

  return yPos
}

function addMembersSection(
  pdf: jsPDF,
  members: CSSMMember[],
  startY: number,
  president?: CSSMMember,
  secretary?: CSSMMember,
  medicalDoctor?: CSSMMember
): number {
  const leftMargin = 15
  let yPos = startY

  if (yPos > 250) {
    pdf.addPage()
    yPos = 20
  }

  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Art. 3', leftMargin, yPos)
  yPos += 5

  pdf.setFont('helvetica', 'normal')
  pdf.text('Componența Comitetului de Securitate și Sănătate în Muncă:', leftMargin + 5, yPos)
  yPos += 8

  // President
  if (president) {
    pdf.setFont('helvetica', 'bold')
    pdf.text('Președinte CSSM:', leftMargin + 5, yPos)
    yPos += 5
    pdf.setFont('helvetica', 'normal')
    pdf.text(`• ${president.full_name} - ${president.job_title || 'Reprezentant angajator'}`, leftMargin + 10, yPos)
    yPos += 7
  }

  // Secretary
  if (secretary) {
    pdf.setFont('helvetica', 'bold')
    pdf.text('Secretar CSSM:', leftMargin + 5, yPos)
    yPos += 5
    pdf.setFont('helvetica', 'normal')
    pdf.text(`• ${secretary.full_name} - ${secretary.job_title || 'Reprezentant angajator'}`, leftMargin + 10, yPos)
    yPos += 7
  }

  // Employer representatives
  pdf.setFont('helvetica', 'bold')
  pdf.text('Reprezentanți angajator:', leftMargin + 5, yPos)
  yPos += 5
  pdf.setFont('helvetica', 'normal')

  const employerReps = members.filter(m => m.member_type === 'employer_rep')
  for (const member of employerReps) {
    if (yPos > 270) {
      pdf.addPage()
      yPos = 20
    }
    pdf.text(`• ${member.full_name} - ${member.job_title || 'Angajat'}`, leftMargin + 10, yPos)
    yPos += 5
  }
  yPos += 3

  // Worker representatives
  pdf.setFont('helvetica', 'bold')
  pdf.text('Reprezentanți lucrători:', leftMargin + 5, yPos)
  yPos += 5
  pdf.setFont('helvetica', 'normal')

  const workerReps = members.filter(m => m.member_type === 'worker_rep')
  for (const member of workerReps) {
    if (yPos > 270) {
      pdf.addPage()
      yPos = 20
    }
    pdf.text(`• ${member.full_name} - ${member.job_title || 'Angajat'}`, leftMargin + 10, yPos)
    yPos += 5
  }
  yPos += 3

  // Medical doctor
  if (medicalDoctor) {
    pdf.setFont('helvetica', 'bold')
    pdf.text('Medic de medicină a muncii (participant consultativ):', leftMargin + 5, yPos)
    yPos += 5
    pdf.setFont('helvetica', 'normal')
    pdf.text(`• ${medicalDoctor.full_name}`, leftMargin + 10, yPos)
    yPos += 7
  }

  return yPos
}

function addAttributions(pdf: jsPDF, startY: number): number {
  const leftMargin = 15
  const rightMargin = 15
  const pageWidth = pdf.internal.pageSize.getWidth()
  const maxWidth = pageWidth - leftMargin - rightMargin
  let yPos = startY

  if (yPos > 250) {
    pdf.addPage()
    yPos = 20
  }

  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Art. 4', leftMargin, yPos)
  yPos += 5

  pdf.setFont('helvetica', 'normal')
  pdf.text('Atribuțiile Comitetului de Securitate și Sănătate în Muncă:', leftMargin + 5, yPos)
  yPos += 7

  const attributions = [
    'Analizează și face propuneri privind politica de securitate și sănătate în muncă',
    'Urmărește modul de aplicare a reglementărilor legale în domeniul SSM',
    'Efectuează verificări periodice ale condițiilor de muncă',
    'Analizează cauzele accidentelor de muncă și bolilor profesionale',
    'Propune măsuri de prevenire a riscurilor profesionale',
    'Avizează programele de instruire și testare în domeniul SSM',
    'Promovează inițiative pentru îmbunătățirea securității în muncă',
    'Elaborează rapoarte semestriale privind activitatea desfășurată'
  ]

  for (const attribution of attributions) {
    if (yPos > 270) {
      pdf.addPage()
      yPos = 20
    }
    const lines = pdf.splitTextToSize(`• ${attribution};`, maxWidth - 10)
    for (const line of lines) {
      pdf.text(line, leftMargin + 10, yPos)
      yPos += 5
    }
  }

  yPos += 3
  return yPos
}

function addMeetingSchedule(pdf: jsPDF, startY: number): number {
  const leftMargin = 15
  const rightMargin = 15
  const pageWidth = pdf.internal.pageSize.getWidth()
  const maxWidth = pageWidth - leftMargin - rightMargin
  let yPos = startY

  if (yPos > 260) {
    pdf.addPage()
    yPos = 20
  }

  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Art. 5', leftMargin, yPos)
  yPos += 5

  pdf.setFont('helvetica', 'normal')
  const scheduleText = 'Comitetul se întrunește trimestrial în ședință ordinară și extraordinar, ori de câte ori este necesar. Ședințele se convoacă de către președinte sau la solicitarea a cel puțin jumătate din membrii comitetului.'

  const lines = pdf.splitTextToSize(scheduleText, maxWidth - 5)
  for (const line of lines) {
    if (yPos > 270) {
      pdf.addPage()
      yPos = 20
    }
    pdf.text(line, leftMargin + 5, yPos)
    yPos += 5
  }

  yPos += 3
  return yPos
}

function addFinalProvisions(pdf: jsPDF, startY: number): number {
  const leftMargin = 15
  const rightMargin = 15
  const pageWidth = pdf.internal.pageSize.getWidth()
  const maxWidth = pageWidth - leftMargin - rightMargin
  let yPos = startY

  if (yPos > 260) {
    pdf.addPage()
    yPos = 20
  }

  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Art. 6', leftMargin, yPos)
  yPos += 5

  pdf.setFont('helvetica', 'normal')
  const finalText = 'Prezenta decizie intră în vigoare la data semnării și se comunică tuturor membrilor CSSM, precum și întregului personal al organizației prin afișare la loc vizibil.'

  const lines = pdf.splitTextToSize(finalText, maxWidth - 5)
  for (const line of lines) {
    if (yPos > 270) {
      pdf.addPage()
      yPos = 20
    }
    pdf.text(line, leftMargin + 5, yPos)
    yPos += 5
  }

  yPos += 10
  return yPos
}

function addSignatures(pdf: jsPDF): void {
  const pageHeight = pdf.internal.pageSize.getHeight()
  const leftMargin = 15
  const rightMargin = 15
  const pageWidth = pdf.internal.pageSize.getWidth()

  let yPos = pageHeight - 60

  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')

  // Director/Manager signature
  const directorX = leftMargin + 20
  pdf.text('DIRECTOR/MANAGER', directorX, yPos)
  yPos += 15
  pdf.line(directorX, yPos, directorX + 50, yPos)
  yPos += 4
  pdf.setFontSize(8)
  pdf.text('(nume și semnătură)', directorX + 5, yPos)

  // President CSSM signature
  yPos = pageHeight - 60
  const presidentX = pageWidth - rightMargin - 70
  pdf.setFontSize(10)
  pdf.text('PREȘEDINTE CSSM', presidentX, yPos)
  yPos += 15
  pdf.line(presidentX, yPos, presidentX + 50, yPos)
  yPos += 4
  pdf.setFontSize(8)
  pdf.text('(nume și semnătură)', presidentX + 5, yPos)
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
