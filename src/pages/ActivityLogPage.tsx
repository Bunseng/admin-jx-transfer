import { useMemo, useState, type ComponentType } from 'react'
import { ArrowRightLeft } from 'lucide-react'
import { CircleCheckBig } from '@/components/animate-ui/icons/circle-check-big'
import { CircleX } from '@/components/animate-ui/icons/circle-x'
import { LogIn } from '@/components/animate-ui/icons/log-in'
import { LogOut } from '@/components/animate-ui/icons/log-out'
import { User } from '@/components/animate-ui/icons/user'
import { getAllGameActivity, getAllUserActivity } from '../data/activityLog'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Pagination } from '../components/Pagination'
import { LogFilterDropdown } from '../components/LogFilterDropdown'
import { relativeTime } from '../lib/relativeTime'
import { cn } from '../lib/cn'

type LogTab = 'Transfer' | 'User'

const USER_ACTION_FILTERS = ['All', 'Login', 'Logout']
const TRANSFER_ACTION_FILTERS = ['All', 'Transfer Requested', 'Transfer Approved', 'Transfer Rejected']

const ACTION_ICON: Record<string, ComponentType<{ size?: number }>> = {
  Login: LogIn,
  Logout: LogOut,
  'Transfer Requested': ArrowRightLeft,
  'Transfer Approved': CircleCheckBig,
  'Transfer Rejected': CircleX,
}

const ACTION_CLASSES: Record<string, string> = {
  Login: 'bg-approved-surface text-approved',
  Logout: 'bg-surface-subtle text-ink-muted',
  'Transfer Requested': 'bg-pending-surface text-pending',
  'Transfer Approved': 'bg-approved-surface text-approved',
  'Transfer Rejected': 'bg-rejected-surface text-rejected',
}

// user ids render as uuid-shaped strings (matching the real audit log) — truncate
// for the table column and leave the full id + account in the title tooltip
function shortId(id: string) {
  return id.length > 18 ? `${id.slice(0, 18)}…` : id
}

export function ActivityLogPage() {
  const [tab, setTab] = useState<LogTab>('User')
  const [actionFilter, setActionFilter] = useState('All')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const userActivity = useMemo(() => getAllUserActivity(), [])
  const transferActivity = useMemo(() => getAllGameActivity(), [])
  const rows = tab === 'User' ? userActivity : transferActivity
  const actionOptions = tab === 'User' ? USER_ACTION_FILTERS : TRANSFER_ACTION_FILTERS

  const actionCounts = useMemo(() => {
    const counts: Record<string, number> = { All: rows.length }
    for (const opt of actionOptions) {
      if (opt === 'All') continue
      counts[opt] = rows.filter((r) => r.action === opt).length
    }
    return counts
  }, [rows, actionOptions])

  const fromMs = dateFrom ? new Date(`${dateFrom}T00:00:00`).getTime() : null
  const toMs = dateTo ? new Date(`${dateTo}T23:59:59`).getTime() : null

  const filteredRows = useMemo(
    () =>
      rows.filter((r) => {
        if (actionFilter !== 'All' && r.action !== actionFilter) return false
        const ts = new Date(r.timestamp).getTime()
        if (fromMs !== null && ts < fromMs) return false
        if (toMs !== null && ts > toMs) return false
        return true
      }),
    [rows, actionFilter, fromMs, toMs],
  )

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function changeTab(next: LogTab) {
    setTab(next)
    setActionFilter('All')
    setPage(1)
  }

  function changeActionFilter(next: string) {
    setActionFilter(next)
    setPage(1)
  }

  function changeDateFrom(next: string) {
    setDateFrom(next)
    setPage(1)
  }

  function changeDateTo(next: string) {
    setDateTo(next)
    setPage(1)
  }

  function changePageSize(next: number) {
    setPageSize(next)
    setPage(1)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-bold text-heading">Account Activity Log</h1>
        <p className="text-sm text-ink-muted">Transfer activity and user login activity.</p>
      </div>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="inline-flex items-center gap-1 rounded-xl border border-line bg-surface-subtle p-1">
          <button
            onClick={() => changeTab('Transfer')}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
              tab === 'Transfer' ? 'bg-brand text-white' : 'text-ink-muted hover:text-ink',
            )}
          >
            <ArrowRightLeft size={15} data-active={tab === 'Transfer' ? 'true' : undefined} />
            Transfer Activity
          </button>
          <button
            onClick={() => changeTab('User')}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
              tab === 'User' ? 'bg-brand text-white' : 'text-ink-muted hover:text-ink',
            )}
          >
            <User size={15} animate={tab === 'User'} data-active={tab === 'User' ? 'true' : undefined} />
            User Activity
          </button>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <LogFilterDropdown value={actionFilter} options={actionOptions} counts={actionCounts} onChange={changeActionFilter} />

          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-muted">From</label>
            <Input type="date" value={dateFrom} onChange={(e) => changeDateFrom(e.target.value)} className="w-auto" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-muted">To</label>
            <Input type="date" value={dateTo} onChange={(e) => changeDateTo(e.target.value)} className="w-auto" />
          </div>
        </div>
      </div>

      <Card className="overflow-x-auto py-0">
        <table className="w-full table-fixed text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-surface-subtle text-[11px] uppercase tracking-wider text-ink-muted">
              <th className="w-56 px-4 py-4 font-semibold first:pl-8 last:pr-8">User ID</th>
              <th className="w-48 px-4 py-4 font-semibold first:pl-8 last:pr-8">Action</th>
              <th className="w-32 px-4 py-4 font-semibold first:pl-8 last:pr-8">Service</th>
              <th className="px-4 py-4 font-semibold first:pl-8 last:pr-8">Description</th>
              <th className="w-28 px-4 py-4 font-semibold first:pl-8 last:pr-8">Status</th>
              <th className="w-28 px-4 py-4 font-semibold first:pl-8 last:pr-8">Date</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r) => {
              const Icon = ACTION_ICON[r.action]
              return (
                <tr key={r.id} className="border-b border-line last:border-0">
                  <td
                    className="truncate px-4 py-4 font-medium text-ink first:pl-8 last:pr-8"
                    title={`${r.userId} (${r.username})`}
                  >
                    {shortId(r.userId)}
                  </td>
                  <td className="px-4 py-4 first:pl-8 last:pr-8">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold',
                        ACTION_CLASSES[r.action],
                      )}
                    >
                      <Icon size={12} />
                      {r.action}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-ink-muted first:pl-8 last:pr-8">{r.service}</td>
                  <td className="truncate px-4 py-4 text-ink-muted first:pl-8 last:pr-8" title={r.description}>
                    {r.description}
                  </td>
                  <td className="px-4 py-4 first:pl-8 last:pr-8">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide',
                        r.status === 'Success' ? 'bg-approved-surface text-approved' : 'bg-rejected-surface text-rejected',
                      )}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {r.status}
                    </span>
                  </td>
                  <td
                    className="px-4 py-4 text-ink-muted first:pl-8 last:pr-8"
                    title={new Date(r.timestamp).toLocaleString()}
                  >
                    {relativeTime(r.timestamp)}
                  </td>
                </tr>
              )
            })}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-8 py-16 text-center text-sm text-ink-muted">
                  No activity found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          page={currentPage}
          pageSize={pageSize}
          total={filteredRows.length}
          onPageChange={setPage}
          onPageSizeChange={changePageSize}
        />
      </Card>
    </div>
  )
}
