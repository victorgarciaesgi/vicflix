<template>
  <div class="flex w100 center">
    <h1>Error 404</h1>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component({})
export default class error404 extends Vue {}
</script>

<style lang="scss" scoped>
h1 {
  color: $primary;
}
</style>
