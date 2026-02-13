'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
}

export interface AccordionProps {
  items: AccordionItem[]
  mode?: 'single' | 'multi'
  defaultOpenIds?: string[]
  className?: string
}

export function Accordion({
  items,
  mode = 'single',
  defaultOpenIds = [],
  className = ''
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds)

  const toggleItem = (id: string) => {
    if (mode === 'single') {
      // Single mode: only one item can be open at a time
      setOpenIds(openIds.includes(id) ? [] : [id])
    } else {
      // Multi mode: multiple items can be open
      setOpenIds(
        openIds.includes(id)
          ? openIds.filter(openId => openId !== id)
          : [...openIds, id]
      )
    }
  }

  const isOpen = (id: string) => openIds.includes(id)

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => {
        const open = isOpen(item.id)

        return (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all"
          >
            {/* Header */}
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
              aria-expanded={open}
              aria-controls={`accordion-content-${item.id}`}
            >
              <span className="font-semibold text-gray-900">
                {item.title}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ml-2 ${
                  open ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Content */}
            <div
              id={`accordion-content-${item.id}`}
              className={`grid transition-all duration-300 ease-in-out ${
                open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-4 pt-1 text-sm text-gray-700">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Single AccordionItem component (optional, for more granular control)
export interface SingleAccordionItemProps {
  title: string
  content: React.ReactNode
  isOpen?: boolean
  onToggle?: () => void
  className?: string
}

export function AccordionItem({
  title,
  content,
  isOpen = false,
  onToggle,
  className = ''
}: SingleAccordionItemProps) {
  const [internalOpen, setInternalOpen] = useState(isOpen)
  const open = onToggle !== undefined ? isOpen : internalOpen

  const handleToggle = () => {
    if (onToggle) {
      onToggle()
    } else {
      setInternalOpen(!internalOpen)
    }
  }

  return (
    <div
      className={`bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all ${className}`}
    >
      {/* Header */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-gray-900">
          {title}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ml-2 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Content */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-1 text-sm text-gray-700">
            {content}
          </div>
        </div>
      </div>
    </div>
  )
}
