// import DateTime from "react-datetime";
// import orderBy from "lodash/orderBy";

export interface IHistoryDataCorrection {
  id: number;
  historyId: string;
  timeStamp: string; //datetime
  value: number | undefined; //double
  statusTags: string | undefined;
  trendFlags: number | undefined;
  status: number | undefined;
  trandFlagTag: string;
  correctedStatus: number;
  correctionRule: number;
  correctedValue: number; //double
  color: string;
}
export const histotyDataList: IHistoryDataCorrection[] = [
  {
    id: 1,
    historyId: "/Hawkesbury/WM101_N19_Volume",
    timeStamp: "2023-11-06 08:09:00", //datetime
    value: 0, //double
    statusTags: "{ok}",
    trendFlags: 0,
    status: 0,
    trandFlagTag: "{}",
    correctedStatus: 0,
    correctionRule: 1,
    correctedValue: 21512.01953125,
    color: "red",
    // CreatedBy:0,
    // DateCreated:null,
    // LastModifiedBy:0,
    // DateModified:null,
    // DeletedBy:0,
    // DateDeleted:null //double
  },
];
export enum PageEnum {
  list,
  add,
}

export const DataList: IHistoryDataCorrection = {
  id: 1,
  historyId: "/Hawkesbury/WM101_N19_Volume",
  timeStamp: "2023-11-06 08:09:00", //datetime
  value: 0, //double
  statusTags: "{ok}",
  trendFlags: 0,
  status: 0,
  trandFlagTag: "{}",
  correctedStatus: 0,
  correctionRule: 1,
  correctedValue: 21512.01953125, //double
  color: "red",
  // CreatedBy:0,
  // DateCreated:,
  // LastModifiedBy:0,
  // DateModified:,
  // DeletedBy:0,
  // DateDeleted:
};
// export interface ICommonField {
//   CreatedBy: number;
//   DateCreated?: DateTime;
//   LastModifiedBy: number;
//   DateModified?: DateTime;
//   DeletedBy: number;
//   DateDeleted: DateTime;
// }
export interface IMasterName {
  id: number;
  historyId: string;
  status: boolean;
}
export const masterNames: IMasterName[] = [
  {
    id: 0,
    historyId: "string",
    status: true,
  },
];
export interface ListItem {
  id: number;
  content: string;
}
export enum SortDirection {
  Ascending,
  Descending,
}
export enum toaster {
  Warning = "Warning",
  Success = "Success",
  Failed = "Failed",
}
export enum severity {
  error = "error",
  Success = "success",
  Info = "info",
  warn = "warn",
}
// export function sortObjects<T>(
//   data: T[],
//   sortKey: keyof T,
//   direction: SortDirection
// ): T[] {
//   return orderBy(
//     data,
//     [sortKey],
//     [direction === SortDirection.Ascending ? "asc" : "desc"]
//   );
//}
