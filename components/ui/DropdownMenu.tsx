'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'

export interface DropdownMenuItem {
  label: string
  icon?: ReactNode
  onClick: () => void
  variant?: 'default' | 'danger'
  divider?: boolean
}

interface DropdownMenuProps {
  trigger: ReactNode
  items: DropdownMenuItem[]
}

export default function DropdownMenu({ trigger, items }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<'bottom' | 'top'>('bottom')
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && menuRef.current && dropdownRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect()
      const menuHeight = menuRef.current.offsetHeight
      const spaceBelow = window.innerHeight - dropdownRect.bottom
      const spaceAbove = dropdownRect.top

      if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
        setPosition('top')
      } else {
        setPosition('bottom')
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (focusedIndex >= 0 && itemsRef.current[focusedIndex]) {
      itemsRef.current[focusedIndex]?.focus()
    }
  }, [focusedIndex])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        setIsOpen(true)
        setFocusedIndex(0)
      }
      return
    }

    const validItems = items.filter(item => !item.divider)

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setFocusedIndex(prev => {
          const currentValidIndex = validItems.findIndex((_, idx) => {
            const actualIndex = items.findIndex(item => item === validItems[idx])
            return actualIndex === prev
          })
          const nextValidIndex = (currentValidIndex + 1) % validItems.length
          return items.findIndex(item => item === validItems[nextValidIndex])
        })
        break
      case 'ArrowUp':
        event.preventDefault()
        setFocusedIndex(prev => {
          const currentValidIndex = validItems.findIndex((_, idx) => {
            const actualIndex = items.findIndex(item => item === validItems[idx])
            return actualIndex === prev
          })
          const prevValidIndex = currentValidIndex <= 0 ? validItems.length - 1 : currentValidIndex - 1
          return items.findIndex(item => item === validItems[prevValidIndex])
        })
        break
      case 'Enter':
        event.preventDefault()
        if (focusedIndex >= 0 && !items[focusedIndex].divider) {
          items[focusedIndex].onClick()
          setIsOpen(false)
          setFocusedIndex(-1)
        }
        break
      case 'Escape':
        event.preventDefault()
        setIsOpen(false)
        setFocusedIndex(-1)
        break
    }
  }

  const handleItemClick = (item: DropdownMenuItem) => {
    if (!item.divider) {
      item.onClick()
      setIsOpen(false)
      setFocusedIndex(-1)
    }
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setFocusedIndex(0)
    } else {
      setFocusedIndex(-1)
    }
  }

  return (
    <div ref={dropdownRef} className="relative inline-block" onKeyDown={handleKeyDown}>
      <div onClick={handleToggle} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className={`absolute z-50 min-w-[200px] rounded-2xl bg-white shadow-lg border border-gray-200 py-1 ${
            position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          } right-0`}
        >
          {items.map((item, index) => {
            if (item.divider) {
              return (
                <div key={`divider-${index}`} className="my-1 border-t border-gray-200" />
              )
            }

            const itemIndex = items.filter((_, i) => i < index && !items[i].divider).length

            return (
              <button
                key={`item-${index}`}
                ref={(el) => (itemsRef.current[index] = el)}
                onClick={() => handleItemClick(item)}
                className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors ${
                  item.variant === 'danger'
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-gray-700 hover:bg-gray-50'
                } ${focusedIndex === index ? 'bg-gray-50' : ''}`}
                tabIndex={-1}
              >
                {item.icon && (
                  <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                    {item.icon}
                  </span>
                )}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
