import { isTesting } from '@constants';
import { ObjectLiteral, ValidationRoot } from '@models';
import { cloneDeep, isEmpty } from 'lodash-es';
import { nanoid } from 'nanoid';
import {
  cleanValues,
  constructData,
  constructValues,
  extractModifiedValues,
  mapAndCompareThroughData,
  mapThroughValues,
  resetFieldsData,
  resetFieldsValues,
} from './form.utils';
import {
  FormStructure,
  PureTree,
  ValidationTree,
  FormFieldsData,
  FormTreeValues,
  MaybeTree,
} from './form.types';

// Form ---------------------------------------------------------

/**
 * Generate a form object with integrated helpers for modified values
 *
 * Use it with the component `FormContainer`
 *
 * @usage
 *
 * ```ts
 * const form = new FormShape({
 *    fields: {
 *      email: new TextField({
 *          label: 'email'
 *       })
 *    }
 * });
 * ```
 *
 */
export class FormShape<
  TForm extends FormStructure<TForm> = any,
  TEditMode extends boolean = boolean
> {
  private initialValues!: PureTree<TForm>;
  public id!: string;
  public data!: FormFieldsData<TForm>;
  public values!: PureTree<TForm>;
  public fields!: FormStructure<TForm>;
  public validations?: ValidationTree<TForm>;
  public $v: ValidationRoot<Vue> | null = null;
  public editMode!: boolean;
  public onUpdate?: () => void;

  /** Return a boolean indicating if the form has been touched
   * (Independant from vuelidate)
   */
  public dirty = false;

  constructor({
    editMode,
    fields,
    validations,
    onUpdate,
  }: {
    editMode?: TEditMode;
    fields: TForm;
    validations?: ValidationTree<TForm>;
    onUpdate?: (values: PureTree<TForm, any>) => void;
  }) {
    this.id = nanoid(6);
    this.validations = validations;
    this.fields = fields;
    this.initialValues = constructValues(fields);
    this.data = constructData(fields, !!editMode);
    this.values = constructValues(fields);
    this.editMode = !!editMode;
    if (onUpdate) {
      this.onUpdate = () => {
        this.dirty = true;
        if (this.editMode) {
          return onUpdate(this.extractModifiedValues());
        } else {
          return onUpdate(this.extractValues());
        }
      };
    }
  }

  /** Returns deep raw form values */
  public extractValues(): PureTree<TForm> {
    return cleanValues(this.values, this.fields);
  }

  /** Returns only deep raw modified form values */
  public extractModifiedValues(): PureTree<TForm, true> {
    return cleanValues(
      extractModifiedValues(this.values, this.initialValues, this.fields),
      this.fields
    );
  }

  /** Return true if one of the values is different from the initialValues */
  get isModified(): boolean {
    const modified = cleanValues(
      extractModifiedValues(this.values, this.initialValues, this.fields),
      this.fields
    );
    return Object.keys(modified).length > 0;
  }

  /** Return true if all the fields valid */
  get isValid(): boolean {
    if (this.$v && !isEmpty(this.$v)) {
      if (this.editMode) {
        return !this.$v.form?.$invalid && this.isModified;
      }
      return !this.$v.form?.$invalid;
    }
    return true;
  }

  /** Return true if one of the fields is dirty and invalid */
  get isInvalid(): boolean {
    if (this.$v && !isEmpty(this.$v)) {
      if (this.editMode) {
        return this.$v.form?.$invalid || !this.isModified;
      }
    }
    return false;
  }

  /** Reset all fields to initial state */
  public reset(): void {
    if (this.$v && !isEmpty(this.$v)) this.$v.$reset();
    this.values = resetFieldsValues(this.fields);
    this.data = resetFieldsData(this.fields);
    this.initialValues = resetFieldsValues(this.fields);
  }

  /** Call vuelidate validor `$touch()` on this form */
  $touch(): void {
    if (this.$v && !isEmpty(this.$v)) this.$v.$touch();
  }

  // Modifiers

  public updateFieldsData(datas: MaybeTree<FormFieldsData<TForm>>): void {
    this.data = mapAndCompareThroughData(datas, this.fields, (key, { data, fieldData }) => {
      return Object.entries(fieldData).reduce((acc, [key, value]) => {
        if (data?.[key]) {
          acc[key] = data[key];
        } else {
          acc[key] = value;
        }
        return acc;
      }, {});
    });
  }

  public updateValues(values: MaybeTree<PureTree<TForm>>): void {
    this.values = mapThroughValues(values, this.fields, (key, { value }) => {
      return value;
    });
  }
  public updateInitialValues(values: MaybeTree<PureTree<TForm>>): void {
    this.initialValues = mapThroughValues(values, this.fields, (key, { value }) => {
      return value;
    });
  }
}

export class FormGroup<TShape extends Record<string, FormShape>> {
  public forms!: TShape;

  constructor(forms: TShape) {
    this.forms = forms;
  }

  /** Return if all the forms inside the group are valid */
  get isValid(): boolean {
    if (Object.entries(this.forms).every(([key, form]) => form.editMode)) {
      return Object.entries(this.forms).every(([key, form]) => !form.isInvalid);
    } else {
      return Object.entries(this.forms).every(([key, form]) => form.isValid);
    }
  }

  /** Return `true` if one of the forms is invalid */
  get isInvalid(): boolean {
    return Object.entries(this.forms).some(([key, form]) => form.isInvalid);
  }

  /** Extract values of all forms inside the group and merge them */
  extractValues(): FormTreeValues<TShape> {
    return Object.entries(this.forms).reduce((acc, [key, form]) => {
      const values = form.extractValues();
      Object.entries(values).forEach(([key, value]) => {
        acc[key] = value;
      });
      return acc;
    }, {} as FormTreeValues<TShape>);
  }

  /** Call vuelidate `$touch()` on all forms of the group  */
  $touchAll(): void {
    Object.entries(this.forms).forEach(([key, form]) => {
      form.$touch();
    });
  }
}
