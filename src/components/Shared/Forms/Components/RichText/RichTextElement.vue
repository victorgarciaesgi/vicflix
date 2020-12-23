<template>
  <FormElementBase ref="inputBox" v-bind="baseProps">
    <div class="input-container">
      <div v-if="editor" :id="formId" ref="input" class="input-form richText w-full">
        <EditorMenuBar v-slot="{ commands, isActive }" :editor="editor">
          <div class="menubar flex-nowrap flex">
            <ButtonExtension :active="isActive.bold()" icon="bold" @click="commands.bold" />
            <ButtonExtension :active="isActive.italic()" icon="italic" @click="commands.italic" />
            <ButtonExtension
              :active="isActive.underline()"
              icon="underline"
              @click="commands.underline"
            />
            <ButtonExtension
              :active="isActive.bullet_list()"
              icon="bulletlist"
              @click="commands.bullet_list"
            />
            <!-- <ButtonExtension :active="isActive.link()" icon="link" @click="commands.link" /> -->
            <ButtonExtension :active="isActive.code()" icon="code" @click="commands.code" />
            <ButtonExtension
              :active="isActive.heading({ level: 1 })"
              text="H1"
              @click="commands.heading({ level: 1 })"
            />
            <ButtonExtension
              :active="isActive.heading({ level: 2 })"
              text="H2"
              @click="commands.heading({ level: 2 })"
            />
            <ButtonExtension
              :active="isActive.heading({ level: 3 })"
              text="H3"
              @click="commands.heading({ level: 3 })"
            />

            <Popin
              ref="imagePopup"
              :container="$refs && $refs.inputBox"
              :width="300"
              @close="imageImport.reset()"
            >
              <template #content>
                <div class="flex w-full p-2">
                  <FormUpload v-model="imageImport.value" :data="imageImport.data" />
                  <div v-if="imageImport.value" class="center flex w-full p-1">
                    <Action size="sm" :handler="() => addImage(commands)">Ajouter</Action>
                  </div>
                </div>
              </template>
              <template #button="{ active }">
                <ButtonExtension :active="active" icon="image" />
              </template>
            </Popin>
          </div>
        </EditorMenuBar>
        <EditorContent tabindex="0" :editor="editor" class="editor z-10" />
      </div>
    </div>
  </FormElementBase>
</template>

<script lang="ts">
import { Component } from 'vue-mixin-decorator';
import { Editor, EditorContent, EditorMenuBar, EditorMenuBubble } from 'tiptap';
import {
  HardBreak,
  Bold,
  Code,
  Italic,
  Underline,
  BulletList,
  Image,
  ListItem,
  Link,
  Heading,
} from 'tiptap-extensions';
import { Maybe } from '@models';
import { Command } from 'tiptap-commands';
import { FormMixin } from '@mixins';
import { UploadField } from '@constructors';
import FormUpload from '../FormUpload.vue';
import ButtonExtension from './ButtonExtension.vue';

@Component({
  components: {
    EditorContent,
    EditorMenuBar,
    EditorMenuBubble,
    ButtonExtension,
    FormUpload,
  },
})
export default class RichTextElement extends FormMixin {
  readonly value!: string;
  readonly data!: any;
  public editor: any = null;
  public htmlContent = '';
  public imageImport = new UploadField<File>({
    placeholder: 'Importer une image',
    style: {
      noMargin: true,
      noBorder: true,
      noRadius: true,
      noBackground: true,
    },
    extendClass: 'w-full',
  }).extract();

  public linkUrl: Maybe<string> = null;
  public linkMenuIsActive = false;

  async addImage(command: any) {
    // const picture = await uploadImageToFirebase(this.imageImport.value);
    // command.image({ src: picture });
    this.imageImport.reset();
    // this.imagePopup.closePopup();
  }

  showLinkMenu(attrs: any) {
    this.linkUrl = attrs.href;
    this.linkMenuIsActive = true;
    this.$nextTick(() => {
      // this.$refs.linkInput.focus();
    });
  }

  parseLeftMenu(value: number) {
    if (this.$refs && this.$refs.menuBubble) {
      // const container = this.$refs?.inputBox?.$el?.getBoundingClientRect();
      // const bubble = this.$refs.menuBubble?.getBoundingClientRect();
      // console.log({ value, container, bubble });

      // if (bubble.left < container.left) {
      //   return value + container.left - bubble.left + 5;
      // }
      return value;
    }
    return value;
  }

  setLinkUrl(command: any, url: any) {
    command({ href: url });
    this.hideLinkMenu();
  }

  hideLinkMenu() {
    this.linkUrl = null;
    this.linkMenuIsActive = false;
  }

  emitChange(value: string) {
    this.updateValue(value);
  }

  created() {
    this.htmlContent = this.value as string;
    this.editor = new Editor({
      extensions: [
        new Bold(),
        new Image(),
        new HardBreak(),
        new Code(),
        new Italic(),
        new Underline(),
        new BulletList(),
        new ListItem(),
        new Heading({ levels: [1, 2, 3] }),
        // new Link(),
      ],
      content: (this.value as string) ?? '',
      onUpdate: ({ getHTML }) => {
        this.emitChange(getHTML());
      },
    });
  }

  destroyed() {
    this.editor.destroy();
  }
}
</script>

<style lang="postcss">
div.menubar {
  border-bottom: 2px solid var(--bg4);
  padding: 3px 5px 3px 0;
}

.editor {
  a {
    text-decoration: underline;
  }
}
</style>
