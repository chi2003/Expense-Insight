import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { Category, Transaction, TimePeriod } from './types';
import { loadCategories, saveCategories, loadTransactions, saveTransactions, getTransactionsForPeriod } from './storage';

interface BudgetContextValue {
  categories: Category[];
  transactions: Transaction[];
  timePeriod: TimePeriod;
  setTimePeriod: (p: TimePeriod) => void;
  isLoading: boolean;
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  getCategoryTotal: (categoryId: string) => number;
}

const BudgetContext = createContext<BudgetContextValue | null>(null);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [cats, txns] = await Promise.all([loadCategories(), loadTransactions()]);
      setCategories(cats);
      setTransactions(txns);
      setIsLoading(false);
    })();
  }, []);

  const addTransaction = useCallback((t: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTxn: Transaction = {
      ...t,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => {
      const updated = [newTxn, ...prev];
      saveTransactions(updated);
      return updated;
    });
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    setCategories((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      saveCategories(updated);
      return updated;
    });
  }, []);

  const getCategoryTotal = useCallback(
    (categoryId: string) => getTransactionsForPeriod(transactions, categoryId, timePeriod),
    [transactions, timePeriod],
  );

  const value = useMemo(
    () => ({
      categories,
      transactions,
      timePeriod,
      setTimePeriod,
      isLoading,
      addTransaction,
      updateCategory,
      getCategoryTotal,
    }),
    [categories, transactions, timePeriod, isLoading, addTransaction, updateCategory, getCategoryTotal],
  );

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
}

export function useBudget() {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error('useBudget must be used within BudgetProvider');
  return ctx;
}
