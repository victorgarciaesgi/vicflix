<template>
  <div class="flex flex-col w-full pb-6">
    <CoverBanner :data="coverProject" />

    <component :is="isDesktop ? 'ProjectList' : 'MobileProjectList'" :projects="featuredProjects">
      Projets en vedette
    </component>
    <component :is="isDesktop ? 'ProjectList' : 'MobileProjectList'" :projects="popularProjects">
      Populaires en ce moment
    </component>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { CoverBanner, MobileProjectList, ProjectList } from '@components';
import { featuredProject, coverProject, popularProject } from '@data';
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
  public popularProjects = popularProject;

  get isDesktop() {
    return this.windowWidth > BreakPointsValues.Small;
  }
}
</script>
