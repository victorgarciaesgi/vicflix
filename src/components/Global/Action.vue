<template>
  <component
    :is="getComponentType"
    ref="button"
    tabindex="0"
    class="ActionButton leading-1 flex"
    v-bind="getAttrs"
    :class="getClass"
    @click="handleClick"
  >
    <div v-if="icon" class="ButtonIcon mr-2" :class="{ 'pr-1 ml-1': !isOnlyIcon }">
      <SvgIcon :key="icon" :src="icon" color="currentColor" :size="getIconSize" />
    </div>
    <span v-if="$slots.default || $scopedSlots.default" class="ButtonText">
      <slot :loading="isLoading" />
    </span>
    <Spinner v-if="isLoading" :size="getSpinnerSize" class="ButtonSpinner mr-1" />
  </component>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue, Ref } from 'nuxt-property-decorator';
import { ButtonEffect, ButtonSizes, ButtonTheme, ButtonType } from '@models';
import { debounce } from 'lodash-es';
import { FormGroup, FormShape } from '@constructors';

@Component({})
export default class Action extends Vue {
  @Prop({ type: Boolean, default: false }) loading!: boolean;
  @Prop({ required: false, type: Boolean }) disabled?: boolean;
  @Prop({ type: String, default: ButtonType.Button }) type!: ButtonType;
  @Prop({ required: false, type: String }) icon?: string;
  @Prop({ type: String, default: ButtonTheme.Default }) theme!: ButtonTheme;
  @Prop({ type: String, required: false }) textColor?: ButtonTheme;
  @Prop({ type: String, default: ButtonSizes.lg }) size!: ButtonSizes;
  @Prop({ type: [String, Object], required: false }) to?: string | Location;
  @Prop({ type: [Function, Promise], required: false }) handler?: () => void | Promise<unknown>;
  @Prop({ type: Boolean, default: true }) shadow!: boolean;
  @Prop({ required: false, type: String }) formName?: string;
  @Prop({ required: false, type: Boolean }) wFull?: boolean;
  @Prop({ required: false, type: Boolean }) externalLink?: boolean;
  @Prop({ type: [FormShape, Array, FormGroup], required: false }) form?:
    | FormShape
    | FormShape[]
    | FormGroup<any>;
  @Prop({ required: false, type: String }) effect?: ButtonEffect;

  private localLoading = false;
  public formId: string | null = null;

  get isLoading() {
    return this.loading || this.localLoading;
  }

  get buttonType(): ButtonType | null {
    if (this.form || this.formId) {
      return ButtonType.Submit;
    } else if (!this.to) {
      return this.type;
    }
    return null;
  }

  get formNameLink(): string | null {
    if (this.formName) {
      return this.formName;
    } else if (this.form && this.form instanceof FormShape) {
      return this.form.id;
    }
    return null;
  }

  @Ref() button!: HTMLElement | Vue;

  get getComponentType() {
    if (this.to && !this.externalLink) return 'NuxtLink';
    else if (this.to && this.externalLink) return 'a';
    else return 'button';
  }

  get getAttrs() {
    return {
      ...(this.to && !this.externalLink && { to: this.to }),
      ...(this.to && this.externalLink && { href: this.to, target: '_blank' }),
      type: this.buttonType,
      form: this.formNameLink,
    };
  }

  get isOnlyIcon() {
    return !!this.icon && !(!!this.$slots.default || !!this.$scopedSlots.default);
  }

  get getClass() {
    return [
      `theme-${this.theme}`,
      `size-${this.size}`,
      ...(this.effect ? [`effect-${this.effect}`] : []),

      ...(this.textColor ? [`textColor-${this.textColor}`] : []),
      {
        wFull: this.wFull,
        loading: this.isLoading,
        disabled: this.isDisabled,
        onlyIcon: this.isOnlyIcon,
        hasIcon: !!this.icon,
        'has-shadow': this.shadow,
      },
    ];
  }

  get getIconSize() {
    if (this.size === ButtonSizes.sm) return 14;
    else if (this.size === ButtonSizes.md) return 20;
    else if (this.size === ButtonSizes.lg) return 28;
    return 24;
  }

  get getSpinnerSize() {
    if (this.size === ButtonSizes.sm) return 12;
    else if (this.size === ButtonSizes.md) return 14;
    else if (this.size === ButtonSizes.lg) return 16;
    return 20;
  }

  get isDisabled() {
    if (this.disabled) {
      return this.disabled;
    } else if (this.form) {
      if (Array.isArray(this.form)) {
        if (this.form.every((form) => form.editMode)) {
          return this.form.every((form) => form.isInvalid);
        } else {
          return this.form.some((form) => !form.isValid);
        }
      } else {
        return !this.form.isValid;
      }
    }
    return false;
  }

  async handleClick(event: Event) {
    if (this.to && !this.externalLink) {
      event.preventDefault();
    } else if (!this.isLoading && !this.isDisabled && !this.form && this.handler) {
      this.processOperation();
    } else if (this.isDisabled) {
      event.preventDefault();
      this.$emit('disabled-click', event);
      if (this.form) {
        if (this.form instanceof FormGroup) {
          return this.form.$touchAll();
        } else if (Array.isArray(this.form)) {
          return this.form.forEach((form) => form.$v?.$touch());
        } else {
          return this.form.$v?.$touch();
        }
      }
    } else {
      this.$emit('click', event);
    }
  }

  // Call the handle prop on submit or click if the button is not disabled
  async processOperation(event?: Event) {
    if (event) event.preventDefault();
    if (this.handler && !this.isDisabled) {
      try {
        this.localLoading = true;
        await this.handler();
      } catch (e) {
        console.log(e);
      } finally {
        this.localLoading = false;
      }
    }
  }

  mounted() {
    if (this.formName) this.formId = this.formName;
    else if (this.form && this.form instanceof FormShape) {
      this.formId = this.form.id;
    }
    if (this.formId) {
      const formRef = document.getElementById(this.formId);
      if (formRef) {
        formRef.addEventListener('submit', this.processOperation);
      }
    }
  }
  beforeDestroy() {
    if (this.formId) {
      const formRef = document.getElementById(this.formId);
      if (formRef) {
        formRef.removeEventListener('submit', this.processOperation);
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.ActionButton {
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex: 0 0 auto;
  margin: 0 5px;
  width: fit-content;
  cursor: pointer;
  outline: none;
  user-select: none;
  border-radius: 50px;
  transition-property: box-shadow, transform, background-color, border-color;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
  font-weight: 600;
  border-width: 1px;
  border-style: solid;

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }

  /* Size */
  &.size {
    &-sm {
      border-radius: 6px;
      font-size: 12px;
      padding: 5px 10px;
      font-weight: 500;
      span {
        padding: 0 4px;
      }
    }
    &-md {
      border-radius: 6px;
      font-size: 14px;
      padding: 8px 14px;
      font-weight: 500;
      span {
        padding: 0 5px;
      }
    }
    &-lg {
      border-radius: 6px;
      min-height: 37px;
      font-size: 16px;
      padding: 6px 16px;
      span {
        padding: 0 8px;
      }
    }
    &-xl {
      border-radius: 6px;
      padding: 10px 22px;
      min-height: 40px;
      @apply text-base;
      span {
        padding: 0 12px;
      }
    }
  }

  &:not(.onlyIcon).hasIcon {
    span {
      padding-left: 0px !important;
    }
  }

  &:focus {
    @apply ring-2;
  }

  /* Theme */
  &.theme {
    &-inverted {
      background-color: var(--text4);
      border-color: transparent;
      color: var(--bg1);
      &:hover,
      &:focus {
        background-color: var(--text5);
        @apply ring-text1;
      }
      &:active {
        background-color: var(--text6);
      }
    }

    &-default {
      background-color: var(--bg1);
      border-color: var(--bg5);
      color: var(--text8);
      &:hover,
      &:focus {
        background-color: var(--bg2);
        @apply ring-w220;
      }
      &:active {
        background-color: var(--bg3);
      }
    }

    &-white {
      background-color: white;
      border-color: var(--w235);
      color: var(--g40);
      &:hover,
      &:focus {
        background-color: var(--w245);
        @apply ring-w220;
      }
      &:active {
        background-color: var(--w230);
      }
    }

    &-gray {
      background-color: var(--w150);
      border-color: var(--w150);
      color: white;
      &:hover,
      &:focus {
        background-color: var(--w130);
        @apply ring-white;
      }
      &:active {
        background-color: var(--w110);
      }
    }

    &-dark {
      background-color: var(--g40);
      border-color: transparent;
      color: white;
      @apply ring-white;

      &:hover,
      &:focus {
        background-color: var(--g50);
      }
      &:active {
        background-color: var(--g60);
      }
    }

    &-primary {
      background: var(--primary);
      color: white;
      border-color: transparent;
      /* &: hover;
      &:focus {
        background-color: var(--buttonRedHover);
      }
      &:active {
        background-color: var(--buttonRedActive);
      } */
    }

    &-red {
      background: var(--buttonRed);
      color: white;
      border-color: transparent;
      &:hover,
      &:focus {
        background-color: var(--buttonRedHover);
        @apply ring-red2;
      }
      &:active {
        background-color: var(--buttonRedActive);
      }
    }

    &-blue {
      background: var(--blue);
      border-color: transparent;
      border-width: 0;
      color: white;
      background-size: 100% 100%;
      &:hover,
      &:focus {
        background: var(--buttonBlueHover);
        @apply ring-blue2;
      }
      &:active {
        background: var(--buttonBlueActive);
      }
    }

    &-green {
      background: var(--buttonGreen);
      border-color: transparent;
      border-width: 0;
      color: white;
      background-size: 100% 100%;
      &:hover,
      &:focus {
        background: var(--buttonGreenHover);
        @apply ring-green2;
      }
      &:active {
        background: var(--buttonGreenActive);
      }
    }
  }

  /* Text Color */
  &.textColor {
    &-inverted {
      color: var(--text1);
      border-color: var(--text1);
    }

    &-default {
      color: var(--bg1);
      border-color: var(--bg1);
    }

    &-red {
      color: var(--red);
      /* border-color: var(--red); */
    }

    &-primary {
      color: var(--primary);
      /* border-color: var(--red); */
    }

    &-blue {
      color: var(--blue);
      /* border-color: var(--blue); */
    }
    &-green {
      color: var(--green);
      /* border-color: var(--green); */
    }
  }

  /* Icon Effect */

  &.effect {
    &-bump:active .ButtonIcon {
      animation: icon-bump 0.3s ease-in-out;
    }
    &-rotate:active .ButtonIcon {
      animation: icon-rotate 0.3s ease-in-out;
    }
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
  &.wFull {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
  }
}
</style>
