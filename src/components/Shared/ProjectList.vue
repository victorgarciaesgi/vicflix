<template>
  <div class="c-row-y flex w-full py-3">
    <h2 class="font-semibold" style="margin-left: 53px">
      <slot />
    </h2>
    <Carrousel
      :arrows="true"
      :bullets="false"
      :center="true"
      :items-per-view="[[500, 1], [800, 2], [1100, 3], [1200, 4], [1500, 5], 6]"
      class="h-36"
    >
      <ProjectPlaceholder v-for="(project, index) of projects" :key="index" :project="project" />
    </Carrousel>
  </div>
</template>

<script lang="ts">
import { Project } from '@models';
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import Carrousel from './Display/Carousel.vue';
import ProjectPlaceholder from './ProjectPlaceholder.vue';
@Component({
  components: {
    Carrousel,
    ProjectPlaceholder,
  },
})
export default class ProjectList extends Vue {
  @Prop({ required: true }) projects!: Project[];
}
</script>
