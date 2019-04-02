<template>
  <component
    class="button"
    :is="to ? 'router-link' : 'button'"
    :to="to"
    @click="emitClick($event)"
    :type="type"
    :class="[theme, size, { submitting, loading, disabled, rounded, justIcon }]"
  >
    <span class="text">
      <slot />
    </span>
    <img class="loading" :src="getLoader" :height="getSize" :width="getSize" />
  </component>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Model } from 'vue-property-decorator';
import { Location } from 'vue-router';

@Component({})
export default class FormButton extends Vue {
  @Prop({ required: false })
  submitting!: boolean;
  @Prop({ required: false })
  disabled!: boolean;
  @Prop({ required: false, default: 'button' })
  type!: string;
  @Prop()
  to!: string | Location;
  @Prop({ default: 'primary' })
  theme!: 'primary' | 'red' | 'white';
  @Prop({ default: 'little' })
  size!: 'mini' | 'little' | 'medium' | 'large';
  @Prop({ default: false }) rounded!: boolean;
  @Prop() justIcon!: boolean;
  @Prop() handler: () => void;

  private loading = false;

  private css = require('@css');

  get getSize() {
    if (this.size === 'mini') return 16;
    return 20;
  }

  get getLoader() {
    if (this.theme === 'white') return require('@images/loading_blue.svg');
    else if (this.theme === 'primary') return require('@images/loading_white.svg');
    else return require('@images/loading_blue.svg');
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
  border-radius: 40px;
  text-align: center;
  cursor: pointer;
  outline: none;
  @include userselect;
  background-color: $w235;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: box-shadow 0.3s, transform 0.3s;

  &.mini {
    min-height: 25px;
    font-size: 14px;
    font-weight: normal;
    padding: 3px 10px 3px 10px;
  }

  &.little {
    min-height: 30px;
    font-size: 16px;
    font-weight: normal;
    padding: 5px 14px 5px 14px;
  }

  &.medium {
    min-height: 32px;
    font-size: 20px;
    padding: 8px 25px 8px 25px;
  }

  &.large {
    min-height: 40px;
    font-size: 22px;
    padding: 10px 30px 10px 30px;
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

  &.white {
    span.text {
      color: $primary;
      font-weight: bold;
    }
    &:not(.disabled):hover {
      span.text {
        color: $primary;
      }
    }
  }

  &.red {
    span.text {
      color: $red1;
      font-weight: bold;
    }
  }

  &.primary {
    background-color: $primary;
    span.text {
      color: white;
      font-weight: bold;
    }
  }
}
</style>

