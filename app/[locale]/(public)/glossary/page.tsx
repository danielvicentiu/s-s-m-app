'use client'

import { useState, useMemo } from 'react'
import { Search, ChevronDown, BookOpen, Link as LinkIcon } from 'lucide-react'

interface GlossaryTerm {
  id: string
  term: string
  letter: string
  definition: string
  details?: string
  relatedTerms?: string[]
  category?: 'SSM' | 'PSI' | 'GDPR' | 'Legislatie'
}

// Date glosar SSM/PSI - termeni comuni în domeniu
const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: '1',
    term: 'Accident de muncă',
    letter: 'A',
    definition: 'Vătămarea violentă a organismului, precum și intoxicația acută profesională, care au loc în timpul procesului de muncă sau în îndeplinirea îndatoririlor de serviciu.',
    details: 'Accidentul de muncă este orice vătămare violentă a organismului (traumatism, intoxicație acută) care se produce în timpul desfășurării activității de muncă sau în îndeplinirea îndatoririlor de serviciu. Legislația română prevede obligativitatea cercetării și evidenței tuturor accidentelor de muncă.',
    relatedTerms: ['Incapacitate temporară de muncă', 'Evaluare de risc', 'Boală profesională'],
    category: 'SSM',
  },
  {
    id: '2',
    term: 'Aptitudine medicală',
    letter: 'A',
    definition: 'Starea de sănătate fizică și psihică a unei persoane care îi permite să desfășoare activitatea profesională fără riscuri pentru sine sau pentru alții.',
    details: 'Aptitudinea medicală se stabilește prin examen medical periodic, conform legislației în vigoare. Angajatorul are obligația să asigure examinarea medicală periodică a salariaților, în funcție de factorii de risc prezenți la locul de muncă.',
    relatedTerms: ['Aviz medical', 'Control medical periodic', 'Fișă de aptitudine'],
    category: 'SSM',
  },
  {
    id: '3',
    term: 'Aviz PSI',
    letter: 'A',
    definition: 'Document emis de ISU care atestă că o construcție respectă normele de apărare împotriva incendiilor.',
    details: 'Avizul PSI (Prevenire și Stingere Incendii) este obligatoriu pentru punerea în funcțiune a construcțiilor noi sau pentru schimbarea destinației construcțiilor existente. Se obține de la Inspectoratul pentru Situații de Urgență și are o valabilitate limitată.',
    relatedTerms: ['Autorizație PSI', 'Scenariul de securitate', 'ISU'],
    category: 'PSI',
  },
  {
    id: '4',
    term: 'Boală profesională',
    letter: 'B',
    definition: 'Afecțiune care se produce ca urmare a exercitării unei meserii sau profesii, cauzată de agenți nocivi fizici, chimici sau biologici.',
    details: 'Boala profesională este o afecțiune produsă de factori de risc specifici locului de muncă, caracteristici meseriei sau profesiei exercitate. Lista bolilor profesionale este stabilită prin hotărâre de guvern și se actualizează periodic.',
    relatedTerms: ['Accident de muncă', 'Factor de risc', 'Medicina muncii'],
    category: 'SSM',
  },
  {
    id: '5',
    term: 'CNAS',
    letter: 'C',
    definition: 'Casa Națională de Asigurări de Sănătate - instituție publică ce administrează fondurile de asigurări sociale de sănătate.',
    details: 'CNAS are ca obiectiv principal gestionarea sistemului de asigurări sociale de sănătate în România. În context SSM, CNAS gestionează compensațiile pentru accidente de muncă și boli profesionale.',
    relatedTerms: ['Asigurări sociale', 'Incapacitate temporară de muncă'],
    category: 'Legislatie',
  },
  {
    id: '6',
    term: 'Consultant SSM',
    letter: 'C',
    definition: 'Persoană fizică sau juridică atestată să presteze servicii de prevenire și protecție în domeniul sănătății și securității în muncă.',
    details: 'Consultantul SSM este un specialist atestat de Inspectoratul de Stat în Construcții (ISC) sau de Inspectoratul Teritorial de Muncă, care oferă servicii de prevenire și protecție pentru sănătatea și securitatea în muncă. Consultantul poate lucra ca expert extern pentru mai multe companii.',
    relatedTerms: ['Lucrător desemnat', 'Serviciu extern SSM', 'Atestare SSM'],
    category: 'SSM',
  },
  {
    id: '7',
    term: 'DPI - Dispozitive de Protecție Individuală',
    letter: 'D',
    definition: 'Echipamente destinate să fie purtate sau ținute de lucrător pentru a-l proteja împotriva unuia sau mai multor riscuri.',
    details: 'DPI-urile includ: căști de protecție, mănuși, ochelari, măști respiratorii, încălțăminte de protecție, veste reflectorizante, etc. Angajatorul are obligația să asigure gratuit DPI-urile necesare și să instruiască lucrătorii privind utilizarea corectă.',
    relatedTerms: ['Echipament de protecție', 'Factor de risc', 'Măsuri de prevenire'],
    category: 'SSM',
  },
  {
    id: '8',
    term: 'Echipament de lucru',
    letter: 'E',
    definition: 'Orice mașină, aparat, unealtă sau instalație folosită în procesul de muncă.',
    details: 'Echipamentul de lucru trebuie să fie conform cu cerințele minime de securitate și sănătate, să fie verificat periodic și să fie însoțit de instrucțiuni de utilizare în limba română. Angajatorul are obligația de a asigura întreținerea și verificarea periodică.',
    relatedTerms: ['Verificare periodică', 'Certificare echipamente', 'ISCIR'],
    category: 'SSM',
  },
  {
    id: '9',
    term: 'Evaluare de risc',
    letter: 'E',
    definition: 'Procesul de estimare a mărimii riscului și de decidere dacă riscul este tolerabil sau nu.',
    details: 'Evaluarea de risc este un proces sistematic de examinare a tuturor aspectelor activității de muncă pentru a identifica ce poate cauza vătămări, pentru a stabili dacă riscurile pot fi eliminate și, dacă nu, ce măsuri de prevenire și protecție trebuie luate.',
    relatedTerms: ['Factor de risc', 'Identificare pericol', 'Plan de prevenire'],
    category: 'SSM',
  },
  {
    id: '10',
    term: 'Factor de risc',
    letter: 'F',
    definition: 'Element susceptibil să genereze accidente de muncă sau boli profesionale.',
    details: 'Factorii de risc pot fi: fizici (zgomot, vibrații, radiații), chimici (substanțe toxice, iritante), biologici (bacterii, virusuri), psihosociali (stres, hărțuire) sau ergonomici (posturi de lucru neadecvate, mișcări repetitive).',
    relatedTerms: ['Evaluare de risc', 'Măsuri de prevenire', 'Expunere profesională'],
    category: 'SSM',
  },
  {
    id: '11',
    term: 'Fișă de date de securitate (FDS)',
    letter: 'F',
    definition: 'Document care conține informații despre proprietățile unei substanțe sau amestec chimic și modul de manipulare în siguranță.',
    details: 'FDS este obligatorie pentru substanțele și amestecurile chimice periculoase. Conține 16 secțiuni standardizate: identificare, pericole, compoziție, prim ajutor, măsuri de stingere, manipulare și stocare, echipament de protecție, etc.',
    relatedTerms: ['Substanță periculoasă', 'Etichetare chimice', 'REACH'],
    category: 'SSM',
  },
  {
    id: '12',
    term: 'GDPR - General Data Protection Regulation',
    letter: 'G',
    definition: 'Regulamentul European privind protecția datelor personale, aplicabil din mai 2018.',
    details: 'GDPR stabilește reguli stricte pentru colectarea, stocarea și procesarea datelor personale. În contextul SSM, companiile trebuie să protejeze datele medicale ale angajaților, să obțină consimțământ pentru procesare și să asigure dreptul la uitare.',
    relatedTerms: ['Date personale', 'Consimțământ', 'DPO'],
    category: 'GDPR',
  },
  {
    id: '13',
    term: 'Hidrant interior',
    letter: 'H',
    definition: 'Instalație fixă de stingere a incendiilor amplasată în interiorul clădirilor.',
    details: 'Hidranții interiori sunt conectați la rețeaua de alimentare cu apă și trebuie verificați periodic conform normelor PSI. Verificarea include testarea presiunii, funcționalității și stării fizice a echipamentului.',
    relatedTerms: ['Hidrant exterior', 'Coloană uscată', 'Verificare PSI'],
    category: 'PSI',
  },
  {
    id: '14',
    term: 'Instructaj SSM',
    letter: 'I',
    definition: 'Activitate de informare și formare a lucrătorilor privind riscurile la locul de muncă și măsurile de prevenire.',
    details: 'Tipuri de instructaje: general (la angajare), la locul de muncă (înainte de începerea lucrului), periodic (la intervale stabilite), suplimentar (la schimbarea locului de muncă sau introducerea de noi echipamente). Instructajele trebuie consemnate în fișe individuale.',
    relatedTerms: ['Instructaj periodic', 'Fișă instructaj', 'Formare SSM'],
    category: 'SSM',
  },
  {
    id: '15',
    term: 'Incapacitate temporară de muncă (ITM)',
    letter: 'I',
    definition: 'Imposibilitatea temporară a unei persoane de a-și desfășura activitatea profesională din cauza unei afecțiuni medicale.',
    details: 'ITM se acordă pe bază de certificat medical și poate fi cauzată de boală comună, accident de muncă sau boală profesională. În cazul accidentelor de muncă, indemnizația este de 100% din salariul de bază.',
    relatedTerms: ['Accident de muncă', 'Certificat medical', 'CNAS'],
    category: 'SSM',
  },
  {
    id: '16',
    term: 'ISU - Inspectoratul pentru Situații de Urgență',
    letter: 'I',
    definition: 'Instituție publică responsabilă cu prevenirea și gestionarea situațiilor de urgență, inclusiv incendii.',
    details: 'ISU are următoarele atribuții principale: autorizarea documentațiilor și avizarea construcțiilor din punct de vedere PSI, verificarea respectării normelor de apărare împotriva incendiilor, intervenția în caz de incendiu și alte situații de urgență.',
    relatedTerms: ['Aviz PSI', 'Autorizație PSI', 'Verificare PSI'],
    category: 'PSI',
  },
  {
    id: '17',
    term: 'ITM - Inspectoratul Teritorial de Muncă',
    letter: 'I',
    definition: 'Autoritate publică care monitorizează și controlează aplicarea legislației muncii, inclusiv SSM.',
    details: 'ITM efectuează controale la locurile de muncă, verifică respectarea normelor de securitate și sănătate, investighează accidentele grave de muncă și poate aplica sancțiuni pentru neconformități. Fiecare județ are propriul ITM.',
    relatedTerms: ['Control SSM', 'Sancțiuni', 'Legislație muncă'],
    category: 'Legislatie',
  },
  {
    id: '18',
    term: 'Legislația muncii',
    letter: 'L',
    definition: 'Ansamblul normelor juridice care reglementează raporturile de muncă între angajator și salariat.',
    details: 'Include: Codul Muncii, legi speciale (Legea 319/2006 privind SSM), hotărâri de guvern, ordine ministeriale. Legislația se actualizează permanent și trebuie respectată de toți angajatorii.',
    relatedTerms: ['Codul Muncii', 'Legea 319/2006', 'Contractul de muncă'],
    category: 'Legislatie',
  },
  {
    id: '19',
    term: 'Lucrător desemnat',
    letter: 'L',
    definition: 'Salariat desemnat de angajator să se ocupe de activități de prevenire a riscurilor profesionale.',
    details: 'Lucrătorul desemnat este un angajat al companiei, instruit și pregătit în domeniul SSM, care desfășoară activități de prevenire și protecție. Poate înlocui serviciul extern de prevenire doar în anumite condiții (firmă mică, risc redus).',
    relatedTerms: ['Serviciu extern SSM', 'Consultant SSM', 'Comitet de securitate'],
    category: 'SSM',
  },
  {
    id: '20',
    term: 'Măsuri de prevenire',
    letter: 'M',
    definition: 'Acțiuni întreprinse pentru eliminarea sau reducerea riscurilor profesionale.',
    details: 'Ierarhia măsurilor de prevenire: 1) Eliminarea riscului, 2) Înlocuirea cu ceva mai puțin periculos, 3) Măsuri tehnice colective, 4) Măsuri organizatorice, 5) Echipamente de protecție individuală. Prevenirea trebuie să fie prioritară față de protecție.',
    relatedTerms: ['Evaluare de risc', 'Plan de prevenire', 'DPI'],
    category: 'SSM',
  },
  {
    id: '21',
    term: 'Medicina muncii',
    letter: 'M',
    definition: 'Specialitate medicală care se ocupă de prevenirea îmbolnăvirilor legate de activitatea profesională.',
    details: 'Serviciile de medicina muncii asigură: examinări medicale la angajare și periodice, supraveghere medicală a lucrătorilor expuși la factori de risc, investigarea bolilor profesionale, educație sanitară. Fiecare angajator trebuie să aibă contract cu un serviciu de medicina muncii.',
    relatedTerms: ['Examen medical periodic', 'Aptitudine medicală', 'Boală profesională'],
    category: 'SSM',
  },
  {
    id: '22',
    term: 'Plan de prevenire și protecție (PPP)',
    letter: 'P',
    definition: 'Document care stabilește măsurile de securitate și sănătate în muncă pentru o organizație.',
    details: 'PPP cuprinde: identificarea și evaluarea riscurilor, stabilirea măsurilor de prevenire și protecție, responsabilități, proceduri de lucru în siguranță, plan de intervenție în caz de urgență. Se elaborează obligatoriu de către angajator și se revizuiește periodic.',
    relatedTerms: ['Evaluare de risc', 'Măsuri de prevenire', 'Proceduri SSM'],
    category: 'SSM',
  },
  {
    id: '23',
    term: 'Plan de evacuare',
    letter: 'P',
    definition: 'Document care stabilește modalitățile de evacuare a persoanelor în caz de incendiu sau alte situații de urgență.',
    details: 'Planul de evacuare include: căile de evacuare, punctele de adunare, responsabilități, proceduri de alarmă și alertare. Trebuie afișat vizibil în clădire și practicat prin exerciții periodice. Este parte integrantă din scenariul de securitate la incendiu.',
    relatedTerms: ['Scenariul de securitate', 'Căi de evacuare', 'Exercițiu PSI'],
    category: 'PSI',
  },
  {
    id: '24',
    term: 'Risc profesional',
    letter: 'R',
    definition: 'Probabilitatea ca un lucrător să sufere o vătămare sau o afecțiune medicală în timpul activității de muncă.',
    details: 'Riscul profesional se calculează în funcție de gravitatea efectului și probabilitatea de apariție. Clasificare: risc neglijabil, risc mic, risc mediu, risc mare, risc inacceptabil. Scopul evaluării este reducerea riscurilor la un nivel acceptabil.',
    relatedTerms: ['Evaluare de risc', 'Factor de risc', 'Măsuri de prevenire'],
    category: 'SSM',
  },
  {
    id: '25',
    term: 'Scenariul de securitate la incendiu',
    letter: 'S',
    definition: 'Document care stabilește măsurile organizatorice de apărare împotriva incendiilor într-o clădire.',
    details: 'Scenariul de securitate cuprinde: date generale despre construcție, sursele de pericol, măsurile de prevenire, dotarea cu mijloace PSI, planul de evacuare, instrucțiuni pentru prevenirea și stingerea incendiilor. Se elaborează de personal specializat și se aprobă de ISU.',
    relatedTerms: ['Autorizație PSI', 'Plan de evacuare', 'ISU'],
    category: 'PSI',
  },
  {
    id: '26',
    term: 'Stingător',
    letter: 'S',
    definition: 'Dispozitiv portabil de stingere a incendiilor în faza inițială.',
    details: 'Tipuri: cu pulbere (ABC), cu CO2, cu spumă, cu apă. Trebuie să fie verificat anual de personal autorizat și reîncărcat conform specificațiilor. Amplasarea: vizibil, accesibil, la înălțime de maximum 1,50m, cu semnalizare corespunzătoare.',
    relatedTerms: ['Verificare PSI', 'Clasificare incendii', 'Hidrant interior'],
    category: 'PSI',
  },
  {
    id: '27',
    term: 'Toxic',
    letter: 'T',
    definition: 'Substanță care poate cauza efecte adverse asupra sănătății prin inhalare, contact sau ingestie.',
    details: 'Substanțele toxice sunt clasificate în funcție de gravitate: extrem de toxice, toxice, nocive. Trebuie manipulate cu DPI adecvate, în spații ventilate, conform FDS. Angajatorul trebuie să asigure instruire specifică și supraveghere medicală.',
    relatedTerms: ['Fișă de date de securitate', 'DPI', 'Substanță periculoasă'],
    category: 'SSM',
  },
  {
    id: '28',
    term: 'Verificare periodică',
    letter: 'V',
    definition: 'Control tehnic obligatoriu al echipamentelor de lucru și instalațiilor pentru asigurarea funcționării în siguranță.',
    details: 'Verificările periodice se efectuează conform legislației în vigoare (ISCIR pentru instalații sub presiune, ridicat, instalații electrice; ISU pentru echipamente PSI). Frecvența este stabilită prin norme specifice fiecărui tip de echipament.',
    relatedTerms: ['ISCIR', 'Certificare echipamente', 'Revizie tehnică'],
    category: 'SSM',
  },
  {
    id: '29',
    term: 'Zone ATEX',
    letter: 'Z',
    definition: 'Zone cu risc de explozie datorită prezenței atmosferelor potențial explozive.',
    details: 'ATEX (ATmosphères EXplosibles) desemnează zonele unde pot apărea amestecuri de aer cu substanțe inflamabile. Clasificare: Zone 0, 1, 2 (gaze) sau 20, 21, 22 (pulberi). Necesită evaluare specială, echipamente certificate ATEX și măsuri stricte de prevenire.',
    relatedTerms: ['Atmosferă explozivă', 'Evaluare ATEX', 'Echipamente ATEX'],
    category: 'SSM',
  },
]

// Generare litere alfabetice cu termeni
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set())

  // Filtrare termeni
  const filteredTerms = useMemo(() => {
    let terms = GLOSSARY_TERMS

    // Filtrare după literă selectată
    if (selectedLetter) {
      terms = terms.filter((term) => term.letter === selectedLetter)
    }

    // Căutare în termen și definiție
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      terms = terms.filter(
        (term) =>
          term.term.toLowerCase().includes(query) ||
          term.definition.toLowerCase().includes(query) ||
          term.details?.toLowerCase().includes(query)
      )
    }

    return terms.sort((a, b) => a.term.localeCompare(b.term))
  }, [selectedLetter, searchQuery])

  // Grupare termeni după literă pentru afișare
  const groupedTerms = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {}
    filteredTerms.forEach((term) => {
      if (!groups[term.letter]) {
        groups[term.letter] = []
      }
      groups[term.letter].push(term)
    })
    return groups
  }, [filteredTerms])

  // Litere care au termeni
  const availableLetters = useMemo(() => {
    const letters = new Set(GLOSSARY_TERMS.map((t) => t.letter))
    return ALPHABET.filter((letter) => letters.has(letter))
  }, [])

  const toggleTerm = (termId: string) => {
    setExpandedTerms((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(termId)) {
        newSet.delete(termId)
      } else {
        newSet.add(termId)
      }
      return newSet
    })
  }

  const scrollToLetter = (letter: string) => {
    setSelectedLetter(letter === selectedLetter ? null : letter)
    setSearchQuery('')

    // Scroll la prima literă
    const element = document.getElementById(`letter-${letter}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleRelatedTermClick = (relatedTermName: string) => {
    // Găsește termenul și scroll la el
    const term = GLOSSARY_TERMS.find((t) => t.term === relatedTermName)
    if (term) {
      setSearchQuery('')
      setSelectedLetter(null)
      setExpandedTerms(new Set([term.id]))

      setTimeout(() => {
        const element = document.getElementById(`term-${term.id}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
    }
  }

  // JSON-LD Structured Data pentru SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Glosar SSM și PSI',
    description: 'Glosar complet cu termeni din domeniul Securității și Sănătății în Muncă (SSM) și Prevenire și Stingere Incendii (PSI)',
    hasDefinedTerm: GLOSSARY_TERMS.map((term) => ({
      '@type': 'DefinedTerm',
      name: term.term,
      description: term.definition,
    })),
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-10 h-10 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">Glosar SSM & PSI</h1>
            </div>
            <p className="text-lg text-gray-600">
              Dicționar complet cu termeni din domeniul Securității și Sănătății în Muncă și Prevenire Incendii
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Navigare alfabetică */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Navigare alfabetică</h2>

                {/* Alphabet grid */}
                <div className="grid grid-cols-6 gap-2 mb-6">
                  {ALPHABET.map((letter) => {
                    const isAvailable = availableLetters.includes(letter)
                    const isSelected = selectedLetter === letter

                    return (
                      <button
                        key={letter}
                        onClick={() => isAvailable && scrollToLetter(letter)}
                        disabled={!isAvailable}
                        className={`h-10 rounded-lg font-semibold text-sm transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-sm'
                            : isAvailable
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        {letter}
                      </button>
                    )
                  })}
                </div>

                {/* Stats */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between mb-2">
                      <span>Total termeni:</span>
                      <span className="font-semibold text-gray-900">{GLOSSARY_TERMS.length}</span>
                    </div>
                    {selectedLetter && (
                      <div className="flex justify-between mb-2">
                        <span>Litera {selectedLetter}:</span>
                        <span className="font-semibold text-blue-600">
                          {filteredTerms.length}
                        </span>
                      </div>
                    )}
                    {searchQuery && (
                      <div className="flex justify-between">
                        <span>Rezultate:</span>
                        <span className="font-semibold text-blue-600">{filteredTerms.length}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Clear filters */}
                {(selectedLetter || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedLetter(null)
                      setSearchQuery('')
                    }}
                    className="w-full mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Resetează filtrele
                  </button>
                )}
              </div>
            </aside>

            {/* Main content area */}
            <main className="flex-1 min-w-0">
              {/* Search bar */}
              <div className="mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Caută termeni în glosar..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setSelectedLetter(null)
                    }}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
                  />
                </div>
              </div>

              {/* Terms list */}
              {filteredTerms.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
                  <p className="text-gray-500 text-lg">
                    Nu am găsit termeni care să corespundă căutării tale.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.keys(groupedTerms)
                    .sort()
                    .map((letter) => (
                      <div key={letter} id={`letter-${letter}`}>
                        {/* Letter header */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-2xl shadow-sm">
                            {letter}
                          </div>
                          <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        {/* Terms for this letter */}
                        <div className="space-y-3 mb-8">
                          {groupedTerms[letter].map((term) => {
                            const isExpanded = expandedTerms.has(term.id)

                            return (
                              <div
                                key={term.id}
                                id={`term-${term.id}`}
                                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                              >
                                <button
                                  onClick={() => toggleTerm(term.id)}
                                  className="w-full px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                                >
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      {/* Term title */}
                                      <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-bold text-lg text-gray-900">
                                          {term.term}
                                        </h3>
                                        {term.category && (
                                          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                            {term.category}
                                          </span>
                                        )}
                                      </div>
                                      {/* Definition */}
                                      <p className="text-gray-600 leading-relaxed">
                                        {term.definition}
                                      </p>
                                    </div>
                                    <ChevronDown
                                      className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform mt-1 ${
                                        isExpanded ? 'rotate-180' : ''
                                      }`}
                                    />
                                  </div>
                                </button>

                                {/* Expanded details */}
                                {isExpanded && (
                                  <div className="px-6 pb-5 pt-0">
                                    <div className="pt-4 border-t border-gray-100">
                                      {/* Detailed description */}
                                      {term.details && (
                                        <div className="mb-4">
                                          <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                            Detalii:
                                          </h4>
                                          <p className="text-gray-600 leading-relaxed">
                                            {term.details}
                                          </p>
                                        </div>
                                      )}

                                      {/* Related terms */}
                                      {term.relatedTerms && term.relatedTerms.length > 0 && (
                                        <div>
                                          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                            <LinkIcon className="w-4 h-4" />
                                            Termeni asociați:
                                          </h4>
                                          <div className="flex flex-wrap gap-2">
                                            {term.relatedTerms.map((relatedTerm) => (
                                              <button
                                                key={relatedTerm}
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  handleRelatedTermClick(relatedTerm)
                                                }}
                                                className="px-3 py-1.5 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-lg text-sm transition-colors border border-gray-200 hover:border-blue-300"
                                              >
                                                {relatedTerm}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Info footer */}
              <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Notă importantă
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Acest glosar este furnizat cu titlu informativ și reprezintă o sinteză a terminologiei
                  comune în domeniul SSM și PSI. Pentru interpretarea exactă a termenilor în contextul
                  legislației în vigoare, vă recomandăm să consultați actele normative oficiale și/sau
                  să contactați un specialist autorizat în domeniu.
                </p>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  )
}
