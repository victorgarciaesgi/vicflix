<template>
  <Modal v-if="!isMobile" :width="800" :show="show" @close="goBack">
    <template #content>
      <PreviewContent v-if="project" :project="project" />
    </template>
  </Modal>
  <div
    v-else-if="show"
    class="h-screen-ios fixed top-0 left-0 z-40 flex flex-col w-screen h-screen overflow-y-auto bg-black"
  >
    <PreviewContent v-if="project" :project="project" />
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

  @Watch('id', { immediate: true }) idChanged() {
    const project = allProjects.find((f) => f.id === this.id);
    if (project) {
      this.project = project;
    } else {
      this.$router.push(this.$route.path);
    }
  }

  get isMobile() {
    return this.windowWidth < BreakPointsValues.Small;
  }

  goBack() {
    this.$router.push(this.$route.path);
  }

  @Watch('show', { immediate: true }) showWatch() {
    if (this.show) {
      document.body.style.overflow = 'hidden';
      if (this.windowWidth < BreakPointsValues.Small) {
        AuthModule.updateState({ hideNav: true });
      }
    } else {
      document.body.style.overflow = 'auto';
      AuthModule.updateState({ hideNav: false });
    }
  }
}
</script>

<style lang="postcss" scoped>
div.Picture-Wrapper {
  .VImg {
    mask-image: linear-gradient(to top, rgba(0, 0, 0, 0) 5%, black 60%);
  }
}
</style>
