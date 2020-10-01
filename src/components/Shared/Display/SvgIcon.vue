<template>
  <!-- eslint-disable -->
  <div
    class="svg-container"
    :class="{ relativeSize: size, pointer }"
    :style="{
      ...(activeColor && { [type]: `${activeColor}!important` }),
      height: `${calculatedHeight}`,
      width: `${calculatedWidth}`,
    }"
    @click="$emit('click', $event)"
    v-html="svgContent"
  ></div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Ref } from 'nuxt-property-decorator';
import Axios from 'axios';
import Colors from '@colors';

@Component({
  name: 'SvgIcon',
})
export default class SvgIcon extends Vue {
  public defaultColor = 'currentColor';
  @Prop({ required: true })
  src!: string;
  @Prop()
  size!: number;
  @Prop({ type: [String, Object] })
  color!: string | { [x: string]: boolean };
  @Prop(Boolean) pointer?: boolean;
  @Prop({ default: 'fill' }) type!: 'fill' | 'stroke' | 'both';
  @Prop() width?: number;
  @Prop() height?: number;

  get calculatedWidth() {
    if (this.width) return this.width + 'px';
    else if (this.height) return 'auto';
    else if (this.size) return this.size + 'px';
    else return undefined;
  }

  get calculatedHeight() {
    if (this.height) return this.height + 'px';
    else if (this.width) return 'auto';
    else if (this.size) return this.size + 'px';
    else return undefined;
  }

  public svgContent = null;

  get activeColor(): string {
    if (typeof this.color === 'string') {
      return Colors[this.color] || this.color;
    } else if (this.color != null) {
      let keys = Object.keys(this.color);
      let filtered = keys.filter((key) => this.color[key]);
      return Colors[filtered[0]] || filtered[0] || this.defaultColor;
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

<style lang="postcss">
.svg-container {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  float: left;

  svg {
    height: 100%;
    width: 100%;
  }

  &.pointer {
    cursor: pointer;
  }
}
</style>
