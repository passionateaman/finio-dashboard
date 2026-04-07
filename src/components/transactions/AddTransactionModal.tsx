import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus } from 'lucide-react'
import { useStore } from '../../store/useStore'
import type { Category, TxType } from '../../types'
import Button from '../ui/Button'
import { CAT_ICONS } from '../../lib/utils'

const CATEGORIES: Category[] = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Utilities', 'Income']

interface Props { onClose: () => void }

export default function AddTransactionModal({ onClose }: Props) {
  const { addTransaction } = useStore()

  const [form, setForm] = useState({
    name: '',
    amount: '',
    category: 'Food' as Category,
    type: 'debit' as TxType,
    date: new Date().toISOString().split('T')[0],
  })
  const [errors, setErrors] = useState<Partial<typeof form>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: undefined }))
  }

  const validate = () => {
    const e: Partial<typeof form> = {}
    if (!form.name.trim())             e.name = 'Name is required'
    if (!form.amount || isNaN(+form.amount) || +form.amount <= 0) e.amount = 'Valid amount required'
    if (!form.date)                    e.date = 'Date is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 400)) // simulate async
    addTransaction({
      name: form.name.trim(),
      amount: parseFloat(form.amount),
      category: form.category,
      type: form.type,
      date: form.date,
      icon: CAT_ICONS[form.category] || '💳',
    })
    setLoading(false)
    setSuccess(true)
    setTimeout(onClose, 700)
  }

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-md bg-[#181b26] border border-white/[0.1] rounded-2xl p-6 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[16px] font-semibold text-white tracking-tight">Add Transaction</h2>
              <p className="text-[12px] text-white/40 mt-0.5">Fill in the details below</p>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.1] transition-all">
              <X size={14} />
            </button>
          </div>

          {/* Success state */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-6 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-green-400/15 border border-green-400/30 flex items-center justify-center mb-3">
                  <span className="text-2xl">✓</span>
                </div>
                <div className="text-[14px] font-medium text-white">Transaction added!</div>
                <div className="text-[12px] text-white/40 mt-1">Closing…</div>
              </motion.div>
            )}
          </AnimatePresence>

          {!success && (
            <>
              {/* Form grid */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Field label="Merchant Name" error={errors.name} className="col-span-2">
                  <input
                    value={form.name} onChange={set('name')}
                    placeholder="e.g. Netflix"
                    className={inputCls(!!errors.name)}
                  />
                </Field>

                <Field label="Amount ($)" error={errors.amount}>
                  <input
                    value={form.amount} onChange={set('amount')}
                    type="number" min="0" step="0.01" placeholder="0.00"
                    className={inputCls(!!errors.amount)}
                  />
                </Field>

                <Field label="Date" error={errors.date}>
                  <input
                    value={form.date} onChange={set('date')}
                    type="date"
                    className={inputCls(!!errors.date)}
                  />
                </Field>

                <Field label="Category">
                  <select value={form.category} onChange={set('category')} className={inputCls(false)}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>)}
                  </select>
                </Field>

                <Field label="Type">
                  <select value={form.type} onChange={set('type')} className={inputCls(false)}>
                    <option value="debit">💸 Debit</option>
                    <option value="credit">💰 Credit</option>
                  </select>
                </Field>
              </div>

              {/* Preview pill */}
              {form.name && form.amount && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  className="mb-4 px-3 py-2.5 bg-white/[0.04] border border-white/[0.07] rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 text-[13px]">
                    <span>{CAT_ICONS[form.category]}</span>
                    <span className="text-white font-medium">{form.name}</span>
                    <span className="text-white/30">·</span>
                    <span className="text-white/50 text-[12px]">{form.category}</span>
                  </div>
                  <span className={`font-mono text-[13px] font-medium ${form.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                    {form.type === 'credit' ? '+' : '-'}${parseFloat(form.amount || '0').toLocaleString()}
                  </span>
                </motion.div>
              )}

              {/* Footer */}
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="md" onClick={onClose}>Cancel</Button>
                <Button variant="primary" size="md" loading={loading} icon={<Plus size={14} />} onClick={handleSubmit}>
                  Add Transaction
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// helpers
const inputCls = (hasError: boolean) =>
  `w-full px-3 py-2 bg-white/[0.05] border rounded-lg text-[13px] text-white placeholder:text-white/25 outline-none font-sans
   focus:border-accent transition-colors
   ${hasError ? 'border-red-400/50' : 'border-white/[0.08]'}`

function Field({ label, error, children, className = '' }: {
  label: string; error?: string; children: React.ReactNode; className?: string
}) {
  return (
    <div className={className}>
      <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">{label}</label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-[11px] text-red-400 mt-1">{error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}