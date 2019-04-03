<template>
  <div class="browse flex column w100">
    <div class="main-banner">
      <div class="title-wrapper flex">
        <div class=""></div>
      </div>
      <img
        src="https://occ-0-56-55.1.nflxso.net/art/7de7c/a49a556b9b4348305115af131ff4bdda1787de7c.webp"
      />
    </div>
    <section>
      <Slider :slides="projectsSliderItems" title="Projects" />
    </section>
  </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Slider } from '@components';
import { ISlideItem } from '../../models';

@Component({
  components: {
    Slider,
  },
})
export default class Browse extends Vue {
  private projectsSliderItems: ISlideItem[] = [
    {
      id: 1,
      title: 'Test',
      image:
        'https://occ-0-56-55.1.nflxso.net/dnm/api/v6/0DW6CdE4gYtYx8iy3aj8gs9WtXE/AAAABTEnZtEJn5UXZnlLhTnE4ucqjMiOC_guqk69Hi7J6MIYAouwJGvVY8kpFjqVhkcwjm7kX9kluSIsPMTGzQntofPLis3fa0xc.jpg?r=dca',
      technos: ['Vue', 'Graphql', 'Typescript'],
      type: 'Project',
    },
    {
      id: 2,
      title: 'Test',
      image:
        'https://occ-0-56-55.1.nflxso.net/dnm/api/v6/0DW6CdE4gYtYx8iy3aj8gs9WtXE/AAAABTEnZtEJn5UXZnlLhTnE4ucqjMiOC_guqk69Hi7J6MIYAouwJGvVY8kpFjqVhkcwjm7kX9kluSIsPMTGzQntofPLis3fa0xc.jpg?r=dca',
      technos: ['Vue', 'Graphql', 'Typescript'],
      type: 'Project',
    },
    {
      id: 3,
      title: 'Test',
      image:
        'https://occ-0-56-55.1.nflxso.net/dnm/api/v6/0DW6CdE4gYtYx8iy3aj8gs9WtXE/AAAABTEnZtEJn5UXZnlLhTnE4ucqjMiOC_guqk69Hi7J6MIYAouwJGvVY8kpFjqVhkcwjm7kX9kluSIsPMTGzQntofPLis3fa0xc.jpg?r=dca',
      technos: ['Vue', 'Graphql', 'Typescript'],
      type: 'Project',
    },
    {
      id: 4,
      title: 'Test',
      image:
        'https://occ-0-56-55.1.nflxso.net/dnm/api/v6/0DW6CdE4gYtYx8iy3aj8gs9WtXE/AAAABTEnZtEJn5UXZnlLhTnE4ucqjMiOC_guqk69Hi7J6MIYAouwJGvVY8kpFjqVhkcwjm7kX9kluSIsPMTGzQntofPLis3fa0xc.jpg?r=dca',
      technos: ['Vue', 'Graphql', 'Typescript'],
      type: 'Project',
    },
    {
      id: 5,
      title: 'Test',
      image:
        'https://occ-0-56-55.1.nflxso.net/dnm/api/v6/0DW6CdE4gYtYx8iy3aj8gs9WtXE/AAAABTEnZtEJn5UXZnlLhTnE4ucqjMiOC_guqk69Hi7J6MIYAouwJGvVY8kpFjqVhkcwjm7kX9kluSIsPMTGzQntofPLis3fa0xc.jpg?r=dca',
      technos: ['Vue', 'Graphql', 'Typescript'],
      type: 'Project',
    },
  ];
}
</script>



<style lang="scss" scoped>
div.browse {
  div.main-banner {
    img {
      max-width: 100%;
      width: 100%;
      height: auto;
    }
  }
}
</style>
