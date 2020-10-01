<template>
  <component
    :is="getComponentType"
    ref="button"
    tabindex="0"
    class="ButtonAction leading-1 flex"
    v-bind="getAttrs"
    :class="getClass"
    @click="handleClick"
  >
    <div v-if="icon" class="ButtonIcon" :class="{ 'pr-1 ml-1': !isOnlyIcon }">
      <SvgIcon :src="icon" color="currentColor" :size="getIconSize" />
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

@Component
export default class Action extends Vue {
  @Prop({ type: Boolean, default: false }) loading!: boolean;
  @Prop(Boolean) disabled?: boolean;
  @Prop({ type: String, default: ButtonType.Button }) type!: ButtonType;
  @Prop(String) icon?: string;
  @Prop({ type: String, default: ButtonTheme.Default }) theme!: ButtonTheme;
  @Prop({ type: String }) textColor?: ButtonTheme;
  @Prop({ type: String, default: ButtonSizes.lg }) size!: ButtonSizes;
  @Prop({ type: [String, Object] }) to?: string | Location;
  @Prop({ type: [Function, Promise] }) handler?: () => Promise<unknown>;
  @Prop({ type: Boolean, default: true }) shadow!: boolean;
  @Prop(String) form?: string;
  @Prop(Boolean) wFull?: boolean;
  @Prop(Boolean) externalLink?: boolean;
  @Prop(String) effect?: ButtonEffect;

  private localLoading = false;

  get isLoading() {
    return this.loading || this.localLoading;
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
      ...(this.form && { form: this.form }),
      ...(!this.to && { type: 'button' }),
      ...(this.form && { type: 'submit' }),
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
    else if (this.size === ButtonSizes.md) return 18;
    else if (this.size === ButtonSizes.lg) return 22;
    return 24;
  }

  get getSpinnerSize() {
    if (this.size === ButtonSizes.sm) return 12;
    else if (this.size === ButtonSizes.md) return 14;
    else if (this.size === ButtonSizes.lg) return 16;
    return 20;
  }

  get isDisabled() {
    return this.disabled;
  }

  async handleClick(event: Event) {
    if (this.to && !this.externalLink) {
      event.preventDefault();
    } else if (!this.isLoading && !this.isDisabled && !this.form && this.handler) {
      this.processOperation();
    } else if (this.isDisabled) {
      event.preventDefault();
      this.$emit('disabled-click', event);
    } else {
      this.$emit('click', event);
    }
  }

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
    if (this.form) {
      const formRef = document.getElementById(this.form);
      if (formRef) {
        formRef.addEventListener('submit', this.processOperation);
      }
    }
  }
  beforeDestroy() {
    if (this.form) {
      const formRef = document.getElementById(this.form);
      if (formRef) {
        formRef.removeEventListener('submit', this.processOperation);
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.ButtonAction {
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
  font-size: 16px;
  transition-property: box-shadow, transform, background-color, border-color;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
  font-weight: 600;
  border-width: 1px;
  border-style: solid;

  &:first-of-type {
    margin-left: 0;
  }

  &:last-of-type {
    margin-right: 0;
  }

  /* Size */
  &.size {
    &-sm {
      border-radius: 4px;
      font-size: 12px;
      padding: 5px 5px;
      font-weight: 500;
      span {
        padding: 0 4px;
      }
    }
    &-md {
      border-radius: 6px;
      font-size: 14px;
      padding: 6px 6px;
      font-weight: 500;
      span {
        padding: 0 5px;
      }
    }
    &-lg {
      border-radius: 6px;
      min-height: 35px;
      padding: 6px 14px;
      @apply text-sm;
      span {
        padding: 0 8px;
      }
    }
    &-xl {
      border-radius: 8px;
      padding: 8px 16px;
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

  /* Theme */
  &.theme {
    &-inverted {
      background-color: var(--text4);
      border-color: transparent;
      color: var(--bg1);
      &:hover,
      &:focus {
        background-color: var(--text5);
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
      }
      &:active {
        background-color: var(--bg3);
      }
    }

    &-white {
      background-color: white;
      border-color: var(--w240);
      color: var(--g40);
      &:hover,
      &:focus {
        background-color: var(--w250);
      }
      &:active {
        background-color: var(--w245);
      }
    }

    &-dark {
      background-color: var(--g40);
      border-color: transparent;
      color: white;
      &:hover,
      &:focus {
        background-color: var(--g50);
      }
      &:active {
        background-color: var(--g60);
      }
    }

    &-red {
      background: var(--buttonRed);
      color: white;
      border-color: transparent;
      &:hover,
      &:focus {
        background-color: var(--buttonRedHover);
      }
      &:active {
        background-color: var(--buttonRedActive);
      }
    }

    &-blue {
      background: var(--blue);
      border-color: transparent;
      color: white;
      &:hover,
      &:focus {
        background: var(--buttonBlueHover);
      }
      &:active {
        background: var(--buttonBlueActive);
      }
    }

    &-green {
      background: var(--buttonGreen);
      border-color: transparent;
      color: white;
      &:hover,
      &:focus {
        background: var(--buttonGreenHover);
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
