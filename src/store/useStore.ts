import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Transaction, Role, Category } from '../types'
import { MOCK_TRANSACTIONS } from '../data/mockData'

interface AppState {
  transactions: Transaction[]
  role: Role
  filter: Category | 'All'
  sortKey: keyof Transaction
  sortDir: 1 | -1
  isDark: boolean
  nextId: number
  setRole: (role: Role) => void
  setFilter: (f: Category | 'All') => void
  setSort: (key: keyof Transaction) => void
  toggleTheme: () => void
  addTransaction: (tx: Omit<Transaction, 'id'>) => void
  deleteTransaction: (id: number) => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      transactions: MOCK_TRANSACTIONS,
      role: 'viewer',
      filter: 'All',
      sortKey: 'date',
      sortDir: -1,
      isDark: true,
      nextId: 100,

      setRole: (role) => set({ role }),
      setFilter: (filter) => set({ filter }),
      setSort: (key) => set((s) => ({
        sortKey: key,
        sortDir: s.sortKey === key ? (s.sortDir === 1 ? -1 : 1) : -1
      })),
      toggleTheme: () => set((s) => ({ isDark: !s.isDark })),
      addTransaction: (tx) => set((s) => ({
        transactions: [{ ...tx, id: s.nextId }, ...s.transactions],
        nextId: s.nextId + 1
      })),
      deleteTransaction: (id) => set((s) => ({
        transactions: s.transactions.filter(t => t.id !== id)
      })),
    }),
    { name: 'finio-store' }
  )
)