<template>
  <FormElementBase v-bind="baseProps">
    <div class="RadioList / bg-bg3 flex flex-col rounded" :class="[data.style]">
      <div
        v-for="radio of data.radios"
        :key="radio.value"
        class="RadioItem / flex flex-row justify-between px-3 py-2"
        :class="{ checked: isChecked(radio.value) }"
        @click="updateValue(radio.value)"
      >
        <label class="Text / flex-1 text-sm">{{ radio.text }}</label>
        <button
          type="button"
          class="Radio / border-green flex-0 p-2px flex w-5 h-5 border-2 rounded-full"
        ></button>
      </div>
    </div>
  </FormElementBase>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'nuxt-property-decorator';
import { FormMixin } from '@mixins';
import { RadioField, UnPackField } from '@constructors';

@Component
export default class RadioElement extends FormMixin {
  data!: UnPackField<RadioField>;

  get isChecked() {
    return (value: any) => this.value === value;
  }
}
</script>

<style lang="postcss" scoped>
div.RadioItem {
  &.checked {
    label.Text {
      color: var(--primary);
      font-weight: 600;
    }
    button.Radio {
      &:after {
        content: '';
        background-color: var(--primary);
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }
    }
  }
}
</style>
