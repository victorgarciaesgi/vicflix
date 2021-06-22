<template>
  <NuxtLink
    :to="toPreviewLink"
    class=" MobileProjectPlaceholder / flex-0 justify-self-center flex w-32 h-48 mr-2 overflow-hidden rounded cursor-pointer"
  >
    <div class="center flex w-full h-full p-4 rounded" :style="{ backgroundColor: data.color }">
      <SvgIcon :src="logo" color="w230" class="max-w-full" :size="100" />
      <span class="text-md text-white">{{ data.title }}</span>
    </div>
  </NuxtLink>
</template>

<script lang="ts">
import { Project, routerPagesNames, Skill } from '@models';
import { VideoProgressModule } from '@store';
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import { Location } from 'vue-router';

@Component({
  components: {},
})
export default class MobileSkillPlaceholder extends Vue {
  @Prop() data!: Skill;

  get logo() {
    return this.data.logo;
  }

  get toPreviewLink(): Location {
    return {
      path: routerPagesNames.search,
      query: {
        q: this.data.title,
      },
    };
  }
}
</script>

<style lang="postcss" scoped>
.Preview {
  box-shadow: 0 0 10px rgba(0, 0, 0, 1);
}
</style>
