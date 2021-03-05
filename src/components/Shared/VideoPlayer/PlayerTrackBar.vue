<template>
  <div
    class="PlayerTrackBar / flex-nowrap flex flex-row items-center pl-2"
    @mouseenter="handleShowIndicator"
    @mousemove="handleIndicatorMove"
    @mouseleave="handleHideIndicator"
  >
    <div
      ref="barRef"
      class="Bar / bg-bg4 hover:h-3 relative flex-1 h-2 transition-all duration-300 cursor-pointer"
      @click="handleTimeChange"
    >
      <div
        class="Progress / bg-bg8 absolute top-0 left-0 h-full"
        :style="{ width: `${currentProgressPercent}%` }"
      ></div>

      <div
        class="CurrentTime / bg-red absolute top-0 left-0 h-full"
        :style="{ width: `${currentTimePercent}%` }"
      ></div>
      <div
        v-if="showIndicator"
        :style="{ left: `${indicatorPosition}%`, width: '2px' }"
        class="Indicator / bg-text6 absolute h-full"
      ></div>
      <div
        :style="{ left: `${currentTimePercent}%` }"
        class="Ball / bg-red hover:scale-110 top-1/2 absolute w-5 h-5 transition-transform duration-200 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
        @mousedown="handleMouseDown"
      ></div>
    </div>
    <div class="Remaining / center flex w-20 pl-3">
      <span>{{ remainingTime }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref, Emit } from 'nuxt-property-decorator';

@Component({})
export default class PlayerTrackBar extends Vue {
  @Prop({ required: true, type: Number }) currentTime!: number;
  @Prop({ required: true, type: Number }) currentProgress!: number;
  @Prop({ required: true, type: String }) remainingTime!: string;
  @Prop({ required: true, type: Number }) totalTime!: number;

  @Ref() barRef!: HTMLDivElement;

  @Emit('update') updateTime(time: number) {}

  public dragging = false;

  public showIndicator = false;
  public indicatorPosition = 0;

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
    const position = ((event.clientX - sliderPos.x) / sliderPos.width) * 100;
    if (position >= 0 && position <= 100) {
      this.indicatorPosition = position;
    }
  }

  handleHideIndicator() {
    this.showIndicator = false;
  }

  handleMouseDown() {
    this.dragging = true;
    document.addEventListener('mousemove', this.handleMouseMove);
  }

  handleMouseMove(event: MouseEvent) {
    if (this.dragging) {
      this.handleTimeChange(event);
      document.addEventListener('mouseup', this.handleMouseUp);
    }
  }

  handleMouseUp() {
    this.dragging = false;
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleTimeChange(event: MouseEvent) {
    const sliderPos = this.barRef.getBoundingClientRect();
    let timeValue = (event.clientX - sliderPos.x) / sliderPos.width;
    timeValue = this.totalTime * timeValue;

    if (timeValue >= 0 && timeValue <= this.totalTime) {
      this.updateTime(timeValue);
    }
  }
}
</script>
