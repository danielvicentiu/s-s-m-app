'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'

interface ResizablePanelProps {
  children: React.ReactNode
  defaultWidth?: number
  minWidth?: number
  maxWidth?: number
  direction?: 'left' | 'right'
  storageKey?: string
  className?: string
}

export default function ResizablePanel({
  children,
  defaultWidth = 280,
  minWidth = 200,
  maxWidth = 500,
  direction = 'left',
  storageKey = 'resizable-panel-width',
  className = '',
}: ResizablePanelProps) {
  const [width, setWidth] = useState<number>(defaultWidth)
  const [isResizing, setIsResizing] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Load saved width from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && storageKey) {
      const savedWidth = localStorage.getItem(storageKey)
      if (savedWidth) {
        const parsedWidth = parseInt(savedWidth, 10)
        if (!isNaN(parsedWidth) && parsedWidth >= minWidth && parsedWidth <= maxWidth) {
          setWidth(parsedWidth)
        }
      }
    }
  }, [storageKey, minWidth, maxWidth])

  // Save width to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && storageKey) {
      localStorage.setItem(storageKey, width.toString())
    }
  }, [width, storageKey])

  const handleMouseDown = useCallback(() => {
    setIsResizing(true)
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !panelRef.current) return

      const panelRect = panelRef.current.getBoundingClientRect()
      let newWidth: number

      if (direction === 'left') {
        // For left panel, width increases as mouse moves right
        newWidth = e.clientX - panelRect.left
      } else {
        // For right panel, width increases as mouse moves left
        newWidth = panelRect.right - e.clientX
      }

      // Constrain width within min and max bounds
      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
      setWidth(newWidth)
    },
    [isResizing, direction, minWidth, maxWidth]
  )

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      // Prevent text selection while dragging
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  return (
    <div
      ref={panelRef}
      className={`relative flex-shrink-0 ${className}`}
      style={{ width: `${width}px` }}
    >
      {children}

      {/* Resize handle */}
      <div
        className={`absolute top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-400 transition-colors group ${
          direction === 'left' ? 'right-0' : 'left-0'
        } ${isResizing ? 'bg-blue-500' : 'bg-transparent'}`}
        onMouseDown={handleMouseDown}
      >
        {/* Visual indicator on hover */}
        <div
          className={`absolute top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity ${
            direction === 'left' ? 'right-0' : 'left-0'
          } ${isResizing ? 'opacity-100' : ''}`}
        />
      </div>
    </div>
  )
}
