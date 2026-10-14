import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from '@/components/animate-ui/icons/chevron-down'
import { cn } from '../lib/cn'

interface LogFilterDropdownProps {
  value: string
  options: string[]
  counts?: Record<string, number>
  onChange: (value: string) => void
}

export function LogFilterDropdown({ value, options, counts, onChange }: LogFilterDropdownProps) {
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
        className="flex h-10 items-center gap-2 rounded-md border border-line-field bg-surface px-4 text-sm font-semibold text-ink hover:bg-surface-subtle"
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
          className="absolute left-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-lg border border-line bg-surface p-1 shadow-lg"
        >
          {options.map((opt) => (
            <button
              key={opt}
              role="option"
              aria-selected={value === opt}
              onClick={() => {
                onChange(opt)
                setOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors',
                value === opt ? 'bg-surface-subtle' : 'hover:bg-surface-subtle',
              )}
            >
              <span className="flex-1 text-ink">{opt}</span>
              {counts && <span className="text-xs text-ink-muted">{counts[opt]}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
