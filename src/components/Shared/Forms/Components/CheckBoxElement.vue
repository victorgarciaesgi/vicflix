<template>
  <div :class="{ center: data.center }" class="checkbox">
    <div class="checkbox-wrap">
      <input
        :id="formId"
        :checked="value"
        :value="value"
        type="checkbox"
        @change="updateValue($event.target.checked)"
      />
      <label :for="formId" class="button"></label>
      <label v-if="label && !data.labelLink" class="label" :for="formId">{{ label }}</label>
      <nuxt-link v-else-if="!!data.labelLink" :to="data.labelLink" class="link" target="_blank">{{
        label
      }}</nuxt-link>
    </div>
    <FormError v-if="vl" :vl="vl" :data="data" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Watch } from 'nuxt-property-decorator';
import { Component, Mixin, Mixins } from 'vue-mixin-decorator';
import { CheckBoxField, UnPackField } from '@constructors';
import { FormMixin } from '@mixins';

@Component
export default class CheckBoxElement extends FormMixin {
  data!: UnPackField<CheckBoxField>;
}
</script>

<style lang="postcss" scoped>
.checkbox {
  position: relative;
  display: flex;
  padding: 10px 10px 10px 3px;
  align-items: center;
  height: auto;
  width: 100%;
  user-select: none;

  &.center {
    justify-content: center;
  }

  .checkbox-wrap {
    vertical-align: middle;

    span {
      font-size: 14px;
      font-weight: bold;
      display: inline;
      vertical-align: middle;
    }

    label.label {
      display: inline;
      vertical-align: middle;
      font-size: 13px;
      color: var(--text2);
    }

    label.button {
      display: inline-block;
      position: relative;
      vertical-align: middle;
      height: 18px;
      width: 18px;
      background-color: var(--bg3);
      border-radius: 5px;
      margin-right: 5px;
      border: 1px solid var(--bg5);
      cursor: pointer;

      &:hover {
        border-color: var(--blue);
      }
    }

    a {
      vertical-align: middle;
      display: inline;
    }

    input {
      display: none;
      position: absolute;
      opacity: 0;
      height: 0;
      width: 0;
      padding: 0;
      margin: 0;

      &:checked + label.button {
        background-color: var(--blue);
        background-image: url('~@icons/forms/done_white.png');
        border: 1px solid transparent;

        & ~ span {
          color: var(--blue);
        }
      }
    }
  }
}
</style>
