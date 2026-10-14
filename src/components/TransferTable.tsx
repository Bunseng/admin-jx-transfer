import { useState, type ReactNode } from 'react'
import { Lock } from '@/components/animate-ui/icons/lock'
import type { TransferRequest } from '../types/transfer'
import { StatusBadge } from './StatusBadge'
import { RouteChip } from './RouteChip'
import { MaskedPassword } from './MaskedPassword'
import { relativeTime } from '../lib/relativeTime'
import { Button } from './ui/button'
import { useAuth } from '../lib/auth'

interface TransferTableProps {
  rows: TransferRequest[]
  dateField: 'requestedAt' | 'resolvedAt'
  dateLabel: string
  emptyMessage: string
  renderActions: (transfer: TransferRequest) => ReactNode
  /** hide the account/password column — used in Transfer History, where credentials no longer matter once a request is resolved */
  showAccount?: boolean
  /** show who resolved the request — used in Transfer History only, Pending requests have no reviewer yet */
  showReviewer?: boolean
  /** 1-based queue position per request id — renders a leading row-number column; omit for tables with no queue concept (e.g. History) */
  queuePositions?: Map<string, number>
}

export function TransferTable({
  rows,
  dateField,
  dateLabel,
  emptyMessage,
  renderActions,
  showAccount = true,
  showReviewer = false,
  queuePositions,
}: TransferTableProps) {
  // review rows start collapsed to a single "Review" action — status and Reject/Approve
  // only appear once the admin has explicitly opted into reviewing that request. An admin
  // can expand and work on as many of their own rows at once as they want; only a row
  // another admin already has open stays locked.
  const { admin } = useAuth()
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const isReviewTable = Boolean(queuePositions)
  const showStatusColumn = !isReviewTable
  const columnCount =
    5 +
    (showAccount ? 1 : 0) +
    (showReviewer ? 1 : 0) +
    (queuePositions ? 1 : 0) +
    (showStatusColumn ? 1 : 0) +
    (isReviewTable ? 1 : 0)

  function expand(id: string) {
    setExpandedIds((prev) => new Set(prev).add(id))
  }

  return (
    <table className="w-full table-fixed text-left text-sm">
      <thead>
        <tr className="border-b border-line bg-surface-subtle text-[11px] uppercase tracking-wider text-ink-muted">
          {queuePositions && (
            <th className="w-20 whitespace-nowrap px-4 py-4 font-semibold first:pl-8 last:pr-8"># Queued</th>
          )}
          {/* in the review table Account is pinned so Hero sits right beside it
              and the leftover width goes to Reviewing By instead */}
          {showAccount && (
            <th
              className={`px-4 py-4 font-semibold first:pl-8 last:pr-8 ${isReviewTable ? 'w-44' : ''}`}
            >
              Account
            </th>
          )}
          {/* hero names run 8-10 characters; anything longer truncates rather
              than stealing width from Reviewing By */}
          <th className="w-28 px-4 py-4 font-semibold first:pl-8 last:pr-8">Hero</th>
          <th className="w-48 px-4 py-4 font-semibold first:pl-8 last:pr-8">Route</th>
          <th className="w-20 px-4 py-4 font-semibold first:pl-8 last:pr-8">{dateLabel}</th>
          {showStatusColumn && <th className="w-32 px-4 py-4 font-semibold first:pl-8 last:pr-8">Status</th>}
          {/* no width: this is the column that absorbs the table's spare space */}
          {isReviewTable && <th className="whitespace-nowrap px-4 py-4 font-semibold first:pl-8 last:pr-8">Reviewing By</th>}
          {showReviewer && <th className="w-36 whitespace-nowrap px-4 py-4 font-semibold first:pl-8 last:pr-8">Resolved By</th>}
          <th className="w-36 px-4 py-4 font-semibold first:pl-8 last:pr-8 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((t) => {
          const dateValue = t[dateField]
          const queuePosition = queuePositions?.get(t.id)
          const isExpanded = !isReviewTable || expandedIds.has(t.id)
          const lockedByOther = isReviewTable && Boolean(t.reviewingBy) && t.reviewingBy !== admin?.username
          return (
            <tr key={t.id} className="border-b border-line align-middle last:border-0 hover:bg-surface-subtle/60">
              {queuePositions && (
                <td className="px-4 py-8 first:pl-8 last:pr-8">
                  {queuePosition !== undefined && (
                    <span className="inline-flex items-center justify-center rounded-md border border-pending/25 bg-pending-surface px-2 py-0.5 text-[11px] font-bold text-pending">
                      {queuePosition}
                    </span>
                  )}
                </td>
              )}
              {showAccount && (
                <td className="px-4 py-8 first:pl-8 last:pr-8">
                  <div className="font-medium text-ink">{t.playerUsername}</div>
                  <div className="mt-1">
                    <MaskedPassword value={t.gamePassword} />
                  </div>
                </td>
              )}
              <td className="px-4 py-8 first:pl-8 last:pr-8">
                <div className="truncate font-medium text-ink" title={t.heroName}>
                  {t.heroName}
                </div>
              </td>
              <td className="px-4 py-8 first:pl-8 last:pr-8">
                <RouteChip from={t.fromWorld} to={t.toWorld} />
              </td>
              <td className="px-4 py-8 first:pl-8 last:pr-8 text-ink-muted" title={dateValue ? new Date(dateValue).toLocaleString() : undefined}>
                {dateValue ? relativeTime(dateValue) : '—'}
              </td>
              {showStatusColumn && (
                <td className="px-4 py-8 first:pl-8 last:pr-8">
                  <StatusBadge status={t.status} />
                </td>
              )}
              {isReviewTable && (
                <td className="px-4 py-8 first:pl-8 last:pr-8">
                  {lockedByOther ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-pending">
                      <Lock size={11} animateOnHover />
                      {t.reviewingBy}
                    </span>
                  ) : isExpanded ? (
                    // your own review needs no name on it — the status says it
                    <StatusBadge status={t.status} />
                  ) : (
                    <span className="text-ink-muted">—</span>
                  )}
                </td>
              )}
              {showReviewer && (
                <td className="px-4 py-8 first:pl-8 last:pr-8 text-ink-muted">{t.reviewedBy ?? '—'}</td>
              )}
              <td className="px-4 py-8 first:pl-8 last:pr-8">
                <div className="flex items-center justify-end gap-2">
                  {lockedByOther ? (
                    <Button size="sm" variant="outline" disabled title={`Being reviewed by ${t.reviewingBy} — you can't resolve this request.`}>
                      Review
                    </Button>
                  ) : isExpanded ? (
                    <>{renderActions(t)}</>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => expand(t.id)}>
                      Review
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          )
        })}

        {rows.length === 0 && (
          <tr>
            <td colSpan={columnCount} className="px-8 py-16 text-center text-sm text-ink-muted">
              {emptyMessage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
