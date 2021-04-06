<template>
  <div class="flex flex-col w-full pb-20">
    <CoverBanner :data="coverProject" />

    <component
      v-if="continueProjects.length"
      :is="isDesktop ? 'ProjectList' : 'MobileProjectList'"
      :projects="continueProjects"
      show-progress
    >
      {{ $t($messages.Home.ContinueWithProfile) }}
    </component>
    <component
      v-if="wishList.length"
      :is="isDesktop ? 'ProjectList' : 'MobileProjectList'"
      :projects="wishList"
    >
      {{ $t($messages.Home.MyList) }}
    </component>

    <component :is="isDesktop ? 'ProjectList' : 'MobileProjectList'" :projects="popularProjects">
      {{ $t($messages.Home.Popular) }}
    </component>
    <component :is="isDesktop ? 'ProjectList' : 'MobileProjectList'" :projects="allProjects">
      {{ $t($messages.Home.Popular) }}
    </component>
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
    title: 'Home',
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
      .filter(([key, value]) => value.some((s) => s.timestamp < s.duration - 5))
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
