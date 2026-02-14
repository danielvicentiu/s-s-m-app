'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize: number
  onPageSizeChange: (size: number) => void
  totalItems?: number
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItems
}: PaginationProps) {
  const pageSizeOptions = [10, 25, 50, 100]

  // Calculează range-ul de iteme afișate
  const startItem = totalItems ? (currentPage - 1) * pageSize + 1 : 0
  const endItem = totalItems ? Math.min(currentPage * pageSize, totalItems) : 0

  // Generează array-ul de numere de pagini cu ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 7 // număr maxim de butoane vizibile

    if (totalPages <= maxVisible) {
      // Dacă avem puține pagini, le afișăm pe toate
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Logica pentru ellipsis
      if (currentPage <= 3) {
        // Suntem la început
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
        pages.push('ellipsis-end')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Suntem la final
        pages.push(1)
        pages.push('ellipsis-start')
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Suntem la mijloc
        pages.push(1)
        pages.push('ellipsis-start')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis-end')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-t border-gray-200">
      {/* Info și selector page size */}
      <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-700">
        {totalItems !== undefined && totalItems > 0 && (
          <span className="whitespace-nowrap">
            Afișează <span className="font-medium">{startItem}</span>-
            <span className="font-medium">{endItem}</span> din{' '}
            <span className="font-medium">{totalItems}</span>
          </span>
        )}

        <div className="flex items-center gap-2">
          <label htmlFor="page-size" className="whitespace-nowrap">
            Per pagină:
          </label>
          <select
            id="page-size"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-lg border-gray-300 py-1 pl-2 pr-8 text-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigare pagini */}
      <div className="flex items-center gap-2">
        {/* Buton Previous */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Pagina anterioară"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Numere pagini */}
        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (typeof page === 'string') {
              // Ellipsis
              return (
                <span
                  key={`${page}-${index}`}
                  className="inline-flex items-center justify-center w-9 h-9 text-gray-500"
                >
                  ...
                </span>
              )
            }

            // Număr de pagină
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
                aria-label={`Pagina ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )
          })}
        </div>

        {/* Info pagină pe mobile (în loc de numere) */}
        <div className="sm:hidden flex items-center px-3 py-1 text-sm text-gray-700">
          <span className="font-medium">{currentPage}</span>
          <span className="mx-1">/</span>
          <span>{totalPages}</span>
        </div>

        {/* Buton Next */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Pagina următoare"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
