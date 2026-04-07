import { motion } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { fmt, CAT_COLORS } from '../../lib/utils'
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Zap, PiggyBank } from 'lucide-react'

interface InsightItem {
  label: string
  value: string
  desc: string
  progress?: number
  progressColor?: string
  icon: React.ReactNode
  accent: string
  status: 'good' | 'warn' | 'info'
}

export default function InsightCards() {
  const { transactions } = useStore()

  const income  = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0)
  const expense = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0)
  const balance = income - expense

  const catTotals: Record<string, number> = {}
  transactions.filter(t => t.type === 'debit').forEach(t => {
    catTotals[t.category] = (catTotals[t.category] || 0) + t.amount
  })
  const sorted = Object.entries(catTotals).sort((a, b) => b[1] - a[1])
  const topCat = sorted[0] ?? ['N/A', 0]
  const savingsRate = income > 0 ? ((balance / income) * 100) : 0
  const expenseRatio = income > 0 ? ((expense / income) * 100).toFixed(1) : '0'

  const insights: InsightItem[] = [
    {
      label: 'Top Spending Category',
      value: topCat[0],
      desc: `${fmt(topCat[1])} spent — ${income > 0 ? (topCat[1] / income * 100).toFixed(1) : 0}% of income`,
      progress: income > 0 ? Math.min((topCat[1] / income) * 100, 100) : 0,
      progressColor: CAT_COLORS[topCat[0]] || '#6c7fff',
      icon: <Zap size={15} />,
      accent: CAT_COLORS[topCat[0]] || '#6c7fff',
      status: topCat[1] / income > 0.3 ? 'warn' : 'good',
    },
    {
      label: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      desc: savingsRate >= 20 ? 'Healthy — above the 20% benchmark' : 'Below recommended 20% target',
      progress: Math.min(savingsRate, 100),
      progressColor: savingsRate >= 20 ? '#34d399' : '#fbbf24',
      icon: <PiggyBank size={15} />,
      accent: savingsRate >= 20 ? '#34d399' : '#fbbf24',
      status: savingsRate >= 20 ? 'good' : 'warn',
    },
    {
      label: 'Net Cash Flow',
      value: fmt(Math.abs(balance)),
      desc: balance >= 0 ? 'Positive — you earned more than you spent' : 'Negative — spending exceeds income',
      icon: balance >= 0 ? <TrendingUp size={15} /> : <TrendingDown size={15} />,
      accent: balance >= 0 ? '#34d399' : '#f87171',
      status: balance >= 0 ? 'good' : 'warn',
    },
    {
      label: 'Expense-to-Income Ratio',
      value: `${expenseRatio}%`,
      desc: parseFloat(expenseRatio) < 80 ? 'Well within healthy range' : 'High — consider cutting discretionary spend',
      progress: Math.min(parseFloat(expenseRatio), 100),
      progressColor: parseFloat(expenseRatio) < 80 ? '#6c7fff' : '#f87171',
      icon: parseFloat(expenseRatio) < 80 ? <CheckCircle size={15} /> : <AlertTriangle size={15} />,
      accent: parseFloat(expenseRatio) < 80 ? '#6c7fff' : '#f87171',
      status: parseFloat(expenseRatio) < 80 ? 'info' : 'warn',
    },
    {
      label: 'Total Transactions',
      value: `${transactions.length}`,
      desc: `${transactions.filter(t => t.type === 'debit').length} expenses · ${transactions.filter(t => t.type === 'credit').length} income entries`,
      icon: <CheckCircle size={15} />,
      accent: '#6c7fff',
      status: 'info',
    },
    {
      label: 'Largest Single Expense',
      value: fmt(Math.max(...transactions.filter(t => t.type === 'debit').map(t => t.amount), 0)),
      desc: (() => {
        const largest = transactions.filter(t => t.type === 'debit').sort((a, b) => b.amount - a.amount)[0]
        return largest ? `${largest.name} · ${largest.date}` : 'No expenses yet'
      })(),
      icon: <AlertTriangle size={15} />,
      accent: '#fb923c',
      status: 'info',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 mt-2">
      {insights.map((ins, i) => (
        <motion.div
          key={ins.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          whileHover={{ y: -2 }}
          className="bg-surface border border-white/[0.07] rounded-2xl p-4 hover:border-white/[0.14] transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-white/40">{ins.label}</span>
            <span style={{ color: ins.accent }} className="opacity-80">{ins.icon}</span>
          </div>

          <div className="font-mono text-[20px] font-semibold tracking-tight" style={{ color: ins.accent }}>
            {ins.value}
          </div>

          <div className="text-[12px] text-white/40 mt-1">{ins.desc}</div>

          {ins.progress !== undefined && (
            <div className="mt-3 h-[3px] bg-white/[0.07] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${ins.progress}%` }}
                transition={{ delay: i * 0.06 + 0.2, duration: 0.6, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: ins.progressColor }}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}