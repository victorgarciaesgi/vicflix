<template>
  <div class="flex flex-col w-full pb-20">
    <CoverBanner :data="coverProject" />

    <component
      v-if="continueProjects.length"
      :is="isDesktop ? 'ProjectList' : 'MobileProjectList'"
      :projects="continueProjects"
      show-progress
    >
      Reprendre avec votre profil
    </component>
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
import { featuredProject, coverProject, popularProject, allVideos, allProjects } from '@data';
import { BreakpointMixin } from '@mixins';
import { BreakPointsValues, Project } from '@models';
import { VideoProgressModule } from '@store';
import { groupBy } from 'lodash';

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

  get continueProjects() {
    const progressList = VideoProgressModule.state.progressList;
    const projectConcerned = groupBy(progressList, ({ video }) => video.projectId);
    return Object.entries(projectConcerned)
      .map(([key, value]) => {
        return allProjects.find((f) => f.id === key);
      })
      .filter((f): f is Project => !!f);
  }

  get isDesktop() {
    return this.windowWidth > BreakPointsValues.Small;
  }
}
</script>
