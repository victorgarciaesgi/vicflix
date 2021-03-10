<template>
  <div
    ref="containerRef"
    class="VideoPlayer / absolute flex w-full h-full"
    @mousemove="debounceHideToolbar"
  >
    <video
      ref="videoPlayer"
      class="VideoElement / w-full h-full"
      playsinline
      preload="metadata"
      @progress="handleVideoProgress"
      @click="toggleVideoPlay"
      @dblclick="toggleFullScreen"
    >
      <source :src="video.videoUrl" type="video/mp4" />
    </video>
    <div v-if="loading" class="center absolute top-0 left-0 flex w-full h-full">
      <Spinner color="red" :size="50" />
    </div>
    <transition name="fade">
      <div
        v-if="showToolbar"
        class="ToolBar / absolute bottom-0 left-0 z-10 flex-col w-full px-5 py-8"
        :class="{ playing: videoPlaying }"
      >
        <PlayerTrackBar
          v-bind="{ currentProgress, currentTime, remainingTime, totalTime, video }"
          @update="handleUpdateTime"
        />
        <div class="Actions / flex-nowrap flex flex-row items-center justify-between pt-4">
          <div class="flex-nowrap flex flex-row items-center">
            <SvgIcon
              v-if="!videoPlaying"
              class="ButtonAction"
              src="videos/play"
              :size="50"
              @click="playVideo"
            />
            <SvgIcon
              v-else-if="videoPlaying"
              class="ButtonAction"
              src="videos/pause"
              :size="50"
              @click="pauseVideo"
            />
            <SvgIcon
              class="ButtonAction / ml-6"
              src="videos/replay"
              :size="45"
              @click="addVideoTime(-10)"
            />
            <SvgIcon
              class="ButtonAction / ml-6"
              src="videos/forward"
              :size="45"
              @click="addVideoTime(10)"
            />
            <Popin v-if="!isMobile" mode="hover" :debounce="true" :arrow="false" :offset="2">
              <template #content>
                <VolumeSlider :volume="volume" @update="handleUpdateVolume" />
              </template>
              <template #button>
                <SvgIcon class="ButtonAction / ml-6" :src="volumeIcon" :size="45" />
              </template>
            </Popin>
            <div
              v-if="projectRelated"
              class="ellipsis sm:hidden flex-nowrap flex flex-row flex-shrink ml-10 leading-5"
            >
              <span class="text-xl font-semibold">{{ projectRelated.title }}</span>
              <span class="text-w140 mt-px ml-2 text-lg">S1:E{{ video.episode }}</span>
              <span class="text-w140 ellipsis flex-shrink mt-px ml-2 text-lg">{{
                video.title
              }}</span>
            </div>
          </div>
          <div class="flex-nowrap flex flex-row items-center">
            <Popin
              v-if="projectRelated"
              :mode="isMobile ? 'click' : 'hover'"
              :debounce="true"
              :offset="2"
              :width="400"
              theme="g40"
            >
              <template #content>
                <div class="flex flex-col">
                  <VideoPreviewBanner
                    v-for="video of projectRelated.videos"
                    :key="video.id"
                    :video="video"
                    :sm="true"
                  />
                </div>
              </template>
              <template #button>
                <SvgIcon class="ButtonAction / mr-6" src="videos/episodes" :size="45" />
              </template>
            </Popin>
            <SvgIcon
              v-if="!isFullScreen"
              class="ButtonAction"
              src="videos/fullscreen"
              :size="50"
              @click="toggleFullScreen"
            />
            <SvgIcon
              v-else
              class="ButtonAction"
              src="videos/fullscreen_exit"
              :size="50"
              @click="toggleFullScreen"
            />
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div
        class="TopBar / top-5 flex-nowrap absolute left-0 flex flex-row items-center justify-between w-full px-5"
      >
        <div
          style="filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.6))"
          v-if="showToolbar"
          class="ButtonAction / group flex flex-row items-center"
          @click="goBack"
        >
          <SvgIcon src="videos/back" :size="45" />
          <span
            class="group-hover:opacity-100 sm:hidden ml-2 text-lg transition-opacity duration-200 opacity-0"
            >Retour a la navigation</span
          >
        </div>
        <div
          v-if="projectRelated"
          class="ellipsis flex-nowrap -sm:hidden flex flex-row items-center flex-shrink ml-10 leading-5"
        >
          <span class="sm:text-md text-xl font-semibold">{{ projectRelated.title }}</span>
          <span class="text-w140 sm:text-sm mt-px ml-2 text-lg">S1:E{{ video.episode }}</span>
          <span class="text-w140 sm:text-sm mt-px ml-2 text-lg">{{ video.title }}</span>
        </div>
      </div>
    </transition>
    <PortalTarget
      multiple
      style="z-index: 11000"
      class="absolute top-0 left-0"
      name="Popup-Outlet"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref, Watch } from 'vue-property-decorator';
import { EventBus } from '@services';
import { BreakPointsValues, ProjectVideo } from '@models';
import { secondsToHoursAndMinutes } from '@utils';
import { allProjects } from '@data';
import { BreakpointMixin } from '@mixins';
import { VideoProgressModule } from '@store';
import VideoPreviewBanner from '../VideoPreviewBanner.vue';
import VolumeSlider from './VolumeSlider.vue';
import PlayerTrackBar from './PlayerTrackBar.vue';

@Component({
  transition: 'bounce',
  components: {
    VolumeSlider,
    PlayerTrackBar,
    VideoPreviewBanner,
  },
})
export default class VideoPlayer extends BreakpointMixin {
  @Prop({ required: true }) video!: ProjectVideo;

  @Ref() containerRef!: HTMLDivElement;
  @Ref() videoPlayer!: HTMLVideoElement;

  private videoPlaying = false;
  private videoEnded = false;
  private currentTime = 0;
  private currentProgress = 0;
  private totalTime = 1;
  public loading = true;
  public isFullScreen = false;
  public volume = 0;

  public isIos = false;

  public showToolbar = true;
  public toolBarTimeOut: NodeJS.Timeout | null = null;

  get remainingTime() {
    return secondsToHoursAndMinutes(this.totalTime - this.currentTime);
  }

  get projectRelated() {
    return allProjects.find((f) => f.id === this.video.projectId);
  }

  get volumeIcon() {
    if (this.volume <= 0.05) {
      return 'videos/volume_mute';
    } else if (this.volume < 0.6) {
      return 'videos/volume_down';
    } else {
      return 'videos/volume_max';
    }
  }

  goBack() {
    if (this.projectRelated) {
      this.$router.push({
        name: this.$routesNames.index.index,
        query: {
          jbv: this.projectRelated.id,
        },
      });
    } else {
      this.$router.push({ name: this.$routesNames.index.index });
    }
  }

  //! Video controls

  toggleVideoPlay() {
    if (this.videoPlaying) this.pauseVideo();
    else this.playVideo();
  }

  playVideo() {
    EventBus.$emit('pauseVideos', this.pauseVideo);
    try {
      this.videoPlayer?.play();
      this.videoPlaying = true;
    } catch (e) {
      console.log(e);
    }
  }
  pauseVideo() {
    this.videoPlayer?.pause();
    this.videoPlaying = false;
  }

  replayVideo() {
    this.videoPlayer.load();
    this.videoPlayer?.play();
    this.videoEnded = false;
    this.videoPlaying = true;
  }

  endOfVideo() {
    this.videoPlaying = false;
    this.videoEnded = true;
  }

  //! Fullscreen

  exitFullScreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      this.debounceHideToolbar();
      this.isFullScreen = false;
    }
  }

  handleFullScreenChange() {
    if (!document.fullscreenElement) {
      this.isFullScreen = false;
      this.debounceHideToolbar();
    }
  }

  async enableFullScreen() {
    try {
      await this.containerRef.requestFullscreen();
      this.isFullScreen = true;
    } catch (e) {
      console.log(e);
      try {
        await (this.videoPlayer as any).webkitEnterFullscreen();
        this.isFullScreen = true;
      } catch (e) {
        console.log(e);
      }
    }
  }

  toggleFullScreen() {
    if (this.isFullScreen) {
      this.exitFullScreen();
    } else {
      this.enableFullScreen();
    }
  }

  //! Volume

  handleUpdateVolume(volume: number) {
    this.videoPlayer.volume = volume;
    this.volume = volume;
  }

  handleKeyUp(event: KeyboardEvent) {
    this.debounceHideToolbar();
    switch (event.code) {
      case 'Space': {
        this.toggleVideoPlay();
        break;
      }
      case 'Escape': {
        this.exitFullScreen();
      }
    }
  }

  //! Video Time

  @Watch('currentTime') timeChanged(value: number) {
    VideoProgressModule.mutations.updateVideoProgress({
      video: this.video,
      timestamp: value,
      duration: this.totalTime,
    });
  }

  addVideoTime(seconds: number) {
    this.loading = true;
    this.videoPlayer.currentTime = this.videoPlayer.currentTime + seconds;
  }

  setVideoTime(time: number) {
    this.loading = true;
    this.videoPlayer.currentTime = time;
    this.currentTime = time;
  }

  handleUpdateTime(time: number) {
    this.setVideoTime(time);
  }

  timeUpdate(event: Event) {
    this.currentTime = this.videoPlayer.currentTime;
  }

  //! Progress

  handleVideoProgress() {
    try {
      let range = 0;
      const bf = this.videoPlayer?.buffered;
      const time = this.videoPlayer?.currentTime;

      if (bf && time) {
        while (range < 3 && !(bf.start(range) <= time && time <= bf.end(range))) {
          range += 1;
        }
        const loadStartPercentage = bf.start(range) / this.videoPlayer.duration;
        const loadEndPercentage = bf.end(range) / this.videoPlayer.duration;
        this.currentProgress = loadEndPercentage - loadStartPercentage;
      }
    } catch (e) {
      console.log(e);
    }
  }

  handleSeeked() {
    this.loading = false;
    this.handleVideoProgress();
  }

  async handleLoadedMetadata() {
    this.totalTime = this.videoPlayer?.duration ?? 0;
    this.loading = false;
    const progressItem = await VideoProgressModule.actions.getVideoProgress(this.video.id);
    if (progressItem) {
      this.videoPlayer.currentTime = progressItem.timestamp;
    }
  }

  //! Toolbar

  hideToolBar() {
    // this.showToolbar = false;
  }

  debounceHideToolbar() {
    this.showToolbar = true;
    if (this.toolBarTimeOut) clearTimeout(this.toolBarTimeOut);
    this.toolBarTimeOut = setTimeout(this.hideToolBar, 3000);
  }

  //! LifeCycle

  mounted() {
    if (this.videoPlayer) {
      this.videoPlayer.load();
      this.videoPlayer.addEventListener('ended', this.endOfVideo);
      this.videoPlayer.addEventListener('timeupdate', this.timeUpdate);
      this.videoPlayer.addEventListener('seeked', this.handleSeeked);
      this.videoPlayer.addEventListener('loadedmetadata', this.handleLoadedMetadata);
      document.addEventListener('fullscreenchange', this.handleFullScreenChange);
      this.volume = this.videoPlayer.volume;
      window.addEventListener('keydown', this.handleKeyUp);
      const userAgent = window.navigator.userAgent;

      if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
        this.isIos = true;
      }
    }
  }

  beforeDestroy() {
    if (this.videoPlayer) {
      this.videoPlayer.removeEventListener('ended', this.endOfVideo);
      this.videoPlayer.removeEventListener('timeupdate', this.timeUpdate);
      this.videoPlayer.removeEventListener('seeked', this.handleSeeked);
      this.videoPlayer.removeEventListener('loadedmetadata', this.handleLoadedMetadata);
      this.videoPlayer.pause();
    }
    document.removeEventListener('fullscreenchange', this.handleFullScreenChange);
  }
}
</script>

<style lang="postcss" scoped>
div.VideoPlayer {
  div.ToolBar {
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.9));
  }

  .ButtonAction {
    transition: transform 0.2s ease-in-out;
    cursor: pointer;
    &:hover {
      transform: scale(1.1);
    }
  }

  video.VideoElement {
    &:-webkit-full-screen {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
