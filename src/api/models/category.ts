export type TCategoryName =
  'Housing' |
  'Transportation' |
  'Food' |
  'Medical & Healthcare' |
  'Personal Spending' |
  'Entertainment' |
  'Bills' |
  'Other';

export interface ICategory {
  name: TCategoryName;
  id: number;
}

export interface ICreateCategory extends ICategory {
  amount: number | null;
}

export interface ISetCategoryRequest {
  budgetId: string;
  categories: ICreateCategory[];
}
