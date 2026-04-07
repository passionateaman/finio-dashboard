import { Sun, Moon } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { motion } from 'framer-motion'

export default function Topbar({ title }: { title: string }) {
  const { isDark, toggleTheme } = useStore()

  const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="flex items-center justify-between px-7 py-4 border-b border-white/[0.07] bg-surface sticky top-0 z-10">
      <motion.div
        key={title}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-[17px] font-semibold text-white tracking-tight"
      >
        {title}
      </motion.div>

      <div className="flex items-center gap-3">
        <span className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.07] rounded-full text-[12px] text-white/40 font-mono">
          {now}
        </span>

        <button onClick={toggleTheme}
          className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all">
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-violet-500 flex items-center justify-center text-[12px] font-semibold text-white shadow-[0_0_12px_rgba(108,127,255,0.3)]">
          AK
        </div>
      </div>
    </div>
  )
}