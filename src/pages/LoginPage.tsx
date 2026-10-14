import { type FormEvent, type MouseEvent, useRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { ThemeToggle } from '../components/ThemeToggle'
import myfunsLogo from '../assets/myfuns-logo.svg'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const spotlightRef = useRef<HTMLDivElement>(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function handleCardMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = spotlightRef.current?.getBoundingClientRect()
    if (!rect) return
    spotlightRef.current!.style.setProperty('--spotlight-x', `${e.clientX - rect.left}px`)
    spotlightRef.current!.style.setProperty('--spotlight-y', `${e.clientY - rect.top}px`)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(username, password)
      const redirectTo = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/admin/transfers'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-line)_1px,transparent_0)] bg-[size:32px_32px] opacity-60" />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand/25 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-brand-hover/25 blur-3xl" />
      </div>

      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>
      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <img src={myfunsLogo} alt="MyFuns" className="h-14 w-auto" />
          <p className="text-sm text-ink-muted">Admin Console</p>
        </div>

        <div
          ref={spotlightRef}
          onMouseMove={handleCardMouseMove}
          className="group relative overflow-hidden rounded-3xl bg-line p-px"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: 'radial-gradient(400px circle at var(--spotlight-x) var(--spotlight-y), var(--color-brand), transparent 70%)',
            }}
          />

          <form
            onSubmit={handleSubmit}
            className="relative rounded-[inherit] bg-surface p-8 shadow-xl"
          >
          <div className="mb-4">
            <label htmlFor="username" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              LDAP Username
            </label>
            <Input
              id="username"
              name="username"
              autoComplete="username"
              placeholder="e.g. sreyleak.p"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="mb-2">
            <label htmlFor="password" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                className="pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-ink-muted hover:text-ink"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="mb-4 rounded-md bg-rejected-surface px-4 py-2 text-sm text-rejected">{error}</p>
          )}

          <Button type="submit" disabled={submitting} className="mt-4 w-full uppercase">
            {submitting ? 'Signing in…' : 'Sign In'}
          </Button>

          <p className="mt-4 text-center text-xs text-ink-muted">
            Authenticated against the company LDAP directory. Contact IT if your account is locked.
          </p>
          </form>
        </div>
      </div>
    </div>
  )
}
