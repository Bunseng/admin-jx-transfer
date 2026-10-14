import { useMemo, useState } from 'react'
import { History } from 'lucide-react'
import { Clock } from '@/components/animate-ui/icons/clock'
import { Search } from '@/components/animate-ui/icons/search'
import { MOCK_TRANSFERS } from '../data/transfers'
import type { TransferRequest, TransferStatus } from '../types/transfer'
import { StatsRow } from '../components/StatsRow'
import { TransferTable } from '../components/TransferTable'
import { Pagination } from '../components/Pagination'
import { ReviewDialog } from '../components/ReviewDialog'
import { DetailDialog } from '../components/DetailDialog'
import { HistoryStatusFilter, type HistoryFilter } from '../components/HistoryStatusFilter'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card } from '../components/ui/card'
import { useAuth } from '../lib/auth'
import { cn } from '../lib/cn'

type MainTab = 'Review' | 'History'

export function TransfersPage() {
  const { admin } = useAuth()
  const [transfers, setTransfers] = useState<TransferRequest[]>(MOCK_TRANSFERS)
  const [tab, setTab] = useState<MainTab>('Review')
  const [query, setQuery] = useState('')
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('All')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [reviewTarget, setReviewTarget] = useState<{ transfer: TransferRequest; action: 'Approved' | 'Rejected' } | null>(null)
  const [detailTarget, setDetailTarget] = useState<TransferRequest | null>(null)

  const counts = useMemo(() => {
    return {
      All: transfers.length,
      Pending: transfers.filter((t) => t.status === 'Pending').length,
      Approved: transfers.filter((t) => t.status === 'Approved').length,
      Rejected: transfers.filter((t) => t.status === 'Rejected').length,
    }
  }, [transfers])

  const matchesQuery = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (t: TransferRequest) =>
      q.length === 0 || t.heroName.toLowerCase().includes(q) || t.playerUsername.toLowerCase().includes(q)
  }, [query])

  const inReview = useMemo(
    () =>
      transfers
        .filter((t) => t.status === 'Pending')
        .sort((a, b) => new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime()),
    [transfers],
  )

  const history = useMemo(
    () =>
      transfers
        .filter((t) => t.status === 'Approved' || t.status === 'Rejected')
        .filter((t) => historyFilter === 'All' || t.status === (historyFilter as TransferStatus))
        .filter(matchesQuery)
        .sort((a, b) => new Date(b.resolvedAt ?? 0).getTime() - new Date(a.resolvedAt ?? 0).getTime()),
    [transfers, historyFilter, matchesQuery],
  )

  // list position within the queue — 1 at the top, recomputed from the (possibly search-filtered) order;
  // a request simply has no entry here once it's resolved and drops out of inReview
  const queuePositions = useMemo(() => {
    const map = new Map<string, number>()
    inReview.forEach((t, index) => map.set(t.id, index + 1))
    return map
  }, [inReview])

  const activeRows = tab === 'Review' ? inReview : history
  const totalPages = Math.max(1, Math.ceil(activeRows.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageRows = activeRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function changeTab(next: MainTab) {
    setTab(next)
    setPage(1)
  }

  function changeHistoryFilter(next: HistoryFilter) {
    setHistoryFilter(next)
    setPage(1)
  }

  function changeQuery(next: string) {
    setQuery(next)
    setPage(1)
  }

  function changePageSize(next: number) {
    setPageSize(next)
    setPage(1)
  }

  function handleConfirmReview(note: string) {
    if (!reviewTarget) return
    const { transfer, action } = reviewTarget
    setTransfers((prev) =>
      prev.map((t) =>
        t.id === transfer.id
          ? {
              ...t,
              status: action,
              resolvedAt: new Date().toISOString(),
              adminNote: note,
              reviewedBy: admin?.username,
            }
          : t,
      ),
    )
    setReviewTarget(null)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-bold text-heading">World Transfer Requests</h1>
        <p className="text-sm text-ink-muted">Review and action player-submitted hero transfers.</p>
      </div>

      <StatsRow counts={counts} />

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex items-center gap-1 rounded-xl border border-line bg-surface-subtle p-1">
          <button
            onClick={() => changeTab('Review')}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
              tab === 'Review' ? 'bg-brand text-white' : 'text-ink-muted hover:text-ink',
            )}
          >
            <Clock size={15} animate={tab === 'Review'} data-active={tab === 'Review' ? 'true' : undefined} />
            In Review
          </button>
          <button
            onClick={() => changeTab('History')}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
              tab === 'History' ? 'bg-brand text-white' : 'text-ink-muted hover:text-ink',
            )}
          >
            <History size={15} data-active={tab === 'History' ? 'true' : undefined} />
            Transfer History
          </button>
        </div>

        {tab === 'History' && (
          <div className="flex flex-wrap items-center gap-4">
            <HistoryStatusFilter
              value={historyFilter}
              onChange={changeHistoryFilter}
              counts={{ All: counts.Approved + counts.Rejected, Approved: counts.Approved, Rejected: counts.Rejected }}
            />

            <div className="relative w-full sm:w-64">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <Input
                placeholder="Search hero or account…"
                className="pl-9"
                value={query}
                onChange={(e) => changeQuery(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <Card className="overflow-x-auto py-0">
        {tab === 'Review' ? (
          <TransferTable
            rows={pageRows}
            dateField="requestedAt"
            dateLabel="Requested"
            emptyMessage="No requests waiting on review."
            queuePositions={queuePositions}
            renderActions={(t) => (
              <>
                <Button size="sm" variant="destructive" onClick={() => setReviewTarget({ transfer: t, action: 'Rejected' })}>
                  Reject
                </Button>
                <Button size="sm" onClick={() => setReviewTarget({ transfer: t, action: 'Approved' })}>
                  Approve
                </Button>
              </>
            )}
          />
        ) : (
          <TransferTable
            rows={pageRows}
            dateField="resolvedAt"
            dateLabel="Resolved"
            emptyMessage="No resolved requests yet."
            showAccount={false}
            showReviewer
            renderActions={(t) => (
              <button
                type="button"
                onClick={() => setDetailTarget(t)}
                className="text-sm font-semibold text-brand underline underline-offset-2 hover:text-brand-hover"
              >
                View Detail
              </button>
            )}
          />
        )}
        <Pagination
          page={currentPage}
          pageSize={pageSize}
          total={activeRows.length}
          onPageChange={setPage}
          onPageSizeChange={changePageSize}
        />
      </Card>

      <ReviewDialog
        transfer={reviewTarget?.transfer ?? null}
        action={reviewTarget?.action ?? null}
        onClose={() => setReviewTarget(null)}
        onConfirm={handleConfirmReview}
      />

      <DetailDialog transfer={detailTarget} onClose={() => setDetailTarget(null)} />
    </div>
  )
}
