<template>
  <NuxtChild :key="$route.params.id" />
</template>

<script lang="ts">
import { authMiddleware } from '@middleware';
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
  middleware: authMiddleware,
  layout: 'watch',
})
export default class WatchRoot extends Vue {}
</script>
