declare module 'vuelidate' {
  import { default as _Vue } from 'vue';

  type Func = () => any;

  module 'vue/types/options' {
    interface ComponentOptions<V extends _Vue> {
      validations?: ValidationRuleset<{}>;
    }
  }

  module 'vue/types/vue' {
    interface Vue {
      $v: Vuelidate<any>;
    }
  }

  interface IValidator {
    readonly $invalid: boolean;
    $dirty: boolean;
    readonly $error: boolean;
    $pending: boolean;

    $touch(): void;
    $reset(): void;
  }

  interface IDefaultValidators {
    alpha?: boolean;
    alphaNum?: boolean;
    between?: boolean;
    email?: boolean;
    maxLength?: boolean;
    minLength?: boolean;
    required?: boolean;
    sameAs?: boolean;
    or?: boolean;
    and?: boolean;
  }

  type EachByKey<T> = { [K in keyof T]: Validator<T[K]> };

  type Each<T> = { [key: number]: EachByKey<T> } & {
    $trackBy: string | Func;
  } & IValidator;

  global {
    interface Array<T> {
      $each: Each<T> & Vuelidate<T>;
    }
  }

  type Validator<T> = IValidator & IDefaultValidators & Each<T>;

  type IPredicate = (value: any, parentVm?: IValidationRule) => boolean | Promise<boolean>;

  type IPredicateGenerator = (...args: any[]) => IPredicate;

  interface IValidationRule {
    [key: string]: ValidationPredicate | IValidationRule | IValidationRule[];
  }

  export type ValidationPredicate = IPredicateGenerator | IPredicate;

  export type Vuelidate<T> = { [K in keyof T]?: Vuelidate<T[K]> & Validator<T[K]> };

  export type ValidationRuleset<T> = {
    [K in keyof T]?: ValidationPredicate | IValidationRule | IValidationRule[] | string[]
  };

  export interface IVuelidate<T> {
    $v: Vuelidate<T>;
  }

  export const validationMixin: {
    beforeCreate(): void;
  };

  export const validateModel: <T>(model: T, validations: ValidationRuleset<T>) => IVuelidate<T>;

  export function Validation(Vue: typeof _Vue): void;

  export default Validation;
}

declare module 'vuelidate/lib/validators' {
  import { ValidationPredicate } from 'vuelidate';

  export function required(value: any): ValidationPredicate;
  export function requiredIf(field: (vm: any) => boolean): ValidationPredicate;
  export function requiredUnless(field: string): ValidationPredicate;
  export function minLength(length: number): ValidationPredicate;
  export function maxLength(length: number): ValidationPredicate;
  export function minValue(min: number): ValidationPredicate;
  export function maxValue(max: number): ValidationPredicate;
  export function between(min: number, max: number): ValidationPredicate;
  export function alpha(): ValidationPredicate;
  export function alphaNum(): ValidationPredicate;
  export function numeric(): ValidationPredicate;
  export function decimal(): ValidationPredicate;
  export function email(value: string): ValidationPredicate;
  export function ipAddress(): ValidationPredicate;
  export function macAddress(): ValidationPredicate;
  export function sameAs(field: string): ValidationPredicate;
  export function url(): ValidationPredicate;
  export function or(...validators: ValidationPredicate[]): ValidationPredicate;
  export function and(...validators: ValidationPredicate[]): ValidationPredicate;
}

declare module 'vuelidate/lib/validators' {
  import Vue from 'vue';
  import { ValidationPredicate } from 'vuelidate';

  export interface Params {
    type?: string;
    msg?: string;
    [x: string]: any;
  }

  export interface ValidationParams {
    readonly name: string;
    readonly params: Params;
    readonly path: string[];
  }

  // const ValidationRule
  export interface ValidationRule {
    $params(): ValidationParams;
    $pending(): boolean;
  }

  export type CustomRule = (value: any, parentVm?: Vue) => boolean;

  type ValidationPredicateFunction = () => ValidationPredicate;
  export interface Helpers {
    withParams(params: Params, rule: CustomRule | ValidationRule): ValidationRule;
    req(value: any): ValidationRule;
    ref(reference: string | ((vm: any, parentVm?: Vue) => any), vm: any, parentVm?: Vue): any;
    len(value: any): number;
    regex(type: string, expr: RegExp): ValidationRule;
  }

  export const helpers: Helpers;
}
