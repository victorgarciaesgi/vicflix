<template>
  <a :to="href" @click="navigate">
    <slot />
  </a>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator';

@Component({})
export default class TabLink extends Vue {
  @Prop() isActive!: boolean;
  @Prop() isExactActive!: boolean;
  @Prop() href!: any;
  @Prop() exact!: boolean;
  @Prop() navigate!: () => void;

  get isRealyActive() {
    if (this.exact) return this.isExactActive;
    return this.isActive;
  }

  @Watch('isRealyActive', { immediate: true }) activeChanged(value: boolean) {
    if (value) {
      this.$emit('active');
    }
  }
}
</script>
