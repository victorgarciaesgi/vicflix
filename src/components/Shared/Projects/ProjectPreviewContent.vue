<template>
  <div ref="containerRef" v-if="project" class="flex-nowrap flex flex-col">
    <div class="Picture-Wrapper / h-96 flex-0 flex">
      <VImg class="Cover" :src="picture" type="default" />
      <div class="bottom-8 sm:bottom-8 left-8 absolute flex flex-col items-start">
        <img
          :src="logo"
          class="sm:h-24 h-32"
          style="filter: drop-shadow(3px 2px 3px rgba(0, 0, 0, 0.4))"
        />
        <div
          class="sm:hidden flex flex-row items-center mt-4"
          style="filter: drop-shadow(3px 2px 3px rgba(0, 0, 0, 0.4))"
        >
          <img src="/icon.png" width="16" />
          <span class="text-w240 ml-2 text-sm font-semibold tracking-widest">PROJECT</span>
        </div>
        <div class="sm:hidden flex flex-row items-center mt-4">
          <Action
            :icon="hasProjectVideos ? 'actions/play' : 'actions/open_in'"
            theme="inverted"
            @click="playFirstVideo"
            >{{
              hasProjectVideos
                ? videoProgress
                  ? $t($messages.Actions.Continue)
                  : $t($messages.Actions.Play)
                : $t($messages.Actions.Consult)
            }}</Action
          >
          <Popin mode="hover" theme="text1">
            <template #content>
              <span class="text-bg1 px-3 py-1">
                {{
                  isInWishList
                    ? $t($messages.Projects.RemoveFromList)
                    : $t($messages.Projects.AddToList)
                }}
              </span>
            </template>
            <template #button>
              <div
                @click="addToWishList"
                class="center bg-bg4 border-bg10 flex p-1 ml-2 border-2 rounded-full"
              >
                <SvgIcon v-if="isInWishList" src="forms/done" :size="26" />
                <SvgIcon v-else src="actions/add" :size="26" />
              </div>
            </template>
          </Popin>
        </div>
      </div>
    </div>
    <div class="Infos-Wrapper / flex-0 flex flex-col px-8 py-5">
      <div class="-sm:hidden flex flex-col mb-5">
        <Action
          :icon="hasProjectVideos ? 'actions/play' : 'actions/open_in'"
          class="!mb-2"
          :w-full="true"
          theme="inverted"
          size="md"
          @click="playFirstVideo"
          >{{
            hasProjectVideos
              ? videoProgress
                ? $t($messages.Actions.Continue)
                : $t($messages.Actions.Play)
              : $t($messages.Actions.Consult)
          }}</Action
        >
        <Action
          v-if="isInWishList"
          @click="addToWishList"
          icon="forms/done"
          :w-full="true"
          size="md"
        >
          {{ $t($messages.Projects.RemoveFromList) }}
        </Action>
        <Action v-else @click="addToWishList" icon="actions/add" :w-full="true" size="md">
          {{ $t($messages.Projects.AddToList) }}
        </Action>
      </div>
      <div class="sm:flex-col flex flex-row items-start py-3">
        <div class="flex flex-col flex-1">
          <ProjectVideoProgress v-if="videoProgress && isMobile" :progress="videoProgress" />
          <h1 class="">{{ project.title }}</h1>
          <div class="flex flex-row items-center mt-3">
            <span class="text-green font-bold">{{ $t($messages.Projects.Recommended) }}</span>
            <span class="ml-2">{{ project.year }}</span>
            <span class="border-bg9 px-1 py-px ml-2 text-sm border">12+</span>
          </div>
          <div v-if="project.badges" class="flex flex-row items-center py-2">
            <component
              v-for="badge of project.badges"
              :key="badge.img"
              :is="badge.link ? 'a' : 'div'"
            >
              <img :src="badge.img" class="mt-1 mr-1" />
            </component>
          </div>
          <p v-if="project.slogan" class="mt-5">{{ $t(project.slogan) }}</p>
          <div
            ref="descriptionRef"
            v-if="project.description"
            class="relative mt-4 whitespace-pre-line"
            :class="{ 'line-clamp-8': !collapseDescription, 'pb-6': collapseDescription }"
            >{{ project.description }}

            <div
              v-if="needCollapase"
              class=" DescriptionBlock / text-text5 hover:underline absolute bottom-0 left-0 w-full pt-6 text-center cursor-pointer"
              :class="{ '!pt-0': collapseDescription }"
              @click="collapseDescription = !collapseDescription"
              >{{
                collapseDescription
                  ? $t($messages.Projects.SeeLess)
                  : $t($messages.Projects.SeeMore)
              }}</div
            >
          </div>
          <span v-if="project.links" class="text-red2 mt-6 mb-1 font-normal">{{
            $t($messages.Projects.Links)
          }}</span>
          <div v-if="project.links" class="flex flex-row">
            <a
              v-for="link of project.links"
              :key="link.link"
              :href="link.link"
              target="_blank"
              class=" text-bg6 bg-text1 flex flex-row items-center px-3 py-1 mb-2 mr-2 text-sm rounded-full"
            >
              <span>{{ link.title }}</span>
              <SvgIcon src="actions/open_in" class="ml-1" :size="16" />
            </a>
          </div>
          <p v-if="project.info" class="text-w140 py-5 text-sm whitespace-pre-line">{{
            $t(project.info)
          }}</p>
        </div>
        <div
          class=" flex-0 sm:flex-row sm:w-full sm:py-4 -sm:sticky -sm:top-10 sm:items-center flex flex-col w-1/3 ml-2 text-sm"
        >
          <div class="sm:mr-2 relative mb-4 mr-2">
            <span class="text-bg10">{{ $t($messages.Projects.Director) }}: </span>
            <span>Victor Garcia</span>
          </div>
          <div class="relative mb-4 mr-2">
            <span class="text-bg10">Genre: </span>
            <span>{{ project.type.join(', ') }}</span>
          </div>
          <div class="relative mb-4 mr-2">
            <span class="text-bg10">{{ $t($messages.Projects.Context) }}: </span>
            <span>{{ project.context }}</span>
          </div>
          <div v-if="projectDuration" class="relative mb-4 mr-2">
            <span class="text-bg10">{{ $t($messages.Projects.Duration) }}: </span>
            <span>{{ projectDuration }}</span>
          </div>
          <div class="sm:flex-row sm:items-center relative flex flex-row items-center mb-4">
            <span class="text-bg10">Technologies: </span>
            <div class="flex flex-row items-center">
              <Techno v-for="techno of project.technos" :key="techno" :techno="techno" size="md" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="project.videos.length" class="flex flex-col">
        <div class="flex flex-col justify-between">
          <div class="border-g80 flex flex-row items-center justify-between border-b">
            <h2 class="py-2 mb-2">{{ $t($messages.Projects.Episode) }}</h2>
            <SelectElement
              v-if="selectSeasonForm"
              class="w-44"
              v-model="selectSeasonForm.value"
              :data="selectSeasonForm.data"
              @input="handleSeasonChange"
              :container="$refs.containerRef"
            />
          </div>
          <div v-if="seasonVideos" class="flex flex-col">
            <VideoPreviewBanner v-for="video of seasonVideos" :key="video.id" :video="video" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { SelectField } from '@constructors';
import { allProjects } from '@data';
import { BreakpointMixin } from '@mixins';
import { ProgressList, Project, routerPagesNames } from '@models';
import { VideoProgressModule } from '@store';
import { monthsToYearsAndMonths } from '@utils';
import { lowerCase, range } from 'lodash';
import { Component, Prop, Ref, Watch } from 'nuxt-property-decorator';
import { SelectElement } from '../Forms';
import ProjectVideoProgress from '../ProjectVideoProgress.vue';
import Techno from '../Techno.vue';
import VideoPreviewBanner from '../VideoPreviewBanner.vue';

@Component({
  components: {
    Techno,
    VideoPreviewBanner,
    ProjectVideoProgress,
    SelectElement,
  },
})
export default class ProjectPreviewContent extends BreakpointMixin {
  @Prop({ type: String }) id!: string;

  @Ref() descriptionRef!: HTMLDivElement;

  public project: Project | null = null;

  @Watch('id', { immediate: true }) async idChanged() {
    const project = allProjects.find((f) => f.id === this.id);
    if (project) {
      this.project = project;
      const video = await VideoProgressModule.actions.getProjectProgress(project.id);
      if (video) {
        this.videoProgress = video;
        this.selectedSeason = video.video.season;
      }
    } else {
      this.$router.push(this.$route.path);
    }
  }

  public videoProgress: ProgressList | null = null;
  public collapseDescription = false;
  public needCollapase = true;
  public selectedSeason = 1;

  get seasonVideos() {
    return this.project?.videos.filter((f) => f.season === this.selectedSeason);
  }

  get availableSeasons() {
    return [...new Set(this.project?.videos.map((m) => m.season))].length;
  }

  get selectSeasonForm() {
    return new SelectField({
      nullable: false,
      options: range(0, this.availableSeasons).map((m) => {
        const countEpisodes = this.project?.videos.filter((f) => f.season === m + 1).length;
        return {
          value: m + 1,
          text: `${this.$t(this.$messages.Projects.Season)} ${m + 1}`,
          additional: `(${this.$tc(this.$messages.Projects.EpisodesCount, countEpisodes)})`,
        };
      }),
      value: this.selectedSeason,
    }).extract();
  }

  handleSeasonChange(value: number) {
    this.selectedSeason = value;
  }

  get picture() {
    return this.project?.picture;
  }

  get logo() {
    return `/logos/${this.project?.logo}`;
  }

  get isInWishList() {
    return !!VideoProgressModule.state.wishList.find((f) => f.id === this.project?.id);
  }

  addToWishList() {
    if (this.isInWishList) {
      VideoProgressModule.mutations.removeProjectFromWishList(this.project);
    } else {
      VideoProgressModule.mutations.addProjectToWishList(this.project);
    }
  }

  get projectDuration() {
    if (this.project?.duration) {
      return monthsToYearsAndMonths(this.project.duration);
    }
    return null;
  }

  get hasProjectVideos(): boolean {
    return !!this.project?.videos.length;
  }

  async playFirstVideo() {
    if (this.project?.videos.length) {
      const progress = await VideoProgressModule.actions.getProjectProgress(this.project.id);
      if (progress) {
        this.$router.push({ name: routerPagesNames.watch.id, params: { id: progress.video.id } });
      } else {
        this.$router.push({
          name: routerPagesNames.watch.id,
          params: { id: this.project.videos[0].id },
        });
      }
    } else if (this.project?.links) {
      Object.assign(document.createElement('a'), {
        target: '_blank',
        href: this.project.links[0].link,
      }).click();
    }
  }

  mounted() {
    if (
      this.descriptionRef &&
      this.descriptionRef.offsetHeight < this.descriptionRef.scrollHeight
    ) {
      this.collapseDescription = false;
    } else {
      this.needCollapase = false;
      this.collapseDescription = true;
    }
  }
}
</script>

<style lang="postcss" scoped>
div.Picture-Wrapper {
  .Cover >>> img {
    mask-image: linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(20, 20, 20, 1) 40%);
  }
}

div.DescriptionBlock {
  @mixin dark {
    background: linear-gradient(to bottom, rgba(20, 20, 20, 0) 0%, rgba(20, 20, 20, 1) 90%);
  }
  @mixin light {
    background: linear-gradient(to bottom, rgba(250, 250, 250, 0) 0%, rgba(250, 250, 250, 1) 90%);
  }
}
</style>
