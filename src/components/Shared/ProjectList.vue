<template>
  <div class="c-row-y flex w-full py-3">
    <div class="flex-nowrap flex flex-row justify-between">
      <h2 class="font-semibold" style="margin-left: 53px">
        <slot />
      </h2>
      <div
        v-if="totalSlides > 1"
        class="Bullets / flex-nowrap flex flex-row items-center"
        style="padding-right: 50px"
      >
        <div
          v-for="slide of totalSlides"
          :key="slide"
          class="bg-bg7 h-2px w-5 ml-1"
          :class="{ '!bg-text1': currentIndex + 1 === slide }"
        ></div>
      </div>
    </div>
    <Carrousel
      :arrows="true"
      :bullets="false"
      :center="true"
      :items-per-view="[[500, 1], [750, 2], [1100, 3], [1200, 4], [1500, 5], 6]"
      class="h-40"
      @update:index="currentIndex = $event"
      @update:slides="totalSlides = $event"
    >
      <component
        :is="type === 'project' ? 'ProjectPlaceholder' : 'SkillPlaceholder'"
        :showProgress="showProgress"
        v-for="project of projects"
        :key="project.id"
        :project="project"
        :skill="project"
        :in-carrousel="true"
      />
    </Carrousel>
  </div>
</template>

<script lang="ts">
import { Project, Skill } from '@models';
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import Carrousel from './Display/Carousel.vue';
import ProjectPlaceholder from './ProjectPlaceholder.vue';
import SkillPlaceholder from './SkillPlaceholder.vue';

@Component({
  components: {
    Carrousel,
    ProjectPlaceholder,
    SkillPlaceholder,
  },
})
export default class ProjectList extends Vue {
  @Prop({ required: true }) projects!: Project[] | Skill[];
  @Prop({ default: false, type: Boolean }) showProgress!: boolean;
  @Prop({ default: 'project' }) type!: 'project' | 'skill';

  public currentIndex = 0;
  public totalSlides = 0;
}
</script>
