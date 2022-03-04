import { IBudget, IUser } from "@/api/models/user";

export type IUserState = {
  user: null |IUser
};

export const SET_USER = 'SET_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const ADD_BUDGET = 'ADD_BUDGET';
export const UPDATE_BUDGET = 'UPDATE_BUDGET';

interface SetUser {
  type: typeof SET_USER;
  payload: {
    user: IUser;
  }
}

interface UpdateUser {
  type: typeof UPDATE_USER;
  payload: Partial<IUser>
}

interface AddBudget {
  type: typeof ADD_BUDGET;
  payload: {
    budget: IBudget;
  }
}

interface UpdateBudget {
  type: typeof UPDATE_BUDGET;
  payload: Partial<IBudget>
}


export type UserActionTypes = SetUser | AddBudget | UpdateBudget | UpdateUser;
