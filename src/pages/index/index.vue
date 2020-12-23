<template>
  <div>Home</div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
  head: {
    title: 'Home',
  },
})
export default class Home extends Vue {}
</script>
