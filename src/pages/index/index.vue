<template>
  <div class="flex flex-col w-full pb-6">
    <CoverBanner :data="coverProject" />

    <template v-if="isDesktop">
      <ProjectList :projects="featuredProjects"> Projets en vedette </ProjectList>
      <ProjectList :projects="featuredProjects"> Populaires en ce moment </ProjectList>
    </template>
    <template v-else>
      <MobileProjectList :projects="featuredProjects"> Projets en vedette </MobileProjectList>
      <MobileProjectList :projects="featuredProjects"> Populaires en ce moment </MobileProjectList>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { CoverBanner, MobileProjectList, ProjectList } from '@components';
import { featuredProject, coverProject } from '@data';
import { BreakpointMixin } from '@mixins';
import { BreakPointsValues } from '@models';

@Component({
  components: {
    CoverBanner,
    MobileProjectList,
    ProjectList,
  },
  head: {
    title: 'Home',
  },
})
export default class Home extends BreakpointMixin {
  public coverProject = coverProject;
  public featuredProjects = featuredProject;

  get isDesktop() {
    return this.windowWidth > BreakPointsValues.Small;
  }
}
</script>
