<template>
  <div class="CoverBanner / flex flex-col">
    <div class="BannerWrapper / absolute flex w-full h-full">
      <img :src="picture" class="object-cover w-full h-full" />
    </div>
    <div class="py-28 flex flex-col items-start max-w-lg mt-10 ml-10">
      <div class="flex flex-row items-center">
        <img src="/icon.png" width="18" />
        <span class="text-w220 ml-2 text-sm font-semibold tracking-widest">PROJECT</span>
      </div>
      <div class="flex flex-col items-start py-5">
        <img
          :src="logo"
          height="180"
          class="h-40"
          style="filter: drop-shadow(3px 2px 3px rgba(0, 0, 0, 0.2))"
        />
        <span class="text-lg" style="text-shadow: 1px 2px 1px rgba(0, 0, 0, 0.2)">{{
          data.description
        }}</span>
        <div class="flex flex-row py-4">
          <Action icon="actions/play" theme="white">Lecture</Action>
          <Action icon="alerts/info" theme="gray">Plus d'infos</Action>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { BaseInfo } from '@models';
import { Component, Vue, Prop } from 'nuxt-property-decorator';

@Component({})
export default class CoverBanner extends Vue {
  @Prop({ required: true }) data!: BaseInfo;

  get picture() {
    return `/projects/${this.data.picture}`;
  }

  get logo() {
    return `/logos/${this.data.logo}`;
  }
}
</script>

<style lang="postcss" scoped>
div.CoverBanner {
  div.BannerWrapper {
    &::after {
      content: '';
      position: absolute;
      bottom: 0px;
      left: 0;
      width: 100%;
      height: 100px;
      background: linear-gradient(
        rgba(0, 0, 0, 0),
        rgba(30, 30, 30, 0.95) 70%,
        rgba(30, 30, 30, 1) 80%
      );
    }
  }
}
</style>
