'use client';

/**
 * ScanClient - Universal Document Scan with OCR + AI Extraction
 * Multi-step wizard pentru scan și extragere date documente SSM/PSI/contabilitate
 */

import { useState, useEffect, useCallback } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import type { ScanTemplate, TemplateCategory } from '@/lib/scan-pipeline';

// Categorii pentru grupare template-uri
const CATEGORIES: Record<string, { label_ro: string; label_en: string }> = {
  ssm: { label_ro: 'SSM - Securitate și Sănătate', label_en: 'Occupational Health & Safety' },
  psi: { label_ro: 'PSI - Prevenire Incendii', label_en: 'Fire Safety' },
  medical: { label_ro: 'Medical', label_en: 'Medical' },
  equipment: { label_ro: 'Echipamente', label_en: 'Equipment' },
  general: { label_ro: 'General', label_en: 'General' },
  accounting: { label_ro: 'Contabilitate', label_en: 'Accounting' },
};

type Step = 'select-type' | 'upload' | 'preview' | 'result';

export default function ScanClient() {
  const [currentStep, setCurrentStep] = useState<Step>('select-type');
  const [templates, setTemplates] = useState<ScanTemplate[]>([]);
  const [categorizedTemplates, setCategorizedTemplates] = useState<TemplateCategory[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ScanTemplate | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<Record<string, string>>({});
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null);
  const [scanId, setScanId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);

  // Preia org_id curent
  useEffect(() => {
    async function fetchOrgId() {
      const supabase = createSupabaseBrowser();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from('memberships')
        .select('org_id')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setOrgId(data.org_id);
      }
    }

    fetchOrgId();
  }, []);

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

  // Handler pentru upload imagine
  const handleFileChange = useCallback((file: File) => {
    setImageFile(file);
    setError(null);

    // Creează preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Convertește în base64 (fără prefix data:image/...)
    const base64Reader = new FileReader();
    base64Reader.onload = (e) => {
      const result = e.target?.result as string;
      const base64 = result.split(',')[1]; // Elimină prefix-ul "data:image/...;base64,"
      setImageBase64(base64);
    };
    base64Reader.readAsDataURL(file);

    setCurrentStep('preview');
  }, []);

  // Handler pentru drag & drop
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        if (file.size > 10 * 1024 * 1024) {
          setError('Fișierul este prea mare. Mărime maximă: 10 MB');
          return;
        }
        handleFileChange(file);
      } else {
        setError('Vă rugăm să încărcați o imagine (JPG, PNG, etc.)');
      }
    },
    [handleFileChange]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handler pentru click upload
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Fișierul este prea mare. Mărime maximă: 10 MB');
        return;
      }
      handleFileChange(file);
    }
  };

  // Handler pentru extragere date cu AI
  const handleExtract = async () => {
    if (!imageBase64 || !selectedTemplate || !orgId) {
      setError('Lipsesc date necesare pentru extragere');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/scan-pipeline/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          templateKey: selectedTemplate.template_key,
          orgId,
          filename: imageFile?.name || 'document.jpg',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setExtractedData(data.extracted_data || {});
        setConfidenceScore(data.confidence_score || 0);
        setScanId(data.scan_id || null);
        setCurrentStep('result');
      } else {
        setError(data.error || 'Eroare la extragerea datelor');
      }
    } catch (err) {
      console.error('Extract error:', err);
      setError('Eroare la comunicarea cu serverul');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler pentru editare câmp
  const handleFieldChange = (key: string, value: string) => {
    setExtractedData((prev) => ({ ...prev, [key]: value }));
  };

  // Handler pentru salvare finală (reviewed)
  const handleSave = async () => {
    if (!scanId || !orgId) return;

    setIsLoading(true);
    setError(null);

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
          extracted_data: extractedData,
          status: 'reviewed',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', scanId);

      if (updateError) {
        throw updateError;
      }

      // Success - reset la început
      alert('Datele au fost salvate cu succes!');
      resetWizard();
    } catch (err) {
      console.error('Save error:', err);
      setError('Eroare la salvarea datelor');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset wizard
  const resetWizard = () => {
    setCurrentStep('select-type');
    setSelectedTemplate(null);
    setImageFile(null);
    setImagePreview(null);
    setImageBase64(null);
    setExtractedData({});
    setConfidenceScore(null);
    setScanId(null);
    setError(null);
  };

  // Culoare badge pentru confidence score
  const getConfidenceBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Scan Documente Universal</h1>
        <p className="text-gray-600 mt-1">
          Extrage automat date din documente SSM/PSI/Medical/Echipamente/Contabilitate folosind AI
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
          <p className="font-medium">Eroare</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Step 1: Selectează tip document */}
      {currentStep === 'select-type' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Pasul 1: Selectează tipul de document
          </h2>

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

      {/* Step 2: Upload imagine */}
      {currentStep === 'upload' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pasul 2: Încarcă documentul</h2>
            <button
              onClick={() => setCurrentStep('select-type')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              ← Înapoi
            </button>
          </div>

          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Document selectat:</strong> {selectedTemplate?.name_ro}
            </p>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 transition-colors cursor-pointer"
          >
            <input
              type="file"
              accept="image/*"
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
                PNG, JPG, GIF până la 10 MB
              </p>
            </label>
          </div>
        </div>
      )}

      {/* Step 3: Preview + Extrage */}
      {currentStep === 'preview' && imagePreview && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pasul 3: Preview și extragere</h2>
            <button
              onClick={() => setCurrentStep('upload')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              ← Schimbă imaginea
            </button>
          </div>

          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Document:</strong> {selectedTemplate?.name_ro} ({imageFile?.name})
            </p>
          </div>

          <div className="mb-6">
            <img
              src={imagePreview}
              alt="Preview document"
              className="max-w-full h-auto rounded-xl border border-gray-200"
            />
          </div>

          <button
            onClick={handleExtract}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {isLoading ? 'Se procesează...' : 'Extrage date cu AI'}
          </button>
        </div>
      )}

      {/* Step 4: Rezultat - Câmpuri editabile */}
      {currentStep === 'result' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pasul 4: Verifică și salvează</h2>
            <button onClick={resetWizard} className="text-sm text-blue-600 hover:text-blue-700">
              ← Scanează alt document
            </button>
          </div>

          {/* Confidence Score */}
          {confidenceScore !== null && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Confidence Score:</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getConfidenceBadgeColor(
                    confidenceScore
                  )}`}
                >
                  {confidenceScore.toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {confidenceScore >= 90 &&
                  'Extragere de încredere ridicată. Verificați totuși datele înainte de salvare.'}
                {confidenceScore >= 70 &&
                  confidenceScore < 90 &&
                  'Extragere moderată. Verificați cu atenție câmpurile.'}
                {confidenceScore < 70 &&
                  'Extragere incertă. Verificați și corectați manual datele.'}
              </p>
            </div>
          )}

          {/* Câmpuri editabile */}
          <div className="space-y-4 mb-6">
            {selectedTemplate?.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.validation && (
                    <span className="text-xs text-gray-500 ml-2">({field.validation})</span>
                  )}
                </label>
                {field.type === 'select' && field.options ? (
                  <select
                    value={extractedData[field.key] || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    value={extractedData[field.key] || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <input
                    type="text"
                    value={extractedData[field.key] || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Buton salvare */}
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {isLoading ? 'Se salvează...' : 'Salvează datele'}
          </button>
        </div>
      )}
    </div>
  );
}
