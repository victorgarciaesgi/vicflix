<template>
  <div v-if="progress" class="flex flex-col py-1">
    <span class="text-w120 sm:text-w160 sm:text-md mb-1 text-xs"
      >S{{ progress.video.season }}: Episode {{ progress.video.episode }}</span
    >
    <div class="flex-nowrap flex flex-row items-center">
      <div class="bg-g90 flex flex-1 w-full rounded" style="height: 3px">
        <div
          class="bg-red absolute top-0 left-0 h-full rounded"
          :style="{ width: `${progress.percentage}%` }"
        ></div>
      </div>
      <span class="text-xxs sm:text-sm text-w190 ml-2"
        >{{ currentProgressTime }} sur {{ durationTime }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { ProgressList } from '@models';
import { secondsToHoursAndMinutes } from '@utils';
import { Component, Vue, Prop } from 'nuxt-property-decorator';

@Component({})
export default class ProjectVideoProgress extends Vue {
  @Prop({ required: true }) progress!: ProgressList;

  get currentProgressTime() {
    if (this.progress) {
      return secondsToHoursAndMinutes(this.progress.timestamp);
    }
    return null;
  }

  get durationTime() {
    if (this.progress) {
      return secondsToHoursAndMinutes(this.progress.duration);
    }
    return null;
  }
}
</script>
