'use client'
import { useState, useCallback } from 'react'
import {
  FileText,
  Upload,
  CheckCircle,
  AlertTriangle,
  XCircle,
  BookOpen,
  Hash,
  Calendar,
  Globe,
  Loader2,
  RotateCcw,
  Database,
  ClipboardPaste,
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

const DOMAIN_OPTIONS = [
  { value: 'SSM', label: 'SSM — Securitate și Sănătate în Muncă' },
  { value: 'PSI', label: 'PSI — Prevenire și Stingere Incendii' },
  { value: 'GDPR', label: 'GDPR — Protecția Datelor Personale' },
  { value: 'NIS2', label: 'NIS2 — Securitate Cibernetică' },
  { value: 'MEDICINA_MUNCII', label: 'Medicina Muncii' },
  { value: 'DSP', label: 'DSP — Sănătate Publică / Alimentar' },
  { value: 'MEDIU', label: 'Mediu — Protecția Mediului' },
  { value: 'ISCIR', label: 'ISCIR — Echipamente Sub Presiune' },
  { value: 'GENERAL', label: 'General / Transversal' },
]

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

// ==========================================
// FUNCȚIE REGEX CLIENT-SIDE (identică cu serverul)
// pentru preview instant fără API call
// ==========================================

function extractMetadataClient(text: string): Metadata {
  const firstLines = text.substring(0, 2000)

  // Tip act
  const typeMatch = firstLines.match(
    /^(HOTĂRÂRE|LEGE|ORDONANȚĂ DE URGENȚĂ|ORDONANȚĂ|ORDIN|DECIZIE|REGULAMENT|NORMĂ|INSTRUCȚIUNE)/im
  )
  const rawType = typeMatch ? typeMatch[1].toUpperCase() : null
  const ACT_TYPE_MAP: Record<string, string> = {
    'HOTĂRÂRE': 'HG',
    'LEGE': 'LEGE',
    'ORDONANȚĂ DE URGENȚĂ': 'OUG',
    'ORDONANȚĂ': 'OG',
    'ORDIN': 'ORDIN',
    'DECIZIE': 'DECIZIE',
    'REGULAMENT': 'REGULAMENT',
    'NORMĂ': 'NORMA',
    'INSTRUCȚIUNE': 'INSTRUCTIUNE',
  }
  const actType = rawType ? (ACT_TYPE_MAP[rawType] || rawType) : null

  // Număr
  const numberMatch = firstLines.match(/nr\.\s*(\d+)/i)
  const actNumber = numberMatch ? numberMatch[1] : null

  // An
  const yearMatch = firstLines.match(/din\s+\d{1,2}\s+\w+\s+(\d{4})/i)
  const actYearAlt = firstLines.match(/\/(\d{4})/)
  const actYear = yearMatch ? parseInt(yearMatch[1]) : (actYearAlt ? parseInt(actYearAlt[1]) : null)

  // Monitorul Oficial
  const mojMatch = firstLines.match(
    /MONITORUL\s+OFICIAL\s+(?:AL\s+ROMÂNIEI\s+)?(?:,\s*PARTEA\s+I\s*,?\s*)?nr\.\s*(\d+)\s+din\s+([\d\w\s.]+\d{4})/i
  )
  const officialJournal = mojMatch ? `M.Of. nr. ${mojMatch[1]} din ${mojMatch[2].trim()}` : null

  // EU Directives
  const euDirectives: string[] = []
  const euRegex = /Directiv[aă]\s+([\d\/]+\/CE[E]?)/gi
  let euMatch
  while ((euMatch = euRegex.exec(firstLines)) !== null) {
    euDirectives.push(euMatch[1])
  }

  // Titlu
  const titleMatch = firstLines.match(/(privind|pentru aprobarea|referitoare la)[^.]*\./i)
  const titleSuffix = titleMatch ? titleMatch[0].trim() : ''
  const actFullName = actType && actNumber && actYear
    ? `${actType} ${actNumber}/${actYear} ${titleSuffix}`
    : ''
  const actShortName = actType && actNumber && actYear
    ? `${actType} ${actNumber}/${actYear}`
    : ''

  // Contoare
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

  const alineatCount = (text.match(/alin\.\s*[\(\[]?\d+/gi) || []).length

  return {
    actType,
    actNumber,
    actYear,
    actFullName,
    actShortName,
    officialJournal,
    euDirectives,
    counts: {
      articles: articleSet.size,
      chapters: chapterSet.size,
      sections: sectionSet.size,
      annexes: annexSet.size,
      alineate: alineatCount,
      characters: text.length,
      estimatedTokens: Math.round(text.length / 4),
    },
  }
}

// ==========================================
// COMPONENT PRINCIPAL
// ==========================================

export default function LegalImportClient() {
  // State
  const [rawText, setRawText] = useState('')
  const [metadata, setMetadata] = useState<Metadata | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)

  // Form overrides (utilizatorul poate corecta ce a detectat regex)
  const [actType, setActType] = useState('')
  const [actNumber, setActNumber] = useState('')
  const [actYear, setActYear] = useState('')
  const [actFullName, setActFullName] = useState('')
  const [officialJournal, setOfficialJournal] = useState('')
  const [domain, setDomain] = useState('SSM')
  const [status, setStatus] = useState('in_vigoare')
  const [countryCode, setCountryCode] = useState('RO')
  const [notes, setNotes] = useState('')

  // ==========================================
  // PASTE → AUTO-DETECT INSTANT
  // ==========================================

  const handleTextChange = useCallback((text: string) => {
    setRawText(text)
    setImportResult(null)

    if (text.length < 50) {
      setMetadata(null)
      return
    }

    setIsAnalyzing(true)

    // Extragere client-side (instant, fără API)
    const detected = extractMetadataClient(text)
    setMetadata(detected)

    // Populează form-ul cu valorile detectate
    if (detected.actType) setActType(detected.actType)
    if (detected.actNumber) setActNumber(detected.actNumber)
    if (detected.actYear) setActYear(String(detected.actYear))
    if (detected.actFullName) setActFullName(detected.actFullName)
    if (detected.officialJournal) setOfficialJournal(detected.officialJournal)

    setIsAnalyzing(false)
  }, [])

  // ==========================================
  // IMPORT ÎN SUPABASE
  // ==========================================

  const handleImport = async () => {
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
      const response = await fetch('/api/admin/legal-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_text: rawText,
          act_type: actType,
          act_number: actNumber,
          act_year: parseInt(actYear),
          act_full_name: actFullName || `${actType} ${actNumber}/${actYear}`,
          act_short_name: `${actType} ${actNumber}/${actYear}`,
          official_journal: officialJournal || null,
          domain,
          status,
          country_code: countryCode,
          eu_directives: metadata?.euDirectives || [],
          full_text_metadata: metadata?.counts || null,
          notes: notes || null,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setImportResult({
          success: true,
          action: result.action,
          message: result.message,
        })
      } else {
        setImportResult({
          success: false,
          error: result.error || 'Eroare necunoscută la import.',
        })
      }
    } catch (err: any) {
      setImportResult({
        success: false,
        error: `Eroare rețea: ${err.message}`,
      })
    } finally {
      setIsImporting(false)
    }
  }

  // ==========================================
  // RESET FORM
  // ==========================================

  const handleReset = () => {
    setRawText('')
    setMetadata(null)
    setImportResult(null)
    setActType('')
    setActNumber('')
    setActYear('')
    setActFullName('')
    setOfficialJournal('')
    setDomain('SSM')
    setStatus('in_vigoare')
    setCountryCode('RO')
    setNotes('')
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Database className="w-7 h-7 text-teal-600" />
            Pipeline M1 — Import Legislativ
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Copiază textul legii de pe legislatie.just.ro → Paste → Verifică metadata → Import
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

      {/* ==========================================
          ZONA 1: TEXTAREA — PASTE TEXT
          ========================================== */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <ClipboardPaste className="w-4 h-4 text-teal-500" />
          Text lege (Ctrl+V din legislatie.just.ro → tab „Text actualizat")
        </label>
        <textarea
          value={rawText}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Lipește aici textul integral al legii..."
          className="w-full h-64 p-4 border border-slate-300 rounded-lg font-mono text-sm resize-y focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
        />
        <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
          <span>
            {rawText.length > 0
              ? `${rawText.length.toLocaleString()} caractere · ~${Math.round(rawText.length / 4).toLocaleString()} tokens`
              : 'Așteaptă text...'}
          </span>
          {isAnalyzing && (
            <span className="flex items-center gap-1 text-teal-500">
              <Loader2 className="w-3 h-3 animate-spin" /> Analizez...
            </span>
          )}
        </div>
      </div>

      {/* ==========================================
          ZONA 2: AUTO-DETECT REZULTATE
          ========================================== */}
      {metadata && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-500" />
            Auto-detect rezultate
            <span className="text-xs font-normal text-slate-400">
              — verifică și corectează dacă e cazul
            </span>
          </h2>

          {/* Contoare structurale */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-5">
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

          {/* EU Directives detectate */}
          {metadata.euDirectives.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-xs font-semibold text-blue-700">🇪🇺 Directive UE detectate: </span>
              <span className="text-xs text-blue-600">
                {metadata.euDirectives.join(', ')}
              </span>
            </div>
          )}

          {/* FORM — Metadata editabilă */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Tip act */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">
                Tip act *
              </label>
              <select
                value={actType}
                onChange={(e) => setActType(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="">— Selectează —</option>
                {Object.entries({
                  HG: 'Hotărâre de Guvern',
                  LEGE: 'Lege',
                  OUG: 'Ordonanță de Urgență',
                  OG: 'Ordonanță',
                  ORDIN: 'Ordin de Ministru',
                  DECIZIE: 'Decizie',
                  REGULAMENT: 'Regulament',
                  NORMA: 'Normă',
                  INSTRUCTIUNE: 'Instrucțiune',
                }).map(([k, v]) => (
                  <option key={k} value={k}>{k} — {v}</option>
                ))}
              </select>
            </div>

            {/* Număr */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">
                Număr act *
              </label>
              <input
                type="text"
                value={actNumber}
                onChange={(e) => setActNumber(e.target.value)}
                placeholder="ex: 1425"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            {/* An */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">
                An *
              </label>
              <input
                type="number"
                value={actYear}
                onChange={(e) => setActYear(e.target.value)}
                placeholder="ex: 2006"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            {/* Titlu complet */}
            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-slate-600 mb-1 block">
                Titlu complet
              </label>
              <input
                type="text"
                value={actFullName}
                onChange={(e) => setActFullName(e.target.value)}
                placeholder="Se completează automat..."
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            {/* Monitorul Oficial */}
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-slate-600 mb-1 block">
                Monitorul Oficial
              </label>
              <input
                type="text"
                value={officialJournal}
                onChange={(e) => setOfficialJournal(e.target.value)}
                placeholder="M.Of. nr. ... din ..."
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            {/* Țara */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block flex items-center gap-1">
                <Globe className="w-3 h-3" /> Țara
              </label>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              >
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Domeniu */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">
                Domeniu *
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              >
                {DOMAIN_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Note */}
            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-slate-600 mb-1 block">
                Note (opțional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observații, context, de ce e importantă această lege..."
                rows={2}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm resize-y focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          ZONA 3: BUTON IMPORT + REZULTAT
          ========================================== */}
      {metadata && (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleImport}
            disabled={isImporting || !actType || !actNumber || !actYear}
            className={`
              flex items-center gap-2 px-8 py-3 rounded-xl text-base font-semibold transition
              ${isImporting || !actType || !actNumber || !actYear
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg hover:shadow-xl'
              }
            `}
          >
            {isImporting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Import în curs...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Import în Supabase
              </>
            )}
          </button>

          {/* Rezultat import */}
          {importResult && (
            <div
              className={`
                w-full max-w-lg p-4 rounded-xl border text-center
                ${importResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-red-50 border-red-200 text-red-700'
                }
              `}
            >
              <div className="flex items-center justify-center gap-2 font-semibold mb-1">
                {importResult.success ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    {importResult.action === 'updated' ? 'Actualizat!' : 'Importat cu succes!'}
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    Eroare
                  </>
                )}
              </div>
              <p className="text-sm">
                {importResult.message || importResult.error}
              </p>
              {importResult.success && (
                <button
                  onClick={handleReset}
                  className="mt-3 text-sm text-teal-600 hover:text-teal-800 underline"
                >
                  → Importă altă lege
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          ZONA 4: INSTRUCȚIUNI (vizibil când textarea e gol)
          ========================================== */}
      {!rawText && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-sm text-slate-600">
          <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-500" />
            Cum importezi o lege
          </h3>
          <ol className="space-y-2 list-decimal list-inside">
            <li>Deschide <a href="https://legislatie.just.ro" target="_blank" rel="noopener" className="text-teal-600 underline hover:text-teal-800">legislatie.just.ro</a> într-un tab nou</li>
            <li>Caută legea (ex: „HG 1425/2006" sau „Legea 319/2006")</li>
            <li>Click pe tab <strong>„Text actualizat"</strong> (forma consolidată, cu toate modificările)</li>
            <li><strong>Ctrl+A</strong> (selectează tot) → <strong>Ctrl+C</strong> (copiază)</li>
            <li>Revino aici → click în textarea → <strong>Ctrl+V</strong> (lipește)</li>
            <li>Verifică metadata detectată automat, corectează dacă lipsește ceva</li>
            <li>Click <strong>„Import în Supabase"</strong></li>
          </ol>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <span className="text-amber-700 text-xs">
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              <strong>Timp per lege:</strong> ~5 minute (paste + verificare + click).
              Prima lege de test recomandată: <strong>HG 1425/2006</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
