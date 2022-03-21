import { instance } from './instance';
import { ICategory, IIncrementCategory, ISetCategoryRequest } from './models/category';
import { IBudget } from './models/user';

export const getCategories = () => {
  return instance.get<ICategory[]>('/category/get-all');
};

export const setCategories = (data: ISetCategoryRequest) => {
  return instance.post<IBudget>('/category/set-new', data);
};

export const incrementCategory = (data: IIncrementCategory) => {
  return instance.patch<IBudget>('/category/increment', data);
};

export const decrementCategory = (data: IIncrementCategory) => {
  return instance.patch<IBudget>('/category/decrement', data);
};
