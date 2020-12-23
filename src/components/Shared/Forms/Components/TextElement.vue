<template>
  <FormElementBase v-bind="baseProps">
    <div class="input-container">
      <div v-if="data.style && data.style.icon" class="icon">
        <SvgIcon :src="data.style.icon" :size="22" :color="iconColorProps" />
      </div>
      <input
        ref="input"
        v-bind="inputProps"
        :type="data.type"
        class="input-form"
        tabindex="0"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="updateValue($event.target.value)"
      />
      <div v-if="isPending" class="icon">
        <Spinner :size="14" />
      </div>
    </div>
  </FormElementBase>
</template>

<script lang="ts">
import { Component } from 'vue-mixin-decorator';
import { FormMixin } from '@mixins';
import { DefaultFieldArgs, TextField, UnPackField } from '@constructors';

@Component
export default class TextElement extends FormMixin {
  data!: UnPackField<TextField<any>>;
}
</script>
