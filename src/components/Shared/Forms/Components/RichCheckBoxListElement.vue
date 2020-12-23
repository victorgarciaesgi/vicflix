<template>
  <FormElementBase v-bind="baseProps">
    <div class="checkbox flex">
      <div
        v-for="checkbox of data.checkboxs"
        :key="checkbox.value"
        :class="{ selected: formatedValues.includes(checkbox.value) }"
        class="checkbox-wrap column md-m-5 md-w-90 md-p-5 flex"
        @click="handleValue(checkbox.value)"
      >
        <div class="icon center w100 flex">
          <SvgIcon
            :src="checkbox.icon"
            :size="20"
            :color="formatedValues.includes(checkbox.value) ? 'white' : 'dark'"
          />
        </div>
        <span class="md-f-10">{{ checkbox.text }}</span>
      </div>
    </div>
  </FormElementBase>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'nuxt-property-decorator';
import { FormMixin } from '@mixins';
import { RichCheckBoxListField, UnPackField } from '@constructors';

@Component
export default class RichCheckBoxListElement extends FormMixin {
  readonly data!: UnPackField<RichCheckBoxListField>;
  value!: string[];

  get formatedValues() {
    return [...new Set(this.value)];
  }

  handleValue(value: string) {
    if (Array.isArray(this.value)) {
      if (this.value.includes(value)) {
        const newValue = this.value.filter((v) => v !== value);
        this.updateValue(newValue);
      } else {
        const newValue = this.value;
        newValue.push(value);
        this.updateValue([...newValue]);
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
$bgColor: var(--blue);

div.checkbox {
  flex-flow: row wrap;
  justify-content: space-evenly;
  padding: 5px;
  user-select: none;

  div.checkbox-wrap {
    flex-flow: column wrap;
    justify-content: space-evenly;
    border: 1px solid var(--w230);
    cursor: pointer;
    width: 130px;
    font-size: 12px;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 5px;

    &:not(:first-child) {
      margin-left: 10px;
    }

    &.selected {
      background-color: var(--green);
      color: white;
      border-color: transparent;
    }

    &:not(.selected):hover {
      background-color: var(--w240);
    }

    .icon {
      margin-bottom: 5px;
    }

    span {
      text-align: center;
    }
  }
}
</style>
