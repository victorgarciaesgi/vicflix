<template>
  <div v-if="experience" class="flex-nowrap flex flex-col pb-10">
    <div class="Picture-Wrapper / h-96 flex-0 flex">
      <VImg class="Cover" :src="picture" type="default" />
      <div class="bottom-8 sm:bottom-8 left-8 absolute flex flex-col items-start">
        <SvgIcon
          :src="experience.type === ExperienceType.Job ? 'social/job' : 'social/school'"
          class="sm:h-16 sm:w-16 w-24 h-24"
          style="filter: drop-shadow(3px 2px 3px rgba(0, 0, 0, 0.4))"
        />
      </div>
    </div>
    <div class="Infos-Wrapper / flex-0 flex flex-col px-8 py-5">
      <div class="-sm:hidden flex flex-col mb-5"> </div>
      <div class="sm:flex-col flex flex-row items-start py-3">
        <div class="flex flex-col flex-1">
          <div class="flex items-center">
            <h1>{{ experience.title }}</h1>
            <span
              v-if="experience.currentPosition"
              class="bg-blue px-3 py-1 ml-2 text-xs text-white rounded-full"
            >
              {{ $t($messages.Experience.CurrentPosition) }}
            </span>
          </div>
          <div class="flex flex-row items-center mt-3">
            <span class="text-green font-bold">{{ $t($messages.Projects.Recommended) }}</span>
          </div>
          <div
            ref="descriptionRef"
            v-if="experience.description"
            class="relative pb-6 mt-4 whitespace-pre-line"
            >{{ experience.description }}
          </div>
          <span v-if="experience.links" class="text-red2 mt-6 mb-1 font-normal">{{
            $t($messages.Projects.Links)
          }}</span>
          <div v-if="experience.links" class="flex flex-row">
            <a
              v-for="link of experience.links"
              :key="link.link"
              :href="link.link"
              target="_blank"
              class=" text-bg6 bg-text1 flex flex-row items-center px-3 py-1 mb-2 mr-2 text-sm rounded-full"
            >
              <span>{{ link.title }}</span>
              <SvgIcon src="actions/open_in" class="ml-1" :size="16" />
            </a>
          </div>
        </div>
        <div
          class=" flex-0 sm:flex-row sm:w-full sm:py-4 -sm:sticky -sm:top-10 sm:items-center flex flex-col w-1/3 ml-2 text-sm"
        >
          <div class="sm:mr-2 relative mb-4 mr-2">
            <span class="text-bg10">Role: </span>
            <span>{{ experience.role }}</span>
          </div>
          <div class="relative mb-4 mr-2">
            <span class="text-bg10">{{ $t($messages.Experience.Year) }}: </span>
            <span>{{ experience.year }}</span>
          </div>
          <div v-if="experienceDuration" class="relative mb-4 mr-2">
            <span class="text-bg10">{{ $t($messages.Projects.Duration) }}: </span>
            <span>{{ experienceDuration }}</span>
          </div>
          <div v-if="experienceDuration" class="relative mb-4 mr-2">
            <span class="text-bg10">{{ $t($messages.Experience.Location) }}: </span>
            <span>{{ experience.location }}</span>
          </div>
          <div
            v-if="experience.technos.length"
            class="sm:flex-row sm:items-center relative flex flex-row items-center mb-4"
          >
            <span class="text-bg10">Technologies: </span>
            <div class="flex flex-row items-center">
              <Techno
                v-for="techno of experience.technos"
                :key="techno"
                :techno="techno"
                size="md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Experience, ExperienceType, ProgressList, Project, routerPagesNames } from '@models';
import { Component, Vue, Prop, Ref, Watch } from 'nuxt-property-decorator';
import VideoPreviewBanner from '../VideoPreviewBanner.vue';
import Techno from '../Techno.vue';
import ProjectVideoProgress from '../ProjectVideoProgress.vue';
import { BreakpointMixin } from '@mixins';
import { monthsToYearsAndMonths } from '@utils';
import { allExperiences, allProjects } from '@data';

@Component({
  components: {
    Techno,
    VideoPreviewBanner,
    ProjectVideoProgress,
  },
})
export default class ProjectPreviewContent extends BreakpointMixin {
  @Prop({ type: String }) id!: string;

  public experience: Experience | null = null;
  public ExperienceType = ExperienceType;

  @Watch('id', { immediate: true }) async idChanged() {
    const experience = allExperiences.find((f) => f.id === this.id);
    if (experience) {
      this.experience = experience;
    } else {
      this.$router.push(this.$route.path);
    }
  }

  get picture() {
    return this.experience?.logo;
  }

  get experienceDuration() {
    if (this.experience?.duration) {
      return monthsToYearsAndMonths(this.experience.duration);
    }
    return null;
  }
}
</script>

<style lang="postcss" scoped>
div.Picture-Wrapper {
  .Cover >>> img {
    mask-image: linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(10, 10, 10, 1) 40%);
  }
}

div.DescriptionBlock {
  @mixin dark {
    background: linear-gradient(to bottom, rgba(10, 10, 10, 0) 0%, rgba(10, 10, 10, 1) 90%);
  }
  @mixin light {
    background: linear-gradient(to bottom, rgba(250, 250, 250, 0) 0%, rgba(250, 250, 250, 1) 90%);
  }
}
</style>
