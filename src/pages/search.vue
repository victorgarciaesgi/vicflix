<template>
  <div class="relative block w-full pt-40 pb-20">
    <div v-if="results.length" class="ProjectGrid / sm:px-2 sm:gap-1 grid justify-center px-12">
      <component
        :is="isMobile ? 'MobileProjectPlaceholder' : 'ProjectPlaceholder'"
        :showProgress="false"
        v-for="project of results"
        :key="project.id"
        :project="project"
        :inCarrousel="false"
        class="!mr-0"
      />
    </div>
    <div v-else class="flex flex-col items-center">
      <span>Aucun résultat pour votre recherche: "{{ q }}".</span>
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
import { ProjectPlaceholder, MobileProjectPlaceholder } from '@components';
import { allProjects } from '@data';
import { BreakpointMixin } from '@mixins';
import { Project } from '@models';
import { deburr } from 'lodash';
import { Component, Watch } from 'nuxt-property-decorator';

@Component({
  components: {
    ProjectPlaceholder,
    MobileProjectPlaceholder,
  },
  head: {
    title: 'Recherche',
  },
})
export default class Search extends BreakpointMixin {
  public results: Project[] = [];
  public q = '';

  get routeQuery() {
    return this.$route.query.q;
  }

  @Watch('routeQuery', { immediate: true }) queryChanged(q: string) {
    if (typeof q === 'string') {
      this.q = q;
      const lowQ = deburr(q.toLowerCase());
      const results = allProjects.filter((project) => {
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
      this.results = results;
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
