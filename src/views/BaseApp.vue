<template>
  <div class="root flex">
    <HeaderComponent />
    <ProgressBar />
    <div class="rootView">
      <transition name="fade" mode="out-in">
        <keep-alive>
          <router-view />
        </keep-alive>
      </transition>
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { HeaderComponent, ProgressBar } from '@components';

@Component({
  components: {
    HeaderComponent,
    ProgressBar,
  },
})
export default class BaseApp extends Vue {}
</script>



<style lang="scss" scoped>
div.root {
  width: 100%;
  background-color: #000;

  .rootView {
    position: absolute;
    display: flex;
    flex-flow: row nowrap;
    align-items: stretch;
    left: 0;
    top: 0;
    width: 100%;
    max-width: 100%;
    min-height: 100%;
    // min-height: calc(100% - #{$headerHeight});

    div.overlay {
      position: absolute;
      flex-flow: column wrap;
      z-index: 1000;
      height: 100%;
      left: 0;
      top: 0;
      width: 100%;
      background-color: rgba(255, 255, 255, 0.9);
      img {
        height: 70px;
        width: 70px;
      }

      span {
        margin-top: 15px;
        font-weight: bold;
        font-size: 24px;
      }
    }
  }
}
</style>
