import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import { authReducer } from '@/store/auth/reducers';
import { userReducer } from '@/store/user/reducers';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const composeEnhansers =
  process.env.NODE_ENV === 'production'
    ? compose
    : (typeof window !== 'undefined' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
      compose;

export const store = createStore(
  rootReducer,
  composeEnhansers(applyMiddleware(thunk)),
);
