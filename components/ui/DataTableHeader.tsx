'use client'

import React from 'react'

export interface DataTableColumn {
  key: string
  label: string
  sortable: boolean
  width?: string
}

export interface DataTableHeaderProps {
  columns: DataTableColumn[]
  sortColumn?: string
  sortDirection?: 'asc' | 'desc'
  onSort?: (columnKey: string) => void
}

export default function DataTableHeader({
  columns,
  sortColumn,
  sortDirection = 'asc',
  onSort,
}: DataTableHeaderProps) {
  const handleSort = (columnKey: string, sortable: boolean) => {
    if (sortable && onSort) {
      onSort(columnKey)
    }
  }

  return (
    <thead className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
      <tr>
        {columns.map((column) => {
          const isActive = sortColumn === column.key
          const isSortable = column.sortable

          return (
            <th
              key={column.key}
              scope="col"
              style={{ width: column.width }}
              className={`
                px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                ${isSortable ? 'cursor-pointer select-none hover:bg-gray-100 transition-colors' : ''}
                ${isActive ? 'bg-blue-50 text-blue-600' : ''}
              `}
              onClick={() => handleSort(column.key, isSortable)}
            >
              <div className="flex items-center gap-2">
                <span>{column.label}</span>
                {isSortable && (
                  <div className="flex flex-col">
                    <svg
                      className={`w-3 h-3 -mb-1 ${
                        isActive && sortDirection === 'asc'
                          ? 'text-blue-600'
                          : 'text-gray-400'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <svg
                      className={`w-3 h-3 ${
                        isActive && sortDirection === 'desc'
                          ? 'text-blue-600'
                          : 'text-gray-400'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </th>
          )
        })}
      </tr>
    </thead>
  )
}
