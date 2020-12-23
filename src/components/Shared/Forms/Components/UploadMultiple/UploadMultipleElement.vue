<template>
  <FormElementBase v-bind="baseProps">
    <div class="input-container">
      <div v-if="data.style && data.style.icon" class="icon">
        <SvgIcon :src="data.style.icon" :size="22" :color="iconColorProps" />
      </div>
      <div :class="{ audio: type === 'audio' }" class="flex flex-row justify-between w-full py-2">
        <div class="flex h-full">
          <label v-if="!(value && value.length)">
            <Action size="sm" @click="triggerInput"> Importer {{ getTypeDisplay }} </Action>
          </label>
          <div v-else class="flex flex-row items-center justify-start">
            <UploadPreview
              v-for="(file, index) of value"
              :key="index"
              :data="data"
              :file="file"
              @delete="deleteFile(file, index)"
            />
            <div class="center bg-bg6 text-text1 flex w-10 h-10 rounded">
              <SvgIcon pointer src="actions/add" :size="20" @click="triggerInput" />
            </div>
          </div>
        </div>
        <div class="icon-upload center flex cursor-pointer">
          <SvgIcon
            key="file"
            :src="getIcon"
            :size="20"
            class="arrow"
            color="var(--text3)"
            @click="triggerInput"
          />
        </div>
      </div>
    </div>
    <input
      :id="formId"
      ref="inputFile"
      :accept="getAccept"
      :disabled="data.disabled"
      multiple
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
import { FormMixin } from '@mixins';
import { UnPackField, UploadMultipleField } from '@constructors';
import UploadPreview from './UploadPreview.vue';

@Component({
  components: { UploadPreview },
})
export default class FormUploadMultipleElement extends FormMixin {
  readonly value!: (File | string)[];
  readonly data!: UnPackField<UploadMultipleField<File[], string[]>>;

  @Ref() inputFile!: HTMLInputElement;

  get type() {
    return this.data.uploadType;
  }

  public onlyDisplay = false;
  public videoSizeLimitTriggered = false;
  public videoPreviewSizeLimit = 10000000;
  public canPlayType = true;

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
      return 'des images';
    } else if (this.type === 'video') {
      return 'des vidéos';
    } else if (this.type === 'gif') {
      return 'des GIFs';
    } else if (this.type === 'audio') {
      return 'des fichiers audios';
    }
    return 'des documents';
  }

  // get getFileSize() {
  //   let size: number | null = null;
  //   if (this.value instanceof File) size = this.value.size;
  //   else size = this.preloadedFileSize;

  //   if (size) {
  //     if (size < 1024) {
  //       return size + ' octets';
  //     } else if (size >= 1024 && size < 1048576) {
  //       return (size / 1024).toFixed(1) + ' Ko';
  //     } else if (size >= 1048576) {
  //       return (size / 1048576).toFixed(1) + ' Mo';
  //     }
  //   }
  //   return null;
  // }

  get getAccept(): string {
    if (this.type === 'image') {
      return this.acceptedImageTypes.join(',');
    } else if (this.type === 'video') {
      return this.acceptedVideosTypes.join(',');
    } else if (this.type === 'audio') {
      return this.acceptedAudioTypes.join(',');
    } else if (this.type === 'gif') {
      return this.acceptedGifTypes.join(',');
    }
    return this.acceptedFileTypes.join(',');
  }

  get sizeLimit(): number {
    if (this.type === 'image') {
      return 10_000_000;
    } else {
      return 250_000_000;
    }
  }

  async deleteFile(file: File | string, index: number) {
    if (this.data.onDelete && typeof file === 'string') {
      const result = await this.data.onDelete(file);
      if (!result) return;
      const _value = this.value;
      _value.splice(index, 1);
      this.updateValue(_value);
      return;
    }
    const filteredFiles = this.value.filter((f) => f !== file);
    this.updateValue(filteredFiles);
  }

  handleImportFile(event: Event): void {
    const files = this.inputFile?.files;
    if (files?.length) {
      const filesArray = Array.from(files);
      const success = filesArray.filter((file) => {
        if (file.size > this.sizeLimit) {
          this.$toast.error({ message: `La taille maximale est de ${this.sizeLimit / 1000000}Mo` });
          return false;
        }
        return true;
      });
      if (success) {
        const newFiles = (this.value ? this.value : []).concat(filesArray);
        this.updateValue(newFiles);
      }
      this.inputFile.value = '';
    }
  }

  triggerInput() {
    this.inputFile?.click();
  }
}
</script>
