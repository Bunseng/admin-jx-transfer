import type { TransferRequest, TransferStatus } from '../types/transfer'

function hoursAgo(h: number) {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString()
}

function daysAgo(d: number) {
  return new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString()
}

const HAND_WRITTEN: TransferRequest[] = [
  {
    id: 'jx2-1-t12',
    playerUsername: 'sok.malis',
    gamePassword: 'Tr@nsfer2024!',
    game: 'JX2',
    heroName: 'MalisSok',
    fromWorld: 'Warlords',
    toWorld: 'Origin',
    requestedAt: hoursAgo(2),
    status: 'Pending',
  },
  {
    id: 'jx2-1-t11',
    playerUsername: 'dara.rithy',
    gamePassword: 'RithyD@ra88',
    game: 'JX2',
    heroName: 'RithyDara',
    fromWorld: 'Norkor Chey',
    toWorld: 'Origin',
    requestedAt: hoursAgo(140),
    status: 'Pending',
    reviewingBy: 'bunthoeun.k',
  },
  {
    id: 'jx2-1-t10',
    playerUsername: 'chan.sreymom',
    gamePassword: 'Sr3ymom!23',
    game: 'JX2',
    heroName: 'SreymomFlash',
    fromWorld: 'Warlords',
    toWorld: 'Norkor Chey',
    requestedAt: hoursAgo(11),
    status: 'Pending',
  },
  {
    id: 'jx2-1-t1',
    playerUsername: 'itzy.yeji',
    gamePassword: 'YeJii2020#',
    game: 'JX2',
    heroName: 'YeJiiITZY',
    fromWorld: 'Origin',
    toWorld: 'Warlords',
    requestedAt: daysAgo(36),
    resolvedAt: daysAgo(35),
    status: 'Rejected',
    adminNote: 'Hero must reach level 10 before transferring worlds.',
    reviewedBy: 'sreyleak.p',
  },
  {
    id: 'jx2-2-t1',
    playerUsername: 'the.jek',
    gamePassword: 'GreatJek99',
    game: 'JX2',
    heroName: 'JekTheGreat',
    fromWorld: 'Warlords',
    toWorld: 'Origin',
    requestedAt: daysAgo(58),
    resolvedAt: daysAgo(57),
    status: 'Approved',
    adminNote: 'Approved. Character moved during the scheduled maintenance window.',
    reviewedBy: 'sreyleak.p',
  },
  {
    id: 'jx2-2-t2',
    playerUsername: 'vanna.kosal',
    gamePassword: 'K0salVanna',
    game: 'JX2',
    heroName: 'KosalVanna',
    fromWorld: 'Origin',
    toWorld: 'Norkor Chey',
    requestedAt: daysAgo(4),
    resolvedAt: daysAgo(3),
    status: 'Approved',
    adminNote: 'Verified account ownership by phone. Transfer completed.',
    reviewedBy: 'bunthoeun.k',
  },
  {
    id: 'jx2-1-t9',
    playerUsername: 'ratanak.oun',
    gamePassword: 'Oun_Ratanak7',
    game: 'JX2',
    heroName: 'OunRatanak',
    fromWorld: 'Norkor Chey',
    toWorld: 'Warlords',
    requestedAt: daysAgo(9),
    resolvedAt: daysAgo(9),
    status: 'Rejected',
    adminNote: 'Duplicate request — already transferred earlier this week.',
    reviewedBy: 'bunthoeun.k',
  },
  {
    id: 'jx2-3-t1',
    playerUsername: 'leakhena.chov',
    gamePassword: 'ChovLeak!45',
    game: 'JX2',
    heroName: 'LeakhenaC',
    fromWorld: 'Origin',
    toWorld: 'Warlords',
    requestedAt: hoursAgo(30),
    status: 'Pending',
  },
  {
    id: 'jx2-3-t2',
    playerUsername: 'pisey.lim',
    gamePassword: 'LimPisey_09',
    game: 'JX2',
    heroName: 'PiseyStorm',
    fromWorld: 'Warlords',
    toWorld: 'Origin',
    requestedAt: hoursAgo(135),
    status: 'Pending',
    reviewingBy: 'vuthy.chan',
  },
  {
    id: 'jx2-3-t3',
    playerUsername: 'sophal.ney',
    gamePassword: 'NeySophal#3',
    game: 'JX2',
    heroName: 'SophalBlade',
    fromWorld: 'Norkor Chey',
    toWorld: 'Warlords',
    requestedAt: hoursAgo(52),
    status: 'Pending',
  },
  {
    id: 'jx2-4-t1',
    playerUsername: 'channary.so',
    gamePassword: 'SoChannary1',
    game: 'JX2',
    heroName: 'ChannaryWind',
    fromWorld: 'Origin',
    toWorld: 'Norkor Chey',
    requestedAt: daysAgo(12),
    resolvedAt: daysAgo(11),
    status: 'Approved',
    adminNote: 'Verified account ownership by phone. Transfer completed.',
    reviewedBy: 'sreyleak.p',
  },
  {
    id: 'jx2-4-t2',
    playerUsername: 'virak.heng',
    gamePassword: 'HengVirak!7',
    game: 'JX2',
    heroName: 'VirakFury',
    fromWorld: 'Warlords',
    toWorld: 'Origin',
    requestedAt: daysAgo(20),
    resolvedAt: daysAgo(19),
    status: 'Rejected',
    adminNote: 'Hero must reach level 10 before transferring worlds.',
    reviewedBy: 'bunthoeun.k',
  },
]

// seeded PRNG so the generated bulk dataset is stable across reloads instead of reshuffling every render
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

const FIRST_NAMES = [
  'Sok', 'Dara', 'Sreymom', 'Ratanak', 'Leakhena', 'Pisey', 'Sophal', 'Channary', 'Virak', 'Bunthoeun',
  'Sreyleak', 'Vuthy', 'Chanthou', 'Kosal', 'Maly', 'Rithy', 'Chenda', 'Pheakdey', 'Sovannak', 'Theara',
  'Reaksmey', 'Dalin', 'Sothea', 'Phirun', 'Nary', 'Mealea', 'Veasna', 'Chandara', 'Sreynich', 'Borey',
]
const LAST_NAMES = [
  'Malis', 'Rithy', 'Flash', 'Oun', 'Chov', 'Lim', 'Ney', 'So', 'Heng', 'Khun',
  'Phirun', 'Chandy', 'Nary', 'Vanna', 'Sothea', 'Veng', 'Chetra', 'Sarath', 'Davy', 'Mony',
]
const WORLDS = ['Warlords', 'Origin', 'Norkor Chey']
const REVIEWERS = ['sreyleak.p', 'bunthoeun.k', 'vuthy.chan']
const APPROVED_NOTES = [
  'Verified account ownership by phone. Transfer completed.',
  'Approved during the scheduled maintenance window.',
  'Ownership confirmed via support ticket. Transfer completed.',
]
const REJECTED_NOTES = [
  'Hero must reach level 10 before transferring worlds.',
  'Duplicate request — already transferred earlier this week.',
  'World transfer window closed for this season.',
  'Account ownership could not be verified.',
]

function generateBulkTransfers(count: number): TransferRequest[] {
  const rand = mulberry32(20260930)
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)]
  const results: TransferRequest[] = []

  for (let i = 0; i < count; i++) {
    const first = pick(FIRST_NAMES)
    const last = pick(LAST_NAMES)
    const playerUsername = `${first.toLowerCase()}.${last.toLowerCase()}${i}`
    const heroName = `${last}${first}`
    const fromWorld = pick(WORLDS)
    let toWorld = pick(WORLDS)
    while (toWorld === fromWorld) toWorld = pick(WORLDS)

    const statusRoll = rand()
    const status: TransferStatus = statusRoll < 0.45 ? 'Pending' : statusRoll < 0.75 ? 'Approved' : 'Rejected'
    const gamePassword = `${last}${first.slice(0, 2)}${Math.floor(rand() * 900 + 100)}!`

    if (status === 'Pending') {
      results.push({
        id: `jx2-gen-${i}`,
        playerUsername,
        gamePassword,
        game: 'JX2',
        heroName,
        fromWorld,
        toWorld,
        requestedAt: hoursAgo(1 + Math.floor(rand() * 95)),
        status,
      })
    } else {
      const requestedDaysAgo = 2 + Math.floor(rand() * 90)
      const resolvedDaysAgo = Math.max(0, requestedDaysAgo - (1 + Math.floor(rand() * 3)))
      results.push({
        id: `jx2-gen-${i}`,
        playerUsername,
        gamePassword,
        game: 'JX2',
        heroName,
        fromWorld,
        toWorld,
        requestedAt: daysAgo(requestedDaysAgo),
        resolvedAt: daysAgo(resolvedDaysAgo),
        status,
        adminNote: status === 'Approved' ? pick(APPROVED_NOTES) : pick(REJECTED_NOTES),
        reviewedBy: pick(REVIEWERS),
      })
    }
  }

  return results
}

export const MOCK_TRANSFERS: TransferRequest[] = [...HAND_WRITTEN, ...generateBulkTransfers(88)]
