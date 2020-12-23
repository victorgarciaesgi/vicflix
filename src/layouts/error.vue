<template>
  <div class="center column bg-bg1 --FullScreen-ext flex flex-grow h-full">
    <div class="flex flex-col" style="width: 500px">
      <h1 class="text-red inline text-center"
        >Oups! There is a <b>{{ error.statusCode }}</b> error</h1
      >
      <code v-if="isTesting && error.message" class="relative max-w-full">
        <pre class="w-full break-words whitespace-pre-line">{{ error.message }}</pre>
      </code>
      <div class="center flex py-4">
        <Action icon="actions/refresh" effect="rotate" theme="inverted" @click="reload"
          >Reload Page</Action
        >
        <!-- <Action @click="goToHome" class="ml-2" effect="rotate" theme="primary">Home</Action> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { routerPagesNames } from '@models';
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { Location } from 'vue-router';
import { isTesting } from '../constants';

@Component({
  head: {
    title: 'Erreur',
  },
})
export default class Error extends Vue {
  @Prop() error: any;

  get isTesting() {
    return isTesting;
  }

  reload() {
    if (process.browser) {
      window.location.reload();
    }
  }
}
</script>
