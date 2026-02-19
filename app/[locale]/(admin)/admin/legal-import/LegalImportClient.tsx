'use client'
import { useState, useEffect, useCallback } from 'react'
import {
  FileText,
  Upload,
  CheckCircle,
  AlertTriangle,
  XCircle,
  BookOpen,
  Globe,
  Loader2,
  RotateCcw,
  Database,
  ClipboardPaste,
  Link,
  Download,
  ArrowRight,
} from 'lucide-react'

// ==========================================
// TIPURI
// ==========================================

interface Metadata {
  actType: string | null
  actNumber: string | null
  actYear: number | null
  actFullName: string
  actShortName: string
  officialJournal: string | null
  euDirectives: string[]
  counts: {
    articles: number
    chapters: number
    sections: number
    annexes: number
    alineate: number
    characters: number
    estimatedTokens: number
  }
}

interface ImportResult {
  success: boolean
  action?: 'inserted' | 'updated'
  message?: string
  error?: string
}

interface TaxonomyItem {
  id: string
  domain_code: string
  domain_name: string
  subdomain_code: string
  subdomain_name: string
  is_active: boolean
}

type InputMode = 'url' | 'paste'

const STATUS_OPTIONS = [
  { value: 'in_vigoare', label: '🟢 În vigoare' },
  { value: 'modificat', label: '🟡 Modificat (text actualizat)' },
  { value: 'abrogat', label: '🔴 Abrogat' },
  { value: 'partial_abrogat', label: '🟠 Parțial abrogat' },
]

const COUNTRY_OPTIONS = [
  { value: 'RO', label: '🇷🇴 România' },
  { value: 'BG', label: '🇧🇬 Bulgaria' },
  { value: 'HU', label: '🇭🇺 Ungaria' },
  { value: 'DE', label: '🇩🇪 Germania' },
  { value: 'PL', label: '🇵🇱 Polonia' },
  { value: 'EU', label: '🇪🇺 Directivă UE' },
]

const ACT_TYPE_OPTIONS: Record<string, string> = {
  HG: 'Hotărâre de Guvern',
  LEGE: 'Lege',
  OUG: 'Ordonanță de Urgență',
  OG: 'Ordonanță',
  ORDIN: 'Ordin de Ministru',
  COD: 'Cod',
  DECIZIE: 'Decizie',
  REGULAMENT: 'Regulament',
  NORMA: 'Normă',
  INSTRUCTIUNE: 'Instrucțiune',
}

// ==========================================
// REGEX CLIENT-SIDE (mirror al serverului)
// ==========================================

function extractMetadataClient(text: string): Metadata {
  const firstLines = text.substring(0, 2000)

  const typeMatch = firstLines.match(
    /^(HOTĂRÂRE|LEGE|ORDONANȚĂ DE URGENȚĂ|ORDONANȚĂ|ORDIN|DECIZIE|REGULAMENT|NORMĂ|INSTRUCȚIUNE|COD)/im
  )
  const rawType = typeMatch ? typeMatch[1].toUpperCase() : null
  const ACT_TYPE_MAP: Record<string, string> = {
    'HOTĂRÂRE': 'HG', 'LEGE': 'LEGE', 'ORDONANȚĂ DE URGENȚĂ': 'OUG', 'ORDONANȚĂ': 'OG',
    'ORDIN': 'ORDIN', 'DECIZIE': 'DECIZIE', 'REGULAMENT': 'REGULAMENT', 'NORMĂ': 'NORMA',
    'INSTRUCȚIUNE': 'INSTRUCTIUNE', 'COD': 'COD',
  }
  const actType = rawType ? (ACT_TYPE_MAP[rawType] || rawType) : null

  // Număr — Norme preiau de la HG
  let actNumber: string | null = null
  const isNorme = /^(NORME?\s+METODOLOGIC[EĂ]|NORME?\s+GENERALE|NORME?\s+TEHNICE)/im.test(firstLines)
  if (isNorme) {
    const hgMatch = firstLines.match(/(?:Hotărâr(?:ii|ea)\s+Guvernului|H\.?G\.?)\s+nr\.\s*([\d.]+)/i)
    if (hgMatch) actNumber = hgMatch[1].replace(/\./g, '')
  }
  if (!actNumber) {
    const numberMatch = firstLines.match(/nr\.\s*([\d.]+)/i)
    actNumber = numberMatch ? numberMatch[1].replace(/\./g, '') : null
  }

  const yearMatch = firstLines.match(/din\s+\d{1,2}\s+\w+\s+(\d{4})/i)
  const actYearAlt = firstLines.match(/\/(\d{4})/)
  const actYear = yearMatch ? parseInt(yearMatch[1]) : (actYearAlt ? parseInt(actYearAlt[1]) : null)

  const mojMatch = firstLines.match(
    /MONITORUL\s+OFICIAL\s+(?:AL\s+ROMÂNIEI\s+)?(?:,\s*PARTEA\s+I\s*,?\s*)?nr\.\s*(\d+)\s+din\s+([\d\w\s.]+\d{4})/i
  )
  const officialJournal = mojMatch ? `M.Of. nr. ${mojMatch[1]} din ${mojMatch[2].trim()}` : null

  const euDirectives: string[] = []
  const euRegex = /Directiv[aă]\s+([\d\/]+\/CE[E]?)/gi
  let euMatch
  while ((euMatch = euRegex.exec(firstLines)) !== null) euDirectives.push(euMatch[1])

  const titleMatch = firstLines.match(/(privind|pentru aprobarea|referitoare la)[^.]*\./i)
  const titleSuffix = titleMatch ? titleMatch[0].trim() : ''
  const actFullName = actType && actNumber && actYear ? `${actType} nr. ${actNumber}/${actYear} ${titleSuffix}` : ''
  const actShortName = actType && actNumber && actYear ? `${actType} ${actNumber}/${actYear}` : ''

  const articleSet = new Set<string>()
  const artRegex = /Art(?:icolul|\.)?\s*(\d+)/gi
  let m
  while ((m = artRegex.exec(text)) !== null) articleSet.add(m[1])

  const chapterSet = new Set<string>()
  const chapRegex = /CAP(?:ITOLUL|\.)?\s*([\dIVXLC]+)/gi
  while ((m = chapRegex.exec(text)) !== null) chapterSet.add(m[1])

  const sectionSet = new Set<string>()
  const secRegex = /SECȚIUNEA\s*([\dIVXLC]+)/gi
  while ((m = secRegex.exec(text)) !== null) sectionSet.add(m[1])

  const annexSet = new Set<string>()
  const annRegex = /ANEX[AĂ]\s*([\dIVXLC]+)/gi
  while ((m = annRegex.exec(text)) !== null) annexSet.add(m[1])

  return {
    actType, actNumber, actYear, actFullName, actShortName, officialJournal, euDirectives,
    counts: {
      articles: articleSet.size, chapters: chapterSet.size, sections: sectionSet.size,
      annexes: annexSet.size, alineate: (text.match(/alin\.\s*[\(\[]?\d+/gi) || []).length,
      characters: text.length, estimatedTokens: Math.round(text.length / 4),
    },
  }
}

// ==========================================
// COMPONENT PRINCIPAL
// ==========================================

export default function LegalImportClient() {
  // State — mod input
  const [inputMode, setInputMode] = useState<InputMode>('url')
  const [urlInput, setUrlInput] = useState('')
  const [isFetchingUrl, setIsFetchingUrl] = useState(false)
  const [urlError, setUrlError] = useState<string | null>(null)

  // State — text + metadata
  const [rawText, setRawText] = useState('')
  const [metadata, setMetadata] = useState<Metadata | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)

  // State — form
  const [actType, setActType] = useState('')
  const [actNumber, setActNumber] = useState('')
  const [actYear, setActYear] = useState('')
  const [actFullName, setActFullName] = useState('')
  const [officialJournal, setOfficialJournal] = useState('')
  const [selectedDomains, setSelectedDomains] = useState<string[]>(['SSM'])
  const [selectedSubdomains, setSelectedSubdomains] = useState<string[]>([])
  const [statusField, setStatusField] = useState('in_vigoare')
  const [countryCode, setCountryCode] = useState('RO')
  const [notes, setNotes] = useState('')

  // State — taxonomie
  const [taxonomy, setTaxonomy] = useState<TaxonomyItem[]>([])

  // Step tracking
  const [currentStep, setCurrentStep] = useState(1)

  // ==========================================
  // FETCH TAXONOMIE
  // ==========================================

  useEffect(() => {
    fetch('/api/admin/legal-taxonomy')
      .then((r) => r.json())
      .then((d) => { if (d.taxonomy) setTaxonomy(d.taxonomy) })
      .catch(() => {})
  }, [])

  // Domenii unice din taxonomie
  const domains = taxonomy.reduce<{ code: string; name: string }[]>((acc, t) => {
    if (!acc.find((d) => d.code === t.domain_code)) {
      acc.push({ code: t.domain_code, name: t.domain_name })
    }
    return acc
  }, [])

  // Subdomenii pentru domeniile selectate
  const availableSubdomains = taxonomy.filter(
    (t) => selectedDomains.includes(t.domain_code) && t.is_active
  )

  // ==========================================
  // URL FETCH
  // ==========================================

  async function handleFetchUrl() {
    if (!urlInput.trim()) {
      setUrlError('Introdu un URL.')
      return
    }

    if (!urlInput.includes('legislatie.just.ro')) {
      setUrlError('URL-ul trebuie să fie de pe legislatie.just.ro')
      return
    }

    setIsFetchingUrl(true)
    setUrlError(null)

    try {
      const res = await fetch('/api/admin/legal-import', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim() }),
      })
      const data = await res.json()

      if (data.success && data.text) {
        setRawText(data.text)
        handleTextAnalysis(data.text)
        setCurrentStep(2)
      } else {
        setUrlError(data.error || 'Nu am putut descărca textul. Folosește metoda manuală (Paste).')
      }
    } catch (err: any) {
      setUrlError(`Eroare: ${err.message}. Folosește metoda manuală (Paste).`)
    } finally {
      setIsFetchingUrl(false)
    }
  }

  // ==========================================
  // TEXT ANALYSIS
  // ==========================================

  const handleTextChange = useCallback((text: string) => {
    setRawText(text)
    setImportResult(null)
    if (text.length >= 50) {
      handleTextAnalysis(text)
    } else {
      setMetadata(null)
      setCurrentStep(1)
    }
  }, [])

  function handleTextAnalysis(text: string) {
    setIsAnalyzing(true)
    const detected = extractMetadataClient(text)
    setMetadata(detected)

    if (detected.actType) setActType(detected.actType)
    if (detected.actNumber) setActNumber(detected.actNumber)
    if (detected.actYear) setActYear(String(detected.actYear))
    if (detected.actFullName) setActFullName(detected.actFullName)
    if (detected.officialJournal) setOfficialJournal(detected.officialJournal)

    setIsAnalyzing(false)
    setCurrentStep(2)
  }

  // ==========================================
  // IMPORT
  // ==========================================

  async function handleImport() {
    if (!rawText || rawText.length < 100) {
      setImportResult({ success: false, error: 'Textul este prea scurt (minim 100 caractere).' })
      return
    }
    if (!actType || !actNumber || !actYear) {
      setImportResult({ success: false, error: 'Completează tip act, număr și an.' })
      return
    }

    setIsImporting(true)
    setImportResult(null)

    try {
      const res = await fetch('/api/admin/legal-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_text: rawText,
          act_type: actType,
          act_number: actNumber,
          act_year: parseInt(actYear),
          act_full_name: actFullName || `${actType} nr. ${actNumber}/${actYear}`,
          act_short_name: `${actType} ${actNumber}/${actYear}`,
          official_journal: officialJournal || null,
          domain: selectedDomains[0] || 'SSM',
          domains: selectedDomains,
          subdomains: selectedSubdomains,
          status: statusField,
          country_code: countryCode,
          eu_directives: metadata?.euDirectives || [],
          full_text_metadata: metadata?.counts || null,
          notes: notes || null,
        }),
      })

      const result = await res.json()
      if (res.ok && result.success) {
        setImportResult({ success: true, action: result.action, message: result.message })
        setCurrentStep(3)
      } else {
        setImportResult({ success: false, error: result.error || 'Eroare necunoscută.' })
      }
    } catch (err: any) {
      setImportResult({ success: false, error: `Eroare rețea: ${err.message}` })
    } finally {
      setIsImporting(false)
    }
  }

  // ==========================================
  // RESET
  // ==========================================

  function handleReset() {
    setRawText('')
    setUrlInput('')
    setMetadata(null)
    setImportResult(null)
    setUrlError(null)
    setActType('')
    setActNumber('')
    setActYear('')
    setActFullName('')
    setOfficialJournal('')
    setSelectedDomains(['SSM'])
    setSelectedSubdomains([])
    setStatusField('in_vigoare')
    setCountryCode('RO')
    setNotes('')
    setCurrentStep(1)
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Database className="w-7 h-7 text-teal-600" />
            Import Legislativ
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Importă text legislativ din URL sau prin paste manual
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-2 text-sm bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* PROGRESS STEPS */}
      <div className="flex items-center gap-2 text-sm">
        {[
          { n: 1, label: 'Introdu text' },
          { n: 2, label: 'Verifică & configurează' },
          { n: 3, label: 'Import complet' },
        ].map((step, idx) => (
          <div key={step.n} className="flex items-center gap-2">
            {idx > 0 && <ArrowRight className="w-4 h-4 text-slate-300" />}
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
              currentStep >= step.n
                ? currentStep === step.n
                  ? 'bg-teal-100 text-teal-700'
                  : 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-100 text-slate-400'
            }`}>
              {currentStep > step.n ? <CheckCircle className="w-3.5 h-3.5" /> : <span className="w-4 text-center">{step.n}</span>}
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* ==========================================
          STEP 1: INPUT — TABS URL / PASTE
          ========================================== */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Tab selector */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setInputMode('url')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${
              inputMode === 'url'
                ? 'bg-white text-teal-700 border-b-2 border-teal-600'
                : 'bg-slate-50 text-slate-500 hover:text-slate-700'
            }`}
          >
            <Link className="w-4 h-4" />
            Import din URL
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-100 text-teal-600 font-semibold">RECOMANDAT</span>
          </button>
          <button
            onClick={() => setInputMode('paste')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${
              inputMode === 'paste'
                ? 'bg-white text-teal-700 border-b-2 border-teal-600'
                : 'bg-slate-50 text-slate-500 hover:text-slate-700'
            }`}
          >
            <ClipboardPaste className="w-4 h-4" />
            Paste manual
          </button>
        </div>

        <div className="p-5">
          {/* URL MODE */}
          {inputMode === 'url' && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">
                URL de pe legislatie.just.ro
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => { setUrlInput(e.target.value); setUrlError(null) }}
                  placeholder="https://legislatie.just.ro/Public/DetaliiDocument/..."
                  className="flex-1 p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleFetchUrl() }}
                />
                <button
                  onClick={handleFetchUrl}
                  disabled={isFetchingUrl || !urlInput.trim()}
                  className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition ${
                    isFetchingUrl
                      ? 'bg-amber-100 text-amber-700 cursor-wait'
                      : !urlInput.trim()
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-teal-600 text-white hover:bg-teal-700 shadow'
                  }`}
                >
                  {isFetchingUrl ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Descarc...</>
                  ) : (
                    <><Download className="w-4 h-4" /> Descarcă</>
                  )}
                </button>
              </div>

              {urlError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2">
                  <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>{urlError}</p>
                    <button
                      onClick={() => setInputMode('paste')}
                      className="mt-1 text-xs text-red-600 underline hover:text-red-800"
                    >
                      Comută la paste manual →
                    </button>
                  </div>
                </div>
              )}

              {/* Instrucțiuni URL */}
              {!rawText && !isFetchingUrl && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">
                  <p className="font-medium text-slate-700 mb-2">Cum obții URL-ul:</p>
                  <ol className="space-y-1.5 list-decimal list-inside text-xs">
                    <li>Deschide <a href="https://legislatie.just.ro" target="_blank" rel="noopener" className="text-teal-600 underline">legislatie.just.ro</a></li>
                    <li>Caută legea (ex: „HG 1425/2006")</li>
                    <li>Click pe <strong>„Text actualizat"</strong></li>
                    <li>Copiază URL-ul din bara de adrese și lipește-l mai sus</li>
                  </ol>
                  <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
                    <AlertTriangle className="w-3 h-3 inline mr-1" />
                    Dacă descărcarea nu funcționează, folosește tab-ul <strong>„Paste manual"</strong>.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PASTE MODE */}
          {inputMode === 'paste' && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <ClipboardPaste className="w-4 h-4 text-teal-500" />
                Text lege (Ctrl+V din legislatie.just.ro → tab „Text actualizat")
              </label>
              <textarea
                value={rawText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Lipește aici textul integral al legii..."
                className="w-full h-64 p-4 border border-slate-300 rounded-lg font-mono text-sm resize-y focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
          )}

          {/* Text stats — vizibil indiferent de mod */}
          {rawText.length > 0 && (
            <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
              <span>
                {rawText.length.toLocaleString()} caractere · ~{Math.round(rawText.length / 4).toLocaleString()} tokens
                {inputMode === 'url' && <span className="text-teal-600 ml-2">✓ Descărcat din URL</span>}
              </span>
              {isAnalyzing && (
                <span className="flex items-center gap-1 text-teal-500">
                  <Loader2 className="w-3 h-3 animate-spin" /> Analizez...
                </span>
              )}
            </div>
          )}

          {/* Text preview — URL mode, după fetch */}
          {inputMode === 'url' && rawText.length > 0 && (
            <details className="mt-3">
              <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600">
                Previzualizare text ({rawText.length.toLocaleString()} caractere) — click pentru a vedea/edita
              </summary>
              <textarea
                value={rawText}
                onChange={(e) => handleTextChange(e.target.value)}
                className="w-full h-48 mt-2 p-3 border border-slate-300 rounded-lg font-mono text-xs resize-y focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </details>
          )}
        </div>
      </div>

      {/* ==========================================
          STEP 2: METADATA + CONFIG
          ========================================== */}
      {metadata && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
          <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-500" />
            Verifică metadata detectată
            <span className="text-xs font-normal text-slate-400">— corectează dacă e cazul</span>
          </h2>

          {/* Contoare structurale */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {[
              { label: 'Articole', value: metadata.counts.articles, icon: '§' },
              { label: 'Capitole', value: metadata.counts.chapters, icon: '📑' },
              { label: 'Secțiuni', value: metadata.counts.sections, icon: '📄' },
              { label: 'Anexe', value: metadata.counts.annexes, icon: '📎' },
              { label: 'Alineate', value: metadata.counts.alineate, icon: '¶' },
              { label: 'Tokens', value: metadata.counts.estimatedTokens.toLocaleString(), icon: '🔤' },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-slate-800">{item.value}</div>
                <div className="text-xs text-slate-500">{item.icon} {item.label}</div>
              </div>
            ))}
          </div>

          {/* EU Directives */}
          {metadata.euDirectives.length > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-xs font-semibold text-blue-700">🇪🇺 Directive UE: </span>
              <span className="text-xs text-blue-600">{metadata.euDirectives.join(', ')}</span>
            </div>
          )}

          {/* FORM — 2 secțiuni */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Tip act */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Tip act *</label>
              <select value={actType} onChange={(e) => setActType(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none">
                <option value="">— Selectează —</option>
                {Object.entries(ACT_TYPE_OPTIONS).map(([k, v]) => (
                  <option key={k} value={k}>{k} — {v}</option>
                ))}
              </select>
            </div>

            {/* Număr */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Număr act *</label>
              <input type="text" value={actNumber} onChange={(e) => setActNumber(e.target.value)}
                placeholder="ex: 1425" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>

            {/* An */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">An *</label>
              <input type="number" value={actYear} onChange={(e) => setActYear(e.target.value)}
                placeholder="ex: 2006" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>

            {/* Titlu complet */}
            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-slate-600 mb-1 block">Titlu complet</label>
              <input type="text" value={actFullName} onChange={(e) => setActFullName(e.target.value)}
                placeholder="Se completează automat..." className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>

            {/* Monitorul Oficial */}
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-slate-600 mb-1 block">Monitorul Oficial</label>
              <input type="text" value={officialJournal} onChange={(e) => setOfficialJournal(e.target.value)}
                placeholder="M.Of. nr. ... din ..." className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>

            {/* Țara */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block flex items-center gap-1">
                <Globe className="w-3 h-3" /> Țara
              </label>
              <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none">
                {COUNTRY_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>

            {/* DOMENII — din taxonomie */}
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-slate-600 mb-1 block">Domenii *</label>
              <div className="flex flex-wrap gap-2">
                {(domains.length > 0 ? domains : [
                  { code: 'SSM', name: 'SSM' }, { code: 'PSI', name: 'PSI' }, { code: 'MUNCA', name: 'MUNCA' },
                  { code: 'GDPR', name: 'GDPR' }, { code: 'NIS2', name: 'NIS2' }, { code: 'MEDIU', name: 'MEDIU' },
                  { code: 'FISCAL', name: 'FISCAL' }, { code: 'ALTELE', name: 'ALTELE' },
                ]).map((d) => {
                  const isSelected = selectedDomains.includes(d.code)
                  return (
                    <button
                      key={d.code}
                      type="button"
                      onClick={() => {
                        setSelectedDomains((prev) =>
                          isSelected ? prev.filter((x) => x !== d.code) : [...prev, d.code]
                        )
                        setSelectedSubdomains([])
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        isSelected
                          ? 'bg-teal-100 text-teal-700 ring-1 ring-teal-300'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {d.name || d.code}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Status</label>
              <select value={statusField} onChange={(e) => setStatusField(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none">
                {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            {/* SUBDOMENII — vizibile doar dacă sunt domenii selectate */}
            {availableSubdomains.length > 0 && (
              <div className="sm:col-span-3">
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  Subdomenii (opțional — {availableSubdomains.length} disponibile)
                </label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {availableSubdomains.map((sub) => {
                    const isSelected = selectedSubdomains.includes(sub.subdomain_code)
                    return (
                      <button
                        key={sub.subdomain_code}
                        type="button"
                        onClick={() => {
                          setSelectedSubdomains((prev) =>
                            isSelected ? prev.filter((x) => x !== sub.subdomain_code) : [...prev, sub.subdomain_code]
                          )
                        }}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                          isSelected
                            ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300'
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {sub.subdomain_name}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Note */}
            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-slate-600 mb-1 block">Note (opțional)</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                placeholder="Observații, context..." rows={2}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm resize-y focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          STEP 3: BUTON IMPORT + REZULTAT
          ========================================== */}
      {metadata && (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleImport}
            disabled={isImporting || !actType || !actNumber || !actYear}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl text-base font-semibold transition ${
              isImporting || !actType || !actNumber || !actYear
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {isImporting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Import în curs...</>
            ) : (
              <><Upload className="w-5 h-5" /> Importă în baza de date</>
            )}
          </button>

          {importResult && (
            <div className={`w-full max-w-lg p-4 rounded-xl border text-center ${
              importResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <div className="flex items-center justify-center gap-2 font-semibold mb-1">
                {importResult.success ? (
                  <><CheckCircle className="w-5 h-5" /> {importResult.action === 'updated' ? 'Actualizat!' : 'Importat cu succes!'}</>
                ) : (
                  <><XCircle className="w-5 h-5" /> Eroare</>
                )}
              </div>
              <p className="text-sm">{importResult.message || importResult.error}</p>
              {importResult.success && (
                <div className="mt-3 flex items-center justify-center gap-3">
                  <button onClick={handleReset} className="text-sm text-teal-600 hover:text-teal-800 underline">
                    → Importă altă lege
                  </button>
                  <a href="/ro/admin/legal-acts" className="text-sm text-blue-600 hover:text-blue-800 underline">
                    → Vezi toate actele
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          INSTRUCȚIUNI (vizibil când nu e text)
          ========================================== */}
      {!rawText && inputMode === 'paste' && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-sm text-slate-600">
          <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-500" />
            Cum importezi o lege manual
          </h3>
          <ol className="space-y-2 list-decimal list-inside">
            <li>Deschide <a href="https://legislatie.just.ro" target="_blank" rel="noopener" className="text-teal-600 underline hover:text-teal-800">legislatie.just.ro</a></li>
            <li>Caută legea (ex: „HG 1425/2006")</li>
            <li>Click pe <strong>„Text actualizat"</strong></li>
            <li><strong>Ctrl+A</strong> → <strong>Ctrl+C</strong></li>
            <li>Revino aici → <strong>Ctrl+V</strong> în textarea</li>
            <li>Verifică metadata, selectează domenii</li>
            <li>Click <strong>„Importă în baza de date"</strong></li>
          </ol>
        </div>
      )}
    </div>
  )
}
