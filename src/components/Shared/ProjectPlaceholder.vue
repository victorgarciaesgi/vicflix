<template>
  <div class="ProjectPlaceholder / flex flex-col w-64 h-40">
    <div
      ref="root"
      class="RootCard / h-36 flex w-full cursor-pointer"
      :data-show="showPreview"
      @mouseenter="handleMouseEnter"
      @mouseleave="cancelMouseEnter"
    >
      <VImg background="bg3" :src="picture" class="rounded" />
      <img
        :src="logo"
        class="left-3 bottom-3 absolute h-8"
        style="filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.6))"
      />

      <Portal v-if="init" to="Preview-Outlet">
        <div
          v-show="showPreview"
          :id="project.id"
          ref="preview"
          class="Preview / fixed top-0 left-0 flex flex-col overflow-hidden rounded cursor-pointer"
          :data-show="showPreview"
          @mouseleave="handleMouseLeave"
          @click="navigateToPreview"
        >
          <div class="relative">
            <img ref="pictureRef" :src="picture" class="object-cover w-full" />
            <img
              :src="logo"
              class="left-3 bottom-3 absolute h-8"
              style="filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.6))"
            />
          </div>
          <div ref="previewBlock" class="bg-bg2 flex flex-col p-2 -mt-1">
            <div class="Block / flex-nowrap flex flex-row">
              <div class="flex flex-col flex-1">
                <h4 class="leading-5">{{ project.title }}</h4>
                <div class="text-text9 text-xxs flex flex-row items-center">
                  <span>{{ project.type.join(', ') }}</span>
                  <span class="px-1">•</span>
                  <span>{{ project.year }}</span>
                </div>
                <div class="flex flex-row items-center justify-start">
                  <Techno
                    v-for="techno of project.technos"
                    :key="techno"
                    :techno="techno"
                    size="sm"
                  />
                </div>
              </div>
              <div class="flex-nowrap flex-0 flex flex-row items-center ml-1">
                <Popin mode="hover" theme="white">
                  <template #content>
                    <span class="px-3 py-1 text-black">Lecture</span>
                  </template>
                  <template #button>
                    <div
                      class="center flex p-1 text-black bg-white border-2 border-white rounded-full"
                    >
                      <SvgIcon src="actions/play" :size="20" @click.stop="playFirstVideo" />
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
            <div v-if="videoProgress" class="flex flex-col py-1">
              <span class="text-w120 mb-1 text-xs"
                >S1: Episode {{ videoProgress.video.episode }}</span
              >
              <div class="flex-nowrap flex flex-row items-center">
                <div class="bg-g90 flex flex-1 w-full rounded" style="height: 3px">
                  <div
                    class="bg-red absolute top-0 left-0 h-full rounded"
                    :style="{ width: `${videoProgress.percentage}%` }"
                  ></div>
                </div>
                <span class="text-xxs text-w190 ml-2"
                  >{{ currentProgressTime }} sur {{ durationTime }}
                </span>
              </div>
            </div>
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
import { ProgressList, Project, routerPagesNames } from '@models';
import { Component, Vue, Prop, Ref } from 'nuxt-property-decorator';
import anime from 'animejs';
import { VImg } from '@components/Global';
import { Location } from 'vue-router';
import Techno from './Techno.vue';
import { VideoProgressModule } from '@store';
import ProjectList from './ProjectList.vue';
import { secondsToHoursAndMinutes } from '@utils';

@Component({
  components: {
    Techno,
  },
})
export default class ProjectPlaceholder extends Vue {
  @Prop() project!: Project;
  @Prop({ default: false, type: Boolean }) showProgress!: boolean;

  @Ref() root!: HTMLDivElement;
  @Ref() preview?: HTMLDivElement;
  @Ref() pictureRef?: HTMLImageElement;
  @Ref() previewBlock?: HTMLDivElement;

  public init = false;
  public rendered = false;
  public showPreview = false;
  public timeout: NodeJS.Timeout | null = null;

  public videoProgress: ProgressList | null = null;

  get currentProgressTime() {
    if (this.videoProgress) {
      return secondsToHoursAndMinutes(this.videoProgress.timestamp);
    }
    return null;
  }

  get durationTime() {
    if (this.videoProgress) {
      return secondsToHoursAndMinutes(this.videoProgress.duration);
    }
    return null;
  }

  get picture() {
    const match = /^(.+)(\.\w+)$/.exec(this.project.picture);
    if (match) {
      return `/projects/${match[1]}_placeholder${match[2]}`;
    }
    return null;
  }

  navigateToPreview() {
    this.$router.push(this.toPreviewLink);
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
      Object.assign(this.pictureRef.style, {
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
      const limitDistanceBorder = 52;

      const previewWidthScale = previewRect.width * scaleZoom;
      const positionPreviewLeft = rootRect.left - (previewWidthScale - rootRect.width) / 2;
      let finalTranslateX = previewRect.left;
      if (positionPreviewLeft < limitDistanceBorder) {
        finalTranslateX = finalTranslateX + limitDistanceBorder - positionPreviewLeft;
      } else if (
        positionPreviewLeft + previewWidthScale >
        window.innerWidth - limitDistanceBorder
      ) {
        finalTranslateX =
          finalTranslateX -
          (positionPreviewLeft + previewWidthScale - window.innerWidth) -
          limitDistanceBorder;
      }

      const previewHeightScale = previewRect.height * scaleZoom;
      const previewMarginTop = (previewHeightScale - previewRect.height) / 2;
      const yPadding = (previewHeightScale - rootRect.height) / 2 - previewMarginTop;
      const finalTranslateY = rootRect.top - yPadding;

      const placeholderImage = new Image();
      placeholderImage.onload = (ev) => {
        this.root.style.opacity = '0';
        anime({
          targets: this.preview,
          scale: scaleZoom,
          translateY: finalTranslateY,
          translateX: finalTranslateX,
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
        translateX: left,
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

  async created() {
    const video = await VideoProgressModule.actions.getProjectProgress(this.project.id);
    if (video) {
      this.videoProgress = video;
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
