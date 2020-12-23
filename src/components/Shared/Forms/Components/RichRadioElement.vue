<template>
  <FormElementBase v-bind="baseProps">
    <div class="w-start p-h-5 flex">
      <div
        v-for="radio of data.radios"
        :key="radio.value"
        :class="{ checked: value === radio.value }"
        class="radio-wrap pointer m-b-5 flex"
        @click="updateValue(radio.value)"
      >
        <span class="label md-f-10">{{ radio.text }}</span>
      </div>
    </div>
  </FormElementBase>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'nuxt-property-decorator';
import { FormMixin } from '@mixins';
import { RichRadioField, UnPackField } from '@constructors';

@Component
export default class RichRadioElement extends FormMixin {
  data!: UnPackField<RichRadioField>;
}
</script>

<style lang="postcss" scoped>
$bgColor: var(--blue);

div.input-box {
  user-select: none;

  div.radio-wrap {
    flex-flow: row wrap;
    align-items: center;
    margin-right: 5px;
    border: 1px solid var(--w230);
    border-radius: 4px;
    padding: 10px;

    &.checked {
      background-color: var(--blue);
      border-color: var(--blue);

      .label {
        color: white;
      }
    }

    .label {
      font-size: 12px;
      font-weight: bold;
      color: var(--g90);
    }
    a.label {
      text-decoration: underline;
    }

    label.button {
      position: relative;
      height: 17px;
      width: 17px;
      background-color: var(--w240);
      border-radius: 100%;
      margin-right: 5px;
      border: 1px solid var(--w200);
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
        border: 1px solid transparent;

        & ~ .label {
          color: $bgColor;
        }
        &::before {
          content: '';
          position: relative;
          height: 5px;
          width: 5px;
          border-radius: 100%;
          background-color: white;
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
