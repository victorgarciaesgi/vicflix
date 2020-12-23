<template>
  <FormElementBase v-bind="baseProps">
    <div class="input-container">
      <div v-if="data.style && data.style.icon" class="icon">
        <SvgIcon :src="data.style.icon" :size="22" :color="iconColorProps" />
      </div>
      <textarea
        :id="formId"
        ref="input"
        :value="formatedValue"
        :readonly="data.readonly"
        :placeholder="placeholder"
        :disabled="data.disabled"
        :name="name"
        class="input-form"
        tabindex="0"
        @focus="handleFocus()"
        @blur="handleBlur()"
        @input="updateValue($event.target.value)"
      />
    </div>
  </FormElementBase>
</template>

<script lang="ts">
import { Component, Mixin, Mixins } from 'vue-mixin-decorator';
import { FormMixin } from '@mixins';

@Component
export default class AreaElement extends FormMixin {}
</script>
