<template>
  <Popin
    :width="200"
    :mode="popinMode"
    :debounce="true"
    in-header
    :arrow="true"
    :offset="4"
    :rounded="false"
    :shadow="true"
    theme="bg2"
    alignement="End"
  >
    <template #content>
      <div class="flex flex-col w-full text-sm">
        <div class="flex flex-col p-3">
          <button
            v-for="profile of profiles"
            :key="profile.id"
            type="button"
            class="User / group text-text1 flex flex-row items-center py-2"
            @click="selectProfile(profile)"
          >
            <div class="Picture / relative w-8 h-8">
              <img
                :src="profile.picture"
                class="absolute top-0 left-0 object-cover w-full h-full rounded"
              />
            </div>
            <span class="Name / group-hover:underline ml-2 text-center">{{ profile.name }}</span>
          </button>
          <!-- <span class="py-1">Gérer les profils</span> -->
        </div>
        <div class="bg-bg4 w-full h-px"></div>
        <div class="flex flex-col p-3">
          <a href="mailto:victorgarciaparis13@gmail.com" class="hover:underline py-1"> Contact </a>
          <a
            href="https://github.com/victorgarciaesgi"
            target="_blank"
            class="hover:underline py-1"
          >
            Github
          </a>
          <a
            href="https://www.linkedin.com/in/victor-garcia-1793b2a9/"
            target="_blank"
            class="hover:underline py-1"
          >
            Linkedin
          </a>
        </div>
        <div class="bg-bg4 w-full h-px"></div>
        <div class="flex flex-col px-3 py-2">
          <DarkModeButton />
        </div>
        <div class="flex flex-col px-3 py-2">
          <AutoDarkModeButton />
        </div>
        <div class="bg-bg4 w-full h-px"></div>

        <div class="p-3">
          <button type="button" class="hover:underline py-1" @click="disconnect">{{
            $t($messages.Nav.Disconnect)
          }}</button>
        </div>
      </div>
    </template>
    <template #button>
      <button type="button" class="flex flex-row items-center text-white">
        <div class="Picture / relative w-8 h-8">
          <img
            :src="picture"
            class=" group-hover:ring-2 group-hover:ring-white absolute top-0 left-0 object-cover w-full h-full rounded"
          />
        </div>
        <SvgIcon src="popup/arrow_top" class="ml-2" :size="10" />
      </button>
    </template>
  </Popin>
</template>

<script lang="ts">
import { usersConstant } from '@constants';
import { BreakpointMixin } from '@mixins';
import { BreakPointsValues, User } from '@models';
import { AuthModule } from '@store';
import { Component } from 'nuxt-property-decorator';
import AutoDarkModeButton from './AutoDarkModeButton.vue';
import DarkModeButton from './DarkModeButton.vue';

@Component({
  components: { DarkModeButton, AutoDarkModeButton },
})
export default class UserPopup extends BreakpointMixin {
  get user() {
    return AuthModule.state.user!;
  }

  get popinMode() {
    if (this.windowWidth < BreakPointsValues.Small) {
      return 'click';
    } else {
      return 'hover';
    }
  }

  get picture() {
    return this.user.picture;
  }

  get profiles(): User[] {
    return usersConstant;
  }

  selectProfile(profile: User) {
    AuthModule.actions.connexionRequest(profile);
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
