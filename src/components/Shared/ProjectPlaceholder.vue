<template>
  <div
    ref="root"
    class="ProjectPlaceholder / h-36 flex w-64 cursor-pointer"
    :data-show="showPreview"
    @mouseenter="handleMouseEnter"
    @mouseleave="cancelMouseEnter"
  >
    <VImg :src="picture" class="rounded" />
    <img :src="logo" class="left-3 top-3 absolute w-6 h-6" />
    <Portal v-if="init" to="Preview-Outlet">
      <div
        v-show="showPreview"
        :id="project.id"
        ref="preview"
        class="Preview / fixed top-0 left-0 flex flex-col overflow-hidden rounded cursor-pointer"
        :data-show="showPreview"
        @mouseleave="handleMouseLeave"
      >
        <VImg ref="pictureRef" :src="picture" fill="both" type="default" />
        <img :src="logo" class="left-3 top-3 absolute w-6 h-6" />
        <div ref="previewBlock" class="Block / bg-bg2 flex-nowrap flex flex-row p-2">
          <div class="flex flex-col flex-1">
            <h4 class="leading-5">{{ project.title }}</h4>
            <div class="text-text9 text-xxs flex flex-row items-center">
              <span>{{ project.type }}</span>
              <span class="px-1">•</span>
              <span>{{ project.year }}</span>
            </div>
            <div class="flex flex-row items-center justify-start">
              <Techno v-for="techno of project.technos" :key="techno" :techno="techno" size="md" />
            </div>
          </div>
          <div class="flex-nowrap flex-0 flex flex-row items-center">
            <Popin mode="hover" theme="white">
              <template #content>
                <span class="px-3 py-1 text-black">Lecture</span>
              </template>
              <template #button>
                <div class="center flex p-1 text-black bg-white border-2 border-white rounded-full">
                  <SvgIcon src="actions/play" :size="20" />
                </div>
              </template>
            </Popin>
            <Popin mode="hover" theme="white">
              <template #content>
                <span class="px-3 py-1 text-black">Plus d'infos</span>
              </template>
              <template #button>
                <NuxtLink
                  :to="toPreviewLink"
                  class="center bg-bg4 border-bg10 flex p-1 ml-1 text-white border-2 rounded-full"
                >
                  <SvgIcon src="actions/expand" :size="20" />
                </NuxtLink>
              </template>
            </Popin>
          </div>
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
import { Location } from 'vue-router';
import Techno from './Techno.vue';

@Component({
  components: {
    Techno,
  },
})
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
  get toPreviewLink(): Location {
    return {
      path: this.$route.path,
      query: {
        jbv: this.project.id,
      },
    };
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
    if (this.preview && this.pictureRef && this.previewBlock) {
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
      const scaleZoom = 1.5;
      const previewRect = this.preview.getBoundingClientRect();
      const rootRect = this.root.getBoundingClientRect();
      const ph = previewRect.height * scaleZoom;
      const mt = (ph - previewRect.height) / 2;
      const xPadding = (ph - rootRect.height) / 2 - mt;
      const ty = rootRect.top - xPadding;
      // console.log(ph, mt, pt, tY, xPadding, rootRect.top - xPadding);
      const placeholderImage = new Image();
      placeholderImage.onload = (ev) => {
        this.root.style.opacity = '0';
        anime({
          targets: this.preview,
          scale: scaleZoom,
          translateY: ty,
          duration: 200,
          easing: 'cubicBezier(.5, .05, .1, .3)',
        });
        anime({
          targets: this.previewBlock,
          duration: 200,
          opacity: 1,
          easing: 'cubicBezier(.5, .05, .1, .3)',
        });
      };
      if (this.picture) placeholderImage.src = this.picture;
    }
  }

  recalculatePreviewPosition() {
    if (this.preview) {
      const scaleZoom = 1.5;
      const previewRect = this.preview.getBoundingClientRect();
      const rootRect = this.root.getBoundingClientRect();
      const ph = previewRect.height;
      const mt = (ph - previewRect.height / scaleZoom) / 2;
      const xPadding = (ph - rootRect.height) / 2 - mt;
      const pt = rootRect.top - mt;
      Object.assign(this.preview.style, {
        transform: `translateX(${rootRect.left}px) translateY(${
          rootRect.top - xPadding
        }px) scale(${scaleZoom})`,
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

  mounted() {
    window.addEventListener('scroll', () => {
      this.recalculatePreviewPosition();
    });
  }
}
</script>

<style lang="postcss" scoped>
.Preview {
  box-shadow: 0 0 10px rgba(0, 0, 0, 1);
}
</style>
