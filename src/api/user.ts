import { instance } from './instance';
import { IBudget, ICreateBudgetRequest, IUser } from './models/user';

export const getUser = () => {
  return instance.get<IUser>('/user/get-user');
};

export const setBudget = (data: ICreateBudgetRequest) => {
  return instance.post<IBudget>('/user/budget', data);
};
