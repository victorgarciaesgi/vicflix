<template>
  <div class="search-wrapper flex" :class="[size]">
    <img src="~@icons/actions/search.svg" />
    <input
      type="text"
      :value="value"
      @input="handleResearch($event.target.value)"
      :placeholder="placeholder"
    />
    <SvgIcon class="icon" v-if="loading" src="images/loading_blue.svg" :size="20" key="loading" />
    <SvgIcon
      v-else-if="value.length"
      class="icon"
      src="icons/cancel.svg"
      :size="20"
      :pointer="true"
      @click="$emit('clear')"
      key="cancel"
    />
  </div>
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import debounce from 'lodash/debounce';

@Component
export default class SearchField extends Vue {
  @Prop() value: string;
  @Prop() loading: boolean;
  @Prop({ default: 300 }) debounce: number;
  @Prop({ default: 1 }) offset: number;
  @Prop({ default: 'Recherche...' }) placeholder: string;
  @Prop({ default: 'normal' }) size: 'normal' | 'big';

  private handleResearch = null;

  created() {
    this.handleResearch = debounce(value => {
      if (value.length > this.offset) {
        this.$emit('input', value);
      } else if (value.length === 0) {
        this.$emit('clear');
      }
    }, this.debounce);
  }
}
</script>



<style lang="scss" scoped>
div.search-wrapper {
  flex-flow: row nowrap;
  padding: 6px 5px 6px 5px;
  border-radius: 4px;
  background-color: $w240;
  color: $g60;

  img {
    width: 18px;
    height: 18px;
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

  .icon {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
  }

  &.big {
    img {
      width: 22px;
      height: 22px;
    }

    input {
      height: 26px;
      line-height: 26px;
    }
  }
}
</style>
