<template>
  <div class="VideoPreviewBanner / flex-nowrap flex flex-row items-center h-32 px-5 py-3">
    <div class="pr-3 text-2xl">{{ video.episode }}</div>
    <div class="relative w-40 h-20 overflow-hidden rounded-md">
      <VImg :src="video.preview" />
    </div>
    <div class="flex flex-col justify-center px-5">
      <div class="flex flex-row justify-between">
        <span class="text-md font-semibold">{{ video.title }}</span>
        <span>{{ video.duration }} min</span>
      </div>
      <span class="text-text9 mt-1 text-sm">{{ video.description }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { ProjectVideo } from '@models';
import { Component, Vue, Prop } from 'nuxt-property-decorator';

@Component({})
export default class VideoPreviewBanner extends Vue {
  @Prop() video!: ProjectVideo;
}
</script>

<style lang="postcss" scoped>
div.VideoPreviewBanner {
  border-width: 1px 0;
  border-color: var(--bg6);
  border-style: solid;
}
</style>
