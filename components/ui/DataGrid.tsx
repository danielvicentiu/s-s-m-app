'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'

export interface DataGridColumn<T = any> {
  key: string
  header: string
  width?: string | number
  minWidth?: string | number
  sortable?: boolean
  render?: (value: any, row: T, index: number) => React.ReactNode
  sortFn?: (a: T, b: T) => number
}

export interface DataGridProps<T = any> {
  columns: DataGridColumn<T>[]
  data: T[]
  rowHeight?: number
  visibleRows?: number
  keyExtractor?: (row: T, index: number) => string | number
  onRowClick?: (row: T, index: number) => void
  className?: string
  emptyMessage?: string
}

type SortConfig = {
  key: string
  direction: 'asc' | 'desc'
} | null

export function DataGrid<T extends Record<string, any>>({
  columns,
  data,
  rowHeight = 48,
  visibleRows = 15,
  keyExtractor = (_, index) => index,
  onRowClick,
  className = '',
  emptyMessage = 'Nu există date de afișat'
}: DataGridProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Sort data based on current sort config
  const sortedData = useMemo(() => {
    if (!sortConfig) return data

    const { key, direction } = sortConfig
    const column = columns.find((col) => col.key === key)

    return [...data].sort((a, b) => {
      // Use custom sort function if provided
      if (column?.sortFn) {
        const result = column.sortFn(a, b)
        return direction === 'asc' ? result : -result
      }

      // Default sort by comparing values
      const aVal = a[key]
      const bVal = b[key]

      if (aVal === bVal) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1

      // Handle different types
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return direction === 'asc'
          ? aVal.localeCompare(bVal, 'ro')
          : bVal.localeCompare(aVal, 'ro')
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal
      }

      // Fallback to string comparison
      const aStr = String(aVal)
      const bStr = String(bVal)
      return direction === 'asc'
        ? aStr.localeCompare(bStr, 'ro')
        : bStr.localeCompare(aStr, 'ro')
    })
  }, [data, sortConfig, columns])

  // Calculate visible range based on scroll position
  const containerHeight = visibleRows * rowHeight
  const totalHeight = sortedData.length * rowHeight
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - 5)
  const endIndex = Math.min(
    sortedData.length,
    Math.ceil((scrollTop + containerHeight) / rowHeight) + 5
  )
  const visibleData = sortedData.slice(startIndex, endIndex)
  const offsetY = startIndex * rowHeight

  // Handle scroll event
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  // Handle sort
  const handleSort = useCallback((key: string) => {
    const column = columns.find((col) => col.key === key)
    if (!column?.sortable) return

    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' }
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' }
      }
      return null
    })
  }, [columns])

  // Get cell value
  const getCellValue = useCallback(
    (row: T, column: DataGridColumn<T>, index: number) => {
      const value = row[column.key]
      if (column.render) {
        return column.render(value, row, index)
      }
      return value ?? '—'
    },
    []
  )

  // Handle row click
  const handleRowClick = useCallback(
    (row: T, index: number) => {
      if (onRowClick) {
        onRowClick(row, index)
      }
    },
    [onRowClick]
  )

  // Get column width style
  const getColumnWidth = (column: DataGridColumn<T>) => {
    if (column.width) {
      return typeof column.width === 'number' ? `${column.width}px` : column.width
    }
    return undefined
  }

  const getColumnMinWidth = (column: DataGridColumn<T>) => {
    if (column.minWidth) {
      return typeof column.minWidth === 'number'
        ? `${column.minWidth}px`
        : column.minWidth
    }
    return undefined
  }

  // Sync header scroll with body scroll
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const headerScroll = container.previousElementSibling as HTMLDivElement
    if (!headerScroll) return

    const syncScroll = () => {
      headerScroll.scrollLeft = container.scrollLeft
    }

    container.addEventListener('scroll', syncScroll)
    return () => container.removeEventListener('scroll', syncScroll)
  }, [])

  return (
    <div className={`flex flex-col border border-gray-200 rounded-lg overflow-hidden bg-white ${className}`}>
      {/* Fixed Header */}
      <div className="overflow-hidden border-b border-gray-200 bg-gray-50">
        <div className="flex min-w-full">
          {columns.map((column) => (
            <div
              key={column.key}
              className={`flex items-center gap-2 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${
                column.sortable ? 'cursor-pointer hover:bg-gray-100 select-none' : ''
              }`}
              style={{
                width: getColumnWidth(column),
                minWidth: getColumnMinWidth(column),
                flex: !column.width ? 1 : undefined
              }}
              onClick={() => handleSort(column.key)}
            >
              <span className="truncate">{column.header}</span>
              {column.sortable && sortConfig?.key === column.key && (
                <span className="text-blue-600">
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable Body */}
      {sortedData.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-gray-500">
          {emptyMessage}
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          className="overflow-auto"
          style={{ height: containerHeight }}
          onScroll={handleScroll}
        >
          <div style={{ height: totalHeight, position: 'relative' }}>
            <div
              style={{
                transform: `translateY(${offsetY}px)`,
                position: 'absolute',
                width: '100%'
              }}
            >
              {visibleData.map((row, idx) => {
                const actualIndex = startIndex + idx
                const key = keyExtractor(row, actualIndex)
                return (
                  <div
                    key={key}
                    className={`flex min-w-full border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      onRowClick ? 'cursor-pointer' : ''
                    }`}
                    style={{ height: rowHeight }}
                    onClick={() => handleRowClick(row, actualIndex)}
                  >
                    {columns.map((column) => (
                      <div
                        key={column.key}
                        className="flex items-center px-4 py-3 text-sm text-gray-900 overflow-hidden"
                        style={{
                          width: getColumnWidth(column),
                          minWidth: getColumnMinWidth(column),
                          flex: !column.width ? 1 : undefined
                        }}
                      >
                        <div className="truncate w-full">
                          {getCellValue(row, column, actualIndex)}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
