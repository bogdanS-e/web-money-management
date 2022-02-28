import { IBudget, IUser } from "@/api/models/user";

export type IUserState = {
  user: null |IUser
};

export const SET_USER = 'SET_USER';
export const ADD_BUDGET = 'ADD_BUDGET';

interface SetUser {
  type: typeof SET_USER;
  payload: {
    user: IUser;
  }
}

interface AddBudget {
  type: typeof ADD_BUDGET;
  payload: {
    budget: IBudget;
  }
}


export type UserActionTypes = SetUser | AddBudget;
