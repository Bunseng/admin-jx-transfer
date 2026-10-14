export type TransferStatus = 'Pending' | 'Approved' | 'Rejected'

// Queue position isn't stored here — it's derived as a 1-based rank over Pending
// requests (oldest first) wherever it's displayed, so it stays correct as requests
// resolve and drop out of the queue.
export interface TransferRequest {
  id: string
  /** in-game account login, same identity shown on the myfuns player side */
  playerUsername: string
  /** game account password — admin needs this to manually move the account between worlds */
  gamePassword: string
  game: string
  heroName: string
  fromWorld: string
  toWorld: string
  requestedAt: string
  status: TransferStatus
  resolvedAt?: string
  /** reason admin enters when approving or rejecting */
  adminNote?: string
  reviewedBy?: string
  /** set while another admin has this Pending request open for review — locks it from double-handling */
  reviewingBy?: string
}
