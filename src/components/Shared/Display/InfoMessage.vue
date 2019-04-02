<template>
  <div class="message flex column">
    <div v-if="title" class="title ellipsis">{{ title }}</div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class InfoMessage extends Vue {
  @Prop({ default: 'info' }) type: 'info' | 'error' | 'success';
  @Prop() title: string;
}
</script>



<style lang="scss" scoped>
div.message {
  width: 100%;
  border-radius: 4px;
  border: 1px solid $red1;

  div.title {
  }

  div.content {
    padding: 10px;
    white-space: pre;
    font-size: 16px;
  }
}
</style>
