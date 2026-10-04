import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Category, Expense } from './types.ts';

const KEY = 'expense-tracker:v1';

export const PALETTE = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#6366f1', '#a855f7', '#ec4899', '#78716c',
];

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'c-food', name: 'Food', color: PALETTE[3] },
  { id: 'c-transport', name: 'Transport', color: PALETTE[5] },
  { id: 'c-bills', name: 'Bills', color: PALETTE[1] },
  { id: 'c-other', name: 'Other', color: PALETTE[9] },
];

type Data = { categories: Category[]; expenses: Expense[] };

type Store = Data & {
  loaded: boolean;
  addCategory: (name: string, color: string) => void;
  updateCategory: (id: string, name: string, color: string) => void;
  /** Fails (returns false) while expenses still use the category. */
  deleteCategory: (id: string) => boolean;
  addExpense: (e: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
};

const Ctx = createContext<Store | null>(null);

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Data>({ categories: DEFAULT_CATEGORIES, expenses: [] });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) setData(JSON.parse(raw) as Data);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(KEY, JSON.stringify(data)).catch(() => {});
  }, [data, loaded]);

  const addCategory = useCallback((name: string, color: string) => {
    setData((d) => ({ ...d, categories: [...d.categories, { id: uid(), name: name.trim(), color }] }));
  }, []);

  const updateCategory = useCallback((id: string, name: string, color: string) => {
    setData((d) => ({
      ...d,
      categories: d.categories.map((c) => (c.id === id ? { ...c, name: name.trim(), color } : c)),
    }));
  }, []);

  const deleteCategory = useCallback(
    (id: string) => {
      if (data.expenses.some((e) => e.categoryId === id)) return false;
      setData((d) => ({ ...d, categories: d.categories.filter((c) => c.id !== id) }));
      return true;
    },
    [data.expenses],
  );

  const addExpense = useCallback((e: Omit<Expense, 'id'>) => {
    setData((d) => ({ ...d, expenses: [...d.expenses, { ...e, id: uid() }] }));
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setData((d) => ({ ...d, expenses: d.expenses.filter((e) => e.id !== id) }));
  }, []);

  const value = useMemo(
    () => ({ ...data, loaded, addCategory, updateCategory, deleteCategory, addExpense, deleteExpense }),
    [data, loaded, addCategory, updateCategory, deleteCategory, addExpense, deleteExpense],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be used inside StoreProvider');
  return s;
}
