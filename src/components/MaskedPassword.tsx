import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Check } from '@/components/animate-ui/icons/check'
import { Copy } from '@/components/animate-ui/icons/copy'

export function MaskedPassword({ value }: { value: string }) {
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="inline-flex items-center gap-1.5 rounded-md border border-line-field bg-surface-subtle px-2 py-1 font-mono text-[13px] text-ink">
      <span className="min-w-[7ch]">{revealed ? value : '•'.repeat(Math.min(value.length, 10))}</span>
      <button
        type="button"
        onClick={() => setRevealed((v) => !v)}
        aria-label={revealed ? 'Hide password' : 'Show password'}
        className="text-ink-muted hover:text-ink"
      >
        {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy password"
        className="text-ink-muted hover:text-ink"
      >
        {copied ? <Check size={14} animate className="text-approved" /> : <Copy size={14} animateOnTap />}
      </button>
    </div>
  )
}
