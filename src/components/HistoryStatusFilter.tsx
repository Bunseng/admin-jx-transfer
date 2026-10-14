import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from '@/components/animate-ui/icons/chevron-down'
import { cn } from '../lib/cn'

export type HistoryFilter = 'All' | 'Approved' | 'Rejected'

const FILTERS: HistoryFilter[] = ['All', 'Approved', 'Rejected']

const FILTER_TEXT: Record<HistoryFilter, string> = {
  All: 'text-ink',
  Approved: 'text-approved',
  Rejected: 'text-rejected',
}

interface HistoryStatusFilterProps {
  value: HistoryFilter
  onChange: (value: HistoryFilter) => void
  counts: Record<HistoryFilter, number>
}

export function HistoryStatusFilter({ value, onChange, counts }: HistoryStatusFilterProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'flex h-10 items-center gap-2 rounded-md border border-line-field bg-surface px-4 text-sm font-semibold hover:bg-surface-subtle',
          FILTER_TEXT[value],
        )}
      >
        {value}
        <ChevronDown
          size={14}
          animate={open}
          className={cn('text-ink-muted transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full z-20 mt-2 w-64 overflow-hidden rounded-lg border border-line bg-surface p-1 shadow-lg"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              role="option"
              aria-selected={value === f}
              onClick={() => {
                onChange(f)
                setOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors',
                value === f ? 'bg-surface-subtle' : 'hover:bg-surface-subtle',
              )}
            >
              <span className={cn('flex-1', value === f ? FILTER_TEXT[f] : 'text-ink')}>{f}</span>
              <span className="text-xs text-ink-muted">{counts[f]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
