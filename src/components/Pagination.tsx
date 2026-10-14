import { ChevronLeft } from '@/components/animate-ui/icons/chevron-left'
import { ChevronRight } from '@/components/animate-ui/icons/chevron-right'
import { Button } from './ui/button'

const PAGE_SIZE_OPTIONS = [10, 20, 50]

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-4 py-4">
      <div className="flex flex-wrap items-center gap-4 text-xs text-ink-muted">
        <label className="flex items-center gap-2">
          <span>Rows per page</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 rounded-md border border-line-field bg-surface px-2 text-xs font-medium text-ink focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        <span>{total === 0 ? 'No results' : `Showing ${start}–${end} of ${total}`}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={15} animateOnHover />
        </Button>
        <span className="text-xs font-medium text-ink-muted">
          Page {page} of {totalPages}
        </span>
        <Button
          size="sm"
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={15} animateOnHover />
        </Button>
      </div>
    </div>
  )
}
