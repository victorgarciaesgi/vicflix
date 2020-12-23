<template>
  <div class="flex w-10 h-10 mr-2">
    <SvgIcon
      :size="14"
      pointer
      class="bg-text2 absolute top-0 right-0 z-10 p-px -mt-1 -mr-1 rounded-full"
      src="actions/close"
      color="var(--bg1)"
      @click.native.stop="emitDelete"
    />
    <VImg v-if="previsualisationData" class="w-full h-full rounded" :src="previsualisationData" />
  </div>
</template>

<script lang="ts">
import { UnPackField, UploadMultipleField } from '@constructors';
import { Component, Vue, Prop, Emit, Watch } from 'nuxt-property-decorator';

@Component({})
export default class UploadPreview extends Vue {
  @Prop({ required: true }) file!: File | string;
  @Prop() readonly data!: UnPackField<UploadMultipleField>;

  @Emit('delete') emitDelete() {}

  public loadingFile = false;
  public previsualisationData: string | null = null;
  public fileUploaded = false;
  public fileTitle: string | null = null;

  @Watch('file')
  valueChanged() {
    this.preloadInitialImage();
  }

  readImage(image: File): boolean {
    const reader = new FileReader();
    this.loadingFile = true;
    this.fileTitle = image.name;

    reader.onload = (event) => {
      if (event.target) {
        this.previsualisationData = event.target.result as string;
        this.fileUploaded = true;
      }
      this.loadingFile = false;
    };
    reader.onerror = () => {
      this.loadingFile = false;
    };
    reader.readAsDataURL(image);
    this.fileUploaded = true;
    return false;
  }

  readFileUrl(fileUrl: string) {
    this.previsualisationData = fileUrl;
  }

  async preloadInitialImage() {
    if (this.file) {
      if (this.file instanceof File) {
        this.readImage(this.file);
      } else {
        this.readFileUrl(this.file);
      }
    }
  }
  created() {
    this.preloadInitialImage();
  }
}
</script>
