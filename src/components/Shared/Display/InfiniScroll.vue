<template>
  <div
    class="infini-scroll flex"
    v-cloak
    ref="scrollRoot"
    v-infinite-scroll="type === 'scroll' ? getMore : null"
    :infinite-scroll-disabled="loading && lazyFinished"
    :infinite-scroll-distance="0"
    :infinite-scroll-immediate-check="true"
  >
    <slot :loading="useLoading" />
    <div v-if="type === 'scroll' && useHasNextPage" class="spinner-wrapper flex center w100">
      <Spinner :size="spinnerSize" />
    </div>
    <div
      v-else-if="type === 'button' && useHasNextPage && usePage > 1"
      class="button-wrapper flex center w100 pad10"
    >
      <VButton :submitting="loading" size="mini" class="button-more" @click="getMore">
        Voir plus de résultats
      </VButton>
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { IPaginate } from '@models';
import Spinner from './Spinner.vue';
import VButton from './VButton.vue';

@Component({
  components: {
    Spinner,
    VButton,
  },
})
export default class InfiniScroll extends Vue {
  private defaultPage = 1;
  private defaultHasNextPage = true;
  private defaultLoading = false;
  private lazyFinished = false;

  @Prop() handler: (...args: any[]) => IPaginate<any>;
  @Prop() handlerParams: { [x: string]: any };
  @Prop({ default: 'scroll' }) type: 'scroll' | 'button';
  @Prop({ default: 30 }) spinnerSize: number;
  @Prop({ default: true }) firstFetch: boolean;
  @Prop() page: number;
  @Prop() hasNextPage: boolean;
  @Prop() loading: boolean;

  $refs!: {
    scrollRoot: HTMLElement;
  };

  get usePage() {
    return this.page || this.defaultPage;
  }

  get useHasNextPage() {
    return this.hasNextPage != null ? this.hasNextPage : this.defaultHasNextPage;
  }

  get useLoading() {
    return this.loading != null ? this.loading : this.defaultLoading;
  }

  async getMore() {
    if (this.useHasNextPage) {
      try {
        if (this.loading != null) this.$emit('update:loading', true);
        else this.defaultLoading = true;
        this.lazyFinished = false;
        const { edges, pageInfo, aggregate } = await this.handler({
          ...this.handlerParams,
          page: this.usePage,
        });
        this.$emit('newContent', edges);
        if (this.page) this.$emit('update:page', this.page + 1);
        else this.defaultPage++;
        if (this.hasNextPage) this.$emit('update:hasNextPage', pageInfo.hasNextPage);
        else this.defaultHasNextPage = pageInfo.hasNextPage;
      } finally {
        if (this.loading != null) this.$emit('update:loading', false);
        else this.defaultLoading = false;
        this.lazyFinished = true;
      }
    }
  }

  async checkWindowSize() {
    if (
      this.$refs.scrollRoot &&
      this.$refs.scrollRoot.scrollHeight <= this.$refs.scrollRoot.clientHeight &&
      this.lazyFinished
    ) {
      await this.getMore();
    }
  }

  updated() {
    this.$nextTick(this.checkWindowSize);
  }

  created() {
    if (this.firstFetch) this.getMore();
    window.addEventListener('resize', () => {
      setTimeout(this.checkWindowSize, 400);
    });
  }
}
</script>



<style lang="scss" scoped>
div.infini-scroll {
  flex-flow: row wrap;
  overflow-y: auto;
  max-height: 100%;
  width: 100%;
  justify-content: inherit;
  align-items: inherit;
  align-content: inherit;
}
</style>
