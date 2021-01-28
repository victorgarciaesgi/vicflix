<template>
  <div
    class="ProjectPreview / fixed top-0 left-0 flex flex-col w-screen h-screen py-10 overflow-y-auto bg-black bg-opacity-50"
    @click="goBack"
  >
    <div
      class="Modal / flex-0 center bg-bg2 flex flex-col m-auto"
      style="width: 800px; height: 600px"
    >
      <div v-if="project" class="center flex">
        {{ project.title }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { allProjects } from '@constants';
import { Project } from '@models';
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator';

@Component({})
export default class ProjectPreview extends Vue {
  @Prop() id!: string;

  public project: Project | null = null;

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
}
</script>

<style lang="postcss" scoped>
div.ProjectPreview {
  z-index: 10600;
}
</style>
