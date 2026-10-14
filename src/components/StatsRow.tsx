import type { ReactNode } from 'react'
import { ListChecks } from 'lucide-react'
import { CircleCheckBig } from '@/components/animate-ui/icons/circle-check-big'
import { CircleX } from '@/components/animate-ui/icons/circle-x'
import { Clock } from '@/components/animate-ui/icons/clock'
import { Card } from './ui/card'
import { cn } from '../lib/cn'

interface Stat {
  label: string
  value: number
  icon: ReactNode
  tone: 'neutral' | 'pending' | 'approved' | 'rejected'
}

const TONE_CLASSES: Record<Stat['tone'], string> = {
  neutral: 'bg-surface-accent text-accent-ink',
  pending: 'bg-pending-surface text-pending',
  approved: 'bg-approved-surface text-approved',
  rejected: 'bg-rejected-surface text-rejected',
}

export function StatsRow({ counts }: { counts: Record<'All' | 'Pending' | 'Approved' | 'Rejected', number> }) {
  const stats: Stat[] = [
    { label: 'Total requests', value: counts.All, icon: <ListChecks size={18} />, tone: 'neutral' },
    { label: 'Awaiting review', value: counts.Pending, icon: <Clock size={18} animateOnHover />, tone: 'pending' },
    { label: 'Approved', value: counts.Approved, icon: <CircleCheckBig size={18} animateOnHover />, tone: 'approved' },
    { label: 'Rejected', value: counts.Rejected, icon: <CircleX size={18} animateOnHover />, tone: 'rejected' },
  ]

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label} className="flex-row items-center gap-4 px-4 py-4">
          <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', TONE_CLASSES[s.tone])}>
            {s.icon}
          </span>
          <div className="min-w-0">
            <div className="text-xl font-bold leading-tight text-heading">{s.value}</div>
            <div className="truncate text-xs text-ink-muted">{s.label}</div>
          </div>
        </Card>
      ))}
    </div>
  )
}
