<template>
  <div :class="{ active }" class="menu-button" @click="$emit('click', $event)">
    <SvgIcon v-if="icon" :src="srcIcon" :size="20" class="button-icon" color="var(--text3)" />
    <span v-else class="text-text3 text-sm font-bold">{{ text }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';

@Component({})
export default class ButtonExtension extends Vue {
  @Prop() active!: boolean;
  @Prop({ required: false }) icon?: string;
  @Prop({ required: false }) text?: string;

  get srcIcon() {
    if (this.icon) return `richtext/${this.icon}`;
    return null;
  }
}
</script>

<style lang="postcss" scoped>
div.menu-button {
  padding: 5px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 5px;

  &:hover:not(.active) {
    background-color: var(--bg4);
  }

  &.active {
    background-color: var(--bg5);
  }
}
</style>
