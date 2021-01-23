<template>
  <component
    :is="button ? 'button' : 'div'"
    :type="button ? 'button' : ''"
    class="svg-container"
    :class="{
      relativeSize: size,
      'cursor-pointer': button,
    }"
    :style="{
      ...(activeColor && { [type]: `${activeColor}!important`, color: `${activeColor}!important` }),
      height: `${calculatedHeight}`,
      width: `${calculatedWidth}`,
    }"
    @click="$emit('click', $event)"
    v-html="svgContent"
  ></component>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Ref } from 'nuxt-property-decorator';
import Colors from '@colors';

@Component({
  name: 'SvgIcon',
})
export default class SvgIcon extends Vue {
  public defaultColor = 'currentColor';

  @Prop({ required: true })
  src!: string;
  @Prop({ required: false })
  size?: number;
  @Prop({ type: [String, Object], required: false })
  color?: string | { [x: string]: boolean };
  @Prop({ required: false, type: Boolean }) button?: boolean;
  @Prop({ default: 'fill', required: false }) type!: 'fill' | 'stroke' | 'both';
  @Prop({ required: false, type: Number }) width?: number;
  @Prop({ required: false, type: Number }) height?: number;

  public svgContent: string | null = null;

  get isClickable() {
    return this.button;
  }

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

  get activeColor(): string {
    if (typeof this.color === 'string') {
      return Colors[this.color] || this.color;
    } else if (this.color != null) {
      let keys = Object.keys(this.color);
      let filtered = keys.filter((key) => this.color?.[key]);
      return Colors[filtered[0]] || filtered[0] || this.defaultColor;
    } else {
      return this.defaultColor;
    }
  }

  @Watch('src') srcChanged() {
    this.loadIcon();
  }

  loadIcon() {
    this.svgContent = require(`@assets/icons/${this.src}.svg`);
  }

  created() {
    this.loadIcon();
  }
}
</script>

<style lang="postcss">
.svg-container {
  flex: 0 0 auto;
  float: left;

  svg {
    height: 100%;
    width: 100%;
  }
}
</style>
