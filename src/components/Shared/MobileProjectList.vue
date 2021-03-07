<template>
  <div class="c-row-y flex w-full py-3 pl-2">
    <h3 class="font-semibold">
      <slot />
    </h3>
    <div class="flex-nowrap flex-0 flex flex-row pr-2 overflow-x-auto">
      <MobileProjectPlaceholder
        v-for="(project, index) of projects"
        :key="index"
        :project="project"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Project } from '@models';
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import Carrousel from './Display/Carousel.vue';
import MobileProjectPlaceholder from './MobileProjectPlaceholder.vue';
@Component({
  components: {
    Carrousel,
    MobileProjectPlaceholder,
  },
})
export default class MobileProjectList extends Vue {
  @Prop({ required: true }) projects!: Project[];

  public currentIndex = 0;
  public totalSlides = 0;
}
</script>
