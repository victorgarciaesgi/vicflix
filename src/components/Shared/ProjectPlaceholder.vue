<template>
  <div
    ref="root"
    class="h-36 flex w-64"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <VImg :src="picture" class="rounded" />
    <img :src="logo" class="left-3 top-3 absolute w-6 h-6" />
    <Portal v-if="init" to="Preview-Outlet">
      <div v-show="showPreview" ref="preview" :style="previewStyle" class="w-88 flex flex-col">
        <VImg :src="picture" class="rounded" />
        <img :src="logo" class="left-3 top-3 absolute w-6 h-6" />
      </div>
    </Portal>
  </div>
</template>

<script lang="ts">
import { Project } from '@models';
import { Component, Vue, Prop, Ref } from 'nuxt-property-decorator';

@Component({})
export default class ProjectPlaceholder extends Vue {
  @Prop() project!: Project;

  @Ref() root!: HTMLDivElement;
  @Ref() preview?: HTMLDivElement;

  public previewStyle: Partial<CSSStyleDeclaration> = {
    opacity: '0',
  };
  public init = false;
  public rendered = false;
  public showPreview = false;
  public timeout: NodeJS.Timeout | null = null;

  get picture() {
    return `/projects/${this.project.picture}`;
  }

  get logo() {
    return `/logos/${this.project.logo}`;
  }

  handleMouseEnter() {
    this.debounceDisplayPreview();
  }
  handleMouseLeave() {
    this.debounceClosePreview();
  }

  debounceDisplayPreview() {
    this.timeout = setTimeout(() => {
      this.displayPreview();
    }, 400);
  }

  debounceClosePreview() {
    this.timeout = setTimeout(() => {
      this.closePreview();
    }, 400);
  }

  displayPreview() {
    if (this.timeout) clearTimeout(this.timeout);
    const rootPosition = this.root.getBoundingClientRect();
    this.previewStyle = {
      transform: `translate3d(${rootPosition.left}px, ${rootPosition.top}px, 0)`,
    };
    this.init = true;
    this.rendered = true;
    this.$nextTick(() => {});
  }

  closePreview() {
    this.rendered = false;
  }
}
</script>
