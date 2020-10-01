<template>
  <div :class="[size, { 'w-full': full }]" class="search-wrapper flex">
    <SvgIcon :size="getIconSize" class="img" src="icons/actions/search.svg" />
    <input
      :value="value"
      :placeholder="placeholder"
      type="text"
      @input="handleResearch($event.target.value)"
      @keydown.down.up.prevent.stop="$emit('update-result', $event)"
      @keydown.esc.prevent="$emit('echap', $event)"
      @keydown.enter.prevent="$emit('enter', $event)"
    />
    <Spinner v-if="loading" :size="getIconSize" class="icon" />
    <SvgIcon
      v-else-if="value.length"
      key="cancel"
      :size="size === 'big' ? 20 : 16"
      :pointer="true"
      class="icon"
      color="var(--text2)"
      src="icons/actions/cancel.svg"
      @click="$emit('input', '')"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import debounce from 'lodash/debounce';

@Component
export default class SearchField extends Vue {
  @Prop({ default: '' }) value!: string;
  @Prop() loading!: boolean;
  @Prop({ default: 300 }) debounce!: number;
  @Prop({ default: 1 }) offset!: number;
  @Prop({ default: 'Recherche...' }) placeholder!: string;
  @Prop({ default: 'normal' }) size!: 'normal' | 'big';
  @Prop() full?: boolean;

  handleResearch = debounce((value) => {
    if (value.length > this.offset) {
      this.$emit('input', value);
    } else if (value.length === 0) {
      this.$emit('input', '');
      this.$emit('clear');
    }
  }, this.debounce);

  get getIconSize() {
    if (this.size === 'normal') {
      return 16;
    } else {
      return 18;
    }
  }
}
</script>

<style lang="postcss" scoped>
div.search-wrapper {
  flex-flow: row nowrap;
  padding: 6px 5px 6px 5px;
  border-radius: 5px;
  background-color: var(--bg3);
  align-items: center;
  color: var(--text);
  max-width: 100%;

  .img {
    flex: 0 0 auto;
    margin-right: 5px;
  }

  input {
    outline: none;
    border: none;
    background: none;
    flex: 1 1 auto;
    width: 100px;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
  }

  &.full {
    width: 100%;
  }

  .icon {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
  }

  &.big {
    width: 250px;

    input {
      height: 26px;
      line-height: 26px;
    }

    .img {
      margin: 0 5px;
    }
  }
}
</style>
