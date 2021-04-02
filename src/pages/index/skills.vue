<template>
  <div class="relative block w-full pt-40 pb-20">
    <div class="ProjectGrid / sm:px-2 sm:gap-1 grid justify-center px-12">
      <component
        :is="isMobile ? 'MobileSkillPlaceholder' : 'SkillPlaceholder'"
        v-for="skill of skills"
        :key="skill.id"
        :skill="skill"
        class="!mr-0"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { SkillPlaceholder, MobileSkillPlaceholder } from '@components';
import { TechnosConstant } from '@constants';
import { BreakpointMixin } from '@mixins';
import { Component, Watch } from 'nuxt-property-decorator';

@Component({
  components: {
    SkillPlaceholder,
    MobileSkillPlaceholder,
  },
  head: {
    title: 'Recherche',
  },
})
export default class Skills extends BreakpointMixin {
  public skills = TechnosConstant;
}
</script>

<style lang="postcss" scoped>
div.ProjectGrid {
  gap: 8px;
  grid-template-columns: repeat(auto-fit, 230px);
  grid-auto-flow: row dense;

  @screen sm {
    grid-template-columns: repeat(auto-fill, 8rem);
  }
}
</style>
