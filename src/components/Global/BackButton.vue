<template>
  <NuxtLink :to="previousLink" class="text-green hover:underline flex flex-row items-center mb-3">
    <SvgIcon src="forms/arrow_left" :size="20" />
    <span class="ml-1 text-sm font-semibold">
      <slot v-if="$slots.default"></slot>
      <template v-else>{{ getRouteTitle }}</template>
    </span>
  </NuxtLink>
</template>

<script lang="ts">
import { RouterModule } from '@store';
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { Route, Location } from 'vue-router';

@Component({})
export default class BackButton extends Vue {
  @Prop({ required: true }) fallback!: Location;
  @Prop({ required: false }) link?: Location;

  get fromRoute() {
    return RouterModule.state.previousRoute;
  }

  get getRouteTitle() {
    return RouterModule.getters.previousRouteTitle || 'Retour';
  }

  get previousLink(): Location {
    if (this.link) {
      return this.link;
    } else if (this.fromRoute && this.fromRoute.name) {
      return {
        name: this.fromRoute.name,
      };
    } else {
      return this.fallback;
    }
  }
}
</script>
