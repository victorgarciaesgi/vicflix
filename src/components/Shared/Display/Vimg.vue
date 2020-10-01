<template>
  <div :class="getContainerClass" class="center bg-bg2 flex overflow-hidden">
    <img v-if="imageLoaded || error" :class="getImageClass" :src="loadedSrc" />
    <div v-else-if="loading" class="w-full p-1">
      <Spinner />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';
enum ImageType {
  Background = 'background',
  Default = 'default',
}
@Component({})
export default class Vimg extends Vue {
  @Prop({ required: true }) src!: string;
  @Prop({ default: ImageType.Background }) type!: ImageType;
  @Prop() srcFallback?: string;

  public loading = true;
  public imageLoaded = false;
  public error = false;

  get getContainerClass() {
    if (this.type === ImageType.Background) {
      return ['z-0 absolute top-0 left-0 object-cover w-full h-full', { 'bg-bg1': this.loading }];
    } else return [''];
  }

  get getImageClass() {
    if (this.type === ImageType.Background) {
      return ['absolute top-0 left-0 object-cover w-full h-full'];
    } else return ['w-full h-full object-cover'];
  }

  get loadedSrc() {
    if (!this.error) {
      return this.src;
    } else if (this.srcFallback) {
      return this.srcFallback;
    } else {
      return require('@images/placeholders/default.png');
    }
  }

  initLoad() {
    try {
      if (this.src) {
        const imgBackground = new Image();
        imgBackground.onload = (event) => {
          this.imageLoaded = true;
        };
        imgBackground.onerror = (event) => {
          this.error = true;
        };
        imgBackground.src = this.src;
      } else {
        this.loading = false;
        this.error = true;
        this.imageLoaded = true;
      }
    } catch (e) {
      this.error = true;
    }
  }

  created() {
    this.initLoad();
  }
}
</script>
