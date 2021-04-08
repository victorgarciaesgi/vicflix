<template>
  <div class="PlayerTrackBar / flex-nowrap flex flex-row items-center pl-2 cursor-pointer">
    <div
      class="group flex flex-row flex-1 py-1"
      @mouseenter="handleShowIndicator"
      @mousemove="handleIndicatorMove"
      @mouseleave="handleHideIndicator"
      @click="handleTimeChange($event.clientX)"
    >
      <div
        ref="barRef"
        class="Bar / bg-g50 group-hover:h-3 relative flex-1 h-2 transition-all duration-300"
      >
        <div
          class="Progress / bg-w100 absolute top-0 left-0 h-full"
          :style="{ width: `${currentProgressPercent}%` }"
        ></div>

        <div
          class="CurrentTime / bg-red absolute top-0 left-0 h-full"
          :style="{ width: `${currentTimePercent}%` }"
        ></div>
        <Popin
          ref="popinIndicator"
          theme="g40"
          mode="manual"
          :shadow="true"
          v-if="!isMobile"
          :width="250"
          :arrow="false"
          :offset="10"
          :stopPropagation="false"
        >
          <template #content>
            <div class="flex flex-col w-full">
              <video
                ref="miniVideoPlayer"
                class="object-cover w-full h-32"
                preload="metadata"
                :src="video.videoUrl"
              >
                <source :src="video.videoUrl" type="video/mp4" />
              </video>
              <span class="px-2 py-1 text-center">{{ indicatorTimeValue }}</span>
            </div>
          </template>
          <template #button>
            <div :style="{ left: `${indicatorPosition}%` }" class="Indicator / absolute h-full">
              <div v-if="showIndicator" style="width: 2px" class="bg-w220 h-full"></div>
              <span v-else></span>
            </div>
          </template>
        </Popin>
        <div
          :style="{ left: `${currentTimePercent}%` }"
          ref="ballRef"
          class="Ball / bg-red hover:scale-110 top-1/2 sm:h-6 sm:w-6 absolute w-5 h-5 transition-transform duration-200 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
          @mousedown="handleMouseDown"
        ></div>
      </div>
    </div>
    <div class="Remaining / center flex w-20 pl-3">
      <span>{{ remainingTime }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Popin } from '@components/Global';
import { BreakpointMixin } from '@mixins';
import { ProjectVideo } from '@models';
import { secondsToHoursAndMinutes } from '@utils';
import { Component, Vue, Prop, Ref, Emit } from 'nuxt-property-decorator';

@Component({})
export default class PlayerTrackBar extends BreakpointMixin {
  @Prop({ required: true, type: Number }) currentTime!: number;
  @Prop({ required: true, type: Number }) currentProgress!: number;
  @Prop({ required: true, type: String }) remainingTime!: string;
  @Prop({ required: true, type: Number }) totalTime!: number;
  @Prop({ required: true }) video!: ProjectVideo;

  @Ref() barRef!: HTMLDivElement;
  @Ref() popinIndicator!: Popin;
  @Ref() miniVideoPlayer?: HTMLVideoElement;
  @Ref() ballRef!: HTMLDivElement;

  @Emit('update') updateTime(time: number) {}

  public dragging = false;

  public showIndicator = false;
  public indicatorPosition = 0;
  public indicatorTimeValue = '';

  get currentTimePercent() {
    if (this.totalTime !== 0) {
      return (this.currentTime / this.totalTime) * 100;
    }
    return 0;
  }

  get currentProgressPercent() {
    return this.currentProgress * 100;
  }

  handleShowIndicator() {
    this.showIndicator = true;
  }

  handleIndicatorMove(event: MouseEvent) {
    const sliderPos = this.barRef.getBoundingClientRect();
    const position = (event.clientX - sliderPos.x) / sliderPos.width;
    const timeValue = this.totalTime * position;
    let positionPercent = position * 100;

    if (positionPercent >= 0 && positionPercent <= 100) {
      this.indicatorPosition = positionPercent;
      this.indicatorTimeValue = secondsToHoursAndMinutes(timeValue);
      this.$nextTick(() => {
        if (this.popinIndicator) {
          this.popinIndicator.showPopup();
          this.popinIndicator.processPopupPlacement();
          if (this.miniVideoPlayer) {
            this.miniVideoPlayer.currentTime = timeValue;
          }
        }
      });
    }
  }

  handleHideIndicator() {
    this.showIndicator = false;
    this.popinIndicator?.closePopup();
  }

  //! Mouse

  handleMouseDown() {
    this.dragging = true;
    if (!this.isMobile) {
      document.addEventListener('mousemove', this.handleMouseMove);
    }
  }

  handleMouseMove(event: MouseEvent) {
    if (this.dragging && !this.isMobile) {
      this.handleTimeChange(event.clientX);
      document.addEventListener('mouseup', this.handleMouseUp);
    }
  }

  handleMouseUp() {
    this.dragging = false;
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  //! Touch

  handleTouchStart() {
    this.dragging = true;
    this.ballRef.addEventListener('touchmove', this.handleTouchMove);
  }

  handleTouchMove(event: TouchEvent) {
    if (this.dragging) {
      const { pageX } = event.touches[0];
      this.handleTimeChange(pageX);
    }
  }

  handleTouchEnd(event: TouchEvent) {
    this.dragging = false;
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleTimeChange(clientX: number) {
    const sliderPos = this.barRef.getBoundingClientRect();
    let timeValue = (clientX - sliderPos.x) / sliderPos.width;
    timeValue = this.totalTime * timeValue;

    if (timeValue >= 0 && timeValue <= this.totalTime) {
      this.updateTime(timeValue);
    }
  }

  mounted() {
    this.ballRef.addEventListener('touchstart', this.handleTouchStart);
    this.ballRef.addEventListener('touchend', this.handleTouchEnd);
  }

  beforeDestroy() {
    this.ballRef.removeEventListener('touchstart', this.handleMouseDown);
    this.ballRef.removeEventListener('touchend', this.handleMouseUp);
  }
}
</script>
