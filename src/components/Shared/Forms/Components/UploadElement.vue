<template>
  <FormElementBase v-bind="baseProps">
    <div v-if="data.displayType === 'upload'" class="input-container upload">
      <div v-if="data.style && data.style.icon" class="icon">
        <SvgIcon :src="data.style.icon" :size="22" :color="iconColorProps" />
      </div>
      <div :class="{ audio: type === 'audio' }" class="display-result flex">
        <div class="infos flex h-full">
          <span v-if="imageError && !loadingFile" class="text-w100 py-1 ml-3 text-xs">
            Erreur lors de la lecture de l'image
          </span>
          <div v-if="loadingFile" class="center flex w-full">
            <Spinner :size="20" />
          </div>
          <span v-else-if="!fileUploaded" class="placeholder py-1">
            <Action size="sm" @click="triggerInput"> Importer {{ getTypeDisplay }} </Action>
          </span>
          <div v-else class="value flex flex-1 h-full">
            <!-- <div class="file-read flex flex-grow flex-shrink-0"> </div> -->
            <img v-if="type === 'image' || type === 'gif'" :src="previsualisationData" alt="" />
            <template v-else-if="type === 'video'">
              <video v-if="canPlayType" :src="previsualisationData" controls></video>
              <div v-else class="bg-bg4 center flex px-4 py-2 text-center rounded"
                >Format non supporté</div
              >
            </template>
            <audio v-else-if="type === 'audio'" :src="previsualisationData" controls></audio>
            <div
              v-if="!onlyDisplay && typeof value !== 'string' && value && value.name"
              class="file-infos flex-nowrap flex flex-col flex-1"
            >
              <span class="name ellipsis">{{ value.name }}</span>
              <span class="size">{{ getFileSize }}</span>
            </div>
          </div>
        </div>
        <div class="icon-upload center flex">
          <SvgIcon
            v-if="!fileUploaded && !loadingFile"
            key="file"
            :src="getIcon"
            :size="20"
            button
            class="arrow"
            color="var(--text3)"
            @click="triggerInput"
          />
          <SvgIcon
            v-else
            key="cancel"
            :size="20"
            src="actions/cancel"
            color="var(--text3)"
            button
            @click.stop="deleteFile"
          />
        </div>
      </div>
    </div>
    <div v-else-if="data.displayType === 'avatar'" class="avatar-upload flex w-full">
      <div tabindex="0" class="avatar-mask center dark:bg-white flex" round medium>
        <div v-if="loadingFile" class="center flex w-full">
          <Spinner :size="30" />
        </div>
        <div
          v-else-if="!fileUploaded"
          class="import-button center pointer flex w-full h-full text-xs text-center"
          @click="triggerInput"
        >
          Importer une image
        </div>
        <div
          v-else
          :style="{ backgroundImage: `url(${previsualisationData})` }"
          pointer
          class="display-avatar bg pointer w-full h-full"
          @click="triggerInput"
        >
        </div>
      </div>
    </div>
    <input
      :id="formId"
      ref="inputFile"
      :accept="getAccept"
      :disabled="data.disabled"
      type="file"
      style="display: none"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="handleImportFile"
    />
  </FormElementBase>
</template>

<script lang="ts">
import { Prop, Ref, Watch } from 'nuxt-property-decorator';
import { Component } from 'vue-mixin-decorator';
import { InputFileSystem } from 'webpack';
import { FormMixin } from '@mixins';
import { UnPackField, UploadField } from '@constructors';

const SIZE_LIMIT = 10_000_000;

@Component({})
export default class UploadElement extends FormMixin {
  readonly value!: File | string;
  readonly data!: UnPackField<UploadField>;

  public File = File;

  @Ref() inputFile!: HTMLInputElement;

  get type() {
    return this.data.uploadType;
  }

  public onlyDisplay = false;
  public loadingFile = false;
  public fileUploaded = false;
  public fileTitle: string | null = null;
  public previsualisationData: string | null = null;
  public videoSizeLimitTriggered = false;
  public videoPreviewSizeLimit = 10_000_000;
  public canPlayType = true;
  public imageError = false;

  public preloadedFileSize: number | null = null;

  public acceptedImageTypes = ['image/jpeg', 'image/png'];
  public acceptedVideosTypes = [
    'video/mp4',
    'video/x-m4v',
    'video/webm',
    'video/x-msvideo',
    'video/quicktime',
  ];
  public acceptedGifTypes = ['image/gif'];
  public acceptedAudioTypes = ['audio/x-m4a', 'audio/*'];
  public acceptedFileTypes = [...this.acceptedImageTypes, 'application/pdf'];

  get formatedImage() {
    return { backgroundImage: `url(${this.previsualisationData})` };
  }

  get getIcon() {
    if (this.type === 'image') {
      return 'forms/image';
    } else if (this.type === 'video') {
      return 'forms/video';
    } else if (this.type === 'audio') {
      return 'forms/audio';
    } else if (this.type === 'file') {
      return 'forms/file';
    } else if (this.type === 'gif') {
      return 'forms/gif';
    }
    return 'forms/file';
  }

  get getTypeDisplay() {
    if (this.type === 'image') {
      return 'une image';
    } else if (this.type === 'video') {
      return 'une vidéo';
    } else if (this.type === 'gif') {
      return 'un GIF';
    } else if (this.type === 'audio') {
      return 'un fichier audio';
    }
    return 'le document';
  }

  get getFileSize() {
    let size: number | null = null;
    if (this.value instanceof File) size = this.value.size;
    else size = this.preloadedFileSize;

    if (size) {
      if (size < 1024) {
        return size + ' octets';
      } else if (size >= 1024 && size < 1048576) {
        return (size / 1024).toFixed(1) + ' Ko';
      } else if (size >= 1048576) {
        return (size / 1048576).toFixed(1) + ' Mo';
      }
    }
    return null;
  }

  get getAccept(): string {
    let base: string[] = [];
    if (this.type === 'image') {
      base = this.acceptedImageTypes;
    } else if (this.type === 'video') {
      base = this.acceptedVideosTypes;
    } else if (this.type === 'audio') {
      base = this.acceptedAudioTypes;
    } else if (this.type === 'gif') {
      base = this.acceptedGifTypes;
    } else {
      base = this.acceptedFileTypes;
    }
    return base.concat(this.data.acceptedTypes ?? []).join(',');
  }

  get sizeLimit(): number {
    if (this.type === 'image') {
      return SIZE_LIMIT;
    } else {
      return 25_000_000;
    }
  }

  async handleImportFile(event: Event) {
    const file = this.inputFile?.files?.[0];
    if (file) {
      try {
        await this.readImage(file);
        console.log(file);
        this.$emit('input', file);
        if (this.vl) this.vl.$touch();
      } catch (e) {
        this.inputFile.value = '';
      }
    }
  }

  async readImage(image: File): Promise<void> {
    return new Promise((resolve, reject) => {
      if (image.size > this.sizeLimit) {
        this.$toast.error({ message: `La taille maximale est de ${this.sizeLimit / 1_000_000}Mo` });
        reject();
      } else if (image.size < this.videoPreviewSizeLimit) {
        if (this.type === 'video') {
          const video = document.createElement('video');
          const canPlay = video.canPlayType(image.type);
          if (canPlay === 'probably') {
            this.canPlayType = true;
          } else {
            this.canPlayType = false;
          }
        }

        const reader = new FileReader();
        this.loadingFile = true;
        this.fileTitle = image.name;
        this.imageError = false;

        reader.onload = (event) => {
          if (event.target) {
            this.previsualisationData = event.target.result as string;
            this.fileUploaded = true;
            resolve();
          }
          this.loadingFile = false;
        };
        reader.onerror = (error: any) => {
          console.log(error);
          this.loadingFile = false;
          this.imageError = true;
          reject();
        };
        reader.readAsDataURL(image);
      } else {
        this.fileUploaded = true;
        this.videoSizeLimitTriggered = true;
        reject();
      }
    });
  }

  deleteFile(touch = true) {
    this.loadingFile = false;
    this.fileUploaded = false;
    this.fileTitle = null;
    this.previsualisationData = null;
    this.onlyDisplay = false;
    this.imageError = false;

    this.updateValue(null);
    if (this.vl && !touch) {
      this.vl.$reset();
    }
    if (this.inputFile) {
      this.inputFile.files = null;
    }
  }

  triggerInput() {
    this.inputFile?.click();
  }

  readFileUrl(fileUrl: string) {
    this.onlyDisplay = true;
    this.previsualisationData = fileUrl;
    this.loadingFile = true;
    this.imageError = false;
    const image = new Image();
    image.onload = (event) => {
      this.fileUploaded = true;
      this.loadingFile = false;
    };
    image.onerror = (error: any) => {
      console.log(error);
      this.loadingFile = false;
      this.imageError = true;
    };
    image.src = fileUrl;
  }

  @Watch('value')
  valueChanged(newVal: File | string | null) {
    if (this.data.editMode && newVal) {
      if (newVal === this.initialValue) {
        if (this.vl) this.vl.$reset();
        this.preloadInitialImage();
      }
    } else if (newVal == null) {
      this.deleteFile(false);
    }
  }

  async preloadInitialImage() {
    if (this.value) {
      if (this.value instanceof File) {
        this.readImage(this.value);
      } else if (this.data.uploadType === 'image' || this.data.uploadType === 'gif') {
        this.readFileUrl(this.value);
      } else {
        this.onlyDisplay = true;
        this.previsualisationData = this.value;
        this.fileUploaded = true;
      }
    }
  }

  created() {
    this.preloadInitialImage();
  }
}
</script>

<style lang="postcss" scoped>
div.display-result {
  flex-flow: row nowrap;
  width: 100%;

  div.infos {
    flex: 1 1 auto;
    align-items: center;

    span.placeholder {
      padding-left: 10px;
    }

    div.value {
      flex-flow: row nowrap;
      padding: 5px 5px 5px 0;

      div.file-read {
        position: relative;
        display: block;
        max-width: 50%;
        min-width: 0;
        min-height: 0;
        text-align: left;
      }
      img,
      video,
      audio {
        flex-shrink: 0;
        position: relative;
        max-height: 100%;
        width: auto;
        height: 100%;
        border-radius: 4px;
        max-width: 100%;
        min-width: 0;
        overflow: hidden;
      }
      audio {
        width: 250px;
        height: 54px;
      }

      div.file-infos {
        justify-content: center;
        padding: 10px;
        text-align: left;
        align-items: flex-start;
        flex: 1 1 auto;

        span.name {
          padding: 5px 0;
          font-weight: bold;
          font-size: 16px;
          color: var(--text2);
        }

        span.size {
          background-color: var(--blue);
          color: white;
          border-radius: 40px;
          padding: 4px 10px;
          font-size: 12px;
        }
      }
    }
  }

  &.audio {
    div.value {
      flex-flow: column nowrap !important;
      width: 100%;
      div.file-read {
        display: flex;
        align-items: flex-start;
        flex: 0 0 auto !important;
        padding-bottom: 5px !important;
      }
      div.file-infos {
        padding-top: 5px !important;
        flex: 0 0 auto !important;
      }
    }
  }

  div.icon-upload {
    flex: 0 0 auto;
    padding: 5px;
  }
}
</style>
