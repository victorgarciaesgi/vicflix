<template>
  <Modal v-if="!isMobile" :width="800" :show="show" @close="goBack">
    <template #content>
      <div
        @scroll="handleModalScroll"
        ref="modalContentRef"
        class="ModalContent / bg-bg3 overflow-y-auto"
        :class="{ showShadow }"
      >
        <slot />
      </div>
    </template>
  </Modal>
  <div v-else>
    <transition :name="'slide-left'" mode="out-in">
      <div
        v-if="show"
        class=" h-screen-ios bg-bg3 c-row-y fixed top-0 left-0 z-40 flex w-screen h-screen overflow-y-auto"
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
import { Component, Prop, Ref, Watch } from 'nuxt-property-decorator';

@Component({})
export default class ProjectPreview extends BreakpointMixin {
  @Prop({ type: Boolean }) show!: boolean;

  @Ref() modalContentRef?: HTMLDivElement;

  public transitionName = 'slide-left';
  public showShadow = false;

  goBack() {
    const { jbv, xp, ...rest } = this.$route.query;
    this.$router.push({
      path: this.$route.path,
      query: rest,
    });
  }

  handleModalScroll() {
    if (this.modalContentRef) {
      if (
        this.modalContentRef.scrollTop + this.modalContentRef.clientHeight ===
        this.modalContentRef.scrollHeight
      ) {
        this.showShadow = false;
      } else {
        this.showShadow = true;
      }
    }
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
  &.showShadow {
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      height: 50px;
      width: 100%;
      left: 0;

      @mixin dark {
        background: linear-gradient(to bottom, rgba(20, 20, 20, 0) 0%, rgba(20, 20, 20, 1) 90%);
      }
      @mixin light {
        background: linear-gradient(
          to bottom,
          rgba(250, 250, 250, 0) 0%,
          rgba(250, 250, 250, 1) 90%
        );
      }
    }
  }
}
</style>
