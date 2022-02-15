import { instance } from './instance';
import { IUser } from './models/user';

export const getUser = () => {
  return instance.get<IUser>('/user/get-user');
};
