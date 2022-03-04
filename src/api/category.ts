import { instance } from './instance';
import { ICategory, ISetCategoryRequest } from './models/category';
import { IBudget } from './models/user';

export const getCategories = () => {
  return instance.get<ICategory[]>('/category/get-all');
};

export const setCategories = (data: ISetCategoryRequest) => {
  return instance.post<IBudget>('/category/set-new', data);
};
