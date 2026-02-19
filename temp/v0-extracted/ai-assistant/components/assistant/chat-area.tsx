"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChatHeader } from "./chat-header"
import { MessageBubble, TypingIndicator } from "./message-bubble"
import type { Message } from "./message-bubble"
import { QuickActions } from "./quick-actions"
import { ChatInput } from "./chat-input"

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Bună ziua! Sunt asistentul VA-AI al platformei s-s-m.ro. Vă pot ajuta cu informații despre legislația SSM, PSI, GDPR și NIS2, verificări de conformitate, sau simulări de control ITM.\n\nCu ce vă pot fi de folos astăzi?",
    timestamp: "09:30",
  },
  {
    id: "2",
    role: "user",
    content:
      "Care sunt documentele obligatorii pe care trebuie să le am pentru un control ITM?",
    timestamp: "09:31",
  },
  {
    id: "3",
    role: "assistant",
    content:
      "Pentru un control ITM (Inspectoratul Teritorial de Muncă), trebuie să aveți pregătite următoarele documente obligatorii:\n\n1. Evaluarea riscurilor de accidentare și îmbolnăvire profesională pentru fiecare loc de muncă\n2. Fișele de instruire individuală (instruire introductiv-generală, la locul de muncă și periodică)\n3. Tematicile de instruire aprobate\n4. Contractele individuale de muncă și REVISAL actualizat\n5. Programul de instruire-testare pe anul curent\n6. Fișele de aptitudine eliberate de medicul de medicina muncii\n7. Decizii interne de numire a persoanelor responsabile SSM\n8. Plan de prevenire și protecție\n\nDoriți detalii suplimentare despre oricare dintre aceste documente?",
    sources: [
      { label: "HG 1425/2006", href: "#" },
      { label: "Legea 319/2006", href: "#" },
      { label: "HG 355/2007", href: "#" },
    ],
    timestamp: "09:31",
  },
  {
    id: "4",
    role: "user",
    content: "Ce se întâmplă dacă nu am evaluarea riscurilor la zi?",
    timestamp: "09:32",
  },
  {
    id: "5",
    role: "assistant",
    content:
      "Lipsa evaluării riscurilor actualizate reprezintă o contravenție gravă conform Legii 319/2006, art. 39, alin. (2). Consecințele pot fi:\n\n- Amendă contravențională între 4.000 și 8.000 lei\n- Obligația de a realiza evaluarea într-un termen stabilit de inspector\n- În caz de accident de muncă, angajatorul poate fi tras la răspundere penală\n- Posibilă suspendare a activității până la remedierea deficiențelor\n\nVă recomand să verificați imediat secțiunea SSM din platforma s-s-m.ro, unde puteți genera automat evaluarea riscurilor conform cerințelor legale în vigoare.",
    sources: [
      { label: "Legea 319/2006, art. 39", href: "#" },
      { label: "HG 1425/2006, art. 15", href: "#" },
    ],
    timestamp: "09:32",
  },
]

// Simulated assistant responses per quick action or generic fallback
const quickResponses: Record<string, { content: string; sources: { label: string; href?: string }[] }> = {
  "Verifică Conformitatea": {
    content:
      "Am analizat rapid situația companiei dumneavoastră. Iată statusul conformității:\n\n- SSM: 92% complet — lipsesc 2 fișe de instruire periodică\n- PSI: 87% complet — planul de evacuare necesită actualizare\n- GDPR: 100% conform\n- Medicina Muncii: 3 fișe de aptitudine expirate\n\nVă recomand să actualizați prioritar fișele de instruire SSM și fișele medicale expirate. Doriți să generez raportul complet?",
    sources: [{ label: "Raport Conformitate", href: "#" }],
  },
  "Simulare Control ITM": {
    content:
      "Am pregătit o simulare de control ITM pe baza datelor din sistem. Rezultat: 7 din 10 criterii sunt îndeplinite.\n\nDeficiențe identificate:\n1. Tematica de instruire — nu este aprobată pentru anul curent\n2. Fișe de aptitudine medicală — 3 angajați cu fișe expirate\n3. Plan de prevenire și protecție — ultima actualizare acum 14 luni (trebuie anual)\n\nRisc estimat de sancțiune: MEDIU (amendă estimată: 5.000–7.000 lei)\n\nDoriți un plan de acțiune pentru remedierea deficiențelor?",
    sources: [
      { label: "Legea 319/2006", href: "#" },
      { label: "HG 1425/2006", href: "#" },
    ],
  },
  "Rezumat Situație": {
    content:
      "Rezumatul situației companiei la data curentă:\n\n- Angajați activi: 245\n- Instruiri completate luna aceasta: 18/23 (78%)\n- Documente expirate: 3 (fișe aptitudine)\n- Scor conformitate general: 87%\n- Module active: SSM, PSI, GDPR, ISCIR\n- Module în așteptare: NIS2\n\nTrend: Scorul de conformitate a crescut cu 5% față de luna precedentă. Următoarea acțiune recomandată: finalizarea instruirilor restante și reînnoirea fișelor medicale.",
    sources: [{ label: "Dashboard s-s-m.ro", href: "/dashboard" }],
  },
}

const genericResponses = [
  {
    content:
      "Conform legislației în vigoare, angajatorul are obligația de a asigura securitatea și sănătatea lucrătorilor în toate aspectele legate de muncă (Legea 319/2006, art. 6). Aceasta include evaluarea riscurilor, instruirea lucrătorilor și asigurarea echipamentelor de protecție.\n\nDoriți informații mai specifice despre un anumit domeniu?",
    sources: [{ label: "Legea 319/2006", href: "#" }],
  },
  {
    content:
      "Am înțeles întrebarea dumneavoastră. Conform normelor metodologice de aplicare a Legii 319/2006, aprobate prin HG 1425/2006, instruirea lucrătorilor se realizează în trei etape: introductiv-generală, la locul de muncă și periodică.\n\nInstruirea periodică se efectuează la intervale de cel mult 6 luni pentru majoritatea locurilor de muncă, sau la cel mult 3 luni pentru locurile de muncă cu riscuri ridicate.",
    sources: [
      { label: "HG 1425/2006", href: "#" },
      { label: "Legea 319/2006", href: "#" },
    ],
  },
]

export function ChatArea() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      })
    })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  function simulateResponse(userText: string) {
    setIsTyping(true)

    // Check if it matches a quick action
    const matchedAction = Object.keys(quickResponses).find((k) =>
      userText.toLowerCase().includes(k.toLowerCase())
    )

    const delay = 1200 + Math.random() * 800
    setTimeout(() => {
      const response = matchedAction
        ? quickResponses[matchedAction]
        : genericResponses[Math.floor(Math.random() * genericResponses.length)]

      const newMsg: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: response.content,
        sources: response.sources,
        timestamp: new Date().toLocaleTimeString("ro-RO", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }
      setMessages((prev) => [...prev, newMsg])
      setIsTyping(false)
    }, delay)
  }

  function handleSend(text: string) {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString("ro-RO", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
    setMessages((prev) => [...prev, userMsg])
    simulateResponse(text)
  }

  function handleQuickAction(label: string) {
    handleSend(label)
  }

  return (
    <div className="flex h-full flex-col">
      <ChatHeader />

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 lg:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
          {isTyping && <TypingIndicator />}
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions onAction={handleQuickAction} />

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  )
}
