<template>
  <div class="VideoRoot / relative w-screen bg-black">
    <VideoPlayer :video="video" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { VideoPlayer } from '@components';
import { ProjectVideo, routerPagesNames } from '@models';
import { Context } from '@nuxt/types';
import { allVideos } from '@data';
@Component({
  components: {
    VideoPlayer,
  },
  transition: {
    name: 'fade',
    mode: 'out-in',
  },
})
export default class WatchId extends Vue {
  public video!: ProjectVideo;

  asyncData({ params: { id }, redirect }: Context): Partial<WatchId> | void {
    const video = allVideos.find((f) => f.id === id);
    if (video) {
      return { video };
    } else {
      redirect({ name: routerPagesNames.index.index });
    }
  }
}
</script>
<style lang="postcss" scoped>
div.VideoRoot {
  height: 100vh;
  height: -webkit-fill-available;
}
</style>
