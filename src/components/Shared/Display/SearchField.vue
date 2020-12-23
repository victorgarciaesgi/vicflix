<template>
  <div
    class="SearchField / flex-nowrap bg-bg1 flex flex-row items-center px-3 py-1 shadow"
    :class="[size, { full, rounded }]"
  >
    <div class="text-green2 flex-0">
      <!-- <SvgIcon src="profeel/search" :size="getIconSize" /> -->
    </div>
    <div class="flex-nowrap flex flex-row items-center flex-1 ml-2">
      <input
        :value="value"
        :placeholder="placeholder"
        type="text"
        class="flex-1 text-sm bg-transparent"
        @input="handleResearch($event.target.value)"
        @keydown.down.up.prevent.stop="$emit('update-result', $event)"
        @keydown.esc.prevent="$emit('echap', $event)"
        @keydown.enter.prevent="$emit('enter', $event)"
      />
      <Spinner v-if="loading" key="loading" :size="getIconSize" class="icon" />
      <SvgIcon
        v-else-if="value.length"
        key="cancel"
        :size="getIconSize"
        button
        class="icon"
        color="var(--text2)"
        src="actions/cancel"
        @click="$emit('input', '')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { debounce } from 'lodash-es';
import { Component, Vue, Prop } from 'nuxt-property-decorator';

@Component({})
export default class SearchField extends Vue {
  @Prop({ default: '' }) value!: string;
  @Prop({ required: false }) loading!: boolean;
  @Prop({ default: 300 }) debounce!: number;
  @Prop({ default: 0 }) offset!: number;
  @Prop({ default: 'Recherche...' }) placeholder!: string;
  @Prop({ default: 'lg' }) size!: 'md' | 'lg' | 'xl';
  @Prop({ required: false }) full?: boolean;
  @Prop({ type: Boolean, default: true }) rounded!: boolean;

  handleResearch = debounce((value) => {
    if (value.length > this.offset) {
      this.$emit('input', value);
    } else if (value.length === 0) {
      this.$emit('input', '');
      this.$emit('clear');
    }
  }, this.debounce);

  get getIconSize() {
    if (this.size === 'md') {
      return 14;
    } else if (this.size === 'lg') {
      return 18;
    } else {
      return 22;
    }
  }
}
</script>

<style lang="postcss" scoped>
div.SearchField {
  border-radius: 0.5rem;
  width: 270px;
  &.md input {
    height: 26px;
  }
  &.lg input {
    height: 32px;
  }
  &.xl input {
    height: 36px;
  }
  &.full {
    width: 100%;
  }
  &.rounded {
    @apply rounded-full;
  }
}
</style>
