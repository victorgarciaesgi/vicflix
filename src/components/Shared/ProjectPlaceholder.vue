<template>
  <PlaceholderAnimatedItem
    :baseInfo="project"
    :logo="logo"
    :picture="picture"
    :showProgress="showProgress"
    :videoProgress="videoProgress"
  >
    <template #card>
      <VImg background="bg3" :src="picture" class="rounded" />
      <img
        :src="logo"
        class="left-3 bottom-3 absolute h-8"
        style="filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.6))"
      />
    </template>
    <template #preview>
      <img
        :src="logo"
        class="left-3 bottom-3 absolute h-8 overflow-hidden"
        style="filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.6))"
      />
    </template>
    <template #picture>
      <img
        ref="pictureRef"
        :src="picture"
        class="object-cover w-full h-full rounded-tl rounded-tr"
      />
    </template>
    <template #previewBlock>
      <div class="Block / flex-nowrap flex flex-col">
        <div class="flex-nowrap flex flex-row">
          <h4 class="flex-1 leading-5">{{ project.title }}</h4>

          <div class="flex-nowrap flex-0 flex flex-row items-center ml-2">
            <Popin mode="hover" :offset="2" theme="white">
              <template #content>
                <span class="px-3 py-1 text-black">{{
                  hasProjectVideos ? $t($messages.Actions.Play) : $t($messages.Actions.Consult)
                }}</span>
              </template>
              <template #button>
                <div class="center flex p-1 text-black bg-white border-2 border-white rounded-full">
                  <SvgIcon
                    :src="hasProjectVideos ? 'actions/play' : 'actions/open_in'"
                    :size="20"
                    @click.stop="playFirstVideo"
                  />
                </div>
              </template>
            </Popin>
            <Popin mode="hover" :offset="2" theme="white">
              <template #content>
                <span class="px-3 py-1 text-black">{{ $t($messages.Actions.MoreInfo) }}</span>
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
        <div class="flex flex-col flex-1">
          <div class="text-text9 text-xxs flex flex-row items-center">
            <span>{{ project.type.join(', ') }}</span>
            <span class="px-1">•</span>
            <span>{{ project.year }}</span>
          </div>
          <div class="flex flex-row items-center justify-start -ml-1">
            <Techno v-for="techno of project.technos" :key="techno" :techno="techno" size="sm" />
          </div>
        </div>
      </div>
      <ProjectVideoProgress :progress="videoProgress" />
    </template>
  </PlaceholderAnimatedItem>
</template>

<script lang="ts">
import { ProgressList, Project, routerPagesNames } from '@models';
import { Component, Vue, Prop, Ref } from 'nuxt-property-decorator';
import anime from 'animejs';
import { Location } from 'vue-router';
import Techno from './Techno.vue';
import { VideoProgressModule } from '@store';
import ProjectVideoProgress from './ProjectVideoProgress.vue';
import { EventBus, Events } from '@services';
import { cubicTransition } from '@constants';
import PlaceholderAnimatedItem from './PlaceholderAnimatedItem.vue';

@Component({
  components: {
    Techno,
    ProjectVideoProgress,
    PlaceholderAnimatedItem,
  },
})
export default class ProjectPlaceholder extends Vue {
  @Prop() project!: Project;
  @Prop({ default: false, type: Boolean }) showProgress!: boolean;
  @Prop({ default: true }) inCarrousel!: boolean;

  @Ref() root!: HTMLDivElement;
  @Ref() preview?: HTMLDivElement;
  @Ref() pictureRef?: HTMLImageElement;
  @Ref() previewBlock?: HTMLDivElement;

  public init = false;
  public rendered = false;
  public showPreview = false;
  public timeout: NodeJS.Timeout | null = null;
  public scaleZoom = 1.5;

  public videoProgress: ProgressList | null = null;

  get picture() {
    return this.project.placeholder;
  }

  navigateToPreview() {
    this.$router.push(this.toPreviewLink);
  }

  get toPreviewLink(): Location {
    return {
      path: this.$route.path,
      query: {
        ...this.$route.query,
        jbv: this.project.id,
      },
    };
  }

  get hasProjectVideos(): boolean {
    return !!this.project.videos.length;
  }

  get logo() {
    return `/logos/${this.project.logo}`;
  }

  async playFirstVideo() {
    if (this.project.videos.length) {
      const progress = await VideoProgressModule.actions.getProjectProgress(this.project.id);
      if (progress) {
        this.$router.push({ name: routerPagesNames.watch.id, params: { id: progress.video.id } });
      } else {
        this.$router.push({
          name: routerPagesNames.watch.id,
          params: { id: this.project.videos[0].id },
        });
      }
    } else if (this.project.links) {
      Object.assign(document.createElement('a'), {
        target: '_blank',
        href: this.project.links[0].link,
      }).click();
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

  getTranslateValues() {
    const previewRect = this.preview!.getBoundingClientRect();
    const rootRect = this.root.getBoundingClientRect();
    const limitDistanceBorder = 52;

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
    if (this.timeout) clearTimeout(this.timeout);
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

  async awaitImageLoad(src: string) {
    return new Promise((resolve, reject) => {
      const placeholderImage = new Image();
      placeholderImage.onload = resolve;
      placeholderImage.src = src;
    });
  }

  async animateOpenPreview() {
    if (this.preview) {
      this.rendered = true;

      const { finalTranslateX, finalTranslateY } = this.getTranslateValues();

      if (this.picture && this.previewBlock) {
        anime({
          targets: this.preview,
          scale: this.scaleZoom,
          translateY: finalTranslateY,
          translateX: finalTranslateX,
          duration: 200,
          easing: cubicTransition,
          complete: () => {
            if (this.preview) this.preview.classList.add('hasShadow');
            if (this.root) {
              this.root.style.opacity = '0';
            }
          },
        });
        anime({
          targets: this.previewBlock,
          duration: 50,
          opacity: 1,
          easing: cubicTransition,
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
      var { m41 } = new WebKitCSSMatrix(style.transform);

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
        duration: 200,
        easing: cubicTransition,
        complete: () => {
          this.root.style.opacity = '1';
          this.showPreview = false;
        },
      });
      anime({
        targets: this.previewBlock,
        duration: 200,
        opacity: 0,
        easing: cubicTransition,
      });
    }
  }

  async created() {
    if (this.showProgress) {
      const video = await VideoProgressModule.actions.getProjectProgress(this.project.id);
      if (video) {
        this.videoProgress = video;
      }
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
