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
    <component :is="isDesktop ? 'ProjectList' : 'MobileProjectList'" :projects="projects">
      {{ $t($messages.Home.All) }}
    </component>

    <component :is="isDesktop ? 'ProjectList' : 'MobileProjectList'" :projects="appsProjects">
      Applications
    </component>

    <component :is="isDesktop ? 'ProjectList' : 'MobileProjectList'" :projects="webisteProjects">
      Sites web
    </component>
    <component :is="isDesktop ? 'ProjectList' : 'MobileProjectList'" :projects="libraryProjects">
      Librairies
    </component>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { CoverBanner, MobileProjectList, ProjectList } from '@components';
import { allProjects, bigupProject, kazeProject } from '@data';
import { BreakpointMixin } from '@mixins';
import { BreakPointsValues, Project, ProjectType } from '@models';
import { VideoProgressModule } from '@store';
import { groupBy, shuffle } from 'lodash';

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
      title: this.$t(this.$messages.Nav.Projects),
    };
  }

  public coverProject = kazeProject;

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

  get projects() {
    return shuffle(allProjects);
  }

  get appsProjects() {
    return shuffle(allProjects.filter((f) => f.type.includes(ProjectType.App)));
  }

  get webisteProjects() {
    return shuffle(allProjects.filter((f) => f.type.includes(ProjectType.Site)));
  }

  get libraryProjects() {
    return shuffle(allProjects.filter((f) => f.type.includes(ProjectType.Library)));
  }

  get wishList() {
    return VideoProgressModule.state.wishList;
  }

  get isDesktop() {
    return this.windowWidth > BreakPointsValues.Small;
  }
}
</script>
