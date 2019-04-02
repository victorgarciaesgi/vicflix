import Vue from 'vue';
import shortid from 'shortid';
import { Prop, Watch } from 'vue-property-decorator';
import debounce from 'lodash/debounce';
import { Mixin } from 'vue-mixin-decorator';
import { Forms } from '@constructors';

@Mixin({})
export class FormMixin extends Vue {
  @Prop({ required: true })
  value!: any;
  @Prop({ required: false })
  vl;
  @Prop({ required: true })
  data: Forms.FormPayload<any> | Forms.UploadForm;

  public formId = null;
  public isFocused = false;
  public initialValue = null;
  public showOptions = false;
  public css = require('@css');

  get valid() {
    return this.vl ? !this.vl.$invalid : null;
  }
  get dirty() {
    return this.vl ? this.vl.$dirty : null;
  }
  get error() {
    return this.vl ? this.vl.$error : null;
  }
  get required() {
    return this.vl ? this.vl.$params.required : null;
  }
  get isPending() {
    return this.vl ? this.vl.$pending : null;
  }

  get label() {
    if (this.required && this.data.error && this.data.label) return this.data.label + '*';
    return this.data.label;
  }
  get placeholder() {
    if (this.required && this.data.error && this.data.placeholder)
      return this.data.placeholder + '*';
    return this.data.placeholder;
  }

  updateValue(value: any) {
    if (this.vl) this.vl.$touch();
    let parsedValue = value;
    if (this.data.type === 'number') {
      if (Number(value)) {
        parsedValue = parseFloat(value);
      } else {
        parsedValue = value;
      }
    }
    if (this.data.update) {
      this.data.update(parsedValue);
    }
    this.$emit('input', parsedValue);
    this.showOptions = false;
  }

  handleBlur() {
    this.isFocused = false;
  }

  handleFocus() {
    this.isFocused = true;
  }

  @Watch('value')
  valueChanged(newVal, oldVal) {
    if (this.data.editMode) {
      if (newVal == this.initialValue) this.vl.$reset();
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
  }

  created() {
    this.formId = shortid.generate();
    if (this.data.debounce) {
      this.updateValue = debounce(value => {
        if (this.vl) this.vl.$touch();
        if (this.data.type === 'number') {
          if (parseFloat(value) != NaN) {
            this.$emit('input', parseFloat(value));
          } else {
            this.$emit('input', value);
          }
        } else {
          this.$emit('input', value);
        }
        if (this.data.update) {
          this.data.update(value);
        }
        this.showOptions = false;
      }, this.data.debounce);
    }
  }

  get formatedValue() {
    let newValue;
    if (typeof this.value === 'function') {
      newValue = this.value();
    } else {
      newValue = this.value;
    }
    return newValue;
  }
}
