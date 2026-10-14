import type { TransferRequest } from '../types/transfer'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { StatusBadge } from './StatusBadge'
import { RouteChip } from './RouteChip'
import { relativeTime } from '../lib/relativeTime'
import { X } from '@/components/animate-ui/icons/x'

export function DetailDialog({
  transfer,
  onClose,
}: {
  transfer: TransferRequest | null
  onClose: () => void
}) {
  if (!transfer) return null

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false} className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="flex-row items-center justify-between gap-0 space-y-0 rounded-t-xl bg-brand px-6 py-5">
          <DialogTitle className="text-sm font-bold uppercase tracking-wide text-white">Transfer Request</DialogTitle>
          <DialogClose asChild>
            <button
              type="button"
              aria-label="Close"
              className="rounded-md p-1 text-white/80 hover:bg-white/15 hover:text-white"
            >
              <X size={18} animateOnHover />
            </button>
          </DialogClose>
        </DialogHeader>

        <div className="px-6 py-6">
          <div className="space-y-6">
            <section>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-muted">Request Details</h3>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-lg border border-line bg-surface-subtle p-4 text-sm">
                <div>
                  <dt className="mb-1 text-xs uppercase tracking-wide text-ink-muted">Hero</dt>
                  <dd className="font-medium text-ink">{transfer.heroName}</dd>
                </div>
                <div>
                  <dt className="mb-1 text-xs uppercase tracking-wide text-ink-muted">Status</dt>
                  <dd>
                    <StatusBadge status={transfer.status} />
                  </dd>
                </div>
                <div>
                  <dt className="mb-1 text-xs uppercase tracking-wide text-ink-muted">Game</dt>
                  <dd className="font-medium text-ink">{transfer.game}</dd>
                </div>
                <div>
                  <dt className="mb-1 text-xs uppercase tracking-wide text-ink-muted">Route</dt>
                  <dd>
                    <RouteChip from={transfer.fromWorld} to={transfer.toWorld} />
                  </dd>
                </div>
                <div>
                  <dt className="mb-1 text-xs uppercase tracking-wide text-ink-muted">Requested</dt>
                  <dd className="font-medium text-ink" title={new Date(transfer.requestedAt).toLocaleString()}>
                    {relativeTime(transfer.requestedAt)}
                  </dd>
                </div>
                {transfer.resolvedAt && (
                  <div>
                    <dt className="mb-1 text-xs uppercase tracking-wide text-ink-muted">Resolved</dt>
                    <dd className="font-medium text-ink" title={new Date(transfer.resolvedAt).toLocaleString()}>
                      {relativeTime(transfer.resolvedAt)}
                    </dd>
                  </div>
                )}
                {transfer.reviewedBy && (
                  <div>
                    <dt className="mb-1 text-xs uppercase tracking-wide text-ink-muted">Reviewed by</dt>
                    <dd className="font-medium text-ink">{transfer.reviewedBy}</dd>
                  </div>
                )}
              </dl>
            </section>

            <section className="border-t border-line pt-6">
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">Description</label>
              <p className="mb-3 text-xs text-ink-muted">Shown to the player and kept on this request's history.</p>
              <div className="w-full rounded-md border border-line-field bg-surface px-4 py-3 text-sm text-ink">
                {transfer.adminNote || <span className="text-ink-muted">Not reviewed yet.</span>}
              </div>
            </section>
          </div>
        </div>

        <DialogFooter className="mx-0 mb-0 flex-row justify-end gap-3 rounded-b-xl border-t border-line bg-surface px-6 py-5">
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
