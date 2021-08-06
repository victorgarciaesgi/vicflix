<template>
  <div class="PlaceholderAnimatedItem / flex flex-col">
    <div
      ref="root"
      class="RootCard / h-36 flex w-full cursor-pointer"
      :data-show="showPreview"
      @mouseenter.stop="handleMouseEnter"
      @mouseleave="cancelMouseEnter"
    >
      <slot name="card" />

      <Portal v-if="init" to="Preview-Outlet">
        <div
          v-show="showPreview"
          :id="baseInfo.id"
          ref="preview"
          class="Preview / fixed top-0 left-0 flex flex-col bg-transparent rounded"
          :data-show="showPreview"
          @mouseleave="handleMouseLeave"
          @mousemove.stop
          @click="navigateToPreview"
          :class="{ 'cursor-pointer': previewLink }"
        >
          <div
            class="relative overflow-hidden"
            style="-webkit-backface-visibility: hidden; -webkit-transform: perspective(1000px)"
          >
            <div ref="pictureRef" class="relative w-full rounded-t rounded-tl">
              <slot name="picture" />
            </div>
            <slot name="preview" />
          </div>
          <div
            ref="previewBlock"
            class="bg-bg2 flex flex-col p-2 -mt-1 rounded-bl rounded-br opacity-0"
          >
            <slot name="previewBlock" />
          </div>
        </div>
      </Portal>
    </div>
    <div v-if="videoProgress && showProgress" class="flex flex-col items-center justify-center h-4">
      <div class="bg-g90 flex w-3/4 rounded" style="height: 3px">
        <div
          class="bg-red absolute top-0 left-0 h-full rounded"
          :style="{ width: `${videoProgress.percentage}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { BaseItemInterface, ProgressList, Project, routerPagesNames } from '@models';
import { Component, Vue, Prop, Ref } from 'nuxt-property-decorator';
import anime from 'animejs';
import { Location } from 'vue-router';
import Techno from './Techno.vue';
import ProjectVideoProgress from './ProjectVideoProgress.vue';
import { EventBus, Events } from '@services';
import { cubicTransition } from '@constants';

@Component({
  components: {
    Techno,
    ProjectVideoProgress,
  },
})
export default class PlaceholderAnimatedItem extends Vue {
  @Prop({ required: true }) baseInfo!: BaseItemInterface;
  @Prop({ required: false }) picture?: string;
  @Prop({ required: false }) logo?: string;
  @Prop({ required: false }) videoProgress?: ProgressList;
  @Prop({ default: false, type: Boolean }) showProgress!: boolean;
  @Prop({ default: true }) inCarrousel!: boolean;
  @Prop({ required: false }) previewLink?: Location;

  @Ref() root!: HTMLDivElement;
  @Ref() preview?: HTMLDivElement;
  @Ref() pictureRef?: HTMLDivElement;
  @Ref() previewBlock?: HTMLDivElement;

  public init = false;
  public rendered = false;
  public showPreview = false;
  public openTimeout: NodeJS.Timeout | null = null;
  public closeTimeout: NodeJS.Timeout | null = null;
  public scaleZoom = 1.5;

  navigateToPreview() {
    if (this.previewLink) {
      this.$router.push(this.previewLink);
    }
  }

  //! Animations

  handleMouseEnter() {
    this.debounceDisplayPreview();
  }
  handleMouseLeave() {
    if (this.rendered) {
      this.debounceClosePreview();
      window.removeEventListener('mousemove', this.closePreview);
    }
  }
  cancelMouseEnter() {
    if (this.openTimeout) clearTimeout(this.openTimeout);
    if (this.closeTimeout) clearTimeout(this.closeTimeout);
  }

  debounceDisplayPreview() {
    if (this.openTimeout) clearTimeout(this.openTimeout);
    if (this.closeTimeout) clearTimeout(this.closeTimeout);
    this.openTimeout = setTimeout(() => {
      this.displayPreview();
    }, 300);
  }

  debounceClosePreview() {
    if (this.closeTimeout) clearTimeout(this.closeTimeout);
    if (this.openTimeout) clearTimeout(this.openTimeout);
    this.closeTimeout = setTimeout(() => {
      this.closePreview();
    }, 100);
  }

  getTranslateValues() {
    const previewRect = this.preview!.getBoundingClientRect();
    const rootRect = this.root.getBoundingClientRect();
    const limitDistanceBorder = this.inCarrousel ? 52 : 10;

    const previewWidthScale = previewRect.width * this.scaleZoom;
    const positionPreviewLeft = rootRect.left - (previewWidthScale - rootRect.width) / 2;
    let finalTranslateX = previewRect.left;
    if (positionPreviewLeft < limitDistanceBorder) {
      finalTranslateX = finalTranslateX + limitDistanceBorder - positionPreviewLeft;
    } else if (positionPreviewLeft + previewWidthScale > window.innerWidth - limitDistanceBorder) {
      finalTranslateX =
        finalTranslateX -
        (positionPreviewLeft + previewWidthScale - window.innerWidth) -
        limitDistanceBorder;
    }
    const previewHeightScale = previewRect.height * this.scaleZoom;
    const previewMarginTop = (previewHeightScale - previewRect.height) / 2;
    const yPadding = (previewHeightScale - rootRect.height) / 2 - previewMarginTop;
    const finalTranslateY = rootRect.top - yPadding;

    return { finalTranslateX, finalTranslateY };
  }

  async displayPreview() {
    if (this.openTimeout) clearTimeout(this.openTimeout);
    if (this.root) {
      const rootPosition = this.root.getBoundingClientRect();
      await Promise.all([this.awaitImageLoad(this.picture), this.awaitImageLoad(this.logo)]);
      this.init = true;
      this.showPreview = true;
      EventBus.$emit(Events.ClosePreviews);
      EventBus.$on(Events.ClosePreviews, this.closePreview);
      window.addEventListener('mousemove', this.closePreview);

      await Promise.all([this.$nextTick, Vue.nextTick]);
      if (this.preview && this.pictureRef && this.previewBlock) {
        Object.assign(this.preview.style, {
          width: `${rootPosition.width}px`,
          transform: `translateX(${rootPosition.left}px) translateY(${rootPosition.top}px)`,
        });
        Object.assign(this.pictureRef.style, {
          height: `${rootPosition.height}px`,
        });
      }
      this.animateOpenPreview();
    }
  }

  async awaitImageLoad(src?: string) {
    if (src) {
      return new Promise((resolve, reject) => {
        const placeholderImage = new Image();
        placeholderImage.onload = resolve;
        placeholderImage.onerror = reject;
        placeholderImage.src = src;
      });
    }
    return;
  }

  async animateOpenPreview() {
    if (this.preview) {
      this.rendered = true;

      const { finalTranslateX, finalTranslateY } = this.getTranslateValues();
      if (this.preview) this.preview.classList.add('hasShadow');

      if (this.previewBlock) {
        anime({
          targets: this.preview,
          scale: this.scaleZoom,
          translateY: finalTranslateY,
          translateX: finalTranslateX,
          duration: 250,
          easing: 'easeOutQuad',
          complete: () => {
            if (this.root) {
              this.root.style.opacity = '0';
            }
          },
        });
        anime({
          targets: this.previewBlock,
          duration: 50,
          opacity: 1,
          easing: 'easeOutQuad',
        });
      }
    }
  }

  recalculatePreviewPosition() {
    if (this.preview) {
      const previewRect = this.preview.getBoundingClientRect();
      const rootRect = this.root.getBoundingClientRect();
      const ph = previewRect.height;
      const mt = (ph - previewRect.height / this.scaleZoom) / 2;
      const yPadding = (ph - rootRect.height) / 2 - mt;

      const style = window.getComputedStyle(this.preview);
      var { m41 } = new DOMMatrix(style.transform);

      Object.assign(this.preview.style, {
        transform: `translateX(${m41}px) translateY(${rootRect.top - yPadding}px) scale(${
          this.scaleZoom
        })`,
      });
    }
  }

  closePreview() {
    if (this.preview) {
      EventBus.$off(Events.ClosePreviews, this.closePreview);
      const { height, width, left, top } = this.root.getBoundingClientRect();
      if (this.preview) this.preview.classList.remove('hasShadow');
      window.removeEventListener('mousemove', this.closePreview);
      anime({
        targets: this.preview,
        scale: 1,
        translateY: top,
        translateX: left,
        duration: 250,
        easing: 'easeOutQuad',
        complete: () => {
          this.root.style.opacity = '1';
          this.showPreview = false;
        },
      });
      anime({
        targets: this.previewBlock,
        duration: 200,
        opacity: 0,
        easing: 'easeOutQuad',
      });
    }
  }

  mounted() {
    window.addEventListener('scroll', this.recalculatePreviewPosition);
  }
  beforeDestroy() {
    window.removeEventListener('scroll', this.recalculatePreviewPosition);
  }
}
</script>

<style lang="postcss" scoped>
.Preview {
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: -1;
    box-shadow: 0 0 15px 5px rgba(0, 0, 0, 0.4);
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    background-color: transparent;
    @apply rounded;
  }

  &.hasShadow {
    &::after {
      opacity: 1;
    }
  }
}
</style>
