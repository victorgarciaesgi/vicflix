/* eslint-disable */
const css = require('@css');
import uuid from 'uuid/v4';
import { IErrorValidators } from '@validators';
import { IAnyObject, ValidationRoot, IConnection } from '@models';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import { RuleDecl } from 'vue/types/options';
import { CleaveOptions } from 'cleave.js/options';

function extractValues(_this, _fieldsData, _fieldsValues, fields) {
  for (let prop in fields) {
    if (fields[prop] instanceof Forms.DefaultFormElement) {
      let { value, ...rest } = fields[prop];
      if (typeof value === 'function') {
        _fieldsValues[prop] = value();
      } else {
        _fieldsValues[prop] = value;
      }
      _fieldsData[prop] = rest;
    } else if (fields[prop] != null && typeof fields[prop] === 'object') {
      _this[prop] = {};
      _fieldsData[prop] = {};
      _fieldsValues[prop] = {};
      extractValues(_this[prop], _fieldsData[prop], _fieldsValues[prop], fields[prop]);
    }
  }
}

function resetValues(_fieldsValues, fields) {
  for (let fieldKey in fields) {
    if (fields[fieldKey] instanceof Forms.DefaultFormElement) {
      let { value } = fields[fieldKey];
      if (typeof value === 'function') {
        _fieldsValues[fieldKey] = value();
      } else {
        _fieldsValues[fieldKey] = value;
      }
    } else if (fields[fieldKey] != null && typeof fields[fieldKey] === 'object') {
      resetValues(_fieldsValues[fieldKey], fields[fieldKey]);
    }
  }
}

function extractForm<T>(_this: Forms.DefaultFormElement<T>) {
  let { value, reset, ...data } = _this;
  if (typeof value === 'function') {
    value = value();
  } else {
    value = value;
  }
  return {
    value,
    reset,
    data,
  };
}
export namespace Forms {
  export type FormValues<T extends Partial<T>> = {
    [S in keyof T]: T[S] extends Forms.DefaultFormElement<any> ? T[S]['value'] : FormValues<T[S]>;
  };
  export type EditFormValues<T extends Partial<T>> = {
    [S in keyof T]?: T[S] extends Forms.DefaultFormElement<any>
      ? T[S]['value']
      : EditFormValues<T[S]>;
  };
  export type ValidationTree<T> = {
    [K in keyof T]?: T[K] extends Forms.DefaultFormElement<any> ? RuleDecl : ValidationTree<T[K]>;
  };
  export type FormStructure<T> = {
    [K in keyof T]?: T[K] extends Forms.DefaultFormElement<any> ? T[K] : FormStructure<T[K]>;
  };
  type FullFormPayload<T> = {
    [K in keyof T]?: T[K] extends Forms.DefaultFormElement<any>
      ? FormPayload<T[K]>
      : FullFormPayload<T[K]>;
  };

  export class Form<T extends FormStructure<T>> {
    private initialState: FormStructure<T>;
    public id: string;
    public fieldsData: FullFormPayload<T> = {};
    public fieldsValues: FormValues<T> = {} as any;
    public fields: FormStructure<T>;
    private validations?: ValidationTree<T>;
    public $v: ValidationRoot<T> = {} as any;
    public editMode: boolean;

    constructor({
      fields,
      validations,
      editMode,
    }: {
      fields: FormStructure<T>;
      validations?: ValidationTree<T>;
      editMode?: boolean;
    }) {
      this.id = uuid();
      if (editMode) {
        function recursiveEditmode(_fields) {
          Object.keys(_fields).map(m => {
            if (_fields[m] instanceof DefaultFormElement) {
              _fields[m].editMode = true;
            } else if (typeof _fields[m] === 'object') {
              recursiveEditmode(_fields[m]);
            }
          });
        }
        recursiveEditmode(fields);
        this.editMode = editMode;
      }
      this.initialState = cloneDeep(fields);
      extractValues(this, this.fieldsData, this.fieldsValues, fields);
      this.fields = fields;
      this.validations = validations;
    }

    public reset(): void {
      if (this.$v) this.$v.$reset();
      resetValues(this.fieldsValues, this.initialState);
      this.id = uuid();
    }

    get isFormModified() {
      return Object.keys(this.getModifiedData()).length > 0;
    }

    public getModifiedData(): EditFormValues<T> {
      const modifiedValues: any = {};
      function recursiveModified(_fields, _fieldsValues, _initialState, _modifiedValues) {
        Object.keys(_fields).map(m => {
          if (_fields[m] instanceof DefaultFormElement) {
            if (typeof _initialState[m].value === 'function') {
              if (_fieldsValues[m] !== _initialState[m].value()) {
                _modifiedValues[m] = _fieldsValues[m];
              }
            } else {
              if (_fieldsValues[m] !== _initialState[m].value) {
                _modifiedValues[m] = _fieldsValues[m];
              }
            }
          } else if (typeof _fields[m] === 'object') {
            _modifiedValues[m] = {};
            recursiveModified(_fields[m], _fieldsValues[m], _initialState[m], _modifiedValues[m]);
          }
        });
      }
      recursiveModified(this.fields, this.fieldsValues, this.initialState, modifiedValues);

      function cleanModified(_fields) {
        Object.keys(_fields).map(m => {
          if (
            typeof _fields[m] === 'object' &&
            _fields[m] !== null &&
            !(_fields[m] instanceof File)
          ) {
            if (isEmpty(_fields[m])) {
              delete _fields[m];
            } else {
              cleanModified(_fields[m]);
              if (isEmpty(_fields[m])) {
                delete _fields[m];
              }
            }
          }
        });
      }
      cleanModified(modifiedValues);

      return modifiedValues;
    }

    public getValues(): FormValues<T> {
      return cloneDeep(this.fieldsValues);
    }

    get getValidations() {
      return this.validations;
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
    | 'float'
    | 'datetime-local';

  type IComponentType =
    | 'FormText'
    | 'FormField'
    | 'StarRating'
    | 'FormSelect'
    | 'FormCheckBox'
    | 'Radio'
    | 'FormCalendar'
    | 'FormPlaceSearch'
    | 'FormUpload'
    | 'RichText'
    | 'RichRadio'
    | 'RichCheckBoxList';

  type Unpacked<T> = T | T[] | ((...args: any[]) => T);

  export class FormPayload<T> {
    value?: Unpacked<T>;
    displayValue?: string;
    tempValue?: T;
    icon?: string;
    type?: FormType;
    placeholder?: string;
    error?: boolean;
    disabled?: boolean;
    noMargin?: boolean;
    noBorder?: boolean;
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
    width?: string;
    cleaveOptions?: CleaveOptions;
  }
  export class DefaultFormElement<T> extends FormPayload<T> {
    public initialValue: Unpacked<T>;
    public value: T;
    constructor({
      value = null,
      error = true,
      noEdit = false,
      editMode = false,
      ...fields
    }: FormPayload<T>) {
      super();
      this.id = uuid();
      this.value = value as T;
      this.displayValue = fields.displayValue;
      this.initialValue = value;
      this.icon = fields.icon || null;
      this.type = fields.type || 'text';
      this.placeholder = fields.placeholder || fields.label || null;
      this.error = error;
      this.disabled = fields.disabled || false;
      this.inlineIcon = fields.inlineIcon || false;
      this.debounce = fields.debounce || null;
      this.noMargin = fields.noMargin || false;
      this.errorMessages = fields.errorMessages || null;
      this.label = fields.label;
      this.halfWidth = fields.halfWidth || false;
      this.width = fields.width;
      this.component = fields.component || null;
      this.tempValue = fields.tempValue;
      this.update = fields.update;
      this.noBorder = fields.noBorder;
      this.noEdit = noEdit;
      this.editMode = editMode;
    }

    extract() {
      return extractForm<T>(this);
    }

    reset() {
      this.value = cloneDeep(this.initialValue as T);
    }
  }

  // Text
  export class TextForm<T extends string = string> extends DefaultFormElement<T> {
    constructor(fields: FormPayload<T>) {
      super({ ...fields, component: 'FormText' });
    }
  }

  // Textarea
  export class FieldForm<T extends string = string> extends DefaultFormElement<T> {
    constructor(fields: FormPayload<T>) {
      super({ ...fields, component: 'FormField' });
    }
  }

  // RichText
  export class RichText<T extends string = string> extends DefaultFormElement<T> {
    constructor({ type = 'text', ...fields }: FormPayload<T>) {
      super({ ...fields, component: 'RichText' });
    }
  }

  // Upload
  export interface UploadPayload<T extends File | string = string> extends FormPayload<T> {
    uploadType?: 'image' | 'video' | 'audio';
  }
  export class UploadForm<T extends File | string = string> extends DefaultFormElement<T> {
    public inForm = true;
    public uploadType?: 'image' | 'video' | 'audio';
    constructor(fields: UploadPayload<T>) {
      super({ ...fields, component: 'FormUpload' });
      this.uploadType = fields.uploadType || 'image';
    }
  }

  // Radio
  export interface IRadioItem<T> {
    value: T;
    text: string;
  }
  export interface IRadioPayload<T> {
    radios: IRadioItem<T>[];
  }

  export class Radio<T extends string = string> extends DefaultFormElement<T> {
    public radios: IRadioItem<T>[];
    constructor(fields: FormPayload<T> & IRadioPayload<T>) {
      super({ ...fields, type: 'radio', component: 'Radio' });
      this.radios = fields.radios;
    }
  }

  // RichRadio
  export interface IRichRadioItem<T> extends IRadioItem<T> {
    icon?: string;
  }
  export interface IRichRadioPayload<T> {
    radios: IRichRadioItem<T>[];
  }

  export class RichRadio<T extends string = string> extends DefaultFormElement<T> {
    public radios: IRadioItem<T>[];
    constructor(fields: FormPayload<T> & IRichRadioPayload<T>) {
      super({ ...fields, type: 'radio', component: 'RichRadio' });
      this.radios = fields.radios;
    }
  }

  // Select
  export type IOptions<T extends any = any> = { value: T; text: string; icon?: string };
  export interface ISelectPayload<T = any, V = any> {
    options?: IOptions<T>[];
    handler?: (...args: any[]) => Promise<IConnection<any>>;
    handlerParams?: { [x: string]: any };
    formater?: (item: V) => IOptions<T>;
    allOption?: boolean;
    search?: (value: string) => IAnyObject;
  }

  export class Select<T extends string = string, V extends any = any> extends DefaultFormElement<
    T
  > {
    public options?: IOptions<T>[];
    public handler?: (...args: any[]) => Promise<IConnection<T>>;
    public handlerParams?: { [x: string]: any };
    public formater?: (item: V) => IOptions<T>;
    public allOption?: boolean;
    public search?: (value: string) => IAnyObject;

    constructor({ ...fields }: FormPayload<T> & ISelectPayload<T, V>) {
      super({ ...fields, component: 'FormSelect' });
      this.options = fields.options || null;
      this.handler = fields.handler;
      this.handlerParams = fields.handlerParams;
      this.formater = fields.formater;
      this.allOption = fields.allOption;
      this.search = fields.search;
    }
  }

  // Calendar
  export type ICalendarValue = Date | ICalendarPeriodType;
  export type ICalendarPeriodType = { start: Date; end: Date };
  export type ICalendarType = 'normal' | 'period';
  export interface ICalendarPayload {
    calendarType?: ICalendarType;
    type?: 'date' | 'datetime-local' | 'time';
    sideList?: boolean;
  }

  export class Calendar<T extends ICalendarValue = ICalendarValue> extends DefaultFormElement<T> {
    public calendarType: ICalendarType;
    public sideList: boolean;
    constructor({
      value,
      calendarType = 'normal',
      type = 'date',
      ...fields
    }: FormPayload<T> & ICalendarPayload) {
      super({ ...fields, component: 'FormCalendar' });
      this.calendarType = calendarType;
      this.type = type;
      this.sideList = fields.sideList;
      if (this.calendarType === 'period') {
        value = {
          start: null,
          end: null,
          ...value,
        } as any;
      }
      this.value = value as T;
    }
  }

  // CheckBox
  export class CheckBox<T extends boolean = boolean> extends DefaultFormElement<T> {
    constructor(fields: FormPayload<T>) {
      super({ ...fields, type: 'checkbox', component: 'FormCheckBox' });
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

  export class RichCheckBoxList<T extends any = string> extends DefaultFormElement<T> {
    public checkboxs: IRichCheckBoxListItem<T>[];
    constructor({ value = [], ...fields }: FormPayload<T> & IRichCheckBoxListPayload<T>) {
      super({ ...fields, value, type: 'checkbox', component: 'RichCheckBoxList' });
      this.checkboxs = fields.checkboxs;
    }
  }

  // Section
  export class SectionConstructor {
    public sectionTitle: string;
    constructor(title, fields) {
      this.sectionTitle = title;
      Object.keys(fields).map(m => {
        this[m] = fields[m];
      });
    }
  }

  export function Section<T>(title: string, fields: FormStructure<T>): T {
    return new SectionConstructor(title, fields) as any;
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

  export class StarRating<T extends number = number> extends DefaultFormElement<T> {
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

export default Forms;
