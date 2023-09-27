export interface IHistoryData {
  title: string;
  oldValue: string | number | null;
  newValue: string | number | null;
}

export interface IHistory {
  date: string;
  title: string;
  history: IHistoryData[];
}
