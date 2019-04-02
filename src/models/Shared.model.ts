import { RawLocation } from 'vue-router';

export interface NavLink {
  label: string;
  link: RawLocation;
  icon?: string;
  exact?: boolean;
  condition?: boolean;
}
export interface IPaginate<T> {
  pageInfo: IPageInfo;
  aggregate: {
    count: number;
  };
  edges: T[];
  totalCount?: number;
}

export interface IPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}

export interface IAnyObject {
  [x: string]: any;
}
