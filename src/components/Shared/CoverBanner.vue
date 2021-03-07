<template>
  <div class="CoverBanner / flex flex-col">
    <div class="BannerWrapper / absolute w-full h-full">
      <VImg class="ImgWrapper" type="default" :src="picture" />
    </div>
    <div class="pt-28 sm:ml-0 sm:mt-20 flex flex-col items-start max-w-lg pb-10 mt-10 ml-10">
      <div class="sm:hidden flex flex-row items-center">
        <img src="/icon.png" width="18" />
        <span class="text-w220 ml-2 text-sm font-semibold tracking-widest">PROJECT</span>
      </div>
      <div class="sm:w-full sm:items-center flex flex-col items-start py-5">
        <img
          :src="logo"
          height="180"
          class="h-40"
          style="filter: drop-shadow(3px 2px 3px rgba(0, 0, 0, 0.2))"
        />
        <span class="text-md sm:text-xs" style="text-shadow: 1px 2px 1px rgba(0, 0, 0, 0.2)">{{
          data.description
        }}</span>
        <div class="text-w230 flex flex-row mt-2">
          <TechnoItem v-for="tech of data.technos" :key="tech" :techno="tech" />
        </div>
        <div class="sm:justify-center flex flex-row py-4">
          <Action icon="actions/play" theme="white" @click="playFirstVideo">Lecture</Action>
          <Action class="sm:hidden" icon="alerts/info" theme="gray" :to="toPreviewLink"
            >Plus d'infos</Action
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Project, routerPagesNames } from '@models';
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import { Location } from 'vue-router';
import TechnoItem from './Techno.vue';

@Component({
  components: {
    TechnoItem,
  },
})
export default class CoverBanner extends Vue {
  @Prop({ required: true }) data!: Project;

  get picture() {
    return `/projects/${this.data.picture}`;
  }

  get logo() {
    return `/logos/${this.data.logo}`;
  }

  get toPreviewLink(): Location {
    return {
      path: this.$route.path,
      query: {
        jbv: this.data.id,
      },
    };
  }

  playFirstVideo() {
    const { videos } = this.data;
    if (videos[0]) {
      this.$router.push({ name: routerPagesNames.watch.id, params: { id: videos[0].id } });
    }
  }
}
</script>

<style lang="postcss" scoped>
div.CoverBanner {
  div.BannerWrapper {
    >>> img {
      mask-image: linear-gradient(to top, rgba(0, 0, 0, 0) 5%, black 60%);
    }
  }
}
</style>
