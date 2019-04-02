<template>
  <div class="spinner-wrapper flex">
    <SvgIcon src="images/loading.svg" type="stroke" :size="size" :color="color" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class Spinner extends Vue {
  @Prop({ default: 'primary' })
  color: string;

  @Prop({ default: 30 }) size: number;
}
</script>

<style lang="scss" scoped>
div.spinner-wrapper {
  justify-content: center;
  align-items: center;
  width: 100%;
  flex: 0 0 auto;
  padding: 10px;
}
</style>
