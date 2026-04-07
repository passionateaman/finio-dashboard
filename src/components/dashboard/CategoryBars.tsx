import { motion } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { fmt, CAT_COLORS } from '../../lib/utils'

export default function CategoryBars() {
  const { transactions } = useStore()

  const catTotals: Record<string, number> = {}
  transactions.filter(t => t.type === 'debit').forEach(t => {
    catTotals[t.category] = (catTotals[t.category] || 0) + t.amount
  })
  const sorted = Object.entries(catTotals).sort((a, b) => b[1] - a[1])
  const max = sorted[0]?.[1] || 1

  return (
    <div className="bg-surface border border-white/[0.07] rounded-2xl p-5">
      <div className="mb-4">
        <div className="text-[14px] font-medium text-white">Spending by Category</div>
        <div className="text-[12px] text-white/40 mt-0.5">This month</div>
      </div>

      <div className="space-y-3">
        {sorted.map(([cat, amt], i) => (
          <div key={cat} className="flex items-center gap-3">
            <span className="text-[12px] text-white/40 w-[72px] flex-shrink-0 truncate">{cat}</span>
            <div className="flex-1 h-[5px] bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: CAT_COLORS[cat] || '#6c7fff' }}
                initial={{ width: 0 }}
                animate={{ width: `${(amt / max) * 100}%` }}
                transition={{ delay: i * 0.05 + 0.1, duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <span className="text-[12px] font-mono text-white/40 w-[54px] text-right flex-shrink-0">{fmt(amt)}</span>
          </div>
        ))}
        {sorted.length === 0 && (
          <p className="text-[13px] text-white/25 text-center py-6">No expense data yet</p>
        )}
      </div>
    </div>
  )
}