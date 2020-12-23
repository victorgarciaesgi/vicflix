<template>
  <NuxtChild />
</template>

<script lang="ts">
import { authMiddleware } from '@middleware';
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
  middleware: authMiddleware,
})
export default class IndexRoot extends Vue {}
</script>
