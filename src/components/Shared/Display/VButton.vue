<template>
  <component
    class="button"
    :is="to ? 'router-link' : 'button'"
    :to="to"
    @click="emitClick($event)"
    :type="type"
    ref="button"
    :class="[theme, size, { submitting, loading, disabled, rounded, justIcon }]"
  >
    <span class="text">
      <slot />
    </span>
    <Spinner class="loading" :color="getLoaderColor" :size="getSize" />
  </component>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Model } from 'vue-property-decorator';
import { Location } from 'vue-router';
import Colors from '@colors';

@Component({})
export default class VButton extends Vue {
  @Prop({ required: false })
  submitting!: boolean;
  @Prop({ required: false })
  disabled!: boolean;
  @Prop({ required: false, default: 'button' })
  type!: string;
  @Prop()
  to!: string | Location;
  @Prop({ default: 'dark' })
  theme!: 'red' | 'dark' | 'white';
  @Prop({ default: 'little' })
  size!: 'mini' | 'little' | 'medium' | 'large';
  @Prop({ default: false }) rounded!: boolean;
  @Prop() justIcon!: boolean;
  @Prop() handler: () => void;

  private loading = false;

  $refs: {
    button: HTMLElement;
  };

  get getSize() {
    if (this.size === 'mini') return 16;
    return 20;
  }

  get themeVars(): { bg: string; text: string } {
    if (this.theme === 'red') {
      return {
        bg: Colors.red1,
        text: 'white',
      };
    } else if (this.theme === 'dark') {
      return {
        bg: 'rgb(60, 60, 60, 0.8)',
        text: 'white',
      };
    }
  }

  get getLoaderColor() {
    if (this.theme === 'red') return 'white';
    else if (this.theme === 'dark') return 'white';
    else if (this.theme === 'white') return 'g60';
  }

  async emitClick(event: Event) {
    if (this.to) {
      event.preventDefault();
    } else if (!this.submitting && !this.disabled) {
      if (this.handler) {
        try {
          this.loading = true;
          await this.handler();
        } finally {
          this.loading = false;
        }
      } else {
        if (this.type == 'button') this.$emit('click', event);
        else if (this.type == 'submit') this.$emit('submit', event);
      }
    } else if (this.disabled) {
      event.preventDefault();
      this.$emit('disabledClick', event);
    } else {
      event.preventDefault();
    }
  }

  mounted() {
    this.$refs.button.style.setProperty('--button-bg', this.themeVars.bg);
    this.$refs.button.style.setProperty('--button-text', this.themeVars.text);
  }
}
</script>



<style lang='scss' scoped>
.button {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex: 0 0 auto;
  width: fit-content;
  margin: 0 5px 0 5px;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  outline: none;
  @include userselect;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s, transform 0.3s;
  background-color: var(--button-bg);
  span {
    color: var(--button-text);
    text-shadow: 0 1px 3px var(--button-bg);
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    display: flex;
    align-items: center;
  }

  &.mini {
    min-height: 25px;
    font-size: 14px;
    font-weight: normal;
    padding: 3px 10px;
  }

  &.little {
    min-height: 30px;
    font-size: 14px;
    font-weight: normal;
    padding: 8px 25px;
  }

  &.medium {
    min-height: 32px;
    font-size: 20px;
    padding: 8px 25px;
  }

  &.large {
    min-height: 40px;
    font-size: 22px;
    padding: 10px 30px;
  }

  &.rounded {
    border-radius: 40px;
  }

  &.justIcon {
    width: auto;
    height: auto;
    padding: 5px;
    min-height: 0;
  }

  .loading {
    display: none;
    margin-left: 6px;
    width: 20px;
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  &.submitting,
  &.loading {
    cursor: wait;
    .loading {
      display: flex;
    }
  }

  &:active {
    transform: scale(0.95);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3), 0 0 10px inset $ombre;
  }

  // Themes
}
</style>

