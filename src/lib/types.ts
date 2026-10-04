export type Category = {
  id: string;
  name: string;
  color: string;
};

export type Expense = {
  id: string;
  categoryId: string;
  amount: number;
  /** Local calendar date, YYYY-MM-DD. */
  date: string;
  note?: string;
};
