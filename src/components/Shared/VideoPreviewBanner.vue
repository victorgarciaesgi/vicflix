<template>
  <NuxtLink
    :to="toVideoLink"
    class=" VideoPreviewBanner / group flex-nowrap sm:px-0 flex flex-row items-center w-full h-32 px-5 py-3 rounded"
    :class="{ '!px-3 !h-24': sm }"
  >
    <div class="text-text1 w-6 pr-3 text-2xl">{{ video.episode }}</div>
    <div
      class="flex-0 sm:w-20 sm:h-12 relative w-40 h-20 overflow-hidden rounded-md shadow"
      :class="{ '!w-20 !h-12': sm }"
    >
      <!-- <video
        ref="videoPlayer"
        class="VideoElement / relative z-0 object-cover w-full h-full"
        style="transform-origin: top left"
        preload="metadata"
        type="video/mp4"
        playsinline
        :src="`${video.videoUrl}#t=0.001`"
        @loadedmetadata="handleLoadedMetadata"
      /> -->
      <VImg :src="video.thumbnail" />
      <div
        class="
          -sm:group-hover:flex
          center
          bg-opacity-30
          !absolute
          top-0
          left-0
          z-10
          hidden
          w-full
          h-full
          bg-black
        "
      >
        <div class="p-1 text-white border border-white rounded-full">
          <SvgIcon class="w-9 h-9 sm:w-7 sm:h-7" :class="{ '!h-7 !w-7': sm }" src="actions/play" />
        </div>
      </div>
      <div v-if="progress" class="bg-w120 absolute bottom-0 left-0 w-full h-1">
        <div class="bg-red absolute top-0 left-0 h-full" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>
    <div class="sm:pr-0 flex flex-col justify-center flex-1 px-5" :class="{ '!pr-0': sm }">
      <div class="sm:flex-col flex flex-row justify-between" :class="{ '!flex-col': sm }">
        <span class="text-md text-text1 font-semibold" :class="{ '!text-sm': sm }">{{
          video.title
        }}</span>
        <span class="sm:hidden" :class="{ '!hidden': sm }">{{ duration }} min</span>
      </div>
      <span
        class="text-text9 sm:line-clamp-2 mt-1 text-sm"
        :class="{ '!line-clamp-2 !text-xs': sm }"
        >{{ video.description }}</span
      >
      <span class="-sm:hidden text-grey mt-1 text-sm" :class="{ '!flex': sm }"
        >{{ duration }} min</span
      >
    </div>
  </NuxtLink>
</template>

<script lang="ts">
import { ProjectVideo, routerPagesNames } from '@models';
import { VideoProgressModule } from '@store';
import { secondsToHoursAndMinutes } from '@utils';
import { Component, Vue, Prop, Ref } from 'nuxt-property-decorator';
import { Location } from 'vue-router';

@Component({})
export default class VideoPreviewBanner extends Vue {
  @Prop() video!: ProjectVideo;
  @Prop({ type: Boolean, required: false }) sm?: boolean;

  @Ref() videoPlayer!: HTMLVideoElement;

  public progress = 0;
  public loading = false;
  public thumbnailSrc: string | null = null;

  get toVideoLink(): Location {
    return {
      name: routerPagesNames.watch.id,
      params: {
        id: this.video.id,
      },
    };
  }

  get duration() {
    return secondsToHoursAndMinutes(this.video.duration);
  }

  async created() {
    const video = await VideoProgressModule.actions.getVideoProgress(this.video.id);
    if (video) {
      this.progress = video.percentage;
    }
  }
}
</script>

<style lang="postcss" scoped>
a.VideoPreviewBanner {
  border-bottom: 1px var(--bg6) solid;

  @screen -md {
    &:hover:not(.nuxt-link-active) {
      background-color: var(--bg4);
    }
  }
  &.nuxt-link-active {
    background-color: var(--bg5);
  }

  &:last-child {
    border-bottom: none;
  }
}
</style>
