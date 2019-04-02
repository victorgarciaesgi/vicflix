<template>
  <div class="input-box" :class="{ noMargin: data.noMargin, halfWidth: data.halfWidth }">
    <label v-if="label" :for="formId" class="input-label">
      {{ label }}
    </label>
    <div
      class="input-container"
      :class="{
        formError: !valid && dirty && data.error && !isPending,
        formValid: valid && dirty && data.error && !isPending,
        disabled: data.disabled,
      }"
    >
      <div v-if="data.icon" class="icon">
        <SvgIcon
          :src="data.icon"
          :size="22"
          :color="{
            [css.primary]: valid && dirty && data.error && !isPending,
            [css.red]: !valid && dirty && data.error && !isPending,
            [css.grey]: true,
          }"
        />
      </div>
      <input
        ref="input"
        class="input-form"
        :id="formId"
        :type="data.type"
        :value="formatedValue"
        :readonly="data.noEdit"
        :placeholder="placeholder"
        :disabled="data.disabled"
        @focus="handleFocus()"
        @blur="handleBlur()"
        @input="updateValue($event.target.value)"
      />
    </div>
    <FormError v-if="vl && data.error" :vl="vl" :data="data" />
  </div>
</template>

<script lang="ts">
import { Component, Mixin, Mixins } from 'vue-mixin-decorator';
import { FormMixin } from '../../Mixins/FormMixin';
import FormError from './FormError.vue';

@Component({
  components: {
    FormError,
  },
})
export default class FormText extends FormMixin {}
</script>



<style lang='scss' scoped>
@import './styles/formStyles';
</style>

