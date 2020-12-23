import { Key } from 'readline';
import { ArrayElement, ExludeProperties, Maybe, ObjectLiteral } from '@models';
import { AsyncDecl, GroupDecl, NestedDecl, RuleDecl, ValidationDecl } from 'vue/types/options';
import { DefaultFieldStruture, FormFieldArgs } from './fields.base';
import { ICalendarValue, TextField, UploadField } from './fields';
import { FormShape } from './form.generator';
import { AvailableValidationsMessages } from './validators/messages';

// Utils ---------------------------------------------------------

export type UnArray<T> = T extends Array<infer U> ? U : T;
export type Packed<TValue> = TValue | (() => TValue) | null;
export type UnPack<T extends Packed<any>> = T extends (...args: any[]) => infer U ? U : T;
export type UnPackField<T extends DefaultFieldStruture> = {
  [K in keyof T]: K extends ProtectedProps ? T[K] : T[K] extends Packed<infer U> ? U : T[K];
};
export type MaybeTree<T> = {
  [P in keyof T]?: Maybe<T[P]>;
};

type test2 = UnPackField<DefaultFieldStruture>;

// Types ---------------------------------------------------------

export type ValueType =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | File
  | File[]
  | Date
  | ICalendarValue
  | ObjectLiteral
  | ((...args: any[]) => any)
  | null;

export enum ValueRuntimeTypes {
  'String' = 'string',
  'Number' = 'number',
  'Float' = 'float',
  'Price' = 'price',
}
export type TextFieldType = 'text' | 'password' | 'email' | 'tel' | 'time' | 'number' | 'search';

export type GuessValueType<TType extends ValueRuntimeTypes> = TType extends ValueRuntimeTypes.String
  ? string
  : TType extends ValueRuntimeTypes.Number | ValueRuntimeTypes.Price | ValueRuntimeTypes.Float
  ? number
  : any;

export const protectedProperties = [
  'handler',
  'search',
  'handlerParams',
  'formater',
  'validator',
  'onDelete',
  'onInput',
] as const;

export type ExtractTuple<T extends readonly any[]> = T[number];
export type ProtectedProps = ExtractTuple<typeof protectedProperties>;

// Structure (Form) ---------------------------------------------------------

export type FormTree<T extends ObjectLiteral> = { [TKey in keyof T]-?: FormShape };

type KeyOfForms<
  T extends Record<string, FormShape>,
  K extends keyof T = keyof T
> = T[K] extends FormShape<infer U, any> ? PureTree<U> : never;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never;

// type test = UnionToIntersection<
//   KeyOfForms<{
//     field: FormShape<{ value: TextField<string, any, any> }>;
//     field2: FormShape<{ value2: TextField<string, any, any> }>;
//   }>
// >;

export type FormTreeValues<T extends Record<string, FormShape>> = UnionToIntersection<
  KeyOfForms<T>
>;

export type FormStructure<TForm extends ObjectLiteral = ObjectLiteral> = {
  [TKey in keyof TForm]?: TForm[TKey] extends DefaultFieldStruture
    ? TForm[TKey]
    : TForm[TKey] extends Array<any>
    ? FormStructure<UnArray<TForm[TKey]>>[]
    : FormStructure<TForm[TKey]>;
};

export type CleanFormFieldArgs<T extends ValueType = any, V = T> = Omit<
  FormFieldArgs<T, V>,
  'value' | 'testValue'
>;
export type ResetableFieldArgs = Omit<CleanFormFieldArgs, keyof typeof protectedProperties>;

export type FormFieldsData<TForm extends ObjectLiteral = ObjectLiteral> = {
  [K in keyof TForm]: TForm[K] extends DefaultFieldStruture
    ? CleanFormFieldArgs<TForm[K]>
    : FormFieldsData<TForm[K]>;
};

export type PureTree<TForm extends ObjectLiteral = ObjectLiteral, TEdit extends boolean = false> = {
  [TKey in keyof TForm]: TForm[TKey] extends DefaultFieldStruture<infer TValue, any>
    ? TValue extends (...args: any[]) => infer TPacked
      ? TEdit extends true
        ? TPacked | undefined
        : TPacked
      : TEdit extends true
      ? TValue | undefined
      : TValue
    : PureTree<TForm[TKey]>;
};

// type Test<T> = T extends DefaultFieldStruture<infer TValue, any> ? TValue : T;

export type InitialValues<TForm extends ObjectLiteral = ObjectLiteral> = {
  [TKey in keyof TForm]: TForm[TKey] extends DefaultFieldStruture<infer U, any>
    ? Packed<U>
    : InitialValues<TForm[TKey]>;
};
export type TypedRuleDecl = {
  [K in keyof AvailableValidationsMessages]?: ValidationDecl | GroupDecl | AsyncDecl | NestedDecl;
};

export type ValidationTree<TForm> = {
  [K in keyof TForm]?: TForm[K] extends DefaultFieldStruture
    ? TypedRuleDecl
    : TForm[K] extends Array<any>
    ? { $each: ValidationTree<UnArray<TForm[K]>> }
    : TForm[K] extends ObjectLiteral
    ? ValidationTree<TForm[K]>
    : TypedRuleDecl;
};

// Structure (Fields) ---------------------------------------------------------
