<template>
  <NuxtLink
    :to="toVideoLink"
    class="VideoPreviewBanner / group flex-nowrap sm:px-0 flex flex-row items-center h-32 px-5 py-3"
  >
    <div class="pr-3 text-2xl">{{ video.episode }}</div>
    <div class="relative w-40 h-20 overflow-hidden rounded-md">
      <VImg :src="video.preview" />
      <div class="group-hover:flex center absolute top-0 left-0 hidden w-full h-full">
        <div class="center flex p-1 border border-white rounded-full">
          <SvgIcon src="actions/play" :size="40" />
        </div>
      </div>
    </div>
    <div class="sm:pr-0 flex flex-col justify-center px-5">
      <div class="sm:flex-col flex flex-row justify-between">
        <span class="text-md font-semibold">{{ video.title }}</span>
        <span>{{ video.duration }} min</span>
      </div>
      <span class="text-text9 mt-1 text-sm">{{ video.description }}</span>
    </div>
  </NuxtLink>
</template>

<script lang="ts">
import { ProjectVideo, routerPagesNames } from '@models';
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import { Location } from 'vue-router';

@Component({})
export default class VideoPreviewBanner extends Vue {
  @Prop() video!: ProjectVideo;

  get toVideoLink(): Location {
    return {
      name: routerPagesNames.watch.id,
      params: {
        id: this.video.id,
      },
    };
  }
}
</script>

<style lang="postcss" scoped>
div.VideoPreviewBanner {
  border-width: 1px 0;
  border-color: var(--bg6);
  border-style: solid;

  &:last-child {
    border-bottom: none;
  }
}
</style>
