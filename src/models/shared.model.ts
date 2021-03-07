import { RawLocation, Location } from 'vue-router';
// import { PageInfo } from './__generated';
import { Validation } from 'vuelidate';
import { ValidationRule } from 'vuelidate/lib/validators';

// Temporary
export enum OrderByDirection {
  Asc = 'ASC',
  Desc = 'DESC',
}
// --------------

export type ObjectLiteral<TKey extends string | number | symbol = string, TValue = any> = Record<
  TKey,
  TValue
>;

export enum BreakPointsTypes {
  XSmall = 'xs',
  Small = 'sm',
  Medium = 'md',
  Large = 'lg',
  XLarge = 'xl',
}

export enum BreakPointsValues {
  XSmall = 450,
  Small = 639,
  Medium = 767,
  Large = 1023,
  XLarge = 1279,
}

export type IsValidArg<T> = T extends ObjectLiteral ? (keyof T extends never ? false : true) : true;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type KeepProperties<T, P> = Pick<T, { [K in keyof T]: T[K] extends P ? K : never }[keyof T]>;
export type ExludeProperties<T, P> = Pick<
  T,
  { [K in keyof T]: T[K] extends P ? never : K }[keyof T]
>;
export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];
export type ArrayElement<A> = A extends Array<infer U> ? U : never;
export interface Dictionary<T> {
  [x: string]: T;
}
export type Maybe<T> = T | null;

// Vuelidate

export type ValidationRoot<T = any> = ValidationProperties<T> & ValidationGroups & Validation;

export type ValidationProperties<V> = {
  [P in Exclude<keyof V, '$v'>]?: Validation | ValidationProperties<V[P]> | Record<string, number>;
};

export interface ValidationGroups {
  [groupName: string]: Validation & ValidationProperties<any>;
}

interface ValidGroupDecl {
  [group: string]: string[];
}

export interface RuleDecl {
  [rule: string]: ValidationDecl | GroupDecl | AsyncDecl | NestedDecl;
}

interface ValidPropertyDecl {
  [prop: string]: RuleDecl;
}

type ValidationDecl = ValidationRule | ((...args: any[]) => ValidationRule);
type GroupDecl = string[];
type AsyncDecl = (...args: any[]) => boolean | Promise<boolean>;
type NestedDecl = RuleDecl;
type DynamicDecl = () => RuleDecl;

//

export interface NavLink {
  label: string;
  link: RawLocation;
  icon?: string;
  exact?: boolean;
  condition?: boolean;
}

export interface IConnectionPayload<T = any, V = any> {
  where?: T;
  orderBy?: V;
  page: number;
  limit?: number;
}

export interface IReadOnlyObject {
  readonly [x: string]: any;
}

export type IConstant<T extends string> = {
  [key in T]: string;
};

export interface IStep {
  label: string;
  strict?: boolean;
}

export type ColumnType = 'text' | 'numeric' | 'date';
export type ColumnExtended<T = string> = {
  text: string;
  key?: T;
  type?: ColumnType;
  order?: OrderByDirection;
  format?: string;
};
export type TableColumn<T = any> = string | ColumnExtended<T>;
