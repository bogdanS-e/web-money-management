import { RootState } from '@/store';

export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectIsChecked = (state: RootState) => state.auth.checked;
export const selectRedirectPath = (state: RootState) => state.auth.redirectPath;