<template>
  <div class="c-row-y flex w-full py-3 pl-4">
    <h3 class="font-semibold">
      <slot />
    </h3>
    <div class="List / flex-nowrap flex-0 flex flex-row pr-2 overflow-x-auto">
      <component
        :is="componentType(project)"
        :showProgress="showProgress"
        v-for="project of projects"
        :key="project.id"
        :data="project"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Project, Skill } from '@models';
import { isExperience, isProject, isSkill } from '@utils';
import { Experience } from 'models/xp.model';
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import Carrousel from '../Display/Carousel.vue';
import MobileProjectPlaceholder from '../Projects/MobileProjectPlaceholder.vue';
import MobileSkillPlaceholder from '../Skills/MobileSkillPlaceholder.vue';
import MobileExperiencePlaceholder from '../Experience/MobileExperiencePlaceholder.vue';

@Component({
  components: {
    Carrousel,
    MobileProjectPlaceholder,
    MobileSkillPlaceholder,
    MobileExperiencePlaceholder,
  },
})
export default class MobileProjectList extends Vue {
  @Prop({ required: true }) projects!: Project[];
  @Prop({ default: false, type: Boolean }) showProgress!: boolean;

  public currentIndex = 0;
  public totalSlides = 0;

  get componentType() {
    return (data: Project | Skill | Experience) => {
      if (isProject(data)) return 'MobileProjectPlaceholder';
      if (isSkill(data)) return 'MobileSkillPlaceholder';
      if (isExperience(data)) return 'MobileExperiencePlaceholder';
    };
  }
}
</script>

<style lang="postcss" scoped>
div.List {
  scroll-snap-type: x mandatory;
  &::-webkit-scrollbar {
    display: none;
  }
  &::after {
    content: '';
    display: block;
    position: relative;
    right: -0.25rem;
    width: 0.25rem;
    height: 1px;
    flex-shrink: 0;
  }
}
</style>
