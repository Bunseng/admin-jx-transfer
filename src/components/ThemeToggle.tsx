import { Moon } from '@/components/animate-ui/icons/moon'
import { Sun } from '@/components/animate-ui/icons/sun'
import { useTheme } from '../lib/theme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex h-9 w-9 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink"
    >
      {theme === 'dark' ? <Sun size={17} animateOnHover /> : <Moon size={17} animateOnHover />}
    </button>
  )
}
