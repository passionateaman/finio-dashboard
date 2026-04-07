import { useStore } from '../../store/useStore'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { useState } from 'react'
import { fmt } from '../../lib/utils'

const MONTHS_7  = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
const SEED_BAL7 = [3200, 4100, 3600, 5200, 4800, 5900, 0]
const MONTHS_12 = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
const SEED_BAL12 = [2100, 2800, 3100, 2600, 3400, 3200, 4100, 3600, 5200, 4800, 5900, 0]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1e2130] border border-white/[0.1] rounded-xl px-3 py-2.5 text-[12px] shadow-xl">
      <div className="text-white/40 mb-1">{label}</div>
      <div className="text-white font-mono font-medium">{fmt(payload[0].value)}</div>
    </div>
  )
}

export default function TrendChart() {
  const { transactions } = useStore()
  const [period, setPeriod] = useState<'7M' | '1Y'>('7M')

  const balance = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0)
    - transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0)

  const months = period === '7M' ? MONTHS_7  : MONTHS_12
  const seeds  = period === '7M' ? SEED_BAL7 : SEED_BAL12

  const data = months.map((month, i) => ({
    month,
    Balance: i === months.length - 1 ? balance : seeds[i],
  }))

  return (
    <div className="bg-surface border border-white/[0.07] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[14px] font-medium text-white">Balance Trend</div>
          <div className="text-[12px] text-white/40 mt-0.5">Last {period === '7M' ? '7 months' : '12 months'}</div>
        </div>
        <div className="flex gap-1 bg-white/[0.04] p-1 rounded-lg border border-white/[0.07]">
          {(['7M', '1Y'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all
                ${period === p ? 'bg-accent/20 text-accent' : 'text-white/40 hover:text-white/60'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#6c7fff" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#6c7fff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
            axisLine={false} tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone" dataKey="Balance"
            stroke="#6c7fff" strokeWidth={2}
            fill="url(#balGrad)"
            dot={{ fill: '#6c7fff', strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: '#6c7fff', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}