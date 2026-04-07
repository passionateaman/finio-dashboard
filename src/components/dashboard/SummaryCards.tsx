import { motion } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { fmt } from '../../lib/utils'

export default function SummaryCards() {
  const { transactions } = useStore()
  const income  = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0)
  const expense = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0)
  const balance = income - expense
  const savingsRate = income > 0 ? ((balance / income) * 100).toFixed(1) : '0'

  const cards = [
    { label: 'Total Balance', value: fmt(balance), change: `▲ ${savingsRate}% savings`, color: 'blue', icon: '💼' },
    { label: 'Monthly Income', value: fmt(income), change: '▲ 12.4% vs last month', color: 'green', icon: '↑' },
    { label: 'Monthly Expenses', value: fmt(expense), change: `▼ ${income > 0 ? (expense/income*100).toFixed(1) : 0}% of income`, color: 'red', icon: '↓' },
  ]

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          whileHover={{ y: -2 }}
          className="bg-surface border border-white/[0.07] rounded-2xl p-5 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase tracking-wider text-white/40">{c.label}</span>
            <span className="text-base">{c.icon}</span>
          </div>
          <div className="font-mono text-[26px] font-semibold tracking-tight text-white">{c.value}</div>
          <div className={`text-[12px] mt-1.5 ${c.color === 'red' ? 'text-red-400' : 'text-green-400'}`}>
            {c.change}
          </div>
        </motion.div>
      ))}
    </div>
  )
}