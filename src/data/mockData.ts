import type { Transaction } from '../types'

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 1,  name: 'Salary',       date: '2024-03-01', category: 'Income',        type: 'credit', amount: 5200, icon: '💰' },
  { id: 2,  name: 'Freelance',    date: '2024-03-05', category: 'Income',        type: 'credit', amount: 1800, icon: '💻' },
  { id: 3,  name: 'Whole Foods',  date: '2024-03-02', category: 'Food',          type: 'debit',  amount: 148,  icon: '🛒' },
  { id: 4,  name: 'Netflix',      date: '2024-03-03', category: 'Entertainment', type: 'debit',  amount: 17,   icon: '📺' },
  { id: 5,  name: 'Uber',         date: '2024-03-04', category: 'Transport',     type: 'debit',  amount: 34,   icon: '🚗' },
  { id: 6,  name: 'Amazon',       date: '2024-03-06', category: 'Shopping',      type: 'debit',  amount: 212,  icon: '📦' },
  { id: 7,  name: 'Gym',          date: '2024-03-07', category: 'Health',        type: 'debit',  amount: 45,   icon: '🏃' },
  { id: 8,  name: 'Spotify',      date: '2024-03-08', category: 'Entertainment', type: 'debit',  amount: 10,   icon: '🎵' },
  { id: 9,  name: 'Electric',     date: '2024-03-09', category: 'Utilities',     type: 'debit',  amount: 92,   icon: '⚡' },
  { id: 10, name: 'Chipotle',     date: '2024-03-10', category: 'Food',          type: 'debit',  amount: 23,   icon: '🌯' },
  // add 10–15 more for richness
]