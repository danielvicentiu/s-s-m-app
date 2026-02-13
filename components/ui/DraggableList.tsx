'use client'

import { useState } from 'react'
import { GripVertical } from 'lucide-react'

interface DraggableListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  onReorder: (newOrder: T[]) => void
  keyExtractor: (item: T, index: number) => string
  className?: string
  itemClassName?: string
}

export function DraggableList<T>({
  items,
  renderItem,
  onReorder,
  keyExtractor,
  className = '',
  itemClassName = '',
}: DraggableListProps<T>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML)
    // Add slight opacity to the dragged element
    e.currentTarget.style.opacity = '0.4'
  }

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '1'
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Only clear if we're leaving the container, not child elements
    if (e.currentTarget === e.target) {
      setDragOverIndex(null)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault()
    e.stopPropagation()

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDragOverIndex(null)
      return
    }

    const newItems = [...items]
    const [draggedItem] = newItems.splice(draggedIndex, 1)
    newItems.splice(dropIndex, 0, draggedItem)

    onReorder(newItems)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, index) => {
        const isDragging = draggedIndex === index
        const isDropZone = dragOverIndex === index
        const key = keyExtractor(item, index)

        return (
          <div
            key={key}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            className={`
              group relative flex items-center gap-3 rounded-xl bg-white p-4
              border border-gray-200 transition-all duration-200
              ${isDragging ? 'opacity-40 scale-95' : 'opacity-100 scale-100'}
              ${isDropZone ? 'border-blue-500 bg-blue-50 shadow-lg' : 'hover:border-gray-300'}
              ${!isDragging ? 'cursor-grab active:cursor-grabbing' : ''}
              ${itemClassName}
            `}
          >
            {/* Drag Handle */}
            <div
              className={`
                flex-shrink-0 cursor-grab active:cursor-grabbing
                text-gray-400 transition-colors
                ${isDropZone ? 'text-blue-500' : 'group-hover:text-gray-600'}
              `}
            >
              <GripVertical className="h-5 w-5" />
            </div>

            {/* Item Content */}
            <div className="flex-1 min-w-0">
              {renderItem(item, index)}
            </div>

            {/* Drop Zone Indicator */}
            {isDropZone && (
              <div className="absolute inset-0 rounded-xl border-2 border-blue-500 border-dashed pointer-events-none" />
            )}
          </div>
        )
      })}

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">Nu există elemente de afișat</p>
        </div>
      )}
    </div>
  )
}
