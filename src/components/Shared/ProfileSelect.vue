<template>
  <div class="Profile / bg-g20 flex-nowrap fixed left-0 right-0 flex flex-col w-screen text-white">
    <div class="flex-0 relative px-8 py-4">
      <img src="@images/vicflix.png" class="w-28 h-auto" />
    </div>
    <div class="flex flex-col items-center justify-center flex-1 pb-10">
      <div class="Wrapper / flex flex-col">
        <h1 class="-xl:text-5xl py-4 font-normal text-center">{{
          $t($messages.Login.WhoAreYou)
        }}</h1>
        <div class="flex flex-row items-center justify-center">
          <button
            v-for="profile of profiles"
            :key="profile.id"
            type="button"
            class="User / group flex flex-col items-center"
            @click="selectProfile(profile)"
          >
            <div class="Picture / relative">
              <img
                :src="profile.picture"
                class="group-hover:ring-2 group-hover:ring-white absolute top-0 left-0 object-cover w-full h-full rounded"
              />
            </div>
            <span class="Name / text-w140 group-hover:text-white py-2 text-center">{{
              profile.name
            }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { usersConstant } from '@constants';
import { User } from '@models';
import { AuthModule } from '@store';
import { Component, Vue, Prop } from 'nuxt-property-decorator';

@Component({})
export default class ProfileSelect extends Vue {
  get profiles(): User[] {
    return usersConstant;
  }

  selectProfile(profile: User) {
    AuthModule.actions.connexionRequest(profile);
  }
  mounted() {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
  }

  destroyed() {
    document.body.style.overflow = 'auto';
    document.body.style.position = 'relative';
  }
}
</script>

<style lang="postcss" scoped>
@keyframes appear {
  from {
    transform: scale(1.1);
    opacity: 0.1;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

div.Profile {
  z-index: 20000;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
  }

  div.Wrapper {
    animation: appear 0.25s ease;
    button.User {
      &:not(:last-child) {
        margin-right: 2vw;
      }
      div.Picture {
        height: 10vw;
        width: 10vw;
        max-height: 200px;
        max-width: 200px;
        min-height: 84px;
        min-width: 84px;
      }
      span.Name {
        font-size: 1.3vw;

        @screen md {
          font-size: 1rem;
        }
      }
    }
  }
}
</style>
