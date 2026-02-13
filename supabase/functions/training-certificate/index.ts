// Supabase Edge Function: Generate Training Certificate PDF
// Deploy: supabase functions deploy training-certificate
// Environment variables required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders } from "../_shared/cors.ts";

// Import jsPDF for PDF generation
// @ts-ignore
import jsPDF from "https://esm.sh/jspdf@2.5.1";
// @ts-ignore
import QRCode from "https://esm.sh/qrcode@1.5.3";

// Types
interface CertificateRequest {
  training_id: string;
  employee_id: string;
}

interface TrainingData {
  id: string;
  session_date: string;
  duration_minutes: number;
  instructor_name: string;
  language: string;
  location: string | null;
  test_score: number | null;
  verification_result: string;
  module: {
    code: string;
    title: string;
    category: string;
    training_type: string;
    legal_basis: string[];
  };
  organization: {
    name: string;
    cui: string | null;
    address: string | null;
    contact_phone: string | null;
  };
  employee: {
    full_name: string;
    cnp_hash: string | null;
    job_title: string | null;
  };
}

// Helper: Format date to Romanian format
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Helper: Generate verification URL
function generateVerificationUrl(trainingId: string): string {
  return `https://app.s-s-m.ro/verify/${trainingId}`;
}

// Fetch training data from database
async function fetchTrainingData(
  supabase: any,
  trainingId: string,
  employeeId: string
): Promise<TrainingData> {
  // Fetch training session with related data
  const { data: session, error: sessionError } = await supabase
    .from('training_sessions')
    .select(`
      id,
      session_date,
      duration_minutes,
      instructor_name,
      language,
      location,
      test_score,
      verification_result,
      module_id,
      organization_id,
      worker_id
    `)
    .eq('id', trainingId)
    .eq('worker_id', employeeId)
    .single();

  if (sessionError) {
    throw new Error(`Failed to fetch training session: ${sessionError.message}`);
  }

  // Fetch module details
  const { data: module, error: moduleError } = await supabase
    .from('training_modules')
    .select('code, title, category, training_type, legal_basis')
    .eq('id', session.module_id)
    .single();

  if (moduleError) {
    throw new Error(`Failed to fetch training module: ${moduleError.message}`);
  }

  // Fetch organization details
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('name, cui, address, contact_phone')
    .eq('id', session.organization_id)
    .single();

  if (orgError) {
    throw new Error(`Failed to fetch organization: ${orgError.message}`);
  }

  // Fetch employee details (workers table)
  const { data: employee, error: empError } = await supabase
    .from('workers')
    .select('full_name, cnp_hash, job_title')
    .eq('id', employeeId)
    .single();

  if (empError) {
    throw new Error(`Failed to fetch employee: ${empError.message}`);
  }

  return {
    id: session.id,
    session_date: session.session_date,
    duration_minutes: session.duration_minutes,
    instructor_name: session.instructor_name,
    language: session.language,
    location: session.location,
    test_score: session.test_score,
    verification_result: session.verification_result,
    module,
    organization,
    employee
  };
}

// Generate PDF certificate
async function generateCertificatePDF(data: TrainingData): Promise<Uint8Array> {
  // Create new PDF document (A4 landscape for certificate)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // Border
  doc.setLineWidth(2);
  doc.setDrawColor(37, 99, 235); // blue-600
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Header
  doc.setFillColor(37, 99, 235);
  doc.rect(margin, margin, pageWidth - (margin * 2), 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFICAT DE INSTRUIRE', pageWidth / 2, margin + 12, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Securitate și Sănătate în Muncă / Prevenirea și Stingerea Incendiilor', pageWidth / 2, margin + 22, { align: 'center' });

  // Organization header
  let yPos = margin + 40;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(data.organization.name, pageWidth / 2, yPos, { align: 'center' });

  yPos += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  if (data.organization.cui) {
    doc.text(`CUI: ${data.organization.cui}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
  }
  if (data.organization.address) {
    doc.text(data.organization.address, pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
  }

  // Main content
  yPos += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Se certifică că:', margin + 10, yPos);

  // Employee name (centered, large)
  yPos += 12;
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(37, 99, 235);
  doc.text(data.employee.full_name, pageWidth / 2, yPos, { align: 'center' });

  // Job title
  if (data.employee.job_title) {
    yPos += 8;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(0, 0, 0);
    doc.text(`Funcția: ${data.employee.job_title}`, pageWidth / 2, yPos, { align: 'center' });
  }

  // Training details
  yPos += 15;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('a participat și a absolvit cu succes instruirea:', pageWidth / 2, yPos, { align: 'center' });

  // Training module box
  yPos += 10;
  const boxWidth = pageWidth - (margin * 4);
  const boxX = (pageWidth - boxWidth) / 2;

  doc.setFillColor(249, 250, 251); // gray-50
  doc.setDrawColor(229, 231, 235); // gray-200
  doc.setLineWidth(0.5);
  doc.rect(boxX, yPos, boxWidth, 35, 'FD');

  yPos += 8;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(37, 99, 235);
  doc.text(data.module.title, pageWidth / 2, yPos, { align: 'center' });

  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(`Cod modul: ${data.module.code} | Categorie: ${data.module.category.toUpperCase()}`, pageWidth / 2, yPos, { align: 'center' });

  yPos += 6;
  doc.text(`Tip instruire: ${data.module.training_type}`, pageWidth / 2, yPos, { align: 'center' });

  // Training session details
  yPos += 15;
  const leftCol = margin + 30;
  const rightCol = pageWidth - margin - 80;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Data instruirii:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(data.session_date), leftCol + 40, yPos);

  doc.setFont('helvetica', 'bold');
  doc.text('Durata:', rightCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.duration_minutes} minute`, rightCol + 20, yPos);

  yPos += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Instructor:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(data.instructor_name, leftCol + 40, yPos);

  if (data.location) {
    doc.setFont('helvetica', 'bold');
    doc.text('Locație:', rightCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(data.location, rightCol + 20, yPos);
    yPos += 7;
  }

  // Test result (if available)
  if (data.test_score !== null) {
    yPos += 7;
    doc.setFont('helvetica', 'bold');
    doc.text('Rezultat evaluare:', leftCol, yPos);
    doc.setFont('helvetica', 'normal');
    const resultText = `${data.test_score}% - ${data.verification_result.toUpperCase()}`;
    const resultColor = data.verification_result === 'admis' ? [16, 185, 129] : [239, 68, 68];
    doc.setTextColor(resultColor[0], resultColor[1], resultColor[2]);
    doc.text(resultText, leftCol + 40, yPos);
    doc.setTextColor(0, 0, 0);
  }

  // Legal basis
  if (data.module.legal_basis && data.module.legal_basis.length > 0) {
    yPos += 10;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(107, 114, 128); // gray-500
    doc.text('Bază legală:', margin + 20, yPos);
    yPos += 4;
    doc.text(data.module.legal_basis.join(', '), margin + 20, yPos, { maxWidth: pageWidth - (margin * 4) });
  }

  // Generate QR code for verification
  const verificationUrl = generateVerificationUrl(data.id);
  const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
    width: 150,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });

  // Add QR code to bottom right
  const qrSize = 35;
  const qrX = pageWidth - margin - qrSize - 10;
  const qrY = pageHeight - margin - qrSize - 15;
  doc.addImage(qrCodeDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

  // QR code label
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text('Scanează pentru verificare', qrX + (qrSize / 2), qrY + qrSize + 4, { align: 'center' });

  // Footer
  const footerY = pageHeight - margin - 10;
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text(`Certificat ID: ${data.id}`, margin + 20, footerY);
  doc.text(`Generat pe: ${formatDate(new Date().toISOString())}`, pageWidth / 2, footerY, { align: 'center' });
  doc.text('s-s-m.ro', pageWidth - margin - 20, footerY, { align: 'right' });

  // Convert to Uint8Array
  const pdfData = doc.output('arraybuffer');
  return new Uint8Array(pdfData);
}

// Upload PDF to Supabase Storage
async function uploadToStorage(
  supabase: any,
  pdfData: Uint8Array,
  trainingId: string,
  employeeName: string
): Promise<string> {
  const timestamp = new Date().getTime();
  const sanitizedName = employeeName.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `certificate_${sanitizedName}_${trainingId}_${timestamp}.pdf`;
  const filePath = `training-certificates/${fileName}`;

  // Upload to storage bucket
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(filePath, pdfData, {
      contentType: 'application/pdf',
      upsert: false
    });

  if (error) {
    throw new Error(`Failed to upload to storage: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('documents')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

// Update training session with certificate info
async function updateTrainingSession(
  supabase: any,
  trainingId: string,
  certificateUrl: string
): Promise<void> {
  const { error } = await supabase
    .from('training_sessions')
    .update({
      fisa_generated_at: new Date().toISOString(),
      audit_trail: {
        certificate_generated: true,
        certificate_url: certificateUrl,
        generated_at: new Date().toISOString()
      }
    })
    .eq('id', trainingId);

  if (error) {
    console.error('Failed to update training session:', error);
    // Non-fatal error, don't throw
  }
}

// Main request handler
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase configuration");
    }

    // Parse request body
    const body: CertificateRequest = await req.json();
    const { training_id, employee_id } = body;

    // Validate input
    if (!training_id || !employee_id) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: training_id, employee_id"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log(`Generating certificate for training ${training_id}, employee ${employee_id}`);

    // Fetch training data
    const trainingData = await fetchTrainingData(supabase, training_id, employee_id);

    // Generate PDF
    const pdfData = await generateCertificatePDF(trainingData);

    // Upload to storage
    const certificateUrl = await uploadToStorage(
      supabase,
      pdfData,
      training_id,
      trainingData.employee.full_name
    );

    // Update training session record
    await updateTrainingSession(supabase, training_id, certificateUrl);

    console.log(`Certificate generated successfully: ${certificateUrl}`);

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        certificate_url: certificateUrl,
        training_id: training_id,
        employee_name: trainingData.employee.full_name,
        module_title: trainingData.module.title,
        generated_at: new Date().toISOString()
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("Error generating certificate:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to generate certificate",
        message: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});
