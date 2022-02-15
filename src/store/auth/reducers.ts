import produce from 'immer';

import {
  IAuthState,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  REDIRECT_TO,
  AuthActionTypes
} from './types';

const initialState: IAuthState = {
  isLoggedIn: null,
  checked: false,
  redirectPath: '/'
};

export const authReducer = (
  state = initialState,
  action: AuthActionTypes
): IAuthState =>
  produce(state, (draft) => {
    switch (action.type) {
      case LOGIN_SUCCESS:
        draft.isLoggedIn = true;
        draft.checked = true;
        break;
      case LOGIN_FAIL:
        draft.isLoggedIn = false;
        draft.checked = true;
        break;
      case LOGOUT:
        draft.isLoggedIn = false;
        draft.checked = false;
        break;
      case REDIRECT_TO:
        draft.redirectPath = action.payload.path
        break;
      default:
        break;
    }
  });
