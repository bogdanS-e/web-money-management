import { ICreateCategory } from "./category";
import { IHistory } from "./history";

export interface IUser {
  email: string;
  name: string;
  onboarded: boolean;
  budgets: IBudget[];
  moneyBoxes: IMoneyBox[];
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

export interface IBudget {
  id: string;
  users: [string],
  name: string;
  amount: number;
  categories: ICreateCategory[],
  availableAmount: number;
  history: IHistory[];
}

export interface IMoneyBox {
  id: string;
  users: [string],
  name: string;
  goal: number;
  goalDate: string;
  actualAmount: number;
  startDate: string;
  completed: boolean;
  image: string | null;
}
export interface ICreateBudgetRequest {
  name: string;
  amount: number;
}

export interface ICreateMoneyBoxRequest {
  name: string;
  goal: number;
  date: string;
}

export interface IShareBudgetRequest {
  id: string;
  emails: string[];
  message: string;
}

export interface IRemoveUserFromBudgetRequest {
  budgetId: string;
  email: string;
}

export interface IRemoveUserFromBoxRequest {
  boxId: string;
  email: string;
}