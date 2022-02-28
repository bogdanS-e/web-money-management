import { IBudget } from '@/api/models/user';
import { UserActionTypes, SET_USER, ADD_BUDGET } from './types';

export function setUser(user): UserActionTypes {
  return {
    type: SET_USER,
    payload: {
      user,
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

