import { instance } from './instance';
import { ICategory } from './models/category';

export const getCategories = () => {
  return instance.get<ICategory[]>('/category/get-all');
};

