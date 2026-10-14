import type { TransferStatus } from '../types/transfer'
import { cn } from '../lib/cn'

const STATUS_LABEL: Record<TransferStatus, string> = {
  Pending: 'In Review',
  Approved: 'Approved',
  Rejected: 'Rejected',
}

const STATUS_CLASSES: Record<TransferStatus, string> = {
  Pending: 'bg-pending-surface text-pending',
  Approved: 'bg-approved-surface text-approved',
  Rejected: 'bg-rejected-surface text-rejected',
}

export function StatusBadge({ status }: { status: TransferStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide',
        STATUS_CLASSES[status],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABEL[status]}
    </span>
  )
}
