import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Transaction, Goal } from '../types';
import { CATEGORY_MAP } from '../constants';

interface FinanceContextType {
  transactions: Transaction[];
  goals: Goal[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'currentAmount'>) => Promise<void>;
  getCategoryName: (id: string) => string;
  loading: boolean;
  error: string | null;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:4000/api';

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    // Don't set loading to true on refetch, only on initial load.
    // setLoading(true); 
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/data`);
      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || 'Failed to fetch data from the server.');
      }
      const data = await response.json();
      setTransactions(data.transactions || []);
      setGoals(data.goals || []);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || 'Failed to add transaction.');
      }
      // Data has changed, refetch to get updated goal progress and transaction list
      await fetchData();
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to add transaction.');
      // Re-throw so the form can catch it
      throw e;
    }
  };

  const addGoal = async (goal: Omit<Goal, 'id' | 'currentAmount'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goal),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || 'Failed to add goal.');
      }
      // Data has changed, refetch
      await fetchData();
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to add goal.');
      // Re-throw
      throw e;
    }
  };
  
  const getCategoryName = (id: string): string => {
    return CATEGORY_MAP.get(id)?.name || 'Unknown';
  };

  const value = {
    transactions,
    goals,
    addTransaction,
    addGoal,
    getCategoryName,
    loading,
    error,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
