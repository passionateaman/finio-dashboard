import { CAT_COLORS } from '../../lib/utils'

type Variant = 'category' | 'type' | 'status'

interface BadgeProps {
  label: string
  variant?: Variant
}

const typeStyles: Record<string, string> = {
  credit: 'bg-green-400/10 text-green-400 border-green-400/20',
  debit:  'bg-red-400/10 text-red-400 border-red-400/20',
}

export default function Badge({ label, variant = 'category' }: BadgeProps) {
  if (variant === 'type') {
    return (
      <span className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-medium border ${typeStyles[label] ?? 'bg-white/10 text-white/60 border-white/10'}`}>
        {label}
      </span>
    )
  }

  if (variant === 'category') {
    const color = CAT_COLORS[label]
    return (
      <span
        className="px-2 py-0.5 rounded-md text-[11px] font-medium border"
        style={{
          background: color ? `${color}18` : 'rgba(108,127,255,0.1)',
          color: color || '#6c7fff',
          borderColor: color ? `${color}30` : 'rgba(108,127,255,0.2)',
        }}
      >
        {label}
      </span>
    )
  }

  return (
    <span className="px-2 py-0.5 rounded-md text-[11px] bg-white/[0.06] text-white/50 border border-white/10">
      {label}
    </span>
  )
}