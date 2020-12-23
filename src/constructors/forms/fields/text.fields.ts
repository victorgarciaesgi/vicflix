import { DefaultFieldStruture, FormFieldArgs } from '../fields.base';
import { GuessValueType, TextFieldType, ValueRuntimeTypes } from '../form.types';

// Text ---------------------------------------------------------

interface TextComposerArgs<TType> {
  valueType?: TType;
  type?: TextFieldType;
}
export class TextField<
  TValue extends GuessValueType<TType>,
  TInitial = TValue,
  TType extends ValueRuntimeTypes = ValueRuntimeTypes.String
> extends DefaultFieldStruture<TValue, TInitial> {
  public type!: TextFieldType;
  public valueType!: ValueRuntimeTypes;

  constructor({
    type,
    valueType,
    ...fields
  }: FormFieldArgs<TValue, TInitial, TType> & TextComposerArgs<TType>) {
    super(fields);
    this.component = 'TextElement';
    this.type = type ?? 'text';
    this.valueType = valueType ?? ValueRuntimeTypes.String;
  }
}

// Text Multiple ---------------------------------------------------------

interface TextMultiplePayload<TType extends ValueRuntimeTypes> {
  valueType?: TType;
  validator?: (value: string) => boolean | Promise<boolean>;
}

export class TextMultipleField<
  TValue extends GuessValueType<TType> = any,
  TInitial = TValue,
  TType extends ValueRuntimeTypes = ValueRuntimeTypes.String
> extends DefaultFieldStruture<TValue, TInitial> {
  public valueType!: ValueRuntimeTypes;
  validator?: (value: TValue) => boolean | Promise<boolean>;

  constructor({
    cleaveOptions,
    validator,
    valueType,
    placeholder = 'Appuyez sur Entrée pour ajouter',
    ...fields
  }: FormFieldArgs<TValue, TInitial, TType> & TextMultiplePayload<TType>) {
    super({ ...fields, placeholder });
    this.component = 'TextMultipleElement';
    this.validator = validator;
    this.valueType = valueType ?? ValueRuntimeTypes.String;
  }
}

// Textarea ---------------------------------------------------------
export class TextAreaForm<
  TValue extends string = string,
  TInitial = TValue
> extends DefaultFieldStruture<TValue, TInitial> {
  constructor(fields: FormFieldArgs<TValue, TInitial>) {
    super(fields);
    this.component = 'TextAreaElement';
  }
}

// RichText ---------------------------------------------------------

/** @deprecated Component is disabled, decomment lines if you want to use it */
export class RichText<
  TValue extends string = string,
  TInitial = TValue
> extends DefaultFieldStruture<TValue, TInitial> {
  // constructor(fields: FormFieldArgs<TValue, TInitial>) {
  //   super(fields);
  //   // this.component = 'RichText';
  // }
}
