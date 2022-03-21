import produce from 'immer';

import {
  UserActionTypes, IUserState, SET_USER, ADD_BUDGET, UPDATE_BUDGET, UPDATE_USER, DELETE_BUDGET
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
      case UPDATE_USER:
        if (!draft.user) return;

        draft.user = {
          ...draft.user,
          ...action.payload,
        }
        break;
      case ADD_BUDGET:
        if (!draft.user) return;

        draft.user.budgets.push(action.payload.budget);
        break;
      case DELETE_BUDGET:
        if (!draft.user) return;

        const indexToDelete = draft.user.budgets.findIndex((budget) => budget.id === action.payload.id);

        if (indexToDelete !== -1) {
          draft.user.budgets.splice(indexToDelete, 1);
        }
        break;
      case UPDATE_BUDGET:
        if (!draft.user) return;

        const index = draft.user.budgets.findIndex(({ id }) => id === action.payload.id);

        if (index === -1) return;

        draft.user.budgets[index] = {
          ...draft.user.budgets[index],
          ...action.payload,
        };
        break;
      default:
        break;
    }
  });
