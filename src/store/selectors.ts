import { RootState } from '@/store';

export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectIsChecked = (state: RootState) => state.auth.checked;
export const selectRedirectPath = (state: RootState) => state.auth.redirectPath;

export const selectUser = (state: RootState) => state.user.user;

export const selectUserBudget = (budgetId: string) => (state: RootState) => {
  if (!state.user.user) return null;

  return state.user.user.budgets.find(({ id }) => id === budgetId) || null;
};

export const selectUserBudgets = () => (state: RootState) => {
  if (!state.user.user) return [];

  return state.user.user.budgets;
};

export const selectUserMoneyBoxes = () => (state: RootState) => {
  if (!state.user.user) return [];

  return state.user.user.moneyBoxes;
};