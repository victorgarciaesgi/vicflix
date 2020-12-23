<template>
  <div class="Info / flex flex-row items-center justify-center my-2">
    <div :class="[type]" class="Bubble / px-4 py-2 text-xs font-semibold text-center rounded-lg">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import Colors from '@colors';

@Component
export default class InfoMessage extends Vue {
  @Prop({ default: 'info' }) type!: 'info' | 'warning' | 'error' | 'success';
  @Prop({ required: false }) title?: string;

  $refs: {
    info: HTMLElement;
  } = this.$refs;
}
</script>

<style lang="postcss" scoped>
div.Info {
  div.Bubble {
    opacity: 0.9;

    &.error {
      color: white;
      background-color: var(--redError);
    }
    &.warning {
      color: white;
      background-color: var(--orange);
    }
    &.success {
      color: white;
      background-color: var(--green);
    }
    &.info {
      color: var(--text1);
      background-color: var(--text1);
    }
  }
}
</style>
