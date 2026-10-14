import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from '@/components/animate-ui/icons/chevron-down'
import { LogOut } from '@/components/animate-ui/icons/log-out'
import { cn } from '../lib/cn'

interface UserMenuProps {
  username: string
  onLogout: () => void
  /** 'top' opens the dropdown upward and stretches the trigger full-width — for a sidebar footer */
  placement?: 'top' | 'bottom'
}

export function UserMenu({ username, onLogout, placement = 'bottom' }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const initials = username.slice(0, 2).toUpperCase()

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
    <div ref={rootRef} className={cn('relative', placement === 'top' && 'w-full')}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          'flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-2.5 transition-colors hover:bg-surface-subtle',
          placement === 'top' ? 'w-full' : 'rounded-full',
        )}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">
          {initials}
        </span>
        <span className={cn('truncate text-sm font-medium text-ink', placement === 'top' && 'flex-1 text-left')}>
          {username}
        </span>
        <ChevronDown
          size={14}
          animate={open}
          className={cn('shrink-0 text-ink-muted transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            'absolute z-20 w-44 overflow-hidden rounded-lg border border-line bg-surface p-1 shadow-lg',
            placement === 'top' ? 'bottom-full left-0 mb-2' : 'right-0 top-full mt-2',
          )}
        >
          <button
            role="menuitem"
            onClick={onLogout}
            className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm font-medium text-ink hover:bg-surface-subtle"
          >
            <LogOut size={15} animateOnHover className="text-ink-muted" />
            Log out
          </button>
        </div>
      )}
    </div>
  )
}
