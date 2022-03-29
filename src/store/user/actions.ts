import { IBudget, IMoneyBox, IUser } from '@/api/models/user';
import { UserActionTypes, SET_USER, ADD_BUDGET, UPDATE_BUDGET, UPDATE_USER, DELETE_BUDGET, ADD_MMONEY_BOX, DELETE_MONEY_BOX, UPDATE_BOX } from './types';

export function setUser(user: IUser | null): UserActionTypes {
  return {
    type: SET_USER,
    payload: {
      user,
    }
  };
}

export function updateUser(user: Partial<IUser>): UserActionTypes {
  return {
    type: UPDATE_USER,
    payload: {
      ...user,
    }
  };
}

export function addBudget(budget: IBudget): UserActionTypes {
  return {
    type: ADD_BUDGET,
    payload: {
      budget,
    }
  };
}

export function addMoneyBoxA(moneyBox: IMoneyBox): UserActionTypes {
  return {
    type: ADD_MMONEY_BOX,
    payload: {
      moneyBox,
    }
  };
}

export function deleteBudget(id: string): UserActionTypes {
  return {
    type: DELETE_BUDGET,
    payload: {
      id,
    }
  };
}

export function deleteMoneyBoxA(id: string): UserActionTypes {
  return {
    type: DELETE_MONEY_BOX,
    payload: {
      id,
    }
  };
}

export function updateBudget(budget: Partial<IBudget>): UserActionTypes {
  return {
    type: UPDATE_BUDGET,
    payload: {
      ...budget,
    }
  };
}

export function updateBox(box: Partial<IMoneyBox>): UserActionTypes {
  return {
    type: UPDATE_BOX,
    payload: {
      ...box,
    }
  };
}

