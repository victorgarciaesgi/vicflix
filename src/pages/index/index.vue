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

    <component :is="isDesktop ? 'ProjectList' : 'MobileProjectList'" :projects="featuredProjects">
      {{ $t($messages.Home.Featured) }}
    </component>
    <component :is="isDesktop ? 'ProjectList' : 'MobileProjectList'" :projects="popularProjects">
      {{ $t($messages.Home.Popular) }}
    </component>
    <component :is="isDesktop ? 'ProjectList' : 'MobileProjectList'" :projects="skills">
      {{ $t($messages.Home.Skills) }}
    </component>
    <component :is="isDesktop ? 'ProjectList' : 'MobileProjectList'" :projects="allExperiences">
      {{ $t($messages.Nav.Experience) }}
    </component>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { CoverBanner, MobileProjectList, ProjectList } from '@components';
import { coverProject, popularProject, allProjects, allExperiences, featuredProjects } from '@data';
import { BreakpointMixin } from '@mixins';
import { BreakPointsValues, Project } from '@models';
import { VideoProgressModule } from '@store';
import { groupBy, sampleSize } from 'lodash';
import { TechnosConstant } from '@constants';

@Component({
  components: {
    CoverBanner,
    MobileProjectList,
    ProjectList,
  },
})
export default class Home extends BreakpointMixin {
  head() {
    return {
      title: this.$t(this.$messages.Nav.Home),
    };
  }

  public coverProject = coverProject;
  public popularProjects = popularProject;
  public allExperiences = allExperiences;
  public featuredProjects = featuredProjects;
  public skills = TechnosConstant.slice()
    .sort((a, b) => {
      const aP = allProjects.filter((f) => f.technos.includes(a.title)).length;
      const bP = allProjects.filter((f) => f.technos.includes(b.title)).length;
      return bP - aP;
    })
    .slice(0, 10);

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
