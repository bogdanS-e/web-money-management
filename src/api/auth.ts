import { instance } from './instance';
import { IConfirmSignUpRequest, ICreateUserRequest, ICreateUserResponse, ISignInRequest, IUserTokens } from './models/user';

export const signUp = (data: ICreateUserRequest) => {
  return instance.post<ICreateUserResponse>('/auth/sign-up', data);
};

export const signIn = (data: ISignInRequest) => {
  return instance.post<IUserTokens>('/auth/sign-in', data);
};

export const confirmSignUp = (data: IConfirmSignUpRequest) => {
  return instance.post<IUserTokens>('/auth/confirm-sign-up', data);
};

export const resendCode = (email: string) => {
  return instance.get(`/auth/resend-code/?email=${email}`);
};