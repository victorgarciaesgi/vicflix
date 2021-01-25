<template>
  <div class="checkbox">
    <div :class="{ big }" class="checkbox-wrap">
      <input
        :id="formId"
        :checked="!!formatedValue"
        :true-value="trueValue"
        :false-value="falseValue"
        type="checkbox"
        @change="updateValue($event.target.checked)"
      />
      <label :for="formId" class="button"></label>
      <label v-if="label && !labelLink" :for="formId" class="label">{{ label }}</label>
      <nuxt-link v-else-if="!!labelLink" :to="labelLink" class="label" target="_blank">{{
        label
      }}</nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'nuxt-property-decorator';
import { nanoid } from 'nanoid';

@Component({})
export default class CheckBox extends Vue {
  @Prop()
  value!: boolean | string;
  @Prop()
  label!: string;
  @Prop()
  trueValue?: string;
  @Prop()
  falseValue?: string;
  @Prop()
  big?: boolean;
  @Prop()
  labelLink?: string;

  public formId!: string;

  get formatedValue() {
    if (this.trueValue && this.falseValue) {
      return this.value === this.trueValue;
    } else {
      return this.value;
    }
  }

  updateValue(value: any) {
    if (this.trueValue && this.falseValue) {
      this.$emit('input', value ? this.trueValue : this.falseValue);
    } else {
      this.$emit('input', value);
    }
  }

  created() {
    this.formId = nanoid(6);
  }
}
</script>

<style lang="postcss" scoped>
$bgColor: var(--blue);

.checkbox {
  position: relative;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  padding: 10px 10px 10px 0;
  height: auto;
  user-select: none;

  .checkbox-wrap {
    margin-left: 5px;

    .label {
      font-size: 14px;
      font-weight: bold;
      margin-left: 5px;
      color: var(--text2);
    }
    a.label {
      text-decoration: underline;
    }

    label.button {
      position: relative;
      height: 18px;
      width: 18px;
      background-color: var(--bg2);
      border-radius: 2px;
      margin-right: 5px;
      border: 1px solid var(--bg4);
      cursor: pointer;

      &:hover {
        border-color: $bgColor;
      }
    }

    input {
      position: absolute;
      opacity: 0;
      height: 0;
      width: 0;
      padding: 0;
      margin: 0;

      &:checked + label.button {
        background-color: $bgColor;
        /* background-image: url('~@icons/forms/done_white.png'); */
        background-position: center center;
        border: 1px solid transparent;

        & ~ .label {
          color: $bgColor;
        }
      }
    }

    &.big {
      label.button {
        height: 24px;
        width: 24px;
      }

      .label {
        font-size: 20px;
        @media screen and (max-width: 500px) {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
