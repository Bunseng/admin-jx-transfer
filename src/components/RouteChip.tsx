import { ArrowRight } from '@/components/animate-ui/icons/arrow-right'

export function RouteChip({ from, to }: { from: string; to: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line-field bg-surface-subtle px-2.5 py-1 text-xs font-medium text-ink">
      <span>{from}</span>
      <ArrowRight size={12} animateOnHover className="shrink-0 text-brand" />
      <span>{to}</span>
    </span>
  )
}
