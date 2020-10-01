<template>
  <Action icon="icons/actions/back.svg" :to="previousLink">
    <slot v-if="$slots.default"></slot>
    <template v-else>{{ getRouteTitle }}</template>
  </Action>
</template>

<script lang="ts">
import { RouterModule } from '@store';
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { Route, Location } from 'vue-router';

@Component
export default class BackButton extends Vue {
  @Prop({ required: true }) fallback!: Location;

  get fromRoute() {
    return RouterModule.state.previousRoute;
  }

  get getRouteTitle() {
    return RouterModule.getters.previousRouteTitle || 'Retour';
  }

  get previousLink(): Location {
    if (this.fromRoute && this.fromRoute.name) {
      return {
        name: this.fromRoute.name,
      };
    } else {
      return this.fallback;
    }
  }
}
</script>
