<template>
  <div
    ref="containerRef"
    class="VideoPlayer / absolute flex w-full h-full text-white"
    @mousemove="showToolBar"
  >
    <VImg
      v-if="isVideoEndingHasNextProject && nextProject && !isVideoEndingHasNextEspisode"
      :src="nextProject.picture"
    />
    <video
      ref="videoPlayer"
      class="VideoElement / w-full h-full"
      style="transform-origin: top left"
      type="video/mp4"
      playsinline
      preload="metadata"
      :class="{
        'rounded-3xl border-white cursor-pointer border-4 hover:border-8 bg-black':
          isVideoEnding && !nextEpisode,
      }"
      @progress="handleVideoProgress"
      @dblclick="toggleFullScreen"
      @click="toggleVideoPlay(false)"
      @mousemove="debounceHideToolbar"
    >
      <source :src="video.videoUrl" type="video/mp4" />
    </video>
    <div v-if="loading" class="center absolute top-0 left-0 flex w-full h-full">
      <Spinner color="red" :size="50" />
    </div>
    <transition name="fade">
      <div
        v-if="showToolbar || isVideoEnding"
        class="ToolBar / absolute bottom-0 left-0 z-10 flex flex-col w-full px-5 py-8"
        :class="{ playing: videoPlaying }"
        @mouseenter="disableHideToolBar"
      >
        <transition name="fade" mode="out-in">
          <div v-if="isVideoEnding && nextEpisode" class="flex flex-row justify-end pb-4">
            <Action theme="white" :to="nextEpisodeLink">Épisode suivant</Action>
          </div>
          <div
            v-else-if="isVideoEnding && nextProject"
            class="sm:justify-start flex flex-row justify-end w-full pb-4"
          >
            <div class="sm:w-full -sm:max-w-sm flex flex-col">
              <div>
                <img
                  :src="`/logos/${nextProject.logo}`"
                  class="sm:h-12 w-auto h-24"
                  style="filter: drop-shadow(3px 2px 3px rgba(0, 0, 0, 0.4))"
                />
                <h2 class="pt-4">{{ nextProject.title }}</h2>
                <p v-if="nextProject.slogan" class="text-w220 pt-2 pb-4">{{
                  $t(nextProject.slogan)
                }}</p>
              </div>
              <div class="grid w-full gap-2" style="grid-template-columns: repeat(auto-fit, 1fr)">
                <Action theme="white" icon="actions/play" :wFull="true" :to="nextProjectLink"
                  >Regarder S1: E1</Action
                >
                <Action theme="gray" class="!ml-0" :wFull="true" to="/"
                  >Retourner à l'accueil</Action
                >
              </div>
            </div>
          </div>
        </transition>
        <PlayerTrackBar
          v-if="!isVideoEnding || nextEpisode"
          v-bind="{ currentProgress, currentTime, remainingTime, totalTime, video }"
          @update="handleUpdateTime"
        />
        <div
          v-if="!isVideoEnding || nextEpisode"
          class="Actions / flex-nowrap flex flex-row items-center justify-between pt-4"
        >
          <div class="flex-nowrap flex flex-row items-center">
            <SvgIcon
              v-if="!videoPlaying"
              class="ButtonAction"
              src="videos/play"
              :size="isSmallScreen ? 40 : 50"
              @click="playVideo"
            />
            <SvgIcon
              v-else-if="videoPlaying"
              class="ButtonAction"
              src="videos/pause"
              :size="isSmallScreen ? 40 : 50"
              @click="pauseVideo"
            />
            <SvgIcon
              class="ButtonAction / ml-6"
              src="videos/replay"
              :size="isSmallScreen ? 35 : 45"
              @click="addVideoTime(-10)"
            />
            <SvgIcon
              class="ButtonAction / ml-6"
              src="videos/forward"
              :size="isSmallScreen ? 35 : 45"
              @click="addVideoTime(10)"
            />
            <Popin
              theme="g20"
              v-if="!isMobile"
              mode="hover"
              :debounce="true"
              :arrow="false"
              :offset="2"
            >
              <template #content>
                <VolumeSlider :volume="volume" @update="handleUpdateVolume" />
              </template>
              <template #button>
                <SvgIcon
                  class="ButtonAction / ml-6"
                  :src="volumeIcon"
                  :size="isSmallScreen ? 35 : 45"
                />
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
              @open="disableHideToolBar"
              @close="debounceHideToolbar"
              theme="g30"
            >
              <template #content>
                <div class="flex flex-col w-full">
                  <div
                    v-for="(videos, season) of otherProjectVideos"
                    :key="season"
                    class="flex flex-col"
                  >
                    <div class="bg-g70 sticky top-0 z-50 px-3 py-1">
                      {{ $t($messages.Projects.Season) }} {{ season }}
                    </div>
                    <VideoPreviewBanner
                      v-for="video of videos"
                      :key="video.id"
                      :video="video"
                      :sm="true"
                    />
                  </div>
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
              :size="isSmallScreen ? 40 : 50"
              @click="toggleFullScreen"
            />
            <SvgIcon
              v-else
              class="ButtonAction"
              src="videos/fullscreen_exit"
              :size="isSmallScreen ? 40 : 50"
              @click="toggleFullScreen"
            />
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div
        class=" TopBar / flex-nowrap absolute left-0 flex flex-row items-center justify-between w-full px-5 py-4"
      >
        <div
          style="filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.6))"
          v-if="showToolbar || isVideoEnding"
          class="ButtonAction / group flex flex-row items-center"
          @click="goBack"
        >
          <SvgIcon src="videos/back" :size="45" />
          <span
            class=" group-hover:opacity-100 sm:hidden ml-2 text-lg transition-opacity duration-200 opacity-0"
            >Retour a la navigation</span
          >
        </div>
        <div
          v-if="projectRelated"
          class=" ellipsis flex-nowrap -sm:hidden flex flex-row items-center flex-shrink ml-10 leading-5"
        >
          <span class="sm:text-md text-xl font-semibold">{{ projectRelated.title }}</span>
          <span class="text-w160 sm:text-sm mt-px ml-2 text-lg"
            >S{{ video.season }}:E{{ video.episode }}</span
          >
          <span class="text-w180 sm:text-sm mt-px ml-2 text-lg">{{ video.title }}</span>
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
import { BreakPointsValues, Project, ProjectVideo, routerPagesNames } from '@models';
import { secondsToHoursAndMinutes } from '@utils';
import { allProjects } from '@data';
import { BreakpointMixin } from '@mixins';
import { RouterModule, VideoProgressModule } from '@store';
import VideoPreviewBanner from '../VideoPreviewBanner.vue';
import VolumeSlider from './VolumeSlider.vue';
import PlayerTrackBar from './PlayerTrackBar.vue';
import { debounce, DebouncedFunc, groupBy, sample } from 'lodash';
import { Location } from 'vue-router';
import anime from 'animejs';
import { cubicTransition } from '@constants';

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
  @Prop() replay!: boolean;

  @Ref() containerRef!: HTMLDivElement;
  @Ref() videoPlayer!: HTMLVideoElement;

  public videoPlaying = false;
  public videoEnded = false;
  public currentTime = 0;
  public currentProgress = 0;
  public totalTime = 100000;
  public loading = true;
  public isFullScreen = false;
  public volume = 0;
  public continuePlaying = false;

  public isIos = false;

  public showToolbar = true;
  public toolBarTimeOut: NodeJS.Timeout | null = null;

  get remainingTime(): string {
    if (this.loading) {
      return secondsToHoursAndMinutes(this.video.duration);
    } else {
      return secondsToHoursAndMinutes(this.totalTime - this.currentTime);
    }
  }

  get projectRelated(): Project | undefined {
    return allProjects.find((f) => f.id === this.video.projectId);
  }

  get volumeIcon(): string {
    if (this.volume <= 0.05) {
      return 'videos/volume_mute';
    } else if (this.volume < 0.6) {
      return 'videos/volume_down';
    } else {
      return 'videos/volume_max';
    }
  }

  get isVideoEnding(): boolean {
    return this.currentTime > this.totalTime - 5 && !this.continuePlaying;
  }

  get isVideoEndingHasNextEspisode() {
    return this.isVideoEnding && this.nextEpisode;
  }

  get isVideoEndingHasNextProject() {
    return this.isVideoEnding && this.nextProject;
  }

  get otherProjectVideos() {
    return groupBy(this.projectRelated?.videos, (video) => video.season);
  }

  get nextEpisode(): ProjectVideo | undefined {
    const project = this.projectRelated;
    const sameSeasonVideo = project?.videos.find(
      (video) => video.episode === this.video.episode + 1 && video.season === this.video.season
    );
    if (!sameSeasonVideo) {
      return project?.videos.find(
        (video) => video.episode === 1 && video.season === this.video.season + 1
      );
    } else return sameSeasonVideo;
  }

  get nextEpisodeLink(): Location | undefined {
    if (this.nextEpisode) {
      return {
        name: routerPagesNames.watch.id,
        params: {
          id: this.nextEpisode?.id,
        },
        query: {
          replay: 'replayStart',
        },
      };
    }
  }

  get nextProject(): Project | undefined {
    const projectsWithVideos = allProjects
      .filter((f) => f.id !== this.projectRelated?.id)
      .filter((f) => f.videos.length);
    return sample(projectsWithVideos);
  }

  get nextProjectLink(): Location | undefined {
    if (this.nextProject) {
      return {
        name: routerPagesNames.watch.id,
        params: {
          id: this.nextProject.videos[0].id,
        },
        query: {
          replay: 'replayStart',
        },
      };
    }
  }

  goBack() {
    const fromRoute = RouterModule.state.previousRoute;
    if (fromRoute && fromRoute.name !== routerPagesNames.watch.id) {
      this.$router.push({
        path: fromRoute.fullPath,
      });
    } else if (this.projectRelated) {
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

  toggleVideoPlay(mobile = false) {
    if (this.videoEnded) {
      this.setVideoTime(0);
      this.playVideo();
    } else if (this.isVideoEnding && !this.nextEpisode) {
      this.continuePlaying = true;
    } else {
      if ((!mobile && !this.isMobile) || mobile) {
        if (this.videoPlaying) this.pauseVideo();
        else this.playVideo();
      }
    }
  }

  playVideo() {
    try {
      this.videoPlayer?.play();
      this.debounceHideToolbar();
    } catch (e) {
      console.log(e);
    }
  }

  handlePlayVideo() {
    this.videoPlaying = true;
  }

  pauseVideo() {
    this.videoPlayer?.pause();
  }

  handlePauseVideo() {
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
        if (!this.isIos) {
          this.isFullScreen = true;
        }
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
        this.toggleVideoPlay(true);
        break;
      }
      case 'Escape': {
        this.exitFullScreen();
        break;
      }
      case 'ArrowLeft': {
        this.addVideoTime(-5);
        break;
      }
      case 'ArrowRight': {
        this.addVideoTime(5);
        break;
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
    if (value < this.totalTime) {
      this.videoEnded = false;
    }
  }

  @Watch('isVideoEnding', { immediate: true }) videoEndingChanged() {
    if (this.videoPlayer) {
      if (this.isVideoEnding && !this.nextEpisode) {
        const placeholderSize = this.isMobile ? 250 : 400;
        const scale = placeholderSize / this.videoPlayer.clientWidth;
        const height = this.videoPlayer.clientWidth * 0.6;

        anime({
          targets: this.videoPlayer,
          scale,
          height,
          translateY: 150 / scale,
          translateX: 50,
          duration: 300,
          easing: 'easeInOutQuad',
        });
      } else {
        anime({
          targets: this.videoPlayer,
          scale: 1,
          height: window.innerHeight,
          translateY: 0,
          translateX: 0,
          duration: 300,
          easing: 'easeInOutQuad',
        });
      }
    }
  }

  addVideoTime(seconds: number) {
    this.loading = true;
    this.setVideoTime(this.videoPlayer.currentTime + seconds);
  }

  setVideoTime(time: number) {
    this.loading = true;
    this.handlePlayerUpdateTime?.(time);
    this.currentTime = time;
    this.continuePlaying = false;
  }

  handleUpdateTime(time: number) {
    this.setVideoTime(time);
  }

  handlePlayerUpdateTime: DebouncedFunc<(time: number) => void> | null = null;

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
    if (!this.replay) {
      const progressItem = await VideoProgressModule.actions.getVideoProgress(this.video.id);
      if (progressItem && progressItem.timestamp < progressItem.duration) {
        this.setVideoTime(progressItem.timestamp);
      }
    }
  }

  handleLoad() {
    this.playVideo();
  }

  //! Toolbar

  showToolBar() {
    if (!this.isVideoEnding) {
      this.showToolbar = true;
    }
  }

  hideToolBar() {
    if (!this.isVideoEnding) {
      this.showToolbar = false;
    }
  }

  debounceHideToolbar() {
    this.showToolbar = true;
    if (this.toolBarTimeOut) clearTimeout(this.toolBarTimeOut);
    this.toolBarTimeOut = setTimeout(this.hideToolBar, 3000);
  }

  disableHideToolBar() {
    if (this.toolBarTimeOut) clearTimeout(this.toolBarTimeOut);
  }

  //! LifeCycle

  mounted() {
    if (this.videoPlayer) {
      this.videoPlayer.load();
      this.videoPlayer.addEventListener('ended', this.endOfVideo);
      this.videoPlayer.addEventListener('timeupdate', this.timeUpdate);
      this.videoPlayer.addEventListener('seeked', this.handleSeeked);
      this.videoPlayer.addEventListener('loadedmetadata', this.handleLoadedMetadata);
      this.videoPlayer.addEventListener('loadeddata', this.handleLoad);
      this.videoPlayer.addEventListener('pause', this.handlePauseVideo);
      this.videoPlayer.addEventListener('play', this.handlePlayVideo);

      document.addEventListener('fullscreenchange', this.handleFullScreenChange);
      this.videoPlayer.addEventListener('fullscreenchange', this.handleFullScreenChange);
      this.volume = this.videoPlayer.volume;
      window.addEventListener('keydown', this.handleKeyUp);

      if (this.isVideoEnding) {
        this.replayVideo();
      }

      const userAgent = window.navigator.userAgent;
      this.handlePlayerUpdateTime = debounce((time: number) => {
        this.videoPlayer.currentTime = time;
      }, 20);

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
      this.videoPlayer.removeEventListener('loadeddata', this.handleLoad);
      this.videoPlayer.removeEventListener('fullscreenchange', this.handleFullScreenChange);
      this.videoPlayer.removeEventListener('pause', this.handlePauseVideo);
      this.videoPlayer.removeEventListener('play', this.handlePlayVideo);

      this.videoPlayer.pause();
    }
    document.removeEventListener('fullscreenchange', this.handleFullScreenChange);
    window.removeEventListener('keydown', this.handleKeyUp);
  }
}
</script>

<style lang="postcss" scoped>
div.VideoPlayer {
  div.ToolBar {
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.9));
  }

  div.TopBar {
    background: linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7));
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
