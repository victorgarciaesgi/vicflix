<template>
  <div class="flex flex-col w-full">
    <CoverBanner :data="projectsBanner" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { CoverBanner } from '@components';
import { projectsBanner } from '@constants';

@Component({
  components: {
    CoverBanner,
  },
  head: {
    title: 'Home',
  },
})
export default class Home extends Vue {
  public projectsBanner = projectsBanner;
}
</script>
