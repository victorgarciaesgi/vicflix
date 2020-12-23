<template>
  <transition name="slide-right">
    <div v-if="show" class="-md:hidden burger flex">
      <div class="flex flex-col w-full">
        <div class="flex flex-col">
          <nuxt-link
            v-for="({ label, link }, index) of navLinks"
            :key="index"
            :to="link"
            class="text-text text-bold border-bg4 f-18 p-h-20 p-l-20 flex border-b"
          >
            {{ label }}
          </nuxt-link>
        </div>
        <template v-if="!isLoggedIn">
          <!-- <div class="column center p-w-30 p-h-30 flex">
            <Action :full="true" size="medium" theme="blue" to="/signup">Inscription</Action>
            <Action :full="true" size="medium" theme="blue" to="/login">Connexion</Action>
          </div> -->
        </template>
        <template v-else>
          <div class="f-red f-bold bd-b-bg4 f-18 p-h-20 p-l-20 flex" @click="disconnect"
            >Deconnexion</div
          >
        </template>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { watch } from 'fs';
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator';
import { AuthModule } from '@store';
import { SearchField } from '@components';
import { NavLink } from '@models';

@Component
export default class BurgerMenu extends Vue {
  @Prop() type!: boolean;
  @Prop() navLinks!: NavLink[];
  @Prop() show!: boolean;

  public search = '';
  get isLoggedIn() {
    return AuthModule.state.loggedIn;
  }
  navigateToSearch() {
    // this.$router.push({ path: '/creches', query: { search: search.value } });
  }

  disconnect() {
    AuthModule.actions.disconnectUser();
  }

  get routePath() {
    return this.$route.path;
  }

  @Watch('routePath')
  routeChanged() {
    this.$emit('close');
  }

  // @Watch('show')
  // stateChanged(value: boolean) {
  //   if (AuthModule.state.authChecked) {
  //     window.requestAnimationFrame(async () => {
  //       await this.$nextTick();
  //     });
  //     if (value) document.body.style.setProperty('overflow-y', 'hidden');
  //     else document.body.style.setProperty('overflow-y', 'auto');
  //   }
  // }
}
</script>

<style lang="postcss" scoped>
div.burger {
  position: fixed;
  z-index: 10000;
  height: calc(100% - var(--headerHeight));
  width: 80%;
  top: var(--headerHeight);
  right: 0;
  background-color: var(--bg1);
  box-shadow: -10px 8px 10px rgba(0, 0, 0, 0.1);
}
</style>
