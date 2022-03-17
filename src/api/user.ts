import { instance } from './instance';
import { IBudget, ICreateBudgetRequest, IRemoveUserFromBudgetRequest, IShareBudgetRequest, IUser } from './models/user';

export const getUser = () => {
  return instance.get<IUser>('/user/get-user');
};

export const setBudget = (data: ICreateBudgetRequest) => {
  return instance.post<IBudget>('/user/budget', data);
};

export const shareBudget = (data: IShareBudgetRequest) => {
  if (!data.message) {
    data.message = '';
  }  

  return instance.post<IBudget>('/user/share-budget', data);
};

export const updateBudget = (budget: Partial<IBudget> & {id: string}) => {
  return instance.patch<IBudget>(`/user/update-budget/`, budget);
};

export const editBudgetAmountById = (id: string, amount: number) => {
  return instance.patch<IBudget>(`/user/budget/`, { id, amount });
};

export const deleteUserFromBudget = (data: IRemoveUserFromBudgetRequest) => {
  return instance.patch<IBudget>(`/user/remove-from-budget/`, data);
};