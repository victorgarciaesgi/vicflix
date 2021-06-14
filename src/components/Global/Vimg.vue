<template>
  <div
    :class="getContainerClass"
    class="VImg / center flex min-h-full overflow-hidden"
    :style="getContainerStyle"
  >
    <ClientOnly>
      <Observer @visible="initLoad" class="center flex w-full h-full">
        <transition name="fade" mode="out-in">
          <div
            v-if="loading"
            class="client-rendered flex justify-center p-1"
            style="width: 10%; min-width: 20px; max-width: 40px"
          >
            <Spinner color="red" />
          </div>

          <template v-else-if="imageLoaded || error">
            <img
              :class="getImageClass"
              :alt="alt"
              loading="lazy"
              :src="loadedSrc"
              :width="width"
              :height="height"
            />
          </template>
        </transition>
      </Observer>

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
import Observer from '../Shared/Display/Observer.vue';

enum ImageType {
  Background = 'background',
  Default = 'default',
}
@Component({
  components: {
    Observer,
  },
})
export default class VImg extends Vue {
  @Prop({ required: true }) src!: string;
  @Prop({ default: ImageType.Background }) type!: ImageType;
  @Prop({ required: false }) srcFallback?: string;
  @Prop({ default: 'both' }) fill!: 'height' | 'width' | 'both';
  @Prop({ default: 'cover' }) fit!: 'contain' | 'cover' | 'none';
  @Prop({ default: 'image' }) alt!: string;
  @Prop({ required: false }) width?: number;
  @Prop({ required: false }) height?: number;
  @Prop({ default: 'bg1', type: String }) background!: string;

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
    const commonClasses = { [`bg-${this.background}`]: this.loading };

    if (this.type === ImageType.Background) {
      return [`z-0 absolute top-0 left-0 object-${this.fit} w-full h-full `, commonClasses];
    } else
      return [
        'max-h-inh',
        { 'w-full': this.isFillWidth, 'h-full': this.isFillHeight, ...commonClasses },
      ];
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
        await new Promise<void>((resolve, reject) => {
          const imgBackground = new Image();
          imgBackground.onload = (event) => {
            this.imageLoaded = true;
            // setTimeout(resolve, 2000);
            resolve();
          };
          imgBackground.onerror = (e: any) => {
            resolve();
          };
          imgBackground.src = this.src;
        });
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

  // created() {
  //   this.initLoad();
  // }
}
</script>
