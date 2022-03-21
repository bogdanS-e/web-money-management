import { ICreateCategory } from "./category";

export interface IHistoryData {
  title: string;
  oldValue: string | number | null;
  newValue: string | number | null;
}

export interface IHistory {
  date: Date;
  title: string;
  history: IHistoryData[];
}
