<template>
  <NuxtChild />
</template>

<script lang="ts">
import { authMiddleware } from '@middleware';
import { TransitionMixin } from '@mixins';
import { navRoutes, TransitionDirection, TransitionType } from '@models';
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
  middleware: authMiddleware,
})
export default class IndexRoot extends TransitionMixin {
  transitionType = TransitionType.List;
  transitionDirection = TransitionDirection.Horizontal;
  listRoutes = navRoutes;
}
</script>
