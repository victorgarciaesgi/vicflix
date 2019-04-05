<template>
  <div
    class="svg-container"
    v-html="svgContent"
    :class="{ relative: size, pointer }"
    @click="$emit('click', $event)"
    :style="{
      [type]: `${activeColor}!important`,
      height: `${size}px`,
      width: `${size}px`,
    }"
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
  public defaultColor = '#3C3C3C';
  @Prop({ required: true })
  src!: string;
  @Prop({ required: false, default: 20 })
  size!: number;
  @Prop({ required: false, default: '#3C3C3C', type: [String, Object] })
  color;
  @Prop() pointer!: boolean;
  @Prop({ default: 'fill' }) type: 'fill' | 'stroke';

  private svgContent = null;

  get activeColor() {
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

  async loadIcon() {
    const { data } = await Axios.get(require('@assets/' + this.src));
    this.svgContent = data;
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
}
</style>

