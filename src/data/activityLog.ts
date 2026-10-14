import { MOCK_TRANSFERS } from './transfers'

export type UserAction = 'Login' | 'Logout'
export type GameAction = 'Transfer Requested' | 'Transfer Approved' | 'Transfer Rejected'
export type LogStatus = 'Success' | 'Failed'

interface LogEntryBase {
  id: string
  userId: string
  username: string
  service: string
  description: string
  status: LogStatus
  timestamp: string
}

export interface UserActivityEntry extends LogEntryBase {
  action: UserAction
}

export interface GameActivityEntry extends LogEntryBase {
  action: GameAction
}

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function mulberry32(seed: number) {
  let s = seed
  return function random() {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// deterministic uuid-shaped id so the same account always renders the same User ID
// instead of a readable username, matching how the real audit log identifies accounts
export function pseudoUserId(username: string): string {
  const rand = mulberry32(hashString(username))
  const seg = (len: number) => Array.from({ length: len }, () => Math.floor(rand() * 16).toString(16)).join('')
  return `${seg(8)}-${seg(4)}-${seg(4)}-${seg(4)}-${seg(12)}`
}

// deterministic per-username session history — same account always yields the same
// log on reload instead of reshuffling, since there's no real backend behind this yet
export function getAllUserActivity(): UserActivityEntry[] {
  const usernames = Array.from(new Set(MOCK_TRANSFERS.map((t) => t.playerUsername))).sort()
  const entries: UserActivityEntry[] = []
  const now = Date.now()

  for (const username of usernames) {
    const rand = mulberry32(hashString(username))
    const userId = pseudoUserId(username)
    const sessionCount = 4 + Math.floor(rand() * 5)

    let dayOffset = 0.2
    for (let i = 0; i < sessionCount; i++) {
      dayOffset += rand() * 2.5
      const loginAt = now - dayOffset * 24 * 60 * 60 * 1000
      const sessionMinutes = 10 + Math.floor(rand() * 180)
      const logoutAt = loginAt + sessionMinutes * 60 * 1000
      const loginFailed = rand() < 0.08

      entries.push({
        id: `${username}-login-${i}`,
        userId,
        username,
        action: 'Login',
        service: 'admin_dash',
        description: loginFailed ? 'Login attempt failed' : 'Login',
        status: loginFailed ? 'Failed' : 'Success',
        timestamp: new Date(loginAt).toISOString(),
      })

      if (!loginFailed && logoutAt < now) {
        entries.push({
          id: `${username}-logout-${i}`,
          userId,
          username,
          action: 'Logout',
          service: 'admin_dash',
          description: 'Logout',
          status: 'Success',
          timestamp: new Date(logoutAt).toISOString(),
        })
      }
    }
  }

  return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function getAllGameActivity(): GameActivityEntry[] {
  const entries: GameActivityEntry[] = []

  for (const t of MOCK_TRANSFERS) {
    const userId = pseudoUserId(t.playerUsername)
    const description = `${t.heroName} · ${t.fromWorld} → ${t.toWorld}`

    entries.push({
      id: `${t.id}-requested`,
      userId,
      username: t.playerUsername,
      action: 'Transfer Requested',
      service: 'transfer_api',
      description,
      status: 'Success',
      timestamp: t.requestedAt,
    })

    if (t.resolvedAt) {
      entries.push({
        id: `${t.id}-resolved`,
        userId,
        username: t.playerUsername,
        action: t.status === 'Approved' ? 'Transfer Approved' : 'Transfer Rejected',
        service: 'transfer_api',
        description,
        status: t.status === 'Approved' ? 'Success' : 'Failed',
        timestamp: t.resolvedAt,
      })
    }
  }

  return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}
