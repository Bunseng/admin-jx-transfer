import { useState } from 'react'
import type { TransferRequest } from '../types/transfer'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { RouteChip } from './RouteChip'
import { relativeTime } from '../lib/relativeTime'
import { X } from '@/components/animate-ui/icons/x'

interface ReviewDialogProps {
  transfer: TransferRequest | null
  action: 'Approved' | 'Rejected' | null
  onClose: () => void
  onConfirm: (note: string) => void
}

export function ReviewDialog({ transfer, action, onClose, onConfirm }: ReviewDialogProps) {
  const [note, setNote] = useState('')

  if (!transfer || !action) return null

  const isApprove = action === 'Approved'

  function handleConfirm() {
    onConfirm(note.trim())
    setNote('')
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false} className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="flex-row items-center justify-between gap-0 space-y-0 rounded-t-xl bg-brand px-6 py-5">
          <DialogTitle className="text-sm font-bold uppercase tracking-wide text-white">
            {isApprove ? 'Approve Transfer' : 'Reject Transfer'}
          </DialogTitle>
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
                <div className="col-span-2">
                  <dt className="mb-1 text-xs uppercase tracking-wide text-ink-muted">Account</dt>
                  <dd className="font-medium text-ink">{transfer.playerUsername}</dd>
                </div>
                <div>
                  <dt className="mb-1 text-xs uppercase tracking-wide text-ink-muted">Hero</dt>
                  <dd className="font-medium text-ink">{transfer.heroName}</dd>
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
              </dl>
            </section>

            <section className="border-t border-line pt-6">
              <Label htmlFor="admin-note" className="mb-1 text-xs font-bold uppercase tracking-wide text-ink-muted">
                Description {!isApprove && <span className="text-rejected">*</span>}
              </Label>
              <p className="mb-3 text-xs text-ink-muted">
                {isApprove
                  ? "Optional. Shown to the player and kept on this request's history."
                  : "Required. Shown to the player and kept on this request's history."}
              </p>
              <Textarea
                id="admin-note"
                rows={4}
                required={!isApprove}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={
                  isApprove
                    ? 'e.g. Verified account ownership, transfer completed during maintenance window.'
                    : 'e.g. Hero must reach level 10 before transferring worlds.'
                }
              />
            </section>
          </div>
        </div>

        <DialogFooter className="mx-0 mb-0 flex-row justify-end gap-3 rounded-b-xl border-t border-line bg-surface px-6 py-5">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={isApprove ? 'default' : 'destructive'}
            disabled={!isApprove && note.trim().length === 0}
            onClick={handleConfirm}
          >
            Confirm {action}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
