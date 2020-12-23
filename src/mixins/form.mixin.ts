import Vue from 'vue';
import {
  CheckBoxField,
  DefaultFieldStruture,
  ValueType,
  CalendarField,
  SelectField,
  SelectMultipleField,
  TextField,
  TextMultipleField,
  UploadField,
  UnPackField,
} from '@constructors';
import { nanoid } from 'nanoid';
import { Prop, Watch, Ref } from 'nuxt-property-decorator';
import debounce from 'lodash/debounce';
import { Mixin } from 'vue-mixin-decorator';
import { Validation } from 'vuelidate';
import Cleave from 'cleave.js';
import Colors from '@colors';
import 'cleave.js/dist/addons/cleave-phone.fr';
import { Popin } from '@global';
import FormElementBase from '../components/Shared/Forms/Utils/FormElementBase.vue';

type PossibleDataFields = UnPackField<DefaultFieldStruture> &
  (
    | UnPackField<TextField<any>>
    | UnPackField<TextMultipleField>
    | UnPackField<UploadField<any>>
    | UnPackField<CalendarField<any>>
    | UnPackField<SelectField>
    | UnPackField<SelectMultipleField>
    | UnPackField<CheckBoxField>
  );

@Mixin({
  components: {
    FormElementBase,
  },
})
export default class FormMixin extends Vue {
  @Prop({ required: true, default: null, type: null as any })
  readonly value!: ValueType;
  @Prop({ required: false })
  readonly vl?: Validation;
  @Prop({ required: true })
  readonly data!: PossibleDataFields;
  @Prop({ required: false }) readonly name!: string;

  @Ref() input?: HTMLInputElement;
  @Ref() inputBox?: Vue;
  @Ref() popup?: Popin;
  @Ref() linkInput?: HTMLInputElement;
  @Ref() imagePopup?: Popin;
  @Ref() menuBubble?: HTMLElement;

  public formId: string | null = null;
  public isFocused = false;
  public initialValue: ValueType | null = null;
  public css = Colors;
  public cleave: Cleave | null = null;

  get valid() {
    return this.vl ? !this.vl.$invalid : null;
  }
  get dirty() {
    return this.vl ? this.vl.$dirty : null;
  }
  get error() {
    return this.vl ? this.vl.$error : null;
  }
  get required(): boolean {
    return this.vl ? this.vl.$params.required : null;
  }
  get isPending() {
    return this.vl ? this.vl.$pending : null;
  }

  get baseProps() {
    return {
      data: this.data,
      formError: this.formError,
      formValid: this.formValid,
      focus: this.isFocused,
      isPending: this.isPending,
      label: this.label,
      vl: this.vl,
      name: this.name,
      required: this.required,
    };
  }

  get inputProps() {
    return {
      id: this.formId,
      value: this.formatedValue,
      readonly: this.data.readonly,
      placeholder: this.placeholder,
      disabled: this.data.disabled,
      name: this.name,
      autocomplete: this.data.autocomplete,
    };
  }

  get iconColorProps() {
    return {
      [this.css.green]: this.formValid && !this.isFocused,
      [this.css.red]: this.formError && !this.isFocused,
      [this.css.text3]: !this.formValid && this.isFocused,
      [this.css.yellow]: this.isPending,
      [this.css.text5]: true,
    };
  }

  get formValid(): boolean {
    if (this.data.editMode) {
      return (
        !!this.initialValue &&
        this.value !== this.initialValue &&
        this.required &&
        !!this.valid &&
        !!this.dirty &&
        !!this.data.showValid &&
        !!this.data.error &&
        !this.isPending
      );
    } else {
      return (
        !!this.valid &&
        !!this.dirty &&
        !!this.data.showValid &&
        !!this.data.error &&
        this.vl?.$params?.required &&
        !this.isPending
      );
    }
  }

  get formError(): boolean {
    if (this.data.editMode) {
      return !!this.error && !!this.data.error && !this.isPending;
    } else {
      return !!this.error && !!this.dirty && !!this.data.error && !this.isPending;
    }
  }

  get label(): string | undefined {
    if (this.required && this.data.error && this.data.label) return this.data.label + '*';
    return this.data.label;
  }
  get placeholder(): string | undefined {
    if (this.required && this.data.error && this.data.placeholder && !this.label)
      return this.data.placeholder + '*';
    return this.data.placeholder;
  }

  updateValue(value: ValueType) {
    let parsedValue = value;
    if (typeof parsedValue === 'string' && (value === 'true' || value === 'false')) {
      parsedValue = value === 'true';
    }
    if ('valueType' in this.data) {
      if ((this.data.valueType === 'number' || this.data.valueType === 'float') && !!value) {
        if (typeof value === 'string' && !isNaN(Number(value.replace(/ /g, '')))) {
          parsedValue = Number(value.replace(/ /g, ''));
        } else {
          parsedValue = value as number;
        }
      } else if (this.data.valueType === 'price' && value) {
        if (
          typeof value === 'string' &&
          !value.endsWith(',') &&
          !isNaN(Number(value.replace(',', '.')))
        ) {
          parsedValue = Number(value.replace(',', '.'));
        } else {
          parsedValue = value;
        }
      }
    }
    if (this.data.onInput) {
      this.data.onInput(parsedValue);
    }
    this.$emit('input', parsedValue);
    if (this.vl) {
      this.vl.$touch();
    }
  }

  cancelValue() {
    if (!this.data.disabled) {
      this.updateValue(null);
    }
  }

  handleBlur(): void {
    if (!this.data.disabled) {
      this.isFocused = false;
    }
  }

  handleFocus(): void {
    if (!this.data.disabled) {
      this.isFocused = true;
    }
  }

  @Watch('value')
  valueChanged(newVal: ValueType, oldVal: ValueType) {
    if (this.data.editMode) {
      if (newVal === this.initialValue && this.vl) this.vl.$reset();
    }
  }

  created() {
    this.formId = nanoid(8);
    if (this.data.debounce) {
      const cloneUpdate = this.updateValue;
      this.updateValue = debounce(cloneUpdate, this.data.debounce);
    }
    if (this.value != null && !!this.vl && this.value.toString().trim().length) {
      if (this.vl && !this.data.editMode) {
        this.vl.$touch();
      } else if (this.data.editMode) {
        this.initialValue = this.value;
      }
    }
  }

  mounted() {
    if (this.data.cleaveOptions && this.input) {
      this.cleave = new Cleave(this.input, this.data.cleaveOptions);
    }
  }

  get formatedValue() {
    let newValue: ValueType;
    if (typeof this.value === 'function') {
      newValue = this.value();
    } else {
      newValue = this.value;
    }
    if (
      'valueType' in this.data &&
      this.data.valueType === 'price' &&
      (typeof newValue === 'number' || typeof newValue === 'string')
    ) {
      newValue = newValue.toString().replace('.', ',');
    }
    return newValue;
  }
}
