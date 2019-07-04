import { RawLocation } from 'vue-router';
import { ValidationProperties, ValidationGroups } from 'vue/types/vue';
import { Validation } from 'vuelidate';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type KeepProperties<T, P> = Pick<T, { [K in keyof T]: T[K] extends P ? K : never }[keyof T]>;

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

export interface IConnection<T> {
  pageInfo: IPageInfo;
  aggregate?: {
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

export type ValidationRoot<T> = ValidationProperties<T> & ValidationGroups & Validation;
