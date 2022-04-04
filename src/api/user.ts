import { instance } from './instance';
import { IBudget, ICreateBudgetRequest, ICreateMoneyBoxRequest, IMoneyBox, IRemoveUserFromBudgetRequest, IShareBudgetRequest, IUser } from './models/user';

export const getUser = () => {
  return instance.get<IUser>('/user/get-user');
};

export const setBudget = (data: ICreateBudgetRequest) => {
  return instance.post<IBudget>('/user/budget', data);
};

export const addMoneyBox = (data: ICreateMoneyBoxRequest) => {
  return instance.post<IMoneyBox>('/user/add-money-box', data);
};

export const shareBudget = (data: IShareBudgetRequest) => {
  if (!data.message) {
    data.message = '';
  }

  return instance.post<IBudget>('/user/share-budget', data);
};

export const shareBox = (data: IShareBudgetRequest) => {
  if (!data.message) {
    data.message = '';
  }

  return instance.post<IMoneyBox>('/user/share-money-box', data);
};

export const updateBudget = (budget: Partial<IBudget> & { id: string }) => {
  return instance.patch<IBudget>(`/user/update-budget/`, budget);
};

export const updateBox = (budget: Partial<IMoneyBox> & { id: string }) => {
  return instance.patch<IMoneyBox>(`/user/update-box/`, budget);
};

export const editBudgetAmountById = (id: string, amount: number) => {
  return instance.patch<IBudget>(`/user/budget/`, { id, amount });
};

export const deleteUserFromBudget = (data: IRemoveUserFromBudgetRequest) => {
  return instance.patch<IBudget>(`/user/remove-from-budget/`, data);
};

export const deleteUserFromBox = (data: IRemoveUserFromBudgetRequest) => {
  return instance.patch<IBudget>(`/user/remove-from-box/`, data);
};

export const deleteBudget = (id: string) => {
  return instance.delete<{ id: string }>(`/user/budget/${id}`);
};

export const deleteBox = (id: string) => {
  return instance.delete<{ id: string }>(`/user/delete-money-box/${id}`);
};