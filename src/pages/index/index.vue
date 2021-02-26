<template>
  <div class="flex flex-col w-full pb-6">
    <CoverBanner :data="coverProject" />
    <ProjectList :projects="featuredProjects"> Projets en vedette </ProjectList>
    <ProjectList :projects="featuredProjects"> Projets en vedette </ProjectList>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { CoverBanner, ProjectList } from '@components';
import { featuredProject, coverProject } from '@data';

@Component({
  components: {
    CoverBanner,
    ProjectList,
  },
  head: {
    title: 'Home',
  },
})
export default class Home extends Vue {
  public coverProject = coverProject;
  public featuredProjects = featuredProject;
}
</script>
