<template>
  <div class="flex flex-col w-full pt-20 pb-20">
    <div class="grid"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { CoverBanner, MobileProjectList, ProjectList } from '@components';
import { coverProject, popularProject, allProjects } from '@data';
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
    title: 'Recherche',
  },
})
export default class Home extends BreakpointMixin {
  public coverProject = coverProject;
  public popularProjects = popularProject;
  public allProjects = allProjects;

  get continueProjects() {
    const progressList = VideoProgressModule.state.progressList;
    const projectConcerned = groupBy(progressList, ({ video }) => video.projectId);
    return Object.entries(projectConcerned)
      .filter(([key, value]) => value.some((s) => s.timestamp < s.duration))
      .map(([key, value]) => {
        return allProjects.find((f) => f.id === key);
      })
      .filter((f): f is Project => !!f);
  }
  get wishList() {
    return VideoProgressModule.state.wishList;
  }

  get isDesktop() {
    return this.windowWidth > BreakPointsValues.Small;
  }
}
</script>
