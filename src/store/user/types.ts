import { IUser } from "@/api/models/user";

export type IUserState = {
  user: null |IUser
};

export const SET_USER = 'SET_USER';

interface SetUser {
  type: typeof SET_USER;
  payload: {
    user: IUser;
  }
}


export type UserActionTypes = SetUser;
