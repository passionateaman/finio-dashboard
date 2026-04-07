import { useEffect, useState } from 'react'
import { useStore } from './store/useStore'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import SummaryCards from './components/dashboard/SummaryCards'
import TrendChart from './components/dashboard/TrendChart'
import CategoryBars from './components/dashboard/CategoryBars'
import TransactionTable from './components/transactions/TransactionTable'
import InsightCards from './components/insights/InsightCards'
import CompareChart from './components/insights/CompareChart'
import DonutChart from './components/insights/DonutChart'
import { AnimatePresence, motion } from 'framer-motion'

export default function App() {
  const { isDark } = useStore()
  const [active, setActive] = useState('overview')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const panels: Record<string, React.ReactNode> = {
    overview: (
      <>
        <SummaryCards />
        <div className="grid grid-cols-[1.6fr_1fr] gap-4">
          <TrendChart />
          <CategoryBars />
        </div>
      </>
    ),
    transactions: <TransactionTable />,
    insights: (
      <>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <CompareChart />
          <DonutChart />
        </div>
        <InsightCards />
      </>
    )
  }

  return (
    <div className={`flex min-h-screen ${isDark ? 'bg-[#0d0f14]' : 'bg-gray-50'}`}>
      <Sidebar active={active} setActive={setActive} />
      <div className="flex-1 overflow-x-hidden">
        <Topbar title={{ overview: 'Overview', transactions: 'Transactions', insights: 'Insights' }[active] || ''} />
        <div className="p-7">
          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}>
              {panels[active]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}