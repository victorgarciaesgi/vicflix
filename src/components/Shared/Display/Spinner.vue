<template>
  <div class="center relative" :style="containerSize">
    <div class="Spinner absolute top-0 left-0 w-full h-full" :style="spinnerProps"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import Colors from '@colors';
@Component
export default class Spinner extends Vue {
  @Prop({ default: 'currentColor' })
  color!: string;
  @Prop({ default: 0 }) size!: number;
  @Prop() full?: boolean;

  get containerSize() {
    return {
      width: this.size ? `${this.size}px` : '100%',
      height: this.size ? `${this.size}px` : null,
      ...(!this.size && { paddingTop: '100%' }),
    };
  }

  get spinnerProps() {
    return {
      borderWidth: this.borderWidth + 'px',
      color: this.activeColor,
    };
  }

  get borderWidth() {
    if (this.size > 30) return 3;
    if (this.size > 40) return 4;
    return 2;
  }

  get activeColor(): string {
    if (typeof this.color === 'string') {
      return Colors[this.color] || this.color;
    } else if (this.color != null) {
      let keys = Object.keys(this.color);
      let filtered = keys.filter((key) => this.color[key]);
      return filtered[0] || this.color;
    } else {
      return this.color;
    }
  }
}
</script>

<style lang="postcss" scoped>
.Spinner {
  display: inline-block;
  color: currentcolor;
  margin-right: 0px;
  border-width: 2px;
  border-color: currentcolor currentcolor transparent transparent;
  border-style: solid;
  border-radius: 9999px;
  animation: 0.45s linear 0s infinite normal none running animation-spinner;
}

@keyframes animation-spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
