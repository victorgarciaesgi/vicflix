<template>
  <component
    :is="getComponent"
    v-if="isField"
    :value="value"
    :vl="vl"
    :data="data"
    :name="name"
    @input="onInput"
  />
  <div v-else class="flex flex-col">
    <template v-for="(itemValue, key) in item">
      <FormItem
        v-if="isFieldItem(item[key])"
        :key="key"
        :v-model="value[key]"
        :name="key"
        :item="itemValue"
        :vl="vl ? (isArray ? vl.$each[key] : vl[key]) : null"
        :data="data[key]"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'nuxt-property-decorator';
import { ValidationProperties, ValidationGroups, ObjectLiteral } from '@models';
import { Validation } from 'vuelidate';
import { isObject } from '@utils';
import {
  CleanFormFieldArgs,
  DefaultFieldStruture,
  FormShape,
  TextField,
  ValueType,
} from '@constructors';
import {
  TextElement,
  TextMultipleElement,
  CheckBoxElement,
  TextAreaElement,
  UploadElement,
  SelectElement,
  RadioElement,
  RichRadioElement,
  RichCheckBoxListElement,
  CheckBox,
  CalendarElement,
  SelectMultipleElement,
  UploadMultipleElement,
} from '../Components';
import FormToggle from '../Components/FormToggle.vue';

const componentsList = {
  TextElement,
  TextMultipleElement,
  CheckBoxElement,
  TextAreaElement,
  UploadElement,
  SelectElement,
  RadioElement,
  RichRadioElement,
  RichCheckBoxListElement,
  CheckBox,
  CalendarElement,
  SelectMultipleElement,
  // PlaceElement,
  UploadMultipleElement,
  // RichText,
};

@Component({
  name: 'FormItem',
  components: componentsList,
})
export default class FormItem extends Vue {
  @Prop({ required: true, type: [String, Object, Boolean, Array] }) item!:
    | ObjectLiteral
    | DefaultFieldStruture;
  @Prop({ type: Object }) data!: any;
  @Prop({ required: false }) vl?: ValidationProperties<any> & ValidationGroups & Validation;
  @Prop({ type: null as any }) value?: any;
  @Prop() readonly name!: string;

  emitInput(value: any) {
    this.$emit('input', this.name, value);
  }

  get getComponent(): keyof typeof componentsList {
    return this.item.component;
  }

  get isArray() {
    return this.vl && this.vl.$each;
  }

  get isField() {
    return this.item instanceof DefaultFieldStruture;
  }

  get isFieldItem() {
    return (item: any) => item instanceof DefaultFieldStruture || isObject(item);
  }

  onInput(value: ValueType) {
    this.emitInput(value);
  }
}
</script>

<style lang="postcss" scoped>
div.section {
  overflow: hidden;
  padding: 5px 5px 5px 0;
  > div.block {
    padding: 15px;
    padding-left: 10px;
    margin-bottom: 10px;
    border-left: 2px solid var(--blue);
    justify-content: flex-start;
    background-color: white;
    border-radius: 2px 5px 5px 2px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  > span.title {
    width: 100%;
    font-weight: bold;
    font-size: 14px;
    color: var(--blue);
    margin-bottom: 5px;
    margin-left: 3px;
    text-align: left;
  }
}
div.block {
  overflow: hidden;
  > * {
    width: 100%;
  }
}

span.title {
  width: 100%;
  font-weight: bold;
  font-size: 14px;
  color: var(--blue);
  margin-bottom: 5px;
  text-align: left;
}
</style>
