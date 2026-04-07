import { useStore } from '../../store/useStore'
import { fmt } from '../../lib/utils'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const MONTHS = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
const SEED_INCOME   = [4200, 4800, 5100, 4600, 5800, 5200, 0]
const SEED_EXPENSES = [3100, 3400, 3200, 3800, 3600, 3900, 0]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1e2130] border border-white/[0.1] rounded-xl px-4 py-3 text-[12px] shadow-xl">
      <div className="text-white/50 mb-2 font-medium">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-sm" style={{ background: p.fill }} />
          <span className="text-white/60">{p.name}:</span>
          <span className="text-white font-mono font-medium">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function CompareChart() {
  const { transactions } = useStore()

  const income  = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0)
  const expense = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0)

  const data = MONTHS.map((month, i) => ({
    month,
    Income:   i === MONTHS.length - 1 ? income   : SEED_INCOME[i],
    Expenses: i === MONTHS.length - 1 ? expense  : SEED_EXPENSES[i],
  }))

  return (
    <div className="bg-surface border border-white/[0.07] rounded-2xl p-5">
      <div className="mb-4">
        <div className="text-[14px] font-medium text-white">Monthly Comparison</div>
        <div className="text-[12px] text-white/40 mt-0.5">Income vs Expenses — last 7 months</div>
      </div>

      {/* Custom legend */}
      <div className="flex gap-4 mb-4">
        {[{ label: 'Income', color: '#34d399' }, { label: 'Expenses', color: '#f87171' }].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
            <span className="text-[12px] text-white/40">{l.label}</span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barCategoryGap="28%" barGap={3}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
            axisLine={false} tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="Income"   fill="#34d399" radius={[3, 3, 0, 0]} />
          <Bar dataKey="Expenses" fill="#f87171" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}