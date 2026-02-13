'use client'

import { useEffect, useRef, useState } from 'react'
import { Bold, Italic, Underline, List, ListOrdered, Heading } from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Scrie aici...',
  className = ''
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  // Initialize editor with value
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
  }

  const toolbarButtons = [
    {
      icon: Bold,
      command: 'bold',
      label: 'Bold (Ctrl+B)',
      isActive: () => document.queryCommandState('bold')
    },
    {
      icon: Italic,
      command: 'italic',
      label: 'Italic (Ctrl+I)',
      isActive: () => document.queryCommandState('italic')
    },
    {
      icon: Underline,
      command: 'underline',
      label: 'Underline (Ctrl+U)',
      isActive: () => document.queryCommandState('underline')
    },
    {
      icon: Heading,
      command: 'formatBlock',
      value: 'h3',
      label: 'Heading',
      isActive: () => document.queryCommandValue('formatBlock') === 'h3'
    },
    {
      icon: List,
      command: 'insertUnorderedList',
      label: 'Bullet List',
      isActive: () => document.queryCommandState('insertUnorderedList')
    },
    {
      icon: ListOrdered,
      command: 'insertOrderedList',
      label: 'Numbered List',
      isActive: () => document.queryCommandState('insertOrderedList')
    }
  ]

  return (
    <div className={`border rounded-2xl overflow-hidden bg-white ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
        {toolbarButtons.map((button, index) => {
          const Icon = button.icon
          const isActive = isFocused && button.isActive()

          return (
            <button
              key={index}
              type="button"
              onClick={() => executeCommand(button.command, button.value)}
              onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
              className={`
                p-2 rounded-lg transition-colors
                hover:bg-gray-200
                ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}
              `}
              title={button.label}
              aria-label={button.label}
            >
              <Icon className="w-4 h-4" />
            </button>
          )
        })}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="
          min-h-[200px] p-4 outline-none
          prose prose-sm max-w-none
          [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-2
          [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2
          [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-2
          [&_li]:my-1
          [&_p]:my-2
          empty:before:content-[attr(data-placeholder)]
          empty:before:text-gray-400
          empty:before:pointer-events-none
        "
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  )
}
