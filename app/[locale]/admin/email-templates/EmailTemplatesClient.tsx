'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import Link from 'next/link'
import {
  Mail,
  Edit,
  Eye,
  Send,
  CheckCircle,
  XCircle,
  Lock,
  Plus,
  X,
  AlertCircle,
  Code,
} from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase/client'

interface EmailTemplate {
  id: string
  template_key: string
  name: string
  description: string | null
  subject: string
  body_html: string
  body_text: string | null
  available_variables: Array<{
    name: string
    example: string
    description: string
  }>
  category: string
  is_active: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

interface Props {
  templates: EmailTemplate[]
  stats: {
    total: number
    active: number
    system: number
    alerts: number
  }
}

export default function EmailTemplatesClient({ templates, stats }: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSendingTest, setIsSendingTest] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  // Form state
  const [editedSubject, setEditedSubject] = useState('')
  const [editedBodyHtml, setEditedBodyHtml] = useState('')
  const [editedIsActive, setEditedIsActive] = useState(true)

  const router = useRouter()

  // Deschide editor
  function handleEdit(template: EmailTemplate) {
    setSelectedTemplate(template)
    setEditedSubject(template.subject)
    setEditedBodyHtml(template.body_html)
    setEditedIsActive(template.is_active)
    setIsEditing(true)
    setShowPreview(false)
  }

  // Salvează modificări
  async function handleSave() {
    if (!selectedTemplate) return

    setIsSaving(true)
    try {
      const supabase = createSupabaseBrowser()
      const { error } = await supabase
        .from('email_templates')
        .update({
          subject: editedSubject,
          body_html: editedBodyHtml,
          is_active: editedIsActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedTemplate.id)

      if (error) throw error

      alert('✅ Template salvat cu succes!')
      router.refresh()
      setIsEditing(false)
      setSelectedTemplate(null)
    } catch (error: any) {
      console.error('Error saving template:', error)
      alert('❌ Eroare la salvare: ' + (error.message || 'Necunoscut'))
    } finally {
      setIsSaving(false)
    }
  }

  // Trimite email de test
  async function handleTestSend() {
    if (!selectedTemplate || !testEmail) {
      alert('Introdu o adresă de email pentru test')
      return
    }

    // Validare email simplu
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
      alert('Adresă de email invalidă')
      return
    }

    setIsSendingTest(true)
    try {
      // Înlocuire variabile cu exemple
      let previewSubject = editedSubject
      let previewBody = editedBodyHtml

      selectedTemplate.available_variables.forEach(variable => {
        const placeholder = `{${variable.name}}`
        previewSubject = previewSubject.replace(new RegExp(placeholder, 'g'), variable.example)
        previewBody = previewBody.replace(new RegExp(placeholder, 'g'), variable.example)
      })

      // TODO: Aici ar trebui să apelezi o funcție edge pentru trimitere reală
      // Deocamdată simulăm
      console.log('Test email:', {
        to: testEmail,
        subject: previewSubject,
        body: previewBody,
      })

      // Simulare delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      alert(`✅ Email de test trimis la ${testEmail}!\n\n(Funcție în implementare - vezi consolă pentru preview)`)
    } catch (error: any) {
      console.error('Error sending test email:', error)
      alert('❌ Eroare la trimitere: ' + (error.message || 'Necunoscut'))
    } finally {
      setIsSendingTest(false)
    }
  }

  // Închide editor
  function handleClose() {
    setIsEditing(false)
    setSelectedTemplate(null)
    setShowPreview(false)
  }

  // Preview cu variabile înlocuite
  function getPreviewHtml() {
    if (!selectedTemplate) return ''

    let html = editedBodyHtml
    selectedTemplate.available_variables.forEach(variable => {
      const placeholder = `{${variable.name}}`
      html = html.replace(new RegExp(placeholder, 'g'), `<span style="background: #fef3c7; padding: 2px 4px; border-radius: 3px; font-weight: bold;">${variable.example}</span>`)
    })
    return html
  }

  // Helper category badge
  function getCategoryBadge(category: string) {
    switch (category) {
      case 'alerts':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-medium">Alerte</span>
      case 'reports':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-medium">Rapoarte</span>
      case 'notifications':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-medium">Notificări</span>
      case 'system':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs font-medium">Sistem</span>
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium">{category}</span>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Mail className="h-7 w-7 text-blue-600" />
                Template-uri Email
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Editor template-uri email cu preview și test send
              </p>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
              <div className="text-3xl font-black text-blue-600">{stats.total}</div>
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-widest mt-1">
                Total Template-uri
              </div>
            </div>
            <div className="bg-green-50 rounded-xl border border-green-100 p-4">
              <div className="text-3xl font-black text-green-600">{stats.active}</div>
              <div className="text-xs font-semibold text-green-600 uppercase tracking-widest mt-1">
                Active
              </div>
            </div>
            <div className="bg-red-50 rounded-xl border border-red-100 p-4">
              <div className="text-3xl font-black text-red-600">{stats.alerts}</div>
              <div className="text-xs font-semibold text-red-600 uppercase tracking-widest mt-1">
                Alerte
              </div>
            </div>
            <div className="bg-purple-50 rounded-xl border border-purple-100 p-4">
              <div className="text-3xl font-black text-purple-600">{stats.system}</div>
              <div className="text-xs font-semibold text-purple-600 uppercase tracking-widest mt-1">
                Sistem
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-6">
        {/* LISTĂ TEMPLATE-URI */}
        {!isEditing && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Template
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Categorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Variabile
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Acțiuni
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {templates.map((template) => (
                    <tr key={template.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {template.is_system && (
                            <span title="Template sistem">
                              <Lock className="h-4 w-4 text-purple-500" />
                            </span>
                          )}
                          <div>
                            <div className="font-semibold text-gray-900">{template.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {template.template_key}
                            </div>
                            {template.description && (
                              <div className="text-xs text-gray-400 mt-1 max-w-md">
                                {template.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getCategoryBadge(template.category)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {template.available_variables.slice(0, 3).map((v, i) => (
                            <code key={i} className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                              {`{${v.name}}`}
                            </code>
                          ))}
                          {template.available_variables.length > 3 && (
                            <span className="text-xs text-gray-400">
                              +{template.available_variables.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {template.is_active ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-sm font-medium">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Activ
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-sm font-medium">
                            <XCircle className="h-3.5 w-3.5" />
                            Inactiv
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleEdit(template)}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            <Edit className="h-4 w-4" />
                            Editează
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {templates.length === 0 && (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Niciun template găsit</p>
              </div>
            )}
          </div>
        )}

        {/* EDITOR */}
        {isEditing && selectedTemplate && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* EDITOR HEADER */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-6 w-6 text-white" />
                  <div>
                    <h2 className="text-lg font-bold text-white">{selectedTemplate.name}</h2>
                    <p className="text-sm text-blue-100">{selectedTemplate.template_key}</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white hover:bg-blue-500 rounded-lg p-2 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              {/* PANOU STÂNGA - EDITOR */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject Email
                  </label>
                  <input
                    type="text"
                    value={editedSubject}
                    onChange={(e) => setEditedSubject(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Subiectul email-ului..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Corp Email (HTML)
                  </label>
                  <textarea
                    value={editedBodyHtml}
                    onChange={(e) => setEditedBodyHtml(e.target.value)}
                    rows={18}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder="<html>...</html>"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={editedIsActive}
                    onChange={(e) => setEditedIsActive(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                    Template activ
                  </label>
                </div>

                {/* VARIABILE DISPONIBILE */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Variabile Disponibile
                  </h3>
                  <div className="space-y-2">
                    {selectedTemplate.available_variables.map((variable, i) => (
                      <div key={i} className="text-xs">
                        <code className="bg-white px-2 py-1 rounded border border-blue-300 text-blue-700 font-semibold">
                          {`{${variable.name}}`}
                        </code>
                        <span className="text-gray-600 ml-2">{variable.description}</span>
                        <div className="text-gray-400 ml-2 mt-0.5">
                          Exemplu: <span className="italic">{variable.example}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BUTOANE ACȚIUNI */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    {isSaving ? 'Se salvează...' : 'Salvează Modificări'}
                  </button>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    {showPreview ? 'Ascunde Preview' : 'Arată Preview'}
                  </button>
                </div>
              </div>

              {/* PANOU DREAPTA - PREVIEW ȘI TEST */}
              <div className="space-y-4">
                {/* TEST EMAIL */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Trimite Email de Test
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="email@test.ro"
                      className="flex-1 px-3 py-2 border border-green-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleTestSend}
                      disabled={isSendingTest || !testEmail}
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      {isSendingTest ? 'Se trimite...' : 'Trimite'}
                    </button>
                  </div>
                  <div className="mt-2 flex items-start gap-2 text-xs text-green-700">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>
                      Variabilele vor fi înlocuite cu exemple pentru testare
                    </span>
                  </div>
                </div>

                {/* PREVIEW */}
                {showPreview && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Preview Email
                    </h3>
                    <div className="bg-white border border-gray-300 rounded-lg p-4">
                      <div className="text-sm font-semibold text-gray-700 mb-3 pb-3 border-b border-gray-200">
                        Subject: {editedSubject.replace(/\{(\w+)\}/g, (_, key) => {
                          const variable = selectedTemplate.available_variables.find(v => v.name === key)
                          return variable ? variable.example : `{${key}}`
                        })}
                      </div>
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: getPreviewHtml() }}
                      />
                    </div>
                  </div>
                )}

                {/* INFO TEMPLATE */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Detalii Template</h3>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div><strong>ID:</strong> {selectedTemplate.id}</div>
                    <div><strong>Key:</strong> {selectedTemplate.template_key}</div>
                    <div><strong>Categorie:</strong> {selectedTemplate.category}</div>
                    <div><strong>Sistem:</strong> {selectedTemplate.is_system ? 'Da' : 'Nu'}</div>
                    <div><strong>Creat:</strong> {new Date(selectedTemplate.created_at).toLocaleDateString('ro-RO')}</div>
                    <div><strong>Actualizat:</strong> {new Date(selectedTemplate.updated_at).toLocaleDateString('ro-RO')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LINK ÎNAPOI */}
        {!isEditing && (
          <div className="mt-6">
            <Link
              href="/dashboard"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Înapoi la Dashboard
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
