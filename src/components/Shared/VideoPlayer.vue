<template>
  <div class="VideoPlayer / flex w-screen h-screen">
    <video ref="videoPlayer" class="w-full h-full" playsinline preload="metadata">
      <source :src="video.videoUrl" type="video/mp4" />
    </video>
    <div
      class="ToolBar / absolute bottom-0 left-0 z-10 flex-col w-full px-5 py-8 bg-black bg-opacity-75"
      :class="{ playing: videoPlaying }"
    >
      <div class="bg-grey h-2px relative w-full py-3">
        <div
          class="bg-red absolute top-0 left-0 h-full"
          :style="{ width: `${currentTimePercent}%` }"
        ></div>
      </div>
      <div class="flex flex-row">
        <SvgIcon v-if="!videoPlaying" src="videos/play" :size="50" @click="playVideo" />
        <SvgIcon v-else-if="videoPlaying" src="videos/pause" :size="50" @click="pauseVideo" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from 'vue-property-decorator';
import { EventBus } from '@services';
import { ProjectVideo } from '@models';

@Component({
  transition: 'bounce',
})
export default class VideoPlayer extends Vue {
  @Prop({ required: true }) video!: ProjectVideo;

  @Ref() videoPlayer!: HTMLVideoElement;

  private videoPlaying = false;
  private videoEnded = false;
  private currentTime = 0;
  private totalTime = 1;

  get currentTimePercent() {
    if (this.totalTime !== 0) {
      return (this.currentTime / this.totalTime) * 100;
    }
    return 0;
  }

  playVideo() {
    EventBus.$emit('pauseVideos', this.pauseVideo);
    this.videoPlayer.play();
    this.videoPlaying = true;
  }
  pauseVideo() {
    this.videoPlayer.pause();
    this.videoPlaying = false;
  }

  replayVideo() {
    this.videoPlayer.load();
    this.videoPlayer.play();
    this.videoEnded = false;
    this.videoPlaying = true;
  }

  endOfVideo() {
    this.videoPlaying = false;
    this.videoEnded = true;
  }

  timeUpdate(event: Event) {
    this.currentTime = this.videoPlayer.currentTime;
  }

  mounted() {
    if (this.videoPlayer) {
      this.videoPlayer.load();
      this.videoPlayer.addEventListener('ended', this.endOfVideo);
      this.videoPlayer.addEventListener('timeupdate', this.timeUpdate);
      this.videoPlayer.addEventListener('loadedmetadata', () => {
        this.totalTime = this.videoPlayer.duration;
      });
    }
  }

  beforeDestroy() {
    this.videoPlayer.removeEventListener('ended', this.endOfVideo);
    this.videoPlayer.removeEventListener('timeupdate', this.timeUpdate);
  }
}
</script>
