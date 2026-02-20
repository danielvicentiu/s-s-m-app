'use client';

/**
 * ScanClient - Universal Document Scan with Batch Processing
 * Multi-step wizard pentru scan și extragere date documente SSM/PSI/contabilitate
 * Cu suport pentru procesare în batch a mai multor documente
 */

import { useState, useEffect, useCallback, Fragment } from 'react';
import { useTranslations } from 'next-intl';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import type { ScanTemplate, TemplateCategory } from '@/lib/scan-pipeline';
import { validateCNP, validateCUI } from '@/lib/utils/validators';

type Step = 'select-type' | 'upload' | 'processing' | 'results';
type ProcessStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface FileItem {
  id: string;
  file: File;
  preview: string;
  base64: string;
  size: number;
  status: ProcessStatus;
  extractedData?: Record<string, string>;
  confidenceScore?: number;
  scanId?: string;
  error?: string;
  validationErrors?: Record<string, string>; // Field validation errors (key -> error message)
  detectedType?: string; // Pentru auto-detect: tipul detectat de AI
}

interface ProcessingStats {
  total: number;
  completed: number;
  failed: number;
  processing: number;
}

interface ReceivedDoc {
  id: string;
  created_at: string;
  status: string;
  template_key: string | null;
  storage_path: string | null;
  original_filename: string | null;
  created_by: string | null;
  extracted_data?: Record<string, unknown> | null;
  imageUrl?: string;
}

export default function ScanClient() {
  const t = useTranslations('scan');

  const FIELD_LABELS: Record<string, string> = {
    tip_document: t('fieldTipDocument'),
    furnizor_nume: t('fieldFurnizorNume'),
    furnizor_cui: t('fieldFurnizorCui'),
    furnizor_adresa: t('fieldFurnizorAdresa'),
    cumparator_nume: t('fieldCumparatorNume'),
    cumparator_cui: t('fieldCumparatorCui'),
    data_document: t('fieldDataDocument'),
    numar_document: t('fieldNumarDocument'),
    suma_totala: t('fieldSumaTotala'),
    subtotal_fara_tva: t('fieldSubtotalFaraTva'),
    tva: t('fieldTva'),
    tva_total: t('fieldTvaTotal'),
    total_cu_tva: t('fieldTotalCuTva'),
    moneda: t('fieldMoneda'),
    metoda_plata: t('fieldMetodaPlata'),
    descriere_produse: t('fieldDescriereProdusse'),
    adresa_furnizor: t('fieldAdresaFurnizor'),
    cota_tva_detalii: t('fieldCotaTvaDetalii'),
  };

  const CATEGORIES: Record<string, { label_ro: string; label_en: string }> = {
    ssm: { label_ro: t('catSsm'), label_en: 'Occupational Health & Safety' },
    psi: { label_ro: t('catPsi'), label_en: 'Fire Safety' },
    medical: { label_ro: t('catMedical'), label_en: 'Medical' },
    equipment: { label_ro: t('catEquipment'), label_en: 'Equipment' },
    general: { label_ro: t('catGeneral'), label_en: 'General' },
    accounting: { label_ro: t('catAccounting'), label_en: 'Accounting' },
  };

  const [currentStep, setCurrentStep] = useState<Step>('select-type');
  const [templates, setTemplates] = useState<ScanTemplate[]>([]);
  const [categorizedTemplates, setCategorizedTemplates] = useState<TemplateCategory[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ScanTemplate | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [activeResultTab, setActiveResultTab] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [orgs, setOrgs] = useState<{ organization_id: string; org_name?: string }[]>([]);
  const [orgsLoaded, setOrgsLoaded] = useState(false);
  const [stats, setStats] = useState<ProcessingStats>({
    total: 0,
    completed: 0,
    failed: 0,
    processing: 0,
  });
  const [receivedDocs, setReceivedDocs] = useState<ReceivedDoc[]>([]);
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);
  const [confirmingDocId, setConfirmingDocId] = useState<string | null>(null);

  // Preia toate org_id-urile curentului user
  useEffect(() => {
    async function fetchOrgId() {
      const supabase = createSupabaseBrowser();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setOrgsLoaded(true);
        return;
      }

      const { data } = await supabase
        .from('memberships')
        .select('organization_id')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (data && data.length > 0) {
        const orgsWithNames: { organization_id: string; org_name?: string }[] = [];
        for (const membership of data) {
          const { data: orgData } = await supabase
            .from('organizations')
            .select('name')
            .eq('id', membership.organization_id)
            .single();
          orgsWithNames.push({
            organization_id: membership.organization_id,
            org_name: orgData?.name,
          });
        }
        setOrgs(orgsWithNames);
        setOrgId(orgsWithNames[0].organization_id);
      }
      setOrgsLoaded(true);
    }

    fetchOrgId();
  }, []);

  // Preia documente primite via portal
  const fetchReceivedDocs = useCallback(async () => {
    if (!orgId) return;
    const supabase = createSupabaseBrowser();
    const { data } = await supabase
      .from('document_scans')
      .select('id, created_at, status, template_key, storage_path, original_filename, created_by, extracted_data')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })
      .limit(20);
    if (data) {
      const docsWithUrls = await Promise.all(data.map(async (doc) => {
        let imageUrl: string | undefined;
        if (doc.storage_path) {
          const { data: signedData, error: signedError } = await supabase.storage
            .from('uploads')
            .createSignedUrl(doc.storage_path, 3600);
          if (!signedError && signedData?.signedUrl) {
            imageUrl = signedData.signedUrl;
          }
        }
        return { ...doc, imageUrl } as ReceivedDoc;
      }));
      setReceivedDocs(docsWithUrls);
    }
  }, [orgId]);

  useEffect(() => {
    fetchReceivedDocs();
    const interval = setInterval(fetchReceivedDocs, 30000);
    return () => clearInterval(interval);
  }, [fetchReceivedDocs]);

  // Preia template-uri din API
  useEffect(() => {
    async function fetchTemplates() {
      try {
        const response = await fetch('/api/scan-pipeline/templates');
        const data = await response.json();

        if (data.success && data.templates) {
          setTemplates(data.templates);

          // Grupează pe categorii
          const categorized: TemplateCategory[] = [];
          for (const [key, catInfo] of Object.entries(CATEGORIES)) {
            const categoryTemplates = data.templates.filter(
              (t: ScanTemplate) => t.category === key
            );
            if (categoryTemplates.length > 0) {
              categorized.push({
                key,
                label_ro: catInfo.label_ro,
                label_en: catInfo.label_en,
                templates: categoryTemplates,
              });
            }
          }
          setCategorizedTemplates(categorized);
        }
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError('Eroare la încărcarea tipurilor de documente');
      }
    }

    fetchTemplates();
  }, []);

  // Handler pentru selectare template
  const handleTemplateSelect = (template: ScanTemplate) => {
    setSelectedTemplate(template);
    setError(null);
    setCurrentStep('upload');
  };

  // Handler pentru selectare auto-detect
  const handleAutoDetectSelect = () => {
    // Creează un template virtual pentru auto-detect
    const autoDetectTemplate: ScanTemplate = {
      id: 'auto_detect',
      template_key: 'auto_detect',
      name_ro: 'Auto-detect - AI detectează automat tipul',
      name_en: 'Auto-detect - AI automatically detects type',
      category: 'general',
      fields: [],
      extraction_prompt: null,
      is_active: true,
    };
    setSelectedTemplate(autoDetectTemplate);
    setError(null);
    setCurrentStep('upload');
  };

  // Conversie fișier în base64
  const fileToBase64 = (file: File): Promise<{ preview: string; base64: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const preview = result;
        const base64 = result.split(',')[1]; // Elimină prefix-ul "data:image/...;base64,"
        resolve({ preview, base64 });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handler pentru adăugare fișiere multiple
  const handleFilesAdd = async (newFiles: File[]) => {
    setError(null);

    const validFiles: FileItem[] = [];
    for (const file of newFiles) {
      if (!file.type.startsWith('image/')) {
        setError('Toate fișierele trebuie să fie imagini (JPG, PNG, etc.)');
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Fișiere prea mari. Mărime maximă: 10 MB per fișier');
        continue;
      }

      try {
        const { preview, base64 } = await fileToBase64(file);
        validFiles.push({
          id: Math.random().toString(36).substring(7),
          file,
          preview,
          base64,
          size: file.size,
          status: 'pending',
        });
      } catch (err) {
        console.error('Error processing file:', err);
      }
    }

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  // Handler pentru input file multiple
  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      await handleFilesAdd(Array.from(fileList));
    }
  };

  // Handler pentru drag & drop multiple
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const fileList = e.dataTransfer.files;
    if (fileList) {
      await handleFilesAdd(Array.from(fileList));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Șterge un fișier individual
  const handleRemoveFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  // Procesare secvențială a documentelor
  const handleProcessBatch = async () => {
    if (files.length === 0 || !selectedTemplate || !orgId) {
      setError('Lipsesc date necesare pentru procesare');
      return;
    }

    setIsProcessing(true);
    setCurrentStep('processing');
    setError(null);

    // Reset stats
    setStats({
      total: files.length,
      completed: 0,
      failed: 0,
      processing: 0,
    });

    // Procesează secvențial cu pauză de 500ms între requesturi
    for (let i = 0; i < files.length; i++) {
      const fileItem = files[i];

      // Update status to processing
      setFiles((prev) =>
        prev.map((f) => (f.id === fileItem.id ? { ...f, status: 'processing' } : f))
      );

      setStats((prev) => ({ ...prev, processing: prev.processing + 1 }));

      try {
        const response = await fetch('/api/scan-pipeline/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: fileItem.base64,
            templateKey: selectedTemplate.template_key,
            orgId,
            filename: fileItem.file.name,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileItem.id
                ? {
                    ...f,
                    status: 'completed',
                    extractedData: data.extracted_data || {},
                    confidenceScore: data.confidence_score || 0,
                    scanId: data.scan_id || undefined,
                    validationErrors: data.validation_errors || undefined,
                    detectedType: data.detected_type || undefined,
                  }
                : f
            )
          );
          setStats((prev) => ({
            ...prev,
            completed: prev.completed + 1,
            processing: prev.processing - 1,
          }));

          // Dacă a fost auto-detect și avem template-uri, actualizăm selectedTemplate cu cel real
          if (selectedTemplate?.template_key === 'auto_detect' && data.detected_type && templates.length > 0) {
            const realTemplate = templates.find(t => t.template_key === data.detected_type);
            if (realTemplate) {
              setSelectedTemplate(realTemplate);
            }
          }
        } else {
          throw new Error(data.error || 'Eroare la extragere');
        }
      } catch (err) {
        console.error('Process error:', err);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id
              ? {
                  ...f,
                  status: 'failed',
                  error: err instanceof Error ? err.message : 'Eroare necunoscută',
                }
              : f
          )
        );
        setStats((prev) => ({
          ...prev,
          failed: prev.failed + 1,
          processing: prev.processing - 1,
        }));
      }

      // Pauză de 500ms între requesturi (mai puțin după ultimul)
      if (i < files.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    setIsProcessing(false);
    setCurrentStep('results');
  };

  // Handler pentru editare câmp
  const handleFieldChange = (fileId: string, key: string, value: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? { ...f, extractedData: { ...f.extractedData, [key]: value } }
          : f
      )
    );
  };

  // Handler pentru salvare individuală
  const handleSaveIndividual = async (fileId: string) => {
    const fileItem = files.find((f) => f.id === fileId);
    if (!fileItem || !fileItem.scanId || !orgId) return;

    try {
      const supabase = createSupabaseBrowser();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError('Nu ești autentificat');
        return;
      }

      const { error: updateError } = await supabase
        .from('document_scans')
        .update({
          extracted_data: fileItem.extractedData,
          status: 'reviewed',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', fileItem.scanId);

      if (updateError) {
        throw updateError;
      }

      alert('Document salvat cu succes!');
    } catch (err) {
      console.error('Save error:', err);
      setError('Eroare la salvarea documentului');
    }
  };

  // Confirma verificarea unui document primit
  const handleConfirm = async (scanId: string) => {
    setConfirmingDocId(scanId);
    try {
      const res = await fetch('/api/upload/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scan_id: scanId }),
      });
      if (!res.ok) {
        const data = await res.json();
        console.error('Confirm error:', data.error);
        alert('Eroare la confirmare: ' + (data.error || 'Eroare server'));
        return;
      }
      await fetchReceivedDocs();
      setExpandedDocId(null);
    } catch (err) {
      console.error('Confirm exception:', err);
      alert('Eroare la confirmare');
    } finally {
      setConfirmingDocId(null);
    }
  };

  // Reset wizard
  const resetWizard = () => {
    setCurrentStep('select-type');
    setSelectedTemplate(null);
    setFiles([]);
    setActiveResultTab(0);
    setError(null);
    setStats({ total: 0, completed: 0, failed: 0, processing: 0 });
  };

  // Culoare badge pentru confidence score
  const getConfidenceBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Culoare status badge
  const getStatusColor = (status: ProcessStatus) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: ProcessStatus) => {
    switch (status) {
      case 'processing':
        return t('statusProcessing');
      case 'completed':
        return t('statusCompleted');
      case 'failed':
        return t('statusFailed');
      default:
        return t('statusPending');
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-600 mt-1">
          {t('subtitle')}
        </p>
      </div>

      {/* Mobile Client Portal */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-blue-900">{t('mobilePortalTitle')}</h3>
          <p className="text-sm text-blue-700">
            {t('mobilePortalDesc')}
          </p>
        </div>
        <button
          onClick={async () => {
            if (!orgId) {
              alert('Selecteaza o organizatie mai intai');
              return;
            }
            const res = await fetch('/api/upload/generate-link', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ label: 'Link client', organization_id: orgId }),
            });
            const data = await res.json();
            await navigator.clipboard.writeText(data.url);
            alert('Link copiat in clipboard: ' + data.url);
          }}
          className="ml-4 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Generează link
        </button>
      </div>

      {/* Org Selector - pentru useri cu multiple organizatii */}
      {orgsLoaded && orgs.length > 1 && (
        <div className="bg-white border rounded-lg p-3 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('activeOrganization')}
          </label>
          <select
            value={orgId || ''}
            onChange={(e) => setOrgId(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {orgs.map((org) => (
              <option key={org.organization_id} value={org.organization_id}>
                {org.org_name || org.organization_id}
              </option>
            ))}
          </select>
        </div>
      )}
      {orgsLoaded && orgs.length === 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {t('noOrgAssociated')}
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
          <p className="font-medium">{t('errorLabel')}</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Step 1: Selectează tip document */}
      {currentStep === 'select-type' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('step1Title')}
          </h2>

          {/* Auto-detect option - PRIM buton cu stil distinct */}
          <div className="mb-6">
            <button
              onClick={handleAutoDetectSelect}
              className="w-full text-left p-5 border-2 border-blue-500 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-base">
                    ⚡ Auto-detect - Detectare Automată
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    AI detectează automat tipul documentului - Recomandat pentru viteză maximă
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Separator */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">sau selectează manual</span>
            </div>
          </div>

          <div className="space-y-6">
            {categorizedTemplates.map((category) => (
              <div key={category.key}>
                <h3 className="text-sm font-medium text-gray-700 mb-2">{category.label_ro}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {category.templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className="text-left p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <p className="font-medium text-gray-900">{template.name_ro}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {template.fields.length} câmpuri
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Upload multiple files */}
      {currentStep === 'upload' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('step2Title')}</h2>
            <button
              onClick={() => setCurrentStep('select-type')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {t('back')}
            </button>
          </div>

          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Document selectat:</strong> {selectedTemplate?.name_ro}
            </p>
          </div>

          {/* Upload area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 transition-colors cursor-pointer mb-6"
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-semibold text-blue-600">Click pentru a încărca</span> sau
                drag & drop
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, GIF până la 10 MB · Selectare multiplă permisă
              </p>
            </label>
          </div>

          {/* Files list with preview and delete */}
          {files.length > 0 && (
            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-medium text-gray-700">
                {t('selectedFiles', { count: files.length })}
              </h3>
              {files.map((fileItem) => (
                <div
                  key={fileItem.id}
                  className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg"
                >
                  {/* Thumbnail */}
                  <img
                    src={fileItem.preview}
                    alt={fileItem.file.name}
                    className="w-16 h-16 object-cover rounded border border-gray-200"
                  />

                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fileItem.file.name}
                    </p>
                    <p className="text-xs text-gray-500">{formatFileSize(fileItem.size)}</p>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => handleRemoveFile(fileItem.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    {t('delete')}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Process button */}
          {files.length > 0 && (
            <button
              onClick={handleProcessBatch}
              disabled={isProcessing}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {t('processFiles', { count: files.length })}
            </button>
          )}
        </div>
      )}

      {/* Step 3: Processing with progress */}
      {currentStep === 'processing' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {t('processingInProgress')}
          </h2>

          {/* Global progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {t('globalProgress')}: {stats.completed + stats.failed} / {stats.total}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {Math.round(((stats.completed + stats.failed) / stats.total) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${((stats.completed + stats.failed) / stats.total) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
              <p className="text-2xl font-bold text-green-800">{stats.completed}</p>
              <p className="text-xs text-green-600">{t('statsSuccess')}</p>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
              <p className="text-2xl font-bold text-red-800">{stats.failed}</p>
              <p className="text-xs text-red-600">{t('statsFailed')}</p>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center">
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-xs text-gray-600">{t('statsTotal')}</p>
            </div>
          </div>

          {/* Files status list */}
          <div className="space-y-2">
            {files.map((fileItem) => (
              <div
                key={fileItem.id}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
              >
                <img
                  src={fileItem.preview}
                  alt={fileItem.file.name}
                  className="w-12 h-12 object-cover rounded border border-gray-200"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {fileItem.file.name}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    fileItem.status
                  )}`}
                >
                  {getStatusLabel(fileItem.status)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Results with tabs and split view */}
      {currentStep === 'results' && (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
              <p className="text-2xl font-bold text-green-800">{stats.completed}</p>
              <p className="text-xs text-green-600">{t('statsSuccess')}</p>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
              <p className="text-2xl font-bold text-red-800">{stats.failed}</p>
              <p className="text-xs text-red-600">{t('statsFailed')}</p>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center">
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-xs text-gray-600">{t('statsTotal')}</p>
            </div>
          </div>

          {/* Tabs navigation */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{t('resultsTitle')}</h2>
              <button onClick={resetWizard} className="text-sm text-blue-600 hover:text-blue-700">
                {t('scanOtherDocuments')}
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 border-b border-gray-200">
              {files.map((fileItem, index) => (
                <button
                  key={fileItem.id}
                  onClick={() => setActiveResultTab(index)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                    activeResultTab === index
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Doc {index + 1}
                  {fileItem.status === 'completed' && ' ✓'}
                  {fileItem.status === 'failed' && ' ✗'}
                </button>
              ))}
            </div>

            {/* Active tab content - Split view */}
            {files[activeResultTab] && (
              <div>
                {files[activeResultTab].status === 'failed' ? (
                  <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                    <p className="font-medium text-red-800">{t('processingFailed')}</p>
                    <p className="text-sm text-red-600 mt-1">
                      {files[activeResultTab].error || 'Eroare necunoscută'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    {/* Left: Image preview */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">{t('originalDocument')}</h3>
                      <img
                        src={files[activeResultTab].preview}
                        alt={files[activeResultTab].file.name}
                        className="w-full h-auto rounded-xl border border-gray-200"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        {files[activeResultTab].file.name} ·{' '}
                        {formatFileSize(files[activeResultTab].size)}
                      </p>
                    </div>

                    {/* Right: Editable fields */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">{t('extractedData')}</h3>

                      {/* Detected type (pentru auto-detect) */}
                      {files[activeResultTab].detectedType && (
                        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-blue-600 flex-shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-blue-900">{t('autoDetectedType')}:</p>
                              <p className="text-xs text-blue-700 mt-0.5">
                                {templates.find(t => t.template_key === files[activeResultTab].detectedType)?.name_ro || files[activeResultTab].detectedType}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Confidence score */}
                      {files[activeResultTab].confidenceScore !== undefined && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-700">
                              Confidence Score:
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${getConfidenceBadgeColor(
                                files[activeResultTab].confidenceScore!
                              )}`}
                            >
                              {files[activeResultTab].confidenceScore!.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Editable fields */}
                      <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                        {selectedTemplate?.fields.map((field) => {
                          const hasError = files[activeResultTab].validationErrors?.[field.key];
                          const inputClassName = `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                            hasError
                              ? 'border-red-300 focus:ring-red-500'
                              : 'border-gray-300 focus:ring-blue-500'
                          }`;

                          return (
                            <div key={field.key}>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                {field.label}
                                {field.validation && (
                                  <span className="text-xs text-gray-500 ml-1">
                                    ({field.validation})
                                  </span>
                                )}
                              </label>
                              {field.type === 'select' && field.options ? (
                                <select
                                  value={
                                    files[activeResultTab].extractedData?.[field.key] || ''
                                  }
                                  onChange={(e) =>
                                    handleFieldChange(
                                      files[activeResultTab].id,
                                      field.key,
                                      e.target.value
                                    )
                                  }
                                  className={inputClassName}
                                >
                                  <option value="">- Selectează -</option>
                                  {field.options.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              ) : field.type === 'number' ? (
                                <input
                                  type="number"
                                  value={
                                    files[activeResultTab].extractedData?.[field.key] || ''
                                  }
                                  onChange={(e) =>
                                    handleFieldChange(
                                      files[activeResultTab].id,
                                      field.key,
                                      e.target.value
                                    )
                                  }
                                  className={inputClassName}
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={
                                    files[activeResultTab].extractedData?.[field.key] || ''
                                  }
                                  onChange={(e) =>
                                    handleFieldChange(
                                      files[activeResultTab].id,
                                      field.key,
                                      e.target.value
                                    )
                                  }
                                  className={inputClassName}
                                />
                              )}
                              {hasError && (
                                <p className="mt-1 text-xs text-red-600">{hasError}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Save button */}
                      <button
                        onClick={() => handleSaveIndividual(files[activeResultTab].id)}
                        disabled={!files[activeResultTab].scanId}
                        className="w-full py-2 px-4 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
                      >
                        {t('saveDocument')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Documente primite via Portal Client */}
      <div className="bg-white rounded-lg shadow p-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('receivedDocsTitle')}</h2>
          <button
            onClick={fetchReceivedDocs}
            className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
          >
            ↻ {t('refresh')}
          </button>
        </div>

        {receivedDocs.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">{t('noReceivedDocs')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('colUploadDate')}
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('colSource')}
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('colStatus')}
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('colDocType')}
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('colImage')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {receivedDocs.map((doc) => {
                  const statusColors: Record<string, string> = {
                    pending: 'bg-yellow-100 text-yellow-800',
                    completed: 'bg-green-100 text-green-800',
                    reviewed: 'bg-blue-100 text-blue-800',
                    error: 'bg-red-100 text-red-800',
                  };
                  const statusLabels: Record<string, string> = {
                    pending: t('statusPending'),
                    completed: t('statusCompleted'),
                    reviewed: t('statusReviewed'),
                    error: t('statusFailed'),
                  };
                  const source = doc.created_by ? 'Manual' : 'Portal';
                  const statusColor = statusColors[doc.status] ?? 'bg-gray-100 text-gray-800';
                  const statusLabel = statusLabels[doc.status] ?? doc.status;
                  const uploadDate = new Date(doc.created_at).toLocaleString('ro-RO', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const isExpanded = expandedDocId === doc.id;
                  const extractedData = doc.extracted_data as Record<string, unknown> | null | undefined;
                  const tipDocument = extractedData?.tip_document as string | null | undefined;

                  return (
                    <Fragment key={doc.id}>
                      <tr
                        onClick={() => setExpandedDocId(isExpanded ? null : doc.id)}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer select-none"
                      >
                        <td className="py-3 px-3 text-gray-700 whitespace-nowrap">{uploadDate}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              source === 'Portal'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {source}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-600">
                          {tipDocument ? (
                            tipDocument
                          ) : (
                            <span className="text-gray-400 italic">{t('notDetected')}</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {doc.imageUrl ? (
                            <a
                              href={doc.imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-blue-600 hover:text-blue-700 hover:underline text-xs"
                            >
                              Vezi imagine ↗
                            </a>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={5} className="p-0 border-b border-gray-200">
                            <div className="bg-gray-50 rounded-lg p-4 m-2">
                              <div className="grid grid-cols-2 gap-6">
                                {/* Stanga: imaginea documentului */}
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Document</h4>
                                  {doc.imageUrl ? (
                                    <img
                                      src={doc.imageUrl}
                                      alt={doc.original_filename || 'Document'}
                                      className="max-w-md w-full h-auto rounded-lg border border-gray-200 object-contain"
                                    />
                                  ) : (
                                    <p className="text-sm text-gray-400 italic">Imagine indisponibilă</p>
                                  )}
                                </div>
                                {/* Dreapta: date extrase */}
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Date extrase</h4>
                                  {extractedData && Object.keys(extractedData).length > 0 ? (
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
                                      {Object.entries(FIELD_LABELS).map(([key, label]) => {
                                        const val = extractedData[key];
                                        if (val === null || val === undefined || val === '') return null;
                                        return (
                                          <div key={key}>
                                            <p className="text-xs font-bold text-gray-600">{label}</p>
                                            <p className="text-xs text-gray-800 mt-0.5">{Array.isArray(val) || (typeof val === 'object' && val !== null) ? JSON.stringify(val) : String(val)}</p>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-400 italic mb-4">Nu există date extrase.</p>
                                  )}
                                  {Array.isArray(extractedData?.produse) && (extractedData!.produse as unknown[]).length > 0 && (
                                    <div className="mt-4">
                                      <p className="text-xs font-bold text-gray-600 mb-1">Produse</p>
                                      <div className="overflow-x-auto">
                                        <table className="w-full text-sm border border-gray-200 rounded-lg">
                                          <thead className="bg-gray-50">
                                            <tr>
                                              <th className="text-left py-1 px-2 text-xs font-medium text-gray-600 border-b border-gray-200">Denumire</th>
                                              <th className="text-right py-1 px-2 text-xs font-medium text-gray-600 border-b border-gray-200">Cant.</th>
                                              <th className="text-right py-1 px-2 text-xs font-medium text-gray-600 border-b border-gray-200">Pret unitar</th>
                                              <th className="text-right py-1 px-2 text-xs font-medium text-gray-600 border-b border-gray-200">Val. fara TVA</th>
                                              <th className="text-right py-1 px-2 text-xs font-medium text-gray-600 border-b border-gray-200">TVA</th>
                                              <th className="text-right py-1 px-2 text-xs font-medium text-gray-600 border-b border-gray-200">Val. cu TVA</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {(extractedData!.produse as Record<string, unknown>[]).map((produs, idx) => (
                                              <tr key={idx} className="border-b border-gray-100 last:border-0">
                                                <td className="py-1 px-2 text-xs text-gray-800">{produs.denumire != null ? String(produs.denumire) : '—'}</td>
                                                <td className="py-1 px-2 text-xs text-gray-800 text-right">{produs.cantitate != null ? String(produs.cantitate) : '—'}</td>
                                                <td className="py-1 px-2 text-xs text-gray-800 text-right">{produs.pret_unitar != null ? String(produs.pret_unitar) : '—'}</td>
                                                <td className="py-1 px-2 text-xs text-gray-800 text-right">{produs.valoare_fara_tva != null ? String(produs.valoare_fara_tva) : '—'}</td>
                                                <td className="py-1 px-2 text-xs text-gray-800 text-right">{produs.tva_valoare != null ? String(produs.tva_valoare) : '—'}</td>
                                                <td className="py-1 px-2 text-xs text-gray-800 text-right">{produs.valoare_cu_tva != null ? String(produs.valoare_cu_tva) : '—'}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleConfirm(doc.id);
                                    }}
                                    disabled={confirmingDocId === doc.id || doc.status === 'reviewed'}
                                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                  >
                                    {confirmingDocId === doc.id
                                      ? t('statusProcessing')
                                      : doc.status === 'reviewed'
                                      ? t('alreadyVerified')
                                      : t('confirmVerification')}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
