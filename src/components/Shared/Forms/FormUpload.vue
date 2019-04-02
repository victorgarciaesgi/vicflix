<template>
  <div class="FormUpload">
    <div class="upload-wrapper" :class="{ inForm: data.inForm }">
      <div
        class="dropZone"
        :for="formId"
        @click="triggerInput"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
        @dragover.prevent
        @dragend="handleDragEnd"
        @drop.prevent="handleItemDrop"
      ></div>
      <div v-if="data.inForm" class="dropDisplay inForm">
        <div class="image-previsu" v-if="dropped && !videoSizeLimitTriggered">
          <img v-if="loadingImage" src="~@images/loading.svg" />
          <div
            class="image"
            v-else-if="imageUploaded && type == 'image'"
            :style="formatedImage"
          ></div>
        </div>
        <div v-else class="icon flex center">
          <SvgIcon src="icons/AjouterPhoto.svg" :size="70" color="primary" />
        </div>
      </div>
      <div v-else class="dropDisplay" :class="{ draggedOver, imageUploaded }">
        <div class="image-previsu" v-if="dropped && !videoSizeLimitTriggered">
          <img v-if="loadingImage" src="@images/loading.svg" />
          <div
            class="image"
            v-else-if="imageUploaded && type == 'image'"
            :style="formatedImage"
          ></div>
        </div>
        <div v-else-if="imageUploaded" class="file-too-large">
          <SvgIcon key="done" src="icons/Forms/done.svg" color="green" :size="40" />
          <span>Fichier trop gros pour être prévisualisé</span>
        </div>
        <div class="drop-infos" v-else>
          <template v-if="draggedOver">
            <SvgIcon src="icons/Forms/import.svg" :size="35" color="primary" />
            <span>Relachez pour importer!</span>
          </template>
          <template v-else>
            <SvgIcon src="icons/Forms/drop.svg" :size="35" color="rgb(120,120,120)" />
            <span>Déposez l'image ou cliquez pour importer</span>
          </template>
        </div>
      </div>
      <input
        ref="inputFile"
        :id="formId"
        @change="handleImportFile"
        type="file"
        :accept="getAccept"
        style="display: none"
      />
    </div>
    <div class="flex center w100">
      <FormError v-if="vl" :vl="vl" :data="data" />
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Watch } from 'vue-property-decorator';
import { Component, Mixin, Mixins } from 'vue-mixin-decorator';
import { FormMixin } from '../../Mixins/FormMixin';
import { NotificationsModule } from '@store';
import { Forms } from '@constructors';
import FormError from './FormError.vue';

@Component({
  components: { FormError },
})
export default class FormUpload extends FormMixin {
  @Prop({ default: 'image' })
  type: 'image' | 'video';
  @Prop({ default: () => ['jpeg'] })
  accept: Array<'jpg' | 'png'>;

  data: Forms.UploadPayload;

  private draggedOver = false;

  private dropped = false;
  private onlyDisplay = false;
  private loadingImage = false;
  private imageUploaded = false;
  private fileTitle: string = null;
  private imagePrevisu: string = null;
  private videoSizeLimitTriggered = false;
  private videoPreviewSizeLimit = 10000000;

  private acceptedVideosTypes = [
    'video/mp4',
    'video/x-m4v',
    'video/webm',
    'video/x-msvideo',
    'video/quicktime',
  ];

  get formatedImage() {
    return { backgroundImage: `url(${this.imagePrevisu})` };
  }

  get getAccept() {
    const type = this.type || this.data.type;
    const accept = this.accept || this.data.accept;
    if (type == 'image') {
      return accept.map(m => 'image/' + m).join(',');
    } else if (type == 'video') {
      return this.acceptedVideosTypes.join(',');
    }
  }

  get sizeLimit() {
    const type = this.type || this.data.type;
    if (type == 'image') {
      return 3000000;
    } else if (this.type == 'video') {
      return 300000000;
    }
  }

  handleImportFile(event) {
    const file = this.$refs['inputFile']['files'][0];
    this.readImage(file);
    this.dropped = true;
    this.$emit('input', file);
    if (this.vl) this.vl.$touch();
  }

  handleItemDrop(event: DragEvent) {
    this.draggedOver = false;
    let imageFile = null;
    if (event.dataTransfer.items) {
      if (event.dataTransfer.items[0].kind === 'file') {
        imageFile = event.dataTransfer.items[0].getAsFile();
      }
    } else {
      for (var i = 0; i < event.dataTransfer.files.length; i++) {
        imageFile = event.dataTransfer.files[0];
      }
    }
    if (imageFile) {
      const type = this.type || this.data.type;
      if (type == 'image') {
        if (imageFile.type == 'image/jpeg') {
          this.readImage(imageFile);
          this.$emit('input', imageFile);
        } else {
          NotificationsModule.actions.addNotification({
            type: 'error',
            message: 'Seuls les fichiers .jpeg ou .jpg sont acceptés',
          });
        }
      } else if (type == 'video') {
        if (this.acceptedVideosTypes.includes(imageFile.type)) {
          this.readImage(imageFile);
          this.$emit('input', imageFile);
        } else {
          NotificationsModule.actions.addNotification({
            type: 'error',
            message: 'Seuls les fichiers mp4, x-m4v, webm, x-ms-video et quicktime sont acceptés',
          });
        }
      }
    }
    this.removeDragData(event);
  }

  readImage(image: any) {
    if (image.size > this.sizeLimit) {
      NotificationsModule.actions.addNotification({
        type: 'error',
        message: `La taille maximale est de ${this.sizeLimit / 1000000}Mo`,
      });
    } else {
      this.dropped = true;
      if (image.size < this.videoPreviewSizeLimit) {
        const reader = new FileReader();
        this.loadingImage = true;
        this.fileTitle = image.name;

        reader.onload = (event: any) => {
          this.imagePrevisu = event.target.result;
          this.imageUploaded = true;
          this.loadingImage = false;
        };
        reader.onerror = () => {
          this.loadingImage = false;
        };
        reader.readAsDataURL(image);
      } else {
        this.imageUploaded = true;
        this.videoSizeLimitTriggered = true;
      }
    }
  }

  deleteFile() {
    this.dropped = false;
    this.loadingImage = false;
    this.imageUploaded = false;
    this.fileTitle = null;
    this.imagePrevisu = null;
    this.$emit('input', null);
    if (this.vl) this.vl.$touch();
    this.$refs['inputFile']['value'] = null;
  }

  handleDragEnter(event: DragEvent) {
    if (!this.imageUploaded) {
      this.draggedOver = true;
    }
  }

  handleDragLeave() {
    this.draggedOver = false;
  }

  handleDragEnd() {
    this.draggedOver = false;
  }

  removeDragData(ev: DragEvent) {
    if (ev.dataTransfer.items) {
      ev.dataTransfer.items.clear();
    } else {
      ev.dataTransfer.clearData();
    }
  }

  triggerInput() {
    this.$refs['inputFile']['click']();
  }

  @Watch('value')
  valueChanged(newVal, oldVal) {
    if (this.data.editMode) {
      if (newVal == this.initialValue) {
        this.vl.$reset();
        this.preloadInitialImage();
      }
    }
  }

  preloadInitialImage() {
    if (!!this.value) {
      this.onlyDisplay = true;
      this.imagePrevisu = this.value;
      this.dropped = true;
      this.imageUploaded = true;
    }
  }

  created() {
    this.preloadInitialImage();
  }
}
</script>



<style lang='scss' scoped>
.FormUpload {
  display: flex;
  flex-flow: column wrap;
  padding: 5px;

  .upload-wrapper {
    display: flex;
    position: relative;
    height: 350px;

    &.inForm {
      justify-content: center;
      height: auto;
      margin: 10px 0 10px 0;
    }

    .dropZone {
      position: absolute;
      z-index: 10;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    .dropDisplay {
      display: flex;
      position: relative;
      flex-flow: column wrap;
      width: 100%;
      border: 3px dashed $w180;
      overflow: hidden;

      .image-previsu {
        display: flex;
        flex: 0 0 auto;
        height: 100%;
        justify-content: center;
        align-items: center;
        background-color: $w235;

        .image {
          width: 100%;
          height: 100%;
          @include bg-center;
        }
      }

      .file-too-large {
        display: flex;
        flex-flow: column wrap;
        justify-content: center;
        align-items: center;
        text-align: center;
        height: 100%;

        span {
          margin-top: 10px;
        }
      }

      .image-uploaded {
        display: flex;
        flex-flow: column nowrap;
        position: relative;
        justify-content: flex-start;
        flex: 1 1 auto;
        min-width: 0;

        .info {
          display: flex;
          position: relative;
          flex: 1 1 auto;
          justify-content: flex-start;
          align-items: center;
          padding-left: 15px;
          font-size: 14px;
          color: $w120;
          font-weight: bold;
          overflow: hidden;

          &.title {
            position: relative;
            color: $primary;
            font-size: 15px;
            align-items: flex-end;
            display: flex;
            flex-flow: row nowrap;

            span {
              @include ellipsis;
            }
          }

          &.state {
            font-size: 13px;
            .image {
              height: 18px;
              width: 18px;
              margin-left: 5px;
            }
          }

          &.delete {
            .bouton {
              color: transparentize($red1, 0.2);
              cursor: pointer;
            }
          }
        }
      }

      .drop-infos {
        display: flex;
        flex-flow: column wrap;
        flex: 1 1 auto;
        justify-content: center;
        align-items: center;
        color: $w120;
        font-weight: bold;
        font-size: 14px;
      }

      &.inForm {
        width: 100px;
        height: 100px;
        border: 3px solid $primary;
        border-radius: 100%;

        .icon {
          height: 100%;
          width: 100%;
        }
      }

      &.draggedOver {
        border-color: $primary;
        .drop-infos {
          color: $primary;
        }
      }

      &.imageUploaded {
        border: none;
        background-color: white;
        border: 1px solid $w220;
        cursor: initial;
        z-index: 11;
      }
    }
  }

  .label {
    font-weight: bold;
    padding: 0 0 5px 0;
    font-size: 14px;
    color: $g90;
  }
}
</style>

