'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, Copy, Check, Send, Key, Book, Code2 } from 'lucide-react'

interface OpenAPISpec {
  openapi: string
  info: {
    title: string
    version: string
    description: string
  }
  servers: Array<{ url: string; description: string }>
  paths: Record<string, Record<string, any>>
  components?: {
    schemas?: Record<string, any>
    securitySchemes?: Record<string, any>
  }
  tags?: Array<{ name: string; description: string }>
}

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

export default function ApiDocsPage() {
  const [spec, setSpec] = useState<OpenAPISpec | null>(null)
  const [expandedEndpoints, setExpandedEndpoints] = useState<Set<string>>(new Set())
  const [selectedServer, setSelectedServer] = useState<string>('')
  const [authToken, setAuthToken] = useState<string>('')
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'endpoints' | 'auth'>('overview')
  const [tryItOutStates, setTryItOutStates] = useState<Record<string, any>>({})
  const [responses, setResponses] = useState<Record<string, any>>({})

  useEffect(() => {
    fetch('/openapi.json')
      .then(res => res.json())
      .then(data => {
        setSpec(data)
        setSelectedServer(data.servers[0]?.url || '')
      })
      .catch(console.error)
  }, [])

  const toggleEndpoint = (key: string) => {
    const newExpanded = new Set(expandedEndpoints)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedEndpoints(newExpanded)
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSnippet(id)
    setTimeout(() => setCopiedSnippet(null), 2000)
  }

  const generateCodeSnippet = (
    path: string,
    method: HttpMethod,
    operation: any,
    language: 'curl' | 'javascript' | 'python'
  ): string => {
    const url = `${selectedServer}${path}`
    const hasAuth = operation.security?.some((s: any) => s.bearerAuth)

    if (language === 'curl') {
      let curl = `curl -X ${method.toUpperCase()} "${url}"`
      if (hasAuth) {
        curl += ` \\\n  -H "Authorization: Bearer YOUR_TOKEN"`
      }
      curl += ` \\\n  -H "Content-Type: application/json"`
      if (method === 'post' || method === 'put' || method === 'patch') {
        curl += ` \\\n  -d '${JSON.stringify(getExampleRequestBody(operation), null, 2)}'`
      }
      return curl
    }

    if (language === 'javascript') {
      const body = method === 'post' || method === 'put' || method === 'patch'
        ? `,\n  body: JSON.stringify(${JSON.stringify(getExampleRequestBody(operation), null, 2)})`
        : ''
      return `const response = await fetch('${url}', {
  method: '${method.toUpperCase()}',
  headers: {
    'Content-Type': 'application/json'${hasAuth ? `,\n    'Authorization': 'Bearer YOUR_TOKEN'` : ''}
  }${body}
})

const data = await response.json()
console.log(data)`
    }

    if (language === 'python') {
      const hasBody = method === 'post' || method === 'put' || method === 'patch'
      return `import requests

url = "${url}"
headers = {
    "Content-Type": "application/json"${hasAuth ? `,\n    "Authorization": "Bearer YOUR_TOKEN"` : ''}
}${hasBody ? `\ndata = ${JSON.stringify(getExampleRequestBody(operation), null, 2)}` : ''}

response = requests.${method}(url, headers=headers${hasBody ? ', json=data' : ''})
print(response.json())`
    }

    return ''
  }

  const getExampleRequestBody = (operation: any): any => {
    const schema = operation.requestBody?.content?.['application/json']?.schema
    if (!schema) return {}

    const example: any = {}
    if (schema.properties) {
      Object.keys(schema.properties).forEach(key => {
        const prop = schema.properties[key]
        if (schema.required?.includes(key) || Math.random() > 0.5) {
          example[key] = getExampleValue(prop)
        }
      })
    }
    return example
  }

  const getExampleValue = (schema: any): any => {
    if (schema.example !== undefined) return schema.example
    if (schema.default !== undefined) return schema.default
    if (schema.enum) return schema.enum[0]

    switch (schema.type) {
      case 'string':
        if (schema.format === 'uuid') return '123e4567-e89b-12d3-a456-426614174000'
        if (schema.format === 'email') return 'user@example.com'
        if (schema.format === 'date') return '2026-02-13'
        if (schema.format === 'date-time') return '2026-02-13T10:00:00Z'
        return 'string'
      case 'integer':
      case 'number':
        return schema.minimum || 0
      case 'boolean':
        return true
      case 'array':
        return [getExampleValue(schema.items || {})]
      case 'object':
        return {}
      default:
        return null
    }
  }

  const executeTryItOut = async (path: string, method: HttpMethod, operation: any) => {
    const key = `${method}-${path}`
    const formData = tryItOutStates[key] || {}

    try {
      const url = new URL(`${selectedServer}${path}`)

      // Add query parameters
      const params = operation.parameters?.filter((p: any) => p.in === 'query') || []
      params.forEach((param: any) => {
        const value = formData[param.name]
        if (value) {
          url.searchParams.append(param.name, value)
        }
      })

      const options: RequestInit = {
        method: method.toUpperCase(),
        headers: {
          'Content-Type': 'application/json',
        }
      }

      if (authToken) {
        (options.headers as Record<string, string>)['Authorization'] = `Bearer ${authToken}`
      }

      if (method === 'post' || method === 'put' || method === 'patch') {
        const bodySchema = operation.requestBody?.content?.['application/json']?.schema
        const body: any = {}
        if (bodySchema?.properties) {
          Object.keys(bodySchema.properties).forEach(prop => {
            if (formData[prop] !== undefined && formData[prop] !== '') {
              body[prop] = formData[prop]
            }
          })
        }
        options.body = JSON.stringify(body)
      }

      const response = await fetch(url.toString(), options)
      const data = await response.json()

      setResponses({
        ...responses,
        [key]: {
          status: response.status,
          statusText: response.statusText,
          data
        }
      })
    } catch (error) {
      setResponses({
        ...responses,
        [key]: {
          status: 0,
          statusText: 'Error',
          data: { error: error instanceof Error ? error.message : 'Unknown error' }
        }
      })
    }
  }

  const updateTryItOutState = (path: string, method: HttpMethod, field: string, value: any) => {
    const key = `${method}-${path}`
    setTryItOutStates({
      ...tryItOutStates,
      [key]: {
        ...(tryItOutStates[key] || {}),
        [field]: value
      }
    })
  }

  const getMethodColor = (method: HttpMethod): string => {
    const colors: Record<HttpMethod, string> = {
      get: 'bg-blue-100 text-blue-800 border-blue-200',
      post: 'bg-green-100 text-green-800 border-green-200',
      put: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      patch: 'bg-orange-100 text-orange-800 border-orange-200',
      delete: 'bg-red-100 text-red-800 border-red-200'
    }
    return colors[method] || 'bg-gray-100 text-gray-800'
  }

  if (!spec) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Se încarcă documentația API...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{spec.info.title}</h1>
            <p className="text-gray-600 mb-4">{spec.info.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                v{spec.info.version}
              </span>
              <span className="text-gray-500">OpenAPI {spec.openapi}</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex gap-6 border-t border-gray-200 pt-4 pb-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Book className="inline w-4 h-4 mr-2" />
              Prezentare generală
            </button>
            <button
              onClick={() => setActiveTab('endpoints')}
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'endpoints'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Code2 className="inline w-4 h-4 mr-2" />
              Endpoints
            </button>
            <button
              onClick={() => setActiveTab('auth')}
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'auth'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Key className="inline w-4 h-4 mr-2" />
              Autentificare
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Despre API</h2>
              <p className="text-gray-700 mb-4">{spec.info.description}</p>

              <h3 className="text-lg font-medium text-gray-900 mb-3 mt-6">Servere disponibile</h3>
              <div className="space-y-2">
                {spec.servers.map((server, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <code className="text-sm font-mono text-blue-600 flex-1">{server.url}</code>
                    <span className="text-sm text-gray-600">{server.description}</span>
                  </div>
                ))}
              </div>

              {spec.tags && spec.tags.length > 0 && (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 mt-6">Categorii</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {spec.tags.map((tag) => (
                      <div key={tag.name} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-1">{tag.name}</h4>
                        <p className="text-sm text-gray-600">{tag.description}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Authentication Tab */}
        {activeTab === 'auth' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Autentificare</h2>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                  <strong>Notă:</strong> API-ul folosește Supabase Auth cu tokene JWT Bearer.
                  Trebuie să incluzi token-ul în header-ul Authorization pentru toate request-urile autentificate.
                </p>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Cum obțin un token?</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6">
                <li>Autentifică-te pe platforma s-s-m.ro</li>
                <li>Deschide Developer Tools (F12)</li>
                <li>Execută în consolă: <code className="bg-gray-100 px-2 py-1 rounded text-sm">localStorage.getItem('supabase.auth.token')</code></li>
                <li>Copiază token-ul și folosește-l în request-urile tale</li>
              </ol>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Testează autentificarea</h3>
              <div className="space-y-3">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 mb-1 block">Token JWT</span>
                  <input
                    type="text"
                    value={authToken}
                    onChange={(e) => setAuthToken(e.target.value)}
                    placeholder="Introdu token-ul tău aici..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                {authToken && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Check className="w-4 h-4" />
                    Token salvat pentru testare
                  </div>
                )}
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-3 mt-6">Exemplu de utilizare</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-100">
{`curl -X GET "https://app.s-s-m.ro/api/v1/organizations" \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \\
  -H "Content-Type: application/json"`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Endpoints Tab */}
        {activeTab === 'endpoints' && (
          <div className="space-y-6">
            {/* Server Selector */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-2 block">Server API</span>
                <select
                  value={selectedServer}
                  onChange={(e) => setSelectedServer(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {spec.servers.map((server) => (
                    <option key={server.url} value={server.url}>
                      {server.url} - {server.description}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Group endpoints by tag */}
            {spec.tags?.map((tag) => {
              const tagEndpoints = Object.entries(spec.paths).flatMap(([path, methods]) =>
                Object.entries(methods as Record<HttpMethod, any>)
                  .filter(([_, operation]) => operation.tags?.includes(tag.name))
                  .map(([method, operation]) => ({ path, method: method as HttpMethod, operation }))
              )

              if (tagEndpoints.length === 0) return null

              return (
                <div key={tag.name} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">{tag.name}</h2>
                    <p className="text-sm text-gray-600 mt-1">{tag.description}</p>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {tagEndpoints.map(({ path, method, operation }) => {
                      const key = `${method}-${path}`
                      const isExpanded = expandedEndpoints.has(key)
                      const response = responses[key]

                      return (
                        <div key={key} className="p-6">
                          {/* Endpoint Header */}
                          <button
                            onClick={() => toggleEndpoint(key)}
                            className="w-full flex items-center gap-4 text-left group"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            )}
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase border ${getMethodColor(method)}`}>
                              {method}
                            </span>
                            <code className="text-sm font-mono text-gray-900 flex-1 group-hover:text-blue-600">
                              {path}
                            </code>
                          </button>

                          <div className="ml-9 mt-2">
                            <p className="text-sm text-gray-600">{operation.summary}</p>
                          </div>

                          {/* Expanded Content */}
                          {isExpanded && (
                            <div className="ml-9 mt-6 space-y-6">
                              {/* Description */}
                              {operation.description && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900 mb-2">Descriere</h4>
                                  <p className="text-sm text-gray-700">{operation.description}</p>
                                </div>
                              )}

                              {/* Parameters */}
                              {operation.parameters && operation.parameters.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900 mb-3">Parametri</h4>
                                  <div className="space-y-3">
                                    {operation.parameters.map((param: any) => (
                                      <div key={param.name} className="bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-start gap-3">
                                          <code className="text-sm font-mono text-blue-600">{param.name}</code>
                                          {param.required && (
                                            <span className="text-xs text-red-600 font-medium">obligatoriu</span>
                                          )}
                                          <span className="text-xs text-gray-500">{param.in}</span>
                                        </div>
                                        {param.description && (
                                          <p className="text-sm text-gray-600 mt-1">{param.description}</p>
                                        )}
                                        {param.schema && (
                                          <div className="text-xs text-gray-500 mt-1">
                                            Tip: {param.schema.type}
                                            {param.schema.enum && ` (${param.schema.enum.join(', ')})`}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Request Body */}
                              {operation.requestBody && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900 mb-3">Request Body</h4>
                                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                                    <pre className="text-sm text-gray-100">
                                      {JSON.stringify(getExampleRequestBody(operation), null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              )}

                              {/* Try It Out */}
                              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                                  <Send className="w-4 h-4" />
                                  Testează endpoint-ul
                                </h4>

                                <div className="space-y-3">
                                  {/* Query Parameters Form */}
                                  {operation.parameters?.filter((p: any) => p.in === 'query').map((param: any) => (
                                    <div key={param.name}>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">
                                        {param.name} {param.required && <span className="text-red-600">*</span>}
                                      </label>
                                      <input
                                        type="text"
                                        placeholder={param.description || param.name}
                                        onChange={(e) => updateTryItOutState(path, method, param.name, e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                    </div>
                                  ))}

                                  {/* Request Body Form */}
                                  {operation.requestBody?.content?.['application/json']?.schema?.properties && (
                                    <>
                                      {Object.entries(operation.requestBody.content['application/json'].schema.properties).map(([prop, schema]: [string, any]) => (
                                        <div key={prop}>
                                          <label className="block text-xs font-medium text-gray-700 mb-1">
                                            {prop}
                                            {operation.requestBody.content['application/json'].schema.required?.includes(prop) && (
                                              <span className="text-red-600 ml-1">*</span>
                                            )}
                                          </label>
                                          <input
                                            type={schema.type === 'boolean' ? 'checkbox' : 'text'}
                                            placeholder={getExampleValue(schema)?.toString()}
                                            onChange={(e) => updateTryItOutState(path, method, prop, schema.type === 'boolean' ? e.target.checked : e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          />
                                        </div>
                                      ))}
                                    </>
                                  )}

                                  <button
                                    onClick={() => executeTryItOut(path, method, operation)}
                                    disabled={!authToken && operation.security?.some((s: any) => s.bearerAuth)}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                                  >
                                    {!authToken && operation.security?.some((s: any) => s.bearerAuth)
                                      ? 'Necesită autentificare'
                                      : 'Execută request'}
                                  </button>
                                </div>

                                {/* Response Display */}
                                {response && (
                                  <div className="mt-4">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                                        response.status >= 200 && response.status < 300
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-red-100 text-red-800'
                                      }`}>
                                        {response.status} {response.statusText}
                                      </span>
                                    </div>
                                    <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                                      <pre className="text-xs text-gray-100">
                                        {JSON.stringify(response.data, null, 2)}
                                      </pre>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Code Examples */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Exemple de cod</h4>
                                <div className="space-y-3">
                                  {(['curl', 'javascript', 'python'] as const).map((lang) => {
                                    const snippet = generateCodeSnippet(path, method, operation, lang)
                                    const snippetId = `${key}-${lang}`

                                    return (
                                      <div key={lang}>
                                        <div className="flex items-center justify-between mb-2">
                                          <span className="text-xs font-medium text-gray-700 uppercase">{lang}</span>
                                          <button
                                            onClick={() => copyToClipboard(snippet, snippetId)}
                                            className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                                          >
                                            {copiedSnippet === snippetId ? (
                                              <>
                                                <Check className="w-3 h-3" />
                                                Copiat
                                              </>
                                            ) : (
                                              <>
                                                <Copy className="w-3 h-3" />
                                                Copiază
                                              </>
                                            )}
                                          </button>
                                        </div>
                                        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                                          <pre className="text-xs text-gray-100">{snippet}</pre>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>© 2026 s-s-m.ro - Platformă SSM/PSI digitală</p>
            <p className="mt-2">
              Powered by <span className="font-medium">Next.js 14</span> + <span className="font-medium">Supabase</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
