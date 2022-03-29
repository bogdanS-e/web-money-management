import { IBudget, IMoneyBox, IUser } from "@/api/models/user";

export type IUserState = {
  user: null |IUser
};

export const SET_USER = 'SET_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const ADD_BUDGET = 'ADD_BUDGET';
export const DELETE_BUDGET = 'DELETE_BUDGET';
export const ADD_MMONEY_BOX = 'ADD_MMONEY_BOX';
export const UPDATE_BUDGET = 'UPDATE_BUDGET';
export const DELETE_MONEY_BOX = 'DELETE_MONEY_BOX';
export const UPDATE_BOX = 'UPDATE_BOX';


interface SetUser {
  type: typeof SET_USER;
  payload: {
    user: IUser | null;
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

interface AddMoneyBox {
  type: typeof ADD_MMONEY_BOX;
  payload: {
    moneyBox: IMoneyBox;
  }
}

interface DeleteBudget {
  type: typeof DELETE_BUDGET;
  payload: {
    id: string;
  }
}

interface DeleteMoneyBox {
  type: typeof DELETE_MONEY_BOX;
  payload: {
    id: string;
  }
}

interface UpdateBudget {
  type: typeof UPDATE_BUDGET;
  payload: Partial<IBudget>
}

interface UpdateBox {
  type: typeof UPDATE_BOX;
  payload: Partial<IMoneyBox>
}


export type UserActionTypes = SetUser | AddBudget | UpdateBudget | UpdateUser | DeleteBudget | AddMoneyBox | DeleteMoneyBox | UpdateBox;
