import Vue from 'vue';
import shortid from 'shortid';
import { Prop, Watch } from 'vue-property-decorator';
import debounce from 'lodash/debounce';
import { Mixin } from 'vue-mixin-decorator';
import { Forms } from '@constructors';
import Colors from '@colors';
import { Validation } from 'vuelidate';
import Cleave from 'cleave.js';
import { Popup } from '@components/Shared';

type ValueType = string | number | boolean | any[] | File | (() => any) | Forms.ICalendarValue;

@Mixin({})
export class FormMixin extends Vue {
  @Prop({ required: true, default: null, type: null })
  value: ValueType;
  @Prop({ required: false })
  vl: Validation;
  @Prop({ required: true })
  data: Forms.FormPayload<any> | Forms.UploadForm<any>;

  public formId: string = null;
  public isFocused: boolean = false;
  public initialValue: ValueType = null;
  public css = Colors;
  public cleave: Cleave = null;

  $refs: {
    input: HTMLInputElement;
    popup: Popup;
    inputFile: HTMLInputElement;
    imagePopup: Popup;
  };

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

  get formValid(): boolean {
    if (this.data.editMode) {
      return (
        this.value !== this.initialValue &&
        this.valid &&
        this.dirty &&
        this.data.error &&
        !this.isPending
      );
    } else {
      return this.valid && this.dirty && this.data.error && !this.isPending;
    }
  }

  get formError(): boolean {
    if (this.data.editMode) {
      return this.error && this.data.error && !this.isPending;
    } else {
      return !this.valid && this.dirty && this.data.error && !this.isPending;
    }
  }

  get label(): string {
    if (this.required && this.data.error && this.data.label) return this.data.label + '*';
    return this.data.label;
  }
  get placeholder(): string {
    if (this.required && this.data.error && this.data.placeholder)
      return this.data.placeholder + '*';
    return this.data.placeholder;
  }

  updateValue(value: ValueType) {
    if (this.vl) this.vl.$touch();
    let parsedValue = value;
    if (typeof parsedValue === 'string') {
      parsedValue = parsedValue.trim();
    }
    if ((this.data.type === 'number' || this.data.type === 'float') && !!value) {
      if (typeof value === 'string' && !isNaN(Number(value))) {
        parsedValue = Number(value);
      } else {
        parsedValue = value as number;
      }
    }
    if (this.data.update) {
      this.data.update(parsedValue);
    }
    this.$emit('input', parsedValue);
  }

  handleBlur(): void {
    this.isFocused = false;
  }

  handleFocus(): void {
    this.isFocused = true;
  }

  @Watch('value')
  valueChanged(newVal, oldVal) {
    if (this.data.editMode) {
      if (newVal === this.initialValue) this.vl.$reset();
    }
  }

  mounted() {
    if (this.value != null && !!this.vl && this.value.toString().trim().length) {
      if (this.vl && !this.data.editMode) {
        this.vl.$touch();
      } else if (this.data.editMode) {
        this.initialValue = this.value;
      }
    }
    if (this.data.type === 'tel') {
      this.cleave = new Cleave(this.$refs.input, {
        phone: true,
        phoneRegionCode: 'FR',
      });
    } else if (this.data.type === 'number' || this.data.type === 'float') {
      this.cleave = new Cleave(this.$refs.input, {
        numeral: true,
        numeralThousandsGroupStyle: 'thousand',
        ...this.data.cleaveOptions,
      });
    } else if (this.data.cleaveOptions) {
      this.cleave = new Cleave(this.$refs.input, this.data.cleaveOptions);
    }
  }

  created() {
    this.formId = shortid.generate();
    if (this.data.debounce) {
      const cloneUpdate = this.updateValue;
      this.updateValue = debounce(cloneUpdate, this.data.debounce);
    }
  }

  get formatedValue() {
    let newValue: ValueType;
    if (typeof this.value === 'function') {
      newValue = this.value();
    } else {
      newValue = this.value;
    }
    return newValue;
  }

  destroyed() {
    if (this.cleave) this.cleave.destroy();
  }
}
