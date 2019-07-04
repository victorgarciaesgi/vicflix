<template>
  <div
    class="input-box"
    :class="{
      noMargin: data.noMargin,
      noBorder: data.noBorder,
      halfWidth: data.halfWidth,
      formError,
      formValid,
      disabled: data.disabled,
      focus: isFocused,
    }"
  >
    <label v-if="label" class="input-label">
      {{ label }}
    </label>
    <div class="input-container upload">
      <div v-if="data.icon" class="icon">
        <SvgIcon
          :src="data.icon"
          :size="22"
          :color="{
            [css.green]: formValid,
            [css.red1]: formError,
            [css.blue]: !formValid && !formValid && isFocused,
            [css.g90]: true,
          }"
        />
      </div>
      <div class="display-result flex" :class="{ audio: type === 'audio' }">
        <div class="infos flex h100">
          <div v-if="loadingFile" class="flex center w100">
            <Spinner />
          </div>
          <span v-else-if="!fileUploaded" class="placeholder">
            <VButton theme="white" :rounded="false" @click="triggerInput">
              Importer {{ getTypeDisplay }}
            </VButton>
          </span>
          <div v-else class="value h100 flex">
            <div class="file-read flex cenyer">
              <img v-if="type === 'image'" :src="previsualisationData" alt="" />
              <video v-else-if="type === 'video'" :src="previsualisationData"></video>
              <audio v-else controls :src="previsualisationData"></audio>
            </div>
            <div v-if="!onlyDisplay" class="file-infos flex column">
              <span class="name ellipsis">{{ value.name }}</span>
              <span class="size">{{ getFileSize }}</span>
            </div>
          </div>
        </div>
        <div class="icon-upload flex center">
          <SvgIcon
            v-if="!fileUploaded && !loadingFile"
            key="file"
            pointer
            class="arrow"
            :src="getIcon"
            :size="20"
            color="g90"
            @click="triggerInput"
          />
          <SvgIcon
            v-else
            key="cancel"
            src="icons/actions/cancel.svg"
            :size="20"
            pointer
            @click.stop="deleteFile"
          />
        </div>
      </div>
      <input
        :id="formId"
        ref="inputFile"
        type="file"
        :accept="getAccept"
        :disabled="data.disabled"
        style="display: none"
        @focus="handleFocus()"
        @blur="handleBlur()"
        @change="handleImportFile"
      />
    </div>

    <FormError v-if="vl && data.error" :vl="vl" :data="data" />
  </div>
</template>

<script lang="ts">
import { Prop, Watch } from 'vue-property-decorator';
import { Component, Mixin, Mixins } from 'vue-mixin-decorator';
import { FormMixin } from '../../Mixins/FormMixin';
import { NotificationsModule } from '@store';
import { Forms, ErrorNotification } from '@constructors';
import FormError from './FormError.vue';
import { InputFileSystem } from 'webpack';
import Axios from 'axios';

@Component({
  components: { FormError },
})
export default class FormUpload extends FormMixin {
  value: File;
  data: Forms.UploadPayload;

  get type() {
    return this.data.uploadType;
  }

  public onlyDisplay = false;
  public loadingFile = false;
  public fileUploaded = false;
  public fileTitle: string = null;
  public previsualisationData: string = null;
  public videoSizeLimitTriggered = false;
  public videoPreviewSizeLimit = 10000000;

  public preloadedFileSize: number = null;

  public acceptedImageTypes = ['image/jpeg', 'image/png'];
  public acceptedVideosTypes = [
    'video/mp4',
    'video/x-m4v',
    'video/webm',
    'video/x-msvideo',
    'video/quicktime',
  ];
  public acceptedAudioTypes = ['audio/x-m4a', 'audio/*'];

  get formatedImage() {
    return { backgroundImage: `url(${this.previsualisationData})` };
  }

  get getIcon() {
    if (this.type === 'image') {
      return 'icons/Forms/image.svg';
    } else if (this.type === 'video') {
      return 'icons/Forms/video.svg';
    } else {
      return 'icons/Forms/audio.svg';
    }
  }

  get getTypeDisplay() {
    if (this.type === 'image') {
      return 'une image';
    } else if (this.type === 'video') {
      return 'une vidéo';
    } else {
      return 'un fichier audio';
    }
  }

  get getFileSize() {
    let size = null;
    if (this.value instanceof File) size = this.value.size;
    else size = this.preloadedFileSize;

    if (size < 1024) {
      return size + ' octets';
    } else if (size >= 1024 && size < 1048576) {
      return (size / 1024).toFixed(1) + ' Ko';
    } else if (size >= 1048576) {
      return (size / 1048576).toFixed(1) + ' Mo';
    }
    return null;
  }

  get getAccept(): string {
    if (this.type === 'image') {
      return this.acceptedImageTypes.join(',');
    } else if (this.type === 'video') {
      return this.acceptedVideosTypes.join(',');
    } else {
      return this.acceptedAudioTypes.join(',');
    }
  }

  get sizeLimit(): number {
    if (this.type === 'image') {
      return 3000000;
    } else {
      return 300000000;
    }
  }

  handleImportFile(event): void {
    const file = this.$refs.inputFile.files[0];
    const success = this.readImage(file);
    if (success) {
      this.$emit('input', file);
      if (this.vl) this.vl.$touch();
    } else {
      this.$refs.inputFile.value = '';
    }
  }

  readImage(image: File): boolean {
    if (image.size > this.sizeLimit) {
      new ErrorNotification(`La taille maximale est de ${this.sizeLimit / 1000000}Mo`);
      return false;
    } else {
      if (image.size < this.videoPreviewSizeLimit) {
        const reader = new FileReader();
        this.loadingFile = true;
        this.fileTitle = image.name;

        reader.onload = (event: any) => {
          this.previsualisationData = event.target.result;
          this.fileUploaded = true;
          this.loadingFile = false;
        };
        reader.onerror = () => {
          this.loadingFile = false;
        };
        reader.readAsDataURL(image);
        return true;
      } else {
        this.fileUploaded = true;
        this.videoSizeLimitTriggered = true;
        return false;
      }
    }
  }

  deleteFile() {
    this.loadingFile = false;
    this.fileUploaded = false;
    this.fileTitle = null;
    this.previsualisationData = null;
    this.onlyDisplay = false;

    this.$emit('input', null);
    if (this.vl) this.vl.$touch();
    this.$refs.inputFile.value = null;
  }

  triggerInput() {
    if (!this.value) {
      this.$refs.inputFile.click();
    }
  }

  @Watch('value')
  valueChanged(newVal, oldVal) {
    if (this.data.editMode) {
      if (newVal == this.initialValue) {
        if (this.vl) this.vl.$reset();
        this.preloadInitialImage();
      }
    }
  }

  async preloadInitialImage() {
    if (this.value) {
      this.onlyDisplay = true;
      this.previsualisationData = this.value as any;
      this.fileUploaded = true;
    }
  }

  created() {
    this.preloadInitialImage();
  }
}
</script>

<style lang="scss" scoped>
@import './styles/formStyles';

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

      div.file-read {
        flex: 0 0 auto;
        position: relative;
        overflow: hidden;
        padding: 5px;
        max-width: 50%;
        min-width: 0;
        min-height: 0;
        text-align: left;

        img,
        video,
        audio {
          flex: 0 0 auto;
          position: relative;
          max-height: 100%;
          width: auto;
          height: 100%;
          border-radius: 4px;
          max-width: 100%;
          min-width: 50px;
          object-fit: cover;
        }

        audio {
          width: 250px;
          height: 54px;
        }
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
        }

        span.size {
          background-color: $primary;
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
    padding: 10px;
  }
}
</style>
