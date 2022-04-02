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
      :items-per-view="[
        [500, 1],
        [750, 2],
        [1100, 3],
        [1200, 4],
        [1500, 5],
        [1700, 6],
        [1900, 7],
        8,
      ]"
      class="h-40"
      @update:index="currentIndex = $event"
      @update:slides="totalSlides = $event"
    >
      <component
        :is="componentType(project)"
        :showProgress="showProgress"
        v-for="project of projects"
        :key="project.id"
        :data="project"
        :in-carrousel="true"
      />
    </Carrousel>
  </div>
</template>

<script lang="ts">
import { Project, Skill } from '@models';
import { isExperience, isProject, isSkill } from '@utils';
import { Experience } from 'models/xp.model';
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import Carrousel from '../Display/Carousel.vue';
import ProjectPlaceholder from '../Projects/ProjectPlaceholder.vue';
import SkillPlaceholder from '../Skills/SkillPlaceholder.vue';
import ExperiencePlaceholder from '../Experience/ExperiencePlaceholder.vue';

@Component({
  components: {
    Carrousel,
    ProjectPlaceholder,
    SkillPlaceholder,
    ExperiencePlaceholder,
  },
})
export default class ProjectList extends Vue {
  @Prop({ required: true }) projects!: Project[] | Skill[] | Experience[];
  @Prop({ default: false, type: Boolean }) showProgress!: boolean;

  public currentIndex = 0;
  public totalSlides = 0;

  get componentType() {
    return (data: Project | Skill | Experience) => {
      if (isProject(data)) return 'ProjectPlaceholder';
      if (isSkill(data)) return 'SkillPlaceholder';
      if (isExperience(data)) return 'ExperiencePlaceholder';
    };
  }
}
</script>
