export interface IUser {
  email: string;
  name: string;
}

export interface ISignInRequest {
  email: string;
  password: string;
}

export interface ICreateUserResponse {
  email: string;
  name: string;
}

export interface ICreateUserRequest extends ICreateUserResponse {
  password: string;
}

export interface IConfirmSignUpRequest {
  email: string;
  code: string | number;
}

export interface IUserTokens {
  accessToken: string;
  refreshToken: string;
}