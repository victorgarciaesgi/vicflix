<template>
  <div v-if="type === 'progress'">
    <transition name="fade">
      <div
        class="progress"
        v-if="progressState.show"
        :style="{
          width: progressState.percent + '%',
          height: progressState.height,
          backgroundColor: progressState.canSuccess
            ? progressState.color
            : progressState.failedColor,
        }"
      ></div>
    </transition>
  </div>
  <div v-else>
    <transition name="fade">
      <div class="loader-wrapper flex" v-if="progressState.show">
        <Spinner class="spinner" :size="70" />
        <span>Recupération des données</span>
        <div class="bar">
          <div
            class="loader"
            :style="{
              width: progressState.percent + '%',
              backgroundColor: progressState.canSuccess
                ? progressState.loaderColor
                : progressState.failedColor,
            }"
          ></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator';
import { ProgressBarModule } from '@store';
import Spinner from './Spinner.vue';

@Component({
  components: {
    Spinner,
  },
})
export default class ProgressBar extends Vue {
  get progressState() {
    return ProgressBarModule.state;
  }

  get type() {
    return ProgressBarModule.state.type;
  }
}
</script>

<style lang='scss' scoped>
.progress {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  height: 2px;
  width: 0%;
  transition: width 0.2s linear, opacity 0.2s linear;
  z-index: 999999;
}

div.loader-wrapper {
  position: fixed;
  z-index: 999999;
  height: 100%;
  width: 100%;
  background-color: white;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  padding: 20px;

  div.spinner {
    margin-bottom: 20px;
  }

  span {
    color: $primary;
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 10px;
  }

  div.bar {
    background-color: $w230;
    border-radius: 4px;
    height: 6px;
    position: relative;
    width: 500px;
    max-width: 100%;
    overflow: hidden;

    .loader {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      transition: width 0.2s linear;
    }
  }
}
</style>