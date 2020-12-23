<template>
  <Popin :width="250" in-header :arrow="true" :offset="2" alignement="End">
    <template #content>
      <div class="flex flex-col w-full">
        <div class="border-bg4 bg-bg1 flex flex-col py-5 border-b"> </div>
        <div class="flex flex-col w-full !font-semibold text-sm">
          <div class="bg-bg3 w-full h-px mx-3"></div>
          <div class="flex flex-col px-3 py-2">
            <DarkModeButton />
          </div>
          <div class="flex flex-col px-3 py-2">
            <AutoDarkModeButton />
          </div>
          <div class="bg-bg3 w-full h-px"></div>

          <div class="text-redError hover:bg-bg2 px-3 py-2 cursor-pointer" @click="disconnect"
            >Se deconnecter</div
          >
        </div>
      </div>
    </template>
    <template #button="{ active }">
      <div
        :class="{ 'bg-bg3': active }"
        class="Button / center hover:bg-bg3 flex flex-row px-4 py-2 rounded-md"
      >
      </div>
    </template>
  </Popin>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator';
import { AuthModule } from '@store';
import { NavLink, routerPagesNames } from '@models';
import { Location } from 'vue-router';
import DarkModeButton from './DarkModeButton.vue';
import AutoDarkModeButton from './AutoDarkModeButton.vue';

@Component({
  components: { DarkModeButton, AutoDarkModeButton },
})
export default class UserPopup extends Vue {
  get isLoggedIn() {
    return AuthModule.state.loggedIn;
  }

  get isAdmin() {
    return AuthModule.getters.isAdmin;
  }

  get user() {
    return AuthModule.state.user!;
  }

  disconnect() {
    AuthModule.actions.disconnectUser();
  }
}
</script>

<style lang="postcss">
div.Button {
  flex: 0 0 auto;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
