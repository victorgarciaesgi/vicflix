<template>
  <Modal v-if="!isMobile" :width="800" :show="show" @close="goBack">
    <template #content>
      <PreviewContent v-if="project" :project="project" />
    </template>
  </Modal>
  <div v-else>
    <transition :name="'slide-left'" mode="out-in">
      <div
        v-if="show"
        class="h-screen-ios bg-g20 fixed top-0 left-0 z-40 flex flex-col w-screen h-screen overflow-y-auto"
      >
        <PreviewContent v-if="project" :project="project" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { allProjects } from '@data';
import { BreakpointMixin } from '@mixins';
import { BreakPointsValues, Project } from '@models';
import { AuthModule } from '@store';
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator';
import PreviewContent from './PreviewContent.vue';

@Component({
  components: {
    PreviewContent,
  },
})
export default class ProjectPreview extends BreakpointMixin {
  @Prop({ type: String }) id!: string;
  @Prop({ type: Boolean }) show!: boolean;

  public project: Project | null = null;

  public transitionName = 'slide-left';

  @Watch('id', { immediate: true }) idChanged() {
    const project = allProjects.find((f) => f.id === this.id);
    if (project) {
      this.project = project;
    } else {
      this.$router.push(this.$route.path);
    }
  }

  goBack() {
    this.$router.push(this.$route.path);
  }

  @Watch('show', { immediate: true }) showWatch() {
    if (this.show) {
      document.body.style.overflow = 'hidden';
      if (this.isMobile) {
        document.body.style.position = 'fixed';
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
