import type { Category, Expense } from './types.ts';

export type CategoryTotal = {
  categoryId: string;
  name: string;
  color: string;
  total: number;
  count: number;
};

export type Report = {
  total: number;
  count: number;
  byCategory: CategoryTotal[];
  expenses: Expense[];
};

const UNKNOWN: Pick<Category, 'name' | 'color'> = { name: 'Uncategorized', color: '#9ca3af' };

/** Build a report for expenses with from <= date <= to (ISO strings compare lexically). */
export function buildReport(
  expenses: Expense[],
  categories: Category[],
  from: string,
  to: string,
): Report {
  const inRange = expenses
    .filter((e) => e.date >= from && e.date <= to)
    .sort((a, b) => (a.date === b.date ? b.id.localeCompare(a.id) : b.date.localeCompare(a.date)));

  const map = new Map<string, CategoryTotal>();
  let total = 0;
  for (const e of inRange) {
    total += e.amount;
    let row = map.get(e.categoryId);
    if (!row) {
      const cat = categories.find((c) => c.id === e.categoryId) ?? UNKNOWN;
      row = { categoryId: e.categoryId, name: cat.name, color: cat.color, total: 0, count: 0 };
      map.set(e.categoryId, row);
    }
    row.total += e.amount;
    row.count += 1;
  }

  return {
    total,
    count: inRange.length,
    byCategory: [...map.values()].sort((a, b) => b.total - a.total),
    expenses: inRange,
  };
}

export function formatMoney(n: number): string {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Parse user-typed amount; returns null unless it is a positive finite number. */
export function parseAmount(s: string): number | null {
  const n = Number(s.trim().replace(',', '.'));
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n * 100) / 100;
}
