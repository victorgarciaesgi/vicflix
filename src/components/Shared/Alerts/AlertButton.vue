<template>
  <component
    :is="link ? 'router-link' : 'button'"
    class="button"
    :to="to"
    :type="type"
    :class="[{ submitting, disabled }, colorClass]"
    :style="getColorTheme"
    @click.stop="emitClick($event)"
  >
    <img v-if="!!icon" :src="icon" />
    <span :style="{ color: spanColor }">
      <slot></slot>
    </span>
    <SvgIcon v-if="colorTheme" class="loading" src="images/loading_white.svg" :size="18" />
    <SvgIcon v-else class="loading" src="images/loading_blue.svg" :size="18" />
  </component>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Model } from 'vue-property-decorator';
import { Location } from 'vue-router';

@Component({})
export default class AlertButton extends Vue {
  @Prop({ required: false })
  submitting: boolean;
  @Prop({ required: false })
  disabled: boolean;
  @Prop({ required: false, default: 'button' })
  type: string;
  @Prop({ required: false })
  icon: string;
  @Prop({ required: false })
  theme: string;
  @Prop({ required: false })
  color: string;
  @Prop()
  link: boolean;
  @Prop([String, Object])
  to: string | Location;

  @Prop()
  colorTheme: string;

  public css = require('@css');

  get getColorTheme() {
    if (!this.colorTheme) return null;
    return {
      color: 'white',
      backgroundColor: this.colorTheme,
    };
  }

  emitClick(event: Event) {
    if (this.link) {
      event.preventDefault();
    } else if (!this.submitting && !this.disabled) {
      if (this.type === 'button') this.$emit('click');
      else if (this.type == 'submit') this.$emit('submit');
    } else if (this.disabled) {
      event.preventDefault();
      this.$emit('disabledClick');
    } else {
      event.preventDefault();
    }
  }

  get colorClass() {
    return this.theme || '';
  }

  get spanColor() {
    return this.color || this.colorTheme ? 'white' : false || null;
  }
}
</script>

<style lang="scss" scoped>
.button {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex: 0 0 auto;
  height: auto;
  border-radius: 4px;
  margin: 0 5px 0 5px;
  text-align: center;
  cursor: pointer;
  outline: none;
  border: 1px solid transparent;
  padding: 6px 13px 6px 13px;
  transition: all 0.3s;
  @include userselect;

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    font-size: 15px;
    color: $g60;
    font-weight: bold;
    text-transform: uppercase;

    >>> img,
    .svg-container {
      margin-right: 5px;
    }
  }

  .loading {
    display: none;
    margin-left: 6px;
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  &.submitting {
    cursor: wait;
    .loading {
      display: flex;
    }
  }

  &:hover {
    background-color: $w240;
  }

  &:active {
    background-color: $w220;
  }

  &.blue span {
    color: $primary;
  }
  &.red span {
    color: $red1;
  }
  &.yellow span {
    color: $yellow;
  }
}
</style>
