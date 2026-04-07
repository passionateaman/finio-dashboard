import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { fmt } from '../../lib/utils'
import AddTransactionModal from './AddTransactionModal'

export default function TransactionTable() {
  const { transactions, role, filter, sortKey, sortDir, setFilter, setSort, deleteTransaction } = useStore()
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const isAdmin = role === 'admin'

  const categories = ['All', ...new Set(transactions.map(t => t.category))]

  let filtered = [...transactions]
  if (filter !== 'All') filtered = filtered.filter(t => t.category === filter)
  if (search) filtered = filtered.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  )
  filtered.sort((a, b) => {
    const av = a[sortKey as keyof typeof a] as string | number
    const bv = b[sortKey as keyof typeof b] as string | number
    if (typeof av === 'number') return (av - (bv as number)) * sortDir
    return String(av).localeCompare(String(bv)) * sortDir
  })

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-white">All Transactions</h2>
        <div className="flex items-center gap-2">
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search…"
            className="bg-white/[0.05] border border-white/[0.07] rounded-lg px-3 py-2 text-[13px] text-white placeholder:text-white/30 outline-none focus:border-accent w-44"
          />
          {isAdmin && (
            <motion.button whileHover={{ y: -1 }} onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg text-[13px] font-medium shadow-[0_0_20px_rgba(108,127,255,0.3)]">
              + Add
            </motion.button>
          )}
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap mb-4">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat as any)}
            className={`px-3 py-1.5 rounded-full text-[12px] border transition-all
              ${filter === cat
                ? 'bg-accent/15 border-accent/40 text-accent'
                : 'bg-white/[0.04] border-white/[0.07] text-white/50 hover:text-white/80'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-surface border border-white/[0.07] rounded-2xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['name','date','category','type','amount'].map(k => (
                <th key={k} onClick={() => setSort(k as any)}
                  className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-white/30 border-b border-white/[0.07] cursor-pointer hover:text-white/60">
                  {k} {sortKey === k ? (sortDir === -1 ? '↓' : '↑') : ''}
                </th>
              ))}
              {isAdmin && <th className="px-4 py-3 text-[11px] text-white/30 border-b border-white/[0.07]">Actions</th>}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((t, i) => (
                <motion.tr key={t.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="hover:bg-white/[0.02] transition-colors border-b border-white/[0.05] last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{t.icon}</span>
                      <span className="text-[13px] font-medium text-white">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px] font-mono text-white/50">{t.date}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-md text-[11px] bg-accent/10 text-accent">{t.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-medium
                      ${t.type === 'credit' ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className={`px-4 py-3 font-mono text-[13px] font-medium ${t.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                    {t.type === 'credit' ? '+' : '-'}{fmt(t.amount)}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3">
                      <button onClick={() => deleteTransaction(t.id)}
                        className="px-2.5 py-1 rounded-md border border-white/[0.07] text-[11px] text-white/40 hover:border-red-400/50 hover:text-red-400 transition-all">
                        Delete
                      </button>
                    </td>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-white/30 text-[13px]">No transactions found</div>
        )}
      </div>

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>
  )
}