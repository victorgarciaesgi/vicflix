<template>
  <Modal v-if="!isMobile" :width="800" :show="show" @close="goBack">
    <template #content>
      <div class="ModalContent / overflow-y-auto">
        <slot />
      </div>
    </template>
  </Modal>
  <div v-else>
    <transition :name="'slide-left'" mode="out-in">
      <div
        v-if="show"
        class=" h-screen-ios bg-bg2 fixed top-0 left-0 z-40 flex flex-col w-screen h-screen overflow-y-auto"
        @scroll.stop
      >
        <slot />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { BreakpointMixin } from '@mixins';
import { BreakPointsValues } from '@models';
import { AuthModule } from '@store';
import { Component, Prop, Watch } from 'nuxt-property-decorator';

@Component({})
export default class ProjectPreview extends BreakpointMixin {
  @Prop({ type: Boolean }) show!: boolean;

  public transitionName = 'slide-left';

  goBack() {
    const { jbv, xp, ...rest } = this.$route.query;
    this.$router.push({
      path: this.$route.path,
      query: rest,
    });
  }

  @Watch('show', { immediate: true }) showWatch() {
    if (this.show) {
      document.body.style.overflow = 'hidden';
      if (this.isMobile) {
        // document.body.style.position = 'fixed';
      }
      this.transitionName = 'slide-left';
      if (this.windowWidth < BreakPointsValues.Small) {
        AuthModule.updateState({ hideNav: true });
      }
    } else {
      this.transitionName = 'slide-right';
      document.body.style.overflow = 'auto';
      document.body.style.position = 'relative';
      AuthModule.updateState({ hideNav: false });
    }
  }

  mounted() {
    window.addEventListener('resize', this.showWatch);
  }
  beforeDestroy() {
    window.removeEventListener('resize', this.showWatch);
  }
}
</script>

<style lang="postcss" scoped>
div.ModalContent {
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    height: 50px;
    width: 100%;
    left: 0;

    @mixin dark {
      background: linear-gradient(to bottom, rgba(10, 10, 10, 0) 0%, rgba(10, 10, 10, 1) 90%);
    }
    @mixin light {
      background: linear-gradient(to bottom, rgba(250, 250, 250, 0) 0%, rgba(250, 250, 250, 1) 90%);
    }
  }
}
</style>
