<template>
  <div
    ref="root"
    class="h-36 flex w-64"
    @mouseenter="handleMouseEnter"
    @mouseleave="cancelMouseEnter"
  >
    <VImg :src="picture" class="rounded" />
    <img :src="logo" class="left-3 top-3 absolute w-6 h-6" />
    <Portal v-if="init" to="Preview-Outlet">
      <div
        v-show="showPreview"
        ref="preview"
        class="Preview / fixed top-0 left-0 flex flex-col overflow-hidden rounded shadow-lg"
        @mouseleave="handleMouseLeave"
      >
        <VImg ref="pictureRef" :src="picture" fill="both" type="default" />
        <img :src="logo" class="left-3 top-3 absolute w-6 h-6" />
        <div ref="previewBlock" class="Block / bg-bg2 flex flex-col">
          <h3>{{ project.title }}</h3>
          <span>Super ce projet!</span>

          <span>bla lflezflezjhfl </span>
        </div>
      </div>
    </Portal>
  </div>
</template>

<script lang="ts">
import { Project } from '@models';
import { Component, Vue, Prop, Ref } from 'nuxt-property-decorator';
import anime from 'animejs';
import { VImg } from '@components/Global';

@Component({})
export default class ProjectPlaceholder extends Vue {
  @Prop() project!: Project;

  @Ref() root!: HTMLDivElement;
  @Ref() preview?: HTMLDivElement;
  @Ref() pictureRef?: VImg;
  @Ref() previewBlock?: HTMLDivElement;

  public init = false;
  public rendered = false;
  public showPreview = false;
  public timeout: NodeJS.Timeout | null = null;

  get picture() {
    const match = /^(.+)(\.\w+)$/.exec(this.project.picture);
    if (match) {
      return `/projects/${match[1]}_placeholder${match[2]}`;
    }
    return null;
  }

  get logo() {
    return `/logos/${this.project.logo}`;
  }

  handleMouseEnter() {
    this.debounceDisplayPreview();
  }
  handleMouseLeave() {
    if (this.rendered) {
      this.debounceClosePreview();
    }
  }
  cancelMouseEnter() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  debounceDisplayPreview() {
    this.timeout = setTimeout(() => {
      this.displayPreview();
    }, 300);
  }

  debounceClosePreview() {
    this.timeout = setTimeout(() => {
      this.closePreview();
    }, 100);
  }

  async displayPreview() {
    if (this.timeout) clearTimeout(this.timeout);
    const rootPosition = this.root.getBoundingClientRect();
    this.init = true;
    this.showPreview = true;

    await Promise.all([this.$nextTick, Vue.nextTick]);
    if (this.preview && this.pictureRef && this.previewBlock && !this.rendered) {
      Object.assign(this.preview.style, {
        width: `${rootPosition.width}px`,
        transform: `translateX(${rootPosition.left}px) translateY(${rootPosition.top}px)`,
      });
      Object.assign((this.pictureRef.$el as HTMLDivElement).style, {
        height: `${rootPosition.height}px`,
      });
    }
    this.animateOpenPreview();
  }

  async animateOpenPreview() {
    if (this.preview) {
      this.rendered = true;
      const scaleZoom = 1.7;
      const { height, top } = this.preview.getBoundingClientRect();
      const initMesure = this.root.getBoundingClientRect();
      const h2 = height * scaleZoom;
      const t2 = initMesure.top - (h2 - height) / 2 + (height - initMesure.height) / 2;
      this.root.style.opacity = '0';
      anime({
        targets: this.preview,
        scale: scaleZoom,
        translateY: t2,
        duration: 200,
        easing: 'cubicBezier(.5, .05, .1, .3)',
      });
      anime({
        targets: this.previewBlock,
        duration: 200,
        opacity: 1,
        easing: 'cubicBezier(.5, .05, .1, .3)',
      });
    }
  }

  closePreview() {
    if (this.preview) {
      const { height, width, left, top } = this.root.getBoundingClientRect();
      anime({
        targets: this.preview,
        scale: 1,
        translateY: top,
        duration: 200,
        easing: 'cubicBezier(.5, .05, .1, .3)',
        complete: () => {
          this.root.style.opacity = '1';
          this.showPreview = false;
        },
      });
      anime({
        targets: this.previewBlock,
        duration: 200,
        opacity: 0,
        easing: 'cubicBezier(.5, .05, .1, .3)',
      });
    }
  }
}
</script>
