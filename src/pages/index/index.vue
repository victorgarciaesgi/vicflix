<template>
  <div class="flex flex-col w-full pb-6">
    <CoverBanner :data="milinusProject" />
    <ProjectList :projects="featuredProjects"> Projets en vedette </ProjectList>
    <ProjectList :projects="featuredProjects"> Projets en vedette </ProjectList>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { CoverBanner, ProjectList } from '@components';
import { featuredProject, milinusProject } from '@constants';

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
  public milinusProject = milinusProject;
  public featuredProjects = featuredProject;
}
</script>
