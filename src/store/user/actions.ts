import { AuthActionTypes, SET_USER } from './types';

export function setUser(user): AuthActionTypes {
  return {
    type: SET_USER,
    payload: {
      user,
    }
  };
}

