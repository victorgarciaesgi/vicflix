<template>
  <div class="VolumeSlider / bg-bg3 flex px-3 py-4 rounded" style="height: 150px">
    <div
      ref="sliderRef"
      class="bg-bg6 relative h-full cursor-pointer"
      style="width: 6px"
      @click="handleVolumeChange"
    >
      <div
        class="bg-red absolute bottom-0 left-0 w-full"
        :style="{ height: `${calculatedVolume}%` }"
      ></div>
      <div
        :style="{ bottom: `${calculatedVolume}%` }"
        class=" bg-red hover:scale-110 left-1/2 absolute w-4 h-4 transition-transform duration-200 transform -translate-x-1/2 translate-y-1/2 rounded-full"
        @mousedown="handleMouseDown"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref, Emit } from 'nuxt-property-decorator';

@Component({})
export default class VolumeSlider extends Vue {
  @Prop({ type: Number }) volume!: number;

  @Ref() sliderRef!: HTMLDivElement;

  @Emit('update') updateVolume(volume: number) {
    return volume;
  }

  public dragging = false;

  get calculatedVolume() {
    return this.volume * 100;
  }

  handleMouseDown() {
    this.dragging = true;
    document.addEventListener('mousemove', this.handleMouseMove);
  }

  handleMouseMove(event: MouseEvent) {
    if (this.dragging) {
      this.handleVolumeChange(event);
      document.addEventListener('mouseup', this.handleMouseUp);
    }
  }

  handleMouseUp() {
    this.dragging = false;
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleVolumeChange(event: MouseEvent) {
    const sliderPos = this.sliderRef.getBoundingClientRect();
    const volumeValue = (event.clientY - sliderPos.y) / sliderPos.height;

    if (volumeValue >= 0 && volumeValue <= 1) {
      this.updateVolume(1 - volumeValue);
    }
  }
}
</script>
