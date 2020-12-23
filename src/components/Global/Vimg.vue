<template>
  <div
    :class="getContainerClass"
    class="VImg / center flex overflow-hidden"
    :style="getContainerStyle"
  >
    <ClientOnly>
      <div v-if="loading" class="client-rendered flex justify-center w-full p-1">
        <Spinner :size="20" />
      </div>

      <template v-else-if="imageLoaded || error">
        <img
          :class="getImageClass"
          loading="lazy"
          :alt="alt"
          :src="loadedSrc"
          :width="width"
          :height="height"
        />
      </template>

      <template #placeholder>
        <img
          :src="src"
          :class="getImageClass"
          loading="lazy"
          :alt="alt"
          class="server-rendered"
          :width="width"
          :height="height"
        />
      </template>
    </ClientOnly>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator';
enum ImageType {
  Background = 'background',
  Default = 'default',
}
@Component({})
export default class Vimg extends Vue {
  @Prop({ required: true }) src!: string;
  @Prop({ default: ImageType.Background }) type!: ImageType;
  @Prop({ required: false }) srcFallback?: string;
  @Prop({ default: 'both' }) fill!: 'height' | 'width' | 'both';
  @Prop({ default: 'cover' }) fit!: 'contain' | 'cover' | 'none';
  @Prop({ default: 'image' }) alt!: string;
  @Prop({ required: false }) width?: number;
  @Prop({ required: false }) height?: number;

  public loading = true;
  public imageLoaded = false;
  public error = false;
  public isSvg = false;

  get getContainerStyle(): Partial<CSSStyleDeclaration> {
    return {
      ...(this.width && { width: `${this.width}px` }),
      ...(this.height && { height: `${this.height}px` }),
    };
  }

  get getContainerClass() {
    if (this.type === ImageType.Background) {
      return [
        `z-0 absolute top-0 left-0 object-${this.fit} w-full h-full `,
        { 'bg-bg1': this.loading },
      ];
    } else return ['max-h-inh', { 'w-full': this.isFillWidth, 'h-full': this.isFillHeight }];
  }

  get getImageClass() {
    if (this.type === ImageType.Background) {
      return [`absolute top-0 left-0 object-${this.fit} w-full h-full`, { 'bg-bg4': this.error }];
    } else
      return [
        `object-${this.fit} max-h-inh`,
        { 'w-full': this.isFillWidth, 'h-full': this.isFillHeight, 'bg-bg4': this.error },
      ];
  }

  get isFillWidth() {
    return !this.width && (this.fill === 'width' || this.fill === 'both');
  }
  get isFillHeight() {
    return !this.height && (this.fill === 'height' || this.fill === 'both');
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

  async initLoad() {
    try {
      if (this.src && process.browser) {
        const imgBackground = new Image();
        imgBackground.onload = (event) => {
          this.imageLoaded = true;
        };
        imgBackground.onerror = (e: any) => {
          console.log(e);
          this.error = true;
        };
        imgBackground.src = this.src;
      } else {
        this.error = true;
        this.imageLoaded = true;
      }
    } catch (e) {
      console.log(e);
      this.error = true;
    } finally {
      this.loading = false;
    }
  }

  @Watch('src') srcChanged() {
    this.initLoad();
  }

  created() {
    this.initLoad();
  }
}
</script>
