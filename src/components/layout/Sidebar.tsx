import { LayoutDashboard, ArrowLeftRight, Lightbulb } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { motion } from 'framer-motion'

const navItems = [
  { id: 'overview',     label: 'Overview',      Icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions',  Icon: ArrowLeftRight },
  { id: 'insights',     label: 'Insights',      Icon: Lightbulb },
]

export default function Sidebar({ active, setActive }: { active: string; setActive: (s: string) => void }) {
  const { role, setRole } = useStore()
  const isAdmin = role === 'admin'

  return (
    <aside className="w-[220px] bg-surface flex flex-col h-screen sticky top-0 border-r border-white/[0.07]">
      <div className="px-5 py-6 border-b border-white/[0.07]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-violet-500 flex items-center justify-center text-base shadow-[0_0_20px_rgba(108,127,255,0.35)]">
            💎
          </div>
          <div>
            <div className="font-semibold text-[15px] tracking-tight text-white">Finio</div>
            <div className="text-[11px] text-white/30">Finance Dashboard</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map(({ id, label, Icon }) => (
          <motion.div
            key={id}
            whileHover={{ x: 2 }}
            onClick={() => setActive(id)}
            className={`flex items-center gap-3 px-5 py-[10px] cursor-pointer relative text-[13.5px] transition-colors
              ${active === id ? 'text-accent' : 'text-white/50 hover:text-white/80'}`}
          >
            {active === id && (
              <motion.div layoutId="nav-indicator"
                className="absolute left-0 top-2 bottom-2 w-[3px] bg-accent rounded-r-full" />
            )}
            <Icon size={16} />
            <span>{label}</span>
          </motion.div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/[0.07]">
        <div className="flex items-center justify-between p-3 bg-white/[0.04] rounded-xl border border-white/[0.07]">
          <div>
            <div className="text-[12px] font-medium text-white">{isAdmin ? 'Admin' : 'Viewer'}</div>
            <div className="text-[10px] text-white/30 mt-0.5">{isAdmin ? 'Full access' : 'Read only'}</div>
          </div>
          <div
            onClick={() => setRole(isAdmin ? 'viewer' : 'admin')}
            className={`w-9 h-5 rounded-full cursor-pointer relative transition-all duration-200
              ${isAdmin ? 'bg-accent shadow-[0_0_10px_rgba(108,127,255,0.5)]' : 'bg-white/20'}`}
          >
            <motion.div
              animate={{ x: isAdmin ? 16 : 2 }}
              className="absolute top-[3px] w-[14px] h-[14px] bg-white rounded-full"
            />
          </div>
        </div>
      </div>
    </aside>
  )
}