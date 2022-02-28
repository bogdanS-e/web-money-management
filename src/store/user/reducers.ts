import produce from 'immer';

import {
  UserActionTypes, IUserState, SET_USER, ADD_BUDGET
} from './types';

const initialState: IUserState = { user: null };

export const userReducer = (
  state = initialState,
  action: UserActionTypes
): IUserState =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_USER:
        draft.user = action.payload.user;
        break;
      case ADD_BUDGET:
        if (!draft.user) return;

        draft.user.budgets.push(action.payload.budget);
        break;
      default:
        break;
    }
  });
