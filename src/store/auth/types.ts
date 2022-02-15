export interface IAuthState {
  isLoggedIn: boolean | null;
  checked: boolean;
  redirectPath: string;
}

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT = 'LOGOUT';
export const REDIRECT_TO = 'REDIRECT_TO';

interface LoginSuccess {
  type: typeof LOGIN_SUCCESS;
}

interface LoginFail {
  type: typeof LOGIN_FAIL;
}

export interface Logout {
  type: typeof LOGOUT;
}

interface RedirectTo {
  type: typeof REDIRECT_TO;
  payload: {
    path: string;
  }
}

export type AuthActionTypes = LoginSuccess | LoginFail | Logout | RedirectTo;
