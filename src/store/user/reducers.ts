import produce from 'immer';

import {
  UserActionTypes, IUserState, SET_USER
} from './types';

const initialState: IUserState = {user: null};

export const userReducer = (
  state = initialState,
  action: UserActionTypes
): IUserState =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_USER:
        draft.user = action.payload.user;
        break;
      default:
        break;
    }
  });
