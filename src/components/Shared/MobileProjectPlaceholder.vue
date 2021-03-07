<template>
  <NuxtLink
    :to="toPreviewLink"
    class="MobileProjectPlaceholder / flex-0 flex w-32 h-48 mr-2 cursor-pointer"
  >
    <VImg :src="picture" class="rounded" />
    <img :src="logo" class="left-1/2 bottom-3 absolute w-10 transform -translate-x-1/2" />
  </NuxtLink>
</template>

<script lang="ts">
import { Project } from '@models';
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import { Location } from 'vue-router';

@Component({
  components: {},
})
export default class MobileProjectPlaceholder extends Vue {
  @Prop() project!: Project;

  public init = false;
  public rendered = false;
  public showPreview = false;

  get picture() {
    const match = /^(.+)(\.\w+)$/.exec(this.project.picture);
    if (match) {
      return `/projects/${match[1]}_placeholder${match[2]}`;
    }
    return null;
  }

  get toPreviewLink(): Location {
    return {
      path: this.$route.path,
      query: {
        jbv: this.project.id,
      },
    };
  }

  get logo() {
    return `/logos/${this.project.logo}`;
  }
}
</script>

<style lang="postcss" scoped>
.Preview {
  box-shadow: 0 0 10px rgba(0, 0, 0, 1);
}
</style>
