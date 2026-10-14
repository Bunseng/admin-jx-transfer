import { useAuth } from '../lib/auth'
import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './UserMenu'

export function TopBar() {
  const { admin, logout } = useAuth()

  return (
    <header className="flex h-16 shrink-0 items-center justify-end gap-4 border-b border-line bg-surface px-8">
      <ThemeToggle />
      <div className="h-6 w-px bg-line" />
      {admin && <UserMenu username={admin.username} onLogout={logout} />}
    </header>
  )
}
