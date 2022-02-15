import { UserActionTypes, SET_USER } from './types';

export function setUser(user): UserActionTypes {
  return {
    type: SET_USER,
    payload: {
      user,
    }
  };
}

