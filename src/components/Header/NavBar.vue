<template>
  <nav ref="nav" :class="{ responsive: responsiveMenu }">
    <router-link class="logo" to="/">
      <img src="~@images/vicflix.png" alt="logo_vicflix" height="35" />
    </router-link>
    <template v-if="!responsiveMenu">
      <NavTab v-for="navLink of navLinksFiltered" :key="navLink.label" :data="navLink" />
    </template>
    <div v-else>
      <Popup :outside="true" :width="200">
        <div slot="popup" class="flex column w100">
          <NavTab
            v-for="navLink of navLinksFiltered"
            :key="navLink.label"
            :data="navLink"
            :list="true"
          />
        </div>
        <span slot="button">
          <SvgIcon src="icons/actions/menu.svg" :size="30" />
        </span>
      </Popup>
    </div>
  </nav>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import NavTab from './NavTab.vue';
import { NavLink } from '@models';
import { routesNames } from '@router';

@Component({ components: { NavTab } })
export default class NavBar extends Vue {
  private responsiveMenu = false;
  private navWidth: number = null;
  public $refs: {
    nav: HTMLElement;
  };

  private navLinks: NavLink[] = [
    {
      label: 'Accueil',
      link: {
        name: routesNames.BROWSE,
      },
      exact: true,
    },
  ];

  get navLinksFiltered() {
    return this.navLinks.filter(f => {
      if (f.condition == null) return true;
      else return f.condition;
    });
  }

  checkResponsive() {
    if (this.$refs.nav) {
      if (!this.responsiveMenu) {
        if (this.$refs.nav.scrollWidth > this.$refs.nav.clientWidth || window.innerWidth < 480) {
          this.navWidth = this.$refs.nav.scrollWidth;
          this.responsiveMenu = true;
        }
      } else if (this.$refs.nav.scrollWidth >= this.navWidth) {
        this.responsiveMenu = false;
      }
    }
  }

  mounted() {
    this.checkResponsive();
  }

  created() {
    window.addEventListener('resize', this.checkResponsive);
  }
}
</script>



<style lang="scss" scoped>
.logo {
}

nav {
  display: flex;
  position: relative;
  flex-flow: row nowrap;
  padding: 0 30px 0 30px;
  justify-content: flex-start;
  align-items: center;
  flex: 1 1 auto;
  overflow-x: hidden;

  &.responsive {
    padding: 0 10px 0 10px;
    justify-content: flex-start;
  }
}
</style>
