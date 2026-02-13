'use client'

import { useState } from 'react'

// Types
export interface KanbanCard {
  id: string
  title: string
  assignee?: string
  dueDate?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
}

export interface KanbanColumn {
  id: string
  title: string
  cards: KanbanCard[]
  color?: string
}

interface KanbanBoardProps {
  columns: KanbanColumn[]
  onCardMove?: (cardId: string, fromColumnId: string, toColumnId: string) => void
  onCardClick?: (card: KanbanCard) => void
}

// Priority badge configuration
const PRIORITY_CONFIG = {
  low: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Scăzut' },
  medium: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Mediu' },
  high: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Ridicat' },
  urgent: { bg: 'bg-red-100', text: 'text-red-700', label: 'Urgent' },
}

export function KanbanBoard({ columns: initialColumns, onCardMove, onCardClick }: KanbanBoardProps) {
  const [columns, setColumns] = useState(initialColumns)
  const [draggedCard, setDraggedCard] = useState<{ cardId: string; columnId: string } | null>(null)

  // Handle drag start
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, cardId: string, columnId: string) => {
    setDraggedCard({ cardId, columnId })
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
    e.preventDefault()

    if (!draggedCard || draggedCard.columnId === targetColumnId) {
      setDraggedCard(null)
      return
    }

    const sourceColumn = columns.find(col => col.id === draggedCard.columnId)
    const targetColumn = columns.find(col => col.id === targetColumnId)
    const card = sourceColumn?.cards.find(c => c.id === draggedCard.cardId)

    if (!sourceColumn || !targetColumn || !card) {
      setDraggedCard(null)
      return
    }

    // Update columns state
    const newColumns = columns.map(col => {
      if (col.id === draggedCard.columnId) {
        return {
          ...col,
          cards: col.cards.filter(c => c.id !== draggedCard.cardId)
        }
      }
      if (col.id === targetColumnId) {
        return {
          ...col,
          cards: [...col.cards, card]
        }
      }
      return col
    })

    setColumns(newColumns)

    // Notify parent component
    if (onCardMove) {
      onCardMove(draggedCard.cardId, draggedCard.columnId, targetColumnId)
    }

    setDraggedCard(null)
  }

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedCard(null)
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Azi'
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Mâine'
    }

    return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })
  }

  // Check if date is overdue
  const isOverdue = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map(column => (
        <div
          key={column.id}
          className="flex-shrink-0 w-80 bg-gray-50 rounded-2xl p-4"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          {/* Column Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${column.color || 'bg-blue-500'}`} />
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
              <span className="text-sm text-gray-500">({column.cards.length})</span>
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-3 min-h-[200px]">
            {column.cards.map(card => (
              <div
                key={card.id}
                draggable
                onDragStart={(e) => handleDragStart(e, card.id, column.id)}
                onDragEnd={handleDragEnd}
                onClick={() => onCardClick?.(card)}
                className={`bg-white rounded-xl p-4 shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow ${
                  draggedCard?.cardId === card.id ? 'opacity-50' : ''
                }`}
              >
                {/* Priority Badge */}
                {card.priority && (
                  <div className="mb-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        PRIORITY_CONFIG[card.priority].bg
                      } ${PRIORITY_CONFIG[card.priority].text}`}
                    >
                      {PRIORITY_CONFIG[card.priority].label}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h4 className="text-sm font-medium text-gray-900 mb-3 line-clamp-2">
                  {card.title}
                </h4>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  {/* Assignee */}
                  {card.assignee && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                        {card.assignee.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate max-w-[100px]">{card.assignee}</span>
                    </div>
                  )}

                  {/* Due Date */}
                  {card.dueDate && (
                    <div
                      className={`flex items-center gap-1 ${
                        isOverdue(card.dueDate) ? 'text-red-600' : 'text-gray-500'
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="font-medium">{formatDate(card.dueDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Empty State */}
            {column.cards.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                Trage carduri aici
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
