const css = require('@css');
import uuid from 'uuid/v4';
import { IErrorValidators } from '@validators';

export namespace Forms {
  function extractValues(_this, _fieldsData, _fieldsValues, fields) {
    for (let prop in fields) {
      if (fields[prop] instanceof DefaultFormElement) {
        let { value, ...rest } = fields[prop];
        if (typeof value === 'function') {
          _fieldsValues[prop] = value();
        } else {
          _fieldsValues[prop] = value;
        }
        _fieldsData[prop] = rest;
      } else if (fields[prop] != null) {
        _this[prop] = {};
        _fieldsData[prop] = {};
        _fieldsValues[prop] = {};
        extractValues(_this[prop], _fieldsData[prop], _fieldsValues[prop], fields[prop]);
      }
    }
  }

  function extractForm<T>(_this: DefaultFormElement<T>) {
    const { value, reset, ...data } = _this;
    return {
      value,
      reset,
      data,
    };
  }
  type FormValues<T extends keyOfPayload<T>> = { [S in keyof T]: T[S]['value'] };
  type FullFormPayload<T extends keyOfPayload<T>> = { [S in keyof T]?: keyof T[S] };
  type keyOfPayload<T> = { [P in keyof T]?: any };
  type Unpacked<T> = T | ((...args: any[]) => T);

  export class Form<T extends keyOfPayload<T>> {
    private initialState: T;
    public fieldsData: FullFormPayload<T> = {};
    public fieldsValues: FormValues<T> = {} as any;

    constructor(fields: T) {
      this.initialState = { ...fields };
      extractValues(this, this.fieldsData, this.fieldsValues, fields);
    }

    public reset() {
      extractValues(this, this.fieldsData, this.fieldsValues, this.initialState);
    }

    get isFormModified() {
      return Object.keys(this.getModifiedData()).length > 0;
    }

    public getModifiedData(): FormValues<T> {
      return Object.keys(this.fieldsValues)
        .filter(key => {
          if (typeof this.initialState[key].value === 'function') {
            return this.fieldsValues[key] !== this.initialState[key].value();
          } else {
            return this.fieldsValues[key] !== this.initialState[key].value;
          }
        })
        .reduce((obj, key) => {
          obj[key] = this.fieldsValues[key];
          return obj;
        }, {}) as any;
    }

    public getValues(): FormValues<T> {
      return { ...this.fieldsValues };
    }

    get validations() {
      return Object.keys(this.fieldsData).map(m => this.fieldsData[m].validations);
    }
  }

  type FormType =
    | 'text'
    | 'number'
    | 'password'
    | 'checkbox'
    | 'radio'
    | 'email'
    | 'tel'
    | 'date'
    | 'time'
    | 'datetime-local'
    | 'image'
    | 'video';
  type IOptions = { value: any; text: string };
  type IComponentType =
    | 'FormText'
    | 'FormField'
    | 'StarRating'
    | 'FormSelect'
    | 'FormCheckBox'
    | 'Radio'
    | 'FormCalendar'
    | 'FormPlaceSearch'
    | 'FormUpload';

  export class FormPayload<T> {
    value?: Unpacked<T>;
    tempValue?: T;
    icon?: string;
    type?: FormType;
    placeholder?: string;
    error?: boolean;
    options?: IOptions[];
    disabled?: boolean;
    required?: boolean;
    noMargin?: boolean;
    label?: string;
    inlineIcon?: boolean;
    debounce?: number;
    component?: IComponentType;
    errorMessages?: { [P in keyof IErrorValidators]?: IErrorValidators[P] };
    editMode?: boolean;
    noEdit?: boolean;
    update?: (value: T) => void;
    id?: string;
    halfWidth?: boolean;
    validations?: {
      [x: string]: any;
    };
  }
  class DefaultFormElement<T extends FormPayload<T>> extends FormPayload<T> {
    public value: T;
    constructor({
      value = null,
      error = true,
      required = true,
      noEdit = false,
      editMode = false,
      ...fields
    }) {
      super();
      this.value = value;
      this.icon = fields.icon || null;
      this.type = fields.type || 'text';
      this.placeholder = fields.placeholder || fields.label || null;
      this.error = error;
      this.disabled = fields.disabled || false;
      this.inlineIcon = fields.inlineIcon || false;
      this.debounce = fields.debounce || null;
      this.noMargin = fields.noMargin || false;
      this.errorMessages = fields.errorMessages || null;
      this.required = required;
      this.label = fields.label;
      this.options = fields.options || null;
      this.halfWidth = fields.halfWidth || false;
      this.id = uuid();
      this.component = fields.component || null;
      this.validations = fields.validations;
      this.tempValue = fields.tempValue;
      this.update = fields.update;
      this.noEdit = noEdit;
      this.editMode = editMode;
    }

    extract() {
      return extractForm<T>(this);
    }

    reset() {
      this.value = null;
    }
  }

  export class TextForm<T = string> extends DefaultFormElement<T> {
    constructor(fields: FormPayload<T>) {
      super({ ...fields, component: 'FormText' });
    }
  }

  export class FieldForm<T = string> extends DefaultFormElement<T> {
    constructor(fields: FormPayload<T>) {
      super({ ...fields, component: 'FormField' });
    }
  }

  export interface UploadPayload<T = string | File> extends FormPayload<T> {
    accept?: Array<'jpg' | 'png'>;
    type?: 'image' | 'video';
  }
  export class UploadForm<T = File> extends DefaultFormElement<T> {
    public inForm = true;
    public accept?: Array<'jpg' | 'png'>;
    public type?: 'image' | 'video';
    constructor(fields: UploadPayload<T>) {
      super({ ...fields, component: 'FormUpload' });
      this.accept = fields.accept || ['jpg'];
      this.type = fields.type || 'image';
    }
  }

  export class Radio<T = boolean> extends DefaultFormElement<T> {
    constructor(fields: FormPayload<T>) {
      super({ ...fields, type: 'radio', component: 'Radio' });
    }
  }

  export class Select<T = string> extends DefaultFormElement<T> {
    public options?: IOptions[];

    constructor({ ...fields }: FormPayload<T>) {
      super({ ...fields, component: 'FormSelect' });
    }
  }

  export class CheckBox<T = boolean> extends DefaultFormElement<T> {
    constructor(fields: FormPayload<T>) {
      super({ ...fields, type: 'checkbox', component: 'FormCheckBox' });
    }
  }

  interface StarPayload<T> extends FormPayload<T> {
    starCount?: number;
    baseColor?: string;
    selectedColor?: string;
    hoverColor?: string;
    editable?: boolean;
    init?: number;
    size?: number;
    displayNote?: boolean;
    center?: boolean;
  }

  export class StarRating<T = number> extends DefaultFormElement<T> {
    starCount?: number;
    baseColor?: string;
    selectedColor?: string;
    hoverColor?: string;
    editable?: boolean;
    init?: number;
    size?: number;
    displayNote?: boolean;
    center?: boolean;

    constructor(fields: StarPayload<T>) {
      fields.component = 'StarRating';
      super(fields);
      this.starCount = fields.starCount || 5;
      this.baseColor = fields.baseColor || css.mainStyle;
      this.selectedColor = fields.selectedColor || css.mainStyle;
      this.hoverColor = fields.hoverColor || css.yellow1;
      this.editable = fields.editable != null ? fields.editable : true;
      this.init = fields.init || 0;
      this.size = fields.size || 25;
      this.displayNote = fields.displayNote != null ? fields.displayNote : false;
      this.center = fields.center != null ? fields.center : true;
    }
  }
}
