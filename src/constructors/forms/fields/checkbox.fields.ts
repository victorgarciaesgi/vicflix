import { ArrayElement } from '@models';
import { DefaultFieldArgs, DefaultFieldStruture, FormFieldArgs } from '../fields.base';

// Toggle ---------------------------------------------------------

export class ToggleField<
  TValue extends boolean | string = boolean,
  TInitial = TValue
> extends DefaultFieldStruture<TValue, TInitial> {
  constructor({ cleaveOptions, ...fields }: FormFieldArgs<TValue, TInitial>) {
    super(fields);
    this.component = 'ToggleElement';
  }
}

// Radio ---------------------------------------------------------

export interface IRadioItem<TValue> {
  value: TValue;
  text: string;
}
type IRadioStyle = 'row' | 'column';

interface IRadioPayload<TValue extends string | boolean> {
  radios: IRadioItem<TValue>[];
  radioStyle?: IRadioStyle;
}

export class RadioField<
  TValue extends boolean | string = string,
  TInitial = TValue
> extends DefaultFieldStruture<TValue, TInitial> {
  public radios: IRadioItem<TValue>[];
  public radioStyle?: IRadioStyle;
  constructor({
    radios,
    radioStyle,
    ...fields
  }: FormFieldArgs<TValue, TInitial> & IRadioPayload<TValue>) {
    super(fields);
    this.component = 'RadioElement';
    this.radios = radios;
    this.radioStyle = radioStyle || 'row';
  }
}

// RichRadio ---------------------------------------------------------

export interface IRichRadioItem<tValue> extends IRadioItem<tValue> {
  icon?: string;
}
export interface IRichRadioPayload<tValue> {
  radios: IRichRadioItem<tValue>[];
}

export class RichRadioField<
  tValue extends string = string,
  TInitial = tValue
> extends DefaultFieldStruture<tValue, TInitial> {
  public radios!: IRadioItem<tValue>[];
  constructor({ radios, ...fields }: FormFieldArgs<tValue, TInitial> & IRichRadioPayload<tValue>) {
    super(fields);
    this.component = 'RichRadioElement';
    this.radios = radios;
  }
}

// CheckBox ---------------------------------------------------------

export interface ICheckBoxPayload {
  center?: boolean;
  labelLink?: string | Location;
}

export class CheckBoxField<
  tValue extends boolean = boolean,
  TInitial = tValue
> extends DefaultFieldStruture<tValue, TInitial> {
  center?: boolean;
  labelLink?: string | Location;

  constructor({
    labelLink,
    center,
    ...fields
  }: FormFieldArgs<tValue, TInitial> & ICheckBoxPayload) {
    super(fields);
    this.component = 'CheckBoxElement';
    this.center = center;
    this.labelLink = labelLink;
  }
}

// RichCheckBoxList
export type IRichCheckBoxListItem<T = any> = {
  text: string;
  value: T;
  icon?: string;
};
export interface IRichCheckBoxListPayload<T> {
  checkboxs: IRichCheckBoxListItem<T>[];
}

export class RichCheckBoxListField<
  TValue extends string[] = string[],
  TInitial = TValue
> extends DefaultFieldStruture<TValue, TInitial> {
  public checkboxs: IRichCheckBoxListItem<ArrayElement<TValue>>[];
  constructor({
    value,
    ...fields
  }: FormFieldArgs<TValue, TInitial> & IRichCheckBoxListPayload<ArrayElement<TValue>>) {
    super({ ...fields });
    this.component = 'RichCheckBoxListElement';
    this.value = (value || []) as any;
    this.checkboxs = fields.checkboxs;
  }
}
