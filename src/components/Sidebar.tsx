import { ArrowLeftRight } from 'lucide-react'
import { Activity } from '@/components/animate-ui/icons/activity'
import { NavLink } from 'react-router-dom'
import { cn } from '../lib/cn'
import myfunsLogo from '../assets/myfuns-logo.svg'

const NAV_ITEMS = [
  { to: '/admin/transfers', label: 'Transfers', icon: ArrowLeftRight },
  { to: '/admin/activity', label: 'Activity Log', icon: Activity },
]

export function Sidebar() {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-line bg-surface">
      <div className="flex h-16 shrink-0 items-center justify-center border-b border-line px-4">
        <img src={myfunsLogo} alt="MyFuns" className="h-9 w-auto" />
      </div>

      <nav className="flex-1 px-4 pt-1.5">
        <div className="mb-3.5 px-4 text-[11px] font-bold uppercase tracking-wider text-ink-muted">Operations</div>
        <div className="space-y-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-lg px-4 py-3.5 text-sm font-semibold transition-colors',
                  isActive
                    ? 'bg-surface-accent text-accent-ink'
                    : 'text-ink-muted hover:bg-surface-subtle hover:text-ink',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={17} data-active={isActive ? 'true' : undefined} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  )
}
