
import { Category, TransactionType } from './types';

export const INCOME_CATEGORIES: Category[] = [
  { id: 'cat_inc_1', name: 'Salary', type: TransactionType.INCOME },
  { id: 'cat_inc_2', name: 'Freelance', type: TransactionType.INCOME },
  { id: 'cat_inc_3', name: 'Investment Gains', type: TransactionType.INCOME },
  { id: 'cat_inc_4', name: 'Other', type: TransactionType.INCOME },
];

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'cat_exp_1', name: 'Housing', type: TransactionType.EXPENSE },
  { id: 'cat_exp_2', name: 'Transport', type: TransactionType.EXPENSE },
  { id: 'cat_exp_3', name: 'Food & Groceries', type: TransactionType.EXPENSE },
  { id: 'cat_exp_4', name: 'Utilities', type: TransactionType.EXPENSE },
  { id: 'cat_exp_5', name: 'Entertainment', type: TransactionType.EXPENSE },
  { id: 'cat_exp_6', name: 'Health', type: TransactionType.EXPENSE },
  { id: 'cat_exp_7', name: 'Investment', type: TransactionType.EXPENSE },
  { id: 'cat_exp_8', name: 'Goal Contributions', type: TransactionType.EXPENSE },
  { id: 'cat_exp_9', name: 'Other', type: TransactionType.EXPENSE },
];

export const ALL_CATEGORIES: Category[] = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

export const CATEGORY_MAP: Map<string, Category> = new Map(
  ALL_CATEGORIES.map(cat => [cat.id, cat])
);
