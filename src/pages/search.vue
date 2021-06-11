<template>
  <div class="relative block w-full pt-40 pb-20">
    <div v-if="results.length" class="ProjectGrid / sm:px-2 sm:gap-1 grid justify-center px-12">
      <component
        :is="componentType(data)"
        :showProgress="false"
        v-for="data of results"
        :key="data.id"
        :data="data"
        :inCarrousel="false"
        class="!mr-0"
      />
    </div>
    <div v-else class="flex flex-col items-center">
      <span>{{ $t($messages.Search.NoResults) }} "{{ q }}".</span>
      <br />
      <span>Suggestions:</span>
      <ul class="px-8 mt-2">
        <li>Essayez avec d'autres mots-clés</li>
        <li>Essayez avec le titre d'un projet</li>
        <li>Essayez avec un genre, tel que App, Site, Mobile</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ProjectPlaceholder,
  MobileProjectPlaceholder,
  ExperiencePlaceholder,
  MobileExperiencePlaceholder,
} from '@components';
import { allExperiences, allProjects } from '@data';
import { BreakpointMixin } from '@mixins';
import { Project } from '@models';
import { isExperience, isProject } from '@utils';
import { deburr } from 'lodash';
import { Experience } from 'models/xp.model';
import { Component, Watch } from 'nuxt-property-decorator';

@Component({
  components: {
    ProjectPlaceholder,
    MobileProjectPlaceholder,
    ExperiencePlaceholder,
    MobileExperiencePlaceholder,
  },
})
export default class Search extends BreakpointMixin {
  head() {
    return {
      title: this.$t(this.$messages.Search.Title),
    };
  }
  public results: (Project | Experience)[] = [];
  public q = '';

  get routeQuery() {
    return this.$route.query.q;
  }

  get componentType() {
    return (data: Project | Experience) => {
      if (this.isMobile) {
        if (isProject(data)) return 'MobileProjectPlaceholder';
        if (isExperience(data)) return 'MobileExperiencePlaceholder';
      } else {
        if (isProject(data)) return 'ProjectPlaceholder';
        if (isExperience(data)) return 'ExperiencePlaceholder';
      }
    };
  }

  @Watch('routeQuery', { immediate: true }) queryChanged(q: string) {
    if (typeof q === 'string') {
      this.q = q;
      const lowQ = deburr(q.toLowerCase());
      const projectResults = allProjects.filter((project) => {
        let compatible = false;
        if (deburr(project.title.toLowerCase()).includes(lowQ)) {
          compatible = true;
        } else if (project.type.some((s) => deburr(s.toLowerCase()).includes(lowQ))) {
          compatible = true;
        } else if (project.technos.some((s) => deburr(s.toLowerCase()).includes(lowQ))) {
          compatible = true;
        }
        return compatible;
      });
      const experienceResults = allExperiences.filter((experience) => {
        let compatible = false;
        if (deburr(experience.title.toLowerCase()).includes(lowQ)) {
          compatible = true;
        } else if (experience.technos.some((s) => deburr(s.toLowerCase()).includes(lowQ))) {
          compatible = true;
        }
        return compatible;
      });
      this.results = [...projectResults, ...experienceResults];
    }
  }
}
</script>

<style lang="postcss" scoped>
div.ProjectGrid {
  grid-gap: 8px;
  grid-template-columns: repeat(auto-fit, 230px);
  grid-auto-flow: row dense;

  @screen sm {
    grid-template-columns: repeat(auto-fill, 8rem);
  }
}
</style>
