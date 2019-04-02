<template>
  <Modal :width="width" :show="show" @close="cancel">
    <span slot="header">Importer une image</span>
    <template slot="content">
      <FormUpload v-model="uploadedImage" :data="{}" :accept="accept" />
    </template>
    <div class="buttons" slot="footer" v-if="changedImage">
      <VButton theme="red" @click="cancel" size="little">Annuler</VButton>
      <VButton :submitting="loading" size="little" @click="confirm">Valider</VButton>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Modal, FormUpload, VButton } from './';

@Component({
  components: { Modal, FormUpload, VButton },
})
export default class UploadModal extends Vue {
  @Prop()
  show!: boolean;
  @Prop({ default: 300 })
  width!: number;
  @Prop()
  onConfirm!: (image: File | null) => void;
  @Prop({ default: ['jpeg'] })
  accept!: Array<'jpeg' | 'png'>;

  private initialImage = null;
  private changedImage: File | null = null;
  private loading = false;

  get uploadedImage() {
    return this.changedImage;
  }

  set uploadedImage(value) {
    this.changedImage = value;
  }

  cancel() {
    this.changedImage = null;
    this.emitClose();
  }

  async confirm() {
    try {
      this.loading = true;
      await this.onConfirm(this.changedImage);
      this.$emit('confirm', this.changedImage);
      this.changedImage = null;
      this.emitClose();
    } catch (e) {
      console.log(e);
    } finally {
      this.loading = false;
    }
  }

  mounted() {}

  emitClose() {
    this.$emit('update:show', false);
    this.$emit('close');
    this.loading = false;
  }
}
</script>

<style lang="scss" scoped>
div.buttons {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  width: 100%;
  padding: 0 10px 0 10px;
}
</style>
