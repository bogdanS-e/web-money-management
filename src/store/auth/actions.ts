import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, AuthActionTypes, REDIRECT_TO } from './types';

export function loginSuccess(): AuthActionTypes {
  return {
    type: LOGIN_SUCCESS,
  };
}

export function loginFail(): AuthActionTypes {
  return {
    type: LOGIN_FAIL,
  };
}

export function logout(): AuthActionTypes {
  return {
    type: LOGOUT,
  };
}

export function redirectTo(path: string): AuthActionTypes {
  return {
    type: REDIRECT_TO,
    payload: {
      path,
    }
  };
}

