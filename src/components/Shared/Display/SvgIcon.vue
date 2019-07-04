<template>
  <!-- eslint-disable -->
  <div
    class="svg-container"
    :class="{ relative: size, pointer }"
    :style="{
      [type]: `${activeColor}!important`,
      height: `${size}px`,
      width: `${size}px`,
    }"
    @click="$emit('click', $event)"
    v-html="svgContent"
  ></div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Axios from 'axios';
import Colors from '@colors';
import { Partial } from 'lodash';

@Component({
  name: 'SvgIcon',
})
export default class SvgIcon extends Vue {
  public defaultColor = Colors.g90;
  @Prop({ required: true })
  src!: string;
  @Prop({ required: false, default: 20 })
  size!: number;
  @Prop({ required: false, default: Colors.g90, type: [String, Object] })
  color;
  @Prop() pointer!: boolean;
  @Prop({ default: 'fill' }) type: 'fill' | 'stroke';

  public svgContent = null;

  $refs: {
    svgObject: HTMLObjectElement;
  };

  get activeColor(): string {
    if (typeof this.color === 'string') {
      return Colors[this.color] || this.color;
    } else if (this.color != null) {
      let keys = Object.keys(this.color);
      let filtered = keys.filter(key => this.color[key]);
      return filtered[0] || this.defaultColor;
    } else {
      return this.defaultColor;
    }
  }

  @Watch('src') srcChanged() {
    this.loadIcon();
  }

  loadIcon() {
    this.svgContent = require('@assets/' + this.src);
  }

  created() {
    this.loadIcon();
  }
}
</script>

<style lang="scss">
.svg-container {
  display: flex;
  flex: 0 0 auto;
  position: relative;
  align-items: center;
  float: left;

  &.relative svg {
    height: 100%;
    width: 100%;
  }

  &.pointer {
    cursor: pointer;
  }

  svg {
    transition: fill 0.2s, stroke 0.2s;
  }
}
</style>
