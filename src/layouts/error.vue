<template>
  <div class="center column bg-bg1 flex flex-grow h-full">
    <div class="flex flex-col" style="width: 500px">
      <h1 class="text-red inline"
        >Oups! There is a <b>{{ error.statusCode }}</b> error</h1
      >
      <div class="center flex py-4">
        <Action icon="icons/actions/refresh.svg" effect="rotate" theme="inverted" @click="reload"
          >Reload Page</Action
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component({
  head: {
    title: 'Erreur',
  },
})
export default class Error extends Vue {
  @Prop() error: any;

  reload() {
    if (process.browser) {
      window.location.reload();
    }
  }
}
</script>
