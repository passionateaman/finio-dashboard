export type Role = 'viewer' | 'admin'
export type TxType = 'credit' | 'debit'
export type Category = 'Food' | 'Transport' | 'Shopping' | 'Entertainment' | 'Health' | 'Utilities' | 'Income'

export interface Transaction {
  id: number
  name: string
  date: string
  category: Category
  type: TxType
  amount: number
  icon: string
}