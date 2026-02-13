'use client'

import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { EmptyState } from './EmptyState'

export interface DataTableColumn<T> {
  key: keyof T | string
  label: string
  render?: (row: T) => React.ReactNode
  sortable?: boolean
  width?: string
}

export interface DataTablePagination {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface DataTableSort {
  column: string | null
  direction: 'asc' | 'desc'
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  emptyDescription?: string
  pagination?: DataTablePagination
  sort?: DataTableSort
  onSort?: (column: string) => void
  onPageChange?: (page: number) => void
  rowKey?: (row: T, index: number) => string | number
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'Nu există date',
  emptyDescription,
  pagination,
  sort,
  onSort,
  onPageChange,
  rowKey,
}: DataTableProps<T>) {
  const handleSort = (column: string) => {
    if (onSort) {
      onSort(column)
    }
  }

  const handlePageChange = (page: number) => {
    if (onPageChange && pagination) {
      const validPage = Math.max(1, Math.min(page, pagination.totalPages))
      onPageChange(validPage)
    }
  }

  // Skeleton loading state
  if (loading) {
    return (
      <div className="space-y-3">
        {/* Table header skeleton */}
        <div className="hidden md:block">
          <div className="flex gap-4 px-4 py-3 border-b border-gray-200">
            {columns.map((col, idx) => (
              <div
                key={idx}
                className="h-5 bg-gray-200 rounded animate-pulse"
                style={{ width: col.width || '120px' }}
              />
            ))}
          </div>
          {/* Table rows skeleton */}
          {Array.from({ length: pagination?.pageSize || 5 }).map((_, idx) => (
            <div key={idx} className="flex gap-4 px-4 py-3 border-b border-gray-100">
              {columns.map((col, colIdx) => (
                <div
                  key={colIdx}
                  className="h-5 bg-gray-100 rounded animate-pulse"
                  style={{ width: col.width || '120px' }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Mobile skeleton */}
        <div className="md:hidden space-y-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
              {columns.slice(0, 3).map((_, colIdx) => (
                <div key={colIdx} className="flex justify-between">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <EmptyState
        title={emptyMessage}
        description={emptyDescription}
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-2xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {columns.map((col) => {
                const isSortable = col.sortable !== false
                const isSorted = sort?.column === String(col.key)

                return (
                  <th
                    key={String(col.key)}
                    className={`text-left px-4 py-3 font-semibold text-gray-700 ${
                      isSortable ? 'cursor-pointer hover:text-blue-600 select-none' : ''
                    }`}
                    style={{ width: col.width }}
                    onClick={() => isSortable && handleSort(String(col.key))}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.label}
                      {isSortable && (
                        <div className="flex flex-col">
                          {isSorted ? (
                            sort.direction === 'asc' ? (
                              <ChevronUp className="h-4 w-4 text-blue-600" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-blue-600" />
                            )
                          ) : (
                            <div className="h-4 w-4 opacity-30">
                              <ChevronUp className="h-3 w-3 -mb-1" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const key = rowKey ? rowKey(row, index) : index
              return (
                <tr
                  key={key}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3 text-gray-900">
                      {col.render
                        ? col.render(row)
                        : String(row[col.key as keyof T] ?? '—')}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {data.map((row, index) => {
          const key = rowKey ? rowKey(row, index) : index
          return (
            <div
              key={key}
              className="bg-white border border-gray-200 rounded-2xl p-4 space-y-2.5"
            >
              {columns.map((col) => (
                <div key={String(col.key)} className="flex justify-between items-start gap-3">
                  <span className="text-xs text-gray-500 font-medium min-w-[80px]">
                    {col.label}
                  </span>
                  <span className="text-sm text-gray-900 text-right flex-1">
                    {col.render
                      ? col.render(row)
                      : String(row[col.key as keyof T] ?? '—')}
                  </span>
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 text-sm">
          <span className="text-gray-600">
            {((pagination.currentPage - 1) * pagination.pageSize) + 1}–
            {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} din{' '}
            {pagination.totalItems} rezultate
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Pagina anterioară"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <span className="text-gray-700 font-medium min-w-[60px] text-center">
              {pagination.currentPage} / {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Pagina următoare"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
