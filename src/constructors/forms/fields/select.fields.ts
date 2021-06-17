import { isTesting } from '@constants';
import { ArrayElement, ObjectLiteral, Maybe } from '@models';
import { DefaultFieldStruture, FormFieldArgs } from '../fields.base';

// Select ---------------------------------------------------------

export type SelectOption<TValue extends any = any> = {
  value: TValue;
  text: string;
  icon?: Maybe<string>;
  additional?: string;
};

export type ISelectPayload<TValue = string> = {
  options?: SelectOption<TValue>[];
  innerSearch?: boolean;
  alignement?: 'column' | 'row';
  allOption?: boolean;
  nested?: boolean;
  nullable?: boolean;
};

/**
 * If SelectField is placed in a popin, add the `nested:true` param
 */
export class SelectField<
  TValue = string,
  TArgs = ObjectLiteral,
  TInitial = TValue
> extends DefaultFieldStruture<TValue, TInitial> {
  options?: SelectOption<TValue>[];
  handlerParams?: Partial<TArgs>;
  search?: ((value: string) => Partial<TArgs>) | false;
  innerSearch?: boolean;
  alignement?: 'column' | 'row';
  allOption?: boolean;
  userDisplay?: boolean;
  nested?: boolean;
  nullable?: boolean;

  constructor({
    options,
    innerSearch,
    alignement,
    allOption,
    nested,
    nullable = true,
    ...fields
  }: FormFieldArgs<TValue, TInitial> & ISelectPayload<TValue>) {
    super(fields);
    this.component = 'SelectElement';

    if (allOption && options) {
      this.options = [
        {
          value: undefined as any,
          text: 'All',
        },
        ...options,
      ];
    } else {
      this.options = options;
    }
    this.allOption = allOption;
    this.innerSearch = innerSearch;
    this.nested = nested;
    this.nullable = nullable;
  }
}

// Select Multiple ---------------------------------------------------------

export type ISelectMultiplePayload<TValue extends any[]> = {
  options?: SelectOption<TValue>[];
  alignement?: 'column' | 'row';
  nested?: boolean;
  displayedValues?: SelectOption<TValue>[];
};

/**
 * If SelectMultipleField is placed in a popin, add the `nested:true` param
 */
export class SelectMultipleField<
  TValue extends any[] = any[],
  TInitial extends any[] = TValue
> extends DefaultFieldStruture<TValue, TInitial> {
  options?: SelectOption<TInitial>[];
  alignement?: 'column' | 'row';
  innerSearch?: boolean;
  onlyText?: boolean;
  displayedValues?: SelectOption<TInitial>[];
  nested?: boolean;

  constructor({
    value,
    testValue,
    options,

    alignement,
    nested,
    displayedValues,
    ...fields
  }: FormFieldArgs<TValue, TInitial> & ISelectMultiplePayload<TInitial>) {
    super(fields);
    this.component = 'SelectMultipleElement';

    this.value = isTesting && testValue ? testValue : value;

    this.options = options;

    this.alignement = alignement || 'column';
    this.nested = nested;
  }
}

// Place Search ---------------------------------------------------------

export interface IPlaceSearchPayload<TValue> {
  formater?: (result: ISearchResult) => SelectOption<TValue>;
}

export interface ISearchResult {
  centre: {
    type: string;
    coordinates: number[];
  };
  nom: string;
  code: string;
  codesPostaux: string[];
  _score: number;
}

export class PlaceField<TValue extends ObjectLiteral | string = any, TInitial = TValue>
  extends DefaultFieldStruture<TValue, TInitial>
  implements IPlaceSearchPayload<TValue>
{
  public formater?: (result: ISearchResult) => SelectOption<TValue>;

  constructor({
    formater,
    ...fields
  }: FormFieldArgs<TValue, TInitial> & IPlaceSearchPayload<TValue>) {
    super(fields);
    // this.component = 'PlaceElement';
    this.formater = formater;
  }
}
