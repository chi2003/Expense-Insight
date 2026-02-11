import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category, Transaction, DEFAULT_CATEGORIES } from './types';

const CATEGORIES_KEY = '@spendwise_categories';
const TRANSACTIONS_KEY = '@spendwise_transactions';

export async function loadCategories(): Promise<Category[]> {
  try {
    const data = await AsyncStorage.getItem(CATEGORIES_KEY);
    if (data) return JSON.parse(data);
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export async function saveCategories(categories: Category[]): Promise<void> {
  await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

export async function loadTransactions(): Promise<Transaction[]> {
  try {
    const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    if (data) return JSON.parse(data);
    return [];
  } catch {
    return [];
  }
}

export async function saveTransactions(transactions: Transaction[]): Promise<void> {
  await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}

export function getTransactionsForPeriod(
  transactions: Transaction[],
  categoryId: string,
  period: 'week' | 'month' | 'year',
): number {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case 'week': {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    }
    case 'month': {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    }
    case 'year': {
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    }
  }

  return transactions
    .filter((t) => {
      const tDate = new Date(t.date);
      return t.categoryId === categoryId && tDate >= startDate && tDate <= now;
    })
    .reduce((sum, t) => sum + t.amount, 0);
}
