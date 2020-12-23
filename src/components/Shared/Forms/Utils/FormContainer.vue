<template>
  <component
    :is="nested ? 'div' : 'form'"
    :id="formId"
    :class="[flow, { fill }]"
    class="form-container-root / flex"
    @submit.prevent="emitSubmit"
  >
    <template v-for="(value, key) in form.fields">
      <slot
        v-if="$scopedSlots[key]"
        :name="key"
        :value="form.values[key]"
        :vl="$v ? ($v.form ? ($v.form.values ? $v.form.values[key] : null) : null) : null"
        :data="form.data[key]"
        :allValues="form.values"
        :onInput="onInput(key)"
      />
      <FormItem
        v-else
        :key="key"
        v-model="form.values[key]"
        :name="key"
        :item="form.fields[key]"
        :vl="$v ? ($v.form ? ($v.form.values ? $v.form.values[key] : null) : null) : null"
        :data="form.data[key]"
        @input="handleUpdate"
      />
    </template>
  </component>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'nuxt-property-decorator';
import { nanoid } from 'nanoid';
import { ValidationRoot, ObjectLiteral } from '@models';
import { DefaultFieldStruture, FormShape, ValueType } from '@constructors';
import FormItem from './FormItem.vue';

@Component({
  components: { FormItem },
  validations() {
    const _this = this as FormContainer;
    if (_this.form.validations) {
      return {
        form: {
          values: _this.form.validations,
        },
      } as any;
    }
    return {};
  },
})
export default class FormContainer extends Vue {
  @Prop({ required: true })
  form!: FormShape;
  @Prop({ default: 'column' }) flow!: 'column' | 'row';
  @Prop({ required: false }) name?: string;
  @Prop({ required: false }) nested?: boolean;
  @Prop({ default: true }) fill!: boolean;

  @Emit('submit') emitSubmit() {}
  @Emit('change') emitChange() {}

  get formId() {
    if (this.name) return this.name;
    else return this.form.id;
  }

  onInput(key: string) {
    return (value: ValueType) => {
      this.handleUpdate(key, value);
    };
  }

  handleUpdate(key: string, value: any) {
    this.$set(this.form.values, key, value);
    this.form.$v = this.$v;
    this.emitChange();
  }

  created() {
    this.form.$v = this.$v;
  }
}
</script>

<style lang="postcss" scoped>
form.form-container-root {
  &.fill {
    width: 100%;
  }

  &.column {
    & > *:not(.halfWidth) {
      width: 100%;
    }
  }

  &.row {
    flex-flow: row wrap;
  }
}
</style>
