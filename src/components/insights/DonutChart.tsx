import { useStore } from '../../store/useStore'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { CAT_COLORS } from '../../lib/utils'
import { fmt } from '../../lib/utils'
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div className="bg-[#1e2130] border border-white/[0.1] rounded-xl px-3 py-2 text-[12px] shadow-xl">
      <span className="text-white/50">{name}: </span>
      <span className="text-white font-mono font-medium">{fmt(value)}</span>
    </div>
  )
}

export default function DonutChart() {
  const { transactions } = useStore()

  const catTotals: Record<string, number> = {}
  transactions.filter(t => t.type === 'debit').forEach(t => {
    catTotals[t.category] = (catTotals[t.category] || 0) + t.amount
  })
  const total = Object.values(catTotals).reduce((s, v) => s + v, 0)
  const data = Object.entries(catTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }))

  return (
    <div className="bg-surface border border-white/[0.07] rounded-2xl p-5">
      <div className="mb-4">
        <div className="text-[14px] font-medium text-white">Category Breakdown</div>
        <div className="text-[12px] text-white/40 mt-0.5">Spending distribution</div>
      </div>

      <div className="flex items-center gap-4">
        <div style={{ width: 140, height: 140, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data} cx="50%" cy="50%"
                innerRadius={42} outerRadius={62}
                paddingAngle={2} dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={CAT_COLORS[entry.name] || '#6c7fff'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-2">
          {data.map(({ name, value }) => (
            <div key={name} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: CAT_COLORS[name] || '#6c7fff' }} />
              <span className="text-[12px] text-white/50 flex-1 truncate">{name}</span>
              <span className="text-[11px] font-mono text-white/40">
                {total > 0 ? ((value / total) * 100).toFixed(0) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}