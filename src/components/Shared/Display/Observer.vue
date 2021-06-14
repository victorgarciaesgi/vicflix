<template>
  <div ref="observer" class="observer">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator';

@Component
export default class Observer extends Vue {
  @Prop({ default: false }) disabled!: boolean;
  @Prop({ default: '0px 0px 0px 0px' }) rootMargin!: string;

  public observer: IntersectionObserver | null = null;
  public visible = false;

  $refs!: {
    observer: HTMLDivElement;
  };

  @Watch('disabled')
  watchDisabled(newVal: boolean, oldVal: boolean) {
    if (this.observer) {
      if (newVal) {
        this.observer.unobserve(this.$refs.observer);
      } else {
        this.observer.observe(this.$refs.observer);
      }
    }
  }

  updated() {
    if (this.observer) this.observer.observe(this.$refs.observer);
  }

  mounted() {
    if (!this.disabled && this.observer) {
      this.observer.observe(this.$refs.observer);
    }
    window.addEventListener('resize', this.updated);
  }

  handleIntersection(e: IntersectionObserverEntry) {
    if (e.isIntersecting) {
      this.visible = true;
      this.$emit('visible');
    } else {
      this.visible = false;
      this.$emit('hidden');
    }
  }

  created() {
    this.observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(this.handleIntersection);
      },
      {
        rootMargin: this.rootMargin,
      }
    );
  }
  destroyed() {
    if (this.observer) this.observer.disconnect();
    window.removeEventListener('resize', this.updated);
  }
}
</script>
