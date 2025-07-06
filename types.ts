
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export interface Split {
  categoryId: string;
  amount: number;
}

export interface Transaction {
  id: string;
  date: string; // ISO string
  description: string;
  totalAmount: number;
  type: TransactionType;
  splits: Split[];
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  targetDate: string; // ISO string
  currentAmount: number;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
}

export type View = 'dashboard' | 'transactions' | 'goals';
