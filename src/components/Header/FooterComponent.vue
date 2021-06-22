<template>
  <footer
    class=" px-5p border-bg6 bg-bg2 top-full sticky flex flex-row items-center justify-between w-full py-8 border-t"
  >
    <span>Made with ❤&nbsp;& 🍺 &nbsp;by Victor Garcia </span>
    <div class="flex flex-row">
      <a href="https://github.com/victorgarciaesgi" target="_blank">
        <SvgIcon src="social/github" :size="20" />
      </a>
      <a href="https://www.linkedin.com/in/victor-garcia-1793b2a9/" class="ml-4" target="_blank">
        <SvgIcon src="social/linkedin" :size="20" />
      </a>
    </div>
  </footer>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';

@Component({})
export default class FooterComponent extends Vue {}
</script>
