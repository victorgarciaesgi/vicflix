import { isTesting } from '@constants';
import * as Components from '@components/Shared/Forms/Components';
import { cloneDeep } from 'lodash-es';
import { nanoid } from 'nanoid';
import { CleaveOptions } from 'cleave.js/options';
import Colors from '@colors';
import { GuessValueType, Packed, ValueRuntimeTypes, ValueType } from './form.types';
import { SelectOption } from './fields/select.fields';
import { AvailableValidationsMessages } from './validators';

export class DefaultFieldArgs<TValue = any, TInit = TValue> {
  displayValue?: SelectOption<any>;
  extendClass?: string;
  placeholder?: string;
  error?: Packed<boolean>;
  showValid?: Packed<boolean>;
  disabled?: Packed<boolean>;
  style?: {
    noMargin?: boolean;
    noBorder?: boolean;
    noRadius?: boolean;
    noBackground?: boolean;
    icon?: string;
  };
  removeSpaces?: boolean;
  label?: string;
  debounce?: number;
  info?: string;
  errorMessages?: { [P in keyof AvailableValidationsMessages]?: AvailableValidationsMessages[P] };
  editMode?: Packed<boolean>;
  readonly?: boolean;
  onInput?: (value: TValue) => void;
  labelColor?: string | typeof Colors;
  id?: string;
  width?: string;
  cleaveOptions?: CleaveOptions;
  autocomplete?: 'off' | 'on';
}

export type FormFieldArgs<
  TValue extends ValueType = any,
  TInitial = TValue,
  TType extends ValueRuntimeTypes = any
> = Omit<DefaultFieldArgs<TValue, TInitial>, 'component' | 'id'> & {
  value?: Packed<GuessValueType<TType>>;
  testValue?: Packed<GuessValueType<TType>>;
  tempValue?: Packed<GuessValueType<TType>>;
};

export class DefaultFieldStruture<
  TValue extends ValueType = any,
  TInit = TValue
> extends DefaultFieldArgs<TValue> {
  public initialValue!: Packed<TInit>;
  public value: TValue;
  public tempValue?: Packed<TInit>;
  public component!: keyof typeof Components;

  constructor({
    value = null,
    error = true,
    showValid = true,
    readonly = false,
    editMode = false,
    style,
    ...fields
  }: FormFieldArgs<TValue, TInit>) {
    super();
    this.id = nanoid(6);
    if (isTesting && fields.testValue && !value) {
      value = fields.testValue as any;
    }
    this.value = value;
    this.displayValue = fields.displayValue;
    this.initialValue = value;
    this.info = fields.info;
    this.placeholder = fields.placeholder ?? fields.label;
    this.error = error;
    this.showValid = showValid;
    this.disabled = fields.disabled ?? false;
    this.style = style;
    this.debounce = fields.debounce;
    this.errorMessages = fields.errorMessages;
    this.label = fields.label;
    this.width = fields.width;
    this.tempValue = fields.tempValue;
    this.onInput = fields.onInput;
    this.readonly = readonly;
    this.editMode = editMode;
    this.cleaveOptions = fields.cleaveOptions;
    this.extendClass = fields.extendClass;
    this.autocomplete = fields.autocomplete || 'on';
    this.removeSpaces = fields.removeSpaces;
  }

  public reset(): void {
    const _value = cloneDeep(this.initialValue as any);
    if (typeof _value === 'function') {
      this.value = _value();
    } else {
      this.value = _value;
    }
  }

  public extract() {
    const { value, reset, initialValue, ...data } = this;
    let newValue = value;
    if (value && typeof value === 'function') {
      newValue = (value as () => any).call(this);
    }
    return {
      value,
      reset,
      data,
    };
  }
}
